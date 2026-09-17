import { Link, Navigate, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { CTA } from '../components/CTA';
import { LeadForm } from '../components/LeadForm';
import { getServiceBySlug, services } from '../data/services';

export function ServicePage() {
  const { slug } = useParams();
  const service = slug ? getServiceBySlug(slug) : undefined;

  if (!service) {
    return <Navigate to="/uslugi/" replace />;
  }

  const related = services.filter((s) => s.slug !== service.slug).slice(0, 3);

  return (
    <>
      <Seo
        title={service.metaTitle}
        description={service.metaDescription}
        path={`/uslugi/${service.slug}/`}
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span>/</span>
            <Link to="/uslugi/">Услуги</Link>
            <span>/</span>
            <span>{service.shortTitle}</span>
          </nav>
          <h1>{service.title} во Владивостоке</h1>
          <p>{service.description}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '1.5rem' }}>
            <Link to="/kontakty/#zapis" className="btn btn--primary">
              Записаться
            </Link>
            <Link to="/ceny/" className="btn btn--ghost">
              Смотреть цены
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ display: 'grid', gap: '1rem' }}>
          <div className="card prose">
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem', fontSize: '1.35rem' }}>
              Что входит в услугу
            </h2>
            <p>{service.fullDescription}</p>
            <ul style={{ marginTop: '1.25rem', display: 'grid', gap: '0.55rem' }}>
              {service.features.map((feature) => (
                <li key={feature} style={{ color: 'var(--text)', paddingLeft: '1rem', position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '0.55em',
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: 'var(--accent)',
                    }}
                  />
                  {feature}
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '1.25rem' }}>
              Ориентир по стоимости: <strong style={{ color: 'var(--accent)' }}>{service.priceFrom}</strong>.
              Точная сумма — после диагностики и согласования.
            </p>
          </div>

          <div className="card" id="zapis">
            <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Запись на услугу</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Оставьте заявку — перезвоним и уточним детали.
            </p>
            <LeadForm source={`услуга: ${service.slug}`} />
          </div>

          <div>
            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Смотрите также</h2>
            <div className="grid-3">
              {related.map((item) => (
                <Link key={item.slug} to={`/uslugi/${item.slug}/`} className="card card--link">
                  <h3 style={{ fontSize: '1.05rem' }}>{item.title}</h3>
                  <p style={{ color: 'var(--text-muted)', marginTop: '0.55rem', fontSize: '0.92rem' }}>
                    {item.description}
                  </p>
                </Link>
              ))}
            </div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
              Также смотрите{' '}
              <Link to="/variatory/" style={{ color: 'var(--accent)' }}>
                каталог вариаторов
              </Link>{' '}
              и{' '}
              <Link to="/faq/" style={{ color: 'var(--accent)' }}>
                ответы на частые вопросы
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
      <CTA />
    </>
  );
}
