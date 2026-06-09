function getCurrentScriptElement() {
  if (document.currentScript) return document.currentScript;

  const scripts = Array.from(document.querySelectorAll("script"));

  return (
    scripts.find((s) => s.dataset.course || s.dataset.syllabus) ||
    scripts.find((s) => (s.getAttribute("src") || "").includes("reproductorCursos.js")) ||
    null
  );
}

const SCRIPT_EL = getCurrentScriptElement();
const COURSE_KEY = SCRIPT_EL?.dataset.course || "RevitAPIIntermedio";
const DATA_URL = SCRIPT_EL?.dataset.syllabus || "CURSOS/syllabus-RevitAPIIntermedio.json";
const YT_PARAMS = "rel=0&modestbranding=1&playsinline=1";

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const load = (k, d = null) => {
  try {
    const raw = localStorage.getItem(k);
    return raw ? JSON.parse(raw) : d;
  } catch {
    return d;
  }
};

function normalizeUrl(url) {
  return (url || "").split("?")[0];
}

function buildFrameUrl(src) {
  if (!src) return "";
  return src.includes("?") ? `${src}&${YT_PARAMS}` : `${src}?${YT_PARAMS}`;
}

function setFrame(src) {
  const iframe = $("#playerFrame");
  if (!iframe || !src) return;
  iframe.src = buildFrameUrl(src);
}

const ACTIVE_KEY = `bim:${COURSE_KEY}:lastVideo`;
const EXPANDED_KEY = `bim:${COURSE_KEY}:expanded`;
const SCROLL_KEY = `bim:${COURSE_KEY}:sidebarScroll`;

let META = {};
let SYLLABUS = [];
let courseLoadError = "";

const treeRoot = $("#tree");
const titleEl = $("#videoTitle");
const metaEl = $("#videoMeta");
const sidebar = $(".sidebar");
const courseLayout = $("#curso");
const playerSection = $(".player");

function splitNumberAndText(raw) {
  const t = (raw || "").trim();
  const m = t.match(/^(\d+(?:\.\d+)*)(?:\.)?\s+(.*)$/);
  if (m) return { num: `${m[1]}.`, text: m[2] };
  return { num: "", text: t };
}

function scrollCourseIntoView() {
  if (!courseLayout) return;

  courseLayout.scrollIntoView({
    behavior: "smooth",
    block: window.innerWidth <= 1000 ? "start" : "center"
  });
}

function setupCourseAnchors() {
  $$('a[href="#curso"]').forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      scrollCourseIntoView();
      history.replaceState(null, "", "#curso");
    });
  });

  if (window.location.hash === "#curso") {
    requestAnimationFrame(() => {
      setTimeout(scrollCourseIntoView, 120);
    });
  }
}

function applyMeta() {
  document.title = `BIM INGENIEROS · ${META.title || COURSE_KEY}`;

  if ($("#courseTitle")) $("#courseTitle").textContent = META.title || "Curso";
  if ($("#courseSubtitle")) $("#courseSubtitle").textContent = META.subtitle || "";
  if ($("#coursePrice")) $("#coursePrice").textContent = META.price || "";
  if ($("#sidebarPrice")) $("#sidebarPrice").textContent = META.price || "";
  if ($("#courseBadges")) $("#courseBadges").textContent = META.badges || "";
  if ($("#sidebarTitle")) $("#sidebarTitle").textContent = META.sidebar || "Temario";

  const cta = META.contact || "https://wa.me/51968744058";

  ["contactBtn", "adviceBtn", "headerCTA", "sidebarCTA"].forEach((id) => {
    const a = document.getElementById(id);
    if (a) a.href = cta;
  });
}

function getLeafPath(gi, ii, li = null) {
  return li == null ? `${gi}-${ii}` : `${gi}-${ii}-${li}`;
}

function findVideoByPath(path) {
  if (!path) return null;

  const parts = String(path).split("-").map(Number);
  const [gi, ii, li] = parts;

  const group = SYLLABUS[gi];
  if (!group) return null;

  const item = group.items?.[ii];
  if (!item) return null;

  if (li == null || Number.isNaN(li)) {
    if (!item.url) return null;
    return { ...item, path: getLeafPath(gi, ii) };
  }

  const child = item.children?.[li];
  if (!child?.url) return null;

  return { ...child, path: getLeafPath(gi, ii, li) };
}

function findVideoByUrl(url) {
  const target = normalizeUrl(url);

  for (let gi = 0; gi < SYLLABUS.length; gi++) {
    const group = SYLLABUS[gi];

    for (let ii = 0; ii < (group.items || []).length; ii++) {
      const item = group.items[ii];

      if (item.url && normalizeUrl(item.url) === target) {
        return { ...item, path: getLeafPath(gi, ii) };
      }

      if (item.children?.length) {
        for (let li = 0; li < item.children.length; li++) {
          const child = item.children[li];
          if (child.url && normalizeUrl(child.url) === target) {
            return { ...child, path: getLeafPath(gi, ii, li) };
          }
        }
      }
    }
  }

  return null;
}

