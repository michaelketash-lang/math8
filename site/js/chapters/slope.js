/* יחידה: שיפוע ויחס ישר, y = mx (פרק 4 בספר) */
(() => {
  const p = n => (n < 0 ? `(${n})` : `${n}`);
  const tbl = (xs, ys) => `$\\begin{array}{c|${'c'.repeat(xs.length)}} x & ${xs.join(' & ')} \\\\ \\hline y & ${ys.join(' & ')} \\end{array}$`;
  /** שיפוע לתצוגה ב־TeX: 0.5 → \frac{1}{2} */
  const mtex = m => (Number.isInteger(m) ? `${m}` : U.frac(Math.round(m * 6), 6));
  const yeq = m => `y = ${m === 1 ? '' : m === -1 ? '-' : Number.isInteger(m) ? m : mtex(m)}x`;

  registerChapter('slope', {
    intro: `
      <p><b>שיפוע</b> אומר כמה תלול הקו: בכמה עולים (או יורדים) על כל צעד ימינה.</p>
      <div class="formula">שיפוע = כמה עלינו ÷ כמה הלכנו ימינה</div>
      <div class="idea"><b>איך מוצאים שיפוע משתי נקודות</b>מנקודה אחת לשנייה: השינוי ב־$y$ חלקי השינוי ב־$x$.
        <br>למשל מ־$(1, 2)$ ל־$(3, 8)$: עלינו $6$ והלכנו $2$ ימינה. השיפוע: $\\frac{6}{2} = 3$.
        <br>אם הקו <b>יורד</b> — השינוי ב־$y$ שלילי, ולכן גם השיפוע <b>שלילי</b>.</div>
      <div class="idea"><b>הפונקציה $y = mx$</b>הגרף שלה הוא קו ישר שעובר <b>דרך ראשית הצירים</b> $(0, 0)$. המספר $m$ הוא השיפוע.
        <br>$y = 3x$ ← תלול ועולה · $y = \\frac{1}{2}x$ ← מתון · $y = -2x$ ← יורד.</div>
      <div class="idea"><b>יחס ישר</b>שני גדלים נמצאים ביחס ישר אם $y = mx$. כלומר:
        <br>• כש־$x$ גדל פי 2, גם $y$ גדל פי 2. &nbsp; • המנה $\\frac{y}{x}$ תמיד שווה ל־$m$. &nbsp; • הגרף עובר דרך $(0, 0)$.
        <br>דוגמה: כרטיס עולה 30 ש״ח ← $y = 30x$. 0 כרטיסים עולים 0 ש״ח.</div>
      <div class="note"><b>לא כל קו ישר הוא יחס ישר!</b><br>$y = 2x + 5$ הוא קו ישר, אבל הוא לא עובר דרך $(0, 0)$ — ולכן זה <b>לא</b> יחס ישר.</div>`,

    example: {
      question: 'קו ישר עובר דרך ראשית הצירים ודרך הנקודה $(4, 12)$.<br>א. מה השיפוע? ב. כתבו את הפונקציה. ג. האם זה יחס ישר? ד. מה $y$ כאשר $x = 10$?',
      steps: [
        'שתי נקודות על הקו: $(0, 0)$ ו־$(4, 12)$.',
        'השינוי ב־$x$: מ־$0$ ל־$4$, כלומר $4$ צעדים ימינה.',
        'השינוי ב־$y$: מ־$0$ ל־$12$, כלומר עלינו $12$.',
        'השיפוע: $m = \\frac{12}{4} = 3$. בכל צעד ימינה עולים 3.',
        'הקו עובר דרך $(0, 0)$, לכן הוא מהצורה $y = mx$: $y = 3x$.',
        'זה <b>יחס ישר</b>: הקו עובר בראשית, ו־$\\frac{y}{x} = \\frac{12}{4} = 3$ קבוע.',
        'מציבים $x = 10$: $y = 3 \\cdot 10 = 30$.',
      ],
    },

    tools: [
      {
        title: 'משולש השיפוע',
        desc: 'גררו את הנקודות A ו־B. המשולש מראה כמה הלכנו ימינה (ירוק) וכמה עלינו או ירדנו (אדום). השיפוע הוא האדום חלקי הירוק.',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = U.board(el, [-7, 7, 7, -7]);
          const A = brd.create('point', [-2, -1], { name: 'A', color: '#e8702a', size: 6, snapToGrid: true });
          const B = brd.create('point', [2, 5], { name: 'B', color: '#e8702a', size: 6, snapToGrid: true });
          const C = brd.create('point', [() => B.X(), () => A.Y()], { visible: false });
          brd.create('line', [A, B], { strokeColor: '#2f6fdb', strokeWidth: 3 });
          brd.create('segment', [A, C], { strokeColor: '#1f9d55', strokeWidth: 4, dash: 2 });
          brd.create('segment', [C, B], { strokeColor: '#d64545', strokeWidth: 4, dash: 2 });
          const upd = () => {
            const dx = Math.round(B.X() - A.X()), dy = Math.round(B.Y() - A.Y());
            if (dx === 0) { out.innerHTML = 'הקו אנכי (עומד) — אין לו שיפוע. הזיזו נקודה הצידה.'; return; }
            const m = dy / dx, dir = m > 0 ? 'עולה ↗' : m < 0 ? 'יורד ↘' : 'שטוח →';
            out.innerHTML = `ימינה: <b style="color:#1f9d55">$${dx}$</b> · למעלה: <b style="color:#d64545">$${dy}$</b> · שיפוע: $\\frac{${dy}}{${dx}} = ${U.frac(dy, dx)}$ · הקו <b>${dir}</b>`;
            U.math(out);
          };
          A.on('drag', upd); B.on('drag', upd); upd();
        },
      },
      {
        title: 'מעבדת היחס הישר',
        desc: 'השאירו את b על 0 וראו: המנה y/x זהה בכל השורות, והקו עובר דרך (0, 0). עכשיו הזיזו את b — מה קורה למנה?',
        mount(el) {
          const st = { m: 2, b: 0 };
          const tab = document.createElement('div'); tab.className = 'readout'; el.appendChild(tab);
          const msg = document.createElement('div'); msg.className = 'readout'; el.appendChild(msg);
          const brd = U.board(el, [-5, 10, 5, -10]);
          brd.create('functiongraph', [x => st.m * x + st.b], { strokeColor: '#2f6fdb', strokeWidth: 4 });
          brd.create('point', [0, 0], { name: '(0, 0)', color: '#1f9d55', size: 4, fixed: true, label: { offset: [6, -14] } });
          const upd = () => {
            const xs = [1, 2, 3, 4], ys = xs.map(x => st.m * x + st.b);
            tab.innerHTML = `$\\begin{array}{c|cccc} x & 1 & 2 & 3 & 4 \\\\ \\hline y & ${ys.map(U.num).join(' & ')} \\\\ \\hline y \\div x & ${ys.map((y, i) => U.num(y / xs[i])).join(' & ')} \\end{array}$`;
            msg.innerHTML = st.b === 0
              ? `✔ $y = ${st.m === 0 ? '0' : U.term(st.m)}$ — <b>יחס ישר</b>: המנה תמיד $${U.num(st.m)}$ והקו עובר בראשית.`
              : `✗ $y = ${U.lin(st.m, st.b)}$ — <b>לא יחס ישר</b>: המנה משתנה והקו לא עובר דרך $(0, 0)$.`;
            U.math(tab); U.math(msg); brd.update();
          };
          U.slider(el, { label: 'שיפוע m', min: -3, max: 3, step: 0.5, value: st.m, onInput: v => { st.m = v; upd(); } });
          U.slider(el, { label: 'b', min: -4, max: 4, step: 1, value: st.b, onInput: v => { st.b = v; upd(); } });
        },
      },
      {
        title: 'משחק: כוונו מהראשית',
        desc: 'הקו המקווקו יוצא מ־(0, 0). גררו את הנקודה הכתומה כך שהקו הכחול ייפול עליו בדיוק. חשבו: כמה ימינה, וכמה למעלה?',
        mount(el) {
          const MS = [2, 3, -1, -2, 0.5, 1.5, -0.5, 1 / 3, 2 / 3, -1.5];
          let target = 0.5;
          const msg = document.createElement('div'); msg.className = 'readout'; el.appendChild(msg);
          const brd = U.board(el, [-7, 7, 7, -7]);
          brd.create('functiongraph', [x => target * x], { strokeColor: '#e8702a', strokeWidth: 4, dash: 3 });
          const P = brd.create('point', [3, -2], { name: '', color: '#e8702a', size: 7, snapToGrid: true });
          brd.create('line', [[0, 0], P], { strokeColor: '#2f6fdb', strokeWidth: 3 });
          const check = () => {
            const x = Math.round(P.X()), y = Math.round(P.Y());
            if (x !== 0 && Math.abs(y / x - target) < 1e-9) {
              msg.innerHTML = `🏀 סל! ימינה $${x}$, למעלה $${y}$ ← שיפוע $${U.frac(y, x)}$. הקו: $${yeq(target)}$ <button class="btn">קו חדש</button>`;
              U.math(msg);
              msg.querySelector('button').onclick = () => { target = U.pick(MS.filter(m => m !== target)); msg.textContent = 'קו חדש! גררו את הנקודה.'; brd.update(); };
            } else msg.innerHTML = 'עוד לא... רמז: מצאו על הקו המקווקו נקודה שיושבת בדיוק על צומת של המשבצות.';
          };
          P.on('drag', check); check();
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        const m = U.RNZ(-6, 6);
        return {
          q: `מה השיפוע של הקו $${yeq(m)}$?`,
          type: 'number', answer: m,
          hint: 'בפונקציה $y = mx$ השיפוע הוא המספר שצמוד ל־$x$ (עם הסימן שלו). אם לא כתוב מספר — הוא 1.',
          steps: [`התבנית: $y = mx$.`, `אצלנו $m = ${m}$, וזה השיפוע.`],
        };
      } },
      { level: 1, gen() {
        const run = U.R(1, 4), m = U.RNZ(-4, 4), rise = m * run;
        return {
          q: `על קו מסוים, כשהולכים $${run}$ ${run === 1 ? 'צעד' : 'צעדים'} ימינה, ${rise > 0 ? 'עולים' : 'יורדים'} $${Math.abs(rise)}$. מה השיפוע של הקו?`,
          type: 'number', answer: m,
          hint: `שיפוע = כמה עולים חלקי כמה הולכים ימינה. ירידה נחשבת שלילית.`,
          steps: [`${rise > 0 ? 'עולים' : 'יורדים'} $${Math.abs(rise)}$ ← השינוי ב־$y$ הוא $${rise}$.`, `שיפוע: $\\frac{${rise}}{${run}} = ${m}$`],
        };
      } },
      { level: 1, gen() {
        const m = U.pick([2, 3, 4, 5, -2, -3, 0.5]), b = U.RNZ(-6, 6), yes = Math.random() < 0.5;
        const tex = yes ? yeq(m) : `y = ${U.lin(Number.isInteger(m) ? m : 1, b)}`;
        return {
          q: `האם הפונקציה $${tex}$ מתארת יחס ישר?`,
          type: 'choice', choices: ['כן', 'לא'], answer: yes ? 0 : 1,
          hint: 'יחס ישר נראה בדיוק כמו $y = mx$ — בלי מספר שנוסף או מוחסר. בודקים: האם הקו עובר דרך $(0, 0)$?',
          steps: yes ? ['הפונקציה מהצורה $y = mx$, בלי תוספת.', 'כש־$x = 0$ גם $y = 0$ ← <b>כן</b>, יחס ישר.']
            : [`יש תוספת של $${b}$.`, `כש־$x = 0$ יוצא $y = ${b}$, לא $0$ ← <b>לא</b> יחס ישר.`],
        };
      } },
      { level: 1, gen() {
        const m = U.RNZ(-5, 6), x = U.RNZ(-5, 8);
        return {
          q: `נתונה הפונקציה $${yeq(m)}$. מה $y$ כאשר $x = ${x}$?`,
          type: 'number', answer: m * x,
          hint: `מציבים $${x}$ במקום $x$ וכופלים ב־$${m}$.`,
          steps: [`$y = ${m} \\cdot ${p(x)} = ${m * x}$`],
        };
      } },
      { level: 2, gen() {
        const m = U.RNZ(-4, 4), x1 = U.R(-4, 3), x2 = x1 + U.R(1, 4), y1 = U.R(-5, 5), y2 = y1 + m * (x2 - x1);
        return {
          q: `מה השיפוע של הקו שעובר דרך הנקודות $(${x1}, ${y1})$ ו־$(${x2}, ${y2})$?`,
          type: 'number', answer: m,
          hint: 'שיפוע = (השינוי ב־$y$) חלקי (השינוי ב־$x$). מחסירים באותו סדר בשני המקרים!',
          steps: [`שינוי ב־$y$: $${y2} - ${p(y1)} = ${y2 - y1}$`, `שינוי ב־$x$: $${x2} - ${p(x1)} = ${x2 - x1}$`, `שיפוע: $\\frac{${y2 - y1}}{${x2 - x1}} = ${m}$`],
        };
      } },
      { level: 2, gen() {
        const [rise, run] = U.pick([[1, 2], [2, 1], [3, 1], [1, 3], [2, 3], [3, 2], [-1, 2], [-2, 1], [-1, 1], [1, 1], [-3, 2]]), m = rise / run;
        return {
          q: 'מה השיפוע של הקו שבגרף? (אפשר לכתוב שבר, כמו 1/2)',
          type: 'number', answer: m,
          mount(el) {
            const brd = U.board(el, [-6, 6, 6, -6]);
            brd.create('functiongraph', [x => m * x], { strokeColor: '#2f6fdb', strokeWidth: 3 });
            brd.create('point', [0, 0], { name: '', color: '#e8702a', size: 3, fixed: true });
            brd.create('point', [run, rise], { name: `(${run}, ${rise})`, color: '#e8702a', size: 3, fixed: true });
          },
          hint: 'הקו עובר דרך $(0, 0)$ ודרך הנקודה הכתומה השנייה. כמה הלכנו ימינה? כמה עלינו או ירדנו?',
          steps: [`מ־$(0, 0)$ ל־$(${run}, ${rise})$: ימינה $${run}$, ${rise > 0 ? 'למעלה' : 'למטה'} $${Math.abs(rise)}$.`, `שיפוע: $\\frac{${rise}}{${run}} = ${mtex(m)}$`],
        };
      } },
      { level: 2, gen() {
        const price = U.pick([15, 20, 25, 30, 40, 50]), a = U.R(2, 6); let b; do { b = U.R(3, 10); } while (b === a);
        const item = U.pick([['כרטיסים', 'עולים', 'יעלו'], ['כדורים', 'עולים', 'יעלו'], ['חולצות', 'עולות', 'יעלו']]);
        return {
          q: `המחיר נמצא ביחס ישר למספר ה${item[0]}. $${a}$ ${item[0]} ${item[1]} $${price * a}$ ש״ח. כמה ${item[2]} $${b}$ ${item[0]}?`,
          type: 'number', answer: price * b,
          hint: 'ביחס ישר אפשר קודם למצוא כמה עולה אחד (חילוק), ואז לכפול.',
          steps: [`מחיר של אחד: $${price * a} \\div ${a} = ${price}$ ש״ח (זה ה־$m$: $y = ${price}x$).`, `$${b}$ ${item[0]}: $${price} \\cdot ${b} = ${price * b}$ ש״ח.`],
        };
      } },
      { level: 2, gen() {
        const m = U.R(2, 6), yes = Math.random() < 0.5, b = yes ? 0 : U.R(1, 4), xs = U.shuffle([1, 2, 3, 4, 5, 6]).slice(0, 4).sort((a, c) => a - c);
        const ys = xs.map(x => m * x + b);
        return {
          q: `האם הטבלה ${tbl(xs, ys)} מתארת יחס ישר?`,
          type: 'choice', choices: ['כן', 'לא'], answer: yes ? 0 : 1,
          hint: 'מחשבים בכל עמודה את המנה $y \\div x$. ביחס ישר היא יוצאת אותו מספר בכל העמודות.',
          steps: [`המנות: ${xs.map((x, i) => `$${ys[i]} \\div ${x} = ${U.num(ys[i] / x)}$`).join(', ')}.`, yes ? `כולן $${m}$ ← <b>כן</b>, יחס ישר: $y = ${m}x$.` : 'המנות לא שוות ← <b>לא</b> יחס ישר.'],
        };
      } },
      { level: 3, gen() {
        const m = U.pick([2, 3, 4, 5, 1.5, 2.5, -2, -3]), a = U.pick([2, 4, 6]), c = U.pick([2, 4, 8, 10, 12].filter(v => v !== a));
        return {
          q: `קו ישר עובר דרך ראשית הצירים ודרך הנקודה $(${a}, ${U.num(m * a)})$. מה $y$ כאשר $x = ${c}$?`,
          type: 'number', answer: m * c,
          hint: 'קודם מוצאים את השיפוע: $y \\div x$ בנקודה הנתונה. אחר כך מציבים בנוסחה $y = mx$.',
          steps: [`השיפוע: $m = ${U.num(m * a)} \\div ${a} = ${U.num(m)}$.`, `הפונקציה: $y = ${U.num(m)}x$.`, `$y = ${U.num(m)} \\cdot ${c} = ${U.num(m * c)}$`],
        };
      } },
      { level: 3, gen() {
        const m = U.pick([2, 3, -2, -3, 0.5, -0.5]), x = U.pick([2, 4, -2, -4]);
        const right = [x, m * x], wrongs = [[m * x, x], [x, -m * x], [x, m * x + U.pick([1, -1])]];
        const opts = U.shuffle([right, ...wrongs]);
        return {
          q: `איזו נקודה נמצאת על הקו $${yeq(m)}$?`,
          type: 'choice', choices: opts.map(([a, b]) => `$(${U.num(a)}, ${U.num(b)})$`), answer: opts.indexOf(right),
          hint: 'בכל נקודה: מציבים את ה־$x$ (המספר הראשון) ובודקים אם יוצא ה־$y$ (המספר השני).',
          steps: [`מציבים $x = ${x}$: $y = ${mtex(m)} \\cdot ${p(x)} = ${U.num(m * x)}$.`, `לכן הנקודה $(${x}, ${U.num(m * x)})$ על הקו.`, 'זהירות: בזוג סדור קודם $x$ ואחר כך $y$!'],
        };
      } },
      { level: 3, gen() {
        const m = U.RNZ(-3, 4), x1 = U.R(-3, 2), y1 = U.R(-4, 5), x2 = x1 + U.R(2, 5), y2 = y1 + m * (x2 - x1);
        return {
          q: `לקו יש שיפוע $${m}$. הוא עובר דרך הנקודה $A(${x1}, ${y1})$ ודרך הנקודה $B(${x2}, ?)$. מה ה־$y$ של $B$?`,
          type: 'number', answer: y2,
          hint: `מ־$A$ ל־$B$ הולכים $${x2 - x1}$ צעדים ימינה. בכל צעד $y$ משתנה ב־$${m}$.`,
          steps: [`צעדים ימינה: $${x2} - ${p(x1)} = ${x2 - x1}$.`, `השינוי ב־$y$: $${x2 - x1} \\cdot ${p(m)} = ${m * (x2 - x1)}$.`, `$y = ${y1} ${U.sgn(m * (x2 - x1))} = ${y2}$`],
        };
      } },
    ],

    summary: [
      'שיפוע = השינוי ב־$y$ חלקי השינוי ב־$x$ (כמה עולים על כל צעד ימינה).',
      'שיפוע חיובי ← עולה, שלילי ← יורד, גדול ← תלול.',
      '$y = mx$: קו ישר דרך $(0, 0)$, ו־$m$ הוא השיפוע.',
      'יחס ישר: $y = mx$ — המנה $y \\div x$ קבועה, והגרף עובר בראשית.',
      'קו כמו $y = 2x + 5$ לא עובר בראשית ← לא יחס ישר.',
    ],
  });
})();
