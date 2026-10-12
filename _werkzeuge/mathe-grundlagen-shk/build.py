# -*- coding: utf-8 -*-
"""Erzeugt die drei Varianten des Lernmoduls "Mathe-Grundlagen SHK" nach dem Aufbau der C#-Vorlage."""
import json, re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(REPO, "mathe-grundlagen-shk")
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

css += """
        /* ---------- Rechenweg (Fehler finden) ---------- */
        .calc { text-align: left; font-family: 'Consolas', 'Courier New', monospace; font-size: 16px; color: #e2e8f0; line-height: 2.1; white-space: nowrap; overflow-x: auto; }
        .calc-nr { display: inline-block; min-width: 4.6em; color: #fbbf24; font-family: "Segoe UI", Arial, sans-serif; font-size: 15px; font-weight: bold; }
        .field-unit:empty { display: none; }
"""

# ---------------------------------------------------------------- Skizzen
def treppe(einheiten, faktor, titel, farbe):
    """Senkrechte Umrechnungstreppe: rechts nach unten mal (grün), links nach oben geteilt (rot)."""
    F = 'font-family="Segoe UI, Arial"'
    n = len(einheiten)
    bh, gap = 38, 40
    H = 20 + n * bh + (n - 1) * gap + 10
    s = [f'<svg viewBox="0 0 230 {H}" style="width:220px; max-width:100%; min-width:0" role="img" aria-label="Umrechnungstreppe {titel}">',
         f'<defs><marker id="ar{titel}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="context-stroke"/></marker></defs>']
    for i, u in enumerate(einheiten):
        y = 10 + i * (bh + gap)
        s.append(f'<rect x="60" y="{y}" width="110" height="{bh}" rx="8" fill="#1e293b" stroke="{farbe}" stroke-width="2"/>')
        s.append(f'<text x="115" y="{y + 26}" fill="#f8fafc" font-size="19" font-weight="bold" text-anchor="middle" {F}>{u}</text>')
        if i < n - 1:
            y1, y2 = y + bh + 4, y + bh + gap - 4
            s.append(f'<line x1="155" y1="{y1}" x2="155" y2="{y2}" stroke="#4ade80" stroke-width="2.5" marker-end="url(#ar{titel})"/>')
            s.append(f'<text x="166" y="{(y1 + y2) / 2 + 6}" fill="#4ade80" font-size="17" font-weight="bold" {F}>· {faktor}</text>')
            s.append(f'<line x1="75" y1="{y2}" x2="75" y2="{y1}" stroke="#f87171" stroke-width="2.5" marker-end="url(#ar{titel})"/>')
            s.append(f'<text x="64" y="{(y1 + y2) / 2 + 6}" fill="#f87171" font-size="17" font-weight="bold" text-anchor="end" {F}>: {faktor}</text>')
    s.append('</svg>')
    return "".join(s)

def treppen_box(teile, caption):
    inner = "".join(f'<div><h4 style="color:#38bdf8; margin:6px 0 4px 0; font-size:17px;">{t}</h4>{svg}</div>' for t, svg in teile)
    return ('<div class="sketch"><div style="display:flex; flex-wrap:wrap; justify-content:center; gap:10px 24px;">' + inner +
            f'</div><p class="caption">Grün nach unten: mal. Rot nach oben: geteilt. {caption}</p></div>')

T_LAENGE = treppe(["m", "dm", "cm", "mm"], 10, "L", "#38bdf8")
T_FLAECHE = treppe(["m²", "dm²", "cm²", "mm²"], 100, "F", "#a855f7")
T_VOLUMEN = treppe(["m³", "dm³ = l", "cm³"], 1000, "V", "#22c55e")

