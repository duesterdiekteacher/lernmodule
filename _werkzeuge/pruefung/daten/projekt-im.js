/* ============================================================
   Projekt Industriemechaniker: Hubstation mit Rollenbahn-Getriebe
   Gemeinsamer Zeichnungssatz für AFA und Fertigungstechnik
   Kennzeichnung der Betriebsmittel nach DIN EN IEC 81346-2
   ============================================================ */
const IM_SITUATION = `<h3>Situation</h3>
<p>In einer Montagelinie werden Werkstückträger mit einer <b>Hubstation</b> auf eine höhere Ebene gebracht (Anlagenskizze).</p>
<p>Ein Werkstückträger fährt auf den Hubtisch. Der Sensor -BG3 meldet ihn. Ist der Tisch unten (-BG2) und läuft die Hydraulikpumpe, hebt der Hydraulikzylinder -MM1 den Tisch an. Oben (-BG1) schaltet der Getriebemotor -MA2 die Rollen auf dem Tisch ein. Der Werkstückträger fährt auf die obere Rollenbahn. Hat er den Tisch verlassen, senkt sich der Tisch wieder ab (GRAFCET, Blatt 5).</p>
<p>Die Rollen auf dem Hubtisch werden über ein <b>Stirnradgetriebe</b> angetrieben (Blatt 1). Ein Drehstrommotor treibt über einen Keilriemen die Ritzelwelle (Pos. 2) an. Die Abtriebswelle (Pos. 3) treibt über ein Kettenrad die Rollen an.</p>
<p>Das Getriebegehäuse ist zweiteilig. Die Teilfuge liegt in Höhe der Abtriebswelle (in der Zeichnung nicht sichtbar). Das Gehäuseoberteil kann zusammen mit der Ritzelwelle abgehoben werden.</p>
<p>Das Getriebe ist laut geworden, an der Abtriebswelle tritt Öl aus. Es soll instand gesetzt werden. Dabei wird eine neue Abtriebswelle gefertigt (Blatt 3).</p>
<h3>Technische Daten</h3>
<table><tr><th>Bauteil</th><th>Daten</th></tr>
<tr><td>Getriebemotor Rollenbahn -MA2</td><td>Drehstrom 400 V, P = 0,55 kW, n = 1400 1/min</td></tr>
<tr><td>Riementrieb</td><td>Motor-Riemenscheibe d<sub>w1</sub> = 90 mm, Keilriemenscheibe (Pos. 9) d<sub>w2</sub> = 180 mm</td></tr>
<tr><td>Zahnradstufe</td><td>Ritzel z₁ = 17, Stirnrad z₂ = 51, Modul m = 2 mm</td></tr>
<tr><td>Getriebeöl</td><td>CLP 220 nach DIN 51517-3, Ölstand bis Mitte Abtriebswelle</td></tr>
<tr><td>Hydraulikzylinder -MM1</td><td>Kolben-Ø D = 63 mm, Stangen-Ø d = 36 mm, Hub 400 mm</td></tr>
<tr><td>Hydraulikpumpe -GP1</td><td>Konstantpumpe, Q = 12 l/min, Druckbegrenzungsventil -QN1 auf 120 bar</td></tr></table>
<p>Die Zeichnungen sind vereinfacht und nicht maßstäblich. Es gelten nur die eingetragenen Maße.</p>`;

