/* יחידת חימום: שברים ומספרים עשרוניים — שברים שווים, צמצום, שבר↔עשרוני, חיבור וחיסור, כפל וחילוק, שבר מכמות (חזרה מכיתה ו׳) */
(() => {
  const fr = (n, d) => `\\frac{${n}}{${d}}`;
  const lcm = (a, b) => a * b / U.gcd(a, b);
  const svg = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="100%" style="direction:ltr;max-width:${w}px;display:block;margin:0 auto" dir="ltr">${inner}</svg>`;
  /** "= 3/4" אם אפשר לצמצם, אחרת ריק */
  const red = (n, d) => (U.gcd(n, d) > 1 ? ` = ${U.frac(n, d)}` : '');
  /** בחירה: נכונה + 3 מסיחים בעלי ערך שונה (לפי val) */
  function choose(right, cands, val) {
    const seen = new Set([val(right)]), out = [];
    for (const c of cands) { const v = val(c); if (out.length < 3 && !seen.has(v)) { seen.add(v); out.push(c); } }
    const choices = U.shuffle([right, ...out]);
    return { choices, answer: choices.indexOf(right) };
  }
  /** מוסיף mistakes לשאלת בחירה: [[אפשרות, הסבר], ...] — רק לאפשרויות שבאמת מוצגות */
  const whys = (r, list) => ({ ...r, mistakes: list.filter(([, w]) => w).map(([c, why]) => ({ v: r.choices.indexOf(c), why })).filter(m => m.v >= 0) });
  /** מגביל סליידר למקסימום חדש (ומעדכן את הערך אם צריך) */
  function cap(inp, max) {
    const old = +inp.value;
    inp.max = max; // הדפדפן מקטין את הערך לבד, אז משווים לערך הקודם
    if (old > max) { inp.value = max; inp.dispatchEvent(new Event('input')); }
  }
  /** פס מחולק ל־parts חלקים, filled צבועים */
  function bar(x, y, w, h, parts, filled, color = 'var(--accent)') {
    let r = '';
    for (let i = 0; i < parts; i++) r += `<rect x="${x + i * w / parts}" y="${y}" width="${w / parts}" height="${h}" style="fill:${i < filled ? color : 'var(--panel)'};stroke:var(--ink);stroke-width:1.5"/>`;
    return r;
  }

  registerChapter('w-fractions', {
    intro: `
      <div class="idea"><b>מה זה שבר?</b>חותכים פיצה ל־8 משולשים <b>שווים</b> ולוקחים 3. לקחנו $\\frac{3}{8}$ מהפיצה.
        <br><b>המכנה</b> (למטה, 8) — לכמה חלקים חתכנו. <b>המונה</b> (למעלה, 3) — כמה חלקים לקחנו.</div>
      <div class="idea"><b>שברים שווים וצמצום</b>אם כופלים (או מחלקים) את המונה <b>ואת</b> המכנה באותו מספר — השבר לא משתנה:
        <br>$\\frac{1}{2} = \\frac{2}{4} = \\frac{4}{8}$ &nbsp;(כפול 2) &nbsp;·&nbsp; $\\frac{6}{8} = \\frac{3}{4}$ &nbsp;(צמצום: חלקי 2)</div>
      <div class="idea"><b>שבר ↔ מספר עשרוני</b>מנסים להגיע למכנה 10 או 100:
        <br>$\\frac{7}{10} = 0.7$ &nbsp;·&nbsp; $\\frac{1}{2} = \\frac{5}{10} = 0.5$ &nbsp;·&nbsp; $\\frac{1}{4} = \\frac{25}{100} = 0.25$ &nbsp;·&nbsp; $\\frac{3}{4} = 0.75$ &nbsp;·&nbsp; $\\frac{1}{5} = 0.2$</div>
      <div class="idea"><b>חיבור וחיסור</b>מכנה <b>שווה</b> ← מחברים רק את המונים, המכנה נשאר: $\\frac{2}{8} + \\frac{3}{8} = \\frac{5}{8}$.
        <br>מכנה <b>שונה</b> ← קודם מביאים למכנה משותף: $\\frac{1}{2} + \\frac{1}{4} = \\frac{2}{4} + \\frac{1}{4} = \\frac{3}{4}$.
        <br>⚠️ <b>לא</b> מחברים מכנים! $\\frac{2}{8} + \\frac{3}{8}$ זה לא $\\frac{5}{16}$.</div>
      <div class="idea"><b>כפל וחילוק</b>כפל: מונה כפול מונה, מכנה כפול מכנה: $\\frac{2}{3} \\cdot \\frac{3}{5} = \\frac{6}{15} = \\frac{2}{5}$.
        <br>חילוק: הופכים את השבר השני וכופלים: $\\frac{3}{4} \\div \\frac{1}{2} = \\frac{3}{4} \\cdot \\frac{2}{1} = \\frac{6}{4} = 1.5$.</div>
      <div class="note"><b>שבר מכמות</b><br>$\\frac{3}{4}$ מתוך 20 זריקות: מחלקים ל־4 קבוצות ($20 \\div 4 = 5$), ולוקחים 3 קבוצות ($5 \\cdot 3 = 15$).</div>`,

    example: {
      question: 'אימון כדורסל נמשך שעה. $\\frac{1}{2}$ מהשעה התאמנו על זריקות לסל, ו־$\\frac{1}{3}$ מהשעה על כדרור. איזה חלק מהשעה הם התאמנו על שני הדברים יחד? וכמה דקות זה?',
      steps: [
        'צריך לחשב $\\frac{1}{2} + \\frac{1}{3}$. המכנים שונים (2 ו־3), אז אי אפשר לחבר מיד.',
        'מחפשים מכנה משותף: המספר הקטן ששני המכנים נכנסים בו. 2 ו־3 נכנסים שניהם ב־<b>6</b>.',
        'מרחיבים: $\\frac{1}{2} = \\frac{3}{6}$ (כפול 3 למעלה ולמטה), ו־$\\frac{1}{3} = \\frac{2}{6}$ (כפול 2).',
        'עכשיו המכנים שווים: $\\frac{3}{6} + \\frac{2}{6} = \\frac{5}{6}$. מחברים רק את המונים!',
        'כמה דקות זה? $\\frac{5}{6}$ מתוך 60 דקות: $60 \\div 6 = 10$ דקות לכל שישית.',
        'לוקחים 5 שישיות: $10 \\cdot 5 = 50$ דקות.',
        'בדיקה: חצי שעה = 30 דקות, שליש שעה = 20 דקות, ו־$30 + 20 = 50$ ✔.',
      ],
    },

    tools: [
      {
        title: 'פיצה ופס',
        desc: 'בחרו לכמה חלקים חותכים (המכנה) וכמה לוקחים (המונה). אחר כך "חתכו כל משולש" לעוד חתיכות: המספרים משתנים, אבל כמות הפיצה נשארת אותו דבר — אלה שברים שווים.',
        mount(el) {
          const st = { d: 4, n: 3, k: 1 };
          const pic = document.createElement('div'), out = document.createElement('div');
          out.className = 'readout'; el.append(pic, out);
          const upd = () => {
            const { d, n, k } = st, N = d * k, cx = 110, cy = 110, R = 95;
            let s = '';
            if (N === 1) s += `<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:${n ? 'var(--accent)' : 'var(--panel)'};stroke:var(--ink);stroke-width:2"/>`;
            else for (let i = 0; i < N; i++) {
              const a0 = -Math.PI / 2 + i * 2 * Math.PI / N, a1 = a0 + 2 * Math.PI / N, big = i % k === 0;
              const P = a => `${(cx + R * Math.cos(a)).toFixed(1)} ${(cy + R * Math.sin(a)).toFixed(1)}`;
              s += `<path d="M ${cx} ${cy} L ${P(a0)} A ${R} ${R} 0 0 1 ${P(a1)} Z" style="fill:${i < n * k ? 'var(--accent)' : 'var(--panel)'};stroke:var(--ink);stroke-width:${big ? 2.5 : 0.8}"/>`;
            }
            s += bar(240, 85, 320, 50, N, n * k);
            for (let i = 0; i <= d; i++) s += `<line x1="${240 + i * 320 / d}" y1="80" x2="${240 + i * 320 / d}" y2="140" style="stroke:var(--ink);stroke-width:3"/>`;
            pic.innerHTML = svg(580, 220, s);
            const dec = Math.round(n / d * 1000) / 1000, exact = Math.abs(dec - n / d) < 1e-9;
            out.innerHTML = `$${fr(n, d)}${k > 1 ? ` = ${fr(n * k, N)}` : ''}${red(n, d)}$ &nbsp;·&nbsp; כמספר עשרוני: $${exact ? '' : '\\approx '}${U.num(n / d)}$
              <br><span class="muted">${k > 1 ? `כל חלק נחתך ל־${k}: גם המונה וגם המכנה נכפלו ב־${k}. ` : ''}${U.gcd(n, d) > 1 && n ? `אפשר לצמצם: מחלקים מונה ומכנה ב־${U.gcd(n, d)}.` : ''}</span>`;
            U.math(out);
          };
          let nIn;
          U.slider(el, { label: 'מכנה: לכמה חלקים חותכים', min: 1, max: 12, value: st.d, onInput: v => { st.d = v; cap(nIn, v); st.n = Math.min(st.n, v); upd(); } });
          nIn = U.slider(el, { label: 'מונה: כמה חלקים לוקחים', min: 0, max: st.d, value: st.n, onInput: v => { st.n = v; upd(); } });
          U.slider(el, { label: 'חותכים כל חלק ל־', min: 1, max: 4, value: st.k, onInput: v => { st.k = v; upd(); } });
        },
      },
      {
        title: 'מכנה משותף',
        desc: 'רוצים לחבר שני שברים עם מכנים שונים? החתיכות בגדלים שונים, אז אי אפשר לספור אותן יחד. לחצו "חותכים למכנה משותף" — ועכשיו כל החתיכות באותו גודל.',
        mount(el) {
          const st = { a: 1, b: 2, c: 1, d: 3, cut: false };
          el.insertAdjacentHTML('beforeend', '<div class="row" style="justify-content:center"><button class="btn cut">חותכים למכנה משותף ✂</button></div>');
          const pic = document.createElement('div'), out = document.createElement('div');
          out.className = 'readout'; el.append(pic, out);
          const btn = el.querySelector('.cut');
          const upd = () => {
            const { a, b, c, d, cut } = st, L = lcm(b, d), A = a * L / b, C = c * L / d, W = 400, x0 = 20;
            btn.textContent = cut ? 'חזרה לחתיכות המקוריות' : 'חותכים למכנה משותף ✂';
            let s = bar(x0, 10, W, 34, cut ? L : b, cut ? A : a) + bar(x0, 60, W, 34, cut ? L : d, cut ? C : c, 'var(--blue)');
            s += `<text x="${x0 + W + 12}" y="33" font-size="15" style="fill:var(--ink)">${cut ? `${A}/${L}` : `${a}/${b}`}</text><text x="${x0 + W + 12}" y="83" font-size="15" style="fill:var(--ink)">${cut ? `${C}/${L}` : `${c}/${d}`}</text>`;
            if (cut) { // פס התוצאה: החתיכות הכתומות ואחריהן הכחולות
              const S = A + C, wholes = Math.ceil(S / L), w = W / L;
              for (let j = 0; j < wholes; j++) for (let i = 0; i < L; i++) {
                const k = j * L + i, col = k < A ? 'var(--accent)' : k < S ? 'var(--blue)' : 'var(--panel)';
                s += `<rect x="${x0 + i * w}" y="${120 + j * 44}" width="${w}" height="34" style="fill:${col};stroke:var(--ink);stroke-width:1.5"/>`;
              }
              s += `<text x="${x0 + W + 12}" y="143" font-size="15" style="fill:var(--ink);font-weight:700">= ${S}/${L}</text>`;
            }
            pic.innerHTML = svg(500, cut ? 220 : 104, s);
            out.innerHTML = cut
              ? `מכנה משותף: $${L}$. &nbsp; $${fr(a, b)} = ${fr(A, L)}$, &nbsp; $${fr(c, d)} = ${fr(C, L)}$
                 <br>$${fr(a, b)} + ${fr(c, d)} = ${fr(A, L)} + ${fr(C, L)} = ${fr(A + C, L)}${red(A + C, L)}$`
              : `$${fr(a, b)} + ${fr(c, d)} = \\;?$ <span class="muted">החתיכות בגדלים שונים — עוד אי אפשר לחבר.</span>`;
            U.math(out);
          };
          btn.onclick = () => { st.cut = !st.cut; upd(); };
          const ins = {};
          const sl = (label, key, min, max, num) => { ins[key] = U.slider(el, { label, min, max, value: st[key], onInput: v => {
            st[key] = v; if (num) { cap(ins[num], v); st[num] = Math.min(st[num], v); } upd();
          } }); };
          sl('מונה של השבר הכתום', 'a', 1, 2); sl('מכנה של השבר הכתום', 'b', 2, 6, 'a');
          sl('מונה של השבר הכחול', 'c', 1, 3); sl('מכנה של השבר הכחול', 'd', 2, 6, 'c');
        },
      },
      {
        title: 'שבר מתוך כמות',
        desc: 'כמה זה 3/4 מתוך 20 כדורים? מחלקים את הכדורים לקבוצות שוות לפי המכנה, וצובעים קבוצות לפי המונה.',
        mount(el) {
          const st = { d: 4, n: 3, m: 5 };
          const pic = document.createElement('div'), out = document.createElement('div');
          out.className = 'readout'; el.append(pic, out);
          const upd = () => {
            const { d, m, n } = st, N = d * m;
            let s = '';
            for (let g = 0; g < d; g++) {
              s += `<rect x="10" y="${8 + g * 40}" width="${m * 34 + 12}" height="34" rx="8" style="fill:none;stroke:var(--muted);stroke-dasharray:4 3"/>`;
              for (let i = 0; i < m; i++) s += `<circle cx="${33 + i * 34}" cy="${25 + g * 40}" r="13" style="fill:${g < n ? 'var(--accent)' : 'var(--line)'}"/>`;
            }
            pic.innerHTML = svg(m * 34 + 30, d * 40 + 12, s);
            out.innerHTML = `$${fr(n, d)}$ מתוך $${N}$ &nbsp;←&nbsp; $${N} \\div ${d} = ${m}$ בכל קבוצה &nbsp;←&nbsp; $${m} \\cdot ${n} = ${m * n}$ כדורים`;
            U.math(out);
          };
          let nIn;
          U.slider(el, { label: 'מכנה (מספר קבוצות)', min: 2, max: 6, value: st.d, onInput: v => { st.d = v; cap(nIn, v); st.n = Math.min(st.n, v); upd(); } });
          nIn = U.slider(el, { label: 'מונה (קבוצות צבועות)', min: 1, max: 4, value: st.n, onInput: v => { st.n = v; upd(); } });
          U.slider(el, { label: 'כדורים בכל קבוצה', min: 1, max: 8, value: st.m, onInput: v => { st.m = v; upd(); } });
        },
      },
    ],

    exercises: [
      // ---------- רמה 1 ----------
      { level: 1, gen() { // הרחבה: שבר שווה
        const b = U.R(2, 6), a = U.R(1, b - 1), k = U.R(2, 5);
        return {
          q: `השלימו את המונה החסר כך שהשברים יהיו שווים: $${fr(a, b)} = ${fr('\\square', b * k)}$`,
          type: 'number', answer: a * k,
          mistakes: [
            { v: a + b * k - b, why: 'הוספת למונה את ההפרש בין המכנים. בהרחבה כופלים את המונה ואת המכנה באותו מספר, לא מחברים.' },
            { v: a, why: `השארת את המונה $${a}$. אבל המכנה גדל — אם משנים רק אותו, השבר כבר לא שווה.` },
            { v: k, why: `${k} הוא המספר שבו כפלו את המכנה. מה צריך לעשות איתו למונה?` },
          ],
          hint: `בכמה כפלו את המכנה $${b}$ כדי לקבל $${b * k}$? את המונה כופלים באותו מספר.`,
          steps: [`המכנה: $${b} \\cdot ${k} = ${b * k}$. כלומר כפלו ב־${k}.`, `כופלים גם את המונה ב־${k}: $${a} \\cdot ${k} = ${a * k}$.`, `$${fr(a, b)} = ${fr(a * k, b * k)}$.`],
        };
      } },
      { level: 1, gen() { // צמצום עד הסוף
        let a, b; do { b = U.R(2, 9); a = U.R(1, b - 1); } while (U.gcd(a, b) > 1);
        const k = U.pick([2, 2, 3, 4, 5]), A = a * k, B = b * k, right = `$${fr(a, b)}$`;
        const cands = [k === 4 ? [2 * a, 2 * b] : [a + 1, b + 1], [a, B], [A, b], [a + 1, b]].map(([n, d]) => `$${fr(n, d)}$`);
        const val = s => { const [, n, d] = s.match(/\{(\d+)\}\{(\d+)\}/); return k === 4 && s === cands[0] ? 'partial' : +n / +d; };
        return {
          q: `צמצמו את השבר $${fr(A, B)}$ עד הסוף (עד שאי אפשר לצמצם יותר). מה מקבלים?`,
          type: 'choice', ...whys(choose(right, cands, val), [
            [cands[0], k === 4 ? 'צמצמת נכון, אבל לא עד הסוף: אפשר לצמצם עוד פעם.' : ''],
            [cands[1], 'חילקת רק את המונה. בצמצום מחלקים את המונה ואת המכנה באותו מספר.'],
            [cands[2], 'חילקת רק את המכנה. בצמצום מחלקים את המונה ואת המכנה באותו מספר.'],
          ]),
          hint: `מחפשים מספר שגם $${A}$ וגם $${B}$ מתחלקים בו, ומחלקים את שניהם. ממשיכים עד שאין מספר כזה.`,
          steps: [`גם $${A}$ וגם $${B}$ מתחלקים ב־${k}.`, `$${A} \\div ${k} = ${a}$ ו־$${B} \\div ${k} = ${b}$.`, `$${fr(A, B)} = ${fr(a, b)}$, ואת $${fr(a, b)}$ כבר אי אפשר לצמצם.`],
        };
      } },
      { level: 1, gen() { // שבר → עשרוני
        const [a, b] = U.pick([[1, 2], [1, 4], [3, 4], [1, 5], [2, 5], [3, 5], [4, 5], [1, 10], [3, 10], [7, 10], [9, 10]]);
        const v = a / b, f = x => `$${+x.toFixed(3)}$`;
        const cands = [`0.${a}${b}`, `${a}.${b}`, `0.${a}`, `${b}.${a}`, `0.0${a}`].map(Number);
        const k = 10 / b, k2 = 100 / b;
        return {
          q: `איזה מספר עשרוני שווה לשבר $${fr(a, b)}$?`,
          type: 'choice', ...whys(choose(f(v), cands.map(f), s => s), [
            ...[0, 1, 3].map(i => [f(cands[i]), `רק כתבת את ${a} ואת ${b} ליד נקודה עשרונית. שבר הוא חילוק: $${a} \\div ${b}$.`]),
            [f(cands[2]), `$0.${a}$ זה ${a} עשיריות. אבל כאן המכנה הוא ${b}, לא 10.`],
          ]),
          hint: 'מנסים להפוך את המכנה ל־10 או ל־100 (כופלים מונה ומכנה באותו מספר). או: מחלקים את המונה במכנה.',
          steps: Number.isInteger(k)
            ? [`כופלים מונה ומכנה ב־${k}: $${fr(a, b)} = ${fr(a * k, 10)}$.`, `$${a * k}$ עשיריות $= ${v}$.`]
            : [`כופלים מונה ומכנה ב־${k2}: $${fr(a, b)} = ${fr(a * k2, 100)}$.`, `$${a * k2}$ מאיות $= ${v}$.`],
        };
      } },
      { level: 1, gen() { // חיבור/חיסור במכנה שווה
        const d = U.R(3, 12), plus = Math.random() < 0.6;
        let a, b; do { a = U.R(1, d - 1); b = U.R(1, d - 1); } while (plus ? a + b > d : a <= b);
        const r = plus ? a + b : a - b, op = plus ? '+' : '-';
        return {
          q: `חשבו: $${fr(a, d)} ${op} ${fr(b, d)}$ <span class="muted">(אפשר לכתוב את התשובה כשבר, למשל 3/4)</span>`,
          type: 'number', answer: r / d,
          mistakes: plus ? [{ v: r / (2 * d), why: `חיברת גם את המכנים: $${d} + ${d}$. המכנה רק אומר לכמה חלקים חילקו את השלם, והוא לא משתנה בחיבור.` }] : [],
          hint: `המכנה שווה (${d}), אז הוא <b>נשאר</b>. ${plus ? 'מחברים' : 'מחסירים'} רק את המונים.`,
          steps: [`המכנה זהה: $${d}$. הוא נשאר כמו שהוא.`, `המונים: $${a} ${op} ${b} = ${r}$.`, `$${fr(a, d)} ${op} ${fr(b, d)} = ${fr(r, d)}${red(r, d)}$.`],
        };
      } },
      { level: 1, gen() { // שבר יחידה מכמות
        const d = U.pick([2, 3, 4, 5, 10]), m = U.R(2, 8), N = d * m;
        return {
          q: `בסל יש ${N} כדורים. $${fr(1, d)}$ מהכדורים כתומים. כמה כדורים כתומים?`,
          type: 'number', answer: m,
          hint: `$${fr(1, d)}$ מתוך ${N} = מחלקים את ${N} ל־${d} חלקים שווים.`,
          steps: [`$${fr(1, d)}$ אומר: מחלקים ל־${d} חלקים שווים ולוקחים חלק אחד.`, `$${N} \\div ${d} = ${m}$.`, `יש ${m} כדורים כתומים.`],
        };
      } },

      // ---------- רמה 2 ----------
      { level: 2, gen() { // עשרוני → שבר
        const [n, d, txt] = U.pick([[1, 2, '0.5'], [1, 4, '0.25'], [3, 4, '0.75'], [1, 5, '0.2'], [2, 5, '0.4'], [3, 5, '0.6'], [4, 5, '0.8'], [3, 10, '0.3'], [7, 10, '0.7'], [9, 10, '0.9']]);
        const digits = txt.slice(2), right = `$${fr(n, d)}$`;
        const cands = [[1, +digits], [+digits, 10], [n + 1, d], [n, d + 1], [+digits, 1000]].map(([a, b]) => `$${fr(a, b)}$`);
        const val = s => { const [, a, b] = s.match(/\{(\d+)\}\{(\d+)\}/); return +(+a / +b).toFixed(6); };
        const places = digits.length, den = places === 1 ? 10 : 100;
        return {
          q: `איזה שבר שווה למספר העשרוני $${txt}$?`,
          type: 'choice', ...whys(choose(right, cands, val), [
            [cands[0], `$${fr(1, +digits)}$ פירושו 1 חלקי ${+digits}. הספרות שאחרי הנקודה לא הולכות למכנה.`],
            ...[1, 4].map(i => [cands[i], 'ספור את הספרות שאחרי הנקודה: ספרה אחת = עשיריות, שתי ספרות = מאיות.']),
          ]),
          hint: `ספרה אחת אחרי הנקודה = עשיריות, שתי ספרות = מאיות. כותבים שבר עם מכנה ${den} ומצמצמים.`,
          steps: [`$${txt}$ = ${+digits} ${places === 1 ? 'עשיריות' : 'מאיות'} ← $${fr(+digits, den)}$.`, U.gcd(+digits, den) > 1 ? `מצמצמים (מחלקים מונה ומכנה ב־${U.gcd(+digits, den)}): $${fr(+digits, den)} = ${fr(n, d)}$.` : `אי אפשר לצמצם, אז התשובה היא $${fr(n, d)}$.`],
        };
      } },
      { level: 2, gen() { // חיבור/חיסור במכנה שונה
        const [b, d] = U.pick([[2, 4], [3, 6], [2, 6], [4, 8], [2, 8], [2, 3], [3, 4], [2, 5], [4, 12], [3, 9], [5, 10]]);
        const plus = Math.random() < 0.6, L = lcm(b, d);
        let a, c; do { a = U.R(1, b - 1); c = U.R(1, d - 1); } while (!plus && a * L / b <= c * L / d);
        const A = a * L / b, C = c * L / d, r = plus ? A + C : A - C, op = plus ? '+' : '-';
        return {
          q: `חשבו: $${fr(a, b)} ${op} ${fr(c, d)}$ <span class="muted">(אפשר לכתוב את התשובה כשבר, למשל 3/4)</span>`,
          type: 'number', answer: r / L,
          mistakes: [
            ...(plus ? [{ v: (a + c) / (b + d), why: 'חיברת מונה עם מונה ומכנה עם מכנה. כשהמכנים שונים, קודם מביאים למכנה משותף.' }] : []),
            { v: (plus ? a + c : a - c) / L, why: `מצאת מכנה משותף $${L}$, אבל המונים נשארו $${a}$ ו־$${c}$. כשמרחיבים שבר כופלים גם את המונה.` },
          ],
          hint: `המכנים שונים. קודם מביאים למכנה משותף: המספר הקטן ש־${b} וגם ${d} נכנסים בו.`,
          steps: [
            `מכנה משותף: $${L}$.`,
            `מרחיבים: ${L === b ? `$${fr(a, b)}$ נשאר` : `$${fr(a, b)} = ${fr(A, L)}$`}, ${L === d ? `$${fr(c, d)}$ נשאר` : `$${fr(c, d)} = ${fr(C, L)}$`}.`,
            `$${fr(A, L)} ${op} ${fr(C, L)} = ${fr(r, L)}${red(r, L)}$.`,
          ],
        };
      } },
      { level: 2, gen() { // כפל שברים
        let a, b, c, d; do { b = U.R(2, 6); d = U.R(2, 6); a = U.R(1, b - 1); c = U.R(1, d - 1); } while (U.gcd(a, b) > 1 || U.gcd(c, d) > 1);
        return {
          q: `חשבו: $${fr(a, b)} \\cdot ${fr(c, d)}$ <span class="muted">(אפשר לכתוב את התשובה כשבר, למשל 3/4)</span>`,
          type: 'number', answer: (a * c) / (b * d),
          mistakes: [
            { v: (a * d) / (b * c), why: 'הפכת את השבר השני. הופכים רק בחילוק — וזה תרגיל כפל.' },
            { v: a * c * lcm(b, d) / (b * d), why: 'הבאת למכנה משותף והשארת את המכנה כמו שהוא. זה מתאים לחיבור; בכפל גם המכנים מוכפלים.' },
          ],
          hint: 'בכפל לא צריך מכנה משותף: מונה כפול מונה, ומכנה כפול מכנה.',
          steps: [`מונה כפול מונה: $${a} \\cdot ${c} = ${a * c}$.`, `מכנה כפול מכנה: $${b} \\cdot ${d} = ${b * d}$.`, `$${fr(a, b)} \\cdot ${fr(c, d)} = ${fr(a * c, b * d)}${red(a * c, b * d)}$.`],
        };
      } },
      { level: 2, gen() { // חילוק שברים
        let a, b; do { b = U.R(2, 6); a = U.R(1, b - 1); } while (U.gcd(a, b) > 1);
        const [c, d] = U.pick([[1, 2], [1, 3], [1, 4], [2, 3], [3, 4], [2, 5]]);
        return {
          q: `חשבו: $${fr(a, b)} \\div ${fr(c, d)}$ <span class="muted">(אפשר לכתוב את התשובה כשבר, למשל 3/4)</span>`,
          type: 'number', answer: (a * d) / (b * c),
          mistakes: [
            { v: (a * c) / (b * d), why: 'כפלת את השברים כמו שהם. בחילוק שברים יש עוד צעד לפני הכפל.' },
            { v: (b * c) / (a * d), why: 'הפכת את השבר הראשון. הופכים רק את השבר שמחלקים בו.' },
          ],
          hint: `בחילוק הופכים את השבר השני (המונה והמכנה מתחלפים) וכופלים: $\\div ${fr(c, d)}$ הופך ל־$\\cdot ${fr(d, c)}$.`,
          steps: [`הופכים את השבר השני: $${fr(c, d)} \\to ${fr(d, c)}$, ועוברים לכפל.`, `$${fr(a, b)} \\cdot ${fr(d, c)} = ${fr(a * d, b * c)}${red(a * d, b * c)}$.`],
        };
      } },
      { level: 2, gen() { // שבר (לא יחידה) מכמות
        const d = U.pick([3, 4, 5, 6, 8, 10]), a = U.R(2, d - 1), m = U.R(2, 6), N = d * m;
        return {
          q: `שחקן זרק ${N} זריקות עונשין וקלע $${fr(a, d)}$ מהן. כמה זריקות הוא קלע?`,
          type: 'number', answer: a * m,
          mistakes: [{ v: m, why: `מצאת כמה זה $${fr(1, d)}$ מהזריקות. אבל הוא קלע $${fr(a, d)}$ מהן.` }],
          hint: `קודם מוצאים כמה זה $${fr(1, d)}$ (מחלקים ב־${d}), ואז כופלים ב־${a}.`,
          steps: [`$${fr(1, d)}$ מתוך ${N}: $${N} \\div ${d} = ${m}$.`, `$${fr(a, d)}$ זה ${a} חלקים כאלה: $${m} \\cdot ${a} = ${m * a}$.`, `הוא קלע ${m * a} זריקות.`],
        };
      } },

      // ---------- רמה 3 ----------
      { level: 3, gen() { // מוצאים את השלם מתוך חלק
        const d = U.pick([3, 4, 5, 6]), a = U.R(1, d - 1), k = U.R(2, 6), P = a * k;
        return {
          q: `שחקן קלע ${P} נקודות, וזה $${fr(a, d)}$ מכל הנקודות של הקבוצה במשחק. כמה נקודות קלעה הקבוצה כולה?`,
          type: 'number', answer: d * k,
          mistakes: [
            { v: P * a / d, why: `חישבת $${fr(a, d)}$ מתוך ${P}. אבל ${P} הוא כבר החלק — מחפשים את השלם, והוא גדול יותר.` },
            { v: P * d, why: `כפלת ב־${d}, כאילו ${P} נקודות הן חלק אחד. אבל הן ${a} חלקים.` },
          ],
          hint: `${P} נקודות הן ${a} חלקים מתוך ${d}. קודם מוצאים כמה נקודות יש בחלק אחד.`,
          steps: [`${a === 1 ? `חלק אחד ($${fr(1, d)}$) = ${P} נקודות.` : `${a} חלקים = ${P} נקודות ← חלק אחד: $${P} \\div ${a} = ${k}$.`}`, `השלם הוא ${d} חלקים: $${k} \\cdot ${d} = ${d * k}$.`, `בדיקה: $${fr(a, d)}$ מתוך ${d * k} = $${d * k} \\div ${d} \\cdot ${a} = ${P}$ ✔`],
        };
      } },
      { level: 3, gen() { // מכנה משותף שהוא לא מכפלת המכנים
        const [b, d] = U.pick([[4, 6], [6, 8], [6, 9], [4, 10], [6, 10], [8, 12], [9, 12], [10, 15]]);
        const plus = Math.random() < 0.5, L = lcm(b, d);
        let a, c; do { a = U.R(1, b - 1); c = U.R(1, d - 1); } while (U.gcd(a, b) > 1 || U.gcd(c, d) > 1 || (!plus && a * L / b <= c * L / d));
        const A = a * L / b, C = c * L / d, r = plus ? A + C : A - C, op = plus ? '+' : '-';
        return {
          q: `חשבו: $${fr(a, b)} ${op} ${fr(c, d)}$ <span class="muted">(אפשר לכתוב את התשובה כשבר, למשל 3/4)</span>`,
          type: 'number', answer: r / L,
          mistakes: [
            ...(plus ? [{ v: (a + c) / (b + d), why: 'חיברת מונה עם מונה ומכנה עם מכנה. כשהמכנים שונים, קודם מביאים למכנה משותף.' }] : []),
            { v: (plus ? a + c : a - c) / L, why: `מצאת מכנה משותף $${L}$, אבל המונים נשארו $${a}$ ו־$${c}$. כשמרחיבים שבר כופלים גם את המונה.` },
          ],
          hint: `מכנה משותף: המספר <b>הקטן ביותר</b> ש־${b} וגם ${d} נכנסים בו (לא חייבים לכפול $${b} \\cdot ${d}$).`,
          steps: [`הכפולות של ${d}: ${[1, 2, 3, 4, 5].map(i => d * i).filter(v => v <= L).join(', ')}... הראשונה ש־${b} נכנס בה: $${L}$.`, `$${fr(a, b)} = ${fr(A, L)}$, $${fr(c, d)} = ${fr(C, L)}$.`, `$${fr(A, L)} ${op} ${fr(C, L)} = ${fr(r, L)}${red(r, L)}$.`],
        };
      } },
      { level: 3, gen() { // עשרוני ושבר יחד
        const [dec, n, d] = U.pick([['0.5', 1, 2], ['0.25', 1, 4], ['0.2', 1, 5], ['0.75', 3, 4]]), [c, e] = U.pick([[1, 2], [1, 4], [3, 4], [2, 5], [1, 5], [3, 10]]);
        const L = lcm(d, e), A = n * L / d, C = c * L / e, r = A + C;
        return {
          q: `חשבו: $${dec} + ${fr(c, e)}$ <span class="muted">(אפשר לכתוב את התשובה כמספר עשרוני או כשבר)</span>`,
          type: 'number', answer: r / L,
          hint: `הופכים את הכל לאותה צורה: או את $${fr(c, e)}$ למספר עשרוני, או את $${dec}$ לשבר.`,
          steps: [`$${fr(c, e)} = ${c / e}$ (מכנה 10 או 100).`, `$${dec} + ${c / e} = ${+(r / L).toFixed(3)}$.`, `ובשברים: $${fr(n, d)} + ${fr(c, e)} = ${fr(A, L)} + ${fr(C, L)} = ${fr(r, L)}${red(r, L)}$.`],
        };
      } },
    ],

    summary: [
      'שבר: המכנה (למטה) = לכמה חלקים שווים חתכנו, המונה (למעלה) = כמה לקחנו.',
      'כופלים או מחלקים מונה <b>ומכנה</b> באותו מספר ← שבר שווה. ככה מרחיבים ומצמצמים: $\\frac{6}{8} = \\frac{3}{4}$.',
      'שבר ↔ עשרוני: מגיעים למכנה 10 או 100. $\\frac{1}{2} = 0.5$, $\\frac{1}{4} = 0.25$, $\\frac{3}{4} = 0.75$.',
      'חיבור וחיסור: מכנה שווה ← מחברים רק מונים. מכנה שונה ← קודם מכנה משותף. לעולם לא מחברים מכנים!',
      'כפל: מונה כפול מונה, מכנה כפול מכנה. חילוק: הופכים את השבר השני וכופלים.',
      '$\\frac{3}{4}$ מתוך 20: מחלקים במכנה ($20 \\div 4 = 5$) וכופלים במונה ($5 \\cdot 3 = 15$).',
    ],
  });
})();
