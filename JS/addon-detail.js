const $=(_F,_G=document)=>_G.querySelector(_F);const $$=(_H,_I=document)=>Array.from(_I.querySelectorAll(_H));const currentScript=document.currentScript||document.querySelector("script[data-source]");const source=currentScript?.dataset?.source;function safeArray(_J){return Array.isArray(_J)?_J:[];}function escapeHtml(_K){return String(_K??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;");}function normalizeYouTubeUrl(_L){if(!_L)return "";const _M=String(_L).trim();if(_M.includes("youtube.com/embed/"))return _M;try{const _N=new URL(_M);const _O=_N.hostname.replace(/^www\./,"");if(_O==="youtu.be"){const _P=_N.pathname.replace(/\//g,"");const _Q=_N.searchParams.get("si");return _P?`https://www.youtube.com/embed/${_P}${_Q?`?si=${encodeURIComponent(_Q)}`:""}`:"";}if(_O==="youtube.com"||_O==="m.youtube.com"){if(_N.pathname==="/watch"){const _R=_N.searchParams.get("v");const _S=_N.searchParams.get("si");return _R?`https://www.youtube.com/embed/${_R}${_S?`?si=${encodeURIComponent(_S)}`:""}`:"";}}}catch(_T){return _M;}return _M;}function buildPlanGrid(_U){return `
<div class="price-plan-grid">
${safeArray(_U).map(_V=>`
<article class="price-plan-card">
<span class="price-plan-term">${escapeHtml(_V.term||"")}</span>
<strong class="price-plan-amount">${escapeHtml(_V.price||"")}</strong>
<p class="price-plan-copy">${escapeHtml(_V.copy||"")}</p>
</article>
`).join("")}
</div>
`;}function renderPricing(_W){const _X=$(".price-panel");if(!_X)return;const _Y=_W?.pricing||{};const _Z=safeArray(_Y.plans);const _$=safeArray(_Y.groups||_Y.sections);const __=Boolean(_Y.isFree);const _aa=_W.ctaUrl||"https://wa.me/51968744058";const _ab=_Y.ctaLabel||_W.ctaLabel||"Solicitar complemento";if(__){_X.innerHTML=`
<span class="price-label">${escapeHtml(_Y.label||"Complemento gratuito")}</span>
<strong class="price-value">${escapeHtml(_Y.title||"Disponible sin costo")}</strong>
<p class="price-note">${escapeHtml(_Y.note||"Solicita el enlace de acceso o la demostración para empezar a usar este complemento.")}</p>
<a class="btn btn-secondary price-action" href="${escapeHtml(_aa)}" target="_blank" rel="noopener">${escapeHtml(_Y.ctaLabel||"Solicitar acceso")}</a>
`;return;}if(_$.length){_X.innerHTML=`
<span class="price-label">${escapeHtml(_Y.label||"Planes disponibles")}</span>
<div class="price-groups">
${_$.map(_ac=>`
<section class="price-group">
<div class="price-group-head">
<h4>${escapeHtml(_ac.title||"Modalidad")}</h4>
${_ac.description?`<p>${escapeHtml(_ac.description)}</p>`:""}
</div>
${_ac.quote?`
<div class="price-quote-card">
${_ac.quote.label?`<span class="price-quote-label">${escapeHtml(_ac.quote.label)}</span>`:""}
<strong class="price-quote-title">${escapeHtml(_ac.quote.title||"A convenir según el proyecto")}</strong>
${_ac.quote.copy?`<p class="price-quote-copy">${escapeHtml(_ac.quote.copy)}</p>`:""}
</div>
`:buildPlanGrid(_ac.plans)}
${safeArray(_ac.features).length?`
<ul class="price-feature-list">
${safeArray(_ac.features).map(_ad=>`<li>${escapeHtml(_ad)}</li>`).join("")}
</ul>
`:""}
${_ac.note?`<p class="price-group-note">${escapeHtml(_ac.note)}</p>`:""}
</section>
`).join("")}
</div>
${_Y.note?`<p class="price-note">${escapeHtml(_Y.note)}</p>`:""}
${safeArray(_Y.extraNotes).length?`
<div class="price-extra-notes">
${safeArray(_Y.extraNotes).map(_ae=>`<p class="price-note">${escapeHtml(_ae)}</p>`).join("")}
</div>
`:""}
<a class="btn btn-primary price-action" href="${escapeHtml(_aa)}" target="_blank" rel="noopener">${escapeHtml(_ab)}</a>
`;return;}_X.innerHTML=`
<span class="price-label">${escapeHtml(_Y.label||"Licencia individual")}</span>
${buildPlanGrid(_Z)}
<p class="price-note">${escapeHtml(_Y.note||"Solicita la activación según versión de Revit y vigencia de la licencia.")}</p>
<a class="btn btn-primary price-action" href="${escapeHtml(_aa)}" target="_blank" rel="noopener">${escapeHtml(_ab)}</a>
`;}function renderHero(_af){document.title=`${_af.title||"Complemento"} | Complemento Revit | BIM Ingenieros`;const _ag=$("#addonHeroLogoWrap");if(_ag){if(_af.heroLogo){_ag.hidden=false;_ag.innerHTML=`<img src="${escapeHtml(_af.heroLogo.src||_af.heroLogo)}" alt="${escapeHtml(_af.heroLogo.alt||(`Logo de ${_af.title||'complemento'}`))}" loading="lazy" decoding="async" />`;}else{_ag.hidden=true;_ag.innerHTML="";}}$("#heroBadge").textContent=_af.badge||"Complemento Revit";$("#addonTitle").textContent=_af.title||"Complemento";$("#benefitsTitleSuffix").textContent=_af.title||"este complemento";$("#addonSubtitle").textContent=_af.subtitle||"";$("#benefitsIntro").textContent=_af.benefitsIntro||"Conoce cómo este complemento puede integrarse a tus flujos BIM y reducir trabajo manual dentro de Revit.";$("#offerChip").textContent=_af.offerChip||"COMPLEMENTO PROFESIONAL";$("#summaryTitle").textContent=_af.summaryTitle||"Equipos BIM que buscan más control y productividad dentro de Revit";$("#summaryProblem").textContent=_af.summaryProblem||"Reduce tareas manuales y mejora el control de procesos repetitivos dentro de Revit.";$("#videoNote").textContent=_af.videoNote||"Cada tema puede enlazar su propio video de YouTube desde el JSON del complemento.";const _ah=$("#heroBenefits");if(_ah){_ah.innerHTML=safeArray(_af.heroBenefits).map(_ai=>`<li>${escapeHtml(_ai)}</li>`).join("");}const _aj=$("#addonHighlights");if(_aj){_aj.innerHTML=safeArray(_af.highlights).map(_ak=>`<span class="highlight-chip">${escapeHtml(_ak)}</span>`).join("");}const _al=$("#heroCta");if(_al&&_af.ctaUrl)_al.href=_af.ctaUrl;if(_al&&_af.ctaLabel)_al.textContent=_af.ctaLabel;renderPricing(_af);}function renderBenefits(_am){const _an=$("#benefitsGrid");if(!_an)return;_an.innerHTML=safeArray(_am.benefits).map((_ao,_ap)=>`
<article class="benefit-card">
<div class="benefit-card-icon">${String(_ap+1).padStart(2,"0")}</div>
<h3>${escapeHtml(_ao.title)}</h3>
<p>${escapeHtml(_ao.text)}</p>
</article>
`).join("");}function renderWorkflow(_aq){const _ar=$("#workflowGrid");if(!_ar)return;_ar.innerHTML=safeArray(_aq.workflow).map(_as=>`
<article class="workflow-card">
<span class="workflow-step">Paso ${escapeHtml(_as.step)}</span>
<h3>${escapeHtml(_as.title)}</h3>
<p>${escapeHtml(_as.text)}</p>
</article>
`).join("");}function buildVideoMarkup(_at,_au){const _av=normalizeYouTubeUrl(_at?.embedUrl||_at?.videoUrl);if(_av){return `
<div class="video-content-scroll has-video">
<div class="video-frame-wrap">
<iframe
title="${escapeHtml(_at?.title||"Visor de videos del complemento")}"
src="${_av}"
loading="lazy"
allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
allowfullscreen>
</iframe>
</div>
<div class="video-content-info">
<h3 id="videoTitle">${escapeHtml(_at?.title||"Video")}</h3>
<p id="videoDescription">${escapeHtml(_at?.description||"")}</p>
</div>
</div>
`;}return `
<div class="video-empty-state">
<span class="video-chip">Contenido en preparación</span>
<h3 id="videoTitle">${escapeHtml(_at?.title||"Video")}</h3>
<p id="videoDescription">${escapeHtml(_at?.description||"Estamos dejando preparado este visor para publicar los videos de uso del complemento con una presentación profesional y ordenada.")}</p>
<a class="btn btn-secondary" href="${escapeHtml(_au)}" target="_blank" rel="noopener">Solicitar acceso o demo</a>
</div>
`;}function setVideo(_aw,_ax){const _ay=$("#videoStage");if(!_ay)return;_ay.innerHTML=buildVideoMarkup(_aw,_ax);const _az=$("#videoDuration");if(_az)_az.textContent=_aw?.duration||"Demo en video";}function renderPlaylist(_aA){const _aB=$("#videoPlaylist");if(!_aB)return;const _aC=safeArray(_aA.videos);const _aD=_aA.ctaUrl||"https://wa.me/51968744058";if(!_aC.length){_aB.innerHTML=`
<div class="playlist-item active">
<span class="playlist-item-title">Aún no hay videos cargados</span>
<span class="playlist-item-copy">Puedes agregar más adelante tutoriales, demos o recorridos técnicos desde el JSON.</span>
</div>
`;setVideo({title:"Videos próximamente",description:"Este espacio está listo para recibir el contenido audiovisual del complemento."},_aD);return;}_aB.innerHTML=_aC.map((_aE,_aF)=>`
<button class="playlist-item ${_aF===0?"active":""}" type="button" data-index="${_aF}" aria-label="Abrir ${escapeHtml(_aE.title)}">
<span class="playlist-item-title">${escapeHtml(_aE.title)}</span>
<span class="playlist-item-copy">${escapeHtml(_aE.description)}</span>
<span class="playlist-item-time">${escapeHtml(_aE.duration||"Demo en video")}</span>
</button>
`).join("");setVideo(_aC[0],_aD);$$(".playlist-item",_aB).forEach(_aG=>{_aG.addEventListener("click",()=>{const _aH=Number(_aG.dataset.index);$$(".playlist-item",_aB).forEach(_aI=>_aI.classList.remove("active"));_aG.classList.add("active");setVideo(_aC[_aH],_aD);});});}async function init(){if(!source)return;try{const _aJ=await fetch(source,{cache:"no-store"});if(!_aJ.ok)throw new Error("No se pudo cargar la información del complemento.");const _aK=await _aJ.json();renderHero(_aK);renderBenefits(_aK);renderWorkflow(_aK);renderPlaylist(_aK);}catch(_aL){console.error(_aL);const _aM=$("#benefitsGrid");if(_aM){_aM.innerHTML=`
<article class="benefit-card">
<h3>No fue posible cargar el contenido</h3>
<p>Recarga la página o revisa la ruta del archivo JSON del complemento.</p>
</article>
`;}}}init();