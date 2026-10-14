// =====================================================================
// Aufgaben für das Modul "Mathe-Grundlagen Metall"
// Rechenregeln, Einheiten, Prozent und Dreisatz, Formeln einsetzen und umstellen.
// Ohne Tabellenbuch: Dichten und andere Werte stehen im Aufgabentext.
// Hilfsfunktionen aus engine.js. num-Felder: ans in Tausendsteln der Einheit
// (2,35 -> 2350). Ausnahme: Felder mit Einheit µm -> ans in ganzen µm.
// tol = erlaubter Spielraum, z. B. wegen π oder Runden.
// =====================================================================

const BASIC_MODULES = [1, 2, 3, 4, 5];
const UNLOCK_TEXT = {
    6: 'Formeln umstellen mit dem Waage-Prinzip.',
    7: 'Masse, Zuschnitt und Teilung: Mathe in der Werkstatt.'
};

// ---------- Zahlen ----------
const T = x => Math.round(x * 1000);                      // Wert -> Tausendstel
function de(x, dec) {                                       // 2.35 -> "2,35", 100000 -> "100 000"
    let s = (dec === undefined) ? String(Number(x.toFixed(6))) : x.toFixed(dec);
    let [g, k] = s.replace('-', '').split('.');
    if (g.length > 4) g = g.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (x < 0 ? '−' : '') + g + (k ? ',' + k : '');
}
const has3 = x => Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-6;
const isInt = x => Math.abs(x - Math.round(x)) < 1e-9;
const RF = ['richtig', 'falsch'];
function richtigFalsch(all, n, expl) {
    return function () {
        return {
            type: 'match', q: 'Richtig oder falsch?', options: RF, items: pickN(all, n),
            hint: 'Rot markierte Aussagen hast du noch falsch eingeschätzt. Lies den Lerntext dazu noch einmal.',
            explanation: expl
        };
    };
}
// Spielraum in Prozent der Lösung (mindestens min Tausendstel)
const tolP = (ans, p, min) => Math.round(Math.abs(ans) * p / 100) + (min || 2);

// ---------- Einheiten umrechnen ----------
const U = {
    laenge: { mm: 1, cm: 10, dm: 100, m: 1000 },
    flaeche: { 'mm²': 1, 'cm²': 100, 'dm²': 1e4, 'm²': 1e6 },
    volumen: { 'mm³': 1, 'cm³': 1e3, 'dm³': 1e6, 'm³': 1e9 },
    masse: { g: 1, kg: 1000, t: 1e6 },
    kraft: { N: 1, kN: 1000 },
    druck: { Pa: 1, 'N/cm²': 1e4, bar: 1e5 }
};
const SCHRITT = { laenge: 10, flaeche: 100, volumen: 1000 };
const NICE = [0.02, 0.05, 0.08, 0.25, 0.4, 0.5, 0.75, 1.2, 1.5, 2.35, 2.5, 3.6, 4.8, 6.4, 12, 15, 25, 45, 60, 85, 120, 250, 350, 450, 750, 1500, 2500, 3500, 4200, 8000, 12000, 25000];

function convField(fam, von, nach) {
    const f = U[fam][von] / U[fam][nach];
    let v, r, tries = 0;
    do {
        v = rnd(NICE); r = v * f; tries++;
    } while ((!has3(r) || r < 0.001 || r > 1e7 || v === r || (f < 1 && v < 1) || (f > 1 && v > 9999)) && tries < 500);
    const errors = [];
    const typ = SCHRITT[fam];
    const ratio = Math.max(f, 1 / f);
    const tipp = typ ? ' Bei ' + ({ 10: 'Längen', 100: 'Flächen', 1000: 'Volumen' })[typ] + ' ist sie ' + typ + ' pro Schritt.' : '';
    [10, 100, 1000, 10000, 100000, 1000000].filter(k => Math.abs(k - ratio) > 0.5 && k / ratio <= 1000 && ratio / k <= 1000).forEach(k => {
        const w = f > 1 ? v * k : v / k;
        if (has3(w)) errors.push({ v: T(w), msg: 'Prüfe die Umrechnungszahl.' + tipp });
    });
    const back = v / f;
    if (has3(back)) errors.push({ v: T(back), msg: (f > 1 ? 'Große Einheit → kleine Einheit: Die Zahl wird größer.' : 'Kleine Einheit → große Einheit: Die Zahl wird kleiner.') });
    return { label: de(v) + ' ' + von + ' =', unit: nach, ans: T(r), errors, _v: v, _r: r };
}
function convTask(fam, pairs, q, hint) {
    return function () {
        const fields = pickN(pairs, 3).map(p => convField(fam, p[0], p[1]));
        return {
            type: 'num', q, fields, hint,
            explanation: fields.map(f => f.label + ' <strong>' + de(f._r) + ' ' + f.unit + '</strong>').join('<br>')
        };
    };
}
function fehlerFinden(q, z, falsch, expl, hint) {
    const html = '<div class="calc">' + z.map((s, k) => '<div><span class="calc-nr">Zeile ' + (k + 1) + '</span>' + s + '</div>').join('') + '</div>';
    return {
        type: 'mc', svg: html, q, options: z.map((s, k) => 'Zeile ' + (k + 1)), correct: falsch - 1,
        hint, explanation: expl
    };
}

// ---------- Skizze Teilung ----------
function teilungSVG(l, a, n, p) {
    const F = 'font-family="Segoe UI, Arial"';
    // schematisch, nicht maßstäblich: Randabstand immer gut sichtbar
    const x0 = 30, W = 460, y = 70, ax = 46, px = (W - 2 * ax) / (n - 1);
    const xs = [];
    for (let k = 0; k < n; k++) xs.push(x0 + ax + k * px);
    let s = '<svg viewBox="0 0 520 190" role="img" aria-label="Leiste mit ' + n + ' Bohrungen">';
    s += '<defs><marker id="mt" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="#fbbf24"/></marker></defs>';
    s += '<rect x="' + x0 + '" y="' + (y - 22) + '" width="' + W + '" height="44" rx="3" fill="#334155" stroke="#94a3b8" stroke-width="2"/>';
    xs.forEach(x => { s += '<circle cx="' + x.toFixed(1) + '" cy="' + y + '" r="8" fill="#0f172a" stroke="#38bdf8" stroke-width="2"/>'; });
    const dim = (x1, x2, yy, txt) => '<line x1="' + x1.toFixed(1) + '" y1="' + yy + '" x2="' + x2.toFixed(1) + '" y2="' + yy + '" stroke="#fbbf24" stroke-width="1.5" marker-start="url(#mt)" marker-end="url(#mt)"/>' +
        '<text x="' + ((x1 + x2) / 2).toFixed(1) + '" y="' + (yy - 6) + '" fill="#fbbf24" font-size="15" font-weight="bold" text-anchor="middle" ' + F + '>' + txt + '</text>';
    // Hilfslinien
    [x0, xs[0], xs[1], xs[n - 1], x0 + W].forEach(x => { s += '<line x1="' + x.toFixed(1) + '" y1="' + (y + 24) + '" x2="' + x.toFixed(1) + '" y2="' + (y + 90) + '" stroke="#64748b" stroke-width="1" stroke-dasharray="3 3"/>'; });
    s += dim(x0, xs[0], y + 45, 'a');
    s += dim(xs[0], xs[1], y + 45, 'p');
    s += dim(xs[n - 1], x0 + W, y + 45, 'a');
    s += dim(x0, x0 + W, y + 85, 'l = ' + de(l) + ' mm');
    s += '<text x="260" y="25" fill="#cbd5e1" font-size="15" text-anchor="middle" ' + F + '>' + n + ' Bohrungen, alle Abstände p gleich</text>';
    return s + '</svg>';
}