WAAGE = """
<div class="sketch">
<h4 style="color:#38bdf8; margin-bottom:10px;">Das Waage-Prinzip</h4>
<svg viewBox="0 0 520 200" style="max-width:480px; min-width:0" role="img" aria-label="Waage im Gleichgewicht: links V, rechts A mal h">
  <polygon points="260,90 240,170 280,170" fill="#475569"/>
  <rect x="200" y="170" width="120" height="12" rx="4" fill="#475569"/>
  <rect x="60" y="84" width="400" height="8" rx="4" fill="#94a3b8"/>
  <line x1="110" y1="92" x2="110" y2="120" stroke="#94a3b8" stroke-width="2"/>
  <line x1="410" y1="92" x2="410" y2="120" stroke="#94a3b8" stroke-width="2"/>
  <path d="M50 120 h120 l-15 25 h-90 z" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <path d="M350 120 h120 l-15 25 h-90 z" fill="#1e293b" stroke="#38bdf8" stroke-width="2"/>
  <text x="110" y="70" fill="#f8fafc" font-size="26" font-weight="bold" text-anchor="middle" font-family="Consolas, monospace">V</text>
  <text x="260" y="70" fill="#fbbf24" font-size="26" font-weight="bold" text-anchor="middle" font-family="Consolas, monospace">=</text>
  <text x="410" y="70" fill="#f8fafc" font-size="26" font-weight="bold" text-anchor="middle" font-family="Consolas, monospace">A · h</text>
</svg>
<p class="caption">Die Waage bleibt im Gleichgewicht, wenn du auf <strong>beiden</strong> Seiten dasselbe machst.</p>
</div>
"""

# ---------------------------------------------------------------- Inhalte
M = {}

M[1] = dict(
 card=("🧮", "Modul 1: Rechenregeln", "Punkt vor Strich, Klammern, Dezimalzahlen und Runden."),
 title="Modul 1: Rechenregeln",
 full=f"""
<h3>Die Reihenfolge beim Rechnen</h3>
<p>Bei einer Rechnung mit mehreren Rechenarten gibt es feste Regeln. Sonst bekommt jeder ein anderes Ergebnis.</p>
<div class="formula">① Klammern zuerst<br>② Punktrechnung: mal (·) und geteilt (:)<br>③ Strichrechnung: plus (+) und minus (−)</div>
{table(["Aufgabe", "Rechenweg", "Ergebnis"], [
  ["3 + 4 · 2", "3 + 8", "<strong>11</strong>"],
  ["(3 + 4) · 2", "7 · 2", "<strong>14</strong>"],
  ["20 − 12 : 4", "20 − 3", "<strong>17</strong>"]])}
<div class="info-box"><h4>🧠 Merkhilfe</h4><p><strong>K</strong>lammer – <strong>P</strong>unkt – <strong>S</strong>trich. Ein guter Taschenrechner kennt diese Regeln auch.</p></div>

<h3>Dezimalzahlen</h3>
<p>Im Handwerk rechnest du oft mit Kommazahlen, z. B. 2,35 m. Im Taschenrechner tippst du statt dem Komma einen <strong>Punkt</strong>: 2.35.</p>

<h3>Runden</h3>
<p>Ergebnisse haben oft viele Nachkommastellen. Dann rundest du.</p>
<ol>
<li>Lege fest, wie viele Stellen bleiben, z. B. zwei.</li>
<li>Schau auf die <strong>nächste Ziffer</strong> dahinter.</li>
<li>0, 1, 2, 3, 4: <strong>abrunden</strong>. 5, 6, 7, 8, 9: <strong>aufrunden</strong>.</li>
</ol>
{table(["Zahl", "auf 2 Stellen", "Warum?"], [
  ["3,1416", "3,14", "nächste Ziffer 1 → abrunden"],
  ["2,4572", "2,46", "nächste Ziffer 7 → aufrunden"],
  ["0,8950", "0,90", "nächste Ziffer 5 → aufrunden"]])}
<div class="info-box"><h4>⚠️ Tipp</h4><p>Runde erst am <strong>Ende</strong>. Wenn du zwischendurch rundest, wird das Ergebnis ungenau.</p></div>
""",
 short=f"""
<div class="formula">Klammer → Punkt (· :) → Strich (+ −)</div>
<p>Beispiel: 3 + 4 · 2 = 3 + 8 = <strong>11</strong>. Aber (3 + 4) · 2 = <strong>14</strong>.</p>
<p><strong>Runden:</strong> Schau auf die nächste Ziffer. 0 bis 4: abrunden. 5 bis 9: aufrunden. Runde erst am Ende.</p>
<p><strong>Taschenrechner:</strong> Komma als Punkt eintippen: 2,35 → 2.35.</p>
""",
 )

