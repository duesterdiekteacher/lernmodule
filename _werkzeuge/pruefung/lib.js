'use strict';
/* ============================================================
   Hilfsfunktionen für alle Prüfungssimulationen
   ============================================================ */
const $ = id => document.getElementById(id);
const fmt = (x, d) => (Math.round(x * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d).replace('.', ',');
const fmtT = x => Math.round(x).toLocaleString('de-DE');
const parseNum = s => { if (s === undefined || s === null) return NaN; s = String(s).trim().replace(/\s/g, '').replace('−', '-'); s = s.replace(',', '.'); if (s === '') return NaN; return Number(s); };
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
function hashStr(s) { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
function shuffle(r, arr) { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function uniqOpts(list) { const seen = new Set(); const out = []; list.forEach(t => { if (!seen.has(t)) { seen.add(t); out.push(t); } }); return out; }

/* ---------- SVG ---------- */
const SVGSTYLE = `<style>
.v{stroke:#000;stroke-width:1.7;fill:none}.vf{stroke:#000;stroke-width:1.7;fill:#fff}.t{stroke:#000;stroke-width:.7;fill:none}
.h{stroke:#000;stroke-width:.9;stroke-dasharray:5 3;fill:none}.c{stroke:#000;stroke-width:.6;stroke-dasharray:16 3 2 3;fill:none}
.p{stroke:#444;stroke-width:.9;stroke-dasharray:12 3 2 3 2 3;fill:none}.d{stroke:#000;stroke-width:.6;fill:none}
text{font-family:Arial,Helvetica,sans-serif;fill:#000}.fill{fill:#000;stroke:none}.grey{fill:#e5e7eb;stroke:#000;stroke-width:1.2}
.sv{stroke:#000;stroke-width:1.7}.thin{stroke:#000;stroke-width:.7}
</style>`;
function defs(id) {
    return `<defs><marker id="${id}" markerWidth="10" markerHeight="8" refX="9" refY="3" orient="auto-start-reverse" markerUnits="userSpaceOnUse"><path d="M0,0 L9,3 L0,6 z" fill="#000"/></marker>
<pattern id="${id}h1" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#000" stroke-width=".7"/></pattern>
<pattern id="${id}h2" patternUnits="userSpaceOnUse" width="7" height="7" patternTransform="rotate(-45)"><line x1="0" y1="0" x2="0" y2="7" stroke="#000" stroke-width=".7"/></pattern>
<pattern id="${id}h3" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="#000" stroke-width=".6"/></pattern></defs>`;
}
const Ln = (x1, y1, x2, y2, c = 'v') => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}"/>`;
const Rc = (x, y, w, h, c = 'v') => `<rect x="${x}" y="${y}" width="${w}" height="${h}" class="${c}"/>`;
const Ci = (x, y, r, c = 'v') => `<circle cx="${x}" cy="${y}" r="${r}" class="${c}"/>`;
const Tx = (x, y, s, size = 13, anchor = 'middle', extra = '') => `<text x="${x}" y="${y}" font-size="${size}" text-anchor="${anchor}" ${extra}>${s}</text>`;
const Poly = (pts, c = 'v') => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" class="${c}"/>`;
const PolyL = (pts, c = 'v') => `<polyline points="${pts.map(p => p.join(',')).join(' ')}" class="${c}"/>`;
const Hatch = (pts, m, n = 1) => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="url(#${m}h${n})" stroke="#000" stroke-width="1.7"/>`;
const HatchR = (x, y, w, h, m, n = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${m}h${n})" stroke="#000" stroke-width="1.7"/>`;
function dimH(m, x1, x2, y, yref, label, yref2) {
    const dir = y < yref ? -1 : 1; const yr2 = yref2 === undefined ? yref : yref2;
    return Ln(x1, yref + dir * 3, x1, y + dir * 6, 'd') + Ln(x2, yr2 + dir * 3, x2, y + dir * 6, 'd') +
        `<line x1="${x1}" y1="${y}" x2="${x2}" y2="${y}" class="d" marker-start="url(#${m})" marker-end="url(#${m})"/>` +
        Tx((x1 + x2) / 2, y - 4, label, 13);
}
function dimV(m, y1, y2, x, xref, label, xref2) {
    const dir = x < xref ? -1 : 1; const xr2 = xref2 === undefined ? xref : xref2;
    return Ln(xref + dir * 3, y1, x + dir * 6, y1, 'd') + Ln(xr2 + dir * 3, y2, x + dir * 6, y2, 'd') +
        `<line x1="${x}" y1="${y1}" x2="${x}" y2="${y2}" class="d" marker-start="url(#${m})" marker-end="url(#${m})"/>` +
        `<text x="${x - 5}" y="${(y1 + y2) / 2}" font-size="13" text-anchor="middle" transform="rotate(-90 ${x - 5} ${(y1 + y2) / 2})">${label}</text>`;
}
function cross(x, y, r) { return Ln(x - r, y, x + r, y, 'c') + Ln(x, y - r, x, y + r, 'c'); }
function threadTop(x, y, rCore, rMaj) {
    const p = a => [x + rMaj * Math.cos(a), y - rMaj * Math.sin(a)];
    const [sx, sy] = p(0), [ex, ey] = p(1.5 * Math.PI);
    return Ci(x, y, rCore) + `<path d="M${sx},${sy} A${rMaj},${rMaj} 0 1 0 ${ex},${ey}" class="t" transform="rotate(10 ${x} ${y})"/>`;
}
function projSymbol(x, y) {
    return `<g transform="translate(${x},${y})">${Ln(0, 6, 22, 0, 't')}${Ln(0, 14, 22, 20, 't')}${Ln(0, 6, 0, 14, 't')}${Ln(22, 0, 22, 20, 't')}${Ci(42, 10, 10, 't')}${Ci(42, 10, 4, 't')}${Ln(-4, 10, 56, 10, 'c')}</g>`;
}
function tolFrame(x, y, sym, val, datum) { // sym: 'flat' | 'runout' | 'par' | 'perp'
    let s = Rc(x, y, 28, 20, 't') + Rc(x + 28, y, 46, 20, 't');
    if (sym === 'flat') s += `<polygon points="${x + 5},${y + 14} ${x + 11},${y + 6} ${x + 23},${y + 6} ${x + 17},${y + 14}" class="t"/>`;
    if (sym === 'runout') s += Ln(x + 9, y + 16, x + 19, y + 4, 't') + `<path d="M${x + 15},${y + 4} L${x + 19},${y + 4} L${x + 18},${y + 8}" class="t"/>`;
    if (sym === 'par') s += Ln(x + 9, y + 15, x + 15, y + 5, 't') + Ln(x + 14, y + 15, x + 20, y + 5, 't');
    if (sym === 'perp') s += Ln(x + 14, y + 4, x + 14, y + 15, 't') + Ln(x + 7, y + 15, x + 21, y + 15, 't');
    s += Tx(x + 51, y + 15, val, 13);
    if (datum) s += Rc(x + 74, y, 28, 20, 't') + Tx(x + 88, y + 15, datum, 13);
    return s;
}
function datumBox(x, y, letter, tx, ty) { // Bezugsbuchstabe mit Dreieck an (tx,ty)
    return Ln(x + 10, y + 20, tx, ty - 6, 't') + `<polygon points="${tx - 6},${ty} ${tx + 6},${ty} ${tx},${ty - 7}" class="fill"/>` + Rc(x, y, 20, 20, 't') + Tx(x + 10, y + 15, letter, 13);
}
function titleBlock(x, y, w, f) { // f: {name, werkstoff, nr, tol, mass, extra}
    const c1 = x + w * 0.42, c2 = x + w * 0.70;
    let s = Rc(x, y, w, 66, 't') + Ln(x, y + 33, x + w, y + 33, 't') + Ln(c1, y, c1, y + 66, 't') + Ln(c2, y, c2, y + 66, 't');
    s += Tx(x + 6, y + 12, 'Benennung', 9, 'start') + Tx(x + 6, y + 28, f.name, 15, 'start', 'font-weight="bold"');
    s += Tx(c1 + 6, y + 12, 'Werkstoff', 9, 'start') + Tx(c1 + 6, y + 28, f.werkstoff, 13, 'start');
    s += Tx(c2 + 6, y + 12, 'Zeichnungs-Nr.', 9, 'start') + Tx(c2 + 6, y + 28, f.nr, 13, 'start');
    s += Tx(x + 6, y + 45, 'Allgemeintoleranz', 9, 'start') + Tx(x + 6, y + 61, f.tol, 12, 'start');
    s += Tx(c1 + 6, y + 45, 'Maßstab', 9, 'start') + Tx(c1 + 6, y + 61, f.mass || 'nicht maßstäblich', 12, 'start');
    s += projSymbol(c2 + 20, y + 40);
    return s;
}
function balloon(tx, ty, bx, by, n) {
    const dx = bx - tx, dy = by - ty, L = Math.hypot(dx, dy) || 1;
    return Ln(tx, ty, bx - dx / L * 13, by - dy / L * 13, 't') + Ci(tx, ty, 2, 'fill') + Ci(bx, by, 13, 'vf') + Tx(bx, by + 5, n, 14, 'middle', 'font-weight="bold"');
}
function tableSvg(x, y, cols, rows, rh = 22) { // cols: x-Positionen inkl. Ende
    let s = `<rect x="${cols[0]}" y="${y}" width="${cols[cols.length - 1] - cols[0]}" height="${rh}" class="grey"/>`;
    rows.forEach((r, i) => { const yy = y + i * rh; s += Ln(cols[0], yy, cols[cols.length - 1], yy, 't'); r.forEach((c, j) => { s += Tx(cols[j] + 5, yy + rh - 6, c, 12, 'start', i === 0 ? 'font-weight="bold"' : ''); }); });
    s += Ln(cols[0], y + rows.length * rh, cols[cols.length - 1], y + rows.length * rh, 't');
    cols.forEach(cx => { s += Ln(cx, y, cx, y + rows.length * rh, 't'); });
    return s;
}
function stuecklisteHtml(title, rows) {
    return `<div class="paper text" style="max-width:940px"><h3>${title}</h3><table><tr><th>Pos.</th><th>Menge</th><th>Benennung / Norm</th><th>Werkstoff</th><th>Bemerkung</th></tr>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</table></div>`;
}

/* ---------- kleine Bilder für Antwortmöglichkeiten ---------- */
function picWrap(inner, w = 150, h = 110) { return `<span class="pic"><svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">${SVGSTYLE}${inner}</svg></span>`; }
// Lagerdeckel mit Zentrierbund, Achse waagerecht. variant: ok | voll | unten | kante | ohnebund
function deckelHalbschnitt(variant, id) {
    const cy = 55, x1 = 64, x2 = 90, xb = 50, R = 46, r1 = 22, r2 = 34;
    const hat = `<defs><pattern id="${id}" patternUnits="userSpaceOnUse" width="4" height="4" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="#000" stroke-width=".7"/></pattern></defs>`;
    const H = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="url(#${id})" stroke="#000" stroke-width="1.6"/>`;
    const O = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#fff" stroke="#000" stroke-width="1.6"/>`;
    let s = hat;
    const upperCut = variant !== 'unten', lowerCut = variant === 'voll' || variant === 'unten';
    // obere Hälfte
    if (upperCut) { s += H(x1, cy - R, x2 - x1, R); if (variant !== 'ohnebund') s += H(xb, cy - r2, x1 - xb, r2 - r1); else s += O(xb, cy - r2, x1 - xb, r2 - r1); }
    else { s += O(x1, cy - R, x2 - x1, R) + O(xb, cy - r2, x1 - xb, r2 - r1); }
    // untere Hälfte
    if (lowerCut) { s += H(x1, cy, x2 - x1, R) + H(xb, cy + r1, x1 - xb, r2 - r1); }
    else { s += O(x1, cy, x2 - x1, R) + O(xb, cy + r1, x1 - xb, r2 - r1); }
    s += variant === 'kante' ? Ln(xb - 10, cy, x2 + 12, cy, 'v') : Ln(xb - 10, cy, x2 + 12, cy, 'c');
    return picWrap(s, 150, 110);
}
// Sicherheitszeichen (vereinfacht). kind: gebot | verbot | warn | rettung | brand
function sicherheitszeichen(kind) {
    let s = '';
    if (kind === 'gebot') s = '<circle cx="75" cy="55" r="40" fill="#1d4ed8"/><rect x="71" y="30" width="8" height="34" rx="3" fill="#fff"/><circle cx="75" cy="76" r="5" fill="#fff"/>';
    if (kind === 'verbot') s = '<circle cx="75" cy="55" r="38" fill="#fff" stroke="#dc2626" stroke-width="9"/><line x1="49" y1="29" x2="101" y2="81" stroke="#dc2626" stroke-width="9"/>';
    if (kind === 'warn') s = '<polygon points="75,14 118,94 32,94" fill="#facc15" stroke="#000" stroke-width="5" stroke-linejoin="round"/><rect x="71" y="42" width="8" height="30" rx="3" fill="#000"/><circle cx="75" cy="82" r="5" fill="#000"/>';
    if (kind === 'rettung') s = '<rect x="35" y="15" width="80" height="80" fill="#16a34a"/><rect x="68" y="30" width="14" height="50" fill="#fff"/><rect x="50" y="48" width="50" height="14" fill="#fff"/>';
    if (kind === 'brand') s = '<rect x="35" y="15" width="80" height="80" fill="#dc2626"/><path d="M75,30 C95,50 92,62 88,72 C84,84 66,84 62,72 C58,62 64,54 70,48 C70,58 76,60 78,56 C80,48 74,40 75,30 Z" fill="#fff"/>';
    return picWrap(s, 150, 110);
}
