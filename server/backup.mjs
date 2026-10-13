import { initDb } from './src/db.js';
import { createBackupSync, listBackups } from './src/backup.js';

initDb();
const result = createBackupSync();
console.log('Создана резервная копия:', result.id);
console.log('Путь:', result.dir);
console.log('Доступные копии:\n' + (listBackups().join('\n') || 'нет'));
