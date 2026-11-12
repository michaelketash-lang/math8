/* תוספות: מצא את הטעות, זריקות עונשין, קלפי שחקנים, דף נוסחאות, "איך היה?". נטען אחרי modes.js. */

/* ---------- "איך היה?" — שאלה קצרה בסוף אימון; ההורה רואה את התשובות בסיכום השבועי ---------- */
const FEEL = { 3: '😀 הבנתי', 2: '😐 בערך', 1: '😕 לא הבנתי' };
/** w = איפה נשאל: 'daily' / 'exam' / 'spot' / 'sheet:יחידה' / 'fix:יחידה' */
const feelAsk = w => `<div class="feel" data-w="${w}"><b>איך היה לך?</b> ${[3, 2, 1].map(v => `<button class="btn ghost small" data-v="${v}">${FEEL[v]}</button>`).join('')}</div>`;
if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('click', e => {
  const b = e.target.closest?.('.feel button');
  if (!b) return;
  const box = b.closest('.feel');
  S.feel.push({ t: Date.now(), v: +b.dataset.v, w: box.dataset.w });
  S.feel = S.feel.slice(-60); P.save();
  box.innerHTML = +b.dataset.v === 1 ? 'תודה שאמרת! זה בסדר לא להבין — כדאי לראות שוב את הסרטון או לבקש עזרה. 💙' : 'תודה! 👍';
});

