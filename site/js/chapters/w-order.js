/* יחידת חימום: סדר פעולות חשבון וחזקות (חזרה מכיתה ז׳) */
(() => {
  /** מספר בסוגריים אם הוא שלילי */
  const p = n => (n < 0 ? `(${n})` : String(n));
  /** כפל חוזר: (3, 4) → '3 \cdot 3 \cdot 3 \cdot 3' */
  const rep = (a, n, op = '\\cdot') => Array(n).fill(p(a)).join(` ${op} `);
  /** שאלה אמריקאית: מסיר כפילויות ומערבב */
  const mc = (right, wrongs) => {
    const choices = U.shuffle([right, ...[...new Set(wrongs)].filter(w => w !== right).slice(0, 3)].map(c => `$${c}$`));
    return { type: 'choice', choices, answer: choices.indexOf(`$${right}$`) };
  };

  /* ---------- מנוע קטן לכלי "מה עושים עכשיו?" ---------- */
  const SHOW = { '+': '+', '-': '−', '*': '×', '/': '÷' };
  const RANK = { '^': 3, '*': 2, '/': 2, '+': 1, '-': 1 };
  const tok = s => s.match(/\d+|[-+*/^()]/g).map(t => (/\d/.test(t) ? +t : t));
  const calc = (a, op, b) => (op === '+' ? a + b : op === '-' ? a - b : op === '*' ? a * b : op === '/' ? a / b : a ** b);
  /** הקבוצות הפנימיות ביותר (בלי סוגריים בתוכן), ואילו פעולות מותר לעשות עכשיו */
  function legal(ts) {
    const groups = [];
    if (ts.includes('(')) {
      for (let i = 0; i < ts.length; i++) if (ts[i] === '(') {
        let j = i + 1; while (ts[j] !== ')' && ts[j] !== '(') j++;
        if (ts[j] === ')') groups.push([i + 1, j]);
      }
    } else groups.push([0, ts.length]);
    const ok = new Set();
    for (const [s, e] of groups) {
      const ops = []; for (let i = s; i < e; i++) if (typeof ts[i] === 'string') ops.push(i);
      const top = Math.max(...ops.map(i => RANK[ts[i]]));
      // חזקות: כולן. כפל/חילוק וחיבור/חיסור: רק הראשונה משמאל בכל רצף מאותה דרגה
      ops.forEach((i, k) => {
        if (RANK[ts[i]] !== top) return;
        if (top === 3 || k === 0 || RANK[ts[ops[k - 1]]] !== top) ok.add(i);
      });
    }
    return { ok, groups };
  }
  function why(ts, i) {
    const { groups } = legal(ts);
    const g = groups.find(([s, e]) => i >= s && i < e);
    if (!g) return 'קודם מחשבים את מה שבתוך <b>הסוגריים</b>.';
    let top = 0; for (let k = g[0]; k < g[1]; k++) if (typeof ts[k] === 'string') top = Math.max(top, RANK[ts[k]]);
    if (RANK[ts[i]] < top) return top === 3 ? 'קודם <b>חזקה</b>, ורק אחר כך כפל, חילוק, חיבור וחיסור.' : '<b>כפל וחילוק</b> באים לפני חיבור וחיסור.';
    return 'פעולות מאותה דרגה מחשבים <b>משמאל לימין</b>. יש פעולה שבאה לפני זו.';
  }
  /** טקסט HTML של ביטוי (בשביל ההיסטוריה) */
  const html = ts => ts.map((t, i) => (t === '^' ? '' : ts[i - 1] === '^' ? `<sup>${t}</sup>` : SHOW[t] ? ` ${SHOW[t]} ` : t)).join('');
  const EXPRS = ['3 + 4 * 2', '(3 + 4) * 2', '20 - 6 / 2', '12 / 3 * 2', '10 - 4 + 3', '2 + 3^2', '2 * 3 + 4 * 5',
    '5 * (6 - 2) + 1', '(1 + 2)^2 * 2', '18 / (2 + 1) - 2^2', '40 - 2 * (1 + 3)^2', '(8 - 2 * 3)^2 + 4 / 2'];

  registerChapter('w-order', {
    intro: `
      <p>בתרגיל עם כמה פעולות, <b>הסדר</b> קובע את התשובה. למשל $2 + 3 \\cdot 4$: אם מחברים קודם יוצא 20, ואם כופלים קודם יוצא 14. רק אחת מהן נכונה — 14.</p>
      <div class="idea"><b>הסולם: מה עושים קודם?</b>
        1. <b>סוגריים</b> — מה שבתוך הסוגריים קודם לכול.
        <br>2. <b>חזקות</b> — כמו $3^2$.
        <br>3. <b>כפל וחילוק</b>.
        <br>4. <b>חיבור וחיסור</b>.</div>
      <div class="idea"><b>אותה דרגה? משמאל לימין</b>כשיש רק כפל וחילוק (או רק חיבור וחיסור) — מחשבים לפי הסדר, משמאל לימין.
        <div class="formula">$12 \\div 3 \\cdot 2 = 4 \\cdot 2 = 8$ &nbsp;&nbsp; $10 - 4 + 3 = 6 + 3 = 9$</div></div>
      <div class="idea"><b>חזקה = כפל חוזר</b>$2^4$ פירושו: 2 כפול עצמו 4 פעמים.
        <div class="formula">$2^4 = 2 \\cdot 2 \\cdot 2 \\cdot 2 = 16$</div>
        המספר הגדול (2) נקרא <b>הבסיס</b>, והמספר הקטן למעלה (4) אומר <b>כמה פעמים</b> כופלים. $3^2$ קוראים "שלוש בריבוע".</div>
      <div class="note"><b>מינוס וחזקה — זהירות!</b><br>
        $(-3)^2 = (-3) \\cdot (-3) = 9$ — המינוס בתוך הסוגריים, אז גם הוא בריבוע.
        <br>$-3^2 = -(3 \\cdot 3) = -9$ — בלי סוגריים, רק ה־3 בריבוע, והמינוס נשאר בחוץ.</div>
      <p class="muted">טעות נפוצה: $2^4$ זה <b>לא</b> $2 \\cdot 4 = 8$. זה 16!</p>`,

    example: {
      question: 'חשבו: $20 - 3 \\cdot (1 + 1)^2 \\div 2$',
      steps: [
        'מתחילים מהסוגריים: $1 + 1 = 2$. עכשיו התרגיל: $20 - 3 \\cdot 2^2 \\div 2$.',
        'אחרי סוגריים באות חזקות: $2^2 = 2 \\cdot 2 = 4$. התרגיל: $20 - 3 \\cdot 4 \\div 2$.',
        'עכשיו כפל וחילוק. יש גם כפל וגם חילוק — אז משמאל לימין. קודם $3 \\cdot 4 = 12$.',
        'התרגיל: $20 - 12 \\div 2$. ממשיכים בחילוק: $12 \\div 2 = 6$.',
        'נשאר רק חיסור: $20 - 6 = 14$.',
        'התשובה: $14$. שים לב: לא התחלנו ב־$20 - 3$, כי חיסור הוא האחרון בסולם.',
      ],
    },

    tools: [
      {
        title: 'מה עושים עכשיו? לחצו על הפעולה',
        desc: 'בכל צעד לחצו על הפעולה שצריך לעשות עכשיו (על סימן הפעולה, או על המספר הקטן של החזקה). אם תבחרו פעולה מוקדם מדי — תקבלו הסבר למה.',
        mount(el) {
          el.insertAdjacentHTML('beforeend', `<div class="readout ex-line" dir="ltr" style="font-size:1.6em"></div>
            <div class="readout msg">לחצו על הפעולה הראשונה ←</div><div class="readout hist" dir="ltr"></div>
            <div class="row" style="justify-content:center"><button class="btn ghost new">תרגיל הבא</button></div>`);
          const line = el.querySelector('.ex-line'), msg = el.querySelector('.msg'), hist = el.querySelector('.hist');
          let k = -1, ts;
          const draw = () => {
            line.innerHTML = '';
            ts.forEach((t, i) => {
              if (ts[i - 1] === '^') return;
              if (typeof t === 'number' || t === '(' || t === ')') { line.insertAdjacentHTML('beforeend', `<span>${t}</span>`); return; }
              const b = document.createElement('button');
              b.className = 'btn ghost'; b.style.cssText = 'margin:0 4px;padding:2px 10px;font-size:inherit';
              b.innerHTML = t === '^' ? `<sup>${ts[i + 1]}</sup>` : SHOW[t];
              b.title = t === '^' ? 'חזקה' : '';
              b.onclick = () => {
                if (!legal(ts).ok.has(i)) { msg.innerHTML = '✗ עוד לא. ' + why(ts, i); return; }
                const done = `${ts[i - 1]}${t === '^' ? `<sup>${ts[i + 1]}</sup>` : ` ${SHOW[t]} ${ts[i + 1]}`}`;
                const r = calc(ts[i - 1], t, ts[i + 1]);
                ts.splice(i - 1, 3, r);
                for (let j = 0; j < ts.length - 2; j++) if (ts[j] === '(' && typeof ts[j + 1] === 'number' && ts[j + 2] === ')') ts.splice(j, 3, ts[j + 1]);
                hist.insertAdjacentHTML('beforeend', `<div>= ${html(ts)}</div>`);
                msg.innerHTML = ts.length === 1 ? `🏀 סל! התוצאה היא <b>${ts[0]}</b>. לחצו "תרגיל הבא".` : `✔ נכון! <span dir="ltr">${done} = ${r}</span>. מה עכשיו?`;
                draw();
              };
              line.appendChild(b);
            });
          };
          const fresh = () => {
            k = (k + 1) % EXPRS.length; ts = tok(EXPRS[k]);
            hist.innerHTML = `<div>${html(ts)}</div>`; msg.textContent = 'לחצו על הפעולה הראשונה ←'; draw();
          };
          el.querySelector('.new').onclick = fresh;
          fresh();
        },
      },
      {
        title: 'בונה החזקות',
        desc: 'בחרו בסיס ומעריך (כמה פעמים כופלים). נסו בסיס שלילי עם מעריך זוגי ואי־זוגי, והשוו בין $(-3)^2$ לבין $-3^2$.',
        mount(el) {
          const st = { b: 3, n: 2 };
          const chips = document.createElement('div'); chips.className = 'row'; chips.dir = 'ltr'; chips.style.justifyContent = 'center';
          const out = document.createElement('div'); out.className = 'readout';
          el.append(chips, out);
          const upd = () => {
            const { b, n } = st, r = b ** n, a = Math.abs(b);
            chips.innerHTML = Array.from({ length: n }, () => `<span style="display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:50%;background:var(--accent-soft);border:2px solid var(--accent);font-weight:700">${U.num(b)}</span>`).join('<b style="align-self:center">×</b>');
            let s = `$${p(b)}^{${n}} = ${rep(b, n)} = ${r}$`;
            if (b < 0) {
              s += `<br><span class="muted">בלי סוגריים:</span> $-${a}^{${n}} = -(${rep(a, n)}) = ${-(a ** n)}$`;
              s += `<br>${n % 2 ? 'מעריך <b>אי־זוגי</b>: מספר אי־זוגי של מינוסים ← התוצאה שלילית.' : 'מעריך <b>זוגי</b>: המינוסים מתקזזים בזוגות ← התוצאה חיובית.'}`;
            }
            out.innerHTML = s; U.math(out);
          };
          U.slider(el, { label: 'בסיס', min: -5, max: 5, value: st.b, onInput: v => { st.b = v; upd(); } });
          U.slider(el, { label: 'כמה פעמים (מעריך)', min: 1, max: 6, value: st.n, onInput: v => { st.n = v; upd(); } });
        },
      },
    ],

    exercises: [
      // כפל וחילוק לפני חיבור וחיסור
      { level: 1, gen() {
        const a = U.R(1, 10), b = U.R(2, 5), c = U.R(2, 5), v = U.R(0, 2), pr = b * c;
        const [q, ans, wrong] = v === 0 ? [`${a} + ${b} \\cdot ${c}`, a + pr, (a + b) * c]
          : v === 1 ? [`${b} \\cdot ${c} + ${a}`, pr + a, null]
          : [`${pr + a} - ${b} \\cdot ${c}`, a, (pr + a - b) * c];
        const last = v === 2 ? `$${pr + a} - ${pr} = ${a}$` : `$${v ? `${pr} + ${a}` : `${a} + ${pr}`} = ${ans}$`;
        return {
          q: `חשבו: $${q}$`, type: 'number', answer: ans,
          hint: 'כפל וחילוק באים <b>לפני</b> חיבור וחיסור. מה הכפל בתרגיל?',
          steps: [`קודם הכפל: $${b} \\cdot ${c} = ${pr}$`, `ואז ${v === 2 ? 'החיסור' : 'החיבור'}: ${last}`,
            wrong === null ? `התשובה: $${ans}$.` : `התשובה: $${ans}$. (מי שמחשב משמאל לימין בלי לחשוב מקבל $${wrong}$ — וזו טעות.)`],
        };
      } },
      // סוגריים קודם
      { level: 1, gen() {
        const v = U.R(0, 2);
        let q, s, ans, first, then;
        if (v === 0) { const a = U.R(1, 6), b = U.R(1, 6), c = U.R(2, 5); s = a + b; ans = s * c; q = `(${a} + ${b}) \\cdot ${c}`; first = `${a} + ${b} = ${s}`; then = `${s} \\cdot ${c} = ${ans}`; }
        else if (v === 1) { const a = U.R(3, 10), b = U.R(1, a - 1), c = U.R(2, 5); s = a - b; ans = c * s; q = `${c} \\cdot (${a} - ${b})`; first = `${a} - ${b} = ${s}`; then = `${c} \\cdot ${s} = ${ans}`; }
        else { const c = U.R(2, 5), k = U.R(2, 5); s = c * k; const a = U.R(1, s - 1), b = s - a; ans = k; q = `(${a} + ${b}) \\div ${c}`; first = `${a} + ${b} = ${s}`; then = `${s} \\div ${c} = ${ans}`; }
        return {
          q: `חשבו: $${q}$`, type: 'number', answer: ans,
          hint: 'מה שבתוך הסוגריים מחשבים <b>ראשון</b>, עוד לפני כפל וחילוק.',
          steps: [`קודם הסוגריים: $${first}$`, `ואז: $${then}$`, `התשובה: $${ans}$.`],
        };
      } },
      // ערך של חזקה
      { level: 1, gen() {
        const [a, n] = U.pick([[2, 2], [2, 3], [2, 4], [2, 5], [3, 2], [3, 3], [4, 2], [4, 3], [5, 2], [5, 3], [6, 2], [7, 2], [10, 2], [10, 3], [1, 5]]);
        const run = []; for (let k = 1; k <= n; k++) run.push(a ** k);
        return {
          q: `חשבו: $${a}^{${n}}$`, type: 'number', answer: a ** n,
          hint: `$${a}^{${n}}$ פירושו: ${a} כפול עצמו ${n} פעמים. זה <b>לא</b> $${a} \\cdot ${n}$!`,
          steps: [`$${a}^{${n}} = ${rep(a, n)}$`, `כופלים בהדרגה: $${run.join(' \\to ')}$`, `התשובה: $${a ** n}$.`],
        };
      } },
      // חזקה = כפל חוזר
      { level: 1, gen() {
        let a, n; do { a = U.R(2, 5); n = U.R(2, 4); } while (a === n);
        if (Math.random() < 0.5) return {
          q: `איזה ביטוי שווה ל־$${a}^{${n}}$?`,
          ...mc(rep(a, n), [`${a} \\cdot ${n}`, rep(n, a), rep(a, n, '+')]),
          hint: 'המספר הגדול הוא מה שכופלים. המספר הקטן למעלה אומר כמה פעמים.',
          steps: [`בסיס $${a}$, ומעריך $${n}$: כופלים את $${a}$ בעצמו $${n}$ פעמים.`, `$${a}^{${n}} = ${rep(a, n)} = ${a ** n}$`],
        };
        return {
          q: `איך כותבים את $${rep(a, n)}$ בתור חזקה?`,
          ...mc(`${a}^{${n}}`, [`${n}^{${a}}`, `${a} \\cdot ${n}`, `${a}^{${n + 1}}`]),
          hint: `איזה מספר כופלים? וכמה פעמים הוא מופיע?`,
          steps: [`כופלים את $${a}$, והוא מופיע $${n}$ פעמים.`, `לכן זה $${a}^{${n}}$ (וזה שווה $${a ** n}$).`],
        };
      } },
      // מה עושים ראשון?
      { level: 1, gen() {
        const a = U.R(2, 9), b = U.R(2, 6), c = U.R(2, 6);
        const [e, right, wrong, why, val] = U.pick([
          [`${a} + ${b} \\cdot ${c}`, `${b} \\cdot ${c}`, `${a} + ${b}`, 'כפל בא לפני חיבור.', a + b * c],
          [`(${a} + ${b}) \\cdot ${c}`, `${a} + ${b}`, `${b} \\cdot ${c}`, 'מה שבתוך הסוגריים — קודם לכול.', (a + b) * c],
          [`${a} \\cdot (${b} + ${c})`, `${b} + ${c}`, `${a} \\cdot ${b}`, 'מה שבתוך הסוגריים — קודם לכול.', a * (b + c)],
          [`${a} + ${b}^2`, `${b}^2`, `${a} + ${b}`, 'חזקה באה לפני חיבור.', a + b * b],
          [`${a} \\cdot ${b}^2`, `${b}^2`, `${a} \\cdot ${b}`, 'חזקה באה לפני כפל.', a * b * b],
          [`${a + b + c} - ${b} + ${c}`, `${a + b + c} - ${b}`, `${b} + ${c}`, 'יש רק חיבור וחיסור — אז משמאל לימין.', a + 2 * c],
        ]);
        const choices = U.shuffle([right, wrong]).map(x => `$${x}$`);
        return {
          q: `בתרגיל $${e}$, איזה חישוב עושים <b>ראשון</b>?`, type: 'choice', choices, answer: choices.indexOf(`$${right}$`),
          hint: 'הסולם: סוגריים ← חזקות ← כפל וחילוק ← חיבור וחיסור. ובאותה דרגה — משמאל לימין.',
          steps: [why, `לכן קודם מחשבים $${right}$.`, `(התוצאה של כל התרגיל: $${val}$.)`],
        };
      } },
      // משמאל לימין
      { level: 2, gen() {
        const v = U.R(0, 2);
        let q, ans, s1, s2;
        if (v === 0) { const b = U.R(2, 6), c = U.R(2, 6), A = b + U.R(1, 8); ans = A - b + c; q = `${A} - ${b} + ${c}`; s1 = `${A} - ${b} = ${A - b}`; s2 = `${A - b} + ${c} = ${ans}`; }
        else if (v === 1) { const b = U.R(2, 5), c = U.R(2, 4), k = U.R(2, 6), A = b * k; ans = k * c; q = `${A} \\div ${b} \\cdot ${c}`; s1 = `${A} \\div ${b} = ${k}`; s2 = `${k} \\cdot ${c} = ${ans}`; }
        else { const b = U.R(2, 6), c = U.R(2, 6), A = b + c + U.R(1, 8); ans = A - b - c; q = `${A} - ${b} - ${c}`; s1 = `${A} - ${b} = ${A - b}`; s2 = `${A - b} - ${c} = ${ans}`; }
        return {
          q: `חשבו: $${q}$`, type: 'number', answer: ans,
          hint: 'כל הפעולות כאן מאותה דרגה. מחשבים לפי הסדר, <b>משמאל לימין</b> — לא מתחילים מהאמצע.',
          steps: [`משמאל לימין. קודם: $${s1}$`, `ואז: $${s2}$`, `התשובה: $${ans}$.`],
        };
      } },
      // חזקה של מספר שלילי מול מינוס לפני חזקה
      { level: 2, gen() {
        const v = U.R(0, 3);
        let q, ans, st;
        if (v === 0) { const a = U.R(2, 6); q = `(-${a})^2`; ans = a * a; st = [`המינוס בתוך הסוגריים, אז כופלים את כל $(-${a})$: $(-${a}) \\cdot (-${a})$`, `מינוס כפול מינוס = פלוס: $${ans}$`]; }
        else if (v === 1) { const a = U.R(2, 6); q = `-${a}^2`; ans = -a * a; st = [`אין סוגריים, אז החזקה שייכת רק ל־$${a}$: $${a}^2 = ${a * a}$`, `המינוס נשאר בחוץ: $-${a * a}$`]; }
        else if (v === 2) { const a = U.R(2, 3); q = `(-${a})^3`; ans = -(a ** 3); st = [`$(-${a})^3 = (-${a}) \\cdot (-${a}) \\cdot (-${a})$`, `שני מינוסים ראשונים נותנים פלוס: $${a * a} \\cdot (-${a})$`, `$= ${ans}$ (שלושה מינוסים ← שלילי)`]; }
        else { const n = U.R(2, 7); q = `(-1)^{${n}}`; ans = n % 2 ? -1 : 1; st = [`כופלים $-1$ בעצמו ${n} פעמים.`, `כל זוג מינוסים נותן פלוס. ${n} ${n % 2 ? 'אי־זוגי — נשאר מינוס אחד' : 'זוגי — כל המינוסים מתקזזים'}.`, `התשובה: $${ans}$`]; }
        return {
          q: `חשבו: $${q}$`, type: 'number', answer: ans,
          hint: 'בדקו: האם המינוס <b>בתוך</b> הסוגריים (ואז גם הוא בחזקה) או <b>מחוץ</b> לחזקה?',
          steps: st,
        };
      } },
      // חזקה לפני כפל וחיבור
      { level: 2, gen() {
        const v = U.R(0, 3);
        let q, ans, st;
        if (v === 0) { const a = U.R(1, 9), b = U.R(2, 5); q = `${a} + ${b}^2`; ans = a + b * b; st = [`קודם החזקה: $${b}^2 = ${b * b}$`, `ואז: $${a} + ${b * b} = ${ans}$`, `(לא $(${a} + ${b})^2$ — אין סוגריים!)`]; }
        else if (v === 1) { const c = U.R(2, 5), b = U.R(2, 4); q = `${c} \\cdot ${b}^2`; ans = c * b * b; st = [`קודם החזקה: $${b}^2 = ${b * b}$`, `ואז: $${c} \\cdot ${b * b} = ${ans}$`]; }
        else if (v === 2) { const b = U.R(3, 6), a = U.R(1, b * b - 1); q = `${b}^2 - ${a}`; ans = b * b - a; st = [`קודם החזקה: $${b}^2 = ${b * b}$`, `ואז: $${b * b} - ${a} = ${ans}$`]; }
        else { const a = U.R(1, 3), b = U.R(1, 3); q = `(${a} + ${b})^2`; ans = (a + b) ** 2; st = [`קודם הסוגריים: $${a} + ${b} = ${a + b}$`, `ואז החזקה: $${a + b}^2 = ${a + b} \\cdot ${a + b} = ${ans}$`, `(זה לא $${a}^2 + ${b}^2 = ${a * a + b * b}$!)`]; }
        return {
          q: `חשבו: $${q}$`, type: 'number', answer: ans,
          hint: 'חזקה באה לפני כפל, חילוק, חיבור וחיסור. רק סוגריים באים לפניה.',
          steps: st,
        };
      } },
      // תרגיל של כמה שלבים עם סוגריים
      { level: 2, gen() {
        const v = U.R(0, 2);
        let q, ans, st;
        if (v === 0) {
          const c = U.R(2, 4), k = U.R(2, 5), s = c * k, a = U.R(1, s - 1), b = s - a, d = U.R(1, 9); ans = k + d;
          q = `(${a} + ${b}) \\div ${c} + ${d}`; st = [`סוגריים: $${a} + ${b} = ${s}$`, `חילוק: $${s} \\div ${c} = ${k}$`, `חיבור: $${k} + ${d} = ${ans}$`];
        } else if (v === 1) {
          const a = U.R(2, 5), c = U.R(1, 4), b = c + U.R(1, 4), d = U.R(1, a * (b - c)); ans = a * (b - c) - d;
          q = `${a} \\cdot (${b} - ${c}) - ${d}`; st = [`סוגריים: $${b} - ${c} = ${b - c}$`, `כפל: $${a} \\cdot ${b - c} = ${a * (b - c)}$`, `חיסור: $${a * (b - c)} - ${d} = ${ans}$`];
        } else {
          const b = U.R(2, 4), d = U.R(1, 5), c = d + U.R(1, 4), a = U.R(1, 9); ans = a + b * (c - d);
          q = `${a} + ${b} \\cdot (${c} - ${d})`; st = [`סוגריים: $${c} - ${d} = ${c - d}$`, `כפל: $${b} \\cdot ${c - d} = ${b * (c - d)}$`, `חיבור: $${a} + ${b * (c - d)} = ${ans}$`];
        }
        return {
          q: `חשבו: $${q}$`, type: 'number', answer: ans,
          hint: 'סוגריים קודם. אחר כך כפל או חילוק. בסוף חיבור או חיסור.',
          steps: [...st, `התשובה: $${ans}$.`],
        };
      } },
      // אתגר: הכול ביחד
      { level: 3, gen() {
        const n = U.R(2, 4), b = U.R(1, 5), a = b + n, e = U.R(2, 3), d = e * U.R(1, 4), c = U.R(2, 5), ans = n * n + c * d / e;
        return {
          q: `חשבו: $(${a} - ${b})^2 + ${c} \\cdot ${d} \\div ${e}$`, type: 'number', answer: ans,
          hint: 'לפי הסולם: סוגריים, חזקה, כפל וחילוק (משמאל לימין), ובסוף חיבור.',
          steps: [`סוגריים: $${a} - ${b} = ${n}$`, `חזקה: $${n}^2 = ${n * n}$`, `כפל: $${c} \\cdot ${d} = ${c * d}$`, `חילוק: $${c * d} \\div ${e} = ${c * d / e}$`, `חיבור: $${n * n} + ${c * d / e} = ${ans}$`],
        };
      } },
      // אתגר: מינוסים וחזקות
      { level: 3, gen() {
        if (Math.random() < 0.5) {
          const a = U.R(2, 5), b = U.R(2, 5), ans = b * b - a * a;
          return {
            q: `חשבו: $-${a}^2 + (-${b})^2$`, type: 'number', answer: ans,
            hint: 'שתי חזקות שונות: באחת המינוס בחוץ, ובשנייה הוא בתוך הסוגריים.',
            steps: [`$-${a}^2 = -${a * a}$ (רק ה־${a} בריבוע)`, `$(-${b})^2 = ${b * b}$ (מינוס כפול מינוס)`, `$-${a * a} + ${b * b} = ${ans}$`],
          };
        }
        const a = U.R(2, 3), b = U.R(1, 9), ans = b + a ** 3;
        return {
          q: `חשבו: $${b} - (-${a})^3$`, type: 'number', answer: ans,
          hint: `קודם החזקה: מה זה $(-${a})^3$? שימו לב שאחר כך מחסירים מספר שלילי.`,
          steps: [`$(-${a})^3 = (-${a}) \\cdot (-${a}) \\cdot (-${a}) = -${a ** 3}$`, `$${b} - (-${a ** 3}) = ${b} + ${a ** 3}$ (מינוס מינוס = פלוס)`, `$= ${ans}$`],
        };
      } },
      // אתגר: איפה לשים סוגריים
      { level: 3, gen() {
        let a, b, c, d, opts;
        do {
          a = U.R(1, 6); b = U.R(2, 5); c = U.R(3, 8); d = U.R(1, c - 1);
          opts = [
            [`(${a} + ${b}) \\cdot ${c} - ${d}`, (a + b) * c - d],
            [`${a} + ${b} \\cdot (${c} - ${d})`, a + b * (c - d)],
            [`(${a} + ${b}) \\cdot (${c} - ${d})`, (a + b) * (c - d)],
            [`${a} + ${b} \\cdot ${c} - ${d}`, a + b * c - d],
          ];
        } while (new Set(opts.map(o => o[1])).size < 4);
        const k = U.R(0, 2), target = opts[k][1];
        const choices = U.shuffle(opts.slice(0, 3).map(o => `$${o[0]}$`));
        return {
          q: `בלי סוגריים: $${opts[3][0]} = ${opts[3][1]}$.<br>איפה צריך לשים סוגריים כדי שהתוצאה תהיה $${target}$?`,
          type: 'choice', choices, answer: choices.indexOf(`$${opts[k][0]}$`),
          hint: 'חשבו כל אפשרות לפי סדר הפעולות, ובדקו איזו נותנת את התוצאה המבוקשת.',
          steps: [...opts.slice(0, 3).map(o => `$${o[0]} = ${o[1]}$${o[1] === target ? ' ✔' : ''}`), `לכן התשובה: $${opts[k][0]}$.`],
        };
      } },
    ],

    summary: [
      'הסולם: <b>סוגריים</b> ← <b>חזקות</b> ← <b>כפל וחילוק</b> ← <b>חיבור וחיסור</b>.',
      'פעולות מאותה דרגה (כפל וחילוק, או חיבור וחיסור) — מחשבים <b>משמאל לימין</b>.',
      'חזקה היא כפל חוזר: $2^4 = 2 \\cdot 2 \\cdot 2 \\cdot 2 = 16$, ולא $2 \\cdot 4$.',
      '$(-3)^2 = 9$ (המינוס בתוך החזקה), אבל $-3^2 = -9$ (המינוס בחוץ).',
      'בסיס שלילי: מעריך זוגי ← תוצאה חיובית, מעריך אי־זוגי ← תוצאה שלילית.',
    ],
  });
})();
