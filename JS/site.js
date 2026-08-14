const siteNavToggle = document.querySelector("#navToggle");
const siteNavMenu = document.querySelector("#navMenu");
const siteNavPanel = document.querySelector("#navPanel");

function setSiteMenu(open) {
  document.body.classList.toggle("menu-open", open);
  siteNavMenu?.classList.toggle("open", open);
  siteNavPanel?.classList.toggle("open", open);
  siteNavToggle?.setAttribute("aria-expanded", String(open));
  siteNavPanel?.setAttribute("aria-hidden", String(!open));

  if (open) {
    siteNavMenu?.querySelector("a")?.focus();
  }
}

siteNavToggle?.addEventListener("click", () => {
  setSiteMenu(!siteNavMenu?.classList.contains("open"));
});

siteNavPanel?.addEventListener("click", () => setSiteMenu(false));

siteNavMenu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) setSiteMenu(false);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && siteNavMenu?.classList.contains("open")) {
    setSiteMenu(false);
    siteNavToggle?.focus();
  }
});

document.querySelectorAll("[data-current-year]").forEach((element) => {
  element.textContent = new Date().getFullYear();
});
