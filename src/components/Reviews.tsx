import { Link } from 'react-router-dom';
import { publishedReviews, reviewSources } from '../data/reviews';
import { Reveal } from './Reveal';
import './Reviews.css';

type ReviewsProps = {
  showHeader?: boolean;
};

export function Reviews({ showHeader = true }: ReviewsProps) {
  return (
    <section className="section" id="otzyvy">
      <div className="container">
        {showHeader && (
          <Reveal>
            <div className="section__head section__head--row">
              <div>
                <p className="section__eyebrow">Отзывы</p>
                <h2 className="section__title">Что говорят клиенты</h2>
                <p className="section__lead">
                  Публикуем только реальные отзывы. Позже можно подключить виджеты внешних площадок.
                </p>
              </div>
              <Link to="/otzyvy/" className="btn btn--ghost">
                Все отзывы
              </Link>
            </div>
          </Reveal>
        )}

        {publishedReviews.length === 0 ? (
          <Reveal>
            <div className="placeholder-box">
              <p className="reviews__placeholder-title">Добавить реальные отзывы клиента</p>
              <p>
                Фальшивые отзывы не создаём. Подготовлены слоты под отзывы на сайте и ссылки на
                Яндекс Карты / Google / другие площадки.
              </p>
              <ul className="reviews__sources">
                <li>Яндекс Карты: {reviewSources.yandexMaps || '[ссылка]'}</li>
                <li>Google Maps: {reviewSources.googleMaps || '[ссылка]'}</li>
              </ul>
            </div>
          </Reveal>
        ) : (
          <div className="grid-3">
            {publishedReviews.map((review) => (
              <article key={review.id} className="card">
                <p className="reviews__author">{review.author}</p>
                <p className="reviews__text">{review.text}</p>
                {review.source && <p className="reviews__source">{review.source}</p>}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
