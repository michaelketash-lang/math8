/* יחידה: חיתוך עם הצירים ומציאת משוואת ישר (פרקים 7–8 בספר) */
(() => {
  const par = n => (n < 0 ? `(${n})` : `${n}`);            // מספר שלילי בסוגריים: -3 → (-3)
  const pt = (x, y) => `(${U.num(x).replace('−', '-')}, ${U.num(y).replace('−', '-')})`;
  /** משוואת ישר בכתיב TeX כשהשיפוע dy/dx והחיתוך bn/bd (שברים מצומצמים) */
  const eqTeX = (dy, dx, bn, bd) => {
    const m = U.frac(dy, dx), b = U.frac(bn, bd);
    let s = dy === 0 ? '' : m === '1' ? 'x' : m === '-1' ? '-x' : m + 'x';
    if (bn === 0) return 'y = ' + (s || '0');
    if (!s) return 'y = ' + b;
    return `y = ${s} ${b[0] === '-' ? '-' : '+'} ${b.replace(/^-/, '')}`;
  };

  registerChapter('line-eq', {
    intro: `
      <p>עד עכשיו קיבלנו משוואה של ישר וציירנו אותו. ביחידה הזו נלמד שני דברים חדשים: איפה הישר <b>חותך את הצירים</b>, ואיך <b>מוצאים את המשוואה</b> כשנותנים לנו רק נקודות.</p>
      <div class="idea"><b>חיתוך עם ציר ה־y ← מציבים $x = 0$</b>כל נקודה על ציר ה־y נראית כך: $(0, ?)$.
        <br>בישר $y = 2x - 6$: $y = 2 \\cdot 0 - 6 = -6$ ← הנקודה $(0, -6)$.</div>
      <div class="idea"><b>חיתוך עם ציר ה־x ← מציבים $y = 0$</b>כל נקודה על ציר ה־x נראית כך: $(?, 0)$.
        <br>בישר $y = 2x - 6$: $0 = 2x - 6$ ← $2x = 6$ ← $x = 3$ ← הנקודה $(3, 0)$.</div>
      <div class="formula">$m = \\dfrac{y_2 - y_1}{x_2 - x_1}$</div>
      <div class="idea"><b>שיפוע משתי נקודות</b>השינוי ב־y חלקי השינוי ב־x.
        <br>מ־$(1, 4)$ ל־$(3, 10)$: $m = \\frac{10 - 4}{3 - 1} = \\frac{6}{2} = 3$.</div>
      <div class="idea"><b>מציאת משוואת ישר</b>1. מוצאים את השיפוע $m$ (אם לא נתון — משתי נקודות).
        <br>2. כותבים $y = mx + b$, מציבים נקודה אחת, ופותרים משוואה שהנעלם בה הוא $b$.</div>
      <div class="note"><b>שטח המשולש עם הצירים</b><br>הישר, ציר ה־x וציר ה־y יוצרים משולש ישר־זווית.
        הניצבים שלו הם המרחקים של נקודות החיתוך מראשית הצירים $(0, 0)$.
        <br>שטח = ניצב כפול ניצב, חלקי 2. זהירות: אורך הוא תמיד <b>חיובי</b>, גם אם הנקודה היא $(-4, 0)$ — האורך הוא 4.</div>`,

    example: {
      question: 'ישר עובר דרך הנקודות $(1, 4)$ ו־$(2, 2)$.<br>א. מצאו את משוואת הישר. ב. מצאו את נקודות החיתוך שלו עם הצירים. ג. חשבו את שטח המשולש שהישר יוצר עם הצירים.',
      steps: [
        'קודם השיפוע: $m = \\frac{y_2 - y_1}{x_2 - x_1} = \\frac{2 - 4}{2 - 1} = \\frac{-2}{1} = -2$. (הישר יורד.)',
        'עכשיו יודעים: $y = -2x + b$. חסר רק $b$. מציבים את הנקודה $(1, 4)$: $4 = -2 \\cdot 1 + b$.',
        '$4 = -2 + b$ ← מוסיפים 2 לשני האגפים: $b = 6$. המשוואה: $y = -2x + 6$.',
        'בדיקה עם הנקודה השנייה $(2, 2)$: $-2 \\cdot 2 + 6 = 2$ ✔ — היא באמת על הישר.',
        'סעיף ב: חיתוך עם ציר ה־y — מציבים $x = 0$: $y = 6$. הנקודה $(0, 6)$.',
        'חיתוך עם ציר ה־x — מציבים $y = 0$: $0 = -2x + 6$ ← $2x = 6$ ← $x = 3$. הנקודה $(3, 0)$.',
        'סעיף ג: המשולש ישר־זווית. ניצב אחד על ציר ה־x (אורך 3), ניצב שני על ציר ה־y (אורך 6).',
        'שטח $= \\frac{3 \\cdot 6}{2} = 9$ יחידות שטח.',
      ],
    },

    tools: [
      {
        title: 'ישר דרך שתי נקודות',
        desc: 'גררו את הנקודות A ו־B. המשולש הכתום מראה כמה זזנו ימינה וכמה למעלה — וזה השיפוע. המשוואה מתעדכנת לבד.',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = U.board(el, [-8, 8, 8, -8]);
          const A = brd.create('point', [1, 2], { name: 'A', snapToGrid: true, color: '#e8702a', size: 6 });
          const B = brd.create('point', [4, 8], { name: 'B', snapToGrid: true, color: '#2f6fdb', size: 6 });
          brd.create('line', [A, B], { strokeColor: '#1d2433', strokeWidth: 3 });
          const C = brd.create('point', [() => B.X(), () => A.Y()], { visible: false });
          brd.create('segment', [A, C], { strokeColor: '#e8702a', strokeWidth: 3, dash: 2 });
          brd.create('segment', [C, B], { strokeColor: '#e8702a', strokeWidth: 3, dash: 2 });
          const upd = () => {
            const x1 = Math.round(A.X()), y1 = Math.round(A.Y()), x2 = Math.round(B.X()), y2 = Math.round(B.Y());
            const dx = x2 - x1, dy = y2 - y1;
            if (dx === 0) { out.innerHTML = 'A ו־B אחת מעל השנייה: הישר <b>אנכי</b> ואין לו שיפוע (נלמד עליו ביחידה הבאה).'; return; }
            const bn = y1 * dx - dy * x1; // b = y1 - m·x1 = (y1·dx - dy·x1)/dx
            out.innerHTML = `A$${pt(x1, y1)}$ &nbsp; B$${pt(x2, y2)}$<br>
              $m = \\frac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = \\frac{${dy}}{${dx}} = ${U.frac(dy, dx)}$ &nbsp;←&nbsp; $${eqTeX(dy, dx, bn, dx)}$`;
            U.math(out);
          };
          A.on('drag', upd); B.on('drag', upd); upd();
        },
      },
      {
        title: 'המשולש שהישר יוצר עם הצירים',
        desc: 'שנו את m ואת b. הנקודות הירוקות הן החיתוך עם הצירים, והמשולש הצבוע הוא המשולש עם הצירים. שימו לב איך מחשבים את השטח.',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const st = { m: -2, b: 6 };
          const brd = U.board(el, [-10, 10, 10, -10]);
          const xi = () => (st.m ? -st.b / st.m : 0);
          brd.create('functiongraph', [x => st.m * x + st.b], { strokeColor: '#2f6fdb', strokeWidth: 3 });
          const O = brd.create('point', [0, 0], { visible: false });
          const X = brd.create('point', [xi, 0], { name: '', color: '#1f9d55', size: 5, fixed: true, visible: () => st.m !== 0 });
          const Y = brd.create('point', [0, () => st.b], { name: '', color: '#1f9d55', size: 5, fixed: true });
          brd.create('polygon', [O, X, Y], { fillColor: '#e8702a', fillOpacity: 0.3, borders: { strokeWidth: 0 }, vertices: { visible: false }, hasInnerPoints: false });
          const upd = () => {
            brd.update();
            if (st.m === 0) { out.innerHTML = `$y = ${st.b}$ — ישר שטוח שלא פוגש את ציר ה־x, אז אין משולש.`; U.math(out); return; }
            const a = xi(), area = Math.abs(a * st.b) / 2;
            out.innerHTML = `$y = ${U.lin(st.m, st.b)}$<br>ציר ה־y: $${pt(0, st.b)}$ &nbsp;·&nbsp; ציר ה־x: $${pt(a, 0)}$<br>
              שטח $= \\frac{${U.num(Math.abs(a)).replace('−', '')} \\cdot ${Math.abs(st.b)}}{2} = ${U.num(area)}$`;
            U.math(out);
          };
          U.slider(el, { label: 'שיפוע m', min: -4, max: 4, step: 0.5, value: st.m, onInput: v => { st.m = v; upd(); } });
          U.slider(el, { label: 'חיתוך b', min: -8, max: 8, step: 1, value: st.b, onInput: v => { st.b = v; upd(); } });
        },
      },
      {
        title: 'משחק: זרוק לחיתוך',
        desc: 'הישר עוד מוסתר. איפה הוא יחתוך את ציר ה־x? גררו את הכדור למקום ולחצו "זרוק!".',
        mount(el) {
          const msg = document.createElement('div'); msg.className = 'readout'; el.appendChild(msg);
          let m, a, shown = false;
          const brd = U.board(el, [-8, 8, 8, -8]);
          brd.create('functiongraph', [x => m * (x - a)], { strokeColor: '#2f6fdb', strokeWidth: 3, visible: () => shown });
          const ball = brd.create('point', [0, 0], { name: '🏀', color: '#e8702a', size: 8, label: { fontSize: 18, offset: [-9, 22] } });
          ball.on('drag', () => ball.moveTo([Math.max(-7, Math.min(7, Math.round(ball.X()))), 0]));
          const row = document.createElement('div'); row.className = 'row'; row.style.justifyContent = 'center';
          row.innerHTML = '<button class="btn">זרוק!</button> <button class="btn ghost">ישר חדש</button>';
          el.appendChild(row);
          const fresh = () => {
            m = U.pick([-3, -2, -1, 1, 2, 3]); a = U.R(-6, 6); shown = false;
            msg.innerHTML = `הישר: $y = ${U.lin(m, -m * a)}$. איפה $y = 0$?`; U.math(msg); brd.update();
          };
          row.children[0].onclick = () => {
            shown = true; brd.update();
            const g = Math.round(ball.X());
            msg.innerHTML = g === a
              ? `🏀 סל! $0 = ${U.lin(m, -m * a)}$ ← $x = ${a}$. הנקודה $(${a}, 0)$.`
              : `החטאה — זרקת ל־$x = ${g}$. מציבים $y = 0$: $0 = ${U.lin(m, -m * a)}$ ← $x = ${a}$. נסה ישר חדש!`;
            U.math(msg);
          };
          row.children[1].onclick = fresh;
          fresh();
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        const m = U.RNZ(-5, 5), b = U.R(-9, 9);
        return {
          q: `באיזו נקודה הישר $y = ${U.lin(m, b)}$ חותך את ציר ה־y?`,
          type: 'pair', answer: [0, b],
          mistakes: [{ v: [-b / m, 0], why: 'זו נקודת החיתוך עם ציר ה־x (שם $y = 0$). שאלו על ציר ה־y.' }, { v: [0, m], why: `$${m}$ הוא המספר שכופל את $x$. מה קורה לו כשמציבים $x = 0$?` }],
          hint: 'על ציר ה־y תמיד $x = 0$. מציבים $x = 0$ במשוואה.',
          steps: ['על ציר ה־y: $x = 0$.', `$y = ${m} \\cdot 0 ${U.sgn(b)} = ${b}$`, `הנקודה: $(0, ${b})$.`],
        };
      } },
      { level: 1, gen() {
        const m = U.RNZ(-4, 4), a = U.RNZ(-6, 6), b = -m * a;
        return {
          q: `באיזו נקודה הישר $y = ${U.lin(m, b)}$ חותך את ציר ה־x?`,
          type: 'pair', answer: [a, 0],
          mistakes: [{ v: [0, b], why: 'זו נקודת החיתוך עם ציר ה־y (שם $x = 0$). שאלו על ציר ה־x.' }, { v: [-a, 0], why: `בדוק את הסימנים בפתרון המשוואה $0 = ${U.lin(m, b)}$.` }],
          hint: 'על ציר ה־x תמיד $y = 0$. מציבים $y = 0$ ופותרים משוואה.',
          steps: [`על ציר ה־x: $y = 0$, ולכן $0 = ${U.lin(m, b)}$.`,
            `${b > 0 ? 'מחסירים' : 'מוסיפים'} $${Math.abs(b)}$ משני האגפים: $${-b} = ${U.term(m)}$`,
            m === 1 ? `כלומר $x = ${a}$.` : `מחלקים ב־$${par(m)}$: $x = ${-b} \\div ${par(m)} = ${a}$`, `הנקודה: $(${a}, 0)$.`],
        };
      } },
      { level: 1, gen() {
        const m = U.RNZ(-4, 4), x1 = U.R(-5, 3), dx = U.R(1, 4), y1 = U.R(-6, 6), x2 = x1 + dx, y2 = y1 + m * dx;
        return {
          q: `מה השיפוע של הישר שעובר דרך הנקודות $(${x1}, ${y1})$ ו־$(${x2}, ${y2})$?`,
          type: 'number', answer: m,
          mistakes: [{ v: y1 < 0 ? (y2 + y1) / dx : m, why: `בדוק את $${y2} - ${par(y1)}$: חיסור של מספר שלילי הופך לחיבור.` },
            { v: x1 < 0 && x2 + x1 ? (y2 - y1) / (x2 + x1) : m, why: `בדוק את $${x2} - ${par(x1)}$: חיסור של מספר שלילי הופך לחיבור.` },
            { v: y2 - y1, why: 'זה רק השינוי ב־$y$. צריך עוד לחלק בשינוי ב־$x$.' }, { v: -m, why: 'הסימן הפוך. אולי חיסרת את ה־$y$־ים בסדר אחד ואת ה־$x$־ים בסדר ההפוך?' }],
          hint: 'שיפוע = השינוי ב־y חלקי השינוי ב־x: $m = \\frac{y_2 - y_1}{x_2 - x_1}$.',
          steps: [`השינוי ב־y: $${y2} - ${par(y1)} = ${y2 - y1}$`, `השינוי ב־x: $${x2} - ${par(x1)} = ${dx}$`, `$m = \\frac{${y2 - y1}}{${dx}} = ${m}$`],
        };
      } },
      { level: 1, gen() {
        let a, b; do { a = U.R(1, 8); b = U.R(1, 8); } while ((a * b) % 2);
        const sa = U.pick([a, -a]), sb = U.pick([b, -b]);
        return {
          q: `ישר חותך את ציר ה־x בנקודה $(${sa}, 0)$ ואת ציר ה־y בנקודה $(0, ${sb})$. מה שטח המשולש שהישר יוצר עם הצירים?`,
          type: 'number', answer: a * b / 2,
          mount(el) {
            const brd = U.board(el, [-9, 9, 9, -9]);
            const P = [[0, 0], [sa, 0], [0, sb]].map(c => brd.create('point', c, { name: '', size: 3, color: '#e8702a', fixed: true }));
            brd.create('polygon', P, { fillColor: '#e8702a', fillOpacity: 0.25, borders: { strokeColor: '#e8702a' }, vertices: { visible: false } });
            brd.create('line', [P[1], P[2]], { strokeColor: '#2f6fdb', strokeWidth: 2 });
          },
          mistakes: [{ v: sa * sb / 2, why: 'שטח לא יכול להיות שלילי. אורך של ניצב הוא מרחק, בלי מינוס.' }],
          hint: 'המשולש ישר־זווית. כל ניצב הוא המרחק של נקודת חיתוך מ־$(0, 0)$ — בלי מינוס, כי אורך תמיד חיובי. שטח = ניצב כפול ניצב, חלקי 2.',
          steps: [`ניצב על ציר ה־x: מ־0 עד $${sa}$ ← אורך ${a}.`, `ניצב על ציר ה־y: מ־0 עד $${sb}$ ← אורך ${b}.`, `שטח $= \\frac{${a} \\cdot ${b}}{2} = ${a * b / 2}$`],
        };
      } },
      { level: 2, gen() {
        const m = U.RNZ(-4, 4), b = U.R(-8, 8), x = U.RNZ(-4, 4), y = m * x + b;
        return {
          q: `ישר שהשיפוע שלו $${m}$ עובר דרך הנקודה $(${x}, ${y})$. מה המשוואה שלו? כתבו את $b$.`,
          type: 'number', answer: b,
          mistakes: [{ v: y + m * x, why: `בדוק סימנים: כמה זה $${m} \\cdot ${par(x)}$, ומה קורה לסימן שלו כשמעבירים אותו לאגף השני?` },
            { v: x - m * y, why: `הצבת הפוך? בנקודה $(${x}, ${y})$ המספר הראשון הוא $x$ והשני הוא $y$.` },
            { v: y, why: `$${y}$ הוא ה־$y$ של הנקודה. $b$ שווה ל־$y$ רק כאשר $x = 0$.` }],
          hint: `כותבים $y = ${U.term(m)} + b$ ומציבים את הנקודה: $x = ${x}$, $y = ${y}$. ואז פותרים משוואה עם הנעלם $b$.`,
          steps: [`$y = ${U.term(m)} + b$`, `מציבים: $${y} = ${m} \\cdot ${par(x)} + b$`, `$${y} = ${m * x} + b$`,
            `$b = ${y} - ${par(m * x)} = ${b}$`, `המשוואה: $y = ${U.lin(m, b)}$.`],
        };
      } },
      { level: 2, gen() {
        const m = U.RNZ(-3, 3), b = U.R(-5, 5), x1 = U.R(-3, 2), x2 = x1 + U.R(1, 3), y1 = m * x1 + b, y2 = m * x2 + b;
        const right = `$y = ${U.lin(m, b)}$`;
        const pool = [`$y = ${U.lin(m, y1)}$`, `$y = ${U.lin(-m, b)}$`, `$y = ${U.lin(m, b + U.pick([-2, -1, 1, 2]))}$`, `$y = ${U.lin(m + U.pick([-1, 1]) || 2, b)}$`, `$y = ${U.lin(-m, -b)}$`];
        const wrong = [...new Set(pool)].filter(s => s !== right).slice(0, 3);
        for (let k = 3; wrong.length < 3; k++) wrong.push(`$y = ${U.lin(m, b + k)}$`);
        const choices = U.shuffle([right, ...wrong]);
        return {
          q: `איזו משוואה מתאימה לישר שעובר דרך $(${x1}, ${y1})$ ו־$(${x2}, ${y2})$?`,
          type: 'choice', choices, answer: choices.indexOf(right),
          mistakes: [[U.lin(m, y1), `ה־$b$ הוא לא ה־$y$ של הנקודה $(${x1}, ${y1})$. הצב את הנקודה במשוואה ופתור.`], [U.lin(-m, b), 'בדוק את סימן השיפוע: מחסירים את ה־$y$־ים ואת ה־$x$־ים באותו סדר.'], [U.lin(-m, -b), 'בדוק את סימן השיפוע: מחסירים את ה־$y$־ים ואת ה־$x$־ים באותו סדר.']]
            .map(([e, why]) => ({ v: choices.indexOf(`$y = ${e}$`), why })).filter(k => k.v >= 0),
          hint: 'קודם מוצאים את השיפוע משתי הנקודות. אחר כך מציבים נקודה אחת כדי למצוא את $b$.',
          steps: [`$m = \\frac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = \\frac{${y2 - y1}}{${x2 - x1}} = ${m}$`,
            `מציבים $(${x1}, ${y1})$ ב־$y = ${U.term(m)} + b$: $${y1} = ${m * x1} + b$ ← $b = ${b}$`, `המשוואה: ${right}.`],
        };
      } },
      { level: 2, gen() {
        let m, a, b; do { m = U.RNZ(-3, 3); a = U.RNZ(-4, 4); b = -m * a; } while ((a * b) % 2);
        const area = Math.abs(a * b) / 2;
        return {
          q: `מה שטח המשולש שהישר $y = ${U.lin(m, b)}$ יוצר עם הצירים?`,
          type: 'number', answer: area,
          mistakes: [{ v: -area, why: 'שטח לא יכול להיות שלילי. אורך של ניצב הוא מרחק, בלי מינוס.' }],
          hint: 'מוצאים את שתי נקודות החיתוך עם הצירים ($x = 0$ ואחר כך $y = 0$). המרחקים שלהן מ־$(0, 0)$ הם הניצבים.',
          steps: [`ציר ה־y ($x = 0$): $(0, ${b})$ ← ניצב באורך ${Math.abs(b)}.`,
            `ציר ה־x ($y = 0$): $0 = ${U.lin(m, b)}$ ← $x = ${a}$ ← $(${a}, 0)$, ניצב באורך ${Math.abs(a)}.`,
            `שטח $= \\frac{${Math.abs(a)} \\cdot ${Math.abs(b)}}{2} = ${area}$`],
        };
      } },
      { level: 3, gen() {
        const m = U.pick([0.5, -0.5, 1.5, -1.5, 2, -2, 3]), x1 = 2 * U.R(-2, 1), dx = 2 * U.R(1, 2), b = U.R(-5, 5);
        const x2 = x1 + dx, y1 = m * x1 + b, y2 = m * x2 + b, dy = y2 - y1, mt = U.frac(dy, dx);
        return {
          q: `ישר עובר דרך הנקודות $(${x1}, ${y1})$ ו־$(${x2}, ${y2})$. מצאו את משוואת הישר וכתבו את $b$ (נקודת החיתוך עם ציר ה־y).`,
          type: 'number', answer: b,
          mistakes: [{ v: m, why: 'זה השיפוע $m$. שאלו על $b$.' },
            { v: y1 - (dx / dy) * x1, why: 'בדוק את השיפוע: מחלקים את השינוי ב־$y$ בשינוי ב־$x$, ולא להפך.' },
            { v: y1 + m * x1, why: `בדוק סימנים: כמה זה $${mt} \\cdot ${par(x1)}$, ומה קורה לסימן שלו כשמעבירים אותו לאגף השני?` }],
          hint: 'שני שלבים: קודם השיפוע $m = \\frac{y_2 - y_1}{x_2 - x_1}$ (יכול לצאת שבר!), אחר כך מציבים נקודה.',
          steps: [`$m = \\frac{${y2} - ${par(y1)}}{${x2} - ${par(x1)}} = \\frac{${dy}}{${dx}} = ${mt}$`,
            `מציבים $(${x1}, ${y1})$: $${y1} = ${mt} \\cdot ${par(x1)} + b$`, `$${y1} = ${U.num(m * x1).replace('−', '-')} + b$ ← $b = ${b}$`,
            `המשוואה: $${eqTeX(dy, dx, b, 1)}$.`],
        };
      } },
      { level: 3, gen() {
        const m = U.RNZ(-3, 3), a = U.R(-5, 5), b = -m * a;
        let x1; do { x1 = a + U.RNZ(-3, 3); } while (x1 === 0);
        const x2 = x1 + U.R(1, 3), y1 = m * (x1 - a), y2 = m * (x2 - a);
        return {
          q: `ישר עובר דרך הנקודות $(${x1}, ${y1})$ ו־$(${x2}, ${y2})$. באיזו נקודה הוא חותך את ציר ה־x?`,
          type: 'pair', answer: [a, 0],
          mistakes: [{ v: [0, b], why: 'זו נקודת החיתוך עם ציר ה־y. שאלו על ציר ה־x (שם $y = 0$).' }, { v: [-a, 0], why: 'בדוק את הסימנים בשלב האחרון, כשמציבים $y = 0$ ופותרים.' }],
          hint: 'מוצאים את משוואת הישר (שיפוע, ואז $b$). אחר כך מציבים $y = 0$.',
          steps: [`$m = \\frac{${y2 - y1}}{${x2 - x1}} = ${m}$`, `מציבים $(${x1}, ${y1})$: $${y1} = ${m * x1} + b$ ← $b = ${b}$, כלומר $y = ${U.lin(m, b)}$`,
            `$y = 0$: $0 = ${U.lin(m, b)}$ ← $${U.term(m)} = ${-b}$ ← $x = ${a}$`, `הנקודה: $(${a}, 0)$.`],
        };
      } },
    ],

    summary: [
      'חיתוך עם ציר ה־y: מציבים $x = 0$. חיתוך עם ציר ה־x: מציבים $y = 0$ ופותרים.',
      'שיפוע משתי נקודות: $m = \\frac{y_2 - y_1}{x_2 - x_1}$ — השינוי ב־y חלקי השינוי ב־x.',
      'משוואת ישר: מוצאים $m$, מציבים נקודה ב־$y = mx + b$, ופותרים כדי למצוא את $b$.',
      'תמיד אפשר לבדוק: מציבים את הנקודה השנייה במשוואה ורואים שזה מסתדר.',
      'שטח המשולש עם הצירים = ניצב כפול ניצב חלקי 2. אורכים תמיד חיוביים.',
    ],
  });
})();
