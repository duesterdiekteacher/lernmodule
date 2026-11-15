/* ============================================================
   AP Teil 2 – Werkzeugmechaniker – Auftrags- und Funktionsanalyse
   ============================================================ */
function introAfaFt(name, min) {
    return `<h2>So läuft die Prüfung</h2>
    <ul class="steps">
      <li>Prüfungsbereich <b>${name}</b>. Du hast <b>${min} Minuten</b>. Die Uhr läuft oben rückwärts.</li>
      <li><b>Teil A:</b> 28 Aufgaben zum Ankreuzen. Pro Aufgabe ist genau eine Antwort richtig.</li>
      <li>In Teil A musst du <b>3 Aufgaben abwählen</b>. Die 8 Aufgaben mit 🔒 (Mathematik und Technische Kommunikation) kannst du nicht abwählen.</li>
      <li>Wählst du nicht ab, werden die <b>letzten 3 abwählbaren Aufgaben</b> nicht gewertet.</li>
      <li><b>Teil B:</b> 8 Aufgaben mit je 10 Punkten. Keine Abwahl.</li>
      <li>Alle Aufgaben beziehen sich auf die Unterlagen hinter dem Knopf <b>📐 Zeichnung</b>.</li>
    </ul>
    <div class="info warn"><b>Hilfsmittel:</b> Tabellenbuch Metall, Taschenrechner, Papier für Nebenrechnungen.</div>
    <table class="tbl"><tr><th>Teil</th><th>Aufgaben</th><th>Punkte</th><th>Anteil</th></tr>
    <tr><td>A – gebunden</td><td>28, davon 3 abwählen</td><td>25 × 1 Punkt</td><td>50 %</td></tr>
    <tr><td>B – ungebunden</td><td>8, keine Abwahl</td><td>8 × 10 Punkte</td><td>50 %</td></tr></table>`;
}
const EXAM = {
    id: 'afa-wm', key: 'ap2-afa-wm-1', summary: true,
    title: 'Auftrags- und Funktionsanalyse', subtitle: 'Abschlussprüfung Teil 2 · Werkzeugmechaniker/-in · Projekt Folgeschneidwerkzeug',
    logo: '🔍', back: './', backLabel: '← Zurück zur Übersicht Teil 2',
    duration: 105, aAbw: 3, aWeight: 0.5, bAbw: 0, bWeight: 0.5,
    intro: introAfaFt('Auftrags- und Funktionsanalyse', 105),
    bIntro: '<p>Arbeite mit den Unterlagen (📐 Zeichnung) und deinem Tabellenbuch. Gib Zahlen mit Komma oder Punkt ein.</p>',
    docs: WM_DOCS,
    cats: { FUN: 'Funktion des Werkzeugs', SCHN: 'Schneidtechnik', PRE: 'Pressen und Sicherheit', INS: 'Instandhaltung', WST: 'Werkstofftechnik', QS: 'Prüftechnik und Qualität', TM: 'Technische Mathematik', TK: 'Technische Kommunikation' },
    aDef: [
 { cat: 'TK', lock: true, q: 'Welche Position richtet den Streifen in Stufe 2 genau aus, bevor ausgeschnitten wird?',
   o: ['Pos. 7 – Fangstifte', 'Pos. 16 – Einhängestift', 'Pos. 9 – Zwischenleisten', 'Pos. 3 – Druckplatte', 'Pos. 12 – Führungssäulen'],
   e: 'Die Fangstifte tauchen in die gelochten Löcher. So liegt der Streifen genau, bevor der Ausschneidstempel schneidet.' },
 { cat: 'FUN', q: 'Welche Aufgaben hat die Führungsplatte (Pos. 8)?',
   o: ['Sie führt die Stempel und streift beim Rückhub den Streifen von den Stempeln ab.', 'Sie nimmt die Schneidkraft der Presse auf.', 'Sie zentriert das Werkzeug in der Presse.', 'Sie wirft die fertigen Teile aus.', 'Sie verbindet Ober- und Unterteil fest miteinander.'],
   e: 'Die Stempel laufen in der Führungsplatte. Beim Hochfahren hält sie den Streifen fest, damit er nicht an den Stempeln hängen bleibt.' },
 { cat: 'FUN', q: 'Wozu dienen die Führungssäulen und Führungsbuchsen?',
   o: ['Ober- und Unterteil werden genau zueinander geführt. Der Schneidspalt bleibt überall gleich.', 'Sie federn den Hub der Presse ab.', 'Sie transportieren den Streifen.', 'Sie halten die Schneidplatte fest.', 'Sie kühlen das Werkzeug.'],
   e: 'Die Pressenführung allein ist zu ungenau. Das Säulengestell sorgt für einen gleichmäßigen Schneidspalt.' },
 { cat: 'TM', lock: true, gen: true },
 { cat: 'FUN', q: 'Warum liegt zwischen Stempelköpfen und Kopfplatte eine gehärtete Druckplatte (Pos. 3)?',
   o: ['Die Stempelköpfe würden sich sonst in die weichere Kopfplatte eindrücken.', 'Damit das Werkzeug schwerer wird.', 'Sie dient als Abstreifer.', 'Sie zentriert den Einspannzapfen.', 'Sie verhindert Rost.'],
   e: 'Die Stempel drücken mit großer Kraft auf eine kleine Fläche. Eine gehärtete Platte verteilt den Druck.' },
 { cat: 'SCHN', q: 'Der Schneidspalt ist zu <b>groß</b>. Was beobachtest du am Teil?',
   o: ['Großer Grat und starker Kanteneinzug, rauere Bruchfläche', 'Kein Grat, sehr glatte Schnittfläche', 'Zwei Glattschnittzonen (doppelter Glattschnitt)', 'Das Teil wird größer als die Schneidplatte', 'Die Löcher werden kleiner als der Stempel'],
   e: 'Bei zu großem Spalt wird das Blech mehr gebogen als geschnitten. Es entsteht ein großer Grat.' },
 { cat: 'SCHN', q: 'Wie werden beim <b>Lochen</b> Stempel und Schneidplatte bemaßt?',
   o: ['Der Stempel hat das Nennmaß des Lochs. Der Durchbruch in der Schneidplatte ist um 2 × u größer.', 'Die Schneidplatte hat das Nennmaß, der Stempel ist um 2 × u kleiner.', 'Beide haben genau das Nennmaß.', 'Der Stempel ist um 2 × u größer als das Loch.', 'Der Schneidspalt wird nur beim Ausschneiden berücksichtigt.'],
   e: 'Beim Lochen ist das Loch das Gutteil. Es bekommt die Maße des Stempels.' },
 { cat: 'SCHN', q: 'Wie werden beim <b>Ausschneiden</b> Stempel und Schneidplatte bemaßt?',
   o: ['Der Durchbruch der Schneidplatte hat das Nennmaß. Der Stempel ist um 2 × u kleiner.', 'Der Stempel hat das Nennmaß, die Schneidplatte ist um 2 × u größer.', 'Beide sind um u größer als das Nennmaß.', 'Der Stempel ist um 2 × u größer als der Durchbruch.', 'Beim Ausschneiden gibt es keinen Schneidspalt.'],
   e: 'Beim Ausschneiden ist das ausgeschnittene Teil das Gutteil. Es bekommt die Maße der Schneidplatte.' },
 { cat: 'TK', lock: true, q: 'Laut Stückliste ist der Ausschneidstempel <b>39,8 × 29,8 mm</b> groß. Warum?',
   o: ['Nennmaß 40 × 30 minus zweimal den Schneidspalt von 0,1 mm', 'Weil er nach dem Härten schrumpft', 'Damit er beim Nachschleifen nicht zu klein wird', 'Weil das Teil 39,8 × 29,8 mm groß ist', 'Wegen der Allgemeintoleranz ISO 2768-m'],
   e: '40 − 2 · 0,1 = 39,8 mm und 30 − 2 · 0,1 = 29,8 mm. Das Teil bekommt das Maß des Durchbruchs (40 × 30).' },
 { cat: 'FUN', q: 'Was ist der Vorteil eines <b>Folgeschneidwerkzeugs</b>?',
   o: ['Mehrere Arbeitsgänge laufen in einem Werkzeug ab. Bei jedem Hub fällt ein fertiges Teil.', 'Es braucht keinen Schneidspalt.', 'Es kann nur ein Loch je Hub stanzen.', 'Es braucht keine Presse.', 'Es ist immer billiger als ein Einzelwerkzeug.'],
   e: 'Lochen und Ausschneiden passieren in Stufen nacheinander, aber im gleichen Hub an verschiedenen Stellen des Streifens.' },
 { cat: 'FUN', q: 'Welche Aufgabe hat der Einhängestift (Pos. 16)?',
   o: ['Er ist der Anschlag für den Vorschub und positioniert den Streifen grob.', 'Er wirft das Teil aus.', 'Er zentriert das Teil genau in Stufe 2.', 'Er führt die Stempel.', 'Er hält die Schneidplatte fest.'],
   e: 'Der Streifen wird bis an den Anschlag geschoben. Die genaue Lage machen danach die Fangstifte.' },
 { cat: 'TM', lock: true, q: 'Die Presse macht 120 Hübe je Minute. Wie lang dauert ein Hub?',
   o: ['0,5 s', '2 s', '0,12 s', '1,2 s', '5 s'],
   e: '60 s : 120 Hübe = 0,5 s je Hub.' },
 { cat: 'SCHN', q: 'Unter der Schneidkantenhöhe hat der Durchbruch einen Freiwinkel. Warum?',
   o: ['Teile und Butzen fallen leichter durch und stauen sich nicht.', 'Damit der Stempel tiefer eintauchen kann.', 'Damit der Schneidspalt größer wird.', 'Damit die Schneidplatte leichter wird.', 'Damit das Teil einen Grat bekommt.'],
   e: 'Ohne Freiwinkel klemmen sich die Teile im Durchbruch fest. Der Stau kann die Platte sprengen.' },
 { cat: 'TK', lock: true, q: 'Auf der Schneidplatte steht ein Toleranzrahmen mit zwei parallelen Strichen, 0,01 und Bezug A. Was bedeutet das?',
   o: ['Die Oberseite muss zwischen zwei zur Bezugsfläche A parallelen Ebenen im Abstand 0,01 mm liegen.', 'Die Platte darf 0,01 mm dicker sein.', 'Die Oberseite muss 0,01 mm eben sein, ohne Bezug.', 'Die Durchbrüche müssen 0,01 mm parallel zueinander sein.', 'Die Rauheit beträgt 0,01 µm.'],
   e: 'Zwei parallele Striche = Parallelität. Sie ist eine Richtungstoleranz und braucht einen Bezug.' },
 { cat: 'PRE', q: 'Die Presse hat eine <b>Zweihandschaltung</b>. Was trifft zu?',
   o: ['Beide Taster müssen fast gleichzeitig gedrückt und festgehalten werden, damit der Hub ausgelöst wird.', 'Ein Taster reicht, der zweite ist für die zweite Person.', 'Die Taster dürfen mit einem Klebeband überbrückt werden.', 'Die Zweihandschaltung ersetzt den Not-Halt.', 'Man darf mit einer Hand einlegen und mit der anderen auslösen.'],
   e: 'So sind beide Hände außerhalb des Gefahrbereichs, wenn das Oberteil herunterfährt.' },
 { cat: 'PRE', q: 'Was macht ein <b>Lichtvorhang</b> an der Presse?',
   o: ['Er stoppt die gefährliche Bewegung, wenn jemand in den Schutzbereich greift.', 'Er beleuchtet das Werkzeug.', 'Er zählt die gefertigten Teile.', 'Er misst die Pressenkraft.', 'Er kühlt das Werkzeug.'],
   e: 'Der Lichtvorhang ist eine berührungslos wirkende Schutzeinrichtung.' },
 { cat: 'PRE', q: 'Was bedeutet die <b>Nennkraft von 250 kN</b> der Exzenterpresse?',
   o: ['Die größte Kraft, die die Presse kurz vor dem unteren Totpunkt aufbringen darf', 'Die Kraft, die der Motor immer aufbringt', 'Die Kraft am oberen Totpunkt', 'Die Kraft, ab der die Presse abschaltet', 'Die Gewichtskraft des Oberteils'],
   e: 'Bei Exzenterpressen steht die Nennkraft nur kurz vor dem unteren Totpunkt zur Verfügung.' },
 { cat: 'INS', q: 'Die Teile haben einen großen Grat. Was ist die wahrscheinlichste Ursache?',
   o: ['Die Schneidkanten sind verschlissen (abgerundet).', 'Der Streifen ist zu breit.', 'Die Presse läuft zu langsam.', 'Die Druckplatte ist zu hart.', 'Der Einhängestift fehlt.'],
   e: 'Stumpfe Schneidkanten drücken das Blech eher, als dass sie schneiden. Es entsteht Grat.' },
 { cat: 'INS', q: 'Wie werden verschlissene Schneidkanten instand gesetzt?',
   o: ['Schneidplatte und Stempel plan nachschleifen, bis die Kanten scharf sind.', 'Die Kanten mit der Feile nacharbeiten.', 'Den Schneidspalt durch Unterlegen vergrößern.', 'Die Schneidplatte drehen und weiterarbeiten.', 'Die Kanten auftragsschweißen und nicht nachbearbeiten.'],
   e: 'Plan nachschleifen bringt wieder scharfe Kanten. Dabei wird die Schneidkantenhöhe kleiner.' },
 { cat: 'TM', lock: true, gen: true },
 { cat: 'WST', q: 'Die Schneidplatte ist aus <b>X153CrMoV12</b>. Was bedeutet das?',
   o: ['Hochlegierter Stahl mit 1,53 % Kohlenstoff und 12 % Chrom, dazu Mo und V', 'Unlegierter Stahl mit 15,3 % Kohlenstoff', 'Niedriglegierter Stahl mit 0,153 % C und 1,2 % Cr', 'Schnellarbeitsstahl mit 12 % Wolfram', 'Gusseisen mit 1,53 % Chrom'],
   e: 'X = hochlegiert. Die Zahl danach geteilt durch 100 = Kohlenstoff: 1,53 %. Die Legierungszahlen stehen direkt in Prozent: 12 % Cr.' },
 { cat: 'WST', q: 'Die Lochstempel sind aus <b>HS6-5-2C</b>. Was ist das?',
   o: ['Schnellarbeitsstahl mit etwa 6 % Wolfram, 5 % Molybdän und 2 % Vanadium', 'Hartmetall der Sorte 6-5-2', 'Baustahl mit 652 N/mm²', 'Einsatzstahl mit 0,6 % C', 'Kaltarbeitsstahl mit 6 % Chrom'],
   e: 'HS = Schnellarbeitsstahl. Die Zahlen: W – Mo – V (– Co) in Prozent. C bedeutet höherer Kohlenstoffgehalt.' },
 { cat: 'WST', q: 'Warum nimmt man für die Schneidplatte X153CrMoV12?',
   o: ['Sehr verschleißfest durch viele Chromkarbide und maßbeständig beim Härten', 'Weil er sehr gut schweißbar ist', 'Weil er besonders weich und zäh ist', 'Weil er nicht gehärtet werden muss', 'Weil er der billigste Stahl ist'],
   e: 'Schneidplatten müssen viele tausend Hübe aushalten. Dafür braucht man hohe Verschleißfestigkeit und wenig Verzug.' },
 { cat: 'QS', q: 'Was ist eine <b>Erstmusterprüfung</b>?',
   o: ['Die ersten Teile werden vollständig gegen die Zeichnung geprüft, bevor die Serie startet.', 'Jedes hundertste Teil wird gewogen.', 'Nur die Oberfläche wird geprüft.', 'Der Kunde prüft das letzte Teil der Serie.', 'Die Prüfung der Presse durch den TÜV.'],
   e: 'Erst wenn alle Merkmale stimmen, wird die Serienfertigung freigegeben.' },
 { cat: 'FUN', q: 'Der Fangstift hat Ø6,3 mm, das Loch Ø6,4 mm. Warum ist der Fangstift kleiner?',
   o: ['Er soll sicher eintauchen und den Streifen ausrichten, ohne das Loch zu verformen.', 'Damit er schneidet.', 'Damit er beim Härten nicht reißt.', 'Weil der Schneidspalt das verlangt.', 'Das ist ein Zeichnungsfehler.'],
   e: 'Ein zu großer Fangstift würde das Loch aufweiten oder den Streifen hochziehen.' },
 { cat: 'TK', lock: true, q: 'Welche Bauteile sind laut Stückliste <b>Normteile</b>?',
   o: ['Einspannzapfen, Führungssäulen und Führungsbuchsen', 'Schneidplatte, Stempel und Fangstifte', 'Kopfplatte und Grundplatte', 'Führungsplatte und Zwischenleisten', 'Druckplatte und Einhängestift'],
   e: 'In der Spalte Werkstoff steht bei Pos. 2, 12 und 13 „Normteil“. Schrauben und Stifte sind ebenfalls genormt.' },
 { cat: 'TM', lock: true, q: 'Der Lochstempel hat Ø6,4 mm, der Schneidspalt ist u = 0,1 mm. Wie groß ist der Durchbruch in der Schneidplatte?',
   o: ['6,6 mm', '6,5 mm', '6,4 mm', '6,2 mm', '6,8 mm'],
   e: 'Lochen: Durchbruch = Stempelmaß + 2 · u = 6,4 + 0,2 = 6,6 mm.' },
 { cat: 'INS', q: 'Das Werkzeug wird in die Presse eingebaut. Was ist richtig?',
   o: ['Hub auf das Einbaumaß einstellen, Werkzeug sicher spannen und im Einrichtbetrieb einen Probehub machen', 'Werkzeug einlegen und sofort im Dauerhub starten', 'Das Werkzeug bei laufender Presse ausrichten', 'Schutzeinrichtungen während des ganzen Einrichtens abbauen', 'Die Hubverstellung erst nach dem ersten Teil prüfen'],
   e: 'Falsch eingestellte Hubhöhe kann Werkzeug und Presse zerstören. Deshalb langsam im Einrichtbetrieb prüfen.' }
    ],
    genA(i, r) {
        if (i === 4) {
            const tau = pick(r, [280, 300, 320, 350]);
            const l = Math.PI * 6.4, F = l * 2 * tau / 1000;
            const o = uniqOpts([F, F * 2, F / 2, Math.PI * 3.2 * 2 * tau / 1000 / 2, F * 10].map(x => fmt(x, 1) + ' kN'));
            return { q: `Wie groß ist die Schneidkraft für <b>ein</b> Loch Ø6,4 mm? Blechdicke s = 2 mm, Scherfestigkeit <b>τ<sub>aB</sub> = ${tau} N/mm²</b>.`, o,
                     e: `l = π · d = π · 6,4 mm ≈ ${fmt(l, 2)} mm. F = l · s · τ<sub>aB</sub> = ${fmt(l, 2)} · 2 · ${tau} N ≈ ${fmt(F * 1000, 0)} N ≈ ${fmt(F, 1)} kN.` };
        }
        if (i === 20) {
            const h = pick(r, [7.5, 8]), ng = pick(r, [0.8, 0.85, 0.9]);
            const n = 120 * 60 * h * ng;
            const o = uniqOpts([n, 120 * 60 * h, 120 * h * ng, 120 * 60 * h * ng * 2, 120 * 60 * ng].map(x => fmtT(x) + ' Teile'));
            return { q: `Die Presse läuft mit 120 Hüben je Minute, ein Teil je Hub. Eine Schicht dauert <b>${fmt(h, 1)} h</b>, der Nutzungsgrad ist <b>${fmt(ng * 100, 0)} %</b>. Wie viele Teile entstehen je Schicht?`, o,
                     e: `120 · 60 · ${fmt(h, 1)} · ${fmt(ng, 2)} ≈ ${fmtT(n)} Teile.` };
        }
    },
    buildB(rngFor) {
        const r2 = rngFor('B2'), r8 = rngFor('B8');
        const tau = pick(r2, [280, 300, 320, 340]);
        const lL = 2 * Math.PI * 6.4, lA = 2 * (40 + 30) - 8 * 5 + 2 * Math.PI * 5, F = (lL + lA) * 2 * tau / 1000;
        const Ateil = 30 * 40 - 4 * (25 - Math.PI * 25 / 4) - 2 * Math.PI * 3.2 * 3.2;
        const ist = [];
        const mk = (ok, okV, badV) => ist.push({ ok, val: ok ? pick(r8, okV) : pick(r8, badV) });
        mk(r8() < 0.5, ['26,03', '25,97', '26,04'], ['26,07', '25,93', '26,06']);
        mk(r8() < 0.5, ['40,2', '39,8', '40,1'], ['40,4', '39,6', '40,5']);
        mk(r8() < 0.5, ['30,1', '29,9', '30,15'], ['30,25', '29,7', '30,3']);
        return [
        { id: 'B1', title: 'Ablauf eines Pressenhubs', intro: 'Analysiere die Gesamtzeichnung des Folgeschneidwerkzeugs.',
          parts: [
            { id: 'a', type: 'order', pts: 6, cat: 'FUN', q: 'Bringe die Vorgänge während eines Hubs in die richtige Reihenfolge.',
              items: ['Streifen wird um V = 32 mm bis zum Anschlag vorgeschoben', 'Oberteil fährt nach unten, die Säulen führen', 'Fangstifte tauchen in die Löcher und richten den Streifen aus', 'Lochstempel lochen (Stufe 1), Ausschneidstempel schneidet aus (Stufe 2)', 'Teil und Butzen fallen durch Schneidplatte und Grundplatte', 'Beim Rückhub streift die Führungsplatte den Streifen von den Stempeln ab'],
              e: 'Erst positionieren, dann ausrichten, dann schneiden. Beim Hochfahren wird abgestreift.' },
            { id: 'b', type: 'text', pts: 4, cat: 'FUN', q: 'Die Fangstifte stehen unten aus dem Ausschneidstempel vor. Erkläre warum, und was passiert, wenn ein Fangstift abbricht.',
              crit: [{ t: 'Sie müssen den Streifen ausrichten, bevor der Stempel schneidet.', p: 1 }, { t: 'Darum tauchen sie zuerst in die Löcher ein (Vorlauf).', p: 1 },
                     { t: 'Ohne Fangstift liegt der Streifen ungenau → Löcher liegen nicht mittig zur Außenkontur.', p: 1 }, { t: 'Folge: Maßfehler (Lochabstand zur Kante), evtl. einseitiger Schnitt und Werkzeugschaden.', p: 1 }],
              muster: 'Der Anschlag positioniert den Streifen nur grob. Die Fangstifte stehen vor, damit sie zuerst in die Löcher tauchen und den Streifen genau ausrichten. Erst dann schneidet der Stempel. Fehlt ein Fangstift, liegen die Löcher nicht mehr genau in der Mitte des Teils. Die Teile werden Ausschuss, und das Werkzeug kann einseitig belastet werden.' }
          ] },
        { id: 'B2', title: 'Schneidkraft', intro: `Blechdicke s = 2 mm, Scherfestigkeit <b>τ<sub>aB</sub> = ${tau} N/mm²</b>. Die Maße stehen in der Teilzeichnung. Rechne mit der π-Taste.`,
          parts: [
            { id: 'a', type: 'num', pts: 6, cat: 'TM', q: 'Berechne die Schnittlängen und die gesamte Schneidkraft beider Stufen. Runde Längen auf eine Nachkommastelle, die Kraft auf eine Nachkommastelle in kN.',
              fields: [{ label: 'Schnittlänge Lochen (2 Löcher)', unit: 'mm', ans: lL, tol: 0.25, show: fmt(lL, 1) }, { label: 'Schnittlänge Außenkontur', unit: 'mm', ans: lA, tol: 0.3, show: fmt(lA, 1) },
                       { label: 'Schneidkraft gesamt F', unit: 'kN', ans: F, tol: F * 0.01, show: fmt(F, 1) }],
              e: `Lochen: 2 · π · 6,4 ≈ ${fmt(lL, 2)} mm. Außen: 2 · (40 + 30) − 8 · 5 + 2 · π · 5 ≈ ${fmt(lA, 2)} mm (gerade Stücke ohne Radien plus ein voller Kreis aus den vier Viertelkreisen). F = (${fmt(lL, 2)} + ${fmt(lA, 2)}) · 2 · ${tau} N ≈ ${fmt(F, 1)} kN.` },
            { id: 'b', type: 'select', pts: 2, cat: 'PRE', q: 'Reicht die Exzenterpresse mit 250 kN Nennkraft?',
              options: ['Ja, die Schneidkraft liegt deutlich unter der Nennkraft.', 'Nein, die Schneidkraft ist größer als 250 kN.', 'Das kann man nicht sagen, weil die Hubzahl fehlt.', 'Nur wenn man ohne Säulenführung arbeitet.'], ans: 0,
              e: `Die Schneidkraft beträgt etwa ${fmt(F, 0)} kN. Das ist weniger als die Hälfte von 250 kN.` },
            { id: 'c', type: 'select', pts: 2, cat: 'SCHN', q: 'Wie kann man die größte Schneidkraft verringern, ohne das Teil zu ändern?',
              options: ['Die Stempel in der Höhe versetzt (gestuft) anordnen oder einen Dachschliff anbringen', 'Den Schneidspalt auf null setzen', 'Die Presse schneller laufen lassen', 'Dickeres Blech verwenden'], ans: 0,
              e: 'Dann schneiden nicht alle Stempel gleichzeitig. Die Kraftspitze wird kleiner.' }
          ] },
        { id: 'B3', title: 'Schneidspalt und Stempelmaße', intro: 'Für s = 2 mm wird hier ein Schneidspalt von 5 % der Blechdicke (je Seite) angenommen.',
          parts: [
            { id: 'a', type: 'num', pts: 8, cat: 'SCHN', q: 'Berechne Schneidspalt und Maße. Zwei Nachkommastellen.',
              fields: [{ label: 'Schneidspalt u', unit: 'mm', ans: 0.1, tol: 0.001, show: '0,10' }, { label: 'Durchbruch Lochen in der Schneidplatte', unit: 'mm', ans: 6.6, tol: 0.001, show: '6,60' },
                       { label: 'Ausschneidstempel Länge (Nennmaß 40)', unit: 'mm', ans: 39.8, tol: 0.001, show: '39,80' }, { label: 'Ausschneidstempel Breite (Nennmaß 30)', unit: 'mm', ans: 29.8, tol: 0.001, show: '29,80' }],
              e: 'u = 0,05 · 2 = 0,1 mm. Lochen: 6,4 + 2 · 0,1 = 6,6 mm. Ausschneiden: 40 − 0,2 = 39,8 mm und 30 − 0,2 = 29,8 mm.' },
            { id: 'b', type: 'select', pts: 2, cat: 'SCHN', q: 'Was passiert, wenn der Schneidspalt zu <b>klein</b> ist?',
              options: ['Schneidkraft und Verschleiß steigen. Es entsteht ein zweiter Glattschnitt.', 'Es entsteht ein sehr großer Grat.', 'Die Teile werden größer.', 'Die Schneidkraft sinkt stark.'], ans: 0,
              e: 'Bei zu kleinem Spalt treffen sich die Risse nicht. Das Blech wird zweimal geschnitten, die Kanten verschleißen schneller.' }
          ] },
        { id: 'B4', title: 'Streifenbild und Werkstoffausnutzung', intro: 'Sieh dir das Streifenbild an. Rechne mit der π-Taste.',
          parts: [
            { id: 'a', type: 'num', pts: 6, cat: 'TM', q: 'Berechne Teilfläche (ohne Löcher, mit Eckradien), Streifenfläche je Teil und Werkstoffausnutzung. Eine Nachkommastelle.',
              fields: [{ label: 'Fläche des Teils A<sub>T</sub>', unit: 'mm²', ans: Ateil, tol: 2, show: fmt(Ateil, 1) }, { label: 'Streifenfläche je Teil B · V', unit: 'mm²', ans: 1408, tol: 0.5, show: '1408' },
                       { label: 'Ausnutzung η', unit: '%', ans: Ateil / 14.08, tol: 0.3, show: fmt(Ateil / 14.08, 1) }],
              e: `A<sub>T</sub> = 30 · 40 − 4 · (5² − π · 5²/4) − 2 · π · 3,2² ≈ ${fmt(Ateil, 1)} mm². B · V = 44 · 32 = 1408 mm². η = ${fmt(Ateil, 1)} / 1408 ≈ ${fmt(Ateil / 14.08, 1)} %.` },
            { id: 'b', type: 'num', pts: 2, cat: 'TM', q: 'Wie viele ganze Teile erhältst du aus einem Streifen von 2000 mm Länge? (Vereinfachung: Anzahl = Länge : Vorschub, abgerundet)',
              fields: [{ label: 'Anzahl Teile', unit: 'Stück', ans: 62, tol: 0.01, show: '62' }],
              e: '2000 : 32 = 62,5 → 62 ganze Teile.' },
            { id: 'c', type: 'select', pts: 2, cat: 'SCHN', q: 'Wie könnte man die Werkstoffausnutzung verbessern?',
              options: ['Rand und Steg so klein wie zulässig wählen oder mehrere Teile versetzt (mehrreihig) anordnen', 'Den Schneidspalt vergrößern', 'Den Vorschub vergrößern', 'Dickeres Blech nehmen'], ans: 0,
              e: 'Weniger Abfall zwischen den Teilen bedeutet bessere Ausnutzung.' }
          ] },
        { id: 'B5', title: 'Presse und Arbeitssicherheit', intro: 'Das Werkzeug wird in der Exzenterpresse betrieben.',
          parts: [
            { id: 'a', type: 'match', pts: 4, cat: 'PRE', q: 'Ordne jeder Schutzeinrichtung ihre Wirkung zu.',
              rows: ['Zweihandschaltung', 'Lichtvorhang', 'Feste trennende Schutzeinrichtung (Gitter)', 'Not-Halt'],
              options: ['Beide Hände sind beim Auslösen außerhalb des Gefahrbereichs', 'Stoppt die Bewegung, wenn ein Lichtstrahl unterbrochen wird', 'Verhindert den Zugriff zum Werkzeug körperlich', 'Stillsetzen im Notfall von Hand'], ans: [0, 1, 2, 3],
              e: 'Jede Schutzeinrichtung wirkt anders. Oft werden mehrere kombiniert.' },
            { id: 'b', type: 'text', pts: 3, cat: 'PRE', q: 'Beschreibe in drei Schritten, wie du das Werkzeug in die Presse einbaust.',
              crit: [{ t: 'Presse sichern (Einrichtbetrieb, Stößel im oberen Totpunkt / gesichert), Werkzeug mit Hebezeug einbringen.', p: 1 }, { t: 'Einspannzapfen in den Stößel, Grundplatte auf dem Tisch ausrichten und spannen.', p: 1 }, { t: 'Hubhöhe einstellen, im Tippbetrieb Probehub, Probeteile prüfen.', p: 1 }],
              muster: 'Presse in den Einrichtbetrieb schalten und sichern. Werkzeug mit Hebezeug auf den Tisch bringen. Den Einspannzapfen im Stößel spannen und die Grundplatte ausrichten und festspannen. Die Hubhöhe einstellen, im Tippbetrieb einen Probehub machen und die ersten Teile prüfen.' },
            { id: 'c', type: 'select', pts: 3, cat: 'PRE', q: 'In welcher Betriebsart richtest du das Werkzeug ein?',
              options: ['Tipp- oder Einrichtbetrieb mit Einzelschritten', 'Dauerhub', 'Automatik mit Vorschubeinrichtung', 'Einzelhub mit überbrückter Schutzeinrichtung'], ans: 0,
              e: 'Im Einrichtbetrieb bewegt sich der Stößel nur, solange man den Taster drückt. Schutzeinrichtungen werden nie überbrückt.' }
          ] },
        { id: 'B6', title: 'Instandsetzung – Grat am Teil', intro: 'Die Grathöhe an den Teilen ist zu groß. Das Werkzeug wird instand gesetzt. Die Schneidkantenhöhe beträgt 6 mm.',
          parts: [
            { id: 'a', type: 'order', pts: 6, cat: 'INS', q: 'Bringe die Schritte der Instandsetzung in die richtige Reihenfolge.',
              items: ['Werkzeug aus der Presse ausbauen und reinigen', 'Grathöhe am letzten Teil messen und Schneidkanten begutachten', 'Schneidplatte und Stempel ausbauen', 'Schneidplatte und Stempel plan nachschleifen, bis die Kanten scharf sind', 'Restliche Schneidkantenhöhe prüfen, Stempellänge ausgleichen', 'Werkzeug montieren, Probeteile schneiden und prüfen'],
              e: 'Erst Befund aufnehmen, dann zerlegen, schleifen, prüfen, montieren und Probeteile machen.' },
            { id: 'b', type: 'text', pts: 4, cat: 'INS', q: 'Was musst du beim Nachschleifen der Schneidplatte beachten? Nenne vier Punkte.',
              crit: [{ t: 'Kleine Zustellung und gute Kühlung, damit kein Schleifbrand entsteht (Härte bleibt).', p: 1 }, { t: 'Nur so viel abschleifen wie nötig (Schneidkantenhöhe ist begrenzt).', p: 1 },
                     { t: 'Parallelität und Ebenheit zur Unterseite einhalten, Platte nach dem Schleifen entmagnetisieren.', p: 1 }, { t: 'Kanten nicht verrunden, Grat entfernen; Stempellänge bzw. Einbauhöhe anpassen.', p: 1 }],
              muster: 'Wenig zustellen und kühlen, damit die Platte nicht anlässt. Nur wenige Zehntel abschleifen, bis die Kante scharf ist, weil die Schneidkantenhöhe begrenzt ist. Die Platte muss eben und parallel bleiben und wird entmagnetisiert. Die Kanten dürfen nicht abgerundet werden. Danach Einbauhöhe und Stempellänge anpassen.' }
          ] },
        { id: 'B7', title: 'Werkstoffe und Wärmebehandlung', intro: 'Sieh in die Stückliste.',
          parts: [
            { id: 'a', type: 'match', pts: 3, cat: 'TK', q: 'Ordne jedem Bauteil den Werkstoff aus der Stückliste zu.',
              rows: ['Schneidplatte (Pos. 10)', 'Lochstempel (Pos. 5)', 'Druckplatte (Pos. 3)'], options: ['X153CrMoV12', 'HS6-5-2C', '90MnCrV8'], ans: [0, 1, 2],
              e: 'Siehe Stückliste.' },
            { id: 'b', type: 'text', pts: 4, cat: 'WST', q: 'Die neue Schneidplatte aus X153CrMoV12 wird gehärtet. Beschreibe den Ablauf und worauf man achten muss.',
              crit: [{ t: 'Langsam und in Stufen vorwärmen (Spannungen und Risse vermeiden).', p: 1 }, { t: 'Härtetemperatur etwa 1000–1050 °C, durchwärmen.', p: 1 },
                     { t: 'Abkühlen in Luft, Gas (Vakuumofen) oder Öl.', p: 1 }, { t: 'Danach mehrmals (2- bis 3-mal) anlassen.', p: 1 }],
              muster: 'Die Platte wird langsam in Stufen vorgewärmt. Dann wird sie auf etwa 1000 bis 1050 °C erwärmt und durchgewärmt. Abgekühlt wird an Luft, im Gasstrom (Vakuumofen) oder in Öl. Danach lässt man zwei- bis dreimal an. So erreicht man 60 HRC bei wenig Spannungen.' },
            { id: 'c', type: 'select', pts: 3, cat: 'WST', q: 'Warum wird die Schneidplatte im <b>Vakuumofen</b> gehärtet?',
              options: ['Keine Randentkohlung und kein Zunder, sehr wenig Verzug', 'Weil sie dort schneller abkühlt als in Wasser', 'Weil sie dadurch weicher wird', 'Weil man dann nicht anlassen muss'], ans: 0,
              e: 'Ohne Sauerstoff entsteht kein Zunder. Die Oberfläche bleibt sauber und hart.' }
          ] },
        { id: 'B8', title: 'Erstmusterprüfung', intro: 'Nach der Instandsetzung werden die ersten Teile geprüft. Nutze die Teilzeichnung und dein Tabellenbuch (ISO 2768-m).',
          parts: [
            { id: 'a', type: 'num', pts: 4, cat: 'QS', q: 'Bestimme die Grenzmaße.',
              fields: [{ label: 'Lochabstand 26 ±0,05: Höchstmaß', unit: 'mm', ans: 26.05, tol: 0.001, show: '26,05' }, { label: 'Lochabstand 26 ±0,05: Mindestmaß', unit: 'mm', ans: 25.95, tol: 0.001, show: '25,95' },
                       { label: 'Grenzabmaß für 40 nach ISO 2768-m (±)', unit: 'mm', ans: 0.3, tol: 0.001, show: '0,3' }, { label: 'Grenzabmaß für 30 nach ISO 2768-m (±)', unit: 'mm', ans: 0.2, tol: 0.001, show: '0,2' }],
              e: 'ISO 2768-m: über 6 bis 30 mm ±0,2 mm, über 30 bis 120 mm ±0,3 mm.' },
            { id: 'b', type: 'match', pts: 3, cat: 'QS', q: 'Prüfprotokoll: Sind die Istmaße in Ordnung?',
              rows: [`Lochabstand 26 ±0,05 – Istmaß ${ist[0].val} mm`, `Länge 40 – Istmaß ${ist[1].val} mm`, `Breite 30 – Istmaß ${ist[2].val} mm`],
              options: ['i. O.', 'n. i. O.'], ans: ist.map(x => x.ok ? 0 : 1), keepOrder: true,
              e: 'Grenzmaße: 25,95 … 26,05 · 39,7 … 40,3 · 29,8 … 30,2 mm.' },
            { id: 'c', type: 'text', pts: 3, cat: 'QS', q: 'Wie misst du die Grathöhe am Teil? Beschreibe kurz.',
              crit: [{ t: 'Blechdicke an einer gratfreien Stelle messen (z. B. Bügelmessschraube).', p: 1 }, { t: 'Dicke über dem Grat an der Schnittkante messen (Messuhr/Feinzeiger mit Messplatte oder Messschraube).', p: 1 }, { t: 'Grathöhe = Differenz; mit dem zulässigen Wert vergleichen.', p: 1 }],
              muster: 'Zuerst misst man die Blechdicke an einer Stelle ohne Grat. Dann misst man über dem Grat an der Schnittkante, z. B. mit Messuhr auf der Messplatte. Die Differenz ist die Grathöhe. Sie wird mit dem erlaubten Wert verglichen.' }
          ] }
        ];
    }
};
