# -*- coding: utf-8 -*-
"""Erzeugt die drei Varianten des Lernmoduls "Werkstoffe Metall" nach dem Aufbau der C#-Vorlage."""
import json, re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(REPO, "werkstoffe-metall")
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

css += """
        /* ---------- Regal (Modul 6) ---------- */
        .regal { display: grid; grid-template-columns: repeat(auto-fit, minmax(118px, 1fr)); gap: 8px; background: #1e293b;
                 border: 3px solid #94a3b8; border-radius: 8px; padding: 8px; max-width: 620px; margin: 0 auto; }
        .fach { border: 2px solid #475569; border-radius: 6px; padding: 12px 6px; text-align: center; color: #f8fafc;
                font-size: 16px; line-height: 1.35; hyphens: manual; }
        .fach b { display: block; color: #fbbf24; margin-bottom: 4px; }
"""

# ---------------------------------------------------------------- Skizzen
def baum_svg(beispiele=True):
    # Senkrechter Baum wie in Modul 1 der Aufgaben: passt auch auf Handys
    F = 'font-family="Segoe UI, Arial"'
    rows = [("Werkstoffe", 0, ""), ("Metalle", 1, ""), ("Eisenwerkstoffe", 2, ""),
            ("Stähle", 3, "Baustahl, Werkzeugstahl"), ("Eisen-Gusswerkstoffe", 3, "Gusseisen, Stahlguss"),
            ("Nichteisenmetalle", 2, ""), ("Schwermetalle", 3, "Kupfer, Zink, Blei"), ("Leichtmetalle", 3, "Aluminium, Titan"),
            ("Nichtmetalle", 1, ""), ("Künstliche Nichtmetallwerkstoffe", 2, "Kunststoff, Glas, Keramik"),
            ("Naturwerkstoffe", 2, "Holz, Granit, Grafit"), ("Verbundwerkstoffe", 1, "GFK, CFK, Hartmetall")]
    col = {0: "#38bdf8", 1: "#fbbf24"}
    X = lambda l: 8 + l * 30
    Y = lambda r: 8 + r * (52 if beispiele else 42)
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
        w = 250 if len(label) > 22 else 180
        boxes.append(f'<rect x="{X(l)}" y="{Y(r)}" width="{w}" height="32" rx="8" fill="#1e293b" stroke="{c}" stroke-width="2"/>'
                     f'<text x="{X(l) + 12}" y="{Y(r) + 21}" fill="#f8fafc" font-size="15"{fw} {F}>{label}</text>')
        if ex and beispiele:
            boxes.append(f'<text x="{X(l) + 12}" y="{Y(r) + 47}" fill="#94a3b8" font-size="13" {F}>z. B. {ex}</text>')
    H = Y(len(rows) - 1) + (52 if beispiele else 42)
    return ('<div class="sketch"><h4 style="color:#38bdf8; margin-bottom:10px;">Einteilung der Werkstoffe</h4>'
            f'<svg viewBox="0 0 340 {H}" style="max-width:420px; min-width:0" role="img" aria-label="Einteilungs-Schema der Werkstoffe">'
            + "".join(lines) + "".join(boxes) +
            '</svg><p class="caption">Die unterste Ebene hat sieben Gruppen. Jede bekommt im Regal ein eigenes Fach.</p></div>')

SKETCH_BAUM = baum_svg(True)
SKETCH_BAUM_KURZ = baum_svg(False)

REGAL = """
<div class="sketch">
<h4 style="color:#38bdf8; margin-bottom:10px;">Das neue Regal</h4>
<div class="regal"><div class="fach"><b>Fach 1</b>Stähle</div><div class="fach"><b>Fach 2</b>Eisen-Guss&shy;werkstoffe</div><div class="fach"><b>Fach 3</b>Schwer&shy;metalle</div><div class="fach"><b>Fach 4</b>Leicht&shy;metalle</div><div class="fach"><b>Fach 5</b>Künstliche Nichtmetall&shy;werkstoffe</div><div class="fach"><b>Fach 6</b>Natur&shy;werkstoffe</div><div class="fach"><b>Fach 7</b>Verbund&shy;werkstoffe</div></div>
</div>
"""

