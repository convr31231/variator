import { Link } from 'react-router-dom';
import { publishedCases } from '../data/cases';
import { Reveal } from './Reveal';
import './Cases.css';

type CasesProps = {
  showHeader?: boolean;
};

export function Cases({ showHeader = true }: CasesProps) {
  return (
    <section className="section" id="raboty">
      <div className="container">
        {showHeader && (
          <Reveal>
            <div className="section__head section__head--row">
              <div>
                <p className="section__eyebrow">Наши работы</p>
                <h2 className="section__title">Реальные ремонты</h2>
                <p className="section__lead">
                  Кейсы публикуем только с реальными данными клиента: автомобиль, проблема,
                  диагностика, работы, результат и стоимость.
                </p>
              </div>
              <Link to="/raboty/" className="btn btn--ghost">
                Все работы
              </Link>
            </div>
          </Reveal>
        )}

        {publishedCases.length === 0 ? (
          <Reveal>
            <div className="placeholder-box cases__placeholder">
              <p className="cases__placeholder-title">Добавить реальные кейсы клиента</p>
              <p>
                Здесь будут карточки с фото до/после, описанием неисправности и стоимостью. Не
                публикуем вымышленные истории.
              </p>
              <p className="cases__placeholder-hint">
                Структура кейса уже готова в <code>src/data/cases.ts</code>
              </p>
            </div>
          </Reveal>
        ) : (
          <div className="grid-2">
            {publishedCases.map((item) => (
              <article key={item.id} className="card cases__card">
                <h3>{item.car}</h3>
                <dl className="cases__meta">
                  <div>
                    <dt>Проблема</dt>
                    <dd>{item.problem}</dd>
                  </div>
                  <div>
                    <dt>Диагностика</dt>
                    <dd>{item.diagnostics}</dd>
                  </div>
                  <div>
                    <dt>Что сделали</dt>
                    <dd>{item.work}</dd>
                  </div>
                  <div>
                    <dt>Результат</dt>
                    <dd>{item.result}</dd>
                  </div>
                  <div>
                    <dt>Стоимость</dt>
                    <dd>{item.price}</dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
