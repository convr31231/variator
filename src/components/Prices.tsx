import { Link } from 'react-router-dom';
import { priceItems } from '../data/content';
import { Reveal } from './Reveal';
import './Prices.css';

type PricesProps = {
  showHeader?: boolean;
};

export function Prices({ showHeader = true }: PricesProps) {
  return (
    <section className="section prices" id="ceny">
      <div className="container">
        {showHeader && (
          <Reveal>
            <div className="section__head section__head--row">
              <div>
                <p className="section__eyebrow">Цены</p>
                <h2 className="section__title">Ориентиры по стоимости</h2>
                <p className="section__lead">
                  Реальные цены сервиса пока не указаны — ниже плейсхолдеры. Точная сумма формируется
                  после диагностики.
                </p>
              </div>
              <Link to="/ceny/" className="btn btn--ghost">
                Страница цен
              </Link>
            </div>
          </Reveal>
        )}

        <div className="prices__table-wrap">
          <table className="prices__table">
            <thead>
              <tr>
                <th>Услуга</th>
                <th>Цена</th>
                <th>Комментарий</th>
              </tr>
            </thead>
            <tbody>
              {priceItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <Link to={item.href}>{item.service}</Link>
                  </td>
                  <td>{item.price}</td>
                  <td>{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="prices__cards" aria-hidden="false">
          {priceItems.map((item) => (
            <Link key={item.id} to={item.href} className="card prices__card">
              <h3>{item.service}</h3>
              <p className="prices__card-price">{item.price}</p>
              <p>{item.note}</p>
            </Link>
          ))}
        </div>

        <Reveal>
          <div className="prices__cta">
            <p>Нужна ориентировочная стоимость под ваш автомобиль?</p>
            <Link to="/kontakty/#zapis" className="btn btn--primary">
              Оставить заявку
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
