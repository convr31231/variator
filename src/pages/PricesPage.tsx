import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Prices } from '../components/Prices';
import { CTA } from '../components/CTA';

export function PricesPage() {
  return (
    <>
      <Seo
        title="Цены на ремонт вариатора во Владивостоке"
        description="Ориентиры стоимости диагностики и ремонта вариатора во Владивостоке. Точная смета — после диагностики."
        path="/ceny/"
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span>/</span>
            <span>Цены</span>
          </nav>
          <h1>Цены на услуги</h1>
          <p>
            Ниже — плейсхолдеры. Замените значения на актуальные цены сервиса. Итоговая стоимость
            всегда согласуется после диагностики.
          </p>
        </div>
      </section>
      <Prices showHeader={false} />
      <CTA />
    </>
  );
}
