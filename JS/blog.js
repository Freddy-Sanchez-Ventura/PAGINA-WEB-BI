// PAGINA-WEB-BI/JS/blog.js

const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));
const save = (k,v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k,d) => { try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch{ return d; }};

const BLOG_KEY = "bim:blog";
const LAST_KEY = `${BLOG_KEY}:lastArticle`;
const EXP_KEY  = `${BLOG_KEY}:expandedNodes`;
const TOC_JSON_PATH = "../CURSOS/blog.json";

const TOC_FALLBACK = [
  {
    title: "REVIT",
    items: [
      { title: "Introducción", path: "BLOG/HTML/RevitIntroduccion.html" }
    ]
  }
];

let TOC = [];
let nodeCounter = 0;

async function loadTOCFromJSON() {
  try {
    const url = new URL(TOC_JSON_PATH, window.location.href).href;
    const resp = await fetch(url, { cache: "no-store" });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const data = await resp.json();
    if (!Array.isArray(data)) throw new Error("Formato inválido de blog.json");
    return data;
  } catch (err) {
    console.warn("[blog] No se pudo cargar blog.json. Usando fallback.", err);
    return TOC_FALLBACK;
  }
}

function normalizeTree(nodes, depth = 0, parentId = ""){
  return nodes.map((node, index) => {
    const id = parentId ? `${parentId}.${index}` : `n${index}`;
    const normalized = {
      id,
      title: String(node.title || "Tema"),
      path: typeof node.path === "string" ? node.path : "",
      depth,
      items: Array.isArray(node.items) ? normalizeTree(node.items, depth + 1, id) : []
    };
    nodeCounter += 1;
    return normalized;
  });
}

function flattenLeaves(nodes, bucket = []){
  nodes.forEach(node => {
    if (node.path) bucket.push(node);
    if (node.items?.length) flattenLeaves(node.items, bucket);
  });
  return bucket;
}

function flattenAll(nodes, bucket = []){
  nodes.forEach(node => {
    bucket.push(node);
    if (node.items?.length) flattenAll(node.items, bucket);
  });
  return bucket;
}

const treeRoot = $("#blogTree");
const titleEl  = $("#articleTitle");
const metaEl   = $("#articleMeta");
const frameEl  = $("#readerFrame");

function isValidPath(raw){
  return /^(articulos\/[a-z0-9áéíóúñ-]+\/?|(\.?\/)?BLOG\/HTML\/[^?#]+\.(html?|htm))(#[^?]+)?$/i.test(raw || "");
}

function ensureExpandedPath(nodeId, expandedSet){
  const parts = String(nodeId || "").split(".");
  let current = "";
  parts.forEach((part, index) => {
    current = index === 0 ? part : `${current}.${part}`;
    expandedSet.add(current);
  });
}

function createNodeElement(node, expandedSet){
  const wrapper = document.createElement("div");
  wrapper.className = `tree-node depth-${Math.min(node.depth, 3)}`;
  wrapper.dataset.nodeId = node.id;

  const hasChildren = node.items?.length > 0;
  const isLeaf = !!node.path;
  const isExpanded = expandedSet.has(node.id);

  if (hasChildren) {
    const btn = document.createElement("button");
    btn.className = `tree-section depth-${Math.min(node.depth, 3)}`;
    btn.type = "button";
    btn.setAttribute("role", "treeitem");
    btn.setAttribute("aria-expanded", String(isExpanded));
    btn.innerHTML = `<span>${node.title}</span><span class="tree-caret" aria-hidden="true">▸</span>`;
    wrapper.appendChild(btn);

    const list = document.createElement("div");
    list.className = `tree-list depth-${Math.min(node.depth + 1, 3)}`;
    if (!isExpanded) list.style.display = "none";

    node.items.forEach(child => list.appendChild(createNodeElement(child, expandedSet)));
    wrapper.appendChild(list);

    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") === "true";
      btn.setAttribute("aria-expanded", String(!open));
      list.style.display = open ? "none" : "grid";
      if (open) expandedSet.delete(node.id); else expandedSet.add(node.id);
      save(EXP_KEY, Array.from(expandedSet));
    });
  }

  if (isLeaf) {
    const item = document.createElement("div");
    item.className = `tree-item depth-${Math.min(node.depth, 3)}`;
    item.setAttribute("role", "treeitem");
    item.tabIndex = 0;
    item.dataset.path = node.path;
    item.dataset.title = node.title;
    item.dataset.nodeId = node.id;
    item.textContent = node.title;

    item.addEventListener("click", () => openArticle(node, item));
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openArticle(node, item);
      }
    });

    wrapper.appendChild(item);
  }

  return wrapper;
}

