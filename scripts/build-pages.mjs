import fs from 'fs';
import path from 'path';

function shell({ title, desc, canonical, base = '', body, jsonLd = '' }) {
  return `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${desc}">
  <meta property="og:image" content="https://example.ru/images/hero/hero.png">
  <meta property="og:locale" content="ru_RU">
  <link rel="icon" href="${base}images/icons/favicon.svg" type="image/svg+xml">
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Unbounded:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${base}css/style.css">
  <link rel="stylesheet" href="${base}css/responsive.css">
  ${jsonLd}
</head>
<body data-base="${base}">
${chrome(base)}
<main class="pad-b">${body}</main>
${footer(base)}
${mobileBar(base)}
${modal(base)}
<script src="${base}js/data.js"></script>
<script src="${base}js/menu.js"></script>
<script src="${base}js/modal.js"></script>
<script src="${base}js/faq.js"></script>
<script src="${base}js/gallery.js"></script>
<script src="${base}js/form.js"></script>
<script src="${base}js/main.js"></script>
</body>
</html>`;
}

function chrome(base) {
  return `<header class="site-header" data-header>
  <div class="wrap header-row">
    <a class="brand" href="${base}index.html"><span class="brand-mark"></span><span><strong data-text="shortName">Пример</strong><small>Владивосток</small></span></a>
    <nav class="nav-desk" aria-label="Навигация">
      <a href="${base}services.html">Услуги</a>
      <a href="${base}about.html">О компании</a>
      <a href="${base}prices.html">Цены</a>
      <a href="${base}cases.html">Кейсы</a>
      <a href="${base}contacts.html">Контакты</a>
    </nav>
    <div class="header-side">
      <a class="header-phone" data-href="phone" href="tel:+70000000000"><span data-text="phone"></span></a>
      <button class="btn btn--primary header-cta" type="button" data-open-modal="book">Записаться</button>
      <button class="burger" type="button" aria-label="Меню" aria-expanded="false" data-burger>☰</button>
    </div>
  </div>
  <div class="drawer" data-drawer>
    <nav>
      <a href="${base}services.html">Услуги</a>
      <a href="${base}about.html">О компании</a>
      <a href="${base}prices.html">Цены</a>
      <a href="${base}cases.html">Кейсы</a>
      <a href="${base}contacts.html">Контакты</a>
    </nav>
    <div class="drawer-actions">
      <button class="btn btn--primary" type="button" data-open-modal="book">Записаться</button>
    </div>
  </div>
</header>`;
}

function footer(base) {
  return `<footer class="site-footer">
  <div class="wrap footer-grid">
    <div><a class="brand" href="${base}index.html"><span class="brand-mark"></span><span><strong data-text="shortName"></strong></span></a><p style="color:var(--muted);margin-top:.8rem" data-text="tagline"></p></div>
    <div><h2>Услуги</h2><ul class="footer-list"><li><a href="${base}services/diagnostika.html">Диагностика</a></li><li><a href="${base}services/remont-variatora.html">Ремонт вариатора</a></li></ul></div>
    <div><h2>Разделы</h2><ul class="footer-list"><li><a href="${base}contacts.html">Контакты</a></li><li><a href="${base}privacy.html">Политика</a></li><li><a href="${base}consent.html">Согласие</a></li></ul></div>
    <div><h2>Контакты</h2><ul class="footer-list"><li><a data-href="phone" href="tel:+70000000000"><span data-text="phone"></span></a></li><li data-text="address"></li></ul></div>
  </div>
  <div class="wrap footer-bottom"><p>Ремонт вариаторов во Владивостоке</p></div>
</footer>`;
}

function mobileBar() {
  return `<div class="mobile-bar"><a class="btn btn--ghost" data-href="phone" href="tel:+70000000000">Позвонить</a><button class="btn btn--primary" type="button" data-open-modal="book">Записаться</button></div>`;
}

