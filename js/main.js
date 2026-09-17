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

  document.querySelectorAll('[data-map]').forEach((el) => {
    const key = el.getAttribute('data-map');
    const url = B.maps[key];
    if (!url) {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        alert('TODO: добавьте ссылку на карту в js/data.js');
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
      .map((b) => `<a class="brand-pill reveal" href="${withBase(b.href)}">${b.name}</a>`)
      .join('');
  }

  const prices = document.querySelector('[data-prices]');
  if (prices) {
    if (B.prices.length) {
      prices.innerHTML = B.prices
        .map((p) => `<div class="flow-item"><div><h3>${p.title}</h3><p>${p.note || ''}</p></div><strong style="color:var(--accent)">${p.price}</strong></div>`)
        .join('');
    } else {
      prices.innerHTML = `<div class="price-panel reveal"><p>${B.priceNote}</p><p class="todo" style="margin-top:1rem">TODO: добавить прайс после получения данных заказчика</p></div>`;
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
