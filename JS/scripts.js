
jQuery('document').ready(function($) {
  var menuBtn = $('.menu-icon'),
      menu = $('.navigation ul');

  menuBtn.click(function(event) {
    event.stopPropagation(); // Agregar esta línea para detener la propagación del evento
    if (menu.hasClass('show')) {
      menu.removeClass('show');
    } else {
      menu.addClass('show');
    }
  });

  menu.click(function(event) {
    event.stopPropagation(); // Agregar esta línea para detener la propagación del evento
  });

  $(document).click(function() {
    if (menu.hasClass('show')) {
      menu.removeClass('show');
    }
  });
});



//INICIAR AUTOMATICAMENTE CON UN CLICK
var enlace = document.getElementById("miEnlace"); // Selecciona el enlace
enlace.click(); // Simula un clic en el enlace



//Cambiar color de elemento seleccionado
function showIframe() {
    var navItems = document.querySelectorAll('.nav-item');
    for (var i = 0; i < navItems.length; i++) {
      navItems[i].classList.remove('active');
    }
    event.currentTarget.parentElement.classList.add('active');
  }

  function loadPage(url) {
    document.getElementById("iframe-enlace").src = url;
  }





