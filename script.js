(() => {
  'use strict';
  document.documentElement.classList.add('enhanced');
  const menu = document.querySelector('.menu-button');
  const nav = document.getElementById('navigation');
  const setMenu = open => {
    nav.dataset.open = String(open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menu.focus();
    }
  });
  const filters = [...document.querySelectorAll('[data-filter]')];
  const cards = [...document.querySelectorAll('[data-category]')];
  const count = document.querySelector('.work-count');
  for (const filter of filters) filter.addEventListener('click', () => {
    const category = filter.dataset.filter;
    filters.forEach(button => {
      const selected = button === filter;
      button.classList.toggle('active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    let visible = 0;
    cards.forEach(card => {
      card.hidden = category !== 'all' && category !== card.dataset.category;
      if (!card.hidden) visible++;
    });
    count.textContent = `SHOWING ${visible} PROJECT${visible === 1 ? '' : 'S'}`;
  });
  let toastTimeout;
  const toast = message => {
    const el = document.querySelector('.toast');
    el.textContent = message;
    el.classList.add('visible');
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => el.classList.remove('visible'), 2600);
  };
  document.querySelector('.copy-email')?.addEventListener('click', async () => {
    try {
      const emailLink = document.querySelector('.contact-links a[href^="mailto:"]');
      await navigator.clipboard.writeText(emailLink.getAttribute('href').slice(7));
      toast('Email address copied');
    } catch {
      toast('Select the email address above to copy it');
    }
  });
  document.querySelector('.print-resume')?.addEventListener('click', () => window.print());
  const progress = document.querySelector('.scroll-progress');
  let frame = 0;
  const update = () => {
    frame = 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  };
  const scheduleUpdate = () => { if (!frame) frame = requestAnimationFrame(update); };
  if (progress) {
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });
    update();
  }
})();
