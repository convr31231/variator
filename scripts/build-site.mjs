import fs from 'fs';
import path from 'path';

// Ensure data is built
await import('./build-data.mjs');

const icon = {
  phone: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.81.36 1.6.7 2.34a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.74.34 1.53.57 2.34.7A2 2 0 0 1 22 16.92z"/></svg>`,
  menu: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>`,
  arrow: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M13 5l7 7-7 7"/></svg>`,
  msg: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
  send: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>`,
  pin: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  clock: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>`,
  mail: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>`,
  ext: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><path d="M15 3h6v6M10 14 21 3"/></svg>`,
  check: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>`,
  wrench: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
  shield: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>`,
  clip: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/><rect x="9" y="3" width="6" height="4" rx="1"/></svg>`,
  cam: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>`,
  cal: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="m9 16 2 2 4-4"/></svg>`,
  up: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M7 17 17 7M7 7h10v10"/></svg>`,
};

function depthPrefix(filePath) {
  const depth = filePath.split(/[/\\]/).length - 1;
  return depth ? '../'.repeat(depth) : '';
}

function shell(filePath, { title, description, canonical, body, active = '', jsonLd = '' }) {
  const p = depthPrefix(filePath);
  const year = new Date().getFullYear();
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://example.ru/images/hero/hero.png">
  <meta property="og:locale" content="ru_RU">
  <meta name="theme-color" content="#08090b">
  <link rel="icon" href="${p}images/icons/favicon.svg" type="image/svg+xml">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Unbounded:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${p}css/style.css">
  <link rel="stylesheet" href="${p}css/responsive.css">
  ${jsonLd}
</head>
<body>
  <div id="site-root" data-base="${p}" data-active="${active}">
  ${body}
  </div>
  <script src="${p}js/data.js"></script>
  <script src="${p}js/menu.js"></script>
  <script src="${p}js/modal.js"></script>
  <script src="${p}js/faq.js"></script>
  <script src="${p}js/form.js"></script>
  <script src="${p}js/gallery.js"></script>
  <script src="${p}js/main.js"></script>
</body>
</html>`;
}

const homeBody = `
<header class="header" data-header>
  <div class="container header__inner">
    <a href="INDEX" class="header__logo" data-logo>
      <span class="header__logo-mark" aria-hidden="true"></span>
      <span class="header__logo-text"><strong data-bind="shortName"></strong><small>Владивосток</small></span>
    </a>
    <nav class="header__nav" aria-label="Основная навигация" data-nav></nav>
    <div class="header__actions">
      <a class="header__phone" data-bind-href="phoneHref" href="#"><span data-phone-icon>${icon.phone}</span><span data-bind="phone"></span></a>
      <a href="kontakty.html#zapis" class="btn btn--primary header__cta">Записаться</a>
      <button type="button" class="header__burger" aria-label="Открыть меню" aria-expanded="false" data-burger>${icon.menu}</button>
    </div>
  </div>
  <div class="header__drawer" data-drawer>
    <nav class="header__drawer-nav" aria-label="Мобильная навигация" data-nav-mobile></nav>
    <div class="header__drawer-actions">
      <a class="btn btn--ghost btn--block" data-bind-href="phoneHref" href="#"><span data-bind="phone"></span></a>
      <a href="kontakty.html#zapis" class="btn btn--primary btn--block">Записаться</a>
    </div>
  </div>
</header>

<main class="main-with-bar">
  <section class="hero">
    <div class="hero__glow" aria-hidden="true"></div>
    <div class="container hero__grid">
      <div class="reveal">
        <p class="section__eyebrow">Сервис CVT · Владивосток</p>
        <h1 class="hero__title">Ремонт вариаторов во Владивостоке</h1>
        <p class="hero__subtitle">Диагностика → определение причины → ремонт → проверка → гарантия. Понятный процесс без лишних обещаний.</p>
        <div class="hero__cta">
          <a href="kontakty.html#zapis" class="btn btn--primary">Записаться на диагностику ${icon.arrow}</a>
          <a href="ceny.html" class="btn btn--ghost">Узнать стоимость ремонта</a>
        </div>
        <ul class="hero__facts" data-facts></ul>
      </div>
      <div class="reveal hero__visual">
        <div class="hero__panel">
          <div class="hero__panel-image" role="img" aria-label="Рабочая зона сервиса вариаторов">
            <div class="hero__panel-overlay">
              <p class="hero__panel-label">Фокус на CVT</p>
              <p class="hero__panel-text">Специализированный ремонт вариаторов — от диагностики до проверки после работ.</p>
            </div>
          </div>
          <div class="hero__panel-meta">
            <div><span>Регион</span><strong>Владивосток</strong></div>
            <div><span>Запись</span><strong data-bind="hoursShort"></strong></div>
            <div><span>Телефон</span><strong><a data-bind-href="phoneHref" href="#"><span data-bind="phone"></span></a></strong></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="section symptoms" id="simptomy">
    <div class="container">
      <div class="section__head section__head--row reveal">
        <div>
          <p class="section__eyebrow">Симптомы</p>
          <h2 class="section__title">Признаки неисправного вариатора</h2>
          <p class="section__lead">Если узнаёте один или несколько симптомов — начните с диагностики. Так проще понять причину и объём работ.</p>
        </div>
        <a href="kontakty.html#zapis" class="btn btn--primary">Записаться на диагностику</a>
      </div>
      <div class="grid-4 symptoms__grid" data-symptoms></div>
    </div>
  </section>

  <section class="section urgency">
    <div class="container">
      <div class="urgency__panel reveal">
        <div>
          <p class="section__eyebrow">Важно вовремя</p>
          <h2 class="section__title">Почему не стоит откладывать проверку</h2>
          <p class="section__lead">Небольшая неисправность вариатора может развиваться: износ цепи и шкивов, перегрев масла, повреждение гидроблока. Ранняя диагностика часто помогает ограничиться меньшим объёмом работ и сохранить ресурс агрегата.</p>
          <p class="urgency__note">Без запугивания: цель — понять причину и принять решение спокойно, с прозрачной сметой.</p>
        </div>
        <a href="uslugi/diagnostika-variatora.html" class="btn btn--soft">Подробнее о диагностике</a>
      </div>
    </div>
  </section>

  <section class="section" id="uslugi">
    <div class="container">
      <div class="section__head section__head--row reveal">
        <div>
          <p class="section__eyebrow">Услуги</p>
          <h2 class="section__title">Что делаем с вариатором</h2>
          <p class="section__lead">От диагностики до капитального ремонта. Каждая услуга — отдельная страница с понятным описанием.</p>
        </div>
        <a href="uslugi.html" class="btn btn--ghost">Все услуги</a>
      </div>
      <div class="grid-2 services__grid" data-services></div>
    </div>
  </section>

  <section class="section variators" id="variatory">
    <div class="container">
      <div class="section__head section__head--row reveal">
        <div>
          <p class="section__eyebrow">Марки и типы</p>
          <h2 class="section__title">Вариаторы, с которыми работаем</h2>
          <p class="section__lead">SEO-каталог по маркам с полезным содержанием — без пустых страниц «ради количества».</p>
        </div>
        <a href="variatory.html" class="btn btn--ghost">Каталог вариаторов</a>
      </div>
      <div class="grid-3" data-variators></div>
    </div>
  </section>

  <section class="section" id="process">
    <div class="container">
      <div class="section__head reveal">
        <p class="section__eyebrow">Процесс</p>
        <h2 class="section__title">Как проходит ремонт</h2>
        <p class="section__lead">Семь понятных шагов: от заявки до выдачи автомобиля.</p>
      </div>
      <ol class="process__list" data-process></ol>
    </div>
  </section>

  <section class="section prices" id="ceny">
    <div class="container">
      <div class="section__head section__head--row reveal">
        <div>
          <p class="section__eyebrow">Цены</p>
          <h2 class="section__title">Ориентиры по стоимости</h2>
          <p class="section__lead">Реальные цены сервиса пока не указаны — ниже плейсхолдеры. Точная сумма формируется после диагностики.</p>
        </div>
        <a href="ceny.html" class="btn btn--ghost">Страница цен</a>
      </div>
      <div data-prices></div>
      <div class="prices__cta reveal">
        <p>Нужна ориентировочная стоимость под ваш автомобиль?</p>
        <a href="kontakty.html#zapis" class="btn btn--primary">Оставить заявку</a>
      </div>
    </div>
  </section>

  <section class="section" id="raboty">
    <div class="container">
      <div class="section__head section__head--row reveal">
        <div>
          <p class="section__eyebrow">Наши работы</p>
          <h2 class="section__title">Реальные ремонты</h2>
          <p class="section__lead">Кейсы публикуем только с реальными данными клиента.</p>
        </div>
        <a href="raboty.html" class="btn btn--ghost">Все работы</a>
      </div>
      <div data-cases></div>
    </div>
  </section>

  <section class="section advantages">
    <div class="container">
      <div class="section__head reveal">
        <p class="section__eyebrow">Доверие</p>
        <h2 class="section__title">Почему нам доверяют</h2>
        <p class="section__lead">Только конкретные рабочие практики. Пункты с пометкой в скобках — замените на подтверждённые условия сервиса.</p>
      </div>
      <div class="grid-3" data-advantages></div>
    </div>
  </section>

  <section class="section" id="otzyvy">
    <div class="container">
      <div class="section__head section__head--row reveal">
        <div>
          <p class="section__eyebrow">Отзывы</p>
          <h2 class="section__title">Что говорят клиенты</h2>
          <p class="section__lead">Публикуем только реальные отзывы.</p>
        </div>
        <a href="otzyvy.html" class="btn btn--ghost">Все отзывы</a>
      </div>
      <div data-reviews></div>
    </div>
  </section>

  <section class="section faq" id="faq">
    <div class="container">
      <div class="section__head section__head--row reveal">
        <div>
          <p class="section__eyebrow">FAQ</p>
          <h2 class="section__title">Частые вопросы</h2>
          <p class="section__lead">Короткие ответы без SEO-воды — о цене, сроках, диагностике и гарантии.</p>
        </div>
        <a href="faq.html" class="btn btn--ghost">Все вопросы</a>
      </div>
      <div class="faq__list" data-faq data-faq-limit="5"></div>
    </div>
  </section>

  <section class="section cta">
    <div class="container">
      <div class="cta__panel reveal">
        <div>
          <h2 class="cta__title">Есть проблемы с вариатором? Начните с диагностики.</h2>
          <p>Опишите симптомы — подскажем следующий шаг и запишем на удобное время во Владивостоке.</p>
        </div>
        <div class="cta__actions">
          <a href="kontakty.html#zapis" class="btn btn--primary">Записаться на диагностику</a>
          <a class="btn btn--ghost" data-bind-href="phoneHref" href="#">${icon.phone} <span data-bind="phone"></span></a>
        </div>
      </div>
    </div>
  </section>

  <section class="section contacts" id="kontakty">
    <div class="container">
      <div class="section__head reveal">
        <p class="section__eyebrow">Контакты</p>
        <h2 class="section__title">Как связаться и добраться</h2>
        <p class="section__lead">Адрес, телефон и режим работы — плейсхолдеры. Замените на данные сервиса в <code>js/data.js</code>.</p>
      </div>
      <div data-contacts></div>
    </div>
  </section>
</main>

<footer class="footer" data-footer></footer>
<div class="mobile-bar" data-mobile-bar role="region" aria-label="Быстрые действия"></div>
`;

function write(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  // fix INDEX placeholder and relative contact links based on depth
  const p = depthPrefix(file);
  let html = content
    .replaceAll('INDEX', `${p}index.html`)
    .replaceAll('href="kontakty.html', `href="${p}kontakty.html`)
    .replaceAll('href="ceny.html', `href="${p}ceny.html`)
    .replaceAll('href="uslugi.html', `href="${p}uslugi.html`)
    .replaceAll('href="uslugi/', `href="${p}uslugi/`)
    .replaceAll('href="variatory.html', `href="${p}variatory.html`)
    .replaceAll('href="raboty.html', `href="${p}raboty.html`)
    .replaceAll('href="otzyvy.html', `href="${p}otzyvy.html`)
    .replaceAll('href="faq.html', `href="${p}faq.html`)
    .replaceAll("url('images/", `url('${p}images/`);
  fs.writeFileSync(file, html);
  console.log('wrote', file);
}

