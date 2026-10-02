# -*- coding: utf-8 -*-
"""Erzeugt die drei Varianten des Lernmoduls "Toleranzen" nach dem Aufbau der C#-Vorlage."""
import json, re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(REPO, "toleranzen")
TEMPLATE = os.path.join(REPO, "csharp-vererbung", "csharp_vererbung_schulung_v6.html")
ENGINE = open(os.path.join(HERE, "..", "engine.js"), encoding="utf-8").read()
TASKS_JS = open(os.path.join(HERE, "tasks.js"), encoding="utf-8").read()

tpl = open(TEMPLATE, encoding="utf-8").read()
css = tpl[tpl.index("<style>") + 7:tpl.index("</style>")]
# Anpassungen: schmale Handys, Tabellen scrollbar, SVG skalierbar
css = css.replace("grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));",
                  "grid-template-columns: repeat(auto-fit, minmax(min(350px, 100%), 1fr));")
css += """
        .table-wrap { overflow-x: auto; }
        .table-wrap table { min-width: 420px; }
        .sketch {
            text-align: center;
            margin: 25px 0;
            background: #0f172a;
            padding: 20px;
            border-radius: 10px;
            border: 2px solid #334155;
        }
        .sketch svg { width: 100%; max-width: 560px; height: auto; }
        .sketch .caption { font-size: 14px; color: #94a3b8; margin: 10px 0 0 0; }
        .book-box {
            background: #3b2a0a;
            border-left: 5px solid #f59e0b;
            padding: 20px;
            margin: 25px 0;
            border-radius: 5px;
        }
        .book-box h4 { color: #fbbf24; margin-bottom: 10px; font-size: 18px; }
        .book-box p { color: #fde68a; font-size: 16px; margin-bottom: 0; }
        .formula {
            font-family: 'Consolas', 'Courier New', monospace;
            background: #0f172a;
            border: 1px solid #334155;
            border-radius: 8px;
            padding: 15px 20px;
            margin: 15px 0;
            color: #e2e8f0;
            font-size: 18px;
            line-height: 1.9;
        }
        .ok { color: #4ade80; font-weight: bold; }
        .nok { color: #f87171; font-weight: bold; }
        .header .book-hint {
            display: inline-block;
            margin-top: 15px;
            background: #3b2a0a;
            border: 1px solid #f59e0b;
            color: #fde68a;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 17px;
        }
        .progress-fill { min-width: fit-content; padding: 0 14px; white-space: nowrap; }
        @media (max-width: 600px) {
            .sketch { overflow-x: auto; padding: 15px 10px; }
            .sketch svg { min-width: 500px; }
            .module-content { padding: 22px 16px; }
            .header h1 { font-size: 32px; }
            .module-content h2 { font-size: 26px; }
        }
"""
css += """
        /* ---------- Aufgabentypen ---------- */
        .task-head { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 10px; }
        .task-type, .task-book {
            font-size: 13px; font-weight: 600; padding: 3px 10px; border-radius: 999px;
            background: #0f172a; border: 1px solid #475569; color: #cbd5e1;
        }
        .task-book { border-color: #f59e0b; color: #fde68a; background: #3b2a0a; }
        .task-note { color: #94a3b8; font-size: 15px; margin: -5px 0 12px 0; }
        .quiz-question .sketch { margin: 10px 0 15px 0; }
        .fields { display: flex; flex-direction: column; gap: 10px; }
        .field-row {
            display: grid; grid-template-columns: minmax(150px, 1fr) minmax(170px, 1.3fr);
            gap: 4px 14px; align-items: center;
            background: #273449; border: 2px solid transparent; border-radius: 8px; padding: 10px 12px;
        }
        .field-row.ok { border-color: #22c55e; }
        .field-row.bad { border-color: #ef4444; }
        .field-label { color: #f1f5f9; font-size: 17px; }
        .field-input { display: flex; align-items: center; gap: 8px; }
        .field-input input, .field-input select {
            background: #0f172a; color: #f8fafc; border: 2px solid #475569; border-radius: 6px;
            font-size: 18px; padding: 8px 10px; font-family: inherit;
        }
        .field-input input { width: 9em; font-family: 'Consolas', 'Courier New', monospace; }
        .field-input select { width: 100%; max-width: 320px; font-size: 16px; }
        .field-input input:focus, .field-input select:focus { outline: none; border-color: #38bdf8; }
        .field-input input:disabled, .field-input select:disabled { opacity: 0.85; }
        .field-pre, .field-unit { color: #cbd5e1; font-size: 17px; }
        .field-msg { grid-column: 1 / -1; color: #fecaca; font-size: 15px; }
        .field-msg:empty { display: none; }
        .order-list { list-style: decimal; margin-left: 28px; }
        .order-item {
            display: flex; align-items: center; justify-content: space-between; gap: 10px;
            background: #273449; border: 2px solid transparent; border-radius: 8px;
            padding: 8px 10px; margin-bottom: 8px; color: #f1f5f9;
        }
        .order-item.ok { border-color: #22c55e; }
        .order-item.bad { border-color: #ef4444; }
        .order-btns { display: flex; gap: 6px; flex-shrink: 0; }
        .order-btns button {
            background: #334155; color: #f8fafc; border: 1px solid #64748b; border-radius: 6px;
            width: 38px; height: 34px; font-size: 15px; cursor: pointer;
        }
        .order-btns button:hover:not(:disabled) { background: #475569; }
        .order-btns button:disabled { opacity: 0.3; cursor: default; }
        .task-buttons { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 14px; }
        .btn-check, .btn-new {
            border: none; border-radius: 8px; padding: 10px 20px; font-size: 16px; font-weight: bold; cursor: pointer;
        }
        .btn-check { background: #0ea5e9; color: white; }
        .btn-check:hover { background: #0284c7; }
        .btn-new { background: #334155; color: #f1f5f9; border: 1px solid #64748b; }
        .btn-new:hover { background: #475569; }
        .quiz-feedback { line-height: 1.6; }
        @media (max-width: 600px) {
            .field-row { grid-template-columns: 1fr; }
            .field-input input { width: 100%; }
            .quiz-section { padding: 18px 10px; }
            .quiz-question { padding: 14px 10px; }
        }
"""

