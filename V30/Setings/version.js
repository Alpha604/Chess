fetch("version.json")
  .then(response => response.json())
  .then(data => {
    document.getElementById("site-version").textContent = data.version;
  });
