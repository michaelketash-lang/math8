"""סרטון: חיתוך עם הצירים ומציאת משוואת ישר (כיתה ח׳, פרקים 7–8).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_line_eq.py LineEq
"""
from common import *

X_COL, Y_COL, M_COL = GREEN_C, BLUE_C, YELLOW


def F(s, size=44, color=WHITE):
    """נוסחה/מספרים (בלי עברית), עם <i>x</i> ו־<span fgcolor=...>."""
    return MarkupText(s, font=MATH, font_size=size, color=color)


def num(v):
    return str(v).replace("-", "−")


def frac(n, d, size=40, color=WHITE):
    a, b = F(n, size, color), F(d, size, color)
    bar = Line(LEFT, RIGHT, color=color, stroke_width=3).set_width(max(a.width, b.width) + 0.15)
    return VGroup(a, bar, b).arrange(DOWN, buff=0.1)


def make_plane(xr, yr, unit=0.45, every=2):
    """מערכת צירים עם רשת ולייבלים ידניים. מחזיר (ax, group)."""
    xl, yl = (xr[1] - xr[0]) * unit, (yr[1] - yr[0]) * unit
    ax = Axes(x_range=[xr[0], xr[1], 1], y_range=[yr[0], yr[1], 1], x_length=xl, y_length=yl, tips=False,
              axis_config={"color": GREY_B, "stroke_width": 3})
    grid = NumberPlane(x_range=[xr[0], xr[1], 1], y_range=[yr[0], yr[1], 1], x_length=xl, y_length=yl,
                       background_line_style={"stroke_color": GREY_D, "stroke_opacity": 0.6, "stroke_width": 1})
    grid.axes.set_opacity(0)
    grid.move_to(ax)
    labs = VGroup()
    for x in range(xr[0], xr[1] + 1):
        if x and x % every == 0:
            labs.add(F(num(x), 20, GREY_B).next_to(ax.c2p(x, 0), DOWN, buff=0.1))
    for y in range(yr[0], yr[1] + 1):
        if y and y % every == 0:
            labs.add(F(num(y), 20, GREY_B).next_to(ax.c2p(0, y), LEFT, buff=0.1))
    labs.add(F("<i>x</i>", 28, GREY_A).next_to(ax.c2p(xr[1], 0), UP, buff=0.12))
    labs.add(F("<i>y</i>", 28, GREY_A).next_to(ax.c2p(0, yr[1]), RIGHT, buff=0.12))
    return ax, VGroup(grid, ax, labs)


RC = RIGHT * 3.7  # מרכז העמודה הימנית (טקסט)