/* ---------- מצא את הטעות: "תלמיד אחר" פתר, ובשורה אחת יש טעות נפוצה ---------- */
// כל מחולל מחזיר { given, lines: [...], bad: אינדקס השורה השגויה, why, fix: השורה כמו שהייתה צריכה להיות }
const SPOT = [
  () => { // מעבירים איבר בלי להפוך סימן
    const a = U.R(2, 6), x = U.R(1, 8), b = U.R(2, 9), c = a * x + b;
    return { given: `פתרו: $${a}x + ${b} = ${c}$`, lines: [`$${a}x = ${c} + ${b}$`, `$${a}x = ${c + b}$`, `$x = ${U.frac(c + b, a)}$`], bad: 0,
      why: `כדי להיפטר מ־$+${b}$ מחסירים ${b} משני האגפים, לכן באגף השני צריך להיות $-${b}$ ולא $+${b}$.`, fix: `$${a}x = ${c} - ${b}$` };
  },
  () => { // מחסירים את המקדם במקום לחלק
    const a = U.R(2, 6), x = U.R(3, 9), b = U.R(1, 9), c = a * x + b;
    return { given: `פתרו: $${a}x + ${b} = ${c}$`, lines: [`$${a}x = ${c} - ${b}$`, `$${a}x = ${c - b}$`, `$x = ${c - b} - ${a} = ${c - b - a}$`], bad: 2,
      why: `$${a}x$ זה ${a} <b>כפול</b> $x$. כדי להישאר עם $x$ לבד מחלקים ב־${a}, לא מחסירים.`, fix: `$x = ${c - b} : ${a} = ${x}$` };
  },
  () => { // איקסים בשני האגפים: מעבירים בלי להפוך סימן
    const a = U.R(4, 7), c = U.R(1, a - 2), x = U.R(1, 6), b = U.R(1, 9), d = (a - c) * x + b;
    return { given: `פתרו: $${a}x + ${b} = ${c === 1 ? '' : c}x + ${d}$`, lines: [`$${a}x + ${c === 1 ? '' : c}x = ${d} - ${b}$`, `$${a + c}x = ${d - b}$`, `$x = ${U.frac(d - b, a + c)}$`], bad: 0,
      why: `כשמעבירים את $${U.term(c)}$ לאגף השני הוא הופך ל־$-${U.term(c)}$. צריך להחסיר, לא לחבר.`, fix: `$${a}x - ${c === 1 ? '' : c}x = ${d} - ${b}$` };
  },
  () => { // אי־שוויון: מחלקים בשלילי בלי להפוך את הסימן
    const a = U.R(2, 5), k = U.R(1, 6), d = U.R(1, 9), e = a * k + d;
    return { given: `פתרו: $-${a}x + ${d} > ${e}$`, lines: [`$-${a}x > ${e} - ${d}$`, `$-${a}x > ${e - d}$`, `$x > ${-k}$`], bad: 2,
      why: `כשמחלקים אי־שוויון במספר <b>שלילי</b> ($-${a}$), הסימן מתהפך.`, fix: `$x < ${-k}$` };
  },
  () => { // חוק הפילוג רק לאיבר הראשון
    const a = U.R(2, 6), b = U.R(2, 7), c = U.R(1, 5);
    return { given: `פשטו: $${a}(x + ${b}) + ${U.term(c)}$`, lines: [`$= ${a}x + ${b} + ${U.term(c)}$`, `$= ${a + c}x + ${b}$`], bad: 0,
      why: `ה־${a} כופל את <b>כל</b> מה שבסוגריים: גם את $x$ וגם את ${b}.`, fix: `$= ${a}x + ${a * b} + ${U.term(c)}$` };
  },
  () => { // מינוס מינוס
    const a = U.R(2, 9), b = U.R(2, 8), c = U.R(1, 6);
    return { given: `חשבו: $${a} - (-${b}) + ${c}$`, lines: [`$= ${a} - ${b} + ${c}$`, `$= ${a - b} + ${c}$`, `$= ${a - b + c}$`], bad: 0,
      why: `להחסיר מספר שלילי זה כמו לחבר: $-(-${b})$ הופך ל־$+${b}$.`, fix: `$= ${a} + ${b} + ${c}$` };
  },
  () => { // סדר פעולות: משמאל לימין
    const a = U.R(2, 9), b = U.R(2, 6), c = U.R(2, 6);
    return { given: `חשבו: $${a} + ${b} \\cdot ${c}$`, lines: [`$= ${a + b} \\cdot ${c}$`, `$= ${(a + b) * c}$`], bad: 0,
      why: 'כפל קודם לחיבור, גם אם החיבור כתוב ראשון.', fix: `$= ${a} + ${b * c}$` };
  },
  () => { // חיבור שברים: מונה עם מונה ומכנה עם מכנה
    const [a, b] = U.pick([[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7]]);
    return { given: `חשבו: $\\frac{1}{${a}} + \\frac{1}{${b}}$`, lines: [`$= \\frac{1 + 1}{${a} + ${b}}$`, `$= \\frac{2}{${a + b}}$`], bad: 0,
      why: 'בחיבור שברים לא מחברים מכנים. קודם מוצאים מכנה משותף.', fix: `$= \\frac{${b}}{${a * b}} + \\frac{${a}}{${a * b}}$` };
  },
  () => { // אחוז: מחלקים באחוז
    const p = U.pick([20, 25, 50, 10]), n = U.pick([200, 300, 400, 500, 600]);
    return { given: `כמה זה ${p}% מתוך ${n}?`, lines: [`$= ${n} : ${p}$`, `$= ${n / p}$`], bad: 0,
      why: `${p}% זה $\\frac{${p}}{100}$. צריך לכפול את ${n} בשבר הזה, לא לחלק ב־${p}.`, fix: `$= ${n} \\cdot \\frac{${p}}{100}$` };
  },
  () => { // חזקה של מספר שלילי
    const a = U.R(2, 6), b = U.R(1, 9);
    return { given: `חשבו: $(-${a})^2 + ${b}$`, lines: [`$= -${a * a} + ${b}$`, `$= ${b - a * a}$`], bad: 0,
      why: `$(-${a})^2$ זה $(-${a}) \\cdot (-${a})$, ומינוס כפול מינוס נותן פלוס.`, fix: `$= ${a * a} + ${b}$` };
  },
  () => { // מחברים איקסים עם מספרים
    const a = U.R(2, 6), b = U.R(2, 8), c = U.R(1, 5);
    return { given: `פשטו: $${a}x + ${b} + ${U.term(c)}$`, lines: [`$= ${a + c}x + ${b}$`, `$= ${a + c + b}x$`], bad: 1,
      why: `$${a + c}x$ ו־${b} הם לא איברים דומים (לאחד יש $x$ ולשני אין), אז אי אפשר לחבר אותם. השורה הקודמת כבר הייתה התשובה.`, fix: `$${a + c}x + ${b}$` };
  },
];
const SPOT_N = 5;
ROUTES.spot = () => {
  document.title = 'מצא את הטעות · מתמטיקה כיתה ח׳';
  const gens = U.shuffle(SPOT).slice(0, SPOT_N);
  let k = 0, ok = 0;
  page('🕵️ מצא את הטעות', `<p class="muted">תלמיד אחר פתר את התרגיל, ובאחת השורות הוא טעה. לחץ על השורה שבה הטעות.</p><section class="panel spot"></section>`);
  const box = app.querySelector('.spot');
  const step = () => {
    if (k >= gens.length) {
      S.spot.n += gens.length; S.spot.ok += ok; P.bonus(2 * ok);
      box.innerHTML = `<h2>${ok === gens.length ? '🏆 בלש מושלם!' : 'סיימת! 🕵️'}</h2><p>מצאת בניסיון ראשון <b>${ok} מתוך ${gens.length}</b> טעויות · +${2 * ok} נקודות</p>
        ${feelAsk('spot')}<div class="row"><button class="btn again">עוד סיבוב</button><a class="btn ghost" href="#/">לדף הבית</a></div>`;
      box.querySelector('.again').onclick = () => ROUTES.spot();
      return;
    }
    const cur = gens[k](); let tried = false;
    box.innerHTML = `<div class="set-top"><span>תרגיל ${k + 1} מתוך ${gens.length}</span></div>
      <div class="q">${cur.given}</div>
      <div class="spot-lines">${cur.lines.map((l, i) => `<button class="spot-line" data-i="${i}"><span class="muted">שורה ${i + 1}</span> <span dir="ltr">${l}</span></button>`).join('')}</div>
      <div class="fb" aria-live="polite"></div>`;
    U.math(box);
    box.querySelectorAll('.spot-line').forEach(b => b.onclick = () => {
      const fb = box.querySelector('.fb');
      if (+b.dataset.i !== cur.bad) { tried = true; b.classList.add('wrong'); b.disabled = true; fb.className = 'fb bad'; fb.textContent = 'השורה הזו דווקא בסדר (לפי מה שכתוב מעליה). חפש שוב.'; return; }
      if (!tried) ok++;
      b.classList.add('right'); box.querySelectorAll('.spot-line').forEach(x => x.disabled = true);
      fb.className = 'fb good';
      fb.innerHTML = `${tried ? 'נכון, כאן הטעות.' : U.pick(PRAISE)} ${cur.why}<div class="spot-fix">צריך להיות: <span dir="ltr">${cur.fix}</span></div><button class="btn next">${k + 1 < gens.length ? 'לתרגיל הבא ←' : 'לסיכום ←'}</button>`;
      U.math(fb);
      fb.querySelector('.next').onclick = () => { k++; step(); };
    });
  };
  step();
};

