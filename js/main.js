(function () {
  const B = window.BUSINESS;
  if (!B) return;

  const base = document.body.dataset.base || '';
  const withBase = (p) => (/^(https?:|tel:|mailto:|#)/.test(p) ? p : base + p);

  document.querySelectorAll('[data-text]').forEach((el) => {
    const key = el.getAttribute('data-text');
    const map = {
      name: B.name,
      shortName: B.shortName,
      phone: B.phone,
      address: B.address,
      schedule: B.schedule.short,
      weekdays: B.schedule.weekdays,
      weekend: B.schedule.weekend,
      email: B.email,
      tagline: B.tagline,
      entity: B.legal.entity,
      priceNote: B.priceNote,
      priceDisclaimer: B.priceDisclaimer,
      partsVinNote: B.partsVinNote,
    };
    if (map[key] != null) el.textContent = map[key];
  });

  document.querySelectorAll('[data-href="phone"]').forEach((el) => {
    el.setAttribute('href', B.phoneHref);
  });

  document.querySelectorAll('[data-messenger]').forEach((el) => {
    const key = el.getAttribute('data-messenger');
    const url = B.messengers[key];
    if (!url) {
      el.hidden = true;
      return;
    }
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
      label: 'MAX',
      svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><path d="M7.5 15.5V8.5L12 13l4.5-4.5v7"/></svg>',
    },
  };

  function renderMessengerIcons(container) {
    if (!container) return false;
    const items = Object.entries(B.messengers || {}).filter(([, url]) => !!url);
    if (!items.length) {
      container.innerHTML = '';
      return false;
    }
    container.innerHTML = items
      .map(([key, url]) => {
        const meta = messengerIcons[key] || { label: key, svg: '' };
        return `<a class="messenger-icon" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="${meta.label}" title="${meta.label}">${meta.svg}<span class="visually-hidden">${meta.label}</span></a>`;
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
    const url = B.maps[key];
    if (!url) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        alert('Ссылка на карту пока не добавлена. Уточните адрес по телефону.');
      });
    } else el.href = url;
  });

  const trust = document.querySelector('[data-trust]');
  if (trust) {
    trust.innerHTML = B.trustPoints
      .map(
        (t) => `<article class="trust-card reveal"><h3>${t.title}</h3><p>${t.text}</p></article>`,
      )
      .join('');
  }

  const services = document.querySelector('[data-services]');
  if (services) {
    services.innerHTML = B.services
      .map(
        (s) => `<a class="service-tile${s.featured ? ' service-tile--xl' : ''} reveal" href="${withBase(s.href)}">
        <span class="chip">${s.featured ? 'Основная услуга' : 'Услуга'}</span>
        <h3>${s.title}</h3>
        <p>${s.short}</p>
        <span class="price">${s.price}</span>
        <span class="btn btn--soft">Подробнее</span>
      </a>`,
      )
      .join('');
  }

  const symptoms = document.querySelector('[data-symptoms]');
  if (symptoms) {
    symptoms.innerHTML = B.symptoms
      .map(
        (s) => `<article class="symptom reveal">
        <h3>${s.title}</h3>
        <dl>
          <div><dt>Что это может означать</dt><dd>${s.meaning}</dd></div>
          <div><dt>Что делать</dt><dd>${s.action}</dd></div>
        </dl>
      </article>`,
      )
      .join('');
  }

  const steps = document.querySelector('[data-steps]');
  if (steps) {
    steps.innerHTML = B.diagnosticsSteps
      .map(
        (s) => `<div class="step reveal"><span class="step-n">${s.n}</span><div><h3>${s.title}</h3><p>${s.text}</p></div></div>`,
      )
      .join('');
  }

  const flow = document.querySelector('[data-flow]');
  if (flow) {
    flow.innerHTML = B.processTransparent
      .map(
        (s, i) => `<div class="flow-item reveal"><i>${i + 1}</i><div><h3>${s.title}</h3><p>${s.text}</p></div></div>`,
      )
      .join('');
  }

  const brands = document.querySelector('[data-brands]');
  if (brands) {
    brands.innerHTML = B.brands
      .map((b) =>
        b.href
          ? `<a class="brand-pill reveal" href="${withBase(b.href)}">${b.name}</a>`
          : `<span class="brand-pill reveal">${b.name}</span>`,
      )
      .join('');
  }

  const brandsNote = document.querySelector('[data-brands-note]');
  if (brandsNote && B.brandsNote) brandsNote.textContent = B.brandsNote;

  // Parts catalog
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
        const fits = (p.fits || []).map((f) => `<li>${f}</li>`).join('');
        return `<article class="part-card reveal" data-part-brands="${(p.brands || []).join(',')}">
          <div class="part-card__media">
            <img src="${withBase(p.image)}" alt="${p.title}" loading="lazy" width="800" height="560">
          </div>
          <div class="part-card__body">
            <h3>${p.title}</h3>
            <p class="part-card__desc">${p.description}</p>
            <div class="part-card__fits">
              <span>Подходит для:</span>
              <ul>${fits}</ul>
            </div>
            <div class="part-card__foot">
              <div class="part-card__price"><span>Стоимость</span><strong>${p.price}</strong></div>
              <button class="btn btn--soft btn--block" type="button"
                data-open-modal="book"
                data-part-title="Уточнить наличие: ${p.title}"
                data-part-message="Интересует запчасть: ${p.title}. Стоимость на сайте: ${p.price}. Нужно уточнить наличие и совместимость.">
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
        return `<button type="button" class="parts-chip${i === 0 ? ' is-active' : ''}" data-filter="${value}">${name}</button>`;
      })
      .join('');
    partsChips.innerHTML = chips;
    partsChips.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter]');
      if (!btn) return;
      partsFilter = btn.getAttribute('data-filter') || 'all';
      partsChips.querySelectorAll('.parts-chip').forEach((c) => c.classList.toggle('is-active', c === btn));
      renderParts();
    });
  }
  renderParts();

  const prices = document.querySelector('[data-prices]');
  if (prices) {
    if (B.prices.length) {
      const rows = B.prices
        .map(
          (p) => `<div class="price-row reveal"><span class="price-row__title">${p.title}</span><strong class="price-row__value">${p.price}</strong></div>`,
        )
        .join('');
      const note = B.priceDisclaimer || B.priceNote;
      prices.innerHTML = `<div class="price-list">${rows}</div><p class="price-note reveal">${note}</p>`;
    } else {
      prices.innerHTML = `<div class="price-panel reveal"><p>${B.priceNote}</p></div>`;
    }
  }

  const cases = document.querySelector('[data-cases]');
  if (cases) {
    cases.innerHTML = B.cases.length
      ? B.cases
          .map(
            (c) => `<article class="symptom reveal"><h3>${c.car}</h3><dl>
          <div><dt>Проблема</dt><dd>${c.problem}</dd></div>
          <div><dt>Диагностика</dt><dd>${c.diagnostics}</dd></div>
          <div><dt>Что сделали</dt><dd>${c.work}</dd></div>
          <div><dt>Результат</dt><dd>${c.result}</dd></div>
        </dl></article>`,
          )
          .join('')
      : `<div class="empty reveal"><strong>Реальные работы</strong><p>Структура готова: автомобиль → проблема → диагностика → работы → результат. Кейсы появятся после предоставления данных.</p></div>`;
  }

  const reviews = document.querySelector('[data-reviews]');
  if (reviews) {
    reviews.innerHTML = B.reviews.length
      ? B.reviews.map((r) => `<article class="trust-card reveal"><h3>${r.author}</h3><p>${r.text}</p></article>`).join('')
      : `<div class="empty reveal"><strong>Отзывы клиентов</strong><p>Фальшивые отзывы не публикуем. Добавьте реальные отзывы или ссылку на 2GIS / Яндекс Карты в js/data.js.</p></div>`;
  }

  const gallery = document.querySelector('[data-gallery]');
  if (gallery) {
    gallery.innerHTML = B.gallery
      .map(
        (g) => `<button type="button" data-gallery-item data-src="${withBase(g.src)}" data-alt="${g.alt}" aria-label="Открыть фото">
        <img src="${withBase(g.src)}" alt="${g.alt}" loading="lazy" width="800" height="600">
      </button>`,
      )
      .join('');
  }

  const articles = document.querySelector('[data-articles]');
  if (articles) {
    articles.innerHTML = B.articles
      .map(
        (a) => `<a class="article-card reveal" href="${withBase(a.href)}"><h3>${a.title}</h3><p>${a.lead}</p></a>`,
      )
      .join('');
  }

  const faq = document.querySelector('[data-faq]');
  if (faq) {
    const limit = faq.getAttribute('data-limit');
    const items = limit ? B.faq.slice(0, Number(limit)) : B.faq;
    faq.innerHTML = items
      .map(
        (item, i) => `<div class="faq-item${i === 0 ? ' is-open' : ''} reveal">
        <button type="button" class="faq-q" aria-expanded="${i === 0}"><span>${item.q}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
        </button>
        <div class="faq-a" style="${i === 0 ? 'max-height:240px' : ''}"><div class="faq-a-inner">${item.a}</div></div>
      </div>`,
      )
      .join('');
  }

  const warranty = document.querySelector('[data-warranty]');
  if (warranty) {
    if (B.warranty.enabled) {
      warranty.hidden = false;
      warranty.querySelector('[data-warranty-title]').textContent = B.warranty.title;
      warranty.querySelector('[data-warranty-text]').textContent = B.warranty.text;
    } else {
      warranty.hidden = true;
    }
  }

  const year = document.querySelector('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());

  // Reveal
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
})();
