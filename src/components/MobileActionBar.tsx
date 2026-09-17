import { Link } from 'react-router-dom';
import { MessageCircle, Phone, Send } from 'lucide-react';
import { siteConfig } from '../data/site';
import './MobileActionBar.css';

export function MobileActionBar() {
  return (
    <div className="mobile-bar" role="region" aria-label="Быстрые действия">
      <a className="mobile-bar__btn" href={siteConfig.phoneHref}>
        <Phone size={18} aria-hidden />
        <span>Звонок</span>
      </a>
      <a
        className="mobile-bar__btn"
        href={siteConfig.messengers.whatsapp}
        target="_blank"
        rel="noreferrer"
      >
        <MessageCircle size={18} aria-hidden />
        <span>WhatsApp</span>
      </a>
      <a
        className="mobile-bar__btn"
        href={siteConfig.messengers.telegram}
        target="_blank"
        rel="noreferrer"
      >
        <Send size={18} aria-hidden />
        <span>Telegram</span>
      </a>
      <Link className="mobile-bar__btn mobile-bar__btn--accent" to="/kontakty/#zapis">
        <span>Запись</span>
      </Link>
    </div>
  );
}
