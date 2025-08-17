// PAGINA-WEB-BI/JS/blog.js

// ===== Helpers =====
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k,d) => { try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch{ return d; }};

// ===== Menú responsive (igual que index) =====
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
navToggle?.addEventListener("click", () =>
  navMenu.classList.contains("open") ? closeMenu() : openMenu()
);
navPanel?.addEventListener("click", closeMenu);
navMenu?.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });

// ===== Claves de storage =====
const BLOG_KEY = "bim:blog";
const LAST_KEY = `${BLOG_KEY}:lastArticle`;
const EXP_KEY  = `${BLOG_KEY}:expanded`;

// ===== TOC: se intentará cargar desde JSON; si falla, se usa este fallback =====
const TOC_FALLBACK = [
  {
    title: "REVIT",
    items: [
      { title: "API de Revit: Introducción y arquitectura", path: "BLOG/HTML/RevitAPI.html" }
    ]
  },
  {
    title: "DYNAMO",
    items: [
      { title: "Buenas prácticas con DesignScript", path: "about:blank" },
      { title: "Flujos con PythonNode", path: "about:blank" }
    ]
  },
  {
    title: "COMPLEMENTOS REVIT",
    items: [
      { title: "Revizto en flujos BIM coordinados", path: "about:blank" },
      { title: "IFC.js y visores web", path: "about:blank" }
    ]
  }
];

// ⚠️ Ruta relativa al archivo blog.html
const TOC_JSON_PATH = "CURSOS/blog.json";

// Estado en memoria
let TOC = [];

async function loadTOCFromJSON() {
  try {
    const url = new URL(TOC_JSON_PATH, window.location.href).href;
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();

    // Validación mínima de esquema
    if (!Array.isArray(data)) throw new Error("Formato no válido: se esperaba un array");
    data.forEach(group => {
      if (typeof group.title !== "string" || !Array.isArray(group.items)) {
        throw new Error("Grupo inválido en blog.json");
      }
      group.items.forEach(it => {
        if (typeof it.title !== "string" || typeof it.path !== "string") {
          throw new Error("Ítem inválido en blog.json");
        }
      });
    });

    return data;
  } catch (err) {
    console.warn("[blog] No se pudo cargar CURSOS/blog.json, usando fallback. Detalle:", err);
    return TOC_FALLBACK;
  }
}

// ===== Render del árbol =====
const treeRoot = $("#blogTree");
const titleEl  = $("#articleTitle");
const metaEl   = $("#articleMeta");
const frameEl  = $("#readerFrame");

function renderTree(){
  const expanded = new Set(load(EXP_KEY, []));
  treeRoot.innerHTML = "";

  TOC.forEach((group, gi) => {
    const groupEl = document.createElement("div");
    groupEl.className = "tree-group";

    const btn = document.createElement("button");
    btn.className = "tree-section";
    btn.type = "button";
    btn.setAttribute("role", "treeitem");
    btn.setAttribute("aria-expanded", expanded.has(gi) ? "true" : "false");
    btn.innerHTML = `<span>${group.title}</span><span aria-hidden="true">▸</span>`;
    groupEl.appendChild(btn);

    const list = document.createElement("div");
    list.className = "tree-list";
    if (!expanded.has(gi)) list.style.display = "none";

    group.items.forEach((leaf) => {
      const row = document.createElement("div");
      row.className = "tree-item";
      row.setAttribute("role", "treeitem");
      row.tabIndex = 0;
      row.dataset.path = leaf.path;
      row.dataset.title = leaf.title;
      row.textContent = leaf.title;

      row.addEventListener("click", () => openArticle(leaf, row));
      row.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openArticle(leaf, row); }
      });

      list.appendChild(row);
    });

    groupEl.appendChild(list);
    treeRoot.appendChild(groupEl);

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      list.style.display = open ? "none" : "grid";
      persistExpanded(toggle(expanded, gi, !open));
    });
  });
}

function toggle(set, key, open){ open ? set.add(key) : set.delete(key); return set; }
function persistExpanded(set){ save(EXP_KEY, Array.from(set)); }

// ===== Abrir artículo en el visor =====
function openArticle(leaf, rowEl){
  $$(".tree-item.active").forEach(n => n.classList.remove("active"));
  rowEl?.classList.add("active");

  const raw = String(leaf.path || "");

  // Permitir rutas válidas:
  //  - BLOG/HTML/archivo.html (relativa)
  //  - /PAGINA-WEB-BI/BLOG/HTML/archivo.html (absoluta por si alguien la escribe así)
  const isValid =
    /^(\.?\/)?BLOG\/HTML\/[^?#]+\.(html?|htm)$/i.test(raw) ||
    /^\/?PAGINA-WEB-BI\/BLOG\/HTML\/[^?#]+\.(html?|htm)$/i.test(raw);

  if (!isValid) return;

  let normalized = raw.startsWith("/PAGINA-WEB-BI/") ? raw.slice(1) : raw;
  const finalURL = new URL(normalized, window.location.href).href;

  frameEl.src = finalURL;
  titleEl.textContent = leaf.title || "Artículo";
  metaEl.textContent  = "Blog Técnico · BIM · Revit/Dynamo";

  save(LAST_KEY, { title: leaf.title, path: leaf.path });

  if (window.matchMedia("(max-width: 1000px)").matches){
    document.querySelector(".reader").scrollIntoView({ behavior:"smooth", block:"start" });
  }
}

// ===== Búsqueda =====
$("#searchInput")?.addEventListener("input", () => {
  const q = ($("#searchInput").value || "").toLowerCase().trim();
  $$(".tree-item").forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(q) ? "" : "none";
  });
});

// ===== Expandir/contraer =====
$("#expandAll")?.addEventListener("click", () => {
  const exp = TOC.map((_, i) => i);
  save(EXP_KEY, exp);
  renderTree();
});
$("#collapseAll")?.addEventListener("click", () => {
  save(EXP_KEY, []);
  renderTree();
});

// ===== Init =====
async function init(){
  TOC = await loadTOCFromJSON();
  renderTree();

  const last = load(LAST_KEY, null);

  // Selección inicial: último leído o el primero disponible válido
  let initial = last;
  if (!initial){
    outer: for (const g of TOC){
      for (const it of g.items){
        if (it.path && (/^(\.?\/)?BLOG\/HTML\//i.test(it.path) || /^\/?PAGINA-WEB-BI\/BLOG\/HTML\//i.test(it.path))){
          initial = it; break outer;
        }
      }
    }
  }

  if (initial){
    const node = $$(".tree-item").find(n => n.dataset.path === initial.path);
    openArticle(initial, node);
  }
}

document.addEventListener("DOMContentLoaded", init);