/* ---------- זריקות עונשין: 60 שניות של חשבון מהיר (4 אפשרויות, כדי שלא צריך מקלדת) ---------- */
const FT_SEC = 60;
function ftQuestion() {
  const kind = U.pick(['add', 'add', 'sub', 'mul', 'mul', 'div']);
  let a = U.R(-9, 9), b = U.RNZ(-9, 9), q, ans;
  const p = n => (n < 0 ? `(${n})` : n);
  if (kind === 'add') { q = `${a} + ${p(b)}`; ans = a + b; }
  else if (kind === 'sub') { q = `${a} - ${p(b)}`; ans = a - b; }
  else if (kind === 'mul') { a = U.RNZ(-9, 9); q = `${a} \\cdot ${p(b)}`; ans = a * b; }
  else { ans = U.RNZ(-9, 9); q = `${ans * b} : ${p(b)}`; }
  const opts = new Set([ans]);
  for (const d of U.shuffle([-ans, ans + 1, ans - 1, ans + 2, ans - 2, ans + 10, ans - 10, a + b, a - b, a * b])) { if (opts.size < 4) opts.add(d); }
  return { q, ans, opts: U.shuffle([...opts]) };
}
let ftTimer = null;
ROUTES.ft = () => {
  document.title = 'זריקות עונשין · מתמטיקה כיתה ח׳';
  clearInterval(ftTimer);
  page('⏱️ זריקות עונשין', `<section class="panel ft">
    <p class="lead">${FT_SEC} שניות. כל תשובה נכונה = סל 🏀. כמה תצליח לקלוע?</p>
    <p>השיא שלך: <b>${S.ft.best}</b> סלים${S.ft.n ? ` · שיחקת ${S.ft.n} פעמים` : ''}</p>
    <div class="row"><button class="btn go">התחל! 🏀</button></div></section>`);
  const box = app.querySelector('.ft');
  box.querySelector('.go').onclick = () => {
    let score = 0, miss = 0, cur;
    const end = Date.now() + FT_SEC * 1000;
    box.innerHTML = `<div class="ft-top"><span>⏱️ <b class="ft-t">${FT_SEC}</b></span><span>🏀 <b class="ft-s">0</b></span></div>
      <div class="ft-q" dir="ltr"></div><div class="ft-opts" dir="ltr"></div><div class="fb ft-fb" aria-live="polite">&nbsp;</div>`;
    const next = () => {
      cur = ftQuestion();
      box.querySelector('.ft-q').innerHTML = `$${cur.q}$`; U.math(box.querySelector('.ft-q'));
      box.querySelector('.ft-opts').innerHTML = cur.opts.map(o => `<button class="btn ghost ft-o" dir="ltr" data-v="${o}">${U.num(o)}</button>`).join('');
    };
    box.querySelector('.ft-opts').onclick = e => {
      const b = e.target.closest('.ft-o'), fb = box.querySelector('.ft-fb');
      if (!b) return;
      if (+b.dataset.v === cur.ans) { score++; box.querySelector('.ft-s').textContent = score; fb.className = 'fb ft-fb good'; fb.textContent = '🏀 סל!'; }
      else { miss++; fb.className = 'fb ft-fb bad'; fb.innerHTML = `החטאה. <span dir="ltr">$${cur.q} = ${cur.ans}$</span>`; U.math(fb); }
      next();
    };
    next();
    ftTimer = setInterval(() => {
      const left = Math.max(0, Math.ceil((end - Date.now()) / 1000));
      if (!document.body.contains(box)) return clearInterval(ftTimer); // יצא מהדף באמצע
      box.querySelector('.ft-t').textContent = left;
      if (left) return;
      clearInterval(ftTimer);
      const best = score > S.ft.best; if (best) S.ft.best = score;
      S.ft.n++; P.bonus(Math.floor(score / 2));
      box.innerHTML = `<h2>${best ? '🏆 שיא חדש!' : 'נגמר הזמן! ⏱️'}</h2><p class="lead">קלעת <b>${score}</b> סלים${miss ? ` והחטאת ${miss}` : ' בלי אף החטאה'}.</p>
        <p>השיא שלך: <b>${S.ft.best}</b> · +${Math.floor(score / 2)} נקודות</p>
        <div class="row"><button class="btn again">שוב!</button><a class="btn ghost" href="#/">לדף הבית</a></div>`;
      box.querySelector('.again').onclick = () => ROUTES.ft();
    }, 250);
  };
};

