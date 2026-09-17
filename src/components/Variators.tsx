import { Link } from 'react-router-dom';
import { variators } from '../data/variators';
import { Reveal } from './Reveal';
import './Variators.css';

export function Variators() {
  return (
    <section className="section variators" id="variatory">
      <div className="container">
        <Reveal>
          <div className="section__head section__head--row">
            <div>
              <p className="section__eyebrow">Марки и типы</p>
              <h2 className="section__title">Вариаторы, с которыми работаем</h2>
              <p className="section__lead">
                SEO-каталог по маркам с полезным содержанием — без пустых страниц «ради количества».
              </p>
            </div>
            <Link to="/variatory/" className="btn btn--ghost">
              Каталог вариаторов
            </Link>
          </div>
        </Reveal>

        <div className="grid-3">
          {variators.map((item, index) => (
            <Reveal key={item.slug} delay={index * 40}>
              <Link to={`/variatory/${item.slug}/`} className="card card--link variators__card">
                <span className="badge">{item.brand}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
