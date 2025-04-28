
// Rezepte im LocalStorage speichern
function speichernRezept() {
  const rezept = {
      name: document.getElementById('name').value,
      portionen: document.getElementById('portionen').value,
      zeit: document.getElementById('zeit').value,
      schwierigkeit: document.getElementById('schwierigkeit').value,
      zutaten: document.getElementById('zutaten').value,
      zubereitung: document.getElementById('zubereitung').value,
      id: Date.now() // Einzigartige ID
  };

  let rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
  rezepte.push(rezept);
  localStorage.setItem('rezepte', JSON.stringify(rezepte));

  alert('Rezept erfolgreich gespeichert!');
  window.location.href = "Rezepte.html"; // Weiterleitung zur Rezeptseite
}

// Rezepte auf der Unterseite anzeigen
function anzeigenRezepte() {
  const rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
  const container = document.getElementById('rezepteContainer');

  container.innerHTML = '';

  rezepte.forEach(rezept => {
      const rezeptElement = document.createElement('div');
      rezeptElement.className = 'recipe-card'; // <<-- wichtig!

      rezeptElement.innerHTML = `
          <h2>${rezept.name}</h2>
          <hr>
          <p><strong>Portionen:</strong> ${rezept.portionen}</p>
          <p><strong>Zubereitungszeit:</strong> ${rezept.zeit}</p>
          <p><strong>Schwierigkeit:</strong> ${rezept.schwierigkeit}</p>
          <h3>Zutaten</h3>
          <p>${rezept.zutaten.replace(/\n/g, "<br>")}</p>
          <h3>Zubereitung</h3>
          <p>${rezept.zubereitung.replace(/\n/g, "<br>")}</p>
          <div class="button-group">
              <button onclick="bearbeitenRezept(${rezept.id})">Bearbeiten</button>
              <button onclick="loeschenRezept(${rezept.id})">Löschen</button>
          </div>
      `;
      container.appendChild(rezeptElement);
  });
}



// Rezept löschen mit Bestätigung
function loeschenRezept(id) {
  if (confirm("Möchtest du dieses Rezept wirklich löschen?")) {
      let rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
      rezepte = rezepte.filter(rezept => rezept.id !== id);
      localStorage.setItem('rezepte', JSON.stringify(rezepte));
      anzeigenRezepte(); // Neu laden
  }
}


// Rezept bearbeiten
function bearbeitenRezept(id) {
  const rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
  const rezept = rezepte.find(r => r.id === id);

  if (rezept) {
      // Zu bearbeitendes Rezept separat speichern
      localStorage.setItem('bearbeitenRezept', JSON.stringify(rezept));
      
      // Rezept aus der Liste löschen
      rezepte.splice(rezepte.findIndex(r => r.id === id), 1);
      localStorage.setItem('rezepte', JSON.stringify(rezepte));

      // Weiterleitung zur Formularseite
      window.location.href = "Rezeptliste.html";
  }
}


// Eventlistener für den Speichern-Button
document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.querySelector('button[type="submit"]');
  if (saveButton) {
      saveButton.addEventListener('click', speichernRezept);

      
      const rezeptZumBearbeiten = JSON.parse(localStorage.getItem('bearbeitenRezept'));
      if (rezeptZumBearbeiten) {
          document.getElementById('name').value = rezeptZumBearbeiten.name;
          document.getElementById('portionen').value = rezeptZumBearbeiten.portionen;
          document.getElementById('zeit').value = rezeptZumBearbeiten.zeit;
          document.getElementById('schwierigkeit').value = rezeptZumBearbeiten.schwierigkeit;
          document.getElementById('zutaten').value = rezeptZumBearbeiten.zutaten;
          document.getElementById('zubereitung').value = rezeptZumBearbeiten.zubereitung;

          // Wenn fertig geladen, löschen wir den Bearbeiten-Modus wieder
          localStorage.removeItem('bearbeitenRezept');
      }
  }

  if (document.getElementById('rezepteContainer')) {
      anzeigenRezepte();
  }
});
