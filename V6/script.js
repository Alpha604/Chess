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

