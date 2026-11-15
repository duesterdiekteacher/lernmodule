/* ============================================================
   Projekt Werkzeugmechaniker: Folgeschneidwerkzeug für ein Halteblech
   Gemeinsamer Zeichnungssatz für AFA und Fertigungstechnik
   ============================================================ */
const WM_SITUATION = `<h3>Situation</h3>
<p>Dein Betrieb stellt ein <b>Halteblech</b> aus DC01 (Blechdicke s = 2 mm) in Großserie her. Gefertigt wird auf einer Exzenterpresse mit <b>250 kN</b> Nennkraft. Das Werkzeug ist ein <b>Folgeschneidwerkzeug</b> mit Säulenführung.</p>
<p>Der Blechstreifen wird von rechts nach links durch das Werkzeug geschoben. In <b>Stufe 1</b> werden die zwei Löcher gestanzt. In <b>Stufe 2</b> zentrieren Fangstifte den Streifen in den Löchern, dann wird das Teil ausgeschnitten. Es fällt durch Schneidplatte und Grundplatte nach unten.</p>
<p>Die Teile haben seit einiger Zeit einen großen <b>Grat</b>. Die Schneidplatte ist verschlissen und hat schon mehrfach nachgeschliffen werden müssen.</p>
<h3>Deine Aufträge</h3>
<ul style="margin-left:1.2rem"><li>die Funktion des Werkzeugs analysieren,</li><li>den Verschleiß beurteilen und das Werkzeug instand setzen,</li><li>eine neue Schneidplatte (Pos. 10) fertigen und prüfen,</li><li>das Werkzeug wieder in der Presse einrichten.</li></ul>
<h3>Technische Daten</h3>
<table><tr><th>Merkmal</th><th>Wert</th></tr>
<tr><td>Werkstoff Streifen</td><td>DC01, s = 2 mm, Scherfestigkeit τ<sub>aB</sub> siehe Aufgabe</td></tr>
<tr><td>Schneidspalt</td><td>u = 0,1 mm (je Seite)</td></tr>
<tr><td>Streifenbreite / Vorschub</td><td>B = 44 mm / V = 32 mm</td></tr>
<tr><td>Presse</td><td>Exzenterpresse, Nennkraft 250 kN, 120 Hübe je Minute</td></tr></table>
<p>Die Zeichnungen sind vereinfacht und nicht maßstäblich. Es gelten nur die eingetragenen Maße.</p>`;

const WM_STUECKLISTE = [
    ['1', '1', 'Kopfplatte', 'S355J2', 'mit Führungsbuchsen'],
    ['2', '1', 'Einspannzapfen', 'Normteil', ''],
    ['3', '1', 'Druckplatte', '90MnCrV8', 'gehärtet 58 HRC'],
    ['4', '1', 'Stempelhalteplatte', 'S355J2', ''],
    ['5', '2', 'Lochstempel Ø6,4', 'HS6-5-2C', 'gehärtet 62 HRC'],
    ['6', '1', 'Ausschneidstempel 39,8 × 29,8', 'X153CrMoV12', 'gehärtet 60 HRC'],
    ['7', '2', 'Fangstift Ø6,3', '90MnCrV8', 'gehärtet, im Ausschneidstempel'],
    ['8', '1', 'Führungsplatte', 'C45', 'feste Abstreifplatte, führt die Stempel'],
    ['9', '2', 'Zwischenleiste', 'C45', 'Streifenführung'],
    ['10', '1', 'Schneidplatte', 'X153CrMoV12', 'gehärtet 60 +2 HRC, Zeichnung FW-03-010'],
    ['11', '1', 'Grundplatte', 'S355J2', 'mit Durchfallöffnungen'],
    ['12', '2', 'Führungssäule', 'Normteil', 'einsatzgehärtet, geschliffen'],
    ['13', '2', 'Führungsbuchse', 'Normteil', ''],
    ['14', '8', 'Zylinderschraube ISO 4762 – M8 × 60 – 10.9', 'Stahl', ''],
    ['15', '4', 'Zylinderstift ISO 8734 – 8 × 60', 'Stahl, gehärtet', ''],
    ['16', '1', 'Einhängestift (Anschlag)', '90MnCrV8', 'gehärtet']
];

