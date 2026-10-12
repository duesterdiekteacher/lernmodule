// =====================================================================
// Aufgaben für das Modul "Werkstoffe im SHK-Handwerk und ihre Einteilung"
// Hilfsfunktionen aus engine.js. Zahlen bei num-Feldern: ans in Tausendsteln
// der Einheit (8,93 kg/dm³ -> 8930). tol = erlaubter Spielraum, weil die
// Dichtewerte in verschiedenen Tabellenbüchern leicht abweichen.
// Keine Seitenzahlen nennen: Das Modul soll mit jeder Auflage funktionieren.
// =====================================================================

const UNLOCK_TEXT = {
    5: 'Mehrschichtverbundrohr, Keramik, Glas und Hanf. Und: Findest du den Fehler?',
    6: 'Den passenden Werkstoff wählen. Fließregel. Masse mit dem Tabellenbuch berechnen.'
};

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

// ---------- Skizze: Einteilungs-Schema mit Nummern (Modul 1) ----------
// Senkrechter Baum, damit er auch auf dem Handy ganz sichtbar ist (gleiche Form wie im Lerntext)
const BAUM = [
    ['Werkstoffe', 0, ''], ['Metalle', 1, '1'], ['Eisenmetalle', 2, '4'], ['Nichteisenmetalle', 2, '5'],
    ['Schwermetalle', 3, '6'], ['Leichtmetalle', 3, '7'], ['Nichtmetalle', 1, '2'], ['Naturstoffe', 2, ''],
    ['künstliche Stoffe', 2, ''], ['Verbundwerkstoffe', 1, '3']
];
const SVG_BAUM = (function () {
    const F = 'font-family="Segoe UI, Arial"';
    const X = l => 8 + l * 34, Y = r => 8 + r * 42;
    let lines = '', boxes = '';
    BAUM.forEach((row, r) => {
        const [label, l, nr] = row;
        if (l > 0) {
            let pr = r - 1; while (BAUM[pr][1] !== l - 1) pr--;
            const px = X(l - 1) + 14;
            lines += '<path d="M' + px + ' ' + (Y(pr) + 32) + ' V' + (Y(r) + 16) + ' H' + X(l) + '" fill="none" stroke="#64748b" stroke-width="2"/>';
        }
        if (nr) boxes += '<rect x="' + X(l) + '" y="' + Y(r) + '" width="70" height="32" rx="8" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>' +
                         '<text x="' + (X(l) + 35) + '" y="' + (Y(r) + 22) + '" fill="#fbbf24" font-size="17" font-weight="bold" text-anchor="middle" ' + F + '>' + nr + '</text>';
        else boxes += '<rect x="' + X(l) + '" y="' + Y(r) + '" width="160" height="32" rx="8" fill="#1e293b" stroke="' + (l ? '#64748b' : '#38bdf8') + '" stroke-width="2"/>' +
                      '<text x="' + (X(l) + 12) + '" y="' + (Y(r) + 21) + '" fill="#f8fafc" font-size="15" ' + F + '>' + label + '</text>';
    });
    return '<svg viewBox="0 0 280 432" style="max-width:340px; min-width:0" role="img" aria-label="Einteilungs-Schema der Werkstoffe mit sieben Nummern">' + lines + boxes + '</svg>';
})();

// ---------- Skizze: Mehrschichtverbundrohr im Schnitt (Modul 5) ----------
const SVG_MVR = (function () {
    const F = 'font-family="Segoe UI, Arial"';
    const c = (x, y, n) => '<circle cx="' + x + '" cy="' + y + '" r="15" fill="#0f172a" stroke="#fbbf24" stroke-width="2"/>' +
        '<text x="' + x + '" y="' + (y + 6) + '" fill="#fbbf24" font-size="16" font-weight="bold" text-anchor="middle" ' + F + '>' + n + '</text>';
    return '<svg viewBox="0 0 520 260" role="img" aria-label="Schnitt durch ein Mehrschichtverbundrohr mit drei Nummern">' +
        '<circle cx="180" cy="130" r="110" fill="#94a3b8"/>' +       // außen Kunststoff
        '<circle cx="180" cy="130" r="88" fill="#e2e8f0"/>' +        // Aluminium
        '<circle cx="180" cy="130" r="80" fill="#cbd5e1"/>' +        // innen Kunststoff
        '<circle cx="180" cy="130" r="58" fill="#0ea5e9" fill-opacity="0.55"/>' +  // Wasser
        '<text x="180" y="136" fill="#f8fafc" font-size="15" text-anchor="middle" ' + F + '>Wasser</text>' +
        '<line x1="180" y1="62" x2="380" y2="62" stroke="#f8fafc" stroke-width="1.5"/>' + c(400, 62, '1') +
        '<line x1="180" y1="46" x2="380" y2="118" stroke="#f8fafc" stroke-width="1.5"/>' + c(400, 125, '2') +
        '<line x1="268" y1="180" x2="380" y2="188" stroke="#f8fafc" stroke-width="1.5"/>' + c(400, 188, '3') +
        '<circle cx="180" cy="62" r="3" fill="#f8fafc"/><circle cx="180" cy="46" r="3" fill="#f8fafc"/><circle cx="268" cy="180" r="3" fill="#f8fafc"/>' +
        '</svg>';
})();

