// Charger le manifest JSON une fois
let botsManifest = [];
fetch('bots/manifest.json')
  .then(res => res.json())
  .then(data => { botsManifest = data; })
  .catch(() => { console.warn("Manifest introuvable"); });

Object.keys(bots).forEach(level => {
  const container = document.getElementById(level);
  bots[level].forEach(bot => {
    const card = document.createElement('div');
    card.className = 'card bot-card';
    if(bot.locked) card.classList.add('locked');

    card.innerHTML = `
      <img class="bot-img" src="${bot.img}" alt="${bot.name}">
      <h4>
        <img class="flag" src="https://flagsapi.com/${bot.country}/flat/64.png" alt="${bot.country}">
        ${bot.name} ${bot.locked ? '🔒' : ''}
      </h4>
      <p>Elo : ${bot.elo}</p>
    `;

    card.style.cursor = "pointer";

    card.addEventListener('click', () => {
      if(bot.locked){
        window.location.href = "Setings/locked.html";
        return;
      }

      // Normaliser le nom du bot pour le fichier
      const fileBase = bot.name
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().replace(/\s+/g, "");

      const botPage = `bots/${fileBase}.html`;
      const fallback404 = "Setings/404.html";

      // Vérifier si le fichier existe dans le manifest
      if(botsManifest.includes(`${fileBase}.html`)){
        window.location.href = botPage;
      } else {
        window.location.href = fallback404;
      }
    });

    container.appendChild(card);
  });
});



// Toggle categories
document.querySelectorAll('.category-header').forEach(header => {
    header.addEventListener('click', () => {
    const category = header.parentElement;
    category.classList.toggle('collapsed');
    });
});



document.addEventListener('DOMContentLoaded', () => {
  // Tableau des ELO des bots
  const botsElo = {
    1: 250, 
    2: 500, 
    3: 750, 
    4: 1000, 
    5: 1200,
    6: 1400, 
    7: 1600, 
    8: 1800, 
    9: 2000, 
    10: 2200,
    11: 2300, 
    12: 2400, 
    13: 2500, 
    14: 2600, 
    15: 2700,
    16: 2800, 
    17: 2900, 
    18: 3000, 
    19: 3050, 
    20: 3100,
    21: 3150, 
    22: 3180, 
    23: 3190, 
    24: 3195, 
    25: 3200
  };

  // ⚡ Contrôle admin : tu modifies ça
  let allLocked = false; // true = tout bloqué
  let lockedBots = [2000]; // ELO bloqués individuellement

  const slider = document.getElementById("botSlider");
  const valueDisplay = document.querySelector("#botValue span");
  const eloDisplay = document.getElementById("eloValue");
  const lockIcon = document.getElementById("lockIcon");
  const goBtn = document.getElementById("goBtn");
  const lockedList = document.getElementById("lockedList");

  function updateLockedList() {
    if (allLocked) {
      lockedList.textContent = "Tous les bots sont bloqués";
    } else if (lockedBots.length === 0) {
      lockedList.textContent = "Bots bloqués : —";
    } else {
      lockedList.textContent = "Bots bloqués : " + lockedBots.join(", ");
    }
  }

  function updateDisplay() {
    const botNum = slider.value;
    const elo = botsElo[botNum];

    valueDisplay.textContent = botNum;
    eloDisplay.textContent = elo ? `ELO : ${elo}` : "ELO : ?";

    if (allLocked) {
      lockIcon.textContent = "🔒 Tous verrouillés";
      lockIcon.style.color = "red";
    } else if (elo && lockedBots.includes(elo)) {
      lockIcon.textContent = "🔒 Verrouillé";
      lockIcon.style.color = "red";
    } else {
      lockIcon.textContent = "✅ Disponible";
      lockIcon.style.color = "green";
    }

    updateLockedList();
  }

  slider.addEventListener("input", updateDisplay);

  goBtn.addEventListener("click", () => {
    const botNum = slider.value;
    const elo = botsElo[botNum];
    if (!elo) {
      alert("⚠️ Numéro de bot invalide !");
      return;
    }
    if (allLocked || lockedBots.includes(elo)) {
      window.location.href = "Setings/locked.html";
    } else {
      window.location.href = `elo/elo.html?num=${botNum}&elo=${elo}`;
    }
  });

  // Initialisation
  updateDisplay();
});
