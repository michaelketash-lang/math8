/* יחידה: זוויות וזווית חיצונית למשולש (פרק 20 בספר) */
(() => {
  // מוריד שורת פתרון כפולה, למשל "$x = 10$" אחרי "מעבירים: $x = 10$" (כשהמקדם הוא 1)
  const dedupe = list => list.map(g => ({ ...g, gen() { const e = g.gen(); e.steps = e.steps.filter((s, i, a) => !(i && s[0] === '$' && a[i - 1].endsWith(s.slice(1)))); return e; } }));
  const D2R = Math.PI / 180;
  const xy = p => Array.isArray(p) ? p : [p.X(), p.Y()];
  const unit = (a, b) => { const d = Math.hypot(a[0] - b[0], a[1] - b[1]) || 1; return [(a[0] - b[0]) / d, (a[1] - b[1]) / d]; };
  /** גודל הזווית ABC במעלות (0–180) */
  const deg = (A, B, C) => {
    [A, B, C] = [A, B, C].map(xy);
    let d = Math.abs(Math.atan2(A[1] - B[1], A[0] - B[0]) - Math.atan2(C[1] - B[1], C[0] - B[0])) / D2R;
    return d > 180 ? 360 - d : d;
  };
  const fig = (el, bb = [-5, 5, 5, -5]) => U.board(el, bb, { axis: false, grid: false });
  const ORANGE = '#e8702a', BLUE = '#2f6fdb', GREEN = '#1f9d55', PURPLE = '#8e44ad', GREY = '#555';

  /** קשת זווית ב־B בין BA ל־BC + תווית (מחרוזת או פונקציה) */
  function mark(brd, A, B, C, label, color = ORANGE, r = 0.6) {
    const P = [A, B, C].map(p => Array.isArray(p) ? brd.create('point', p, { visible: false }) : p);
    brd.create('nonreflexangle', P, { radius: r, name: '', withLabel: false, fillColor: color, fillOpacity: 0.3, strokeColor: color, highlight: false, fixed: true });
    const txt = typeof label === 'function' ? label : () => label;
    const pos = k => () => {
      const [a, b, c] = P.map(xy), u = unit(a, b), v = unit(c, b);
      let w = [u[0] + v[0], u[1] + v[1]], n = Math.hypot(w[0], w[1]);
      if (n < 1e-6) { w = [-u[1], u[0]]; n = 1; }
      // התווית צריכה להיכנס בתוך "הטריז" של הזווית: ככל שהזווית צרה והתווית ארוכה — רחוק יותר מהקודקוד
      const bb = brd.getBoundingBox(), upp = (bb[2] - bb[0]) / brd.canvasWidth;
      const rho = 0.8 * Math.hypot(4.2 * String(txt()).length + 3, 10) * upp, half = deg(a, b, c) * D2R / 2;
      return b[k] + Math.max(r + rho, rho / Math.sin(Math.max(half, 0.15))) * w[k] / n;
    };
    brd.create('text', [pos(0), pos(1), txt],
      { anchorX: 'middle', anchorY: 'middle', fontSize: 16, color, fixed: true, highlight: false, cssStyle: 'font-weight:bold;background:rgba(255,255,255,.75);border-radius:4px;padding:0 2px' });
  }
  const seg = (brd, a, b, o = {}) => brd.create('segment', [a, b], { strokeColor: '#222', strokeWidth: 2.5, fixed: true, highlight: false, ...o });
  const vlabel = (brd, P, name, ctr) => {
    const u = unit(P, ctr);
    brd.create('text', [P[0] + 0.45 * u[0], P[1] + 0.45 * u[1], name], { anchorX: 'middle', anchorY: 'middle', fontSize: 17, fixed: true, highlight: false });
  };

  /* ---- ישרים מקבילים וחותך ----
     צומת 0 = הישר התחתון, צומת 1 = העליון. בכל צומת 4 קרניים: 0 ימינה, 1 בכיוון החותך (θ), 2 שמאלה, 3 החותך למטה.
     זווית במקום p נמצאת בין קרן p לקרן p+1. גודלה θ אם p זוגי, אחרת 180−θ. */
  const size = (p, th) => p % 2 ? 180 - th : th;
  const rayDir = (th, p) => { const a = [0, th, 180, 180 + th][p % 4] * D2R; return [Math.cos(a), Math.sin(a)]; };
  function parFig(el, th, marks, two = true) {
    const brd = fig(el);
    const h = two ? 1.6 : 0, dx = two ? 2 * h / Math.tan(th * D2R) : 0;
    const O = two ? [[-dx / 2, -h], [dx / 2, h]] : [[0, 0]];
    O.forEach(o => seg(brd, [-4.8, o[1]], [4.8, o[1]], { strokeColor: BLUE }));
    const d = rayDir(th, 1), ext = 4.6 / Math.sin(th * D2R) - h;
    seg(brd, [O[0][0] - ext * d[0], O[0][1] - ext * d[1]], [O[O.length - 1][0] + ext * d[0], O[O.length - 1][1] + ext * d[1]]);
    if (two) O.forEach(o => brd.create('text', [4.3, o[1] + 0.35, '>'], { fontSize: 18, color: BLUE, fixed: true, highlight: false }));
    for (const m of marks) {
      const o = O[m.i], a = rayDir(th, m.p), c = rayDir(th, m.p + 1);
      mark(brd, [o[0] + a[0], o[1] + a[1]], o, [o[0] + c[0], o[1] + c[1]], m.label, m.color || ORANGE, 0.5);
    }
    return brd;
  }
  const alternate = (i, p, j, q) => i !== j && Math.abs(q - p) === 2 && (i === 0 ? p < 2 : p >= 2);
  /** הסבר הקשר בין זווית (i,p) לזווית (j,q): {eq, steps} */
  function relation(i, p, j, q, a) {
    // a = גודל הזווית הנתונה, או null כשהזוויות כתובות עם x (ואז בלי מספרים בהסבר)
    if (i === j) {
      if (Math.abs(p - q) === 2) return { eq: true, steps: [`הזוויות <b>קודקודיות</b> (אחת מול השנייה), ולכן שוות.`] };
      return { eq: false, steps: [`הזוויות <b>צמודות</b> (אחת ליד השנייה, ויחד יוצרות קו ישר), ולכן סכומן $180^\\circ$.`] };
    }
    if (p === q) return { eq: true, steps: ['הזוויות <b>מתאימות</b> (באותו מקום בכל צומת) בין ישרים מקבילים, ולכן שוות.'] };
    if (alternate(i, p, j, q)) return { eq: true, steps: ['הזוויות <b>מתחלפות</b> (בין הישרים, משני צדי החותך) בין ישרים מקבילים, ולכן שוות.'] };
    const st = [`בצומת השני, הזווית <b>המתאימה</b> לזווית הראשונה (באותו מקום בדיוק) שווה לה${a == null ? '' : `: $${a}^\\circ$`}.`];
    if (Math.abs(p - q) === 2) { st.push(`הזווית השנייה <b>קודקודית</b> לזווית המתאימה, ולכן שווה לה${a == null ? '' : ` — גם $${a}^\\circ$`}.`); return { eq: true, steps: st }; }
    st.push(`הזווית השנייה <b>צמודה</b> לזווית המתאימה, ולכן ${a == null ? 'סכומן $180^\\circ$' : `היא $180 - ${a} = ${180 - a}^\\circ$`}.`);
    return { eq: false, steps: st };
  }
  const goodTh = () => U.pick([40, 45, 50, 55, 60, 65, 70, 75, 105, 110, 115, 120, 125, 130, 135, 140]);

  /* ---- משולש לפי זוויות B ו־C (במעלות), עם המשך של BC אחרי C עד D ---- */
  function triPts(b, c, ext = true) {
    const B = [0, 0], C = [6, 0], a = 180 - b - c, t = 6 * Math.sin(c * D2R) / Math.sin(a * D2R);
    const A = [t * Math.cos(b * D2R), t * Math.sin(b * D2R)], D = [9, 0];
    const all = ext ? [A, B, C, D] : [A, B, C];
    const xs = all.map(p => p[0]), ys = all.map(p => p[1]);
    const cx = (Math.min(...xs) + Math.max(...xs)) / 2, cy = (Math.min(...ys) + Math.max(...ys)) / 2;
    const half = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)) / 2 + 1.4;
    return { A, B, C, D, bb: [cx - half, cy + half, cx + half, cy - half] };
  }
  /** labels: {A, B, C, ext} — מה לכתוב בכל זווית (או null) */
  function triFig(el, b, c, labels, ext = true) {
    const { A, B, C, D, bb } = triPts(b, c, ext), brd = fig(el, bb);
    seg(brd, A, B); seg(brd, B, C); seg(brd, C, A);
    if (ext) seg(brd, C, D, { dash: 2 });
    const g = [(A[0] + B[0] + C[0]) / 3, (A[1] + B[1] + C[1]) / 3];
    vlabel(brd, A, 'A', g); vlabel(brd, B, 'B', g); vlabel(brd, C, 'C', [C[0], C[1] + 1]);
    if (ext) brd.create('text', [D[0], D[1] - 0.45, 'D'], { anchorX: 'middle', fontSize: 17, fixed: true });
    const r = (bb[2] - bb[0]) / 14;
    if (labels.A != null) mark(brd, B, A, C, labels.A, ORANGE, r);
    if (labels.B != null) mark(brd, A, B, C, labels.B, BLUE, r);
    if (labels.C != null) mark(brd, A, C, B, labels.C, GREY, r);
    if (labels.ext != null) mark(brd, A, C, D, labels.ext, PURPLE, r);
  }

  const SVG_EX = `<svg viewBox="0 0 320 170" width="320" style="max-width:100%;display:block;margin:10px auto" dir="ltr" font-family="Rubik,sans-serif">
    <polygon points="30,145 210,145 95,30" fill="none" stroke="#2f6fdb" stroke-width="3"/>
    <line x1="210" y1="145" x2="305" y2="145" stroke="#2f6fdb" stroke-width="3" stroke-dasharray="7 5"/>
    <text x="90" y="22" font-size="17" fill="currentColor">A</text><text x="14" y="160" font-size="17" fill="currentColor">B</text><text x="205" y="166" font-size="17" fill="currentColor">C</text><text x="296" y="166" font-size="17" fill="currentColor">D</text>
    <text x="80" y="62" font-size="15" fill="#e8702a" font-weight="bold">x+20</text>
    <text x="48" y="138" font-size="15" fill="#2f6fdb" font-weight="bold">50°</text>
    <text x="222" y="132" font-size="15" fill="#8e44ad" font-weight="bold">3x+10</text></svg>`;

  registerChapter('angles', {
    intro: `
      <p>כשישרים נחתכים נוצרות זוויות. יש כמה "זוגות" של זוויות שתמיד מקיימים חוק. אם תזהה את הזוג — תדע את הזווית בלי למדוד!</p>
      <div class="idea"><b>זוויות קודקודיות — שוות</b>שני ישרים נחתכים. זוויות שנמצאות <b>אחת מול השנייה</b> (כמו האות X) נקראות קודקודיות. הן תמיד שוות.</div>
      <div class="idea"><b>זוויות צמודות — סכומן 180°</b>שתי זוויות <b>אחת ליד השנייה</b>, עם צלע משותפת, שיחד יוצרות קו ישר. לכן: $\\alpha + \\beta = 180^\\circ$.</div>
      <div class="idea"><b>ישרים מקבילים וחותך</b>ישר שחותך שני ישרים מקבילים יוצר שני "צמתים" שנראים בדיוק אותו דבר.
        <br><b>מתאימות</b> — באותו מקום בכל צומת (למשל שתיהן "למעלה מימין") ← שוות.
        <br><b>מתחלפות</b> — בין שני המקבילים, בצדדים שונים של החותך (צורת Z) ← שוות.</div>
      <div class="idea"><b>זווית חיצונית למשולש</b>ממשיכים צלע של המשולש. הזווית שנוצרת בחוץ שווה <b>לסכום שתי הזוויות הפנימיות שלא צמודות לה</b>.</div>
      <div class="formula">$\\angle ACD = \\angle A + \\angle B$</div>
      <div class="note"><b>למה זה נכון?</b> סכום הזוויות במשולש הוא $180^\\circ$. גם הזווית החיצונית ועוד $\\angle C$ הן $180^\\circ$ (צמודות). אז מה שחסר ל־$\\angle C$ כדי להגיע ל־180 הוא בדיוק $\\angle A + \\angle B$.</div>
      <p class="muted">טיפ: כשהזוויות כתובות עם $x$ — מזהים איזה זוג זה, כותבים משוואה ("שוות" או "סכום 180") ופותרים.</p>`,

    example: {
      question: `במשולש $ABC$ ממשיכים את הצלע $BC$ עד הנקודה $D$. נתון: $\\angle A = x + 20$, $\\angle B = 50^\\circ$, והזווית החיצונית $\\angle ACD = 3x + 10$. מצאו את $x$ ואת כל זוויות המשולש.${SVG_EX}`,
      steps: [
        'מזהים: $\\angle ACD$ היא <b>זווית חיצונית</b> למשולש. הזוויות שלא צמודות לה הן $\\angle A$ ו־$\\angle B$.',
        'החוק: זווית חיצונית = סכום שתי הזוויות הפנימיות שלא צמודות לה. כותבים משוואה: $3x + 10 = (x + 20) + 50$.',
        'מכנסים באגף ימין: $3x + 10 = x + 70$.',
        'מחסירים $x$ משני האגפים: $2x + 10 = 70$. מחסירים 10: $2x = 60$.',
        'מחלקים ב־2: $x = 30$.',
        'מציבים: $\\angle A = 30 + 20 = 50^\\circ$, והזווית החיצונית $= 3 \\cdot 30 + 10 = 100^\\circ$.',
        '$\\angle C$ צמודה לזווית החיצונית: $\\angle C = 180 - 100 = 80^\\circ$.',
        'בדיקה: $50 + 50 + 80 = 180$ ✔ — סכום הזוויות במשולש יוצא נכון.',
      ],
    },

    tools: [
      {
        title: 'קודקודיות וצמודות',
        desc: 'גררו את הנקודות הכתומות וסובבו את הישרים. מה קורה לזוויות שמול זו? ומה הסכום של שתי זוויות שאחת ליד השנייה?',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = fig(el);
          const O = brd.create('point', [0, 0], { visible: false });
          const P = brd.create('point', [3.5, 1], { name: '', color: ORANGE, size: 6 });
          const Q = brd.create('point', [1.5, 3.2], { name: '', color: ORANGE, size: 6 });
          const P2 = brd.create('point', [() => -P.X(), () => -P.Y()], { visible: false });
          const Q2 = brd.create('point', [() => -Q.X(), () => -Q.Y()], { visible: false });
          brd.create('line', [P, P2], { strokeColor: '#222', strokeWidth: 2.5, highlight: false });
          brd.create('line', [Q, Q2], { strokeColor: '#222', strokeWidth: 2.5, highlight: false });
          const a = () => Math.round(deg(P, O, Q)), b = () => 180 - a();
          mark(brd, P, O, Q, () => a() + '°', ORANGE, 0.9);
          mark(brd, P2, O, Q2, () => a() + '°', ORANGE, 0.9);
          mark(brd, Q, O, P2, () => b() + '°', BLUE, 0.9);
          mark(brd, Q2, O, P, () => b() + '°', BLUE, 0.9);
          const upd = () => {
            out.innerHTML = `<span style="color:${ORANGE}">כתומות (קודקודיות): <bdi dir="ltr">${a()}° = ${a()}°</bdi></span> &nbsp;·&nbsp; <span style="color:${BLUE}">כתומה + כחולה (צמודות): <bdi dir="ltr">${a()}° + ${b()}° = 180°</bdi></span>`;
          };
          brd.on('update', upd); upd();
        },
      },
      {
        title: 'ישרים מקבילים וחותך',
        desc: 'גררו את הנקודות הכתומות כדי לשנות את החותך. בחרו סוג של זוג זוויות ובדקו: האם החוק נשמר תמיד?',
        mount(el) {
          const PAIRS = {
            'מתאימות': [[0, 0, 1, 0], [0, 1, 1, 1], [0, 2, 1, 2], [0, 3, 1, 3]],
            'מתחלפות': [[0, 0, 1, 2], [0, 1, 1, 3]],
            'קודקודיות': [[1, 0, 1, 2], [0, 1, 0, 3]],
            'צמודות': [[1, 0, 1, 1], [0, 2, 0, 3], [1, 3, 1, 0]],
          };
          const st = { type: 'מתאימות', k: 0 };
          const row = document.createElement('div'); row.className = 'row'; row.style.justifyContent = 'center'; el.appendChild(row);
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = fig(el);
          const lb = brd.create('line', [[0, -1.6], [1, -1.6]], { strokeColor: BLUE, strokeWidth: 3, fixed: true, highlight: false });
          const lt = brd.create('line', [[0, 1.6], [1, 1.6]], { strokeColor: BLUE, strokeWidth: 3, fixed: true, highlight: false });
          const B = brd.create('glider', [-0.8, -1.6, lb], { name: '', color: ORANGE, size: 6 });
          const T = brd.create('glider', [0.9, 1.6, lt], { name: '', color: ORANGE, size: 6 });
          brd.create('line', [B, T], { strokeColor: '#222', strokeWidth: 2.5, highlight: false });
          const O = [B, T];
          const pair = () => PAIRS[st.type][st.k % PAIRS[st.type].length];
          const th = () => Math.atan2(T.Y() - B.Y(), T.X() - B.X()) / D2R;
          const pt = (m, end) => brd.create('point', [
            () => { const [i, p] = m === 0 ? pair().slice(0, 2) : pair().slice(2); return O[i].X() + rayDir(th(), p + end)[0]; },
            () => { const [i, p] = m === 0 ? pair().slice(0, 2) : pair().slice(2); return O[i].Y() + rayDir(th(), p + end)[1]; }], { visible: false });
          const vtx = m => brd.create('point', [() => O[pair()[2 * m]].X(), () => O[pair()[2 * m]].Y()], { visible: false });
          const val = m => Math.round(size(pair()[2 * m + 1], th()));
          mark(brd, pt(0, 0), vtx(0), pt(0, 1), () => val(0) + '°', ORANGE, 0.75);
          mark(brd, pt(1, 0), vtx(1), pt(1, 1), () => val(1) + '°', GREEN, 0.75);
          const upd = () => {
            const [a, b] = [val(0), val(1)];
            out.innerHTML = st.type === 'צמודות' ? `זוויות צמודות: <bdi dir="ltr">${a}° + ${b}° = <b>180°</b></bdi>` : `זוויות ${st.type} <b>שוות</b>: <bdi dir="ltr">${a}° = ${b}°</bdi>`;
          };
          for (const t of Object.keys(PAIRS)) {
            const btn = document.createElement('button'); btn.className = 'btn ghost'; btn.textContent = t;
            btn.onclick = () => {
              st.k = st.type === t ? st.k + 1 : 0; st.type = t; brd.update(); upd();
              row.querySelectorAll('button').forEach(b => b.classList.toggle('ghost', b !== btn));
            };
            if (t === st.type) btn.classList.remove('ghost');
            row.appendChild(btn);
          }
          brd.on('update', upd); upd();
          el.insertAdjacentHTML('beforeend', '<p class="muted">לחיצה נוספת על אותו כפתור מראה זוג אחר מאותו סוג.</p>');
        },
      },
      {
        title: 'זווית חיצונית למשולש',
        desc: 'גררו את קודקודי המשולש. הזווית הסגולה היא זווית חיצונית. השוו אותה לסכום הזווית הכתומה והכחולה.',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = fig(el, [-4.5, 5.5, 5.5, -4.5]);
          const A = brd.create('point', [-0.5, 3], { name: 'A', color: ORANGE, size: 6, label: { fontSize: 18, offset: [-8, 14] } });
          const B = brd.create('point', [-3, -2], { name: 'B', color: ORANGE, size: 6, label: { fontSize: 18, offset: [-18, -10] } });
          const C = brd.create('point', [1.5, -2], { name: 'C', color: ORANGE, size: 6, label: { fontSize: 18, offset: [0, -16] } });
          const D = brd.create('point', [() => C.X() + 3 * unit(xy(C), xy(B))[0], () => C.Y() + 3 * unit(xy(C), xy(B))[1]], { name: 'D', size: 2, color: '#222', label: { fontSize: 18 } });
          brd.create('polygon', [A, B, C], { fillColor: '#ffe9d6', fillOpacity: 0.4, borders: { strokeColor: '#222', strokeWidth: 2.5, highlight: false }, highlight: false, vertices: { visible: false } });
          brd.create('segment', [C, D], { strokeColor: '#222', strokeWidth: 2, dash: 2, highlight: false });
          const a = () => Math.round(deg(B, A, C)), b = () => Math.round(deg(A, B, C));
          mark(brd, B, A, C, () => a() + '°', ORANGE, 0.6);
          mark(brd, A, B, C, () => b() + '°', BLUE, 0.6);
          mark(brd, A, C, B, () => (180 - a() - b()) + '°', GREY, 0.5);
          mark(brd, A, C, D, () => (a() + b()) + '°', PURPLE, 0.8);
          const upd = () => {
            out.innerHTML = `<span style="color:${PURPLE}">הזווית החיצונית</span> = <bdi dir="ltr"><span style="color:${ORANGE}">${a()}°</span> + <span style="color:${BLUE}">${b()}°</span> = <span style="color:${PURPLE}"><b>${a() + b()}°</b></span></bdi>`;
          };
          brd.on('update', upd); upd();
        },
      },
    ],

    exercises: dedupe([
      { level: 1, gen() {
        const th = goodTh(), p = U.pick([0, 1, 2, 3]), a = size(p, th);
        return {
          q: 'שני ישרים נחתכים. מה גודל הזווית המסומנת ב־?',
          type: 'number', answer: a,
          mount: el => parFig(el, th, [{ i: 0, p, label: a + '°' }, { i: 0, p: p + 2, label: '?', color: GREEN }], false),
          hint: 'הזוויות נמצאות אחת מול השנייה. איך קוראים לזוג כזה, ומה החוק שלו?',
          steps: ['הזוויות נמצאות אחת מול השנייה — הן <b>זוויות קודקודיות</b>.', 'זוויות קודקודיות שוות.', `לכן הזווית המבוקשת היא $${a}^\\circ$.`],
        };
      } },
      { level: 1, gen() {
        const th = goodTh(), p = U.pick([0, 1, 2, 3]), a = size(p, th), q = (p + U.pick([1, 3])) % 4;
        return {
          q: 'שני ישרים נחתכים. מה גודל הזווית המסומנת ב־?',
          type: 'number', answer: 180 - a,
          mount: el => parFig(el, th, [{ i: 0, p, label: a + '°' }, { i: 0, p: q, label: '?', color: GREEN }], false),
          hint: 'הזוויות אחת ליד השנייה ויחד יוצרות קו ישר. כמה מעלות יש בקו ישר?',
          steps: ['הזוויות אחת ליד השנייה, על אותו ישר — הן <b>זוויות צמודות</b>.', 'סכום זוויות צמודות הוא $180^\\circ$.', `$180 - ${a} = ${180 - a}$, אז הזווית המבוקשת היא $${180 - a}^\\circ$.`],
        };
      } },
      { level: 1, gen() {
        let b, c; do { b = U.R(6, 16) * 5; c = U.R(6, 16) * 5; } while (b + c > 150);
        return {
          q: `במשולש $ABC$: $\\angle B = ${b}^\\circ$, $\\angle C = ${c}^\\circ$. מה גודל $\\angle A$?`,
          type: 'number', answer: 180 - b - c,
          mount: el => triFig(el, b, c, { A: '?', B: b + '°', C: c + '°' }, false),
          hint: 'סכום שלוש הזוויות במשולש הוא תמיד $180^\\circ$.',
          steps: ['סכום הזוויות במשולש: $180^\\circ$.', `מחברים את מה שידוע: $${b} + ${c} = ${b + c}$.`, `מה שחסר: $180 - ${b + c} = ${180 - b - c}$, ולכן $\\angle A = ${180 - b - c}^\\circ$.`],
        };
      } },
      { level: 1, gen() {
        const NAMES = ['קודקודיות', 'צמודות', 'מתאימות', 'מתחלפות'];
        const t = U.R(0, 3), th = goodTh();
        let m;
        if (t === 0) { const p = U.R(0, 3); m = [[1, p], [1, (p + 2) % 4]]; }
        else if (t === 1) { const p = U.R(0, 3); m = [[0, p], [0, (p + 1) % 4]]; }
        else if (t === 2) { const p = U.R(0, 3); m = U.shuffle([[0, p], [1, p]]); }
        else { const p = U.R(0, 1); m = U.shuffle([[0, p], [1, p + 2]]); }
        const why = ['הן באותו צומת, <b>אחת מול השנייה</b>.', 'הן באותו צומת, <b>אחת ליד השנייה</b> ויחד יוצרות קו ישר.', 'הן בצמתים שונים, אבל <b>באותו מקום</b> בכל צומת.', 'הן בצמתים שונים, <b>בין שני המקבילים</b>, ובצדדים שונים של החותך (צורת Z).'];
        return {
          q: 'הישרים הכחולים מקבילים. מה הקשר בין זווית 1 לזווית 2?',
          type: 'choice', choices: NAMES, answer: t,
          mount: el => parFig(el, th, [{ i: m[0][0], p: m[0][1], label: '1' }, { i: m[1][0], p: m[1][1], label: '2', color: GREEN }]),
          hint: 'שאלה ראשונה: האם שתי הזוויות באותו צומת או בצמתים שונים? שאלה שנייה: איפה כל אחת נמצאת?',
          steps: [why[t], `לכן הן זוויות <b>${NAMES[t]}</b>.`, t === 1 ? 'החוק: סכומן $180^\\circ$.' : 'החוק: הן שוות.'],
        };
      } },
      { level: 1, gen() {
        let a, b; do { a = U.R(5, 15) * 5; b = U.R(5, 15) * 5; } while (a + b > 155);
        return {
          q: `במשולש $ABC$ ממשיכים את $BC$ עד $D$. נתון: $\\angle A = ${a}^\\circ$, $\\angle B = ${b}^\\circ$. מה גודל הזווית החיצונית $\\angle ACD$?`,
          type: 'number', answer: a + b,
          mount: el => triFig(el, b, 180 - a - b, { A: a + '°', B: b + '°', ext: '?' }),
          hint: 'זווית חיצונית שווה לסכום שתי הזוויות הפנימיות שלא צמודות לה.',
          steps: ['$\\angle ACD$ היא זווית חיצונית למשולש.', 'הזוויות שלא צמודות לה: $\\angle A$ ו־$\\angle B$.', `$\\angle ACD = ${a} + ${b} = ${a + b}^\\circ$.`],
        };
      } },
      { level: 2, gen() {
        const th = goodTh();
        let i, p, j, q; do { i = U.R(0, 1); p = U.R(0, 3); j = U.R(0, 1); q = U.R(0, 3); } while (i === j && p === q);
        const a = size(p, th), r = relation(i, p, j, q, a), ans = r.eq ? a : 180 - a;
        return {
          q: 'הישרים הכחולים מקבילים. מה גודל הזווית המסומנת ב־?',
          type: 'number', answer: ans,
          mount: el => parFig(el, th, [{ i, p, label: a + '°' }, { i: j, p: q, label: '?', color: GREEN }]),
          hint: i === j ? 'שתי הזוויות באותו צומת: הן קודקודיות (מול) או צמודות (ליד)?' : 'העבר את הזווית הנתונה לצומת של ה־? בעזרת זוויות מתאימות (אותו מקום בדיוק), ואז השתמש בקודקודיות או צמודות.',
          steps: [...(i === j ? [] : ['"הזווית הראשונה" = הזווית הנתונה, "הזווית השנייה" = סימן השאלה.']), ...r.steps, `התשובה: $${ans}^\\circ$.`],
        };
      } },
      { level: 2, gen() {
        const vert = Math.random() < 0.5, x = U.R(3, 12) * 2;
        if (vert) {
          const v = U.R(8, 28) * 5, m2 = U.R(1, 3), m1 = m2 + U.R(1, 3), b1 = v - m1 * x, b2 = v - m2 * x;
          const [e1, e2] = [U.lin(m1, b1), U.lin(m2, b2)];
          return {
            q: `שני ישרים נחתכים, והזוויות המסומנות הן $${e1}$ ו־$${e2}$ (במעלות). מצאו את $x$.`,
            type: 'number', answer: x,
            mount: el => parFig(el, v, [{ i: 0, p: 0, label: e1 }, { i: 0, p: 2, label: e2, color: GREEN }], false),
            hint: 'הזוויות אחת מול השנייה — קודקודיות. מה החוק? כתבו משוואה.',
            steps: ['הזוויות קודקודיות, ולכן שוות.', `$${e1} = ${e2}$`, `מעבירים את ה־$x$ לאגף אחד ואת המספרים לשני: $${U.term(m1 - m2)} = ${b2 - b1}$`, `$x = ${x}$`, `בדיקה: שתי הזוויות יוצאות $${v}^\\circ$ ✔`],
          };
        }
        const v1 = U.R(8, 28) * 5, m1 = U.R(1, 4), m2 = U.R(1, 3), b1 = v1 - m1 * x, b2 = 180 - v1 - m2 * x;
        const [e1, e2] = [U.lin(m1, b1), U.lin(m2, b2)];
        return {
          q: `שני ישרים נחתכים, והזוויות המסומנות הן $${e1}$ ו־$${e2}$ (במעלות). מצאו את $x$.`,
          type: 'number', answer: x,
          mount: el => parFig(el, v1, [{ i: 0, p: 0, label: e1 }, { i: 0, p: 1, label: e2, color: GREEN }], false),
          hint: 'הזוויות אחת ליד השנייה — צמודות. מה הסכום שלהן? כתבו משוואה.',
          steps: ['הזוויות צמודות, ולכן סכומן $180^\\circ$.', `$(${e1}) + (${e2}) = 180$`, `מכנסים: $${U.lin(m1 + m2, b1 + b2)} = 180$`, `$${U.term(m1 + m2)} = ${180 - b1 - b2}$`, `$x = ${x}$`, `בדיקה: $${v1} + ${180 - v1} = 180$ ✔`],
        };
      } },
      { level: 2, gen() {
        let a, b; do { a = U.R(5, 15) * 5; b = U.R(5, 15) * 5; } while (a + b > 155);
        const e = a + b, askB = Math.random() < 0.5;
        return {
          q: askB ? `במשולש $ABC$ הזווית החיצונית $\\angle ACD = ${e}^\\circ$ ו־$\\angle A = ${a}^\\circ$. מה גודל $\\angle B$?`
            : `במשולש $ABC$ הזווית החיצונית $\\angle ACD = ${e}^\\circ$. מה גודל $\\angle ACB$ (הזווית הפנימית ב־C)?`,
          type: 'number', answer: askB ? b : 180 - e,
          mount: el => triFig(el, b, 180 - e, askB ? { A: a + '°', B: '?', ext: e + '°' } : { C: '?', ext: e + '°' }),
          hint: askB ? 'הזווית החיצונית = $\\angle A + \\angle B$. איזה מספר חסר?' : 'הזווית הפנימית ב־C והזווית החיצונית יוצרות יחד קו ישר.',
          steps: askB
            ? ['זווית חיצונית = סכום שתי הזוויות הפנימיות שלא צמודות לה.', `$${e} = ${a} + \\angle B$`, `$\\angle B = ${e} - ${a} = ${b}^\\circ$`]
            : ['$\\angle ACB$ ו־$\\angle ACD$ צמודות — סכומן $180^\\circ$.', `$\\angle ACB = 180 - ${e} = ${180 - e}^\\circ$`],
        };
      } },
      { level: 3, gen() {
        let x, A, B; do { x = U.R(4, 15) * 2; A = U.R(4, 14) * 5; B = U.R(4, 14) * 5; } while (A + B > 160);
        const m1 = U.R(1, 2), b1 = A - m1 * x, useX = Math.random() < 0.5, m2 = useX ? 1 : 0, b2 = B - m2 * x;
        const m3 = m1 + m2 + U.R(1, 2), b3 = A + B - m3 * x;
        const eA = U.lin(m1, b1), eB = useX ? U.lin(m2, b2) : String(B), eE = U.lin(m3, b3);
        return {
          q: `במשולש $ABC$ ממשיכים את $BC$ עד $D$. נתון: $\\angle A = ${eA}$, $\\angle B = ${eB}$${useX ? '' : '^\\circ'}, והזווית החיצונית $\\angle ACD = ${eE}$. מצאו את $x$.`,
          type: 'number', answer: x,
          mount: el => triFig(el, B, 180 - A - B, { A: eA, B: useX ? eB : B + '°', ext: eE }),
          hint: 'כותבים משוואה: זווית חיצונית = $\\angle A + \\angle B$.',
          steps: [`זווית חיצונית = סכום שתי הזוויות הפנימיות שלא צמודות לה: $${eE} = (${eA}) + (${eB})$`, `מכנסים באגף ימין: $${eE} = ${U.lin(m1 + m2, b1 + b2)}$`,
            `מעבירים אגפים: $${U.term(m3 - m1 - m2)} = ${b1 + b2 - b3}$`, `$x = ${x}$`, `בדיקה: $\\angle A = ${A}^\\circ$, $\\angle B = ${B}^\\circ$, והחיצונית $= ${A + B}^\\circ = ${A} + ${B}$ ✔`],
        };
      } },
      { level: 3, gen() {
        let x, a1, a2, a3; do { x = U.R(5, 20); a1 = U.R(5, 18) * 5; a2 = U.R(5, 18) * 5; a3 = 180 - a1 - a2; } while (a3 < 25);
        const ms = [U.R(1, 4), U.R(1, 4), U.R(1, 4)], vs = [a1, a2, a3], bs = vs.map((v, k) => v - ms[k] * x);
        const es = ms.map((m, k) => U.lin(m, bs[k])), M = ms[0] + ms[1] + ms[2], Bs = bs[0] + bs[1] + bs[2];
        return {
          q: `זוויות המשולש $ABC$ הן: $\\angle A = ${es[0]}$, $\\angle B = ${es[1]}$, $\\angle C = ${es[2]}$. מצאו את $x$.`,
          type: 'number', answer: x,
          mount: el => triFig(el, a2, a3, { A: es[0], B: es[1], C: es[2] }, false),
          hint: 'סכום הזוויות במשולש הוא $180^\\circ$. חברו את שלושת הביטויים והשוו ל־180.',
          steps: [`$(${es[0]}) + (${es[1]}) + (${es[2]}) = 180$`, `מכנסים: $${U.lin(M, Bs)} = 180$`, `$${U.term(M)} = ${180 - Bs}$`, `$x = ${x}$`, `בדיקה: $${a1} + ${a2} + ${a3} = 180$ ✔`],
        };
      } },
      { level: 3, gen() {
        const th = goodTh(), x = U.R(3, 12) * 2;
        const i = 0, j = 1, p = U.R(0, 3), q = U.R(0, 3);
        const v1 = size(p, th), v2 = size(q, th), r = relation(i, p, j, q, null);
        let m1 = U.R(1, 4), m2 = U.R(1, 4); if (r.eq && m1 === m2) m1++;
        const b1 = v1 - m1 * x, b2 = v2 - m2 * x, e1 = U.lin(m1, b1), e2 = U.lin(m2, b2);
        const solve = r.eq
          ? [`$${e1} = ${e2}$`, `$${U.term(m1 - m2)} = ${b2 - b1}$`]
          : [`$(${e1}) + (${e2}) = 180$`, `$${U.lin(m1 + m2, b1 + b2)} = 180$`, `$${U.term(m1 + m2)} = ${180 - b1 - b2}$`];
        return {
          q: `הישרים הכחולים מקבילים. הזוויות המסומנות הן $${e1}$ ו־$${e2}$ (במעלות). מצאו את $x$.`,
          type: 'number', answer: x,
          mount: el => parFig(el, th, [{ i, p, label: e1 }, { i: j, p: q, label: e2, color: GREEN }]),
          hint: 'קודם מחליטים: הזוויות שוות, או שסכומן 180? (העבירו את הזווית לצומת השני בעזרת זוויות מתאימות.) ואז כותבים משוואה.',
          steps: [...r.steps, r.eq ? 'לכן הביטויים שווים:' : 'לכן הסכום שלהם 180:', ...solve, `$x = ${x}$`, `בדיקה: הזוויות הן $${v1}^\\circ$ ו־$${v2}^\\circ$ ✔`],
        };
      } },
    ]),

    summary: [
      'זוויות <b>קודקודיות</b> (אחת מול השנייה) — שוות.',
      'זוויות <b>צמודות</b> (אחת ליד השנייה, על קו ישר) — סכומן $180^\\circ$.',
      'בין ישרים מקבילים: זוויות <b>מתאימות</b> שוות, וזוויות <b>מתחלפות</b> שוות.',
      'סכום הזוויות במשולש: $180^\\circ$.',
      '<b>זווית חיצונית</b> למשולש = סכום שתי הזוויות הפנימיות שלא צמודות לה.',
      'כשיש $x$: מזהים את הזוג, כותבים משוואה ("שוות" או "סכום 180") ופותרים. בסוף — בודקים!',
    ],
  });
})();
