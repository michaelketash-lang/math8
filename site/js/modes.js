/* דפים מעבר ליחידות: אימון יומי, מחברת טעויות, מבחן אבחון, הכנה למבחן, אזור ההורים, עצירות בסרטון. */

const unitOf = id => UNITS.find(u => u.id === id);
const keyParts = k => { const [u, g] = k.split(':'); return { u, g: +g }; };
const gensOf = (u, maxLevel = 3) => CH[u].exercises.map((e, g) => ({ e, g })).filter(x => x.e.level <= maxLevel);
const acc = (ok, n) => (n ? Math.round(100 * ok / n) : 0);
const page = (title, body) => { app.innerHTML = `<a class="back" href="#/">→ לדף הבית</a><h1>${title}</h1>${body}`; };
const lastQ = (s, u, g) => [...s.log].reverse().find(e => e.u === u && e.g === g && e.q)?.q;

/** סדרת שאלות. items: [{u, g, level?}] · exam: ניסיון אחד בלי רמזים · onEnd(results) */
function runSet(el, items, { exam = false, review = false, onEnd }) {
  let k = 0;
  const results = [];
  el.innerHTML = `<div class="set-top"><span class="set-n"></span><span class="set-u muted"></span></div><div class="bar"><span></span></div><div class="ex" aria-live="polite"></div>`;
  const ex = el.querySelector('.ex');
  const step = () => {
    if (k >= items.length) return onEnd(results);
    const it = items[k], cur = CH[it.u].exercises[it.g].gen(), u = unitOf(it.u);
    el.querySelector('.set-n').textContent = `שאלה ${k + 1} מתוך ${items.length}`;
    el.querySelector('.set-u').innerHTML = `${u.emoji} ${fmtTitle(u.title)}`;
    el.querySelector('.bar span').style.width = `${100 * k / items.length}%`;
    askOne(ex, cur, {
      u: it.u, g: it.g, exam, review,
      onDone: (res, given) => { results.push({ ...it, cur, res, given }); if (exam) setTimeout(() => { k++; step(); }, 500); },
      next: () => { k++; step(); },
    });
    ex.scrollIntoView({ block: 'nearest' });
  };
  step();
}

function resultLine(results) {
  const c = r => results.filter(x => x.res === r).length;
  return `<div class="pills"><span class="pill">✅ בניסיון ראשון: <b>${c('ok')}</b></span><span class="pill">🔁 אחרי תיקון: <b>${c('retry')}</b></span><span class="pill">📒 למחברת: <b>${c('fail')}</b></span></div>`;
}

/* ---------- אימון יומי: קודם חזרה על טעויות שהגיע זמנן, אחר כך ערבוב מהיחידות שהתחיל ---------- */
function dailyItems() {
  const items = [], used = new Set();
  const add = (u, g) => { const k = `${u}:${g}`; if (!used.has(k) && CH[u]?.exercises[g]) { used.add(k); items.push({ u, g }); } };
  for (const k of U.shuffle(P.due()).slice(0, 4)) { const { u, g } = keyParts(k); add(u, g); }
  const cfg = Cfg.get(), weak = S.diag ? Object.entries(S.diag.res).filter(([, [ok, n]]) => ok < n * 0.67).map(([id]) => id) : [];
  let pool = UNITS.filter(u => CH[u.id] && S.units[u.id]?.tries).map(u => u.id);
  if (CH[cfg.pin]) pool.push(cfg.pin, cfg.pin); // היחידה של הכיתה — משקל כפול
  pool.push(...weak.filter(id => CH[id]));
  if (!pool.length) pool = [UNITS.find(u => CH[u.id])?.id].filter(Boolean);
  for (let guard = 0; items.length < DAILY_N && guard < 300; guard++) {
    const u = U.pick(pool), gs = gensOf(u, P.get(u).ok >= GOAL ? 3 : 2);
    // מבין שתי מיומנויות אקראיות — זו שהוא פחות מצליח בה
    const [x, y] = [U.pick(gs), U.pick(gs)], score = o => { const s = S.gens[`${u}:${o.g}`]; return s ? s.ok / s.tries : 0.5; };
    const pickG = score(x) <= score(y) ? x : y;
    add(u, pickG.g);
    if (guard > 150) used.clear(); // מעט יחידות — מותר לחזור על מיומנות
  }
  return U.shuffle(items);
}

