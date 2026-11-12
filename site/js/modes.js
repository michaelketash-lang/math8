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
        ${feelAsk('daily')}<div class="row"><a class="btn" href="#/">לדף הבית</a><button class="btn ghost again">עוד סיבוב</button></div>`;
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
          ${reviewList(results)}${feelAsk('exam')}
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

/** כמה שאלות עשה ביחידה בכל רמה: [{n, ok}] לקל / בינוני / אתגר (ok = נכון בניסיון ראשון) */
function byLevel(s, u) {
  const out = LEVELS.map(() => ({ n: 0, ok: 0 }));
  for (const [k, v] of Object.entries(s.gens)) {
    const { u: ku, g } = keyParts(k), o = ku === u && out[(CH[u]?.exercises[g]?.level || 0) - 1];
    if (o) { o.n += v.tries; o.ok += v.ok; }
  }
  return out;
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

  const wk = weekSummary(s, cfg);
  page('👨‍👩‍👦 אזור ההורים', `
    ${remote ? `<p class="muted">מוצגים הנתונים מהמכשיר של התלמיד (מתעדכנים כמה שניות אחרי כל תרגיל). <button class="btn ghost small unwatch">הצג את המכשיר הזה במקום</button></p>`
      : `<section class="panel share">
          <h2>🔗 לצפייה מהטלפון שלך</h2>
          ${CLOUD ? `<p>פתח את הקישור הזה <b>במכשיר שלך</b> (שלח אותו לעצמך). מאותו רגע תראה שם את ההתקדמות של המכשיר הזה, ותוכל לקבוע נושא ומבחן.</p>
            <div class="linkbox" dir="ltr"><input class="in" readonly value="${link}"><button class="btn copy">העתק</button>${navigator.share ? '<button class="btn ghost shr">שתף</button>' : ''}</div>
            <p class="muted">אם הוא מתרגל גם במכשיר נוסף (מחשב וטלפון), פתח שם את הקישור <bdi dir="ltr">${location.href.split('#')[0]}#/link/${Sync.id()}</bdi> כדי ששני המכשירים יעבדו על אותה התקדמות.</p>`
            : '<p class="note">הסנכרון לאינטרנט עוד לא הופעל, לכן מוצגים רק נתונים מהמכשיר הזה.</p>'}
        </section>`}
    ${wk.html}
    <section class="panel inbox-p"><h2>💬 הודעות אליו</h2>
      <p class="muted">ההודעה תקפוץ לו על המסך באתר (גם אם האתר כבר פתוח אצלו, תוך דקה), ותראה כאן ✓ כשהוא קרא.</p>
      <div class="send-row"><textarea class="in msg-in" maxlength="300" rows="2" placeholder="כל הכבוד על השבוע! 💪"></textarea><button class="btn send">שלח</button></div>
      <span class="fb sent"></span>
      <ul class="mlist msgs"></ul>
    </section>
    <section class="panel tasks-p"><h2>📋 משימות <small class="muted t-sum"></small></h2>
      <div class="bar t-bar"><span></span></div>
      <ul class="tlist t-list"></ul>
      <details class="t-add"><summary>➕ משימה חדשה</summary>
        <label class="fld">סוג <select class="in t-type">${Object.entries(TASK_TYPES).map(([v, d]) => `<option value="${v}">${d.t}</option>`).join('')}</select></label>
        <label class="fld t-u">נושא <select class="in">${UNITS.filter(u => CH[u.id]).map(u => `<option value="${u.id}" ${cfg.pin === u.id ? 'selected' : ''}>${u.emoji} ${u.title}</option>`).join('')}</select></label>
        <label class="fld t-n">כמה <input type="number" class="in" min="1" max="100"></label>
        <label class="fld t-text">מה לעשות <input class="in" maxlength="200" placeholder="לפתור עמוד 45 בספר, תרגילים 1–6"></label>
        <label class="fld">עד מתי (לא חובה) <input type="date" class="in t-due"></label>
        <div class="row"><button class="btn t-save">הוסף משימה</button><span class="fb t-fb"></span></div>
      </details>
    </section>
    <section class="panel rewards-p"><h2>🎁 פרסים</h2>
      <p class="muted">פרס הוא יעד ארוך וקשה בכוונה. כדי להשיג אותו צריך גם <b>כוכבים</b> (רק תשובה נכונה בניסיון ראשון: קל ⭐1, בינוני ⭐2, אתגר ⭐4) וגם <b>דפי עבודה</b> עם 16 נכונות לפחות מתוך 20, כל אחד בנושא אחר. הספירה מתחילה מהרגע שהוספת את הפרס.</p>
      <ul class="tlist r-list"></ul>
      <details class="t-add"><summary>➕ פרס חדש</summary>
        <label class="fld">הפרס <input class="in r-text" maxlength="120" placeholder="הולכים ביחד למשחק של מכבי"></label>
        <label class="fld">כמה קשה <select class="in r-stars">${REWARD_LEVELS.map(l => `<option value="${l.stars}">${l.t}</option>`).join('')}</select></label>
        <label class="fld">כמה דפי עבודה (16+ מתוך 20, בנושאים שונים) <select class="in r-sheets">${[3, 5, 8].map(n => `<option>${n}</option>`).join('')}</select></label>
        <div class="row"><button class="btn r-save">הוסף פרס</button><span class="fb r-fb"></span></div>
      </details>
    </section>
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
      ${started.length ? `<div class="tbl"><table><thead><tr><th>נושא</th><th>התקדמות</th><th>הצלחה</th><th>קל</th><th>בינוני</th><th>אתגר</th><th>סרטון</th></tr></thead><tbody>
        ${started.map(u => { const p = s.units[u.id] || { ok: 0, tries: 0 }, lv = byLevel(s, u.id);
          return `<tr><td>${u.emoji} ${fmtTitle(u.title)}</td><td><div class="bar"><span style="width:${Math.min(100, 100 * p.ok / GOAL)}%"></span></div><small>${Math.min(p.ok, GOAL)}/${GOAL}${p.ok >= GOAL ? ' ⭐' : ''}</small></td>
            <td>${p.tries ? acc(p.ok, p.tries) + '%' : '—'}</td>${lv.map(x => `<td>${x.n ? `<b>${x.n}</b> <small class="muted">(${x.ok} ✓)</small>` : '—'}</td>`).join('')}<td>${s.video[u.id] ? Math.round(100 * s.video[u.id]) + '%' : '—'}</td></tr>`; }).join('')}
      </tbody></table></div><p class="muted">הצלחה = תשובות נכונות מתוך כל הניסיונות. קל / בינוני / אתגר = כמה שאלות עשה בכל רמה (בתרגול, באימון היומי, במבחנים ובדפי העבודה), ובסוגריים כמה מהן נכונות בניסיון ראשון. סרטון = כמה מהסרטון נצפה.</p>` : '<p class="muted">עוד לא התחיל אף נושא.</p>'}
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
      ${s.sheetLog.length ? `<p>📝 דפי עבודה שהגיש:</p><ul>${s.sheetLog.slice(-8).reverse().map(e => `<li>${new Date(e.t).toLocaleDateString('he')}: ${unitOf(e.u)?.emoji || ''} ${fmtTitle(unitOf(e.u)?.title || e.u)} — <b>${e.ok} מתוך ${e.n}</b>${e.lv.length === 3 ? ` <small class="muted">(קל ${e.lv[0]}/4 · בינוני ${e.lv[1]}/10 · אתגר ${e.lv[2]}/6)</small>` : ''}${e.fix ? ` · תרגול תיקון: ${e.fix[0]}/${e.fix[1]}` : ''}</li>`).join('')}</ul>` : '<p class="muted">עוד לא הגיש דף עבודה.</p>'}
      ${s.exams.length ? `<ul>${s.exams.slice(-6).reverse().map(e => `<li>${new Date(e.t).toLocaleDateString('he')}: ציון <b>${acc(e.ok, e.n)}</b> · ${e.units.map(id => unitOf(id)?.emoji || '').join(' ')}</li>`).join('')}</ul>` : '<p class="muted">עוד לא עשה מבחן תרגול.</p>'}
    </section>
    <section class="panel ctl"><h2>⚙️ הגדרות בשבילו</h2>
      <label class="fld">📌 מה לומדים עכשיו בכיתה (יופיע בראש הדף שלו ויקבל משקל באימון היומי)
        <select class="in pin"><option value="">— בלי —</option>${UNITS.map(u => `<option value="${u.id}" ${cfg.pin === u.id ? 'selected' : ''}>${u.emoji} ${u.title}</option>`).join('')}</select></label>
      <label class="fld">📅 תאריך המבחן הבא <input type="date" class="in exam-date" value="${esc(cfg.exam?.date || '')}"></label>
      <details ${cfg.exam?.units?.length ? 'open' : ''}><summary>הנושאים במבחן</summary>${UNITS.map(u => `<label class="chk"><input type="checkbox" value="${u.id}" ${cfg.exam?.units?.includes(u.id) ? 'checked' : ''}> ${u.emoji} ${fmtTitle(u.title)}</label>`).join('')}</details>
      <div class="row"><button class="btn save">שמור</button><span class="fb saved"></span></div>
    </section>`);
  U.math(app);
  const drawMsgs = () => {
    app.querySelector('.msgs').innerHTML = msgsOf(cfg).reverse().map(m => `<li><span class="muted">${ago(m.t)} · ${s.seen >= m.t ? '✓ נקרא' : 'עוד לא נקרא'}</span>
      <div>${esc(m.text)}</div><button class="btn ghost small del" data-t="${m.t}">מחק</button></li>`).join('') || '<li class="muted">עוד לא נשלחו הודעות.</li>';
  };
  const sendMsgs = async (msgs, okText) => {
    const out = app.querySelector('.sent'), next = { ...cfg, msgs: msgs.slice(-20), msg: null };
    try { await Cfg.set(next, remote ? watch : Sync.id()); cfg = next; drawMsgs(); out.className = 'fb good sent'; out.textContent = okText; return true; }
    catch { out.className = 'fb bad sent'; out.textContent = 'השליחה נכשלה — בדוק חיבור לאינטרנט.'; }
  };
  drawMsgs();
  const drawTasks = () => {
    const all = tasksOf(cfg), n = all.filter(k => taskProg(k, s).done).length;
    app.querySelector('.t-sum').textContent = all.length ? `${n} מתוך ${all.length} הושלמו` : '';
    app.querySelector('.t-bar').hidden = !all.length;
    app.querySelector('.t-bar span').style.width = (all.length ? 100 * n / all.length : 0) + '%';
    app.querySelector('.t-list').innerHTML = all.slice().reverse().map(k => { const p = taskProg(k, s);
      return `<li class="${p.done ? 't-ok' : ''}"><div class="t-top"><span>${p.done ? '✅' : '⬜'} ${taskLabel(k)}</span><small class="muted">${p.done > 0 ? `הושלם ${ago(p.done)}` : p.done ? 'הושלם' : dueText(k)}</small></div>
        ${!p.done && p.goal > 1 ? `<div class="bar"><span style="width:${p.pct}%"></span></div><small class="muted">${progText(p)}</small>` : ''}
        <button class="btn ghost small del" data-id="${k.id}">מחק</button></li>`; }).join('') || '<li class="muted">עוד אין משימות. הוסף משימה למטה.</li>';
  };
  const saveTasks = async (tasks, okText) => {
    const out = app.querySelector('.t-fb'), next = { ...cfg, tasks: tasks.slice(-50) };
    try { await Cfg.set(next, remote ? watch : Sync.id()); cfg = next; drawTasks(); out.className = 'fb good t-fb'; out.textContent = okText; return true; }
    catch { out.className = 'fb bad t-fb'; out.textContent = 'השמירה נכשלה — בדוק חיבור לאינטרנט.'; }
  };
  const typeSel = app.querySelector('.t-type'), fld = c => app.querySelector(c);
  const showFields = () => { const d = TASK_TYPES[typeSel.value]; fld('.t-u').hidden = !d.unit; fld('.t-n').hidden = !d.n; fld('.t-text').hidden = !d.text; fld('.t-n input').value = d.n || ''; };
  typeSel.onchange = showFields; showFields();
  drawTasks();
  app.querySelector('.week').onclick = async e => {
    const b = e.target.closest('.sug');
    if (b && await saveTasks([...tasksOf(cfg), { id: Date.now(), ...wk.sug[+b.dataset.i].task }], 'נוספה ✓')) { b.disabled = true; b.textContent = 'נוספה ✓'; }
  };
  const drawRewards = () => {
    app.querySelector('.r-list').innerHTML = rewardsOf(cfg).map(r => { const p = rewardProg(r, s);
      return `<li><div class="t-top"><b>${p.done ? '🏆 ' : ''}${esc(r.text)}</b><small class="muted">${p.done ? 'הושג! מגיע לו הפרס' : ''}</small></div>${rewardBars(r, p)}
        <button class="btn ghost small del" data-id="${r.id}">${p.done ? 'נתתי לו — הסר' : 'מחק'}</button></li>`; }).join('') || '<li class="muted">עוד אין פרסים.</li>';
  };
  const saveRewards = async (rewards, okText) => {
    const out = app.querySelector('.r-fb'), next = { ...cfg, rewards: rewards.slice(-5) };
    try { await Cfg.set(next, remote ? watch : Sync.id()); cfg = next; drawRewards(); out.className = 'fb good r-fb'; out.textContent = okText; return true; }
    catch { out.className = 'fb bad r-fb'; out.textContent = 'השמירה נכשלה — בדוק חיבור לאינטרנט.'; }
  };
  drawRewards();
  app.querySelector('.r-save').onclick = async () => {
    const text = app.querySelector('.r-text').value.trim();
    if (!text) { const out = app.querySelector('.r-fb'); out.className = 'fb bad r-fb'; out.textContent = 'כתוב מה הפרס.'; return; }
    if (await saveRewards([...rewardsOf(cfg), { id: Date.now(), text, stars: +app.querySelector('.r-stars').value, sheets: +app.querySelector('.r-sheets').value, base: s.stars }], 'נוסף ✓')) app.querySelector('.r-text').value = '';
  };
  app.querySelector('.r-list').onclick = e => {
    const id = +e.target.closest('.del')?.dataset.id;
    if (id) saveRewards(rewardsOf(cfg).filter(r => r.id !== id), 'הוסר ✓');
  };
  app.querySelector('.t-save').onclick = async () => {
    const d = TASK_TYPES[typeSel.value], text = fld('.t-text input').value.trim();
    if (d.text && !text) { fld('.t-fb').className = 'fb bad t-fb'; fld('.t-fb').textContent = 'כתוב מה לעשות.'; return; }
    const k = { id: Date.now(), type: typeSel.value, ...(d.unit && { u: fld('.t-u select').value }), ...(d.n && { n: +fld('.t-n input').value || d.n }), ...(d.text && { text }), ...(fld('.t-due').value && { due: fld('.t-due').value }) };
    if (await saveTasks([...tasksOf(cfg), k], 'נוספה ✓')) fld('.t-text input').value = '';
  };
  app.querySelector('.t-list').onclick = e => {
    const id = +e.target.closest('.del')?.dataset.id;
    if (id) saveTasks(tasksOf(cfg).filter(k => k.id !== id), 'נמחקה ✓');
  };
  app.querySelector('.send').onclick = async () => {
    const box = app.querySelector('.msg-in'), text = box.value.trim();
    if (text && await sendMsgs([...msgsOf(cfg), { t: Date.now(), text }], 'נשלח ✓')) box.value = '';
  };
  app.querySelector('.msgs').onclick = e => {
    const t = +e.target.closest('.del')?.dataset.t;
    if (t) sendMsgs(msgsOf(cfg).filter(m => m.t !== t), 'נמחק ✓');
  };
  app.querySelector('.unwatch')?.addEventListener('click', () => { ls.set('math8watch', ''); route(); });
  app.querySelector('.copy')?.addEventListener('click', e => { const i = app.querySelector('.linkbox input'); i.select(); navigator.clipboard?.writeText(i.value); e.target.textContent = 'הועתק ✓'; });
  app.querySelector('.shr')?.addEventListener('click', () => navigator.share({ title: 'ההתקדמות במתמטיקה', url: link }).catch(() => {}));
  app.querySelector('.save').onclick = async () => {
    const out = app.querySelector('.saved');
    const next = {
      ...cfg,
      pin: app.querySelector('.pin').value || null,
      exam: { date: app.querySelector('.exam-date').value || null, units: [...app.querySelectorAll('.ctl .chk input:checked')].map(i => i.value) },
    };
    try { await Cfg.set(next, remote ? watch : Sync.id()); cfg = next; out.className = 'fb good saved'; out.textContent = 'נשמר ✓'; }
    catch { out.className = 'fb bad saved'; out.textContent = 'השמירה נכשלה — בדוק חיבור לאינטרנט.'; }
  };
};