// =====================================================================
const TASKS = {
// ---------------------------------------------------------------- Modul 1: Rechenregeln
1: [
    function () {
        const forms = shuffle([
            () => { const a = rint(2, 20), b = rint(2, 9), c = rint(2, 9);
                    return { t: a + ' + ' + b + ' · ' + c, r: a + b * c, e: [{ v: (a + b) * c, msg: 'Punkt vor Strich: Zuerst ' + b + ' · ' + c + ' rechnen.' }] }; },
            () => { const a = rint(2, 12), b = rint(2, 9), c = rint(2, 6);
                    return { t: '(' + a + ' + ' + b + ') · ' + c, r: (a + b) * c, e: [{ v: a + b * c, msg: 'Die Klammer kommt zuerst.' }] }; },
            () => { const b = rint(2, 6), c = rint(2, 6), a = b * c + rint(3, 30);
                    return { t: a + ' − ' + b + ' · ' + c, r: a - b * c, e: [{ v: (a - b) * c, msg: 'Punkt vor Strich: Zuerst ' + b + ' · ' + c + ' rechnen.' }] }; },
            () => { const d = rint(2, 6), k = rint(2, 9), c = d * k, a = rint(2, 9), b = rint(Math.ceil((k + 1) / a), 9);
                    return { t: a + ' · ' + b + ' − ' + c + ' : ' + d, r: a * b - k, e: [] }; },
            () => { const c = rint(2, 5), b = rint(1, 8), a = b + rint(2, 9);
                    return { t: c + ' · (' + a + ' − ' + b + ')', r: c * (a - b), e: [{ v: c * a - b, msg: 'Die Klammer kommt zuerst.' }] }; }
        ]).slice(0, 3).map(f => f());
        return {
            type: 'num', q: 'Rechne aus. Achte auf die Rechenregeln.',
            fields: forms.map(f => ({ label: f.t + ' =', unit: '', ans: T(f.r), errors: f.e.map(e => ({ v: T(e.v), msg: e.msg })) })),
            hint: 'Erst die Klammer. Dann Punktrechnung (· und :). Zum Schluss Strichrechnung (+ und −).',
            explanation: forms.map(f => f.t + ' = <strong>' + f.r + '</strong>').join('<br>')
        };
    },
    function () {
        const c = rint(5, 12), d = rint(1, c - 2), b = rint(2, 6), a = rint(3, 25);
        const e = c - d, f = b * e, g = a + f;
        return {
            type: 'order',
            q: 'Rechne <strong>' + a + ' + ' + b + ' · (' + c + ' − ' + d + ')</strong>. In welcher Reihenfolge rechnest du?',
            steps: [c + ' − ' + d + ' = ' + e + ' (Klammer)', b + ' · ' + e + ' = ' + f + ' (Punktrechnung)', a + ' + ' + f + ' = ' + g + ' (Strichrechnung)'],
            hint: 'Klammer → Punkt → Strich.',
            explanation: 'Erst die Klammer, dann mal, dann plus. Ergebnis: <strong>' + g + '</strong>.'
        };
    },
    function () {
        const make = (stellen) => {
            const n = rint(1000, 99999);
            const teiler = Math.pow(10, 4 - stellen);
            const auf = Math.floor(n / teiler) + ((n % teiler) >= teiler / 2 ? 1 : 0);
            const ab = Math.floor(n / teiler);
            return { x: n / 10000, stellen, r: auf / Math.pow(10, stellen), cut: ab / Math.pow(10, stellen), up: auf !== ab };
        };
        let items;
        do { items = [make(1), make(2), make(rnd([1, 2]))]; } while (!items.some(i => i.up) || !items.some(i => !i.up));
        items = shuffle(items);
        return {
            type: 'num', q: 'Runde die Zahlen.',
            fields: items.map(i => ({
                label: de(i.x, 4) + ' auf ' + (i.stellen === 1 ? 'eine Nachkommastelle' : 'zwei Nachkommastellen'), unit: '', ans: T(i.r),
                errors: i.up ? [{ v: T(i.cut), msg: 'Schau auf die nächste Ziffer: Ab 5 wird aufgerundet.' }] : []
            })),
            hint: 'Schau auf die Ziffer direkt nach der letzten Stelle, die stehen bleibt. 0 bis 4: abrunden. 5 bis 9: aufrunden.',
            explanation: items.map(i => de(i.x, 4) + ' → <strong>' + de(i.r, i.stellen) + '</strong>').join('<br>')
        };
    },
    function () {
        const a1 = rnd([1.5, 2.5, 0.8, 1.2, 3.5, 0.6]), a2 = rnd([2, 4, 1.5, 3, 0.5]);
        const q = rnd([0.5, 0.25, 1.5, 2.5, 0.4]), k = rint(2, 9), b1 = q * k;
        const c1 = rnd([0.75, 1.25, 2.4, 3.65, 0.8]), c2 = rnd([1.5, 0.35, 2.05, 4.2]);
        const f = [
            { t: de(a1) + ' · ' + de(a2), r: a1 * a2 },
            { t: de(b1) + ' : ' + de(q), r: k },
            { t: de(c1) + ' + ' + de(c2), r: c1 + c2 }
        ];
        return {
            type: 'num', q: 'Rechne mit Dezimalzahlen. Du darfst den Taschenrechner benutzen.',
            note: 'Komma oder Punkt ist egal.',
            fields: f.map(x => ({ label: x.t + ' =', unit: '', ans: T(x.r) })),
            hint: 'Tippe die Zahlen mit Punkt in den Taschenrechner ein: 2,5 wird 2.5.',
            explanation: f.map(x => x.t + ' = <strong>' + de(x.r) + '</strong>').join('<br>')
        };
    },
    richtigFalsch([
        { left: 'Punktrechnung geht vor Strichrechnung.', answer: 'richtig' },
        { left: 'Was in Klammern steht, rechnet man zuerst.', answer: 'richtig' },
        { left: '3 + 4 · 2 = 14', answer: 'falsch' },
        { left: '(3 + 4) · 2 = 14', answer: 'richtig' },
        { left: '2,46 gerundet auf eine Nachkommastelle ist 2,4.', answer: 'falsch' },
        { left: '2,45 gerundet auf eine Nachkommastelle ist 2,5.', answer: 'richtig' },
        { left: 'Man rechnet immer von links nach rechts, egal welche Rechenart.', answer: 'falsch' },
        { left: '0,5 · 0,5 = 0,25', answer: 'richtig' }
    ], 5, 'Klammer → Punkt → Strich. Beim Runden: ab 5 aufrunden. 3 + 4 · 2 = 3 + 8 = 11.')
],
// ---------------------------------------------------------------- Modul 2: Länge, Fläche, Volumen
2: [
    function () {
        const all = [
            ['µm', 'Länge'], ['mm', 'Länge'], ['cm', 'Länge'], ['m', 'Länge'],
            ['mm²', 'Fläche'], ['cm²', 'Fläche'], ['m²', 'Fläche'],
            ['mm³', 'Volumen'], ['cm³', 'Volumen'], ['dm³', 'Volumen'], ['m³', 'Volumen']
        ].map(x => ({ left: x[0], answer: x[1] }));
        const base = ['Länge', 'Fläche', 'Volumen'].map(g => rnd(all.filter(x => x.answer === g)));
        return {
            type: 'match', q: 'Ist das eine Einheit für eine Länge, eine Fläche oder ein Volumen?', options: ['Länge', 'Fläche', 'Volumen'],
            items: shuffle(base.concat(pickN(all.filter(x => base.indexOf(x) < 0), 2))),
            hint: 'Schau auf die kleine Zahl oben: ² heißt Fläche, ³ heißt Volumen. Ohne Hochzahl ist es eine Länge.',
            explanation: 'Ohne Hochzahl: Länge. Mit ²: Fläche. Mit ³: Volumen.'
        };
    },
    convTask('laenge', [['m', 'mm'], ['mm', 'm'], ['cm', 'mm'], ['mm', 'cm'], ['dm', 'mm'], ['m', 'cm']],
             'Rechne die Längen um.', 'Bei Längen ist die Umrechnungszahl 10. Von m zu mm sind es drei Schritte: · 10 · 10 · 10 = · 1000.'),
    function () {
        const a = rnd([0.01, 0.02, 0.025, 0.05, 0.1, 0.15, 0.2, 0.004, 0.008]);
        const b = rnd([5, 8, 12, 15, 18, 25, 30, 40, 60, 120]);
        const c = rnd([0.5, 1.5, 2, 0.25, 0.75]);
        const fields = shuffle([
            { label: de(a) + ' mm =', unit: 'µm', ans: Math.round(a * 1000),
              errors: isInt(a * 100) ? [{ v: Math.round(a * 100), msg: '1 mm = 1000 µm. Rechne · 1000.' }] : [], _t: de(a) + ' mm = <strong>' + de(a * 1000) + ' µm</strong>' },
            { label: b + ' µm =', unit: 'mm', ans: T(b / 1000),
              errors: [{ v: T(b / 100), msg: '1 mm = 1000 µm. Teile durch 1000.' }], _t: b + ' µm = <strong>' + de(b / 1000) + ' mm</strong>' },
            { label: de(c) + ' mm =', unit: 'µm', ans: Math.round(c * 1000),
              errors: [{ v: Math.round(c * 100), msg: '1 mm = 1000 µm. Rechne · 1000.' }], _t: de(c) + ' mm = <strong>' + de(c * 1000) + ' µm</strong>' }
        ]);
        return {
            type: 'num', q: 'Rechne in Mikrometer (µm) und Millimeter um.',
            note: 'µm heißt Mikrometer. 1 mm = 1000 µm.', fields,
            hint: 'Von mm zu µm: · 1000. Von µm zu mm: : 1000.',
            explanation: fields.map(f => f._t).join('<br>')
        };
    },
    convTask('flaeche', [['m²', 'dm²'], ['m²', 'cm²'], ['cm²', 'mm²'], ['mm²', 'cm²'], ['dm²', 'm²'], ['cm²', 'm²']],
             'Rechne die Flächen um.', 'Bei Flächen ist die Umrechnungszahl 100. Von m² zu cm² sind es zwei Schritte: · 100 · 100 = · 10 000.'),
    convTask('volumen', [['dm³', 'cm³'], ['cm³', 'dm³'], ['cm³', 'mm³'], ['mm³', 'cm³'], ['m³', 'dm³'], ['dm³', 'm³']],
             'Rechne die Volumen um.', 'Bei Volumen ist die Umrechnungszahl 1000. 1 dm³ = 1000 cm³. 1 cm³ = 1000 mm³.'),
    function () {
        const U2 = { mm: 1, cm: 10, m: 1000 };
        const vals = pickN([850, 900, 950, 1050, 1100, 1150, 1200, 1250, 1300], 4).sort((a, b) => a - b);
        const shown = vals.map(mmv => {
            const u = rnd(['mm', 'cm', 'm'].filter(u => has3(mmv / U2[u])));
            return de(mmv / U2[u]) + ' ' + u;
        });
        return {
            type: 'order', q: 'Sortiere die Flachstahl-Stücke nach der Länge. Das kürzeste kommt nach oben.',
            steps: shown,
            hint: 'Rechne zuerst alle Längen in dieselbe Einheit um, zum Beispiel in mm.',
            explanation: shown.map((s, k) => s + ' = ' + vals[k] + ' mm').join(' &lt; ')
        };
    }
],
// ---------------------------------------------------------------- Modul 3: Masse, Zeit, Kraft, Druck
3: [
    function () {
        const fields = shuffle([
            convField('masse', ...rnd([['t', 'kg'], ['kg', 'g'], ['g', 'kg'], ['kg', 't']])),
            convField('kraft', 'kN', 'N'),
            convField('kraft', 'N', 'kN')
        ]);
        return {
            type: 'num', q: 'Rechne die Masse und die Kraft um.', fields,
            hint: '1 t = 1000 kg, 1 kg = 1000 g. 1 kN = 1000 N.',
            explanation: fields.map(f => f.label + ' <strong>' + de(f._r) + ' ' + f.unit + '</strong>').join('<br>')
        };
    },
    function () {
        const h1 = rnd([1.5, 2.5, 0.5, 0.25, 1.25, 0.75]), m1 = h1 * 60;
        const m2 = rnd([45, 90, 150, 135, 15, 75]), h2 = m2 / 60;
        const hh = rint(1, 3), mm2 = rnd([10, 15, 20, 30, 40, 45]), m3 = hh * 60 + mm2;
        return {
            type: 'num', q: 'Rechne die Bearbeitungszeiten um. Vorsicht: Eine Stunde hat 60 Minuten, nicht 100!',
            fields: [
                { label: de(h1) + ' h =', unit: 'min', ans: T(m1), errors: [{ v: T(h1 * 100), msg: '1 h = 60 min. Rechne · 60, nicht · 100.' }] },
                { label: m2 + ' min =', unit: 'h', ans: T(h2), errors: [{ v: T(m2 / 100), msg: '1 h = 60 min. Teile durch 60, nicht durch 100.' }] },
                { label: hh + ' h ' + mm2 + ' min =', unit: 'min', ans: T(m3), errors: [{ v: T(hh * 100 + mm2), msg: '1 h = 60 min, nicht 100 min.' }] }
            ],
            hint: 'Von Stunden zu Minuten: · 60. Von Minuten zu Stunden: : 60.',
            explanation: de(h1) + ' h = ' + de(h1) + ' · 60 min = <strong>' + de(m1) + ' min</strong><br>' +
                         m2 + ' min = ' + m2 + ' : 60 h = <strong>' + de(h2) + ' h</strong><br>' +
                         hh + ' h ' + mm2 + ' min = ' + (hh * 60) + ' min + ' + mm2 + ' min = <strong>' + m3 + ' min</strong>'
        };
    },
    convTask('druck', [['bar', 'Pa'], ['Pa', 'bar'], ['bar', 'N/cm²'], ['N/cm²', 'bar']],
             'Rechne die Drücke um. 1 bar = 10 N/cm² = 100 000 Pa.', '1 bar = 10 N/cm². 1 bar = 100 000 Pa.'),
    function () {
        const m = rnd([50, 80, 120, 250, 400, 750, 1200, 2500]);
        const F = m * 9.81;
        return {
            type: 'num',
            q: 'Ein Kran hebt ein Werkstück mit der Masse <strong>m = ' + de(m) + ' kg</strong>. Wie groß ist die Gewichtskraft?',
            note: 'Formel: F = m · g mit g = 9,81 N/kg. Gib die Kraft in kN auf zwei Nachkommastellen an.',
            fields: [
                { label: 'Gewichtskraft F', unit: 'N', ans: T(F), tol: 2,
                  errors: [{ v: T(m / 9.81), msg: 'Nimm mal, nicht geteilt: F = m · g.' }] },
                { label: 'Gewichtskraft F', unit: 'kN', ans: T(F / 1000), tol: 6,
                  errors: [{ v: T(F), msg: 'Das ist in N. 1 kN = 1000 N: Teile durch 1000.' }] }
            ],
            hint: 'F = m · g = ' + de(m) + ' kg · 9,81 N/kg. Dann durch 1000 für kN.',
            explanation: 'F = ' + de(m) + ' kg · 9,81 N/kg = <strong>' + de(F, 2) + ' N</strong> ≈ <strong>' + de(F / 1000, 2) + ' kN</strong>.'
        };
    },
    function () {
        const all = [['kg', 'Masse'], ['t', 'Masse'], ['g', 'Masse'], ['min', 'Zeit'], ['h', 'Zeit'], ['s', 'Zeit'],
                     ['N', 'Kraft'], ['kN', 'Kraft'], ['bar', 'Druck'], ['Pa', 'Druck'], ['N/cm²', 'Druck']]
            .map(x => ({ left: x[0], answer: x[1] }));
        return {
            type: 'match', q: 'Welche Größe misst man mit dieser Einheit?', options: ['Masse', 'Zeit', 'Kraft', 'Druck'],
            items: shuffle(['Masse', 'Zeit', 'Kraft', 'Druck'].map(g => rnd(all.filter(x => x.answer === g)))),
            hint: 'N heißt Newton, Pa heißt Pascal. h ist die Stunde. Bei N/cm² steht eine Fläche im Nenner: Kraft pro Fläche ist Druck.',
            explanation: 'Masse: g, kg, t. Zeit: s, min, h. Kraft: N, kN. Druck: Pa, bar, N/cm².'
        };
    },
    {
        type: 'mc',
        q: 'Das Fräsen eines Werkstücks dauert <strong>1,5 h</strong>. Wie lange ist das?',
        options: ['1 h 50 min', '1 h 30 min', '1 h 5 min', '150 min'],
        correct: 1,
        hint: '0,5 h ist eine halbe Stunde.',
        explanation: '1,5 h = 1 h + 0,5 h = 1 h + 30 min = 1 h 30 min = 90 min.'
    }
],
// ---------------------------------------------------------------- Modul 4: Prozent und Dreisatz
4: [
    function () {
        const P = 'je mehr – desto mehr', A = 'je mehr – desto weniger';
        const all = [
            { left: 'Mehr Meter Flachstahl → Masse?', answer: P },
            { left: 'Mehr Kilogramm Stahl → Preis?', answer: P },
            { left: 'Mehr Werkstücke → Arbeitszeit?', answer: P },
            { left: 'Mehr Bohrungen → Anzahl Bohrer, die stumpf werden?', answer: P },
            { left: 'Mehr Mitarbeiter am selben Auftrag → Zeit für den Auftrag?', answer: A },
            { left: 'Mehr Maschinen für dieselbe Serie → Fertigungszeit?', answer: A },
            { left: 'Längere Stücke aus derselben Stange → Anzahl Stücke?', answer: A },
            { left: 'Mehr Teile pro Stunde → Stunden für 600 Teile?', answer: A }
        ];
        const sel = pickN(all.filter(x => x.answer === P), 2).concat(pickN(all.filter(x => x.answer === A), 2));
        return {
            type: 'match', q: 'Welcher Zusammenhang gilt?', options: [P, A], items: sel,
            hint: 'Frage dich: Wenn die erste Größe doppelt so groß wird, wird die zweite dann doppelt so groß oder halb so groß?',
            explanation: 'Je mehr – desto mehr heißt <strong>proportional</strong>. Je mehr – desto weniger heißt <strong>antiproportional</strong>.'
        };
    },
    function () {
        const kontext = rnd(['masse', 'preis']);
        let k, x, z, q, u1, u2, item;
        if (kontext === 'masse') {
            k = rnd([1.57, 2.36, 3.14, 3.93, 4.71, 6.28]); x = rint(2, 6); do { z = rint(2, 12); } while (z === x);
            item = 'Flachstahl'; u1 = 'm'; u2 = 'kg';
            q = '<strong>' + x + ' m</strong> Flachstahl wiegen <strong>' + de(k * x) + ' kg</strong>. Wie viel wiegen <strong>' + z + ' m</strong>?';
        } else {
            k = rnd([1.8, 2.4, 2.75, 3.2, 4.5, 5.6]); x = rint(2, 8); do { z = rint(3, 25); } while (z === x);
            item = 'Rundstahl'; u1 = 'kg'; u2 = '€';
            q = '<strong>' + x + ' kg</strong> Rundstahl kosten <strong>' + de(k * x, 2) + ' €</strong>. Was kosten <strong>' + z + ' kg</strong>?';
        }
        const y = k * x, r = k * z;
        return {
            type: 'num', q,
            note: 'Dreisatz: Rechne zuerst auf 1 ' + u1 + '. Dann auf ' + z + ' ' + u1 + '.',
            fields: [
                { label: '1 ' + u1, unit: u2, ans: T(k), tol: 5, errors: [{ v: T(y * x), msg: 'Auf 1 ' + u1 + ' rechnest du mit geteilt.' }] },
                { label: z + ' ' + u1, unit: u2, ans: T(r), tol: 5, errors: [{ v: T(y * x / z), msg: 'Hier gilt: je mehr – desto mehr. Also im letzten Schritt mal.' }] }
            ],
            hint: 'Je mehr – desto mehr. Schritt 1: ' + de(y) + ' : ' + x + '. Schritt 2: Ergebnis · ' + z + '.',
            explanation: x + ' ' + u1 + ' → ' + de(y, kontext === 'preis' ? 2 : undefined) + ' ' + u2 + '<br>1 ' + u1 + ' → ' + de(y) + ' : ' + x + ' = ' + de(k) + ' ' + u2 +
                         '<br>' + z + ' ' + u1 + ' → ' + de(k) + ' · ' + z + ' = <strong>' + de(r, kontext === 'preis' ? 2 : undefined) + ' ' + u2 + '</strong>'
        };
    },
    function () {
        const wer = rnd([['Mitarbeiter', 'Mitarbeiter', 'einen Auftrag'], ['Maschinen', 'Maschine', 'eine Serie Drehteile']]);
        let total, a, b;
        do {
            total = rnd([24, 36, 48, 60, 72, 90, 120]);
            a = rint(2, 6); b = rint(2, 8);
        } while (a === b || total % a !== 0 || !has3(total / b) || (total / b) * 4 % 1 !== 0);
        const h = total / a, r = total / b;
        return {
            type: 'num',
            q: '<strong>' + a + ' ' + wer[0] + '</strong> brauchen für ' + wer[2] + ' <strong>' + de(h) + ' h</strong>. Wie lange brauchen <strong>' + b + ' ' + wer[0] + '</strong>?',
            note: 'Alle arbeiten gleich schnell. Rechne zuerst auf 1 ' + wer[1] + '.',
            fields: [
                { label: '1 ' + wer[1] + ' braucht', unit: 'h', ans: T(total), errors: [{ v: T(h / a), msg: 'Eine allein braucht länger, nicht kürzer: Rechne mal.' }] },
                { label: b + ' ' + wer[0] + ' brauchen', unit: 'h', ans: T(r), errors: [{ v: T(h * b / a), msg: 'Je mehr ' + wer[0] + ', desto weniger Zeit. Im letzten Schritt teilen.' }] }
            ],
            hint: 'Je mehr – desto weniger. 1 ' + wer[1] + ' braucht ' + a + '-mal so lange. Dann durch ' + b + ' teilen.',
            explanation: a + ' → ' + de(h) + ' h<br>1 → ' + de(h) + ' h · ' + a + ' = ' + total + ' h<br>' + b + ' → ' + total + ' h : ' + b + ' = <strong>' + de(r) + ' h</strong>'
        };
    },
    function () {
        const x = rint(2, 6), k = rnd([2.5, 3.5, 4.5, 1.25, 2.75]); let z; do { z = rint(3, 12); } while (z === x);
        const y = k * x, r = k * z;
        return {
            type: 'order',
            q: '<strong>' + x + ' m</strong> Rohr kosten <strong>' + de(y, 2) + ' €</strong>. Was kosten <strong>' + z + ' m</strong>? Bringe die Schritte in die richtige Reihenfolge.',
            steps: [x + ' m kosten ' + de(y, 2) + ' €. (gegeben)', '1 m kostet ' + de(y, 2) + ' € : ' + x + ' = ' + de(k, 2) + ' €', z + ' m kosten ' + de(k, 2) + ' € · ' + z + ' = ' + de(r, 2) + ' €'],
            hint: 'Dreisatz: gegeben → auf 1 rechnen → auf das Gesuchte rechnen.',
            explanation: 'Erst das Gegebene, dann auf 1 m, dann auf ' + z + ' m. Ergebnis: <strong>' + de(r, 2) + ' €</strong>.'
        };
    },
    function () {
        let G, p, W;
        do { G = rnd([200, 250, 400, 500, 600, 800, 1200, 1500]); p = rnd([1.5, 2, 2.5, 3, 4, 5, 6, 8]); W = G * p / 100; } while (!isInt(W));
        return {
            type: 'num',
            q: 'Bei einer Serie von <strong>' + G + ' Drehteilen</strong> sind <strong>' + de(p) + ' %</strong> Ausschuss. Wie viele Teile sind Ausschuss?',
            note: 'Rechne zuerst 1 %. Oder nutze die Formel W = G · p : 100.',
            fields: [
                { label: '1 % sind', unit: 'Teile', ans: T(G / 100), errors: [{ v: T(G * 100), msg: '100 % sind ' + G + ' Teile. Für 1 % teilst du durch 100.' }] },
                { label: de(p) + ' % sind', unit: 'Teile', ans: T(W), errors: [{ v: T(G * p), msg: 'Du hast das „: 100“ vergessen.' }, { v: T(G - W), msg: 'Das sind die guten Teile. Gesucht ist der Ausschuss.' }] }
            ],
            hint: 'Grundwert G = ' + G + ' Teile (100 %). 1 % = G : 100. Dann mal ' + de(p) + '.',
            explanation: '1 % = ' + G + ' : 100 = ' + de(G / 100) + ' Teile.<br>' + de(p) + ' % = ' + de(G / 100) + ' · ' + de(p) + ' = <strong>' + W + ' Teile</strong>.'
        };
    },
    function () {
        if (Math.random() < 0.5) {
            const G = rnd([40, 50, 60, 80, 120, 150]), p = rnd([5, 8, 10, 12, 15, 20, 25]), W = G * p / 100;
            return {
                type: 'num',
                q: 'Aus einer Blechtafel mit <strong>' + G + ' kg</strong> werden Teile ausgeschnitten. Als Abfall bleiben <strong>' + de(W) + ' kg</strong> übrig. Wie viel Prozent Verschnitt sind das?',
                note: 'Gesucht ist der Prozentsatz p. Formel: p = W · 100 : G.',
                fields: [{ label: 'Verschnitt p', unit: '%', ans: T(p), tol: 5,
                           errors: [{ v: T(W / G), msg: 'Du hast das „· 100“ vergessen.' }, { v: T(G / W), msg: 'Umgekehrt: Teile den Abfall durch die ganze Tafel.' }] }],
                hint: 'Der Grundwert ist die ganze Tafel: G = ' + G + ' kg. Rechne ' + de(W) + ' · 100 : ' + G + '.',
                explanation: 'p = ' + de(W) + ' kg · 100 : ' + G + ' kg = <strong>' + p + ' %</strong>.'
            };
        }
        const G = rnd([80, 120, 160, 240, 350, 480, 600]), p = rnd([5, 10, 15, 20, 25]), W = G * p / 100;
        return {
            type: 'num',
            q: 'Beim Kauf eines Werkzeugs bekommt der Betrieb <strong>' + p + ' %</strong> Rabatt. Das sind <strong>' + de(W, 2) + ' €</strong>. Wie viel kostet das Werkzeug ohne Rabatt?',
            note: 'Gesucht ist der Grundwert G (100 %). Rechne zuerst 1 %.',
            fields: [
                { label: '1 % sind', unit: '€', ans: T(W / p), tol: 5, errors: [{ v: T(W * p), msg: 'Für 1 % teilst du durch ' + p + '.' }] },
                { label: '100 % sind', unit: '€', ans: T(G), tol: 5, errors: [{ v: T(W * 100 / (100 - p)), msg: 'Rechne einfach 1 % · 100.' }, { v: T(G - W), msg: 'Gesucht ist der Preis ohne Rabatt (100 %).' }] }
            ],
            hint: p + ' % → ' + de(W, 2) + ' €. 1 % → ' + de(W, 2) + ' : ' + p + '. 100 % → mal 100.',
            explanation: '1 % = ' + de(W, 2) + ' € : ' + p + ' = ' + de(W / p, 2) + ' €.<br>100 % = ' + de(W / p, 2) + ' € · 100 = <strong>' + de(G, 2) + ' €</strong>.'
        };
    }
],
// ---------------------------------------------------------------- Modul 5: Formeln einsetzen
5: [
    function () {
        const all = [['A', 'Fläche'], ['V', 'Volumen'], ['l', 'Länge'], ['b', 'Breite'], ['h', 'Höhe'],
                     ['d', 'Durchmesser'], ['m', 'Masse'], ['ρ', 'Dichte'], ['F', 'Kraft'], ['p', 'Druck'], ['t', 'Zeit']]
            .map(x => ({ left: x[0], answer: x[1] }));
        const sel = pickN(all, 5);
        return {
            type: 'match', q: 'Was bedeutet das Formelzeichen?', options: shuffle(all.map(x => x.answer)), items: sel,
            hint: 'Viele Formelzeichen kommen von lateinischen oder englischen Wörtern: A wie Area, F wie Force, t wie time. ρ ist der griechische Buchstabe „rho“.',
            explanation: sel.map(x => x.left + ' = ' + x.answer).join(', ') + '.'
        };
    },
    function () {
        const l = rnd([1, 1.25, 1.5, 2, 2.5]), bmm = rnd([250, 400, 500, 600, 750, 800]), b = bmm / 1000, A = l * b;
        return {
            type: 'num',
            q: 'Ein Blechstreifen ist <strong>' + de(l) + ' m</strong> lang und <strong>' + bmm + ' mm</strong> breit. Wie groß ist die Fläche?',
            note: 'Formel: A = l · b. Rechne zuerst alles in m um.',
            fields: [
                { label: 'Breite in m', unit: 'm', ans: T(b), errors: [{ v: T(bmm / 100), msg: '1 m = 1000 mm. Teile durch 1000.' }] },
                { label: 'Fläche A', unit: 'm²', ans: T(A), tol: 1, errors: [{ v: T(l * bmm), msg: 'Rechne die mm zuerst in m um.' }] }
            ],
            hint: 'Erst ' + bmm + ' mm in m umrechnen. Dann A = l · b.',
            explanation: bmm + ' mm = ' + de(b) + ' m.<br>A = ' + de(l) + ' m · ' + de(b) + ' m = <strong>' + de(A) + ' m²</strong>.'
        };
    },
    function () {
        const l = rnd([8, 10, 12, 15, 20]), b = rnd([4, 5, 6, 8]), h = rnd([2, 2.5, 3, 4]);
        const V = l * b * h;
        return {
            type: 'num',
            q: 'Ein Stahlblock ist <strong>' + l + ' cm</strong> lang, <strong>' + b + ' cm</strong> breit und <strong>' + de(h) + ' cm</strong> hoch. Wie groß ist sein Volumen?',
            note: 'Formel: V = l · b · h. 1 dm³ = 1000 cm³.',
            fields: [
                { label: 'Volumen V', unit: 'cm³', ans: T(V) },
                { label: 'Volumen V', unit: 'dm³', ans: T(V / 1000), tol: 1, errors: [{ v: T(V / 100), msg: '1 dm³ = 1000 cm³. Teile durch 1000.' }] }
            ],
            hint: 'Erst V in cm³ ausrechnen. Dann durch 1000, dann hast du dm³.',
            explanation: 'V = ' + l + ' cm · ' + b + ' cm · ' + de(h) + ' cm = <strong>' + de(V) + ' cm³</strong> = <strong>' + de(V / 1000) + ' dm³</strong>.'
        };
    },
    function () {
        const d = rnd([10, 12, 16, 20, 25, 30, 32, 40, 50, 60]);
        const A = Math.PI / 4 * d * d;
        return {
            type: 'num',
            q: 'Ein Rundstahl hat den Durchmesser <strong>d = ' + d + ' mm</strong>. Berechne die Querschnittsfläche.',
            note: 'Formel: A = π/4 · d². π ≈ 3,14. Runde auf eine Nachkommastelle.',
            fields: [
                { label: 'd² =', unit: 'mm²', ans: T(d * d), errors: [{ v: T(2 * d), msg: 'd² heißt d · d, nicht d · 2.' }] },
                { label: 'Fläche A', unit: 'mm²', ans: T(A), tol: Math.round(T(A) * 0.002) + 60,
                  errors: [{ v: T(Math.PI * d * d), msg: 'Du hast das „: 4“ vergessen.' }] }
            ],
            hint: 'Erst d · d rechnen. Dann mal π und durch 4.',
            explanation: 'd² = ' + d + ' mm · ' + d + ' mm = ' + (d * d) + ' mm².<br>A = 3,14 : 4 · ' + (d * d) + ' mm² ≈ <strong>' + de(A, 1) + ' mm²</strong>.'
        };
    },
    function () {
        const [mat, rho] = rnd([['Stahl', 7.85], ['Aluminium', 2.7], ['Kupfer', 8.9]]);
        const Vcm = rnd([250, 400, 500, 640, 800, 1200, 1500, 2400]), V = Vcm / 1000, m = V * rho;
        return {
            type: 'num',
            q: 'Ein Werkstück aus <strong>' + mat + '</strong> hat das Volumen <strong>V = ' + de(Vcm) + ' cm³</strong>. ' + mat + ' hat die Dichte <strong>ρ = ' + de(rho) + ' kg/dm³</strong>. Wie schwer ist das Werkstück?',
            note: 'Formel: m = V · ρ. Die Dichte ist in kg/dm³. Rechne das Volumen zuerst in dm³ um.',
            fields: [
                { label: 'Volumen V', unit: 'dm³', ans: T(V), errors: [{ v: T(Vcm / 100), msg: '1 dm³ = 1000 cm³. Teile durch 1000.' }] },
                { label: 'Masse m', unit: 'kg', ans: T(m), tol: tolP(T(m), 0.5),
                  errors: [{ v: T(Vcm * rho), msg: 'Rechne zuerst cm³ in dm³ um. Sonst passen die Einheiten nicht zur Dichte.' }, { v: T(V / rho), msg: 'Nimm mal, nicht geteilt: m = V · ρ.' }] }
            ],
            hint: 'Erst ' + de(Vcm) + ' cm³ : 1000 = dm³. Dann mal ' + de(rho) + ' kg/dm³.',
            explanation: 'V = ' + de(Vcm) + ' cm³ = ' + de(V) + ' dm³.<br>m = ' + de(V) + ' dm³ · ' + de(rho) + ' kg/dm³ = <strong>' + de(m, 3) + ' kg</strong>.'
        };
    },
    function () {
        const l = rnd([2, 2.5, 3, 4]), bmm = rnd([200, 250, 400, 500]), b = bmm / 1000, A = l * b;
        const art = rnd(['umrechnen', 'faktor', 'einheit', 'rechnen']);
        const z = [
            'A = l · b',
            'A = ' + de(l) + ' m · ' + bmm + ' mm',
            'A = ' + de(l) + ' m · ' + de(b) + ' m',
            'A = ' + de(A) + ' m²'
        ];
        let falsch, expl;
        if (art === 'umrechnen') { z[2] = 'A = ' + de(l) + ' m · ' + de(bmm / 100) + ' m'; z[3] = 'A = ' + de(l * bmm / 100) + ' m²'; falsch = 3;
            expl = 'In Zeile 3 ist die Umrechnung falsch: ' + bmm + ' mm = ' + de(b) + ' m (durch 1000, nicht durch 100).'; }
        else if (art === 'faktor') { z.splice(2, 1); z[2] = 'A = ' + de(l * bmm) + ' m²'; falsch = 3;
            expl = 'In Zeile 3 fehlt die Umrechnung: Man darf m und mm nicht einfach malnehmen. Erst ' + bmm + ' mm = ' + de(b) + ' m.'; }
        else if (art === 'einheit') { z[3] = 'A = ' + de(A) + ' m'; falsch = 4;
            expl = 'In Zeile 4 ist die Einheit falsch: m · m = m². Eine Fläche hat immer eine Einheit mit ².'; }
        else { const w = Math.round((A + rnd([-0.25, 0.25, 0.5])) * 100) / 100; z[3] = 'A = ' + de(w) + ' m²'; falsch = 4;
            expl = 'In Zeile 4 ist falsch gerechnet: ' + de(l) + ' · ' + de(b) + ' = ' + de(A) + '.'; }
        return fehlerFinden('Fehler finden: Ein Blechstück ist ' + de(l) + ' m lang und ' + bmm + ' mm breit. Ein Schüler hat die Fläche berechnet. In welcher Zeile ist der erste Fehler?',
            z, falsch, expl + ' Richtig ist: A = <strong>' + de(A) + ' m²</strong>.',
            'Prüfe jede Zeile: Stimmt die Umrechnung? Stimmt die Rechnung? Stimmt die Einheit?');
    }
],
// ---------------------------------------------------------------- Modul 6: Formeln umstellen
6: [
    {
        type: 'match',
        q: 'Was ist die Gegenrechnung?',
        options: ['−', '+', ':', '·'],
        items: [{ left: '+ (plus)', answer: '−' }, { left: '− (minus)', answer: '+' }, { left: '· (mal)', answer: ':' }, { left: ': (geteilt)', answer: '·' }],
        hint: 'Die Gegenrechnung macht eine Rechnung wieder rückgängig: + 5 und dann − 5.',
        explanation: 'Plus und minus heben sich auf. Mal und geteilt heben sich auf.'
    },
    function () {
        const F = rnd([
            { f: 'V = A · l', g: 'l', s: ['V = A · l', 'Beide Seiten durch A teilen.', 'V : A = l', 'Seiten tauschen: l = V : A'] },
            { f: 'm = V · ρ', g: 'V', s: ['m = V · ρ', 'Beide Seiten durch ρ teilen.', 'm : ρ = V', 'Seiten tauschen: V = m : ρ'] },
            { f: 'L = l₁ + l₂', g: 'l₂', s: ['L = l₁ + l₂', 'Auf beiden Seiten l₁ abziehen.', 'L − l₁ = l₂', 'Seiten tauschen: l₂ = L − l₁'] },
            { f: 'ρ = m : V', g: 'm', s: ['ρ = m : V', 'Beide Seiten mal V nehmen.', 'ρ · V = m', 'Seiten tauschen: m = ρ · V'] },
            { f: 'F = m · g', g: 'm', s: ['F = m · g', 'Beide Seiten durch g teilen.', 'F : g = m', 'Seiten tauschen: m = F : g'] }
        ]);
        return {
            type: 'order', q: 'Stelle die Formel <strong>' + F.f + '</strong> nach <strong>' + F.g + '</strong> um. Bringe die Schritte in die richtige Reihenfolge.',
            steps: F.s,
            hint: 'Zuerst steht die Formel. Dann machst du auf beiden Seiten dieselbe Gegenrechnung. Zum Schluss steht das Gesuchte links.',
            explanation: F.s.join(' → ')
        };
    },
    function () {
        const all = [
            { left: 'A = l · b, gesucht: b', answer: 'b = A : l', wrong: 'b = A · l' },
            { left: 'V = A · l, gesucht: A', answer: 'A = V : l', wrong: 'A = V · l' },
            { left: 'm = V · ρ, gesucht: ρ', answer: 'ρ = m : V', wrong: 'ρ = V : m' },
            { left: 'ρ = m : V, gesucht: V', answer: 'V = m : ρ', wrong: 'V = ρ : m' },
            { left: 'L = l₁ + l₂, gesucht: l₁', answer: 'l₁ = L − l₂', wrong: 'l₁ = L + l₂' },
            { left: 'F = m · g, gesucht: m', answer: 'm = F : g', wrong: 'm = g : F' }
        ];
        const sel = pickN(all, 4);
        const options = shuffle(Array.from(new Set(sel.map(x => x.answer).concat(sel.map(x => x.wrong)))));
        return {
            type: 'match', q: 'Welche Formel ist richtig umgestellt?', options,
            items: sel.map(x => ({ left: x.left, answer: x.answer, errors: [{ v: x.wrong, msg: 'Prüfe mit Zahlen: Stimmt die Formel, wenn du einfache Werte einsetzt?' }] })),
            hint: 'Mal wird zu geteilt, plus wird zu minus. Tipp: Setze einfache Zahlen ein und prüfe, ob es stimmt.',
            explanation: sel.map(x => x.left.split(',')[0] + ' → <strong>' + x.answer + '</strong>').join('<br>')
        };
    },
    function () {
        const typ = rnd(['ab', 'al', 'rho', 'summe', 'fg']);
        let q, opts, ans, unit, wert, expl, tol = 0;
        if (typ === 'ab') {
            const l = rnd([1, 1.25, 2, 2.5]), b = rnd([0.2, 0.4, 0.5, 0.8, 1.2]), A = l * b;
            q = 'Ein Blechzuschnitt hat die Fläche <strong>A = ' + de(A) + ' m²</strong>. Er ist <strong>l = ' + de(l) + ' m</strong> lang. Wie breit ist er? Formel: A = l · b';
            opts = ['b = A : l', 'b = A · l', 'b = l : A']; ans = 'b = A : l'; unit = 'm'; wert = b;
            expl = 'b = A : l = ' + de(A) + ' m² : ' + de(l) + ' m = <strong>' + de(b) + ' m</strong>';
        } else if (typ === 'al') {
            const A = rnd([2, 3.5, 4, 5, 8]), l = rnd([12, 15, 20, 25, 30]), V = A * l;
            q = 'Ein Flachstahl hat den Querschnitt <strong>A = ' + de(A) + ' cm²</strong> und das Volumen <strong>V = ' + de(V) + ' cm³</strong>. Wie lang ist er? Formel: V = A · l';
            opts = ['l = V : A', 'l = V · A', 'l = A : V']; ans = 'l = V : A'; unit = 'cm'; wert = l;
            expl = 'l = V : A = ' + de(V) + ' cm³ : ' + de(A) + ' cm² = <strong>' + de(l) + ' cm</strong>';
        } else if (typ === 'rho') {
            const V = rnd([0.4, 0.8, 1.2, 2, 2.4]), m = V * 7.85;
            q = 'Ein Stahlteil wiegt <strong>m = ' + de(m) + ' kg</strong>. Stahl hat die Dichte <strong>ρ = 7,85 kg/dm³</strong>. Wie groß ist das Volumen? Formel: m = V · ρ';
            opts = ['V = m : ρ', 'V = m · ρ', 'V = ρ : m']; ans = 'V = m : ρ'; unit = 'dm³'; wert = V; tol = 2;
            expl = 'V = m : ρ = ' + de(m) + ' kg : 7,85 kg/dm³ = <strong>' + de(V) + ' dm³</strong>';
        } else if (typ === 'summe') {
            const L = 6, l1 = rnd([1.25, 1.8, 2.35, 2.6, 3.15]), l2 = L - l1;
            q = 'Von einer Stange Rundstahl (<strong>L = ' + L + ' m</strong>) wird ein Stück <strong>l₁ = ' + de(l1) + ' m</strong> abgesägt. Wie lang ist der Rest l₂? Formel: L = l₁ + l₂ (ohne Schnittbreite)';
            opts = ['l₂ = L − l₁', 'l₂ = L + l₁', 'l₂ = l₁ − L']; ans = 'l₂ = L − l₁'; unit = 'm'; wert = l2;
            expl = 'l₂ = L − l₁ = ' + L + ' m − ' + de(l1) + ' m = <strong>' + de(l2) + ' m</strong>';
        } else {
            const m = rnd([50, 80, 120, 200, 350, 500]), F = m * 9.81;
            q = 'Ein Kran hebt eine Last mit der Gewichtskraft <strong>F = ' + de(F, 2) + ' N</strong>. Wie groß ist die Masse? Formel: F = m · g mit g = 9,81 N/kg';
            opts = ['m = F : g', 'm = F · g', 'm = g : F']; ans = 'm = F : g'; unit = 'kg'; wert = m; tol = 2;
            expl = 'm = F : g = ' + de(F, 2) + ' N : 9,81 N/kg = <strong>' + de(m) + ' kg</strong>';
        }
        return {
            type: 'num', q,
            note: 'Wähle zuerst die umgestellte Formel. Rechne dann.',
            fields: [
                { label: 'umgestellte Formel', kind: 'select', options: shuffle(opts), ans },
                { label: 'Ergebnis', unit, ans: T(wert), tol }
            ],
            hint: 'Das Gesuchte muss allein auf einer Seite stehen. Mache dafür die Gegenrechnung.',
            explanation: expl + '.'
        };
    },
    richtigFalsch([
        { left: 'Aus A = l · b folgt l = A : b.', answer: 'richtig' },
        { left: 'Aus A = l · b folgt l = A · b.', answer: 'falsch' },
        { left: 'Aus ρ = m : V folgt V = ρ : m.', answer: 'falsch' },
        { left: 'Aus ρ = m : V folgt m = ρ · V.', answer: 'richtig' },
        { left: 'Aus L = l₁ + l₂ folgt l₂ = L + l₁.', answer: 'falsch' },
        { left: 'Aus F = m · g folgt m = F : g.', answer: 'richtig' },
        { left: 'Aus W = G · p : 100 folgt G = W · 100 : p.', answer: 'richtig' },
        { left: 'Beim Umstellen muss man auf beiden Seiten dasselbe rechnen.', answer: 'richtig' }
    ], 5, 'Waage-Prinzip: Was du auf einer Seite rechnest, rechnest du auch auf der anderen. Mal wird zu geteilt, plus wird zu minus.')
],
// ---------------------------------------------------------------- Modul 7: Mathe in der Werkstatt
7: [
    function () {
        const [mat, rho] = rnd([['Stahl', 7.85], ['Stahl', 7.85], ['Aluminium', 2.7]]);
        const b = rnd([20, 30, 40, 50, 60, 80]), h = rnd([5, 8, 10, 12, 15, 20]), l = rnd([250, 400, 500, 600, 800, 1000, 1200]);
        const V = (b / 100) * (h / 100) * (l / 100), m = V * rho;
        return {
            type: 'num',
            q: 'Ein Flachstahl aus <strong>' + mat + '</strong> hat den Querschnitt <strong>' + b + ' mm × ' + h + ' mm</strong> und ist <strong>' + l + ' mm</strong> lang. Wie schwer ist er? (ρ = ' + de(rho) + ' kg/dm³)',
            note: 'Rechne alle Maße in dm um. Dann kommt das Volumen in dm³ heraus. Runde erst am Ende.',
            fields: [
                { label: 'Volumen V', unit: 'dm³', ans: T(V), tol: tolP(T(V), 1, 1), errors: [{ v: T(b * h * l / 1000), msg: 'Das ist in cm³. Rechne zuerst alle Maße in dm um: mm : 100.' }] },
                { label: 'Masse m', unit: 'kg', ans: T(m), tol: tolP(T(m), 1, 3), errors: [{ v: T(b * h * l / 1000 * rho), msg: 'Das Volumen muss in dm³ sein, weil die Dichte in kg/dm³ ist.' }] }
            ],
            hint: b + ' mm = ' + de(b / 100) + ' dm, ' + h + ' mm = ' + de(h / 100) + ' dm, ' + l + ' mm = ' + de(l / 100) + ' dm. Dann V = l · b · h und m = V · ρ.',
            explanation: 'V = ' + de(l / 100) + ' dm · ' + de(b / 100) + ' dm · ' + de(h / 100) + ' dm = <strong>' + de(V) + ' dm³</strong>.<br>m = ' + de(V) + ' dm³ · ' + de(rho) + ' kg/dm³ ≈ <strong>' + de(m, 2) + ' kg</strong>.'
        };
    },
    function () {
        const d = rnd([20, 25, 30, 40, 50, 60]), l = rnd([200, 250, 400, 500, 800, 1000]);
        const dc = d / 10, lc = l / 10, A = Math.PI / 4 * dc * dc, V = A * lc, m = V / 1000 * 7.85;
        return {
            type: 'num',
            q: 'Ein Rundstahl hat den Durchmesser <strong>d = ' + d + ' mm</strong> und ist <strong>' + l + ' mm</strong> lang. Wie schwer ist er? (ρ = 7,85 kg/dm³)',
            note: 'Rechne in cm. Formeln: A = π/4 · d², V = A · l. Runde A auf zwei Nachkommastellen. Dann V in dm³ umrechnen und m = V · ρ.',
            fields: [
                { label: 'Querschnitt A', unit: 'cm²', ans: T(A), tol: tolP(T(A), 0.5, 6), errors: [{ v: T(Math.PI / 4 * d * d), msg: 'Das ist in mm². Rechne d zuerst in cm um: ' + d + ' mm = ' + de(dc) + ' cm.' }] },
                { label: 'Volumen V', unit: 'cm³', ans: T(V), tol: tolP(T(V), 1, 5) },
                { label: 'Masse m', unit: 'kg', ans: T(m), tol: tolP(T(m), 1, 5),
                  errors: [{ v: T(V * 7.85), msg: 'Rechne V zuerst in dm³ um: cm³ : 1000.' }, { v: T(V / 1000 / 7.85), msg: 'Nimm mal, nicht geteilt: m = V · ρ.' }] }
            ],
            hint: 'd = ' + de(dc) + ' cm, l = ' + de(lc) + ' cm. Erst A in cm², dann V = A · l in cm³. Dann : 1000 für dm³ und mal 7,85 kg/dm³.',
            explanation: 'A = π/4 · (' + de(dc) + ' cm)² ≈ ' + de(A, 2) + ' cm².<br>V = ' + de(A, 2) + ' cm² · ' + de(lc) + ' cm ≈ ' + de(V, 1) + ' cm³ = ' + de(V / 1000, 4) + ' dm³.<br>m = ' + de(V / 1000, 4) + ' dm³ · 7,85 kg/dm³ ≈ <strong>' + de(m, 2) + ' kg</strong>.'
        };
    },
    function () {
        const [mat, rho] = rnd([['Stahl', 7.85], ['Aluminium', 2.7]]);
        const [l, b] = rnd([[2000, 1000], [2500, 1250], [1000, 500], [1500, 1000]]), s = rnd([1, 1.5, 2, 3, 4]);
        const V = (l / 100) * (b / 100) * (s / 100), m = V * rho;
        return {
            type: 'num',
            q: 'Eine Blechtafel aus <strong>' + mat + '</strong> ist <strong>' + de(l) + ' mm × ' + de(b) + ' mm</strong> groß und <strong>' + de(s) + ' mm</strong> dick. Wie schwer ist sie? (ρ = ' + de(rho) + ' kg/dm³)',
            note: 'Rechne alle Maße in dm um. Auch die Dicke!',
            fields: [
                { label: 'Dicke in dm', unit: 'dm', ans: T(s / 100), errors: [{ v: T(s / 10), msg: '1 dm = 100 mm. Teile durch 100.' }] },
                { label: 'Volumen V', unit: 'dm³', ans: T(V), tol: 1 },
                { label: 'Masse m', unit: 'kg', ans: T(m), tol: tolP(T(m), 0.5, 5), errors: [{ v: T(V * rho * 10), msg: 'Prüfe die Dicke: ' + de(s) + ' mm = ' + de(s / 100) + ' dm.' }] }
            ],
            hint: de(l) + ' mm = ' + de(l / 100) + ' dm, ' + de(b) + ' mm = ' + de(b / 100) + ' dm, ' + de(s) + ' mm = ' + de(s / 100) + ' dm.',
            explanation: 'V = ' + de(l / 100) + ' dm · ' + de(b / 100) + ' dm · ' + de(s / 100) + ' dm = <strong>' + de(V) + ' dm³</strong>.<br>m = ' + de(V) + ' dm³ · ' + de(rho) + ' kg/dm³ = <strong>' + de(m, 2) + ' kg</strong>.'
        };
    },
    function () {
        let L, s, b, n, rest;
        do {
            L = rnd([3000, 6000]); s = rnd([180, 240, 275, 320, 385, 450, 520, 640, 730]); b = rnd([2, 3, 4]);
            n = Math.floor(L / (s + b)); rest = L - n * (s + b);
        } while (rest >= s || Math.floor(L / s) === n);
        return {
            type: 'num',
            q: 'Aus einer Stange Flachstahl mit <strong>' + de(L) + ' mm</strong> Länge sollen möglichst viele Stücke mit <strong>' + s + ' mm</strong> gesägt werden. Das Sägeblatt ist <strong>' + b + ' mm</strong> breit. Wie viele Stücke bekommst du? Wie lang ist der Rest?',
            note: 'Für jedes Stück brauchst du die Stücklänge plus die Schnittbreite.',
            fields: [
                { label: 'Länge pro Stück mit Schnitt', unit: 'mm', ans: T(s + b), errors: [{ v: T(s), msg: 'Rechne die Schnittbreite dazu.' }] },
                { label: 'Anzahl Stücke', unit: 'Stück', ans: T(n), errors: [{ v: T(Math.floor(L / s)), msg: 'Du hast die Schnittbreite vergessen. Jedes Stück braucht ' + (s + b) + ' mm.' }, { v: T(n + 1), msg: 'Das letzte Stück wäre zu kurz. Runde hier immer ab.' }] },
                { label: 'Rest', unit: 'mm', ans: T(rest), errors: [{ v: T(L - n * s), msg: 'Ziehe für jedes Stück auch die Schnittbreite ab.' }] }
            ],
            hint: 'Teile ' + de(L) + ' mm durch (' + s + ' + ' + b + ') mm. Nur ganze Stücke zählen. Rest = Stange − Anzahl · ' + (s + b) + ' mm.',
            explanation: s + ' mm + ' + b + ' mm = ' + (s + b) + ' mm pro Stück.<br>' + de(L) + ' : ' + (s + b) + ' = ' + de(L / (s + b), 2) + ' → <strong>' + n + ' Stücke</strong>.<br>Rest: ' + de(L) + ' mm − ' + n + ' · ' + (s + b) + ' mm = <strong>' + rest + ' mm</strong>.'
        };
    },
    function () {
        let l, a, n, p;
        do {
            l = rnd([300, 400, 480, 500, 600, 720, 800, 900, 1000, 1200]); a = rnd([20, 25, 30, 40, 50]); n = rint(4, 9);
            p = (l - 2 * a) / (n - 1);
        } while (!isInt(p * 10) || p < 30);
        return {
            type: 'num',
            q: 'In eine Leiste mit der Länge <strong>l = ' + l + ' mm</strong> sollen <strong>' + n + ' Bohrungen</strong> gebohrt werden. Der Randabstand ist links und rechts <strong>a = ' + a + ' mm</strong>. Wie groß ist der Lochabstand p?',
            svg: teilungSVG(l, a, n, p),
            note: 'Formel: p = (l − 2 · a) : (n − 1). Dabei ist n die Anzahl der Bohrungen.',
            fields: [
                { label: 'Länge zwischen erster und letzter Bohrung', unit: 'mm', ans: T(l - 2 * a), errors: [{ v: T(l - a), msg: 'Es gibt zwei Ränder: Ziehe 2 · a ab.' }] },
                { label: 'Anzahl der Abstände', unit: '', ans: T(n - 1), errors: [{ v: T(n), msg: 'Zähle in der Skizze: Bei ' + n + ' Bohrungen gibt es ' + (n - 1) + ' Abstände.' }, { v: T(n + 1), msg: 'Zähle nur die Abstände zwischen den Bohrungen.' }] },
                { label: 'Lochabstand p', unit: 'mm', ans: T(p), errors: [{ v: T((l - 2 * a) / n), msg: 'Teile durch die Anzahl der Abstände (n − 1), nicht durch n.' }, { v: T((l - a) / (n - 1)), msg: 'Ziehe beide Randabstände ab: 2 · a.' }] }
            ],
            hint: 'Erst die Randabstände abziehen: l − 2 · a. Dann durch die Anzahl der Abstände teilen: n − 1.',
            explanation: 'l − 2 · a = ' + l + ' mm − ' + (2 * a) + ' mm = ' + (l - 2 * a) + ' mm.<br>' + n + ' Bohrungen → ' + (n - 1) + ' Abstände.<br>p = ' + (l - 2 * a) + ' mm : ' + (n - 1) + ' = <strong>' + de(p) + ' mm</strong>.'
        };
    },
    function () {
        const b = rnd([40, 50, 60, 80]), h = rnd([10, 20]), l = rnd([500, 1000, 1500, 2000]);
        const bd = b / 100, hd = h / 100, ld = l / 100, V = bd * hd * ld, m = V * 7.85;
        const art = rnd(['umrechnen', 'rechnen', 'formel', 'einheit']);
        const z = [
            'm = V · ρ',
            'V = ' + de(ld) + ' dm · ' + de(bd) + ' dm · ' + de(hd) + ' dm',
            'V = ' + de(V) + ' dm³',
            'm = ' + de(V) + ' dm³ · 7,85 kg/dm³',
            'm = ' + de(m, 2) + ' kg'
        ];
        let falsch, expl;
        if (art === 'umrechnen') {
            const bw = b / 10, Vw = bw * hd * ld;
            z[1] = 'V = ' + de(ld) + ' dm · ' + de(bw) + ' dm · ' + de(hd) + ' dm'; z[2] = 'V = ' + de(Vw) + ' dm³';
            z[3] = 'm = ' + de(Vw) + ' dm³ · 7,85 kg/dm³'; z[4] = 'm = ' + de(Vw * 7.85, 2) + ' kg'; falsch = 2;
            expl = 'In Zeile 2 ist die Umrechnung falsch: ' + b + ' mm = ' + de(bd) + ' dm (durch 100, nicht durch 10).';
        } else if (art === 'rechnen') {
            const Vw = V * 10;
            z[2] = 'V = ' + de(Vw) + ' dm³'; z[3] = 'm = ' + de(Vw) + ' dm³ · 7,85 kg/dm³'; z[4] = 'm = ' + de(Vw * 7.85, 2) + ' kg'; falsch = 3;
            expl = 'In Zeile 3 ist falsch gerechnet: ' + de(ld) + ' · ' + de(bd) + ' · ' + de(hd) + ' = ' + de(V) + '.';
        } else if (art === 'formel') {
            z[3] = 'm = ' + de(V) + ' dm³ : 7,85 kg/dm³'; z[4] = 'm = ' + de(V / 7.85, 3) + ' kg'; falsch = 4;
            expl = 'In Zeile 4 wird geteilt statt malgenommen. Die Formel heißt m = V · ρ.';
        } else {
            z[4] = 'm = ' + de(m, 2) + ' dm³'; falsch = 5;
            expl = 'In Zeile 5 ist die Einheit falsch: dm³ · kg/dm³ = kg. Eine Masse hat die Einheit kg.';
        }
        return fehlerFinden('Fehler finden: Ein Flachstahl ' + b + ' mm × ' + h + ' mm ist ' + l + ' mm lang (ρ = 7,85 kg/dm³). Ein Schüler hat die Masse berechnet. In welcher Zeile ist der erste Fehler?',
            z, falsch, expl + ' Richtig ist: m = <strong>' + de(m, 2) + ' kg</strong>.',
            'Prüfe jede Zeile: Stimmt die Umrechnung in dm? Stimmt die Rechnung? Stimmt die Formel? Stimmt die Einheit?');
    }
]
};
