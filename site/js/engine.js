/* מתמטיקה לכיתה ח׳ — מנוע האתר: רשימת יחידות, ניתוב, התקדמות, תרגול.
   כל יחידה נרשמת בקובץ משלה: registerChapter('id', {...}) — ראו js/chapters/linear.js כדוגמה. */

const UNITS = [
  // כרך א׳
  { id: 'equations',   vol: 'א', area: 'אלגברה',   book: 'פרק 1',      emoji: '⚖️', title: 'משוואות — חזרה ומספר הפתרונות' },
  { id: 'functions',   vol: 'א', area: 'פונקציות', book: 'פרק 2',      emoji: '🔁', title: 'מבוא לפונקציות' },
  { id: 'rate',        vol: 'א', area: 'פונקציות', book: 'פרק 3',      emoji: '⏱️', title: 'קצב השתנות של פונקציה' },
  { id: 'slope',       vol: 'א', area: 'פונקציות', book: 'פרק 4',      emoji: '📐', title: 'שיפוע ויחס ישר' },
  { id: 'linear',      vol: 'א', area: 'פונקציות', book: 'פרקים 5–6',  emoji: '📈', title: 'הפונקציה הקווית y = mx + b' },
  { id: 'line-eq',     vol: 'א', area: 'פונקציות', book: 'פרקים 7–8',  emoji: '🎯', title: 'חיתוך עם הצירים ומציאת משוואת ישר' },
  { id: 'lines',       vol: 'א', area: 'פונקציות', book: 'פרקים 9–10', emoji: '✖️', title: 'ישרים מקבילים לצירים וחיתוך ישרים' },
  { id: 'inequalities',vol: 'א', area: 'אלגברה',   book: 'פרקים 11–12',emoji: '↔️', title: 'אי־שוויונות' },
  { id: 'denominators',vol: 'א', area: 'אלגברה',   book: 'פרקים 13–14',emoji: '➗', title: 'משוואות עם מכנה' },
  { id: 'distributive',vol: 'א', area: 'אלגברה',   book: 'פרקים 15–16',emoji: '🧩', title: 'חוק הפילוג המורחב ומשוואות עם x²' },
  { id: 'ratio',       vol: 'א', area: 'מספרים',   book: 'פרקים 17–19',emoji: '🗺️', title: 'יחס, פרופורציה, קנה מידה ויחס הפוך' },
  { id: 'angles',      vol: 'א', area: 'גאומטריה', book: 'פרק 20',     emoji: '📏', title: 'זוויות וזווית חיצונית למשולש' },
  { id: 'congruence',  vol: 'א', area: 'גאומטריה', book: 'פרקים 21–24',emoji: '🔺', title: 'חפיפת משולשים ותיכון' },
  // כרך ב׳
  { id: 'percent',     vol: 'ב', area: 'מספרים',   book: 'פרק 1',      emoji: '💯', title: 'אחוזים' },
  { id: 'statistics',  vol: 'ב', area: 'סטטיסטיקה והסתברות', book: 'פרקים 2–8', emoji: '📊', title: 'סטטיסטיקה' },
  { id: 'probability', vol: 'ב', area: 'סטטיסטיקה והסתברות', book: 'פרק 9', emoji: '🎲', title: 'הסתברות' },
  { id: 'sqrt',        vol: 'ב', area: 'אלגברה',   book: 'פרק 10',     emoji: '√',  title: 'שורש ריבועי ומשוואות x² = c' },
  { id: 'systems',     vol: 'ב', area: 'אלגברה',   book: 'פרקים 11–12',emoji: '🔗', title: 'מערכת משוואות ושאלות מילוליות' },
  { id: 'alg-fractions',vol:'ב', area: 'אלגברה',   book: 'פרקים 13–14',emoji: '🧮', title: 'שברים אלגבריים וערך מוחלט' },
  { id: 'isosceles',   vol: 'ב', area: 'גאומטריה', book: 'פרקים 15–16',emoji: '🔻', title: 'משולש שווה שוקיים' },
  { id: 'similarity',  vol: 'ב', area: 'גאומטריה', book: 'פרקים 17–20',emoji: '🔍', title: 'דמיון משולשים ומצולעים' },
  { id: 'pythagoras',  vol: 'ב', area: 'גאומטריה', book: 'פרק 21',     emoji: '📐', title: 'משפט פיתגורס' },
  { id: 'cylinder',    vol: 'ב', area: 'גאומטריה', book: 'פרק 22',     emoji: '🥫', title: 'גליל' },
];

