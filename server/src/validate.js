import { normalizePriceFields } from './price.js';

function str(v, max, field) {
  const s = String(v ?? '').trim();
  if (s.length > max) throw new Error(`${field}: слишком длинное значение (макс. ${max})`);
  return s;
}

function arr(v, field) {
  if (!Array.isArray(v)) throw new Error(`${field}: ожидается список`);
  return v;
}

function httpsUrl(value, max, field) {
  const s = str(value, max, field);
  if (!s) return '';
  let parsed;
  try {
    parsed = new URL(s);
  } catch {
    throw new Error(`${field}: нужна корректная HTTPS-ссылка`);
  }
  if (parsed.protocol !== 'https:' || !parsed.hostname) {
    throw new Error(`${field}: разрешены только HTTPS-ссылки`);
  }
  return s;
}

function normalizeListWithPrice(list, field, mapItem) {
  return arr(list, field).map((item, index) => {
    const base = mapItem(item, index);
    const price = normalizePriceFields(item);
    return { ...base, ...price, sortOrder: Number.isFinite(item.sortOrder) ? item.sortOrder : index };
  });
}

export function validateContent(input) {
  if (!input || typeof input !== 'object') throw new Error('Некорректные данные');

  const schedule = input.schedule || {};
  const data = {
    name: str(input.name, 120, 'Название'),
    shortName: str(input.shortName, 80, 'Короткое название'),
    tagline: str(input.tagline, 200, 'Слоган'),
    city: str(input.city, 80, 'Город'),
    phone: str(input.phone, 40, 'Телефон'),
    phoneHref: str(input.phoneHref, 40, 'Ссылка телефона'),
    email: str(input.email, 120, 'Email'),
    address: str(input.address, 240, 'Адрес'),
    schedule: {
      weekdays: str(schedule.weekdays, 80, 'График будни'),
      weekend: str(schedule.weekend, 120, 'График выходные'),
      short: str(schedule.short, 160, 'График кратко'),
    },
    maps: {
      yandex: httpsUrl(input.maps?.yandex, 500, 'Ссылка на Яндекс Карты'),
      twogis: str(input.maps?.twogis, 500, '2GIS'),
      route: str(input.maps?.route, 500, 'Маршрут'),
      widget: {
        orgId: str(input.maps?.widget?.orgId || '70000001028631070', 40, '2ГИС orgId'),
        city: str(input.maps?.widget?.city || 'vladivostok', 80, '2ГИС city'),
        lat: Number(input.maps?.widget?.lat ?? 43.122425),
        lon: Number(input.maps?.widget?.lon ?? 131.877191),
        zoom: Number(input.maps?.widget?.zoom) || 16,
      },
    },
    messengers: {
      whatsapp: str(input.messengers?.whatsapp, 500, 'WhatsApp'),
      telegram: str(input.messengers?.telegram, 500, 'Telegram'),
      max: httpsUrl(input.messengers?.max, 500, 'Ссылка на MAX'),
    },
    baseUrl: str(input.baseUrl, 200, 'Базовый URL'),
    legal: {
      entity: str(input.legal?.entity, 200, 'Юрлицо'),
      inn: str(input.legal?.inn, 80, 'ИНН'),
    },
    heroTitle: str(input.heroTitle, 160, 'Заголовок на главной'),
    heroSub: str(input.heroSub, 600, 'Подзаголовок на главной'),
    trustPoints: arr(input.trustPoints, 'Преимущества').map((t, i) => ({
      title: str(t.title, 120, `Преимущество ${i + 1}: заголовок`),
      text: str(t.text, 500, `Преимущество ${i + 1}: текст`),
    })),
    services: normalizeListWithPrice(input.services, 'Услуги', (s, i) => ({
      slug: str(s.slug || `service-${i + 1}`, 80, 'Услуга: код'),
      title: str(s.title, 160, 'Услуга: название'),
      short: str(s.short, 500, 'Услуга: описание'),
      href: str(s.href || '#', 200, 'Услуга: ссылка'),
      featured: Boolean(s.featured),
    })),
    symptoms: arr(input.symptoms, 'Симптомы').map((s, i) => ({
      title: str(s.title, 120, `Симптом ${i + 1}`),
      meaning: str(s.meaning, 400, `Симптом ${i + 1}: смысл`),
      action: str(s.action, 200, `Симптом ${i + 1}: действие`),
    })),
    diagnosticsSteps: arr(input.diagnosticsSteps, 'Шаги диагностики').map((s, i) => ({
      n: str(s.n || String(i + 1).padStart(2, '0'), 8, 'Шаг: номер'),
      title: str(s.title, 120, 'Шаг: название'),
      text: str(s.text, 500, 'Шаг: текст'),
    })),
    processTransparent: arr(input.processTransparent, 'Прозрачный процесс').map((s, i) => ({
      title: str(s.title, 120, `Процесс ${i + 1}`),
      text: str(s.text, 400, `Процесс ${i + 1}: текст`),
    })),
    prices: normalizeListWithPrice(input.prices, 'Цены', (p) => ({
      title: str(p.title, 160, 'Цена: название'),
    })),
    priceNote: str(input.priceNote, 800, 'Примечание к ценам'),
    priceDisclaimer: str(input.priceDisclaimer, 800, 'Дисклеймер цен'),
    brandsNote: str(input.brandsNote, 300, 'Примечание к маркам'),
    brands: arr(input.brands, 'Марки').map((b, i) => ({
      slug: str(b.slug || `brand-${i + 1}`, 80, 'Марка: код'),
      name: str(b.name, 80, 'Марка: название'),
      href: str(b.href || '', 200, 'Марка: ссылка'),
    })),
    partsFilters: arr(input.partsFilters, 'Фильтры запчастей').map((f, i) =>
      str(f, 60, `Фильтр ${i + 1}`),
    ),
    parts: normalizeListWithPrice(input.parts, 'Запчасти', (p, i) => ({
      id: str(p.id || `part-${i + 1}`, 80, 'Запчасть: id'),
      title: str(p.title, 160, 'Запчасть: название'),
      description: str(p.description, 800, 'Запчасть: описание'),
      image: str(p.image || '', 300, 'Запчасть: фото'),
      fits: arr(p.fits || [], 'Применимость').map((f, j) => str(f, 120, `Применимость ${j + 1}`)),
      brands: arr(p.brands || [], 'Марки запчасти').map((f, j) => str(f, 60, `Марка ${j + 1}`)),
    })),
    partsVinNote: str(input.partsVinNote, 400, 'Подсказка VIN'),
    cases: arr(input.cases, 'Примеры').map((c, i) => ({
      id: str(c.id || `case-${i + 1}`, 80, 'Пример: id'),
      car: str(c.car, 160, 'Пример: автомобиль'),
      problem: str(c.problem, 600, 'Пример: проблема'),
      diagnostics: str(c.diagnostics, 600, 'Пример: диагностика'),
      work: str(c.work, 600, 'Пример: работы'),
      result: str(c.result, 600, 'Пример: результат'),
      image: str(c.image || '', 300, 'Пример: фото'),
      sortOrder: Number.isFinite(c.sortOrder) ? c.sortOrder : i,
    })),
    reviews: arr(input.reviews, 'Отзывы').map((r, i) => ({
      author: str(r.author, 120, `Отзыв ${i + 1}: автор`),
      text: str(r.text, 800, `Отзыв ${i + 1}: текст`),
    })),
    gallery: arr(input.gallery, 'Галерея').map((g, i) => ({
      id: str(g.id || `gallery-${i + 1}`, 80, 'Фото: id'),
      src: str(g.src, 300, 'Фото: путь'),
      alt: str(g.alt, 200, 'Фото: подпись'),
      sortOrder: Number.isFinite(g.sortOrder) ? g.sortOrder : i,
    })),
    articles: arr(input.articles, 'Статьи').map((a, i) => ({
      href: str(a.href, 300, `Статья ${i + 1}: ссылка`),
      title: str(a.title, 200, `Статья ${i + 1}: заголовок`),
      lead: str(a.lead, 400, `Статья ${i + 1}: описание`),
    })),
    faq: arr(input.faq, 'FAQ').map((f, i) => ({
      q: str(f.q, 300, `FAQ ${i + 1}: вопрос`),
      a: str(f.a, 1200, `FAQ ${i + 1}: ответ`),
    })),
    warranty: {
      enabled: Boolean(input.warranty?.enabled),
      title: str(input.warranty?.title, 160, 'Гарантия: заголовок'),
      text: str(input.warranty?.text, 800, 'Гарантия: текст'),
    },
  };

  data.services.sort((a, b) => a.sortOrder - b.sortOrder);
  data.prices.sort((a, b) => a.sortOrder - b.sortOrder);
  data.parts.sort((a, b) => a.sortOrder - b.sortOrder);
  data.cases.sort((a, b) => a.sortOrder - b.sortOrder);
  data.gallery.sort((a, b) => a.sortOrder - b.sortOrder);

  return data;
}

export function collectUploadRefs(content) {
  const refs = new Set();
  for (const g of content.gallery || []) if (g.src) refs.add(g.src);
  for (const p of content.parts || []) if (p.image) refs.add(p.image);
  for (const c of content.cases || []) if (c.image) refs.add(c.image);
  return [...refs];
}
