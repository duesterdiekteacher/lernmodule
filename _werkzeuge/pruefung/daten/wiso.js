/* ============================================================
   AP Teil 2 – Wirtschafts- und Sozialkunde (für IM und WM gleich)
   ============================================================ */
const EXAM = {
    id: 'wiso', key: 'ap2-wiso-1', summary: true,
    title: 'Wirtschafts- und Sozialkunde', subtitle: 'Abschlussprüfung Teil 2 · Industrie- und Werkzeugmechaniker/-in',
    logo: '⚖️', back: './', backLabel: '← Zurück zur Übersicht Teil 2',
    duration: 60, aAbw: 3, aWeight: 0.4, bAbw: 1, bWeight: 0.6,
    intro: `<h2>So läuft die Prüfung</h2>
    <ul class="steps">
      <li>Prüfungsbereich <b>Wirtschafts- und Sozialkunde</b>. Du hast <b>60 Minuten</b>. Die Uhr läuft oben rückwärts.</li>
      <li><b>Teil A:</b> 18 Aufgaben zum Ankreuzen. <b>3 Aufgaben musst du abwählen.</b> Sonst werden die letzten 3 nicht gewertet.</li>
      <li><b>Teil B:</b> 6 Aufgaben mit je 10 Punkten. <b>1 Aufgabe musst du abwählen.</b> Sonst wird die letzte nicht gewertet.</li>
      <li>Die Fälle spielen in einem Beispielbetrieb: Maschinenbau GmbH mit 85 Beschäftigten, davon 12 Auszubildende. Der Betrieb liegt in Bayern und ist an den Tarifvertrag der Metall- und Elektroindustrie gebunden.</li>
    </ul>
    <div class="info warn"><b>Hilfsmittel:</b> Taschenrechner. Gesetzestexte sind in der echten Prüfung nicht erlaubt.</div>
    <table class="tbl"><tr><th>Teil</th><th>Aufgaben</th><th>Punkte</th><th>Anteil</th></tr>
    <tr><td>A – gebunden</td><td>18, davon 3 abwählen</td><td>15 × 1 Punkt</td><td>40 %</td></tr>
    <tr><td>B – ungebunden</td><td>6, davon 1 abwählen</td><td>5 × 10 Punkte</td><td>60 %</td></tr></table>`,
    bIntro: '<p>Lies jeden Fall genau. Gib Zahlen mit Komma oder Punkt ein.</p>',
    docs: [],
    cats: { BB: 'Berufsausbildung', AR: 'Arbeits- und Tarifrecht', MB: 'Mitbestimmung', SV: 'Sozialversicherung und Lohn', UN: 'Betrieb und Unternehmen', WI: 'Wirtschaft', US: 'Umwelt- und Arbeitsschutz' },
    aDef: [
 { cat: 'BB', q: 'Wie lang muss die Probezeit in einem Berufsausbildungsverhältnis sein?',
   o: ['Mindestens 1 Monat, höchstens 4 Monate', 'Genau 6 Monate', 'Mindestens 3 Monate, höchstens 6 Monate', 'Höchstens 2 Wochen', 'Sie kann frei vereinbart werden.'],
   e: 'Das steht im Berufsbildungsgesetz (BBiG). In der Probezeit können beide jederzeit ohne Frist kündigen.' },
 { cat: 'BB', q: 'Wann kann ein Auszubildender nach der Probezeit mit einer Frist von vier Wochen kündigen?',
   o: ['Wenn er die Ausbildung aufgeben oder einen anderen Beruf erlernen will', 'Jederzeit ohne Grund', 'Nur wenn der Betrieb schließt', 'Nur mit Zustimmung der IHK', 'Gar nicht, nur fristlos'],
   e: 'Der Betrieb kann nach der Probezeit nur noch aus wichtigem Grund fristlos kündigen. Die Kündigung muss schriftlich erfolgen.' },
 { cat: 'BB', q: 'Was bedeutet <b>duale Berufsausbildung</b>?',
   o: ['Ausbildung an zwei Lernorten: im Betrieb und in der Berufsschule', 'Ausbildung in zwei Berufen gleichzeitig', 'Ausbildung mit zwei Abschlussprüfungen bei zwei Kammern', 'Ausbildung in zwei Betrieben', 'Ausbildung mit Studium'],
   e: 'Der Betrieb vermittelt vor allem die Praxis, die Berufsschule Theorie und Allgemeinbildung.' },
 { cat: 'BB', q: 'Welche Aufgabe hat die IHK als zuständige Stelle in der Ausbildung?',
   o: ['Sie überwacht die Ausbildung, führt das Verzeichnis der Ausbildungsverhältnisse und nimmt die Prüfungen ab.', 'Sie zahlt die Ausbildungsvergütung.', 'Sie stellt die Berufsschullehrer ein.', 'Sie schließt den Ausbildungsvertrag ab.', 'Sie legt die Höhe des Tariflohns fest.'],
   e: 'Die Kammer berät, überwacht und prüft. Den Vertrag schließen Betrieb und Auszubildender.' },
 { cat: 'AR', q: 'Wie lange darf ein 17-jähriger Auszubildender nach dem Jugendarbeitsschutzgesetz höchstens arbeiten?',
   o: ['8 Stunden am Tag und 40 Stunden in der Woche', '10 Stunden am Tag und 48 Stunden in der Woche', '6 Stunden am Tag und 30 Stunden in der Woche', '9 Stunden am Tag und 45 Stunden in der Woche', 'Das legt nur der Tarifvertrag fest.'],
   e: 'Für Jugendliche gelten strengere Grenzen als für Erwachsene.' },
 { cat: 'AR', q: 'Wie viel Mindesturlaub haben Erwachsene nach dem Bundesurlaubsgesetz?',
   o: ['24 Werktage', '30 Arbeitstage', '20 Werktage', '18 Werktage', '28 Werktage'],
   e: 'Werktage sind Montag bis Samstag. Bei einer 5-Tage-Woche sind das 20 Arbeitstage. Tarifverträge geben oft mehr.' },
 { cat: 'AR', q: 'Innerhalb welcher Frist muss eine Kündigungsschutzklage beim Arbeitsgericht erhoben werden?',
   o: ['Innerhalb von 3 Wochen nach Zugang der Kündigung', 'Innerhalb von 3 Monaten', 'Innerhalb von 1 Woche', 'Innerhalb von 6 Monaten', 'Es gibt keine Frist.'],
   e: 'Nach drei Wochen gilt die Kündigung als wirksam, wenn nicht geklagt wurde.' },
 { cat: 'AR', q: 'Was bedeutet <b>Friedenspflicht</b> bei Tarifverträgen?',
   o: ['Während der Laufzeit eines Tarifvertrags darf für dessen Inhalte nicht gestreikt werden.', 'Streiks sind in Deutschland verboten.', 'Der Betriebsrat darf nicht streiken.', 'Arbeitgeber dürfen nie aussperren.', 'Streit wird immer vor Gericht geklärt.'],
   e: 'Erst nach Ablauf und gescheiterten Verhandlungen sind Arbeitskampfmaßnahmen erlaubt.' },
 { cat: 'AR', q: 'Was besagt das <b>Günstigkeitsprinzip</b>?',
   o: ['Vom Tarifvertrag darf zugunsten des Arbeitnehmers abgewichen werden.', 'Der Arbeitgeber darf immer die günstigste Lösung wählen.', 'Der Tarifvertrag gilt nur, wenn er günstiger als das Gesetz ist.', 'Der günstigste Bewerber wird eingestellt.', 'Die Arbeitszeit muss möglichst günstig liegen.'],
   e: 'Ein Arbeitsvertrag darf z. B. mehr Lohn oder mehr Urlaub geben als der Tarifvertrag, aber nicht weniger.' },
 { cat: 'MB', q: 'Ab wie vielen Arbeitnehmern kann ein Betriebsrat gewählt werden?',
   o: ['Ab 5 ständigen wahlberechtigten Arbeitnehmern, von denen 3 wählbar sind', 'Ab 20 Arbeitnehmern', 'Ab 50 Arbeitnehmern', 'Ab 100 Arbeitnehmern', 'In jedem Betrieb, auch mit einem Arbeitnehmer'],
   e: 'Das regelt das Betriebsverfassungsgesetz.' },
 { cat: 'MB', q: 'Wer wählt die Jugend- und Auszubildendenvertretung (JAV)?',
   o: ['Arbeitnehmer unter 18 Jahren und Auszubildende unter 25 Jahren', 'Alle Arbeitnehmer des Betriebs', 'Nur der Betriebsrat', 'Nur die Ausbilder', 'Die Berufsschule'],
   e: 'Die JAV vertritt die Interessen der Jugendlichen und Auszubildenden gegenüber dem Betriebsrat.' },
 { cat: 'MB', q: 'Der Arbeitgeber kündigt, ohne den Betriebsrat vorher anzuhören. Was gilt?',
   o: ['Die Kündigung ist unwirksam.', 'Die Kündigung ist wirksam, der Betriebsrat kann nur protestieren.', 'Die Kündigung wird automatisch um einen Monat verschoben.', 'Der Betriebsrat muss die Kündigung nachträglich unterschreiben.', 'Das ist nur bei Auszubildenden erlaubt.'],
   e: 'Vor jeder Kündigung muss der Betriebsrat gehört werden. Sonst ist sie unwirksam.' },
 { cat: 'SV', q: 'Wer zahlt die Beiträge zur gesetzlichen Unfallversicherung?',
   o: ['Allein der Arbeitgeber an die Berufsgenossenschaft', 'Arbeitgeber und Arbeitnehmer je zur Hälfte', 'Allein der Arbeitnehmer', 'Der Staat aus Steuern', 'Die Krankenkasse'],
   e: 'Die Berufsgenossenschaft ist Träger. Sie kümmert sich auch um die Unfallverhütung.' },
 { cat: 'SV', q: 'Ist ein Unfall auf dem direkten Weg von der Wohnung zur Berufsschule versichert?',
   o: ['Ja, als Wegeunfall über die gesetzliche Unfallversicherung', 'Nein, nur Unfälle im Betrieb sind versichert.', 'Nur, wenn man mit dem Auto fährt.', 'Nur mit privater Unfallversicherung.', 'Nur in der Probezeit.'],
   e: 'Versichert sind Arbeit, Berufsschule und die direkten Wege dorthin.' },
 { cat: 'SV', q: 'Was bedeutet der <b>Generationenvertrag</b> in der Rentenversicherung?',
   o: ['Die heute Beschäftigten zahlen mit ihren Beiträgen die Renten der heutigen Rentner.', 'Jeder spart seine eigene Rente auf einem Konto an.', 'Kinder müssen ihre Eltern versorgen.', 'Die Rente wird nur aus Steuern bezahlt.', 'Rentner zahlen für die Jüngeren.'],
   e: 'Das nennt man Umlageverfahren.' },
 { cat: 'UN', q: 'Was trifft auf eine <b>GmbH</b> zu?',
   o: ['Die Gesellschaft haftet nur mit ihrem Gesellschaftsvermögen. Das Mindeststammkapital beträgt 25 000 €.', 'Die Gesellschafter haften unbeschränkt mit ihrem Privatvermögen.', 'Sie braucht mindestens 50 000 € Grundkapital und einen Aufsichtsrat.', 'Sie ist ein Einzelunternehmen.', 'Sie darf keine Mitarbeiter haben.'],
   e: 'GmbH = Gesellschaft mit beschränkter Haftung. Sie ist eine Kapitalgesellschaft.' },
 { cat: 'WI', q: 'Ein Betrieb will einen Auftrag mit möglichst <b>geringem Materialeinsatz</b> erfüllen. Welches Prinzip ist das?',
   o: ['Minimalprinzip', 'Maximalprinzip', 'Günstigkeitsprinzip', 'Solidaritätsprinzip', 'Verursacherprinzip'],
   e: 'Minimalprinzip: ein festes Ziel mit möglichst wenig Mitteln. Maximalprinzip: mit festen Mitteln möglichst viel erreichen.' },
 { cat: 'US', q: 'Was steht nach dem Kreislaufwirtschaftsgesetz an <b>erster</b> Stelle?',
   o: ['Abfälle vermeiden', 'Abfälle recyceln', 'Abfälle verbrennen', 'Abfälle deponieren', 'Abfälle exportieren'],
   e: 'Reihenfolge: Vermeidung – Vorbereitung zur Wiederverwendung – Recycling – sonstige Verwertung – Beseitigung.' }
    ],
    genA() { return null; },
    buildB(rngFor) {
        const r2 = rngFor('B2');
        const brutto = pick(r2, [3200, 3450, 3600, 3800]);
        const lst = Math.round(brutto * pick(r2, [0.105, 0.11, 0.115]));
        const kist = lst * 0.08, sv = brutto * 0.21, netto = brutto - lst - kist - sv;
        const euro = x => fmt(x, 2) + ' €';
        return [
        { id: 'B1', title: 'Der Ausbildungsvertrag', intro: 'Tim ist zu Beginn des Kalenderjahres 17 Jahre alt. Er beginnt eine Ausbildung zum Industriemechaniker. Sein Ausbildungsvertrag wird vorbereitet.',
          parts: [
            { id: 'a', type: 'match', pts: 4, cat: 'BB', q: 'Prüfe die Vertragsinhalte: Pflichtangabe oder unzulässig?',
              rows: ['Dauer der Probezeit', 'Höhe der Ausbildungsvergütung', 'Dauer des Urlaubs', 'Tim muss nach der Ausbildung 2 Jahre im Betrieb bleiben'],
              options: ['Pflichtangabe', 'unzulässig'], ans: [0, 0, 0, 1], keepOrder: true,
              e: 'Probezeit, Vergütung und Urlaub gehören zu den Mindestangaben. Eine Pflicht, nach der Ausbildung zu bleiben, ist nichtig.' },
            { id: 'b', type: 'num', pts: 3, cat: 'AR', q: 'Was gilt für Tim nach dem Jugendarbeitsschutzgesetz?',
              fields: [{ label: 'Mindesturlaub in diesem Jahr', unit: 'Werktage', ans: 25, tol: 0.01, show: '25' }, { label: 'höchstens Arbeitszeit am Tag', unit: 'Stunden', ans: 8, tol: 0.01, show: '8' }],
              e: 'Wer zu Jahresbeginn noch nicht 18 ist: mindestens 25 Werktage Urlaub. Höchstens 8 Stunden am Tag.' },
            { id: 'c', type: 'text', pts: 3, cat: 'BB', q: 'Nenne drei Pflichten, die Tim als Auszubildender hat.',
              crit: [{ t: 'Sich bemühen, die Fertigkeiten und Kenntnisse zu erwerben (Lernpflicht), aufgetragene Aufgaben sorgfältig ausführen.', p: 1 },
                     { t: 'Berufsschule besuchen und an Prüfungen teilnehmen.', p: 1 }, { t: 'Weisungen befolgen, Betriebsordnung beachten, Ausbildungsnachweis führen, Betriebsgeheimnisse wahren, Werkzeuge pfleglich behandeln (eine davon).', p: 1 }],
              muster: 'Tim muss lernen und die übertragenen Aufgaben sorgfältig erledigen. Er muss die Berufsschule besuchen und an Prüfungen teilnehmen. Er muss Weisungen befolgen, die Betriebsordnung beachten, den Ausbildungsnachweis führen und Betriebsgeheimnisse für sich behalten.' }
          ] },
        { id: 'B2', title: 'Die Lohnabrechnung', intro: `Ein Facharbeiter verdient <b>${fmtT(brutto)} €</b> brutto im Monat. Lohnsteuer laut Tabelle: <b>${lst} €</b>. Kirchensteuer in Bayern: <b>8 %</b> der Lohnsteuer. Solidaritätszuschlag fällt nicht an. Arbeitnehmeranteil zur Sozialversicherung: <b>zusammen 21 %</b> des Bruttolohns (Annahme für diese Aufgabe).`,
          parts: [
            { id: 'a', type: 'num', pts: 6, cat: 'SV', q: 'Berechne die Beträge. Zwei Nachkommastellen.',
              fields: [{ label: 'Kirchensteuer', unit: '€', ans: kist, tol: 0.011, show: fmt(kist, 2) }, { label: 'Sozialversicherung (AN-Anteil)', unit: '€', ans: sv, tol: 0.011, show: fmt(sv, 2) },
                       { label: 'Nettolohn', unit: '€', ans: netto, tol: 0.021, show: fmt(netto, 2) }],
              e: `Kirchensteuer = 8 % von ${lst} € = ${euro(kist)}. SV = 21 % von ${fmtT(brutto)} € = ${euro(sv)}. Netto = ${fmtT(brutto)} − ${lst} − ${fmt(kist, 2)} − ${fmt(sv, 2)} = ${euro(netto)}.` },
            { id: 'b', type: 'match', pts: 4, cat: 'SV', q: 'Ordne jedem Versicherungszweig den Träger zu.',
              rows: ['Krankenversicherung', 'Rentenversicherung', 'Arbeitslosenversicherung', 'Unfallversicherung'],
              options: ['Krankenkasse', 'Deutsche Rentenversicherung', 'Bundesagentur für Arbeit', 'Berufsgenossenschaft'], ans: [0, 1, 2, 3],
              e: 'Der fünfte Zweig ist die Pflegeversicherung mit den Pflegekassen.' }
          ] },
        { id: 'B3', title: 'Die Kündigung', intro: 'Herr Weber arbeitet seit 3 Jahren im Betrieb. Die Firma kündigt ihm ordentlich. Die Kündigung geht ihm am <b>10. März</b> zu. Im Arbeitsvertrag und im Tarifvertrag ist nichts anderes geregelt.',
          parts: [
            { id: 'a', type: 'select', pts: 4, cat: 'AR', q: 'Wann endet das Arbeitsverhältnis nach dem Gesetz (BGB)?',
              options: ['Am 30. April', 'Am 15. April', 'Am 10. April', 'Am 31. März', 'Am 30. Juni'], ans: 0,
              e: 'Nach zwei Jahren Betriebszugehörigkeit gilt bei Kündigung durch den Arbeitgeber: ein Monat zum Ende eines Kalendermonats. 10. März + 1 Monat = 10. April → zum Monatsende: 30. April.' },
            { id: 'b', type: 'select', pts: 2, cat: 'AR', q: 'Gilt für Herrn Weber das Kündigungsschutzgesetz?',
              options: ['Ja: Der Betrieb hat mehr als 10 Arbeitnehmer, und er ist länger als 6 Monate beschäftigt.', 'Nein, das gilt nur im öffentlichen Dienst.', 'Nein, erst ab 20 Jahren Betriebszugehörigkeit.', 'Nur wenn er Betriebsratsmitglied ist.'], ans: 0,
              e: 'Dann muss die Kündigung sozial gerechtfertigt sein.' },
            { id: 'c', type: 'text', pts: 4, cat: 'AR', q: 'Wann ist eine Kündigung sozial gerechtfertigt? Nenne die drei Arten von Gründen mit je einem Beispiel. Was muss bei verhaltensbedingten Gründen meist vorher passieren?',
              crit: [{ t: 'Personenbedingt, z. B. lange Krankheit, Verlust des Führerscheins bei Berufskraftfahrer.', p: 1 }, { t: 'Verhaltensbedingt, z. B. häufiges Zuspätkommen, Arbeitsverweigerung.', p: 1 },
                     { t: 'Betriebsbedingt, z. B. Auftragsmangel, Schließung einer Abteilung (mit Sozialauswahl).', p: 1 }, { t: 'Bei verhaltensbedingten Gründen vorher eine Abmahnung.', p: 1 }],
              muster: 'Eine Kündigung kann personenbedingt sein, z. B. bei langer Krankheit ohne Aussicht auf Besserung. Sie kann verhaltensbedingt sein, z. B. wenn jemand immer wieder zu spät kommt. Dann muss meist vorher abgemahnt werden. Oder sie ist betriebsbedingt, z. B. wenn Aufträge fehlen. Dann ist eine Sozialauswahl nötig.' }
          ] },
        { id: 'B4', title: 'Betriebsrat und JAV', intro: 'Im Betrieb arbeiten 85 Beschäftigte, darunter 12 Auszubildende unter 25 Jahren.',
          parts: [
            { id: 'a', type: 'select', pts: 2, cat: 'MB', q: 'Kann im Betrieb eine Jugend- und Auszubildendenvertretung gewählt werden?',
              options: ['Ja, weil es mindestens 5 Jugendliche oder Auszubildende unter 25 gibt und ein Betriebsrat besteht.', 'Nein, dafür braucht man mindestens 50 Auszubildende.', 'Nein, die JAV gibt es nur in Behörden.', 'Nur wenn der Arbeitgeber zustimmt.'], ans: 0,
              e: 'Die JAV wird gewählt, wenn es mindestens 5 solche Beschäftigte gibt. Sie arbeitet mit dem Betriebsrat zusammen.' },
            { id: 'b', type: 'match', pts: 4, cat: 'MB', q: 'Welches Recht hat der Betriebsrat in diesen Fällen?',
              rows: ['Beginn und Ende der täglichen Arbeitszeit werden geändert', 'Eine elektronische Zeiterfassung mit Leistungsauswertung wird eingeführt', 'Einem Mitarbeiter soll gekündigt werden', 'Eine neue Werkhalle wird geplant'],
              options: ['Mitbestimmungsrecht', 'Anhörungsrecht', 'Unterrichtungs- und Beratungsrecht'], ans: [0, 0, 1, 2],
              e: 'Bei Arbeitszeit und technischen Überwachungseinrichtungen bestimmt der Betriebsrat mit. Vor Kündigungen wird er angehört. Bei Bauvorhaben wird er unterrichtet und berät.' },
            { id: 'c', type: 'text', pts: 4, cat: 'MB', q: 'Nenne vier Aufgaben der Jugend- und Auszubildendenvertretung.',
              crit: [{ t: 'Maßnahmen beim Betriebsrat beantragen, die den Jugendlichen und Azubis dienen (z. B. Berufsbildung).', p: 1 }, { t: 'Darüber wachen, dass Gesetze, Tarifverträge und Betriebsvereinbarungen eingehalten werden (z. B. JArbSchG).', p: 1 },
                     { t: 'Anregungen und Beschwerden der Jugendlichen/Azubis aufnehmen und an den Betriebsrat weitergeben.', p: 1 }, { t: 'Gleichstellung und Integration fördern / an Betriebsratssitzungen teilnehmen.', p: 1 }],
              muster: 'Die JAV beantragt beim Betriebsrat Maßnahmen für die Jugendlichen und Azubis, z. B. zur Ausbildung. Sie achtet darauf, dass Gesetze und Tarifverträge eingehalten werden. Sie nimmt Anregungen und Beschwerden auf und gibt sie an den Betriebsrat weiter. Sie setzt sich für Gleichstellung und Integration ein und kann an Sitzungen des Betriebsrats teilnehmen.' }
          ] },
        { id: 'B5', title: 'Unternehmensformen', intro: 'Ein Werkzeugmacher-Meister will sich selbstständig machen. Er vergleicht Rechtsformen.',
          parts: [
            { id: 'a', type: 'match', pts: 4, cat: 'UN', q: 'Ordne jeder Rechtsform die Haftung zu.',
              rows: ['Einzelunternehmen (e. K.)', 'OHG – Gesellschafter', 'GmbH', 'KG – Kommanditist'],
              options: ['Der Inhaber haftet allein und unbeschränkt.', 'Alle Gesellschafter haften unbeschränkt und gesamtschuldnerisch.', 'Es haftet nur das Gesellschaftsvermögen.', 'Er haftet nur bis zur Höhe seiner Einlage.'], ans: [0, 1, 2, 3],
              e: 'Personengesellschaften haften meist persönlich. Bei Kapitalgesellschaften haftet die Gesellschaft.' },
            { id: 'b', type: 'select', pts: 2, cat: 'UN', q: 'Wie hoch ist das Mindestgrundkapital einer Aktiengesellschaft (AG)?',
              options: ['50 000 €', '25 000 €', '1 €', '100 000 €'], ans: 0,
              e: 'AG: 50 000 € Grundkapital. GmbH: 25 000 € Stammkapital.' },
            { id: 'c', type: 'text', pts: 4, cat: 'UN', q: 'Vergleiche Einzelunternehmen und GmbH: Nenne je einen Vorteil und je einen Nachteil.',
              crit: [{ t: 'Einzelunternehmen Vorteil: allein entscheiden, einfache Gründung, kein Mindestkapital.', p: 1 }, { t: 'Einzelunternehmen Nachteil: Haftung mit dem ganzen Privatvermögen, Kapital nur vom Inhaber.', p: 1 },
                     { t: 'GmbH Vorteil: Haftung beschränkt auf das Gesellschaftsvermögen.', p: 1 }, { t: 'GmbH Nachteil: 25 000 € Stammkapital, Notar und Handelsregister, mehr Aufwand und Kosten.', p: 1 }],
              muster: 'Einzelunternehmen: Der Meister entscheidet allein, und die Gründung ist einfach. Aber er haftet mit seinem ganzen Privatvermögen. GmbH: Die Haftung ist auf das Gesellschaftsvermögen beschränkt. Dafür braucht man 25 000 € Stammkapital, einen Notarvertrag und hat mehr Kosten für Buchführung.' }
          ] },
        { id: 'B6', title: 'Umweltschutz im Betrieb', intro: 'Im Betrieb fallen verschiedene Abfälle an. Die Werkstatt will umweltfreundlicher werden.',
          parts: [
            { id: 'a', type: 'match', pts: 4, cat: 'US', q: 'Wie werden diese Abfälle richtig entsorgt?',
              rows: ['Verbrauchte Kühlschmierstoff-Emulsion', 'Trockene Stahlspäne', 'Ölverschmierte Putzlappen', 'Kartons von Zulieferteilen'],
              options: ['Gefährlicher Abfall – Entsorgung durch Fachbetrieb', 'Wertstoff – Metallrecycling (Schrott)', 'Altpapier', 'Restmüll'], ans: [0, 1, 0, 2],
              e: 'Öl- und emulsionshaltige Abfälle sind gefährlich. Metalle und Papier werden recycelt.' },
            { id: 'b', type: 'order', pts: 3, cat: 'US', q: 'Bringe die Abfallhierarchie des Kreislaufwirtschaftsgesetzes in die richtige Reihenfolge.',
              items: ['Vermeidung', 'Vorbereitung zur Wiederverwendung', 'Recycling', 'Sonstige Verwertung, z. B. energetisch', 'Beseitigung'],
              e: 'Am besten ist, wenn Abfall gar nicht entsteht. Beseitigung ist die letzte Möglichkeit.' },
            { id: 'c', type: 'text', pts: 3, cat: 'US', q: 'Nenne drei Maßnahmen, mit denen die Werkstatt Energie sparen kann.',
              crit: [{ t: 'Maschinen und Licht abschalten, wenn sie nicht gebraucht werden (kein Leerlauf/Standby).', p: 1 }, { t: 'Druckluftleckagen suchen und beseitigen, Druck nicht höher als nötig.', p: 1 }, { t: 'Energiesparende Geräte/LED, Abwärme nutzen, Hallentore geschlossen halten (eine davon).', p: 1 }],
              muster: 'Maschinen, Absaugungen und Licht abschalten, wenn sie nicht gebraucht werden. Druckluftleckagen beseitigen und den Druck nicht höher einstellen als nötig. LED-Beleuchtung und sparsame Motoren nutzen, Abwärme der Kompressoren nutzen und Hallentore geschlossen halten.' }
          ] }
        ];
    }
};
