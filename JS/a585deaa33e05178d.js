const $=(_0x914e0,_0x914e1=document)=>_0x914e1 .querySelector(_0x914e0);const $$=(_0x914e2,_0x914e3=document)=>Array.from(_0x914e3 .querySelectorAll(_0x914e2));const currentScript=document.currentScript||document.querySelector("script[data-source]");const source=currentScript?.dataset?.source;function safeArray(_0x914e4){return Array.isArray(_0x914e4)?_0x914e4:[];}function escapeHtml(_0x914e5){return String(_0x914e5??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;").replace(/'/g,"&#39;");}function normalizeYouTubeUrl(_0x914e6){if(!_0x914e6)return"";const _0x914e7=String(_0x914e6).trim();if(_0x914e7 .includes("youtube.com/embed/"))return _0x914e7;try{const _0x914e8=new URL(_0x914e7);const _0x914e9=_0x914e8 .hostname.replace(/^www\./,"");if(_0x914e9==="youtu.be"){const _0x914ea=_0x914e8 .pathname.replace(/\//g,"");const _0x914eb=_0x914e8 .searchParams.get("si");return _0x914ea?`https://www.youtube.com/embed/${_0x914ea}${_0x914eb?`?si=${encodeURIComponent(_0x914eb)}`:""}`:"";}if(_0x914e9==="youtube.com"||_0x914e9==="\x6d\x2e\x79\x6f\x75\x74\x75\x62\x65\x2e\x63\x6f\x6d"){if(_0x914e8 .pathname==="/watch"){const _0x914ec=_0x914e8 .searchParams.get("v");const _0x914ed=_0x914e8 .searchParams.get("si");return _0x914ec?`https://www.youtube.com/embed/${_0x914ec}${_0x914ed?`?si=${encodeURIComponent(_0x914ed)}`:""}`:"";}}}catch(_0x914ee){return _0x914e7;}return _0x914e7;}function buildPlanGrid(_0x914ef){return`
    <div class="price-plan-grid">
      ${safeArray(_0x914ef).map(_0x914eg=>`
        <article class="price-plan-card">
          <span class="price-plan-term">${escapeHtml(_0x914eg.term||"")}</span>
          <strong class="price-plan-amount">${escapeHtml(_0x914eg.price||"")}</strong>
          <p class="price-plan-copy">${escapeHtml(_0x914eg.copy||"")}</p>
        </article>
      `).join("")}
    </div>
  `;}function renderPricing(_0x914eh){const _0x914ei=$(".price-panel");if(!_0x914ei)return;const _0x914ej=_0x914eh?.pricing||{};const _0x914ek=safeArray(_0x914ej.plans);const _0x914el=safeArray(_0x914ej.groups||_0x914ej.sections);const _0x914em=Boolean(_0x914ej.isFree);const _0x914en=_0x914eh.ctaUrl||"https://wa.me/51968744058";const _0x914eo=_0x914ej.ctaLabel||_0x914eh.ctaLabel||"Solicitar complemento";if(_0x914em){_0x914ei.innerHTML=`
      <span class="price-label">${escapeHtml(_0x914ej.label||"Complemento gratuito")}</span>
      <strong class="price-value">${escapeHtml(_0x914ej.title||"\x44\x69\x73\x70\x6f\x6e\x69\x62\x6c\x65\x20\x73\x69\x6e\x20\x63\x6f\x73\x74\x6f")}</strong>
      <p class="price-note">${escapeHtml(_0x914ej.note||"Solicita el enlace de acceso o la demostración para empezar a usar este complemento.")}</p>
      <a class="btn btn-secondary price-action" href="${escapeHtml(_0x914en)}" target="_blank" rel="noopener">${escapeHtml(_0x914ej.ctaLabel||"Solicitar acceso")}</a>
    `;return;}if(_0x914el.length){_0x914ei.innerHTML=`
      <span class="price-label">${escapeHtml(_0x914ej.label||"\x50\x6c\x61\x6e\x65\x73\x20\x64\x69\x73\x70\x6f\x6e\x69\x62\x6c\x65\x73")}</span>
      <div class="price-groups">
        ${_0x914el.map(_0x914ep=>`
          <section class="price-group">
            <div class="price-group-head">
              <h4>${escapeHtml(_0x914ep.title||"Modalidad")}</h4>
              ${_0x914ep.description?`<p>${escapeHtml(_0x914ep.description)}</p>`:""}
            </div>
            ${_0x914ep.quote?`
              <div class="price-quote-card">
                ${_0x914ep.quote.label?`<span class="price-quote-label">${escapeHtml(_0x914ep.quote.label)}</span>`:""}
                <strong class="price-quote-title">${escapeHtml(_0x914ep.quote.title||"A convenir según el proyecto")}</strong>
                ${_0x914ep.quote.copy?`<p class="price-quote-copy">${escapeHtml(_0x914ep.quote.copy)}</p>`:""}
              </div>
            `:buildPlanGrid(_0x914ep.plans)}
            ${safeArray(_0x914ep.features).length?`
              <ul class="price-feature-list">
                ${safeArray(_0x914ep.features).map(_0x914eq=>`<li>${escapeHtml(_0x914eq)}</li>`).join("")}
              </ul>
            `:""}
            ${_0x914ep.note?`<p class="price-group-note">${escapeHtml(_0x914ep.note)}</p>`:""}
          </section>
        `).join("")}
      </div>
      ${_0x914ej.note?`<p class="price-note">${escapeHtml(_0x914ej.note)}</p>`:""}
      ${safeArray(_0x914ej.extraNotes).length?`
        <div class="price-extra-notes">
          ${safeArray(_0x914ej.extraNotes).map(_0x914er=>`<p class="price-note">${escapeHtml(_0x914er)}</p>`).join("")}
        </div>
      `:""}
      <a class="btn btn-primary price-action" href="${escapeHtml(_0x914en)}" target="_blank" rel="noopener">${escapeHtml(_0x914eo)}</a>
    `;return;}_0x914ei.innerHTML=`
    <span class="price-label">${escapeHtml(_0x914ej.label||"\x4c\x69\x63\x65\x6e\x63\x69\x61\x20\x69\x6e\x64\x69\x76\x69\x64\x75\x61\x6c")}</span>
    ${buildPlanGrid(_0x914ek)}
    <p class="price-note">${escapeHtml(_0x914ej.note||"Solicita la activación según versión de Revit y vigencia de la licencia.")}</p>
    <a class="btn btn-primary price-action" href="${escapeHtml(_0x914en)}" target="_blank" rel="noopener">${escapeHtml(_0x914eo)}</a>
  `;}function renderHero(_0x914es){document.title=`${_0x914es.title||"Complemento"} | Complemento Revit | BIM Ingenieros`;const _0x914et=$("#addonHeroLogoWrap");if(_0x914et){if(_0x914es.heroLogo){_0x914et.hidden=false;_0x914et.innerHTML=`<img src="${escapeHtml(_0x914es.heroLogo.src||_0x914es.heroLogo)}" alt="${escapeHtml(_0x914es.heroLogo.alt||(`Logo de ${_0x914es.title||'complemento'}`))}" loading="lazy" decoding="async" />`;}else{_0x914et.hidden=true;_0x914et.innerHTML="";}}$("#heroBadge").textContent=_0x914es.badge||"Complemento Revit";$("#addonTitle").textContent=_0x914es.title||"Complemento";$("#benefitsTitleSuffix").textContent=_0x914es.title||"este complemento";$("#addonSubtitle").textContent=_0x914es.subtitle||"";$("#benefitsIntro").textContent=_0x914es.benefitsIntro||"\x43\x6f\x6e\x6f\x63\x65\x20\x63\xf3\x6d\x6f\x20\x65\x73\x74\x65\x20\x63\x6f\x6d\x70\x6c\x65\x6d\x65\x6e\x74\x6f\x20\x70\x75\x65\x64\x65\x20\x69\x6e\x74\x65\x67\x72\x61\x72\x73\x65\x20\x61\x20\x74\x75\x73\x20\x66\x6c\x75\x6a\x6f\x73\x20\x42\x49\x4d\x20\x79\x20\x72\x65\x64\x75\x63\x69\x72\x20\x74\x72\x61\x62\x61\x6a\x6f\x20\x6d\x61\x6e\x75\x61\x6c\x20\x64\x65\x6e\x74\x72\x6f\x20\x64\x65\x20\x52\x65\x76\x69\x74\x2e";$("#offerChip").textContent=_0x914es.offerChip||"COMPLEMENTO PROFESIONAL";$("#summaryTitle").textContent=_0x914es.summaryTitle||"Equipos BIM que buscan más control y productividad dentro de Revit";$("#summaryProblem").textContent=_0x914es.summaryProblem||"\x52\x65\x64\x75\x63\x65\x20\x74\x61\x72\x65\x61\x73\x20\x6d\x61\x6e\x75\x61\x6c\x65\x73\x20\x79\x20\x6d\x65\x6a\x6f\x72\x61\x20\x65\x6c\x20\x63\x6f\x6e\x74\x72\x6f\x6c\x20\x64\x65\x20\x70\x72\x6f\x63\x65\x73\x6f\x73\x20\x72\x65\x70\x65\x74\x69\x74\x69\x76\x6f\x73\x20\x64\x65\x6e\x74\x72\x6f\x20\x64\x65\x20\x52\x65\x76\x69\x74\x2e";$("#videoNote").textContent=_0x914es.videoNote||"Cada tema puede enlazar su propio video de YouTube desde el JSON del complemento.";const _0x914eu=$("#heroBenefits");if(_0x914eu){_0x914eu.innerHTML=safeArray(_0x914es.heroBenefits).map(_0x914ev=>`<li>${escapeHtml(_0x914ev)}</li>`).join("");}const _0x914ew=$("#addonHighlights");if(_0x914ew){_0x914ew.innerHTML=safeArray(_0x914es.highlights).map(_0x914ex=>`<span class="highlight-chip">${escapeHtml(_0x914ex)}</span>`).join("");}const _0x914ey=$("#heroCta");if(_0x914ey&&_0x914es.ctaUrl)_0x914ey.href=_0x914es.ctaUrl;if(_0x914ey&&_0x914es.ctaLabel)_0x914ey.textContent=_0x914es.ctaLabel;renderPricing(_0x914es);}function renderBenefits(_0x914ez){const _0x914e10=$("\x23\x62\x65\x6e\x65\x66\x69\x74\x73\x47\x72\x69\x64");if(!_0x914e10)return;_0x914e10 .innerHTML=safeArray(_0x914ez.benefits).map((_0x914e11,_0x914e12)=>`
    <article class="benefit-card">
      <div class="benefit-card-icon">${String(_0x914e12+1).padStart(2,"0")}</div>
      <h3>${escapeHtml(_0x914e11 .title)}</h3>
      <p>${escapeHtml(_0x914e11 .text)}</p>
    </article>
  `).join("");}function renderWorkflow(_0x914e13){const _0x914e14=$("\x23\x77\x6f\x72\x6b\x66\x6c\x6f\x77\x47\x72\x69\x64");if(!_0x914e14)return;_0x914e14 .innerHTML=safeArray(_0x914e13 .workflow).map(_0x914e15=>`
    <article class="workflow-card">
      <span class="workflow-step">Paso ${escapeHtml(_0x914e15 .step)}</span>
      <h3>${escapeHtml(_0x914e15 .title)}</h3>
      <p>${escapeHtml(_0x914e15 .text)}</p>
    </article>
  `).join("");}function buildVideoMarkup(_0x914e16,_0x914e17){const _0x914e18=normalizeYouTubeUrl(_0x914e16?.embedUrl||_0x914e16?.videoUrl);if(_0x914e18){return`
      <div class="video-content-scroll has-video">
        <div class="video-frame-wrap">
          <iframe
            title="${escapeHtml(_0x914e16?.title||"Visor de videos del complemento")}"
            src="${_0x914e18}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div>
        <div class="video-content-info">
          <h3 id="videoTitle">${escapeHtml(_0x914e16?.title||"Video")}</h3>
          <p id="videoDescription">${escapeHtml(_0x914e16?.description||"")}</p>
        </div>
      </div>
    `;}return`
    <div class="video-empty-state">
      <span class="video-chip">Contenido en preparación</span>
      <h3 id="videoTitle">${escapeHtml(_0x914e16?.title||"Video")}</h3>
      <p id="videoDescription">${escapeHtml(_0x914e16?.description||"Estamos dejando preparado este visor para publicar los videos de uso del complemento con una presentación profesional y ordenada.")}</p>
      <a class="btn btn-secondary" href="${escapeHtml(_0x914e17)}" target="_blank" rel="noopener">Solicitar acceso o demo</a>
    </div>
  `;}function setVideo(_0x914e19,_0x914e1a){const _0x914e1b=$("#videoStage");if(!_0x914e1b)return;_0x914e1b.innerHTML=buildVideoMarkup(_0x914e19,_0x914e1a);const _0x914e1c=$("#videoDuration");if(_0x914e1c)_0x914e1c.textContent=_0x914e19?.duration||"\x44\x65\x6d\x6f\x20\x65\x6e\x20\x76\x69\x64\x65\x6f";}function renderPlaylist(_0x914e1d){const _0x914e1e=$("\x23\x76\x69\x64\x65\x6f\x50\x6c\x61\x79\x6c\x69\x73\x74");if(!_0x914e1e)return;const _0x914e1f=safeArray(_0x914e1d.videos);const _0x914e1g=_0x914e1d.ctaUrl||"https://wa.me/51968744058";if(!_0x914e1f.length){_0x914e1e.innerHTML=`
      <div class="playlist-item active">
        <span class="playlist-item-title">Aún no hay videos cargados</span>
        <span class="playlist-item-copy">Puedes agregar más adelante tutoriales, demos o recorridos técnicos desde el JSON.</span>
      </div>
    `;setVideo({title:"Videos próximamente",description:"Este espacio está listo para recibir el contenido audiovisual del complemento."},_0x914e1g);return;}_0x914e1e.innerHTML=_0x914e1f.map((_0x914e1h,_0x914e1i)=>`
    <button class="playlist-item ${_0x914e1i===0?"active":""}" type="button" data-index="${_0x914e1i}" aria-label="Abrir ${escapeHtml(_0x914e1h.title)}">
      <span class="playlist-item-title">${escapeHtml(_0x914e1h.title)}</span>
      <span class="playlist-item-copy">${escapeHtml(_0x914e1h.description)}</span>
      <span class="playlist-item-time">${escapeHtml(_0x914e1h.duration||"\x44\x65\x6d\x6f\x20\x65\x6e\x20\x76\x69\x64\x65\x6f")}</span>
    </button>
  `).join("");setVideo(_0x914e1f[0],_0x914e1g);$$("\x2e\x70\x6c\x61\x79\x6c\x69\x73\x74\x2d\x69\x74\x65\x6d",_0x914e1e).forEach(_0x914e1j=>{_0x914e1j.addEventListener("click",()=>{const _0x914e1k=Number(_0x914e1j.dataset.index);$$("\x2e\x70\x6c\x61\x79\x6c\x69\x73\x74\x2d\x69\x74\x65\x6d",_0x914e1e).forEach(_0x914e1l=>_0x914e1l.classList.remove("active"));_0x914e1j.classList.add("active");setVideo(_0x914e1f[_0x914e1k],_0x914e1g);});});}async function init(){if(!source)return;try{const _0x914e1m=await fetch(source,{cache:"\x6e\x6f\x2d\x73\x74\x6f\x72\x65"});if(!_0x914e1m.ok)throw new Error("No se pudo cargar la información del complemento.");const _0x914e1n=await _0x914e1m.json();renderHero(_0x914e1n);renderBenefits(_0x914e1n);renderWorkflow(_0x914e1n);renderPlaylist(_0x914e1n);}catch(_0x914e1o){console.error(_0x914e1o);const _0x914e1p=$("\x23\x62\x65\x6e\x65\x66\x69\x74\x73\x47\x72\x69\x64");if(_0x914e1p){_0x914e1p.innerHTML=`
        <article class="benefit-card">
          <h3>No fue posible cargar el contenido</h3>
          <p>Recarga la página o revisa la ruta del archivo JSON del complemento.</p>
        </article>
      `;}}}init();