const IM_STUECKLISTE = [
    ['1', '1', 'Getriebegehäuse, zweiteilig', '', 'EN-GJL-250', 'Teilfuge in Höhe der Abtriebswelle'],
    ['2', '1', 'Ritzelwelle', '', '16MnCr5', 'z = 17, m = 2, einsatzgehärtet'],
    ['3', '1', 'Abtriebswelle', '', '42CrMo4+QT', 'Blatt 3'],
    ['4', '1', 'Stirnrad', '', '16MnCr5', 'z = 51, m = 2, einsatzgehärtet'],
    ['5', '2', 'Lagerdeckel mit Bohrung', '', 'S235JR', 'für Wellendichtring'],
    ['6', '1', 'Lagerdeckel geschlossen', '', 'S235JR', 'Abtriebswelle links'],
    ['7', '1', 'Distanzhülse', '', 'E295', ''],
    ['8', '1', 'Lagerdeckel geschlossen, mit Zentrierbund', '', 'S235JR', 'Ritzelwelle rechts'],
    ['9', '1', 'Keilriemenscheibe SPZ', '', 'EN-GJL-200', 'd<sub>w</sub> = 180 mm'],
    ['10', '2', 'Rillenkugellager 6205-2Z', 'DIN 625', '', ''],
    ['11', '2', 'Kegelrollenlager 30206', 'DIN 720', '', ''],
    ['12', '1', 'Radial-Wellendichtring A 25 × 40 × 7', 'DIN 3760', 'NBR', ''],
    ['13', '1', 'Radial-Wellendichtring A 30 × 47 × 7', 'DIN 3760', 'NBR', ''],
    ['14', '1', 'Passfeder A 6 × 6 × 18', 'DIN 6885', 'E295', ''],
    ['15', '1', 'Passfeder A 10 × 8 × 20', 'DIN 6885', 'E295', ''],
    ['16', 'n. B.', 'Passscheiben (Satz)', 'DIN 988', 'Stahl', 'Lagerspiel einstellen'],
    ['17', '1', 'Endscheibe', '', 'S235JR', ''],
    ['18', '1', 'Passfeder A 8 × 7 × 36', 'DIN 6885', 'E295', 'für Kettenrad'],
    ['19', '4', 'O-Ring', 'DIN ISO 3601', 'NBR', 'Abdichtung Lagerdeckel'],
    ['20', '1', 'Verschlussschraube M16 × 1,5', 'DIN 908', '5.8', 'Ölablass'],
    ['21', '1', 'Dichtring A 16 × 20', 'DIN 7603', 'Cu', ''],
    ['22', '1', 'Entlüftungsschraube M12 × 1,5', '', '', 'Kaufteil'],
    ['23', '1', 'Zylinderschraube M8 × 20', 'ISO 4762', '8.8', 'Endscheibe'],
    ['24', '2', 'Sicherungsring 25 × 1,2', 'DIN 471', 'Federstahl', ''],
    ['25', '16', 'Zylinderschraube M6 × 16', 'ISO 4762', '8.8', 'Lagerdeckel (nicht dargestellt)']
];
function stuecklisteHtmlIM(title, rows) {
    return `<div class="paper text" style="max-width:980px"><h3>${title}</h3><table><tr><th>Pos.</th><th>Menge</th><th>Benennung</th><th>Normblatt</th><th>Werkstoff</th><th>Bemerkung</th></tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
}

/* ---------- Blatt 1: Getriebe ---------- */
function svgImGetriebe() {
    const m = 'arIG', k = 2.5, ox = 285, oy = 387;
    const X = x => ox + x * k, Y = y => oy - y * k;
    const P = pts => pts.map(([x, y]) => [X(x), Y(y)]);
    const HP = (pts, n = 1) => Hatch(P(pts), m, n);
    const RR = (x1, y1, x2, y2, cls = 'vf') => Rc(X(x1), Y(Math.max(y1, y2)), (x2 - x1) * k, Math.abs(y2 - y1) * k, cls);
    const HR = (x1, y1, x2, y2, n = 1) => HatchR(X(x1), Y(Math.max(y1, y2)), (x2 - x1) * k, Math.abs(y2 - y1) * k, m, n);
    const yR = 68; // Achse Ritzelwelle
    let s = `<svg viewBox="0 0 780 720" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 772, 712, 't');
    s += Tx(390, 24, 'Blatt 1 – Stirnradgetriebe der Rollenbahn (Schnitt, vereinfacht)', 15, 'middle', 'font-weight="bold"');
    // Gehäuse Pos. 1
    s += HP([[-18, 94], [-18, 112], [16, 112], [16, 100], [0, 100], [0, 91], [-3, 91], [-3, 94]]);
    s += HP([[24, 112], [118, 112], [118, 94], [100, 94], [100, 100], [24, 100]]);
    s += HP([[-18, 42], [-3, 42], [-3, 45], [0, 45], [0, 31], [-18, 31]]);
    s += HP([[100, 42], [118, 42], [118, 31], [100, 31]]);
    s += HP([[-18, -31], [0, -31], [0, -58], [79, -58], [79, -70], [-18, -70]]);
    s += HP([[91, -58], [100, -58], [100, -31], [118, -31], [118, -70], [91, -70]]);
    // Entlüftung Pos. 22 (oben)
    s += RR(16, 100, 24, 112, 'vf') + RR(14, 112, 26, 117, 'vf');
    // Ölablass Pos. 20 + Dichtring Pos. 21
    s += RR(79, -70, 91, -58, 'vf') + Rc(X(78), Y(-70), 14 * k, 1.2 * k, 'fill') + RR(77, -76, 93, -71.2, 'vf');
    // Ölstand
    s += `<line x1="${X(2)}" y1="${Y(-2)}" x2="${X(98)}" y2="${Y(-2)}" stroke="#2563eb" stroke-width="1" stroke-dasharray="6 4"/>` + Tx(X(96), Y(-2) - 4, 'Ölstand', 10, 'end', 'fill="#2563eb"');
    // Abtriebswelle Pos. 3 (nicht geschnitten)
    const wA = [[-18, 15], [-1, 15], [-1, 21], [40, 21], [40, 18], [64, 18], [64, 15], [130, 15], [130, 12.5], [170, 12.5]];
    s += `<path d="M${X(-18)},${Y(15)} ${wA.map(([x, r]) => `L${X(x)},${Y(r)}`).join(' ')} L${X(170)},${Y(-12.5)} ${wA.slice().reverse().map(([x, r]) => `L${X(x)},${Y(-r)}`).join(' ')} Z" class="vf"/>`;
    [[-1, 15], [130, 12.5]].forEach(([x, r]) => { s += Ln(X(x), Y(r), X(x), Y(-r), 't'); });
    // Stirnrad Pos. 4 (geschnitten)
    s += HR(40, 18, 64, 53, 2) + HR(40, -53, 64, -18, 2);
    s += Ln(X(38), Y(51), X(66), Y(51), 'c') + Ln(X(38), Y(-51), X(66), Y(-51), 'c');
    // Passfeder Pos. 15 (Stirnrad)
    s += `<rect x="${X(42)}" y="${Y(21.3)}" width="${20 * k}" height="${8.3 * k}" rx="${4 * k}" class="vf"/>`;
    // Distanzhülse Pos. 7
    s += HR(64, 15, 101, 20, 3) + HR(64, -20, 101, -15, 3);
    // Ritzelwelle Pos. 2 (nicht geschnitten) mit Verzahnung
    const wR = [[-63, 10], [-36, 10], [-36, 12.5], [-3, 12.5], [-3, 15], [40, 15], [40, 19], [64, 19], [64, 15], [101, 15], [101, 12.5], [117.5, 12.5]];
    s += `<path d="M${X(-63)},${Y(yR + 10)} ${wR.map(([x, r]) => `L${X(x)},${Y(yR + r)}`).join(' ')} L${X(117.5)},${Y(yR - 12.5)} ${wR.slice().reverse().map(([x, r]) => `L${X(x)},${Y(yR - r)}`).join(' ')} Z" class="vf"/>`;
    [[-36, 10], [-3, 12.5], [40, 15], [64, 15], [101, 12.5]].forEach(([x, r]) => { s += Ln(X(x), Y(yR + r), X(x), Y(yR - r), 't'); });
    s += Ln(X(40), Y(yR + 14.5), X(64), Y(yR + 14.5), 't') + Ln(X(40), Y(yR - 14.5), X(64), Y(yR - 14.5), 't');
    s += Ln(X(38), Y(yR + 17), X(66), Y(yR + 17), 'c') + Ln(X(38), Y(yR - 17), X(66), Y(yR - 17), 'c');
    // Rillenkugellager Pos. 10 (Ritzelwelle)
    [-18, 101].forEach(x0 => { [1, -1].forEach(sg => {
        s += HR(x0, yR + sg * 22.5, x0 + 15, yR + sg * 26, 3) + HR(x0, yR + sg * 12.5, x0 + 15, yR + sg * 16, 3) + Ci(X(x0 + 7.5), Y(yR + sg * 19.25), 3.2 * k, 'vf');
    }); });
    // Kegelrollenlager Pos. 11 (Abtriebswelle, X-Anordnung)
    [[-18, 1], [101, -1]].forEach(([x0, dir]) => { [1, -1].forEach(sg => {
        s += HR(x0, sg * 26, x0 + 17, sg * 31, 3) + HR(x0, sg * 15, x0 + 17, sg * 19, 3);
        const a = dir > 0 ? [[x0 + 3, 20.5], [x0 + 14, 19.5], [x0 + 15, 24], [x0 + 4, 25.5]] : [[x0 + 14, 20.5], [x0 + 3, 19.5], [x0 + 2, 24], [x0 + 13, 25.5]];
        s += Poly(a.map(([x, r]) => [X(x), Y(sg * r)]), 'vf');
    }); });
    // Lagerdeckel
    const dl5 = [[-30, 14], [-30, 34], [-18, 34], [-18, 20], [-28, 20], [-28, 14]]; // Pos 5 links an Ritzelwelle
    s += HP(dl5.map(([x, r]) => [x, yR + r]), 2) + HP(dl5.map(([x, r]) => [x, yR - r]), 2);
    s += HR(118, yR - 34, 126, yR + 34, 2) + HR(117, yR + 20, 118, yR + 26, 2) + HR(117, yR - 26, 118, yR - 20, 2); // Pos 8 mit Zentrierbund
    s += HR(-28, -34, -18, 34, 2); // Pos 6
    const dr5 = [[118.6, 34], [130.6, 34], [130.6, 16], [128.6, 16], [128.6, 23.5], [118.6, 23.5]]; // Pos 5 rechts
    s += HP(dr5, 2) + HP(dr5.map(([x, r]) => [x, -r]), 2);
    // Passscheiben Pos. 16
    s += Rc(X(118), Y(34), 0.6 * k, 3 * k, 'fill') + Rc(X(118), Y(-31), 0.6 * k, 3 * k, 'fill');
    // RWDR Pos. 12 / 13
    [[-28, yR, 12.5, 20], [121.6, 0, 15, 23.5]].forEach(([x0, c, r1, r2]) => { [1, -1].forEach(sg => {
        const ya = c + sg * r1, yb = c + sg * r2;
        s += RR(x0, ya, x0 + 7, yb, 'vf') + Ln(X(x0), Y(ya), X(x0 + 7), Y(yb), 't') + Ln(X(x0 + 7), Y(ya), X(x0), Y(yb), 't');
    }); });
    // O-Ringe Pos. 19
    [[-18.6, yR + 30], [-18.6, yR - 30], [-18.6, 32.5], [-18.6, -32.5], [117.4, yR + 30], [117.4, yR - 30]].forEach(([x, y]) => { s += Ci(X(x), Y(y), 3, 'fill'); });
    // Sicherungsringe Pos. 24
    [-19.3, 116].forEach(x0 => { [1, -1].forEach(sg => { s += Rc(X(x0), Y(yR + sg * (sg > 0 ? 15 : 11.95)), 1.3 * k, 3.05 * k, 'fill'); }); });
    // Keilriemenscheibe Pos. 9 + Endscheibe Pos. 17 + Schraube Pos. 23
    [1, -1].forEach(sg => {
        const pts = [[-60, 10], [-60, 40], [-56, 40], [-53, 34], [-50, 40], [-46, 40], [-43, 34], [-40, 40], [-36, 40], [-36, 10]];
        s += HP(pts.map(([x, r]) => [x, yR + sg * r]), 3);
    });
    s += `<rect x="${X(-57)}" y="${Y(yR + 13.5)}" width="${18 * k}" height="${7 * k}" rx="${3 * k}" class="vf"/>`; // Passfeder Pos 14
    s += HR(-66, yR - 15, -63, yR + 15, 1);
    s += RR(-72, yR - 6.5, -66, yR + 6.5, 'vf') + Ln(X(-63), Y(yR + 4), X(-45), Y(yR + 4), 'h') + Ln(X(-63), Y(yR - 4), X(-45), Y(yR - 4), 'h');
    // Passfeder Pos. 18 (Abtrieb)
    s += `<rect x="${X(133)}" y="${Y(16)}" width="${36 * k}" height="${7 * k}" rx="${3.5 * k}" class="vf"/>`;
    // Mittellinien
    s += Ln(X(-76), Y(yR), X(130), Y(yR), 'c') + Ln(X(-34), Y(0), X(175), Y(0), 'c');
    // Positionsnummern
    const items = [
        [-26, 98, 'T', 5], [-10.5, 87.25, 'T', 10], [20, 115, 'T', 22], [60, 106, 'T', 1], [80, 81, 'T', 2],
        [-55, 98, 'L', 9], [-24.5, yR + 16, 'L', 12], [-48, yR + 10, 'L', 14], [-69, yR - 3, 'L', 23], [-64.5, yR - 11, 'L', 17], [-23, -25, 'L', 6],
        [122, 92, 'R', 8], [116.6, yR - 13.5, 'R', 24], [117.4, yR - 30, 'R', 19], [125, 28, 'R', 5], [150, 12.5, 'R', 18], [125, -19, 'R', 13], [118.3, -29.5, 'R', 16],
        [20, -5, 'B', 3], [46, 17, 'B', 15], [58, -40, 'B', 4], [75, -17.5, 'B', 7], [85, -64, 'B', 20], [90, -73.6, 'B', 21], [106, -22.5, 'B', 11]
    ].map(([x, y, sd, n]) => [X(x), Y(y), sd, n]);
    s += balloonsAuto(items, { L: 40, R: 745, T: 52, B: 655, Lr: [80, 620], Rr: [80, 620], Tr: [60, 720], Br: [60, 720] });
    s += Tx(X(-48), Y(yR - 40) + 16, 'Antrieb', 10, 'middle', 'fill="#555"');
    s += Tx(X(170), Y(16) - 6, 'zum Kettenrad', 10, 'end', 'fill="#555"');
    return s + '</svg>';
}

