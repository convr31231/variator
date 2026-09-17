(function () {
  const box = document.querySelector('[data-lightbox]');
  const img = box?.querySelector('img');
  const closeBtn = box?.querySelector('[data-lightbox-close]');

  function close() {
    box?.classList.remove('is-open');
    if (!document.querySelector('.overlay.is-open')) document.body.classList.remove('is-locked');
  }

  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-gallery-item]');
    if (!trigger || !box || !img) return;
    img.src = trigger.getAttribute('data-src');
    img.alt = trigger.getAttribute('data-alt') || 'Фото';
    box.classList.add('is-open');
    document.body.classList.add('is-locked');
  });

  closeBtn?.addEventListener('click', close);
  box?.addEventListener('click', (e) => e.target === box && close());
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());
})();
