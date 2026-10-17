const state = {
  content: null,
  savedJson: '',
  section: 'texts',
  dirty: false,
};

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

function withRequestId(message, requestId) {
  return requestId ? `${message} Код: ${requestId}` : message;
}

function networkErrorMessage(requestId) {
  return withRequestId('Соединение прервалось, сервер не ответил. Отправьте фото ещё раз.', requestId);
}

function describeHttpError(status, data, requestId) {
  const id = data?.requestId || requestId;
  if (status === 401) return withRequestId(data?.error || 'Сессия истекла. Войдите в админ-панель снова.', id);
  if (status === 403) return withRequestId(data?.error || 'Запрос отклонён: недопустимый Origin', id);
  if (status === 413) return withRequestId(data?.error || 'Файл слишком большой (макс. 8 МБ)', id);
  if (status === 502 || status === 503 || status === 504 || status === 524 || status === 530) {
    return withRequestId(`Туннель вернул ошибку ${status} и не доставил ответ сервера.`, id);
  }
  return withRequestId(data?.error || `Ошибка сервера ${status}`, id);
}

async function api(path, options = {}) {
  const { headers: optHeaders, requestId, ...rest } = options;
  const headers = { ...(optHeaders || {}) };
  if (requestId) headers['X-Request-Id'] = requestId;
  if (rest.body && !(rest.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  let res;
  try {
    res = await fetch(`/api${path}`, {
      credentials: 'same-origin',
      ...rest,
      headers,
    });
  } catch (e) {
    const raw = String(e?.message || '');
    if (e instanceof TypeError || /NetworkError|Failed to fetch|Load failed|network/i.test(raw)) {
      throw new Error(networkErrorMessage(requestId));
    }
    throw e;
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }
  if (!res.ok) {
    throw new Error(describeHttpError(res.status, data, requestId));
  }
  return data;
}

function setStatus(text, kind = '') {
  const el = $('#status');
  el.textContent = text || '';
  el.className = `status${kind ? ` is-${kind}` : ''}`;
}

function markDirty(v = true) {
  state.dirty = v;
  if (v) setStatus('Есть несохранённые изменения', 'dirty');
}

function priceFields(item) {
  const type = item.priceType || 'request';
  const amount = item.priceAmount ?? '';
  return `
    <div class="price-row">
      <label>Тип цены
        <select data-k="priceType">
          <option value="exact" ${type === 'exact' ? 'selected' : ''}>Точная сумма</option>
          <option value="from" ${type === 'from' ? 'selected' : ''}>Сумма «от»</option>
          <option value="request" ${type === 'request' ? 'selected' : ''}>По запросу</option>
        </select>
      </label>
      <label>Сумма, ₽
        <input data-k="priceAmount" type="number" min="0" step="1" value="${amount ?? ''}" ${type === 'request' ? 'disabled' : ''}>
      </label>
      <label>Как будет на сайте
        <input value="${escapeAttr(item.price || '')}" disabled>
      </label>
    </div>`;
}

function escapeAttr(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;');
}

function escapeTextarea(s) {
  return String(s ?? '').replace(/<\/textarea/gi, '&lt;/textarea');
}

function move(arr, index, dir) {
  const j = index + dir;
  if (j < 0 || j >= arr.length) return;
  const [item] = arr.splice(index, 1);
  arr.splice(j, 0, item);
  arr.forEach((x, i) => {
    x.sortOrder = i;
  });
}

function uploadFormatError(file) {
  if (!file) return 'Файл не выбран';
  const name = String(file.name || '').toLowerCase();
  if (name.endsWith('.svg') || name.endsWith('.svgz')) {
    return 'SVG запрещён. Загрузите JPEG, PNG или WebP.';
  }
  const allowedType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
  const allowedExt = /\.(jpe?g|png|webp)$/.test(name);
  if (file.type && !allowedType && !allowedExt) {
    return 'Этот формат не поддерживается. Загрузите JPEG, PNG или WebP.';
  }
  if (!file.type && name && !allowedExt) {
    return 'Этот формат не поддерживается. Загрузите JPEG, PNG или WebP.';
  }
  return '';
}

function sizeError() {
  return 'Файл слишком большой (макс. 8 МБ). Уменьшите снимок и попробуйте снова.';
}

async function shrinkForUpload(file) {
  if (typeof createImageBitmap !== 'function') return file;
  let bitmap;
  try {
    bitmap = await createImageBitmap(file);
    const maxEdge = 2000;
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.82));
    if (!blob || blob.size >= file.size) return file;
    const base = String(file.name || 'photo').replace(/\.[^.]+$/, '') || 'photo';
    return new File([blob], `${base}.jpg`, { type: 'image/jpeg', lastModified: Date.now() });
  } catch {
    return file;
  } finally {
    bitmap?.close?.();
  }
}

