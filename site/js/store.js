/* מצב התלמיד: התקדמות, טעויות לחזרה, ימי אימון, נקודות.
   נשמר ב־localStorage ('math8'), ואם CLOUD מוגדר — מסתנכרן ל־Firebase Realtime Database כדי שההורה יראה. */

// כתובת ה־Realtime Database (Firebase), למשל 'https://math8-xxxx-default-rtdb.europe-west1.firebasedatabase.app'. ריק = בלי סנכרון.
const CLOUD = 'https://math8-5165e-default-rtdb.europe-west1.firebasedatabase.app';

const DAY = 864e5;
const BOXES = [1, 3, 7, 14];    // ימים עד החזרה הבאה על מיומנות שטעו בה; אחרי 4 הצלחות בחזרה היא יוצאת מהמחברת
const DAILY_N = 8;              // שאלות באימון יומי
const STREAK_MIN = 5;           // שאלות ביום כדי שהיום ייחשב לרצף
const RANKS = [[0, 'ספסל', '🪑'], [40, 'מחליף', '👟'], [120, 'שחקן רוטציה', '🔄'], [250, 'חמישייה פותחת', '🏀'],
  [450, 'קלע', '🎯'], [700, 'כוכב הקבוצה', '⭐'], [1000, 'MVP', '🏆'], [1500, 'היכל התהילה', '👑']];

const dayKey = (t = Date.now()) => new Date(t).toLocaleDateString('sv'); // YYYY-MM-DD בשעון המקומי
const ls = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch {} },
};

function blankState() { return { v: 2, upd: 0, units: {}, gens: {}, rev: {}, days: {}, log: [], diag: null, exams: [], video: {}, pts: 0 }; }

function loadState() {
  let s; try { s = JSON.parse(ls.get('math8') || '{}'); } catch { s = {}; }
  if (s.v !== 2) s = { ...blankState(), units: s }; // גרסה 1 שמרה רק {id: {ok, tries}}
  return { ...blankState(), ...s };
}

/** מיזוג שני מצבים (מכשיר ↔ ענן). shortcut: מונים לפי max ולא סכום — אם שני מכשירים תרגלו במקביל, חלק מהספירה הולך לאיבוד. */
function mergeState(a, b) {
  const maxMap = (x = {}, y = {}) => {
    const o = { ...x };
    for (const [k, v] of Object.entries(y)) o[k] = o[k] ? Object.fromEntries(Object.keys({ ...o[k], ...v }).map(f => [f, Math.max(o[k][f] || 0, v[f] || 0)])) : v;
    return o;
  };
  const seen = new Set(), log = [];
  for (const e of [...(a.log || []), ...(b.log || [])].sort((p, q) => p.t - q.t)) {
    const k = e.t + e.u + e.g; if (!seen.has(k)) { seen.add(k); log.push(e); }
  }
  const newer = (a.upd || 0) >= (b.upd || 0) ? a : b;
  const exams = [...(a.exams || []), ...(b.exams || [])].filter((e, i, arr) => arr.findIndex(f => f.t === e.t) === i).sort((p, q) => p.t - q.t);
  const diag = [a.diag, b.diag].filter(Boolean).sort((p, q) => q.t - p.t)[0] || null;
  const video = { ...a.video }; for (const [k, v] of Object.entries(b.video || {})) video[k] = Math.max(video[k] || 0, v);
  return {
    v: 2, upd: Math.max(a.upd || 0, b.upd || 0), units: maxMap(a.units, b.units), gens: maxMap(a.gens, b.gens),
    rev: newer.rev || {}, days: maxMap(a.days, b.days), log: log.slice(-300), diag, exams: exams.slice(-30), video,
    pts: Math.max(a.pts || 0, b.pts || 0),
  };
}

