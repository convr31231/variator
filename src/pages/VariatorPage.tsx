import { Link, Navigate, useParams } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { CTA } from '../components/CTA';
import { getVariatorBySlug } from '../data/variators';
import { getServiceBySlug } from '../data/services';

export function VariatorPage() {
  const { slug } = useParams();
  const variator = slug ? getVariatorBySlug(slug) : undefined;

  if (!variator) {
    return <Navigate to="/variatory/" replace />;
  }

  const relatedServices = variator.relatedServiceSlugs
    .map((s) => getServiceBySlug(s))
    .filter(Boolean);

  return (
    <>
      <Seo
        title={variator.metaTitle}
        description={variator.metaDescription}
        path={`/variatory/${variator.slug}/`}
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span>/</span>
            <Link to="/variatory/">Вариаторы</Link>
            <span>/</span>
            <span>{variator.brand}</span>
          </nav>
          <h1>{variator.title} во Владивостоке</h1>
          <p>{variator.description}</p>
          <div style={{ marginTop: '1.5rem' }}>
            <Link to="/kontakty/#zapis" className="btn btn--primary">
              Записаться на диагностику
            </Link>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container" style={{ display: 'grid', gap: '1rem' }}>
          <article className="card prose">
            <h2 style={{ color: 'var(--text)', marginBottom: '1rem', fontSize: '1.3rem' }}>
              Особенности ремонта {variator.brand} CVT
            </h2>
            <p>{variator.fullDescription}</p>
          </article>

          <article className="card">
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Частые обращения</h2>
            <ul className="grid-2">
              {variator.commonIssues.map((issue) => (
                <li key={issue} className="placeholder-box" style={{ color: 'var(--text)' }}>
                  {issue}
                </li>
              ))}
            </ul>
          </article>

          <article>
            <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Связанные услуги</h2>
            <div className="grid-2">
              {relatedServices.map((service) =>
                service ? (
                  <Link key={service.slug} to={`/uslugi/${service.slug}/`} className="card card--link">
                    <h3 style={{ fontSize: '1.05rem' }}>{service.title}</h3>
                    <p style={{ color: 'var(--text-muted)', marginTop: '0.55rem' }}>
                      {service.description}
                    </p>
                  </Link>
                ) : null,
              )}
            </div>
          </article>
        </div>
      </section>
      <CTA />
    </>
  );
}