async function uploadPhoto(file, previewEl) {
  const formatProblem = uploadFormatError(file);
  if (formatProblem) throw new Error(formatProblem);
  const prepared = await shrinkForUpload(file);
  if (prepared.size > MAX_UPLOAD_BYTES) throw new Error(sizeError());
  const fd = new FormData();
  fd.append('photo', prepared);
  const requestId = crypto.randomUUID();
  setStatus('Загрузка фото…');
  const data = await api('/upload', {
    method: 'POST',
    body: fd,
    requestId,
    headers: { 'X-Original-Bytes': String(file.size || 0) },
  });
  if (previewEl) previewEl.src = data.file.src;
  setStatus('Фото загружено', 'ok');
  return data.file;
}

function bindPriceType(root, item) {
  const typeEl = $('[data-k="priceType"]', root);
  const amountEl = $('[data-k="priceAmount"]', root);
  const sync = () => {
    item.priceType = typeEl.value;
    amountEl.disabled = typeEl.value === 'request';
    if (typeEl.value === 'request') {
      item.priceAmount = null;
      item.price = 'по запросу';
    } else {
      const n = Number(amountEl.value);
      item.priceAmount = Number.isFinite(n) ? n : 0;
      const formatted = new Intl.NumberFormat('ru-RU').format(item.priceAmount) + ' ₽';
      item.price = typeEl.value === 'from' ? `от ${formatted}` : formatted;
    }
    const preview = root.querySelectorAll('input[disabled]')[0];
    if (preview) preview.value = item.price;
    markDirty();
  };
  typeEl.addEventListener('change', sync);
  amountEl.addEventListener('input', sync);
}

