"""סרטון חימום: סדר פעולות חשבון וחזקות (חזרה מכיתה ז׳).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_w_order.py WOrder
"""
from common import *

add_pron({"חזקה": "חֶזְקָה", "החזקה": "הַחֶזְקָה", "חזקות": "חֶזְקוֹת", "החזקות": "הַחֶזְקוֹת",
          "סוגריים": "סוֹגריים", "הסוגריים": "הַסוֹגריים", "בסוגריים": "בַּסוֹגריים", "בריבוע": "בְּריבוע"})

OK_COL, BAD_COL, HL = GREEN_C, RED_C, YELLOW


def F(s, size=60, color=WHITE):
    """נוסחה בלי עברית (גופן מתמטי). חזקות בתווי יוניקוד: ² ³ ⁴."""
    return MarkupText(s, font=MATH, font_size=size, color=color)


def part(mob, plain, sub, k=0):
    """הגליפים של sub בתוך F(plain) (רווחים לא נספרים). k = מספר המופע."""
    flat, sub = plain.replace(" ", ""), sub.replace(" ", "")
    i = -1
    for _ in range(k + 1):
        i = flat.index(sub, i + 1)
    return mob[i:i + len(sub)]


def mark(ok, size=48):
    return T("✔" if ok else "✘", size, OK_COL if ok else BAD_COL, font=MATH)


