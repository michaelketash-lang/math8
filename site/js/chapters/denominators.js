/* יחידה: משוואות ואי־שוויונות עם מכנה מספרי, ומשוואות שהנעלם במכנה (פרקים 13–14 בספר) */
(() => {
  const par = n => (n < 0 ? `(${n})` : `${n}`);
  const lcm = (a, b) => a * b / U.gcd(a, b);
  const fr = (top, d) => `\\frac{${top}}{${d}}`;
  const SIGN = { '>': '\\gt', '<': '\\lt', '>=': '\\ge', '<=': '\\le' };
  const FLIP = { '>': '<', '<': '>', '>=': '<=', '<=': '>=' };
  const ineq = (s, v) => `$x ${SIGN[s]} ${v}$`;
  const fourWay = (s, v) => {
    const right = ineq(s, v), choices = U.shuffle([right, ineq(FLIP[s], v), ineq(s, -v), ineq(FLIP[s], -v)]);
    return { choices, answer: choices.indexOf(right) };
  };
  /** מקדם כפול ביטוי: (2, 'x + 1') → '2(x + 1)', (1, 'x') → 'x' */
  const times = (k, e) => (/[+-]/.test(e.slice(1)) ? (k === 1 ? e : `${k}(${e})`) : U.term(k, e === 'x' ? 'x' : e));

  registerChapter('denominators', {
    intro: `
      <div class="idea"><b>מכנה מספרי: נפטרים מהשברים</b>כופלים <b>את כל האיברים</b> במכנה המשותף, והשברים נעלמים.
        <br>$\\frac{x}{3} + \\frac{x}{2} = 10$ ← מכנה משותף 6 ← $2x + 3x = 60$ ← $5x = 60$ ← $x = 12$.</div>
      <div class="note"><b>איך מוצאים מכנה משותף?</b><br>המספר הקטן ביותר שכל המכנים נכנסים בו. ל־2 ול־3: 6. ל־4 ול־6: 12. ל־2 ול־4: 4.</div>
      <div class="idea"><b>⚠️ שתי מלכודות</b>1. כופלים <b>כל</b> איבר — גם את המספר שאין לו מכנה: $\\frac{x}{2} + 1 = 4$ ← $x + 2 = 8$.
        <br>2. מונה עם כמה איברים — שמים <b>סוגריים</b>: $6 \\cdot \\frac{x - 1}{3} = 2(x - 1) = 2x - 2$.</div>
      <div class="note"><b>אי־שוויון עם מכנה</b><br>אותו דבר! המכנה המשותף חיובי, אז הכפל בו לא הופך את הסימן. (הופכים רק אם בסוף מחלקים במספר שלילי.)</div>
      <div class="idea"><b>הנעלם במכנה: קודם תחום ההגדרה!</b>אסור לחלק באפס. לכן לפני שפותרים כותבים מה $x$ <b>לא</b> יכול להיות.
        <br>$\\frac{6}{x - 2} = 3$ ← תחום הגדרה: $x \\ne 2$. כופלים ב־$(x - 2)$: $6 = 3(x - 2)$ ← $6 = 3x - 6$ ← $x = 4$ ✔ (מותר, כי $4 \\ne 2$).</div>
      <div class="note"><b>בסוף בודקים</b><br>אם יצא בדיוק המספר האסור — הוא לא פתרון. אם אין פתרון אחר, כותבים: <b>אין פתרון</b>.</div>`,

    example: {
      question: 'פתרו את המשוואה $\\frac{x}{2} + \\frac{x - 1}{3} = 3$.',
      steps: [
        'המכנים הם 2 ו־3. המכנה המשותף הקטן ביותר: <b>6</b> (המספר הקטן ששניהם נכנסים בו).',
        'כופלים <b>כל</b> איבר ב־6: $6 \\cdot \\frac{x}{2} + 6 \\cdot \\frac{x - 1}{3} = 6 \\cdot 3$.',
        'מצמצמים: $6 \\div 2 = 3$ ו־$6 \\div 3 = 2$. מקבלים: $3x + 2(x - 1) = 18$. המונה $x - 1$ נכנס לסוגריים — כולו נכפל ב־2!',
        'פותחים סוגריים: $3x + 2x - 2 = 18$.',
        'מכנסים איברים דומים: $5x - 2 = 18$.',
        'מוסיפים 2: $5x = 20$. מחלקים ב־5: $x = 4$.',
        'בדיקה במשוואה המקורית: $\\frac{4}{2} + \\frac{4 - 1}{3} = 2 + 1 = 3$ ✔.',
      ],
    },

    tools: [
      {
        title: 'מכונת המכנה המשותף',
        desc: 'במה כדאי לכפול את המשוואה? לחצו על מספר וראו אם כל השברים נעלמים. אדום = עוד נשאר שבר.',
        mount(el) {
          const q = document.createElement('div'), out = document.createElement('div'), row = document.createElement('div');
          q.className = out.className = 'readout'; row.className = 'row'; row.style.justifyContent = 'center';
          el.append(q, row, out);
          let a, b, p, sg, c, x;
          const fresh = () => {
            [a, b] = U.pick([[2, 3], [2, 4], [3, 4], [2, 5], [3, 6], [4, 6], [2, 6], [3, 5]]);
            x = b * U.R(1, 4); p = ((a - x % a) % a) + a * U.R(0, 1); sg = U.pick([1, -1]);
            c = (x + p) / a + sg * x / b;
            q.innerHTML = `$${fr(U.lin(1, p), a)} ${sg > 0 ? '+' : '-'} ${fr('x', b)} = ${c}$`;
            out.textContent = 'בחרו במה לכפול ←'; U.math(q);
          };
          const show = k => {
            const L = lcm(a, b), num1 = U.lin(1, p);
            const t = (top, d) => (k % d ? `<span style="color:#d64545">$${fr(k === 1 ? top : `${k}${/[+-]/.test(top) ? `(${top})` : top}`, d)}$</span>` : `$${times(k / d, top)}$`);
            const ok = k % a === 0 && k % b === 0;
            let html = `כפול ${k}: ${t(num1, a)} $${sg > 0 ? '+' : '-'}$ ${t('x', b)} $= ${k * c}$<br>`;
            if (!ok) html += 'עוד נשאר שבר. נסו מספר ששני המכנים נכנסים בו.';
            else {
              const A = k / a, B = k / b, coef = A + sg * B, rhs = k * c - A * p;
              html += (k === L ? '✔ <b>המכנה המשותף הקטן ביותר!</b>' : '✔ עובד, אבל יש מספר קטן יותר שגם עובד.') +
                `<br>$${A === 1 ? '' : A}x ${p ? U.sgn(A * p) : ''} ${sg > 0 ? '+' : '-'} ${B === 1 ? '' : B}x = ${k * c}$ ← $${U.term(coef)} = ${rhs}$ ← $x = ${x}$`;
            }
            out.innerHTML = html; U.math(out);
          };
          for (const k of [2, 3, 4, 5, 6, 8, 10, 12]) {
            const btn = document.createElement('button'); btn.className = 'btn ghost'; btn.textContent = '×' + k; btn.dir = 'ltr';
            btn.onclick = () => show(k); row.appendChild(btn);
          }
          const nb = document.createElement('button'); nb.className = 'btn'; nb.textContent = 'משוואה חדשה'; nb.onclick = fresh;
          row.appendChild(nb);
          fresh();
        },
      },
      {
        title: 'תחום ההגדרה: אסור לחלק באפס',
        desc: 'זה הגרף של $y = \\frac{6}{x - a}$. הזיזו את x וראו את החישוב. מה קורה כש־x מגיע ל־a? (הקו המקווקו הוא המקום האסור.)',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const st = { a: 2, x: 5 };
          const brd = U.board(el, [-8, 10, 8, -10]);
          const f = x => 6 / (x - st.a);
          brd.create('functiongraph', [f, -9, () => st.a - 0.02], { strokeColor: '#2f6fdb', strokeWidth: 3 });
          brd.create('functiongraph', [f, () => st.a + 0.02, 9], { strokeColor: '#2f6fdb', strokeWidth: 3 });
          const P = (fx, fy) => brd.create('point', [fx, fy], { visible: false });
          brd.create('line', [P(() => st.a, 0), P(() => st.a, 1)], { strokeColor: '#d64545', strokeWidth: 2, dash: 3 });
          brd.create('point', [() => st.x, () => (st.x === st.a ? 0 : f(st.x))], { name: '', color: '#e8702a', size: 6, fixed: true, visible: () => st.x !== st.a });
          const upd = () => {
            brd.update();
            out.innerHTML = st.x === st.a
              ? `$x = ${st.x}$: $\\frac{6}{${st.x} - ${par(st.a)}} = \\frac{6}{0}$ ← <b style="color:#d64545">אי אפשר לחלק באפס!</b><br>לכן תחום ההגדרה: $x \\ne ${st.a}$`
              : `$x = ${st.x}$: $\\frac{6}{${st.x} - ${par(st.a)}} = \\frac{6}{${st.x - st.a}} = ${U.num(f(st.x)).replace('−', '-')}$ &nbsp;·&nbsp; תחום ההגדרה: $x \\ne ${st.a}$`;
            U.math(out);
          };
          U.slider(el, { label: 'a (במכנה)', min: -4, max: 4, value: st.a, onInput: v => { st.a = v; upd(); } });
          U.slider(el, { label: 'x', min: -7, max: 7, value: st.x, onInput: v => { st.x = v; upd(); } });
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        const a = U.R(2, 9), b = U.RNZ(-9, 9);
        return {
          q: `פתרו: $\\frac{x}{${a}} = ${b}$`,
          type: 'number', answer: a * b,
          hint: `כדי להיפטר מהמכנה, כופלים את שני האגפים ב־${a}.`,
          steps: [`כופלים את שני האגפים ב־${a}: $${a} \\cdot \\frac{x}{${a}} = ${a} \\cdot ${par(b)}$`, `$x = ${a * b}$`, `בדיקה: $\\frac{${a * b}}{${a}} = ${b}$ ✔`],
        };
      } },
      { level: 1, gen() {
        let a, b; do { a = U.R(2, 10); b = U.R(2, 10); } while (a === b || lcm(a, b) > 30);
        const L = lcm(a, b);
        return {
          q: `מה המכנה המשותף הקטן ביותר של $\\frac{x}{${a}}$ ו־$\\frac{x}{${b}}$?`,
          type: 'number', answer: L,
          hint: `מחפשים את המספר הקטן ביותר ש־${a} וגם ${b} נכנסים בו בלי שארית. נסו את הכפולות של ${Math.max(a, b)}.`,
          steps: [`הכפולות של ${Math.max(a, b)}: ${[1, 2, 3, 4, 5].map(i => i * Math.max(a, b)).filter(v => v <= L).join(', ')}...`,
            `הראשונה ש־${Math.min(a, b)} נכנס בה: <b>${L}</b>.`],
        };
      } },
      { level: 1, gen() {
        const a = U.RNZ(-7, 7), k = U.RNZ(-9, 9);
        return {
          q: `איזה ערך של $x$ <b>אסור</b> להציב בביטוי $\\frac{${k}}{x ${U.sgn(-a)}}$?`,
          type: 'number', answer: a,
          hint: 'אסור לחלק באפס. מתי המכנה שווה 0?',
          steps: [`המכנה: $x ${U.sgn(-a)}$. אסור שיהיה 0.`, `$x ${U.sgn(-a)} = 0$ ← $x = ${a}$`, `לכן $x \\ne ${a}$ (תחום ההגדרה).`],
        };
      } },
      { level: 1, gen() {
        const x = U.RNZ(-6, 6), b = U.RNZ(-5, 5), k = x * b;
        return {
          q: `פתרו: $\\frac{${k}}{x} = ${b}$`,
          type: 'number', answer: x,
          hint: 'קודם: $x \\ne 0$. אחר כך כופלים את שני האגפים ב־$x$.',
          steps: ['תחום הגדרה: $x \\ne 0$.', `כופלים ב־$x$: $${k} = ${U.term(b)}$`, b === 1 ? `כלומר $x = ${x}$` : `מחלקים ב־$${par(b)}$: $x = ${x}$`, `$${x} \\ne 0$, אז מותר ✔. בדיקה: $\\frac{${k}}{${x}} = ${b}$ ✔`],
        };
      } },
      { level: 2, gen() {
        let a, b; do { a = U.R(2, 6); b = U.R(2, 6); } while (a === b || lcm(a, b) > 12);
        const L = lcm(a, b), x = L * U.RNZ(-4, 4), c = x / a + x / b;
        return {
          q: `פתרו: $\\frac{x}{${a}} + \\frac{x}{${b}} = ${c}$`,
          type: 'number', answer: x,
          hint: `המכנה המשותף של ${a} ו־${b} הוא ${L}. כופלים כל איבר ב־${L}.`,
          steps: [`מכנה משותף: ${L}. כופלים כל איבר: $${L} \\cdot \\frac{x}{${a}} + ${L} \\cdot \\frac{x}{${b}} = ${L} \\cdot ${par(c)}$`,
            `$${U.term(L / a)} + ${U.term(L / b)} = ${L * c}$`, `$${U.term(L / a + L / b)} = ${L * c}$`, `$x = ${x}$`,
            `בדיקה: $${x / a} + ${par(x / b)} = ${c}$ ✔`],
        };
      } },
      { level: 2, gen() {
        let a, b; do { a = U.R(2, 6); b = U.R(2, 6); } while (a === b || lcm(a, b) > 15);
        const L = lcm(a, b), x = U.R(-6, 8), w = U.RNZ(-3, 4), p = a * w - x, q = b * w - x, A = L / a, B = L / b;
        return {
          q: `פתרו: $${fr(U.lin(1, p), a)} = ${fr(U.lin(1, q), b)}$`,
          type: 'number', answer: x,
          hint: `מכנה משותף: ${L}. כופלים את שני האגפים ב־${L} — ולא לשכוח סוגריים סביב המונים!`,
          steps: [`כופלים ב־${L}: $${times(A, U.lin(1, p))} = ${times(B, U.lin(1, q))}$`,
            `פותחים סוגריים: $${U.lin(A, A * p)} = ${U.lin(B, B * q)}$`,
            `מעבירים איברים: $${U.term(A - B)} = ${B * q - A * p}$`, `$x = ${x}$`,
            `בדיקה: שני האגפים שווים ל־$${w}$ ✔`],
        };
      } },
      { level: 2, gen() {
        const a = U.R(2, 5), c = U.RNZ(-4, 5), s = U.pick(['>', '<', '>=', '<=']), neg = Math.random() < 0.5;
        let p; do { p = U.RNZ(-6, 6); } while (p === a * c);
        const v = neg ? p - a * c : a * c - p, fin = neg ? FLIP[s] : s;
        const top = neg ? `${p} - x` : U.lin(1, p);
        return {
          q: `פתרו את אי־השוויון $${fr(top, a)} ${SIGN[s]} ${c}$`,
          type: 'choice', ...fourWay(fin, v),
          hint: `כופלים את שני האגפים ב־${a} (חיובי, אז הסימן נשאר). ${neg ? 'אחר כך שימו לב: יש $-x$...' : ''}`,
          steps: [`כופלים ב־${a} (חיובי ← הסימן נשאר): $${top} ${SIGN[s]} ${a * c}$`,
            neg ? `${p > 0 ? 'מחסירים' : 'מוסיפים'} ${Math.abs(p)}: $-x ${SIGN[s]} ${a * c - p}$` : `${p > 0 ? 'מחסירים' : 'מוסיפים'} ${Math.abs(p)}: ${ineq(s, v)}`,
            ...(neg ? [`מחלקים ב־$(-1)$ ← <b>הופכים את הסימן</b>: ${ineq(fin, v)}`] : [])],
        };
      } },
      { level: 3, gen() {
        const p = U.RNZ(-5, 5), c = U.pick([-2, -1, 2, 3, 4]);
        let x; do { x = U.R(-6, 6); } while (x === p);
        const a = c * (x - p) - x;
        return {
          q: `פתרו: $${fr(U.lin(1, a), `x ${U.sgn(-p)}`)} = ${c}$`,
          type: 'number', answer: x,
          hint: `קודם תחום ההגדרה: $x \\ne ${p}$. אחר כך כופלים את שני האגפים במכנה $(x ${U.sgn(-p)})$.`,
          steps: [`תחום הגדרה: $x ${U.sgn(-p)} \\ne 0$ ← $x \\ne ${p}$.`,
            `כופלים ב־$(x ${U.sgn(-p)})$: $${U.lin(1, a)} = ${c}(x ${U.sgn(-p)})$`,
            `פותחים סוגריים: $${U.lin(1, a)} = ${U.lin(c, -c * p)}$`,
            `מעבירים איברים: $${U.term(1 - c)} = ${-c * p - a}$`, `$x = ${x}$`,
            `$${x} \\ne ${p}$, אז הפתרון מותר ✔`],
        };
      } },
      { level: 3, gen() {
        const p = U.R(-4, 3); let q; do { q = U.R(-4, 3); } while (q === p);
        const x = Math.max(p, q) + U.R(1, 4), k = U.R(1, 2), A = k * (x - p), B = k * (x - q);
        return {
          q: `פתרו: $\\frac{${A}}{x ${U.sgn(-p)}} = \\frac{${B}}{x ${U.sgn(-q)}}$`,
          type: 'number', answer: x,
          hint: `תחום הגדרה: שני המכנים לא 0. אחר כך כופלים את שני האגפים בשני המכנים ("כפל בהצלבה").`,
          steps: [`תחום הגדרה: $x \\ne ${p}$ וגם $x \\ne ${q}$.`,
            `כופלים בשני המכנים: $${A}(x ${U.sgn(-q)}) = ${B}(x ${U.sgn(-p)})$`,
            `פותחים סוגריים: $${U.lin(A, -A * q)} = ${U.lin(B, -B * p)}$`,
            `מעבירים איברים: $${U.term(A - B)} = ${A * q - B * p}$`, `$x = ${x}$`,
            `$${x}$ הוא לא אחד מהמספרים האסורים ✔`],
        };
      } },
      { level: 3, gen() {
        const p = U.RNZ(-5, 5), k = U.R(1, 3), trap = Math.random() < 0.5;
        let xs; do { xs = U.R(-6, 6); } while (xs === p);
        const r = trap ? p : (1 + k) * xs - k * p, d = `x ${U.sgn(-p)}`;
        const NO = 'אין פתרון', right = trap ? NO : `$x = ${xs}$`;
        const cand = trap ? [`$x = ${p}$`, '$x = 0$', `$x = ${-p}$`] : [right, `$x = ${p}$`, `$x = ${xs + 1 === p ? xs + 2 : xs + 1}$`];
        const choices = U.shuffle([...cand, NO]);
        return {
          q: `פתרו: $\\frac{x}{${d}} + ${k} = \\frac{${r}}{${d}}$`,
          type: 'choice', choices, answer: choices.indexOf(right),
          hint: `לא לשכוח את תחום ההגדרה: $x \\ne ${p}$. כופלים כל איבר ב־$(${d})$ — גם את ה־${k}! ובסוף בודקים שהפתרון מותר.`,
          steps: [`תחום הגדרה: $x \\ne ${p}$.`, `כופלים כל איבר ב־$(${d})$: $x + ${k}(${d}) = ${r}$`,
            `$${U.lin(1 + k, -k * p)} = ${r}$ ← $${U.term(1 + k)} = ${r + k * p}$ ← $x = ${trap ? p : xs}$`,
            trap ? `אבל $x = ${p}$ <b>אסור</b> (המכנה יוצא 0)! לכן: <b>אין פתרון</b>.` : `$${xs} \\ne ${p}$, אז הפתרון מותר ✔`],
        };
      } },
    ],

    summary: [
      'מכנה מספרי: כופלים <b>כל</b> איבר במכנה המשותף (הקטן ביותר) והשברים נעלמים.',
      'מונה עם כמה איברים — שמים סוגריים כשכופלים: $6 \\cdot \\frac{x - 1}{3} = 2(x - 1)$.',
      'אי־שוויון עם מכנה: כפל במכנה חיובי לא הופך את הסימן.',
      'הנעלם במכנה: <b>קודם</b> כותבים תחום הגדרה (המכנה $\\ne 0$), ורק אז כופלים במכנה.',
      'בסוף בודקים: אם יצא המספר האסור — הוא לא פתרון.',
    ],
  });
})();
