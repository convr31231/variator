import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, Phone, X } from 'lucide-react';
import { navLinks, siteConfig } from '../data/site';
import './Header.css';

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.classList.toggle('menu-open', open);
    return () => document.body.classList.remove('menu-open');
  }, [open]);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className={`header ${scrolled ? 'header--scrolled' : ''}`}>
      <div className="container header__inner">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <span className="header__logo-mark" aria-hidden />
          <span className="header__logo-text">
            <strong>{siteConfig.shortName}</strong>
            <small>Владивосток</small>
          </span>
        </Link>

        <nav className="header__nav" aria-label="Основная навигация">
          {navLinks.map((link) => (
            <NavLink
              key={link.href}
              to={link.href}
              className={({ isActive }) =>
                `header__link ${isActive ? 'header__link--active' : ''}`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header__actions">
          <a className="header__phone" href={siteConfig.phoneHref}>
            <Phone size={16} aria-hidden />
            <span>{siteConfig.phone}</span>
          </a>
          <Link to="/kontakty/#zapis" className="btn btn--primary header__cta">
            Записаться
          </Link>
          <button
            type="button"
            className="header__burger"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div className={`header__drawer ${open ? 'is-open' : ''}`}>
        <nav className="header__drawer-nav" aria-label="Мобильная навигация">
          {navLinks.map((link) => (
            <NavLink key={link.href} to={link.href} onClick={closeMenu}>
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="header__drawer-actions">
          <a className="btn btn--ghost btn--block" href={siteConfig.phoneHref} onClick={closeMenu}>
            {siteConfig.phone}
          </a>
          <Link to="/kontakty/#zapis" className="btn btn--primary btn--block" onClick={closeMenu}>
            Записаться
          </Link>
        </div>
      </div>
    </header>
  );
}
