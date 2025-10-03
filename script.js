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

    // Ensure every card has a visible download icon and it works
    cards.forEach(c => {
      // If a dl-btn already exists (static in HTML), just bind it. Otherwise create one.
      let btn = c.querySelector('.dl-btn');
      if (!btn) {
        btn = document.createElement('span');
        btn.className = 'dl-btn';
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-label', 'Download image');
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v10m0 0l4-4m-4 4l-4-4M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
        c.appendChild(btn);
      }
      if (!btn.dataset.bound) {
        const handler = async (e) => {
          e.stopPropagation();
          e.preventDefault();
          const url = btn.getAttribute('href') || btn.dataset.download || c.getAttribute('href');
          const name = (c.getAttribute('data-title') || 'artwork').replace(/\s+/g,'-').toLowerCase() + '.jpg';
          if (!url) return;
          try {
            const res = await fetch(url, { mode: 'cors' });
            const blob = await res.blob();
            const a = document.createElement('a');
            const objectUrl = URL.createObjectURL(blob);
            a.href = objectUrl;
            a.download = name;
            document.body.appendChild(a);
            a.click();
            URL.revokeObjectURL(objectUrl);
            a.remove();
          } catch (err) {
            window.open(url, '_blank');
          }
        };
        btn.addEventListener('click', handler);
        btn.addEventListener('keydown', (ev) => { if (ev.key === 'Enter' || ev.key === ' ') handler(ev); });
        btn.dataset.bound = '1';
      }
    });

    // Add download button for avatar image (outside gallery)
    const avWrap = document.querySelector('.avatar-wrap');
    const avImg = avWrap?.querySelector('img');
    if (avWrap && avImg && !avWrap.querySelector('.dl-btn')) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'dl-btn';
      btn.setAttribute('aria-label', 'Download avatar');
      btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v10m0 0l4-4m-4 4l-4-4M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      btn.addEventListener('click', async (e) => {
        e.stopPropagation();
        e.preventDefault();
        const url = avImg.getAttribute('src');
        const name = 'avatar.jpg';
        if (!url) return;
        try {
          const res = await fetch(url, { mode: 'cors' });
          const blob = await res.blob();
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(objectUrl);
          a.remove();
        } catch (err) {
          window.open(url, '_blank');
        }
      });
      avWrap.appendChild(btn);
    }
  }
  bindCards();
  // Observe for future changes so all items always have download buttons/lightbox
  const container = document.querySelector('.masonry');
  if (container && 'MutationObserver' in window) {
    const mo = new MutationObserver(() => bindCards());
    mo.observe(container, { childList: true, subtree: true });
  }
  closeBtn?.addEventListener('click', close);
  lb?.addEventListener('click', (e) => { if (e.target === lb) close(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && lb?.classList.contains('open')) close(); });
})();
// Filters for Masonry
(function(){
  const bar = document.getElementById('filters');
  const container = document.querySelector('.masonry');
  if (!bar || !container) return;
  function applyFilter(key){
    const items = container.querySelectorAll('.card');
    items.forEach(el => {
      const cat = el.getAttribute('data-category');
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
      if (note) note.textContent = 'Please fill in all fields.';
      return;
    }
    if (note) {
      note.textContent = 'Your message has been submitted. We will get back to you soon.';
      note.style.color = '#10b981';
    }
    form.reset();
  });
})();

// Global download button for all images site-wide (outside gallery/avatar)
(function(){
  function addDlForImage(img){
    if (!img || img.closest('.masonry .card') || img.closest('.avatar-wrap')) return;
    if (img.closest('.img-wrap')) return;
    const wrap = document.createElement('span');
    wrap.className = 'img-wrap';
    img.parentNode.insertBefore(wrap, img);
    wrap.appendChild(img);
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'dl-btn';
    btn.setAttribute('aria-label', 'Download image');
    btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 3v10m0 0l4-4m-4 4l-4-4M5 21h14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    btn.addEventListener('click', async (e) => {
      e.stopPropagation();
      e.preventDefault();
      const url = img.currentSrc || img.src;
      const base = (img.getAttribute('alt') || 'image').trim() || 'image';
      const name = base.replace(/\s+/g,'-').toLowerCase() + '.jpg';
      try {
        const res = await fetch(url, { mode: 'cors' });
        const blob = await res.blob();
        const a = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        a.href = objectUrl;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        URL.revokeObjectURL(objectUrl);
        a.remove();
      } catch (err) {
        window.open(url, '_blank');
      }
    });
    wrap.appendChild(btn);
  }

  // Initial pass
  document.querySelectorAll('img').forEach(addDlForImage);

  // Observe future images
  if ('MutationObserver' in window) {
    const mo = new MutationObserver((mutations) => {
      mutations.forEach(m => {
        m.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.tagName === 'IMG') addDlForImage(node);
            node.querySelectorAll?.('img').forEach(addDlForImage);
          }
        });
      });
    });
    mo.observe(document.body, { childList: true, subtree: true });
  }
})();