function render() {
  const c = state.content;
  c.messengers = {
    whatsapp: c.messengers?.whatsapp || '',
    telegram: c.messengers?.telegram || '',
    max: c.messengers?.max || '',
  };
  const panels = $('#panels');
  panels.innerHTML = `
    <section class="panel ${state.section === 'texts' ? 'is-active' : ''}" data-panel="texts">
      <div class="card">
        <h2>Основные тексты</h2>
        <div class="grid-2">
          <label>Название компании<input data-path="name" value="${escapeAttr(c.name)}"></label>
          <label>Короткое название<input data-path="shortName" value="${escapeAttr(c.shortName)}"></label>
        </div>
        <label>Слоган<input data-path="tagline" value="${escapeAttr(c.tagline)}"></label>
        <label>Заголовок на главной<input data-path="heroTitle" value="${escapeAttr(c.heroTitle || '')}"></label>
        <label>Подзаголовок на главной<textarea data-path="heroSub">${escapeTextarea(c.heroSub || '')}</textarea></label>
        <label>Примечание к ценам<textarea data-path="priceNote">${escapeTextarea(c.priceNote || '')}</textarea></label>
        <label>Пояснение под ценами<textarea data-path="priceDisclaimer">${escapeTextarea(c.priceDisclaimer || '')}</textarea></label>
      </div>
      <div class="card">
        <h2>Преимущества</h2>
        <div id="trust-list"></div>
      </div>
    </section>

    <section class="panel ${state.section === 'contacts' ? 'is-active' : ''}" data-panel="contacts">
      <div class="card">
        <h2>Контакты и режим работы</h2>
        <div class="grid-2">
          <label>Телефон<input data-path="phone" value="${escapeAttr(c.phone)}"></label>
          <label>Ссылка tel:<input data-path="phoneHref" value="${escapeAttr(c.phoneHref)}"></label>
        </div>
        <label>Адрес<input data-path="address" value="${escapeAttr(c.address)}"></label>
        <label>Email<input data-path="email" value="${escapeAttr(c.email)}"></label>
        <label>Пн–Пт<input data-path="schedule.weekdays" value="${escapeAttr(c.schedule.weekdays)}"></label>
        <label>Сб / Вс<input data-path="schedule.weekend" value="${escapeAttr(c.schedule.weekend)}"></label>
        <label>Краткий график (футер)<input data-path="schedule.short" value="${escapeAttr(c.schedule.short)}"></label>
        <p class="hint">Текущий график по умолчанию: Пн–Пт 09:00–17:00, Сб 09:00–13:00, Вс выходной.</p>
      </div>
      <div class="card">
        <h2>Способы связи и карты</h2>
        <label>WhatsApp (ссылка)<input data-path="messengers.whatsapp" value="${escapeAttr(c.messengers.whatsapp)}"></label>
        <label>Telegram (ссылка)<input data-path="messengers.telegram" value="${escapeAttr(c.messengers.telegram)}"></label>
        <label>Ссылка на MAX<input data-path="messengers.max" type="url" inputmode="url" placeholder="https://" value="${escapeAttr(c.messengers.max)}"></label>
        <p class="hint">На сайте кнопка MAX появится только после сохранения рабочей HTTPS-ссылки. Адрес профиля сюда нужно вставить вручную.</p>
        <div class="max-preview">
          <span class="max-preview__icon" aria-hidden="true"><svg viewBox="0 0 100 100" fill="currentColor"><path fill-rule="evenodd" d="M50.76 0c27.53 0 49.12 22.34 49.12 49.89S77.61 99.23 51.02 99.23c-9.43 0-14.01-1.33-21.37-6.54-.5-.36-1.2-.26-1.63.19-5.66 6.04-20.17 10.28-20.83 2.03C7.19 80.53 0 71.18 0 49.61 0 21.3 23.22 0 50.76 0m.77 24.55c-13.07-.68-23.26 8.39-25.51 22.58-1.86 11.75 1.44 26.07 4.26 26.8 1.2.3 4.08-1.9 6.18-3.88.4-.37.99-.44 1.45-.15 3.27 2 6.97 3.5 11.05 3.71 13.42.7 25.3-9.8 26-23.21.71-13.42-10.01-25.14-23.43-25.85"/></svg></span>
          <span>Предпросмотр иконки. Подпись кнопки на сайте: «Написать в MAX».</span>
        </div>
        <label>2GIS<input data-path="maps.twogis" value="${escapeAttr(c.maps.twogis)}"></label>
        <label>Ссылка на Яндекс Карты<input data-path="maps.yandex" type="url" inputmode="url" placeholder="https://yandex.ru/maps/..." value="${escapeAttr(c.maps.yandex)}"></label>
        <label>Маршрут<input data-path="maps.route" value="${escapeAttr(c.maps.route)}"></label>
      </div>
    </section>

    <section class="panel ${state.section === 'services' ? 'is-active' : ''}" data-panel="services">
      <div class="card">
        <div class="item-head">
          <h2>Услуги</h2>
          <button class="btn btn--primary" type="button" id="add-service">Добавить услугу</button>
        </div>
        <div id="services-list"></div>
      </div>
      <div class="card">
        <div class="item-head">
          <h2>Блок цен</h2>
          <button class="btn btn--primary" type="button" id="add-price">Добавить позицию</button>
        </div>
        <div id="prices-list"></div>
      </div>
    </section>

    <section class="panel ${state.section === 'parts' ? 'is-active' : ''}" data-panel="parts">
      <div class="card">
        <div class="item-head">
          <h2>Запчасти</h2>
          <button class="btn btn--primary" type="button" id="add-part">Добавить запчасть</button>
        </div>
        <label>Подсказка про VIN<textarea data-path="partsVinNote">${escapeTextarea(c.partsVinNote || '')}</textarea></label>
        <label>Фильтры марок (через запятую)<input id="parts-filters" value="${escapeAttr((c.partsFilters || []).join(', '))}"></label>
        <div id="parts-list"></div>
      </div>
    </section>

    <section class="panel ${state.section === 'cases' ? 'is-active' : ''}" data-panel="cases">
      <div class="card">
        <div class="item-head">
          <h2>Примеры</h2>
          <button class="btn btn--primary" type="button" id="add-case">Добавить пример</button>
        </div>
        <p class="hint">Раздел на сайте называется «Примеры».</p>
        <div id="cases-list"></div>
      </div>
    </section>

    <section class="panel ${state.section === 'gallery' ? 'is-active' : ''}" data-panel="gallery">
      <div class="card">
        <div class="item-head">
          <h2>Галерея</h2>
          <button class="btn btn--primary" type="button" id="add-gallery">Добавить фото</button>
        </div>
        <div id="gallery-list"></div>
      </div>
    </section>
  `;

  bindPaths(panels);
  renderTrust();
  renderServices();
  renderPrices();
  renderParts();
  renderCases();
  renderGallery();

  $('#add-service')?.addEventListener('click', () => {
    c.services.push({
      slug: uid('service'),
      title: 'Новая услуга',
      short: '',
      href: 'services.html',
      featured: false,
      priceType: 'request',
      priceAmount: null,
      price: 'по запросу',
      sortOrder: c.services.length,
    });
    markDirty();
    renderServices();
  });
  $('#add-price')?.addEventListener('click', () => {
    c.prices.push({
      title: 'Новая позиция',
      priceType: 'from',
      priceAmount: 0,
      price: 'от 0 ₽',
      sortOrder: c.prices.length,
    });
    markDirty();
    renderPrices();
  });
  $('#add-part')?.addEventListener('click', () => {
    c.parts.push({
      id: uid('part'),
      title: 'Новая запчасть',
      description: '',
      image: '',
      fits: [],
      brands: [],
      priceType: 'request',
      priceAmount: null,
      price: 'по запросу',
      sortOrder: c.parts.length,
    });
    markDirty();
    renderParts();
  });
  $('#add-case')?.addEventListener('click', () => {
    c.cases.push({
      id: uid('case'),
      car: '',
      problem: '',
      diagnostics: '',
      work: '',
      result: '',
      image: '',
      sortOrder: c.cases.length,
    });
    markDirty();
    renderCases();
  });
  $('#add-gallery')?.addEventListener('click', () => {
    c.gallery.push({ id: uid('gallery'), src: '', alt: '', sortOrder: c.gallery.length });
    markDirty();
    renderGallery();
  });
  $('#parts-filters')?.addEventListener('input', (e) => {
    c.partsFilters = e.target.value
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    markDirty();
  });
}

