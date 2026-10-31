/* יחידה: תחום הצבה, צמצום שברים אלגבריים, משוואות עם שברים, וערך מוחלט (כרך ב׳, פרקים 13–14 בספר) */
(() => {
  const p = n => (n < 0 ? `(${n})` : String(n));
  /** |x - a| בכתיב TeX */
  const ab = a => `|${U.lin(1, -a)}|`;
  const mc = (right, wrongs) => {
    const choices = U.shuffle([right, ...[...new Set(wrongs)].filter(w => w !== right).slice(0, 3)].map(c => `$${c}$`));
    return { type: 'choice', choices, answer: choices.indexOf(`$${right}$`) };
  };
  const COUNT = ['שני פתרונות', 'פתרון אחד', 'אין פתרון'];

  registerChapter('alg-fractions', {
    intro: `
      <div class="idea"><b>תחום הצבה — אסור לחלק באפס!</b>בשבר $\\frac{5}{x - 3}$ אסור להציב $x = 3$, כי אז המכנה הוא $0$.
        <br>מוצאים את המספרים האסורים כך: <b>משווים את המכנה ל־0</b> ופותרים. תחום ההצבה: $x \\ne 3$.
        <br>תחום ההגדרה של פונקציה — אותו רעיון: כל ה־$x$־ים שמותר להציב בה.</div>
      <div class="idea"><b>צמצום שבר אלגברי — קודם מפרקים!</b>מוציאים גורם משותף במונה ובמכנה, ורק אז מצמצמים גורם שזהה בשניהם.
        <div class="formula">$\\frac{3x + 6}{x + 2} = \\frac{3(x + 2)}{x + 2} = 3$ &nbsp; (כאשר $x \\ne -2$)</div>
        <b>אסור</b> לצמצם חלק מסכום: $\\frac{x + 5}{5} \\ne x$. מצמצמים רק <b>כופלים</b>.</div>
      <div class="note"><b>משוואה עם שבר אלגברי</b><br>1. מוצאים את תחום ההצבה. 2. כופלים במכנה (או מצמצמים). 3. פותרים. 4. בודקים שהפתרון <b>מותר</b> — אם הוא אסור, הוא לא פתרון!</div>
      <div class="idea"><b>ערך מוחלט = מרחק מאפס</b>$|5| = 5$ וגם $|-5| = 5$ — שניהם במרחק 5 מאפס. ערך מוחלט אף פעם לא שלילי.
        <br>הגרף של $y = |x|$ נראה כמו האות <b>V</b>. הגרף של $y = |x - 2| + 1$ זה אותו V, שהקודקוד שלו זז ל־$(2, 1)$.</div>
      <div class="note"><b>משוואות ואי־שוויונות עם ערך מוחלט</b><br>
        $|x| = 4$ ← $x = 4$ או $x = -4$. &nbsp; $|x - 2| = 3$ ← $x - 2 = 3$ או $x - 2 = -3$ ← $x = 5$ או $x = -1$.<br>
        $|x| < 3$ ← $-3 < x < 3$ (קרוב לאפס). &nbsp; $|x| > 3$ ← $x > 3$ או $x < -3$ (רחוק מאפס).</div>`,

    example: {
      question: 'פתרו את המשוואה: $\\frac{3x - 12}{x - 4} = x$',
      steps: [
        'קודם כל — תחום ההצבה. משווים את המכנה לאפס: $x - 4 = 0$ ← $x = 4$. לכן $x \\ne 4$.',
        'מפרקים את המונה: מוציאים גורם משותף 3: $3x - 12 = 3(x - 4)$.',
        'השבר הוא $\\frac{3(x - 4)}{x - 4}$. אותו גורם $(x - 4)$ במונה ובמכנה — מצמצמים!',
        'נשאר: $3$. כלומר המשוואה היא פשוט $3 = x$.',
        'בודקים: האם $x = 3$ מותר? כן, כי $3 \\ne 4$. ✔',
        'בדיקה בהצבה: $\\frac{3 \\cdot 3 - 12}{3 - 4} = \\frac{-3}{-1} = 3$ ✔ — הפתרון: $x = 3$.',
        'שימו לב: אם היה יוצא $x = 4$ — זה <b>לא</b> פתרון, כי אסור להציב 4. אז לא היה פתרון בכלל.',
      ],
    },

    tools: [
      {
        title: 'השבר שיש לו חור',
        desc: 'הגרף של $\\frac{x^2 - a^2}{x - a}$ נראה בדיוק כמו הישר $y = x + a$ — חוץ מנקודה אחת שבה המכנה הוא 0. הזיזו את x וראו מה קורה כשמגיעים ל־a.',
        mount(el) {
          const st = { a: 2, x: -1 };
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = U.board(el, [-7, 10, 7, -7]);
          brd.create('functiongraph', [x => x + st.a], { strokeColor: '#2f6fdb', strokeWidth: 4 });
          brd.create('point', [() => st.a, () => 2 * st.a], { name: '', size: 6, fixed: true, strokeColor: '#2f6fdb', fillColor: '#ffffff', strokeWidth: 3 });
          const P = brd.create('point', [() => st.x, () => st.x + st.a], { name: '', color: '#e8702a', size: 5, fixed: true });
          const upd = () => {
            const { a, x } = st, num = x * x - a * a, den = x - a;
            P.setAttribute({ visible: den !== 0 });
            out.innerHTML = `$\\frac{x^2 - ${a * a}}{x ${U.sgn(-a)}} = \\frac{(x - ${a})(x + ${a})}{x - ${a}} = x + ${a}$ &nbsp; (כאשר $x \\ne ${a}$)<br>` + (den === 0
              ? `עם $x = ${a}$: $\\frac{${U.num(num)}}{0}$ — <b>אסור לחלק באפס!</b> לכן בגרף יש "חור" בנקודה הזו.`
              : `עם $x = ${U.num(x)}$: $\\frac{${U.num(num)}}{${U.num(den)}} = ${U.num(num / den)}$`);
            U.math(out); brd.update();
          };
          U.slider(el, { label: 'a', min: 1, max: 4, value: st.a, onInput: v => { st.a = v; upd(); } });
          U.slider(el, { label: 'x', min: -5, max: 5, step: 0.5, value: st.x, onInput: v => { st.x = v; upd(); } });
        },
      },
      {
        title: 'גרף הערך המוחלט',
        desc: 'הזיזו את הקודקוד של ה־V בעזרת h ו־k. הקו הכתום הוא $y = c$: נקודות המפגש הן הפתרונות של המשוואה, והקטע הירוק על הציר הוא הפתרון של האי־שוויון "קטן מ־c".',
        mount(el) {
          const st = { h: 1, k: -2, c: 2 };
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = U.board(el, [-8, 8, 8, -6]);
          brd.create('functiongraph', [x => Math.abs(x - st.h) + st.k], { strokeColor: '#2f6fdb', strokeWidth: 4 });
          brd.create('functiongraph', [() => st.c], { strokeColor: '#e8702a', strokeWidth: 3 });
          const r = () => st.c - st.k;
          const A = brd.create('point', [() => st.h - Math.max(r(), 0), () => st.c], { name: '', color: '#e8702a', size: 5, fixed: true });
          const B = brd.create('point', [() => st.h + Math.max(r(), 0), () => st.c], { name: '', color: '#e8702a', size: 5, fixed: true });
          const seg = brd.create('segment', [[() => st.h - Math.max(r(), 0), 0], [() => st.h + Math.max(r(), 0), 0]], { strokeColor: '#1f9d55', strokeWidth: 8 });
          const upd = () => {
            const { h, k, c } = st, R = c - k, eq = `${ab(h)} ${k ? U.sgn(k) : ''}`;
            A.setAttribute({ visible: R >= 0 }); B.setAttribute({ visible: R > 0 }); seg.setAttribute({ visible: R > 0 });
            out.innerHTML = `קודקוד: $(${h}, ${k})$ &nbsp;·&nbsp; $${eq} = ${c}$ ← ` + (R > 0 ? `$x = ${h - R}$ או $x = ${h + R}$ <br>ו־$${eq} < ${c}$ ← $${h - R} < x < ${h + R}$`
              : R === 0 ? `פתרון אחד: $x = ${h}$` : '<b>אין פתרון</b> (הקו מתחת לקודקוד)');
            U.math(out); brd.update();
          };
          U.slider(el, { label: 'h (ימינה/שמאלה)', min: -4, max: 4, value: st.h, onInput: v => { st.h = v; upd(); } });
          U.slider(el, { label: 'k (למעלה/למטה)', min: -4, max: 4, value: st.k, onInput: v => { st.k = v; upd(); } });
          U.slider(el, { label: 'c (הקו הכתום)', min: -4, max: 6, value: st.c, onInput: v => { st.c = v; upd(); } });
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        const a = U.RNZ(-12, 12), b = U.RNZ(-12, 12);
        return {
          q: `חשבו: $|${a}| + |${b}|$`, type: 'number', answer: Math.abs(a) + Math.abs(b),
          hint: 'ערך מוחלט = המרחק מאפס. הוא תמיד חיובי: פשוט "מורידים" את המינוס.',
          steps: [`$|${a}| = ${Math.abs(a)}$, &nbsp; $|${b}| = ${Math.abs(b)}$`, `$${Math.abs(a)} + ${Math.abs(b)} = ${Math.abs(a) + Math.abs(b)}$`],
        };
      } },
      { level: 1, gen() {
        const a = U.RNZ(-9, 9), k = U.R(1, 9);
        return {
          q: `איזה מספר <b>אסור</b> להציב במקום $x$ בביטוי $\\frac{${k}}{${U.lin(1, -a)}}$?`, type: 'number', answer: a,
          hint: 'אסור שהמכנה יהיה 0. מתי $' + U.lin(1, -a) + '$ שווה 0?',
          steps: [`משווים את המכנה ל־0: $${U.lin(1, -a)} = 0$`, `$x = ${a}$`, `לכן תחום ההצבה: $x \\ne ${a}$.`],
        };
      } },
      { level: 1, gen() {
        const c = U.R(1, 15);
        return {
          q: `פתרו: $|x| = ${c}$ (כתבו את שני הפתרונות)`, type: 'set', n: 2, answer: [c, -c],
          hint: `אילו מספרים נמצאים במרחק $${c}$ מאפס? יש אחד מימין ואחד משמאל.`,
          steps: [`במרחק $${c}$ מאפס נמצאים $${c}$ ו־$-${c}$.`, `$x = ${c}$ או $x = -${c}$`],
        };
      } },
      { level: 1, gen() {
        const a = U.R(2, 9), b = U.RNZ(-9, 9);
        return {
          q: `צמצמו: $\\frac{${U.lin(a, a * b)}}{${a}} = \\;?$`,
          ...mc(U.lin(1, b), [U.lin(1, a * b), U.lin(a, b), U.lin(1, a * b - a), U.lin(1, -b)]),
          hint: `קודם מוציאים גורם משותף במונה: $${U.lin(a, a * b)} = ${a}(\\ldots)$. אחר כך מצמצמים את ה־$${a}$.`,
          steps: [`מפרקים את המונה: $${U.lin(a, a * b)} = ${a}(${U.lin(1, b)})$`, `$\\frac{${a}(${U.lin(1, b)})}{${a}}$ — מצמצמים את $${a}$.`, `נשאר: $${U.lin(1, b)}$`],
        };
      } },
      { level: 2, gen() {
        const k = U.RNZ(-6, 7), b = U.RNZ(-8, 8);
        const K = k === 1 ? 2 : k; // שומר על מונה עם גורם אמיתי
        return {
          q: `צמצמו את השבר (כאשר $x \\ne ${-b}$): $\\frac{${U.lin(K, K * b)}}{${U.lin(1, b)}}$`, type: 'number', answer: K,
          hint: `מוציאים גורם משותף במונה כך שבסוגריים יופיע בדיוק $(${U.lin(1, b)})$.`,
          steps: [`$${U.lin(K, K * b)} = ${K}(${U.lin(1, b)})$`, `$\\frac{${K}(${U.lin(1, b)})}{${U.lin(1, b)}}$ — מצמצמים את $(${U.lin(1, b)})$`, `נשאר: $${K}$`],
        };
      } },
      { level: 2, gen() {
        if (Math.random() < 0.5) {
          const r = U.RNZ(-6, 6), a = U.R(2, 5);
          return {
            q: `איזה מספר אסור להציב בביטוי $\\frac{x + 1}{${U.lin(a, -a * r)}}$?`, type: 'number', answer: r,
            hint: 'משווים את המכנה ל־0 ופותרים משוואה.',
            steps: [`$${U.lin(a, -a * r)} = 0$`, `$${a}x = ${a * r}$ ← $x = ${r}$`, `תחום ההצבה: $x \\ne ${r}$.`],
          };
        }
        const a = U.RNZ(-7, 7);
        return {
          q: `מצאו את <b>שני</b> המספרים שאסור להציב בביטוי $\\frac{5}{x(${U.lin(1, -a)})}$.`, type: 'set', n: 2, answer: [0, a],
          hint: 'מכפלה שווה 0 כשאחד הגורמים שווה 0. מתי $x = 0$? ומתי הסוגריים שווים 0?',
          steps: [`$x(${U.lin(1, -a)}) = 0$ כאשר $x = 0$ או $${U.lin(1, -a)} = 0$.`, `לכן אסור: $x = 0$ ו־$x = ${a}$.`],
        };
      } },
      { level: 2, gen() {
        const a = U.RNZ(-6, 6), c = U.R(1, 8);
        return {
          q: `פתרו: $${ab(a)} = ${c}$ (כתבו את שני הפתרונות)`, type: 'set', n: 2, answer: [a + c, a - c],
          hint: `מה שבתוך הערך המוחלט שווה $${c}$ או $-${c}$. כותבים שתי משוואות.`,
          steps: [`$${U.lin(1, -a)} = ${c}$ ← $x = ${a + c}$`, `או $${U.lin(1, -a)} = -${c}$ ← $x = ${a - c}$`, `(בדרך אחרת: המספרים שהמרחק שלהם מ־$${a}$ הוא $${c}$.)`],
        };
      } },
      { level: 2, gen() {
        let a, k, m, x;
        do { a = U.RNZ(-6, 6); m = U.RNZ(-5, 5); x = U.R(-8, 8); k = m * (x - a); } while (x === a || k === 0);
        return {
          q: `פתרו: $\\frac{${k}}{${U.lin(1, -a)}} = ${m}$`, type: 'number', answer: x,
          hint: `תחום ההצבה: $x \\ne ${a}$. כופלים את שני האגפים ב־$(${U.lin(1, -a)})$.`,
          steps: [`תחום ההצבה: $x \\ne ${a}$.`, `כופלים במכנה: $${k} = ${m === 1 ? '' : m === -1 ? '-' : m}(${U.lin(1, -a)})$`, `$${k} = ${U.lin(m, -m * a)}$`,
            `$${U.term(m)} = ${k + m * a}$ ← $x = ${x}$`, `$${x} \\ne ${a}$ — הפתרון מותר ✔`],
        };
      } },
      { level: 2, gen() {
        const h = U.R(-5, 5), k = U.R(-4, 5);
        return {
          q: `מה הקודקוד (הנקודה הנמוכה ביותר) של הגרף $y = ${ab(h)} ${k ? U.sgn(k) : ''}$?`, type: 'pair', answer: [h, k],
          hint: 'הערך המוחלט הכי קטן כשמה שבתוכו שווה 0. מתי זה קורה? ומה ה־$y$ אז?',
          steps: [`$${U.lin(1, -h)} = 0$ כאשר $x = ${h}$.`, `אז $y = 0 ${k ? U.sgn(k) : ''} = ${k}$.`, `הקודקוד: $(${h}, ${k})$`],
        };
      } },
      { level: 3, gen() {
        let a, c; do { a = U.RNZ(-6, 6); c = U.R(-6, 8); } while (c - a === 0);
        return {
          q: `פתרו: $\\frac{x^2 ${U.sgn(a)}x}{x} = ${c}$`, type: 'number', answer: c - a,
          hint: 'תחום ההצבה: $x \\ne 0$. מוציאים $x$ כגורם משותף במונה ומצמצמים.',
          steps: [`תחום ההצבה: $x \\ne 0$.`, `$x^2 ${U.sgn(a)}x = x(${U.lin(1, a)})$`, `מצמצמים את $x$: $${U.lin(1, a)} = ${c}$`, `$x = ${c - a}$`, `$${c - a} \\ne 0$ — מותר ✔`],
        };
      } },
      { level: 3, gen() {
        const a = U.RNZ(-5, 5), c = U.R(1, 6), less = Math.random() < 0.5;
        const inside = `${a - c} < x < ${a + c}`, outside = `x < ${a - c} \\text{ או } x > ${a + c}`;
        return {
          q: `פתרו את האי־שוויון: $${ab(a)} ${less ? '<' : '>'} ${c}$`,
          ...mc(less ? inside : outside, [less ? outside : inside, `${-c} < x < ${c}`, `x < ${a + c}`, `x > ${a - c}`]),
          hint: `$${ab(a)}$ הוא המרחק בין $x$ ל־$${a}$. ${less ? 'קטן' : 'גדול'} מ־$${c}$ פירושו ${less ? 'קרוב' : 'רחוק'} ל־$${a}$.`,
          steps: [`המספרים במרחק בדיוק $${c}$ מ־$${a}$: $${a - c}$ ו־$${a + c}$.`,
            less ? `מרחק קטן מ־$${c}$ ← בין שני המספרים: $${inside}$` : `מרחק גדול מ־$${c}$ ← מחוץ להם: $${outside}$`],
        };
      } },
      { level: 3, gen() {
        const kind = U.R(0, 2), a = U.RNZ(-5, 5), b = U.RNZ(-6, 6), v = kind === 0 ? U.R(1, 6) : kind === 1 ? 0 : -U.R(1, 5), c = v + b;
        return {
          q: `כמה פתרונות יש למשוואה $${ab(a)} ${U.sgn(b)} = ${c}$?`, type: 'choice', choices: COUNT, answer: kind,
          hint: 'מבודדים את הערך המוחלט לבד. ערך מוחלט לא יכול להיות שלילי!',
          steps: [`${b > 0 ? 'מחסירים' : 'מוסיפים'} $${Math.abs(b)}$: $${ab(a)} = ${v}$`,
            kind === 0 ? `$${v}$ חיובי ← שני פתרונות ($x = ${a + v}$ או $x = ${a - v}$).` : kind === 1 ? `ערך מוחלט שווה 0 רק כש־$x = ${a}$ ← פתרון אחד.` : `ערך מוחלט לא יכול להיות $${v}$ (שלילי) ← אין פתרון.`],
        };
      } },
    ],

    summary: [
      'אסור לחלק באפס: משווים את המכנה ל־0 כדי למצוא מה אסור להציב (תחום ההצבה).',
      'צמצום: קודם מפרקים (גורם משותף), ורק אז מצמצמים גורם שזהה במונה ובמכנה. לא מצמצמים חלק מסכום!',
      'במשוואה עם שבר: תחום הצבה ← כופלים במכנה ← פותרים ← בודקים שהפתרון מותר.',
      'ערך מוחלט = מרחק מאפס: $|-5| = |5| = 5$. הגרף של $y = |x - h| + k$ הוא V עם קודקוד ב־$(h, k)$.',
      '$|x - a| = c$ ← שני פתרונות $a \\pm c$. &nbsp; $|x| < c$ ← בין $-c$ ל־$c$. &nbsp; $|x| > c$ ← מחוץ להם.',
    ],
  });
})();
