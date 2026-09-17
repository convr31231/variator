import { advantages } from '../data/content';
import { Reveal } from './Reveal';
import './Advantages.css';

export function Advantages() {
  return (
    <section className="section advantages">
      <div className="container">
        <Reveal>
          <div className="section__head">
            <p className="section__eyebrow">Доверие</p>
            <h2 className="section__title">Почему нам доверяют</h2>
            <p className="section__lead">
              Только конкретные рабочие практики. Пункты с пометкой в скобках — замените на
              подтверждённые условия сервиса.
            </p>
          </div>
        </Reveal>

        <div className="grid-3">
          {advantages.map((item, index) => (
            <Reveal key={item.id} delay={index * 40}>
              <article className="card advantages__card">
                <span className="advantages__num">{String(index + 1).padStart(2, '0')}</span>
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
