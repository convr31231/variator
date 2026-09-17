import { processSteps } from '../data/content';
import { Reveal } from './Reveal';
import './Process.css';

export function Process() {
  return (
    <section className="section" id="process">
      <div className="container">
        <Reveal>
          <div className="section__head">
            <p className="section__eyebrow">Процесс</p>
            <h2 className="section__title">Как проходит ремонт</h2>
            <p className="section__lead">
              Семь понятных шагов: от заявки до выдачи автомобиля.
            </p>
          </div>
        </Reveal>

        <ol className="process__list">
          {processSteps.map((item, index) => (
            <Reveal key={item.step} delay={index * 35}>
              <li className="process__item">
                <span className="process__step">{item.step}</span>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