write(
  'index.html',
  shell('index.html', {
    title: 'Ремонт вариаторов во Владивостоке — Пример',
    description:
      'Диагностика и ремонт вариаторов во Владивостоке: выясняем причину, согласуем стоимость, ремонтируем и проверяем автомобиль. Запись на диагностику.',
    canonical: 'https://example.ru/',
    active: 'home',
    body: homeBody,
    jsonLd: `<script type="application/ld+json">{"@context":"https://schema.org","@type":"AutoRepair","name":"Пример","description":"Ремонт вариаторов во Владивостоке","address":{"@type":"PostalAddress","addressLocality":"Владивосток","addressCountry":"RU"},"areaServed":"Владивосток","url":"https://example.ru/"}</script>`,
  }),
);

function pageHero(crumbs, h1, lead, extra = '') {
  return `<section class="page-hero"><div class="container"><nav class="breadcrumbs" aria-label="Хлебные крошки">${crumbs}</nav><h1>${h1}</h1><p>${lead}</p>${extra}</div></section>`;
}

function layoutChrome(inner, filePath) {
  const p = depthPrefix(filePath);
  return `
<header class="header" data-header>
  <div class="container header__inner">
    <a href="${p}index.html" class="header__logo"><span class="header__logo-mark" aria-hidden="true"></span><span class="header__logo-text"><strong data-bind="shortName"></strong><small>Владивосток</small></span></a>
    <nav class="header__nav" aria-label="Основная навигация" data-nav></nav>
    <div class="header__actions">
      <a class="header__phone" data-bind-href="phoneHref" href="#">${icon.phone}<span data-bind="phone"></span></a>
      <a href="${p}kontakty.html#zapis" class="btn btn--primary header__cta">Записаться</a>
      <button type="button" class="header__burger" aria-label="Открыть меню" aria-expanded="false" data-burger>${icon.menu}</button>
    </div>
  </div>
  <div class="header__drawer" data-drawer>
    <nav class="header__drawer-nav" aria-label="Мобильная навигация" data-nav-mobile></nav>
    <div class="header__drawer-actions">
      <a class="btn btn--ghost btn--block" data-bind-href="phoneHref" href="#"><span data-bind="phone"></span></a>
      <a href="${p}kontakty.html#zapis" class="btn btn--primary btn--block">Записаться</a>
    </div>
  </div>
</header>
<main class="main-with-bar">${inner}</main>
<footer class="footer" data-footer></footer>
<div class="mobile-bar" data-mobile-bar role="region" aria-label="Быстрые действия"></div>`;
}

