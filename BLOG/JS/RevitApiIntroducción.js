(function(){
  // Evitar scroll horizontal de forma defensiva
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowX = 'hidden';

  // Smooth scroll para chips y links internos
  const scrollToId = (sel) => {
    const el = document.querySelector(sel);
    if(!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 8;
    window.scrollTo({top, behavior:'smooth'});
  };

  document.querySelectorAll('.chip[data-target]').forEach(ch => {
    ch.addEventListener('click', e => scrollToId(ch.dataset.target));
  });

  // Botones copiar en cada bloque de código
  const enhanceCodeBlocks = () => {
    document.querySelectorAll('pre.code, .code').forEach(block => {
      if(block.querySelector('.btn-copy')) return;
      const btn = document.createElement('button');
      btn.className = 'btn-copy';
      btn.setAttribute('aria-label','Copiar código');
      btn.textContent = 'Copiar';
      btn.addEventListener('click', async () => {
        const code = block.querySelector('code');
        if(!code) return;
        try{
          await navigator.clipboard.writeText(code.innerText);
          btn.textContent = 'Copiado';
          setTimeout(()=> btn.textContent = 'Copiar', 1200);
        }catch{ btn.textContent = 'Error'; }
      });
      block.appendChild(btn);
    });
  };

  // TOC opcional desde h2 (solo si quieres inyectarlo, aquí lo dejamos en consola)
  const headings = Array.from(document.querySelectorAll('h2.h2'))
    .map(h => ({ id: h.id || '(sin id)', text: h.textContent.trim() }));
  console.debug('TOC generado:', headings);

  enhanceCodeBlocks();

  // Si llega con hash, hacer scroll suave
  if(location.hash){
    const target = decodeURIComponent(location.hash);
    setTimeout(()=> scrollToId(target), 60);
  }
})();