BOOK = lambda txt: f'<div class="book-box"><h4>📘 Nimm dein Tabellenbuch</h4><p>{txt}</p></div>'
SITUATION = """<div class="info-box"><h4>🧰 Deine Situation</h4><p>Du bist im ersten Lehrjahr in einem Metallbaubetrieb. Das Materiallager wird neu eingerichtet. Ein neues Regal hat <strong>sieben Fächer</strong>. Darin sollen Werkstoffreste und Ersatzteile nach <strong>Werkstoffgruppen</strong> sortiert werden. Dein Ausbilder stellt dir eine volle Kiste hin: Du sollst die Fächer beschriften und alles einsortieren.</p></div>"""

# ---------------------------------------------------------------- Inhalte
M = {}

M[1] = dict(
 card=("🗂️", "Modul 1: Die drei Hauptgruppen", "Metalle, Nichtmetalle und Verbundwerkstoffe. Das große Schema."),
 title="Modul 1: Die drei Hauptgruppen",
 full=f"""
{SITUATION}
<h3>Warum teilt man Werkstoffe ein?</h3>
<p>Ein <strong>Werkstoff</strong> ist ein Material, aus dem man Bauteile herstellt. Es gibt sehr viele Werkstoffe. Damit man den Überblick behält, ordnet man sie in <strong>Gruppen</strong>. Werkstoffe in einer Gruppe sind ähnlich aufgebaut und haben ähnliche Eigenschaften.</p>

<h3>Die drei Hauptgruppen</h3>
<ul>
<li><strong>Metalle:</strong> z. B. Stahl, Gusseisen, Kupfer, Aluminium.</li>
<li><strong>Nichtmetalle:</strong> z. B. Kunststoff, Glas, Keramik, Holz.</li>
<li><strong>Verbundwerkstoffe:</strong> Mehrere Werkstoffe sind fest verbunden, z. B. GFK oder Hartmetall.</li>
</ul>

<h3>Die Untergruppen</h3>
<p><strong>Metalle</strong> teilt man nach dem <strong>Eisen</strong> ein:</p>
<ul>
<li><strong>Eisenwerkstoffe:</strong> Sie haben Eisen als Basis. Dazu gehören die Stähle und die Eisen-Gusswerkstoffe.</li>
<li><strong>Nichteisenmetalle</strong> (kurz NE-Metalle): alle anderen Metalle. Man teilt sie nach der <strong>Dichte</strong> in <strong>Schwermetalle</strong> und <strong>Leichtmetalle</strong>. Wo die Grenze liegt, schlägst du in Modul 3 selbst nach.</li>
</ul>
<p><strong>Nichtmetalle</strong> teilt man nach ihrer Herkunft ein:</p>
<ul>
<li><strong>Künstliche Nichtmetallwerkstoffe:</strong> Der Mensch stellt sie her, z. B. Kunststoff, Glas, Keramik.</li>
<li><strong>Naturwerkstoffe:</strong> Sie kommen in der Natur vor, z. B. Holz, Granit, Grafit.</li>
</ul>
{SKETCH_BAUM}
<div class="info-box"><h4>🧠 Merkhilfe</h4><p>Erste Frage: Metall, Nichtmetall oder Verbund? Bei Metallen: Ist Eisen die Basis? Wenn nein: Wie groß ist die Dichte? Bei Nichtmetallen: natürlich oder vom Menschen gemacht?</p></div>
""",
 short=f"""
<p><strong>Situation:</strong> Ein neues Regal mit sieben Fächern. Du sortierst Werkstoffreste nach Werkstoffgruppen ein.</p>
<ul>
<li><strong>Metalle:</strong> Eisenwerkstoffe (Stähle, Eisen-Gusswerkstoffe) und Nichteisenmetalle (Schwer- und Leichtmetalle, nach der Dichte).</li>
<li><strong>Nichtmetalle:</strong> künstliche Nichtmetallwerkstoffe (Kunststoff, Glas, Keramik) und Naturwerkstoffe (Holz, Granit, Grafit).</li>
<li><strong>Verbundwerkstoffe:</strong> mehrere Werkstoffe fest verbunden, z. B. GFK, Hartmetall.</li>
</ul>
{SKETCH_BAUM_KURZ}
""",
 )