function findVideoByTitle(title) {
  if (!title) return null;

  for (let gi = 0; gi < SYLLABUS.length; gi++) {
    const group = SYLLABUS[gi];

    for (let ii = 0; ii < (group.items || []).length; ii++) {
      const item = group.items[ii];

      if (item.title === title && item.url) {
        return { ...item, path: getLeafPath(gi, ii) };
      }

      if (item.children?.length) {
        for (let li = 0; li < item.children.length; li++) {
          const child = item.children[li];
          if (child.title === title && child.url) {
            return { ...child, path: getLeafPath(gi, ii, li) };
          }
        }
      }
    }
  }

  return null;
}

function firstPlayable() {
  for (let gi = 0; gi < SYLLABUS.length; gi++) {
    const group = SYLLABUS[gi];

    for (let ii = 0; ii < (group.items || []).length; ii++) {
      const item = group.items[ii];

      if (item.url) return { ...item, path: getLeafPath(gi, ii) };

      if (item.children?.length) {
        for (let li = 0; li < item.children.length; li++) {
          const child = item.children[li];
          if (child.url) return { ...child, path: getLeafPath(gi, ii, li) };
        }
      }
    }
  }

  return null;
}

function ensureExpandedForPath(path) {
  if (!path) return;

  const expanded = new Set(load(EXPANDED_KEY, []));
  const parts = String(path).split("-");

  if (parts.length >= 2) {
    expanded.add(Number(parts[0]));
  }

  if (parts.length === 3) {
    expanded.add(`g${parts[0]}-i${parts[1]}`);
  }

  save(EXPANDED_KEY, Array.from(expanded));
}

function toggle(set, key, open) {
  if (open) set.add(key);
  else set.delete(key);
  return set;
}

function persistExpanded(set) {
  save(EXPANDED_KEY, Array.from(set));
}

function makeLeaf(leaf, path) {
  const row = document.createElement("div");
  row.className = "tree-item";
  row.setAttribute("role", "treeitem");
  row.tabIndex = 0;
  row.dataset.path = path;
  row.dataset.title = leaf.title || "";
  row.dataset.url = leaf.url || "";

  const { num, text } = splitNumberAndText(leaf.title);

  row.innerHTML = `
    <span class="item-num" aria-hidden="true">${num}</span>
    <span class="item-title">${text}</span>
  `;

  const onOpen = () => openVideo({ ...leaf, path }, row);

  row.addEventListener("click", onOpen);
  row.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onOpen();
    }
  });

  return row;
}

