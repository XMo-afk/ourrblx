(() => {
  const pages = [...document.querySelectorAll('.page')];
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const mobileButtons = [...document.querySelectorAll('.mobile-nav button')];
  const topbar = document.querySelector('.topbar');
  const menuToggle = document.querySelector('.menu-toggle');

  function showPage(id, updateHash = true) {
    const target = document.getElementById(id);
    if (!target || !target.classList.contains('page')) return;
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