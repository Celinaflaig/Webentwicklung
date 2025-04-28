document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("rezeptForm");
  const editingIndex = sessionStorage.getItem("editIndex");

  // Rezept speichern (neu oder bearbeitet)
  if (form) {
    if (editingIndex !== null) {
      const rezepte = JSON.parse(localStorage.getItem("rezepte")) || [];
      const rezept = rezepte[editingIndex];
      document.getElementById("name").value = rezept.name;
      document.getElementById("portionen").value = rezept.portionen;
      document.getElementById("zeit").value = rezept.zeit;
      document.getElementById("schwierigkeit").value = rezept.schwierigkeit;
      document.getElementById("zutaten").value = rezept.zutaten;
      document.getElementById("zubereitung").value = rezept.zubereitung;
    }

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const rezept = {
        name: document.getElementById("name").value,
        portionen: document.getElementById("portionen").value,
        zeit: document.getElementById("zeit").value,
        schwierigkeit: document.getElementById("schwierigkeit").value,
        zutaten: document.getElementById("zutaten").value,
        zubereitung: document.getElementById("zubereitung").value,
      };

      let rezepte = JSON.parse(localStorage.getItem("rezepte")) || [];

      if (editingIndex !== null) {
        rezepte[editingIndex] = rezept;
        sessionStorage.removeItem("editIndex");
      } else {
        rezepte.push(rezept);
      }

      localStorage.setItem("rezepte", JSON.stringify(rezepte));
      window.location.href = "rezepte.html";
    });
  }

  // Anzeige auf Rezeptseite
  const container = document.getElementById("rezeptContainer");
  if (container) {
    const rezepte = JSON.parse(localStorage.getItem("rezepte")) || [];

    rezepte.forEach((r, index) => {
      const div = document.createElement("div");
      div.className = "rezept";
      div.innerHTML = `
        <h2>${r.name}</h2>
        <p><strong>Portionen:</strong> ${r.portionen} | <strong>Zubereitungszeit:</strong> ${r.zeit} | <strong>Schwierigkeit:</strong> ${r.schwierigkeit}</p>
        <h4>Zutaten:</h4>
        <p>${r.zutaten.replace(/\n/g, "<br>")}</p>
        <h4>Zubereitung:</h4>
        <p>${r.zubereitung.replace(/\n/g, "<br>")}</p>
        <button onclick="bearbeiten(${index})">Bearbeiten</button>
        <button onclick="loeschen(${index})">Löschen</button>
      `;
      container.appendChild(div);
    });
  }

  // Lieblingsrezepte auf Startseite
  const lieblings = document.getElementById("lieblingsRezepte");
  if (lieblings) {
    const rezepte = JSON.parse(localStorage.getItem("rezepte")) || [];
    rezepte.slice(0, 3).forEach((r) => {
      const div = document.createElement("div");
      div.className = "rezept";
      div.innerHTML = `<strong>${r.name}</strong><p>${r.zutaten.split("\n")[0]}</p><a href="rezepte.html">Zum Rezept</a>`;
      lieblings.appendChild(div);
    });
  }
});

// Globale Funktionen (außerhalb DOMContentLoaded)
function bearbeiten(index) {
  sessionStorage.setItem("editIndex", index);
  window.location.href = "neu.html";
}

function loeschen(index) {
  const rezepte = JSON.parse(localStorage.getItem("rezepte")) || [];
  if (confirm("Willst du dieses Rezept wirklich löschen?")) {
    rezepte.splice(index, 1);
    localStorage.setItem("rezepte", JSON.stringify(rezepte));
    window.location.reload();
  }
}
