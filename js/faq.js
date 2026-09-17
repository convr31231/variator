(function () {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const item = btn.closest('.faq-item');
    const panel = item.querySelector('.faq-a');
    const open = item.classList.contains('is-open');
    item.classList.toggle('is-open', !open);
    btn.setAttribute('aria-expanded', String(!open));
    if (panel) panel.style.maxHeight = open ? '0px' : `${panel.scrollHeight}px`;
  });
})();
