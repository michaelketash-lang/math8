/* יחידה: מערכת משוואות ושאלות מילוליות (כרך ב׳, פרקים 11–12 בספר) */
(() => {
  const p = n => (n < 0 ? `(${n})` : String(n));
  /** ax + by בכתיב TeX */
  const lin2 = (a, b) => {
    const xs = a ? U.term(a, 'x') : '';
    if (!b) return xs || '0';
    const ys = U.term(Math.abs(b), 'y');
    return xs ? `${xs} ${b < 0 ? '-' : '+'} ${ys}` : (b < 0 ? '-' : '') + ys;
  };
  /** מערכת של שתי משוואות */
  const sys = (e1, e2) => `\\begin{cases} ${e1} \\\\ ${e2} \\end{cases}`;
  /** 'ax = c ← x = c/a' (בלי הצעד השני כש־a = 1) */
  const solve = (a, c, v = 'x') => `$${U.term(a, v)} = ${c}$` + (a === 1 ? '' : ` ← $${v} = ${c / a}$`);
  const COUNT = ['פתרון אחד', 'אין פתרון', 'אין־סוף פתרונות'];

  registerChapter('systems', {
    intro: `
      <div class="idea"><b>מהי מערכת משוואות?</b>שתי משוואות עם שני נעלמים, $x$ ו־$y$. הפתרון הוא <b>זוג סדור</b> $(x, y)$ שמקיים את <b>שתי</b> המשוואות ביחד.
        <div class="formula">$${sys('x + y = 10', 'x - y = 4')}$ &nbsp;&nbsp; ← &nbsp; הפתרון: $(7, 3)$</div>
        בדיקה: $7 + 3 = 10$ ✔ וגם $7 - 3 = 4$ ✔</div>
      <div class="idea"><b>פתרון גרפי</b>כל משוואה היא ישר. הפתרון הוא <b>נקודת החיתוך</b> של שני הישרים.
        <br>ישרים מקבילים ← <b>אין פתרון</b>. אותו ישר בדיוק ← <b>אין־סוף פתרונות</b>.</div>
      <div class="idea"><b>שיטת ההצבה</b>מבודדים נעלם באחת המשוואות (למשל $y = \\ldots$) ו<b>מציבים</b> אותו במשוואה השנייה. נשארת משוואה עם נעלם אחד.</div>
      <div class="idea"><b>שיטת השוואת מקדמים</b>אם המקדמים של אחד הנעלמים <b>נגדיים</b> (כמו $+y$ ו־$-y$) — מחברים את המשוואות. אם הם <b>שווים</b> — מחסירים. ככה נעלם אחד נעלם!
        <br>אם הם לא שווים, קודם כופלים משוואה במספר כדי שיהיו.</div>
      <div class="note"><b>שאלות תנועה</b><br>
        <div class="formula">דרך = מהירות × זמן</div>
        שני רכבים שנוסעים <b>זה לקראת זה</b>: המרחק ביניהם קטן בכל שעה בסכום המהירויות.</div>`,

    example: {
      question: 'בכדורסל קלע שחקן 10 סלים: חלק של 2 נקודות וחלק של 3 נקודות. בסך הכול הוא צבר 23 נקודות. כמה סלים של 3 נקודות הוא קלע?',
      steps: [
        'מסמנים: $x$ = מספר הסלים של 2 נקודות, $y$ = מספר הסלים של 3 נקודות.',
        `שתי עובדות ← שתי משוואות: $${sys('x + y = 10', '2x + 3y = 23')}$`,
        'שיטת ההצבה: מהמשוואה הראשונה מבודדים $x$: $x = 10 - y$.',
        'מציבים בשנייה במקום $x$: $2(10 - y) + 3y = 23$.',
        'פותחים סוגריים: $20 - 2y + 3y = 23$, כלומר $20 + y = 23$, ולכן $y = 3$.',
        'מציבים חזרה: $x = 10 - 3 = 7$. הפתרון: $(7, 3)$.',
        'בדיקה: $7 + 3 = 10$ ✔ &nbsp; $2 \\cdot 7 + 3 \\cdot 3 = 14 + 9 = 23$ ✔ &nbsp; התשובה: <b>3 שלשות</b>.',
      ],
    },

    tools: [
      {
        title: 'שני ישרים — איפה הם נפגשים?',
        desc: 'כל ישר הוא משוואה אחת. הזיזו את הסליידרים ושימו לב לנקודת החיתוך — זה הפתרון של המערכת. מה קורה כשהשיפועים שווים?',
        mount(el) {
          const st = { m1: 1, b1: 1, m2: -1, b2: 5 };
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = U.board(el, [-8, 8, 8, -8]);
          brd.create('functiongraph', [x => st.m1 * x + st.b1], { strokeColor: '#2f6fdb', strokeWidth: 4 });
          brd.create('functiongraph', [x => st.m2 * x + st.b2], { strokeColor: '#e8702a', strokeWidth: 4 });
          const X = () => (st.b2 - st.b1) / (st.m1 - st.m2);
          const P = brd.create('point', [X, () => st.m1 * X() + st.b1], { name: '', color: '#1f9d55', size: 6, fixed: true });
          const upd = () => {
            const e = `$${sys(`y = ${U.lin(st.m1, st.b1)}`, `y = ${U.lin(st.m2, st.b2)}`)}$`;
            let r;
            if (st.m1 === st.m2) r = st.b1 === st.b2 ? 'אותו ישר בדיוק ← <b>אין־סוף פתרונות</b>' : 'הישרים מקבילים ← <b>אין פתרון</b>';
            else r = `נקודת החיתוך: $(${U.num(X())}, ${U.num(st.m1 * X() + st.b1)})$ ← <b>פתרון אחד</b>`;
            P.setAttribute({ visible: st.m1 !== st.m2 });
            out.innerHTML = `${e} &nbsp; ${r}`; U.math(out); brd.update();
          };
          U.slider(el, { label: 'שיפוע כחול', min: -3, max: 3, step: 0.5, value: st.m1, onInput: v => { st.m1 = v; upd(); } });
          U.slider(el, { label: 'חיתוך כחול', min: -6, max: 6, value: st.b1, onInput: v => { st.b1 = v; upd(); } });
          U.slider(el, { label: 'שיפוע כתום', min: -3, max: 3, step: 0.5, value: st.m2, onInput: v => { st.m2 = v; upd(); } });
          U.slider(el, { label: 'חיתוך כתום', min: -6, max: 6, value: st.b2, onInput: v => { st.b2 = v; upd(); } });
        },
      },
      {
        title: 'השוואת מקדמים: לחבר או לחסר?',
        desc: 'המטרה: ש־y ייעלם. הסתכלו על המקדמים של y ובחרו: לחבר את המשוואות או לחסר אותן?',
        mount(el) {
          el.insertAdjacentHTML('beforeend', `<div class="readout top"></div>
            <div class="row" style="justify-content:center"><button class="btn add">➕ לחבר</button><button class="btn sub">➖ לחסר</button></div>
            <div class="readout res"></div><div class="row" style="justify-content:center"><button class="btn ghost new">מערכת חדשה</button></div>`);
          const top = el.querySelector('.top'), res = el.querySelector('.res');
          let s;
          const fresh = () => {
            const x = U.R(-4, 6), y = U.R(-4, 6), a1 = U.R(1, 4), b = U.R(1, 4), opp = Math.random() < 0.5;
            let a2; do { a2 = U.R(1, 4); } while (opp ? false : a2 === a1);
            const b2 = opp ? -b : b;
            s = { x, y, a1, a2, b, b2, c1: a1 * x + b * y, c2: a2 * x + b2 * y, opp };
            top.innerHTML = `$${sys(`${lin2(a1, b)} = ${s.c1}`, `${lin2(a2, b2)} = ${s.c2}`)}$`;
            res.innerHTML = 'מה תבחר?'; U.math(top);
          };
          const go = add => {
            const k = add ? 1 : -1, A = s.a1 + k * s.a2, B = s.b + k * s.b2, C = s.c1 + k * s.c2;
            const line = `$(${lin2(s.a1, s.b)}) ${add ? '+' : '-'} (${lin2(s.a2, s.b2)}) = ${s.c1} ${add ? '+' : '-'} ${p(s.c2)}$<br>$${lin2(A, B)} = ${C}$`;
            if (B === 0) res.innerHTML = `${line}<br>🏀 y נעלם! $x = ${C} \\div ${p(A)} = ${s.x}$, ואחר כך מציבים ומקבלים $y = ${s.y}$. הפתרון: $(${s.x}, ${s.y})$`;
            else res.innerHTML = `${line}<br>✗ y לא נעלם (יצא $${U.term(B, 'y')}$). ${s.opp ? 'המקדמים נגדיים — צריך לחבר.' : 'המקדמים שווים — צריך לחסר.'}`;
            U.math(res);
          };
          el.querySelector('.add').onclick = () => go(true);
          el.querySelector('.sub').onclick = () => go(false);
          el.querySelector('.new').onclick = fresh;
          fresh();
        },
      },
      {
        title: 'שאלת תנועה: נסיעה זה לקראת זה',
        desc: 'שני רוכבי אופניים יוצאים באותו זמן משתי ערים שהמרחק ביניהן 120 ק״מ, ונוסעים זה לקראת זה. בחרו מהירויות והזיזו את הזמן. מתי הם נפגשים?',
        mount(el) {
          const D = 120, st = { v1: 20, v2: 30, t: 0 };
          const NS = 'http://www.w3.org/2000/svg';
          const svg = document.createElementNS(NS, 'svg');
          svg.setAttribute('viewBox', '0 0 440 110'); svg.style.cssText = 'width:100%;display:block';
          el.appendChild(svg);
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const draw = () => {
            const { v1, v2, t } = st, d1 = Math.min(v1 * t, D), d2 = Math.min(v2 * t, D - d1), meet = D / (v1 + v2), sx = 400 / D;
            const met = v1 * t + v2 * t >= D;
            svg.innerHTML = `<line x1="20" y1="60" x2="420" y2="60" style="stroke:var(--muted)" stroke-width="4"/>
              <text x="20" y="95" font-size="15" text-anchor="middle" style="fill:var(--ink)">א</text><text x="420" y="95" font-size="15" text-anchor="middle" style="fill:var(--ink)">ב</text>
              <line x1="20" y1="40" x2="${20 + d1 * sx}" y2="40" style="stroke:var(--blue)" stroke-width="6"/>
              <line x1="${420 - d2 * sx}" y1="40" x2="420" y2="40" style="stroke:var(--accent)" stroke-width="6"/>
              <circle cx="${20 + d1 * sx}" cy="60" r="10" style="fill:var(--blue)"/><circle cx="${420 - d2 * sx}" cy="60" r="10" style="fill:var(--accent)"/>
              <text x="${20 + d1 * sx / 2}" y="30" font-size="14" text-anchor="middle" style="fill:var(--blue)">${U.num(d1)}</text>
              <text x="${420 - d2 * sx / 2}" y="30" font-size="14" text-anchor="middle" style="fill:var(--accent)">${U.num(d2)}</text>`;
            out.innerHTML = met
              ? `🏀 נפגשו! זמן המפגש: $t = \\frac{${D}}{${v1} + ${v2}} = ${U.num(meet)}$ שעות`
              : `אחרי $${U.num(t)}$ שעות: $${v1} \\cdot ${U.num(t)} + ${v2} \\cdot ${U.num(t)} = ${U.num((v1 + v2) * t)}$ ק״מ ביחד. נשארו עוד $${U.num(D - (v1 + v2) * t)}$ ק״מ.`;
            U.math(out);
          };
          U.slider(el, { label: 'מהירות כחול (קמ״ש)', min: 10, max: 50, step: 5, value: st.v1, onInput: v => { st.v1 = v; draw(); } });
          U.slider(el, { label: 'מהירות כתום (קמ״ש)', min: 10, max: 50, step: 5, value: st.v2, onInput: v => { st.v2 = v; draw(); } });
          U.slider(el, { label: 'זמן (שעות)', min: 0, max: 6, step: 0.25, value: 0, onInput: v => { st.t = v; draw(); } });
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        const x = U.R(-5, 6), y = U.R(-5, 6), a = U.RNZ(-3, 3), b = U.RNZ(-3, 3);
        const ok = Math.random() < 0.5, dy = ok ? 0 : U.pick([-2, -1, 1, 2]), Y = y + dy;
        const s1 = x + y, s2 = a * x + b * y;
        return {
          q: `האם הזוג $(${x}, ${Y})$ הוא פתרון של המערכת $${sys(`x + y = ${s1}`, `${lin2(a, b)} = ${s2}`)}$?`,
          type: 'choice', choices: ['כן', 'לא'], answer: ok ? 0 : 1,
          hint: 'מציבים $x$ ו־$y$ בשתי המשוואות. זה פתרון רק אם <b>שתיהן</b> נכונות.',
          steps: [`משוואה ראשונה: $${x} + ${p(Y)} = ${x + Y}$ ${x + Y === s1 ? '✔' : `(צריך $${s1}$) ✗`}`,
            `משוואה שנייה: $${a} \\cdot ${p(x)} + ${p(b)} \\cdot ${p(Y)} = ${a * x + b * Y}$ ${a * x + b * Y === s2 ? '✔' : `(צריך $${s2}$) ✗`}`,
            ok ? 'שתיהן נכונות ← <b>כן</b>, זה פתרון.' : 'לפחות אחת לא נכונה ← <b>לא</b>.'],
        };
      } },
      { level: 1, gen() {
        const x = U.R(1, 10), y = U.R(-3, 8);
        return {
          q: `פתרו את המערכת: $${sys(`x + y = ${x + y}`, `x - y = ${x - y}`)}$`, type: 'pair', answer: [x, y],
          hint: 'המקדמים של $y$ נגדיים ($+y$ ו־$-y$). מה יקרה אם תחברו את שתי המשוואות?',
          steps: [`מחברים את המשוואות: $2x = ${x + y} + ${p(x - y)} = ${2 * x}$`, `$x = ${x}$`, `מציבים בראשונה: $${x} + y = ${x + y}$ ← $y = ${y}$`, `הפתרון: $(${x}, ${y})$`],
        };
      } },
      { level: 1, gen() {
        const k = U.R(2, 4), x = U.R(1, 10), y = k * x;
        return {
          q: `פתרו את המערכת: $${sys(`y = ${k}x`, `x + y = ${x + y}`)}$`, type: 'pair', answer: [x, y],
          hint: `במשוואה השנייה מציבים $${k}x$ במקום $y$.`,
          steps: [`מציבים: $x + ${k}x = ${x + y}$`, `$${k + 1}x = ${x + y}$ ← $x = ${x}$`, `$y = ${k} \\cdot ${x} = ${y}$`, `הפתרון: $(${x}, ${y})$`],
        };
      } },
      { level: 1, gen() {
        const x0 = U.R(-4, 4), y0 = U.R(-4, 4), m1 = U.pick([-2, -1, 1, 2]);
        let m2; do { m2 = U.pick([-2, -1, 0, 1, 2]); } while (m2 === m1);
        const b1 = y0 - m1 * x0, b2 = y0 - m2 * x0;
        return {
          q: `בגרף שני הישרים $y = ${U.lin(m1, b1)}$ ו־$y = ${U.lin(m2, b2)}$. מה הפתרון של המערכת (נקודת החיתוך)?`,
          type: 'pair', answer: [x0, y0],
          mount(el) {
            const brd = U.board(el, [-6, 6, 6, -6]);
            brd.create('functiongraph', [x => m1 * x + b1], { strokeColor: '#2f6fdb', strokeWidth: 3 });
            brd.create('functiongraph', [x => m2 * x + b2], { strokeColor: '#e8702a', strokeWidth: 3 });
          },
          hint: 'מחפשים את הנקודה שבה שני הישרים נפגשים, וקוראים את ה־$x$ וה־$y$ שלה מהרשת.',
          steps: [`הישרים נפגשים בנקודה $(${x0}, ${y0})$.`, `בדיקה: $${m1} \\cdot ${p(x0)} ${b1 ? U.sgn(b1) : ''} = ${y0}$ ✔ וגם $${m2} \\cdot ${p(x0)} ${b2 ? U.sgn(b2) : ''} = ${y0}$ ✔`],
        };
      } },
      { level: 2, gen() {
        let m, b, a, c, x, y;
        do { m = U.RNZ(-3, 3); b = U.R(-5, 5); a = U.RNZ(-4, 4); c = U.RNZ(-3, 3); x = U.R(-4, 5); y = m * x + b; } while (a + c * m === 0);
        const d = a * x + c * y;
        return {
          q: `פתרו בשיטת ההצבה: $${sys(`y = ${U.lin(m, b)}`, `${lin2(a, c)} = ${d}`)}$`, type: 'pair', answer: [x, y],
          hint: `מציבים $(${U.lin(m, b)})$ במקום $y$ במשוואה השנייה. אל תשכחו סוגריים!`,
          steps: [`מציבים: $${U.term(a, 'x')} ${c < 0 ? '-' : '+'} ${Math.abs(c) === 1 ? '' : Math.abs(c)}(${U.lin(m, b)}) = ${d}$`,
            `פותחים סוגריים: $${U.term(a, 'x')} ${U.sgn(c * m)}x ${c * b ? U.sgn(c * b) : ''} = ${d}$`.replace(/([+-]) 1x/, '$1 x'),
            solve(a + c * m, d - c * b), `$y = ${m} \\cdot ${p(x)} ${b ? U.sgn(b) : ''} = ${y}$`, `הפתרון: $(${x}, ${y})$`],
        };
      } },
      { level: 2, gen() {
        const a1 = U.R(1, 5), a2 = U.R(1, 5), b = U.R(1, 5), x = U.R(-4, 6), y = U.R(-4, 6);
        const c1 = a1 * x + b * y, c2 = a2 * x - b * y;
        return {
          q: `פתרו בשיטת השוואת מקדמים: $${sys(`${lin2(a1, b)} = ${c1}`, `${lin2(a2, -b)} = ${c2}`)}$`, type: 'pair', answer: [x, y],
          hint: `המקדמים של $y$ הם $+${b}$ ו־$-${b}$ — נגדיים. מחברים את המשוואות ו־$y$ נעלם.`,
          steps: [`מחברים: $${U.term(a1 + a2)} = ${c1} + ${p(c2)} = ${c1 + c2}$`, `$x = ${x}$`,
            `מציבים בראשונה: $${a1} \\cdot ${p(x)} + ${U.term(b, 'y')} = ${c1}$ ← $${U.term(b, 'y')} = ${c1 - a1 * x}$ ← $y = ${y}$`, `הפתרון: $(${x}, ${y})$`],
        };
      } },
      { level: 2, gen() {
        const x = U.R(2, 10), y = U.R(1, 8), n = x + y, P = 2 * x + 3 * y;
        return {
          q: `שחקנית קלעה ${n} סלים — חלקם של 2 נקודות וחלקם של 3 נקודות — וצברה ${P} נקודות. כמה סלים של 3 נקודות היא קלעה?`,
          type: 'number', answer: y,
          hint: `$x$ = סלים של 2, $y$ = סלים של 3. משוואה אחת לסלים ($x + y = ${n}$) ומשוואה אחת לנקודות.`,
          steps: [`$${sys(`x + y = ${n}`, `2x + 3y = ${P}`)}$`, `מהראשונה: $x = ${n} - y$`, `מציבים: $2(${n} - y) + 3y = ${P}$ ← $${2 * n} + y = ${P}$`, `$y = ${y}$ (ו־$x = ${x}$)`, `בדיקה: $2 \\cdot ${x} + 3 \\cdot ${y} = ${P}$ ✔`],
        };
      } },
      { level: 2, gen() {
        const kind = U.R(0, 2), m = U.RNZ(-3, 3), b = U.R(-5, 5), k = U.R(2, 3);
        const b2 = kind === 1 ? b + U.pick([-3, -2, -1, 1, 2, 3]) : b;
        const m2 = kind === 0 ? m + U.pick([-1, 1, 2]) : m;
        const e2 = kind === 2 ? `${k}y = ${U.lin(k * m, k * b)}` : `y = ${U.lin(m2, b2)}`;
        return {
          q: `כמה פתרונות יש למערכת $${sys(`y = ${U.lin(m, b)}`, e2)}$?`, type: 'choice', choices: COUNT, answer: kind,
          hint: 'כתבו את שתי המשוואות בצורה $y = mx + b$ והשוו: האם השיפועים שווים? האם גם ה־$b$ שווה?',
          steps: [kind === 2 ? `מחלקים את השנייה ב־$${k}$: $y = ${U.lin(m, b)}$ — אותה משוואה בדיוק!` : `השיפועים: $${m}$ ו־$${m2}$.`,
            kind === 0 ? 'שיפועים שונים ← הישרים נחתכים בנקודה אחת ← <b>פתרון אחד</b>.'
              : kind === 1 ? `שיפועים שווים אבל $b$ שונה ($${b}$ ו־$${b2}$) ← ישרים מקבילים ← <b>אין פתרון</b>.` : 'אותו ישר ← כל נקודה עליו היא פתרון ← <b>אין־סוף פתרונות</b>.'],
        };
      } },
      { level: 3, gen() {
        let a1, b1, a2, b2, x, y;
        do { a1 = U.RNZ(-5, 5); b1 = U.RNZ(-5, 5); a2 = U.RNZ(-5, 5); b2 = U.RNZ(-5, 5); } while (a1 * b2 - a2 * b1 === 0 || Math.abs(a1) === Math.abs(a2) || Math.abs(b1) === Math.abs(b2));
        x = U.R(-4, 5); y = U.R(-4, 5);
        const c1 = a1 * x + b1 * y, c2 = a2 * x + b2 * y, g = U.gcd(a1, a2), k1 = a2 / g, k2 = a1 / g;
        const B = b1 * k1 - b2 * k2, C = c1 * k1 - c2 * k2;
        return {
          q: `פתרו את המערכת: $${sys(`${lin2(a1, b1)} = ${c1}`, `${lin2(a2, b2)} = ${c2}`)}$`, type: 'pair', answer: [x, y],
          hint: 'המקדמים לא שווים. כופלים כל משוואה במספר מתאים כך שהמקדמים של $x$ יהיו שווים, ואז מחסירים.',
          steps: [`כופלים את הראשונה ב־$${p(k1)}$ ואת השנייה ב־$${p(k2)}$: $${sys(`${lin2(a1 * k1, b1 * k1)} = ${c1 * k1}`, `${lin2(a2 * k2, b2 * k2)} = ${c2 * k2}`)}$`,
            `עכשיו המקדמים של $x$ שווים. מחסירים: $${U.term(B, 'y')} = ${C}$ ← $y = ${y}$`,
            `מציבים בראשונה: $${U.term(a1, 'x')} ${b1 < 0 ? '-' : '+'} ${Math.abs(b1)} \\cdot ${p(y)} = ${c1}$ ← $${U.term(a1, 'x')} = ${c1 - b1 * y}$ ← $x = ${x}$`,
            `הפתרון: $(${x}, ${y})$`],
        };
      } },
      { level: 3, gen() {
        if (Math.random() < 0.5) {
          const t = U.R(1, 4), v1 = U.pick([10, 15, 20, 25, 30]), v2 = U.pick([10, 15, 20, 25, 30, 35]), D = (v1 + v2) * t;
          return {
            q: `שני רוכבי אופניים יוצאים באותו זמן משתי ערים שהמרחק ביניהן ${D} ק״מ, ורוכבים זה לקראת זה. מהירות אחד ${v1} קמ״ש ומהירות השני ${v2} קמ״ש. אחרי כמה שעות ייפגשו?`,
            type: 'number', answer: t,
            hint: 'דרך = מהירות × זמן. כשנפגשים, סכום הדרכים של שניהם שווה למרחק בין הערים.',
            steps: [`נסמן את הזמן ב־$t$. הראשון עבר $${v1}t$ והשני $${v2}t$.`, `$${v1}t + ${v2}t = ${D}$`, `$${v1 + v2}t = ${D}$ ← $t = ${t}$ שעות.`],
          };
        }
        let k, t, d, v1;
        do { k = U.R(1, 2); v1 = U.pick([40, 50, 60, 70, 80]); d = U.pick([10, 20, 30, 40]); t = v1 * k / d; } while (!Number.isInteger(t) || t > 6);
        const v2 = v1 + d;
        return {
          q: `משאית יוצאת לדרך במהירות ${v1} קמ״ש. ${k === 1 ? 'שעה' : 'שעתיים'} אחריה יוצאת מאותה נקודה מכונית במהירות ${v2} קמ״ש, באותו כיוון. כמה שעות אחרי שיצאה המכונית היא תשיג את המשאית?`,
          type: 'number', answer: t,
          hint: `נסמן ב־$t$ את זמן הנסיעה של המכונית. המשאית נוסעת ${k === 1 ? 'שעה' : 'שעתיים'} יותר: $t + ${k}$. כשהמכונית משיגה אותה — שתיהן עברו אותה דרך.`,
          steps: [`דרך המכונית: $${v2}t$. דרך המשאית: $${v1}(t + ${k})$.`, `$${v2}t = ${v1}(t + ${k})$`, `$${v2}t = ${v1}t + ${v1 * k}$`, `$${d}t = ${v1 * k}$ ← $t = ${t}$ שעות.`],
        };
      } },
      { level: 3, gen() {
        let a1, a2; do { a1 = U.R(2, 4); a2 = U.R(1, 4); } while (a1 === a2);
        const b = 5 * U.R(4, 24), s = 5 * U.R(4, 20), P1 = a1 * b + a2 * s, P2 = b + s;
        return {
          q: `בחנות ספורט: ${a1} כדורים ${a2 === 1 ? 'וחולצה אחת' : `ו־${a2} חולצות`} עולים ${P1} ₪. כדור אחד וחולצה אחת עולים ביחד ${P2} ₪. כמה עולה כדור אחד?`,
          type: 'number', answer: b,
          hint: `$x$ = מחיר כדור, $y$ = מחיר חולצה. מהמשוואה השנייה: $y = ${P2} - x$. מציבים בראשונה.`,
          steps: [`$${sys(`${lin2(a1, a2)} = ${P1}`, `x + y = ${P2}`)}$`, `מהשנייה: $y = ${P2} - x$`, `מציבים: $${a1}x + ${a2 === 1 ? '' : a2}(${P2} - x) = ${P1}$`,
            `$${U.term(a1 - a2)} + ${a2 * P2} = ${P1}$ ← ` + solve(a1 - a2, P1 - a2 * P2), `כדור עולה ${b} ₪ (וחולצה ${s} ₪).`],
        };
      } },
    ],

    summary: [
      'פתרון של מערכת משוואות הוא זוג $(x, y)$ שמקיים את <b>שתי</b> המשוואות.',
      'גרפית: הפתרון הוא נקודת החיתוך של שני הישרים. מקבילים ← אין פתרון, אותו ישר ← אין־סוף.',
      'שיטת ההצבה: מבודדים נעלם אחד ($y = \\ldots$) ומציבים במשוואה השנייה.',
      'השוואת מקדמים: מקדמים נגדיים ← מחברים, שווים ← מחסירים. אם צריך, קודם כופלים.',
      'שאלות תנועה: דרך = מהירות × זמן. תמיד בודקים את הפתרון בשתי המשוואות!',
    ],
  });
})();
