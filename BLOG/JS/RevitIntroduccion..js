// Documento simple: solo añadimos anclas suaves por si se usan links internos.
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]');
  if(!a) return;
  const id = a.getAttribute('href').slice(1);
  const target = document.getElementById(id);
  if (target){
    e.preventDefault();
    target.scrollIntoView({ behavior:'smooth', block:'start' });
  }
});