M[2] = dict(
 card=("📏", "Modul 2: Länge, Fläche, Volumen", "Einheiten umrechnen mit der Treppe. 1 dm³ = 1 Liter."),
 title="Modul 2: Länge, Fläche, Volumen",
 full=f"""
<h3>Drei Größen</h3>
<ul>
<li><strong>Länge:</strong> z. B. ein Rohr. Einheiten: mm, cm, dm, m.</li>
<li><strong>Fläche:</strong> z. B. eine Wand zum Fliesen. Einheiten: mm², cm², dm², m². Die kleine <strong>²</strong> heißt „Quadrat“.</li>
<li><strong>Volumen:</strong> z. B. ein Speicher. Einheiten: cm³, dm³, m³ und Liter. Die kleine <strong>³</strong> heißt „Kubik“.</li>
</ul>

<h3>Die Umrechnungstreppe</h3>
<p>Eine Treppenstufe nach <strong>unten</strong> (zur kleineren Einheit): Die Zahl wird <strong>größer</strong>. Du rechnest mal.</p>
<p>Eine Treppenstufe nach <strong>oben</strong> (zur größeren Einheit): Die Zahl wird <strong>kleiner</strong>. Du teilst.</p>
{treppen_box([("Länge: Umrechnungszahl 10", T_LAENGE), ("Fläche: Umrechnungszahl 100", T_FLAECHE), ("Volumen: Umrechnungszahl 1000", T_VOLUMEN)],
  "")}

<h3>Beispiele</h3>
{table(["Aufgabe", "Stufen", "Ergebnis"], [
  ["2,35 m in mm", "3 Stufen nach unten: · 10 · 10 · 10 = · 1000", "<strong>2350 mm</strong>"],
  ["450 mm in m", "3 Stufen nach oben: : 1000", "<strong>0,45 m</strong>"],
  ["1,5 m² in dm²", "1 Stufe nach unten: · 100", "<strong>150 dm²</strong>"],
  ["0,25 m³ in l", "1 Stufe nach unten: · 1000", "<strong>250 l</strong>"]])}
<div class="info-box"><h4>🧠 Merke</h4><p><strong>1 dm³ = 1 l</strong> und <strong>1 m³ = 1000 l</strong>. Das brauchst du im SHK ständig: für Speicher, Badewannen und Rohrleitungen.</p></div>
""",
 short=f"""
<p>Stufe nach unten (kleinere Einheit): <strong>mal</strong>. Stufe nach oben: <strong>geteilt</strong>.</p>
{treppen_box([("Länge: 10", T_LAENGE), ("Fläche: 100", T_FLAECHE), ("Volumen: 1000", T_VOLUMEN)], "")}
<p><strong>1 dm³ = 1 l</strong>, <strong>1 m³ = 1000 l</strong>.</p>
""",
 )

