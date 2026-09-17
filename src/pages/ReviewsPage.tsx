import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Reviews } from '../components/Reviews';
import { CTA } from '../components/CTA';

export function ReviewsPage() {
  return (
    <>
      <Seo
        title="Отзывы о ремонте вариаторов во Владивостоке"
        description="Отзывы клиентов о диагностике и ремонте вариаторов во Владивостоке. Подготовка к подключению внешних площадок."
        path="/otzyvy/"
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span>/</span>
            <span>Отзывы</span>
          </nav>
          <h1>Отзывы</h1>
          <p>
            Раздел готов к заполнению реальными отзывами и подключению виджетов Яндекс Карт / Google.
          </p>
        </div>
      </section>
      <Reviews showHeader={false} />
      <CTA />
    </>
  );
}
