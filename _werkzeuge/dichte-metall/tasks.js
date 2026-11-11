// =====================================================================
// Aufgaben für das Modul "Masse und Dichte" (Metall)
// Hilfsfunktionen aus engine.js (rnd, rint, shuffle, pickN, num).
// Zahlenfelder: scale = 10^Nachkommastellen, ans und tol in dieser Stufe.
// Dichtewerte: Prüfwert mit Spielraum, weil Tabellenbücher leicht abweichen.
// Keine Seitenzahlen nennen: Das Modul soll mit jeder Auflage funktionieren.
// m′- und m″-Werte in den Aufgaben sind selbst berechnet (ρ Stahl = 7,85), nicht abgeschrieben.
// =====================================================================

const UNLOCK_TEXT = {
    5: 'Rohre, Buchsen und Lasten am Kran: Volumen und Masse in der Werkstatt.',
    6: 'Unbekannter Werkstoff? Mit der Dichte findest du heraus, was es ist.',
    7: 'Längenbezogene und flächenbezogene Masse: Profile und Bleche schnell berechnen.',
    8: 'Profi-Aufgaben: Absatzwellen und Bauteile mit Bohrungen. Länge aus der Masse berechnen.'
};

// ---------- Dichte: [Prüfwert, Spielraum] in kg/dm³ (Tabellenbuch Metall) ----------
const RHO = {
    'Stahl':             [7.85, 0.06],
    'Kupfer':            [8.96, 0.06],  // manche Bücher 8,93
    'Aluminium':         [2.7, 0.03],
    'Blei':              [11.3, 0.07],
    'Zink':              [7.13, 0.08],
    'Titan':             [4.5, 0.05],
    'Magnesium':         [1.74, 0.03],
    'Silber':            [10.5, 0.1],
    'Gusseisen':         [7.25, 0.08],
    'Messing':           [8.55, 0.16]   // im Buch als Bereich CuZn 8,4 … 8,7
};
const BOOK_RHO = 'Suche die Dichte in deinem Tabellenbuch. Tipp: Sachwortverzeichnis unter „Dichte“.';
const PI_NOTE = 'Rechne mit der π-Taste.';
const MAYBE = '<br><span style="color:#94a3b8;">Steht in deinem Buch ein etwas anderer Dichtewert, ist dein Ergebnis auch richtig.</span>';

// ---------- Zahlen ----------
function clean(x) { return Number(Number(x).toPrecision(12)); }
function decs(x) {
    const s = String(clean(Math.abs(x)));
    if (s.indexOf('e') >= 0) return 9;
    const p = s.split('.');
    return p[1] ? p[1].length : 0;
}
// deutsche Schreibweise, große Zahlen mit Leerzeichen gruppiert
function de(x, dec) {
    let s = (dec === undefined) ? String(clean(x)) : Number(x).toFixed(dec);
    if (s.indexOf('e') >= 0) s = Number(x).toFixed(9).replace(/0+$/, '');
    const neg = s.charAt(0) === '-';
    if (neg) s = s.slice(1);
    let [a, b] = s.split('.');
    if (a.length > 4) a = a.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (neg ? '−' : '') + a + (b ? ',' + b : '');
}
// Zahlenfeld: val = Lösung, dec = Nachkommastellen der Prüfung, rel = relativer Spielraum (0 = genau)
function fld(label, unit, val, dec, rel, extra) {
    const scale = Math.pow(10, dec);
    const ans = Math.round(clean(val) * scale);
    const tol = rel === 0 ? 0 : Math.max(1, Math.ceil(Math.abs(val) * rel * scale));
    return Object.assign({ label: label, unit: unit, ans: ans, tol: tol, scale: scale }, extra || {});
}
function err(val, dec, msg) { return { v: Math.round(clean(val) * Math.pow(10, dec)), msg: msg }; }
function rhoField(name, unit) {
    const r = RHO[name];
    return { label: 'Dichte ρ (' + name + ')', unit: unit || 'kg/dm³', ans: Math.round(r[0] * 1000), tol: Math.round(r[1] * 1000), scale: 1000 };
}
function relB(name) { return RHO[name][1] / RHO[name][0] + 0.006; }   // Spielraum für Ergebnisse mit Buchwert
function rhoTxt(name) { return de(RHO[name][0]); }

function rfTask(all, n, expl) {
    return function () {
        return {
            type: 'match', q: 'Richtig oder falsch?', options: ['richtig', 'falsch'], items: pickN(all, n),
            hint: 'Rot markierte Aussagen hast du noch falsch eingeschätzt. Lies den Lerntext dazu noch einmal.',
            explanation: expl
        };
    };
}

// ---------- Skizzen ----------
const SF = 'font-family="Segoe UI, Arial"';
function svgOpen(w, h, label) { return '<svg viewBox="0 0 ' + w + ' ' + h + '" style="max-width:' + w + 'px; min-width:0" role="img" aria-label="' + label + '">'; }
function txt(x, y, s, size, color, anchor) {
    return '<text x="' + x + '" y="' + y + '" fill="' + (color || '#f8fafc') + '" font-size="' + (size || 16) + '" text-anchor="' + (anchor || 'middle') + '" ' + SF + '>' + s + '</text>';
}

// Teilchenbilder (fest, flüssig, gasförmig) in einem Kasten 150 × 150
const TEILCHEN_POS = {
    'fest': (function () { const a = []; for (let r = 0; r < 6; r++) for (let c = 0; c < 6; c++) a.push([20 + c * 22, 20 + r * 22]); return a; })(),
    'flüssig': [[22,30],[44,24],[68,34],[92,26],[118,32],[30,54],[56,56],[80,52],[106,58],[128,54],[20,80],[44,82],[70,78],[96,84],[122,80],
                [32,106],[58,104],[84,110],[110,104],[132,112],[22,130],[48,130],[74,134],[100,130],[126,134]],
    'gasförmig': [[30,32],[112,24],[70,72],[24,118],[122,104],[78,130]]
};
function teilchenKasten(kind, x0, label, color) {
    let s = '<rect x="' + x0 + '" y="10" width="150" height="150" rx="8" fill="#0f172a" stroke="#64748b" stroke-width="2"/>';
    TEILCHEN_POS[kind].forEach(p => {
        s += '<circle cx="' + (x0 + p[0]) + '" cy="' + (10 + p[1]) + '" r="9" fill="' + (color || '#38bdf8') + '" stroke="#0f172a" stroke-width="1"/>';
    });
    return s + txt(x0 + 75, 188, label, 18, '#fbbf24');
}

// ---------- Kleine Körper-Skizzen für "Anschauungskasten" ----------
function skizzeKoerper(form, a, b, c) {
    let s = svgOpen(320, 190, form);
    if (form === 'Würfel') {
        s += '<polygon points="90,70 190,70 190,170 90,170" fill="#334155" stroke="#94a3b8" stroke-width="2"/>' +
             '<polygon points="90,70 130,40 230,40 190,70" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
             '<polygon points="190,70 230,40 230,140 190,170" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
             txt(140, 188, 'a = ' + a, 17);
    } else if (form === 'Quader') {
        s = svgOpen(430, 190, form) +
            '<polygon points="110,90 310,90 310,150 110,150" fill="#334155" stroke="#94a3b8" stroke-width="2"/>' +
            '<polygon points="110,90 150,60 350,60 310,90" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
            '<polygon points="310,90 350,60 350,120 310,150" fill="#1e293b" stroke="#94a3b8" stroke-width="2"/>' +
            txt(210, 175, 'l = ' + a, 17) + txt(338, 152, 'b = ' + b, 16, '#f8fafc', 'start') +
            txt(102, 126, 'h = ' + c, 16, '#f8fafc', 'end');
    } else if (form === 'Kugel') {
        s += '<circle cx="160" cy="90" r="70" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
             '<ellipse cx="160" cy="90" rx="70" ry="16" fill="none" stroke="#94a3b8" stroke-dasharray="5 4"/>' +
             '<line x1="90" y1="90" x2="230" y2="90" stroke="#fbbf24" stroke-width="2"/>' +
             txt(160, 82, 'd = ' + a, 17, '#fbbf24');
    } else {   // Rundstab
        s += '<rect x="50" y="65" width="200" height="60" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
             '<ellipse cx="250" cy="95" rx="14" ry="30" fill="#334155" stroke="#94a3b8" stroke-width="2"/>' +
             '<ellipse cx="50" cy="95" rx="14" ry="30" fill="#475569" stroke="#94a3b8" stroke-width="2"/>' +
             txt(150, 150, 'l = ' + b, 17) + txt(272, 100, 'd = ' + a, 17, '#f8fafc', 'start');
    }
    return s + '</svg>';
}