function setByPath(obj, path, value) {
  const parts = path.split('.');
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) cur = cur[parts[i]];
  cur[parts[parts.length - 1]] = value;
}

function bindPaths(root) {
  $$('[data-path]', root).forEach((el) => {
    el.addEventListener('input', () => {
      setByPath(state.content, el.getAttribute('data-path'), el.value);
      markDirty();
    });
  });
}

function renderTrust() {
  const box = $('#trust-list');
  if (!box) return;
  box.innerHTML = state.content.trustPoints
    .map(
      (t, i) => `<div class="item" data-i="${i}">
      <label>Заголовок<input data-f="title" value="${escapeAttr(t.title)}"></label>
      <label>Текст<textarea data-f="text">${escapeTextarea(t.text)}</textarea></label>
    </div>`,
    )
    .join('');
  $$('.item', box).forEach((row) => {
    const i = Number(row.dataset.i);
    $$('[data-f]', row).forEach((el) => {
      el.addEventListener('input', () => {
        state.content.trustPoints[i][el.getAttribute('data-f')] = el.value;
        markDirty();
      });
    });
  });
}

function listControls(onUp, onDown, onDel) {
  return `<div class="row-actions">
    <button type="button" class="btn btn--ghost" data-up>↑</button>
    <button type="button" class="btn btn--ghost" data-down>↓</button>
    <button type="button" class="btn btn--danger" data-del>Удалить</button>
  </div>`;
}

