"""כלים משותפים לכל הסרטונים: קריינות עברית (edge-tts, הקול Avri), ניקוד להגייה, טקסט עברי ועיצוב.

שימוש בסרטון חדש:
    from common import *
    class MyVideo(Narrated):
        def construct(self):
            with self.voice("משפט קריינות") as d:   # d = אורך הקריינות בשניות
                self.play(Write(T("כותרת")), run_time=d)
"""
import asyncio
import hashlib
import json
import os
import sys
import re
import subprocess
import time
import wave
from contextlib import contextmanager
from pathlib import Path

import edge_tts
import numpy as np
from manim import *

config.background_color = "#0e1116"

HEB = "Arial Hebrew"
TITLE = "Frank Ruehl CLM"
MATH = "Times New Roman"
COURT = "#e8a33d"   # צבע קווי המגרש
BALL = "#f07f2b"

AUDIO_DIR = Path(__file__).parent / "audio"
AUDIO_DIR.mkdir(exist_ok=True)


# ניקוד למילים שמנוע הקול עלול לקרוא לא נכון (נבדק מול הקלטות עם ובלי ניקוד), רק לקריינות ולא לטקסט על המסך
PRON = {
    "מגרש כדורסל": "מִגְרַשׁ כַּדּוּרְסַל", "המגרש": "הַמִּגְרָשׁ", "ובמגרש": "וּבַמִּגְרָשׁ",
    "מלבן": "מַלְבֵּן", "למלבן": "לַמַּלְבֵּן", "במלבן": "בַּמַּלְבֵּן",
    "ניצבות": "נִצָּבוּת", "הקבלה": "הַקְבָּלָה", "והקבלה": "וְהַקְבָּלָה", "פסי": "פַּסֵּי",
    "ישרה": "יְשָׁרָה", "הישרה": "הַיְּשָׁרָה", "ישרות": "יְשָׁרוֹת",
    "ישרים": "יְשָׁרִים", "והישרים": "וְהַיְּשָׁרִים", "קו ישר": "קַו יָשָׁר",
    "מישר": "מִיָּשָׁר", "לישר": "לַיָּשָׁר",
    "נגדיות": "נֶגְדִּיּוֹת", "נחתכים": "נֶחְתָּכִים", "וקפל": "וְקַפֵּל", "יונח": "יוּנַח",
    "רצת": "רַצְתָּ", "שוות": "שָׁווֹת", "והרוחב": "וְהָרֹחַב",
    "קווית": "קַוִּית", "הקווית": "הַקַּוִּית", "שיפוע": "שִׁפּוּעַ", "השיפוע": "הַשִּׁפּוּעַ", "בשיפוע": "בַּשִּׁפּוּעַ",
    # נמצאו ב־pron_audit.py ואומתו בזיהוי פונמות: בלי ניקוד הקול אמר "שַׁחַק", "נָשִׁים", "וּפְלִי"
    "שחק": "שַׂחֵק", "נשים": "נָשִׂים", "ופלי": "וּפָּלִי",
    # "נִסָּה"/"וְנִסָּה" (ניסה בעבר) במקום ציווי, "נַעֲשָׂה" במקום "נַעֲשֶׂה", "גוּר" במקום "גְּרוֹר"
    "נסה": "נַסֵּה", "ונסה": "וְנַסֵּה", "נעשה": "נַעֲשֶׂה", "גרור": "גְּרוֹר",
}
# 11–19 בנקבה: בלי ניקוד הקול אמר "שתים עֲשָׂרָה" במקום "שתים עֶשְׂרֵה"
_TEEN_RE = re.compile(r"((?:אחת|שתים|שלוש|ארבע|חמש|שש|שבע|שמונה|תשע) )עשרה(?![֐-׿])")
def add_pron(extra):
    """מוסיף ניקוד לקריינות (לקרוא בראש קובץ הסרטון, לפני הקריינות הראשונה)."""
    global _PRON_RE
    PRON.update(extra)
    _PRON_RE = re.compile(r"(?<![֐-׿])(" + "|".join(
        sorted(map(re.escape, PRON), key=len, reverse=True)) + r")(?![֐-׿])")


add_pron({})


VOICE = "he-IL-AvriNeural"


