/* ============================================================
   Prüfungs-Engine (gemeinsam für alle Prüfungssimulationen)
   Erwartet ein globales Objekt EXAM (siehe daten/*.js)
   ============================================================ */
const KEY = EXAM.key;
const DURATION = EXAM.duration * 60 * 1000;
const NA = EXAM.aDef.length;
let state = null;
function rngFor(key) { return mulberry(hashStr(state.seed + ':' + key)); }
function load() { try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.seed) return s; } catch (e) {} return null; }
function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
function freshState() { return { seed: String(Date.now()) + Math.floor(Math.random() * 1e6), phase: 'exam', start: Date.now(), ansA: {}, abw: [], abwB: [], ansB: {}, self: {}, timeUp: false }; }

/* ---------- Teil A ---------- */
let A = [];
function buildA() {
    A = EXAM.aDef.map((d, idx) => {
        const nr = idx + 1;
        const base = d.gen ? EXAM.genA(nr, rngFor('A' + nr)) : { q: d.q, o: d.o, e: d.e };
        const order = shuffle(rngFor('Aorder' + nr), base.o.map((_, k) => k));
        return { nr, cat: d.cat, lock: !!d.lock, ref: base.ref || d.ref || '', img: !!(base.img || d.img), q: base.q, opts: order.map(k => base.o[k]), correct: order.indexOf(0), e: base.e };
    });
}
/* ---------- Teil B ---------- */
let B = [];
function buildB() { B = EXAM.buildB(rngFor); }

/* ---------- Overlay Unterlagen ---------- */
const DOCS = EXAM.docs || [];
let ovTab = DOCS.length ? (DOCS[1] || DOCS[0]).id : null, zoom = 1;
const zoomByTab = {};
function renderOv() {
    $('ovTabs').innerHTML = DOCS.map(t => `<button class="tab ${t.id === ovTab ? 'on' : ''}" data-ov="${t.id}">${t.label}</button>`).join('');
    const t = DOCS.find(x => x.id === ovTab);
    $('ovBody').innerHTML = t.svg ? `<div class="paper" data-zoom>${t.html()}</div>` : t.html();
    zoom = zoomByTab[ovTab] || 1; applyZoom();
    document.querySelector('.zoomctl').style.visibility = t.svg ? 'visible' : 'hidden';
}
function applyZoom() {
    const p = $('ovBody').querySelector('[data-zoom]');
    if (p) { p.style.width = (zoom * 100) + '%'; p.style.maxWidth = (zoom * 1000) + 'px'; }
    $('zVal').textContent = Math.round(zoom * 100) + ' %';
}
function openOv() { renderOv(); $('ov').classList.remove('hidden'); document.body.style.overflow = 'hidden'; }
function closeOv() { $('ov').classList.add('hidden'); document.body.style.overflow = ''; }
function toggleOv() { if ($('ov').classList.contains('hidden')) openOv(); else closeOv(); }