M[2] = dict(
 card=("⚙️", "Modul 2: Eisenwerkstoffe", "Stähle und Eisen-Gusswerkstoffe. Was können sie, und wofür nimmt man sie?"),
 title="Modul 2: Eisenwerkstoffe",
 full=f"""
<h3>Eisen als Basis</h3>
<p>Eisenwerkstoffe bestehen zum größten Teil aus <strong>Eisen</strong>. Dazu kommt immer etwas <strong>Kohlenstoff</strong>. Der Kohlenstoff macht den großen Unterschied.</p>

<h3>Stähle</h3>
<ul>
<li>Kohlenstoff: bis etwa <strong>2 %</strong>.</li>
<li><strong>Große Festigkeit</strong> und <strong>zäh</strong>. Sie halten große Kräfte und Stöße aus.</li>
<li>Gut umformbar (biegen, schmieden) und meistens gut schweißbar.</li>
<li>Beispiele: Wellen, Schrauben, Zahnräder, Träger, Bohrer.</li>
</ul>
<p>Es gibt viele Stahlsorten, zum Beispiel <strong>Baustahl</strong>, <strong>Vergütungsstahl</strong> (für Wellen), <strong>Werkzeugstahl</strong> (für Werkzeuge) und <strong>nichtrostenden Stahl</strong>.</p>

<h3>Eisen-Gusswerkstoffe</h3>
<p>Diese Werkstoffe werden flüssig in eine <strong>Form gegossen</strong>. So entstehen auch Teile mit schwieriger Form in einem Stück.</p>
<ul>
<li><strong>Gusseisen:</strong> mehr als 2 % Kohlenstoff. Sehr gut vergießbar und dämpft Schwingungen. Aber: <strong>spröde</strong>. Bei einem starken Schlag kann es brechen.</li>
<li><strong>Stahlguss:</strong> Stahl, der in eine Form gegossen wird. Er ist zäher als Gusseisen.</li>
<li>Beispiele: Getriebegehäuse, Pumpengehäuse, Maschinenbetten.</li>
</ul>
<div class="info-box"><h4>⚠️ Vorsicht, Falle!</h4><p><strong>Stahlguss</strong> hat zwar „Stahl“ im Namen. Weil er gegossen wird, gehört er aber zu den <strong>Eisen-Gusswerkstoffen</strong>.</p></div>
""",
 short=f"""
<p><strong>Stähle:</strong> bis etwa 2 % Kohlenstoff. Fest, zäh, umformbar, schweißbar. Für Wellen, Schrauben, Zahnräder.</p>
<p><strong>Eisen-Gusswerkstoffe:</strong> werden gegossen, gut für schwierige Formen. Gusseisen (über 2 % Kohlenstoff) ist spröde und dämpft Schwingungen. Für Gehäuse und Maschinenbetten.</p>
<p><strong>Falle:</strong> Stahlguss gehört zu den Eisen-Gusswerkstoffen.</p>
""",
 )

