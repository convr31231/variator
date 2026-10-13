import readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { initDb } from './src/db.js';
import { createAdmin, hasAdmin, resetAdminPassword, getAdmin } from './src/auth.js';

function parseArgs(argv) {
  const out = { reset: false, username: '', password: '' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--reset') out.reset = true;
    else if (a === '--username') out.username = argv[++i] || '';
    else if (a === '--password') out.password = argv[++i] || '';
  }
  return out;
}

async function ask(rl, q, { silent = false } = {}) {
  if (!silent) return (await rl.question(q)).trim();
  // Без эха пароля в консоли Windows readline не скрывает ввод надёжно —
  // для неинтерактивного режима используйте --password.
  output.write(q);
  return (await rl.question('')).trim();
}

async function main() {
  initDb();
  const args = parseArgs(process.argv);
  const rl = readline.createInterface({ input, output });

  try {
    if (args.reset) {
      if (!hasAdmin()) {
        console.error('Администратор ещё не создан. Запустите без --reset.');
        process.exitCode = 1;
        return;
      }
      const password = args.password || (await ask(rl, 'Новый пароль (мин. 10 символов): '));
      await resetAdminPassword(password);
      console.log(`Пароль обновлён для пользователя «${getAdmin().username}».`);
      return;
    }

    if (hasAdmin()) {
      console.error('Администратор уже существует. Для смены пароля: npm run create-admin -- --reset');
      process.exitCode = 1;
      return;
    }

    const username = args.username || (await ask(rl, 'Логин администратора: '));
    const password = args.password || (await ask(rl, 'Пароль (мин. 10 символов): '));
    const password2 = args.password || (await ask(rl, 'Повторите пароль: '));
    if (password !== password2) {
      console.error('Пароли не совпадают.');
      process.exitCode = 1;
      return;
    }
    await createAdmin(username, password);
    console.log(`Администратор «${username}» создан. Откройте /admin/ и войдите.`);
  } catch (e) {
    console.error(e.message || e);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
}

main();