class LineEq(Narrated):
    def construct(self):
        self.intro()
        self.intercepts()
        self.area()
        self.two_points()
        self.mistake()
        self.summary()

    def clear(self):
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- פתיח ----------
    def intro(self):
        title = T("חיתוך עם הצירים ומשוואת ישר", 60, font=TITLE)
        with self.voice("בכל ישר יש שתי נקודות מיוחדות: המקומות שבהם הוא פוגש את הצירים. "
                        "היום נלמד למצוא אותן, וגם איך מוצאים משוואה של ישר כשנותנים לנו רק שתי נקודות.") as d:
            self.play(Write(title), run_time=2.5)
            self.wait(max(d - 4, 0.5))
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
        self.title = title

        ax, pl = make_plane((-5, 6), (-8, 6))
        pl.to_edge(LEFT, buff=0.7).shift(DOWN * 0.45)
        self.ax, self.pl = ax, pl
        line = ax.plot(lambda x: 2 * x - 6, x_range=[-1, 6], color=WHITE, stroke_width=5)
        eq = F("<i>y</i> = 2<i>x</i> − 6", 56).move_to(RC + UP * 2)
        dots = VGroup(Dot(ax.c2p(0, -6), color=Y_COL, radius=0.12), Dot(ax.c2p(3, 0), color=X_COL, radius=0.12)).set_z_index(3)
        with self.voice("הנה הישר וואי שווה שתיים איקס פחות שש. "
                        "שים לב לשתי הנקודות שבהן הוא פוגש את הצירים. איך מוצאים אותן בלי לצייר?") as d:
            self.play(FadeIn(pl), run_time=1)
            self.play(Create(line), Write(eq), run_time=2)
            self.play(LaggedStart(*[AnimationGroup(FadeIn(p, scale=2), Flash(p, color=p.get_color())) for p in dots], lag_ratio=0.6), run_time=2)
        self.line, self.eq, self.dots = line, eq, dots

    # ---------- חיתוך עם הצירים ----------
    def intercepts(self):
        ax = self.ax
        samples = VGroup(*[Dot(ax.c2p(0, y), color=Y_COL, radius=0.09) for y in (4, 2, -3)])
        slabels = VGroup(*[F(f'(<span fgcolor="{YELLOW}">0</span>, {num(y)})', 26, Y_COL).next_to(ax.c2p(0, y), RIGHT if y > 0 else LEFT, buff=0.25)
                           .set_stroke(BLACK, 4, background=True) for y in (4, 2, -3)])
        head = R("על ציר ה־", "<i>y</i>", ":", size=36, color=Y_COL).move_to(RC + UP * 0.9)
        rule = R("תמיד", "<i>x</i> = 0", size=40, color=YELLOW).next_to(head, DOWN, buff=0.3)
        with self.voice("נתחיל בציר הוואי. תסתכל על כמה נקודות שנמצאות עליו: אפס פסיק ארבע, אפס פסיק שתיים, אפס פסיק מינוס שלוש. "
                        "לכולן יש משהו משותף: האיקס שלהן הוא אפס.") as d:
            self.play(LaggedStart(*[FadeIn(VGroup(p, l)) for p, l in zip(samples, slabels)], lag_ratio=0.5), run_time=3)
            self.play(FadeIn(head), run_time=0.8)
            self.wait(max(d - 6, 0.3))
            self.play(Write(rule), run_time=1.2)
        s1 = F("<i>y</i> = 2 · <span fgcolor='%s'>0</span> − 6 = −6" % YELLOW, 40).next_to(rule, DOWN, buff=0.45)
        p1 = F("(0, −6)", 44, Y_COL).next_to(s1, DOWN, buff=0.35)
        tag1 = F("(0, −6)", 28, Y_COL).next_to(self.dots[0], RIGHT, buff=0.2).set_stroke(BLACK, 4, background=True)
        with self.voice("לכן כדי למצוא את החיתוך עם ציר הוואי, מציבים איקס שווה אפס. "
                        "וואי שווה שתיים כפול אפס, פחות שש. כלומר מינוס שש. הנקודה: אפס פסיק מינוס שש.") as d:
            self.play(FadeOut(VGroup(samples, slabels)), Write(s1), run_time=2)
            self.wait(max(d / 2 - 2, 0.3))
            self.play(FadeIn(p1, shift=UP * 0.2), TransformFromCopy(p1, tag1), Flash(self.dots[0], color=Y_COL), run_time=1.5)
        self.play(FadeOut(VGroup(head, rule, s1, p1)), run_time=0.6)

        samples = VGroup(*[Dot(ax.c2p(x, 0), color=X_COL, radius=0.09) for x in (-3, 5)])
        slabels = VGroup(*[F(f'({num(x)}, <span fgcolor="{YELLOW}">0</span>)', 26, X_COL).next_to(ax.c2p(x, 0), UP, buff=0.2)
                           .set_stroke(BLACK, 4, background=True) for x in (-3, 5)])
        head = R("על ציר ה־", "<i>x</i>", ":", size=36, color=X_COL).move_to(RC + UP * 0.9)
        rule = R("תמיד", "<i>y</i> = 0", size=40, color=YELLOW).next_to(head, DOWN, buff=0.3)
        with self.voice("ועכשיו ציר האיקס. כאן לכל הנקודות יש וואי שווה אפס: "
                        "מינוס שלוש פסיק אפס, וגם חמש פסיק אפס.") as d:
            self.play(LaggedStart(*[FadeIn(VGroup(p, l)) for p, l in zip(samples, slabels)], lag_ratio=0.5), FadeIn(head), run_time=3)
            self.wait(max(d - 4.5, 0.3))
            self.play(Write(rule), run_time=1.2)
        lines = VGroup(
            F("0 = 2<i>x</i> − 6", 40),
            F("6 = 2<i>x</i>", 40),
            F("<i>x</i> = 3", 44, X_COL),
        ).arrange(DOWN, buff=0.3).next_to(rule, DOWN, buff=0.4)
        tag2 = F("(3, 0)", 28, X_COL).next_to(self.dots[1], DR, buff=0.12).set_stroke(BLACK, 4, background=True)
        with self.voice("אז מציבים וואי שווה אפס: אפס שווה שתיים איקס פחות שש. "
                        "מוסיפים שש לשני הצדדים: שש שווה שתיים איקס. מחלקים בשתיים: איקס שווה שלוש. הנקודה: שלוש פסיק אפס.") as d:
            self.play(FadeOut(VGroup(samples, slabels)), Write(lines[0]), run_time=1.5)
            self.wait(max(d / 3 - 1.5, 0.3))
            self.play(Write(lines[1]), run_time=1.2)
            self.wait(max(d / 3 - 1.2, 0.3))
            self.play(Write(lines[2]), TransformFromCopy(lines[2], tag2), Flash(self.dots[1], color=X_COL), run_time=1.5)
        self.play(FadeOut(VGroup(head, rule, lines)), run_time=0.6)

        box = VGroup(
            R("חיתוך עם ציר ה־", "<i>y</i>", "← מציבים", "<i>x</i> = 0", size=34, color=Y_COL),
            R("חיתוך עם ציר ה־", "<i>x</i>", "← מציבים", "<i>y</i> = 0", size=34, color=X_COL),
        ).arrange(DOWN, buff=0.4, aligned_edge=RIGHT).to_edge(RIGHT, buff=0.7).shift(DOWN * 0.3)
        frame = SurroundingRectangle(box, color=GREY_B, buff=0.3, corner_radius=0.15)
        with self.voice("טריק לזכור: בציר הוואי, האיקס הוא אפס. בציר האיקס, הוואי הוא אפס. "
                        "תמיד מציבים אפס במשתנה השני.") as d:
            self.play(FadeIn(box[0], shift=UP * 0.2), run_time=1)
            self.play(FadeIn(box[1], shift=UP * 0.2), Create(frame), run_time=1.2)
        self.tags = VGroup(tag1, tag2)
        self.play(FadeOut(VGroup(box, frame)), run_time=0.6)

    # ---------- שטח המשולש ----------
    def area(self):
        ax = self.ax
        tri = Polygon(ax.c2p(0, 0), ax.c2p(3, 0), ax.c2p(0, -6), color=ORANGE, fill_color=ORANGE, fill_opacity=0.35, stroke_width=0)
        q = T("מה השטח של המשולש?", 40, ORANGE).move_to(RC + UP * 1.1)
        with self.voice("שני הצירים והישר יוצרים ביחד משולש ישר זווית. כמה השטח שלו?") as d:
            self.play(FadeIn(tri), FadeIn(q), run_time=1.5)
        leg_x = Line(ax.c2p(0, 0), ax.c2p(3, 0), color=X_COL, stroke_width=9).set_z_index(2)
        leg_y = Line(ax.c2p(0, 0), ax.c2p(0, -6), color=Y_COL, stroke_width=9).set_z_index(2)
        lx = R("ניצב:", "3", size=36, color=X_COL).next_to(q, DOWN, buff=0.45)
        ly = R("ניצב:", "6", size=36, color=Y_COL).next_to(lx, DOWN, buff=0.3)
        warn = R("לא", "−6", "! אורך תמיד חיובי", size=32, color=RED_B).next_to(ly, DOWN, buff=0.3)
        with self.voice("הניצב על ציר האיקס הולך מאפס עד שלוש, אז האורך שלו שלוש. "
                        "הניצב על ציר הוואי הולך מאפס עד מינוס שש. האורך שלו שש, ולא מינוס שש! אורך תמיד חיובי.") as d:
            self.play(Create(leg_x), FadeIn(lx), run_time=1.5)
            self.wait(max(d / 2 - 2, 0.3))
            self.play(Create(leg_y), FadeIn(ly), run_time=1.5)
            self.play(FadeIn(warn, shift=UP * 0.2), run_time=1)
        calc = R("שטח", "= (3 · 6) ÷ 2 = 9", size=40, color=ORANGE).next_to(warn, DOWN, buff=0.5)
        with self.voice("שטח של משולש ישר זווית: ניצב כפול ניצב, חלקי שתיים. "
                        "שלוש כפול שש זה שמונה עשרה, חלקי שתיים: תשע יחידות שטח.") as d:
            self.play(Write(calc), run_time=2)
            self.play(Indicate(tri, color=ORANGE, scale_factor=1.05), run_time=1.2)
        self.clear()

    # ---------- משוואה משתי נקודות ----------
    def two_points(self):
        ax, pl = make_plane((-3, 6), (-2, 11), unit=0.47)
        pl.to_edge(LEFT, buff=0.8).shift(DOWN * 0.45)
        A, B = ax.c2p(1, 5), ax.c2p(3, 9)
        dA, dB = Dot(A, color=ORANGE, radius=0.12).set_z_index(3), Dot(B, color=ORANGE, radius=0.12).set_z_index(3)
        lA = F("(1, 5)", 28, ORANGE).next_to(dA, LEFT, buff=0.2).set_stroke(BLACK, 4, background=True)
        lB = F("(3, 9)", 28, ORANGE).next_to(dB, RIGHT, buff=0.2).set_stroke(BLACK, 4, background=True)
        q = R("המשוואה", "= ?", size=40).move_to(RC + UP * 2.2)
        with self.voice("עכשיו הכיוון ההפוך. נניח שאנחנו לא יודעים את המשוואה, אלא רק שתי נקודות על הישר: "
                        "אחת פסיק חמש, ושלוש פסיק תשע. איך מוצאים את המשוואה?") as d:
            self.play(FadeIn(pl), run_time=1)
            self.play(FadeIn(dA, scale=2), FadeIn(lA), run_time=1)
            self.play(FadeIn(dB, scale=2), FadeIn(lB), run_time=1)
            self.play(FadeIn(q), run_time=1)

        C = ax.c2p(3, 5)
        run = Line(A, C, color=M_COL, stroke_width=5)
        rise = Line(C, B, color=M_COL, stroke_width=5)
        tr = F("+2", 30, M_COL).next_to(run, DOWN, buff=0.12)
        tu = F("+4", 30, M_COL).next_to(rise, RIGHT, buff=0.12)
        step1 = R("שלב 1: השיפוע", size=36, color=M_COL).move_to(RC + UP * 1.2)
        m_eq = VGroup(F("<i>m</i> =", 44, M_COL), frac("4", "2", 44, M_COL), F("= 2", 44, M_COL)).arrange(RIGHT, buff=0.2).next_to(step1, DOWN, buff=0.35)
        with self.voice("שלב ראשון, השיפוע. מהנקודה הראשונה לשנייה הלכנו שתיים ימינה, ועלינו ארבע למעלה. "
                        "השיפוע הוא השינוי בוואי חלקי השינוי באיקס: ארבע חלקי שתיים, שווה שתיים.") as d:
            self.play(FadeOut(q), FadeIn(step1), run_time=0.8)
            self.play(Create(run), FadeIn(tr), run_time=1.2)
            self.play(Create(rise), FadeIn(tu), run_time=1.2)
            self.wait(max(d - 6, 0.3))
            self.play(Write(m_eq), run_time=1.5)

        formula = VGroup(F("<i>m</i> =", 40), frac("<i>y</i><sub>2</sub> − <i>y</i><sub>1</sub>", "<i>x</i><sub>2</sub> − <i>x</i><sub>1</sub>", 40),
                         F("=", 40), frac("9 − 5", "3 − 1", 40)).arrange(RIGHT, buff=0.2).next_to(m_eq, DOWN, buff=0.45)
        with self.voice("בנוסחה זה נראה כך: השיפוע שווה וואי שתיים פחות וואי אחת, חלקי איקס שתיים פחות איקס אחת. "
                        "אצלנו: תשע פחות חמש, חלקי שלוש פחות אחת. אותה תשובה: שתיים.") as d:
            self.play(FadeIn(formula[:2], shift=UP * 0.2), run_time=1.5)
            self.wait(max(d / 2 - 1.5, 0.3))
            self.play(FadeIn(formula[2:], shift=UP * 0.2), run_time=1.5)
        self.play(FadeOut(formula), run_time=0.5)

        step2 = R("שלב 2: מוצאים את", "<i>b</i>", size=36, color=BLUE_C).next_to(m_eq, DOWN, buff=0.5)
        e1 = F(f'<i>y</i> = <span fgcolor="{M_COL}">2</span><i>x</i> + <i>b</i>', 40).next_to(step2, DOWN, buff=0.3)
        e2 = F(f'<span fgcolor="{ORANGE}">5</span> = 2 · <span fgcolor="{ORANGE}">1</span> + <i>b</i>', 40).next_to(e1, DOWN, buff=0.3)
        e3 = F("<i>b</i> = 3", 44, BLUE_C).next_to(e2, DOWN, buff=0.3)
        with self.voice("שלב שני. עכשיו אנחנו יודעים: וואי שווה שתיים איקס ועוד בי. חסר רק בי. "
                        "מציבים את הנקודה אחת פסיק חמש: חמש שווה שתיים כפול אחת, ועוד בי. חמש שווה שתיים ועוד בי, אז בי שווה שלוש.") as d:
            self.play(FadeIn(step2), Write(e1), run_time=1.5)
            self.wait(max(d / 2 - 2.5, 0.3))
            self.play(Indicate(lA, color=ORANGE), Write(e2), run_time=1.8)
            self.wait(max(d / 2 - 3.5, 0.3))
            self.play(Write(e3), run_time=1.2)

        line = ax.plot(lambda x: 2 * x + 3, x_range=[-2.5, 4], color=WHITE, stroke_width=4)
        final = F("<i>y</i> = 2<i>x</i> + 3", 52, ORANGE)
        final_box = VGroup(final, SurroundingRectangle(final, color=ORANGE, buff=0.18)).next_to(step2, DOWN, buff=0.5)
        with self.voice("המשוואה: וואי שווה שתיים איקס ועוד שלוש. "
                        "ובודקים עם הנקודה השנייה: שתיים כפול שלוש ועוד שלוש, זה תשע. בדיוק! הישר עובר בשתי הנקודות.") as d:
            self.play(FadeOut(VGroup(e1, e2, e3)), run_time=0.6)
            self.play(Write(final_box), run_time=1.5)
            self.play(Create(line), run_time=2)
            self.play(Indicate(lB, color=ORANGE), run_time=1.2)
        self.clear()

    # ---------- טעות נפוצה ----------
    def mistake(self):
        head = T("טעות נפוצה: לערבב את הסדר", 46, RED_B).shift(UP * 2)
        pts = F("(1, 5)    (3, 9)", 44, ORANGE).next_to(head, DOWN, buff=0.5)
        wrong = VGroup(frac("9 − 5", "1 − 3", 48), F("= −2", 48)).arrange(RIGHT, buff=0.25)
        right = VGroup(frac("9 − 5", "3 − 1", 48), F("= 2", 48)).arrange(RIGHT, buff=0.25)
        VGroup(right, wrong).arrange(LEFT, buff=2.2).next_to(pts, DOWN, buff=0.7)
        cross = Cross(wrong, stroke_color=RED, stroke_width=6)
        check = T("נכון", 36, GREEN).next_to(right, DOWN, buff=0.4)
        bad = T("לא נכון", 36, RED).next_to(wrong, DOWN, buff=0.4)
        rule = T("מי שמתחיל למעלה — מתחיל גם למטה", 40, YELLOW).to_edge(DOWN, buff=0.7)
        with self.voice("טעות נפוצה: לערבב את הסדר. למעלה עשינו תשע פחות חמש, כלומר התחלנו מהנקודה השנייה. "
                        "אם למטה נעשה אחת פחות שלוש, נקבל מינוס שתיים. וזה לא נכון! הישר עולה, השיפוע חיובי.") as d:
            self.play(FadeIn(head), FadeIn(pts), run_time=1.2)
            self.play(Write(wrong), run_time=1.5)
            self.wait(max(d - 6, 0.3))
            self.play(Create(cross), FadeIn(bad), run_time=1)
        with self.voice("הכלל: הנקודה שמתחילים ממנה למעלה, מתחילים ממנה גם למטה. שלוש פחות אחת, והשיפוע הוא שתיים.") as d:
            self.play(Write(right), FadeIn(check), run_time=1.5)
            self.play(FadeIn(rule, shift=UP * 0.2), run_time=1)
        self.clear()

    # ---------- סיכום ----------
    def summary(self):
        rows = VGroup(
            R("חיתוך עם ציר ה־", "<i>y</i>", ": מציבים", "<i>x</i> = 0", size=40, color=Y_COL),
            R("חיתוך עם ציר ה־", "<i>x</i>", ": מציבים", "<i>y</i> = 0", size=40, color=X_COL),
            VGroup(T("שיפוע משתי נקודות:", 36, M_COL),
                   VGroup(F("<i>m</i> =", 36, M_COL), frac("<i>y</i><sub>2</sub> − <i>y</i><sub>1</sub>", "<i>x</i><sub>2</sub> − <i>x</i><sub>1</sub>", 34, M_COL)).arrange(RIGHT, buff=0.15)
                   ).arrange(LEFT, buff=0.3),
            R("ואז מציבים נקודה ב־", "<i>y</i> = <i>mx</i> + <i>b</i>", "כדי למצוא את", "<i>b</i>", size=36),
            R("שטח המשולש עם הצירים", "= (ניצב · ניצב) ÷ 2", size=36, color=ORANGE),
        ).arrange(DOWN, buff=0.38, aligned_edge=RIGHT).move_to(UP * 0.3)
        with self.voice("אז מה למדנו? חיתוך עם ציר הוואי: מציבים איקס שווה אפס. חיתוך עם ציר האיקס: מציבים וואי שווה אפס. "
                        "שיפוע משתי נקודות: השינוי בוואי חלקי השינוי באיקס. ואז מציבים נקודה כדי למצוא את בי. "
                        "ושטח המשולש עם הצירים: ניצב כפול ניצב, חלקי שתיים.") as d:
            for r in rows:
                self.play(FadeIn(r, shift=UP * 0.2), run_time=0.9)
                self.wait(max(d / 5 - 1.2, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