// ---------- Flansch (Draufsicht) ----------
function skizzeFlansch(D, d, dl, s) {
    const R = 80, r = R * d / D, rl = Math.max(6, R * dl / D), rk = (R + r) / 2;
    let g = svgOpen(420, 210, 'Flansch mit Mittelbohrung und vier Löchern');
    g += '<circle cx="110" cy="100" r="' + R + '" fill="#475569" stroke="#94a3b8" stroke-width="2"/>';
    g += '<circle cx="110" cy="100" r="' + r + '" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>';
    [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(p => {
        g += '<circle cx="' + (110 + p[0] * rk) + '" cy="' + (100 + p[1] * rk) + '" r="' + rl + '" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>';
    });
    g += txt(230, 50, 'Außen: D = ' + D + ' mm', 16, '#f8fafc', 'start');
    g += txt(230, 80, 'Mitte: d = ' + d + ' mm', 16, '#f8fafc', 'start');
    g += txt(230, 110, '4 Löcher: je ' + dl + ' mm', 16, '#f8fafc', 'start');
    g += txt(230, 140, 'Dicke: s = ' + s + ' mm', 16, '#fbbf24', 'start');
    return g + '</svg>';
}

// ---------- Platte mit Ausschnitt ----------
function skizzePlatte(l, b, a, c) {
    let g = svgOpen(420, 200, 'Platte mit rechteckigem Ausschnitt');
    g += '<rect x="30" y="30" width="260" height="140" fill="#475569" stroke="#94a3b8" stroke-width="2"/>';
    g += '<rect x="110" y="70" width="100" height="60" fill="#0f172a" stroke="#94a3b8" stroke-width="2"/>';
    g += txt(160, 22, 'l = ' + l + ' mm', 15) + txt(300, 105, 'b = ' + b + ' mm', 15, '#f8fafc', 'start');
    g += txt(160, 105, a + ' × ' + c + ' mm', 14, '#fbbf24');
    return g + '</svg>';
}

// ---------- Umrechnen von Volumen ----------
const VOL = ['mm³', 'cm³', 'dm³', 'm³'];
function volName(i) {
    if (i === 2 && Math.random() < 0.3) return 'l';
    if (i === 1 && Math.random() < 0.15) return 'ml';
    return VOL[i];
}
function convField() {
    const VALS = [1.5, 2.4, 0.75, 12, 0.36, 4.8, 250, 35, 0.05, 6.25, 125, 0.8, 3, 7.2, 18, 450, 1200, 0.025, 64, 9.5, 2500, 0.4];
    for (let t = 0; t < 200; t++) {
        const i = rint(0, 3), j = rint(0, 3);
        if (i === j || Math.abs(i - j) > 2) continue;
        const k = i - j;                       // > 0: in kleinere Einheit → mal
        const v = rnd(VALS);
        const r = clean(v * Math.pow(1000, k));
        if (r < 0.0001 || r > 5e7) continue;
        const dec = decs(r);
        if (dec > 6) continue;
        const errs = [err(v * Math.pow(100, k), dec, 'Bei Volumen ist die Umrechnungszahl 1000, nicht 100.')];
        if (Math.abs(k) === 2) errs.push(err(v * Math.pow(1000, k / 2), dec, 'Das sind zwei Stufen. Also zweimal 1000.'));
        errs.push(err(v / Math.pow(1000, k), dec, 'Falsche Richtung. Kleinere Einheit → die Zahl wird größer.'));
        return fld(de(v) + ' ' + volName(i) + ' =', volName(j), r, dec, 0, { errors: errs });
    }
}

// ---------- Absatzwelle (Seitenansicht) ----------
function skizzeWelle(d1, l1, d2, l2) {
    const H1 = 100, H2 = Math.max(30, Math.round(100 * d2 / d1));
    const W1 = 170, W2 = Math.round(170 * l2 / l1 > 230 ? 230 : 170 * l2 / l1);
    const x0 = 30, yc = 95;
    let g = svgOpen(460, 200, 'Absatzwelle aus zwei Zylindern');
    g += '<rect x="' + x0 + '" y="' + (yc - H1 / 2) + '" width="' + W1 + '" height="' + H1 + '" fill="#475569" stroke="#94a3b8" stroke-width="2"/>';
    g += '<rect x="' + (x0 + W1) + '" y="' + (yc - H2 / 2) + '" width="' + W2 + '" height="' + H2 + '" fill="#64748b" stroke="#94a3b8" stroke-width="2"/>';
    g += '<line x1="15" y1="' + yc + '" x2="' + (x0 + W1 + W2 + 15) + '" y2="' + yc + '" stroke="#f8fafc" stroke-width="1.2" stroke-dasharray="10 4 2 4"/>';
    g += txt(x0 + W1 / 2, 32, 'd₁ = ' + d1 + ' mm', 15, '#fbbf24') + txt(x0 + W1 / 2, 170, 'l₁ = ' + l1 + ' mm', 15);
    g += txt(x0 + W1 + W2 / 2, yc - H2 / 2 - 8, 'd₂ = ' + d2 + ' mm', 15, '#fbbf24') + txt(x0 + W1 + W2 / 2, yc + H2 / 2 + 22, 'l₂ = ' + l2 + ' mm', 15);
    return g + '</svg>';
}

// =====================================================================
const TASKS = {
// ---------------------------------------------------------------- Modul 1
1: [
    {
        type: 'mc', q: 'Was gibt die Dichte eines Stoffes an?',
        options: [
            'Wie hart der Stoff ist.',
            'Wie viel Masse in einem bestimmten Volumen steckt.',
            'Wie groß ein Bauteil ist.',
            'Wie schwer ein Bauteil ist, egal wie groß es ist.'
        ],
        correct: 1,
        hint: 'Bei der Dichte geht es um zwei Dinge: Masse und Volumen.',
        explanation: 'Die Dichte sagt: Wie viel Masse steckt in 1 dm³? Bei Stahl sind es etwa 7,85 kg. Bei Wasser 1 kg.'
    },
    function () {
        const kinds = shuffle(['fest', 'flüssig', 'gasförmig']);
        const L = ['A', 'B', 'C'];
        let svg = svgOpen(530, 200, 'Drei Teilchenbilder A, B und C');
        kinds.forEach((k, i) => { svg += teilchenKasten(k, 15 + i * 175, 'Bild ' + L[i]); });
        svg += '</svg>';
        return {
            type: 'match', svg: svg, newLabel: 'Neue Bilder',
            q: 'Die Bilder zeigen die Teilchen in einem Stoff. Ist der Stoff fest, flüssig oder gasförmig?',
            options: ['fest', 'flüssig', 'gasförmig'], shuffle: false,
            items: kinds.map((k, i) => ({ left: 'Bild ' + L[i], answer: k })),
            hint: 'Fest: Die Teilchen sitzen ordentlich in Reihen. Flüssig: dicht, aber durcheinander. Gas: wenige Teilchen, weit auseinander.',
            explanation: 'Fest: ordentlich gepackt. Flüssig: dicht, aber ungeordnet. Gasförmig: große Abstände. Darum haben Gase eine sehr kleine Dichte.'
        };
    },
    rfTask([
        { left: 'Alle Stoffe bestehen aus winzigen Teilchen.', answer: 'richtig' },
        { left: 'Je dichter die Teilchen gepackt sind, desto größer ist die Dichte.', answer: 'richtig' },
        { left: 'Je schwerer die einzelnen Teilchen sind, desto größer ist die Dichte.', answer: 'richtig' },
        { left: 'In einem Gas liegen die Teilchen dicht beieinander.', answer: 'falsch' },
        { left: 'Eine große Stahlplatte hat eine größere Dichte als eine kleine Stahlschraube.', answer: 'falsch' },
        { left: 'Mit der Dichte kann man einen Stoff erkennen.', answer: 'richtig' },
        { left: 'Ein schweres Bauteil hat immer eine große Dichte.', answer: 'falsch' },
        { left: 'Gase haben eine viel kleinere Dichte als feste Stoffe.', answer: 'richtig' },
        { left: 'Halbiert man einen Rundstab, dann halbiert sich auch die Dichte.', answer: 'falsch' },
        { left: 'Aluminium schwimmt auf Wasser, weil es ein Leichtmetall ist.', answer: 'falsch' }
    ], 5, 'Merke: Die Dichte hängt nur vom Stoff ab, nicht von der Größe des Stücks. Sie wird groß, wenn die Teilchen schwer sind und dicht gepackt sind. Auch Leichtmetalle sind schwerer als Wasser.'),
    function () {
        const POOL = [
            ['Maschinenöl, 0,91 kg/dm³', 'schwimmt'], ['Eis, 0,92 kg/dm³', 'schwimmt'], ['Holz (trocken), 0,5 kg/dm³', 'schwimmt'],
            ['Kork, 0,2 kg/dm³', 'schwimmt'],
            ['Stahl, 7,85 kg/dm³', 'geht unter'], ['Kupfer, 8,96 kg/dm³', 'geht unter'], ['Magnesium, 1,74 kg/dm³', 'geht unter'],
            ['Blei, 11,3 kg/dm³', 'geht unter'], ['Aluminium, 2,7 kg/dm³', 'geht unter'], ['Titan, 4,5 kg/dm³', 'geht unter']
        ];
        let items;
        do { items = pickN(POOL, 5); } while (items.every(x => x[1] === items[0][1]));
        return {
            type: 'match', newLabel: 'Neue Stoffe',
            q: 'Der Stoff kommt in Wasser (1 kg/dm³). Schwimmt er oben oder geht er unter?',
            options: ['schwimmt', 'geht unter'],
            items: items.map(x => ({ left: x[0], answer: x[1] })),
            hint: 'Vergleiche mit Wasser: 1 kg/dm³. Kleinere Dichte: schwimmt. Größere Dichte: geht unter.',
            explanation: 'Dichte kleiner als 1 kg/dm³: Der Stoff schwimmt. Darum schwimmt Öl oben auf dem Kühlschmierstoff. Alle Metalle gehen unter, auch Magnesium.'
        };
    },
    {
        type: 'mc', q: 'Ein Würfel aus Blei und ein Würfel aus Aluminium sind gleich groß. Der Bleiwürfel ist etwa 4-mal so schwer. Warum?',
        options: [
            'Der Bleiwürfel hat mehr Volumen.',
            'Im Aluminium sind die Teilchen dichter gepackt.',
            'Ein Bleiatom ist viel schwerer als ein Aluminiumatom.',
            'Blei ist härter als Aluminium.'
        ],
        correct: 2,
        hint: 'Beide Würfel haben dasselbe Volumen. Die Teilchen sind ähnlich dicht gepackt. Was ist dann noch anders?',
        explanation: 'Ein Bleiatom ist fast 8-mal so schwer wie ein Aluminiumatom. Die Atome sind ähnlich dicht gepackt. Darum hat Blei die viel größere Dichte.'
    },
    {
        type: 'mc', q: 'Ein Halter für ein Rennrad soll möglichst leicht sein. Alle Entwürfe haben dasselbe Volumen. Welcher Werkstoff macht den Halter am leichtesten?',
        options: ['Stahl', 'Kupfer', 'Aluminium', 'Messing'],
        correct: 2,
        hint: 'Gleiches Volumen: Der Werkstoff mit der kleinsten Dichte ergibt die kleinste Masse.',
        explanation: 'Aluminium hat etwa 2,7 kg/dm³. Stahl hat 7,85 kg/dm³, Messing und Kupfer noch mehr. Aluminium ist ein Leichtmetall. Darum nimmt man es im Leichtbau.'
    }
],
// ---------------------------------------------------------------- Modul 2
2: [
    function () {
        return {
            type: 'num', q: 'Rechne die Volumen um.',
            note: '1 l = 1 dm³ und 1 ml = 1 cm³. Tippe die Zahl ohne Einheit ein.',
            fields: [convField(), convField(), convField()],
            hint: 'Jede Stufe auf der Treppe ist mal 1000 oder geteilt durch 1000. Nach unten (kleinere Einheit): mal. Nach oben: geteilt.',
            explanation: 'Bei Volumen ist die Umrechnungszahl immer <strong>1000</strong>: mm³ → cm³ → dm³ → m³.'
        };
    },
    function () {
        const a = rnd([250, 80, 45, 1200, 15, 600, 32, 5, 125, 350]);
        const b = rnd([35, 120, 8, 64, 250, 5, 42]);
        const c = rnd([2, 1.5, 0.6, 3.25, 0.08, 1.2, 0.35]);
        return {
            type: 'num', q: 'Vor dem Rechnen rechnest du alle Längen in <strong>dm</strong> um.',
            note: '1 dm = 100 mm = 10 cm. 1 m = 10 dm.',
            fields: [
                fld(de(a) + ' mm =', 'dm', a / 100, decs(a / 100), 0, { errors: [err(a / 10, decs(a / 100), 'Das wären cm. 1 dm = 100 mm.'), err(a / 1000, decs(a / 100), 'Das wären m. 1 dm = 100 mm.')] }),
                fld(de(b) + ' cm =', 'dm', b / 10, decs(b / 10), 0, { errors: [err(b / 100, decs(b / 10), 'Das wären m. 1 dm = 10 cm.')] }),
                fld(de(c) + ' m =', 'dm', c * 10, decs(c * 10), 0, { errors: [err(c * 100, decs(c * 10), 'Das wären cm. 1 m = 10 dm.')] })
            ],
            hint: 'mm → dm: geteilt durch 100. cm → dm: geteilt durch 10. m → dm: mal 10.',
            explanation: de(a) + ' mm = ' + de(a / 100) + ' dm; ' + de(b) + ' cm = ' + de(b / 10) + ' dm; ' + de(c) + ' m = ' + de(c * 10) + ' dm.'
        };
    },
    function () {
        const POOL = [['1 m³', '1000 l'], ['1 dm³', '1 l'], ['1 cm³', '1 ml'], ['0,5 m³', '500 l'], ['250 cm³', '0,25 l'],
                      ['2000 cm³', '2 l'], ['0,2 m³', '200 l'], ['1500 ml', '1,5 dm³']];
        const sel = pickN(POOL, 5);
        return {
            type: 'match', newLabel: 'Neue Aufgabe',
            q: 'Welche Angaben sind gleich groß? Ordne zu.',
            options: sel.map(x => x[1]),
            items: sel.map(x => ({ left: x[0], answer: x[1] })),
            hint: '1 m³ = 1000 dm³ = 1000 l. 1 dm³ = 1 l = 1000 cm³. 1 cm³ = 1 ml.',
            explanation: 'Merke dir: <strong>1 dm³ = 1 l</strong> und <strong>1 m³ = 1000 l</strong>. Das brauchst du für Behälter, Tanks und Rohre.'
        };
    },
    function () {
        const CM3 = [300, 500, 750, 800, 1200, 1500, 2500, 4000, 6000, 9000];
        const sel = pickN(CM3, 4).sort((a, b) => a - b);
        const show = sel.map(v => {
            const opt = [[v * 1000, 'mm³'], [v, 'cm³'], [v / 1000, rnd(['dm³', 'l'])], [v / 1e6, 'm³']].filter(o => decs(o[0]) <= 4 && o[0] <= 1e7);
            const o = rnd(opt);
            return de(o[0]) + ' ' + o[1];
        });
        return {
            type: 'order', newLabel: 'Neue Aufgabe',
            q: 'Sortiere die Volumen. Das kleinste kommt nach oben.',
            steps: show,
            hint: 'Rechne alle Angaben in dieselbe Einheit um, z. B. in cm³. Dann vergleichen.',
            explanation: show.join(' &lt; ') + '<br>In cm³: ' + sel.map(v => de(v) + ' cm³').join(' &lt; ')
        };
    },
    {
        type: 'mc', q: 'Ein Azubi rechnet: <strong>3,5 dm³ = 350 cm³</strong>. Stimmt das?',
        options: [
            'Ja, das stimmt.',
            'Nein. Richtig ist 35 cm³.',
            'Nein. Richtig ist 3500 cm³. Bei Volumen rechnet man mal 1000.',
            'Nein. Richtig ist 0,35 cm³.'
        ],
        correct: 2,
        hint: 'Wie groß ist die Umrechnungszahl bei Volumen?',
        explanation: 'Der Azubi hat mit 100 gerechnet. Das gilt für Flächen. Bei Volumen gilt: 1 dm³ = 1000 cm³. Also 3,5 dm³ = 3500 cm³.'
    },
    {
        type: 'mc', q: 'Warum ist 1 dm³ genau 1000 cm³?',
        options: [
            'Weil 1 dm = 1000 cm.',
            'Ein Würfel mit 1 dm Kante ist 10 cm lang, 10 cm breit und 10 cm hoch: 10 · 10 · 10 = 1000.',
            'Das ist eine Regel, die man auswendig lernen muss.',
            'Weil 1 Liter Wasser 1000 g wiegt.'
        ],
        correct: 1,
        hint: 'Stell dir einen Würfel mit 1 dm Kantenlänge vor. Wie viele kleine Würfel mit 1 cm passen hinein?',
        explanation: 'In jede Richtung passen 10 kleine Würfel: 10 · 10 · 10 = 1000. Darum ist bei Volumen die Umrechnungszahl 1000.'
    }
],
// ---------------------------------------------------------------- Modul 3
3: [
    function () {
        const POOL = [['Blech', 'Quader'], ['Rundstab', 'Zylinder'], ['Welle (ohne Absatz)', 'Zylinder'],
                      ['Flachstahl', 'Quader'], ['Passfeder (vereinfacht)', 'Quader'],
                      ['Vierkant', 'Quader'], ['runde Scheibe (Ronde)', 'Zylinder'], ['Bolzen', 'Zylinder']];
        let sel;
        do { sel = pickN(POOL, 5); } while (sel.every(x => x[1] === sel[0][1]));
        return {
            type: 'match', newLabel: 'Neue Aufgabe',
            q: 'Welche Grundform hat das Bauteil? Welche Volumenformel nimmst du?',
            options: ['Quader: V = l · b · h', 'Zylinder: V = π/4 · d² · l'],
            items: sel.map(x => ({ left: x[0], answer: x[1] === 'Quader' ? 'Quader: V = l · b · h' : 'Zylinder: V = π/4 · d² · l' })),
            hint: 'Eckig: Quader. Rund mit Durchmesser: Zylinder. Auch eine flache runde Scheibe ist ein Zylinder.',
            explanation: 'Eckige Körper rechnest du wie einen Quader. Runde Körper mit gleichem Durchmesser rechnest du wie einen Zylinder. Bei der Ronde ist die „Länge“ die Dicke.'
        };
    },
    function () {
        const a = rnd([2, 3, 4, 5, 6, 8, 1.5, 2.5, 12]);
        const V = clean(a * a * a);
        return {
            type: 'num', q: 'Ein Würfel hat die Kantenlänge <strong>a = ' + de(a) + ' cm</strong>. Berechne das Volumen.',
            note: 'V = a · a · a',
            fields: [
                fld('Volumen V', 'cm³', V, decs(V), 0, { errors: [err(3 * a, decs(V), 'Nicht a · 3, sondern a · a · a.'), err(a * a, decs(V), 'Das ist die Fläche einer Seite. Für das Volumen noch einmal mal a.')] }),
                fld('Volumen V', 'dm³', V / 1000, decs(V / 1000), 0, { errors: [err(V / 100, decs(V / 1000), 'Bei Volumen geteilt durch 1000, nicht durch 100.')] })
            ],
            hint: 'Rechne a · a · a. Dann von cm³ in dm³: geteilt durch 1000.',
            explanation: 'V = ' + de(a) + ' cm · ' + de(a) + ' cm · ' + de(a) + ' cm = <strong>' + de(V) + ' cm³</strong> = <strong>' + de(V / 1000) + ' dm³</strong>.'
        };
    },
    function () {
        const l = rnd([250, 300, 200, 400, 150, 500]), b = rnd([80, 60, 50, 100, 120, 40]), h = rnd([50, 30, 20, 40, 25, 60]);
        const V = clean(l * b * h / 1e6);
        return {
            type: 'num', q: 'Ein Rohteil hat die Form eines Quaders: <strong>l = ' + l + ' mm, b = ' + b + ' mm, h = ' + h + ' mm</strong>. Rechne die Maße in dm um. Berechne dann das Volumen in dm³.',
            note: '1 dm = 100 mm.',
            fields: [
                fld('l', 'dm', l / 100, 2, 0), fld('b', 'dm', b / 100, 2, 0), fld('h', 'dm', h / 100, 2, 0),
                fld('Volumen V', 'dm³', V, decs(V), 0, { errors: [err(l * b * h, decs(V), 'Das ist das Volumen in mm³. Rechne zuerst in dm um.')] })
            ],
            hint: 'Jede Länge in mm durch 100 teilen. Dann V = l · b · h.',
            explanation: 'V = ' + de(l / 100) + ' dm · ' + de(b / 100) + ' dm · ' + de(h / 100) + ' dm = <strong>' + de(V) + ' dm³</strong>.'
        };
    },
    function () {
        const l = rnd([1.2, 1.5, 0.8, 1]), b = rnd([50, 60, 40, 45]), h = rnd([300, 250, 350, 200]);
        const V = clean(l * 10 * b / 10 * h / 100);
        return {
            type: 'num', q: 'Der Behälter für Kühlschmierstoff an einer Drehmaschine ist innen <strong>' + de(l) + ' m</strong> lang, <strong>' + b + ' cm</strong> breit und <strong>' + h + ' mm</strong> hoch. Wie viele Liter passen hinein?',
            note: 'Trick: Rechne alle Maße in dm um. Dann kommt das Volumen in dm³ heraus, also in Litern.',
            fields: [
                fld('l', 'dm', l * 10, 1, 0), fld('b', 'dm', b / 10, 1, 0), fld('h', 'dm', h / 100, 1, 0),
                fld('Volumen V', 'l', V, decs(V), 0)
            ],
            hint: 'l = ' + de(l) + ' m = ? dm; b = ' + b + ' cm = ? dm; h = ' + h + ' mm = ? dm. Dann V = l · b · h.',
            explanation: 'V = ' + de(l * 10) + ' dm · ' + de(b / 10) + ' dm · ' + de(h / 100) + ' dm = <strong>' + de(V) + ' dm³ = ' + de(V) + ' l</strong>.'
        };
    },
    function () {
        const d = rnd([20, 30, 40, 50, 60]), l = rnd([100, 150, 200, 250, 300, 500]);
        const V = Math.PI / 4 * Math.pow(d / 100, 2) * (l / 100);
        return {
            type: 'num', q: 'Ein Rundstab hat den Durchmesser <strong>d = ' + d + ' mm</strong> und die Länge <strong>l = ' + l + ' mm</strong>. Berechne das Volumen in dm³.',
            note: 'V = π/4 · d² · l. ' + PI_NOTE + ' Runde das Volumen auf 4 Stellen nach dem Komma.',
            fields: [
                fld('d', 'dm', d / 100, 2, 0), fld('l', 'dm', l / 100, 2, 0),
                fld('Volumen V', 'dm³', V, 4, 0.004, { errors: [err(Math.PI * Math.pow(d / 100, 2) * l / 100, 4, 'Du hast /4 vergessen: π/4 · d² · l.'), err(Math.PI / 4 * (d / 100) * (l / 100), 4, 'd muss ins Quadrat: d² = d · d.')] })
            ],
            hint: 'Erst d und l in dm. Dann π : 4 · d · d · l.',
            explanation: 'V = π/4 · (' + de(d / 100) + ' dm)² · ' + de(l / 100) + ' dm ≈ <strong>' + de(V, 4) + ' dm³</strong>.'
        };
    },
    function () {
        const d = rnd([30, 40, 50, 60]), h = rnd([50, 60, 80, 100]);
        const V = Math.PI / 4 * Math.pow(d / 10, 2) * h / 10;
        return {
            type: 'num', q: 'Der runde Öltank einer Hydraulikpresse ist innen <strong>' + d + ' cm</strong> breit (Durchmesser) und <strong>' + h + ' cm</strong> hoch. Wie viele Liter Hydrauliköl passen hinein?',
            note: 'Rechne in dm. ' + PI_NOTE + ' Runde auf ganze Liter.',
            fields: [
                fld('Volumen V', 'l', V, 0, 0.004, { errors: [err(Math.PI * Math.pow(d / 10, 2) * h / 10, 0, 'Du hast /4 vergessen: π/4 · d² · h.')] }),
                fld('Volumen V', 'm³', V / 1000, 3, 0.006)
            ],
            hint: 'd = ' + d + ' cm = ' + de(d / 10) + ' dm; h = ' + h + ' cm = ' + de(h / 10) + ' dm. V = π/4 · d² · h. Für m³: durch 1000.',
            explanation: 'V = π/4 · (' + de(d / 10) + ' dm)² · ' + de(h / 10) + ' dm ≈ <strong>' + de(V, 0) + ' l ≈ ' + de(V / 1000, 3) + ' m³</strong>.'
        };
    }
],
// ---------------------------------------------------------------- Modul 4
4: [
    {
        type: 'mc', q: 'Die Formel lautet ρ = m : V. Wie berechnest du die <strong>Masse m</strong>?',
        options: ['m = ρ : V', 'm = V : ρ', 'm = V · ρ', 'm = ρ − V'],
        correct: 2,
        hint: 'Halte im Formeldreieck das m zu. Was bleibt übrig? Stehen die beiden nebeneinander, rechnest du mal.',
        explanation: 'm = V · ρ. Im Formeldreieck stehen V und ρ unten nebeneinander. Das bedeutet: mal.'
    },
    {
        type: 'mc', q: 'Wie berechnest du das <strong>Volumen V</strong>, wenn du Masse und Dichte kennst?',
        options: ['V = m · ρ', 'V = m : ρ', 'V = ρ : m', 'V = m + ρ'],
        correct: 1,
        hint: 'Halte im Formeldreieck das V zu. Steht etwas oben und unten, rechnest du geteilt.',
        explanation: 'V = m : ρ. Die Masse steht oben, die Dichte unten. Das bedeutet: geteilt.'
    },
    function () {
        const name = rnd(['Aluminium', 'Magnesium', 'Kupfer', 'Blei', 'Stahl', 'Titan', 'Silber']);
        const V = rnd([0.2, 0.25, 0.4, 0.5, 0.8, 1.2, 0.15, 0.6]);
        const m = Math.round(V * RHO[name][0] * 1000) / 1000;
        const rho = m / V;
        return {
            type: 'num', q: 'Ein Werkstück hat das Volumen <strong>V = ' + de(V) + ' dm³</strong> und die Masse <strong>m = ' + de(m) + ' kg</strong>. Berechne die Dichte.',
            note: 'ρ = m : V. Runde auf 2 Stellen nach dem Komma.',
            fields: [fld('Dichte ρ', 'kg/dm³', rho, 2, 0.003, { errors: [err(V / m, 2, 'Andersherum: Masse geteilt durch Volumen.'), err(m * V, 2, 'Nicht mal, sondern geteilt: ρ = m : V.')] })],
            hint: 'Masse geteilt durch Volumen: ' + de(m) + ' : ' + de(V) + '.',
            explanation: 'ρ = ' + de(m) + ' kg : ' + de(V) + ' dm³ ≈ <strong>' + de(rho, 2) + ' kg/dm³</strong>. Das passt zu ' + name + '.'
        };
    },
    function () {
        const V = rnd([0.626, 0.45, 0.82, 1.15, 0.38, 0.54]);
        const m = V * RHO['Stahl'][0];
        return {
            type: 'num', book: true,
            q: 'Ein Lagerdeckel aus Stahl hat ein Volumen von <strong>V = ' + de(V) + ' dm³</strong>. Wie viel kg wiegt er?',
            note: 'm = V · ρ. Runde auf 2 Stellen nach dem Komma. ' + BOOK_RHO,
            fields: [rhoField('Stahl'), fld('Masse m', 'kg', m, 2, relB('Stahl'), { errors: [err(V / 7.85, 2, 'Nicht geteilt, sondern mal: m = V · ρ.')] })],
            hint: 'Dichte von Stahl nachschlagen. Dann Volumen mal Dichte.',
            explanation: 'ρ ≈ ' + rhoTxt('Stahl') + ' kg/dm³. m = ' + de(V) + ' dm³ · ' + rhoTxt('Stahl') + ' kg/dm³ ≈ <strong>' + de(m, 2) + ' kg</strong>.' + MAYBE
        };
    },
    function () {
        const m = rnd([29, 43.5, 58, 87, 116, 21.75, 36.25]);
        const V = m / RHO['Gusseisen'][0];
        const rel = relB('Gusseisen');
        return {
            type: 'num', book: true,
            q: 'Ein Maschinenfuß aus <strong>Gusseisen</strong> wiegt <strong>' + de(m) + ' kg</strong>. Welches Volumen hat er?',
            note: 'V = m : ρ. Runde auf 2 Stellen nach dem Komma. ' + BOOK_RHO,
            fields: [rhoField('Gusseisen'),
                     fld('Volumen V', 'dm³', V, 2, rel, { errors: [err(m * 7.25, 2, 'Nicht mal, sondern geteilt: V = m : ρ.')] }),
                     fld('Volumen V', 'cm³', V * 1000, 0, rel + 0.002)],
            hint: 'Masse geteilt durch Dichte. Das Ergebnis ist in dm³. Für cm³: mal 1000.',
            explanation: 'ρ ≈ ' + rhoTxt('Gusseisen') + ' kg/dm³. V = ' + de(m) + ' kg : ' + rhoTxt('Gusseisen') + ' kg/dm³ ≈ <strong>' + de(V, 2) + ' dm³ ≈ ' + de(V * 1000, 0) + ' cm³</strong>.' + MAYBE
        };
    },
    function () {
        const POOL = [['Stahl', 'kg/dm³'], ['Kupfer', 'kg/dm³'], ['Wasser', 'kg/dm³'], ['Maschinenöl', 'kg/dm³'], ['Aluminium', 'kg/dm³'],
                      ['Luft', 'kg/m³'], ['Argon (Schutzgas)', 'kg/m³'], ['Sauerstoff', 'kg/m³'], ['Acetylen', 'kg/m³']];
        let sel;
        do { sel = pickN(POOL, 5); } while (sel.every(x => x[1] === sel[0][1]));
        return {
            type: 'match', newLabel: 'Neue Stoffe',
            q: 'In welcher Einheit steht die Dichte meistens im Tabellenbuch?',
            options: ['kg/dm³', 'kg/m³'],
            items: sel.map(x => ({ left: x[0], answer: x[1] })),
            hint: 'Feste und flüssige Stoffe: kg/dm³. Gase sind sehr leicht. Darum nimmt man eine größere Volumeneinheit.',
            explanation: 'Feste und flüssige Stoffe: <strong>kg/dm³</strong> (oder g/cm³). Gase, z. B. Schweißgase: <strong>kg/m³</strong>. Luft hat etwa 1,29 kg/m³.'
        };
    },
    function () {
        const name = rnd(['Magnesium', 'Kupfer', 'Aluminium', 'Blei', 'Stahl', 'Titan']);
        const r = RHO[name][0];
        return {
            type: 'num',
            q: 'Die Dichte von ' + name + ' ist <strong>ρ = ' + de(r) + ' kg/dm³</strong>. Gib den Wert in den anderen Einheiten an.',
            note: '1 kg/dm³ = 1 g/cm³ = 1000 kg/m³ = 1 t/m³.',
            fields: [
                fld('ρ', 'g/cm³', r, decs(r), 0, { errors: [err(r * 1000, decs(r), 'g und cm³ werden beide 1000-mal kleiner. Die Zahl bleibt gleich.')] }),
                fld('ρ', 'kg/m³', r * 1000, 0, 0, { errors: [err(r * 100, 0, '1 m³ = 1000 dm³. Also mal 1000.'), err(r, 0, '1 m³ ist 1000-mal größer als 1 dm³. Da passt 1000-mal so viel Masse hinein.')] })
            ],
            hint: 'kg/dm³ und g/cm³: gleiche Zahl. In kg/m³: mal 1000.',
            explanation: de(r) + ' kg/dm³ = <strong>' + de(r) + ' g/cm³</strong> = <strong>' + de(r * 1000) + ' kg/m³</strong>.'
        };
    }
],
// ---------------------------------------------------------------- Modul 5
5: [
    function () {
        const [D, s] = rnd([[20, 2], [25, 2.5], [30, 3], [40, 4], [50, 5], [60, 5], [30, 2], [42, 3], [16, 1.5], [35, 4]]);
        const di = D - 2 * s;
        return {
            type: 'num', q: 'Ein Stahlrohr hat die Bezeichnung <strong>' + D + ' × ' + de(s) + '</strong>. Wie groß ist der Innendurchmesser?',
            note: 'Die erste Zahl ist der Außendurchmesser in mm. Die zweite Zahl ist die Wanddicke in mm.',
            fields: [fld('Innendurchmesser dᵢ', 'mm', di, 1, 0, { errors: [err(D - s, 1, 'Die Wand ist auf beiden Seiten. Also 2 · Wanddicke abziehen.')] })],
            hint: 'dᵢ = D − 2 · s',
            explanation: 'dᵢ = ' + D + ' mm − 2 · ' + de(s) + ' mm = <strong>' + de(di) + ' mm</strong>.'
        };
    },
    function () {
        const [D, s] = rnd([[20, 2], [25, 2.5], [30, 3], [40, 4], [50, 5]]);
        const L = rnd([2, 3, 4, 6]);
        const di = D - 2 * s;
        const A = Math.PI / 4 * (D * D - di * di);          // mm²
        const V = A * L * 1000 / 1e6;                       // dm³
        const m = V * RHO['Stahl'][0];
        return {
            type: 'num', book: true,
            q: 'Wie schwer sind <strong>' + L + ' m Stahlrohr ' + D + ' × ' + de(s) + '</strong>? Rechne Schritt für Schritt.',
            note: 'Ringfläche: A = π/4 · (D² − dᵢ²). ' + PI_NOTE + ' Runde A auf 1 Stelle, V auf 4 Stellen und m auf 2 Stellen nach dem Komma. ' + BOOK_RHO,
            fields: [
                fld('Innendurchmesser dᵢ', 'mm', di, 1, 0, { errors: [err(D - s, 1, 'Wanddicke zweimal abziehen.')] }),
                fld('Ringfläche A', 'mm²', A, 1, 0.004, { errors: [err(Math.PI / 4 * Math.pow(D - di, 2), 1, 'Erst quadrieren, dann abziehen: D² − dᵢ².')] }),
                fld('Volumen V', 'dm³', V, 4, 0.006, { errors: [err(A * L, 4, '1 dm³ = 1 000 000 mm³. Rechne mm² · mm und teile dann durch 1 000 000.')] }),
                rhoField('Stahl'),
                fld('Masse m', 'kg', m, 2, relB('Stahl'))
            ],
            hint: 'Fläche in mm² mal Länge in mm gibt mm³. Durch 1 000 000 teilen gibt dm³. Dann m = V · ρ.',
            explanation: 'dᵢ = ' + de(di) + ' mm. A = π/4 · (' + D + '² − ' + de(di) + '²) ≈ ' + de(A, 1) + ' mm².<br>' +
                         'V = ' + de(A, 1) + ' mm² · ' + de(L * 1000) + ' mm ≈ ' + de(V, 4) + ' dm³.<br>m = ' + de(V, 4) + ' dm³ · ' + rhoTxt('Stahl') + ' kg/dm³ ≈ <strong>' + de(m, 2) + ' kg</strong>.' + MAYBE
        };
    },
    function () {
        const [D, s] = rnd([[12, 1.5], [16, 2], [20, 2], [25, 2.5], [30, 3]]);
        const L = rnd([5, 8, 10, 12, 15]);
        const di = D - 2 * s;
        const V = Math.PI / 4 * Math.pow(di / 100, 2) * L * 10;
        return {
            type: 'num', q: 'Eine Hydraulikleitung aus Stahlrohr <strong>' + D + ' × ' + de(s) + '</strong> ist <strong>' + L + ' m</strong> lang. Wie viel Öl ist in der Leitung?',
            note: 'Für das Öl zählt der Innendurchmesser. Rechne in dm. ' + PI_NOTE + ' Runde auf 2 Stellen nach dem Komma.',
            fields: [
                fld('dᵢ', 'dm', di / 100, 3, 0, { errors: [err(D / 100, 3, 'Für das Öl brauchst du den Innendurchmesser.'), err(di / 10, 3, 'Das wären cm. 1 dm = 100 mm.')] }),
                fld('Volumen V', 'l', V, 2, 0.006, { errors: [err(Math.PI / 4 * Math.pow(D / 100, 2) * L * 10, 2, 'Nimm den Innendurchmesser, nicht den Außendurchmesser.')] })
            ],
            hint: 'dᵢ = D − 2 · s, dann in dm. l = ' + L + ' m = ' + (L * 10) + ' dm. V = π/4 · dᵢ² · l.',
            explanation: 'dᵢ = ' + de(di) + ' mm = ' + de(di / 100) + ' dm. V = π/4 · (' + de(di / 100) + ' dm)² · ' + (L * 10) + ' dm ≈ <strong>' + de(V, 2) + ' l</strong>.'
        };
    },
    function () {
        const D = rnd([40, 50, 60]), di = rnd([20, 25, 30]), l = rnd([40, 50, 60, 80]);
        const A = Math.PI / 4 * (D * D - di * di);
        const V = A * l / 1e6;
        const m = V * RHO['Messing'][0];
        return {
            type: 'num', book: true,
            q: 'Eine Buchse aus <strong>Messing</strong> hat den Außendurchmesser <strong>D = ' + D + ' mm</strong>, die Bohrung <strong>dᵢ = ' + di + ' mm</strong> und die Länge <strong>l = ' + l + ' mm</strong>. Wie schwer ist sie?',
            note: PI_NOTE + ' Runde A auf 1 Stelle, V auf 4 Stellen und m auf 2 Stellen nach dem Komma. ' + BOOK_RHO + ' Messing heißt im Tabellenbuch auch CuZn-Legierung. Steht dort ein Bereich, nimm einen Wert daraus.',
            fields: [
                fld('Ringfläche A', 'mm²', A, 1, 0.004, { errors: [err(Math.PI / 4 * D * D, 1, 'Die Bohrung fehlt: dᵢ² abziehen.')] }),
                fld('Volumen V', 'dm³', V, 4, 0.006),
                rhoField('Messing'),
                fld('Masse m', 'kg', m, 2, relB('Messing'))
            ],
            hint: 'A = π/4 · (D² − dᵢ²). V = A · l in mm³, dann durch 1 000 000. m = V · ρ.',
            explanation: 'A = π/4 · (' + D + '² − ' + di + '²) ≈ ' + de(A, 1) + ' mm². V = ' + de(A, 1) + ' · ' + l + ' : 1 000 000 ≈ ' + de(V, 4) + ' dm³.<br>' +
                         'm = ' + de(V, 4) + ' dm³ · ' + rhoTxt('Messing') + ' kg/dm³ ≈ <strong>' + de(m, 2) + ' kg</strong>.' + MAYBE
        };
    },
    function () {
        for (let t = 0; t < 200; t++) {
            const d = rnd([40, 50, 60, 80]), L = rnd([3, 6]), n = rint(6, 25), T = rnd([500, 1000, 1500, 2000]);
            const V = Math.PI / 4 * Math.pow(d / 100, 2) * L * 10;
            const m1 = V * RHO['Stahl'][0], mg = m1 * n;
            if (Math.abs(mg - T) < 0.1 * T) continue;
            if (mg > 3 * T || mg < 0.3 * T) continue;
            const ok = mg <= T ? 'ja' : 'nein';
            return {
                type: 'num', book: true, newLabel: 'Neue Last',
                q: 'Ein Bündel aus <strong>' + n + ' Stangen Rundstahl</strong> soll mit dem Hallenkran auf ein Regal. Jede Stange: <strong>d = ' + d + ' mm</strong>, <strong>l = ' + L + ' m</strong>. Der Kran trägt höchstens <strong>' + de(T) + ' kg</strong>. Darf er das Bündel heben?',
                note: 'Rechne in dm. ' + PI_NOTE + ' Runde V auf 2 Stellen, die Masse einer Stange auf 1 Stelle nach dem Komma, das Bündel auf ganze kg. ' + BOOK_RHO,
                fields: [
                    fld('V einer Stange', 'dm³', V, 2, 0.004),
                    rhoField('Stahl'),
                    fld('m einer Stange', 'kg', m1, 1, relB('Stahl')),
                    fld('m Bündel', 'kg', mg, 0, relB('Stahl') + 0.002, { errors: [err(m1, 0, 'Das ist nur eine Stange. Mal die Anzahl!')] }),
                    { label: 'Darf der Kran das Bündel heben?', kind: 'select', options: ['ja', 'nein'], ans: ok }
                ],
                hint: 'V = π/4 · d² · l (in dm). m = V · ρ. Dann mal ' + n + '. Mit ' + de(T) + ' kg vergleichen.',
                explanation: 'V = π/4 · ' + de(d / 100) + '² · ' + (L * 10) + ' ≈ ' + de(V, 2) + ' dm³. Eine Stange: ≈ ' + de(m1, 1) + ' kg.<br>' +
                             'Bündel: ' + de(m1, 1) + ' kg · ' + n + ' ≈ <strong>' + de(mg, 0) + ' kg</strong>. ' +
                             (ok === 'ja' ? 'Das ist weniger als ' + de(T) + ' kg. Der Kran darf heben.' : 'Das ist mehr als ' + de(T) + ' kg. <strong>Nicht heben!</strong> Das Bündel aufteilen.') + MAYBE
            };
        }
    },
    {
        type: 'mc', q: 'Du willst wissen, wie viel <strong>Öl</strong> in einer Hydraulikleitung ist. Mit welchem Durchmesser rechnest du?',
        options: ['Mit dem Außendurchmesser D.', 'Mit dem Innendurchmesser dᵢ.', 'Mit der Wanddicke s.', 'Mit dem Mittelwert aus D und dᵢ.'],
        correct: 1,
        hint: 'Wo ist das Öl: in der Wand oder im Hohlraum?',
        explanation: 'Das Öl ist im Hohlraum. Also dᵢ. Für die Masse des Rohres selbst brauchst du dagegen die Ringfläche (D und dᵢ).'
    }
],
// ---------------------------------------------------------------- Modul 6
6: [
    {
        type: 'order', q: 'Du sollst herausfinden, aus welchem Werkstoff ein Reststück ist. In welcher Reihenfolge gehst du vor?',
        steps: [
            'Reststück messen und wiegen',
            'Maße in passende Einheiten umrechnen',
            'Volumen berechnen',
            'Dichte berechnen: ρ = m : V',
            'Mit dem Tabellenbuch vergleichen und Werkstoff benennen'
        ],
        hint: 'Ohne Messwerte kannst du nichts rechnen. Ohne Volumen keine Dichte.',
        explanation: 'Messen → umrechnen → Volumen → Dichte → vergleichen. So arbeitest du nach der vollständigen Handlung.'
    },
    {
        type: 'num', book: true,
        q: '<strong>Die Situation vom Anfang:</strong> Das Reststück hat <strong>d = 30 mm</strong> und <strong>l = 200 mm</strong>. Die Waage zeigt <strong>0,640 kg</strong>. Titan oder Stahl?',
        note: PI_NOTE + ' Runde V auf 4 Stellen und ρ auf 2 Stellen nach dem Komma. ' + BOOK_RHO,
        fields: [
            fld('d', 'dm', 0.3, 2, 0, { errors: [err(3, 2, 'Das wären cm. 1 dm = 100 mm.')] }),
            fld('l', 'dm', 2, 2, 0, { errors: [err(20, 2, 'Das wären cm. 1 dm = 100 mm.')] }),
            fld('Volumen V', 'dm³', Math.PI / 4 * 0.09 * 2, 4, 0.006, { errors: [err(Math.PI * 0.09 * 2, 4, 'Du hast /4 vergessen: π/4 · d² · l.')] }),
            fld('Dichte ρ', 'kg/dm³', 0.640 / (Math.PI / 4 * 0.09 * 2), 2, 0.01),
            { label: 'Werkstoff', kind: 'select', options: ['Aluminium', 'Titan', 'Stahl', 'Kupfer'], ans: 'Titan',
              errors: [{ v: 'Stahl', msg: 'Stahl hat etwa 7,85 kg/dm³. Dein Wert ist viel kleiner.' }, { v: 'Aluminium', msg: 'Aluminium hat etwa 2,7 kg/dm³. Dein Wert ist größer.' }] }
        ],
        hint: 'd und l in dm. V = π/4 · d² · l. ρ = 0,640 kg : V. Vergleiche mit dem Tabellenbuch.',
        explanation: 'V = π/4 · (0,3 dm)² · 2 dm ≈ 0,1414 dm³.<br>' +
                     'ρ = 0,640 kg : 0,1414 dm³ ≈ <strong>4,53 kg/dm³</strong>. Das passt zu <strong>Titan</strong> (≈ 4,5). Aus Stahl wäre das Stück etwa 1,11 kg schwer. Das Reststück kann für die Titanwelle verwendet werden!'
    },
    function () {
        const POOL = ['Magnesium', 'Aluminium', 'Titan', 'Stahl', 'Kupfer', 'Blei'];
        for (let t = 0; t < 100; t++) {
            const form = rnd(['Würfel', 'Quader', 'Kugel', 'Rundstab']);
            const name = rnd(POOL);
            let V, desc, sk, hint, rech;
            if (form === 'Würfel') {
                const a = rnd([1.5, 2, 2.5, 3]);
                V = a * a * a; desc = 'ein <strong>Würfel</strong> mit der Kantenlänge <strong>a = ' + de(a) + ' cm</strong>';
                sk = skizzeKoerper('Würfel', de(a) + ' cm'); hint = 'V = a · a · a'; rech = 'V = ' + de(a) + '³ = ' + de(V) + ' cm³';
            } else if (form === 'Quader') {
                const [l, b, h] = rnd([[60, 12, 12], [30, 30, 5], [50, 20, 10], [40, 25, 8], [80, 10, 10]]);
                V = l * b * h / 1000; desc = 'ein <strong>Quader</strong> mit <strong>l = ' + l + ' mm, b = ' + b + ' mm, h = ' + h + ' mm</strong>';
                sk = skizzeKoerper('Quader', l + ' mm', b + ' mm', h + ' mm'); hint = 'Maße in cm umrechnen. V = l · b · h';
                rech = 'V = ' + de(l / 10) + ' cm · ' + de(b / 10) + ' cm · ' + de(h / 10) + ' cm = ' + de(V) + ' cm³';
            } else if (form === 'Kugel') {
                const d = rnd([1.5, 2, 2.5, 3]);
                V = Math.PI / 6 * d * d * d; desc = 'eine <strong>Kugel</strong> mit dem Durchmesser <strong>d = ' + de(d) + ' cm</strong>';
                sk = skizzeKoerper('Kugel', de(d) + ' cm'); hint = 'Kugel: V = π/6 · d³ (d³ = d · d · d)';
                rech = 'V = π/6 · ' + de(d) + '³ ≈ ' + de(V, 2) + ' cm³';
            } else {
                const d = rnd([10, 12, 16, 20]), l = rnd([40, 50, 60, 80]);
                V = Math.PI / 4 * Math.pow(d / 10, 2) * l / 10; desc = 'ein <strong>Rundstab</strong> mit <strong>d = ' + d + ' mm</strong> und <strong>l = ' + l + ' mm</strong>';
                sk = skizzeKoerper('Rundstab', d + ' mm', l + ' mm'); hint = 'Maße in cm umrechnen. V = π/4 · d² · l';
                rech = 'V = π/4 · (' + de(d / 10) + ' cm)² · ' + de(l / 10) + ' cm ≈ ' + de(V, 2) + ' cm³';
            }
            const mg = Math.round(V * RHO[name][0] * 10) / 10;       // Masse in g, 1 Nachkommastelle
            if (mg < 15) continue;
            const rho = mg / V;
            return {
                type: 'num', book: true, svg: sk, newLabel: 'Neues Stück',
                q: 'Im Anschauungskasten der Werkstatt sind die Schilder abgefallen. Vor dir liegt ' + desc + '. Die Waage zeigt <strong>m = ' + de(mg) + ' g</strong>. Aus welchem Metall ist das Stück?',
                note: 'Rechne in cm. Dann kommt V in cm³ heraus. Mit m in g bekommst du ρ in g/cm³. Das ist dieselbe Zahl wie in kg/dm³. ' + (form === 'Kugel' || form === 'Rundstab' ? PI_NOTE + ' ' : '') + 'Runde auf 2 Stellen nach dem Komma.',
                fields: [
                    fld('Volumen V', 'cm³', V, 2, 0.006),
                    fld('Dichte ρ', 'g/cm³', rho, 2, 0.015),
                    { label: 'Metall', kind: 'select', options: POOL.slice(), ans: name }
                ],
                hint: hint + '. Dann ρ = m : V. Vergleiche mit dem Tabellenbuch.',
                explanation: rech + '.<br>ρ = ' + de(mg) + ' g : ' + de(V, 2) + ' cm³ ≈ <strong>' + de(rho, 2) + ' g/cm³</strong>. Das passt zu <strong>' + name + '</strong> (≈ ' + rhoTxt(name) + ').'
            };
        }
    },
    function () {
        const POOL = [['2,69 kg/dm³', 'Aluminium'], ['7,81 kg/dm³', 'Stahl'], ['11,24 kg/dm³', 'Blei'],
                      ['8,93 kg/dm³', 'Kupfer'], ['4,47 kg/dm³', 'Titan'], ['1,76 kg/dm³', 'Magnesium'], ['10,46 kg/dm³', 'Silber']];
        const sel = pickN(POOL, 4);
        const opts = sel.map(x => x[1]);
        const extra = POOL.map(x => x[1]).filter(n => opts.indexOf(n) < 0);
        opts.push(rnd(extra));
        return {
            type: 'match', book: true, newLabel: 'Neue Werte',
            q: 'Diese Dichten hat ein Azubi ausgerechnet. Welcher Werkstoff passt jeweils?',
            note: 'Vergleiche mit deinem Tabellenbuch. Kleine Abweichungen sind normal. Ein Werkstoff bleibt übrig.',
            options: opts,
            items: sel.map(x => ({ left: 'ρ ≈ ' + x[0], answer: x[1] })),
            hint: 'Suche den Werkstoff mit dem nächstliegenden Wert.',
            explanation: sel.map(x => x[0] + ' → ' + x[1]).join('; ') + '.'
        };
    },
    {
        type: 'mc', q: 'Du berechnest ρ = 7,79 kg/dm³. Im Tabellenbuch steht bei Stahl 7,85 kg/dm³. Was sagst du?',
        options: [
            'Das ist kein Stahl, weil die Zahl nicht genau gleich ist.',
            'Das passt zu Stahl. Kleine Abweichungen kommen von Messfehlern und vom Runden.',
            'Ich habe mich sicher verrechnet und muss neu anfangen.',
            'Das ist Gusseisen, weil Gusseisen eine kleinere Dichte als Stahl hat.'
        ],
        correct: 1,
        hint: 'Kein Messschieber und keine Waage misst ganz genau.',
        explanation: 'Messwerte sind nie ganz genau. Du suchst den Werkstoff mit dem <strong>nächstliegenden</strong> Wert. 7,79 liegt sehr nah an 7,85. Gusseisen (etwa 7,25) ist viel weiter weg.'
    }
],
// ---------------------------------------------------------------- Modul 7
7: [
    {
        type: 'match', q: 'Welche Einheit gehört zu welcher Größe?',
        options: ['kg', 'dm³', 'kg/dm³', 'kg/m', 'kg/m²'],
        items: [
            { left: 'Masse m', answer: 'kg' },
            { left: 'Volumen V', answer: 'dm³' },
            { left: 'Dichte ρ', answer: 'kg/dm³' },
            { left: 'längenbezogene Masse m′', answer: 'kg/m' },
            { left: 'flächenbezogene Masse m″', answer: 'kg/m²' }
        ],
        hint: 'm′: Masse pro Meter Länge. m″: Masse pro Quadratmeter Fläche.',
        explanation: 'm′ in kg/m (für Stäbe, Profile, Rohre). m″ in kg/m² (für Bleche und Platten).'
    },
    function () {
        // m′ selbst berechnet mit ρ = 7,85 kg/dm³
        const ROWS = [['Rundstahl d = 20 mm', 2.47], ['Rundstahl d = 30 mm', 5.55], ['Rundstahl d = 40 mm', 9.86],
                      ['Flachstahl 50 × 10', 3.93], ['Flachstahl 30 × 8', 1.88], ['Vierkant 25 × 25', 4.91]];
        const sel = pickN(ROWS, 3).map(r => r.concat([6, rint(3, 12)]));
        const ms = sel.map(r => clean(r[1] * r[2] * r[3]));
        const tot = clean(ms.reduce((a, b) => a + b, 0));
        return {
            type: 'num',
            q: 'Im Materiallager liegen Stangen auf einem Regal. Wie schwer ist jede Ebene? Wie schwer ist alles zusammen?' +
               '<div class="table-wrap" style="margin-top:10px;"><table><tr><th>Ebene</th><th>Profil</th><th>m′</th><th>Länge je Stange</th><th>Anzahl</th></tr>' +
               sel.map((r, i) => '<tr><td>' + (i + 1) + '</td><td>' + r[0] + '</td><td>' + de(r[1], 2) + ' kg/m</td><td>' + r[2] + ' m</td><td>' + r[3] + '</td></tr>').join('') + '</table></div>',
            note: 'm = m′ · l. Die Länge ist hier: Anzahl · Länge je Stange.',
            fields: sel.map((r, i) => fld('Ebene ' + (i + 1), 'kg', ms[i], 2, 0, { errors: [err(r[1] * r[2], 2, 'Das ist nur eine Stange. Mal die Anzahl!')] }))
                       .concat([fld('alles zusammen', 'kg', tot, 2, 0)]),
            hint: 'Für jede Ebene: m′ · Länge je Stange · Anzahl. Am Ende alles addieren.',
            explanation: sel.map((r, i) => 'Ebene ' + (i + 1) + ': ' + de(r[1], 2) + ' kg/m · ' + r[2] + ' m · ' + r[3] + ' = ' + de(ms[i], 2) + ' kg').join('<br>') +
                         '<br>Zusammen: <strong>' + de(tot, 2) + ' kg</strong>.'
        };
    },
    function () {
        const [name, mp] = rnd([['Rundstahl d = 20 mm', 2.47], ['Flachstahl 30 × 8', 1.88], ['Vierkant 25 × 25', 4.91]]);
        const lRest = rint(5, 45) / 10;
        const m = clean(Math.round(lRest * mp * 100) / 100);
        const l = m / mp;
        return {
            type: 'num',
            q: 'Ein Reststück <strong>' + name + '</strong> wiegt <strong>' + de(m, 2) + ' kg</strong>. Das Profil hat <strong>m′ = ' + de(mp, 2) + ' kg/m</strong>. Wie lang ist das Reststück?',
            note: 'Stelle m = m′ · l nach l um. Runde auf 2 Stellen nach dem Komma.',
            fields: [
                fld('Länge l', 'm', l, 2, 0.004, { errors: [err(m * mp, 2, 'Nicht mal, sondern geteilt: l = m : m′.')] }),
                fld('Länge l', 'mm', l * 1000, 0, 0.005)
            ],
            hint: 'l = m : m′. Dann l in mm: mal 1000.',
            explanation: 'l = ' + de(m, 2) + ' kg : ' + de(mp, 2) + ' kg/m ≈ <strong>' + de(l, 2) + ' m ≈ ' + de(l * 1000, 0) + ' mm</strong>. Wiegen statt messen geht oft schneller!'
        };
    },
    function () {
        const [name, mpp] = rnd([['Stahlblech 2 mm', 15.7], ['Stahlblech 3 mm', 23.55], ['Aluminiumblech 2 mm', 5.4], ['Kupferblech 1 mm', 8.96]]);
        const n = rint(4, 15), L = rnd([0.5, 0.8, 1, 1.2]), B = rnd([0.25, 0.3, 0.4, 0.5]);
        const A = clean(n * L * B);
        const m = A * mpp;
        return {
            type: 'num',
            q: 'Aus <strong>' + name + '</strong> werden <strong>' + n + ' Zuschnitte</strong> geschnitten. Jeder Zuschnitt ist <strong>' + de(L * 1000) + ' mm</strong> lang und <strong>' + de(B * 1000) + ' mm</strong> breit. Das Blech hat <strong>m″ = ' + de(mpp, 2) + ' kg/m²</strong>. Wie schwer sind die Zuschnitte zusammen?',
            note: 'm = m″ · A. Rechne die Fläche in m². Runde die Masse auf 2 Stellen nach dem Komma.',
            fields: [
                fld('Fläche A', 'm²', A, 3, 0, { errors: [err(L * B, 3, 'Das ist nur ein Zuschnitt. Mal die Anzahl!'), err(n * L * B * 1e6, 3, 'Die Maße müssen in m: 1 m = 1000 mm.')] }),
                fld('Masse m', 'kg', m, 2, 0.003)
            ],
            hint: 'A = Anzahl · Länge · Breite (alles in m). Dann m = m″ · A.',
            explanation: 'A = ' + n + ' · ' + de(L) + ' m · ' + de(B) + ' m = ' + de(A) + ' m². m = ' + de(mpp, 2) + ' kg/m² · ' + de(A) + ' m² ≈ <strong>' + de(m, 2) + ' kg</strong>.'
        };
    },
    function () {
        const [name, bez] = rnd([['Stahl', 'Stahlblech'], ['Aluminium', 'Aluminiumblech'], ['Kupfer', 'Kupferblech'], ['Titan', 'Titanblech']]);
        const s = rnd([1, 2, 2.5, 3, 4, 5]);
        const A = rnd([1.5, 2, 2.4, 3.2, 4.5, 5.8]);
        const r = RHO[name][0];
        const mpp = r * s, m = mpp * A;
        return {
            type: 'num', book: true,
            q: 'Für eine Schutzabdeckung brauchst du <strong>' + de(A) + ' m²</strong> ' + bez + ', <strong>' + de(s) + ' mm</strong> dick. Du hast keine Tabelle mit m″. Berechne m″ selbst aus der Dichte. Wie schwer ist das Blech?',
            note: 'Trick: m″ in kg/m² = ρ in kg/dm³ · Dicke in mm. Runde auf 2 Stellen nach dem Komma. ' + BOOK_RHO,
            fields: [
                rhoField(name),
                fld('m″', 'kg/m²', mpp, 2, relB(name)),
                fld('Masse m', 'kg', m, 2, relB(name))
            ],
            hint: 'm″ = ρ · s. Dann m = m″ · A.',
            explanation: 'm″ = ' + rhoTxt(name) + ' · ' + de(s) + ' ≈ ' + de(mpp, 2) + ' kg/m². m = ' + de(mpp, 2) + ' kg/m² · ' + de(A) + ' m² ≈ <strong>' + de(m, 2) + ' kg</strong>.' + MAYBE
        };
    },
    function () {
        let A, desc, aTxt, aErr;
        if (Math.random() < 0.5) {
            const d = rnd([16, 20, 25, 32, 40, 50]);
            A = Math.PI / 4 * d * d; desc = 'Rundstahl <strong>d = ' + d + ' mm</strong>';
            aTxt = 'A = π/4 · ' + d + '² ≈ ' + de(A, 1) + ' mm²';
            aErr = [err(Math.PI * d * d, 1, 'Du hast /4 vergessen: π/4 · d².')];
        } else {
            const [b, s] = rnd([[40, 8], [50, 10], [60, 12], [80, 10], [40, 5], [100, 8]]);
            A = b * s; desc = 'Flachstahl <strong>' + b + ' × ' + s + '</strong>';
            aTxt = 'A = ' + b + ' mm · ' + s + ' mm = ' + de(A) + ' mm²';
            aErr = [err(2 * (b + s), 1, 'Das ist der Umfang. Die Fläche ist b · s.')];
        }
        const mp = RHO['Stahl'][0] * A / 1000;
        return {
            type: 'num', book: true,
            q: 'Berechne die längenbezogene Masse m′ von ' + desc + ' selbst.',
            note: 'Trick: m′ in kg/m = ρ in kg/dm³ · A in mm² : 1000. ' + PI_NOTE + ' Runde A auf 1 Stelle und m′ auf 3 Stellen nach dem Komma. ' + BOOK_RHO,
            fields: [
                fld('Querschnitt A', 'mm²', A, 1, 0.004, { errors: aErr }),
                rhoField('Stahl'),
                fld('m′', 'kg/m', mp, 3, relB('Stahl'))
            ],
            hint: 'Erst die Querschnittsfläche in mm². Dann m′ = ρ · A : 1000.',
            explanation: aTxt + '. m′ = ' + rhoTxt('Stahl') + ' · ' + de(A, 1) + ' : 1000 ≈ <strong>' + de(mp, 3) + ' kg/m</strong>.' + MAYBE
        };
    }
],
// ---------------------------------------------------------------- Modul 8
8: [
    {
        type: 'mc', q: 'Ein Metallblock hat eine Bohrung. Wie berechnest du das Volumen des Blocks?',
        options: [
            'Volumen ohne Bohrung + Volumen der Bohrung',
            'Volumen ohne Bohrung − Volumen der Bohrung',
            'Die Bohrung ist so klein, die lässt man immer weg.',
            'Volumen ohne Bohrung · Volumen der Bohrung'
        ],
        correct: 1,
        hint: 'Wo eine Bohrung ist, fehlt Material.',
        explanation: 'Erst den vollen Körper berechnen. Dann alles abziehen, wo kein Material ist: Bohrungen, Ausschnitte.'
    },
    function () {
        const d1 = rnd([40, 50, 60]), l1 = rnd([50, 60, 80]), d2 = rnd([20, 25, 30]), l2 = rnd([60, 80, 100, 120]);
        const V1 = Math.PI / 4 * Math.pow(d1 / 100, 2) * l1 / 100;
        const V2 = Math.PI / 4 * Math.pow(d2 / 100, 2) * l2 / 100;
        const V = V1 + V2, m = V * RHO['Stahl'][0];
        return {
            type: 'num', book: true, svg: skizzeWelle(d1, l1, d2, l2), newLabel: 'Neue Welle',
            q: 'Eine Absatzwelle aus Stahl wird gedreht. Sie besteht aus zwei Zylindern. Wie schwer ist die fertige Welle?',
            note: 'Rechne in dm. ' + PI_NOTE + ' Runde die Volumen auf 4 Stellen, die Masse auf 2 Stellen nach dem Komma. ' + BOOK_RHO,
            fields: [
                fld('V₁ (dicker Teil)', 'dm³', V1, 4, 0.004),
                fld('V₂ (dünner Teil)', 'dm³', V2, 4, 0.004),
                fld('V Welle', 'dm³', V, 4, 0.006, { errors: [err(V1 - V2, 4, 'Beide Teile sind Material. Also addieren, nicht abziehen.')] }),
                rhoField('Stahl'),
                fld('Masse m', 'kg', m, 2, relB('Stahl') + 0.004)
            ],
            hint: 'Jeder Teil ist ein Zylinder: V = π/4 · d² · l. Beide Volumen addieren. Dann m = V · ρ.',
            explanation: 'V₁ = π/4 · ' + de(d1 / 100) + '² · ' + de(l1 / 100) + ' ≈ ' + de(V1, 4) + ' dm³.<br>' +
                         'V₂ = π/4 · ' + de(d2 / 100) + '² · ' + de(l2 / 100) + ' ≈ ' + de(V2, 4) + ' dm³.<br>' +
                         'V ≈ ' + de(V, 4) + ' dm³. m ≈ ' + de(V, 4) + ' · ' + rhoTxt('Stahl') + ' ≈ <strong>' + de(m, 2) + ' kg</strong>.' + MAYBE
        };
    },
    function () {
        const D = rnd([140, 160, 180, 200]), s = rnd([10, 12, 15]), d = rnd([40, 50, 60]), dl = rnd([14, 18]);
        const Vs = Math.PI / 4 * Math.pow(D / 100, 2) * s / 100;
        const Vb = Math.PI / 4 * (Math.pow(d / 100, 2) + 4 * Math.pow(dl / 100, 2)) * s / 100;
        const V = Vs - Vb;
        const m = V * RHO['Stahl'][0];
        return {
            type: 'num', book: true, svg: skizzeFlansch(D, d, dl, s), newLabel: 'Neuer Flansch',
            q: 'Ein Flansch aus Stahl ist eine runde Scheibe. Er hat eine Mittelbohrung und vier Löcher für die Schrauben. Wie schwer ist er?',
            note: 'Rechne in dm. ' + PI_NOTE + ' Runde die Volumen auf 4 Stellen, die Masse auf 2 Stellen nach dem Komma. ' + BOOK_RHO,
            fields: [
                fld('V volle Scheibe', 'dm³', Vs, 4, 0.004),
                fld('V aller Bohrungen', 'dm³', Vb, 4, 0.01, { errors: [err(Math.PI / 4 * (Math.pow(d / 100, 2) + Math.pow(dl / 100, 2)) * s / 100, 4, 'Es sind vier Schraubenlöcher, nicht eins.')] }),
                fld('V Flansch', 'dm³', V, 4, 0.006),
                rhoField('Stahl'),
                fld('Masse m', 'kg', m, 2, relB('Stahl') + 0.004)
            ],
            hint: 'Alle Bohrungen sind Zylinder mit der Höhe s. V Flansch = V Scheibe − V Bohrungen. Dann m = V · ρ.',
            explanation: 'V Scheibe = π/4 · ' + de(D / 100) + '² · ' + de(s / 100) + ' ≈ ' + de(Vs, 4) + ' dm³.<br>' +
                         'V Bohrungen = π/4 · (' + de(d / 100) + '² + 4 · ' + de(dl / 100) + '²) · ' + de(s / 100) + ' ≈ ' + de(Vb, 4) + ' dm³.<br>' +
                         'V Flansch ≈ ' + de(V, 4) + ' dm³. m ≈ ' + de(V, 4) + ' · ' + rhoTxt('Stahl') + ' ≈ <strong>' + de(m, 2) + ' kg</strong>.' + MAYBE
        };
    },
    function () {
        const [b, h] = rnd([[60, 40], [50, 50], [80, 40], [60, 60]]);
        const d = rnd([20, 25, 30]);
        const L = rnd([250, 300, 400, 500, 350]);
        const A = (b * h - Math.PI / 4 * d * d) / 10000;                 // dm²
        const m = Math.round(A * L / 100 * RHO['Aluminium'][0] * 100) / 100;
        const V = m / RHO['Aluminium'][0];
        const l = V / A * 100;                                           // mm
        const rel = relB('Aluminium');
        return {
            type: 'num', book: true,
            q: 'Ein Vierkant aus Aluminium (<strong>' + b + ' × ' + h + ' mm</strong>) hat der Länge nach eine Bohrung mit <strong>d = ' + d + ' mm</strong>. Das Stück wiegt <strong>' + de(m, 2) + ' kg</strong>. Wie lang ist es?',
            note: 'Rechne in dm. ' + PI_NOTE + ' Runde A auf 4 Stellen, V auf 3 Stellen nach dem Komma. Die Länge in ganzen mm. ' + BOOK_RHO,
            fields: [
                fld('Querschnitt A (mit Loch)', 'dm²', A, 4, 0.004, { errors: [err(b * h / 10000, 4, 'Die Bohrung fehlt: Kreisfläche abziehen.')] }),
                rhoField('Aluminium'),
                fld('Volumen V', 'dm³', V, 3, rel),
                fld('Länge l', 'mm', l, 0, rel + 0.006)
            ],
            hint: 'A = b · h − π/4 · d². V = m : ρ. Dann l = V : A (in dm), zum Schluss in mm.',
            explanation: 'A = ' + de(b / 100) + ' · ' + de(h / 100) + ' − π/4 · ' + de(d / 100) + '² ≈ ' + de(A, 4) + ' dm².<br>' +
                         'V = ' + de(m, 2) + ' kg : ' + rhoTxt('Aluminium') + ' kg/dm³ ≈ ' + de(V, 3) + ' dm³.<br>' +
                         'l = ' + de(V, 3) + ' : ' + de(A, 4) + ' ≈ ' + de(l / 100, 2) + ' dm ≈ <strong>' + de(l, 0) + ' mm</strong>.' + MAYBE
        };
    },
    function () {
        const [l, b] = rnd([[300, 200], [400, 250], [250, 200], [350, 300]]);
        const [a, c] = rnd([[100, 60], [120, 80], [80, 50], [150, 100]]);
        const s = rnd([4, 5, 6, 8, 10]);
        const V = (l * b - a * c) * s / 1e6;
        const m = V * RHO['Aluminium'][0];
        return {
            type: 'num', book: true, svg: skizzePlatte(l, b, a, c), newLabel: 'Neue Platte',
            q: 'Eine Abdeckplatte für eine Maschine wird aus Aluminium gefertigt. Die Platte ist <strong>' + s + ' mm</strong> dick. In der Mitte ist ein rechteckiger Ausschnitt. Wie schwer ist die Platte?',
            note: 'Rechne in dm. Runde V auf 4 Stellen und m auf 3 Stellen nach dem Komma. ' + BOOK_RHO,
            fields: [
                fld('Volumen V', 'dm³', V, 4, 0, { errors: [err(l * b * s / 1e6, 4, 'Der Ausschnitt muss noch abgezogen werden.')] }),
                rhoField('Aluminium'),
                fld('Masse m', 'kg', m, 3, relB('Aluminium'))
            ],
            hint: 'V = (l · b − Ausschnitt) · Dicke. Alles in dm. Dann m = V · ρ.',
            explanation: 'V = (' + de(l / 100) + ' · ' + de(b / 100) + ' − ' + de(a / 100) + ' · ' + de(c / 100) + ') · ' + de(s / 100) + ' = ' + de(V, 4) + ' dm³.<br>' +
                         'm = ' + de(V, 4) + ' dm³ · ' + rhoTxt('Aluminium') + ' kg/dm³ ≈ <strong>' + de(m, 3) + ' kg</strong>.' + MAYBE
        };
    },
    {
        type: 'mc', q: '<strong>Fehler finden:</strong> Für einen Spänebehälter rechnet jemand: V = 50 cm · 40 cm · 3 dm = 6000 dm³. Was ist falsch?',
        options: [
            'Nichts. Das Ergebnis stimmt.',
            'Die Einheiten sind gemischt. Richtig: 5 dm · 4 dm · 3 dm = 60 dm³.',
            'Man muss addieren statt malnehmen.',
            'Das Ergebnis muss in m² sein.'
        ],
        correct: 1,
        hint: 'Schau dir die Einheiten an. Darf man cm und dm einfach malnehmen?',
        explanation: 'Vor dem Rechnen alle Maße in dieselbe Einheit umrechnen. 50 cm = 5 dm, 40 cm = 4 dm. V = 5 · 4 · 3 = 60 dm³ = 60 l.'
    }
]
};
