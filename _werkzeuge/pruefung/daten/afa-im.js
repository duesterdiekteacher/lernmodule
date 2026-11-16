/* ============================================================
   AP Teil 2 – Industriemechaniker – Auftrags- und Funktionsanalyse
   Projekt: Hubstation mit Rollenbahn-Getriebe
   ============================================================ */
function introAfaFt(name, min) {
    return `<h2>So läuft die Prüfung</h2>
    <ul class="steps">
      <li>Prüfungsbereich <b>${name}</b>. Du hast <b>${min} Minuten</b>. Die Uhr läuft oben rückwärts.</li>
      <li><b>Teil A:</b> 28 Aufgaben zum Ankreuzen. Pro Aufgabe ist genau eine Antwort richtig.</li>
      <li>In Teil A musst du <b>3 Aufgaben abwählen</b>. Die 8 Aufgaben mit 🔒 (Mathematik und Technische Kommunikation) kannst du nicht abwählen.</li>
      <li>Wählst du nicht ab, werden die <b>letzten 3 abwählbaren Aufgaben</b> nicht gewertet.</li>
      <li><b>Teil B:</b> 8 Aufgaben mit je 10 Punkten. Keine Abwahl.</li>
      <li>Die Aufgaben beziehen sich auf den Zeichnungssatz hinter dem Knopf <b>📐 Zeichnung</b>. Über jeder Aufgabe steht, welches Blatt du brauchst.</li>
    </ul>
    <div class="info warn"><b>Hilfsmittel:</b> Tabellenbuch Metall, Taschenrechner, Papier und Bleistift für Nebenrechnungen und Skizzen.</div>
    <table class="tbl"><tr><th>Teil</th><th>Aufgaben</th><th>Punkte</th><th>Anteil</th></tr>
    <tr><td>A – gebunden</td><td>28, davon 3 abwählen</td><td>25 × 1 Punkt</td><td>50 %</td></tr>
    <tr><td>B – ungebunden</td><td>8, keine Abwahl</td><td>8 × 10 Punkte</td><td>50 %</td></tr></table>`;
}
const EXAM = {
    id: 'afa-im', key: 'ap2-afa-im-2', summary: true,
    title: 'Auftrags- und Funktionsanalyse', subtitle: 'Abschlussprüfung Teil 2 · Industriemechaniker/-in · Projekt Hubstation mit Rollenbahn-Getriebe',
    logo: '🔍', back: './', backLabel: '← Zurück zur Übersicht Teil 2',
    duration: 105, aAbw: 3, aWeight: 0.5, bAbw: 0, bWeight: 0.5,
    intro: introAfaFt('Auftrags- und Funktionsanalyse', 105),
    bIntro: '<p>Arbeite mit den Unterlagen (📐 Zeichnung) und deinem Tabellenbuch. Gib Zahlen mit Komma oder Punkt ein. Nenne Positionsnummern, wo danach gefragt ist.</p>',
    docs: IM_DOCS,
    cats: { FUN: 'Funktion und Baugruppen', HYD: 'Hydraulik', STE: 'Steuerungstechnik und GRAFCET', INS: 'Instandhaltung', WST: 'Werkstofftechnik', QS: 'Qualitätsmanagement', TM: 'Technische Mathematik', TK: 'Technische Kommunikation' },
    aDef: [
 { cat: 'TK', lock: true, ref: 'Blatt 1, 2', q: 'Welche Lagerungsart hat die Abtriebswelle (Pos. 3)?',
   o: ['Angestellte Lagerung mit zwei Kegelrollenlagern in X-Anordnung', 'Fest-Los-Lagerung mit Kegelrollenlagern', 'Schwimmende Lagerung mit Rillenkugellagern', 'Angestellte Lagerung in O-Anordnung mit Rillenkugellagern', 'Loslagerung mit zwei Zylinderrollenlagern'],
   e: 'Die beiden Kegelrollenlager werden von außen über die Lagerdeckel gegeneinander angestellt. Die Außenringe sind von außen abgestützt: Das ist die X-Anordnung.' },
 { cat: 'FUN', ref: 'Blatt 1, 2', q: 'Welche Aufgabe haben die Passscheiben (Pos. 16)?',
   o: ['Mit ihnen wird das Axialspiel der Kegelrollenlager eingestellt.', 'Sie dichten den Lagerdeckel ab.', 'Sie sichern die Schrauben gegen Losdrehen.', 'Sie stellen das Radialspiel der Ritzelwelle ein.', 'Sie übertragen das Drehmoment auf das Kettenrad.'],
   e: 'Kegelrollenlager müssen genau angestellt werden. Durch dünnere oder dickere Passscheiben unter dem Deckel ändert man das Spiel.' },
 { cat: 'FUN', ref: 'Blatt 1, 2', q: 'Welche Aussage zur Lagerung der Ritzelwelle (Pos. 2) ist richtig?',
   o: ['Links ist das Festlager (Deckel und Sicherungsring), rechts das Loslager (Außenring axial frei).', 'Rechts ist das Festlager, links das Loslager.', 'Beide Rillenkugellager sind Festlager.', 'Die Ritzelwelle ist schwimmend gelagert.', 'Die Ritzelwelle ist angestellt gelagert.'],
   e: 'Links ist der Außenring zwischen Deckel und Gehäuseschulter festgelegt. Rechts hat der Außenring axial Platz. So kann sich die Welle bei Wärme ausdehnen.' },
 { cat: 'TM', lock: true, ref: 'Situation', gen: true },
 { cat: 'TK', lock: true, ref: 'Blatt 1, 2', img: true, gen: true },
 { cat: 'FUN', ref: 'Blatt 1, 2', q: 'Um welche Verbindungsart handelt es sich zwischen Stirnrad (Pos. 4) und Abtriebswelle (Pos. 3)?',
   o: ['Formschlüssige Verbindung mit Passfeder', 'Stoffschlüssige Verbindung', 'Reibschlüssige Klemmverbindung', 'Keilwellenverbindung', 'Polygonverbindung'],
   e: 'Die Passfeder (Pos. 15) überträgt das Drehmoment durch ihre Form. Die Passung Ø36 H7/n6 sorgt für einen spielarmen Sitz.' },
 { cat: 'FUN', ref: 'Blatt 2', q: 'Was bedeutet die Bezeichnung <b>6205-2Z</b>?',
   o: ['Rillenkugellager, 25 mm Bohrung, beidseitig Deckscheiben', 'Rillenkugellager, 25 mm Bohrung, beidseitig schleifende Dichtscheiben', 'Kegelrollenlager, 52 mm Außendurchmesser, zwei Reihen', 'Rillenkugellager, 62 mm Bohrung, zwei Kugelreihen', 'Zylinderrollenlager, 25 mm Bohrung, ohne Bord'],
   e: '6 = Rillenkugellager, 05 · 5 = 25 mm Bohrung. Z = Deckscheibe (berührungsfrei), RS = schleifende Dichtscheibe.' },
 { cat: 'INS', ref: 'Situation, Blatt 1', q: 'An der Abtriebswelle tritt Öl aus. Was ist die wahrscheinlichste Ursache?',
   o: ['Der Radial-Wellendichtring (Pos. 13) ist verschlissen oder seine Laufbahn auf der Welle ist eingelaufen.', 'Die Passscheiben (Pos. 16) sind zu dick.', 'Das Stirnrad hat zu viel Flankenspiel.', 'Die Entlüftungsschraube (Pos. 22) ist zu weit offen.', 'Der Ölstand ist zu niedrig.'],
   e: 'Die Dichtlippe verschleißt mit der Zeit. Auch eine eingelaufene Rille auf der Welle macht den Dichtring undicht.' },
 { cat: 'TK', lock: true, ref: 'Blatt 3', q: 'Das Stirnrad hat die Bohrung Ø36 H7, die Welle ist mit Ø36 n6 toleriert. Welche Passungsart liegt vor? (Tabellenbuch)',
   o: ['Übergangspassung', 'Spielpassung', 'Übermaßpassung mit großem Mindestübermaß', 'Spielpassung mit großem Mindestspiel', 'Keine Passung, weil die Toleranzgrade verschieden sind'],
   e: 'H7: 0 bis +25 µm. n6: +17 bis +33 µm. Es kann bis 8 µm Spiel oder bis 33 µm Übermaß entstehen.' },
 { cat: 'INS', ref: 'Blatt 1', q: 'Wie prüfst du nach der Montage, ob die Kegelrollenlager richtig angestellt sind?',
   o: ['Welle von Hand drehen: leichtgängig ohne Klemmen; Axialspiel mit der Messuhr prüfen', 'Das Getriebe sofort unter Volllast laufen lassen', 'Die Lagertemperatur nach einer Woche messen', 'Die Passscheiben wiegen', 'Die Lager vor dem Einbau mit Druckluft schnell drehen'],
   e: 'Zu viel Spiel führt zu Geräuschen, zu wenig Spiel zu Überhitzung. Deshalb prüft man Leichtgängigkeit und Spiel.' },
 { cat: 'INS', q: 'Ein Wälzlager wird kalt auf die Welle gepresst. Was ist richtig?',
   o: ['Die Kraft wird nur über den Innenring aufgebracht, z. B. mit einer Montagehülse.', 'Man schlägt mit dem Hammer auf den Außenring.', 'Die Kraft wird über die Wälzkörper übertragen.', 'Man presst über den Käfig.', 'Man schlägt direkt mit einem Stahldorn auf die Deckscheibe.'],
   e: 'Die Montagekraft darf nie über die Wälzkörper laufen. Sonst entstehen Eindrücke in den Laufbahnen.' },
 { cat: 'TM', lock: true, ref: 'Situation', q: 'Wie groß ist der Achsabstand zwischen Ritzelwelle und Abtriebswelle? (m = 2 mm, z₁ = 17, z₂ = 51)',
   o: ['68 mm', '136 mm', '34 mm', '72 mm', '102 mm'],
   e: 'a = m · (z₁ + z₂) / 2 = 2 mm · 68 / 2 = 68 mm.' },
 { cat: 'HYD', ref: 'Blatt 4', q: 'Welche Aufgabe hat das Druckbegrenzungsventil -QN1?',
   o: ['Es begrenzt den Systemdruck und schützt die Anlage vor Überlast.', 'Es hält den Zylinder in jeder Stellung fest.', 'Es regelt die Geschwindigkeit des Zylinders.', 'Es filtert das Öl.', 'Es schaltet die Pumpe ab.'],
   e: 'Steigt der Druck über den eingestellten Wert, öffnet -QN1 zum Tank.' },
 { cat: 'TK', lock: true, ref: 'Blatt 4', q: 'Welche Schaltstellung des Wegeventils -QM1 ist im Hydraulikplan gezeichnet?',
   o: ['Die Mittelstellung: P ist mit T verbunden (Umlauf), A und B sind gesperrt.', 'Die Stellung „Heben“: P nach A, B nach T.', 'Die Stellung „Senken“: P nach B, A nach T.', 'Die Mittelstellung: alle Anschlüsse gesperrt.', 'Die Mittelstellung: alle Anschlüsse verbunden.'],
   e: 'Gezeichnet ist die Ruhestellung. Die Pumpe fördert drucklos zum Tank, der Zylinder steht.' },
 { cat: 'HYD', ref: 'Blatt 4', q: 'Welche Aufgabe hat das entsperrbare Rückschlagventil -RM1?',
   o: ['Es hält den Hubtisch fast leckölfrei in Position. Zum Senken wird es über die Steuerleitung X geöffnet.', 'Es begrenzt den Druck im Kolbenraum.', 'Es sorgt für eine konstante Hubgeschwindigkeit.', 'Es verhindert das Ausfahren des Zylinders.', 'Es reinigt das Öl im Rücklauf.'],
   e: 'Ein Sitzventil dichtet besser als der Kolbenschieber von -QM1. Beim Senken öffnet der Druck in Leitung B das Ventil.' },
 { cat: 'HYD', ref: 'Blatt 4', q: 'Wie wirkt das Drosselrückschlagventil -RN1 beim <b>Senken</b>?',
   o: ['Das Öl aus dem Kolbenraum muss durch die Drossel. Die Senkgeschwindigkeit wird begrenzt.', 'Das Öl strömt frei über das Rückschlagventil.', 'Es drosselt den Zulauf in den Ringraum.', 'Es erhöht die Kraft beim Senken.', 'Es hat beim Senken keine Wirkung.'],
   e: 'Beim Heben strömt das Öl frei über das Rückschlagventil. Beim Senken sperrt es, das Öl muss durch die Drossel.' },
 { cat: 'STE', ref: 'Blatt 5', q: 'Die Transition zwischen Schritt 1 und 2 soll in einer SPS programmiert werden. Welche Verknüpfung brauchst du?',
   o: ['UND-Verknüpfung', 'ODER-Verknüpfung', 'Zeitglied', 'Zähler', 'NICHT-Verknüpfung allein'],
   e: 'Der Punkt „·“ zwischen den Bedingungen bedeutet UND. Alle drei Signale müssen gleichzeitig anliegen.' },
 { cat: 'STE', ref: 'Blatt 5', q: 'Zwischen Schritt 3 und 4 steht -BG3 mit einem Strich darüber. Was bedeutet das?',
   o: ['Die Transition ist erfüllt, wenn -BG3 kein Signal mehr liefert.', 'Die Transition ist erfüllt, wenn -BG3 ein Signal liefert.', '-BG3 ist defekt.', '-BG3 wird in Schritt 4 eingeschaltet.', 'Der Schritt 4 wird übersprungen.'],
   e: 'Der Überstrich ist die Negation. Der Werkstückträger hat den Tisch verlassen, der Lichttaster sieht nichts mehr.' },
 { cat: 'STE', ref: 'Blatt 5', q: 'Welcher Schritt ist aktiv, während der Hubtisch nach unten fährt?',
   o: ['Schritt 4', 'Schritt 1', 'Schritt 2', 'Schritt 3', 'Kein Schritt, die Bewegung läuft von allein'],
   e: 'In Schritt 4 wird -MB2 angesteuert: Das Ventil schaltet auf Senken.' },
 { cat: 'TM', lock: true, ref: 'Situation', q: 'Die Pumpe -GP1 fördert Q = 12 l/min bei p = 120 bar. Wie groß ist die hydraulische Leistung?',
   o: ['2,4 kW', '24 kW', '1,44 kW', '0,24 kW', '144 kW'],
   e: 'P = p · Q = 120 · 10⁵ Pa · 12 / 60 000 m³/s = 2400 W = 2,4 kW.' },
 { cat: 'STE', ref: 'Blatt 6', q: 'Wozu dient der Schließer -QA1 (13/14) parallel zu -SF2?',
   o: ['Selbsthaltung: -QA1 bleibt angezogen, wenn -SF2 losgelassen wird.', 'Er schaltet die Meldeleuchte -PF1.', 'Er verhindert, dass -SF1 wirkt.', 'Er schützt den Motor vor Überlast.', 'Er schaltet das Ventil -QM1 um.'],
   e: 'Der Hilfskontakt überbrückt den Ein-Taster. Ausschalten geht mit -SF1, -SF0 oder -FC1.' },
 { cat: 'STE', ref: 'Blatt 6', q: 'Warum sind die Endschalter -BG1 und -BG2 als <b>Öffner</b> angeschlossen?',
   o: ['Drahtbruchsicherheit: Bei einem Kabelbruch wird die Bewegung abgeschaltet.', 'Öffner sind billiger als Schließer.', 'Damit der Zylinder über die Endlage hinausfährt.', 'Damit die Pumpe automatisch einschaltet.', 'Öffner brauchen keinen Strom.'],
   e: 'Ein Öffner leitet im Ruhezustand. Ist ein Kabel ab, fließt kein Strom mehr, die Spule fällt ab.' },
 { cat: 'STE', ref: 'Anlagenskizze', q: 'Die Werkstückträger sind aus Kunststoff. Welcher Sensor eignet sich als -BG3, um sie berührungslos zu erkennen?',
   o: ['Optischer Lichttaster', 'Induktiver Näherungsschalter', 'Reed-Kontakt', 'Magnetfeldsensor am Zylinder', 'Mechanischer Rollenendschalter'],
   e: 'Induktive Sensoren erkennen nur Metall, Reed-Kontakte nur Magnete. Ein Lichttaster erkennt jeden Gegenstand, der Licht reflektiert.' },
 { cat: 'STE', q: 'Was unterscheidet eine <b>Regelung</b> von einer Steuerung?',
   o: ['Bei der Regelung wird der Istwert gemessen, mit dem Sollwert verglichen und die Stellgröße angepasst (geschlossener Wirkungsablauf).', 'Eine Regelung arbeitet immer pneumatisch.', 'Bei der Regelung gibt es keinen Sollwert.', 'Eine Regelung ist ein offener Wirkungsablauf.', 'Steuern und Regeln bedeuten dasselbe.'],
   e: 'Steuerung: offene Wirkungskette ohne Rückmeldung. Regelung: Rückführung des Istwerts und ständiger Soll-Ist-Vergleich.' },
 { cat: 'WST', ref: 'Blatt 2', q: 'Warum sind Ritzelwelle und Stirnrad aus <b>16MnCr5</b> und einsatzgehärtet?',
   o: ['Die Zahnflanken sind hart und verschleißfest, der Kern bleibt zäh.', 'Der Stahl ist dadurch korrosionsbeständig.', 'Der Stahl ist durch viel Kohlenstoff durchgehend hart.', 'Einsatzstahl lässt sich nicht zerspanen.', 'Damit die Zahnräder leichter werden.'],
   e: '16MnCr5 hat wenig Kohlenstoff. Beim Einsatzhärten wird nur die Randschicht aufgekohlt und gehärtet.' },
 { cat: 'WST', ref: 'Blatt 2', q: 'Warum ist das Getriebegehäuse aus <b>EN-GJL-250</b>?',
   o: ['Gusseisen mit Lamellengraphit ist gut gießbar und dämpft Schwingungen und Geräusche.', 'Es ist besonders zäh und schlagfest.', 'Es lässt sich gut schmieden.', 'Es ist leichter als Aluminium.', 'Es ist gut schweißbar.'],
   e: 'Der Graphit dämpft. Gehäuse mit komplizierter Form gießt man deshalb oft aus GJL.' },
 { cat: 'TM', lock: true, ref: 'Situation', gen: true },
 { cat: 'QS', q: 'Die Stillstände der Hubstation sollen verringert werden. Mit welchem Werkzeug findest du die wichtigsten Störungsursachen?',
   o: ['Pareto-Analyse (Ursachen nach Häufigkeit ordnen)', 'Qualitätsregelkarte', 'Prüfanweisung', 'Messmittelfähigkeitsuntersuchung', 'Wahrscheinlichkeitsnetz'],
   e: 'Bei der Pareto-Analyse zeigt sich oft: Wenige Ursachen verursachen die meisten Störungen. Diese beseitigt man zuerst.' }
    ],
    genA(i, r) {
        if (i === 4) {
            const n1 = 1400, nR = n1 * 90 / 180, nA = nR * 17 / 51;
            const o = uniqOpts([nA, nR, nR * 3, nA * 2, nA / 2].map(x => fmtT(x) + ' 1/min'));
            return { q: 'Der Motor dreht mit n = 1400 1/min. Riementrieb: d<sub>w1</sub> = 90 mm, d<sub>w2</sub> = 180 mm. Zahnradstufe: z₁ = 17, z₂ = 51. Mit welcher Drehzahl dreht die Abtriebswelle (Pos. 3)?', o,
                     e: `Ritzelwelle: 1400 · 90/180 = 700 1/min. Abtrieb: 700 · 17/51 ≈ ${fmtT(nA)} 1/min.` };
        }
        if (i === 5) {
            return { q: 'In welcher Abbildung ist der Lagerdeckel (Pos. 8) im <b>Halbschnitt</b> richtig dargestellt?',
                     o: [deckelHalbschnitt('ok', 'pA1'), deckelHalbschnitt('voll', 'pA2'), deckelHalbschnitt('unten', 'pA3'), deckelHalbschnitt('kante', 'pA4'), deckelHalbschnitt('ohnebund', 'pA5')],
                     e: 'Beim Halbschnitt mit waagerechter Mittellinie ist die obere Hälfte geschnitten, die untere zeigt die Ansicht. Die Grenze ist die Mittellinie (Strich-Punkt-Linie). Der Zentrierbund muss in beiden Hälften zu sehen sein.' };
        }
        if (i === 27) {
            const eta = pick(r, [0.85, 0.9, 0.95]);
            const n = 1400 * 90 / 180 * 17 / 51, M = 550 * eta / (2 * Math.PI * n / 60);
            const o = uniqOpts([M, 550 / (2 * Math.PI * n / 60), 550 * eta / (2 * Math.PI * 1400 / 60), M * 10, 550 * eta / (n / 60)].map(x => fmt(x, 1) + ' Nm'));
            return { q: `Der Motor gibt P = 0,55 kW ab. Der Gesamtwirkungsgrad von Riementrieb und Getriebe ist <b>η = ${fmt(eta, 2)}</b>. Welches Drehmoment steht an der Abtriebswelle (n ≈ 233 1/min) zur Verfügung?`, o,
                     e: `P<sub>ab</sub> = 550 W · ${fmt(eta, 2)} = ${fmt(550 * eta, 1)} W. M = P / (2 · π · n) = ${fmt(550 * eta, 1)} W / (2 · π · ${fmt(n / 60, 3)} 1/s) ≈ ${fmt(M, 1)} Nm.` };
        }
    },
    buildB(rngFor) {
        const r2 = rngFor('B2'), r6 = rngFor('B6');
        const n1 = pick(r2, [1400, 1420, 1450]), d1 = pick(r2, [80, 90, 100]), d2 = 180;
        const iR = d2 / d1, nR = n1 / iR, nA = nR / 3;
        const mLast = pick(r6, [1200, 1500, 1800, 2000, 2400]);
        const A = Math.PI / 4 * 6.3 * 6.3, p = mLast * 9.81 / A / 10, v = 12000 / A / 100, t = 0.4 / v * 60;
        return [
        { id: 'B1', title: 'Leistungsfluss im Getriebe', ref: 'Blatt 1, 2', intro: 'Verfolge, wie das Drehmoment vom Riementrieb bis zum Kettenrad übertragen wird.',
          parts: [
            { id: 'a', type: 'order', pts: 7, cat: 'FUN', q: 'Bringe die Bauteile in die Reihenfolge des Leistungsflusses.',
              items: ['Keilriemenscheibe (Pos. 9)', 'Passfeder (Pos. 14)', 'Ritzelwelle (Pos. 2)', 'Stirnrad (Pos. 4)', 'Passfeder (Pos. 15)', 'Abtriebswelle (Pos. 3)', 'Passfeder (Pos. 18) zum Kettenrad'],
              e: 'Riemenscheibe → Passfeder → Ritzelwelle → Zahneingriff → Stirnrad → Passfeder → Abtriebswelle → Passfeder → Kettenrad.' },
            { id: 'b', type: 'select', pts: 3, cat: 'FUN', q: 'Warum ist das Ritzel direkt an die Welle angearbeitet (Ritzelwelle) und nicht als eigenes Zahnrad aufgesetzt?',
              options: ['Das Ritzel ist so klein, dass für eine Bohrung mit Passfedernut kein Platz bleibt.', 'Damit man das Ritzel leichter wechseln kann.', 'Weil Ritzel immer aus Gusseisen sind.', 'Damit die Übersetzung größer wird.'], ans: 0,
              e: 'Bei z = 17 und m = 2 ist der Fußkreis nur etwa 29 mm groß. Eine Nabe mit Passfeder für eine 30-mm-Welle passt nicht hinein.' }
          ] },
        { id: 'B2', title: 'Übersetzungen und Drehzahlen', ref: 'Situation', intro: `Der Motor -MA2 dreht mit <b>n = ${n1} 1/min</b>. Die Motor-Riemenscheibe hat <b>d<sub>w1</sub> = ${d1} mm</b>, die Keilriemenscheibe (Pos. 9) d<sub>w2</sub> = 180 mm. Zahnradstufe: z₁ = 17, z₂ = 51.`,
          parts: [
            { id: 'a', type: 'num', pts: 10, cat: 'TM', q: 'Berechne. Übersetzungen auf zwei Nachkommastellen, Drehzahlen auf eine Nachkommastelle.',
              fields: [{ label: 'Übersetzung Riementrieb i₁', unit: '', ans: iR, tol: 0.006, show: fmt(iR, 2) }, { label: 'Drehzahl Ritzelwelle n₂', unit: '1/min', ans: nR, tol: 0.15, show: fmt(nR, 1) },
                       { label: 'Übersetzung Zahnradstufe i₂', unit: '', ans: 3, tol: 0.006, show: '3,00' }, { label: 'Drehzahl Abtriebswelle n₃', unit: '1/min', ans: nA, tol: 0.15, show: fmt(nA, 1) },
                       { label: 'Gesamtübersetzung i', unit: '', ans: iR * 3, tol: 0.02, show: fmt(iR * 3, 2) }],
              e: `i₁ = d<sub>w2</sub> / d<sub>w1</sub> = 180 / ${d1} = ${fmt(iR, 2)}. n₂ = ${n1} / ${fmt(iR, 2)} ≈ ${fmt(nR, 1)} 1/min. i₂ = z₂ / z₁ = 51 / 17 = 3. n₃ = ${fmt(nR, 1)} / 3 ≈ ${fmt(nA, 1)} 1/min. i = i₁ · i₂ = ${fmt(iR * 3, 2)}.` }
          ] },
        { id: 'B3', title: 'Demontage der Abtriebswelle', ref: 'Situation, Blatt 1, 2', intro: 'Der Wellendichtring (Pos. 13) und die Abtriebswelle sollen erneuert werden. Die Anlage ist abgeschaltet und gesichert, das Getriebe ist ausgebaut.',
          parts: [
            { id: 'a', type: 'order', pts: 6, cat: 'INS', q: 'Bringe die Demontageschritte in die richtige Reihenfolge.',
              items: ['Öl über die Verschlussschraube (Pos. 20) ablassen', 'Kettenrad abziehen, Passfeder (Pos. 18) entnehmen', 'Lagerdeckel (Pos. 5 und 6) abschrauben, Passscheiben (Pos. 16) kennzeichnen und aufbewahren', 'Gehäuseoberteil mit der Ritzelwelle abheben', 'Abtriebswelle mit Stirnrad und Lagern aus dem Unterteil nehmen', 'Lager abziehen, Distanzhülse (Pos. 7) und Stirnrad (Pos. 4) abpressen'],
              e: 'Erst Öl ab und Anbauteile weg, dann Deckel lösen, Gehäuse öffnen, Welle herausnehmen und zuletzt zerlegen.' },
            { id: 'b', type: 'text', pts: 4, cat: 'INS', q: 'Nenne vier Dinge, auf die du bei der Demontage achten musst.',
              crit: [{ t: 'Teile kennzeichnen und geordnet ablegen; Passscheiben dem richtigen Deckel zuordnen.', p: 1 }, { t: 'Geeignete Abzieher/Presse verwenden, Kraft nicht über Wälzkörper.', p: 1 },
                     { t: 'Dicht- und Passflächen nicht beschädigen, keine Hammerschläge auf Passflächen.', p: 1 }, { t: 'Sauber arbeiten; Altöl auffangen und richtig entsorgen; Schäden dokumentieren.', p: 1 }],
              muster: 'Alle Teile kennzeichnen und geordnet ablegen, besonders die Passscheiben. Lager und Stirnrad nur mit Abzieher oder Presse lösen. Passflächen und Dichtflächen nicht beschädigen. Sauber arbeiten, Altöl auffangen und entsorgen. Gefundene Schäden notieren.' }
          ] },
        { id: 'B4', title: 'Funktion der Hydraulik', ref: 'Blatt 4', intro: 'Analysiere den Hydraulikplan des Hubzylinders -MM1.',
          parts: [
            { id: 'a', type: 'match', pts: 3, cat: 'HYD', q: 'Was macht der Zylinder in den Schaltzuständen von -QM1?',
              rows: ['-MB1 hat Strom', '-MB2 hat Strom', 'Keine Magnetspule hat Strom'],
              options: ['Zylinder fährt aus (Heben)', 'Zylinder fährt ein (Senken)', 'Zylinder steht, Pumpe fördert drucklos zum Tank'], ans: [0, 1, 2],
              e: '-MB1: P→A in den Kolbenraum. -MB2: P→B in den Ringraum. Ohne Strom: Mittelstellung mit Umlauf.' },
            { id: 'b', type: 'text', pts: 4, cat: 'HYD', q: 'Beschreibe den Weg des Öls beim <b>Senken</b> mit den Kennzeichen der Bauteile.',
              crit: [{ t: 'Pumpe -GP1 fördert über -QM1 von P nach B in den Ringraum.', p: 1 }, { t: 'Der Druck in Leitung B öffnet -RM1 über die Steuerleitung X.', p: 1 },
                     { t: 'Öl aus dem Kolbenraum fließt durch die Drossel von -RN1 (Rückschlagventil sperrt) → langsames Senken.', p: 1 }, { t: 'Weiter über -RM1, -QM1 (A → T) und den Filter -HQ1 in den Tank.', p: 1 }],
              muster: '-MB2 schaltet -QM1 um. Das Öl strömt von P nach B in den Ringraum. Der Druck in B öffnet über X das Rückschlagventil -RM1. Das Öl aus dem Kolbenraum muss durch die Drossel von -RN1, weil dessen Rückschlagventil sperrt. Danach fließt es über -RM1, von A nach T, durch den Filter -HQ1 in den Tank.' },
            { id: 'c', type: 'select', pts: 3, cat: 'INS', q: 'Der Hubtisch sinkt im Stillstand langsam ab. Was ist die wahrscheinlichste Ursache?',
              options: ['-RM1 dichtet nicht mehr, z. B. Schmutz am Ventilsitz.', '-QN1 ist zu hoch eingestellt.', 'Der Filter -HQ1 ist verschmutzt.', 'Die Drossel von -RN1 ist zu weit geöffnet.'], ans: 0,
              e: '-RM1 soll den Tisch halten. Die Drossel wirkt nur auf die Senkgeschwindigkeit.' }
          ] },
        { id: 'B5', title: 'Ablauf nach GRAFCET', ref: 'Blatt 5, Anlagenskizze', intro: 'Analysiere den GRAFCET der Hubstation.',
          parts: [
            { id: 'a', type: 'match', pts: 3, cat: 'STE', q: 'Welche Aktion ist in welchem Schritt aktiv?',
              rows: ['Schritt 2', 'Schritt 3', 'Schritt 4'], options: ['-MB1: Tisch heben', '-MA2: Werkstückträger abfördern', '-MB2: Tisch senken'], ans: [0, 1, 2],
              e: 'Siehe Aktionen rechts neben den Schritten.' },
            { id: 'b', type: 'text', pts: 4, cat: 'STE', q: 'Beschreibe den Ablauf von Schritt 1 bis Schritt 3 mit den Kennzeichen der Bauteile.',
              crit: [{ t: 'Schritt 1 ist aktiv; wenn -QA1 (Pumpe läuft), -BG2 (Tisch unten) und -BG3 (WT da) gleichzeitig melden, wird Schritt 2 aktiv.', p: 1 },
                     { t: 'In Schritt 2 wird -MB1 angesteuert, -QM1 schaltet auf Heben, -MM1 fährt aus.', p: 1 },
                     { t: 'Meldet -BG1 „oben“, wird Schritt 2 deaktiviert und Schritt 3 aktiv.', p: 1 }, { t: 'In Schritt 3 läuft -MA2, die Rollen fördern den Werkstückträger auf die obere Rollenbahn.', p: 1 }],
              muster: 'In Schritt 1 wartet die Anlage. Laufen die Pumpe (-QA1), ist der Tisch unten (-BG2) und steht ein Werkstückträger auf dem Tisch (-BG3), schaltet der Ablauf zu Schritt 2. Dort bekommt -MB1 Strom, -QM1 schaltet auf Heben und der Zylinder -MM1 fährt aus. Meldet -BG1 „Tisch oben“, wird Schritt 3 aktiv. Jetzt läuft -MA2 und die Rollen fördern den Werkstückträger auf die obere Bahn.' },
            { id: 'c', type: 'select', pts: 3, cat: 'STE', q: 'Der Endschalter -BG1 ist defekt und meldet nie. Was passiert?',
              options: ['Schritt 2 bleibt aktiv. -MB1 bleibt angesteuert, der Zylinder fährt in die Endlage, -QN1 öffnet und das Öl erwärmt sich.', 'Der Ablauf springt sofort zu Schritt 3.', 'Der Tisch senkt sich automatisch.', 'Die Pumpe schaltet sich ab.'], ans: 0,
              e: 'Ohne Signal von -BG1 wird die Transition nie erfüllt. Die Pumpe fördert dann gegen das Druckbegrenzungsventil.' }
          ] },
        { id: 'B6', title: 'Berechnungen am Hubzylinder', ref: 'Situation, Blatt 4', intro: `Auf dem Hubtisch liegt eine Last von <b>m = ${fmtT(mLast)} kg</b>. Zylinder -MM1: D = 63 mm, Hub 400 mm. Pumpe: Q = 12 l/min. Rechne mit g = 9,81 m/s² und der π-Taste. Reibung und Wirkungsgrad bleiben unberücksichtigt.`,
          parts: [
            { id: 'a', type: 'num', pts: 5, cat: 'TM', q: 'Berechne Kolbenfläche und den Druck, der zum Heben nötig ist. Eine Nachkommastelle.',
              fields: [{ label: 'Kolbenfläche A', unit: 'cm²', ans: A, tol: 0.15, show: fmt(A, 1) }, { label: 'erforderlicher Druck p<sub>e</sub>', unit: 'bar', ans: p, tol: p * 0.015, show: fmt(p, 1) }],
              e: `A = π · (6,3 cm)² / 4 ≈ ${fmt(A, 2)} cm². F = ${fmtT(mLast)} kg · 9,81 m/s² ≈ ${fmtT(mLast * 9.81)} N. p = F / A ≈ ${fmt(mLast * 9.81 / A, 1)} N/cm² = ${fmt(p, 1)} bar.` },
            { id: 'b', type: 'num', pts: 5, cat: 'TM', q: 'Berechne die Hubgeschwindigkeit und die Zeit für den ganzen Hub. Zwei Nachkommastellen.',
              fields: [{ label: 'Hubgeschwindigkeit v', unit: 'm/min', ans: v, tol: 0.03, show: fmt(v, 2) }, { label: 'Zeit für 400 mm Hub', unit: 's', ans: t, tol: 0.08, show: fmt(t, 2) }],
              e: `v = Q / A = 12 000 cm³/min / ${fmt(A, 2)} cm² ≈ ${fmt(v, 2)} m/min. t = 0,4 m / ${fmt(v, 2)} m/min ≈ ${fmt(t, 2)} s.` }
          ] },
        { id: 'B7', title: 'Fehlersuche im Einrichtbetrieb', ref: 'Blatt 4, 6', intro: 'Im Einrichtbetrieb läuft die Pumpe, die Meldeleuchte -PF1 leuchtet. Beim Drücken von -SF3 hebt der Tisch aber nicht.',
          parts: [
            { id: 'a', type: 'match', pts: 6, cat: 'INS', q: 'Kommen diese Ursachen in Frage?',
              rows: ['Endschalter -BG1 ist betätigt oder defekt', 'Magnetspule -MB1 ist durchgebrannt', 'Hilfskontakt -QA1 (33/34) schaltet nicht', 'Motorschutz -FC1 hat ausgelöst', 'Not-Halt -SF0 ist gedrückt', 'Druckbegrenzungsventil -QN1 ist auf 5 bar verstellt'],
              options: ['möglich', 'nicht möglich'], ans: [0, 0, 0, 1, 1, 0], keepOrder: true,
              e: 'Läuft die Pumpe, sind -FC1 und -SF0 in Ordnung. Alle Fehler im Strompfad 4 oder in der Hydraulik sind möglich.' },
            { id: 'b', type: 'text', pts: 4, cat: 'STE', q: 'Du willst prüfen, ob an der Spule -MB1 Spannung anliegt. Wie gehst du sicher vor?',
              crit: [{ t: 'Nur als Elektrofachkraft oder elektrotechnisch unterwiesene Person unter Aufsicht messen.', p: 1 }, { t: 'Geeignetes Messgerät, vorher an einer bekannten Spannung prüfen.', p: 1 },
                     { t: '-SF3 drücken und an -MB1 messen: Spannung da → Spule/Ventil prüfen; keine Spannung → Strompfad rückwärts verfolgen.', p: 1 }, { t: 'Spule spannungsfrei mit dem Ohmmeter auf Durchgang prüfen.', p: 1 }],
              muster: 'Messen an spannungsführenden Teilen darf nur eine Elektrofachkraft. Den Spannungsprüfer vorher an bekannter Spannung testen. -SF3 drücken und an -MB1 messen. Ist Spannung da, liegt der Fehler an Spule oder Ventil. Fehlt sie, misst man rückwärts über -BG1, -SF3 und -QA1. Die Spule prüft man spannungsfrei mit dem Ohmmeter.' }
          ] },
        { id: 'B8', title: 'Normteile und Abdichtung', ref: 'Blatt 1, 2', intro: 'Sieh dir Gesamtzeichnung und Stückliste an.',
          parts: [
            { id: 'a', type: 'match', pts: 4, cat: 'TK', q: 'Was bedeuten die Normbezeichnungen?',
              rows: ['Rillenkugellager 6205-2Z', 'Kegelrollenlager 30206', 'Radial-Wellendichtring A 30 × 47 × 7', 'Passfeder A 10 × 8 × 20'],
              options: ['Bohrung 25 mm, beidseitig Deckscheiben', 'Bohrung 30 mm, Kegelrollen', 'Wellen-Ø 30, Außen-Ø 47, Breite 7 mm', 'rundstirnig, Breite 10, Höhe 8, Länge 20 mm'], ans: [0, 1, 2, 3],
              e: 'Bei Wälzlagern ergeben die letzten beiden Ziffern mal 5 die Bohrung.' },
            { id: 'b', type: 'select', pts: 3, cat: 'FUN', q: 'Warum sitzen die Lagerinnenringe fest auf der Welle, die Außenringe aber lockerer im Gehäuse?',
              options: ['Die Innenringe drehen sich unter der stehenden Last (Umfangslast) und müssen fest sitzen. Die Außenringe haben Punktlast.', 'Damit man die Welle leichter ausbauen kann.', 'Weil Gusseisen keine Übermaßpassung zulässt.', 'Damit die Lager mehr Spiel haben.'], ans: 0,
              e: 'Ein Ring mit Umfangslast würde bei lockerem Sitz wandern und die Passfläche zerstören.' },
            { id: 'c', type: 'text', pts: 3, cat: 'FUN', q: 'Wie wird das Getriebe abgedichtet? Nenne drei Dichtstellen mit Positionsnummer und Art der Dichtung.',
              crit: [{ t: 'Lagerdeckel – Gehäuse: O-Ringe Pos. 19 (ruhende/statische Dichtung).', p: 1 }, { t: 'Wellendurchgänge: Radial-Wellendichtringe Pos. 12 und 13 (bewegte/dynamische Dichtung).', p: 1 }, { t: 'Ölablass: Dichtring Pos. 21 unter der Verschlussschraube Pos. 20.', p: 1 }],
              muster: 'Zwischen Lagerdeckeln und Gehäuse dichten die O-Ringe Pos. 19. Das sind ruhende Dichtungen. An den drehenden Wellen dichten die Radial-Wellendichtringe Pos. 12 und 13. An der Ölablassschraube Pos. 20 dichtet der Kupferdichtring Pos. 21.' }
          ] }
        ];
    }
};
