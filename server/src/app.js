import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { config } from './config.js';
import { createApiRouter } from './routes.js';

export function createApp() {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(cookieParser(config.sessionSecret || undefined));

  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    next();
  });

  app.use('/api', createApiRouter());

  app.use(
    '/uploads',
    express.static(config.uploadsDir, {
      fallthrough: false,
      setHeaders(res) {
        res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        res.setHeader('X-Content-Type-Options', 'nosniff');
      },
    }),
  );

  app.use(
    '/admin',
    express.static(path.join(config.siteRoot, 'admin'), {
      index: 'index.html',
      extensions: ['html'],
      setHeaders(res, filePath) {
        if (/\.(html|js|css)$/i.test(filePath)) res.setHeader('Cache-Control', 'no-cache');
      },
    }),
  );

  app.use(
    express.static(config.siteRoot, {
      extensions: ['html'],
      setHeaders(res, filePath) {
        if (filePath.endsWith('.html')) res.setHeader('Cache-Control', 'no-cache');
      },
    }),
  );

  app.use((err, _req, res, _next) => {
    if (err?.type === 'entity.parse.failed' || err instanceof SyntaxError) {
      return res.status(400).json({ ok: false, error: 'Некорректный JSON в запросе' });
    }
    console.error(err);
    if (res.headersSent) return;
    res.status(err.status || 500).json({ ok: false, error: err.message || 'Внутренняя ошибка сервера' });
  });

  return app;
}
