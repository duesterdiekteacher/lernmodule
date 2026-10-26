# Hinweise für Claude

## Aufbau
- `index.html`: Startseite. Auswahl des Bereichs: Metall oder SHK.
- `metall/index.html` und `shk/index.html`: Übersicht der Themen pro Bereich, mit einer Karte pro Thema.
- Jedes Thema hat einen eigenen Ordner direkt im Hauptverzeichnis (z. B. `/werkstofftechnik-stahl/`), mit einer `index.html` als Themenseite und den Varianten (komplett, kompakt, nur Quiz).
- Die Bereichsseiten verlinken die Themen mit `../themenordner/`. Neue Karten kommen an die Markierung `NEUE THEMEN HIER EINFÜGEN`.
- Spiele: eigener Abschnitt „🎮 Spiele“ auf der Bereichsseite (Anker `#spiele`), Karten an die Markierung `NEUE SPIELE HIER EINFÜGEN`. Jedes Spiel hat einen eigenen Ordner direkt im Hauptverzeichnis mit einer `index.html` (eine Datei, keine drei Varianten), z. B. `/werkstoffe-sortieranlage/`. Der Zurück-Link führt auf `../metall/#spiele` bzw. `../shk/#spiele`. Spiele bisher: Metall `werkstoffe-sortieranlage`; SHK `dichte-waage`, `transporter-beladen`. Spiele haben einen Testzugang `window.__<name>` für die automatische Prüfung.

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
  - `num`-Felder können `tol` haben (erlaubter Spielraum). Nötig für Werte, die je nach Tabellenbuch leicht abweichen, z. B. die Dichte.
  - `num`-Felder können `scale` haben (Stellen der Prüfung, Standard 1000 = drei Nachkommastellen). `ans` und `tol` stehen in derselben Stufe. Nötig für sehr kleine Werte, z. B. 0,00036 dm³ (`scale: 1000000`).
  - Bei Rechnungen mit π oder Zwischenergebnissen: im Aufgabentext sagen, wie gerundet wird, und die Spielräume aufeinanderfolgender Felder gleich streng setzen (z. B. m³ und Liter). Mit Schülerwegen testen: π = 3,14 und π-Taste, Zwischenergebnisse wie angegeben gerundet.
  - Knopf „Neue Zahlen“ heißt bei `num` automatisch so; mit `newLabel: 'Neue Aufgabe'` ändern, wenn nicht die Zahlen, sondern die Aufgabe wechselt.
  - `match`: Bei mehr als 2 Möglichkeiten mischt die Engine die Auswahlliste, damit ihre Reihenfolge nicht die Lösung verrät (auch bei `shuffle: false`, das nur die Zeilen festhält). Abschalten mit `keepOptionOrder: true`.
  - Fortschritt wird automatisch im Browser gespeichert (localStorage, nur auf dem Gerät des Schülers): abgeschlossene Module, offenes Modul, Aufgaben samt Eingaben. Schlüssel = Dateipfad + Fingerabdruck der Aufgabenzahl, also getrennt pro Thema und Variante. Knopf „Von vorne anfangen“ unter dem Fortschrittsbalken. Neue Module bekommen das über die Engine von selbst. Aufgaben-Objekte müssen dafür reine Daten sein (keine Funktionen als Eigenschaften).
  - Standard: Module 1–4 sind Grundlagen, danach Profi-Module. Ein Thema kann in `tasks.js` `const BASIC_MODULES = [1, 2, 3, 4, 5];` setzen (so bei `mathe-grundlagen-metall` und `werkstoffe-metall`).
- `_werkzeuge/<thema>/build.py` + `tasks.js`: Lerntexte und Aufgaben eines Themas. Bauen mit `python3 _werkzeuge/<thema>/build.py`, das schreibt die drei HTML-Dateien in den Themenordner.
- SHK-Module mit Dichte: nur Stoffe verwenden, die im SHK-Tabellenbuch stehen (chemische Elemente, flüssige und gasförmige Stoffe), also z. B. kein Stahl, Messing, Gusseisen, PE, PP. Kupfer 8,92; Heizöl als Bereich 0,8 … 0,86.
- Lösungswerte aus Tabellen (ISO 2768, ISO 286) nur als einzelne Übungsfälle in `tasks.js`, nie ganze Tabellen. Vor dem Hochladen gegen unabhängige Nachrechnung prüfen.
- Vor jedem Hochladen im Browser testen: alle Generatoren mehrfach erzeugen, jedes Modul automatisch lösen, Handybreite 375 px.
