document.addEventListener('DOMContentLoaded', async () => {
    const loader = document.getElementById('loader-container');
    const botPage = document.getElementById('bot-page');
    const bug = document.getElementById('bug');

    // Fonction pour afficher les messages d'erreur
    function showBugMessage(message) {
        const bug = document.getElementById('bug');
        if (!bug) return;

        bug.textContent = "❌ " + message;
        bug.classList.add('active');

        // Disparaît après 5 secondes
        setTimeout(() => {
            bug.classList.remove('active');
            bug.textContent = "";
        }, 5000);
    }

    setTimeout(async () => {
        if (loader) loader.style.display = 'none';
        if (botPage) botPage.classList.remove('hidden');

        // Récupérer le numéro et l'elo depuis l'URL
        const params = new URLSearchParams(window.location.search);
        const botNum = params.get('num')?.toString() || "1";
        const botEloParam = params.get('elo');

        try {
            const response = await fetch(`stats.json?cache=${new Date().getTime()}`);
            if (!response.ok) throw new Error("Impossible de charger stats.json");
            const allStats = await response.json();

            const bot = allStats[botNum];
            if (!bot) throw new Error("Bot non trouvé !");

            // Affichage infos
            const botNameEl = document.getElementById('bot-name');
            const botEloEl = document.getElementById('bot-elo');
            const botImgEl = document.getElementById('bot-img');
            const botFloatingEl = document.getElementById('bot-floating');

            if (botNameEl) botNameEl.textContent = bot.name;
            if (botEloEl) botEloEl.textContent = `Elo : ${botEloParam || bot.elo}`;
            if (botImgEl) botImgEl.src = bot.country;
            if (botFloatingEl) botFloatingEl.src = bot.country;

            // Statistiques graphiques
            updateStats(bot);

            // Bouton jouer
            const playBtn = document.getElementById('playBtn');
            if (playBtn) {
                playBtn.addEventListener('click', () => {
                    window.open(`https://www.chess.com/play/computer/${bot.name}-bot`, "_blank");
                });
            }

            // Iframe dernière partie
            const iframe = document.getElementById('lastGame');
            if (iframe) {
                iframe.src = `https://www.chess.com/emboard?id=${bot.lastGame || "13817642"}`;
                window.addEventListener("message", e => {
                    if (e.data && e.data.id === bot.lastGame && iframe) {
                        iframe.style.height = `${e.data.frameHeight + 37}px`;
                    }
                });
            }

        } catch (err) {
            showBugMessage(err.message);
        }
    }, 500);
});

// Fonction pour mettre à jour les statistiques graphiques
function updateStats(bot) {
    const total = bot.won + bot.draw + bot.lost || 1;

    const wonBar = document.getElementById('won');
    const drawBar = document.getElementById('draw');
    const lostBar = document.getElementById('lost');

    if (wonBar) { wonBar.style.width = (bot.won / total * 100) + "%"; wonBar.textContent = bot.won; }
    if (drawBar) { drawBar.style.width = (bot.draw / total * 100) + "%"; drawBar.textContent = bot.draw; }
    if (lostBar) { lostBar.style.width = (bot.lost / total * 100) + "%"; lostBar.textContent = bot.lost; }

    const numberWon = document.getElementById('number-won');
    const numberDraw = document.getElementById('number-draw');
    const numberLost = document.getElementById('number-lost');

    if (numberWon) numberWon.textContent = "Gagné : " + bot.won;
    if (numberDraw) numberDraw.textContent = "Null : " + bot.draw;
    if (numberLost) numberLost.textContent = "Perdu : " + bot.lost;
}
