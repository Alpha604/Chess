let fileData = {};
let currentPath = [];
let activeFile = null; // pour suivre le fichier actif

// Charger le JSON
async function loadFiles() {
  const res = await fetch("files.json"); // Assure-toi que ce fichier existe
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
      };

      container.appendChild(item);

      const sub = document.createElement("div");
      sub.className = "explorer__tree-children";
      sub.style.display = "none"; // fermé par défaut
      renderTree(sub, child, path.concat(child.name));
      container.appendChild(sub);

    } else {
      item.innerHTML = `📄 ${child.name}`;
      if (activeFile && activeFile.name === child.name) {
        item.classList.add("active"); // surbrillance
      }
      item.onclick = (e) => {
        e.stopPropagation();
        openFile(child, path);
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
      tile.onclick = () => openFile(child, currentPath);
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
async function openFile(file, filePath) {
  activeFile = file;
  expandToFile(filePath, file.name);

  const popup = document.getElementById("popup");
  const popupBody = document.getElementById("popupBody");

  // Vérifie l'extension
  const ext = file.name.split('.').pop().toLowerCase();

  if (ext === "html") {
    // Fichier HTML -> iframe
    popupBody.innerHTML = `
      <div class="popup-header" style="height:50px; display:flex; justify-content:space-between; align-items:center; padding:0 10px; background:#071026; border-bottom:1px solid rgba(255,255,255,0.06);">
        <span class="popup-title">${file.name}</span>
        <button id="popupClose" style="background:none; border:none; color:#e6eef8; font-size:18px; cursor:pointer;">✖</button>
      </div>
      <iframe id="${file.name}" src="${file.url}" allowtransparency="true" frameborder="0" style="width:100%; height:calc(100% - 50px);"></iframe>
    `;
  } else if (ext === "txt") {
    // Fichier TXT -> fetch et afficher texte
    let textContent = "";
    try {
      const res = await fetch(file.url);
      textContent = await res.text();
    } catch (err) {
      textContent = "Impossible de charger le fichier.";
    }

    popupBody.innerHTML = `
      <div class="popup-header" style="height:50px; display:flex; justify-content:space-between; align-items:center; padding:0 10px; background:#071026; border-bottom:1px solid rgba(255,255,255,0.06);">
        <span class="popup-title">${file.name}</span>
        <button id="popupClose" style="background:none; border:none; color:#e6eef8; font-size:18px; cursor:pointer;">✖</button>
      </div>
      <div style="padding:10px; color:#e6eef8; overflow:auto; height:calc(100% - 50px); white-space:pre-wrap; font-family:monospace;">${textContent}</div>
    `;
  } else {
    return; // ignore les autres types
  }

  document.getElementById("popupClose").onclick = () => {
    popup.style.display = "none";
    popupBody.innerHTML = "";
    activeFile = null;
    renderTree(document.getElementById("tree"), fileData, []);
  };

  popup.style.display = "flex";
}

// --- Fonction pour déplier jusqu’au fichier ---
function expandToFile(path, fileName) {
  const tree = document.getElementById("tree");
  renderTree(tree, fileData, []);
  let node = fileData;
  let container = tree;
  path.forEach(part => {
    let folderNode = node.children.find(c => c.name === part && c.type === "folder");
    if (folderNode) {
      const allItems = container.querySelectorAll(".explorer__tree-item");
      allItems.forEach((item, idx) => {
        if (item.textContent.includes(part)) {
          const sub = item.nextSibling;
          if (sub && sub.classList.contains("explorer__tree-children")) {
            sub.style.display = "block";
            container = sub;
          }
        }
      });
      node = folderNode;
    }
  });
  renderTree(tree, fileData, []);
}

// --- Initialisation ---
window.addEventListener("DOMContentLoaded", () => {
  loadFiles();
});
