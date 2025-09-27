// Theme toggle
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  function updateAria(){
    const mode = root.getAttribute('data-theme') || 'dark';
    btn.setAttribute('aria-pressed', String(mode !== 'dark'));
  }
  btn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') || 'dark';
    const next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateAria();
  });
  updateAria();
})();

// Year in footer
(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = String(new Date().getFullYear());
})();

// Lightbox for gallery (supports both grid and masonry)
(function(){
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  const closeBtn = document.querySelector('.lightbox-close');
  function open(src, title){
    if (!lb || !img) return;
    img.src = src;
    if (cap) cap.textContent = title || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  }
  function close(){
    if (!lb || !img) return;
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    img.src = '';
    if (cap) cap.textContent = '';
  }
  function bindCards(){
    const cards = document.querySelectorAll('.gallery-grid .card, .masonry .card');
    cards.forEach(c => {
      // Avoid double-binding
      if (c.dataset.lbBound === '1') return;
      c.addEventListener('click', (e) => {
        e.preventDefault();
        const href = c.getAttribute('href');
        const title = c.getAttribute('data-title') || '';
        if (href) open(href, title);
      });
      c.dataset.lbBound = '1';
    });
  }
  bindCards();
  closeBtn?.addEventListener('click', close);
  lb?.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb?.classList.contains('open')) close(); });
})();

// Filters for Masonry
(function(){
  const bar = document.getElementById('filters');
  const container = document.querySelector('.masonry');
  if (!bar || !container) return;
  const items = Array.from(container.querySelectorAll('.card'));
  function applyFilter(key){
    items.forEach(el => {
      const cats = (el.getAttribute('data-category') || '').split(/\s+/).filter(Boolean);
      const show = key === 'all' || cats.includes(key);
      el.style.display = show ? 'inline-block' : 'none';
    });
  }
  bar.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-filter]');
    if (!btn) return;
    const key = btn.getAttribute('data-filter');
    // active state
    bar.querySelectorAll('button[data-filter]').forEach(b => {
      b.classList.toggle('active', b === btn);
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
    });
    applyFilter(key);
  });
})();

// Contact form basic client-side validation
(function(){
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const message = data.get('message');
    if (!name || !email || !message) {
      note.textContent = 'Please fill in all required fields.';
      note.style.color = '#f87171';
      return;
    }
    // Demo only
    note.textContent = 'Your message has been submitted. We will get back to you soon.';
    note.style.color = '#10b981';
    form.reset();
  });
})();
