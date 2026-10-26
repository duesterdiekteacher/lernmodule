# -*- coding: utf-8 -*-
"""Erzeugt die drei Varianten des Lernmoduls "Masse und Dichte (SHK)" nach dem Aufbau der C#-Vorlage."""
import json, re, os, sys

HERE = os.path.dirname(os.path.abspath(__file__))
REPO = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.join(REPO, "dichte-shk")
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

BOOK = lambda txt: f'<div class="book-box"><h4>📘 Nimm dein Tabellenbuch</h4><p>{txt}</p></div>'

css += """
        .situation {
            background: #13293d;
            border-left: 5px solid #38bdf8;
            padding: 20px;
            margin: 20px 0 25px 0;
            border-radius: 5px;
        }
        .situation h4 { color: #38bdf8; margin-bottom: 10px; font-size: 18px; }
        .situation p { color: #e2e8f0; font-size: 17px; margin-bottom: 10px; }
        .situation p:last-child { margin-bottom: 0; }
"""

# ---------------------------------------------------------------- Skizzen
F = 'font-family="Segoe UI, Arial"'
def t(x, y, s, size=16, color="#f8fafc", anchor="middle", bold=False):
    return f'<text x="{x}" y="{y}" fill="{color}" font-size="{size}" text-anchor="{anchor}"{" font-weight=\"bold\"" if bold else ""} {F}>{s}</text>'

def sketch(svg, caption, title=""):
    h = f'<h4 style="color:#38bdf8; margin-bottom:10px;">{title}</h4>' if title else ""
    return f'<div class="sketch">{h}{svg}<p class="caption">{caption}</p></div>'

FEST = [(20 + c * 22, 20 + r * 22) for r in range(6) for c in range(6)]
FLUESSIG = [(22,30),(44,24),(68,34),(92,26),(118,32),(30,54),(56,56),(80,52),(106,58),(128,54),(20,80),(44,82),(70,78),(96,84),(122,80),
            (32,106),(58,104),(84,110),(110,104),(132,112),(22,130),(48,130),(74,134),(100,130),(126,134)]
GAS = [(30,32),(112,24),(70,72),(24,118),(122,104),(78,130)]
def kasten(pos, x0, label, sub):
    s = f'<rect x="{x0}" y="10" width="150" height="150" rx="8" fill="#0f172a" stroke="#64748b" stroke-width="2"/>'
    s += "".join(f'<circle cx="{x0 + x}" cy="{10 + y}" r="9" fill="#38bdf8" stroke="#0f172a"/>' for x, y in pos)
    return s + t(x0 + 75, 186, label, 18, "#fbbf24", bold=True) + t(x0 + 75, 208, sub, 14, "#cbd5e1")
TEILCHEN = sketch(
    '<svg viewBox="0 0 530 220" role="img" aria-label="Teilchen in festen, flüssigen und gasförmigen Stoffen">' +
    kasten(FEST, 15, "fest", "dicht und geordnet") + kasten(FLUESSIG, 190, "flüssig", "dicht, aber ungeordnet") +
    kasten(GAS, 365, "gasförmig", "weit auseinander") + '</svg>',
    "Je weiter die Teilchen auseinander sind, desto kleiner ist die Dichte.")

def gitter(x0, r, fill, lab):
    s = f'<rect x="{x0}" y="10" width="190" height="150" rx="8" fill="#0f172a" stroke="#64748b" stroke-width="2"/>'
    for row in range(4):
        for col in range(5):
            s += f'<circle cx="{x0 + 27 + col * 34}" cy="{34 + row * 34}" r="{r}" fill="{fill}" stroke="#0f172a"/>'
    return s + lab
ATOME = sketch(
    '<svg viewBox="0 0 470 250" role="img" aria-label="Aluminium und Blei: gleich dicht gepackt, aber Bleiatome sind viel schwerer">' +
    gitter(20, 13, "#94a3b8", t(115, 186, "Aluminium", 18, "#fbbf24", bold=True) + t(115, 208, "leichte Atome", 14, "#cbd5e1") + t(115, 232, "ρ ≈ 2,7 kg/dm³", 15)) +
    gitter(260, 15, "#475569", t(355, 186, "Blei", 18, "#fbbf24", bold=True) + t(355, 208, "fast 8-mal so schwere Atome", 14, "#cbd5e1") + t(355, 232, "ρ ≈ 11,3 kg/dm³", 15)) +
    '</svg>',
    "Gleich dicht gepackt. Aber jedes Bleiatom ist viel schwerer. Darum ist die Dichte von Blei viel größer.")

WUERFEL = sketch(
    '<svg viewBox="0 0 420 250" role="img" aria-label="Würfel mit 1 dm Kante enthält 1000 Würfel mit 1 cm Kante">' +
    '<polygon points="60,80 220,80 220,240 60,240" fill="#1e293b" stroke="#22c55e" stroke-width="2"/>' +
    "".join(f'<line x1="{60 + i * 16}" y1="80" x2="{60 + i * 16}" y2="240" stroke="#334155"/>' for i in range(1, 10)) +
    "".join(f'<line x1="60" y1="{80 + i * 16}" x2="220" y2="{80 + i * 16}" stroke="#334155"/>' for i in range(1, 10)) +
    '<polygon points="60,80 120,30 280,30 220,80" fill="#273449" stroke="#22c55e" stroke-width="2"/>' +
    '<polygon points="220,80 280,30 280,190 220,240" fill="#0f172a" stroke="#22c55e" stroke-width="2"/>' +
    '<rect x="60" y="224" width="16" height="16" fill="#fbbf24"/>' +
    t(140, 66, "10 cm = 1 dm", 15, "#f8fafc") + t(300, 120, "10 cm", 15, "#f8fafc", "start") + t(300, 140, "10 cm", 15, "#f8fafc", "start") +
    t(300, 210, "■ = 1 cm³", 15, "#fbbf24", "start") + '</svg>',
    "10 · 10 · 10 = 1000 kleine Würfel. Also: 1 dm³ = 1000 cm³ = 1 Liter.")

