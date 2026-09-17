import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';

export function NotFoundPage() {
  return (
    <>
      <Seo
        title="Страница не найдена"
        description="Запрашиваемая страница не существует."
        path="/404/"
        noindex
      />
      <section className="page-hero">
        <div className="container">
          <h1>Страница не найдена</h1>
          <p>Возможно, ссылка устарела или адрес введён с ошибкой.</p>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn--primary">
              На главную
            </Link>
            <Link to="/kontakty/" className="btn btn--ghost">
              Контакты
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
