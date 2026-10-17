(function () {
  function maskPhone(input) {
    let digits = input.value.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7') && digits.length) digits = '7' + digits;
    digits = digits.slice(0, 11);
    let out = '';
    if (digits.length) out = '+7';
    if (digits.length > 1) out += ' (' + digits.slice(1, 4);
    if (digits.length >= 4) out += ') ' + digits.slice(4, 7);
    if (digits.length >= 7) out += '-' + digits.slice(7, 9);
    if (digits.length >= 9) out += '-' + digits.slice(9, 11);
    input.value = out;
  }

  function normalizeId(value) {
    return String(value || '')
      .trim()
      .toUpperCase()
      .replace(/\s+/g, '');
  }

  function isValidBodyOrVin(value) {
    if (!value) return true;
    const id = normalizeId(value);
    if (id.length < 5 || id.length > 32) return false;
    return /^[A-Z0-9-]+$/.test(id);
  }

  async function appointmentApiAvailable() {
    try {
      const res = await fetch('/api/health', {
        cache: 'no-store',
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return false;
      const data = await res.json();
      return data?.ok === true;
    } catch {
      return false;
    }
  }

  const apiReady = appointmentApiAvailable();

  function messengerLinks(B) {
    const items = [
      ['whatsapp', 'WhatsApp', B.messengers?.whatsapp],
      ['telegram', 'Telegram', B.messengers?.telegram],
      ['max', 'Написать в MAX', B.messengers?.max],
    ].filter(([, , url]) => url);
    return items
      .map(
        ([, label, url]) =>
          `<a class="btn btn--ghost" href="${url.replace(/"/g, '&quot;')}" target="_blank" rel="noopener noreferrer">${label}</a>`,
      )
      .join('');
  }

  async function showStaticContact(form) {
    if (window.__contentReady) await window.__contentReady;
    const B = window.BUSINESS || {};
    const fields = form.querySelector('[data-fields]');
    const ok = form.querySelector('[data-success]');
    if (fields) fields.hidden = true;
    if (ok) ok.hidden = true;
    let box = form.querySelector('[data-static-contact]');
    if (!box) {
      box = document.createElement('div');
      box.setAttribute('data-static-contact', '');
      box.className = 'stack';
      form.appendChild(box);
    }
    const phone = B.phoneHref || 'tel:+79146643290';
    const phoneText = B.phone || '+7 (914) 664-32-90';
    box.innerHTML = `<p>Заявка с этой страницы не отправляется: здесь нет приёма форм. Позвоните или напишите в мессенджер.</p>
      <div class="finale-actions"><a class="btn btn--primary" href="${phone.replace(/"/g, '&quot;')}">Позвонить ${phoneText}</a>${messengerLinks(B)}</div>`;
  }

  async function submitForm(payload) {
    const res = await fetch('/api/appointments', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    let data = null;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    if (!res.ok || !data?.ok) {
      throw new Error(data?.error || 'Не удалось отправить. Позвоните нам.');
    }
    return data;
  }

  function bind(form) {
    const phone = form.querySelector('[name="phone"]');
    phone?.addEventListener('input', () => maskPhone(phone));

    const err = form.querySelector('[data-error]');
    const ok = form.querySelector('[data-success]');
    const fields = form.querySelector('[data-fields]');
    const btn = form.querySelector('[type="submit"]');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!(await apiReady)) {
        await showStaticContact(form);
        return;
      }
      if (err) err.hidden = true;
      const fd = new FormData(form);
      const name = String(fd.get('name') || '').trim();
      const phoneVal = String(fd.get('phone') || '').trim();
      const car = String(fd.get('car') || '').trim();
      const model = String(fd.get('model') || '').trim();
      const vinRaw = String(fd.get('vin') || '').trim();
      const vin = normalizeId(vinRaw);
      const message = String(fd.get('message') || '').trim();
      const consent = form.querySelector('[name="consent"]')?.checked;

      if (!name || !phoneVal) {
        if (err) {
          err.hidden = false;
          err.textContent = 'Укажите имя и телефон';
        }
        return;
      }
      if (phoneVal.replace(/\D/g, '').length < 11) {
        if (err) {
          err.hidden = false;
          err.textContent = 'Проверьте номер телефона';
        }
        return;
      }
      if (vinRaw && !isValidBodyOrVin(vinRaw)) {
        if (err) {
          err.hidden = false;
          err.textContent = 'Проверьте номер кузова или VIN';
        }
        return;
      }
      if (!consent) {
        if (err) {
          err.hidden = false;
          err.textContent = 'Нужно согласие на обработку персональных данных';
        }
        return;
      }

      btn?.classList.add('is-loading');
      if (btn) btn.textContent = 'Отправка…';
      try {
        const res = await submitForm({
          name,
          phone: phoneVal,
          car: car || form.dataset.brand || '',
          model,
          vin: vin || '',
          bodyNumberOrVin: vin || '',
          message,
          brand: form.dataset.brand || car || '',
          source: form.dataset.source || 'сайт',
          page: location.pathname,
        });
        if (!res.ok) throw new Error('fail');
        if (fields) fields.hidden = true;
        if (ok) ok.hidden = false;
        form.reset();
      } catch (error) {
        if (err) {
          err.hidden = false;
          err.textContent = error?.message || 'Не удалось отправить. Позвоните нам.';
        }
      } finally {
        btn?.classList.remove('is-loading');
        if (btn) btn.textContent = form.dataset.submitLabel || 'Записаться на диагностику';
      }
    });

    form.querySelector('[data-reset]')?.addEventListener('click', () => {
      if (fields) fields.hidden = false;
      if (ok) ok.hidden = true;
      if (err) err.hidden = true;
    });
  }

  document.querySelectorAll('[data-form]').forEach(bind);
  window.submitForm = submitForm;
  apiReady.then((ok) => {
    if (ok) return;
    document.querySelectorAll('[data-form]').forEach((form) => showStaticContact(form));
  });
})();
