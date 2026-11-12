/* יחידה: יחס, פרופורציה, קנה מידה ויחס הפוך (כרך א׳, פרקים 17–19) */
(() => {
const svg = (w, h, inner, extra = '') => `<svg viewBox="0 0 ${w} ${h}" width="100%" style="direction:ltr;max-width:${w}px;display:block;margin:0 auto" dir="ltr" ${extra}>${inner}</svg>`;
const big = n => Number(n).toLocaleString('en-US');           // 50000 → 50,000
const texBig = n => big(n).replace(/,/g, '{,}');                // לתוך KaTeX
const par = n => (n < 0 ? `(${n})` : n);

registerChapter('ratio', {
  intro: `
    <div class="idea"><b>מה זה יחס?</b>יחס משווה בין שני גדלים בעזרת <b>חילוק</b>.
      <br>שחקן קלע 12 זריקות והחטיא 8. היחס בין הקליעות להחטאות הוא $12:8$.
      <br>אפשר לצמצם כמו שבר (מחלקים את שני המספרים ב־4): $12:8 = 3:2$.
      <br>במילים: "על כל 3 קליעות יש 2 החטאות".</div>
    <div class="note"><b>הסדר חשוב!</b> "היחס בין הקליעות להחטאות" הוא $3:2$, אבל "היחס בין ההחטאות לקליעות" הוא $2:3$. המספר הראשון שייך למה שנאמר ראשון.</div>
    <div class="idea"><b>חלוקה ביחס — עם משוואה</b>מחלקים 40 נקודות ביחס $3:2$. מסמנים חלק אחד ב־$x$:
      <div class="formula">$3x + 2x = 40 \\;\\Rightarrow\\; 5x = 40 \\;\\Rightarrow\\; x = 8$</div>
      לכן החלקים הם $3 \\cdot 8 = 24$ ו־$2 \\cdot 8 = 16$.</div>
    <div class="idea"><b>פרופורציה</b>שוויון בין שני יחסים: $\\frac{a}{b} = \\frac{c}{d}$. פותרים בעזרת <b>כפל בהצלבה</b>:
      <div class="formula">$\\frac{x}{6} = \\frac{10}{15} \\;\\Rightarrow\\; 15x = 60 \\;\\Rightarrow\\; x = 4$</div></div>
    <div class="idea"><b>קנה מידה</b>במפה בקנה מידה $1:50{,}000$, כל 1 ס״מ במפה הוא $50{,}000$ ס״מ במציאות, כלומר 500 מטר.
      <br>מציאות = מפה × המספר הגדול. מפה = מציאות ÷ המספר הגדול. (שים לב ליחידות: 100 ס״מ = 1 מ׳, 1000 מ׳ = 1 ק״מ.)</div>
    <div class="idea"><b>יחס הפוך</b>כשגודל אחד גדל פי 2, השני <b>קטן</b> פי 2. המכפלה שלהם קבועה: $x \\cdot y = k$.
      <br>4 פועלים צובעים מגרש ב־6 שעות ($4 \\cdot 6 = 24$). 8 פועלים יצבעו אותו ב־3 שעות ($8 \\cdot 3 = 24$).</div>`,

  example: {
    question: 'בשני משחקים קלע עומר יחד 35 נקודות. היחס בין הנקודות במשחק הראשון לנקודות במשחק השני הוא $3:4$. כמה נקודות קלע בכל משחק?',
    steps: [
      'יחס $3:4$ אומר: על כל 3 נקודות במשחק הראשון, יש 4 במשחק השני. כלומר מחלקים את הנקודות ל"חלקים" שווים.',
      'נסמן את הגודל של חלק אחד ב־$x$. אז במשחק הראשון $3x$ נקודות, ובמשחק השני $4x$ נקודות.',
      'ביחד יש 35 נקודות, אז כותבים משוואה: $3x + 4x = 35$.',
      'מכנסים איברים: $7x = 35$. מחלקים ב־7: $x = 5$.',
      'משחק ראשון: $3 \\cdot 5 = 15$ נקודות. משחק שני: $4 \\cdot 5 = 20$ נקודות.',
      'בדיקה: $15 + 20 = 35$ ✔, וגם $15:20 = 3:4$ (מחלקים ב־5) ✔.',
    ],
  },

  tools: [
    {
      title: 'מערבבים משקה ספורט',
      desc: 'כוס כתומה = תרכיז, כוס כחולה = מים. קבעו את היחס, ואז הוסיפו עוד "מנות". הכמויות גדלות, אבל היחס נשאר אותו יחס.',
      mount(el) {
        const st = { a: 1, b: 3, k: 2 };
        const pic = document.createElement('div'), out = document.createElement('div');
        out.className = 'readout';
        el.append(pic, out);
        const upd = () => {
          const { a, b, k } = st, s = 36, gap = 8, per = a + b;
          const W = 11 * s + 20, H = k * (s + gap) + 14;
          let r = '';
          for (let g = 0; g < k; g++) {
            for (let i = 0; i < per; i++) {
              const x = 10 + i * s, y = 10 + g * (s + gap);
              r += `<rect x="${x + 2}" y="${y}" width="${s - 4}" height="${s - 4}" rx="5" style="fill:${i < a ? 'var(--accent)' : 'var(--blue)'}"/>`;
            }
            r += `<text x="${10 + per * s + 6}" y="${10 + g * (s + gap) + s / 2 + 2}" font-size="14" style="fill:var(--muted)">מנה ${g + 1}</text>`;
          }
          pic.innerHTML = svg(W + 70, H, r);
          const g = U.gcd(a, b);
          out.innerHTML = `היחס בין התרכיז למים: $${k > 1 ? `${a * k} : ${b * k} = ` : ""}${a} : ${b}$${g > 1 ? ` $= ${a / g} : ${b / g}$ (מצומצם)` : ''}
            <br><span class="muted">סך הכול $${per * k}$ כוסות = $${per}$ חלקים בכל מנה, ו־$${k}$ מנות.</span>`;
          U.math(out);
        };
        U.slider(el, { label: 'כוסות תרכיז במנה', min: 1, max: 5, value: st.a, onInput: v => { st.a = v; upd(); } });
        U.slider(el, { label: 'כוסות מים במנה', min: 1, max: 6, value: st.b, onInput: v => { st.b = v; upd(); } });
        U.slider(el, { label: 'מספר מנות', min: 1, max: 6, value: st.k, onInput: v => { st.k = v; upd(); } });
      },
    },
    {
      title: 'קנה מידה: מהמפה למציאות',
      desc: 'בחרו קנה מידה והזיזו את הסרגל. הכלי מראה כמה המרחק במציאות, ואיך ממירים ס״מ למטרים ולקילומטרים.',
      mount(el) {
        const scales = [100, 1000, 10000, 50000, 100000];
        const st = { n: 1000, cm: 4 };
        el.insertAdjacentHTML('beforeend', `<div class="row" style="justify-content:center">${scales.map(n => `<button class="btn ghost sc" data-n="${n}" dir="ltr">1 : ${big(n)}</button>`).join('')}</div>`);
        const pic = document.createElement('div'), out = document.createElement('div');
        out.className = 'readout';
        el.append(pic, out);
        const upd = () => {
          el.querySelectorAll('.sc').forEach(b => { b.classList.toggle('on', +b.dataset.n === st.n); b.style.fontWeight = +b.dataset.n === st.n ? 700 : 400; b.style.borderColor = +b.dataset.n === st.n ? 'var(--accent)' : ''; });
          const px = 36, x0 = 30, x1 = x0 + st.cm * px;
          let r = `<rect x="10" y="10" width="480" height="130" rx="12" style="fill:var(--blue-soft)"/>`;
          r += `<path d="M ${x0} 70 C ${x0 + 60} 30, ${x1 - 60} 110, ${x1} 70" style="fill:none;stroke:var(--muted);stroke-width:2;stroke-dasharray:4 4"/>`;
          r += `<circle cx="${x0}" cy="70" r="7" style="fill:var(--blue)"/><text x="${x0}" y="55" text-anchor="middle" font-size="13" style="fill:var(--ink)">בית</text>`;
          r += `<circle cx="${x1}" cy="70" r="7" style="fill:var(--accent)"/><text x="${x1}" y="55" text-anchor="middle" font-size="13" style="fill:var(--ink)">אולם</text>`;
          // סרגל
          r += `<rect x="${x0}" y="100" width="${12 * px}" height="26" style="fill:var(--warn-soft);stroke:var(--muted)"/>`;
          for (let i = 0; i <= 12; i++) r += `<line x1="${x0 + i * px}" y1="100" x2="${x0 + i * px}" y2="${i % 2 ? 108 : 112}" style="stroke:var(--ink)"/><text x="${x0 + i * px}" y="123" text-anchor="middle" font-size="10" style="fill:var(--ink)">${i}</text>`;
          r += `<line x1="${x0}" y1="95" x2="${x1}" y2="95" style="stroke:var(--accent);stroke-width:4"/>`;
          pic.innerHTML = svg(500, 150, r);
          const realCm = st.cm * st.n, m = realCm / 100, km = m / 1000;
          out.innerHTML = `במפה: $${st.cm}$ ס״מ &nbsp;→&nbsp; במציאות: $${st.cm} \\cdot ${texBig(st.n)} = ${texBig(realCm)}$ ס״מ
            <br>$= ${texBig(m)}$ מטר ${m >= 1000 ? `$= ${U.num(km)}$ ק״מ` : ''}`;
          U.math(out);
        };
        el.querySelectorAll('.sc').forEach(b => b.onclick = () => { st.n = +b.dataset.n; upd(); });
        U.slider(el, { label: 'ס״מ במפה', min: 1, max: 12, value: st.cm, onInput: v => { st.cm = v; upd(); } });
      },
    },
    {
      title: 'יחס הפוך: צובעים את המגרש',
      desc: 'צביעת המגרש דורשת 24 "שעות עבודה" (כל ריבוע = פועל אחד שעובד שעה אחת; כל שורה = פועל). שנו את מספר הפועלים: הריבועים מסתדרים מחדש, אבל תמיד יש 24.',
      mount(el) {
        const opts = [1, 2, 3, 4, 6, 8, 12];
        let w = 4;
        const pic = document.createElement('div'), out = document.createElement('div');
        out.className = 'readout';
        el.append(pic, out);
        const upd = () => {
          const h = 24 / w, s = 18;
          let r = '';
          // ריבועים: שורה = פועל, עמודה = שעה
          for (let i = 0; i < w; i++) for (let j = 0; j < h; j++)
            r += `<rect x="${30 + j * s}" y="${24 + i * s}" width="${s - 3}" height="${s - 3}" rx="3" style="fill:var(--accent)"/>`;
          r += `<text x="30" y="16" font-size="13" style="fill:var(--muted)">שעות →</text><text x="22" y="${24 + w * s / 2}" text-anchor="end" font-size="13" style="fill:var(--muted)">${w}</text>`;
          r += `<text x="${30 + h * s + 6}" y="${24 + w * s / 2 + 5}" font-size="13" style="fill:var(--muted)">${h}</text>`;
          // גרף: x = פועלים, y = שעות
          const gx = 60, gy = 270, gw = 400, gh = 150, X = v => gx + v / 12 * gw, Y = v => gy + gh - v / 24 * gh;
          r += `<line x1="${gx}" y1="${gy + gh}" x2="${gx + gw}" y2="${gy + gh}" style="stroke:var(--muted)"/><line x1="${gx}" y1="${gy}" x2="${gx}" y2="${gy + gh}" style="stroke:var(--muted)"/>`;
          r += `<text x="${gx + gw}" y="${gy + gh + 34}" text-anchor="end" font-size="12" style="fill:var(--muted)">פועלים</text><text x="${gx - 8}" y="${gy - 6}" font-size="12" style="fill:var(--muted)">שעות</text>`;
          let d = '';
          for (let v = 1; v <= 12; v += 0.1) d += `${d ? 'L' : 'M'} ${X(v).toFixed(1)} ${Y(24 / v).toFixed(1)} `;
          r += `<path d="${d}" style="fill:none;stroke:var(--blue);stroke-width:2;stroke-dasharray:5 4"/>`;
          for (const v of opts) r += `<circle cx="${X(v)}" cy="${Y(24 / v)}" r="${v === w ? 8 : 4}" style="fill:${v === w ? 'var(--accent)' : 'var(--blue)'}"/><text x="${X(v)}" y="${gy + gh + 16}" text-anchor="middle" font-size="11" style="fill:var(--ink)">${v}</text>`;
          for (const t of [6, 12, 24]) r += `<text x="${gx - 6}" y="${Y(t) + 4}" text-anchor="end" font-size="11" style="fill:var(--ink)">${t}</text>`;
          pic.innerHTML = svg(500, 460, r);
          out.innerHTML = `$${w}$ פועלים · $${h}$ שעות &nbsp;←&nbsp; $${w} \\cdot ${h} = 24$ תמיד!
            <br><span class="muted">פי 2 פועלים ← חצי מהזמן. זה יחס הפוך.</span>`;
          U.math(out);
        };
        U.slider(el, { label: 'מספר פועלים', min: 0, max: opts.length - 1, value: 3, fmt: i => opts[i], onInput: i => { w = opts[i]; upd(); } });
      },
    },
  ],

  exercises: [
    // ---------- רמה 1 ----------
    { level: 1, gen() {
      const a = U.R(1, 5); let b; do { b = U.R(1, 6); } while (U.gcd(a, b) !== 1 || a === b);
      const k = U.R(2, 6);
      return {
        q: `צמצמו את היחס $${a * k} : ${b * k}$. היחס המצומצם הוא $${a} : \\; ?$`,
        type: 'number', answer: b,
        mistakes: [{ v: b * k, why: 'חילקת רק את המספר הראשון. מחלקים את <b>שני</b> המספרים באותו מספר.' },
          { v: b * k - (a * k - a), why: 'חיסרת את אותו מספר משני הצדדים. יחס מצמצמים בחילוק, לא בחיסור.' }],
        hint: `מחלקים את <b>שני</b> המספרים באותו מספר. כאן אפשר לחלק ב־$${k}$.`,
        steps: [`מחלקים את שני המספרים ב־$${k}$.`, `$${a * k} \\div ${k} = ${a}$ ו־$${b * k} \\div ${k} = ${b}$.`, `היחס המצומצם: $${a} : ${b}$. התשובה: $${b}$.`],
      };
    } },
    { level: 1, gen() {
      const ctx = U.pick([['בנים', 'בנות', 'בכיתה'], ['קליעות', 'החטאות', 'באימון'], ['ניצחונות', 'הפסדים', 'בעונה'], ['כדורי כדורסל', 'כדורי רגל', 'במחסן']]);
      const a = U.R(2, 9); let b; do { b = U.R(2, 9); } while (b === a);
      const askFirst = Math.random() < 0.5;
      const [p, q] = askFirst ? [a, b] : [b, a], [n1, n2] = askFirst ? [ctx[0], ctx[1]] : [ctx[1], ctx[0]];
      const ch = U.shuffle([`${p} : ${q}`, `${q} : ${p}`, `${p} : ${p + q}`, `${q} : ${p + q}`]);
      return {
        q: `${ctx[2]} יש ${a} ${ctx[0]} ו־${b} ${ctx[1]}. מה היחס בין מספר ה${n1} למספר ה${n2}?`,
        type: 'choice', choices: ch.map(c => `$${c}$`), answer: ch.indexOf(`${p} : ${q}`),
        mistakes: [{ v: ch.indexOf(`${q} : ${p}`), why: 'המספרים נכונים, אבל הסדר הפוך. מה נאמר ראשון בשאלה?' },
          ...[p, q].map(t => ({ v: ch.indexOf(`${t} : ${p + q}`), why: `$${p + q}$ הוא כולם ביחד. שאלו על היחס בין ה${n1} לבין ה${n2} בלבד.` }))],
        hint: 'המספר הראשון ביחס שייך למה שנאמר <b>ראשון</b> בשאלה.',
        steps: [`ה${n1}: ${p}. ה${n2}: ${q}.`, `ה${n1} נאמרו ראשונים, אז הם במקום הראשון: $${p} : ${q}$.`],
      };
    } },
    { level: 1, gen() {
      const a = U.R(1, 6), b = U.R(a + 1, 10), k = U.R(2, 6);
      const askTop = Math.random() < 0.5;
      return {
        q: askTop ? `מצאו את $x$: $\\frac{${a}}{${b}} = \\frac{x}{${b * k}}$` : `מצאו את $x$: $\\frac{${a}}{${b}} = \\frac{${a * k}}{x}$`,
        type: 'number', answer: askTop ? a * k : b * k,
        mistakes: [{ v: askTop ? a + b * k - b : b + a * k - a, why: `הוספת $${askTop ? b * k - b : a * k - a}$ גם למונה וגם למכנה. בשברים שווים <b>כופלים</b> באותו מספר, לא מחברים.` }],
        hint: askTop ? `פי כמה גדל המכנה? $${b} \\to ${b * k}$. המונה גדל באותו פי.` : `פי כמה גדל המונה? $${a} \\to ${a * k}$. המכנה גדל באותו פי.`,
        steps: askTop
          ? [`המכנה גדל פי $${k}$: $${b} \\cdot ${k} = ${b * k}$.`, `אז גם המונה גדל פי $${k}$: $x = ${a} \\cdot ${k} = ${a * k}$.`]
          : [`המונה גדל פי $${k}$: $${a} \\cdot ${k} = ${a * k}$.`, `אז גם המכנה גדל פי $${k}$: $x = ${b} \\cdot ${k} = ${b * k}$.`],
      };
    } },
    { level: 1, gen() {
      const n = U.pick([100, 200, 500, 1000]), cm = U.R(2, 9), m = cm * n / 100;
      return {
        q: `בשרטוט של אולם ספורט קנה המידה הוא $1 : ${n}$. אורך האולם בשרטוט הוא ${cm} ס״מ. מה האורך במציאות, ב<b>מטרים</b>?`,
        type: 'number', answer: m,
        mistakes: [{ v: cm * n, why: 'מצאת את האורך בס״מ. שאלו כמה זה במטרים.' }],
        hint: `כל 1 ס״מ בשרטוט הוא $${n}$ ס״מ במציאות. ובסוף: 100 ס״מ = 1 מטר.`,
        steps: [`במציאות: $${cm} \\cdot ${n} = ${texBig(cm * n)}$ ס״מ.`, `ממירים למטרים (מחלקים ב־100): $${texBig(cm * n)} \\div 100 = ${m}$ מטר.`],
      };
    } },
    // ---------- רמה 2 ----------
    { level: 2, gen() {
      const a = U.R(1, 5); let b; do { b = U.R(1, 6); } while (b === a || U.gcd(a, b) !== 1);
      const x = U.R(2, 12), total = (a + b) * x, askA = Math.random() < 0.5;
      const ctx = U.pick([['נקודות', 'שני שחקנים', 'הראשון', 'השני'], ['כדורים', 'שתי קבוצות', 'הקבוצה הראשונה', 'הקבוצה השנייה'], ['שקלים', 'שני אחים', 'האח הראשון', 'האח השני']]);
      return {
        q: `מחלקים ${total} ${ctx[0]} בין ${ctx[1]} ביחס $${a} : ${b}$. כמה ${ctx[0]} יקבל ${askA ? ctx[2] : ctx[3]}?`,
        type: 'number', answer: (askA ? a : b) * x,
        mistakes: [{ v: x, why: `מצאת כמה שווה חלק אחד. כמה חלקים כאלה מקבל ${askA ? ctx[2] : ctx[3]}?` },
          { v: (askA ? b : a) * x, why: `זה מה שמקבל ${askA ? ctx[3] : ctx[2]}. בדוק איזה מספר ביחס שייך למי.` }],
        hint: `מסמנים חלק אחד ב־$x$. אז $${U.term(a)} + ${U.term(b)} = ${total}$.`,
        steps: [`$${U.term(a)} + ${U.term(b)} = ${total}$`, `$${a + b}x = ${total}$`, `$x = ${total} \\div ${a + b} = ${x}$`, `${askA ? ctx[2] : ctx[3]}: $${askA ? a : b} \\cdot ${x} = ${(askA ? a : b) * x}$`],
      };
    } },
    { level: 2, gen() {
      // x/b = c/d עם פתרון שלם
      const d = U.R(3, 12), c = U.R(1, d * 2), g = d / U.gcd(c, d), b = g * U.R(1, 4), x = c * b / d;
      return {
        q: `פתרו את הפרופורציה: $\\frac{x}{${b}} = \\frac{${c}}{${d}}$`,
        type: 'number', answer: x,
        mistakes: [{ v: b * d / c, why: `כפלת את $x$ ב־$${c}$. בכפל בהצלבה כופלים באלכסון: מי נמצא באלכסון מול $x$?` }],
        hint: 'כפל בהצלבה: $x \\cdot ' + d + ' = ' + b + ' \\cdot ' + c + '$.',
        steps: [`כפל בהצלבה: $${d}x = ${b} \\cdot ${c}$`, `$${d}x = ${b * c}$`, `מחלקים ב־$${d}$: $x = ${x}$`],
      };
    } },
    { level: 2, gen() {
      const k = U.pick([12, 24, 36, 48, 60]);
      const divs = []; for (let i = 2; i <= 12; i++) if (k % i === 0) divs.push(i);
      const w1 = U.pick(divs); let w2; do { w2 = U.pick(divs); } while (w2 === w1);
      const ctx = U.pick([['פועלים', 'שעות', 'לסדר את האולם לטורניר'], ['מתנדבים', 'שעות', 'לנקות את המגרש'], ['ברזים', 'דקות', 'למלא בריכה']]);
      return {
        q: `${w1} ${ctx[0]} צריכים ${k / w1} ${ctx[1]} ${ctx[2]}. כמה ${ctx[1]} יצטרכו ${w2} ${ctx[0]} (באותו קצב)?`,
        type: 'number', answer: k / w2,
        mistakes: [{ v: (k / w1) * w2 / w1, why: `חישבת יחס ישר. כאן היחס הפוך: כשמספר ה${ctx[0]} גדל, מספר ה${ctx[1]} קטן.` }],
        hint: `יותר ${ctx[0]} ← פחות ${ctx[1]}. זה יחס הפוך: המכפלה קבועה. חשבו קודם $${w1} \\cdot ${k / w1}$.`,
        steps: [`יחס הפוך: ${ctx[0]} × ${ctx[1]} = קבוע.`, `$${w1} \\cdot ${k / w1} = ${k}$`, `$${w2} \\cdot x = ${k}$`, `$x = ${k} \\div ${w2} = ${k / w2}$ ${ctx[1]}.`],
      };
    } },
    { level: 2, gen() {
      const n = U.pick([10000, 20000, 50000, 100000]), cm = U.R(2, 8), km = cm * n / 100000;
      return {
        q: `במפה בקנה מידה $1 : ${texBig(n)}$, המרחק בין שתי ערים במציאות הוא ${U.num(km)} ק״מ. מה המרחק במפה, בס״מ?`,
        type: 'number', answer: cm,
        mistakes: [{ v: cm / 100, why: 'נראה שהמרת את הק״מ למטרים. במפה מודדים בס״מ: כמה ס״מ יש בק״מ אחד?' }],
        hint: `ממירים ק״מ לס״מ: 1 ק״מ = $100{,}000$ ס״מ. ואז מחלקים ב־$${texBig(n)}$.`,
        steps: [`$${U.num(km)}$ ק״מ $= ${texBig(km * 100000)}$ ס״מ.`, `במפה: $${texBig(km * 100000)} \\div ${texBig(n)} = ${cm}$ ס״מ.`],
      };
    } },
    // ---------- רמה 3 ----------
    { level: 3, gen() {
      const b = U.R(1, 5), a = U.R(b + 1, b + 5), x = U.R(2, 9), diff = (a - b) * x;
      return {
        q: `היחס בין הניצחונות להפסדים של קבוצה הוא $${a} : ${b}$. היו לה ${diff} ניצחונות <b>יותר</b> מהפסדים. כמה ניצחונות היו לה?`,
        type: 'number', answer: a * x,
        mistakes: [{ v: diff / (a + b) * a, why: `חילקת את ${diff} ב־$${a + b}$, כאילו ${diff} הוא סך כל המשחקים. אבל ${diff} הוא ה<b>הפרש</b> בין הניצחונות להפסדים.` },
          { v: b * x, why: 'מצאת את מספר ההפסדים. שאלו על הניצחונות.' },
          { v: x, why: 'מצאת כמה שווה חלק אחד. כמה חלקים כאלה הם הניצחונות?' }],
        hint: `ניצחונות: $${U.term(a)}$, הפסדים: $${U.term(b)}$. ההפרש ביניהם הוא ${diff}.`,
        steps: [`ניצחונות $${U.term(a)}$, הפסדים $${U.term(b)}$.`, `$${U.term(a)} - ${U.term(b)} = ${diff}$`, `$${a - b === 1 ? '' : a - b}x = ${diff}$ ← $x = ${x}$`, `ניצחונות: $${a} \\cdot ${x} = ${a * x}$ (והפסדים $${b * x}$).`],
      };
    } },
    { level: 3, gen() {
      const [v1, t1, v2] = U.pick([[60, 3, 90], [80, 3, 120], [60, 4, 80], [90, 2, 60], [50, 6, 100], [40, 6, 60], [100, 3, 75], [75, 4, 100]]);
      return {
        q: `אוטובוס הקבוצה נוסע למשחק חוץ במהירות ${v1} קמ״ש, והנסיעה לוקחת ${t1} שעות. כמה שעות תיקח הנסיעה במהירות ${v2} קמ״ש?`,
        type: 'number', answer: v1 * t1 / v2,
        mistakes: [{ v: t1 * v2 / v1, why: 'חישבת יחס ישר. אבל כשנוסעים מהר יותר, הנסיעה לוקחת <b>פחות</b> זמן.' },
          { v: v1 * t1, why: 'מצאת את אורך הדרך בק״מ. שאלו כמה שעות תיקח הנסיעה.' }],
        hint: 'מהירות וזמן הם ביחס הפוך: מהירות × זמן = הדרך, והדרך לא משתנה.',
        steps: [`הדרך: $${v1} \\cdot ${t1} = ${v1 * t1}$ ק״מ.`, `$${v2} \\cdot t = ${v1 * t1}$`, `$t = ${v1 * t1} \\div ${v2} = ${U.num(v1 * t1 / v2)}$ שעות.`],
      };
    } },
    { level: 3, gen() {
      const n = U.pick([1000, 2000, 5000, 10000, 25000, 50000]), cm = U.pick([2, 4, 5, 8]), real = cm * n;
      const m = real / 100;
      return {
        q: `במפה, קטע של ${cm} ס״מ מייצג ${texBig(m)} מטר במציאות. מה קנה המידה של המפה? כתבו את המספר $n$ ב־$1 : n$.`,
        type: 'number', answer: n,
        mistakes: [{ v: m / cm, why: 'חילקת מטרים בס״מ. קודם צריך ששני המספרים יהיו באותן יחידות.' },
          { v: real, why: `זה היחס $${cm} : ${texBig(real)}$. בקנה מידה המספר הראשון צריך להיות 1.` }],
        hint: 'קודם ממירים את המטרים לס״מ (כופלים ב־100), כדי ששני המספרים יהיו באותן יחידות.',
        steps: [`$${texBig(m)}$ מטר $= ${texBig(real)}$ ס״מ.`, `היחס: $${cm} : ${texBig(real)}$.`, `מחלקים את שניהם ב־$${cm}$: $1 : ${texBig(n)}$.`],
      };
    } },
  ],

  summary: [
    'יחס $a:b$ משווה בין שני גדלים. אפשר לצמצם אותו כמו שבר. הסדר חשוב!',
    'חלוקה ביחס $a:b$: מסמנים חלק אחד ב־$x$ ופותרים $ax + bx = $ הסך הכול.',
    'פרופורציה $\\frac{a}{b} = \\frac{c}{d}$ פותרים בכפל בהצלבה: $a \\cdot d = b \\cdot c$.',
    'קנה מידה $1:n$: מציאות = מפה × $n$. לא לשכוח להמיר יחידות (ס״מ ← מטר ← ק״מ).',
    'יחס הפוך: אחד גדל והשני קטן באותו פי. המכפלה קבועה: $x \\cdot y = k$.',
  ],
});
})();
