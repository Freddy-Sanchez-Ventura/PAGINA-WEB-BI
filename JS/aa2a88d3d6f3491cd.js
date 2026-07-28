const $=(_0x6a840,_0x6a841=document)=>_0x6a841 .querySelector(_0x6a840);const $$=(_0x6a842,_0x6a843=document)=>Array.from(_0x6a843 .querySelectorAll(_0x6a842));function smoothScrollTo(_0x6a844){const _0x6a845=document.getElementById(_0x6a844 .replace("#",""));if(!_0x6a845)return;const _0x6a846=parseInt(getComputedStyle(document.documentElement).getPropertyValue("\x2d\x2d\x68\x65\x61\x64\x65\x72\x2d\x68"))||0x40;const _0x6a847=_0x6a845 .getBoundingClientRect().top+window.scrollY-_0x6a846+1;const _0x6a848=window.matchMedia("(prefers-reduced-motion: reduce)").matches;window.scrollTo({top:_0x6a847,behavior:_0x6a848?"auto":"smooth"});}$$('a[href^="#"]').forEach(_0x6a849=>{_0x6a849 .addEventListener("click",(_0x6a84a)=>{const _0x6a84b=_0x6a849 .getAttribute("href");if(_0x6a84b.length>1){_0x6a84a.preventDefault();smoothScrollTo(_0x6a84b);history.replaceState(null,"",_0x6a84b);}});});const sections=["home","cursos","complementos","contacto"].map(_0x6a84c=>document.getElementById(_0x6a84c)).filter(Boolean);const navLinks=$$("#navMenu .nav-link").filter(_0x6a84d=>_0x6a84d.getAttribute("href")?.startsWith("#"));if(sections.length&&navLinks.length){const obs=new IntersectionObserver((_0x6a84e)=>{_0x6a84e.forEach(_0x6a84f=>{if(_0x6a84f.isIntersecting){const _0x6a84g=_0x6a84f.target.id;navLinks.forEach(_0x6a84h=>_0x6a84h.classList.toggle("active",_0x6a84h.getAttribute("href")===`#${_0x6a84g}`));}});},{rootMargin:`-${(parseInt(getComputedStyle(document.documentElement).getPropertyValue("\x2d\x2d\x68\x65\x61\x64\x65\x72\x2d\x68"))||0x40)+10}px 0px -60% 0px`,threshold:0.01});sections.forEach(_0x6a84i=>obs.observe(_0x6a84i));}function escapeHtml(_0x6a84j){return String(_0x6a84j??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;");}function getAddonImageMarkup(_0x6a84k){if(_0x6a84k?.image){return`<img class="addon-icon-image" src="${escapeHtml(_0x6a84k.image)}" alt="Icono de ${escapeHtml(_0x6a84k.title||"complemento")}" loading="lazy" decoding="async" />`;}return`<span class="addon-icon-fallback">${escapeHtml(_0x6a84k?.icon||"BI")}</span>`;}function renderAddons(_0x6a84l){const _0x6a84m=$("#addonsGrid");if(!_0x6a84m)return;if(!Array.isArray(_0x6a84l)||!_0x6a84l.length){_0x6a84m.innerHTML=`
      <article class="addon-card addon-card--empty">
        <h3 class="addon-title">Próximamente más complementos</h3>
        <p class="addon-copy">Estamos preparando nuevas páginas de producto para mostrar cada herramienta con más detalle.</p>
      </article>`;return;}_0x6a84m.innerHTML=_0x6a84l.map(_0x6a84n=>{const _0x6a84o=Array.isArray(_0x6a84n.meta)?_0x6a84n.meta:[];const _0x6a84p=_0x6a84n.url||"#";const _0x6a84q=_0x6a84n.statusType==="ready"?"addon-status--ready":"";return`
      <a class="addon-card addon-card-link" href="${escapeHtml(_0x6a84p)}" aria-label="Abrir ${escapeHtml(_0x6a84n.title||"complemento")}">
        <div class="addon-header">
          <div class="addon-icon addon-icon--image">${getAddonImageMarkup(_0x6a84n)}</div>
          <div class="addon-headline">
            <span class="addon-badge">${escapeHtml(_0x6a84n.badge||"Complemento Revit")}</span>
            <h3 class="addon-title">${escapeHtml(_0x6a84n.title||"Complemento")}</h3>
          </div>
        </div>

        <p class="addon-copy">${escapeHtml(_0x6a84n.description||"")}</p>

        <div class="addon-meta">
          ${_0x6a84o.map(_0x6a84r=>`<span class="addon-chip">${escapeHtml(_0x6a84r)}</span>`).join("")}
        </div>

        <div class="addon-footer">
          <span class="addon-status ${_0x6a84q}">${escapeHtml(_0x6a84n.status||"Disponible")}</span>
          <span class="addon-link addon-link--inline">Abrir página</span>
        </div>
      </a>
    `;}).join("");}async function initAddons(){const _0x6a84s=$("#addonsGrid");if(!_0x6a84s)return;try{const _0x6a84t=await fetch("DATA/addons.json?v=3",{cache:"\x6e\x6f\x2d\x73\x74\x6f\x72\x65"});if(!_0x6a84t.ok)throw new Error("No se pudo cargar el listado de complementos.");const _0x6a84u=await _0x6a84t.json();renderAddons(_0x6a84u.addons||[]);}catch(_0x6a84v){console.error(_0x6a84v);_0x6a84s.innerHTML=`
      <article class="addon-card addon-card--empty">
        <h3 class="addon-title">No fue posible cargar los complementos</h3>
        <p class="addon-copy">Verifica la ruta del archivo de datos o vuelve a intentar más tarde.</p>
      </article>`;}}initAddons();