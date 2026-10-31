"""סרטון: הפונקציה הקווית y = mx + b (כיתה ח׳, פרקים 5–6).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_linear.py Linear
"""
from common import *

M_COL, B_COL = YELLOW, BLUE_C


def EQ(m="m", b="b", size=56, fx=False):
    """y = mx + b, עם m בצהוב ו־b בכחול. m/b יכולים להיות מספרים."""
    lhs = "<i>f</i>(<i>x</i>)" if fx else "<i>y</i>"
    b, m = str(b), "" if str(m) == "1" else m
    bs = "" if b == "0" else f" − {b[1:]}" if b[0] in "-−" else f" + {b}"
    return MarkupText(f'{lhs} = <span fgcolor="{M_COL}">{m}</span><i>x</i><span fgcolor="{B_COL}">{bs}</span>',
                      font=MATH, font_size=size)


def axes_labels(ax, xs, ys, size=24):
    g = VGroup()
    for x in xs:
        g.add(T(str(x), size, GREY_B).next_to(ax.c2p(x, ax.y_range[0]), DOWN, buff=0.15))
    for y in ys:
        g.add(T(str(y), size, GREY_B).next_to(ax.c2p(ax.x_range[0], y), LEFT, buff=0.15))
    return g


class Linear(Narrated):
    def construct(self):
        self.story()
        self.slope()
        self.intercept()
        self.fx()
        self.summary()

    # ---------- סיפור: נקודות במשחק ----------
    def story(self):
        title = T("הפונקציה הקווית", 64, font=TITLE)
        with self.voice("בוא נדמיין משחק כדורסל. בתחילת הרבע הקבוצה שלך כבר מובילה עם עשר נקודות, "
                        "ומכאן היא קולעת שתי נקודות בכל דקה.") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
        self.title = title

        xs = [0, 1, 2, 3]
        cells = VGroup()
        hx, hy = T("דקות", 32, GREY_B), T("נקודות", 32, GREY_B)
        row_x = VGroup(*[T(str(x), 36) for x in xs])
        row_y = VGroup(*[T(str(2 * x + 10), 36, ORANGE) for x in xs])
        grid = VGroup()
        for i in range(4):
            grid.add(VGroup(row_x[i], row_y[i]).arrange(DOWN, buff=0.45))
        grid.arrange(LEFT, buff=0.7)  # RTL: הערך הראשון מימין
        heads = VGroup(hx, hy).arrange(DOWN, buff=0.45).next_to(grid, RIGHT, buff=0.6)
        table = VGroup(heads, grid).to_edge(RIGHT, buff=0.6).shift(UP * 0.5)
        frame = SurroundingRectangle(table, buff=0.25, color=GREY_D, corner_radius=0.1)
        with self.voice("נרשום בטבלה. אחרי אפס דקות: עשר נקודות. אחרי דקה: שתים עשרה. "
                        "אחרי שתי דקות: ארבע עשרה. ואחרי שלוש: שש עשרה.") as d:
            self.play(FadeIn(heads), Create(frame), run_time=1)
            for i in range(4):
                self.play(FadeIn(grid[i], shift=LEFT * 0.2), run_time=0.6)
                self.wait(max(d / 4 - 1.1, 0.2))

        ax = Axes(x_range=[0, 7, 1], y_range=[0, 26, 2], x_length=6, y_length=4.8, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=0.9).shift(DOWN * 0.5)
        labels = axes_labels(ax, range(0, 7), range(0, 27, 4), 22)
        dots = VGroup(*[Dot(ax.c2p(x, 2 * x + 10), color=ORANGE, radius=0.09) for x in xs])
        line = ax.plot(lambda x: 2 * x + 10, x_range=[0, 7], color=WHITE, stroke_width=4)
        with self.voice("עכשיו נשים כל זוג מספרים כנקודה במערכת הצירים. "
                        "שים לב מה קורה: כל הנקודות נמצאות על קו ישר אחד!") as d:
            self.play(Create(ax), FadeIn(labels), run_time=1.5)
            for i in range(4):
                self.play(TransformFromCopy(grid[i], dots[i]), run_time=0.7)
            self.play(Create(line), run_time=1.5)

        eq = EQ(2, 10).next_to(frame, DOWN, buff=0.7)
        with self.voice("פונקציה שהגרף שלה הוא קו ישר נקראת פונקציה קווית. "
                        "ואפשר לכתוב אותה בנוסחה אחת: וואי שווה שתיים איקס, ועוד עשר.") as d:
            self.play(Indicate(line, color=YELLOW), run_time=1.5)
            self.play(Write(eq), run_time=2)

        # שיפוע: משולשים של +1 ימינה, +2 למעלה
        steps = VGroup()
        for x in xs[:3]:
            p0, p1, p2 = ax.c2p(x, 2 * x + 10), ax.c2p(x + 1, 2 * x + 10), ax.c2p(x + 1, 2 * x + 12)
            steps.add(VGroup(Line(p0, p1, color=M_COL, stroke_width=4), Line(p1, p2, color=M_COL, stroke_width=4)))
        m_tag = R("שיפוע:", "+2", "בכל צעד ימינה", size=30, color=M_COL).next_to(eq, DOWN, buff=0.4)
        with self.voice("המספר שליד האיקס, שתיים, הוא השיפוע. הוא אומר בכמה וואי גדל בכל צעד אחד ימינה. "
                        "אצלנו: שתי נקודות בכל דקה.") as d:
            self.play(Indicate(eq[2], color=M_COL, scale_factor=1.5), run_time=1.2)  # glyphs: y = 2 x + 1 0
            self.play(LaggedStart(*[Create(s) for s in steps], lag_ratio=0.5), FadeIn(m_tag), run_time=2.5)

        b_dot = Dot(ax.c2p(0, 10), color=B_COL, radius=0.13)
        b_tag = R("נקודת ההתחלה:", "(0, 10)", size=30, color=B_COL).next_to(m_tag, DOWN, buff=0.3)
        with self.voice("והמספר הבודד, עשר, הוא נקודת ההתחלה. זה המקום שבו הקו חותך את ציר הוואי.") as d:
            self.play(Indicate(eq[-3:], color=B_COL, scale_factor=1.4), run_time=1.2)
            self.play(FadeIn(b_dot, scale=2), Flash(b_dot, color=B_COL), FadeIn(b_tag), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    def grid_axes(self):
        ax = Axes(x_range=[-5, 5, 1], y_range=[-5, 5, 1], x_length=6.2, y_length=6.2, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=0.8).shift(DOWN * 0.3)
        plane = NumberPlane(x_range=[-5, 5], y_range=[-5, 5], x_length=6.2, y_length=6.2,
                            background_line_style={"stroke_color": GREY_D, "stroke_opacity": 0.5}).move_to(ax)
        plane.axes.set_opacity(0)
        return ax, plane

    # ---------- שיפוע ----------
    def slope(self):
        ax, plane = self.grid_axes()
        m, b = ValueTracker(1), 0
        line = always_redraw(lambda: ax.plot(lambda x: m.get_value() * x + b, x_range=[-5, 5],
                                             color=WHITE, stroke_width=4).set_z_index(1))
        mval = always_redraw(lambda: T(f"m = {U(m.get_value())}", 44, M_COL, font=MATH).to_edge(RIGHT, buff=1.2).shift(UP * 1.5))
        with self.voice("בוא נשחק עם השיפוע. כשהשיפוע גדול, הקו תלול. כשהוא קטן, הקו מתון. "
                        "וכשהוא שלילי, הקו יורד.") as d:
            self.play(FadeIn(plane), Create(ax), Create(line), FadeIn(mval), run_time=1.5)
            for target in (3, 0.5, -2):
                self.play(m.animate.set_value(target), run_time=1.6)
                self.wait(0.6)

        walker = Dot(color=ORANGE, radius=0.14).set_z_index(2)
        t = ValueTracker(-3)
        walker.add_updater(lambda w: w.move_to(ax.c2p(t.get_value(), m.get_value() * t.get_value() + b)))
        mood = always_redraw(lambda: T(
            "עולה ↗" if m.get_value() > 0.01 else "יורדת ↘" if m.get_value() < -0.01 else "קבועה →",
            44, ORANGE).next_to(mval, DOWN, buff=0.6))
        with self.voice("דמיין איש קטן שהולך על הקו, תמיד ימינה. אם הוא מטפס, הפונקציה עולה. "
                        "אם הוא יורד במדרון, הפונקציה יורדת. ואם השיפוע אפס, הוא הולך על משטח ישר, "
                        "והפונקציה קבועה.") as d:
            self.play(m.animate.set_value(1.5), FadeIn(walker), FadeIn(mood), run_time=1)
            self.play(t.animate.set_value(3), run_time=2.5, rate_func=linear)
            t.set_value(-3)
            self.play(m.animate.set_value(-1.5), run_time=1)
            self.play(t.animate.set_value(3), run_time=2.5, rate_func=linear)
            t.set_value(-3)
            self.play(m.animate.set_value(0), run_time=1)
            self.play(t.animate.set_value(3), run_time=2.5, rate_func=linear)
        walker.clear_updaters()
        self.play(FadeOut(VGroup(walker, mood, mval, line, ax, plane)))

    # ---------- b: הזזה למעלה ולמטה ----------
    def intercept(self):
        ax, plane = self.grid_axes()
        bt = ValueTracker(0)
        m = 1
        line = always_redraw(lambda: ax.plot(lambda x: m * x + bt.get_value(), x_range=[-5, 5],
                                             color=WHITE, stroke_width=4))
        ghost = ax.plot(lambda x: m * x, x_range=[-5, 5], color=GREY_B, stroke_width=2, stroke_opacity=0.5)
        dot = always_redraw(lambda: Dot(ax.c2p(0, bt.get_value()), color=B_COL, radius=0.13).set_z_index(2))
        lab = always_redraw(lambda: T(f"(0, {U(bt.get_value())})", 34, B_COL, font=MATH).next_to(dot, LEFT, buff=0.2))
        eq = always_redraw(lambda: EQ(1, U(bt.get_value()), 50).to_edge(RIGHT, buff=1).shift(UP * 1.5))
        note = T("השיפוע לא משתנה!", 36, M_COL).to_edge(RIGHT, buff=1.2).shift(DOWN * 0.3)
        with self.voice("ועכשיו נשנה את בי. שים לב: הקו לא משנה את הכיוון שלו, הוא רק זז למעלה ולמטה. "
                        "הנקודה שבה הוא חותך את ציר הוואי היא תמיד אפס פסיק בי.") as d:
            self.play(FadeIn(plane), Create(ax), Create(ghost), Create(line), FadeIn(dot), FadeIn(lab), FadeIn(eq), run_time=1.5)
            self.play(bt.animate.set_value(3), run_time=2)
            self.play(FadeIn(note), run_time=0.8)
            self.play(bt.animate.set_value(-2), run_time=2.5)
            self.play(bt.animate.set_value(1), run_time=1.5)
        self.play(FadeOut(VGroup(line, ghost, dot, lab, eq, note, ax, plane)))

    # ---------- f(x) ----------
    def fx(self):
        f = EQ(2, 10, 60, fx=True).shift(UP * 2)
        q = MarkupText("<i>f</i>(3) = ?", font=MATH, font_size=56).next_to(f, DOWN, buff=0.8)
        with self.voice("יש עוד דרך לכתוב פונקציה: אֶף של איקס. "
                        "אֶף של שלוש אומר: מה יוצא כשמציבים שלוש במקום איקס?") as d:
            self.play(Write(f), run_time=2)
            self.play(FadeIn(q, shift=UP * 0.3), run_time=1)

        s1 = MarkupText(f'<i>f</i>(3) = <span fgcolor="{M_COL}">2</span> · <span fgcolor="{ORANGE}">3</span> + <span fgcolor="{B_COL}">10</span>',
                        font=MATH, font_size=52).next_to(f, DOWN, buff=0.8)
        s2 = MarkupText("= 6 + 10 = 16", font=MATH, font_size=52).next_to(s1, DOWN, buff=0.4)
        pt = R("הנקודה", "(3, 16)", "על הגרף", size=40, color=ORANGE).next_to(s2, DOWN, buff=0.6)
        with self.voice("מציבים: שתיים כפול שלוש, ועוד עשר. שש ועוד עשר, שש עשרה. "
                        "אז הנקודה שלוש, שש עשרה, נמצאת על הגרף.") as d:
            self.play(ReplacementTransform(q, s1), run_time=1.5)
            self.play(Write(s2), run_time=1.5)
            self.play(FadeIn(pt, shift=UP * 0.2), run_time=1)
        self.play(FadeOut(VGroup(s1, s2, pt)))

        q2 = MarkupText("<i>f</i>(<i>x</i>) = 20  →  <i>x</i> = ?", font=MATH, font_size=52).next_to(f, DOWN, buff=0.8)
        e1 = MarkupText("2<i>x</i> + 10 = 20", font=MATH, font_size=52).next_to(q2, DOWN, buff=0.5)
        with self.voice("ומה אם שואלים הפוך: מתי אֶף של איקס שווה עשרים? עכשיו אנחנו יודעים את התוצאה, "
                        "ומחפשים את האיקס. כותבים משוואה: שתיים איקס ועוד עשר, שווה עשרים.") as d:
            self.play(FadeIn(q2, shift=UP * 0.3), run_time=1)
            self.wait(max(d - 3.5, 0.5))
            self.play(Write(e1), run_time=1.5)
        e2 = MarkupText("2<i>x</i> = 10", font=MATH, font_size=52).next_to(e1, DOWN, buff=0.35)
        e3 = MarkupText("<i>x</i> = 5", font=MATH, font_size=56, color=ORANGE).next_to(e2, DOWN, buff=0.35)
        side1 = R("−10", "משני האגפים", size=28, color=GREY_B).next_to(e2, RIGHT, buff=0.6)
        side2 = R("÷2", "משני האגפים", size=28, color=GREY_B).next_to(e3, RIGHT, buff=0.6)
        box = SurroundingRectangle(e3, color=ORANGE, buff=0.15)
        with self.voice("מחסירים עשר: שתיים איקס שווה עשר. מחלקים בשתיים: איקס שווה חמש. "
                        "אחרי חמש דקות יהיו לקבוצה עשרים נקודות.") as d:
            self.play(Write(e2), FadeIn(side1), run_time=1.5)
            self.play(Write(e3), FadeIn(side2), run_time=1.5)
            self.play(Create(box), run_time=0.8)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- סיכום ----------
    def summary(self):
        eq = EQ(size=72).shift(UP * 1.6)
        m_line = R("<i>m</i> =", "השיפוע: בכמה עולים בכל צעד ימינה", size=36, color=M_COL).next_to(eq, DOWN, buff=0.7)
        b_line = R("<i>b</i> =", "החיתוך עם ציר ה־", "<i>y</i>", ", בנקודה", "(0, <i>b</i>)", size=36, color=B_COL).next_to(m_line, DOWN, buff=0.35)
        f_line = R("<i>f</i>(3) =", "מציבים", "3", "במקום", "<i>x</i>", "ומחשבים", size=36).next_to(b_line, DOWN, buff=0.35)
        with self.voice("אז מה למדנו? פונקציה קווית היא וואי שווה אֶם איקס ועוד בי. "
                        "אֶם הוא השיפוע: בכמה עולים בכל צעד ימינה. בי הוא נקודת החיתוך עם ציר הוואי. "
                        "ואֶף של מספר: פשוט מציבים ומחשבים.") as d:
            self.play(Write(eq), run_time=1.5)
            for ln in (m_line, b_line, f_line):
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 3 - 1.6, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.6)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])


def U(v):
    """מספר לתצוגה: 1.0→'1', 0.5→'0.5', מינוס אמיתי."""
    v = round(v * 2) / 2
    s = f"{v:g}"
    return s.replace("-", "−")