function wireListButtons(row, arr, index, rerender) {
  $('[data-up]', row)?.addEventListener('click', () => {
    move(arr, index, -1);
    markDirty();
    rerender();
  });
  $('[data-down]', row)?.addEventListener('click', () => {
    move(arr, index, 1);
    markDirty();
    rerender();
  });
  $('[data-del]', row)?.addEventListener('click', () => {
    if (!confirm('Удалить этот элемент?')) return;
    arr.splice(index, 1);
    arr.forEach((x, i) => {
      x.sortOrder = i;
    });
    markDirty();
    rerender();
  });
}

function renderServices() {
  const box = $('#services-list');
  if (!box) return;
  const arr = state.content.services;
  box.innerHTML = arr
    .map(
      (s, i) => `<div class="item" data-i="${i}">
      <div class="item-head"><strong>Услуга ${i + 1}</strong>${listControls()}</div>
      <label>Название<input data-f="title" value="${escapeAttr(s.title)}"></label>
      <label>Описание<textarea data-f="short">${escapeTextarea(s.short)}</textarea></label>
      <label>Ссылка на страницу<input data-f="href" value="${escapeAttr(s.href)}"></label>
      <label class="check"><input type="checkbox" data-f="featured" ${s.featured ? 'checked' : ''}> Основная услуга</label>
      ${priceFields(s)}
    </div>`,
    )
    .join('');
  $$('.item', box).forEach((row) => {
    const i = Number(row.dataset.i);
    const item = arr[i];
    wireListButtons(row, arr, i, renderServices);
    $$('[data-f]', row).forEach((el) => {
      el.addEventListener('change', () => {
        const key = el.getAttribute('data-f');
        item[key] = el.type === 'checkbox' ? el.checked : el.value;
        markDirty();
      });
      if (el.type !== 'checkbox') {
        el.addEventListener('input', () => {
          item[el.getAttribute('data-f')] = el.value;
          markDirty();
        });
      }
    });
    bindPriceType(row, item);
  });
}

function renderPrices() {
  const box = $('#prices-list');
  if (!box) return;
  const arr = state.content.prices;
  box.innerHTML = arr
    .map(
      (p, i) => `<div class="item" data-i="${i}">
      <div class="item-head"><strong>Цена ${i + 1}</strong>${listControls()}</div>
      <label>Название<input data-f="title" value="${escapeAttr(p.title)}"></label>
      ${priceFields(p)}
    </div>`,
    )
    .join('');
  $$('.item', box).forEach((row) => {
    const i = Number(row.dataset.i);
    const item = arr[i];
    wireListButtons(row, arr, i, renderPrices);
    const title = $('[data-f="title"]', row);
    title?.addEventListener('input', () => {
      item.title = title.value;
      markDirty();
    });
    bindPriceType(row, item);
  });
}

function renderParts() {
  const box = $('#parts-list');
  if (!box) return;
  const arr = state.content.parts;
  box.innerHTML = arr
    .map(
      (p, i) => `<div class="item" data-i="${i}">
      <div class="item-head"><strong>Запчасть ${i + 1}</strong>${listControls()}</div>
      <label>Название<input data-f="title" value="${escapeAttr(p.title)}"></label>
      <label>Описание<textarea data-f="description">${escapeTextarea(p.description)}</textarea></label>
      <label>Применимость (через запятую)<input data-f="fits" value="${escapeAttr((p.fits || []).join(', '))}"></label>
      <label>Марки фильтра (через запятую)<input data-f="brands" value="${escapeAttr((p.brands || []).join(', '))}"></label>
      ${priceFields(p)}
      <div>
        <img class="preview" src="${escapeAttr(p.image || '')}" alt="" ${p.image ? '' : 'hidden'}>
        <label>Фото<input type="file" accept="image/jpeg,image/png,image/webp" data-upload></label>
      </div>
    </div>`,
    )
    .join('');
  $$('.item', box).forEach((row) => {
    const i = Number(row.dataset.i);
    const item = arr[i];
    wireListButtons(row, arr, i, renderParts);
    $$('[data-f]', row).forEach((el) => {
      el.addEventListener('input', () => {
        const key = el.getAttribute('data-f');
        if (key === 'fits' || key === 'brands') {
          item[key] = el.value
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean);
        } else item[key] = el.value;
        markDirty();
      });
    });
    bindPriceType(row, item);
    const file = $('[data-upload]', row);
    const preview = $('.preview', row);
    file?.addEventListener('change', async () => {
      const f = file.files?.[0];
      if (!f) return;
      file.disabled = true;
      try {
        preview.hidden = false;
        const uploaded = await uploadPhoto(f, preview);
        item.image = uploaded.src;
        markDirty();
      } catch (e) {
        if (!item.image) preview.hidden = true;
        setStatus(e.message, 'error');
      } finally {
        file.disabled = false;
        file.value = '';
      }
    });
  });
}

