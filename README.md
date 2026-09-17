# ВариСервис — сайт ремонта вариаторов (Владивосток)

Многостраничный продающий сайт на React + Vite + TypeScript.

## Запуск

```bash
npm install
npm run dev
```

Сборка:

```bash
npm run build
npm run preview
```

## Что заменить перед продакшеном

1. `src/data/site.ts` — название, телефон, адрес, часы, координаты, мессенджеры, baseUrl
2. `src/data/content.ts` — цены и преимущества (уберите плейсхолдеры в скобках)
3. `src/data/cases.ts` — реальные кейсы (`published: true`)
4. `src/data/reviews.ts` — реальные отзывы и ссылки на площадки
5. `public/robots.txt` и `public/sitemap.xml` — домен вместо `example.ru`
6. Аналитика: ID в `siteConfig.analytics`

## Структура

- `src/components` — блоки UI
- `src/pages` — SEO-страницы
- `src/data` — контент и конфиг
- `public` — robots, sitemap, favicon, OG