/* ---------- Blatt 3: Abtriebswelle ---------- */
function svgImWelle() {
    const m = 'arIW', k = 3.1, ox = 70, cy = 200;
    const X = x => ox + x * k, Yu = r => cy - r * k, Yl = r => cy + r * k;
    let s = `<svg viewBox="0 0 760 760" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 752, 752, 't');
    s += Tx(380, 30, 'Blatt 3 – Abtriebswelle Pos. 3', 17, 'middle', 'font-weight="bold"');
    const seg = [[0, 17, 15], [17, 58, 21], [58, 82, 18], [82, 148, 15], [148, 188, 12.5]];
    seg.forEach(([a, b, r]) => { s += Rc(X(a), Yu(r), (b - a) * k, 2 * r * k, 'vf'); });
    s += Ln(X(1), Yu(15), X(1), Yl(15), 't') + Ln(X(187), Yu(12.5), X(187), Yl(12.5), 't');
    [[60, 80, 5], [150, 186, 3.5]].forEach(([a, b, hw]) => { s += `<rect x="${X(a)}" y="${cy - hw * k}" width="${(b - a) * k}" height="${2 * hw * k}" rx="${hw * k}" class="v"/>`; });
    s += Ln(X(-5), cy, X(193), cy, 'c');
    s += datumBox(X(8) - 10, Yl(15) + 30, 'A', X(8), Yl(15));
    s += datumBox(X(127) - 10, Yl(15) + 30, 'B', X(127), Yl(15));
    s += tolFrame(X(48), Yu(21) - 66, 'runout', '0,02', 'A-B') + `<line x1="${X(62)}" y1="${Yu(21) - 46}" x2="${X(62)}" y2="${Yu(18)}" class="d" marker-end="url(#${m})"/>`;
    const dd = (x, r, lab) => `<line x1="${X(x)}" y1="${Yu(r)}" x2="${X(x)}" y2="${Yl(r)}" class="d" marker-start="url(#${m})" marker-end="url(#${m})"/>` + `<text x="${X(x) - 5}" y="${cy}" font-size="13" text-anchor="middle" transform="rotate(-90 ${X(x) - 5} ${cy})">${lab}</text>`;
    const ddE = (x, r, lab) => `<line x1="${X(x)}" y1="${Yu(r)}" x2="${X(x)}" y2="${Yl(r)}" class="d" marker-start="url(#${m})" marker-end="url(#${m})"/>` + Tx(X(x), Yu(r) - 8, lab, 13);
    s += dd(9, 15, 'Ø30 k6') + dd(37, 21, 'Ø42')  + dd(115, 15, 'Ø30 k6') + dimV(m, Yu(12.5), Yl(12.5), X(199), X(188), 'Ø25 k6');
    const yL = Yl(21) + 75;
    [[0, 17, '17', 15, 21], [17, 58, '41', 21, 21], [58, 82, '24', 21, 18], [82, 148, '66', 18, 15], [148, 188, '40', 15, 12.5]].forEach(([a, b, l, ra, rb]) => { s += dimH(m, X(a), X(b), yL, Yl(ra), l, Yl(rb)); });
    s += dimH(m, X(0), X(188), yL + 32, Yl(15), '188', Yl(12.5));
    s += dimH(m, X(60), X(80), Yl(18) + 36, cy + 5 * k, '20', cy + 5 * k);
    s += dimH(m, X(150), X(186), Yl(12.5) + 30, cy + 3.5 * k, '36', cy + 3.5 * k);
    // Schnitt C–C
    const sx = 610, sy = 520, R = 18 * 3.2;
    const hw = 5 * 3.2, yTop = sy - Math.sqrt(R * R - hw * hw), dep = 5 * 3.2;
    s += Tx(sx, sy - R - 34, 'Schnitt C–C', 13, 'middle', 'font-weight="bold"');
    s += `<path d="M${sx - hw},${yTop} A${R},${R} 0 1 0 ${sx + hw},${yTop} L${sx + hw},${sy - R + dep} L${sx - hw},${sy - R + dep} Z" fill="url(#${m}h1)" stroke="#000" stroke-width="1.7"/>`;
    s += cross(sx, sy, R + 12);
    s += dimV(m, sy - R + dep, sy + R, sx + R + 40, sx + hw, '31', sx);
    s += dimH(m, sx - hw, sx + hw, sy - R - 14, sy - R + dep, '') + Tx(sx + hw + 8, sy - R - 10, '10 P9', 13, 'start');
    s += Ln(X(76), Yu(18) - 16, X(76), Yu(18) - 4, 'v') + Ln(X(76), Yl(18) + 4, X(76), Yl(18) + 16, 'v') + Tx(X(76) - 5, Yu(18) - 5, 'C', 13, 'end', 'font-weight="bold"') + Tx(X(76) - 5, Yl(18) + 15, 'C', 13, 'end', 'font-weight="bold"');
    { const c = Math.SQRT1_2 * R; s += `<line x1="${sx + c}" y1="${sy + c}" x2="${sx - c}" y2="${sy - c}" class="d" marker-start="url(#${m})" marker-end="url(#${m})"/>` + Ln(sx - c, sy - c, sx - c - 18, sy - c - 18, 'd') + Ln(sx - c - 18, sy - c - 18, sx - c - 78, sy - c - 18, 'd') + Tx(sx - c - 48, sy - c - 22, 'Ø36 n6', 13); }
    const ny = 450;
    ['Zentrierbohrungen beidseitig ISO 6411 – A 2,5/5,3', 'Freistiche an allen Wellenabsätzen DIN 509 – F 0,6 × 0,3', 'Lagersitze Ø30 k6: Ra 0,8 · Ø36 n6 und Ø25 k6: Ra 1,6', 'Laufbahn Wellendichtring auf Ø30 rechts: Ra 0,4, drallfrei geschliffen', 'Übrige Flächen Ra 3,2 · nicht bemaßte Kanten: Fase 1 × 45°', 'Rohteil: Rundstahl Ø48 × 193, vergütet'].forEach((t, i) => { s += Tx(70, ny + i * 21, '• ' + t, 12.5, 'start'); });
    s += titleBlock(70, 680, 620, { name: 'Abtriebswelle', werkstoff: '42CrMo4+QT', nr: 'RB-01-003', tol: 'ISO 2768-mK · Tolerierung ISO 8015' });
    return s + '</svg>';
}

/* ---------- Anlagenskizze ---------- */
function svgImAnlage() {
    const m = 'arIA';
    let s = `<svg viewBox="0 0 760 460" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 752, 452, 't');
    s += Tx(380, 28, 'Anlagenskizze Hubstation (vereinfacht)', 16, 'middle', 'font-weight="bold"');
    const roll = (x1, x2, y) => { let t = Rc(x1, y, x2 - x1, 10, 'vf'); for (let x = x1 + 14; x < x2 - 6; x += 26) t += Ci(x, y + 5, 7, 'vf'); return t; };
    s += roll(30, 280, 330) + Tx(155, 365, 'Rollenbahn unten (Zulauf)', 12);
    s += roll(480, 730, 150) + Tx(605, 185, 'Rollenbahn oben (Ablauf)', 12);
    s += Rc(300, 150, 160, 10, 'vf'); for (let x = 316; x < 450; x += 26) s += Ci(x, 155, 7, 'vf');
    s += `<rect x="300" y="330" width="160" height="10" class="p"/>`;
    s += Tx(380, 100, 'Hubtisch (obere Lage, untere Lage strichpunktiert)', 12);
    s += Rc(330, 112, 90, 36, 'grey') + Tx(375, 135, 'WT', 12);
    s += Rc(440, 165, 40, 26, 'vf') + Tx(460, 183, 'M', 13, 'middle', 'font-weight="bold"') + Tx(486, 214, '-MA2 mit Getriebe (Blatt 1)', 11, 'start');
    s += Rc(360, 250, 40, 160, 'vf') + Rc(374, 160, 12, 90, 'vf') + Rc(362, 300, 36, 6, 'fill');
    s += Tx(410, 300, '-MM1', 13, 'start', 'font-weight="bold"');
    s += Rc(470, 140, 14, 10, 'vf') + Tx(488, 136, '-BG1 (oben)', 11, 'start');
    s += Rc(470, 320, 14, 10, 'vf') + Tx(488, 316, '-BG2 (unten)', 11, 'start');
    s += Rc(296, 110, 10, 14, 'vf') + `<line x1="306" y1="117" x2="330" y2="117" stroke="#dc2626" stroke-width="1.2" stroke-dasharray="4 3"/>` + Tx(290, 122, '-BG3 (WT da)', 11, 'end');
    s += `<line x1="230" y1="312" x2="290" y2="312" class="t" marker-end="url(#${m})"/>` + `<line x1="470" y1="114" x2="530" y2="114" class="t" marker-end="url(#${m})"/>`;
    s += `<line x1="345" y1="322" x2="345" y2="172" class="t" marker-end="url(#${m})" marker-start="url(#${m})"/>` + Tx(338, 250, 'Hub 400', 11, 'end');
    s += Rc(560, 360, 140, 60, 'vf') + Tx(630, 386, 'Hydraulikaggregat', 11) + Tx(630, 402, '-GP1, -MA1, -QN1', 11);
    s += `<path d="M560,390 L400,390" class="h"/>`;
    return s + '</svg>';
}

