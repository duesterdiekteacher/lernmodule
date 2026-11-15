/* ============================================================
   Projekt Industriemechaniker: Hubstation einer Montagelinie
   Gemeinsamer Zeichnungssatz für AFA und Fertigungstechnik
   ============================================================ */
const IM_SITUATION = `<h3>Situation</h3>
<p>In einer Montagelinie hebt eine <b>Hubstation</b> Werkstückträger auf die nächste Ebene. Ein <b>Hydraulikzylinder</b> (1A1) hebt den Hubtisch. Auf dem Hubtisch treibt ein Getriebemotor über einen Riementrieb eine <b>Antriebswelle</b> (Pos. 1) an. Die Welle bewegt die Rollen der Rollenbahn.</p>
<p>Die Welle ist in einem Lagergehäuse mit zwei Rillenkugellagern gelagert. An einem Lager ist ein Schaden aufgetreten: Die Lagerstelle wird heiß und macht Geräusche.</p>
<h3>Deine Aufträge</h3>
<ul style="margin-left:1.2rem"><li>die Funktion der Lagereinheit, der Hydraulik und der Steuerung analysieren,</li><li>den Lagerschaden beurteilen und die Lagereinheit instand setzen,</li><li>eine neue Antriebswelle (Pos. 1) fertigen und prüfen,</li><li>die Anlage wieder in Betrieb nehmen.</li></ul>
<h3>Technische Daten</h3>
<table><tr><th>Bauteil</th><th>Daten</th></tr>
<tr><td>Hydraulikzylinder 1A1</td><td>Kolben-Ø D = 63 mm, Stangen-Ø d = 36 mm, Hub 400 mm</td></tr>
<tr><td>Hydraulikpumpe 0P1</td><td>Konstantpumpe, Förderstrom Q = 12 l/min</td></tr>
<tr><td>Druckbegrenzungsventil 0V1</td><td>eingestellt auf 120 bar</td></tr>
<tr><td>Antriebsmotor Rollenbahn</td><td>Drehstrom 400 V, 0,75 kW, n = 1400 1/min</td></tr>
<tr><td>Riementrieb</td><td>Motor-Riemenscheibe d₁ = 80 mm, Riemenscheibe an Pos. 1 d₂ = 200 mm</td></tr></table>
<p>Die Zeichnungen sind vereinfacht und nicht maßstäblich. Es gelten nur die eingetragenen Maße.</p>`;

const IM_STUECKLISTE = [
    ['1', '1', 'Antriebswelle', '42CrMo4+QT', 'Zeichnung HS-02-001'],
    ['2', '1', 'Lagergehäuse', 'EN-GJL-250', 'Lagerbohrungen Ø52 H7'],
    ['3', '2', 'Rillenkugellager DIN 625 – 6205', 'Wälzlagerstahl', 'd = 25, D = 52, B = 15'],
    ['4', '2', 'Sicherungsring DIN 471 – 25 × 1,2', 'Federstahl', 'für Wellen'],
    ['5', '2', 'Radial-Wellendichtring DIN 3760 – A 25 × 40 × 7', 'NBR', ''],
    ['6', '2', 'Lagerdeckel', 'S235JR', 'links mit Zentrierbund, rechts mit Spalt'],
    ['7', '2', 'Passfeder DIN 6885 – A 6 × 6 × 28', 'E295', ''],
    ['8', '8', 'Zylinderschraube ISO 4762 – M6 × 20 – 8.8', 'Stahl', 'Lagerdeckel']
];