ROUTES.daily = () => {
  document.title = 'אימון יומי · מתמטיקה כיתה ח׳';
  const items = dailyItems();
  if (!items.length) return page('🏀 אימון יומי', '<p class="lead">עוד אין יחידות לתרגל.</p>');
  page('🏀 אימון יומי', `<p class="muted">${DAILY_N} שאלות מעורבבות מהנושאים שלמדת. שאלות שטעית בהן בעבר חוזרות כדי לוודא שהן נשארות בראש.</p><section class="panel set"></section>`);
  runSet(app.querySelector('.set'), items, {
    onEnd(results) {
      const d = S.days[dayKey()] || (S.days[dayKey()] = { n: 0, ok: 0, sec: 0 });
      const first = !d.daily; d.daily = 1;
      if (first) P.bonus(10); else P.save();
      app.querySelector('.set').innerHTML = `<h2>🏆 סיימת את האימון!</h2>${resultLine(results)}
        ${first ? '<p class="goal">+10 נקודות בונוס על האימון היומי 🎉</p>' : ''}
        <p>רצף: <b>🔥 ${P.streak()}</b> ${P.streak() === 1 ? 'יום' : 'ימים'} · דרגה: <b>${P.rank().icon} ${P.rank().name}</b></p>
        <div class="row"><a class="btn" href="#/">לדף הבית</a><button class="btn ghost again">עוד סיבוב</button></div>`;
      app.querySelector('.again').onclick = () => ROUTES.daily();
    },
  });
};

/* ---------- מחברת טעויות ---------- */
ROUTES.mistakes = () => {
  document.title = 'מחברת טעויות · מתמטיקה כיתה ח׳';
  const keys = Object.keys(S.rev).filter(k => CH[keyParts(k).u]);
  if (!keys.length) return page('📒 מחברת טעויות', '<p class="lead">המחברת ריקה! 🎉 כל שאלה שתטעה בה תיכנס לכאן, ותחזור באימון היומי אחרי יום, 3 ימים, שבוע ושבועיים — עד שהיא יושבת חזק.</p>');
  const now = Date.now();
  const byUnit = {};
  for (const k of keys) { const { u } = keyParts(k); (byUnit[u] ||= []).push(k); }
  page('📒 מחברת טעויות', `
    <p class="muted">כאן נמצאים סוגי השאלות שטעית בהם. כל אחד חוזר כמה פעמים עם מספרים חדשים — אחרי 4 הצלחות הוא יוצא מהמחברת.</p>
    <div class="row"><button class="btn go">🔁 לתרגל עכשיו (${Math.min(keys.length, 12)} שאלות)</button></div>
    ${UNITS.filter(u => byUnit[u.id]).map(u => `<section class="panel"><h3>${u.emoji} ${fmtTitle(u.title)}</h3><ul class="mlist">
      ${byUnit[u.id].map(k => { const { g } = keyParts(k), r = S.rev[k], q = lastQ(S, u.id, g);
        return `<li><span class="dots" title="שלב ${r.box} מתוך ${BOXES.length}">${'●'.repeat(r.box)}${'○'.repeat(BOXES.length - r.box)}</span>
          <span class="mq">${q || 'שאלה מהיחידה'}</span><span class="muted">${r.due <= now ? 'לחזרה עכשיו' : 'חוזר ב־' + new Date(r.due).toLocaleDateString('he')}</span></li>`; }).join('')}
    </ul></section>`).join('')}
    <section class="panel set" hidden></section>`);
  U.math(app);
  app.querySelector('.go').onclick = () => {
    const box = app.querySelector('.set'); box.hidden = false;
    app.querySelectorAll('section:not(.set), .go').forEach(e => e.remove());
    runSet(box, U.shuffle(keys).slice(0, 12).map(keyParts), {
      review: true,
      onEnd(results) {
        box.innerHTML = `<h2>סיימת! 💪</h2>${resultLine(results)}<p>מה שענית עליו נכון בניסיון הראשון התקדם שלב במחברת.</p><div class="row"><a class="btn" href="#/">לדף הבית</a><a class="btn ghost" href="#/mistakes" onclick="setTimeout(route)">למחברת</a></div>`;
      },
    });
  };
};

