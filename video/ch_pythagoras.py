"""סרטון: משפט פיתגורס (כיתה ח׳, פרק 21).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_pythagoras.py Pythagoras
"""
from common import *

add_pron({
    "היתר": "הַיֶּתֶר", "ליתר": "לַיֶּתֶר", "ניצב": "נִצָּב", "הניצב": "הַנִּצָּב", "ניצבים": "נִצָּבִים", "הניצבים": "הַנִּצָּבִים",
    "ריבוע": "רִבּוּעַ", "בריבוע": "בָּרִבּוּעַ", "הריבוע": "הָרִבּוּעַ", "ריבועים": "רִבּוּעִים", "הריבועים": "הָרִבּוּעִים",
    "תיבה": "תֵּבָה", "התיבה": "הַתֵּבָה", "סולם": "סֻלָּם", "הסולם": "הַסֻּלָּם", "דומים": "דּוֹמִים",
})

A_COL, B_COL, C_COL = BLUE_C, ORANGE, GREEN_C


def MT(s, size=40, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def right_mark(P, d1, d2, s=0.25, color=WHITE):
    d1, d2 = d1 / np.linalg.norm(d1) * s, d2 / np.linalg.norm(d2) * s
    return VMobject(color=color, stroke_width=3).set_points_as_corners([P + d1, P + d1 + d2, P + d2])


def grid_square(P0, e1, e2, n, color):
    """ריבוע n×n של משבצות, החל מ־P0, עם וקטורי צלע e1, e2 (אורך משבצת)."""
    cells = VGroup(*[Polygon(P0 + i * e1 + j * e2, P0 + (i + 1) * e1 + j * e2, P0 + (i + 1) * e1 + (j + 1) * e2, P0 + i * e1 + (j + 1) * e2,
                             color=color, fill_opacity=0.3, stroke_width=1.5) for i in range(n) for j in range(n)])
    return cells


class Pythagoras(Narrated):
    def construct(self):
        self.story()
        self.parts()
        self.squares()
        self.proof()
        self.ladder()
        self.plane()
        self.space()
        self.congruence()
        self.finale()
        self.summary()

    # ---------- פתיחה: האלכסון של המגרש ----------
    def story(self):
        c = court(0.4).shift(DOWN * 0.4)
        r = c[0]
        with self.voice("אתה עומד בפינה של מגרש כדורסל, ורוצה לרוץ לפינה הרחוקה, באלכסון.") as d:
            self.play(Create(c, lag_ratio=0.1), run_time=2.5)
            dot = Dot(r.get_corner(DL), color=BALL, radius=0.14)
            self.play(FadeIn(dot, scale=2), run_time=0.8)
        L = R("28", "מ׳", size=34, color=YELLOW).next_to(r, DOWN, buff=0.2)
        W = R("15", "מ׳", size=34, color=YELLOW).next_to(r, RIGHT, buff=0.2)
        diag = DashedLine(r.get_corner(DL), r.get_corner(UR), color=BALL, stroke_width=5)
        q = T("?", 60, BALL).move_to(diag.get_center() + UP * 0.5 + LEFT * 0.3)
        with self.voice("אורך המגרש עשרים ושמונה מטרים, והרוחב חמישה עשר. כמה מטרים תרוץ? "
                        "בשביל זה יש את אחד המשפטים המפורסמים במתמטיקה: משפט פיתגורס.") as d:
            self.play(FadeIn(L), FadeIn(W), run_time=1)
            self.play(Create(diag), dot.animate.move_to(r.get_corner(UR)), run_time=2.5)
            self.play(FadeIn(q, scale=1.5), run_time=0.8)
            title = T("משפט פיתגורס", 64, font=TITLE).to_edge(UP, buff=0.25)
            self.play(c.animate.set_stroke(opacity=0.3), Write(title), run_time=2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- ניצבים ויתר ----------
    def parts(self):
        C, B, A = np.array([-5, -2.4, 0]), np.array([0.2, -2.4, 0]), np.array([-5, 1.6, 0])
        tri = Polygon(A, B, C, color=WHITE, fill_color=BLUE_E, fill_opacity=0.4, stroke_width=4)
        rm = right_mark(C, RIGHT, UP, 0.35, YELLOW)
        with self.voice("המשפט עוסק במשולש ישר זווית.") as d:
            self.play(Create(tri), run_time=1.5)
            self.play(Create(rm), Flash(C, color=YELLOW), run_time=1.2)
        a = Line(C, B, color=A_COL, stroke_width=9)
        b = Line(C, A, color=B_COL, stroke_width=9)
        c = Line(A, B, color=C_COL, stroke_width=9)
        la = VGroup(T("ניצב", 34, A_COL), M("a", 38).set_color(A_COL)).arrange(LEFT, buff=0.15).next_to(a, DOWN, buff=0.2)
        lb = VGroup(T("ניצב", 34, B_COL), M("b", 38).set_color(B_COL)).arrange(LEFT, buff=0.15).next_to(b, LEFT, buff=0.2)
        lc = VGroup(T("יתר", 38, C_COL), M("c", 42).set_color(C_COL)).arrange(LEFT, buff=0.15).move_to(c.get_center() + np.array([0.9, 0.6, 0]))
        with self.voice("שתי הצלעות שיוצרות את הזווית הישרה נקראות ניצבים: איי ובי.") as d:
            self.play(Create(a), FadeIn(la), run_time=1.2)
            self.play(Create(b), FadeIn(lb), run_time=1.2)
        note = VGroup(T("היתר: מול הזווית הישרה", 36, C_COL), T("והוא הצלע הארוכה ביותר", 36, C_COL)).arrange(DOWN, aligned_edge=RIGHT, buff=0.2)
        note.to_edge(RIGHT, buff=0.6).shift(UP * 1.5)
        with self.voice("הצלע שמול הזווית הישרה נקראת יתר, סי. היתר הוא תמיד הצלע הארוכה ביותר.") as d:
            self.play(Create(c), FadeIn(lc), run_time=1.5)
            self.play(FadeIn(note, shift=LEFT * 0.3), run_time=1.2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- ריבועים על הצלעות ----------
    def squares(self):
        u, a, b = 0.55, 3, 4
        C = np.array([-3.6, -1.4, 0])
        B, A = C + RIGHT * a * u, C + UP * b * u
        tri = Polygon(A, B, C, color=WHITE, fill_color=GREY_D, fill_opacity=0.8, stroke_width=4).set_z_index(2)
        rm = right_mark(C, RIGHT, UP, 0.2).set_z_index(3)
        sa = grid_square(C, RIGHT * u, DOWN * u, a, A_COL)
        sb = grid_square(C, UP * u, LEFT * u, b, B_COL)
        e1 = (B - A) / np.linalg.norm(B - A) * u
        e2 = np.array([b, a, 0]) / 5 * u
        sc = grid_square(A, e1, e2, 5, C_COL)
        la, lb = T("3", 32, A_COL).next_to(Line(C, B), UP, buff=0.08).set_z_index(3), T("4", 32, B_COL).next_to(Line(C, A), RIGHT, buff=0.08).set_z_index(3)
        lc = T("5", 32, C_COL).move_to((A + B) / 2 + np.array([-0.2, -0.25, 0])).set_z_index(3)
        with self.voice("ניקח משולש עם ניצבים שלוש וארבע, ויתר חמש, ועל כל צלע נבנה ריבוע.") as d:
            self.play(Create(tri), Create(rm), FadeIn(la), FadeIn(lb), FadeIn(lc), run_time=1.5)
            self.play(LaggedStart(FadeIn(sa), FadeIn(sb), FadeIn(sc), lag_ratio=0.5), run_time=2.5)
        na = T("9", 44, WHITE).move_to(C + np.array([a * u / 2, -a * u / 2, 0])).set_z_index(4)
        nb = T("16", 44, WHITE).move_to(C + np.array([-b * u / 2, b * u / 2, 0])).set_z_index(4)
        nc = T("25", 48, WHITE).move_to(A + 2.5 * e1 + 2.5 * e2).set_z_index(4)
        eq = MT(f'<span fgcolor="{A_COL}">9</span> + <span fgcolor="{B_COL}">16</span> = <span fgcolor="{C_COL}">25</span>', 56).to_edge(RIGHT, buff=1).shift(UP * 1.6)
        with self.voice("נספור משבצות: תשע, שש עשרה, ועל היתר עשרים וחמש. ושים לב: תשע ועוד שש עשרה, זה בדיוק עשרים וחמש!") as d:
            self.play(LaggedStart(*[Indicate(s, scale_factor=1.15) for s in sa], lag_ratio=0.1), FadeIn(na), run_time=1)
            self.play(LaggedStart(*[Indicate(s, scale_factor=1.15) for s in sb], lag_ratio=0.06), FadeIn(nb), run_time=1)
            self.play(LaggedStart(*[Indicate(s, scale_factor=1.15) for s in sc], lag_ratio=0.04), FadeIn(nc), run_time=1.5)
            self.play(Write(eq), run_time=1.5)
        law = MT(f'<i><span fgcolor="{A_COL}">a</span></i>² + <i><span fgcolor="{B_COL}">b</span></i>² = <i><span fgcolor="{C_COL}">c</span></i>²', 72).next_to(eq, DOWN, buff=0.7)
        box = SurroundingRectangle(law, color=YELLOW, buff=0.25, corner_radius=0.1)
        cap = T("משפט פיתגורס", 40, YELLOW).next_to(box, DOWN, buff=0.3)
        with self.voice("וזה משפט פיתגורס: איי בריבוע ועוד בי בריבוע שווה סי בריבוע. הריבוע על היתר שווה לסכום הריבועים על הניצבים.") as d:
            self.play(Write(law), run_time=2)
            self.play(Create(box), FadeIn(cap), run_time=1.2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- הוכחה בהזזה ----------
    def proof(self):
        a, b = 1.4, 2.6
        s = a + b
        O = np.array([-5.6, -2.3, 0])
        P = lambda x, y: O + np.array([x, y, 0])
        frame = Polygon(P(0, 0), P(s, 0), P(s, s), P(0, s), color=WHITE, stroke_width=4)
        tris = [([P(0, 0), P(a, 0), P(0, b)], [0, a]), ([P(s, 0), P(s, a), P(a, 0)], [0, 0]),
                ([P(s, s), P(b, s), P(s, a)], [-b, 0]), ([P(0, s), P(0, b), P(b, s)], [a, -b])]
        T4 = VGroup(*[Polygon(*pts, color=GREY_B, fill_color=GREY_D, fill_opacity=1, stroke_width=3) for pts, _ in tris])
        csq = Polygon(P(a, 0), P(s, a), P(b, s), P(0, b), color=C_COL, fill_opacity=0.5, stroke_width=0)
        cl = MT("<i>c</i>²", 56, WHITE).move_to(csq)
        head = T("למה זה נכון? הוכחה בלי מילים", 42).to_edge(UP, buff=0.35).to_edge(RIGHT, buff=0.5)
        with self.voice("אבל למה זה נכון לכל משולש ישר זווית? הנה הוכחה יפה. בריבוע גדול נשים ארבעה משולשים זהים, אחד בכל פינה.") as d:
            self.play(Write(head), Create(frame), run_time=1.5)
            self.play(LaggedStart(*[FadeIn(t, scale=0.8) for t in T4], lag_ratio=0.3), run_time=2)
        t1 = VGroup(T("השטח הריק:", 36), T("ריבוע על היתר", 36, C_COL)).arrange(DOWN, aligned_edge=RIGHT, buff=0.15)
        t1 = VGroup(t1, MT("<i>c</i>²", 48, C_COL)).arrange(LEFT, buff=0.4).to_edge(RIGHT, buff=0.7).shift(UP * 0.9)
        with self.voice("השטח הריק באמצע הוא ריבוע על היתר: סי בריבוע.") as d:
            self.play(FadeIn(csq), Write(cl), run_time=1.5)
            self.play(FadeIn(t1), run_time=1)
        asq = Polygon(P(0, 0), P(a, 0), P(a, a), P(0, a), color=A_COL, fill_opacity=0.5, stroke_width=0)
        bsq = Polygon(P(a, a), P(s, a), P(s, s), P(a, s), color=B_COL, fill_opacity=0.5, stroke_width=0)
        al, bl = MT("<i>a</i>²", 44).move_to(asq), MT("<i>b</i>²", 56).move_to(bsq)
        with self.voice("עכשיו נזיז את המשולשים, בלי לסובב אותם.") as d:
            self.play(FadeOut(csq), FadeOut(cl), run_time=0.6)
            self.play(*[T4[i].animate.shift(np.array([*v, 0])) for i, (_, v) in enumerate(tris)], run_time=2.5)
        t2 = VGroup(T("עכשיו השטח הריק:", 36), MT(f'<i><span fgcolor="{A_COL}">a</span></i>² + <i><span fgcolor="{B_COL}">b</span></i>²', 48)).arrange(LEFT, buff=0.4)
        t2.next_to(t1, DOWN, buff=0.6).align_to(t1, RIGHT)
        concl = MT("<i>a</i>² + <i>b</i>² = <i>c</i>²", 60, YELLOW).next_to(t2, DOWN, buff=0.7).align_to(t2, RIGHT)
        with self.voice("עכשיו השטח הריק הוא שני ריבועים: איי בריבוע ובי בריבוע. אותו ריבוע גדול, אותם משולשים, אז השטח הריק לא השתנה. איי בריבוע ועוד בי בריבוע, שווה סי בריבוע!") as d:
            self.play(FadeIn(asq), FadeIn(bsq), Write(al), Write(bl), run_time=1.5)
            self.play(FadeIn(t2), run_time=1)
            self.wait(1)
            self.play(Write(concl), run_time=1.5)
            self.play(Circumscribe(concl, color=YELLOW), run_time=1.2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- סולם: מציאת ניצב ----------
    def ladder(self):
        y0, xw = -2.8, -2.0
        floor = Line([-6.8, y0, 0], [-1.2, y0, 0], color=GREY_B, stroke_width=5)
        wall = Line([xw, y0, 0], [xw, 3.2, 0], color=GREY_B, stroke_width=8)
        s = 0.42
        foot, top = np.array([xw - 5 * s, y0, 0]), np.array([xw, y0 + 12 * s, 0])
        lad = Line(foot, top, color=COURT, stroke_width=8)
        rungs = VGroup(*[Line(foot + (top - foot) * t + LEFT * 0.12, foot + (top - foot) * t + RIGHT * 0.12, color=COURT, stroke_width=4) for t in np.linspace(0.1, 0.9, 7)])
        rm = right_mark(np.array([xw, y0, 0]), LEFT, UP, 0.3, YELLOW)
        l13 = R("13", "מ׳", size=34, color=C_COL).move_to((foot + top) / 2 + np.array([-0.75, 0.2, 0]))
        l5 = R("5", "מ׳", size=34, color=A_COL).next_to(Line(foot, [xw, y0, 0]), DOWN, buff=0.15)
        lq = T("?", 48, B_COL).next_to(wall, RIGHT, buff=0.2).shift(DOWN * 0.8)
        with self.voice("סולם באורך שלושה עשר מטר נשען על קיר, והרגל שלו חמישה מטרים מהקיר. לאיזה גובה הוא מגיע?") as d:
            self.play(Create(floor), Create(wall), run_time=1)
            self.play(Create(lad), Create(rungs), run_time=1.5)
            self.play(FadeIn(l13), FadeIn(l5), FadeIn(lq), Create(rm), run_time=1.2)
        steps = VGroup(
            R("הסולם מול הזווית הישרה ← הוא היתר", size=32, color=C_COL),
            MT("5² + <i>b</i>² = 13²", 44),
            MT("25 + <i>b</i>² = 169", 44),
            MT("<i>b</i>² = 169 − 25 = 144", 44),
            MT("<i>b</i> = √144 = 12", 50, YELLOW),
        ).arrange(DOWN, aligned_edge=RIGHT, buff=0.3).to_edge(RIGHT, buff=0.6).shift(UP * 0.3)
        with self.voice("הסולם מול הזווית הישרה, אז הוא היתר. חמש בריבוע ועוד בי בריבוע, שווה שלוש עשרה בריבוע.") as d:
            self.play(FadeIn(steps[0]), Indicate(lad, color=C_COL), run_time=1.5)
            self.play(Write(steps[1]), run_time=1.5)
        with self.voice("עשרים וחמש ועוד בי בריבוע, מאה שישים ותשע. מחסירים: בי בריבוע שווה מאה ארבעים וארבע. והשורש: שתים עשרה מטר.") as d:
            self.play(Write(steps[2]), run_time=1.5)
            self.play(Write(steps[3]), run_time=1.5)
            self.play(Write(steps[4]), run_time=1.5)
            self.play(Transform(lq, R("12", "מ׳", size=34, color=B_COL).move_to(lq).shift(RIGHT * 0.3)), run_time=1)
        tip = VGroup(R("יתר:", "מחברים", size=32), R("ניצב:", "מחסירים", size=32, color=YELLOW)).arrange(DOWN, aligned_edge=RIGHT, buff=0.15)
        tip.to_edge(DOWN, buff=0.25).shift(RIGHT * 1.0)
        with self.voice("כלל אצבע: מחפשים יתר? מחברים את הריבועים. מחפשים ניצב? מחסירים.") as d:
            self.play(FadeIn(tip, shift=UP * 0.2), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- מרחק במערכת צירים ----------
    def plane(self):
        ax = Axes(x_range=[0, 6, 1], y_range=[0, 6, 1], x_length=5, y_length=5, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=0.9).shift(DOWN * 0.3)
        grid = NumberPlane(x_range=[0, 6], y_range=[0, 6], x_length=5, y_length=5,
                           background_line_style={"stroke_color": GREY_D, "stroke_opacity": 0.5}).move_to(ax)
        grid.axes.set_opacity(0)
        labs = VGroup(*[T(str(i), 22, GREY_B).next_to(ax.c2p(i, 0), DOWN, buff=0.12) for i in range(1, 7)],
                      *[T(str(i), 22, GREY_B).next_to(ax.c2p(0, i), LEFT, buff=0.12) for i in range(1, 7)])
        P, Q, K = ax.c2p(1, 1), ax.c2p(4, 5), ax.c2p(4, 1)
        dp, dq = Dot(P, color=BALL, radius=0.1), Dot(Q, color=BALL, radius=0.1)
        lp = MT("<i>A</i>(1, 1)", 30).next_to(dp, DL, buff=0.1)
        lq = MT("<i>B</i>(4, 5)", 30).next_to(dq, UR, buff=0.1)
        seg = Line(P, Q, color=C_COL, stroke_width=5)
        with self.voice("ובמערכת הצירים: מה המרחק בין הנקודה אחת אחת, לנקודה ארבע חמש?") as d:
            self.play(FadeIn(grid), Create(ax), FadeIn(labs), run_time=1.5)
            self.play(FadeIn(dp), FadeIn(dq), FadeIn(lp), FadeIn(lq), run_time=1)
            self.play(Create(seg), run_time=1)
        h = DashedLine(P, K, color=A_COL, stroke_width=4)
        v = DashedLine(K, Q, color=B_COL, stroke_width=4)
        rm = right_mark(K, LEFT, UP, 0.22, WHITE)
        lh = MT("4 − 1 = 3", 30, A_COL).next_to(h, DOWN, buff=0.15)
        lv = MT("5 − 1 = 4", 30, B_COL).next_to(v, RIGHT, buff=0.15)
        with self.voice("מציירים משולש ישר זווית. ניצב אחד: ההפרש בין האיקסים, שלוש. ניצב שני: ההפרש בין הוואים, ארבע.") as d:
            self.play(Create(h), Create(v), Create(rm), run_time=1.5)
            self.play(FadeIn(lh), run_time=1)
            self.wait(0.8)
            self.play(FadeIn(lv), run_time=1)
        calc = VGroup(MT("<i>d</i>² = 3² + 4² = 25", 44), MT("<i>d</i> = √25 = 5", 50, YELLOW)).arrange(DOWN, aligned_edge=RIGHT, buff=0.3)
        calc.to_edge(RIGHT, buff=0.8).shift(UP * 0.8)
        with self.voice("והמרחק הוא היתר: שלוש בריבוע ועוד ארבע בריבוע, עשרים וחמש. השורש: חמש.") as d:
            self.play(Write(calc[0]), run_time=1.5)
            self.play(Write(calc[1]), Indicate(seg, color=YELLOW), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- במרחב: אלכסון תיבה ----------
    def space(self):
        u = 0.36
        O = np.array([-5.6, -2.9, 0])
        ex, ey, ez = np.array([u, 0, 0]), np.array([0.55 * u, 0.4 * u, 0]), np.array([0, u, 0])
        a, b, h = 4, 3, 12
        p = lambda x, y, z: O + x * a * ex + y * b * ey + z * h * ez
        V = {k: p(*k) for k in [(x, y, z) for x in (0, 1) for y in (0, 1) for z in (0, 1)]}
        E = lambda k1, k2, **kw: Line(V[k1], V[k2], **kw)
        front = [((0, 0, 0), (1, 0, 0)), ((1, 0, 0), (1, 1, 0)), ((0, 0, 1), (1, 0, 1)), ((1, 0, 1), (1, 1, 1)), ((1, 1, 1), (0, 1, 1)),
                 ((0, 1, 1), (0, 0, 1)), ((0, 0, 0), (0, 0, 1)), ((1, 0, 0), (1, 0, 1)), ((1, 1, 0), (1, 1, 1))]
        back = [((0, 0, 0), (0, 1, 0)), ((0, 1, 0), (1, 1, 0)), ((0, 1, 0), (0, 1, 1))]
        box = VGroup(*[E(i, j, color=WHITE, stroke_width=3) for i, j in front],
                     *[DashedLine(V[i], V[j], color=GREY_B, stroke_width=2) for i, j in back])
        la = T("4", 30, BLUE_C).next_to(Line(V[(0, 0, 0)], V[(1, 0, 0)]), DOWN, buff=0.1)
        lb = T("3", 30, BLUE_C).move_to((V[(1, 0, 0)] + V[(1, 1, 0)]) / 2 + RIGHT * 0.25 + DOWN * 0.1)
        lh = T("12", 30, BLUE_C).next_to(Line(V[(1, 1, 0)], V[(1, 1, 1)]), RIGHT, buff=0.12)
        with self.voice("וגם במרחב. תיבה עם אורך ארבע, רוחב שלוש, וגובה שתים עשרה. מה אורך האלכסון שלה, מפינה לפינה?") as d:
            self.play(Create(box), run_time=2)
            self.play(FadeIn(la), FadeIn(lb), FadeIn(lh), run_time=1)
            dg = Line(V[(0, 0, 0)], V[(1, 1, 1)], color=C_COL, stroke_width=5)
            self.play(Create(dg), run_time=1.5)
        fl = DashedLine(V[(0, 0, 0)], V[(1, 1, 0)], color=ORANGE, stroke_width=5)
        st = VGroup(R("רצפה:", "4² + 3² = 25  →  5", size=34, color=ORANGE),
                    R("אלכסון:", "5² + 12² = 169", size=34, color=C_COL),
                    MT("<i>d</i> = √169 = 13", 48, YELLOW)).arrange(DOWN, aligned_edge=RIGHT, buff=0.35).to_edge(RIGHT, buff=0.6).shift(UP * 0.5)
        with self.voice("עושים פיתגורס פעמיים. קודם אלכסון הרצפה: ארבע בריבוע ועוד שלוש בריבוע, עשרים וחמש, אז חמש. "
                        "ואז משולש חדש, עם הגובה: חמש בריבוע ועוד שתים עשרה בריבוע, מאה שישים ותשע. השורש: שלוש עשרה.") as d:
            self.play(Create(fl), FadeIn(st[0]), run_time=2)
            self.wait(2)
            tri = Polygon(V[(0, 0, 0)], V[(1, 1, 0)], V[(1, 1, 1)], color=YELLOW, fill_opacity=0.15, stroke_width=0)
            self.play(FadeIn(tri), FadeIn(st[1]), run_time=2)
            self.wait(1.5)
            self.play(Write(st[2]), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- משפט חפיפה: יתר וניצב ----------
    def congruence(self):
        head = R("משפט חפיפה נוסף:", "צ.צ.ז", size=44).to_edge(UP, buff=0.35)
        def rt(C, sx, color):
            A, B = C + np.array([0, 2.25, 0]), C + np.array([sx * 3.0, 0, 0])
            t = Polygon(A, B, C, color=color, fill_opacity=0.2, stroke_width=4)
            labs = VGroup(T("6", 32, A_COL).next_to(Line(C, A), LEFT if sx > 0 else RIGHT, buff=0.12),
                          T("10", 32, C_COL).move_to((A + B) / 2 + np.array([0.35 * sx, 0.35, 0])))
            third = T("8", 32, B_COL).next_to(Line(C, B), DOWN, buff=0.12)
            return t, right_mark(C, RIGHT * sx, UP, 0.25), labs, third
        t1, m1, l1, x1 = rt(np.array([-6.4, -2.0, 0]), 1, BLUE)
        t2, m2, l2, x2 = rt(np.array([1.0, -2.0, 0]), -1, GREEN)
        with self.voice("לשני משולשים ישרי זווית יש יתר שווה, עשר, וניצב שווה, שש. האם הם חופפים?") as d:
            self.play(Write(head), run_time=1)
            self.play(Create(t1), Create(m1), FadeIn(l1), Create(t2), Create(m2), FadeIn(l2), run_time=2)
        calc = MT("10² − 6² = 64  →  8", 40, B_COL).to_edge(RIGHT, buff=0.5).shift(UP * 2.0)
        rule = VGroup(T("יתר שווה + ניצב שווה", 36, YELLOW), T("← המשולשים חופפים", 36, YELLOW)).arrange(DOWN, aligned_edge=RIGHT, buff=0.2)
        rule.next_to(calc, DOWN, buff=0.6).align_to(calc, RIGHT)
        sub = T("רק במשולשים ישרי זווית!", 30, GREY_B).next_to(rule, DOWN, buff=0.3).align_to(rule, RIGHT)
        with self.voice("לפי פיתגורס, הניצב השלישי בשניהם הוא שמונה. אז כל הצלעות שוות, והם חופפים. "
                        "זה משפט חפיפה מיוחד למשולשים ישרי זווית: יתר וניצב שווים, והמשולשים חופפים.") as d:
            self.play(Write(calc), run_time=1.5)
            self.play(FadeIn(x1), FadeIn(x2), run_time=1)
            self.play(FadeIn(rule), run_time=1.2)
            self.play(FadeIn(sub), run_time=0.8)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- חזרה למגרש ----------
    def finale(self):
        c = court(0.24).to_edge(LEFT, buff=0.4).shift(DOWN * 0.6)
        r = c[0]
        diag = Line(r.get_corner(DL), r.get_corner(UR), color=BALL, stroke_width=6)
        L = R("28", size=30, color=A_COL).next_to(r, DOWN, buff=0.15)
        W = R("15", size=30, color=B_COL).next_to(r, RIGHT, buff=0.15)
        with self.voice("ובחזרה למגרש: האלכסון הוא יתר, והניצבים הם עשרים ושמונה וחמש עשרה.") as d:
            self.play(FadeIn(c), FadeIn(L), FadeIn(W), run_time=1.5)
            self.play(Create(diag), run_time=1.5)
        st = VGroup(MT("<i>d</i>² = 28² + 15²", 44), MT("<i>d</i>² = 784 + 225 = 1009", 44), MT("<i>d</i> = √1009 ≈ 31.8", 50, YELLOW)).arrange(DOWN, aligned_edge=RIGHT, buff=0.35)
        st.to_edge(RIGHT, buff=0.6).shift(UP * 0.8)
        res = R("בערך", "31.8", "מטרים", size=40, color=YELLOW).next_to(st, DOWN, buff=0.5).align_to(st, RIGHT)
        with self.voice("שבע מאות שמונים וארבע, ועוד מאתיים עשרים וחמש: אלף ותשע. השורש, בעזרת מחשבון: בערך שלושים ואחת נקודה שמונה מטרים.") as d:
            self.play(Write(st[0]), run_time=1.2)
            self.play(Write(st[1]), run_time=1.5)
            self.wait(0.5)
            self.play(Write(st[2]), run_time=1.5)
            self.play(FadeIn(res), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- סיכום ----------
    def summary(self):
        head = T("מה למדנו?", 56, font=TITLE).to_edge(UP, buff=0.4)
        law = MT("<i>a</i>² + <i>b</i>² = <i>c</i>²", 60, YELLOW).next_to(head, DOWN, buff=0.4)
        lines = VGroup(
            T("ניצבים יוצרים את הזווית הישרה, היתר מולה", 34),
            T("יתר: מחברים ריבועים ומוציאים שורש", 34),
            T("ניצב: מחסירים ריבועים ומוציאים שורש", 34),
            T("מרחק בין נקודות ואלכסון של תיבה: גם פיתגורס", 34),
        ).arrange(DOWN, aligned_edge=RIGHT, buff=0.3).next_to(law, DOWN, buff=0.5).to_edge(RIGHT, buff=1.5)
        with self.voice("אז מה למדנו? במשולש ישר זווית: איי בריבוע ועוד בי בריבוע שווה סי בריבוע. "
                        "יתר: מחברים ומוציאים שורש. ניצב: מחסירים ומוציאים שורש. וזה עובד גם למרחק בין נקודות, ולאלכסון של תיבה.") as d:
            self.play(Write(head), Write(law), run_time=1.5)
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 4 - 1.6, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