/** HTML של שאלה ממקור חיצוני: בלי סקריפטים ובלי מאפייני on…, src, href, style */
function cleanHtml(html) {
  const t = document.createElement('template'); t.innerHTML = html;
  t.content.querySelectorAll('*').forEach(e => {
    if (/^(SCRIPT|IFRAME|OBJECT|EMBED|STYLE|LINK|META|FORM|INPUT)$/.test(e.tagName)) e.remove();
    else [...e.attributes].forEach(a => { if (/^on|^(src|href|style|srcdoc|action)$/i.test(a.name)) e.removeAttribute(a.name); });
  });
  return t.innerHTML;
}
/** מצב שהגיע מהענן הוא קלט חיצוני (כל מי שיש לו את הקישור יכול לכתוב): מספרים נשארים מספרים, HTML מנוקה */
function cleanState(s) {
  s = { ...blankState(), ...(s && typeof s === 'object' ? s : {}) };
  const obj = o => (o && typeof o === 'object' ? Object.entries(o) : []);
  const nums = o => Object.fromEntries(obj(o).filter(([, v]) => v && typeof v === 'object').map(([k, v]) => [k, Object.fromEntries(obj(v).map(([f, x]) => [f, +x || 0]))]));
  const arr = a => (Array.isArray(a) ? a.filter(e => e && typeof e === 'object') : []);
  return {
    v: 2, upd: +s.upd || 0, pts: +s.pts || 0, units: nums(s.units), gens: nums(s.gens), days: nums(s.days), rev: nums(s.rev),
    log: arr(s.log).map(e => ({ t: +e.t || 0, u: String(e.u), g: +e.g || 0, res: ['ok', 'retry'].includes(e.res) ? e.res : 'fail', q: typeof e.q === 'string' ? cleanHtml(e.q) : null })),
    exams: arr(s.exams).map(e => ({ t: +e.t || 0, ok: +e.ok || 0, n: +e.n || 0, units: Array.isArray(e.units) ? e.units.map(String) : [] })),
    video: Object.fromEntries(obj(s.video).map(([k, v]) => [k, +v || 0])),
    diag: s.diag && typeof s.diag === 'object' ? { t: +s.diag.t || 0, res: Object.fromEntries(obj(s.diag.res).map(([k, v]) => [k, [+v?.[0] || 0, +v?.[1] || 0]])) } : null,
  };
}

let S = loadState();

const P = {
  get(id) { return S.units[id] || { ok: 0, tries: 0 }; },
  /** ניסיון בודד ביחידה (להתקדמות היחידה) */
  add(id, ok) {
    const p = S.units[id] || (S.units[id] = { ok: 0, tries: 0 });
    p.tries++; if (ok) p.ok++;
    this.save(); return p;
  },
  /** שאלה שהסתיימה. res: 'ok' בניסיון ראשון · 'retry' נכון אחרי טעות · 'fail' ראה פתרון / ויתר.
      review=true: החזרה נחשבת גם אם המועד עוד לא הגיע (במחברת הטעויות). */
  done({ u, g, res, q, review = false }) {
    const key = `${u}:${g}`, now = Date.now(), ok = res === 'ok';
    const gs = S.gens[key] || (S.gens[key] = { ok: 0, tries: 0 });
    gs.tries++; if (ok) gs.ok++;
    const d = S.days[dayKey()] || (S.days[dayKey()] = { n: 0, ok: 0, sec: 0 });
    d.n++; if (ok) d.ok++;
    S.pts += ok ? 2 : res === 'retry' ? 1 : 0;
    const r = S.rev[key];
    if (!ok) S.rev[key] = { box: 0, due: now + DAY };
    else if (r && (review || r.due <= now)) {
      if (++r.box >= BOXES.length) delete S.rev[key]; else r.due = now + BOXES[r.box] * DAY;
    }
    S.log.push({ t: now, u, g, res, q: q && q.length < 400 ? q : null });
    if (S.log.length > 300) S.log = S.log.slice(-300);
    this.save();
  },
  bonus(n) { S.pts += n; this.save(); },
  save() { S.upd = Date.now(); ls.set('math8', JSON.stringify(S)); Sync.push(); },

  /* ---- נתונים מחושבים (גם לדף ההורים, על מצב של מכשיר אחר) ---- */
  streak(s = S) {
    let n = 0, t = Date.now();
    if (!((s.days[dayKey(t)]?.n || 0) >= STREAK_MIN)) t -= DAY; // היום עוד לא נגמר — לא שובר את הרצף
    while ((s.days[dayKey(t)]?.n || 0) >= STREAK_MIN) { n++; t -= DAY; }
    return n;
  },
  rank(pts = S.pts) {
    let i = 0; while (i + 1 < RANKS.length && pts >= RANKS[i + 1][0]) i++;
    const [, name, icon] = RANKS[i], next = RANKS[i + 1];
    return { name, icon, next: next && { name: next[1], need: next[0] - pts, pct: Math.round(100 * (pts - RANKS[i][0]) / (next[0] - RANKS[i][0])) } };
  },
  due(s = S) { const now = Date.now(); return Object.entries(s.rev).filter(([, r]) => r.due <= now).map(([k]) => k); },
  today(s = S) { return s.days[dayKey()] || { n: 0, ok: 0, sec: 0 }; },
};