def table(head, rows):
    h = "<div class=\"table-wrap\"><table><tr>" + "".join(f"<th>{c}</th>" for c in head) + "</tr>"
    for r in rows:
        h += "<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>"
    return h + "</table></div>"

# ---------------------------------------------------------------- Skizzen
SKETCH_BEGRIFFE = """
<div class="sketch">
<h4 style="color:#38bdf8; margin-bottom:10px;">Toleranzskizze: Welle Ø20 +0,2/−0,1</h4>
<svg viewBox="0 0 540 270" role="img" aria-label="Toleranzskizze mit Nennmaß, Höchstmaß, Mindestmaß, Abmaßen und Toleranz">
  <defs>
    <marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
      <path d="M0,0 L10,5 L0,10 z" fill="#e2e8f0"/>
    </marker>
  </defs>
  <line x1="20" y1="240" x2="520" y2="240" stroke="#64748b" stroke-width="2"/>
  <line x1="20" y1="120" x2="520" y2="120" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>
  <text x="24" y="112" fill="#38bdf8" font-size="14" font-family="Segoe UI, Arial">Nulllinie</text>
  <rect x="250" y="80" width="130" height="60" fill="#0ea5e9" fill-opacity="0.35" stroke="#38bdf8" stroke-width="2"/>
  <text x="315" y="114" fill="#f8fafc" font-size="13" text-anchor="middle" font-family="Segoe UI, Arial">Toleranzfeld</text>
  <line x1="90" y1="80" x2="250" y2="80" stroke="#64748b" stroke-dasharray="3 4"/>
  <line x1="150" y1="140" x2="250" y2="140" stroke="#64748b" stroke-dasharray="3 4"/>
  <line x1="380" y1="80" x2="500" y2="80" stroke="#64748b" stroke-dasharray="3 4"/>
  <line x1="380" y1="140" x2="500" y2="140" stroke="#64748b" stroke-dasharray="3 4"/>
  <line x1="40" y1="240" x2="40" y2="122" stroke="#e2e8f0" stroke-width="2" marker-end="url(#ar)"/>
  <text x="46" y="200" fill="#e2e8f0" font-size="13" font-family="Segoe UI, Arial">N = 20</text>
  <line x1="100" y1="240" x2="100" y2="82" stroke="#4ade80" stroke-width="2" marker-end="url(#ar)"/>
  <text x="106" y="160" fill="#4ade80" font-size="13" font-family="Segoe UI, Arial">Höchstmaß</text>
  <text x="106" y="176" fill="#4ade80" font-size="13" font-family="Segoe UI, Arial">G<tspan font-size="10" dy="3">o</tspan><tspan dy="-3"> = 20,2</tspan></text>
  <line x1="190" y1="240" x2="190" y2="142" stroke="#fbbf24" stroke-width="2" marker-end="url(#ar)"/>
  <text x="196" y="200" fill="#fbbf24" font-size="13" font-family="Segoe UI, Arial">Mindestmaß</text>
  <text x="196" y="216" fill="#fbbf24" font-size="13" font-family="Segoe UI, Arial">G<tspan font-size="10" dy="3">u</tspan><tspan dy="-3"> = 19,9</tspan></text>
  <line x1="410" y1="120" x2="410" y2="82" stroke="#e2e8f0" stroke-width="2" marker-end="url(#ar)"/>
  <text x="396" y="70" fill="#e2e8f0" font-size="13" font-family="Segoe UI, Arial">es = +0,2</text>
  <line x1="440" y1="120" x2="440" y2="138" stroke="#e2e8f0" stroke-width="2" marker-end="url(#ar)"/>
  <text x="408" y="160" fill="#e2e8f0" font-size="13" font-family="Segoe UI, Arial">ei = −0,1</text>
  <line x1="495" y1="82" x2="495" y2="138" stroke="#f472b6" stroke-width="2" marker-start="url(#ar)" marker-end="url(#ar)"/>
  <text x="488" y="185" fill="#f472b6" font-size="13" font-family="Segoe UI, Arial">T = 0,3</text>
</svg>
<p class="caption">Die Pfeile für Höchstmaß und Mindestmaß beginnen unten am Bauteil. Die Abmaße beginnen an der Nulllinie.</p>
</div>
"""

