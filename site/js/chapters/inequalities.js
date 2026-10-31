/* יחידה: אי־שוויונות — פתרון אלגברי וגרפי, תחומי חיוביות ושליליות (פרקים 11–12 בספר) */
(() => {
  const par = n => (n < 0 ? `(${n})` : `${n}`);
  const SIGN = { '>': '\\gt', '<': '\\lt', '>=': '\\ge', '<=': '\\le' };
  const FLIP = { '>': '<', '<': '>', '>=': '<=', '<=': '>=' };
  const test = (l, s, r) => (s === '>' ? l > r : s === '<' ? l < r : s === '>=' ? l >= r : l <= r);
  const ineq = (s, v) => `$x ${SIGN[s]} ${v}$`;
  /** 4 תשובות: הסימן הנכון/ההפוך × v / -v. מחזיר {choices, answer} */
  const fourWay = (s, v) => {
    const right = ineq(s, v);
    const choices = U.shuffle([right, ineq(FLIP[s], v), ineq(s, -v), ineq(FLIP[s], -v)]);
    return { choices, answer: choices.indexOf(right) };
  };

  /** ציר מספרים ב־SVG. ray: {x, dir:+1|-1, closed, color}. dots: [{x, color}] */
  const numberLine = ({ lo, hi, ray, dots = [] }) => {
    const W = 600, pad = 30, X = v => pad + (v - lo) * (W - 2 * pad) / (hi - lo), every = hi - lo > 24 ? 5 : 1;
    let s = `<svg viewBox="0 0 ${W} 70" width="100%" style="max-width:600px;display:block;margin:auto;color:var(--ink);direction:ltr" direction="ltr" role="img" aria-label="ציר המספרים">
      <line x1="6" y1="30" x2="${W - 6}" y2="30" stroke="currentColor" stroke-width="2"/>`;
    for (let v = lo; v <= hi; v++) {
      const big = v % every === 0;
      s += `<line x1="${X(v)}" y1="${big ? 22 : 26}" x2="${X(v)}" y2="${big ? 38 : 34}" stroke="currentColor" stroke-width="${v === 0 ? 3 : 1.5}"/>`;
      if (big) s += `<text x="${X(v)}" y="58" font-size="15" text-anchor="middle" fill="currentColor">${U.num(v)}</text>`;
    }
    if (ray) {
      const x0 = X(ray.x), end = ray.dir > 0 ? W - 4 : 4, c = ray.color || '#e8702a';
      s += `<line x1="${x0}" y1="30" x2="${end - ray.dir * 10}" y2="30" stroke="${c}" stroke-width="7" stroke-linecap="round"/>
        <polygon points="${end},30 ${end - ray.dir * 16},20 ${end - ray.dir * 16},40" fill="${c}"/>
        <circle cx="${x0}" cy="30" r="9" style="fill:${ray.closed ? c : 'var(--panel)'}" stroke="${c}" stroke-width="3.5"/>`;
    }
    for (const d of dots) s += `<circle cx="${X(d.x)}" cy="30" r="6" fill="${d.color}"/>`;
    return s + '</svg>';
  };

  registerChapter('inequalities', {
    intro: `
      <p><b>אי־שוויון</b> הוא כמו משוואה, אבל במקום $=$ יש $\\gt$ (גדול), $\\lt$ (קטן), $\\ge$ (גדול או שווה) או $\\le$ (קטן או שווה).</p>
      <div class="idea"><b>הפתרון הוא תחום של מספרים</b>במשוואה $x + 2 = 5$ יש פתרון אחד: $x = 3$.
        <br>באי־שוויון $x + 2 \\gt 5$ הפתרון הוא $x \\gt 3$ — כל המספרים שגדולים מ־3: גם 4, גם 3.5, גם 100.</div>
      <div class="idea"><b>פותרים כמו משוואה</b>מותר להוסיף ולהחסיר מספר משני האגפים, ולכפול או לחלק במספר <b>חיובי</b>. הסימן לא משתנה.</div>
      <div class="idea"><b>⚠️ הכלל החשוב: כופלים או מחלקים במספר שלילי ← הופכים את הסימן!</b>
        למה? $2 \\lt 5$ נכון. נכפול ב־$(-1)$: $-2$ ו־$-5$. אבל $-2 \\gt -5$ — הסדר התהפך.
        <br>דוגמה: $-3x \\gt 12$ ← מחלקים ב־$(-3)$ והופכים: $x \\lt -4$.</div>
      <div class="note"><b>ציר המספרים</b><br>עיגול <b>ריק</b> ○ עבור $\\gt$ או $\\lt$ (המספר עצמו לא בפתרון). עיגול <b>מלא</b> ● עבור $\\ge$ או $\\le$ (המספר עצמו כן בפתרון).
        <br>$x \\gt 3$ ← חץ ימינה (המספרים הגדולים). $x \\lt 3$ ← חץ שמאלה.</div>
      <div class="idea"><b>פתרון גרפי: חיובית ושלילית</b>הפונקציה <b>חיובית</b> ($y \\gt 0$) איפה שהגרף <b>מעל</b> ציר ה־x, ו<b>שלילית</b> ($y \\lt 0$) איפה שהוא <b>מתחת</b>.
        <br>הגבול הוא נקודת החיתוך עם ציר ה־x. למשל $y = 2x - 6$ חותך ב־$x = 3$, עולה, ולכן חיובית כאשר $x \\gt 3$ ושלילית כאשר $x \\lt 3$.</div>`,

    example: {
      question: 'פתרו את אי־השוויון $5 - 2x \\gt 11$ והציגו את הפתרון על ציר המספרים.',
      steps: [
        'פותרים כמו משוואה. מחסירים 5 משני האגפים: $-2x \\gt 6$. (חיסור לא משנה את הסימן.)',
        'עכשיו צריך לחלק ב־$(-2)$ — מספר <b>שלילי</b>! לכן הופכים את הסימן: $\\gt$ נהיה $\\lt$.',
        '$x \\lt \\frac{6}{-2}$, כלומר $x \\lt -3$.',
        'בדיקה עם מספר מהפתרון, למשל $x = -4$: $5 - 2 \\cdot (-4) = 13$, ו־$13 \\gt 11$ ✔.',
        'בדיקה עם מספר שלא בפתרון, למשל $x = 0$: $5 - 0 = 5$, ו־$5 \\gt 11$ לא נכון ✔ — מצוין, הוא באמת לא אמור להתאים.',
        'על ציר המספרים: עיגול <b>ריק</b> ב־$-3$ (הסימן $\\lt$, אז $-3$ עצמו לא בפתרון), וחץ <b>שמאלה</b>.' +
          numberLine({ lo: -8, hi: 3, ray: { x: -3, dir: -1, closed: false } }),
        'מה היה קורה אם שוכחים להפוך? היינו מקבלים $x \\gt -3$, ואז $x = 0$ היה "פתרון" — אבל בדקנו שהוא לא. לכן חובה להפוך!',
      ],
    },

    tools: [
      {
        title: 'למה הופכים את הסימן?',
        desc: 'מתחילים מ־2 < 5. בחרו במה לכפול את שני המספרים, וראו על ציר המספרים מי גדול ממי. מה קורה כשהכופל שלילי?',
        mount(el) {
          const line = document.createElement('div'), out = document.createElement('div');
          out.className = 'readout'; el.append(line, out);
          U.slider(el, { label: 'כופלים ב־', min: -4, max: 4, value: 2, onInput: k => {
            if (k === 0) { line.innerHTML = numberLine({ lo: -20, hi: 20, dots: [{ x: 0, color: '#888' }] }); out.innerHTML = 'כפול 0 שניהם נהיים 0 — לא כופלים אי־שוויון ב־0.'; return; }
            const a = 2 * k, b = 5 * k;
            line.innerHTML = numberLine({ lo: -20, hi: 20, dots: [{ x: a, color: '#2f6fdb' }, { x: b, color: '#e8702a' }] });
            out.innerHTML = `<span style="color:#2f6fdb">$2 \\cdot ${par(k)} = ${a}$</span> &nbsp; <span style="color:#e8702a">$5 \\cdot ${par(k)} = ${b}$</span><br>
              $2 \\lt 5$ ← $${a} ${a < b ? '\\lt' : '\\gt'} ${b}$ &nbsp; ${k > 0 ? 'הסימן נשאר ✔' : '<b>הסימן התהפך!</b> 🔄'}`;
            U.math(out);
          } });
        },
      },
      {
        title: 'בודק הפתרונות',
        desc: 'הזיזו את x ובדקו אם הוא מקיים את אי־השוויון. כל בדיקה משאירה נקודה: ירוקה = פתרון, אדומה = לא פתרון. רואים את התחום? אחר כך לחצו "הראה פתרון".',
        mount(el) {
          const q = document.createElement('div'), line = document.createElement('div'), out = document.createElement('div');
          q.className = out.className = 'readout'; el.append(q, line, out);
          let a, b, c, s, v, dots, reveal;
          const draw = () => { line.innerHTML = numberLine({ lo: -10, hi: 10, dots, ray: reveal ? { x: v, dir: test(1, s, 0) === (a > 0) ? 1 : -1, closed: s.length > 1, color: '#1f9d55' } : null }); };
          const fresh = () => {
            a = U.pick([-3, -2, 2, 3]); v = U.R(-6, 6); s = U.pick(['>', '<', '>=', '<=']); b = U.R(-6, 6); c = a * v + b;
            dots = []; reveal = false;
            q.innerHTML = `$${U.lin(a, b)} ${SIGN[s]} ${c}$`; out.textContent = 'הזיזו את x כדי לבדוק מספרים.'; U.math(q); draw();
          };
          const sl = U.slider(el, { label: 'x', min: -10, max: 10, value: 0, onInput: x => {
            if (a === undefined) return;
            const l = a * x + b, ok = test(l, s, c);
            dots = dots.filter(d => d.x !== x).concat({ x, color: ok ? '#1f9d55' : '#d64545' }); draw();
            out.innerHTML = `$${a} \\cdot ${par(x)} ${U.sgn(b)} = ${l}$ ← $${l} ${SIGN[s]} ${c}$ ${ok ? '✔ פתרון' : '✘ לא פתרון'}`; U.math(out);
          } });
          sl.dir = 'ltr'; // כמו ציר המספרים: ימינה = גדול
          const row = document.createElement('div'); row.className = 'row'; row.style.justifyContent = 'center';
          row.innerHTML = '<button class="btn">הראה פתרון</button> <button class="btn ghost">אי־שוויון חדש</button>';
          el.appendChild(row);
          row.children[0].onclick = () => {
            reveal = true; draw();
            out.innerHTML = `הפתרון: $x ${SIGN[a > 0 ? s : FLIP[s]]} ${v}$` + (a < 0 ? ' — שימו לב, חילקנו ב־' + `$${par(a)}$` + ' אז הסימן התהפך.' : '');
            U.math(out);
          };
          row.children[1].onclick = () => { fresh(); sl.value = 0; };
          fresh();
        },
      },
      {
        title: 'איפה הפונקציה חיובית?',
        desc: 'שנו את הישר. על ציר ה־x: ירוק = שם הגרף מעל הציר (חיובית), אדום = מתחת לציר (שלילית). הגבול הוא נקודת החיתוך עם ציר ה־x.',
        mount(el) {
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const st = { m: 2, b: -4 };
          const brd = U.board(el, [-10, 10, 10, -10]);
          const z = () => (st.m ? -st.b / st.m : 0);
          const P = (fx, fy) => brd.create('point', [fx, fy], { visible: false });
          // צד ימין של נקודת האפס וצד שמאל: הצבע לפי הסימן של הפונקציה באותו צד
          const sideColor = dir => () => { const y = st.m ? st.m * dir : st.b; return y > 0 ? '#1f9d55' : y < 0 ? '#d64545' : '#888'; };
          brd.create('segment', [P(() => (st.m ? z() : 0), 0), P(11, 0)], { strokeColor: sideColor(1), strokeWidth: 8 });
          brd.create('segment', [P(-11, 0), P(() => (st.m ? z() : 0), 0)], { strokeColor: sideColor(-1), strokeWidth: 8 });
          brd.create('functiongraph', [x => st.m * x + st.b], { strokeColor: '#2f6fdb', strokeWidth: 3 });
          brd.create('point', [z, 0], { name: '', color: '#1d2433', size: 5, fixed: true, visible: () => st.m !== 0 });
          const upd = () => {
            brd.update();
            const eq = `$y = ${U.lin(st.m, st.b)}$`;
            if (!st.m) { out.innerHTML = `${eq} — ישר שטוח: ` + (st.b > 0 ? 'חיובית תמיד.' : st.b < 0 ? 'שלילית תמיד.' : 'שווה 0 תמיד.'); U.math(out); return; }
            const zz = U.num(z()).replace('−', '-'), up = st.m > 0;
            out.innerHTML = `${eq} &nbsp; חותך את ציר ה־x ב־$x = ${zz}$ &nbsp; (${up ? 'עולה' : 'יורדת'})<br>
              <span style="color:#1f9d55">חיובית: $x ${up ? '\\gt' : '\\lt'} ${zz}$</span> &nbsp;·&nbsp; <span style="color:#d64545">שלילית: $x ${up ? '\\lt' : '\\gt'} ${zz}$</span>`;
            U.math(out);
          };
          U.slider(el, { label: 'שיפוע m', min: -3, max: 3, step: 0.5, value: st.m, onInput: v => { st.m = v; upd(); } });
          U.slider(el, { label: 'חיתוך b', min: -8, max: 8, value: st.b, onInput: v => { st.b = v; upd(); } });
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        const a = U.RNZ(-4, 4), b = U.R(-6, 6), x = U.R(-5, 5), s = U.pick(['>', '<', '>=', '<=']);
        const l = a * x + b, c = l + U.pick([-3, -1, 0, 0, 1, 3]), ok = test(l, s, c);
        return {
          q: `האם $x = ${x}$ הוא פתרון של אי־השוויון $${U.lin(a, b)} ${SIGN[s]} ${c}$?`,
          type: 'choice', choices: ['כן', 'לא'], answer: ok ? 0 : 1,
          hint: 'מציבים את המספר במקום $x$, מחשבים, ובודקים אם הטענה שיוצאת נכונה.',
          steps: [`מציבים: $${a} \\cdot ${par(x)} ${U.sgn(b)} = ${l}$`, `האם $${l} ${SIGN[s]} ${c}$? ${ok ? '<b>כן</b>, זה נכון — לכן הוא פתרון.' : '<b>לא</b>, זה לא נכון — לכן הוא לא פתרון.'}`],
        };
      } },
      { level: 1, gen() {
        const a = U.RNZ(-9, 9), v = U.R(-8, 8), s = U.pick(['>', '<', '>=', '<=']), c = v + a;
        return {
          q: `פתרו: $x ${U.sgn(a)} ${SIGN[s]} ${c}$. השלימו: $x ${SIGN[s]} \\ ?$`,
          type: 'number', answer: v,
          hint: `${a > 0 ? 'מחסירים' : 'מוסיפים'} $${Math.abs(a)}$ משני האגפים, בדיוק כמו במשוואה. הסימן לא משתנה.`,
          steps: [`${a > 0 ? 'מחסירים' : 'מוסיפים'} $${Math.abs(a)}$ משני האגפים: $x ${SIGN[s]} ${c} ${a > 0 ? '-' : '+'} ${Math.abs(a)}$`, `$x ${SIGN[s]} ${v}$`],
        };
      } },
      { level: 1, gen() {
        const v = U.R(-6, 6), s = U.pick(['>', '<', '>=', '<=']);
        const choices = ['>', '<', '>=', '<='].map(t => ineq(t, v));
        return {
          q: 'איזה אי־שוויון מתאים לציר המספרים?',
          type: 'choice', choices, answer: ['>', '<', '>=', '<='].indexOf(s),
          mount(el) { el.innerHTML = numberLine({ lo: v - 6, hi: v + 6, ray: { x: v, dir: s[0] === '>' ? 1 : -1, closed: s.length > 1 } }); },
          hint: 'חץ ימינה = גדול, חץ שמאלה = קטן. עיגול מלא = כולל את המספר עצמו ($\\ge$ או $\\le$), עיגול ריק = בלי.',
          steps: [`החץ הולך ${s[0] === '>' ? 'ימינה ← גדול' : 'שמאלה ← קטן'} מ־$${v}$.`, `העיגול ${s.length > 1 ? 'מלא ← כולל את המספר' : 'ריק ← בלי המספר עצמו'}.`, `התשובה: ${ineq(s, v)}.`],
        };
      } },
      { level: 1, gen() {
        const a = U.R(2, 6), v = U.R(-6, 8), s = U.pick(['>', '<', '>=', '<=']);
        return {
          q: `פתרו: $${a}x ${SIGN[s]} ${a * v}$. השלימו: $x ${SIGN[s]} \\ ?$`,
          type: 'number', answer: v,
          hint: `מחלקים את שני האגפים ב־$${a}$. זה מספר חיובי, אז הסימן נשאר.`,
          steps: [`מחלקים ב־$${a}$ (חיובי ← הסימן נשאר): $x ${SIGN[s]} \\frac{${a * v}}{${a}}$`, `$x ${SIGN[s]} ${v}$`],
        };
      } },
      { level: 2, gen() {
        const a = -U.R(2, 6), v = U.RNZ(-7, 7), s = U.pick(['>', '<', '>=', '<=']);
        return {
          q: `פתרו את אי־השוויון $${U.term(a)} ${SIGN[s]} ${a * v}$.`,
          type: 'choice', ...fourWay(FLIP[s], v),
          hint: `מחלקים ב־$(${a})$ — מספר שלילי. מה צריך לעשות לסימן?`,
          steps: [`מחלקים את שני האגפים ב־$(${a})$.`, `זה מספר <b>שלילי</b> ← הופכים את הסימן: $${SIGN[s]}$ נהיה $${SIGN[FLIP[s]]}$.`, `$x ${SIGN[FLIP[s]]} \\frac{${a * v}}{${a}}$ ← ${ineq(FLIP[s], v)}`],
        };
      } },
      { level: 2, gen() {
        const a = U.pick([-4, -3, -2, 2, 3, 4]), v = U.RNZ(-6, 6), b = U.RNZ(-9, 9), s = U.pick(['>', '<', '>=', '<=']), c = a * v + b;
        const fin = a > 0 ? s : FLIP[s];
        return {
          q: `פתרו את אי־השוויון $${U.lin(a, b)} ${SIGN[s]} ${c}$.`,
          type: 'choice', ...fourWay(fin, v),
          hint: `קודם מעבירים את $${b}$ לאגף השני, אחר כך מחלקים ב־$${par(a)}$. ${a < 0 ? 'שימו לב לסימן של המספר שמחלקים בו!' : ''}`,
          steps: [`${b > 0 ? 'מחסירים' : 'מוסיפים'} $${Math.abs(b)}$: $${U.term(a)} ${SIGN[s]} ${c - b}$`,
            a > 0 ? `מחלקים ב־$${a}$ (חיובי ← הסימן נשאר): ${ineq(fin, v)}` : `מחלקים ב־$(${a})$ (שלילי ← <b>הופכים את הסימן</b>): ${ineq(fin, v)}`],
        };
      } },
      { level: 2, gen() {
        const m = U.pick([-3, -2, -1, 1, 2, 3]), z = U.RNZ(-5, 5), b = -m * z, pos = Math.random() < 0.5;
        const s = (m > 0) === pos ? '>' : '<';
        return {
          q: `באיזה תחום הפונקציה $y = ${U.lin(m, b)}$ ${pos ? 'חיובית' : 'שלילית'}?`,
          type: 'choice', ...fourWay(s, z),
          hint: `${pos ? 'חיובית' : 'שלילית'} פירושו $${U.lin(m, b)} ${pos ? '\\gt' : '\\lt'} 0$. פותרים את אי־השוויון (או: מוצאים איפה הישר חותך את ציר ה־x, ובודקים אם הוא עולה או יורד).`,
          steps: [`${pos ? 'חיובית' : 'שלילית'}: $${U.lin(m, b)} ${pos ? '\\gt' : '\\lt'} 0$`,
            `$${U.term(m)} ${pos ? '\\gt' : '\\lt'} ${-b}$`,
            m > 0 ? `מחלקים ב־$${m}$ (חיובי): ${ineq(s, z)}` : `מחלקים ב־$(${m})$ (שלילי ← הופכים): ${ineq(s, z)}`,
            `בגרף: הישר חותך את ציר ה־x ב־$x = ${z}$ ו${m > 0 ? 'עולה' : 'יורד'}, אז הוא ${pos ? 'מעל ' : 'מתחת ל'}ציר ${s === '>' ? 'מימין' : 'משמאל'} לנקודה הזו.`],
        };
      } },
      { level: 2, gen() {
        const m = U.pick([-2, -1, -0.5, 0.5, 1, 2]), z = U.RNZ(-4, 4), pos = Math.random() < 0.5;
        const s = (m > 0) === pos ? '>' : '<';
        return {
          q: `לפי הגרף: עבור אילו ערכי $x$ הפונקציה ${pos ? 'חיובית ($y \\gt 0$)' : 'שלילית ($y \\lt 0$)'}?`,
          type: 'choice', ...fourWay(s, z),
          mount(el) {
            const brd = U.board(el, [-6, 6, 6, -6]);
            brd.create('functiongraph', [x => m * (x - z)], { strokeColor: '#2f6fdb', strokeWidth: 3 });
            brd.create('point', [z, 0], { name: '', color: '#e8702a', size: 4, fixed: true });
          },
          hint: `מחפשים את החלק של הישר שנמצא ${pos ? 'מעל ' : 'מתחת ל'}ציר ה־x. הגבול הוא הנקודה הכתומה.`,
          steps: [`הישר חותך את ציר ה־x בנקודה $(${z}, 0)$.`, `הישר ${m > 0 ? 'עולה' : 'יורד'}, אז ${pos ? 'מעל ' : 'מתחת ל'}ציר הוא ${s === '>' ? 'מימין' : 'משמאל'} לנקודה.`, `התשובה: ${ineq(s, z)}.`],
        };
      } },
      { level: 3, gen() {
        const v = U.RNZ(-5, 5), a = U.RNZ(-5, 5); let c; do { c = U.RNZ(-5, 5); } while (c === a);
        const d = U.R(-8, 8), b = (c - a) * v + d, s = U.pick(['>', '<', '>=', '<=']);
        const k = a - c, fin = k > 0 ? s : FLIP[s];
        return {
          q: `פתרו את אי־השוויון $${U.lin(a, b)} ${SIGN[s]} ${U.lin(c, d)}$.`,
          type: 'choice', ...fourWay(fin, v),
          hint: 'מעבירים את כל ה־$x$־ים לאגף שמאל ואת המספרים לאגף ימין. בסוף מחלקים — ובודקים אם המספר שמחלקים בו שלילי.',
          steps: [`מעבירים איברים: $${U.term(k)} ${SIGN[s]} ${d - b}$`,
            k > 0 ? `מחלקים ב־$${k}$ (חיובי ← הסימן נשאר): ${ineq(fin, v)}` : `מחלקים ב־$(${k})$ (שלילי ← <b>הופכים</b>): ${ineq(fin, v)}`,
            `בדיקה עם $x = ${v + (fin[0] === '>' ? 1 : -1)}$ (בתוך הפתרון): $${a * (v + (fin[0] === '>' ? 1 : -1)) + b} ${SIGN[s]} ${c * (v + (fin[0] === '>' ? 1 : -1)) + d}$ ✔`],
        };
      } },
      { level: 3, gen() {
        const s0 = U.R(5, 40), r = U.R(8, 25), T = s0 + r * U.R(3, 9) + U.R(-r + 1, r - 1);
        const n = Math.floor((T - s0) / r) + 1;
        return {
          q: `לשחקן יש ${s0} נקודות העונה. בכל משחק הוא קולע ${r} נקודות. אחרי כמה משחקים <b>לפחות</b> יהיו לו יותר מ־${T} נקודות?`,
          type: 'number', answer: n,
          hint: `נסמן $x$ = מספר המשחקים. כותבים אי־שוויון: $${s0} + ${r}x \\gt ${T}$. פותרים, ומחפשים את המספר השלם הקטן ביותר שמתאים.`,
          steps: [`$${s0} + ${r}x \\gt ${T}$`, `$${r}x \\gt ${T - s0}$`, `$x \\gt \\frac{${T - s0}}{${r}} ${(T - s0) % r ? '\\approx' : '='} ${U.num((T - s0) / r)}$`,
            `מספר המשחקים שלם, והוא צריך להיות <b>גדול</b> מ־$${U.num((T - s0) / r)}$ ← לפחות ${n} משחקים.`,
            `בדיקה: אחרי ${n} משחקים: $${s0} + ${r * n} = ${s0 + r * n} \\gt ${T}$ ✔. אחרי ${n - 1}: $${s0 + r * (n - 1)}$ — לא מספיק.`],
        };
      } },
      { level: 3, gen() {
        const x0 = U.R(-3, 3), y0 = U.R(-3, 3), m1 = U.pick([-2, -1, 1, 2]);
        let m2; do { m2 = U.pick([-2, -1, -0.5, 0, 0.5, 1, 2]); } while (m2 === m1);
        const s = m1 > m2 ? '>' : '<';
        return {
          q: `בגרף: <span style="color:#2f6fdb">$f(x)$ בכחול</span> ו־<span style="color:#e8702a">$g(x)$ בכתום</span>. עבור אילו ערכי $x$ מתקיים $f(x) \\gt g(x)$?`,
          type: 'choice', ...(x0 === 0 ? (() => { const ch = U.shuffle([ineq(s, 0), ineq(FLIP[s], 0), ineq(s, 2), ineq(FLIP[s], -2)]); return { choices: ch, answer: ch.indexOf(ineq(s, 0)) }; })() : fourWay(s, x0)),
          mount(el) {
            const brd = U.board(el, [-6, 6, 6, -6]);
            brd.create('functiongraph', [x => m1 * (x - x0) + y0], { strokeColor: '#2f6fdb', strokeWidth: 3 });
            brd.create('functiongraph', [x => m2 * (x - x0) + y0], { strokeColor: '#e8702a', strokeWidth: 3 });
            brd.create('point', [x0, y0], { name: '', color: '#1d2433', size: 4, fixed: true });
          },
          hint: '$f(x) \\gt g(x)$ פירושו: הקו הכחול <b>מעל</b> הקו הכתום. מוצאים את נקודת החיתוך ובודקים באיזה צד הכחול למעלה.',
          steps: [`הקווים נחתכים בנקודה $(${x0}, ${y0})$.`, `${s === '>' ? 'מימין' : 'משמאל'} לנקודה הזו הקו הכחול מעל הכתום.`, `התשובה: ${ineq(s, x0)}.`],
        };
      } },
    ],

    summary: [
      'פתרון של אי־שוויון הוא תחום של מספרים, למשל $x \\gt 3$ — לא מספר אחד.',
      'פותרים כמו משוואה: מוסיפים, מחסירים, כופלים ומחלקים את שני האגפים.',
      '⚠️ כופלים או מחלקים במספר <b>שלילי</b> ← הופכים את הסימן ($\\gt$ ↔ $\\lt$).',
      'ציר המספרים: עיגול ריק ל־$\\gt$ ו־$\\lt$, עיגול מלא ל־$\\ge$ ו־$\\le$.',
      'פונקציה חיובית = הגרף מעל ציר ה־x, שלילית = מתחת. הגבול: נקודת החיתוך עם ציר ה־x.',
      'תמיד אפשר לבדוק: מציבים מספר מתוך הפתרון ורואים שהטענה נכונה.',
    ],
  });
})();
