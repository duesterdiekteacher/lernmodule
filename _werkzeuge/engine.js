// =====================================================================
// Aufgaben-Engine für die Lernmodule (Aufbau wie die C#-Vorlage)
// Aufgabentypen: mc (Auswahl), num (Zahlen eingeben, auch mit Auswahlfeldern; tol = Spielraum),
//                match (Zuordnen), order (Reihenfolge)
// Eine Aufgabe ist ein Objekt oder eine Funktion, die ein Objekt liefert.
// Funktionen erzeugen bei jedem Öffnen neue Zahlen ("Neue Zahlen"-Knopf).
// Längen werden intern als ganze Zahlen in µm gespeichert (keine Rundungsfehler).
// Der Fortschritt wird im Browser gespeichert (localStorage) und nach einem Neuladen
// wiederhergestellt. Eigener Speicherplatz pro Datei, also pro Thema und Variante.
// =====================================================================

// Grundlagen-Module: Standard 1–4. Ein Thema kann in tasks.js BASIC_MODULES setzen (z. B. [1, 2, 3, 4, 5]).
const BASIC = (typeof BASIC_MODULES !== 'undefined') ? BASIC_MODULES : [1, 2, 3, 4];
let completedModules = new Set();
let basicQuizPassed = false;
let current = {};
let openNum = null;      // gerade geöffnetes Modul (oder null = Übersicht)

