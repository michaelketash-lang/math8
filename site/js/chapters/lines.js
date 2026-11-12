/* יחידה: ישרים מקבילים לצירים וחיתוך ישרים (פרקים 9–10 בספר) */
(() => {
  const par = n => (n < 0 ? `(${n})` : `${n}`);
  const nm = n => U.num(n).replace('−', '-'); // מספר לתוך TeX
  /** שני ישרים y=m1x+b1, y=m2x+b2: צעדי פתרון אלגבריים עד נקודת החיתוך (x0,y0) */
  const solveSteps = (m1, b1, m2, b2, x0, y0) => [
    `בנקודת החיתוך ה־$y$ של שני הישרים שווה. משווים: $${U.lin(m1, b1)} = ${U.lin(m2, b2)}$`,
    `מעבירים את ה־$x$־ים שמאלה ואת המספרים ימינה: $${U.term(m1 - m2)} = ${b2 - b1}$`,
    m1 - m2 === 1 ? `כלומר $x = ${x0}$.` : `מחלקים ב־$${par(m1 - m2)}$: $x = ${x0}$`,
    `מציבים $x = ${x0}$ בישר הראשון: $y = ${m1} \\cdot ${par(x0)} ${U.sgn(b1)} = ${y0}$`,
    `נקודת החיתוך: $(${x0}, ${y0})$. (בדיקה בישר השני: $${m2} \\cdot ${par(x0)} ${U.sgn(b2)} = ${y0}$ ✔)`,
  ];

  registerChapter('lines', {
    intro: `
      <div class="idea"><b>ישר מקביל לציר ה־x: $y = k$</b>ישר <b>שטוח</b> (אופקי). לכל הנקודות שלו אותו $y$.
        <br>למשל $y = 3$ עובר דרך $(-2, 3)$, $(0, 3)$, $(5, 3)$. השיפוע שלו 0. ציר ה־x עצמו הוא $y = 0$.</div>
      <div class="idea"><b>ישר מקביל לציר ה־y: $x = k$</b>ישר <b>עומד</b> (אנכי). לכל הנקודות שלו אותו $x$.
        <br>למשל $x = 4$ עובר דרך $(4, -1)$, $(4, 0)$, $(4, 6)$. אין לו שיפוע, והוא לא פונקציה. ציר ה־y עצמו הוא $x = 0$.</div>
      <div class="note"><b>אורכים על ישרים כאלה</b><br>שתי נקודות עם אותו $y$ ← מחסירים את ה־$x$־ים: מ־$(1, 3)$ עד $(6, 3)$ האורך $6 - 1 = 5$.
        <br>שתי נקודות עם אותו $x$ ← מחסירים את ה־$y$־ים. תמיד הגדול פחות הקטן, כי אורך חיובי.</div>
      <div class="idea"><b>נקודת החיתוך של שני ישרים</b>זו הנקודה שנמצאת על <b>שניהם</b>. שם ה־$y$ שלהם שווה, אז:
        <br>1. משווים: $2x - 1 = -x + 5$ ← $3x = 6$ ← $x = 2$.
        <br>2. מציבים בחזרה: $y = 2 \\cdot 2 - 1 = 3$. נקודת החיתוך: $(2, 3)$.
        <br>בגרף: מציירים את שני הישרים ומסתכלים איפה הם נפגשים.</div>
      <div class="note"><b>בחיים</b><br>שני ישרים יכולים לתאר שתי קבוצות במשחק, שני מסלולי תשלום או שני רצים. נקודת החיתוך היא הרגע שבו הם <b>שווים</b> (תיקו!). אם לשני הישרים אותו שיפוע — הם מקבילים ולא נפגשים אף פעם.</div>`,

    example: {
      question: 'מצאו את נקודת החיתוך של הישרים $y = 2x - 1$ ו־$y = -x + 5$.',
      steps: [
        'בנקודת החיתוך שני הישרים עוברים באותה נקודה, אז ה־$y$ שלהם שווה. משווים: $2x - 1 = -x + 5$.',
        'מוסיפים $x$ לשני האגפים (כדי שכל ה־$x$־ים יהיו בצד אחד): $3x - 1 = 5$.',
        'מוסיפים 1 לשני האגפים: $3x = 6$.',
        'מחלקים ב־3: $x = 2$. זה רק חצי מהתשובה — נקודה צריכה גם $y$!',
        'מציבים $x = 2$ באחד הישרים: $y = 2 \\cdot 2 - 1 = 3$.',
        'בדיקה בישר השני: $y = -2 + 5 = 3$ ✔ — אותו $y$, אז באמת זו נקודה משותפת.',
        'נקודת החיתוך: $(2, 3)$. בכלי "חיתוך שני ישרים" למטה אפשר לראות את זה בגרף.',
      ],
    },

    tools: [
      {
        title: 'מלבן מהצירים',
        desc: 'הזיזו את הישר האנכי $x = a$ ואת הישר האופקי $y = c$. יחד עם הצירים הם יוצרים מלבן. בדקו איך מחשבים היקף ושטח.',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const st = { a: 4, c: 3 };
          const brd = U.board(el, [-8, 8, 8, -8]);
          const P = (fx, fy) => brd.create('point', [fx, fy], { visible: false });
          brd.create('line', [P(() => st.a, 0), P(() => st.a, 1)], { strokeColor: '#2f6fdb', strokeWidth: 3 });
          brd.create('line', [P(0, () => st.c), P(1, () => st.c)], { strokeColor: '#e8702a', strokeWidth: 3 });
          brd.create('polygon', [P(0, 0), P(() => st.a, 0), P(() => st.a, () => st.c), P(0, () => st.c)],
            { fillColor: '#1f9d55', fillOpacity: 0.25, borders: { strokeWidth: 0 }, vertices: { visible: false } });
          brd.create('point', [() => st.a, () => st.c], { name: '', color: '#1d2433', size: 4, fixed: true });
          const upd = () => {
            brd.update();
            const w = Math.abs(st.a), h = Math.abs(st.c);
            out.innerHTML = `<span style="color:#2f6fdb">$x = ${st.a}$</span> &nbsp; <span style="color:#e8702a">$y = ${st.c}$</span> &nbsp; נחתכים ב־$(${st.a}, ${st.c})$<br>
              צלעות: ${w} ו־${h} &nbsp;·&nbsp; היקף $= 2 \\cdot (${w} + ${h}) = ${2 * (w + h)}$ &nbsp;·&nbsp; שטח $= ${w} \\cdot ${h} = ${w * h}$`;
            U.math(out);
          };
          U.slider(el, { label: 'x = a', min: -7, max: 7, value: st.a, onInput: v => { st.a = v; upd(); } });
          U.slider(el, { label: 'y = c', min: -7, max: 7, value: st.c, onInput: v => { st.c = v; upd(); } });
        },
      },
      {
        title: 'חיתוך שני ישרים',
        desc: 'שנו את שני הישרים. הנקודה השחורה היא נקודת החיתוך, ולמטה רואים איך מוצאים אותה בחשבון. מה קורה כששני השיפועים שווים?',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const st = { m1: 2, b1: -1, m2: -1, b2: 5 };
          const brd = U.board(el, [-10, 10, 10, -10]);
          const X = () => (st.b2 - st.b1) / (st.m1 - st.m2);
          brd.create('functiongraph', [x => st.m1 * x + st.b1], { strokeColor: '#2f6fdb', strokeWidth: 3 });
          brd.create('functiongraph', [x => st.m2 * x + st.b2], { strokeColor: '#e8702a', strokeWidth: 3 });
          brd.create('point', [() => (st.m1 === st.m2 ? 0 : X()), () => (st.m1 === st.m2 ? 0 : st.m1 * X() + st.b1)],
            { name: '', color: '#1d2433', size: 5, fixed: true, visible: () => st.m1 !== st.m2 });
          const upd = () => {
            brd.update();
            const l1 = `<span style="color:#2f6fdb">$y = ${U.lin(st.m1, st.b1)}$</span>`, l2 = `<span style="color:#e8702a">$y = ${U.lin(st.m2, st.b2)}$</span>`;
            if (st.m1 === st.m2) {
              out.innerHTML = `${l1} &nbsp; ${l2}<br>` + (st.b1 === st.b2 ? 'זה אותו ישר בדיוק! כל נקודה עליו משותפת.' : 'אותו שיפוע ← הישרים <b>מקבילים</b> ולא נפגשים אף פעם.');
            } else {
              const x = X(), y = st.m1 * x + st.b1;
              out.innerHTML = `${l1} &nbsp; ${l2}<br>$${U.lin(st.m1, st.b1)} = ${U.lin(st.m2, st.b2)}$ ← $${U.num(st.m1 - st.m2).replace('−', '-')}x = ${st.b2 - st.b1}$ ← $x = ${nm(x)}$, $y = ${nm(y)}$`;
            }
            U.math(out);
          };
          U.slider(el, { label: 'שיפוע כחול', min: -3, max: 3, step: 0.5, value: st.m1, onInput: v => { st.m1 = v; upd(); } });
          U.slider(el, { label: 'חיתוך כחול', min: -8, max: 8, value: st.b1, onInput: v => { st.b1 = v; upd(); } });
          U.slider(el, { label: 'שיפוע כתום', min: -3, max: 3, step: 0.5, value: st.m2, onInput: v => { st.m2 = v; upd(); } });
          U.slider(el, { label: 'חיתוך כתום', min: -8, max: 8, value: st.b2, onInput: v => { st.b2 = v; upd(); } });
        },
      },
      {
        title: 'מי מוביל? שאלה מהחיים',
        desc: 'שתי קבוצות במשחק. כל ישר מראה את הנקודות של קבוצה לפי הדקה. הזיזו את הזמן — מתי יש תיקו?',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          let A, B, t = 0;
          const fresh = () => {
            const rA = U.R(1, 2), rB = rA + U.R(1, 2), tie = U.R(3, 8), sB = U.R(0, 6);
            A = { s: sB + (rB - rA) * tie, r: rA }; B = { s: sB, r: rB };
          };
          fresh();
          const brd = U.board(el, [-1, 50, 11, -4]);
          brd.create('functiongraph', [x => A.s + A.r * x, 0, 10], { strokeColor: '#2f6fdb', strokeWidth: 3 });
          brd.create('functiongraph', [x => B.s + B.r * x, 0, 10], { strokeColor: '#e8702a', strokeWidth: 3 });
          const P = (fx, fy) => brd.create('point', [fx, fy], { visible: false });
          brd.create('segment', [P(() => t, 0), P(() => t, 50)], { strokeColor: '#888', dash: 2 });
          brd.create('point', [() => t, () => A.s + A.r * t], { name: '', color: '#2f6fdb', size: 4, fixed: true });
          brd.create('point', [() => t, () => B.s + B.r * t], { name: '', color: '#e8702a', size: 4, fixed: true });
          const upd = () => {
            brd.update();
            const a = A.s + A.r * t, b = B.s + B.r * t;
            out.innerHTML = `<span style="color:#2f6fdb">כחולים: $y = ${U.lin(A.r, A.s)}$</span> &nbsp; <span style="color:#e8702a">כתומים: $y = ${U.lin(B.r, B.s)}$</span><br>
              דקה ${t}: כחולים ${a}, כתומים ${b} ← ${a > b ? 'הכחולים מובילים' : a < b ? 'הכתומים מובילים' : '<b>תיקו!</b> זו נקודת החיתוך 🏀'}`;
            U.math(out);
          };
          const sl = U.slider(el, { label: 'דקה', min: 0, max: 10, value: 0, onInput: v => { t = v; upd(); } });
          const btn = document.createElement('button'); btn.className = 'btn ghost'; btn.textContent = 'משחק חדש';
          btn.onclick = () => { fresh(); t = 0; sl.value = 0; sl.dispatchEvent(new Event('input')); };
          el.appendChild(btn);
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        let a, c; do { a = U.RNZ(-6, 6); c = U.RNZ(-6, 6); } while (Math.abs(a) === Math.abs(c));
        const toX = Math.random() < 0.5;
        const choices = U.shuffle([`$y = ${c}$`, `$x = ${a}$`, `$y = ${a}$`, `$x = ${c}$`]);
        const right = toX ? `$y = ${c}$` : `$x = ${a}$`;
        return {
          q: `ישר מקביל לציר ה־${toX ? 'x' : 'y'} ועובר דרך הנקודה $(${a}, ${c})$. מה המשוואה שלו?`,
          type: 'choice', choices, answer: choices.indexOf(right),
          mistakes: [{ v: choices.indexOf(toX ? `$x = ${a}$` : `$y = ${c}$`), why: toX ? `לכל הנקודות על $x = ${a}$ יש אותו $x$. ישר כזה שטוח או עומד?` : `לכל הנקודות על $y = ${c}$ יש אותו $y$. ישר כזה שטוח או עומד?` },
            { v: choices.indexOf(toX ? `$y = ${a}$` : `$x = ${c}$`), why: toX ? `בדוק שוב: $${a}$ הוא ה־$x$ של הנקודה או ה־$y$ שלה?` : `בדוק שוב: $${c}$ הוא ה־$x$ של הנקודה או ה־$y$ שלה?` }],
          hint: toX ? 'ישר מקביל לציר ה־x הוא שטוח: לכל הנקודות שלו אותו $y$.' : 'ישר מקביל לציר ה־y עומד: לכל הנקודות שלו אותו $x$.',
          steps: [toX ? `ישר שטוח ← $y$ קבוע.` : `ישר עומד ← $x$ קבוע.`, toX ? `ה־$y$ של הנקודה הוא $${c}$.` : `ה־$x$ של הנקודה הוא $${a}$.`, `המשוואה: ${right}.`],
        };
      } },
      { level: 1, gen() {
        const a = U.R(-7, 7), c = U.R(-7, 7);
        return {
          q: `באיזו נקודה נחתכים הישרים $x = ${a}$ ו־$y = ${c}$?`,
          type: 'pair', answer: [a, c],
          hint: 'בנקודת החיתוך שני התנאים מתקיימים יחד: גם $x$ וגם $y$ ידועים.',
          steps: [`על הישר $x = ${a}$ לכל הנקודות $x = ${a}$.`, `על הישר $y = ${c}$ לכל הנקודות $y = ${c}$.`, `הנקודה המשותפת: $(${a}, ${c})$.`],
        };
      } },
      { level: 1, gen() {
        const k = U.pick([-5, -4, -3, -2, 2, 3, 4, 5]), toY = Math.random() < 0.5;
        const opts = [`$x = ${k}$`, `$y = ${k}$`, `$y = ${k}x$`, `$y = x ${U.sgn(k)}$`];
        const choices = U.shuffle(opts), right = toY ? opts[0] : opts[1];
        return {
          q: `איזה מהישרים מקביל לציר ה־${toY ? 'y' : 'x'}?`,
          type: 'choice', choices, answer: choices.indexOf(right),
          mistakes: [{ v: choices.indexOf(toY ? opts[1] : opts[0]), why: toY ? `ב־$y = ${k}$ לכל הנקודות אותו גובה. ישר כזה עומד או שטוח?` : `ב־$x = ${k}$ לכל הנקודות אותו $x$. ישר כזה עומד או שטוח?` },
            { v: choices.indexOf(opts[2]), why: 'במשוואה הזאת יש גם $x$ וגם $y$, ולכן הישר משופע ולא מקביל לאף ציר.' }, { v: choices.indexOf(opts[3]), why: 'במשוואה הזאת יש גם $x$ וגם $y$, ולכן הישר משופע ולא מקביל לאף ציר.' }],
          hint: toY ? 'מקביל לציר ה־y = ישר עומד, ובמשוואה שלו יש רק $x$ (בלי $y$).' : 'מקביל לציר ה־x = ישר שטוח, ובמשוואה שלו $y$ שווה למספר (בלי $x$).',
          steps: [toY ? 'ישר עומד: $x = $ מספר.' : 'ישר שטוח: $y = $ מספר (שיפוע 0).', `התשובה: ${right}.`],
        };
      } },
      { level: 1, gen() {
        const k = U.R(-5, 5), p = U.R(-6, 4), q = p + U.R(1, 8), horiz = Math.random() < 0.5;
        const A = horiz ? `(${p}, ${k})` : `(${k}, ${p})`, B = horiz ? `(${q}, ${k})` : `(${k}, ${q})`;
        return {
          q: `מה האורך של הקטע בין הנקודות $${A}$ ו־$${B}$?`,
          type: 'number', answer: q - p,
          mistakes: [{ v: p < 0 ? q + p : q - p, why: `בדוק את $${q} - ${par(p)}$: חיסור של מספר שלילי הופך לחיבור.` }, { v: p - q, why: 'אורך לא יכול להיות שלילי. מחסירים: הגדול פחות הקטן.' }, { v: q - p + 1, why: 'ספרת נקודות? אורך הוא מספר הצעדים מנקודה לנקודה.' }],
          hint: horiz ? 'לשתי הנקודות אותו $y$ — הקטע שטוח. מחסירים את ה־$x$־ים: הגדול פחות הקטן.' : 'לשתי הנקודות אותו $x$ — הקטע עומד. מחסירים את ה־$y$־ים: הגדול פחות הקטן.',
          steps: [horiz ? `אותו $y = ${k}$ ← קטע אופקי. משווים את ה־$x$־ים: $${p}$ ו־$${q}$.` : `אותו $x = ${k}$ ← קטע אנכי. משווים את ה־$y$־ים: $${p}$ ו־$${q}$.`,
            `אורך $= ${q} - ${par(p)} = ${q - p}$`],
        };
      } },
      { level: 2, gen() {
        const m = U.RNZ(-4, 4), b = U.R(-6, 6), x = U.R(-4, 4), k = m * x + b;
        return {
          q: `באיזו נקודה הישר $y = ${U.lin(m, b)}$ חותך את הישר $y = ${k}$?`,
          type: 'pair', answer: [x, k],
          mistakes: [{ v: [k, m * k + b], why: `הצבת $${k}$ במקום $x$. אבל $${k}$ הוא ה־$y$ של נקודת החיתוך.` },
            { v: [(k + b) / m, k], why: `בדוק את הצעד הראשון בפתרון $${U.lin(m, b)} = ${k}$: מה עושים לשני האגפים כדי להיפטר מ־$${U.sgn(b)}$?` }],
          hint: `על הישר $y = ${k}$ תמיד $y = ${k}$. מציבים את זה בישר הראשון ומוצאים את $x$.`,
          steps: [`בנקודת החיתוך $y = ${k}$, אז: $${U.lin(m, b)} = ${k}$`, b ? `$${U.term(m)} = ${k - b}$` : `כבר יש לנו $${U.term(m)} = ${k}$`, `$x = ${x}$`, `נקודת החיתוך: $(${x}, ${k})$.`],
        };
      } },
      { level: 2, gen() {
        const x0 = U.R(-4, 4), y0 = U.R(-5, 5), m1 = U.RNZ(-3, 3);
        let m2; do { m2 = U.RNZ(-3, 3); } while (m2 === m1);
        const b1 = y0 - m1 * x0, b2 = y0 - m2 * x0;
        return {
          q: `מצאו את נקודת החיתוך של הישרים $y = ${U.lin(m1, b1)}$ ו־$y = ${U.lin(m2, b2)}$.`,
          type: 'pair', answer: [x0, y0],
          mistakes: [m1, m2].map(m => ({ v: [x0, m * x0], why: 'ה־$x$ נכון. כשהצבת אותו כדי למצוא את $y$, שכחת את המספר הבודד שבסוף המשוואה?' })),
          hint: 'משווים את שני הביטויים (כי ה־$y$ שווה), פותרים ומוצאים $x$, ואז מציבים כדי למצוא $y$.',
          steps: solveSteps(m1, b1, m2, b2, x0, y0),
        };
      } },
      { level: 2, gen() {
        const a = U.RNZ(-7, 7), c = U.RNZ(-7, 7), askArea = Math.random() < 0.5, w = Math.abs(a), h = Math.abs(c);
        return {
          q: `הישרים $x = ${a}$ ו־$y = ${c}$ יוצרים מלבן עם הצירים. מה ${askArea ? 'השטח' : 'ההיקף'} של המלבן?`,
          type: 'number', answer: askArea ? w * h : 2 * (w + h),
          mount(el) {
            const brd = U.board(el, [-8, 8, 8, -8]);
            brd.create('line', [[a, 0], [a, 1]], { strokeColor: '#2f6fdb', strokeWidth: 2, fixed: true });
            brd.create('line', [[0, c], [1, c]], { strokeColor: '#e8702a', strokeWidth: 2, fixed: true });
          },
          mistakes: [{ v: askArea ? 2 * (w + h) : w * h, why: askArea ? 'חישבת היקף (חיבור הצלעות). שאלו על שטח.' : 'חישבת שטח (כפל הצלעות). שאלו על היקף.' },
            { v: askArea ? a * c : 2 * (a + c), why: 'אורך של צלע הוא מרחק, ולכן תמיד חיובי, גם כשהישר בצד השלילי של הציר.' },
            { v: askArea ? w * h : w + h, why: 'למלבן יש ארבע צלעות. חיברת רק שתיים.' }],
          hint: 'הצלעות הן המרחקים מהצירים: אחת $|a|$ ואחת $|c|$ (בלי מינוס). ' + (askArea ? 'שטח = צלע כפול צלע.' : 'היקף = סכום כל ארבע הצלעות.'),
          steps: [`צלע אחת: מ־0 עד $${a}$ ← ${w}. צלע שנייה: מ־0 עד $${c}$ ← ${h}.`,
            askArea ? `שטח $= ${w} \\cdot ${h} = ${w * h}$` : `היקף $= ${w} + ${h} + ${w} + ${h} = ${2 * (w + h)}$`],
        };
      } },
      { level: 3, gen() {
        const rA = U.R(1, 4), rB = rA + U.R(1, 3), t = U.R(2, 8), sB = U.R(0, 10), sA = sB + (rB - rA) * t, ball = Math.random() < 0.5;
        const q = ball
          ? `בתחילת הרבע לקבוצה של דני יש ${sA} נקודות וליריבה יש ${sB}. מעכשיו הקבוצה של דני קולעת ${rA} נקודות בדקה, והיריבה ${rB} נקודות בדקה. אחרי כמה דקות יהיה תיקו?`
          : `לנועם יש ${sA} ₪ והוא חוסך ${rA} ₪ בשבוע. ליואב יש ${sB} ₪ והוא חוסך ${rB} ₪ בשבוע. אחרי כמה שבועות יהיה להם אותו סכום?`;
        return {
          q, type: 'number', answer: t,
          mistakes: [{ v: sA - sB, why: `$${sA - sB}$ הוא הפער בהתחלה. בכמה הוא מצטמצם בכל ${ball ? 'דקה' : 'שבוע'}?` },
            { v: (sA - sB) / rB, why: `שכחת ש${ball ? 'גם הקבוצה של דני ממשיכה לקלוע' : 'גם נועם ממשיך לחסוך'}: $${rA}$ בכל ${ball ? 'דקה' : 'שבוע'}.` },
            { v: rA * t + sA, why: `זה ${ball ? 'מספר הנקודות' : 'הסכום'} ברגע השוויון. שאלו אחרי כמה ${ball ? 'דקות' : 'שבועות'}.` }],
          hint: `כותבים ישר לכל אחד: $y = ${U.lin(rA, sA)}$ ו־$y = ${U.lin(rB, sB)}$ ($x$ = הזמן). התשובה היא נקודת החיתוך.`,
          steps: [`ישר ראשון: $y = ${U.lin(rA, sA)}$. ישר שני: $y = ${U.lin(rB, sB)}$.`, `משווים: $${U.lin(rA, sA)} = ${U.lin(rB, sB)}$`,
            `$${sA - sB} = ${U.term(rB - rA)}$ ← $x = ${t}$`, `בדיקה: $${rA} \\cdot ${t} + ${sA} = ${rA * t + sA}$ וגם $${rB} \\cdot ${t} + ${sB} = ${rB * t + sB}$ ✔`],
        };
      } },
      { level: 3, gen() {
        let p, q; do { p = U.R(1, 5); q = U.R(1, 5); } while ((p + q) % 2);
        const m = U.pick([1, 2]), x0 = (q - p) / 2, y0 = m * (p + q) / 2, area = (p + q) * y0 / 2;
        return {
          q: `הישרים $y = ${U.lin(m, m * p)}$ ו־$y = ${U.lin(-m, m * q)}$ יוצרים משולש עם ציר ה־x. מה שטח המשולש?`,
          type: 'number', answer: area,
          mount(el) {
            const brd = U.board(el, [-7, 12, 7, -2]);
            brd.create('functiongraph', [x => m * x + m * p], { strokeColor: '#2f6fdb', strokeWidth: 2 });
            brd.create('functiongraph', [x => -m * x + m * q], { strokeColor: '#e8702a', strokeWidth: 2 });
          },
          mistakes: [{ v: Math.abs(q - p) * y0 / 2, why: `בדוק את אורך הבסיס: כמה צעדים יש מ־$${-p}$ עד $${q}$ על ציר ה־$x$?` },
            { v: (p + q) * m * p / 2, why: 'הגובה של המשולש הוא ה־$y$ של נקודת החיתוך בין שני הישרים, לא המקום שבו ישר חותך את ציר ה־$y$.' }, { v: (p + q) * m * q / 2, why: 'הגובה של המשולש הוא ה־$y$ של נקודת החיתוך בין שני הישרים, לא המקום שבו ישר חותך את ציר ה־$y$.' }],
          hint: 'שלושה שלבים: (1) איפה כל ישר חותך את ציר ה־x ($y = 0$) — זה הבסיס. (2) נקודת החיתוך של הישרים — ה־$y$ שלה הוא הגובה. (3) בסיס כפול גובה חלקי 2.',
          steps: [`ציר ה־x: $${U.lin(m, m * p)} = 0$ ← $x = ${-p}$. וגם $${U.lin(-m, m * q)} = 0$ ← $x = ${q}$.`,
            `הבסיס: מ־$${-p}$ עד $${q}$ ← אורך ${p + q}.`,
            `חיתוך הישרים: $${U.lin(m, m * p)} = ${U.lin(-m, m * q)}$ ← $${U.term(2 * m)} = ${m * q - m * p}$ ← $x = ${nm(x0)}$, $y = ${y0}$.`,
            `הגובה הוא ה־$y$ של נקודת החיתוך: ${y0}.`, `שטח $= \\frac{${p + q} \\cdot ${y0}}{2} = ${area}$`],
        };
      } },
    ],

    summary: [
      '$y = k$ — ישר שטוח, מקביל לציר ה־x (שיפוע 0). $x = k$ — ישר עומד, מקביל לציר ה־y.',
      'הישרים $x = a$ ו־$y = c$ נחתכים בנקודה $(a, c)$.',
      'אורך קטע שטוח = הפרש ה־$x$־ים. אורך קטע עומד = הפרש ה־$y$־ים. תמיד חיובי.',
      'נקודת חיתוך של שני ישרים: משווים את הביטויים, מוצאים $x$, ומציבים כדי למצוא $y$.',
      'אותו שיפוע ← ישרים מקבילים, אין נקודת חיתוך. בשאלות מהחיים — החיתוך הוא הרגע שבו שני הדברים שווים.',
    ],
  });
})();
