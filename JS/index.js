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
const sections = ["home","cursos","complementos","contacto"]
  .map(id => document.getElementById(id))
  .filter(Boolean);
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

// ===== Complementos dinámicos =====
function escapeHtml(value){
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getAddonImageMarkup(addon){
  if (addon?.image){
    return `<img class="addon-icon-image" src="${escapeHtml(addon.image)}" alt="Icono de ${escapeHtml(addon.title || "complemento")}" loading="lazy" decoding="async" />`;
  }
  return `<span class="addon-icon-fallback">${escapeHtml(addon?.icon || "BI")}</span>`;
}

function renderAddons(addons){
  const grid = $("#addonsGrid");
  if (!grid) return;

  if (!Array.isArray(addons) || !addons.length){
    grid.innerHTML = `
      <article class="addon-card addon-card--empty">
        <h3 class="addon-title">Próximamente más complementos</h3>
        <p class="addon-copy">Estamos preparando nuevas páginas de producto para mostrar cada herramienta con más detalle.</p>
      </article>`;
    return;
  }

  grid.innerHTML = addons.map(addon => {
    const meta = Array.isArray(addon.meta) ? addon.meta : [];
    const url = addon.url || "#";
    const statusClass = addon.statusType === "ready" ? "addon-status--ready" : "";

    return `
      <a class="addon-card addon-card-link" href="${escapeHtml(url)}" aria-label="Abrir ${escapeHtml(addon.title || "complemento")}">
        <div class="addon-header">
          <div class="addon-icon addon-icon--image">${getAddonImageMarkup(addon)}</div>
          <div class="addon-headline">
            <span class="addon-badge">${escapeHtml(addon.badge || "Complemento Revit")}</span>
            <h3 class="addon-title">${escapeHtml(addon.title || "Complemento")}</h3>
          </div>
        </div>

        <p class="addon-copy">${escapeHtml(addon.description || "")}</p>

        <div class="addon-meta">
          ${meta.map(item => `<span class="addon-chip">${escapeHtml(item)}</span>`).join("")}
        </div>

        <div class="addon-footer">
          <span class="addon-status ${statusClass}">${escapeHtml(addon.status || "Disponible")}</span>
          <span class="addon-link addon-link--inline">Abrir página</span>
        </div>
      </a>
    `;
  }).join("");
}

async function initAddons(){
  const grid = $("#addonsGrid");
  if (!grid) return;

  try {
    const res = await fetch("DATA/addons.json?v=3", { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo cargar el listado de complementos.");

    const data = await res.json();
    renderAddons(data.addons || []);
  } catch (error) {
    console.error(error);
    grid.innerHTML = `
      <article class="addon-card addon-card--empty">
        <h3 class="addon-title">No fue posible cargar los complementos</h3>
        <p class="addon-copy">Verifica la ruta del archivo de datos o vuelve a intentar más tarde.</p>
      </article>`;
  }
}

initAddons();
