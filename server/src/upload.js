import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import multer from 'multer';
import sharp from 'sharp';
import fileType from 'file-type';
import { config } from './config.js';
import { registerMedia } from './db.js';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

export const uploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: config.uploadMaxBytes, files: 1 },
  fileFilter(_req, file, cb) {
    const name = String(file.originalname || '').toLowerCase();
    if (name.endsWith('.svg') || name.endsWith('.svgz')) {
      return cb(new Error('SVG запрещён. Загрузите JPEG, PNG или WebP.'));
    }
    if (/\.(exe|js|mjs|html|htm|php|sh|bat|cmd|dll|com)$/i.test(name)) {
      return cb(new Error('Этот тип файла запрещён.'));
    }
    cb(null, true);
  },
}).single('photo');

export async function processUpload(file) {
  if (!file?.buffer?.length) {
    throw Object.assign(new Error('Файл не получен'), { status: 400 });
  }

  const detected = await fileType.fromBuffer(file.buffer);
  if (!detected || !ALLOWED.has(detected.mime)) {
    throw Object.assign(
      new Error('Поддерживаются только JPEG, PNG и WebP. SVG и исполняемые файлы запрещены.'),
      { status: 400 },
    );
  }

  let image;
  try {
    image = sharp(file.buffer, {
      failOn: 'error',
      limitInputPixels: config.maxImageDimension * config.maxImageDimension,
    }).rotate();
  } catch (e) {
    const tooBig = /pixel limit|too large/i.test(String(e?.message || ''));
    throw Object.assign(
      new Error(tooBig ? 'Изображение слишком большое (макс. 2000×2000)' : 'Не удалось прочитать изображение'),
      { status: 400 },
    );
  }

  const meta = await image.metadata();
  if (!meta.width || !meta.height) {
    throw Object.assign(new Error('Некорректные размеры изображения'), { status: 400 });
  }
  if (meta.width > 8000 || meta.height > 8000) {
    throw Object.assign(new Error('Изображение слишком большое (макс. 8000×8000)'), { status: 400 });
  }

  const id = crypto.randomUUID();
  const filename = `${id}.webp`;
  const thumbName = `${id}.webp`;
  const outPath = path.join(config.uploadsDir, filename);
  const thumbPath = path.join(config.uploadsDir, 'thumbs', thumbName);

  const optimized = await image
    .clone()
    .resize({
      width: config.maxImageDimension,
      height: config.maxImageDimension,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 82 })
    .toBuffer({ resolveWithObject: true });

  const thumb = await sharp(optimized.data)
    .resize({
      width: config.thumbSize,
      height: config.thumbSize,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: 75 })
    .toBuffer();

  fs.writeFileSync(outPath, optimized.data);
  fs.writeFileSync(thumbPath, thumb);

  registerMedia({
    id,
    filename,
    thumb_filename: `thumbs/${thumbName}`,
    mime: 'image/webp',
    width: optimized.info.width,
    height: optimized.info.height,
    bytes: optimized.data.length,
    created_at: new Date().toISOString(),
  });

  return {
    id,
    src: `/uploads/${filename}`,
    thumb: `/uploads/thumbs/${thumbName}`,
    width: optimized.info.width,
    height: optimized.info.height,
    mime: 'image/webp',
  };
}

export function safeUnlinkUpload(relPath) {
  if (!relPath || typeof relPath !== 'string') return;
  if (!relPath.startsWith('/uploads/')) return;
  const base = relPath.replace(/^\/uploads\//, '');
  if (base.includes('..') || path.isAbsolute(base)) return;
  const full = path.join(config.uploadsDir, base);
  if (!full.startsWith(config.uploadsDir)) return;
  try {
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch {
    /* ignore */
  }
}