// ---------- Hilfsfunktionen ----------
function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rint(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function pickN(arr, n) { return shuffle(arr).slice(0, n); }

// µm -> "24,9" (mm). dec = Nachkommastellen, sonst so wenig wie nötig (mind. 1)
function mm(um, dec) {
    if (dec === undefined) {
        const a = Math.abs(um);
        dec = (a % 100 === 0) ? 1 : (a % 10 === 0) ? 2 : 3;
    }
    return (um < 0 ? '−' : '') + (Math.abs(um) / 1000).toFixed(dec).replace('.', ',');
}
// mit Vorzeichen: +0,2 / −0,1 / 0
function mmS(um, dec) { return um === 0 ? '0' : (um > 0 ? '+' : '') + mm(um, dec); }
// µm mit Vorzeichen: +15 / −7 / 0
function umS(v) { return v === 0 ? '0' : (v > 0 ? '+' : '−') + Math.abs(v); }
function num(n) { return String(n).replace('.', ','); }

function parseNum(s) {
    s = (s || '').trim().replace(/\s+/g, '').replace(/(mm|µm|um)$/i, '')
        .replace(/[−–]/g, '-').replace('±', '').replace(',', '.');
    if (!/^[+-]?(\d+\.?\d*|\.\d+)$/.test(s)) return NaN;
    return parseFloat(s);
}

const TYPE_LABEL = {
    mc: '✅ Auswählen',
    num: '🔢 Rechnen',
    match: '🔗 Zuordnen',
    order: '↕️ Reihenfolge'
};
const TYPE_NOTE = {
    mc: 'Klicke die richtige Antwort an.',
    num: 'Tippe deine Ergebnisse ein. Komma oder Punkt ist egal.',
    match: 'Wähle bei jeder Zeile die passende Antwort aus.',
    order: 'Bringe die Schritte mit ▲ und ▼ in die richtige Reihenfolge.'
};

// ---------- Aufgabe vorbereiten ----------
function resolveTask(def) {
    const generated = (typeof def === 'function');
    const t = generated ? def() : JSON.parse(JSON.stringify(def));
    t.regen = generated;
    if (t.type === 'match') {
        const items = (t.shuffle === false) ? t.items : shuffle(t.items);
        // Auswahlliste mischen, damit ihre Reihenfolge nicht die Lösung verrät.
        // Nicht bei nur 2 Möglichkeiten (z. B. richtig/falsch) oder mit keepOptionOrder: true.
        let opts = t.options;
        if (t.keepOptionOrder !== true && opts.length > 2) {
            const sol = items.map(it => it.answer).join('|');
            let k = 0;
            do { opts = shuffle(t.options); k++; }
            while (k < 20 && opts.slice(0, items.length).join('|') === sol);
        }
        t.fields = items.map(it => ({ label: it.left, kind: 'select', options: opts, ans: it.answer, errors: it.errors }));
    }
    // typische Fehlerwerte, die zufällig gleich der Lösung sind, entfernen
    (t.fields || []).forEach(f => { if (f.errors) f.errors = f.errors.filter(e => e.v !== f.ans); });
    if (t.type === 'order') {
        let cur;
        do { cur = shuffle(t.steps.map((s, k) => k)); } while (cur.every((v, k) => v === k));
        t.cur = cur;
    }
    return t;
}

function qDiv(n, i) { return document.querySelector('.quiz-question[data-module="' + n + '"][data-question="' + i + '"]'); }

// ---------- Darstellung ----------
function renderTask(n, i) {
    const t = current[n][i];
    const id = n + '_' + i;
    let h = '<div class="quiz-question task-' + t.type + '" data-module="' + n + '" data-question="' + i + '">';
    h += '<div class="task-head"><span class="task-type">' + TYPE_LABEL[t.type] + '</span>' +
         (t.book ? '<span class="task-book">📘 Tabellenbuch</span>' : '') + '</div>';
    h += '<p>' + (i + 1) + '. ' + t.q + '</p>';
    if (t.svg) h += '<div class="sketch">' + t.svg + '</div>';
    h += '<div class="task-note">' + (t.note || TYPE_NOTE[t.type]) + '</div>';

    if (t.type === 'mc') {
        t.options.forEach((opt, j) => {
            h += '<div class="quiz-option" onclick="answerMC(' + n + ',' + i + ',' + j + ')">' +
                 '<input type="radio" name="q' + id + '" id="q' + id + '_' + j + '">' +
                 '<label for="q' + id + '_' + j + '">' + opt + '</label></div>';
        });
    } else if (t.type === 'order') {
        h += '<ol class="order-list">';
        t.cur.forEach((si, pos) => {
            h += '<li class="order-item"><span class="order-text">' + t.steps[si] + '</span>' +
                 '<span class="order-btns">' +
                 '<button type="button" onclick="moveStep(' + n + ',' + i + ',' + pos + ',-1)" aria-label="nach oben"' + (pos === 0 ? ' disabled' : '') + '>▲</button>' +
                 '<button type="button" onclick="moveStep(' + n + ',' + i + ',' + pos + ',1)" aria-label="nach unten"' + (pos === t.cur.length - 1 ? ' disabled' : '') + '>▼</button>' +
                 '</span></li>';
        });
        h += '</ol>';
    } else {
        h += '<div class="fields">';
        t.fields.forEach((f, k) => {
            const fid = 'in' + id + '_' + k;
            h += '<div class="field-row" id="row' + id + '_' + k + '">' +
                 '<label class="field-label" for="' + fid + '">' + f.label + '</label><div class="field-input">';
            if (f.kind === 'select') {
                h += '<select id="' + fid + '"><option value="">– bitte wählen –</option>' +
                     f.options.map(o => '<option>' + o + '</option>').join('') + '</select>';
            } else {
                if (f.prefix) h += '<span class="field-pre">' + f.prefix + '</span>';
                h += '<input type="text" inputmode="decimal" autocomplete="off" id="' + fid + '"' +
                     ' onkeydown="if(event.key===\'Enter\')checkTask(' + n + ',' + i + ')">';
                h += '<span class="field-unit">' + f.unit + '</span>';
            }
            h += '</div><div class="field-msg"></div></div>';
        });
        h += '</div>';
    }

    h += '<div class="task-buttons">';
    if (t.type !== 'mc') h += '<button type="button" class="btn-check" onclick="checkTask(' + n + ',' + i + ')">Prüfen</button>';
    if (t.regen) h += '<button type="button" class="btn-new" onclick="newTask(' + n + ',' + i + ')">🎲 ' + (t.newLabel || (t.type === 'num' ? 'Neue Zahlen' : 'Neue Aufgabe')) + '</button>';
    h += '</div>';
    h += '<div class="quiz-feedback" data-feedback="' + n + '-' + i + '"></div></div>';
    return h;
}

function setResult(n, i, ok, extra) {
    const t = current[n][i];
    const qd = qDiv(n, i);
    const fb = qd.querySelector('.quiz-feedback');
    fb.classList.add('show');
    fb.classList.toggle('correct', ok);
    fb.classList.toggle('wrong', !ok);
    qd.classList.toggle('correct', ok);
    qd.classList.toggle('wrong', !ok);
    fb.innerHTML = ok ? '✓ Richtig! ' + t.explanation
                      : '✗ Noch nicht ganz richtig. ' + (extra || '') + 'Hinweis: ' + t.hint;
    if (ok) qd.querySelectorAll('input[type=text], select').forEach(el => el.disabled = true);
}

// ---------- Antworten prüfen ----------
function answerMC(n, i, j) {
    const t = current[n][i];
    const qd = qDiv(n, i);
    qd.querySelectorAll('input[type="radio"]').forEach((r, k) => { r.checked = (k === j); });
    t.picked = j;
    setResult(n, i, j === t.correct);
    saveState();
}

function checkTask(n, i) {
    const t = current[n][i];
    const qd = qDiv(n, i);
    let ok = true, empty = false;
    t.checked = true;

    if (t.type === 'order') {
        ok = t.cur.every((v, k) => v === k);
        qd.querySelectorAll('.order-item').forEach((li, pos) => {
            li.classList.toggle('ok', t.cur[pos] === pos);
            li.classList.toggle('bad', t.cur[pos] !== pos);
        });
        setResult(n, i, ok);
        saveState();
        return;
    }

    t.fields.forEach((f, k) => {
        const row = document.getElementById('row' + n + '_' + i + '_' + k);
        const el = row.querySelector('input, select');
        const msgEl = row.querySelector('.field-msg');
        let good = false, msg = '';
        if (f.kind === 'select') {
            if (!el.value) { msg = 'Bitte wähle etwas aus.'; empty = true; }
            else {
                good = (el.value === f.ans);
                const e = !good && f.errors && f.errors.find(e => e.v === el.value);
                if (e) msg = e.msg;
            }
        } else {
            const v = parseNum(el.value);
            if (el.value.trim() === '') { msg = 'Bitte trage eine Zahl ein.'; empty = true; }
            else if (isNaN(v)) { msg = 'Das ist keine Zahl. Beispiel: 24,98'; }
            else {
                // scale: Stellen der Prüfung (Standard 1000 = drei Nachkommastellen; ans und tol in derselben Stufe)
                let x = (f.unit === 'µm') ? Math.round(v) : Math.round(v * (f.scale || 1000));
                if (f.prefix === '±') x = Math.abs(x);
                // tol: erlaubter Spielraum (gleiche Einheit wie ans), z. B. für Werte aus verschiedenen Tabellenbüchern
                good = f.tol ? Math.abs(x - f.ans) <= f.tol
                             : (x === f.ans) && (f.unit !== 'µm' || Math.abs(v - Math.round(v)) < 1e-9);
                if (!good) {
                    const e = f.errors && f.errors.find(e => e.v === x);
                    if (e) msg = e.msg;
                    else if (f.positive && x === -f.ans) msg = 'Die Toleranz ist immer positiv.';
                }
            }
        }
        row.classList.toggle('ok', good);
        row.classList.toggle('bad', !good);
        msgEl.textContent = msg;
        if (!good) ok = false;
    });
    setResult(n, i, ok, empty ? 'Es fehlen noch Eingaben. ' : '');
    saveState();
}

function moveStep(n, i, pos, dir) {
    const t = current[n][i];
    const p2 = pos + dir;
    if (p2 < 0 || p2 >= t.cur.length) return;
    [t.cur[pos], t.cur[p2]] = [t.cur[p2], t.cur[pos]];
    t.checked = false;
    qDiv(n, i).outerHTML = renderTask(n, i);
    saveState();
}

function newTask(n, i) {
    current[n][i] = resolveTask(TASKS[n][i]);
    qDiv(n, i).outerHTML = renderTask(n, i);
    saveState();
}

// ---------- Module öffnen und abschließen ----------
function openModule(moduleNum) {
    if (moduleNum > BASIC.length && !basicQuizPassed) {
        alert('🔒 Dieses Modul ist noch gesperrt. Schließe zuerst die Module 1 bis ' + BASIC.length + ' ab!');
        return;
    }
    current = {};
    current[moduleNum] = TASKS[moduleNum].map(resolveTask);
    showModule(moduleNum);
    window.scrollTo(0, 0);
    saveState();
}

function showModule(moduleNum) {
    openNum = moduleNum;
    document.getElementById('module-grid').style.display = 'none';
    const module = modules[moduleNum];

    let html = '<div class="module-content active">' +
               '<h2>' + module.title + '</h2>' + module.content +
               '<div class="quiz-section"><h3>📝 Verständnis-Check</h3>';
    for (let i = 0; i < current[moduleNum].length; i++) html += renderTask(moduleNum, i);
    html += '</div>' +
            '<button class="btn btn-back" onclick="backToOverview()">← Übersicht</button>' +
            '<button class="btn" onclick="completeModule(' + moduleNum + ')">Modul abschließen →</button>' +
            '</div>';
    document.getElementById('module-content-container').innerHTML = html;
}

function completeModule(moduleNum) {
    for (let i = 0; i < current[moduleNum].length; i++) {
        const qd = qDiv(moduleNum, i);
        if (!qd || !qd.classList.contains('correct')) {
            alert('Aufgabe ' + (i + 1) + ' ist noch nicht richtig gelöst. Löse zuerst alle Aufgaben. Dann kannst du das Modul abschließen.');
            qd.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
    }
    completedModules.add(moduleNum);
    checkUnlocks();
    updateProgress();
    saveState();
    alert('🎉 Modul ' + moduleNum + ' geschafft!');
    backToOverview();
}

function backToOverview() {
    openNum = null;
    current = {};
    document.getElementById('module-grid').style.display = 'grid';
    document.getElementById('module-content-container').innerHTML = '';
    window.scrollTo(0, 0);
    saveState();
}

function checkUnlocks(silent) {
    if (BASIC.every(m => completedModules.has(m)) && !basicQuizPassed) {
        basicQuizPassed = true;
        const profi = Object.keys(modules).map(Number).filter(m => m > BASIC.length);
        if (!silent) alert('🔓 Super! Du hast die Grundlagen geschafft. Die Profi-Module ' +
                         (profi.length > 1 ? profi.slice(0, -1).join(', ') + ' und ' + profi[profi.length - 1] : profi.join('')) + ' sind jetzt frei!');
        profi.forEach(m => {
            const card = document.getElementById('card-' + m);
            card.classList.remove('locked');
            card.querySelector('.module-description').textContent = UNLOCK_TEXT[m];
        });
    }
}

function updateProgress() {
    const total = Object.keys(modules).length;
    const bar = document.getElementById('progress');
    bar.style.width = (completedModules.size / total * 100) + '%';
    bar.textContent = completedModules.size + ' von ' + total + ' Modulen abgeschlossen';
    completedModules.forEach(m => {
        const card = document.getElementById('card-' + m);
        if (card) card.classList.add('completed');
    });
    if (completedModules.size === total) document.getElementById('badge').classList.add('show');
}

// ---------- Fortschritt speichern und wiederherstellen ----------
// Alles bleibt nur im Browser dieses Geräts. Nichts wird verschickt.
// Der Schlüssel enthält den Pfad der Datei (Thema + Variante) und einen Fingerabdruck
// der Aufgaben. Ändern sich Module oder Aufgabenzahl, wird ein alter Stand ignoriert.
const STORE_KEY = 'lernmodule:' + location.pathname + ':' +
    Object.keys(TASKS).map(n => n + '.' + TASKS[n].length).join('-') + ':b' + BASIC.length;
let restoring = false;
let resetting = false;   // beim Zurücksetzen nichts mehr speichern

function storageGet() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || 'null'); } catch (e) { return null; }
}
function storageSet(v) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(v)); return true; } catch (e) { return false; }
}

