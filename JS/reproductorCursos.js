// ===== Lee parámetros del <script data-*> =====
const SCRIPT_EL = document.querySelector('script[src$="reproductorCursos.js"]');
const COURSE_KEY = SCRIPT_EL?.dataset.course   || "RevitAPIIntermedio";
const DATA_URL   = SCRIPT_EL?.dataset.syllabus || "CURSOS/syllabus-RevitAPIIntermedio.json";
const YT_PARAMS  = "rel=0&modestbranding=1&playsinline=1";

// ===== Helpers =====
const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
const setFrame = (src) => {
  const iframe = $("#playerFrame");
  const url = src.includes("?") ? `${src}&${YT_PARAMS}` : `${src}?${YT_PARAMS}`;
  iframe.src = url;
};
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k,d) => { try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch{ return d; }};

// Storage keys por curso
const ACTIVE_KEY   = `bim:${COURSE_KEY}:lastVideo`;
const EXPANDED_KEY = `bim:${COURSE_KEY}:expanded`;
const SCROLL_KEY   = `bim:${COURSE_KEY}:sidebarScroll`;

// ===== Menú responsive =====
const navToggle = $("#navToggle");
const navMenu   = $("#navMenu");
const navPanel  = $("#navPanel");
function openMenu(){ document.body.classList.add("menu-open"); navMenu.classList.add("open"); navPanel.classList.add("open"); navToggle.setAttribute("aria-expanded","true"); navMenu.querySelector("a")?.focus(); }
function closeMenu(){ document.body.classList.remove("menu-open"); navMenu.classList.remove("open"); navPanel.classList.remove("open"); navToggle.setAttribute("aria-expanded","false"); }
navToggle?.addEventListener("click", () => navMenu.classList.contains("open") ? closeMenu() : openMenu());
navPanel?.addEventListener("click", closeMenu);
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && navMenu?.classList.contains("open")) closeMenu(); });
navMenu?.addEventListener("click", (e) => { if (e.target.closest("a")) closeMenu(); });

// ===== Estado y elementos =====
let META = {};
let SYLLABUS = [];
const treeRoot = $("#tree");
const titleEl  = $("#videoTitle");
const metaEl   = $("#videoMeta");
const sidebar  = $(".sidebar");

// ===== Utilidad: numeración + sangría colgante =====
function splitNumberAndText(raw){
  const t = (raw || "").trim();
  const m = t.match(/^(\d+(?:\.\d+)*)(?:\.)?\s+(.*)$/); // p.ej. "4.4.1 Texto"
  if (m) return { num: m[1] + ".", text: m[2] };
  return { num: "", text: t };
}

// ===== Render meta =====
function applyMeta(){
  document.title = `BIM INGENIEROS · ${META.title || COURSE_KEY}`;
  $("#courseTitle")   && ($("#courseTitle").textContent    = META.title    || "Curso");
  $("#courseSubtitle")&& ($("#courseSubtitle").textContent = META.subtitle || "");
  $("#coursePrice")   && ($("#coursePrice").textContent    = META.price    || "");
  $("#sidebarPrice")  && ($("#sidebarPrice").textContent   = META.price    || "");
  $("#courseBadges")  && ($("#courseBadges").textContent   = META.badges   || "");
  $("#sidebarTitle")  && ($("#sidebarTitle").textContent   = META.sidebar  || "Temario");
  const cta = META.contact || "https://wa.me/51968744058";
  ["contactBtn","adviceBtn","headerCTA","sidebarCTA"].forEach(id => { const a = document.getElementById(id); if(a) a.href = cta; });
}