M[3] = dict(
 card=("🟠", "Modul 3: Nichteisenmetalle", "Leicht oder schwer? Du arbeitest mit dem Tabellenbuch."),
 title="Modul 3: Nichteisenmetalle",
 full=f"""
<h3>Metalle ohne Eisen</h3>
<p><strong>Nichteisenmetalle</strong> (NE-Metalle) sind alle Metalle, die nicht auf Eisen basieren. Beispiele: Kupfer, Aluminium, Zink, Titan, Blei, Nickel, Magnesium.</p>

<h3>Leicht oder schwer?</h3>
<p>NE-Metalle teilt man nach der <strong>Dichte ρ</strong> ein. Die Dichte sagt, wie schwer 1 dm³ von einem Werkstoff ist.</p>
<ul>
<li><strong>Leichtmetalle:</strong> kleine Dichte, z. B. Aluminium und Magnesium.</li>
<li><strong>Schwermetalle:</strong> große Dichte, z. B. Kupfer, Nickel und Chrom.</li>
</ul>
<p>Ob ein Metall ein Leicht- oder Schwermetall ist, <strong>sieht man nicht</strong>. Das steht im Tabellenbuch.</p>
{BOOK("<strong>1. Die Grenze:</strong> Suche das <strong>Periodensystem der Elemente</strong>. In einer Fußnote oder in der Legende steht, ab welcher Dichte ein Metall ein Schwermetall ist.<br><strong>2. Die Dichte eines Metalls:</strong> Suche die Tabelle <strong>Stoffwerte von festen Stoffen</strong>, oder schau im Sachwortverzeichnis unter „Dichte“.")}
<div class="info-box"><h4>⚠️ Vorsicht, Falle!</h4><p>Es zählt <strong>nur die Dichte</strong>. Ein Metall ist nicht schwer, nur weil es fest oder hart ist.</p></div>

<h3>Wofür nimmt man NE-Metalle?</h3>
<ul>
<li><strong>Kupfer:</strong> leitet Strom und Wärme sehr gut. Für Kabel und Stromschienen.</li>
<li><strong>Aluminium:</strong> leicht und rostet nicht. Für Profile, Bleche und Leitern.</li>
<li><strong>Zink:</strong> schützt Stahl vor Rost (Verzinken). Für Dachrinnen.</li>
<li><strong>Titan:</strong> leicht und sehr fest, aber teuer. Für Luftfahrt und Medizintechnik.</li>
</ul>
""",
 short=f"""
<p><strong>NE-Metalle:</strong> alle Metalle ohne Eisen als Basis. Man teilt sie nach der <strong>Dichte</strong> in Leicht- und Schwermetalle.</p>
{BOOK("Grenze: Periodensystem der Elemente (Fußnote oder Legende). Dichte: Stoffwerte von festen Stoffen oder Sachwortverzeichnis „Dichte“.")}
<p><strong>Falle:</strong> Nur die Dichte zählt, nicht die Festigkeit.</p>
<p>Kupfer: Strom. Aluminium: leicht. Zink: Rostschutz. Titan: leicht und sehr fest.</p>
""",
 quiz_content=BOOK("Für dieses Modul brauchst du das Periodensystem der Elemente und die Tabelle „Stoffwerte von festen Stoffen“."),
 )

M[4] = dict(
 card=("🧱", "Modul 4: Nichtmetalle und Verbundwerkstoffe", "Künstlich oder natürlich? GFK und Hartmetall."),
 title="Modul 4: Nichtmetalle und Verbundwerkstoffe",
 full=f"""
<h3>Nichtmetalle</h3>
<ul>
<li><strong>Künstliche Nichtmetallwerkstoffe</strong> stellt der Mensch her. Beispiele: <strong>Kunststoffe</strong> (Zahnräder, Griffe), <strong>Glas</strong> (Schaugläser), <strong>Keramik</strong> (Schneidplatten, Isolatoren).</li>
<li><strong>Naturwerkstoffe</strong> kommen in der Natur vor. Beispiele: <strong>Holz</strong> (Unterlegkeile), <strong>Granit</strong> (Messplatten), <strong>Grafit</strong> (Schmierstoff).</li>
</ul>

<h3>Verbundwerkstoffe</h3>
<p>Ein Verbundwerkstoff besteht aus <strong>mehreren Werkstoffen</strong>. Sie sind fest miteinander verbunden. So vereint man die <strong>guten Eigenschaften</strong> in einem neuen Werkstoff.</p>
{table(["Verbundwerkstoff", "besteht aus", "Eigenschaften"], [
  ["GFK", "Glasfasern + Kunststoff", "leicht und sehr fest"],
  ["CFK", "Kohlenstofffasern + Kunststoff", "noch leichter und fester, aber teuer"],
  ["Hartmetall", "harte Hartstoffkörner + zähes Metall", "sehr hart und trotzdem zäh"],
  ["Stahlbeton", "Stahl + Beton", "hält Druck und Zug aus"]])}
<div class="info-box"><h4>⚠️ Vorsicht, Falle!</h4><p><strong>Hartmetall</strong> heißt zwar „Metall“, ist aber ein <strong>Verbundwerkstoff</strong>. Man nimmt es für Wendeschneidplatten: Die Hartstoffkörner schneiden, das Metall hält sie zusammen.</p></div>
""",
 short=f"""
<p><strong>Künstliche Nichtmetallwerkstoffe:</strong> Kunststoff, Glas, Keramik. <strong>Naturwerkstoffe:</strong> Holz, Granit, Grafit.</p>
<p><strong>Verbundwerkstoffe:</strong> mehrere Werkstoffe fest verbunden. GFK = Glasfasern + Kunststoff. CFK = Kohlenstofffasern + Kunststoff. Hartmetall = Hartstoffkörner + zähes Metall.</p>
<p><strong>Falle:</strong> Hartmetall ist ein Verbundwerkstoff.</p>
""",
 )