function modal(base) {
  return `<div class="overlay" id="book" role="dialog" aria-modal="true" aria-labelledby="book-title">
  <div class="modal">
    <div class="modal-head"><h2 id="book-title">Записаться на диагностику</h2><button class="modal-x" type="button" data-close-modal aria-label="Закрыть">×</button></div>
    <form class="form" data-form data-source="модальная запись" data-submit-label="Записаться на диагностику">
      <div data-fields>
        <label class="field"><span>Имя</span><input name="name" required></label>
        <label class="field"><span>Телефон</span><input name="phone" type="tel" required placeholder="+7 (___) ___-__-__"></label>
        <label class="field"><span>Марка автомобиля</span><input name="car"></label>
        <label class="field"><span>Модель</span><input name="model"></label>
        <label class="field"><span>Описание проблемы</span><textarea name="message" rows="3"></textarea></label>
        <label class="consent"><input type="checkbox" name="consent" required><span>Согласен с <a href="${base}consent.html" target="_blank" rel="noopener">обработкой персональных данных</a></span></label>
        <p class="form-error" data-error hidden></p>
        <button class="btn btn--primary btn--block" type="submit">Записаться на диагностику</button>
      </div>
      <div class="form-ok" data-success hidden><h3>Спасибо! Заявка отправлена.</h3><p>Мы свяжемся с вами.</p><button type="button" class="btn btn--ghost" data-reset>Ещё одна</button></div>
    </form>
  </div>
</div>`;
}

function pageTop(crumbs, h1, lead, extra = '') {
  return `<section class="page-top"><div class="wrap"><nav class="crumbs">${crumbs}</nav><h1>${h1}</h1><p>${lead}</p>${extra}</div></section>`;
}

function write(file, html) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log('wrote', file);
}

const services = [
  {
    file: 'services/diagnostika.html',
    title: 'Диагностика вариатора во Владивостоке',
    desc: 'Диагностика вариатора во Владивостоке: проверка ошибок, параметров и поведения CVT. Запись.',
    h1: 'Диагностика вариатора во Владивостоке',
    short: 'Компьютерная и механическая проверка перед ремонтом.',
    body: `<p>Диагностика помогает понять причину рывков, шума, перегрева или потери тяги до начала ремонта.</p>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Когда нужна</h2>
      <ul><li>Рывки и вибрации</li><li>Пробуксовка</li><li>Шум</li><li>Ошибки на панели</li><li>Проверка перед покупкой авто с CVT</li></ul>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Что входит</h2>
      <ul><li>Считывание ошибок и параметров</li><li>Оценка поведения агрегата</li><li>Рекомендации по дальнейшим шагам</li></ul>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Стоимость</h2>
      <p data-text="priceNote"></p>`,
  },
  {
    file: 'services/remont-variatora.html',
    title: 'Ремонт вариатора во Владивостоке',
    desc: 'Ремонт вариаторов во Владивостоке после диагностики и согласования стоимости.',
    h1: 'Ремонт вариатора во Владивостоке',
    short: 'Ремонт CVT по результатам диагностики.',
    body: `<p>Работы начинаем после диагностики и согласования. Объём зависит от неисправности и типа агрегата.</p>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Этапы</h2>
      <ul><li>Диагностика</li><li>Определение причины</li><li>Согласование</li><li>Ремонт</li><li>Проверка</li></ul>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Стоимость</h2>
      <p data-text="priceNote"></p>`,
  },
  {
    file: 'services/remont-akpp.html',
    title: 'Ремонт АКПП во Владивостоке',
    desc: 'Ремонт АКПП во Владивостоке: диагностика автоматической коробки и согласование работ.',
    h1: 'Ремонт АКПП во Владивостоке',
    short: 'Диагностика и ремонт автоматических коробок.',
    body: `<p>При ударах, задержках переключений и ошибках АКПП начинаем с диагностики.</p>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Стоимость</h2>
      <p data-text="priceNote"></p>`,
  },
  {
    file: 'services/zamena-masla.html',
    title: 'Замена масла в вариаторе во Владивостоке',
    desc: 'Замена масла CVT во Владивостоке: подбор жидкости и обслуживание вариатора.',
    h1: 'Замена масла в вариаторе во Владивостоке',
    short: 'Обслуживание жидкости CVT.',
    body: `<p>Подбираем жидкость под тип вариатора. При необходимости оцениваем состояние масла и фильтр.</p>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Стоимость</h2>
      <p data-text="priceNote"></p><p class="todo">TODO: цена услуги после данных заказчика</p>`,
  },
];

