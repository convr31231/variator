import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Wrench, ClipboardCheck, Camera, CalendarCheck } from 'lucide-react';
import { siteConfig } from '../data/site';
import { Reveal } from './Reveal';
import './Hero.css';

const factIcons = [Wrench, ShieldCheck, ClipboardCheck, Camera, CalendarCheck] as const;

const facts = [
  siteConfig.facts.experience,
  siteConfig.facts.warranty,
  siteConfig.facts.diagnostics,
  siteConfig.facts.repairs,
  siteConfig.facts.booking,
];

export function Hero() {
  return (
    <section className="hero">
      <div className="hero__glow" aria-hidden />
      <div className="container hero__grid">
        <Reveal>
          <p className="section__eyebrow">Сервис CVT · {siteConfig.city}</p>
          <h1 className="hero__title">Ремонт вариаторов во Владивостоке</h1>
          <p className="hero__subtitle">
            Диагностика → определение причины → ремонт → проверка → гарантия.
            Понятный процесс без лишних обещаний.
          </p>
          <div className="hero__cta">
            <Link to="/kontakty/#zapis" className="btn btn--primary">
              Записаться на диагностику
              <ArrowRight size={18} aria-hidden />
            </Link>
            <Link to="/ceny/" className="btn btn--ghost">
              Узнать стоимость ремонта
            </Link>
          </div>
          <ul className="hero__facts">
            {facts.map((fact, index) => {
              const Icon = factIcons[index];
              return (
                <li key={fact}>
                  <Icon size={16} aria-hidden />
                  <span>{fact}</span>
                </li>
              );
            })}
          </ul>
        </Reveal>

        <Reveal delay={120} className="hero__visual">
          <div className="hero__panel">
            <div className="hero__panel-image" role="img" aria-label="Рабочая зона сервиса вариаторов">
              <div className="hero__panel-overlay">
                <p className="hero__panel-label">Фокус на CVT</p>
                <p className="hero__panel-text">
                  Специализированный ремонт вариаторов — от диагностики до проверки после работ.
                </p>
              </div>
            </div>
            <div className="hero__panel-meta">
              <div>
                <span>Регион</span>
                <strong>{siteConfig.city}</strong>
              </div>
              <div>
                <span>Запись</span>
                <strong>{siteConfig.workingHours.short}</strong>
              </div>
              <div>
                <span>Телефон</span>
                <strong>
                  <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                </strong>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
