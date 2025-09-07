document.addEventListener('DOMContentLoaded', async () => {

    setTimeout(async () => {
        // Masquer le loader et afficher la page
        const loader = document.getElementById('loader-container');
        loader.style.display = 'none';
        document.getElementById('bot-page').classList.remove('hidden');

        // Récupérer le nom du bot depuis l'URL
        const params = new URLSearchParams(window.location.search);
        const botName = params.get('bot') || "Janjay";

        try {
            // Charger les stats avec cache-busting
            const response = await fetch(`stats.json?cache=${new Date().getTime()}`);
            if (!response.ok) throw new Error("Impossible de charger stats.json");
            const allStats = await response.json();

            if (allStats[botName]) {
                const stats = allStats[botName];

                // Afficher le nom et le drapeau
                const botNameContainer = document.getElementById('bot-name');
                botNameContainer.innerHTML = `
                    <img src="${stats.country}" alt="Drapeau de ${botName}" class="bot-flag">
                    <span>${botName}</span>
                `;



                // Afficher l'Elo
                document.getElementById('bot-elo').textContent = "Elo: " + stats.elo;

                // Mettre à jour les statistiques
                updateStats(stats);
            } else {
                alert("Bot non trouvé !");
            }
        } catch (error) {
            alert("Erreur: " + error.message);
        }
    }, 1000);
});


function updateStats(stats) {
    const total = stats.won + stats.draw + stats.lost || 1; // éviter division par zéro

    document.getElementById('won').style.width = (stats.won / total * 100) + "%";
    document.getElementById('won').textContent = stats.won;
    document.getElementById('number-won').textContent = "Gagné : " + stats.won;

    document.getElementById('draw').style.width = (stats.draw / total * 100) + "%";
    document.getElementById('draw').textContent = stats.draw;
    document.getElementById('number-draw').textContent = "Null : " + stats.draw;

    document.getElementById('lost').style.width = (stats.lost / total * 100) + "%";
    document.getElementById('lost').textContent = stats.lost;
    document.getElementById('number-lost').textContent = "Perdu : " + stats.lost;
}

function playBot() {
    window.open(`https://www.chess.com/play/computer/Janjay-bot`, "_blank");
}
