import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { services } from '../data/services';
import { Reveal } from './Reveal';
import './Services.css';

export function Services() {
  return (
    <section className="section" id="uslugi">
      <div className="container">
        <Reveal>
          <div className="section__head section__head--row">
            <div>
              <p className="section__eyebrow">Услуги</p>
              <h2 className="section__title">Что делаем с вариатором</h2>
              <p className="section__lead">
                От диагностики до капитального ремонта. Каждая услуга — отдельная страница с
                понятным описанием.
              </p>
            </div>
            <Link to="/uslugi/" className="btn btn--ghost">
              Все услуги
            </Link>
          </div>
        </Reveal>

        <div className="grid-2 services__grid">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={(index % 4) * 40}>
              <Link to={`/uslugi/${service.slug}/`} className="card card--link services__card">
                <div className="services__card-top">
                  <h3>{service.title}</h3>
                  <ArrowUpRight size={18} aria-hidden />
                </div>
                <p>{service.description}</p>
                <span className="services__price">{service.priceFrom}</span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
