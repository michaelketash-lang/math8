/* יחידה: הפונקציה הקווית y = mx + b (פרקים 5–6 בספר) — יחידת הדגמה לשאר היחידות */
registerChapter('linear', {
  intro: `
    <p>פונקציה קווית היא פונקציה שהגרף שלה הוא <b>קו ישר</b>. כותבים אותה כך:</p>
    <div class="formula">$y = mx + b$</div>
    <div class="idea"><b>m — השיפוע</b>בכמה $y$ משתנה כשהולכים צעד אחד ימינה ($x$ גדל ב־1).
      <br>↗ $m$ חיובי ← הקו <b>עולה</b>
      <br>↘ $m$ שלילי ← הקו <b>יורד</b>
      <br>→ $m = 0$ ← הקו <b>קבוע</b> (שטוח)</div>
    <div class="idea"><b>b — נקודת החיתוך עם ציר ה־y</b>הקו תמיד חותך את ציר ה־$y$ בנקודה $(0, b)$.
      <br>כשמגדילים את $b$ הקו כולו זז <b>למעלה</b>, וכשמקטינים אותו הוא זז <b>למטה</b>. השיפוע לא משתנה.</div>
    <div class="note"><b>הכתיב f(x)</b><br>
      במקום $y = 2x + 3$ אפשר לכתוב $f(x) = 2x + 3$. הכתיב $f(4)$ אומר: "מה יוצא כשמציבים $x = 4$?"
      <br>$f(4) = 2 \\cdot 4 + 3 = 11$ — כלומר הנקודה $(4, 11)$ נמצאת על הגרף.</div>
    <p class="muted">טיפ: האיש שהולך על הגרף תמיד הולך <b>ימינה</b>. אם הוא מטפס — הפונקציה עולה.</p>`,

  example: {
    question: 'נתונה הפונקציה $f(x) = 2x - 3$.<br>א. מה השיפוע ומה נקודת החיתוך עם ציר ה־y? ב. חשבו את $f(4)$. ג. עבור איזה $x$ מתקיים $f(x) = 5$?',
    steps: [
      'משווים לתבנית $y = mx + b$: המספר שליד $x$ הוא $m = 2$, והמספר הבודד הוא $b = -3$.',
      'לכן הקו <b>עולה</b> (כי $m = 2$ חיובי), והוא חותך את ציר ה־y בנקודה $(0, -3)$.',
      'סעיף ב: מציבים $x = 4$ במקום כל $x$: $f(4) = 2 \\cdot 4 - 3$.',
      '$f(4) = 8 - 3 = 5$. כלומר הנקודה $(4, 5)$ על הגרף.',
      'סעיף ג: עכשיו נותנים לנו את התוצאה ומחפשים את $x$. כותבים משוואה: $2x - 3 = 5$.',
      'מוסיפים 3 לשני האגפים: $2x = 8$. מחלקים ב־2: $x = 4$.',
      'בדיקה: $f(4) = 5$ ✔ — בדיוק מה שמצאנו בסעיף ב.',
    ],
  },

  tools: [
    {
      title: 'המעבדה של y = mx + b',
      desc: 'הזיזו את הסליידרים וראו מה כל מספר עושה לקו. המשולש הכתום מראה את השיפוע: צעד אחד ימינה, ו־m צעדים למעלה (או למטה).',
      mount(el) {
        const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
        const st = { m: 1, b: 2 };
        const brd = U.board(el, [-8, 8, 8, -8]);
        brd.create('functiongraph', [x => st.m * x + st.b], { strokeColor: '#2f6fdb', strokeWidth: 4 });
        brd.create('point', [0, () => st.b], { name: '(0, b)', color: '#e8702a', size: 5, fixed: true, label: { offset: [10, 10] } });
        // משולש שיפוע מ־(0,b): ימינה 1 ואז m למעלה
        const A = brd.create('point', [0, () => st.b], { visible: false });
        const B = brd.create('point', [1, () => st.b], { visible: false });
        const C = brd.create('point', [1, () => st.b + st.m], { visible: false });
        brd.create('segment', [A, B], { strokeColor: '#e8702a', strokeWidth: 3, dash: 2 });
        brd.create('segment', [B, C], { strokeColor: '#e8702a', strokeWidth: 3, dash: 2 });
        brd.create('text', [1.2, () => st.b + st.m / 2, () => 'm = ' + U.num(st.m)], { fontSize: 16, color: '#e8702a' });
        const upd = () => {
          const dir = st.m > 0 ? 'עולה ↗' : st.m < 0 ? 'יורדת ↘' : 'קבועה →';
          out.innerHTML = `$y = ${U.lin(st.m, st.b)}$ &nbsp;·&nbsp; הפונקציה <b>${dir}</b>`;
          U.math(out); brd.update();
        };
        U.slider(el, { label: 'שיפוע m', min: -4, max: 4, step: 0.5, value: st.m, onInput: v => { st.m = v; upd(); } });
        U.slider(el, { label: 'חיתוך b', min: -6, max: 6, step: 1, value: st.b, onInput: v => { st.b = v; upd(); } });
      },
    },
    {
      title: 'מכונת ה־f(x)',
      desc: 'בחרו x והמכונה תראה איך מחשבים את f(x) צעד אחרי צעד. כל תוצאה נהיית נקודה על הגרף.',
      mount(el) {
        const m = U.pick([2, 3, -2, 0.5, -1]), b = U.pick([1, -2, 3, -4]);
        el.insertAdjacentHTML('beforeend', `<div class="readout">$f(x) = ${U.lin(m, b)}$</div>
          <div class="row" style="justify-content:center"></div><div class="readout calc">לחצו על מספר ←</div>`);
        const row = el.querySelector('.row'), calc = el.querySelector('.calc');
        const brd = U.board(el, [-5, 12, 5, -12]);
        brd.create('functiongraph', [x => m * x + b], { strokeColor: '#2f6fdb', strokeWidth: 2, dash: 2, strokeOpacity: 0.4 });
        for (const x of [-3, -2, -1, 0, 1, 2, 3]) {
          const btn = document.createElement('button'); btn.className = 'btn ghost'; btn.textContent = `x = ${U.num(x)}`; btn.dir = 'ltr';
          btn.onclick = () => {
            const y = m * x + b;
            calc.innerHTML = `$f(${x}) = ${m} \\cdot ${x < 0 ? `(${x})` : x} ${U.sgn(b)} = ${U.num(m * x)} ${U.sgn(b)} = ${U.num(y)}$ &nbsp;←&nbsp; הנקודה $(${x}, ${U.num(y)})$`;
            U.math(calc);
            brd.create('point', [x, y], { name: '', color: '#e8702a', size: 4, fixed: true });
          };
          row.appendChild(btn);
        }
        U.math(el);
      },
    },
    {
      title: 'משחק: תפסו את הקו',
      desc: 'על הלוח יש קו מקווקו. כוונו את m ואת b כך שהקו הכחול יעלה עליו בדיוק.',
      mount(el) {
        const st = { m: 0, b: 0 }; let target;
        const msg = document.createElement('div'); msg.className = 'readout'; el.appendChild(msg);
        const brd = U.board(el, [-8, 8, 8, -8]);
        const newTarget = () => { do { target = { m: U.pick([-3, -2, -1, -0.5, 0.5, 1, 2, 3]), b: U.R(-5, 5) }; } while (target.m === st.m && target.b === st.b); };
        newTarget();
        brd.create('functiongraph', [x => target.m * x + target.b], { strokeColor: '#e8702a', strokeWidth: 4, dash: 3 });
        brd.create('functiongraph', [x => st.m * x + st.b], { strokeColor: '#2f6fdb', strokeWidth: 3 });
        const check = () => {
          brd.update();
          if (st.m === target.m && st.b === target.b) {
            msg.innerHTML = `🏀 סל! הקו הוא $y = ${U.lin(st.m, st.b)}$ <button class="btn">קו חדש</button>`;
            U.math(msg); msg.querySelector('button').onclick = () => { newTarget(); msg.textContent = 'קו חדש! נסו שוב.'; brd.update(); };
          } else msg.innerHTML = 'עוד לא... רמז: התחילו מ־b (איפה הקו חותך את ציר ה־y).';
        };
        U.slider(el, { label: 'שיפוע m', min: -3, max: 3, step: 0.5, value: 0, onInput: v => { st.m = v; check(); } });
        U.slider(el, { label: 'חיתוך b', min: -6, max: 6, step: 1, value: 0, onInput: v => { st.b = v; check(); } });
      },
    },
  ],

  exercises: [
    { level: 1, gen() {
      const m = U.RNZ(-5, 5), b = U.RNZ(-9, 9), askM = Math.random() < 0.5;
      return {
        q: `בפונקציה $y = ${U.lin(m, b)}$, מה ${askM ? 'השיפוע $m$' : 'נקודת החיתוך עם ציר ה־y (כתבו רק את $b$)'}?`,
        type: 'number', answer: askM ? m : b,
        hint: 'משווים לתבנית $y = mx + b$. המספר שצמוד ל־$x$ הוא $m$, המספר הבודד הוא $b$ (עם הסימן שלו!).',
        steps: [`התבנית: $y = mx + b$.`, `אצלנו: $y = ${U.lin(m, b)}$, ולכן $m = ${m}$ ו־$b = ${b}$.`, `התשובה: $${askM ? m : b}$.`],
      };
    } },
    { level: 1, gen() {
      const m = U.RNZ(-4, 4), b = U.R(-8, 8), x = U.R(-4, 5), y = m * x + b;
      const xs = x < 0 ? `(${x})` : x;
      return {
        q: `נתונה הפונקציה $f(x) = ${U.lin(m, b)}$. חשבו את $f(${x})$.`,
        type: 'number', answer: y,
        hint: `מציבים $${x}$ במקום $x$: $f(${x}) = ${m} \\cdot ${xs} ${b ? U.sgn(b) : ''}$. זהירות עם סימנים!`,
        steps: [`מציבים $x = ${x}$: $f(${x}) = ${m} \\cdot ${xs} ${b ? U.sgn(b) : ''}$`, `כופלים: $${m} \\cdot ${xs} = ${m * x}$`, `${b ? `מחברים: $${m * x} ${U.sgn(b)} = ${y}$` : `אין מספר להוסיף, אז $f(${x}) = ${y}$`}`],
      };
    } },
    { level: 1, gen() {
      const m = U.pick([U.R(1, 5), -U.R(1, 5), 0]), b = U.R(-6, 6);
      const ans = m > 0 ? 0 : m < 0 ? 1 : 2;
      return {
        q: `הפונקציה $y = ${U.lin(m, b)}$ היא...`,
        type: 'choice', choices: ['עולה ↗', 'יורדת ↘', 'קבועה →'], answer: ans,
        hint: 'מסתכלים רק על השיפוע $m$ (המספר שליד $x$): חיובי, שלילי או אפס?',
        steps: [`השיפוע הוא $m = ${m}$.`, m > 0 ? 'שיפוע חיובי ← הקו עולה.' : m < 0 ? 'שיפוע שלילי ← הקו יורד.' : 'אין $x$ בכלל (שיפוע 0) ← הקו קבוע.'],
      };
    } },
    { level: 1, gen() {
      const m = U.pick([-2, -1, 1, 2, 3, 0.5, -0.5]), b = U.R(-4, 4), askM = Math.random() < 0.5;
      return {
        q: askM ? 'מה השיפוע של הקו שבגרף?' : 'באיזה ערך של y הקו חותך את ציר ה־y? (כלומר, מה b?)',
        type: 'number', answer: askM ? m : b,
        mount(el) {
          const brd = U.board(el, [-6, 6, 6, -6]);
          brd.create('functiongraph', [x => m * x + b], { strokeColor: '#2f6fdb', strokeWidth: 3 });
          brd.create('point', [0, b], { name: '', color: '#e8702a', size: 3, fixed: true });
          brd.create('point', [2, 2 * m + b], { name: '', color: '#e8702a', size: 3, fixed: true });
        },
        hint: askM ? 'מהנקודה הכתומה על ציר ה־y, זוזו 2 צעדים ימינה. כמה עליתם או ירדתם? מחלקים ב־2.' : 'מחפשים איפה הקו פוגש את הקו האנכי (ציר ה־y).',
        steps: askM
          ? [`הנקודות הכתומות: $(0, ${b})$ ו־$(2, ${U.num(2 * m + b)})$.`, `ימינה 2 צעדים, ו־$y$ השתנה ב־$${U.num(2 * m)}$.`, `שיפוע = שינוי ב־y חלקי שינוי ב־x $= ${U.num(2 * m)} \\div 2 = ${U.num(m)}$.`]
          : [`הקו פוגש את ציר ה־y בנקודה הכתומה $(0, ${b})$.`, `לכן $b = ${b}$.`],
      };
    } },
    { level: 2, gen() {
      const m = U.RNZ(-5, 5), b = U.R(-9, 9), x = U.R(-6, 6), c = m * x + b;
      return {
        q: `נתונה הפונקציה $f(x) = ${U.lin(m, b)}$. עבור איזה $x$ מתקיים $f(x) = ${c}$?`,
        type: 'number', answer: x,
        hint: `כותבים משוואה: $${U.lin(m, b)} = ${c}$ ופותרים אותה.`,
        steps: [`משוואה: $${U.lin(m, b)} = ${c}$`, b ? `${b > 0 ? 'מחסירים' : 'מוסיפים'} $${Math.abs(b)}$ משני האגפים: $${U.term(m)} = ${c - b}$` : 'אין מספר בודד להעביר.', `מחלקים ב־$${m}$: $x = ${c - b} \\div ${m < 0 ? `(${m})` : m} = ${x}$`, `בדיקה: $f(${x}) = ${c}$ ✔`],
      };
    } },
    { level: 2, gen() {
      const m = U.RNZ(-4, 4), b = U.R(-6, 6), x = U.R(-3, 4), onLine = Math.random() < 0.5;
      const y = m * x + b + (onLine ? 0 : U.pick([-2, -1, 1, 2]));
      return {
        q: `האם הנקודה $(${x}, ${y})$ נמצאת על הגרף של $y = ${U.lin(m, b)}$?`,
        type: 'choice', choices: ['כן', 'לא'], answer: onLine ? 0 : 1,
        hint: `מציבים את ה־$x$ של הנקודה בפונקציה ובודקים אם יוצא ה־$y$ של הנקודה.`,
        steps: [`מציבים $x = ${x}$: $y = ${m} \\cdot ${x < 0 ? `(${x})` : x} ${b ? U.sgn(b) : ''} = ${m * x + b}$`, onLine ? `יצא $${y}$, בדיוק ה־y של הנקודה ← <b>כן</b>, הנקודה על הגרף.` : `יצא $${m * x + b}$ ולא $${y}$ ← <b>לא</b>, הנקודה לא על הגרף.`],
      };
    } },
    { level: 2, gen() {
      const m = U.RNZ(-3, 4), b = U.R(-5, 5), k = U.RNZ(-4, 4);
      return {
        q: `מזיזים את הקו $y = ${U.lin(m, b)}$ ${k > 0 ? 'למעלה' : 'למטה'} ב־${Math.abs(k)} יחידות. מה יהיה $b$ של הקו החדש?`,
        type: 'number', answer: b + k,
        hint: 'הזזה למעלה מוסיפה ל־$b$, הזזה למטה מחסירה מ־$b$. השיפוע לא משתנה.',
        steps: [`ה־$b$ המקורי הוא $${b}$.`, `${k > 0 ? 'למעלה' : 'למטה'} ב־${Math.abs(k)}: $${b} ${U.sgn(k)} = ${b + k}$.`, `הקו החדש: $y = ${U.lin(m, b + k)}$.`],
      };
    } },
    { level: 3, gen() {
      const m = U.RNZ(-4, 4), b = U.R(-8, 8), x = U.RNZ(-4, 4), y = m * x + b;
      return {
        q: `הקו $y = ${U.term(m)} + b$ עובר דרך הנקודה $(${x}, ${y})$. מצאו את $b$.`,
        type: 'number', answer: b,
        hint: `מציבים את הנקודה: $x = ${x}$ ו־$y = ${y}$, ואז פותרים משוואה עם הנעלם $b$.`,
        steps: [`מציבים: $${y} = ${m} \\cdot ${x < 0 ? `(${x})` : x} + b$`, `$${y} = ${m * x} + b$`, `מעבירים: $b = ${y} - ${m * x < 0 ? `(${m * x})` : m * x} = ${b}$`, `הקו: $y = ${U.lin(m, b)}$.`],
      };
    } },
    { level: 3, gen() {
      const m1 = U.RNZ(-3, 3); let m2; do { m2 = U.RNZ(-3, 3); } while (m2 === m1);
      const x = U.R(-4, 4), b1 = U.R(-6, 6), b2 = b1 + (m1 - m2) * x;
      return {
        q: `נתונות $f(x) = ${U.lin(m1, b1)}$ ו־$g(x) = ${U.lin(m2, b2)}$. עבור איזה $x$ מתקיים $f(x) = g(x)$?`,
        type: 'number', answer: x,
        hint: 'כותבים $f(x) = g(x)$ כמשוואה: אגף ימין = אגף שמאל. אוספים את ה־$x$־ים לצד אחד והמספרים לצד השני.',
        steps: [`$${U.lin(m1, b1)} = ${U.lin(m2, b2)}$`, `מעבירים איברים: $${U.term(m1 - m2)} = ${b2 - b1}$`, `מחלקים: $x = ${x}$`, `בדיקה: $f(${x}) = g(${x}) = ${m1 * x + b1}$ ✔`],
      };
    } },
  ],

  summary: [
    'פונקציה קווית: $y = mx + b$ — הגרף שלה הוא קו ישר.',
    '$m$ הוא השיפוע: חיובי ← עולה, שלילי ← יורד, אפס ← קבוע.',
    '$b$ הוא החיתוך עם ציר ה־y, בנקודה $(0, b)$. שינוי של $b$ מזיז את הקו למעלה או למטה.',
    '$f(4)$ = מציבים $x = 4$ ומחשבים. אם נותנים את התוצאה ($f(x) = 5$) — פותרים משוואה.',
    'נקודה נמצאת על הגרף אם כשמציבים את ה־$x$ שלה יוצא בדיוק ה־$y$ שלה.',
  ],
});