M[3] = dict(
 card=("⏱️", "Modul 3: Masse, Zeit, Druck, Leistung", "Weitere Einheiten im SHK. Vorsicht bei Stunden und Minuten!"),
 title="Modul 3: Masse, Zeit, Druck, Leistung",
 full=f"""
<h3>Masse</h3>
<div class="formula">1 t = 1000 kg &nbsp;&nbsp;&nbsp; 1 kg = 1000 g</div>

<h3>Zeit</h3>
<div class="formula">1 h = 60 min &nbsp;&nbsp;&nbsp; 1 min = 60 s</div>
<div class="info-box"><h4>⚠️ Achtung, Falle!</h4><p>Bei der Zeit ist die Umrechnungszahl <strong>60</strong>, nicht 100. <strong>1,5 h</strong> sind <strong>1 h 30 min</strong>, nicht 1 h 50 min.</p></div>
{table(["Aufgabe", "Rechnung", "Ergebnis"], [
  ["1,5 h in min", "1,5 · 60", "<strong>90 min</strong>"],
  ["45 min in h", "45 : 60", "<strong>0,75 h</strong>"],
  ["2 h 15 min in min", "2 · 60 + 15", "<strong>135 min</strong>"]])}

<h3>Druck</h3>
<p>Im SHK misst man den Druck meistens in <strong>bar</strong> oder <strong>mbar</strong> (Millibar). Die Grundeinheit ist das <strong>Pascal (Pa)</strong>.</p>
<div class="formula">1 bar = 1000 mbar<br>1 mbar = 100 Pa<br>1 bar = 100 000 Pa</div>
<ul>
<li>Den Druck in der Heizungsanlage gibt man meist in <strong>bar</strong> an.</li>
<li>Den Gasdruck im Haus gibt man meist in <strong>mbar</strong> an.</li>
</ul>

<h3>Leistung</h3>
<p>Die Leistung misst man in <strong>Watt (W)</strong> oder <strong>Kilowatt (kW)</strong>. Zum Beispiel bei Heizkörpern, Heizkesseln und Pumpen.</p>
<div class="formula">1 kW = 1000 W</div>
""",
 short=f"""
<div class="formula">1 t = 1000 kg, 1 kg = 1000 g<br>1 h = 60 min, 1 min = 60 s<br>1 bar = 1000 mbar = 100 000 Pa<br>1 kW = 1000 W</div>
<div class="info-box"><h4>⚠️ Falle</h4><p>Zeit: Umrechnungszahl 60! 1,5 h = 1 h 30 min = 90 min.</p></div>
""",
 )

M[4] = dict(
 card=("📐", "Modul 4: Formeln einsetzen", "Formelzeichen verstehen, Werte einsetzen, Einheiten mitrechnen."),
 title="Modul 4: Formeln einsetzen",
 full=f"""
<h3>Was ist eine Formel?</h3>
<p>Eine Formel ist eine Rechenvorschrift mit Buchstaben. Jeder Buchstabe ist ein <strong>Formelzeichen</strong> und steht für eine Größe.</p>
{table(["Zeichen", "Größe", "Zeichen", "Größe"], [
  ["A", "Fläche", "d", "Durchmesser"],
  ["V", "Volumen", "m", "Masse"],
  ["l", "Länge", "t", "Zeit"],
  ["b", "Breite", "p", "Druck"],
  ["h", "Höhe", "Q", "Volumenstrom"]])}

<h3>Wichtige Formeln</h3>
<div class="formula">Rechteck: A = l · b<br>Quader: V = l · b · h<br>Kreis: A = π/4 · d² &nbsp;<span style="color:#94a3b8;">(π ≈ 3,14; d² = d · d)</span><br>Zylinder (z. B. Rohr, Speicher): V = A · h</div>

<h3>So setzt du ein</h3>
<ol>
<li>Formel aufschreiben.</li>
<li>Alle Werte in <strong>dieselbe Einheit</strong> umrechnen.</li>
<li>Werte mit Einheit einsetzen.</li>
<li>Ausrechnen. Die Einheit rechnest du mit: m · m = m².</li>
</ol>
<h3>Beispiel: Fliesenfläche</h3>
<p>Eine Wand ist 2,5 m lang und 60 cm hoch gefliest.</p>
{table(["Schritt", "Rechnung"], [
  ["① Formel", "A = l · b"],
  ["② Umrechnen", "60 cm = 0,6 m"],
  ["③ Einsetzen", "A = 2,5 m · 0,6 m"],
  ["④ Ergebnis", "A = <strong>1,5 m²</strong>"]])}
<div class="info-box"><h4>⚠️ Typischer Fehler</h4><p>2,5 m · 60 cm = 150 m²? <strong>Falsch!</strong> Man darf m und cm nicht einfach malnehmen. Erst umrechnen!</p></div>
""",
 short=f"""
<div class="formula">Rechteck: A = l · b<br>Quader: V = l · b · h<br>Kreis: A = π/4 · d²<br>Zylinder: V = A · h</div>
<p><strong>So geht's:</strong> Formel aufschreiben → alles in dieselbe Einheit → einsetzen → ausrechnen. m · m = m².</p>
<p><strong>Beispiel:</strong> 2,5 m · 60 cm → erst 60 cm = 0,6 m → A = 2,5 m · 0,6 m = 1,5 m².</p>
""",
 )

