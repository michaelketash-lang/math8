/* יחידה: גליל (פרק 22 בספר). בתרגילים π = 3.14 */
(() => {
  const PI = 3.14;
  const svg = (w, h, inner) => `<svg viewBox="0 0 ${w.toFixed(0)} ${h.toFixed(0)}" style="width:100%;max-width:${Math.max(w, 260).toFixed(0)}px;display:block;margin:6px auto;color:var(--ink)" dir="ltr" font-family="Rubik, sans-serif">${inner}</svg>`;
  const txt = (x, y, s, col = 'currentColor', size = 15) =>
    `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" text-anchor="middle" dominant-baseline="middle" fill="${col}" font-size="${size}" font-weight="700">${s}</text>`;
  const ell = (cx, cy, rx, ry, col, op) => `<ellipse cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" rx="${rx.toFixed(1)}" ry="${Math.max(ry, 0.1).toFixed(1)}" fill="${col}" fill-opacity="${op}" stroke="${col}" stroke-width="2"/>`;
  /** ציור גליל פשוט (לתרגילים ולמשחק) */
  function can(r, h, u, ox, oy, col = '#2f6fdb', lab = true) {
    const rx = r * u, ry = r * u * 0.3, H = h * u;
    let g = `<path d="M${ox - rx} ${oy} V${oy + H} A${rx} ${ry} 0 0 0 ${ox + rx} ${oy + H} V${oy}" fill="${col}" fill-opacity=".2" stroke="${col}" stroke-width="2"/>`;
    g += ell(ox, oy, rx, ry, col, 0.35);
    g += `<path d="M${ox - rx} ${oy + H} A${rx} ${ry} 0 0 1 ${ox + rx} ${oy + H}" fill="none" stroke="${col}" stroke-width="1.5" stroke-dasharray="4 4" opacity=".6"/>`;
    if (lab) g += `<line x1="${ox}" y1="${oy}" x2="${ox + rx}" y2="${oy}" stroke="#e8702a" stroke-width="2"/>` + txt(ox + rx / 2, oy - 10, 'r', '#e8702a') + txt(ox + rx + 14, oy + H / 2, 'h', '#e8702a');
    return g;
  }
  const canSvg = (el, r, h, lr, lh) => {
    const u = Math.min(22, 150 / h, 70 / r), W = 2 * r * u + 90, Ht = h * u + 2 * 0.3 * r * u + 30;
    let g = can(r, h, u, W / 2, 15 + 0.3 * r * u, '#2f6fdb', false);
    const ox = W / 2, oy = 15 + 0.3 * r * u;
    g += `<line x1="${ox}" y1="${oy}" x2="${ox + r * u}" y2="${oy}" stroke="#e8702a" stroke-width="2"/>` + txt(ox + r * u / 2, oy - 11, lr, '#e8702a') + txt(ox + r * u + 26, oy + h * u / 2, lh, '#e8702a');
    el.innerHTML = svg(W, Ht, g);
  };
  const tolFor = a => Math.max(0.05, Math.abs(a) * 0.003); // מקבל גם תשובה עם π של מחשבון או עיגול קטן
  const n = U.num;
  const PI_NOTE = '(השתמשו ב־$\\pi = 3.14$)';

  registerChapter('cylinder', {
    intro: `
      <p><b>גליל</b> הוא גוף כמו פחית שתייה, צינור, או קופסת כדורי טניס.</p>
      <div class="idea"><b>החלקים של הגליל</b>שני <b>בסיסים</b> — עיגולים שווים ומקבילים (למעלה ולמטה).
        <br>ה<b>מעטפת</b> — המשטח המעוגל שמסביב. $r$ = רדיוס הבסיס, $h$ = הגובה (המרחק בין הבסיסים).</div>
      <div class="idea"><b>פריסה</b>אם גוזרים את המעטפת ופותחים אותה — מקבלים <b>מלבן</b>!
        <br>הגובה של המלבן הוא $h$, והרוחב שלו הוא בדיוק <b>היקף הבסיס</b>: $2\\pi r$ (כי המלבן היה מלופף מסביב לעיגול).
        <br>הפריסה של גליל = מלבן אחד + שני עיגולים.</div>
      <div class="formula">שטח מעטפת $= 2\\pi r \\cdot h$</div>
      <div class="formula">שטח פנים $= 2\\pi r h + 2\\pi r^2$</div>
      <div class="idea"><b>שטח פנים</b>כל השטח של הגליל מבחוץ: המעטפת <b>ועוד שני הבסיסים</b> (כל בסיס $\\pi r^2$).</div>
      <div class="formula">נפח $= \\pi r^2 \\cdot h$</div>
      <div class="idea"><b>נפח</b>כמה הגליל מכיל. שטח הבסיס כפול הגובה — כמו ערימה של מטבעות: כל שכבה היא עיגול, ויש $h$ שכבות.</div>
      <div class="note"><b>שימו לב</b><br>בתרגילים משתמשים ב־$\\pi = 3.14$.
        <br>אם נותנים <b>קוטר</b> — קודם מחלקים ב־2 כדי לקבל רדיוס!
        <br>שטח נמדד ביחידות ריבועיות (סמ"ר), נפח ביחידות מעוקבות (סמ"ק).</div>`,

    example: {
      question: 'פחית שתייה היא גליל עם רדיוס $r = 4$ ס"מ וגובה $h = 10$ ס"מ. חשבו (עם $\\pi = 3.14$): א. שטח המעטפת. ב. שטח הפנים. ג. הנפח.',
      steps: [
        'קודם היקף הבסיס (זה הרוחב של המלבן בפריסה): $2\\pi r = 2 \\cdot 3.14 \\cdot 4 = 25.12$ ס"מ.',
        'א. שטח המעטפת = שטח המלבן = רוחב כפול גובה: $25.12 \\cdot 10 = 251.2$ סמ"ר.',
        'שטח של בסיס אחד (עיגול): $\\pi r^2 = 3.14 \\cdot 4^2 = 3.14 \\cdot 16 = 50.24$ סמ"ר.',
        'ב. שטח הפנים = מעטפת + שני בסיסים: $251.2 + 2 \\cdot 50.24 = 251.2 + 100.48 = 351.68$ סמ"ר.',
        'ג. הנפח = שטח הבסיס כפול הגובה: $50.24 \\cdot 10 = 502.4$ סמ"ק.',
        'בדיקת יחידות: שטחים בסמ"ר (ריבועיים), נפח בסמ"ק (מעוקבים) ✔',
      ],
    },

    tools: [
      {
        title: 'פורסים גליל',
        desc: 'הזיזו את הסליידר "פריסה" ותראו איך המעטפת נפתחת למלבן. שנו את r ואת h: הרוחב של המלבן תמיד שווה להיקף העיגול.',
        mount(el) {
          const st = { r: 2, h: 4, t: 0 };
          const pic = document.createElement('div'), out = document.createElement('div');
          out.className = 'readout'; el.append(pic, out);
          const draw = () => {
            const { r, h, t } = st, u = Math.min(34, 520 / (2 * Math.PI * r + 1), 380 / (h + 4 * r + 1));
            const W = Math.max(2 * Math.PI * r * u, 2 * r * u) + 80, yT = 14 + 2 * r * u, yB = yT + h * u, Ht = yB + 2 * r * u + 16, x0 = W / 2;
            const ry = ((1 - t) * 0.3 + t) * r * u, N = 48;
            const X = th => x0 + ((1 - t) * r * Math.sin(th) + t * r * th) * u, Yo = th => (1 - t) * 0.3 * r * u * Math.cos(th);
            const strips = [];
            for (let i = 0; i < N; i++) {
              const a = -Math.PI + 2 * Math.PI * i / N, b = a + 2 * Math.PI / N, front = Math.cos((a + b) / 2) > 0 || t > 0.5;
              const P = [[X(a), yT + Yo(a)], [X(b), yT + Yo(b)], [X(b), yB + Yo(b)], [X(a), yB + Yo(a)]];
              strips.push({ front, s: `<polygon points="${P.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="${front ? '#2f6fdb' : '#1b3f80'}" fill-opacity="${front ? 0.35 : 0.5}" stroke="#2f6fdb" stroke-width=".6" stroke-opacity=".5"/>` });
            }
            let g = ell(x0, yB + t * r * u, r * u, ry, '#e8702a', 0.3);
            g += strips.filter(s => !s.front).map(s => s.s).join('') + strips.filter(s => s.front).map(s => s.s).join('');
            g += ell(x0, yT - t * r * u, r * u, ry, '#e8702a', 0.45);
            if (t > 0.95) {
              const L = x0 - Math.PI * r * u, R = x0 + Math.PI * r * u;
              g += `<rect x="${L}" y="${yT}" width="${R - L}" height="${yB - yT}" fill="none" stroke="#2f6fdb" stroke-width="2.5"/>`;
              g += txt(x0, yT + (yB - yT) / 2, `2πr = ${n(2 * PI * r)}`, 'currentColor', 15) + txt(R + 18, yT + (yB - yT) / 2, `h = ${h}`, '#2f6fdb', 14);
              g += txt(x0 + r * u / 2, yT - r * u - 10, `r = ${r}`, '#c45a1c', 13) + `<line x1="${x0}" y1="${yT - r * u}" x2="${x0 + r * u}" y2="${yT - r * u}" stroke="#c45a1c" stroke-width="2"/>`;
            } else if (t < 0.05) {
              g += `<line x1="${x0}" y1="${yT}" x2="${x0 + r * u}" y2="${yT}" stroke="#c45a1c" stroke-width="2"/>` + txt(x0 + r * u / 2, yT - ry - 10, `r = ${r}`, "#c45a1c", 13);
              g += txt(x0 + r * u + 30, (yT + yB) / 2, `h = ${h}`, '#2f6fdb', 14);
            }
            pic.innerHTML = svg(W, Ht, g);
            const C = 2 * PI * r, B = PI * r * r;
            out.innerHTML = `היקף הבסיס: $2 \\cdot 3.14 \\cdot ${r} = ${n(C)}$ &nbsp;·&nbsp; שטח בסיס: $3.14 \\cdot ${r}^2 = ${n(B)}$<br>
              שטח מעטפת: $${n(C)} \\cdot ${h} = ${n(C * h)}$ &nbsp;·&nbsp; שטח פנים: $${n(C * h)} + 2 \\cdot ${n(B)} = ${n(C * h + 2 * B)}$<br>
              נפח: $${n(B)} \\cdot ${h} = ${n(B * h)}$`;
            U.math(out);
          };
          U.slider(el, { label: 'פריסה', min: 0, max: 1, step: 0.02, value: 0, fmt: v => Math.round(v * 100) + '%', onInput: v => { st.t = v; draw(); } });
          U.slider(el, { label: 'רדיוס r', min: 1, max: 5, step: 0.5, value: 2, onInput: v => { st.r = v; draw(); } });
          U.slider(el, { label: 'גובה h', min: 1, max: 8, step: 1, value: 4, onInput: v => { st.h = v; draw(); } });
        },
      },
      {
        title: 'נפח = ערימת מטבעות',
        desc: 'כל שכבה בגובה 1 היא "מטבע" עם נפח של שטח הבסיס. כמה שכבות — פי כמה הנפח.',
        mount(el) {
          const st = { r: 3, h: 4 };
          const pic = document.createElement('div'), out = document.createElement('div');
          out.className = 'readout'; el.append(pic, out);
          const draw = () => {
            const { r, h } = st, u = Math.min(24, 300 / (h + 1), 110 / r), rx = r * u, ry = rx * 0.3, W = 2 * rx + 60, x0 = W / 2, base = 20 + ry + 10 * u;
            let g = '';
            for (let i = 0; i < h; i++) {
              const y = base - i * u, col = i % 2 ? '#e8702a' : '#f0a060';
              g += `<path d="M${x0 - rx} ${y - u} V${y} A${rx} ${ry} 0 0 0 ${x0 + rx} ${y} V${y - u}" fill="${col}" fill-opacity=".55" stroke="#c45a1c" stroke-width="1"/>`;
              g += ell(x0, y - u, rx, ry, '#e8702a', 0.25);
            }
            pic.innerHTML = svg(W, base + ry + 10, g);
            const B = PI * r * r;
            out.innerHTML = `נפח שכבה אחת = שטח הבסיס: $3.14 \\cdot ${r}^2 = ${n(B)}$<br>${h} שכבות ← נפח: $${n(B)} \\cdot ${h} = ${n(B * h)}$`;
            U.math(out);
          };
          U.slider(el, { label: 'רדיוס r', min: 1, max: 5, step: 1, value: 3, onInput: v => { st.r = v; draw(); } });
          U.slider(el, { label: 'מספר שכבות h', min: 1, max: 10, step: 1, value: 4, onInput: v => { st.h = v; draw(); } });
        },
      },
      {
        title: 'משחק: איזו פחית מכילה יותר?',
        desc: 'נחשו קודם — ואז בדקו בחישוב. לפעמים הפחית הגבוהה דווקא מכילה פחות!',
        mount(el) {
          const pic = document.createElement('div'), row = document.createElement('div'), out = document.createElement('div');
          row.className = 'row'; row.style.justifyContent = 'center'; out.className = 'readout';
          el.append(pic, row, out);
          let A, B;
          const round = () => {
            do {
              A = { r: U.R(1, 4), h: U.R(2, 9) }; B = { r: U.R(1, 4), h: U.R(2, 9) };
            } while (A.r * A.r * A.h === B.r * B.r * B.h || (A.r - B.r) * (A.h - B.h) >= 0); // אחת רחבה, השנייה גבוהה
            const u = 16;
            pic.innerHTML = svg(320, 200, can(A.r, A.h, u, 240, 190 - A.h * u - 4, '#2f6fdb', false) + txt(240, 14, 'A') +
              can(B.r, B.h, u, 80, 190 - B.h * u - 4, '#1f9d55', false) + txt(80, 14, 'B'));
            row.innerHTML = '<button class="btn ghost">A מכילה יותר</button><button class="btn ghost">B מכילה יותר</button>';
            out.innerHTML = `<span dir="ltr">A: $r = ${A.r}, h = ${A.h}$ &nbsp;·&nbsp; B: $r = ${B.r}, h = ${B.h}$</span>`; U.math(out);
            row.querySelectorAll('button').forEach((b, i) => b.onclick = () => {
              const vA = PI * A.r * A.r * A.h, vB = PI * B.r * B.r * B.h, ok = (i === 0) === (vA > vB);
              out.innerHTML = `${ok ? '🏀 צדקת!' : 'לא הפעם...'}<br><div dir="ltr">A: $3.14 \\cdot ${A.r}^2 \\cdot ${A.h} = ${n(vA)}$</div><div dir="ltr">B: $3.14 \\cdot ${B.r}^2 \\cdot ${B.h} = ${n(vB)}$</div>
                הרדיוס נכנס <b>בריבוע</b>, אז פחית רחבה מכילה הרבה יותר ממה שנראה. <button class="btn">סיבוב חדש</button>`;
              U.math(out); out.querySelector('button').onclick = round;
            });
          };
          round();
        },
      },
    ],

    exercises: [
      // ---------- רמה 1 ----------
      { level: 1, gen() {
        const r = U.R(1, 10), a = PI * r * r;
        return {
          q: `רדיוס הבסיס של גליל הוא ${r} ס"מ. מה שטח הבסיס (בסמ"ר)? ${PI_NOTE}`,
          type: 'number', answer: a, tol: tolFor(a),
          mount: el => canSvg(el, Math.min(r, 6), 5, `r = ${r}`, ''),
          hint: 'הבסיס הוא עיגול. שטח עיגול: $\\pi r^2$ — כלומר 3.14 כפול הרדיוס כפול הרדיוס.',
          steps: [`שטח הבסיס $= \\pi r^2 = 3.14 \\cdot ${r}^2$`, `$= 3.14 \\cdot ${r * r} = ${n(a)}$ סמ"ר.`],
        };
      } },
      { level: 1, gen() {
        const useD = Math.random() < 0.4, r = U.R(1, 10), c = 2 * PI * r;
        return {
          q: `${useD ? `קוטר הבסיס של גליל הוא ${2 * r} ס"מ` : `רדיוס הבסיס של גליל הוא ${r} ס"מ`}. מה היקף הבסיס (בס"מ)? ${PI_NOTE}`,
          type: 'number', answer: c, tol: tolFor(c),
          hint: 'היקף עיגול: $2\\pi r$ (או $\\pi$ כפול הקוטר).',
          steps: useD ? [`היקף $= \\pi \\cdot d = 3.14 \\cdot ${2 * r}$`, `$= ${n(c)}$ ס"מ.`] : [`היקף $= 2\\pi r = 2 \\cdot 3.14 \\cdot ${r}$`, `$= ${n(c)}$ ס"מ.`],
        };
      } },
      { level: 1, gen() {
        const Q = [
          ['הפריסה של גליל מורכבת מ...', ['מלבן ושני עיגולים', 'מלבן ועיגול אחד', 'שני משולשים ועיגול', 'שלושה מלבנים'], 0, 'דמיינו שגוזרים פחית: מה יש למעלה, מה למטה ומה מסביב?', 'למעלה ולמטה — שני עיגולים (הבסיסים). מסביב — המעטפת, שנפתחת ל<b>מלבן</b>.'],
          ['בפריסה של גליל, הרוחב של המלבן שווה ל...', ['היקף הבסיס', 'הרדיוס', 'הקוטר', 'הגובה'], 0, 'המלבן היה מלופף מסביב לעיגול של הבסיס. איזה אורך הוא מכסה?', 'המלבן מלופף בדיוק פעם אחת סביב הבסיס, ולכן הרוחב שלו = <b>היקף הבסיס</b> $2\\pi r$.'],
          ['שטח הפנים של גליל הוא...', ['מעטפת ועוד שני בסיסים', 'רק המעטפת', 'מעטפת ועוד בסיס אחד', 'בסיס כפול גובה'], 0, 'שטח הפנים = כל מה שצריך לצבוע מבחוץ.', 'צובעים את המעטפת <b>וגם</b> את שני העיגולים: מעטפת + 2 בסיסים.'],
          ['הנפח של גליל הוא...', ['שטח הבסיס כפול הגובה', 'היקף הבסיס כפול הגובה', 'הרדיוס כפול הגובה', 'שטח הבסיס כפול 2'], 0, 'חשבו על ערימת מטבעות: כל שכבה היא עיגול.', 'נפח = <b>שטח הבסיס כפול הגובה</b> $= \\pi r^2 h$. (היקף כפול גובה זה שטח המעטפת.)'],
        ];
        const [q, ch, , hint, sol] = U.pick(Q), order = U.shuffle([0, 1, 2, 3]);
        return { q, type: 'choice', choices: order.map(i => ch[i]), answer: order.indexOf(0), hint, steps: [sol] };
      } },
      { level: 1, gen() {
        const B = U.R(3, 30), h = U.R(2, 10);
        return {
          q: `שטח הבסיס של גליל הוא ${B} סמ"ר והגובה שלו ${h} ס"מ. מה הנפח (בסמ"ק)?`,
          type: 'number', answer: B * h,
          hint: 'נפח גליל = שטח הבסיס כפול הגובה.',
          steps: [`נפח $= ${B} \\cdot ${h}$`, `$= ${B * h}$ סמ"ק.`],
        };
      } },
      // ---------- רמה 2 ----------
      { level: 2, gen() {
        const r = U.R(1, 8), h = U.R(2, 12), C = 2 * PI * r, a = C * h;
        return {
          q: `לגליל רדיוס ${r} ס"מ וגובה ${h} ס"מ. מה שטח המעטפת (בסמ"ר)? ${PI_NOTE}`,
          type: 'number', answer: a, tol: tolFor(a),
          mount: el => canSvg(el, Math.min(r, 6), Math.min(h, 9), `r = ${r}`, `h = ${h}`),
          hint: 'המעטפת נפתחת למלבן: רוחב = היקף הבסיס $2\\pi r$, גובה = $h$.',
          steps: [`היקף הבסיס: $2 \\cdot 3.14 \\cdot ${r} = ${n(C)}$`, `שטח המעטפת $= ${n(C)} \\cdot ${h} = ${n(a)}$ סמ"ר.`],
        };
      } },
      { level: 2, gen() {
        const r = U.R(1, 8), h = U.R(2, 12), B = PI * r * r, v = B * h;
        return {
          q: `לגליל רדיוס ${r} ס"מ וגובה ${h} ס"מ. מה הנפח שלו (בסמ"ק)? ${PI_NOTE}`,
          type: 'number', answer: v, tol: tolFor(v),
          mount: el => canSvg(el, Math.min(r, 6), Math.min(h, 9), `r = ${r}`, `h = ${h}`),
          hint: 'נפח = שטח הבסיס ($\\pi r^2$) כפול הגובה.',
          steps: [`שטח הבסיס: $3.14 \\cdot ${r}^2 = 3.14 \\cdot ${r * r} = ${n(B)}$`, `נפח $= ${n(B)} \\cdot ${h} = ${n(v)}$ סמ"ק.`],
        };
      } },
      { level: 2, gen() {
        const r = U.R(1, 7), d = 2 * r, h = U.R(2, 10), B = PI * r * r, v = B * h;
        return {
          q: `לגליל <b>קוטר</b> ${d} ס"מ וגובה ${h} ס"מ. מה הנפח שלו (בסמ"ק)? ${PI_NOTE}`,
          type: 'number', answer: v, tol: tolFor(v),
          hint: 'זהירות: נתון קוטר! הרדיוס הוא חצי מהקוטר.',
          steps: [`רדיוס = קוטר חלקי 2: $r = ${d} \\div 2 = ${r}$`, `שטח הבסיס: $3.14 \\cdot ${r}^2 = ${n(B)}$`, `נפח $= ${n(B)} \\cdot ${h} = ${n(v)}$ סמ"ק.`],
        };
      } },
      { level: 2, gen() {
        const r = U.R(1, 9), h = U.R(2, 10), C = 2 * PI * r;
        return {
          q: `בפריסה של גליל, המעטפת היא מלבן שהממדים שלו ${n(C)} ס"מ על ${h} ס"מ. מה רדיוס הבסיס (בס"מ)? ${PI_NOTE}`,
          type: 'number', answer: r, tol: 0.05,
          hint: `הרוחב ${n(C)} הוא היקף הבסיס: $2 \\cdot 3.14 \\cdot r = ${n(C)}$.`,
          steps: [`הרוחב של המלבן = היקף הבסיס: $2 \\cdot 3.14 \\cdot r = ${n(C)}$`, `$6.28 \\cdot r = ${n(C)}$`, `$r = ${n(C)} \\div 6.28 = ${r}$ ס"מ.`],
        };
      } },
      // ---------- רמה 3 ----------
      { level: 3, gen() {
        const r = U.R(1, 8), h = U.R(2, 12), C = 2 * PI * r, L = C * h, B = PI * r * r, S = L + 2 * B;
        return {
          q: `לגליל רדיוס ${r} ס"מ וגובה ${h} ס"מ. מה שטח הפנים שלו (בסמ"ר)? ${PI_NOTE}`,
          type: 'number', answer: S, tol: tolFor(S),
          mount: el => canSvg(el, Math.min(r, 6), Math.min(h, 9), `r = ${r}`, `h = ${h}`),
          hint: 'שטח פנים = מעטפת ($2\\pi r \\cdot h$) ועוד <b>שני</b> בסיסים (כל אחד $\\pi r^2$).',
          steps: [`מעטפת: $2 \\cdot 3.14 \\cdot ${r} \\cdot ${h} = ${n(L)}$`, `בסיס אחד: $3.14 \\cdot ${r}^2 = ${n(B)}$, שני בסיסים: $${n(2 * B)}$`, `שטח פנים $= ${n(L)} + ${n(2 * B)} = ${n(S)}$ סמ"ר.`],
        };
      } },
      { level: 3, gen() {
        const r = U.R(1, 6), h = U.R(2, 12), B = PI * r * r, V = B * h;
        return {
          q: `הנפח של גליל הוא ${n(V)} סמ"ק ורדיוס הבסיס שלו ${r} ס"מ. מה הגובה של הגליל (בס"מ)? ${PI_NOTE}`,
          type: 'number', answer: h, tol: 0.05,
          hint: 'נפח = שטח בסיס כפול גובה. מחשבים את שטח הבסיס, ואז מחלקים את הנפח בו.',
          steps: [`שטח הבסיס: $3.14 \\cdot ${r}^2 = ${n(B)}$`, `$${n(B)} \\cdot h = ${n(V)}$`, `$h = ${n(V)} \\div ${n(B)} = ${h}$ ס"מ.`],
        };
      } },
      { level: 3, gen() {
        const r = U.R(2, 5), h = U.R(5, 15), V = PI * r * r * h;
        return {
          q: `מיכל מים גלילי: רדיוס ${r} דצ"מ וגובה ${h} דצ"מ. כמה ליטרים של מים הוא מכיל? (1 דצ"מ מעוקב = 1 ליטר) ${PI_NOTE}`,
          type: 'number', answer: V, tol: tolFor(V),
          hint: 'מחשבים נפח בדצ"מ מעוקבים — וזה בדיוק מספר הליטרים.',
          steps: [`שטח הבסיס: $3.14 \\cdot ${r}^2 = ${n(PI * r * r)}$ דצ"מ רבועים.`, `נפח: $${n(PI * r * r)} \\cdot ${h} = ${n(V)}$ דצ"מ מעוקבים.`, `כל דצ"מ מעוקב = ליטר ← ${n(V)} ליטר.`],
        };
      } },
    ],

    summary: [
      'גליל = שני בסיסים (עיגולים שווים) + מעטפת. $r$ = רדיוס הבסיס, $h$ = גובה.',
      'הפריסה: מלבן ושני עיגולים. רוחב המלבן = היקף הבסיס $2\\pi r$, גובה המלבן = $h$.',
      'שטח מעטפת $= 2\\pi r \\cdot h$. שטח פנים = מעטפת + $2\\pi r^2$.',
      'נפח $= \\pi r^2 \\cdot h$ (שטח בסיס כפול גובה).',
      'נתון קוטר? מחלקים ב־2. שטח בסמ"ר, נפח בסמ"ק. בתרגילים $\\pi = 3.14$.',
    ],
  });
})();
