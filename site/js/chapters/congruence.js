/* יחידה: חפיפת משולשים ותיכון (פרקים 21–24 בספר) */
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
  const fig = (el, bb = [-6, 6, 6, -6]) => U.board(el, bb, { axis: false, grid: false });
  const ORANGE = '#e8702a', BLUE = '#2f6fdb', GREEN = '#1f9d55', RED = '#d63c3c', GREY = '#555';
  const COLS = [ORANGE, BLUE, GREEN];
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
  const vlabel = (brd, P, name, ctr, o = {}) => {
    const u = unit(P, ctr);
    brd.create('text', [P[0] + 0.5 * u[0], P[1] + 0.5 * u[1], name], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, ...NO, ...o });
  };
  /** סימון צלעות שוות: n קווים קטנים באמצע הקטע */
  function ticks(brd, P, Q, n, color = RED) {
    const m = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], u = unit(Q, P), v = [-u[1], u[0]], L = 0.25;
    for (let k = 0; k < n; k++) {
      const off = (k - (n - 1) / 2) * 0.17, c = [m[0] + u[0] * off, m[1] + u[1] * off];
      seg(brd, [c[0] - v[0] * L, c[1] - v[1] * L], [c[0] + v[0] * L, c[1] + v[1] * L], { strokeColor: color, strokeWidth: 2.5 });
    }
  }
  const ctr = pts => [(pts[0][0] + pts[1][0] + pts[2][0]) / 3, (pts[0][1] + pts[1][1] + pts[2][1]) / 3];
  const poly = (brd, pts, o = {}) => brd.create('polygon', pts, { fillColor: '#ffe9d6', fillOpacity: 0.35, borders: { strokeColor: '#222', strokeWidth: 2.5, ...NO }, vertices: { visible: false }, ...NO, ...o });

  const SHAPES = [[[0, 0], [4.5, 0], [1.2, 3]], [[0, 0], [4, 0], [3, 3.2]], [[0, 0], [4.6, 0], [2.2, 2.6]], [[0, 0], [3.8, 0], [0.6, 3.4]]];
  /** שני משולשים חופפים (השני מוזז או משוקף) עם סימון הנתונים.
      given: [{s:[i,j]}, {a:i}] — צלע בין קודקודים i,j / זווית בקודקוד i */
  function pairFig(el, shape, given, names = ['ABC', 'DEF'], flip = false) {
    const brd = fig(el, [-6.5, 5.2, 6.5, -7.8]);
    const T1 = shape.map(p => [p[0] - 5.5, p[1] - 3]);
    const T2 = shape.map(p => flip ? [5.5 - p[0], p[1] - 3] : [p[0] + 0.9, p[1] - 3]);
    [T1, T2].forEach((T, t) => {
      poly(brd, T);
      const g = ctr(T);
      T.forEach((p, i) => vlabel(brd, p, names[t][i], g));
      let ns = 0, na = 0;
      for (const e of given) {
        if (e.s) ticks(brd, T[e.s[0]], T[e.s[1]], ++ns);
        else { const i = e.a; mark(brd, T[(i + 1) % 3], T[i], T[(i + 2) % 3], '', COLS[na++], 0.55); }
      }
    });
    return brd;
  }

  /* ---- מילים ומשפטים ---- */
  const TH = ['צ.ז.צ', 'ז.צ.ז', 'צ.צ.צ'];
  const thWhy = ['שתי צלעות <b>והזווית שביניהן</b>', 'שתי זוויות <b>והצלע שביניהן</b>', 'שלוש צלעות'];
  /** נתונים לכל סוג: 0 צ.ז.צ, 1 ז.צ.ז, 2 צ.צ.צ, 3 צ.צ.ז (לא משפט), 4 ז.ז.ז (לא משפט) */
  function givenFor(kind) {
    const v = U.R(0, 2), a = (v + 1) % 3, b = (v + 2) % 3;
    return [
      [{ s: [v, a] }, { s: [v, b] }, { a: v }],
      [{ a: v }, { a }, { s: [v, a] }],
      [{ s: [0, 1] }, { s: [1, 2] }, { s: [0, 2] }],
      [{ s: [v, a] }, { s: [v, b] }, { a }],
      [{ a: 0 }, { a: 1 }, { a: 2 }],
    ][kind];
  }
  const describe = (given, L, M) => given.map(e => e.s
    ? `$${L[e.s[0]]}${L[e.s[1]]} = ${M[e.s[0]]}${M[e.s[1]]}$`
    : `$\\angle ${L[e.a]} = \\angle ${M[e.a]}$`).join(', ');

  /* ---- הוכחות בסיסיות: תבניות ---- */
  const PROOFS = [
    { given: '$AD$ ו־$BC$ נחתכים בנקודה $O$. הנקודה $O$ היא אמצע $AD$ וגם אמצע $BC$.', goal: '$\\triangle AOB \\cong \\triangle DOC$',
      pts: { A: [-4, 2.5], B: [-2.5, -3], C: [2.5, 3], D: [4, -2.5], O: [0, 0] }, segs: ['AD', 'BC', 'AB', 'DC'],
      rows: [['$AO = DO$', 'נתון', '— $O$ אמצע $AD$'], ['$BO = CO$', 'נתון', '— $O$ אמצע $BC$'], ['$\\angle AOB = \\angle DOC$', 'זוויות קודקודיות', ''],
        ['$\\triangle AOB \\cong \\triangle DOC$', 'צ.ז.צ', ''], ['$AB = DC$', 'צלעות מתאימות במשולשים חופפים', '']] },
    { given: '$AB = AD$ וגם $CB = CD$.', goal: '$\\triangle ABC \\cong \\triangle ADC$',
      pts: { A: [0, 4], B: [-3, 1], C: [0, -4], D: [3, 1] }, segs: ['AB', 'AD', 'CB', 'CD', 'AC'],
      rows: [['$AB = AD$', 'נתון', ''], ['$CB = CD$', 'נתון', ''], ['$AC = AC$', 'צלע משותפת', ''],
        ['$\\triangle ABC \\cong \\triangle ADC$', 'צ.צ.צ', ''], ['$\\angle B = \\angle D$', 'זוויות מתאימות במשולשים חופפים', '']] },
    { given: '$AC$ חוצה את הזווית $BAD$ (כלומר $\\angle BAC = \\angle DAC$), וגם $AB = AD$.', goal: '$\\triangle ABC \\cong \\triangle ADC$',
      pts: { A: [-4.5, 0], B: [0.5, 3], C: [4, 0], D: [0.5, -3] }, segs: ['AB', 'AD', 'AC', 'BC', 'DC'],
      rows: [['$AB = AD$', 'נתון', ''], ['$\\angle BAC = \\angle DAC$', 'נתון', '— $AC$ חוצה זווית'], ['$AC = AC$', 'צלע משותפת', ''],
        ['$\\triangle ABC \\cong \\triangle ADC$', 'צ.ז.צ', ''], ['$BC = DC$', 'צלעות מתאימות במשולשים חופפים', '']] },
    { given: '$AB \\parallel CD$. הקטעים $AD$ ו־$BC$ נחתכים בנקודה $O$, ו־$O$ היא אמצע $BC$.', goal: '$\\triangle AOB \\cong \\triangle DOC$',
      pts: { A: [-5, 3], B: [-1, 3], C: [1, -3], D: [5, -3], O: [0, 0] }, segs: ['AB', 'CD', 'AD', 'BC'],
      rows: [['$BO = CO$', 'נתון', '— $O$ אמצע $BC$'], ['$\\angle ABO = \\angle DCO$', 'זוויות מתחלפות בין ישרים מקבילים', ''], ['$\\angle AOB = \\angle DOC$', 'זוויות קודקודיות', ''],
        ['$\\triangle AOB \\cong \\triangle DOC$', 'ז.צ.ז', '']] },
  ];
  const REASONS = ['נתון', 'זוויות קודקודיות', 'צלע משותפת', 'צ.ז.צ', 'ז.צ.ז', 'צ.צ.צ', 'זוויות מתחלפות בין ישרים מקבילים', 'צלעות מתאימות במשולשים חופפים', 'זוויות מתאימות במשולשים חופפים', 'זוויות צמודות'];
  const proofTable = (rows, hide) => `<table style="border-collapse:collapse;margin:10px auto;font-size:1rem">
    <tr><th style="border:1px solid #999;padding:4px 12px">טענה</th><th style="border:1px solid #999;padding:4px 12px">נימוק</th></tr>
    ${rows.map((r, k) => `<tr><td style="border:1px solid #999;padding:4px 12px" dir="ltr">${r[0]}</td><td style="border:1px solid #999;padding:4px 12px">${k === hide ? '<b>?</b>' : r[1] + ' ' + r[2]}</td></tr>`).join('')}</table>`;
  function proofFig(el, P) {
    const brd = fig(el);
    P.segs.forEach(s => seg(brd, P.pts[s[0]], P.pts[s[1]]));
    const all = Object.values(P.pts), g = [all.reduce((s, p) => s + p[0], 0) / all.length, all.reduce((s, p) => s + p[1], 0) / all.length];
    for (const [n, p] of Object.entries(P.pts)) vlabel(brd, p, n, n === 'O' ? [p[0] + 1, p[1]] : g);
  }

  const SVG_EX = `<svg viewBox="0 0 300 190" width="300" style="max-width:100%;display:block;margin:10px auto" dir="ltr" font-family="Rubik,sans-serif">
    <line x1="40" y1="40" x2="260" y2="150" stroke="#2f6fdb" stroke-width="3"/><line x1="70" y1="160" x2="230" y2="30" stroke="#2f6fdb" stroke-width="3"/>
    <line x1="40" y1="40" x2="70" y2="160" stroke="currentColor" stroke-width="2.5"/><line x1="230" y1="30" x2="260" y2="150" stroke="currentColor" stroke-width="2.5"/>
    <g stroke="#d63c3c" stroke-width="2.5"><line x1="91" y1="58" x2="99" y2="72"/><line x1="201" y1="113" x2="209" y2="127"/>
    <line x1="106" y1="113" x2="115" y2="123"/><line x1="111" y1="109" x2="120" y2="119"/><line x1="181" y1="72" x2="190" y2="82"/><line x1="186" y1="68" x2="195" y2="78"/></g>
    <text x="24" y="38" font-size="17" fill="currentColor">A</text><text x="56" y="178" font-size="17" fill="currentColor">B</text><text x="234" y="24" font-size="17" fill="currentColor">C</text><text x="264" y="166" font-size="17" fill="currentColor">D</text><text x="146" y="80" font-size="17" fill="currentColor">O</text></svg>`;

  registerChapter('congruence', {
    intro: `
      <div class="idea"><b>משולשים חופפים</b>שני משולשים עם <b>אותה צורה ואותו גודל</b>. אפשר להניח אחד על השני כך שיתאימו בדיוק — גם אם צריך להזיז, לסובב או להפוך.
        <br>במשולשים חופפים כל 3 הצלעות וכל 3 הזוויות המתאימות שוות.</div>
      <div class="idea"><b>הכתיב — הסדר חשוב!</b>$\\triangle ABC \\cong \\triangle DEF$ אומר: $A$ מתאים ל־$D$, $B$ ל־$E$, $C$ ל־$F$.
        <br>ולכן: $AB = DE$, $BC = EF$, $AC = DF$ וגם $\\angle A = \\angle D$, $\\angle B = \\angle E$, $\\angle C = \\angle F$.</div>
      <div class="idea"><b>משפטי חפיפה — מספיקים 3 נתונים</b>
        <b>צ.ז.צ</b> — שתי צלעות <b>והזווית שביניהן</b>.<br><b>ז.צ.ז</b> — שתי זוויות <b>והצלע שביניהן</b>.<br><b>צ.צ.צ</b> — שלוש צלעות.</div>
      <div class="note"><b>זהירות:</b> צ.צ.ז (כשהזווית <b>לא</b> בין שתי הצלעות) וז.ז.ז הם <b>לא</b> משפטי חפיפה. בכלי השני תראה למה.</div>
      <div class="idea"><b>הוכחה</b>כותבים טבלה: בכל שורה <b>טענה</b> (מה נכון) ו<b>נימוק</b> (למה זה נכון): נתון, זוויות קודקודיות, צלע משותפת, משפט חפיפה...
        <br>אחרי שהוכחנו חפיפה, מותר להגיד שגם שאר הצלעות והזוויות המתאימות שוות.</div>
      <div class="idea"><b>תיכון</b>קטע שמחבר קודקוד <b>לאמצע הצלע שמולו</b>. אם $AM$ תיכון לצלע $BC$, אז $BM = MC$.
        <br>במערכת צירים, האמצע הוא <b>הממוצע</b> של הקואורדינטות:</div>
      <div class="formula">$M = \\left(\\frac{x_B + x_C}{2},\\ \\frac{y_B + y_C}{2}\\right)$</div>`,

    example: {
      question: `הקטעים $AD$ ו־$BC$ נחתכים בנקודה $O$. נתון: $O$ אמצע $AD$, ו־$O$ אמצע $BC$. הוכיחו ש־$\\triangle AOB \\cong \\triangle DOC$, והסיקו ש־$AB = DC$.${SVG_EX}`,
      steps: [
        'מה צריך? 3 נתונים מתאימים בשני המשולשים $AOB$ ו־$DOC$. נחפש אותם אחד אחד.',
        'טענה: $AO = DO$. נימוק: <b>נתון</b> — $O$ אמצע $AD$, אז הוא מחלק אותו לשני חלקים שווים.',
        'טענה: $BO = CO$. נימוק: <b>נתון</b> — $O$ אמצע $BC$.',
        'טענה: $\\angle AOB = \\angle DOC$. נימוק: <b>זוויות קודקודיות</b> (הן אחת מול השנייה ב־X).',
        'בדיקה: יש לנו שתי צלעות, והזווית $O$ נמצאת <b>בדיוק ביניהן</b>. זה בדיוק צ.ז.צ!',
        'טענה: $\\triangle AOB \\cong \\triangle DOC$. נימוק: <b>צ.ז.צ</b>. (הסדר: $A↔D$, $O↔O$, $B↔C$.)',
        'טענה: $AB = DC$. נימוק: <b>צלעות מתאימות במשולשים חופפים</b> — $AB$ ו־$DC$ נמצאות באותו מקום בשני המשולשים.',
      ],
    },

    tools: [
      {
        title: 'הנח משולש על משולש',
        desc: 'גרור את הנקודה הכתומה D, סובב והפוך את המשולש הכחול עד שהוא יושב בדיוק על האדום. צבעי הקשתות מראים איזה קודקוד מתאים לאיזה.',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = fig(el, [-7, 7, 7, -7]);
          const T1 = [[-5.5, -5], [-1.5, -5], [-4.5, -1.5]];
          const st = { rot: U.pick([45, 90, 135, 180, 225, 270]), flip: Math.random() < 0.5 };
          const D = brd.create('point', [2.5, 1.5], { name: 'D', color: ORANGE, size: 7, label: { fontSize: 18, offset: [10, 10] } });
          const img = i => k => () => {
            let x = T1[i][0] - T1[0][0], y = T1[i][1] - T1[0][1];
            if (st.flip) x = -x;
            const c = Math.cos(st.rot * D2R), s = Math.sin(st.rot * D2R);
            return [x * c - y * s + D.X(), x * s + y * c + D.Y()][k];
          };
          const P1 = T1.map(p => brd.create('point', p, { visible: false }));
          const P2 = [0, 1, 2].map(i => i === 0 ? D : brd.create('point', [img(i)(0), img(i)(1)], { visible: false }));
          poly(brd, P1, { fillColor: '#f8c9c9', borders: { strokeColor: RED, strokeWidth: 3, ...NO } });
          poly(brd, P2, { fillColor: '#cfe0ff', fillOpacity: 0.5, borders: { strokeColor: BLUE, strokeWidth: 3, ...NO } });
          ['A', 'B', 'C'].forEach((n, i) => brd.create('text', [T1[i][0] + [-0.5, 0.4, -0.3][i], T1[i][1] + [-0.4, -0.4, 0.5][i], n], { fontSize: 18, color: RED, ...NO }));
          ['E', 'F'].forEach((n, k) => brd.create('text', [() => P2[k + 1].X() + 0.3, () => P2[k + 1].Y() + 0.3, n], { fontSize: 18, color: BLUE, ...NO }));
          [P1, P2].forEach(P => [0, 1, 2].forEach(i => mark(brd, P[(i + 1) % 3], P[i], P[(i + 2) % 3], () => Math.round(deg(P[(i + 1) % 3], P[i], P[(i + 2) % 3])) + '°', COLS[i], 0.5)));
          const side = (P, i, j) => brd.create('text', [() => (P[i].X() + P[j].X()) / 2, () => (P[i].Y() + P[j].Y()) / 2,
            () => U.num(dist(xy(P[i]), xy(P[j])))], { fontSize: 14, color: GREY, anchorX: 'middle', anchorY: 'middle', cssStyle: 'background:rgba(255,255,255,.8);padding:0 2px', ...NO });
          [P1, P2].forEach(P => { side(P, 0, 1); side(P, 1, 2); side(P, 0, 2); });
          const upd = () => {
            const ok = [0, 1, 2].every(i => dist(xy(P1[i]), xy(P2[i])) < 0.4);
            out.innerHTML = ok ? '🏀 חופפים! $\\triangle ABC \\cong \\triangle DEF$ — כל צלע וכל זווית מתאימה שוות.'
              : 'המשולשים זהים בגודל ובצורה, אבל עוד לא אחד על השני. נסה לשים את D על A.';
            U.math(out);
            return ok;
          };
          D.on('up', () => { if (dist(xy(D), T1[0]) < 0.5) { D.moveTo(T1[0]); } brd.update(); upd(); });
          D.on('drag', upd);
          U.slider(el, { label: 'סיבוב', min: 0, max: 345, step: 15, value: st.rot, fmt: v => v + '°', onInput: v => { st.rot = v; brd.update(); upd(); } });
          const btn = document.createElement('button'); btn.className = 'btn ghost'; btn.textContent = '↔ הפוך (מראה)';
          btn.onclick = () => { st.flip = !st.flip; brd.update(); upd(); };
          el.appendChild(btn);
          upd();
        },
      },
      {
        title: 'למה הזווית חייבת להיות "בין"?',
        desc: 'הצלע AB והזווית A קבועות. גרור את C לאורך הקרן. בכל מצב חפש את כל המקומות שבהם הנתון מתקיים.',
        mount(el) {
          const row = document.createElement('div'); row.className = 'row'; row.style.justifyContent = 'center'; el.appendChild(row);
          const task = document.createElement('div'); task.className = 'readout'; el.appendChild(task);
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = fig(el, [-5, 6.5, 6.5, -5]);
          const A = [-4, -3], B = [2, -3], ANG = 35, far = [A[0] + 10 * Math.cos(ANG * D2R), A[1] + 10 * Math.sin(ANG * D2R)];
          const ray = seg(brd, A, far, { strokeColor: '#999', strokeWidth: 2, dash: 2 });
          seg(brd, A, B, { strokeWidth: 3.5 });
          brd.create('text', [A[0] - 0.5, A[1] - 0.3, 'A'], { fontSize: 18, ...NO });
          brd.create('text', [B[0] + 0.2, B[1] - 0.3, 'B'], { fontSize: 18, ...NO });
          brd.create('text', [-1.2, -3.5, 'AB = 6'], { fontSize: 15, ...NO });
          const C = brd.create('glider', [A[0] + 1.5 * Math.cos(ANG * D2R), A[1] + 1.5 * Math.sin(ANG * D2R), ray], { name: 'C', color: ORANGE, size: 7, label: { fontSize: 18, offset: [-18, 12] } });
          seg(brd, A, C, { strokeColor: BLUE, strokeWidth: 3 }); seg(brd, B, C, { strokeColor: GREEN, strokeWidth: 3 });
          mark(brd, B, A, C, '35°', ORANGE, 0.9);
          const t = () => dist(xy(C), A);
          const MODES = {
            'צ.ז.צ': { text: 'נתון: $AB = 6$, $\\angle A = 35^\\circ$, $AC = 4$. הזווית <b>בין</b> הצלעות. גרור את C עד ש־$AC = 4$.', val: () => t(), sols: [4] },
            'צ.צ.ז': { text: 'נתון: $AB = 6$, $\\angle A = 35^\\circ$, $BC = 4$. הזווית <b>לא בין</b> הצלעות. גרור את C עד ש־$BC = 4$.', val: () => dist(xy(C), B),
              sols: (() => { const c = Math.cos(ANG * D2R), q = 12 * c, d = Math.sqrt(q * q - 4 * 20); return [(q - d) / 2, (q + d) / 2]; })() },
          };
          let mode = 'צ.ז.צ', found = [], ghosts = [];
          const reset = () => {
            ghosts.forEach(g => brd.removeObject(g)); ghosts = []; found = [];
            task.innerHTML = MODES[mode].text; U.math(task); show();
          };
          const show = () => {
            const m = MODES[mode], name = mode === 'צ.ז.צ' ? 'AC' : 'BC';
            let s = `$AC = ${U.num(t())}$, $BC = ${U.num(dist(xy(C), B))}$ &nbsp;·&nbsp; כמה מקומות מתאימים יש?`;
            if (mode === 'צ.ז.צ' && found.length) s = `✔ יש <b>רק מקום אחד</b> שבו $${name} = 4$. הנתונים קובעים משולש אחד בלבד — לכן צ.ז.צ הוא משפט חפיפה.`;
            if (mode === 'צ.צ.ז' && found.length === 1) s = `מצאת מקום אחד שבו $BC = 4$. יש עוד אחד! המשך לגרור.`;
            if (mode === 'צ.צ.ז' && found.length === 2) s = '😮 יש <b>שני משולשים שונים</b> עם אותם נתונים! לכן צ.צ.ז הוא <b>לא</b> משפט חפיפה.';
            out.innerHTML = s; U.math(out);
          };
          C.on('drag', show);
          C.on('up', () => {
            const sol = MODES[mode].sols.find(s => Math.abs(t() - s) < 0.25);
            if (sol === undefined) return;
            C.moveTo([A[0] + sol * Math.cos(ANG * D2R), A[1] + sol * Math.sin(ANG * D2R)]);
            if (!found.includes(sol)) {
              found.push(sol);
              ghosts.push(poly(brd, [A, B, [C.X(), C.Y()]], { fillColor: found.length === 1 ? '#ffd9a8' : '#bfe8c9', fillOpacity: 0.55, borders: { strokeColor: GREY, strokeWidth: 1, dash: 2, ...NO } }));
            }
            show();
          });
          for (const k of Object.keys(MODES)) {
            const b = document.createElement('button'); b.className = 'btn' + (k === mode ? '' : ' ghost'); b.textContent = k;
            b.onclick = () => { mode = k; row.querySelectorAll('button').forEach(x => x.classList.toggle('ghost', x !== b)); reset(); };
            row.appendChild(b);
          }
          reset();
        },
      },
      {
        title: 'התיכון במערכת צירים',
        desc: 'גרור את הקודקודים (הם קופצים לנקודות שלמות). M היא אמצע BC, ו־AM הוא התיכון. בדוק: מה תמיד שווה?',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = U.board(el, [-7, 7, 7, -7]);
          const P = (x, y, n) => brd.create('point', [x, y], { name: n, color: ORANGE, size: 6, snapToGrid: true, label: { fontSize: 18 } });
          const A = P(-1, 5, 'A'), B = P(-5, -3, 'B'), C = P(5, -1, 'C');
          const M = brd.create('midpoint', [B, C], { name: 'M', color: RED, size: 5, label: { fontSize: 18, offset: [6, -14] } });
          brd.create('polygon', [A, B, M], { fillColor: '#ffd9a8', fillOpacity: 0.5, borders: { strokeColor: '#222', strokeWidth: 2.5, highlight: false }, vertices: { visible: false }, highlight: false });
          brd.create('polygon', [A, M, C], { fillColor: '#cfe0ff', fillOpacity: 0.6, borders: { strokeColor: '#222', strokeWidth: 2.5, highlight: false }, vertices: { visible: false }, highlight: false });
          brd.create('segment', [A, M], { strokeColor: RED, strokeWidth: 4, highlight: false });
          const area = (p, q, r) => Math.abs((q.X() - p.X()) * (r.Y() - p.Y()) - (r.X() - p.X()) * (q.Y() - p.Y())) / 2;
          const upd = () => {
            out.innerHTML = `$M = (${U.num(M.X())}, ${U.num(M.Y())})$ &nbsp;·&nbsp; $BM = MC = ${U.num(dist(xy(B), xy(M)))}$<br>שטח כתום $= ${U.num(area(A, B, M))}$ &nbsp;·&nbsp; שטח כחול $= ${U.num(area(A, M, C))}$`;
            U.math(out);
          };
          brd.on('update', upd); upd();
          el.insertAdjacentHTML('beforeend', '<p class="muted">התיכון חוצה את הצלע לשני חלקים שווים, וגם מחלק את המשולש לשני משולשים עם <b>שטח שווה</b> (אותו בסיס ואותו גובה).</p>');
        },
      },
    ],

    exercises: dedupe([
      { level: 1, gen() {
        const perm = U.shuffle([0, 1, 2]), L = perm.map(i => 'ABC'[i]);
        const second = U.pick(['DEF', 'KLM', 'PQR', 'STU']), Ms = perm.map(i => second[i]);
        const askSide = Math.random() < 0.6;
        if (askSide) {
          const [i, j] = U.shuffle([0, 1, 2]).slice(0, 2), sides = [[0, 1], [1, 2], [0, 2]];
          const choices = sides.map(([a, b]) => `$${[Ms[a], Ms[b]].sort().join('')}$`);
          const ans = sides.findIndex(([a, b]) => (a === Math.min(i, j) && b === Math.max(i, j)));
          return {
            q: `נתון: $\\triangle ${L.join('')} \\cong \\triangle ${Ms.join('')}$. איזו צלע שווה ל־$${L[i]}${L[j]}$?`,
            type: 'choice', choices, answer: ans,
            hint: 'כתוב את שני השמות זה מתחת לזה: האות הראשונה מתאימה לראשונה, השנייה לשנייה, השלישית לשלישית.',
            steps: [`ההתאמה לפי הסדר: $${L[0]} ↔ ${Ms[0]}$, $${L[1]} ↔ ${Ms[1]}$, $${L[2]} ↔ ${Ms[2]}$.`, `$${L[i]} ↔ ${Ms[i]}$ ו־$${L[j]} ↔ ${Ms[j]}$.`, `לכן $${L[i]}${L[j]} = ${Ms[i]}${Ms[j]}$.`],
          };
        }
        const i = U.R(0, 2);
        return {
          q: `נתון: $\\triangle ${L.join('')} \\cong \\triangle ${Ms.join('')}$. איזו זווית שווה ל־$\\angle ${L[i]}$?`,
          type: 'choice', choices: [0, 1, 2].map(k => `$\\angle ${second[k]}$`), answer: perm[i],
          hint: 'מצא באיזה מקום (ראשון, שני או שלישי) נמצאת האות בשם המשולש הראשון, וקח את האות באותו מקום בשם השני.',
          steps: [`ההתאמה לפי הסדר: $${L[0]} ↔ ${Ms[0]}$, $${L[1]} ↔ ${Ms[1]}$, $${L[2]} ↔ ${Ms[2]}$.`, `$${L[i]}$ במקום ה־${i + 1}, ובמקום ה־${i + 1} בשם השני נמצא $${Ms[i]}$.`, `לכן $\\angle ${L[i]} = \\angle ${Ms[i]}$.`],
        };
      } },
      { level: 1, gen() {
        const perm = U.shuffle([0, 1, 2]), L = perm.map(i => 'ABC'[i]), Ms = perm.map(i => 'DEF'[i]);
        const side = Math.random() < 0.5;
        if (side) {
          const [i, j] = U.shuffle([0, 1, 2]).slice(0, 2), v = U.R(3, 15);
          return {
            q: `נתון: $\\triangle ${L.join('')} \\cong \\triangle ${Ms.join('')}$, ו־$${L[i]}${L[j]} = ${v}$ ס"מ. מה אורך $${Ms[i]}${Ms[j]}$?`,
            type: 'number', answer: v,
            hint: 'במשולשים חופפים צלעות מתאימות שוות. האם $' + `${Ms[i]}${Ms[j]}` + '$ מתאימה ל־$' + `${L[i]}${L[j]}` + '$?',
            steps: [`ההתאמה: $${L[i]} ↔ ${Ms[i]}$ ו־$${L[j]} ↔ ${Ms[j]}$.`, `לכן $${Ms[i]}${Ms[j]}$ מתאימה ל־$${L[i]}${L[j]}$.`, `צלעות מתאימות שוות: $${Ms[i]}${Ms[j]} = ${v}$ ס"מ.`],
          };
        }
        const i = U.R(0, 2), v = U.R(4, 16) * 5;
        return {
          q: `נתון: $\\triangle ${L.join('')} \\cong \\triangle ${Ms.join('')}$, ו־$\\angle ${L[i]} = ${v}^\\circ$. מה גודל $\\angle ${Ms[i]}$?`,
          type: 'number', answer: v,
          hint: 'בדוק אם הקודקודים נמצאים באותו מקום בשני השמות. אם כן — הזוויות מתאימות ושוות.',
          steps: [`$${L[i]}$ ו־$${Ms[i]}$ נמצאים באותו מקום (ה־${i + 1}) בשני השמות — הם מתאימים.`, `זוויות מתאימות במשולשים חופפים שוות: $\\angle ${Ms[i]} = ${v}^\\circ$.`],
        };
      } },
      { level: 1, gen() {
        const kind = U.R(0, 2), given = givenFor(kind), shape = U.pick(SHAPES), flip = Math.random() < 0.5;
        return {
          q: `במשולשים $ABC$ ו־$DEF$ נתון: ${describe(given, 'ABC', 'DEF')}. לפי איזה משפט המשולשים חופפים?`,
          type: 'choice', choices: TH, answer: kind,
          mount: el => pairFig(el, shape, given, ['ABC', 'DEF'], flip),
          mistakes: ['צ.ז.צ = שתי צלעות וזווית אחת ביניהן. ספור: כמה צלעות וכמה זוויות נתונות כאן?', 'ז.צ.ז = שתי זוויות וצלע אחת ביניהן. ספור: כמה זוויות וכמה צלעות נתונות כאן?', 'צ.צ.צ = שלוש צלעות. ספור: כמה צלעות נתונות כאן?'].map((why, v) => ({ v, why })),
          hint: 'ספור כמה צלעות וכמה זוויות נתונות. אם יש זווית אחת — האם היא בין שתי הצלעות?',
          steps: [`הנתונים: ${describe(given, 'ABC', 'DEF')}.`, `יש לנו ${thWhy[kind]}.`, `לכן המשולשים חופפים לפי <b>${TH[kind]}</b>.`],
        };
      } },
      { level: 1, gen() {
        const k = U.R(2, 12), askHalf = Math.random() < 0.5;
        return {
          q: askHalf ? `$AM$ הוא תיכון לצלע $BC$ במשולש $ABC$, ו־$BC = ${2 * k}$. מה אורך $BM$?` : `$AM$ הוא תיכון לצלע $BC$ במשולש $ABC$, ו־$MC = ${k}$. מה אורך $BC$?`,
          type: 'number', answer: askHalf ? k : 2 * k,
          mount(el) {
            const brd = fig(el, [-5, 5, 5, -5]), A = [-0.8, 3.5], B = [-4, -2.5], C = [4, -2.5], M = [0, -2.5];
            poly(brd, [A, B, C]); seg(brd, A, M, { strokeColor: RED, strokeWidth: 3 });
            ticks(brd, B, M, 1); ticks(brd, M, C, 1);
            vlabel(brd, A, 'A', [0, 0]); vlabel(brd, B, 'B', [0, 0]); vlabel(brd, C, 'C', [0, 0]); vlabel(brd, M, 'M', [0, 0]);
          },
          mistakes: askHalf ? [{ v: 2 * k, why: `$${2 * k}$ הוא האורך של כל $BC$. $BM$ היא רק חלק ממנה.` }, { v: 4 * k, why: 'כפלת ב־2, אבל $BM$ היא רק חלק מ־$BC$ — היא חייבת להיות קצרה ממנה.' }] : [{ v: k, why: `$${k}$ הוא האורך של $MC$ בלבד. $BC$ היא כל הצלע: גם $BM$ וגם $MC$.` }, { v: k / 2, why: 'חילקת ב־2, אבל $BC$ היא הצלע השלמה — היא חייבת להיות ארוכה מ־$MC$.' }],
          hint: 'תיכון מגיע לאמצע הצלע, אז הוא מחלק אותה לשני חלקים שווים.',
          steps: askHalf ? ['$M$ אמצע $BC$, ולכן $BM = MC$.', `$BM = ${2 * k} \\div 2 = ${k}$.`] : ['$M$ אמצע $BC$, ולכן $BM = MC = ' + k + '$.', `$BC = ${k} + ${k} = ${2 * k}$.`],
        };
      } },
      { level: 2, gen() {
        const B = [U.R(-6, 2), U.R(-5, 0)], C = [B[0] + 2 * U.R(1, Math.floor((6 - B[0]) / 2)), B[1] + 2 * U.R(-1, 3)], A = [U.R(-5, 5), U.R(3, 6)];
        const M = [(B[0] + C[0]) / 2, (B[1] + C[1]) / 2];
        return {
          q: `במשולש $ABC$: $B(${B[0]}, ${B[1]})$ ו־$C(${C[0]}, ${C[1]})$. $AM$ הוא תיכון לצלע $BC$. מצאו את שיעורי הנקודה $M$.`,
          type: 'pair', answer: M,
          mount(el) {
            const brd = U.board(el, [-8, 8, 8, -8]);
            [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p, n]) => brd.create('point', p, { name: n, color: ORANGE, size: 4, ...NO, label: { fontSize: 16 } }));
            brd.create('polygon', [A, B, C], { fillColor: '#ffe9d6', fillOpacity: 0.3, borders: { strokeColor: '#222', strokeWidth: 2, ...NO }, vertices: { visible: false }, ...NO });
          },
          mistakes: [{ v: [B[0] + C[0], B[1] + C[1]], why: 'חיברת את השיעורים של $B$ ו־$C$, אבל שכחת צעד: האמצע הוא <b>הממוצע</b> שלהם.' }, { v: [(C[0] - B[0]) / 2, (C[1] - B[1]) / 2], why: 'החסרת את השיעורים במקום לחבר אותם. באמצע: מחברים את שני ה־x ומחלקים ב־2, וכך גם ב־y.' }],
          hint: 'האמצע הוא הממוצע: מחברים את שני ה־x ומחלקים ב־2, ואותו דבר עם ה־y.',
          steps: ['$M$ אמצע $BC$ (כי $AM$ תיכון).', `$x_M = \\frac{${B[0]} + ${C[0] < 0 ? `(${C[0]})` : C[0]}}{2} = \\frac{${B[0] + C[0]}}{2} = ${M[0]}$`, `$y_M = \\frac{${B[1]} + ${C[1] < 0 ? `(${C[1]})` : C[1]}}{2} = \\frac{${B[1] + C[1]}}{2} = ${M[1]}$`, `$M(${M[0]}, ${M[1]})$`],
        };
      } },
      { level: 2, gen() {
        const kind = U.R(0, 4), given = givenFor(kind), shape = U.pick(SHAPES), flip = Math.random() < 0.5;
        const choices = [...TH, 'אי אפשר לקבוע'], ans = kind <= 2 ? kind : 3;
        const why = kind === 3 ? 'יש שתי צלעות וזווית, אבל הזווית <b>לא</b> בין שתי הצלעות (צ.צ.ז) — זה לא משפט חפיפה.'
          : kind === 4 ? 'יש רק זוויות (ז.ז.ז). משולשים יכולים להיות באותה צורה אבל בגדלים שונים — זה לא משפט חפיפה.'
            : `יש ${thWhy[kind]} — זה משפט ${TH[kind]}.`;
        return {
          q: `במשולשים $ABC$ ו־$DEF$ נתון: ${describe(given, 'ABC', 'DEF')}. האם אפשר לקבוע שהמשולשים חופפים? לפי איזה משפט?`,
          type: 'choice', choices, answer: ans,
          mount: el => pairFig(el, shape, given, ['ABC', 'DEF'], flip),
          mistakes: [kind === 3 ? 'יש שתי צלעות וזווית, אבל זה לא מספיק: בדוק <b>איפה</b> הזווית נמצאת ביחס לשתי הצלעות.' : 'צ.ז.צ = שתי צלעות וזווית אחת ביניהן. ספור: כמה צלעות וכמה זוויות נתונות כאן?', 'ז.צ.ז = שתי זוויות וצלע אחת ביניהן. ספור: כמה זוויות וכמה צלעות נתונות כאן?', 'צ.צ.צ = שלוש צלעות. ספור: כמה צלעות נתונות כאן?', 'הנתונים כאן דווקא מתאימים לאחד משלושת המשפטים. ספור צלעות וזוויות, ובדוק מה נמצא בין מה.'].map((why, v) => ({ v, why })),
          hint: 'רק 3 משפטים: צ.ז.צ, ז.צ.ז, צ.צ.צ. אם יש זווית — בדוק שהיא בדיוק בין שתי הצלעות (או שהצלע בין שתי הזוויות).',
          steps: [`הנתונים: ${describe(given, 'ABC', 'DEF')}.`, why, `התשובה: <b>${choices[ans]}</b>.`],
        };
      } },
      { level: 2, gen() {
        const P = U.pick(PROOFS), k = U.R(0, P.rows.length - 1), right = P.rows[k][1];
        const choices = U.shuffle([right, ...U.shuffle(REASONS.filter(r => r !== right)).slice(0, 3)]);
        const TH_WHY = 'משפט חפיפה מנמק רק את השורה שבה כתוב שהמשולשים חופפים ($\\cong$) — ורק אם בשורות שלפניה יש בדיוק את הצלעות והזוויות שהוא דורש.', AFTER = 'בנימוק הזה משתמשים רק <b>אחרי</b> השורה שמוכיחה שהמשולשים חופפים, ורק לשוויון בין ';
        const WHY = { 'נתון': '"נתון" מתאים רק לטענה שכתובה בנתונים (או נובעת מהם ישירות). קרא שוב את הנתון: האם הטענה הזו שם?', 'זוויות קודקודיות': 'זוויות קודקודיות הן שתי זוויות אחת מול השנייה, באותה נקודת חיתוך. האם זה מה שכתוב בטענה?', 'צלע משותפת': 'צלע משותפת היא צלע אחת ששייכת לשני המשולשים, ולכן היא מופיעה משני צדי השוויון. האם זה מה שכתוב בטענה?', 'צ.ז.צ': TH_WHY, 'ז.צ.ז': TH_WHY, 'צ.צ.צ': TH_WHY, 'זוויות מתחלפות בין ישרים מקבילים': 'זוויות מתחלפות נוצרות רק כשישר חותך שני ישרים מקבילים. האם הטענה היא על זוג זוויות כזה?', 'צלעות מתאימות במשולשים חופפים': AFTER + 'צלעות.', 'זוויות מתאימות במשולשים חופפים': AFTER + 'זוויות.', 'זוויות צמודות': 'זוויות צמודות לא שוות זו לזו — הסכום שלהן $180^\\circ$. הנימוק הזה לא יכול להסביר שוויון.' };
        return {
          q: `נתון: ${P.given} צריך להוכיח: ${P.goal}. מה הנימוק החסר בהוכחה?${proofTable(P.rows, k)}`,
          type: 'choice', choices, answer: choices.indexOf(right),
          mount: el => proofFig(el, P),
          mistakes: choices.map((c, v) => ({ v, why: WHY[c] })).filter(m => m.why),
          hint: 'קרא את הטענה בשורה עם ה־?. האם זה כתוב בנתון? האם הזוויות אחת מול השנייה? האם זו צלע ששייכת לשני המשולשים? או שזה משפט חפיפה?',
          steps: [`הטענה: ${P.rows[k][0]}.`, `הנימוק: <b>${right}</b> ${P.rows[k][2]}.`, right.includes('.') && right.length < 8 ? 'בדוק: בשלוש השורות שלפני יש בדיוק את שלושת הנתונים של המשפט, באותו סדר.' : 'כך כל שורה בהוכחה נשענת על משהו שכבר ידוע.'],
        };
      } },
      { level: 2, gen() {
        const s = U.R(3, 25), half = Math.random() < 0.5;
        return {
          q: half ? `$AM$ תיכון במשולש $ABC$. שטח המשולש $ABM$ הוא $${s}$ סמ"ר. מה שטח המשולש $ABC$?` : `$AM$ תיכון במשולש $ABC$. שטח המשולש $ABC$ הוא $${2 * s}$ סמ"ר. מה שטח המשולש $AMC$?`,
          type: 'number', answer: half ? 2 * s : s,
          mistakes: half ? [{ v: s, why: `$${s}$ הוא השטח של $ABM$ בלבד. $ABC$ הוא המשולש השלם, אז השטח שלו גדול יותר.` }, { v: s / 2, why: 'חילקת ב־2, אבל $ABC$ הוא המשולש השלם — השטח שלו גדול מהשטח של $ABM$.' }] : [{ v: 2 * s, why: `$${2 * s}$ הוא השטח של כל $ABC$. $AMC$ הוא רק חלק ממנו.` }, { v: 4 * s, why: 'כפלת ב־2, אבל $AMC$ הוא רק חלק מ־$ABC$ — השטח שלו קטן יותר.' }],
          hint: 'לשני המשולשים הקטנים יש בסיס שווה ($BM = MC$) ואותו גובה מ־$A$. מה זה אומר על השטחים?',
          steps: ['$BM = MC$ (תיכון), ולשני המשולשים $ABM$ ו־$AMC$ יש אותו גובה מהקודקוד $A$.', 'לכן השטחים שלהם שווים: התיכון מחלק את המשולש לשני חצאים בשטח.',
            half ? `שטח $ABC$ $= ${s} + ${s} = ${2 * s}$ סמ"ר.` : `שטח $AMC$ $= ${2 * s} \\div 2 = ${s}$ סמ"ר.`],
        };
      } },
      { level: 3, gen() {
        const perm = U.shuffle([0, 1, 2]), L = perm.map(i => 'ABC'[i]), Ms = perm.map(i => 'DEF'[i]);
        const [i, j] = U.shuffle([0, 1, 2]).slice(0, 2), x = U.R(2, 9);
        let m1 = U.R(2, 5), m2 = U.R(1, 4); if (m1 === m2) m1++;
        const v = Math.max(m1, m2) * x + U.R(1, 8), b1 = v - m1 * x, b2 = v - m2 * x;
        const [e1, e2] = [U.lin(m1, b1), U.lin(m2, b2)];
        const big = m1 > m2 ? [m1, b1, m2, b2] : [m2, b2, m1, b1];
        return {
          q: `נתון: $\\triangle ${L.join('')} \\cong \\triangle ${Ms.join('')}$. $${L[i]}${L[j]} = ${e1}$ ו־$${Ms[i]}${Ms[j]} = ${e2}$ (בס"מ). מצאו את $x$.`,
          type: 'number', answer: x,
          hint: `בדוק ש־$${L[i]}${L[j]}$ ו־$${Ms[i]}${Ms[j]}$ צלעות מתאימות. צלעות מתאימות שוות — כתוב משוואה.`,
          steps: [`$${L[i]} ↔ ${Ms[i]}$ ו־$${L[j]} ↔ ${Ms[j]}$, ולכן $${L[i]}${L[j]} = ${Ms[i]}${Ms[j]}$.`, `$${e1} = ${e2}$`,
            `מעבירים: $${U.term(big[0] - big[2])} = ${big[3] - big[1]}$`, `$x = ${x}$`, `בדיקה: שתי הצלעות יוצאות $${v}$ ס"מ ✔`],
        };
      } },
      { level: 3, gen() {
        const refl = Math.random() < 0.35, ok = p => p.every(c => Math.abs(c) <= 7);
        let A, B, C, D, E, F, dx = 0, dy = 0;
        do {
          A = [U.R(-6, 0), U.R(-4, 4)]; B = [A[0] + U.R(1, 4), A[1] + U.R(-3, 3)]; C = [A[0] + U.R(0, 3), A[1] + U.R(2, 3) * U.pick([1, -1])];
          dx = U.RNZ(-2, 6); dy = U.RNZ(-3, 3);
          const f = refl ? p => [-p[0], p[1]] : p => [p[0] + dx, p[1] + dy];
          [D, E, F] = [A, B, C].map(f);
        } while (Math.abs((B[0] - A[0]) * (C[1] - A[1]) - (C[0] - A[0]) * (B[1] - A[1])) < 2 || ![A, B, C, D, E, F].every(ok) || (refl && Math.max(A[0], B[0], C[0]) > -1));
        const mv = (n, word) => n === 0 ? '' : `${Math.abs(n)} ${n > 0 ? word[0] : word[1]}`;
        const move = refl ? '' : [mv(dx, ['ימינה', 'שמאלה']), mv(dy, ['למעלה', 'למטה'])].filter(Boolean).join(' ו־');
        return {
          q: `$\\triangle ABC \\cong \\triangle DEF$. נתון: $A${pt(A)}$, $B${pt(B)}$, $C${pt(C)}$, $D${pt(D)}$, $E${pt(E)}$. ${refl ? 'המשולש $DEF$ הוא שיקוף של $ABC$ בציר ה־y.' : 'המשולש $DEF$ התקבל מהזזה של $ABC$.'} מצאו את $F$.`,
          type: 'pair', answer: F,
          mount(el) {
            const brd = U.board(el, [-8, 8, 8, -8]);
            [[A, 'A'], [B, 'B'], [C, 'C']].forEach(([p, n]) => brd.create('point', p, { name: n, color: RED, size: 4, ...NO, label: { fontSize: 16 } }));
            [[D, 'D'], [E, 'E']].forEach(([p, n]) => brd.create('point', p, { name: n, color: BLUE, size: 4, ...NO, label: { fontSize: 16 } }));
            brd.create('polygon', [A, B, C], { fillColor: '#f8c9c9', fillOpacity: 0.4, borders: { strokeColor: RED, strokeWidth: 2, ...NO }, vertices: { visible: false }, ...NO });
            seg(brd, D, E, { strokeColor: BLUE });
          },
          mistakes: refl ? [{ v: [C[0], -C[1]], why: 'הפכת את הסימן של ה־y. בדוק על $A$ ו־$D$: איזה שיעור מחליף סימן בשיקוף בציר ה־y, ואיזה נשאר?' }, { v: [-C[0], -C[1]], why: 'הפכת את שני הסימנים. בדוק על $A$ ו־$D$: בשיקוף בציר ה־y רק שיעור אחד מחליף סימן.' }] : [{ v: [C[0] - dx, C[1] - dy], why: 'הזזת את $C$ לכיוון ההפוך. בדוק שוב: איך מגיעים מ־$A$ ל־$D$ (ולא מ־$D$ ל־$A$)?' }],
          hint: refl ? 'בשיקוף בציר ה־y, ה־y נשאר אותו דבר וה־x מחליף סימן. בדוק את זה על A ו־D.' : 'איך מגיעים מ־A ל־D? כמה ימינה/שמאלה וכמה למעלה/למטה? עושים את אותה הזזה ל־C.',
          steps: refl
            ? ['$C$ מתאים ל־$F$ (מקום שלישי בשני השמות).', `שיקוף בציר ה־y: $(x, y) → (-x, y)$. בדיקה: $A${pt(A)} → D${pt(D)}$ ✔`, `$C${pt(C)} → F${pt(F)}$`]
            : ['$C$ מתאים ל־$F$ (מקום שלישי בשני השמות).', `מ־$A$ ל־$D$: ${move}. (בדיקה: גם מ־$B$ ל־$E$ זו אותה הזזה ✔)`, `אותה הזזה ל־$C${pt(C)}$: $F = (${C[0]} ${U.sgn(dx)},\\ ${C[1]} ${U.sgn(dy)}) = ${pt(F)}$`],
        };
      } },
    ]),

    summary: [
      'משולשים חופפים = אותה צורה ואותו גודל. כל הצלעות והזוויות המתאימות שוות.',
      'בכתיב $\\triangle ABC \\cong \\triangle DEF$ <b>הסדר קובע</b> מי מתאים למי: $A↔D$, $B↔E$, $C↔F$.',
      'משפטי חפיפה: <b>צ.ז.צ</b> (הזווית בין הצלעות), <b>ז.צ.ז</b> (הצלע בין הזוויות), <b>צ.צ.צ</b>. צ.צ.ז וז.ז.ז — לא!',
      'הוכחה = טבלת טענה ונימוק. נימוקים נפוצים: נתון, זוויות קודקודיות, צלע משותפת, משפט חפיפה.',
      '<b>תיכון</b> מחבר קודקוד לאמצע הצלע שמולו: חוצה אותה לשני חלקים שווים ואת המשולש לשני חלקים בשטח שווה.',
      'אמצע קטע במערכת צירים: ממוצע ה־x וממוצע ה־y.',
    ],
  });
})();
