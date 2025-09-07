// Fonction pour entourer tous les 🔒 du document dans un <span>
function wrapLocks() {
  document.body.innerHTML = document.body.innerHTML.replace(/🔒/g, '<span class="auto-lock">🔒</span>');
}

// Exécuter la fonction
wrapLocks();

// Sélectionner tous les 🔒 créés
const locks = document.querySelectorAll(".auto-lock");

// Créer la bulle tooltip
const tooltip = document.createElement("div");
tooltip.textContent = "Verrouillé";
document.body.appendChild(tooltip);

// Style appliqué en JS
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