const CH = {};
function registerChapter(id, def) { CH[id] = def; }

const GOAL = 10; // תשובות נכונות להשלמת יחידה

/* ---------- כלי עזר למחוללי תרגילים ---------- */
const U = {
  R: (a, b) => a + Math.floor(Math.random() * (b - a + 1)),
  RNZ: (a, b) => { let n; do { n = U.R(a, b); } while (n === 0); return n; },
  pick: arr => arr[Math.floor(Math.random() * arr.length)],
  shuffle: arr => { const a = [...arr]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; },
  gcd: (a, b) => { a = Math.abs(a); b = Math.abs(b); while (b) [a, b] = [b, a % b]; return a || 1; },
  /** מספר לתצוגה: עד 2 ספרות אחרי הנקודה, מינוס אמיתי */
  num: n => (Math.round(n * 100) / 100).toString().replace('-', '−'),
  /** שבר מצומצם בכתיב TeX */
  frac(n, d) {
    if (d < 0) { n = -n; d = -d; }
    const g = U.gcd(n, d); n /= g; d /= g;
    if (d === 1) return String(n);
    return (n < 0 ? '-' : '') + `\\frac{${Math.abs(n)}}{${d}}`;
  },
  /** איבר עם מקדם: (2,'x')→'2x', (1,'x')→'x', (-1,'x')→'-x' */
  term(c, v = 'x') { return c === 1 ? v : c === -1 ? '-' + v : c + v; },
  /** ביטוי ליניארי בכתיב TeX: (2,-3)→'2x - 3' */
  lin(m, b, v = 'x') {
    if (m === 0) return String(b);
    const s = U.term(m, v);
    return b === 0 ? s : `${s} ${b > 0 ? '+' : '-'} ${Math.abs(b)}`;
  },
  /** תוספת עם סימן: 3→'+ 3', -3→'- 3' */
  sgn: n => (n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`),
  /** לוח JSXGraph בתוך el (תמיד LTR). מחזיר את הלוח. */
  board(el, bbox = [-6, 6, 6, -6], opts = {}) {
    const box = document.createElement('div');
    box.className = 'jxg-box'; box.dir = 'ltr';
    box.id = 'jxg' + Math.random().toString(36).slice(2);
    el.appendChild(box);
    return JXG.JSXGraph.initBoard(box.id, {
      boundingbox: bbox, axis: true, grid: true, showCopyright: false, showNavigation: false,
      pan: { enabled: false }, zoom: { enabled: false }, keepAspectRatio: false, ...opts,
    });
  },
  /** רכיב סליידר HTML. onInput(value) נקרא בכל שינוי. מחזיר את ה־input. */
  slider(el, { label, min, max, step = 1, value, onInput, fmt = U.num }) {
    const w = document.createElement('label');
    w.className = 'slider';
    w.innerHTML = `<span class="slider-label">${label}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output dir="ltr"></output>`;
    const inp = w.querySelector('input'), out = w.querySelector('output');
    const upd = () => { out.textContent = fmt(+inp.value); onInput(+inp.value); };
    inp.addEventListener('input', upd);
    el.appendChild(w); setTimeout(upd);
    return inp;
  },
  /** רינדור נוסחאות $...$ ו־$$...$$ בתוך אלמנט */
  math(el) {
    if (window.renderMathInElement) renderMathInElement(el, {
      delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
      throwOnError: false,
    });
  },
};

/** ניתוח תשובה מספרית: "-3", "2.5", "2,5", "3/4", "−1/2" */
function parseNum(s) {
  s = String(s).trim().replace(/−/g, '-').replace(/\s+/g, '').replace(',', '.');
  if (!s) return NaN;
  const m = s.match(/^(-?\d*\.?\d+)\/(-?\d*\.?\d+)$/);
  if (m) return +m[1] / +m[2];
  return /^-?\d*\.?\d+$/.test(s) ? +s : NaN;
}
const close = (a, b, tol = 1e-6) => Math.abs(a - b) <= tol;
// תשובה נכונה גם כשמעגלים נכון ל־2 או 3 ספרות אחרי הנקודה (למשל 0.33 במקום 1/3)
const match = (input, ans, tol) => close(input, ans, tol) || [100, 1000].some(k => close(input, Math.round(ans * k) / k, 1e-9));

/* ---------- התקדמות (localStorage, עטוף ב־try כי הוא עלול להיות חסום) ---------- */
const P = {
  all() { try { return JSON.parse(localStorage.getItem('math8') || '{}'); } catch { return {}; } },
  get(id) { return this.all()[id] || { ok: 0, tries: 0 }; },
  add(id, ok) {
    const a = this.all(); const p = a[id] || { ok: 0, tries: 0 };
    p.tries++; if (ok) p.ok++; a[id] = p;
    try { localStorage.setItem('math8', JSON.stringify(a)); } catch {}
    return p;
  },
};

/* ---------- ניתוב ---------- */
const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// כותרת עם נוסחה ("y = mx + b"): הנוסחה לא נשברת ולא מתהפכת בתוך העברית
const fmtTitle = s => esc(s).replace(/[A-Za-z][A-Za-z0-9²=+\- ]*[A-Za-z0-9²]/g, m => `<bdi dir="ltr" class="nw">${m}</bdi>`);

function route() {
  const m = location.hash.match(/^#\/ch\/([\w-]+)/);
  window.scrollTo(0, 0);
  if (m && UNITS.find(u => u.id === m[1])) renderChapter(m[1]); else renderHome();
}
window.addEventListener('hashchange', route);
window.addEventListener('load', route);

function progressBar(id) {
  const p = P.get(id), pct = Math.min(100, Math.round(100 * p.ok / GOAL));
  return `<div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="התקדמות"><span style="width:${pct}%"></span></div>`;
}

function renderHome() {
  document.title = 'מתמטיקה כיתה ח׳';
  const total = UNITS.reduce((s, u) => s + Math.min(GOAL, P.get(u.id).ok), 0);
  let html = `
    <header class="hero">
      <h1>מתמטיקה כיתה ח׳ <span class="ball">🏀</span></h1>
      <p>כל נושא: סרטון קצר, הסבר פשוט, כלים לשחק איתם ותרגילים עם רמזים. לאט, צעד אחרי צעד.</p>
      <div class="score">סלים עד עכשיו: <b>${total}</b> מתוך ${UNITS.length * GOAL}</div>
    </header>`;
  for (const vol of ['א', 'ב']) {
    html += `<h2 class="vol">כרך ${vol}׳</h2><div class="grid">`;
    for (const u of UNITS.filter(u => u.vol === vol)) {
      const ready = !!CH[u.id], done = P.get(u.id).ok >= GOAL;
      html += `
        <a class="card ${ready ? '' : 'soon'} ${done ? 'done' : ''}" href="#/ch/${u.id}">
          <span class="emoji" aria-hidden="true">${u.emoji}</span>
          <span class="card-body">
            <span class="area">${u.area} · ${u.book}</span>
            <span class="card-title">${fmtTitle(u.title)}</span>
            ${ready ? progressBar(u.id) : '<span class="soon-tag">בקרוב</span>'}
          </span>
          ${done ? '<span class="badge" title="הושלם">⭐</span>' : ''}
        </a>`;
    }
    html += '</div>';
  }
  html += `<footer class="foot">התרגילים נוצרים מחדש בכל פעם, אז אפשר לתרגל בלי סוף. מבוסס על נושאי הספר "בכיוון הנכון" לכיתה ח׳.</footer>`;
  app.innerHTML = html;
}

function renderChapter(id) {
  const i = UNITS.findIndex(u => u.id === id), u = UNITS[i], def = CH[id];
  document.title = `${u.title} · מתמטיקה כיתה ח׳`;
  const prev = UNITS[i - 1], next = UNITS[i + 1];
  if (!def) {
    app.innerHTML = `<a class="back" href="#/">→ לכל הנושאים</a><h1>${fmtTitle(u.title)}</h1><p class="lead">היחידה הזו עוד בהכנה.</p>`;
    return;
  }
  app.innerHTML = `
    <a class="back" href="#/">→ לכל הנושאים</a>
    <header class="ch-head">
      <span class="emoji big" aria-hidden="true">${u.emoji}</span>
      <div><div class="area">${u.area} · ${u.book} בספר</div><h1>${fmtTitle(u.title)}</h1></div>
    </header>
    <nav class="chips" aria-label="חלקי היחידה">
      <a href="#video" data-jump>🎬 סרטון</a><a href="#learn" data-jump>💡 הסבר</a>
      ${def.example ? '<a href="#example" data-jump>👣 דוגמה</a>' : ''}
      ${def.tools?.length ? '<a href="#tools" data-jump>🛠️ כלים</a>' : ''}
      <a href="#practice" data-jump>🏀 תרגול</a><a href="#summary" data-jump>📋 סיכום</a>
    </nav>
    <section id="video" class="panel">
      <h2>🎬 סרטון הסבר</h2>
      <video controls preload="metadata" playsinline src="videos/${id}.mp4"></video>
      <p class="muted no-video" hidden>הסרטון ליחידה הזו עוד בהכנה.</p>
    </section>
    <section id="learn" class="panel"><h2>💡 מה צריך לדעת</h2><div class="learn">${def.intro}</div></section>
    ${def.example ? `<section id="example" class="panel"><h2>👣 דוגמה פתורה צעד אחרי צעד</h2><div class="example"></div></section>` : ''}
    ${def.tools?.length ? `<section id="tools" class="panel"><h2>🛠️ כלים לשחק איתם</h2><div class="tools"></div></section>` : ''}
    <section id="practice" class="panel"><h2>🏀 תרגול</h2><div class="practice"></div></section>
    <section id="summary" class="panel"><h2>📋 סיכום — מה לזכור</h2><ul class="summary">${def.summary.map(s => `<li>${s}</li>`).join('')}</ul></section>
    <nav class="pager">
      ${prev ? `<a href="#/ch/${prev.id}">→ ${fmtTitle(prev.title)}</a>` : '<span></span>'}
      ${next ? `<a href="#/ch/${next.id}">${fmtTitle(next.title)} ←</a>` : '<span></span>'}
    </nav>`;
  // קישורי "קפוץ ל..." בלי לשבור את הניתוב
  app.querySelectorAll('[data-jump]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault(); document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  }));
  const vid = app.querySelector('video');
  vid.addEventListener('error', () => { vid.hidden = true; app.querySelector('.no-video').hidden = false; });
  if (def.example) mountExample(app.querySelector('.example'), def.example);
  if (def.tools?.length) {
    const box = app.querySelector('.tools');
    for (const t of def.tools) {
      const card = document.createElement('div');
      card.className = 'tool';
      card.innerHTML = `<h3>${t.title}</h3>${t.desc ? `<p class="muted">${t.desc}</p>` : ''}<div class="tool-body"></div>`;
      box.appendChild(card);
      try { t.mount(card.querySelector('.tool-body')); } catch (err) { console.error(err); card.querySelector('.tool-body').textContent = 'הכלי לא נטען.'; }
      U.math(card);
    }
  }
  mountPractice(app.querySelector('.practice'), def, id);
  U.math(app);
}

/* ---------- דוגמה פתורה: חושפים צעד אחרי צעד ---------- */
function mountExample(el, ex) {
  el.innerHTML = `<div class="q">${ex.question}</div><ol class="steps"></ol><button class="btn">הצעד הבא ←</button>`;
  const ol = el.querySelector('ol'), btn = el.querySelector('button');
  let k = 0;
  btn.onclick = () => {
    const li = document.createElement('li'); li.innerHTML = ex.steps[k++]; ol.appendChild(li); U.math(li);
    if (k >= ex.steps.length) { btn.textContent = 'מההתחלה ↻'; btn.onclick = () => mountExample(el, ex); U.math(el); }
  };
  U.math(el);
}

/* ---------- תרגול ----------
   מחולל מחזיר: { q, type:'number'|'choice'|'pair'|'set', answer, choices?, n?, tol?, hint, steps:[...], mount?(el) }
   mount (אופציונלי) מצייר גרף/שרטוט מתחת לשאלה, למשל עם U.board(el, bbox, {grid:true}) */
/* number: answer מספר · choice: answer = אינדקס ב־choices · pair: answer=[x,y] · set: answer=[...] בלי חשיבות לסדר */
const PRAISE = ['סל! 🏀', 'שלשה! 🔥', 'מושלם! ⭐', 'בדיוק! 💪', 'אלוף! 🏆', 'יפה מאוד! 👏'];
const LEVELS = [{ v: 1, t: 'קל' }, { v: 2, t: 'בינוני' }, { v: 3, t: 'אתגר' }];

function mountPractice(el, def, id) {
  const avail = LEVELS.filter(l => def.exercises.some(e => e.level === l.v));
  let level = avail[0].v, streak = 0, cur, wrong, shown;
  el.innerHTML = `
    <div class="pr-top">
      <div class="levels" role="group" aria-label="רמת קושי">${avail.map(l => `<button class="lvl" data-l="${l.v}">${l.t}</button>`).join('')}</div>
      <div class="pr-stats"><span class="streak" title="רצף">🔥 <b>0</b></span> ${progressBar(id)}</div>
    </div>
    <div class="ex" aria-live="polite"></div>`;
  const ex = el.querySelector('.ex');
  const stats = () => { el.querySelector('.streak b').textContent = streak; el.querySelector('.bar').outerHTML = progressBar(id); };
  el.querySelectorAll('.lvl').forEach(b => b.onclick = () => { level = +b.dataset.l; next(); });

  function next() {
    el.querySelectorAll('.lvl').forEach(b => b.classList.toggle('on', +b.dataset.l === level));
    const gens = def.exercises.filter(e => e.level === level);
    cur = U.pick(gens).gen(); wrong = 0; shown = false;
    let input = '';
    if (cur.type === 'choice') input = `<div class="choices">${cur.choices.map((c, i) => `<button class="choice" data-i="${i}">${c}</button>`).join('')}</div>`;
    else if (cur.type === 'pair') input = `<div class="ans" dir="ltr">( <input class="in" inputmode="decimal" aria-label="x"> , <input class="in" inputmode="decimal" aria-label="y"> )</div>`;
    else if (cur.type === 'set') input = `<div class="ans" dir="ltr">${Array.from({ length: cur.n || cur.answer.length }, (_, i) => `<input class="in" inputmode="decimal" aria-label="תשובה ${i + 1}">`).join(' , ')}</div>`;
    else input = `<div class="ans" dir="ltr"><input class="in" inputmode="decimal" aria-label="התשובה שלך" autocomplete="off"></div>`;
    ex.innerHTML = `
      <div class="q">${cur.q}</div>
      ${cur.mount ? '<div class="qviz"></div>' : ''}
      ${input}
      <div class="row">
        ${cur.type !== 'choice' ? '<button class="btn check">בדיקה</button>' : ''}
        <button class="btn ghost hint-btn">💡 רמז</button>
        <button class="btn ghost sol-btn">👣 פתרון מלא</button>
        <button class="btn ghost skip">⏭ תרגיל אחר</button>
      </div>
      <div class="fb"></div><div class="hint" hidden></div><ol class="steps" hidden></ol>`;
    if (cur.mount) cur.mount(ex.querySelector('.qviz'));
    U.math(ex);
    const ins = [...ex.querySelectorAll('.in')];
    ins[0]?.focus({ preventScroll: true });
    ins.forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') check(); }));
    ex.querySelector('.check')?.addEventListener('click', check);
    ex.querySelectorAll('.choice').forEach(b => b.onclick = () => check(+b.dataset.i, b));
    ex.querySelector('.hint-btn').onclick = () => { const h = ex.querySelector('.hint'); h.innerHTML = '💡 ' + cur.hint; h.hidden = false; U.math(h); };
    ex.querySelector('.sol-btn').onclick = showSolution;
    ex.querySelector('.skip').onclick = next;
  }

  function isRight(choiceIdx) {
    const ins = [...ex.querySelectorAll('.in')].map(i => parseNum(i.value));
    const tol = cur.tol ?? 1e-6;
    if (cur.type === 'choice') return choiceIdx === cur.answer;
    if (ins.some(isNaN)) return null;
    if (cur.type === 'number') return match(ins[0], cur.answer, tol);
    if (cur.type === 'pair') return match(ins[0], cur.answer[0], tol) && match(ins[1], cur.answer[1], tol);
    const left = [...cur.answer]; // set
    return ins.every(v => { const k = left.findIndex(a => match(v, a, tol)); if (k < 0) return false; left.splice(k, 1); return true; });
  }

  function check(choiceIdx, btn) {
    const fb = ex.querySelector('.fb');
    const ok = isRight(choiceIdx);
    if (ok === null) { fb.className = 'fb warn'; fb.textContent = 'כתוב מספר (אפשר גם שבר כמו 3/4).'; return; }
    if (ok) {
      if (!shown && !wrong) streak++;
      if (!shown) P.add(id, true);
      btn?.classList.add('right');
      fb.className = 'fb good';
      fb.innerHTML = `<span class="pop">${U.pick(PRAISE)}</span> <button class="btn next">לתרגיל הבא ←</button>`;
      fb.querySelector('.next').onclick = next; fb.querySelector('.next').focus({ preventScroll: true });
      ex.querySelectorAll('.check, .choice').forEach(b => b.disabled = true);
      stats();
      if (P.get(id).ok === GOAL) fb.insertAdjacentHTML('beforeend', '<div class="goal">⭐ השלמת את היחידה! אפשר להמשיך לתרגל או לעבור לנושא הבא.</div>');
      return;
    }
    wrong++; streak = 0; stats(); P.add(id, false);
    btn?.classList.add('wrong');
    fb.className = 'fb bad';
    if (wrong === 1) { fb.textContent = 'כמעט! נסה שוב. אם צריך, לחץ על 💡 רמז.'; ex.querySelector('.hint-btn').click(); }
    else { fb.textContent = 'לא נורא, ככה לומדים. הנה הפתרון צעד אחרי צעד:'; showSolution(); }
  }

  function showSolution() {
    shown = true;
    const ol = ex.querySelector('.steps');
    ol.innerHTML = cur.steps.map(s => `<li>${s}</li>`).join(''); ol.hidden = false; U.math(ol);
    if (!ex.querySelector('.fb .next')) {
      ex.querySelector('.fb').insertAdjacentHTML('beforeend', ' <button class="btn next">לתרגיל הבא ←</button>');
      ex.querySelector('.fb .next').onclick = next;
    }
  }
  next();
}