// Load business data after build
globalThis.window = globalThis;
const businessCode = fs.readFileSync('js/data.js', 'utf8');
eval(businessCode);
const BUSINESS = globalThis.BUSINESS;

write(
  'uslugi.html',
  shell('uslugi.html', {
    title: 'Услуги по ремонту вариаторов во Владивостоке',
    description: 'Полный перечень услуг по CVT во Владивостоке: диагностика, ремонт, капремонт, гидроблок, замена масла, адаптация.',
    canonical: 'https://example.ru/uslugi.html',
    active: 'uslugi',
    body: layoutChrome(
      pageHero(
        `<a href="index.html">Главная</a><span>/</span><span>Услуги</span>`,
        'Услуги по ремонту вариаторов',
        'Специализированный сервис CVT во Владивостоке. Выберите услугу — на странице есть описание, этапы и призыв к записи.',
      ) + `<section class="section" style="padding-top:0"><div class="container grid-2" data-services data-services-full></div></section><section class="section cta"><div class="container"><div class="cta__panel" data-cta-panel></div></div></section>`,
      'uslugi.html',
    ),
  }),
);

for (const s of BUSINESS.services) {
  const file = `uslugi/${s.slug}.html`;
  const related = BUSINESS.services.filter((x) => x.slug !== s.slug).slice(0, 3);
  const body = layoutChrome(
    pageHero(
      `<a href="../index.html">Главная</a><span>/</span><a href="../uslugi.html">Услуги</a><span>/</span><span>${s.shortTitle}</span>`,
      `${s.title} во Владивостоке`,
      s.description,
      `<div style="display:flex;flex-wrap:wrap;gap:.75rem;margin-top:1.5rem"><a href="../kontakty.html#zapis" class="btn btn--primary">Записаться</a><a href="../ceny.html" class="btn btn--ghost">Смотреть цены</a></div>`,
    ) +
      `<section class="section" style="padding-top:0"><div class="container" style="display:grid;gap:1rem">
        <div class="card prose"><h2 style="color:var(--text);margin-bottom:1rem;font-size:1.35rem">Что входит в услугу</h2><p>${s.fullDescription}</p>
        <ul style="margin-top:1.25rem;display:grid;gap:.55rem">${s.features.map((f) => `<li style="color:var(--text);padding-left:1rem;position:relative"><span style="position:absolute;left:0;top:.55em;width:6px;height:6px;border-radius:50%;background:var(--accent)"></span>${f}</li>`).join('')}</ul>
        <p style="margin-top:1.25rem">Ориентир по стоимости: <strong style="color:var(--accent)">${s.priceFrom}</strong>. Точная сумма — после диагностики и согласования.</p></div>
        <div class="card" id="zapis"><h2 style="font-size:1.25rem;margin-bottom:.5rem">Запись на услугу</h2><p style="color:var(--text-muted);margin-bottom:1rem">Оставьте заявку — перезвоним и уточним детали.</p><div data-lead-form data-source="услуга: ${s.slug}"></div></div>
        <div><h2 style="font-size:1.25rem;margin-bottom:1rem">Смотрите также</h2><div class="grid-3">${related.map((r) => `<a class="card card--link" href="${r.slug}.html"><h3 style="font-size:1.05rem">${r.title}</h3><p style="color:var(--text-muted);margin-top:.55rem;font-size:.92rem">${r.description}</p></a>`).join('')}</div>
        <p style="margin-top:1rem;color:var(--text-muted)">Также смотрите <a href="../variatory.html" style="color:var(--accent)">каталог вариаторов</a> и <a href="../faq.html" style="color:var(--accent)">ответы на частые вопросы</a>.</p></div>
      </div></section><section class="section cta"><div class="container"><div class="cta__panel" data-cta-panel></div></div></section>`,
    file,
  );
  write(
    file,
    shell(file, {
      title: s.metaTitle,
      description: s.metaDescription,
      canonical: `https://example.ru/uslugi/${s.slug}.html`,
      active: 'uslugi',
      body,
    }),
  );
}

