(function () {
  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function renderBusiness(B) {
    if (!B) return;

    const base = document.body.dataset.base || '';
    const withBase = (p) => {
      const path = String(p || '');
      if (/^(https?:|tel:|mailto:|#|\/)/.test(path)) return path;
      return base + path;
    };

    document.querySelectorAll('[data-text]').forEach((el) => {
      const key = el.getAttribute('data-text');
      const map = {
        name: B.name,
        shortName: B.shortName,
        phone: B.phone,
        address: B.address,
        schedule: B.schedule?.short,
        weekdays: B.schedule?.weekdays,
        weekend: B.schedule?.weekend,
        email: B.email,
        tagline: B.tagline,
        entity: B.legal?.entity,
        priceNote: B.priceNote,
        priceDisclaimer: B.priceDisclaimer,
        partsVinNote: B.partsVinNote,
        heroTitle: B.heroTitle,
        heroSub: B.heroSub,
      };
      if (map[key] != null) el.textContent = map[key];
    });

    document.querySelectorAll('[data-href="phone"]').forEach((el) => {
      el.setAttribute('href', B.phoneHref || '#');
    });

    document.querySelectorAll('[data-messenger]').forEach((el) => {
      const key = el.getAttribute('data-messenger');
      const url = B.messengers?.[key];
      if (!url) {
        el.hidden = true;
        return;
      }
      el.hidden = false;
      el.href = url;
    });

    const messengerIcons = {
      whatsapp: {
        label: 'WhatsApp',
        svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.15 6.4 2.15 11.84c0 1.98.57 3.84 1.56 5.42L2 22l4.9-1.58a9.86 9.86 0 0 0 5.14 1.42h.01c5.46 0 9.89-4.4 9.89-9.84C21.94 6.4 17.5 2 12.04 2zm5.73 13.95c-.24.68-1.4 1.25-1.93 1.33-.5.07-1.13.1-1.82-.11-.42-.13-.96-.31-1.65-.61-2.9-1.26-4.79-4.19-4.93-4.38-.14-.19-1.15-1.53-1.15-2.92 0-1.39.73-2.07.99-2.35.26-.28.57-.35.76-.35h.55c.18 0 .41-.07.64.49.24.58.81 2 .88 2.14.07.14.12.31.02.5-.1.19-.15.31-.3.48-.15.16-.31.36-.44.49-.15.14-.3.29-.13.57.17.28.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.29.14.46.12.63-.07.17-.19.73-.85.93-1.14.2-.29.39-.24.66-.14.26.1 1.67.79 1.96.93.28.14.47.21.54.33.07.12.07.69-.17 1.37z"/></svg>',
      },
      telegram: {
        label: 'Telegram',
        svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M21.94 4.24 19.1 19.35c-.2 1-.76 1.24-1.54.77l-4.27-3.15-2.06 1.98c-.23.23-.42.42-.86.42l.31-4.35 7.91-7.14c.34-.31-.08-.48-.53-.17l-9.77 6.15-4.21-1.32c-.92-.28-.93-.9.2-1.34L20.55 3.3c.77-.28 1.44.17 1.39.94z"/></svg>',
      },
      max: {
        label: 'Написать в MAX',
        // Знак из официального брендбука https://go.max.ru/brandbook (монохром, как соседние иконки).
        svg: '<svg viewBox="0 0 100 100" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M50.76 0c27.53 0 49.12 22.34 49.12 49.89S77.61 99.23 51.02 99.23c-9.43 0-14.01-1.33-21.37-6.54-.5-.36-1.2-.26-1.63.19-5.66 6.04-20.17 10.28-20.83 2.03C7.19 80.53 0 71.18 0 49.61 0 21.3 23.22 0 50.76 0m.77 24.55c-13.07-.68-23.26 8.39-25.51 22.58-1.86 11.75 1.44 26.07 4.26 26.8 1.2.3 4.08-1.9 6.18-3.88.4-.37.99-.44 1.45-.15 3.27 2 6.97 3.5 11.05 3.71 13.42.7 25.3-9.8 26-23.21.71-13.42-10.01-25.14-23.43-25.85"/></svg>',
      },
    };

    function renderMessengerIcons(container) {
      if (!container) return false;
      const messengers = B.messengers || {};
      const items = ['whatsapp', 'telegram', 'max']
        .filter((key) => !!messengers[key])
        .map((key) => [key, messengers[key]]);
      if (!items.length) {
        container.innerHTML = '';
        return false;
      }
      container.innerHTML = items
        .map(([key, url]) => {
          const meta = messengerIcons[key] || { label: key, svg: '' };
          return `<a class="messenger-icon" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" aria-label="${escapeHtml(meta.label)}" title="${escapeHtml(meta.label)}">${meta.svg}<span class="visually-hidden">${escapeHtml(meta.label)}</span></a>`;
        })
        .join('');
      return true;
    }

    const headerMessengers = document.querySelector('[data-header-messengers]');
    const hasMessengers = renderMessengerIcons(document.querySelector('[data-messenger-icons]'));
    renderMessengerIcons(document.querySelector('[data-messenger-icons-mobile]'));
    renderMessengerIcons(document.querySelector('[data-messenger-icons-contacts]'));
    if (headerMessengers) headerMessengers.hidden = !hasMessengers;

    document.querySelectorAll('[data-map]').forEach((el) => {
      const key = el.getAttribute('data-map');
      const url = B.maps?.[key];
      el.onclick = null;
      if (!url) {
        el.addEventListener('click', function onMap(e) {
          e.preventDefault();
          alert('Ссылка на карту пока не добавлена. Уточните адрес по телефону.');
        });
      } else {
        el.href = url;
        el.target = '_blank';
        el.rel = 'noopener noreferrer';
      }
    });

    const trust = document.querySelector('[data-trust]');
    if (trust) {
      trust.innerHTML = (B.trustPoints || [])
        .map(
          (t) => `<article class="trust-card reveal"><h3>${escapeHtml(t.title)}</h3><p>${escapeHtml(t.text)}</p></article>`,
        )
        .join('');
    }

    const services = document.querySelector('[data-services]');
    if (services) {
      services.innerHTML = (B.services || [])
        .map(
          (s) => `<a class="service-tile${s.featured ? ' service-tile--xl' : ''} reveal" href="${escapeHtml(withBase(s.href))}">
        <span class="chip">${s.featured ? 'Основная услуга' : 'Услуга'}</span>
        <h3>${escapeHtml(s.title)}</h3>
        <p>${escapeHtml(s.short)}</p>
        <span class="price">${escapeHtml(s.price)}</span>
        <span class="btn btn--soft">Подробнее</span>
      </a>`,
        )
        .join('');
    }

    const symptoms = document.querySelector('[data-symptoms]');
    if (symptoms) {
      symptoms.innerHTML = (B.symptoms || [])
        .map(
          (s) => `<article class="symptom reveal">
        <h3>${escapeHtml(s.title)}</h3>
        <dl>
          <div><dt>Что это может означать</dt><dd>${escapeHtml(s.meaning)}</dd></div>
          <div><dt>Что делать</dt><dd>${escapeHtml(s.action)}</dd></div>
        </dl>
      </article>`,
        )
        .join('');
    }

    const steps = document.querySelector('[data-steps]');
    if (steps) {
      steps.innerHTML = (B.diagnosticsSteps || [])
        .map(
          (s) => `<div class="step reveal"><span class="step-n">${escapeHtml(s.n)}</span><div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.text)}</p></div></div>`,
        )
        .join('');
    }

    const flow = document.querySelector('[data-flow]');
    if (flow) {
      flow.innerHTML = (B.processTransparent || [])
        .map(
          (s, i) => `<div class="flow-item reveal"><i>${i + 1}</i><div><h3>${escapeHtml(s.title)}</h3><p>${escapeHtml(s.text)}</p></div></div>`,
        )
        .join('');
    }

    const brands = document.querySelector('[data-brands]');
    if (brands) {
      brands.innerHTML = (B.brands || [])
        .map((b) =>
          b.href
            ? `<a class="brand-pill reveal" href="${escapeHtml(withBase(b.href))}">${escapeHtml(b.name)}</a>`
            : `<span class="brand-pill reveal">${escapeHtml(b.name)}</span>`,
        )
        .join('');
    }

    const brandsNote = document.querySelector('[data-brands-note]');
    if (brandsNote && B.brandsNote) brandsNote.textContent = B.brandsNote;

    const partsRoot = document.querySelector('[data-parts]');
    const partsChips = document.querySelector('[data-parts-chips]');
    let partsFilter = 'all';

    function renderParts() {
      if (!partsRoot || !B.parts) return;
      const list =
        partsFilter === 'all'
          ? B.parts
          : B.parts.filter((p) => (p.brands || []).includes(partsFilter));

      if (!list.length) {
        partsRoot.innerHTML = `<div class="empty reveal"><strong>Нет позиций по марке</strong><p>Выберите другую марку или отправьте номер кузова / VIN — подберём деталь.</p></div>`;
        return;
      }

      partsRoot.innerHTML = list
        .map((p) => {
          const fits = (p.fits || []).map((f) => `<li>${escapeHtml(f)}</li>`).join('');
          return `<article class="part-card reveal" data-part-brands="${escapeHtml((p.brands || []).join(','))}">
          <div class="part-card__media">
            <img src="${escapeHtml(withBase(p.image))}" alt="${escapeHtml(p.title)}" loading="lazy" width="800" height="560">
          </div>
          <div class="part-card__body">
            <h3>${escapeHtml(p.title)}</h3>
            <p class="part-card__desc">${escapeHtml(p.description)}</p>
            <div class="part-card__fits">
              <span>Подходит для:</span>
              <ul>${fits}</ul>
            </div>
            <div class="part-card__foot">
              <div class="part-card__price"><span>Стоимость</span><strong>${escapeHtml(p.price)}</strong></div>
              <button class="btn btn--soft btn--block" type="button"
                data-open-modal="book"
                data-part-title="${escapeHtml('Уточнить наличие: ' + p.title)}"
                data-part-message="${escapeHtml('Интересует запчасть: ' + p.title + '. Стоимость на сайте: ' + p.price + '. Нужно уточнить наличие и совместимость.')}">
                Уточнить наличие
              </button>
            </div>
          </div>
        </article>`;
        })
        .join('');
    }

    if (partsChips && B.partsFilters) {
      const chips = ['Все', ...B.partsFilters]
        .map((name, i) => {
          const value = name === 'Все' ? 'all' : name;
          return `<button type="button" class="parts-chip${i === 0 ? ' is-active' : ''}" data-filter="${escapeHtml(value)}">${escapeHtml(name)}</button>`;
        })
        .join('');
      partsChips.innerHTML = chips;
      partsChips.onclick = (e) => {
        const btn = e.target.closest('[data-filter]');
        if (!btn) return;
        partsFilter = btn.getAttribute('data-filter') || 'all';
        partsChips.querySelectorAll('.parts-chip').forEach((c) => c.classList.toggle('is-active', c === btn));
        renderParts();
      };
    }
    renderParts();

    const prices = document.querySelector('[data-prices]');
    if (prices) {
      if ((B.prices || []).length) {
        const rows = B.prices
          .map(
            (p) => `<div class="price-row reveal"><span class="price-row__title">${escapeHtml(p.title)}</span><strong class="price-row__value">${escapeHtml(p.price)}</strong></div>`,
          )
          .join('');
        const note = B.priceDisclaimer || B.priceNote;
        prices.innerHTML = `<div class="price-list">${rows}</div><p class="price-note reveal">${escapeHtml(note)}</p>`;
      } else {
        prices.innerHTML = `<div class="price-panel reveal"><p>${escapeHtml(B.priceNote)}</p></div>`;
      }
    }

    const cases = document.querySelector('[data-cases]');
    if (cases) {
      cases.innerHTML = (B.cases || []).length
        ? B.cases
            .map((c) => {
              const img = c.image
                ? `<div class="part-card__media" style="margin-bottom:0.85rem"><img src="${escapeHtml(withBase(c.image))}" alt="${escapeHtml(c.car)}" loading="lazy"></div>`
                : '';
              return `<article class="symptom reveal">${img}<h3>${escapeHtml(c.car)}</h3><dl>
          <div><dt>Проблема</dt><dd>${escapeHtml(c.problem)}</dd></div>
          <div><dt>Диагностика</dt><dd>${escapeHtml(c.diagnostics)}</dd></div>
          <div><dt>Что сделали</dt><dd>${escapeHtml(c.work)}</dd></div>
          <div><dt>Результат</dt><dd>${escapeHtml(c.result)}</dd></div>
        </dl></article>`;
            })
            .join('')
        : `<div class="empty reveal"><strong>Реальные работы</strong><p>Структура готова: автомобиль → проблема → диагностика → работы → результат. Примеры появятся после предоставления данных.</p></div>`;
    }

    const reviews = document.querySelector('[data-reviews]');
    if (reviews) {
      reviews.innerHTML = (B.reviews || []).length
        ? B.reviews.map((r) => `<article class="trust-card reveal"><h3>${escapeHtml(r.author)}</h3><p>${escapeHtml(r.text)}</p></article>`).join('')
        : `<div class="empty reveal"><strong>Отзывы клиентов</strong><p>Фальшивые отзывы не публикуем. Добавьте реальные отзывы в админ-панели.</p></div>`;
    }

    const gallery = document.querySelector('[data-gallery]');
    if (gallery) {
      gallery.innerHTML = (B.gallery || [])
        .map(
          (g) => `<button type="button" data-gallery-item data-src="${escapeHtml(withBase(g.src))}" data-alt="${escapeHtml(g.alt)}" aria-label="Открыть фото">
        <img src="${escapeHtml(withBase(g.src))}" alt="${escapeHtml(g.alt)}" loading="lazy" width="800" height="600">
      </button>`,
        )
        .join('');
    }

    const articles = document.querySelector('[data-articles]');
    if (articles) {
      articles.innerHTML = (B.articles || [])
        .map(
          (a) => `<a class="article-card reveal" href="${escapeHtml(withBase(a.href))}"><h3>${escapeHtml(a.title)}</h3><p>${escapeHtml(a.lead)}</p></a>`,
        )
        .join('');
    }

    const faq = document.querySelector('[data-faq]');
    if (faq) {
      const limit = faq.getAttribute('data-limit');
      const items = limit ? (B.faq || []).slice(0, Number(limit)) : B.faq || [];
      faq.innerHTML = items
        .map(
          (item, i) => `<div class="faq-item${i === 0 ? ' is-open' : ''} reveal">
        <button type="button" class="faq-q" aria-expanded="${i === 0}"><span>${escapeHtml(item.q)}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="faq-a" style="${i === 0 ? 'max-height:240px' : ''}"><div class="faq-a-inner">${escapeHtml(item.a)}</div></div>
      </div>`,
        )
        .join('');
    }

    const warranty = document.querySelector('[data-warranty]');
    if (warranty) {
      if (B.warranty?.enabled) {
        warranty.hidden = false;
        const wt = warranty.querySelector('[data-warranty-title]');
        const wtx = warranty.querySelector('[data-warranty-text]');
        if (wt) wt.textContent = B.warranty.title;
        if (wtx) wtx.textContent = B.warranty.text;
      } else {
        warranty.hidden = true;
      }
    }

    const year = document.querySelector('[data-year]');
    if (year) year.textContent = String(new Date().getFullYear());

    const nodes = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) {
              en.target.classList.add('is-on');
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
      );
      nodes.forEach((n) => io.observe(n));
    } else nodes.forEach((n) => n.classList.add('is-on'));

    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 60);
    }
  }

  window.renderBusiness = renderBusiness;

  const ready = window.__contentReady || Promise.resolve();
  ready.finally(() => {
    renderBusiness(window.BUSINESS);
  });
})();