function renderCases() {
  const box = $('#cases-list');
  if (!box) return;
  const arr = state.content.cases;
  box.innerHTML = arr.length
    ? arr
        .map(
          (c, i) => `<div class="item" data-i="${i}">
      <div class="item-head"><strong>Пример ${i + 1}</strong>${listControls()}</div>
      <label>Автомобиль<input data-f="car" value="${escapeAttr(c.car)}"></label>
      <label>Проблема<textarea data-f="problem">${escapeTextarea(c.problem)}</textarea></label>
      <label>Диагностика<textarea data-f="diagnostics">${escapeTextarea(c.diagnostics)}</textarea></label>
      <label>Что сделали<textarea data-f="work">${escapeTextarea(c.work)}</textarea></label>
      <label>Результат<textarea data-f="result">${escapeTextarea(c.result)}</textarea></label>
      <div>
        <img class="preview" src="${escapeAttr(c.image || '')}" alt="" ${c.image ? '' : 'hidden'}>
        <label>Фото<input type="file" accept="image/jpeg,image/png,image/webp" data-upload></label>
      </div>
    </div>`,
        )
        .join('')
    : '<p class="hint">Пока нет примеров. Добавьте первый.</p>';
  $$('.item', box).forEach((row) => {
    const i = Number(row.dataset.i);
    const item = arr[i];
    wireListButtons(row, arr, i, renderCases);
    $$('[data-f]', row).forEach((el) => {
      el.addEventListener('input', () => {
        item[el.getAttribute('data-f')] = el.value;
        markDirty();
      });
    });
    const file = $('[data-upload]', row);
    const preview = $('.preview', row);
    file?.addEventListener('change', async () => {
      const f = file.files?.[0];
      if (!f) return;
      file.disabled = true;
      try {
        preview.hidden = false;
        const uploaded = await uploadPhoto(f, preview);
        item.image = uploaded.src;
        markDirty();
      } catch (e) {
        if (!item.image) preview.hidden = true;
        setStatus(e.message, 'error');
      } finally {
        file.disabled = false;
        file.value = '';
      }
    });
  });
}

function renderGallery() {
  const box = $('#gallery-list');
  if (!box) return;
  const arr = state.content.gallery;
  box.innerHTML = arr
    .map(
      (g, i) => `<div class="item" data-i="${i}">
      <div class="item-head"><strong>Фото ${i + 1}</strong>${listControls()}</div>
      <img class="preview" src="${escapeAttr(g.src || '')}" alt="" ${g.src ? '' : 'hidden'}>
      <label>Подпись<input data-f="alt" value="${escapeAttr(g.alt)}"></label>
      <label>Загрузить JPEG / PNG / WebP<input type="file" accept="image/jpeg,image/png,image/webp" data-upload></label>
    </div>`,
    )
    .join('');
  $$('.item', box).forEach((row) => {
    const i = Number(row.dataset.i);
    const item = arr[i];
    wireListButtons(row, arr, i, renderGallery);
    $('[data-f="alt"]', row)?.addEventListener('input', (e) => {
      item.alt = e.target.value;
      markDirty();
    });
    const file = $('[data-upload]', row);
    const preview = $('.preview', row);
    file?.addEventListener('change', async () => {
      const f = file.files?.[0];
      if (!f) return;
      file.disabled = true;
      try {
        preview.hidden = false;
        const uploaded = await uploadPhoto(f, preview);
        item.src = uploaded.src;
        markDirty();
      } catch (e) {
        if (!item.src) preview.hidden = true;
        setStatus(e.message, 'error');
      } finally {
        file.disabled = false;
        file.value = '';
      }
    });
  });
}