for (const s of services) {
  write(
    s.file,
    shell({
      title: s.title,
      desc: s.desc,
      canonical: `https://example.ru/${s.file}`,
      base: '../',
      body:
        pageTop(
          `<a href="../index.html">Главная</a><span>/</span><a href="../services.html">Услуги</a><span>/</span><span>${s.h1.split(' ')[0]}</span>`,
          s.h1,
          s.short,
          `<div style="margin-top:1.25rem"><button class="btn btn--primary" type="button" data-open-modal="book">Записаться</button></div>`,
        ) +
        `<section class="section" style="padding-top:0"><div class="wrap stack"><article class="contact-card prose">${s.body}</article>
        <div class="finale"><div><h2>Записаться на услугу</h2><p>Оставьте контакты — перезвоним.</p></div><div class="finale-actions"><button class="btn btn--primary" type="button" data-open-modal="book">Записаться на диагностику</button></div></div>
        </div></section>`,
    }),
  );
}

const brands = [
  ['toyota', 'Toyota', 'Ремонт вариаторов Toyota во Владивостоке: диагностика CVT, типичные симптомы и запись в сервис.'],
  ['nissan', 'Nissan', 'Ремонт вариаторов Nissan во Владивостоке. Диагностика Jatco/CVT и согласование работ.'],
  ['honda', 'Honda', 'Ремонт вариаторов Honda во Владивостоке: диагностика и ремонт CVT.'],
  ['subaru', 'Subaru', 'Ремонт вариаторов Subaru во Владивостоке: диагностика Lineartronic/CVT.'],
  ['mitsubishi', 'Mitsubishi', 'Ремонт вариаторов Mitsubishi во Владивостоке: диагностика и ремонт CVT.'],
];

write(
  'variatory/index.html',
  shell({
    title: 'Ремонт вариаторов по маркам во Владивостоке',
    desc: 'Каталог вариаторов: Toyota, Nissan, Honda, Subaru, Mitsubishi. Диагностика и ремонт CVT во Владивостоке.',
    canonical: 'https://example.ru/variatory/',
    base: '../',
    body:
      pageTop(`<a href="../index.html">Главная</a><span>/</span><span>Вариаторы</span>`, 'Вариаторы по маркам', 'Страницы с полезным содержанием по популярным CVT — без пустых SEO-заглушек.') +
      `<section class="section" style="padding-top:0"><div class="wrap"><div class="brands" data-brands></div><p class="todo" style="margin-top:1rem">TODO: подтвердить список марок у заказчика</p></div></section>`,
  }),
);