/* ---------- קלפי שחקנים: כל יחידה שהושלמה פותחת קלף של שחקן מומצא; דף עבודה 16+ הופך אותו לזהב ---------- */
const CARD_FIRST = ['דור', 'עומר', 'יהלי', 'נועם', 'איתי', 'רועי', 'עידו', 'אלון', 'גיא', 'שחר', 'ליאור', 'יובל', 'אורי', 'מתן', 'ניר', 'אביב'];
const CARD_LAST = ['קלעי', 'סלאי', 'שלשי', 'ריבאונדוב', 'אסיסטי', 'בלוקר', 'דאנקמן', 'קרוסאובר', 'זינוקי', 'מהירי', 'גבהוני', 'חטפני', 'פסגור', 'טריפלי'];
const CARD_POS = ['רכז', 'קלע', 'פורוורד', 'סנטר'];
/** הקלף של יחידה — תמיד אותו שחקן לאותה יחידה (seed מה־id) */
function cardOf(u) {
  const seed = [...u.id].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
  return withSeed(seed, () => ({ name: `${U.pick(CARD_FIRST)} ${U.pick(CARD_LAST)}`, pos: U.pick(CARD_POS), num: U.R(0, 99), hue: U.R(0, 359),
    pts: U.R(80, 289) / 10, reb: U.R(20, 119) / 10, ast: U.R(15, 99) / 10, pct: U.R(38, 58) }));
}
const cardState = (u, s = S) => ({ open: (s.units[u.id]?.ok || 0) >= GOAL, gold: s.sheetLog.some(e => e.u === u.id && e.ok >= e.n * SHEET_PASS) });
const cardUnits = () => UNITS.filter(u => CH[u.id]);
ROUTES.cards = () => {
  document.title = 'הקלפים שלי · מתמטיקה כיתה ח׳';
  const us = cardUnits(), open = us.filter(u => cardState(u).open).length;
  page('🃏 הקלפים שלי', `<p class="lead">אספת <b>${open} מתוך ${us.length}</b> קלפים.</p>
    <p class="muted">כל נושא שמסיימים (10 תשובות נכונות) פותח קלף של שחקן. דף עבודה עם 16 נכונות ומעלה באותו נושא הופך את הקלף ל<b>זהב</b> ⭐.</p>
    <div class="cards">${us.map(u => { const st = cardState(u), c = cardOf(u);
      return st.open ? `<div class="pcard ${st.gold ? 'gold' : ''}" style="--h:${c.hue}">
          <div class="pc-top"><span class="pc-num">#${c.num}</span><span>${st.gold ? '⭐' : ''} ${u.emoji}</span></div>
          <div class="pc-face">⛹️</div><b class="pc-name">${c.name}</b><span class="pc-pos">${c.pos}</span>
          <div class="pc-stats"><span><b>${c.pts}</b>נק׳</span><span><b>${c.reb}</b>ריב׳</span><span><b>${c.ast}</b>אס׳</span><span><b>${c.pct}%</b>קליעה</span></div>
          <small class="muted">${fmtTitle(u.title)}</small></div>`
        : `<a class="pcard locked" href="#/ch/${u.id}"><div class="pc-face">🔒</div><b class="pc-name">???</b><small class="muted">סיים את: ${u.emoji} ${fmtTitle(u.title)}</small></a>`; }).join('')}</div>`);
};
/** הודעה כשנפתח קלף חדש או כשקלף הופך לזהב (נרשם ב־tdone כדי להודיע פעם אחת) */
function checkCards() {
  const fresh = [];
  for (const u of cardUnits()) { const st = cardState(u);
    if (st.open && !S.tdone['c_' + u.id]) { S.tdone['c_' + u.id] = Date.now(); fresh.push(`🃏 קלף חדש: ${cardOf(u).name}`); }
    if (st.gold && st.open && !S.tdone['g_' + u.id]) { S.tdone['g_' + u.id] = Date.now(); fresh.push(`⭐ הקלף של ${cardOf(u).name} הפך לזהב`); }
  }
  if (!fresh.length) return;
  P.save(); toast(fresh.length > 2 ? `🃏 נפתחו ${fresh.length} קלפים חדשים! <a href="#/cards">לאוסף</a>` : `${fresh.join(' · ')}! <a href="#/cards">לאוסף</a>`);
}
{ const pDone2 = P.done.bind(P); P.done = a => { pDone2(a); checkCards(); }; }
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('load', checkCards);

