/**
 * Точечно обновляет название и контакты в существующей БД.
 * Не трогает услуги, цены, галерею и прочий контент.
 */
import { initDb, getContent, saveContent } from './src/db.js';
import { createBackupSync } from './src/backup.js';

const PATCH = {
  name: 'FTC',
  shortName: 'FTC',
  tagline: 'Ремонт вариаторов, АКПП и продажа автозапчастей',
  phone: '+7 (914) 664-32-90',
  phoneHref: 'tel:+79146643290',
  email: 'taburetka1278@yandex.ru',
  address: 'Владивосток, Западная улица, 11, 1-й этаж',
  maps: {
    yandex: '',
    twogis: 'https://2gis.ru/vladivostok/firm/70000001028631070',
    route: 'https://2gis.ru/vladivostok/firm/70000001028631070',
  },
  messengers: {
    whatsapp: 'https://wa.me/79146643290',
    telegram: 'https://t.me/+79146643290',
    max: '',
  },
  legal: {
    entity: '',
    inn: '',
  },
  // утверждённый заказчиком график — не из 2ГИС
  schedule: {
    weekdays: 'Пн–Пт: 09:00–17:00',
    weekend: 'Сб: 09:00–13:00 · Вс: выходной',
    short: 'Пн–Пт 09:00–17:00, Сб 09:00–13:00, Вс выходной',
  },
};

initDb();
const backup = createBackupSync();
console.log('Backup:', backup.id);

const { data } = getContent();
const before = {
  name: data.name,
  services: data.services?.length,
  prices: data.prices?.length,
  gallery: data.gallery?.[0]?.src,
};

Object.assign(data, {
  name: PATCH.name,
  shortName: PATCH.shortName,
  tagline: PATCH.tagline,
  phone: PATCH.phone,
  phoneHref: PATCH.phoneHref,
  email: PATCH.email,
  address: PATCH.address,
  maps: { ...(data.maps || {}), ...PATCH.maps },
  messengers: { ...(data.messengers || {}), ...PATCH.messengers },
  legal: { ...(data.legal || {}), ...PATCH.legal },
  schedule: { ...PATCH.schedule },
});

const updatedAt = saveContent(data);
const { data: after } = getContent();

console.log('Patched contacts at', updatedAt);
console.log('Before name:', before.name, '→', after.name);
console.log('Phone:', after.phone, after.phoneHref);
console.log('Address:', after.address);
console.log('WhatsApp:', after.messengers.whatsapp);
console.log('2GIS:', after.maps.twogis);
console.log('Schedule:', after.schedule.weekdays, '|', after.schedule.weekend);
console.log(
  'Preserved counts — services:',
  after.services?.length,
  'prices:',
  after.prices?.length,
  'gallery0:',
  after.gallery?.[0]?.src,
);
