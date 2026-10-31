/* יחידה: משולש שווה שוקיים (כרך ב׳, פרקים 15–16 בספר) */
(() => {
  // מוריד שורת פתרון כפולה, למשל "$x = 10$" אחרי "מעבירים: $x = 10$" (כשהמקדם הוא 1)
  const dedupe = list => list.map(g => ({ ...g, gen() { const e = g.gen(); e.steps = e.steps.filter((s, i, a) => !(i && s[0] === '$' && a[i - 1].endsWith(s.slice(1)))); return e; } }));
  const D2R = Math.PI / 180;
  const xy = p => Array.isArray(p) ? p : [p.X(), p.Y()];
  const unit = (a, b) => { const d = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1; return [(a[0] - b[0]) / d, (a[1] - b[1]) / d]; };
  const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const deg = (A, B, C) => {
    [A, B, C] = [A, B, C].map(xy);
    let d = Math.abs(Math.atan2(A[1] - B[1], A[0] - B[0]) - Math.atan2(C[1] - B[1], C[0] - B[0])) / D2R;
    return d > 180 ? 360 - d : d;
  };
  const fig = (el, bb = [-5, 5, 5, -5]) => U.board(el, bb, { axis: false, grid: false });
  const ORANGE = '#e8702a', BLUE = '#2f6fdb', GREEN = '#1f9d55', RED = '#d63c3c', PURPLE = '#8e44ad', GREY = '#555';
  const NO = { fixed: true, highlight: false };
  const pt = p => `(${p[0]}, ${p[1]})`;

  function mark(brd, A, B, C, label, color = ORANGE, r = 0.6) {
    const P = [A, B, C].map(p => Array.isArray(p) ? brd.create('point', p, { visible: false }) : p);
    brd.create('nonreflexangle', P, { radius: r, name: '', withLabel: false, fillColor: color, fillOpacity: 0.35, strokeColor: color, ...NO });
    if (label === '') return;
    const txt = typeof label === 'function' ? label : () => label;
    const pos = k => () => {
      const [a, b, c] = P.map(xy), u = unit(a, b), v = unit(c, b);
      let w = [u[0] + v[0], u[1] + v[1]], n = Math.hypot(w[0], w[1]);
      if (n < 1e-6) { w = [-u[1], u[0]]; n = 1; }
      const bb = brd.getBoundingBox(), upp = (bb[2] - bb[0]) / brd.canvasWidth;
      const rho = 0.8 * Math.hypot(4.2 * String(txt()).length + 3, 10) * upp, half = deg(a, b, c) * D2R / 2;
      return b[k] + Math.max(r + rho, rho / Math.sin(Math.max(half, 0.15))) * w[k] / n;
    };
    brd.create('text', [pos(0), pos(1), txt], { anchorX: 'middle', anchorY: 'middle', fontSize: 15, color, cssStyle: 'font-weight:bold', ...NO });
  }
  const seg = (brd, a, b, o = {}) => brd.create('segment', [a, b], { strokeColor: '#222', strokeWidth: 2.5, ...NO, ...o });
  /** תווית ליד P, בכיוון הרחק מ־ctr. המרחק בפיקסלים גדל עם אורך התווית */
  const label = (brd, P, name, ctr, o = {}) => {
    const u = unit(P, ctr), bb = brd.getBoundingBox(), upp = (bb[2] - bb[0]) / brd.canvasWidth, d = (10 + 4.5 * String(name).length) * upp;
    brd.create('text', [P[0] + d * u[0], P[1] + d * u[1], name], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, ...NO, ...o });
  };
  function ticks(brd, P, Q, n = 1, color = RED) {
    const m = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], u = unit(Q, P), v = [-u[1], u[0]], L = 0.22;
    for (let k = 0; k < n; k++) {
      const off = (k - (n - 1) / 2) * 0.15, c = [m[0] + u[0] * off, m[1] + u[1] * off];
      seg(brd, [c[0] - v[0] * L, c[1] - v[1] * L], [c[0] + v[0] * L, c[1] + v[1] * L], { strokeColor: color, strokeWidth: 2.5 });
    }
  }
  const poly = (brd, pts, o = {}) => brd.create('polygon', pts, { fillColor: '#ffe9d6', fillOpacity: 0.35, borders: { strokeColor: '#222', strokeWidth: 2.5, ...NO }, vertices: { visible: false }, ...NO, ...o });

  /** משולש שווה שוקיים AB = AC עם זווית ראש h (במעלות). opts: {A,B,C,ext} תוויות זוויות, sides {AB, AC, BC}, median, extD */
  function isoFig(el, h, opts = {}) {
    h = Math.min(120, Math.max(28, h)); // shortcut: זווית קיצונית מצוירת מתונה יותר כדי שהשרטוט ייכנס (השרטוט להמחשה)
    const beta = (180 - h) / 2, w = 3, H = w * Math.tan(beta * D2R);
    const A = [0, H], B = [-w, 0], C = [w, 0], D = [0, 0], E = [w + 2.6, 0];
    const all = opts.ext != null ? [A, B, C, E] : [A, B, C];
    const xs = all.map(p => p[0]), ys = all.map(p => p[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const half = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 * 1.3 + 0.5;
    const brd = fig(el, [cx - half, cy + half, cx + half, cy - half]), g = [0, H / 3], r = half / 7;
    poly(brd, [A, B, C]);
    ticks(brd, A, B); ticks(brd, A, C);
    label(brd, A, 'A', g); label(brd, B, 'B', g); label(brd, C, 'C', [C[0], 1]);
    if (opts.median) { seg(brd, A, D, { strokeColor: RED, strokeWidth: 3 }); label(brd, D, 'D', [0, 1]); }
    if (opts.ext != null) { seg(brd, C, E, { dash: 2 }); label(brd, E, 'E', [E[0], 1]); mark(brd, A, C, E, opts.ext, PURPLE, r * 1.2); }
    if (opts.A != null) mark(brd, B, A, C, opts.A, ORANGE, r);
    if (opts.B != null) mark(brd, A, B, C, opts.B, BLUE, r);
    if (opts.C != null) mark(brd, A, C, B, opts.C, BLUE, r);
    const st = { color: GREEN, fontSize: 16, cssStyle: 'font-weight:bold' };
    const sl = (P, Q, t) => label(brd, [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], t, g, st);
    if (opts.sides) { const s = opts.sides; if (s.AB) sl(A, B, s.AB); if (s.AC) sl(A, C, s.AC); if (s.BC) label(brd, [w / 2, 0], s.BC, [w / 2, 1], st); }
    if (opts.AD) { const m = [0, H / 2]; brd.create('text', [0.25 * half / 5, m[1], opts.AD], { fontSize: 16, color: RED, cssStyle: 'font-weight:bold', ...NO }); }
    return brd;
  }

  /* ---- הוכחות בסיסיות ---- */
  const PROOFS = [
    { given: 'במשולש $ABC$: $AB = AC$, ו־$AD$ תיכון לבסיס $BC$.', goal: '$\\triangle ABD \\cong \\triangle ACD$',
      rows: [['$AB = AC$', 'נתון', ''], ['$BD = CD$', 'נתון', '— $AD$ תיכון'], ['$AD = AD$', 'צלע משותפת', ''],
        ['$\\triangle ABD \\cong \\triangle ACD$', 'צ.צ.צ', ''], ['$\\angle B = \\angle C$', 'זוויות מתאימות במשולשים חופפים', '']] },
    { given: 'במשולש $ABC$: $AB = AC$, ו־$AD$ חוצה את הזווית $A$.', goal: '$\\triangle ABD \\cong \\triangle ACD$',
      rows: [['$AB = AC$', 'נתון', ''], ['$\\angle BAD = \\angle CAD$', 'נתון', '— $AD$ חוצה זווית'], ['$AD = AD$', 'צלע משותפת', ''],
        ['$\\triangle ABD \\cong \\triangle ACD$', 'צ.ז.צ', ''], ['$BD = CD$', 'צלעות מתאימות במשולשים חופפים', '']] },
    { given: 'במשולש $ABC$: $AB = AC$. הנקודות $D$ ו־$E$ על הבסיס $BC$, ו־$BD = CE$.', goal: '$\\triangle ABD \\cong \\triangle ACE$', two: true,
      rows: [['$AB = AC$', 'נתון', ''], ['$\\angle B = \\angle C$', 'זוויות הבסיס במשולש שווה שוקיים', ''], ['$BD = CE$', 'נתון', ''],
        ['$\\triangle ABD \\cong \\triangle ACE$', 'צ.ז.צ', ''], ['$AD = AE$', 'צלעות מתאימות במשולשים חופפים', '']] },
  ];
  const REASONS = ['נתון', 'זוויות קודקודיות', 'צלע משותפת', 'צ.ז.צ', 'ז.צ.ז', 'צ.צ.צ', 'זוויות הבסיס במשולש שווה שוקיים', 'צלעות מתאימות במשולשים חופפים', 'זוויות מתאימות במשולשים חופפים', 'זוויות צמודות'];
  const proofTable = (rows, hide) => `<table style="border-collapse:collapse;margin:10px auto;font-size:1rem">
    <tr><th style="border:1px solid #999;padding:4px 12px">טענה</th><th style="border:1px solid #999;padding:4px 12px">נימוק</th></tr>
    ${rows.map((r, k) => `<tr><td style="border:1px solid #999;padding:4px 12px" dir="ltr">${r[0]}</td><td style="border:1px solid #999;padding:4px 12px">${k === hide ? '<b>?</b>' : r[1] + ' ' + r[2]}</td></tr>`).join('')}</table>`;
  function proofFig(el, P) {
    const brd = fig(el), A = [0, 3.6], B = [-3.5, -2.4], C = [3.5, -2.4], g = [0, -0.4];
    poly(brd, [A, B, C]); ticks(brd, A, B); ticks(brd, A, C);
    label(brd, A, 'A', g); label(brd, B, 'B', g); label(brd, C, 'C', g);
    if (P.two) {
      const D = [-1.6, -2.4], E = [1.6, -2.4];
      seg(brd, A, D, { strokeColor: BLUE }); seg(brd, A, E, { strokeColor: BLUE });
      ticks(brd, B, D, 2, BLUE); ticks(brd, E, C, 2, BLUE);
      label(brd, D, 'D', [D[0], 0]); label(brd, E, 'E', [E[0], 0]);
    } else { seg(brd, A, [0, -2.4], { strokeColor: RED, strokeWidth: 3 }); label(brd, [0, -2.4], 'D', [0, 0]); }
  }

  const SVG_EX = `<svg viewBox="0 0 300 200" width="300" style="max-width:100%;display:block;margin:10px auto" dir="ltr" font-family="Rubik,sans-serif">
    <polygon points="150,25 40,170 260,170" fill="none" stroke="#2f6fdb" stroke-width="3"/>
    <line x1="150" y1="25" x2="150" y2="170" stroke="#d63c3c" stroke-width="3"/>
    <g stroke="#d63c3c" stroke-width="2.5"><line x1="88" y1="92" x2="102" y2="102"/><line x1="198" y1="102" x2="212" y2="92"/></g>
    <text x="144" y="18" font-size="17" fill="currentColor">A</text><text x="22" y="186" font-size="17" fill="currentColor">B</text>
    <text x="264" y="186" font-size="17" fill="currentColor">C</text><text x="144" y="190" font-size="17" fill="currentColor">D</text>
    <text x="134" y="62" font-size="15" fill="#e8702a" font-weight="bold">40°</text><text x="156" y="120" font-size="15" fill="#d63c3c" font-weight="bold">8</text>
    <text x="90" y="166" font-size="15" fill="#1f9d55" font-weight="bold">BC = 12</text></svg>`;

  registerChapter('isosceles', {
    intro: `
      <div class="idea"><b>משולש שווה שוקיים</b>משולש שיש בו <b>שתי צלעות שוות</b>. הן נקראות <b>שוקיים</b>, והצלע השלישית נקראת <b>בסיס</b>.
        <br>הזווית שבין השוקיים היא <b>זווית הראש</b>, ושתי הזוויות ליד הבסיס הן <b>זוויות הבסיס</b>.</div>
      <div class="idea"><b>תכונה 1: זוויות הבסיס שוות</b>אם $AB = AC$ אז $\\angle B = \\angle C$. (וגם להפך: אם שתי זוויות במשולש שוות — הוא שווה שוקיים.)</div>
      <div class="formula">זווית בסיס $= \\frac{180 - \\text{זווית הראש}}{2}$</div>
      <div class="idea"><b>תכונה 2: שלושה בקטע אחד</b>במשולש שווה שוקיים, הקטע מזווית הראש אל הבסיס הוא בבת אחת:
        <br><b>תיכון</b> (מגיע לאמצע הבסיס) + <b>גובה</b> (ניצב לבסיס) + <b>חוצה זווית</b> (חוצה את זווית הראש).
        <br>מספיק לדעת שהוא אחד מהשלושה — והוא גם שני האחרים.</div>
      <div class="idea"><b>משולש שווה צלעות</b>כל 3 הצלעות שוות, ולכן כל 3 הזוויות שוות: $180 \\div 3 = 60^\\circ$ כל אחת.</div>
      <div class="note"><b>שטח:</b> $\\frac{\\text{בסיס} \\cdot \\text{גובה}}{2}$. במשולש שווה שוקיים הגובה לבסיס פוגש את הבסיס <b>בדיוק באמצע</b>.
        <br><b>במערכת צירים:</b> אם הבסיס אופקי מ־$x = 1$ עד $x = 7$, הקודקוד $A$ נמצא מעל האמצע, על הישר $x = 4$.</div>`,

    example: {
      question: `במשולש $ABC$: $AB = AC$ ו־$\\angle A = 40^\\circ$. $AD$ הוא תיכון לבסיס, $BC = 12$ ס"מ ו־$AD = 8$ ס"מ.<br>א. מצאו את זוויות הבסיס. ב. מה אורך $BD$? ג. מה שטח המשולש?${SVG_EX}`,
      steps: [
        'המשולש שווה שוקיים ($AB = AC$), ולכן <b>זוויות הבסיס שוות</b>: $\\angle B = \\angle C$.',
        'סכום הזוויות 180. מה שנשאר אחרי זווית הראש: $180 - 40 = 140$.',
        'מחלקים שווה בשווה בין שתי זוויות הבסיס: $140 \\div 2 = 70$. לכן $\\angle B = \\angle C = 70^\\circ$.',
        'סעיף ב: $AD$ תיכון, אז $D$ אמצע $BC$: $BD = 12 \\div 2 = 6$ ס"מ.',
        'סעיף ג: במשולש שווה שוקיים התיכון לבסיס הוא <b>גם גובה</b>. לכן $AD = 8$ הוא הגובה לבסיס.',
        'שטח $= \\frac{\\text{בסיס} \\cdot \\text{גובה}}{2} = \\frac{12 \\cdot 8}{2}$.',
        '$= \\frac{96}{2} = 48$ סמ"ר.',
      ],
    },

    tools: [
      {
        title: 'שלושה קטעים — או אחד?',
        desc: 'גרור את הקודקוד A. כשהוא "נעול" המשולש תמיד שווה שוקיים. מה קורה לזוויות הבסיס ולשלושת הקטעים? עכשיו שחרר את A ובדוק שוב.',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = fig(el, [-5, 7.5, 5, -2.5]);
          const B = [-3, 0], C = [3, 0];
          const axisLine = brd.create('line', [[0, 0], [0, 1]], { visible: false });
          const A = brd.create('glider', [0, 4.5, axisLine], { name: 'A', color: ORANGE, size: 7, label: { fontSize: 18, offset: [10, 10] } });
          const pB = brd.create('point', B, { visible: false }), pC = brd.create('point', C, { visible: false });
          poly(brd, [A, pB, pC], { fixed: false });
          brd.create('text', [B[0] - 0.5, B[1] - 0.2, 'B'], { fontSize: 18, ...NO });
          brd.create('text', [C[0] + 0.25, C[1] - 0.2, 'C'], { fontSize: 18, ...NO });
          const Mid = [0, 0];
          const H = () => [A.X(), 0];
          const Dbis = () => { const b = dist(xy(A), B), c = dist(xy(A), C), t = b / (b + c); return [B[0] + t * (C[0] - B[0]), 0]; };
          const ptf = f => brd.create('point', [() => f()[0], () => f()[1]], { visible: false });
          seg(brd, A, ptf(() => Dbis()), { strokeColor: GREEN, strokeWidth: 6, strokeOpacity: 0.6 });
          seg(brd, A, ptf(H), { strokeColor: BLUE, strokeWidth: 3, dash: 2 });
          seg(brd, A, brd.create('point', Mid, { visible: false }), { strokeColor: RED, strokeWidth: 2.5 });
          mark(brd, A, pB, pC, () => Math.round(deg(A, pB, pC)) + '°', BLUE, 0.7);
          mark(brd, A, pC, pB, () => Math.round(deg(A, pC, pB)) + '°', BLUE, 0.7);
          const sideTxt = (P, side) => brd.create('text', [() => (A.X() + P[0]) / 2 + side * 0.5, () => A.Y() / 2, () => U.num(dist(xy(A), P))],
            { fontSize: 15, color: GREY, anchorX: 'middle', cssStyle: 'font-weight:bold', ...NO });
          sideTxt(B, -1); sideTxt(C, 1);
          let locked = true;
          const upd = () => {
            const ab = U.num(dist(xy(A), B)), ac = U.num(dist(xy(A), C)), b = Math.round(deg(A, pB, pC)), c = Math.round(deg(A, pC, pB));
            out.innerHTML = Math.abs(A.X()) < 0.05
              ? `$AB = AC = ${ab}$ · $\\angle B = \\angle C = ${b}^\\circ$<br><span style="color:${RED}">תיכון</span>, <span style="color:${BLUE}">גובה</span> ו<span style="color:${GREEN}">חוצה זווית</span> — <b>אותו קטע!</b>`
              : `$AB = ${ab}$, $AC = ${ac}$ · $\\angle B = ${b}^\\circ$, $\\angle C = ${c}^\\circ$<br>לא שווה שוקיים: <span style="color:${RED}">התיכון</span>, <span style="color:${BLUE}">הגובה</span> ו<span style="color:${GREEN}">חוצה הזווית</span> נפרדים.`;
            U.math(out);
          };
          const btn = document.createElement('button'); btn.className = 'btn ghost'; btn.textContent = '🔓 שחרר את A';
          btn.onclick = () => {
            locked = !locked;
            if (locked) { A.makeGlider(axisLine); A.moveTo([0, Math.max(1, A.Y())]); } else A.free();
            btn.textContent = locked ? '🔓 שחרר את A' : '🔒 נעל את A על האמצע';
            brd.update(); upd();
          };
          el.appendChild(btn);
          brd.on('update', upd); upd();
        },
      },
      {
        title: 'מזווית הראש לזוויות הבסיס',
        desc: 'הזז את הסליידר של זווית הראש. מה קורה לזוויות הבסיס? מתי המשולש נהיה שווה צלעות?',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const st = { h: 40 };
          const brd = fig(el, [-5.5, 5.5, 5.5, -5.5]);
          const L = 5, A = [0, 4.3];
          const B = brd.create('point', [() => A[0] - L * Math.sin(st.h * D2R / 2), () => A[1] - L * Math.cos(st.h * D2R / 2)], { visible: false });
          const C = brd.create('point', [() => A[0] + L * Math.sin(st.h * D2R / 2), () => A[1] - L * Math.cos(st.h * D2R / 2)], { visible: false });
          const pA = brd.create('point', A, { visible: false });
          poly(brd, [pA, B, C], { fixed: false });
          mark(brd, B, pA, C, () => st.h + '°', ORANGE, 0.8);
          mark(brd, pA, B, C, () => (180 - st.h) / 2 + '°', BLUE, 0.7);
          mark(brd, pA, C, B, () => (180 - st.h) / 2 + '°', BLUE, 0.7);
          brd.create('text', [-0.25, 4.85, 'A'], { fontSize: 18, ...NO });
          brd.create('text', [() => B.X(), () => B.Y() - 0.5, () => 'BC = ' + U.num(dist(xy(B), xy(C)))], { fontSize: 15, color: GREEN, ...NO });
          brd.create('text', [() => (A[0] + C.X()) / 2 + 0.3, () => (A[1] + C.Y()) / 2, 'AC = 5'], { fontSize: 15, color: GREY, ...NO });
          brd.create('text', [() => (A[0] + B.X()) / 2 - 1.6, () => (A[1] + B.Y()) / 2, 'AB = 5'], { fontSize: 15, color: GREY, ...NO });
          U.slider(el, { label: 'זווית הראש', min: 20, max: 160, step: 2, value: st.h, fmt: v => v + '°', onInput: v => {
            st.h = v; brd.update();
            out.innerHTML = `זווית בסיס $= \\frac{180 - ${v}}{2} = \\frac{${180 - v}}{2} = ${(180 - v) / 2}^\\circ$` + (v === 60 ? '<br>⭐ <b>משולש שווה צלעות!</b> כל הצלעות 5 וכל הזוויות 60°.' : '');
            U.math(out);
          } });
        },
      },
      {
        title: 'שווה שוקיים במערכת צירים',
        desc: 'גרור את A (וגם את B ו־C אם תרצה) לנקודות שלמות. מתי AB = AC? שים לב לקו המקווקו — האנך האמצעי של הבסיס.',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = U.board(el, [-7, 7, 7, -7]);
          const P = (x, y, n) => brd.create('point', [x, y], { name: n, color: ORANGE, size: 6, snapToGrid: true, label: { fontSize: 18 } });
          const B = P(-3, -2, 'B'), C = P(3, -2, 'C'), A = P(2, 4, 'A');
          brd.create('polygon', [A, B, C], { fillColor: '#ffe9d6', fillOpacity: 0.4, borders: { strokeColor: '#222', strokeWidth: 2.5, highlight: false }, vertices: { visible: false }, highlight: false });
          const M = brd.create('midpoint', [B, C], { visible: false });
          const segBC = brd.create('segment', [B, C], { visible: false });
          brd.create('perpendicular', [segBC, M], { strokeColor: PURPLE, dash: 2, strokeWidth: 2, highlight: false });
          const area = () => Math.abs((B.X() - A.X()) * (C.Y() - A.Y()) - (C.X() - A.X()) * (B.Y() - A.Y())) / 2;
          const upd = () => {
            const ab = dist(xy(A), xy(B)), ac = dist(xy(A), xy(C)), iso = Math.abs(ab - ac) < 1e-6 && area() > 0;
            out.innerHTML = `$AB = ${U.num(ab)}$, $AC = ${U.num(ac)}$ · שטח $= ${U.num(area())}$` +
              (iso ? '<br>🏀 <b>שווה שוקיים!</b> A נמצאת על האנך האמצעי של הבסיס' + (B.Y() === C.Y() ? `, על הישר $x = ${U.num((B.X() + C.X()) / 2)}$.` : '.') : '');
            U.math(out);
          };
          brd.on('update', upd); upd();
        },
      },
    ],

    exercises: dedupe([
      { level: 1, gen() {
        const h = U.R(10, 80) * 2, b = (180 - h) / 2;
        return {
          q: `במשולש $ABC$: $AB = AC$, וזווית הראש $\\angle A = ${h}^\\circ$. מה גודל זווית הבסיס $\\angle B$?`,
          type: 'number', answer: b,
          mount: el => isoFig(el, h, { A: h + '°', B: '?' }),
          hint: 'זוויות הבסיס שוות. כמה נשאר מ־180 אחרי זווית הראש? מחלקים את זה לשתיים.',
          steps: ['$AB = AC$, ולכן $\\angle B = \\angle C$.', `$180 - ${h} = ${180 - h}$`, `$${180 - h} \\div 2 = ${b}$, כלומר $\\angle B = ${b}^\\circ$.`],
        };
      } },
      { level: 1, gen() {
        const b = U.R(20, 85), h = 180 - 2 * b;
        return {
          q: `במשולש $ABC$: $AB = AC$, וזווית הבסיס $\\angle B = ${b}^\\circ$. מה גודל זווית הראש $\\angle A$?`,
          type: 'number', answer: h,
          mount: el => isoFig(el, h, { A: '?', B: b + '°' }),
          hint: 'גם $\\angle C$ שווה ל־$\\angle B$. כמה נשאר מ־180 אחרי שתי זוויות הבסיס?',
          steps: [`$AB = AC$, ולכן $\\angle C = \\angle B = ${b}^\\circ$.`, `שתי זוויות הבסיס יחד: $${b} + ${b} = ${2 * b}$.`, `$\\angle A = 180 - ${2 * b} = ${h}^\\circ$.`],
        };
      } },
      { level: 1, gen() {
        const l = U.R(4, 15), base = U.R(2, 2 * l - 2);
        return {
          q: `במשולש שווה שוקיים אורך כל שוק הוא $${l}$ ס"מ ואורך הבסיס $${base}$ ס"מ. מה ההיקף?`,
          type: 'number', answer: 2 * l + base,
          mount: el => isoFig(el, 2 * Math.asin(base / 2 / l) / D2R, { sides: { AB: String(l), AC: String(l), BC: String(base) } }),
          hint: 'היקף = סכום כל הצלעות. יש שתי שוקיים!',
          steps: ['ההיקף = שוק + שוק + בסיס.', `$${l} + ${l} + ${base} = ${2 * l + base}$ ס"מ.`],
        };
      } },
      { level: 1, gen() {
        const v = U.R(0, 2), k = U.R(2, 12);
        if (v === 2) return {
          q: 'במשולש $ABC$: $AB = AC$, ו־$AD$ תיכון לבסיס $BC$. מה גודל הזווית $\\angle ADB$?',
          type: 'number', answer: 90,
          mount: el => isoFig(el, 50, { median: true }),
          hint: 'במשולש שווה שוקיים, התיכון לבסיס הוא גם... (מה עוד?)',
          steps: ['במשולש שווה שוקיים התיכון לבסיס הוא <b>גם גובה</b>.', 'גובה ניצב לבסיס, ולכן $\\angle ADB = 90^\\circ$.'],
        };
        return {
          q: v === 0 ? `במשולש $ABC$: $AB = AC$, ו־$AD$ הוא <b>הגובה</b> לבסיס. $BC = ${2 * k}$. מה אורך $BD$?` : `במשולש $ABC$: $AB = AC$, ו־$AD$ <b>חוצה</b> את זווית הראש. $BD = ${k}$. מה אורך $BC$?`,
          type: 'number', answer: v === 0 ? k : 2 * k,
          mount: el => isoFig(el, 50, { median: true }),
          hint: `במשולש שווה שוקיים ${v === 0 ? 'הגובה' : 'חוצה הזווית'} לבסיס הוא גם תיכון. מה זה אומר על $D$?`,
          steps: [`במשולש שווה שוקיים ${v === 0 ? 'הגובה' : 'חוצה זווית הראש'} הוא גם <b>תיכון</b>, ולכן $D$ אמצע $BC$.`,
            v === 0 ? `$BD = ${2 * k} \\div 2 = ${k}$.` : `$BC = 2 \\cdot ${k} = ${2 * k}$.`],
        };
      } },
      { level: 1, gen() {
        const s = U.R(2, 20), askAngle = Math.random() < 0.3;
        return askAngle ? {
          q: 'במשולש שווה צלעות, מה גודל כל זווית?',
          type: 'number', answer: 60,
          mount: el => isoFig(el, 60, { A: '?', B: '?', C: '?' }),
          hint: 'כל הזוויות שוות, וסכומן 180.',
          steps: ['במשולש שווה צלעות כל 3 הזוויות שוות.', '$180 \\div 3 = 60^\\circ$.'],
        } : {
          q: `היקף של משולש שווה צלעות הוא $${3 * s}$ ס"מ. מה אורך כל צלע?`,
          type: 'number', answer: s,
          mount: el => isoFig(el, 60, {}),
          hint: 'יש 3 צלעות שוות. מחלקים את ההיקף ל־3.',
          steps: ['3 צלעות שוות.', `$${3 * s} \\div 3 = ${s}$ ס"מ.`],
        };
      } },
      { level: 2, gen() {
        const b = U.R(2, 10) * 2, h = U.R(2, 12), A = b * h / 2, askArea = Math.random() < 0.5;
        return {
          q: askArea ? `במשולש שווה שוקיים הבסיס הוא $${b}$ ס"מ, והגובה לבסיס $${h}$ ס"מ. מה שטח המשולש?`
            : `שטח משולש שווה שוקיים הוא $${A}$ סמ"ר, והבסיס שלו $${b}$ ס"מ. מה אורך הגובה לבסיס?`,
          type: 'number', answer: askArea ? A : h,
          mount: el => isoFig(el, 2 * Math.atan(b / 2 / h) / D2R, { median: true, sides: { BC: String(b) }, AD: askArea ? String(h) : '?' }),
          hint: askArea ? 'שטח משולש = בסיס כפול גובה, חלקי 2.' : 'כתוב משוואה: $\\frac{' + b + ' \\cdot h}{2} = ' + A + '$.',
          steps: askArea ? [`שטח $= \\frac{${b} \\cdot ${h}}{2}$`, `$= \\frac{${b * h}}{2} = ${A}$ סמ"ר.`]
            : [`$\\frac{${b} \\cdot h}{2} = ${A}$`, `$${b / 2} \\cdot h = ${A}$`, `$h = ${A} \\div ${b / 2} = ${h}$ ס"מ.`],
        };
      } },
      { level: 2, gen() {
        const x = U.R(2, 10); let m1 = U.R(2, 5), m2 = U.R(1, 4); if (m1 === m2) m1++;
        const v = Math.max(m1, m2) * x + U.R(1, 9), b1 = v - m1 * x, b2 = v - m2 * x;
        const big = m1 > m2 ? [m1, b1, m2, b2] : [m2, b2, m1, b1];
        return {
          q: `במשולש $ABC$: $AB = AC$. נתון $AB = ${U.lin(m1, b1)}$ ו־$AC = ${U.lin(m2, b2)}$ (בס"מ). מצאו את $x$.`,
          type: 'number', answer: x,
          mount: el => isoFig(el, 50, { sides: { AB: U.lin(m1, b1), AC: U.lin(m2, b2) } }),
          hint: 'השוקיים שוות. כתוב משוואה: ביטוי אחד = הביטוי השני.',
          steps: [`$${U.lin(m1, b1)} = ${U.lin(m2, b2)}$`, `$${U.term(big[0] - big[2])} = ${big[3] - big[1]}$`, `$x = ${x}$`, `בדיקה: כל שוק יוצאת $${v}$ ס"מ ✔`],
        };
      } },
      { level: 2, gen() {
        const a = U.R(-6, 1), w = U.R(1, 3) * 2, k = U.R(-4, 1), h = U.pick([-3, -2, 2, 3, 4, 5]);
        const B = [a, k], C = [a + 2 * w, k], m = a + w, A = [m, k + h];
        return {
          q: `במשולש $ABC$: $AB = AC$. נתון $B${pt(B)}$, $C${pt(C)}$, והקודקוד $A$ נמצא על הישר $y = ${k + h}$. מצאו את $A$.`,
          type: 'pair', answer: A,
          mount(el) {
            const brd = U.board(el, [-8, 8, 8, -8]);
            [[B, 'B'], [C, 'C']].forEach(([p, n]) => brd.create('point', p, { name: n, color: ORANGE, size: 4, ...NO, label: { fontSize: 16 } }));
            seg(brd, B, C);
            brd.create('line', [[0, k + h], [1, k + h]], { strokeColor: PURPLE, dash: 2, ...NO });
          },
          hint: 'כש־$AB = AC$, הקודקוד $A$ נמצא בדיוק מעל (או מתחת) לאמצע הבסיס. מה ה־x של האמצע?',
          steps: ['$AB = AC$, ולכן $A$ על האנך האמצעי של $BC$ — מעל אמצע הבסיס.', `אמצע $BC$: $x = \\frac{${a} + ${a + 2 * w < 0 ? `(${a + 2 * w})` : a + 2 * w}}{2} = ${m}$.`, `ה־y של $A$ נתון: $${k + h}$.`, `$A${pt(A)}$`],
        };
      } },
      { level: 2, gen() {
        const P = U.pick(PROOFS), k = U.R(0, P.rows.length - 1), right = P.rows[k][1];
        const choices = U.shuffle([right, ...U.shuffle(REASONS.filter(r => r !== right)).slice(0, 3)]);
        return {
          q: `נתון: ${P.given} צריך להוכיח: ${P.goal}. מה הנימוק החסר בהוכחה?${proofTable(P.rows, k)}`,
          type: 'choice', choices, answer: choices.indexOf(right),
          mount: el => proofFig(el, P),
          hint: 'קרא את הטענה בשורה עם ה־?. האם זה כתוב בנתון? האם זו צלע ששייכת לשני המשולשים? תכונה של שווה שוקיים? או משפט חפיפה?',
          steps: [`הטענה: ${P.rows[k][0]}.`, `הנימוק: <b>${right}</b> ${P.rows[k][2]}.`],
        };
      } },
      { level: 3, gen() {
        let x, beta, head; do { x = U.R(4, 25); beta = U.R(25, 80); head = 180 - 2 * beta; } while (head < 10);
        const m2 = U.R(1, 3), b2 = beta - m2 * x, m1 = U.R(1, 4), b1 = head - m1 * x;
        const e1 = U.lin(m1, b1), e2 = U.lin(m2, b2), M = m1 + 2 * m2, Bs = b1 + 2 * b2;
        return {
          q: `במשולש $ABC$: $AB = AC$. זווית הראש $\\angle A = ${e1}$ וזווית הבסיס $\\angle B = ${e2}$ (במעלות). מצאו את $x$.`,
          type: 'number', answer: x,
          mount: el => isoFig(el, head, { A: e1, B: e2, C: '' }),
          hint: 'גם $\\angle C = ' + e2 + '$ (זוויות בסיס שוות). סכום שלוש הזוויות: 180.',
          steps: [`$\\angle C = \\angle B = ${e2}$ (זוויות בסיס).`, `$(${e1}) + 2(${e2}) = 180$`, `$${U.lin(M, Bs)} = 180$`, `$${U.term(M)} = ${180 - Bs}$`, `$x = ${x}$`, `בדיקה: $${head} + ${beta} + ${beta} = 180$ ✔`],
        };
      } },
      { level: 3, gen() {
        const a = U.R(-6, 0), w = U.R(1, 4), k = U.R(-5, 0);
        let h = U.R(2, 6) * U.pick([1, 1, -1]); if (k + h < -7) h = -h;
        const B = [a, k], C = [a + 2 * w, k], A = [a + w, k + h];
        const H = Math.abs(A[1] - k), area = w * H;
        return {
          q: `במשולש $ABC$: $A${pt(A)}$, $B${pt(B)}$, $C${pt(C)}$. הראו לעצמכם שהמשולש שווה שוקיים, וחשבו את שטחו.`,
          type: 'number', answer: area,
          mount(el) {
            const brd = U.board(el, [-8, 8, 8, -8]);
            [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p, n]) => brd.create('point', p, { name: n, color: ORANGE, size: 4, ...NO, label: { fontSize: 16 } }));
            brd.create('polygon', [A, B, C], { fillColor: '#ffe9d6', fillOpacity: 0.4, borders: { strokeColor: '#222', strokeWidth: 2, ...NO }, vertices: { visible: false }, ...NO });
          },
          hint: 'הבסיס $BC$ אופקי — אורכו הוא ההפרש בין ה־x־ים. הגובה הוא המרחק של $A$ מהישר $y = ' + k + '$.',
          steps: [`$A$ נמצא בדיוק ${A[1] > k ? 'מעל' : 'מתחת ל'}אמצע $BC$ ($x = ${a + w}$), ולכן $AB = AC$.`, `בסיס: $BC = ${a + 2 * w} - ${a < 0 ? `(${a})` : a} = ${2 * w}$.`,
            `גובה: המרחק בין $y = ${A[1]}$ ל־$y = ${k}$ הוא $${H}$.`, `שטח $= \\frac{${2 * w} \\cdot ${H}}{2} = ${area}$.`],
        };
      } },
      { level: 3, gen() {
        const e = U.R(100, 165), base = 180 - e, head = 180 - 2 * base;
        return {
          q: `במשולש $ABC$: $AB = AC$. ממשיכים את הבסיס $BC$ מעבר ל־$C$ עד $E$. הזווית החיצונית $\\angle ACE = ${e}^\\circ$. מה גודל זווית הראש $\\angle A$?`,
          type: 'number', answer: head,
          mount: el => isoFig(el, head, { A: '?', ext: e + '°' }),
          hint: 'קודם מצא את $\\angle ACB$ (צמודה לזווית החיצונית). אחר כך: זוויות הבסיס שוות.',
          steps: [`$\\angle ACB = 180 - ${e} = ${base}^\\circ$ (זוויות צמודות).`, `זוויות הבסיס שוות: $\\angle B = ${base}^\\circ$.`, `$\\angle A = 180 - ${base} - ${base} = ${head}^\\circ$.`,
            `בדיקה בעזרת זווית חיצונית: $\\angle A + \\angle B = ${head} + ${base} = ${e}$ ✔`],
        };
      } },
    ]),

    summary: [
      'שווה שוקיים: שתי צלעות שוות (שוקיים). השלישית — בסיס.',
      '<b>זוויות הבסיס שוות.</b> זווית בסיס $= \\frac{180 - \\text{זווית הראש}}{2}$.',
      'הקטע מזווית הראש לבסיס הוא בבת אחת <b>תיכון, גובה וחוצה זווית</b>.',
      'שווה צלעות: כל הצלעות שוות וכל הזוויות $60^\\circ$.',
      'שטח = בסיס × גובה ÷ 2. במערכת צירים: $A$ נמצא מעל אמצע הבסיס.',
      'כשיש $x$: משווים שוקיים, או כותבים "סכום הזוויות = 180" (עם שתי זוויות בסיס שוות).',
    ],
  });
})();
