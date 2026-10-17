import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';
import { initDb } from './db.js';
import { hasAdmin } from './auth.js';
import { createApp } from './app.js';

function ensureEnv() {
  const envPath = path.join(config.serverRoot, '.env');
  const example = path.join(config.serverRoot, '.env.example');
  if (!fs.existsSync(envPath) && fs.existsSync(example)) {
    fs.copyFileSync(example, envPath);
    console.log('Создан server/.env из .env.example — смените SESSION_SECRET перед продакшеном.');
  }
  if (!config.sessionSecret || config.sessionSecret.includes('замените')) {
    console.warn('Внимание: задайте уникальный SESSION_SECRET в server/.env');
  }
}

ensureEnv();
initDb();

const app = createApp();
const server = app.listen(config.port, config.host, () => {
  console.log(`Сайт:     http://127.0.0.1:${config.port}/`);
  console.log(`Админка:  http://127.0.0.1:${config.port}/admin/`);
  console.log(`Данные:   ${config.dataDir}`);
  if (!hasAdmin()) {
    console.log('Администратор не создан. Выполните: cd server && npm run create-admin');
  }
});
server.requestTimeout = 0;
server.headersTimeout = 120000;
server.keepAliveTimeout = 75000;

process.on('uncaughtException', (error) => {
  try {
    fs.appendFileSync(
      path.join(config.dataDir, 'upload-diag.log'),
      `${JSON.stringify({ at: new Date().toISOString(), stage: 'uncaught', error: error?.code || 'uncaught' })}\n`,
    );
  } catch {
    /* ignore */
  }
  process.exit(1);
});
