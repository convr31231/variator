import express from 'express';
import rateLimit from 'express-rate-limit';
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

  router.post('/upload', writeLimiter, requireAuth, (req, res) => {
    const originCheck = assertMutationOrigin(req);
    if (!originCheck.ok) return res.status(403).json({ ok: false, error: originCheck.message });

    uploadMiddleware(req, res, async (err) => {
      if (err) {
        const msg =
          err.code === 'LIMIT_FILE_SIZE'
            ? 'Файл слишком большой (макс. 8 МБ)'
            : err.message || 'Ошибка загрузки';
        return res.status(400).json({ ok: false, error: msg });
      }
      try {
        const file = await processUpload(req.file);
        res.json({ ok: true, file });
      } catch (e) {
        res.status(e.status || 400).json({ ok: false, error: e.message || 'Ошибка обработки файла' });
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