M[5] = dict(
 card=("🔬", "Modul 5: Eigenschaften der Werkstoffe", "Hart, zäh, spröde, leitfähig? Die wichtigsten Eigenschaften."),
 title="Modul 5: Eigenschaften der Werkstoffe",
 full=f"""
<h3>Warum Eigenschaften wichtig sind</h3>
<p>Jedes Bauteil muss etwas können: Eine Welle muss Kräfte übertragen, ein Kabel muss Strom leiten. Deshalb musst du die <strong>Eigenschaften</strong> der Werkstoffe kennen. Man teilt sie in vier Gruppen.</p>
{table(["Gruppe", "Frage", "Beispiele"], [
  ["physikalisch", "Welche Stoffwerte hat der Werkstoff?", "Dichte, Schmelztemperatur, elektrische Leitfähigkeit, Wärmeleitfähigkeit"],
  ["mechanisch", "Wie verhält er sich unter Kraft?", "Festigkeit, Härte, Zähigkeit, Elastizität"],
  ["technologisch", "Wie gut lässt er sich bearbeiten?", "Gießbarkeit, Umformbarkeit, Zerspanbarkeit, Schweißbarkeit"],
  ["chemisch", "Wie reagiert er mit der Umgebung?", "Korrosionsbeständigkeit (Rost)"]])}

<h3>Die mechanischen Eigenschaften genauer</h3>
<ul>
<li><strong>Festigkeit:</strong> Der Werkstoff hält große Kräfte aus, ohne zu brechen.</li>
<li><strong>Härte:</strong> Widerstand gegen das Eindringen eines anderen Körpers. Ein Bohrer muss härter sein als das Werkstück.</li>
<li><strong>Zähigkeit:</strong> Der Werkstoff verformt sich stark, bevor er bricht. Gut bei Stößen.</li>
<li><strong>Sprödigkeit:</strong> das Gegenteil von zäh. Der Werkstoff bricht plötzlich, z. B. Glas oder Gusseisen.</li>
<li><strong>Elastizität:</strong> Der Werkstoff federt nach der Belastung zurück, z. B. eine Feder.</li>
</ul>
<div class="info-box"><h4>⚠️ Hart ist nicht gleich zäh</h4><p>Glas ist hart, aber spröde. Ein harter Werkstoff kann trotzdem leicht brechen.</p></div>

<h3>Praktische Tipps</h3>
<ul>
<li><strong>Magnet-Test:</strong> Baustahl und Gusseisen sind magnetisch. Aluminium, Kupfer und Zink nicht.</li>
<li><strong>Leitfähigkeit:</strong> Metalle leiten Strom und Wärme gut. Kunststoffe kaum. Darum haben Werkzeuge Griffe aus Kunststoff.</li>
<li><strong>Dichte:</strong> Leichtmetalle haben eine Dichte bis 5 kg/dm³, Schwermetalle darüber.</li>
</ul>
{BOOK("Viele Stoffwerte wie Dichte und Schmelztemperatur findest du in der Tabelle <strong>Stoffwerte von festen Stoffen</strong>.")}
""",
 short=f"""
<p><strong>Physikalisch:</strong> Dichte, Schmelztemperatur, Leitfähigkeit. <strong>Mechanisch:</strong> Festigkeit, Härte, Zähigkeit, Elastizität. <strong>Technologisch:</strong> Gießbarkeit, Umformbarkeit, Zerspanbarkeit, Schweißbarkeit. <strong>Chemisch:</strong> Korrosionsbeständigkeit.</p>
<p><strong>Zäh:</strong> verformt sich vor dem Bruch. <strong>Spröde:</strong> bricht plötzlich. <strong>Hart ist nicht gleich zäh.</strong></p>
<p><strong>Magnet:</strong> Stahl ja, Aluminium und Kupfer nein.</p>
{BOOK("Schmelztemperaturen: Tabelle „Stoffwerte von festen Stoffen“.")}
""",
 quiz_content=BOOK("Für eine Aufgabe brauchst du die Schmelztemperaturen aus der Tabelle „Stoffwerte von festen Stoffen“."),
 )

