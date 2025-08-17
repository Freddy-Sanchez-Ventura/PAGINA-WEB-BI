// Smooth scroll + evitar desplazamiento horizontal accidental
(function () {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReduced) {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href').slice(1);
        const el = document.getElementById(id);
        if (el) {
          e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.pushState(null, "", `#${id}`);
        }
      });
    });
  }

  // Clamp scrollX para garantizar que nunca aparezca scroll horizontal
  const clampScrollX = () => { if (window.scrollX !== 0) window.scrollTo(0, window.scrollY); };
  window.addEventListener('scroll', clampScrollX, { passive: true });
  window.addEventListener('resize', clampScrollX);
})();
