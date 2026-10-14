// =====================================================================
// Aufgaben für das Modul "Werkstoffe Metall: Einteilung, Eigenschaften, Auswahl"
// Grundlage: Arbeitsblatt "Einteilung der Werkstoffe" (Lernfeld 1) der Lehrkraft.
// Hilfsfunktionen aus engine.js. num-Felder: ans in Tausendsteln der Einheit
// (8,94 kg/dm³ -> 8940). tol = Spielraum, weil Tabellenbücher leicht abweichen.
// Keine Seitenzahlen nennen. Die Grenze Leicht-/Schwermetall wird in Modul 3
// zuerst nachgeschlagen; Modul 1–3 nennen den Wert im Lerntext nicht.
// =====================================================================

const BASIC_MODULES = [1, 2, 3, 4, 5];
const UNLOCK_TEXT = {
    6: 'Das neue Regal einräumen: Fächer beschriften, Kiste einsortieren, nachzählen.',
    7: 'Den passenden Werkstoff für ein Bauteil wählen und die Wahl begründen.'
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
const BOOK_RHO = 'Schlage im Tabellenbuch nach: Stoffwerte von festen Stoffen, oder im Sachwortverzeichnis unter „Dichte“.';
const BOOK_PSE = 'Schlage im Tabellenbuch beim Periodensystem der Elemente nach. Die Grenze steht in einer Fußnote oder in der Legende.';

// ---------- Die sieben Fächer ----------
const FACH = ['Stähle', 'Eisen-Gusswerkstoffe', 'Schwermetalle', 'Leichtmetalle',
              'Künstliche Nichtmetallwerkstoffe', 'Naturwerkstoffe', 'Verbundwerkstoffe'];
const fachNr = name => FACH.indexOf(name) + 1;

// Teile aus der Kiste: [Bezeichnung, Fach-Index 0..6]
const TEILE = [
    ['Welle aus Vergütungsstahl', 0], ['Bohrer aus Werkzeugstahl', 0], ['Träger aus Baustahl', 0], ['Blech aus nichtrostendem Stahl', 0],
    ['Getriebegehäuse aus Gusseisen', 1], ['Pumpengehäuse aus Stahlguss', 1], ['Maschinenbett aus Gusseisen', 1],
    ['Rundstab aus Kupfer', 2], ['Dachrinnenblech aus Zink', 2], ['Ausgleichsgewicht aus Blei', 2], ['Blech aus Nickel', 2],
    ['Blech aus Aluminium', 3], ['Schrauben aus Titan', 3], ['Gehäuse aus Magnesium', 3],
    ['Zahnräder aus Kunststoff', 4], ['Schauglas aus Glas', 4], ['Schneidplatte aus Keramik', 4],
    ['Unterlegkeile aus Holz', 5], ['Messplatte aus Granit', 5], ['Schmierstift aus Grafit', 5],
    ['Wendeschneidplatten aus Hartmetall', 6], ['Abdeckhaube aus GFK', 6], ['Rohr aus CFK (kohlenstofffaserverstärkter Kunststoff)', 6]
];
// mindestens ein Teil aus jeder Gruppe in pick, Rest zufällig
function teileMix(n) {
    const base = FACH.map((f, i) => rnd(TEILE.filter(t => t[1] === i)));
    const sel = pickN(base, Math.min(n, 7));
    return shuffle(sel.concat(pickN(TEILE.filter(t => sel.indexOf(t) < 0), Math.max(0, n - sel.length))));
}

// ---------- Dichte (Werte schwanken je nach Tabellenbuch, daher tol) ----------
// rho und tol in Tausendsteln kg/dm³; txt = Wert für die Erklärung
const NE = {
    Aluminium: { rho: 2700, tol: 30, txt: '2,7', leicht: true },
    Magnesium: { rho: 1720, tol: 40, txt: '1,7', leicht: true },     // 1,7 ... 1,74
    Titan:     { rho: 4500, tol: 30, txt: '4,5', leicht: true },     // 4,5 ... 4,51
    Zink:      { rho: 7130, tol: 70, txt: '7,1', leicht: false },    // 7,13 ... 7,2
    Kupfer:    { rho: 8940, tol: 50, txt: '8,9', leicht: false },    // 8,92 ... 8,96
    Blei:      { rho: 11330, tol: 60, txt: '11,3', leicht: false },  // 11,3 ... 11,35
    Nickel:    { rho: 8900, tol: 50, txt: '8,9', leicht: false },
    Zinn:      { rho: 7290, tol: 50, txt: '7,3', leicht: false },    // 7,28 ... 7,3
    Chrom:     { rho: 7150, tol: 70, txt: '7,2', leicht: false }     // 7,1 ... 7,2
};
const L = 'Leichtmetall', S = 'Schwermetall';

// ---------- Skizze: Einteilungs-Schema mit Nummern (Modul 1) ----------
const BAUM = [
    ['Werkstoffe', 0, ''], ['Metalle', 1, '1'], ['Eisenwerkstoffe', 2, '2'], ['Stähle', 3, ''], ['Eisen-Gusswerkstoffe', 3, ''],
    ['Nichteisenmetalle', 2, '3'], ['Schwermetalle', 3, '4'], ['Leichtmetalle', 3, '5'],
    ['Nichtmetalle', 1, '6'], ['Künstliche Nichtmetallwerkstoffe', 2, ''], ['Naturwerkstoffe', 2, '7'], ['Verbundwerkstoffe', 1, '8']
];
const SVG_BAUM = (function () {
    const F = 'font-family="Segoe UI, Arial"';
    const X = l => 8 + l * 30, Y = r => 8 + r * 42;
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
        else boxes += '<rect x="' + X(l) + '" y="' + Y(r) + '" width="' + (label.length > 22 ? 250 : 180) + '" height="32" rx="8" fill="#1e293b" stroke="' + (l ? '#64748b' : '#38bdf8') + '" stroke-width="2"/>' +
                      '<text x="' + (X(l) + 12) + '" y="' + (Y(r) + 21) + '" fill="#f8fafc" font-size="15" ' + F + '>' + label + '</text>';
    });
    return '<svg viewBox="0 0 330 512" style="max-width:380px; min-width:0" role="img" aria-label="Einteilungs-Schema der Werkstoffe mit acht Nummern">' + lines + boxes + '</svg>';
})();

