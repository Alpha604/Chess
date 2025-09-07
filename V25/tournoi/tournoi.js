// Charger le fichier JSON
fetch('events.json')
  .then(response => response.json())
  .then(data => {

    // --- MODIFIER ICI POUR TEST ---
    // format "HH:MM" pour simuler l'heure
    let simulatedTime = null; // ex: "18:30" ou null pour utiliser l'heure réelle

    function checkEvents() {
      const now = new Date();
      const days = ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];
      const today = days[now.getDay()];

      const hour = now.getHours().toString().padStart(2,'0');
      const minute = now.getMinutes().toString().padStart(2,'0');
      const second = now.getSeconds().toString().padStart(2,'0');

      // Si on simule, utiliser simulatedTime, sinon heure réelle
      const currentTime = simulatedTime ? simulatedTime : `${hour}:${minute}`;

      // Afficher l'heure actuelle pour debug
      const timeDiv = document.getElementById("current-time");
      if(timeDiv) {
        timeDiv.textContent = simulatedTime ? simulatedTime + " (simulée)" : `${hour}:${minute}:${second}`;
      }

      let messages = [];

      for (let event in data) {
        if (data[event][today]) {
          data[event][today].forEach(item => {
            if (currentTime >= item.start && currentTime <= item.end) {
              messages.push(item.message);
            }
          });
        }
      }

      const messageDiv = document.getElementById("message");
      if (messages.length > 0) {
        messageDiv.innerHTML = messages.join('<br>');
      } else {
        messageDiv.innerHTML = '';
      }

      console.log(`Vérification à ${currentTime}, messages:`, messages);
    }

    setInterval(checkEvents, 1000);
  })
  .catch(err => console.error("Erreur lors du chargement du JSON :", err));
