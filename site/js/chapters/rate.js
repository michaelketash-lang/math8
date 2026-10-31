/* יחידה: קצב השתנות של פונקציה (פרק 3 בספר) */
(() => {
  const p = n => (n < 0 ? `(${n})` : `${n}`);
  const tbl = (xs, ys) => `$\\begin{array}{c|${'c'.repeat(xs.length)}} x & ${xs.join(' & ')} \\\\ \\hline y & ${ys.join(' & ')} \\end{array}$`;
  /** טבלה עם כותרות בעברית (KaTeX לא מסתדר עם עברית) */
  const htbl = (xn, yn, xs, ys) => `<table dir="rtl" style="border-collapse:collapse;margin:8px auto;text-align:center">${[[xn, xs], [yn, ys]].map(([h, r], i) => `<tr><th style="padding:4px 10px;border-left:2px solid var(--line)">${h}</th>${r.map(v => `<td style="padding:4px 12px;${i ? '' : 'border-bottom:2px solid var(--line)'}">${v}</td>`).join('')}</tr>`).join('')}</table>`;
  const sg = n => (n > 0 ? `+${n}` : `${n}`);

  registerChapter('rate', {
    intro: `
      <p><b>קצב השתנות</b> אומר בכמה $y$ משתנה כאשר $x$ גדל ב־1. למשל: "שחקן קולע 3 נקודות בכל דקה" — הקצב הוא 3 נקודות לדקה.</p>
      <div class="formula">קצב השתנות = השינוי ב־$y$ ÷ השינוי ב־$x$</div>
      <div class="idea"><b>איך מחשבים מטבלה</b>בוחרים שתי עמודות. כמה $y$ השתנה? כמה $x$ השתנה? מחלקים.
        <br>למשל: מ־$x = 2$ ל־$x = 6$ ה־$y$ עלה מ־$10$ ל־$22$. הקצב: $\\frac{22 - 10}{6 - 2} = \\frac{12}{4} = 3$.</div>
      <div class="idea"><b>קצב קבוע ← קו ישר</b>אם הקצב <b>זהה</b> בכל מקום, הנקודות של הגרף נמצאות על <b>קו ישר</b>. פונקציה כזו נקראת <b>פונקציה קווית</b>.
        <br>אם הקצב משתנה — הגרף מתעקם.</div>
      <div class="idea"><b>הסימן של הקצב</b>קצב חיובי ← הפונקציה <b>עולה</b> · קצב שלילי ← <b>יורדת</b> · קצב 0 ← <b>קבועה</b>.</div>
      <div class="note"><b>זהירות!</b><br>אם ה־$x$ בטבלה קופץ ב־2 (או יותר), לא מספיק להסתכל על השינוי ב־$y$ — צריך לחלק בשינוי ב־$x$.</div>`,

    example: {
      question: `ברז ממלא דלי. הטבלה מראה כמה ליטרים יש בדלי אחרי כמה דקות:${htbl('דקות', 'ליטרים', [0, 2, 4, 6], [5, 11, 17, 23])}א. מה קצב ההשתנות? ב. האם הוא קבוע? ג. כמה ליטרים יהיו אחרי 10 דקות?`,
      steps: [
        'מעמודה לעמודה ה־$x$ גדל ב־$2$ (כל פעם עוברות 2 דקות).',
        'וה־$y$ גדל כל פעם ב־$6$: $5 \\to 11 \\to 17 \\to 23$.',
        'הקצב: $\\frac{6}{2} = 3$ ליטרים בדקה. (לא 6! כי 6 ליטרים נכנסים ב־2 דקות.)',
        'בין כל שתי עמודות יוצא $3$ — הקצב <b>קבוע</b>, ולכן הגרף הוא קו ישר.',
        'הקצב חיובי ← הפונקציה <b>עולה</b> (הדלי מתמלא).',
        'מ־6 דקות ל־10 דקות עוברות עוד $4$ דקות, ונכנסים $4 \\cdot 3 = 12$ ליטרים.',
        'אחרי 10 דקות: $23 + 12 = 35$ ליטרים.',
      ],
    },

    tools: [
      {
        title: 'טבלה חיה',
        desc: 'שנו את המספרים בשורה של y. מתחת לטבלה רואים בכמה y השתנה בכל צעד. כשהשינוי זהה בכל מקום — הנקודות יושבות על קו ישר.',
        mount(el) {
          const xs = [0, 1, 2, 3, 4];
          el.insertAdjacentHTML('beforeend', `<div class="row" style="justify-content:center">
              <button class="btn ghost" data-p="0">קצב קבוע</button><button class="btn ghost" data-p="1">קצב משתנה</button><button class="btn ghost" data-p="2">קצב שלילי</button></div>
            <div dir="ltr" style="display:grid;grid-template-columns:auto repeat(5,1fr);gap:6px;align-items:center;max-width:460px;margin:0 auto">
              <b>x</b>${xs.map(x => `<b style="text-align:center">${x}</b>`).join('')}
              <b>y</b>${xs.map(() => '<input class="in" inputmode="decimal" style="width:100%;text-align:center">').join('')}
              <span></span>${xs.map(() => '<span class="d" style="text-align:center;color:var(--accent);font-weight:600"></span>').join('')}
            </div><div class="readout msg"></div>`);
          const ins = [...el.querySelectorAll('.in')], ds = [...el.querySelectorAll('.d')], msg = el.querySelector('.msg');
          const brd = U.board(el, [-1, 21, 5, -3]);
          let ys = [2, 5, 8, 11, 14];
          xs.forEach((x, i) => brd.create('point', [x, () => ys[i]], { name: '', color: '#e8702a', size: 5, fixed: true }));
          const cv = brd.create('curve', [xs, [...ys]], { strokeColor: '#2f6fdb', strokeWidth: 2, dash: 2 });
          const upd = () => {
            ys = ins.map(i => parseNum(i.value)).map(v => (isNaN(v) ? 0 : v));
            const diffs = ys.slice(1).map((y, i) => y - ys[i]);
            ds.forEach((d, i) => { d.textContent = i ? (diffs[i - 1] > 0 ? '+' : '') + U.num(diffs[i - 1]) : ''; });
            cv.dataY = ys;
            const same = diffs.every(v => v === diffs[0]);
            msg.innerHTML = same
              ? `✔ קצב קבוע: $${U.num(diffs[0])}$ בכל צעד ← הנקודות על <b>קו ישר</b>. הפונקציה ${diffs[0] > 0 ? 'עולה' : diffs[0] < 0 ? 'יורדת' : 'קבועה'}.`
              : '✗ הקצב משתנה ← הנקודות <b>לא</b> על קו ישר.';
            U.math(msg); brd.update();
          };
          const set = arr => { arr.forEach((v, i) => { ins[i].value = v; }); upd(); };
          const PRE = [[2, 5, 8, 11, 14], [1, 2, 4, 8, 16], [18, 14, 10, 6, 2]];
          el.querySelectorAll('[data-p]').forEach(b => b.onclick = () => set(PRE[+b.dataset.p]));
          ins.forEach(i => i.addEventListener('input', upd));
          set(PRE[0]);
        },
      },
      {
        title: 'שתי נקודות, קצב אחד?',
        desc: 'בחרו שתי נקודות על הגרף. המשולש מראה את השינוי ב־x ואת השינוי ב־y. על קו ישר הקצב תמיד יוצא אותו דבר. על עקומה — לא!',
        mount(el) {
          const F = [{ name: 'קו ישר', f: x => 0.5 * x + 1 }, { name: 'עקומה', f: x => 0.25 * x * x }];
          let k = 0, a = 2, b = 4; // צעדים של 2 ← ערכים שלמים בשתי הפונקציות
          const row = document.createElement('div'); row.className = 'row'; row.style.justifyContent = 'center'; el.appendChild(row);
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = U.board(el, [-1, 9, 7, -1]);
          const f = x => F[k].f(x);
          brd.create('functiongraph', [x => f(x), -1, 7], { strokeColor: '#2f6fdb', strokeWidth: 3 });
          const A = brd.create('point', [() => a, () => f(a)], { name: 'A', color: '#e8702a', size: 5, fixed: true });
          const B = brd.create('point', [() => b, () => f(b)], { name: 'B', color: '#e8702a', size: 5, fixed: true });
          const C = brd.create('point', [() => b, () => f(a)], { visible: false });
          brd.create('segment', [A, C], { strokeColor: '#1f9d55', strokeWidth: 3, dash: 2 });
          brd.create('segment', [C, B], { strokeColor: '#d64545', strokeWidth: 3, dash: 2 });
          const upd = () => {
            brd.update();
            if (a === b) { out.textContent = 'בחרו שתי נקודות שונות.'; return; }
            const dy = f(b) - f(a), dx = b - a;
            out.innerHTML = `שינוי ב־x: <b style="color:#1f9d55">$${U.num(dx)}$</b> · שינוי ב־y: <b style="color:#d64545">$${U.num(dy)}$</b> · קצב: $\\frac{${U.num(dy)}}{${U.num(dx)}} = ${U.num(dy / dx)}$`;
            U.math(out);
          };
          F.forEach((g, i) => { const btn = document.createElement('button'); btn.className = 'btn ghost'; btn.textContent = g.name; btn.onclick = () => { k = i; upd(); }; row.appendChild(btn); });
          U.slider(el, { label: 'x של A', min: 0, max: 6, step: 2, value: a, onInput: v => { a = v; upd(); } });
          U.slider(el, { label: 'x של B', min: 0, max: 6, step: 2, value: b, onInput: v => { b = v; upd(); } });
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        const r = U.R(2, 6), t = U.R(2, 6), N = r * t, ctx = U.pick([['קלע', 'נקודות', 'דקות', 'בכל דקה'], ['קלע', 'סלים', 'אימונים', 'בכל אימון'], ['רכב על אופניים', 'קילומטרים', 'שעות', 'בכל שעה']]);
        return {
          q: `שחקן ${ctx[0]} $${N}$ ${ctx[1]} ב־$${t}$ ${ctx[2]}, בקצב קבוע. כמה ${ctx[1]} ${ctx[3]}?`,
          type: 'number', answer: r,
          hint: `מחלקים את מה שנצבר בזמן: $${N} \\div ${t}$.`,
          steps: [`קצב = שינוי ב־y חלקי שינוי ב־x.`, `$${N} \\div ${t} = ${r}$ ${ctx[1]} ${ctx[3]}.`],
        };
      } },
      { level: 1, gen() {
        const r = U.RNZ(-4, 5), s = U.R(0, 12) + (r < 0 ? 12 : 0), xs = [0, 1, 2, 3], ys = xs.map(x => s + r * x);
        return {
          q: `מה קצב ההשתנות של הפונקציה בטבלה? ${tbl(xs, ys)}`,
          type: 'number', answer: r,
          hint: '$x$ גדל כל פעם ב־1. בכמה משתנה $y$ בכל צעד? (אם הוא קטן — הקצב שלילי.)',
          steps: [`$${ys[0]} \\to ${ys[1]}$: שינוי של $${r}$. וכך גם בשאר העמודות.`, `$x$ גדל ב־1, לכן הקצב הוא $${r}$.`],
        };
      } },
      { level: 1, gen() {
        const r = U.RNZ(-5, 6), s = U.R(0, 10) + (r < 0 ? 20 : 0), xs = [1, 2, 3, 4, 5], ys = xs.map((_, i) => s + r * i);
        return {
          q: `לפונקציה קצב השתנות קבוע. מה המספר החסר? ${tbl(xs, [...ys.slice(0, 4), '?'])}`,
          type: 'number', answer: ys[4],
          hint: 'מוצאים בכמה $y$ משתנה בכל צעד, ומוסיפים את זה עוד פעם אחת.',
          steps: [`בכל צעד $y$ משתנה ב־$${r}$ (למשל $${ys[0]} \\to ${ys[1]}$).`, `$${ys[3]} ${U.sgn(r)} = ${ys[4]}$`],
        };
      } },
      { level: 1, gen() {
        const t = U.R(0, 2), n = U.R(2, 6);
        const story = [`מספר הצופים באולם גדל ב־${n * 10} בכל דקה.`, `גובה המים בבריכה יורד ב־${n} ס״מ בכל שעה.`, `המחיר של כרטיס נשאר ${n * 10} ש״ח בכל יום.`][t];
        return {
          q: `${story} הפונקציה (הכמות לפי הזמן) היא...`,
          type: 'choice', choices: ['עולה ↗', 'יורדת ↘', 'קבועה →'], answer: t,
          hint: 'גדל ← קצב חיובי. יורד ← קצב שלילי. לא משתנה ← קצב 0.',
          steps: [`הקצב הוא ${['חיובי', 'שלילי', 'אפס'][t]}.`, `לכן הפונקציה ${['עולה', 'יורדת', 'קבועה'][t]}.`],
        };
      } },
      { level: 2, gen() {
        const dx = U.pick([2, 3, 5]), r = U.RNZ(-4, 5), s = U.R(0, 10) + (r < 0 ? 40 : 0);
        const xs = [0, 1, 2, 3].map(i => i * dx), ys = xs.map(x => s + r * x);
        return {
          q: `מה קצב ההשתנות? ${tbl(xs, ys)}`,
          type: 'number', answer: r,
          hint: `שים לב: $x$ קופץ ב־$${dx}$ ולא ב־1! מחלקים את השינוי ב־$y$ בשינוי ב־$x$.`,
          steps: [`שינוי ב־$x$: $${dx}$. שינוי ב־$y$: $${ys[1]} - ${p(ys[0])} = ${r * dx}$.`, `קצב: $\\frac{${r * dx}}{${dx}} = ${r}$`],
        };
      } },
      { level: 2, gen() {
        const lin = Math.random() < 0.5, r = U.R(2, 5), s = U.R(0, 6), xs = [0, 1, 2, 3, 4];
        const ys = xs.map(x => s + r * x + (lin ? 0 : x === 3 ? U.pick([-1, 1]) : 0) + (lin ? 0 : x === 4 ? 2 : 0));
        const diffs = ys.slice(1).map((y, i) => y - ys[i]);
        const constant = diffs.every(d => d === diffs[0]);
        return {
          q: `האם קצב ההשתנות בטבלה קבוע? ${tbl(xs, ys)}`,
          type: 'choice', choices: ['כן, הקצב קבוע', 'לא, הקצב משתנה'], answer: constant ? 0 : 1,
          hint: 'בודקים את השינוי ב־$y$ בין <b>כל</b> שתי עמודות סמוכות, לא רק בין הראשונות.',
          steps: [`השינויים ב־$y$: $${diffs.map(sg).join(',\\ ')}$.`, constant ? 'כולם שווים ← <b>הקצב קבוע</b> (הגרף קו ישר).' : 'לא כולם שווים ← <b>הקצב משתנה</b>.'],
        };
      } },
      { level: 2, gen() {
        const s = U.R(5, 30), r = U.R(2, 8), t = U.R(3, 10), y = s + r * t;
        return {
          q: `בתחילת אימון היו בסל $${s}$ כדורים. כל דקה מוסיפים $${r}$ כדורים. כמה כדורים יהיו בסל אחרי $${t}$ דקות?`,
          type: 'number', answer: y,
          hint: `ב־$${t}$ דקות נוספים $${t}$ פעמים $${r}$ כדורים. אל תשכח את מה שהיה בהתחלה.`,
          steps: [`נוספו: $${t} \\cdot ${r} = ${r * t}$ כדורים.`, `ביחד: $${s} + ${r * t} = ${y}$.`],
        };
      } },
      { level: 3, gen() {
        let x1, x2, y1, r;
        do { x1 = U.R(-4, 1); x2 = x1 + U.R(2, 4); r = U.pick([-2, -1, -0.5, 0.5, 1, 2, 3]); y1 = U.R(-3, 3); } while (!Number.isInteger(r * (x2 - x1)) || Math.abs(y1 + r * (x2 - x1)) > 5);
        const y2 = y1 + r * (x2 - x1);
        return {
          q: 'מה קצב ההשתנות של הפונקציה שבגרף? (אפשר לכתוב שבר, כמו 1/2)',
          type: 'number', answer: r,
          mount(el) {
            const brd = U.board(el, [-6, 6, 6, -6]);
            brd.create('functiongraph', [x => y1 + r * (x - x1)], { strokeColor: '#2f6fdb', strokeWidth: 3 });
            brd.create('point', [x1, y1], { name: `(${x1}, ${y1})`, color: '#e8702a', size: 3, fixed: true });
            brd.create('point', [x2, y2], { name: `(${x2}, ${y2})`, color: '#e8702a', size: 3, fixed: true });
          },
          hint: 'משתמשים בשתי הנקודות הכתומות: בכמה $y$ השתנה, חלקי בכמה $x$ השתנה.',
          steps: [`שינוי ב־$x$: $${x2} - ${p(x1)} = ${x2 - x1}$.`, `שינוי ב־$y$: $${y2} - ${p(y1)} = ${y2 - y1}$.`, `קצב: $\\frac{${y2 - y1}}{${x2 - x1}} = ${U.num(r)}$`],
        };
      } },
      { level: 3, gen() {
        const up = Math.random() < 0.5, r = U.R(2, 6), t = U.R(3, 9);
        const s = up ? U.R(0, 20) : r * t + U.R(5, 30), target = up ? s + r * t : s - r * t;
        return {
          q: up
            ? `בקבוצה כבר יש $${s}$ נקודות, והיא צוברת $${r}$ נקודות בכל דקה. אחרי כמה דקות יהיו לה $${target}$ נקודות?`
            : `במיכל יש $${s}$ ליטר. כל דקה יוצאים $${r}$ ליטר. אחרי כמה דקות יישארו $${target}$ ליטר?`,
          type: 'number', answer: t,
          hint: `כותבים משוואה: $${s} ${up ? '+' : '-'} ${r}x = ${target}$.`,
          steps: [`$${s} ${up ? '+' : '-'} ${r}x = ${target}$`, `$${r}x = ${up ? `${target} - ${s}` : `${s} - ${target}`} = ${r * t}$`, `$x = ${r * t} \\div ${r} = ${t}$ דקות.`],
        };
      } },
      { level: 3, gen() {
        const ra = U.R(1, 5), rb = U.R(1, 5), dxa = U.pick([1, 2]), dxb = dxa === 1 ? 2 : 1;
        const xa = [0, 1, 2].map(i => i * dxa), xb = [0, 1, 2].map(i => i * dxb);
        const ya = xa.map(x => 3 + ra * x), yb = xb.map(x => 1 + rb * x);
        return {
          q: `לשני שחקנים יש טבלאות (x = דקות, y = נקודות).<br>דן: ${tbl(xa, ya)} &nbsp; רון: ${tbl(xb, yb)}<br>למי קצב הקליעה גדול יותר?`,
          type: 'choice', choices: ['לדן', 'לרון', 'הקצבים שווים'], answer: ra > rb ? 0 : ra < rb ? 1 : 2,
          hint: 'מחשבים קצב לכל אחד בנפרד: שינוי ב־$y$ חלקי שינוי ב־$x$. שימו לב שהדקות לא קופצות באותו אופן.',
          steps: [`דן: $\\frac{${ya[1] - ya[0]}}{${dxa}} = ${ra}$ נקודות לדקה.`, `רון: $\\frac{${yb[1] - yb[0]}}{${dxb}} = ${rb}$ נקודות לדקה.`, ra > rb ? 'לדן קצב גדול יותר.' : ra < rb ? 'לרון קצב גדול יותר.' : 'הקצבים שווים.'],
        };
      } },
    ],

    summary: [
      'קצב השתנות = בכמה $y$ משתנה כאשר $x$ גדל ב־1.',
      'מחשבים: השינוי ב־$y$ חלקי השינוי ב־$x$ (זהירות כשה־$x$ קופץ ב־2 או יותר!).',
      'קצב חיובי ← עולה · שלילי ← יורדת · אפס ← קבועה.',
      'קצב קבוע ← הגרף קו ישר ← פונקציה קווית.',
      'כמות אחרי זמן: מה שהיה בהתחלה + קצב × זמן.',
    ],
  });
})();
