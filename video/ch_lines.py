"""סרטון: ישרים מקבילים לצירים וחיתוך ישרים (כיתה ח׳, פרקים 9–10).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_lines.py Lines
"""
from common import *

H_COL, V_COL, P_COL = ORANGE, BLUE_C, GREEN_C
RC = RIGHT * 3.7  # מרכז העמודה הימנית (טקסט)


def F(s, size=44, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def num(v):
    return str(v).replace("-", "−")


def make_plane(xr, yr, unit=0.45, every=2, xunit=None):
    """מערכת צירים עם רשת ולייבלים ידניים. מחזיר (ax, group)."""
    xl, yl = (xr[1] - xr[0]) * (xunit or unit), (yr[1] - yr[0]) * unit
    step = every if every > 2 else 1
    ax = Axes(x_range=[xr[0], xr[1], 1], y_range=[yr[0], yr[1], step], x_length=xl, y_length=yl, tips=False,
              axis_config={"color": GREY_B, "stroke_width": 3})
    grid = NumberPlane(x_range=[xr[0], xr[1], 1], y_range=[yr[0], yr[1], step], x_length=xl, y_length=yl,
                       background_line_style={"stroke_color": GREY_D, "stroke_opacity": 0.6, "stroke_width": 1})
    grid.axes.set_opacity(0)
    grid.move_to(ax)
    labs = VGroup()
    for x in range(xr[0], xr[1] + 1):
        if x and x % (2 if every > 2 else every) == 0:
            labs.add(F(num(x), 20, GREY_B).next_to(ax.c2p(x, 0), DOWN, buff=0.1))
    for y in range(yr[0], yr[1] + 1):
        if y and y % every == 0:
            labs.add(F(num(y), 20, GREY_B).next_to(ax.c2p(0, y), LEFT, buff=0.1))
    labs.add(F("<i>x</i>", 28, GREY_A).next_to(ax.c2p(xr[1], 0), UP, buff=0.12))
    labs.add(F("<i>y</i>", 28, GREY_A).next_to(ax.c2p(0, yr[1]), RIGHT, buff=0.12))
    return ax, VGroup(grid, ax, labs)


def tag(s, mob, direction, color, size=26):
    return F(s, size, color).next_to(mob, direction, buff=0.15).set_stroke(BLACK, 4, background=True)


class Lines(Narrated):
    def construct(self):
        self.intro()
        self.horizontal()
        self.vertical()
        self.rectangle()
        self.story()
        self.algebra()
        self.parallel()
        self.summary()

    def clear(self, keep=()):
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title and m not in keep])

    # ---------- פתיח ----------
    def intro(self):
        title = T("ישרים מקבילים לצירים וחיתוך ישרים", 56, font=TITLE)
        with self.voice("ביחידה הזו נכיר שני סוגים מיוחדים של ישרים: ישר שוכב וישר עומד. "
                        "ואחר כך נלמד למצוא את הנקודה שבה שני ישרים נפגשים.") as d:
            self.play(Write(title), run_time=2.5)
            self.wait(max(d - 3.5, 0.3))
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
        self.title = title
        c = court(0.42).shift(DOWN * 0.4)
        with self.voice("תסתכל על מגרש כדורסל מלמעלה. קווי הצד שוכבים, וקו האמצע עומד. "
                        "אם נשים את המגרש על מערכת צירים, הקווים האלה מקבילים לצירים.") as d:
            self.play(Create(c), run_time=2.5)
            self.wait(max(d / 2 - 2.5, 0.3))
            self.play(Indicate(c[0], color=H_COL, scale_factor=1.03), run_time=1.3)
            self.play(Indicate(c[1], color=V_COL, scale_factor=1.03), run_time=1.3)
        self.play(FadeOut(c))

    # ---------- y = k ----------
    def horizontal(self):
        ax, pl = make_plane((-5, 6), (-5, 6), unit=0.55)
        pl.to_edge(LEFT, buff=0.7).shift(DOWN * 0.4)
        self.ax, self.pl = ax, pl
        xs = (-3, 2, 5)
        dots = VGroup(*[Dot(ax.c2p(x, 3), color=H_COL, radius=0.1) for x in xs]).set_z_index(3)
        labs = VGroup(*[tag(f'({num(x)}, <span fgcolor="{YELLOW}">3</span>)', d, UP, H_COL) for x, d in zip(xs, dots)])
        with self.voice("נתחיל בשלוש נקודות: מינוס שלוש פסיק שלוש, שתיים פסיק שלוש, וחמש פסיק שלוש. "
                        "מה משותף לכולן? הוואי של כולן הוא שלוש.") as d:
            self.play(FadeIn(pl), run_time=1)
            self.play(LaggedStart(*[FadeIn(VGroup(p, l), scale=1.5) for p, l in zip(dots, labs)], lag_ratio=0.5), run_time=3)
        line = ax.plot(lambda x: 3, x_range=[-5, 6], color=H_COL, stroke_width=5)
        eq = F("<i>y</i> = 3", 60, H_COL).move_to(RC + UP * 1.8)
        info = VGroup(
            T("ישר שוכב", 40, H_COL),
            R("מקביל לציר ה־", "<i>x</i>", size=36),
            R("השיפוע:", "0", size=36),
        ).arrange(DOWN, buff=0.3).next_to(eq, DOWN, buff=0.5)
        with self.voice("כל הנקודות האלה נמצאות על ישר שוכב, שמקביל לציר האיקס. "
                        "המשוואה שלו פשוטה: וואי שווה שלוש. זה בעצם וואי שווה אפס איקס ועוד שלוש, כלומר השיפוע אפס.") as d:
            self.play(Create(line), run_time=1.5)
            self.play(Write(eq), run_time=1.2)
            for m in info:
                self.play(FadeIn(m, shift=UP * 0.2), run_time=0.8)
                self.wait(max(d / 3 - 1.8, 0.2))
        self.hline = VGroup(line, eq.copy().scale(0.5).next_to(ax.c2p(6, 3), UP, buff=0.1).shift(LEFT * 0.4))
        self.play(FadeOut(VGroup(dots, labs, info)), ReplacementTransform(eq, self.hline[1]), run_time=1)

    # ---------- x = k ----------
    def vertical(self):
        ax = self.ax
        ys = (-3, 1, 5)
        dots = VGroup(*[Dot(ax.c2p(2, y), color=V_COL, radius=0.1) for y in ys]).set_z_index(3)
        labs = VGroup(*[tag(f'(<span fgcolor="{YELLOW}">2</span>, {num(y)})', d, RIGHT, V_COL) for y, d in zip(ys, dots)])
        with self.voice("ועכשיו שלוש נקודות אחרות: שתיים פסיק מינוס שלוש, שתיים פסיק אחת, ושתיים פסיק חמש. "
                        "הפעם האיקס של כולן הוא שתיים.") as d:
            self.play(LaggedStart(*[FadeIn(VGroup(p, l), scale=1.5) for p, l in zip(dots, labs)], lag_ratio=0.5), run_time=3)
        line = Line(ax.c2p(2, -5), ax.c2p(2, 6), color=V_COL, stroke_width=5)
        eq = F("<i>x</i> = 2", 60, V_COL).move_to(RC + UP * 1.8)
        info = VGroup(
            T("ישר עומד", 40, V_COL),
            R("מקביל לציר ה־", "<i>y</i>", size=36),
            T("אין לו שיפוע, והוא לא פונקציה", 34),
        ).arrange(DOWN, buff=0.3).next_to(eq, DOWN, buff=0.5)
        with self.voice("הן נמצאות על ישר עומד, שמקביל לציר הוואי. המשוואה שלו: איקס שווה שתיים. "
                        "לישר עומד אין שיפוע, והוא גם לא פונקציה, כי לאותו איקס יש הרבה ערכים של וואי.") as d:
            self.play(Create(line), run_time=1.5)
            self.play(Write(eq), run_time=1.2)
            for m in info:
                self.play(FadeIn(m, shift=UP * 0.2), run_time=0.8)
                self.wait(max(d / 3 - 1.8, 0.2))
        self.vline = VGroup(line, eq.copy().scale(0.5).next_to(ax.c2p(2, 6), RIGHT, buff=0.1).shift(DOWN * 0.3))
        self.play(FadeOut(VGroup(dots, labs, info)), ReplacementTransform(eq, self.vline[1]), run_time=1)

        warn = VGroup(T("זהירות!", 44, RED_B),
                      R("<i>y</i> = 3", "הוא ישר", "שוכב", size=38),
                      R("<i>x</i> = 2", "הוא ישר", "עומד", size=38)).arrange(DOWN, buff=0.35).move_to(RC + UP * 0.8)
        warn[1][2].set_color(H_COL)
        warn[2][2].set_color(V_COL)
        with self.voice("זהירות, כאן הרבה מתבלבלים. וואי שווה שלוש הוא ישר שוכב, כי כל הנקודות שלו בגובה שלוש. "
                        "ואיקס שווה שתיים הוא ישר עומד, כי כל הנקודות שלו במרחק שתיים ימינה.") as d:
            self.play(FadeIn(warn[0]), run_time=0.6)
            self.play(FadeIn(warn[1]), Indicate(self.hline[0], color=H_COL), run_time=1.5)
            self.wait(max(d / 2 - 2.1, 0.3))
            self.play(FadeIn(warn[2]), Indicate(self.vline[0], color=V_COL), run_time=1.5)
        self.play(FadeOut(warn))

    # ---------- מלבן ----------
    def rectangle(self):
        ax = self.ax
        P = Dot(ax.c2p(2, 3), color=P_COL, radius=0.13).set_z_index(4)
        pt = tag("(2, 3)", P, UR, P_COL, 30)
        t1 = R("נפגשים ב־", "(2, 3)", size=40, color=P_COL).move_to(RC + UP * 1.6)
        with self.voice("איפה שני הישרים נפגשים? בנקודה שבה גם איקס שווה שתיים, וגם וואי שווה שלוש: הנקודה שתיים פסיק שלוש.") as d:
            self.play(FadeIn(P, scale=2), Flash(P, color=P_COL), run_time=1.2)
            self.play(FadeIn(pt), FadeIn(t1), run_time=1)
        rect = Polygon(ax.c2p(0, 0), ax.c2p(2, 0), ax.c2p(2, 3), ax.c2p(0, 3), stroke_width=0, fill_color=P_COL, fill_opacity=0.3)
        s1 = R("רוחב:", "2", size=36).next_to(t1, DOWN, buff=0.5)
        s2 = R("גובה:", "3", size=36).next_to(s1, DOWN, buff=0.25)
        s3 = R("שטח", "= 2 · 3 = 6", size=38, color=P_COL).next_to(s2, DOWN, buff=0.4)
        s4 = R("היקף", "= 2 + 3 + 2 + 3 = 10", size=38, color=YELLOW).next_to(s3, DOWN, buff=0.25)
        with self.voice("יחד עם הצירים, שני הישרים יוצרים מלבן. הרוחב שלו שתיים, והגובה שלו שלוש. "
                        "השטח: שתיים כפול שלוש, שש. וההיקף: שתיים ועוד שלוש ועוד שתיים ועוד שלוש, עשר.") as d:
            self.play(FadeIn(rect), run_time=1)
            self.play(FadeIn(s1), FadeIn(s2), run_time=1)
            self.wait(max(d / 2 - 2, 0.3))
            self.play(Write(s3), run_time=1.2)
            self.play(Write(s4), run_time=1.5)
        self.clear()

    # ---------- סיפור: מתי תיקו ----------
    def story(self):
        ax, pl = make_plane((0, 6), (0, 24), unit=0.27, every=4, xunit=0.9)
        pl.to_edge(LEFT, buff=0.9).shift(DOWN * 0.3)
        xl = T("דקות", 24, GREY_B).next_to(ax.c2p(6, 0), UP, buff=0.5)
        yl = T("נקודות", 24, GREY_B).next_to(ax.c2p(0, 24), RIGHT, buff=0.55)
        blue = R("כחולים:", "10", "נקודות,", "+1", "בדקה", size=32, color=BLUE_C).move_to(RC + UP * 2)
        orange = R("כתומים:", "4", "נקודות,", "+3", "בדקה", size=32, color=ORANGE).next_to(blue, DOWN, buff=0.3)
        with self.voice("עכשיו סיפור. בתחילת הרבע הכחולים מובילים עם עשר נקודות, והכתומים עם ארבע. "
                        "מעכשיו הכחולים קולעים נקודה אחת בדקה, והכתומים שלוש נקודות בדקה. מתי יהיה תיקו?") as d:
            self.play(FadeIn(pl), FadeIn(xl), FadeIn(yl), run_time=1)
            self.play(FadeIn(blue), run_time=1)
            self.wait(max(d / 2 - 2, 0.3))
            self.play(FadeIn(orange), run_time=1)
        e1 = F("<i>y</i> = <i>x</i> + 10", 40, BLUE_C).next_to(orange, DOWN, buff=0.5)
        e2 = F("<i>y</i> = 3<i>x</i> + 4", 40, ORANGE).next_to(e1, DOWN, buff=0.25)
        l1 = ax.plot(lambda x: x + 10, x_range=[0, 6], color=BLUE_C, stroke_width=5)
        l2 = ax.plot(lambda x: 3 * x + 4, x_range=[0, 6], color=ORANGE, stroke_width=5)
        with self.voice("כל קבוצה היא ישר. הכחולים: וואי שווה איקס ועוד עשר. הכתומים: וואי שווה שלוש איקס ועוד ארבע. "
                        "איקס הוא מספר הדקות, ווואי הוא מספר הנקודות.") as d:
            self.play(Write(e1), Create(l1), run_time=2)
            self.wait(max(d / 2 - 2, 0.3))
            self.play(Write(e2), Create(l2), run_time=2)
        P = Dot(ax.c2p(3, 13), color=P_COL, radius=0.13).set_z_index(4)
        pt = tag("(3, 13)", P, UL, P_COL, 30)
        tie = R("תיקו!", "13 : 13", "אחרי", "3", "דקות", size=34, color=P_COL).next_to(e2, DOWN, buff=0.5)
        with self.voice("איפה הישרים נפגשים? בנקודה שלוש פסיק שלוש עשרה. "
                        "כלומר אחרי שלוש דקות לשתי הקבוצות יש שלוש עשרה נקודות. תיקו! "
                        "אחרי זה הכתומים מובילים, כי הישר שלהם תלול יותר.") as d:
            self.play(FadeIn(P, scale=2), Flash(P, color=P_COL), run_time=1.2)
            self.play(FadeIn(pt), FadeIn(tie), run_time=1)
        self.story_eqs = VGroup(e1, e2)
        self.clear(keep=(e1, e2))

    # ---------- פתרון אלגברי ----------
    def algebra(self):
        e1, e2 = self.story_eqs
        self.play(VGroup(e1, e2).animate.arrange(RIGHT, buff=1.2).move_to(UP * 2.2), run_time=1)
        steps = VGroup(
            F("<i>x</i> + 10 = 3<i>x</i> + 4", 48),
            F("10 − 4 = 3<i>x</i> − <i>x</i>", 48),
            F("6 = 2<i>x</i>", 48),
            F("<i>x</i> = 3", 52, P_COL),
        ).arrange(DOWN, buff=0.35).next_to(VGroup(e1, e2), DOWN, buff=0.6).shift(LEFT * 2.2)
        why = R("בנקודת החיתוך ה־", "<i>y</i>", "שווה ← משווים", size=32, color=GREY_A).next_to(steps[0], RIGHT, buff=0.5)
        with self.voice("אפשר למצוא את הנקודה גם בלי גרף. בנקודת החיתוך הוואי של שני הישרים שווה, "
                        "אז משווים: איקס ועוד עשר, שווה שלוש איקס ועוד ארבע.") as d:
            self.play(Write(steps[0]), run_time=1.5)
            self.play(FadeIn(why), run_time=1)
        with self.voice("מעבירים את המספרים לצד אחד ואת האיקסים לצד השני: עשר פחות ארבע, שווה שלוש איקס פחות איקס. "
                        "שש שווה שתיים איקס, ולכן איקס שווה שלוש.") as d:
            self.play(Write(steps[1]), run_time=1.5)
            self.wait(max(d / 2 - 1.5, 0.3))
            self.play(Write(steps[2]), run_time=1.2)
            self.play(Write(steps[3]), run_time=1.2)
        yv = F("<i>y</i> = 3 + 10 = 13", 44, P_COL).next_to(steps, DOWN, buff=0.45)
        chk = R("בדיקה:", "3 · 3 + 4 = 13", "✔", size=34, color=GREY_A).next_to(yv, DOWN, buff=0.3)
        warn = T("איקס לבד זה רק חצי תשובה!", 34, YELLOW).next_to(steps[3], RIGHT, buff=0.8)
        with self.voice("רגע, זה רק חצי תשובה! נקודה צריכה גם וואי. מציבים איקס שווה שלוש באחד הישרים: "
                        "שלוש ועוד עשר, שלוש עשרה. ובודקים בישר השני: שלוש כפול שלוש ועוד ארבע, גם שלוש עשרה.") as d:
            self.play(FadeIn(warn), run_time=0.8)
            self.wait(max(d / 2 - 2, 0.3))
            self.play(Write(yv), run_time=1.2)
            self.play(FadeIn(chk), run_time=1)
        self.clear()

    # ---------- ישרים מקבילים ----------
    def parallel(self):
        ax, pl = make_plane((-4, 5), (-6, 6), unit=0.5)
        pl.to_edge(LEFT, buff=0.8).shift(DOWN * 0.4)
        l1 = ax.plot(lambda x: 2 * x + 1, x_range=[-3.5, 2.5], color=BLUE_C, stroke_width=5)
        l2 = ax.plot(lambda x: 2 * x - 3, x_range=[-1.5, 4.5], color=ORANGE, stroke_width=5)
        e1 = F("<i>y</i> = 2<i>x</i> + 1", 44, BLUE_C).move_to(RC + UP * 1.8)
        e2 = F("<i>y</i> = 2<i>x</i> − 3", 44, ORANGE).next_to(e1, DOWN, buff=0.3)
        msg = VGroup(T("אותו שיפוע", 40, YELLOW), T("← ישרים מקבילים", 40, YELLOW), T("אין נקודת חיתוך", 40, RED_B)).arrange(DOWN, buff=0.3).next_to(e2, DOWN, buff=0.6)
        with self.voice("ומה אם לשני הישרים יש אותו שיפוע? למשל וואי שווה שתיים איקס ועוד אחת, ווואי שווה שתיים איקס פחות שלוש. "
                        "הם מקבילים, כמו פסי רכבת. הם אף פעם לא נפגשים, ולכן אין נקודת חיתוך.") as d:
            self.play(FadeIn(pl), run_time=0.8)
            self.play(Create(l1), Write(e1), run_time=1.5)
            self.play(Create(l2), Write(e2), run_time=1.5)
            self.wait(max(d / 2 - 3.8, 0.3))
            for m in msg:
                self.play(FadeIn(m, shift=UP * 0.2), run_time=0.8)
        self.clear()

    # ---------- סיכום ----------
    def summary(self):
        rows = VGroup(
            R("<i>y</i> = <i>k</i>", "ישר שוכב, מקביל לציר ה־", "<i>x</i>", size=40, color=H_COL),
            R("<i>x</i> = <i>k</i>", "ישר עומד, מקביל לציר ה־", "<i>y</i>", size=40, color=V_COL),
            R("נקודת חיתוך: משווים את שני הביטויים, מוצאים את", "<i>x</i>", size=38, color=P_COL),
            R("ואז מציבים כדי למצוא את ה־", "<i>y</i>", size=38, color=P_COL),
            T("אותו שיפוע ← מקבילים, אין חיתוך", 38, YELLOW),
        ).arrange(DOWN, buff=0.4, aligned_edge=RIGHT).move_to(UP * 0.4)
        with self.voice("אז מה למדנו? וואי שווה מספר: ישר שוכב, מקביל לציר האיקס. איקס שווה מספר: ישר עומד, מקביל לציר הוואי. "
                        "כדי למצוא נקודת חיתוך של שני ישרים, משווים את הביטויים, מוצאים את האיקס, ומציבים כדי למצוא את הוואי. "
                        "ואם השיפועים שווים, הישרים מקבילים.") as d:
            for r in rows:
                self.play(FadeIn(r, shift=UP * 0.2), run_time=0.9)
                self.wait(max(d / 5 - 1.2, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
