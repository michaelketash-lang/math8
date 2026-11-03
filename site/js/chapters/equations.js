/* יחידה: משוואות — חזרה ומספר הפתרונות (פרק 1 בספר) */
(() => {
  const p = n => (n < 0 ? `(${n})` : `${n}`); // מספר שלילי בסוגריים אחרי פעולה
  /** איך מבטלים איבר n (או n·x): מחסירים/מוסיפים, בשני האגפים */
  const op = (n, v = '') => (n > 0 ? `מחסירים $${U.term(n, v) || n}$ משני האגפים` : `מוסיפים $${U.term(-n, v) || -n}$ לשני האגפים`);

  registerChapter('equations', {
    intro: `
      <p><b>משוואה</b> היא כמו מאזניים: מה שמשמאל לסימן $=$ שווה בדיוק למה שמימין. כל צד נקרא <b>אגף</b>.
        <b>לפתור</b> משוואה = למצוא את המספר שאפשר לשים במקום $x$ (הנעלם) כך שהמאזניים יהיו מאוזנים.</p>
      <div class="idea"><b>חוק הזהב</b>מה שעושים לאגף אחד — עושים גם לאגף השני. מוסיפים, מחסירים, כופלים או מחלקים (לא באפס) — בשני האגפים, ואז המאזניים נשארים מאוזנים.</div>
      <div class="idea"><b>סדר הפעולות בפתרון</b>1. פותחים סוגריים: $3(x + 2) = 3x + 6$.
        <br>2. מעבירים את כל ה־$x$ לאגף אחד ואת כל המספרים לאגף השני.
        <br>3. מחלקים במספר שליד $x$.
        <br>4. בודקים: מציבים את התשובה במשוואה המקורית.</div>
      <div class="idea"><b>כמה פתרונות יש?</b>בדרך כלל יש <b>פתרון אחד</b>. אבל לפעמים ה־$x$ נעלם לגמרי:
        <br>אם נשאר משפט <b>נכון</b> כמו $6 = 6$ ← <b>אין־סוף פתרונות</b> (כל מספר מתאים).
        <br>אם נשאר משפט <b>לא נכון</b> כמו $6 = 9$ ← <b>אין פתרון</b> (שום מספר לא מתאים).</div>
      <div class="note"><b>שאלה מילולית — 3 צעדים</b><br>מסמנים את מה שלא יודעים ב־$x$ ← כותבים משוואה לפי הסיפור ← פותרים ובודקים שהתשובה הגיונית.</div>
      <p class="muted">טיפ: כשמחסירים מספר שלילי או מכפילים בו — שים סוגריים, ככה לא מתבלבלים בסימנים.</p>`,

    example: {
      question: 'פתרו את המשוואה: $3(x + 2) = 5x - 4$',
      steps: [
        'פותחים סוגריים: כופלים את $3$ בכל אחד מהאיברים שבפנים. $3 \\cdot x + 3 \\cdot 2 = 3x + 6$.',
        'עכשיו המשוואה: $3x + 6 = 5x - 4$.',
        'מעבירים את ה־$x$־ים לאגף אחד: מחסירים $3x$ משני האגפים (ככה נשאר $x$ חיובי). $6 = 2x - 4$.',
        'מעבירים את המספרים לאגף השני: מוסיפים $4$ לשני האגפים. $10 = 2x$.',
        'מחלקים ב־$2$ את שני האגפים: $x = 5$.',
        'בדיקה באגף שמאל: $3(5 + 2) = 3 \\cdot 7 = 21$.',
        'בדיקה באגף ימין: $5 \\cdot 5 - 4 = 21$. שני האגפים שווים ✔ — הפתרון הוא $x = 5$.',
      ],
    },

    tools: [
      {
        title: '🧭 פותרים בעצמך, צעד אחרי צעד',
        desc: 'אתה מחליט מה לעשות בכל צעד, והמשוואה משתנה לפי מה שבחרת. נתקעת? לחץ "מה הצעד הבא?".',
        mount: el => Guided.mount(el, {}),
      },
      {
        title: 'מאזני המשוואה',
        desc: 'בחרו משוואה והזיזו את x. כשהמאזניים מאוזנים — מצאתם פתרון. נסו גם את המשוואות שאין להן פתרון או שיש להן אין־סוף פתרונות.',
        mount(el) {
          const EQS = [
            { tex: '3x + 2 = x + 8', L: x => 3 * x + 2, R: x => x + 8, msg: 'יש פתרון אחד בלבד.' },
            { tex: '2x + 3 = 2x + 5', L: x => 2 * x + 3, R: x => 2 * x + 5, msg: 'אגף ימין תמיד גדול ב־2. אין פתרון!' },
            { tex: '2(x + 1) = 2x + 2', L: x => 2 * (x + 1), R: x => 2 * x + 2, msg: 'שני האגפים תמיד שווים. אין־סוף פתרונות!' },
          ];
          let cur = EQS[0], x = 0;
          const row = document.createElement('div'); row.className = 'row'; row.style.justifyContent = 'center'; el.appendChild(row);
          EQS.forEach(e => {
            const b = document.createElement('button'); b.className = 'btn ghost'; b.innerHTML = `$${e.tex}$`;
            b.onclick = () => { cur = e; draw(); }; row.appendChild(b);
          });
          el.insertAdjacentHTML('beforeend', `<svg viewBox="0 0 400 220" style="width:100%;max-width:460px;margin:0 auto;display:block" dir="ltr">
            <polygon points="200,120 180,200 220,200" fill="#8a7f6a"/>
            <g class="beam"><line x1="60" y1="120" x2="340" y2="120" stroke="#8a7f6a" stroke-width="8" stroke-linecap="round"/>
              <line x1="80" y1="120" x2="80" y2="150" stroke="#8a7f6a" stroke-width="3"/><line x1="320" y1="120" x2="320" y2="150" stroke="#8a7f6a" stroke-width="3"/>
              <rect x="30" y="150" width="100" height="10" rx="4" fill="#e8702a"/><rect x="270" y="150" width="100" height="10" rx="4" fill="#2f6fdb"/>
              <text class="lv" x="80" y="185" text-anchor="middle" font-size="22" fill="currentColor"></text>
              <text class="rv" x="320" y="185" text-anchor="middle" font-size="22" fill="currentColor"></text></g>
            <circle cx="200" cy="120" r="7" fill="#5d5442"/></svg>
            <div class="readout eqline"></div><div class="readout verdict"></div>`);
          const beam = el.querySelector('.beam'), eqline = el.querySelector('.eqline'), verdict = el.querySelector('.verdict');
          const draw = () => {
            const l = cur.L(x), r = cur.R(x), diff = l - r;
            const ang = Math.max(-18, Math.min(18, diff * 3)); // הצד הכבד יורד
            beam.setAttribute('transform', `rotate(${-ang} 200 120)`);
            beam.querySelector('.lv').textContent = U.num(l); beam.querySelector('.rv').textContent = U.num(r);
            eqline.innerHTML = `$${cur.tex}$<br>כש־$x = ${x}$ ← אגף שמאל: $${U.num(l)}$ · אגף ימין: $${U.num(r)}$`;
            verdict.innerHTML = diff === 0 ? `✔ מאוזן! $x = ${x}$ הוא פתרון. ${cur.msg}` : diff > 0 ? 'אגף שמאל כבד יותר. נסו x אחר.' : 'אגף ימין כבד יותר. נסו x אחר.';
            if (diff !== 0 && cur !== EQS[0]) verdict.innerHTML += ' ' + cur.msg;
            U.math(eqline); U.math(verdict);
          };
          U.slider(el, { label: 'הערך של x', min: -5, max: 8, step: 1, value: 0, onInput: v => { x = v; draw(); } });
          U.math(row);
        },
      },
      {
        title: 'פותר צעד אחרי צעד',
        desc: 'בכל שלב בחרו מה הפעולה הנכונה. אם תבחרו פעולה שעוד לא מתאימה — תקבלו רמז.',
        mount(el) {
          el.insertAdjacentHTML('beforeend', `<ol class="steps work" dir="rtl"></ol><div class="row ops" style="justify-content:center"></div><div class="readout msg"></div>`);
          const work = el.querySelector('.work'), ops = el.querySelector('.ops'), msg = el.querySelector('.msg');
          const OPS = ['פתיחת סוגריים', 'העברת x לאגף אחד', 'העברת מספרים לאגף השני', 'חילוק במקדם של x'];
          let st;
          const fresh = () => {
            let a, b, c, d, x;
            do { a = U.R(2, 5); b = U.RNZ(-4, 5); x = U.RNZ(-5, 6); c = U.RNZ(-3, 6); } while (c === a);
            d = a * x + a * b - c * x;
            st = { a, b, c, d, x, k: 0 };
            // שורות הפתרון; k = מספר הפעולות שבוצעו
            st.lines = [
              `$${a}(${U.lin(1, b)}) = ${U.lin(c, d)}$`,
              `$${U.lin(a, a * b)} = ${U.lin(c, d)}$`,
              `$${U.lin(a - c, a * b)} = ${d}$`,
              `$${U.term(a - c)} = ${d - a * b}$`,
              `$x = ${x}$ ✔`,
            ];
            st.why = [
              `כופלים את $${a}$ בכל איבר בסוגריים.`,
              `${op(c, 'x')}.`,
              `${op(a * b)}.`,
              `מחלקים את שני האגפים ב־$${p(a - c)}$.`,
            ];
            work.innerHTML = `<li>${st.lines[0]}</li>`; msg.textContent = 'מה עושים קודם?'; U.math(work);
          };
          OPS.forEach((t, i) => {
            const b = document.createElement('button'); b.className = 'btn ghost'; b.textContent = t;
            b.onclick = () => {
              if (st.k >= 4) return;
              if (i !== st.k) { msg.innerHTML = i < st.k ? 'את זה כבר עשינו.' : 'עוד לא. ' + ['קודם פותחים סוגריים.', 'קודם אוספים את ה־x לאגף אחד.', 'קודם מעבירים את המספרים.'][st.k]; return; }
              st.k++;
              work.insertAdjacentHTML('beforeend', `<li>${st.lines[st.k]} <span class="muted">— ${st.why[st.k - 1]}</span></li>`);
              msg.innerHTML = st.k === 4 ? '🏀 סל! פתרת את המשוואה. <button class="btn">משוואה חדשה</button>' : 'נכון! מה הלאה?';
              msg.querySelector('button')?.addEventListener('click', fresh);
              U.math(work); U.math(msg);
            };
            ops.appendChild(b);
          });
          fresh();
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        const x = U.R(-6, 15), a = U.RNZ(-9, 9), b = x + a;
        return {
          q: `פתרו: $${U.lin(1, a)} = ${b}$`,
          type: 'number', answer: x,
          hint: `כדי לבודד את $x$, צריך "לבטל" את ה־$${U.sgn(a).replace(' ', '')}$. עושים את הפעולה ההפוכה בשני האגפים.`,
          steps: [`${op(a)}.`, `$x = ${b} ${a > 0 ? '-' : '+'} ${Math.abs(a)} = ${x}$`, `בדיקה: $${x} ${U.sgn(a)} = ${b}$ ✔`],
        };
      } },
      { level: 1, gen() {
        const a = U.pick([2, 3, 4, 5, 6, -2, -3, -4]), x = U.RNZ(-8, 10), b = a * x;
        return {
          q: `פתרו: $${U.term(a)} = ${b}$`,
          type: 'number', answer: x,
          hint: `$${U.term(a)}$ פירושו $${a}$ כפול $x$. הפעולה ההפוכה לכפל היא חילוק.`,
          steps: [`מחלקים את שני האגפים ב־$${p(a)}$.`, `$x = ${b} \\div ${p(a)} = ${x}$`, `בדיקה: $${a} \\cdot ${p(x)} = ${b}$ ✔`],
        };
      } },
      { level: 1, gen() {
        const a = U.R(2, 6), x = U.R(-4, 9), b = U.RNZ(-10, 10), c = a * x + b;
        return {
          q: `פתרו: $${U.lin(a, b)} = ${c}$`,
          type: 'number', answer: x,
          hint: `שני צעדים: קודם מעבירים את ה־$${Math.abs(b)}$ לאגף השני, ואחר כך מחלקים ב־$${a}$.`,
          steps: [`${op(b)}: $${U.term(a)} = ${c - b}$`, `מחלקים ב־$${a}$: $x = ${x}$`, `בדיקה: $${a} \\cdot ${p(x)} ${U.sgn(b)} = ${c}$ ✔`],
        };
      } },
      { level: 1, gen() {
        const a = U.R(2, 5), x = U.R(1, 8), b = U.R(1, 12), c = a * x + b;
        const opts = U.shuffle([...new Set([x, x + 1, x - 1, x + 2])].slice(0, 4));
        return {
          q: `איזה מספר הוא הפתרון של $${U.lin(a, b)} = ${c}$? (אפשר פשוט להציב ולבדוק)`,
          type: 'choice', choices: opts.map(v => `$x = ${v}$`), answer: opts.indexOf(x),
          hint: 'מציבים כל אפשרות במקום $x$ ובודקים באיזו מהן אגף שמאל יוצא בדיוק ' + c + '.',
          steps: [`מציבים $x = ${x}$: $${a} \\cdot ${x} + ${b} = ${a * x} + ${b} = ${c}$ ✔`, `לכן הפתרון הוא $x = ${x}$.`],
        };
      } },
      { level: 2, gen() {
        let a, c; do { a = U.RNZ(-4, 7); c = U.RNZ(-4, 7); } while (a === c);
        const x = U.R(-6, 8), b = U.R(-10, 10), d = (a - c) * x + b;
        return {
          q: `פתרו: $${U.lin(a, b)} = ${U.lin(c, d)}$`,
          type: 'number', answer: x,
          hint: `יש $x$ בשני האגפים. ${op(c, 'x')}, ואז ממשיכים כמו במשוואה רגילה.`,
          steps: [
            `${op(c, 'x')}: $${U.lin(a - c, b)} = ${d}$`,
            b ? `${op(b)}: $${U.term(a - c)} = ${d - b}$` : 'אין מספר להעביר.',
            `מחלקים ב־$${p(a - c)}$: $x = ${x}$`,
            `בדיקה: אגף שמאל: $${a * x + b}$, אגף ימין: $${c * x + d}$ ✔`,
          ],
        };
      } },
      { level: 2, gen() {
        const a = U.pick([2, 3, 4, 5, -2, -3]), b = U.RNZ(-6, 6), x = U.R(-5, 8), c = a * (x + b);
        return {
          q: `פתרו: $${a}(${U.lin(1, b)}) = ${c}$`,
          type: 'number', answer: x,
          hint: `פותחים סוגריים: כופלים את $${a}$ גם ב־$x$ וגם ב־$${b}$. (דרך קיצור: אפשר גם לחלק את שני האגפים ב־$${p(a)}$.)`,
          steps: [
            `פותחים סוגריים: $${U.lin(a, a * b)} = ${c}$`,
            `${op(a * b)}: $${U.term(a)} = ${c - a * b}$`,
            `מחלקים ב־$${p(a)}$: $x = ${x}$`,
            `בדיקה: $${a}(${x} ${U.sgn(b)}) = ${a} \\cdot ${p(x + b)} = ${c}$ ✔`,
          ],
        };
      } },
      { level: 2, gen() {
        const a = U.R(2, 5), b = U.RNZ(-6, 6), kind = U.R(0, 2);
        let c, d;
        if (kind === 0) { c = a; d = b + U.pick([-3, -2, -1, 1, 2, 3]); } // אין פתרון
        else if (kind === 1) { c = a; d = b; } // אין־סוף
        else { c = a + U.pick([-1, 1, 2]); d = b + U.RNZ(-4, 4); }
        const rhs = kind === 1 ? `${U.lin(c - 1, d)} + x` : U.lin(c, d);
        return {
          q: `כמה פתרונות יש למשוואה $${U.lin(a, b)} = ${rhs}$?`,
          type: 'choice', choices: ['פתרון אחד', 'אין פתרון', 'אין־סוף פתרונות'], answer: [1, 2, 0][kind],
          hint: 'מחסירים את ה־$x$־ים משני האגפים. אם ה־$x$ נעלם — בודקים אם מה שנשאר נכון או לא נכון.',
          steps: kind === 2
            ? [`מחסירים $${U.term(c)}$ משני האגפים: $${U.lin(a - c, b)} = ${d}$`, `נשאר $x$ במשוואה, לכן יש <b>פתרון אחד</b>.`]
            : [kind === 1 ? `באגף ימין: $${U.lin(c - 1, d)} + x = ${U.lin(c, d)}$` : `יש $${U.term(a)}$ בשני האגפים.`,
              `מחסירים $${U.term(a)}$ משני האגפים: $${b} = ${d}$`,
              kind === 1 ? `זה משפט נכון תמיד, לכל $x$ ← <b>אין־סוף פתרונות</b>.` : `זה משפט לא נכון ← <b>אין פתרון</b>.`],
        };
      } },
      { level: 3, gen() {
        let a, c; do { a = U.R(2, 6); c = U.R(2, 5); } while (a === c);
        const b = U.RNZ(-5, 5), x = U.R(-5, 7), e = U.RNZ(-5, 5), f = a * (x + b) - c * (x + e);
        return {
          q: `פתרו: $${a}(${U.lin(1, b)}) = ${c}(${U.lin(1, e)})${f ? ' ' + U.sgn(f) : ''}$`,
          type: 'number', answer: x,
          hint: 'פותחים את שני הסוגריים, ואז אוספים $x$־ים לאגף אחד ומספרים לאגף השני.',
          steps: [
            `פותחים סוגריים: $${U.lin(a, a * b)} = ${U.lin(c, c * e)}${f ? ' ' + U.sgn(f) : ''}$`,
            `מסדרים את אגף ימין: $${U.lin(a, a * b)} = ${U.lin(c, c * e + f)}$`,
            `מחסירים $${U.term(c)}$ משני האגפים: $${U.lin(a - c, a * b)} = ${c * e + f}$`,
            `${op(a * b)}: $${U.term(a - c)} = ${c * e + f - a * b}$`,
            `מחלקים ב־$${p(a - c)}$: $x = ${x}$`,
          ],
        };
      } },
      { level: 3, gen() {
        const t = U.R(0, 2);
        if (t === 0) { // שני משחקים
          const x = U.R(8, 20), k = U.R(2, 9), n = 2 * x + k;
          return {
            q: `שחקן קלע בשני משחקים ביחד $${n}$ נקודות. במשחק השני הוא קלע $${k}$ נקודות יותר מאשר בראשון. כמה נקודות קלע במשחק הראשון?`,
            type: 'number', answer: x,
            hint: `מסמנים: במשחק הראשון $x$ נקודות, אז בשני $x + ${k}$. ביחד: $x + x + ${k} = ${n}$.`,
            steps: [`ראשון: $x$, שני: $x + ${k}$.`, `משוואה: $x + x + ${k} = ${n}$, כלומר $2x + ${k} = ${n}$.`, `מחסירים $${k}$: $2x = ${n - k}$.`, `מחלקים ב־2: $x = ${x}$.`, `בדיקה: $${x} + ${x + k} = ${n}$ ✔`],
          };
        }
        if (t === 1) { // כרטיסים
          const price = U.pick([20, 25, 30, 40]), fee = U.pick([10, 15, 20, 30]), x = U.R(2, 9), total = price * x + fee;
          return {
            q: `כרטיס למשחק כדורסל עולה $${price}$ ש״ח, ועל כל ההזמנה משלמים עוד $${fee}$ ש״ח דמי משלוח. דני שילם בסך הכול $${total}$ ש״ח. כמה כרטיסים קנה?`,
            type: 'number', answer: x,
            hint: `מסמנים את מספר הכרטיסים ב־$x$. המחיר: $${price}x + ${fee}$. משווים ל־$${total}$.`,
            steps: [`$x$ = מספר הכרטיסים.`, `משוואה: $${price}x + ${fee} = ${total}$`, `מחסירים $${fee}$: $${price}x = ${total - fee}$`, `מחלקים ב־$${price}$: $x = ${x}$`, `בדיקה: $${price} \\cdot ${x} + ${fee} = ${total}$ ✔`],
          };
        }
        const x = U.R(4, 12), k = U.pick([2, 3]), m = U.R(2, 8), n = x + k * x + m; // שלשות ונקודות
        return {
          q: `לנועה יש $x$ סלים בעונה, ולמאיה פי $${k}$ מנועה ועוד $${m}$. לשתיהן ביחד יש $${n}$ סלים. כמה סלים יש לנועה?`,
          type: 'number', answer: x,
          hint: `למאיה יש $${k}x + ${m}$. ביחד: $x + ${k}x + ${m} = ${n}$.`,
          steps: [`נועה: $x$, מאיה: $${k}x + ${m}$.`, `משוואה: $x + ${k}x + ${m} = ${n}$, כלומר $${k + 1}x + ${m} = ${n}$.`, `מחסירים $${m}$: $${k + 1}x = ${n - m}$.`, `מחלקים ב־$${k + 1}$: $x = ${x}$.`, `בדיקה: $${x} + ${k * x + m} = ${n}$ ✔`],
        };
      } },
      { level: 3, gen() {
        const a = U.R(2, 4), b = U.RNZ(-5, 5), kind = U.R(0, 2);
        // a(x + b) מול ביטוי שנראה שונה
        const c = kind === 2 ? a + 1 : a;
        const d = kind === 1 ? a * b : kind === 0 ? a * b + U.pick([-2, -1, 1, 2]) : a * b + U.RNZ(-3, 3);
        const k = U.R(1, c - 1); // אגף ימין מפוצל: kx + d + (c−k)x
        const rhs = `${U.term(k)}${d ? ' ' + U.sgn(d) : ''} + ${U.term(c - k)}`;
        return {
          q: `כמה פתרונות יש למשוואה $${a}(${U.lin(1, b)}) = ${rhs}$?`,
          type: 'choice', choices: ['פתרון אחד', 'אין פתרון', 'אין־סוף פתרונות'], answer: [1, 2, 0][kind],
          hint: 'פותחים סוגריים באגף שמאל ומסדרים את אגף ימין. אחר כך משווים: האם ה־$x$ נעלם?',
          steps: [
            `אגף שמאל: $${U.lin(a, a * b)}$. אגף ימין: $${U.lin(c, d)}$.`,
            `מחסירים $${U.term(c)}$ משני האגפים: $${U.lin(a - c, a * b)} = ${d}$`,
            kind === 2 ? `נשאר $x$ ← <b>פתרון אחד</b> ($x = ${a * b - d}$).`
              : kind === 1 ? `$${a * b} = ${d}$ — נכון תמיד ← <b>אין־סוף פתרונות</b>.` : `$${a * b} = ${d}$ — לא נכון ← <b>אין פתרון</b>.`,
          ],
        };
      } },
    ],

    summary: [
      'משוואה = מאזניים. מה שעושים לאגף אחד — עושים גם לשני.',
      'סדר: פותחים סוגריים ← $x$־ים לאגף אחד, מספרים לשני ← מחלקים במקדם של $x$.',
      'תמיד בודקים: מציבים את הפתרון במשוואה המקורית ורואים ששני האגפים שווים.',
      'אם $x$ נעלם ונשאר משפט נכון ($5 = 5$) ← אין־סוף פתרונות. משפט לא נכון ($5 = 8$) ← אין פתרון.',
      'בשאלה מילולית: מסמנים $x$, כותבים משוואה לפי הסיפור, פותרים ובודקים שהתשובה הגיונית.',
    ],
  });
})();
