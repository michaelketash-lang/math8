/* יחידת חימום: מספרים מכוונים — ציר המספרים, השוואה, חיבור וחיסור, כפל וחילוק, ערך מוחלט (חזרה מכיתה ז׳) */
(() => {
  const par = n => (n < 0 ? `(${n})` : `${n}`);
  const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="100%" style="direction:ltr;max-width:${w}px;display:block;margin:0 auto" dir="ltr">${inner}</svg>`;
  const NEG = 'var(--bad)', POS = 'var(--good)';

  /** ציר מספרים ב־SVG: מחזיר { r: markup, X: מספר→פיקסל } */
  function line(lo, hi, W, y, labels = v => true) {
    const X = v => 30 + (v - lo) / (hi - lo) * (W - 60);
    let r = `<line x1="${X(lo) - 14}" y1="${y}" x2="${X(hi) + 14}" y2="${y}" style="stroke:var(--muted);stroke-width:2"/>`;
    for (let v = lo; v <= hi; v++) {
      r += `<line x1="${X(v)}" y1="${y - (v ? 6 : 10)}" x2="${X(v)}" y2="${y + (v ? 6 : 10)}" style="stroke:var(--ink);stroke-width:${v ? 1.5 : 3}"/>`;
      if (labels(v)) r += `<text x="${X(v)}" y="${y + 26}" text-anchor="middle" font-size="13" style="fill:${v < 0 ? NEG : v > 0 ? POS : 'var(--ink)'};font-weight:${v ? 400 : 700}">${String(v).replace('-', '−')}</text>`;
    }
    return { r, X };
  }

  registerChapter('w-negatives', {
    intro: `
      <div class="idea"><b>ציר המספרים</b>באמצע יש $0$. מימין — המספרים <b>החיוביים</b> ($1, 2, 3, ...$). משמאל — המספרים <b>השליליים</b> ($-1, -2, -3, ...$).
        <br>מספר שנמצא <b>יותר ימינה</b> הוא <b>גדול יותר</b>. לכן $-2 \\gt -7$ — כמו בטמפרטורה: מינוס 2 מעלות פחות קר ממינוס 7.</div>
      <div class="idea"><b>חיבור וחיסור = קפיצות על הציר</b>
        <br>פלוס מספר חיובי ← קופצים <b>ימינה</b>: $-3 + 5 = 2$
        <br>מינוס מספר חיובי ← קופצים <b>שמאלה</b>: $2 - 5 = -3$
        <br>פלוס מספר שלילי ← כמו מינוס: $4 + (-6) = 4 - 6 = -2$
        <br>מינוס מספר שלילי ← כמו פלוס: $3 - (-2) = 3 + 2 = 5$</div>
      <div class="note"><b>למה מינוס של מינוס הוא פלוס?</b><br>אם מוחקים לך חוב של 2 שקלים, יש לך 2 שקלים יותר. "להוריד מינוס" = להוסיף.</div>
      <div class="idea"><b>כפל וחילוק — חוק הסימנים</b>קודם מחשבים בלי סימנים, ואז קובעים סימן:
        <br>סימנים <b>שווים</b> ← התוצאה <b>חיובית</b>: $(-3) \\cdot (-4) = 12$, $\\;(-12) \\div (-3) = 4$
        <br>סימנים <b>שונים</b> ← התוצאה <b>שלילית</b>: $(-3) \\cdot 4 = -12$, $\\;12 \\div (-3) = -4$</div>
      <div class="idea"><b>ערך מוחלט = מרחק מ־0</b>$\\lvert -5 \\rvert = 5$ וגם $\\lvert 5 \\rvert = 5$, כי שניהם במרחק 5 צעדים מ־0. מרחק אף פעם לא שלילי.
        <br>המרחק בין שני מספרים: סופרים את הצעדים ביניהם. בין $-3$ ל־$4$ יש $3 + 4 = 7$ צעדים.</div>
      <p class="muted">בכדורסל יש נתון "פלוס/מינוס": כשהשחקן היה על המגרש הקבוצה קלעה 10 וספגה 14? הנתון שלו הוא $10 - 14 = -4$.</p>`,

    example: {
      question: 'חשבו: $-3 - (-8) + (-2) \\cdot 4$',
      steps: [
        'יש כאן כפל, וכפל עושים <b>לפני</b> חיבור וחיסור. מתחילים מ־$(-2) \\cdot 4$.',
        'בלי סימנים: $2 \\cdot 4 = 8$. הסימנים <b>שונים</b> (מינוס ופלוס) ← התוצאה שלילית: $(-2) \\cdot 4 = -8$.',
        'עכשיו התרגיל הוא: $-3 - (-8) + (-8)$.',
        'מינוס של מספר שלילי הופך לפלוס: $-3 - (-8) = -3 + 8$.',
        'על ציר המספרים: מתחילים ב־$-3$ וקופצים 8 ימינה ← מגיעים ל־$5$.',
        'נשאר $5 + (-8)$. פלוס מספר שלילי = מינוס: $5 - 8$. מ־5 קופצים 8 שמאלה ← $-3$.',
        'התשובה: $-3 - (-8) + (-2) \\cdot 4 = -3$.',
      ],
    },

    tools: [
      {
        title: 'קפיצות על ציר המספרים',
        desc: 'בחרו מאיפה מתחילים, איזו פעולה ובאיזה מספר. לחצו "קפוץ!" והכדור יקפוץ צעד אחרי צעד. שימו לב לאיזה כיוון הוא הולך.',
        mount(el) {
          const st = { a: -3, b: 5, op: '+' };
          let hops = 0, timer = null;
          el.insertAdjacentHTML('beforeend', `<div class="row" style="justify-content:center">
            <button class="btn ghost op" data-op="+" dir="ltr">+ פלוס</button><button class="btn ghost op" data-op="-" dir="ltr">− מינוס</button>
            <button class="btn go">קפוץ! 🏀</button></div>`);
          const pic = document.createElement('div'), out = document.createElement('div');
          out.className = 'readout'; el.append(pic, out);
          const dir = () => Math.sign(st.b) * (st.op === '+' ? 1 : -1);
          const res = () => st.a + dir() * Math.abs(st.b);
          const draw = () => {
            el.querySelectorAll('.op').forEach(b => { const on = b.dataset.op === st.op; b.style.borderColor = on ? 'var(--accent)' : ''; b.style.fontWeight = on ? 700 : 400; });
            const { r, X } = line(-10, 10, 600, 120), d = dir();
            let s = r;
            for (let i = 0; i < hops; i++) {
              const p = X(st.a + d * i), q = X(st.a + d * (i + 1));
              s += `<path d="M ${p} 110 Q ${(p + q) / 2} 60 ${q} 110" style="fill:none;stroke:var(--accent);stroke-width:2.5"/>`;
            }
            s += `<circle cx="${X(st.a)}" cy="120" r="5" style="fill:var(--blue)"/><text x="${X(st.a)}" y="160" text-anchor="middle" font-size="12" style="fill:var(--blue)">התחלה</text>`;
            s += `<circle cx="${X(st.a + d * hops)}" cy="100" r="10" style="fill:var(--accent)"/>`;
            pic.innerHTML = svg(600, 170, s);
            const b = st.b < 0 ? `(${st.b})` : st.b, done = hops === Math.abs(st.b);
            const rule = st.b === 0 ? 'אפס — לא זזים בכלל.'
              : st.op === '+' && st.b > 0 ? 'פלוס מספר <b>חיובי</b> ← קופצים <b>ימינה</b>.'
              : st.op === '+' ? 'פלוס מספר <b>שלילי</b> ← קופצים <b>שמאלה</b> (כמו מינוס).'
              : st.b > 0 ? 'מינוס מספר <b>חיובי</b> ← קופצים <b>שמאלה</b>.'
              : 'מינוס מספר <b>שלילי</b> ← שני מינוסים הופכים לפלוס ← קופצים <b>ימינה</b>!';
            out.innerHTML = `$${st.a} ${st.op === '+' ? '+' : '-'} ${b} = ${done ? res() : '\\;?'}$<br>${rule}`;
            U.math(out);
          };
          const reset = () => { clearInterval(timer); hops = 0; draw(); };
          el.querySelectorAll('.op').forEach(b => b.onclick = () => { st.op = b.dataset.op; reset(); });
          el.querySelector('.go').onclick = () => {
            reset();
            timer = setInterval(() => { if (hops >= Math.abs(st.b)) return clearInterval(timer); hops++; draw(); }, 450);
          };
          U.slider(el, { label: 'מתחילים ב־', min: -5, max: 5, value: st.a, onInput: v => { st.a = v; reset(); } });
          U.slider(el, { label: 'המספר השני', min: -5, max: 5, value: st.b, onInput: v => { st.b = v; reset(); } });
        },
      },
      {
        title: 'אימון חוקי הסימנים',
        desc: 'לפני שמחשבים — מה יהיה הסימן של התוצאה? לחצו חיובי או שלילי. נסו להגיע לרצף של 10!',
        mount(el) {
          el.insertAdjacentHTML('beforeend', `<div class="readout" style="font-size:1.4em"></div>
            <div class="row" style="justify-content:center"><button class="btn ghost ans" data-s="1">חיובי +</button><button class="btn ghost ans" data-s="-1">שלילי −</button></div>
            <div class="readout fbk">מה הסימן?</div>
            <div class="note">סימנים <b>שווים</b> (שניהם פלוס או שניהם מינוס) ← <b>חיובי</b> &nbsp;·&nbsp; סימנים <b>שונים</b> ← <b>שלילי</b>. בכפל ובחילוק אותו חוק.</div>`);
          const q = el.querySelector('.readout'), fb = el.querySelector('.fbk');
          let x, y, mul, streak = 0, answered;
          const fresh = () => {
            mul = Math.random() < 0.6; answered = false;
            do { y = U.RNZ(-6, 6); x = mul ? U.RNZ(-9, 9) : y * U.RNZ(-9, 9); } while (x > 0 && y > 0 && Math.random() < 0.7); // בחילוק: תוצאה שלמה
            q.innerHTML = `$${par(x)} ${mul ? '\\cdot' : '\\div'} ${par(y)}$`; U.math(q);
          };
          el.querySelectorAll('.ans').forEach(b => b.onclick = () => {
            if (answered) return;
            const v = mul ? x * y : x / y, ok = Math.sign(v) === +b.dataset.s, same = (x > 0) === (y > 0);
            streak = ok ? streak + 1 : 0; answered = true;
            fb.innerHTML = `${ok ? '✔ נכון!' : '✘ לא בדיוק.'} הסימנים ${same ? 'שווים ← חיובי' : 'שונים ← שלילי'}: $${par(x)} ${mul ? '\\cdot' : '\\div'} ${par(y)} = ${v}$
              &nbsp; רצף: <b>${streak}</b>${streak >= 10 ? ' 🏆' : ''} <button class="btn">הבא ←</button>`;
            U.math(fb); fb.querySelector('button').onclick = () => { fresh(); fb.textContent = 'מה הסימן?'; };
          });
          fresh();
        },
      },
      {
        title: 'ערך מוחלט = מרחק',
        desc: 'הזיזו את שתי הנקודות. הכלי מראה מי גדול יותר, מה המרחק של כל אחת מ־0 (הערך המוחלט), ומה המרחק ביניהן.',
        mount(el) {
          const st = { a: -4, b: 3 };
          const pic = document.createElement('div'), out = document.createElement('div');
          out.className = 'readout'; el.append(pic, out);
          const upd = () => {
            const { a, b } = st, { r, X } = line(-8, 8, 600, 110);
            let s = r;
            const lo = Math.min(a, b), hi = Math.max(a, b);
            s += `<line x1="${X(lo)}" y1="70" x2="${X(hi)}" y2="70" style="stroke:var(--accent);stroke-width:4"/>`;
            s += `<text x="${(X(lo) + X(hi)) / 2}" y="60" text-anchor="middle" font-size="15" style="fill:var(--accent);font-weight:700">${hi - lo}</text>`;
            for (const [v, c, nm, yy] of [[a, 'var(--blue)', 'a', 152], [b, 'var(--accent)', 'b', 166]]) {
              s += `<line x1="${X(0)}" y1="${yy}" x2="${X(v)}" y2="${yy}" style="stroke:${c};stroke-width:2;stroke-dasharray:4 3"/>`;
              s += `<circle cx="${X(v)}" cy="110" r="9" style="fill:${c}"/><text x="${X(v)}" y="92" text-anchor="middle" font-size="14" style="fill:${c};font-weight:700">${nm}</text>`;
            }
            pic.innerHTML = svg(600, 175, s);
            const cmp = a > b ? '\\gt' : a < b ? '\\lt' : '=';
            out.innerHTML = `$${a} ${cmp} ${b}$ ${a === b ? '' : `(${a > b ? 'a' : 'b'} יותר ימינה, ולכן גדול יותר)`}
              <br>$\\lvert ${a} \\rvert = ${Math.abs(a)}$ &nbsp;·&nbsp; $\\lvert ${b} \\rvert = ${Math.abs(b)}$ <span class="muted">(המרחק מ־0, הקווים המקווקווים)</span>
              <br>המרחק בין הנקודות: $\\lvert ${a} - ${par(b)} \\rvert = ${hi - lo}$`;
            U.math(out);
          };
          U.slider(el, { label: 'נקודה a', min: -8, max: 8, value: st.a, onInput: v => { st.a = v; upd(); } });
          U.slider(el, { label: 'נקודה b', min: -8, max: 8, value: st.b, onInput: v => { st.b = v; upd(); } });
        },
      },
    ],

    exercises: [
      // ---------- רמה 1 ----------
      { level: 1, gen() { // השוואה
        let a, b; do { a = U.R(-9, 9); b = U.R(-9, 9); } while (a === b || (a >= 0 && b >= 0));
        const hi = Math.max(a, b), lo = Math.min(a, b);
        return {
          q: `איזה מספר גדול יותר: $${a}$ או $${b}$?`,
          type: 'choice', choices: [`$${a}$`, `$${b}$`], answer: a > b ? 0 : 1,
          hint: 'דמיין את ציר המספרים: המספר שנמצא <b>יותר ימינה</b> הוא הגדול. כל מספר שלילי קטן מ־0.',
          steps: [
            `על ציר המספרים, $${hi}$ נמצא מימין ל־$${lo}$.`,
            hi < 0 ? `שניהם שליליים. $${lo}$ רחוק יותר מ־0 שמאלה, ולכן הוא <b>קטן</b> יותר (מינוס ${-lo} מעלות קר יותר ממינוס ${-hi}).` : `$${lo}$ שלילי${hi ? `, ו־$${hi}$ חיובי` : ''}. ${hi ? 'מספר חיובי' : 'אפס'} תמיד גדול ממספר שלילי.`,
            `לכן $${hi}$ גדול יותר: $${hi} \\gt ${lo}$.`,
          ],
        };
      } },
      { level: 1, gen() { // קריאת ציר המספרים
        let v; do { v = U.RNZ(-7, 7); } while (Math.abs(v) === 5);
        return {
          q: 'איזה מספר מסומן בנקודה הכתומה על ציר המספרים?',
          type: 'number', answer: v,
          mount(el) {
            const { r, X } = line(-7, 7, 520, 50, x => x % 5 === 0);
            el.innerHTML = svg(520, 90, r + `<circle cx="${X(v)}" cy="50" r="9" style="fill:var(--accent)"/>`);
          },
          hint: 'מתחילים ב־0 וסופרים את הקווים הקטנים עד הנקודה. שמאלה מ־0 המספרים שליליים.',
          steps: [
            `מתחילים ב־0 וסופרים ${v < 0 ? 'שמאלה' : 'ימינה'}: ${Math.abs(v)} צעדים.`,
            v < 0 ? `משמאל ל־0 המספרים שליליים, ולכן הנקודה היא $${v}$.` : `מימין ל־0 המספרים חיוביים, ולכן הנקודה היא $${v}$.`,
          ],
        };
      } },
      { level: 1, gen() { // חיבור עם שליליים
        const a = U.R(1, 8), b = U.R(1, 8), form = U.R(0, 2);
        const [x, y] = [[-a, b], [a, -b], [-a, -b]][form], e = `${x} + ${par(y)}`;
        return {
          q: `חשבו: $${e}$`,
          type: 'number', answer: x + y,
          hint: `מתחילים ב־$${x}$ על ציר המספרים. פלוס מספר חיובי ← ימינה. פלוס מספר שלילי ← שמאלה.`,
          steps: [
            `מתחילים ב־$${x}$.`,
            y > 0 ? `מוסיפים $${y}$ (חיובי) ← קופצים ${y} צעדים ימינה.` : `מוסיפים $${y}$ (שלילי) ← זה כמו $- ${-y}$ ← קופצים ${-y} צעדים שמאלה.`,
            `מגיעים ל־$${x + y}$. כלומר $${e} = ${x + y}$.`,
          ],
        };
      } },
      { level: 1, gen() { // חיסור שמוביל לשלילי
        const b = U.R(2, 9), x = Math.random() < 0.5 ? U.R(1, b - 1) : -U.R(1, 7), e = `${x} - ${b}`;
        return {
          q: `חשבו: $${e}$`,
          type: 'number', answer: x - b,
          hint: `מתחילים ב־$${x}$ וקופצים ${b} צעדים <b>שמאלה</b> (מינוס = שמאלה). מותר לעבור את ה־0!`,
          steps: [
            `מתחילים ב־$${x}$.`,
            x > 0 ? `קופצים ${x} צעדים שמאלה עד 0, ועוד ${b - x} צעדים אחרי ה־0.` : `כבר שליליים, וממשיכים ${b} צעדים שמאלה — מתרחקים מ־0.`,
            `מגיעים ל־$${x - b}$. כלומר $${e} = ${x - b}$.`,
          ],
        };
      } },
      { level: 1, gen() { // כפל סימנים
        let x, y; do { x = U.RNZ(-6, 6); y = U.RNZ(-6, 6); } while (x > 0 && y > 0);
        const e = `${par(x)} \\cdot ${par(y)}`, same = (x > 0) === (y > 0);
        return {
          q: `חשבו: $${e}$`,
          type: 'number', answer: x * y,
          hint: 'קודם כופלים בלי סימנים. ואז: סימנים <b>שווים</b> ← חיובי, סימנים <b>שונים</b> ← שלילי.',
          steps: [
            `בלי סימנים: $${Math.abs(x)} \\cdot ${Math.abs(y)} = ${Math.abs(x * y)}$.`,
            `הסימנים ${same ? 'שווים (שני מינוסים)' : 'שונים (אחד מינוס ואחד פלוס)'} ← התוצאה ${same ? 'חיובית' : 'שלילית'}.`,
            `$${e} = ${x * y}$.`,
          ],
        };
      } },
      { level: 1, gen() { // ערך מוחלט
        const v = Math.random() < 0.75 ? -U.R(1, 15) : U.R(0, 15);
        return {
          q: `חשבו את הערך המוחלט: $\\lvert ${v} \\rvert$`,
          type: 'number', answer: Math.abs(v),
          hint: 'ערך מוחלט = כמה צעדים המספר רחוק מ־0. מרחק הוא אף פעם לא שלילי.',
          steps: [
            `$${v}$ נמצא ${v ? `${Math.abs(v)} צעדים ${v < 0 ? 'שמאלה' : 'ימינה'} מ־0` : 'בדיוק ב־0'}.`,
            `לכן $\\lvert ${v} \\rvert = ${Math.abs(v)}$.`,
          ],
        };
      } },

      // ---------- רמה 2 ----------
      { level: 2, gen() { // מינוס של שלילי
        const x = U.R(-8, 8), y = U.R(1, 9), e = `${x} - (-${y})`;
        return {
          q: `חשבו: $${e}$`,
          type: 'number', answer: x + y,
          hint: `מינוס של מספר שלילי הופך לפלוס: $- (-${y}) = + ${y}$.`,
          steps: [
            `שני מינוסים צמודים הופכים לפלוס: $${e} = ${x} + ${y}$.`,
            `מ־$${x}$ קופצים ${y} צעדים ימינה: $${x} + ${y} = ${x + y}$.`,
          ],
        };
      } },
      { level: 2, gen() { // חילוק סימנים
        let q, y, x; do { q = U.RNZ(-9, 9); y = U.RNZ(-6, 6); x = q * y; } while ((x > 0 && y > 0) || Math.abs(y) === 1);
        const e = `${par(x)} \\div ${par(y)}`, same = (x > 0) === (y > 0);
        return {
          q: `חשבו: $${e}$`,
          type: 'number', answer: q,
          hint: 'בחילוק אותו חוק כמו בכפל: סימנים <b>שווים</b> ← חיובי, סימנים <b>שונים</b> ← שלילי.',
          steps: [
            `בלי סימנים: $${Math.abs(x)} \\div ${Math.abs(y)} = ${Math.abs(q)}$.`,
            `הסימנים ${same ? 'שווים' : 'שונים'} ← התוצאה ${same ? 'חיובית' : 'שלילית'}.`,
            `$${e} = ${q}$. (בדיקה: $${par(q)} \\cdot ${par(y)} = ${x}$ ✔)`,
          ],
        };
      } },
      { level: 2, gen() { // ערך מוחלט כמרחק בין שני מספרים
        let a, b; do { a = U.R(-9, 6); b = U.R(-6, 9); } while (a >= b || a >= 0 || b - a > 15);
        const d = b - a;
        return {
          q: `מה המרחק על ציר המספרים בין $${a}$ לבין $${b}$?`,
          type: 'number', answer: d,
          hint: 'סופרים כמה צעדים יש מהמספר הקטן עד הגדול. אם עוברים את ה־0 — סופרים עד 0 ומשם הלאה.',
          steps: b > 0
            ? [`מ־$${a}$ עד 0: ${-a} צעדים.`, `מ־0 עד $${b}$: ${b} צעדים.`, `ביחד: $${-a} + ${b} = ${d}$.`]
            : [`שני המספרים לא חיוביים. מחסירים את הקטן מהגדול: $${b} - (${a}) = ${b} + ${-a} = ${d}$.`, `המרחק הוא ${d} צעדים.`],
        };
      } },
      { level: 2, gen() { // סימן של מכפלה ארוכה
        const n = U.R(3, 4), f = Array.from({ length: n }, () => U.RNZ(-4, 4));
        if (!f.some(v => v < 0)) f[0] = -f[0];
        const k = f.filter(v => v < 0).length, prod = f.reduce((p, v) => p * v, 1), e = f.map(par).join(' \\cdot ');
        return {
          q: `בלי לחשב עד הסוף: התוצאה של $${e}$ היא...`,
          type: 'choice', choices: ['חיובית', 'שלילית'], answer: prod > 0 ? 0 : 1,
          hint: 'סופרים כמה גורמים שליליים יש. כל <b>זוג</b> מינוסים נותן פלוס.',
          steps: [
            `סופרים את המספרים השליליים: יש ${k}.`,
            k % 2 === 0 ? `${k} הוא זוגי ← כל המינוסים מסתדרים בזוגות ← התוצאה <b>חיובית</b>.` : `${k} הוא אי־זוגי ← נשאר מינוס אחד בלי זוג ← התוצאה <b>שלילית</b>.`,
            `(לבדיקה: $${e} = ${prod}$.)`,
          ],
        };
      } },
      { level: 2, gen() { // טמפרטורה
        let t; do { t = U.R(-8, 4); } while (t === 1 || t === -1);
        const up = Math.random() < 0.5, c = up ? U.R(2, 9) : U.R(t > 0 ? t + 1 : 2, t > 0 ? t + 6 : 7);
        const end = up ? t + c : t - c;
        return {
          q: `בבוקר הטמפרטורה בחרמון הייתה $${t}$ מעלות. עד הצהריים היא ${up ? 'עלתה' : 'ירדה'} ב־${c} מעלות. מה הטמפרטורה בצהריים?`,
          type: 'number', answer: end,
          hint: `${up ? 'עלתה ← פלוס (ימינה על הציר)' : 'ירדה ← מינוס (שמאלה על הציר)'}. כתבו תרגיל ופתרו.`,
          steps: [
            `${up ? 'עלתה' : 'ירדה'} ב־${c} ← $${t} ${up ? '+' : '-'} ${c}$.`,
            `מ־$${t}$ קופצים ${c} צעדים ${up ? 'ימינה' : 'שמאלה'} ← $${end}$.`,
            `בצהריים: $${end}$ מעלות.`,
          ],
        };
      } },

      // ---------- רמה 3 ----------
      { level: 3, gen() { // תרגיל משולב
        if (Math.random() < 0.5) {
          let a, b; do { a = U.RNZ(-5, 5); b = U.RNZ(-5, 5); } while (a > 0 && b > 0);
          const c = U.RNZ(-9, 9), e = `${par(a)} \\cdot ${par(b)} + ${par(c)}`;
          return {
            q: `חשבו: $${e}$`, type: 'number', answer: a * b + c,
            hint: 'קודם כפל, ואחר כך חיבור. בכפל: סימנים שווים ← חיובי, שונים ← שלילי.',
            steps: [`קודם הכפל: $${par(a)} \\cdot ${par(b)} = ${a * b}$.`, `עכשיו: $${a * b} + ${par(c)} = ${a * b} ${U.sgn(c)}$.`, `$= ${a * b + c}$.`],
          };
        }
        const x = U.R(-6, 6), y = U.R(1, 8), z = U.R(2, 9), e = `${x} - (-${y}) - ${z}`;
        return {
          q: `חשבו: $${e}$`, type: 'number', answer: x + y - z,
          hint: 'קודם הופכים את $-(-...)$ לפלוס, ואז מחשבים משמאל לימין.',
          steps: [`מינוס של שלילי = פלוס: $${x} + ${y} - ${z}$.`, `$${x} + ${y} = ${x + y}$.`, `$${x + y} - ${z} = ${x + y - z}$.`],
        };
      } },
      { level: 3, gen() { // המספר החסר
        if (Math.random() < 0.5) {
          const n = U.RNZ(-9, 9), b = U.RNZ(-9, -1), c = n + b;
          return {
            q: `איזה מספר צריך לכתוב במקום הריבוע? $\\square + ${par(b)} = ${c}$`, type: 'number', answer: n,
            hint: `שואלים: מאיפה צריך להתחיל, כדי שאחרי פלוס $${par(b)}$ נגיע ל־$${c}$? הפעולה ההפוכה: $${c} - ${par(b)}$.`,
            steps: [`הפעולה ההפוכה לחיבור היא חיסור: $\\square = ${c} - ${par(b)}$.`, `מינוס של שלילי = פלוס: $${c} + ${-b} = ${n}$.`, `בדיקה: $${n} + ${par(b)} = ${c}$ ✔`],
          };
        }
        const a = U.RNZ(-6, -2), n = U.RNZ(-7, 7), c = a * n;
        return {
          q: `איזה מספר צריך לכתוב במקום הריבוע? $${par(a)} \\cdot \\square = ${c}$`, type: 'number', answer: n,
          hint: `הפעולה ההפוכה לכפל היא חילוק: $${c} \\div ${par(a)}$. זהירות עם הסימן!`,
          steps: [`$\\square = ${par(c)} \\div ${par(a)}$.`, `בלי סימנים: $${Math.abs(c)} \\div ${-a} = ${Math.abs(n)}$. הסימנים ${c < 0 ? 'שווים ← חיובי' : 'שונים ← שלילי'}.`, `$\\square = ${n}$. בדיקה: $${par(a)} \\cdot ${par(n)} = ${c}$ ✔`],
        };
      } },
    ],

    summary: [
      'על ציר המספרים: מי שיותר <b>ימינה</b> — גדול יותר. לכן $-2 \\gt -7$, וכל שלילי קטן מ־0.',
      'פלוס חיובי ← ימינה. מינוס חיובי ← שמאלה. פלוס שלילי = מינוס: $4 + (-6) = 4 - 6$.',
      'מינוס של מינוס = פלוס: $3 - (-2) = 3 + 2 = 5$.',
      'כפל וחילוק: סימנים <b>שווים</b> ← חיובי, סימנים <b>שונים</b> ← שלילי.',
      'ערך מוחלט = מרחק מ־0, תמיד לא שלילי: $\\lvert -5 \\rvert = 5$. המרחק בין שני מספרים = סופרים את הצעדים ביניהם.',
    ],
  });
})();
