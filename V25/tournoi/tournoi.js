fetch('events.json')
  .then(response => response.json())
  .then(data => {

    const container = document.getElementById("tournaments-container");

    // Créer les cartes pour chaque tournoi
    for (let tournament in data) {
      const card = document.createElement('div');
      card.className = 'tournament-card';
      card.id = `card-${tournament}`;

      const title = document.createElement('h2');
      title.textContent = tournament;
      card.appendChild(title);

      // Badge live
      const badge = document.createElement('div');
      badge.className = 'live-badge';
      badge.textContent = 'LIVE';
      card.appendChild(badge);

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

      for (let tournament in data) {
        const card = document.getElementById(`card-${tournament}`);
        const badge = card.querySelector('.live-badge');

        let isLive = false;

        if (data[tournament][today]) {
          data[tournament][today].forEach(item => {
            const startMinutes = timeToMinutes(item.start);
            const endMinutes = timeToMinutes(item.end);
            if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
              isLive = true;
            }
          });
        }

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
