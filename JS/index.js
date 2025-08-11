// ===== Helpers =====
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

// Año en el pie
const y = $("#year");
if (y) y.textContent = new Date().getFullYear();

// ===== Menú responsive =====
const navToggle = $("#navToggle");
const navMenu   = $("#navMenu");
const navPanel  = $("#navPanel");

function openMenu(){
  document.body.classList.add("menu-open");
  navMenu.classList.add("open");
  navPanel.classList.add("open");
  navToggle?.setAttribute("aria-expanded","true");
}
function closeMenu(){
  document.body.classList.remove("menu-open");
  navMenu.classList.remove("open");
  navPanel.classList.remove("open");
  navToggle?.setAttribute("aria-expanded","false");
}

navToggle?.addEventListener("click", () => navMenu.classList.contains("open") ? closeMenu() : openMenu());
navPanel?.addEventListener("click", closeMenu);
navMenu?.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });

// ===== Scroll suave con compensación por header fijo =====
function smoothScrollTo(hash){
  const target = document.getElementById(hash.replace("#",""));
  if (!target) return;
  const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 64;
  const y = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
  window.scrollTo({ top: y, behavior: "smooth" });
}

$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", (e) => {
    const href = a.getAttribute("href");
    if (href.length > 1) {
      e.preventDefault();
      smoothScrollTo(href);
      history.replaceState(null, "", href);
    }
  });
});

// ===== Resalta el enlace de sección activa =====
const sections = ["home","cursos","servicios","contacto"].map(id => document.getElementById(id)).filter(Boolean);
const navLinks = $$("#navMenu .nav-link").filter(a => a.getAttribute("href")?.startsWith("#"));

if (sections.length && navLinks.length){
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle("active", l.getAttribute("href") === `#${id}`));
      }
    });
  }, { rootMargin: `-${(parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h"))||64)+10}px 0px -60% 0px`, threshold: 0.01 });

  sections.forEach(s => obs.observe(s));
}

/* NOTA:
   Eliminamos el bloque que forzaba aspect-ratio/height en las imágenes de cursos.
   Ahora cada póster usa height:auto y se ve COMPLETO, sin bandas negras.
*/
