import { Link } from 'react-router-dom';
import { Reveal } from './Reveal';
import './Urgency.css';

export function Urgency() {
  return (
    <section className="section urgency">
      <div className="container">
        <Reveal>
          <div className="urgency__panel">
            <div>
              <p className="section__eyebrow">Важно вовремя</p>
              <h2 className="section__title">Почему не стоит откладывать проверку</h2>
              <p className="section__lead">
                Небольшая неисправность вариатора может развиваться: износ цепи и шкивов, перегрев
                масла, повреждение гидроблока. Ранняя диагностика часто помогает ограничиться
                меньшим объёмом работ и сохранить ресурс агрегата.
              </p>
              <p className="urgency__note">
                Без запугивания: цель — понять причину и принять решение спокойно, с прозрачной
                сметой.
              </p>
            </div>
            <Link to="/uslugi/diagnostika-variatora/" className="btn btn--soft">
              Подробнее о диагностике
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
