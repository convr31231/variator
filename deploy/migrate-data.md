# Перенос текущих данных и фото на сервер

Локальные данные лежат в каталоге `data/` (по умолчанию `DATA_DIR=../data` относительно `server/`):

- `data/site.db` (+ при работе могут быть `site.db-wal`, `site.db-shm`)
- `data/uploads/` — загруженные фото
- `data/backups/` — резервные копии (опционально)

Эти файлы **не** входят в Git. Их нужно скопировать на сервер в Docker-том `ftc_site_data`.

## Важно

1. **Не запускайте** пустой контейнер «поверх» продакшен-данных и не удаляйте том `ftc_site_data` при обновлении кода.
2. При первом деплое: либо скопируйте данные **до** первого старта приложения в том, либо сразу после первого старта **замените** созданный seed-файл своей БД (см. ниже).
3. Пароль администратора с локальной машины **не переносится** для заказчика: на сервере создайте отдельную учётную запись (`npm run create-admin`).

## Способ A — копирование в том Docker

На сервере, из каталога проекта:

```bash
# Поднять стек один раз (создаст том), затем остановить app
docker compose --env-file deploy/.env up -d
docker compose stop app

# Узнать путь к тому (или смонтировать через временный контейнер)
docker run --rm -v ftc_site_data:/data -v "$(pwd)/data_export:/import:ro" alpine \
  sh -c 'rm -f /data/site.db /data/site.db-wal /data/site.db-shm && \
         cp -a /import/site.db /data/ && \
         mkdir -p /data/uploads /data/backups && \
         cp -a /import/uploads/. /data/uploads/ && \
         chown -R 1000:1000 /data'

docker compose --env-file deploy/.env start app
```

Перед этим на рабочей машине подготовьте архив:

```bash
# Остановите локальный backend, чтобы WAL влился в site.db
cd server && npm run backup
# Скопируйте data/site.db и data/uploads в data_export/
```

Рекомендуется перед копированием выполнить `npm run backup` и/или остановить процесс Node, чтобы не копировать «рваный» WAL.

## Способ B — восстановление из backup-*

Локально:

```bash
cd server
npm run backup
```

Скопируйте каталог `data/backups/backup-…` на сервер и:

```bash
docker compose --env-file deploy/.env exec app node restore.mjs backup-YYYY-…
docker compose --env-file deploy/.env restart app
```

(файл бэкапа должен оказаться внутри `/data/backups/` тома).

## Проверка после переноса

- Откройте сайт — контакты FTC, цены, фото.
- Откройте `/admin/` — создайте администратора заказчика, если ещё не создан.
- Убедитесь, что загрузки новых фото появляются в `/uploads/…` и переживают `docker compose restart`.
