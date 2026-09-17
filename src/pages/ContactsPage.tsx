import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { Contacts } from '../components/Contacts';
import { CTA } from '../components/CTA';

export function ContactsPage() {
  return (
    <>
      <Seo
        title="Контакты сервиса ремонта вариаторов во Владивостоке"
        description="Адрес, телефон, режим работы и запись на диагностику вариатора во Владивостоке. Карта и мессенджеры."
        path="/kontakty/"
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span>/</span>
            <span>Контакты</span>
          </nav>
          <h1>Контакты</h1>
          <p>Сервис ремонта вариаторов во Владивостоке. Запишитесь на диагностику или позвоните.</p>
        </div>
      </section>
      <Contacts withHeading={false} />
      <CTA />
    </>
  );
}
