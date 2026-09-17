import { Link } from 'react-router-dom';
import { symptoms } from '../data/content';
import { Reveal } from './Reveal';
import './Symptoms.css';

export function Symptoms() {
  return (
    <section className="section symptoms" id="simptomy">
      <div className="container">
        <Reveal>
          <div className="section__head section__head--row">
            <div>
              <p className="section__eyebrow">Симптомы</p>
              <h2 className="section__title">Признаки неисправного вариатора</h2>
              <p className="section__lead">
                Если узнаёте один или несколько симптомов — начните с диагностики. Так проще понять
                причину и объём работ.
              </p>
            </div>
            <Link to="/kontakty/#zapis" className="btn btn--primary">
              Записаться на диагностику
            </Link>
          </div>
        </Reveal>

        <div className="grid-4 symptoms__grid">
          {symptoms.map((item, index) => (
            <Reveal key={item.id} delay={index * 40}>
              <article className="card symptoms__card">
                <span className="symptoms__index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
