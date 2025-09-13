let fileData = {};
let activeFile = null;

async function loadFiles() {
  const res = await fetch("files.json");
  fileData = await res.json();
  renderTree(document.getElementById("tree"), fileData, []);
  openFolder([]);
}

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
        sub.style.display = (sub.style.display === "none" ? "block" : "none");
      };
      container.appendChild(item);

      const sub = document.createElement("div");
      sub.className = "explorer__tree-children";
      renderTree(sub, child, path.concat(child.name));
      container.appendChild(sub);
    } else {
      item.innerHTML = `📄 ${child.name}`;
      if (activeFile && activeFile.name === child.name) item.classList.add("active");
      item.onclick = (e) => { e.stopPropagation(); openFile(child); };
      container.appendChild(item);
    }
  });
}

function openFolder(path) {
  const node = getNode(path, fileData);
  renderBreadcrumb(path);
  renderGrid(node.children || []);
}

function getNode(path, node) {
  let n = node;
  for (const part of path) n = n.children.find(c => c.name===part && c.type==="folder");
  return n;
}

function renderBreadcrumb(path) {
  const breadcrumb = document.getElementById("breadcrumb");
  breadcrumb.innerHTML = "";
  const root = document.createElement("span");
  root.textContent = "🏠 Racine";
  root.onclick = () => openFolder([]);
  breadcrumb.appendChild(root);

  path.forEach((p,i)=>{
    const sep=document.createElement("span"); sep.textContent=" › "; breadcrumb.appendChild(sep);
    const span=document.createElement("span"); span.textContent=p; span.onclick=()=>openFolder(path.slice(0,i+1));
    breadcrumb.appendChild(span);
  });
}

function renderGrid(children) {
  const grid = document.getElementById("grid");
  grid.innerHTML = "";
  if(!children||children.length===0){ grid.innerHTML="<div class='explorer__empty'>📂 Dossier vide</div>"; return; }
  children.forEach(c=>{
    const tile=document.createElement("div"); tile.className="explorer__tile";
    tile.innerHTML = `<div class="icon">${c.type==="folder"?"📁":"📄"}</div><div class="name">${c.name}</div><div class="meta">${c.type==="folder"?"Dossier":"Fichier"}</div>`;
    tile.onclick = ()=> c.type==="folder"? openFolder(currentPath.concat(c.name)) : openFile(c);
    grid.appendChild(tile);
  });
}

function openFile(file) {
  activeFile = file;
  const popup = document.getElementById("popup");
  const popupBody = document.getElementById("popupBody");
  popupBody.innerHTML = `<div class="popup-header"><span>${file.name}</span><button class="popup-close" id="popupClose">✖</button></div><iframe src="${file.url}" allowtransparency="true"></iframe>`;
  document.getElementById("popupClose").onclick = ()=> popup.style.display="none";
  popup.style.display="flex";
}

window.onload = loadFiles;
