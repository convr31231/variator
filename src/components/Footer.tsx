import { Link } from 'react-router-dom';
import { navLinks, siteConfig } from '../data/site';
import { services } from '../data/services';
import './Footer.css';

export function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Link to="/" className="footer__logo">
            <span className="footer__logo-mark" aria-hidden />
            <span>{siteConfig.shortName}</span>
          </Link>
          <p>{siteConfig.tagline}</p>
          <p className="footer__legal">{siteConfig.legal.entity}</p>
          <p className="footer__legal">{siteConfig.legal.inn}</p>
        </div>

        <div>
          <h2 className="footer__title">Услуги</h2>
          <ul className="footer__list">
            {services.slice(0, 6).map((service) => (
              <li key={service.slug}>
                <Link to={`/uslugi/${service.slug}/`}>{service.shortTitle}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="footer__title">Разделы</h2>
          <ul className="footer__list">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link to={link.href}>{link.label}</Link>
              </li>
            ))}
            <li>
              <Link to="/politika-konfidencialnosti/">Политика конфиденциальности</Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="footer__title">Контакты</h2>
          <ul className="footer__list">
            <li>
              <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
            </li>
            <li>{siteConfig.address.full}</li>
            <li>{siteConfig.workingHours.short}</li>
            <li>
              <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
            </li>
          </ul>
          <div className="footer__social">
            {siteConfig.social.vk && (
              <a href={siteConfig.social.vk} target="_blank" rel="noreferrer">
                ВКонтакте
              </a>
            )}
            {siteConfig.social.youtube && (
              <a href={siteConfig.social.youtube} target="_blank" rel="noreferrer">
                YouTube
              </a>
            )}
            {!siteConfig.social.vk && !siteConfig.social.youtube && (
              <span className="footer__social-placeholder">[Ссылки на соцсети]</span>
            )}
          </div>
        </div>
      </div>

      <div className="container footer__bottom">
        <p>
          © {new Date().getFullYear()} {siteConfig.shortName}. Ремонт вариаторов во Владивостоке.
        </p>
      </div>
    </footer>
  );
}