/* ---------- סקירה אחרי מבחן / אבחון ---------- */
function reviewList(results) {
  return `<ol class="review">${results.map(r => `
    <li class="${r.res === 'ok' ? 'r-ok' : 'r-bad'}">
      <div>${r.res === 'ok' ? '✅' : '❌'} ${r.cur.q}</div>
      ${r.res === 'ok' ? '' : `<div class="muted">התשובה שלך: <bdi>${esc(r.given || '—')}</bdi> · התשובה הנכונה: ${answerText(r.cur)}</div>
      <details><summary>👣 הפתרון</summary><ol class="steps">${r.cur.steps.map(s => `<li>${s}</li>`).join('')}</ol></details>`}
    </li>`).join('')}</ol>`;
}

/* ---------- מבחן אבחון: 3 שאלות מכל יחידת חימום ---------- */
ROUTES.diag = () => {
  document.title = 'מבחן אבחון · מתמטיקה כיתה ח׳';
  const warm = UNITS.filter(u => u.vol === '0' && CH[u.id]);
  if (!warm.length) return page('🩺 מבחן אבחון', '<p class="lead">יחידות החימום עוד בהכנה.</p>');
  const items = [];
  for (const u of warm) {
    const l1 = U.shuffle(gensOf(u.id, 1)), l2 = U.shuffle(gensOf(u.id, 2).filter(x => x.e.level === 2));
    items.push(...[l1[0], l2[0], l2[1] || l1[1]].filter(Boolean).map(x => ({ u: u.id, g: x.g })));
  }
  page('🩺 מבחן אבחון', `
    <section class="panel intro-box">
      <p class="lead">${items.length} שאלות על הבסיס מכיתות ו׳–ז׳. זה <b>לא</b> מבחן עם ציון — זו בדיקה שעוזרת לדעת מה כדאי לחזק.</p>
      <p>אין רמזים באמצע. אם אתה לא יודע — זה בסדר גמור, לוחצים "🤷 לא יודע" וממשיכים. בסוף תראה פתרון לכל שאלה.</p>
      <button class="btn start">יאללה, מתחילים</button>
    </section><section class="panel set" hidden></section>`);
  app.querySelector('.start').onclick = () => {
    app.querySelector('.intro-box').remove();
    const box = app.querySelector('.set'); box.hidden = false;
    runSet(box, items, {
      exam: true,
      onEnd(results) {
        const res = {};
        for (const r of results) { const x = res[r.u] ||= [0, 0]; x[1]++; if (r.res === 'ok') x[0]++; }
        S.diag = { t: Date.now(), res }; P.save();
        box.innerHTML = `<h2>התוצאות</h2>
          <div class="diag">${warm.map(u => { const [ok, n] = res[u.id] || [0, 0], weak = ok < n * 0.67;
            return `<a class="card ${weak ? '' : 'done'}" href="#/ch/${u.id}"><span class="emoji">${u.emoji}</span><span class="card-body">
              <span class="card-title">${fmtTitle(u.title)}</span><span>${ok} מתוך ${n} ${weak ? '<span class="tag">מומלץ לחזור</span>' : '✅ חזק'}</span></span></a>`; }).join('')}</div>
          <p>${Object.values(res).some(([ok, n]) => ok < n * 0.67) ? 'כדאי להתחיל ביחידות המסומנות — הן הבסיס לכל החומר של כיתה ח׳. גם האימון היומי יכלול מהן שאלות.' : 'הבסיס שלך חזק! אפשר לעבור ישר לכרך א׳.'}</p>
          <h3>כל השאלות</h3>${reviewList(results)}
          <div class="row"><a class="btn" href="#/">לדף הבית</a></div>`;
        U.math(box);
      },
    });
  };
};

