/**
 * Подгружает опубликованные данные с backend.
 * При недоступности API оставляет исходный window.BUSINESS из data.js.
 */
(function () {
  const fallback = window.BUSINESS ? structuredClone(window.BUSINESS) : null;

  function brandKey(item) {
    return String(item?.slug || item?.name || '').trim().toLowerCase();
  }

  function mergeBrands(baseList, remoteList) {
    const base = Array.isArray(baseList) ? baseList : [];
    const remote = Array.isArray(remoteList) ? remoteList : [];
    const merged = new Map();
    const order = [];
    for (const item of base) {
      const key = brandKey(item);
      if (!key) continue;
      if (!merged.has(key)) order.push(key);
      const prev = merged.get(key) || {};
      const next = { ...item };
      if (!next.href) delete next.href;
      merged.set(key, { ...prev, ...next });
    }
    for (const item of remote) {
      const key = brandKey(item);
      if (!key) continue;
      if (!merged.has(key)) order.push(key);
      const prev = merged.get(key) || {};
      const overlay = { ...item };
      if (!overlay.href) delete overlay.href;
      merged.set(key, { ...prev, ...overlay });
    }
    return order.map((key) => merged.get(key));
  }

  function mergeContent(base, remote) {
    if (!base) return remote;
    if (!remote) return base;
    const data = { ...base, ...remote };
    if (base.brands || remote.brands) data.brands = mergeBrands(base.brands, remote.brands);
    return data;
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
