import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { faqItems } from '../data/faq';
import { Reveal } from './Reveal';
import './FAQ.css';

type FAQProps = {
  limit?: number;
  showAllLink?: boolean;
  showHeader?: boolean;
};

export function FAQ({ limit, showAllLink = true, showHeader = true }: FAQProps) {
  const items = typeof limit === 'number' ? faqItems.slice(0, limit) : faqItems;
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <section className="section faq" id="faq">
      <div className="container">
        {showHeader && (
          <Reveal>
            <div className="section__head section__head--row">
              <div>
                <p className="section__eyebrow">FAQ</p>
                <h2 className="section__title">Частые вопросы</h2>
                <p className="section__lead">
                  Короткие ответы без SEO-воды — о цене, сроках, диагностике и гарантии.
                </p>
              </div>
              {showAllLink && (
                <Link to="/faq/" className="btn btn--ghost">
                  Все вопросы
                </Link>
              )}
            </div>
          </Reveal>
        )}

        <div className="faq__list">
          {items.map((item) => {
            const open = openId === item.id;
            return (
              <Reveal key={item.id}>
                <div className={`faq__item ${open ? 'is-open' : ''}`}>
                  <button
                    type="button"
                    className="faq__question"
                    aria-expanded={open}
                    onClick={() => setOpenId(open ? null : item.id)}
                  >
                    <span>{item.question}</span>
                    <ChevronDown size={18} aria-hidden />
                  </button>
                  {open && <div className="faq__answer">{item.answer}</div>}
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
