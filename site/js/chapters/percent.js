/* יחידה: אחוזים (כרך ב׳, פרק 1) */
(() => {
const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="100%" style="direction:ltr;max-width:${w}px;display:block;margin:0 auto" dir="ltr">${inner}</svg>`;
const n2 = U.num;

/** רשת 10×10: p ריבועים צבועים */
function grid100(p, color = 'var(--accent)') {
  let r = '';
  for (let i = 0; i < 100; i++) {
    const x = (i % 10) * 22, y = Math.floor(i / 10) * 22;
    r += `<rect x="${x + 1}" y="${y + 1}" width="20" height="20" rx="3" style="fill:${i < p ? color : 'var(--line)'}"/>`;
  }
  return svg(222, 222, r);
}

registerChapter('percent', {
  intro: `
    <div class="idea"><b>מה זה אחוז?</b>אחוז = חלק אחד מתוך 100. הסימן הוא %.
      <br>$25\\% = \\frac{25}{100} = \\frac{1}{4} = 0.25$ &nbsp;·&nbsp; $50\\% = \\frac{1}{2}$ &nbsp;·&nbsp; $10\\% = \\frac{1}{10}$ &nbsp;·&nbsp; $100\\%$ = הכול.</div>
    <div class="idea"><b>אחוז ממספר</b>כופלים את המספר בשבר:
      <div class="formula">$30\\% \\cdot 80 = \\frac{30}{100} \\cdot 80 = 24$</div>
      טריק: קודם מוצאים $10\\%$ (מחלקים ב־10), ואז כופלים. $10\\%$ מ־80 = 8, אז $30\\%$ = 24.</div>
    <div class="idea"><b>כמה אחוזים?</b>חלק ÷ שלם × 100. שחקן קלע 18 מתוך 24 זריקות עונשין:
      <div class="formula">$\\frac{18}{24} \\cdot 100 = 75\\%$</div></div>
    <div class="idea"><b>עלייה והנחה</b>מחיר 200 ₪ עלה ב־$15\\%$: $200 + 30 = 230$, או בבת אחת $200 \\cdot 1.15 = 230$.
      <br>הנחה של $15\\%$: $200 - 30 = 170$, או $200 \\cdot 0.85 = 170$ (נשאר $85\\%$).</div>
    <div class="idea"><b>מוצאים את השלם</b>"$30\\%$ מהמספר הם 12". מסמנים את השלם ב־$x$ וכותבים משוואה:
      <div class="formula">$0.3x = 12 \\;\\Rightarrow\\; x = 40$</div>
      או בלי משוואה: $10\\%$ הם 4, אז $100\\%$ הם 40.</div>
    <div class="note"><b>מלכודת!</b> עלייה של $20\\%$ ואחריה ירידה של $20\\%$ <b>לא</b> מחזירות למחיר המקורי, כי האחוזים נלקחים כל פעם ממספר אחר.</div>`,

  example: {
    question: 'חולצת כדורסל עלתה 200 ₪. לפני העונה המחיר עלה ב־$20\\%$, ובסוף העונה המחיר החדש ירד ב־$20\\%$. האם החולצה חזרה למחיר 200 ₪?',
    steps: [
      'שלב 1 — העלייה: $20\\%$ מ־200 הם $\\frac{20}{100} \\cdot 200 = 40$.',
      'המחיר אחרי העלייה: $200 + 40 = 240$ ₪.',
      'שלב 2 — הירידה: עכשיו לוקחים $20\\%$ מ־<b>240</b> (המחיר החדש!), לא מ־200.',
      '$20\\%$ מ־240 הם $\\frac{20}{100} \\cdot 240 = 48$.',
      'המחיר בסוף: $240 - 48 = 192$ ₪.',
      'התשובה: <b>לא</b>. החולצה זולה ב־8 ₪ מהמחיר המקורי, כי הירידה חושבה ממספר גדול יותר.',
      'קיצור דרך: $200 \\cdot 1.2 \\cdot 0.8 = 200 \\cdot 0.96 = 192$.',
    ],
  },

  tools: [
    {
      title: 'רשת המאה',
      desc: 'כל ריבוע הוא 1%. בחרו את השלם ואת האחוז, וראו כמה זה יוצא. שימו לב איך 10% עוזרים לחשב.',
      mount(el) {
        const st = { w: 80, p: 30 };
        const pic = document.createElement('div'), out = document.createElement('div');
        out.className = 'readout';
        el.append(pic, out);
        const upd = () => {
          pic.innerHTML = grid100(st.p);
          const part = st.p / 100 * st.w;
          out.innerHTML = `$${st.p}\\%$ מתוך $${st.w}$: &nbsp; $\\frac{${st.p}}{100} \\cdot ${st.w} = ${n2(part)}$
            <br><span class="muted">$10\\%$ מ־${st.w} הם $${n2(st.w / 10)}$, וכל ריבוע ($1\\%$) שווה $${n2(st.w / 100)}$.</span>`;
          U.math(out);
        };
        U.slider(el, { label: 'השלם', min: 20, max: 500, step: 10, value: st.w, onInput: v => { st.w = v; upd(); } });
        U.slider(el, { label: 'אחוז', min: 0, max: 100, step: 5, value: st.p, fmt: v => v + '%', onInput: v => { st.p = v; upd(); } });
      },
    },
    {
      title: 'עלייה והנחה במחיר',
      desc: 'קבעו מחיר ואחוז, ובחרו עלייה או הנחה. העמודה הכתומה היא המחיר החדש. נסו: עלייה ואחריה הנחה באותו אחוז — האם חוזרים להתחלה?',
      mount(el) {
        const st = { price: 200, p: 20, hist: [] };
        el.insertAdjacentHTML('beforeend', `<div class="row" style="justify-content:center">
          <button class="btn up">⬆ עלייה</button><button class="btn down">⬇ הנחה</button><button class="btn ghost reset">↺ מההתחלה</button></div>`);
        const pic = document.createElement('div'), out = document.createElement('div');
        out.className = 'readout';
        el.append(pic, out);
        const draw = () => {
          const vals = [st.price, ...st.hist.map(h => h.v)], max = Math.max(...vals) * 1.15, H = 170, bw = 54;
          let r = `<line x1="10" y1="${H}" x2="490" y2="${H}" style="stroke:var(--muted)"/>`;
          vals.slice(-7).forEach((v, i, arr) => {
            const h = v / max * (H - 20), x = 20 + i * 68, last = i === arr.length - 1;
            r += `<rect x="${x}" y="${H - h}" width="${bw}" height="${h}" rx="4" style="fill:${last ? 'var(--accent)' : 'var(--blue)'};opacity:${last ? 1 : 0.55}"/>`;
            r += `<text x="${x + bw / 2}" y="${H - h - 5}" text-anchor="middle" font-size="13" style="fill:var(--ink)">${n2(v)}</text>`;
          });
          pic.innerHTML = svg(500, H + 6, r);
          const cur = vals[vals.length - 1];
          const last = st.hist[st.hist.length - 1];
          out.innerHTML = last
            ? `$${n2(last.from)} \\cdot ${last.up ? `(1 + ${n2(st.p / 100)})` : `(1 - ${n2(st.p / 100)})`} = ${n2(last.from)} \\cdot ${n2(last.f)} = ${n2(cur)}$
               <br><span class="muted">${last.up ? 'עלייה' : 'הנחה'} של $${st.p}\\%$ ← כופלים ב־$${n2(last.f)}$. ${Math.abs(cur - st.price) > 1e-9 ? `הפרש מהמחיר ההתחלתי: $${n2(cur - st.price)}$ ₪` : 'חזרנו בדיוק למחיר ההתחלתי.'}</span>`
            : `מחיר התחלתי: $${st.price}$ ₪. לחצו על עלייה או הנחה.`;
          U.math(out);
        };
        const apply = up => {
          const vals = [st.price, ...st.hist.map(h => h.v)], from = vals[vals.length - 1], f = up ? 1 + st.p / 100 : 1 - st.p / 100;
          st.hist.push({ from, f, up, v: from * f }); draw();
        };
        el.querySelector('.up').onclick = () => apply(true);
        el.querySelector('.down').onclick = () => apply(false);
        el.querySelector('.reset').onclick = () => { st.hist = []; draw(); };
        U.slider(el, { label: 'מחיר התחלתי (₪)', min: 50, max: 400, step: 10, value: st.price, onInput: v => { st.price = v; st.hist = []; draw(); } });
        U.slider(el, { label: 'אחוז השינוי', min: 5, max: 50, step: 5, value: st.p, fmt: v => v + '%', onInput: v => { st.p = v; draw(); } });
      },
    },
    {
      title: 'מוצאים את השלם',
      desc: 'שחקן קלע חלק מהזריקות שלו. אנחנו יודעים כמה קליעות היו, ואיזה אחוז זה. כמה זריקות זרק בסך הכול? הפס מחולק ל־10 חלקים של 10%.',
      mount(el) {
        const st = { p: 40, part: 12 };
        const pic = document.createElement('div'), out = document.createElement('div');
        out.className = 'readout';
        el.append(pic, out);
        const upd = () => {
          const ten = st.part / (st.p / 10), whole = ten * 10;
          let r = '';
          for (let i = 0; i < 10; i++) {
            const on = i < st.p / 10;
            r += `<rect x="${10 + i * 48}" y="20" width="46" height="46" rx="5" style="fill:${on ? 'var(--accent)' : 'var(--blue-soft)'};stroke:var(--blue)"/>`;
            r += `<text x="${10 + i * 48 + 23}" y="49" text-anchor="middle" font-size="14" style="fill:var(--ink)">${n2(ten)}</text>`;
            r += `<text x="${10 + i * 48 + 23}" y="14" text-anchor="middle" font-size="10" style="fill:var(--muted)">10%</text>`;
          }
          r += `<text x="${10 + st.p / 10 * 48 / 2}" y="88" text-anchor="middle" font-size="14" style="fill:var(--accent)">${st.p}% = ${st.part}</text>`;
          r += `<text x="250" y="112" text-anchor="middle" font-size="14" style="fill:var(--ink)">100% = ${n2(whole)}</text>`;
          pic.innerHTML = svg(500, 120, r);
          out.innerHTML = `$${st.p}\\%$ הם $${st.part}$ ← $10\\%$ הם $${st.part} \\div ${st.p / 10} = ${n2(ten)}$ ← $100\\%$ הם $${n2(whole)}$
            <br><span class="muted">במשוואה: $${n2(st.p / 100)}x = ${st.part}$ ← $x = ${n2(whole)}$</span>`;
          U.math(out);
        };
        U.slider(el, { label: 'אחוז הקליעה', min: 10, max: 90, step: 10, value: st.p, fmt: v => v + '%', onInput: v => { st.p = v; upd(); } });
        U.slider(el, { label: 'מספר קליעות', min: 1, max: 30, value: st.part, onInput: v => { st.part = v; upd(); } });
      },
    },
  ],

  exercises: [
    // ---------- רמה 1 ----------
    { level: 1, gen() {
      const [p, mult] = U.pick([[10, 10], [50, 2], [25, 4], [20, 5], [10, 10], [50, 2]]);
      const w = mult * U.R(2, 30);
      return {
        q: `כמה זה $${p}\\%$ מ־$${w}$?`,
        type: 'number', answer: p * w / 100,
        mistakes: [{ v: w / p, why: `חילקת ב־$${p}$. אבל $${p}\\%$ זה לא "אחד חלקי ${p}". איזה חלק מהשלם הוא $${p}\\%$?` }],
        hint: p === 10 ? '$10\\%$ = עשירית. מחלקים ב־10.' : p === 50 ? '$50\\%$ = חצי. מחלקים ב־2.' : p === 25 ? '$25\\%$ = רבע. מחלקים ב־4.' : '$20\\%$ = חמישית. מחלקים ב־5.',
        steps: [`$${p}\\% = \\frac{${p}}{100} = \\frac{1}{${100 / p}}$`, `$${w} \\div ${100 / p} = ${p * w / 100}$`],
      };
    } },
    { level: 1, gen() {
      const opts = [[50, '\\frac{1}{2}', '0.5'], [25, '\\frac{1}{4}', '0.25'], [75, '\\frac{3}{4}', '0.75'], [10, '\\frac{1}{10}', '0.1'], [20, '\\frac{1}{5}', '0.2'], [40, '\\frac{2}{5}', '0.4']];
      const [p, f, d] = U.pick(opts), asDec = Math.random() < 0.5;
      const others = U.shuffle(opts.filter(o => o[0] !== p)).slice(0, 3).map(o => asDec ? o[2] : o[1]);
      const ch = U.shuffle([asDec ? d : f, ...others]);
      return {
        q: `$${p}\\%$ שווה ל...`,
        type: 'choice', choices: ch.map(c => `$${c}$`), answer: ch.indexOf(asDec ? d : f),
        hint: `אחוז = חלקי 100. כתבו $\\frac{${p}}{100}$ ${asDec ? 'כמספר עשרוני' : 'וצמצמו'}.`,
        steps: [`$${p}\\% = \\frac{${p}}{100}$`, asDec ? `$\\frac{${p}}{100} = ${d}$` : `מצמצמים: $\\frac{${p}}{100} = ${f}$`],
      };
    } },
    { level: 1, gen() {
      const att = U.pick([10, 20, 25, 50]), made = U.R(1, att - 1), p = made / att * 100;
      return {
        q: `בזריקות עונשין, נועם קלע ${made} מתוך ${att} זריקות. כמה אחוזים מהזריקות הוא קלע?`,
        type: 'number', answer: p,
        mistakes: [{ v: made, why: `כתבת את מספר הקליעות. אחוזים הם מתוך 100, וכאן היו ${att} זריקות.` },
          { v: (att - made) / att * 100, why: 'חישבת את אחוז ההחטאות. שאלו כמה אחוזים הוא קלע.' }],
        hint: `חלק ÷ שלם × 100. כלומר $\\frac{${made}}{${att}} \\cdot 100$. טיפ: כמה פעמים ${att} נכנס ב־100?`,
        steps: [`$\\frac{${made}}{${att}} \\cdot 100$`, `${att} נכנס ב־100 בדיוק ${100 / att} פעמים, אז מרחיבים: $\\frac{${made}}{${att}} = \\frac{${p}}{100}$`, `התשובה: $${p}\\%$`],
      };
    } },
    { level: 1, gen() {
      const w = 10 * U.R(2, 40), p = U.pick([10, 30, 40, 60, 70, 90]);
      return {
        q: `במשחק היו ${w} צופים. $${p}\\%$ מהם אוהדי הקבוצה המארחת. כמה אוהדים יש לקבוצה המארחת?`,
        type: 'number', answer: p * w / 100,
        mistakes: [{ v: w / 10, why: `מצאת $10\\%$ מהצופים. שאלו על $${p}\\%$.` }],
        hint: `קודם מוצאים $10\\%$ מ־${w} (מחלקים ב־10), ואז כופלים ב־${p / 10}.`,
        steps: [`$10\\%$ מ־${w}: $${w} \\div 10 = ${w / 10}$`, `$${p}\\%$ = ${p / 10} פעמים $10\\%$: $${w / 10} \\cdot ${p / 10} = ${p * w / 100}$`],
      };
    } },
    // ---------- רמה 2 ----------
    { level: 2, gen() {
      const p = U.pick([10, 20, 25, 30, 40, 50]), price = (p === 25 ? 4 : 10) * U.R(3, 40), up = Math.random() < 0.5;
      const ch = p * price / 100, res = up ? price + ch : price - ch;
      const [item, cost] = U.pick([['נעלי כדורסל', 'עלו'], ['כדור כדורסל', 'עלה'], ['כרטיס למשחק', 'עלה'], ['חולצת קבוצה', 'עלתה']]);
      return {
        q: up ? `${item} ${cost} ${price} ₪. המחיר עלה ב־$${p}\\%$. מה המחיר החדש?` : `${item} ${cost} ${price} ₪. יש הנחה של $${p}\\%$. כמה משלמים אחרי ההנחה?`,
        type: 'number', answer: res,
        mistakes: [{ v: ch, why: `מצאת כמה זה $${p}\\%$ מ־${price}. אבל שאלו ${up ? 'מה המחיר החדש' : 'כמה משלמים אחרי ההנחה'}.` },
          { v: up ? price + p : price - p, why: `${up ? 'הוספת' : 'הורדת'} ${p} שקלים. אבל $${p}\\%$ זה לא ${p} ₪: צריך לחשב כמה זה $${p}\\%$ מ־${price}.` },
          { v: up ? price - ch : price + ch, why: `בדוק את הכיוון: המחיר צריך ${up ? 'לעלות' : 'לרדת'}.` }],
        hint: `קודם מחשבים כמה זה $${p}\\%$ מ־${price}, ואז ${up ? 'מוסיפים' : 'מחסירים'}.`,
        steps: [`$${p}\\%$ מ־${price}: $\\frac{${p}}{100} \\cdot ${price} = ${ch}$`, `${up ? `$${price} + ${ch} = ${res}$` : `$${price} - ${ch} = ${res}$`} ₪`, `או בבת אחת: $${price} \\cdot ${up ? n2(1 + p / 100) : n2(1 - p / 100)} = ${res}$`],
      };
    } },
    { level: 2, gen() {
      const p = U.pick([10, 20, 25, 40, 50, 75, 5]), whole = U.R(2, 20) * (p === 75 || p === 25 ? 4 : p === 5 ? 20 : 10), part = p * whole / 100;
      return {
        q: `$${p}\\%$ מהנקודות של הקבוצה במשחק נקלעו בשלשות. בשלשות נקלעו ${part} נקודות. כמה נקודות קלעה הקבוצה בכל המשחק?`,
        type: 'number', answer: whole,
        mistakes: [{ v: p * part / 100, why: `חישבת $${p}\\%$ מ־${part}. אבל ${part} הוא רק החלק, ומחפשים את השלם.` }],
        hint: `מסמנים את כל הנקודות ב־$x$. אז $${n2(p / 100)}x = ${part}$.`,
        steps: [`$${n2(p / 100)}x = ${part}$`, `מחלקים ב־$${n2(p / 100)}$: $x = ${part} \\div ${n2(p / 100)}$`, `$x = ${whole}$ נקודות.`, `בדיקה: $${p}\\%$ מ־${whole} $= ${part}$ ✔`],
      };
    } },
    { level: 2, gen() {
      const [whole, part] = U.pick([[20, 5], [40, 10], [50, 20], [80, 20], [25, 10], [60, 15], [200, 50], [30, 6], [40, 30], [120, 30], [75, 15]]);
      return {
        q: `בשכבה יש ${whole} תלמידים, ו־${part} מהם משחקים בנבחרת. כמה אחוזים מהתלמידים משחקים בנבחרת?`,
        type: 'number', answer: part / whole * 100,
        mistakes: [{ v: whole / part, why: 'חילקת את השלם בחלק. בדוק: מה מחלקים במה?' },
          { v: part, why: `כתבת את מספר התלמידים בנבחרת. שאלו כמה <b>אחוזים</b> הם מתוך ${whole}.` }],
        hint: 'חלק ÷ שלם × 100.',
        steps: [`$\\frac{${part}}{${whole}}$`, `מצמצמים: $\\frac{${part}}{${whole}} = ${U.frac(part, whole)}$`, `$${U.frac(part, whole)} \\cdot 100 = ${n2(part / whole * 100)}\\%$`],
      };
    } },
    // ---------- רמה 3 ----------
    { level: 3, gen() {
      const p = U.pick([10, 20, 25, 30, 40, 50]), f = 1 - p / 100;
      const x = (p === 25 ? 4 : p === 30 ? 10 : 5) * U.R(4, 40), after = x * f;
      return {
        q: `אחרי הנחה של $${p}\\%$, מחיר של כדור הוא ${n2(after)} ₪. מה היה המחיר <b>לפני</b> ההנחה?`,
        type: 'number', answer: x,
        mistakes: [{ v: after * (1 + p / 100), why: `הוספת $${p}\\%$ מהמחיר ש<b>אחרי</b> ההנחה. אבל ההנחה חושבה מהמחיר המקורי, שהוא גדול יותר.` },
          { v: after * f, why: 'הורדת את ההנחה פעם נוספת. מחפשים את המחיר <b>לפני</b> ההנחה.' }],
        hint: `אחרי הנחה של $${p}\\%$ נשאר $${100 - p}\\%$ מהמחיר. כתבו $${n2(f)}x = ${n2(after)}$.`,
        steps: [`נשאר $${100 - p}\\%$ מהמחיר המקורי $x$.`, `$${n2(f)}x = ${n2(after)}$`, `$x = ${n2(after)} \\div ${n2(f)} = ${x}$ ₪`, `בדיקה: $${x} \\cdot ${n2(f)} = ${n2(after)}$ ✔`],
      };
    } },
    { level: 3, gen() {
      const p = U.pick([20, 25, 50, 10]), f = 1 + p / 100, x = (p === 25 ? 4 : p === 10 ? 10 : 5) * U.R(2, 12), y = x * f;
      return {
        q: `דני קלע $${p}\\%$ יותר נקודות מיוסי. ביחד הם קלעו ${n2(x + y)} נקודות. כמה נקודות קלע יוסי?`,
        type: 'number', answer: x,
        mistakes: [{ v: y, why: 'זה מה שקלע דני. שאלו על יוסי.' },
          { v: (x + y) / 2, why: 'חילקת את הנקודות שווה בשווה. אבל דני קלע יותר מיוסי.' }],
        hint: `יוסי: $x$. דני קלע $${p}\\%$ יותר, כלומר $${n2(f)}x$. ביחד: $x + ${n2(f)}x = ${n2(x + y)}$.`,
        steps: [`יוסי $x$, דני $${n2(f)}x$.`, `$x + ${n2(f)}x = ${n2(x + y)}$`, `$${n2(1 + f)}x = ${n2(x + y)}$`, `$x = ${n2(x + y)} \\div ${n2(1 + f)} = ${x}$`, `יוסי ${x} נקודות, דני ${n2(y)} נקודות.`],
      };
    } },
    { level: 3, gen() {
      const price = 100 * U.R(1, 5), p = U.pick([10, 20, 25, 50]), f1 = 1 + p / 100, f2 = 1 - p / 100, end = price * f1 * f2;
      return {
        q: `מחיר של מנוי לעונה היה ${price} ₪. הוא עלה ב־$${p}\\%$, ואחר כך המחיר החדש ירד ב־$${p}\\%$. מה המחיר בסוף?`,
        type: 'number', answer: end,
        mistakes: [{ v: price, why: 'עלייה וירידה באותו אחוז לא מבטלות זו את זו: הירידה מחושבת ממחיר אחר מזה של העלייה.' },
          { v: price * f1, why: 'זה המחיר אחרי העלייה. עכשיו צריך לחשב גם את הירידה.' }],
        hint: 'שני שלבים! הירידה מחושבת מהמחיר <b>אחרי</b> העלייה, לא מהמחיר המקורי.',
        steps: [`אחרי העלייה: $${price} \\cdot ${n2(f1)} = ${n2(price * f1)}$`, `אחרי הירידה: $${n2(price * f1)} \\cdot ${n2(f2)} = ${n2(end)}$`, `המחיר בסוף: $${n2(end)}$ ₪ — פחות מ־${price}!`],
      };
    } },
  ],

  summary: [
    'אחוז = חלק מ־100. $25\\% = \\frac{1}{4} = 0.25$.',
    'אחוז ממספר: כופלים ב־$\\frac{p}{100}$. טריק: מוצאים קודם $10\\%$.',
    'כמה אחוזים? חלק ÷ שלם × 100.',
    'עלייה ב־$p\\%$: כופלים ב־$(1 + \\frac{p}{100})$. הנחה: כופלים ב־$(1 - \\frac{p}{100})$.',
    'מוצאים את השלם: מסמנים אותו ב־$x$ ופותרים, למשל $0.3x = 12$.',
    'עלייה ואחריה ירידה באותו אחוז לא מחזירות למחיר ההתחלתי.',
  ],
});
})();