def iso_fields_svg():
    # Ø30, Toleranzgrad 6: g6 (-7/-20), h6 (0/-13), js6 (+6,5/-6,5), k6 (+15/+2); 1 µm = 4 px
    y0, s = 120, 4
    fields = [("g6", -7, -20, "#a855f7"), ("h6", 0, -13, "#0ea5e9"), ("js6", 6.5, -6.5, "#22c55e"), ("k6", 15, 2, "#f59e0b")]
    out = ['<div class="sketch"><h4 style="color:#38bdf8; margin-bottom:10px;">Gleicher Toleranzgrad, andere Buchstaben (Wellen Ø30)</h4>',
           '<svg viewBox="0 0 520 250" role="img" aria-label="Lage der Toleranzfelder g6, h6, js6 und k6 zur Nulllinie">',
           f'<line x1="20" y1="{y0}" x2="500" y2="{y0}" stroke="#38bdf8" stroke-width="2" stroke-dasharray="8 6"/>',
           f'<text x="24" y="{y0-8}" fill="#38bdf8" font-size="14" font-family="Segoe UI, Arial">Nulllinie</text>',
           f'<text x="24" y="{y0+22}" fill="#94a3b8" font-size="12" font-family="Segoe UI, Arial">(Nennmaß 30)</text>']
    for i, (name, es, ei, col) in enumerate(fields):
        x = 140 + i * 90
        top, bot = y0 - es * s, y0 - ei * s
        out.append(f'<rect x="{x}" y="{top}" width="60" height="{bot-top}" fill="{col}" fill-opacity="0.4" stroke="{col}" stroke-width="2"/>')
        out.append(f'<text x="{x+30}" y="230" fill="#f8fafc" font-size="16" font-weight="bold" text-anchor="middle" font-family="Segoe UI, Arial">{name}</text>')
    out.append('</svg><p class="caption">Alle vier Felder sind gleich hoch: gleiche Toleranz (13 µm). Nur die Lage ist anders.</p></div>')
    return "".join(out)

SKETCH_ISO = iso_fields_svg()

ANGABE_BOX = """
<div class="info-box">
<h4>🔧 Der Auftrag</h4>
<p>Tim hat an der CNC-Drehmaschine eine Antriebswelle für ein Förderband gedreht. Auf den Lagersitz Ø30 h6 kommt später ein Kugellager. Du sollst prüfen: Ist die Welle in Ordnung? Im Schriftfeld der Zeichnung steht: <strong>ISO 2768-m</strong>.</p>
</div>
""" + table(["Maß in der Zeichnung", "Istmaß (Tim) in mm"], [
    ["Ø30 h6", "29,992"], ["Ø25 g6", "24,996"], ["Ø6 H7 (Bohrung)", "6,008"],
    ["Ø40", "40,12"], ["40", "39,82"], ["15 ±0,1", "15,05"],
    ["120", "120,20"], ["10", "10,05"], ["Fase 1×45°", "1,1"]])

BOOK = lambda txt: f'<div class="book-box"><h4>📘 Nimm dein Tabellenbuch</h4><p>{txt}</p></div>'

# ---------------------------------------------------------------- Inhalte
M = {}

