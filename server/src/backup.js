import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';
import { getDb } from './db.js';

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const name of fs.readdirSync(src)) {
      copyRecursive(path.join(src, name), path.join(dest, name));
    }
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

export function createBackupSync() {
  fs.mkdirSync(config.backupsDir, { recursive: true });
  const id = `backup-${stamp()}`;
  const dir = path.join(config.backupsDir, id);
  fs.mkdirSync(dir, { recursive: true });

  const dbCopy = path.join(dir, 'site.db');
  if (fs.existsSync(config.dbPath)) {
    try {
      const database = getDb();
      database.exec('PRAGMA wal_checkpoint(FULL)');
    } catch {
      /* DB may be closed in CLI scripts */
    }
    fs.copyFileSync(config.dbPath, dbCopy);
    for (const suffix of ['-wal', '-shm']) {
      const p = config.dbPath + suffix;
      if (fs.existsSync(p)) fs.copyFileSync(p, path.join(dir, `site.db${suffix}`));
    }
  }

  copyRecursive(config.uploadsDir, path.join(dir, 'uploads'));
  fs.writeFileSync(
    path.join(dir, 'manifest.json'),
    JSON.stringify({ id, createdAt: new Date().toISOString() }, null, 2),
    'utf8',
  );
  return { id, dir };
}

export function restoreBackup(backupId) {
  const safe = String(backupId || '');
  if (!/^backup-[\w.-]+$/.test(safe)) throw new Error('Некорректный идентификатор копии');
  const dir = path.join(config.backupsDir, safe);
  if (!fs.existsSync(dir)) throw new Error('Резервная копия не найдена');
  const dbSrc = path.join(dir, 'site.db');
  if (!fs.existsSync(dbSrc)) throw new Error('В копии нет site.db');

  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.copyFileSync(dbSrc, config.dbPath);

  const uploadsSrc = path.join(dir, 'uploads');
  if (fs.existsSync(uploadsSrc)) {
    fs.rmSync(config.uploadsDir, { recursive: true, force: true });
    copyRecursive(uploadsSrc, config.uploadsDir);
  }
  return { ok: true, id: safe };
}

export function listBackups() {
  if (!fs.existsSync(config.backupsDir)) return [];
  return fs
    .readdirSync(config.backupsDir)
    .filter((name) => fs.existsSync(path.join(config.backupsDir, name, 'manifest.json')))
    .sort()
    .reverse();
}
