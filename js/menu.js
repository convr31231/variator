(function () {
  const burger = document.querySelector('[data-burger]');
  const drawer = document.querySelector('[data-drawer]');
  const header = document.querySelector('[data-header]');
  if (!burger || !drawer) return;

  const close = () => {
    burger.setAttribute('aria-expanded', 'false');
    drawer.classList.remove('is-open');
    document.body.classList.remove('is-locked');
  };
  const open = () => {
    burger.setAttribute('aria-expanded', 'true');
    drawer.classList.add('is-open');
    document.body.classList.add('is-locked');
  };

  burger.addEventListener('click', () =>
    burger.getAttribute('aria-expanded') === 'true' ? close() : open(),
  );
  drawer.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && close());

  if (header) {
    const onScroll = () => header.classList.toggle('is-solid', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }
})();
