/**
 * Подгружает опубликованные данные с backend.
 * При недоступности API оставляет исходный window.BUSINESS из data.js.
 */
(function () {
  const fallback = window.BUSINESS ? structuredClone(window.BUSINESS) : null;

  function mergeContent(base, remote) {
    if (!base) return remote;
    if (!remote) return base;
    return { ...base, ...remote };
  }

  async function load() {
    try {
      const res = await fetch('/api/content', {
        credentials: 'same-origin',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) throw new Error('bad status');
      const data = await res.json();
      if (data?.content) {
        window.BUSINESS = mergeContent(fallback, data.content);
        window.__CONTENT_SOURCE = 'api';
        window.__CONTENT_UPDATED_AT = data.updatedAt || null;
        return;
      }
    } catch {
      /* fallback */
    }
    window.BUSINESS = fallback || window.BUSINESS;
    window.__CONTENT_SOURCE = 'fallback';
  }

  window.__contentReady = load();
})();