T_VOL = treppe(["m³", "dm³ = l", "cm³ = ml", "mm³"], 1000, "V", "#22c55e")

KOERPER = sketch(
    '<svg viewBox="0 0 560 210" role="img" aria-label="Würfel, Quader und Zylinder">' +
    # Würfel
    '<polygon points="20,80 110,80 110,170 20,170" fill="#334155" stroke="#94a3b8" stroke-width="2"/>' +
    '<polygon points="20,80 50,55 140,55 110,80" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
    '<polygon points="110,80 140,55 140,145 110,170" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
    t(65, 190, "a", 17) + t(80, 30, "Würfel", 17, "#fbbf24", bold=True) +
    # Quader
    '<polygon points="180,110 330,110 330,170 180,170" fill="#334155" stroke="#94a3b8" stroke-width="2"/>' +
    '<polygon points="180,110 210,85 360,85 330,110" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
    '<polygon points="330,110 360,85 360,145 330,170" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
    t(255, 190, "l", 17) + t(355, 165, "b", 17) + t(170, 145, "h", 17) + t(270, 30, "Quader", 17, "#fbbf24", bold=True) +
    # Zylinder
    '<rect x="400" y="90" width="120" height="50" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
    '<ellipse cx="520" cy="115" rx="12" ry="25" fill="#334155" stroke="#94a3b8" stroke-width="2"/>' +
    '<ellipse cx="400" cy="115" rx="12" ry="25" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
    t(460, 165, "l", 17) + t(375, 120, "d", 17) + t(465, 30, "Zylinder", 17, "#fbbf24", bold=True) +
    '</svg>',
    "Würfel: V = a · a · a. Quader: V = l · b · h. Zylinder: V = π/4 · d² · l.")

DREIECK = sketch(
    '<svg viewBox="0 0 300 220" style="max-width:300px; min-width:0" role="img" aria-label="Formeldreieck: m oben, rho und V unten">' +
    '<polygon points="150,15 285,200 15,200" fill="#1e293b" stroke="#38bdf8" stroke-width="3"/>' +
    '<line x1="70" y1="125" x2="230" y2="125" stroke="#38bdf8" stroke-width="3"/>' +
    '<line x1="150" y1="125" x2="150" y2="200" stroke="#38bdf8" stroke-width="3"/>' +
    t(150, 100, "m", 36, "#fbbf24", bold=True) + t(105, 178, "ρ", 34, "#f8fafc", bold=True) + t(195, 178, "V", 34, "#f8fafc", bold=True) +
    '</svg>',
    "Halte die gesuchte Größe zu. Oben und unten: geteilt. Nebeneinander: mal.", "Das Formeldreieck")

RING = sketch(
    '<svg viewBox="0 0 460 220" role="img" aria-label="Rohrquerschnitt mit Außendurchmesser, Innendurchmesser und Wanddicke">' +
    '<circle cx="110" cy="110" r="90" fill="#b45309" stroke="#fbbf24" stroke-width="2"/>' +
    '<circle cx="110" cy="110" r="72" fill="#0c4a6e" stroke="#fbbf24" stroke-width="2"/>' +
    '<line x1="20" y1="110" x2="200" y2="110" stroke="#f8fafc" stroke-width="1.5" stroke-dasharray="6 4"/>' +
    t(110, 104, "dᵢ", 18, "#7dd3fc", bold=True) +
    t(240, 50, "D = Außendurchmesser", 16, "#f8fafc", "start") +
    t(240, 80, "s = Wanddicke", 16, "#f8fafc", "start") +
    t(240, 110, "dᵢ = D − 2 · s", 16, "#7dd3fc", "start", True) +
    '<rect x="240" y="140" width="18" height="18" fill="#b45309"/>' + t(266, 155, "Material (Ring)", 15, "#f8fafc", "start") +
    '<rect x="240" y="170" width="18" height="18" fill="#0c4a6e" stroke="#7dd3fc"/>' + t(266, 185, "Wasser (innen)", 15, "#f8fafc", "start") +
    '</svg>',
    "Für die Masse des Rohres zählt der Ring. Für das Wasser zählt die Fläche innen.")

BLECH = sketch(
    '<svg viewBox="0 0 440 200" role="img" aria-label="Ein Quadratmeter Blech mit 1 mm Dicke hat 1 dm³ Volumen">' +
    '<polygon points="40,120 260,120 320,60 100,60" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
    '<polygon points="40,120 260,120 260,128 40,128" fill="#334155" stroke="#94a3b8" stroke-width="2"/>' +
    '<polygon points="260,120 320,60 320,68 260,128" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
    t(150, 150, "1 m = 10 dm", 15) + t(300, 105, "1 m = 10 dm", 15, "#f8fafc", "start") + t(150, 50, "Dicke 1 mm = 0,01 dm", 15, "#fbbf24") +
    t(220, 185, "V = 10 dm · 10 dm · 0,01 dm = 1 dm³", 16, "#4ade80", bold=True) + '</svg>',
    "1 m² Blech mit 1 mm Dicke hat genau 1 dm³ Volumen. Darum: m″ = ρ · s.")

