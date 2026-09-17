/**
 * Конфигурация сайта.
 * Замените плейсхолдеры на реальные данные клиента перед запуском.
 */
export const siteConfig = {
  name: '[Название компании]',
  shortName: 'ВариСервис',
  tagline: 'Ремонт вариаторов во Владивостоке',
  city: 'Владивосток',
  region: 'Приморский край',
  country: 'Россия',

  phone: '+7 (___) ___-__-__',
  phoneHref: 'tel:+70000000000',
  email: 'info@example.ru',

  address: {
    full: '[Адрес сервиса], Владивосток',
    street: '[Улица, дом]',
    city: 'Владивосток',
    postalCode: '[Индекс]',
  },

  workingHours: {
    weekdays: 'Пн–Пт: [время]',
    saturday: 'Сб: [время]',
    sunday: 'Вс: [время]',
    short: '[Режим работы]',
  },

  /** Координаты для карты — заменить на реальные */
  geo: {
    lat: 43.1155,
    lng: 131.8855,
  },

  messengers: {
    whatsapp: 'https://wa.me/70000000000',
    telegram: 'https://t.me/username',
    max: '',
  },

  social: {
    vk: '',
    youtube: '',
    dzen: '',
  },

  /** Плейсхолдеры фактов — не публиковать как реальные цифры */
  facts: {
    experience: '[Опыт работы]',
    warranty: '[Гарантия на работы]',
    diagnostics: 'Диагностика перед ремонтом',
    repairs: 'Реальные ремонты с фотоотчётом',
    booking: 'Удобная запись',
  },

  legal: {
    entity: '[ООО / ИП — реквизиты]',
    inn: 'ИНН: [номер]',
    privacyEmail: 'privacy@example.ru',
  },

  /** Подключение аналитики — вставить ID после регистрации */
  analytics: {
    yandexMetrikaId: '',
    googleAnalyticsId: '',
    yandexWebmasterVerification: '',
    googleSearchConsoleVerification: '',
  },

  baseUrl: 'https://example.ru',
} as const;

export const navLinks = [
  { label: 'Услуги', href: '/uslugi/' },
  { label: 'Цены', href: '/ceny/' },
  { label: 'Вариаторы', href: '/variatory/' },
  { label: 'Наши работы', href: '/raboty/' },
  { label: 'Отзывы', href: '/otzyvy/' },
  { label: 'FAQ', href: '/faq/' },
  { label: 'Контакты', href: '/kontakty/' },
] as const;
