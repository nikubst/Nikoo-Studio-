// Backup of script.js on 2025-09-26 11:20
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

// Lightbox for gallery
(function(){
  const lb = document.getElementById('lightbox');
  const img = document.getElementById('lightboxImg');
  const cap = document.getElementById('lightboxCaption');
  const closeBtn = document.querySelector('.lightbox-close');
  const cards = document.querySelectorAll('.gallery-grid .card');
  function open(src, title){
    img.src = src;
    cap.textContent = title || '';
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
  }
  function close(){
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    img.src = '';
    cap.textContent = '';
  }
  cards.forEach(c => c.addEventListener('click', (e) => {
    e.preventDefault();
    const href = c.getAttribute('href');
    const title = c.getAttribute('data-title') || '';
    open(href, title);
  }));
  closeBtn?.addEventListener('click', close);
  lb?.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb.classList.contains('open')) close(); });
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
