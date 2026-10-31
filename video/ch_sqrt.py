"""סרטון: שורש ריבועי ומשוואות x² = c (כיתה ח׳, כרך ב׳ פרק 10).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_sqrt.py Sqrt
"""
from common import *

add_pron({"בריבוע": "בְּריבוע", "מבודדים": "מְבוֹדְדִים", "הסוגריים": "הַסוֹגריים", "סוגריים": "סוֹגריים"})


def F(s, size=52, color=WHITE):
    """נוסחה (בלי עברית). x נטוי."""
    return MarkupText(s.replace("x", "<i>x</i>"), font=MATH, font_size=size, color=color)


class Sqrt(Narrated):
    def construct(self):
        self.story()
        self.root()
        self.order()
        self.equation()
        self.example()
        self.summary()

    def clear(self):
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- סיפור: מגרש ריבועי ----------
    def story(self):
        title = T("שורש ריבועי ומשוואות", 64, font=TITLE)
        with self.voice("לקבוצה יש מגרש אימון בצורת ריבוע. השטח שלו הוא מאה תשעים ושישה מטרים רבועים. "
                        "מה אורך הצלע של המגרש?") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
            sq = Square(4, color=COURT, stroke_width=5, fill_color=COURT, fill_opacity=0.12).shift(LEFT * 3 + DOWN * 0.4)
            area = R("196", "מ״ר", size=44).move_to(sq)
            side = F("?", 60, YELLOW).next_to(sq, DOWN, buff=0.25)
            side2 = F("?", 60, YELLOW).next_to(sq, LEFT, buff=0.25)
            self.play(Create(sq), FadeIn(area), run_time=1.5)
            self.play(FadeIn(side), FadeIn(side2), run_time=1)
        self.title = title
        e1 = F("x · x = 196", 56).shift(RIGHT * 2.8 + UP * 1.2)
        e2 = F("14 · 14 = 196", 56).next_to(e1, DOWN, buff=0.5)
        e3 = F("√196 = 14", 72, YELLOW).next_to(e2, DOWN, buff=0.6)
        with self.voice("שטח ריבוע הוא צלע כפול צלע. אז מחפשים מספר שכפול עצמו נותן מאה תשעים ושש. "
                        "אחרי קצת ניסיונות: ארבע עשרה כפול ארבע עשרה, מאה תשעים ושש!") as d:
            self.play(Write(e1), run_time=1.5)
            self.wait(max(d - 4, 0.5))
            self.play(Write(e2), run_time=1.5)
        with self.voice("המספר הזה נקרא השורש הריבועי של מאה תשעים ושש. "
                        "כותבים אותו עם הסימן הזה, ואומרים: שורש מאה תשעים ושש שווה ארבע עשרה.") as d:
            self.play(Write(e3), run_time=2)
            self.play(Transform(side, F("14", 52, YELLOW).move_to(side)), Transform(side2, F("14", 52, YELLOW).move_to(side2)), run_time=1)
        self.clear()

    # ---------- שורש מבטל ריבוע ----------
    def root(self):
        a = F("7² = 49", 72).shift(LEFT * 3 + UP * 1.2)
        b = F("√49 = 7", 72, YELLOW).shift(RIGHT * 3 + UP * 1.2)
        arr = Arrow(a.get_right(), b.get_left(), buff=0.4, color=GREY_B)
        lab = T("השורש מבטל את הריבוע", 34, GREY_B).next_to(arr, DOWN, buff=0.25)
        with self.voice("שורש וריבוע הם פעולות הפוכות. שבע בריבוע זה ארבעים ותשע, "
                        "ולכן שורש ארבעים ותשע זה שבע. השורש מבטל את הריבוע.") as d:
            self.play(Write(a), run_time=1.5)
            self.play(GrowArrow(arr), FadeIn(lab), run_time=1)
            self.play(Write(b), run_time=1.5)
        sq = VGroup(*[VGroup(F(f"{n}²", 34, GREY_B), F(str(n * n), 40)).arrange(DOWN, buff=0.15) for n in range(1, 13)])
        sq.arrange(RIGHT, buff=0.45).shift(DOWN * 1.2)
        with self.voice("כדאי להכיר את הריבועים: אחת, ארבע, תשע, שש עשרה, עשרים וחמש, "
                        "וכך הלאה, עד מאה ארבעים וארבע.") as d:
            self.play(LaggedStart(*[FadeIn(s, shift=UP * 0.2) for s in sq], lag_ratio=0.15), run_time=d - 0.5)
        neg = F("√(−9) = ?", 60, RED_C).shift(DOWN * 1.2)
        why = T("אין מספר שכפול עצמו נותן מספר שלילי", 34, RED_C).next_to(neg, DOWN, buff=0.35)
        with self.voice("ושורש של מספר שלילי? אין כזה. "
                        "כי כל מספר כפול עצמו, גם מספר שלילי, יוצא חיובי.") as d:
            self.play(FadeOut(sq), FadeIn(neg), run_time=1)
            self.play(FadeIn(why), run_time=1)
        self.clear()

    # ---------- סדר פעולות ----------
    def order(self):
        head = T("שורש בסדר פעולות החשבון", 44, YELLOW).next_to(self.title, DOWN, buff=0.4)
        l1 = F("√(9 + 16) = √25 = 5", 60).shift(UP * 0.9)
        l2 = F("√9 + √16 = 3 + 4 = 7", 60).next_to(l1, DOWN, buff=0.7)
        ne = F("5 ≠ 7", 64, RED_C).next_to(l2, DOWN, buff=0.6)
        with self.voice("עכשיו שים לב. שורש של תשע ועוד שש עשרה: קודם מחברים מתחת לשורש, עשרים וחמש, "
                        "והשורש שלו חמש.") as d:
            self.play(FadeIn(head), run_time=0.8)
            self.play(Write(l1), run_time=2.5)
        with self.voice("אבל שורש תשע ועוד שורש שש עשרה, זה שלוש ועוד ארבע, שבע. יצא משהו אחר!") as d:
            self.play(Write(l2), run_time=2.5)
            self.play(FadeIn(ne, scale=1.3), run_time=0.8)
        rule = R("השורש הוא כמו", "( )", ": קודם מחשבים את מה שמתחתיו", size=38, color=YELLOW).next_to(ne, DOWN, buff=0.5)
        with self.voice("המסקנה: השורש מתנהג כמו סוגריים. קודם מחשבים את מה שמתחתיו, "
                        "ורק אחר כך מוציאים שורש.") as d:
            self.play(FadeIn(rule, shift=UP * 0.2), run_time=1)
        self.play(FadeOut(VGroup(l1, l2, ne, rule)))
        m = F("3√25 = 3 · 5 = 15", 64).shift(UP * 0.3)
        with self.voice("ועוד דבר: שלוש שורש עשרים וחמש, פירושו שלוש כפול שורש עשרים וחמש. "
                        "שלוש כפול חמש, חמש עשרה.") as d:
            self.play(Write(m), run_time=2.5)
        self.clear()

    # ---------- x² = c ----------
    def equation(self):
        q = F("x² = 25", 80).shift(UP * 1.6)
        with self.voice("ועכשיו משוואה: איקס בריבוע שווה עשרים וחמש. איזה מספר בריבוע נותן עשרים וחמש?") as d:
            self.play(Write(q), run_time=1.5)
        a = F("5 · 5 = 25", 56, GREEN_C).shift(LEFT * 3 + UP * 0.1)
        b = F("(−5) · (−5) = 25", 56, GREEN_C).shift(RIGHT * 3 + UP * 0.1)
        ans = R("שני פתרונות:", "<i>x</i> = 5", "או", "<i>x</i> = −5", size=48, color=YELLOW).shift(DOWN * 1.6)
        with self.voice("חמש, כי חמש כפול חמש זה עשרים וחמש. אבל רגע! גם מינוס חמש כפול מינוס חמש זה עשרים וחמש. "
                        "אז יש שני פתרונות: איקס שווה חמש, או איקס שווה מינוס חמש.") as d:
            self.play(Write(a), run_time=1.5)
            self.wait(1)
            self.play(Write(b), run_time=2)
            self.play(FadeIn(ans, shift=UP * 0.2), run_time=1.2)
        self.clear()

        ax = Axes(x_range=[-5, 5, 1], y_range=[-5, 17, 2], x_length=5.6, y_length=5.8, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=0.9).shift(DOWN * 0.45)
        labs = VGroup(*[T(str(x).replace("-", "−"), 22, GREY_B).next_to(ax.c2p(x, 0), DOWN, buff=0.12) for x in (-4, -2, 2, 4)],
                      *[T(str(y).replace("-", "−"), 22, GREY_B).next_to(ax.c2p(0, y), LEFT, buff=0.12) for y in (-4, 4, 8, 12, 16)])
        par = ax.plot(lambda x: x * x, x_range=[-4.1, 4.1], color=BLUE_C, stroke_width=5)
        plab = F("y = x²", 40, BLUE_C).next_to(ax.c2p(4.1, 16.8), LEFT, buff=0.1)
        c = ValueTracker(9)
        line = always_redraw(lambda: ax.plot(lambda x: c.get_value(), x_range=[-5, 5], color=ORANGE, stroke_width=4))
        dots = always_redraw(lambda: VGroup(*([Dot(ax.c2p(s * np.sqrt(c.get_value()), c.get_value()), color=YELLOW, radius=0.11)
                                               for s in ((1, -1) if c.get_value() > 0.05 else (1,))] if c.get_value() > -0.05 else [])))
        def info():
            v = round(c.get_value())  # שלמים בלבד, גם באמצע האנימציה
            if v > 0:
                r = int(np.sqrt(v)) if int(np.sqrt(v)) ** 2 == v else f"√{v}"
                return VGroup(F(f"x² = {v}", 56), R("שני פתרונות:", f"±{r}", size=44, color=YELLOW)).arrange(DOWN, buff=0.4)
            if v == 0:
                return VGroup(F("x² = 0", 56), R("פתרון אחד:", "0", size=44, color=YELLOW)).arrange(DOWN, buff=0.4)
            return VGroup(F(f"x² = −{-v}", 56), T("אין פתרון", 44, RED_C)).arrange(DOWN, buff=0.4)
        box = always_redraw(lambda: info().to_edge(RIGHT, buff=1.0).shift(UP * 0.5))
        with self.voice("בוא נראה את זה בגרף. העקומה הכחולה היא וואי שווה איקס בריבוע. "
                        "הקו הכתום הוא וואי שווה תשע. כל מקום שבו הם נפגשים הוא פתרון של המשוואה איקס בריבוע שווה תשע. "
                        "יש שתי נקודות מפגש: שלוש, ומינוס שלוש.") as d:
            self.play(Create(ax), FadeIn(labs), run_time=1.2)
            self.play(Create(par), FadeIn(plab), run_time=1.5)
            self.play(Create(line), run_time=1)
            self.play(FadeIn(dots), FadeIn(box), run_time=1)
        with self.voice("עכשיו נוריד את הקו. כל עוד המספר חיובי, יש שני פתרונות. "
                        "כשהמספר הוא אפס, הקו רק נוגע בעקומה בנקודה אחת: יש פתרון אחד, איקס שווה אפס.") as d:
            self.play(c.animate.set_value(4), run_time=2)
            self.play(c.animate.set_value(1), run_time=1.5)
            self.play(c.animate.set_value(0), run_time=1.5)
        with self.voice("וכשהמספר שלילי, הקו נמצא מתחת לעקומה, ואין שום נקודת מפגש. "
                        "אין פתרון! כי ריבוע של מספר אף פעם לא שלילי.") as d:
            self.play(c.animate.set_value(-3), run_time=2)
        box.clear_updaters(); line.clear_updaters(); dots.clear_updaters()
        self.clear()

    # ---------- דוגמה ----------
    def example(self):
        head = T("דוגמה", 44, YELLOW).next_to(self.title, DOWN, buff=0.35)
        L = ["2x² − 8 = 42", "2x² = 50", "x² = 25", "x = 5  או  x = −5"]
        rows = VGroup(F(L[0]), F(L[1]), F(L[2]), R("<i>x</i> = 5", "או", "<i>x</i> = −5", size=52, color=YELLOW)
                      ).arrange(DOWN, buff=0.45).next_to(head, DOWN, buff=0.5)
        notes = [None, R("+8", "לשני האגפים", size=30, color=GREY_B), R("÷2", size=30, color=GREY_B), R("שורש", size=30, color=GREY_B)]
        for n, r in zip(notes, rows):
            if n: n.next_to(r, LEFT, buff=0.8)
        with self.voice("ננסה משוואה קצת יותר מסובכת: שתיים איקס בריבוע פחות שמונה, שווה ארבעים ושתיים. "
                        "הרעיון: קודם מבודדים את איקס בריבוע, בדיוק כמו במשוואה רגילה.") as d:
            self.play(FadeIn(head), Write(rows[0]), run_time=2)
        with self.voice("מוסיפים שמונה לשני האגפים: שתיים איקס בריבוע שווה חמישים. "
                        "מחלקים בשתיים: איקס בריבוע שווה עשרים וחמש.") as d:
            self.play(Write(rows[1]), FadeIn(notes[1]), run_time=1.5)
            self.wait(max(d / 2 - 1.5, 0.3))
            self.play(Write(rows[2]), FadeIn(notes[2]), run_time=1.5)
        box = SurroundingRectangle(rows[3], color=YELLOW, buff=0.15)
        with self.voice("ועכשיו: חמש, או מינוס חמש.") as d:
            self.play(Write(rows[3]), FadeIn(notes[3]), run_time=1.5)
            self.play(Create(box), run_time=0.8)
        warn = T("טעות נפוצה: לשכוח את הפתרון השלילי!", 38, RED_C).to_edge(DOWN, buff=0.6)
        with self.voice("והטעות הכי נפוצה: לכתוב רק חמש, ולשכוח את מינוס חמש. "
                        "תמיד תשאל את עצמך: יש גם פתרון שלילי?") as d:
            self.play(FadeIn(warn, shift=UP * 0.2), Indicate(rows[3][2], color=RED_C, scale_factor=1.4), run_time=1.5)
        self.clear()

    # ---------- סיכום ----------
    def summary(self):
        lines = VGroup(
            R("√49 = 7", "כי", "7² = 49", size=42),
            R("השורש הוא כמו סוגריים:", "√(9 + 16) = 5", size=42),
            R("<i>x</i>² = <i>c</i>", ": חיובי ← שני פתרונות, אפס ← אחד, שלילי ← אין", size=40),
            R("קודם מבודדים את", "<i>x</i>²", ", ואז מוציאים שורש", size=42),
        ).arrange(DOWN, buff=0.5, aligned_edge=RIGHT).shift(UP * 0.4)
        with self.voice("אז מה למדנו? שורש ארבעים ותשע הוא שבע, כי שבע בריבוע זה ארבעים ותשע. "
                        "השורש מתנהג כמו סוגריים. למשוואה איקס בריבוע שווה מספר חיובי יש שני פתרונות, "
                        "לאפס יש פתרון אחד, ולמספר שלילי אין פתרון. ובמשוואה מסובכת, קודם מבודדים את איקס בריבוע.") as d:
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 4 - 1.1, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.6)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