function svgWmWerkzeug() {
    const m = 'arWW', k = 2.4, ox = 220, oy = 560;
    const X = x => ox + x * k, Z = z => oy - z * k;
    const H = (x1, z1, x2, z2, n = 1) => HatchR(X(x1), Z(z2), (x2 - x1) * k, (z2 - z1) * k, m, n);
    const R = (x1, z1, x2, z2, c = 'vf') => Rc(X(x1), Z(z2), (x2 - x1) * k, (z2 - z1) * k, c);
    let s = `<svg viewBox="0 0 760 640" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 752, 632, 't');
    s += Tx(380, 26, 'Gesamtzeichnung Folgeschneidwerkzeug (Schnitt durch die Lochreihe, Werkzeug offen)', 15, 'middle', 'font-weight="bold"');
    // Unterteil
    s += H(-70, 0, -5, 30) + H(5, 0, 14, 30) + H(50, 0, 110, 30); // Grundplatte mit Durchfall
    s += H(-30, 30, -3.3, 52, 2) + H(3.3, 30, 17, 52, 2) + H(47, 30, 70, 52, 2); // Schneidplatte
    // Freiraum unter der Schneidkante andeuten (konisch)
    s += Ln(X(-3.3), Z(46), X(-4), Z(30), 't') + Ln(X(3.3), Z(46), X(4), Z(30), 't');
    s += R(-30, 52, 70, 58, 'v'); // Zwischenleiste (dahinter)
    s += Rc(X(-45), Z(54), 125 * k, 2 * k, 'fill'); // Streifen
    s += H(-30, 58, -3.3, 78, 1) + H(3.3, 58, 17, 78, 1) + H(47, 58, 70, 78, 1); // Führungsplatte
    s += R(60, 52, 64, 60) ; // Einhängestift
    // Säulen + Buchsen
    [-55, 95].forEach(x => { s += R(x - 10, 0, x + 10, 170) + R(x - 14, 130, x - 10, 176, 'vf') + R(x + 10, 130, x + 14, 176, 'vf'); });
    // Oberteil
    s += H(-30, 120, -3.3, 140, 2) + H(3.3, 120, 17, 140, 2) + H(47, 120, 70, 140, 2); // Stempelhalteplatte
    s += H(-30, 140, 70, 146, 3); // Druckplatte
    s += H(-70, 146, -69, 176, 1) + H(-41, 146, 81, 176, 1) + H(109, 146, 110, 176, 1); // Kopfplatte
    s += Ln(X(-69), Z(176), X(-41), Z(176)) + Ln(X(-69), Z(146), X(-41), Z(146)) + Ln(X(81), Z(176), X(109), Z(176)) + Ln(X(81), Z(146), X(109), Z(146));
    s += R(4, 176, 36, 214); // Einspannzapfen
    s += Ln(X(20), Z(220), X(20), Z(170), 'c');
    // Stempel
    s += R(-3.2, 66, 3.2, 140) + R(-4.5, 136, 4.5, 140); // Lochstempel mit Kopf
    s += R(17, 66, 47, 140); // Ausschneidstempel
    s += R(28.85, 58, 35.15, 70) + `<path d="M${X(28.85)},${Z(58)} Q${X(32)},${Z(55)} ${X(35.15)},${Z(58)}" class="v"/>`; // Fangstift
    s += Ln(X(32), Z(52), X(32), Z(145), 'c') + Ln(X(0), Z(25), X(0), Z(145), 'c');
    // Positionsnummern
    s += balloon(X(90), Z(165), X(130), Z(200), 1);
    s += balloon(X(30), Z(205), X(70), Z(200), 2);
    s += balloon(X(-20), Z(143), X(-79), Z(150), 3);
    s += balloon(X(-20), Z(130), X(-79), Z(122), 4);
    s += balloon(X(0), Z(100), X(-79), Z(98), 5);
    s += balloon(X(40), Z(100), X(130), Z(110), 6);
    s += balloon(X(33), Z(62), X(130), Z(80), 7);
    s += balloon(X(-20), Z(70), X(-79), Z(74), 8);
    s += balloon(X(-25), Z(55), X(-79), Z(50), 9);
    s += balloon(X(60), Z(40), X(130), Z(48), 10);
    s += balloon(X(-40), Z(15), X(-79), Z(20), 11);
    s += balloon(X(-55), Z(60), X(-79), Z(-12), 12);
    s += balloon(X(97), Z(150), X(130), Z(150), 13);
    s += balloon(X(62), Z(58), X(130), Z(18), 16);
    s += Tx(X(-45) - 4, Z(55) - 6, 'Streifen', 11, 'end', 'fill="#555"');
    s += `<line x1="${X(105)}" y1="${Z(65)}" x2="${X(80)}" y2="${Z(65)}" class="t" marker-end="url(#${m})"/>` + Tx(X(105) + 4, Z(65) + 4, 'Vorschub', 11, 'start', 'fill="#555"');
    s += Tx(X(0), Z(-8), 'Stufe 1', 12) + Tx(X(32), Z(-8), 'Stufe 2', 12);
    s += dimH(m, X(0), X(32), Z(-20), Z(-10), 'V = 32');
    return s + '</svg>';
}

function svgWmTeil() {
    const m = 'arWT', k = 4.2;
    let s = `<svg viewBox="0 0 760 640" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 752, 632, 't');
    s += Tx(380, 30, 'Stanzteil „Halteblech“ und Streifenbild', 17, 'middle', 'font-weight="bold"');
    // Teil: 30 (x) × 40 (y), R5, Löcher Ø6,4 bei y ±13
    const cx = 170, cy = 200;
    const X = x => cx + x * k, Y = y => cy - y * k;
    const rr = (x1, y1, x2, y2, r) => `<rect x="${X(x1)}" y="${Y(y2)}" width="${(x2 - x1) * k}" height="${(y2 - y1) * k}" rx="${r * k}" class="v"/>`;
    s += rr(-15, -20, 15, 20, 5);
    [13, -13].forEach(y => { s += Ci(X(0), Y(y), 3.2 * k) + cross(X(0), Y(y), 3.2 * k + 8); });
    s += Ln(X(-22), Y(0), X(22), Y(0), 'c') + Ln(X(0), Y(26), X(0), Y(-26), 'c');
    s += dimH(m, X(-15), X(15), Y(-20) + 34, Y(-20), '30');
    s += dimV(m, Y(20), Y(-20), X(-15) - 34, X(-15), '40');
    s += dimV(m, Y(13), Y(-13), X(15) + 30, X(3.2), '26 ±0,05', X(3.2));
    s += Tx(X(3) + 24, Y(13) - 22, '2× Ø6,4', 13, 'start') + Ln(X(2.2), Y(15.2), X(3) + 22, Y(13) - 18, 't');
    s += Tx(X(15) + 14, Y(-20) + 18, 'R5', 13, 'start') + Ln(X(12.2), Y(-17.8), X(15) + 12, Y(-20) + 12, 't');
    s += Tx(cx, Y(-20) + 70, 'DC01 · s = 2 mm · Allgemeintoleranz ISO 2768-m', 13);
    // Streifenbild
    const sx = 390, sy = 200, k2 = 3.0;
    const SX = x => sx + x * k2, SY = y => sy - y * k2;
    s += Tx(560, 90, 'Streifenbild (Vorschub von rechts nach links)', 13, 'middle', 'font-weight="bold"');
    s += Rc(SX(0), SY(22), 104 * k2, 44 * k2, 'v');
    // Stufe 1 (x = 80): nur Löcher · Stufe 2 (x = 48): Löcher + ausgeschnitten · davor: ausgeschnitten
    const st1 = 80, st2 = 48, st3 = 16;
    [st1, st2].forEach(x => { [13, -13].forEach(y => { s += Ci(SX(x), SY(y), 3.2 * k2); }); });
    [st2, st3].forEach(x => { s += `<rect x="${SX(x - 15)}" y="${SY(20)}" width="${30 * k2}" height="${40 * k2}" rx="${5 * k2}" class="${x === st3 ? 'v' : 'p'}" fill="${x === st3 ? '#e5e7eb' : 'none'}"/>`; });
    s += Tx(SX(st1), SY(-22) + 22, '1', 13, 'middle', 'font-weight="bold"') + Tx(SX(st2), SY(-22) + 22, '2', 13, 'middle', 'font-weight="bold"');
    s += dimH(m, SX(st2), SX(st1), SY(22) - 18, SY(13), 'V = 32');
    s += dimV(m, SY(22), SY(-22), SX(104) + 26, SX(104), 'B = 44');
    s += Ln(SX(st3 - 8), SY(-21), SX(st3 - 22), SY(-21) + 40, 't') + Tx(SX(st3 - 22) - 4, SY(-21) + 52, 'a = 2', 12, 'end');
    s += dimH(m, SX(st3 + 15), SX(st2 - 15), SY(-22) + 44, SY(-20), 'e = 2');
    s += `<line x1="${SX(110)}" y1="${SY(0)}" x2="${SX(96)}" y2="${SY(0)}" class="t" marker-end="url(#${m})"/>`;
    // Legende
    const ly = 430;
    s += Tx(70, ly, 'Legende Streifenbild:', 13, 'start', 'font-weight="bold"');
    s += Tx(70, ly + 22, 'Stufe 1: Lochen (2 Lochstempel Ø6,4)', 13, 'start');
    s += Tx(70, ly + 42, 'Stufe 2: Fangstifte zentrieren den Streifen in den Löchern, dann Ausschneiden', 13, 'start');
    s += Tx(70, ly + 62, 'grau: Öffnung nach dem Ausschneiden · strichpunktiert: Schnittlinie der Stufe 2', 13, 'start');
    s += Tx(70, ly + 82, 'a = Randbreite · e = Stegbreite · V = Vorschub · B = Streifenbreite', 13, 'start');
    s += titleBlock(70, 550, 620, { name: 'Halteblech', werkstoff: 'DC01', nr: 'FW-03-000', tol: 'ISO 2768-m' });
    return s + '</svg>';
}