write(
  'variatory.html',
  shell('variatory.html', {
    title: 'Ремонт вариаторов по маркам во Владивостоке',
    description: 'Каталог вариаторов: Nissan, Toyota, Honda, Mitsubishi, Subaru, Jatco. Диагностика и ремонт CVT во Владивостоке.',
    canonical: 'https://example.ru/variatory.html',
    active: 'variatory',
    body: layoutChrome(
      pageHero(`<a href="index.html">Главная</a><span>/</span><span>Вариаторы</span>`, 'Вариаторы и марки', 'Полезные страницы по популярным CVT. Каждая — с типовыми симптомами и ссылками на услуги, без пустых SEO-заглушек.') +
        `<section class="section" style="padding-top:0"><div class="container grid-3" data-variators data-variators-full></div></section><section class="section cta"><div class="container"><div class="cta__panel" data-cta-panel></div></div></section>`,
      'variatory.html',
    ),
  }),
);

for (const v of BUSINESS.variators) {
  const file = `variatory/${v.slug}.html`;
  const related = v.relatedServiceSlugs.map((slug) => BUSINESS.getServiceBySlug(slug)).filter(Boolean);
  const body = layoutChrome(
    pageHero(
      `<a href="../index.html">Главная</a><span>/</span><a href="../variatory.html">Вариаторы</a><span>/</span><span>${v.brand}</span>`,
      `${v.title} во Владивостоке`,
      v.description,
      `<div style="margin-top:1.5rem"><a href="../kontakty.html#zapis" class="btn btn--primary">Записаться на диагностику</a></div>`,
    ) +
      `<section class="section" style="padding-top:0"><div class="container" style="display:grid;gap:1rem">
        <article class="card prose"><h2 style="color:var(--text);margin-bottom:1rem;font-size:1.3rem">Особенности ремонта ${v.brand} CVT</h2><p>${v.fullDescription}</p></article>
        <article class="card"><h2 style="font-size:1.2rem;margin-bottom:1rem">Частые обращения</h2><ul class="grid-2">${v.commonIssues.map((i) => `<li class="placeholder-box" style="color:var(--text)">${i}</li>`).join('')}</ul></article>
        <article><h2 style="font-size:1.2rem;margin-bottom:1rem">Связанные услуги</h2><div class="grid-2">${related.map((s) => `<a class="card card--link" href="../uslugi/${s.slug}.html"><h3 style="font-size:1.05rem">${s.title}</h3><p style="color:var(--text-muted);margin-top:.55rem">${s.description}</p></a>`).join('')}</div></article>
      </div></section><section class="section cta"><div class="container"><div class="cta__panel" data-cta-panel></div></div></section>`,
    file,
  );
  write(
    file,
    shell(file, {
      title: v.metaTitle,
      description: v.metaDescription,
      canonical: `https://example.ru/variatory/${v.slug}.html`,
      active: 'variatory',
      body,
    }),
  );
}

