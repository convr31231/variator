(function () {
  function openModal(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.add('is-open');
    document.body.classList.add('is-locked');
    el.querySelector('input,button,textarea')?.focus();
  }
  function closeModal(el) {
    const target = el || document.querySelector('.overlay.is-open');
    if (!target) return;
    target.classList.remove('is-open');
    if (!document.querySelector('.overlay.is-open') && !document.querySelector('.lightbox.is-open')) {
      document.body.classList.remove('is-locked');
    }
  }

  function applyPartContext(btn, modal) {
    if (!btn || !modal) return;
    const title = btn.getAttribute('data-part-title');
    const message = btn.getAttribute('data-part-message');
    const focusVin = btn.hasAttribute('data-focus-vin');
    const heading = modal.querySelector('#book-title');
    const textarea = modal.querySelector('[data-modal-message], textarea[name="message"]');
    const vinInput = modal.querySelector('[data-modal-vin], input[name="vin"]');
    const submit = modal.querySelector('[type="submit"]');
    const form = modal.querySelector('[data-form]');

    if (title && heading) heading.textContent = title;
    else if (heading) heading.textContent = 'Записаться на диагностику';

    if (message && textarea) textarea.value = message;

    if (title && form) {
      form.dataset.source = 'запчасти';
      form.dataset.submitLabel = focusVin ? 'Проверить совместимость' : 'Уточнить наличие';
      if (submit) submit.textContent = form.dataset.submitLabel;
    } else if (form) {
      form.dataset.source = 'модальная запись';
      form.dataset.submitLabel = 'Записаться на диагностику';
      if (submit) submit.textContent = 'Записаться на диагностику';
    }

    if (focusVin && vinInput) {
      setTimeout(() => vinInput.focus(), 30);
    } else if (message && textarea) {
      setTimeout(() => textarea.focus(), 30);
    }
  }

  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-modal]');
    if (openBtn) {
      e.preventDefault();
      const id = openBtn.getAttribute('data-open-modal');
      const modal = document.getElementById(id);
      applyPartContext(openBtn, modal);
      openModal(id);
    }
    if (e.target.closest('[data-close-modal]')) closeModal(e.target.closest('.overlay'));
    if (e.target.classList.contains('overlay')) closeModal(e.target);
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
  window.openModal = openModal;
  window.closeModal = closeModal;
})();
