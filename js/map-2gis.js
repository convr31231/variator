/**
 * Встраивание официального виджета 2ГИС «Организации на карте» (firmsonmap).
 * URL формируется так же, как в https://widgets.2gis.com/js/DGWidgetLoader.js
 */
(function () {
  const FIRM_URL = 'https://2gis.ru/vladivostok/firm/70000001028631070';

  function widgetOptions(el) {
    const fromData = window.BUSINESS?.maps?.widget || {};
    return {
      orgId: el.getAttribute('data-org') || fromData.orgId || '70000001028631070',
      city: el.getAttribute('data-city') || fromData.city || 'vladivostok',
      lat: Number(el.getAttribute('data-lat') || fromData.lat || 43.122425),
      lon: Number(el.getAttribute('data-lon') || fromData.lon || 131.877191),
      zoom: Number(el.getAttribute('data-zoom') || fromData.zoom || 16),
      title:
        el.getAttribute('data-title') ||
        'FTC на карте 2ГИС — Владивосток, Западная улица, 11',
    };
  }

  /** Тот же формат, что собирает DGWidgetLoader для type=firmsonmap */
  function buildWidgetSrc(opt) {
    const options = {
      pos: { lat: opt.lat, lon: opt.lon, zoom: opt.zoom },
      opt: { city: opt.city },
      org: String(opt.orgId),
    };
    return (
      'https://widgets.2gis.com/widget?type=firmsonmap&options=' +
      encodeURIComponent(JSON.stringify(options))
    );
  }

  function mount(el) {
    if (el.dataset.mounted === '1') return;
    el.dataset.mounted = '1';

    const opt = widgetOptions(el);
    const frame = document.createElement('iframe');
    frame.className = 'map-embed__frame';
    frame.title = opt.title;
    frame.loading = 'lazy';
    frame.referrerPolicy = 'no-referrer-when-downgrade';
    frame.allowFullscreen = true;
    frame.setAttribute('allow', 'geolocation; fullscreen');
    frame.src = buildWidgetSrc(opt);

    frame.addEventListener('error', () => {
      el.classList.add('is-error');
      const note = el.querySelector('[data-map-fallback]');
      if (note) note.hidden = false;
    });

    const placeholder = el.querySelector('.map-embed__placeholder');
    if (placeholder) placeholder.remove();
    el.appendChild(frame);
  }

  function observe(el) {
    if (!('IntersectionObserver' in window)) {
      mount(el);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            mount(el);
            io.disconnect();
          }
        });
      },
      { rootMargin: '200px 0px', threshold: 0.01 },
    );
    io.observe(el);
  }

  function init() {
    document.querySelectorAll('[data-2gis-map]').forEach(observe);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // На случай повторного рендера после подгрузки контента
  window.__init2gisMaps = init;
  void FIRM_URL;
})();
