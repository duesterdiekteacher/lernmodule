/* ============================================================
   AP Teil 2 – Industriemechaniker – Fertigungstechnik
   Projekt: Hubstation mit Rollenbahn-Getriebe
   ============================================================ */
function introAfaFt(name, min) {
    return `<h2>So läuft die Prüfung</h2>
    <ul class="steps">
      <li>Prüfungsbereich <b>${name}</b>. Du hast <b>${min} Minuten</b>. Die Uhr läuft oben rückwärts.</li>
      <li><b>Teil A:</b> 28 Aufgaben zum Ankreuzen. Pro Aufgabe ist genau eine Antwort richtig.</li>
      <li>In Teil A musst du <b>3 Aufgaben abwählen</b>. Die 8 Aufgaben mit 🔒 (Mathematik und Technische Kommunikation) kannst du nicht abwählen.</li>
      <li>Wählst du nicht ab, werden die <b>letzten 3 abwählbaren Aufgaben</b> nicht gewertet.</li>
      <li><b>Teil B:</b> 8 Aufgaben mit je 10 Punkten. Keine Abwahl. Eine Aufgabe ist eine Skizze auf Papier.</li>
      <li>Die Aufgaben beziehen sich auf den Zeichnungssatz hinter dem Knopf <b>📐 Zeichnung</b>. Über jeder Aufgabe steht, welches Blatt du brauchst.</li>
    </ul>
    <div class="info warn"><b>Hilfsmittel:</b> Tabellenbuch Metall, Taschenrechner, Papier, Bleistift und Lineal für Nebenrechnungen und Skizzen.</div>
    <table class="tbl"><tr><th>Teil</th><th>Aufgaben</th><th>Punkte</th><th>Anteil</th></tr>
    <tr><td>A – gebunden</td><td>28, davon 3 abwählen</td><td>25 × 1 Punkt</td><td>50 %</td></tr>
    <tr><td>B – ungebunden</td><td>8, keine Abwahl</td><td>8 × 10 Punkte</td><td>50 %</td></tr></table>`;
}
const EXAM = {
    id: 'ft-im', key: 'ap2-ft-im-2', summary: true,
    title: 'Fertigungstechnik', subtitle: 'Abschlussprüfung Teil 2 · Industriemechaniker/-in · Projekt Hubstation mit Rollenbahn-Getriebe',
    logo: '⚙️', back: './', backLabel: '← Zurück zur Übersicht Teil 2',
    duration: 105, aAbw: 3, aWeight: 0.5, bAbw: 0, bWeight: 0.5,
    intro: introAfaFt('Fertigungstechnik', 105),
    bIntro: '<p>Arbeite mit den Unterlagen (📐 Zeichnung) und deinem Tabellenbuch. Gib Zahlen mit Komma oder Punkt ein.</p>',
    docs: IM_DOCS,
    cats: { ZER: 'Drehen, Fräsen, Bohren', CNC: 'CNC-Technik', SCH: 'Schleifen', WST: 'Werkstoffe und Wärmebehandlung', MON: 'Montage und Instandhaltung', QS: 'Prüftechnik und Qualität', SIC: 'Arbeits- und Umweltschutz', TM: 'Technische Mathematik', TK: 'Technische Kommunikation' },
    aDef: [
 { cat: 'TK', lock: true, ref: 'Blatt 3', q: 'Auf der Wellenzeichnung steht <b>Freistich DIN 509 – F 0,6 × 0,3</b>. Was bedeutet das?',
   o: ['Freistich der Form F mit Radius 0,6 mm und Einstichtiefe 0,3 mm', 'Fase mit 0,6 mm Länge und 0,3 mm Tiefe', 'Freistich mit 0,6 mm Breite und 0,3 mm Radius, nur für Gewinde', 'Einstich für einen Sicherungsring', 'Zentrierbohrung mit 0,6 mm Durchmesser'],
   e: 'Freistiche nach DIN 509 werden mit Form, Radius r und Tiefe t angegeben. Form F: Plan- und Zylinderfläche werden bearbeitet.' },
 { cat: 'ZER', ref: 'Blatt 3', q: 'Die Abtriebswelle hat beidseitig Zentrierbohrungen. Wie spannst du sie beim Drehen der Absätze, damit alles genau rundläuft?',
   o: ['Zwischen Spitzen mit Mitnehmer', 'Nur im Dreibackenfutter, ohne Gegenspitze', 'Im Maschinenschraubstock', 'Mit Magnetspannplatte', 'In einer Spannzange auf dem Ø42'],
   e: 'Zwischen Spitzen beziehen sich alle Durchmesser auf dieselbe Achse. Das ist wichtig für den Rundlauf zu A-B.' },
 { cat: 'ZER', q: 'Welcher Schneidstoff eignet sich am besten zum Schruppen der vergüteten Welle aus 42CrMo4?',
   o: ['Beschichtetes Hartmetall der Anwendungsgruppe P', 'Unlegierter Werkzeugstahl', 'Polykristalliner Diamant (PKD)', 'HSS ohne Beschichtung bei hoher Schnittgeschwindigkeit', 'Hartmetall der Gruppe N für Aluminium'],
   e: 'P steht für Stahl. PKD ist für Nichteisenmetalle, nicht für Stahl.' },
 { cat: 'TM', lock: true, ref: 'Blatt 3', gen: true },
 { cat: 'TK', lock: true, ref: 'Blatt 3', q: 'Wie tief ist die Passfedernut für das Stirnrad in der Welle (Wellennuttiefe t₁)? Nutze den Schnitt C–C.',
   o: ['5 mm', '31 mm', '10 mm', '3,3 mm', '8 mm'],
   e: 'Gemessen ist der Rest von 31 mm. t₁ = 36 mm − 31 mm = 5 mm.' },
 { cat: 'WST', ref: 'Blatt 2', q: 'Die Ritzelwelle aus 16MnCr5 wird einsatzgehärtet. In welcher Reihenfolge läuft das ab?',
   o: ['Aufkohlen – Härten (Abschrecken) – Anlassen bei niedriger Temperatur', 'Härten – Aufkohlen – Anlassen bei 600 °C', 'Normalglühen – Abschrecken – Aufkohlen', 'Anlassen – Aufkohlen – Härten', 'Nitrieren – Abschrecken – Spannungsarmglühen'],
   e: 'Erst wird die Randschicht mit Kohlenstoff angereichert, dann gehärtet und bei etwa 150–200 °C angelassen.' },
 { cat: 'ZER', q: 'Wie erreichst du beim Schlichtdrehen eine glattere Oberfläche?',
   o: ['Kleineren Vorschub und größeren Eckenradius wählen', 'Größeren Vorschub und kleineren Eckenradius wählen', 'Nur die Schnitttiefe vergrößern', 'Die Schnittgeschwindigkeit stark senken', 'Ohne Kühlschmierstoff arbeiten'],
   e: 'Die theoretische Rautiefe ist etwa R<sub>th</sub> = f² / (8 · r).' },
 { cat: 'CNC', q: 'Welche Aussage zum <b>Werkstücknullpunkt</b> an einer CNC-Drehmaschine ist richtig?',
   o: ['Er wird vom Programmierer festgelegt, meist auf der Planfläche in der Drehachse.', 'Er wird vom Maschinenhersteller festgelegt und ist unveränderlich.', 'Er liegt immer im Referenzpunkt.', 'Er muss nach jedem Werkzeugwechsel neu angefahren werden.', 'Er ist immer die Spitze des Drehmeißels.'],
   e: 'Maschinennullpunkt und Referenzpunkt legt der Hersteller fest. Den Werkstücknullpunkt wählt man so, dass sich die Zeichnungsmaße gut übernehmen lassen.' },
 { cat: 'CNC', q: 'Was bewirkt der Befehl <b>G02</b>?',
   o: ['Kreisinterpolation im Uhrzeigersinn', 'Kreisinterpolation gegen den Uhrzeigersinn', 'Eilgang', 'Absolutmaßangabe', 'Werkzeugwechsel'],
   e: 'G02 = Kreis im Uhrzeigersinn, G03 = gegen den Uhrzeigersinn.' },
 { cat: 'CNC', q: 'Was bewirkt <b>G42</b>?',
   o: ['Schneidenradiuskorrektur rechts von der Kontur (in Bearbeitungsrichtung gesehen)', 'Schneidenradiuskorrektur links von der Kontur', 'Aufheben der Schneidenradiuskorrektur', 'Kettenmaßangabe', 'Konstante Schnittgeschwindigkeit'],
   e: 'G41 = links, G42 = rechts der Kontur, G40 hebt die Korrektur auf.' },
 { cat: 'CNC', q: 'Welche Werkzeugdaten werden für einen Drehmeißel in den Korrekturspeicher eingetragen?',
   o: ['Längen in X und Z, Schneidenradius und Schneidenlage', 'Nur die Schnittgeschwindigkeit', 'Werkzeugradius und Zähnezahl', 'Nur die Werkzeugnummer', 'Drehzahl und Vorschub'],
   e: 'Mit Längen, Radius und Lage der Schneide kann die Steuerung die Bahn der Schneidenspitze richtig berechnen.' },
 { cat: 'TM', lock: true, ref: 'Blatt 3', gen: true },
 { cat: 'SCH', ref: 'Blatt 3', q: 'Die Laufbahn des Wellendichtrings soll <b>drallfrei</b> geschliffen werden. Wie geht das?',
   o: ['Durch Einstechschleifen ohne Längsvorschub', 'Durch Längsschleifen mit großem Vorschub', 'Durch Feindrehen mit Rechtsdrall', 'Durch Rändeln', 'Durch Gewindeschleifen'],
   e: 'Ein Drall wirkt wie ein feines Gewinde und kann Öl nach außen fördern. Beim Einstechschleifen entsteht kein Drall.' },
 { cat: 'TK', lock: true, ref: 'Blatt 3', q: 'Was bedeutet die Angabe <b>ISO 6411 – A 2,5/5,3</b> auf der Wellenzeichnung?',
   o: ['Zentrierbohrung Form A mit 2,5 mm Zentrierdurchmesser und 5,3 mm Senkdurchmesser', 'Gewinde M2,5 mit 5,3 mm Tiefe', 'Fase 2,5 × 45° auf 5,3 mm Länge', 'Freistich 2,5 mm breit, 5,3 mm tief', 'Passfedernut 2,5 mm breit, 5,3 mm lang'],
   e: 'ISO 6411 ist die Norm für die vereinfachte Angabe von Zentrierbohrungen.' },
 { cat: 'SCH', q: 'Eine Schleifscheibe ist mit <b>A 60 K 5 V</b> bezeichnet. Was bedeutet die <b>60</b>?',
   o: ['Die Körnung', 'Den Härtegrad', 'Die Bindung', 'Die zulässige Umfangsgeschwindigkeit in m/s', 'Den Außendurchmesser in mm'],
   e: 'A = Normalkorund, 60 = Körnung, K = Härte, 5 = Gefüge, V = keramische Bindung.' },
 { cat: 'SIC', q: 'Eine neue Schleifscheibe wird aufgespannt. Was ist vorgeschrieben?',
   o: ['Klangprobe vor dem Aufspannen und Probelauf mit Arbeitshöchstgeschwindigkeit, Gefahrbereich frei', 'Die Scheibe mit dem Hammer festklopfen', 'Den Probelauf mit offenem Schutz durchführen', 'Die Schutzhaube abnehmen, damit die Scheibe besser kühlt', 'Die zulässige Umfangsgeschwindigkeit um 20 % überschreiten'],
   e: 'Eine gerissene Scheibe klingt dumpf. Der Probelauf zeigt, ob die Scheibe hält, bevor jemand davorsteht.' },
 { cat: 'WST', q: 'Wie läuft das <b>Vergüten</b> ab?',
   o: ['Härten (Erwärmen und Abschrecken) und danach Anlassen bei hoher Temperatur, etwa 540 bis 680 °C', 'Nur langsames Abkühlen im Ofen', 'Härten und Anlassen bei etwa 180 °C', 'Aufkohlen und Härten der Randschicht', 'Erwärmen auf 300 °C und Abkühlen an Luft'],
   e: 'Vergüten = Härten + Anlassen bei hoher Temperatur. Das ergibt hohe Festigkeit bei guter Zähigkeit.' },
 { cat: 'MON', ref: 'Situation', q: 'Was bedeutet die Ölbezeichnung <b>CLP 220</b>?',
   o: ['Schmieröl mit Zusätzen gegen Korrosion und Alterung (L) und gegen Verschleiß (P), Viskositätsklasse ISO VG 220', 'Hydrauliköl mit 220 bar Druckfestigkeit', 'Kühlschmierstoff mit 2,2 % Konzentration', 'Schmierfett der Konsistenzklasse 220', 'Motoröl für 220 °C'],
   e: 'Die Zahl ist die Viskositätsklasse (mittlere kinematische Viskosität bei 40 °C in mm²/s).' },
 { cat: 'MON', q: 'Wie ziehst du die Schrauben der Lagerdeckel an?',
   o: ['Über Kreuz in mehreren Stufen mit dem Drehmomentschlüssel auf das vorgeschriebene Anzugsmoment', 'Der Reihe nach im Kreis, jede Schraube gleich voll', 'So fest wie möglich mit Verlängerungsrohr', 'Nur handfest', 'Mit dem Schlagschrauber ohne Drehmomentbegrenzung'],
   e: 'Über Kreuz und in Stufen anziehen verhindert, dass der Deckel schief sitzt.' },
 { cat: 'TM', lock: true, ref: 'Blatt 3', q: 'Wie groß ist die Masse des Rohteils (Rundstahl Ø48 × 193)? ρ = 7,85 kg/dm³.',
   o: ['2,74 kg', '10,97 kg', '0,27 kg', '27,4 kg', '3,49 kg'],
   e: 'V = π/4 · (0,48 dm)² · 1,93 dm ≈ 0,349 dm³. m = 0,349 dm³ · 7,85 kg/dm³ ≈ 2,74 kg.' },
 { cat: 'MON', ref: 'Situation', q: 'Der Keilriemen zur Keilriemenscheibe (Pos. 9) wird gespannt. Wie prüfst du die richtige Spannung?',
   o: ['Mit Prüfkraft und Eindrücktiefe oder mit einem Frequenz-Messgerät nach Herstellerangabe', 'So stark spannen, dass der Riemen nicht mehr nachgibt', 'Nach Gefühl', 'Am Motorgeräusch', 'Mit dem Messschieber an der Riemendicke'],
   e: 'Zu stramm überlastet die Lager, zu locker rutscht der Riemen.' },
 { cat: 'TK', lock: true, ref: 'Blatt 3', q: 'Für die Lagersitze ist <b>Ra 0,8</b> angegeben. Was bedeutet das?',
   o: ['Der arithmetische Mittenrauwert darf höchstens 0,8 µm betragen.', 'Die Rautiefe muss mindestens 0,8 mm sein.', 'Die Rundheit darf 0,8 µm abweichen.', 'Der Durchmesser darf um 0,8 µm abweichen.', 'Die Oberfläche muss 0,8 mm tief gehärtet sein.'],
   e: 'Ra ist der Mittelwert der Abweichungen des Profils von der Mittellinie. Die Angabe ist ein Höchstwert in µm.' },
 { cat: 'MON', q: 'Wie baust du einen Radial-Wellendichtring richtig ein?',
   o: ['Dichtlippe zum Ölraum, Lippe einfetten, über Kanten und Nuten mit einer Montagehülse schieben', 'Dichtlippe nach außen, trocken montieren', 'Mit dem Hammer direkt auf die Dichtlippe schlagen', 'Die Feder der Dichtlippe vorher entfernen', 'Mit Kleber auf der Welle festkleben'],
   e: 'Die Lippe zeigt zum Medium, das abgedichtet wird. Die Hülse schützt die Lippe vor scharfen Kanten.' },
 { cat: 'QS', ref: 'Blatt 3', q: 'Mit welchem Messgerät prüfst du den Lagersitz Ø30 k6 (Toleranz 13 µm) in der Werkstatt am besten?',
   o: ['Feinzeiger-Messschraube mit 0,001 mm Ablesung', 'Messschieber mit 0,05 mm Ablesung', 'Bügelmessschraube mit 0,01 mm Ablesung', 'Stahlmaßstab', 'Radiuslehre'],
   e: 'Faustregel: Die Ablesung soll höchstens ein Zehntel der Toleranz sein.' },
 { cat: 'QS', q: 'Beim Schleifen der Lagersitze ergibt sich ein Prozessfähigkeitsindex <b>c<sub>pk</sub> = 0,8</b>. Was bedeutet das?',
   o: ['Der Prozess ist nicht fähig. Es entsteht Ausschuss, oder die Lage ist nicht mittig.', 'Der Prozess ist sehr gut fähig.', 'Es sind 0,8 % Ausschuss erlaubt.', 'Die Messmittel sind ungenau.', 'Der Prozess ist fähig, wenn c<sub>pk</sub> unter 1 liegt.'],
   e: 'Üblich wird c<sub>pk</sub> ≥ 1,33 gefordert.' },
 { cat: 'ZER', ref: 'Blatt 3', q: 'Die Passfedernuten Form A (beide Enden rund) werden gefertigt. Womit?',
   o: ['Mit einem Langloch- oder Schaftfräser auf der Fräsmaschine', 'Mit einem Scheibenfräser', 'Mit einer Säge', 'Durch Räumen', 'Mit einem Gewindebohrer'],
   e: 'Ein Schaftfräser erzeugt die runden Enden der Form A.' },
 { cat: 'TM', lock: true, gen: true },
 { cat: 'SIC', img: true, q: 'An der Schleifmaschine muss Gehörschutz getragen werden. Darauf weist ein <b>Gebotszeichen</b> hin. Welche Abbildung zeigt Form und Farbe eines Gebotszeichens?',
   o: [sicherheitszeichen('gebot'), sicherheitszeichen('verbot'), sicherheitszeichen('warn'), sicherheitszeichen('rettung'), sicherheitszeichen('brand')],
   e: 'Gebotszeichen sind blaue Kreise mit weißem Symbol. Verbot: roter Ring mit Balken. Warnung: gelbes Dreieck. Rettung: grün. Brandschutz: rot.' }
    ],
    genA(i, r) {
        if (i === 4) {
            const vc = pick(r, [180, 200, 220, 240, 250]);
            const n = vc * 1000 / (Math.PI * 48);
            const o = uniqOpts([n, vc * 1000 / 48, vc * 1000 / (Math.PI * 24), vc * 100 / (Math.PI * 48), vc * 1000 / (Math.PI * 42)].map(x => fmtT(x) + ' 1/min'));
            return { q: `Die Welle wird aus dem Rohteil Ø48 mm geschruppt. Die Schnittgeschwindigkeit ist <b>v<sub>c</sub> = ${vc} m/min</b>. Welche Drehzahl stellst du ein?`, o,
                     e: `n = v<sub>c</sub> · 1000 / (π · d) = ${vc} · 1000 / (π · 48) ≈ ${fmtT(n)} 1/min.` };
        }
        if (i === 12) {
            const st = pick(r, [6, 8, 10, 12]), n = pick(r, [800, 1000, 1250]), f = pick(r, [0.2, 0.25, 0.3]);
            const th = st * 70 / (n * f);
            const o = uniqOpts([th, 70 / (n * f), st * 66 / (n * f), th * 60, st * 70 * n * f / 100000].map(x => fmt(x, 2) + ' min'));
            return { q: `Es werden <b>${st} Abtriebswellen</b> gefertigt. Der Absatz Ø30 (66 mm lang) wird in einem Schnitt längsgedreht. Weg mit An- und Überlauf: L = 70 mm. Drehzahl <b>n = ${n} 1/min</b>, Vorschub <b>f = ${fmt(f, 2)} mm</b>. Wie groß ist die Hauptnutzungszeit für alle Wellen?`, o,
                     e: `t<sub>h</sub> = L · i / (n · f) = 70 / (${n} · ${fmt(f, 2)}) min ≈ ${fmt(70 / (n * f), 3)} min je Welle. Für ${st} Wellen: ≈ ${fmt(th, 2)} min.` };
        }
        if (i === 27) {
            const [a, b] = pick(r, [[4.5, 3.6], [5, 4], [6, 4.5], [8, 6], [3.2, 2.4]]);
            const pct = (a - b) / a * 100;
            const o = uniqOpts([pct, (a - b) / b * 100, b / a * 100, (a - b) * 10, 100 - (a - b) / b * 100].map(x => fmt(x, 1) + ' %'));
            return { q: `Mit einem neuen Wendeschneidplatten-Typ sinkt die Bearbeitungszeit einer Welle von <b>${fmt(a, 1)} min</b> auf <b>${fmt(b, 1)} min</b>. Wie groß ist die Zeitersparnis in Prozent?`, o,
                     e: `Ersparnis = (${fmt(a, 1)} − ${fmt(b, 1)}) / ${fmt(a, 1)} · 100 % ≈ ${fmt(pct, 1)} %. Der Grundwert ist die alte Zeit.` };
        }
    },
    buildB(rngFor) {
        const r2 = rngFor('B2'), r8 = rngFor('B8');
        const vc = pick(r2, [180, 200, 220, 250]), f = pick(r2, [0.1, 0.12, 0.15]), fs = pick(r2, [0.08, 0.1, 0.12]);
        const n = vc * 1000 / (Math.PI * 30.3), th = 19 / (n * f) * 60, rth = fs * fs / (8 * 0.8) * 1000;
        const ist = [];
        const mk = (ok, okV, badV) => ist.push({ ok, val: ok ? pick(r8, okV) : pick(r8, badV) });
        mk(r8() < 0.5, ['30,004', '30,011', '30,014'], ['30,017', '30,001', '29,998']);
        mk(r8() < 0.5, ['36,020', '36,029', '36,018'], ['36,035', '36,015', '36,012']);
        mk(r8() < 0.5, ['25,005', '25,012', '25,003'], ['25,016', '25,001', '24,999']);
        return [
        { id: 'B1', title: 'Arbeitsplan für die Abtriebswelle', ref: 'Blatt 3', intro: 'Die Abtriebswelle (Pos. 3) wird aus vergütetem Rundstahl 42CrMo4+QT gefertigt.',
          parts: [
            { id: 'a', type: 'order', pts: 6, cat: 'ZER', q: 'Bringe die Arbeitsschritte in die richtige Reihenfolge.',
              items: ['Rohteil Ø48 × 193 sägen', 'Beidseitig plandrehen auf 188 mm und zentrieren', 'Zwischen Spitzen schruppen, Aufmaß stehen lassen', 'Schlichten mit Freistichen und Fasen', 'Passfedernuten fräsen', 'Lagersitze und Dichtringlaufbahn rundschleifen'],
              e: 'Erst Rohteil und Zentrierbohrungen, dann Drehen, dann Fräsen. Geschliffen wird zum Schluss.' },
            { id: 'b', type: 'text', pts: 4, cat: 'ZER', q: 'Begründe: Warum wird zwischen Spitzen gedreht und geschliffen? Warum wird zuletzt geschliffen?',
              crit: [{ t: 'Zwischen Spitzen: alle Durchmesser auf derselben Achse → Rundlauf A-B.', p: 1 }, { t: 'Umspannen zwischen Drehen und Schleifen ohne Genauigkeitsverlust.', p: 1 },
                     { t: 'Schleifen zuletzt: erst dann Endmaß, enge Toleranz (k6, n6) und feine Oberfläche.', p: 1 }, { t: 'Spätere Arbeitsgänge (Fräsen, Spannen) würden die fertigen Flächen sonst beschädigen.', p: 1 }],
              muster: 'Die Zentrierbohrungen bilden eine feste Achse. Beim Drehen und Schleifen beziehen sich alle Durchmesser darauf. So stimmt der Rundlauf, auch nach dem Umspannen. Geschliffen wird zum Schluss, weil dann die engen Toleranzen und feinen Oberflächen entstehen, die nicht mehr beschädigt werden sollen.' }
          ] },
        { id: 'B2', title: 'Schnittdaten beim Drehen', ref: 'Blatt 3', intro: `Der linke Lagersitz wird vor dem Schleifen auf <b>Ø30,3 mm</b> geschlichtet. Schnittgeschwindigkeit <b>v<sub>c</sub> = ${vc} m/min</b>, Vorschub <b>f = ${fmt(f, 2)} mm</b>, Weg mit Anlauf <b>L = 19 mm</b>, ein Schnitt.`,
          parts: [
            { id: 'a', type: 'num', pts: 6, cat: 'TM', q: 'Berechne Drehzahl (ganze Zahl) und Hauptnutzungszeit (eine Nachkommastelle).',
              fields: [{ label: 'Drehzahl n', unit: '1/min', ans: n, tol: n * 0.015, show: String(Math.round(n)) }, { label: 'Hauptnutzungszeit t<sub>h</sub>', unit: 's', ans: th, tol: th * 0.03, show: fmt(th, 1) }],
              e: `n = ${vc} · 1000 / (π · 30,3) ≈ ${fmtT(n)} 1/min. t<sub>h</sub> = 19 / (${fmtT(n)} · ${fmt(f, 2)}) min ≈ ${fmt(th, 1)} s.` },
            { id: 'b', type: 'num', pts: 2, cat: 'TM', q: `Berechne die theoretische Rautiefe R<sub>th</sub> = f² / (8 · r) für <b>f = ${fmt(fs, 2)} mm</b> und <b>r = 0,8 mm</b> in µm (zwei Nachkommastellen).`,
              fields: [{ label: 'R<sub>th</sub>', unit: 'µm', ans: rth, tol: 0.02, show: fmt(rth, 2) }],
              e: `R<sub>th</sub> = ${fmt(fs, 2)}² / (8 · 0,8) mm ≈ ${fmt(rth, 2)} µm.` },
            { id: 'c', type: 'select', pts: 2, cat: 'ZER', q: 'Welche Wendeschneidplatte wählst du zum Schlichten bis an den Wellenabsatz?',
              options: ['Rhombische Platte mit spitzem Eckenwinkel (z. B. 35°) und Spanformer für Schlichten', 'Runde Platte für Schruppen', 'Quadratische Platte mit großem Radius 2,4 mm', 'Abstechplatte'], ans: 0,
              e: 'Eine schlanke Platte kommt bis an den Absatz und eignet sich für kleine Schnitttiefen.' }
          ] },
        { id: 'B3', title: 'CNC-Programm für die Außenkontur', ref: 'Blatt 3', intro: 'Die rechte Wellenseite wird auf einer CNC-Drehmaschine geschlichtet. Werkstücknullpunkt: Mitte der rechten Planfläche. X wird als <b>Durchmesser</b> programmiert, G90. Fase am Ende: 1 × 45°. Freistiche bleiben unberücksichtigt.',
          parts: [
            { id: 'a', type: 'num', pts: 5, cat: 'CNC', q: 'Ergänze die Koordinaten der Kontur von rechts nach links.',
              fields: [{ label: 'Fasenanfang: X', unit: '', ans: 23, tol: 0.001, show: '23' }, { label: 'Fasenende: Z', unit: '', ans: -1, tol: 0.001, show: '−1' },
                       { label: 'Ende Ø25 (Absatz): Z', unit: '', ans: -40, tol: 0.001, show: '−40' }, { label: 'Absatz: X', unit: '', ans: 30, tol: 0.001, show: '30' },
                       { label: 'Ende Ø30 (Absatz zum Ø36): Z', unit: '', ans: -106, tol: 0.001, show: '−106' }],
              e: 'Fase am Ø25: X23 Z0 → X25 Z−1. Ø25 ist 40 mm lang → Z−40. Plan auf X30. Ø30 ist 66 mm lang → Z−106.' },
            { id: 'b', type: 'select', pts: 2, cat: 'CNC', q: 'Mit welchem Befehl fährst du die Kontur im Vorschub als Gerade ab?',
              options: ['G01', 'G00', 'G02', 'G96'], ans: 0, e: 'G01 = Gerade im Vorschub.' },
            { id: 'c', type: 'select', pts: 3, cat: 'CNC', q: 'Warum muss beim Drehen der Fase die Schneidenradiuskorrektur eingeschaltet sein?',
              options: ['Ohne Korrektur rechnet die Steuerung mit dem theoretischen Schneidenpunkt. An Fasen und Radien entstehen Maßfehler.', 'Ohne Korrektur dreht die Spindel falsch herum.', 'Die Korrektur verlängert die Standzeit.', 'Die Korrektur ist nur beim Gewindedrehen nötig.'], ans: 0,
              e: 'Bei schrägen und runden Konturen läge die echte Schneide sonst neben der programmierten Kontur.' }
          ] },
        { id: 'B4', title: 'Normteile aus dem Tabellenbuch', ref: 'Blatt 1, 2', intro: 'Für die Fertigung werden Maße von Normteilen gebraucht. Nutze die Tabellen zu Sicherungsringen (DIN 471) und Passfedern (DIN 6885) in deinem Tabellenbuch.',
          parts: [
            { id: 'a', type: 'num', pts: 4, cat: 'TK', q: 'Welche Maße bekommt der Einstich für den Sicherungsring 25 × 1,2 (Pos. 24) auf der Ritzelwelle?',
              fields: [{ label: 'Nutdurchmesser d₂', unit: 'mm', ans: 23.9, tol: 0.001, show: '23,9' }, { label: 'Nutbreite m', unit: 'mm', ans: 1.3, tol: 0.001, show: '1,3' }],
              e: 'DIN 471 für d₁ = 25 mm: d₂ = 23,9 mm, m = 1,3 mm.' },
            { id: 'b', type: 'num', pts: 4, cat: 'TK', q: 'Welche Maße hat die Passfedernut für den Wellendurchmesser 36 mm (Stirnradsitz)?',
              fields: [{ label: 'Breite b', unit: 'mm', ans: 10, tol: 0.001, show: '10' }, { label: 'Wellennuttiefe t₁', unit: 'mm', ans: 5, tol: 0.001, show: '5' }],
              e: 'DIN 6885 für Wellen über 30 bis 38 mm: b × h = 10 × 8, t₁ = 5,0 mm. Das passt zu Schnitt C–C (36 − 5 = 31).' },
            { id: 'c', type: 'select', pts: 2, cat: 'TK', q: 'Was bedeutet „Form A“ bei der Passfeder?',
              options: ['rundstirnig (beide Enden rund)', 'geradstirnig (beide Enden eckig)', 'mit Halteschraube', 'mit Abdrückgewinde'], ans: 0,
              e: 'Form A ist rundstirnig. Die Nut wird deshalb mit einem Schaftfräser gefertigt.' }
          ] },
        { id: 'B5', title: 'Ölwechsel am Getriebe', ref: 'Situation, Blatt 1', intro: 'Bei der Instandsetzung wird das Getriebeöl CLP 220 gewechselt.',
          parts: [
            { id: 'a', type: 'match', pts: 4, cat: 'MON', q: 'Was bedeuten die Teile der Bezeichnung CLP 220?',
              rows: ['C', 'L', 'P', '220'], options: ['Schmieröl (Umlaufschmieröl) nach DIN 51517', 'Wirkstoffe gegen Korrosion und Alterung', 'Wirkstoffe gegen Verschleiß (Hochdruckzusätze)', 'Viskositätsklasse ISO VG 220'], ans: [0, 1, 2, 3],
              e: 'CLP-Öle werden für hoch belastete Getriebe verwendet.' },
            { id: 'b', type: 'order', pts: 3, cat: 'MON', q: 'Bringe die Schritte des Ölwechsels in die richtige Reihenfolge.',
              items: ['Getriebe warmlaufen lassen, dann abschalten und sichern', 'Auffangwanne unterstellen, Verschlussschraube (Pos. 20) öffnen, Öl ablassen', 'Neuen Dichtring (Pos. 21) einlegen, Verschlussschraube festziehen', 'Neues Öl bis zum Ölstand einfüllen, Dichtheit prüfen'],
              e: 'Warmes Öl fließt besser ab und nimmt den Schmutz mit.' },
            { id: 'c', type: 'text', pts: 3, cat: 'SIC', q: 'Nenne drei Regeln für den Umgang mit dem Altöl.',
              crit: [{ t: 'Altöl in gekennzeichneten, dichten Behältern sammeln (Auffangwanne, Ölbinder bereithalten).', p: 1 }, { t: 'Nicht mit anderen Stoffen (z. B. Wasser, Lösungsmitteln, Kühlschmierstoff) mischen.', p: 1 }, { t: 'Als gefährlichen Abfall über einen zugelassenen Entsorger abgeben, nie in Kanal oder Boden.', p: 1 }],
              muster: 'Altöl wird in dichten, beschrifteten Behältern gesammelt. Es darf nicht mit Wasser, Lösungsmitteln oder anderen Ölen vermischt werden. Es ist gefährlicher Abfall und geht an einen zugelassenen Entsorger. Verschüttetes Öl wird mit Ölbinder aufgenommen.' }
          ] },
        { id: 'B6', title: 'Einsatzhärten der Ritzelwelle', ref: 'Blatt 2', intro: 'Die Ritzelwelle (Pos. 2) aus 16MnCr5 wird einsatzgehärtet.',
          parts: [
            { id: 'a', type: 'order', pts: 4, cat: 'WST', q: 'Bringe die Schritte in die richtige Reihenfolge.',
              items: ['Aufkohlen bei etwa 880–950 °C', 'Härten: von Härtetemperatur abschrecken', 'Anlassen bei etwa 150–200 °C', 'Lagersitze und Zahnflanken fertig schleifen'],
              e: 'Aufkohlen, Härten, Anlassen. Danach wird der Verzug durch Schleifen beseitigt.' },
            { id: 'b', type: 'select', pts: 2, cat: 'WST', q: 'Warum wählt man für das Einsatzhärten einen Stahl mit wenig Kohlenstoff (0,16 %)?',
              options: ['Der Kern bleibt zäh, nur die aufgekohlte Randschicht wird hart.', 'Weil er sich besser schweißen lässt.', 'Weil er nach dem Härten rostfrei ist.', 'Weil er sich ohne Abschrecken härten lässt.'], ans: 0,
              e: 'Nur wo Kohlenstoff eindiffundiert ist, entsteht beim Abschrecken harter Martensit.' },
            { id: 'c', type: 'text', pts: 4, cat: 'WST', q: 'Welche Eigenschaften braucht eine Ritzelwelle im Betrieb? Begründe mit der Belastung (vier Punkte).',
              crit: [{ t: 'Harte, verschleißfeste Zahnflanken (Abwälzen unter hoher Flächenpressung).', p: 1 }, { t: 'Zäher Kern (Stöße beim Anlaufen, Biegung im Zahnfuß).', p: 1 },
                     { t: 'Hohe Dauerfestigkeit (wechselnde Belastung bei jeder Umdrehung).', p: 1 }, { t: 'Harte Lagersitze bzw. Maßbeständigkeit nach dem Schleifen.', p: 1 }],
              muster: 'Die Zahnflanken rollen unter hohem Druck aufeinander ab. Sie müssen hart und verschleißfest sein. Beim Anlaufen gibt es Stöße, und der Zahnfuß wird auf Biegung belastet. Deshalb braucht man einen zähen Kern. Weil die Belastung bei jeder Umdrehung wechselt, ist eine hohe Dauerfestigkeit wichtig.' }
          ] },
        { id: 'B7', title: 'Skizze: Lagerdeckel im Halbschnitt', ref: 'Blatt 1, 2', intro: 'Für die Fertigung eines Ersatzteils wird eine Skizze gebraucht.',
          parts: [
            { id: 'a', type: 'sketch', pts: 10, cat: 'TK', q: 'Skizziere den Lagerdeckel (Pos. 8) mit Zentrierbund im <b>Halbschnitt</b> ohne Bemaßung. Die Mittellinie liegt waagerecht.',
              crit: [{ t: 'Mittellinie als Strich-Punkt-Linie gezeichnet, sie trennt die beiden Hälften.', p: 2 }, { t: 'Obere Hälfte geschnitten und schraffiert (dünne Linien, 45°, gleichmäßig).', p: 2 },
                     { t: 'Untere Hälfte als Ansicht ohne Schraffur und ohne verdeckte Kanten.', p: 2 }, { t: 'Zentrierbund in beiden Hälften dargestellt.', p: 2 }, { t: 'Körperkanten als breite Volllinien, Proportionen ungefähr richtig.', p: 2 }],
              muster: `Halbschnitt: oben geschnitten, unten Ansicht. ${deckelHalbschnitt('ok', 'pM1')}` }
          ] },
        { id: 'B8', title: 'Prüfen der Abtriebswelle', ref: 'Blatt 3', intro: 'Die neue Abtriebswelle wird geprüft. Nutze die Einzelteilzeichnung und dein Tabellenbuch (ISO-Toleranzen für Wellen).',
          parts: [
            { id: 'a', type: 'num', pts: 4, cat: 'QS', q: 'Bestimme die Grenzmaße. Drei Nachkommastellen.',
              fields: [{ label: 'Ø30 k6 Höchstmaß', unit: 'mm', ans: 30.015, tol: 0.0005, show: '30,015' }, { label: 'Ø30 k6 Mindestmaß', unit: 'mm', ans: 30.002, tol: 0.0005, show: '30,002' },
                       { label: 'Ø36 n6 Höchstmaß', unit: 'mm', ans: 36.033, tol: 0.0005, show: '36,033' }, { label: 'Ø36 n6 Mindestmaß', unit: 'mm', ans: 36.017, tol: 0.0005, show: '36,017' }],
              e: 'k6 für über 18 bis 30 mm: +15 / +2 µm. n6 für über 30 bis 50 mm: +33 / +17 µm.' },
            { id: 'b', type: 'match', pts: 3, cat: 'QS', q: 'Prüfprotokoll: Sind die Istmaße in Ordnung?',
              rows: [`Lagersitz Ø30 k6 – Istmaß ${ist[0].val} mm`, `Stirnradsitz Ø36 n6 – Istmaß ${ist[1].val} mm`, `Wellenende Ø25 k6 – Istmaß ${ist[2].val} mm`],
              options: ['i. O.', 'n. i. O.'], ans: ist.map(x => x.ok ? 0 : 1), keepOrder: true,
              e: 'Grenzmaße: Ø30 k6: 30,002 … 30,015 · Ø36 n6: 36,017 … 36,033 · Ø25 k6: 25,002 … 25,015 mm.' },
            { id: 'c', type: 'text', pts: 3, cat: 'QS', q: 'Beschreibe, wie du die Rundlauftoleranz 0,02 mm (Bezug A-B) am Ø36 prüfst.',
              crit: [{ t: 'Welle auf den Bezugsflächen A und B lagern (z. B. zwei Prismen).', p: 1 }, { t: 'Messuhr senkrecht auf den Ø36 setzen, Welle eine volle Umdrehung drehen.', p: 1 }, { t: 'Größter minus kleinster Wert ≤ 0,02 mm → i. O.', p: 1 }],
              muster: 'Die Welle wird mit den beiden Lagersitzen A und B in Prismen gelegt. Die Messuhr steht senkrecht auf dem Ø36. Dann dreht man die Welle eine ganze Umdrehung. Die Differenz zwischen größtem und kleinstem Wert darf höchstens 0,02 mm sein.' }
          ] }
        ];
    }
};