FLANSCH = sketch(
    '<svg viewBox="0 0 420 210" role="img" aria-label="Flansch mit Mittelbohrung und vier Löchern">' +
    '<circle cx="110" cy="100" r="80" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
    '<circle cx="110" cy="100" r="30" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>' +
    "".join(f'<circle cx="{110 + dx * 55}" cy="{100 + dy * 55}" r="7" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>' for dx, dy in [(0, -1), (1, 0), (0, 1), (-1, 0)]) +
    t(230, 50, "Außen: D = 160 mm", 16, "#f8fafc", "start") + t(230, 80, "Mitte: d = 60 mm", 16, "#f8fafc", "start") +
    t(230, 110, "4 Löcher: je 14 mm", 16, "#f8fafc", "start") + t(230, 140, "Dicke: s = 12 mm", 16, "#fbbf24", "start") + '</svg>',
    "Volle Scheibe minus alle Bohrungen = Volumen des Flanschs.")

SITUATION = """<div class="situation"><h4>🏚️ Die Situation</h4>
<p>Ihr baut im Keller eines Altbaus eine alte Heizung aus. Dabei findest du ein Rohrstück <strong>28 × 1,5</strong>, <strong>500 mm</strong> lang. Das Rohr ist lackiert. Du siehst nicht, ob es <strong>Kupfer</strong> ist oder eine alte <strong>Bleileitung</strong>.</p>
<p>Dein Meister sagt: „Kupfer bringt beim Schrotthändler gutes Geld. Wenn es eine alte Bleileitung ist, muss sie getrennt entsorgt werden. Finde heraus, was es ist. Aber kratz den Lack nicht ab!“</p>
<p>Du wiegst das Rohrstück auf der Werkstattwaage: <strong>m = 0,558 kg</strong>.</p></div>"""

# ---------------------------------------------------------------- Inhalte
M = {}

M[1] = dict(
 card=("⚛️", "Modul 1: Was ist Dichte?", "Masse und Volumen. Ein Blick auf die Teilchen. Schwimmen oder untergehen?"),
 title="Modul 1: Was ist Dichte?",
 full=f"""
{SITUATION}
<p>Diese Frage löst du in <strong>Modul 6</strong>. Dafür brauchst du die <strong>Dichte</strong>. Los geht's!</p>

<h3>Schwer oder dicht?</h3>
<p>Ein großer Eimer Wasser ist schwerer als ein kleiner Kupferfitting. Trotzdem sagt man: Kupfer ist „dichter“ als Wasser. Wie passt das zusammen?</p>
<p>Um Stoffe fair zu vergleichen, nimmt man immer <strong>gleich viel Volumen</strong>: 1 dm³. Das ist ein Würfel mit 10 cm Kante. So viel passt in eine Milchtüte (1 Liter).</p>
{table(["Stoff", "1 dm³ wiegt ungefähr"], [
  ["Wasser", "1 kg"], ["Aluminium", "2,7 kg"], ["Zink", "7,13 kg"], ["Kupfer", "8,92 kg"], ["Blei", "11,3 kg"]])}
<div class="formula">Dichte = Masse : Volumen &nbsp;&nbsp;→&nbsp;&nbsp; ρ = m : V</div>
<p>Das Zeichen <strong>ρ</strong> ist ein griechischer Buchstabe. Man spricht es „rho“.</p>

<h3>Ein Blick in den Stoff</h3>
<p>Alle Stoffe bestehen aus winzigen Teilchen. Bei Metallen sind das <strong>Atome</strong>. Die Dichte hängt von zwei Dingen ab:</p>
<ol>
<li>Wie <strong>schwer</strong> ist ein einzelnes Teilchen?</li>
<li>Wie <strong>dicht</strong> sind die Teilchen gepackt?</li>
</ol>
{ATOME}
<p>Bei Aluminium und Blei sind die Atome ähnlich dicht gepackt. Aber ein Bleiatom ist fast 8-mal so schwer wie ein Aluminiumatom. Darum ist Blei so schwer.</p>

<h3>Fest, flüssig, gasförmig</h3>
{TEILCHEN}
<p>In einem <strong>Gas</strong> sind die Teilchen sehr weit auseinander. Darum ist die Dichte von Gasen sehr klein. 1 m³ Luft wiegt nur etwa 1,3 kg. 1 m³ Wasser wiegt 1000 kg!</p>

<h3>Schwimmen oder untergehen?</h3>
<p>Wasser hat die Dichte <strong>1 kg/dm³</strong>. Ein massives Stück mit kleinerer Dichte <strong>schwimmt</strong>. Ein Stück mit größerer Dichte <strong>geht unter</strong>.</p>
<ul>
<li>Heizöl und Maschinenöl schwimmen auf Wasser.</li>
<li>Kupfer, Zink und Aluminium gehen unter.</li>
</ul>
<p>Das nutzt man im SHK: Im <strong>Ölabscheider</strong> schwimmt das Öl oben. Das Wasser läuft unten ab.</p>

<h3>Wasser ist besonders</h3>
<p>Wasser hat bei <strong>4 °C</strong> seine größte Dichte. Eis hat eine <strong>kleinere</strong> Dichte als Wasser. Darum schwimmt Eis.</p>
<p>Gleiche Masse und kleinere Dichte bedeutet: <strong>mehr Volumen</strong>. Eis braucht etwa 9 % mehr Platz. Friert eine Leitung ein, kann sie platzen. Darum schützt man Leitungen vor Frost.</p>
<div class="info-box"><h4>🧠 Merke</h4><p>Die Dichte hängt nur vom <strong>Stoff</strong> ab. Ein kleines und ein großes Stück Kupfer haben dieselbe Dichte. Darum kann man mit der Dichte einen Stoff erkennen.</p></div>
""",
 short=f"""
{SITUATION}
<div class="formula">ρ = m : V &nbsp;&nbsp;(Dichte = Masse : Volumen)</div>
<p>Die Dichte sagt, wie schwer <strong>1 dm³</strong> eines Stoffes ist. Wasser: 1 kg. Aluminium: 2,7 kg. Kupfer: 8,92 kg.</p>
{ATOME}
{TEILCHEN}
<p><strong>Schwere Teilchen</strong> und <strong>dichte Packung</strong> → große Dichte. Gase: kleine Dichte.</p>
<p>Dichte unter 1 kg/dm³ → schwimmt auf Wasser (Heizöl, Maschinenöl). Eis ist leichter als Wasser und braucht mehr Platz → Frostgefahr für Leitungen.</p>
""",
)

