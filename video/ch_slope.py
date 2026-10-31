"""סרטון: שיפוע ויחס ישר, y = mx (כיתה ח׳, פרק 4).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_slope.py Slope
"""
from common import *

add_pron({"תלול": "תָּלוּל", "המנה": "הַמָּנָה"})

RUN_C, RISE_C, M_COL = GREEN_C, RED_C, YELLOW


def F(s, size=44, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def axes_labels(ax, xs, ys, size=24):
    g = VGroup()
    for x in xs:
        g.add(T(str(x).replace("-", "−"), size, GREY_B).next_to(ax.c2p(x, ax.y_range[0]), DOWN, buff=0.15))
    for y in ys:
        g.add(T(str(y).replace("-", "−"), size, GREY_B).next_to(ax.c2p(ax.x_range[0], y), LEFT, buff=0.15))
    return g


def num(v):
    """מספר לתצוגה: 1.0→'1', 0.5→'0.5', מינוס אמיתי."""
    return f"{round(v * 2) / 2:g}".replace("-", "−")


def coef(v):
    """מקדם לפני x: 1 → '', −1 → '−'."""
    s = num(v)
    return {"1": "", "−1": "−"}.get(s, s)


def triangle(ax, p, q):
    """משולש שיפוע מ־p ל־q: קטע ימינה (ירוק) וקטע למעלה/למטה (אדום)."""
    c = (q[0], p[1])
    return VGroup(DashedLine(ax.c2p(*p), ax.c2p(*c), color=RUN_C, stroke_width=5),
                  DashedLine(ax.c2p(*c), ax.c2p(*q), color=RISE_C, stroke_width=5))


class Slope(Narrated):
    def construct(self):
        self.story()
        self.two_points()
        self.ymx()
        self.proportion()
        self.summary()

    # ---------- מה תלול יותר? ----------
    def story(self):
        title = T("שיפוע ויחס ישר", 68, font=TITLE)
        ax = Axes(x_range=[0, 6, 1], y_range=[0, 6, 1], x_length=5.4, y_length=5.4, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=1).shift(DOWN * 0.4)
        a = ax.plot(lambda x: 2 * x, x_range=[0, 3], color=ORANGE, stroke_width=5)
        b = ax.plot(lambda x: 0.5 * x, x_range=[0, 6], color=BLUE_C, stroke_width=5)
        with self.voice("דמיין שאתה רץ בעלייה באימון. יש עלייה מתונה, ויש עלייה תלולה שמורידה לך את הנשימה. "
                        "במתמטיקה, את התלילות הזאת מודדים במספר אחד: השיפוע.") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
            self.play(Create(ax), run_time=1)
            self.play(Create(b), run_time=1.5)
            self.play(Create(a), run_time=1.5)
        self.title = title
        sa = VGroup(*[triangle(ax, (i, 2 * i), (i + 1, 2 * i + 2)) for i in range(2)])
        sb = VGroup(*[triangle(ax, (2 * i, i), (2 * i + 2, i + 1)) for i in range(2)])
        la = R("כתום: צעד ימינה,", "2", "למעלה", size=34, color=ORANGE).to_edge(RIGHT, buff=0.8).shift(UP * 1.2)
        lb = R("כחול: צעד ימינה,", "½", "למעלה", size=34, color=BLUE_C).next_to(la, DOWN, buff=0.5).align_to(la, RIGHT)
        with self.voice("הנה שתי עליות. בכתומה, על כל צעד ימינה עולים שתיים. בכחולה, על כל צעד ימינה עולים רק חצי. "
                        "הכתומה תלולה יותר, כי השיפוע שלה גדול יותר.") as d:
            self.play(LaggedStart(*[Create(t) for t in sa], lag_ratio=0.5), FadeIn(la), run_time=2.5)
            self.wait(1)
            self.play(LaggedStart(*[Create(t) for t in sb], lag_ratio=0.5), FadeIn(lb), run_time=2.5)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- שיפוע משתי נקודות ----------
    def two_points(self):
        ax = Axes(x_range=[0, 6, 1], y_range=[0, 10, 1], x_length=5, y_length=5.6, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=1).shift(DOWN * 0.4)
        plane = NumberPlane(x_range=[0, 6], y_range=[0, 10], x_length=5, y_length=5.6,
                            background_line_style={"stroke_color": GREY_D, "stroke_opacity": 0.5}).move_to(ax)
        plane.axes.set_opacity(0)
        labs = axes_labels(ax, range(0, 7), range(0, 11, 2), 20)
        A, B = (1, 2), (3, 8)
        line = ax.plot(lambda x: 3 * x - 1, x_range=[1 / 3, 11 / 3], color=WHITE, stroke_width=4)
        dA, dB = Dot(ax.c2p(*A), color=ORANGE, radius=0.1), Dot(ax.c2p(*B), color=ORANGE, radius=0.1)
        tA = F("(1, 2)", 28, ORANGE).next_to(dA, DR, buff=0.1)
        tB = F("(3, 8)", 28, ORANGE).next_to(dB, LEFT, buff=0.15)
        with self.voice("איך מחשבים שיפוע? לוקחים שתי נקודות על הקו. למשל, אחת פסיק שתיים, ושלוש פסיק שמונה.") as d:
            self.play(FadeIn(plane), Create(ax), FadeIn(labs), run_time=1.2)
            self.play(Create(line), run_time=1)
            self.play(FadeIn(dA, scale=2), FadeIn(dB, scale=2), Write(tA), Write(tB), run_time=1.2)
        tri = triangle(ax, A, B)
        run_l = R("ימינה:", "3 − 1 = 2", size=34, color=RUN_C).to_edge(RIGHT, buff=0.8).shift(UP * 1.6)
        rise_l = R("למעלה:", "8 − 2 = 6", size=34, color=RISE_C).next_to(run_l, DOWN, buff=0.4).align_to(run_l, RIGHT)
        with self.voice("מהנקודה הראשונה לשנייה: הולכים ימינה מאחת לשלוש, כלומר שתיים. "
                        "ועולים משתיים לשמונה, כלומר שש.") as d:
            self.play(Create(tri[0]), FadeIn(run_l), run_time=1.5)
            self.wait(max(d / 2 - 1.5, 0.5))
            self.play(Create(tri[1]), FadeIn(rise_l), run_time=1.5)
        res = R("שיפוע =", "6 ÷ 2 = 3", size=42, color=M_COL).next_to(rise_l, DOWN, buff=0.6).align_to(run_l, RIGHT)
        sub = T("למעלה ÷ ימינה", 30, GREY_B).next_to(res, DOWN, buff=0.25).align_to(run_l, RIGHT)
        with self.voice("השיפוע הוא כמה עלינו, חלקי כמה הלכנו ימינה: שש חלקי שתיים, שלוש. "
                        "כלומר על כל צעד ימינה, הקו עולה שלוש.") as d:
            self.play(Write(res), FadeIn(sub), run_time=1.5)
            self.play(Indicate(res, color=M_COL), run_time=1.2)
        self.play(FadeOut(VGroup(line, dA, dB, tA, tB, tri, run_l, rise_l, res, sub)))

        C, D = (2, 8), (4, 4)
        line2 = ax.plot(lambda x: -2 * x + 12, x_range=[1, 6], color=WHITE, stroke_width=4)
        dC, dD = Dot(ax.c2p(*C), color=ORANGE, radius=0.1), Dot(ax.c2p(*D), color=ORANGE, radius=0.1)
        tri2 = triangle(ax, C, D)
        r1 = R("ימינה:", "2", size=34, color=RUN_C).to_edge(RIGHT, buff=0.8).shift(UP * 1.6)
        r2 = R("למטה:", "4", "←", "שינוי של", "−4", size=34, color=RISE_C).next_to(r1, DOWN, buff=0.4).align_to(r1, RIGHT)
        r3 = R("שיפוע =", "−4 ÷ 2 = −2", size=42, color=M_COL).next_to(r2, DOWN, buff=0.6).align_to(r1, RIGHT)
        with self.voice("ומה אם הקו יורד? כאן הולכים שתיים ימינה, ויורדים ארבע. ירידה נחשבת שלילית, "
                        "ולכן השיפוע הוא מינוס ארבע חלקי שתיים: מינוס שתיים. קו יורד, שיפוע שלילי.") as d:
            self.play(Create(line2), FadeIn(dC), FadeIn(dD), run_time=1.2)
            self.play(Create(tri2[0]), FadeIn(r1), run_time=1)
            self.play(Create(tri2[1]), FadeIn(r2), run_time=1.2)
            self.wait(1)
            self.play(Write(r3), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- y = mx ----------
    def ymx(self):
        ax = Axes(x_range=[-5, 5, 1], y_range=[-5, 5, 1], x_length=6.2, y_length=6.2, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=0.8).shift(DOWN * 0.3)
        plane = NumberPlane(x_range=[-5, 5], y_range=[-5, 5], x_length=6.2, y_length=6.2,
                            background_line_style={"stroke_color": GREY_D, "stroke_opacity": 0.5}).move_to(ax)
        plane.axes.set_opacity(0)
        m = ValueTracker(1)
        xr = lambda: min(5, 5 / max(abs(m.get_value()), 1e-9))  # הקו נשאר בתוך הלוח
        line = always_redraw(lambda: ax.plot(lambda x: m.get_value() * x, x_range=[-xr(), xr()],
                                             color=WHITE, stroke_width=4).set_z_index(1))
        o = Dot(ax.c2p(0, 0), color=GREEN_C, radius=0.13).set_z_index(2)
        eq = always_redraw(lambda: F(f'<i>y</i> = <span fgcolor="{M_COL}">{coef(m.get_value())}</span><i>x</i>', 56)
                           .to_edge(RIGHT, buff=1.4).shift(UP * 1.6))
        with self.voice("עכשיו נכיר פונקציה מיוחדת: וואי שווה אם איקס. המספר אם הוא השיפוע. "
                        "שים לב מה קורה כשמשנים אותו.") as d:
            self.play(FadeIn(plane), Create(ax), run_time=1.2)
            self.play(Create(line), FadeIn(eq), run_time=1.5)
        with self.voice("שיפוע שלוש: תלול. חצי: מתון. מינוס שתיים: יורד. "
                        "אבל משהו אחד לא משתנה אף פעם: כל הקווים עוברים דרך ראשית הצירים, הנקודה אפס פסיק אפס.") as d:
            for target in (3, 0.5, -2):
                self.play(m.animate.set_value(target), run_time=1.4)
                self.wait(0.4)
            self.play(FadeIn(o, scale=2), Flash(o, color=GREEN_C), run_time=1.2)
            lab = F("(0, 0)", 34, GREEN_C).next_to(o, DR, buff=0.1)
            self.play(FadeIn(lab), run_time=0.6)
            self.play(m.animate.set_value(1.5), run_time=1.2)
        why = R("כי כש־", "<i>x</i> = 0", "גם", "<i>y</i> = <i>m</i> · 0 = 0", size=32, color=GREEN_C).to_edge(RIGHT, buff=0.6).shift(DOWN * 0.4)
        with self.voice("למה? כי כשאיקס שווה אפס, וואי שווה אם כפול אפס, וזה תמיד אפס.") as d:
            self.play(FadeIn(why, shift=UP * 0.2), run_time=1)
        self.play(*[FadeOut(mob) for mob in self.mobjects if mob is not self.title])

    # ---------- יחס ישר ----------
    def proportion(self):
        xs = [1, 2, 3, 4]
        cols = VGroup(*[VGroup(T(str(x), 38), T(str(30 * x), 38, ORANGE), T("30", 38, M_COL)).arrange(DOWN, buff=0.45) for x in xs])
        cols.arrange(LEFT, buff=0.9)
        heads = VGroup(T("כרטיסים", 30, GREY_B), T("מחיר", 30, GREY_B), F("<i>y</i> ÷ <i>x</i>", 32, M_COL)).arrange(DOWN, buff=0.45)
        heads.next_to(cols, RIGHT, buff=0.6)
        for h, i in zip(heads, range(3)):
            h.match_y(cols[0][i])
        tab = VGroup(heads, cols).to_edge(RIGHT, buff=0.8).shift(UP * 0.6)
        cap = R("כרטיס למשחק עולה", "30", "ש״ח", size=36).next_to(tab, UP, buff=1.0).align_to(tab, RIGHT)
        with self.voice("ועכשיו יחס ישר. כרטיס למשחק עולה שלושים שקלים. כרטיס אחד, שלושים. שניים, שישים. שלושה, תשעים. ארבעה, מאה עשרים.") as d:
            self.play(FadeIn(cap), FadeIn(heads[:2]), run_time=1)
            for c in cols:
                self.play(FadeIn(c[:2], shift=LEFT * 0.2), run_time=0.6)
                self.wait(max(d / 4 - 0.9, 0.2))
        arr = CurvedArrow(cols[1][1].get_bottom() + DOWN * 0.1, cols[3][1].get_bottom() + DOWN * 0.1, angle=-PI / 4, color=BLUE_C, tip_length=0.15)
        arr_top = CurvedArrow(cols[1][0].get_top() + UP * 0.1, cols[3][0].get_top() + UP * 0.1, angle=PI / 4, color=BLUE_C, tip_length=0.15)
        x2 = R("פי", "2", size=28, color=BLUE_C).next_to(arr_top, UP, buff=0.1)
        with self.voice("שים לב: כשקונים פי שניים כרטיסים, משלמים פי שניים. "
                        "ואם מחלקים את המחיר במספר הכרטיסים, תמיד יוצא שלושים. המנה קבועה.") as d:
            self.play(Create(arr_top), FadeIn(x2), run_time=1)
            self.play(Create(arr), run_time=1)
            self.wait(1.5)
            self.play(FadeOut(VGroup(arr, arr_top, x2)), FadeIn(heads[2]), LaggedStart(*[FadeIn(c[2]) for c in cols], lag_ratio=0.3), run_time=2)
        ax = Axes(x_range=[0, 4, 1], y_range=[0, 120, 30], x_length=4.4, y_length=4.4, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=1.1).shift(DOWN * 0.5)
        labs = axes_labels(ax, range(0, 5), range(0, 121, 30), 20)
        line = ax.plot(lambda x: 30 * x, x_range=[0, 4], color=WHITE, stroke_width=4)
        dots = VGroup(*[Dot(ax.c2p(x, 30 * x), color=ORANGE, radius=0.09) for x in xs])
        o = Dot(ax.c2p(0, 0), color=GREEN_C, radius=0.12)
        eq = F("<i>y</i> = 30<i>x</i>", 48, M_COL).next_to(tab, DOWN, buff=0.6)
        with self.voice("זה נקרא יחס ישר. הנוסחה: וואי שווה שלושים איקס, והגרף הוא קו ישר שעובר בראשית הצירים. "
                        "הגיוני: אפס כרטיסים עולים אפס שקלים.") as d:
            self.play(Create(ax), FadeIn(labs), run_time=1)
            self.play(LaggedStart(*[FadeIn(dt, scale=2) for dt in dots], lag_ratio=0.3), run_time=1.2)
            self.play(Create(line), Write(eq), run_time=1.5)
            self.play(FadeIn(o, scale=2), Flash(o, color=GREEN_C), run_time=1)
        self.play(*[FadeOut(mob) for mob in self.mobjects if mob is not self.title])

        # טעות נפוצה: y = 2x + 5
        eq2 = F("<i>y</i> = 2<i>x</i> + 5", 52).to_edge(RIGHT, buff=1.2).shift(UP * 1.8)
        ax2 = Axes(x_range=[-1, 4, 1], y_range=[0, 14, 2], x_length=4.4, y_length=4.6, tips=False,
                   axis_config={"color": GREY_C}).to_edge(LEFT, buff=1.1).shift(DOWN * 0.4)
        labs2 = axes_labels(ax2, range(0, 5), range(0, 15, 4), 20)
        l2 = ax2.plot(lambda x: 2 * x + 5, x_range=[-1, 4], color=WHITE, stroke_width=4)
        miss = Dot(ax2.c2p(0, 5), color=RED_C, radius=0.12)
        o2 = Circle(radius=0.15, color=GREEN_C).move_to(ax2.c2p(0, 0))
        rows = VGroup(R("כש־", "<i>x</i> = 1", ":", "7 ÷ 1 = 7", size=32),
                      R("כש־", "<i>x</i> = 2", ":", "9 ÷ 2 = 4.5", size=32)).arrange(DOWN, buff=0.3, aligned_edge=RIGHT)
        rows.next_to(eq2, DOWN, buff=0.5).align_to(eq2, RIGHT)
        no = T("לא יחס ישר!", 44, RED_C).next_to(rows, DOWN, buff=0.5).align_to(eq2, RIGHT)
        with self.voice("זהירות, טעות נפוצה! וואי שווה שתיים איקס ועוד חמש, הוא קו ישר, אבל הוא לא יחס ישר. "
                        "הוא לא עובר בראשית הצירים, והמנה לא קבועה: פעם שבע, פעם ארבע וחצי.") as d:
            self.play(Write(eq2), Create(ax2), FadeIn(labs2), run_time=1.5)
            self.play(Create(l2), run_time=1.2)
            self.play(FadeIn(miss, scale=2), Create(o2), run_time=1)
            self.play(FadeIn(rows, shift=UP * 0.2), run_time=1.2)
            self.play(FadeIn(no, scale=1.3), run_time=1)
        self.play(*[FadeOut(mob) for mob in self.mobjects if mob is not self.title])

    # ---------- סיכום ----------
    def summary(self):
        head = T("מה לזכור", 52, YELLOW).shift(UP * 2.3)
        lines = VGroup(
            T("שיפוע = כמה עלינו ÷ כמה הלכנו ימינה", 36, M_COL),
            T("קו עולה: שיפוע חיובי. קו יורד: שיפוע שלילי", 36),
            R("<i>y</i> = <i>mx</i>", "היא קו ישר דרך", "(0, 0)", "והשיפוע הוא m", size=36),
            R("יחס ישר: פי", "2", "בכמות = פי", "2", "במחיר, והמנה קבועה", size=36, color=GREEN_C),
        ).arrange(DOWN, buff=0.4, aligned_edge=RIGHT).next_to(head, DOWN, buff=0.6)
        with self.voice("מה לזכור? שיפוע הוא כמה עלינו, חלקי כמה הלכנו ימינה. קו עולה, שיפוע חיובי. קו יורד, שיפוע שלילי. "
                        "הפונקציה וואי שווה אם איקס היא קו ישר דרך ראשית הצירים. "
                        "וזה בדיוק יחס ישר: כשכמות גדלה פי שתיים, גם המחיר גדל פי שתיים.") as d:
            self.play(FadeIn(head), run_time=0.8)
            for ln in lines:
                self.play(FadeIn(ln, shift=LEFT * 0.2), run_time=0.9)
                self.wait(max(d / 4 - 1.1, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, גרור את הנקודות במשולש השיפוע, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(mob) for mob in self.mobjects])
