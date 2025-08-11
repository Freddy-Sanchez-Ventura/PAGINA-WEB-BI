// ===== Helpers =====
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k,d) => { try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch{ return d; }};

// ===== Menú responsive (igual que index) =====
const navToggle = $("#navToggle");
const navMenu   = $("#navMenu");
const navPanel  = $("#navPanel");
function openMenu(){ document.body.classList.add("menu-open"); navMenu.classList.add("open"); navPanel.classList.add("open"); navToggle?.setAttribute("aria-expanded","true"); }
function closeMenu(){ document.body.classList.remove("menu-open"); navMenu.classList.remove("open"); navPanel.classList.remove("open"); navToggle?.setAttribute("aria-expanded","false"); }
navToggle?.addEventListener("click", () => navMenu.classList.contains("open") ? closeMenu() : openMenu());
navPanel?.addEventListener("click", closeMenu);
navMenu?.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });

// ===== Datos del blog =====
// Estructura de árbol con categorías y artículos -> cada artículo carga un HTML externo en el visor.
const BLOG_KEY = "bim:blog";
const LAST_KEY = `${BLOG_KEY}:lastArticle`;
const EXP_KEY  = `${BLOG_KEY}:expanded`;

const TOC = [
  {
    title: "REVIT",
    items: [
      { title: "API de Revit: Introducción y arquitectura", path: "PAGINA-WEB-BI/BLOG/HTML/RevitAPI.html" },
      // Puedes agregar más artículos aquí...
      // { title: "Parámetros de tipo vs instancia", path: "PAGINA-WEB-BI/BLOG/HTML/ParametrosTipoInstancia.html" },
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

    group.items.forEach((leaf, ii) => {
      const row = document.createElement("div");
      row.className = "tree-item";
      row.setAttribute("role", "treeitem");
      row.tabIndex = 0;
      row.dataset.path = leaf.path;
      row.dataset.title = leaf.title;
      row.textContent = leaf.title;

      row.addEventListener("click", () => openArticle(leaf, row));
      row.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openArticle(leaf, row); } });

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
  // Limpia activo
  $$(".tree-item.active").forEach(n => n.classList.remove("active"));
  rowEl?.classList.add("active");

  // Seguridad simple: solo permitir rutas dentro de BLOG/HTML
  const path = String(leaf.path || "");
  if (!path.startsWith("PAGINA-WEB-BI/BLOG/HTML/")) return;

  frameEl.src = path;
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
  $$(".tree-item").forEach(item => { item.style.display = item.textContent.toLowerCase().includes(q) ? "" : "none"; });
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
function init(){
  renderTree();
  const last = load(LAST_KEY, null);

  // Selección inicial: último leído o el primer artículo disponible
  let initial = last;
  if (!initial){
    outer: for (const g of TOC){
      for (const it of g.items){
        if (it.path && it.path.startsWith("PAGINA-WEB-BI/BLOG/HTML/")){
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