for (const [slug, name, desc] of brands) {
  write(
    `variatory/${slug}.html`,
    shell({
      title: `Ремонт вариатора ${name} во Владивостоке`,
      desc,
      canonical: `https://example.ru/variatory/${slug}.html`,
      base: '../',
      body:
        pageTop(
          `<a href="../index.html">Главная</a><span>/</span><a href="index.html">Вариаторы</a><span>/</span><span>${name}</span>`,
          `Ремонт вариаторов ${name} во Владивостоке`,
          `Типичные обращения по CVT ${name}: рывки, шум, перегрев, потеря тяги. Начинаем с диагностики.`,
          `<div style="margin-top:1.25rem"><button class="btn btn--primary" type="button" data-open-modal="book">Записаться на диагностику</button></div>`,
        ) +
        `<section class="section" style="padding-top:0"><div class="wrap stack">
          <article class="contact-card prose">
            <h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Проблемы с вариатором ${name}</h2>
            <p>На автомобилях ${name} с CVT часто обращаются при рывках, шуме, перегреве и потере динамики. Точный объём работ определяем по диагностике и дефектовке — без универсальных «средних цен».</p>
            <h2 style="color:var(--text);font-size:1.25rem;margin:1.5rem 0 .75rem">Симптомы</h2>
            <ul><li>Рывки при разгоне</li><li>Шум и вибрации</li><li>Перегрев вариатора</li><li>Ошибки трансмиссии</li><li>Пробуксовка и потеря тяги</li></ul>
            <h2 style="color:var(--text);font-size:1.25rem;margin:1.5rem 0 .75rem">Диагностика</h2>
            <p>Считываем ошибки и параметры, оцениваем поведение агрегата и объясняем возможные причины. Ремонт начинаем только после согласования.</p>
            <h2 style="color:var(--text);font-size:1.25rem;margin:1.5rem 0 .75rem">Этапы</h2>
            <ol style="padding-left:1.1rem;list-style:decimal;color:var(--muted)"><li>Описание симптомов</li><li>Диагностика</li><li>Определение причины</li><li>Согласование сметы</li><li>Ремонт и проверка</li></ol>
            <h2 style="color:var(--text);font-size:1.25rem;margin:1.5rem 0 .75rem">Стоимость</h2>
            <p data-text="priceNote"></p>
            <h2 style="color:var(--text);font-size:1.25rem;margin:1.5rem 0 .75rem">FAQ</h2>
            <p><strong>Можно ли ездить с рывками?</strong> Лучше не откладывать проверку — объём ремонта может вырасти.</p>
            <p><strong>Сколько стоит ремонт вариатора ${name}?</strong> Сумма зависит от неисправности и определяется после диагностики.</p>
          </article>
          <div class="finale"><div><h2>Нужна диагностика ${name} CVT?</h2><p>Опишите симптомы — подскажем следующий шаг во Владивостоке.</p></div><div class="finale-actions"><button class="btn btn--primary" type="button" data-open-modal="book">Записаться</button><a class="btn btn--ghost" href="../contacts.html">Контакты</a></div></div>
        </div></section>`,
    }),
  );
}

const articles = [
  [
    'kak-ponyat-chto-variator-trebuet-remonta.html',
    'Как понять, что вариатор требует ремонта',
    'Признаки неисправности CVT: рывки, шум, перегрев, потеря тяги. Когда ехать на диагностику во Владивостоке.',
    `<p>Вариатор редко «ломается внезапно без симптомов». Обычно появляются рывки, гул, пробуксовка, задержки или предупреждения на панели.</p>
     <p>Если симптомы повторяются — не стоит ждать, пока неисправность усугубится. Начните с диагностики: так проще понять, нужен ли ремонт, обслуживание или достаточно адаптации/замены жидкости.</p>
     <p>Самодиагностика по роликам не заменяет проверку параметров и состояния агрегата в сервисе.</p>`,
  ],
  [
    'kogda-menyat-maslo-v-variatore.html',
    'Когда менять масло в вариаторе',
    'Замена масла CVT: ориентиры по регламенту, состоянию жидкости и условиям эксплуатации во Владивостоке.',
    `<p>Срок замены зависит от регламента производителя, стиля езды и состояния жидкости. Тёмное масло, запах гари или стружка — повод для проверки.</p>
     <p>Важно подбирать жидкость под конкретный тип CVT. Универсальные «масла для автомата» подходят не всегда.</p>`,
  ],
  [
    'pochemu-variator-dergaetsya.html',
    'Почему вариатор начинает дёргаться',
    'Рывки вариатора: возможные причины и что делать владельцу автомобиля во Владивостоке.',
    `<p>Рывки могут быть связаны с давлением, гидроблоком, износом цепи/шкивов, перегревом или электроникой. Без диагностики это только гипотезы.</p>
     <p>Продолжать ездить с сильными рывками нежелательно: объём ремонта может вырасти. Запишитесь на проверку и опишите, в каких режимах проявляется симптом.</p>`,
  ],
  [
    'chto-delat-pri-peregreve-variatora.html',
    'Что делать при перегреве вариатора',
    'Перегрев CVT: что делать владельцу и когда нужна диагностика во Владивостоке.',
    `<p>При перегреве снизьте нагрузку: не буксируйте, избегайте резких ускорений и длительной езды «в натяг». Если появилось предупреждение или запах — лучше остановиться и записаться на проверку.</p>
     <p>Перегрев опасен для жидкости и узлов вариатора. Диагностика поможет понять, связана ли проблема с охлаждением, уровнем жидкости или износом.</p>`,
  ],
  [
    'mozhno-li-ezdit-s-oshibkoj-variatora.html',
    'Можно ли ездить с ошибкой вариатора',
    'Ошибка трансмиссии/CVT: стоит ли продолжать поездки и как действовать во Владивостоке.',
    `<p>Ошибка на панели — сигнал, а не диагноз. Иногда автомобиль уходит в защитный режим с потерей динамики. Продолжать поездки «пока едет» рискованно: неисправность может усугубиться.</p>
     <p>Оптимальный шаг — считать коды и проверить параметры на диагностике, затем согласовать действия.</p>`,
  ],
  [
    'skolko-stoit-remont-variatora.html',
    'Сколько стоит ремонт вариатора',
    'От чего зависит стоимость ремонта вариатора во Владивостоке и почему смета после диагностики.',
    `<p>Цена зависит от марки/модели, типа CVT, характера неисправности и объёма работ. Без диагностики публиковать «точную» сумму нельзя — это вводит в заблуждение.</p>
     <p>Честный порядок: диагностика → причина → смета → согласование → ремонт. Так вы заранее понимаете, за что платите.</p>`,
  ],
];