/* ---------- הכנה למבחן: בוחרים נושאים, 12 שאלות בלי רמזים, ואז סקירה ---------- */
ROUTES.exam = () => {
  document.title = 'הכנה למבחן · מתמטיקה כיתה ח׳';
  const cfg = Cfg.get(), pre = new Set(cfg.exam?.units?.length ? cfg.exam.units : cfg.pin ? [cfg.pin] : []);
  const ready = UNITS.filter(u => CH[u.id]);
  page('📝 הכנה למבחן', `
    <section class="panel pick">
      ${cfg.exam?.date ? `<p class="lead">📅 המבחן ב־${new Date(cfg.exam.date).toLocaleDateString('he')}. הנושאים שסומנו כבר מסומנים.</p>` : ''}
      <p>בחר את הנושאים שיהיו במבחן. תקבל 12 שאלות מעורבבות, מקלות לקשות, <b>בלי רמזים</b> — כמו במבחן אמיתי. בסוף תראה מה נכון ופתרון לכל טעות.</p>
      ${[['0', 'חימום'], ['א', 'כרך א׳'], ['ב', 'כרך ב׳']].map(([v, n]) => `<fieldset><legend>${n}</legend>${ready.filter(u => u.vol === v).map(u =>
        `<label class="chk"><input type="checkbox" value="${u.id}" ${pre.has(u.id) ? 'checked' : ''}> ${u.emoji} ${fmtTitle(u.title)}</label>`).join('')}</fieldset>`).join('')}
      <div class="row"><button class="btn start">התחל מבחן</button><span class="fb warn"></span></div>
    </section><section class="panel set" hidden></section>`);
  app.querySelector('.start').onclick = () => {
    const units = [...app.querySelectorAll('.chk input:checked')].map(i => i.value);
    if (!units.length) { app.querySelector('.pick .fb').textContent = 'בחר לפחות נושא אחד.'; return; }
    const items = [], used = new Set();
    for (let i = 0; i < 12; i++) {
      const lvl = i < 3 ? 1 : i < 9 ? 2 : 3, u = units[i % units.length];
      const gs = U.shuffle(gensOf(u)).sort((a, b) => Math.abs(a.e.level - lvl) - Math.abs(b.e.level - lvl));
      const x = gs.find(x => !used.has(`${u}:${x.g}`)) || gs[0];
      used.add(`${u}:${x.g}`); items.push({ u, g: x.g, lvl: x.e.level });
    }
    items.sort((a, b) => a.lvl - b.lvl);
    app.querySelector('.pick').remove();
    const box = app.querySelector('.set'); box.hidden = false;
    runSet(box, items, {
      exam: true,
      onEnd(results) {
        const ok = results.filter(r => r.res === 'ok').length;
        S.exams.push({ t: Date.now(), units, ok, n: results.length }); P.save();
        const score = Math.round(100 * ok / results.length);
        box.innerHTML = `<h2>${score >= 85 ? '🏆' : score >= 60 ? '💪' : '📚'} ציון: ${score}</h2>
          <p>${ok} נכונות מתוך ${results.length}. ${score >= 85 ? 'מוכן למבחן!' : score >= 60 ? 'בדרך הנכונה. עבור על הטעויות ונסה שוב מחר.' : 'יש עוד מה לתרגל — זה בדיוק בשביל זה. הטעויות נכנסו למחברת ויחזרו באימון היומי.'}</p>
          ${reviewList(results)}
          <div class="row"><a class="btn" href="#/">לדף הבית</a><button class="btn ghost again">מבחן נוסף</button></div>`;
        box.querySelector('.again').onclick = () => ROUTES.exam();
        U.math(box);
      },
    });
  };
};

