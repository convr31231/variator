export type Variator = {
  slug: string;
  title: string;
  brand: string;
  description: string;
  fullDescription: string;
  commonIssues: string[];
  relatedServiceSlugs: string[];
  metaTitle: string;
  metaDescription: string;
};

export const variators: Variator[] = [
  {
    slug: 'nissan',
    title: 'Ремонт вариаторов Nissan',
    brand: 'Nissan',
    description:
      'Диагностика и ремонт CVT на моделях Nissan: рывки, перегрев, шум и ошибки коробки.',
    fullDescription:
      'На автомобилях Nissan часто встречаются вариаторы семейства Jatco. Типичные обращения — рывки при разгоне, перегрев, металлический шум и ошибки по давлению. Начинаем с диагностики, затем согласовываем объём ремонта: от замены масла и гидроблока до капитального ремонта.',
    commonIssues: [
      'Рывки и вибрации при разгоне',
      'Перегрев и предупреждения на панели',
      'Шум из зоны коробки',
      'Потеря динамики',
    ],
    relatedServiceSlugs: [
      'diagnostika-variatora',
      'remont-variatora',
      'remont-gidrobloka',
      'zamena-masla-v-variatore',
    ],
    metaTitle: 'Ремонт вариатора Nissan во Владивостоке',
    metaDescription:
      'Ремонт и диагностика вариаторов Nissan во Владивостоке. Типичные неисправности CVT, этапы работ и запись в сервис.',
  },
  {
    slug: 'toyota',
    title: 'Ремонт вариаторов Toyota',
    brand: 'Toyota',
    description:
      'Обслуживание и ремонт CVT Toyota: диагностика, масло, ремонт узлов и проверка после работ.',
    fullDescription:
      'Вариаторы Toyota чувствительны к качеству жидкости и режиму эксплуатации. При рывках, задержках реакции или шуме важно вовремя пройти диагностику. Предлагаем диагностику, замену масла, ремонт и капитальное восстановление по результатам дефектовки.',
    commonIssues: [
      'Задержки при трогании',
      'Вибрации на малых скоростях',
      'Шум при наборе скорости',
      'Ошибки трансмиссии',
    ],
    relatedServiceSlugs: [
      'diagnostika-variatora',
      'remont-variatora',
      'zamena-masla-v-variatore',
      'adaptaciya-variatora',
    ],
    metaTitle: 'Ремонт вариатора Toyota во Владивостоке',
    metaDescription:
      'Ремонт вариаторов Toyota во Владивостоке: диагностика CVT, замена масла, ремонт узлов. Запись на проверку.',
  },
  {
    slug: 'honda',
    title: 'Ремонт вариаторов Honda',
    brand: 'Honda',
    description:
      'Диагностика и ремонт CVT Honda при рывках, пробуксовке и посторонних звуках.',
    fullDescription:
      'На Honda неисправности вариатора часто проявляются пробуксовкой, рывками и изменением характера разгона. После диагностики определяем, нужен ли ремонт гидроблока, замена расходников или более глубокое вмешательство.',
    commonIssues: [
      'Пробуксовка при разгоне',
      'Рывки в городе',
      'Посторонний шум',
      'Падение тяги',
    ],
    relatedServiceSlugs: [
      'diagnostika-variatora',
      'remont-variatora',
      'remont-gidrobloka',
      'kapitalnyy-remont',
    ],
    metaTitle: 'Ремонт вариатора Honda во Владивостоке',
    metaDescription:
      'Ремонт CVT Honda во Владивостоке. Диагностика, типичные неисправности и согласование стоимости ремонта.',
  },
  {
    slug: 'mitsubishi',
    title: 'Ремонт вариаторов Mitsubishi',
    brand: 'Mitsubishi',
    description:
      'Ремонт и обслуживание вариаторов Mitsubishi: диагностика причины и прозрачный план работ.',
    fullDescription:
      'Владельцы Mitsubishi обращаются с жалобами на рывки, перегрев и шум CVT. Мы выясняем причину на диагностике и предлагаем понятный план: обслуживание, точечный ремонт или капитальная переборка.',
    commonIssues: [
      'Перегрев вариатора',
      'Рывки при переключении диапазонов',
      'Вибрации',
      'Ошибки на приборной панели',
    ],
    relatedServiceSlugs: [
      'diagnostika-variatora',
      'remont-variatora',
      'zamena-masla-v-variatore',
      'snyatie-i-ustanovka',
    ],
    metaTitle: 'Ремонт вариатора Mitsubishi во Владивостоке',
    metaDescription:
      'Ремонт вариаторов Mitsubishi во Владивостоке. Диагностика CVT, ремонт и проверка автомобиля после работ.',
  },
  {
    slug: 'subaru',
    title: 'Ремонт вариаторов Subaru',
    brand: 'Subaru',
    description:
      'Диагностика и ремонт Lineartronic / CVT Subaru при вибрациях, шуме и ошибках.',
    fullDescription:
      'Вариаторы Subaru (в том числе Lineartronic) требуют аккуратной диагностики. Типичные симптомы — вибрации, шум и ошибки трансмиссии. Работы начинаем с проверки, затем согласовываем ремонт под конкретную неисправность.',
    commonIssues: [
      'Вибрации на скорости',
      'Металлический шум',
      'Ошибки коробки',
      'Нестабильная тяга',
    ],
    relatedServiceSlugs: [
      'diagnostika-variatora',
      'remont-variatora',
      'remont-tsepi-i-shkivov',
      'kapitalnyy-remont',
    ],
    metaTitle: 'Ремонт вариатора Subaru во Владивостоке',
    metaDescription:
      'Ремонт CVT Subaru во Владивостоке: диагностика Lineartronic, ремонт узлов и проверка после работ.',
  },
  {
    slug: 'jatco',
    title: 'Ремонт вариаторов Jatco',
    brand: 'Jatco',
    description:
      'Специализация на агрегатах Jatco: диагностика, гидроблок, цепь/шкивы и капитальный ремонт.',
    fullDescription:
      'Jatco — распространённое семейство вариаторов на Nissan и ряде других марок. Мы работаем с типичными неисправностями этих агрегатов: давление, гидроблок, износ цепи и шкивов, перегрев. Объём ремонта всегда опирается на диагностику и дефектовку.',
    commonIssues: [
      'Проблемы с давлением',
      'Износ цепи и шкивов',
      'Неисправности гидроблока',
      'Перегрев при нагрузке',
    ],
    relatedServiceSlugs: [
      'diagnostika-variatora',
      'remont-gidrobloka',
      'remont-tsepi-i-shkivov',
      'kapitalnyy-remont',
    ],
    metaTitle: 'Ремонт вариатора Jatco во Владивостоке',
    metaDescription:
      'Ремонт вариаторов Jatco во Владивостоке: диагностика, гидроблок, цепь и шкивы, капитальный ремонт CVT.',
  },
];

export function getVariatorBySlug(slug: string): Variator | undefined {
  return variators.find((v) => v.slug === slug);
}
