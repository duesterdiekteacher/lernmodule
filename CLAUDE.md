# Hinweise für Claude

## Aufbau
- `index.html`: Startseite. Auswahl des Bereichs: Metall oder SHK.
- `metall/index.html` und `shk/index.html`: Übersicht der Themen pro Bereich, mit einer Karte pro Thema.
- Jedes Thema hat einen eigenen Ordner direkt im Hauptverzeichnis (z. B. `/werkstofftechnik-stahl/`), mit einer `index.html` als Themenseite und den Varianten (komplett, kompakt, nur Quiz).
- Die Bereichsseiten verlinken die Themen mit `../themenordner/`. Neue Karten kommen an die Markierung `NEUE THEMEN HIER EINFÜGEN`.

## Vorlage
- `csharp-vererbung/` ist nur die Vorlage für Aufbau und Design neuer Module.
- Sie wird auf keiner Übersicht verlinkt und bekommt keinen eigenen Bereich. Nicht löschen.
- Die drei Dateien im Hauptverzeichnis (`csharp_vererbung_schulung_*.html`) sind nur Weiterleitungen für alte Links.

## Bei jedem neuen Modul
- Vorher fragen, zu welchem Bereich es gehört: Metall oder SHK.
- Erst nach OK der Lehrkraft nach `main` pushen.
- Keine personenbezogenen Daten. Das Repository ist öffentlich.
