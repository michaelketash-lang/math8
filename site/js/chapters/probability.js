/* יחידה: הסתברות (כרך ב׳, פרק 9) */
(() => {
const n2 = U.num;
const svgWrap = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="100%" style="direction:ltr;max-width:${w}px;display:block;margin:0 auto" dir="ltr">${inner}</svg>`;
const FR = '(כתבו כשבר, למשל 3/8)';
const BALLS = [['כתום', '#e8702a'], ['כחול', '#2f6fdb'], ['ירוק', '#1f9d55'], ['סגול', '#8b5cf6']];
const fr = (a, b) => U.frac(a, b);
/** אותה הסתברות בשני כתיבים: $\frac{2}{6} = \frac{1}{3}$ */
const frFull = (a, b) => (U.gcd(a, b) > 1 && a ? `\\frac{${a}}{${b}} = ${fr(a, b)}` : a === 0 ? '0' : a === b ? `\\frac{${a}}{${b}} = 1` : `\\frac{${a}}{${b}}`);

/** גלגל מזל: colors = מערך צבעים, אחד לכל גזרה שווה */
function spinner(colors, R = 90) {
  const n = colors.length, c = R + 10;
  let r = '';
  colors.forEach((col, i) => {
    const a0 = -Math.PI / 2 + i * 2 * Math.PI / n, a1 = a0 + 2 * Math.PI / n;
    const p = a => `${(c + R * Math.cos(a)).toFixed(2)} ${(c + R * Math.sin(a)).toFixed(2)}`;
    r += `<path d="M ${c} ${c} L ${p(a0)} A ${R} ${R} 0 0 1 ${p(a1)} Z" style="fill:${col};stroke:var(--panel);stroke-width:2"/>`;
  });
  r += `<circle cx="${c}" cy="${c}" r="7" style="fill:var(--ink)"/><path d="M ${c} ${c} L ${c + 12} ${c - R * 0.7}" style="stroke:var(--ink);stroke-width:4;stroke-linecap:round"/>`;
  return svgWrap(2 * c, 2 * c, r);
}

const STATEMENTS = [
  ['בזריקת קובייה רגילה יוצא 7.', 0, 'בקובייה יש רק 1 עד 6. אין 7.'],
  ['בזריקת קובייה יוצא מספר קטן מ־7.', 2, 'כל המספרים בקובייה (1 עד 6) קטנים מ־7. זה תמיד קורה.'],
  ['בזריקת קובייה יוצא 6.', 1, 'זה יכול לקרות, אבל לא תמיד.'],
  ['בהטלת מטבע יוצא "עץ".', 1, 'יש שתי אפשרויות, ו"עץ" היא אחת מהן.'],
  ['בהטלת מטבע יוצא "עץ" או "פלי".', 2, 'אלה כל האפשרויות, אז זה תמיד קורה.'],
  ['מוציאים כדור משקית שיש בה רק כדורים כחולים, והוא אדום.', 0, 'אין בשקית אף כדור אדום.'],
  ['מוציאים כדור משקית שיש בה רק כדורים כחולים, והוא כחול.', 2, 'כל הכדורים כחולים, אז תמיד יוצא כחול.'],
  ['מוציאים כדור משקית עם 3 כדורים כחולים ו־2 אדומים, והוא אדום.', 1, 'יש כדורים אדומים, אבל לא רק אדומים.'],
  ['שחקן שקולע 70% מהעונשין יקלע את הזריקה הבאה.', 1, 'הוא קולע הרבה, אבל לא תמיד.'],
  ['בזריקת קובייה יוצא מספר זוגי.', 1, 'יכול לצאת 2, 4 או 6 — אבל גם 1, 3 או 5.'],
  ['בזריקת קובייה יוצא 0.', 0, 'בקובייה אין 0.'],
  ['בזריקת שתי קוביות סכום המספרים הוא לפחות 2.', 2, 'הכי פחות שאפשר לקבל הוא 1 + 1 = 2.'],
  ['בזריקת שתי קוביות סכום המספרים הוא 13.', 0, 'הכי הרבה שאפשר לקבל הוא 6 + 6 = 12.'],
];
const KIND = ['בלתי אפשרי', 'אפשרי', 'ודאי'];

registerChapter('probability', {
  intro: `
    <div class="idea"><b>ניסוי ותוצאות</b>זריקת קובייה, הטלת מטבע, זריקת עונשין — אלה <b>ניסויים</b>. לפני הניסוי לא יודעים בדיוק מה ייצא.
      <br>התוצאות האפשריות בקובייה: 1, 2, 3, 4, 5, 6.</div>
    <div class="idea"><b>בלתי אפשרי · אפשרי · ודאי</b><b>בלתי אפשרי</b> — לא יכול לקרות (לקבל 7 בקובייה). ההסתברות $0$.
      <br><b>ודאי</b> — קורה תמיד (לקבל מספר קטן מ־7). ההסתברות $1$.
      <br><b>אפשרי</b> — יכול לקרות ויכול שלא. ההסתברות בין $0$ ל־$1$.</div>
    <div class="idea"><b>הסתברות כשבר</b>כשכל התוצאות שוות בסיכוי:
      <div class="formula">הסתברות = <span style="display:inline-flex;flex-direction:column;vertical-align:middle;text-align:center"><span style="border-bottom:2px solid currentColor;padding:0 6px">מספר התוצאות המתאימות</span><span>מספר כל התוצאות</span></span></div>
      הסיכוי לקבל מספר זוגי בקובייה: 3 תוצאות מתאימות (2, 4, 6) מתוך 6 ← $\\frac{3}{6} = \\frac{1}{2} = 50\\%$.</div>
    <div class="note"><b>"לא" קורה</b> — ההסתברות שמשהו <b>לא</b> יקרה = $1$ פחות ההסתברות שהוא יקרה. אם הסיכוי לקלוע הוא $\\frac{3}{4}$, הסיכוי להחטיא הוא $\\frac{1}{4}$.</div>
    <div class="idea"><b>הרבה ניסויים</b>אם מטילים מטבע 10 פעמים, אולי ייצא "עץ" 7 פעמים. אבל אחרי 1000 הטלות, "עץ" ייצא בערך בחצי מהפעמים. ככל שעושים יותר ניסויים, השכיחות היחסית מתקרבת להסתברות.</div>`,

  example: {
    question: 'בשקית יש 4 כדורים כתומים, 5 כחולים ו־1 ירוק. מוציאים כדור אחד בלי להסתכל. מה ההסתברות שיצא: א. כתום? ב. לא כתום? ג. סגול?',
    steps: [
      'סופרים את כל התוצאות האפשריות: $4 + 5 + 1 = 10$ כדורים. זה המכנה.',
      'סעיף א: כמה כדורים כתומים? 4. אז ההסתברות לכתום היא $\\frac{4}{10}$.',
      'מצמצמים: $\\frac{4}{10} = \\frac{2}{5}$. באחוזים: $40\\%$.',
      'סעיף ב: "לא כתום" = כחול או ירוק: $5 + 1 = 6$ כדורים ← $\\frac{6}{10} = \\frac{3}{5}$.',
      'בדיקה בדרך אחרת: $1 - \\frac{2}{5} = \\frac{3}{5}$ ✔.',
      'סעיף ג: אין בשקית כדורים סגולים. 0 תוצאות מתאימות ← $\\frac{0}{10} = 0$. זה מאורע <b>בלתי אפשרי</b>.',
    ],
  },

  tools: [
    {
      title: 'שקית הכדורים',
      desc: 'קבעו כמה כדורים מכל צבע יש בשקית. הכלי מחשב את ההסתברות לכל צבע ומראה אותה על "סרגל הסיכויים". אחר כך שלפו כדור וראו מה יוצא.',
      mount(el) {
        const cnt = [4, 5, 1, 0];
        el.insertAdjacentHTML('beforeend', `<div class="row" style="justify-content:center">${BALLS.map(([n, c], i) => `<span style="display:inline-flex;align-items:center;gap:4px;border:1px solid var(--line);border-radius:12px;padding:4px 8px"><span style="color:${c};font-size:1.3em">●</span>${n}
          <button class="btn ghost pm" data-i="${i}" data-d="1" aria-label="הוסף ${n}">+</button><button class="btn ghost pm" data-i="${i}" data-d="-1" aria-label="הורד ${n}">−</button></span>`).join('')}</div>
          <div class="pic"></div><div class="readout probs"></div>
          <div class="row" style="justify-content:center"><button class="btn draw">🤚 שלוף כדור</button></div><div class="readout res"></div>`);
        const pic = el.querySelector('.pic'), probs = el.querySelector('.probs'), res = el.querySelector('.res');
        let drawn = -1;
        const upd = () => {
          const tot = cnt.reduce((s, v) => s + v, 0);
          let r = `<path d="M 60 30 Q 40 30 35 70 L 30 170 Q 30 195 60 195 L 240 195 Q 270 195 270 170 L 265 70 Q 260 30 240 30 Z" style="fill:var(--warn-soft);stroke:var(--muted);stroke-width:2"/>`;
          let k = 0;
          cnt.forEach((c, i) => { for (let j = 0; j < c; j++, k++) { const x = 62 + (k % 8) * 25, y = 175 - Math.floor(k / 8) * 25; r += `<circle cx="${x}" cy="${y}" r="11" style="fill:${BALLS[i][1]};${k === drawn ? 'stroke:var(--ink);stroke-width:4' : ''}"/>`; } });
          // סרגל סיכויים
          const X = p => 300 + p * 180;
          r += `<line x1="${X(0)}" y1="110" x2="${X(1)}" y2="110" style="stroke:var(--ink);stroke-width:2"/>`;
          [[0, '0'], [0.5, '½'], [1, '1']].forEach(([p, t]) => r += `<line x1="${X(p)}" y1="104" x2="${X(p)}" y2="116" style="stroke:var(--ink)"/><text x="${X(p)}" y="132" text-anchor="middle" font-size="13" style="fill:var(--ink)">${t}</text>`);
          r += `<text x="${X(0)}" y="150" text-anchor="middle" font-size="11" style="fill:var(--muted)">בלתי אפשרי</text><text x="${X(1)}" y="150" text-anchor="middle" font-size="11" style="fill:var(--muted)">ודאי</text>`;
          cnt.forEach((c, i) => { if (tot) r += `<path d="M ${X(c / tot)} 104 l -7 -${14 + i * 12} h 14 Z" style="fill:${BALLS[i][1]};opacity:.9"/>`; });
          pic.innerHTML = svgWrap(500, 205, r);
          probs.innerHTML = tot ? BALLS.map(([n, col], i) => `<span style="color:${col}">●</span> ${n}: $${frFull(cnt[i], tot)}$ <span class="muted">(${cnt[i] === 0 ? 'בלתי אפשרי' : cnt[i] === tot ? 'ודאי' : n2(cnt[i] / tot * 100) + '%'})</span>`).join('<br>') : 'השקית ריקה. הוסיפו כדורים.';
          U.math(probs);
        };
        el.querySelectorAll('.pm').forEach(b => b.onclick = () => { const i = +b.dataset.i; cnt[i] = Math.max(0, Math.min(8, cnt[i] + +b.dataset.d)); drawn = -1; res.textContent = ''; upd(); });
        el.querySelector('.draw').onclick = () => {
          const tot = cnt.reduce((s, v) => s + v, 0); if (!tot) return;
          drawn = U.R(0, tot - 1);
          let i = 0, k = drawn; while (k >= cnt[i]) k -= cnt[i++];
          res.innerHTML = `יצא כדור <b style="color:${BALLS[i][1]}">${BALLS[i][0]}</b>! (הסיכוי היה $${fr(cnt[i], tot)}$)`; U.math(res); upd();
        };
        upd();
      },
    },
    {
      title: 'מכונת הניסויים',
      desc: 'בחרו ניסוי והריצו אותו הרבה פעמים. העמודות = כמה פעמים יצאה כל תוצאה (שכיחות יחסית). הקו המקווקו = ההסתברות. מה קורה אחרי 1000 ניסויים?',
      mount(el) {
        const EXP = {
          coin: { t: 'מטבע', out: ['עץ', 'פלי'], p: [1 / 2, 1 / 2] },
          die: { t: 'קובייה', out: ['1', '2', '3', '4', '5', '6'], p: Array(6).fill(1 / 6) },
          spin: { t: 'גלגל מזל', out: ['כתום', 'כחול', 'ירוק'], p: [1 / 2, 1 / 4, 1 / 4] },
          ft: { t: 'עונשין (70%)', out: ['קליעה', 'החטאה'], p: [0.7, 0.3] },
        };
        let key = 'coin', counts = [0, 0], last = null;
        el.insertAdjacentHTML('beforeend', `<div class="row" style="justify-content:center">${Object.entries(EXP).map(([k, e]) => `<button class="btn ghost ek" data-k="${k}">${e.t}</button>`).join('')}</div>
          <div class="row" style="justify-content:center">${[1, 10, 100, 1000].map(n => `<button class="btn run" data-n="${n}">× ${n}</button>`).join('')}<button class="btn ghost reset">↺ איפוס</button></div>
          <div class="pic"></div><div class="readout out"></div>`);
        const pic = el.querySelector('.pic'), out = el.querySelector('.out');
        const draw = () => {
          const e = EXP[key], tot = counts.reduce((s, v) => s + v, 0), H = 200, y0 = 170, ph = 150, n = e.out.length, cw = 440 / n;
          let r = '';
          [0, 0.25, 0.5, 0.75, 1].forEach(t => r += `<line x1="40" y1="${y0 - t * ph}" x2="490" y2="${y0 - t * ph}" style="stroke:var(--line)"/><text x="34" y="${y0 - t * ph + 4}" text-anchor="end" font-size="11" style="fill:var(--muted)">${t * 100}%</text>`);
          e.out.forEach((o, i) => {
            const f = tot ? counts[i] / tot : 0, x = 45 + i * cw + cw * 0.2, w = cw * 0.6;
            r += `<rect x="${x}" y="${y0 - f * ph}" width="${w}" height="${f * ph}" rx="3" style="fill:${i === last ? 'var(--accent)' : 'var(--blue)'}"/>`;
            r += `<line x1="${x - 6}" y1="${y0 - e.p[i] * ph}" x2="${x + w + 6}" y2="${y0 - e.p[i] * ph}" style="stroke:var(--ink);stroke-width:2.5;stroke-dasharray:6 4"/>`;
            r += `<text x="${x + w / 2}" y="${y0 + 18}" text-anchor="middle" font-size="13" style="fill:var(--ink)">${o}</text>`;
            if (tot) r += `<text x="${x + w / 2}" y="${y0 - Math.max(f, e.p[i]) * ph - 6}" text-anchor="middle" font-size="11" style="fill:var(--ink)">${n2(f * 100)}%</text>`;
          });
          pic.innerHTML = svgWrap(500, H, r);
          el.querySelectorAll('.ek').forEach(b => { b.style.borderColor = b.dataset.k === key ? 'var(--accent)' : ''; b.style.fontWeight = b.dataset.k === key ? 700 : 400; });
          out.innerHTML = tot ? `${last !== null ? `תוצאה אחרונה: <b>${e.out[last]}</b> · ` : ''}סך הכול <b>${tot}</b> ניסויים
            <br><span class="muted">${e.out.map((o, i) => `${o}: ${counts[i]}`).join(' · ')}</span>` : 'לחצו על אחד הכפתורים כדי להריץ ניסויים.';
        };
        el.querySelectorAll('.ek').forEach(b => b.onclick = () => { key = b.dataset.k; counts = EXP[key].out.map(() => 0); last = null; draw(); });
        el.querySelectorAll('.run').forEach(b => b.onclick = () => {
          const p = EXP[key].p;
          for (let k = 0; k < +b.dataset.n; k++) { let r = Math.random(), i = 0; while (i < p.length - 1 && r >= p[i]) r -= p[i++]; counts[i]++; last = i; }
          draw();
        });
        el.querySelector('.reset').onclick = () => { counts = counts.map(() => 0); last = null; draw(); };
        draw();
      },
    },
    {
      title: 'משחק: ודאי, אפשרי או בלתי אפשרי?',
      desc: 'קראו את המשפט ובחרו. 5 תשובות נכונות ברצף = סל!',
      mount(el) {
        let cur, streak = 0, order = U.shuffle(STATEMENTS), k = 0;
        el.insertAdjacentHTML('beforeend', `<div class="q st" style="text-align:center"></div><div class="row" style="justify-content:center">${KIND.map((t, i) => `<button class="btn ghost kk" data-i="${i}">${t}</button>`).join('')}</div><div class="readout fbk"></div>`);
        const st = el.querySelector('.st'), fbk = el.querySelector('.fbk');
        const nextQ = () => { if (k >= order.length) { order = U.shuffle(STATEMENTS); k = 0; } cur = order[k++]; st.textContent = cur[0]; el.querySelectorAll('.kk').forEach(b => b.disabled = false); };
        el.querySelectorAll('.kk').forEach(b => b.onclick = () => {
          const ok = +b.dataset.i === cur[1];
          streak = ok ? streak + 1 : 0;
          fbk.innerHTML = `${ok ? '✔ נכון!' : `✘ התשובה: <b>${KIND[cur[1]]}</b>.`} ${cur[2]} <br><span class="muted">רצף: ${streak}${streak >= 5 ? ' 🏀 סל!' : ''}</span> <button class="btn nx">הבא ←</button>`;
          el.querySelectorAll('.kk').forEach(x => x.disabled = true);
          fbk.querySelector('.nx').onclick = () => { fbk.textContent = ''; nextQ(); };
        });
        nextQ();
      },
    },
  ],

  exercises: [
    // ---------- רמה 1 ----------
    { level: 1, gen() {
      const [s, a, why] = U.pick(STATEMENTS);
      return {
        q: `המאורע: "${s}" הוא...`,
        type: 'choice', choices: KIND, answer: a,
        mistakes: ['"בלתי אפשרי" = לא קורה אף פעם. בדוק: האם יש אפילו תוצאה אחת שבה זה קורה?', '"אפשרי" = לפעמים קורה ולפעמים לא. בדוק: האם יש תוצאה שבה זה קורה, וגם תוצאה שבה זה <b>לא</b> קורה?', '"ודאי" = קורה תמיד. בדוק: האם יש תוצאה שבה זה לא קורה?'].map((why, v) => ({ v, why })),
        hint: 'האם זה יכול לקרות בכלל? אם כן — האם זה קורה <b>תמיד</b>?',
        steps: [why, `לכן: <b>${KIND[a]}</b>.`],
      };
    } },
    { level: 1, gen() {
      const a = U.R(2, 8), b = U.R(2, 8), [ca, cb] = U.shuffle(['כתומים', 'כחולים', 'ירוקים']).slice(0, 2);
      return {
        q: `בשקית יש ${a} כדורים ${ca} ו־${b} כדורים ${cb}. מוציאים כדור אחד בלי להסתכל. מה ההסתברות שיצא כדור מהצבע <b>${ca.slice(0, -2)}</b>? ${FR}`,
        type: 'number', answer: a / (a + b),
        mistakes: [{ v: a / b, why: `חילקת את ה${ca} ב${cb} ($\\frac{${a}}{${b}}$). בהסתברות מחלקים במספר <b>כל</b> הכדורים שבשקית.` }, { v: b / (a + b), why: `חישבת את ההסתברות לכדור מהצבע השני (${cb}).` }, { v: 0.5, why: 'יש שני צבעים, אבל לא אותו מספר כדורים מכל צבע — אז הסיכויים לא שווים. צריך לספור כדורים, לא צבעים.' }],
        hint: 'הסתברות = כמה כדורים מתאימים ÷ כמה כדורים יש בסך הכול.',
        steps: [`בסך הכול: $${a} + ${b} = ${a + b}$ כדורים.`, `מתאימים: $${a}$.`, `ההסתברות: $${frFull(a, a + b)}$`],
      };
    } },
    { level: 1, gen() {
      const ev = U.pick([
        ['יוצא 4', [4]], ['יוצא 1', [1]], ['יוצא מספר זוגי', [2, 4, 6]], ['יוצא מספר אי־זוגי', [1, 3, 5]],
        ['יוצא 1 או 2', [1, 2]], ['יוצא מספר קטן מ־7', [1, 2, 3, 4, 5, 6]], ['יוצא 8', []], ['יוצא 5 או 6', [5, 6]],
      ]);
      const k = ev[1].length;
      return {
        q: `זורקים קובייה רגילה (1 עד 6). מה ההסתברות ש${ev[0]}? ${FR}`,
        type: 'number', answer: k / 6,
        mistakes: [...(k === 1 && ev[1][0] > 1 ? [{ v: ev[1][0] / 6, why: `שמת במונה את המספר שעל הקובייה (${ev[1][0]}). במונה כותבים <b>כמה</b> תוצאות מתאימות.` }] : []), ...(k > 0 && k < 6 ? [{ v: k / (6 - k), why: 'חילקת את התוצאות המתאימות בתוצאות ש<b>לא</b> מתאימות. מחלקים במספר <b>כל</b> התוצאות.' }] : [])],
        hint: 'כמה תוצאות יש בקובייה? וכמה מהן מתאימות?',
        steps: [`כל התוצאות: 1, 2, 3, 4, 5, 6 ← 6 תוצאות.`, k ? `מתאימות: ${ev[1].join(', ')} ← ${k} תוצאות.` : 'אין אף תוצאה מתאימה (מאורע בלתי אפשרי).', `ההסתברות: $${frFull(k, 6)}$`],
      };
    } },
    { level: 1, gen() {
      const n = U.pick([4, 5, 6, 8]), k = U.R(1, n - 1), cols = U.shuffle([...Array(k).fill('#e8702a'), ...Array(n - k).fill('#2f6fdb')]);
      return {
        q: `לגלגל המזל יש ${n} חלקים שווים. מה ההסתברות שהמחוג יעצור על <b>כתום</b>? ${FR}`,
        type: 'number', answer: k / n,
        mount(el) { el.innerHTML = spinner(cols); },
        mistakes: [{ v: k / (n - k), why: 'חילקת את הכתומים בכחולים. מחלקים במספר <b>כל</b> החלקים בגלגל.' }, { v: (n - k) / n, why: 'חישבת את ההסתברות לכחול. שאלו על כתום.' }],
        hint: 'סופרים כמה חלקים יש בסך הכול, וכמה מהם כתומים.',
        steps: [`בסך הכול ${n} חלקים שווים.`, `${k} חלקים כתומים.`, `ההסתברות: $${frFull(k, n)}$`],
      };
    } },
    // ---------- רמה 2 ----------
    { level: 2, gen() {
      const c = [U.R(2, 7), U.R(2, 7), U.R(2, 7)], names = ['אדומים', 'צהובים', 'לבנים'], i = U.R(0, 2), tot = c[0] + c[1] + c[2];
      return {
        q: `בקופסה יש ${c[0]} כדורים ${names[0]}, ${c[1]} ${names[1]} ו־${c[2]} ${names[2]}. מה ההסתברות שהכדור שיוצא <b>לא</b> יהיה ${names[i].slice(0, -2)}? ${FR}`,
        type: 'number', answer: (tot - c[i]) / tot,
        mistakes: [{ v: c[i] / tot, why: `חישבת את ההסתברות שהכדור <b>כן</b> יהיה ${names[i].slice(0, -2)}. שאלו על "לא".` }, { v: (tot - c[i]) / c[i], why: `חילקת ב־${c[i]}. בהסתברות מחלקים במספר <b>כל</b> הכדורים שבקופסה.` }, { v: 2 / 3, why: 'יש שלושה צבעים, אבל לא אותו מספר כדורים מכל צבע. צריך לספור כדורים, לא צבעים.' }],
        hint: `"לא ${names[i].slice(0, -2)}" = כל השאר. או: 1 פחות ההסתברות שכן.`,
        steps: [`בסך הכול: $${c.join(' + ')} = ${tot}$`, `לא ${names[i].slice(0, -2)}: $${tot} - ${c[i]} = ${tot - c[i]}$ כדורים.`, `ההסתברות: $${frFull(tot - c[i], tot)}$`],
      };
    } },
    { level: 2, gen() {
      const ev = U.pick([
        ['מספר גדול מ־4', [5, 6]], ['מספר גדול מ־2', [3, 4, 5, 6]], ['מספר קטן מ־4', [1, 2, 3]], ['מספר שמתחלק ב־3', [3, 6]],
        ['מספר ראשוני', [2, 3, 5]], ['מספר שהוא לכל היותר 5', [1, 2, 3, 4, 5]], ['מספר זוגי שגדול מ־2', [4, 6]], ['לפחות 3', [3, 4, 5, 6]],
      ]);
      const SLIP = { 'מספר גדול מ־4': [3, '"גדול מ־4" לא כולל את 4 עצמו. בדוק שוב אילו תוצאות ספרת.'], 'מספר גדול מ־2': [5, '"גדול מ־2" לא כולל את 2 עצמו. בדוק שוב אילו תוצאות ספרת.'], 'מספר קטן מ־4': [4, '"קטן מ־4" לא כולל את 4 עצמו. בדוק שוב אילו תוצאות ספרת.'], 'מספר ראשוני': [4, 'נראה שספרת גם את 1. המספר 1 אינו ראשוני.'], 'מספר שהוא לכל היותר 5': [4, '"לכל היותר 5" כולל גם את 5 עצמו. בדוק שוב אילו תוצאות ספרת.'], 'מספר זוגי שגדול מ־2': [3, 'ספרת את כל הזוגיים. אבל צריך רק זוגיים ש<b>גדולים מ־2</b>.'], 'לפחות 3': [3, '"לפחות 3" כולל גם את 3 עצמו. בדוק שוב אילו תוצאות ספרת.'] }[ev[0]];
      const k = ev[1].length;
      return {
        q: `זורקים קובייה. מה ההסתברות לקבל ${ev[0]}? ${FR}`,
        type: 'number', answer: k / 6,
        mistakes: SLIP ? [{ v: SLIP[0] / 6, why: SLIP[1] }] : [],
        hint: 'כתבו את כל 6 התוצאות, וסמנו את אלה שמתאימות. שימו לב למילים כמו "גדול מ־" (לא כולל) ו"לפחות" (כולל).',
        steps: [`התוצאות: 1, 2, 3, 4, 5, 6.`, `מתאימות: ${ev[1].join(', ')} ← ${k} תוצאות.`, `ההסתברות: $${frFull(k, 6)}$`],
      };
    } },
    { level: 2, gen() {
      const [p, N] = U.pick([[80, 20], [80, 25], [70, 10], [70, 20], [75, 20], [75, 40], [60, 20], [60, 30], [50, 30], [90, 20], [40, 25], [35, 20]]);
      return {
        q: `ההסתברות שרוני יקלע זריקת עונשין היא $${p}\\%$. בערך כמה זריקות הוא יקלע מתוך ${N}?`,
        type: 'number', answer: p * N / 100,
        hint: `מחשבים $${p}\\%$ מ־${N}.`,
        steps: [`$${p}\\% = ${n2(p / 100)}$`, `$${n2(p / 100)} \\cdot ${N} = ${p * N / 100}$`, `בערך ${p * N / 100} קליעות (לא בטוח שבדיוק — זו הסתברות!).`],
      };
    } },
    { level: 2, gen() {
      const tot = U.pick([10, 20, 25, 50]), k = U.R(1, tot - 1);
      return {
        q: `בקופסה ${tot} פתקים, ועל ${k} מהם כתוב "פרס". מוציאים פתק אחד. מה ההסתברות לזכות בפרס, <b>באחוזים</b>?`,
        type: 'number', answer: k / tot * 100,
        mistakes: [{ v: k, why: `$${k}$ הוא מספר הפתקים, לא אחוז. אחוזים הם "מתוך 100", וכאן יש ${tot} פתקים.` }],
        hint: `ההסתברות היא $\\frac{${k}}{${tot}}$. הופכים לאחוזים: כופלים ב־100.`,
        steps: [`$P = \\frac{${k}}{${tot}}$`, `$\\frac{${k}}{${tot}} \\cdot 100 = ${n2(k / tot * 100)}\\%$`],
      };
    } },
    // ---------- רמה 3 ----------
    { level: 3, gen() {
      let d, nn; do { d = U.pick([2, 3, 4, 5, 6]); nn = U.R(1, d - 1); } while (U.gcd(nn, d) !== 1);
      const m = U.R(2, 5), tot = d * m;
            return {
        q: `בשקית ${tot} כדורים. ההסתברות להוציא כדור כתום היא $\\frac{${nn}}{${d}}$. כמה כדורים כתומים יש בשקית?`,
        type: 'number', answer: nn * tot / d,
        mistakes: [{ v: tot / d, why: `חילקת ב־${d} — זה נותן רק $\\frac{1}{${d}}$ מהכדורים. בדוק שוב את המונה של השבר.` }, { v: nn, why: `$${nn}$ הוא המונה של השבר, לא מספר הכדורים. השבר אומר איזה <b>חלק</b> מתוך ${tot} הכדורים כתום.` }],
        hint: `$\\frac{${nn}}{${d}}$ מ־${tot}: מחלקים ב־${d} וכופלים ב־${nn}.`,
        steps: [`מספר הכתומים $= \\frac{${nn}}{${d}} \\cdot ${tot}$`, `$${tot} \\div ${d} = ${m}$, ואז $${m} \\cdot ${nn} = ${nn * m}$`, `בדיקה: $\\frac{${nn * m}}{${tot}} = \\frac{${nn}}{${d}}$ ✔`],
      };
    } },
    { level: 3, gen() {
      const r = U.R(2, 6), b = r + U.R(1, 6), add = b - r;
      return {
        q: `בשקית ${r} כדורים אדומים ו־${b} כחולים. כמה כדורים <b>אדומים</b> צריך להוסיף כדי שההסתברות להוציא אדום תהיה $\\frac{1}{2}$?`,
        type: 'number', answer: add,
        mistakes: [{ v: b, why: `שים לב: בשקית כבר יש ${r} אדומים. שאלו כמה צריך <b>להוסיף</b>, לא כמה צריך שיהיו בסוף.` }, { v: add / 2, why: 'חישבת חצי מהכדורים שיש עכשיו. אבל כשמוסיפים אדומים, גם מספר הכדורים הכולל גדל!' }],
        hint: 'הסתברות $\\frac{1}{2}$ אומרת שיש בדיוק אותו מספר אדומים וכחולים.',
        steps: [`כדי שההסתברות תהיה $\\frac{1}{2}$, האדומים צריכים להיות חצי מכל הכדורים — כלומר כמו הכחולים: ${b}.`, `חסרים: $${b} - ${r} = ${add}$ אדומים.`, `בדיקה: $\\frac{${b}}{${2 * b}} = \\frac{1}{2}$ ✔`],
      };
    } },
    { level: 3, gen() {
      const ev = U.pick([
        ['בשני המטבעות יוצא "עץ"', 1, 'עץ-עץ'], ['בשני המטבעות יוצאת אותה תוצאה', 2, 'עץ-עץ, פלי-פלי'],
        ['יוצא "עץ" אחד ו"פלי" אחד', 2, 'עץ-פלי, פלי-עץ'], ['יוצא לפחות "עץ" אחד', 3, 'עץ-עץ, עץ-פלי, פלי-עץ'], ['לא יוצא אף "עץ"', 1, 'פלי-פלי'],
      ]);
      return {
        q: `מטילים שני מטבעות. מה ההסתברות ש${ev[0]}? ${FR}`,
        type: 'number', answer: ev[1] / 4,
        mistakes: [{ v: new Set(ev[2].split(', ').map(t => t.split('-').sort().join())).size / 3, why: 'ספרת רק 3 תוצאות אפשריות. אבל עץ-פלי ופלי-עץ הן שתי תוצאות <b>שונות</b> (מטבע ראשון ומטבע שני).' }],
        hint: 'כתבו את כל האפשרויות: עץ-עץ, עץ-פלי, פלי-עץ, פלי-פלי. (עץ-פלי ופלי-עץ הן שתי אפשרויות שונות!)',
        steps: ['כל התוצאות: עץ-עץ, עץ-פלי, פלי-עץ, פלי-פלי ← 4 תוצאות.', `מתאימות: ${ev[2]} ← ${ev[1]}.`, `ההסתברות: $${frFull(ev[1], 4)}$`],
      };
    } },
  ],

  summary: [
    'בלתי אפשרי ← הסתברות $0$. ודאי ← הסתברות $1$. אפשרי ← בין $0$ ל־$1$.',
    'הסתברות = מספר התוצאות המתאימות ÷ מספר כל התוצאות (כשכולן שוות בסיכוי).',
    'אפשר לכתוב הסתברות כשבר, כמספר עשרוני או באחוזים: $\\frac{1}{4} = 0.25 = 25\\%$.',
    'ההסתברות ש"לא" יקרה = $1$ פחות ההסתברות שיקרה.',
    'ככל שעושים יותר ניסויים, השכיחות היחסית מתקרבת להסתברות.',
  ],
});
})();
