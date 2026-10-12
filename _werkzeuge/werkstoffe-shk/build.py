# -*- coding: utf-8 -*-
"""Erzeugt die drei Varianten des Lernmoduls "Werkstoffe im SHK" nach dem Aufbau der C#-Vorlage."""
import json, re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(REPO, "werkstoffe-shk")
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
        /* ---------- Werkstoffgruppen (Fehler finden) ---------- */
        .groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 10px; text-align: left; }
        .group { background: #1e293b; border: 2px solid #475569; border-radius: 10px; padding: 10px; }
        .group-name { font-weight: bold; font-size: 15px; margin-bottom: 6px; }
        .group-item { background: #273449; border-radius: 6px; padding: 5px 8px; margin-top: 5px; font-size: 15px; color: #f1f5f9; }
        .quiz-question .sketch:has(.groups) { padding: 12px; }
"""

# ---------------------------------------------------------------- Skizzen
def baum_svg():
    # Senkrechter Baum: passt auch auf Handys ganz auf den Bildschirm
    F = 'font-family="Segoe UI, Arial"'
    rows = [("Werkstoffe", 0, ""), ("Metalle", 1, ""), ("Eisenmetalle", 2, "Stahl, Gusseisen"),
            ("Nichteisenmetalle", 2, ""), ("Schwermetalle", 3, "Kupfer, Zink, Blei"),
            ("Leichtmetalle", 3, "Aluminium, Titan"), ("Nichtmetalle", 1, ""),
            ("Naturstoffe", 2, "Holz, Hanf, Naturstein"), ("künstliche Stoffe", 2, "Kunststoffe, Glas, Keramik"),
            ("Verbundwerkstoffe", 1, "Verbundrohr, GFK")]
    col = {0: "#38bdf8", 1: "#fbbf24"}
    X = lambda l: 8 + l * 34
    Y = lambda r: 8 + r * 42
    lines, boxes = [], []
    for r, (label, l, ex) in enumerate(rows):
        if l > 0:
            pr = r - 1
            while rows[pr][1] != l - 1:
                pr -= 1
            px = X(l - 1) + 14
            lines.append(f'<path d="M{px} {Y(pr) + 32} V{Y(r) + 16} H{X(l)}" fill="none" stroke="#64748b" stroke-width="2"/>')
        c = col.get(l, "#64748b")
        fw = ' font-weight="bold"' if l < 2 else ''
        boxes.append(f'<rect x="{X(l)}" y="{Y(r)}" width="160" height="32" rx="8" fill="#1e293b" stroke="{c}" stroke-width="2"/>'
                     f'<text x="{X(l) + 12}" y="{Y(r) + 21}" fill="#f8fafc" font-size="15"{fw} {F}>{label}</text>')
        if ex:
            boxes.append(f'<text x="{X(l) + 168}" y="{Y(r) + 21}" fill="#94a3b8" font-size="13" {F}>{ex}</text>')
    return ('<div class="sketch"><h4 style="color:#38bdf8; margin-bottom:10px;">Einteilung der Werkstoffe</h4>'
            '<svg viewBox="0 0 410 432" style="max-width:520px; min-width:0" role="img" aria-label="Einteilungs-Schema der Werkstoffe">'
            + "".join(lines) + "".join(boxes) +
            '</svg><p class="caption">Leichtmetalle: Dichte unter 5 kg/dm³. Schwermetalle: Dichte über 5 kg/dm³.</p></div>')

SKETCH_BAUM = baum_svg()

SKETCH_MVR = """
<div class="sketch">
<h4 style="color:#38bdf8; margin-bottom:10px;">Mehrschichtverbundrohr im Schnitt</h4>
<svg viewBox="0 0 520 260" role="img" aria-label="Schnitt durch ein Mehrschichtverbundrohr">
  <circle cx="160" cy="130" r="110" fill="#94a3b8"/>
  <circle cx="160" cy="130" r="88" fill="#e2e8f0"/>
  <circle cx="160" cy="130" r="80" fill="#cbd5e1"/>
  <circle cx="160" cy="130" r="58" fill="#0ea5e9" fill-opacity="0.55"/>
  <text x="160" y="136" fill="#f8fafc" font-size="15" text-anchor="middle" font-family="Segoe UI, Arial">Wasser</text>
  <line x1="160" y1="62" x2="330" y2="62" stroke="#f8fafc" stroke-width="1.5"/><circle cx="160" cy="62" r="3" fill="#f8fafc"/>
  <text x="336" y="67" fill="#f8fafc" font-size="14" font-family="Segoe UI, Arial">Kunststoff innen</text>
  <line x1="160" y1="46" x2="330" y2="125" stroke="#f8fafc" stroke-width="1.5"/><circle cx="160" cy="46" r="3" fill="#f8fafc"/>
  <text x="336" y="130" fill="#f8fafc" font-size="14" font-family="Segoe UI, Arial">Aluminium</text>
  <line x1="248" y1="180" x2="330" y2="188" stroke="#f8fafc" stroke-width="1.5"/><circle cx="248" cy="180" r="3" fill="#f8fafc"/>
  <text x="336" y="193" fill="#f8fafc" font-size="14" font-family="Segoe UI, Arial">Kunststoff außen</text>
</svg>
<p class="caption">Zwischen den Schichten liegt ein dünner Kleber (Haftvermittler).</p>
</div>
"""

SKETCH_FLIESS = """
<div class="sketch">
<h4 style="color:#38bdf8; margin-bottom:10px;">Fließregel</h4>
<svg viewBox="0 0 520 170" role="img" aria-label="Fließregel: verzinkter Stahl vor Kupfer ist erlaubt, Kupfer vor verzinktem Stahl nicht">
  <defs><marker id="arF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="#38bdf8"/></marker></defs>
  <rect x="20" y="25" width="170" height="30" rx="6" fill="#94a3b8"/><text x="105" y="45" fill="#0f172a" font-size="14" text-anchor="middle" font-family="Segoe UI, Arial">verzinkter Stahl</text>
  <rect x="190" y="25" width="170" height="30" rx="6" fill="#d97706"/><text x="275" y="45" fill="#0f172a" font-size="14" text-anchor="middle" font-family="Segoe UI, Arial">Kupfer</text>
  <line x1="40" y1="70" x2="340" y2="70" stroke="#38bdf8" stroke-width="2" marker-end="url(#arF)"/>
  <text x="440" y="47" fill="#4ade80" font-size="17" font-weight="bold" text-anchor="middle" font-family="Segoe UI, Arial">✓ erlaubt</text>
  <rect x="20" y="105" width="170" height="30" rx="6" fill="#d97706"/><text x="105" y="125" fill="#0f172a" font-size="14" text-anchor="middle" font-family="Segoe UI, Arial">Kupfer</text>
  <rect x="190" y="105" width="170" height="30" rx="6" fill="#94a3b8"/><text x="275" y="125" fill="#0f172a" font-size="14" text-anchor="middle" font-family="Segoe UI, Arial">verzinkter Stahl</text>
  <line x1="40" y1="150" x2="340" y2="150" stroke="#38bdf8" stroke-width="2" marker-end="url(#arF)"/>
  <text x="440" y="127" fill="#f87171" font-size="17" font-weight="bold" text-anchor="middle" font-family="Segoe UI, Arial">✗ verboten</text>
</svg>
<p class="caption">Der blaue Pfeil zeigt die Fließrichtung des Wassers.</p>
</div>
"""

BOOK = lambda txt: f'<div class="book-box"><h4>📘 Nimm dein Tabellenbuch</h4><p>{txt}</p></div>'

# ---------------------------------------------------------------- Inhalte
M = {}

M[1] = dict(
 card=("🗂️", "Modul 1: Einteilung der Werkstoffe", "Metalle, Nichtmetalle und Verbundwerkstoffe. Das große Schema."),
 title="Modul 1: Einteilung der Werkstoffe",
 full=f"""
<h3>Was ist ein Werkstoff?</h3>
<p>Ein <strong>Werkstoff</strong> ist ein Material, aus dem man Bauteile herstellt. Im SHK-Handwerk sind das zum Beispiel Rohre, Fittings, Armaturen, Heizkörper und Dichtungen.</p>
<p>Es gibt sehr viele Werkstoffe. Damit man den Überblick behält, teilt man sie in <strong>Gruppen</strong> ein.</p>

<h3>Die drei Hauptgruppen</h3>
<ul>
<li><strong>Metalle:</strong> z. B. Stahl, Kupfer, Aluminium. Sie leiten Wärme und Strom gut.</li>
<li><strong>Nichtmetalle:</strong> z. B. Kunststoffe, Glas, Keramik, Holz, Hanf.</li>
<li><strong>Verbundwerkstoffe:</strong> Mehrere Werkstoffe sind fest miteinander verbunden. Beispiel: das Mehrschichtverbundrohr aus Kunststoff und Aluminium.</li>
</ul>

<h3>Die Metalle genauer</h3>
<p>Metalle teilt man nach dem <strong>Eisen</strong> ein:</p>
<ul>
<li><strong>Eisenmetalle:</strong> Eisen ist der Hauptbestandteil. Dazu gehören Stahl und Gusseisen.</li>
<li><strong>Nichteisenmetalle (NE-Metalle):</strong> alle anderen Metalle, z. B. Kupfer, Zink, Aluminium.</li>
</ul>
<p>Die Nichteisenmetalle teilt man nach der <strong>Dichte</strong> ein:</p>
<ul>
<li><strong>Leichtmetalle:</strong> Dichte <strong>unter 5 kg/dm³</strong>, z. B. Aluminium.</li>
<li><strong>Schwermetalle:</strong> Dichte <strong>über 5 kg/dm³</strong>, z. B. Kupfer.</li>
</ul>
{SKETCH_BAUM}
<div class="info-box"><h4>🧠 Merkhilfe</h4><p>Erste Frage: Metall, Nichtmetall oder Verbund? Bei Metallen: Ist Eisen der Hauptbestandteil? Wenn nein: leichter oder schwerer als 5 kg/dm³?</p></div>
""",
 short=f"""
<h3>Drei Hauptgruppen</h3>
<ul>
<li><strong>Metalle:</strong> Stahl, Kupfer, Aluminium ...</li>
<li><strong>Nichtmetalle:</strong> Kunststoffe, Glas, Keramik, Holz, Hanf ...</li>
<li><strong>Verbundwerkstoffe:</strong> mehrere Werkstoffe fest verbunden, z. B. Mehrschichtverbundrohr.</li>
</ul>
<p><strong>Eisenmetalle:</strong> Eisen ist der Hauptbestandteil. <strong>Nichteisenmetalle:</strong> alle anderen Metalle. Diese teilt man in <strong>Leichtmetalle</strong> (unter 5 kg/dm³) und <strong>Schwermetalle</strong> (über 5 kg/dm³).</p>
{SKETCH_BAUM}
""",
 )

M[2] = dict(
 card=("⚙️", "Modul 2: Eisenmetalle", "Stahl, Edelstahl und Gusseisen. Wo setzt man sie im SHK ein?"),
 title="Modul 2: Eisenmetalle",
 full=f"""
<h3>Stahl und Gusseisen</h3>
<p>Bei Eisenmetallen ist <strong>Eisen</strong> der Hauptbestandteil. Dazu kommt immer etwas <strong>Kohlenstoff</strong>. Der Kohlenstoff entscheidet, ob es Stahl oder Gusseisen ist.</p>
{table(["", "Stahl", "Gusseisen"], [
  ["Kohlenstoff", "bis etwa 2 %", "über 2 %"],
  ["Eigenschaften", "zäh, gut verformbar, schweißbar", "spröde, gut gießbar, dämpft Geräusche"],
  ["Im SHK z. B.", "Heizkörper, Heizungsrohre, Speicher", "SML-Abwasserrohre, Gussheizkessel"]])}

<h3>Unlegierter Stahl</h3>
<p>Unlegierter Stahl ist preiswert und fest. Er <strong>rostet</strong> aber, wenn Wasser und Sauerstoff dran kommen.</p>
<ul>
<li><strong>C-Stahl-Rohre</strong> sind aus unlegiertem Stahl. Sie sind außen verzinkt oder mit Kunststoff ummantelt. Man verbindet sie mit Pressfittings.</li>
<li>C-Stahl nimmt man nur für <strong>geschlossene Heizungsanlagen</strong>. Im Heizungswasser ist kaum Sauerstoff.</li>
<li>Für <strong>Trinkwasser</strong> ist C-Stahl verboten. Trinkwasser enthält viel Sauerstoff. Das Rohr würde innen rosten.</li>
</ul>

<h3>Edelstahl</h3>
<p>Edelstahl ist ein <strong>legierter Stahl</strong>. Er enthält viel <strong>Chrom</strong> (mindestens 10,5 %). Das Chrom bildet eine sehr dünne Schutzschicht. Deshalb rostet Edelstahl nicht.</p>
<p>Im SHK nimmt man Edelstahl z. B. für <strong>Trinkwasser-Pressrohre</strong>, Duschrinnen und Spülen.</p>
<div class="info-box"><h4>⚠️ Merke</h4><p>Edelstahl ist auch ein Eisenmetall. Er ist kein Nichteisenmetall, obwohl er nicht rostet.</p></div>

<h3>Gusseisen</h3>
<p>Gusseisen wird flüssig in eine Form gegossen. So kann man auch schwierige Formen herstellen, z. B. die Glieder eines Heizkessels.</p>
<p><strong>SML-Rohre</strong> für Abwasser sind aus Gusseisen. Sie sind schwer, aber sehr <strong>leise</strong> und <strong>nicht brennbar</strong>.</p>
""",
 short=f"""
{table(["", "Stahl", "Gusseisen"], [
  ["Kohlenstoff", "bis etwa 2 %", "über 2 %"],
  ["Eigenschaften", "zäh, verformbar, schweißbar", "spröde, gießbar, leise"],
  ["Im SHK z. B.", "Heizkörper, Heizungsrohre", "SML-Abwasserrohre, Gussheizkessel"]])}
<ul>
<li><strong>C-Stahl</strong> (unlegiert): nur für geschlossene Heizungsanlagen. Für Trinkwasser verboten, weil er innen rosten würde.</li>
<li><strong>Edelstahl</strong>: viel Chrom, rostet nicht. Für Trinkwasser-Pressrohre. Edelstahl ist ein Eisenmetall!</li>
</ul>
""",
 )

M[3] = dict(
 card=("🟠", "Modul 3: Nichteisenmetalle", "Schwermetalle und Leichtmetalle. Kupfer, Zink, Aluminium und Legierungen."),
 title="Modul 3: Nichteisenmetalle",
 full=f"""
<h3>Schwer oder leicht?</h3>
<p>Nichteisenmetalle teilt man nach der <strong>Dichte</strong> ein. Die Dichte sagt, wie schwer 1 dm³ eines Stoffes ist. 1 dm³ ist so groß wie ein Liter.</p>
<div class="formula">Dichte unter 5 kg/dm³ → Leichtmetall<br>Dichte über 5 kg/dm³ → Schwermetall</div>
{table(["Metall", "Dichte (ungefähr)", "Gruppe"], [
  ["Aluminium", "2,7 kg/dm³", "Leichtmetall"],
  ["Titan", "4,5 kg/dm³", "Leichtmetall"],
  ["Zink", "7,1 kg/dm³", "Schwermetall"],
  ["Kupfer", "8,9 kg/dm³", "Schwermetall"],
  ["Blei", "11,3 kg/dm³", "Schwermetall"]])}

<h3>Wichtige NE-Metalle im SHK</h3>
<ul>
<li><strong>Kupfer:</strong> der klassische Rohrwerkstoff für Trinkwasser, Heizung und Gas. Kupfer lässt sich gut biegen, löten und pressen.</li>
<li><strong>Zink:</strong> schützt Stahl vor Rost (Verzinken). Dachrinnen sind oft aus <strong>Titanzink</strong>.</li>
<li><strong>Aluminium:</strong> sehr leicht. Man findet es im Mehrschichtverbundrohr und in leichten Heizkörpern.</li>
<li><strong>Blei:</strong> früher für Wasserleitungen. Blei ist <strong>giftig</strong>. Für Trinkwasser ist es nicht mehr erlaubt.</li>
</ul>

<h3>Legierungen</h3>
<p>Eine <strong>Legierung</strong> ist eine Mischung aus mehreren Metallen. Sie hat oft bessere Eigenschaften als die reinen Metalle.</p>
{table(["Legierung", "besteht aus", "Im SHK z. B."], [
  ["Messing", "Kupfer + Zink", "Armaturen, Fittings, Ventile"],
  ["Bronze", "Kupfer + Zinn", "Lager, Gleitteile"],
  ["Rotguss", "Kupfer + Zinn + Zink (oft etwas Blei)", "Fittings und Armaturen für Trinkwasser"]])}
""",
 short=f"""
<div class="formula">unter 5 kg/dm³ → Leichtmetall (Aluminium, Titan, Magnesium)<br>über 5 kg/dm³ → Schwermetall (Kupfer, Zink, Blei)</div>
<ul>
<li><strong>Kupfer:</strong> Rohre für Trinkwasser, Heizung, Gas. Gut lötbar und pressbar.</li>
<li><strong>Zink:</strong> Verzinkung, Dachrinnen aus Titanzink.</li>
<li><strong>Aluminium:</strong> leicht. Verbundrohr, Heizkörper.</li>
<li><strong>Blei:</strong> giftig. Für Trinkwasser nicht mehr erlaubt.</li>
</ul>
<p><strong>Legierungen:</strong> Messing = Kupfer + Zink. Bronze = Kupfer + Zinn. Rotguss = Kupfer + Zinn + Zink.</p>
""",
 )

M[4] = dict(
 card=("🧪", "Modul 4: Kunststoffe", "Thermoplaste, Duroplaste und Elastomere. PE, PP, PVC-U, PE-X und EPDM."),
 title="Modul 4: Kunststoffe",
 full=f"""
<h3>Drei Gruppen</h3>
<p>Kunststoffe gehören zu den <strong>Nichtmetallen</strong>. Sie werden künstlich hergestellt, meistens aus Erdöl. Kunststoffe bestehen aus langen Ketten (Molekülen). Wie diese Ketten verbunden sind, bestimmt die Gruppe.</p>
{table(["", "Thermoplaste", "Duroplaste", "Elastomere"], [
  ["Ketten", "nicht verbunden", "eng vernetzt", "weit vernetzt"],
  ["Bei Wärme", "werden weich und formbar", "bleiben hart", "bleiben elastisch"],
  ["Schweißen", "meistens möglich", "nicht möglich", "nicht möglich"],
  ["Im SHK z. B.", "Rohre aus PE, PP, PVC-U, PE-X", "WC-Sitz, Harz-Beschichtungen", "Dichtungen aus EPDM, Schläuche"]])}
<div class="info-box"><h4>🧠 Merkhilfe</h4><p><strong>Thermo</strong> heißt Wärme: wird bei Wärme weich. <strong>Duro</strong> heißt hart: bleibt hart. <strong>Elasto</strong>: elastisch wie Gummi.</p></div>

<h3>Kunststoffe im SHK</h3>
<ul>
<li><strong>PE</strong> (Polyethylen): Rohre für Wasser- und Gas-Hausanschlüsse in der Erde.</li>
<li><strong>PP</strong> (Polypropylen): HT-Abwasserrohre im Haus. Leicht und steckbar.</li>
<li><strong>PVC-U</strong> (hartes PVC, ohne Weichmacher): KG-Rohre in der Erde.</li>
<li><strong>PE-X</strong> (vernetztes PE): Rohre für Fußbodenheizung und Trinkwasser.</li>
<li><strong>EPDM</strong> (synthetischer Gummi): O-Ringe in Pressfittings, Dichtungen.</li>
</ul>

<h3>Sonderfall PE-X</h3>
<p>PE-X ist ein <strong>Thermoplast</strong>. Seine Ketten sind aber zusätzlich vernetzt. Dadurch ist es fester und hält mehr Wärme aus.</p>
<p>Aber: PE-X kann man <strong>nicht schweißen</strong>. Man verbindet es mit Press- oder Klemmverbindern.</p>
""",
 short=f"""
{table(["", "Thermoplaste", "Duroplaste", "Elastomere"], [
  ["Bei Wärme", "weich, formbar", "bleiben hart", "bleiben elastisch"],
  ["Schweißen", "meistens ja", "nein", "nein"],
  ["Im SHK", "PE, PP, PVC-U, PE-X", "WC-Sitz, Harze", "EPDM-Dichtungen"]])}
<p><strong>PE-X</strong> ist ein Thermoplast. Weil es vernetzt ist, kann man es nicht schweißen. Man presst oder klemmt es.</p>
""",
 )

M[5] = dict(
 card=("🧱", "Modul 5: Verbund und andere Nichtmetalle", "Mehrschichtverbundrohr, Keramik, Glas und Hanf. Und: Findest du den Fehler?"),
 card_locked="Gesperrt. Schließe zuerst die Module 1 bis 4 ab.",
 title="Modul 5: Verbundwerkstoffe und andere Nichtmetalle",
 full=f"""
<h3>Verbundwerkstoffe</h3>
<p>Super, du hast das Profi-Modul freigeschaltet! Bei einem <strong>Verbundwerkstoff</strong> sind mehrere Werkstoffe fest verbunden. Jeder bringt seine guten Eigenschaften mit.</p>
<p>Das wichtigste Beispiel im SHK ist das <strong>Mehrschichtverbundrohr</strong>:</p>
{SKETCH_MVR}
<ul>
<li><strong>Kunststoff innen:</strong> Er berührt das Wasser. Er ist glatt und korrodiert nicht.</li>
<li><strong>Aluminium in der Mitte:</strong> Es hält das Rohr nach dem Biegen in Form. Es lässt keinen Sauerstoff durch. Und das Rohr dehnt sich bei Wärme weniger aus.</li>
<li><strong>Kunststoff außen:</strong> Er schützt das Aluminium.</li>
</ul>
<p>Weitere Verbundwerkstoffe: <strong>GFK</strong> (glasfaserverstärkter Kunststoff, z. B. unter Acryl-Badewannen) und <strong>Stahlbeton</strong>.</p>

<h3>Naturstoffe und künstliche Stoffe</h3>
<p>Die Nichtmetalle teilt man in zwei Gruppen:</p>
<ul>
<li><strong>Naturstoffe</strong> kommen in der Natur vor oder wachsen. Im SHK: <strong>Hanf</strong> zum Abdichten von Gewinden, Holz, Naturstein.</li>
<li><strong>Künstliche Stoffe</strong> stellt der Mensch her: Kunststoffe, <strong>Sanitärkeramik</strong> (WC, Waschtisch), <strong>Glas</strong> (Duschwand), <strong>Mineralwolle</strong> (Dämmung).</li>
</ul>

<h3>Alles zusammen</h3>
{SKETCH_BAUM}
""",
 short=f"""
<h3>Mehrschichtverbundrohr</h3>
{SKETCH_MVR}
<p>Innen und außen Kunststoff, in der Mitte Aluminium. Das Aluminium hält das Rohr in Form, sperrt Sauerstoff und verringert die Ausdehnung.</p>
<p>Weitere Verbundwerkstoffe: GFK, Stahlbeton.</p>
<h3>Andere Nichtmetalle</h3>
<p><strong>Naturstoffe:</strong> Hanf, Holz, Naturstein. <strong>Künstliche Stoffe:</strong> Kunststoffe, Keramik, Glas, Mineralwolle.</p>
""",
 )

M[6] = dict(
 card=("🔧", "Modul 6: Den richtigen Werkstoff wählen", "Den passenden Werkstoff wählen. Fließregel. Masse mit dem Tabellenbuch berechnen."),
 card_locked="Gesperrt. Danach wählst du Werkstoffe aus und rechnest mit dem Tabellenbuch.",
 title="Modul 6: Den richtigen Werkstoff wählen",
 full=f"""
<h3>Welcher Werkstoff passt?</h3>
<p>Für jede Aufgabe gibt es einen passenden Werkstoff. Du fragst dich:</p>
<ul>
<li>Welches <strong>Medium</strong> fließt durch? Trinkwasser, Heizungswasser, Abwasser oder Gas?</li>
<li>Wie <strong>warm</strong> wird es? Kunststoffe halten weniger Wärme aus als Metalle.</li>
<li>Kann der Werkstoff <strong>korrodieren</strong> (rosten)?</li>
<li>Wie wird <strong>verbunden</strong>? Löten, pressen, stecken, schweißen?</li>
<li>Wie <strong>schwer</strong> ist das Bauteil, und was kostet es?</li>
</ul>

<h3>Längenausdehnung</h3>
<p>Alle Rohre werden bei Wärme länger. <strong>Kunststoffrohre</strong> dehnen sich aber viel stärker aus als Metallrohre, etwa zehnmal so stark wie Kupfer. Darum braucht man bei Kunststoffrohren mehr Platz für die Ausdehnung. Das Mehrschichtverbundrohr dehnt sich wegen des Aluminiums weniger aus.</p>

<h3>Die Fließregel</h3>
<p>Wasser nimmt aus Kupferrohren winzige Kupferteilchen mit. Treffen diese Teilchen auf <strong>verzinkten Stahl</strong>, entstehen dort kleine Löcher. Das Rohr wird undicht (Lochfraß).</p>
{SKETCH_FLIESS}
<div class="info-box"><h4>⚠️ Fließregel</h4><p>In Fließrichtung darf verzinkter Stahl <strong>nie hinter Kupfer</strong> eingebaut werden. Das gilt auch, wenn ein anderes Rohr dazwischen ist.</p></div>

<h3>Masse berechnen</h3>
<p>Wie schwer ist eine Lieferung Rohre oder ein Blech? Das brauchst du z. B. für den Transport. Du rechnest mit der <strong>Dichte ρ</strong> (sprich: rho).</p>
<div class="formula">m = V · ρ<br><span style="color:#94a3b8;">m = Masse in kg, V = Volumen in dm³, ρ = Dichte in kg/dm³</span></div>
{BOOK("Die Dichte findest du im Tabellenbuch. Tipp: Schau im Sachwortverzeichnis unter „Dichte“ nach. Achtung: In verschiedenen Büchern stehen manchmal leicht andere Werte, z. B. 8,9 oder 8,93 kg/dm³ für Kupfer. Beides ist richtig.")}
<h3>Beispiel: Kupferblech</h3>
<p>Ein Kupferblech ist 2 m lang, 1 m breit und 0,8 mm dick.</p>
{table(["Schritt", "Rechnung"], [
  ["① In dm umrechnen", "2 m = 20 dm, 1 m = 10 dm, 0,8 mm = 0,008 dm"],
  ["② Volumen", "V = 20 dm · 10 dm · 0,008 dm = <strong>1,6 dm³</strong>"],
  ["③ Dichte (Tabellenbuch)", "Kupfer: ρ ≈ 8,93 kg/dm³"],
  ["④ Masse", "m = 1,6 dm³ · 8,93 kg/dm³ ≈ <strong>14,29 kg</strong>"]])}
<div class="info-box"><h4>💡 Tipp</h4><p>Merke dir: 1 m = 10 dm und 1 mm = 0,01 dm.</p></div>
""",
 short=f"""
<h3>Werkstoff wählen</h3>
<p>Frage: Welches Medium? Wie warm? Korrosion? Wie verbinden? Gewicht und Preis?</p>
<p>Kunststoffrohre dehnen sich bei Wärme etwa zehnmal so stark aus wie Kupferrohre.</p>
{SKETCH_FLIESS}
<p><strong>Fließregel:</strong> Verzinkter Stahl nie in Fließrichtung hinter Kupfer.</p>
<h3>Masse berechnen</h3>
<div class="formula">m = V · ρ &nbsp;&nbsp;(kg = dm³ · kg/dm³)</div>
{BOOK("Dichte im Tabellenbuch, Sachwortverzeichnis unter „Dichte“. Kleine Unterschiede zwischen Büchern sind in Ordnung.")}
<p><strong>Beispiel:</strong> Kupferblech 2 m × 1 m × 0,8 mm → V = 20 · 10 · 0,008 = 1,6 dm³ → m ≈ 1,6 · 8,93 ≈ 14,29 kg.</p>
""",
 quiz_content=BOOK("Für dieses Modul brauchst du die Dichte aus dem Tabellenbuch (Sachwortverzeichnis: „Dichte“). Formel: m = V · ρ."),
 )

# ---------------------------------------------------------------- Seite bauen
def build(variant):
    titles = {"full": "Werkstoffe im SHK – Lernmodul", "short": "Werkstoffe im SHK – Kompakt", "quiz": "Werkstoffe im SHK – Quiz"}
    sub = {"full": "Welche Werkstoffe gibt es, und wie teilt man sie ein? Am Ende wählst du selbst den passenden Werkstoff.",
           "short": "Das Wichtigste in Kürze. Am Ende wählst du den passenden Werkstoff.",
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
        if variant == "full":
            content = M[n]["full"]
        elif variant == "short":
            content = M[n]["short"]
        else:
            content = M[n].get("quiz_content", "")
        data[n] = dict(title=M[n]["title"], content=content)

    header_hint = '<div class="book-hint">📘 Für Modul 6 brauchst du dein Tabellenbuch.</div>'
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
            <h1>🔧 Werkstoffe im SHK 🔧</h1>
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
            <h2 id="expert-title" style="margin-top: 20px; color: #f8fafc;">WERKSTOFF-PROFI!</h2>
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
for v, fn in [("full", "werkstoffe_komplett.html"), ("short", "werkstoffe_kompakt.html"), ("quiz", "werkstoffe_quiz.html")]:
    open(os.path.join(OUT, fn), "w", encoding="utf-8").write(build(v))
    print("geschrieben:", fn)