for (const [file, title, desc, html] of articles) {
  write(
    `articles/${file}`,
    shell({
      title: `${title} — Владивосток`,
      desc,
      canonical: `https://example.ru/articles/${file}`,
      base: '../',
      body:
        pageTop(`<a href="../index.html">Главная</a><span>/</span><span>Статьи</span><span>/</span><span>${title}</span>`, title, desc) +
        `<section class="section" style="padding-top:0"><div class="wrap"><article class="contact-card prose">${html}<p style="margin-top:1.5rem"><a class="btn btn--primary" href="../contacts.html">Записаться на диагностику</a></p></article></div></section>`,
    }),
  );
}

const simple = [
  [
    'services.html',
    'Услуги автосервиса — ремонт вариаторов во Владивостоке',
    'Диагностика, ремонт вариатора, АКПП и замена масла CVT во Владивостоке.',
    'Услуги',
    'Диагностика и ремонт вариаторов. Каждая услуга — на отдельной странице.',
    `<div class="services-mosaic" data-services></div>`,
  ],
  [
    'prices.html',
    'Цены на ремонт вариатора во Владивостоке',
    'Стоимость ремонта вариатора во Владивостоке определяется после диагностики.',
    'Цены',
    'Без вымышленных цифр. Точная смета — после проверки.',
    `<div data-prices></div><div style="margin-top:1.25rem"><button class="btn btn--primary" type="button" data-open-modal="book">Узнать стоимость</button></div>`,
  ],
  [
    'cases.html',
    'Кейсы ремонта вариаторов во Владивостоке',
    'Реальные работы по ремонту CVT во Владивостоке: проблема, диагностика, результат.',
    'Кейсы',
    'Публикуем только подтверждённые ремонты.',
    `<div data-cases></div>`,
  ],
  [
    'about.html',
    'О компании — сервис ремонта вариаторов во Владивостоке',
    'Автосервис во Владивостоке со специализацией на вариаторах и АКПП.',
    'О компании',
    'Фокус на диагностике и ремонте CVT.',
    `<article class="contact-card prose"><p>Мы позиционируем сервис как профильный по вариаторам: симптомы → диагностика → согласование → ремонт.</p><p class="todo">TODO: добавить реальное описание компании из 2GIS.</p></article><div class="trust-grid" data-trust style="margin-top:1rem"></div>`,
  ],
  [
    'contacts.html',
    'Контакты — ремонт вариаторов во Владивостоке',
    'Адрес, телефон и запись на диагностику вариатора во Владивостоке.',
    'Контакты',
    'Свяжитесь с сервисом или оставьте заявку.',
    `<div class="contacts-grid"><div class="contact-card"><ul class="contact-list"><li><span>Адрес</span><strong data-text="address"></strong></li><li><span>Телефон</span><strong><a data-href="phone" href="tel:+70000000000"><span data-text="phone"></span></a></strong></li><li><span>График</span><strong data-text="weekdays"></strong><br><strong data-text="weekend"></strong></li></ul><div class="contact-actions"><a class="btn btn--primary" data-href="phone" href="tel:+70000000000">Позвонить</a><button class="btn btn--soft" type="button" data-open-modal="book">Записаться</button><a class="btn btn--ghost" data-map="route" href="#">Построить маршрут</a></div></div><div class="map-box"><p>TODO: карта 2GIS / Яндекс</p><p style="margin-top:1rem"><a class="btn btn--ghost" data-map="twogis" href="#">2GIS</a> <a class="btn btn--ghost" data-map="yandex" href="#">Яндекс</a></p></div></div>`,
  ],
];

