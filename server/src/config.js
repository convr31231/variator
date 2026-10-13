import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const serverRoot = path.resolve(__dirname, '..');
const siteRoot = path.resolve(serverRoot, '..');

dotenv.config({ path: path.join(serverRoot, '.env') });

function bool(v, fallback = false) {
  if (v == null || v === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(String(v).toLowerCase());
}

const dataDir = path.resolve(serverRoot, process.env.DATA_DIR || '../data');

export const config = {
  port: Number(process.env.PORT || 8780),
  host: process.env.HOST || '0.0.0.0',
  siteRoot,
  serverRoot,
  dataDir,
  dbPath: path.join(dataDir, 'site.db'),
  uploadsDir: path.join(dataDir, 'uploads'),
  backupsDir: path.join(dataDir, 'backups'),
  sessionSecret: process.env.SESSION_SECRET || '',
  cookieSecure: bool(process.env.COOKIE_SECURE, false),
  allowedOrigins: String(process.env.ALLOWED_ORIGINS || 'http://localhost:8780,http://127.0.0.1:8780')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean),
  uploadMaxBytes: Number(process.env.UPLOAD_MAX_BYTES || 8 * 1024 * 1024),
  sessionTtlMs: 7 * 24 * 60 * 60 * 1000,
  maxImageDimension: 2000,
  thumbSize: 480,
};
