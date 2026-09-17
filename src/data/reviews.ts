export type Review = {
  id: string;
  author: string;
  text: string;
  source?: string;
  rating?: number;
  date?: string;
  published: boolean;
};

/**
 * Подключайте реальные отзывы клиента или внешние виджеты.
 * Фальшивые отзывы не публикуем.
 */
export const reviews: Review[] = [];

export const publishedReviews = reviews.filter((r) => r.published);

export const reviewSources = {
  yandexMaps: '',
  googleMaps: '',
  avito: '',
} as const;
