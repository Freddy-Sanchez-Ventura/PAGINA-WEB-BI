document.addEventListener('DOMContentLoaded', () => {
  // Resaltado dinámico de temas
  document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', function (e) {
          e.preventDefault();

          // Remueve la clase 'active' de todos los elementos
          document.querySelectorAll('.nav-item').forEach(navItem => {
              navItem.classList.remove('active');
          });

          // Agrega la clase 'active' al elemento clicado
          this.classList.add('active');

          // Carga el video correspondiente
          const videoUrl = this.getAttribute('href');
          document.querySelector('iframe[name="cuadro"]').src = videoUrl;
      });
  });

  // Menú responsive
  const menuBtn = document.querySelector('.menu-icon');
  const menu = document.querySelector('.navigation');

  menuBtn.addEventListener('click', () => {
      menu.classList.toggle('show');
  });

  // Cierra el menú al hacer clic fuera
  document.addEventListener('click', (e) => {
      if (!menu.contains(e.target) && !menuBtn.contains(e.target)) {
          menu.classList.remove('show');
      }
  });
});