class WOrder(Narrated):
    def construct(self):
        self.story()
        self.ladder()
        self.example()
        self.left_to_right()
        self.powers()
        self.negatives()
        self.summary()

    def clear(self):
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- סיפור: 2 + 4 · 3 ----------
    def story(self):
        title = T("סדר פעולות חשבון", 64, font=TITLE)
        with self.voice("שחקן קלע סל אחד של שתי נקודות, ואחר כך ארבע שלשות. כמה נקודות הוא קלע?") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
            balls = VGroup(*[VGroup(Circle(0.42, color=BALL, fill_opacity=0.85), F(str(v), 40))
                             for v in (2, 3, 3, 3, 3)]).arrange(RIGHT, buff=0.35).shift(UP * 1.4)
            self.play(LaggedStart(*[FadeIn(b, shift=DOWN * 0.3) for b in balls], lag_ratio=0.25), run_time=1.5)
        self.title = title

        s = "2 + 4 · 3"
        e = F(s, 72).next_to(balls, DOWN, buff=0.6)
        wrong = F("= 6 · 3 = 18", 56, BAD_COL)
        right = F("= 2 + 12 = 14", 56, OK_COL)
        VGroup(wrong, right).arrange(DOWN, buff=0.5, aligned_edge=LEFT).next_to(e, DOWN, buff=0.6)
        mw, mr = mark(False).next_to(wrong, RIGHT, buff=0.4), mark(True).next_to(right, RIGHT, buff=0.4)
        with self.voice("נכתוב תרגיל: שתיים ועוד ארבע כפול שלוש. "
                        "דני חישב לפי הסדר: שתיים ועוד ארבע זה שש, כפול שלוש, שמונה עשרה.") as d:
            self.play(Write(e), run_time=1.5)
            self.wait(1.5)
            self.play(Indicate(part(e, s, "2 + 4"), color=BAD_COL), run_time=1)
            self.play(Write(wrong), run_time=1.5)
        with self.voice("אבל רגע. ארבע שלשות הן שתים עשרה נקודות, ועוד שתיים, ארבע עשרה. "
                        "דני טעה! את הכפל היה צריך לעשות קודם.") as d:
            self.play(Indicate(balls[1:], color=YELLOW), Indicate(part(e, s, "4 · 3"), color=OK_COL), run_time=1.5)
            self.play(Write(right), run_time=1.5)
            self.play(FadeIn(mw), FadeIn(mr), run_time=0.8)
        self.clear()

    # ---------- הסולם ----------
    def ladder(self):
        rungs = [("1.", "סוגריים", "(  )"), ("2.", "חזקות", "3²"), ("3.", "כפל וחילוק", "·  ÷"), ("4.", "חיבור וחיסור", "+  −")]
        rows = VGroup(*[R(n, w, sym, size=54, buff=0.5) for n, w, sym in rungs]).arrange(DOWN, buff=0.55, aligned_edge=RIGHT)
        rows.next_to(self.title, DOWN, buff=0.6)
        for r, c in zip(rows, (YELLOW, ORANGE, BLUE_C, GREEN_C)):
            r[2].set_color(c)
        with self.voice("כדי שכולם יקבלו את אותה תשובה, יש סדר קבוע. ראשונים: הסוגריים. "
                        "אחריהם: החזקות. אחר כך: כפל וחילוק. ובסוף: חיבור וחיסור.") as d:
            for r in rows:
                self.play(FadeIn(r, shift=LEFT * 0.3), run_time=0.8)
                self.wait(max(d / 4 - 1.0, 0.3))
        note = R("אותה דרגה?", "←", "משמאל לימין", size=46, color=YELLOW).next_to(rows, DOWN, buff=0.7)
        with self.voice("ומה אם יש שתי פעולות מאותה דרגה, כמו כפל וחילוק? "
                        "אז מחשבים משמאל לימין, לפי הסדר שבו הן כתובות.") as d:
            self.play(Indicate(rows[2]), run_time=1.2)
            self.play(FadeIn(note, shift=UP * 0.2), run_time=1)
        self.clear()

    # ---------- דוגמה צעד אחרי צעד ----------
    def example(self):
        lines = ["30 − 2 · (1 + 2)²", "= 30 − 2 · 3²", "= 30 − 2 · 9", "= 30 − 18", "= 12"]
        subs = ["(1 + 2)", "3²", "2 · 9", "30 − 18"]
        notes = ["סוגריים", "חזקה", "כפל", "חיסור"]
        mobs = VGroup(*[F(s, 60) for s in lines]).arrange(DOWN, buff=0.35, aligned_edge=LEFT).next_to(self.title, DOWN, buff=0.5)
        for m in mobs[1:]:
            m.shift(RIGHT * 0.9)
        with self.voice("בוא נפתור תרגיל ארוך יותר, צעד אחרי צעד: שלושים פחות שתיים כפול, "
                        "סוגריים, אחת ועוד שתיים, בריבוע.") as d:
            self.play(Write(mobs[0]), run_time=2)
        says = [
            "מתחילים מהסוגריים: אחת ועוד שתיים זה שלוש.",
            "אחרי הסוגריים באה החזקה: שלוש בריבוע, זה שלוש כפול שלוש, תשע.",
            "עכשיו כפל: שתיים כפול תשע, שמונה עשרה.",
            "ונשאר רק החיסור: שלושים פחות שמונה עשרה, שתים עשרה.",
        ]
        for i in range(4):
            box = SurroundingRectangle(part(mobs[i], lines[i], subs[i]), color=HL, buff=0.08)
            tag = T(notes[i], 32, HL).next_to(mobs[i], RIGHT, buff=0.5)
            with self.voice(says[i]) as d:
                self.play(Create(box), FadeIn(tag), run_time=0.8)
                self.play(Write(mobs[i + 1]), run_time=1.2)
                self.wait(max(d - 2.8, 0.2))
                self.play(FadeOut(box), FadeOut(tag), run_time=0.5)
        frame = SurroundingRectangle(mobs[4], color=OK_COL, buff=0.15)
        with self.voice("התשובה: שתים עשרה. שים לב שלא התחלנו בשלושים פחות שתיים, כי חיסור הוא האחרון בסולם.") as d:
            self.play(Create(frame), run_time=0.8)
            self.play(Indicate(part(mobs[0], lines[0], "30 − 2"), color=BAD_COL), run_time=1.5)
        self.clear()

    # ---------- משמאל לימין ----------
    def left_to_right(self):
        s = "12 ÷ 3 · 2"
        e = F(s, 72).next_to(self.title, DOWN, buff=0.7)
        right = F("= 4 · 2 = 8", 56, OK_COL)
        wrong = F("= 12 ÷ 6 = 2", 56, BAD_COL)
        VGroup(right, wrong).arrange(DOWN, buff=0.5, aligned_edge=LEFT).next_to(e, DOWN, buff=0.5)
        mr, mw = mark(True).next_to(right, RIGHT, buff=0.4), mark(False).next_to(wrong, RIGHT, buff=0.4)
        arrow = Arrow(e.get_left() + DOWN * 0.6, e.get_right() + DOWN * 0.6, color=YELLOW, buff=0, stroke_width=4).next_to(e, UP, buff=0.15)
        with self.voice("שתים עשרה חלקי שלוש כפול שתיים. חילוק וכפל הם באותה דרגה, "
                        "אז הולכים משמאל לימין: קודם שתים עשרה חלקי שלוש, ארבע. ואז ארבע כפול שתיים, שמונה.") as d:
            self.play(Write(e), run_time=1.5)
            self.play(GrowArrow(arrow), run_time=1)
            self.wait(1.5)
            self.play(Write(right), FadeIn(mr), run_time=2)
        with self.voice("מי שמתחיל מהכפל מקבל שתיים, וזו טעות.") as d:
            self.play(Write(wrong), FadeIn(mw), run_time=2)
        self.play(FadeOut(VGroup(e, right, wrong, mr, mw, arrow)))

        s2 = "10 − 4 + 3"
        e2 = F(s2, 72).next_to(self.title, DOWN, buff=0.9)
        r2 = F("= 6 + 3 = 9", 56, OK_COL).next_to(e2, DOWN, buff=0.6)
        with self.voice("אותו דבר עם חיבור וחיסור. עשר פחות ארבע ועוד שלוש: "
                        "קודם עשר פחות ארבע, שש. ועוד שלוש, תשע.") as d:
            self.play(Write(e2), run_time=1.5)
            self.play(Indicate(part(e2, s2, "10 − 4"), color=YELLOW), run_time=1.2)
            self.play(Write(r2), FadeIn(mark(True).next_to(r2, RIGHT, buff=0.4)), run_time=1.5)
        self.clear()

    # ---------- חזקות ----------
    def powers(self):
        s = "2⁴ = 2 · 2 · 2 · 2 = 16"
        e = F(s, 68).next_to(self.title, DOWN, buff=0.7)
        lab_b = T("הבסיס", 32, ORANGE).next_to(part(e, s, "2"), DOWN, buff=0.5).shift(LEFT * 0.3)
        lab_n = T("כמה פעמים", 32, BLUE_C).next_to(part(e, s, "⁴"), UP, buff=0.35)
        with self.voice("עכשיו חזקות. שתיים בחזקת ארבע פירושו: שתיים כפול עצמו ארבע פעמים. "
                        "שתיים, ארבע, שמונה, שש עשרה.") as d:
            self.play(Write(part(e, s, "2⁴")), run_time=1)
            self.play(FadeIn(lab_b), FadeIn(lab_n), part(e, s, "2⁴")[0].animate.set_color(ORANGE),
                      part(e, s, "2⁴")[1].animate.set_color(BLUE_C), run_time=1)
            self.play(Write(part(e, s, "= 2 · 2 · 2 · 2")), run_time=2)
            self.play(Write(part(e, s, "= 16")), run_time=1)
        no = VGroup(F("2⁴ ≠ 2 · 4", 56, BAD_COL), mark(False)).arrange(RIGHT, buff=0.4).next_to(e, DOWN, buff=1.0)
        with self.voice("זהירות: שתיים בחזקת ארבע זה לא שתיים כפול ארבע. זה לא שמונה, זה שש עשרה!") as d:
            self.play(FadeIn(no, shift=UP * 0.2), run_time=1)
        self.play(FadeOut(VGroup(e, lab_b, lab_n, no)))

        sq = VGroup(*[Dot(radius=0.16, color=ORANGE) for _ in range(9)]).arrange_in_grid(3, 3, buff=0.35)
        box = SurroundingRectangle(sq, color=WHITE, buff=0.25)
        grid = VGroup(sq, box).shift(LEFT * 3 + DOWN * 0.3)
        e2 = F("3² = 3 · 3 = 9", 64).shift(RIGHT * 2.6 + UP * 0.4)
        why = R("ריבוע של", "3", "על", "3", size=36, color=GREY_B).next_to(e2, DOWN, buff=0.5)
        with self.voice("ולמה שלוש בחזקת שתיים נקרא שלוש בריבוע? כי שלוש שורות של שלוש נקודות יוצרות ריבוע. "
                        "יש בו שלוש כפול שלוש, תשע נקודות.") as d:
            self.play(Write(e2), run_time=1.5)
            self.play(LaggedStart(*[FadeIn(p, scale=0.5) for p in sq], lag_ratio=0.15), run_time=2)
            self.play(Create(box), FadeIn(why), run_time=1)
        self.clear()

    # ---------- מינוס וחזקה ----------
    def negatives(self):
        a = F("(−3)² = (−3) · (−3) = 9", 60, OK_COL)
        b = F("−3² = −(3 · 3) = −9", 60, ORANGE)
        VGroup(a, b).arrange(DOWN, buff=1.3, aligned_edge=LEFT).next_to(self.title, DOWN, buff=0.9)
        ta = T("המינוס בתוך הסוגריים — גם הוא בריבוע", 32, GREY_B).next_to(a, DOWN, buff=0.25).align_to(a, LEFT)
        tb = R("בלי סוגריים — רק ה־", "3", "בריבוע", size=32, color=GREY_B, buff=0.1).next_to(b, DOWN, buff=0.25).align_to(b, LEFT)
        with self.voice("ועכשיו מלכודת. מינוס שלוש בסוגריים, בריבוע: המינוס בתוך הסוגריים, "
                        "אז כופלים מינוס שלוש במינוס שלוש. מינוס כפול מינוס זה פלוס, תשע.") as d:
            self.play(Write(a), run_time=2.5)
            self.play(FadeIn(ta), run_time=1)
        with self.voice("אבל בלי סוגריים, החזקה שייכת רק לשלוש. שלוש בריבוע זה תשע, "
                        "והמינוס נשאר בחוץ: מינוס תשע.") as d:
            self.play(Write(b), run_time=2.5)
            self.play(FadeIn(tb), run_time=1)
        with self.voice("אז הסוגריים משנים הכול. תמיד בדוק: האם המינוס בפנים, או בחוץ?") as d:
            self.play(Indicate(part(a, "(−3)²", "(−3)"), color=YELLOW), run_time=1.2)
            self.play(Indicate(part(b, "−3²", "−"), color=YELLOW, scale_factor=2), run_time=1.2)
        self.clear()

    # ---------- סיכום ----------
    def summary(self):
        rows = VGroup(
            R("1.", "סוגריים", "2.", "חזקות", "3.", "כפל וחילוק", "4.", "חיבור וחיסור", size=42),
            R("אותה דרגה", "←", "משמאל לימין", size=42),
            R("2⁴ = 2 · 2 · 2 · 2 = 16", size=42),
            R("(−3)² = 9", "אבל", "−3² = −9", size=42),
        ).arrange(DOWN, buff=0.6).next_to(self.title, DOWN, buff=0.7)
        with self.voice("אז מה למדנו? קודם סוגריים, אחר כך חזקות, אחר כך כפל וחילוק, ובסוף חיבור וחיסור. "
                        "פעולות מאותה דרגה: משמאל לימין. חזקה היא כפל חוזר. "
                        "ומינוס בתוך סוגריים מתנהג אחרת ממינוס בחוץ.") as d:
            for r in rows:
                self.play(FadeIn(r, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 4 - 1.1, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.6)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
