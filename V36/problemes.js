let fileData = [];
let currentPath = [];

async function loadFiles() {
  const res = await fetch("files.json");
  fileData = await res.json();
  openFolder([]);
}

function getNode(path, node) {
  let n = { children: node };
  for (const part of path) {
    n = n.children.find(c => c.name === part && c.type === "folder");
  }
  return n;
}

function openFolder(path) {
  currentPath = path;
  const node = getNode(path, fileData);
  renderBreadcrumb();
  renderGrid(node ? node.children : []);
}

function renderBreadcrumb() {
  const breadcrumb = document.getElementById("breadcrumb");
  breadcrumb.innerHTML = "";
  const root = document.createElement("span");
  root.textContent = "🏠 Racine";
  root.onclick = () => openFolder([]);
  breadcrumb.appendChild(root);

  currentPath.forEach((part, i) => {
    const sep = document.createElement("span"); sep.textContent = " › ";
    breadcrumb.appendChild(sep);
    const span = document.createElement("span");
    span.textContent = part;
    span.onclick = () => openFolder(currentPath.slice(0, i + 1));
    breadcrumb.appendChild(span);
  });
}

function renderGrid(children) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  if (!children || children.length === 0) {
    grid.innerHTML = "<div class='explorer__empty'>📂 Dossier vide</div>";
    return;
  }
  children.forEach(c => {
    const tile = document.createElement("div");
    tile.className = "explorer__tile";
    tile.textContent = (c.type === "folder" ? "📁 " : "📄 ") + c.name;
    tile.onclick = () => {
      if (c.type === "folder") openFolder(currentPath.concat(c.name));
      else openFile(c);
    };
    grid.appendChild(tile);
  });
}

function openFile(file) {
  const popup = document.getElementById("popup");
  const popupBody = document.getElementById("popupBody");
  popupBody.innerHTML = `
    <div class="popup-header">
      <span>${file.name}</span>
      <button class="popup-close" id="popupClose">✖</button>
    </div>
    <iframe src="${file.url}" allowtransparency="true"></iframe>
  `;
  document.getElementById("popupClose").onclick = () => popup.style.display = "none";
  popup.style.display = "flex";
}

window.onload = loadFiles;
