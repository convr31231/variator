export type CaseStudy = {
  id: string;
  car: string;
  problem: string;
  diagnostics: string;
  work: string;
  result: string;
  price: string;
  imageBefore?: string;
  imageAfter?: string;
  published: boolean;
};

/**
 * Реальные кейсы добавляйте сюда и ставьте published: true.
 * Пока массив пуст или без published — на сайте показывается placeholder.
 */
export const cases: CaseStudy[] = [
  // Пример структуры (не публиковать без реальных данных клиента):
  // {
  //   id: '1',
  //   car: 'Nissan Qashqai, [год]',
  //   problem: 'Рывки при разгоне',
  //   diagnostics: '…',
  //   work: '…',
  //   result: '…',
  //   price: '[стоимость]',
  //   published: true,
  // },
];

export const publishedCases = cases.filter((c) => c.published);