M[5] = dict(
 card=("⚖️", "Modul 5: Formeln umstellen", "Formeln umstellen mit dem Waage-Prinzip."),
 card_locked="Gesperrt. Schließe zuerst die Module 1 bis 4 ab.",
 title="Modul 5: Formeln umstellen",
 full=f"""
<h3>Wozu umstellen?</h3>
<p>Super, du hast das Profi-Modul freigeschaltet! Oft suchst du nicht das, was links in der Formel steht. Beispiel: Du kennst das Volumen und die Fläche, aber suchst die Höhe. Dann stellst du die Formel <strong>um</strong>.</p>

<h3>Das Waage-Prinzip</h3>
<p>Eine Formel ist wie eine Waage im Gleichgewicht. Was links steht, ist genauso viel wie rechts.</p>
{WAAGE}
<p>Du darfst rechnen, was du willst. Aber immer auf <strong>beiden Seiten</strong> gleich. Dann bleibt die Waage im Gleichgewicht.</p>

<h3>Die Gegenrechnung</h3>
<p>Mit der Gegenrechnung holst du eine Größe von ihrer Seite weg.</p>
{table(["steht in der Formel", "Gegenrechnung"], [["+ (plus)", "− (minus)"], ["− (minus)", "+ (plus)"], ["· (mal)", ": (geteilt)"], [": (geteilt)", "· (mal)"]])}

<h3>Beispiel: V = A · h nach h umstellen</h3>
{table(["Schritt", "Formel"], [
  ["① Formel", "V = A · h"],
  ["② h ist mit A malgenommen. Gegenrechnung: beide Seiten durch A teilen.", "V : A = A · h : A"],
  ["③ A : A kürzt sich weg.", "V : A = h"],
  ["④ Seiten tauschen", "<strong>h = V : A</strong>"]])}

<h3>Beispiel: L = l₁ + l₂ nach l₂ umstellen</h3>
{table(["Schritt", "Formel"], [
  ["① Formel", "L = l₁ + l₂"],
  ["② Gegenrechnung: auf beiden Seiten l₁ abziehen.", "L − l₁ = l₂"],
  ["③ Seiten tauschen", "<strong>l₂ = L − l₁</strong>"]])}
<div class="info-box"><h4>💡 Probe mit Zahlen</h4><p>Unsicher? Setze einfache Zahlen ein. Bei A = 2 und h = 3 ist V = 6. Stimmt h = V : A? 6 : 2 = 3. ✓</p></div>
""",
 short=f"""
{WAAGE}
<p>Auf <strong>beiden Seiten</strong> dasselbe rechnen. Gegenrechnung: + ↔ −, · ↔ :</p>
<p><strong>V = A · h</strong> nach h: beide Seiten durch A → <strong>h = V : A</strong>.</p>
<p><strong>L = l₁ + l₂</strong> nach l₂: auf beiden Seiten − l₁ → <strong>l₂ = L − l₁</strong>.</p>
<p><strong>Probe:</strong> Setze einfache Zahlen ein und prüfe.</p>
""",
 )

