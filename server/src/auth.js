import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import { config } from './config.js';
import { getDb } from './db.js';

const COOKIE_NAME = 'admin_session';
const MAX_FAILS = 8;
const WINDOW_MS = 15 * 60 * 1000;
const LOCK_MS = 15 * 60 * 1000;

export { COOKIE_NAME };

function now() {
  return Date.now();
}

export function getAdmin() {
  return getDb().prepare('SELECT id, username, password_hash, created_at FROM admin_users WHERE id = 1').get();
}

export function hasAdmin() {
  return !!getAdmin();
}

export async function createAdmin(username, password) {
  if (hasAdmin()) {
    throw new Error('Администратор уже создан. Смена пароля — через create-admin.mjs с флагом --reset.');
  }
  const u = String(username || '').trim();
  if (u.length < 3 || u.length > 64) throw new Error('Логин: от 3 до 64 символов');
  if (String(password || '').length < 10) throw new Error('Пароль: минимум 10 символов');
  const hash = await bcrypt.hash(password, 12);
  const ts = new Date().toISOString();
  getDb()
    .prepare(
      `INSERT INTO admin_users (id, username, password_hash, created_at, updated_at)
       VALUES (1, ?, ?, ?, ?)`,
    )
    .run(u, hash, ts, ts);
}

export async function resetAdminPassword(password) {
  const admin = getAdmin();
  if (!admin) throw new Error('Администратор ещё не создан');
  if (String(password || '').length < 10) throw new Error('Пароль: минимум 10 символов');
  const hash = await bcrypt.hash(password, 12);
  getDb()
    .prepare('UPDATE admin_users SET password_hash = ?, updated_at = ? WHERE id = 1')
    .run(hash, new Date().toISOString());
}

function checkLoginThrottle(ip) {
  const database = getDb();
  const row = database.prepare('SELECT * FROM login_attempts WHERE ip = ?').get(ip);
  const t = now();
  if (!row) return { ok: true };
  if (row.locked_until && row.locked_until > t) {
    const mins = Math.ceil((row.locked_until - t) / 60000);
    return { ok: false, message: `Слишком много попыток. Повторите через ${mins} мин.` };
  }
  if (t - row.window_start > WINDOW_MS) {
    database.prepare('DELETE FROM login_attempts WHERE ip = ?').run(ip);
  }
  return { ok: true };
}

function registerFail(ip) {
  const database = getDb();
  const t = now();
  const row = database.prepare('SELECT * FROM login_attempts WHERE ip = ?').get(ip);
  if (!row || t - row.window_start > WINDOW_MS) {
    database.prepare('DELETE FROM login_attempts WHERE ip = ?').run(ip);
    database
      .prepare('INSERT INTO login_attempts (ip, fails, window_start, locked_until) VALUES (?, 1, ?, 0)')
      .run(ip, t);
    return;
  }
  const fails = row.fails + 1;
  const locked = fails >= MAX_FAILS ? t + LOCK_MS : 0;
  database
    .prepare('UPDATE login_attempts SET fails = ?, locked_until = ? WHERE ip = ?')
    .run(fails, locked, ip);
}

function clearFails(ip) {
  getDb().prepare('DELETE FROM login_attempts WHERE ip = ?').run(ip);
}

export async function login(username, password, ip) {
  const throttle = checkLoginThrottle(ip);
  if (!throttle.ok) return { ok: false, status: 429, message: throttle.message };

  const admin = getAdmin();
  if (!admin) {
    return {
      ok: false,
      status: 503,
      message: 'Администратор ещё не создан. Запустите: npm run create-admin',
    };
  }

  const userOk = admin.username === String(username || '').trim();
  const passOk = userOk && (await bcrypt.compare(String(password || ''), admin.password_hash));
  if (!passOk) {
    registerFail(ip);
    return { ok: false, status: 401, message: 'Неверный логин или пароль' };
  }

  clearFails(ip);
  purgeExpiredSessions();
  const token = crypto.randomBytes(32).toString('hex');
  const expires = now() + config.sessionTtlMs;
  getDb()
    .prepare('INSERT INTO sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)')
    .run(token, admin.id, expires, new Date().toISOString());

  return { ok: true, token, expires, username: admin.username };
}

export function logout(token) {
  if (!token) return;
  getDb().prepare('DELETE FROM sessions WHERE token = ?').run(token);
}

export function purgeExpiredSessions() {
  getDb().prepare('DELETE FROM sessions WHERE expires_at < ?').run(now());
}

export function getSessionUser(token) {
  if (!token) return null;
  purgeExpiredSessions();
  const row = getDb()
    .prepare(
      `SELECT s.token, s.expires_at, u.id, u.username
       FROM sessions s JOIN admin_users u ON u.id = s.user_id
       WHERE s.token = ? AND s.expires_at > ?`,
    )
    .get(token, now());
  return row || null;
}

export function setSessionCookie(res, token) {
  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.cookieSecure,
    path: '/',
    maxAge: config.sessionTtlMs,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: config.cookieSecure,
    path: '/',
  });
}

export function clientIp(req) {
  const xf = req.headers['x-forwarded-for'];
  if (typeof xf === 'string' && xf.length) return xf.split(',')[0].trim();
  return req.socket?.remoteAddress || 'unknown';
}

export function requireAuth(req, res, next) {
  const user = getSessionUser(req.cookies?.[COOKIE_NAME]);
  if (!user) {
    return res.status(401).json({ ok: false, error: 'Требуется вход в админ-панель' });
  }
  req.admin = user;
  next();
}

export function assertMutationOrigin(req) {
  const origin = req.headers.origin || '';
  const referer = req.headers.referer || '';
  if (!origin && !referer) {
    // same-origin form/fetch from file:// won't work; require Origin or Referer for cookie auth
    return { ok: false, message: 'Запрос отклонён: отсутствует Origin/Referer' };
  }
  const allowed = config.allowedOrigins;
  if (origin && !allowed.includes(origin)) {
    return { ok: false, message: 'Запрос отклонён: недопустимый Origin' };
  }
  if (!origin && referer) {
    try {
      const refOrigin = new URL(referer).origin;
      if (!allowed.includes(refOrigin)) {
        return { ok: false, message: 'Запрос отклонён: недопустимый Referer' };
      }
    } catch {
      return { ok: false, message: 'Запрос отклонён: некорректный Referer' };
    }
  }
  return { ok: true };
}
