/* יחידה: סטטיסטיקה — ארגון נתונים, דיאגרמות, שכיחות יחסית, טווח, ממוצע וחציון (כרך ב׳, פרקים 2–8) */
(() => {
const n2 = U.num;
const svgWrap = (w, h, inner) => `<svg viewBox="0 0 ${w} ${h}" width="100%" style="direction:ltr;max-width:${w}px;display:block;margin:0 auto" dir="ltr">${inner}</svg>`;
const COLORS = ['#e8702a', '#2f6fdb', '#1f9d55', '#c2410c', '#8b5cf6', '#d64545'];
const sum = a => a.reduce((s, v) => s + v, 0);
const sorted = a => [...a].sort((x, y) => x - y);
const median = a => { const s = sorted(a), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
/** כל הערכים שמופיעים הכי הרבה פעמים ([] אם כולם מופיעים פעם אחת) */
const modes = a => { const c = {}; a.forEach(v => c[v] = (c[v] || 0) + 1); const m = Math.max(...Object.values(c)); return m < 2 ? [] : Object.keys(c).filter(k => c[k] === m).map(Number).sort((x, y) => x - y); };
const list = a => a.join(', ');
const texList = a => a.join(',\\ ');

/** דיאגרמת עמודות: labels (עברית), values. מחזיר מחרוזת SVG */
function barChart(labels, values, { W = 460, H = 230, unit = '' } = {}) {
  const max = Math.max(...values, 1), top = Math.ceil(max / 5) * 5 || 5, x0 = 40, y0 = H - 34, ph = y0 - 14;
  const cw = (W - x0 - 10) / labels.length;
  let r = '';
  for (let t = 0; t <= top; t += top / 5) {
    const y = y0 - t / top * ph;
    r += `<line x1="${x0}" y1="${y}" x2="${W - 10}" y2="${y}" style="stroke:var(--line)"/><text x="${x0 - 6}" y="${y + 4}" text-anchor="end" font-size="12" style="fill:var(--muted)">${n2(t)}</text>`;
  }
  labels.forEach((l, i) => {
    const h = values[i] / top * ph, x = x0 + i * cw + cw * 0.18, w = cw * 0.64;
    r += `<rect x="${x}" y="${y0 - h}" width="${w}" height="${h}" rx="4" style="fill:${COLORS[i % COLORS.length]}"/>`;
    r += `<text x="${x + w / 2}" y="${y0 - h - 5}" text-anchor="middle" font-size="13" font-weight="700" style="fill:var(--ink)">${values[i]}${unit}</text>`;
    r += `<text x="${x + w / 2}" y="${y0 + 18}" text-anchor="middle" font-size="13" style="fill:var(--ink)">${l}</text>`;
  });
  r += `<line x1="${x0}" y1="${y0}" x2="${W - 10}" y2="${y0}" style="stroke:var(--ink)"/>`;
  return svgWrap(W, H, r);
}

/** דיאגרמת עוגה */
function pieChart(labels, values, R = 95) {
  const tot = sum(values), cx = 120, cy = 110;
  let r = '', a0 = -Math.PI / 2, legend = '';
  if (!tot) return svgWrap(460, 220, `<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:var(--line)"/>`);
  labels.forEach((l, i) => {
    const f = values[i] / tot, a1 = a0 + f * 2 * Math.PI, c = COLORS[i % COLORS.length];
    if (f >= 0.999) r += `<circle cx="${cx}" cy="${cy}" r="${R}" style="fill:${c}"/>`;
    else if (f > 0) {
      const p = a => [cx + R * Math.cos(a), cy + R * Math.sin(a)].map(v => v.toFixed(2)).join(' ');
      r += `<path d="M ${cx} ${cy} L ${p(a0)} A ${R} ${R} 0 ${f > 0.5 ? 1 : 0} 1 ${p(a1)} Z" style="fill:${c};stroke:var(--panel);stroke-width:2"/>`;
      if (f > 0.06) { const m = (a0 + a1) / 2; r += `<text x="${cx + R * 0.62 * Math.cos(m)}" y="${cy + R * 0.62 * Math.sin(m) + 5}" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">${Math.round(f * 360)}°</text>`; }
    }
    legend += `<rect x="260" y="${30 + i * 28}" width="16" height="16" rx="3" style="fill:${c}"/><text x="284" y="${43 + i * 28}" font-size="14" style="fill:var(--ink)">${l}</text><text x="450" y="${43 + i * 28}" text-anchor="end" font-size="14" font-weight="700" style="fill:var(--ink)">${n2(f * 100)}%</text>`;
    a0 = a1;
  });
  return svgWrap(460, 220, r + legend);
}

/** פיקטוגרמה: כל כדור = per פריטים, חצי כדור לשארית */
function pictogram(labels, values, per = 2) {
  let r = '';
  labels.forEach((l, i) => {
    const y = 20 + i * 40;
    r += `<text x="80" y="${y + 6}" text-anchor="end" font-size="14" style="fill:var(--ink)">${l}</text>`;
    const full = Math.floor(values[i] / per), half = values[i] % per;
    for (let k = 0; k < full; k++) r += `<circle cx="${100 + k * 30}" cy="${y}" r="12" style="fill:var(--accent)"/><path d="M ${88 + k * 30} ${y} H ${112 + k * 30} M ${100 + k * 30} ${y - 12} V ${y + 12}" style="stroke:#7a3410;stroke-width:1.5"/>`;
    if (half) r += `<path d="M ${100 + full * 30} ${y - 12} A 12 12 0 0 0 ${100 + full * 30} ${y + 12} Z" style="fill:var(--accent)"/>`;
  });
  return svgWrap(460, labels.length * 40, r) + `<p class="muted" style="text-align:center;margin:4px 0 0">כל כדור = ${per} תלמידים · חצי כדור = תלמיד אחד</p>`;
}

registerChapter('statistics', {
  intro: `
    <div class="idea"><b>משתנה כמותי או איכותי?</b><b>כמותי</b> — התשובה היא מספר: נקודות במשחק, גובה, גיל.
      <br><b>איכותי</b> — התשובה היא מילה או סוג: הספורט האהוב, העמדה במגרש, צבע החולצה.</div>
    <div class="idea"><b>טבלת שכיחות</b><b>שכיחות</b> = כמה פעמים ערך מופיע. <b>השכיח</b> = הערך שמופיע הכי הרבה פעמים.
      <br><b>שכיחות יחסית</b> = שכיחות ÷ סך הכול. 6 מתוך 24 תלמידים: $\\frac{6}{24} = \\frac{1}{4} = 25\\%$.</div>
    <div class="idea"><b>דיאגרמות</b><b>עמודות</b> — גובה העמודה = השכיחות. <b>פיקטוגרמה</b> — ציורים, כל ציור שווה כמה פריטים.
      <br><b>עוגה</b> — כל "פרוסה" היא חלק מהשלם. הזווית = שכיחות יחסית × $360°$. למשל $25\\%$ ← $90°$.</div>
    <div class="idea"><b>טווח, ממוצע וחציון</b>נקודות של שחקן ב־5 משחקים: $8,\\ 12,\\ 10,\\ 20,\\ 10$
      <br><b>טווח</b> = הגדול פחות הקטן: $20 - 8 = 12$.
      <br><b>ממוצע</b> = סכום ÷ כמות: $\\frac{60}{5} = 12$.
      <br><b>חציון</b> = האמצעי <b>אחרי שמסדרים</b>: $8,\\ 10,\\ \\underline{10},\\ 12,\\ 20$ ← החציון 10.</div>
    <div class="note"><b>מספר זוגי של נתונים?</b> אין אמצעי אחד, אז החציון הוא הממוצע של שני האמצעיים: $4,\\ \\underline{6},\\ \\underline{8},\\ 10$ ← $\\frac{6+8}{2} = 7$.
      <br>ועוד טיפ: משחק אחד חריג (למשל 40 נקודות) מזיז את הממוצע הרבה, אבל את החציון כמעט לא.</div>`,

  example: {
    question: 'הנקודות שקלע איתי ב־7 משחקים: $12,\\ 8,\\ 15,\\ 8,\\ 20,\\ 10,\\ 11$. מצאו את הטווח, השכיח, הממוצע והחציון.',
    steps: [
      'קודם כול מסדרים מהקטן לגדול: $8,\\ 8,\\ 10,\\ 11,\\ 12,\\ 15,\\ 20$. זה יעזור בכל השאלות.',
      '<b>טווח</b>: הגדול פחות הקטן: $20 - 8 = 12$.',
      '<b>שכיח</b>: הערך שמופיע הכי הרבה. 8 מופיע פעמיים, וכל השאר פעם אחת. השכיח הוא 8.',
      '<b>ממוצע</b> — שלב 1: מחברים את הכול: $8 + 8 + 10 + 11 + 12 + 15 + 20 = 84$.',
      'שלב 2: מחלקים במספר המשחקים: $84 \\div 7 = 12$. הממוצע: 12 נקודות למשחק.',
      '<b>חציון</b>: יש 7 נתונים, אז האמצעי הוא הרביעי (3 לפניו ו־3 אחריו): $8,\\ 8,\\ 10,\\ \\underline{11},\\ 12,\\ 15,\\ 20$. החציון 11.',
      'שים לב: הממוצע (12) והחציון (11) קרובים אבל לא שווים. ממוצע וחציון הם שני "מדדי מרכז" שונים.',
    ],
  },

  tools: [
    {
      title: 'הסטטיסטיקה של השחקן',
      desc: 'משתנה כמותי: נקודות בכל משחק. גררו עמודה למעלה או למטה כדי לשנות את הנקודות. הקו הכתום = ממוצע, הקו הכחול = חציון. נסו לתת למשחק אחד 40 נקודות — מי זז יותר?',
      mount(el) {
        let vals = [12, 8, 15, 8, 20, 10, 11];
        const W = 500, H = 256, x0 = 34, y0 = 210, ph = 190, MAX = 40;
        el.insertAdjacentHTML('beforeend', `<div class="row" style="justify-content:center"><button class="btn ghost add">+ משחק</button><button class="btn ghost del">− משחק</button><button class="btn ghost rnd">🎲 נתונים חדשים</button></div>`);
        const box = document.createElement('div');
        box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" width="100%" style="direction:ltr;max-width:${W}px;display:block;margin:0 auto;touch-action:none;cursor:ns-resize" dir="ltr"><g></g></svg>`;
        const out = document.createElement('div'); out.className = 'readout';
        el.append(box, out);
        const S = box.querySelector('svg'), G = S.querySelector('g');
        const Y = v => y0 - v / MAX * ph;
        const draw = () => {
          const n = vals.length, cw = (W - x0 - 6) / n, mean = sum(vals) / n, med = median(vals), mo = modes(vals);
          let r = '';
          for (let t = 0; t <= MAX; t += 10) r += `<line x1="${x0}" y1="${Y(t)}" x2="${W - 6}" y2="${Y(t)}" style="stroke:var(--line)"/><text x="${x0 - 5}" y="${Y(t) + 4}" text-anchor="end" font-size="11" style="fill:var(--muted)">${t}</text>`;
          vals.forEach((v, i) => {
            const x = x0 + i * cw + cw * 0.15, w = cw * 0.7;
            r += `<rect x="${x}" y="${Y(v)}" width="${w}" height="${y0 - Y(v)}" rx="4" style="fill:${mo.includes(v) ? 'var(--good)' : 'var(--blue)'};opacity:.85"/>`;
            r += `<text x="${x + w / 2}" y="${Y(v) - 5}" text-anchor="middle" font-size="13" font-weight="700" style="fill:var(--ink)">${v}</text>`;
            r += `<text x="${x + w / 2}" y="${y0 + 16}" text-anchor="middle" font-size="11" style="fill:var(--muted)">${i + 1}</text>`;
          });
          r += `<line x1="${x0}" y1="${Y(mean)}" x2="${W - 6}" y2="${Y(mean)}" style="stroke:var(--accent);stroke-width:3;stroke-dasharray:8 5"/>`;
          r += `<line x1="${x0}" y1="${Y(med)}" x2="${W - 6}" y2="${Y(med)}" style="stroke:#2f6fdb;stroke-width:3;stroke-dasharray:2 4"/>`;
          r += `<text x="${(x0 + W) / 2}" y="${y0 + 34}" text-anchor="middle" font-size="12" style="fill:var(--muted)">מספר המשחק</text>`;
          G.innerHTML = r;
          const s = sorted(vals), k = s.length;
          const mid = k % 2 ? [(k - 1) / 2] : [k / 2 - 1, k / 2];
          out.innerHTML = `מסודר: <span dir="ltr">${s.map((v, i) => mid.includes(i) ? `<b style="color:#2f6fdb;text-decoration:underline">${v}</b>` : v).join(', ')}</span>
            <br><span style="color:var(--accent)">■</span> ממוצע: $\\frac{${sum(vals)}}{${k}} = ${n2(mean)}$ &nbsp;·&nbsp; <span style="color:#2f6fdb">■</span> חציון: $${n2(med)}$
            <br><span style="color:var(--good)">■</span> שכיח: ${mo.length ? `$${mo.join(',\\ ')}$` : 'אין (כל ערך מופיע פעם אחת)'} &nbsp;·&nbsp; טווח: $${s[k - 1]} - ${s[0]} = ${s[k - 1] - s[0]}$`;
          U.math(out);
        };
        let drag = -1;
        const pick = e => {
          const b = S.getBoundingClientRect(), x = (e.clientX - b.left) / b.width * W, y = (e.clientY - b.top) / b.height * H;
          const i = Math.floor((x - x0) / ((W - x0 - 6) / vals.length));
          return { i, v: Math.max(0, Math.min(MAX, Math.round((y0 - y) / ph * MAX))) };
        };
        S.addEventListener('pointerdown', e => { const p = pick(e); if (p.i < 0 || p.i >= vals.length) return; drag = p.i; S.setPointerCapture(e.pointerId); vals[drag] = p.v; draw(); });
        S.addEventListener('pointermove', e => { if (drag < 0) return; vals[drag] = pick(e).v; draw(); });
        S.addEventListener('pointerup', () => { drag = -1; });
        el.querySelector('.add').onclick = () => { if (vals.length < 12) { vals.push(U.R(5, 25)); draw(); } };
        el.querySelector('.del').onclick = () => { if (vals.length > 2) { vals.pop(); draw(); } };
        el.querySelector('.rnd').onclick = () => { vals = Array.from({ length: U.R(5, 9) }, () => U.R(4, 26)); draw(); };
        draw();
      },
    },
    {
      title: 'סקר בכיתה: טבלת שכיחות ודיאגרמות',
      desc: 'משתנה איכותי: "מה הספורט האהוב עליך?". הוסיפו והורידו תלמידים בכפתורים, ובחרו איך להציג את הנתונים. הכול מתעדכן ביחד.',
      mount(el) {
        const labels = ['כדורסל', 'כדורגל', 'טניס', 'שחייה', 'אחר'], vals = [9, 7, 3, 4, 1];
        let kind = 'bar';
        el.insertAdjacentHTML('beforeend', `<table><thead><tr><th>ספורט</th><th>שכיחות</th><th>שכיחות יחסית</th><th></th></tr></thead><tbody></tbody><tfoot></tfoot></table>
          <div class="row" style="justify-content:center">${[['bar', 'עמודות'], ['pie', 'עוגה'], ['pict', 'פיקטוגרמה']].map(([k, t]) => `<button class="btn ghost kind" data-k="${k}">${t}</button>`).join('')}</div><div class="chart"></div>`);
        const tb = el.querySelector('tbody'), tf = el.querySelector('tfoot'), chart = el.querySelector('.chart');
        const draw = () => {
          const tot = sum(vals), mx = Math.max(...vals);
          tb.innerHTML = labels.map((l, i) => `<tr><td><span style="color:${COLORS[i]}">■</span> ${l}${vals[i] === mx && mx > 0 ? ' <b>(שכיח)</b>' : ''}</td><td>${vals[i]}</td>
            <td>${tot ? `$\\frac{${vals[i]}}{${tot}} = ${n2(vals[i] / tot * 100)}\\%$` : '—'}</td>
            <td><button class="btn ghost pm" data-i="${i}" data-d="1" aria-label="הוסף">+</button> <button class="btn ghost pm" data-i="${i}" data-d="-1" aria-label="הורד">−</button></td></tr>`).join('');
          tf.innerHTML = `<tr><th>סך הכול</th><th>${tot}</th><th>${tot ? '100%' : ''}</th><th></th></tr>`;
          tb.querySelectorAll('.pm').forEach(b => b.onclick = () => { const i = +b.dataset.i; vals[i] = Math.max(0, Math.min(16, vals[i] + +b.dataset.d)); draw(); });
          el.querySelectorAll('.kind').forEach(b => { b.style.borderColor = b.dataset.k === kind ? 'var(--accent)' : ''; b.style.fontWeight = b.dataset.k === kind ? 700 : 400; });
          chart.innerHTML = kind === 'bar' ? barChart(labels, vals) : kind === 'pie' ? pieChart(labels, vals) : pictogram(labels, vals);
          U.math(tb);
        };
        el.querySelectorAll('.kind').forEach(b => b.onclick = () => { kind = b.dataset.k; draw(); });
        draw();
      },
    },
  ],

  exercises: [
    // ---------- רמה 1 ----------
    { level: 1, gen() {
      const m = U.R(4, 20);
      let rest = U.shuffle(Array.from({ length: 20 }, (_, i) => i + 3).filter(v => v !== m)).slice(0, U.R(3, 5));
      const twice = Math.random() < 0.5 ? [rest[0]] : [];
      const data = U.shuffle([m, m, m, ...rest, ...twice]);
      return {
        q: `מספר הנקודות של שחקן במשחקים: $${texList(data)}$. מה השכיח?`,
        type: 'number', answer: m,
        mistakes: [{ v: 3, why: 'כתבת <b>כמה פעמים</b> המספר מופיע. השכיח הוא המספר עצמו.' }, { v: Math.max(...data), why: 'כתבת את המספר הגדול ביותר. השכיח הוא המספר שמופיע הכי הרבה <b>פעמים</b>.' }, { v: median(data), why: 'כתבת את המספר האמצעי (החציון). השכיח הוא המספר שמופיע הכי הרבה <b>פעמים</b>.' }],
        hint: 'השכיח = הערך שמופיע הכי הרבה פעמים. ספרו כמה פעמים מופיע כל מספר.',
        steps: [`מסדרים: $${texList(sorted(data))}$`, `$${m}$ מופיע 3 פעמים${twice.length ? `, $${rest[0]}$ פעמיים` : ''}, וכל השאר פעם אחת.`, `השכיח: $${m}$.`],
      };
    } },
    { level: 1, gen() {
      const data = Array.from({ length: U.R(5, 7) }, () => U.R(2, 30)), s = sorted(data);
      return {
        q: `גובה הקפיצה (בס״מ) של שחקנים באימון: $${texList(data)}$. מה טווח הנתונים?`,
        type: 'number', answer: s[s.length - 1] - s[0],
        mistakes: [{ v: s[s.length - 1], why: `$${s[s.length - 1]}$ הוא הנתון הגדול ביותר. הטווח הוא <b>המרחק</b> בינו לבין הקטן ביותר.` }, { v: s[s.length - 1] + s[0], why: 'חיברת את הגדול ביותר והקטן ביותר. בטווח מחסרים.' }, { v: Math.abs(data[data.length - 1] - data[0]), why: 'החסרת בין הראשון לאחרון ברשימה. צריך את <b>הגדול ביותר</b> ואת <b>הקטן ביותר</b> — הם לא תמיד בקצוות.' }],
        hint: 'טווח = הערך הגדול ביותר פחות הערך הקטן ביותר.',
        steps: [`הגדול ביותר: $${s[s.length - 1]}$. הקטן ביותר: $${s[0]}$.`, `טווח: $${s[s.length - 1]} - ${s[0]} = ${s[s.length - 1] - s[0]}$.`],
      };
    } },
    { level: 1, gen() {
      const bank = [['מספר הנקודות במשחק', 0], ['העמדה במגרש (רכז, סנטר...)', 1], ['גובה השחקן', 0], ['צבע החולצה', 1], ['מספר האחים והאחיות', 0], ['הקבוצה האהודה', 1], ['גיל', 0], ['עיר המגורים', 1], ['מספר הזריקות שנקלעו', 0], ['סוג הנעליים', 1], ['זמן ריצה של 100 מטר', 0], ['המקצוע האהוב בבית הספר', 1]];
      const [v, a] = U.pick(bank);
      return {
        q: `המשתנה "<b>${v}</b>" הוא משתנה...`,
        type: 'choice', choices: ['כמותי (מספר)', 'איכותי (מילה / סוג)'], answer: a,
        mistakes: [0, 1].map(v => ({ v, why: 'דמיין תשובה של ילד אחד לשאלה הזו. האם התשובה שלו היא מילה או מספר?' })),
        hint: 'שאלו את עצמכם: האם התשובה היא מספר שאפשר לחשב איתו ממוצע? אם כן — כמותי.',
        steps: [a ? `התשובות הן מילים או סוגים, לא מספרים ← <b>איכותי</b>.` : `התשובות הן מספרים ← <b>כמותי</b>.`],
      };
    } },
    { level: 1, gen() {
      const labels = U.shuffle(['רכז', 'קלע', 'פורוורד', 'סנטר']), vals = labels.map(() => U.R(1, 12)), i = U.R(0, 3);
      return {
        q: `בדיאגרמה: כמה שחקנים בליגה הצעירה משחקים בעמדת <b>${labels[i]}</b>?`,
        type: 'number', answer: vals[i],
        mount(el) { el.innerHTML = barChart(labels, vals); },
        hint: `מוצאים את העמודה של "${labels[i]}" ובודקים את הגובה שלה (המספר מעליה או לפי הקווים).`,
        steps: [`העמודה של ${labels[i]} מגיעה עד $${vals[i]}$.`, `התשובה: $${vals[i]}$ שחקנים.`],
      };
    } },
    // ---------- רמה 2 ----------
    { level: 2, gen() {
      let data, n, mean;
      do {
        n = U.R(4, 6); mean = U.R(8, 20);
        data = Array.from({ length: n - 1 }, () => U.R(mean - 7, mean + 7));
        data.push(mean * n - sum(data));
      } while (data[n - 1] < 0 || data[n - 1] > 40);
      data = U.shuffle(data);
      return {
        q: `נקודות של שחקנית ב־${n} משחקים: $${texList(data)}$. מה הממוצע שלה למשחק?`,
        type: 'number', answer: mean,
        mistakes: [{ v: sum(data), why: `$${sum(data)}$ הוא הסכום. שכחת את הצעד השני: לחלק במספר המשחקים.` }, { v: median(data), why: 'כתבת את הנתון האמצעי — זה החציון. בממוצע מחברים את כל הנתונים ומחלקים במספרם.' }],
        hint: `ממוצע = סכום כל הנתונים ÷ מספר הנתונים (כאן ${n}).`,
        steps: [`סכום: $${data.join(' + ')} = ${sum(data)}$`, `מחלקים ב־${n}: $${sum(data)} \\div ${n} = ${mean}$`],
      };
    } },
    { level: 2, gen() {
      const n = U.pick([5, 7]), data = Array.from({ length: n }, () => U.R(1, 30)), s = sorted(data), med = s[(n - 1) / 2];
      return {
        q: `דקות משחק של שחקן ב־${n} משחקים: $${texList(data)}$. מה החציון?`,
        type: 'number', answer: med,
        mistakes: [{ v: data[(n - 1) / 2], why: `$${data[(n - 1) / 2]}$ נמצא באמצע הרשימה כמו שהיא כתובה. שכחת <b>לסדר</b> את הנתונים מהקטן לגדול קודם.` }, { v: sum(data) / n, why: 'חישבת ממוצע (סכום חלקי מספר הנתונים). החציון הוא הנתון שנמצא באמצע אחרי שמסדרים.' }],
        hint: 'קודם מסדרים מהקטן לגדול! אחר כך מחפשים את הנתון שנמצא בדיוק באמצע.',
        steps: [`מסדרים: $${texList(s)}$`, `יש ${n} נתונים, אז האמצעי הוא במקום ה־${(n + 1) / 2} (${(n - 1) / 2} לפניו ו־${(n - 1) / 2} אחריו).`, `החציון: $${med}$.`],
      };
    } },
    { level: 2, gen() {
      const tot = U.pick([20, 25, 50, 10]), labels = ['כדורסל', 'כדורגל', 'שחייה', 'אחר'];
      let vals; do { const a = U.R(1, tot - 3), b = U.R(1, tot - a - 2), c = U.R(1, tot - a - b - 1); vals = [a, b, c, tot - a - b - c]; } while (vals.some(v => v < 1));
      const i = U.R(0, 3);
      return {
        q: `טבלת שכיחות של הספורט האהוב בכיתה:<table style="margin:8px auto"><tr>${labels.map(l => `<th style="padding:4px 10px">${l}</th>`).join('')}</tr><tr>${vals.map(v => `<td style="padding:4px 10px;text-align:center">${v}</td>`).join('')}</tr></table>מה השכיחות היחסית של <b>${labels[i]}</b>, באחוזים?`,
        type: 'number', answer: vals[i] / tot * 100,
        mistakes: [{ v: vals[i], why: `$${vals[i]}$ הוא מספר התלמידים (השכיחות). שכיחות <b>יחסית</b> היא החלק שלהם מתוך כל הכיתה, באחוזים.` }],
        hint: 'שכיחות יחסית = שכיחות ÷ סך הכול. קודם מחברים את כל התלמידים. ואחר כך כופלים ב־100 כדי לקבל אחוזים.',
        steps: [`סך הכול: $${vals.join(' + ')} = ${tot}$`, `$\\frac{${vals[i]}}{${tot}}$`, `$\\frac{${vals[i]}}{${tot}} \\cdot 100 = ${n2(vals[i] / tot * 100)}\\%$`],
      };
    } },
    { level: 2, gen() {
      const tot = U.pick([12, 18, 20, 24, 30, 36, 40, 60]), k = U.R(1, tot - 1), ang = 360 * k / tot;
      return {
        q: `בסקר השתתפו ${tot} אוהדים, ו־${k} מהם בחרו בקבוצה הכחולה. בדיאגרמת עוגה, מה גודל הזווית (במעלות) של הפרוסה של הקבוצה הכחולה?`,
        type: 'number', answer: ang,
        mistakes: [{ v: k / tot * 100, why: 'חישבת אחוזים (מתוך 100). בעוגה שלמה יש $360°$, לא 100.' }],
        hint: 'כל העוגה היא $360°$. הפרוסה היא החלק $\\frac{' + k + '}{' + tot + '}$ מהעוגה.',
        steps: [`החלק של הקבוצה הכחולה: $\\frac{${k}}{${tot}}$`, `$\\frac{${k}}{${tot}} \\cdot 360° = ${k} \\cdot ${360 / tot}° = ${ang}°$`],
      };
    } },
    // ---------- רמה 3 ----------
    { level: 3, gen() {
      const n = U.pick([4, 6, 8]), data = Array.from({ length: n }, () => U.R(2, 30)), s = sorted(data), a = s[n / 2 - 1], b = s[n / 2];
      return {
        q: `ריבאונדים ב־${n} משחקים: $${texList(data)}$. מה החציון?`,
        type: 'number', answer: (a + b) / 2,
        mistakes: [{ v: (data[n / 2 - 1] + data[n / 2]) / 2, why: 'לקחת את שני האמצעיים מהרשימה כמו שהיא כתובה. שכחת <b>לסדר</b> את הנתונים מהקטן לגדול קודם.' }, ...[a, b].map(v => ({ v, why: `יש ${n} נתונים — מספר זוגי, אז אין נתון אמצעי אחד. מה עושים עם <b>שני</b> האמצעיים?` })), { v: sum(data) / n, why: 'חישבת ממוצע של כל הנתונים. בחציון מסתכלים רק על אמצע הרשימה המסודרת.' }],
        hint: `מספר <b>זוגי</b> של נתונים: אין אמצעי אחד. מסדרים, לוקחים את שני האמצעיים ומחשבים את הממוצע שלהם.`,
        steps: [`מסדרים: $${texList(s)}$`, `שני האמצעיים (מקומות ${n / 2} ו־${n / 2 + 1}): $${a}$ ו־$${b}$.`, `החציון: $\\frac{${a} + ${b}}{2} = ${n2((a + b) / 2)}$`],
      };
    } },
    { level: 3, gen() {
      let known, n, mean, miss;
      do { n = U.R(4, 6); mean = U.R(10, 20); known = Array.from({ length: n - 1 }, () => U.R(mean - 8, mean + 8)); miss = mean * n - sum(known); } while (miss < 0 || miss > 40);
      return {
        q: `הממוצע של שחקן ב־${n} משחקים הוא ${mean} נקודות. בחלק מהמשחקים הוא קלע: $${texList(known)}$. כמה נקודות קלע במשחק החסר?`,
        type: 'number', answer: miss,
        mistakes: [{ v: mean * n, why: `$${mean * n}$ הוא סכום הנקודות ב<b>כל</b> ${n} המשחקים. כמה מזה נשאר למשחק החסר?` }, { v: sum(known), why: `$${sum(known)}$ הוא סכום הנקודות במשחקים הידועים. כמה חסר כדי להגיע לסכום של כל ${n} המשחקים?` }],
        hint: `אם הממוצע הוא ${mean} ב־${n} משחקים, אז <b>הסכום</b> של כל הנקודות הוא $${mean} \\cdot ${n}$.`,
        steps: [`סכום כל הנקודות: $${mean} \\cdot ${n} = ${mean * n}$`, `סכום הנקודות הידועות: $${known.join(' + ')} = ${sum(known)}$`, `במשחק החסר: $${mean * n} - ${sum(known)} = ${miss}$`],
      };
    } },
    { level: 3, gen() {
      let n, m1, m2, need;
      do { n = U.R(3, 6); m1 = U.R(8, 18); m2 = m1 + U.R(1, 4); need = m2 * (n + 1) - m1 * n; } while (need > 40);
      return {
        q: `אחרי ${n} משחקים, הממוצע של מאיה הוא ${m1} נקודות למשחק. כמה נקודות היא צריכה לקלוע במשחק הבא כדי שהממוצע יעלה ל־${m2}?`,
        type: 'number', answer: need,
        mistakes: [{ v: m2, why: `אם היא תקלע בדיוק ${m2}, הממוצע לא יגיע ל־${m2}: ${n} המשחקים הקודמים (ממוצע ${m1}) מושכים אותו למטה.` }, { v: (m2 - m1) * n, why: `שכחת שאחרי המשחק הבא יהיו ${n + 1} משחקים, לא ${n}.` }, { v: m2 * (n + 1), why: `$${m2 * (n + 1)}$ הוא הסכום הדרוש אחרי ${n + 1} משחקים. כמה מזה כבר יש לה?` }],
        hint: `חשבו את סכום הנקודות עכשיו ($${m1} \\cdot ${n}$), ואת הסכום שצריך אחרי ${n + 1} משחקים ($${m2} \\cdot ${n + 1}$).`,
        steps: [`הסכום עכשיו: $${m1} \\cdot ${n} = ${m1 * n}$`, `הסכום הדרוש אחרי ${n + 1} משחקים: $${m2} \\cdot ${n + 1} = ${m2 * (n + 1)}$`, `במשחק הבא: $${m2 * (n + 1)} - ${m1 * n} = ${need}$ נקודות.`],
      };
    } },
    { level: 3, gen() {
      const v = [0, 1, 2, 3, 4]; let f, tot, s;
      do { f = v.map(() => U.R(0, 6)); tot = sum(f); s = sum(v.map((x, i) => x * f[i])); } while (tot < 6 || s % tot);
      return {
        q: `טבלת שכיחות: כמה שלשות קלע שחקן בכל משחק בעונה.<table style="margin:8px auto"><tr><th style="padding:4px 10px">שלשות במשחק</th>${v.map(x => `<td style="padding:4px 10px;text-align:center">${x}</td>`).join('')}</tr><tr><th style="padding:4px 10px">מספר משחקים</th>${f.map(x => `<td style="padding:4px 10px;text-align:center">${x}</td>`).join('')}</tr></table>מה הממוצע של השלשות למשחק?`,
        type: 'number', answer: s / tot,
        mistakes: [{ v: 2, why: 'חישבת ממוצע של השורה העליונה בלבד ($0, 1, 2, 3, 4$). אבל כל ערך מופיע מספר שונה של פעמים!' }, { v: s / 5, why: 'חילקת ב־5 (מספר העמודות). צריך לחלק במספר <b>המשחקים</b> הכולל.' }, { v: s, why: `$${s}$ הוא סך כל השלשות. שכחת לחלק במספר המשחקים.` }],
        hint: 'כל ערך מופיע כמה פעמים! סכום = כל ערך כפול השכיחות שלו. ואז מחלקים במספר המשחקים הכולל.',
        steps: [`מספר המשחקים: $${f.join(' + ')} = ${tot}$`, `סכום השלשות: $${v.map((x, i) => `${x} \\cdot ${f[i]}`).join(' + ')} = ${s}$`, `ממוצע: $${s} \\div ${tot} = ${s / tot}$`],
      };
    } },
  ],

  summary: [
    'משתנה <b>כמותי</b> = מספר (נקודות, גובה). משתנה <b>איכותי</b> = מילה או סוג (ספורט, עמדה).',
    'שכיחות = כמה פעמים. השכיח = מה שמופיע הכי הרבה. שכיחות יחסית = שכיחות ÷ סך הכול.',
    'בדיאגרמת עוגה: זווית = שכיחות יחסית × $360°$.',
    'טווח = הגדול פחות הקטן.',
    'ממוצע = סכום ÷ כמות. חציון = האמצעי אחרי שמסדרים (בזוגי: ממוצע שני האמצעיים).',
  ],
});
})();