M[1] = dict(
 card=("📏", "Modul 1: Grundbegriffe", "Warum es Toleranzen gibt. Nennmaß, Abmaße, Grenzmaße und Toleranz."),
 title="Modul 1: Grundbegriffe der Maßtoleranzen",
 full=f"""
<h3>Warum gibt es Toleranzen?</h3>
<p>Kein Werkstück wird ganz genau auf ein Maß gefertigt. Maschine, Werkzeug, Werkstoff und Mensch verursachen immer kleine Abweichungen.</p>
<p>Die Teile sollen trotzdem passen. Und sie sollen <strong>austauschbar</strong> sein. Deshalb legt man fest, wie weit ein Maß abweichen darf. Diese erlaubte Abweichung heißt <strong>Toleranz</strong>.</p>
<div class="info-box"><h4>💡 Wichtig</h4><p>Genaue Teile sind teuer. Deshalb toleriert man nur so genau, wie es für die Funktion nötig ist.</p></div>

<h3>Die Begriffe</h3>
<ul>
<li><strong>Nennmaß N:</strong> das Maß in der Zeichnung, z. B. 20 mm. In der Skizze ist es die <strong>Nulllinie</strong>.</li>
<li><strong>Oberes und unteres Abmaß:</strong> So weit darf das Maß nach oben und nach unten vom Nennmaß abweichen.</li>
<li><strong>Höchstmaß G<sub>o</sub>:</strong> das größte erlaubte Maß.</li>
<li><strong>Mindestmaß G<sub>u</sub>:</strong> das kleinste erlaubte Maß.</li>
<li><strong>Toleranz T:</strong> der Unterschied zwischen Höchstmaß und Mindestmaß. Die Toleranz ist <strong>immer positiv</strong>.</li>
</ul>
{SKETCH_BEGRIFFE}

<h3>Bohrung oder Welle?</h3>
<p>Für Bohrungen (Innenmaße) schreibt man <strong>Großbuchstaben</strong>. Für Wellen (Außenmaße) schreibt man <strong>Kleinbuchstaben</strong>.</p>
{table(["", "Bohrung (innen)", "Welle (außen)"], [
  ["oberes Abmaß", "ES", "es"], ["unteres Abmaß", "EI", "ei"],
  ["Höchstmaß", "G<sub>oB</sub>", "G<sub>oW</sub>"], ["Mindestmaß", "G<sub>uB</sub>", "G<sub>uW</sub>"],
  ["Toleranz", "T<sub>B</sub>", "T<sub>W</sub>"]])}
<div class="info-box"><h4>🧠 Merkhilfe</h4><p>Die Bohrung ist das große Loch: GROSSE Buchstaben. Die Welle steckt drin: kleine Buchstaben.</p></div>
""",
 short=f"""
<h3>Warum Toleranzen?</h3>
<p>Kein Teil wird ganz genau gefertigt. Die Toleranz sagt: So weit darf das Maß abweichen. Dann passen die Teile trotzdem.</p>
<h3>Die Begriffe</h3>
<ul>
<li><strong>Nennmaß N:</strong> Maß in der Zeichnung (Nulllinie).</li>
<li><strong>Abmaße:</strong> erlaubte Abweichung nach oben und unten.</li>
<li><strong>Höchstmaß G<sub>o</sub>:</strong> größtes erlaubtes Maß.</li>
<li><strong>Mindestmaß G<sub>u</sub>:</strong> kleinstes erlaubtes Maß.</li>
<li><strong>Toleranz T:</strong> Höchstmaß minus Mindestmaß. Immer positiv.</li>
</ul>
{SKETCH_BEGRIFFE}
<p><strong>Bohrung</strong> (innen): Großbuchstaben ES, EI. <strong>Welle</strong> (außen): Kleinbuchstaben es, ei.</p>
""",
 )

M[2] = dict(
 card=("🧮", "Modul 2: Rechnen mit Toleranzen", "Höchstmaß, Mindestmaß und Toleranz berechnen. Mit Vorzeichen!"),
 title="Modul 2: Rechnen mit frei gewählten Toleranzen",
 full=f"""
<h3>Frei gewählte Toleranzen</h3>
<p>Bei manchen Maßen stehen die Abmaße direkt hinter dem Nennmaß, z. B. <strong>15 ±0,1</strong>. Das nennt man <strong>frei gewählte Toleranzen</strong>. Du kannst die Abmaße direkt aus der Zeichnung ablesen.</p>

<h3>Die Formeln</h3>
<div class="formula">
Höchstmaß = Nennmaß + oberes Abmaß<br>
Mindestmaß = Nennmaß + unteres Abmaß<br>
Toleranz = Höchstmaß − Mindestmaß<br>
<span style="color:#94a3b8;">Kontrolle: Toleranz = oberes Abmaß − unteres Abmaß</span>
</div>
<p>Für die Welle heißt das z. B.: G<sub>oW</sub> = N + es und G<sub>uW</sub> = N + ei.</p>
<div class="info-box"><h4>⚠️ Merke</h4><p>Setze die Abmaße immer <strong>mit Vorzeichen</strong> ein. Ein Minus macht das Maß kleiner: 20 mm + (−0,1 mm) = 19,9 mm.</p></div>

<h3>Beispiel: Welle Ø20 +0,2/−0,1</h3>
{table(["Schritt", "Rechnung"], [
  ["① Werte ablesen", "N = 20 mm, es = +0,2 mm, ei = −0,1 mm"],
  ["② Höchstmaß", "20 mm + (+0,2 mm) = <strong>20,2 mm</strong>"],
  ["③ Mindestmaß", "20 mm + (−0,1 mm) = <strong>19,9 mm</strong>"],
  ["④ Toleranz", "20,2 mm − 19,9 mm = <strong>0,3 mm</strong>"],
  ["⑤ Kontrolle", "0,2 mm − (−0,1 mm) = 0,3 mm ✓"]])}

<div class="info-box"><h4>💡 Tipp</h4><p>Steht nur ein Abmaß da, z. B. <strong>36 +0,5</strong>, dann ist das andere Abmaß <strong>0</strong>. Also: Höchstmaß 36,5 mm, Mindestmaß 36,0 mm.</p></div>
""",
 short=f"""
<h3>Die Formeln</h3>
<div class="formula">
Höchstmaß = Nennmaß + oberes Abmaß<br>
Mindestmaß = Nennmaß + unteres Abmaß<br>
Toleranz = Höchstmaß − Mindestmaß
</div>
<div class="info-box"><h4>⚠️ Merke</h4><p>Abmaße immer mit Vorzeichen einsetzen: 20 + (−0,1) = 19,9.</p></div>
<h3>Beispiel: Ø20 +0,2/−0,1</h3>
<p>Höchstmaß 20,2 mm. Mindestmaß 19,9 mm. Toleranz 0,3 mm.</p>
<p><strong>Tipp:</strong> Steht nur ein Abmaß da (z. B. 36 +0,5), ist das andere Abmaß 0.</p>
""",
 )