/* ---------- Ansicht ---------- */
function show(id) { ['scrStart', 'scrExam', 'scrSelf', 'scrResult'].forEach(s => $(s).classList.toggle('hidden', s !== id)); $('bar').classList.toggle('hidden', id !== 'scrExam'); window.scrollTo(0, 0); }
function setPart(p) {
    $('partA').classList.toggle('hidden', p !== 'A'); $('partB').classList.toggle('hidden', p !== 'B');
    document.querySelectorAll('#partTabs .tab').forEach(b => b.classList.toggle('on', b.dataset.part === p));
    window.scrollTo(0, 0);
}
function lockLabel(cat) { return cat === 'TM' ? 'Mathematik' : cat === 'TK' ? 'Techn. Kommunikation' : (EXAM.cats[cat] || ''); }
function renderA() {
    $('listA').innerHTML = A.map(a => `
    <div class="qa" id="qa-${a.nr}">
      <div class="qhead"><span class="qnr">Aufgabe ${a.nr}</span>
        ${a.lock ? `<span class="badge lock">🔒 nicht abwählbar · ${lockLabel(a.cat)}</span>` : `<button class="abw-btn" data-abw="${a.nr}">Abwählen</button>`}
      </div>
      ${a.ref ? `<div class="ref">📐 ${a.ref}</div>` : ''}<div class="qtext">${a.q}</div>
      <div class="opts ${a.img ? 'imgopts' : ''}">${a.opts.map((o, k) => `<label class="opt" data-q="${a.nr}" data-k="${k}"><input type="radio" name="a${a.nr}"><span class="onr">${k + 1}</span><span>${o}</span></label>`).join('')}</div>
    </div>`).join('');
    refreshA();
}
function refreshA() {
    A.forEach(a => {
        document.querySelectorAll(`[data-q="${a.nr}"]`).forEach(l => l.classList.toggle('sel', state.ansA[a.nr] === Number(l.dataset.k)));
        const struck = state.abw.includes(a.nr);
        $('qa-' + a.nr).classList.toggle('struck', struck);
        const b = document.querySelector(`[data-abw="${a.nr}"]`);
        if (b) { b.classList.toggle('on', struck); b.textContent = struck ? 'Abgewählt ✓ (rückgängig)' : 'Abwählen'; }
    });
    $('abwCount').textContent = state.abw.length;
    $('sheet').innerHTML = A.map(a => `<div class="cell ${state.abw.includes(a.nr) ? 'abw' : (state.ansA[a.nr] !== undefined ? 'ans' : '')}" data-go="${a.nr}">${a.nr}${a.lock ? '<span class="lk">🔒</span>' : ''}</div>`).join('');
    updStat();
}
function pKey(t, p) { return t.id + p.id; }
function selOrder(key, p) { return shuffle(rngFor('s' + key), p.options.map((_, i) => i)); }
function initOrder(key, p) { let o, tries = 0; do { o = shuffle(rngFor('o' + key + tries), p.items.map((_, i) => i)); tries++; } while (o.every((k, i) => k === i) && tries < 10); return o; }
function numOk(f, val) {
    const ok = x => !isNaN(x) && Math.abs(x - f.ans) <= f.tol + 1e-9;
    if (ok(parseNum(val))) return true;
    const t = String(val || '').trim().replace(/\s/g, '');
    return /^-?\d{1,3}(\.\d{3})+$/.test(t) && ok(Number(t.replace(/\./g, ''))); // Tausenderpunkt, z. B. 1.768
}
function selfPts(key, p) { const s = state.self[key] || []; return p.crit.reduce((sum, c, i) => sum + (s[i] ? c.p : 0), 0); }
function partHtml(t, p, mode) {
    const key = pKey(t, p), v = state.ansB[key];
    const ro = mode !== 'exam' ? 'disabled' : '';
    let h = `<div class="part"><span class="pp">${p.pts} P.</span><span class="pl">${p.id})</span>${p.q}`;
    if (p.type === 'num') {
        h += p.fields.map((f, i) => {
            const val = v && v[i] !== undefined ? v[i] : '';
            let fb = '';
            if (mode === 'review') fb = numOk(f, val) ? ' <span class="ok">✔</span>' : ` <span class="bad">✘ richtig: ${f.show} ${f.unit}</span>`;
            return `<div class="numrow"><label>${f.label}</label><input class="inp" inputmode="decimal" data-key="${key}" data-i="${i}" value="${esc(val)}" ${ro}> <span>${f.unit}</span>${fb}</div>`;
        }).join('');
    } else if (p.type === 'select') {
        h += `<div class="opts" style="margin-top:.5rem">${selOrder(key, p).map((k, pos) => {
            let cls = v === k ? 'sel' : '';
            if (mode === 'review') { if (k === p.ans) cls += ' right'; else if (v === k) cls += ' wrong'; }
            return `<label class="opt ${cls}" data-skey="${key}" data-k="${k}"><input type="radio"><span class="onr">${pos + 1}</span><span>${p.options[k]}</span></label>`;
        }).join('')}</div>`;
    } else if (p.type === 'order') {
        const ord = v || initOrder(key, p);
        h += `<ol class="ord">${ord.map((k, i) => {
            const fb = mode === 'review' ? (k === i ? ' <span class="ok">✔</span>' : ` <span class="bad">✘ (Platz ${k + 1})</span>`) : '';
            return `<li><span class="n">${i + 1}.</span><span class="t">${p.items[k]}${fb}</span>${mode === 'exam' ? `<button data-up="${key}" data-i="${i}" aria-label="nach oben">▲</button><button data-down="${key}" data-i="${i}" aria-label="nach unten">▼</button>` : ''}</li>`;
        }).join('')}</ol>`;
    } else if (p.type === 'match') {
        const optOrder = p.keepOrder ? p.options.map((_, i) => i) : shuffle(rngFor('m' + key), p.options.map((_, i) => i));
        h += p.rows.map((row, i) => {
            const val = v && v[i] !== undefined ? v[i] : -1;
            const fb = mode === 'review' ? (val === p.ans[i] ? ' <span class="ok">✔</span>' : ` <span class="bad">✘ richtig: ${p.options[p.ans[i]]}</span>`) : '';
            return `<div class="mrow"><span class="ml">${row}</span><select class="sel" data-mkey="${key}" data-i="${i}" ${ro}><option value="-1">– bitte wählen –</option>${optOrder.map(k => `<option value="${k}" ${val === k ? 'selected' : ''}>${p.options[k]}</option>`).join('')}</select>${fb}</div>`;
        }).join('');
    } else if (p.type === 'sketch') {
        if (mode === 'exam') h += `<div class="info">✏️ Skizziere auf Papier (Bleistift, Lineal). Nach der Abgabe vergleichst du deine Skizze mit der Musterlösung.</div><label class="crit"><input type="checkbox" data-sketch="${key}" ${v ? 'checked' : ''}><span>Meine Skizze ist fertig.</span></label>`;
        else h += `<div class="muster"><b>Musterlösung:</b> ${p.muster}</div><p class="expl">Selbstbewertung: ${selfPts(key, p)} von ${p.pts} Punkten</p>`;
    } else if (p.type === 'text') {
        if (mode === 'exam') h += `<textarea class="inp" data-tkey="${key}" placeholder="Deine Antwort in kurzen Sätzen …" style="margin-top:.5rem">${esc(v || '')}</textarea>`;
        else h += `<div class="yours">${esc(v || '(keine Antwort)')}</div><div class="muster"><b>Musterlösung:</b> ${p.muster}</div><p class="expl">Selbstbewertung: ${selfPts(key, p)} von ${p.pts} Punkten</p>`;
    }
    if (mode === 'review' && p.e) h += `<p class="expl">💡 ${p.e}</p>`;
    return h + '</div>';
}
function bHead(t) {
    const abwOk = EXAM.bAbw > 0;
    return `<div class="qhead"><span class="qnr">Aufgabe ${t.id} – ${t.title}</span>${abwOk ? `<button class="abw-btn" data-abwb="${t.id}">Abwählen</button>` : `<span class="badge">${tPts(t)} Punkte</span>`}</div>`;
}
function tPts(t) { return t.parts.reduce((s, p) => s + p.pts, 0); }
function renderB() {
    $('listB').innerHTML = B.map(t => `<div class="qa" id="qb-${t.id}">${bHead(t)}${t.ref ? `<div class="ref">📐 ${t.ref}</div>` : ''}<div class="qtext">${t.intro}</div>${t.parts.map(p => partHtml(t, p, 'exam')).join('')}</div>`).join('');
    refreshB();
}
function refreshB() {
    if (!EXAM.bAbw) return;
    B.forEach(t => {
        const struck = state.abwB.includes(t.id);
        $('qb-' + t.id).classList.toggle('struck', struck);
        const b = document.querySelector(`[data-abwb="${t.id}"]`);
        if (b) { b.classList.toggle('on', struck); b.textContent = struck ? 'Abgewählt ✓ (rückgängig)' : 'Abwählen'; }
    });
    $('abwBCount').textContent = state.abwB.length;
    updStat();
}
function updStat() {
    const a = Object.keys(state.ansA).length;
    let bDone = 0, bAll = 0;
    B.forEach(t => t.parts.forEach(p => { bAll++; const v = state.ansB[pKey(t, p)]; if (v !== undefined && v !== '' && !(Array.isArray(v) && v.every(x => x === '' || x === -1 || x === undefined))) bDone++; }));
    $('stat').textContent = `A: ${a}/${NA} · ${state.abw.length}/${EXAM.aAbw} abgewählt · B: ${bDone}/${bAll} Teilaufgaben`;
}

