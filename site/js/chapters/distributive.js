/* יחידה: חוק הפילוג, הוצאת גורם משותף, חוק הפילוג המורחב ומשוואות עם x² (פרקים 15–16 בספר) */
(() => {
  /** פולינום ax² + bx + c בכתיב TeX: (1,-3,2)→'x^2 - 3x + 2' */
  const poly = (a, b, c) => {
    let s = '';
    [[a, 'x^2'], [b, 'x'], [c, '']].forEach(([k, v]) => {
      if (!k) return;
      const abs = Math.abs(k), body = v ? (abs === 1 ? v : abs + v) : String(abs);
      s += s ? ` ${k < 0 ? '-' : '+'} ${body}` : (k < 0 ? '-' : '') + body;
    });
    return s || '0';
  };
  /** (x + b) בכתיב TeX */
  const br = (b, v = 'x') => `(${U.lin(1, b, v)})`;
  /** איבר x עם סימן: 3→'+ 3x', -1→'- x' */
  const sx = c => (c < 0 ? `- ${U.term(-c)}` : `+ ${U.term(c)}`);
  /** מספר בסוגריים אם הוא שלילי */
  const p = n => (n < 0 ? `(${n})` : String(n));
  /** שאלה אמריקאית: מסיר כפילויות ומערבב */
  const mc = (right, wrongs) => {
    const choices = U.shuffle([right, ...[...new Set(wrongs)].filter(w => w !== right).slice(0, 3)].map(c => `$${c}$`));
    return { type: 'choice', choices, answer: choices.indexOf(`$${right}$`) };
  };
  /** מוסיף לשאלת mc הסברים לאפשרויות שגויות: [[אפשרות, הסבר], ...] */
  const withWhy = (e, pairs) => ({ ...e, mistakes: pairs.map(([c, why]) => ({ v: e.choices.indexOf(`$${c}$`), why })).filter(m => m.v >= 0) });

  registerChapter('distributive', {
    intro: `
      <div class="idea"><b>חוק הפילוג</b>מספר שמחוץ לסוגריים כופל <b>כל</b> איבר שבתוך הסוגריים.
        <div class="formula">$a(b + c) = ab + ac$</div>
        דוגמה: $3(x + 4) = 3x + 12$. &nbsp; שים לב: $-2(x - 5) = -2x + 10$ (מינוס כפול מינוס = פלוס).</div>
      <div class="idea"><b>הוצאת גורם משותף — הפילוג הפוך</b>מחפשים מספר (או $x$) שמתחלק בכל האיברים, ו"מוציאים" אותו החוצה.
        <div class="formula">$6x + 9 = 3(2x + 3)$ &nbsp;&nbsp; $x^2 + 5x = x(x + 5)$</div>
        בדיקה: פותחים את הסוגריים וצריך לחזור לביטוי המקורי.</div>
      <div class="idea"><b>חוק הפילוג המורחב</b>כל איבר בסוגריים הראשונים כופל כל איבר בסוגריים השניים — 4 מכפלות.
        <div class="formula">$(a + b)(c + d) = ac + ad + bc + bd$</div>
        דוגמה: $(x + 3)(x + 2) = x^2 + 2x + 3x + 6 = x^2 + 5x + 6$.</div>
      <div class="note"><b>משוואות עם $x^2$</b><br>
        פותחים סוגריים בשני האגפים. אם יש $x^2$ <b>זהה</b> בשני האגפים — הוא מצטמצם (מחסירים אותו משני האגפים), ונשארת משוואה רגילה.</div>
      <p class="muted">טעות נפוצה: $(x + 3)(x + 2)$ <b>לא</b> שווה $x^2 + 6$. שכחת את האיברים האמצעיים!</p>`,

    example: {
      question: 'פתרו את המשוואה: $(x + 3)(x - 2) = x^2 + 4$',
      steps: [
        'מתחילים מאגף שמאל ופותחים סוגריים בחוק הפילוג המורחב: כל איבר מהסוגריים הראשונים כופל כל איבר מהשניים.',
        '$x \\cdot x = x^2$, &nbsp; $x \\cdot (-2) = -2x$, &nbsp; $3 \\cdot x = 3x$, &nbsp; $3 \\cdot (-2) = -6$.',
        'מחברים: $x^2 - 2x + 3x - 6$, ומכנסים איברים דומים: $x^2 + x - 6$.',
        'המשוואה עכשיו: $x^2 + x - 6 = x^2 + 4$.',
        'יש $x^2$ בשני האגפים — מחסירים $x^2$ משני האגפים והוא נעלם: $x - 6 = 4$.',
        'מוסיפים 6 לשני האגפים: $x = 10$.',
        'בדיקה: $(10 + 3)(10 - 2) = 13 \\cdot 8 = 104$, וגם $10^2 + 4 = 104$ ✔',
      ],
    },

    tools: [
      {
        title: 'מודל השטח: $(x + a)(x + b)$',
        desc: 'מלבן שהצלעות שלו $x + a$ ו־$x + b$ מתחלק ל־4 חלקים. השטח של כל המלבן = סכום 4 החלקים. הזיזו את הסליידרים ובדקו שזה תמיד נכון.',
        mount(el) {
          const st = { x: 4, a: 3, b: 2 };
          const NS = 'http://www.w3.org/2000/svg';
          const svg = document.createElementNS(NS, 'svg');
          svg.setAttribute('viewBox', '0 0 420 420'); svg.style.cssText = 'width:100%;max-width:420px;margin:0 auto;display:block';
          svg.setAttribute('direction', 'ltr');
          el.appendChild(svg);
          const out = document.createElement('div'); out.className = 'readout'; el.appendChild(out);
          const fills = ['var(--accent-soft)', 'var(--blue-soft)', 'var(--blue-soft)', 'var(--good-soft)'];
          const draw = () => {
            const { x, a, b } = st, s = 330 / 11; // 11 = הצלע הכי ארוכה האפשרית
            const X = x * s, A = a * s, B = b * s, o = 50;
            const rects = [
              [o, o, X, X, 'x²'], [o + X, o, A, X, a + 'x'],
              [o, o + X, X, B, b + 'x'], [o + X, o + X, A, B, String(a * b)],
            ];
            svg.innerHTML = rects.map(([rx, ry, w, h, t], i) => `
              <rect x="${rx}" y="${ry}" width="${w}" height="${h}" style="fill:${fills[i]};stroke:var(--ink)" stroke-width="2"/>
              <text x="${rx + w / 2}" y="${ry + h / 2 + 7}" text-anchor="middle" font-size="${Math.min(22, w / 2.2, h / 1.2)}" style="fill:var(--ink)" font-weight="700">${t}</text>`).join('') + `
              <text x="${o + X / 2}" y="${o - 12}" text-anchor="middle" font-size="18" style="fill:var(--accent)">x</text>
              <text x="${o + X + A / 2}" y="${o - 12}" text-anchor="middle" font-size="18" style="fill:var(--accent)">${a}</text>
              <text x="${o - 12}" y="${o + X / 2 + 6}" text-anchor="middle" font-size="18" style="fill:var(--blue)">x</text>
              <text x="${o - 12}" y="${o + X + B / 2 + 6}" text-anchor="middle" font-size="18" style="fill:var(--blue)">${b}</text>`;
            out.innerHTML = `$(x + ${a})(x + ${b}) = x^2 + ${a}x + ${b}x + ${a * b} = ${poly(1, a + b, a * b)}$<br>
              <span class="muted">עם $x = ${U.num(x)}$:</span> $${U.num(x + a)} \\cdot ${U.num(x + b)} = ${U.num(x * x)} + ${U.num(a * x)} + ${U.num(b * x)} + ${a * b} = ${U.num((x + a) * (x + b))}$ ✔`;
            U.math(out);
          };
          U.slider(el, { label: 'x', min: 1, max: 6, step: 0.5, value: st.x, onInput: v => { st.x = v; draw(); } });
          U.slider(el, { label: 'a', min: 1, max: 5, value: st.a, onInput: v => { st.a = v; draw(); } });
          U.slider(el, { label: 'b', min: 1, max: 5, value: st.b, onInput: v => { st.b = v; draw(); } });
        },
      },
      {
        title: 'מכונת הגורם המשותף',
        desc: 'בחרו מה להוציא מחוץ לסוגריים. המכונה תגיד אם זה אפשרי, ואם הוצאתם את הגורם המשותף הגדול ביותר.',
        mount(el) {
          el.insertAdjacentHTML('beforeend', `<div class="readout expr"></div><div class="row btns" style="justify-content:center" dir="ltr"></div>
            <div class="readout res">לחצו על אחד הכפתורים ←</div><div class="row" style="justify-content:center"><button class="btn ghost new">ביטוי חדש</button></div>`);
          const exprEl = el.querySelector('.expr'), btns = el.querySelector('.btns'), res = el.querySelector('.res');
          const term = (c, e) => (e === 0 ? String(c) : (c === 1 ? '' : c) + (e === 2 ? 'x^2' : 'x'));
          const fresh = () => {
            const k = U.pick([2, 3, 4, 5, 6]), withX = Math.random() < 0.5;
            let m, n; do { m = U.R(1, 5); n = U.R(1, 7); } while (U.gcd(m, n) !== 1 || m === n);
            const A = k * m, Bc = k * n, pa = withX ? 2 : 1, pb = withX ? 1 : 0, g = U.gcd(A, Bc), emin = pb;
            exprEl.innerHTML = `$${term(A, pa)} + ${term(Bc, pb)}$`;
            const cands = [...new Set([2, 3, g, A, ...(withX ? [1] : [])])].sort((u, v) => u - v);
            btns.innerHTML = '';
            for (const c of cands) for (const e of withX ? [0, 1] : [0]) {
              if (c === 1 && e === 0) continue;
              const b = document.createElement('button'); b.className = 'btn ghost';
              b.innerHTML = `$${e ? (c === 1 ? 'x' : c + 'x') : c}$`;
              b.onclick = () => {
                if (A % c || Bc % c) { res.innerHTML = `✗ $${c}$ לא מחלק את $${A % c ? A : Bc}$ בלי שארית. נסו מספר אחר.`; }
                else {
                  const inside = `${term(A / c, pa - e)} + ${term(Bc / c, pb - e)}`;
                  const best = c === g && e === emin;
                  res.innerHTML = `$${term(A, pa)} + ${term(Bc, pb)} = ${e ? (c === 1 ? 'x' : c + 'x') : c}(${inside})$<br>` +
                    (best ? '🏀 זה הגורם המשותף <b>הגדול ביותר</b>! בתוך הסוגריים כבר אין מה להוציא.' : '✔ נכון, אבל בתוך הסוגריים עוד יש גורם משותף. נסו להוציא משהו גדול יותר.');
                }
                U.math(res);
              };
              btns.appendChild(b);
            }
            res.textContent = 'לחצו על אחד הכפתורים ←';
            U.math(el);
          };
          el.querySelector('.new').onclick = fresh;
          fresh();
        },
      },
      {
        title: 'הכפל הגדול: 4 מכפלות',
        desc: 'בחוק הפילוג המורחב כל איבר "לוחץ יד" לכל איבר בסוגריים השניים. לחצו על הכפתור כדי לראות את 4 המכפלות אחת אחרי השנייה.',
        mount(el) {
          el.insertAdjacentHTML('beforeend', `<div class="readout top"></div><div class="readout parts"></div>
            <div class="row" style="justify-content:center"><button class="btn go">המכפלה הבאה ←</button><button class="btn ghost new">תרגיל חדש</button></div>`);
          const top = el.querySelector('.top'), parts = el.querySelector('.parts'), go = el.querySelector('.go');
          let a, b, k;
          const fresh = () => {
            a = U.RNZ(-6, 6); b = U.RNZ(-6, 6); k = 0;
            top.innerHTML = `$(x ${U.sgn(a)})(x ${U.sgn(b)})$`; parts.innerHTML = '&nbsp;'; go.disabled = false; go.textContent = 'המכפלה הבאה ←';
            U.math(top);
          };
          go.onclick = () => {
            const prods = [
              ['x \\cdot x', 'x^2'], [`x \\cdot ${p(b)}`, U.term(b)],
              [`${p(a)} \\cdot x`, U.term(a)], [`${p(a)} \\cdot ${p(b)}`, String(a * b)],
            ];
            k++;
            const lines = prods.slice(0, k).map(([l, r], i) => `${i + 1}. $${l} = ${r}$`);
            if (k === 4) {
              lines.push(`<b>ביחד:</b> $x^2 ${sx(b)} ${sx(a)} ${U.sgn(a * b)} = ${poly(1, a + b, a * b)}$`);
              go.disabled = true; go.textContent = 'סיימנו ✔';
            }
            parts.innerHTML = lines.join('<br>'); U.math(parts);
          };
          el.querySelector('.new').onclick = fresh;
          fresh();
        },
      },
    ],

    exercises: [
      { level: 1, gen() {
        const a = U.R(2, 9), b = U.RNZ(-9, 9);
        return withWhy({
          q: `פתחו סוגריים: $${a}${br(b)} = \\;?$`,
          ...mc(U.lin(a, a * b), [U.lin(a, b), U.lin(1, a * b), U.lin(a, a + b), U.lin(a, -a * b)]),
          hint: `המספר $${a}$ כופל <b>כל</b> איבר בסוגריים: גם את $x$ וגם את $${b}$.`,
          steps: [`$${a} \\cdot x = ${a}x$`, `$${a} \\cdot ${p(b)} = ${a * b}$`, `ביחד: $${a}${br(b)} = ${U.lin(a, a * b)}$`],
        }, [
          [U.lin(a, b), `כפלת ב־$${a}$ רק את $x$. המספר שבחוץ כופל <b>כל</b> איבר בסוגריים, גם את $${b}$.`],
          [U.lin(1, a * b), `כפלת ב־$${a}$ רק את המספר. גם את $x$ צריך לכפול ב־$${a}$.`],
          [U.lin(a, a + b), `באיבר השני חיברת את $${a}$ ו־$${p(b)}$. בפתיחת סוגריים כופלים, לא מחברים.`],
          [U.lin(a, -a * b), `בדוק את הסימן של האיבר השני: כמה זה $${a} \\cdot ${p(b)}$?`],
        ]);
      } },
      { level: 1, gen() {
        const a = U.R(3, 9), d = U.pick([1, 2, 3, 4, 5]), plus = Math.random() < 0.6, n = plus ? 100 + d : 100 - d;
        return {
          q: `חשבו בעזרת חוק הפילוג: $${a} \\cdot ${n} = ${a} \\cdot (100 ${plus ? '+' : '-'} ${d})$`,
          type: 'number', answer: a * n,
          mistakes: [{ v: a * 100 + (plus ? d : -d), why: `כפלת את $${a}$ רק ב־100. צריך לכפול אותו גם ב־$${d}$.` },
            { v: a * (plus ? 100 - d : 100 + d), why: `בדוק את הסימן שבסוגריים: צריך ${plus ? 'לחבר' : 'לחסר'} את $${a} \\cdot ${d}$, לא ${plus ? 'לחסר' : 'לחבר'}.` }],
          hint: `כופלים את $${a}$ ב־100, כופלים את $${a}$ ב־$${d}$, ואז ${plus ? 'מחברים' : 'מחסירים'}.`,
          steps: [`$${a} \\cdot 100 = ${a * 100}$`, `$${a} \\cdot ${d} = ${a * d}$`, `$${a * 100} ${plus ? '+' : '-'} ${a * d} = ${a * n}$`],
        };
      } },
      { level: 1, gen() {
        const k = U.R(2, 9); let m, c; do { m = U.R(1, 5); c = U.RNZ(-9, 9); } while (U.gcd(m, c) !== 1);
        return {
          q: `השלימו את המספר שחסר במקום הריבוע: $${U.lin(k * m, k * c)} = \\square${U.term(m) === 'x' ? br(c) : `(${U.lin(m, c)})`}$`,
          type: 'number', answer: k,
          mistakes: [{ v: k * m, why: `זה המקדם של $x$ בביטוי המקורי. חפש מספר שכשכופלים אותו ב־$${U.term(m)}$ מקבלים $${U.term(k * m)}$.` }],
          hint: `איזה מספר כפול $${U.term(m)}$ נותן $${U.term(k * m)}$?`,
          steps: [`צריך מספר שכפול $${U.term(m)}$ נותן $${U.term(k * m)}$ — זה $${k}$.`, `בדיקה: $${k} \\cdot ${p(c)} = ${k * c}$ ✔`, `לכן $${U.lin(k * m, k * c)} = ${k}(${U.lin(m, c)})$.`],
        };
      } },
      { level: 1, gen() {
        const a = U.R(1, 6), b = U.RNZ(-8, 8), A = a === 1 ? '-' : '-' + a;
        return withWhy({
          q: `פתחו סוגריים: $${A}${br(b)} = \\;?$`,
          ...mc(U.lin(-a, -a * b), [U.lin(-a, a * b), U.lin(a, -a * b), U.lin(-a, b), U.lin(-a, -b)]),
          hint: `$${-a}$ כופל כל איבר. זהירות עם הסימן: ${b < 0 ? 'מינוס כפול מינוס = פלוס.' : 'מינוס כפול פלוס = מינוס.'}`,
          steps: [`$${-a} \\cdot x = ${U.term(-a)}$`, `$${-a} \\cdot ${p(b)} = ${-a * b}$`, `ביחד: $${U.lin(-a, -a * b)}$`],
        }, [
          [U.lin(-a, a * b), `בדוק את הסימן של האיבר השני: המינוס שבחוץ כופל גם את $${p(b)}$.`],
          [U.lin(a, -a * b), `בדוק את הסימן של האיבר הראשון: כופלים את $x$ ב־$${-a}$, שהוא מספר שלילי.`],
          [U.lin(-a, b), `כפלת ב־$${-a}$ רק את $x$. צריך לכפול גם את $${p(b)}$.`],
          [U.lin(-a, -b), `הפכת את הסימן של $${p(b)}$, אבל שכחת לכפול אותו ב־$${a}$.`],
        ]);
      } },
      { level: 2, gen() {
        const a = U.RNZ(-6, 6), b = U.RNZ(-6, 6);
        return withWhy({
          q: `פתחו סוגריים וכנסו איברים דומים: $${br(a)}${br(b)} = \\;?$`,
          ...mc(poly(1, a + b, a * b), [poly(1, 0, a * b), poly(1, a * b, a + b), poly(1, a + b, a + b), poly(1, -(a + b), a * b), poly(2, a + b, a * b)]),
          hint: 'חוק הפילוג המורחב: 4 מכפלות. $x \\cdot x$, $x$ כפול המספר השני, המספר הראשון כפול $x$, ושני המספרים.',
          steps: [`$x \\cdot x = x^2$, &nbsp; $x \\cdot ${p(b)} = ${U.term(b)}$, &nbsp; $${p(a)} \\cdot x = ${U.term(a)}$, &nbsp; $${p(a)} \\cdot ${p(b)} = ${a * b}$`,
            `מחברים: $x^2 ${sx(b)} ${sx(a)} ${U.sgn(a * b)}$`, `מכנסים: $${poly(1, a + b, a * b)}$`],
        }, [
          [poly(1, 0, a * b), 'כפלת רק $x \\cdot x$ ואת שני המספרים. חסרות שתי המכפלות האמצעיות, אלה שיש בהן $x$ אחד.'],
          [poly(1, a * b, a + b), `התבלבלת בין חיבור לכפל: איפה צריך לחבר את $${p(a)}$ ו־$${p(b)}$, ואיפה לכפול אותם?`],
          [poly(1, a + b, a + b), `באיבר האחרון חיברת את $${p(a)}$ ו־$${p(b)}$. שם צריך לכפול אותם.`],
          [poly(1, -(a + b), a * b), `בדוק את הסימן של האיבר האמצעי: $x \\cdot ${p(b)}$ ועוד $${p(a)} \\cdot x$.`],
          [poly(2, a + b, a * b), '$x \\cdot x$ זה לא $2x^2$. כמה זה $x$ כפול $x$?'],
        ]);
      } },
      { level: 2, gen() {
        const k = U.R(2, 7); let m, n; do { m = U.R(1, 5); n = U.R(1, 8); } while (U.gcd(m, n) !== 1);
        const e = `${U.term(k * m, 'x^2')} + ${k * n}x`;
        return withWhy({
          q: `מה הגורם המשותף <b>הגדול ביותר</b> של $${e}$?`,
          ...mc(`${k}x`, [String(k), 'x', `${k}x^2`, `${k * m}x`]),
          hint: 'חפשו גם את המספר הגדול ביותר שמחלק את שני המקדמים, וגם כמה $x$ יש בשני האיברים.',
          steps: [`המספר הגדול ביותר שמחלק גם את $${k * m}$ וגם את $${k * n}$ הוא $${k}$.`, `בשני האיברים יש לפחות $x$ אחד, לכן גם $x$ יוצא החוצה.`,
            `$${e} = ${k}x(${U.lin(m, n)})$`],
        }, [
          [String(k), 'הוצאת רק מספר. בדוק: האם יש $x$ בשני האיברים?'],
          ['x', `הוצאת רק את $x$. יש גם מספר שמחלק גם את $${k * m}$ וגם את $${k * n}$.`],
          [`${k}x^2`, `$x^2$ לא יכול לצאת החוצה: באיבר $${k * n}x$ יש רק $x$ אחד.`],
          [`${k * m}x`, `$${k * m}$ לא מחלק את $${k * n}$. הגורם המשותף צריך לחלק את <b>שני</b> המקדמים.`],
        ]);
      } },
      { level: 2, gen() {
        let a, b, c, d, x;
        do { a = U.R(2, 6); c = U.R(1, 5); b = U.RNZ(-6, 6); x = U.R(-6, 8); d = (a * (x + b)) / c - x; } while (a === c || !Number.isInteger(d) || d === 0 || Math.abs(d) > 12);
        const C = c === 1 ? '' : c;
        return {
          q: `פתרו: $${a}${br(b)} = ${C}${br(d)}$`,
          type: 'number', answer: x,
          mistakes: [{ v: (d - b) / (a - c), why: `נראה שכפלת רק את $x$ שבסוגריים. המספר שבחוץ כופל גם את המספר השני: $${a} \\cdot ${p(b)}$${c === 1 ? '' : ` ו־$${c} \\cdot ${p(d)}$`}.` }],
          hint: 'קודם פותחים סוגריים בשני האגפים, ואז מעבירים את ה־$x$ לצד אחד ואת המספרים לצד השני.',
          steps: [`פותחים סוגריים: $${U.lin(a, a * b)} = ${U.lin(c, c * d)}$`, `מעבירים: $${U.term(a)} - ${U.term(c)} = ${c * d} - ${p(a * b)}$`,
            `$${U.term(a - c)} = ${c * d - a * b}$`, `$x = ${x}$`, `בדיקה: $${a} \\cdot ${p(x + b)} = ${a * (x + b)}$ ו־$${c} \\cdot ${p(x + d)} = ${c * (x + d)}$ ✔`],
        };
      } },
      { level: 3, gen() {
        let a, b; do { a = U.RNZ(-6, 6); b = U.RNZ(-6, 6); } while (a + b === 0);
        const x = U.R(-6, 8), c = (a + b) * x + a * b;
        return {
          q: `פתרו: $${br(a)}${br(b)} = ${poly(1, 0, c)}$`,
          type: 'number', answer: x,
          hint: 'פותחים את אגף שמאל בחוק הפילוג המורחב. שימו לב: $x^2$ מופיע בשני האגפים — הוא מצטמצם.',
          steps: [`אגף שמאל: $${poly(1, a + b, a * b)}$`, `$${poly(1, a + b, a * b)} = ${poly(1, 0, c)}$`,
            `מחסירים $x^2$ משני האגפים: $${U.lin(a + b, a * b)} = ${c}$`, `$${U.term(a + b)} = ${c - a * b}$`, ...(a + b === 1 ? [] : [`מחלקים ב־$${a + b}$: $x = ${x}$`])],
        };
      } },
      { level: 3, gen() {
        let a, b, c, x;
        do { a = U.RNZ(-6, 6); b = U.RNZ(-6, 6); c = U.RNZ(-6, 6); x = (b * c) / (a - b - c); } while (a - b - c === 0 || !Number.isInteger(x) || Math.abs(x) > 10);
        x = x || 0; // מונע ‎-0
        return {
          q: `פתרו: $x${br(a)} = ${br(b)}${br(c)}$`,
          type: 'number', answer: x,
          mistakes: [{ v: (b * c) / a, why: 'באגף ימין כפלת רק $x \\cdot x$ ואת שני המספרים. חסרות המכפלות האמצעיות, אלה שיש בהן $x$ אחד.' }],
          hint: 'פותחים סוגריים בשני האגפים. בשני האגפים יוצא $x^2$ — מחסירים אותו ופותרים משוואה רגילה.',
          steps: [`אגף שמאל: $${poly(1, a, 0)}$`, `אגף ימין: $${poly(1, b + c, b * c)}$`,
            `מחסירים $x^2$: $${U.term(a)} = ${U.lin(b + c, b * c)}$`, `מעבירים איברים: $${U.term(a - b - c)} = ${b * c}$`, ...(a - b - c === 1 ? [] : [`מחלקים ב־$${a - b - c}$: $x = ${x}$`])],
        };
      } },
      { level: 3, gen() {
        const x = U.R(3, 12), a = U.R(1, 6), k = U.R(1, 3), D = 2 * k * x + k * (a + k);
        return {
          q: `האורך של מגרש מלבני גדול ב־${a} מ׳ מהרוחב שלו. אם מגדילים כל צלע ב־${k} מ׳, השטח גדל ב־${D} מ״ר. מה הרוחב של המגרש (במטרים)?`,
          type: 'number', answer: x,
          mistakes: [{ v: x + a, why: 'מצאת את האורך של המגרש. קרא שוב: מה ביקשו למצוא?' }],
          hint: `נסמן את הרוחב ב־$x$. האורך: $x + ${a}$. אחרי ההגדלה: $(x + ${k})(x + ${a + k})$. השטח החדש = השטח הישן + ${D}.`,
          steps: [`רוחב $x$, אורך $x + ${a}$. השטח: $x(x + ${a}) = ${poly(1, a, 0)}$.`, `השטח החדש: $(x + ${k})(x + ${a + k}) = ${poly(1, a + 2 * k, k * (a + k))}$.`,
            `משוואה: $${poly(1, a + 2 * k, k * (a + k))} = ${poly(1, a, 0)} + ${D}$`, `מחסירים $x^2$ ו־$${a}x$: $${2 * k}x + ${k * (a + k)} = ${D}$`,
            `$${2 * k}x = ${D - k * (a + k)}$, ולכן $x = ${x}$ מ׳.`],
        };
      } },
    ],

    summary: [
      'חוק הפילוג: $a(b + c) = ab + ac$ — המספר שבחוץ כופל <b>כל</b> איבר בפנים.',
      'הוצאת גורם משותף היא הפילוג הפוך: $6x + 9 = 3(2x + 3)$. בודקים על ידי פתיחת סוגריים.',
      'חוק הפילוג המורחב: $(a + b)(c + d) = ac + ad + bc + bd$ — תמיד 4 מכפלות, ואז מכנסים.',
      'במשוואה שיש בה $x^2$ זהה בשני האגפים — מחסירים אותו, ופותרים משוואה רגילה.',
      'זהירות: $(x + 3)(x + 2) \\ne x^2 + 6$. אל תשכח את האיברים האמצעיים!',
    ],
  });
})();
