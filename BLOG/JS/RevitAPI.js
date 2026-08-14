// Fecha "última actualización" (solo demo)
const t = document.getElementById("updated");
if (t){
  const d = new Date();
  t.textContent = d.toLocaleDateString(undefined, { year:"numeric", month:"short", day:"2-digit" });
}

// Copiar ruta
document.querySelector(".copy-btn")?.addEventListener("click", () => {
  const target = document.querySelector("#copyTarget");
  if (!target) return;
  const text = target.textContent.trim();
  navigator.clipboard?.writeText(text).then(() => {
    const btn = document.querySelector(".copy-btn");
    const old = btn.textContent;
    btn.textContent = "¡Copiado!";
    setTimeout(() => btn.textContent = old, 1200);
  });
});
