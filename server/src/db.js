import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { config } from './config.js';
import { buildSeedContent } from './seed.js';

let db;

export function getDb() {
  if (!db) throw new Error('База данных не инициализирована');
  return db;
}

export function initDb() {
  fs.mkdirSync(config.dataDir, { recursive: true });
  fs.mkdirSync(config.uploadsDir, { recursive: true });
  fs.mkdirSync(path.join(config.uploadsDir, 'thumbs'), { recursive: true });
  fs.mkdirSync(config.backupsDir, { recursive: true });

  db = new DatabaseSync(config.dbPath);
  db.exec(`
    PRAGMA journal_mode = WAL;
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      token TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES admin_users(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS login_attempts (
      ip TEXT PRIMARY KEY,
      fails INTEGER NOT NULL DEFAULT 0,
      window_start INTEGER NOT NULL,
      locked_until INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      payload TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS media (
      id TEXT PRIMARY KEY,
      filename TEXT NOT NULL,
      thumb_filename TEXT,
      mime TEXT NOT NULL,
      width INTEGER,
      height INTEGER,
      bytes INTEGER,
      created_at TEXT NOT NULL,
      in_use INTEGER NOT NULL DEFAULT 1
    );
  `);

  const row = db.prepare('SELECT payload FROM content WHERE id = 1').get();
  if (!row) {
    const seed = buildSeedContent();
    const now = new Date().toISOString();
    db.prepare('INSERT INTO content (id, payload, updated_at) VALUES (1, ?, ?)').run(
      JSON.stringify(seed),
      now,
    );
    db.prepare(
      "INSERT INTO meta (key, value) VALUES ('seeded_from', 'js/data.js'), ('seeded_at', ?)",
    ).run(now);
  }

  return db;
}

export function getContent() {
  const row = getDb().prepare('SELECT payload, updated_at FROM content WHERE id = 1').get();
  if (!row) throw new Error('Контент не найден');
  return { data: JSON.parse(row.payload), updatedAt: row.updated_at };
}

export function saveContent(data) {
  const now = new Date().toISOString();
  getDb()
    .prepare('UPDATE content SET payload = ?, updated_at = ? WHERE id = 1')
    .run(JSON.stringify(data), now);
  return now;
}

export function registerMedia(meta) {
  getDb()
    .prepare(
      `INSERT INTO media (id, filename, thumb_filename, mime, width, height, bytes, created_at, in_use)
       VALUES (@id, @filename, @thumb_filename, @mime, @width, @height, @bytes, @created_at, 1)`,
    )
    .run(meta);
}

export function markMediaUsage(filenames) {
  const database = getDb();
  database.prepare('UPDATE media SET in_use = 0').run();
  const stmt = database.prepare('UPDATE media SET in_use = 1 WHERE filename = ? OR thumb_filename = ?');
  for (const name of filenames) {
    if (!name) continue;
    const base = String(name).replace(/^\/uploads\//, '').replace(/^uploads\//, '');
    if (!base || base.includes('..')) continue;
    stmt.run(base, base);
  }
}

export function cleanupUnusedMedia(unlinkFn) {
  const database = getDb();
  const rows = database.prepare('SELECT id, filename, thumb_filename FROM media WHERE in_use = 0').all();
  const del = database.prepare('DELETE FROM media WHERE id = ?');
  for (const row of rows) {
    if (typeof unlinkFn === 'function') {
      unlinkFn(`/uploads/${row.filename}`);
      if (row.thumb_filename) unlinkFn(`/uploads/${row.thumb_filename}`);
    }
    del.run(row.id);
  }
  return rows.length;
}