/* ---------- Timer ---------- */
let tick = null, warned = {};
function remaining() { return state.start + DURATION - Date.now(); }
function runTimer() {
    clearInterval(tick);
    const upd = () => {
        const ms = remaining();
        if (ms <= 0) { $('timer').textContent = '00:00'; clearInterval(tick); state.timeUp = true; finishExam(true); return; }
        const sec = Math.ceil(ms / 1000), mm = Math.floor(sec / 60), ss = sec % 60;
        $('timer').textContent = String(mm).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
        $('timer').className = 'timer' + (mm < 5 ? ' red' : mm < 15 ? ' yellow' : '');
        [30, 10, 5].forEach(w => { if (mm === w - 1 && ss > 50 && !warned[w]) { warned[w] = 1; toast(`Noch ${w} Minuten!`); } });
    };
    upd(); tick = setInterval(upd, 1000);
}
let toastT = null;
function toast(msg) { const t = $('toast'); t.textContent = msg; t.classList.remove('hidden'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.add('hidden'), 3500); }
function modal(html) { $('modalCard').innerHTML = html; $('modal').classList.remove('hidden'); }
function closeModal() { $('modal').classList.add('hidden'); }

/* ---------- Bewertung ---------- */
function effectiveAbw() {
    const abw = state.abw.slice();
    for (let n = NA; n >= 1 && abw.length < EXAM.aAbw; n--) { const a = A[n - 1]; if (!a.lock && !abw.includes(n)) abw.push(n); }
    return abw;
}
function effectiveAbwB() {
    const abw = (state.abwB || []).slice();
    for (let i = B.length - 1; i >= 0 && abw.length < (EXAM.bAbw || 0); i--) { if (!abw.includes(B[i].id)) abw.push(B[i].id); }
    return abw;
}
function partScore(t, p) {
    const key = pKey(t, p), v = state.ansB[key];
    if (p.type === 'num') { const per = p.pts / p.fields.length; return p.fields.reduce((s, f, i) => s + (v && numOk(f, v[i]) ? per : 0), 0); }
    if (p.type === 'select') return v === p.ans ? p.pts : 0;
    if (p.type === 'order') { if (!v) return 0; const c = v.filter((k, i) => k === i).length; return Math.round(p.pts * c / v.length * 2) / 2; }
    if (p.type === 'match') { const per = p.pts / p.rows.length; return p.rows.reduce((s, _, i) => s + (v && v[i] === p.ans[i] ? per : 0), 0); }
    if (p.type === 'text' || p.type === 'sketch') return selfPts(key, p);
    return 0;
}
const DEZ = { 100: '1,0', 99: '1,1', 98: '1,1', 97: '1,2', 96: '1,2', 95: '1,3', 94: '1,3', 93: '1,4', 92: '1,4', 91: '1,5', 90: '1,6', 89: '1,7', 88: '1,8', 87: '1,9', 86: '2,0', 85: '2,0', 84: '2,1', 83: '2,2', 82: '2,3', 81: '2,4', 80: '2,5', 79: '2,5', 78: '2,6', 77: '2,7', 76: '2,8', 75: '2,8', 74: '2,9', 73: '3,0', 72: '3,0', 71: '3,1', 70: '3,2', 69: '3,3', 68: '3,3', 67: '3,4', 66: '3,5', 65: '3,5', 64: '3,6', 63: '3,6', 62: '3,7', 61: '3,8', 60: '3,8', 59: '3,9', 58: '3,9', 57: '4,0', 56: '4,0', 55: '4,1', 54: '4,2', 53: '4,2', 52: '4,3', 51: '4,3', 50: '4,4', 49: '4,5', 48: '4,5', 47: '4,6', 46: '4,6', 45: '4,7', 44: '4,7', 43: '4,8', 42: '4,8', 41: '4,9', 40: '4,9', 39: '5,0', 38: '5,0', 37: '5,1', 36: '5,1', 35: '5,2', 34: '5,2', 33: '5,3', 32: '5,3', 31: '5,4', 30: '5,4' };
function dezNote(p) { if (p >= 30) return DEZ[p]; if (p >= 25) return '5,5'; if (p >= 20) return '5,6'; if (p >= 15) return '5,7'; if (p >= 10) return '5,8'; if (p >= 5) return '5,9'; return '6,0'; }
function note(p) { if (p >= 92) return [1, 'sehr gut']; if (p >= 81) return [2, 'gut']; if (p >= 67) return [3, 'befriedigend']; if (p >= 50) return [4, 'ausreichend']; if (p >= 30) return [5, 'mangelhaft']; return [6, 'ungenügend']; }
function computeScore() {
    const abw = effectiveAbw(), abwB = effectiveAbwB();
    const cat = {}; const add = (k, g, m) => { cat[k] = cat[k] || [0, 0]; cat[k][0] += g; cat[k][1] += m; };
    let aPts = 0; const aMax = NA - EXAM.aAbw;
    A.forEach(a => { if (abw.includes(a.nr)) return; const ok = state.ansA[a.nr] === a.correct; if (ok) aPts++; add(a.cat, ok ? 1 : 0, 1); });
    let bPts = 0, bMax = 0;
    B.forEach(t => { if (abwB.includes(t.id)) return; t.parts.forEach(p => { const s = partScore(t, p); bPts += s; bMax += p.pts; add(p.cat, s, p.pts); }); });
    const sA = aPts / aMax * EXAM.aWeight * 100, sB = bPts / bMax * EXAM.bWeight * 100, total = sA + sB;
    return { abw, abwB, aPts, aMax, bPts, bMax, sA, sB, total, rounded: Math.round(total), cat };
}

