// Charger le loader depuis loader.html
fetch('../Setings/loader/loader.html')
    .then(response => {
        if(!response.ok) throw new Error("Fichier loader.html introuvable !");
        return response.text();
    })
    .then(data => {
        document.getElementById('loader-container').innerHTML = data;

        // Cacher le loader après 2 secondes
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if(loader) loader.style.display = 'none';
        }, 2000);
    })
    .catch(err => console.error(err));