// footer.js

// Contenu HTML du Footer
const footerHTML = `
<div class="footer-bottom">
  <div class="footer-center">© Roméo LEONARD | 2025</div>
  <div id="site-version"></div>
</div>

<style>
  .footer-bottom {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px;
    background: #0f172a;
    font-size: 14px;
    border-top: 1px solid #334155;
    color: #e2e8f0;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10000;
  }

  .footer-center {
    flex: 1;
    text-align: center;
  }

  #site-version {
    position: absolute;
    right: 50px;
  }
</style>
`;

// Fonction pour injecter le footer dans le body
function injectFooter() {
    document.body.insertAdjacentHTML('beforeend', footerHTML);

    // Récupère le chemin complet
    let path = window.location.pathname;

    // Découpe en dossiers
    let parts = path.split("/").filter(Boolean);

    // Cherche le premier dossier contenant un chiffre
    let versionFolder = parts.find(part => /\d/.test(part));

    if (versionFolder) {
        document.getElementById("site-version").textContent = versionFolder;
    } else {
        document.getElementById("site-version").textContent = "Version inconnue";
    }
}

// Appel automatique
injectFooter();