M[2] = dict(
 card=("📦", "Modul 2: Volumen umrechnen", "mm³, cm³, dm³, m³ und Liter. Warum der Faktor 1000 ist."),
 title="Modul 2: Volumen umrechnen",
 full=f"""
<h3>Warum 1000?</h3>
<p>1 dm sind 10 cm. Ein Würfel mit 1 dm Kante ist also 10 cm lang, 10 cm breit und 10 cm hoch.</p>
{WUERFEL}
<p>Bei Längen ist die Umrechnungszahl 10. Bei Volumen gibt es <strong>drei</strong> Richtungen. Darum: 10 · 10 · 10 = <strong>1000</strong>.</p>

<h3>Die Umrechnungstreppe</h3>
<p>Eine Stufe nach <strong>unten</strong> (kleinere Einheit): Die Zahl wird größer. Du rechnest <strong>mal 1000</strong>.</p>
<p>Eine Stufe nach <strong>oben</strong> (größere Einheit): Die Zahl wird kleiner. Du rechnest <strong>geteilt durch 1000</strong>.</p>
{treppen_box([("Volumen: Umrechnungszahl 1000", T_VOL)], "")}
{table(["Aufgabe", "Stufen", "Ergebnis"], [
  ["2,5 dm³ in cm³", "1 Stufe nach unten: · 1000", "<strong>2500 cm³</strong>"],
  ["750 cm³ in dm³", "1 Stufe nach oben: : 1000", "<strong>0,75 dm³</strong>"],
  ["0,3 m³ in l", "1 Stufe nach unten: · 1000", "<strong>300 l</strong>"],
  ["45 000 mm³ in dm³", "2 Stufen nach oben: : 1 000 000", "<strong>0,045 dm³</strong>"]])}
<div class="info-box"><h4>🧠 Merke</h4><p><strong>1 dm³ = 1 l</strong> &nbsp;·&nbsp; <strong>1 cm³ = 1 ml</strong> &nbsp;·&nbsp; <strong>1 m³ = 1000 l</strong></p></div>

<h3>Der Trick: Längen zuerst in dm</h3>
<p>Für die Dichte brauchst du das Volumen meistens in <strong>dm³</strong>. Das geht am einfachsten so: Rechne alle Längen <strong>vor</strong> dem Rechnen in dm um. Dann kommt das Volumen gleich in dm³ heraus.</p>
{table(["von", "nach dm", "Beispiel"], [
  ["mm", ": 100", "250 mm = 2,5 dm"],
  ["cm", ": 10", "40 cm = 4 dm"],
  ["m", "· 10", "1,5 m = 15 dm"]])}
<div class="info-box"><h4>⚠️ Typischer Fehler</h4><p>3,5 dm³ = 350 cm³? <strong>Falsch!</strong> Die 100 gilt für Flächen. Bei Volumen ist es immer 1000: 3,5 dm³ = <strong>3500 cm³</strong>.</p></div>
""",
 short=f"""
{treppen_box([("Volumen: Umrechnungszahl 1000", T_VOL)], "")}
<p><strong>1 dm³ = 1 l</strong>, <strong>1 cm³ = 1 ml</strong>, <strong>1 m³ = 1000 l</strong>.</p>
<p><strong>Trick:</strong> Längen zuerst in dm umrechnen (mm : 100, cm : 10, m · 10). Dann kommt das Volumen in dm³ heraus.</p>
<p><strong>Achtung:</strong> Bei Volumen ist es 1000, nicht 100!</p>
""",
)