function renderTree() {
  if (!treeRoot) return;

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

    (group.items || []).forEach((it, ii) => {
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

        it.children.forEach((leaf, li) => {
          subList.appendChild(makeLeaf(leaf, getLeafPath(gi, ii, li)));
        });

        list.appendChild(subList);

        subBtn.addEventListener("click", () => {
          const open = subBtn.getAttribute("aria-expanded") === "true";
          subBtn.setAttribute("aria-expanded", String(!open));
          subList.style.display = open ? "none" : "grid";
          persistExpanded(toggle(expanded, subKey, !open));
        });
      } else if (it.url) {
        list.appendChild(makeLeaf(it, getLeafPath(gi, ii)));
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

function openVideo(leaf, rowEl = null) {
  if (!leaf?.url) return;

  $$(".tree-item.active").forEach((n) => n.classList.remove("active"));

  if (rowEl) {
    rowEl.classList.add("active");
  } else if (leaf.path) {
    const node = $(`.tree-item[data-path="${leaf.path}"]`);
    node?.classList.add("active");
  }

  setFrame(leaf.url);

  if (titleEl) titleEl.textContent = leaf.title || "";
  if (metaEl) metaEl.textContent = META.metaLine || "YouTube · Revit API · C#/Python";

  save(ACTIVE_KEY, {
    url: leaf.url,
    title: leaf.title || "",
    path: leaf.path || null
  });

  if (window.matchMedia("(max-width: 1000px)").matches) {
    playerSection?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function applySearchFilter(query) {
  const q = (query || "").toLowerCase().trim();

  const groups = $$(".tree-group", treeRoot);

  groups.forEach((groupEl) => {
    let groupHasVisible = false;

    const directLists = $$(".tree-list", groupEl);

    directLists.forEach((list) => {
      const directItems = Array.from(list.children);

      directItems.forEach((node) => {
        if (node.classList.contains("tree-item")) {
          const visible = !q || node.textContent.toLowerCase().includes(q);
          node.style.display = visible ? "" : "none";
          if (visible) groupHasVisible = true;
        }

        if (node.classList.contains("tree-section")) {
          const next = node.nextElementSibling;
          if (next && next.classList.contains("tree-list")) {
            const leaves = $$(".tree-item", next);
            let subHasVisible = false;

            leaves.forEach((leaf) => {
              const visible = !q || leaf.textContent.toLowerCase().includes(q);
              leaf.style.display = visible ? "" : "none";
              if (visible) subHasVisible = true;
            });

            node.style.display = subHasVisible ? "" : "none";
            next.style.display = subHasVisible ? "grid" : "none";

            if (subHasVisible) groupHasVisible = true;
          }
        }
      });
    });

    groupEl.style.display = groupHasVisible || !q ? "" : "none";

    if (q) {
      const topButton = $(".tree-section", groupEl);
      const topList = $(".tree-list", groupEl);
      if (topButton && topList && groupHasVisible) {
        topButton.setAttribute("aria-expanded", "true");
        topList.style.display = "grid";
      }
    }
  });
}

$("#searchInput")?.addEventListener("input", () => {
  applySearchFilter($("#searchInput")?.value || "");
});

$("#expandAll")?.addEventListener("click", () => {
  const expanded = new Set();

  SYLLABUS.forEach((g, gi) => {
    expanded.add(gi);

    (g.items || []).forEach((it, ii) => {
      if (it.children?.length) {
        expanded.add(`g${gi}-i${ii}`);
      }
    });
  });

  save(EXPANDED_KEY, Array.from(expanded));
  renderTree();
  markActiveFromStorage();
  restoreSidebarScroll();
});

$("#collapseAll")?.addEventListener("click", () => {
  save(EXPANDED_KEY, []);
  renderTree();
  markActiveFromStorage();
  restoreSidebarScroll();
});

function saveSidebarScroll() {
  if (!sidebar) return;
  save(SCROLL_KEY, { y: sidebar.scrollTop });
}

function restoreSidebarScroll() {
  const s = load(SCROLL_KEY, null);
  if (sidebar && s) sidebar.scrollTop = s.y || 0;
}

sidebar?.addEventListener("scroll", () => {
  if (saveSidebarScroll._t) cancelAnimationFrame(saveSidebarScroll._t);
  saveSidebarScroll._t = requestAnimationFrame(saveSidebarScroll);
});

function getVideoByStoredState(stored) {
  if (!stored) return null;

  return (
    (stored.path && findVideoByPath(stored.path)) ||
    (stored.url && findVideoByUrl(stored.url)) ||
    (stored.title && findVideoByTitle(stored.title)) ||
    null
  );
}

function pickInitial() {
  const cfg = META.default || {};
  const respectLast = cfg.respectLastWatched !== false;
  const last = respectLast ? load(ACTIVE_KEY, null) : null;

  return (
    getVideoByStoredState(last) ||
    (cfg.path && findVideoByPath(Array.isArray(cfg.path) ? cfg.path.join("-") : cfg.path)) ||
    (cfg.url && findVideoByUrl(cfg.url)) ||
    (cfg.title && findVideoByTitle(cfg.title)) ||
    (META.defaultUrl &&
      (findVideoByUrl(META.defaultUrl) || {
        url: META.defaultUrl,
        title: "Lección inicial",
        path: null
      })) ||
    firstPlayable()
  );
}

async function loadCourse() {
  try {
    const res = await fetch(DATA_URL, { cache: "no-cache" });
    if (!res.ok) throw new Error(`No se pudo cargar el syllabus: ${DATA_URL}`);

    const data = await res.json();
    META = data.meta || {};
    SYLLABUS = Array.isArray(data.syllabus) ? data.syllabus : [];
  } catch (e) {
    console.warn(e.message);
    courseLoadError = "No fue posible cargar el temario. Recarga la página o contacta con BIM Ingenieros.";
    META = {
      title: COURSE_KEY,
      price: "",
      metaLine: "YouTube · Curso"
    };
    SYLLABUS = [];
  }
}

function restoreInitialVideo() {
  const pick = pickInitial();
  if (!pick) return;

  ensureExpandedForPath(pick.path);
  renderTree();
  openVideo(pick);
}

function markActiveFromStorage() {
  const last = load(ACTIVE_KEY, null);
  if (!last) return;

  const node =
    (last.path && $(`.tree-item[data-path="${last.path}"]`)) ||
    (last.url &&
      $$(".tree-item").find((n) => normalizeUrl(n.dataset.url) === normalizeUrl(last.url))) ||
    (last.title &&
      $$(".tree-item").find((n) => (n.dataset.title || "").trim() === last.title.trim())) ||
    null;

  if (node) node.classList.add("active");
}

async function init() {
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  setupCourseAnchors();

  await loadCourse();
  applyMeta();

  if (courseLoadError) {
    if (treeRoot) treeRoot.innerHTML = `<p class="muted">${courseLoadError}</p>`;
    if (titleEl) titleEl.textContent = "Temario no disponible";
    if (metaEl) metaEl.textContent = courseLoadError;
    return;
  }

  renderTree();
  restoreInitialVideo();
  markActiveFromStorage();
  restoreSidebarScroll();
}

document.addEventListener("DOMContentLoaded", init);

