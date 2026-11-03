"""סרטון חימום: מספרים מכוונים — ציר המספרים, השוואה, חיבור וחיסור, מינוס של מינוס, כפל וחילוק, ערך מוחלט.

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_w_negatives.py WNegatives
"""
from common import *

POS, NEG = GREEN_C, RED_C


def F(s, size=52, color=WHITE):
    """נוסחה בלי עברית (גופן מתמטי)."""
    return MarkupText(s.replace(">", "&gt;").replace("<", "&lt;"), font=MATH, font_size=size, color=color)


def num(v):
    return str(v).replace("-", "−")


class NumLine(VGroup):
    """ציר מספרים אופקי: שליליים באדום, חיוביים בירוק."""
    def __init__(self, lo, hi, width=12.5, size=26, **kw):
        super().__init__(**kw)
        self.lo, self.hi, self.w = lo, hi, width
        self.add(Line(LEFT * width / 2, RIGHT * width / 2, color=GREY_B, stroke_width=3))
        self.labels = VGroup()
        for v in range(lo, hi + 1):
            self.add(Line(UP * 0.13, DOWN * 0.13, color=GREY_B, stroke_width=4 if v == 0 else 2).move_to(self.n2p(v)))
            self.labels.add(F(num(v), size, NEG if v < 0 else POS if v > 0 else WHITE).next_to(self.n2p(v), DOWN, buff=0.22))
        self.add(self.labels)

    def n2p(self, v):
        return self[0].get_start() + RIGHT * (v - self.lo) / (self.hi - self.lo) * self.w

    def lab(self, v):
        return self.labels[v - self.lo]