// ---------- Fehler finden: Werkstoffgruppen mit einem falschen Eintrag ----------
const GRUPPEN = [
    { name: 'Eisenmetalle', farbe: '#94a3b8', items: ['unlegierter Stahl', 'Edelstahl', 'Gusseisen', 'C-Stahl'] },
    { name: 'Schwermetalle', farbe: '#f59e0b', items: ['Kupfer', 'Zink', 'Blei', 'Zinn'] },
    { name: 'Leichtmetalle', farbe: '#38bdf8', items: ['Aluminium', 'Magnesium', 'Titan'] },
    { name: 'Kunststoffe', farbe: '#a855f7', items: ['PE-X', 'PP', 'PVC-U', 'EPDM'] },
    { name: 'Verbundwerkstoffe', farbe: '#22c55e', items: ['Mehrschichtverbundrohr', 'GFK', 'Stahlbeton'] }
];
function fehlerTask() {
    const shown = GRUPPEN.map(g => ({ name: g.name, farbe: g.farbe, items: pickN(g.items, 2) }));
    // Der falsche Eintrag kommt nie aus den Verbundwerkstoffen (z. B. GFK bei Kunststoffen wäre strittig).
    const from = rint(0, 3);
    let to; do { to = rint(0, 4); } while (to === from);
    const pool = GRUPPEN[from].items.filter(x => shown[from].items.indexOf(x) < 0);
    const wrong = rnd(pool);
    shown[to].items.splice(rint(0, 2), 0, wrong);
    let h = '<div class="groups">';
    shown.forEach(g => {
        h += '<div class="group" style="border-color:' + g.farbe + '"><div class="group-name" style="color:' + g.farbe + '">' + g.name + '</div>' +
             g.items.map(i => '<div class="group-item">' + i + '</div>').join('') + '</div>';
    });
    h += '</div>';
    const others = shuffle(shown.flatMap(g => g.items).filter(i => i !== wrong)).slice(0, 3);
    const opts = shuffle([wrong].concat(others));
    return {
        type: 'mc', svg: h,
        q: 'Ein Schüler hat die Werkstoffe einsortiert. Ein Werkstoff steht in der falschen Gruppe. Welcher?',
        options: opts, correct: opts.indexOf(wrong),
        hint: 'Prüfe jede Gruppe einzeln. Eisenmetall oder nicht? Dichte über oder unter 5 kg/dm³? Metall oder Kunststoff?',
        explanation: '<strong>' + wrong + '</strong> gehört nicht zu den ' + GRUPPEN[to].name + ', sondern zu den <strong>' + GRUPPEN[from].name + '</strong>.'
    };
}

// ---------- Dichte (Werte schwanken je nach Tabellenbuch, daher tol) ----------
// rho und tol in Tausendsteln kg/dm³
const DICHTE = {
    Kupfer:      { rho: 8930, tol: 40 },   // 8,89 ... 8,97
    Stahl:       { rho: 7850, tol: 50 },   // 7,80 ... 7,90
    Edelstahl:   { rho: 7950, tol: 60 },   // 7,89 ... 8,01
    Aluminium:   { rho: 2700, tol: 20 },   // 2,68 ... 2,72
    Zink:        { rho: 7130, tol: 70 }    // 7,06 ... 7,20 (auch Titanzink 7,2)
};
const BOOK_RHO = 'Suche die Dichte in deinem Tabellenbuch. Tipp: Sachwortverzeichnis unter „Dichte“.';
function kg(x) { return num((x / 1000).toFixed(2)); }       // Tausendstel -> "12,34"
function rhoTxt(name) { return num((DICHTE[name].rho / 1000).toFixed(2)); }

function blechTask() {
    const art = rnd([['Kupfer', 'Kupferblech'], ['Zink', 'Titanzinkblech'], ['Aluminium', 'Aluminiumblech'], ['Stahl', 'Stahlblech']]);
    const l = rnd([1000, 1500, 2000, 2500, 3000]);           // mm
    const b = rnd([500, 600, 800, 1000]);                    // mm
    const s = rnd([6, 7, 8, 10, 12, 15, 20]);                // Zehntel mm
    const V = l * b * s / 10000;                             // Tausendstel dm³ (exakt)
    const d = DICHTE[art[0]];
    const m = V * d.rho / 1000;                              // Tausendstel kg
    const mTol = Math.round(V * d.tol / 1000) + 20;
    return {
        type: 'num', book: true,
        q: 'Ein <strong>' + art[1] + '</strong> ist ' + num(l / 1000) + ' m lang, ' + num(b / 1000) + ' m breit und ' + num(s / 10) +
           ' mm dick. Berechne das Volumen und die Masse.',
        note: 'Rechne in dm: 1 m = 10 dm, 1 mm = 0,01 dm. Runde die Masse auf zwei Nachkommastellen. ' + BOOK_RHO,
        fields: [
            { label: 'Volumen V', unit: 'dm³', ans: V, tol: 5,
              errors: [{ v: V * 1000, msg: 'Rechne alle Maße zuerst in dm um.' }, { v: V * 100, msg: 'Prüfe die Dicke: 1 mm = 0,01 dm.' }] },
            { label: 'Dichte ρ (' + (art[0] === 'Zink' ? 'Zink' : art[0]) + ')', unit: 'kg/dm³', ans: d.rho, tol: d.tol },
            { label: 'Masse m', unit: 'kg', ans: m, tol: mTol }
        ],
        hint: 'V = Länge · Breite · Dicke, alles in dm. Dann m = V · ρ.',
        explanation: 'V = ' + num(l / 100) + ' dm · ' + num(b / 100) + ' dm · ' + num(s / 1000) + ' dm = <strong>' + num(V / 1000) + ' dm³</strong>.<br>' +
                     'ρ ≈ ' + rhoTxt(art[0]) + ' kg/dm³.<br>m = ' + num(V / 1000) + ' dm³ · ' + rhoTxt(art[0]) + ' kg/dm³ ≈ <strong>' + kg(m) + ' kg</strong>.' +
                     '<br><span style="color:#94a3b8;">Steht in deinem Buch ein etwas anderer Wert, ist das auch richtig.</span>'
    };
}

