/* יחידה: כדורסל במספרים — אחוזי קליעה, נקודות, ממוצעים, יחס ותוחלת (העשרה, סטטיסטיקה והסתברות). שמות השחקנים בדויים. */
(() => {
const n2 = U.num;
const NAMES = ['יואב', 'נועם', 'איתי', 'עומר', 'אורי', 'רועי', 'גיא', 'אלון', 'תומר', 'עידו'];
const twoNames = () => { const a = U.pick(NAMES); let b; do { b = U.pick(NAMES); } while (b === a); return [a, b]; };
const sum = a => a.reduce((s, v) => s + v, 0);
const texList = a => a.join(',\\ ');
const svgWrap = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="100%" style="direction:ltr;max-width:${w}px;display:block;margin:0 auto" dir="ltr">${inner}</svg>`;
const COLORS = ['#2f6fdb', '#e8702a', '#1f9d55', '#8b5cf6', '#d64545'];

/** דיאגרמת עמודות: labels (עברית), values. מחזיר מחרוזת SVG */
function barChart(labels, values, { W = 460, H = 230, unit = '', top, ticks = 5, colors = COLORS } = {}) {
  const max = Math.max(...values, 1), x0 = 40, y0 = H - 34, ph = y0 - 18;
  top = top || Math.ceil(max / 5) * 5;
  const cw = (W - x0 - 10) / labels.length;
  let r = '';
  for (let k = 0; k <= ticks; k++) {
    const t = top * k / ticks, y = y0 - t / top * ph;
    r += `<line x1="${x0}" y1="${y}" x2="${W - 10}" y2="${y}" style="stroke:var(--line)"/><text x="${x0 - 6}" y="${y + 4}" text-anchor="end" font-size="12" style="fill:var(--muted)">${n2(t)}</text>`;
  }
  labels.forEach((l, i) => {
    const h = Math.min(values[i], top) / top * ph, x = x0 + i * cw + cw * 0.18, w = cw * 0.64;
    r += `<rect x="${x}" y="${y0 - h}" width="${w}" height="${h}" rx="4" style="fill:${colors[i % colors.length]}"/>`;
    r += `<text x="${x + w / 2}" y="${y0 - h - 5}" text-anchor="middle" font-size="13" font-weight="700" style="fill:var(--ink)">${n2(values[i])}${unit}</text>`;
    r += `<text x="${x + w / 2}" y="${y0 + 18}" text-anchor="middle" font-size="13" style="fill:var(--ink)">${l}</text>`;
  });
  r += `<line x1="${x0}" y1="${y0}" x2="${W - 10}" y2="${y0}" style="stroke:var(--ink)"/>`;
  return svgWrap(W, H, r);
}

/** דיאגרמת עוגה עם מקרא (אחוז מכלל הנקודות) */
function pieChart(labels, values, colors = COLORS) {
  const tot = sum(values), cx = 110, cy = 105, R = 92;
  let r = '', a0 = -Math.PI / 2, legend = '';
  if (!tot) return svgWrap(460, 210, `<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:var(--line)"/>`);
  labels.forEach((l, i) => {
    const f = values[i] / tot, a1 = a0 + f * 2 * Math.PI, c = colors[i % colors.length];
    if (f >= 0.999) r += `<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:${c}"/>`;
    else if (f > 0) {
      const p = a => [cx + R * Math.cos(a), cy + R * Math.sin(a)].map(v => v.toFixed(2)).join(' ');
      r += `<path d="M ${cx} ${cy} L ${p(a0)} A ${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${p(a1)} Z" style="fill:${c};stroke:var(--panel);stroke-width:2"/>`;
    }
    legend += `<rect x="440" y="${40 + i * 34}" width="16" height="16" rx="3" style="fill:${c}"/><text x="430" y="${53 + i * 34}" text-anchor="end" font-size="15" style="fill:var(--ink)">${l}: ${values[i]} (${n2(f * 100)}%)</text>`;
    a0 = a1;
  });
  return svgWrap(460, 210, r + legend);
}

/** שורת התנצלות קטנה כשמשהו בנתונים לא הגיוני */
const warn = s => `<span style="color:var(--bad)">${s}</span>`;

registerChapter('hoops', {
  intro: `
    <p>שחקני כדורסל, מאמנים ופרשנים משתמשים כל הזמן במתמטיקה של כיתה ח׳: אחוזים, ממוצעים ויחסים. ביחידה הזו נלמד לקרוא את המספרים של המשחק.</p>
    <div class="idea"><b>אחוז קליעה</b>כמה מהזריקות נכנסו לסל, מתוך 100. מחלקים את מספר הקליעות במספר הניסיונות, וכופלים ב־100.
      <div class="formula">$\\frac{8}{10} = 0.8$ &nbsp; ← &nbsp; $0.8 \\cdot 100 = 80\\%$</div>
      שחקן שקלע 8 מתוך 10 זריקות קולע $80\\%$.</div>
    <div class="idea"><b>כמה נקודות?</b>סל רגיל = 2 נקודות, שלשה (מאחורי הקשת) = 3 נקודות, זריקת עונשין = נקודה אחת.
      <div class="formula">$5 \\cdot 2 + 4 \\cdot 3 + 6 \\cdot 1 = 10 + 12 + 6 = 28$</div>
      5 סלים, 4 שלשות ו־6 עונשין = 28 נקודות.</div>
    <div class="idea"><b>ממוצע נקודות למשחק</b>מחברים את כל הנקודות ומחלקים במספר המשחקים. 100 נקודות ב־5 משחקים: $100 \\div 5 = 20$ נקודות למשחק.
      <br>משחק חדש? מוסיפים את הנקודות שלו לסכום, ומחלקים במספר המשחקים <b>החדש</b>: $(100 + 32) \\div 6 = 22$.</div>
    <div class="note"><b>השוואה הוגנת</b><br>אורי קלע 10 שלשות ונועם רק 6. אבל אורי ניסה 25 פעמים ונועם 10.
      <br>אורי: $\\frac{10}{25} = 40\\%$ &nbsp;·&nbsp; נועם: $\\frac{6}{10} = 60\\%$. נועם קלע פחות, אבל הוא <b>קלע טוב יותר</b>. משווים אחוזים, לא רק כמויות!</div>
    <div class="idea"><b>איזו זריקה שווה יותר?</b>מכפילים את אחוז הקליעה בערך הזריקה. נדמיין 100 זריקות:
      <br>• שלשה, קולע $40\\%$: &nbsp;$40 \\cdot 3 = 120$ נקודות.
      <br>• זריקה לשתיים, קולע $55\\%$: &nbsp;$55 \\cdot 2 = 110$ נקודות.
      <br>כלומר שלשה שווה בממוצע $1.2$ נקודות לזריקה, ושתיים רק $1.1$. לכן קבוצות היום זורקות הרבה שלשות!</div>
    <div class="note"><b>עוד שני מספרים שמאמנים אוהבים</b>
      <br>• <b>יחס אסיסטים לאיבודים:</b> 12 מסירות לסל ו־4 איבודי כדור ← $12:4 = 3:1$. כלומר 3 אסיסטים על כל איבוד.
      <br>• <b>שינוי באחוזים:</b> מ־20 נקודות למשחק ל־25 ← השינוי הוא 5, ומחלקים בערך <b>הישן</b>: $\\frac{5}{20} = 25\\%$ עלייה.</div>`,

  example: {
    question: 'במשחק אחד יואב קלע 5 מתוך 10 זריקות לשתיים, 2 מתוך 5 שלשות, ו־4 מתוך 5 זריקות עונשין.<br>א. כמה נקודות קלע יואב? ב. מה אחוז הקליעה שלו לשתיים ומה לשלוש? ג. איזו זריקה שווה לו יותר נקודות בממוצע?',
    steps: [
      'סעיף א: כל סוג זריקה בנפרד. 5 סלים של 2 נקודות: $5 \\cdot 2 = 10$.',
      '2 שלשות: $2 \\cdot 3 = 6$. ו־4 עונשין של נקודה אחת: $4 \\cdot 1 = 4$.',
      'מחברים: $10 + 6 + 4 = 20$. יואב קלע 20 נקודות.',
      'סעיף ב: לשתיים: $\\frac{5}{10} = 0.5$, כפול 100 ← $50\\%$. (שים לב: מחלקים בניסיונות לשתיים בלבד, לא בכל הזריקות.)',
      'לשלוש: $\\frac{2}{5} = 0.4$, כפול 100 ← $40\\%$. האחוז לשלוש נמוך יותר.',
      'סעיף ג: כמה נקודות מביאה כל זריקה בממוצע? אחוז הקליעה (כשבר עשרוני) כפול ערך הזריקה.',
      'לשתיים: $0.5 \\cdot 2 = 1$ נקודה לזריקה. לשלוש: $0.4 \\cdot 3 = 1.2$ נקודות לזריקה.',
      'למרות שהאחוז לשלוש נמוך יותר, <b>השלשה שווה יותר</b> בממוצע ($1.2 > 1$), כי כל קליעה שווה 3.',
    ],
  },

  tools: [
    {
      title: 'הסטטיסטיקה של השחקן שלי',
      desc: 'הכניסו את המספרים של השחקן האהוב עליכם (או שלכם!): כמה זריקות הוא קלע ומתוך כמה ניסיונות, ובכמה משחקים. הכלי מחשב אחוזי קליעה, נקודות וממוצע למשחק, ומצייר דיאגרמות.',
      mount(el) {
        const rows = [
          { k: 'two', name: 'זריקות לשתיים', val: 2, made: 60, att: 120 },
          { k: 'three', name: 'שלשות', val: 3, made: 20, att: 60 },
          { k: 'ft', name: 'עונשין', val: 1, made: 30, att: 40 },
        ];
        const inp = (cls, v) => `<input class="in ${cls}" type="number" min="0" step="1" inputmode="numeric" value="${v}" style="width:4.5em">`;
        el.insertAdjacentHTML('beforeend', `
          <div class="row" style="align-items:center;justify-content:center">
            <label>שם: <input class="in pname" type="text" maxlength="20" value="השחקן שלי" style="width:9em"></label>
            <label>מספר משחקים: ${inp('games', 10)}</label>
          </div>
          <div style="overflow-x:auto"><table style="margin:0 auto"><thead><tr><th>סוג זריקה</th><th>קלע</th><th>ניסה</th><th>אחוז קליעה</th><th>נקודות</th></tr></thead>
          <tbody>${rows.map(r => `<tr data-k="${r.k}"><td>${r.name} <span class="muted">(${r.val})</span></td><td>${inp('made', r.made)}</td><td>${inp('att', r.att)}</td><td class="p"></td><td class="pts"></td></tr>`).join('')}</tbody></table></div>
          <div class="readout out"></div>
          <div class="row" style="justify-content:center"><button class="btn ghost kind" data-k="pie">עוגה: מאיפה הנקודות?</button><button class="btn ghost kind" data-k="bar">עמודות: אחוזי קליעה</button></div>
          <div class="chart"></div>`);
        const out = el.querySelector('.out'), chart = el.querySelector('.chart');
        let kind = 'pie';
        const num = i => Math.max(0, Math.floor(+i.value || 0));
        const draw = () => {
          const games = num(el.querySelector('.games'));
          let bad = false;
          const data = rows.map(r => {
            const tr = el.querySelector(`tr[data-k="${r.k}"]`), m = num(tr.querySelector('.made')), a = num(tr.querySelector('.att'));
            const ok = m <= a, p = ok && a ? m / a * 100 : null;
            if (!ok) bad = true;
            tr.querySelector('.p').innerHTML = !ok ? warn('קלע יותר ממה שניסה?') : p === null ? '—' : `$\\frac{${m}}{${a}} = ${n2(p)}\\%$`;
            tr.querySelector('.pts').innerHTML = `$${m} \\cdot ${r.val} = ${m * r.val}$`;
            return { ...r, m, a, p, pts: m * r.val };
          });
          const tot = sum(data.map(d => d.pts)), fgM = data[0].m + data[1].m, fgA = data[0].a + data[1].a;
          const who = document.createElement('b'); who.textContent = el.querySelector('.pname').value || 'השחקן';
          out.innerHTML = `${who.outerHTML}: סך הכול $${data.map(d => d.pts).join(' + ')} = ${tot}$ נקודות.
            <br>ממוצע למשחק: ${games ? `$${tot} \\div ${games} = ${n2(tot / games)}$ נקודות` : warn('צריך לפחות משחק אחד')}
            <br>אחוז קליעה מהשדה (שתיים ושלוש ביחד): ${fgA && fgM <= fgA ? `$\\frac{${fgM}}{${fgA}} = ${n2(fgM / fgA * 100)}\\%$` : '—'}
            ${bad ? `<br>${warn('בדקו את הטבלה: אי אפשר לקלוע יותר זריקות ממה שזרקת.')}` : ''}`;
          chart.innerHTML = kind === 'pie'
            ? pieChart(data.map(d => d.name), data.map(d => d.pts))
            : barChart(data.map(d => d.name), data.map(d => d.p === null ? 0 : d.p), { unit: '%', top: 100 });
          el.querySelectorAll('.kind').forEach(b => b.classList.toggle('ghost', b.dataset.k !== kind));
          U.math(el);
        };
        el.querySelectorAll('input').forEach(i => i.addEventListener('input', draw));
        el.querySelectorAll('.kind').forEach(b => b.onclick = () => { kind = b.dataset.k; draw(); });
        draw();
      },
    },
    {
      title: 'איזו זריקה שווה יותר?',
      desc: 'קבעו כמה אחוזים השחקן קולע לשתיים וכמה לשלוש. העמודות מראות כמה נקודות כל זריקה מביאה בממוצע. מצאו את נקודת השוויון!',
      mount(el) {
        const st = { p2: 50, p3: 35 };
        const box = document.createElement('div'), out = document.createElement('div'); out.className = 'readout';
        el.append(box, out);
        const upd = () => {
          const e2 = st.p2 / 100 * 2, e3 = st.p3 / 100 * 3, even = st.p2 * 2 / 3;
          box.innerHTML = barChart(['זריקה לשתיים', 'שלשה'], [e2, e3], { top: 3, ticks: 6, H: 220 });
          const verdict = Math.abs(e2 - e3) < 1e-9 ? 'שוות בדיוק! ⚖️' : e3 > e2 ? '<b style="color:#e8702a">השלשה שווה יותר</b> 🔥' : '<b style="color:#2f6fdb">הזריקה לשתיים שווה יותר</b>';
          out.innerHTML = `לשתיים: $${n2(st.p2 / 100)} \\cdot 2 = ${n2(e2)}$ &nbsp;·&nbsp; לשלוש: $${n2(st.p3 / 100)} \\cdot 3 = ${n2(e3)}$ נקודות לזריקה
            <br>מתוך 100 זריקות: $${st.p2} \\cdot 2 = ${st.p2 * 2}$ נקודות לעומת $${st.p3} \\cdot 3 = ${st.p3 * 3}$ נקודות ← ${verdict}
            <br><span class="muted">השלשה משתווה כשאחוז השלשות הוא $\\frac{2}{3}$ מאחוז השתיים: כאן $${n2(even)}\\%$.</span>`;
          U.math(out);
        };
        U.slider(el, { label: 'אחוז קליעה לשתיים', min: 0, max: 100, step: 1, value: st.p2, fmt: v => v + '%', onInput: v => { st.p2 = v; upd(); } });
        U.slider(el, { label: 'אחוז קליעה לשלוש', min: 0, max: 100, step: 1, value: st.p3, fmt: v => v + '%', onInput: v => { st.p3 = v; upd(); } });
      },
    },
    {
      title: 'סימולטור ממוצע העונה',
      desc: 'בחרו כמה נקודות השחקן יקלע במשחק הבא (העמודה המקווקוות), ולחצו "הוסף משחק". הקו הכתום הוא הממוצע. שימו לב: ככל שיש יותר משחקים, משחק אחד מזיז את הממוצע פחות.',
      mount(el) {
        const START = [16, 22, 18, 24, 20], MAXG = 15, MAXP = 50, W = 500, H = 250, x0 = 34, y0 = 212, ph = 192;
        let games = [...START], next = 35;
        el.insertAdjacentHTML('beforeend', `<div class="row" style="justify-content:center"><button class="btn add">+ הוסף משחק</button><button class="btn ghost reset">מההתחלה ↻</button></div>`);
        const box = document.createElement('div'), out = document.createElement('div'); out.className = 'readout';
        el.append(box, out);
        const Y = v => y0 - v / MAXP * ph;
        const draw = () => {
          const all = [...games, next], n = all.length, cw = (W - x0 - 6) / MAXG;
          const avg = sum(games) / games.length, avg2 = sum(all) / n;
          let r = '';
          for (let t = 0; t <= MAXP; t += 10) r += `<line x1="${x0}" y1="${Y(t)}" x2="${W - 6}" y2="${Y(t)}" style="stroke:var(--line)"/><text x="${x0 - 5}" y="${Y(t) + 4}" text-anchor="end" font-size="11" style="fill:var(--muted)">${t}</text>`;
          const run = [];
          all.forEach((v, i) => {
            const x = x0 + i * cw + cw * 0.15, w = cw * 0.7, ghost = i === n - 1;
            r += `<rect x="${x}" y="${Y(v)}" width="${w}" height="${y0 - Y(v)}" rx="3" style="${ghost ? 'fill:none;stroke:var(--blue);stroke-width:2;stroke-dasharray:4 3' : 'fill:var(--blue);opacity:.8'}"/>`;
            r += `<text x="${x + w / 2}" y="${Y(v) - 4}" text-anchor="middle" font-size="11" font-weight="700" style="fill:var(--ink)">${v}</text>`;
            r += `<text x="${x + w / 2}" y="${y0 + 14}" text-anchor="middle" font-size="10" style="fill:var(--muted)">${i + 1}</text>`;
            run.push([x + w / 2, Y(sum(all.slice(0, i + 1)) / (i + 1))]);
          });
          r += `<polyline points="${run.map(p => p.join(',')).join(' ')}" style="fill:none;stroke:var(--good);stroke-width:2"/>`;
          r += run.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3" style="fill:var(--good)"/>`).join('');
          r += `<line x1="${x0}" y1="${Y(avg)}" x2="${W - 6}" y2="${Y(avg)}" style="stroke:var(--accent);stroke-width:3;stroke-dasharray:8 5"/>`;
          r += `<text x="${(x0 + W) / 2}" y="${y0 + 32}" text-anchor="middle" font-size="12" style="fill:var(--muted)">מספר המשחק · הקו הירוק = הממוצע אחרי כל משחק</text>`;
          box.innerHTML = svgWrap(W, H, r);
          const d = avg2 - avg;
          out.innerHTML = `עכשיו: $${sum(games)} \\div ${games.length} = ${n2(avg)}$ נקודות למשחק
            <br>אחרי משחק עם ${next} נקודות: $(${sum(games)} + ${next}) \\div ${n} = ${n2(avg2)}$
            &nbsp;${Math.abs(d) < 0.005 ? '(הממוצע לא זז — המשחק בדיוק בגובה הממוצע)' : d > 0 ? `<b style="color:var(--good)">↑ עלייה של ${n2(d)}</b>` : `<b style="color:var(--bad)">↓ ירידה של ${n2(-d)}</b>`}`;
          el.querySelector('.add').disabled = games.length >= MAXG - 1;
          U.math(out);
        };
        U.slider(el, { label: 'נקודות במשחק הבא', min: 0, max: MAXP, step: 1, value: next, onInput: v => { next = v; draw(); } });
        el.querySelector('.add').onclick = () => { if (games.length < MAXG - 1) { games.push(next); draw(); } };
        el.querySelector('.reset').onclick = () => { games = [...START]; draw(); };
        draw();
      },
    },
  ],

  exercises: [
    // ---------- רמה 1 ----------
    { level: 1, gen() {
      const att = U.pick([10, 20, 25, 50, 4, 5]), made = U.R(1, att - 1), p = made / att * 100;
      const kind = U.pick(['זריקות לשתיים', 'שלשות', 'זריקות עונשין']), name = U.pick(NAMES);
      return {
        q: `${name} ניסה ${att} ${kind} וקלע ${made} מהן. מה אחוז הקליעה שלו? (כתבו רק את המספר, בלי הסימן %)`,
        type: 'number', answer: p,
        hint: 'אחוז קליעה = מספר הקליעות חלקי מספר הניסיונות, ואז כפול 100.',
        steps: [`קליעות חלקי ניסיונות: $\\frac{${made}}{${att}} = ${n2(made / att)}$`, `כפול 100: $${n2(made / att)} \\cdot 100 = ${n2(p)}$`, `אחוז הקליעה: $${n2(p)}\\%$.`],
      };
    } },
    { level: 1, gen() {
      const a = U.R(1, 8), b = U.R(1, 5), c = U.R(1, 8), name = U.pick(NAMES), tot = 2 * a + 3 * b + c;
      return {
        q: `במשחק ${name} קלע ${a} סלים של 2 נקודות, ${b} שלשות ו־${c} זריקות עונשין. כמה נקודות קלע בסך הכול?`,
        type: 'number', answer: tot,
        hint: 'סל רגיל = 2 נקודות, שלשה = 3 נקודות, עונשין = נקודה אחת. מחשבים כל סוג לבד ומחברים.',
        steps: [`סלים: $${a} \\cdot 2 = ${2 * a}$`, `שלשות: $${b} \\cdot 3 = ${3 * b}$`, `עונשין: $${c} \\cdot 1 = ${c}$`, `ביחד: $${2 * a} + ${3 * b} + ${c} = ${tot}$ נקודות.`],
      };
    } },
    { level: 1, gen() {
      const n = U.R(3, 5), avg = U.R(8, 24), name = U.pick(NAMES);
      let vals;
      do {
        vals = Array.from({ length: n - 1 }, () => U.R(avg - 7, avg + 7));
        vals.push(avg * n - sum(vals));
      } while (vals.some(v => v < 0 || v > 40));
      return {
        q: `אלה הנקודות של ${name} ב־${n} משחקים: $${texList(vals)}$. כמה נקודות קלע בממוצע למשחק?`,
        type: 'number', answer: avg,
        hint: 'שני צעדים: מחברים את כל הנקודות, ואז מחלקים במספר המשחקים.',
        steps: [`מחברים: $${vals.join(' + ')} = ${avg * n}$`, `מחלקים במספר המשחקים: $${avg * n} \\div ${n} = ${avg}$`, `הממוצע: ${avg} נקודות למשחק.`],
      };
    } },
    { level: 1, gen() {
      const vals = U.shuffle([U.R(4, 9), U.R(10, 15), U.R(16, 21), U.R(22, 27), U.R(28, 33)]), name = U.pick(NAMES);
      const labels = vals.map((_, i) => `משחק ${i + 1}`), mount = el => { el.innerHTML = barChart(labels, vals); };
      if (Math.random() < 0.5) {
        const best = vals.indexOf(Math.max(...vals));
        return {
          q: `הדיאגרמה מראה כמה נקודות קלע ${name} בכל משחק. באיזה משחק הוא קלע הכי הרבה נקודות?`,
          type: 'choice', choices: labels, answer: best, mount,
          hint: 'מחפשים את העמודה הכי גבוהה.',
          steps: [`העמודה הכי גבוהה היא של ${labels[best]}: ${vals[best]} נקודות.`],
        };
      }
      let i, j; do { i = U.R(0, 4); j = U.R(0, 4); } while (vals[i] <= vals[j]);
      return {
        q: `הדיאגרמה מראה כמה נקודות קלע ${name} בכל משחק. בכמה נקודות יותר הוא קלע ב${labels[i]} מאשר ב${labels[j]}?`,
        type: 'number', answer: vals[i] - vals[j], mount,
        hint: 'קוראים את המספר מעל כל אחת משתי העמודות, ומחסירים את הקטן מהגדול.',
        steps: [`${labels[i]}: ${vals[i]} נקודות. ${labels[j]}: ${vals[j]} נקודות.`, `מחסירים: $${vals[i]} - ${vals[j]} = ${vals[i] - vals[j]}$`],
      };
    } },
    // ---------- רמה 2 ----------
    { level: 2, gen() {
      const [A, B] = twoNames();
      let a1, a2, p1, p2, m1, m2, tries = 0;
      do {
        a1 = U.pick([20, 30, 40, 50]); a2 = U.pick([10, 20, 30]);
        p1 = U.R(3, 7) * 10; p2 = U.R(3, 7) * 10; m1 = p1 * a1 / 100; m2 = p2 * a2 / 100;
        // רוב הפעמים: מי שקלע יותר שלשות הוא דווקא הקלע הפחות טוב (המלכודת)
      } while (p1 === p2 || m1 === m2 || (tries++ < 50 && !(m1 > m2 && p1 < p2)));
      const ans = p1 > p2 ? 0 : 1;
      return {
        q: `${A} קלע ${m1} שלשות מתוך ${a1} ניסיונות. ${B} קלע ${m2} שלשות מתוך ${a2} ניסיונות. מי קלע שלשות טוב יותר?`,
        type: 'choice', choices: [A, B], answer: ans,
        hint: 'לא משווים רק את מספר השלשות! מחשבים לכל שחקן את אחוז הקליעה שלו.',
        steps: [`${A}: $\\frac{${m1}}{${a1}} = ${n2(m1 / a1)} = ${p1}\\%$`, `${B}: $\\frac{${m2}}{${a2}} = ${n2(m2 / a2)} = ${p2}\\%$`,
          `לכן <b>${ans ? B : A}</b> קלע טוב יותר${m1 > m2 === !!ans ? ' — למרות שהוא קלע פחות שלשות!' : '.'}`],
      };
    } },
    { level: 2, gen() {
      let base, c, nw;
      do { base = U.pick([8, 10, 12, 16, 20, 24, 25, 30, 40]); c = U.pick([10, 20, 25, 50, 75, 100, -10, -20, -25, -50]); nw = base * (1 + c / 100); } while (!Number.isInteger(nw));
      const name = U.pick(NAMES), up = c > 0, diff = nw - base;
      return {
        q: `בעונה שעברה ${name} קלע בממוצע ${base} נקודות למשחק. העונה הוא קולע בממוצע ${nw} נקודות למשחק. בכמה אחוזים ${up ? 'עלה' : 'ירד'} הממוצע שלו?`,
        type: 'number', answer: Math.abs(c),
        hint: `מחשבים את השינוי (בכמה נקודות ${up ? 'עלה' : 'ירד'}), ומחלקים אותו בערך <b>הישן</b> — של העונה שעברה. ואז כפול 100.`,
        steps: [`השינוי: $${Math.max(nw, base)} - ${Math.min(nw, base)} = ${Math.abs(diff)}$ נקודות.`, `מחלקים בערך הישן: $\\frac{${Math.abs(diff)}}{${base}} = ${n2(Math.abs(diff) / base)}$`, `כפול 100: ${up ? 'עלייה' : 'ירידה'} של $${Math.abs(c)}\\%$.`],
      };
    } },
    { level: 2, gen() {
      let n, A, d, x;
      do { n = U.R(3, 6); A = U.R(10, 24); d = U.RNZ(-3, 3); x = A + (n + 1) * d; } while (x < 0 || x > 45);
      const name = U.pick(NAMES);
      return {
        q: `אחרי ${n} משחקים, ${name} קולע בממוצע ${A} נקודות למשחק. במשחק הבא הוא קלע ${x} נקודות. מה הממוצע החדש שלו?`,
        type: 'number', answer: A + d,
        hint: `קודם מוצאים כמה נקודות היו לו בסך הכול: ממוצע כפול מספר משחקים. אחר כך מוסיפים את המשחק החדש ומחלקים ב־${n + 1}.`,
        steps: [`סך הנקודות ב־${n} המשחקים: $${A} \\cdot ${n} = ${A * n}$`, `מוסיפים את המשחק החדש: $${A * n} + ${x} = ${A * n + x}$`, `עכשיו יש ${n + 1} משחקים: $${A * n + x} \\div ${n + 1} = ${A + d}$`, `הממוצע ${d > 0 ? 'עלה' : 'ירד'} מ־${A} ל־${A + d}, כי המשחק החדש ${d > 0 ? 'גבוה' : 'נמוך'} מהממוצע.`],
      };
    } },
    { level: 2, gen() {
      const [A, B] = twoNames();
      let k1, k2, t1, t2;
      do { k1 = U.R(2, 5); k2 = U.R(2, 5); t1 = U.R(2, 6); t2 = U.R(2, 6); } while (k1 * t1 === k2 * t2 || (k1 !== k2 && Math.random() < 0.6 && (k1 * t1 > k2 * t2) === (k1 > k2)));
      const a1 = k1 * t1, a2 = k2 * t2, ans = k1 > k2 ? 0 : k1 < k2 ? 1 : 2;
      return {
        q: `ל־${A} היו ${a1} אסיסטים (מסירות לסל) ו־${t1} איבודי כדור. ל־${B} היו ${a2} אסיסטים ו־${t2} איבודים. למי יחס אסיסטים לאיבודים טוב יותר?`,
        type: 'choice', choices: [A, B, 'היחס שווה'], answer: ans,
        hint: 'לכל שחקן מחשבים: כמה אסיסטים יש לו על כל איבוד אחד? (מחלקים אסיסטים באיבודים.) יחס גבוה יותר = טוב יותר.',
        steps: [`${A}: $${a1} : ${t1} = ${k1} : 1$ — ${k1} אסיסטים על כל איבוד.`, `${B}: $${a2} : ${t2} = ${k2} : 1$ — ${k2} אסיסטים על כל איבוד.`,
          ans === 2 ? 'היחס שווה!' : `ליחס של <b>${ans ? B : A}</b> טוב יותר (${Math.max(k1, k2)} לעומת ${Math.min(k1, k2)}).`],
      };
    } },
    // ---------- רמה 3 ----------
    { level: 3, gen() {
      const name = U.pick(NAMES);
      let p2, p3;
      if (Math.random() < 0.25) { p2 = U.pick([45, 48, 51, 54, 57, 60]); p3 = p2 * 2 / 3; }
      else do { p2 = U.R(8, 12) * 5; p3 = U.R(5, 9) * 5; } while (2 * p2 === 3 * p3);
      const v2 = 2 * p2, v3 = 3 * p3, ans = v2 > v3 ? 0 : v3 > v2 ? 1 : 2;
      return {
        q: `${name} קולע $${p2}\\%$ מהזריקות לשתיים ו־$${p3}\\%$ מהשלשות. איזו זריקה מביאה לו יותר נקודות בממוצע?`,
        type: 'choice', choices: ['הזריקה לשתיים', 'השלשה', 'שתיהן שוות'], answer: ans,
        hint: 'דמיינו שהוא זורק 100 זריקות מכל סוג. כמה ייכנסו, וכמה נקודות כל קליעה שווה?',
        steps: [`100 זריקות לשתיים: נכנסות ${p2}, כל אחת שווה 2: $${p2} \\cdot 2 = ${v2}$ נקודות.`, `100 שלשות: נכנסות ${p3}, כל אחת שווה 3: $${p3} \\cdot 3 = ${v3}$ נקודות.`,
          `כלומר $${n2(v2 / 100)}$ נקודות לזריקה לשתיים, לעומת $${n2(v3 / 100)}$ לשלשה.`, ans === 2 ? 'שתיהן שוות בדיוק!' : `לכן <b>${ans ? 'השלשה' : 'הזריקה לשתיים'}</b> שווה יותר.`],
      };
    } },
    { level: 3, gen() {
      let n, A, d, x;
      do { n = U.R(3, 7); A = U.R(10, 22); d = U.R(1, 3); x = A + (n + 1) * d; } while (x > 45);
      const name = U.pick(NAMES), B = A + d;
      return {
        q: `אחרי ${n} משחקים, ${name} קולע בממוצע ${A} נקודות למשחק. כמה נקודות הוא צריך לקלוע במשחק הבא כדי שהממוצע שלו יעלה ל־${B}?`,
        type: 'number', answer: x,
        hint: `כמה נקודות צריכות להיות לו בסך הכול אחרי ${n + 1} משחקים כדי שהממוצע יהיה ${B}? וכמה יש לו כבר עכשיו?`,
        steps: [`עכשיו יש לו: $${A} \\cdot ${n} = ${A * n}$ נקודות.`, `כדי שהממוצע ב־${n + 1} משחקים יהיה ${B}, צריך בסך הכול: $${B} \\cdot ${n + 1} = ${B * (n + 1)}$`, `במשחק הבא: $${B * (n + 1)} - ${A * n} = ${x}$ נקודות.`, `בדיקה: $(${A * n} + ${x}) \\div ${n + 1} = ${B}$ ✔`],
      };
    } },
    { level: 3, gen() {
      let N, q, k, m, n;
      do { N = U.pick([10, 12, 16, 20, 25]); q = U.pick([50, 75, 80]); k = U.R(1, 4); m = q * N / 100 - k; n = N - k; } while (!Number.isInteger(m) || m < 1 || n <= m);
      const name = U.pick(NAMES);
      return {
        q: `${name} קלע ${m} מתוך ${n} זריקות עונשין. כמה עונשין ברצף (בלי אף החטאה) הוא צריך לקלוע עכשיו כדי שאחוז הקליעה שלו יגיע ל־$${q}\\%$?`,
        type: 'number', answer: k,
        hint: 'כל קליעה נוספת מוסיפה 1 גם לקליעות וגם לניסיונות. נסו: 1 קליעה, 2 קליעות... וחשבו כל פעם את האחוז.',
        steps: [`עכשיו: $\\frac{${m}}{${n}} = ${n2(m / n * 100)}\\%$`,
          ...Array.from({ length: k }, (_, j) => `אחרי ${j + 1} ${j ? 'קליעות' : 'קליעה'} נוספות: $\\frac{${m + j + 1}}{${n + j + 1}} = ${n2((m + j + 1) / (n + j + 1) * 100)}\\%$${j === k - 1 ? ' ✔' : ''}`),
          `הוא צריך ${k} ${k > 1 ? 'קליעות' : 'קליעה'} ברצף.`],
      };
    } },
  ],

  summary: [
    'אחוז קליעה = קליעות חלקי ניסיונות, כפול 100. למשל $\\frac{6}{10} = 60\\%$.',
    'נקודות: סל = 2, שלשה = 3, עונשין = 1. מחשבים כל סוג לבד ומחברים.',
    'ממוצע למשחק = סך הנקודות חלקי מספר המשחקים. משחק חדש: מוסיפים לסכום ומחלקים במספר המשחקים החדש.',
    'משווים שחקנים לפי אחוזים ויחסים, לא רק לפי כמויות — מי שזרק יותר, גם קלע יותר.',
    'שינוי באחוזים = השינוי חלקי הערך <b>הישן</b>, כפול 100.',
    'שווי זריקה בממוצע = אחוז קליעה (כשבר) כפול ערך הזריקה: $0.4 \\cdot 3 = 1.2$ גדול מ־$0.55 \\cdot 2 = 1.1$.',
  ],
});
})();