function svgWmSchneidplatte() {
    const m = 'arWS', k = 4.4, ox = 110, oyT = 90;
    const X = x => ox + x * k, Y = y => oyT + (80 - y) * k;
    let s = `<svg viewBox="0 0 760 970" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${defs(m)}`;
    s += Rc(4, 4, 752, 962, 't');
    s += Tx(380, 30, 'Schneidplatte – Pos. 10', 17, 'middle', 'font-weight="bold"');
    // Draufsicht 100 × 80
    s += Rc(X(0), Y(80), 100 * k, 80 * k);
    [53, 27].forEach(y => { s += Ci(X(30), Y(y), 3.3 * k) + cross(X(30), Y(y), 3.3 * k + 7); });
    s += `<rect x="${X(47)}" y="${Y(60)}" width="${30 * k}" height="${40 * k}" rx="${5 * k}" class="v"/>` + cross(X(62), Y(40), 8);
    [[8, 8], [92, 72]].forEach(([x, y]) => { s += Ci(X(x), Y(y), 4 * k) + cross(X(x), Y(y), 4 * k + 6); });
    [[8, 72], [92, 8], [50, 8], [50, 72]].forEach(([x, y]) => { s += threadTop(X(x), Y(y), 3.4 * k, 4 * k) + cross(X(x), Y(y), 4 * k + 6); });
    // Schnittverlauf A–A durch die Lochreihe y = 53
    s += Ln(X(-6), Y(53), X(-1), Y(53), 'v') + Ln(X(101), Y(53), X(106), Y(53), 'v') + Tx(X(-8), Y(53) + 5, 'A', 13, 'end', 'font-weight="bold"') + Tx(X(108), Y(53) + 5, 'A', 13, 'start', 'font-weight="bold"');
    // Maße Draufsicht
    s += dimH(m, X(0), X(100), Y(0) + 70, Y(0), '100');
    s += dimH(m, X(0), X(30), Y(0) + 40, Y(27), '30');
    s += dimH(m, X(30), X(62), Y(0) + 40, Y(27), '32 ±0,01', Y(40));
    s += dimV(m, Y(80), Y(0), X(100) + 60, X(100), '80');
    s += dimV(m, Y(53), Y(27), X(0) - 30, X(30) - 16, '26 ±0,01');
    s += dimV(m, Y(60), Y(20), X(100) + 30, X(77), '40 +0,02/0');
    s += dimH(m, X(47), X(77), Y(60) - 22, Y(60), '30 +0,02/0');
    s += Tx(X(30) + 18, Y(53) - 18, '2× Ø6,6 +0,01/0', 12, 'start') + Tx(X(77) + 6, Y(60) - 6, '4× R5', 12, 'start');
    s += Tx(X(8) + 22, Y(8) + 4, '2× Ø8 H7', 11, 'start') + Tx(X(50) + 20, Y(8) + 4, '4× M8', 11, 'start');
    // Schnitt A–A
    const sy = 700, h = 22 * k * 0.9, kk = k;
    const SX = x => ox + x * kk, SZ = z => sy - z * (k * 0.9);
    s += Tx(380, sy - h - 22, 'Schnitt A–A', 13, 'middle', 'font-weight="bold"');
    s += Hatch([[SX(0), SZ(22)], [SX(26.7), SZ(22)], [SX(26.7), SZ(16)], [SX(26), SZ(0)], [SX(0), SZ(0)]], m, 1);
    s += Hatch([[SX(33.3), SZ(22)], [SX(47), SZ(22)], [SX(47), SZ(16)], [SX(46.3), SZ(0)], [SX(34), SZ(0)], [SX(33.3), SZ(16)]], m, 1);
    s += Ln(SX(26.7), SZ(16), SX(26), SZ(0), 'v');
    s += Hatch([[SX(77), SZ(22)], [SX(100), SZ(22)], [SX(100), SZ(0)], [SX(77.7), SZ(0)], [SX(77), SZ(16)]], m, 1);
    s += Ln(SX(26.7), SZ(22), SX(26.7), SZ(16), 'v');
    s += Ln(SX(47), SZ(22), SX(47), SZ(16), 'v') + Ln(SX(77), SZ(22), SX(77), SZ(16), 'v');
    s += Ln(SX(30), SZ(26), SX(30), SZ(-4), 'c') + Ln(SX(62), SZ(26), SX(62), SZ(-4), 'c');
    s += dimV(m, SZ(22), SZ(0), SX(0) - 30, SX(0), '22');
    s += dimV(m, SZ(22), SZ(16), SX(100) + 30, SX(77), '6', SX(77));
    s += Tx(SX(100) + 44, SZ(19) + 4, 'Schneidkantenhöhe', 11, 'start');
    s += Tx(SX(33) + 10, SZ(4), 'Freiwinkel 1°', 11, 'start');
    // Lagetoleranz und Bezug
    s += datumBox(SX(12), SZ(0) + 30, 'A', SX(15), SZ(0) + 1);
    s += tolFrame(SX(80), SZ(22) - 48, 'par', '0,01', 'A') + `<line x1="${SX(88)}" y1="${SZ(22) - 28}" x2="${SX(88)}" y2="${SZ(22)}" class="d" marker-end="url(#${m})"/>`;
    // Hinweise
    const ny = 790;
    ['Durchbrüche drahterodiert, Wände Ra 0,4 · Ober- und Unterseite geschliffen Ra 0,8', 'Gehärtet und angelassen auf 60 +2 HRC', 'Schneidspalt u = 0,1 mm: Lochen → Durchbruch Ø6,4 + 2u · Ausschneiden → Durchbruch = Nennmaß des Teils', 'Unterhalb der Schneidkantenhöhe Freiwinkel 1° (Durchfall)'].forEach((t, i) => { s += Tx(110, ny + i * 20, '• ' + t, 12.5, 'start'); });
    s += titleBlock(110, 880, 560, { name: 'Schneidplatte', werkstoff: 'X153CrMoV12', nr: 'FW-03-010', tol: 'ISO 2768-f · Tolerierung ISO 8015' });
    return s + '</svg>';
}

const WM_DOCS = [
    { id: 'sit', label: 'Situation', svg: false, html: () => `<div class="paper text">${WM_SITUATION}</div>` },
    { id: 'wkz', label: 'Werkzeug', svg: true, html: svgWmWerkzeug },
    { id: 'tei', label: 'Teil + Streifen', svg: true, html: svgWmTeil },
    { id: 'spl', label: 'Schneidplatte (Pos. 10)', svg: true, html: svgWmSchneidplatte },
    { id: 'stl', label: 'Stückliste', svg: false, html: () => stuecklisteHtml('Stückliste Folgeschneidwerkzeug Halteblech', WM_STUECKLISTE) }
];
