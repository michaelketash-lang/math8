/* יחידה: שורש ריבועי ומשוואות מהסוג x² = c (כרך ב׳, פרק 10 בספר) */
(() => {
  const COUNT = ['שני פתרונות', 'פתרון אחד', 'אין פתרון'];
  const p = n => (n < 0 ? `(${n})` : String(n));
  /** ax² בכתיב TeX */
  const ax2 = a => (a === 1 ? 'x^2' : a + 'x^2');

  registerChapter('sqrt', {
    intro: `
      <div class="idea"><b>מהו שורש ריבועי?</b>$\\sqrt{49}$ הוא המספר <b>החיובי</b> שכשכופלים אותו בעצמו מקבלים 49.
        <div class="formula">$\\sqrt{49} = 7$ &nbsp; כי &nbsp; $7^2 = 7 \\cdot 7 = 49$</div>
        השורש "מבטל" את הריבוע. ל־$\\sqrt{-9}$ אין ערך: אין מספר שכפול עצמו נותן מספר שלילי.</div>
      <div class="note"><b>שורש בסדר פעולות החשבון</b><br>
        השורש מתנהג כמו <b>סוגריים</b>: קודם מחשבים את מה שמתחתיו, ורק אחר כך מוציאים שורש.
        <div class="formula">$\\sqrt{9 + 16} = \\sqrt{25} = 5$ &nbsp; אבל &nbsp; $\\sqrt{9} + \\sqrt{16} = 3 + 4 = 7$</div>
        ו־$3\\sqrt{25}$ פירושו $3 \\cdot \\sqrt{25} = 3 \\cdot 5 = 15$.</div>
      <div class="idea"><b>המשוואה $x^2 = c$</b>
        $c$ חיובי ← <b>שני פתרונות</b>: $x = \\sqrt{c}$ או $x = -\\sqrt{c}$. למשל $x^2 = 25$ ← $x = 5$ או $x = -5$, כי גם $(-5)^2 = 25$.<br>
        $c = 0$ ← <b>פתרון אחד</b>: $x = 0$.<br>
        $c$ שלילי ← <b>אין פתרון</b>: ריבוע של מספר אף פעם לא שלילי.</div>
      <div class="note"><b>משוואה מסובכת יותר?</b> קודם מבודדים את $x^2$, כמו במשוואה רגילה:<br>
        $2x^2 - 8 = 42$ ← $2x^2 = 50$ ← $x^2 = 25$ ← $x = \\pm 5$.</div>
      <p class="muted">טיפ: $\\sqrt{20}$ הוא לא מספר שלם. הוא בין 4 ל־5, כי $4^2 = 16$ ו־$5^2 = 25$.</p>`,

    example: {
      question: 'פתרו את המשוואה: $3x^2 - 7 = 41$',
      steps: [
        'המטרה: לבודד את $x^2$ לבד באגף אחד, כמו שמבודדים $x$ במשוואה רגילה.',
        'מוסיפים 7 לשני האגפים: $3x^2 = 48$.',
        'מחלקים ב־3 את שני האגפים: $x^2 = 16$.',
        'שואלים: איזה מספר בריבוע נותן 16? גם $4$ וגם $-4$, כי $4 \\cdot 4 = 16$ ו־$(-4) \\cdot (-4) = 16$.',
        'לכן יש <b>שני פתרונות</b>: $x = 4$ או $x = -4$.',
        'בדיקה: $3 \\cdot 4^2 - 7 = 48 - 7 = 41$ ✔ &nbsp; וגם $3 \\cdot (-4)^2 - 7 = 41$ ✔',
      ],
    },

    tools: [
      {
        title: 'הריבוע והשורש',
        desc: 'בחרו שטח של ריבוע. אורך הצלע שלו הוא השורש של השטח. כשהשטח הוא ריבוע של מספר שלם — הצלע יוצאת מספר שלם.',
        mount(el) {
          const NS = 'http://www.w3.org/2000/svg';
          const svg = document.createElementNS(NS, 'svg');
          svg.setAttribute('viewBox', '0 0 360 360'); svg.style.cssText = 'width:100%;max-width:360px;margin:0 auto;display:block';
          el.appendChild(svg);
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const draw = A => {
            const s = Math.sqrt(A), k = 300 / 12, side = s * k, n = Math.floor(s), perfect = n * n === A;
            let grid = '';
            for (let i = 1; i < 12; i++) grid += `<line x1="${30 + i * k}" y1="30" x2="${30 + i * k}" y2="330" style="stroke:var(--line)"/><line x1="30" y1="${30 + i * k}" x2="330" y2="${30 + i * k}" style="stroke:var(--line)"/>`;
            svg.innerHTML = grid + `<rect x="30" y="${330 - side}" width="${side}" height="${side}" style="fill:${perfect ? 'var(--good-soft)' : 'var(--accent-soft)'};stroke:${perfect ? 'var(--good)' : 'var(--accent)'}" stroke-width="3"/>
              <text x="${30 + side / 2}" y="${330 - side / 2 + 7}" text-anchor="middle" font-size="20" font-weight="700" style="fill:var(--ink)">${A}</text>`;
            out.innerHTML = perfect
              ? `$\\sqrt{${A}} = ${n}$ &nbsp; כי &nbsp; $${n}^2 = ${A}$ ✔ &nbsp; צלע שלמה!`
              : `$\\sqrt{${A}} \\approx ${s.toFixed(2)}$ — בין $${n}$ ל־$${n + 1}$, כי $${n}^2 = ${n * n}$ ו־$${n + 1}^2 = ${(n + 1) ** 2}$`;
            U.math(out);
          };
          U.slider(el, { label: 'שטח הריבוע', min: 1, max: 144, value: 49, onInput: draw });
        },
      },
      {
        title: 'כמה פתרונות יש ל־$x^2 = c$?',
        desc: 'הקו הכתום הוא $y = c$ והעקומה הכחולה היא $y = x^2$. כל נקודת מפגש היא פתרון. הזיזו את c וראו מתי יש 2 פתרונות, 1 או אף אחד.',
        mount(el) {
          const st = { c: 9 };
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const brd = U.board(el, [-6, 18, 6, -6]);
          brd.create('functiongraph', [x => x * x], { strokeColor: '#2f6fdb', strokeWidth: 4 });
          brd.create('functiongraph', [() => st.c], { strokeColor: '#e8702a', strokeWidth: 3 });
          const P1 = brd.create('point', [() => Math.sqrt(Math.max(st.c, 0)), () => st.c], { name: '', color: '#e8702a', size: 5, fixed: true });
          const P2 = brd.create('point', [() => -Math.sqrt(Math.max(st.c, 0)), () => st.c], { name: '', color: '#e8702a', size: 5, fixed: true });
          const upd = () => {
            const c = st.c, r = Math.sqrt(Math.abs(c)), rs = Number.isInteger(r) ? String(r) : `\\sqrt{${c}} \\approx ${r.toFixed(2)}`;
            out.innerHTML = `$x^2 = ${c}$ &nbsp;←&nbsp; ` + (c > 0 ? `<b>שני פתרונות</b>: $x = ${rs}$ או $x = -${Number.isInteger(r) ? r : `\\sqrt{${c}}`}$`
              : c === 0 ? '<b>פתרון אחד</b>: $x = 0$' : '<b>אין פתרון</b> — הקו מתחת לעקומה, ריבוע אף פעם לא שלילי');
            P1.setAttribute({ visible: c >= 0 }); P2.setAttribute({ visible: c > 0 });
            U.math(out); brd.update();
          };
          U.slider(el, { label: 'c', min: -5, max: 16, value: st.c, onInput: v => { st.c = v; upd(); } });
        },
      },
      {
        title: 'שורש או לא שורש? סדר פעולות',
        desc: 'לחצו על "הצעד הבא" כדי לראות את סדר הפעולות. זכרו: מה שמתחת לשורש מחשבים קודם, כמו סוגריים.',
        mount(el) {
          el.insertAdjacentHTML('beforeend', `<div class="readout top"></div><ol class="steps" style="direction:rtl"></ol>
            <div class="row" style="justify-content:center"><button class="btn go">הצעד הבא ←</button><button class="btn ghost new">תרגיל חדש</button></div>`);
          const top = el.querySelector('.top'), ol = el.querySelector('ol'), go = el.querySelector('.go');
          let steps, k;
          const fresh = () => {
            const [a, b, c] = U.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 6, 10], [9, 12, 15]]);
            const m = U.R(2, 4), n = U.R(2, 9);
            if (Math.random() < 0.5) {
              top.innerHTML = `$\\sqrt{${a * a} + ${b * b}}$ &nbsp; מול &nbsp; $\\sqrt{${a * a}} + \\sqrt{${b * b}}$`;
              steps = [`בראשון: קודם מחברים מתחת לשורש: $${a * a} + ${b * b} = ${c * c}$.`, `$\\sqrt{${c * c}} = ${c}$.`,
                `בשני: כל שורש לבד: $\\sqrt{${a * a}} = ${a}$ ו־$\\sqrt{${b * b}} = ${b}$, ואז מחברים: $${a + b}$.`, `$${c} \\ne ${a + b}$ — לכן <b>אסור</b> לפרק שורש של סכום!`];
            } else {
              top.innerHTML = `$${m}\\sqrt{${n * n}} - ${n}$`;
              steps = [`$${m}\\sqrt{${n * n}}$ פירושו $${m} \\cdot \\sqrt{${n * n}}$.`, `קודם השורש: $\\sqrt{${n * n}} = ${n}$.`,
                `אחר כך כפל: $${m} \\cdot ${n} = ${m * n}$.`, `ובסוף חיסור: $${m * n} - ${n} = ${m * n - n}$.`];
            }
            k = 0; ol.innerHTML = ''; go.disabled = false; U.math(top);
          };
          go.onclick = () => {
            const li = document.createElement('li'); li.innerHTML = steps[k++]; ol.appendChild(li); U.math(li);
            if (k >= steps.length) go.disabled = true;
          };
          el.querySelector('.new').onclick = fresh;
          fresh();
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        const n = U.R(1, 15);
        return {
          q: `חשבו: $\\sqrt{${n * n}}$`, type: 'number', answer: n,
          hint: `איזה מספר כפול עצמו נותן $${n * n}$?`,
          steps: [`מחפשים מספר חיובי שבריבוע נותן $${n * n}$.`, `$${n} \\cdot ${n} = ${n * n}$`, `לכן $\\sqrt{${n * n}} = ${n}$.`],
        };
      } },
      { level: 1, gen() {
        const n = U.R(1, 12);
        return {
          q: `פתרו: $x^2 = ${n * n}$ (כתבו את שני הפתרונות)`, type: 'set', n: 2, answer: [n, -n],
          hint: `איזה מספר בריבוע נותן $${n * n}$? אל תשכח שגם מספר שלילי בריבוע יוצא חיובי.`,
          steps: [`$${n}^2 = ${n * n}$, וגם $(-${n})^2 = ${n * n}$.`, `לכן $x = ${n}$ או $x = -${n}$.`],
        };
      } },
      { level: 1, gen() {
        const n = U.R(2, 10), m = U.R(2, 5), plus = Math.random() < 0.5, k = U.R(1, 9);
        const q = plus ? `\\sqrt{${n * n}} + ${k}` : `${m}\\sqrt{${n * n}}`, ans = plus ? n + k : m * n;
        return {
          q: `חשבו: $${q}$`, type: 'number', answer: ans,
          hint: 'קודם מחשבים את השורש, ורק אחר כך את שאר הפעולות.',
          steps: [`$\\sqrt{${n * n}} = ${n}$`, plus ? `$${n} + ${k} = ${ans}$` : `$${m}\\sqrt{${n * n}}$ פירושו $${m} \\cdot ${n} = ${ans}$`],
        };
      } },
      { level: 1, gen() {
        const kind = U.R(0, 2), c = kind === 0 ? U.pick([4, 9, 16, 25, 36, 7, 10]) : kind === 1 ? 0 : -U.R(1, 25);
        return {
          q: `כמה פתרונות יש למשוואה $x^2 = ${c}$?`, type: 'choice', choices: COUNT, answer: kind,
          hint: 'בדקו את המספר באגף ימין: חיובי, אפס או שלילי?',
          steps: [kind === 0 ? `$${c}$ חיובי ← שני פתרונות: $x = \\sqrt{${c}}$ או $x = -\\sqrt{${c}}$.`
            : kind === 1 ? 'רק $0 \\cdot 0 = 0$ ← פתרון אחד: $x = 0$.' : `ריבוע של מספר אף פעם לא שלילי, ולכן אין מספר שבריבוע נותן $${c}$ ← אין פתרון.`],
        };
      } },
      { level: 2, gen() {
        const [a, b, c] = U.pick([[3, 4, 5], [6, 8, 10], [5, 12, 13], [8, 15, 17], [9, 12, 15], [12, 16, 20]]);
        const sub = Math.random() < 0.5;
        const q = sub ? `\\sqrt{${c * c} - ${a * a}}` : `\\sqrt{${a * a} + ${b * b}}`, ans = sub ? b : c;
        return {
          q: `חשבו: $${q}$`, type: 'number', answer: ans,
          hint: 'השורש הוא כמו סוגריים: קודם מחשבים את מה שמתחתיו, ורק אחר כך מוציאים שורש.',
          steps: [sub ? `מתחת לשורש: $${c * c} - ${a * a} = ${b * b}$` : `מתחת לשורש: $${a * a} + ${b * b} = ${c * c}$`, `$\\sqrt{${ans * ans}} = ${ans}$`,
            `שימו לב: ${sub ? `$\\sqrt{${c * c}} - \\sqrt{${a * a}} = ${c - a}$` : `$\\sqrt{${a * a}} + \\sqrt{${b * b}} = ${a + b}$`} — זו <b>לא</b> התשובה!`],
        };
      } },
      { level: 2, gen() {
        const a = U.R(2, 6), n = U.R(1, 8);
        return {
          q: `פתרו: $${ax2(a)} = ${a * n * n}$ (כתבו את שני הפתרונות)`, type: 'set', n: 2, answer: [n, -n],
          hint: `קודם מחלקים את שני האגפים ב־$${a}$ כדי לקבל $x^2$ לבד.`,
          steps: [`מחלקים ב־$${a}$: $x^2 = ${n * n}$`, `$x = ${n}$ או $x = -${n}$`],
        };
      } },
      { level: 2, gen() {
        let N; do { N = U.R(2, 150); } while (Number.isInteger(Math.sqrt(N)));
        const n = Math.floor(Math.sqrt(N));
        return {
          q: `$\\sqrt{${N}}$ נמצא בין שני מספרים שלמים עוקבים. מה <b>הקטן</b> מביניהם?`, type: 'number', answer: n,
          hint: `חפשו את הריבועים שקרובים ל־$${N}$: איזה ריבוע קטן ממנו ואיזה גדול ממנו?`,
          steps: [`$${n}^2 = ${n * n}$ — קטן מ־$${N}$.`, `$${n + 1}^2 = ${(n + 1) ** 2}$ — גדול מ־$${N}$.`, `לכן $${n} < \\sqrt{${N}} < ${n + 1}$, והקטן הוא $${n}$.`],
        };
      } },
      { level: 2, gen() {
        const s = U.R(5, 20);
        return {
          q: `מגרש אימון ריבועי, ושטחו ${s * s} מ״ר. מה אורך הצלע של המגרש (במטרים)?`, type: 'number', answer: s,
          hint: 'שטח ריבוע = צלע כפול צלע. איזה מספר כפול עצמו נותן את השטח?',
          steps: [`נסמן את הצלע ב־$x$: $x^2 = ${s * s}$.`, `$x = \\sqrt{${s * s}} = ${s}$ (צלע לא יכולה להיות שלילית, אז הפתרון $-${s}$ לא מתאים).`],
        };
      } },
      { level: 3, gen() {
        const a = U.R(1, 5), n = U.R(1, 9), b = U.RNZ(-20, 20), c = a * n * n + b;
        return {
          q: `פתרו: $${ax2(a)} ${U.sgn(b)} = ${c}$ (כתבו את שני הפתרונות)`, type: 'set', n: 2, answer: [n, -n],
          hint: 'מבודדים את $x^2$: קודם מעבירים את המספר הבודד, אחר כך מחלקים במקדם.',
          steps: [`${b > 0 ? 'מחסירים' : 'מוסיפים'} $${Math.abs(b)}$: $${ax2(a)} = ${a * n * n}$`, ...(a > 1 ? [`מחלקים ב־$${a}$: $x^2 = ${n * n}$`] : []), `$x = ${n}$ או $x = -${n}$`],
        };
      } },
      { level: 3, gen() {
        const kind = U.R(0, 2), a = U.R(1, 4), b = U.RNZ(-15, 15), v = kind === 0 ? U.pick([1, 4, 9, 16]) : kind === 1 ? 0 : -U.R(1, 6), c = a * v + b;
        return {
          q: `כמה פתרונות יש למשוואה $${ax2(a)} ${U.sgn(b)} = ${c}$?`, type: 'choice', choices: COUNT, answer: kind,
          hint: 'מבודדים את $x^2$ ובודקים: האם יצא מספר חיובי, אפס או שלילי?',
          steps: [`${b > 0 ? 'מחסירים' : 'מוסיפים'} $${Math.abs(b)}$: $${ax2(a)} = ${a * v}$`, ...(a > 1 ? [`מחלקים ב־$${a}$: $x^2 = ${v}$`] : []),
            kind === 0 ? `$${v}$ חיובי ← שני פתרונות ($x = \\pm${Math.sqrt(v)}$).` : kind === 1 ? '$x^2 = 0$ ← פתרון אחד ($x = 0$).' : `$${v}$ שלילי ← אין פתרון.`],
        };
      } },
      { level: 3, gen() {
        const n = U.R(3, 12), k = U.R(1, Math.min(30, n * n - 1));
        return {
          q: `חושבים על מספר <b>שלילי</b>. מעלים אותו בריבוע ומחסירים ${k}, ומקבלים ${n * n - k}. מה המספר?`, type: 'number', answer: -n,
          hint: `נסמן את המספר ב־$x$ ונכתוב: $x^2 - ${k} = ${n * n - k}$. יצאו שני פתרונות — איזה מהם שלילי?`,
          steps: [`$x^2 - ${k} = ${n * n - k}$`, `מוסיפים $${k}$: $x^2 = ${n * n}$`, `$x = ${n}$ או $x = -${n}$`, `המספר שלילי, לכן $x = -${n}$.`],
        };
      } },
    ],

    summary: [
      '$\\sqrt{49} = 7$ כי $7^2 = 49$. השורש הוא תמיד מספר לא שלילי, ואין שורש למספר שלילי.',
      'בסדר פעולות, השורש הוא כמו סוגריים: $\\sqrt{9 + 16} = 5$ ולא $3 + 4$.',
      '$x^2 = c$: אם $c > 0$ ← שני פתרונות ($\\pm\\sqrt{c}$), אם $c = 0$ ← פתרון אחד, אם $c < 0$ ← אין פתרון.',
      'במשוואה כמו $2x^2 - 8 = 42$: קודם מבודדים את $x^2$, ואז מוציאים שורש.',
      'אל תשכח את הפתרון השלילי! $x^2 = 25$ ← $x = 5$ <b>או</b> $x = -5$.',
    ],
  });
})();