M[3] = dict(
 card=("📐", "Modul 3: Volumen berechnen", "Würfel, Quader und Zylinder. Vom Werkstück bis zum Speicher."),
 title="Modul 3: Volumen berechnen",
 full=f"""
<h3>Die Grundformen</h3>
<p>Viele Bauteile haben eine einfache Grundform. Für jede Form gibt es eine Formel.</p>
{KOERPER}
<div class="formula">Würfel: &nbsp;&nbsp;V = a · a · a<br>Quader: &nbsp;&nbsp;V = l · b · h<br>Zylinder: V = π/4 · d² · l &nbsp;<span style="color:#94a3b8;">(d² = d · d)</span></div>
<p>Beim Zylinder rechnest du erst die runde Grundfläche (π/4 · d²). Dann nimmst du sie mal die Länge. Ein Rundstab, ein Bolzen und das Wasser in einem Rohr sind Zylinder.</p>

<h3>So gehst du vor</h3>
<ol>
<li>Grundform erkennen und Formel aufschreiben.</li>
<li>Alle Maße in <strong>dm</strong> umrechnen.</li>
<li>Einsetzen und rechnen. Erst am Ende runden.</li>
</ol>

<h3>Beispiel 1: Quader</h3>
<p>Ein Klotz ist 300 mm lang, 60 mm breit und 40 mm hoch.</p>
{table(["Schritt", "Rechnung"], [
  ["① Formel", "V = l · b · h"],
  ["② In dm", "l = 3 dm; b = 0,6 dm; h = 0,4 dm"],
  ["③ Rechnen", "V = 3 dm · 0,6 dm · 0,4 dm = <strong>0,72 dm³</strong>"]])}

<h3>Beispiel 2: Rundstab</h3>
<p>Ein Rundstab hat d = 40 mm und l = 500 mm.</p>
{table(["Schritt", "Rechnung"], [
  ["① Formel", "V = π/4 · d² · l"],
  ["② In dm", "d = 0,4 dm; l = 5 dm"],
  ["③ Rechnen", "V = π/4 · 0,4 dm · 0,4 dm · 5 dm ≈ <strong>0,6283 dm³</strong>"]])}
<div class="info-box"><h4>💡 Taschenrechner</h4><p>Nimm die <strong>π-Taste</strong>. Tippe zum Beispiel: π ÷ 4 × 0.4 × 0.4 × 5</p></div>
""",
 short=f"""
{KOERPER}
<div class="formula">Würfel: V = a · a · a<br>Quader: V = l · b · h<br>Zylinder: V = π/4 · d² · l</div>
<p><strong>Vorgehen:</strong> Form erkennen → Maße in dm → einsetzen → am Ende runden.</p>
<p><strong>Beispiel:</strong> Rundstab d = 40 mm, l = 500 mm → V = π/4 · 0,4² · 5 ≈ 0,6283 dm³.</p>
""",
)

M[4] = dict(
 card=("🧮", "Modul 4: Mit der Dichteformel rechnen", "ρ = m : V umstellen. Dichte im Tabellenbuch finden. Einheiten."),
 title="Modul 4: Mit der Dichteformel rechnen",
 full=f"""
<h3>Die Formel</h3>
<div class="formula">ρ = m : V<br><span style="color:#94a3b8;">ρ = Dichte in kg/dm³ &nbsp;·&nbsp; m = Masse in kg &nbsp;·&nbsp; V = Volumen in dm³</span></div>
<p>Mit der Formel kannst du jede der drei Größen ausrechnen. Dabei hilft das <strong>Formeldreieck</strong>.</p>
{DREIECK}
{table(["gesucht", "Formel", "so rechnest du"], [
  ["Dichte ρ", "ρ = m : V", "geteilt"],
  ["Masse m", "<strong>m = V · ρ</strong>", "mal"],
  ["Volumen V", "<strong>V = m : ρ</strong>", "geteilt"]])}

<h3>Die Dichte im Tabellenbuch</h3>
{BOOK("Suche im Sachwortverzeichnis nach „Dichte“. Es gibt Werte für feste Stoffe, für Flüssigkeiten und für Gase. In verschiedenen Büchern stehen manchmal leicht andere Werte, z. B. 8,92 oder 8,93 kg/dm³ für Kupfer. Beides ist richtig. Bei manchen Stoffen steht ein Bereich, z. B. bei Heizöl. Dann nimmst du einen Wert daraus.")}

<h3>Einheiten</h3>
<ul>
<li>Feste und flüssige Stoffe: <strong>kg/dm³</strong> oder g/cm³. Das ist dieselbe Zahl.</li>
<li>Gase: <strong>kg/m³</strong>. Gase sind so leicht, dass man eine größere Einheit nimmt.</li>
</ul>
<div class="formula">1 kg/dm³ = 1 g/cm³ = 1000 kg/m³</div>

<h3>Beispiel 1: Masse gesucht</h3>
<p>Ein Kupferteil hat V = 0,25 dm³. Kupfer: ρ ≈ 8,92 kg/dm³ (Tabellenbuch).</p>
<div class="formula">m = V · ρ = 0,25 dm³ · 8,92 kg/dm³ ≈ <strong>2,23 kg</strong></div>

<h3>Beispiel 2: Volumen gesucht</h3>
<p>Es werden 1000 kg Heizöl geliefert. Heizöl: ρ ≈ 0,85 kg/dm³. Im Tabellenbuch steht ein Bereich. 0,85 liegt darin.</p>
<div class="formula">V = m : ρ = 1000 kg : 0,85 kg/dm³ ≈ <strong>1176 dm³ = 1176 l</strong></div>
<div class="info-box"><h4>🧠 Probe</h4><p>Ist das Ergebnis sinnvoll? Heizöl ist leichter als Wasser. 1000 kg Öl brauchen also <strong>mehr</strong> als 1000 l. Passt!</p></div>
""",
 short=f"""
{DREIECK}
<div class="formula">ρ = m : V &nbsp;&nbsp; m = V · ρ &nbsp;&nbsp; V = m : ρ</div>
<p>Einheiten: kg/dm³ = g/cm³. Gase in kg/m³. 1 kg/dm³ = 1000 kg/m³.</p>
{BOOK("Dichte im Sachwortverzeichnis unter „Dichte“. Kleine Unterschiede zwischen Büchern sind in Ordnung.")}
<p><strong>Beispiel:</strong> V = 0,25 dm³ Kupfer → m = 0,25 · 8,92 ≈ 2,23 kg.</p>
""",
 quiz_content=BOOK("Für einige Aufgaben brauchst du die Dichte aus dem Tabellenbuch (Sachwortverzeichnis: „Dichte“). ρ = m : V, m = V · ρ, V = m : ρ."),
)