const simplePages = [
  ['ceny.html', 'Цены на ремонт вариатора во Владивостоке', 'Ориентиры стоимости диагностики и ремонта вариатора во Владивостоке.', 'Цены', 'ceny', 'prices', '<div data-prices></div>'],
  ['raboty.html', 'Наши работы по ремонту вариаторов во Владивостоке', 'Реальные кейсы ремонта CVT во Владивостоке.', 'Наши работы', 'raboty', 'cases', '<div data-cases></div>'],
  ['otzyvy.html', 'Отзывы о ремонте вариаторов во Владивостоке', 'Отзывы клиентов о диагностике и ремонте вариаторов во Владивостоке.', 'Отзывы', 'otzyvy', 'reviews', '<div data-reviews></div>'],
  ['faq.html', 'Вопросы о ремонте вариатора во Владивостоке', 'FAQ: сколько стоит ремонт вариатора, сколько длится диагностика, можно ли ездить с рывками.', 'FAQ', 'faq', 'faq', '<div class="faq__list" data-faq></div>'],
  ['kontakty.html', 'Контакты сервиса ремонта вариаторов во Владивостоке', 'Адрес, телефон, режим работы и запись на диагностику вариатора во Владивостоке.', 'Контакты', 'kontakty', 'contacts', '<div data-contacts data-contacts-page></div>'],
];

