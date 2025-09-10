document.addEventListener('DOMContentLoaded', async () => {
    const loader = document.getElementById('loader-container');
    const botPage = document.getElementById('bot-page');

    setTimeout(async () => {
        loader.style.display = 'none';
        botPage.classList.remove('hidden');

        // Récupérer le numéro et l'elo depuis l'URL
        const params = new URLSearchParams(window.location.search);
        const botNum = params.get('num') || "1";
        const botElo = params.get('elo') || "0";

        try {
            const response = await fetch(`stats.json?cache=${new Date().getTime()}`);
            if (!response.ok) throw new Error("Impossible de charger stats.json");
            const allStats = await response.json();

            const bot = allStats[botNum];
            if(!bot){
                alert("Bot non trouvé !");
                return;
            }

            // Afficher infos du bot
            document.getElementById('bot-name').textContent = bot.name;
            document.getElementById('bot-elo').textContent = `Elo : ${botElo || bot.elo}`;
            document.getElementById('bot-img').src = bot.country;
            document.getElementById('bot-floating').src = bot.country;

            // Afficher stats
            updateStats(bot);

            // Bouton jouer
            document.getElementById('playBtn').addEventListener('click', () => {
                window.open(`https://www.chess.com/play/computer/${bot.name}-bot`, "_blank");
            });

            // Iframe dernière partie
            const iframe = document.getElementById('lastGame');
            iframe.src = `https://www.chess.com/emboard?id=${bot.lastGame || "13817642"}`;
            window.addEventListener("message", e => {
                if(e.data && e.data.id === bot.lastGame && iframe) {
                    iframe.style.height = `${e.data.frameHeight+37}px`;
                }
            });

        } catch(error){
            alert("Erreur: " + error.message);
        }

    }, 500);
});

function updateStats(bot){
    const total = bot.won + bot.draw + bot.lost || 1;

    document.getElementById('won').style.width = (bot.won / total * 100) + "%";
    document.getElementById('won').textContent = bot.won;

    document.getElementById('draw').style.width = (bot.draw / total * 100) + "%";
    document.getElementById('draw').textContent = bot.draw;

    document.getElementById('lost').style.width = (bot.lost / total * 100) + "%";
    document.getElementById('lost').textContent = bot.lost;

    document.getElementById('number-won').textContent = "Gagné : " + bot.won;
    document.getElementById('number-draw').textContent = "Null : " + bot.draw;
    document.getElementById('number-lost').textContent = "Perdu : " + bot.lost;
}
