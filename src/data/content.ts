export const symptoms = [
  {
    id: 'jerks',
    title: 'Рывки',
    description: 'Толчки при разгоне или в движении',
  },
  {
    id: 'vibration',
    title: 'Вибрации',
    description: 'Дрожь на холостых или на скорости',
  },
  {
    id: 'slip',
    title: 'Пробуксовка',
    description: 'Обороты растут, а разгон слабый',
  },
  {
    id: 'overheat',
    title: 'Перегрев',
    description: 'Предупреждения и потеря динамики',
  },
  {
    id: 'noise',
    title: 'Посторонний шум',
    description: 'Гул, скрежет или металлический звук',
  },
  {
    id: 'delay',
    title: 'Задержка реакции',
    description: 'Пауза при трогании или смене режима',
  },
  {
    id: 'errors',
    title: 'Ошибки',
    description: 'Индикаторы и коды неисправностей',
  },
  {
    id: 'power-loss',
    title: 'Потеря тяги',
    description: 'Автомобиль не набирает скорость как раньше',
  },
] as const;

export const processSteps = [
  {
    step: 1,
    title: 'Заявка',
    description: 'Оставляете заявку или звоните — уточняем симптомы и записываем на удобное время.',
  },
  {
    step: 2,
    title: 'Диагностика',
    description: 'Проверяем ошибки, параметры работы и поведение вариатора.',
  },
  {
    step: 3,
    title: 'Определение причины',
    description: 'Объясняем, что именно неисправно и какие есть варианты ремонта.',
  },
  {
    step: 4,
    title: 'Согласование стоимости',
    description: 'Фиксируем объём работ и ориентир по цене до начала ремонта.',
  },
  {
    step: 5,
    title: 'Ремонт',
    description: 'Выполняем согласованные работы с контролем узлов и чистоты сборки.',
  },
  {
    step: 6,
    title: 'Проверка',
    description: 'Проверяем работу вариатора и автомобиля после ремонта.',
  },
  {
    step: 7,
    title: 'Передача автомобиля',
    description: 'Выдаём авто, рассказываем о выполненных работах и рекомендациях.',
  },
] as const;

export const priceItems = [
  {
    id: 'diagnostics',
    service: 'Диагностика вариатора',
    price: 'от [цена]',
    note: 'По итогам — заключение и план работ',
    href: '/uslugi/diagnostika-variatora/',
  },
  {
    id: 'repair',
    service: 'Ремонт вариатора',
    price: 'от [цена]',
    note: 'После диагностики и согласования',
    href: '/uslugi/remont-variatora/',
  },
  {
    id: 'overhaul',
    service: 'Капитальный ремонт',
    price: 'от [цена]',
    note: 'Разборка, дефектовка, сборка',
    href: '/uslugi/kapitalnyy-remont/',
  },
  {
    id: 'valve-body',
    service: 'Ремонт гидроблока',
    price: 'от [цена]',
    note: 'По результатам проверки давления',
    href: '/uslugi/remont-gidrobloka/',
  },
  {
    id: 'oil',
    service: 'Замена масла CVT',
    price: 'от [цена]',
    note: 'Жидкость подбирается под тип агрегата',
    href: '/uslugi/zamena-masla-v-variatore/',
  },
  {
    id: 'adapt',
    service: 'Адаптация вариатора',
    price: 'от [цена]',
    note: 'При наличии оборудования',
    href: '/uslugi/adaptaciya-variatora/',
  },
] as const;

export const advantages = [
  {
    id: 'diagnostics-first',
    title: 'Диагностика перед ремонтом',
    description:
      'Не начинаем разборку «наугад»: сначала выясняем причину и только потом предлагаем работы.',
  },
  {
    id: 'approval',
    title: 'Согласование работ',
    description:
      'Объём и стоимость согласуем до начала ремонта — без скрытых доплат в процессе.',
  },
  {
    id: 'transparent-price',
    title: 'Прозрачная стоимость',
    description:
      'Смета опирается на диагностику и перечень деталей, а не на абстрактную «среднюю цену».',
  },
  {
    id: 'photo-report',
    title: 'Фото и видео процесса',
    description:
      '[Если предоставляете] Фиксируем ключевые этапы, чтобы было понятно, что сделано с агрегатом.',
  },
  {
    id: 'warranty',
    title: 'Гарантия на работы',
    description:
      '[Условия гарантии] — пропишите реальный срок и покрытие после согласования с клиентом.',
  },
  {
    id: 'final-check',
    title: 'Проверка после ремонта',
    description:
      'Перед выдачей проверяем работу вариатора и поведение автомобиля.',
  },
] as const;
