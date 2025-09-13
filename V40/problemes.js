let fileData = {};
let currentPath = [];
let activeFile = null;

// --- Charger les fichiers depuis JSON ---
async function loadFiles() {
  const res = await fetch("files.json");
  fileData = await res.json();
  renderTree(document.getElementById("tree"), fileData, []);
  openFolder([]); // afficher la racine
}

// --- Sidebar : Arborescence ---
function renderTree(container, node, path) {
  container.innerHTML = "";
  node.children.forEach(child => {
    const item = document.createElement("div");
    item.className = "explorer__tree-item";

    if (child.type === "folder") {
      item.innerHTML = `📁 ${child.name}`;
      item.onclick = e => {
        e.stopPropagation();
        const sub = item.nextSibling;
        if (sub) sub.style.display = sub.style.display === "none" ? "block" : "none";
      };

      container.appendChild(item);

      const sub = document.createElement("div");
      sub.className = "explorer__tree-children";
      sub.style.display = "none"; // fermé par défaut
      renderTree(sub, child, path.concat(child.name));
      container.appendChild(sub);

    } else { // fichier
      item.innerHTML = `📄 ${child.name}`;
      if (activeFile && activeFile.name === child.name) item.classList.add("active");
      item.onclick = e => {
        e.stopPropagation();
        openFile(child, path);
      };
      container.appendChild(item);
    }
  });
}

// --- Contenu central ---
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

// --- Popup pour fichiers ---
function openFile(file, filePath) {
  activeFile = file;

  expandToFile(filePath, file.name);

  const popup = document.getElementById("popup");
  const popupBody = document.getElementById("popupBody");

  let contentHTML = '';
  if (file.type === "txt") {
    contentHTML = `<pre class="txt-content">${file.content || ""}</pre>`;
  } else { // iframe ou autre URL
    contentHTML = `<iframe id="${file.name}" src="${file.url}" allowtransparency="true"></iframe>`;
  }

  popupBody.innerHTML = `
    <div class="popup-header">
      <span class="popup-title">${file.name}</span>
      <button id="popupClose">✖</button>
    </div>
    <div class="popup-content">
      ${contentHTML}
    </div>
  `;

  document.getElementById("popupClose").onclick = () => {
    popup.style.display = "none";
    popupBody.innerHTML = "";
    activeFile = null;
    renderTree(document.getElementById("tree"), fileData, []);
  };

  popup.style.display = "flex";
}

// --- Déplier sidebar jusqu’au fichier ---
function expandToFile(path, fileName) {
  const tree = document.getElementById("tree");
  renderTree(tree, fileData, []);

  let node = fileData;
  let container = tree;
  path.forEach(part => {
    let folderNode = node.children.find(c => c.name === part && c.type === "folder");
    if (folderNode) {
      const allItems = container.querySelectorAll(".explorer__tree-item");
      allItems.forEach((item) => {
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
window.addEventListener("DOMContentLoaded", loadFiles);