async function loadContent() {
  const data = await api('/content');
  state.content = data.content;
  state.savedJson = JSON.stringify(data.content);
  state.dirty = false;
  render();
  setStatus(data.updatedAt ? `Загружено. Обновлено: ${new Date(data.updatedAt).toLocaleString('ru-RU')}` : 'Загружено');
}

async function save() {
  try {
    setStatus('Сохранение…');
    $('#save-btn').disabled = true;
    const data = await api('/content', {
      method: 'PUT',
      body: JSON.stringify({ content: state.content }),
    });
    state.content = data.content;
    state.savedJson = JSON.stringify(data.content);
    state.dirty = false;
    render();
    setStatus('Сохранено. Обновите страницу сайта, чтобы увидеть изменения.', 'ok');
  } catch (e) {
    setStatus(e.message, 'error');
  } finally {
    const saveBtn = $('#save-btn');
    if (saveBtn) saveBtn.disabled = false;
  }
}

async function cancel() {
  if (state.dirty && !confirm('Отменить несохранённые изменения?')) return;
  await loadContent();
}

async function showAdmin(username) {
  const loginView = $('#login-view');
  const adminView = $('#admin-view');
  if (loginView) loginView.hidden = true;
  if (adminView) adminView.hidden = false;
  const label = $('#user-label');
  if (label) label.textContent = username ? `· ${username}` : '';
  setLoginStatus('');
  setLoginError('');
  await loadContent();
}

function setLoginError(msg = '') {
  const err = $('#login-error');
  if (!err) return;
  if (msg) {
    err.hidden = false;
    err.textContent = msg;
  } else {
    err.hidden = true;
    err.textContent = '';
  }
}

function setLoginStatus(msg = '') {
  const el = $('#login-status');
  if (!el) return;
  if (msg) {
    el.hidden = false;
    el.textContent = msg;
  } else {
    el.hidden = true;
    el.textContent = '';
  }
}

function showLogin(msg = '') {
  const adminView = $('#admin-view');
  const loginView = $('#login-view');
  if (adminView) adminView.hidden = true;
  if (loginView) loginView.hidden = false;
  setLoginStatus('');
  setLoginError(msg);
}

function wireChrome() {
  $$('#nav [data-section]').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.section = btn.getAttribute('data-section');
      $$('#nav [data-section]').forEach((b) => b.classList.toggle('is-active', b === btn));
      $$('[data-panel]').forEach((p) => p.classList.toggle('is-active', p.getAttribute('data-panel') === state.section));
      $('#nav').classList.remove('is-open');
    });
  });
  $('#menu-toggle')?.addEventListener('click', () => $('#nav').classList.toggle('is-open'));
  $('#save-btn').addEventListener('click', save);
  $('#cancel-btn').addEventListener('click', cancel);
  $('#logout-btn').addEventListener('click', async () => {
    await api('/auth/logout', { method: 'POST' });
    state.content = null;
    showLogin();
  });
  let loginInFlight = false;
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    if (loginInFlight) return;
    loginInFlight = true;
    const form = e.target;
    const submitBtn = $('#login-submit') || form.querySelector('[type="submit"]');
    const prevLabel = submitBtn ? submitBtn.textContent : 'Войти';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Входим…';
    }
    setLoginError('');
    setLoginStatus('Входим…');
    const fd = new FormData(form);
    try {
      const data = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          username: fd.get('username'),
          password: fd.get('password'),
        }),
      });
      setLoginStatus('Вход выполнен, загружаем данные…');
      await showAdmin(data.username);
    } catch (err) {
      const message = err?.message || 'Не удалось войти. Проверьте логин и пароль.';
      showLogin(message);
    } finally {
      loginInFlight = false;
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = prevLabel || 'Войти';
      }
    }
  });
  window.addEventListener('beforeunload', (e) => {
    if (!state.dirty) return;
    e.preventDefault();
    e.returnValue = '';
  });
}

async function boot() {
  wireChrome();
  try {
    const status = await api('/auth/status');
    if (!status.adminExists) {
      showLogin('Администратор ещё не создан. На сервере выполните: npm run create-admin');
      return;
    }
    if (status.authenticated) await showAdmin(status.username);
    else showLogin();
  } catch {
    showLogin('Не удалось связаться с сервером. Запустите backend.');
  }
}

boot();