M[5] = dict(
 card=("🛢️", "Modul 5: Rohre, Speicher und Tanks", "Rohrmasse und Wasserinhalt. Speicher und Heizöltank."),
 card_locked="Gesperrt. Schließe zuerst die Module 1 bis 4 ab.",
 title="Modul 5: Rohre, Speicher und Tanks",
 full=f"""
<h3>Rohre: Was bedeutet 22 × 1?</h3>
<p>Super, du bist im Profi-Bereich! Rohre werden mit zwei Zahlen bezeichnet:</p>
<ul>
<li>Die erste Zahl ist der <strong>Außendurchmesser D</strong> in mm.</li>
<li>Die zweite Zahl ist die <strong>Wanddicke s</strong> in mm.</li>
</ul>
{RING}
<p>Die Wand ist auf beiden Seiten. Darum ziehst du sie zweimal ab: <strong>dᵢ = D − 2 · s</strong>. Beispiel 22 × 1: dᵢ = 22 − 2 = 20 mm.</p>

<h3>Frage 1: Wie schwer ist das Rohr?</h3>
<p>Das Material ist der Ring. Seine Fläche ist der große Kreis minus der kleine Kreis.</p>
<div class="formula">A = π/4 · (D² − dᵢ²) &nbsp;&nbsp;→&nbsp;&nbsp; V = A · l &nbsp;&nbsp;→&nbsp;&nbsp; m = V · ρ</div>
<p><strong>Beispiel:</strong> 10 m Kupferrohr 22 × 1.</p>
{table(["Schritt", "Rechnung"], [
  ["① Innendurchmesser", "dᵢ = 22 mm − 2 · 1 mm = 20 mm"],
  ["② Ringfläche", "A = π/4 · (22² − 20²) ≈ 65,97 mm²"],
  ["③ Volumen", "V = 65,97 mm² · 10 000 mm ≈ 659 700 mm³ ≈ 0,6597 dm³"],
  ["④ Masse", "m = 0,6597 dm³ · 8,92 kg/dm³ ≈ <strong>5,88 kg</strong>"]])}
<div class="info-box"><h4>💡 Tipp</h4><p>mm² · mm ergibt mm³. Von mm³ zu dm³ sind es zwei Stufen: <strong>geteilt durch 1 000 000</strong>.</p></div>

<h3>Frage 2: Wie viel Wasser ist im Rohr?</h3>
<p>Für das Wasser zählt nur der Innendurchmesser. Das Wasser ist ein Zylinder.</p>
<div class="formula">V = π/4 · dᵢ² · l &nbsp;&nbsp;(alles in dm → Liter)</div>
<p><strong>Beispiel:</strong> 10 m Rohr 22 × 1: V = π/4 · (0,2 dm)² · 100 dm ≈ <strong>3,14 l</strong>. Das Wasser wiegt etwa 3,14 kg.</p>

<h3>Speicher und Tanks</h3>
<p>Ein gefüllter Speicher ist schwer. Das muss die Decke tragen. Darum rechnest du: Leergewicht + Masse des Inhalts.</p>
<ul>
<li>Wasser: 1 l wiegt 1 kg.</li>
<li>Heizöl: 1 l wiegt weniger als 1 kg. Die Dichte steht im Tabellenbuch.</li>
</ul>
""",
 short=f"""
{RING}
<div class="formula">dᵢ = D − 2 · s<br>Rohr (Material): A = π/4 · (D² − dᵢ²), V = A · l, m = V · ρ<br>Wasser im Rohr: V = π/4 · dᵢ² · l</div>
<p><strong>Beispiel:</strong> 10 m Kupferrohr 22 × 1 → A ≈ 65,97 mm² → V ≈ 0,6597 dm³ → m ≈ 5,88 kg. Wasser: ≈ 3,14 l.</p>
<p>mm³ → dm³: geteilt durch 1 000 000. Speicher gefüllt = Leergewicht + Inhalt.</p>
""",
 quiz_content=BOOK("Für einige Aufgaben brauchst du die Dichte aus dem Tabellenbuch. Rohr: dᵢ = D − 2 · s."),
)

