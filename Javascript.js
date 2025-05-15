
// Rezepte im LocalStorage speichern
function speichernRezept() {
  const rezept = {
      name: document.getElementById('name').value,
      portionen: document.getElementById('portionen').value,
      zeit: document.getElementById('zeit').value,
      schwierigkeit: document.getElementById('schwierigkeit').value,
      zutaten: document.getElementById('zutaten').value,
      zubereitung: document.getElementById('zubereitung').value,
      favorit: false,
      id: Date.now() 
  };

  let rezepte = JSON.parse(localStorage.getItem('rezepte')) || []; //JSON-String wird zu einem JavaScript-Array umgewandelt
  rezepte.push(rezept); //Das neue Rezept wird an das bestehende Array rezepte angehängt
  localStorage.setItem('rezepte', JSON.stringify(rezepte)); //aktualisierte Array wird wieder in ein String umgewandelt

  alert('Rezept erfolgreich gespeichert!'); //Popup-Fenster
  window.location.href = "Rezepte.html"; // Weiterleitung zur Rezeptseite
}

// Rezepte auf der Unterseite anzeigen
function anzeigenRezepte() {
  const rezepte = JSON.parse(localStorage.getItem('rezepte')) || []; //versucht Daten unter dem Schlüssel rezepte aus dem lokalen Speicher des Browsers zu holen
  const container = document.getElementById('rezepteContainer'); //sucht das HTML-Element mit der ID rezepteContainer

  container.innerHTML = ''; //entfernt vorherige Inhalte aus dem Container, damit Rezepte nicht doppelt erscheinen

  rezepte.forEach(rezept => { //für jedes Rezept...
      const rezeptElement = document.createElement('div'); //neues div-Element als Rezeptkarte wird erstellt
      rezeptElement.className = 'recipe-card'; 

      rezeptElement.innerHTML = `
    <h1>${rezept.name}</h1>
    <hr>
    <h3>Portionen</h3>
    <p>${rezept.portionen}</p>
    <h3>Zubereitungszeit</h3>
    <p>${rezept.zeit}</p>
    <h3>Schwierigkeit</h3>
    <p>${rezept.schwierigkeit}</p>
    <h3>Zutaten</h3>
    <p>${rezept.zutaten.replace(/\n/g, "<br>")}</p>
    <h3>Zubereitung</h3>
    <p>${rezept.zubereitung.replace(/\n/g, "<br>")}</p>
    <div class="button-group">
        <button onclick="bearbeitenRezept(${rezept.id})">Bearbeiten</button>
        <button onclick="loeschenRezept(${rezept.id})">Löschen</button>
        <button onclick="toggleFavorit(${rezept.id})">
            ${rezept.favorit ? '★ Favorit' : '☆ Favorit'}
        </button>
    </div>
`;

      container.appendChild(rezeptElement); //fügt die fertigen Rezeptkarten in den Container rezepteContainer ein
  });
}



// Rezept löschen mit Bestätigung
function loeschenRezept(id) {
  if (confirm("Möchtest du dieses Rezept wirklich löschen?")) { //Popup-Fenster
      let rezepte = JSON.parse(localStorage.getItem('rezepte')) || []; //JSON-String wird zu einem JavaScript-Array umgewandelt
      rezepte = rezepte.filter(rezept => rezept.id !== id); //erstellt ein neues Array
      localStorage.setItem('rezepte', JSON.stringify(rezepte)); //das neue Array wird wieder in ein JSON-String umgewandelt
      anzeigenRezepte(); // Neu laden/aktualisieren
  }
}


// Rezept bearbeiten
function bearbeitenRezept(id) { //eindeutige ID eines Rezeptes aufrufen
  const rezepte = JSON.parse(localStorage.getItem('rezepte')) || []; //holt alle gespei. Rezepte aus dem lok. Speicher; JSON-String wird in ein Array von Rezept-Objekten umgewandelt
  const rezept = rezepte.find(r => r.id === id); //durchsucht das Array nach dem Rezept, dessen id mit dem übergebenen Wert übereinstimmt

  if (rezept) {
      // Zu bearbeitendes Rezept separat speichern
      localStorage.setItem('bearbeitenRezept', JSON.stringify(rezept)); //speichert das gefundene Rezept unter einem neuen Schlüssel namens bearbeitenRezept
      
      // Rezept aus der Liste löschen
      rezepte.splice(rezepte.findIndex(r => r.id === id), 1); //findet den Index des Rezepts mit der entsprechenden ID und entfernt genau dieses eine Element aus dem Array, damit beim Speichern der bearbeiteten Version nicht zwei Rezepte mit demselben Namen/ID im Speicher landen
      localStorage.setItem('rezepte', JSON.stringify(rezepte)); //das neue Array wird wieder in ein JSON-String umgeandelt

      // Weiterleitung zur Formularseite
      window.location.href = "Rezeptliste.html";
  }
}


