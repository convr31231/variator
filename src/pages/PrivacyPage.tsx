import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { siteConfig } from '../data/site';

export function PrivacyPage() {
  return (
    <>
      <Seo
        title="Политика обработки персональных данных"
        description="Политика конфиденциальности и обработки персональных данных сервиса ремонта вариаторов."
        path="/politika-konfidencialnosti/"
        noindex
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span>/</span>
            <span>Политика конфиденциальности</span>
          </nav>
          <h1>Политика обработки персональных данных</h1>
          <p>Шаблон документа. Юрист клиента должен адаптировать текст под организацию.</p>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container prose">
          <p>
            Настоящая политика определяет порядок обработки персональных данных пользователей сайта{' '}
            {siteConfig.shortName} ({siteConfig.baseUrl}).
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.75rem', fontSize: '1.2rem' }}>
            1. Какие данные обрабатываются
          </h2>
          <p>
            Имя, номер телефона, комментарий из формы заявки, технические данные о посещении сайта
            (при подключении аналитики).
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.75rem', fontSize: '1.2rem' }}>
            2. Цели обработки
          </h2>
          <p>
            Связь с пользователем для записи на диагностику/ремонт, ответы на обращения, улучшение
            работы сайта.
          </p>
          <h2 style={{ color: 'var(--text)', margin: '1.5rem 0 0.75rem', fontSize: '1.2rem' }}>
            3. Контакты по вопросам ПДн
          </h2>
          <p>
            {siteConfig.legal.entity}. Email: {siteConfig.legal.privacyEmail}. Телефон:{' '}
            {siteConfig.phone}.
          </p>
          <p style={{ marginTop: '1.5rem' }}>
            Документ носит ознакомительный характер до юридической проверки.
          </p>
        </div>
      </section>
    </>
  );
}