// ---------- Fehler finden: Fächer mit einem falschen Teil ----------
const GRUPPEN = [
    { name: 'Stähle', farbe: '#94a3b8', items: ['Baustahl', 'Werkzeugstahl', 'Vergütungsstahl'] },
    { name: 'Eisen-Gusswerkstoffe', farbe: '#64748b', items: ['Gusseisen', 'Stahlguss'] },
    { name: 'Schwermetalle', farbe: '#f59e0b', items: ['Kupfer', 'Zink', 'Blei', 'Nickel'] },
    { name: 'Leichtmetalle', farbe: '#38bdf8', items: ['Aluminium', 'Titan', 'Magnesium'] },
    { name: 'Künstl. Nichtmetallwerkstoffe', farbe: '#a855f7', items: ['Kunststoff', 'Glas', 'Keramik'] },
    { name: 'Naturwerkstoffe', farbe: '#84cc16', items: ['Holz', 'Granit', 'Grafit'] },
    { name: 'Verbundwerkstoffe', farbe: '#22c55e', items: ['GFK', 'Hartmetall', 'CFK'] }
];
function fehlerTask() {
    const shown = GRUPPEN.map(g => ({ name: g.name, farbe: g.farbe, items: pickN(g.items, 2) }));
    // Der falsche Eintrag kommt nie aus den Verbundwerkstoffen (z. B. GFK bei Kunststoffen wäre strittig).
    const from = rint(0, 5);
    let to; do { to = rint(0, 6); } while (to === from || (from === 4 && to === 6));
    const pool = GRUPPEN[from].items.filter(x => shown[from].items.indexOf(x) < 0);
    const wrong = pool.length ? rnd(pool) : shown[from].items.pop();
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
        q: 'Ein Mitschüler hat das Regal eingeräumt. Ein Werkstoff liegt im falschen Fach. Welcher?',
        options: opts, correct: opts.indexOf(wrong),
        hint: 'Prüfe jedes Fach einzeln. Eisen als Basis? Gegossen? Dichte über oder unter 5 kg/dm³? Natürlich oder vom Menschen hergestellt?',
        explanation: '<strong>' + wrong + '</strong> gehört nicht zu den ' + GRUPPEN[to].name + ', sondern zu den <strong>' + GRUPPEN[from].name + '</strong>.'
    };
}