M[6] = dict(
 card=("🗄️", "Modul 6: Das Lagerregal", "Das neue Regal einräumen: Fächer beschriften, Kiste einsortieren, nachzählen."),
 card_locked="Gesperrt. Schließe zuerst die Module 1 bis 5 ab.",
 title="Modul 6: Das Lagerregal",
 full=f"""
<h3>Jetzt wird eingeräumt!</h3>
<p>Super, du hast das Profi-Modul freigeschaltet! Jetzt kommt die Kiste ins Regal. Jede Gruppe aus der <strong>untersten Ebene</strong> des Schemas bekommt ein eigenes Fach. Das sind sieben Gruppen, also sieben Fächer.</p>
{REGAL}

<h3>So gehst du bei jedem Teil vor</h3>
<ol>
<li>Den <strong>Werkstoff</strong> des Teils ablesen (Beschriftung oder Liste).</li>
<li><strong>Hauptgruppe</strong> bestimmen: Metall, Nichtmetall oder Verbundwerkstoff?</li>
<li><strong>Untergruppe</strong> bestimmen. Bei Nichteisenmetallen die <strong>Dichte</strong> im Tabellenbuch nachschlagen: bis 5 kg/dm³ Leichtmetall, darüber Schwermetall.</li>
<li>Das Teil in das passende <strong>Fach</strong> legen.</li>
</ol>

<h3>Kontrollieren</h3>
<ul>
<li><strong>Nachzählen:</strong> Zähle die Teile in allen Fächern zusammen. Die Summe muss so groß sein wie die Zahl der Teile in der Kiste.</li>
<li><strong>Periodensystem:</strong> Im Periodensystem sind Leicht- und Schwermetalle farbig markiert. Vergleiche damit deine Einteilung der NE-Metalle.</li>
</ul>
""",
 short=f"""
{REGAL}
<p><strong>Vorgehen:</strong> Werkstoff ablesen → Hauptgruppe → Untergruppe (NE-Metalle: Dichte, Grenze 5 kg/dm³) → Fach.</p>
<p><strong>Kontrolle:</strong> Nachzählen. Die Summe muss stimmen.</p>
""",
 quiz_content=BOOK("Bei Nichteisenmetallen hilft dir die Dichte aus dem Tabellenbuch. Leichtmetalle bis 5 kg/dm³, Schwermetalle darüber."),
 )

