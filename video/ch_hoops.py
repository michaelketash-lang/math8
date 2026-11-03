"""סרטון: כדורסל במספרים — אחוזי קליעה, נקודות, ממוצע, שווי זריקה ושינוי באחוזים (העשרה).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_hoops.py Hoops
"""
from common import *

add_pron({"ממוצע": "מְמֻצָּע", "הממוצע": "הַמְּמֻצָּע", "בממוצע": "בַּמְּמֻצָּע", "השלשה": "הַשְּׁלָשָׁה"})

C2, C3, C1 = BLUE_C, ORANGE, GREEN_C   # סל רגיל, שלשה, עונשין
BASE_Y, UNIT, BW = -2.9, 0.11, 0.8


def EQ(s, size=48, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def FR(a, b, size=44, color=WHITE):
    n, d = EQ(str(a), size, color), EQ(str(b), size, color)
    w = max(n.width, d.width) + 0.2
    ln = Line(LEFT * w / 2, RIGHT * w / 2, stroke_width=2.5, color=color)
    n.next_to(ln, UP, buff=0.08)
    d.next_to(ln, DOWN, buff=0.08)
    return VGroup(n, ln, d)


def ball(r=0.18, made=True):
    if not made:
        return Circle(radius=r, color=GREY_C, stroke_width=2)
    c = Circle(radius=r, fill_color=BALL, fill_opacity=1, stroke_width=0)
    seams = VGroup(Line(UP * r, DOWN * r), Line(LEFT * r, RIGHT * r)).set_stroke("#5a2a0a", 1.5)
    return VGroup(c, seams)


def balls(made, total, cols=5, r=0.18, gap=0.46):
    g = VGroup(*[ball(r, i < made) for i in range(total)])
    g.arrange_in_grid(cols=cols, buff=gap - 2 * r)
    return g


def grid100(made, color, s=0.22):
    return VGroup(*[Square(s * 0.82, stroke_width=0, fill_color=color if i < made else GREY_D, fill_opacity=1)
                    .move_to([(i % 10) * s, -(i // 10) * s, 0]) for i in range(100)])


def mkbar(v, x, color=C2):
    r = Rectangle(width=BW, height=max(v * UNIT, 0.01), fill_color=color, fill_opacity=0.9, stroke_width=0)
    r.move_to([x, BASE_Y + v * UNIT / 2, 0])
    return VGroup(r, EQ(str(v), 28).next_to(r, UP, buff=0.1))


class Hoops(Narrated):
    def construct(self):
        self.story()
        self.percent()
        self.points()
        self.average()
        self.shot_value()
        self.change()
        self.summary()

    def clear(self, keep=()):
        self.play(*[FadeOut(m) for m in self.mobjects if m not in keep], run_time=0.8)

    # ---------- פתיח: מי הקלע הכי טוב? ----------
    def story(self):
        crt = court(0.36).set_stroke(opacity=0.35)
        title = T("כדורסל במספרים", 66, font=TITLE)
        with self.voice("מי הקלע הכי טוב בקבוצה? כדי לענות על זה, צריך מתמטיקה.") as d:
            self.play(Create(crt), Write(title), run_time=2.5)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
        self.title = title

        uri = VGroup(T("אורי", 48, YELLOW), R("10", "שלשות", size=40)).arrange(DOWN, buff=0.3).move_to([3.3, 1.2, 0])
        noam = VGroup(T("נועם", 48, TEAL_B), R("6", "שלשות", size=40)).arrange(DOWN, buff=0.3).move_to([-3.3, 1.2, 0])
        with self.voice("אורי קלע במשחקים האחרונים עשר שלשות. נועם קלע רק שש. "
                        "אז אורי קולע יותר טוב, נכון?") as d:
            self.play(FadeIn(uri, shift=DOWN * 0.3), run_time=1)
            self.wait(1.5)
            self.play(FadeIn(noam, shift=DOWN * 0.3), run_time=1)
        ua = R("מתוך", "25", "ניסיונות", size=36, color=GREY_B).next_to(uri, DOWN, buff=0.35)
        na = R("מתוך", "10", "ניסיונות", size=36, color=GREY_B).next_to(noam, DOWN, buff=0.35)
        q = T("כדי להשוות בהגינות צריך אחוזים", 40, ORANGE).move_to(DOWN * 1.8)
        with self.voice("רגע! אורי ניסה עשרים וחמש פעמים, ונועם ניסה רק עשר. "
                        "כדי להשוות בצורה הוגנת, צריך אחוזים.") as d:
            self.play(FadeIn(ua, shift=UP * 0.2), run_time=1)
            self.play(FadeIn(na, shift=UP * 0.2), run_time=1)
            self.wait(1)
            self.play(Write(q), run_time=1.2)
        self.play(FadeOut(VGroup(crt, ua, na, q, uri[1], noam[1])),
                  uri[0].animate.move_to([3.3, 2.5, 0]), noam[0].animate.move_to([-3.3, 2.5, 0]))
        self.names = VGroup(uri[0], noam[0])

    # ---------- אחוז קליעה ----------
    def percent(self):
        gu = balls(10, 25).move_to([3.3, 0.75, 0])
        gn = balls(6, 10).move_to([-3.3, 0.75, 0])
        with self.voice("אחוז קליעה אומר: כמה זריקות נכנסו מתוך מאה. "
                        "מחלקים את מספר הקליעות במספר הניסיונות, וכופלים במאה.") as d:
            self.play(LaggedStart(*[FadeIn(b, scale=0.5) for b in gu], lag_ratio=0.05), run_time=2)
            self.play(LaggedStart(*[FadeIn(b, scale=0.5) for b in gn], lag_ratio=0.08), run_time=1.5)
        cu = VGroup(FR(10, 25), EQ("= 0.4", 44), EQ("= 40%", 48, YELLOW)).arrange(RIGHT, buff=0.2).move_to([3.3, -1.6, 0])
        cn = VGroup(FR(6, 10), EQ("= 0.6", 44), EQ("= 60%", 48, TEAL_B)).arrange(RIGHT, buff=0.2).move_to([-3.3, -1.6, 0])
        with self.voice("אורי: עשר חלקי עשרים וחמש, זה אפס נקודה ארבע. כפול מאה: ארבעים אחוז.") as d:
            self.play(Indicate(VGroup(*gu[:10]), color=YELLOW), run_time=1.2)
            self.play(FadeIn(cu[0]), FadeIn(cu[1]), run_time=1.2)
            self.play(Write(cu[2]), run_time=1)
        with self.voice("נועם: שש חלקי עשר, אפס נקודה שש. כלומר שישים אחוז.") as d:
            self.play(FadeIn(cn[0]), FadeIn(cn[1]), run_time=1.2)
            self.play(Write(cn[2]), run_time=1)
        box = SurroundingRectangle(VGroup(self.names[1], gn, cn), color=TEAL_B, buff=0.25, corner_radius=0.1)
        v = T("נועם קלע פחות, אבל קולע טוב יותר!", 38, TEAL_B).move_to(DOWN * 3.15)
        with self.voice("אז נועם קלע פחות שלשות, אבל הוא קולע טוב יותר!") as d:
            self.play(Create(box), run_time=1)
            self.play(FadeIn(v, shift=UP * 0.2), run_time=1)
        self.clear(keep=[self.title])

    # ---------- כמה נקודות ----------
    def points(self):
        def col(name, v, c):
            return VGroup(T(name, 36, c), EQ(str(v), 72, c), T("נקודות" if v > 1 else "נקודה", 26, GREY_B)).arrange(DOWN, buff=0.15)
        cols = VGroup(col("סל רגיל", 2, C2), col("שלשה", 3, C3), col("עונשין", 1, C1)).arrange(LEFT, buff=1.6).move_to(UP * 1.7)
        with self.voice("עכשיו נספור נקודות. סל רגיל שווה שתי נקודות, שלשה שווה שלוש, "
                        "וזריקת עונשין שווה נקודה אחת.") as d:
            for c in cols:
                self.play(FadeIn(c, shift=DOWN * 0.2), run_time=0.8)
                self.wait(max(d / 3 - 1, 0.2))

        lines = VGroup(
            R("סלים:", "5 · 2 = 10", size=38, color=C2),
            R("שלשות:", "4 · 3 = 12", size=38, color=C3),
            R("עונשין:", "6 · 1 = 6", size=38, color=C1),
        ).arrange(DOWN, buff=0.3, aligned_edge=RIGHT).move_to(UP * 1.0)
        with self.voice("במשחק אחד נועם קלע חמישה סלים, ארבע שלשות ושש זריקות עונשין. "
                        "חמש כפול שתיים, עשר. ארבע כפול שלוש, שתים עשרה. ושש עונשין, שש נקודות.") as d:
            self.play(FadeOut(cols, shift=UP * 0.3), run_time=0.6)
            self.wait(max(d / 2 - 3.5, 0.3))
            for ln in lines:
                self.play(FadeIn(ln, shift=LEFT * 0.2), run_time=0.9)
                self.wait(max(d / 6 - 0.9, 0.3))

        u = 0.3
        segs = VGroup(*[Rectangle(width=v * u, height=0.55, fill_color=c, fill_opacity=0.9, stroke_width=1, stroke_color=BLACK)
                        for v, c in ((10, C2), (12, C3), (6, C1))]).arrange(RIGHT, buff=0).move_to(DOWN * 2.5)
        segl = VGroup(*[EQ(str(v), 28, BLACK).move_to(s) for v, s in zip((10, 12, 6), segs)])
        tot = R("ביחד:", "10 + 12 + 6 = 28", "נקודות", size=40, color=YELLOW).next_to(segs, UP, buff=0.6)
        with self.voice("ביחד: עשר ועוד שתים עשרה ועוד שש, עשרים ושמונה נקודות.") as d:
            self.play(LaggedStart(*[GrowFromEdge(s, LEFT) for s in segs], lag_ratio=0.4), FadeIn(segl), run_time=1.8)
            self.play(Write(tot), run_time=1.2)
        self.clear(keep=[self.title])

    # ---------- ממוצע נקודות למשחק ----------
    def average(self):
        vals = [18, 22, 15, 25, 20]
        xs = [-4.6 + i * 1.35 for i in range(6)]
        bars = VGroup(*[mkbar(v, x) for v, x in zip(vals, xs)])
        base = Line([xs[0] - 0.8, BASE_Y, 0], [xs[-1] + 0.8, BASE_Y, 0], color=GREY_C)
        nums = VGroup(*[EQ(str(i + 1), 24, GREY_B).move_to([x, BASE_Y - 0.28, 0]) for i, x in enumerate(xs)])
        cap = T("משחק", 24, GREY_B).next_to(base, RIGHT, buff=0.2).shift(DOWN * 0.28)
        with self.voice("בחמשת המשחקים הראשונים של העונה, נועם קלע את הנקודות האלה.") as d:
            self.play(Create(base), FadeIn(nums[:5]), FadeIn(cap), run_time=1)
            self.play(LaggedStart(*[GrowFromEdge(b[0], DOWN) for b in bars], lag_ratio=0.2),
                      LaggedStart(*[FadeIn(b[1]) for b in bars], lag_ratio=0.2), run_time=2)

        s1 = EQ("18 + 22 + 15 + 25 + 20 = 100", 38).move_to(UP * 2.55)
        s2 = R("ממוצע:", "100 ÷ 5 = 20", "נקודות למשחק", size=38, color=ORANGE).move_to(UP * 1.85)
        yA = lambda a: BASE_Y + a * UNIT
        avg = ValueTracker(20)
        line = always_redraw(lambda: DashedLine([xs[0] - 0.7, yA(avg.get_value()), 0], [xs[-1] + 0.7, yA(avg.get_value()), 0],
                                                color=ORANGE, stroke_width=4, dash_length=0.15))
        tag = always_redraw(lambda: EQ(f"{avg.get_value():.0f}", 32, ORANGE).next_to(line, RIGHT, buff=0.15))
        with self.voice("כמה הוא קולע בממוצע? מחברים הכול: מאה נקודות. "
                        "ומחלקים בחמישה משחקים: עשרים נקודות למשחק.") as d:
            self.play(Write(s1), run_time=1.5)
            self.wait(0.8)
            self.play(FadeIn(s2), Create(line), FadeIn(tag), run_time=1.5)

        b6 = mkbar(32, xs[5], color=YELLOW)
        s3 = EQ("100 + 32 = 132", 38).move_to(UP * 2.55)
        s4 = R("ממוצע חדש:", "132 ÷ 6 = 22", size=38, color=ORANGE).move_to(UP * 1.85)
        with self.voice("ואז, במשחק השישי, הוא קלע שלושים ושתיים נקודות. "
                        "מוסיפים לסכום: מאה שלושים ושתיים. ומחלקים בשישה משחקים, לא בחמישה! "
                        "הממוצע עלה לעשרים ושתיים.") as d:
            self.play(FadeIn(nums[5]), GrowFromEdge(b6[0], DOWN), FadeIn(b6[1]), run_time=1.2)
            self.wait(1.2)
            self.play(ReplacementTransform(s1, s3), run_time=1)
            self.wait(1.2)
            self.play(ReplacementTransform(s2, s4), run_time=1)
            self.play(avg.animate.set_value(22), run_time=1.5)
        with self.voice("משחק מעל הממוצע מושך אותו למעלה, ומשחק מתחת לממוצע מוריד אותו.") as d:
            self.play(Indicate(b6, color=YELLOW), run_time=1.5)
        self.clear(keep=[self.title])

    # ---------- איזו זריקה שווה יותר ----------
    def shot_value(self):
        h3 = VGroup(T("שלשה", 42, C3), EQ("40%", 44, C3)).arrange(DOWN, buff=0.15).move_to([3.3, 2.5, 0])
        h2 = VGroup(T("זריקה לשתיים", 42, C2), EQ("55%", 44, C2)).arrange(DOWN, buff=0.15).move_to([-3.3, 2.5, 0])
        with self.voice("ועכשיו שאלה של מאמנים: מה עדיף, לזרוק לשלוש או לשתיים? "
                        "נניח ששחקן קולע ארבעים אחוז מהשלשות, וחמישים וחמישה אחוז מהזריקות לשתיים.") as d:
            self.play(FadeIn(h3, shift=DOWN * 0.2), FadeIn(h2, shift=DOWN * 0.2), run_time=1.2)
        g3 = grid100(40, C3).move_to([3.3, 0.35, 0])
        g2 = grid100(55, C2).move_to([-3.3, 0.35, 0])
        c3 = EQ("40 · 3 = 120", 42, C3).next_to(g3, DOWN, buff=0.35)
        c2 = EQ("55 · 2 = 110", 42, C2).next_to(g2, DOWN, buff=0.35)
        with self.voice("נדמיין מאה זריקות מכל סוג. מאה שלשות: ארבעים נכנסות, וכל אחת שווה שלוש. "
                        "זה מאה ועשרים נקודות.") as d:
            self.play(FadeIn(g3, lag_ratio=0.01), run_time=2)
            self.wait(max(d - 4, 0.3))
            self.play(Write(c3), run_time=1)
        with self.voice("מאה זריקות לשתיים: חמישים וחמש נכנסות, וכל אחת שווה שתיים. זה מאה ועשר נקודות.") as d:
            self.play(FadeIn(g2, lag_ratio=0.01), run_time=2)
            self.wait(max(d - 4, 0.3))
            self.play(Write(c2), run_time=1)
        p3 = R("לזריקה:", "1.2", size=36, color=C3).next_to(c3, DOWN, buff=0.25)
        p2 = R("לזריקה:", "1.1", size=36, color=C2).next_to(c2, DOWN, buff=0.25)
        box = SurroundingRectangle(VGroup(h3, g3, c3, p3), color=C3, buff=0.2, corner_radius=0.1)
        with self.voice("כלומר שלשה שווה בממוצע אחת נקודה שתיים נקודות לזריקה, ושתיים רק אחת נקודה אחת. "
                        "למרות שהאחוז נמוך יותר, השלשה שווה יותר! "
                        "בגלל זה קבוצות היום זורקות כל כך הרבה שלשות.") as d:
            self.play(FadeIn(p3), FadeIn(p2), run_time=1.2)
            self.wait(max(d / 2 - 1.2, 0.3))
            self.play(Create(box), run_time=1)
        self.clear(keep=[self.title])

    # ---------- טעות נפוצה: שינוי באחוזים, ויחס ----------
    def change(self):
        a = R("עונה שעברה:", "20", "נקודות למשחק", size=40).move_to(UP * 2.3)
        b = R("העונה:", "25", "נקודות למשחק", size=40).next_to(a, DOWN, buff=0.3)
        b.shift(RIGHT * (a.get_right()[0] - b.get_right()[0]))
        wrong = EQ("5%", 60, RED).move_to(DOWN * 0.1)
        cross = Cross(wrong, stroke_color=RED, stroke_width=6)
        with self.voice("טעות נפוצה: בעונה שעברה נועם קלע עשרים נקודות למשחק, והעונה עשרים וחמש. "
                        "בכמה אחוזים הוא השתפר? חמישה אחוז? לא!") as d:
            self.play(FadeIn(a), run_time=0.8)
            self.play(FadeIn(b), run_time=0.8)
            self.wait(max(d - 3.5, 0.5))
            self.play(FadeIn(wrong), run_time=0.6)
            self.play(Create(cross), run_time=0.6)
        s1 = R("השינוי:", "25 − 20 = 5", size=40).move_to(UP * 0.3)
        s2 = VGroup(FR(5, 20), EQ("= 0.25 = 25%", 48, GREEN_C)).arrange(RIGHT, buff=0.2).next_to(s1, DOWN, buff=0.45)
        s2n = T("מחלקים בערך הישן", 30, GREY_B).next_to(s2, DOWN, buff=0.3)
        with self.voice("השינוי הוא חמש נקודות. מחלקים אותו בערך הישן, עשרים: "
                        "חמש חלקי עשרים, זה אפס נקודה עשרים וחמש. כלומר עלייה של עשרים וחמישה אחוז.") as d:
            self.play(FadeOut(VGroup(wrong, cross)), FadeIn(s1), run_time=1)
            self.wait(1)
            self.play(FadeIn(s2[0]), FadeIn(s2n), run_time=1)
            self.wait(1.5)
            self.play(Write(s2[1]), run_time=1.2)
        self.clear(keep=[self.title])

        r1 = R("12", "מסירות לסל (אסיסטים)", size=40, color=C2)
        r2 = R("4", "איבודי כדור", size=40, color=RED_C)
        rr = VGroup(r1, r2).arrange(DOWN, buff=0.3, aligned_edge=RIGHT).move_to(UP * 1.2)
        r3 = EQ("12 : 4 = 3 : 1", 56, YELLOW).next_to(rr, DOWN, buff=0.6)
        r4 = R("3", "אסיסטים על כל איבוד", size=36, color=GREY_B).next_to(r3, DOWN, buff=0.3)
        with self.voice("ועוד מספר שמאמנים אוהבים: יחס אסיסטים לאיבודים. "
                        "שתים עשרה מסירות לסל וארבעה איבודים: יחס של שלוש לאחת.") as d:
            self.play(FadeIn(rr, shift=DOWN * 0.2), run_time=1)
            self.wait(max(d / 2 - 1, 0.3))
            self.play(Write(r3), run_time=1.2)
            self.play(FadeIn(r4), run_time=0.8)
        self.clear(keep=[self.title])

    # ---------- סיכום ----------
    def summary(self):
        rows = VGroup(
            R("אחוז קליעה: קליעות חלקי ניסיונות, כפול", "100", size=34),
            R("סל =", "2", "    שלשה =", "3", "    עונשין =", "1", size=34),
            T("ממוצע: סך הנקודות חלקי מספר המשחקים", 34),
            T("משווים אחוזים, לא רק כמויות", 34),
            R("שווי זריקה: אחוז כפול ערך", "0.4 · 3 = 1.2", size=34),
            T("שינוי באחוזים: השינוי חלקי הערך הישן", 34),
        ).arrange(DOWN, buff=0.32, aligned_edge=RIGHT).move_to(UP * 0.35)
        with self.voice("אז מה למדנו? אחוז קליעה: קליעות חלקי ניסיונות, כפול מאה. "
                        "ממוצע: סך הנקודות חלקי מספר המשחקים. משווים שחקנים לפי אחוזים, לא לפי כמויות. "
                        "ושווי של זריקה: אחוז כפול ערך הזריקה.") as d:
            for r in rows:
                self.play(FadeIn(r, shift=LEFT * 0.2), run_time=0.8)
                self.wait(max(d / 6 - 0.8, 0.1))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.45)
        with self.voice("עכשיו תורך! הכנס את המספרים של השחקן האהוב עליך, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
