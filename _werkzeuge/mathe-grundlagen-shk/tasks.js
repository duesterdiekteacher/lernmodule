// =====================================================================
// Aufgaben für das Modul "Mathe-Grundlagen SHK"
// Rechenregeln, Einheiten, Formeln einsetzen und umstellen. Ohne Tabellenbuch.
// Hilfsfunktionen aus engine.js. num-Felder: ans in Tausendsteln der Einheit
// (2,35 -> 2350). tol = erlaubter Spielraum, z. B. wegen π oder Runden.
// =====================================================================

const UNLOCK_TEXT = {
    5: 'Formeln umstellen mit dem Waage-Prinzip.',
    6: 'Rohrinhalt, Badewanne füllen, Speicher und Zuschnitt: Mathe auf der Baustelle.'
};

// ---------- Zahlen ----------
const T = x => Math.round(x * 1000);                      // Wert -> Tausendstel
function de(x, dec) {                                       // 2.35 -> "2,35", 100000 -> "100 000"
    let s = (dec === undefined) ? String(Number(x.toFixed(6))) : x.toFixed(dec);
    let [g, k] = s.replace('-', '').split('.');
    if (g.length > 4) g = g.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return (x < 0 ? '−' : '') + g + (k ? ',' + k : '');
}
const has3 = x => Math.abs(x * 1000 - Math.round(x * 1000)) < 1e-6;
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

// ---------- Einheiten umrechnen ----------
// Jede Einheit als Vielfaches einer Grundeinheit
const U = {
    laenge: { mm: 1, cm: 10, dm: 100, m: 1000 },
    flaeche: { 'mm²': 1, 'cm²': 100, 'dm²': 1e4, 'm²': 1e6 },
    volumen: { 'cm³': 1, 'dm³': 1000, 'l': 1000, 'm³': 1e6 },
    masse: { g: 1, kg: 1000, t: 1e6 },
    druck: { Pa: 1, mbar: 100, bar: 100000 },
    leistung: { W: 1, kW: 1000 }
};
const SCHRITT = { laenge: 10, flaeche: 100, volumen: 1000 };
const NICE = [0.02, 0.05, 0.08, 0.25, 0.4, 0.5, 0.75, 1.2, 1.5, 2.35, 2.5, 3.6, 4.8, 6.4, 12, 15, 25, 45, 60, 85, 120, 250, 350, 450, 750, 1500, 2500, 3500, 4200, 8000, 12000, 25000];

// Eine Umrechnung als Feld; von/nach aus derselben Familie
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

