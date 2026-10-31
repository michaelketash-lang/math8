"""סרטון: אי־שוויונות — פתרון אלגברי וגרפי (כיתה ח׳, פרקים 11–12).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_inequalities.py Inequalities
"""
from common import *

add_pron({"השליליות": "הַשְלִילִיוּת"})  # בלי ניקוד הקול אומר "השליליוֹת"

SOL, NEG = GREEN_C, RED_C
RC = RIGHT * 3.7
GT, LT = "&gt;", "&lt;"  # MarkupText: סימני < > חייבים להיות escaped


def F(s, size=44, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def num(v):
    return str(v).replace("-", "−")


class NumLine(VGroup):
    """ציר מספרים אופקי עם לייבלים ידניים."""
    def __init__(self, lo, hi, width=11, every=1, size=26, **kw):
        super().__init__(**kw)
        self.lo, self.hi, self.w = lo, hi, width
        self.add(Line(LEFT * width / 2, RIGHT * width / 2, color=GREY_B, stroke_width=3))
        for v in range(lo, hi + 1):
            big = v % every == 0
            self.add(Line(UP * (0.15 if big else 0.08), DOWN * (0.15 if big else 0.08), color=GREY_B, stroke_width=3 if v == 0 else 2).move_to(self.n2p(v)))
            if big:
                self.add(F(num(v), size, GREY_B).next_to(self.n2p(v), DOWN, buff=0.22))

    def n2p(self, v):
        return self[0].get_start() + RIGHT * (v - self.lo) / (self.hi - self.lo) * self.w

    def ray(self, v, right, closed, color=SOL):
        end = self.n2p(self.hi + 0.6) if right else self.n2p(self.lo - 0.6)
        arrow = Arrow(self.n2p(v), end, buff=0, color=color, stroke_width=10, max_tip_length_to_length_ratio=0.08, max_stroke_width_to_length_ratio=20)
        dot = Circle(radius=0.14, color=color, stroke_width=5).set_fill(color if closed else config.background_color, 1).move_to(self.n2p(v))
        return VGroup(arrow, dot.set_z_index(3))


class Inequalities(Narrated):
    def construct(self):
        self.intro()
        self.numberline()
        self.solve()
        self.flip()
        self.example()
        self.graphic()
        self.summary()

    def clear(self):
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- פתיח ----------
    def intro(self):
        title = T("אי־שוויונות", 72, font=TITLE)
        with self.voice("עד עכשיו פתרנו משוואות, עם סימן שווה. היום נלמד על אי שוויונות: "
                        "גדול מ, קטן מ, ומה שמיוחד בהם.") as d:
            self.play(Write(title), run_time=2)
            self.wait(max(d - 3, 0.3))
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
        self.title = title
        story = VGroup(
            R("לשחקן יש כבר", "8", "נקודות", size=40),
            R("כל סל שווה", "2", "נקודות", size=40),
            R("הוא רוצה", "יותר מ־", "20", "נקודות", size=40),
        ).arrange(DOWN, buff=0.35, aligned_edge=RIGHT).to_edge(RIGHT, buff=1).shift(UP * 1)
        story[2][1].set_color(YELLOW)
        with self.voice("שחקן כבר קלע שמונה נקודות במשחק. כל סל שווה שתי נקודות, "
                        "והוא רוצה לסיים עם יותר מעשרים נקודות. כמה סלים הוא צריך לקלוע?") as d:
            for r in story:
                self.play(FadeIn(r, shift=UP * 0.2), run_time=0.9)
                self.wait(max(d / 3 - 1, 0.2))
        ineq = F(f"8 + 2<i>x</i> {GT} 20", 64, YELLOW).shift(DOWN * 1)
        lab = R("<i>x</i>", "= מספר הסלים", size=30, color=GREY_A).next_to(ineq, DOWN, buff=0.35)
        with self.voice("נסמן באיקס את מספר הסלים. שמונה ועוד שתיים איקס, גדול מעשרים. "
                        "זה אי שוויון. במקום סימן שווה יש סימן גדול מ.") as d:
            self.play(Write(ineq), FadeIn(lab), run_time=2)
            self.play(Indicate(ineq[4], color=ORANGE, scale_factor=1.8), run_time=1.2)  # הסימן >
        tests = VGroup(
            R("6", "סלים:", "8 + 12 = 20", "לא יותר מ־", "20", size=38, color=NEG),
            R("7", "סלים:", "8 + 14 = 22", "✔", size=38, color=SOL),
            R("10", "סלים:", "8 + 20 = 28", "✔", size=38, color=SOL),
        ).arrange(DOWN, buff=0.35, aligned_edge=RIGHT).next_to(lab.copy().shift(UP * 3), DOWN, buff=0.7)
        with self.voice("בוא ננסה. שישה סלים: שמונה ועוד שתים עשרה, בדיוק עשרים. זה לא יותר מעשרים. "
                        "שבעה סלים: עשרים ושתיים, מצוין. עשרה סלים: עשרים ושמונה, גם טוב. "
                        "יש הרבה פתרונות! כל מספר שגדול משש.") as d:
            self.play(FadeOut(story), VGroup(ineq, lab).animate.shift(UP * 3), run_time=1)
            for t in tests:
                self.play(FadeIn(t, shift=UP * 0.2), run_time=0.9)
                self.wait(max(d / 4 - 1, 0.3))
        self.clear()

    # ---------- ציר המספרים ----------
    def numberline(self):
        nl = NumLine(-1, 12, width=11.5).shift(UP * 0.2)
        r = nl.ray(6, True, False)
        ans = F(f"<i>x</i> {GT} 6", 64, SOL).shift(UP * 2)
        with self.voice("את הפתרון כותבים כך: איקס גדול משש. "
                        "ומציירים אותו על ציר המספרים: חץ ימינה, לכיוון המספרים הגדולים.") as d:
            self.play(Write(ans), Create(nl), run_time=2)
            self.wait(max(d / 2 - 2, 0.3))
            self.play(GrowArrow(r[0]), FadeIn(r[1]), run_time=1.5)
        open_lab = VGroup(T("עיגול ריק", 36, SOL), R("כי", "6", "עצמו לא פתרון", size=30)).arrange(DOWN, buff=0.15).next_to(nl.n2p(6), DOWN, buff=0.9)
        with self.voice("שים לב לעיגול בשש: הוא ריק. זה אומר ששש עצמו לא פתרון. ראינו ששישה סלים נותנים בדיוק עשרים, וזה לא מספיק.") as d:
            self.play(Indicate(r[1], color=YELLOW, scale_factor=1.8), FadeIn(open_lab), run_time=1.5)
        self.play(FadeOut(VGroup(r, open_lab, ans)))
        r2 = nl.ray(6, True, True)
        ans2 = F("<i>x</i> ≥ 6", 64, SOL).shift(UP * 2)
        full_lab = VGroup(T("עיגול מלא", 36, SOL), R("כי", "6", "גם פתרון", size=30)).arrange(DOWN, buff=0.15).next_to(nl.n2p(6), DOWN, buff=0.9)
        with self.voice("אם היה כתוב גדול או שווה, אז גם שש היה פתרון, וציירנו עיגול מלא. "
                        "עיגול ריק: גדול או קטן. עיגול מלא: גדול או שווה, קטן או שווה.") as d:
            self.play(Write(ans2), GrowArrow(r2[0]), FadeIn(r2[1]), FadeIn(full_lab), run_time=2)
        self.play(FadeOut(VGroup(r2, ans2, full_lab, nl)))

    # ---------- פתרון כמו משוואה ----------
    def solve(self):
        steps = VGroup(
            F(f"8 + 2<i>x</i> {GT} 20", 56),
            F(f"2<i>x</i> {GT} 12", 56),
            F(f"<i>x</i> {GT} 6", 60, SOL),
        ).arrange(DOWN, buff=0.45).shift(UP * 0.6 + LEFT * 1)
        notes = VGroup(
            R("−8", "משני הצדדים", size=30, color=GREY_A),
            R("÷2", "משני הצדדים", size=30, color=GREY_A),
        )
        notes[0].next_to(steps[1], RIGHT, buff=0.8)
        notes[1].next_to(steps[2], RIGHT, buff=0.8)
        with self.voice("איך מגיעים לזה בלי לנחש? פותרים בדיוק כמו משוואה. "
                        "מחסירים שמונה משני הצדדים: שתיים איקס גדול משתים עשרה. "
                        "מחלקים בשתיים: איקס גדול משש.") as d:
            self.play(Write(steps[0]), run_time=1.2)
            self.wait(max(d / 3 - 1.2, 0.3))
            self.play(Write(steps[1]), FadeIn(notes[0]), run_time=1.2)
            self.wait(max(d / 3 - 1.2, 0.3))
            self.play(Write(steps[2]), FadeIn(notes[1]), run_time=1.2)
        rule = T("מותר להוסיף, להחסיר, ולכפול או לחלק במספר חיובי", 36, YELLOW).to_edge(DOWN, buff=1)
        with self.voice("מותר להוסיף ולהחסיר, ומותר לכפול ולחלק במספר חיובי. הסימן נשאר אותו דבר. "
                        "אבל יש מלכודת אחת גדולה.") as d:
            self.play(FadeIn(rule, shift=UP * 0.2), run_time=1)
        self.clear()

    # ---------- למה הופכים ----------
    def flip(self):
        head = T("המלכודת: כפל במספר שלילי", 48, RED_B).shift(UP * 2.4)
        nl = NumLine(-6, 6, width=12).shift(DOWN * 0.4)
        a, b = Dot(nl.n2p(2), color=BLUE_C, radius=0.14).set_z_index(3), Dot(nl.n2p(5), color=ORANGE, radius=0.14).set_z_index(3)
        la, lb = F("2", 34, BLUE_C).next_to(a, UP, buff=0.25), F("5", 34, ORANGE).next_to(b, UP, buff=0.25)
        top = F(f"2 {LT} 5", 60).shift(UP * 1.3)
        with self.voice("תסתכל על שני מספרים: שתיים וחמש. שתיים קטן מחמש. נכון? על ציר המספרים, שתיים משמאל לחמש.") as d:
            self.play(FadeIn(head), Create(nl), run_time=1.5)
            self.play(FadeIn(a), FadeIn(b), FadeIn(la), FadeIn(lb), Write(top), run_time=1.5)
        a2, b2 = nl.n2p(-2), nl.n2p(-5)
        la2, lb2 = F("−2", 34, BLUE_C).next_to(a2, UP, buff=0.25), F("−5", 34, ORANGE).next_to(b2, UP, buff=0.25)
        mid = F("· (−1)", 40, YELLOW).next_to(top, RIGHT, buff=0.6)
        with self.voice("עכשיו נכפול את שניהם במינוס אחת. שתיים הופך למינוס שתיים, וחמש הופך למינוס חמש. "
                        "כל מספר קופץ לצד השני של האפס, כמו במראה.") as d:
            self.play(FadeIn(mid), run_time=0.8)
            self.play(a.animate(path_arc=PI / 2).move_to(a2), b.animate(path_arc=PI / 2).move_to(b2),
                      Transform(la, la2), Transform(lb, lb2), run_time=2.5)
        bottom = F(f"−2 {GT} −5", 60, YELLOW).move_to(top)
        with self.voice("ועכשיו מי גדול? מינוס שתיים נמצא מימין למינוס חמש, אז מינוס שתיים גדול ממינוס חמש. "
                        "הסדר התהפך! לכן גם הסימן צריך להתהפך.") as d:
            self.play(FadeOut(mid), Transform(top, bottom), run_time=1.5)
            self.play(Indicate(top, color=YELLOW, scale_factor=1.2), run_time=1.2)
        rule = T("כופלים או מחלקים בשלילי ← הופכים את הסימן!", 42, YELLOW).to_edge(DOWN, buff=0.6)
        box = SurroundingRectangle(rule, color=YELLOW, buff=0.2)
        with self.voice("זה הכלל הכי חשוב ביחידה: כשכופלים או מחלקים במספר שלילי, הופכים את הסימן. "
                        "גדול נהיה קטן, וקטן נהיה גדול.") as d:
            self.play(Write(rule), Create(box), run_time=2)
        self.clear()

    # ---------- דוגמה עם הפיכה ----------
    def example(self):
        steps = VGroup(
            F(f"5 − 2<i>x</i> {GT} 11", 56),
            F(f"−2<i>x</i> {GT} 6", 56),
            F(f"<i>x</i> {LT} −3", 60, SOL),
        ).arrange(DOWN, buff=0.45).shift(UP * 1.4 + LEFT * 1.5)
        n1 = R("−5", "משני הצדדים", size=30, color=GREY_A).next_to(steps[1], RIGHT, buff=0.8)
        n2 = R("÷(−2)", "← הופכים!", size=30, color=YELLOW).next_to(steps[2], RIGHT, buff=0.8)
        with self.voice("בוא נפתור: חמש פחות שתיים איקס, גדול מאחת עשרה. מחסירים חמש: מינוס שתיים איקס גדול משש.") as d:
            self.play(Write(steps[0]), run_time=1.2)
            self.wait(max(d / 2 - 1.2, 0.3))
            self.play(Write(steps[1]), FadeIn(n1), run_time=1.2)
        flipsign = steps[2]
        with self.voice("עכשיו מחלקים במינוס שתיים. זה מספר שלילי, אז הופכים את הסימן! "
                        "איקס קטן ממינוס שלוש.") as d:
            self.play(FadeIn(n2), run_time=0.8)
            self.wait(max(d / 2 - 1, 0.3))
            self.play(Write(flipsign), run_time=1.2)
            self.play(Indicate(flipsign, color=YELLOW), run_time=1)
        nl = NumLine(-8, 3, width=10).shift(DOWN * 1.5)
        r = nl.ray(-3, False, False)
        chk = R("בדיקה:", "<i>x</i> = −4", "←", "5 + 8 = 13", f"13 {GT} 11 ✔", size=32, color=GREY_A).next_to(nl, DOWN, buff=0.55)
        with self.voice("על ציר המספרים: עיגול ריק במינוס שלוש, וחץ שמאלה. "
                        "ובודקים עם מספר מהפתרון, למשל מינוס ארבע: חמש ועוד שמונה, שלוש עשרה. שלוש עשרה גדול מאחת עשרה. נכון!") as d:
            self.play(Create(nl), run_time=1)
            self.play(GrowArrow(r[0]), FadeIn(r[1]), run_time=1.5)
            self.wait(max(d / 2 - 2.5, 0.3))
            self.play(FadeIn(chk), run_time=1)
        wrong = R("שכחת להפוך?", f"<i>x</i> {GT} −3", "←", "<i>x</i> = 0", "לא עובד:", f"5 {GT} 11 ✘", size=30, color=RED_B).next_to(chk, DOWN, buff=0.3)
        with self.voice("ומה אם שוכחים להפוך? היינו חושבים שאפס הוא פתרון. אבל חמש פחות אפס זה חמש, וחמש לא גדול מאחת עשרה. "
                        "הבדיקה תמיד תגלה את הטעות.") as d:
            self.play(FadeIn(wrong), run_time=1.2)
        self.clear()

    # ---------- פתרון גרפי ----------
    def graphic(self):
        unit = 0.45
        ax = Axes(x_range=[-4, 7, 1], y_range=[-8, 6, 1], x_length=11 * unit, y_length=14 * unit, tips=False,
                  axis_config={"color": GREY_B, "stroke_width": 3})
        grid = NumberPlane(x_range=[-4, 7, 1], y_range=[-8, 6, 1], x_length=11 * unit, y_length=14 * unit,
                           background_line_style={"stroke_color": GREY_D, "stroke_opacity": 0.6, "stroke_width": 1})
        grid.axes.set_opacity(0)
        labs = VGroup(*[F(num(x), 20, GREY_B).next_to(ax.c2p(x, 0), DOWN, buff=0.1) for x in range(-4, 8, 2) if x],
                      *[F(num(y), 20, GREY_B).next_to(ax.c2p(0, y), LEFT, buff=0.1) for y in range(-8, 7, 2) if y])
        pl = VGroup(grid.move_to(ax), ax, labs).to_edge(LEFT, buff=0.7).shift(DOWN * 0.45)
        line = ax.plot(lambda x: 2 * x - 6, x_range=[-1, 6], color=WHITE, stroke_width=5)
        eq = F("<i>y</i> = 2<i>x</i> − 6", 52).move_to(RC + UP * 2)
        with self.voice("אפשר לפתור אי שוויון גם בעזרת גרף. הנה הישר וואי שווה שתיים איקס פחות שש. "
                        "מתי הוא חיובי, כלומר וואי גדול מאפס?") as d:
            self.play(FadeIn(pl), Create(line), Write(eq), run_time=2)
        above = ax.plot(lambda x: 2 * x - 6, x_range=[3, 6], color=SOL, stroke_width=8)
        below = ax.plot(lambda x: 2 * x - 6, x_range=[-1, 3], color=NEG, stroke_width=8)
        z = Dot(ax.c2p(3, 0), color=YELLOW, radius=0.12).set_z_index(4)
        pos_axis = Line(ax.c2p(3, 0), ax.c2p(7, 0), color=SOL, stroke_width=10)
        neg_axis = Line(ax.c2p(-4, 0), ax.c2p(3, 0), color=NEG, stroke_width=10)
        p_txt = R("חיובית", "(מעל הציר):", f"<i>x</i> {GT} 3", size=34, color=SOL).next_to(eq, DOWN, buff=0.6)
        n_txt = R("שלילית", "(מתחת לציר):", f"<i>x</i> {LT} 3", size=34, color=NEG).next_to(p_txt, DOWN, buff=0.3)
        with self.voice("הפונקציה חיובית איפה שהגרף מעל ציר האיקס. זה קורה מימין לשלוש: איקס גדול משלוש.") as d:
            self.play(FadeIn(z, scale=2), Create(above), run_time=1.5)
            self.play(Create(pos_axis), FadeIn(p_txt), run_time=1.5)
        with self.voice("והיא שלילית איפה שהגרף מתחת לציר: משמאל לשלוש, איקס קטן משלוש. "
                        "שלוש היא נקודת החיתוך עם ציר האיקס, והיא הגבול בין שני התחומים.") as d:
            self.play(Create(below), Create(neg_axis), FadeIn(n_txt), run_time=2)
            self.wait(max(d / 2 - 2, 0.3))
            self.play(Flash(z, color=YELLOW), Indicate(z, scale_factor=1.6), run_time=1.2)
        names = VGroup(T("תחום החיוביות", 32, SOL), T("תחום השליליות", 32, NEG)).arrange(DOWN, buff=0.3).next_to(n_txt, DOWN, buff=0.6)
        with self.voice("לשני התחומים האלה קוראים תחום החיוביות ותחום השליליות של הפונקציה.") as d:
            self.play(FadeIn(names, shift=UP * 0.2), run_time=1.2)
        self.clear()

    # ---------- סיכום ----------
    def summary(self):
        rows = VGroup(
            R("הפתרון הוא תחום, למשל", f"<i>x</i> {GT} 6", size=38),
            T("פותרים כמו משוואה", 38),
            T("כופלים או מחלקים בשלילי ← הופכים את הסימן!", 38, YELLOW),
            R("עיגול ריק:", f"{GT}  {LT}", "  ·  עיגול מלא:", "≥  ≤", size=38),
            R("חיובית = מעל ציר ה־", "<i>x</i>", "· שלילית = מתחת", size=38, color=SOL),
        ).arrange(DOWN, buff=0.4, aligned_edge=RIGHT).move_to(UP * 0.4)
        with self.voice("אז מה למדנו? הפתרון של אי שוויון הוא תחום של מספרים. פותרים כמו משוואה, "
                        "אבל כשכופלים או מחלקים במספר שלילי, הופכים את הסימן. על ציר המספרים: עיגול ריק לגדול או קטן, "
                        "ועיגול מלא כשיש גם שווה. ובגרף: הפונקציה חיובית מעל ציר האיקס, ושלילית מתחתיו.") as d:
            for r in rows:
                self.play(FadeIn(r, shift=UP * 0.2), run_time=0.9)
                self.wait(max(d / 5 - 1.2, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
