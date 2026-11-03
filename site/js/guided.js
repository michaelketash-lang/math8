/* פתרון מודרך צעד אחרי צעד: התלמיד בוחר בעצמו כל פעולה (מוסיפים/מחסירים/כופלים/מחלקים בשני האגפים),
   והמשוואה מתעדכנת. ככה רואים איפה בדיוק נתקעים. Guided.mount(el, {ineq: true}) — לאי־שוויונות (היפוך סימן). */
const Guided = {
  mount(el, { ineq = false } = {}) {
    const REL = { '=': '=', '<': '<', '>': '>', '<=': '\\le', '>=': '\\ge' };
    const FLIP = { '=': '=', '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
    const side = (a, b) => (a === 0 ? String(b) : U.lin(a, b));
    const tex = e => `$${side(e.a, e.b)} ${REL[e.rel]} ${side(e.c, e.d)}$`;
    let level = 1, eq, hist, x0;

    el.innerHTML = `
      <div class="row g-levels">${['קל', 'בינוני', 'אתגר'].map((t, i) => `<button class="lvl" data-l="${i + 1}">${t}</button>`).join('')}</div>
      <div class="g-eq"></div>
      <p class="muted g-help">כתוב מספר או איבר (למשל <b dir="ltr">3</b> או <b dir="ltr">2x</b>), ואז בחר מה לעשות איתו בשני האגפים:</p>
      <div class="g-ops">
        <input class="in g-val" dir="ltr" aria-label="מספר או איבר" placeholder="2x" autocomplete="off">
        <button class="btn" data-op="+">+ הוסף</button><button class="btn" data-op="-">− החסר</button>
        <button class="btn" data-op="*">× כפול</button><button class="btn" data-op="/">÷ חלק</button>
      </div>
      <div class="fb g-msg" aria-live="polite"></div>
      <ol class="steps g-hist"></ol>
      <div class="row"><button class="btn ghost g-hint">💡 מה הצעד הבא?</button><button class="btn ghost g-undo">↶ בטל צעד</button><button class="btn ghost g-new">🔄 ${ineq ? 'אי־שוויון' : 'משוואה'} חדש${ineq ? '' : 'ה'}</button></div>`;
    const $ = s => el.querySelector(s), msg = (t, cls = 'warn') => { $('.g-msg').className = 'fb g-msg ' + cls; $('.g-msg').innerHTML = t; U.math($('.g-msg')); };

    function fresh() {
      x0 = U.R(-5, 8);
      let a = U.R(2, 6), c = 0;
      if (level >= 2) { do { c = U.R(1, 6); } while (c === a); }
      if (level === 3 || (ineq && Math.random() < 0.4)) a = -a;
      const b = U.RNZ(-9, 9), d = a * x0 + b - c * x0;
      eq = { a, b, c, d, rel: ineq ? U.pick(['<', '>', '<=', '>=']) : '=' };
      if (Math.random() < 0.5 && level >= 2) eq = { a: c, b: d, c: a, d: b, rel: FLIP[eq.rel] }; // לפעמים ה־x הגדול מימין
      hist = [];
      el.querySelectorAll('.lvl').forEach(b => b.classList.toggle('on', +b.dataset.l === level));
      draw(); msg('');
    }
    function draw() {
      $('.g-eq').innerHTML = tex(eq);
      $('.g-hist').innerHTML = hist.map(h => `<li>${h.text} ← ${tex(h.eq)}</li>`).join('');
      U.math($('.g-eq')); U.math($('.g-hist'));
      el.querySelectorAll('[data-op], .g-val').forEach(b => b.disabled = solved());
    }
    const solved = () => (eq.a === 1 && eq.b === 0 && eq.c === 0) || (eq.c === 1 && eq.d === 0 && eq.a === 0) || (eq.a === 0 && eq.c === 0);
    // כמה "רעש" יש במשוואה: x בשני האגפים, מספרים בצד של ה־x, מקדם שאינו 1
    const mess = e => (e.a !== 0) + (e.c !== 0) + (e.a !== 0 && e.b !== 0) + (e.c !== 0 && e.d !== 0) + (e.a !== 0 && e.a !== 1) + (e.c !== 0 && e.c !== 1);

    function parse(s) {
      s = s.replace(/−/g, '-').replace(/\s/g, '').toLowerCase();
      const m = s.match(/^([+-]?\d*)x$/);
      if (m) return { k: m[1] === '' || m[1] === '+' ? 1 : m[1] === '-' ? -1 : +m[1], n: 0 };
      const n = parseNum(s);
      return isNaN(n) || !Number.isInteger(n) ? null : { k: 0, n };
    }
    function apply(op) {
      const v = parse($('.g-val').value);
      if (!v) return msg('כתוב מספר שלם או איבר כמו <b dir="ltr">3x</b>.');
      const t = v.k ? `$${U.term(v.k)}$` : `$${v.n}$`;
      let e = { ...eq }, text;
      if (op === '+' || op === '-') {
        const s = op === '+' ? 1 : -1;
        e.a += s * v.k; e.c += s * v.k; e.b += s * v.n; e.d += s * v.n;
        text = op === '+' ? `הוספנו ${t} לשני האגפים` : `החסרנו ${t} משני האגפים`;
      } else {
        if (v.k) return msg('כופלים ומחלקים רק במספר (לא באיבר עם x).');
        if (v.n === 0) return msg(op === '*' ? 'כפל ב־0 מוחק את המשוואה! בחר מספר אחר.' : 'אסור לחלק ב־0!');
        if (op === '/' && [e.a, e.b, e.c, e.d].some(n => n % v.n)) return msg(`חלוקה ב־${t} תיתן שברים. אולי קודם להעביר איברים לאגף השני?`);
        for (const k of ['a', 'b', 'c', 'd']) e[k] = op === '*' ? e[k] * v.n : e[k] / v.n;
        text = op === '*' ? `כפלנו את שני האגפים ב־${t}` : `חילקנו את שני האגפים ב־${t}`;
        if (v.n < 0 && ineq) { e.rel = FLIP[e.rel]; text += ' — <b>ובגלל שהמספר שלילי, הסימן התהפך!</b>'; }
      }
      const worse = mess(e) > mess(eq);
      hist.push({ text, eq: e, prev: eq }); eq = e; $('.g-val').value = '';
      draw();
      if (solved()) return done();
      msg(worse ? 'מותר — אבל זה לא מקרב אותנו לפתרון. אפשר ללחוץ ↶ בטל צעד.' : 'יפה! ממשיכים.', worse ? 'bad' : 'good');
      $('.g-val').focus({ preventScroll: true });
    }
    function done() {
      if (eq.a === 0 && eq.c === 0) return msg(eq.b === eq.d && eq.rel === '=' ? 'ה־x נעלם ונשאר משפט נכון — אין־סוף פתרונות.' : 'ה־x נעלם משני האגפים. לחץ ↶ ונסה פעולה אחרת.', 'bad');
      const n = eq.a === 1 ? eq.d : eq.b, rel = eq.a === 1 ? eq.rel : FLIP[eq.rel];
      const best = (level === 1 ? 2 : 3);
      msg(`🏀 סל! ${ineq ? `הפתרון: $x ${REL[rel]} ${n}$ — כל מספר שמקיים את זה.` : `$x = ${n}$. בדיקה: מציבים ${n} במשוואה המקורית ושני האגפים יוצאים שווים.`}
        ${hist.length <= best ? ' פתרת במספר הצעדים הכי קטן!' : ` (${hist.length} צעדים — אפשר גם ב־${best}.)`}`, 'good');
    }
    function hint() {
      if (solved()) return;
      const { a, b, c, d } = eq;
      if (a !== 0 && c !== 0) { const k = Math.min(a, c); return msg(`יש $x$ בשני האגפים. כדאי ${k > 0 ? `להחסיר $${U.term(k)}$ משני האגפים` : `להוסיף $${U.term(-k)}$ לשני האגפים`} — ככה ה־$x$ נשאר רק בצד אחד.`); }
      const [k, n] = a !== 0 ? [a, b] : [c, d];
      if (n !== 0) return msg(n > 0 ? `באגף של ה־$x$ יש $+${n}$. החסר $${n}$ משני האגפים.` : `באגף של ה־$x$ יש $${n}$. הוסף $${-n}$ לשני האגפים.`);
      msg(`נשאר $${U.term(k)}$. חלק את שני האגפים ב־$${k}$${ineq && k < 0 ? ' (שים לב: מספר שלילי הופך את הסימן!)' : ''}.`);
    }

    el.querySelectorAll('[data-op]').forEach(b => b.onclick = () => apply(b.dataset.op));
    $('.g-val').addEventListener('keydown', e => { if (e.key === 'Enter') msg('עכשיו בחר פעולה: הוסף, החסר, כפול או חלק.'); });
    $('.g-hint').onclick = hint;
    $('.g-undo').onclick = () => { const h = hist.pop(); if (h) { eq = h.prev; draw(); msg(''); } };
    $('.g-new').onclick = fresh;
    el.querySelectorAll('.lvl').forEach(b => b.onclick = () => { level = +b.dataset.l; fresh(); });
    fresh();
  },
};
