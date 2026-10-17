import fs from 'fs';
import path from 'path';

function shell({ title, desc, canonical, base = '', body, jsonLd = '', brand = '' }) {
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
  <meta property="og:image" content="https://example.ru/images/hero/hero-transmission.png">
  <meta property="og:locale" content="ru_RU">
  <link rel="icon" href="${base}images/icons/favicon.svg" type="image/svg+xml">
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Unbounded:wght@400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="${base}css/style.css">
  <link rel="stylesheet" href="${base}css/responsive.css">
  ${jsonLd}
</head>
<body data-base="${base}"${brand ? ` data-brand="${brand}"` : ''}>
${chrome(base, brand)}
<main class="pad-b">${body}</main>
${footer(base)}
${mobileBar(brand)}
${modal(base)}
<script src="${base}js/data.js?v=20261017-brands2"></script>
<script src="${base}js/content-loader.js?v=20261017-brands2"></script>
<script src="${base}js/menu.js"></script>
<script src="${base}js/modal.js?v=20261017-brands2"></script>
<script src="${base}js/faq.js"></script>
<script src="${base}js/gallery.js"></script>
<script src="${base}js/form.js?v=20261017-brands2"></script>
<script src="${base}js/map-2gis.js"></script>
<script src="${base}js/main.js"></script>
</body>
</html>`;
}

function bookAttr(brand) {
  return brand ? ` data-brand="${brand}"` : '';
}

function chrome(base, brand = '') {
  return `<header class="site-header" data-header>
  <div class="wrap">
    <div class="header-row">
      <a class="brand" href="${base}index.html"><span class="brand-mark"></span><span><strong data-text="shortName">FTC</strong><small>Владивосток</small></span></a>
      <nav class="nav-desk" aria-label="Навигация">
        <a href="${base}services.html">Услуги</a>
        <a href="${base}index.html#zapchasti">Запчасти</a>
        <a href="${base}about.html">О компании</a>
        <a href="${base}prices.html">Цены</a>
        <a href="${base}cases.html">Примеры</a>
        <a href="${base}contacts.html">Контакты</a>
      </nav>
      <div class="header-side">
        <a class="header-phone" data-href="phone" href="tel:+79146643290"><span data-text="phone"></span></a>
        <button class="btn btn--primary header-cta" type="button" data-open-modal="book"${bookAttr(brand)}>Записаться</button>
        <button class="burger" type="button" aria-label="Меню" aria-expanded="false" data-burger>☰</button>
      </div>
    </div>
    <div class="header-contacts">
      <p class="header-address"><span class="header-contacts__label">Адрес</span><span data-text="address"></span></p>
      <div class="header-messengers" data-header-messengers hidden>
        <span class="header-contacts__label">Написать в мессенджер:</span>
        <div class="messenger-icons" data-messenger-icons></div>
      </div>
    </div>
  </div>
  <div class="drawer" data-drawer>
    <nav>
      <a href="${base}services.html">Услуги</a>
      <a href="${base}index.html#zapchasti">Запчасти</a>
      <a href="${base}about.html">О компании</a>
      <a href="${base}prices.html">Цены</a>
      <a href="${base}cases.html">Примеры</a>
      <a href="${base}contacts.html">Контакты</a>
    </nav>
    <div class="drawer-actions">
      <p class="drawer-address" data-text="address"></p>
      <div class="messenger-icons" data-messenger-icons-mobile></div>
      <button class="btn btn--primary" type="button" data-open-modal="book"${bookAttr(brand)}>Записаться</button>
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
    <div><h2>Контакты</h2><ul class="footer-list"><li><a data-href="phone" href="tel:+79146643290"><span data-text="phone"></span></a></li><li data-text="address"></li></ul></div>
  </div>
  <div class="wrap footer-bottom"><p>Ремонт вариаторов во Владивостоке</p></div>
</footer>`;
}

function mobileBar(brand = '') {
  return `<div class="mobile-bar"><a class="btn btn--ghost" data-href="phone" href="tel:+79146643290">Позвонить</a><button class="btn btn--primary" type="button" data-open-modal="book"${bookAttr(brand)}>Записаться</button></div>`;
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
        <label class="field"><span>Номер кузова или VIN</span><input name="vin" autocomplete="off" placeholder="Укажите номер кузова или VIN автомобиля" data-modal-vin></label>
        <label class="field"><span>Описание проблемы</span><textarea name="message" rows="3" data-modal-message></textarea></label>
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
    desc: 'Диагностика вариатора во Владивостоке: оценка состояния CVT и определение дальнейших действий. Запись.',
    h1: 'Диагностика вариатора во Владивостоке',
    short: 'Оценка состояния коробки и определение дальнейших действий.',
    body: `<p>Диагностика помогает оценить состояние коробки передач и определить дальнейшие действия. Она не всегда позволяет установить причину неисправности без разборки.</p>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Когда нужна</h2>
      <ul><li>Рывки и вибрации</li><li>Пробуксовка</li><li>Шум</li><li>Ошибки на панели</li><li>Проверка перед покупкой авто с CVT</li></ul>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Что входит</h2>
      <ul><li>Считывание ошибок и параметров</li><li>Оценка поведения агрегата</li><li>Рекомендации по дальнейшим шагам</li><li>В ряде случаев — предварительная оценка стоимости ремонта</li></ul>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Стоимость</h2>
      <p data-text="priceNote"></p>`,
  },
  {
    file: 'services/remont-variatora.html',
    title: 'Ремонт вариатора во Владивостоке',
    desc: 'Ремонт вариаторов (CVT) во Владивостоке: диагностика, дефектовка и ремонт после согласования стоимости.',
    h1: 'Ремонт вариаторов (CVT) во Владивостоке',
    short: 'Ремонт после диагностики, дефектовки и согласования точной стоимости.',
    body: `<p>Точную стоимость ремонта определяем после разборки и дефектовки. Дальнейший ремонт выполняем после согласования стоимости с клиентом.</p>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Этапы</h2>
      <ul><li>Диагностика и предварительная оценка</li><li>Разборка и дефектовка</li><li>Определение и согласование точной стоимости</li><li>Ремонт и сборка</li></ul>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Стоимость</h2>
      <p>Ориентир: от 30 000 ₽. <span data-text="priceDisclaimer"></span></p>`,
  },
  {
    file: 'services/remont-akpp.html',
    title: 'Ремонт АКПП во Владивостоке',
    desc: 'Ремонт АКПП во Владивостоке: диагностика, дефектовка и ремонт после согласования.',
    h1: 'Ремонт АКПП во Владивостоке',
    short: 'Диагностика, дефектовка и ремонт автоматических коробок.',
    body: `<p>При ударах, задержках переключений и ошибках АКПП начинаем с диагностики. Точную стоимость ремонта определяем после дефектовки.</p>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Стоимость</h2>
      <p>Ориентир: от 25 000 ₽. <span data-text="priceDisclaimer"></span></p>`,
  },
  {
    file: 'services/zamena-masla.html',
    title: 'Замена масла во Владивостоке',
    desc: 'Замена масла в вариаторе, АКПП и DSG во Владивостоке с подбором жидкости по каталогу.',
    h1: 'Замена масла во Владивостоке',
    short: 'Замена масла в вариаторе, АКПП, DSG с подбором подходящей жидкости по каталогу.',
    body: `<p>Подбираем жидкость по каталогу под тип коробки: вариатор, АКПП или DSG. При необходимости оцениваем состояние масла и фильтр.</p>
      <h2 style="color:var(--text);margin:1.5rem 0 .75rem;font-size:1.25rem">Стоимость</h2>
      <p>Ориентир для замены масла в вариаторе: от 4 000 ₽, в АКПП: от 3 500 ₽. Точную сумму уточняем после подбора жидкости.</p>`,
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

const sectionTitle = (text) =>
  `<h2 style="color:var(--text);font-size:1.25rem;margin:1.5rem 0 .75rem">${text}</h2>`;

const sharedSteps = `${sectionTitle('Этапы обращения')}
<ol style="padding-left:1.1rem;list-style:decimal;color:var(--muted)"><li>По VIN или номеру кузова определяем, какая коробка стоит на этом автомобиле.</li><li>Диагностика оценивает состояние и дальнейшие действия. Она не заменяет дефектовку и не всегда называет причину без разборки.</li><li>Если нужен ремонт, точный объём работ согласуем после разборки и дефектовки.</li><li>К ремонту переходим только после этого согласования.</li></ol>`;

const sharedContacts = `${sectionTitle('Контакты FTC')}
<ul class="contact-list"><li><span>Адрес</span><strong data-text="address">Владивосток, Западная улица, 11, 1-й этаж</strong></li><li><span>Телефон</span><strong><a data-href="phone" href="tel:+79146643290"><span data-text="phone">+7 (914) 664-32-90</span></a></strong></li><li><span>График</span><strong data-text="weekdays">Пн–Пт: 09:00–17:00</strong><br><strong data-text="weekend">Сб: 09:00–13:00 · Вс: выходной</strong></li></ul>
<p><a href="../index.html">На главную</a> · <a href="index.html">Каталог марок</a></p>`;

const brands = [
  {
    slug: 'toyota',
    name: 'Toyota',
    title: 'Ремонт вариатора Toyota во Владивостоке',
    desc: 'Ремонт вариаторов Toyota во Владивостоке: диагностика CVT, типичные симптомы и запись в сервис.',
    h1: 'Ремонт вариаторов Toyota во Владивостоке',
    lead: 'Типичные обращения по CVT Toyota: рывки, шум, перегрев, потеря тяги. Начинаем с диагностики.',
    body: `<h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Проблемы с вариатором Toyota</h2>
<p>На автомобилях Toyota с CVT часто обращаются при рывках, шуме, перегреве и потере динамики. Вариатор стоит не на каждой Toyota: тип коробки зависит от модели, года, двигателя и рынка поставки.</p>
<p>Диагностика помогает оценить состояние. Точный объём работ определяем после дефектовки.</p>
${sectionTitle('Симптомы')}<ul><li>Рывки при разгоне</li><li>Шум и вибрации</li><li>Перегрев вариатора</li><li>Ошибки трансмиссии</li><li>Пробуксовка и потеря тяги</li></ul>
${sectionTitle('Диагностика')}<p>Считываем ошибки и параметры, оцениваем поведение агрегата. Причину неисправности диагностика выявляет не всегда — иногда нужна дефектовка.</p>
${sharedSteps}
${sectionTitle('Вопросы')}<p><strong>На каждой Toyota стоит вариатор?</strong> Нет. Перед ремонтом сверяем агрегат по VIN или номеру кузова.</p><p><strong>Можно ли ездить с рывками?</strong> Лучше не откладывать проверку: объём работ может вырасти.</p>`,
  },
  {
    slug: 'nissan',
    name: 'Nissan',
    title: 'Ремонт вариатора Nissan во Владивостоке',
    desc: 'Ремонт вариаторов Nissan во Владивостоке. Диагностика CVT и согласование работ после дефектовки.',
    h1: 'Ремонт вариаторов Nissan во Владивостоке',
    lead: 'Если Nissan уже с вариатором, начинаем с диагностики: рывки, шум, перегрев и потеря тяги.',
    body: `<h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Когда Nissan приезжает с жалобой на коробку</h2>
<p>У Nissan встречаются и вариаторы, и другие коробки. Индекс агрегата и сам факт бесступенчатой передачи зависят от модели, года, двигателя и рынка. Мы не назначаем ремонт «вариатора Nissan» по одному названию марки.</p>
<p>Если по VIN или номеру кузова подтверждён вариатор, смотрим ошибки, поведение при разгоне и признаки перегрева. Диагностика не заменяет дефектовку.</p>
${sectionTitle('Симптомы')}<ul><li>Толчки в начале движения</li><li>Зависание оборотов без набора скорости</li><li>Гул, который меняется с оборотами</li><li>Предупреждение трансмиссии</li><li>Запах перегретого масла</li></ul>
${sharedSteps}
${sectionTitle('Вопросы')}<p><strong>Нужен ли индекс коробки до визита?</strong> Нет. Его можно уточнить по VIN или номеру кузова уже в сервисе.</p><p><strong>Диагностика сразу называет цену ремонта?</strong> После диагностики возможна только предварительная оценка. Точную стоимость определяем после дефектовки.</p>`,
  },
  {
    slug: 'honda',
    name: 'Honda',
    title: 'Ремонт вариатора Honda во Владивостоке',
    desc: 'Проверка и ремонт вариатора Honda во Владивостоке, если на автомобиле установлен CVT. Сначала диагностика, затем дефектовка.',
    h1: 'Ремонт вариаторов Honda во Владивостоке',
    lead: 'Honda выпускалась и с вариатором, и с другими коробками. Сначала выясняем, какой агрегат на машине.',
    body: `<h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Honda: не каждая модель с вариатором</h2>
<p>Одинаковое имя модели не гарантирует одну и ту же коробку: отличаются год, двигатель и рынок. Поэтому страница не обещает ремонт «любой Honda» как вариатора.</p>
<p>Если агрегат оказался вариатором, поводом для визита обычно становятся рывки, шум, перегрев или предупреждение на панели. Дальше — диагностика, а при необходимости разборка и дефектовка.</p>
${sectionTitle('Симптомы')}<ul><li>Рывки на небольшой скорости</li><li>Вибрация при постоянном ходе</li><li>Потеря тяги в горку</li><li>Перегрев при длительной нагрузке</li><li>Ошибка коробки</li></ul>
${sharedSteps}
${sectionTitle('Вопросы')}<p><strong>Можно ли прислать только фото шильдика?</strong> Полезнее VIN или номер кузова: по ним проще сверить применимость.</p><p><strong>Вы заранее называете срок ремонта?</strong> Нет. Срок зависит от состояния агрегата и становится понятен после дефектовки.</p>`,
  },
  {
    slug: 'subaru',
    name: 'Subaru',
    title: 'Ремонт вариатора Subaru во Владивостоке',
    desc: 'Диагностика вариатора Subaru во Владивостоке. Тип коробки проверяем по автомобилю, ремонт — после дефектовки.',
    h1: 'Ремонт вариаторов Subaru во Владивостоке',
    lead: 'У Subaru бесступенчатая передача встречается часто, но не на каждой версии. Проверяем конкретный автомобиль.',
    body: `<h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Subaru и бесступенчатая передача</h2>
<p>Часть Subaru оснащена вариатором, часть — другими трансмиссиями, включая механические. Полный привод и год выпуска сами по себе не доказывают тип коробки.</p>
<p>Если вариатор подтверждён, смотрим жалобы на рывки, шум и перегрев. Оценку объёма работ даём после диагностики, а точный состав ремонта — после дефектовки.</p>
${sectionTitle('Симптомы')}<ul><li>Дёрганье при старте</li><li>Гул на скорости</li><li>Перегрев в пробке или в горку</li><li>Ограничение мощности</li><li>Следы масла в районе агрегата</li></ul>
${sharedSteps}
${sectionTitle('Вопросы')}<p><strong>Полный привод означает вариатор?</strong> Нет. Привод и тип коробки — разные вещи.</p><p><strong>Что будет, если это не вариатор?</strong> Скажем об этом после сверки VIN или номера кузова и не будем описывать ремонт чужого агрегата как ремонт вариатора.</p>`,
  },
  {
    slug: 'mitsubishi',
    name: 'Mitsubishi',
    title: 'Ремонт вариатора Mitsubishi во Владивостоке',
    desc: 'Диагностика вариатора Mitsubishi во Владивостоке. Применимость проверяем по VIN или номеру кузова.',
    h1: 'Ремонт вариаторов Mitsubishi во Владивостоке',
    lead: 'У Mitsubishi вариатор бывает на части комплектаций. Перед записью на ремонт сверяем тип коробки.',
    body: `<h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Mitsubishi: сначала тип коробки</h2>
<p>В линейке Mitsubishi есть и вариаторы, и ступенчатые автоматы, и механика. Одна и та же модель в разные годы могла комплектоваться по-разному.</p>
<p>Когда вариатор подтверждён, разбираем симптомы: рывки, шум, пробуксовка, перегрев. Диагностика показывает направление работ, дефектовка — их точный объём.</p>
${sectionTitle('Симптомы')}<ul><li>Пробуксовка при разгоне</li><li>Удары после остановки</li><li>Шум, зависящий от скорости</li><li>Перегрев</li><li>Индикатор трансмиссии</li></ul>
${sharedSteps}
${sectionTitle('Вопросы')}<p><strong>Достаточно назвать модель?</strong> Нет. Нужны VIN или номер кузова, а также описание, когда проявляется симптом.</p><p><strong>Можно ли совместить визит с проверкой запчасти?</strong> Да, если заранее понятен агрегат. Совместимость детали тоже проверяем, а не обещаем по названию марки.</p>`,
  },
  {
    slug: 'suzuki',
    name: 'Suzuki',
    title: 'Проверка и ремонт коробки Suzuki во Владивостоке',
    desc: 'Suzuki во Владивостоке: проверяем, вариатор на автомобиле или другая коробка, и только потом говорим о ремонте.',
    h1: 'Проверка трансмиссии Suzuki во Владивостоке',
    lead: 'Тип коробки Suzuki зависит от модели, года, двигателя и рынка. Вариатор не назначаем всей марке заранее.',
    body: `<h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Что проверяем у Suzuki до ремонта</h2>
<p>Год, двигатель и рынок поставки меняют комплектацию. Без сверки конкретного автомобиля нельзя сказать, стоит ли вариатор, ступенчатый автомат или механика. Список моделей с CVT мы не публикуем: подтверждённой таблицы на все рынки нет.</p>
<p>На странице нет каталога моделей и индексов коробок: без документации на конкретный автомобиль это было бы догадкой. Пришлите VIN или номер кузова — скажем, какой агрегат установлен и относится ли обращение к ремонту вариатора.</p>
${sectionTitle('Когда имеет смысл приехать')}<ul><li>Рывки или зависание оборотов, если уже известно, что стоит вариатор</li><li>Шум или вибрация при наборе скорости</li><li>Перегрев и предупреждение коробки</li><li>Нужно понять тип трансмиссии перед покупкой автомобиля</li><li>Сомнение, вариатор это или ступенчатый автомат</li></ul>
${sharedSteps}
${sectionTitle('Вопросы')}<p><strong>Вы ремонтируете любую Suzuki?</strong> Сначала определяем коробку. Если это не вариатор, не называем работу ремонтом вариатора.</p><p><strong>Нужно ли везти автомобиль, чтобы узнать тип коробки?</strong> Для первичной сверки часто достаточно VIN или номера кузова. Осмотр и диагностика нужны, когда уже есть жалоба на поведение.</p>`,
  },
  {
    slug: 'lexus',
    name: 'Lexus',
    title: 'Проверка трансмиссии Lexus во Владивостоке',
    desc: 'Lexus во Владивостоке: не считаем всю марку вариаторной. Сверяем автомат или другую схему по VIN и обсуждаем ремонт только после этого.',
    h1: 'Проверка трансмиссии Lexus во Владивостоке',
    lead: 'Lexus не равен вариатору. На марке встречаются разные схемы трансмиссии, включая гибридные.',
    body: `<h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Почему для Lexus нельзя начать с «ремонта вариатора»</h2>
<p>У Lexus много ступенчатых автоматических коробок. Гибридные версии используют отдельную схему, и название вроде eCVT не доказывает, что внутри ременной вариатор. Путать эти агрегаты нельзя: диагностика и ремонт у них разные.</p>
<p>Конкретные модели и индексы здесь не перечисляются. Подтверждённого списка, который подходил бы ко всем рынкам и годам, у нас нет. Для вашего автомобиля нужны VIN или номер кузова.</p>
${sectionTitle('С чем можно обратиться')}<ul><li>Толчки или задержки ступенчатого автомата</li><li>Предупреждение трансмиссии или гибридной системы</li><li>Нужно понять, какой агрегат установлен, до разговора о ремонте</li><li>Посторонний шум со стороны коробки</li><li>Проверка перед покупкой, без обещания результата по одной марке</li></ul>
${sharedSteps}
${sectionTitle('Вопросы')}<p><strong>Гибридный Lexus — это вариатор?</strong> Так заранее сказать нельзя. Сначала сверяем тип установки по данным автомобиля.</p><p><strong>Вы даёте гарантию на ремонт Lexus?</strong> На этой странице гарантия не обещается. Условия, если они будут, обсуждаются отдельно и только после понятного объёма работ.</p>`,
  },
  {
    slug: 'infiniti',
    name: 'Infiniti',
    title: 'Проверка трансмиссии Infiniti во Владивостоке',
    desc: 'Infiniti во Владивостоке: тип коробки не выводим из названия марки. Проверяем по VIN или номеру кузова и только потом говорим о ремонте.',
    h1: 'Проверка трансмиссии Infiniti во Владивостоке',
    lead: 'У Infiniti тип трансмиссии зависит от года, двигателя и рынка. Вариатор не считаем свойством всей марки.',
    body: `<h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Infiniti: вариатор только если он действительно установлен</h2>
<p>Модель в объявлении или на шильдике багажника тип коробки не доказывает: важны год, двигатель и рынок. Пока агрегат не сверен, не называем его вариатором.</p>
<p>Мы не публикуем здесь индексы коробок и список моделей. Таких подтверждённых данных, чтобы переносить их на все Infiniti, недостаточно. Идентификация идёт по VIN или номеру кузова.</p>
${sectionTitle('Поводы для обращения')}<ul><li>Рывки, если по документам уже ясно, что стоит вариатор</li><li>Толчки ступенчатого автомата — это отдельная задача, не ремонт вариатора</li><li>Шум при разгоне</li><li>Ограничение динамики и индикатор коробки</li><li>Нужна проверка типа трансмиссии до покупки</li></ul>
${sharedSteps}
${sectionTitle('Вопросы')}<p><strong>Достаточно сказать «Infiniti с вариатором»?</strong> Нет. Попросим VIN или номер кузова и сверим агрегат.</p><p><strong>Можно ли оценить ремонт по пробегу?</strong> Пробег не заменяет диагностику и дефектовку. Предварительную оценку не выдаём вслепую.</p>`,
  },
  {
    slug: 'mazda',
    name: 'Mazda',
    title: 'Проверка типа трансмиссии Mazda во Владивостоке',
    desc: 'Mazda во Владивостоке: SKYACTIV-DRIVE — шестиступенчатый автомат, не вариатор. Тип коробки проверяем по VIN, без списка выдуманных CVT-моделей.',
    h1: 'Проверка типа трансмиссии Mazda во Владивостоке',
    lead: 'У Mazda нельзя начинать с утверждения, что на автомобиле вариатор. Сначала устанавливаем тип коробки.',
    body: `<h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Какие коробки у Mazda уже описаны производителем</h2>
<p>По материалам Mazda, SKYACTIV-DRIVE — это шестиступенчатая автоматическая коробка с гидротрансформатором, а не вариатор. В техническом обзоре Mazda 2012 года вариатор, робот с двумя сцеплениями и ступенчатый автомат разобраны как разные типы, и SKYACTIV-DRIVE относится к ступенчатому автомату. В релизе Mazda Newsroom от 27 сентября 2011 года о Axela шестиступенчатый SKYACTIV-DRIVE указан для версий SKYACTIV-G 2.0.</p>
<p>Тот же релиз показывает, что у Mazda одновременно были и другие коробки: для японской Axela 1.5 в комплектациях 15C и 15S указан CVT (Activematic), а у части полноприводных версий — четырёхступенчатый автомат. Значит, вариатор у марки встречался на отдельных комплектациях, но SKYACTIV-DRIVE вариатором не является. Переносить пример 2011 года на любую сегодняшнюю Mazda нельзя.</p>
<p>Актуальный перечень моделей с вариатором по всем рынкам мы здесь не составляем: для вашего автомобиля его нет в виде проверенной таблицы. Привозите VIN или номер кузова.</p>
${sectionTitle('Что можно проверить в сервисе')}<ul><li>Стоит ли на машине вариатор, ступенчатый автомат или другая схема</li><li>Относится ли жалоба к бесступенчатой передаче или к обычному автомату</li><li>Есть ли ошибки и как агрегат ведёт себя при движении, если тип уже ясен</li><li>Нужна ли дефектовка, если диагностики недостаточно</li></ul>
${sharedSteps}
${sectionTitle('Вопросы')}<p><strong>На Mazda CX-5 или Mazda 6 точно есть вариатор?</strong> Так утверждать нельзя. У версий со SKYACTIV-DRIVE производитель описывает шестиступенчатый автомат. Конкретную машину сверяем по VIN или номеру кузова.</p><p><strong>Если окажется ступенчатый автомат, вы всё равно называете это ремонтом вариатора?</strong> Нет. Разговор о вариаторе возможен только после подтверждения типа агрегата.</p>`,
  },
  {
    slug: 'daihatsu',
    name: 'Daihatsu',
    title: 'Проверка трансмиссии Daihatsu во Владивостоке',
    desc: 'Daihatsu во Владивостоке: тип коробки не выводим из компактного класса. Проверяем по номеру кузова или VIN.',
    h1: 'Проверка трансмиссии Daihatsu во Владивостоке',
    lead: 'Компактный кузов Daihatsu сам по себе не означает вариатор. Тип коробки смотрим по конкретному автомобилю.',
    body: `<h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Daihatsu без каталога «все модели с CVT»</h2>
<p>Внешне похожие машины разных лет могут отличаться агрегатом и рынком поставки. Готового проверенного списка моделей и индексов, который можно честно положить на сайт, у нас нет, поэтому наличие вариатора заранее не утверждаем.</p>
<p>Поэтому обращение начинается со сверки. Номер кузова для таких автомобилей часто полезнее одного торгового имени. Если вариатор подтверждён, дальше идут диагностика и, при необходимости, дефектовка. Если коробка другая, не описываем работу как ремонт вариатора.</p>
${sectionTitle('Когда писать или приезжать')}<ul><li>Нужно узнать тип коробки до покупки</li><li>Рывки или шум, и есть подозрение на вариатор</li><li>Перегрев или индикатор трансмиссии</li><li>Неясная комплектация по объявлению</li></ul>
${sharedSteps}
${sectionTitle('Вопросы')}<p><strong>Подойдёт фото автомобиля?</strong> Для типа коробки надёжнее VIN или номер кузова.</p><p><strong>Вы называете цену ремонта Daihatsu на сайте?</strong> Нет. Сумму не назначаем до диагностики, а точный объём — до дефектовки.</p>`,
  },
  {
    slug: 'renault',
    name: 'Renault',
    title: 'Проверка трансмиссии Renault во Владивостоке',
    desc: 'Renault во Владивостоке: механика, автомат, робот или вариатор зависят от модели и рынка. Ремонт обсуждаем после сверки по VIN.',
    h1: 'Проверка трансмиссии Renault во Владивостоке',
    lead: 'У Renault тип коробки зависит от модели, года, двигателя и рынка. Вариатор не выводим из одного названия марки.',
    body: `<h2 style="color:var(--text);font-size:1.25rem;margin-bottom:.85rem">Renault: сначала тип коробки</h2>
<p>В зависимости от модели, года, двигателя и рынка схема трансмиссии меняется. Общее имя вроде «автомат» в объявлении варианты не различает, а наличие вариатора без сверки мы не утверждаем.</p>
<p>Индексы агрегатов и перечень моделей с вариатором здесь намеренно не приведены: переносить чужие комплектации на ваш автомобиль было бы ошибкой. Нужны VIN или номер кузова и описание симптома.</p>
${sectionTitle('С чем обращаются')}<ul><li>Сомнение, вариатор на машине или другая коробка</li><li>Рывки и зависание оборотов при уже известном вариаторе</li><li>Толчки робота или ступенчатого автомата — отдельная проверка, не ремонт вариатора</li><li>Шум и предупреждение трансмиссии</li><li>Осмотр перед покупкой</li></ul>
${sharedSteps}
${sectionTitle('Вопросы')}<p><strong>Renault с «автоматом» — это вариатор?</strong> Не обязательно. Так говорят и про ступенчатый автомат, и про другие схемы.</p><p><strong>Можно ли сразу заказать запчасть по марке?</strong> Нет. Совместимость проверяем по автомобилю, а не по надписи Renault.</p>`,
  },
];

function brandNav(current) {
  return `<nav class="brand-nav" aria-label="Другие марки">${brands
    .map((item) =>
      item.slug === current
        ? `<span aria-current="page">${item.name}</span>`
        : `<a href="${item.slug}.html">${item.name}</a>`,
    )
    .join('')}</nav>`;
}

write(
  'variatory/index.html',
  shell({
    title: 'Ремонт вариаторов по маркам во Владивостоке',
    desc: 'Каталог марок FTC: Toyota, Nissan, Honda, Subaru, Mitsubishi, Suzuki, Lexus, Infiniti, Mazda, Daihatsu, Renault. Тип коробки проверяем по автомобилю.',
    canonical: 'https://example.ru/variatory/',
    base: '../',
    body:
      pageTop(`<a href="../index.html">Главная</a><span>/</span><span>Вариаторы</span>`, 'Вариаторы по маркам', 'У каждой марки своя страница. Вариатор стоит не на каждом автомобиле: если марки нет в списке или тип коробки неочевиден, уточните возможность ремонта.') +
      `<section class="section" style="padding-top:0"><div class="wrap"><div class="brands" data-brands></div><p class="brands-note" data-brands-note></p>${brandNav('')}</div></section>`,
  }),
);

for (const brand of brands) {
  write(
    `variatory/${brand.slug}.html`,
    shell({
      title: brand.title,
      desc: brand.desc,
      canonical: `https://example.ru/variatory/${brand.slug}.html`,
      base: '../',
      brand: brand.name,
      body:
        pageTop(
          `<a href="../index.html">Главная</a><span>/</span><a href="index.html">Вариаторы</a><span>/</span><span>${brand.name}</span>`,
          brand.h1,
          brand.lead,
          `<div style="margin-top:1.25rem"><button class="btn btn--primary" type="button" data-open-modal="book"${bookAttr(brand.name)}>Записаться на диагностику</button></div>`,
        ) +
        `<section class="section" style="padding-top:0"><div class="wrap stack">
          <article class="contact-card prose">${brand.body}${sharedContacts}</article>
          <div class="finale"><div><h2>Нужна проверка ${brand.name}?</h2><p>Опишите симптомы. В форме уже будет марка этого автомобиля.</p></div><div class="finale-actions"><button class="btn btn--primary" type="button" data-open-modal="book"${bookAttr(brand.name)}>Записаться</button><a class="btn btn--ghost" href="../contacts.html">Контакты</a></div></div>
          ${sectionTitle('Другие марки')}${brandNav(brand.slug)}
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
     <p>Если симптомы повторяются — не стоит ждать, пока неисправность усугубится. Начните с диагностики: так проще оценить состояние коробки и понять, нужен ли ремонт, замена масла или дальнейшая дефектовка.</p>
     <p>Самодиагностика по роликам не заменяет проверку параметров и состояния агрегата в сервисе.</p>`,
  ],
  [
    'kogda-menyat-maslo-v-variatore.html',
    'Когда менять масло в вариаторе',
    'Замена масла в вариаторе: ориентиры по регламенту, состоянию масла и условиям эксплуатации во Владивостоке.',
    `<p>Срок замены зависит от регламента производителя, стиля езды и состояния масла. Тёмное масло, запах гари или стружка — повод для проверки.</p>
     <p>Важно подбирать масло под конкретный тип CVT. Универсальные «масла для автомата» подходят не всегда.</p>`,
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
     <p>Перегрев опасен для масла и узлов вариатора. Диагностика поможет оценить состояние и понять, связана ли проблема с охлаждением, уровнем масла или износом.</p>`,
  ],
  [
    'mozhno-li-ezdit-s-oshibkoj-variatora.html',
    'Можно ли ездить с ошибкой вариатора',
    'Ошибка трансмиссии/CVT: стоит ли продолжать поездки и как действовать во Владивостоке.',
    `<p>Ошибка на панели — сигнал, а не диагноз. Иногда автомобиль уходит в защитный режим с потерей динамики. Продолжать поездки «пока едет» рискованно: неисправность может усугубиться.</p>
     <p>Оптимальный шаг — считать коды и проверить параметры на диагностике, затем согласовать дальнейшие действия.</p>`,
  ],
  [
    'skolko-stoit-remont-variatora.html',
    'Сколько стоит ремонт вариатора',
    'От чего зависит стоимость ремонта вариатора во Владивостоке: предварительная оценка и точная цена после дефектовки.',
    `<p>Цена зависит от марки/модели, типа CVT, характера неисправности и объёма работ.</p>
     <p>После диагностики возможна предварительная оценка стоимости. Точная стоимость ремонта определяется после дефектовки — разборки и проверки деталей коробки передач.</p>
     <p>Порядок работы: диагностика и предварительная оценка → разборка и дефектовка → согласование точной стоимости → ремонт и сборка.</p>`,
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
    'Ориентировочная стоимость услуг — ремонт вариаторов во Владивостоке',
    'Ориентировочные цены на ремонт вариатора и АКПП во Владивостоке. Точная стоимость — после дефектовки.',
    'Ориентировочная стоимость услуг',
    'Указаны ориентировочные цены. Точная стоимость ремонта определяется после дефектовки.',
    `<div data-prices></div><div style="margin-top:1.25rem"><button class="btn btn--primary" type="button" data-open-modal="book">Узнать стоимость</button></div>`,
  ],
  [
    'cases.html',
    'Примеры ремонта вариаторов во Владивостоке',
    'Реальные работы по ремонту CVT во Владивостоке: проблема, диагностика, результат.',
    'Примеры',
    'Публикуем только подтверждённые ремонты.',
    `<div data-cases></div>`,
  ],
  [
    'about.html',
    'О компании — сервис ремонта вариаторов во Владивостоке',
    'Автосервис во Владивостоке со специализацией на вариаторах и АКПП.',
    'О компании',
    'Фокус на диагностике и ремонте CVT.',
    `<article class="contact-card prose"><p>Мы позиционируем сервис как профильный по вариаторам (CVT), АКПП и DSG: симптомы → диагностика → согласование → ремонт.</p></article><div class="trust-grid" data-trust style="margin-top:1rem"></div>`,
  ],
  [
    'contacts.html',
    'Контакты FTC — Владивосток, Западная 11',
    'FTC: Владивосток, Западная улица, 11, 1-й этаж. Тел. +7 (914) 664-32-90. Ремонт вариаторов, АКПП и продажа автозапчастей.',
    'Контакты',
    'Свяжитесь с сервисом или оставьте заявку.',
    `<div class="contacts-grid"><div class="contact-card"><ul class="contact-list"><li><span>Адрес</span><strong data-text="address"></strong></li><li><span>Телефон</span><strong><a data-href="phone" href="tel:+79146643290"><span data-text="phone"></span></a></strong></li><li><span>График</span><strong data-text="weekdays"></strong><br><strong data-text="weekend"></strong></li></ul><div class="contact-actions"><a class="btn btn--primary" data-href="phone" href="tel:+79146643290">Позвонить</a><button class="btn btn--soft" type="button" data-open-modal="book">Записаться</button><a class="btn btn--ghost" data-map="route" href="https://2gis.ru/vladivostok/firm/70000001028631070" target="_blank" rel="noopener noreferrer">Построить маршрут</a></div></div><div class="map-box"><div class="map-embed" data-2gis-map data-org="70000001028631070" data-city="vladivostok" data-lat="43.122425" data-lon="131.877191" data-zoom="16" data-title="FTC на карте 2ГИС — Владивосток, Западная улица, 11"><p class="map-embed__placeholder">Загрузка карты 2ГИС…</p></div><p class="map-box__fallback" data-map-fallback hidden>Карта временно недоступна. Откройте карточку компании по кнопке ниже.</p><div class="map-box__actions"><a class="btn btn--ghost" data-map="twogis" href="https://2gis.ru/vladivostok/firm/70000001028631070" target="_blank" rel="noopener noreferrer">Открыть в 2ГИС</a></div></div></div>`,
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
  ...brands.map((brand) => `/variatory/${brand.slug}.html`),
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