/* ---------- עצירות בסרטון: באמצע ובסוף — שאלה קלה אחת לבדוק שהבנת ---------- */
function videoCheckpoints(vid, id, def) {
  const easy = gensOf(id, 1);
  if (!easy.length) return;
  const box = document.createElement('div');
  box.className = 'vcp'; box.hidden = true; vid.after(box);
  let maxF = S.video[id] || 0, midDone = false;
  const ask = end => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    vid.webkitExitFullscreen?.();
    const { g, e } = U.pick(easy);
    box.hidden = false;
    box.innerHTML = `<div class="vcp-head"><b>${end ? '🏁 סוף הסרטון — שאלה אחת לבדוק שהבנת' : '⏸️ עצירה קצרה — בדוק את עצמך'}</b><button class="btn ghost vcp-x">${end ? 'סגור' : 'דלג ▶'}</button></div><div class="ex"></div>`;
    const resume = () => { box.hidden = true; if (!end) vid.play(); };
    box.querySelector('.vcp-x').onclick = resume;
    askOne(box.querySelector('.ex'), e.gen(), { u: id, g, next: end ? () => { box.hidden = true; document.getElementById('practice').scrollIntoView({ behavior: 'smooth' }); } : resume, nextLabel: end ? 'לתרגול ←' : '▶ המשך לצפות' });
    box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  };
  vid.addEventListener('timeupdate', () => {
    if (!vid.duration) return;
    const f = vid.currentTime / vid.duration;
    if (f > maxF + 0.05) { maxF = f; S.video[id] = Math.round(f * 100) / 100; P.save(); }
    if (!midDone && f >= 0.5 && f < 0.6 && !vid.paused) { midDone = true; vid.pause(); ask(false); }
  });
  vid.addEventListener('ended', () => { S.video[id] = 1; P.save(); ask(true); });
}

/* ---------- אזור ההורים ---------- */
function ago(t) {
  if (!t) return 'עוד לא';
  const d = Math.round((new Date(dayKey()) - new Date(dayKey(t))) / DAY), hm = new Date(t).toLocaleTimeString('he', { hour: '2-digit', minute: '2-digit' });
  return d === 0 ? `היום ${hm}` : d === 1 ? `אתמול ${hm}` : `לפני ${d} ימים`;
}

function dayChart(s) {
  const days = Array.from({ length: 14 }, (_, i) => { const t = Date.now() - (13 - i) * DAY; return { t, ...(s.days[dayKey(t)] || { n: 0, ok: 0, sec: 0 }) }; });
  const max = Math.max(10, ...days.map(d => d.n)), W = 28, H = 120;
  return `<svg class="chart" viewBox="0 0 ${14 * W} ${H + 34}" role="img" aria-label="שאלות בכל יום בשבועיים האחרונים" dir="ltr">
    ${days.map((d, i) => { const h = H * d.n / max, ho = H * d.ok / max, x = i * W + 5; // משמאל לימין, הימני = היום
      return `<g><title>${new Date(d.t).toLocaleDateString('he')}: ${d.n} שאלות, ${d.ok} נכונות בניסיון ראשון, ${Math.round(d.sec / 60)} דקות</title>
        <rect x="${x}" y="${H - h}" width="${W - 10}" height="${h}" rx="3" class="c-all"/><rect x="${x}" y="${H - ho}" width="${W - 10}" height="${ho}" rx="3" class="c-ok"/>
        ${d.n ? `<text x="${x + (W - 10) / 2}" y="${H - h - 4}" text-anchor="middle" class="c-n">${d.n}</text>` : ''}
        <text x="${x + (W - 10) / 2}" y="${H + 16}" text-anchor="middle" class="c-d">${new Date(d.t).getDate()}</text>
        <text x="${x + (W - 10) / 2}" y="${H + 30}" text-anchor="middle" class="c-m">${d.sec >= 60 ? Math.round(d.sec / 60) + '′' : ''}</text></g>`; }).join('')}
  </svg><p class="muted legend"><span class="sw c-ok"></span> נכון בניסיון ראשון <span class="sw c-all"></span> כל השאלות · מספר קטן מתחת = דקות תרגול · הימני = היום</p>`;
}