/* ---------- זמן תרגול: סופרים 15 שניות כשהדף גלוי והייתה פעילות בדקה האחרונה ---------- */
let lastAct = Date.now();
if (typeof document !== 'undefined' && document.addEventListener) {
  for (const ev of ['pointerdown', 'keydown', 'scroll']) document.addEventListener(ev, () => { lastAct = Date.now(); }, { passive: true });
  setInterval(() => {
    const vid = document.querySelector('video');
    const watching = vid && !vid.paused;
    if (document.visibilityState === 'visible' && (watching || Date.now() - lastAct < 60e3)) {
      const d = S.days[dayKey()] || (S.days[dayKey()] = { n: 0, ok: 0, sec: 0 });
      d.sec += 15; S.upd = Date.now(); ls.set('math8', JSON.stringify(S));
      if (d.sec % 120 === 0) Sync.push();
    }
  }, 15e3);
}

/* ---------- סנכרון ל־Firebase (REST, בלי SDK). הנתיב /p/<id> — ה־id ארוך ואקראי, ורק מי שיש לו את הקישור רואה. ---------- */
const Sync = {
  id() {
    let id = ls.get('math8id');
    if (!id) {
      const b = new Uint8Array(16); crypto.getRandomValues(b);
      id = [...b].map(x => x.toString(16).padStart(2, '0')).join(''); ls.set('math8id', id);
    }
    return id;
  },
  on: () => !!CLOUD,
  url: (id, part) => `${CLOUD}/p/${id}/${part}.json`,
  timer: null,
  push() {
    if (!CLOUD) return;
    clearTimeout(this.timer);
    this.timer = setTimeout(() => this.send(), 4000);
  },
  send(keepalive = false) {
    if (!CLOUD) return;
    clearTimeout(this.timer);
    return fetch(this.url(this.id(), 's'), { method: 'PUT', body: JSON.stringify(S), keepalive }).catch(() => {});
  },
  async get(id, part) {
    const r = await fetch(this.url(id, part), { cache: 'no-store' });
    if (!r.ok) throw new Error('sync ' + r.status);
    return r.json();
  },
  /** בטעינה: מושכים את המצב מהענן (אולי ממכשיר אחר) ואת ההגדרות של ההורה */
  async pull() {
    if (!CLOUD) return false;
    try {
      const [s, cfg] = await Promise.all([this.get(this.id(), 's'), this.get(this.id(), 'cfg')]);
      let changed = false;
      if (s && s.v === 2) { const m = mergeState(S, cleanState(s)); changed = JSON.stringify(m) !== JSON.stringify(S); S = m; ls.set('math8', JSON.stringify(S)); }
      if (cfg && JSON.stringify(cfg) !== ls.get('math8cfg')) { ls.set('math8cfg', JSON.stringify(cfg)); changed = true; }
      if (changed) this.send();
      return changed;
    } catch { return false; }
  },
};
if (typeof window !== 'undefined' && window.addEventListener) {
  window.addEventListener('pagehide', () => Sync.send(true));
}

/** הגדרות שההורה קובע: { pin: id של יחידה, exam: {date, units:[...]}, msg } */
const Cfg = {
  get() { try { return JSON.parse(ls.get('math8cfg') || '{}') || {}; } catch { return {}; } },
  async set(cfg, id = Sync.id()) {
    cfg = { ...cfg, t: Date.now() };
    if (id === Sync.id()) ls.set('math8cfg', JSON.stringify(cfg));
    if (CLOUD) {
      const r = await fetch(Sync.url(id, 'cfg'), { method: 'PUT', body: JSON.stringify(cfg) });
      if (!r.ok) throw new Error('save ' + r.status);
    }
  },
};
