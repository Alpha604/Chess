// Fonction pour entourer 🔒 dans des spans
function wrapLocksInSpans(node) {
  if (node.nodeType === 3) { // texte
    if (node.nodeValue.includes('🔒')) {
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(🔒)/).forEach(part => {
        if (part === '🔒') {
          const span = document.createElement('span');
          span.textContent = '🔒';
          span.className = 'auto-lock';
          frag.appendChild(span);
        } else {
          frag.appendChild(document.createTextNode(part));
        }
      });
      node.parentNode.replaceChild(frag, node);
    }
  } else if (node.nodeType === 1 && node.tagName !== 'SCRIPT' && node.tagName !== 'STYLE') {
    Array.from(node.childNodes).forEach(wrapLocksInSpans);
  }
}

// Créer la bulle tooltip
const tooltip = document.createElement("div");
tooltip.textContent = "Verrouillé";
document.body.appendChild(tooltip);

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

// Fonction qui (ré)attache les events aux 🔒
function attachTooltip() {
  document.querySelectorAll('.auto-lock').forEach(lock => {
    if (lock.dataset.tooltipReady) return; // éviter doublons
    lock.dataset.tooltipReady = "1";

    lock.style.cursor = "pointer";

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
}

// Observer les changements du DOM
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      wrapLocksInSpans(node);
    });
  });
  attachTooltip();
});

// Lancer l’observateur sur tout le body
observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Première passe sur la page déjà chargée
wrapLocksInSpans(document.body);
attachTooltip();