def tts(text):
    """Hebrew neural voiceover via edge-tts (online), cached by text hash. Returns (path, seconds)."""
    raw, text = text, _PRON_RE.sub(lambda m: PRON[m.group(1)], _TEEN_RE.sub("\\1עֶשְׂרֵה", text))
    path = AUDIO_DIR / (hashlib.md5((VOICE + text).encode()).hexdigest()[:12] + ".wav")
    if os.environ.get("NARRATION_LOG"):  # pron_audit.py collects every narration line this way
        with open(os.environ["NARRATION_LOG"], "a") as f:
            f.write(json.dumps({"file": sys.argv[-2] if len(sys.argv) > 1 else "", "raw": raw, "tts": text, "wav": path.name}, ensure_ascii=False) + "\n")
    if not path.exists():
        mp3 = path.with_suffix(".mp3")
        for attempt in range(8):  # the service rate-limits bursts with NoAudioReceived
            try:
                asyncio.run(edge_tts.Communicate(text, VOICE, rate="-5%").save(str(mp3)))
                break
            except edge_tts.exceptions.NoAudioReceived:
                if attempt == 7:
                    raise
                time.sleep(15 * (attempt + 1))
        # the neural voice pauses ~1.1s between sentences; cap every pause at 0.6s
        trim = "silenceremove=stop_periods=-1:stop_duration=0.6:stop_threshold=-40dB:detection=peak"
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(mp3), "-af", trim, "-ar", "24000", str(path)],
                       check=True)
        mp3.unlink()
    with wave.open(str(path)) as w:
        return path, w.getnframes() / w.getframerate()


def T(s, size=40, color=WHITE, font=HEB):
    """טקסט עברי בלבד. לשורה שמערבבת עברית עם מספרים/נוסחאות — R()."""
    # MarkupText, not Text: Text silently drops some Hebrew words/digits (RTL bug in Manim 0.22)
    return MarkupText(s, font=font, font_size=size, color=color)


def R(*parts, size=40, color=WHITE, buff=0.18):
    """שורה מעורבת מימין לשמאל: R("שיפוע:", "+2", "בכל צעד ימינה").
    חלק עם עברית → T, חלק בלי עברית → גופן מתמטי. ככה מספרים כמו (0, 10) או −3 לא מתהפכים (bidi)."""
    mobs = [T(p, size, color) if re.search(r"[\u0590-\u05FF]", p)
            else MarkupText(p, font=MATH, font_size=size, color=color) for p in parts]
    return VGroup(*mobs).arrange(LEFT, buff=buff)


def M(s, size=40, color=WHITE):
    return Text(s, font=MATH, font_size=size, color=color, slant=ITALIC)


def court(scale=0.4):
    """מגרש כדורסל FIBA ‏(28×15 מ׳) במבט מלמעלה, רק קווים."""
    L, W = 28 * scale, 15 * scale
    kw = dict(color=COURT, stroke_width=3)
    outline = Rectangle(width=L, height=W, **kw)
    mid = Line(UP * W / 2, DOWN * W / 2, **kw)
    circle = Circle(radius=1.8 * scale, **kw)
    parts = [mid, circle]
    for side in (-1, 1):
        base = side * L / 2
        paint = Rectangle(width=5.8 * scale, height=4.9 * scale, **kw).move_to(
            [base - side * 2.9 * scale, 0, 0])
        ft = Circle(radius=1.8 * scale, **kw).move_to([base - side * 5.8 * scale, 0, 0])
        hoop = Circle(radius=0.23 * scale, color=BALL, stroke_width=3).move_to(
            [base - side * 1.575 * scale, 0, 0])
        # קשת השלוש: רדיוס 6.75 מ׳ מהסל, קווים ישרים ליד הפינות
        c = np.array([base - side * 1.575 * scale, 0, 0])
        r, y = 6.75 * scale, 6.6 * scale
        a = np.arcsin(y / r)
        arc = Arc(radius=r, start_angle=-a if side == -1 else PI - a, angle=2 * a, arc_center=c, **kw)
        x_end = c[0] - side * r * np.cos(a)
        corners = VGroup(*[Line([base, s * y, 0], [x_end, s * y, 0], **kw) for s in (-1, 1)])
        parts += [paint, ft, hoop, arc, corners]
    return VGroup(outline, *parts)


class Narrated(Scene):
    """סצנה עם קריינות: כל בלוק with self.voice(...) נמשך לפחות כאורך הקריינות."""
    @contextmanager
    def voice(self, text):
        path, dur = tts(text)
        self.add_sound(str(path))
        t0 = self.renderer.time
        yield dur
        self.wait(max(dur - (self.renderer.time - t0), 0) + 0.4)