function finishExam(timeUp) {
    clearInterval(tick); closeOv();
    state.phase = 'self'; state.endTime = state.endTime || Math.min(Date.now(), state.start + DURATION); save();
    renderSelf(); show('scrSelf');
    if (timeUp) { modal(`<h2>⏰ Die Zeit ist um!</h2><p>Deine Prüfung wurde automatisch abgegeben. Jetzt bewertest du deine Textantworten selbst.</p><div class="row" style="margin-top:1rem"><button class="btn" id="mOk">OK</button></div>`); $('mOk').onclick = closeModal; }
}
function renderSelf() {
    const abwB = effectiveAbwB();
    let h = '';
    B.forEach(t => { if (abwB.includes(t.id)) return; t.parts.filter(p => p.type === 'text' || p.type === 'sketch').forEach(p => {
        const key = pKey(t, p), s = state.self[key] || [];
        h += `<div class="qa"><div class="qhead"><span class="qnr">${t.id} ${p.id}) – ${t.title}</span><span class="badge">${p.pts} Punkte</span></div>
        <div class="qtext">${p.q}</div>
        ${p.type === 'sketch' ? `<b>Deine Antwort:</b><div class="yours">${state.ansB[key] ? 'Skizze auf Papier – lege sie neben die Musterlösung.' : '(keine Skizze)'}</div>` : `<b>Deine Antwort:</b><div class="yours">${esc(state.ansB[key] || '(keine Antwort)')}</div>`}
        <div class="muster"><b>Musterlösung:</b> ${p.muster}</div>
        <p style="margin-top:.6rem"><b>Hake ab, was in deiner Antwort steht:</b></p>
        ${p.crit.map((c, i) => `<label class="crit"><input type="checkbox" data-self="${key}" data-i="${i}" ${s[i] ? 'checked' : ''} ${state.ansB[key] ? '' : 'disabled'}><span>${c.t} <span class="stat" style="display:inline">(${c.p} P.)</span></span></label>`).join('')}
        </div>`;
    }); });
    $('selfList').innerHTML = h || '<div class="card"><p>Keine Textantworten zu bewerten.</p></div>';
}
function saveSummary(r) {
    try {
        const all = JSON.parse(localStorage.getItem('ap2-ergebnisse') || '{}');
        all[EXAM.id] = { punkte: Math.round(r.total * 10) / 10, datum: Date.now() };
        localStorage.setItem('ap2-ergebnisse', JSON.stringify(all));
    } catch (e) {}
}
function renderResult() {
    const r = computeScore(); const [n, w] = note(r.rounded);
    if (EXAM.summary) saveSummary(r);
    const autoAbw = r.abw.filter(x => !state.abw.includes(x));
    const autoAbwB = r.abwB.filter(x => !(state.abwB || []).includes(x));
    const usedMin = Math.max(0, Math.round(((state.endTime || Date.now()) - state.start) / 60000));
    $('resCard').innerHTML = `
      <div class="grade"><div class="big g${n}">${n}</div><div class="word g${n}">${w}</div><p class="sub">${r.rounded} von 100 Punkten · Dezimalnote ${dezNote(r.rounded)}</p></div>
      <table class="tbl">
        <tr><th>Teil</th><th>erreicht</th><th>umgerechnet</th></tr>
        <tr><td>Teil A (gebunden)</td><td>${r.aPts} von ${r.aMax} Punkten</td><td>${fmt(r.sA, 1)} von ${EXAM.aWeight * 100}</td></tr>
        <tr><td>Teil B (ungebunden)</td><td>${fmt(r.bPts, 1)} von ${r.bMax} Punkten</td><td>${fmt(r.sB, 1)} von ${EXAM.bWeight * 100}</td></tr>
        <tr><td><b>Gesamt</b></td><td></td><td><b>${fmt(r.total, 1)} von 100</b></td></tr>
      </table>
      ${autoAbw.length ? `<div class="info warn">Du hast in Teil A nicht ${EXAM.aAbw} Aufgaben abgewählt. Deshalb wurden die Aufgaben ${autoAbw.sort((a, b) => a - b).join(', ')} nicht gewertet.</div>` : ''}
      ${autoAbwB.length ? `<div class="info warn">Du hast in Teil B keine Aufgabe abgewählt. Deshalb wurde Aufgabe ${autoAbwB.join(', ')} nicht gewertet.</div>` : ''}
      <p class="stat" style="display:block">Bearbeitungszeit: ${Math.min(EXAM.duration, usedMin)} von ${EXAM.duration} Minuten${state.timeUp ? ' (Zeit abgelaufen)' : ''}.</p>
      <p class="stat" style="display:block">Notenschlüssel der IHK: 100–92 = 1 · unter 92–81 = 2 · unter 81–67 = 3 · unter 67–50 = 4 · unter 50–30 = 5 · unter 30 = 6. Teil B enthält deine Selbstbewertung.</p>
      ${EXAM.summary ? `<p style="margin-top:.6rem"><a class="btn grey small" href="${EXAM.back}">Zur Gesamtübersicht Teil 2</a></p>` : ''}`;
    const keys = Object.keys(EXAM.cats).filter(k => r.cat[k]);
    $('lfCard').innerHTML = `<h2>Wo stehst du?</h2><p>So viel Prozent der Punkte hast du in den einzelnen Bereichen erreicht. Unter 50 % solltest du das Thema wiederholen.</p><div style="margin-top:.8rem">` +
        keys.map(k => { const [g, m] = r.cat[k]; const pc = Math.round(g / m * 100); return `<div class="lfbar"><span>${EXAM.cats[k]}</span><div class="track"><div class="fill" style="width:${pc}%;${pc < 50 ? 'background:linear-gradient(90deg,#ef4444,#f97316)' : ''}"></div></div><b>${pc} %</b></div>`; }).join('') + '</div>';
    $('review').innerHTML = '';
}
function renderReview(part) {
    const abw = effectiveAbw(), abwB = effectiveAbwB();
    if (part === 'A') {
        $('review').innerHTML = A.map(a => {
            const your = state.ansA[a.nr], struck = abw.includes(a.nr);
            return `<div class="qa ${struck ? 'struck' : ''}"><div class="qhead"><span class="qnr">Aufgabe ${a.nr}</span><span class="badge">${struck ? 'nicht gewertet' : (your === a.correct ? '✔ richtig' : '✘ falsch')}</span></div>
            ${a.ref ? `<div class="ref">📐 ${a.ref}</div>` : ''}<div class="qtext">${a.q}</div><div class="opts ${a.img ? 'imgopts' : ''}">${a.opts.map((o, k) => `<div class="opt ${k === a.correct ? 'right' : (k === your ? 'wrong' : '')} ${k === your ? 'sel' : ''}"><span class="onr">${k + 1}</span><span>${o}</span></div>`).join('')}</div>
            <p class="expl">💡 ${a.e}</p></div>`;
        }).join('');
    } else {
        $('review').innerHTML = B.map(t => { const struck = abwB.includes(t.id); const sum = t.parts.reduce((s, p) => s + partScore(t, p), 0);
            return `<div class="qa ${struck ? 'struck' : ''}"><div class="qhead"><span class="qnr">Aufgabe ${t.id} – ${t.title}</span><span class="badge">${struck ? 'nicht gewertet' : fmt(sum, 1) + ' von ' + tPts(t) + ' Punkten'}</span></div><div class="qtext">${t.intro}</div>${t.parts.map(p => partHtml(t, p, 'review')).join('')}</div>`; }).join('');
    }
    $('review').scrollIntoView({ behavior: 'smooth' });
}