ROUTES.parent = async arg => {
  document.title = 'אזור ההורים · מתמטיקה כיתה ח׳';
  if (arg) { ls.set('math8watch', arg); history.replaceState(null, '', '#/parent'); }
  const watch = ls.get('math8watch'), remote = !!(watch && watch !== Sync.id());
  page('👨‍👩‍👦 אזור ההורים', '<p class="muted">טוען…</p>');
  let s = S, cfg = Cfg.get();
  if (remote) {
    if (!CLOUD) return page('👨‍👩‍👦 אזור ההורים', '<p class="lead">הסנכרון עוד לא הופעל באתר, אז אי אפשר לראות מכשיר אחר.</p>');
    try {
      const [rs, rc] = await Promise.all([Sync.get(watch, 's'), Sync.get(watch, 'cfg')]);
      s = cleanState(rs); cfg = rc && typeof rc === 'object' ? rc : {};
    } catch { return page('👨‍👩‍👦 אזור ההורים', '<p class="lead">לא הצלחתי לטעון את הנתונים. בדוק חיבור לאינטרנט ונסה שוב.</p><button class="btn" onclick="route()">נסה שוב</button>'); }
  }
  const week = Array.from({ length: 7 }, (_, i) => s.days[dayKey(Date.now() - i * DAY)] || { n: 0, ok: 0, sec: 0 });
  const wn = week.reduce((a, d) => a + d.n, 0), wok = week.reduce((a, d) => a + d.ok, 0), wmin = Math.round(week.reduce((a, d) => a + d.sec, 0) / 60);
  const rk = P.rank(s.pts), last = s.log.at(-1)?.t || s.upd;
  const started = UNITS.filter(u => s.units[u.id]?.tries || s.video[u.id]);
  const weakGens = Object.entries(s.gens).filter(([k, v]) => v.tries >= 3 && unitOf(keyParts(k).u)).map(([k, v]) => ({ k, ...v, r: v.ok / v.tries }))
    .filter(x => x.r < 0.7).sort((a, b) => a.r - b.r).slice(0, 6);
  const misses = s.log.filter(e => e.res !== 'ok' && e.q && unitOf(e.u)).slice(-8).reverse();
  const link = `${location.href.split('#')[0]}#/parent/${Sync.id()}`;

  page('👨‍👩‍👦 אזור ההורים', `
    ${remote ? `<p class="muted">מוצגים הנתונים מהמכשיר של התלמיד (מתעדכנים כמה שניות אחרי כל תרגיל). <button class="btn ghost small unwatch">הצג את המכשיר הזה במקום</button></p>`
      : `<section class="panel share">
          <h2>🔗 לצפייה מהטלפון שלך</h2>
          ${CLOUD ? `<p>פתח את הקישור הזה <b>במכשיר שלך</b> (שלח אותו לעצמך). מאותו רגע תראה שם את ההתקדמות של המכשיר הזה, ותוכל לקבוע נושא ומבחן.</p>
            <div class="linkbox" dir="ltr"><input class="in" readonly value="${link}"><button class="btn copy">העתק</button>${navigator.share ? '<button class="btn ghost shr">שתף</button>' : ''}</div>
            <p class="muted">אם הוא מתרגל גם במכשיר נוסף (מחשב וטלפון), פתח שם את הקישור <bdi dir="ltr">${location.href.split('#')[0]}#/link/${Sync.id()}</bdi> כדי ששני המכשירים יעבדו על אותה התקדמות.</p>`
            : '<p class="note">הסנכרון לאינטרנט עוד לא הופעל, לכן מוצגים רק נתונים מהמכשיר הזה.</p>'}
        </section>`}
    <div class="tiles">
      <div class="tile"><span>פעילות אחרונה</span><b>${ago(last)}</b></div>
      <div class="tile"><span>רצף ימים</span><b>🔥 ${P.streak(s)}</b></div>
      <div class="tile"><span>שאלות השבוע</span><b>${wn}</b></div>
      <div class="tile"><span>דקות השבוע</span><b>${wmin}</b></div>
      <div class="tile"><span>הצלחה בניסיון ראשון</span><b>${wn ? acc(wok, wn) + '%' : '—'}</b></div>
      <div class="tile"><span>דרגה</span><b>${rk.icon} ${rk.name}</b><small>${s.pts} נקודות</small></div>
    </div>
    <section class="panel"><h2>📅 שבועיים אחרונים</h2>${dayChart(s)}</section>
    <section class="panel"><h2>📚 התקדמות לפי נושא</h2>
      ${started.length ? `<div class="tbl"><table><thead><tr><th>נושא</th><th>התקדמות</th><th>הצלחה</th><th>סרטון</th></tr></thead><tbody>
        ${started.map(u => { const p = s.units[u.id] || { ok: 0, tries: 0 };
          return `<tr><td>${u.emoji} ${fmtTitle(u.title)}</td><td><div class="bar"><span style="width:${Math.min(100, 100 * p.ok / GOAL)}%"></span></div><small>${Math.min(p.ok, GOAL)}/${GOAL}${p.ok >= GOAL ? ' ⭐' : ''}</small></td>
            <td>${p.tries ? acc(p.ok, p.tries) + '%' : '—'}</td><td>${s.video[u.id] ? Math.round(100 * s.video[u.id]) + '%' : '—'}</td></tr>`; }).join('')}
      </tbody></table></div><p class="muted">הצלחה = תשובות נכונות מתוך כל הניסיונות. סרטון = כמה מהסרטון נצפה.</p>` : '<p class="muted">עוד לא התחיל אף נושא.</p>'}
    </section>
    <section class="panel"><h2>🎯 איפה הכי קשה לו</h2>
      ${weakGens.length ? `<ul class="mlist">${weakGens.map(x => { const { u, g } = keyParts(x.k), q = lastQ(s, u, g);
        return `<li><b>${acc(x.ok, x.tries)}%</b> <span class="muted">(${x.ok}/${x.tries})</span> <span>${unitOf(u).emoji} ${fmtTitle(unitOf(u).title)}</span>${q ? `<div class="mq">לדוגמה: ${q}</div>` : ''}</li>`; }).join('')}</ul>`
        : '<p class="muted">אין עדיין סוג שאלה שהוא מתקשה בו באופן עקבי (צריך לפחות 3 ניסיונות מכל סוג).</p>'}
      <p class="muted">במחברת הטעויות שלו עכשיו: <b>${Object.keys(s.rev).length}</b> סוגי שאלות, ${P.due(s).length} מהם מחכים לחזרה.</p>
    </section>
    <section class="panel"><h2>❌ טעויות אחרונות</h2>
      ${misses.length ? `<ul class="mlist">${misses.map(e => `<li><span class="muted">${ago(e.t)} · ${unitOf(e.u).emoji} ${fmtTitle(unitOf(e.u).title)} · ${e.res === 'retry' ? 'טעה ואז תיקן' : 'לא הצליח'}</span><div class="mq">${e.q}</div></li>`).join('')}</ul>` : '<p class="muted">אין טעויות אחרונות.</p>'}
    </section>
    <section class="panel"><h2>🩺 אבחון ומבחנים</h2>
      ${s.diag ? `<p>מבחן אבחון (${new Date(s.diag.t).toLocaleDateString('he')}): ${Object.entries(s.diag.res).map(([id, [ok, n]]) => `${unitOf(id)?.emoji || ''} ${ok}/${n}${ok < n * 0.67 ? ' ⚠️' : ''}`).join(' · ')}</p>` : '<p class="muted">עוד לא עשה מבחן אבחון.</p>'}
      ${s.exams.length ? `<ul>${s.exams.slice(-6).reverse().map(e => `<li>${new Date(e.t).toLocaleDateString('he')}: ציון <b>${acc(e.ok, e.n)}</b> · ${e.units.map(id => unitOf(id)?.emoji || '').join(' ')}</li>`).join('')}</ul>` : '<p class="muted">עוד לא עשה מבחן תרגול.</p>'}
    </section>
    <section class="panel ctl"><h2>⚙️ הגדרות בשבילו</h2>
      <label class="fld">📌 מה לומדים עכשיו בכיתה (יופיע בראש הדף שלו ויקבל משקל באימון היומי)
        <select class="in pin"><option value="">— בלי —</option>${UNITS.map(u => `<option value="${u.id}" ${cfg.pin === u.id ? 'selected' : ''}>${u.emoji} ${u.title}</option>`).join('')}</select></label>
      <label class="fld">📅 תאריך המבחן הבא <input type="date" class="in exam-date" value="${esc(cfg.exam?.date || '')}"></label>
      <details ${cfg.exam?.units?.length ? 'open' : ''}><summary>הנושאים במבחן</summary>${UNITS.map(u => `<label class="chk"><input type="checkbox" value="${u.id}" ${cfg.exam?.units?.includes(u.id) ? 'checked' : ''}> ${u.emoji} ${fmtTitle(u.title)}</label>`).join('')}</details>
      <label class="fld">💬 הודעה שתופיע לו בדף הבית <input class="in msg-in" maxlength="140" value="${esc(cfg.msg || '')}" placeholder="כל הכבוד על השבוע! 💪"></label>
      <div class="row"><button class="btn save">שמור</button><span class="fb saved"></span></div>
    </section>`);
  U.math(app);
  app.querySelector('.unwatch')?.addEventListener('click', () => { ls.set('math8watch', ''); route(); });
  app.querySelector('.copy')?.addEventListener('click', e => { const i = app.querySelector('.linkbox input'); i.select(); navigator.clipboard?.writeText(i.value); e.target.textContent = 'הועתק ✓'; });
  app.querySelector('.shr')?.addEventListener('click', () => navigator.share({ title: 'ההתקדמות במתמטיקה', url: link }).catch(() => {}));
  app.querySelector('.save').onclick = async () => {
    const out = app.querySelector('.saved');
    const next = {
      pin: app.querySelector('.pin').value || null,
      exam: { date: app.querySelector('.exam-date').value || null, units: [...app.querySelectorAll('.ctl .chk input:checked')].map(i => i.value) },
      msg: app.querySelector('.msg-in').value.trim() || null,
    };
    try { await Cfg.set(next, remote ? watch : Sync.id()); out.className = 'fb good saved'; out.textContent = 'נשמר ✓'; }
    catch { out.className = 'fb bad saved'; out.textContent = 'השמירה נכשלה — בדוק חיבור לאינטרנט.'; }
  };
};

/* חיבור מכשיר נוסף של התלמיד לאותה התקדמות */
ROUTES.link = async id => {
  if (/^[0-9a-f]{32}$/.test(id || '')) { ls.set('math8id', id); await Sync.pull(); }
  location.hash = '#/';
};

// אחרי הטעינה: מושכים מהענן (מכשיר אחר / הגדרות ההורה) ומרעננים את דף הבית אם משהו השתנה
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('load', async () => {
  if (await Sync.pull() && !location.hash.replace(/^#\/?/, '')) renderHome();
});
