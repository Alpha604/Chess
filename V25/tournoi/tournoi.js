// ----------------------------
// Charger le fichier JSON
// ----------------------------
fetch('events.json')
  .then(response => response.json())
  .then(data => {

    function timeToMinutes(timeStr) {
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + m;
    }

    function checkEvents() {
      const now = new Date();
      const days = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
      const today = days[now.getDay()];

      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      let messages = [];

      for (let event in data) {
        if (data[event][today]) {
          data[event][today].forEach(item => {
            const startMinutes = timeToMinutes(item.start);
            const endMinutes = timeToMinutes(item.end);
            if (currentMinutes >= startMinutes && currentMinutes <= endMinutes) {
              messages.push(item.message);
            }
          });
        }
      }

      const messageDiv = document.getElementById("message");
      messageDiv.innerHTML = messages.join('<br>') || '';

      // Affichage debug : heure actuelle
      const timeDiv = document.getElementById("current-time");
      if(timeDiv) timeDiv.textContent = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    }

    setInterval(checkEvents, 1000);
  })
  .catch(err => console.error("Erreur JSON :", err));