/* ---------- Blatt 5: GRAFCET ---------- */
function svgImGrafcet() {
    const m = 'arIF';
    let s = `<svg viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 632, 632, 't');
    s += Tx(320, 28, 'Blatt 5 – GRAFCET Hubstation (Automatikbetrieb, DIN EN 60848)', 15, 'middle', 'font-weight="bold"');
    const x = 150, w = 40;
    const step = (y, n, init) => Rc(x - w / 2, y, w, w) + (init ? Rc(x - w / 2 + 4, y + 4, w - 8, w - 8) : '') + Tx(x, y + 26, n, 15, 'middle', 'font-weight="bold"');
    const act = (y, label, comment) => Ln(x + w / 2, y + w / 2, x + w / 2 + 30, y + w / 2) + Rc(x + w / 2 + 30, y + 6, 90, 28) + Tx(x + w / 2 + 75, y + 25, label, 14) + (comment ? Tx(x + w / 2 + 130, y + 25, comment, 12, 'start', 'fill="#444"') : '');
    const trans = (y, txt, comment) => Ln(x - 12, y, x + 12, y, 'v') + Tx(x + 22, y + 5, txt, 14, 'start') + (comment ? Tx(x + 22, y + 22, comment, 11, 'start', 'fill="#444"') : '');
    const ys = [60, 170, 280, 390];
    s += step(ys[0], '1', true) + Tx(x + w / 2 + 14, ys[0] + 25, '„Grundstellung“', 12, 'start', 'fill="#444"');
    s += Ln(x, ys[0] + w, x, ys[1]) + trans((ys[0] + w + ys[1]) / 2, '-QA1 · -BG2 · -BG3', 'Pumpe läuft · Tisch unten · Werkstückträger auf dem Tisch');
    s += step(ys[1], '2') + act(ys[1], '-MB1', '„Tisch heben“');
    s += Ln(x, ys[1] + w, x, ys[2]) + trans((ys[1] + w + ys[2]) / 2, '-BG1', 'Tisch oben');
    s += step(ys[2], '3') + act(ys[2], '-MA2', '„WT abfördern“');
    const ty3 = (ys[2] + w + ys[3]) / 2;
    s += Ln(x, ys[2] + w, x, ys[3]) + Ln(x - 12, ty3, x + 12, ty3, 'v') + Tx(x + 22, ty3 + 5, '-BG3', 14, 'start') + Ln(x + 22, ty3 - 10, x + 58, ty3 - 10, 't') + Tx(x + 22, ty3 + 22, 'Werkstückträger hat den Tisch verlassen', 11, 'start', 'fill="#444"');
    s += step(ys[3], '4') + act(ys[3], '-MB2', '„Tisch senken“');
    const ty4 = ys[3] + w + 30;
    s += Ln(x, ys[3] + w, x, ty4 + 20) + trans(ty4, '-BG2', 'Tisch unten');
    s += PolyL([[x, ty4 + 20], [x, ty4 + 40], [x - 70, ty4 + 40], [x - 70, ys[0] - 20], [x, ys[0] - 20], [x, ys[0]]]);
    s += Poly([[x - 75, 300], [x - 65, 300], [x - 70, 290]], 'fill');
    const lg = ['-QA1: Schütz Pumpenmotor -MA1 (Pumpe läuft)', '-BG1: Endschalter Tisch oben', '-BG2: Endschalter Tisch unten', '-BG3: Lichttaster Werkstückträger auf dem Tisch', '-MB1 / -MB2: Magnetspulen des Wegeventils -QM1', '-MA2: Getriebemotor Rollen auf dem Hubtisch'];
    s += Rc(330, 470, 292, 140, 't');
    lg.forEach((t, i) => { s += Tx(338, 492 + i * 20, t, 11.5, 'start'); });
    return s + '</svg>';
}

/* ---------- Blatt 4 und 6 ---------- */
function svgImHydraulik() {
    const m = 'arIH';
    let s = `<svg viewBox="0 0 640 760" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 632, 752, 't');
    s += Tx(320, 30, 'Blatt 4 – Hydraulikschaltplan Hubzylinder', 17, 'middle', 'font-weight="bold"');
    // Zylinder 1A1
    s += Rc(170, 60, 240, 56) + Rc(195, 62, 9, 52, 'fill') + Rc(204, 84, 260, 10, 'vf');
    s += Tx(150, 95, '-MM1', 15, 'end', 'font-weight="bold"');
    const xA = 185, xB = 395;
    // Leitung A: Zylinder → 1V3 → 1V2 → Ventil A
    s += Ln(xA, 116, xA, 160) + Ln(xA, 230, xA, 270) + Ln(xA, 340, xA, 380) + Ln(xA, 380, 275, 380) + Ln(275, 380, 275, 440);
    // 1V3 Drosselrückschlagventil (frei zum Zylinder)
    s += Rc(150, 160, 70, 70, 'h');
    s += Ln(xA, 160, xA, 172) + Ln(xA, 218, xA, 230) + Ln(165, 172, 205, 172) + Ln(165, 218, 205, 218);
    s += Ln(165, 172, 165, 187) + Ln(165, 203, 165, 218) + `<path d="M159,187 Q165,195 159,203 M171,187 Q165,195 171,203" class="v"/>` + `<line x1="152" y1="210" x2="178" y2="180" class="t" marker-end="url(#${m})"/>`;
    s += Ln(205, 172, 205, 187) + Ln(205, 209, 205, 218) + Ci(205, 194, 6) + PolyL([[196, 197], [205, 209], [214, 197]]);
    s += Tx(130, 200, '-RN1', 15, 'end', 'font-weight="bold"');
    // 1V2 entsperrbares Rückschlagventil
    s += Rc(150, 270, 70, 70, 'h');
    s += Ln(xA, 270, xA, 293) + Ln(xA, 317, xA, 340) + Ci(xA, 300, 7) + PolyL([[xA - 10, 304], [xA, 317], [xA + 10, 304]]);
    s += Tx(130, 310, '-RM1', 15, 'end', 'font-weight="bold"');
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
    s += Tx(161, 448, '-MB1', 12) + Tx(419, 448, '-MB2', 12);
    s += Tx(130, 472, '-QM1', 15, 'end', 'font-weight="bold"');
    s += Tx(268, vy - 5, 'A', 12) + Tx(312, vy - 5, 'B', 12) + Tx(268, vy + vh + 14, 'P', 12) + Tx(312, vy + vh + 14, 'T', 12);
    // P-Leitung zur Pumpe, T-Leitung über Filter zum Tank
    s += Ln(275, vy + vh, 275, 650) + Ln(305, vy + vh, 305, 560) + Ln(305, 600, 305, 620);
    // 0Z1 Rücklauffilter
    s += Poly([[305, 560], [325, 580], [305, 600], [285, 580]]) + Ln(287, 580, 323, 580, 'h');
    s += Tx(335, 585, '-HQ1', 14, 'start', 'font-weight="bold"');
    s += PolyL([[293, 616], [293, 626], [317, 626], [317, 616]]);
    // Pumpe 0P1 + Motor 0M1
    s += Ci(275, 670, 20) + Poly([[275, 650], [267, 664], [283, 664]], 'fill') + Ln(275, 690, 275, 715) + PolyL([[263, 711], [263, 721], [287, 721], [287, 711]]);
    s += Ln(255, 668, 215, 668) + Ln(255, 673, 215, 673) + Ci(195, 670, 20) + Tx(195, 676, 'M', 16, 'middle', 'font-weight="bold"');
    s += Tx(195, 712, '-MA1', 14, 'middle', 'font-weight="bold"') + Tx(305, 676, '-GP1', 14, 'start', 'font-weight="bold"');
    // 0V1 Druckbegrenzungsventil (Grundstellung geschlossen)
    s += Ln(275, 640, 420, 640) + Ci(275, 640, 3, 'fill') + Ln(420, 640, 420, 625) + Rc(400, 575, 40, 50);
    s += `<line x1="410" y1="620" x2="410" y2="582" class="t" marker-end="url(#${m})"/>` + Ln(420, 575, 420, 552) + PolyL([[408, 540], [408, 552], [432, 552], [432, 540]]);
    s += PolyL([[440, 600], [446, 594], [452, 606], [458, 594], [464, 606], [470, 600]], 't') + `<line x1="444" y1="616" x2="472" y2="584" class="t" marker-end="url(#${m})"/>`;
    s += `<polyline points="380,640 380,600 400,600" class="h"/>`;
    s += Tx(482, 605, '-QN1', 14, 'start', 'font-weight="bold"');
    // 0Z2 Manometer
    s += Ln(275, 530, 230, 530) + Ci(275, 530, 3, 'fill') + Ln(230, 530, 230, 545) + Ci(230, 560, 15) + `<line x1="220" y1="570" x2="240" y2="550" class="t" marker-end="url(#${m})"/>`;
    s += Tx(205, 565, '-PG1', 14, 'end', 'font-weight="bold"');
    return s + '</svg>';
}

