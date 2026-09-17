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
  document.addEventListener('click', (e) => {
    const openBtn = e.target.closest('[data-open-modal]');
    if (openBtn) {
      e.preventDefault();
      openModal(openBtn.getAttribute('data-open-modal'));
    }
    if (e.target.closest('[data-close-modal]')) closeModal(e.target.closest('.overlay'));
    if (e.target.classList.contains('overlay')) closeModal(e.target);
  });
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closeModal());
  window.openModal = openModal;
  window.closeModal = closeModal;
})();
