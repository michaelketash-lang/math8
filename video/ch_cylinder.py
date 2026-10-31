"""סרטון: גליל (כיתה ח׳, פרק 22).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_cylinder.py Cylinder
"""
from common import *

add_pron({
    "גליל": "גָּלִיל", "הגליל": "הַגָּלִיל", "לגליל": "לַגָּלִיל", "נפח": "נֶפַח", "הנפח": "הַנֶּפַח",
    "היקף": "הֶקֵּף", "ההיקף": "הַהֶקֵּף", "המעטפת": "הַמַּעֲטֶפֶת", "הפריסה": "הַפְּרִיסָה",
    "ריבוע": "רִבּוּעַ", "בריבוע": "בָּרִבּוּעַ", "הקוטר": "הַקֹּטֶר",
})

BASE, SIDE = ORANGE, BLUE_C


def MT(s, size=40, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def cyl(r, h, c, side=SIDE, base=BASE, k=0.3):
    """גליל במבט מעט מלמעלה. c = מרכז הגליל."""
    ry = r * k
    top, bot = c + UP * h / 2, c + DOWN * h / 2
    body = VMobject(fill_color=side, fill_opacity=0.3, stroke_width=0)
    arc = Arc(radius=1, start_angle=PI, angle=PI).stretch(r, 0).stretch(ry, 1)
    arc.shift(bot - (arc.get_start() + arc.get_end()) / 2)
    body.set_points_as_corners([top + LEFT * r, bot + LEFT * r])
    body.append_points(arc.get_points())
    body.add_line_to(top + RIGHT * r)
    body.add_line_to(top + LEFT * r)
    sides = VGroup(Line(top + LEFT * r, bot + LEFT * r), Line(top + RIGHT * r, bot + RIGHT * r)).set_stroke(side, 4)
    front = arc.copy().set_stroke(side, 4)
    back = DashedVMobject(Arc(radius=1, start_angle=0, angle=PI).stretch(r, 0).stretch(ry, 1).move_to(bot + UP * ry / 2), num_dashes=12).set_stroke(GREY_B, 2)
    lid = Ellipse(width=2 * r, height=2 * ry, color=base, fill_opacity=0.45, stroke_width=4).move_to(top)
    return VGroup(body, back, sides, front, lid)


class Cylinder(Narrated):
    def construct(self):
        self.story()
        self.parts()
        self.net()
        self.areas()
        self.volume()
        self.example()
        self.mistakes()
        self.summary()

    # ---------- פתיחה ----------
    def story(self):
        can = cyl(1.1, 2.6, np.array([-3.2, -0.6, 0]), side=GREY_B, base=GREY_A)
        ring = VGroup(*[Line(np.array([-4.3, y, 0]), np.array([-2.1, y, 0]), color=RED_C, stroke_width=10) for y in (-0.2, -0.5)])
        title = T("גליל", 72, font=TITLE).to_edge(UP, buff=0.3)
        with self.voice("סוף האימון. אתה פותח פחית שתייה קרה. פחית, צינור, קופסת כדורי טניס: לכולם יש אותה צורה. הצורה הזו נקראת גליל.") as d:
            self.play(DrawBorderThenFill(can), run_time=2)
            self.play(Create(ring), run_time=1)
            self.play(Write(title), run_time=1.5)
        q1 = R("כמה אלומיניום צריך לפחית?", "← שטח", size=36, color=SIDE)
        q2 = R("כמה שתייה נכנסת בה?", "← נפח", size=36, color=BASE)
        VGroup(q1, q2).arrange(DOWN, aligned_edge=RIGHT, buff=0.5).to_edge(RIGHT, buff=0.7).shift(DOWN * 0.3)
        with self.voice("שתי שאלות: כמה אלומיניום צריך כדי לייצר את הפחית? זו שאלה על שטח. "
                        "וכמה שתייה נכנסת בתוכה? זו שאלה על נפח. בסרטון הזה נדע לענות על שתיהן.") as d:
            self.play(FadeIn(q1, shift=LEFT * 0.3), run_time=1)
            self.wait(2)
            self.play(FadeIn(q2, shift=LEFT * 0.3), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- חלקי הגליל ----------
    def parts(self):
        r, h, c = 1.5, 3.4, np.array([-3.0, -0.4, 0])
        g = cyl(r, h, c)
        top, bot = c + UP * h / 2, c + DOWN * h / 2
        botfill = Ellipse(width=2 * r, height=2 * r * 0.3, color=BASE, fill_opacity=0.45, stroke_width=4).move_to(bot)
        with self.voice("לגליל יש שני בסיסים: שני עיגולים שווים, אחד למעלה ואחד למטה, והם מקבילים זה לזה.") as d:
            self.play(Create(g), run_time=2)
            self.play(Indicate(g[4], color=BASE), FadeIn(botfill), run_time=1.5)
        rl = Line(top, top + RIGHT * r, color=YELLOW, stroke_width=5)
        rt = M("r", 40).set_color(YELLOW).next_to(rl, UP, buff=0.1)
        hl = DoubleArrow(top + RIGHT * (r + 0.4), bot + RIGHT * (r + 0.4), buff=0, color=YELLOW, stroke_width=4, tip_length=0.2)
        ht = M("h", 40).set_color(YELLOW).next_to(hl, RIGHT, buff=0.1)
        labs = VGroup(R("<i>r</i>", "= רדיוס הבסיס", size=34), R("<i>h</i>", "= הגובה", size=34),
                      T("המעטפת = המשטח המעוגל", 34, SIDE), T("הבסיסים = שני עיגולים", 34, BASE)).arrange(DOWN, aligned_edge=RIGHT, buff=0.35)
        labs.to_edge(RIGHT, buff=0.7)
        with self.voice("הרדיוס של הבסיס מסומן באות אר, והגובה, המרחק בין הבסיסים, באות אייץ'. "
                        "והמשטח המעוגל שמסביב נקרא מעטפת.") as d:
            self.play(Create(rl), FadeIn(rt), FadeIn(labs[0]), run_time=1.2)
            self.play(GrowFromCenter(hl), FadeIn(ht), FadeIn(labs[1]), run_time=1.2)
            self.play(g[0].animate.set_fill(opacity=0.6), FadeIn(labs[2]), run_time=1)
            self.play(g[0].animate.set_fill(opacity=0.3), FadeIn(labs[3]), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- פריסה ----------
    def net(self):
        r, h, x0, yT = 0.9, 2.4, -2.6, 0.9
        yB = yT - h
        t = ValueTracker(0)

        def draw():
            tt = t.get_value()
            ry = ((1 - tt) * 0.3 + tt) * r
            X = lambda th: x0 + (1 - tt) * r * np.sin(th) + tt * r * th
            Yo = lambda th: -(1 - tt) * 0.3 * r * np.cos(th)
            N = 40
            back, front = VGroup(), VGroup()
            for i in range(N):
                a = -PI + TAU * i / N
                b = a + TAU / N
                fr = np.cos((a + b) / 2) > 0 or tt > 0.5
                p = Polygon([X(a), yT + Yo(a), 0], [X(b), yT + Yo(b), 0], [X(b), yB + Yo(b), 0], [X(a), yB + Yo(a), 0],
                            stroke_width=0.6, stroke_color=SIDE, stroke_opacity=0.5,
                            fill_color=SIDE if fr else BLUE_E, fill_opacity=0.45 if fr else 0.6)
                (front if fr else back).add(p)
            bot = Ellipse(width=2 * r, height=max(2 * ry, 0.01), color=BASE, fill_opacity=0.35, stroke_width=3).move_to([x0, yB - tt * r, 0])
            top = Ellipse(width=2 * r, height=max(2 * ry, 0.01), color=BASE, fill_opacity=0.5, stroke_width=3).move_to([x0, yT + tt * r, 0])
            return VGroup(bot, back, front, top)

        shape = always_redraw(draw)
        head = T("הפריסה של גליל", 46).to_edge(UP, buff=0.3).to_edge(RIGHT, buff=0.6)
        with self.voice("מה קורה אם גוזרים את הגליל לאורך הצד, ופותחים אותו? זה נקרא פריסה. בוא נראה.") as d:
            self.play(FadeIn(shape), Write(head), run_time=1.5)
            self.wait(1)
            self.play(t.animate.set_value(1), run_time=4, rate_func=smooth)
        shape.clear_updaters()
        L, Rr = x0 - PI * r, x0 + PI * r
        rect = Rectangle(width=TAU * r, height=h, color=SIDE, stroke_width=4).move_to([x0, (yT + yB) / 2, 0])
        info = VGroup(T("מלבן אחד", 38, SIDE), T("ועוד שני עיגולים", 38, BASE)).arrange(DOWN, aligned_edge=RIGHT, buff=0.2).next_to(head, DOWN, buff=0.5).align_to(head, RIGHT)
        hl = MT("<i>h</i>", 40, YELLOW).next_to(rect, LEFT, buff=0.15)
        with self.voice("המעטפת נפתחה והפכה למלבן! אז הפריסה של גליל היא מלבן אחד ועוד שני עיגולים. הגובה של המלבן הוא אייץ', הגובה של הגליל.") as d:
            self.play(Create(rect), FadeIn(info[0]), run_time=1.2)
            self.play(FadeIn(info[1]), run_time=1)
            self.play(FadeIn(hl), run_time=0.8)
        q = R("ומה הרוחב של המלבן", "?", size=36, color=YELLOW).next_to(info, DOWN, buff=0.6).align_to(info, RIGHT)
        circ = shape[3]
        with self.voice("ומה הרוחב של המלבן? הוא היה מלופף בדיוק פעם אחת מסביב לעיגול. בוא נגלגל את העיגול לאורך המלבן.") as d:
            self.play(FadeIn(q), run_time=1)
            self.play(circ.animate.move_to([L, yT + r, 0]), run_time=1.5)
        p = ValueTracker(0)
        th = lambda: TAU * p.get_value()
        mark = always_redraw(lambda: Dot([L + r * th() - r * np.sin(th()), yT + r - r * np.cos(th()), 0], color=YELLOW, radius=0.08))
        spoke = always_redraw(lambda: Line([L + r * th(), yT + r, 0], mark.get_center(), color=YELLOW, stroke_width=3))
        circ.add_updater(lambda m: m.move_to([L + r * th(), yT + r, 0]))
        trail = TracedPath(mark.get_center, stroke_color=YELLOW, stroke_width=2)
        width = MT("2π<i>r</i>", 44, YELLOW).move_to(rect.get_bottom() + UP * 0.4)
        ans = VGroup(T("רוחב המלבן = היקף הבסיס", 34, YELLOW), MT("2π<i>r</i>", 40, YELLOW)).arrange(LEFT, buff=0.3).move_to(q).align_to(q, RIGHT)
        with self.voice("סיבוב אחד שלם של העיגול בדיוק מכסה את הרוחב. אז הרוחב של המלבן שווה להיקף הבסיס: שתיים פאי אר.") as d:
            self.add(mark, spoke, trail)
            self.play(p.animate.set_value(1), run_time=3, rate_func=linear)
            circ.clear_updaters()
            self.play(FadeOut(VGroup(mark, spoke, trail)), circ.animate.move_to([x0, yT + r, 0]), run_time=1)
            self.play(FadeIn(width), ReplacementTransform(q, ans), run_time=1.2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- שטח מעטפת ושטח פנים ----------
    def areas(self):
        r, h, x0, yc = 0.8, 2.2, -3.0, -0.2
        rect = Rectangle(width=TAU * r, height=h, color=SIDE, fill_opacity=0.35, stroke_width=4).move_to([x0, yc, 0])
        c1 = Circle(radius=r, color=BASE, fill_opacity=0.35, stroke_width=4).next_to(rect, UP, buff=0)
        c2 = Circle(radius=r, color=BASE, fill_opacity=0.35, stroke_width=4).next_to(rect, DOWN, buff=0)
        wl = MT("2π<i>r</i>", 38, YELLOW).move_to(rect).shift(DOWN * 0.5)
        hl = MT("<i>h</i>", 38, YELLOW).next_to(rect, LEFT, buff=0.15)
        lat = VGroup(T("שטח מעטפת", 38, SIDE), MT("= 2π<i>r</i> · <i>h</i>", 44, SIDE)).arrange(LEFT, buff=0.25)
        lat.to_edge(RIGHT, buff=0.6).shift(UP * 2.2)
        with self.voice("עכשיו קל לחשב שטחים. שטח המעטפת הוא שטח המלבן: רוחב כפול גובה. כלומר, שתיים פאי אר, כפול אייץ'.") as d:
            self.play(FadeIn(rect), FadeIn(c1), FadeIn(c2), FadeIn(wl), FadeIn(hl), run_time=1.5)
            self.play(Indicate(rect, color=SIDE, scale_factor=1.05), run_time=1.2)
            self.play(Write(lat), run_time=1.5)
        base = VGroup(T("שטח בסיס", 38, BASE), MT("= π<i>r</i>²", 44, BASE)).arrange(LEFT, buff=0.25).next_to(lat, DOWN, buff=0.5).align_to(lat, RIGHT)
        tot = VGroup(T("שטח פנים", 38, YELLOW), MT("= 2π<i>rh</i> + 2π<i>r</i>²", 44, YELLOW)).arrange(LEFT, buff=0.25).next_to(base, DOWN, buff=0.6).align_to(base, RIGHT)
        sub = T("(מעטפת + שני בסיסים)", 30, GREY_B).next_to(tot, DOWN, buff=0.2).align_to(tot, RIGHT)
        with self.voice("כל בסיס הוא עיגול, והשטח שלו פאי אר בריבוע. "
                        "ושטח הפנים, כל השטח של הגליל מבחוץ, הוא המעטפת ועוד שני הבסיסים.") as d:
            self.play(Indicate(c1, color=BASE), Indicate(c2, color=BASE), Write(base), run_time=2)
            self.wait(1)
            self.play(Write(tot), FadeIn(sub), run_time=2)
            self.play(Circumscribe(VGroup(rect, c1, c2), color=YELLOW), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- נפח ----------
    def volume(self):
        r, n, hh, x0, y0 = 1.3, 6, 0.5, -3.2, -2.6
        layers = VGroup()
        for i in range(n):
            layers.add(cyl(r, hh, np.array([x0, y0 + hh / 2 + i * hh, 0]), side=BASE if i % 2 else "#f0a060", base=BASE))
        head = T("נפח = כמה הגליל מכיל", 44).to_edge(UP, buff=0.35).to_edge(RIGHT, buff=0.6)
        coin = VGroup(T("כל שכבה: עיגול", 36), MT("π<i>r</i>²", 44, BASE)).arrange(LEFT, buff=0.3).next_to(head, DOWN, buff=0.6).align_to(head, RIGHT)
        with self.voice("ועכשיו, נפח. דמיין ערימה של מטבעות. כל מטבע הוא עיגול, עם שטח של פאי אר בריבוע.") as d:
            self.play(Write(head), run_time=1)
            self.play(FadeIn(layers[0], shift=DOWN * 0.5), FadeIn(coin), run_time=1.2)
        cnt = R("כמה שכבות? כגובה", "<i>h</i>", size=36).next_to(coin, DOWN, buff=0.5).align_to(coin, RIGHT)
        vol = VGroup(T("נפח", 40, YELLOW), MT("= π<i>r</i>² · <i>h</i>", 50, YELLOW)).arrange(LEFT, buff=0.3).next_to(cnt, DOWN, buff=0.6).align_to(cnt, RIGHT)
        sub = T("שטח הבסיס כפול הגובה", 32, GREY_B).next_to(vol, DOWN, buff=0.2).align_to(vol, RIGHT)
        with self.voice("נערום את השכבות אחת על השנייה, עד הגובה אייץ'. אז הנפח הוא שטח הבסיס, כפול הגובה: פאי אר בריבוע, כפול אייץ'.") as d:
            self.play(LaggedStart(*[FadeIn(l, shift=DOWN * 0.5) for l in layers[1:]], lag_ratio=0.4), FadeIn(cnt), run_time=3)
            self.play(Write(vol), run_time=1.5)
            self.play(FadeIn(sub), run_time=0.8)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- דוגמה ----------
    def example(self):
        c = np.array([-4.6, -0.3, 0])
        g = cyl(1.1, 2.8, c, side=GREY_B, base=GREY_A)
        top = c + UP * 1.4
        rl = Line(top, top + RIGHT * 1.1, color=YELLOW, stroke_width=4)
        lab = VGroup(MT("<i>r</i> = 4", 34, YELLOW).next_to(rl, UP, buff=0.45),
                     MT("<i>h</i> = 10", 34, YELLOW).next_to(g, RIGHT, buff=0.2))
        head = R("פחית:", "<i>r</i> = 4,  <i>h</i> = 10", "(ס״מ)", size=38).to_edge(UP, buff=0.3).to_edge(RIGHT, buff=0.6)
        pi = R("בתרגילים:", "π = 3.14", size=32, color=GREY_B).next_to(head, DOWN, buff=0.2).align_to(head, RIGHT)
        with self.voice("דוגמה. פחית עם רדיוס ארבעה סנטימטרים וגובה עשרה. בתרגילים נשתמש בפאי שווה שלוש נקודה ארבע עשרה.") as d:
            self.play(Create(g), Create(rl), FadeIn(lab), run_time=1.5)
            self.play(Write(head), FadeIn(pi), run_time=1.5)
        rows = VGroup(
            R("היקף:", "2 · 3.14 · 4 = 25.12", size=34),
            R("מעטפת:", "25.12 · 10 = 251.2", size=34, color=SIDE),
            R("בסיס:", "3.14 · 4² = 50.24", size=34, color=BASE),
            R("שטח פנים:", "251.2 + 2 · 50.24 = 351.68", size=34, color=YELLOW),
            R("נפח:", "50.24 · 10 = 502.4", size=34, color=YELLOW),
        ).arrange(DOWN, aligned_edge=RIGHT, buff=0.3).next_to(pi, DOWN, buff=0.45).align_to(pi, RIGHT)
        with self.voice("קודם היקף הבסיס: שתיים כפול שלוש נקודה ארבע עשרה כפול ארבע, עשרים וחמש נקודה שתים עשרה. "
                        "שטח המעטפת: היקף כפול גובה, מאתיים חמישים ואחת נקודה שתיים סנטימטרים רבועים.") as d:
            self.play(Write(rows[0]), run_time=1.5)
            self.wait(2.5)
            self.play(Write(rows[1]), run_time=1.5)
        with self.voice("שטח הבסיס: שלוש נקודה ארבע עשרה כפול ארבע בריבוע, חמישים נקודה עשרים וארבע. "
                        "שטח הפנים: המעטפת ועוד פעמיים בסיס, שלוש מאות חמישים ואחת נקודה שישים ושמונה.") as d:
            self.play(Write(rows[2]), run_time=1.5)
            self.wait(2.5)
            self.play(Write(rows[3]), run_time=1.5)
        with self.voice("והנפח: שטח הבסיס כפול הגובה, חמש מאות ושתיים נקודה ארבע סנטימטרים מעוקבים. בערך חצי ליטר.") as d:
            self.play(Write(rows[4]), run_time=1.5)
            self.play(Circumscribe(rows[4], color=YELLOW), run_time=1.2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- טעויות נפוצות ----------
    def mistakes(self):
        head = T("שתי מלכודות", 50).to_edge(UP, buff=0.4)
        circ = Circle(radius=1.9, color=BASE, stroke_width=4).move_to([-4, -0.5, 0])
        dia = Line(circ.get_left(), circ.get_right(), color=RED_C, stroke_width=5)
        rad = Line(circ.get_center(), circ.get_right(), color=GREEN_C, stroke_width=6)
        dl = R("קוטר", "8", size=32, color=RED_C).next_to(dia, UP, buff=0.15)
        rl = R("רדיוס", "4", size=32, color=GREEN_C).next_to(rad, DOWN, buff=0.15)
        t1 = VGroup(T("נתון קוטר?", 38, RED_C), T("מחלקים בשתיים כדי לקבל רדיוס!", 38)).arrange(DOWN, aligned_edge=RIGHT, buff=0.2)
        t1.to_edge(RIGHT, buff=0.6).shift(UP * 1.4)
        with self.voice("שתי מלכודות. הראשונה: לפעמים נותנים את הקוטר, ולא את הרדיוס. הקוטר עובר מקצה לקצה. "
                        "אם הקוטר שמונה, הרדיוס הוא רק ארבע. תמיד מחלקים בשתיים לפני שמציבים בנוסחה.") as d:
            self.play(Write(head), Create(circ), run_time=1.5)
            self.play(Create(dia), FadeIn(dl), FadeIn(t1[0]), run_time=1.5)
            self.wait(2)
            self.play(Create(rad), FadeIn(rl), FadeIn(t1[1]), run_time=1.5)
        t2 = VGroup(R("שטח ← יחידות רבועות", "(סמ״ר)", size=36, color=SIDE),
                    R("נפח ← יחידות מעוקבות", "(סמ״ק)", size=36, color=BASE)).arrange(DOWN, aligned_edge=RIGHT, buff=0.25)
        t2.next_to(t1, DOWN, buff=0.8).align_to(t1, RIGHT)
        with self.voice("השנייה: יחידות. שטח מודדים ביחידות רבועות, סנטימטר רבוע. נפח מודדים ביחידות מעוקבות, סנטימטר מעוקב. לא לבלבל!") as d:
            self.play(FadeIn(t2[0]), run_time=1.2)
            self.wait(1.5)
            self.play(FadeIn(t2[1]), run_time=1.2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- סיכום ----------
    def summary(self):
        head = T("מה למדנו?", 56, font=TITLE).to_edge(UP, buff=0.4)
        lines = VGroup(
            T("גליל: שני בסיסים עגולים ומעטפת", 36),
            R("פריסה: מלבן", "(2π<i>r</i> × <i>h</i>)", "ושני עיגולים", size=36),
            R("שטח מעטפת =", "2π<i>r</i> · <i>h</i>", size=36, color=SIDE),
            R("שטח פנים = מעטפת +", "2π<i>r</i>²", size=36, color=YELLOW),
            R("נפח =", "π<i>r</i>² · <i>h</i>", size=36, color=BASE),
        ).arrange(DOWN, aligned_edge=RIGHT, buff=0.35).next_to(head, DOWN, buff=0.5).to_edge(RIGHT, buff=1.5)
        with self.voice("אז מה למדנו? לגליל יש שני בסיסים עגולים ומעטפת. בפריסה, המעטפת היא מלבן, והרוחב שלו הוא היקף הבסיס. "
                        "שטח המעטפת: שתיים פאי אר כפול אייץ'. שטח הפנים: מעטפת ועוד שני בסיסים. והנפח: פאי אר בריבוע, כפול אייץ'.") as d:
            self.play(Write(head), run_time=1)
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 5 - 1.3, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, פרוס גליל בעצמך, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
