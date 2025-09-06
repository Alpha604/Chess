document.addEventListener('DOMContentLoaded', async () => {

    setTimeout(async () => {
        loader.style.display = 'none';
        document.getElementById('bot-page').classList.remove('hidden');

        // Récupérer le nom du bot depuis l'URL
        const params = new URLSearchParams(window.location.search);
        const botName = params.get('bot') || "Janjay";

        try {
            // Cache busting pour toujours prendre la dernière version du JSON
            const response = await fetch(`stats.json?cache=${new Date().getTime()}`);
            if (!response.ok) throw new Error("Impossible de charger stats.json");
            const allStats = await response.json();

            if (allStats[botName]) {
                const stats = allStats[botName];
                document.getElementById('bot-name').textContent = botName;
                document.getElementById('bot-elo').textContent = "Elo: " + stats.elo;
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
    const total = stats.won + stats.draw + stats.lost;

    document.getElementById('won').style.width = (stats.won / total * 100) + "%";
    document.getElementById('won').textContent = stats.won;

    document.getElementById('number-won').textContent = "Gagné :" + stats.won;

    document.getElementById('draw').style.width = (stats.draw / total * 100) + "%";
    document.getElementById('draw').textContent = stats.draw;

    document.getElementById('number-draw').textContent = "Null :" + stats.draw;

    document.getElementById('lost').style.width = (stats.lost / total * 100) + "%";
    document.getElementById('lost').textContent = stats.lost;

    document.getElementById('number-lost').textContent = "Perdu :" + stats.lost
}

function playBot() {
    window.open("https://www.chess.com/play/computer/Janjay-bot", "_blank");
}
