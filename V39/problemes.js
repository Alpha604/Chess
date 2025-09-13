let fileData = {};
let currentPath = [];
let activeFile = null; // fichier actif

// Charger le JSON
async function loadFiles() {
  const res = await fetch("files.json");
  fileData = await res.json();
  renderTree(document.getElementById("tree"), fileData, []);
  openFolder([]); // affiche la racine
}

// --- Arborescence (sidebar) ---
function renderTree(container, node, path) {
  container.innerHTML = "";
  node.children.forEach(child => {
    const item = document.createElement("div");
    item.className = "explorer__tree-item";

    if (child.type === "folder") {
      item.innerHTML = `📁 ${child.name}`;
      item.onclick = (e) => {
        e.stopPropagation();
        const sub = item.nextSibling;
        if (sub) sub.style.display = (sub.style.display === "none") ? "block" : "none";
        openFolder(path.concat(child.name)); // ouvrir dossier au centre
      };

      container.appendChild(item);

      const sub = document.createElement("div");
      sub.className = "explorer__tree-children";
      sub.style.display = "none"; // fermé par défaut
      renderTree(sub, child, path.concat(child.name));
      container.appendChild(sub);

    } else {
      item.innerHTML = `📄 ${child.name}`;
      if (activeFile && activeFile.name === child.name) item.classList.add("active");
      item.onclick = (e) => {
        e.stopPropagation();
        openFile(child);
      };
      container.appendChild(item);
    }
  });
}

// --- Contenu principal ---
function openFolder(path) {
  currentPath = path;
  const node = getNode(path);
  renderBreadcrumb();
  renderGrid(node);
}

function getNode(path) {
  let node = fileData;
  for (const part of path) {
    node = node.children.find(c => c.name === part && c.type === "folder");
    if (!node) return null;
  }
  return node;
}

function renderGrid(node) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  if (!node || !node.children || node.children.length === 0) {
    grid.innerHTML = `<div class="explorer__empty">📂 Dossier vide</div>`;
    return;
  }

  node.children.forEach(child => {
    const tile = document.createElement("div");
    tile.className = "explorer__tile";

    if (child.type === "folder") {
      tile.innerHTML = `
        <div class="icon">📁</div>
        <div class="name">${child.name}</div>
        <div class="meta">Dossier</div>
      `;
      tile.onclick = () => openFolder(currentPath.concat(child.name));
    } else {
      tile.innerHTML = `
        <div class="icon">📄</div>
        <div class="name">${child.name}</div>
        <div class="meta">Fichier</div>
      `;
      tile.onclick = () => openFile(child);
    }
    grid.appendChild(tile);
  });
}

// --- Fil d'Ariane ---
function renderBreadcrumb() {
  const breadcrumb = document.getElementById("breadcrumb");
  breadcrumb.innerHTML = "";
  const root = document.createElement("span");
  root.textContent = "🏠 Racine";
  root.style.cursor = "pointer";
  root.onclick = () => openFolder([]);
  breadcrumb.appendChild(root);

  currentPath.forEach((part, i) => {
    const span = document.createElement("span");
    span.textContent = " › " + part;
    span.style.cursor = "pointer";
    span.onclick = () => openFolder(currentPath.slice(0, i + 1));
    breadcrumb.appendChild(span);
  });
}

// --- Popup pour ouvrir fichier ---
function openFile(file) {
  activeFile = file;

  const popup = document.getElementById("popup");
  const popupBody = document.getElementById("popupBody");

  let contentHTML = "";

  // 🔹 TXT ou autre
  if (file.name.endsWith(".txt") && file.content) {
    contentHTML = `<pre class="txt-content">${file.content}</pre>`;
  } else if (file.url) {
    contentHTML = `<iframe src="${file.url}" allowtransparency="true"></iframe>`;
  } else {
    contentHTML = `<div style="padding:20px;">Aucun contenu à afficher</div>`;
  }

  popupBody.innerHTML = `
    <div class="popup-header">
      <span>${file.name}</span>
      <button class="popup-close" id="popupClose">✖</button>
    </div>
    ${contentHTML}
  `;

  document.getElementById("popupClose").onclick = () => {
    popup.style.display = "none";
    popupBody.innerHTML = "";
    activeFile = null;
  };

  popup.style.display = "flex";
}

// --- Initialisation ---
window.onload = () => loadFiles();