function svgImLagerung() {
    const m = 'arIL', k = 2.6, ox = 80, cy = 250;
    const X = x => ox + x * k, Yu = r => cy - r * k, Yl = r => cy + r * k;
    const polyR = (pts, Y, cls, hatch) => hatch ? Hatch(pts.map(([x, r]) => [X(x), Y(r)]), m, hatch) : Poly(pts.map(([x, r]) => [X(x), Y(r)]), cls);
    let s = `<svg viewBox="0 0 760 560" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 752, 552, 't');
    s += Tx(380, 30, 'Gesamtzeichnung Lagereinheit Antriebswelle (Schnitt, vereinfacht)', 16, 'middle', 'font-weight="bold"');
    // Gehäuse (Pos 2) – oben und unten, unten mit Fuß
    const geh = [[45, 26], [45, 45], [175, 45], [175, 26], [152, 26], [152, 22], [65, 22], [65, 26]];
    s += polyR(geh, Yu, '', 1);
    s += polyR(geh, Yl, '', 1);
    s += HatchR(X(60), Yl(45), 100 * k, 12 * k, m, 1);
    // Deckel (Pos 6)
    const dl = [[35, 14], [35, 45], [45, 45], [45, 26], [50, 26], [50, 23], [45, 23], [45, 20], [37, 20], [37, 14]];
    const dr = [[185, 14], [185, 45], [175, 45], [175, 26], [172, 26], [172, 23], [175, 23], [175, 20], [183, 20], [183, 14]];
    s += polyR(dl, Yu, '', 2) + polyR(dl, Yl, '', 2) + polyR(dr, Yu, '', 2) + polyR(dr, Yl, '', 2);
    // Welle (Pos 1) – nicht geschnitten
    const w = [[0, 10], [34, 10], [34, 12.5], [65, 12.5], [65, 16], [155, 16], [155, 12.5], [186, 12.5], [186, 10], [220, 10]];
    s += `<path d="M${X(0)},${Yu(10)} ${w.map(([x, r]) => `L${X(x)},${Yu(r)}`).join(' ')} L${X(220)},${Yl(10)} ${w.slice().reverse().map(([x, r]) => `L${X(x)},${Yl(r)}`).join(' ')} Z" class="vf"/>`;
    [34, 65, 155, 186].forEach(x => { s += Ln(X(x), Yu(x === 65 || x === 155 ? 16 : 12.5), X(x), Yl(x === 65 || x === 155 ? 16 : 12.5), 't'); });
    // Lager (Pos 3)
    [50, 155].forEach(x0 => {
        [Yu, Yl].forEach(Y => {
            s += HatchR(X(x0), Math.min(Y(26), Y(22.5)), 15 * k, 3.5 * k, m, 3);
            s += HatchR(X(x0), Math.min(Y(16), Y(12.5)), 15 * k, 3.5 * k, m, 3);
            s += Ci(X(x0 + 7.5), Y(19.25), 3.2 * k, 'vf');
        });
    });
    // Sicherungsringe (Pos 4)
    [48.7, 170].forEach(x0 => { [Yu, Yl].forEach(Y => { s += Rc(X(x0), Math.min(Y(15), Y(11.95)), 1.3 * k, 3.05 * k, 'fill'); }); });
    // RWDR (Pos 5)
    [37, 176].forEach(x0 => { [Yu, Yl].forEach(Y => { s += Rc(X(x0), Math.min(Y(20), Y(12.5)), 7 * k, 7.5 * k, 'vf') + Ln(X(x0), Y(12.5), X(x0 + 7), Y(20), 't') + Ln(X(x0 + 7), Y(12.5), X(x0), Y(20), 't'); }); });
    // Passfedern (Pos 7) – nicht geschnitten
    [3, 189].forEach(x0 => { s += `<rect x="${X(x0)}" y="${Yu(13)}" width="${28 * k}" height="${6 * k}" rx="${3 * k}" class="vf"/>`; });
    // Schrauben (Pos 8)
    [[29, 35, 55], [185, 191, 165]].forEach(([h1, h2, e]) => {
        [Yu, Yl].forEach(Y => {
            s += Rc(X(h1), Math.min(Y(31), Y(41)), 6 * k, 10 * k, 'vf');
            const xa = Math.min(X(h2), X(e)), xb = Math.max(X(h2), X(e));
            s += Rc(xa, Math.min(Y(33), Y(39)), xb - xa, 6 * k, 'vf');
        });
    });
    s += Ln(X(-6), cy, X(226), cy, 'c');
    // Positionsnummern
    s += balloon(X(110), Yu(12), X(110), 70, 1);
    s += balloon(X(120), Yu(38), X(160), 70, 2);
    s += balloon(X(57.5), Yu(24), X(70), 70, 3);
    s += balloon(X(162.5), Yl(24), X(150), 470, 3);
    s += balloon(X(49.3), Yl(13.5), X(40), 470, 4);
    s += balloon(X(40.5), Yu(17), X(28), 70, 5);
    s += balloon(X(40), Yl(38), X(68), 470, 6);
    s += balloon(X(180), Yu(40), X(205), 70, 6);
    s += balloon(X(17), Yu(11.5), X(5), 70, 7);
    s += balloon(X(32), Yl(36), X(14), 470, 8);
    s += Tx(X(-4), cy - 20, 'Antrieb', 11, 'end', 'fill="#555"') + Tx(X(-4), cy - 7, '(Riementrieb)', 11, 'end', 'fill="#555"');
    s += Tx(X(224), cy - 20, 'zur', 11, 'start', 'fill="#555"') + Tx(X(224), cy - 7, 'Rollenbahn', 11, 'start', 'fill="#555"');
    return s + '</svg>';
}

function svgImWelle() {
    const m = 'arIW', k = 2.7, ox = 70, cy = 200;
    const X = x => ox + x * k, Yu = r => cy - r * k, Yl = r => cy + r * k;
    let s = `<svg viewBox="0 0 760 720" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 752, 712, 't');
    s += Tx(380, 30, 'Antriebswelle – Pos. 1', 17, 'middle', 'font-weight="bold"');
    const seg = [[0, 34, 10], [34, 65, 12.5], [65, 155, 16], [155, 186, 12.5], [186, 220, 10]];
    seg.forEach(([a, b, r]) => { s += Rc(X(a), Yu(r), (b - a) * k, 2 * r * k, 'vf'); });
    // Fasen andeuten
    s += Ln(X(1), Yu(10), X(1), Yl(10), 't') + Ln(X(219), Yu(10), X(219), Yl(10), 't');
    // Einstiche Sicherungsringe
    [48.7, 170].forEach(x0 => { s += Rc(X(x0), Yu(12.5), 1.3 * k, 0.55 * k, 'fill') + Rc(X(x0), Yl(11.95), 1.3 * k, 0.55 * k, 'fill') + Ln(X(x0), Yu(11.95), X(x0), Yl(11.95), 't') + Ln(X(x0 + 1.3), Yu(11.95), X(x0 + 1.3), Yl(11.95), 't'); });
    // Passfedernuten (Draufsicht auf die Nut)
    [3, 189].forEach(x0 => { s += `<rect x="${X(x0)}" y="${cy - 3 * k}" width="${28 * k}" height="${6 * k}" rx="${3 * k}" class="v"/>`; });
    s += Ln(X(-5), cy, X(225), cy, 'c');
    // Bezüge A und B
    s += datumBox(X(46), Yl(12.5) + 30, 'A', X(50), Yl(12.5) + 1);
    s += datumBox(X(166), Yl(12.5) + 30, 'B', X(170), Yl(12.5) + 1);
    // Rundlauf auf Ø20 links und rechts
    s += tolFrame(X(0) - 10, Yu(10) - 62, 'runout', '0,02', 'A-B') + `<line x1="${X(14)}" y1="${Yu(10) - 42}" x2="${X(14)}" y2="${Yu(10)}" class="d" marker-end="url(#${m})"/>`;
    // Durchmesser
    const dd = (x, r, lab) => `<line x1="${X(x)}" y1="${Yu(r)}" x2="${X(x)}" y2="${Yl(r)}" class="d" marker-start="url(#${m})" marker-end="url(#${m})"/>` + `<text x="${X(x) - 5}" y="${cy}" font-size="13" text-anchor="middle" transform="rotate(-90 ${X(x) - 5} ${cy})">${lab}</text>`;
    const ddE = (x, r, lab) => `<line x1="${X(x)}" y1="${Yu(r)}" x2="${X(x)}" y2="${Yl(r)}" class="d" marker-start="url(#${m})" marker-end="url(#${m})"/>` + Tx(X(x), Yu(r) - 8, lab, 13);
    s += ddE(26, 10, 'Ø20 k6') + dd(57, 12.5, 'Ø25 k5') + dd(110, 16, 'Ø32') + dd(163, 12.5, 'Ø25 k5') + ddE(194, 10, 'Ø20 k6');
    // Längen (Kette)
    const yL = Yl(16) + 70;
    let chain = '';
    [[0, 34, '34'], [34, 65, '31'], [65, 155, '90'], [155, 186, '31'], [186, 220, '34']].forEach(([a, b, l]) => { chain += dimH(m, X(a), X(b), yL, Yl(a === 65 || a === 155 ? 16 : (a === 0 || a === 186 ? 10 : 12.5)), l, Yl(b === 65 || b === 155 ? 16 : (b === 34 || b === 220 ? 10 : 12.5))); });
    s += chain;
    s += dimH(m, X(0), X(220), yL + 32, Yl(10), '220');
    // Einstich-Lage
    s += dimH(m, X(34), X(48.7), Yu(16) - 30, Yu(12.5), '14,7');
    s += dimH(m, X(170), X(186), Yu(16) - 30, Yu(12.5), '14,7', Yu(12.5));
    // Passfedernut-Länge
    s += dimH(m, X(3), X(31), Yl(10) + 44, cy + 3 * k, '28');
    // Schnitt A-A rechts unten
    const sx = 600, sy = 470, R = 10 * 5.2;
    s += Tx(sx, sy - R - 30, 'Schnitt C–C (vergrößert)', 13, 'middle', 'font-weight="bold"');
    const hw = 3 * 5.2, depth = 3.5 * 5.2, ang = Math.asin(hw / R), yTop = sy - Math.sqrt(R * R - hw * hw);
    s += `<path d="M${sx - hw},${yTop} A${R},${R} 0 1 0 ${sx + hw},${yTop} L${sx + hw},${sy - R + depth} L${sx - hw},${sy - R + depth} Z" fill="url(#${m}h1)" stroke="#000" stroke-width="1.7"/>`;
    s += cross(sx, sy, R + 12);
    s += dimV(m, sy - R + depth, sy + R, sx + R + 40, sx + hw, '16,5', sx);
    s += dimH(m, sx - hw, sx + hw, sy - R - 12, sy - R + depth, '6 P9');
    s += Ln(X(8), Yu(10) - 18, X(8), Yu(10) - 6, 'v') + Ln(X(8), Yl(10) + 6, X(8), Yl(10) + 18, 'v') + Tx(X(8) - 6, Yu(10) - 10, 'C', 13, 'end', 'font-weight="bold"') + Tx(X(8) - 6, Yl(10) + 20, 'C', 13, 'end', 'font-weight="bold"');
    // Bohrungsangaben / Hinweise
    const ny = 420;
    const notes = ['Zentrierbohrungen beidseitig ISO 6411 – A 2/4,25', 'Freistiche an den Wellenabsätzen DIN 509 – F 0,6 × 0,3', 'Einstiche für Sicherungsring DIN 471: Ø23,9 × 1,3 breit', 'Lagersitze Ø25 k5: Ra 0,4 · Ø20 k6: Ra 0,8 · übrige Flächen Ra 3,2', 'Alle Kanten ohne Maßangabe: Fase 1 × 45°', 'Vergütet auf Rm = 900 … 1100 N/mm²', 'Rohteil: Rundstahl Ø36 × 225'];
    notes.forEach((t, i) => { s += Tx(70, ny + i * 20, '• ' + t, 13, 'start'); });
    s += titleBlock(70, 630, 620, { name: 'Antriebswelle', werkstoff: '42CrMo4+QT', nr: 'HS-02-001', tol: 'ISO 2768-mK · Tolerierung ISO 8015' });
    return s + '</svg>';
}