M[3] = dict(
 card=("📋", "Modul 3: Allgemeintoleranzen", "Maße ohne Toleranzangabe. ISO 2768 mit dem Tabellenbuch."),
 title="Modul 3: Allgemeintoleranzen nach DIN ISO 2768-1",
 full=f"""
<h3>Maße ohne Toleranzangabe</h3>
<p>Nicht jedes Maß hat eine eigene Toleranzangabe. Maße ohne Toleranzangabe heißen <strong>Freimaße</strong>. Für sie gelten die <strong>Allgemeintoleranzen</strong>.</p>
<p>Welche Toleranzklasse gilt, steht im <strong>Schriftfeld</strong> der Zeichnung, z. B. <strong>ISO 2768-m</strong>. So bleibt die Zeichnung übersichtlich.</p>

<h3>Die vier Toleranzklassen</h3>
{table(["Kurzzeichen", "f", "m", "c", "v"], [["Bedeutung", "fein", "mittel", "grob", "sehr grob"]])}
<p>Allgemeintoleranzen sind immer <strong>symmetrisch</strong>. Das obere und das untere Abmaß sind gleich groß, z. B. ±0,3.</p>

<h3>Drei Anwendungsbereiche</h3>
<p>Die Tabelle im Tabellenbuch hat drei Teile:</p>
<ol>
<li><strong>Längenmaße</strong> (dazu gehören auch Durchmesser)</li>
<li><strong>Gebrochene Kanten</strong> (Rundungen und Fasen)</li>
<li><strong>Winkelmaße</strong></li>
</ol>

<h3>So liest du ab</h3>
<ol>
<li>Toleranzklasse im Schriftfeld suchen.</li>
<li>Richtigen Teil der Tabelle wählen: Längenmaß, gebrochene Kante oder Winkel.</li>
<li>Nennmaßbereich suchen.</li>
<li>Grenzabmaße ablesen.</li>
</ol>
<div class="info-box"><h4>⚠️ Achtung beim Ablesen</h4><p>„über 30 bis 120“ heißt: größer als 30 mm und <strong>bis einschließlich</strong> 120 mm. Das Maß 30 mm gehört also noch zum Bereich „über 6 bis 30“.</p></div>
{BOOK("Suche im Tabellenbuch die Tabelle „Allgemeintoleranzen“. Tipp: Schau im Inhaltsverzeichnis oder im Sachwortverzeichnis nach.")}

<h3>Beispiel: Längenmaß 75 mm, ISO 2768-m</h3>
{table(["Schritt", "Vorgehen"], [
  ["① Toleranzklasse", "Schriftfeld: ISO 2768-m → Klasse m (mittel)"],
  ["② Nennmaßbereich", "75 mm liegt im Bereich „über 30 bis 120“"],
  ["③ Abmaße", "Zeile m, Spalte „über 30 bis 120“: ±0,3 mm"],
  ["④ Höchstmaß", "75 mm + 0,3 mm = <strong>75,3 mm</strong>"],
  ["⑤ Mindestmaß", "75 mm − 0,3 mm = <strong>74,7 mm</strong>"],
  ["⑥ Toleranz", "75,3 mm − 74,7 mm = <strong>0,6 mm</strong>"]])}
""",
 short=f"""
<h3>Freimaße</h3>
<p>Maße ohne Toleranzangabe heißen <strong>Freimaße</strong>. Für sie gilt die Allgemeintoleranz aus dem <strong>Schriftfeld</strong>, z. B. ISO 2768-m.</p>
<p>Klassen: <strong>f</strong> fein, <strong>m</strong> mittel, <strong>c</strong> grob, <strong>v</strong> sehr grob. Die Abmaße sind immer symmetrisch (±).</p>
<p>Drei Teile der Tabelle: <strong>Längenmaße</strong> (auch Durchmesser), <strong>gebrochene Kanten</strong> (Rundungen, Fasen), <strong>Winkelmaße</strong>.</p>
<div class="info-box"><h4>⚠️ Achtung</h4><p>„über 30 bis 120“ heißt: bis <strong>einschließlich</strong> 120. 30 mm gehört noch zu „über 6 bis 30“.</p></div>
{BOOK("Tabelle „Allgemeintoleranzen“. Tipp: Sachwortverzeichnis.")}
<p><strong>Beispiel:</strong> 75 mm, ISO 2768-m → ±0,3 mm → Höchstmaß 75,3 mm, Mindestmaß 74,7 mm.</p>
""",
 )

