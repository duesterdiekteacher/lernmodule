/* ============================================================
   AP Teil 2 – Industriemechaniker – Auftrags- und Funktionsanalyse
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
    id: 'afa-im', key: 'ap2-afa-im-1', summary: true,
    title: 'Auftrags- und Funktionsanalyse', subtitle: 'Abschlussprüfung Teil 2 · Industriemechaniker/-in · Projekt Hubstation',
    logo: '🔍', back: './', backLabel: '← Zurück zur Übersicht Teil 2',
    duration: 105, aAbw: 3, aWeight: 0.5, bAbw: 0, bWeight: 0.5,
    intro: introAfaFt('Auftrags- und Funktionsanalyse', 105),
    bIntro: '<p>Arbeite mit den Unterlagen (📐 Zeichnung) und deinem Tabellenbuch. Gib Zahlen mit Komma oder Punkt ein.</p>',
    docs: IM_DOCS,
    cats: { FUN: 'Funktion und Montage', HYD: 'Hydraulik', ELT: 'Elektro- und Steuerungstechnik', INS: 'Instandhaltung', WST: 'Werkstofftechnik', QS: 'Prüftechnik und Qualität', TM: 'Technische Mathematik', TK: 'Technische Kommunikation' },
    aDef: [
 { cat: 'TK', lock: true, q: 'Sieh dir die Gesamtzeichnung der Lagereinheit an. Welches Lager ist das <b>Festlager</b>?',
   o: ['Das linke Lager: Der Außenring sitzt zwischen Gehäuseschulter und Zentrierbund des Deckels.', 'Das rechte Lager, weil der Deckel dort einen Spalt hat.', 'Beide Lager sind Festlager.', 'Beide Lager sind Loslager.', 'Das rechte Lager, weil sein Innenring mit einem Sicherungsring gesichert ist.'],
   e: 'Links ist der Außenring in beiden Richtungen festgelegt: Gehäuseschulter und Deckel-Zentrierbund. Rechts hat der Außenring Platz zu beiden Seiten. Das ist das Loslager.' },
 { cat: 'FUN', q: 'Warum ist die Welle als <b>Fest-Los-Lagerung</b> ausgeführt?',
   o: ['Die Welle kann sich bei Erwärmung ausdehnen, ohne dass die Lager verspannt werden.', 'So kann man auf Schmierung verzichten.', 'Das Loslager nimmt die gesamte Radialkraft auf.', 'Das Festlager darf keine Axialkräfte aufnehmen.', 'So kann sich die Welle im Gehäuse frei verschieben.'],
   e: 'Das Festlager führt die Welle axial. Das Loslager lässt Längenänderungen zu, z. B. durch Wärme. Sonst würden die Lager verspannt.' },
 { cat: 'FUN', q: 'Welche Aufgabe haben die Radial-Wellendichtringe (Pos. 5)?',
   o: ['Sie halten den Schmierstoff im Gehäuse und Schmutz draußen.', 'Sie sichern die Lager axial.', 'Sie übertragen das Drehmoment auf die Riemenscheibe.', 'Sie zentrieren den Lagerdeckel.', 'Sie dämpfen Schwingungen der Welle.'],
   e: 'Die Dichtlippe liegt auf der drehenden Welle. Sie dichtet gegen Schmierstoffverlust und gegen Schmutz und Wasser von außen.' },
 { cat: 'TM', lock: true, q: 'Der Motor dreht mit n₁ = 1400 1/min. Die Riemenscheiben haben d₁ = 80 mm (Motor) und d₂ = 200 mm (Welle). Mit welcher Drehzahl dreht die Antriebswelle (ohne Schlupf)?',
   o: ['560 1/min', '3500 1/min', '1400 1/min', '224 1/min', '700 1/min'],
   e: 'n₁ · d₁ = n₂ · d₂ → n₂ = 1400 · 80 / 200 = 560 1/min. Die große Scheibe dreht langsamer.' },
 { cat: 'TK', lock: true, q: 'In der Gesamtzeichnung ist das Gehäuse schraffiert, die Welle aber nicht. Warum?',
   o: ['Wellen, Schrauben, Stifte und Passfedern werden im Längsschnitt nach Norm nicht geschnitten dargestellt.', 'Die Welle ist aus einem anderen Werkstoff.', 'Die Welle liegt hinter der Schnittebene.', 'Die Welle wurde vergessen zu schraffieren.', 'Nur Gussteile werden schraffiert.'],
   e: 'Volle Bauteile wie Wellen, Bolzen, Schrauben, Stifte und Passfedern schneidet man in Längsrichtung nicht. Das macht die Zeichnung übersichtlicher.' },
 { cat: 'FUN', q: 'Die Riemenscheibe sitzt mit einer Passfeder (Pos. 7) auf der Welle. Welche Verbindungsart ist das?',
   o: ['Formschlüssige Welle-Nabe-Verbindung', 'Kraftschlüssige Welle-Nabe-Verbindung', 'Stoffschlüssige Verbindung', 'Pressverbindung', 'Klemmverbindung'],
   e: 'Die Passfeder greift in Wellennut und Nabennut. Die Form überträgt das Drehmoment.' },
 { cat: 'FUN', q: 'Was bedeutet die Lagerbezeichnung <b>6205</b>?',
   o: ['Rillenkugellager mit 25 mm Bohrungsdurchmesser', 'Rillenkugellager mit 52 mm Außendurchmesser und 5 Kugeln', 'Zylinderrollenlager mit 25 mm Bohrung', 'Kegelrollenlager der Breite 20,5 mm', 'Rillenkugellager mit 205 mm Bohrung'],
   e: '6 = Rillenkugellager. Die letzten zwei Ziffern ab 04 mal 5 ergeben die Bohrung: 05 × 5 = 25 mm.' },
 { cat: 'INS', q: 'Eine Lagerstelle wird heiß und macht Geräusche. Was ist eine häufige Ursache?',
   o: ['Zu wenig oder verschmutzter Schmierstoff', 'Die Welle dreht zu langsam.', 'Der Riemen ist zu locker.', 'Das Gehäuse ist aus Gusseisen.', 'Der Wellendichtring ist neu.'],
   e: 'Ohne genug sauberen Schmierstoff steigt die Reibung. Das Lager wird heiß und verschleißt schnell.' },
 { cat: 'TK', lock: true, q: 'Die Lagersitze der Welle sind mit <b>Ø25 k5</b> toleriert. Was trifft zu?',
   o: ['Es ist ein Wellenmaß mit Toleranzgrad 5. Das Toleranzfeld liegt über der Nulllinie.', 'Es ist ein Bohrungsmaß mit Toleranzgrad 5.', 'Das obere Abmaß ist null.', 'k5 bedeutet: Die Welle ist 5 µm kleiner als 25 mm.', 'Das Toleranzfeld liegt unter der Nulllinie.'],
   e: 'Kleinbuchstaben gelten für Wellen. k5 für 25 mm: +2 bis +11 µm. Zusammen mit dem Lagerinnenring entsteht ein fester Sitz.' },
 { cat: 'INS', q: 'Das neue Lager wird kalt auf die Welle gepresst. Was ist richtig?',
   o: ['Die Kraft wird nur über den Innenring aufgebracht, z. B. mit einer Montagehülse.', 'Man schlägt mit dem Hammer auf den Außenring.', 'Die Kraft wird über die Kugeln übertragen.', 'Man presst über den Käfig.', 'Man schlägt direkt mit einem Stahldorn auf die Dichtscheibe.'],
   e: 'Die Montagekraft darf nie über die Wälzkörper laufen. Sonst entstehen Eindrücke in den Laufbahnen.' },
 { cat: 'INS', q: 'Das Lager soll zum Aufziehen erwärmt werden. Wie gehst du vor?',
   o: ['Mit Induktions-Anwärmgerät oder Wärmeschrank auf etwa 80 bis 100 °C, nie mit offener Flamme', 'Mit dem Schweißbrenner rotglühend machen', 'In kochendem Wasser 2 Stunden lang erwärmen', 'Auf 300 °C im Härteofen erwärmen', 'Mit dem Heißluftfön nur den Außenring erwärmen'],
   e: 'Zu heiß verändert das Gefüge des Lagerstahls. Gleichmäßig auf etwa 80–100 °C erwärmen reicht für das Aufziehen.' },
 { cat: 'TM', lock: true, q: 'Der Zylinder 1A1 fährt mit Q = 12 l/min <b>ein</b> (Öl strömt in den Ringraum). D = 63 mm, d = 36 mm. Wie groß ist die Einfahrgeschwindigkeit ungefähr?',
   o: ['0,095 m/s', '0,064 m/s', '0,95 m/s', '5,7 m/s', '0,034 m/s'],
   e: 'A<sub>R</sub> = π/4 · (6,3² − 3,6²) cm² ≈ 20,99 cm². v = Q / A<sub>R</sub> = 12 000 cm³/min / 20,99 cm² ≈ 572 cm/min ≈ 0,095 m/s.' },
 { cat: 'HYD', q: 'Welche Aufgabe hat das Druckbegrenzungsventil 0V1?',
   o: ['Es begrenzt den Systemdruck und schützt die Anlage vor Überlast.', 'Es hält den Zylinder in jeder Stellung fest.', 'Es regelt die Geschwindigkeit des Zylinders.', 'Es filtert das Öl.', 'Es schaltet die Pumpe ab, wenn der Tank leer ist.'],
   e: 'Steigt der Druck über den eingestellten Wert, öffnet 0V1 zum Tank. So wird der Druck begrenzt.' },
 { cat: 'TK', lock: true, q: 'Welche Schaltstellung von 1V1 ist im Hydraulikplan gezeichnet?',
   o: ['Die Mittelstellung: P ist mit T verbunden (Umlauf), A und B sind gesperrt.', 'Die Stellung „Heben“: P nach A, B nach T.', 'Die Stellung „Senken“: P nach B, A nach T.', 'Die Mittelstellung: Alle Anschlüsse sind gesperrt.', 'Die Mittelstellung: Alle Anschlüsse sind miteinander verbunden.'],
   e: 'Gezeichnet ist immer die Ruhestellung. Hier fördert die Pumpe drucklos zum Tank, der Zylinder steht.' },
 { cat: 'HYD', q: 'Welche Aufgabe hat das entsperrbare Rückschlagventil 1V2?',
   o: ['Es hält den Hubtisch fast leckölfrei in Position. Zum Senken wird es über die Steuerleitung X geöffnet.', 'Es begrenzt den Druck im Kolbenraum.', 'Es sorgt für eine konstante Hubgeschwindigkeit.', 'Es verhindert, dass der Zylinder ausfahren kann.', 'Es reinigt das Öl im Rücklauf.'],
   e: 'Wegeventile mit Kolbenschieber haben etwas Leckage. Das Rückschlagventil mit Sitz dichtet besser. Beim Senken öffnet der Druck in Leitung B das Ventil.' },
 { cat: 'HYD', q: 'Wie wirkt das Drosselrückschlagventil 1V3 beim <b>Senken</b>?',
   o: ['Das Öl aus dem Kolbenraum muss durch die Drossel. Die Senkgeschwindigkeit wird begrenzt.', 'Das Öl strömt frei über das Rückschlagventil. Der Tisch fällt schnell.', 'Es drosselt den Zulauf in den Ringraum.', 'Es erhöht die Kraft beim Senken.', 'Es hat beim Senken keine Wirkung.'],
   e: 'Beim Heben öffnet das Rückschlagventil (freier Durchfluss). Beim Senken sperrt es, das Öl muss durch die Drossel.' },
 { cat: 'HYD', q: 'Wo sitzt der Filter 0Z1 und was macht er?',
   o: ['In der Rücklaufleitung: Er filtert das Öl, bevor es in den Tank fließt.', 'In der Druckleitung direkt hinter der Pumpe.', 'In der Saugleitung vor der Pumpe.', 'In der Steuerleitung X.', 'Im Kolben des Zylinders.'],
   e: 'Ein Rücklauffilter hält Schmutz aus der Anlage zurück, bevor das Öl in den Tank gelangt.' },
 { cat: 'ELT', q: 'Sieh dir Strompfad 1 und 2 an. Wozu dient der Schließer Q1 (13/14) parallel zu S2?',
   o: ['Selbsthaltung: Q1 bleibt angezogen, wenn S2 losgelassen wird.', 'Er schaltet die Meldeleuchte H1.', 'Er verhindert, dass S1 wirkt.', 'Er schützt den Motor vor Überlast.', 'Er schaltet das Ventil 1V1 um.'],
   e: 'Nach dem Drücken von S2 zieht Q1 an. Der eigene Schließer überbrückt S2. Ausschalten geht mit S1, S0 oder F2.' },
 { cat: 'ELT', q: 'Warum sind die Endschalter B1 und B2 als <b>Öffner</b> eingebaut?',
   o: ['Drahtbruchsicherheit: Bei einem Kabelbruch wird die Bewegung abgeschaltet.', 'Öffner sind billiger als Schließer.', 'Damit der Zylinder über die Endlage hinausfährt.', 'Damit die Pumpe automatisch einschaltet.', 'Öffner brauchen keinen Strom.'],
   e: 'Ein Öffner leitet im Ruhezustand. Ist ein Kabel ab, fließt kein Strom. Die Magnetspule wird stromlos, der Zylinder bleibt stehen.' },
 { cat: 'TM', lock: true, q: 'Die Pumpe fördert Q = 12 l/min bei p = 120 bar. Wie groß ist die hydraulische Leistung?',
   o: ['2,4 kW', '24 kW', '1,44 kW', '0,24 kW', '144 kW'],
   e: 'P = p · Q = 120 · 10⁵ Pa · 12 / 60 000 m³/s = 12 000 000 · 0,0002 W = 2400 W = 2,4 kW.' },
 { cat: 'ELT', q: 'Wozu dient der Schließer Q1 (33/34) in Strompfad 4?',
   o: ['Heben und Senken ist nur möglich, wenn der Pumpenmotor läuft.', 'Er schaltet die Pumpe ein.', 'Er ist die Selbsthaltung für Y1.', 'Er überbrückt den Endschalter B1.', 'Er schützt die Spule Y2 vor Überspannung.'],
   e: 'Nur wenn Q1 angezogen ist, bekommen die Ventilspulen Spannung. Das ist eine Verriegelung.' },
 { cat: 'ELT', q: 'Welche Aufgabe hat ein Fehlerstrom-Schutzschalter (RCD) mit 30 mA?',
   o: ['Er schaltet ab, wenn Strom über einen falschen Weg (z. B. über einen Menschen) zur Erde fließt.', 'Er schützt den Motor vor Überlast.', 'Er begrenzt die Spannung auf 30 V.', 'Er schaltet bei Kurzschluss zwischen L1 und L2 erst nach 30 Sekunden ab.', 'Er ersetzt den Schutzleiter.'],
   e: 'Der RCD vergleicht den hin- und zurückfließenden Strom. Weicht er um 30 mA ab, schaltet er sehr schnell ab. Das schützt Menschen.' },
 { cat: 'WST', q: 'Die Welle ist aus <b>42CrMo4</b>. Was bedeutet das?',
   o: ['Niedriglegierter Stahl mit 0,42 % Kohlenstoff, etwa 1 % Chrom und etwas Molybdän', 'Hochlegierter Stahl mit 42 % Chrom', 'Unlegierter Stahl mit 4,2 % Kohlenstoff', 'Stahl mit 420 N/mm² Streckgrenze und 4 % Molybdän', 'Gusseisen mit Chrom und Molybdän'],
   e: '42 : 100 = 0,42 % C. Bei Cr teilt man durch 4: 4 : 4 = 1 % Chrom. Mo ist ohne Zahl, also nur in kleiner Menge.' },
 { cat: 'WST', q: 'Das Lagergehäuse ist aus <b>EN-GJL-250</b>. Was trifft zu?',
   o: ['Gusseisen mit Lamellengraphit, Mindestzugfestigkeit 250 N/mm². Es dämpft Schwingungen gut.', 'Stahlguss mit 250 N/mm² Streckgrenze', 'Gusseisen mit Kugelgraphit, sehr zäh', 'Aluminiumguss mit 250 N/mm²', 'Baustahl, schweißgeeignet'],
   e: 'GJL = Gusseisen mit Lamellengraphit. Es ist gut gießbar, dämpft gut, ist aber spröde.' },
 { cat: 'QS', q: 'Bei der Fertigung der Lagersitze ergibt sich ein Prozessfähigkeitsindex <b>c<sub>pk</sub> = 0,8</b>. Was bedeutet das?',
   o: ['Der Prozess ist nicht fähig. Es entsteht Ausschuss, oder die Lage ist nicht mittig.', 'Der Prozess ist sehr gut fähig.', 'Es sind 0,8 % Ausschuss erlaubt.', 'Die Messmittel sind ungenau.', 'Der Prozess ist fähig, wenn c<sub>pk</sub> unter 1 liegt.'],
   e: 'Üblich wird c<sub>pk</sub> ≥ 1,33 gefordert. Unter 1 liegen Teile außerhalb der Toleranz.' },
 { cat: 'QS', q: 'Auf der Qualitätsregelkarte liegt ein Messwert <b>außerhalb der Eingriffsgrenze</b>. Was tust du?',
   o: ['Den Prozess anhalten, die Ursache suchen und beseitigen. Die Teile seit der letzten Prüfung prüfen.', 'Nichts, solange der Wert in der Toleranz liegt.', 'Den Messwert löschen.', 'Die Eingriffsgrenzen erweitern.', 'Nur die nächste Stichprobe später nehmen.'],
   e: 'Die Eingriffsgrenze zeigt: Der Prozess ist gestört. Man muss eingreifen, bevor Ausschuss entsteht.' },
 { cat: 'TM', lock: true, q: 'Der Motor gibt 0,75 kW ab. Welches Drehmoment wirkt an der Antriebswelle bei n = 560 1/min (ohne Verluste)?',
   o: ['12,8 Nm', '5,1 Nm', '80,4 Nm', '0,21 Nm', '128 Nm'],
   e: 'M = P / (2 · π · n) = 750 W / (2 · π · 560/60 1/s) ≈ 12,8 Nm.' },
 { cat: 'INS', q: 'Die Lagerstellen sollen künftig regelmäßig mit einem Schwingungsmessgerät überwacht werden. Welche Instandhaltungsstrategie ist das?',
   o: ['Zustandsorientierte Instandhaltung', 'Ausfallorientierte Instandhaltung', 'Intervallorientierte Instandhaltung', 'Verbesserung', 'Instandsetzung'],
   e: 'Man misst den Zustand und tauscht erst, wenn sich ein Schaden ankündigt. So nutzt man die Lebensdauer gut aus.' }
    ],
    genA() { return null; },
    buildB(rngFor) {
        const r4 = rngFor('B4'), r8 = rngFor('B8');
        const mLast = pick(r4, [1200, 1500, 1800, 2000, 2400]);
        const A = Math.PI / 4 * 6.3 * 6.3; // cm²
        const p = mLast * 9.81 / A / 10; // bar
        const v = 12000 / A / 100; // m/min
        const t = 0.4 / v * 60;
        const ist = [];
        const mk = (ok, okV, badV) => ist.push({ ok, val: ok ? pick(r8, okV) : pick(r8, badV) });
        mk(r8() < 0.5, ['25,004', '25,009', '25,006'], ['25,013', '24,999', '25,015']);
        mk(r8() < 0.5, ['25,003', '25,010', '25,007'], ['25,001', '25,012', '24,998']);
        mk(r8() < 0.5, ['20,005', '20,012', '20,009'], ['20,016', '20,000', '20,018']);
        return [
        { id: 'B1', title: 'Funktion der Lagereinheit', intro: 'Analysiere die Gesamtzeichnung der Lagereinheit und die Stückliste.',
          parts: [
            { id: 'a', type: 'match', pts: 4, cat: 'FUN', q: 'Ordne jeder Position ihre Aufgabe zu.',
              rows: ['Pos. 4 – Sicherungsring', 'Pos. 5 – Radial-Wellendichtring', 'Pos. 6 – Lagerdeckel links', 'Pos. 7 – Passfeder'],
              options: ['Innenring des Lagers axial sichern', 'Schmierstoff halten, Schmutz abhalten', 'Außenring des Festlagers axial festklemmen', 'Drehmoment formschlüssig übertragen'], ans: [0, 1, 2, 3],
              e: 'Sicherungsring = axiale Sicherung auf der Welle. RWDR = Abdichtung. Linker Deckel mit Zentrierbund = Festlager. Passfeder = Drehmoment.' },
            { id: 'b', type: 'text', pts: 3, cat: 'FUN', q: 'Erkläre an der Zeichnung, woran man Festlager und Loslager erkennt.',
              crit: [{ t: 'Festlager links: Außenring zwischen Gehäuseschulter und Zentrierbund, Innenring zwischen Wellenabsatz und Sicherungsring.', p: 1 },
                     { t: 'Loslager rechts: Außenring hat axial Platz (Spalt zum Deckel und zur Gehäuseschulter).', p: 1 },
                     { t: 'Begründung: Das Loslager gleicht Längenänderungen der Welle aus.', p: 1 }],
              muster: 'Links ist das Festlager. Sein Außenring wird zwischen Gehäuseschulter und dem Zentrierbund des Deckels festgeklemmt. Der Innenring sitzt zwischen Wellenabsatz und Sicherungsring. Rechts ist das Loslager: Der Außenring hat auf beiden Seiten einen kleinen Spalt. So kann sich die Welle bei Wärme ausdehnen.' },
            { id: 'c', type: 'select', pts: 3, cat: 'FUN', q: 'Ein Kollege baut rechts versehentlich einen Deckel <b>mit</b> Zentrierbund ein (kein Spalt). Was kann passieren?',
              options: ['Die Lager werden bei Erwärmung axial verspannt, laufen heiß und fallen früh aus.', 'Die Welle kann sich nicht mehr drehen, weil der Deckel schleift.', 'Der Riemen springt ab.', 'Es passiert nichts, beide Deckel sind gleichwertig.'], ans: 0,
              e: 'Ohne Loslager kann die Welle die Wärmedehnung nicht ausgleichen. Die Lager bekommen eine zusätzliche Axialkraft.' }
          ] },
        { id: 'B2', title: 'Lagerschaden – Instandsetzung', intro: 'Das Festlager ist beschädigt und muss gewechselt werden. Der Hubtisch steht in der unteren Endlage.',
          parts: [
            { id: 'a', type: 'order', pts: 6, cat: 'INS', q: 'Bringe die Demontageschritte in die richtige Reihenfolge.',
              items: ['Anlage abschalten, gegen Wiedereinschalten sichern, Hydraulik drucklos machen', 'Riemen entspannen und Riemenscheibe abziehen', 'Schrauben (Pos. 8) lösen und Lagerdeckel abnehmen', 'Welle mit den Lagern aus dem Gehäuse ziehen', 'Sicherungsring (Pos. 4) mit der Sicherungsringzange entfernen', 'Lager mit dem Abzieher von der Welle abziehen'],
              e: 'Erst sichern, dann von außen nach innen: Riemenscheibe, Deckel, Welle ausbauen. Dann den Sicherungsring entfernen und das Lager abziehen.' },
            { id: 'b', type: 'text', pts: 4, cat: 'INS', q: 'Nenne vier mögliche Ursachen für den Lagerschaden.',
              crit: [{ t: 'Ursache 1, z. B. Schmierstoffmangel oder falscher Schmierstoff.', p: 1 }, { t: 'Ursache 2, z. B. Verschmutzung (defekte Dichtung).', p: 1 },
                     { t: 'Ursache 3, z. B. Montagefehler (über Wälzkörper eingepresst, falsche Passung).', p: 1 }, { t: 'Ursache 4, z. B. Überlastung (Riemen zu stark gespannt), Fluchtungsfehler, Lebensdauer erreicht.', p: 1 }],
              muster: 'Zu wenig oder alter Schmierstoff. Schmutz oder Wasser durch eine defekte Dichtung. Falsche Montage, z. B. mit dem Hammer über die Kugeln. Zu stramme oder zu lose Passung. Überlast durch zu stark gespannten Riemen. Wellen nicht fluchtend. Normale Ermüdung am Ende der Lebensdauer.' }
          ] },
        { id: 'B3', title: 'Funktion der Hydraulik', intro: 'Analysiere den Hydraulikplan des Hubzylinders.',
          parts: [
            { id: 'a', type: 'match', pts: 3, cat: 'HYD', q: 'Was macht der Zylinder in den Schaltzuständen von 1V1?',
              rows: ['Magnetspule Y1 hat Strom', 'Magnetspule Y2 hat Strom', 'Keine Spule hat Strom'],
              options: ['Zylinder fährt aus (Heben)', 'Zylinder fährt ein (Senken)', 'Zylinder steht, Pumpe fördert drucklos zum Tank'], ans: [0, 1, 2],
              e: 'Y1: P→A, Öl in den Kolbenraum. Y2: P→B, Öl in den Ringraum. Ohne Strom: Mittelstellung mit Umlauf.' },
            { id: 'b', type: 'text', pts: 4, cat: 'HYD', q: 'Beschreibe den Weg des Öls beim <b>Senken</b> (Y2 hat Strom).',
              crit: [{ t: 'Pumpe fördert über P → B in den Ringraum.', p: 1 }, { t: 'Der Druck in Leitung B öffnet 1V2 über die Steuerleitung X.', p: 1 },
                     { t: 'Öl aus dem Kolbenraum fließt durch die Drossel von 1V3 (Rückschlagventil sperrt) → langsames Senken.', p: 1 }, { t: 'Weiter über 1V2 und A → T durch den Filter 0Z1 in den Tank.', p: 1 }],
              muster: 'Y2 schaltet 1V1 um. Das Öl strömt von P nach B in den Ringraum. Der Druck in B wirkt über X auf 1V2 und öffnet es. Das Öl aus dem Kolbenraum fließt durch die Drossel von 1V3, weil das Rückschlagventil sperrt. Deshalb senkt sich der Tisch langsam. Danach fließt es über 1V2, von A nach T, durch den Filter 0Z1 in den Tank.' },
            { id: 'c', type: 'select', pts: 3, cat: 'INS', q: 'Der Hubtisch sinkt im Stillstand (keine Spule hat Strom) langsam ab. Was ist die wahrscheinlichste Ursache?',
              options: ['Das entsperrbare Rückschlagventil 1V2 dichtet nicht mehr, z. B. Schmutz am Ventilsitz.', 'Das Druckbegrenzungsventil ist zu hoch eingestellt.', 'Der Rücklauffilter ist verschmutzt.', 'Die Drossel von 1V3 ist zu weit geöffnet.'], ans: 0,
              e: '1V2 soll den Tisch halten. Dichtet es nicht, fließt Öl langsam aus dem Kolbenraum ab. Die Drossel wirkt nur auf die Geschwindigkeit beim Senken.' }
          ] },
        { id: 'B4', title: 'Berechnungen am Hubzylinder', intro: `Auf dem Hubtisch liegt eine Last von <b>m = ${fmtT(mLast)} kg</b> (Masse von Tisch und Werkstückträgern). Zylinder: D = 63 mm, Hub 400 mm. Pumpe: Q = 12 l/min. Rechne mit g = 9,81 m/s² und der π-Taste. Reibung und Wirkungsgrad bleiben unberücksichtigt.`,
          parts: [
            { id: 'a', type: 'num', pts: 5, cat: 'TM', q: 'Berechne die Kolbenfläche und den Druck, der zum Heben nötig ist. Runde auf eine Nachkommastelle.',
              fields: [{ label: 'Kolbenfläche A', unit: 'cm²', ans: A, tol: 0.15, show: fmt(A, 1) },
                       { label: 'erforderlicher Druck p<sub>e</sub>', unit: 'bar', ans: p, tol: p * 0.015, show: fmt(p, 1) }],
              e: `A = π · (6,3 cm)² / 4 ≈ ${fmt(A, 2)} cm². F = m · g = ${fmtT(mLast)} kg · 9,81 m/s² ≈ ${fmtT(mLast * 9.81)} N. p = F / A ≈ ${fmt(mLast * 9.81 / A, 1)} N/cm² = ${fmt(p, 1)} bar (1 bar = 10 N/cm²).` },
            { id: 'b', type: 'num', pts: 5, cat: 'TM', q: 'Berechne die Hubgeschwindigkeit und die Zeit für den ganzen Hub. Runde auf zwei Nachkommastellen.',
              fields: [{ label: 'Hubgeschwindigkeit v', unit: 'm/min', ans: v, tol: 0.03, show: fmt(v, 2) },
                       { label: 'Zeit für 400 mm Hub', unit: 's', ans: t, tol: 0.08, show: fmt(t, 2) }],
              e: `v = Q / A = 12 000 cm³/min / ${fmt(A, 2)} cm² ≈ ${fmt(v * 100, 1)} cm/min = ${fmt(v, 2)} m/min. t = s / v = 0,4 m / ${fmt(v, 2)} m/min ≈ ${fmt(0.4 / v, 3)} min ≈ ${fmt(t, 2)} s.` }
          ] },
        { id: 'B5', title: 'Steuerung der Hubstation', intro: 'Analysiere den Stromlaufplan.',
          parts: [
            { id: 'a', type: 'match', pts: 4, cat: 'ELT', q: 'Welche Kontaktart haben diese Bauteile im Stromlaufplan?',
              rows: ['S1 (Aus)', 'S2 (Ein)', 'B1 (Endschalter oben)', 'F2 (Motorschutz 95/96)'], options: ['Öffner', 'Schließer'], ans: [0, 1, 0, 0], keepOrder: true,
              e: 'Aus-Taster, Endschalter für Abschaltung und Motorschutzkontakt sind Öffner. Der Ein-Taster ist ein Schließer.' },
            { id: 'b', type: 'select', pts: 2, cat: 'ELT', q: 'Während der Tisch hebt, drückt jemand den Not-Halt S0. Was passiert?',
              options: ['Q1 fällt ab, Pumpe stoppt. Q1 33/34 öffnet, Y1 wird stromlos, 1V1 geht in Mittelstellung. Der Tisch bleibt stehen.', 'Nur die Meldeleuchte H1 geht aus, der Tisch hebt weiter.', 'Y2 bekommt Strom und der Tisch senkt sich sofort.', 'Q1 bleibt durch die Selbsthaltung angezogen.'], ans: 0,
              e: 'S0 unterbricht Strompfad 1. Ohne Q1 sind auch die Pfade 3 bis 5 stromlos. 1V2 hält den Tisch.' },
            { id: 'c', type: 'text', pts: 4, cat: 'ELT', q: 'Erkläre, wie die Pumpe mit S2 eingeschaltet wird und warum sie nach dem Loslassen weiterläuft. Wie wird sie wieder ausgeschaltet?',
              crit: [{ t: 'S2 schließt, die Spule Q1 bekommt Strom, das Schütz zieht an, der Motor läuft.', p: 1 }, { t: 'Der Hilfskontakt Q1 13/14 schließt und überbrückt S2.', p: 1 },
                     { t: 'Deshalb bleibt Q1 nach dem Loslassen angezogen (Selbsthaltung).', p: 1 }, { t: 'Ausschalten mit S1 (oder S0, oder F2 bei Überlast) unterbricht den Strompfad.', p: 1 }],
              muster: 'Beim Drücken von S2 bekommt die Schützspule Q1 Strom. Q1 schaltet den Motor ein. Gleichzeitig schließt der Hilfskontakt 13/14, der parallel zu S2 liegt. Lässt man S2 los, fließt der Strom über 13/14 weiter. Das ist die Selbsthaltung. Mit S1, mit dem Not-Halt S0 oder durch den Motorschutz F2 wird der Strompfad unterbrochen und Q1 fällt ab.' }
          ] },
        { id: 'B6', title: 'Fehlersuche', intro: 'Die Pumpe läuft, die Meldeleuchte H1 leuchtet. Beim Drücken von S3 hebt der Tisch aber nicht.',
          parts: [
            { id: 'a', type: 'match', pts: 6, cat: 'INS', q: 'Kommen diese Ursachen in Frage?',
              rows: ['Endschalter B1 ist betätigt oder defekt', 'Magnetspule Y1 ist durchgebrannt', 'Kontakt Q1 33/34 schaltet nicht', 'Motorschutz F2 hat ausgelöst', 'Not-Halt S0 ist gedrückt', 'Druckbegrenzungsventil 0V1 ist auf 5 bar verstellt'],
              options: ['möglich', 'nicht möglich'], ans: [0, 0, 0, 1, 1, 0], keepOrder: true,
              e: 'Läuft die Pumpe, sind F2 und S0 in Ordnung (sonst wäre Q1 abgefallen). Alle Fehler im Pfad 4 oder in der Hydraulik sind möglich.' },
            { id: 'b', type: 'text', pts: 4, cat: 'ELT', q: 'Du willst prüfen, ob an der Spule Y1 Spannung anliegt. Wie gehst du sicher vor?',
              crit: [{ t: 'Nur als Elektrofachkraft oder unter Aufsicht (bzw. nach Unterweisung) messen.', p: 1 }, { t: 'Geeignetes Messgerät (zweipoliger Spannungsprüfer/Multimeter), vorher an bekannter Quelle prüfen.', p: 1 },
                     { t: 'S3 drücken und an den Anschlüssen von Y1 messen: Spannung da → Spule/Ventil prüfen; keine Spannung → Pfad 4 rückwärts verfolgen.', p: 1 }, { t: 'Spule im spannungsfreien Zustand mit Widerstandsmessung auf Durchgang prüfen.', p: 1 }],
              muster: 'Messungen an spannungsführenden Teilen darf nur eine Elektrofachkraft machen, oder eine unterwiesene Person unter Aufsicht. Zuerst den Spannungsprüfer an einer bekannten Spannung testen. Dann S3 drücken und an Y1 messen. Ist Spannung da, liegt der Fehler an der Spule oder im Ventil. Fehlt die Spannung, misst man Kontakt für Kontakt rückwärts (B1, S3, Q1). Die Spule prüft man spannungsfrei mit dem Ohmmeter.' }
          ] },
        { id: 'B7', title: 'Werkstoffe der Lagereinheit', intro: 'Sieh in die Stückliste und die Einzelteilzeichnung der Welle.',
          parts: [
            { id: 'a', type: 'num', pts: 2, cat: 'WST', q: 'Gib die Gehalte für 42CrMo4 an.',
              fields: [{ label: 'Kohlenstoffgehalt', unit: '%', ans: 0.42, tol: 0.005, show: '0,42' }, { label: 'Chromgehalt', unit: '%', ans: 1, tol: 0.01, show: '1' }],
              e: '42 : 100 = 0,42 % C. Chrom: 4 : 4 = 1 %.' },
            { id: 'b', type: 'select', pts: 2, cat: 'WST', q: 'Was bedeutet der Zusatz <b>+QT</b>?',
              options: ['vergütet (Härten und Anlassen bei hoher Temperatur)', 'einsatzgehärtet', 'normalgeglüht', 'kaltgezogen'], ans: 0,
              e: 'QT = quenched and tempered = vergütet.' },
            { id: 'c', type: 'text', pts: 3, cat: 'WST', q: 'Warum wird die Antriebswelle vergütet? Nenne drei Gründe.',
              crit: [{ t: 'Hohe Festigkeit (Torsion und Biegung).', p: 1 }, { t: 'Gute Zähigkeit, bricht nicht bei Stößen.', p: 1 }, { t: 'Höhere Dauerfestigkeit / Verschleißfestigkeit an den Lagersitzen.', p: 1 }],
              muster: 'Die Welle wird auf Biegung und Torsion belastet, auch wechselnd. Durch Vergüten wird sie fest und trotzdem zäh. Sie hält Stöße aus und hat eine hohe Dauerfestigkeit. Die Lagersitze verschleißen weniger.' },
            { id: 'd', type: 'match', pts: 3, cat: 'TK', q: 'Ordne jedem Bauteil den Werkstoff aus der Stückliste zu.',
              rows: ['Antriebswelle (Pos. 1)', 'Lagergehäuse (Pos. 2)', 'Lagerdeckel (Pos. 6)'], options: ['42CrMo4+QT', 'EN-GJL-250', 'S235JR'], ans: [0, 1, 2],
              e: 'Siehe Stückliste.' }
          ] },
        { id: 'B8', title: 'Prüfen der neuen Welle', intro: 'Die neu gefertigte Welle (Pos. 1) wird geprüft. Nutze die Einzelteilzeichnung und dein Tabellenbuch (ISO-Toleranzen für Wellen).',
          parts: [
            { id: 'a', type: 'num', pts: 4, cat: 'QS', q: 'Bestimme die Grenzmaße für Ø25 k5 und Ø20 k6. Gib drei Nachkommastellen an.',
              fields: [{ label: 'Ø25 k5 Höchstmaß', unit: 'mm', ans: 25.011, tol: 0.0005, show: '25,011' }, { label: 'Ø25 k5 Mindestmaß', unit: 'mm', ans: 25.002, tol: 0.0005, show: '25,002' },
                       { label: 'Ø20 k6 Höchstmaß', unit: 'mm', ans: 20.015, tol: 0.0005, show: '20,015' }, { label: 'Ø20 k6 Mindestmaß', unit: 'mm', ans: 20.002, tol: 0.0005, show: '20,002' }],
              e: 'k5 für über 18 bis 30 mm: +11 / +2 µm. k6 für über 18 bis 30 mm: +15 / +2 µm.' },
            { id: 'b', type: 'match', pts: 3, cat: 'QS', q: 'Prüfprotokoll: Sind die Istmaße in Ordnung?',
              rows: [`Lagersitz links Ø25 k5 – Istmaß ${ist[0].val} mm`, `Lagersitz rechts Ø25 k5 – Istmaß ${ist[1].val} mm`, `Wellenende Ø20 k6 – Istmaß ${ist[2].val} mm`],
              options: ['i. O.', 'n. i. O.'], ans: ist.map(x => x.ok ? 0 : 1), keepOrder: true,
              e: 'Grenzmaße: Ø25 k5: 25,002 … 25,011 mm. Ø20 k6: 20,002 … 20,015 mm.' },
            { id: 'c', type: 'text', pts: 3, cat: 'QS', q: 'Beschreibe, wie du die Rundlauftoleranz 0,02 mm (Bezug A-B) prüfst.',
              crit: [{ t: 'Welle auf den Bezugsflächen A und B lagern (z. B. in zwei Prismen oder zwischen Spitzen, wenn diese zu A-B passen).', p: 1 },
                     { t: 'Messuhr senkrecht auf die geprüfte Fläche setzen, Welle eine volle Umdrehung drehen.', p: 1 }, { t: 'Größter minus kleinster Anzeigewert ≤ 0,02 mm → i. O.', p: 1 }],
              muster: 'Die Welle wird auf den beiden Lagersitzen A und B in Prismen gelegt. Die Messuhr steht senkrecht auf dem Wellenende Ø20. Dann dreht man die Welle eine ganze Umdrehung. Die Differenz zwischen größtem und kleinstem Wert darf höchstens 0,02 mm sein.' }
          ] }
        ];
    }
};
