import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Cases } from '../components/Cases';
import { CTA } from '../components/CTA';

export function CasesPage() {
  return (
    <>
      <Seo
        title="Наши работы по ремонту вариаторов во Владивостоке"
        description="Реальные кейсы ремонта CVT во Владивостоке: автомобиль, проблема, диагностика, выполненные работы и результат."
        path="/raboty/"
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span>/</span>
            <span>Наши работы</span>
          </nav>
          <h1>Наши работы</h1>
          <p>
            Публикуем только подтверждённые ремонты сервиса. Пока данные не загружены — на странице
            отображается понятный placeholder.
          </p>
        </div>
      </section>
      <Cases showHeader={false} />
      <CTA />
    </>
  );
}
