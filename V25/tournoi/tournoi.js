// ----------------------------
// Données des événements
// ----------------------------
const data = {
  "GrandSwiss": {
    "Dimanche": [
      { "start": "17:05", "end": "17:06", "message": "GrandSwiss commence maintenant ! 🎉" }
    ]
  },
  "Tournoi2": {
    "Dimanche": [
      { "start": "16:16", "end": "16:21", "message": "Tournoi 2 : préparez-vous 🏆" }
    ]
  }
};

// ----------------------------
// Fonction pour convertir HH:MM en minutes depuis minuit
// ----------------------------
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

// ----------------------------
// Vérification des événements
// ----------------------------
function checkEvents() {
  const now = new Date();
  const days = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
  const today = days[now.getDay()]; // jour actuel

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

// ----------------------------
// Lancer la vérification toutes les secondes
// ----------------------------
setInterval(checkEvents, 1000);