function svgImStromlauf() {
    const m = 'arIS';
    let s = `<svg viewBox="0 0 760 650" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 752, 642, 't');
    s += Tx(380, 30, 'Blatt 6 – Stromlaufplan Steuerstromkreis (Auszug, Einrichtbetrieb)', 17, 'middle', 'font-weight="bold"');
    const top = 70, bot = 500;
    s += Ln(40, top, 720, top) + Ln(40, bot, 720, bot) + Tx(30, top + 5, 'L1', 13, 'end') + Tx(30, bot + 5, 'N', 13, 'end');
    // Bauelemente
    const opener = (x, y, lab, extra = '', dx = 26) => Ln(x, y, x, y + 14) + Ln(x, y + 46, x, y + 60) + Ln(x, y + 14, x + 12, y + 14, 't') + Ln(x + 12, y + 14, x, y + 46) + Tx(x - dx, y + 34, lab, 12, 'end') + extra;
    const closer = (x, y, lab, extra = '', dx = 28) => Ln(x, y, x, y + 14) + Ln(x, y + 46, x, y + 60) + Ln(x - 12, y + 18, x, y + 46) + Tx(x - dx, y + 34, lab, 12, 'end') + extra;
    const push = (x, y) => Ln(x - 6, y + 30, x - 22, y + 30, 'h') + Ln(x - 22, y + 24, x - 22, y + 36, 'v');
    const coil = (x, y, lab) => Rc(x - 14, y, 28, 22) + Tx(x + 20, y + 16, lab, 12, 'start');
    const lamp = (x, y, lab) => Ci(x, y + 11, 11) + Ln(x - 8, y + 3, x + 8, y + 19, 't') + Ln(x + 8, y + 3, x - 8, y + 19, 't') + Tx(x + 18, y + 16, lab, 12, 'start');
    const valveCoil = (x, y, lab) => Rc(x - 14, y, 28, 22) + Ln(x - 14, y + 22, x + 14, y, 't') + Tx(x + 20, y + 16, lab, 12, 'start');
    const pathNo = (x, n) => Tx(x, bot + 22, n, 12, 'middle', 'fill="#555"');
    // Strompfad 1: F2 – S0 – S1 – S2 ∥ Q1 – Q1-Spule
    let x = 110;
    s += opener(x, top, '-FC1') + Tx(x + 16, top + 34, '95/96', 9, 'start');
    s += opener(x, top + 60, '-SF0', '', 38) + `<path d="M${x - 30},${top + 82} q8,-10 16,0" class="v"/>` + Ln(x - 22, top + 82, x - 22, top + 90, 'h') + Ln(x - 22, top + 90, x - 6, top + 90, 'h');
    s += opener(x, top + 120, '-SF1', '', 30) + push(x, top + 120);
    s += closer(x, top + 180, '-SF2', '', 30) + push(x, top + 180);
    // Selbsthaltung Q1 13/14 parallel zu S2 (Pfad 2)
    s += Ln(x, top + 180, 190, top + 180) + Ln(190, top + 180, 190, top + 180) + closer(190, top + 180, '-QA1') + Tx(206, top + 214, '13/14', 9, 'start') + Ln(190, top + 240, x, top + 240) + Ci(x, top + 180, 3, 'fill') + Ci(x, top + 240, 3, 'fill');
    s += Ln(x, top + 240, x, top + 330) + coil(x, top + 330, '-QA1') + Ln(x, top + 352, x, bot);
    s += pathNo(x, '1') + pathNo(190, '2');
    // Strompfad 3: Q1 23/24 – H1
    x = 300;
    s += closer(x, top, '-QA1') + Tx(x + 6, top + 34, '23/24', 9, 'start') + Ln(x, top + 60, x, top + 330) + lamp(x, top + 330, '-PF1') + Ln(x, top + 352, x, bot) + pathNo(x, '3');
    // Strompfad 4: Q1 33/34 – S3 (Heben) – B1 (oben, Öffner) – Y1
    x = 440;
    s += closer(x, top, '-QA1') + Tx(x + 6, top + 34, '33/34', 9, 'start') + Ln(x, top + 60, x, 190);
    s += Ln(x, 190, 520, 190);
    s += closer(x, 190, '-SF3', '', 30) + push(x, 190);
    s += opener(x, 250, '-BG1') + Ln(x, 310, x, top + 330) + valveCoil(x, top + 330, '-MB1') + Ln(x, top + 352, x, bot) + pathNo(x, '4');
    // Strompfad 5: S4 (Senken) – B2 (unten, Öffner) – Y2
    x = 600;
    s += Ln(520, 190, x, 190) + closer(x, 190, '-SF4', '', 30) + push(x, 190) + opener(x, 250, '-BG2') + Ln(x, 310, x, top + 330) + valveCoil(x, top + 330, '-MB2') + Ln(x, top + 352, x, bot) + pathNo(x, '5');
    s += Ci(440, 190, 3, 'fill');
    // Legende
    const lg = ['-FC1: Motorschutz Pumpenmotor -MA1', '-SF0: Not-Halt · -SF1: Aus · -SF2: Ein (Pumpe)', '-QA1: Schütz Pumpenmotor · -PF1: Meldeleuchte', '-SF3: Taster Heben · -SF4: Taster Senken', '-BG1: Endschalter oben · -BG2: Endschalter unten', '-MB1, -MB2: Magnetspulen von -QM1']
    lg.forEach((t, i) => { s += Tx(i < 3 ? 50 : 400, 560 + (i % 3) * 20, t, 12.5, 'start'); });
    s += Rc(40, 540, 680, 74, 't');
    return s + '</svg>';
}

const IM_DOCS = [
    { id: 'sit', label: 'Situation', svg: false, html: () => `<div class="paper text">${IM_SITUATION}</div>` },
    { id: 'anl', label: 'Anlagenskizze', svg: true, html: svgImAnlage },
    { id: 'get', label: 'Blatt 1 Getriebe', svg: true, html: svgImGetriebe },
    { id: 'stl', label: 'Blatt 2 Stückliste', svg: false, html: () => stuecklisteHtmlIM('Blatt 2 – Stückliste Stirnradgetriebe', IM_STUECKLISTE) },
    { id: 'wel', label: 'Blatt 3 Abtriebswelle', svg: true, html: svgImWelle },
    { id: 'hyd', label: 'Blatt 4 Hydraulik', svg: true, html: svgImHydraulik },
    { id: 'gra', label: 'Blatt 5 GRAFCET', svg: true, html: svgImGrafcet },
    { id: 'elt', label: 'Blatt 6 Stromlaufplan', svg: true, html: svgImStromlauf }
];
