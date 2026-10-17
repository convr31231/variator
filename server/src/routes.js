import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import rateLimit from 'express-rate-limit';
import { config } from './config.js';
import {
  assertMutationOrigin,
  clearSessionCookie,
  clientIp,
  COOKIE_NAME,
  getSessionUser,
  hasAdmin,
  login,
  logout,
  requireAuth,
  setSessionCookie,
} from './auth.js';
import { createBackupSync, listBackups } from './backup.js';
import { collectUploadRefs, validateContent } from './validate.js';
import { cleanupUnusedMedia, getContent, markMediaUsage, saveContent } from './db.js';
import { processUpload, safeUnlinkUpload, uploadMiddleware } from './upload.js';

function uploadLog(entry) {
  const line = JSON.stringify({ at: new Date().toISOString(), ...entry });
  try {
    fs.appendFileSync(path.join(config.dataDir, 'upload-diag.log'), `${line}\n`);
  } catch {
    /* журнал не должен срывать загрузку */
  }
}

function requestIdOf(req) {
  const raw = String(req.headers['x-request-id'] || '');
  return /^[A-Za-z0-9-]{8,80}$/.test(raw) ? raw : crypto.randomUUID();
}

function sendWhenBodyDone(req, res, status, payload) {
  const send = () => {
    if (!res.headersSent) res.status(status).json(payload);
  };
  if (req.complete || req.readableEnded) return send();
  req.resume();
  const timer = setTimeout(send, 20000);
  req.on('end', () => {
    clearTimeout(timer);
    send();
  });
  req.on('aborted', () => clearTimeout(timer));
}

function isLocalIp(ip) {
  const v = String(ip || '').replace(/^::ffff:/i, '');
  return v === '127.0.0.1' || v === '::1' || v === 'localhost';
}

