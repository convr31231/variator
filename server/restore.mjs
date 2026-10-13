import { restoreBackup, listBackups } from './src/backup.js';

const id = process.argv[2];
if (!id) {
  console.log('Использование: node restore.mjs <backup-id>');
  console.log('Доступные копии:', listBackups().join('\n') || '(нет)');
  process.exit(1);
}

try {
  const result = restoreBackup(id);
  console.log('Восстановлено из', result.id);
  console.log('Перезапустите backend: npm start');
} catch (e) {
  console.error(e.message || e);
  process.exit(1);
}