function rohrTask() {
    const ROHRE = {
        Kupfer: [[15, 1], [18, 1], [22, 1], [28, 1.5]],
        Stahl: [[15, 1.2], [18, 1.2], [22, 1.5], [28, 1.5]],
        Edelstahl: [[15, 1], [18, 1], [22, 1.2], [28, 1.2]]
    };
    const name = rnd(Object.keys(ROHRE));
    const [D, s] = rnd(ROHRE[name]);
    const stangen = rint(4, 20);
    const L = stangen * 6;                                   // m (Stangen à 6 m)
    const di = D - 2 * s;
    const Vexakt = Math.PI / 4 * (D * D - di * di) * L / 1000;   // dm³
    const V = Math.round(Vexakt * 100) * 10;                 // Tausendstel, gerundet auf 0,01 dm³
    const d = DICHTE[name];
    const m = V * d.rho / 1000;
    const mTol = Math.round(V * d.tol / 1000) + 20;
    const roh = name === 'Stahl' ? 'C-Stahl-Rohre' : name + 'rohre';
    return {
        type: 'num', book: true,
        q: 'Für eine Baustelle werden <strong>' + stangen + ' Stangen ' + roh + ' ' + D + ' × ' + num(s) + '</strong> geliefert. Jede Stange ist 6 m lang. ' +
           'Das Material aller Rohre hat zusammen ein Volumen von <strong>' + num(V / 1000) + ' dm³</strong>. Wie schwer ist die Lieferung?',
        note: 'Runde die Masse auf zwei Nachkommastellen. ' + BOOK_RHO + (name === 'Stahl' ? ' C-Stahl ist unlegierter Stahl.' : ''),
        fields: [
            { label: 'Dichte ρ (' + (name === 'Stahl' ? 'unlegierter Stahl' : name) + ')', unit: 'kg/dm³', ans: d.rho, tol: d.tol },
            { label: 'Masse m', unit: 'kg', ans: m, tol: mTol }
        ],
        hint: 'm = V · ρ. Das Volumen ist schon in dm³ angegeben. Dann kommt die Masse in kg heraus.',
        explanation: 'ρ ≈ ' + rhoTxt(name) + ' kg/dm³.<br>m = ' + num(V / 1000) + ' dm³ · ' + rhoTxt(name) + ' kg/dm³ ≈ <strong>' + kg(m) + ' kg</strong>.' +
                     '<br><span style="color:#94a3b8;">Steht in deinem Buch ein etwas anderer Wert, ist das auch richtig.</span>'
    };
}

