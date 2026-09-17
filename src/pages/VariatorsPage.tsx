import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { CTA } from '../components/CTA';
import { variators } from '../data/variators';

export function VariatorsPage() {
  return (
    <>
      <Seo
        title="Ремонт вариаторов по маркам во Владивостоке"
        description="Каталог вариаторов: Nissan, Toyota, Honda, Mitsubishi, Subaru, Jatco. Диагностика и ремонт CVT во Владивостоке."
        path="/variatory/"
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span>/</span>
            <span>Вариаторы</span>
          </nav>
          <h1>Вариаторы и марки</h1>
          <p>
            Полезные страницы по популярным CVT. Каждая — с типовыми симптомами и ссылками на услуги,
            без пустых SEO-заглушек.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid-3">
          {variators.map((item) => (
            <Link key={item.slug} to={`/variatory/${item.slug}/`} className="card card--link">
              <span className="badge">{item.brand}</span>
              <h2 style={{ fontSize: '1.15rem', marginTop: '0.85rem' }}>{item.title}</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.65rem' }}>{item.description}</p>
            </Link>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