M[7] = dict(
 card=("🔧", "Modul 7: Den richtigen Werkstoff wählen", "Den passenden Werkstoff für ein Bauteil wählen und die Wahl begründen."),
 card_locked="Gesperrt. Danach wählst du selbst Werkstoffe für Bauteile aus.",
 title="Modul 7: Den richtigen Werkstoff wählen",
 full=f"""
<h3>Der beste Werkstoff für die Aufgabe</h3>
<p>Es gibt keinen Werkstoff, der alles kann. Darum wählt man für jedes Bauteil den Werkstoff, der am besten passt. Gehe so vor:</p>
<ol>
<li><strong>Anforderungen</strong> sammeln: Was muss das Bauteil aushalten und können?</li>
<li>Die wichtigen <strong>Eigenschaften</strong> ableiten, z. B. zäh, leicht, rostfrei.</li>
<li><strong>Werkstoffe</strong> mit diesen Eigenschaften suchen, z. B. im Tabellenbuch.</li>
<li><strong>Abwägen</strong> und entscheiden: Was kostet er? Wie gut lässt er sich bearbeiten?</li>
</ol>

<h3>Beispiele aus der Metalltechnik</h3>
{table(["Bauteil", "wichtige Eigenschaften", "Werkstoff"], [
  ["Antriebswelle", "große Festigkeit, zäh", "Vergütungsstahl"],
  ["Getriebegehäuse", "gut vergießbar, dämpft Schwingungen", "Gusseisen"],
  ["Stromschiene", "sehr gute elektrische Leitfähigkeit", "Kupfer"],
  ["Leiter", "leicht, rostet nicht", "Aluminium"],
  ["Wendeschneidplatte", "sehr hart und trotzdem zäh", "Hartmetall"],
  ["Werkzeuggriff", "isoliert gegen Wärme und Strom", "Kunststoff"],
  ["Abdeckhaube", "leicht, fest, korrosionsbeständig", "GFK"]])}
<div class="info-box"><h4>💡 Begründe immer</h4><p>Nenne bei deiner Wahl die <strong>Eigenschaft</strong>, auf die es ankommt. Beispiel: „Die Welle ist aus Stahl, weil sie fest und zäh sein muss. Gusseisen wäre zu spröde.“</p></div>
""",
 short=f"""
<p><strong>Vorgehen:</strong> Anforderungen → Eigenschaften → passende Werkstoffe → abwägen (Preis, Bearbeitung).</p>
<p>Welle: Vergütungsstahl (fest, zäh). Gehäuse: Gusseisen (vergießbar). Stromschiene: Kupfer. Leiter: Aluminium (leicht). Schneidplatte: Hartmetall (hart und zäh). Griff: Kunststoff (isoliert). Haube: GFK.</p>
<p><strong>Begründe immer</strong> mit der wichtigsten Eigenschaft.</p>
""",
 )

# ---------------------------------------------------------------- Seite bauen
def build(variant):
    titles = {"full": "Werkstoffe Metall – Lernmodul", "short": "Werkstoffe Metall – Kompakt", "quiz": "Werkstoffe Metall – Quiz"}
    sub = {"full": "Welche Werkstoffe gibt es, und wie teilt man sie ein? Du räumst ein Lagerregal ein und wählst Werkstoffe für Bauteile.",
           "short": "Das Wichtigste in Kürze. Am Ende räumst du das Regal ein und wählst Werkstoffe.",
           "quiz": "Nur die Fragen. Teste, was du schon kannst."}[variant]
    cards = ""
    for n in range(1, 8):
        icon, t, d = M[n]["card"]
        locked = n > 5
        desc = M[n].get("card_locked", d) if locked else d
        cards += f'''
            <div class="module-card{(" advanced-card locked" if locked else "")}" id="card-{n}" onclick="openModule({n})">
                <div class="module-icon">{icon}</div>
                <div class="module-title">{t}</div>
                <div class="module-description">{desc}</div>
            </div>
'''
    data = {}
    for n in range(1, 8):
        if variant == "full":
            content = M[n]["full"]
        elif variant == "short":
            content = M[n]["short"]
        else:
            content = M[n].get("quiz_content", "")
        data[n] = dict(title=M[n]["title"], content=content)

    header_hint = '<div class="book-hint">📘 Für die Module 3, 5 und 6 brauchst du dein Tabellenbuch.</div>'
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
            <h1>🔩 Werkstoffe Metall 🔩</h1>
            <p>{sub}</p>
            {header_hint}
        </div>

        <div class="progress-bar">
            <div class="progress-fill" id="progress" style="width: 0%;">0 von 7 Modulen abgeschlossen</div>
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