// =====================================================================
const TASKS = {
// ---------------------------------------------------------------- Modul 1: Die drei Hauptgruppen
1: [
    {
        type: 'match', shuffle: false, svg: SVG_BAUM,
        q: 'Das Schema zeigt die Einteilung der Werkstoffe. Welcher Begriff gehört zu welcher Nummer?',
        options: ['Metalle', 'Eisenwerkstoffe', 'Nichteisenmetalle', 'Schwermetalle', 'Leichtmetalle', 'Nichtmetalle', 'Naturwerkstoffe', 'Verbundwerkstoffe'],
        items: [
            { left: 'Nummer 1', answer: 'Metalle' },
            { left: 'Nummer 2', answer: 'Eisenwerkstoffe',
              errors: [{ v: 'Nichteisenmetalle', msg: 'Unter Nummer 2 hängen Stähle und Gusswerkstoffe. Die haben Eisen als Basis.' }] },
            { left: 'Nummer 3', answer: 'Nichteisenmetalle' },
            { left: 'Nummer 4', answer: 'Schwermetalle' }, { left: 'Nummer 5', answer: 'Leichtmetalle' },
            { left: 'Nummer 6', answer: 'Nichtmetalle' }, { left: 'Nummer 7', answer: 'Naturwerkstoffe' },
            { left: 'Nummer 8', answer: 'Verbundwerkstoffe' }
        ],
        hint: 'Die drei Hauptgruppen stehen ganz links. Metalle teilt man nach dem Eisen ein, Nichteisenmetalle nach der Dichte. Neben den künstlichen Nichtmetallwerkstoffen stehen die, die in der Natur vorkommen.',
        explanation: '1 Metalle: 2 Eisenwerkstoffe (Stähle, Eisen-Gusswerkstoffe) und 3 Nichteisenmetalle (4 Schwermetalle, 5 Leichtmetalle). 6 Nichtmetalle: künstliche Nichtmetallwerkstoffe und 7 Naturwerkstoffe. 8 Verbundwerkstoffe.'
    },
    function () {
        const M = 'Metall', N = 'Nichtmetall', V = 'Verbundwerkstoff';
        const all = [
            ...['Stahl', 'Gusseisen', 'Kupfer', 'Aluminium', 'Titan', 'Zink'].map(x => ({ left: x, answer: M })),
            ...['Kunststoff', 'Glas', 'Keramik', 'Holz', 'Granit', 'Grafit'].map(x => ({ left: x, answer: N })),
            ...['GFK (glasfaserverstärkter Kunststoff)', 'Hartmetall', 'CFK (kohlenstofffaserverstärkter Kunststoff)', 'Stahlbeton'].map(x => ({ left: x, answer: V }))
        ];
        all.find(x => x.left === 'Hartmetall').errors = [{ v: M, msg: 'Vorsicht, Falle! Hartmetall besteht aus Hartstoffkörnern und einem Metall. Also mehrere Werkstoffe.' }];
        const items = shuffle(pickN(all.filter(x => x.answer === M), 2).concat(pickN(all.filter(x => x.answer === N), 2), pickN(all.filter(x => x.answer === V), 1)));
        return {
            type: 'match', q: 'Zu welcher Hauptgruppe gehört der Werkstoff?', options: [M, N, V], items,
            hint: 'Kunststoffe, Glas, Keramik, Holz und Granit sind Nichtmetalle. Ein Verbundwerkstoff besteht aus mehreren Werkstoffen, die fest verbunden sind.',
            explanation: 'Metalle: z. B. Stahl, Gusseisen, Kupfer, Aluminium. Nichtmetalle: z. B. Kunststoff, Glas, Holz, Granit, Grafit. Verbundwerkstoffe: z. B. GFK, CFK, Hartmetall.'
        };
    },
    {
        type: 'mc',
        q: 'Was ist ein Verbundwerkstoff?',
        options: ['Ein Metall, das sehr hart ist.',
                  'Mehrere Werkstoffe, die fest miteinander verbunden sind. Sie vereinen ihre guten Eigenschaften.',
                  'Zwei Bleche, die miteinander verschraubt sind.',
                  'Ein Kunststoff, der in der Natur vorkommt.'],
        correct: 1,
        hint: 'Denk an GFK: Glasfasern und Kunststoff in einem Werkstoff.',
        explanation: 'Ein Verbundwerkstoff besteht aus mehreren Werkstoffen. Zusammen hat er bessere Eigenschaften als jeder einzelne. GFK ist zum Beispiel leicht und sehr fest.'
    },
    richtigFalsch([
        { left: 'Die drei Hauptgruppen sind Metalle, Nichtmetalle und Verbundwerkstoffe.', answer: 'richtig' },
        { left: 'Kupfer ist ein Nichteisenmetall.', answer: 'richtig' },
        { left: 'Stahl ist ein Nichteisenmetall.', answer: 'falsch' },
        { left: 'Kunststoffe gehören zu den Metallen.', answer: 'falsch' },
        { left: 'Holz ist ein Naturwerkstoff.', answer: 'richtig' },
        { left: 'Glas ist ein Naturwerkstoff.', answer: 'falsch' },
        { left: 'Nichteisenmetalle teilt man nach der Dichte ein.', answer: 'richtig' },
        { left: 'Gusseisen ist ein Eisenwerkstoff.', answer: 'richtig' }
    ], 5, 'Eisenwerkstoffe haben Eisen als Basis. Alle anderen Metalle sind Nichteisenmetalle. Glas stellt der Mensch her, es ist ein künstlicher Nichtmetallwerkstoff.')
],
// ---------------------------------------------------------------- Modul 2: Eisenwerkstoffe
2: [
    function () {
        const st = [{ left: 'große Festigkeit, zäh', answer: 'Stahl' }, { left: 'gut umformbar, z. B. biegen oder schmieden', answer: 'Stahl' },
                    { left: 'meistens gut schweißbar', answer: 'Stahl' }];
        const ge = [{ left: 'wird flüssig in eine Form gegossen', answer: 'Gusswerkstoff' }, { left: 'gut für Teile mit schwieriger Form', answer: 'Gusswerkstoff' },
                    { left: 'Gusseisen: spröde, kann bei einem Schlag brechen', answer: 'Gusswerkstoff' }, { left: 'Gusseisen: dämpft Schwingungen gut', answer: 'Gusswerkstoff' }];
        return {
            type: 'match', q: 'Stahl oder Eisen-Gusswerkstoff? Welche Eigenschaft passt?', options: ['Stahl', 'Gusswerkstoff'],
            items: shuffle(pickN(st, 2).concat(pickN(ge, 2))),
            hint: 'Stahl ist fest und zäh. Gusswerkstoffe sind gut vergießbar. Gusseisen hat viel Kohlenstoff und ist deshalb spröde.',
            explanation: 'Stahl: große Festigkeit, zäh, umformbar, schweißbar. Eisen-Gusswerkstoffe: gut vergießbar, auch für schwierige Formen. Gusseisen ist spröde und dämpft Schwingungen.'
        };
    },
    function () {
        const S_ = 'Stahl', G = 'Eisen-Gusswerkstoff';
        const all = [
            { left: 'Antriebswelle', answer: S_ }, { left: 'Schraube', answer: S_ }, { left: 'Zahnrad', answer: S_ },
            { left: 'Bohrer', answer: S_ }, { left: 'Stahlträger für eine Halle', answer: S_ },
            { left: 'Getriebegehäuse', answer: G }, { left: 'Maschinenbett einer Drehmaschine', answer: G },
            { left: 'Pumpengehäuse mit vielen Kanälen', answer: G }
        ];
        const items = shuffle(pickN(all.filter(x => x.answer === S_), 3).concat(pickN(all.filter(x => x.answer === G), 2)));
        return {
            type: 'match', q: 'Aus welchem Eisenwerkstoff ist das Bauteil meistens?', options: [S_, G], items,
            hint: 'Teile, die große Kräfte übertragen, sind meistens aus Stahl. Große Teile mit schwieriger Form gießt man.',
            explanation: 'Stahl: Wellen, Schrauben, Zahnräder, Bohrer, Träger. Eisen-Gusswerkstoffe: Gehäuse und Maschinenbetten.'
        };
    },
    {
        type: 'mc',
        q: 'Warum stellt man ein Getriebegehäuse oft aus Gusseisen her?',
        options: ['Weil Gusseisen leichter ist als Aluminium.',
                  'Weil man die schwierige Form gut gießen kann und Gusseisen Schwingungen dämpft.',
                  'Weil Gusseisen besonders zäh ist und sich gut biegen lässt.',
                  'Weil Gusseisen nicht rostet.'],
        correct: 1,
        hint: 'Ein Gehäuse hat viele Rundungen, Bohrungen und Wände. Und im Getriebe brummt es.',
        explanation: 'Gusseisen ist gut vergießbar. So entstehen auch schwierige Formen in einem Stück. Außerdem dämpft Gusseisen Schwingungen. Das Getriebe läuft leiser.'
    },
    {
        type: 'match',
        q: 'Zu welcher Gruppe gehört der Werkstoff?',
        options: ['Stähle', 'Eisen-Gusswerkstoffe'],
        items: [{ left: 'Werkzeugstahl', answer: 'Stähle' }, { left: 'Baustahl', answer: 'Stähle' },
                { left: 'Gusseisen', answer: 'Eisen-Gusswerkstoffe' },
                { left: 'Stahlguss', answer: 'Eisen-Gusswerkstoffe', errors: [{ v: 'Stähle', msg: 'Vorsicht, Falle! Stahlguss wird in eine Form gegossen. Er gehört zu den Gusswerkstoffen.' }] }],
        hint: 'Achte auf das Wort „Guss“. Alles, was gegossen wird, gehört zu den Gusswerkstoffen.',
        explanation: 'Werkzeugstahl und Baustahl sind Stähle. Gusseisen und Stahlguss sind Eisen-Gusswerkstoffe.'
    },
    richtigFalsch([
        { left: 'Eisenwerkstoffe haben Eisen als Basis.', answer: 'richtig' },
        { left: 'Stähle haben eine große Festigkeit.', answer: 'richtig' },
        { left: 'Gusseisen ist zäh und lässt sich gut biegen.', answer: 'falsch' },
        { left: 'Stahlguss gehört zu den Eisen-Gusswerkstoffen.', answer: 'richtig' },
        { left: 'Gusseisen enthält mehr Kohlenstoff als Stahl.', answer: 'richtig' },
        { left: 'Eine Welle stellt man meistens aus Gusseisen her.', answer: 'falsch' },
        { left: 'Nichtrostender Stahl ist ein Eisenwerkstoff.', answer: 'richtig' }
    ], 5, 'Stähle: Eisen als Basis, bis etwa 2 % Kohlenstoff, fest und zäh. Gusseisen hat mehr Kohlenstoff und ist spröde. Wellen müssen zäh sein, deshalb nimmt man Stahl.')
],
// ---------------------------------------------------------------- Modul 3: Nichteisenmetalle (Tabellenbuch)
3: [
    {
        type: 'num', book: true,
        q: 'Bei welcher Dichte liegt die Grenze zwischen Leichtmetallen und Schwermetallen?',
        note: BOOK_PSE,
        fields: [
            { label: 'Grenze', unit: 'kg/dm³', ans: 5000, errors: [{ v: 4500, msg: '4,5 kg/dm³ ist die Dichte von Titan. Gesucht ist die Grenze.' }] },
            { label: 'Leichtmetalle haben eine Dichte …', kind: 'select', options: ['kleiner oder gleich der Grenze', 'größer als die Grenze'], ans: 'kleiner oder gleich der Grenze' },
            { label: 'Schwermetalle haben eine Dichte …', kind: 'select', options: ['kleiner oder gleich der Grenze', 'größer als die Grenze'], ans: 'größer als die Grenze' }
        ],
        hint: 'Suche im Tabellenbuch das Periodensystem der Elemente. Lies die Fußnote oder die Legende. Dort steht, ab welcher Dichte ein Metall ein Schwermetall ist.',
        explanation: 'Die Grenze liegt bei <strong>5 kg/dm³</strong>.<br>Leichtmetalle: ρ ≤ 5 kg/dm³. Schwermetalle: ρ > 5 kg/dm³.'
    },
    function () {
        const leicht = Object.keys(NE).filter(k => NE[k].leicht), schwer = Object.keys(NE).filter(k => !NE[k].leicht);
        const nl = rint(1, 2);
        const sel = shuffle(pickN(leicht, nl).concat(pickN(schwer, 3 - nl)));
        const fields = [];
        sel.forEach(m => {
            fields.push({ label: 'Dichte ' + m, unit: 'kg/dm³', ans: NE[m].rho, tol: NE[m].tol });
            fields.push({ label: m + ' ist ein …', kind: 'select', options: [L, S], ans: NE[m].leicht ? L : S });
        });
        return {
            type: 'num', newLabel: 'Neue Aufgabe', book: true,
            q: 'Leicht- oder Schwermetall? Schlage die Dichte nach und entscheide.',
            note: BOOK_RHO, fields,
            hint: 'Vergleiche jede Dichte mit der Grenze aus Aufgabe 1. Bis zur Grenze: Leichtmetall. Darüber: Schwermetall.',
            explanation: sel.map(m => m + ': etwa ' + NE[m].txt + ' kg/dm³ → ' + NE[m].txt + (NE[m].leicht ? ' ≤ 5' : ' > 5') + ' → <strong>' + (NE[m].leicht ? L : S) + '</strong>').join('<br>') +
                         '<br><span style="color:#94a3b8;">Steht in deinem Buch ein etwas anderer Wert, ist das auch richtig.</span>'
        };
    },
    {
        type: 'mc',
        q: 'Ein Kollege will die <strong>Titanschrauben</strong> ins Fach „Schwermetalle“ legen. Er sagt: „Titan ist doch so fest.“ Hat er recht?',
        options: ['Ja. Feste Metalle sind Schwermetalle.',
                  'Nein. Es zählt nur die Dichte. Titan liegt unter der Grenze und ist ein Leichtmetall.',
                  'Ja. Titan liegt mit seiner Dichte über der Grenze.',
                  'Nein. Titan ist ein Eisenwerkstoff.'],
        correct: 1,
        hint: 'Wonach teilt man Nichteisenmetalle ein: nach der Festigkeit oder nach der Dichte? Schlage die Dichte von Titan nach.',
        explanation: 'Ob ein Nichteisenmetall leicht oder schwer ist, hängt nur von der <strong>Dichte</strong> ab, nicht von der Festigkeit. Titan: 4,5 kg/dm³ ≤ 5 kg/dm³. Also ist Titan ein Leichtmetall.'
    },
    function () {
        const all = ['Magnesium', 'Aluminium', 'Titan', 'Zink', 'Kupfer', 'Blei'];
        const sel = pickN(all, 4).sort((a, b) => NE[a].rho - NE[b].rho);
        return {
            type: 'order', book: true,
            q: 'Sortiere die Metalle nach ihrer Dichte. Das leichteste kommt nach oben.',
            note: 'Bringe die Metalle mit ▲ und ▼ in die richtige Reihenfolge. ' + BOOK_RHO,
            steps: sel,
            hint: 'Schreibe dir zu jedem Metall die Dichte auf. Dann sortieren.',
            explanation: sel.map(m => m + ' (etwa ' + NE[m].txt + ' kg/dm³)').join(' → ')
        };
    },
    function () {
        const all = [
            { left: 'Stromschiene im Schaltschrank', answer: 'Kupfer' }, { left: 'Rundstab für Elektroteile', answer: 'Kupfer' },
            { left: 'leichtes Fensterprofil', answer: 'Aluminium' }, { left: 'leichtes Blech für eine Verkleidung', answer: 'Aluminium' },
            { left: 'Dachrinne', answer: 'Zink' }, { left: 'Rostschutz-Schicht auf Stahlblech', answer: 'Zink' },
            { left: 'leichte, sehr feste Schrauben im Flugzeug', answer: 'Titan' }
        ];
        const base = ['Kupfer', 'Aluminium', 'Zink', 'Titan'].map(a => rnd(all.filter(x => x.answer === a)));
        return {
            type: 'match', q: 'Welches Nichteisenmetall wird hier meistens verwendet?', options: ['Kupfer', 'Aluminium', 'Zink', 'Titan'],
            items: shuffle(base),
            hint: 'Kupfer leitet Strom sehr gut. Aluminium ist leicht. Zink schützt Stahl vor Rost. Titan ist leicht und sehr fest, aber teuer.',
            explanation: 'Kupfer: Strom. Aluminium: leichte Profile und Bleche. Zink: Dachrinnen und Verzinkung. Titan: leicht und sehr fest.'
        };
    }
],
// ---------------------------------------------------------------- Modul 4: Nichtmetalle und Verbundwerkstoffe
4: [
    function () {
        const K = 'künstlicher Nichtmetallwerkstoff', N = 'Naturwerkstoff', V = 'Verbundwerkstoff';
        const all = [
            { left: 'Kunststoff', answer: K }, { left: 'Glas', answer: K }, { left: 'Keramik', answer: K },
            { left: 'Holz', answer: N }, { left: 'Granit', answer: N }, { left: 'Grafit', answer: N },
            { left: 'GFK', answer: V }, { left: 'Hartmetall', answer: V }, { left: 'CFK', answer: V }
        ];
        const base = [K, N, V].map(g => rnd(all.filter(x => x.answer === g)));
        return {
            type: 'match', q: 'Künstlicher Nichtmetallwerkstoff, Naturwerkstoff oder Verbundwerkstoff?', options: [K, N, V],
            items: shuffle(base.concat(pickN(all.filter(x => base.indexOf(x) < 0), 2))),
            hint: 'Naturwerkstoffe kommen so in der Natur vor. Künstliche stellt der Mensch her. Verbundwerkstoffe bestehen aus mehreren Werkstoffen.',
            explanation: 'Künstlich: Kunststoff, Glas, Keramik. Natur: Holz, Granit, Grafit. Verbund: GFK, CFK, Hartmetall.'
        };
    },
    {
        type: 'match',
        q: 'Woraus besteht der Verbundwerkstoff?',
        options: ['Glasfasern + Kunststoff', 'Kohlenstofffasern + Kunststoff', 'harte Hartstoffkörner + zähes Metall', 'Stahl + Beton'],
        items: [{ left: 'GFK', answer: 'Glasfasern + Kunststoff' }, { left: 'CFK', answer: 'Kohlenstofffasern + Kunststoff' },
                { left: 'Hartmetall', answer: 'harte Hartstoffkörner + zähes Metall' }, { left: 'Stahlbeton', answer: 'Stahl + Beton' }],
        hint: 'G wie Glas, C wie Carbon (Kohlenstoff). FK heißt faserverstärkter Kunststoff.',
        explanation: 'GFK: glasfaserverstärkter Kunststoff. CFK: kohlenstofffaserverstärkter Kunststoff. Hartmetall: Hartstoffkörner, die ein zähes Metall zusammenhält. Stahlbeton: Beton mit Stahl im Inneren.'
    },
    {
        type: 'mc',
        q: 'Warum stellt man <strong>Wendeschneidplatten</strong> aus Hartmetall her?',
        options: ['Weil Hartmetall sehr leicht ist.',
                  'Weil Hartmetall die Härte der Hartstoffkörner mit der Zähigkeit des Metalls verbindet.',
                  'Weil Hartmetall ein Naturwerkstoff ist und nichts kostet.',
                  'Weil Hartmetall weich ist und sich gut anpasst.'],
        correct: 1,
        hint: 'Eine Schneide muss hart sein, damit sie schneidet. Aber sie darf beim Zerspanen nicht abbrechen.',
        explanation: 'Die Hartstoffkörner sind sehr hart. Das Metall dazwischen ist zäh und hält alles zusammen. So ist die Schneidplatte hart genug zum Zerspanen und bricht trotzdem nicht so leicht.'
    },
    richtigFalsch([
        { left: 'Grafit ist ein Naturwerkstoff.', answer: 'richtig' },
        { left: 'Keramik kommt so in der Natur vor.', answer: 'falsch' },
        { left: 'GFK ist leicht und sehr fest.', answer: 'richtig' },
        { left: 'Hartmetall ist ein reines Metall.', answer: 'falsch' },
        { left: 'Kunststoffe sind künstliche Nichtmetallwerkstoffe.', answer: 'richtig' },
        { left: 'Ein Verbundwerkstoff vereint die guten Eigenschaften mehrerer Werkstoffe.', answer: 'richtig' },
        { left: 'Granit ist ein künstlicher Werkstoff.', answer: 'falsch' }
    ], 5, 'Naturwerkstoffe: Holz, Granit, Grafit. Künstlich: Kunststoff, Glas, Keramik. Hartmetall ist trotz des Namens ein Verbundwerkstoff.')
],
// ---------------------------------------------------------------- Modul 5: Eigenschaften
5: [
    function () {
        const P = 'physikalisch', M = 'mechanisch', T = 'technologisch', C = 'chemisch';
        const all = [
            ['Dichte', P], ['Schmelztemperatur', P], ['elektrische Leitfähigkeit', P], ['Wärmeleitfähigkeit', P],
            ['Härte', M], ['Festigkeit', M], ['Zähigkeit', M], ['Elastizität', M],
            ['Gießbarkeit', T], ['Umformbarkeit', T], ['Zerspanbarkeit', T], ['Schweißbarkeit', T],
            ['Korrosionsbeständigkeit', C]
        ].map(x => ({ left: x[0], answer: x[1] }));
        const base = [P, M, T, C].map(g => rnd(all.filter(x => x.answer === g)));
        return {
            type: 'match', q: 'Zu welcher Gruppe gehört die Eigenschaft?', options: [P, M, T, C],
            items: shuffle(base.concat(pickN(all.filter(x => base.indexOf(x) < 0 && x.answer !== C), 1))),
            hint: 'Mechanisch: Wie verhält sich der Werkstoff unter Kraft? Technologisch: Wie gut lässt er sich bearbeiten? Chemisch: Wie reagiert er mit der Umgebung, z. B. Rost?',
            explanation: 'Physikalisch: Dichte, Schmelztemperatur, Leitfähigkeit. Mechanisch: Härte, Festigkeit, Zähigkeit, Elastizität. Technologisch: Gießbarkeit, Umformbarkeit, Zerspanbarkeit, Schweißbarkeit. Chemisch: Korrosionsbeständigkeit.'
        };
    },
    function () {
        const all = [
            { left: 'Widerstand gegen das Eindringen eines anderen Körpers', answer: 'Härte' },
            { left: 'verformt sich stark, bevor es bricht', answer: 'Zähigkeit' },
            { left: 'bricht plötzlich, ohne sich vorher zu verformen', answer: 'Sprödigkeit' },
            { left: 'federt nach der Belastung in die alte Form zurück', answer: 'Elastizität' },
            { left: 'hält große Kräfte aus, ohne zu brechen', answer: 'Festigkeit' }
        ];
        return {
            type: 'match', q: 'Welcher Begriff passt zur Beschreibung?', options: all.map(x => x.answer), items: pickN(all, 4),
            hint: 'Spröde ist das Gegenteil von zäh. Denk an Glas (spröde) und an einen Kaugummi (zäh).',
            explanation: 'Härte: Widerstand gegen Eindringen. Zähigkeit: verformt sich vor dem Bruch. Sprödigkeit: bricht ohne Verformung. Elastizität: federt zurück. Festigkeit: hält große Kräfte aus.'
        };
    },
    function () {
        const all = [
            { left: 'Stromkabel', answer: 'elektrische Leitfähigkeit' }, { left: 'Kühlkörper für Elektronik', answer: 'Wärmeleitfähigkeit' },
            { left: 'Schneide eines Bohrers', answer: 'Härte' }, { left: 'Feder', answer: 'Elastizität' },
            { left: 'Geländer im Freien', answer: 'Korrosionsbeständigkeit' }, { left: 'Gehäuse mit schwieriger Form', answer: 'Gießbarkeit' },
            { left: 'Blech, das gebogen werden soll', answer: 'Umformbarkeit' }, { left: 'Kranhaken', answer: 'Zähigkeit' }
        ];
        return {
            type: 'match', q: 'Welche Eigenschaft ist bei diesem Bauteil besonders wichtig?', options: all.map(x => x.answer), items: pickN(all, 5),
            hint: 'Frage dich: Was muss das Bauteil können? Strom leiten, nicht rosten, nicht abbrechen …?',
            explanation: 'Kabel: elektrische Leitfähigkeit. Kühlkörper: Wärmeleitfähigkeit. Bohrer: Härte. Feder: Elastizität. Geländer: Korrosionsbeständigkeit. Gehäuse: Gießbarkeit. Biegeblech: Umformbarkeit. Kranhaken: Zähigkeit, er darf nicht plötzlich brechen.'
        };
    },
    function () {
        const all = [['Zinn', 232], ['Blei', 327], ['Zink', 419], ['Aluminium', 660], ['Kupfer', 1083], ['Eisen', 1536]];
        const sel = pickN(all, 4).sort((a, b) => a[1] - b[1]);
        return {
            type: 'order', book: true,
            q: 'Sortiere die Metalle nach ihrer Schmelztemperatur. Das Metall, das am leichtesten schmilzt, kommt nach oben.',
            note: 'Bringe die Metalle mit ▲ und ▼ in die richtige Reihenfolge. Schlage im Tabellenbuch nach: Stoffwerte von festen Stoffen, oder im Sachwortverzeichnis unter „Schmelztemperatur“.',
            steps: sel.map(x => x[0]),
            hint: 'Schreibe dir zu jedem Metall die Schmelztemperatur auf. Dann sortieren.',
            explanation: sel.map(x => x[0] + ' (etwa ' + x[1] + ' °C)').join(' → ')
        };
    },
    richtigFalsch([
        { left: 'Mit einem Magneten kann man Baustahl von Aluminium unterscheiden.', answer: 'richtig' },
        { left: 'Ein harter Werkstoff ist immer auch zäh.', answer: 'falsch' },
        { left: 'Glas ist spröde.', answer: 'richtig' },
        { left: 'Kupfer leitet Strom sehr gut.', answer: 'richtig' },
        { left: 'Kunststoffe leiten Wärme besser als Metalle.', answer: 'falsch' },
        { left: 'Die Dichte ist eine mechanische Eigenschaft.', answer: 'falsch' },
        { left: 'Korrosionsbeständig heißt: Der Werkstoff rostet oder zersetzt sich kaum.', answer: 'richtig' }
    ], 5, 'Hart heißt nicht zäh: Glas ist hart, aber spröde. Kunststoffe leiten Wärme schlecht, darum nimmt man sie für Griffe. Die Dichte ist eine physikalische Eigenschaft.')
],
// ---------------------------------------------------------------- Modul 6: Das Lagerregal
6: [
    {
        type: 'order',
        q: 'Du sortierst ein Teil aus der Kiste ein. In welcher Reihenfolge gehst du vor?',
        steps: ['Den Werkstoff des Teils ablesen (Beschriftung oder Liste).',
                'Hauptgruppe bestimmen: Metall, Nichtmetall oder Verbundwerkstoff?',
                'Untergruppe bestimmen. Bei Nichteisenmetallen die Dichte im Tabellenbuch nachschlagen.',
                'Das Teil in das passende Regalfach legen.'],
        hint: 'Erst musst du wissen, woraus das Teil ist. Dann gehst du im Schema von oben nach unten.',
        explanation: 'Werkstoff ablesen → Hauptgruppe → Untergruppe (bei NE-Metallen mit der Dichte) → ins Fach legen.'
    },
    function () {
        const E = 'bekommt ein eigenes Fach', O = 'kein eigenes Fach (Obergruppe)';
        const all = [
            { left: 'Metalle', answer: O }, { left: 'Nichtmetalle', answer: O }, { left: 'Eisenwerkstoffe', answer: O }, { left: 'Nichteisenmetalle', answer: O },
            { left: 'Eisen-Gusswerkstoffe', answer: E }, { left: 'Schwermetalle', answer: E }, { left: 'Leichtmetalle', answer: E },
            { left: 'Künstliche Nichtmetallwerkstoffe', answer: E }, { left: 'Naturwerkstoffe', answer: E }, { left: 'Verbundwerkstoffe', answer: E }
        ];
        const items = shuffle(pickN(all.filter(x => x.answer === O), 2).concat(pickN(all.filter(x => x.answer === E), 3)));
        items.forEach(x => { if (x.left === 'Verbundwerkstoffe') x.errors = [{ v: O, msg: 'Verbundwerkstoffe sind eine Hauptgruppe ohne Untergruppen. Sie stehen also auch in der untersten Ebene.' }]; });
        return {
            type: 'match', q: 'Das Regal hat sieben Fächer. Fach 1 heißt „Stähle“. Jede Gruppe aus der <strong>untersten Ebene</strong> des Schemas bekommt ein Fach. Welche Gruppe bekommt ein eigenes Fach?',
            options: [E, O], items,
            hint: 'Gruppen, unter denen noch weitere Gruppen hängen, sind Obergruppen. Sie bekommen kein eigenes Fach.',
            explanation: 'Die sieben Fächer: Stähle, Eisen-Gusswerkstoffe, Schwermetalle, Leichtmetalle, künstliche Nichtmetallwerkstoffe, Naturwerkstoffe, Verbundwerkstoffe.'
        };
    },
    function () {
        const sel = teileMix(5);
        return {
            type: 'match', book: true,
            q: 'Sortiere die Teile aus der Kiste ein. In welches Fach kommt das Teil?',
            note: 'Wähle bei jedem Teil das passende Fach. Bei Nichteisenmetallen hilft dir die Dichte aus dem Tabellenbuch.',
            options: FACH.map((f, i) => 'Fach ' + (i + 1) + ': ' + f),
            items: sel.map(t => ({ left: t[0], answer: 'Fach ' + (t[1] + 1) + ': ' + FACH[t[1]] })),
            hint: 'Gehe in vier Schritten vor: Werkstoff ablesen → Hauptgruppe → Untergruppe → Fach. Leichtmetalle: bis 5 kg/dm³.',
            explanation: sel.map(t => t[0] + ' → <strong>Fach ' + (t[1] + 1) + '</strong> (' + FACH[t[1]] + ')').join('<br>')
        };
    },
    function () {
        const sel = teileMix(rint(8, 10));
        const cnt = FACH.map((f, i) => sel.filter(t => t[1] === i).length);
        const liste = '<div style="text-align:left; columns: 2 220px; column-gap: 24px; font-size:16px; color:#e2e8f0; line-height:1.9;">' +
                      sel.map((t, k) => '<div>' + (k + 1) + '. ' + t[0] + '</div>').join('') + '</div>';
        return {
            type: 'num', newLabel: 'Neue Aufgabe', book: true, svg: liste,
            q: 'In der Kiste liegen diese <strong>' + sel.length + ' Teile</strong>. Wie viele Teile kommen in jedes Fach?',
            note: 'Trage bei leeren Fächern 0 ein. Zur Kontrolle: Die Summe muss ' + sel.length + ' sein.',
            fields: FACH.map((f, i) => ({ label: 'Fach ' + (i + 1) + ': ' + f, unit: 'Teile', ans: cnt[i] * 1000 }))
                       .concat([{ label: 'Summe', unit: 'Teile', ans: sel.length * 1000 }]),
            hint: 'Schreibe zu jedem Teil die Fachnummer auf. Dann zähle. Kommst du nicht auf ' + sel.length + '? Dann hast du ein Teil vergessen oder doppelt gezählt.',
            explanation: FACH.map((f, i) => 'Fach ' + (i + 1) + ': ' + cnt[i] + (cnt[i] ? ' (' + sel.filter(t => t[1] === i).map(t => t[0]).join(', ') + ')' : '')).join('<br>') + '<br>Summe: <strong>' + sel.length + '</strong>'
        };
    },
    fehlerTask
],
// ---------------------------------------------------------------- Modul 7: Werkstoff wählen
7: [
    {
        type: 'order',
        q: 'Du sollst den Werkstoff für ein neues Bauteil auswählen. Bringe die Schritte in die richtige Reihenfolge.',
        steps: ['Anforderungen sammeln: Was muss das Bauteil aushalten und können?',
                'Daraus die wichtigen Eigenschaften ableiten, z. B. hart, leicht, rostfrei.',
                'Werkstoffe mit diesen Eigenschaften suchen, z. B. im Tabellenbuch.',
                'Vor- und Nachteile abwägen (Preis, Bearbeitung) und entscheiden.'],
        hint: 'Zuerst kommt das Bauteil, ganz am Ende der Werkstoff.',
        explanation: 'Anforderungen → Eigenschaften → passende Werkstoffe → abwägen und entscheiden.'
    },
    function () {
        const all = [
            { left: 'Antriebswelle: große Festigkeit, zäh', answer: 'Vergütungsstahl' },
            { left: 'Getriebegehäuse: schwierige Form, dämpft Schwingungen', answer: 'Gusseisen' },
            { left: 'Stromschiene: leitet Strom sehr gut', answer: 'Kupfer' },
            { left: 'Leiter: leicht und rostet nicht', answer: 'Aluminium' },
            { left: 'Schneidplatte: sehr hart und trotzdem zäh', answer: 'Hartmetall' },
            { left: 'Griff: isoliert gegen Wärme und Strom', answer: 'Kunststoff' },
            { left: 'Messplatte: verzieht sich nicht, rostet nicht', answer: 'Granit' },
            { left: 'Abdeckhaube: leicht, fest, korrosionsbeständig', answer: 'GFK' }
        ];
        return {
            type: 'match', q: 'Welcher Werkstoff passt am besten zur Anforderung?', options: all.map(x => x.answer), items: pickN(all, 5),
            hint: 'Lies jede Anforderung genau. Welches Wort passt zu welchem Werkstoff: leitet Strom, leicht, sehr hart, isoliert?',
            explanation: 'Welle: Vergütungsstahl. Gehäuse: Gusseisen. Stromschiene: Kupfer. Leiter: Aluminium. Schneidplatte: Hartmetall. Griff: Kunststoff. Messplatte: Granit. Abdeckhaube: GFK.'
        };
    },
    {
        type: 'mc',
        q: 'Ein Kollege schlägt vor: „Wir machen die Antriebswelle aus Gusseisen. Das kann man gut gießen.“ Was sagst du?',
        options: ['Gute Idee. Gusseisen ist besonders zäh.',
                  'Keine gute Idee. Gusseisen ist spröde. Eine Welle muss zäh sein und große Kräfte aushalten. Besser ist Stahl.',
                  'Gute Idee. Gusseisen ist ein Leichtmetall.',
                  'Keine gute Idee. Gusseisen ist ein Nichtmetall.'],
        correct: 1,
        hint: 'Was passiert mit einem spröden Werkstoff, wenn ein Stoß oder eine große Kraft kommt?',
        explanation: 'Gut gießbar ist nicht die wichtigste Eigenschaft für eine Welle. Sie muss <strong>fest und zäh</strong> sein. Gusseisen ist spröde und könnte plötzlich brechen. Deshalb nimmt man Stahl, z. B. Vergütungsstahl.'
    },
    {
        type: 'mc',
        q: 'Für eine Leiter stehen Stahl und Aluminium zur Wahl. Warum nimmt man meistens Aluminium?',
        options: ['Weil Aluminium härter ist als Stahl.',
                  'Weil Aluminium viel leichter ist und nicht rostet.',
                  'Weil Aluminium ein Schwermetall ist.',
                  'Weil Aluminium Strom schlecht leitet.'],
        correct: 1,
        hint: 'Eine Leiter wird getragen und steht oft draußen.',
        explanation: 'Aluminium hat nur etwa ein Drittel der Dichte von Stahl. Die Leiter ist leicht zu tragen. Außerdem rostet Aluminium nicht. Vorsicht: Aluminium leitet Strom. An elektrischen Anlagen nimmt man deshalb Leitern aus GFK.'
    },
    richtigFalsch([
        { left: 'Es gibt einen Werkstoff, der für alle Bauteile am besten ist.', answer: 'falsch' },
        { left: 'Bei der Werkstoffwahl spielen auch Preis und Bearbeitung eine Rolle.', answer: 'richtig' },
        { left: 'Für ein Bauteil, das Stöße aushalten muss, braucht man einen zähen Werkstoff.', answer: 'richtig' },
        { left: 'Ein Griff aus Kunststoff wird nicht so schnell heiß, weil Kunststoff Wärme schlecht leitet.', answer: 'richtig' },
        { left: 'Titan nimmt man überall, weil es billig ist.', answer: 'falsch' },
        { left: 'Für Teile im Freien ist Korrosionsbeständigkeit wichtig.', answer: 'richtig' }
    ], 5, 'Jeder Werkstoff hat Vor- und Nachteile. Man wählt den, der die wichtigsten Anforderungen erfüllt und trotzdem bezahlbar und gut zu bearbeiten ist. Titan ist sehr gut, aber teuer.')
]
};