// Eventlistener für den Speichern-Button
document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.querySelector('button[type="submit"]'); //sucht nach dem Rezept speichern-Button
  if (saveButton) {
      saveButton.addEventListener('click', speichernRezept); //ein click-EventListener wird hinzugefügt und speichert dann das eingegebene Rezept

      
      const rezeptZumBearbeiten = JSON.parse(localStorage.getItem('bearbeitenRezept'));
      if (rezeptZumBearbeiten) { //alle Eingabefelder im Formular werden mit den Werten des Rezepts vorgefüllt
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
    //prüft, ob sich auf der aktuellen Seite ein Element mit der ID rezepteContainer befindet
  if (document.getElementById('rezepteContainer')) {
      anzeigenRezepte();
  }
});

function toggleFavorit(id) {
  let rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
  const index = rezepte.findIndex(r => r.id === id); //durchsucht das Array rezepte nach dem Rezept mit der passenden ID und gibt den Index/Position im Array zurück
  if (index !== -1) { //nur wenn ein gültiger Index vorhanden ist
      rezepte[index].favorit = !rezepte[index].favorit; //aktuelle Wert von favorit wird hier inventiert: true zu false, false zu true
      localStorage.setItem('rezepte', JSON.stringify(rezepte));
      anzeigenRezepte(); // Neu laden
  }
}

//Anzeige der Lieblingsrezepten
document.addEventListener('DOMContentLoaded', () => {
  const rezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
  const favoriten = rezepte.filter(r => r.favorit); //durchläuft jedes rezept, sucht Rezepte, die die Eigenschaft favorit also true haben
  const container = document.getElementById('favoritenContainer'); //HTML-Container wird über seine ID geholt

  if (favoriten.length === 0) {
      container.innerHTML = '<p>Keine Lieblingsrezepte gefunden.</p>';
  } else {
      favoriten.forEach(rezept => {
          const rezeptElement = document.createElement('div');
          rezeptElement.className = 'recipe-card';
          rezeptElement.innerHTML = `
              <h1>${rezept.name}</h1>
              <hr>
              <h3>Portionen</h3>
              <p>${rezept.portionen}</p>
              <h3>Zubereitungszeit</h3>
              <p>${rezept.zeit}</p>
              <h3>Schwierigkeit</h3>
              <p>${rezept.schwierigkeit}</p>
              <h3>Zutaten</h3>
              <p>${rezept.zutaten.replace(/\n/g, "<br>")}</p>
              <h3>Zubereitung</h3>
              <p>${rezept.zubereitung.replace(/\n/g, "<br>")}</p>
              <button class="unfavoritieren-btn" data-id="${rezept.id}">★ Aus Favoriten entfernen</button>
          `;
          container.appendChild(rezeptElement); //Rezept-Element wird in den Container eingefügt
      });

  // "Entfernen aus Favoriten"-Buttons
  document.querySelectorAll('.unfavoritieren-btn').forEach(button => { //alle mit unfavoritierten Button
  button.addEventListener('click', (e) => { //bei jedem Klick soll das untere ausgeführt werden
    const id = Number(e.target.getAttribute('data-id')); //der Wert der data-id-Attributs wird in eine Zahl umgewandelt
    let alleRezepte = JSON.parse(localStorage.getItem('rezepte')) || [];
    const index = alleRezepte.findIndex(r => r.id === id); //durchsucht das Array alleRezepte nach einem Rezept mit genau der ID, die aus dem Button stammt
    if (index !== -1) {
    alleRezepte[index].favorit = false; //wenn eins gefunden wurde: Eigenschaft favorit auf false
    localStorage.setItem('rezepte', JSON.stringify(alleRezepte));
    window.location.reload(); // Liste neu laden
    }
    });
  });
  }
});