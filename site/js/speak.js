/* הקראת שאלות בקול (Web Speech API). הכפתור מופיע רק אם בדפדפן יש קול עברי. */
const Speak = {
  voice: null,
  init() {
    if (!window.speechSynthesis) return;
    const pickVoice = () => { this.voice = speechSynthesis.getVoices().find(v => /^he|^iw/i.test(v.lang)) || null; document.body.classList.toggle('can-speak', !!this.voice); };
    pickVoice();
    speechSynthesis.addEventListener?.('voiceschanged', pickVoice);
  },
  button: () => '<button class="speak" type="button" aria-label="הקרא את השאלה" title="הקרא את השאלה">🔊</button>',
  /** נוסחת TeX → מילים, כדי שהקול יקרא "שלוש איקס פלוס שתיים" ולא תווים */
  tex(t) {
    const W = [
      [/(\d)([a-z])/gi, '$1 $2'], [/\b([fgh])\s*\(/g, ' $1 של ('], [/\bf\b/g, ' אף '], [/\bg\b/g, ' גי '],
      [/\\frac\{([^{}]*)\}\{([^{}]*)\}/g, ' $1 חלקי $2 '], [/\\sqrt\{([^{}]*)\}/g, ' שורש של $1 '],
      [/\^\{?2\}?/g, ' בריבוע '], [/\^\{?3\}?/g, ' בשלישית '], [/\^\{([^{}]*)\}|\^(\w)/g, ' בחזקת $1$2 '],
      [/\\cdot|\\times/g, ' כפול '], [/\\div|:/g, ' חלקי '], [/\\le(q)?/g, ' קטן או שווה ל '], [/\\ge(q)?/g, ' גדול או שווה ל '],
      [/\\ne(q)?/g, ' שונה מ '], [/</g, ' קטן מ '], [/>/g, ' גדול מ '], [/=/g, ' שווה '], [/\+/g, ' פלוס '],
      [/[-−]/g, ' מינוס '], [/%|\\%/g, ' אחוז '], [/\\pi/g, ' פאי '], [/\\angle/g, ' זווית '], [/\\triangle/g, ' משולש '],
      [/\\circ/g, ' מעלות '], [/\\[a-z]+/gi, ' '], [/[{}()[\]|]/g, ' '],
      [/\bx\b/g, ' איקס '], [/\by\b/g, ' וואי '],
    ];
    for (const [re, to] of W) t = t.replace(re, to);
    return t;
  },
  say(html) {
    if (!this.voice) return;
    speechSynthesis.cancel();
    const d = document.createElement('div');
    d.innerHTML = String(html).replace(/\$\$?([^$]+)\$\$?/g, (_, m) => this.tex(m));
    const u = new SpeechSynthesisUtterance(d.textContent.replace(/\s+/g, ' ').trim());
    u.voice = this.voice; u.lang = this.voice.lang; u.rate = 0.9;
    speechSynthesis.speak(u);
  },
};
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('load', () => Speak.init());