M[6] = dict(
 card=("🛁", "Modul 6: Mathe auf der Baustelle", "Rohrinhalt, Badewanne füllen, Speicher und Zuschnitt: Mathe auf der Baustelle."),
 card_locked="Gesperrt. Danach rechnest du echte Aufgaben von der Baustelle.",
 title="Modul 6: Mathe auf der Baustelle",
 full=f"""
<h3>Alles zusammen</h3>
<p>Jetzt brauchst du alles: Einheiten, Formeln und Umstellen. Gehe bei jeder Aufgabe gleich vor:</p>
<ol>
<li>Was ist <strong>gegeben</strong>? Was ist <strong>gesucht</strong>?</li>
<li>Welche <strong>Formel</strong> passt? Muss ich sie umstellen?</li>
<li>Alle Werte in passende <strong>Einheiten</strong> umrechnen.</li>
<li>Einsetzen und rechnen. Erst am Ende runden.</li>
<li>Ist das Ergebnis <strong>sinnvoll</strong>? Eine Badewanne fasst nicht 2 l und nicht 20 000 l.</li>
</ol>

<h3>Trick: In dm rechnen</h3>
<p>Wenn du Liter suchst, rechne alle Längen in <strong>dm</strong> um. Dann kommt das Volumen in dm³ heraus. Und 1 dm³ = 1 l.</p>

<h3>Der Volumenstrom</h3>
<p>Der <strong>Volumenstrom Q</strong> sagt, wie viel Wasser pro Zeit fließt, z. B. 12 Liter pro Minute.</p>
<div class="formula">Q = V : t &nbsp;&nbsp;→&nbsp;&nbsp; t = V : Q &nbsp;&nbsp;→&nbsp;&nbsp; V = Q · t</div>

<h3>Beispiel: Wasser in der Leitung</h3>
<p>Ein Kupferrohr 22 × 1 hat innen 20 mm Durchmesser. Die Leitung ist 10 m lang.</p>
{table(["Schritt", "Rechnung"], [
  ["① In dm", "d = 20 mm = 0,2 dm; l = 10 m = 100 dm"],
  ["② Fläche", "A = π/4 · (0,2 dm)² ≈ 0,0314 dm²"],
  ["③ Volumen", "V = 0,0314 dm² · 100 dm ≈ <strong>3,14 l</strong>"]])}
""",
 short=f"""
<p><strong>Vorgehen:</strong> gegeben/gesucht → Formel → Einheiten → rechnen → Ergebnis sinnvoll?</p>
<p><strong>Trick:</strong> Für Liter alle Längen in dm umrechnen. 1 dm³ = 1 l.</p>
<div class="formula">Q = V : t &nbsp;→&nbsp; t = V : Q</div>
<p><strong>Beispiel:</strong> Rohr innen 20 mm, 10 m lang → d = 0,2 dm, l = 100 dm → V ≈ 0,0314 dm² · 100 dm ≈ 3,14 l.</p>
""",
 )

# ---------------------------------------------------------------- Seite bauen
def build(variant):
    titles = {"full": "Mathe-Grundlagen SHK – Lernmodul", "short": "Mathe-Grundlagen SHK – Kompakt", "quiz": "Mathe-Grundlagen SHK – Quiz"}
    sub = {"full": "Rechenregeln, Einheiten und Formeln. Am Ende rechnest du Aufgaben von der Baustelle.",
           "short": "Das Wichtigste in Kürze. Am Ende rechnest du Aufgaben von der Baustelle.",
           "quiz": "Nur die Fragen. Teste, was du schon kannst."}[variant]
    cards = ""
    for n in range(1, 7):
        icon, t, d = M[n]["card"]
        locked = n > 4
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
        content = M[n]["full"] if variant == "full" else M[n]["short"] if variant == "short" else M[n].get("quiz_content", "")
        data[n] = dict(title=M[n]["title"], content=content)

    header_hint = '<div class="book-hint">🧮 Du darfst den Taschenrechner benutzen.</div>'
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
            <h1>🧮 Mathe-Grundlagen SHK 🧮</h1>
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
            <h2 id="expert-title" style="margin-top: 20px; color: #f8fafc;">MATHE-PROFI!</h2>
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
for v, fn in [("full", "mathe_komplett.html"), ("short", "mathe_kompakt.html"), ("quiz", "mathe_quiz.html")]:
    open(os.path.join(OUT, fn), "w", encoding="utf-8").write(build(v))
    print("geschrieben:", fn)
