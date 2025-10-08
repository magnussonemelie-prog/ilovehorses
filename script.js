// =====================
// Små hjälpfunktioner
// =====================
const qs = (sel, el = document) => el.querySelector(sel);
const qsa = (sel, el = document) => [...el.querySelectorAll(sel)];

/** Uppdatera år i footer */
(function setYear() {
  const el = qs('#year');
  if (el) el.textContent = new Date().getFullYear();
})();

/** Back-to-top */
(function backToTop() {
  const link = qs('[data-back-to-top]');
  if (!link) return;
  link.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/** Mobilnavigering */
(function mobileNav() {
  const btn = qs('.nav-toggle');
  const nav = qs('#site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    nav.setAttribute('aria-expanded', String(!expanded));
  });
})();

/** Mörkt/ljust tema med localStorage + OS-läge */
(function themeToggle() {
  const KEY = 'theme-preference';
  const root = document.documentElement;
  const btn = qs('#theme-toggle');

  function current() {
    return localStorage.getItem(KEY) || 'auto';
  }
  function apply(mode) {
    const m = mode || current();
    root.setAttribute('data-theme', m);
    if (m === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }
  function systemPref() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  // Init
  apply(current());

  // Knapp
  if (btn) {
    btn.addEventListener('click', () => {
      const next = { auto: 'light', light: 'dark', dark: 'auto' }[current()];
      localStorage.setItem(KEY, next);
      apply(next);
      btn.title = `Tema: ${next}`;
    });
    btn.title = `Tema: ${current()}`;
  }

  // Reagera om OS-läget ändras och vi står i auto
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (current() === 'auto') apply('auto');
  });

  // När data-theme="auto", sätt enligt systemPref vid load
  if (current() === 'auto') {
    if (systemPref() === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }
})();

/** Scroll reveal animations */
(function revealOnScroll() {
  const els = qsa('.reveal');
  if (!('IntersectionObserver' in window) || !els.length) {
    els.forEach(el => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.2 });
  els.forEach(el => io.observe(el));
})();

/** Kontaktformulär – enkel validering */
(function contactForm() {
  const form = qs('#contact-form');
  const status = qs('#form-status');
  if (!form || !status) return;

  function show(msg, type = 'info') {
    status.hidden = false;
    status.textContent = msg;
    status.className = `form-status ${type}`;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    // Grundvalidering
    const errors = [];
    if (!data.name?.trim()) errors.push('Ange ditt namn.');
    if (!data.email?.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errors.push('Ange en giltig e-postadress.');
    if (!data.message?.trim()) errors.push('Skriv ett meddelande.');
    if (!form.elements.consent.checked) errors.push('Du måste godkänna behandlingen av uppgifter.');

    if (errors.length) {
      show(errors.join(' '), 'error');
      return;
    }

    // Här kan du ersätta med ett riktigt API-anrop
    await new Promise(r => setTimeout(r, 500));
    show('Tack! Ditt meddelande har skickats (simulerat).', 'success');
    form.reset();
  });
})();