for (const [file, title, desc, h1, active, sectionClass, inner] of simplePages) {
  write(
    file,
    shell(file, {
      title,
      description: desc,
      canonical: `https://example.ru/${file}`,
      active,
      body: layoutChrome(
        pageHero(`<a href="index.html">Главная</a><span>/</span><span>${h1}</span>`, h1, desc) +
          `<section class="section ${sectionClass === 'faq' ? 'faq' : sectionClass === 'prices' ? 'prices' : ''}" style="padding-top:0"><div class="container">${inner}</div></section><section class="section cta"><div class="container"><div class="cta__panel" data-cta-panel></div></div></section>`,
        file,
      ),
    }),
  );
}

write(
  'politika-konfidencialnosti.html',
  shell('politika-konfidencialnosti.html', {
    title: 'Политика обработки персональных данных',
    description: 'Политика конфиденциальности и обработки персональных данных сервиса ремонта вариаторов.',
    canonical: 'https://example.ru/politika-konfidencialnosti.html',
    body: layoutChrome(
      pageHero(`<a href="index.html">Главная</a><span>/</span><span>Политика конфиденциальности</span>`, 'Политика обработки персональных данных', 'Шаблон документа. Юрист клиента должен адаптировать текст под организацию.') +
        `<section class="section" style="padding-top:0"><div class="container prose">
          <p>Настоящая политика определяет порядок обработки персональных данных пользователей сайта <span data-bind="shortName"></span>.</p>
          <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.2rem">1. Какие данные обрабатываются</h2>
          <p>Имя, номер телефона, комментарий из формы заявки, технические данные о посещении сайта (при подключении аналитики).</p>
          <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.2rem">2. Цели обработки</h2>
          <p>Связь с пользователем для записи на диагностику/ремонт, ответы на обращения, улучшение работы сайта.</p>
          <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.2rem">3. Контакты по вопросам ПДн</h2>
          <p><span data-bind="entity"></span>. Email: <span data-bind="privacyEmail"></span>. Телефон: <span data-bind="phone"></span>.</p>
        </div></section>`,
      'politika-konfidencialnosti.html',
    ),
  }),
);