// Eingaben aus den Feldern in die Aufgaben-Objekte übernehmen
function captureInputs() {
    if (openNum === null || !current[openNum]) return;
    current[openNum].forEach((t, i) => {
        if (!t.fields) return;
        t.vals = t.fields.map((f, k) => {
            const el = document.getElementById('in' + openNum + '_' + i + '_' + k);
            return el ? el.value : '';
        });
    });
}

function saveState() {
    if (restoring || resetting) return;
    captureInputs();
    storageSet({
        v: 1,
        done: Array.from(completedModules),
        open: openNum,
        tasks: openNum !== null ? current[openNum] : null,
        y: openNum !== null ? Math.round(window.scrollY) : 0
    });
}

function restoreTask(n, i) {
    const t = current[n][i];
    const qd = qDiv(n, i);
    if (!qd) return;
    if (t.type === 'mc') {
        if (typeof t.picked === 'number') answerMC(n, i, t.picked);
        return;
    }
    if (t.vals) t.vals.forEach((val, k) => {
        const el = document.getElementById('in' + n + '_' + i + '_' + k);
        if (el) el.value = val;
    });
    if (t.checked) checkTask(n, i);
}

function restoreState() {
    const st = storageGet();
    if (!st || st.v !== 1) return false;
    restoring = true;
    try {
        (st.done || []).forEach(m => { if (modules[m]) completedModules.add(m); });
        checkUnlocks(true);
        updateProgress();
        const n = st.open;
        if (n !== null && modules[n] && Array.isArray(st.tasks) && st.tasks.length === TASKS[n].length &&
            (n <= BASIC.length || basicQuizPassed)) {
            current = {};
            current[n] = st.tasks;
            showModule(n);
            for (let i = 0; i < st.tasks.length; i++) restoreTask(n, i);
            window.scrollTo(0, st.y || 0);
        }
    } catch (e) {
        // Gespeicherter Stand passt nicht: neu anfangen
        completedModules = new Set();
        basicQuizPassed = false;
        current = {};
        backToOverviewSilent();
    }
    restoring = false;
    saveState();
    return completedModules.size > 0 || openNum !== null;
}