// ===== Árbol =====
function renderTree(){
  const expanded = new Set(load(EXPANDED_KEY, []));
  treeRoot.innerHTML = "";

  SYLLABUS.forEach((group, gi) => {
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

    group.items.forEach((it, ii) => {
      if (it.children?.length) {
        const subBtn = document.createElement("button");
        subBtn.className = "tree-section";
        subBtn.type = "button";
        const subKey = `g${gi}-i${ii}`;
        const subExpanded = expanded.has(subKey);
        subBtn.setAttribute("aria-expanded", subExpanded ? "true" : "false");
        subBtn.innerHTML = `<span>${it.title}</span><span aria-hidden="true">▸</span>`;
        list.appendChild(subBtn);

        const subList = document.createElement("div");
        subList.className = "tree-list";
        if (!subExpanded) subList.style.display = "none";

        it.children.forEach(leaf => subList.appendChild(makeLeaf(leaf)));
        list.appendChild(subList);

        subBtn.addEventListener("click", () => {
          const open = subBtn.getAttribute("aria-expanded") === "true";
          subBtn.setAttribute("aria-expanded", String(!open));
          subList.style.display = open ? "none" : "grid";
          persistExpanded(toggle(expanded, subKey, !open));
        });
      } else {
        list.appendChild(makeLeaf(it));
      }
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

function makeLeaf(leaf){
  const row = document.createElement("div");
  row.className = "tree-item";
  row.setAttribute("role", "treeitem");
  row.tabIndex = 0;

  const { num, text } = splitNumberAndText(leaf.title);
  row.innerHTML = `
    <span class="item-num" aria-hidden="true">${num}</span>
    <span class="item-title">${text}</span>
  `;

  const onOpen = () => openVideo(leaf, row);
  row.addEventListener("click", onOpen);
  row.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(); } });

  return row;
}

function toggle(set, key, open){ open ? set.add(key) : set.delete(key); return set; }
function persistExpanded(set){ save(EXPANDED_KEY, Array.from(set)); }

// ===== Player + estado =====
function openVideo(leaf, rowEl){
  $$(".tree-item.active").forEach(n => n.classList.remove("active"));
  rowEl.classList.add("active");
  setFrame(leaf.url);
  titleEl && (titleEl.textContent = leaf.title);
  metaEl  && (metaEl.textContent  = META.metaLine || "YouTube · Revit API · C#/Python");
  save(ACTIVE_KEY, { url: leaf.url, title: leaf.title });

  if (window.matchMedia("(max-width: 1000px)").matches){
    document.querySelector(".player").scrollIntoView({ behavior:"smooth", block:"start" });
  }
}

// ===== Búsqueda =====
$("#searchInput")?.addEventListener("input", () => {
  const q = ($("#searchInput").value || "").toLowerCase().trim();
  $$(".tree-item").forEach(item => { item.style.display = item.textContent.toLowerCase().includes(q) ? "" : "none"; });
});

// ===== Expandir/contraer =====
$("#expandAll")?.addEventListener("click", () => {
  const expanded = new Set();
  SYLLABUS.forEach((g, gi) => {
    expanded.add(gi);
    g.items.forEach((it, ii) => { if (it.children) expanded.add(`g${gi}-i${ii}`); });
  });
  save(EXPANDED_KEY, Array.from(expanded));
  renderTree(); restoreActiveAndScroll();
});
$("#collapseAll")?.addEventListener("click", () => {
  save(EXPANDED_KEY, []);
  renderTree(); restoreActiveAndScroll();
});

// ===== Scroll sidebar persistente =====
function saveSidebarScroll(){ save(SCROLL_KEY, { y: sidebar.scrollTop }); }
function restoreSidebarScroll(){ const s = load(SCROLL_KEY); if (s) sidebar.scrollTop = s.y || 0; }
sidebar?.addEventListener("scroll", () => {
  if (saveSidebarScroll._t) cancelAnimationFrame(saveSidebarScroll._t);
  saveSidebarScroll._t = requestAnimationFrame(saveSidebarScroll);
});

// ===== Búsqueda del video inicial desde JSON =====
function firstPlayable() {
  for (const g of SYLLABUS) {
    for (const it of g.items) {
      if (it.url) return { url: it.url, title: it.title };
      if (it.children?.length) {
        const leaf = it.children.find(c => c.url);
        if (leaf) return { url: leaf.url, title: leaf.title };
      }
    }
  }
  return null;
}
const norm = u => (u || "").split("?")[0];

function getVideoByUrl(u) {
  const n = norm(u);
  for (const g of SYLLABUS) {
    for (const it of g.items) {
      if (it.url && norm(it.url) === n) return { url: it.url, title: it.title };
      if (it.children) {
        for (const c of it.children) {
          if (c.url && norm(c.url) === n) return { url: c.url, title: c.title };
        }
      }
    }
  }
  return null;
}
function getVideoByTitle(t) {
  if (!t) return null;
  for (const g of SYLLABUS) {
    for (const it of g.items) {
      if (it.title === t) return { url: it.url, title: it.title };
      if (it.children) {
        const c = it.children.find(x => x.title === t);
        if (c) return { url: c.url, title: c.title };
      }
    }
  }
  return null;
}
function getVideoByPath(p) {
  if (!Array.isArray(p)) return null;
  const [gi, ii, li] = p;
  const g = SYLLABUS[gi]; if (!g) return null;
  const it = g.items?.[ii]; if (!it) return null;
  if (li == null) return it.url ? { url: it.url, title: it.title } : null;
  const c = it.children?.[li];
  return c?.url ? { url: c.url, title: c.title } : null;
}

function pickInitial() {
  const cfg = (META.default || {});
  const respectLast = cfg.respectLastWatched !== false; // por defecto true
  const last = respectLast ? load(ACTIVE_KEY, null) : null;
  if (last) return last;

  // prioridad: url -> path -> title -> compat (meta.defaultUrl) -> primero jugable
  return (
    (cfg.url && getVideoByUrl(cfg.url)) ||
    (cfg.path && getVideoByPath(cfg.path)) ||
    (cfg.title && getVideoByTitle(cfg.title)) ||
    (META.defaultUrl && (getVideoByUrl(META.defaultUrl) || { url: META.defaultUrl, title: "Lección inicial" })) ||
    firstPlayable()
  );
}

// ===== Carga JSON + init =====
async function loadCourse(){
  try{
    const res = await fetch(DATA_URL, { cache: "no-cache" });
    if(!res.ok) throw new Error("No se pudo cargar el syllabus");
    const data = await res.json();
    META = data.meta || {};
    SYLLABUS = data.syllabus || [];
  }catch(e){
    console.warn(e.message);
    META = { title: COURSE_KEY, price: "" };
    SYLLABUS = [{ title:"Módulo demo", items:[{ title:"1.1 Lección demo", url:"https://www.youtube.com/embed/dQw4w9WgXcQ" }]}];
  }
}

function restoreActiveAndScroll(){
  const pick = pickInitial();
  if (pick){
    setFrame(pick.url);
    titleEl && (titleEl.textContent = pick.title || "");
    metaEl  && (metaEl.textContent  = META.metaLine || "YouTube · Revit API · C#/Python");
  }
  restoreSidebarScroll();
}

async function init(){
  const y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();
  await loadCourse();
  applyMeta();
  renderTree();
  restoreActiveAndScroll();

  const last = load(ACTIVE_KEY);
  if (last){
    const node = $$(".tree-item").find(n => n.textContent.trim().includes(last.title));
    if (node) node.classList.add("active");
  }
}
document.addEventListener("DOMContentLoaded", init);
