// Sélectionner tous les éléments avec la classe "locked"🔒
const locks = document.querySelectorAll(".locked");

// Créer la bulle tooltip
const tooltip = document.createElement("div");
tooltip.textContent = "Verrouillé";
document.body.appendChild(tooltip);

// Style appliqué directement en JS
Object.assign(tooltip.style, {
  position: "absolute",
  background: "black",
  color: "white",
  padding: "4px 8px",
  borderRadius: "6px",
  fontSize: "12px",
  whiteSpace: "nowrap",
  visibility: "hidden",
  opacity: "0",
  transition: "opacity 0.2s",
  zIndex: "1000"
});

// Appliquer le comportement à chaque 🔒
locks.forEach(lock => {
  lock.addEventListener("mouseenter", () => {
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";

    const rect = lock.getBoundingClientRect();
    tooltip.style.left =
      rect.left + window.scrollX + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
    tooltip.style.top =
      rect.top + window.scrollY - tooltip.offsetHeight - 6 + "px";
  });

  lock.addEventListener("mouseleave", () => {
    tooltip.style.visibility = "hidden";
    tooltip.style.opacity = "0";
  });
});
