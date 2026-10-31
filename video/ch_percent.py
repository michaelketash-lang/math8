"""סרטון: אחוזים (כיתה ח׳, כרך ב׳ פרק 1).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_percent.py Percent
"""
from common import *

add_pron({"הנחה": "הֲנָחָה", "בהנחה": "בַּהֲנָחָה"})


def EQ(s, size=48, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def FR(a, b, size=48, color=WHITE):
    n, d = EQ(str(a), size, color), EQ(str(b), size, color)
    w = max(n.width, d.width) + 0.25
    ln = Line(LEFT * w / 2, RIGHT * w / 2, stroke_width=3, color=color)
    n.next_to(ln, UP, buff=0.12)
    d.next_to(ln, DOWN, buff=0.12)
    return VGroup(n, ln, d)


def grid100(s=0.36):
    return VGroup(*[Square(s * 0.86, stroke_width=0, fill_color=GREY_D, fill_opacity=1).move_to([(i % 10) * s, -(i // 10) * s, 0])
                    for i in range(100)])


def tenbar(values, w=0.95, h=0.8, on=0, color=ORANGE):
    """פס של 10 קופסאות; values = טקסט לכל קופסה; on = כמה צבועות."""
    g = VGroup()
    for i in range(10):
        b = Rectangle(width=w, height=h, stroke_color=BLUE_C, stroke_width=3,
                      fill_color=color if i < on else "#1d2a42", fill_opacity=1)
        g.add(VGroup(b, EQ(values[i], 30).move_to(b)))
    return g.arrange(RIGHT, buff=0.04)


class Percent(Narrated):
    def construct(self):
        self.story()
        self.what()
        self.of_number()
        self.compare()
        self.change()
        self.whole()
        self.summary()

    def clear(self, keep=()):
        self.play(*[FadeOut(m) for m in self.mobjects if m not in keep], run_time=0.8)

    # ---------- פתיח ----------
    def story(self):
        title = T("אחוזים", 72, font=TITLE)
        with self.voice("שני שחקנים מתחרים מי קולע טוב יותר מהעונשין. "
                        "רון קלע שמונה עשרה מתוך עשרים וארבע זריקות. ודן קלע ארבע עשרה מתוך עשרים. מי טוב יותר?") as d:
            self.play(Write(title), run_time=1.5)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
            a = R("רון:", "18", "מתוך", "24", size=44, color=ORANGE)
            b = R("דן:", "14", "מתוך", "20", size=44, color=BLUE_C)
            VGroup(a, b).arrange(DOWN, buff=0.6, aligned_edge=RIGHT).move_to(UP * 0.3)
            self.play(FadeIn(a, shift=LEFT * 0.3), run_time=1)
            self.wait(1)
            self.play(FadeIn(b, shift=LEFT * 0.3), run_time=1)
        q = T("קשה להשוות... כי מספר הזריקות שונה", 36, GREY_B).to_edge(DOWN, buff=1)
        with self.voice("קשה להשוות, כי כל אחד זרק מספר אחר של זריקות. "
                        "בשביל זה יש אחוזים: הופכים הכול לחלק מתוך מאה.") as d:
            self.play(FadeIn(q), run_time=1)
        self.title = title
        self.ab = VGroup(a, b)
        self.clear(keep=[title])

    # ---------- מה זה אחוז ----------
    def what(self):
        g = grid100().move_to(LEFT * 3 + DOWN * 0.4)
        with self.voice("אחוז פירושו: חלק אחד מתוך מאה. הנה מאה ריבועים. כל ריבוע הוא אחוז אחד.") as d:
            self.play(LaggedStart(*[FadeIn(q, scale=0.3) for q in g], lag_ratio=0.01), run_time=2.5)
        info = VGroup(EQ("25%", 64, ORANGE),
                      VGroup(EQ("=", 56), FR(25, 100, 48), EQ("=", 56), FR(1, 4, 48), EQ("= 0.25", 56)).arrange(RIGHT, buff=0.25)
                      ).arrange(DOWN, buff=0.5).move_to(RIGHT * 3 + DOWN * 0.4)
        with self.voice("נצבע עשרים וחמישה ריבועים. זה עשרים וחמישה אחוז. "
                        "עשרים וחמש מתוך מאה, זה בדיוק רבע מהריבועים.") as d:
            self.play(LaggedStart(*[q.animate.set_fill(ORANGE) for q in g[:25]], lag_ratio=0.04), run_time=2)
            self.play(Write(info[0]), run_time=1)
            self.play(FadeIn(info[1]), run_time=1.5)
        info2 = VGroup(R("50%", "= חצי", size=40), R("10%", "= עשירית", size=40), R("100%", "= הכול", size=40)
                       ).arrange(DOWN, buff=0.35, aligned_edge=RIGHT).move_to(info)
        with self.voice("עוד כמה שכדאי לזכור: חמישים אחוז זה חצי. עשרה אחוז זה עשירית. ומאה אחוז זה הכול.") as d:
            self.play(FadeOut(info), run_time=0.5)
            self.play(*[q.animate.set_fill(ORANGE) for q in g[25:50]], FadeIn(info2[0]), run_time=1.2)
            self.play(*[q.animate.set_fill(GREY_D) for q in g[10:50]], FadeIn(info2[1]), run_time=1.2)
            self.play(*[q.animate.set_fill(ORANGE) for q in g[10:]], FadeIn(info2[2]), run_time=1.2)
        self.clear(keep=[self.title])

    # ---------- אחוז ממספר ----------
    def of_number(self):
        q = R("כמה זה", "30%", "מתוך", "80", "?", size=44).to_edge(UP, buff=1.3)
        bar = tenbar(["8"] * 10).move_to(UP * 0.4)
        whole = Brace(bar, UP, color=GREY_B)
        wl = EQ("100% = 80", 32, GREY_B).next_to(whole, UP, buff=0.1)
        with self.voice("איך מחשבים אחוז ממספר? למשל: כמה זה שלושים אחוז מתוך שמונים? "
                        "טריק: קודם מוצאים עשרה אחוז. מחלקים את שמונים לעשרה חלקים שווים. כל חלק הוא שמונה.") as d:
            self.play(FadeIn(q), run_time=1)
            self.play(FadeIn(whole), FadeIn(wl), run_time=1)
            self.play(LaggedStart(*[GrowFromCenter(b) for b in bar], lag_ratio=0.1), run_time=2)
        tens = VGroup(*[EQ("10%", 22, GREY_B).next_to(b, DOWN, buff=0.1) for b in bar])
        three = Brace(bar[:3], DOWN, buff=0.45, color=ORANGE)
        res = EQ("30% = 3 · 8 = 24", 44, ORANGE).next_to(three, DOWN, buff=0.2)
        res.shift(RIGHT * (bar[:3].get_center()[0] - res.get_center()[0]) + RIGHT * 1.5)
        with self.voice("כל חלק הוא עשרה אחוז. שלושים אחוז הם שלושה חלקים: שלוש כפול שמונה, עשרים וארבע.") as d:
            self.play(FadeIn(tens), run_time=1)
            self.play(*[b[0].animate.set_fill(ORANGE) for b in bar[:3]], run_time=1.2)
            self.play(FadeIn(three), Write(res), run_time=1.5)
        alt = VGroup(FR(30, 100, 44), EQ("· 80 = 24", 48)).arrange(RIGHT, buff=0.2).to_edge(DOWN, buff=0.5)
        with self.voice("ואפשר גם בתרגיל אחד: שלושים חלקי מאה, כפול שמונים. יוצא אותו דבר: עשרים וארבע.") as d:
            self.play(Write(alt), run_time=2)
        self.clear(keep=[self.title])

    # ---------- השוואה ----------
    def compare(self):
        a = VGroup(FR(18, 24, 48, ORANGE), EQ("· 100 = 75%", 48, ORANGE)).arrange(RIGHT, buff=0.2)
        b = VGroup(FR(14, 20, 48, BLUE_C), EQ("· 100 = 70%", 48, BLUE_C)).arrange(RIGHT, buff=0.2)
        la, lb = T("רון", 40, ORANGE), T("דן", 40, BLUE_C)
        rows = VGroup(VGroup(a, la).arrange(RIGHT, buff=0.6), VGroup(b, lb).arrange(RIGHT, buff=0.6)).arrange(DOWN, buff=0.7)
        rows.move_to(UP * 0.3)
        how = T("כמה אחוזים? מחלקים את החלק בשלם, וכופלים ב־100", 34, YELLOW).to_edge(DOWN, buff=1)
        with self.voice("עכשיו נחזור לשחקנים. כדי לדעת כמה אחוזים, מחלקים את החלק בשלם, וכופלים במאה. "
                        "רון: שמונה עשרה חלקי עשרים וארבע, כפול מאה, זה שבעים וחמישה אחוז.") as d:
            self.play(FadeIn(how), run_time=1)
            self.play(FadeIn(la), Write(a), run_time=2)
        crown = T("רון קולע טוב יותר!", 40, YELLOW).next_to(rows, DOWN, buff=0.6)
        with self.voice("דן: ארבע עשרה חלקי עשרים, כפול מאה, זה שבעים אחוז. אז רון קולע טוב יותר, "
                        "למרות שהוא החטיא יותר זריקות.") as d:
            self.play(FadeIn(lb), Write(b), run_time=2)
            self.play(FadeIn(crown, scale=1.2), run_time=1)
        self.clear(keep=[self.title])

    # ---------- עלייה והנחה ----------
    def change(self):
        ax_y = DOWN * 2.6
        base = Line(LEFT * 6.3 + ax_y, RIGHT * 0 + ax_y, color=GREY_C)
        k = 4.2 / 240

        def bar(v, x, color):
            r = Rectangle(width=1.6, height=v * k, fill_color=color, fill_opacity=1, stroke_width=0)
            r.move_to([x, ax_y[1] + v * k / 2, 0])
            return VGroup(r, EQ(str(v), 36).next_to(r, UP, buff=0.12))

        b0 = bar(200, -5.2, BLUE_C)
        cap = T("חולצת כדורסל", 30, GREY_B).next_to(b0, UP, buff=0.5)
        with self.voice("עכשיו מחירים. חולצת כדורסל עולה מאתיים שקל.") as d:
            self.play(Create(base), GrowFromEdge(b0[0], DOWN), FadeIn(b0[1]), FadeIn(cap), run_time=1.5)
        b1 = bar(240, -3.2, ORANGE)
        e1 = EQ("200 · 1.2 = 240", 44, ORANGE).move_to(RIGHT * 3.6 + UP * 1.2)
        n1 = R("עלייה של", "20%", size=32, color=ORANGE).next_to(e1, UP, buff=0.25)
        with self.voice("לפני העונה המחיר עלה בעשרים אחוז. עשרים אחוז ממאתיים זה ארבעים, "
                        "אז המחיר החדש מאתיים וארבעים. "
                        "דרך קצרה: כופלים באחד נקודה שתיים, כי עכשיו משלמים מאה ועשרים אחוז.") as d:
            self.play(FadeIn(n1), run_time=1)
            self.play(TransformFromCopy(b0[0], b1[0]), FadeIn(b1[1]), run_time=1.5)
            self.wait(2)
            self.play(Write(e1), run_time=1.5)
        b2 = bar(192, -1.2, GREEN_C)
        e2 = EQ("240 · 0.8 = 192", 44, GREEN_C).next_to(e1, DOWN, buff=1.0)
        n2 = R("הנחה של", "20%", size=32, color=GREEN_C).next_to(e2, UP, buff=0.25)
        with self.voice("בסוף העונה יש הנחה של עשרים אחוז. האם חוזרים למאתיים? בוא נבדוק. "
                        "עשרים אחוז ממאתיים וארבעים זה ארבעים ושמונה. נשאר מאה תשעים ושתיים.") as d:
            self.play(FadeIn(n2), run_time=1)
            self.wait(2.5)
            self.play(TransformFromCopy(b1[0], b2[0]), FadeIn(b2[1]), Write(e2), run_time=1.5)
        line200 = DashedLine(b0[0].get_corner(UL), [b2[0].get_right()[0] + 0.3, b0[0].get_top()[1], 0], color=WHITE)
        trap = T("עלייה והנחה באותו אחוז\nלא מחזירות להתחלה!", 34, RED_C).next_to(e2, DOWN, buff=0.8)
        with self.voice("לא חזרנו למאתיים! למה? כי את ההנחה חישבנו מהמחיר הגדול יותר, מאתיים וארבעים. "
                        "זו טעות נפוצה, אז שים לב.") as d:
            self.play(Create(line200), run_time=1.2)
            self.play(Indicate(b2, color=RED_C), run_time=1.2)
            self.play(FadeIn(trap), run_time=1)
        self.clear(keep=[self.title])

    # ---------- מוצאים את השלם ----------
    def whole(self):
        q = R("40%", "מהזריקות הן", "12", "קליעות. כמה זריקות היו?", size=38).to_edge(UP, buff=1.3)
        bar = tenbar(["?"] * 10, on=4).move_to(UP * 0.1)
        part = Brace(bar[:4], DOWN, color=ORANGE)
        pl = EQ("40% = 12", 34, ORANGE).next_to(part, DOWN, buff=0.1)
        with self.voice("ולפעמים צריך ללכת הפוך. ארבעים אחוז מהזריקות של שחקן היו קליעות, "
                        "וזה שתים עשרה קליעות. כמה זריקות היו בסך הכול?") as d:
            self.play(FadeIn(q), run_time=1.2)
            self.play(LaggedStart(*[GrowFromCenter(b) for b in bar], lag_ratio=0.08), run_time=1.5)
            self.play(FadeIn(part), FadeIn(pl), run_time=1)
        threes = VGroup(*[EQ("3", 30).move_to(b) for b in bar])
        all_ = Brace(bar, UP, color=YELLOW)
        al = EQ("100% = 10 · 3 = 30", 36, YELLOW).next_to(all_, UP, buff=0.1)
        with self.voice("ארבעים אחוז הם ארבעה חלקים. שתים עשרה חלקי ארבע, זה שלוש בכל חלק. "
                        "יש עשרה חלקים, אז בסך הכול שלושים זריקות.") as d:
            self.play(*[ReplacementTransform(b[1], t) for b, t in zip(bar, threes)], run_time=1.5)
            self.wait(1)
            self.play(FadeIn(all_), Write(al), run_time=1.5)
        eq = VGroup(EQ("0.4<i>x</i> = 12"), EQ("<i>x</i> = 12 ÷ 0.4 = 30", color=YELLOW)).arrange(DOWN, buff=0.3)
        eq.to_edge(DOWN, buff=0.5)
        with self.voice("ועם משוואה: מסמנים את מספר הזריקות באיקס. ארבעים אחוז מאיקס זה אפס נקודה ארבע איקס, "
                        "וזה שווה שתים עשרה. מחלקים, ואיקס שווה שלושים.") as d:
            self.play(Write(eq[0]), run_time=1.5)
            self.wait(1.5)
            self.play(Write(eq[1]), run_time=1.5)
        self.clear(keep=[self.title])

    # ---------- סיכום ----------
    def summary(self):
        lines = VGroup(
            T("אחוז = חלק אחד מתוך 100", 36),
            T("טריק: קודם מוצאים 10% (מחלקים ב־10)", 36),
            T("כמה אחוזים? חלק חלקי שלם, כפול 100", 36),
            T("עלייה של 20%: כופלים ב־1.2", 36),
            T("הנחה של 20%: כופלים ב־0.8", 36),
            R("מחפשים את השלם:", "0.4<i>x</i> = 12", size=36),
        ).arrange(DOWN, buff=0.4, aligned_edge=RIGHT).move_to(UP * 0.2)
        with self.voice("אז מה למדנו? אחוז הוא חלק מתוך מאה. עשרה אחוז מוצאים בחילוק בעשר. "
                        "כמה אחוזים: חלק חלקי שלם, כפול מאה. עלייה והנחה: כופלים. "
                        "ואם מחפשים את השלם, כותבים משוואה.") as d:
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=0.8)
                self.wait(max(d / 6 - 1.0, 0.2))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
