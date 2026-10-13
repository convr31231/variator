import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { config } from './config.js';
import { parsePriceLabel } from './price.js';

function loadDefaultBusiness() {
  const file = path.join(config.siteRoot, 'js', 'data.js');
  const code = fs.readFileSync(file, 'utf8');
  const sandbox = { window: {} };
  vm.runInNewContext(code, sandbox, { timeout: 3000 });
  if (!sandbox.window.BUSINESS) {
    throw new Error('Не удалось прочитать исходные данные из js/data.js');
  }
  return structuredClone(sandbox.window.BUSINESS);
}

function withPrice(item) {
  const p = parsePriceLabel(item.price);
  return { ...item, ...p };
}

export function buildSeedContent() {
  const b = loadDefaultBusiness();
  return {
    name: b.name,
    shortName: b.shortName,
    tagline: b.tagline,
    city: b.city,
    phone: b.phone,
    phoneHref: b.phoneHref,
    email: b.email,
    address: b.address,
    schedule: {
      weekdays: b.schedule?.weekdays || 'Пн–Пт: 09:00–17:00',
      weekend: b.schedule?.weekend || 'Сб: 09:00–13:00 · Вс: выходной',
      short: b.schedule?.short || 'Пн–Пт 09:00–17:00, Сб 09:00–13:00, Вс выходной',
    },
    maps: b.maps || { yandex: '', twogis: '', route: '' },
    messengers: b.messengers || { whatsapp: '', telegram: '', max: '' },
    baseUrl: b.baseUrl || '',
    legal: b.legal || { entity: '', inn: '' },
    heroTitle: b.heroTitle || 'Ремонт вариаторов во Владивостоке',
    heroSub:
      b.heroSub ||
      'Диагностика, ремонт вариаторов (CVT), АКПП и DSG. После диагностики возможна предварительная оценка. Точную стоимость определяем после дефектовки и согласуем перед ремонтом.',
    trustPoints: b.trustPoints || [],
    services: (b.services || []).map((s, i) => ({ ...withPrice(s), sortOrder: i })),
    symptoms: b.symptoms || [],
    diagnosticsSteps: b.diagnosticsSteps || [],
    processTransparent: b.processTransparent || [],
    prices: (b.prices || []).map((p, i) => ({ ...withPrice(p), sortOrder: i })),
    priceNote: b.priceNote || '',
    priceDisclaimer: b.priceDisclaimer || '',
    brandsNote: b.brandsNote || '',
    brands: b.brands || [],
    partsFilters: b.partsFilters || [],
    parts: (b.parts || []).map((p, i) => ({ ...withPrice(p), sortOrder: i })),
    partsVinNote: b.partsVinNote || '',
    cases: (b.cases || []).map((c, i) => ({ ...c, id: c.id || `case-${i + 1}`, sortOrder: i, image: c.image || '' })),
    reviews: b.reviews || [],
    gallery: (b.gallery || []).map((g, i) => ({ ...g, id: g.id || `gallery-${i + 1}`, sortOrder: i })),
    articles: b.articles || [],
    faq: b.faq || [],
    warranty: b.warranty || { enabled: false, title: '', text: '' },
  };
}
