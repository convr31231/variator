import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { Seo } from '../components/Seo';
import { CTA } from '../components/CTA';
import { services } from '../data/services';

export function ServicesPage() {
  return (
    <>
      <Seo
        title="Услуги по ремонту вариаторов во Владивостоке"
        description="Полный перечень услуг по CVT во Владивостоке: диагностика, ремонт, капремонт, гидроблок, замена масла, адаптация."
        path="/uslugi/"
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span>/</span>
            <span>Услуги</span>
          </nav>
          <h1>Услуги по ремонту вариаторов</h1>
          <p>
            Специализированный сервис CVT во Владивостоке. Выберите услугу — на странице есть описание,
            этапы и призыв к записи.
          </p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container grid-2">
          {services.map((service) => (
            <Link key={service.slug} to={`/uslugi/${service.slug}/`} className="card card--link">
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                <h2 style={{ fontSize: '1.2rem' }}>{service.title}</h2>
                <ArrowUpRight size={18} color="var(--accent)" aria-hidden />
              </div>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.75rem' }}>{service.description}</p>
              <p style={{ color: 'var(--accent)', marginTop: '1rem', fontWeight: 600 }}>
                {service.priceFrom}
              </p>
            </Link>
          ))}
        </div>
      </section>
      <CTA />
    </>
  );
}