for (const [file, title, desc, h1, lead, inner] of simple) {
  write(
    file,
    shell({
      title,
      desc,
      canonical: `https://example.ru/${file}`,
      body: pageTop(`<a href="index.html">Главная</a><span>/</span><span>${h1}</span>`, h1, lead) + `<section class="section" style="padding-top:0"><div class="wrap">${inner}</div></section>`,
    }),
  );
}

write(
  'privacy.html',
  shell({
    title: 'Политика конфиденциальности',
    desc: 'Политика обработки персональных данных.',
    canonical: 'https://example.ru/privacy.html',
    body:
      pageTop(`<a href="index.html">Главная</a><span>/</span><span>Политика</span>`, 'Политика конфиденциальности', 'Шаблон для юридической проверки.') +
      `<section class="section" style="padding-top:0"><div class="wrap prose"><p>Обрабатываем имя, телефон и комментарий из форм для связи и записи на услуги.</p><p>Контакты: <span data-text="entity"></span>, <span data-text="phone"></span>.</p></div></section>`,
  }),
);

write(
  'consent.html',
  shell({
    title: 'Согласие на обработку персональных данных',
    desc: 'Согласие на обработку персональных данных при отправке заявки.',
    canonical: 'https://example.ru/consent.html',
    body:
      pageTop(`<a href="index.html">Главная</a><span>/</span><span>Согласие</span>`, 'Согласие на обработку персональных данных', 'Документ-шаблон.') +
      `<section class="section" style="padding-top:0"><div class="wrap prose"><p>Отправляя заявку, вы соглашаетесь на обработку указанных данных для обратной связи.</p><p>Подробнее — в <a href="privacy.html">политике конфиденциальности</a>.</p></div></section>`,
  }),
);

// sitemap
const urls = [
  '/',
  '/services.html',
  '/prices.html',
  '/cases.html',
  '/contacts.html',
  '/about.html',
  '/privacy.html',
  '/consent.html',
  '/variatory/',
  ...services.map((s) => '/' + s.file),
  ...brands.map(([slug]) => `/variatory/${slug}.html`),
  ...articles.map(([f]) => `/articles/${f}`),
];
const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((u) => `  <url><loc>https://example.ru${u === '/' ? '/' : u}</loc></url>`)
  .join('\n')}\n</urlset>\n`;
fs.writeFileSync('sitemap.xml', xml);
fs.writeFileSync(
  'robots.txt',
  `User-agent: *\nAllow: /\n\nHost: https://example.ru\nSitemap: https://example.ru/sitemap.xml\n`,
);

console.log('done', urls.length, 'urls');