// =====================================================================
const TASKS = {
// ---------------------------------------------------------------- Modul 1
1: [
    {
        type: 'match', shuffle: false, svg: SVG_BAUM,
        q: 'Das Schema zeigt die Einteilung der Werkstoffe. Welcher Begriff gehört zu welcher Nummer?',
        options: ['Metalle', 'Nichtmetalle', 'Verbundwerkstoffe', 'Eisenmetalle', 'Nichteisenmetalle', 'Schwermetalle', 'Leichtmetalle'],
        items: [
            { left: 'Nummer 1', answer: 'Metalle' }, { left: 'Nummer 2', answer: 'Nichtmetalle' },
            { left: 'Nummer 3', answer: 'Verbundwerkstoffe' }, { left: 'Nummer 4', answer: 'Eisenmetalle' },
            { left: 'Nummer 5', answer: 'Nichteisenmetalle',
              errors: [{ v: 'Eisenmetalle', msg: 'Unter Nummer 5 hängen Schwer- und Leichtmetalle. Das sind keine Eisenmetalle.' }] },
            { left: 'Nummer 6', answer: 'Schwermetalle' }, { left: 'Nummer 7', answer: 'Leichtmetalle' }
        ],
        hint: 'Ganz links stehen die drei großen Gruppen. Unter den Nichtmetallen stehen schon Naturstoffe und künstliche Stoffe. Die Metalle teilt man nach Eisen auf, die Nichteisenmetalle nach der Dichte.',
        explanation: '1 Metalle, 2 Nichtmetalle, 3 Verbundwerkstoffe. Metalle: 4 Eisenmetalle und 5 Nichteisenmetalle. Nichteisenmetalle: 6 Schwermetalle und 7 Leichtmetalle.'
    },
    function () {
        const met = ['Kupfer', 'Stahl', 'Aluminium', 'Zink', 'Gusseisen'];
        const nm = ['PE-X', 'Glas', 'Sanitärkeramik', 'Holz', 'Hanf', 'PVC-U'];
        const vb = ['Mehrschichtverbundrohr', 'GFK', 'Stahlbeton'];
        const items = shuffle([
            ...pickN(met, 2).map(x => ({ left: x, answer: 'Metall' })),
            ...pickN(nm, 2).map(x => ({ left: x, answer: 'Nichtmetall' })),
            ...pickN(vb, 1).map(x => ({ left: x, answer: 'Verbundwerkstoff' }))
        ]);
        return {
            type: 'match', q: 'Zu welcher Hauptgruppe gehört der Werkstoff?', options: ['Metall', 'Nichtmetall', 'Verbundwerkstoff'], items,
            hint: 'Kunststoffe, Glas und Keramik sind Nichtmetalle. Ein Verbundwerkstoff besteht aus mehreren Werkstoffen, die fest verbunden sind.',
            explanation: 'Metalle: z. B. Kupfer, Stahl, Aluminium. Nichtmetalle: z. B. Kunststoffe, Glas, Keramik, Holz, Hanf. Verbundwerkstoffe: z. B. Mehrschichtverbundrohr, GFK, Stahlbeton.'
        };
    },
    {
        type: 'mc',
        q: 'Was ist ein Verbundwerkstoff?',
        options: ['Ein Metall, das aus einem einzigen Element besteht.',
                  'Mehrere verschiedene Werkstoffe, die fest miteinander verbunden sind.',
                  'Zwei Rohre, die mit einem Fitting verbunden sind.',
                  'Ein Kunststoff, der beim Erwärmen weich wird.'],
        correct: 1,
        hint: 'Denk an das Mehrschichtverbundrohr: Kunststoff und Aluminium in einem Rohr.',
        explanation: 'Ein Verbundwerkstoff besteht aus zwei oder mehr Werkstoffen. Sie sind fest verbunden. So kombiniert man die guten Eigenschaften.'
    },
    richtigFalsch([
        { left: 'Kupfer ist ein Nichteisenmetall.', answer: 'richtig' },
        { left: 'Stahl ist ein Nichteisenmetall.', answer: 'falsch' },
        { left: 'Kunststoffe gehören zu den Metallen.', answer: 'falsch' },
        { left: 'Ein Verbundwerkstoff besteht aus mindestens zwei verschiedenen Werkstoffen.', answer: 'richtig' },
        { left: 'Leichtmetalle haben eine Dichte unter 5 kg/dm³.', answer: 'richtig' },
        { left: 'Aluminium ist ein Schwermetall.', answer: 'falsch' },
        { left: 'Gusseisen ist ein Eisenmetall.', answer: 'richtig' },
        { left: 'Glas ist ein Metall.', answer: 'falsch' }
    ], 5, 'Merke: Eisenmetalle haben Eisen als Hauptbestandteil. Alle anderen Metalle sind Nichteisenmetalle. Die Grenze zwischen Leicht- und Schwermetall liegt bei 5 kg/dm³.')
],
// ---------------------------------------------------------------- Modul 2
2: [
    function () {
        const st = [{ left: 'Kohlenstoff bis etwa 2 %', answer: 'Stahl' }, { left: 'zäh und gut verformbar', answer: 'Stahl' },
                    { left: 'gut schweißbar', answer: 'Stahl' }];
        const ge = [{ left: 'Kohlenstoff über 2 %', answer: 'Gusseisen' }, { left: 'spröde, kann bei einem Schlag brechen', answer: 'Gusseisen' },
                    { left: 'dämpft Geräusche gut', answer: 'Gusseisen' }];
        return {
            type: 'match', q: 'Stahl oder Gusseisen? Welche Eigenschaft passt?', options: ['Stahl', 'Gusseisen'],
            items: shuffle(pickN(st, 2).concat(pickN(ge, 2))),
            hint: 'Der Kohlenstoff macht den Unterschied. Viel Kohlenstoff macht das Eisen hart und spröde.',
            explanation: 'Stahl: bis etwa 2 % Kohlenstoff, zäh, verformbar, schweißbar. Gusseisen: über 2 % Kohlenstoff, spröde, gut gießbar, dämpft Schall.'
        };
    },
    function () {
        const all = [
            { left: 'SML-Abwasserrohr', answer: 'Gusseisen' },
            { left: 'Glieder eines Gussheizkessels', answer: 'Gusseisen' },
            { left: 'Plattenheizkörper', answer: 'unlegierter Stahl' },
            { left: 'C-Stahl-Rohr für die Heizung', answer: 'unlegierter Stahl' },
            { left: 'rostfreies Pressrohr für Trinkwasser', answer: 'Edelstahl' },
            { left: 'Duschrinne', answer: 'Edelstahl' }
        ];
        const items = ['Gusseisen', 'unlegierter Stahl', 'Edelstahl'].map(a => rnd(all.filter(x => x.answer === a)));
        const rest = all.filter(x => items.indexOf(x) < 0);
        return {
            type: 'match', q: 'Aus welchem Eisenmetall ist das Bauteil meistens?', options: ['Gusseisen', 'unlegierter Stahl', 'Edelstahl'],
            items: shuffle(items.concat(pickN(rest, 2))),
            hint: 'Gusseisen ist schwer und leise. Edelstahl rostet nicht. Unlegierter Stahl ist preiswert, rostet aber in sauerstoffreichem Wasser.',
            explanation: 'Gusseisen: SML-Rohre, Gussheizkessel. Unlegierter Stahl: Heizkörper, C-Stahl-Rohre für die Heizung. Edelstahl: Trinkwasser-Pressrohre, Duschrinnen.'
        };
    },
    {
        type: 'mc',
        q: 'Warum darf man C-Stahl-Rohre (unlegierter Stahl) <strong>nicht</strong> für Trinkwasser verwenden?',
        options: ['Weil C-Stahl zu schwer ist.',
                  'Weil Trinkwasser viel Sauerstoff enthält. Das Rohr würde innen rosten.',
                  'Weil man C-Stahl nicht pressen kann.',
                  'Weil C-Stahl ein Nichteisenmetall ist.'],
        correct: 1,
        hint: 'Rost entsteht aus Eisen, Wasser und Sauerstoff. Wo ist viel Sauerstoff drin: im Heizungswasser oder im Trinkwasser?',
        explanation: 'Frisches Trinkwasser enthält viel Sauerstoff. Unlegierter Stahl würde innen rosten. Im geschlossenen Heizkreis ist kaum Sauerstoff. Dort ist C-Stahl gut geeignet.'
    },
    richtigFalsch([
        { left: 'Edelstahl ist ein Eisenmetall.', answer: 'richtig' },
        { left: 'Bei Eisenmetallen ist Eisen der Hauptbestandteil.', answer: 'richtig' },
        { left: 'Gusseisen enthält weniger Kohlenstoff als Stahl.', answer: 'falsch' },
        { left: 'Edelstahl rostet nicht, weil er viel Chrom enthält.', answer: 'richtig' },
        { left: 'Gusseisen ist zäh und lässt sich gut biegen.', answer: 'falsch' },
        { left: 'C-Stahl ist für Trinkwasser geeignet.', answer: 'falsch' }
    ], 5, 'Edelstahl ist ein legierter Stahl und damit ein Eisenmetall. Das Chrom bildet eine dünne Schutzschicht. Gusseisen hat mehr Kohlenstoff als Stahl und ist spröde.')
],
// ---------------------------------------------------------------- Modul 3
3: [
    function () {
        const all = [
            ['Aluminium', '2,7', 'Leichtmetall'], ['Magnesium', '1,7', 'Leichtmetall'], ['Titan', '4,5', 'Leichtmetall'],
            ['Kupfer', '8,9', 'Schwermetall'], ['Zink', '7,1', 'Schwermetall'], ['Blei', '11,3', 'Schwermetall'],
            ['Zinn', '7,3', 'Schwermetall'], ['Nickel', '8,9', 'Schwermetall'], ['Chrom', '7,2', 'Schwermetall']
        ].map(x => ({ left: x[0] + ' (Dichte ' + x[1] + ' kg/dm³)', answer: x[2] }));
        const leicht = all.filter(x => x.answer === 'Leichtmetall'), schwer = all.filter(x => x.answer === 'Schwermetall');
        const nl = rint(2, 3);
        return {
            type: 'match', q: 'Leichtmetall oder Schwermetall? Achte auf die Dichte.', options: ['Leichtmetall', 'Schwermetall'],
            items: shuffle(pickN(leicht, nl).concat(pickN(schwer, 5 - nl))),
            hint: 'Die Grenze liegt bei 5 kg/dm³. Darunter: Leichtmetall. Darüber: Schwermetall.',
            explanation: 'Unter 5 kg/dm³: Leichtmetalle (Aluminium, Magnesium, Titan). Über 5 kg/dm³: Schwermetalle (Kupfer, Zink, Blei, Zinn, Nickel, Chrom).'
        };
    },
    {
        type: 'match',
        q: 'Viele Armaturen und Fittings sind aus einer Kupferlegierung. Woraus besteht die Legierung?',
        options: ['Kupfer + Zink', 'Kupfer + Zinn', 'Kupfer + Zinn + Zink'],
        items: [{ left: 'Messing', answer: 'Kupfer + Zink' }, { left: 'Bronze', answer: 'Kupfer + Zinn' }, { left: 'Rotguss', answer: 'Kupfer + Zinn + Zink' }],
        hint: 'Messing ist gelb und enthält Zink. Bronze enthält Zinn. Rotguss enthält beides.',
        explanation: 'Messing = Kupfer + Zink. Bronze = Kupfer + Zinn. Rotguss = Kupfer + Zinn + Zink (oft mit etwas Blei).'
    },
    function () {
        const all = [
            { left: 'Trinkwasser- und Heizungsrohre, gut lötbar', answer: 'Kupfer' },
            { left: 'Dachrinne aus Titanzink', answer: 'Zink' },
            { left: 'Rostschutz-Schicht auf Stahlrohren', answer: 'Zink' },
            { left: 'Mittelschicht im Mehrschichtverbundrohr', answer: 'Aluminium' },
            { left: 'sehr leichter Heizkörper', answer: 'Aluminium' },
            { left: 'Gehäuse von Armaturen und Fittings', answer: 'Messing' }
        ];
        const base = ['Kupfer', 'Zink', 'Aluminium', 'Messing'].map(a => rnd(all.filter(x => x.answer === a)));
        const rest = all.filter(x => base.indexOf(x) < 0);
        return {
            type: 'match', q: 'Welches Nichteisenmetall wird hier verwendet?', options: ['Kupfer', 'Zink', 'Aluminium', 'Messing'],
            items: shuffle(base.concat(pickN(rest, 1))),
            hint: 'Zink schützt Stahl vor Rost. Aluminium ist sehr leicht. Messing ist eine Kupferlegierung für Armaturen.',
            explanation: 'Kupfer: Rohre. Zink: Verzinkung und Dachrinnen. Aluminium: Verbundrohr und leichte Heizkörper. Messing: Armaturen und Fittings.'
        };
    },
    {
        type: 'mc',
        q: 'Warum verlegt man heute keine Trinkwasserleitungen aus Blei mehr?',
        options: ['Weil Blei zu leicht ist.', 'Weil Blei giftig ist. Es kann sich im Wasser lösen.',
                  'Weil Blei zu teuer ist.', 'Weil Blei ein Eisenmetall ist.'],
        correct: 1,
        hint: 'Denk an die Gesundheit der Menschen, die das Wasser trinken.',
        explanation: 'Blei ist giftig. Es löst sich im Trinkwasser. Deshalb sind Bleileitungen für Trinkwasser nicht mehr erlaubt. Alte Bleileitungen müssen ausgetauscht werden.'
    }
],
// ---------------------------------------------------------------- Modul 4
4: [
    function () {
        const T = 'Thermoplast', D = 'Duroplast', E = 'Elastomer';
        const all = [
            { left: 'wird beim Erwärmen weich und formbar', answer: T }, { left: 'kann man meistens schweißen', answer: T },
            { left: 'bleibt nach dem Aushärten hart, auch bei Wärme', answer: D }, { left: 'kann man nicht mehr verformen und nicht schweißen', answer: D },
            { left: 'gummielastisch, geht nach dem Dehnen in die Form zurück', answer: E }, { left: 'gut für Dichtungen', answer: E }
        ];
        return {
            type: 'match', q: 'Welche Kunststoffgruppe hat diese Eigenschaft?', options: [T, D, E],
            items: (function () {
                const base = [T, D, E].map(g => rnd(all.filter(x => x.answer === g)));
                return shuffle(base.concat(pickN(all.filter(x => base.indexOf(x) < 0), 1)));
            })(),
            hint: 'Thermo heißt Wärme: wird bei Wärme weich. Duro heißt hart. Elastisch heißt dehnbar wie Gummi.',
            explanation: 'Thermoplaste werden bei Wärme weich. Duroplaste bleiben hart. Elastomere sind gummielastisch.'
        };
    },
    function () {
        const T = 'Thermoplast', D = 'Duroplast', E = 'Elastomer';
        const all = [
            { left: 'PE-X-Rohr für die Fußbodenheizung', answer: T }, { left: 'HT-Abwasserrohr aus PP', answer: T },
            { left: 'KG-Rohr aus PVC-U', answer: T },
            { left: 'O-Ring aus EPDM im Pressfitting', answer: E }, { left: 'Gummischlauch', answer: E },
            { left: 'WC-Sitz aus Melaminharz', answer: D }, { left: 'Beschichtung aus Epoxidharz', answer: D }
        ];
        const base = [T, D, E].map(g => rnd(all.filter(x => x.answer === g)));
        const rest = all.filter(x => base.indexOf(x) < 0);
        return {
            type: 'match', q: 'Zu welcher Kunststoffgruppe gehört das Bauteil?', options: [T, D, E],
            items: shuffle(base.concat(pickN(rest, 2))),
            hint: 'Fast alle Kunststoffrohre sind Thermoplaste. Dichtungen sind Elastomere. Harze härten aus: Duroplaste.',
            explanation: 'Rohre aus PE-X, PP und PVC-U: Thermoplaste. EPDM und Gummi: Elastomere. Melaminharz und Epoxidharz: Duroplaste.'
        };
    },
    {
        type: 'match',
        q: 'Was bedeuten die Kurzzeichen?',
        options: ['Polyethylen', 'Polypropylen', 'Polyvinylchlorid, hart (ohne Weichmacher)', 'vernetztes Polyethylen', 'Gummi für Dichtungen'],
        items: [
            { left: 'PE', answer: 'Polyethylen' }, { left: 'PP', answer: 'Polypropylen' },
            { left: 'PVC-U', answer: 'Polyvinylchlorid, hart (ohne Weichmacher)' },
            { left: 'PE-X', answer: 'vernetztes Polyethylen', errors: [{ v: 'Polyethylen', msg: 'Das X steht für „vernetzt“.' }] },
            { left: 'EPDM', answer: 'Gummi für Dichtungen' }
        ],
        hint: 'PE und PP sind die „Poly“-Kunststoffe. Das X steht für „vernetzt“, das U für „ohne Weichmacher“.',
        explanation: 'PE = Polyethylen, PP = Polypropylen, PVC-U = hartes PVC ohne Weichmacher, PE-X = vernetztes PE, EPDM = synthetischer Kautschuk für Dichtungen.'
    },
    {
        type: 'mc',
        q: 'Warum kann man Rohre aus PP oder PE schweißen, aber Duroplaste nicht?',
        options: ['Weil Thermoplaste beim Erwärmen weich werden und danach wieder fest.',
                  'Weil Duroplaste aus Metall sind.',
                  'Weil Thermoplaste nicht brennen können.',
                  'Weil Duroplaste zu weich sind.'],
        correct: 0,
        hint: 'Schweißen heißt: erwärmen, zusammendrücken, abkühlen lassen.',
        explanation: 'Thermoplaste werden bei Wärme weich. Die Teile fließen zusammen und werden beim Abkühlen wieder fest. Duroplaste bleiben hart. Bei starker Hitze zersetzen sie sich.'
    },
    richtigFalsch([
        { left: 'Thermoplaste werden beim Erwärmen weich.', answer: 'richtig' },
        { left: 'Duroplaste kann man schweißen.', answer: 'falsch' },
        { left: 'EPDM ist ein Elastomer.', answer: 'richtig' },
        { left: 'PVC-U ist ein Duroplast.', answer: 'falsch' },
        { left: 'PE-X ist ein Thermoplast.', answer: 'richtig' },
        { left: 'PE-X kann man genauso schweißen wie PE.', answer: 'falsch' },
        { left: 'Kunststoffe gehören zu den Nichtmetallen.', answer: 'richtig' }
    ], 5, 'PE-X ist ein Thermoplast. Weil es vernetzt ist, kann man es nicht schweißen. Man verbindet es mit Press- oder Klemmverbindern.')
],
// ---------------------------------------------------------------- Modul 5
5: [
    {
        type: 'match', shuffle: false, svg: SVG_MVR,
        q: 'Die Skizze zeigt ein Mehrschichtverbundrohr im Schnitt. Welche Schicht ist welche?',
        options: ['Innenschicht aus Kunststoff', 'Mittelschicht aus Aluminium', 'Außenschicht aus Kunststoff'],
        items: [{ left: 'Nummer 1', answer: 'Innenschicht aus Kunststoff' }, { left: 'Nummer 2', answer: 'Mittelschicht aus Aluminium' },
                { left: 'Nummer 3', answer: 'Außenschicht aus Kunststoff' }],
        hint: 'Die dünne helle Schicht in der Mitte ist das Metall. Die Innenschicht berührt das Wasser.',
        explanation: '1 Innenschicht aus Kunststoff (berührt das Wasser), 2 Mittelschicht aus Aluminium, 3 Außenschicht aus Kunststoff.'
    },
    function () {
        const I = 'Innenschicht (Kunststoff)', A = 'Mittelschicht (Aluminium)', O = 'Außenschicht (Kunststoff)';
        const all = [
            { left: 'hält das Rohr nach dem Biegen in Form', answer: A }, { left: 'lässt keinen Sauerstoff durch', answer: A },
            { left: 'sorgt für geringe Längenausdehnung', answer: A },
            { left: 'hat Kontakt zum Wasser und korrodiert nicht', answer: I },
            { left: 'schützt das Aluminium von außen', answer: O }
        ];
        const items = [rnd(all.filter(x => x.answer === A)), all[3], all[4]];
        return {
            type: 'match', q: 'Welche Schicht hat welche Aufgabe?', options: [I, A, O], items: shuffle(items),
            hint: 'Das Metall macht das Rohr stabil und dicht. Der Kunststoff schützt innen und außen.',
            explanation: 'Aluminium: formstabil, sauerstoffdicht, wenig Ausdehnung. Kunststoff innen: berührt das Wasser, korrodiert nicht. Kunststoff außen: Schutz.'
        };
    },
    function () {
        const N = 'Naturstoff', K = 'künstlicher Stoff', V = 'Verbundwerkstoff';
        const all = [
            { left: 'Hanf zum Abdichten von Gewinden', answer: N }, { left: 'Holz', answer: N }, { left: 'Naturstein', answer: N },
            { left: 'Sanitärkeramik (WC, Waschtisch)', answer: K }, { left: 'Glas einer Duschwand', answer: K },
            { left: 'Mineralwolle zur Dämmung', answer: K },
            { left: 'Mehrschichtverbundrohr', answer: V }, { left: 'GFK (glasfaserverstärkter Kunststoff)', answer: V },
            { left: 'Stahlbeton', answer: V }
        ];
        const base = [N, K, V].map(g => rnd(all.filter(x => x.answer === g)));
        const rest = all.filter(x => base.indexOf(x) < 0);
        return {
            type: 'match', q: 'Naturstoff, künstlicher Stoff oder Verbundwerkstoff?', options: [N, K, V],
            items: shuffle(base.concat(pickN(rest, 2))),
            hint: 'Naturstoffe wachsen oder kommen so in der Natur vor. Künstliche Stoffe stellt der Mensch her. Verbundwerkstoffe bestehen aus mehreren Werkstoffen.',
            explanation: 'Naturstoffe: Hanf, Holz, Naturstein. Künstliche Stoffe: Keramik, Glas, Mineralwolle. Verbundwerkstoffe: Mehrschichtverbundrohr, GFK, Stahlbeton.'
        };
    },
    {
        type: 'mc',
        q: 'Was ist ein Vorteil vom Mehrschichtverbundrohr gegenüber einem reinen Kunststoffrohr?',
        options: ['Es ist komplett aus Metall.',
                  'Es bleibt nach dem Biegen in Form und dehnt sich weniger aus.',
                  'Man kann es schweißen.',
                  'Es ist schwerer und dadurch stabiler.'],
        correct: 1,
        hint: 'Was macht die Aluminiumschicht?',
        explanation: 'Die Aluminiumschicht hält das Rohr in Form. Es dehnt sich bei Wärme weniger aus als ein reines Kunststoffrohr. Und es lässt keinen Sauerstoff durch.'
    },
    fehlerTask
],
// ---------------------------------------------------------------- Modul 6
6: [
    function () {
        const all = [['Magnesium', 1740], ['Aluminium', 2700], ['Titan', 4500], ['Zink', 7130], ['Stahl', 7850], ['Kupfer', 8930], ['Blei', 11340]];
        const sel = pickN(all, 4).sort((a, b) => a[1] - b[1]);
        return {
            type: 'order', book: true,
            q: 'Sortiere die Metalle nach ihrer Dichte. Das leichteste kommt nach oben. Schlage die Werte im Tabellenbuch nach.',
            note: 'Bringe die Metalle mit ▲ und ▼ in die richtige Reihenfolge. ' + BOOK_RHO,
            steps: sel.map(x => x[0]),
            hint: 'Schreibe dir zu jedem Metall die Dichte auf. Dann sortieren.',
            explanation: sel.map(x => x[0] + ' (etwa ' + num((x[1] / 1000).toFixed(2)) + ' kg/dm³)').join(' → ')
        };
    },
    blechTask,
    rohrTask,
    function () {
        const E = 'erlaubt', N = 'nicht erlaubt';
        const all = [
            { left: 'verzinkter Stahl → Kupfer', answer: E },
            { left: 'Kupfer → verzinkter Stahl', answer: N },
            { left: 'Kupfer → Edelstahl', answer: E },
            { left: 'Edelstahl → Kupfer', answer: E },
            { left: 'Kupfer → Kunststoff', answer: E },
            { left: 'Kupfer → Kunststoff → verzinkter Stahl', answer: N }
        ];
        const items = shuffle(pickN(all.filter(x => x.answer === N), 1).concat(pickN(all.filter(x => x.answer === E), 3)));
        return {
            type: 'match', q: 'Trinkwasser fließt in Pfeilrichtung (→) durch die Rohre. Ist die Reihenfolge der Werkstoffe erlaubt?',
            options: [E, N], items,
            hint: 'Fließregel: Kupfer darf nicht vor verzinktem Stahl liegen. Das gilt auch, wenn ein anderes Rohr dazwischen ist.',
            explanation: 'Wasser nimmt kleine Kupferteilchen mit. Treffen sie danach auf verzinkten Stahl, rostet der Stahl durch (Lochfraß). Deshalb: <strong>verzinkter Stahl nie in Fließrichtung hinter Kupfer</strong>.'
        };
    },
    function () {
        const all = [
            { left: 'Trinkwasserleitung aus Metall, die man löten kann', answer: 'Kupfer' },
            { left: 'Rohr für die Fußbodenheizung: biegsam, lange Stücke ohne Verbindung', answer: 'PE-X' },
            { left: 'Abwasserrohr im Haus: leicht, preiswert, steckbar', answer: 'PP' },
            { left: 'Abwasserrohr: besonders leise und nicht brennbar', answer: 'Gusseisen' },
            { left: 'Heizungsrohr mit Pressfitting, preiswert, nicht für Trinkwasser', answer: 'C-Stahl' },
            { left: 'Dichtring im Pressfitting', answer: 'EPDM' },
            { left: 'Dichtung für ein Gewinde', answer: 'Hanf' }
        ];
        return {
            type: 'match', q: 'Welcher Werkstoff passt am besten zur Anforderung?',
            options: ['Kupfer', 'PE-X', 'PP', 'Gusseisen', 'C-Stahl', 'EPDM', 'Hanf'],
            items: pickN(all, 5),
            hint: 'Lies jede Anforderung genau. Welches Wort passt zu welchem Werkstoff: lötbar, biegsam, leise, Dichtring?',
            explanation: 'Kupfer: lötbar. PE-X: biegsam, lange Rollen. PP: leichte Steckrohre. Gusseisen: leise, nicht brennbar. C-Stahl: Heizung. EPDM: Dichtringe. Hanf: Gewinde.'
        };
    },
    {
        type: 'mc',
        q: 'Ein Kunststoffrohr und ein Kupferrohr werden gleich stark erwärmt. Was passiert?',
        options: ['Beide werden gleich viel länger.',
                  'Das Kunststoffrohr wird viel länger als das Kupferrohr.',
                  'Das Kupferrohr wird viel länger als das Kunststoffrohr.',
                  'Rohre werden bei Wärme nicht länger.'],
        correct: 1,
        hint: 'Denk an die Aluminiumschicht im Verbundrohr. Warum braucht man sie?',
        explanation: 'Kunststoffrohre dehnen sich bei Wärme viel stärker aus als Metallrohre, etwa zehnmal so stark wie Kupfer. Darum plant man bei Kunststoffrohren mehr Platz für die Ausdehnung ein.'
    }
]
};