function svgImHydraulik() {
    const m = 'arIH';
    let s = `<svg viewBox="0 0 640 760" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 632, 752, 't');
    s += Tx(320, 30, 'Hydraulikschaltplan Hubzylinder', 17, 'middle', 'font-weight="bold"');
    // Zylinder 1A1
    s += Rc(170, 60, 240, 56) + Rc(195, 62, 9, 52, 'fill') + Rc(204, 84, 260, 10, 'vf');
    s += Tx(150, 95, '1A1', 15, 'end', 'font-weight="bold"');
    const xA = 185, xB = 395;
    // Leitung A: Zylinder → 1V3 → 1V2 → Ventil A
    s += Ln(xA, 116, xA, 160) + Ln(xA, 230, xA, 270) + Ln(xA, 340, xA, 380) + Ln(xA, 380, 275, 380) + Ln(275, 380, 275, 440);
    // 1V3 Drosselrückschlagventil (frei zum Zylinder)
    s += Rc(150, 160, 70, 70, 'h');
    s += Ln(xA, 160, xA, 172) + Ln(xA, 218, xA, 230) + Ln(165, 172, 205, 172) + Ln(165, 218, 205, 218);
    s += Ln(165, 172, 165, 187) + Ln(165, 203, 165, 218) + `<path d="M159,187 Q165,195 159,203 M171,187 Q165,195 171,203" class="v"/>` + `<line x1="152" y1="210" x2="178" y2="180" class="t" marker-end="url(#${m})"/>`;
    s += Ln(205, 172, 205, 187) + Ln(205, 209, 205, 218) + Ci(205, 194, 6) + PolyL([[196, 197], [205, 209], [214, 197]]);
    s += Tx(130, 200, '1V3', 15, 'end', 'font-weight="bold"');
    // 1V2 entsperrbares Rückschlagventil
    s += Rc(150, 270, 70, 70, 'h');
    s += Ln(xA, 270, xA, 293) + Ln(xA, 317, xA, 340) + Ci(xA, 300, 7) + PolyL([[xA - 10, 304], [xA, 317], [xA + 10, 304]]);
    s += Tx(130, 310, '1V2', 15, 'end', 'font-weight="bold"');
    // Steuerleitung von B zu 1V2
    s += `<polyline points="220,318 300,318 ${xB},318" class="h"/>` + `<line x1="220" y1="318" x2="${xA + 9}" y2="309" class="h"/>`;
    s += Tx(232, 312, 'X', 11);
    // Leitung B
    s += Ln(xB, 116, xB, 400) + Ln(xB, 400, 305, 400) + Ln(305, 400, 305, 440);
    s += Ci(xB, 318, 3, 'fill');
    // 1V1 4/3-Wegeventil, Mittelstellung Umlauf (P→T, A und B gesperrt)
    const vy = 440, vh = 56;
    s += Rc(200, vy, 60, vh) + Rc(260, vy, 60, vh) + Rc(320, vy, 60, vh);
    // Mitte (gezeichnete Stellung): P→T, A und B gesperrt
    s += `<path d="M275,${vy + vh} L275,${vy + vh - 14} L305,${vy + vh - 14} L305,${vy + vh}" class="t"/>`;
    s += Ln(275, vy, 275, vy + 12, 't') + Ln(269, vy + 12, 281, vy + 12, 't') + Ln(305, vy, 305, vy + 12, 't') + Ln(299, vy + 12, 311, vy + 12, 't');
    // links: P→A, B→T (parallel)
    s += `<line x1="215" y1="${vy + vh}" x2="215" y2="${vy}" class="t" marker-end="url(#${m})"/><line x1="245" y1="${vy}" x2="245" y2="${vy + vh}" class="t" marker-end="url(#${m})"/>`;
    // rechts: P→B, A→T (gekreuzt)
    s += `<line x1="335" y1="${vy + vh}" x2="365" y2="${vy}" class="t" marker-end="url(#${m})"/><line x1="335" y1="${vy}" x2="365" y2="${vy + vh}" class="t" marker-end="url(#${m})"/>`;
    // Federn + Magnete
    s += PolyL([[200, 468], [194, 462], [188, 474], [182, 462], [176, 474], [170, 468]], 't') + Rc(152, 456, 18, 24) + Ln(152, 480, 170, 456, 't');
    s += PolyL([[380, 468], [386, 462], [392, 474], [398, 462], [404, 474], [410, 468]], 't') + Rc(410, 456, 18, 24) + Ln(410, 480, 428, 456, 't');
    s += Tx(161, 448, 'Y1', 12) + Tx(419, 448, 'Y2', 12);
    s += Tx(130, 472, '1V1', 15, 'end', 'font-weight="bold"');
    s += Tx(268, vy - 5, 'A', 12) + Tx(312, vy - 5, 'B', 12) + Tx(268, vy + vh + 14, 'P', 12) + Tx(312, vy + vh + 14, 'T', 12);
    // P-Leitung zur Pumpe, T-Leitung über Filter zum Tank
    s += Ln(275, vy + vh, 275, 650) + Ln(305, vy + vh, 305, 560) + Ln(305, 600, 305, 620);
    // 0Z1 Rücklauffilter
    s += Poly([[305, 560], [325, 580], [305, 600], [285, 580]]) + Ln(287, 580, 323, 580, 'h');
    s += Tx(335, 585, '0Z1', 14, 'start', 'font-weight="bold"');
    s += PolyL([[293, 616], [293, 626], [317, 626], [317, 616]]);
    // Pumpe 0P1 + Motor 0M1
    s += Ci(275, 670, 20) + Poly([[275, 650], [267, 664], [283, 664]], 'fill') + Ln(275, 690, 275, 715) + PolyL([[263, 711], [263, 721], [287, 721], [287, 711]]);
    s += Ln(255, 668, 215, 668) + Ln(255, 673, 215, 673) + Ci(195, 670, 20) + Tx(195, 676, 'M', 16, 'middle', 'font-weight="bold"');
    s += Tx(195, 712, '0M1', 14, 'middle', 'font-weight="bold"') + Tx(305, 676, '0P1', 14, 'start', 'font-weight="bold"');
    // 0V1 Druckbegrenzungsventil (Grundstellung geschlossen)
    s += Ln(275, 640, 420, 640) + Ci(275, 640, 3, 'fill') + Ln(420, 640, 420, 625) + Rc(400, 575, 40, 50);
    s += `<line x1="410" y1="620" x2="410" y2="582" class="t" marker-end="url(#${m})"/>` + Ln(420, 575, 420, 552) + PolyL([[408, 540], [408, 552], [432, 552], [432, 540]]);
    s += PolyL([[440, 600], [446, 594], [452, 606], [458, 594], [464, 606], [470, 600]], 't') + `<line x1="444" y1="616" x2="472" y2="584" class="t" marker-end="url(#${m})"/>`;
    s += `<polyline points="380,640 380,600 400,600" class="h"/>`;
    s += Tx(482, 605, '0V1', 14, 'start', 'font-weight="bold"');
    // 0Z2 Manometer
    s += Ln(275, 530, 230, 530) + Ln(230, 530, 230, 545) + Ci(230, 560, 15) + `<line x1="220" y1="570" x2="240" y2="550" class="t" marker-end="url(#${m})"/>`;
    s += Tx(205, 565, '0Z2', 14, 'end', 'font-weight="bold"');
    return s + '</svg>';
}

function svgImStromlauf() {
    const m = 'arIS';
    let s = `<svg viewBox="0 0 760 650" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 752, 642, 't');
    s += Tx(380, 30, 'Stromlaufplan Steuerstromkreis (Auszug)', 17, 'middle', 'font-weight="bold"');
    const top = 70, bot = 500;
    s += Ln(40, top, 720, top) + Ln(40, bot, 720, bot) + Tx(30, top + 5, 'L1', 13, 'end') + Tx(30, bot + 5, 'N', 13, 'end');
    // Bauelemente
    const opener = (x, y, lab, extra = '') => Ln(x, y, x, y + 14) + Ln(x, y + 46, x, y + 60) + Ln(x, y + 14, x + 12, y + 14, 't') + Ln(x + 12, y + 14, x, y + 46) + Tx(x - 26, y + 34, lab, 12, 'end') + extra;
    const closer = (x, y, lab, extra = '') => Ln(x, y, x, y + 14) + Ln(x, y + 46, x, y + 60) + Ln(x - 12, y + 18, x, y + 46) + Tx(x - 28, y + 34, lab, 12, 'end') + extra;
    const push = (x, y) => Ln(x - 6, y + 30, x - 22, y + 30, 'h') + Ln(x - 22, y + 24, x - 22, y + 36, 'v');
    const coil = (x, y, lab) => Rc(x - 14, y, 28, 22) + Tx(x + 20, y + 16, lab, 12, 'start');
    const lamp = (x, y, lab) => Ci(x, y + 11, 11) + Ln(x - 8, y + 3, x + 8, y + 19, 't') + Ln(x + 8, y + 3, x - 8, y + 19, 't') + Tx(x + 18, y + 16, lab, 12, 'start');
    const valveCoil = (x, y, lab) => Rc(x - 14, y, 28, 22) + Ln(x - 14, y + 22, x + 14, y, 't') + Tx(x + 20, y + 16, lab, 12, 'start');
    const pathNo = (x, n) => Tx(x, bot + 22, n, 12, 'middle', 'fill="#555"');
    // Strompfad 1: F2 – S0 – S1 – S2 ∥ Q1 – Q1-Spule
    let x = 110;
    s += opener(x, top, 'F2') + Tx(x + 16, top + 34, '95/96', 9, 'start');
    s += opener(x, top + 60, 'S0', '') + `<path d="M${x - 30},${top + 82} q8,-10 16,0" class="v"/>` + Ln(x - 22, top + 82, x - 22, top + 90, 'h') + Ln(x - 22, top + 90, x - 6, top + 90, 'h');
    s += opener(x, top + 120, 'S1') + push(x, top + 120);
    s += closer(x, top + 180, 'S2') + push(x, top + 180);
    // Selbsthaltung Q1 13/14 parallel zu S2 (Pfad 2)
    s += Ln(x, top + 180, 190, top + 180) + Ln(190, top + 180, 190, top + 180) + closer(190, top + 180, 'Q1') + Tx(206, top + 214, '13/14', 9, 'start') + Ln(190, top + 240, x, top + 240);
    s += Ln(x, top + 240, x, top + 330) + coil(x, top + 330, 'Q1') + Ln(x, top + 352, x, bot);
    s += pathNo(x, '1') + pathNo(190, '2');
    // Strompfad 3: Q1 23/24 – H1
    x = 300;
    s += closer(x, top, 'Q1') + Tx(x + 6, top + 34, '23/24', 9, 'start') + Ln(x, top + 60, x, top + 330) + lamp(x, top + 330, 'H1') + Ln(x, top + 352, x, bot) + pathNo(x, '3');
    // Strompfad 4: Q1 33/34 – S3 (Heben) – B1 (oben, Öffner) – Y1
    x = 440;
    s += closer(x, top, 'Q1') + Tx(x + 6, top + 34, '33/34', 9, 'start') + Ln(x, top + 60, x, 190);
    s += Ln(x, 190, 520, 190);
    s += closer(x, 190, 'S3') + push(x, 190);
    s += opener(x, 250, 'B1') + Ln(x, 310, x, top + 330) + valveCoil(x, top + 330, 'Y1') + Ln(x, top + 352, x, bot) + pathNo(x, '4');
    // Strompfad 5: S4 (Senken) – B2 (unten, Öffner) – Y2
    x = 600;
    s += Ln(520, 190, x, 190) + closer(x, 190, 'S4') + push(x, 190) + opener(x, 250, 'B2') + Ln(x, 310, x, top + 330) + valveCoil(x, top + 330, 'Y2') + Ln(x, top + 352, x, bot) + pathNo(x, '5');
    s += Ci(440, 190, 3, 'fill');
    // Legende
    const lg = ['F2: Motorschutzrelais Pumpenmotor', 'S0: Not-Halt · S1: Aus · S2: Ein (Pumpe)', 'Q1: Schütz Pumpenmotor 0M1 · H1: Meldeleuchte', 'S3: Taster Heben · S4: Taster Senken', 'B1: Endschalter oben · B2: Endschalter unten', 'Y1, Y2: Magnetspulen von 1V1'];
    lg.forEach((t, i) => { s += Tx(i < 3 ? 50 : 400, 560 + (i % 3) * 20, t, 12.5, 'start'); });
    s += Rc(40, 540, 680, 74, 't');
    return s + '</svg>';
}

const IM_DOCS = [
    { id: 'sit', label: 'Situation', svg: false, html: () => `<div class="paper text">${IM_SITUATION}</div>` },
    { id: 'lag', label: 'Lagereinheit', svg: true, html: svgImLagerung },
    { id: 'wel', label: 'Welle (Pos. 1)', svg: true, html: svgImWelle },
    { id: 'hyd', label: 'Hydraulikplan', svg: true, html: svgImHydraulik },
    { id: 'elt', label: 'Stromlaufplan', svg: true, html: svgImStromlauf },
    { id: 'stl', label: 'Stückliste', svg: false, html: () => stuecklisteHtml('Stückliste Lagereinheit Antriebswelle', IM_STUECKLISTE) }
];
