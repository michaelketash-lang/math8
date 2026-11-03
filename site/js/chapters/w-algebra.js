/* יחידת חימום: ביטויים אלגבריים — הצבה, כינוס איברים דומים, פילוג פשוט (חזרה מכיתה ז׳) */
(() => {
  /** מספר בסוגריים אם הוא שלילי */
  const p = n => (n < 0 ? `(${n})` : String(n));
  /** ביטוי מאיברים לפי הסדר: ex([3,'x'],[-2,''],[1,'y']) → '3x - 2 + y'. מקדם 0 מדלגים. */
  const ex = (...ts) => {
    let s = '';
    for (const [k, v] of ts) {
      if (!k) continue;
      const abs = Math.abs(k), body = v ? (abs === 1 ? v : abs + v) : String(abs);
      s += s ? ` ${k < 0 ? '-' : '+'} ${body}` : (k < 0 ? '-' : '') + body;
    }
    return s || '0';
  };
  /** שאלה אמריקאית: מסיר כפילויות ומערבב */
  const mc = (right, wrongs) => {
    const choices = U.shuffle([right, ...[...new Set(wrongs)].filter(w => w !== right).slice(0, 3)].map(c => `$${c}$`));
    return { type: 'choice', choices, answer: choices.indexOf(`$${right}$`) };
  };
  /** מקדם ליד אות בהצבה: 3x עם x=-2 → '3 \cdot (-2)' */
  const mul = (k, x) => `${k} \\cdot ${p(x)}`;
  const NS = 'http://www.w3.org/2000/svg';
  /** שרטוט מלבן או משולש עם תוויות על הצלעות */
  function shape(el, kind, labels) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 360 220'); svg.style.cssText = 'width:100%;max-width:360px;margin:0 auto;display:block';
    const st = 'fill:var(--accent-soft);stroke:var(--ink);stroke-width:3';
    const tx = (x, y, t) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="20" font-style="italic" style="fill:var(--blue)" font-weight="700" direction="ltr">${t}</text>`;
    svg.innerHTML = kind === 'rect'
      ? `<rect x="70" y="50" width="220" height="120" style="${st}"/>${tx(180, 38, labels[0])}${tx(180, 196, labels[0])}${tx(36, 116, labels[1])}${tx(324, 116, labels[1])}`
      : `<polygon points="60,180 300,180 150,40" style="${st}"/>${tx(180, 206, labels[0])}${tx(82, 104, labels[1])}${tx(262, 104, labels[2])}`;
    el.appendChild(svg);
  }

  registerChapter('w-algebra', {
    intro: `
      <p><b>ביטוי אלגברי</b> הוא "מתכון" חשבוני עם אות, למשל $2x + 3$. האות ($x$) מחליפה מספר שעוד לא בחרנו.</p>
      <div class="idea"><b>הצבה</b>מחליפים את האות במספר ומחשבים לפי סדר הפעולות.
        <div class="formula">$2x + 3$ &nbsp; כאשר $x = 4$: &nbsp; $2 \\cdot 4 + 3 = 8 + 3 = 11$</div>
        שים לב: $2x$ פירושו $2 \\cdot x$. ומספר שלילי מציבים בסוגריים: $2 \\cdot (-4)$.</div>
      <div class="idea"><b>איברים דומים</b>איברים עם <b>אותה אות</b> (באותה חזקה) הם דומים: $3x$ ו־$5x$ דומים. $3x$ ו־$3y$ לא דומים, וגם $x$ ו־$x^2$ לא.
        <br>את האיברים הדומים <b>מכנסים</b> (מחברים): $3x + 5x = 8x$. מחברים רק את המספרים שלפני האות.</div>
      <div class="idea"><b>חוק הפילוג</b>מספר שלפני סוגריים כופל <b>כל</b> איבר בתוכם.
        <div class="formula">$3(x + 2) = 3x + 6$</div></div>
      <div class="note"><b>היקף</b><br>היקף = סכום כל הצלעות. מלבן עם צלעות $x + 3$ ו־$x$:
        <br>$(x + 3) + x + (x + 3) + x = 4x + 6$</div>
      <p class="muted">טעות נפוצה: $3x + 2$ זה <b>לא</b> $5x$. מספר בודד ו־$x$ הם לא איברים דומים!</p>`,

    example: {
      question: 'מגרש מלבני: אורך $2x + 1$ ורוחב $x + 3$ (במטרים).<br>א. כתבו ביטוי פשוט להיקף. ב. מה ההיקף כאשר $x = 5$?',
      steps: [
        'היקף = סכום 4 הצלעות: $(2x + 1) + (x + 3) + (2x + 1) + (x + 3)$.',
        'מסדרים לפי סוג. האיברים עם $x$: $2x + x + 2x + x$.',
        'מכנסים אותם: $2 + 1 + 2 + 1 = 6$, כלומר $6x$.',
        'המספרים הבודדים: $1 + 3 + 1 + 3 = 8$.',
        'ההיקף: $6x + 8$.',
        'סעיף ב: מציבים $x = 5$: $6 \\cdot 5 + 8 = 30 + 8 = 38$ מטרים.',
        'בדיקה: עם $x = 5$ האורך $2 \\cdot 5 + 1 = 11$ והרוחב $5 + 3 = 8$. היקף: $11 + 8 + 11 + 8 = 38$ ✔',
      ],
    },

    tools: [
      {
        title: 'אריחי אלגברה: כינוס איברים דומים',
        desc: 'הוסיפו אריחים בכפתורים. כל אריח נכנס לסל של הסוג שלו: x עם x, y עם y, ומספרים עם מספרים. אריח חיובי ואריח שלילי מאותו סוג מבטלים זה את זה (הם מאפירים).',
        mount(el) {
          let terms = [];
          el.insertAdjacentHTML('beforeend', `<div class="row btns" style="justify-content:center" dir="ltr"></div>
            <div class="readout raw"></div><div class="bins" dir="ltr" style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center;margin:8px 0"></div>
            <div class="readout res"></div>
            <div class="row" style="justify-content:center"><button class="btn ghost rnd">ביטוי אקראי</button><button class="btn ghost clr">ניקוי</button></div>`);
          const btns = el.querySelector('.btns'), raw = el.querySelector('.raw'), bins = el.querySelector('.bins'), res = el.querySelector('.res');
          const KINDS = { x: { w: 20, h: 56, col: 'var(--accent)' }, y: { w: 36, h: 36, col: 'var(--good)' }, '': { w: 20, h: 20, col: 'var(--blue)' } };
          const tile = (v, s, faded) => `<span style="display:inline-flex;align-items:center;justify-content:center;width:${KINDS[v].w}px;height:${KINDS[v].h}px;margin:3px;border-radius:4px;font-weight:700;font-size:13px;color:#fff;background:${s > 0 ? KINDS[v].col : 'var(--bad)'};opacity:${faded ? 0.25 : 1};font-style:${v ? 'italic' : 'normal'}">${s < 0 ? '−' : ''}${v || 1}</span>`;
          const draw = () => {
            raw.innerHTML = terms.length ? `הביטוי: $${ex(...terms.map(t => [t.s, t.v]))}$` : 'לחצו על הכפתורים כדי להוסיף אריחים.';
            bins.innerHTML = [['x', 'x-ים'], ['y', 'y-ים'], ['', 'מספרים']].map(([v, name]) => {
              const pos = terms.filter(t => t.v === v && t.s > 0).length, neg = terms.filter(t => t.v === v && t.s < 0).length, z = Math.min(pos, neg);
              const tiles = [...Array(pos)].map((_, i) => tile(v, 1, i < z)).join('') + [...Array(neg)].map((_, i) => tile(v, -1, i < z)).join('');
              return `<div style="min-width:120px;max-width:220px;border:2px dashed var(--line);border-radius:12px;padding:6px;text-align:center">
                <div class="muted" dir="rtl">${name}: <b dir="ltr">${pos - neg}</b></div>${tiles || '<span class="muted">—</span>'}</div>`;
            }).join('');
            const k = v => terms.filter(t => t.v === v).reduce((a, t) => a + t.s, 0);
            res.innerHTML = terms.length ? `אחרי כינוס: $${ex([k('x'), 'x'], [k('y'), 'y'], [k(''), ''])}$` : '';
            U.math(raw); U.math(res);
          };
          [['x', 1], ['x', -1], ['y', 1], ['y', -1], ['', 1], ['', -1]].forEach(([v, s]) => {
            const b = document.createElement('button'); b.className = 'btn ghost';
            b.textContent = (s > 0 ? '+' : '−') + (v || '1');
            b.onclick = () => { if (terms.length < 24) terms.push({ v, s }); draw(); };
            btns.appendChild(b);
          });
          const rnd = () => {
            terms = [];
            const n = { x: U.R(2, 5), y: U.R(0, 3), '': U.R(2, 5) };
            for (const v in n) for (let i = 0; i < n[v]; i++) terms.push({ v, s: Math.random() < 0.75 ? 1 : -1 });
            terms = U.shuffle(terms); draw();
          };
          el.querySelector('.rnd').onclick = rnd;
          el.querySelector('.clr').onclick = () => { terms = []; draw(); };
          rnd();
        },
      },
      {
        title: 'מכונת ההצבה',
        desc: 'בחרו ביטוי והזיזו את הסליידר של x. המכונה מציבה את המספר במקום x ומראה את החישוב. בטבלה רואים איך הערך משתנה.',
        mount(el) {
          const E = [
            { s: '2x + 3', f: x => 2 * x + 3, w: x => [`${mul(2, x)} + 3`, `${2 * x} + 3`] },
            { s: '3x - 4', f: x => 3 * x - 4, w: x => [`${mul(3, x)} - 4`, `${3 * x} - 4`] },
            { s: '10 - 2x', f: x => 10 - 2 * x, w: x => [`10 - ${mul(2, x)}`, `10 - ${p(2 * x)}`] },
            { s: 'x^2 + 1', f: x => x * x + 1, w: x => [`${p(x)}^2 + 1`, `${x * x} + 1`] },
            { s: '2(x + 1)', f: x => 2 * (x + 1), w: x => [`2 \\cdot (${x} + 1)`, `2 \\cdot ${p(x + 1)}`] },
          ];
          let cur = E[0], x = 2;
          el.insertAdjacentHTML('beforeend', `<div class="row choose" style="justify-content:center" dir="ltr"></div><div class="readout out"></div><div class="tbl" dir="ltr" style="overflow-x:auto"></div>`);
          const choose = el.querySelector('.choose'), out = el.querySelector('.out'), tbl = el.querySelector('.tbl');
          const upd = () => {
            out.innerHTML = `מציבים $x = ${x}$ בביטוי $${cur.s}$<br>$${[...cur.w(x), cur.f(x)].join(' = ')}$`;
            const xs = [-3, -2, -1, 0, 1, 2, 3, 4, 5];
            const cell = (v, on, h) => `<td style="padding:4px 10px;border:1px solid var(--line);${on ? 'background:var(--accent-soft);font-weight:700' : ''}${h ? ';color:var(--muted)' : ''}">${v}</td>`;
            tbl.innerHTML = `<table style="border-collapse:collapse;margin:8px auto"><tr>${cell('x', 0, 1)}${xs.map(v => cell(U.num(v), v === x)).join('')}</tr>
              <tr>${cell('ערך', 0, 1)}${xs.map(v => cell(U.num(cur.f(v)), v === x)).join('')}</tr></table>`;
            U.math(out);
          };
          E.forEach(e => {
            const b = document.createElement('button'); b.className = 'btn ghost'; b.innerHTML = `$${e.s}$`;
            b.onclick = () => { cur = e; upd(); };
            choose.appendChild(b);
          });
          U.math(choose);
          U.slider(el, { label: 'x', min: -3, max: 5, value: x, onInput: v => { x = v; upd(); } });
        },
      },
      {
        title: 'היקף עם x',
        desc: 'למלבן יש אורך $2x + 1$ ורוחב $x + 2$. הזיזו את x: המלבן משתנה, ובכל פעם רואים שהביטוי המכונס $6x + 6$ נותן בדיוק את אותו היקף כמו חיבור הצלעות.',
        mount(el) {
          const svg = document.createElementNS(NS, 'svg');
          svg.setAttribute('viewBox', '0 0 420 260'); svg.style.cssText = 'width:100%;max-width:420px;margin:0 auto;display:block';
          const out = document.createElement('div'); out.className = 'readout';
          el.append(svg, out);
          const upd = x => {
            const L = 2 * x + 1, W = x + 2, s = 300 / 13, w = L * s, h = W * s, x0 = 210 - w / 2, y0 = 130 - h / 2;
            svg.innerHTML = `<rect x="${x0}" y="${y0}" width="${w}" height="${h}" style="fill:var(--accent-soft);stroke:var(--ink);stroke-width:3"/>
              <text x="210" y="${y0 - 10}" text-anchor="middle" font-size="18" style="fill:var(--accent)" font-weight="700" direction="ltr">2x + 1 = ${L}</text>
              <text x="${x0 + 8}" y="135" text-anchor="start" font-size="18" style="fill:var(--blue)" font-weight="700" direction="ltr">x + 2 = ${W}</text>`;
            out.innerHTML = `היקף $= (2x + 1) + (x + 2) + (2x + 1) + (x + 2) = 6x + 6$
              <br>חיבור הצלעות: $${L} + ${W} + ${L} + ${W} = ${2 * L + 2 * W}$
              <br>הצבה בביטוי: $6 \\cdot ${x} + 6 = ${6 * x + 6}$ ✔`;
            U.math(out);
          };
          U.slider(el, { label: 'x', min: 1, max: 6, value: 3, onInput: upd });
        },
      },
    ],

    exercises: [
      // הצבה של מספר חיובי
      { level: 1, gen() {
        const a = U.R(2, 5), x = U.R(1, 6), v = U.R(0, 2);
        const b = v === 1 ? U.R(1, a * x - 1) : U.R(1, 9);
        const e = v === 0 ? `${a}x + ${b}` : v === 1 ? `${a}x - ${b}` : `${b} + ${a}x`;
        const ans = v === 1 ? a * x - b : a * x + b;
        const sub = v === 0 ? `${mul(a, x)} + ${b}` : v === 1 ? `${mul(a, x)} - ${b}` : `${b} + ${mul(a, x)}`;
        const mid = v === 0 ? `${a * x} + ${b}` : v === 1 ? `${a * x} - ${b}` : `${b} + ${a * x}`;
        return {
          q: `מה הערך של הביטוי $${e}$ כאשר $x = ${x}$?`, type: 'number', answer: ans,
          hint: `מחליפים את $x$ ב־$${x}$. זכרו: $${a}x$ פירושו $${a} \\cdot x$.`,
          steps: [`מציבים $x = ${x}$: $${sub}$`, `קודם כפל: $${a} \\cdot ${x} = ${a * x}$`, `$${mid} = ${ans}$`],
        };
      } },
      // זיהוי איברים דומים
      { level: 1, gen() {
        const [v, o] = U.pick([['x', 'y'], ['y', 'x'], ['a', 'b']]), a = U.R(2, 7);
        let k; do { k = U.R(1, 9); } while (k === a);
        return {
          q: `איזה מהאיברים הבאים <b>דומה</b> לאיבר $${a}${v}$?`,
          ...mc(U.term(k, v), [`${a}${o}`, `${a}${v}^2`, String(a)]),
          hint: 'איברים דומים = אותה אות, באותה חזקה. המספר שלפני האות יכול להיות שונה.',
          steps: [`ל־$${a}${v}$ יש את האות $${v}$ (בלי חזקה).`, `$${a}${o}$ — אות אחרת. $${a}${v}^2$ — חזקה אחרת. $${a}$ — אין אות בכלל.`, `רק $${U.term(k, v)}$ דומה: גם לו יש בדיוק $${v}$.`],
        };
      } },
      // כינוס פשוט
      { level: 1, gen() {
        const plus = Math.random() < 0.6, a = U.R(2, 8), b = plus ? U.R(1, 8) : U.R(1, a - 1), r = plus ? a + b : a - b;
        const e = `${a}x ${plus ? '+' : '-'} ${U.term(b)}`;
        return {
          q: `כנסו איברים דומים: $${e} = \\;?$`,
          ...mc(U.term(r), [`${U.term(r)}^2`, `${a * b}x`, String(r), U.term(plus ? (a - b || r + 1) : a + b)]),
          hint: `שני האיברים עם $x$, אז הם דומים. ${plus ? 'מחברים' : 'מחסירים'} רק את המספרים שלפני ה־$x$.`,
          steps: [`$${a} ${plus ? '+' : '-'} ${b} = ${r}$`, `לכן $${e} = ${U.term(r)}$.`, `ה־$x$ נשאר $x$ — הוא לא הופך ל־$x^2$.`],
        };
      } },
      // מילים ← ביטוי
      { level: 1, gen() {
        const a = U.R(2, 5), b = U.R(1, 9);
        const t = U.pick([
          [`חושבים על מספר $x$. כופלים אותו ב־${a}, ואחר כך מוסיפים ${b}. איזה ביטוי מתאר את התוצאה?`, `${a}x + ${b}`, [`${a}(x + ${b})`, `${b}x + ${a}`, `x + ${a + b}`], `כופלים קודם: $${a}x$. ואז מוסיפים: $${a}x + ${b}$.`],
          [`חושבים על מספר $x$. מוסיפים לו ${b}, ואת התוצאה כופלים ב־${a}. איזה ביטוי מתאר את התוצאה?`, `${a}(x + ${b})`, [`${a}x + ${b}`, `x + ${a * b}`, `${b}(x + ${a})`], `קודם מוסיפים: $x + ${b}$. את <b>כל</b> התוצאה כופלים ב־${a}, אז צריך סוגריים: $${a}(x + ${b})$.`],
          [`שחקן קלע $x$ סלים של 2 נקודות, ועוד ${b} זריקות עונשין (כל אחת נקודה אחת). כמה נקודות הוא קלע?`, `2x + ${b}`, [`2(x + ${b})`, `x + ${b + 2}`, `${b}x + 2`], `כל סל שווה 2 נקודות, אז $x$ סלים שווים $2x$. מוסיפים ${b} נקודות: $2x + ${b}$.`],
          [`בקבוצה יש $x$ שחקנים, וכל שחקן קיבל ${a} חולצות. כמה חולצות חולקו בסך הכול?`, `${a}x`, [`x + ${a}`, `x - ${a}`, `\\frac{x}{${a}}`], `לכל אחד מ־$x$ השחקנים יש ${a} חולצות: $${a} \\cdot x = ${a}x$.`],
        ]);
        return {
          q: t[0], ...mc(t[1], t[2]),
          hint: 'קראו לאט, לפי הסדר: מה עושים ל־$x$ קודם, ומה אחר כך? "כפול" ← כפל, "מוסיפים" ← חיבור.',
          steps: [t[3], `התשובה: $${t[1]}$.`],
        };
      } },
      // פילוג פשוט
      { level: 1, gen() {
        const a = U.R(2, 5), b = U.R(1, 6), plus = Math.random() < 0.6, s = plus ? '+' : '-';
        return {
          q: `פתחו סוגריים: $${a}(x ${s} ${b}) = \\;?$`,
          ...mc(`${a}x ${s} ${a * b}`, [`${a}x ${s} ${b}`, `x ${s} ${a * b}`, `${a}x ${plus ? '-' : '+'} ${a * b}`, `${a + b}x`]),
          hint: `המספר $${a}$ כופל <b>כל</b> איבר בתוך הסוגריים — גם את $x$ וגם את $${b}$.`,
          steps: [`$${a} \\cdot x = ${a}x$`, `$${a} \\cdot ${b} = ${a * b}$`, `ביחד: $${a}(x ${s} ${b}) = ${a}x ${s} ${a * b}$`],
        };
      } },
      // הצבה: מספר שלילי, ריבוע, או שתי אותיות
      { level: 2, gen() {
        const v = U.R(0, 2);
        if (v === 0) {
          const a = U.R(2, 5), b = U.R(1, 9), x = -U.R(1, 5), ans = a * x + b;
          return {
            q: `מה הערך של הביטוי $${a}x + ${b}$ כאשר $x = ${x}$?`, type: 'number', answer: ans,
            hint: `מציבים את המספר השלילי <b>בסוגריים</b>: $${mul(a, x)} + ${b}$. פלוס כפול מינוס = מינוס.`,
            steps: [`מציבים: $${mul(a, x)} + ${b}$`, `כפל: $${mul(a, x)} = ${a * x}$`, `$${a * x} + ${b} = ${ans}$`],
          };
        }
        if (v === 1) {
          const x = U.pick([-4, -3, -2, 2, 3, 4]), b = U.R(1, 9), ans = x * x + b;
          return {
            q: `מה הערך של הביטוי $x^2 + ${b}$ כאשר $x = ${x}$?`, type: 'number', answer: ans,
            hint: `$x^2 = x \\cdot x$. מציבים בסוגריים: $${p(x)}^2$.`,
            steps: [`מציבים: $${p(x)}^2 + ${b}$`, `חזקה: $${p(x)}^2 = ${p(x)} \\cdot ${p(x)} = ${x * x}$`, `$${x * x} + ${b} = ${ans}$`],
          };
        }
        const a = U.R(2, 4), b = U.R(2, 4), x = U.R(1, 5), y = U.RNZ(-4, 5), ans = a * x + b * y;
        return {
          q: `מה הערך של הביטוי $${a}x + ${b}y$ כאשר $x = ${x}$ ו־$y = ${y}$?`, type: 'number', answer: ans,
          hint: `מציבים כל מספר במקום האות שלו: $${x}$ במקום $x$, ו־$${y}$ במקום $y$.`,
          steps: [`מציבים: $${mul(a, x)} + ${mul(b, y)}$`, `כפל: $${a * x} + ${p(b * y)}$`, `$= ${ans}$`],
        };
      } },
      // כינוס: x ומספרים
      { level: 2, gen() {
        let a, b, c, d; do { a = U.R(2, 7); b = U.RNZ(-9, 9); c = U.RNZ(-5, 5); d = U.RNZ(-9, 9); } while (a + c === 0 || b + d === 0);
        const e = ex([a, 'x'], [b, ''], [c, 'x'], [d, '']);
        return {
          q: `כנסו איברים דומים: $${e} = \\;?$`,
          ...mc(ex([a + c, 'x'], [b + d, '']), [ex([a + c, 'x'], [b - d, '']), ex([a - c, 'x'], [b + d, '']), ex([a + b + c + d, 'x']), ex([a + c + b + d, ''])]),
          hint: 'אוספים את האיברים עם $x$ לחוד, ואת המספרים הבודדים לחוד. הסימן שלפני כל איבר "שייך" לו.',
          steps: [`האיברים עם $x$: $${ex([a, 'x'], [c, 'x'])} = ${U.term(a + c)}$`, `המספרים: $${ex([b, ''], [d, ''])} = ${b + d}$`, `ביחד: $${ex([a + c, 'x'], [b + d, ''])}$`],
        };
      } },
      // כינוס: שתי אותיות
      { level: 2, gen() {
        let a, b, c, d; do { a = U.R(1, 5); b = U.R(1, 5); c = U.RNZ(-4, 4); d = U.RNZ(-4, 4); } while (a + c === 0 || b + d === 0);
        const e = ex([a, 'x'], [b, 'y'], [c, 'x'], [d, 'y']);
        return {
          q: `כנסו איברים דומים: $${e} = \\;?$`,
          ...mc(ex([a + c, 'x'], [b + d, 'y']), [`${a + b + c + d}xy`, ex([a + b, 'x'], [c + d, 'y']), ex([a + c + b + d, 'x']), ex([a + c, 'x'], [b - d, 'y'])]),
          hint: 'איברי $x$ מכנסים עם איברי $x$, ואיברי $y$ עם איברי $y$. את $x$ ו־$y$ אי אפשר לחבר לאיבר אחד.',
          steps: [`איברי $x$: $${ex([a, 'x'], [c, 'x'])} = ${U.term(a + c)}$`, `איברי $y$: $${ex([b, 'y'], [d, 'y'])} = ${U.term(b + d, 'y')}$`, `ביחד: $${ex([a + c, 'x'], [b + d, 'y'])}$`],
        };
      } },
      // ביטוי להיקף
      { level: 2, gen() {
        if (Math.random() < 0.5) {
          const a = U.R(1, 6);
          return {
            q: `למלבן שבשרטוט יש אורך $x + ${a}$ ורוחב $x$. איזה ביטוי מתאר את ההיקף שלו?`,
            ...mc(`4x + ${2 * a}`, [`2x + ${a}`, `4x + ${a}`, `x^2 + ${a}x`, `${4 + 2 * a}x`]),
            mount: el => shape(el, 'rect', [`x + ${a}`, 'x']),
            hint: 'היקף = סכום <b>כל</b> הצלעות. למלבן יש 4 צלעות: שתי צלעות אורך ושתי צלעות רוחב.',
            steps: [`$(x + ${a}) + x + (x + ${a}) + x$`, `איברי $x$: $x + x + x + x = 4x$`, `מספרים: $${a} + ${a} = ${2 * a}$`, `ההיקף: $4x + ${2 * a}$`],
          };
        }
        const a = U.R(1, 5), b = U.R(1, 5);
        return {
          q: `למשולש שבשרטוט יש צלעות $x$, $x + ${a}$ ו־$x + ${b}$. איזה ביטוי מתאר את ההיקף שלו?`,
          ...mc(`3x + ${a + b}`, [`x + ${a + b}`, `3x + ${a * b}`, `${3 + a + b}x`, `x^3 + ${a + b}`]),
          mount: el => shape(el, 'tri', ['x', `x + ${a}`, `x + ${b}`]),
          hint: 'היקף = סכום כל הצלעות. אחרי החיבור, מכנסים את איברי $x$ לחוד ואת המספרים לחוד.',
          steps: [`$x + (x + ${a}) + (x + ${b})$`, `איברי $x$: $x + x + x = 3x$`, `מספרים: $${a} + ${b} = ${a + b}$`, `ההיקף: $3x + ${a + b}$`],
        };
      } },
      // אתגר: פילוג ואז כינוס
      { level: 3, gen() {
        const a = U.R(2, 5), b = U.RNZ(-6, 6), c = U.RNZ(-5, 6), sb = b < 0 ? '-' : '+';
        const right = ex([a + c, 'x'], [a * b, '']);
        return {
          q: `פשטו את הביטוי: $${a}(x ${sb} ${Math.abs(b)}) ${c < 0 ? '-' : '+'} ${U.term(Math.abs(c))} = \\;?$`,
          ...mc(right, [ex([a + c, 'x'], [b, '']), ex([1 + c, 'x'], [a * b, '']), ex([a * c, 'x'], [a * b, '']), ex([a + c, 'x'], [-a * b, ''])]),
          hint: 'קודם פותחים סוגריים (חוק הפילוג), ורק אחר כך מכנסים איברים דומים.',
          steps: [`פותחים סוגריים: $${a}(x ${sb} ${Math.abs(b)}) = ${ex([a, 'x'], [a * b, ''])}$`, `עכשיו: $${ex([a, 'x'], [a * b, ''], [c, 'x'])}$`, `מכנסים את איברי $x$: $${ex([a, 'x'], [c, 'x'])} = ${U.term(a + c)}$`, `התשובה: $${right}$`],
        };
      } },
      // אתגר: לפשט ואז להציב
      { level: 3, gen() {
        let a, b, c, d; do { a = U.R(2, 6); b = U.R(1, 9); c = U.RNZ(-4, 4); d = U.R(1, 9); } while (a + c === 0);
        const x = U.R(2, 6), k = a + c, m = b - d, ans = k * x + m;
        const e = ex([a, 'x'], [b, ''], [c, 'x'], [-d, '']);
        return {
          q: `פשטו את הביטוי $${e}$, ואז חשבו את ערכו כאשר $x = ${x}$.`, type: 'number', answer: ans,
          hint: 'קודם מכנסים איברים דומים (יוצא ביטוי קצר יותר), ואז מציבים בו.',
          steps: [`מכנסים: $${ex([a, 'x'], [c, 'x'])} = ${U.term(k)}$, ו־$${b} - ${d} = ${m}$`, `הביטוי הפשוט: $${ex([k, 'x'], [m, ''])}$`, `מציבים $x = ${x}$: $${k === 1 ? x : k === -1 ? `-${x}` : mul(k, x)} ${m ? U.sgn(m) : ''} = ${ans}$`],
        };
      } },
      // אתגר: היקף מספרי
      { level: 3, gen() {
        const a = U.R(1, 4), b = U.R(1, 3), x = U.R(2, 6), L = 2 * x + a, W = x + b, ans = 2 * L + 2 * W;
        return {
          q: `למלבן שבשרטוט יש אורך $2x + ${a}$ ורוחב $x + ${b}$. מה ההיקף שלו כאשר $x = ${x}$?`, type: 'number', answer: ans,
          mount: el => shape(el, 'rect', [`2x + ${a}`, `x + ${b}`]),
          hint: 'אפשר לכתוב ביטוי להיקף ולהציב, או לחשב קודם כל צלע ואז לחבר את 4 הצלעות.',
          steps: [`ביטוי להיקף: $2(2x + ${a}) + 2(x + ${b}) = 6x + ${2 * a + 2 * b}$`, `מציבים $x = ${x}$: $6 \\cdot ${x} + ${2 * a + 2 * b} = ${ans}$`, `בדיקה: אורך $${L}$, רוחב $${W}$, היקף $${L} + ${W} + ${L} + ${W} = ${ans}$ ✔`],
        };
      } },
    ],

    summary: [
      '<b>הצבה:</b> מחליפים את האות במספר ומחשבים לפי סדר הפעולות. מספר שלילי מציבים בסוגריים.',
      '$3x$ פירושו $3 \\cdot x$. כאשר $x = 4$: $3 \\cdot 4 = 12$ (ולא 34!).',
      '<b>איברים דומים</b> — אותה אות באותה חזקה. מכנסים אותם: $3x + 5x = 8x$. את $x$ ומספר בודד לא מחברים.',
      '<b>חוק הפילוג:</b> $3(x + 2) = 3x + 6$ — המספר שבחוץ כופל כל איבר בפנים.',
      '<b>היקף</b> = סכום כל הצלעות. מחברים, ואז מכנסים איברים דומים.',
    ],
  });
})();
