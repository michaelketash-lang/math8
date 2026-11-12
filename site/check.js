// בדיקה אוטומטית לכל מחוללי התרגילים: node site/check.js [id...]
// מייצר 300 תרגילים מכל מחולל ובודק שאין NaN/undefined, שיש רמז ופתרון, ושהתשובה בפורמט הנכון.
const fs = require('fs'), path = require('path'), vm = require('vm');
const ctx = { console, Math, JSON, setTimeout, document: { getElementById: () => ({}) }, window: {}, location: { hash: '' }, localStorage: null };
ctx.window.addEventListener = () => {}; ctx.addEventListener = () => {};
vm.createContext(ctx);
const run = f => vm.runInContext(fs.readFileSync(path.join(__dirname, f), 'utf8'), ctx, { filename: f });
for (const f of ['js/store.js', 'js/engine.js', 'js/speak.js', 'js/guided.js', 'js/modes.js', 'js/extras.js']) run(f);
vm.runInContext('globalThis.CH = CH; globalThis.UNITS = UNITS; globalThis.parseNum = parseNum;', ctx);
const only = process.argv.slice(2);
let bad = 0, total = 0;
for (const u of ctx.UNITS) {
  if (only.length && !only.includes(u.id)) continue;
  const f = `js/chapters/${u.id}.js`;
  if (!fs.existsSync(path.join(__dirname, f))) continue;
  run(f);
  const def = ctx.CH[u.id];
  if (!def) { console.log(`✗ ${u.id}: registerChapter not called`); bad++; continue; }
  for (const k of ['intro', 'summary', 'exercises']) if (!def[k]) { console.log(`✗ ${u.id}: missing ${k}`); bad++; }
  def.exercises.forEach((g, gi) => {
    for (let i = 0; i < 300; i++) {
      total++;
      let e;
      try { e = g.gen(); } catch (err) { console.log(`✗ ${u.id} gen#${gi} threw: ${err.message}`); bad++; break; }
      const text = [e.q, e.hint, ...(e.steps || []), ...(e.choices || [])].join(' ');
      const errs = [];
      if (/NaN|undefined|Infinity|\[object/.test(text)) errs.push('bad text: ' + text.slice(0, 160));
      if (!e.hint || !e.steps?.length) errs.push('missing hint/steps');
      if (e.type === 'number' && !Number.isFinite(e.answer)) errs.push('answer ' + e.answer);
      if (e.type === 'choice' && !(Number.isInteger(e.answer) && e.answer >= 0 && e.answer < e.choices.length)) errs.push('choice answer ' + e.answer);
      if ((e.type === 'pair' || e.type === 'set') && !(Array.isArray(e.answer) && e.answer.every(Number.isFinite))) errs.push('array answer ' + e.answer);
      if (!['number', 'choice', 'pair', 'set'].includes(e.type)) errs.push('type ' + e.type);
      if ((e.q.match(/\$/g) || []).length % 2) errs.push('odd $ in q: ' + e.q);
      // טעויות נפוצות (אופציונלי): [{ v, why }] — v מספר / [x, y] / אינדקס של choice
      if (e.mistakes !== undefined) {
        if (!Array.isArray(e.mistakes) || e.type === 'set') errs.push('mistakes must be an array (not for type set)');
        else for (const m of e.mistakes) {
          const okV = e.type === 'choice' ? Number.isInteger(m.v) && m.v >= 0 && m.v < e.choices.length : e.type === 'pair' ? Array.isArray(m.v) && m.v.length === 2 && m.v.every(Number.isFinite) : Number.isFinite(m.v);
          if (!okV) errs.push('mistake v ' + JSON.stringify(m.v));
          if (typeof m.why !== 'string' || m.why.length < 8 || /NaN|undefined|Infinity|\[object/.test(m.why) || (m.why.match(/\$/g) || []).length % 2) errs.push('mistake why: ' + m.why);
        }
      }
      if (errs.length) { console.log(`✗ ${u.id} gen#${gi} (level ${g.level}): ${errs[0]}`); bad++; break; }
    }
  });
  console.log(`✓ ${u.id}: ${def.exercises.length} generators`);
}
// parseNum self-check
const pn = ctx.parseNum;
console.assert(pn('-3') === -3 && pn('2,5') === 2.5 && pn('3/4') === 0.75 && pn('−1/2') === -0.5 && isNaN(pn('abc')), 'parseNum');
console.log(bad ? `\n${bad} problem(s)` : `\nall good (${total} exercises generated)`);
process.exit(bad ? 1 : 0);