M[4] = dict(
 card=("✅", "Modul 4: Ist das Maß in Ordnung?", "Istmaß mit Höchst- und Mindestmaß vergleichen. Nacharbeit oder Ausschuss?"),
 title="Modul 4: Ist das Maß in Ordnung?",
 full=f"""
<h3>Die Prüfregel</h3>
<p>Das <strong>Istmaß</strong> ist das Maß, das du am fertigen Werkstück misst. Ein Maß ist <strong>in Ordnung</strong>, wenn das Istmaß zwischen Mindestmaß und Höchstmaß liegt.</p>
<div class="formula">Mindestmaß ≤ Istmaß ≤ Höchstmaß</div>
<p>Auch ein Istmaß, das <strong>genau</strong> auf dem Höchstmaß oder dem Mindestmaß liegt, ist in Ordnung.</p>

<h3>Beispiel</h3>
<p>Grenzmaße: Mindestmaß 29,8 mm, Höchstmaß 30,2 mm.</p>
{table(["Istmaß", "Ergebnis"], [
  ["30,15 mm", "<span class='ok'>in Ordnung</span>"],
  ["30,25 mm", "<span class='nok'>zu groß</span>"],
  ["29,80 mm", "<span class='ok'>in Ordnung</span> (genau das Mindestmaß)"],
  ["29,75 mm", "<span class='nok'>zu klein</span>"]])}

<h3>Nacharbeit oder Ausschuss?</h3>
<p>Wenn ein Maß nicht passt, gibt es zwei Möglichkeiten. Die Frage ist: Kann man noch <strong>Material wegnehmen</strong>?</p>
{table(["Fehler", "Was tun?", "Warum?"], [
  ["Welle zu dick", "<span class='ok'>nacharbeiten</span>", "Man kann noch Material abtragen, z. B. schleifen."],
  ["Welle zu dünn", "<span class='nok'>Ausschuss</span>", "Man kann kein Material hinzufügen."],
  ["Bohrung zu klein", "<span class='ok'>nacharbeiten</span>", "Man kann die Bohrung noch aufbohren oder reiben."],
  ["Bohrung zu groß", "<span class='nok'>Ausschuss</span>", "Eine Bohrung wird nicht wieder kleiner."]])}
""",
 short=f"""
<h3>Die Prüfregel</h3>
<div class="formula">Mindestmaß ≤ Istmaß ≤ Höchstmaß</div>
<p>Genau auf dem Grenzmaß ist auch in Ordnung.</p>
<h3>Nacharbeit oder Ausschuss?</h3>
<ul>
<li>Welle zu dick, Bohrung zu klein: <span class="ok">nacharbeiten</span>. Es kann noch Material weg.</li>
<li>Welle zu dünn, Bohrung zu groß: <span class="nok">Ausschuss</span>. Material kann man nicht hinzufügen.</li>
</ul>
""",
 )

