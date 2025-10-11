// Theme toggle
(function(){
  const root = document.documentElement;
  const btn = document.getElementById('themeToggle');
  const saved = localStorage.getItem('theme');
  if (saved) root.setAttribute('data-theme', saved);
  function updateAria(){
    if (!btn) return;
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
  if (btn) updateAria();
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
      c.dataset.lbBound = '1';
    });

    // Ensure each card has a download button overlay (icon-only)
    cards.forEach(c => {
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
    // Always ensure dataset and aria-label are correct for video cards
    (function ensureBtnDownloadDataset(){
      const vid = c.querySelector('video');
      const img = c.querySelector('img');
      const srcEl = c.querySelector('source');
      let mediaUrl = '';
      if (vid) {
        mediaUrl = vid.currentSrc || (srcEl && srcEl.src) || '';
        btn.setAttribute('aria-label', 'Download video');
      } else if (img) {
        mediaUrl = img.currentSrc || img.src || '';
      }
      if (!btn.dataset.download && mediaUrl) btn.dataset.download = mediaUrl;
    })();
    // Add a visible download link under video cards
    const vEl = c.querySelector('video');
    if (vEl && !c.querySelector('.dl-link')) {
      const srcEl2 = c.querySelector('source');
      const initialUrl = btn?.dataset.download || vEl.currentSrc || srcEl2?.src || '';
      const link = document.createElement('a');
      link.className = 'dl-link';
      link.textContent = 'Download MP4';
      link.href = initialUrl || '#';
      link.setAttribute('download', '');
      link.target = '_blank';
      link.rel = 'noopener';
      c.appendChild(link);
    }

    if (!btn.dataset.bound) {
      const handler = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        // Prefer explicit download dataset, else fall back to anchor href
        let url = btn.getAttribute('href') || btn.dataset.download || c.getAttribute('href');
        // As a last resort, re-detect from media
        if (!url) {
          const vid = c.querySelector('video');
          const img = c.querySelector('img');
          const srcEl = c.querySelector('source');
          url = vid?.currentSrc || srcEl?.src || img?.currentSrc || img?.src || '';
          if (url) btn.dataset.download = url;
        }
        if (!url) return;
        const base = (c.getAttribute('data-title') || 'media').replace(/\s+/g,'-').toLowerCase();
        // Try to infer extension from URL path
        const matchExt = (() => { try { return new URL(url, location.href).pathname.match(/\.([a-z0-9]+)$/i); } catch { return null; }})();
        let ext = (matchExt && matchExt[1]) ? matchExt[1].toLowerCase() : '';
        try {
          const res = await fetch(url, { mode: 'cors' });
          if (!res.ok) throw new Error('fetch failed');
          const blob = await res.blob();
          // Derive extension from blob.type if URL had none or was generic
          if (!ext && blob?.type) {
            if (blob.type.includes('mp4')) ext = 'mp4';
            else if (blob.type.includes('jpeg')) ext = 'jpg';
            else if (blob.type.includes('png')) ext = 'png';
            else if (blob.type.includes('webm')) ext = 'webm';
            else ext = (blob.type.split('/')[1] || 'bin');
          }
          // Default to mp4 for video elements
          if (!ext && c.querySelector('video')) ext = 'mp4';
          const name = `${base}.${ext || 'bin'}`;
          const a = document.createElement('a');
          const objectUrl = URL.createObjectURL(blob);
          a.href = objectUrl;
          a.download = name;
          document.body.appendChild(a);
          a.click();
          URL.revokeObjectURL(objectUrl);
          a.remove();
        } catch (err) {
          // Robust fallback for cross-origin: try direct anchor with download attribute
          const isVideo = !!c.querySelector('video');
          const name = `${base}.${ext || (isVideo ? 'mp4' : 'jpg')}`;
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute('download', name);
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          a.remove();
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
    // Add download button for avatar image (outside gallery)
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
    const showAll = !key || key === 'all';
    items.forEach(el => {
      const cat = el.getAttribute('data-category') || '';
      const match = showAll || cat === key;
      el.style.display = match ? 'inline-block' : 'none';
      el.setAttribute('aria-hidden', match ? 'false' : 'true');
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
  // Initialize with 'all'
  applyFilter('all');
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
    }
    form.reset();
  });
})();

  // Open prompt editor when user clicks "New Prompt"
  (function(){
    const newBtn = document.getElementById('newPromptBtn');
    const editor = document.getElementById('promptEditor');
    const input = document.getElementById('promptInput');
    if (!newBtn || !editor) return;
    function openEditor(){
      editor.classList.remove('hidden');
      if (input) { input.value = ''; input.focus(); }
      editor.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    function closeEditor(){
      editor.classList.add('hidden');
      input?.blur();
    }
    function svgDataUrlFromText(text){
      const w = 800, h = 600;
      const bg = '#f1e6dc';
      const frame = '#faf7f0';
      const fg = '#0e1320';
      const content = `<?xml version='1.0' encoding='UTF-8'?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>\n  <defs>\n    <filter id='grain'>\n      <feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/>\n      <feColorMatrix type='saturate' values='0'/>\n      <feBlend mode='multiply' in2='SourceGraphic'/>\n    </filter>\n  </defs>\n  <rect width='100%' height='100%' fill='${bg}'/>\n  <rect x='24' y='24' width='${w-48}' height='${h-48}' rx='18' fill='${frame}' stroke='rgba(0,0,0,0.08)' stroke-width='2'/>\n  <g filter='url(#grain)'>\n    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='Vazirmatn, system-ui, -apple-system, Segoe UI, Roboto, sans-serif' font-size='28' fill='${fg}' opacity='0.9'>${(text||'New Prompt').replace(/&/g,'&amp;').replace(/</g,'&lt;')}</text>\n  </g>\n</svg>`;
      return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(content);
    }
    function createPromptCard(text){
      const grid = document.querySelector('.masonry');
      if (!grid) return;
      const a = document.createElement('a');
      a.className = 'card';
      a.setAttribute('role', 'listitem');
      a.setAttribute('data-category', 'prompt');
      a.setAttribute('data-title', text || 'New Prompt');
      const imgUrl = svgDataUrlFromText(text || 'New Prompt');
      a.href = imgUrl; // so lightbox opens the generated SVG
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.src = imgUrl;
      img.alt = (text || 'New Prompt');
      a.appendChild(img);
      grid.appendChild(a);
      // rebind lightbox/download for new card if needed
      // Trigger a mutation observer if present
      if (typeof MutationObserver === 'undefined') {
        // Fallback: manually click-bind if our earlier binder exists
        a.addEventListener('click', (e) => { e.preventDefault(); });
      }
      a.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    newBtn.addEventListener('click', () => {
      if (editor.classList.contains('hidden')) { openEditor(); } else { closeEditor(); }
    });
    input?.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        createPromptCard(input.value.trim());
        input.value = '';
        closeEditor();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        closeEditor();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !editor.classList.contains('hidden')) {
        e.preventDefault();
        closeEditor();
      }
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
