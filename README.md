# FTC — ремонт вариаторов, АКПП и продажа автозапчастей (Владивосток)

Публичный сайт (HTML/CSS/JS) + backend (Node.js 22+, Express, SQLite `node:sqlite`) + админ-панель `/admin/`.

## Локальный запуск

```bash
cd server
npm install
copy .env.example .env   # Windows; Linux/macOS: cp .env.example .env
npm run create-admin -- --username admin --password "ВашПарольНеМенее10"
npm start
```

- Сайт: http://127.0.0.1:8780/
- Админка: http://127.0.0.1:8780/admin/

Исходные контакты и тексты — в `js/data.js` (fallback). Рабочие данные — в `data/` (не в Git).

---

## Загрузка кода в GitHub

Remote уже может быть настроен. Проверка:

```bash
git remote -v
git status
```

Если remote есть — закоммитьте код **без** `data/`, `.env`, паролей и `node_modules`, затем:

```bash
git push -u origin main
```

Если remote нет — создайте **приватный** репозиторий на GitHub (через сайт или `gh repo create --private`), затем:

```bash
git remote add origin https://github.com/<org-or-user>/<repo>.git
git push -u origin main
```

Не публикуйте `server/.env`, `deploy/.env`, `data/site.db*`, `data/uploads`, `data/backups`, `server/.admin-local-password.txt`.

---

## Размещение на сервере (Docker + Caddy HTTPS)

Стек: контейнер `app` (сайт + API) и `caddy` (порты 80/443, автоматический HTTPS). Backend **не** публикуется на хост — только через reverse proxy.

### Что нужно от сервера / заказчика

| Сведение | Зачем |
|----------|--------|
| Домен (A/AAAA → сервер) | HTTPS и `SITE_ADDRESS` |
| Email для Let's Encrypt | `ACME_EMAIL` |
| Публичный URL `https://…` | `ALLOWED_ORIGINS`, проверка с телефона |
| SSH-доступ к серверу с Docker + Compose | деплой |
| Постоянный диск | том `ftc_site_data` |

### Шаги

1. Клонировать репозиторий на сервер.
2. Подготовить окружение:

```bash
cp deploy/.env.example deploy/.env
# Заполнить SITE_ADDRESS, ACME_EMAIL, ALLOWED_ORIGINS=https://ваш-домен,
# SESSION_SECRET (длинная случайная строка), COOKIE_SECURE=true
```

3. Собрать и запустить (автоперезапуск `restart: unless-stopped`):

```bash
docker compose --env-file deploy/.env up -d --build
```

4. **Перенести данные и фото** с рабочей машины — см. [deploy/migrate-data.md](deploy/migrate-data.md).  
   Не удаляйте том `ftc_site_data` при обновлении кода, иначе потеряете БД и загрузки.

5. Создать администратора **заказчика** (новый пароль, не из локальной разработки):

```bash
docker compose --env-file deploy/.env exec app npm run create-admin -- --username admin --password "НадёжныйПарольЗаказчика"
```

Смена пароля позже:

```bash
docker compose --env-file deploy/.env exec app npm run create-admin -- --reset --password "НовыйПароль"
```

6. Проверить с другого устройства:
   - https://ваш-домен/ — контакты, карта, цены;
   - https://ваш-домен/admin/ — вход формой, сохранение, загрузка фото.

### Обновление кода без потери данных

```bash
git pull
docker compose --env-file deploy/.env up -d --build
# том site_data не трогать
```

### Резервное копирование

В контейнере:

```bash
docker compose --env-file deploy/.env exec app npm run backup
```

Копии: `/data/backups/backup-…` внутри тома. Восстановление: `node restore.mjs backup-…` (см. `server/restore.mjs`) и перезапуск `app`.

Дополнительно копируйте том `ftc_site_data` средствами хостинга.

---

## Структура данных (фактические пути)

| Назначение | Локально | В Docker |
|------------|----------|----------|
| Корень сайта | репозиторий | `/app` |
| Backend | `server/` | `/app/server` |
| SQLite | `data/site.db` | `/data/site.db` |
| Фото | `data/uploads/` | `/data/uploads/` |
| Бэкапы | `data/backups/` | `/data/backups/` |

Переменная: `DATA_DIR` (локально `../data`, в compose `/data`).

---

## Пересборка HTML-страниц (только шаблоны)

```bash
node scripts/build-pages.mjs
```

Правки контента в админке **не** требуют этой команды.

---

## Безопасность (кратко)

- Публичное чтение `/api/content`; запись и upload — после входа.
- Пароль — bcrypt; сессия — HttpOnly cookie; за HTTPS — `COOKIE_SECURE=true`.
- `ALLOWED_ORIGINS` должен совпадать с URL сайта.
- Express: `trust proxy` включён для корректных IP и proto за Caddy.