write(
  '404.html',
  shell('404.html', {
    title: 'Страница не найдена',
    description: 'Запрашиваемая страница не существует.',
    canonical: 'https://example.ru/404.html',
    body: layoutChrome(
      pageHero('', 'Страница не найдена', 'Возможно, ссылка устарела или адрес введён с ошибкой.', `<div style="margin-top:1.5rem;display:flex;gap:.75rem;flex-wrap:wrap"><a href="index.html" class="btn btn--primary">На главную</a><a href="kontakty.html" class="btn btn--ghost">Контакты</a></div>`),
      '404.html',
    ),
  }),
);

// Aliases requested by user structure
fs.copyFileSync('uslugi.html', 'services.html');
fs.copyFileSync('kontakty.html', 'contacts.html');
fs.writeFileSync(
  'about.html',
  shell('about.html', {
    title: 'О компании — ремонт вариаторов во Владивостоке',
    description: 'Сервис ремонта вариаторов во Владивостоке. Подход к диагностике и ремонту CVT.',
    canonical: 'https://example.ru/about.html',
    body: layoutChrome(
      pageHero(`<a href="index.html">Главная</a><span>/</span><span>О компании</span>`, 'О компании', 'Специализация — диагностика и ремонт вариаторов во Владивостоке.') +
        `<section class="section" style="padding-top:0"><div class="container"><div class="grid-3" data-advantages></div><div class="cta__panel" style="margin-top:2rem" data-cta-panel></div></div></section>`,
      'about.html',
    ),
  }),
);

fs.writeFileSync(
  'privacy.html',
  `<!DOCTYPE html><html lang="ru"><head><meta charset="UTF-8"><meta http-equiv="refresh" content="0; url=politika-konfidencialnosti.html"><title>Переход…</title></head><body><p><a href="politika-konfidencialnosti.html">Политика конфиденциальности</a></p></body></html>`,
);
fs.writeFileSync(
  'consent.html',
  shell('consent.html', {
    title: 'Согласие на обработку персональных данных',
    description: 'Согласие на обработку персональных данных при отправке заявки.',
    canonical: 'https://example.ru/consent.html',
    body: layoutChrome(
      pageHero(`<a href="index.html">Главная</a><span>/</span><span>Согласие</span>`, 'Согласие на обработку персональных данных', 'Документ-шаблон для юридической адаптации.') +
        `<section class="section" style="padding-top:0"><div class="container prose"><p>Отправляя заявку на сайте, пользователь даёт согласие на обработку указанных персональных данных в целях обратной связи и записи на услуги.</p><p>Подробнее — в <a href="politika-konfidencialnosti.html">политике конфиденциальности</a>.</p></div></section>`,
      'consent.html',
    ),
  }),
);

console.log('site pages generated');
