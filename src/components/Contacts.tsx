import { MapPin, Clock, Phone, Mail, ExternalLink } from 'lucide-react';
import { siteConfig } from '../data/site';
import { LeadForm } from './LeadForm';
import { Reveal } from './Reveal';
import './Contacts.css';

type ContactsProps = {
  withHeading?: boolean;
};

export function Contacts({ withHeading = true }: ContactsProps) {
  const mapQuery = encodeURIComponent(siteConfig.address.full);
  const mapEmbed = `https://yandex.ru/map-widget/v1/?ll=${siteConfig.geo.lng}%2C${siteConfig.geo.lat}&z=14&pt=${siteConfig.geo.lng},${siteConfig.geo.lat},pm2rdm`;
  const mapRoute = `https://yandex.ru/maps/?rtext=~${siteConfig.geo.lat},${siteConfig.geo.lng}`;

  return (
    <section className="section contacts" id="kontakty">
      <div className="container">
        {withHeading && (
          <Reveal>
            <div className="section__head">
              <p className="section__eyebrow">Контакты</p>
              <h2 className="section__title">Как связаться и добраться</h2>
              <p className="section__lead">
                Адрес, телефон и режим работы — плейсхолдеры. Замените на данные сервиса в{' '}
                <code>src/data/site.ts</code>.
              </p>
            </div>
          </Reveal>
        )}

        <div className="contacts__grid">
          <Reveal>
            <div className="contacts__info card">
              <ul className="contacts__list">
                <li>
                  <MapPin size={18} aria-hidden />
                  <div>
                    <span>Адрес</span>
                    <strong>{siteConfig.address.full}</strong>
                  </div>
                </li>
                <li>
                  <Phone size={18} aria-hidden />
                  <div>
                    <span>Телефон</span>
                    <strong>
                      <a href={siteConfig.phoneHref}>{siteConfig.phone}</a>
                    </strong>
                  </div>
                </li>
                <li>
                  <Clock size={18} aria-hidden />
                  <div>
                    <span>Режим работы</span>
                    <strong>
                      {siteConfig.workingHours.weekdays}
                      <br />
                      {siteConfig.workingHours.saturday}
                      <br />
                      {siteConfig.workingHours.sunday}
                    </strong>
                  </div>
                </li>
                <li>
                  <Mail size={18} aria-hidden />
                  <div>
                    <span>Почта</span>
                    <strong>
                      <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
                    </strong>
                  </div>
                </li>
              </ul>

              <div className="contacts__messengers">
                <a
                  className="btn btn--soft"
                  href={siteConfig.messengers.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
                <a
                  className="btn btn--soft"
                  href={siteConfig.messengers.telegram}
                  target="_blank"
                  rel="noreferrer"
                >
                  Telegram
                </a>
                <a className="btn btn--ghost" href={mapRoute} target="_blank" rel="noreferrer">
                  Построить маршрут
                  <ExternalLink size={16} aria-hidden />
                </a>
              </div>
            </div>
          </Reveal>

          <Reveal delay={80}>
            <div className="contacts__form card" id="zapis">
              <h3>Записаться на диагностику</h3>
              <p>Оставьте контакты — перезвоним и согласуем время.</p>
              <LeadForm source="блок контактов" />
            </div>
          </Reveal>
        </div>

        <Reveal>
          <div className="contacts__map">
            <iframe
              title={`Карта: ${siteConfig.shortName}, ${siteConfig.city}`}
              src={mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <a className="contacts__map-link" href={`https://yandex.ru/maps/?text=${mapQuery}`} target="_blank" rel="noreferrer">
              Открыть в Яндекс Картах
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