function backToOverviewSilent() {
    openNum = null;
    document.getElementById('module-grid').style.display = 'grid';
    document.getElementById('module-content-container').innerHTML = '';
}

function resetProgress() {
    if (!confirm('Willst du wirklich von vorne anfangen? Dein ganzer Fortschritt in diesem Lernmodul wird gelöscht.')) return;
    resetting = true;
    try { localStorage.removeItem(STORE_KEY); } catch (e) {}
    location.reload();
}

function showToast(text) {
    const el = document.createElement('div');
    el.className = 'save-toast';
    el.textContent = text;
    document.body.appendChild(el);
    setTimeout(() => el.classList.add('hide'), 3500);
    setTimeout(() => el.remove(), 4200);
}

(function initSaving() {
    const css = document.createElement('style');
    css.textContent =
        '.save-bar{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px;' +
        'margin:-15px 0 25px 0;font-size:15px;color:#94a3b8;}' +
        '.save-bar button{background:transparent;color:#94a3b8;border:1px solid #475569;border-radius:8px;' +
        'padding:8px 14px;font-size:15px;cursor:pointer;}' +
        '.save-bar button:hover{color:#f8fafc;border-color:#94a3b8;}' +
        '.save-toast{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:1000;width:max-content;' +
        'background:#1e293b;color:#f8fafc;border:2px solid #10b981;border-radius:10px;padding:14px 20px;' +
        'font-size:16px;box-shadow:0 8px 24px rgba(0,0,0,.4);transition:opacity .6s;max-width:calc(100% - 32px);text-align:center;}' +
        '.save-toast.hide{opacity:0;}';
    document.head.appendChild(css);

    // Prüfen, ob der Browser speichern darf
    let canSave = false;
    try { localStorage.setItem('lernmodule:test', '1'); localStorage.removeItem('lernmodule:test'); canSave = true; } catch (e) {}

    const bar = document.querySelector('.progress-bar');
    if (canSave && bar) {
        const info = document.createElement('div');
        info.className = 'save-bar';
        info.innerHTML = '<span>💾 Dein Fortschritt wird auf diesem Gerät gespeichert.</span>' +
                         '<button type="button" onclick="resetProgress()">↺ Von vorne anfangen</button>';
        bar.insertAdjacentElement('afterend', info);
    }
    if (!canSave) return;

    // Eingaben merken, auch bevor "Prüfen" gedrückt wird
    let timer = null;
    document.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(saveState, 400); });
    document.addEventListener('change', saveState);
    let sTimer = null;
    window.addEventListener('scroll', () => {
        if (openNum === null) return;
        clearTimeout(sTimer); sTimer = setTimeout(saveState, 500);
    }, { passive: true });
    window.addEventListener('pagehide', saveState);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') saveState(); });

    if (restoreState()) showToast('👋 Willkommen zurück! Dein Fortschritt ist wieder da.');
})();