// =====================================================================
const TASKS = {
// ---------------------------------------------------------------- Modul 1
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
        // Zahlen mit 4 Nachkommastellen als ganze Zahlen (in Zehntausendsteln)
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
// ---------------------------------------------------------------- Modul 2
2: [
    function () {
        const all = [
            ['mm', 'Länge'], ['cm', 'Länge'], ['m', 'Länge'], ['km', 'Länge'],
            ['mm²', 'Fläche'], ['cm²', 'Fläche'], ['m²', 'Fläche'],
            ['cm³', 'Volumen'], ['dm³', 'Volumen'], ['m³', 'Volumen'], ['l (Liter)', 'Volumen']
        ].map(x => ({ left: x[0], answer: x[1] }));
        const base = ['Länge', 'Fläche', 'Volumen'].map(g => rnd(all.filter(x => x.answer === g)));
        return {
            type: 'match', q: 'Ist das eine Einheit für eine Länge, eine Fläche oder ein Volumen?', options: ['Länge', 'Fläche', 'Volumen'],
            items: shuffle(base.concat(pickN(all.filter(x => base.indexOf(x) < 0), 2))),
            hint: 'Schau auf die kleine Zahl oben: ² heißt Fläche, ³ heißt Volumen. Der Liter ist auch ein Volumen.',
            explanation: 'Ohne Hochzahl: Länge. Mit ²: Fläche. Mit ³ und Liter: Volumen.'
        };
    },
    convTask('laenge', [['m', 'mm'], ['mm', 'm'], ['cm', 'mm'], ['m', 'cm'], ['cm', 'm'], ['dm', 'cm'], ['mm', 'cm']],
             'Rechne die Längen um.', 'Bei Längen ist die Umrechnungszahl 10. Von m zu mm sind es drei Schritte: · 10 · 10 · 10 = · 1000.'),
    convTask('flaeche', [['m²', 'dm²'], ['m²', 'cm²'], ['cm²', 'm²'], ['dm²', 'm²'], ['cm²', 'mm²'], ['mm²', 'cm²']],
             'Rechne die Flächen um.', 'Bei Flächen ist die Umrechnungszahl 100. Von m² zu cm² sind es zwei Schritte: · 100 · 100 = · 10 000.'),
    convTask('volumen', [['m³', 'l'], ['l', 'm³'], ['cm³', 'l'], ['dm³', 'cm³'], ['l', 'cm³'], ['m³', 'dm³']],
             'Rechne die Volumen um. Denk daran: 1 dm³ = 1 l.', 'Bei Volumen ist die Umrechnungszahl 1000. 1 m³ = 1000 dm³ = 1000 l.'),
    function () {
        const U2 = { mm: 1, cm: 10, m: 1000 };
        const vals = pickN([850, 900, 950, 1050, 1100, 1150, 1200, 1250, 1300], 4).sort((a, b) => a - b);
        const show = vals.map(mmv => {
            const opts = ['mm', 'cm', 'm'].filter(u => has3(mmv / U2[u]));
            const u = rnd(opts);
            return de(mmv / U2[u]) + ' ' + u;
        });
        return {
            type: 'order', q: 'Sortiere die Rohrstücke nach der Länge. Das kürzeste kommt nach oben.',
            steps: show,
            hint: 'Rechne zuerst alle Längen in dieselbe Einheit um, zum Beispiel in mm.',
            explanation: show.map((s, k) => s + ' = ' + vals[k] + ' mm').join(' &lt; ')
        };
    }
],
// ---------------------------------------------------------------- Modul 3
3: [
    function () {
        const fields = shuffle([
            convField('masse', ...rnd([['t', 'kg'], ['kg', 'g'], ['g', 'kg'], ['kg', 't']])),
            convField('leistung', 'kW', 'W'),
            convField('leistung', 'W', 'kW')
        ]);
        return {
            type: 'num', q: 'Rechne die Masse und die Leistung um.', fields,
            hint: '1 t = 1000 kg, 1 kg = 1000 g. 1 kW = 1000 W.',
            explanation: fields.map(f => f.label + ' <strong>' + de(f._r) + ' ' + f.unit + '</strong>').join('<br>')
        };
    },
    function () {
        const h1 = rnd([1.5, 2.5, 0.5, 0.25, 1.25, 0.75]), m1 = h1 * 60;
        const m2 = rnd([45, 90, 150, 135, 15, 75]), h2 = m2 / 60;
        const hh = rint(1, 3), mm2 = rnd([10, 15, 20, 30, 40, 45]), m3 = hh * 60 + mm2;
        return {
            type: 'num', q: 'Rechne die Zeiten um. Vorsicht: Eine Stunde hat 60 Minuten, nicht 100!',
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
    convTask('druck', [['bar', 'mbar'], ['mbar', 'bar'], ['bar', 'Pa'], ['mbar', 'Pa']],
             'Rechne die Drücke um. 1 bar = 1000 mbar = 100 000 Pa.', '1 bar = 1000 mbar. 1 mbar = 100 Pa. 1 bar = 100 000 Pa.'),
    function () {
        const all = [['kg', 'Masse'], ['t', 'Masse'], ['g', 'Masse'], ['min', 'Zeit'], ['h', 'Zeit'], ['s', 'Zeit'],
                     ['bar', 'Druck'], ['mbar', 'Druck'], ['Pa', 'Druck'], ['W', 'Leistung'], ['kW', 'Leistung']]
            .map(x => ({ left: x[0], answer: x[1] }));
        return {
            type: 'match', q: 'Welche Größe misst man mit dieser Einheit?', options: ['Masse', 'Zeit', 'Druck', 'Leistung'],
            items: shuffle(['Masse', 'Zeit', 'Druck', 'Leistung'].map(g => rnd(all.filter(x => x.answer === g)))),
            hint: 'Pa heißt Pascal, W heißt Watt. h ist die Stunde (vom lateinischen hora).',
            explanation: 'Masse: g, kg, t. Zeit: s, min, h. Druck: Pa, mbar, bar. Leistung: W, kW.'
        };
    },
    {
        type: 'mc',
        q: 'Ein Monteur braucht für eine Arbeit <strong>1,5 h</strong>. Wie lange ist das?',
        options: ['1 h 50 min', '1 h 30 min', '1 h 5 min', '150 min'],
        correct: 1,
        hint: '0,5 h ist eine halbe Stunde.',
        explanation: '1,5 h = 1 h + 0,5 h = 1 h + 30 min = 1 h 30 min = 90 min.'
    }
],
// ---------------------------------------------------------------- Modul 4
4: [
    function () {
        const all = [['A', 'Fläche'], ['V', 'Volumen'], ['l', 'Länge'], ['b', 'Breite'], ['h', 'Höhe'],
                     ['d', 'Durchmesser'], ['m', 'Masse'], ['t', 'Zeit'], ['p', 'Druck'], ['Q', 'Volumenstrom']]
            .map(x => ({ left: x[0], answer: x[1] }));
        const sel = pickN(all, 5);
        return {
            type: 'match', q: 'Was bedeutet das Formelzeichen?', options: shuffle(all.map(x => x.answer)), items: sel,
            hint: 'Viele Formelzeichen kommen von lateinischen oder englischen Wörtern: A wie Area, V wie Volumen, t wie time.',
            explanation: sel.map(x => x.left + ' = ' + x.answer).join(', ') + '.'
        };
    },
    function () {
        const l = rnd([1.5, 2, 2.4, 3, 3.5, 4.2]), bc = rnd([40, 50, 60, 75, 80, 120]), b = bc / 100, A = l * b;
        return {
            type: 'num',
            q: 'Ein Bad soll gefliest werden. Eine Wand ist <strong>' + de(l) + ' m</strong> lang und <strong>' + bc + ' cm</strong> hoch gefliest. Wie groß ist die Fläche?',
            note: 'Formel: A = l · b. Rechne zuerst alles in m um.',
            fields: [
                { label: 'Höhe in m', unit: 'm', ans: T(b), errors: [{ v: T(bc / 10), msg: '1 m = 100 cm. Teile durch 100.' }] },
                { label: 'Fläche A', unit: 'm²', ans: T(A), errors: [{ v: T(l * bc), msg: 'Rechne die cm zuerst in m um.' }] }
            ],
            hint: 'Erst ' + bc + ' cm in m umrechnen. Dann A = l · b.',
            explanation: bc + ' cm = ' + de(b) + ' m.<br>A = ' + de(l) + ' m · ' + de(b) + ' m = <strong>' + de(A) + ' m²</strong>.'
        };
    },
    function () {
        const l = rnd([1.2, 1.5, 1.6, 1.8, 2]), b = rnd([0.5, 0.6, 0.75, 0.8]), h = rnd([0.4, 0.5, 0.6, 1]);
        const V = l * b * h;
        return {
            type: 'num',
            q: 'Ein rechteckiger Behälter ist <strong>' + de(l) + ' m</strong> lang, <strong>' + de(b) + ' m</strong> breit und <strong>' + de(h) + ' m</strong> hoch. Wie viel Wasser passt hinein?',
            note: 'Formel: V = l · b · h. Dann: 1 m³ = 1000 l.',
            fields: [
                { label: 'Volumen V', unit: 'm³', ans: T(V), tol: 1 },
                { label: 'Volumen V', unit: 'l', ans: T(V * 1000), errors: [{ v: T(V * 100), msg: '1 m³ = 1000 l.' }] }
            ],
            hint: 'Erst V in m³ ausrechnen. Dann mal 1000, dann hast du Liter.',
            explanation: 'V = ' + de(l) + ' m · ' + de(b) + ' m · ' + de(h) + ' m = <strong>' + de(V) + ' m³</strong> = <strong>' + de(V * 1000) + ' l</strong>.'
        };
    },
    function () {
        const d = rnd([10, 12, 15, 16, 18, 20, 22, 25, 28, 32, 40, 50]);
        const A = Math.PI / 4 * d * d;
        return {
            type: 'num',
            q: 'Ein Rohr hat innen den Durchmesser <strong>d = ' + d + ' mm</strong>. Berechne die Querschnittsfläche.',
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
        const l = rnd([2, 2.5, 3, 4]), bc = rnd([40, 50, 60, 80]), b = bc / 100, A = l * b;
        const art = rnd(['umrechnen', 'faktor', 'einheit', 'rechnen']);
        const z = [
            'A = l · b',
            'A = ' + de(l) + ' m · ' + bc + ' cm',
            'A = ' + de(l) + ' m · ' + de(b) + ' m',
            'A = ' + de(A) + ' m²'
        ];
        let falsch, expl;
        if (art === 'umrechnen') { z[2] = 'A = ' + de(l) + ' m · ' + de(bc / 10) + ' m'; z[3] = 'A = ' + de(l * bc / 10) + ' m²'; falsch = 3;
            expl = 'In Zeile 3 ist die Umrechnung falsch: ' + bc + ' cm = ' + de(b) + ' m (durch 100, nicht durch 10).'; }
        else if (art === 'faktor') { z.splice(2, 1); z[2] = 'A = ' + de(l * bc) + ' m²'; falsch = 3;
            expl = 'In Zeile 3 fehlt die Umrechnung: Man darf m und cm nicht einfach malnehmen. Erst ' + bc + ' cm = ' + de(b) + ' m.'; }
        else if (art === 'einheit') { z[3] = 'A = ' + de(A) + ' m'; falsch = 4;
            expl = 'In Zeile 4 ist die Einheit falsch: m · m = m². Eine Fläche hat immer die Einheit m².'; }
        else { const w = Math.round((A + rnd([-0.5, 0.5, 1])) * 100) / 100; z[3] = 'A = ' + de(w) + ' m²'; falsch = 4;
            expl = 'In Zeile 4 ist falsch gerechnet: ' + de(l) + ' · ' + de(b) + ' = ' + de(A) + '.'; }
        const html = '<div class="calc">' + z.map((s, k) => '<div><span class="calc-nr">Zeile ' + (k + 1) + '</span>' + s + '</div>').join('') + '</div>';
        const opts = z.map((s, k) => 'Zeile ' + (k + 1));
        return {
            type: 'mc', svg: html,
            q: 'Fehler finden: Ein Wandstück ist ' + de(l) + ' m lang und ' + bc + ' cm hoch. Ein Schüler hat die Fläche berechnet. In welcher Zeile ist der erste Fehler?',
            options: opts, correct: falsch - 1,
            hint: 'Prüfe jede Zeile: Stimmt die Umrechnung? Stimmt die Rechnung? Stimmt die Einheit?',
            explanation: expl + ' Richtig ist: A = <strong>' + de(A) + ' m²</strong>.'
        };
    }
],
// ---------------------------------------------------------------- Modul 5
5: [
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
            { f: 'V = A · h', g: 'h', s: ['V = A · h', 'Beide Seiten durch A teilen.', 'V : A = h', 'Seiten tauschen: h = V : A'] },
            { f: 'm = V · ρ', g: 'V', s: ['m = V · ρ', 'Beide Seiten durch ρ teilen.', 'm : ρ = V', 'Seiten tauschen: V = m : ρ'] },
            { f: 'L = l₁ + l₂', g: 'l₂', s: ['L = l₁ + l₂', 'Auf beiden Seiten l₁ abziehen.', 'L − l₁ = l₂', 'Seiten tauschen: l₂ = L − l₁'] },
            { f: 'ρ = m : V', g: 'm', s: ['ρ = m : V', 'Beide Seiten mal V nehmen.', 'ρ · V = m', 'Seiten tauschen: m = ρ · V'] },
            { f: 'Q = V : t', g: 'V', s: ['Q = V : t', 'Beide Seiten mal t nehmen.', 'Q · t = V', 'Seiten tauschen: V = Q · t'] }
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
            { left: 'V = A · h, gesucht: A', answer: 'A = V : h', wrong: 'A = V · h' },
            { left: 'm = V · ρ, gesucht: ρ', answer: 'ρ = m : V', wrong: 'ρ = V : m' },
            { left: 'ρ = m : V, gesucht: V', answer: 'V = m : ρ', wrong: 'V = ρ : m' },
            { left: 'L = l₁ + l₂, gesucht: l₁', answer: 'l₁ = L − l₂', wrong: 'l₁ = L + l₂' },
            { left: 'Q = V : t, gesucht: t', answer: 't = V : Q', wrong: 't = Q : V' }
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
        const typ = rnd(['ab', 'ah', 'rho', 'summe', 'qt']);
        let q, sel, opts, ans, unit, wert, expl, tol = 0;
        if (typ === 'ab') {
            const l = rnd([2, 2.5, 3, 4, 5]), b = rnd([0.5, 0.8, 1.2, 1.5, 2]), A = l * b;
            q = 'Ein Raum hat die Fläche <strong>A = ' + de(A) + ' m²</strong>. Er ist <strong>l = ' + de(l) + ' m</strong> lang. Wie breit ist er? Formel: A = l · b';
            opts = ['b = A : l', 'b = A · l', 'b = l : A']; ans = 'b = A : l'; unit = 'm'; wert = b;
            expl = 'b = A : l = ' + de(A) + ' m² : ' + de(l) + ' m = <strong>' + de(b) + ' m</strong>';
        } else if (typ === 'ah') {
            const A = rnd([0.5, 0.8, 1.2, 2]), h = rnd([0.5, 1.5, 2, 2.5]), V = A * h;
            q = 'Ein Behälter hat das Volumen <strong>V = ' + de(V) + ' m³</strong> und die Grundfläche <strong>A = ' + de(A) + ' m²</strong>. Wie hoch ist er? Formel: V = A · h';
            opts = ['h = V : A', 'h = V · A', 'h = A : V']; ans = 'h = V : A'; unit = 'm'; wert = h;
            expl = 'h = V : A = ' + de(V) + ' m³ : ' + de(A) + ' m² = <strong>' + de(h) + ' m</strong>';
        } else if (typ === 'rho') {
            const V = rnd([0.5, 1, 1.5, 2, 2.5]), m = V * 8.9;
            q = 'Ein Kupferteil wiegt <strong>m = ' + de(m) + ' kg</strong>. Kupfer hat die Dichte <strong>ρ = 8,9 kg/dm³</strong>. Wie groß ist das Volumen? Formel: m = V · ρ';
            opts = ['V = m : ρ', 'V = m · ρ', 'V = ρ : m']; ans = 'V = m : ρ'; unit = 'dm³'; wert = V;
            expl = 'V = m : ρ = ' + de(m) + ' kg : 8,9 kg/dm³ = <strong>' + de(V) + ' dm³</strong>';
        } else if (typ === 'summe') {
            const L = rnd([5, 6]), l1 = rnd([1.25, 1.8, 2.35, 2.6, 3.15]), l2 = L - l1;
            q = 'Von einer Rohrstange (<strong>L = ' + L + ' m</strong>) wird ein Stück <strong>l₁ = ' + de(l1) + ' m</strong> abgeschnitten. Wie lang ist der Rest l₂? Formel: L = l₁ + l₂';
            opts = ['l₂ = L − l₁', 'l₂ = L + l₁', 'l₂ = l₁ − L']; ans = 'l₂ = L − l₁'; unit = 'm'; wert = l2;
            expl = 'l₂ = L − l₁ = ' + L + ' m − ' + de(l1) + ' m = <strong>' + de(l2) + ' m</strong>';
        } else {
            const V = rnd([120, 150, 160, 180, 200]), Q = rnd([8, 10, 12, 15, 20]), t = V / Q;
            q = 'Eine Badewanne fasst <strong>V = ' + V + ' l</strong>. Aus dem Wasserhahn fließen <strong>Q = ' + Q + ' l/min</strong>. Wie lange dauert das Füllen? Formel: Q = V : t';
            opts = ['t = V : Q', 't = V · Q', 't = Q : V']; ans = 't = V : Q'; unit = 'min'; wert = t; tol = 6;
            expl = 't = V : Q = ' + V + ' l : ' + Q + ' l/min ≈ <strong>' + de(Math.round(t * 100) / 100) + ' min</strong>';
        }
        return {
            type: 'num', q,
            note: 'Wähle zuerst die umgestellte Formel. Rechne dann. ' + (tol ? 'Runde auf zwei Nachkommastellen.' : ''),
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
        { left: 'Aus Q = V : t folgt V = Q · t.', answer: 'richtig' },
        { left: 'Beim Umstellen muss man auf beiden Seiten dasselbe rechnen.', answer: 'richtig' }
    ], 5, 'Waage-Prinzip: Was du auf einer Seite rechnest, rechnest du auch auf der anderen. Mal wird zu geteilt, plus wird zu minus.')
],
// ---------------------------------------------------------------- Modul 6
6: [
    function () {
        const [name, di] = rnd([['15 × 1', 13], ['18 × 1', 16], ['22 × 1', 20], ['28 × 1,5', 25]]);
        const L = rint(5, 40);
        const ddm = di / 100, Ldm = L * 10;
        const A = Math.PI / 4 * ddm * ddm, V = A * Ldm;
        return {
            type: 'num',
            q: 'Eine Kupferleitung <strong>' + name + '</strong> ist <strong>' + L + ' m</strong> lang. Innen hat sie den Durchmesser <strong>' + di + ' mm</strong>. Wie viel Wasser ist in der Leitung?',
            note: 'Rechne in dm, dann kommt das Volumen in Liter heraus (1 dm³ = 1 l). Formeln: A = π/4 · d² und V = A · l. Wenn du A aufschreibst: vier Nachkommastellen. Runde erst am Ende auf zwei Nachkommastellen.',
            fields: [
                { label: 'd in dm', unit: 'dm', ans: T(ddm), errors: [{ v: T(di / 10), msg: '1 dm = 100 mm. Teile durch 100.' }] },
                { label: 'l in dm', unit: 'dm', ans: T(Ldm), errors: [{ v: T(L * 100), msg: '1 m = 10 dm.' }] },
                { label: 'Wasser im Rohr', unit: 'l', ans: T(V), tol: Math.round(T(V) * 0.015) + 10 }
            ],
            hint: 'Erst d und l in dm umrechnen. Dann A = π/4 · d² in dm². Dann V = A · l in dm³ = Liter.',
            explanation: 'd = ' + di + ' mm = ' + de(ddm) + ' dm, l = ' + L + ' m = ' + Ldm + ' dm.<br>A = π/4 · (' + de(ddm) + ' dm)² ≈ ' + de(A, 5) + ' dm².<br>V = ' + de(A, 5) + ' dm² · ' + Ldm + ' dm ≈ <strong>' + de(V, 2) + ' l</strong>.'
        };
    },
    function () {
        const rueck = Math.random() < 0.5;
        const V = rnd([120, 140, 150, 160, 180, 200]);
        if (!rueck) {
            const Q = rnd([8, 10, 12, 15, 16, 20]), t = V / Q;
            return {
                type: 'num',
                q: 'Eine Badewanne fasst <strong>' + V + ' l</strong>. Der Wannenfüller liefert <strong>' + Q + ' l/min</strong>. Wie lange dauert es, bis die Wanne voll ist?',
                note: 'Formel: Q = V : t. Stelle nach t um. Runde auf zwei Nachkommastellen.',
                fields: [{ label: 'Zeit t', unit: 'min', ans: T(t), tol: 6, errors: [{ v: T(Q / V), msg: 'Umgekehrt: t = V : Q.' }] }],
                hint: 't = V : Q. Teile die Liter durch die Liter pro Minute.',
                explanation: 't = V : Q = ' + V + ' l : ' + Q + ' l/min ≈ <strong>' + de(Math.round(t * 100) / 100) + ' min</strong>.'
            };
        }
        const t = rnd([8, 10, 12, 16, 20]), Q = V / t;
        return {
            type: 'num',
            q: 'Eine Badewanne mit <strong>' + V + ' l</strong> soll in <strong>' + t + ' min</strong> voll sein. Wie viel Wasser muss pro Minute fließen?',
            note: 'Formel: Q = V : t. Runde auf zwei Nachkommastellen.',
            fields: [{ label: 'Volumenstrom Q', unit: 'l/min', ans: T(Q), tol: 6, errors: [{ v: T(V * t), msg: 'Teile, statt malzunehmen: Q = V : t.' }] }],
            hint: 'Q = V : t. Teile die Liter durch die Minuten.',
            explanation: 'Q = V : t = ' + V + ' l : ' + t + ' min ≈ <strong>' + de(Math.round(Q * 100) / 100) + ' l/min</strong>.'
        };
    },
    function () {
        const d = rnd([0.5, 0.6, 0.7, 0.8]), h = rnd([1.2, 1.5, 1.8]);
        const A = Math.PI / 4 * d * d, V = A * h;
        return {
            type: 'num',
            q: 'Ein runder Warmwasserspeicher ist innen <strong>' + de(d) + ' m</strong> breit (Durchmesser) und <strong>' + de(h) + ' m</strong> hoch. Wie viele Liter fasst er?',
            note: 'Formeln: A = π/4 · d² und V = A · h. 1 m³ = 1000 l. Runde A auf drei Nachkommastellen.',
            fields: [
                { label: 'Grundfläche A', unit: 'm²', ans: T(A), tol: 2 },
                // V in m³ und in l gleich streng: 1 % Spielraum (π = 3,14 oder Taste, A auf drei Stellen gerundet)
                { label: 'Volumen V', unit: 'm³', ans: T(V), tol: Math.round(T(V) * 0.01) + 1 },
                { label: 'Volumen V', unit: 'l', ans: T(V * 1000), tol: (Math.round(T(V) * 0.01) + 1) * 1000, errors: [{ v: T(V * 100), msg: '1 m³ = 1000 l.' }] }
            ],
            hint: 'Erst die Kreisfläche A, auf drei Nachkommastellen gerundet. Dann V = A · h. Dann mal 1000.',
            explanation: 'A = π/4 · (' + de(d) + ' m)² ≈ ' + de(A, 3) + ' m².<br>V = ' + de(A, 3) + ' m² · ' + de(h) + ' m ≈ ' + de(V, 3) + ' m³ ≈ <strong>' + de(Math.round(V * 1000)) + ' l</strong>.'
        };
    },
    function () {
        const l = rnd([1, 1.5, 2]), b = rnd([0.7, 0.8, 1]), h = rnd([1, 1.5]);
        const V = l * b * h * 1000;
        const drin = Math.round(V * rnd([0.2, 0.3, 0.4, 0.6]) / 50) * 50;
        return {
            type: 'num',
            q: 'Ein Heizöltank (Quader) ist <strong>' + de(l) + ' m</strong> lang, <strong>' + de(b) + ' m</strong> breit und <strong>' + de(h) + ' m</strong> hoch. Es sind noch <strong>' + drin + ' l</strong> Öl drin. Wie viele Liter passen noch hinein?',
            note: 'Rechne mit dem vollen Tank. In echt füllt man einen Tank nie ganz voll.',
            fields: [
                { label: 'Tank voll', unit: 'l', ans: T(V), errors: [{ v: T(V / 1000), msg: 'Das ist in m³. Rechne in Liter um: · 1000.' }] },
                { label: 'passt noch hinein', unit: 'l', ans: T(V - drin), errors: [{ v: T(V + drin), msg: 'Zieh die Liter ab, die schon drin sind.' }] }
            ],
            hint: 'V = l · b · h in m³, dann mal 1000. Dann die vorhandene Menge abziehen.',
            explanation: 'V = ' + de(l) + ' · ' + de(b) + ' · ' + de(h) + ' = ' + de(V / 1000) + ' m³ = <strong>' + de(V) + ' l</strong>.<br>' + de(V) + ' l − ' + drin + ' l = <strong>' + de(V - drin) + ' l</strong>.'
        };
    },
    function () {
        const L = rnd([5, 6]), s = rnd([35, 45, 65, 85, 120, 135, 70, 95]);
        const n = Math.floor(L * 100 / s), rest = L * 100 - n * s;
        return {
            type: 'num',
            q: 'Aus einer <strong>' + L + ' m</strong> langen Rohrstange sollen möglichst viele Stücke mit <strong>' + s + ' cm</strong> Länge gesägt werden. Wie viele Stücke bekommst du? Wie lang ist der Rest?',
            note: 'Den Verlust durch das Sägen lassen wir weg.',
            fields: [
                { label: 'Anzahl Stücke', unit: 'Stück', ans: T(n), errors: [{ v: T(n + 1), msg: 'Das letzte Stück wäre zu kurz. Runde hier immer ab.' }] },
                { label: 'Rest', unit: 'cm', ans: T(rest) }
            ],
            hint: L + ' m = ' + (L * 100) + ' cm. Teile durch ' + s + ' cm. Nur ganze Stücke zählen.',
            explanation: L * 100 + ' cm : ' + s + ' cm = ' + de(L * 100 / s, 2) + ' → <strong>' + n + ' Stücke</strong>.<br>' +
                         n + ' · ' + s + ' cm = ' + (n * s) + ' cm. Rest: ' + (L * 100) + ' cm − ' + (n * s) + ' cm = <strong>' + rest + ' cm</strong>.'
        };
    }
]
};
