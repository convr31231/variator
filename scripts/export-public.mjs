/**
 * Экспорт публичного содержимого из SQLite в статику для GitHub Pages.
 * Не читает заявки, пользователей, сессии и резервные копии.
 * GitHub Pages публикует файлы ветки main, без Node и без этой базы.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dbPath = path.join(root, 'data', 'site.db');
const uploadsDir = path.join(root, 'data', 'uploads');
const outDir = path.join(root, 'images', 'published');
const dataFile = path.join(root, 'js', 'data.js');

const db = new DatabaseSync(dbPath, { readOnly: true });
const row = db.prepare('SELECT payload FROM content WHERE id = 1').get();
if (!row) throw new Error('В базе нет публичного контента');
const content = JSON.parse(row.payload);

const copied = [];

function safeUploadName(rel) {
  const base = rel.replace(/^\/+/, '').replace(/^uploads\//, '');
  if (!base || base.includes('..') || path.isAbsolute(base)) return null;
  return base;
}

function copyPublicImage(url) {
  const value = String(url || '').trim();
  if (!value || /^(https?:|data:|mailto:|tel:)/i.test(value)) return value;
  if (/localhost|127\.0\.0\.1|trycloudflare/i.test(value)) {
    throw new Error(`В публичных данных запрещённый адрес: ${value}`);
  }
  let source = null;
  if (value.startsWith('/uploads/') || value.startsWith('uploads/')) {
    const rel = safeUploadName(value);
    if (!rel) throw new Error(`Некорректный путь изображения: ${value}`);
    source = path.join(uploadsDir, rel);
  } else if (value.startsWith('images/') || value.startsWith('/images/')) {
    const rel = value.replace(/^\//, '');
    if (rel.includes('..')) throw new Error(`Некорректный путь изображения: ${value}`);
    source = path.join(root, rel);
  } else {
    return value;
  }
  if (!source.startsWith(uploadsDir) && !source.startsWith(path.join(root, 'images'))) {
    throw new Error(`Изображение вне разрешённых каталогов: ${value}`);
  }
  if (!fs.existsSync(source)) throw new Error(`Не найдено публичное изображение: ${value}`);
  const flat = value.replace(/^\//, '').replace(/[\\/]/g, '-');
  fs.mkdirSync(outDir, { recursive: true });
  const dest = path.join(outDir, flat);
  fs.copyFileSync(source, dest);
  copied.push(flat);
  return `images/published/${flat}`;
}

function walk(node) {
  if (Array.isArray(node)) return node.map(walk);
  if (!node || typeof node !== 'object') return node;
  const out = {};
  for (const [key, value] of Object.entries(node)) {
    if (typeof value === 'string' && /^(images\/|\/images\/|uploads\/|\/uploads\/)/.test(value)) {
      out[key] = copyPublicImage(value);
    } else {
      out[key] = walk(value);
    }
  }
  return out;
}

const published = walk(content);
const blob = JSON.stringify(published);
if (/localhost|127\.0\.0\.1|trycloudflare/i.test(blob)) {
  throw new Error('Экспорт содержит локальный или туннельный адрес');
}

const js = `/**\n * Публичные данные сайта. Сгенерировано scripts/export-public.mjs из таблицы content.\n * Заявки, пользователи и сессии сюда не входят.\n */\nwindow.BUSINESS = ${JSON.stringify(published, null, 2)};\n`;
fs.writeFileSync(dataFile, js);
console.log(JSON.stringify({
  address: published.address,
  maxSet: Boolean(published.messengers?.max),
  images: copied,
  brands: (published.brands || []).map((b) => b.href),
}, null, 2));
