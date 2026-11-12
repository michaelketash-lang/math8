/* מתמטיקה לכיתה ח׳ — מנוע האתר: רשימת יחידות, ניתוב, התקדמות, תרגול.
   כל יחידה נרשמת בקובץ משלה: registerChapter('id', {...}) — ראו js/chapters/linear.js כדוגמה. */

const UNITS = [
  // חימום: חזרה על בסיס מכיתות ו׳–ז׳ (המבחן האבחוני ממליץ עליהן)
  { id: 'w-negatives', vol: '0', area: 'חימום', book: 'חזרה מכיתה ז׳', emoji: '🌡️', title: 'מספרים מכוונים (חיוביים ושליליים)' },
  { id: 'w-fractions', vol: '0', area: 'חימום', book: 'חזרה מכיתה ו׳', emoji: '🍕', title: 'שברים ומספרים עשרוניים' },
  { id: 'w-order',     vol: '0', area: 'חימום', book: 'חזרה מכיתה ז׳', emoji: '🔢', title: 'סדר פעולות חשבון וחזקות' },
  { id: 'w-algebra',   vol: '0', area: 'חימום', book: 'חזרה מכיתה ז׳', emoji: '🔤', title: 'ביטויים אלגבריים: הצבה וכינוס איברים' },
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
  { id: 'hoops',       vol: 'ב', area: 'סטטיסטיקה והסתברות', book: 'העשרה', emoji: '🏀', title: 'כדורסל במספרים: אחוזי קליעה וממוצעים' },
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

/* ---------- ניתוב ---------- */
const app = document.getElementById('app');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
// כותרת עם נוסחה ("y = mx + b"): הנוסחה לא נשברת ולא מתהפכת בתוך העברית
const fmtTitle = s => esc(s).replace(/[A-Za-z][A-Za-z0-9²=+\- ]*[A-Za-z0-9²]/g, m => `<bdi dir="ltr" class="nw">${m}</bdi>`);

/** דפים נוספים (אימון יומי, מבחן, הורים...) נרשמים כאן מ־modes.js: ROUTES.daily = arg => ... */
const ROUTES = {};
function route() {
  const m = location.hash.match(/^#\/([\w-]+)(?:\/([\w-]+))?/) || [];
  window.scrollTo(0, 0);
  if (window.speechSynthesis) speechSynthesis.cancel();
  if (m[1] === 'ch' && UNITS.find(u => u.id === m[2])) renderChapter(m[2]);
  else if (ROUTES[m[1]]) ROUTES[m[1]](m[2]);
  else renderHome();
}
window.addEventListener('hashchange', route);
window.addEventListener('load', route);

function progressBar(id) {
  const p = P.get(id), pct = Math.min(100, Math.round(100 * p.ok / GOAL));
  return `<div class="bar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100" aria-label="התקדמות"><span style="width:${pct}%"></span></div>`;
}

function unitCard(u, tag = '') {
  const ready = !!CH[u.id], done = P.get(u.id).ok >= GOAL;
  return `
    <a class="card ${ready ? '' : 'soon'} ${done ? 'done' : ''}" href="#/ch/${u.id}">
      <span class="emoji" aria-hidden="true">${u.emoji}</span>
      <span class="card-body">
        <span class="area">${u.area} · ${u.book}</span>
        <span class="card-title">${fmtTitle(u.title)}</span>
        ${ready ? progressBar(u.id) : '<span class="soon-tag">בקרוב</span>'}
        ${tag}
      </span>
      ${done ? '<span class="badge" title="הושלם">⭐</span>' : ''}
    </a>`;
}

function renderHome() {
  document.title = 'מתמטיקה כיתה ח׳';
  const cfg = Cfg.get(), rk = P.rank(), st = P.streak(), td = P.today(), due = P.due().length, mist = Object.keys(S.rev).length;
  const pin = UNITS.find(u => u.id === cfg.pin);
  const examDays = cfg.exam?.date ? Math.round((new Date(cfg.exam.date) - new Date(dayKey())) / DAY) : -1;
  const weak = S.diag ? Object.entries(S.diag.res).filter(([, [ok, n]]) => ok < n * 0.67).map(([id]) => id) : [];
  let html = `
    <header class="hero">
      <h1>מתמטיקה כיתה ח׳ <span class="ball">🏀</span></h1>
      <p>כל נושא: סרטון קצר, הסבר פשוט, כלים לשחק איתם ותרגילים עם רמזים. לאט, צעד אחרי צעד.</p>
      <div class="pills">
        <span class="pill" title="ימים ברצף עם ${STREAK_MIN} שאלות לפחות">🔥 רצף: <b>${st}</b> ${st === 1 ? 'יום' : 'ימים'}</span>
        <span class="pill">${rk.icon} דרגה: <b>${rk.name}</b></span>
        <span class="pill">🪙 <b>${S.pts}</b> נקודות</span>
        <span class="pill">היום: <b>${td.n}</b> שאלות</span>
      </div>
      ${rk.next ? `<div class="rank-next"><div class="bar"><span style="width:${rk.next.pct}%"></span></div><span class="muted">עוד ${rk.next.need} נקודות לדרגת <b>${rk.next.name}</b> · תשובה נכונה בניסיון ראשון = 2 נקודות</span></div>` : ''}
    </header>
    ${msgsOf(cfg).slice(-3).reverse().map(m => `<div class="msg">💬 ${esc(m.text)} <small class="muted">· ${ago(m.t)}</small></div>`).join('')}
    ${tasksHome()}
    ${rewardsHome()}
    <div class="acts">
      <a class="act main" href="#/daily"><span class="act-i">🏀</span><b>אימון יומי</b><span>${td.daily ? 'בוצע היום ✔ אפשר עוד סיבוב' : `${DAILY_N} שאלות${due ? ` · ${due} לחזרה` : ' · בערך 10 דקות'}`}</span></a>
      <a class="act" href="#/mistakes"><span class="act-i">📒</span><b>מחברת טעויות</b><span>${mist ? `${mist} דברים לחזק` : 'ריקה, כל הכבוד!'}</span></a>
      <a class="act" href="#/diag"><span class="act-i">🩺</span><b>מבחן אבחון</b><span>${S.diag ? `נעשה ב־${new Date(S.diag.t).toLocaleDateString('he')} · אפשר שוב` : 'מה כדאי לחזק? 12 שאלות'}</span></a>
      <a class="act" href="#/exam"><span class="act-i">📝</span><b>הכנה למבחן</b><span>${examDays >= 0 ? (examDays ? `המבחן בעוד ${examDays} ימים` : 'המבחן היום! בהצלחה') : 'בוחרים נושאים ומתרגלים'}</span></a>
    </div>
    ${pin ? `<h2 class="vol">📌 לומדים עכשיו בכיתה</h2><div class="grid">${unitCard(pin)}</div>` : ''}`;
  for (const [vol, name] of [['0', 'חימום: חזרה על הבסיס'], ['א', 'כרך א׳'], ['ב', 'כרך ב׳']]) {
    html += `<h2 class="vol">${name}</h2>${vol === '0' ? `<p class="muted sub">${S.diag ? 'לפי מבחן האבחון — ' + (weak.length ? 'כדאי להתחיל ביחידות המסומנות.' : 'הבסיס חזק! אפשר לדלג לכרך א׳.') : 'לא בטוח מאיפה להתחיל? עשה את <a href="#/diag">מבחן האבחון</a>.'}</p>` : ''}<div class="grid">`;
    for (const u of UNITS.filter(u => u.vol === vol)) html += unitCard(u, weak.includes(u.id) ? '<span class="tag">מומלץ לחזור</span>' : '');
    html += '</div>';
  }
  html += `<footer class="foot">התרגילים נוצרים מחדש בכל פעם, אז אפשר לתרגל בלי סוף. מבוסס על נושאי הספר "בכיוון הנכון" לכיתה ח׳.<br><a href="#/parent">👨‍👩‍👦 אזור ההורים</a></footer>`;
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
    <section id="practice" class="panel"><h2>🏀 תרגול</h2><div class="practice"></div>
      <div class="sheet-cta">
        <h3>📝 שלב אחרון: דף עבודה</h3>
        <p>תרגלת כאן? עכשיו תוריד דף עם 20 תרגילים (4 קלים, 10 בינוניים, 6 אתגר) ותפתור לבד על דף, בלי רמזים.</p>
        <a class="btn" href="#/sheet/${id}">לדף העבודה ←</a>
      </div>
    </section>
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
  videoCheckpoints(vid, id, def);
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

/** תרגול ביחידה: בוחרים רמה, ושאלה אחרי שאלה */
function mountPractice(el, def, id) {
  const avail = LEVELS.filter(l => def.exercises.some(e => e.level === l.v));
  let level = avail[0].v, streak = 0;
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
    const gs = def.exercises.map((e, g) => ({ e, g })).filter(x => x.e.level === level), { e, g } = U.pick(gs);
    askOne(ex, e.gen(), {
      u: id, g, next, skip: next,
      onTry: ok => { streak = ok ? streak + 1 : 0; stats(); },
    });
  }
  next();
}

/** תשובה נכונה כטקסט (לסקירה אחרי מבחן) */
function answerText(cur) {
  if (cur.type === 'choice') return cur.choices[cur.answer];
  if (cur.type === 'pair') return `$(${U.num(cur.answer[0])}, ${U.num(cur.answer[1])})$`;
  if (cur.type === 'set') return cur.answer.map(a => `$${U.num(a)}$`).join(' , ');
  return `$${U.num(cur.answer)}$`;
}

/** האם התשובה נכונה. vals = המספרים שהוקלדו (choice: choiceIdx). null = חסר מספר / לא מספר */
function checkVals(cur, vals, choiceIdx) {
  const tol = cur.tol ?? 1e-6;
  if (cur.type === 'choice') return choiceIdx === cur.answer;
  if (vals.some(isNaN)) return null;
  if (cur.type === 'number') return match(vals[0], cur.answer, tol);
  if (cur.type === 'pair') return match(vals[0], cur.answer[0], tol) && match(vals[1], cur.answer[1], tol);
  const left = [...cur.answer]; // set
  return vals.every(v => { const k = left.findIndex(a => match(v, a, tol)); if (k < 0) return false; left.splice(k, 1); return true; });
}

/** שאלה אחת בתוך ex.
    opts: u, g (יחידה ומספר מחולל) · exam: ניסיון אחד, בלי רמזים ובלי משוב (מבחן / אבחון) · review: חזרה ממחברת הטעויות
          onDone(res, given): פעם אחת כשהשאלה נסגרת — res = 'ok' בניסיון ראשון · 'retry' אחרי טעות · 'fail' ראה פתרון / ויתר
          onTry(ok): בכל ניסיון · next: כפתור "לתרגיל הבא" · skip: כפתור "תרגיל אחר" */
function askOne(ex, cur, { u, g, exam = false, review = false, onDone = () => {}, onTry = () => {}, next, skip, nextLabel = 'לתרגיל הבא ←' }) {
  let wrong = 0, shown = false, closed = false;
  let input = '';
  if (cur.type === 'choice') input = `<div class="choices">${cur.choices.map((c, i) => `<button class="choice" data-i="${i}">${c}</button>`).join('')}</div>`;
  else if (cur.type === 'pair') input = `<div class="ans" dir="ltr">( <input class="in" inputmode="decimal" aria-label="x"> , <input class="in" inputmode="decimal" aria-label="y"> )</div>`;
  else if (cur.type === 'set') input = `<div class="ans" dir="ltr">${Array.from({ length: cur.n || cur.answer.length }, (_, i) => `<input class="in" inputmode="decimal" aria-label="תשובה ${i + 1}">`).join(' , ')}</div>`;
  else input = `<div class="ans" dir="ltr"><input class="in" inputmode="decimal" aria-label="התשובה שלך" autocomplete="off"></div>`;
  ex.innerHTML = `
    <div class="q-row"><div class="q">${cur.q}</div>${Speak.button()}</div>
    ${cur.mount ? '<div class="qviz"></div>' : ''}
    ${input}
    <div class="row">
      ${cur.type !== 'choice' ? '<button class="btn check">בדיקה</button>' : ''}
      ${exam ? '<button class="btn ghost idk">🤷 לא יודע</button>' : `
      <button class="btn ghost hint-btn">💡 רמז</button>
      <button class="btn ghost sol-btn">👣 פתרון מלא</button>
      ${skip ? '<button class="btn ghost skip">⏭ תרגיל אחר</button>' : ''}`}
    </div>
    <div class="fb"></div><div class="hint" hidden></div><ol class="steps" hidden></ol>`;
  if (cur.mount) cur.mount(ex.querySelector('.qviz'));
  U.math(ex);
  ex.querySelector('.speak')?.addEventListener('click', () => Speak.say(cur.q));
  const ins = [...ex.querySelectorAll('.in')];
  ins[0]?.focus({ preventScroll: true });
  ins.forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') check(); }));
  ex.querySelector('.check')?.addEventListener('click', () => check());
  ex.querySelectorAll('.choice').forEach(b => b.onclick = () => check(+b.dataset.i, b));
  ex.querySelector('.idk')?.addEventListener('click', () => { P.add(u, false); close('fail', '—'); });
  const hintBtn = ex.querySelector('.hint-btn');
  if (hintBtn) hintBtn.onclick = () => { const h = ex.querySelector('.hint'); h.innerHTML = '💡 ' + cur.hint; h.hidden = false; U.math(h); };
  ex.querySelector('.sol-btn')?.addEventListener('click', showSolution);
  ex.querySelector('.skip')?.addEventListener('click', () => { if (wrong) close('fail'); skip(); });

  function close(res, given) {
    if (closed) return; closed = true;
    P.done({ u, g, res, q: cur.q, review });
    onDone(res, given);
  }
  function given(choiceIdx) {
    if (cur.type === 'choice') return cur.choices[choiceIdx];
    const v = ins.map(i => i.value.trim());
    return cur.type === 'pair' ? `(${v.join(', ')})` : v.join(' , ');
  }
  const isRight = choiceIdx => checkVals(cur, ins.map(i => parseNum(i.value)), choiceIdx);
  function nextBtn(fb) {
    if (!next || fb.querySelector('.next')) return;
    fb.insertAdjacentHTML('beforeend', ` <button class="btn next">${nextLabel}</button>`);
    fb.querySelector('.next').onclick = next; fb.querySelector('.next').focus({ preventScroll: true });
  }

  function check(choiceIdx, btn) {
    if (closed && exam) return;
    const fb = ex.querySelector('.fb');
    const ok = isRight(choiceIdx);
    if (ok === null) { fb.className = 'fb warn'; fb.textContent = 'כתוב מספר (אפשר גם שבר כמו 3/4).'; return; }
    if (exam) {
      P.add(u, ok);
      ex.querySelectorAll('.check, .choice, .idk, .in').forEach(b => b.disabled = true);
      btn?.classList.add('picked');
      fb.className = 'fb warn'; fb.textContent = 'נרשם ✓';
      return close(ok ? 'ok' : 'fail', given(choiceIdx));
    }
    if (ok) {
      if (!shown) P.add(u, true);
      onTry(!shown && !wrong);
      btn?.classList.add('right');
      fb.className = 'fb good';
      fb.innerHTML = `<span class="pop">${U.pick(PRAISE)}</span>`;
      nextBtn(fb);
      ex.querySelectorAll('.check, .choice').forEach(b => b.disabled = true);
      if (P.get(u).ok === GOAL && !shown) fb.insertAdjacentHTML('beforeend', '<div class="goal">⭐ השלמת את היחידה! אפשר להמשיך לתרגל או לעבור לנושא הבא.</div>');
      return close(shown ? 'fail' : wrong ? 'retry' : 'ok');
    }
    wrong++; P.add(u, false); onTry(false);
    btn?.classList.add('wrong');
    fb.className = 'fb bad';
    if (wrong === 1) { fb.textContent = 'כמעט! נסה שוב. אם צריך, לחץ על 💡 רמז.'; hintBtn.click(); }
    else { fb.textContent = 'לא נורא, ככה לומדים. הנה הפתרון צעד אחרי צעד:'; showSolution(); }
  }

  function showSolution() {
    shown = true;
    const ol = ex.querySelector('.steps');
    ol.innerHTML = cur.steps.map(s => `<li>${s}</li>`).join(''); ol.hidden = false; U.math(ol);
    close('fail');
    nextBtn(ex.querySelector('.fb'));
  }
}