export function createApiRouter() {
  const router = express.Router();

  // In-memory лимит: учитываем только неуспешные попытки (успешный вход не сжигает квоту).
  // Блокировка: 20 неудач / 15 минут на IP. Сброс локального IP — POST /api/auth/reset-login-limit с localhost.
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true,
    keyGenerator: (req) => clientIp(req),
    message: { ok: false, error: 'Слишком много попыток входа. Подождите и попробуйте снова.' },
  });

  const writeLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 120,
    standardHeaders: true,
    legacyHeaders: false,
    message: { ok: false, error: 'Слишком много запросов. Подождите немного.' },
  });

  router.get('/health', (_req, res) => {
    res.json({ ok: true });
  });

  router.get('/content', (_req, res) => {
    try {
      const { data, updatedAt } = getContent();
      res.set('Cache-Control', 'no-store');
      res.json({ ok: true, updatedAt, content: data });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message || 'Ошибка чтения данных' });
    }
  });

  router.get('/auth/status', (req, res) => {
    const user = getSessionUser(req.cookies?.[COOKIE_NAME]);
    res.json({
      ok: true,
      authenticated: !!user,
      username: user?.username || null,
      adminExists: hasAdmin(),
    });
  });

  router.post('/auth/login', loginLimiter, express.json({ limit: '32kb' }), async (req, res) => {
    const originCheck = assertMutationOrigin(req);
    if (!originCheck.ok) return res.status(403).json({ ok: false, error: originCheck.message });

    const result = await login(req.body?.username, req.body?.password, clientIp(req));
    if (!result.ok) return res.status(result.status).json({ ok: false, error: result.message });
    setSessionCookie(res, result.token);
    res.json({ ok: true, username: result.username });
  });

  // Сброс только локального лимита (127.0.0.1 / ::1). Защита для остальных IP не отключается.
  router.post('/auth/reset-login-limit', express.json({ limit: '4kb' }), async (req, res) => {
    const ip = clientIp(req);
    if (!isLocalIp(ip)) {
      return res.status(403).json({ ok: false, error: 'Сброс лимита доступен только с локального адреса' });
    }
    const targets = [ip, '127.0.0.1', '::1', ':ffff:127.0.0.1', '::ffff:127.0.0.1'];
    for (const key of new Set(targets)) {
      if (typeof loginLimiter.resetKey === 'function') {
        await loginLimiter.resetKey(key);
      }
    }
    const { getDb } = await import('./db.js');
    const db = getDb();
    for (const key of targets) {
      db.prepare('DELETE FROM login_attempts WHERE ip = ?').run(key);
    }
    res.json({ ok: true, clearedFor: 'local', ip });
  });

  router.post('/auth/logout', writeLimiter, (req, res) => {
    logout(req.cookies?.[COOKIE_NAME]);
    clearSessionCookie(res);
    res.json({ ok: true });
  });

  router.put('/content', writeLimiter, requireAuth, express.json({ limit: '2mb' }), (req, res) => {
    const originCheck = assertMutationOrigin(req);
    if (!originCheck.ok) return res.status(403).json({ ok: false, error: originCheck.message });

    try {
      const data = validateContent(req.body?.content ?? req.body);
      const updatedAt = saveContent(data);
      markMediaUsage(collectUploadRefs(data).filter((ref) => String(ref).startsWith('/uploads/')));
      cleanupUnusedMedia(safeUnlinkUpload);
      try {
        createBackupSync();
      } catch {
        /* бэкап не должен ломать сохранение */
      }
      res.json({ ok: true, updatedAt, content: data });
    } catch (e) {
      res.status(400).json({ ok: false, error: e.message || 'Ошибка сохранения' });
    }
  });

  router.post('/upload', writeLimiter, (req, res) => {
    const id = requestIdOf(req);
    res.setHeader('X-Request-Id', id);
    const contentLength = Number(req.headers['content-length']) || null;
    uploadLog({
      id,
      stage: 'start',
      bytes: contentLength,
      origin: req.headers.origin || '',
      originalBytes: Number(req.headers['x-original-bytes']) || null,
      hasCookie: Boolean(req.headers.cookie),
      multipart: String(req.headers['content-type'] || '').includes('multipart/form-data'),
      boundary: /boundary=/i.test(String(req.headers['content-type'] || '')),
    });
    req.on('aborted', () => uploadLog({ id, stage: 'aborted' }));
    res.on('finish', () => uploadLog({ id, stage: 'response', status: res.statusCode }));
    res.on('close', () => {
      if (!res.writableEnded) uploadLog({ id, stage: 'response-closed' });
    });

    uploadMiddleware(req, res, async (err) => {
      uploadLog({
        id,
        stage: 'body',
        bytes: req.file?.size || req.file?.buffer?.length || null,
        error: err ? err.code || 'upload-error' : '',
      });

      const originCheck = assertMutationOrigin(req);
      if (!originCheck.ok) {
        uploadLog({ id, stage: 'reject-origin' });
        return sendWhenBodyDone(req, res, 403, { ok: false, error: originCheck.message, requestId: id });
      }

      const user = getSessionUser(req.cookies?.[COOKIE_NAME]);
      if (!user) {
        uploadLog({ id, stage: 'reject-auth' });
        return sendWhenBodyDone(req, res, 401, {
          ok: false,
          error: 'Сессия истекла. Войдите в админ-панель снова.',
          requestId: id,
        });
      }

      if (err) {
        let status = 400;
        let msg = err.message || 'Ошибка загрузки';
        if (err.code === 'LIMIT_FILE_SIZE') {
          status = 413;
          msg = 'Файл слишком большой (макс. 8 МБ)';
        } else if (err.code === 'LIMIT_UNEXPECTED_FILE' || err.code === 'LIMIT_FILE_COUNT') {
          msg = 'Можно загрузить только один файл JPEG, PNG или WebP.';
        }
        uploadLog({ id, stage: 'reject-upload', status, error: err.code || 'upload-error' });
        return sendWhenBodyDone(req, res, status, { ok: false, error: msg, requestId: id });
      }

      try {
        uploadLog({ id, stage: 'process' });
        const file = await processUpload(req.file);
        uploadLog({ id, stage: 'process-done', width: file.width, height: file.height });
        res.json({ ok: true, file, requestId: id });
      } catch (e) {
        const status = e.status || 500;
        uploadLog({ id, stage: 'process-error', status, error: e.code || 'process-error' });
        if (!res.headersSent) {
          res.status(status).json({
            ok: false,
            error: e.message || 'Ошибка обработки файла',
            requestId: id,
          });
        }
      }
    });
  });

  router.post('/backup', writeLimiter, requireAuth, (req, res) => {
    const originCheck = assertMutationOrigin(req);
    if (!originCheck.ok) return res.status(403).json({ ok: false, error: originCheck.message });
    try {
      const backup = createBackupSync();
      res.json({ ok: true, backup: { id: backup.id } });
    } catch (e) {
      res.status(500).json({ ok: false, error: e.message || 'Не удалось создать копию' });
    }
  });

  router.get('/backups', requireAuth, (_req, res) => {
    res.json({ ok: true, backups: listBackups() });
  });

  return router;
}
