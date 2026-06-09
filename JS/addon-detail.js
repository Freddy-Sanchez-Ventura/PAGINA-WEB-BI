const $  = (s, c=document) => c.querySelector(s);
const $$ = (s, c=document) => Array.from(c.querySelectorAll(s));

const currentScript = document.currentScript || document.querySelector("script[data-source]");
const source = currentScript?.dataset?.source;

function safeArray(value){
  return Array.isArray(value) ? value : [];
}

function escapeHtml(value){
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function normalizeYouTubeUrl(url){
  if (!url) return "";
  const clean = String(url).trim();

  if (clean.includes("youtube.com/embed/")) return clean;

  try{
    const parsed = new URL(clean);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be"){
      const videoId = parsed.pathname.replace(/\//g, "");
      const extra = parsed.searchParams.get("si");
      return videoId ? `https://www.youtube.com/embed/${videoId}${extra ? `?si=${encodeURIComponent(extra)}` : ""}` : "";
    }

    if (host === "youtube.com" || host === "m.youtube.com"){
      if (parsed.pathname === "/watch"){
        const videoId = parsed.searchParams.get("v");
        const extra = parsed.searchParams.get("si");
        return videoId ? `https://www.youtube.com/embed/${videoId}${extra ? `?si=${encodeURIComponent(extra)}` : ""}` : "";
      }
    }
  } catch (error){
    return clean;
  }

  return clean;
}

function renderPricing(data){
  const panel = $(".price-panel");
  if (!panel) return;

  const pricing = data?.pricing || {};
  const plans = safeArray(pricing.plans);
  const isFree = Boolean(pricing.isFree);

  if (isFree){
    panel.innerHTML = `
      <span class="price-label">${escapeHtml(pricing.label || "Complemento gratuito")}</span>
      <strong class="price-value">${escapeHtml(pricing.title || "Disponible sin costo")}</strong>
      <p class="price-note">${escapeHtml(pricing.note || "Solicita el enlace de acceso o la demostración para empezar a usar este complemento.")}</p>
      <a class="btn btn-secondary price-action" href="${escapeHtml(data.ctaUrl || "https://wa.me/51968744058")}" target="_blank" rel="noopener">${escapeHtml(pricing.ctaLabel || "Solicitar acceso")}</a>
    `;
    return;
  }

  panel.innerHTML = `
    <span class="price-label">${escapeHtml(pricing.label || "Licencia individual")}</span>
    <div class="price-plan-grid">
      ${plans.map(plan => `
        <article class="price-plan-card">
          <span class="price-plan-term">${escapeHtml(plan.term || "")}</span>
          <strong class="price-plan-amount">${escapeHtml(plan.price || "")}</strong>
          <p class="price-plan-copy">${escapeHtml(plan.copy || "")}</p>
        </article>
      `).join("")}
    </div>
    <p class="price-note">${escapeHtml(pricing.note || "Solicita la activación según versión de Revit y vigencia de la licencia.")}</p>
    <a class="btn btn-primary price-action" href="${escapeHtml(data.ctaUrl || "https://wa.me/51968744058")}" target="_blank" rel="noopener">${escapeHtml(pricing.ctaLabel || "Solicitar complemento")}</a>
  `;
}

function renderHero(data){
  document.title = `${data.title || "Complemento"} | Complemento Revit | BIM Ingenieros`;
  $("#heroBadge").textContent = data.badge || "Complemento Revit";
  $("#addonTitle").textContent = data.title || "Complemento";
  $("#benefitsTitleSuffix").textContent = data.title || "este complemento";
  $("#addonSubtitle").textContent = data.subtitle || "";
  $("#benefitsIntro").textContent = data.benefitsIntro || "Conoce cómo este complemento puede integrarse a tus flujos BIM y reducir trabajo manual dentro de Revit.";
  $("#offerChip").textContent = data.offerChip || "COMPLEMENTO PROFESIONAL";
  $("#summaryTitle").textContent = data.summaryTitle || "Equipos BIM que buscan más control y productividad dentro de Revit";
  $("#summaryProblem").textContent = data.summaryProblem || "Reduce tareas manuales y mejora el control de procesos repetitivos dentro de Revit.";
  $("#videoNote").textContent = data.videoNote || "Cada tema puede enlazar su propio video de YouTube desde el JSON del complemento.";

  const heroBenefits = $("#heroBenefits");
  if (heroBenefits){
    heroBenefits.innerHTML = safeArray(data.heroBenefits).map(item => `<li>${escapeHtml(item)}</li>`).join("");
  }

  const highlights = $("#addonHighlights");
  if (highlights){
    highlights.innerHTML = safeArray(data.highlights).map(item => `<span class="highlight-chip">${escapeHtml(item)}</span>`).join("");
  }

  const heroCta = $("#heroCta");
  if (heroCta && data.ctaUrl) heroCta.href = data.ctaUrl;
  if (heroCta && data.ctaLabel) heroCta.textContent = data.ctaLabel;

  renderPricing(data);
}

function renderBenefits(data){
  const grid = $("#benefitsGrid");
  if (!grid) return;

  grid.innerHTML = safeArray(data.benefits).map((item, index) => `
    <article class="benefit-card">
      <div class="benefit-card-icon">${String(index + 1).padStart(2, "0")}</div>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join("");
}

function renderWorkflow(data){
  const grid = $("#workflowGrid");
  if (!grid) return;

  grid.innerHTML = safeArray(data.workflow).map(item => `
    <article class="workflow-card">
      <span class="workflow-step">Paso ${escapeHtml(item.step)}</span>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
    </article>
  `).join("");
}

function buildVideoMarkup(video, fallbackHref){
  const embedUrl = normalizeYouTubeUrl(video?.embedUrl || video?.videoUrl);

  if (embedUrl){
    return `
      <div class="video-content-scroll has-video">
        <div class="video-frame-wrap">
          <iframe
            title="${escapeHtml(video?.title || "Visor de videos del complemento")}"
            src="${embedUrl}"
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowfullscreen>
          </iframe>
        </div>
        <div class="video-content-info">
          <h3 id="videoTitle">${escapeHtml(video?.title || "Video")}</h3>
          <p id="videoDescription">${escapeHtml(video?.description || "")}</p>
        </div>
      </div>
    `;
  }

  return `
    <div class="video-empty-state">
      <span class="video-chip">Contenido en preparación</span>
      <h3 id="videoTitle">${escapeHtml(video?.title || "Video")}</h3>
      <p id="videoDescription">${escapeHtml(video?.description || "Estamos dejando preparado este visor para publicar los videos de uso del complemento con una presentación profesional y ordenada.")}</p>
      <a class="btn btn-secondary" href="${escapeHtml(fallbackHref)}" target="_blank" rel="noopener">Solicitar acceso o demo</a>
    </div>
  `;
}

function setVideo(video, fallbackHref){
  const stage = $("#videoStage");
  if (!stage) return;
  stage.innerHTML = buildVideoMarkup(video, fallbackHref);
  const duration = $("#videoDuration");
  if (duration) duration.textContent = video?.duration || "Demo en video";
}

function renderPlaylist(data){
  const playlist = $("#videoPlaylist");
  if (!playlist) return;

  const videos = safeArray(data.videos);
  const fallbackHref = data.ctaUrl || "https://wa.me/51968744058";

  if (!videos.length){
    playlist.innerHTML = `
      <div class="playlist-item active">
        <span class="playlist-item-title">Aún no hay videos cargados</span>
        <span class="playlist-item-copy">Puedes agregar más adelante tutoriales, demos o recorridos técnicos desde el JSON.</span>
      </div>
    `;
    setVideo(
      {
        title: "Videos próximamente",
        description: "Este espacio está listo para recibir el contenido audiovisual del complemento."
      },
      fallbackHref
    );
    return;
  }

  playlist.innerHTML = videos.map((video, index) => `
    <button class="playlist-item ${index === 0 ? "active" : ""}" type="button" data-index="${index}" aria-label="Abrir ${escapeHtml(video.title)}">
      <span class="playlist-item-title">${escapeHtml(video.title)}</span>
      <span class="playlist-item-copy">${escapeHtml(video.description)}</span>
      <span class="playlist-item-time">${escapeHtml(video.duration || "Demo en video")}</span>
    </button>
  `).join("");

  setVideo(videos[0], fallbackHref);

  $$(".playlist-item", playlist).forEach(button => {
    button.addEventListener("click", () => {
      const index = Number(button.dataset.index);
      $$(".playlist-item", playlist).forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      setVideo(videos[index], fallbackHref);
    });
  });
}

async function init(){
  if (!source) return;

  try {
    const res = await fetch(source, { cache: "no-store" });
    if (!res.ok) throw new Error("No se pudo cargar la información del complemento.");

    const data = await res.json();

    renderHero(data);
    renderBenefits(data);
    renderWorkflow(data);
    renderPlaylist(data);
  } catch (error) {
    console.error(error);
    const grid = $("#benefitsGrid");
    if (grid){
      grid.innerHTML = `
        <article class="benefit-card">
          <h3>No fue posible cargar el contenido</h3>
          <p>Recarga la página o revisa la ruta del archivo JSON del complemento.</p>
        </article>
      `;
    }
  }
}

init();