function renderTree(){
  const expandedSet = new Set(load(EXP_KEY, []));
  treeRoot.innerHTML = "";
  TOC.forEach(node => treeRoot.appendChild(createNodeElement(node, expandedSet)));
}

function openArticle(node, rowEl){
  $$(".tree-item.active").forEach(n => n.classList.remove("active"));
  rowEl?.classList.add("active");

  const raw = String(node.path || "");
  if (!isValidPath(raw)) return;

  let normalized = raw.startsWith("/PAGINA-WEB-BI/") ? raw.slice(1) : raw;
  const finalURL = normalized.startsWith("/")
    ? new URL(normalized, window.location.origin).href
    : new URL(`../${normalized}`, window.location.href).href;

  frameEl.src = finalURL;
  titleEl.textContent = node.title || "Artículo";
  metaEl.textContent  = "Blog Técnico · BIM · Revit · Guía estructurada";

  const expandedSet = new Set(load(EXP_KEY, []));
  ensureExpandedPath(node.id, expandedSet);
  save(EXP_KEY, Array.from(expandedSet));
  save(LAST_KEY, { title: node.title, path: node.path, nodeId: node.id });

  if (window.matchMedia("(max-width: 1000px)").matches){
    document.querySelector(".reader")?.scrollIntoView({ behavior:"smooth", block:"start" });
  }
}

function applySearch(){
  const q = ($("#searchInput")?.value || "").toLowerCase().trim();
  if (!q) {
    renderTree();
    const last = load(LAST_KEY, null);
    if (last?.path) {
      const node = $$(".tree-item").find(n => n.dataset.path === last.path && n.dataset.title === last.title);
      if (node) node.classList.add("active");
    }
    return;
  }

  treeRoot.innerHTML = "";
  const expandedSet = new Set();

  function filterNodes(nodes){
    return nodes.map(node => {
      const childMatches = filterNodes(node.items || []);
      const selfMatch = node.title.toLowerCase().includes(q);
      const keep = selfMatch || childMatches.length > 0 || (node.path && selfMatch);
      if (!keep) return null;
      if (childMatches.length > 0) expandedSet.add(node.id);
      return { ...node, items: childMatches };
    }).filter(Boolean);
  }

  const filtered = filterNodes(TOC);
  filtered.forEach(node => treeRoot.appendChild(createNodeElement(node, expandedSet)));
}

$("#searchInput")?.addEventListener("input", applySearch);

$("#expandAll")?.addEventListener("click", () => {
  const allIds = flattenAll(TOC).filter(n => n.items?.length).map(n => n.id);
  save(EXP_KEY, allIds);
  renderTree();
});

$("#collapseAll")?.addEventListener("click", () => {
  save(EXP_KEY, []);
  renderTree();
});

async function init(){
  const rawToc = await loadTOCFromJSON();
  TOC = normalizeTree(rawToc);
  renderTree();

  const last = load(LAST_KEY, null);
  const leaves = flattenLeaves(TOC);
  const initial = leaves.find(n => n.path === last?.path) || leaves[0];

  if (initial){
    const expandedSet = new Set(load(EXP_KEY, []));
    ensureExpandedPath(initial.id, expandedSet);
    save(EXP_KEY, Array.from(expandedSet));
    renderTree();
    const node = $$(".tree-item").find(n => n.dataset.path === initial.path && n.dataset.title === initial.title);
    openArticle(initial, node);
  }
}

document.addEventListener("DOMContentLoaded", init);
