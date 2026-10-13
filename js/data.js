/**
 * Данные бизнеса. Заполните контакты и мессенджеры перед публикацией.
 */
window.BUSINESS = {
  name: 'FTC',
  shortName: 'FTC',
  tagline: 'Ремонт вариаторов, АКПП и продажа автозапчастей',
  city: 'Владивосток',
  phone: '+7 (914) 664-32-90',
  phoneHref: 'tel:+79146643290',
  email: 'taburetka1278@yandex.ru',
  address: 'Владивосток, Западная улица, 11, 1-й этаж',
  schedule: {
    weekdays: 'Пн–Пт: 09:00–17:00',
    weekend: 'Сб: 09:00–13:00 · Вс: выходной',
    short: 'Пн–Пт 09:00–17:00, Сб 09:00–13:00, Вс выходной',
  },
  geo: null,
  maps: {
    yandex: '',
    twogis: 'https://2gis.ru/vladivostok/firm/70000001028631070',
    route: 'https://2gis.ru/vladivostok/firm/70000001028631070',
    // Официальный виджет firmsonmap (widgets.2gis.com / DGWidgetLoader).
    // lat/lon — point организации из карточки 2ГИС, не параметр m ссылки просмотра.
    widget: {
      orgId: '70000001028631070',
      city: 'vladivostok',
      lat: 43.122425,
      lon: 131.877191,
      zoom: 16,
    },
  },
  messengers: {
    whatsapp: 'https://wa.me/79146643290',
    telegram: 'https://t.me/+79146643290',
    max: '',
  },
  baseUrl: 'https://example.ru',
  legal: {
    entity: '',
    inn: '',
  },
  heroTitle: 'Ремонт вариаторов во Владивостоке',
  heroSub:
    'Диагностика, ремонт вариаторов (CVT), АКПП и DSG. После диагностики возможна предварительная оценка. Точную стоимость определяем после дефектовки и согласуем перед ремонтом.',

  trustPoints: [
    { title: 'Специализация на CVT', text: 'Фокус на диагностике и ремонте вариаторов, а не «ремонт всего подряд».' },
    { title: 'Сначала диагностика', text: 'Оцениваем состояние коробки и определяем дальнейшие действия. Причину неисправности диагностика выявляет не всегда.' },
    { title: 'Точная цена после дефектовки', text: 'Точную стоимость ремонта определяем после разборки и дефектовки. Дальнейший ремонт — после согласования с клиентом.' },
    { title: 'Запись во Владивостоке', text: 'Удобно записаться по телефону или через форму на сайте.' },
  ],

  services: [
    {
      slug: 'diagnostika',
      title: 'Диагностика вариатора',
      short: 'Оценка состояния коробки, ошибок и поведения агрегата. Помогает понять, что делать дальше.',
      href: 'services/diagnostika.html',
      featured: true,
      price: 'по запросу',
    },
    {
      slug: 'remont-variatora',
      title: 'Ремонт вариаторов (CVT)',
      short: 'Ремонт после диагностики, дефектовки и согласования точной стоимости.',
      href: 'services/remont-variatora.html',
      featured: false,
      price: 'от 30 000 ₽',
    },
    {
      slug: 'remont-akpp',
      title: 'Ремонт АКПП',
      short: 'Диагностика, дефектовка и ремонт автоматических коробок.',
      href: 'services/remont-akpp.html',
      featured: false,
      price: 'от 25 000 ₽',
    },
    {
      slug: 'zamena-masla',
      title: 'Замена масла',
      short: 'Замена масла в вариаторе, АКПП, DSG с подбором подходящей жидкости по каталогу.',
      href: 'services/zamena-masla.html',
      featured: false,
      price: 'от 4 000 ₽',
    },
  ],

  symptoms: [
    { title: 'Рывки', meaning: 'Часто связано с давлением, гидроблоком или износом.', action: 'Записаться на диагностику' },
    { title: 'Вибрации', meaning: 'Возможен износ узлов или нарушение работы шкивов.', action: 'Проверить вариатор' },
    { title: 'Гул / шум', meaning: 'Может указывать на износ цепи, подшипников или шкивов.', action: 'Не откладывать проверку' },
    { title: 'Пробуксовка', meaning: 'Обороты растут, динамика падает — риск усугубления.', action: 'Диагностика' },
    { title: 'Задержка реакции', meaning: 'Пауза при трогании или смене режима.', action: 'Диагностика' },
    { title: 'Перегрев', meaning: 'Риск повреждения масла и узлов агрегата.', action: 'Остановить нагрузку и проверить' },
    { title: 'Ошибки', meaning: 'Коды помогают сузить круг причин, но не заменяют проверку.', action: 'Считать ошибки' },
    { title: 'Потеря динамики', meaning: 'Вариатор может уходить в защитный режим.', action: 'Диагностика' },
  ],

  diagnosticsSteps: [
    { n: '01', title: 'Обращение', text: 'Описываете симптомы и автомобиль — по телефону или в форме.' },
    { n: '02', title: 'Уточнение', text: 'Специалист задаёт вопросы: когда началось, при каких режимах проявляется.' },
    { n: '03', title: 'Диагностика', text: 'Оцениваем состояние коробки, ошибки и поведение агрегата. Определяем дальнейшие действия; причину неисправности диагностика выявляет не всегда.' },
    { n: '04', title: 'Предварительная оценка', text: 'В ряде случаев после диагностики можно предварительно оценить стоимость ремонта.' },
    { n: '05', title: 'Дефектовка', text: 'При необходимости выполняем разборку и проверку деталей. Точную стоимость ремонта определяем после дефектовки.' },
    { n: '06', title: 'Согласование и ремонт', text: 'Согласовываем точную стоимость с клиентом и только после этого выполняем ремонт и сборку.' },
  ],

  processTransparent: [
    { title: 'Диагностика', text: 'Оценка состояния и предварительная оценка стоимости' },
    { title: 'Дефектовка', text: 'Разборка и проверка деталей коробки' },
    { title: 'Согласование', text: 'Определение и согласование точной стоимости' },
    { title: 'Ремонт', text: 'Ремонт и сборка после согласования' },
  ],

  prices: [
    { title: 'Ремонт вариатора', price: 'от 30 000 ₽' },
    { title: 'Ремонт АКПП', price: 'от 25 000 ₽' },
    { title: 'Замена масла в АКПП', price: 'от 3 500 ₽' },
    { title: 'Замена масла в вариаторе', price: 'от 4 000 ₽' },
  ],
  priceNote:
    'После диагностики возможна предварительная оценка стоимости. Точная стоимость ремонта определяется после дефектовки — разборки и проверки деталей коробки передач.',
  priceDisclaimer:
    'Указаны ориентировочные цены. Точная стоимость ремонта определяется после дефектовки — разборки и проверки деталей.',

  brandsNote: 'Не нашли свою марку? Уточните возможность ремонта вашей модели.',
  brands: [
    { slug: 'toyota', name: 'Toyota', href: 'variatory/toyota.html' },
    { slug: 'nissan', name: 'Nissan', href: 'variatory/nissan.html' },
    { slug: 'honda', name: 'Honda', href: 'variatory/honda.html' },
    { slug: 'subaru', name: 'Subaru', href: 'variatory/subaru.html' },
    { slug: 'mitsubishi', name: 'Mitsubishi', href: 'variatory/mitsubishi.html' },
    { slug: 'suzuki', name: 'Suzuki', href: '' },
    { slug: 'lexus', name: 'Lexus', href: '' },
    { slug: 'infiniti', name: 'Infiniti', href: '' },
    { slug: 'mazda', name: 'Mazda', href: '' },
    { slug: 'daihatsu', name: 'Daihatsu', href: '' },
    { slug: 'renault', name: 'Renault', href: '' },
  ],

  partsFilters: ['Nissan', 'Mitsubishi', 'Toyota', 'Subaru', 'Renault'],
  parts: [
    {
      id: 'cvt-belt',
      title: 'Ремень вариатора',
      description: 'Ремень для вариаторов Jatco и аналогов. Подбирается по модели трансмиссии.',
      image: 'images/parts/cvt-belt.svg',
      fits: ['Nissan Qashqai', 'Nissan X-Trail', 'Mitsubishi Outlander', 'Renault Koleos'],
      brands: ['Nissan', 'Mitsubishi', 'Renault'],
      price: 'от 8 000 ₽',
    },
    {
      id: 'cvt-cone',
      title: 'Конус вариатора',
      description: 'Шкив / конус CVT. Подбор по типу вариатора и состоянию после дефектовки.',
      image: 'images/parts/cvt-cone.svg',
      fits: ['Nissan X-Trail', 'Toyota RAV4', 'Subaru Forester'],
      brands: ['Nissan', 'Toyota', 'Subaru'],
      price: 'по запросу',
    },
    {
      id: 'filter',
      title: 'Масляный фильтр CVT',
      description: 'Фильтр для обслуживания и ремонта вариатора. Подбор по каталогу OEM.',
      image: 'images/parts/filter.svg',
      fits: ['Nissan Qashqai', 'Mitsubishi Outlander', 'Toyota Corolla'],
      brands: ['Nissan', 'Mitsubishi', 'Toyota'],
      price: 'от 2 500 ₽',
    },
    {
      id: 'gaskets',
      title: 'Комплект прокладок',
      description: 'Прокладки и уплотнения для сборки вариатора после ремонта.',
      image: 'images/parts/gaskets.svg',
      fits: ['Nissan', 'Mitsubishi', 'Toyota', 'Subaru'],
      brands: ['Nissan', 'Mitsubishi', 'Toyota', 'Subaru'],
      price: 'от 3 500 ₽',
    },
    {
      id: 'bearings',
      title: 'Подшипники вариатора',
      description: 'Комплект подшипников под конкретный тип CVT. Уточняем по модели коробки.',
      image: 'images/parts/bearings.svg',
      fits: ['Nissan Teana', 'Mitsubishi ASX', 'Renault Fluence'],
      brands: ['Nissan', 'Mitsubishi', 'Renault'],
      price: 'по запросу',
    },
    {
      id: 'valve-body',
      title: 'Ремкомплект гидроблока',
      description: 'Соленоиды и элементы гидроблока. Совместимость проверяем по номеру кузова / VIN и коду вариатора.',
      image: 'images/parts/valve-body.svg',
      fits: ['Nissan Qashqai', 'Nissan X-Trail', 'Subaru XV'],
      brands: ['Nissan', 'Subaru'],
      price: 'от 12 000 ₽',
    },
  ],
  partsVinNote: 'Отправьте номер кузова, VIN автомобиля — мы проверим совместимость и стоимость.',

  cases: [],
  reviews: [],
  gallery: [
    { src: 'images/gallery/g1.svg', alt: 'Рабочая зона сервиса' },
    { src: 'images/gallery/g2.svg', alt: 'Автомобиль в сервисе' },
    { src: 'images/gallery/g3.svg', alt: 'Вариатор' },
    { src: 'images/gallery/g4.svg', alt: 'Процесс ремонта' },
    { src: 'images/gallery/g5.svg', alt: 'Рабочее место' },
    { src: 'images/gallery/g6.svg', alt: 'Детали агрегата' },
  ],

  articles: [
    { href: 'articles/kak-ponyat-chto-variator-trebuet-remonta.html', title: 'Как понять, что вариатор требует ремонта', lead: 'Какие симптомы нельзя игнорировать.' },
    { href: 'articles/kogda-menyat-maslo-v-variatore.html', title: 'Когда менять масло в вариаторе', lead: 'Ориентиры по замене масла в вариаторе.' },
    { href: 'articles/pochemu-variator-dergaetsya.html', title: 'Почему вариатор начинает дёргаться', lead: 'Возможные причины рывков и что делать.' },
    { href: 'articles/chto-delat-pri-peregreve-variatora.html', title: 'Что делать при перегреве вариатора', lead: 'Первые шаги и когда ехать на диагностику.' },
    { href: 'articles/mozhno-li-ezdit-s-oshibkoj-variatora.html', title: 'Можно ли ездить с ошибкой вариатора', lead: 'Почему лучше не откладывать проверку.' },
    { href: 'articles/skolko-stoit-remont-variatora.html', title: 'Сколько стоит ремонт вариатора', lead: 'Ориентиры по цене: диагностика, дефектовка и точная смета.' },
  ],

  faq: [
    {
      q: 'Когда нужен ремонт вариатора?',
      a: 'Если появились рывки, шум, пробуксовка, перегрев, ошибки или потеря динамики — начните с диагностики. Ремонт нужен не всегда: иногда достаточно замены масла или точечных работ.',
    },
    {
      q: 'Можно ли определить неисправность без разборки?',
      a: 'Диагностика помогает оценить состояние коробки и определить дальнейшие действия, но не всегда позволяет установить причину неисправности. Точный объём работ часто становится ясен после дефектовки — разборки и проверки деталей.',
    },
    {
      q: 'Сколько длится диагностика?',
      a: 'Время зависит от симптомов и загрузки сервиса. Уточните при записи.',
    },
    {
      q: 'Сколько стоит ремонт?',
      a: 'После диагностики возможна предварительная оценка стоимости. Точная стоимость ремонта определяется после дефектовки — разборки и проверки деталей коробки передач.',
    },
    {
      q: 'Есть ли гарантия?',
      a: 'Условия гарантии сообщаем при согласовании работ.',
    },
    {
      q: 'Можно ли приехать без записи?',
      a: 'Рекомендуем записаться заранее, чтобы согласовать время диагностики.',
    },
    {
      q: 'Как записаться на диагностику?',
      a: 'Позвоните или оставьте заявку в форме: имя, телефон, автомобиль и описание симптомов.',
    },
    {
      q: 'Делаете ли вы только вариаторы?',
      a: 'Работаем с вариаторами (CVT), АКПП и DSG. Также производим замену жидкостей. Уточняйте перечень услуг при записи.',
    },
  ],

  warranty: {
    enabled: false,
    title: 'Гарантия на выполненные работы',
    text: 'Условия гарантии сообщаем при согласовании работ.',
  },
};
