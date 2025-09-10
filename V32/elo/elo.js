document.addEventListener('DOMContentLoaded', async () => {

    const loader = document.getElementById('loader-container');
    const botPage = document.getElementById('bot-page');

    setTimeout(async () => {
        loader.style.display = 'none';
        botPage.classList.remove('hidden');

        const params = new URLSearchParams(window.location.search);
        const botName = params.get('bot') || "Bot250";

        try {
            const response = await fetch(`stats.json?cache=${new Date().getTime()}`);
            if (!response.ok) throw new Error("Impossible de charger stats.json");
            const allStats = await response.json();

            if (!allStats[botName]) {
                alert("Bot non trouvé !");
                return;
            }

            const stats = allStats[botName];

            // Affichage info bot
            document.getElementById('bot-name').textContent = botName;
            document.getElementById('bot-elo').textContent = `Elo : ${stats.elo}`;
            document.getElementById('bot-img').src = stats.country;
            document.getElementById('bot-floating').src = stats.country;

            // Stats graphiques
            updateStats(stats);

            // Jouer contre bot
            document.getElementById('playBtn').addEventListener('click', () => {
                window.open(`https://www.chess.com/play/computer/${botName}-bot`, "_blank");
            });

            // Iframe dernière partie
            const iframe = document.getElementById('lastGame');
            iframe.src = `https://www.chess.com/emboard?id=${stats.lastGame || "13817642"}`;
            window.addEventListener("message", e => {
                if(e.data && e.data.id === stats.lastGame && iframe) {
                    iframe.style.height = `${e.data.frameHeight+37}px`;
                }
            });

        } catch (error) {
            alert("Erreur: " + error.message);
        }

    }, 500);

});

function updateStats(stats) {
    const total = stats.won + stats.draw + stats.lost || 1;

    document.getElementById('won').style.width = (stats.won / total * 100) + "%";
    document.getElementById('won').textContent = stats.won;

    document.getElementById('draw').style.width = (stats.draw / total * 100) + "%";
    document.getElementById('draw').textContent = stats.draw;

    document.getElementById('lost').style.width = (stats.lost / total * 100) + "%";
    document.getElementById('lost').textContent = stats.lost;

    document.getElementById('number-won').textContent = "Gagné : " + stats.won;
    document.getElementById('number-draw').textContent = "Null : " + stats.draw;
    document.getElementById('number-lost').textContent = "Perdu : " + stats.lost;
}
