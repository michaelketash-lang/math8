/* יחידה: מבוא לפונקציות (פרק 2 בספר) */
(() => {
  const p = n => (n < 0 ? `(${n})` : `${n}`);
  /** טבלת ערכים בכתיב KaTeX */
  const tbl = (xs, ys) => `$\\begin{array}{c|${'c'.repeat(xs.length)}} x & ${xs.join(' & ')} \\\\ \\hline y & ${ys.join(' & ')} \\end{array}$`;
  /** פונקציה מקוטעת (קו שבור) דרך נקודות [[x,y],...] */
  const poly = pts => x => {
    for (let i = 1; i < pts.length; i++) {
      const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
      if (x <= x1) return y0 + (y1 - y0) * (x - x0) / (x1 - x0);
    }
    return pts[pts.length - 1][1];
  };
  const DIRS = ['עולה ↗', 'יורדת ↘', 'קבועה →'];
  const dirOf = d => (d > 0 ? 0 : d < 0 ? 1 : 2);
  /** שלושה קטעים: אחד עולה, אחד יורד, אחד קבוע, בסדר אקראי */
  const threePieces = () => {
    const xs = [0, U.R(2, 3), U.R(4, 5), U.R(7, 8)], dirs = U.shuffle([1, -1, 0]);
    let y = U.R(3, 4); const pts = [[0, y]]; // רק קטע עולה אחד ויורד אחד, אז y נשאר בין 0 ל־7
    dirs.forEach((d, i) => { y += d * U.R(2, 3); pts.push([xs[i + 1], y]); });
    return { pts, dirs };
  };

  registerChapter('functions', {
    intro: `
      <p><b>פונקציה</b> היא כלל שמתאים לכל מספר $x$ <b>מספר אחד בלבד</b> $y$. אפשר לחשוב עליה כמו מכונה: מכניסים $x$, יוצא $y$.</p>
      <div class="idea"><b>ארבע דרכים להציג את אותה פונקציה</b>
        <b>מילים:</b> "על כל סל מקבלים 2 נקודות". &nbsp;
        <b>נוסחה (ביטוי אלגברי):</b> $y = 2x$. &nbsp;
        <b>טבלה:</b> $x = 1, 2, 3$ ← $y = 2, 4, 6$. &nbsp;
        <b>גרף:</b> הנקודות $(1, 2), (2, 4), (3, 6)$ במערכת צירים.</div>
      <div class="idea"><b>זוג סדור</b>הנקודה $(3, 6)$ היא זוג סדור: קודם $x$ (ימינה/שמאלה), אחר כך $y$ (למעלה/למטה). הסדר חשוב! $(3, 6)$ ו־$(6, 3)$ הן נקודות שונות.</div>
      <div class="idea"><b>תחום הגדרה</b>כל ערכי ה־$x$ שמותר להציב. למשל, אם $x$ הוא זמן — הוא לא יכול להיות שלילי, אז $x \\ge 0$.</div>
      <div class="idea"><b>עולה, יורדת, קבועה</b>הולכים על הגרף משמאל לימין: מטפסים ← <b>עולה</b>, יורדים ← <b>יורדת</b>, הולכים ישר ← <b>קבועה</b>. פונקציה יכולה לעלות בתחום אחד ולרדת בתחום אחר.</div>
      <div class="note"><b>חיתוך עם הצירים</b><br>עם ציר ה־$y$: מציבים $x = 0$. &nbsp; עם ציר ה־$x$: מחפשים מתי $y = 0$.</div>`,

    example: {
      question: 'בבקבוק של שחקן יש 1000 מ״ל מים. בכל דקה הוא שותה 100 מ״ל. נסמן: $x$ = מספר הדקות, $y$ = כמות המים בבקבוק.<br>א. בנו טבלה. ב. כתבו נוסחה. ג. מה תחום ההגדרה? ד. האם הפונקציה עולה או יורדת? ה. איפה הגרף חותך את הצירים?',
      steps: [
        'טבלה: אחרי 0 דקות 1000, אחרי דקה 900, אחרי 2 דקות 800, אחרי 3 דקות 700.',
        'בכל דקה יורדים 100 מ״ל, לכן אחרי $x$ דקות ירדו $100x$. הנוסחה: $y = 1000 - 100x$.',
        'מתי הבקבוק נגמר? $1000 - 100x = 0$ ← $x = 10$ דקות.',
        'תחום ההגדרה: הזמן לא שלילי, ואחרי 10 דקות אין מים. לכן $0 \\le x \\le 10$.',
        'ככל שהזמן עובר — יש פחות מים. הפונקציה <b>יורדת</b> בכל התחום.',
        'חיתוך עם ציר ה־$y$: מציבים $x = 0$ ← $y = 1000$. הנקודה $(0, 1000)$.',
        'חיתוך עם ציר ה־$x$: מתי $y = 0$? מצאנו $x = 10$. הנקודה $(10, 0)$.',
      ],
    },

    tools: [
      {
        title: 'המכונה הסודית',
        desc: 'בתוך המכונה יש כלל סודי. הכניסו מספרים, ראו מה יוצא — כל זוג נכנס לטבלה ונהיה נקודה בגרף. כשאתם חושבים שגיליתם את הכלל, נחשו.',
        mount(el) {
          const RULES = [
            { tex: 'y = x + 3', f: x => x + 3 }, { tex: 'y = 2x', f: x => 2 * x }, { tex: 'y = 2x - 1', f: x => 2 * x - 1 },
            { tex: 'y = 5 - x', f: x => 5 - x }, { tex: 'y = x^2', f: x => x * x }, { tex: 'y = 3x + 1', f: x => 3 * x + 1 },
          ];
          el.insertAdjacentHTML('beforeend', `<div class="row ins" style="justify-content:center"></div><div class="readout tab"></div>
            <div class="readout">מה הכלל?</div><div class="choices gs"></div><div class="readout msg"></div>`);
          const ins = el.querySelector('.ins'); ins.dir = 'ltr'; const tab = el.querySelector('.tab'), gs = el.querySelector('.gs'), msg = el.querySelector('.msg');
          const brd = U.board(el, [-4, 11, 5, -6]);
          let rule, seen, pts = [];
          const fresh = () => {
            rule = U.pick(RULES.filter(r => r !== rule)); seen = new Map();
            pts.forEach(q => brd.removeObject(q)); pts = [];
            tab.textContent = 'הכניסו מספר כדי להתחיל ←'; msg.textContent = '';
            const opts = U.shuffle([rule, ...U.shuffle(RULES.filter(r => r !== rule)).slice(0, 3)]);
            gs.innerHTML = opts.map((r, i) => `<button class="choice" data-i="${i}">$${r.tex}$</button>`).join('');
            gs.querySelectorAll('.choice').forEach(b => b.onclick = () => {
              if (opts[+b.dataset.i] === rule) {
                b.classList.add('right'); msg.innerHTML = '🏀 סל! גילית את הכלל. <button class="btn">מכונה חדשה</button>';
                msg.querySelector('button').onclick = fresh;
              } else { b.classList.add('wrong'); msg.textContent = 'לא זה. בדקו את הכלל על אחת השורות בטבלה.'; }
            });
            U.math(gs);
          };
          for (const x of [-2, -1, 0, 1, 2, 3]) {
            const b = document.createElement('button'); b.className = 'btn ghost'; b.dir = 'ltr'; b.textContent = `x = ${U.num(x)}`;
            b.onclick = () => {
              const y = rule.f(x);
              if (!seen.has(x)) { seen.set(x, y); pts.push(brd.create('point', [x, y], { name: `(${x}, ${y})`, color: '#e8702a', size: 4, fixed: true, label: { fontSize: 12 } })); }
              const xs = [...seen.keys()].sort((a, c) => a - c);
              tab.innerHTML = tbl(xs, xs.map(v => seen.get(v))); U.math(tab);
            };
            ins.appendChild(b);
          }
          fresh();
        },
      },
      {
        title: 'הולכים על הגרף',
        desc: 'הגרף מראה את גובה הכדור (במטרים) לאורך 8 שניות של תרגיל. הזיזו את הסליידר כדי ללכת על הגרף משמאל לימין.',
        mount(el) {
          const pts = [[0, 1], [2, 5], [4, 5], [6, 2], [7, 2], [8, 0]], f = poly(pts);
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = U.board(el, [-1, 7, 9, -1]);
          const COL = ['#1f9d55', '#d64545', '#8a8f99'];
          for (let i = 1; i < pts.length; i++) {
            const d = dirOf(pts[i][1] - pts[i - 1][1]);
            brd.create('segment', [pts[i - 1], pts[i]], { strokeColor: COL[d], strokeWidth: 5, fixed: true });
          }
          brd.create('point', [0, 1], { name: '(0, 1)', color: '#2f6fdb', size: 4, fixed: true, label: { offset: [8, 12] } });
          brd.create('point', [8, 0], { name: '(8, 0)', color: '#2f6fdb', size: 4, fixed: true, label: { offset: [-30, 14] } });
          let x = 0;
          brd.create('point', [() => x, () => f(x)], { name: '', color: '#e8702a', size: 7, fixed: true });
          el.insertAdjacentHTML('beforeend', '<p class="muted">ירוק = עולה · אדום = יורדת · אפור = קבועה. תחום ההגדרה: $0 \\le x \\le 8$. הנקודות הכחולות: חיתוך עם ציר ה־y ועם ציר ה־x.</p>');
          U.slider(el, { label: 'זמן x', min: 0, max: 8, step: 0.5, value: 0, onInput: v => {
            x = v; brd.update();
            let i = pts.findIndex(q => q[0] > x); if (i < 0) i = pts.length - 1; if (i === 0) i = 1;
            const d = dirOf(pts[i][1] - pts[i - 1][1]);
            out.innerHTML = `הנקודה $(${U.num(x)}, ${U.num(f(x))})$ &nbsp;·&nbsp; בתחום $${pts[i - 1][0]} < x < ${pts[i][0]}$ הפונקציה <b style="color:${COL[d]}">${DIRS[d]}</b>`;
            U.math(out);
          } });
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        const sq = Math.random() < 0.3, a = U.R(2, 5), b = U.RNZ(-5, 9), x = sq ? U.R(-3, 4) : U.R(0, 6);
        const tex = sq ? `y = x^2 ${U.sgn(b)}` : `y = ${U.lin(a, b)}`, y = sq ? x * x + b : a * x + b;
        return {
          q: `נתונה הפונקציה $${tex}$. מה הערך של $y$ כאשר $x = ${x}$?`,
          type: 'number', answer: y,
          mistakes: sq
            ? [{ v: 2 * x + b, why: `$${p(x)}^2$ פירושו $${p(x)} \\cdot ${p(x)}$, לא $${p(x)} \\cdot 2$.` }, { v: x < 0 ? -x * x + b : y, why: `בדוק את הסימן של $${p(x)}^2$: מספר שלילי כפול מספר שלילי.` }]
            : [{ v: a + x + b, why: `$${a}x$ פירושו $${a}$ כפול $x$, לא $${a}$ ועוד $x$.` }, { v: +`${a}${x}` + b, why: `$${a}x$ כאשר $x = ${x}$ זה לא המספר $${a}${x}$. בין $${a}$ ל־$x$ יש כפל.` }, { v: a * x, why: `חישבת את $${a} \\cdot ${x}$, אבל הנוסחה לא נגמרת שם. מה כתוב אחרי $${a}x$?` }],
          hint: `מציבים $${x}$ במקום כל $x$ בנוסחה ומחשבים.`,
          steps: sq
            ? [`מציבים: $y = ${p(x)}^2 ${U.sgn(b)}$`, `$${p(x)}^2 = ${x * x}$`, `$y = ${x * x} ${U.sgn(b)} = ${y}$`]
            : [`מציבים: $y = ${a} \\cdot ${x} ${U.sgn(b)}$`, `$${a} \\cdot ${x} = ${a * x}$`, `$y = ${a * x} ${U.sgn(b)} = ${y}$`],
        };
      } },
      { level: 1, gen() {
        const { pts } = threePieces(), k = U.pick(pts);
        return {
          q: `לפי הגרף, מה הערך של $y$ כאשר $x = ${k[0]}$?`,
          type: 'number', answer: k[1],
          mount(el) {
            const brd = U.board(el, [-1, 8, 9, -1]);
            for (let i = 1; i < pts.length; i++) brd.create('segment', [pts[i - 1], pts[i]], { strokeColor: '#2f6fdb', strokeWidth: 3, fixed: true });
            pts.forEach(q => brd.create('point', q, { name: '', color: '#e8702a', size: 3, fixed: true }));
          },
          hint: `מוצאים את $${k[0]}$ על ציר ה־$x$, עולים ישר עד הגרף, ומשם הולכים שמאלה לציר ה־$y$.`,
          steps: [`מ־$x = ${k[0]}$ עולים לגרף ומגיעים לנקודה $(${k[0]}, ${k[1]})$.`, `לכן $y = ${k[1]}$.`],
        };
      } },
      { level: 1, gen() {
        const a = U.R(1, 4), b = U.R(-3, 6), xs = [0, 1, 2, 3, 4], ys = xs.map(x => a * x + b), i = U.R(0, 4), askY = Math.random() < 0.5;
        return {
          q: `לפי הטבלה: ${tbl(xs, ys)}<br>${askY ? `מה הערך של $y$ כאשר $x = ${xs[i]}$?` : `עבור איזה $x$ מתקיים $y = ${ys[i]}$?`}`,
          type: 'number', answer: askY ? ys[i] : xs[i],
          mistakes: (askY ? ys : xs).includes(askY ? xs[i] : ys[i])
            ? [{ v: askY ? xs[ys.indexOf(xs[i])] : ys[xs.indexOf(ys[i])], why: askY ? `חיפשת את $${xs[i]}$ בשורה של $y$? ה־$x$ נמצא בשורה העליונה.` : `חיפשת את $${ys[i]}$ בשורה של $x$? ה־$y$ נמצא בשורה התחתונה.` }] : [],
          hint: askY ? `מחפשים בשורה העליונה את $${xs[i]}$, והתשובה מתחתיו.` : `מחפשים בשורה התחתונה את $${ys[i]}$, והתשובה מעליו.`,
          steps: [`בעמודה של $x = ${xs[i]}$ כתוב $y = ${ys[i]}$.`, `התשובה: $${askY ? ys[i] : xs[i]}$.`],
        };
      } },
      { level: 1, gen() {
        const d = U.pick([1, -1, 0]), start = U.R(3, 9), step = U.R(1, 3), xs = [1, 2, 3, 4];
        const ys = xs.map((_, i) => start + d * step * i);
        return {
          q: `לפי הטבלה ${tbl(xs, ys)} — הפונקציה...`,
          type: 'choice', choices: DIRS, answer: dirOf(d),
          mistakes: d ? [{ v: d > 0 ? 1 : 0, why: 'קוראים את הטבלה משמאל לימין, בכיוון שבו $x$ גדל ($1, 2, 3, 4$), ולא מימין לשמאל כמו בעברית.' }] : [],
          hint: 'כש־$x$ גדל (הולכים ימינה בטבלה), מה קורה ל־$y$? גדל, קטן או נשאר אותו דבר?',
          steps: [`$x$ גדל: $1, 2, 3, 4$. ו־$y$: $${ys.join(', ')}$.`, d > 0 ? '$y$ גדל ← הפונקציה <b>עולה</b>.' : d < 0 ? '$y$ קטן ← הפונקציה <b>יורדת</b>.' : '$y$ לא משתנה ← הפונקציה <b>קבועה</b>.'],
        };
      } },
      { level: 2, gen() {
        const sq = Math.random() < 0.3, a = U.RNZ(-4, 5), b = U.RNZ(-8, 8);
        const tex = sq ? `y = x^2 ${U.sgn(b)}` : `y = ${U.lin(a, b)}`;
        return {
          q: `באיזו נקודה הגרף של $${tex}$ חותך את ציר ה־$y$?`,
          type: 'pair', answer: [0, b],
          mistakes: sq ? [] : [{ v: [-b / a, 0], why: 'זו נקודת החיתוך עם ציר ה־$x$ (שם $y = 0$). שאלו על ציר ה־$y$.' }, { v: [0, a], why: `$${a}$ הוא המספר שכופל את $x$. מה קורה לו כשמציבים $x = 0$?` }],
          hint: 'על ציר ה־$y$ תמיד $x = 0$. מציבים $x = 0$ בנוסחה.',
          steps: [`מציבים $x = 0$: $y = ${sq ? '0^2' : `${a} \\cdot 0`} ${U.sgn(b)} = ${b}$`, `נקודת החיתוך: $(0, ${b})$.`],
        };
      } },
      { level: 2, gen() {
        const a = U.R(1, 4), b = U.R(-3, 5), xs = [1, 2, 3, 4], ys = xs.map(x => a * x + b);
        const cands = [[a, b]];
        for (const [m, c] of U.shuffle([[a + 1, b - 1], [a - 1, b + 1], [a, b + 1], [a + 2, b - 2], [a, b - 1]]))
          if (cands.length < 4 && !cands.some(([m2, c2]) => m2 === m && c2 === c)) cands.push([m, c]);
        const opts = U.shuffle(cands);
        const show = ([m, c]) => (m === 0 ? `y = ${c}` : `y = ${U.lin(m, c)}`);
        return {
          q: `איזה כלל מתאים לטבלה? ${tbl(xs, ys)}`,
          type: 'choice', choices: opts.map(o => `$${show(o)}$`), answer: opts.findIndex(o => o[0] === a && o[1] === b),
          mistakes: opts.map((o, i) => ({ v: i, why: 'הכלל הזה מתאים רק לעמודה הראשונה. בדוק אותו גם על $x = 2$.' })).filter(k => opts[k.v][0] + opts[k.v][1] === a + b),
          hint: 'בודקים כל כלל על <b>כמה</b> עמודות, לא רק על הראשונה. כלל נכון חייב להתאים לכולן.',
          steps: [`בודקים $${show([a, b])}$: ${xs.map((x, i) => `$x = ${x}$ ← $${ys[i]}$`).join(', ')} ✔`, 'כל העמודות מתאימות, ולכן זה הכלל. (שאר הכללים נכשלים לפחות בעמודה אחת.)'],
        };
      } },
      { level: 2, gen() {
        const { pts, dirs } = threePieces(), want = U.R(0, 2), target = [1, -1, 0][want];
        const k = dirs.indexOf(target);
        const intervals = [0, 1, 2].map(i => `$${pts[i][0]} < x < ${pts[i + 1][0]}$`);
        return {
          q: `באיזה תחום הפונקציה שבגרף <b>${DIRS[want]}</b>?`,
          type: 'choice', choices: intervals, answer: k,
          mount(el) {
            const brd = U.board(el, [-1, 8, 9, -1]);
            for (let i = 1; i < pts.length; i++) brd.create('segment', [pts[i - 1], pts[i]], { strokeColor: '#2f6fdb', strokeWidth: 3, fixed: true });
            pts.forEach(q => brd.create('point', q, { name: '', color: '#e8702a', size: 3, fixed: true }));
          },
          mistakes: target ? [{ v: dirs.indexOf(-target), why: 'הולכים על הגרף משמאל לימין, בכיוון שבו $x$ גדל, ולא מימין לשמאל כמו בעברית.' }] : [],
          hint: 'הולכים על הגרף משמאל לימין. בכל קטע שואלים: מטפסים, יורדים או הולכים ישר?',
          steps: [`בקטע $${pts[k][0]} < x < ${pts[k + 1][0]}$ ה־$y$ עובר מ־$${pts[k][1]}$ ל־$${pts[k + 1][1]}$.`, `לכן שם הפונקציה ${DIRS[want]}.`],
        };
      } },
      { level: 2, gen() {
        const isF = Math.random() < 0.5, xs = U.shuffle([1, 2, 3, 4, 5, 6]).slice(0, 4).sort((a, b) => a - b);
        const ys = xs.map(() => U.R(0, 9));
        let shownX = xs, shownY = ys, rep;
        if (!isF) { rep = U.R(0, 2); shownX = [...xs.slice(0, 3), xs[rep]]; shownY = [...ys.slice(0, 3), (ys[rep] + U.R(1, 5)) % 10]; }
        return {
          q: `האם הטבלה ${tbl(shownX, shownY)} מתארת פונקציה?`,
          type: 'choice', choices: ['כן', 'לא'], answer: isF ? 0 : 1,
          mistakes: isF
            ? (new Set(ys).size < 4 ? [{ v: 1, why: 'מותר שלשני ערכי $x$ שונים יהיה אותו $y$. הבעיה היא רק כשאותו $x$ מופיע עם שני ערכי $y$ שונים.' }] : [])
            : [{ v: 0, why: 'עבור על השורה של $x$: יש שם מספר שמופיע פעמיים?' }],
          hint: 'בפונקציה לכל $x$ יש $y$ <b>אחד בלבד</b>. בודקים אם אותו $x$ מופיע פעמיים עם $y$ שונה.',
          steps: isF
            ? ['כל ערך של $x$ מופיע פעם אחת בלבד.', 'לכל $x$ יש $y$ אחד ← <b>כן</b>, זו פונקציה.']
            : [`$x = ${xs[rep]}$ מופיע פעמיים: פעם עם $y = ${shownY[rep]}$ ופעם עם $y = ${shownY[3]}$.`, 'ל־$x$ אחד יש שני ערכים של $y$ ← <b>לא</b>, זו לא פונקציה.'],
        };
      } },
      { level: 3, gen() {
        const r = U.RNZ(-5, 6), a = U.pick([1, 2, 3, -1, -2]), b = -a * r;
        return {
          q: `באיזו נקודה הגרף של $y = ${U.lin(a, b)}$ חותך את ציר ה־$x$?`,
          type: 'pair', answer: [r, 0],
          mistakes: [{ v: [0, b], why: 'זו נקודת החיתוך עם ציר ה־$y$ (שם $x = 0$). שאלו על ציר ה־$x$.' }, { v: [-r, 0], why: `בדוק את הסימנים בפתרון המשוואה $${U.lin(a, b)} = 0$.` }],
          hint: 'על ציר ה־$x$ תמיד $y = 0$. כותבים משוואה: הנוסחה שווה ל־$0$, ופותרים.',
          steps: [`$${U.lin(a, b)} = 0$`, `${b > 0 ? 'מחסירים' : 'מוסיפים'} $${Math.abs(b)}$: $${U.term(a)} = ${-b}$`, `מחלקים ב־$${p(a)}$: $x = ${r}$`, `נקודת החיתוך: $(${r}, 0)$.`],
        };
      } },
      { level: 3, gen() {
        const k = U.pick([50, 100, 200]), t = U.R(4, 12), N = k * t;
        const opts = [`$0 \\le x \\le ${t}$`, `$0 \\le x \\le ${N}$`, `$x \\ge 0$ (כל מספר לא שלילי)`, 'כל המספרים'];
        const order = U.shuffle([0, 1, 2, 3]);
        return {
          q: `במיכל יש $${N}$ ליטר מים. כל דקה יוצאים ממנו $${k}$ ליטר, עד שהוא מתרוקן. $x$ = מספר הדקות. מה תחום ההגדרה של הפונקציה?`,
          type: 'choice', choices: order.map(i => opts[i]), answer: order.indexOf(0),
          mistakes: [{ v: order.indexOf(1), why: `$${N}$ הוא מספר הליטרים. $x$ סופר דקות, לא ליטרים.` }, { v: order.indexOf(2), why: 'המיכל מתרוקן בסוף. מה קורה אחרי שהוא ריק?' }, { v: order.indexOf(3), why: 'האם מספר הדקות יכול להיות שלילי?' }],
          hint: 'שתי שאלות: מאיזה זמן מתחילים? ואחרי כמה דקות המיכל ריק?',
          steps: ['מתחילים בזמן $x = 0$ (זמן לא יכול להיות שלילי).', `המיכל מתרוקן אחרי $${N} \\div ${k} = ${t}$ דקות.`, `לכן תחום ההגדרה: $0 \\le x \\le ${t}$.`],
        };
      } },
      { level: 3, gen() {
        const c = U.R(-6, 6), x = U.RNZ(-4, 4), on = Math.random() < 0.5;
        const trap = !on && Math.random() < 0.6; // טעות נפוצה: (−3)² = −9
        const y = on ? x * x + c : trap && x < 0 ? -x * x + c : x * x + c + U.pick([-2, -1, 1, 2]);
        const fy = x * x + c;
        return {
          q: `האם הנקודה $(${x}, ${y})$ נמצאת על הגרף של $y = x^2 ${c ? U.sgn(c) : ''}$?`,
          type: 'choice', choices: ['כן', 'לא'], answer: y === fy ? 0 : 1,
          mistakes: x < 0 && y !== fy && y === -x * x + c ? [{ v: 0, why: `בדוק את $${p(x)}^2$: זה $${p(x)} \\cdot ${p(x)}$. מה הסימן של התוצאה?` }] : [],
          hint: `מציבים $x = ${x}$ ובודקים אם יוצא $${y}$. זהירות: מספר שלילי בריבוע יוצא חיובי!`,
          steps: [`מציבים: $y = ${p(x)}^2 ${c ? U.sgn(c) : ''} = ${x * x} ${c ? U.sgn(c) : ''} = ${fy}$`, y === fy ? `יצא $${fy}$ ← <b>כן</b>, הנקודה על הגרף.` : `יצא $${fy}$ ולא $${y}$ ← <b>לא</b>.`],
        };
      } },
    ],

    summary: [
      'פונקציה: לכל $x$ מתאים $y$ <b>אחד בלבד</b>.',
      'אותה פונקציה אפשר להציג במילים, בנוסחה, בטבלה ובגרף.',
      'זוג סדור $(x, y)$: קודם $x$, אחר כך $y$.',
      'תחום הגדרה = אילו ערכי $x$ מותר להציב (למשל זמן ≥ 0).',
      'משמאל לימין: מטפסים ← עולה, יורדים ← יורדת, ישר ← קבועה.',
      'חיתוך עם ציר ה־$y$: מציבים $x = 0$. חיתוך עם ציר ה־$x$: פותרים $y = 0$.',
    ],
  });
})();
