import { Link } from 'react-router-dom';
import { Phone } from 'lucide-react';
import { siteConfig } from '../data/site';
import { Reveal } from './Reveal';
import './CTA.css';

export function CTA() {
  return (
    <section className="section cta">
      <div className="container">
        <Reveal>
          <div className="cta__panel">
            <div>
              <h2 className="cta__title">Есть проблемы с вариатором? Начните с диагностики.</h2>
              <p>
                Опишите симптомы — подскажем следующий шаг и запишем на удобное время во Владивостоке.
              </p>
            </div>
            <div className="cta__actions">
              <Link to="/kontakty/#zapis" className="btn btn--primary">
                Записаться на диагностику
              </Link>
              <a className="btn btn--ghost" href={siteConfig.phoneHref}>
                <Phone size={18} aria-hidden />
                {siteConfig.phone}
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