M[6] = dict(
 card=("🔍", "Modul 6: Werkstoff bestimmen", "Kupfer oder Blei? Löse die Situation vom Anfang."),
 card_locked="Gesperrt. Danach löst du die Situation vom Anfang.",
 title="Modul 6: Werkstoff bestimmen",
 full=f"""
{SITUATION}
<h3>Die Idee</h3>
<p>Jeder Werkstoff hat seine eigene Dichte. Wenn du die Dichte eines Teils ausrechnest, kannst du sie mit dem Tabellenbuch vergleichen. So findest du heraus, woraus das Teil ist. Ohne den Lack abzukratzen!</p>

<h3>Schritt für Schritt</h3>
{table(["Phase", "Was du machst"], [
  ["① Informieren", "Was ist gegeben? Was ist gesucht? Welche Formeln brauche ich?"],
  ["② Planen", "In welcher Reihenfolge rechne ich?"],
  ["③ Ausführen", "Maße umrechnen → Volumen → Dichte ρ = m : V"],
  ["④ Kontrollieren", "Mit dem Tabellenbuch vergleichen: Welcher Wert liegt am nächsten?"],
  ["⑤ Bewerten", "Antwortsatz: „Das Rohr besteht aus …, weil …“"],
  ["⑥ Reflektieren", "Was war schwierig? Was mache ich nächstes Mal anders?"]])}

<h3>Messwerte sind nie ganz genau</h3>
<p>Kein Messschieber und keine Waage misst perfekt. Darum kommt fast nie genau der Wert aus dem Tabellenbuch heraus. Du suchst den Werkstoff mit dem <strong>nächstliegenden</strong> Wert.</p>
{table(["Werkstoff", "Dichte ungefähr"], [["Zink", "7,13 kg/dm³"], ["Kupfer", "8,92 kg/dm³"], ["Blei", "11,34 kg/dm³"]])}

<h3>Kleine Teile: in cm und g rechnen</h3>
<p>Bei kleinen Teilen rechnest du einfacher in <strong>cm</strong> und <strong>g</strong>. Dann kommt die Dichte in g/cm³ heraus. Das ist dieselbe Zahl wie in kg/dm³.</p>
<p>Für eine <strong>Kugel</strong> brauchst du noch eine neue Formel:</p>
<div class="formula">Kugel: V = π/6 · d³ &nbsp;<span style="color:#94a3b8;">(d³ = d · d · d)</span></div>
<p><strong>Beispiel:</strong> Ein Würfel mit 2 cm Kante wiegt 21,6 g. V = 2 · 2 · 2 = 8 cm³. ρ = 21,6 g : 8 cm³ = <strong>2,7 g/cm³</strong> → Aluminium.</p>
{BOOK("Vergleiche deine Ergebnisse mit den Dichten im Tabellenbuch (Sachwortverzeichnis: „Dichte“).")}
""",
 short=f"""
{SITUATION}
<p><strong>Idee:</strong> Dichte ausrechnen und mit dem Tabellenbuch vergleichen. Der nächstliegende Wert gewinnt.</p>
<p><strong>Reihenfolge:</strong> messen → in dm (oder cm) umrechnen → Volumen → ρ = m : V → vergleichen → Antwortsatz.</p>
<p>Kleine Teile: in cm und g rechnen. g/cm³ = kg/dm³.</p>
<div class="formula">Kugel: V = π/6 · d³</div>
""",
 quiz_content=BOOK("Du brauchst die Dichten aus dem Tabellenbuch zum Vergleichen. Kugel: V = π/6 · d³."),
)

M[7] = dict(
 card=("📏", "Modul 7: Längen- und flächenbezogene Masse", "m′ für Rohre, m″ für Bleche. Schnell rechnen ohne Volumen."),
 card_locked="Gesperrt. Danach rechnest du Rohre und Bleche ganz schnell.",
 title="Modul 7: Längen- und flächenbezogene Masse",
 full=f"""
<h3>Warum das?</h3>
<p>Rohre, Profile und Drähte haben immer denselben Querschnitt. Nur die Länge ist anders. Bleche haben immer dieselbe Dicke. Nur die Fläche ist anders. Dann geht es schneller ohne Volumen.</p>

<h3>Längenbezogene Masse m′</h3>
<p><strong>m′</strong> (sprich: „m Strich“) sagt: Wie viel wiegt <strong>1 Meter</strong>? Einheit: <strong>kg/m</strong>.</p>
<div class="formula">m = m′ · l &nbsp;&nbsp;&nbsp;&nbsp; l = m : m′</div>
<p><strong>Beispiel:</strong> Kupferrohr mit m′ = 0,59 kg/m. 12 Stangen à 5 m = 60 m. m = 0,59 kg/m · 60 m = <strong>35,4 kg</strong>.</p>
<p>Andersherum: Ein Ring Kupferrohr wiegt noch 9,75 kg. Bei m′ = 0,39 kg/m sind noch 9,75 : 0,39 = <strong>25 m</strong> drauf.</p>

<h3>Flächenbezogene Masse m″</h3>
<p><strong>m″</strong> (sprich: „m zwei Strich“) sagt: Wie viel wiegt <strong>1 Quadratmeter</strong>? Einheit: <strong>kg/m²</strong>.</p>
<div class="formula">m = m″ · A</div>

<h3>m″ selbst berechnen</h3>
{BLECH}
<p>1 m² Blech mit 1 mm Dicke hat genau 1 dm³ Volumen. Darum gilt ein toller Trick:</p>
<div class="formula">m″ in kg/m² = ρ in kg/dm³ · Dicke s in mm</div>
<p><strong>Beispiel:</strong> Zinkblech, 0,7 mm, ρ ≈ 7,13 kg/dm³: m″ = 7,13 · 0,7 ≈ <strong>4,99 kg/m²</strong>.</p>

<h3>m′ selbst berechnen</h3>
<p>Für 1 m Rohr gilt: V = A · 1000 mm. Daraus folgt der Trick:</p>
<div class="formula">m′ in kg/m = ρ in kg/dm³ · A in mm² : 1000</div>
<p><strong>Beispiel:</strong> Kupferrohr 22 × 1: A ≈ 65,97 mm². m′ = 8,92 · 65,97 : 1000 ≈ <strong>0,588 kg/m</strong>.</p>
{BOOK("Bei manchen Rohren und Profilen steht m′ direkt in der Tabelle. Sonst rechnest du m′ oder m″ mit der Dichte selbst aus.")}
""",
 short=f"""
<div class="formula">m′ in kg/m (Rohre, Profile): m = m′ · l, l = m : m′<br>m″ in kg/m² (Bleche): m = m″ · A</div>
{BLECH}
<p><strong>Tricks:</strong> m″ = ρ · s (s in mm). m′ = ρ · A : 1000 (A in mm²).</p>
<p><strong>Beispiel:</strong> Zinkblech 0,7 mm → m″ = 7,13 · 0,7 ≈ 4,99 kg/m².</p>
""",
 quiz_content=BOOK("Für einige Aufgaben brauchst du die Dichte aus dem Tabellenbuch. m = m′ · l, m = m″ · A, m″ = ρ · s."),
)