/* ---------- הודעות מההורה: קופצות לתלמיד בכל דף עד שלחץ "קיבלתי" ---------- */
/** ההודעות מתוך הגדרות ההורה (מהענן — לכן בודקים סוגים). msg = הודעה בודדת מהגרסה הקודמת */
function msgsOf(cfg) {
  const list = Array.isArray(cfg.msgs) ? cfg.msgs : cfg.msg ? [{ t: cfg.t, text: cfg.msg }] : [];
  return list.filter(m => m && typeof m.text === 'string' && +m.t).map(m => ({ t: +m.t, text: m.text.slice(0, 300) }));
}
function showInbox() {
  let box = document.getElementById('inbox');
  const hide = /^#\/(parent|sheet)/.test(location.hash), cfg = Cfg.get();
  const unread = hide ? [] : msgsOf(cfg).filter(m => m.t > S.seen), newTasks = hide ? [] : tasksOf(cfg).filter(k => k.id > S.seen && !taskProg(k, S).done);
  const newRewards = hide ? [] : rewardsOf(cfg).filter(r => r.id > S.seen);
  if (!unread.length && !newTasks.length && !newRewards.length) return box?.remove();
  if (!box) { box = document.createElement('div'); box.id = 'inbox'; box.className = 'inbox no-print'; box.setAttribute('role', 'alert'); document.body.appendChild(box); }
  box.innerHTML = `${unread.length ? `<b>💬 ${unread.length > 1 ? `${unread.length} הודעות חדשות` : 'הודעה חדשה'} בשבילך</b>
    ${unread.map(m => `<p>${esc(m.text)} <small class="muted">· ${ago(m.t)}</small></p>`).join('')}` : ''}
    ${newTasks.length ? `<b>📋 ${newTasks.length > 1 ? `${newTasks.length} משימות חדשות` : 'משימה חדשה'}</b>
    ${newTasks.map(k => `<p>${taskLabel(k)} <small class="muted">${dueText(k)}</small></p>`).join('')}` : ''}
    ${newRewards.map(r => `<b>🎁 פרס חדש!</b><p>${esc(r.text)} <small class="muted">· הפרטים בדף הבית</small></p>`).join('')}
    <button class="btn">קיבלתי 👍</button>`;
  box.querySelector('button').onclick = () => { S.seen = Math.max(...unread.map(m => m.t), ...newTasks.map(k => k.id), ...newRewards.map(r => r.id)); P.save(); box.remove(); };
}
// בודקים הודעות חדשות כל דקה (רק כשהדף מוצג), וגם כשחוזרים ללשונית. מופעל מה־load בסוף הקובץ
/** דף שפתוח הרבה זמן: אם האתר עודכן מאז שנטען — מרעננים (רק בדף הבית / אזור ההורים, כדי לא לקטוע תרגיל) */
async function checkVersion() {
  const v = document.querySelector('script[src*="modes.js"]')?.src.match(/[?&]v=(\w+)/)?.[1];
  if (!v || v === 'dev' || !/^#?\/?(parent)?$/.test(location.hash)) return;
  try { const live = (await (await fetch('version.txt', { cache: 'no-store' })).text()).trim(); if (/^\w+$/.test(live) && live !== v) location.reload(); } catch {}
}
async function pollInbox() {
  if (document.hidden) return;
  checkVersion();
  if (!CLOUD) return;
  try {
    const cfg = await Sync.get(Sync.id(), 'cfg');
    if (cfg && JSON.stringify(cfg) !== ls.get('math8cfg')) { ls.set('math8cfg', JSON.stringify(cfg)); if (!location.hash.replace(/^#\/?/, '')) renderHome(); }
  } catch {}
  showInbox();
}

/* ---------- משימות מההורה: ההתקדמות נמדדת לבד מהתרגול (חוץ מדף עבודה / משימה חופשית — הוא מסמן "סיימתי") ---------- */
const TASK_TYPES = {
  practice: { t: '🏀 לפתור נכון תרגילים בנושא', unit: true, n: 10 },
  video: { t: '🎬 לצפות בסרטון של נושא', unit: true },
  sheet: { t: '📝 לפתור דף עבודה בנושא', unit: true },
  daily: { t: '📅 לעשות אימון יומי בכמה ימים', n: 3 },
  free: { t: '✏️ משימה חופשית', text: true },
};
const TASK_PTS = 10;
/** המשימות מתוך הגדרות ההורה (מהענן — בודקים סוגים) */
function tasksOf(cfg) {
  return (Array.isArray(cfg.tasks) ? cfg.tasks : []).filter(k => k && TASK_TYPES[k.type] && +k.id && (!TASK_TYPES[k.type].unit || unitOf(k.u)))
    .map(k => ({ id: +k.id, type: k.type, u: k.u, n: Math.max(1, Math.min(100, +k.n || 1)), text: String(k.text || '').slice(0, 200), due: /^\d{4}-\d\d-\d\d$/.test(k.due) ? k.due : null }));
}
function taskLabel(k) {
  const u = unitOf(k.u), name = u && `${u.emoji} ${fmtTitle(u.title)}`;
  return { practice: `לפתור נכון ${k.n} תרגילים: ${name}`, video: `לצפות בסרטון: ${name}`, sheet: `לפתור דף עבודה: ${name}`,
    daily: k.n === 1 ? 'לעשות אימון יומי' : `לעשות אימון יומי ב־${k.n} ימים שונים`, free: esc(k.text) }[k.type];
}
/** כמה כבר עשה (have מתוך goal) — מחושב ממצב התלמיד s, אז גם ההורה רואה את אותו הדבר */
function taskProg(k, s) {
  const goal = { practice: k.n, daily: k.n, video: 90 }[k.type] || 1;
  const have = k.type === 'practice' ? s.log.filter(e => e.u === k.u && e.t >= k.id && e.res !== 'fail').length
    : k.type === 'video' ? Math.round(100 * (s.video[k.u] || 0))
    : k.type === 'daily' ? Object.entries(s.days).filter(([d, v]) => d >= dayKey(k.id) && v.daily).length
    : k.type === 'sheet' ? +s.sheetLog.some(e => e.u === k.u && e.t >= k.id)
    : 0;
  const done = s.tdone[k.id] || (have >= goal ? -1 : 0); // -1 = הושלם אבל עוד לא נרשם אצל התלמיד
  return { have: done ? goal : Math.min(have, goal), goal, done, pct: done ? 100 : Math.round(100 * Math.min(have, goal) / goal), unit: k.type === 'video' ? '%' : '' };
}
const progText = p => (p.unit ? `נצפו ${p.have}% מהסרטון` : `${p.have} מתוך ${p.goal}`);
const taskLink = k => ({ practice: `#/ch/${k.u}`, video: `#/ch/${k.u}`, sheet: `#/sheet/${k.u}`, daily: '#/daily' }[k.type]);
const dueText = k => k.due ? `עד ${new Date(k.due).toLocaleDateString('he', { day: 'numeric', month: 'numeric' })}${k.due < dayKey() ? ' ⚠️' : ''}` : '';

/** אצל התלמיד: משימה שהגיעה ליעד נרשמת כהושלמה, מקבלים נקודות ורואים הודעה */
function checkTasks() {
  for (const r of rewardsOf(Cfg.get())) if (!S.tdone[r.id] && rewardProg(r, S).done) {
    S.tdone[r.id] = Date.now(); P.save(); toast(`🎁🏆 השגת את הפרס: ${esc(r.text)}! תראה את זה להורים`);
    if (!location.hash.replace(/^#\/?/, '')) renderHome();
  }
  const fresh = tasksOf(Cfg.get()).filter(k => !S.tdone[k.id] && taskProg(k, S).done);
  if (!fresh.length) return;
  for (const k of fresh) S.tdone[k.id] = Date.now();
  P.bonus(TASK_PTS * fresh.length);
  toast(`🏆 השלמת ${fresh.length > 1 ? `${fresh.length} משימות` : `משימה: ${taskLabel(fresh[0])}`}! +${TASK_PTS * fresh.length} נקודות`);
  if (!location.hash.replace(/^#\/?/, '')) renderHome();
}
function toast(html) {
  const t = document.createElement('div');
  t.className = 'toast no-print'; t.setAttribute('role', 'status'); t.innerHTML = html;
  document.body.appendChild(t); setTimeout(() => t.remove(), 5000);
}
/** רשימת המשימות בדף הבית של התלמיד */
function tasksHome() {
  const all = tasksOf(Cfg.get());
  if (!all.length) return '';
  const open = all.filter(k => !taskProg(k, S).done), n = all.length - open.length;
  return `<section class="panel tasks"><h2>📋 המשימות שלי <small class="muted">${n} מתוך ${all.length} הושלמו</small></h2>
    ${open.length ? `<ul class="tlist">${open.map(k => { const p = taskProg(k, S), link = taskLink(k);
      return `<li><div class="t-top"><span>${taskLabel(k)}</span><small class="muted">${dueText(k)}</small></div>
        ${p.goal > 1 ? `<div class="bar"><span style="width:${p.pct}%"></span></div><small class="muted">${progText(p)}</small>` : ''}
        <div class="row">${link ? `<a class="btn small" href="${link}">לביצוע ←</a>` : ''}${k.type === 'free' ? `<button class="btn ghost small t-done" data-id="${k.id}">סיימתי ✓</button>` : ''}</div></li>`; }).join('')}</ul>`
      : '<p>🏆 סיימת את כל המשימות! כל הכבוד!</p>'}
  </section>`;
}
if (typeof document !== 'undefined' && document.addEventListener) document.addEventListener('click', e => {
  const b = e.target.closest?.('.t-done');
  if (!b) return;
  const k = tasksOf(Cfg.get()).find(k => k.id === +b.dataset.id);
  if (k && !S.tdone[k.id]) { S.tdone[k.id] = Date.now(); P.bonus(TASK_PTS); toast(`🏆 השלמת משימה: ${taskLabel(k)}! +${TASK_PTS} נקודות`); renderHome(); }
});
// בודקים משימות אחרי כל תשובה (כדי לחגוג מיד כשמגיעים ליעד)
const pDone = P.done.bind(P);
P.done = a => { pDone(a); checkTasks(); };

/* חיבור מכשיר נוסף של התלמיד לאותה התקדמות */
ROUTES.link = async id => {
  if (/^[0-9a-f]{32}$/.test(id || '')) { ls.set('math8id', id); await Sync.pull(); }
  location.hash = '#/';
};
/* ---------- דף עבודה: 20 תרגילים (4 קלים · 10 בינוניים · 6 אתגר). פותרים על דף, חוזרים ומקלידים תשובות,
   ורק אחרי ההגשה רואים מה נכון ואת הפתרונות המלאים. הדף נשמר לפי seed (S.sheets[יחידה]) כדי שיחזור זהה. ---------- */
const SHEET = [{ lv: 1, n: 4, t: 'קל' }, { lv: 2, n: 10, t: 'בינוני' }, { lv: 3, n: 6, t: 'אתגר' }];
const ABC = 'אבגדהו';
/** מריץ את fn כש־Math.random נותן סדרה קבועה לפי seed (mulberry32) — אותו seed, אותו דף */
function withSeed(seed, fn) {
  const real = Math.random; let a = seed >>> 0;
  Math.random = () => { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  try { return fn(); } finally { Math.random = real; }
}
function sheetItems(def) {
  const seen = new Set();
  return SHEET.map(s => {
    const gs = U.shuffle(def.exercises.map((e, g) => ({ e, g })).filter(x => x.e.level === s.lv));
    return { ...s, qs: Array.from({ length: s.n }, (_, i) => {
      // מחוללים לפי הסבב, כדי שכל סוגי השאלות יופיעו; שאלה שכבר יצאה — מגרילים שוב
      let cur, k = 0;
      do cur = gs[i % gs.length].e.gen(); while (seen.has(cur.q) && ++k < 20);
      seen.add(cur.q);
      return { ...cur, g: gs[i % gs.length].g, lv: s.lv };
    }) };
  });
}
function sheetBlank(cur) {
  if (cur.type === 'choice') return `<ol class="sh-choices">${cur.choices.map((c, i) => `<li><b>${ABC[i]}.</b> ${c}</li>`).join('')}</ol>`;
  if (cur.type === 'pair') return '<div class="sh-line" dir="ltr">( ______ , ______ )</div>';
  if (cur.type === 'set') return `<div class="sh-line" dir="ltr">${Array(cur.n || cur.answer.length).fill('______').join(' , ')}</div>`;
  return '<div class="sh-line">תשובה: ____________</div>';
}
/** שדות להקלדת התשובה לשאלה i (v = מה שכבר הוקלד, מופרד ב־|) */
function sheetInput(cur, i, v = '') {
  const vals = v.split('|');
  if (cur.type === 'choice') return cur.choices.map((_, c) => `<label class="sh-pick"><input type="radio" name="sq${i}" value="${c}" ${vals[0] === String(c) ? 'checked' : ''}> ${ABC[c]}</label>`).join('');
  const n = cur.type === 'pair' ? 2 : cur.type === 'set' ? (cur.n || cur.answer.length) : 1;
  const ins = Array.from({ length: n }, (_, k) => `<input class="in" inputmode="decimal" autocomplete="off" aria-label="תשובה לשאלה ${i + 1}" value="${esc(vals[k] || '')}">`).join(' , ');
  return `<span dir="ltr">${cur.type === 'pair' ? `( ${ins} )` : ins}</span>`;
}
/** התשובה שהוקלדה כטקסט, והאם היא נכונה (null = חסר) */
function sheetGrade(cur, v = '') {
  const vals = v.split('|');
  if (cur.type === 'choice') return { ok: vals[0] === '' ? null : checkVals(cur, [], +vals[0]), text: vals[0] === '' ? '—' : `${ABC[+vals[0]]}. ${cur.choices[+vals[0]] ?? ''}`, diag: diagnose(cur, [], +vals[0]) };
  return { ok: checkVals(cur, vals.map(parseNum)), diag: diagnose(cur, vals.map(parseNum)), text: `<bdi dir="ltr">${esc(cur.type === 'pair' ? `(${vals.join(', ')})` : vals.join(' , '))}</bdi>` };
}
ROUTES.sheet = id => {
  const u = unitOf(id), def = CH[id];
  if (!u || !def) return renderHome();
  document.title = `דף עבודה · ${u.title}`;
  const fresh = () => { S.sheets[id] = { seed: U.R(10000, 99999), t: Date.now(), done: 0, ok: 0, given: [] }; P.save(); };
  if (!S.sheets[id]) fresh();
  const st = S.sheets[id], parts = withSeed(st.seed, () => sheetItems(def)), qs = parts.flatMap(p => p.qs);
  const res = st.done ? qs.map((cur, i) => sheetGrade(cur, st.given[i])) : null;
  let num = 0;
  app.innerHTML = `
    <div class="no-print">
      <a class="back" href="#/ch/${id}">→ חזרה ליחידה</a>
      <div class="panel sheet-bar">
        ${st.done ? `<p class="lead">הדף נבדק: <b>${st.ok} מתוך ${qs.length}</b> נכונות ${st.ok >= 17 ? '🏆' : st.ok >= 12 ? '💪' : ''}. ליד כל שאלה מופיע מה ענית, התשובה הנכונה והפתרון המלא.</p>`
          : `<p class="lead">20 תרגילים לפתור על דף: 4 קלים, 10 בינוניים ו־6 אתגר. אחרי שפתרת, חזור לכאן והקלד את התשובות <a href="#sh-form" data-jump>בתחתית הדף</a> — ואז תראה מה נכון ואת הפתרונות המלאים.</p>`}
        <div class="row">
          <button class="btn print">⬇️ הורדה כ־PDF / הדפסה</button>
          <button class="btn ghost again">🔄 ${st.done ? 'דף חדש' : 'דף אחר'}</button>
          ${st.done && st.ok < qs.length ? `<a class="btn fix" href="#/sheetfix/${id}">🔁 תרגול תיקון: רק מה שטעית</a>` : ''}
        </div>
        ${st.done && !S.feel.some(f => f.w === 'sheet:' + id && f.t >= st.done) ? feelAsk('sheet:' + id) : ''}
        <p class="muted">בחלון שנפתח בוחרים "שמירה כ־PDF" (Save as PDF) כדי להוריד, או מדפסת כדי להדפיס. הדף נשמר — אפשר לסגור ולחזור אליו.</p>
      </div>
    </div>
    <article class="sheet">
      <header class="sh-head">
        <h1>${u.emoji} דף עבודה: ${fmtTitle(u.title)}</h1>
        <div class="sh-name">שם: ________________ &nbsp; תאריך: ____________ &nbsp; ציון: ${st.done ? `<b>${st.ok}</b>` : '______'} / 20 &nbsp; <span class="muted">דף מס׳ ${st.seed}</span></div>
      </header>
      ${parts.map(p => `
        <h2>${p.t} (${p.n} תרגילים)</h2>
        <ol class="sh-qs" start="${num + 1}">${p.qs.map(cur => { const r = res?.[num++];
          return `<li class="${r ? (r.ok ? 'r-ok' : 'r-bad') : ''}"><div class="q">${r ? (r.ok ? '✅ ' : '❌ ') : ''}${cur.q}</div>${cur.mount ? '<div class="qviz"></div>' : ''}
            ${r ? `${cur.type === 'choice' ? sheetBlank(cur) : ''}<div class="sh-res">התשובה שלך: ${r.text}${r.ok ? '' : ` · התשובה הנכונה: ${cur.type === 'choice' ? `${ABC[cur.answer]}. ` : ''}${answerText(cur)}`}</div>${r.ok ? '' : diagHtml(r.diag)}
              <details class="no-print"><summary>👣 הפתרון המלא</summary><ol class="steps">${cur.steps.map(x => `<li>${x}</li>`).join('')}</ol></details>` : sheetBlank(cur)}</li>`; }).join('')}
        </ol>`).join('')}
    </article>
    ${st.done ? '' : `<section class="panel no-print" id="sh-form">
      <h2>✍️ סיימת לפתור? הקלד כאן את התשובות</h2>
      <p class="muted">צריך למלא את כל 20 התשובות (אם לא הצלחת — נחש). מה שהקלדת נשמר גם אם תצא מהדף. אפשר לכתוב שבר כמו 3/4.</p>
      <ol class="sh-form">${qs.map((cur, i) => `<li>${sheetInput(cur, i, st.given[i])}</li>`).join('')}</ol>
      <div class="row"><button class="btn submit">בדוק את הדף ←</button></div><div class="fb" aria-live="polite"></div>
    </section>`}`;
  withSeed(st.seed + 1, () => app.querySelectorAll('.sh-qs > li').forEach((li, i) => {
    try { qs[i].mount?.(li.querySelector('.qviz')); } catch (err) { console.error(err); }
  }));
  app.querySelector('[data-jump]')?.addEventListener('click', e => { e.preventDefault(); app.querySelector('#sh-form').scrollIntoView({ behavior: 'smooth' }); });
  app.querySelector('.print').onclick = () => print();
  app.querySelector('.again').onclick = () => {
    if (!st.done && st.given.some(Boolean) && !confirm('להחליף לדף אחר? התשובות שהקלדת לדף הזה יימחקו.')) return;
    fresh(); ROUTES.sheet(id); scrollTo(0, 0);
  };
  U.math(app);
  if (st.done) return;

  const form = app.querySelector('.sh-form'), rows = [...form.children];
  const read = () => rows.map((li, i) => (qs[i].type === 'choice' ? li.querySelector('input:checked')?.value ?? '' : [...li.querySelectorAll('.in')].map(x => x.value.trim()).join('|')));
  form.addEventListener('change', () => { st.given = read(); P.save(); });
  app.querySelector('.submit').onclick = () => {
    st.given = read();
    const graded = qs.map((cur, i) => sheetGrade(cur, st.given[i])), missing = graded.flatMap((r, i) => (r.ok === null ? [i + 1] : []));
    rows.forEach((li, i) => li.classList.toggle('miss', graded[i].ok === null));
    if (missing.length) {
      const fb = app.querySelector('#sh-form .fb'); fb.className = 'fb warn';
      fb.textContent = `חסרה תשובה (או שהיא לא מספר) ${missing.length === 1 ? 'בשאלה' : 'בשאלות'}: ${missing.join(', ')}`;
      return P.save();
    }
    st.done = Date.now(); st.ok = graded.filter(r => r.ok).length;
    S.sheetLog.push({ t: st.done, u: id, ok: st.ok, n: qs.length, lv: SHEET.map(s => qs.filter((cur, i) => cur.lv === s.lv && graded[i].ok).length) });
    qs.forEach((cur, i) => { P.add(id, graded[i].ok); P.done({ u: id, g: cur.g, res: graded[i].ok ? 'ok' : 'fail', q: cur.q }); });
    ROUTES.sheet(id); scrollTo(0, 0);
  };
};

/* תרגול תיקון אחרי דף עבודה: שאלות חדשות רק מסוגי השאלות שטעה בהם, על המסך ועם רמזים */
ROUTES.sheetfix = id => {
  const u = unitOf(id), def = CH[id], st = S.sheets[id];
  if (!u || !def || !st?.done) return ROUTES.sheet(id);
  document.title = `תרגול תיקון · ${u.title}`;
  const qs = withSeed(st.seed, () => sheetItems(def)).flatMap(p => p.qs);
  const gens = [...new Set(qs.filter((cur, i) => !sheetGrade(cur, st.given[i]).ok).map(cur => cur.g))];
  if (!gens.length) return ROUTES.sheet(id);
  const items = U.shuffle(gens.length <= 3 ? [...gens, ...gens] : gens).slice(0, 10).map(g => ({ u: id, g }));
  app.innerHTML = `<a class="back" href="#/sheet/${id}">→ חזרה לדף העבודה</a><h1>🔁 תרגול תיקון</h1>
    <p class="lead">${items.length} שאלות חדשות, רק מהסוגים שטעית בהם בדף. הפעם יש רמזים ופתרונות — המטרה היא להבין.</p><section class="panel set"></section>`;
  runSet(app.querySelector('.set'), items, {
    review: true,
    onEnd(results) {
      const ok = results.filter(r => r.res === 'ok').length, e = [...S.sheetLog].reverse().find(e => e.u === id && e.t === st.done);
      if (e) { e.fix = [ok, results.length]; P.save(); }
      app.querySelector('.set').innerHTML = `<h2>${ok === results.length ? 'תיקנת הכול! 🏆' : 'סיימת את התיקון 💪'}</h2>${resultLine(results)}${feelAsk('fix:' + id)}
        <div class="row"><a class="btn" href="#/sheet/${id}">חזרה לדף העבודה</a><a class="btn ghost" href="#/">לדף הבית</a></div>`;
    },
  });
};

/* ---------- פרסים שההורה קובע. קשה בכוונה: צריך גם כוכבים (נכון בניסיון ראשון; קל 1, בינוני 2, אתגר 4)
   וגם דפי עבודה עם 16+ מתוך 20 בנושאים שונים — אי אפשר לצבור רק משאלות קלות. ---------- */
const REWARD_LEVELS = [{ stars: 300, t: 'קשה — 300 כוכבים (בערך חודש של תרגול כמעט יומי)' }, { stars: 600, t: 'קשה מאוד — 600 כוכבים (בערך חודשיים)' }, { stars: 1000, t: 'אגדי — 1000 כוכבים (בערך חצי שנה)' }];
const SHEET_PASS = 0.8;
function rewardsOf(cfg) {
  return (Array.isArray(cfg.rewards) ? cfg.rewards : []).filter(r => r && +r.id && typeof r.text === 'string')
    .map(r => ({ id: +r.id, text: r.text.slice(0, 120), stars: Math.max(150, Math.min(5000, +r.stars || 300)), sheets: Math.max(1, Math.min(10, +r.sheets || 3)), base: +r.base || 0 }));
}
function rewardProg(r, s) {
  const stars = Math.max(0, Math.min(r.stars, s.stars - r.base));
  const sheets = Math.min(r.sheets, new Set(s.sheetLog.filter(e => e.t >= r.id && e.ok >= e.n * SHEET_PASS).map(e => e.u)).size);
  return { stars, sheets, done: s.tdone[r.id] || (stars >= r.stars && sheets >= r.sheets ? -1 : 0) };
}
const rewardBars = (r, p) => `
  <div class="bar"><span style="width:${100 * p.stars / r.stars}%"></span></div><small class="muted">⭐ ${p.stars} מתוך ${r.stars} כוכבים</small>
  <div class="bar"><span style="width:${100 * p.sheets / r.sheets}%"></span></div><small class="muted">📝 ${p.sheets} מתוך ${r.sheets} דפי עבודה עם 16 נכונות לפחות, כל אחד בנושא אחר</small>`;
function rewardsHome() {
  const all = rewardsOf(Cfg.get());
  if (!all.length) return '';
  return `<section class="panel tasks"><h2>🎁 הפרסים שלי</h2><ul class="tlist">${all.map(r => { const p = rewardProg(r, S);
    return `<li><div class="t-top"><b>${esc(r.text)}</b></div>${p.done ? '<p>🏆 השגת את הפרס! תראה את זה להורים.</p>' : rewardBars(r, p)}</li>`; }).join('')}</ul>
    <p class="muted">איך צוברים כוכבים? רק תשובה נכונה בניסיון הראשון: שאלה קלה ⭐1, בינונית ⭐2, אתגר ⭐4.</p></section>`;
}

/* ---------- סיכום שבועי להורה: השבוע מול השבוע שעבר, מה השתפר / ירד, והצעות למשימות ---------- */
function weekSummary(s, cfg) {
  const now = Date.now(), win = k => Array.from({ length: 7 }, (_, i) => s.days[dayKey(now - (i + 7 * k) * DAY)] || { n: 0, ok: 0, sec: 0 });
  const tot = w => ({ n: w.reduce((a, d) => a + d.n, 0), ok: w.reduce((a, d) => a + d.ok, 0), min: Math.round(w.reduce((a, d) => a + d.sec, 0) / 60), days: w.filter(d => d.n).length });
  const a = tot(win(0)), b = tot(win(1));
  const diff = (x, y, unit = '') => (!y ? '' : x === y ? '<small class="muted">כמו שבוע שעבר</small>' : `<small class="${x > y ? 'up' : 'down'}">${x > y ? '▲' : '▼'} ${Math.abs(x - y)}${unit} לעומת שבוע שעבר</small>`);
  // דיוק לפי נושא בכל שבוע, מתוך יומן השאלות
  const unitAcc = k => { const o = {}; for (const e of s.log) { if (e.t > now - 7 * (k + 1) * DAY && e.t <= now - 7 * k * DAY && unitOf(e.u)) { const x = o[e.u] ||= { n: 0, ok: 0 }; x.n++; if (e.res === 'ok') x.ok++; } } return o; };
  const ua = unitAcc(0), ub = unitAcc(1), name = id => `${unitOf(id).emoji} ${fmtTitle(unitOf(id).title)}`;
  const moved = Object.keys(ua).filter(id => ua[id].n >= 4 && ub[id]?.n >= 4).map(id => ({ id, d: acc(ua[id].ok, ua[id].n) - acc(ub[id].ok, ub[id].n) }));
  const lines = [];
  for (const m of moved.filter(m => m.d >= 10)) lines.push(`📈 השתפר ב${name(m.id)}: ${acc(ub[m.id].ok, ub[m.id].n)}% ← ${acc(ua[m.id].ok, ua[m.id].n)}%`);
  for (const m of moved.filter(m => m.d <= -10)) lines.push(`📉 ירד ב${name(m.id)}: ${acc(ub[m.id].ok, ub[m.id].n)}% ← ${acc(ua[m.id].ok, ua[m.id].n)}%`);
  const sheets = s.sheetLog.filter(e => e.t > now - 7 * DAY);
  if (sheets.length) lines.push(`📝 הגיש ${sheets.length === 1 ? 'דף עבודה אחד' : sheets.length + ' דפי עבודה'}: ${sheets.map(e => `${e.ok}/${e.n}`).join(', ')}`);
  const tasks = tasksOf(cfg), doneW = tasks.filter(k => s.tdone[k.id] > now - 7 * DAY).length, open = tasks.filter(k => !taskProg(k, s).done);
  if (doneW) lines.push(`✅ השלים ${doneW === 1 ? 'משימה אחת' : doneW + ' משימות'} השבוע`);
  const late = open.filter(k => k.due && k.due < dayKey()).length;
  if (late) lines.push(`⚠️ ${late === 1 ? 'משימה אחת עברה' : late + ' משימות עברו'} את התאריך`);
  const feels = s.feel.filter(f => f.t > now - 7 * DAY), where = w => { const [k, id] = w.split(':'); return unitOf(id) ? name(id) : { daily: 'אימון יומי', exam: 'מבחן תרגול', spot: 'מצא את הטעות' }[k] || ''; };
  if (feels.length) lines.push(`💭 איך הוא הרגיש אחרי התרגול: ${[3, 2, 1].filter(v => feels.some(f => f.v === v)).map(v => `${FEEL[v]} ×${feels.filter(f => f.v === v).length}`).join(' · ')}${
    feels.some(f => f.v === 1) ? ` <small class="muted">(לא הבין: ${[...new Set(feels.filter(f => f.v === 1).map(f => where(f.w)).filter(Boolean))].join(', ')})</small>` : ''}`);
  const cardsOpen = cardUnits().filter(u => cardState(u, s).open).length;
  // הצעות למשימות (עד 3), בלי להציע משימה שכבר פתוחה
  const sug = [], has = (type, u) => open.some(k => k.type === type && (!u || k.u === u)), add = (why, task) => { if (sug.length < 3 && !has(task.type, task.u) && !sug.some(x => x.task.type === task.type && x.task.u === task.u)) sug.push({ why, task }); };
  const idle = Math.round((new Date(dayKey()) - new Date(dayKey(s.log.at(-1)?.t || s.upd || now))) / DAY);
  if (a.days < 3) add(idle >= 3 ? `לא תרגל כבר ${idle} ימים` : `תרגל רק ב־${a.days} ימים השבוע`, { type: 'daily', n: 3 });
  const weak = Object.entries(ua).filter(([, x]) => x.n >= 4 && x.ok / x.n < 0.7).sort((p, q) => p[1].ok / p[1].n - q[1].ok / q[1].n)[0];
  if (weak) add(`מתקשה ב${name(weak[0])} (${acc(weak[1].ok, weak[1].n)}% השבוע)`, { type: 'practice', u: weak[0], n: 10 });
  const pin = unitOf(cfg.pin);
  if (pin && CH[pin.id] && (s.video[pin.id] || 0) < 0.9) add(`עוד לא צפה בסרטון של מה שלומדים בכיתה`, { type: 'video', u: pin.id });
  const ready = UNITS.find(u => CH[u.id] && (s.units[u.id]?.ok || 0) >= GOAL && !s.sheetLog.some(e => e.u === u.id));
  if (ready) add(`סיים את התרגול ב${name(ready.id)} ועוד לא עשה דף עבודה`, { type: 'sheet', u: ready.id });
  const failed = [...s.sheetLog].reverse().find(e => e.ok < e.n * SHEET_PASS && unitOf(e.u) && !s.sheetLog.some(f => f.u === e.u && f.t > e.t));
  if (failed) add(`קיבל ${failed.ok}/${failed.n} בדף העבודה של ${name(failed.u)}`, { type: 'practice', u: failed.u, n: 10 });
  const html = `<section class="panel week"><h2>🗓️ סיכום השבוע</h2>
    <div class="tiles">
      <div class="tile"><span>ימי תרגול</span><b>${a.days} מתוך 7</b>${diff(a.days, b.days)}</div>
      <div class="tile"><span>שאלות</span><b>${a.n}</b>${diff(a.n, b.n)}</div>
      <div class="tile"><span>דקות</span><b>${a.min}</b>${diff(a.min, b.min)}</div>
      <div class="tile"><span>נכון בניסיון ראשון</span><b>${a.n ? acc(a.ok, a.n) + '%' : '—'}</b>${a.n && b.n ? diff(acc(a.ok, a.n), acc(b.ok, b.n), '%') : ''}</div>
    </div>
    ${lines.length ? `<ul>${lines.map(l => `<li>${l}</li>`).join('')}</ul>` : `<p class="muted">${a.n ? 'אין שינוי בולט לעומת השבוע שעבר.' : 'לא תרגל השבוע.'}</p>`}
    <p class="muted">⏱️ שיא בזריקות עונשין: <b>${s.ft.best}</b> סלים (${s.ft.n} משחקים) · 🕵️ מצא את הטעות: ${s.spot.ok} מתוך ${s.spot.n} בניסיון ראשון · 🃏 קלפים: ${cardsOpen} מתוך ${cardUnits().length}</p>
    ${sug.length ? `<h3>💡 מה כדאי לתת לו עכשיו</h3><ul class="tlist">${sug.map((x, i) => `<li><div class="t-top"><span>${x.why} ← <b>${taskLabel({ n: 1, ...x.task })}</b></span><button class="btn small sug" data-i="${i}">➕ הוסף כמשימה</button></div></li>`).join('')}</ul>` : ''}
  </section>`;
  return { html, sug };
}

// אחרי הטעינה: מושכים מהענן (מכשיר אחר / הגדרות ההורה) ומרעננים את דף הבית אם משהו השתנה
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('load', async () => {
  if (await Sync.pull() && !location.hash.replace(/^#\/?/, '')) renderHome();
  showInbox();
  checkTasks();
  window.addEventListener('hashchange', () => { checkTasks(); showInbox(); });
  document.addEventListener('visibilitychange', pollInbox);
  setInterval(pollInbox, 60e3);
});