M[5] = dict(
 card=("🔤", "Modul 5: ISO-Toleranzen lesen", "Was bedeutet Ø30 h6? Grundabmaß, Toleranzgrad und Mikrometer."),
 card_locked="Gesperrt. Schließe zuerst die Module 1 bis 4 ab.",
 title="Modul 5: ISO-Toleranzen lesen",
 full=f"""
<h3>Verschlüsselte Toleranzen</h3>
<p>Super, du hast das Profi-Modul freigeschaltet! Maße, die besonders genau sein müssen, bekommen <strong>ISO-Toleranzen</strong>. Ein Beispiel ist der Lagersitz für ein Kugellager.</p>
<p>Die Abmaße stehen dann nicht in der Zeichnung. Sie sind <strong>verschlüsselt</strong>, z. B. <strong>Ø30 h6</strong>.</p>

<h3>Die drei Teile</h3>
{table(["Ø30", "h", "6"], [
  ["<strong>Nennmaß</strong>", "<strong>Grundabmaß</strong> (Buchstabe)", "<strong>Toleranzgrad</strong> (Zahl)"],
  ["Größe des Bauteils", "<strong>Lage</strong> des Toleranzfeldes", "<strong>Größe</strong> der Toleranz"]])}
<p>Buchstabe und Zahl zusammen heißen <strong>Toleranzklasse</strong>, hier h6.</p>
<ul>
<li><strong>Großbuchstabe</strong> (z. B. H7): Bohrung.</li>
<li><strong>Kleinbuchstabe</strong> (z. B. h6): Welle.</li>
</ul>

<h3>Wie groß ist die Toleranz?</h3>
<p>Die Größe der Toleranz hängt von zwei Dingen ab:</p>
<ul>
<li>Je größer der <strong>Toleranzgrad</strong>, desto größer die Toleranz. Ø30 H9 hat mehr Toleranz als Ø30 H7.</li>
<li>Je größer das <strong>Nennmaß</strong>, desto größer die Toleranz. Ø100 H7 hat mehr Toleranz als Ø10 H7.</li>
</ul>
<p>Der Buchstabe ändert nur die <strong>Lage</strong>, nicht die Größe. Ø50 H7 und Ø50 G7 haben gleich viel Toleranz.</p>
{SKETCH_ISO}

<h3>Mikrometer</h3>
<p>Im Tabellenbuch stehen die Werte in <strong>Mikrometern (µm)</strong>.</p>
<div class="formula">1 µm = 0,001 mm &nbsp;&nbsp;→&nbsp;&nbsp; 13 µm = 0,013 mm</div>

<h3>Sonderfall H und h</h3>
<div class="info-box"><h4>🧠 Merke</h4><p>Bei H und h ist das Grundabmaß immer 0. Bohrung H: Das Mindestmaß ist das Nennmaß. Welle h: Das Höchstmaß ist das Nennmaß.</p></div>
""",
 short=f"""
<h3>Ø30 h6 lesen</h3>
<ul>
<li><strong>30</strong> = Nennmaß</li>
<li><strong>h</strong> = Grundabmaß: <strong>Lage</strong> des Toleranzfeldes</li>
<li><strong>6</strong> = Toleranzgrad: <strong>Größe</strong> der Toleranz</li>
</ul>
<p>Großbuchstabe = Bohrung. Kleinbuchstabe = Welle.</p>
<p>Größerer Toleranzgrad oder größeres Nennmaß → größere Toleranz. Der Buchstabe ändert nur die Lage.</p>
{SKETCH_ISO}
<p>Werte im Tabellenbuch in µm: <strong>1 µm = 0,001 mm</strong>.</p>
<p><strong>H und h:</strong> Grundabmaß 0. Bei H ist das Mindestmaß das Nennmaß, bei h das Höchstmaß.</p>
""",
 )

M[6] = dict(
 card=("🔧", "Modul 6: Die Antriebswelle prüfen", "Abmaße mit dem Tabellenbuch bestimmen und Tims Welle prüfen."),
 card_locked="Gesperrt. Prüfe danach eine echte Antriebswelle mit Messprotokoll.",
 title="Modul 6: Die Antriebswelle prüfen",
 full=f"""
<h3>Abmaße mit dem Tabellenbuch bestimmen</h3>
<p>Für ISO-Toleranzen brauchst du zwei Tabellen:</p>
<ul>
<li><strong>Grundtoleranzen:</strong> Dort steht die Toleranz IT (in µm). Zeile = Nennmaßbereich, Spalte = Toleranzgrad.</li>
<li><strong>Grundabmaße</strong> für Wellen oder Bohrungen: Dort steht <strong>ein</strong> Abmaß. Das zweite Abmaß rechnest du aus.</li>
</ul>
{BOOK("Du brauchst drei Tabellen: „Grundtoleranzen“, „Grundabmaße für Wellen“ und „Grundabmaße für Bohrungen“. Tipp: Schau im Inhaltsverzeichnis oder im Sachwortverzeichnis unter „ISO-Passungen“ oder „Toleranzen“ nach.")}
{table(["Toleranzklasse", "Im Tabellenbuch steht ...", "Zweites Abmaß"], [
  ["Wellen a bis h", "es (oberes Abmaß)", "ei = es − IT"],
  ["Wellen j bis s", "ei (unteres Abmaß)", "es = ei + IT"],
  ["Bohrungen A bis H", "EI (unteres Abmaß)", "ES = EI + IT"]])}
<p>Bohrungen J bis S lassen wir hier weg. Dafür braucht man einen Zusatzwert.</p>

<h3>Beispiel: Welle Ø40 f7</h3>
{table(["Schritt", "Vorgehen"], [
  ["① Ablesen", "N = 40 mm. f ist klein → Welle. Toleranzgrad 7."],
  ["② Grundtoleranz", "Zeile „30 ... 50“, Spalte IT7 → IT = 25 µm"],
  ["③ Grundabmaß", "Wellen, Zeile „30 ... 40“, Spalte f → es = −25 µm"],
  ["④ Zweites Abmaß", "ei = es − IT = −25 µm − 25 µm = −50 µm"],
  ["⑤ In mm", "es = −0,025 mm, ei = −0,050 mm"],
  ["⑥ Grenzmaße", "Höchstmaß 39,975 mm, Mindestmaß 39,950 mm"],
  ["⑦ Kontrolle", "39,975 − 39,950 = 0,025 mm = IT7 ✓"]])}

<h3>So prüfst du ein Bauteil</h3>
<ol>
<li>Toleranzart bestimmen: frei gewählt, Allgemeintoleranz oder ISO-Toleranz?</li>
<li>Abmaße ermitteln: aus der Zeichnung oder aus dem Tabellenbuch.</li>
<li>Höchstmaß und Mindestmaß berechnen.</li>
<li>Istmaß mit den Grenzmaßen vergleichen.</li>
<li>Entscheiden: in Ordnung, nacharbeiten oder Ausschuss?</li>
</ol>

<h3>Jetzt du: Tims Antriebswelle</h3>
{ANGABE_BOX}
<p>Rechne die Fragen unten mit Stift, Papier und Tabellenbuch durch.</p>
""",
 short=f"""
<h3>Abmaße bestimmen</h3>
{BOOK("Tabellen „Grundtoleranzen“, „Grundabmaße für Wellen“ und „Grundabmaße für Bohrungen“. Tipp: Sachwortverzeichnis.")}
{table(["Toleranzklasse", "Im Tabellenbuch", "Zweites Abmaß"], [
  ["Wellen a bis h", "es", "ei = es − IT"],
  ["Wellen j bis s", "ei", "es = ei + IT"],
  ["Bohrungen A bis H", "EI", "ES = EI + IT"]])}
<p><strong>Beispiel Ø40 f7:</strong> IT7 = 25 µm, es = −25 µm, ei = −50 µm. Höchstmaß 39,975 mm, Mindestmaß 39,950 mm.</p>
<h3>Tims Antriebswelle</h3>
{ANGABE_BOX}
""",
 quiz_content=f"<h3>Tims Antriebswelle</h3>{ANGABE_BOX}",
 )

