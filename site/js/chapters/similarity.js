/* יחידה: דמיון משולשים ומצולעים (פרקים 17–20 בספר) */
(() => {
  // ---------- עזרי שרטוט SVG (מקומיים ליחידה) ----------
  const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${w}px;display:block;margin:6px auto;color:var(--ink)" dir="ltr" font-family="Rubik, sans-serif">${inner}</svg>`;
  const txt = (x, y, s, col = 'currentColor', size = 15, bold = true) =>
    `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" fill="${col}" font-size="${size}"${bold ? ' font-weight="700"' : ''}>${s}</text>`;
  /** משולש: P = 3 נקודות, names = שמות קודקודים, sides = תוויות לצלעות [P0P1, P1P2, P2P0] */
  function triSvg(P, names, sides = [], color = '#2f6fdb') {
    const cx = (P[0][0] + P[1][0] + P[2][0]) / 3, cy = (P[0][1] + P[1][1] + P[2][1]) / 3;
    const out = (x, y, d) => { const dx = x - cx, dy = y - cy, L = Math.hypot(dx, dy) || 1; return [x + dx / L * d, y + dy / L * d]; };
    let s = `<polygon points="${P.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${color}" fill-opacity=".12" stroke="${color}" stroke-width="2.5" stroke-linejoin="round"/>`;
    P.forEach((p, i) => { if (names[i]) { const [x, y] = out(p[0], p[1], 14); s += txt(x, y, names[i]); } });
    sides.forEach((t, i) => {
      if (t === '' || t == null) return;
      const a = P[i], b = P[(i + 1) % 3], [x, y] = out((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, 14);
      s += txt(x, y, t, '#e8702a', 15);
    });
    return s;
  }
  // צורת הבסיס של המשולש (ביחידות, y כלפי מטה)
  const SHAPE = [[1.3, 0], [0, 2.6], [4, 2.6]];
  /** שני משולשים דומים זה ליד זה: ABC קטן, DEF גדול */
  function twoTris(el, s1, s2) {
    const u = 26, big = 1.7, sc = (p, f, ox) => [ox + p[0] * u * f, 20 + 2.6 * u * (big - f) + p[1] * u * f];
    const w1 = 4 * u, w2 = 4 * u * big;
    const P1 = SHAPE.map(p => sc(p, 1, 24)), P2 = SHAPE.map(p => sc(p, big, 24 + w1 + 50));
    el.innerHTML = svg(w1 + w2 + 100, 2.6 * u * big + 46,
      triSvg(P1, ['A', 'B', 'C'], s1, '#2f6fdb') + triSvg(P2, ['D', 'E', 'F'], s2, '#1f9d55')) +
      '<p class="muted" style="text-align:center;margin:0">השרטוט לא בקנה מידה</p>';
  }
  const TRIPLES = [[3, 4, 5], [4, 5, 6], [5, 6, 8], [3, 5, 7], [4, 6, 7], [2, 3, 4], [5, 7, 9], [6, 7, 8], [3, 6, 8]];
  const S1 = ['AB', 'BC', 'CA'], S2 = ['DE', 'EF', 'FD'];
  const randAngles = () => { const a = 10 * U.R(3, 9), b = 10 * U.R(3, Math.min(9, (160 - a) / 10)); return [a, b, 180 - a - b]; };

  registerChapter('similarity', {
    intro: `
      <p>שני משולשים <b>דומים</b> אם יש להם <b>אותה צורה</b> — אחד הוא "הגדלה" (או הקטנה) של השני, כמו תמונה שעושים לה זום.</p>
      <div class="idea"><b>מה מתקיים במשולשים דומים?</b>
        1. <b>הזוויות המתאימות שוות.</b><br>2. <b>הצלעות המתאימות פרופורציוניות</b> — כל צלע גדלה פי אותו מספר.
        <br>כותבים: $\\triangle ABC \\sim \\triangle DEF$. הסדר חשוב: $A$ מתאים ל־$D$, $B$ ל־$E$, $C$ ל־$F$.</div>
      <div class="formula">$k = \\dfrac{DE}{AB} = \\dfrac{EF}{BC} = \\dfrac{FD}{CA}$</div>
      <div class="idea"><b>יחס הדמיון k</b>פי כמה המשולש השני גדול מהראשון. אם $k = 3$, כל צלע במשולש השני ארוכה פי 3. אם $k = \\frac{1}{2}$ — הוא קטן פי 2.</div>
      <div class="idea"><b>משפט הדמיון ז.ז (זווית־זווית)</b>אם <b>שתי זוויות</b> במשולש אחד שוות לשתי זוויות במשולש אחר — המשולשים דומים.
        <br>למה מספיק שתיים? כי סכום הזוויות במשולש הוא $180^\\circ$, אז גם הזווית השלישית שווה אוטומטית.</div>
      <div class="idea"><b>יחס השטחים = k²</b>אם הצלעות גדלות פי $k$, השטח גדל פי $k^2$. צלעות פי 2 ← שטח פי 4. צלעות פי 3 ← שטח פי 9.</div>
      <div class="note"><b>מצולעים דומים</b><br>במצולע (למשל מלבן) צריך את <b>שני</b> התנאים: זוויות שוות <b>וגם</b> צלעות פרופורציוניות.
        ריבוע ומלבן 1×3 — כל הזוויות $90^\\circ$, אבל הם <b>לא</b> דומים. ז.ז עובד רק במשולשים!</div>
      <p class="muted">טיפ: במערכת הצירים, אם כופלים את כל הקואורדינטות של משולש באותו מספר $k$, מקבלים משולש דומה עם יחס דמיון $k$.</p>`,

    example: {
      question: 'במשולש $ABC$ הנקודה $D$ על $AB$ והנקודה $E$ על $AC$, כך ש־$DE \\parallel BC$. נתון: $AD = 4$, $AB = 10$, $DE = 6$.<br>א. הוכיחו ש־$\\triangle ADE \\sim \\triangle ABC$. ב. מצאו את $BC$. ג. פי כמה השטח של $ABC$ גדול מהשטח של $ADE$?',
      steps: [
        'מחפשים שתי זוויות שוות (משפט ז.ז). הזווית $\\angle A$ נמצאת בשני המשולשים — <b>זווית משותפת</b>.',
        '$DE \\parallel BC$, ולכן $\\angle ADE = \\angle ABC$ — <b>זוויות מתאימות בין ישרים מקבילים</b>.',
        'יש שתי זוויות שוות ← לפי <b>ז.ז</b>: $\\triangle ADE \\sim \\triangle ABC$. (A↔A, D↔B, E↔C)',
        'סעיף ב: יחס הדמיון לפי הצלעות המתאימות $AD$ ו־$AB$: $k = \\frac{AB}{AD} = \\frac{10}{4} = 2.5$.',
        'כל צלע במשולש הגדול ארוכה פי 2.5. הצלע $BC$ מתאימה ל־$DE$: $BC = 2.5 \\cdot 6 = 15$.',
        'סעיף ג: יחס השטחים הוא $k^2 = 2.5^2 = 6.25$.',
        'כלומר השטח של $ABC$ גדול פי 6.25 מהשטח של $ADE$ (ולא פי 2.5!).',
      ],
    },

    tools: [
      {
        title: 'מכונת ההגדלה',
        desc: 'גררו את הקודקודים של המשולש הכחול ושנו את k. המשולש הירוק הוא הגדלה פי k מהנקודה O. שימו לב: הזוויות לא משתנות, כל צלע גדלה פי k, והשטח — פי k².',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const st = { k: 2 };
          const brd = U.board(el, [-1, 10, 11, -1]);
          const O = brd.create('point', [0, 0], { name: 'O', color: '#666', size: 3, fixed: true });
          const A = brd.create('point', [1, 3], { name: 'A', color: '#2f6fdb', size: 5 });
          const B = brd.create('point', [1, 1], { name: 'B', color: '#2f6fdb', size: 5 });
          const C = brd.create('point', [3.5, 1], { name: 'C', color: '#2f6fdb', size: 5 });
          const img = (P, n) => brd.create('point', [() => st.k * P.X(), () => st.k * P.Y()], { name: n, color: '#1f9d55', size: 4, fixed: true });
          const A2 = img(A, "A'"), B2 = img(B, "B'"), C2 = img(C, "C'");
          brd.create('polygon', [A, B, C], { fillColor: '#2f6fdb', fillOpacity: 0.2, borders: { strokeColor: '#2f6fdb', strokeWidth: 3 } });
          brd.create('polygon', [A2, B2, C2], { fillColor: '#1f9d55', fillOpacity: 0.15, borders: { strokeColor: '#1f9d55', strokeWidth: 3 } });
          for (const P of [A2, B2, C2]) brd.create('segment', [O, P], { strokeColor: '#999', dash: 2, strokeWidth: 1 });
          const d = (P, Q) => Math.hypot(P.X() - Q.X(), P.Y() - Q.Y());
          const ang = (P, Q, R) => Math.round(JXG.Math.Geometry.trueAngle(Q, P, R) > 180 ? 360 - JXG.Math.Geometry.trueAngle(Q, P, R) : JXG.Math.Geometry.trueAngle(Q, P, R));
          const area = (P, Q, R) => Math.abs((Q.X() - P.X()) * (R.Y() - P.Y()) - (R.X() - P.X()) * (Q.Y() - P.Y())) / 2;
          const upd = () => {
            const n = v => U.num(v);
            out.innerHTML = `<table style="margin:auto;border-collapse:collapse" dir="ltr">
              <tr><td>AB = ${n(d(A, B))}</td><td>&nbsp;→&nbsp;</td><td>A'B' = ${n(d(A2, B2))}</td></tr>
              <tr><td>BC = ${n(d(B, C))}</td><td>&nbsp;→&nbsp;</td><td>B'C' = ${n(d(B2, C2))}</td></tr>
              <tr><td>CA = ${n(d(C, A))}</td><td>&nbsp;→&nbsp;</td><td>C'A' = ${n(d(C2, A2))}</td></tr></table>
              <div>כל צלע גדלה פי <b>${n(st.k)}</b> · הזוויות: <span dir="ltr">${ang(A, B, C)}°, ${ang(B, C, A)}°, ${ang(C, A, B)}°</span> בשני המשולשים</div>
              <div>שטח: <span dir="ltr">${n(area(A, B, C))} → ${n(area(A2, B2, C2))}</span> — פי <b>${n(st.k * st.k)}</b> = $k^2$</div>`;
            U.math(out);
          };
          brd.on('update', upd);
          U.slider(el, { label: 'יחס הדמיון k', min: 0.5, max: 3, step: 0.25, value: 2, onInput: v => { st.k = v; brd.update(); upd(); } });
        },
      },
      {
        title: 'ז.ז — שתי זוויות מספיקות',
        desc: 'בחרו שתי זוויות. שני המשולשים בנויים עם אותן זוויות אבל בסיס באורך שונה. בדקו: היחס בין כל זוג צלעות מתאימות יוצא אותו דבר — המשולשים דומים.',
        mount(el) {
          const st = { b: 60, c: 50, L: 5 };
          const pic = document.createElement('div'), out = document.createElement('div');
          out.className = 'readout'; el.append(pic, out);
          const build = L => {  // ביחידות, B בראשית, y למעלה
            const rb = st.b * Math.PI / 180, rc = st.c * Math.PI / 180;
            const AB = L * Math.sin(rc) / Math.sin(rb + rc);  // משפט הסינוסים, רק לציור
            const P = [[AB * Math.cos(rb), AB * Math.sin(rb)], [0, 0], [L, 0]];
            return { P, AB, BC: L, CA: L * Math.sin(rb) / Math.sin(rb + rc), x0: Math.min(0, P[0][0]), x1: Math.max(L, P[0][0]), h: P[0][1] };
          };
          const upd = () => {
            if (st.b + st.c >= 180) { pic.innerHTML = ''; out.innerHTML = `$${st.b}^\\circ + ${st.c}^\\circ$ — זה כבר $180^\\circ$ או יותר! סכום הזוויות במשולש הוא $180^\\circ$, אז אין משולש כזה. הקטינו זווית.`; U.math(out); return; }
            const t1 = build(3), t2 = build(st.L), u = Math.min(40, 190 / Math.max(t1.h, t2.h));
            const px = (t, ox) => t.P.map(([x, y]) => [ox + (x - t.x0) * u, 215 - y * u]);
            const o2 = 25 + (t1.x1 - t1.x0) * u + 45;
            pic.innerHTML = svg(o2 + (t2.x1 - t2.x0) * u + 25, 235,
              triSvg(px(t1, 25), ['A', 'B', 'C'], [], '#2f6fdb') + triSvg(px(t2, o2), ['D', 'E', 'F'], [], '#1f9d55'));
            const a = 180 - st.b - st.c, n = U.num;
            out.innerHTML = `הזווית השלישית: $180^\\circ - ${st.b}^\\circ - ${st.c}^\\circ = ${a}^\\circ$ בשני המשולשים<br>
              <span dir="ltr">DE/AB = ${n(t2.AB / t1.AB)} · EF/BC = ${n(t2.BC / t1.BC)} · FD/CA = ${n(t2.CA / t1.CA)}</span><br>
              כל היחסים שווים ← <b>המשולשים דומים</b>, $k = ${n(st.L / 3)}$`;
            U.math(out);
          };
          U.slider(el, { label: 'זווית B (וגם E)', min: 30, max: 100, step: 5, value: st.b, fmt: v => v + '°', onInput: v => { st.b = v; upd(); } });
          U.slider(el, { label: 'זווית C (וגם F)', min: 30, max: 100, step: 5, value: st.c, fmt: v => v + '°', onInput: v => { st.c = v; upd(); } });
          U.slider(el, { label: 'הבסיס EF', min: 1.5, max: 6, step: 0.5, value: st.L, onInput: v => { st.L = v; upd(); } });
        },
      },
      {
        title: 'למה השטח גדל פי k²?',
        desc: 'משולש שהצלעות שלו פי k מהמשולש הקטן — אפשר לרצף אותו בדיוק ב־k² משולשים קטנים. שנו את k וספרו.',
        mount(el) {
          const pic = document.createElement('div'), out = document.createElement('div');
          out.className = 'readout'; el.append(pic, out);
          const upd = k => {
            const W = 300, s = W / k, h = s * Math.sqrt(3) / 2, oy = 10 + k * h;
            const pt = (i, j) => [10 + j * s + i * s / 2, oy - i * h]; // i = שורה מלמטה
            let g = '';
            for (let i = 0; i < k; i++) for (let j = 0; j < k - i; j++) {
              const up = [pt(i, j), pt(i, j + 1), pt(i + 1, j)];
              g += `<polygon points="${up.map(p => p.join(',')).join(' ')}" fill="#e8702a" fill-opacity=".35" stroke="#e8702a" stroke-width="1.5"/>`;
              if (j < k - i - 1) {
                const dn = [pt(i, j + 1), pt(i + 1, j + 1), pt(i + 1, j)];
                g += `<polygon points="${dn.map(p => p.join(',')).join(' ')}" fill="#2f6fdb" fill-opacity=".25" stroke="#e8702a" stroke-width="1.5"/>`;
              }
            }
            pic.innerHTML = svg(W + 20, oy + 10, g);
            out.innerHTML = `הצלע גדולה פי <b>${k}</b> ← יש <b>${k * k}</b> משולשים קטנים ← השטח גדול פי $${k}^2 = ${k * k}$`;
            U.math(out);
          };
          U.slider(el, { label: 'k', min: 1, max: 6, step: 1, value: 2, onInput: upd });
        },
      },
    ],

    exercises: [
      // ---------- רמה 1 ----------
      { level: 1, gen() {
        const s = U.pick(TRIPLES), k = U.R(2, 4), i = U.R(0, 2), j = (i + U.R(1, 2)) % 3, down = Math.random() < 0.3;
        const big = s.map(v => v * k);
        const l1 = ['', '', ''], l2 = ['', '', ''];
        l1[i] = s[i]; l2[i] = big[i];
        if (down) l2[j] = big[j], l1[j] = '?'; else l1[j] = s[j], l2[j] = '?';
        return {
          q: `$\\triangle ABC \\sim \\triangle DEF$. נתון: $${S1[i]} = ${s[i]}$, $${S2[i]} = ${big[i]}$, ${down ? `$${S2[j]} = ${big[j]}$` : `$${S1[j]} = ${s[j]}$`}. מצאו את $${down ? S1[j] : S2[j]}$.`,
          type: 'number', answer: down ? s[j] : big[j],
          mount: el => twoTris(el, l1, l2),
          hint: `קודם מוצאים את יחס הדמיון: פי כמה $${S2[i]}$ גדול מ־$${S1[i]}$? כל הצלעות גדלות פי אותו מספר.`,
          steps: [`הצלע $${S1[i]}$ מתאימה ל־$${S2[i]}$, והצלע $${S1[j]}$ מתאימה ל־$${S2[j]}$.`,
            `יחס הדמיון: $k = \\frac{${big[i]}}{${s[i]}} = ${k}$ — המשולש $DEF$ גדול פי ${k}.`,
            down ? `$${S1[j]} = ${big[j]} \\div ${k} = ${s[j]}$` : `$${S2[j]} = ${k} \\cdot ${s[j]} = ${big[j]}$`],
        };
      } },
      { level: 1, gen() {
        const a = U.R(2, 9), k = U.R(2, 5), i = U.R(0, 2);
        return {
          q: `$\\triangle ABC \\sim \\triangle DEF$. הצלע $${S1[i]} = ${a}$ והצלע המתאימה לה $${S2[i]} = ${a * k}$. מהו יחס הדמיון $k$ (פי כמה $DEF$ גדול מ־$ABC$)?`,
          type: 'number', answer: k,
          hint: 'יחס הדמיון = הצלע במשולש הגדול חלקי הצלע המתאימה במשולש הקטן.',
          steps: [`$k = \\frac{${S2[i]}}{${S1[i]}} = \\frac{${a * k}}{${a}}$`, `$k = ${k}$ — כל צלע ב־$DEF$ ארוכה פי ${k}.`],
        };
      } },
      { level: 1, gen() {
        const ang = randAngles(), i = U.R(0, 2), V1 = 'ABC', V2 = 'DEF';
        return {
          q: `$\\triangle ABC \\sim \\triangle DEF$. נתון: $\\angle A = ${ang[0]}^\\circ$, $\\angle B = ${ang[1]}^\\circ$, $\\angle C = ${ang[2]}^\\circ$. מה גודל הזווית $\\angle ${V2[i]}$ (במעלות)?`,
          type: 'number', answer: ang[i],
          hint: 'במשולשים דומים הזוויות המתאימות שוות. לפי סדר האותיות: A↔D, B↔E, C↔F.',
          steps: [`לפי הסדר בכתיב: $${V1[i]}$ מתאים ל־$${V2[i]}$.`, `זוויות מתאימות שוות: $\\angle ${V2[i]} = \\angle ${V1[i]} = ${ang[i]}^\\circ$.`],
        };
      } },
      { level: 1, gen() {
        let a = randAngles(), same = Math.random() < 0.5;
        let b = [...a];
        if (!same) { const d = U.pick([10, 20]); b = a[1] - d >= 20 ? [a[0] + d, a[1] - d, a[2]] : [a[0] - d, a[1] + d, a[2]]; }
        const b2 = U.shuffle(b), f = arr => arr.map(v => v + '^\\circ').join(',\\ ');
        same = f([...a].sort((x, y) => x - y)) === f([...b].sort((x, y) => x - y));
        return {
          q: `הזוויות במשולש אחד: $${f(a)}$. הזוויות במשולש שני: $${f(b2)}$. האם המשולשים דומים?`,
          type: 'choice', choices: ['כן, דומים', 'לא דומים'], answer: same ? 0 : 1,
          hint: 'משולשים דומים אם יש להם בדיוק אותן זוויות (הסדר לא משנה).',
          steps: [`נסדר את הזוויות מהקטנה לגדולה: $${f([...a].sort((x, y) => x - y))}$ לעומת $${f([...b].sort((x, y) => x - y))}$.`,
            same ? 'אותן זוויות ← <b>המשולשים דומים</b> (מספיק אפילו שתי זוויות שוות — ז.ז).' : 'הזוויות שונות ← <b>לא דומים</b>.'],
        };
      } },
      // ---------- רמה 2 ----------
      { level: 2, gen() {
        const k = U.R(2, 5), S = U.R(2, 12), mode = U.R(0, 2);
        const qs = [
          `$\\triangle ABC \\sim \\triangle DEF$ ביחס דמיון $k = ${k}$ ($DEF$ הגדול). שטח $ABC$ הוא ${S} סמ"ר. מה שטח $DEF$?`,
          `$\\triangle ABC \\sim \\triangle DEF$. שטח $ABC$ הוא ${S} סמ"ר ושטח $DEF$ הוא ${S * k * k} סמ"ר. מהו יחס הדמיון $k$?`,
          `$\\triangle ABC \\sim \\triangle DEF$ ביחס דמיון $k = ${k}$ ($DEF$ הגדול). שטח $DEF$ הוא ${S * k * k} סמ"ר. מה שטח $ABC$?`,
        ];
        return {
          q: qs[mode], type: 'number', answer: [S * k * k, k, S][mode],
          hint: 'יחס השטחים הוא $k^2$ (יחס הדמיון בריבוע), לא $k$!',
          steps: mode === 0 ? [`יחס השטחים: $k^2 = ${k}^2 = ${k * k}$.`, `שטח $DEF = ${S} \\cdot ${k * k} = ${S * k * k}$ סמ"ר.`]
            : mode === 1 ? [`יחס השטחים: $\\frac{${S * k * k}}{${S}} = ${k * k}$.`, `יחס השטחים הוא $k^2$, אז $k^2 = ${k * k}$.`, `$k = \\sqrt{${k * k}} = ${k}$.`]
            : [`יחס השטחים: $k^2 = ${k * k}$.`, `שטח $ABC = ${S * k * k} \\div ${k * k} = ${S}$ סמ"ר.`],
        };
      } },
      { level: 2, gen() {
        const k = U.pick([1.5, 2.5, 0.5]), a = 2 * U.R(1, 6), b = 2 * U.R(1, 6), i = U.R(0, 2), j = (i + U.R(1, 2)) % 3;
        const l1 = ['', '', ''], l2 = ['', '', ''];
        l1[i] = a; l2[i] = a * k; l1[j] = b; l2[j] = '?';
        return {
          q: `$\\triangle ABC \\sim \\triangle DEF$. נתון: $${S1[i]} = ${a}$, $${S2[i]} = ${U.num(a * k)}$, $${S1[j]} = ${b}$. מצאו את $${S2[j]}$.`,
          type: 'number', answer: b * k,
          mount: el => twoTris(el, l1, l2),
          hint: `יחס הדמיון יכול לצאת לא שלם. חשבו $k = ${S2[i]} \\div ${S1[i]}$ וכפלו בו.`,
          steps: [`$k = \\frac{${U.num(a * k)}}{${a}} = ${k}$`, `$${S2[j]} = ${k} \\cdot ${b} = ${U.num(b * k)}$`,
            k < 1 ? `שימו לב: $k < 1$, אז $DEF$ דווקא <b>קטן</b> יותר.` : `בדיקה: גם $${U.num(a * k)} \\div ${a} = ${U.num(b * k)} \\div ${b} = ${k}$ ✔`],
        };
      } },
      { level: 2, gen() {
        let a = U.R(2, 6), b = a + U.R(1, 4), k = U.R(2, 3), same = Math.random() < 0.5;
        const c = a * k, d = same ? b * k : b * k + U.pick([-1, 1, 2]);
        same = c * b === d * a || c * a === d * b;
        return {
          q: `מלבן אחד בגודל $${a} \\times ${b}$ ומלבן שני בגודל $${c} \\times ${d}$. האם המלבנים דומים?`,
          type: 'choice', choices: ['כן, דומים', 'לא דומים'], answer: same ? 0 : 1,
          hint: 'במלבנים כל הזוויות שוות ($90^\\circ$). צריך לבדוק אם <b>גם</b> הצלעות גדלו פי אותו מספר.',
          steps: [`הזוויות: כולן $90^\\circ$ בשני המלבנים ✔`, `הצלע הקצרה: $${c} \\div ${a} = ${k}$. הצלע הארוכה: $${d} \\div ${b} = ${U.num(d / b)}$.`,
            same ? 'אותו יחס ← הצלעות פרופורציוניות ← <b>דומים</b>.' : 'היחסים שונים ← <b>לא דומים</b> (זוויות שוות לא מספיקות במצולע!).'],
        };
      } },
      { level: 2, gen() {
        const R = ['זווית משותפת', 'זוויות קודקודיות', 'זוויות מתאימות בין ישרים מקבילים', 'זוויות מתחלפות בין ישרים מקבילים'];
        const bow = Math.random() < 0.5, ask = U.R(0, 1);
        let q, ans, pic;
        if (!bow) {
          q = `במשולש $ABC$, $DE \\parallel BC$. מוכיחים ש־$\\triangle ADE \\sim \\triangle ABC$. ${ask ? 'למה $\\angle ADE = \\angle ABC$?' : 'למה הזווית $\\angle A$ שווה בשני המשולשים?'}`;
          ans = ask ? 2 : 0;
          pic = triSvg([[120, 25], [20, 185], [240, 185]], ['A', 'B', 'C']) +
            `<line x1="70" y1="105" x2="180" y2="105" stroke="#1f9d55" stroke-width="3"/>` + txt(58, 105, 'D') + txt(193, 105, 'E');
        } else {
          q = `$AB \\parallel CD$, והקטעים $AD$ ו־$BC$ נחתכים בנקודה $O$. מוכיחים ש־$\\triangle AOB \\sim \\triangle DOC$. ${ask ? 'למה $\\angle AOB = \\angle DOC$?' : 'למה $\\angle BAO = \\angle CDO$?'}`;
          ans = ask ? 1 : 3;
          const A = [30, 20], B = [130, 20], C = [60, 180], D = [260, 180], O = [30 + 230 * (1 / 3.0), 20 + 160 / 3];
          pic = `<g stroke="#2f6fdb" stroke-width="2.5"><line x1="${A[0]}" y1="${A[1]}" x2="${B[0]}" y2="${B[1]}"/><line x1="${C[0]}" y1="${C[1]}" x2="${D[0]}" y2="${D[1]}"/></g>
            <g stroke="#1f9d55" stroke-width="2.5"><line x1="${A[0]}" y1="${A[1]}" x2="${D[0]}" y2="${D[1]}"/><line x1="${B[0]}" y1="${B[1]}" x2="${C[0]}" y2="${C[1]}"/></g>` +
            txt(A[0] - 10, A[1] - 6, 'A') + txt(B[0] + 10, B[1] - 6, 'B') + txt(C[0] - 10, C[1] + 8, 'C') + txt(D[0] + 10, D[1] + 8, 'D') + txt(O[0] + 16, O[1], 'O');
        }
        return {
          q, type: 'choice', choices: R, answer: ans,
          mount: el => { el.innerHTML = svg(280, 210, pic); },
          hint: 'משותפת = אותה זווית בדיוק. קודקודיות = שני ישרים נחתכים (צורת X). בין מקבילים: מתאימות = "באותו מקום" בשני החיתוכים, מתחלפות = בצורת Z.',
          steps: [`התשובה: <b>${R[ans]}</b>.`,
            ans === 0 ? 'הזווית $\\angle A$ היא חלק משני המשולשים — היא אותה זווית.' : ans === 1 ? 'הקטעים $AD$ ו־$BC$ נחתכים ב־$O$ ויוצרים X — הזוויות שמול זו מול זו שוות.'
              : ans === 2 ? 'הישר $AB$ חותך את המקבילים $DE$ ו־$BC$. הזוויות נמצאות "באותו מקום" בשני החיתוכים.' : 'הישר $AD$ חותך את המקבילים $AB$ ו־$CD$. הזוויות נמצאות בצדדים מנוגדים (צורת Z).',
            'עם עוד זווית אחת שווה — המשולשים דומים לפי <b>ז.ז</b>.'],
        };
      } },
      { level: 2, gen() {
        const a = U.R(2, 4), c = U.R(1, 3), d = U.R(1, 3), k = U.R(2, 3);
        return {
          q: `המשולש $OAB$: $O(0, 0)$, $A(${a}, 0)$, $B(${c}, ${d})$. כופלים את כל הקואורדינטות ב־${k} ומקבלים משולש דומה $OA'B'$. מהן הקואורדינטות של $B'$?`,
          type: 'pair', answer: [c * k, d * k],
          mount(el) {
            const brd = U.board(el, [-1, 10, 13, -1]);
            const p = (x, y, n, col) => brd.create('point', [x, y], { name: n, color: col, size: 3, fixed: true });
            brd.create('polygon', [p(0, 0, 'O', '#666'), p(a, 0, 'A', '#2f6fdb'), p(c, d, 'B', '#2f6fdb')], { fillColor: '#2f6fdb', fillOpacity: 0.2, borders: { strokeColor: '#2f6fdb', strokeWidth: 3 } });
          },
          hint: `כופלים <b>גם</b> את ה־x <b>וגם</b> את ה־y של $B$ ב־${k}.`,
          steps: [`$B(${c}, ${d})$`, `$x$: $${c} \\cdot ${k} = ${c * k}$, $y$: $${d} \\cdot ${k} = ${d * k}$`, `$B'(${c * k}, ${d * k})$ — וכל צלע במשולש החדש ארוכה פי ${k}.`],
        };
      } },
      // ---------- רמה 3 ----------
      { level: 3, gen() {
        const k = U.pick([2, 3, 1.5, 2.5]), AD = k % 1 ? 2 * U.R(1, 4) : U.R(2, 6), AB = AD * k, DE = k % 1 ? 2 * U.R(1, 5) : U.R(2, 7), BC = DE * k;
        const DB = AB - AD;
        return {
          q: `במשולש $ABC$, $DE \\parallel BC$ ($D$ על $AB$, $E$ על $AC$). נתון: $AD = ${AD}$, $DB = ${U.num(DB)}$, $DE = ${DE}$. מצאו את $BC$.`,
          type: 'number', answer: BC,
          mount(el) {
            el.innerHTML = svg(280, 210, triSvg([[120, 25], [20, 185], [240, 185]], ['A', 'B', 'C'], ['', '?', '']) +
              `<line x1="70" y1="105" x2="180" y2="105" stroke="#1f9d55" stroke-width="3"/>` + txt(56, 105, 'D') + txt(193, 105, 'E') +
              txt(80, 60, AD, '#e8702a') + txt(30, 148, U.num(DB), '#e8702a') + txt(125, 93, DE, '#1f9d55'));
          },
          hint: 'המשולשים $ADE$ ו־$ABC$ דומים (ז.ז). שימו לב: הצלע שמתאימה ל־$AD$ היא $AB$ כולה, לא $DB$!',
          steps: [`$\\triangle ADE \\sim \\triangle ABC$ לפי ז.ז (זווית $A$ משותפת, $\\angle ADE = \\angle ABC$ מתאימות).`,
            `$AB = AD + DB = ${AD} + ${U.num(DB)} = ${U.num(AB)}$`, `$k = \\frac{AB}{AD} = \\frac{${U.num(AB)}}{${AD}} = ${k}$`, `$BC = ${k} \\cdot ${DE} = ${U.num(BC)}$`],
        };
      } },
      { level: 3, gen() {
        const k = U.R(2, 4), s = U.R(2, 9), mode = U.R(0, 1);
        return {
          q: mode ? `במשולש $ABC$, $DE \\parallel BC$ ו־$AB = ${k} \\cdot AD$. שטח המשולש $ABC$ הוא ${s * k * k} סמ"ר. מה שטח המשולש $ADE$?`
            : `במשולש $ABC$, $DE \\parallel BC$ ו־$AB = ${k} \\cdot AD$. שטח המשולש $ADE$ הוא ${s} סמ"ר. מה שטח הטרפז $DBCE$?`,
          type: 'number', answer: mode ? s : s * (k * k - 1),
          hint: mode ? 'יחס הדמיון הוא $k$, ויחס השטחים הוא $k^2$.' : 'שטח הטרפז = שטח המשולש הגדול פחות שטח המשולש הקטן. ואת שטח הגדול מוצאים בעזרת $k^2$.',
          steps: mode ? [`$\\triangle ADE \\sim \\triangle ABC$ (ז.ז) עם $k = ${k}$.`, `יחס השטחים: $k^2 = ${k * k}$.`, `שטח $ADE = ${s * k * k} \\div ${k * k} = ${s}$ סמ"ר.`]
            : [`$\\triangle ADE \\sim \\triangle ABC$ (ז.ז) עם $k = ${k}$.`, `יחס השטחים: $k^2 = ${k * k}$, אז שטח $ABC = ${s} \\cdot ${k * k} = ${s * k * k}$.`, `שטח הטרפז $= ${s * k * k} - ${s} = ${s * (k * k - 1)}$ סמ"ר.`],
        };
      } },
      { level: 3, gen() {
        const a = U.R(1, 4), b = 2 * U.R(1, 3), k = U.R(2, 3), S = a * b / 2;
        return {
          q: `המשולש $O(0, 0)$, $A(${a}, 0)$, $B(0, ${b})$. כופלים את כל הקואורדינטות ב־${k}. מה השטח של המשולש החדש?`,
          type: 'number', answer: S * k * k,
          mount(el) {
            const brd = U.board(el, [-1, 13, 13, -1]);
            const p = (x, y, n, col) => brd.create('point', [x, y], { name: n, color: col, size: 3, fixed: true });
            brd.create('polygon', [p(0, 0, 'O', '#666'), p(a, 0, 'A', '#2f6fdb'), p(0, b, 'B', '#2f6fdb')], { fillColor: '#2f6fdb', fillOpacity: 0.25, borders: { strokeColor: '#2f6fdb', strokeWidth: 3 } });
          },
          hint: 'שתי דרכים: למצוא את הקודקודים החדשים ולחשב שטח, או לחשב את השטח המקורי ולכפול ב־$k^2$.',
          steps: [`שטח המשולש המקורי (ישר זווית): $\\frac{${a} \\cdot ${b}}{2} = ${S}$.`, `יחס הדמיון $k = ${k}$, אז יחס השטחים $k^2 = ${k * k}$.`,
            `השטח החדש: $${S} \\cdot ${k * k} = ${S * k * k}$.`, `בדיקה: הקודקודים החדשים $(${a * k}, 0)$, $(0, ${b * k})$ ← $\\frac{${a * k} \\cdot ${b * k}}{2} = ${S * k * k}$ ✔`],
        };
      } },
    ],

    summary: [
      'משולשים דומים = אותה צורה: <b>זוויות מתאימות שוות</b> ו<b>צלעות מתאימות פרופורציוניות</b>.',
      'יחס הדמיון $k$ = צלע במשולש אחד חלקי הצלע המתאימה במשולש השני. בכתיב $\\triangle ABC \\sim \\triangle DEF$ הסדר קובע מי מתאים למי.',
      '<b>ז.ז:</b> שתי זוויות שוות ← המשולשים דומים. מחפשים זווית משותפת, קודקודיות, מתאימות או מתחלפות בין מקבילים.',
      'יחס השטחים = $k^2$. צלעות פי 3 ← שטח פי 9.',
      'מצולעים דומים צריכים <b>גם</b> זוויות שוות <b>וגם</b> צלעות פרופורציוניות (ריבוע ומלבן — לא דומים).',
      'במערכת הצירים: כפל כל הקואורדינטות ב־$k$ נותן משולש דומה ביחס $k$.',
    ],
  });
})();
