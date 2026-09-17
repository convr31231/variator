import { Link } from 'react-router-dom';
import { Seo } from '../components/Seo';
import { FAQ } from '../components/FAQ';
import { CTA } from '../components/CTA';

export function FAQPage() {
  return (
    <>
      <Seo
        title="Вопросы о ремонте вариатора во Владивостоке"
        description="FAQ: сколько стоит ремонт вариатора, сколько длится диагностика, можно ли ездить с рывками, когда менять масло CVT."
        path="/faq/"
      />
      <section className="page-hero">
        <div className="container">
          <nav className="breadcrumbs" aria-label="Хлебные крошки">
            <Link to="/">Главная</Link>
            <span>/</span>
            <span>FAQ</span>
          </nav>
          <h1>Частые вопросы</h1>
          <p>Ответы на вопросы владельцев автомобилей с вариатором во Владивостоке.</p>
        </div>
      </section>
      <FAQ showAllLink={false} showHeader={false} />
      <CTA />
    </>
  );
}
