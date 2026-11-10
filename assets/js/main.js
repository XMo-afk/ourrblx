(() => {
  const pages = [...document.querySelectorAll('.page')];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const mobileButtons = [...document.querySelectorAll('.mobile-nav button')];
  const topbar = document.querySelector('.topbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const lightbox = document.getElementById('imageLightbox');
  const lightboxStage = document.getElementById('lightboxStage');
  const lightboxTitle = document.getElementById('lightboxTitle');
  const closeButton = lightbox.querySelector('.lightbox-close');
  let previousFocus = null;

  function showPage(id, updateHash = true) {
    const target = document.getElementById(id);
    if (!target || !target.classList.contains('page')) return;
    closeLightbox();
    pages.forEach(page => {
      page.classList.toggle('active', page === target);
      page.setAttribute('aria-hidden', page === target ? 'false' : 'true');
    });
    navLinks.forEach(link => link.classList.toggle('active', link.dataset.page === id));
    mobileButtons.forEach(button => button.classList.toggle('mobile-active', button.dataset.go === id));
    if (updateHash && location.hash !== `#${id}`) history.pushState({page:id}, '', `#${id}`);
    topbar.classList.remove('menu-open');
    menuToggle.setAttribute('aria-expanded', 'false');
    window.scrollTo({top:0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
    document.title = `${target.dataset.title || 'Our world'} — Pie × Ryf`;
  }

  function openLightbox(source) {
    if (!source) return;
    const clone = source.cloneNode(true);
    clone.removeAttribute('tabindex');
    clone.removeAttribute('role');
    clone.removeAttribute('aria-label');
    lightboxStage.replaceChildren(clone);
    const card = source.closest('.memory,.map-card,.style-card');
    const title = card?.querySelector('.memory-caption b,.map-info h2,.style-label b')?.textContent?.trim()
      || source.querySelector('.style-word,.map-tag,.memory-art i')?.textContent?.replace(/\s+/g,' ').trim()
      || 'Our little favorite';
    lightboxTitle.textContent = title;
    previousFocus = document.activeElement;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
    closeButton.focus();
  }

  function closeLightbox() {
    if (!lightbox.classList.contains('open')) return;
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
    lightboxStage.replaceChildren();
    if (previousFocus?.focus) previousFocus.focus();
  }

  document.querySelectorAll('.memory-art,.map-visual,.style-art').forEach(item => {
    item.setAttribute('tabindex','0');
    item.setAttribute('role','button');
    item.setAttribute('aria-label','Enlarge image');
    item.addEventListener('click', () => openLightbox(item));
    item.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(item);
      }
    });
  });
  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', event => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeLightbox();
  });

  document.querySelectorAll('[data-go]').forEach(button => {
    button.addEventListener('click', () => showPage(button.dataset.go));
  });
  navLinks.forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); showPage(link.dataset.page);
  }));
  document.querySelectorAll('a[href="#home"]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault(); showPage('home');
  }));
  menuToggle.addEventListener('click', () => {
    const opened = topbar.classList.toggle('menu-open');
    menuToggle.setAttribute('aria-expanded', String(opened));
  });
  window.addEventListener('popstate', () => showPage(location.hash.slice(1) || 'home', false));
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (id && document.getElementById(id)?.classList.contains('page')) showPage(id, false);
  });

  const initial = location.hash.slice(1);
  showPage(document.getElementById(initial)?.classList.contains('page') ? initial : 'home', false);
})();