/* ---------- Start ---------- */
function startExam() { buildA(); buildB(); renderA(); renderB(); setPart('A'); show('scrExam'); warned = {}; runTimer(); }
function startNew() { state = freshState(); save(); startExam(); }

function initApp() {
    // Seitentexte
    document.title = EXAM.title;
    $('tTitle').textContent = EXAM.title;
    $('tSub').textContent = EXAM.subtitle;
    $('tLogo').textContent = EXAM.logo || '📝';
    $('backLink').href = EXAM.back; $('backLink').textContent = EXAM.backLabel;
    $('backLink2').href = EXAM.back;
    $('tIntro').innerHTML = EXAM.intro;
    $('tA').textContent = `Wähle ${EXAM.aAbw} Aufgaben ab (`; $('tAmax').textContent = EXAM.aAbw;
    if (EXAM.bAbw) $('bAbwInfo').classList.remove('hidden');
    if (!DOCS.length) { $('drawBtn').classList.add('hidden'); $('drawBtn2').classList.add('hidden'); }
    else { $('drawBtn').textContent = EXAM.docBtn || '📐 Zeichnung'; $('drawBtn2').textContent = EXAM.docBtn || '📐 Zeichnung'; }
    $('bIntro').innerHTML = EXAM.bIntro;

    // Ereignisse
    $('ovTabs').addEventListener('click', e => { const b = e.target.closest('[data-ov]'); if (b) { ovTab = b.dataset.ov; renderOv(); } });
    $('zIn').onclick = () => { zoom = Math.min(3, zoom + 0.25); zoomByTab[ovTab] = zoom; applyZoom(); };
    $('zOut').onclick = () => { zoom = Math.max(0.5, zoom - 0.25); zoomByTab[ovTab] = zoom; applyZoom(); };
    $('ovClose').onclick = closeOv; $('drawBtn').onclick = toggleOv; $('drawBtn2').onclick = toggleOv;
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && !$('ov').classList.contains('hidden')) closeOv(); });
    $('partTabs').addEventListener('click', e => { const b = e.target.closest('[data-part]'); if (b) setPart(b.dataset.part); });
    $('toB').onclick = () => setPart('B'); $('toA').onclick = () => setPart('A');
    $('listA').addEventListener('click', e => {
        const l = e.target.closest('.opt');
        if (l) { e.preventDefault(); if (state.phase !== 'exam') return; const q = Number(l.dataset.q), k = Number(l.dataset.k); if (state.ansA[q] === k) delete state.ansA[q]; else state.ansA[q] = k; save(); refreshA(); return; }
        const b = e.target.closest('[data-abw]');
        if (b) { const n = Number(b.dataset.abw); const i = state.abw.indexOf(n); if (i >= 0) state.abw.splice(i, 1); else { if (state.abw.length >= EXAM.aAbw) { toast(`Du hast schon ${EXAM.aAbw} Aufgaben abgewählt.`); return; } state.abw.push(n); } save(); refreshA(); }
    });
    $('sheet').addEventListener('click', e => { const c = e.target.closest('[data-go]'); if (c) $('qa-' + c.dataset.go).scrollIntoView({ behavior: 'smooth', block: 'start' }); });
    $('listB').addEventListener('input', e => {
        if (state.phase !== 'exam') return; const el = e.target;
        if (el.dataset.key) { const k = el.dataset.key; state.ansB[k] = state.ansB[k] || []; state.ansB[k][Number(el.dataset.i)] = el.value; save(); updStat(); }
        if (el.dataset.tkey) { state.ansB[el.dataset.tkey] = el.value; save(); updStat(); }
    });
    $('listB').addEventListener('change', e => {
        if (state.phase !== 'exam') return; const el = e.target;
        if (el.dataset.sketch) { state.ansB[el.dataset.sketch] = el.checked ? 'Skizze' : ''; save(); updStat(); return; }
        if (el.dataset.mkey) { const k = el.dataset.mkey; state.ansB[k] = state.ansB[k] || []; state.ansB[k][Number(el.dataset.i)] = Number(el.value); save(); updStat(); }
    });
    $('listB').addEventListener('click', e => {
        if (state.phase !== 'exam') return;
        const ab = e.target.closest('[data-abwb]');
        if (ab) { const id = ab.dataset.abwb; state.abwB = state.abwB || []; const i = state.abwB.indexOf(id); if (i >= 0) state.abwB.splice(i, 1); else { if (state.abwB.length >= EXAM.bAbw) { toast(`Du kannst nur ${EXAM.bAbw} Aufgabe abwählen.`); return; } state.abwB.push(id); } save(); refreshB(); return; }
        const l = e.target.closest('[data-skey]');
        if (l) { e.preventDefault(); state.ansB[l.dataset.skey] = Number(l.dataset.k); save(); l.parentElement.querySelectorAll('.opt').forEach(x => x.classList.toggle('sel', x === l)); updStat(); return; }
        const up = e.target.closest('[data-up]'), dn = e.target.closest('[data-down]'); const b = up || dn;
        if (b) {
            const key = b.dataset.up || b.dataset.down, i = Number(b.dataset.i);
            const t = B.find(t => key.startsWith(t.id) && t.parts.some(p => pKey(t, p) === key)), p = t.parts.find(p => pKey(t, p) === key);
            const ord = (state.ansB[key] || initOrder(key, p)).slice(); const j = up ? i - 1 : i + 1;
            if (j < 0 || j >= ord.length) return;
            [ord[i], ord[j]] = [ord[j], ord[i]]; state.ansB[key] = ord; save();
            const y = window.scrollY; b.closest('.part').outerHTML = partHtml(t, p, 'exam'); window.scrollTo(0, y); updStat();
        }
    });
    $('submitBtn').onclick = () => {
        const open = NA - Object.keys(state.ansA).length;
        let msg = `<h2>Prüfung abgeben?</h2><p>Restzeit: ${$('timer').textContent} min.</p>`;
        if (state.abw.length < EXAM.aAbw) msg += `<div class="info warn">Du hast in Teil A erst ${state.abw.length} von ${EXAM.aAbw} Aufgaben abgewählt. Dann werden die letzten abwählbaren Aufgaben nicht gewertet.</div>`;
        if (EXAM.bAbw && (state.abwB || []).length < EXAM.bAbw) msg += `<div class="info warn">Du hast in Teil B keine Aufgabe abgewählt. Dann wird die letzte Aufgabe (${B[B.length - 1].id}) nicht gewertet.</div>`;
        if (open > 0) msg += `<p>In Teil A sind ${open} Aufgaben ohne Kreuz.</p>`;
        msg += `<div class="row" style="margin-top:1rem"><button class="btn red" id="mYes">Ja, abgeben</button><button class="btn grey" id="mNo">Weiterarbeiten</button></div>`;
        modal(msg); $('mYes').onclick = () => { closeModal(); finishExam(false); }; $('mNo').onclick = closeModal;
    };
    $('selfList').addEventListener('change', e => { const c = e.target; if (c.dataset.self) { const k = c.dataset.self; state.self[k] = state.self[k] || []; state.self[k][Number(c.dataset.i)] = c.checked; save(); } });
    $('toResult').onclick = () => { state.phase = 'result'; save(); renderResult(); show('scrResult'); };
    $('showRevA').onclick = () => renderReview('A'); $('showRevB').onclick = () => renderReview('B');
    $('newBtn').onclick = () => {
        modal(`<h2>Neue Prüfung starten?</h2><p>Dein Ergebnis wird gelöscht. Die Rechenaufgaben bekommen neue Zahlen.</p><div class="row" style="margin-top:1rem"><button class="btn" id="mYes">Ja, neu starten</button><button class="btn grey" id="mNo">Abbrechen</button></div>`);
        $('mYes').onclick = () => { closeModal(); startNew(); }; $('mNo').onclick = closeModal;
    };
    $('startBtn').onclick = () => {
        const s = load();
        if (s && s.phase === 'exam' && s.start + DURATION > Date.now()) {
            modal(`<h2>Laufende Prüfung</h2><p>Du hast schon eine Prüfung angefangen. Neu starten löscht deine Antworten.</p><div class="row" style="margin-top:1rem"><button class="btn red" id="mYes">Neu starten</button><button class="btn grey" id="mNo">Abbrechen</button></div>`);
            $('mYes').onclick = () => { closeModal(); startNew(); }; $('mNo').onclick = closeModal; return;
        }
        startNew();
    };
    $('resumeBtn').onclick = () => { state = load(); startExam(); };

    const s = load();
    if (!s) return;
    state = s; state.abwB = state.abwB || [];
    if (s.phase === 'exam') {
        if (s.start + DURATION > Date.now()) { $('resumeBtn').style.display = ''; $('resumeBtn').textContent = 'Weiter zur laufenden Prüfung (' + Math.ceil((s.start + DURATION - Date.now()) / 60000) + ' min übrig)'; }
        else { buildA(); buildB(); state.timeUp = true; state.endTime = s.start + DURATION; state.phase = 'self'; save(); renderSelf(); show('scrSelf'); }
    } else if (s.phase === 'self') { buildA(); buildB(); renderSelf(); show('scrSelf'); }
    else if (s.phase === 'result') { buildA(); buildB(); renderResult(); show('scrResult'); }
}

/* Testzugang für automatische Prüfung */
window.__pruefung = {
    get state() { return state; }, get A() { return A; }, get B() { return B; },
    computeScore, effectiveAbw, effectiveAbwB, numOk, docs: DOCS,
    solveAll() {
        A.forEach(a => state.ansA[a.nr] = a.correct);
        B.forEach(t => t.parts.forEach(p => {
            const k = pKey(t, p);
            if (p.type === 'num') state.ansB[k] = p.fields.map(f => String(f.show).replace('+', '').replace('±', '').replace('−', '-').trim());
            if (p.type === 'select') state.ansB[k] = p.ans;
            if (p.type === 'order') state.ansB[k] = p.items.map((_, i) => i);
            if (p.type === 'match') state.ansB[k] = p.ans.slice();
            if (p.type === 'text' || p.type === 'sketch') { state.ansB[k] = 'Testantwort'; state.self[k] = p.crit.map(() => true); }
        }));
        save();
    }
};
initApp();
