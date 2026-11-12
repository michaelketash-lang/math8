/* יחידה: משפט פיתגורס (פרק 21 בספר) */
(() => {
  // ---------- עזרי שרטוט SVG (מקומיים ליחידה) ----------
  const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" style="width:100%;max-width:${w}px;display:block;margin:6px auto;color:var(--ink)" dir="ltr" font-family="Rubik, sans-serif">${inner}</svg>`;
  const txt = (x, y, s, col = 'currentColor', size = 15) =>
    `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" fill="${col}" font-size="${size}" font-weight="700">${s}</text>`;
  const poly = (P, col, op = 0.15, w = 2.5) => `<polygon points="${P.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${col}" fill-opacity="${op}" stroke="${col}" stroke-width="${w}" stroke-linejoin="round"/>`;
  /** משולש ישר זווית: ניצב אופקי a, ניצב אנכי b (לפרופורציה), תוויות לניצבים וליתר, ושמות קודקודים [ישרה, אופקי, אנכי] */
  function rightTri(el, a, b, la, lb, lc, names = ['', '', '']) {
    const sc = 150 / Math.max(a, b), w = Math.max(a * sc, 40), h = Math.max(b * sc, 40);
    const C = [40, 20 + h], B = [40 + w, 20 + h], A = [40, 20];
    el.innerHTML = svg(w + 90, h + 50, poly([A, B, C], '#2f6fdb') +
      `<path d="M${C[0] + 14} ${C[1]} V${C[1] - 14} H${C[0]}" fill="none" stroke="currentColor" stroke-width="1.5"/>` +
      txt((C[0] + B[0]) / 2, C[1] + 16, la, '#e8702a') + txt(C[0] - 18, (A[1] + C[1]) / 2, lb, '#e8702a') +
      txt((A[0] + B[0]) / 2 + 14, (A[1] + B[1]) / 2 - 12, lc, '#1f9d55') +
      txt(C[0] - 12, C[1] + 12, names[0]) + txt(B[0] + 12, B[1] + 8, names[1]) + txt(A[0] - 12, A[1] - 6, names[2]));
  }
  const SMALL = [[3, 4, 5], [6, 8, 10], [5, 12, 13], [9, 12, 15], [8, 15, 17], [12, 16, 20]];
  const ALL = [...SMALL, [7, 24, 25], [15, 20, 25], [20, 21, 29], [10, 24, 26], [15, 36, 39], [9, 40, 41]];
  const BOX = [[2, 3, 6, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 6, 7, 11], [3, 4, 12, 13], [2, 5, 14, 15], [2, 10, 11, 15], [8, 9, 12, 17], [4, 8, 8, 12]];
  const sq = n => n < 0 ? `(${n})^2` : `${n}^2`;

  registerChapter('pythagoras', {
    intro: `
      <p>במשולש <b>ישר זווית</b> יש שמות מיוחדים לצלעות:</p>
      <div class="idea"><b>ניצבים ויתר</b>שתי הצלעות שיוצרות את הזווית הישרה נקראות <b>ניצבים</b> ($a$ ו־$b$).
        <br>הצלע שמול הזווית הישרה נקראת <b>יתר</b> ($c$). היתר היא תמיד <b>הצלע הארוכה ביותר</b>.</div>
      <div class="formula">$a^2 + b^2 = c^2$</div>
      <div class="idea"><b>משפט פיתגורס</b>במשולש ישר זווית: ניצב בריבוע ועוד ניצב בריבוע שווה ליתר בריבוע.
        <br>בתמונה: אם בונים ריבוע על כל צלע, השטח של הריבוע על היתר שווה לסכום השטחים של שני הריבועים על הניצבים. למשל $9 + 16 = 25$.</div>
      <div class="idea"><b>מוצאים יתר / מוצאים ניצב</b>
        יתר: $c = \\sqrt{a^2 + b^2}$ (מחברים ואז שורש).<br>
        ניצב: $b = \\sqrt{c^2 - a^2}$ (מחסירים ואז שורש).</div>
      <div class="idea"><b>מרחק בין נקודות במערכת הצירים</b>מציירים משולש ישר זווית: ניצב אחד = ההפרש ב־$x$, ניצב שני = ההפרש ב־$y$.
        <br>$d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$</div>
      <div class="idea"><b>במרחב — האלכסון של תיבה</b>לתיבה עם מידות $a$, $b$, $h$: $d^2 = a^2 + b^2 + h^2$ (פיתגורס פעמיים).</div>
      <div class="note"><b>משפט חפיפה נוסף (צ.צ.ז) — רק למשולשים ישרי זווית</b><br>
        אם לשני משולשים ישרי זווית יש <b>יתר שווה</b> ו<b>ניצב שווה</b> — הם חופפים. (בגלל פיתגורס גם הניצב השלישי שווה.)</div>
      <p class="muted">טיפ: כדאי לזכור "שלשות פיתגורס": 3, 4, 5 · 6, 8, 10 · 5, 12, 13 · 8, 15, 17.</p>`,

    example: {
      question: 'סולם באורך 13 מטר נשען על קיר. הרגל של הסולם נמצאת 5 מטר מהקיר. לאיזה גובה על הקיר מגיע הסולם?',
      steps: [
        'מציירים: הקיר והרצפה יוצרים <b>זווית ישרה</b>. הסולם, הקיר והרצפה יוצרים משולש ישר זווית.',
        'מי היתר? הסולם — הוא מול הזווית הישרה. אז $c = 13$. הרצפה היא ניצב: $a = 5$. מחפשים את הניצב השני $b$ (הגובה).',
        'כותבים את משפט פיתגורס: $a^2 + b^2 = c^2$ ← $5^2 + b^2 = 13^2$.',
        'מחשבים ריבועים: $25 + b^2 = 169$.',
        'מחסירים 25 משני האגפים: $b^2 = 144$.',
        'מוציאים שורש: $b = \\sqrt{144} = 12$ (אורך תמיד חיובי).',
        'בדיקה: $5^2 + 12^2 = 25 + 144 = 169 = 13^2$ ✔ הסולם מגיע לגובה 12 מטר.',
      ],
    },

    tools: [
      {
        title: 'ריבועים על הצלעות',
        desc: 'שנו את אורכי הניצבים. על כל צלע בנוי ריבוע. בדקו: השטח של הריבוע הירוק (על היתר) תמיד שווה לכחול ועוד הכתום.',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const st = { a: 3, b: 4 };
          const brd = U.board(el, [-7.5, 13, 12.5, -7]);
          const a = () => st.a, b = () => st.b;
          const P = (fx, fy) => brd.create('point', [fx, fy], { visible: false });
          const C = P(0, 0), B = P(a, 0), A = P(0, b);
          const sqr = (pts, col) => brd.create('polygon', pts, { fillColor: col, fillOpacity: 0.3, borders: { strokeColor: col, strokeWidth: 2 }, vertices: { visible: false } });
          sqr([C, B, P(a, () => -st.a), P(0, () => -st.a)], '#2f6fdb');
          sqr([C, A, P(() => -st.b, b), P(() => -st.b, 0)], '#e8702a');
          sqr([A, B, P(() => st.a + st.b, a), P(b, () => st.b + st.a)], '#1f9d55');
          brd.create('polygon', [A, B, C], { fillColor: '#888', fillOpacity: 0.5, borders: { strokeColor: '#333', strokeWidth: 3 }, vertices: { visible: false } });
          brd.create('text', [() => st.a / 2, () => -st.a / 2, () => U.num(st.a * st.a)], { fontSize: 18, anchorX: 'middle', anchorY: 'middle', color: '#2f6fdb' });
          brd.create('text', [() => -st.b / 2, () => st.b / 2, () => U.num(st.b * st.b)], { fontSize: 18, anchorX: 'middle', anchorY: 'middle', color: '#c45a1c' });
          brd.create('text', [() => (st.a + st.b) / 2, () => (st.a + st.b) / 2, () => U.num(st.a * st.a + st.b * st.b)], { fontSize: 18, anchorX: 'middle', anchorY: 'middle', color: '#1f9d55' });
          const upd = () => {
            const c2 = st.a * st.a + st.b * st.b, c = Math.sqrt(c2);
            out.innerHTML = `$${U.num(st.a)}^2 + ${U.num(st.b)}^2 = ${U.num(st.a * st.a)} + ${U.num(st.b * st.b)} = ${U.num(c2)}$
              &nbsp;←&nbsp; היתר: $c = \\sqrt{${U.num(c2)}} ${Number.isInteger(c) ? '=' : '\\approx'} ${U.num(c)}$`;
            U.math(out); brd.update();
          };
          U.slider(el, { label: 'ניצב a (כחול)', min: 1, max: 6, step: 0.5, value: 3, onInput: v => { st.a = v; upd(); } });
          U.slider(el, { label: 'ניצב b (כתום)', min: 1, max: 6, step: 0.5, value: 4, onInput: v => { st.b = v; upd(); } });
        },
      },
      {
        title: 'ההוכחה בהזזה',
        desc: 'בריבוע הגדול יש 4 משולשים זהים. לחצו על הכפתור והמשולשים יזוזו. מה שנשאר ריק לפני: c². מה שנשאר ריק אחרי: a² + b². אותו שטח ריק — אז a² + b² = c².',
        mount(el) {
          const st = { a: 3, b: 5, t: 0 };
          const pic = document.createElement('div'), out = document.createElement('div'), row = document.createElement('div');
          out.className = 'readout'; row.className = 'row'; row.style.justifyContent = 'center';
          const btn = document.createElement('button'); btn.className = 'btn'; btn.textContent = 'הזיזו את המשולשים ←';
          row.appendChild(btn); el.append(pic, row, out);
          const draw = () => {
            const { a, b, t } = st, s = a + b, u = 320 / s, X = x => 20 + x * u, Y = y => 340 - y * u;
            const tri = (pts, d) => pts.map(([x, y]) => [X(x + d[0] * t), Y(y + d[1] * t)]);
            const T = [  // משולש + וקטור ההזזה שלו
              [[[0, 0], [a, 0], [0, b]], [0, a]],
              [[[s, 0], [s, a], [a, 0]], [0, 0]],
              [[[s, s], [b, s], [s, a]], [-b, 0]],
              [[[0, s], [0, b], [b, s]], [a, -b]],
            ];
            let g = poly([[X(0), Y(0)], [X(s), Y(0)], [X(s), Y(s)], [X(0), Y(s)]], '#888', 0.05, 2);
            if (t === 0) g += poly([[X(a), Y(0)], [X(s), Y(a)], [X(b), Y(s)], [X(0), Y(b)]], '#1f9d55', 0.35) + txt(X(s / 2), Y(s / 2), 'c²', '#1f9d55', 26);
            if (t === 1) g += poly([[X(0), Y(0)], [X(a), Y(0)], [X(a), Y(a)], [X(0), Y(a)]], '#2f6fdb', 0.35) + txt(X(a / 2), Y(a / 2), 'a²', '#2f6fdb', 22) +
              poly([[X(a), Y(a)], [X(s), Y(a)], [X(s), Y(s)], [X(a), Y(s)]], '#e8702a', 0.35) + txt(X(a + b / 2), Y(a + b / 2), 'b²', '#e8702a', 26);
            for (const [pts, d] of T) g += poly(tri(pts, d), '#888', 0.55, 2);
            pic.innerHTML = svg(360, 360, g);
            out.innerHTML = t === 0 ? 'השטח הריק (ירוק) הוא ריבוע על היתר: $c^2$' : t === 1 ? 'עכשיו השטח הריק הוא שני ריבועים: $a^2 + b^2$. אותם 4 משולשים, אותו ריבוע גדול ← $a^2 + b^2 = c^2$' : '...';
            U.math(out);
          };
          btn.onclick = () => {
            const from = st.t, to = from < 0.5 ? 1 : 0, t0 = performance.now();
            btn.disabled = true;
            const step = now => {
              const p = Math.min(1, (now - t0) / 1500);
              st.t = p < 1 ? from + (to - from) * (0.5 - Math.cos(Math.PI * p) / 2) : to;
              draw();
              if (p < 1) requestAnimationFrame(step); else { btn.disabled = false; btn.textContent = to ? 'החזירו ↻' : 'הזיזו את המשולשים ←'; }
            };
            requestAnimationFrame(step);
          };
          U.slider(el, { label: 'ניצב a', min: 1, max: 6, step: 0.5, value: st.a, onInput: v => { st.a = v; draw(); } });
          U.slider(el, { label: 'ניצב b', min: 1, max: 6, step: 0.5, value: st.b, onInput: v => { st.b = v; draw(); } });
        },
      },
      {
        title: 'מרחק בין שתי נקודות',
        desc: 'גררו את הנקודות. המשולש הכתום מראה את ההפרש ב־x ואת ההפרש ב־y — אלה הניצבים. המרחק בין הנקודות הוא היתר.',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = U.board(el, [-7, 7, 7, -7]);
          const P = brd.create('point', [-3, -2], { name: 'P', color: '#2f6fdb', size: 5, snapToGrid: true });
          const Q = brd.create('point', [3, 6], { name: 'Q', color: '#2f6fdb', size: 5, snapToGrid: true });
          const K = brd.create('point', [() => Q.X(), () => P.Y()], { visible: false });
          brd.create('segment', [P, Q], { strokeColor: '#1f9d55', strokeWidth: 4 });
          brd.create('segment', [P, K], { strokeColor: '#e8702a', strokeWidth: 3, dash: 2 });
          brd.create('segment', [K, Q], { strokeColor: '#e8702a', strokeWidth: 3, dash: 2 });
          const upd = () => {
            const dx = Q.X() - P.X(), dy = Q.Y() - P.Y(), d2 = dx * dx + dy * dy, d = Math.sqrt(d2), n = U.num;
            out.innerHTML = `$P(${n(P.X())}, ${n(P.Y())})$, $Q(${n(Q.X())}, ${n(Q.Y())})$<br>
              הפרש ב־x: $${n(Math.abs(dx))}$ · הפרש ב־y: $${n(Math.abs(dy))}$<br>
              $d = \\sqrt{${n(Math.abs(dx))}^2 + ${n(Math.abs(dy))}^2} = \\sqrt{${n(d2)}} ${Number.isInteger(d) ? '=' : '\\approx'} ${n(d)}$`;
            U.math(out);
          };
          brd.on('update', upd); upd();
        },
      },
    ],

    exercises: [
      // ---------- רמה 1 ----------
      { level: 1, gen() {
        const [a, b, c] = U.pick(SMALL.slice(0, 4));
        return {
          q: `במשולש ישר זווית אורכי הניצבים הם ${a} ו־${b}. מה אורך היתר?`,
          type: 'number', answer: c,
          mount: el => rightTri(el, a, b, a, b, '?'),
          mistakes: [{ v: a + b, why: 'חיברת את האורכים עצמם. בפיתגורס מחברים את ה<b>ריבועים</b>.' }, { v: c * c, why: 'מצאת את $c^2$. שכחת להוציא שורש בסוף.' }],
          hint: `$c^2 = a^2 + b^2$. חשבו $${a}^2 + ${b}^2$ ואז הוציאו שורש.`,
          steps: [`$c^2 = ${a}^2 + ${b}^2$`, `$c^2 = ${a * a} + ${b * b} = ${c * c}$`, `$c = \\sqrt{${c * c}} = ${c}$`],
        };
      } },
      { level: 1, gen() {
        const r = U.R(0, 2), V = ['A', 'B', 'C'], o = V.filter((_, i) => i !== r), sides = ['AB', 'BC', 'CA'];
        const hyp = o.join(''), ans = sides.findIndex(s => s === hyp || s === o[1] + o[0]);
        return {
          q: `במשולש $ABC$ הזווית $\\angle ${V[r]} = 90^\\circ$. איזו צלע היא היתר?`,
          type: 'choice', choices: sides, answer: ans,
          mount: el => rightTri(el, 4, 3, '', '', '', [V[r], o[0], o[1]]),
          mistakes: sides.map((s, i) => ({ v: i, why: `הצלע $${s}$ נוגעת בקודקוד $${V[r]}$, שבו הזווית הישרה, ולכן היא ניצב.` })).filter(m => m.v !== ans),
          hint: 'היתר נמצא <b>מול</b> הזווית הישרה — הצלע שלא נוגעת בקודקוד של הזווית הישרה.',
          steps: [`הזווית הישרה בקודקוד $${V[r]}$.`, `הצלע שלא עוברת דרך $${V[r]}$ היא $${sides[ans]}$ — היא היתר (והיא הארוכה ביותר).`],
        };
      } },
      { level: 1, gen() {
        const [a, b, c] = U.pick(SMALL), mode = U.R(0, 1);
        return {
          q: mode ? `על הצלעות של משולש ישר זווית בנו ריבועים. שטח הריבוע על היתר הוא ${c * c}, ושטח הריבוע על אחד הניצבים הוא ${a * a}. מה שטח הריבוע על הניצב השני?`
            : `על הצלעות של משולש ישר זווית בנו ריבועים. שטחי הריבועים על הניצבים הם ${a * a} ו־${b * b}. מה שטח הריבוע על היתר?`,
          type: 'number', answer: mode ? b * b : c * c,
          mistakes: mode ? [{ v: c * c + a * a, why: 'חיברת את שני השטחים. אבל הריבוע על היתר הוא הגדול ביותר: הוא כבר הסכום של שני האחרים.' }, { v: b, why: 'הוצאת שורש וקיבלת אורך של צלע. שאלו על <b>שטח</b> הריבוע.' }]
            : [{ v: c, why: 'הוצאת שורש וקיבלת אורך של צלע. שאלו על <b>שטח</b> הריבוע.' }, { v: a ** 4 + b ** 4, why: 'העלית את השטחים שוב בריבוע. שטח של ריבוע הוא כבר צלע בריבוע.' }],
          hint: 'לפי פיתגורס: ריבוע על ניצב + ריבוע על ניצב = הריבוע על היתר.',
          steps: mode ? [`ריבוע ניצב + ריבוע ניצב = ריבוע יתר`, `$${a * a} + ? = ${c * c}$`, `$? = ${c * c} - ${a * a} = ${b * b}$`]
            : [`ריבוע ניצב + ריבוע ניצב = ריבוע יתר`, `$${a * a} + ${b * b} = ${c * c}$`],
        };
      } },
      { level: 1, gen() {
        const a = U.R(1, 9), b = U.R(1, 9);
        return {
          q: `במשולש ישר זווית הניצבים הם ${a} ו־${b}. כמה זה $c^2$ (היתר בריבוע)?`,
          type: 'number', answer: a * a + b * b,
          mistakes: [{ v: (a + b) ** 2, why: 'חיברת את הניצבים ורק אז העלית בריבוע. צריך להעלות כל ניצב בריבוע <b>לבד</b>.' },
            { v: 2 * a + 2 * b, why: `כפלת ב־2 במקום להעלות בריבוע. $${a}^2$ פירושו $${a} \\cdot ${a}$.` },
            { v: a + b, why: 'חיברת את הניצבים עצמם. קודם מעלים כל אחד בריבוע.' }],
          hint: 'מעלים כל ניצב בריבוע (כופלים אותו בעצמו) ומחברים.',
          steps: [`$c^2 = ${a}^2 + ${b}^2$`, `$${a}^2 = ${a * a}$, $${b}^2 = ${b * b}$`, `$c^2 = ${a * a} + ${b * b} = ${a * a + b * b}$`],
        };
      } },
      // ---------- רמה 2 ----------
      { level: 2, gen() {
        const [a, b, c] = U.pick(ALL), swap = Math.random() < 0.5, k = swap ? b : a, ans = swap ? a : b;
        return {
          q: `במשולש ישר זווית היתר הוא ${c} ואחד הניצבים הוא ${k}. מה אורך הניצב השני?`,
          type: 'number', answer: ans,
          mount: el => rightTri(el, k, ans, k, '?', c),
          mistakes: [{ v: c - k, why: 'חיסרת את האורכים עצמם. בפיתגורס מחסירים את ה<b>ריבועים</b>.' }, { v: ans * ans, why: 'מצאת את $b^2$. שכחת להוציא שורש בסוף.' }],
          hint: `מחפשים ניצב, אז <b>מחסירים</b>: $b^2 = c^2 - a^2$.`,
          steps: [`$${k}^2 + b^2 = ${c}^2$`, `$${k * k} + b^2 = ${c * c}$`, `$b^2 = ${c * c} - ${k * k} = ${ans * ans}$`, `$b = \\sqrt{${ans * ans}} = ${ans}$`],
        };
      } },
      { level: 2, gen() {
        let [a, b, c] = U.pick(SMALL.slice(0, 2).concat([[5, 12, 13]]));
        if (Math.random() < 0.5) [a, b] = [b, a];
        const sx = U.pick([-1, 1]), sy = U.pick([-1, 1]);
        const x1 = U.R(-4, 4), y1 = U.R(-4, 4), x2 = x1 + sx * a, y2 = y1 + sy * b;
        return {
          q: `מה המרחק בין הנקודות $A(${x1}, ${y1})$ ו־$B(${x2}, ${y2})$?`,
          type: 'number', answer: c,
          mount(el) {
            const xs = [x1, x2], ys = [y1, y2], pad = 1.5;
            const brd = U.board(el, [Math.min(...xs) - pad, Math.max(...ys) + pad, Math.max(...xs) + pad, Math.min(...ys) - pad]);
            brd.create('point', [x1, y1], { name: 'A', color: '#2f6fdb', size: 3, fixed: true });
            brd.create('point', [x2, y2], { name: 'B', color: '#2f6fdb', size: 3, fixed: true });
          },
          mistakes: [{ v: a + b, why: 'חיברת את שני ההפרשים. המרחק בקו ישר קצר יותר: מחברים ריבועים ומוציאים שורש.' }, { v: c * c, why: 'מצאת את $d^2$. שכחת להוציא שורש בסוף.' }],
          hint: 'ציירו משולש ישר זווית: ניצב אחד = ההפרש בין ה־x־ים, ניצב שני = ההפרש בין ה־y־ים.',
          steps: [`הפרש ב־x: $${x2} - ${x1 < 0 ? `(${x1})` : x1} = ${x2 - x1}$ ← ניצב באורך ${a}.`, `הפרש ב־y: $${y2} - ${y1 < 0 ? `(${y1})` : y1} = ${y2 - y1}$ ← ניצב באורך ${b}.`,
            `$d^2 = ${a}^2 + ${b}^2 = ${a * a} + ${b * b} = ${c * c}$`, `$d = \\sqrt{${c * c}} = ${c}$`],
        };
      } },
      { level: 2, gen() {
        const [a, b, c] = U.pick(SMALL), m = U.R(0, 2);
        const Q = [
          [`סולם באורך ${c} מטר נשען על קיר. הרגל של הסולם נמצאת ${a} מטר מהקיר. לאיזה גובה (במטרים) מגיע הסולם?`, b, 'הסולם הוא היתר (מול הזווית הישרה בין הקיר לרצפה).', 'leg'],
          [`מסך טלוויזיה מלבני: רוחב ${b * 10} ס"מ וגובה ${a * 10} ס"מ. מה אורך האלכסון שלו (בס"מ)?`, c * 10, 'האלכסון מחלק את המלבן לשני משולשים ישרי זווית. האלכסון הוא היתר.', 'hyp10'],
          [`שחקן רץ ${b} מטר לאורך קו הצד, ואז ${a} מטר ישר לכיוון מרכז המגרש (בזווית ישרה). מה המרחק (במטרים) בקו ישר מנקודת ההתחלה?`, c, 'שתי הריצות הן הניצבים, והקו הישר מההתחלה לסוף הוא היתר.', 'hyp'],
        ][m];
        const steps = Q[3] === 'leg' ? [`יתר $c = ${c}$, ניצב $a = ${a}$.`, `$b^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b}$`, `$b = \\sqrt{${b * b}} = ${b}$ מטר.`]
          : Q[3] === 'hyp10' ? [`ניצבים: ${b * 10} ו־${a * 10}.`, `$c^2 = ${b * 10}^2 + ${a * 10}^2 = ${b * b * 100} + ${a * a * 100} = ${c * c * 100}$`, `$c = \\sqrt{${c * c * 100}} = ${c * 10}$ ס"מ.`]
          : [`ניצבים: ${b} ו־${a}.`, `$c^2 = ${b}^2 + ${a}^2 = ${b * b} + ${a * a} = ${c * c}$`, `$c = \\sqrt{${c * c}} = ${c}$ מטר.`];
        const mistakes = [{ v: Q[3] === 'leg' ? c - a : Q[3] === 'hyp10' ? 10 * (a + b) : a + b, why: Q[3] === 'leg' ? 'חיסרת את האורכים עצמם. בפיתגורס מחסירים את ה<b>ריבועים</b>.' : 'חיברת את האורכים עצמם. בפיתגורס מחברים את ה<b>ריבועים</b>.' },
          { v: Q[1] * Q[1], why: 'שכחת להוציא שורש בסוף.' }];
        return { q: Q[0], type: 'number', answer: Q[1], hint: Q[2], steps, mistakes };
      } },
      { level: 2, gen() {
        const R = ['צ.ז.צ', 'ז.צ.ז', 'צ.צ.צ', 'צ.צ.ז (יתר וניצב)'];
        const m = U.R(0, 2), [a, b, c] = U.pick(SMALL), ang = 10 * U.R(3, 6);
        const q = [
          `לשני משולשים ישרי זווית יש <b>יתר</b> שווה ($${c}$ ס"מ) ו<b>ניצב</b> שווה ($${a}$ ס"מ). לפי איזה משפט הם חופפים?`,
          `לשני משולשים ישרי זווית <b>שני הניצבים</b> שווים ($${a}$ ס"מ ו־$${b}$ ס"מ). לפי איזה משפט הם חופפים?`,
          `לשני משולשים ישרי זווית יש ניצב שווה ($${a}$ ס"מ) ושווה גם הזווית החדה הצמודה לו ($${ang}^\\circ$). לפי איזה משפט הם חופפים?`,
        ][m];
        const ans = [3, 0, 1][m];
        return {
          q, type: 'choice', choices: R, answer: ans,
          mistakes: [{ v: 2, why: 'צ.צ.צ דורש שלוש צלעות שוות. כמה צלעות ידועות כאן?' }, ...[
            [{ v: 0, why: 'בצ.ז.צ הזווית נמצאת <b>בין</b> שתי הצלעות. האם הזווית הישרה נמצאת בין היתר לניצב?' }],
            [{ v: 3, why: 'צ.צ.ז מתאים כשידוע היתר. כאן ידועים שני הניצבים.' }],
            [0, 3].map(v => ({ v, why: 'כאן ידועה רק צלע אחת שווה. למשפט שבחרת צריך שתי צלעות.' })),
          ][m]],
          hint: 'מה ידוע: צלעות (צ) וזוויות (ז), ובאיזה סדר? אל תשכחו שהזווית הישרה (90°) תמיד שווה בשני המשולשים.',
          steps: [
            m === 0 ? 'ידועים יתר וניצב — זה בדיוק משפט החפיפה המיוחד למשולשים ישרי זווית: <b>צ.צ.ז</b>. (הזווית הישרה מול היתר, הצלע הגדולה.)'
              : m === 1 ? 'שני הניצבים שווים, והזווית ביניהם היא הזווית הישרה — שווה בשניהם. צלע, זווית, צלע ← <b>צ.ז.צ</b>.'
                : 'הניצב שווה, והזוויות שצמודות לו: הזווית הישרה והזווית החדה. זווית, צלע, זווית ← <b>ז.צ.ז</b>.',
            `התשובה: <b>${R[ans]}</b>.`],
        };
      } },
      // ---------- רמה 3 ----------
      { level: 3, gen() {
        const k = U.R(1, 2), [a, b, h, d] = U.pick(BOX).map(v => v * k);
        return {
          q: `לתיבה יש אורך ${a}, רוחב ${b} וגובה ${h} (ס"מ). מה אורך האלכסון של התיבה (מפינה תחתונה לפינה העליונה הרחוקה)?`,
          type: 'number', answer: d,
          mount(el) {
            const s = 160 / Math.max(a, b * 0.6 + h, h + 2), W = a * s, D = b * s * 0.5, H = h * s, x0 = 30, y0 = 30 + D + H;
            const p = (x, y, z) => [x0 + x * W + y * D, y0 - z * H - y * D];
            const L = (u, v, col = 'currentColor', dash = '') => `<line x1="${u[0]}" y1="${u[1]}" x2="${v[0]}" y2="${v[1]}" stroke="${col}" stroke-width="2" ${dash}/>`;
            const c = [[0, 0, 0], [1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]].map(q => p(...q));
            let g = [[0, 1], [1, 2], [4, 5], [5, 6], [6, 7], [7, 4], [0, 4], [1, 5], [2, 6]].map(([i, j]) => L(c[i], c[j])).join('');
            g += [[2, 3], [3, 0], [3, 7]].map(([i, j]) => L(c[i], c[j], 'currentColor', 'stroke-dasharray="4 4" opacity=".5"')).join('');
            g += L(c[0], c[2], '#e8702a', 'stroke-dasharray="6 4"') + L(c[0], c[6], '#1f9d55');
            g += txt((c[0][0] + c[1][0]) / 2, c[0][1] + 14, a, '#2f6fdb') + txt((c[1][0] + c[2][0]) / 2 + 14, (c[1][1] + c[2][1]) / 2 + 6, b, '#2f6fdb') + txt(c[1][0] + 14 + (c[2][0] - c[1][0]), (c[2][1] + c[6][1]) / 2, h, '#2f6fdb');
            el.innerHTML = svg(W + D + 70, H + D + 60, g);
          },
          mistakes: [{ v: a + b + h, why: 'חיברת את האורכים עצמם. בפיתגורס מחברים את ה<b>ריבועים</b>.' }, { v: d * d, why: 'מצאת את $d^2$. שכחת להוציא שורש בסוף.' },
            { v: Math.sqrt(a * a + b * b), why: 'זה אלכסון הרצפה (הקו הכתום). צריך עוד צעד אחד, עם הגובה.' }],
          hint: 'פיתגורס פעמיים: קודם האלכסון של הרצפה (הקו הכתום), ואז משולש ישר זווית עם הגובה (הקו הירוק). או ישר: $d^2 = a^2 + b^2 + h^2$.',
          steps: [`אלכסון הרצפה: $e^2 = ${a}^2 + ${b}^2 = ${a * a + b * b}$.`, `האלכסון של התיבה: $d^2 = e^2 + ${h}^2 = ${a * a + b * b} + ${h * h} = ${d * d}$.`, `$d = \\sqrt{${d * d}} = ${d}$ ס"מ.`],
        };
      } },
      { level: 3, gen() {
        const [a, b, c] = U.pick(SMALL), iso = Math.random() < 0.5;
        return iso ? {
          q: `במשולש שווה שוקיים כל שוק באורך ${c} ס"מ והבסיס באורך ${2 * a} ס"מ. מה השטח של המשולש (בסמ"ר)?`,
          type: 'number', answer: a * b,
          mistakes: [{ v: a * c, why: `השתמשת בשוק (${c}) בתור גובה. אבל השוק נטויה: הגובה מאונך לבסיס, ומוצאים אותו בפיתגורס.` }, { v: b, why: 'מצאת את הגובה. עכשיו צריך לחשב את השטח.' }],
          hint: 'הגובה לבסיס חוצה אותו ויוצר שני משולשים ישרי זווית: יתר = השוק, ניצב = חצי בסיס. מצאו את הגובה בפיתגורס.',
          steps: [`הגובה חוצה את הבסיס: חצי בסיס = ${a}.`, `$h^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b}$ ← $h = ${b}$.`, `שטח = (בסיס כפול גובה) חלקי 2: $\\frac{${2 * a} \\cdot ${b}}{2} = ${a * b}$ סמ"ר.`],
        } : {
          q: `במשולש ישר זווית היתר באורך ${c} ס"מ ואחד הניצבים באורך ${a} ס"מ. מה השטח של המשולש (בסמ"ר)?`,
          type: 'number', answer: a * b / 2,
          mount: el => rightTri(el, a, b, a, '?', c),
          mistakes: [{ v: a * c / 2, why: `כפלת ניצב ביתר (${c}). בשטח של משולש ישר זווית כופלים את שני ה<b>ניצבים</b>.` }, { v: b, why: 'מצאת את הניצב החסר. עכשיו צריך לחשב את השטח.' }],
          hint: 'במשולש ישר זווית, השטח = ניצב כפול ניצב חלקי 2. קודם מצאו את הניצב החסר בפיתגורס.',
          steps: [`$b^2 = ${c}^2 - ${a}^2 = ${c * c} - ${a * a} = ${b * b}$ ← $b = ${b}$.`, `שטח $= \\frac{${a} \\cdot ${b}}{2} = ${U.num(a * b / 2)}$ סמ"ר.`],
        };
      } },
      { level: 3, gen() {
        const court = Math.random() < 0.35;
        const w = court ? 28 : U.R(3, 12), h = court ? 15 : U.R(2, 9);
        const d2 = w * w + h * h, d = Math.round(Math.sqrt(d2) * 10) / 10;
        return {
          q: court ? 'מגרש כדורסל הוא מלבן באורך 28 מטר וברוחב 15 מטר. מה אורך האלכסון של המגרש? (עגלו לעשירית, אפשר להשתמש במחשבון)'
            : `מלבן באורך ${w} ורוחב ${h}. מה אורך האלכסון? (עגלו לעשירית, אפשר להשתמש במחשבון)`,
          type: 'number', answer: d, tol: 0.051,
          mistakes: [{ v: w + h, why: 'חיברת את האורך והרוחב. האלכסון קצר יותר: מחברים ריבועים ומוציאים שורש.' }, { v: d2, why: 'מצאת את $d^2$. שכחת להוציא שורש בסוף.' }],
          hint: 'האלכסון הוא יתר במשולש ישר זווית שהניצבים שלו הם האורך והרוחב. בסוף לוחצים על √ במחשבון.',
          steps: [`$d^2 = ${w}^2 + ${h}^2 = ${w * w} + ${h * h} = ${d2}$`, `$d = \\sqrt{${d2}} ${Number.isInteger(Math.sqrt(d2)) ? '=' : '\\approx'} ${U.num(d)}$`],
        };
      } },
    ],

    summary: [
      'במשולש ישר זווית: שני <b>ניצבים</b> (יוצרים את הזווית הישרה) ו<b>יתר</b> (מול הזווית הישרה, הצלע הארוכה ביותר).',
      'משפט פיתגורס: $a^2 + b^2 = c^2$ — הריבוע על היתר שווה לסכום הריבועים על הניצבים.',
      'מוצאים יתר: מחברים ריבועים ומוציאים שורש. מוצאים ניצב: <b>מחסירים</b> ריבועים ומוציאים שורש.',
      'מרחק בין נקודות: $d = \\sqrt{(\\Delta x)^2 + (\\Delta y)^2}$. אלכסון תיבה: $d^2 = a^2 + b^2 + h^2$.',
      'צ.צ.ז במשולשים ישרי זווית: יתר שווה + ניצב שווה ← המשולשים חופפים.',
    ],
  });
})();
