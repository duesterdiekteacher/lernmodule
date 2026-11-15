/* ============================================================
   AP Teil 2 – Industriemechaniker – Fertigungstechnik
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
    id: 'ft-im', key: 'ap2-ft-im-1', summary: true,
    title: 'Fertigungstechnik', subtitle: 'Abschlussprüfung Teil 2 · Industriemechaniker/-in · Projekt Hubstation',
    logo: '⚙️', back: './', backLabel: '← Zurück zur Übersicht Teil 2',
    duration: 105, aAbw: 3, aWeight: 0.5, bAbw: 0, bWeight: 0.5,
    intro: introAfaFt('Fertigungstechnik', 105),
    bIntro: '<p>Arbeite mit den Unterlagen (📐 Zeichnung) und deinem Tabellenbuch. Gib Zahlen mit Komma oder Punkt ein.</p>',
    docs: IM_DOCS,
    cats: { ZER: 'Drehen, Fräsen, Bohren', CNC: 'CNC-Technik', SCH: 'Schleifen', WST: 'Werkstoffe und Wärmebehandlung', MON: 'Fügen und Montage', QS: 'Prüftechnik und Qualität', TM: 'Technische Mathematik', TK: 'Technische Kommunikation' },
    aDef: [
 { cat: 'TK', lock: true, q: 'Auf der Wellenzeichnung steht <b>Freistich DIN 509 – F 0,6 × 0,3</b>. Was bedeutet das?',
   o: ['Freistich der Form F mit Radius 0,6 mm und Einstichtiefe 0,3 mm', 'Fase mit 0,6 mm Länge und 0,3 mm Tiefe', 'Freistich mit 0,6 mm Breite und 0,3 mm Radius, nur für Gewinde', 'Einstich für einen Sicherungsring', 'Zentrierbohrung mit 0,6 mm Durchmesser'],
   e: 'Freistiche nach DIN 509 werden mit Form, Radius r und Tiefe t angegeben. Form F ist für Teile, bei denen Plan- und Zylinderfläche bearbeitet werden.' },
 { cat: 'ZER', q: 'Die Welle hat beidseitig Zentrierbohrungen. Wie spannst du sie für das Drehen der Absätze, damit alles genau rundläuft?',
   o: ['Zwischen Spitzen mit Mitnehmer', 'Nur im Dreibackenfutter, ohne Gegenspitze', 'Im Maschinenschraubstock', 'Mit Magnetspannplatte', 'In einer Spannzange auf dem Ø32'],
   e: 'Zwischen Spitzen werden alle Durchmesser auf dieselbe Achse bezogen. Das ist wichtig für den Rundlauf.' },
 { cat: 'ZER', q: 'Welcher Schneidstoff eignet sich am besten zum Schruppen der vergüteten Welle aus 42CrMo4?',
   o: ['Beschichtetes Hartmetall der Anwendungsgruppe P', 'Werkzeugstahl (unlegiert)', 'Polykristalliner Diamant (PKD)', 'HSS ohne Beschichtung bei hoher Schnittgeschwindigkeit', 'Hartmetall der Gruppe N für Aluminium'],
   e: 'Die Gruppe P steht für Stahl. Beschichtetes Hartmetall hält hohe Temperaturen aus. PKD ist für NE-Metalle, nicht für Stahl.' },
 { cat: 'TM', lock: true, gen: true },
 { cat: 'TK', lock: true, q: 'Für die Lagersitze ist <b>Ra 0,4</b> angegeben. Was bedeutet das?',
   o: ['Der arithmetische Mittenrauwert darf höchstens 0,4 µm betragen.', 'Die Rautiefe muss mindestens 0,4 mm sein.', 'Die Rundheit darf 0,4 µm abweichen.', 'Der Durchmesser darf um 0,4 µm abweichen.', 'Die Oberfläche muss 0,4 mm tief gehärtet sein.'],
   e: 'Ra ist der Mittelwert der Abweichungen des Profils von der Mittellinie. Die Angabe ist ein Höchstwert in µm.' },
 { cat: 'ZER', q: 'Wie wirkt sich ein <b>größerer Spanwinkel</b> beim Drehen aus?',
   o: ['Die Schnittkraft sinkt, aber die Schneide wird schwächer.', 'Die Schneide wird stabiler und die Schnittkraft steigt.', 'Die Oberfläche wird immer rauer.', 'Der Span wird dicker.', 'Der Spanwinkel hat keinen Einfluss.'],
   e: 'Ein großer, positiver Spanwinkel lässt den Span leichter ablaufen. Der Keil wird aber schlanker und bricht leichter aus.' },
 { cat: 'ZER', q: 'Wie erreichst du beim Schlichtdrehen eine glattere Oberfläche?',
   o: ['Kleineren Vorschub und größeren Eckenradius wählen', 'Größeren Vorschub und kleineren Eckenradius wählen', 'Nur die Schnitttiefe vergrößern', 'Die Schnittgeschwindigkeit stark senken', 'Ohne Kühlschmierstoff arbeiten'],
   e: 'Die theoretische Rautiefe ist etwa R<sub>th</sub> = f² / (8 · r). Kleiner Vorschub und großer Radius ergeben eine kleine Rautiefe.' },
 { cat: 'CNC', q: 'Was bewirkt der Befehl <b>G00</b>?',
   o: ['Verfahren im Eilgang', 'Linearinterpolation im Vorschub', 'Kreis im Uhrzeigersinn', 'Programmende', 'Spindel aus'],
   e: 'G00 fährt mit größter Geschwindigkeit, nicht zum Zerspanen. G01 ist die Gerade im Vorschub.' },
 { cat: 'CNC', q: 'Was bewirkt der Befehl <b>G02</b>?',
   o: ['Kreisinterpolation im Uhrzeigersinn', 'Kreisinterpolation gegen den Uhrzeigersinn', 'Eilgang', 'Absolutmaßangabe', 'Werkzeugwechsel'],
   e: 'G02 = Kreis im Uhrzeigersinn, G03 = gegen den Uhrzeigersinn (Blick entgegen der Achse).' },
 { cat: 'CNC', q: 'Was bewirkt <b>G42</b>?',
   o: ['Schneidenradiuskorrektur rechts von der Kontur (in Bearbeitungsrichtung gesehen)', 'Schneidenradiuskorrektur links von der Kontur', 'Aufheben der Schneidenradiuskorrektur', 'Kettenmaßangabe', 'Konstante Schnittgeschwindigkeit'],
   e: 'G41 = links, G42 = rechts der Kontur, G40 hebt die Korrektur auf.' },
 { cat: 'CNC', q: 'Was bedeutet <b>G90</b>?',
   o: ['Absolutmaßangabe: Alle Koordinaten beziehen sich auf den Werkstücknullpunkt.', 'Kettenmaß: Jede Koordinate bezieht sich auf den letzten Punkt.', 'Drehung um 90°', 'Eilgang mit 90 % Geschwindigkeit', 'Programmende mit Rücksprung'],
   e: 'G90 = absolut, G91 = inkremental (Kettenmaß).' },
 { cat: 'TM', lock: true, gen: true },
 { cat: 'SCH', q: 'Die Lagersitze Ø25 k5 mit Ra 0,4 werden nach dem Drehen fertig bearbeitet. Welches Verfahren ist üblich?',
   o: ['Außenrundschleifen', 'Bohren', 'Räumen', 'Hobeln', 'Gewindewalzen'],
   e: 'IT5 und Ra 0,4 erreicht man sicher durch Rundschleifen.' },
 { cat: 'TK', lock: true, q: 'Was bedeutet die Angabe <b>ISO 6411 – A 2/4,25</b> auf der Wellenzeichnung?',
   o: ['Zentrierbohrung Form A mit 2 mm Zentrierdurchmesser und 4,25 mm Senkdurchmesser', 'Gewinde M2 mit 4,25 mm Tiefe', 'Fase 2 × 45° auf 4,25 mm Länge', 'Freistich 2 mm breit, 4,25 mm tief', 'Passfedernut 2 mm breit, 4,25 mm lang'],
   e: 'ISO 6411 ist die Norm für die vereinfachte Angabe von Zentrierbohrungen.' },
 { cat: 'SCH', q: 'Eine Schleifscheibe ist mit <b>A 60 K 5 V</b> bezeichnet. Was bedeutet die <b>60</b>?',
   o: ['Die Körnung', 'Den Härtegrad', 'Die Bindung', 'Die zulässige Umfangsgeschwindigkeit in m/s', 'Den Außendurchmesser in mm'],
   e: 'A = Schleifmittel (Normalkorund), 60 = Körnung, K = Härte, 5 = Gefüge, V = keramische Bindung.' },
 { cat: 'SCH', q: 'Eine neue Schleifscheibe wird aufgespannt. Was ist vorgeschrieben?',
   o: ['Klangprobe vor dem Aufspannen und Probelauf mit Arbeitshöchstgeschwindigkeit, Gefahrbereich frei', 'Die Scheibe mit dem Hammer festklopfen', 'Den Probelauf mit halber Drehzahl und offenem Schutz durchführen', 'Die Schutzhaube abnehmen, damit die Scheibe besser kühlt', 'Die zulässige Umfangsgeschwindigkeit um 20 % überschreiten'],
   e: 'Eine gerissene Scheibe klingt dumpf. Der Probelauf (mindestens 1 Minute) zeigt, ob die Scheibe hält, bevor jemand davorsteht.' },
 { cat: 'WST', q: 'Wie läuft das <b>Vergüten</b> ab?',
   o: ['Härten (Erwärmen und Abschrecken) und danach Anlassen bei hoher Temperatur, etwa 540 bis 680 °C', 'Nur langsames Abkühlen im Ofen', 'Härten und Anlassen bei etwa 180 °C', 'Aufkohlen und Härten der Randschicht', 'Erwärmen auf 300 °C und Abkühlen an Luft'],
   e: 'Vergüten = Härten + Anlassen bei hoher Temperatur. Das ergibt hohe Festigkeit bei guter Zähigkeit.' },
 { cat: 'SCH', q: 'Warum schleift man die Lagersitze erst <b>nach</b> einer Wärmebehandlung fertig?',
   o: ['Die Wärmebehandlung verursacht Verzug und Zunder. Das Endmaß wird erst danach erreicht.', 'Weil weicher Stahl nicht geschliffen werden kann.', 'Weil das Schleifen die Härte erhöht.', 'Weil man so Schleifscheiben spart.', 'Weil es die Norm DIN 509 vorschreibt.'],
   e: 'Durch Erwärmen und Abschrecken verzieht sich das Teil. Deshalb lässt man vorher ein Schleifaufmaß stehen.' },
 { cat: 'MON', q: 'Wie ziehst du die Schrauben der Lagerdeckel an?',
   o: ['Über Kreuz in mehreren Stufen mit dem Drehmomentschlüssel auf das vorgeschriebene Anzugsmoment', 'Der Reihe nach im Kreis, jede Schraube gleich voll', 'So fest wie möglich mit Verlängerungsrohr', 'Nur handfest, damit der Deckel nicht reißt', 'Mit dem Schlagschrauber ohne Drehmomentbegrenzung'],
   e: 'Über Kreuz und in Stufen anziehen verhindert, dass der Deckel schief sitzt. Das Anzugsmoment sorgt für die richtige Vorspannkraft.' },
 { cat: 'TM', lock: true, q: 'Wie groß ist die Masse des Rohteils (Rundstahl Ø36 × 225)? Dichte ρ = 7,85 kg/dm³.',
   o: ['1,80 kg', '7,19 kg', '0,18 kg', '18,0 kg', '2,29 kg'],
   e: 'V = π/4 · (0,36 dm)² · 2,25 dm ≈ 0,229 dm³. m = 0,229 dm³ · 7,85 kg/dm³ ≈ 1,80 kg.' },
 { cat: 'MON', q: 'Der Riemen zur Antriebswelle wird gespannt. Wie prüfst du die richtige Riemenspannung?',
   o: ['Mit Prüfkraft und Eindrücktiefe oder mit einem Frequenz-Messgerät nach Herstellerangabe', 'So stark spannen, dass der Riemen nicht mehr nachgibt', 'Nach Gefühl, je fester desto besser', 'Am Motorgeräusch', 'Mit dem Messschieber an der Riemendicke'],
   e: 'Zu stramm überlastet die Lager, zu locker rutscht der Riemen. Hersteller geben Prüfwerte an.' },
 { cat: 'TK', lock: true, q: 'Wie tief ist die Passfedernut in der Welle (Wellennuttiefe t₁)? Nutze den Schnitt C–C.',
   o: ['3,5 mm', '16,5 mm', '6 mm', '2,5 mm', '10 mm'],
   e: 'Gemessen ist der Rest von 16,5 mm. t₁ = 20 mm − 16,5 mm = 3,5 mm.' },
 { cat: 'MON', q: 'Wie baust du den Radial-Wellendichtring richtig ein?',
   o: ['Dichtlippe zum Schmierstoffraum, Lippe einfetten, über Kanten und Nuten mit einer Montagehülse schieben', 'Dichtlippe nach außen, trocken montieren', 'Mit dem Hammer direkt auf die Dichtlippe schlagen', 'Die Feder der Dichtlippe vorher entfernen', 'Mit Kleber auf der Welle festkleben'],
   e: 'Die Lippe zeigt zum Medium, das abgedichtet wird. Fett verhindert Trockenlauf. Die Hülse schützt die Lippe vor scharfen Kanten.' },
 { cat: 'QS', q: 'Mit welchem Messgerät prüfst du den Lagersitz Ø25 k5 (Toleranz 9 µm) in der Werkstatt am besten?',
   o: ['Feinzeiger-Messschraube mit 0,001 mm Ablesung', 'Messschieber mit 0,05 mm Ablesung', 'Bügelmessschraube mit 0,01 mm Ablesung', 'Stahlmaßstab', 'Radiuslehre'],
   e: 'Faustregel: Die Ablesung sollte höchstens ein Zehntel der Toleranz sein. Bei 9 µm braucht man etwa 1 µm.' },
 { cat: 'QS', q: 'Wie prüfst du den Mittenrauwert Ra 0,4 am Lagersitz?',
   o: ['Mit einem Tastschnittgerät (Rauheitsmessgerät)', 'Mit dem Messschieber', 'Mit einem Haarlineal', 'Mit einer Grenzrachenlehre', 'Mit der Messuhr in Prismen'],
   e: 'Das Tastschnittgerät fährt mit einer feinen Diamantspitze über die Fläche und berechnet Ra.' },
 { cat: 'ZER', q: 'Die Passfedernut Form A (beide Enden rund) wird gefertigt. Womit?',
   o: ['Mit einem Langloch- oder Schaftfräser auf der Fräsmaschine', 'Mit einem Scheibenfräser', 'Mit einer Säge', 'Durch Räumen', 'Mit einem Gewindebohrer'],
   e: 'Ein Schaftfräser erzeugt die runden Enden der Form A. Ein Scheibenfräser würde auslaufende Enden erzeugen.' },
 { cat: 'TM', lock: true, gen: true },
 { cat: 'ZER', q: 'Welche Sicherheitsregel gilt an der Drehmaschine?',
   o: ['Den Spannschlüssel nie im Futter stecken lassen.', 'Späne bei laufender Maschine mit der Hand entfernen.', 'Beim Feilen am drehenden Werkstück Handschuhe tragen.', 'Den Schutz vor dem Futter abbauen, wenn er stört.', 'Werkstücke während des Laufs nachmessen.'],
   e: 'Ein stecken gelassener Schlüssel wird beim Anlaufen herausgeschleudert. Messen und Späne entfernen nur bei Stillstand.' }
    ],
    genA(i, r) {
        if (i === 4) {
            const vc = pick(r, [180, 200, 220, 240, 250]);
            const n = vc * 1000 / (Math.PI * 36);
            const o = uniqOpts([n, vc * 1000 / 36, vc * 1000 / (Math.PI * 18), vc * 100 / (Math.PI * 36), vc * 1000 / (Math.PI * 32)].map(x => fmtT(x) + ' 1/min'));
            return { q: `Die Welle wird aus dem Rohteil Ø36 mm geschruppt. Die Schnittgeschwindigkeit ist <b>v<sub>c</sub> = ${vc} m/min</b>. Welche Drehzahl stellst du ein?`, o,
                     e: `n = v<sub>c</sub> · 1000 / (π · d) = ${vc} · 1000 / (π · 36) ≈ ${fmtT(n)} 1/min.` };
        }
        if (i === 12) {
            const n = pick(r, [800, 1000, 1250]), f = pick(r, [0.2, 0.25, 0.3]);
            const th = 92 / (n * f);
            const o = uniqOpts([th * 60, th, 92 * n * f / 1000, 90 / (n * f) * 60 * 10, 92 / n * 60].map(x => fmt(x, 1) + ' s'));
            return { q: `Der Absatz Ø32 wird in einem Schnitt längsgedreht. Weg mit An- und Überlauf: <b>L = 92 mm</b>. Drehzahl <b>n = ${n} 1/min</b>, Vorschub <b>f = ${fmt(f, 2)} mm</b>. Wie groß ist die Hauptnutzungszeit?`, o,
                     e: `t<sub>h</sub> = L · i / (n · f) = 92 / (${n} · ${fmt(f, 2)}) min ≈ ${fmt(th, 3)} min ≈ ${fmt(th * 60, 1)} s.` };
        }
        if (i === 27) {
            const kc = pick(r, [2000, 2100, 2200, 2400]), ap = 2, f = 0.3;
            const Fc = ap * f * kc;
            const o = uniqOpts([Fc, Fc * 10, Fc / 10, ap * kc, f * kc].map(x => fmtT(x) + ' N'));
            return { q: `Beim Schruppen ist a<sub>p</sub> = 2 mm und f = 0,3 mm. Die spezifische Schnittkraft beträgt <b>k<sub>c</sub> = ${fmtT(kc)} N/mm²</b>. Wie groß ist die Schnittkraft F<sub>c</sub>?`, o,
                     e: `A = a<sub>p</sub> · f = 2 mm · 0,3 mm = 0,6 mm². F<sub>c</sub> = A · k<sub>c</sub> = 0,6 · ${fmtT(kc)} ≈ ${fmtT(Fc)} N.` };
        }
    },
    buildB(rngFor) {
        const r2 = rngFor('B2'), r3 = rngFor('B3');
        const vc = pick(r2, [180, 200, 220, 250]), f = pick(r2, [0.1, 0.12, 0.15]), fs = pick(r2, [0.08, 0.1, 0.12]);
        const n = vc * 1000 / (Math.PI * 25.3), th = 34 / (n * f) * 60, rth = fs * fs / (8 * 0.8) * 1000;
        return [
        { id: 'B1', title: 'Arbeitsplan für die Antriebswelle', intro: 'Die Welle (Pos. 1) wird aus vergütetem Rundstahl 42CrMo4+QT gefertigt. Sieh dir die Einzelteilzeichnung an.',
          parts: [
            { id: 'a', type: 'order', pts: 6, cat: 'ZER', q: 'Bringe die Arbeitsschritte in die richtige Reihenfolge.',
              items: ['Rohteil Ø36 × 225 sägen', 'Beidseitig plandrehen auf 220 mm und zentrieren', 'Zwischen Spitzen schruppen, Aufmaß stehen lassen', 'Schlichten mit Einstichen, Freistichen und Fasen', 'Passfedernuten fräsen', 'Lagersitze und Wellenenden rundschleifen'],
              e: 'Erst Rohteil und Zentrierbohrungen, dann Drehen (grob, dann fein), dann Fräsen der Nuten. Geschliffen wird zum Schluss, damit die Passflächen nicht mehr beschädigt werden.' },
            { id: 'b', type: 'text', pts: 4, cat: 'ZER', q: 'Begründe: Warum wird zwischen Spitzen gedreht und geschliffen? Warum wird zuletzt geschliffen?',
              crit: [{ t: 'Zwischen Spitzen: alle Durchmesser auf derselben Achse → guter Rundlauf (A-B).', p: 1 }, { t: 'Umspannen ist ohne Genauigkeitsverlust möglich (Drehen → Schleifen).', p: 1 },
                     { t: 'Schleifen zuletzt: nur dort Endmaß, Toleranz IT5 und Ra 0,4.', p: 1 }, { t: 'Spätere Arbeitsgänge (Fräsen, Spannen) könnten die Passflächen sonst beschädigen.', p: 1 }],
              muster: 'Die Zentrierbohrungen bilden eine feste Achse. Beim Drehen und beim Schleifen beziehen sich alle Durchmesser darauf. So stimmt der Rundlauf, auch nach dem Umspannen. Geschliffen wird zum Schluss, weil erst dann die engen Toleranzen und die feine Oberfläche entstehen. Frühere Schritte würden die fertigen Flächen sonst wieder beschädigen.' }
          ] },
        { id: 'B2', title: 'Schnittdaten beim Drehen', intro: `Der Lagersitz wird vor dem Schleifen auf <b>Ø25,3 mm</b> geschlichtet. Schnittgeschwindigkeit <b>v<sub>c</sub> = ${vc} m/min</b>, Vorschub <b>f = ${fmt(f, 2)} mm</b>, Weg mit Anlauf <b>L = 34 mm</b>, ein Schnitt.`,
          parts: [
            { id: 'a', type: 'num', pts: 6, cat: 'TM', q: 'Berechne Drehzahl (auf ganze Zahl gerundet) und Hauptnutzungszeit (eine Nachkommastelle).',
              fields: [{ label: 'Drehzahl n', unit: '1/min', ans: n, tol: n * 0.015, show: String(Math.round(n)) }, { label: 'Hauptnutzungszeit t<sub>h</sub>', unit: 's', ans: th, tol: th * 0.03, show: fmt(th, 1) }],
              e: `n = ${vc} · 1000 / (π · 25,3) ≈ ${fmtT(n)} 1/min. t<sub>h</sub> = L / (n · f) = 34 / (${fmtT(n)} · ${fmt(f, 2)}) min ≈ ${fmt(th / 60, 4)} min ≈ ${fmt(th, 1)} s.` },
            { id: 'b', type: 'num', pts: 2, cat: 'TM', q: `Berechne die theoretische Rautiefe mit R<sub>th</sub> = f² / (8 · r) für den Vorschub <b>f = ${fmt(fs, 2)} mm</b> und den Eckenradius <b>r = 0,8 mm</b>. Gib das Ergebnis in µm an (zwei Nachkommastellen).`,
              fields: [{ label: 'R<sub>th</sub>', unit: 'µm', ans: rth, tol: 0.02, show: fmt(rth, 2) }],
              e: `R<sub>th</sub> = ${fmt(fs, 2)}² / (8 · 0,8) mm = ${fmt(rth / 1000, 5)} mm ≈ ${fmt(rth, 2)} µm.` },
            { id: 'c', type: 'select', pts: 2, cat: 'ZER', q: 'Welche Wendeschneidplatte wählst du zum Schlichten bis an den Wellenabsatz?',
              options: ['Rhombische Platte mit spitzem Eckenwinkel (z. B. 35°) und Spanformer für Schlichten', 'Runde Platte für Schruppen', 'Quadratische Platte mit 90° Eckenwinkel und großem Radius 2,4 mm', 'Abstechplatte'], ans: 0,
              e: 'Eine schlanke Platte kommt bis an den Absatz und eignet sich für kleine Schnitttiefen.' }
          ] },
        { id: 'B3', title: 'CNC-Programm für die Außenkontur', intro: 'Die rechte Wellenseite wird auf einer CNC-Drehmaschine geschlichtet. Werkstücknullpunkt: Mitte der rechten Planfläche. X wird als <b>Durchmesser</b> programmiert. Es gilt G90. Fase am Ende: 1 × 45°. Freistiche und Einstiche bleiben unberücksichtigt.',
          parts: [
            { id: 'a', type: 'num', pts: 5, cat: 'CNC', q: 'Ergänze die Koordinaten der Kontur von rechts nach links.',
              fields: [{ label: 'Fasenanfang: X', unit: '', ans: 18, tol: 0.001, show: '18' }, { label: 'Fasenende: Z', unit: '', ans: -1, tol: 0.001, show: '−1' },
                       { label: 'Ende Ø20 (Absatz): Z', unit: '', ans: -34, tol: 0.001, show: '−34' }, { label: 'Ende Ø25 (Absatz): Z', unit: '', ans: -65, tol: 0.001, show: '−65' },
                       { label: 'Absatz Ø32: X', unit: '', ans: 32, tol: 0.001, show: '32' }],
              e: 'Fase 1 × 45° am Ø20: Start bei X18 Z0, Ende bei X20 Z−1. Ø20 ist 34 mm lang → Z−34. Ø25 ist 31 mm lang → Z−65. Dann Plan auf X32.' },
            { id: 'b', type: 'select', pts: 2, cat: 'CNC', q: 'Mit welchem Befehl fährst du die Kontur im Vorschub als Gerade ab?',
              options: ['G01', 'G00', 'G02', 'G96'], ans: 0, e: 'G01 = Gerade im Vorschub.' },
            { id: 'c', type: 'select', pts: 3, cat: 'CNC', q: 'Warum muss beim Drehen der Fase die Schneidenradiuskorrektur eingeschaltet sein?',
              options: ['Ohne Korrektur rechnet die Steuerung mit dem theoretischen Schneidenpunkt. An Fasen und Radien entstehen dann Maßfehler.', 'Ohne Korrektur dreht die Spindel falsch herum.', 'Die Korrektur verlängert die Standzeit der Platte.', 'Die Korrektur ist nur beim Gewindedrehen nötig.'], ans: 0,
              e: 'Der Schneidenradius ist rund. Bei schrägen und runden Konturen läge die echte Schneide sonst neben der programmierten Kontur.' }
          ] },
        { id: 'B4', title: 'Rundschleifen der Lagersitze', intro: 'Die Lagersitze Ø25 k5 werden mit der Scheibe <b>A 60 K 5 V</b> geschliffen.',
          parts: [
            { id: 'a', type: 'select', pts: 2, cat: 'SCH', q: 'Welches Schleifverfahren setzt du ein?',
              options: ['Außen-Längs-Rundschleifen zwischen Spitzen', 'Flachschleifen auf der Magnetspannplatte', 'Innenrundschleifen', 'Profilschleifen mit Diamantrolle'], ans: 0,
              e: 'Zylindrische Wellenabschnitte schleift man außen rund, die Welle läuft zwischen Spitzen.' },
            { id: 'b', type: 'match', pts: 4, cat: 'SCH', q: 'Was bedeuten die Teile der Bezeichnung A 60 K 5 V?',
              rows: ['A', '60', 'K', 'V'], options: ['Schleifmittel (Normalkorund)', 'Körnung', 'Härtegrad', 'Bindung (keramisch)'], ans: [0, 1, 2, 3],
              e: 'A = Korund, 60 = Körnung, K = Härte, 5 = Gefüge, V = keramische Bindung.' },
            { id: 'c', type: 'text', pts: 4, cat: 'SCH', q: 'Nenne vier Sicherheitsmaßnahmen beim Rundschleifen.',
              crit: [{ t: 'Schutzbrille tragen.', p: 1 }, { t: 'Schutzhaube muss montiert und richtig eingestellt sein.', p: 1 },
                     { t: 'Zulässige Umfangsgeschwindigkeit der Scheibe nicht überschreiten, neue Scheibe mit Klangprobe und Probelauf.', p: 1 }, { t: 'Werkstück sicher spannen, nicht in die laufende Scheibe greifen / keine weite Kleidung.', p: 1 }],
              muster: 'Schutzbrille tragen. Die Schutzhaube muss dran sein. Die Scheibe darf nur bis zur angegebenen Umfangsgeschwindigkeit laufen. Neue Scheiben vorher mit Klangprobe und Probelauf prüfen. Das Werkstück sicher spannen. Nicht in die laufende Scheibe greifen, enge Kleidung tragen.' }
          ] },
        { id: 'B5', title: 'Wärmebehandlung', intro: 'Als Ersatz soll eine Welle aus unvergütetem 42CrMo4 gefertigt und selbst vergütet werden.',
          parts: [
            { id: 'a', type: 'order', pts: 4, cat: 'WST', q: 'Bringe die Schritte des Vergütens in die richtige Reihenfolge.',
              items: ['Erwärmen auf Härtetemperatur (etwa 830–860 °C)', 'Halten, bis das Teil durchgewärmt ist', 'Abschrecken in Öl', 'Anlassen bei etwa 540–680 °C und abkühlen'],
              e: 'Härten (erwärmen, halten, abschrecken), dann Anlassen bei hoher Temperatur.' },
            { id: 'b', type: 'select', pts: 2, cat: 'WST', q: 'In welchem Mittel schreckt man 42CrMo4 üblicherweise ab?',
              options: ['Öl', 'Eiswasser mit Salz', 'Ruhende Luft im Ofen', 'Sand'], ans: 0,
              e: 'Legierte Stähle wie 42CrMo4 härten schon bei milderem Abschrecken. Öl verringert die Rissgefahr.' },
            { id: 'c', type: 'text', pts: 4, cat: 'WST', q: 'Erkläre, was beim Härten im Gefüge passiert und warum man danach anlässt.',
              crit: [{ t: 'Beim Erwärmen entsteht Austenit, der Kohlenstoff wird gelöst.', p: 1 }, { t: 'Beim schnellen Abkühlen kann der Kohlenstoff nicht herauswandern.', p: 1 },
                     { t: 'Es entsteht Martensit: sehr hart, aber spröde.', p: 1 }, { t: 'Anlassen baut Spannungen ab und macht den Stahl zäher.', p: 1 }],
              muster: 'Über der Härtetemperatur wandelt sich das Gefüge in Austenit um. Der Kohlenstoff ist darin gelöst. Beim Abschrecken hat er keine Zeit, wieder auszuscheiden. Es entsteht Martensit. Der ist sehr hart, aber spröde und hat Spannungen. Beim Anlassen werden die Spannungen abgebaut, und der Stahl wird zäher.' }
          ] },
        { id: 'B6', title: 'Montage der Lagereinheit', intro: 'Die Lagereinheit wird mit der neuen Welle und neuen Lagern montiert.',
          parts: [
            { id: 'a', type: 'order', pts: 6, cat: 'MON', q: 'Bringe die Montageschritte in die richtige Reihenfolge.',
              items: ['Lager erwärmen und bis zum Wellenabsatz aufschieben', 'Sicherungsringe (Pos. 4) einsetzen', 'Welle mit den Lagern in das Gehäuse schieben', 'Lagerdeckel mit eingepressten Wellendichtringen aufsetzen, Schrauben über Kreuz anziehen', 'Leichtgängigkeit durch Drehen von Hand prüfen', 'Passfeder einsetzen und Riemenscheibe montieren'],
              e: 'Lager auf die Welle, axial sichern, in das Gehäuse, Deckel montieren. Dann prüfen und die Antriebsteile anbauen.' },
            { id: 'b', type: 'num', pts: 4, cat: 'TM', q: 'Das Lager (Bohrung 25 mm) wird erwärmt. Längenausdehnungskoeffizient α = 0,000012 1/K. Runde auf drei Nachkommastellen bzw. ganze Kelvin.',
              fields: [{ label: 'Aufweitung Δd bei ΔT = 80 K', unit: 'mm', ans: 0.024, tol: 0.0005, show: '0,024' }, { label: 'nötige ΔT für Δd = 0,030 mm', unit: 'K', ans: 100, tol: 1, show: '100' }],
              e: 'Δd = α · d · ΔT = 0,000012 · 25 · 80 = 0,024 mm. ΔT = Δd / (α · d) = 0,03 / (0,000012 · 25) = 100 K.' }
          ] },
        { id: 'B7', title: 'Schweißen am Hubtisch', intro: 'Am Rahmen des Hubtisches (S235JR) wird eine Halterung angeschweißt.',
          parts: [
            { id: 'a', type: 'match', pts: 4, cat: 'MON', q: 'Was bedeuten die Abkürzungen der Schweißverfahren?',
              rows: ['MAG', 'MIG', 'WIG', 'E'], options: ['Metall-Aktivgasschweißen', 'Metall-Inertgasschweißen', 'Wolfram-Inertgasschweißen', 'Lichtbogenhandschweißen (Stabelektrode)'], ans: [0, 1, 2, 3],
              e: 'Aktivgas (z. B. CO₂-Gemisch) reagiert mit, Inertgas (Argon) nicht. Bei WIG schmilzt die Wolframelektrode nicht ab.' },
            { id: 'b', type: 'select', pts: 2, cat: 'MON', q: 'Welches Schutzgas nimmst du für MAG an unlegiertem Baustahl?',
              options: ['Mischgas aus Argon und CO₂', 'Reines Argon', 'Reiner Sauerstoff', 'Stickstoff'], ans: 0,
              e: 'Für Baustahl nimmt man Mischgas (z. B. Ar + 18 % CO₂). Reines Argon wäre MIG, z. B. für Aluminium.' },
            { id: 'c', type: 'text', pts: 4, cat: 'MON', q: 'Nenne vier Gefahren beim Schweißen und je eine Schutzmaßnahme (je Paar 1 Punkt).',
              crit: [{ t: 'UV-Strahlung → Schweißschirm/Automatikhelm, Schutzkleidung, Abschirmung.', p: 1 }, { t: 'Schweißrauch → Absaugung, Lüftung.', p: 1 },
                     { t: 'Brand/Spritzer → brennbare Stoffe entfernen, Feuerlöscher, Brandwache.', p: 1 }, { t: 'Elektrischer Strom → intakte Kabel, trockene Handschuhe, Werkstückklemme nah an der Naht.', p: 1 }],
              muster: 'UV-Licht schädigt Augen und Haut: Schweißhelm und Schutzkleidung tragen. Rauch ist giftig: absaugen. Funken können Brände auslösen: brennbares Material weg, Feuerlöscher bereit. Strom: nur intakte Leitungen, trockene Handschuhe. Heiße Teile: Zange und Lederhandschuhe benutzen.' }
          ] },
        { id: 'B8', title: 'Prüfplanung für die Welle', intro: 'Für die neue Welle wird ein Prüfplan erstellt.',
          parts: [
            { id: 'a', type: 'match', pts: 5, cat: 'QS', q: 'Ordne jedem Merkmal das passende Prüfmittel zu.',
              rows: ['Lagersitz Ø25 k5', 'Gesamtlänge 220', 'Nutbreite 6 P9', 'Rundlauf 0,02 A-B', 'Ra 0,4'],
              options: ['Feinzeiger-Messschraube', 'Messschieber', 'Grenzlehre (Nutlehre)', 'Messuhr, Welle in Prismen', 'Tastschnittgerät'], ans: [0, 1, 2, 3, 4],
              e: 'Je enger die Toleranz, desto feiner muss das Prüfmittel anzeigen. Für Formen und Lagen braucht man besondere Messaufbauten.' },
            { id: 'b', type: 'num', pts: 2, cat: 'QS', q: 'Wie groß ist die Maßtoleranz von Ø25 k5? (Tabellenbuch)',
              fields: [{ label: 'Toleranz T', unit: 'µm', ans: 9, tol: 0.01, show: '9' }],
              e: 'k5 für über 18 bis 30 mm: +11 / +2 µm → T = 9 µm (IT5).' },
            { id: 'c', type: 'text', pts: 3, cat: 'QS', q: 'Die Welle kommt warm von der Schleifmaschine. Warum misst du sie nicht sofort? Begründe.',
              crit: [{ t: 'Bezugstemperatur für Maße ist 20 °C.', p: 1 }, { t: 'Stahl dehnt sich bei Wärme aus (etwa 0,012 mm je m und K).', p: 1 }, { t: 'Bei 9 µm Toleranz führen schon wenige Kelvin zu Fehlmessungen → erst abkühlen lassen.', p: 1 }],
              muster: 'Alle Maße gelten bei 20 °C. Warmer Stahl ist größer. Bei 25 mm und 10 K wächst der Durchmesser um etwa 3 µm. Das ist ein Drittel der Toleranz. Deshalb lässt man die Welle abkühlen und misst dann.' }
          ] }
        ];
    }
};
