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
- Nichts aus Fachkundebuch oder Tabellenbuch hochladen: keine Scans, keine abgeschriebenen Tabellen oder Texte. Die Schüler arbeiten mit ihrem eigenen Tabellenbuch. Im Modul nur einzelne Werte in Beispielen und Lösungen.
- Keine Seitenzahlen aus dem Tabellenbuch nennen. Das Modul soll auch mit einer neuen Auflage funktionieren. Stattdessen den Namen der Tabelle nennen und auf Inhalts- oder Sachwortverzeichnis verweisen.
- Lerntexte selbst formulieren (kurze Sätze, LRS-freundlich), nicht aus Büchern übernehmen.
- Aufgabentypen vielfältig mischen, nicht nur Multiple Choice: Zahlen eingeben, Zuordnen, Reihenfolge, Skizzen beschriften, Richtig/Falsch, Fehler finden. Rechenaufgaben mit Zufallswerten („Neue Zahlen“), damit jeder Schüler andere Aufgaben bekommt.

## Erzeugung
- Die drei Varianten eines Moduls werden aus einer gemeinsamen Quelle erzeugt, damit die Aufgaben überall gleich sind.
- `_werkzeuge/engine.js`: gemeinsame Aufgaben-Engine für alle Module. Typen: `mc` (Auswahl), `num` (Zahlen eingeben, auch mit Auswahlfeldern), `match` (Zuordnen), `order` (Reihenfolge). Aufgaben als Funktion erzeugen neue Zufallszahlen („Neue Zahlen“). Längen intern als ganze Zahlen in µm.
- `_werkzeuge/<thema>/build.py` + `tasks.js`: Lerntexte und Aufgaben eines Themas. Bauen mit `python3 _werkzeuge/<thema>/build.py`, das schreibt die drei HTML-Dateien in den Themenordner.
- Lösungswerte aus Tabellen (ISO 2768, ISO 286) nur als einzelne Übungsfälle in `tasks.js`, nie ganze Tabellen. Vor dem Hochladen gegen unabhängige Nachrechnung prüfen.
- Vor jedem Hochladen im Browser testen: alle Generatoren mehrfach erzeugen, jedes Modul automatisch lösen, Handybreite 375 px.