M[8] = dict(
 card=("🏆", "Modul 8: Profi-Aufgaben", "Bauteile mit Bohrungen. Länge aus der Masse berechnen."),
 card_locked="Gesperrt. Zum Schluss: die Profi-Aufgaben.",
 title="Modul 8: Profi-Aufgaben",
 full=f"""
<h3>Zusammengesetzte Körper</h3>
<p>Viele Bauteile sind keine einfachen Quader oder Zylinder. Dann <strong>zerlegst</strong> du sie in einfache Teile.</p>
<ul>
<li>Teile, die dazukommen: <strong>addieren</strong>.</li>
<li>Bohrungen und Ausschnitte: <strong>abziehen</strong>. Dort fehlt Material.</li>
</ul>

<h3>Beispiel: Flansch</h3>
{FLANSCH}
{table(["Schritt", "Rechnung (alles in dm)"], [
  ["① volle Scheibe", "V = π/4 · 1,6² · 0,12 ≈ 0,2413 dm³"],
  ["② alle Bohrungen", "V = π/4 · (0,6² + 4 · 0,14²) · 0,12 ≈ 0,0413 dm³"],
  ["③ Flansch", "V ≈ 0,2413 − 0,0413 = 0,2000 dm³"],
  ["④ Masse (Kupfer)", "m ≈ 0,2000 dm³ · 8,92 kg/dm³ ≈ <strong>1,78 kg</strong>"]])}
<div class="info-box"><h4>💡 Tipp</h4><p>Alle Bohrungen haben dieselbe Höhe wie die Scheibe. Darum kannst du ihre Kreisflächen erst addieren und dann einmal mit der Dicke malnehmen.</p></div>

<h3>Rückwärts rechnen: Länge aus der Masse</h3>
<p>Manchmal kennst du die Masse und den Querschnitt. Gesucht ist die Länge. Dann rechnest du rückwärts:</p>
<div class="formula">① V = m : ρ &nbsp;&nbsp;→&nbsp;&nbsp; ② l = V : A</div>
<p><strong>Beispiel:</strong> Ein Vierkant aus Aluminium, 40 × 40 mm, wiegt 2,16 kg.</p>
{table(["Schritt", "Rechnung"], [
  ["① Querschnitt", "A = 0,4 dm · 0,4 dm = 0,16 dm²"],
  ["② Volumen", "V = 2,16 kg : 2,7 kg/dm³ = 0,8 dm³"],
  ["③ Länge", "l = 0,8 dm³ : 0,16 dm² = 5 dm = <strong>500 mm</strong>"]])}
<div class="info-box"><h4>🧠 Merke</h4><p>Erst überlegen: Welche Teile? Was kommt dazu, was fällt weg? Dann alles in dm umrechnen. Erst ganz am Ende runden.</p></div>
""",
 short=f"""
<p><strong>Zerlegen:</strong> Teile, die dazukommen, addieren. Bohrungen und Ausschnitte abziehen.</p>
{FLANSCH}
<p>Flansch: V ≈ 0,2413 − 0,0413 = 0,2000 dm³ → m ≈ 1,78 kg (Kupfer).</p>
<div class="formula">Länge aus Masse: V = m : ρ → l = V : A</div>
<p><strong>Beispiel:</strong> Vierkant 40 × 40, 2,16 kg Aluminium → V = 0,8 dm³ → l = 0,8 : 0,16 = 5 dm = 500 mm.</p>
""",
 quiz_content=BOOK("Für diese Aufgaben brauchst du die Dichte aus dem Tabellenbuch. Bohrungen abziehen! Länge: V = m : ρ, l = V : A."),
)

# ---------------------------------------------------------------- Seite bauen
N = 8
def build(variant):
    titles = {"full": "Masse und Dichte – Lernmodul", "short": "Masse und Dichte – Kompakt", "quiz": "Masse und Dichte – Quiz"}
    sub = {"full": "Von den Teilchen bis zum Rohr. Am Ende findest du heraus, aus welchem Werkstoff ein Bauteil ist.",
           "short": "Das Wichtigste in Kürze. Am Ende findest du heraus, aus welchem Werkstoff ein Bauteil ist.",
           "quiz": "Nur die Fragen. Teste, was du schon kannst."}[variant]
    cards = ""
    for n in range(1, N + 1):
        icon, tt, d = M[n]["card"]
        locked = n > 4
        desc = M[n].get("card_locked", d) if locked else d
        cards += f'''
            <div class="module-card{(" advanced-card locked" if locked else "")}" id="card-{n}" onclick="openModule({n})">
                <div class="module-icon">{icon}</div>
                <div class="module-title">{tt}</div>
                <div class="module-description">{desc}</div>
            </div>
'''
    data = {}
    for n in range(1, N + 1):
        content = M[n]["full"] if variant == "full" else M[n]["short"] if variant == "short" else M[n].get("quiz_content", "")
        data[n] = dict(title=M[n]["title"], content=content)

    header_hint = '<div class="book-hint">📘 Du brauchst dein Tabellenbuch und den Taschenrechner.</div>'
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
            <h1>⚖️ Masse und Dichte ⚖️</h1>
            <p>{sub}</p>
            {header_hint}
        </div>

        <div class="progress-bar">
            <div class="progress-fill" id="progress" style="width: 0%;">0 von {N} Modulen abgeschlossen</div>
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
            <h2 id="expert-title" style="margin-top: 20px; color: #f8fafc;">DICHTE-PROFI!</h2>
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
for v, fn in [("full", "dichte_komplett.html"), ("short", "dichte_kompakt.html"), ("quiz", "dichte_quiz.html")]:
    open(os.path.join(OUT, fn), "w", encoding="utf-8").write(build(v))
    print("geschrieben:", fn)
