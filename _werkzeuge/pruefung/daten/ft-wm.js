/* ============================================================
   AP Teil 2 – Werkzeugmechaniker – Fertigungstechnik
   ============================================================ */
function introAfaFt(name, min) {
    return `<h2>So läuft die Prüfung</h2>
    <ul class="steps">
      <li>Prüfungsbereich <b>${name}</b>. Du hast <b>${min} Minuten</b>. Die Uhr läuft oben rückwärts.</li>
      <li><b>Teil A:</b> 28 Aufgaben zum Ankreuzen. Pro Aufgabe ist genau eine Antwort richtig.</li>
      <li>In Teil A musst du <b>3 Aufgaben abwählen</b>. Die 8 Aufgaben mit 🔒 (Mathematik und Technische Kommunikation) kannst du nicht abwählen.</li>
      <li>Wählst du nicht ab, werden die <b>letzten 3 abwählbaren Aufgaben</b> nicht gewertet.</li>
      <li><b>Teil B:</b> 8 Aufgaben mit je 10 Punkten. Keine Abwahl. Eine Teilaufgabe ist eine Skizze auf Papier.</li>
      <li>Die Aufgaben beziehen sich auf den Zeichnungssatz hinter dem Knopf <b>📐 Zeichnung</b>. Über jeder Aufgabe steht, welches Blatt du brauchst.</li>
    </ul>
    <div class="info warn"><b>Hilfsmittel:</b> Tabellenbuch Metall, Taschenrechner, Papier für Nebenrechnungen.</div>
    <table class="tbl"><tr><th>Teil</th><th>Aufgaben</th><th>Punkte</th><th>Anteil</th></tr>
    <tr><td>A – gebunden</td><td>28, davon 3 abwählen</td><td>25 × 1 Punkt</td><td>50 %</td></tr>
    <tr><td>B – ungebunden</td><td>8, keine Abwahl</td><td>8 × 10 Punkte</td><td>50 %</td></tr></table>`;
}
const EXAM = {
    id: 'ft-wm', key: 'ap2-ft-wm-2', summary: true,
    title: 'Fertigungstechnik', subtitle: 'Abschlussprüfung Teil 2 · Werkzeugmechaniker/-in · Projekt Folgeschneidwerkzeug',
    logo: '⚙️', back: './', backLabel: '← Zurück zur Übersicht Teil 2',
    duration: 105, aAbw: 3, aWeight: 0.5, bAbw: 0, bWeight: 0.5,
    intro: introAfaFt('Fertigungstechnik', 105),
    bIntro: '<p>Arbeite mit den Unterlagen (📐 Zeichnung) und deinem Tabellenbuch. Gib Zahlen mit Komma oder Punkt ein.</p>',
    docs: WM_DOCS,
    cats: { ERO: 'Erodieren', FRA: 'Fräsen und CNC', SCH: 'Schleifen', WST: 'Werkstoffe und Wärmebehandlung', MON: 'Montage und Fügen', QS: 'Prüftechnik, Qualität und Sicherheit', TM: 'Technische Mathematik', TK: 'Technische Kommunikation' },
    aDef: [
 { cat: 'TK', ref: 'Blatt 3', lock: true, q: 'In welchem Bereich muss das Maß <b>40 +0,02/0</b> des Durchbruchs liegen?',
   o: ['40,00 mm bis 40,02 mm', '39,98 mm bis 40,02 mm', '40,02 mm bis 40,04 mm', '39,98 mm bis 40,00 mm', '39,80 mm bis 40,20 mm'],
   e: 'Oberes Abmaß +0,02, unteres Abmaß 0: Mindestmaß 40,00 mm, Höchstmaß 40,02 mm.' },
 { cat: 'ERO', q: 'Wie trägt das <b>Drahterodieren</b> Werkstoff ab?',
   o: ['Durch Funkenentladungen zwischen Drahtelektrode und Werkstück in deionisiertem Wasser', 'Durch Schleifkörner, die im Draht eingebettet sind', 'Durch Schmelzen mit einem Laserstrahl', 'Durch chemisches Ätzen mit Säure', 'Durch Abscheren wie beim Stanzen'],
   e: 'Jeder Funke schmilzt und verdampft ein winziges Stück Werkstoff. Das Dielektrikum spült die Teilchen weg.' },
 { cat: 'ERO', ref: 'Blatt 3', q: 'Die Durchbrüche liegen innen in der Platte. Was muss vor dem Drahterodieren gemacht werden?',
   o: ['Ein Startloch bohren, durch das der Draht gefädelt wird', 'Die Platte entmagnetisieren', 'Die Platte verkupfern', 'Die Durchbrüche fertig fräsen', 'Nichts, der Draht schneidet sich von oben hinein'],
   e: 'Der Draht muss durch das Werkstück laufen. Bei Innenkonturen braucht man dafür ein Startloch.' },
 { cat: 'TM', ref: 'Blatt 3', lock: true, gen: true },
 { cat: 'TK', ref: 'Blatt 3', lock: true, q: 'Im Schnitt A–A ist eine <b>Schneidkantenhöhe von 6 mm</b> angegeben. Was bedeutet das?',
   o: ['Auf 6 mm Höhe ist der Durchbruch gerade (zylindrisch). Nur innerhalb dieser Höhe kann nachgeschliffen werden.', 'Die Platte ist 6 mm dick.', 'Der Stempel taucht 6 mm tief ein.', 'Der Durchbruch ist auf 6 mm gehärtet.', 'Der Freiwinkel beträgt 6°.'],
   e: 'Darunter folgt der Freiwinkel. Schleift man zu viel ab, wird der Durchbruch an der Schneidkante größer.' },
 { cat: 'ERO', q: 'Aus welchem Werkstoff sind Elektroden für das <b>Senkerodieren</b> meistens?',
   o: ['Kupfer oder Graphit', 'Gehärteter Werkzeugstahl', 'Kunststoff', 'Gusseisen', 'Hartmetall mit Keramikbeschichtung'],
   e: 'Kupfer und Graphit leiten gut und verschleißen wenig. Graphit lässt sich gut fräsen.' },
 { cat: 'ERO', q: 'Eine Elektrode für das Senkerodieren wird gefertigt. Was gilt für ihr Maß?',
   o: ['Sie ist um den Funkenspalt kleiner als die fertige Form.', 'Sie hat genau das Maß der Form.', 'Sie ist um den Funkenspalt größer als die Form.', 'Ihr Maß ist egal, die Maschine korrigiert alles.', 'Sie muss doppelt so groß sein wie die Form.'],
   e: 'Zwischen Elektrode und Werkstück bleibt ein Spalt, in dem die Funken überspringen.' },
 { cat: 'ERO', ref: 'Blatt 3', q: 'Warum werden die Durchbrüche der Schneidplatte erodiert und nicht gefräst?',
   o: ['Die Platte ist schon gehärtet. Erodieren funktioniert unabhängig von der Härte und erzeugt genaue Konturen.', 'Weil Fräsen bei X153CrMoV12 verboten ist.', 'Weil Erodieren immer schneller ist.', 'Weil Erodieren die Platte härtet.', 'Weil Fräsmaschinen keine Rundungen fräsen können.'],
   e: 'Erodiert man nach dem Härten, verzieht sich der Durchbruch nicht mehr. Fräsen von 60 HRC ist nur eingeschränkt möglich.' },
 { cat: 'SCH', ref: 'Blatt 3', q: 'Die Schneidplatte wird auf der Magnetspannplatte flachgeschliffen. Was ist danach nötig?',
   o: ['Die Platte entmagnetisieren', 'Die Platte sofort härten', 'Die Platte rostschutzlackieren', 'Die Platte mit Wasser abschrecken', 'Nichts'],
   e: 'Restmagnetismus hält Späne und Butzen fest. Das stört später beim Stanzen.' },
 { cat: 'SCH', q: 'Beim Schleifen zeigen sich braune und blaue Verfärbungen (Schleifbrand). Was ist eine Ursache?',
   o: ['Zu große Zustellung oder zugesetzte, zu harte Scheibe ohne ausreichende Kühlung', 'Zu kleine Zustellung', 'Zu viel Kühlschmierstoff', 'Zu weiche Schleifscheibe', 'Zu niedrige Werkstücktemperatur'],
   e: 'Zu viel Wärme lässt die gehärtete Randschicht an. Sie wird weich, es können Risse entstehen.' },
 { cat: 'SCH', q: 'Welche Schleifscheibe eignet sich gut für gehärteten Werkzeugstahl?',
   o: ['CBN-Scheibe (kubisches Bornitrid) oder weiche Edelkorundscheibe', 'Diamantscheibe, weil Diamant für Stahl am besten ist', 'Siliziumkarbid für Grauguss', 'Harte, grobe Normalkorundscheibe', 'Gummischeibe zum Polieren'],
   e: 'Diamant reagiert bei hoher Temperatur mit Eisen. Für gehärteten Stahl nimmt man CBN oder Edelkorund.' },
 { cat: 'TM', lock: true, gen: true },
 { cat: 'FRA', q: 'Gehärtete Werkzeugteile werden heute oft hart gefräst (HSC). Welche Bedingungen sind typisch?',
   o: ['Hohe Schnittgeschwindigkeit, kleine Zustellung, beschichtete Hartmetall- oder CBN-Werkzeuge', 'Kleine Schnittgeschwindigkeit, große Zustellung, HSS-Fräser', 'Fräsen ohne Werkzeugkühlung mit Holzfräser', 'Nur mit Scheibenfräsern', 'Immer mit Wasser als Kühlmittel'],
   e: 'Kleine Spanungsquerschnitte mit hoher Geschwindigkeit halten die Kräfte klein und die Oberfläche gut.' },
 { cat: 'TK', ref: 'Blatt 3', lock: true, q: 'Wozu dienen die Bohrungen <b>2× Ø8 H7</b> in der Schneidplatte?',
   o: ['Für Zylinderstifte, die die Lage der Platte auf der Grundplatte genau festlegen', 'Für die Schrauben', 'Als Startlöcher für das Drahterodieren', 'Als Durchfall für Butzen', 'Für die Führungssäulen'],
   e: 'Schrauben halten, Stifte positionieren. So sitzt die Platte nach jedem Ausbau wieder genau.' },
 { cat: 'FRA', q: 'Eine Außenkontur wird mit rechtsdrehendem Fräser (M03) im <b>Gleichlauf</b> gefräst. Welche Fräserradiuskorrektur ist richtig?',
   o: ['G41 – Werkzeug links von der Kontur', 'G42 – Werkzeug rechts von der Kontur', 'G40 – keine Korrektur', 'G43', 'G90'],
   e: 'Bei M03 ergibt G41 (links der Kontur in Fahrtrichtung) das Gleichlauffräsen.' },
 { cat: 'FRA', ref: 'Blatt 3', q: 'Der Durchbruch hat Innenecken mit R5. Welcher Schaftfräser ist für das Fertigfräsen höchstens möglich?',
   o: ['Ø10 mm', 'Ø12 mm', 'Ø16 mm', 'Ø20 mm', 'Ø5 mm ist zu groß'],
   e: 'Der Fräserradius darf nicht größer sein als der Innenradius: 5 mm → höchstens Ø10 mm, besser etwas kleiner.' },
 { cat: 'WST', q: 'Bei welcher Temperatur wird X153CrMoV12 etwa gehärtet?',
   o: ['etwa 1000 bis 1050 °C', 'etwa 780 bis 820 °C', 'etwa 200 °C', 'etwa 600 °C', 'etwa 1400 °C'],
   e: 'Hochlegierte Kaltarbeitsstähle brauchen eine hohe Härtetemperatur, damit sich genug Karbide lösen.' },
 { cat: 'WST', q: 'Warum wird X153CrMoV12 nach dem Härten <b>mehrmals</b> angelassen?',
   o: ['Um Restaustenit umzuwandeln und Spannungen abzubauen', 'Um die Härte auf 30 HRC zu senken', 'Um Zunder zu entfernen', 'Damit der Stahl magnetisch wird', 'Damit er rostfrei wird'],
   e: 'Nach dem Abschrecken bleibt etwas Austenit. Mehrfaches Anlassen wandelt ihn um. Das Teil wird maßbeständiger.' },
 { cat: 'WST', q: 'Wie prüfst du die Härte 60 HRC?',
   o: ['Rockwell-Härteprüfung Verfahren C mit Diamantkegel', 'Brinell mit Hartmetallkugel 10 mm', 'Zugversuch', 'Kerbschlagbiegeversuch', 'Mit der Feile ritzen und schätzen'],
   e: 'HRC = Rockwell C. Ein Diamantkegel wird mit festgelegter Kraft eingedrückt, die bleibende Tiefe ergibt die Härte.' },
 { cat: 'TM', ref: 'Blatt 3', lock: true, q: 'Wie groß ist die Masse der Schneidplatte (100 × 80 × 22 mm, ohne Durchbrüche und Bohrungen)? ρ = 7,7 kg/dm³.',
   o: ['1,36 kg', '13,6 kg', '0,14 kg', '1,76 kg', '2,72 kg'],
   e: 'V = 1,0 · 0,8 · 0,22 dm³ = 0,176 dm³. m = 0,176 · 7,7 ≈ 1,36 kg.' },
 { cat: 'MON', ref: 'Blatt 3', q: 'Wie werden die Stiftbohrungen von Schneidplatte und Grundplatte üblicherweise hergestellt?',
   o: ['Platten ausrichten, verschrauben und dann gemeinsam bohren und reiben (bzw. erodieren)', 'Jede Platte getrennt nach Maß bohren', 'Mit dem Körner durchschlagen', 'Die Stifte einkleben, ohne Bohrung', 'Nur die Grundplatte bohren'],
   e: 'Gemeinsam bearbeitet passen die Bohrungen genau zueinander.' },
 { cat: 'MON', ref: 'Blatt 4', q: 'Die Schrauben haben die Festigkeitsklasse <b>10.9</b>. Was bedeutet das?',
   o: ['Zugfestigkeit 1000 N/mm², Streckgrenze 900 N/mm²', 'Zugfestigkeit 109 N/mm²', 'Streckgrenze 1000 N/mm², Zugfestigkeit 900 N/mm²', 'Härte 10,9 HRC', 'Zugfestigkeit 900 N/mm², Bruchdehnung 10 %'],
   e: '10 × 100 = 1000 N/mm². 10 × 9 × 10 = 900 N/mm² Streckgrenze.' },
 { cat: 'MON', ref: 'Blatt 1', q: 'Wie werden die Stempel in der Stempelhalteplatte gegen Herausziehen gesichert?',
   o: ['Durch einen Kopf oder Bund am Stempel, der von der Druckplatte gehalten wird', 'Durch Kleben mit Sekundenkleber', 'Nur durch Reibung', 'Durch Schweißen an die Schneidplatte', 'Durch einen Sicherungsring auf der Schneide'],
   e: 'Beim Rückhub zieht der Streifen an den Stempeln. Der Kopf verhindert, dass sie herausrutschen.' },
 { cat: 'QS', ref: 'Blatt 3', q: 'Womit prüfst du die Lage und Form der Durchbrüche (Toleranz ±0,01 mm) am besten?',
   o: ['Mit einem Koordinatenmessgerät', 'Mit dem Messschieber', 'Mit dem Stahlmaßstab', 'Mit einer Radiuslehre', 'Mit dem Haarlineal'],
   e: 'Bei ±0,01 mm und Konturen braucht man ein sehr genaues Messverfahren.' },
 { cat: 'QS', q: 'Bei welcher Temperatur gelten die Maße einer Zeichnung?',
   o: ['20 °C', '0 °C', '25 °C', '15 °C', 'bei Raumtemperatur, egal welche'],
   e: 'Die Bezugstemperatur für geometrische Produktspezifikationen ist 20 °C.' },
 { cat: 'TK', ref: 'Blatt 3', lock: true, q: 'Wie weit darf der Abstand zwischen Lochmitte und Durchbruchmitte (32 ±0,01) abweichen?',
   o: ['Er muss zwischen 31,99 mm und 32,01 mm liegen.', 'Er muss zwischen 31,90 mm und 32,10 mm liegen.', 'Er muss genau 32,00 mm sein.', 'Er muss zwischen 32,00 mm und 32,01 mm liegen.', 'Es gilt die Allgemeintoleranz ±0,2 mm.'],
   e: 'Der Abstand entspricht dem Vorschub. Er muss sehr genau sein, sonst passen Löcher und Außenkontur nicht zueinander.' },
 { cat: 'TM', ref: 'Blatt 3', lock: true, q: 'Wo liegt der Mittelpunkt des Radius R5 in der <b>unteren linken</b> Ecke des Durchbruchs? Nullpunkt: linke untere Ecke der Platte. Der Durchbruch reicht von X47 bis X77 und von Y20 bis Y60.',
   o: ['X52 Y25', 'X47 Y20', 'X57 Y30', 'X42 Y15', 'X52 Y20'],
   e: 'Der Mittelpunkt liegt um den Radius nach innen versetzt: 47 + 5 = 52 und 20 + 5 = 25.' },
 { cat: 'QS', img: true, q: 'Bei einer Schnittverletzung suchst du den Verbandkasten. Er ist mit einem <b>Rettungszeichen</b> gekennzeichnet. Welche Abbildung zeigt Form und Farbe eines Rettungszeichens?',
   o: [sicherheitszeichen('rettung'), sicherheitszeichen('gebot'), sicherheitszeichen('verbot'), sicherheitszeichen('warn'), sicherheitszeichen('brand')],
   e: 'Rettungszeichen sind grüne Rechtecke oder Quadrate mit weißem Symbol. Brandschutzzeichen sind rot.' }
    ],
    genA(i, r) {
        if (i === 4) {
            const v = pick(r, [2.0, 2.5, 3.0, 4.0]);
            const l = 2 * (40 + 30) - 8 * 5 + 2 * Math.PI * 5, t = l / v;
            const o = uniqOpts([t, t * 60, v * l, t / 60, l / (v * 2)].map(x => fmt(x, 1) + ' min'));
            return { q: `Der Ausschneid-Durchbruch hat eine Konturlänge von <b>131,4 mm</b>. Die Schnittgeschwindigkeit beim Drahterodieren beträgt bei 22 mm Plattendicke <b>${fmt(v, 1)} mm/min</b>. Wie lange dauert ein Schnitt um die Kontur?`, o,
                     e: `t = l / v = 131,4 mm / ${fmt(v, 1)} mm/min ≈ ${fmt(t, 1)} min.` };
        }
        if (i === 12) {
            const vc = pick(r, [80, 100, 120, 150]);
            const n = vc * 1000 / (Math.PI * 10);
            const o = uniqOpts([n, vc * 1000 / 10, vc * 1000 / (Math.PI * 5), vc * 100 / (Math.PI * 10), n * 2.5].map(x => fmtT(x) + ' 1/min'));
            return { q: `Die Durchbrüche werden vor dem Härten mit einem Schaftfräser <b>Ø10 mm</b> vorgefräst, <b>v<sub>c</sub> = ${vc} m/min</b>. Welche Drehzahl stellst du ein?`, o,
                     e: `n = ${vc} · 1000 / (π · 10) ≈ ${fmtT(n)} 1/min.` };
        }
    },
    buildB(rngFor) {
        const r2 = rngFor('B2'), r3 = rngFor('B3'), r8 = rngFor('B8');
        const v = pick(r2, [2.0, 2.5, 3.0]);
        const lA = 2 * (40 + 30) - 8 * 5 + 2 * Math.PI * 5, lL = 2 * Math.PI * 6.6, t = lA / v;
        const vc = pick(r3, [60, 80, 100]), n = vc * 1000 / (Math.PI * 8);
        const ist = [];
        const mk = (ok, okV, badV) => ist.push({ ok, val: ok ? pick(r8, okV) : pick(r8, badV) });
        mk(r8() < 0.5, ['40,008', '40,015', '40,002'], ['40,024', '39,996', '40,028']);
        mk(r8() < 0.5, ['31,995', '32,006', '32,009'], ['32,013', '31,987', '32,018']);
        mk(r8() < 0.5, ['6,604', '6,608', '6,601'], ['6,598', '6,614', '6,596']);
        return [
        { id: 'B1', ref: 'Blatt 3', title: 'Arbeitsplan für die Schneidplatte', intro: 'Die neue Schneidplatte (Pos. 10) wird aus X153CrMoV12 gefertigt. Sieh dir die Einzelteilzeichnung an.',
          parts: [
            { id: 'a', type: 'order', pts: 6, cat: 'FRA', q: 'Bringe die Arbeitsschritte in die richtige Reihenfolge.',
              items: ['Rohteil mit Aufmaß zuschneiden', 'Allseitig vorfräsen, Gewinde M8 schneiden, Startlöcher bohren', 'Durchbrüche mit Aufmaß vorfräsen', 'Härten und mehrfach anlassen', 'Ober- und Unterseite flachschleifen', 'Durchbrüche und Stiftbohrungen drahterodieren'],
              e: 'Alles Weiche zuerst. Gewinde und Startlöcher vor dem Härten. Nach dem Härten schleifen und dann auf Endmaß erodieren.' },
            { id: 'b', type: 'text', pts: 4, cat: 'WST', q: 'Begründe: Warum werden Gewinde und Startlöcher <b>vor</b> dem Härten, die Durchbrüche aber <b>nach</b> dem Härten fertig bearbeitet?',
              crit: [{ t: 'Gewinde schneiden und Bohren geht im gehärteten Zustand (60 HRC) nicht oder nur sehr schwer.', p: 1 }, { t: 'Startlöcher braucht man später zum Einfädeln des Drahtes.', p: 1 },
                     { t: 'Beim Härten verzieht sich die Platte und ändert ihr Maß.', p: 1 }, { t: 'Durch Erodieren nach dem Härten stimmen Maß, Lage und Schneidkante genau.', p: 1 }],
              muster: 'Gehärteten Stahl kann man kaum bohren oder Gewinde schneiden. Deshalb macht man das vorher, auch die Startlöcher für den Draht. Beim Härten verzieht sich die Platte etwas. Die genauen Durchbrüche werden deshalb erst danach erodiert. So stimmen Maße und Lage.' }
          ] },
        { id: 'B2', ref: 'Blatt 3', title: 'Drahterodieren', intro: `Die Durchbrüche werden drahterodiert. Schnittgeschwindigkeit bei 22 mm Plattendicke: <b>${fmt(v, 1)} mm/min</b>. Rechne mit der π-Taste.`,
          parts: [
            { id: 'a', type: 'num', pts: 6, cat: 'TM', q: 'Berechne die Konturlängen und die Schnittzeit für den Ausschneid-Durchbruch. Eine Nachkommastelle.',
              fields: [{ label: 'Konturlänge Ausschneid-Durchbruch', unit: 'mm', ans: lA, tol: 0.3, show: fmt(lA, 1) }, { label: 'Konturlänge beide Lochdurchbrüche Ø6,6', unit: 'mm', ans: lL, tol: 0.25, show: fmt(lL, 1) },
                       { label: 'Schnittzeit Ausschneid-Durchbruch', unit: 'min', ans: t, tol: t * 0.01, show: fmt(t, 1) }],
              e: `Außen: 2 · (40 + 30) − 8 · 5 + 2 · π · 5 ≈ ${fmt(lA, 2)} mm. Löcher: 2 · π · 6,6 ≈ ${fmt(lL, 2)} mm. t = ${fmt(lA, 2)} / ${fmt(v, 1)} ≈ ${fmt(t, 1)} min.` },
            { id: 'b', type: 'select', pts: 2, cat: 'ERO', q: 'Welches Dielektrikum wird beim Drahterodieren meist verwendet?',
              options: ['Deionisiertes Wasser', 'Leitungswasser mit Salz', 'Kühlschmierstoff-Emulsion', 'Druckluft'], ans: 0,
              e: 'Deionisiertes Wasser leitet kaum. So entstehen gezielte Funken. Es kühlt und spült.' },
            { id: 'c', type: 'select', pts: 2, cat: 'ERO', q: 'Wie entsteht der Freiwinkel von 1° unter der Schneidkante?',
              options: ['Durch einen Konikschnitt: Der Draht wird mit den U/V-Achsen schräg gestellt', 'Durch Nachschleifen von Hand', 'Durch Härten', 'Er entsteht von selbst durch den Funkenspalt'], ans: 0,
              e: 'Drahterodiermaschinen können den Draht neigen. So entstehen konische Wände.' }
          ] },
        { id: 'B3', ref: 'Blatt 3', title: 'CNC-Vorfräsen des Durchbruchs', intro: 'Der Ausschneid-Durchbruch wird vor dem Härten vorgefräst. Nullpunkt: linke untere Ecke der Schneidplatte. Durchbruch: X47 bis X77, Y20 bis Y60, Ecken R5.',
          parts: [
            { id: 'a', type: 'num', pts: 6, cat: 'FRA', q: 'Bestimme die Mittelpunkte der Eckradien.',
              fields: [{ label: 'Ecke unten links: X', unit: '', ans: 52, tol: 0.001, show: '52' }, { label: 'Ecke unten links: Y', unit: '', ans: 25, tol: 0.001, show: '25' },
                       { label: 'Ecke oben rechts: X', unit: '', ans: 72, tol: 0.001, show: '72' }, { label: 'Ecke oben rechts: Y', unit: '', ans: 55, tol: 0.001, show: '55' }],
              e: 'Von jeder Ecke um den Radius 5 nach innen: 47 + 5 = 52, 20 + 5 = 25, 77 − 5 = 72, 60 − 5 = 55.' },
            { id: 'b', type: 'select', pts: 2, cat: 'FRA', q: 'Die Innenkontur wird im Gleichlauf gefräst (M03). Welche Fräserradiuskorrektur wählst du?',
              options: ['G41', 'G42', 'G40', 'G91'], ans: 0, e: 'Mit M03 gilt: Gleichlauf = G41, egal ob Außen- oder Innenkontur.' },
            { id: 'c', type: 'num', pts: 2, cat: 'TM', q: `Berechne die Drehzahl für den Schaftfräser <b>Ø8 mm</b> bei <b>v<sub>c</sub> = ${vc} m/min</b>. Ganze Zahl.`,
              fields: [{ label: 'Drehzahl n', unit: '1/min', ans: n, tol: n * 0.015, show: String(Math.round(n)) }],
              e: `n = ${vc} · 1000 / (π · 8) ≈ ${fmtT(n)} 1/min.` }
          ] },
        { id: 'B4', ref: 'Blatt 3', title: 'Flachschleifen', intro: 'Ober- und Unterseite der gehärteten Schneidplatte werden flachgeschliffen.',
          parts: [
            { id: 'a', type: 'num', pts: 2, cat: 'TM', q: 'Pro Seite sind 0,15 mm abzuschleifen. Zustellung je Überlauf: 0,01 mm. Wie viele Überläufe sind für <b>beide</b> Seiten zusammen nötig?',
              fields: [{ label: 'Anzahl Überläufe', unit: '', ans: 30, tol: 0.01, show: '30' }],
              e: '0,15 / 0,01 = 15 je Seite, für beide Seiten 30.' },
            { id: 'b', type: 'match', pts: 4, cat: 'SCH', q: 'Ordne jedem Fehler die wahrscheinlichste Ursache zu.',
              rows: ['Braune Verfärbung, weiche Stellen', 'Rattermarken auf der Fläche', 'Maß nach dem Abkühlen zu klein', 'Späne bleiben an der Platte haften'],
              options: ['Zu große Zustellung, zu wenig Kühlung', 'Unwucht der Schleifscheibe', 'Werkstück war beim Messen warm', 'Platte nicht entmagnetisiert'], ans: [0, 1, 2, 3],
              e: 'Jeder Fehler hat eine typische Ursache. Das hilft bei der Fehlersuche.' },
            { id: 'c', type: 'text', pts: 4, cat: 'SCH', q: 'Nenne vier Sicherheitsregeln beim Flachschleifen.',
              crit: [{ t: 'Schutzbrille tragen, Schutzhaube montiert.', p: 1 }, { t: 'Werkstück auf der Magnetplatte sicher halten (Anschlagleisten bei schmalen Teilen), Magnet einschalten vor dem Start.', p: 1 },
                     { t: 'Neue Scheibe: Klangprobe und Probelauf, zulässige Umfangsgeschwindigkeit beachten.', p: 1 }, { t: 'Nicht in den Bereich der laufenden Scheibe greifen, Messen nur bei Stillstand.', p: 1 }],
              muster: 'Schutzbrille tragen, die Schutzhaube muss dran sein. Das Werkstück sicher auf der Magnetplatte spannen, bei kleinen Teilen mit Anschlagleisten. Neue Scheiben mit Klangprobe und Probelauf prüfen. Nicht in die laufende Scheibe greifen. Gemessen wird nur bei Stillstand.' }
          ] },
        { id: 'B5', ref: 'Blatt 3, 4', title: 'Härten der Schneidplatte', intro: 'Die Schneidplatte aus X153CrMoV12 soll auf 60 +2 HRC gehärtet werden.',
          parts: [
            { id: 'a', type: 'order', pts: 4, cat: 'WST', q: 'Bringe die Schritte in die richtige Reihenfolge.',
              items: ['In Stufen langsam vorwärmen', 'Auf Härtetemperatur (etwa 1000–1050 °C) erwärmen und durchwärmen', 'Abkühlen (z. B. im Gasstrom des Vakuumofens)', 'Zwei- bis dreimal anlassen'],
              e: 'Vorwärmen verhindert Risse. Nach dem Abkühlen mehrfach anlassen.' },
            { id: 'b', type: 'num', pts: 2, cat: 'WST', q: 'Gib die Gehalte für X153CrMoV12 an.',
              fields: [{ label: 'Kohlenstoffgehalt', unit: '%', ans: 1.53, tol: 0.005, show: '1,53' }, { label: 'Chromgehalt', unit: '%', ans: 12, tol: 0.01, show: '12' }],
              e: 'Hochlegiert (X): Kohlenstoff 153 : 100 = 1,53 %, Chrom direkt 12 %.' },
            { id: 'c', type: 'text', pts: 4, cat: 'WST', q: 'Warum lässt man vor dem Härten an den Funktionsflächen ein Aufmaß stehen? Nenne zwei Gründe und wie es entfernt wird.',
              crit: [{ t: 'Beim Härten verzieht sich das Teil (Maß- und Formänderung).', p: 1 }, { t: 'An der Oberfläche können Randentkohlung oder Zunder entstehen.', p: 1 },
                     { t: 'Das Aufmaß wird durch Schleifen (Flächen) entfernt.', p: 1 }, { t: 'Konturen werden durch Erodieren auf Endmaß gebracht.', p: 1 }],
              muster: 'Beim Härten ändert sich das Maß, und das Teil verzieht sich. Außerdem kann die Oberfläche entkohlen oder verzundern. Deshalb lässt man Aufmaß stehen. Die Flächen werden danach geschliffen, die Konturen erodiert.' }
          ] },
        { id: 'B6', ref: 'Blatt 1, 3', title: 'Montage und Nachschleifen', intro: 'Die Schneidkantenhöhe beträgt 6 mm. Damit die Schneidplatte stabil bleibt, dürfen höchstens 3 mm Schneidkantenhöhe verbraucht werden. Je Nachschliff werden 0,2 mm abgetragen.',
          parts: [
            { id: 'a', type: 'order', pts: 6, cat: 'MON', q: 'Bringe die Schritte beim Einpassen des Werkzeugs in die richtige Reihenfolge.',
              items: ['Schneidplatte auf der Grundplatte ausrichten und verschrauben', 'Schneidplatte und Grundplatte gemeinsam verstiften', 'Oberteil über die Säulen langsam auf das Unterteil absenken', 'Prüfen, ob die Stempel ohne Anstoßen in die Durchbrüche tauchen', 'Schneidspalt rundum prüfen (Lichtspalt / Probeschnitt mit Papier)', 'Probeteile schneiden und Gratbild beurteilen'],
              e: 'Erst das Unterteil fixieren, dann Ober- und Unterteil zusammenführen, prüfen und Probeteile machen.' },
            { id: 'b', type: 'num', pts: 4, cat: 'TM', q: 'Wie viel Schneidkantenhöhe bleibt mindestens, und wie oft kann man nachschleifen?',
              fields: [{ label: 'Mindestens verbleibende Schneidkantenhöhe', unit: 'mm', ans: 3, tol: 0.001, show: '3' }, { label: 'Anzahl möglicher Nachschliffe', unit: '', ans: 15, tol: 0.01, show: '15' }],
              e: '6 mm − 3 mm = 3 mm bleiben. 3 mm / 0,2 mm = 15 Nachschliffe.' }
          ] },
        { id: 'B7', ref: 'Blatt 1, 4', title: 'Skizze und Werkstoffe der Stempel', intro: 'Ein Lochstempel (Pos. 5) ist abgebrochen. Für die Ersatzteilfertigung wird eine Skizze gebraucht.',
          parts: [
            { id: 'a', type: 'sketch', pts: 6, cat: 'TK', q: 'Skizziere den Lochstempel (Pos. 5) mit Kopf in der <b>Vorderansicht</b>, ohne Bemaßung. Die Mittellinie liegt senkrecht.',
              crit: [{ t: 'Mittellinie als Strich-Punkt-Linie über die ganze Länge.', p: 2 }, { t: 'Kopf oben breiter als der Schaft, Schaft lang und schlank, Schneide unten scharfkantig (eben).', p: 2 }, { t: 'Breite Volllinien für Körperkanten, Proportionen ungefähr richtig.', p: 2 }],
              muster: `Lochstempel mit Kopf und Übergang zum Schneidteil. ${svgWmStempelSkizze()}` },
            { id: 'b', type: 'match', pts: 4, cat: 'TK', q: 'Ordne jedem Bauteil den Werkstoff aus der Stückliste zu.',
              rows: ['Schneidplatte (Pos. 10)', 'Lochstempel (Pos. 5)', 'Grundplatte (Pos. 11)', 'Führungsplatte (Pos. 8)'], options: ['X153CrMoV12', 'HS6-5-2C', 'S355J2', 'C45'], ans: [0, 1, 2, 3],
              e: 'Siehe Stückliste.' }
          ] },
        { id: 'B8', ref: 'Blatt 3', title: 'Prüfen der Schneidplatte', intro: 'Die fertige Schneidplatte wird geprüft. Nutze die Einzelteilzeichnung.',
          parts: [
            { id: 'a', type: 'num', pts: 4, cat: 'QS', q: 'Bestimme die Grenzmaße. Drei Nachkommastellen.',
              fields: [{ label: 'Durchbruch 40 +0,02/0: Höchstmaß', unit: 'mm', ans: 40.02, tol: 0.0005, show: '40,020' }, { label: 'Durchbruch 40 +0,02/0: Mindestmaß', unit: 'mm', ans: 40, tol: 0.0005, show: '40,000' },
                       { label: 'Abstand 32 ±0,01: Höchstmaß', unit: 'mm', ans: 32.01, tol: 0.0005, show: '32,010' }, { label: 'Abstand 32 ±0,01: Mindestmaß', unit: 'mm', ans: 31.99, tol: 0.0005, show: '31,990' }],
              e: 'Höchstmaß = Nennmaß + oberes Abmaß, Mindestmaß = Nennmaß + unteres Abmaß.' },
            { id: 'b', type: 'match', pts: 3, cat: 'QS', q: 'Messprotokoll: Sind die Istmaße in Ordnung?',
              rows: [`Durchbruch 40 +0,02/0 – Istmaß ${ist[0].val} mm`, `Abstand 32 ±0,01 – Istmaß ${ist[1].val} mm`, `Lochdurchbruch Ø6,6 +0,01/0 – Istmaß ${ist[2].val} mm`],
              options: ['i. O.', 'n. i. O.'], ans: ist.map(x => x.ok ? 0 : 1), keepOrder: true,
              e: 'Grenzmaße: 40,000 … 40,020 · 31,990 … 32,010 · 6,600 … 6,610 mm.' },
            { id: 'c', type: 'text', pts: 3, cat: 'QS', q: 'Wie prüfst du die Parallelität 0,01 mm der Oberseite zur Unterseite A?',
              crit: [{ t: 'Platte mit der Bezugsfläche A auf eine Messplatte legen.', p: 1 }, { t: 'Feinzeiger/Messuhr am Messstativ über die ganze Oberseite führen.', p: 1 }, { t: 'Größter minus kleinster Wert ≤ 0,01 mm → i. O.', p: 1 }],
              muster: 'Die Platte liegt mit der Unterseite A auf der Messplatte. Ein Feinzeiger am Stativ wird über die ganze Oberseite geführt. Die Differenz zwischen größtem und kleinstem Wert darf höchstens 0,01 mm sein.' }
          ] }
        ];
    }
};
