fetch('events.json')
  .then(response => response.json())
  .then(data => {

    const container = document.getElementById("tournaments-container");

    for (let key in data) {
      const tournament = data[key];

      const card = document.createElement('div');
      card.className = 'tournament-card';
      card.id = `card-${key}`;
      card.style.backgroundImage = `url(${tournament.image})`;

      // Ajouter le titre
      const title = document.createElement('h2');
      title.textContent = tournament.title || key;
      card.appendChild(title);

      // Ajouter badge LIVE
      const badge = document.createElement('div');
      badge.className = 'live-badge';
      badge.textContent = 'LIVE';
      card.appendChild(badge);

      // Si lock → icône 🔒 + redirection vers exemple.html
      if (tournament.locked) {
        card.classList.add("locked");
        card.addEventListener('click', () => {
          window.location.href = "exemple.html";
        });
      } else if (tournament.url) {
        // Sinon ouverture de la page du tournoi
        card.addEventListener('click', () => {
          window.location.href = tournament.url;
        });
      }

      container.appendChild(card);
    }

    function timeToMinutes(timeStr) {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    }

    function checkEvents() {
      const now = new Date();
      const days = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
      const today = days[now.getDay()];
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      for (let key in data) {
        const tournament = data[key];
        const card = document.getElementById(`card-${key}`);
        const badge = card.querySelector('.live-badge');

        let isLive = false;

        // Cas 1 : alwaysLive
        if (tournament.alwaysLive) {
          isLive = true;
        }

        // Cas 2 : horaires définis
        if (tournament[today]) {
          tournament[today].forEach(item => {
            const startMinutes = item.start ? timeToMinutes(item.start) : null;
            const endMinutes = item.end ? timeToMinutes(item.end) : null;
            if (startMinutes !== null && endMinutes !== null) {
              if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
                isLive = true;
              }
            }
          });
        }

        // Afficher / cacher badge LIVE
        if (isLive) {
          badge.classList.add('show');
        } else {
          badge.classList.remove('show');
        }
      }
    }

    setInterval(checkEvents, 1000);
  })
  .catch(err => console.error("Erreur JSON :", err));