# ---------------------------------------------------------------- Seite bauen
def build(variant):
    titles = {"full": "Toleranzen – Lernmodul", "short": "Toleranzen – Kompakt", "quiz": "Toleranzen – Quiz"}
    sub = {"full": "Grundbegriffe, Allgemeintoleranzen und ISO-Toleranzen. Am Ende prüfst du eine echte Antriebswelle.",
           "short": "Das Wichtigste in Kürze. Am Ende prüfst du eine Antriebswelle.",
           "quiz": "Nur die Fragen. Teste, was du schon kannst."}[variant]
    cards = ""
    for n in range(1, 7):
        icon, t, d = M[n]["card"]
        locked = n > 4
        cls = "module-card" + (" advanced-card locked" if locked else "")
        desc = M[n].get("card_locked", d) if locked else d
        cards += f'''
            <div class="module-card{(" advanced-card locked" if locked else "")}" id="card-{n}" onclick="openModule({n})">
                <div class="module-icon">{icon}</div>
                <div class="module-title">{t}</div>
                <div class="module-description">{desc}</div>
            </div>
'''
    data = {}
    for n in range(1, 7):
        if variant == "full":
            content = M[n]["full"]
        elif variant == "short":
            content = M[n]["short"]
        else:
            content = M[n].get("quiz_content", "")
        data[n] = dict(title=M[n]["title"], content=content)

    header_hint = '<div class="book-hint">📘 Du brauchst dein Tabellenbuch.</div>'
    return f'''<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{titles[variant]}</title>
    <style>{css}    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📏 Toleranzen 📏</h1>
            <p>{sub}</p>
            {header_hint}
        </div>

        <div class="progress-bar">
            <div class="progress-fill" id="progress" style="width: 0%;">0 von 6 Modulen abgeschlossen</div>
        </div>

        <!-- MODULE GRID -->
        <div class="module-grid" id="module-grid">{cards}        </div>

        <!-- MODULE CONTENT SECTIONS -->
        <div id="module-content-container"></div>

        <!-- BADGE -->
        <div class="badge" id="badge">
            <div class="badge-icon">🏅</div>
            <h2>Herzlichen Glückwunsch!</h2>
            <p style="font-size: 20px;">Du hast alle Grundlagen- und Profi-Module geschafft.</p>
            <h2 id="expert-title" style="margin-top: 20px; color: #f8fafc;">TOLERANZ-PROFI!</h2>
        </div>
    </div>

    <script>
const modules = {json.dumps(data, ensure_ascii=False, indent=2)};

{TASKS_JS}
{ENGINE}
    </script>
</body>
</html>
'''

os.makedirs(OUT, exist_ok=True)
for v, fn in [("full", "toleranzen_komplett.html"), ("short", "toleranzen_kompakt.html"), ("quiz", "toleranzen_quiz.html")]:
    open(os.path.join(OUT, fn), "w", encoding="utf-8").write(build(v))
    print("geschrieben:", fn)