class WNegatives(Narrated):
    def construct(self):
        self.intro()
        self.add_sub()
        self.minus_minus()
        self.multiply()
        self.absval()
        self.summary()

    def clear(self):
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    def ball(self, nl, v):
        return Circle(radius=0.2, color=BALL, fill_opacity=1).move_to(nl.n2p(v) + UP * 0.3).set_z_index(3)

    def hops(self, nl, ball, start, delta, step=1, color=ORANGE, rt=0.4):
        """הכדור קופץ |delta| צעדים (בקפיצות של step), ומשאיר קשתות."""
        d, pos, trail = (1 if delta > 0 else -1), start, VGroup()
        for _ in range(abs(delta) // step):
            arc = ArcBetweenPoints(nl.n2p(pos) + UP * 0.3, nl.n2p(pos + d * step) + UP * 0.3,
                                   angle=-d * PI * 0.7, color=color, stroke_width=4)
            self.play(MoveAlongPath(ball, arc), Create(arc), run_time=rt)
            trail.add(arc)
            pos += d * step
        return trail

    # ---------- ציר המספרים והשוואה ----------
    def intro(self):
        title = T("מספרים מכוונים", 66, font=TITLE)
        temp = F("−5°", 110, BLUE_C)
        with self.voice("בחורף, על פסגת החרמון, הטמפרטורה יכולה לרדת מתחת לאפס. למשל, מינוס חמש מעלות. "
                        "מספרים כאלה, מתחת לאפס, נקראים מספרים שליליים.") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
            self.play(FadeIn(temp, scale=0.6), run_time=1)
        self.title = title

        nl = NumLine(-8, 8).shift(DOWN * 0.3)
        pos_tag = T("חיוביים", 36, POS).next_to(nl.n2p(5), UP, buff=0.6)
        neg_tag = T("שליליים", 36, NEG).next_to(nl.n2p(-5), UP, buff=0.6)
        with self.voice("נשים את כל המספרים על ציר אחד. באמצע, אפס. ימינה, המספרים החיוביים. "
                        "ושמאלה, המספרים השליליים: מינוס אחת, מינוס שתיים, וכן הלאה.") as d:
            self.play(FadeOut(temp), Create(nl[0]), run_time=1)
            self.play(FadeIn(VGroup(*nl[1:-1])), FadeIn(nl.lab(0), scale=1.5), run_time=1)
            self.play(LaggedStart(*[FadeIn(nl.lab(v), shift=UP * 0.2) for v in range(1, 9)], lag_ratio=0.15), FadeIn(pos_tag), run_time=2.5)
            self.play(LaggedStart(*[FadeIn(nl.lab(-v), shift=UP * 0.2) for v in range(1, 9)], lag_ratio=0.15), FadeIn(neg_tag), run_time=2.5)

        a, b = Dot(nl.n2p(-2), color=YELLOW, radius=0.13), Dot(nl.n2p(-7), color=YELLOW, radius=0.13)
        q = R("מי גדול יותר?", "−2", "או", "−7", size=44).shift(UP * 2)
        ans = F("−2 > −7", 64, YELLOW).shift(UP * 2)
        rule = R("יותר ימינה", "←", "יותר גדול", size=36, color=YELLOW).shift(DOWN * 2.1)
        with self.voice("מי גדול יותר: מינוס שתיים או מינוס שבע? הכלל פשוט: מי שנמצא יותר ימינה, הוא הגדול. "
                        "מינוס שתיים נמצא מימין למינוס שבע, ולכן הוא גדול יותר. "
                        "זה הגיוני: מינוס שתיים מעלות זה פחות קר ממינוס שבע.") as d:
            self.play(FadeOut(VGroup(pos_tag, neg_tag)), FadeIn(q), FadeIn(a, scale=2), FadeIn(b, scale=2), run_time=1.2)
            self.wait(1.5)
            self.play(FadeIn(rule, shift=UP * 0.2), run_time=1)
            self.play(Indicate(a, scale_factor=1.8), run_time=1)
            self.play(ReplacementTransform(q, ans), run_time=1.2)
        self.play(FadeOut(VGroup(a, b, ans, rule)))
        self.nl = nl

    # ---------- חיבור וחיסור = קפיצות ----------
    def add_sub(self):
        nl = self.nl
        examples = [
            ("−3 + 5", -3, 5, "2", "פלוס מספר חיובי", "קופצים ימינה",
             "חיבור וחיסור הם קפיצות על הציר. נחשב מינוס שלוש ועוד חמש. מתחילים במינוס שלוש. "
             "פלוס מספר חיובי: קופצים ימינה. אחת, שתיים, שלוש, ארבע, חמש. הגענו לשתיים."),
            ("2 − 5", 2, -5, "−3", "מינוס מספר חיובי", "קופצים שמאלה",
             "עכשיו שתיים פחות חמש. מינוס זה קפיצות שמאלה. מתחילים בשתיים, קופצים חמש שמאלה, "
             "עוברים את האפס, ומגיעים למינוס שלוש."),
            ("4 + (−6)", 4, -6, "−2", "פלוס מספר שלילי", "קופצים שמאלה",
             "ומה עם ארבע ועוד מינוס שש? פלוס מספר שלילי, זה כמו מינוס. "
             "קופצים שש שמאלה, ומגיעים למינוס שתיים."),
        ]
        for expr, start, delta, res, r1, r2, text in examples:
            eq = F(expr + " = ?", 60).shift(UP * 2)
            done = F(f"{expr} = {res}", 60, YELLOW).shift(UP * 2)
            rule = R(r1, "←", r2, size=36, color=ORANGE).shift(DOWN * 2.1)
            ball = self.ball(nl, start)
            with self.voice(text) as d:
                self.play(FadeIn(eq), FadeIn(ball, scale=0.5), run_time=1)
                self.wait(min(2, d * 0.2))
                self.play(FadeIn(rule, shift=UP * 0.2), run_time=0.8)
                trail = self.hops(nl, ball, start, delta)
                self.play(ReplacementTransform(eq, done), Flash(ball, color=YELLOW), run_time=1)
            self.play(FadeOut(VGroup(done, rule, ball, trail)))

    # ---------- מינוס של מינוס ----------
    def minus_minus(self):
        nl = self.nl
        eq = F("3 − (−2)", 64).shift(UP * 2)
        with self.voice("עכשיו הטריק הכי חשוב: שלוש פחות מינוס שתיים. "
                        "כששני מינוסים צמודים זה לזה, הם הופכים לפלוס.") as d:
            self.play(FadeIn(eq), run_time=1)
            self.wait(1.5)
            self.play(Indicate(eq[1:4], color=ORANGE, scale_factor=1.4), run_time=1.5)  # glyphs: 3 − ( − 2 )
        eq2 = F("3 − (−2) = 3 + 2", 64).shift(UP * 2)
        debt = R("מוחקים חוב של", "2", "←", "יש לך", "2", "יותר", size=36, color=GREY_A).shift(DOWN * 2.1)
        ball = self.ball(nl, 3)
        with self.voice("למה? תחשוב על חוב. אם מוחקים לך חוב של שני שקלים, יש לך שני שקלים יותר. "
                        "אז שלוש פחות מינוס שתיים, זה שלוש ועוד שתיים: חמש.") as d:
            self.play(ReplacementTransform(eq, eq2), run_time=1.2)
            self.play(FadeIn(debt, shift=UP * 0.2), FadeIn(ball, scale=0.5), run_time=1)
            self.wait(max(d - 5.5, 0.3))
            trail = self.hops(nl, ball, 3, 2)
            done = F("3 − (−2) = 3 + 2 = 5", 64, YELLOW).shift(UP * 2)
            self.play(ReplacementTransform(eq2, done), run_time=0.8)
        wrong = F("3 − (−2) = 1   ✘", 48, NEG).next_to(done, DOWN, buff=0.5)
        with self.voice("טעות נפוצה: לחשוב ששלוש פחות מינוס שתיים זה אחת. לא! מינוס של מינוס, זה פלוס.") as d:
            self.play(FadeIn(wrong, shift=UP * 0.2), run_time=1)
            self.wait(max(d - 2.5, 0.3))
            self.play(Indicate(done, color=GREEN_C), run_time=1.2)
        self.play(FadeOut(VGroup(wrong, done, debt, ball, trail, nl)))

    # ---------- כפל וחילוק ----------
    def multiply(self):
        nl = NumLine(-13, 3, width=12.5, size=24).shift(DOWN * 0.6)
        eq = F("(−3) · 4", 60).shift(UP * 2)
        ball = self.ball(nl, 0)
        with self.voice("כפל. מינוס שלוש כפול ארבע, זה ארבע פעמים מינוס שלוש. "
                        "מינוס שלוש, מינוס שלוש, מינוס שלוש, מינוס שלוש. ביחד: מינוס שתים עשרה.") as d:
            self.play(FadeIn(eq), Create(nl), run_time=1.5)
            self.play(FadeIn(ball, scale=0.5), run_time=0.5)
            self.wait(2)
            trail = self.hops(nl, ball, 0, -12, step=3, rt=0.9)
            done = F("(−3) · 4 = −12", 60, YELLOW).shift(UP * 2)
            self.play(ReplacementTransform(eq, done), Flash(ball, color=YELLOW), run_time=1)
        self.play(FadeOut(VGroup(trail, ball, nl)), done.animate.scale(0.75).shift(UP * 0.6))
        mm = F("(−3) · (−4) = 12", 46, GREEN_C).next_to(done, DOWN, buff=0.3)
        with self.voice("ומה קורה כשכופלים שני מספרים שליליים? מינוס כפול מינוס, יוצא פלוס! "
                        "מינוס שלוש כפול מינוס ארבע, שווה שתים עשרה.") as d:
            self.wait(min(3, d / 2))
            self.play(FadeIn(mm, shift=UP * 0.2), run_time=1)

        rows = [("+ · + = +", GREEN_C), ("− · − = +", GREEN_C), ("+ · − = −", RED_C), ("− · + = −", RED_C)]
        table = VGroup(*[F(s, 48, c) for s, c in rows]).arrange(DOWN, buff=0.3).shift(LEFT * 3.2 + DOWN * 1.2)
        same = R("סימנים שווים", "←", "חיובי", size=38, color=GREEN_C)
        diff = R("סימנים שונים", "←", "שלילי", size=38, color=RED_C)
        rules = VGroup(same, diff).arrange(DOWN, buff=0.5).shift(RIGHT * 3 + DOWN * 0.6)
        div = F("(−12) ÷ (−3) = 4", 44, YELLOW).next_to(rules, DOWN, buff=0.6)
        with self.voice("אז הנה חוק הסימנים. סימנים שווים: התוצאה חיובית. סימנים שונים: התוצאה שלילית. "
                        "ובחילוק, בדיוק אותו חוק. מינוס שתים עשרה חלקי מינוס שלוש, שווה ארבע.") as d:
            self.play(FadeOut(VGroup(done, mm)), LaggedStart(*[FadeIn(r, shift=RIGHT * 0.2) for r in table], lag_ratio=0.3), run_time=2)
            self.play(FadeIn(same), Indicate(VGroup(table[0], table[1]), color=GREEN_C), run_time=1.5)
            self.play(FadeIn(diff), Indicate(VGroup(table[2], table[3]), color=RED_C), run_time=1.5)
            self.wait(max(d - 7, 0.3))
            self.play(Write(div), run_time=1.5)
        self.clear()

    # ---------- ערך מוחלט ----------
    def absval(self):
        nl = NumLine(-8, 8).shift(DOWN * 0.3)
        e1 = F("|−4| = 4", 60, YELLOW).shift(UP * 2 + LEFT * 2.5)
        e2 = F("|4| = 4", 60, YELLOW).shift(UP * 2 + RIGHT * 2.5)
        l1 = Line(nl.n2p(-4), nl.n2p(0), color=YELLOW, stroke_width=8).shift(UP * 0.45)
        l2 = Line(nl.n2p(0), nl.n2p(4), color=YELLOW, stroke_width=8).shift(UP * 0.45)
        t1, t2 = F("4", 40, YELLOW).next_to(l1, UP, buff=0.15), F("4", 40, YELLOW).next_to(l2, UP, buff=0.15)
        with self.voice("ולסיום, ערך מוחלט: שני קווים ישרים סביב מספר. ערך מוחלט אומר כמה רחוק המספר מאפס. "
                        "מינוס ארבע נמצא ארבעה צעדים מאפס, אז הערך המוחלט שלו הוא ארבע. וגם של ארבע. "
                        "מרחק אף פעם לא שלילי.") as d:
            self.play(Create(nl), run_time=1)
            self.play(Write(e1), run_time=1.2)
            self.play(Create(l1), FadeIn(t1), run_time=1.5)
            self.wait(max(d / 2 - 3.7, 0.3))
            self.play(Write(e2), Create(l2), FadeIn(t2), run_time=1.5)
        self.play(FadeOut(VGroup(e1, e2, l1, l2, t1, t2)))

        a, b = Dot(nl.n2p(-3), color=BLUE_C, radius=0.13), Dot(nl.n2p(4), color=ORANGE, radius=0.13)
        s1 = Line(nl.n2p(-3), nl.n2p(0), color=BLUE_C, stroke_width=8).shift(UP * 0.45)
        s2 = Line(nl.n2p(0), nl.n2p(4), color=ORANGE, stroke_width=8).shift(UP * 0.45)
        q = R("המרחק בין", "−3", "ל־", "4", size=42).shift(UP * 2)
        ans = F("3 + 4 = 7", 60, YELLOW).shift(DOWN * 2.1)
        with self.voice("ובאותה דרך מוצאים מרחק בין שני מספרים. בין מינוס שלוש לארבע: "
                        "שלושה צעדים עד האפס, ועוד ארבעה. ביחד, שבעה.") as d:
            self.play(FadeIn(q), FadeIn(a, scale=2), FadeIn(b, scale=2), run_time=1)
            self.wait(max(d - 6, 0.3))
            self.play(Create(s1), run_time=1.2)
            self.play(Create(s2), run_time=1.2)
            self.play(Write(ans), run_time=1.2)
        self.clear()

    # ---------- סיכום ----------
    def summary(self):
        lines = VGroup(
            R("יותר ימינה", "←", "יותר גדול:", "−2 > −7".replace(">", "&gt;"), size=34),
            R("פלוס", "←", "ימינה.", "מינוס", "←", "שמאלה.", size=34),
            R("מינוס של מינוס = פלוס:", "3 − (−2) = 5", size=34),
            R("כפל וחילוק: סימנים שווים", "←", "+", ", שונים", "←", "−", size=34),
            R("ערך מוחלט = מרחק מאפס:", "|−4| = 4", size=34),
        )
        for i, ln in enumerate(lines):  # ריווח קבוע: שורות עם ספרות נמוכות יותר ונראות צפופות ב־arrange
            ln.move_to(UP * (2.0 - i * 0.85)).align_to(lines[0], RIGHT)
        lines.set_x(0)
        with self.voice("אז מה למדנו? מי שיותר ימינה, גדול יותר. פלוס: קופצים ימינה. מינוס: קופצים שמאלה. "
                        "מינוס של מינוס, זה פלוס. בכפל ובחילוק, סימנים שווים נותנים פלוס, ושונים נותנים מינוס. "
                        "וערך מוחלט, זה המרחק מאפס.") as d:
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=0.8)
                self.wait(max(d / 5 - 1.2, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.4)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
