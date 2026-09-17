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

  async function submitForm(payload) {
    console.info('submitForm', payload);
    await new Promise((r) => setTimeout(r, 550));
    return { ok: true };
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
      if (err) err.hidden = true;
      const fd = new FormData(form);
      const name = String(fd.get('name') || '').trim();
      const phoneVal = String(fd.get('phone') || '').trim();
      const car = String(fd.get('car') || '').trim();
      const model = String(fd.get('model') || '').trim();
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
          car,
          model,
          message,
          source: form.dataset.source || 'сайт',
          page: location.pathname,
        });
        if (!res.ok) throw new Error('fail');
        if (fields) fields.hidden = true;
        if (ok) ok.hidden = false;
        form.reset();
      } catch {
        if (err) {
          err.hidden = false;
          err.textContent = 'Не удалось отправить. Позвоните нам.';
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
})();