/* ---------- דף נוסחאות אישי להדפסה: הנוסחאות וה"מה לזכור" של הנושאים שנבחרו ---------- */
ROUTES.card = () => {
  document.title = 'דף נוסחאות · מתמטיקה כיתה ח׳';
  const us = cardUnits(), cfg = Cfg.get();
  let pre = us.filter(u => S.units[u.id]?.tries || cfg.exam?.units?.includes(u.id) || cfg.pin === u.id).map(u => u.id);
  if (!pre.length) pre = us.filter(u => u.vol === '0').map(u => u.id);
  app.innerHTML = `<div class="no-print"><a class="back" href="#/">→ לדף הבית</a><h1>📄 דף נוסחאות</h1>
    <div class="panel"><p class="lead">כל מה שצריך לזכור, בדף אחד. טוב לחזרה לפני מבחן.</p>
      <details><summary>בחירת נושאים (מסומנים הנושאים שהתחלת)</summary>${us.map(u => `<label class="chk"><input type="checkbox" value="${u.id}" ${pre.includes(u.id) ? 'checked' : ''}> ${u.emoji} ${fmtTitle(u.title)}</label>`).join('')}</details>
      <div class="row"><button class="btn print">⬇️ הורדה כ־PDF / הדפסה</button></div></div></div>
    <article class="sheet fcard"></article>`;
  const draw = () => {
    const ids = [...app.querySelectorAll('.chk input:checked')].map(i => i.value);
    app.querySelector('.fcard').innerHTML = `<h1>📄 דף הנוסחאות שלי</h1>${us.filter(u => ids.includes(u.id)).map(u => {
      const t = document.createElement('template'); t.innerHTML = CH[u.id].intro;
      const fs = [...t.content.querySelectorAll('.formula')].map(f => `<div class="formula">${f.innerHTML}</div>`).join('');
      return `<section><h2>${u.emoji} ${fmtTitle(u.title)}</h2>${fs}<ul>${CH[u.id].summary.map(x => `<li>${x}</li>`).join('')}</ul></section>`; }).join('') || '<p class="muted">בחר לפחות נושא אחד.</p>'}`;
    U.math(app.querySelector('.fcard'));
  };
  app.querySelector('details').onchange = draw;
  app.querySelector('.print').onclick = () => print();
  draw();
};

/** הכרטיסים של התוספות בדף הבית */
function extrasHome() {
  const us = cardUnits(), open = us.filter(u => cardState(u).open).length;
  return `<div class="acts">
    <a class="act" href="#/spot"><span class="act-i">🕵️</span><b>מצא את הטעות</b><span>מישהו טעה. איפה?</span></a>
    <a class="act" href="#/ft"><span class="act-i">⏱️</span><b>זריקות עונשין</b><span>${S.ft.best ? `השיא שלך: ${S.ft.best} סלים` : '60 שניות, כמה סלים?'}</span></a>
    <a class="act" href="#/cards"><span class="act-i">🃏</span><b>הקלפים שלי</b><span>${open} מתוך ${us.length} קלפים</span></a>
    <a class="act" href="#/card"><span class="act-i">📄</span><b>דף נוסחאות</b><span>הכול בדף אחד, להדפסה</span></a>
  </div>`;
}
