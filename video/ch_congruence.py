"""סרטון: חפיפת משולשים ותיכון (כיתה ח׳, פרקים 21–24).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_congruence.py Congruence
"""
from common import *

add_pron({"קודקודיות": "קוֹדְקוֹדִיּוֹת"})

OR, BL, GN, PU, RD = ORANGE, BLUE_C, GREEN_C, PURPLE_B, RED_C


def F(s, size=40, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def ang(v):
    return np.arctan2(v[1], v[0])


def wedge(O, A, B, r=0.5, color=OR, op=0.45):
    a1, a2 = ang(A - O), ang(B - O)
    d = (a2 - a1) % TAU
    if d > PI:
        a1, d = a2, TAU - d
    return VGroup(Sector(radius=r, angle=d, start_angle=a1, arc_center=O, fill_color=color, fill_opacity=op, stroke_width=0),
                  Arc(radius=r, angle=d, start_angle=a1, arc_center=O, color=color, stroke_width=3))


def ticks(P, Q, n=1, color=YELLOW, L=0.16):
    m, u = (P + Q) / 2, normalize(Q - P)
    v = rotate_vector(u, PI / 2)
    return VGroup(*[Line(m + u * (k - (n - 1) / 2) * 0.12 - v * L, m + u * (k - (n - 1) / 2) * 0.12 + v * L,
                         color=color, stroke_width=4) for k in range(n)])


def names(pts, letters, size=34, color=WHITE):
    c = sum(pts) / len(pts)
    return VGroup(*[F(l, size, color).move_to(p + 0.4 * normalize(p - c)) for p, l in zip(pts, letters)])


class Congruence(Narrated):
    def construct(self):
        self.story()
        self.meaning()
        self.theorems()
        self.not_theorems()
        self.proof()
        self.median()
        self.summary()

    # ---------- פתיחה: המגרש הסימטרי ----------
    def story(self):
        c = court(0.4).shift(DOWN * 0.3)
        o = c[0]
        L_hoop = c[5].get_center()  # hoop of the left side
        R_hoop = c[10].get_center()
        tl = Polygon(L_hoop, o.get_corner(UL) + RIGHT * 2.2, o.get_corner(DL) + RIGHT * 2.2, color=OR, fill_opacity=0.35, stroke_width=4)
        tr = Polygon(R_hoop, o.get_corner(UR) + LEFT * 2.2, o.get_corner(DR) + LEFT * 2.2, color=BL, fill_opacity=0.35, stroke_width=4)
        with self.voice("בוא נסתכל שוב על מגרש הכדורסל. נצייר משולש בצד שמאל של המגרש, ומשולש דומה לו בצד ימין.") as d:
            self.play(Create(c, lag_ratio=0.1), run_time=2)
            self.play(DrawBorderThenFill(tl), DrawBorderThenFill(tr), run_time=2)
        cp = tl.copy()
        with self.voice("האם הם בדיוק אותו דבר? בוא נקפל את המגרש לאורך קו האמצע. "
                        "המשולש הכתום נוחת בדיוק על הכחול!") as d:
            self.play(Rotate(cp, PI, axis=UP, about_point=o.get_center()), run_time=3)
            self.play(Indicate(tr, color=YELLOW, scale_factor=1.08), run_time=1.2)
        title = T("חפיפת משולשים", 60, font=TITLE).to_edge(UP, buff=0.25)
        with self.voice("משולשים כאלה נקראים משולשים חופפים. וזה הנושא שלנו היום.") as d:
            self.play(FadeOut(VGroup(c, tl, tr, cp)), run_time=1)
            self.play(Write(title), run_time=1.5)
        self.play(FadeOut(title))

    # ---------- מה זה חופפים, והכתיב ----------
    def meaning(self):
        P = [np.array(p) for p in ([-6, -1.8, 0], [-2.6, -1.8, 0], [-5.0, 1.2, 0])]
        t1 = Polygon(*P, color=RD, fill_opacity=0.25, stroke_width=4)
        n1 = names(P, "ABC", 36, RD)
        t2 = t1.copy().set_color(BL).set_fill(BL, 0.25).rotate(140 * DEGREES).shift(RIGHT * 6.8 + UP * 0.1)
        Q = t2.get_vertices()
        n2 = names(list(Q), "DEF", 36, BL)
        with self.voice("משולשים חופפים הם משולשים עם אותה צורה ואותו גודל. "
                        "אפשר להזיז, לסובב, ואפילו להפוך אחד מהם, עד שהוא יושב בדיוק על השני.") as d:
            self.play(Create(t1), FadeIn(n1), run_time=1.2)
            self.play(Create(t2), FadeIn(n2), run_time=1.2)
            g = VGroup(t2.copy(), *[m.copy() for m in n2])
            self.play(g.animate.shift(np.array(P[0]) - Q[0]), run_time=1.8)
            self.play(Rotate(g, -140 * DEGREES, about_point=P[0]), run_time=2)
            self.play(FadeOut(g), run_time=0.6)
        sides1 = VGroup(*[Line(P[i], P[(i + 1) % 3], color=col, stroke_width=8) for i, col in zip(range(3), (OR, GN, PU))])
        sides2 = VGroup(*[Line(Q[i], Q[(i + 1) % 3], color=col, stroke_width=8) for i, col in zip(range(3), (OR, GN, PU))])
        w1 = VGroup(*[wedge(P[i], P[(i + 1) % 3], P[(i + 2) % 3], 0.45, col) for i, col in zip(range(3), (YELLOW, TEAL, PINK))])
        w2 = VGroup(*[wedge(Q[i], Q[(i + 1) % 3], Q[(i + 2) % 3], 0.45, col) for i, col in zip(range(3), (YELLOW, TEAL, PINK))])
        with self.voice("ולכן, במשולשים חופפים, כל שלוש הצלעות שוות, וכל שלוש הזוויות שוות. "
                        "שש התאמות!") as d:
            for i in range(3):
                self.play(Create(sides1[i]), Create(sides2[i]), run_time=0.8)
            for i in range(3):
                self.play(FadeIn(w1[i]), FadeIn(w2[i]), run_time=0.7)
        note = F("△ABC ≅ △DEF", 56).move_to([0, 3.25, 0])
        arrows = VGroup()
        with self.voice("כותבים את זה כך: משולש איי בי סי חופף למשולש די אי אף. "
                        "והסדר חשוב! האות הראשונה מתאימה לראשונה, השנייה לשנייה, והשלישית לשלישית.") as d:
            self.play(Write(note), run_time=2)
            pairs = [("A", "D"), ("B", "E"), ("C", "F")]
            for k, col in zip(range(3), (YELLOW, TEAL, PINK)):
                self.play(Indicate(n1[k], color=col, scale_factor=1.6), Indicate(n2[k], color=col, scale_factor=1.6), run_time=1)
        rule = VGroup(F("AB = DE", 36, OR), F("BC = EF", 36, GN), F("∠A = ∠D", 36, YELLOW)).arrange(RIGHT, buff=0.8).to_edge(DOWN, buff=0.4)
        with self.voice("כך יודעים מי שווה למי: איי בי שווה לדי אי, בי סי שווה לאי אף, וזווית איי שווה לזווית די.") as d:
            for m in rule:
                self.play(FadeIn(m, shift=UP * 0.2), run_time=1)
                self.wait(0.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- משפטי החפיפה ----------
    def theorems(self):
        head = T("לא צריך לבדוק את כל השש. מספיקים שלושה נתונים", 40).to_edge(UP, buff=0.35)
        with self.voice("אבל לבדוק שש התאמות זה הרבה עבודה. החדשות הטובות: מספיקים שלושה נתונים מתאימים. "
                        "יש שלושה משפטי חפיפה.") as d:
            self.play(Write(head), run_time=2.5)

        # צ.ז.צ — ציר עם שתי צלעות קבועות
        A = np.array([-6.3, -2.2, 0])
        th = ValueTracker(80)
        B = A + RIGHT * 3.6
        Cp = lambda: A + 2.6 * np.array([np.cos(np.radians(th.get_value())), np.sin(np.radians(th.get_value())), 0])
        ab = Line(A, B, color=OR, stroke_width=7)
        ac = always_redraw(lambda: Line(A, Cp(), color=OR, stroke_width=7))
        bc = always_redraw(lambda: DashedLine(B, Cp(), color=GREY_B, stroke_width=4))
        wa = always_redraw(lambda: wedge(A, B, Cp(), 0.5, YELLOW))
        t1 = T("צ.ז.צ", 48, OR).move_to([-4.5, 2.0, 0])
        s1 = VGroup(T("שתי צלעות", 28, OR), T("והזווית שביניהן", 28, OR)).arrange(DOWN, buff=0.12).next_to(t1, DOWN, buff=0.2)
        with self.voice("משפט ראשון: צלע זווית צלע. קח שתי צלעות עם אורך קבוע, שמחוברות בציר. "
                        "כל עוד הזווית ביניהן משתנה, המשולש משתנה. אבל ברגע שקובעים את הזווית, "
                        "הצלע השלישית נקבעת. אין ברירה!") as d:
            self.play(Write(t1), FadeIn(s1), Create(ab), Create(ac), run_time=1.5)
            self.add(bc, wa)
            self.play(th.animate.set_value(30), run_time=2)
            self.play(th.animate.set_value(110), run_time=2)
            self.play(th.animate.set_value(60), run_time=1.5)
            ac.clear_updaters(); bc.clear_updaters(); wa.clear_updaters()
            self.play(bc.animate.set_color(WHITE), run_time=0.5)

        # ז.צ.ז — שתי קרניים נפגשות בנקודה אחת
        A2, B2 = np.array([-1.7, -2.2, 0]), np.array([1.7, -2.2, 0])
        ra = Line(A2, A2 + 4.5 * np.array([np.cos(np.radians(55)), np.sin(np.radians(55)), 0]), color=BL, stroke_width=5)
        rb = Line(B2, B2 + 4.5 * np.array([np.cos(np.radians(130)), np.sin(np.radians(130)), 0]), color=BL, stroke_width=5)
        C2 = line_intersection([ra.get_start(), ra.get_end()], [rb.get_start(), rb.get_end()])
        base2 = Line(A2, B2, color=BL, stroke_width=7)
        t2 = T("ז.צ.ז", 48, BL).move_to([0, 2.0, 0])
        s2 = VGroup(T("שתי זוויות", 28, BL), T("והצלע שביניהן", 28, BL)).arrange(DOWN, buff=0.12).next_to(t2, DOWN, buff=0.2)
        with self.voice("משפט שני: זווית צלע זווית. יש צלע, ובשני הקצוות שלה זווית. "
                        "שתי הקרניים נפגשות בנקודה אחת בלבד, ולכן גם כאן יש רק משולש אחד.") as d:
            self.play(Write(t2), FadeIn(s2), Create(base2), run_time=1.5)
            self.play(FadeIn(wedge(A2, B2, ra.get_end(), 0.5, YELLOW)), FadeIn(wedge(B2, A2, rb.get_end(), 0.5, YELLOW)), run_time=1)
            self.play(Create(ra), Create(rb), run_time=2)
            self.play(Flash(C2, color=YELLOW), FadeIn(Dot(C2, color=YELLOW)), run_time=1)

        # צ.צ.צ — מחוגה
        A3, B3 = np.array([2.7, -2.2, 0]), np.array([6.3, -2.2, 0])
        r1, r2 = 2.8, 2.5
        x = (r1 ** 2 - r2 ** 2 + 3.6 ** 2) / (2 * 3.6)
        C3 = A3 + np.array([x, np.sqrt(r1 ** 2 - x ** 2), 0])
        a1 = Arc(radius=r1, start_angle=40 * DEGREES, angle=60 * DEGREES, arc_center=A3, color=GN, stroke_width=3)
        a2 = Arc(radius=r2, start_angle=80 * DEGREES, angle=60 * DEGREES, arc_center=B3, color=GN, stroke_width=3)
        base3 = Line(A3, B3, color=GN, stroke_width=7)
        t3 = T("צ.צ.צ", 48, GN).move_to([4.5, 2.0, 0])
        s3 = T("שלוש צלעות", 28, GN).next_to(t3, DOWN, buff=0.2)
        with self.voice("ומשפט שלישי: צלע צלע צלע. אם יודעים את שלוש הצלעות, הקשתות נפגשות בנקודה אחת, "
                        "ויוצא משולש אחד בלבד.") as d:
            self.play(Write(t3), FadeIn(s3), Create(base3), run_time=1.5)
            self.play(Create(a1), Create(a2), run_time=2)
            self.play(Create(Line(A3, C3, color=GN, stroke_width=7)), Create(Line(B3, C3, color=GN, stroke_width=7)), Flash(C3, color=YELLOW), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- מה לא עובד ----------
    def not_theorems(self):
        head = T("זהירות: צ.צ.ז הוא לא משפט חפיפה!", 44, RD).to_edge(UP, buff=0.4)
        A = np.array([-5.5, -2.4, 0])
        B = A + RIGHT * 6
        u = np.array([np.cos(np.radians(30)), np.sin(np.radians(30)), 0])
        r = 3.6
        # BC = r: t^2 - 2*6*cos30*t + 36 - r^2 = 0
        q = 12 * np.cos(np.radians(30))
        ts = [(q - np.sqrt(q * q - 4 * (36 - r * r))) / 2, (q + np.sqrt(q * q - 4 * (36 - r * r))) / 2]
        C1, C2 = A + ts[0] * u, A + ts[1] * u
        ray = Line(A, A + 9 * u, color=GREY_B, stroke_width=3)
        ab = Line(A, B, color=WHITE, stroke_width=6)
        circ = Arc(radius=r, start_angle=95 * DEGREES, angle=75 * DEGREES, arc_center=B, color=YELLOW, stroke_width=3)
        T1 = Polygon(A, B, C1, color=OR, fill_opacity=0.35, stroke_width=4)
        T2 = Polygon(A, B, C2, color=BL, fill_opacity=0.25, stroke_width=4)
        wa = wedge(A, B, A + u, 0.8, YELLOW)
        lab = VGroup(F("A", 34).next_to(A, DL, buff=0.1), F("B", 34).next_to(B, DR, buff=0.1),
                     F("30°", 30, YELLOW).move_to(A + 1.25 * normalize(u + RIGHT)))
        with self.voice("ועכשיו זהירות. מה אם הזווית לא נמצאת בין שתי הצלעות? "
                        "כאן נתונות הצלע איי בי, הזווית איי, והצלע בי סי.") as d:
            self.play(Write(head), Create(ab), FadeIn(lab[:2]), run_time=2)
            self.play(Create(ray), FadeIn(wa), FadeIn(lab[2]), run_time=1.5)
            self.play(Create(circ), run_time=1.5)
        with self.voice("הקשת של בי סי פוגשת את הקרן בשתי נקודות! אז יש שני משולשים שונים, עם אותם שלושה נתונים. "
                        "ולכן צלע צלע זווית הוא לא משפט חפיפה.") as d:
            self.play(Flash(C1, color=OR), Flash(C2, color=BL), run_time=1)
            self.play(DrawBorderThenFill(T1), run_time=1.5)
            self.play(DrawBorderThenFill(T2), run_time=1.5)
            self.play(Wiggle(VGroup(T1, T2)), run_time=1.5)
        self.play(FadeOut(VGroup(ray, ab, circ, T1, T2, wa, lab)), FadeOut(head))
        head2 = T("וגם ז.ז.ז הוא לא משפט חפיפה", 44, RD).to_edge(UP, buff=0.4)
        small = Polygon([-5, -2, 0], [-3, -2, 0], [-4.3, -0.4, 0], color=OR, fill_opacity=0.35, stroke_width=4)
        big = small.copy().set_color(BL).set_fill(BL, 0.25).scale(2.2).move_to([2, -0.3, 0])
        with self.voice("וגם שלוש זוויות לא מספיקות. אותה צורה, אבל גודל אחר. אלה לא משולשים חופפים.") as d:
            self.play(Write(head2), DrawBorderThenFill(small), run_time=1.5)
            self.play(TransformFromCopy(small, big), run_time=2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- הוכחה: טענה ונימוק ----------
    def proof(self):
        A, D = np.array([-6.2, 1.8, 0]), np.array([-1.8, -2.2, 0])
        B, C = np.array([-5.6, -2.4, 0]), np.array([-2.4, 2.0, 0])
        O = (A + D) / 2
        C = 2 * O - B
        fig = VGroup(Line(A, D, color=BL, stroke_width=5), Line(B, C, color=BL, stroke_width=5),
                     Line(A, B, color=WHITE, stroke_width=4), Line(D, C, color=WHITE, stroke_width=4))
        labs = VGroup(F("A", 32).next_to(A, UL, buff=0.1), F("B", 32).next_to(B, DL, buff=0.1),
                      F("C", 32).next_to(C, UR, buff=0.1), F("D", 32).next_to(D, DR, buff=0.1), F("O", 32).next_to(O, RIGHT, buff=0.25))
        given = R("נתון:", "O", "אמצע", "AD", "וגם אמצע", "BC", size=30).move_to([2.8, 3.2, 0])
        goal = R("להוכיח:", "△AOB ≅ △DOC", size=30, color=YELLOW).next_to(given, DOWN, buff=0.2)
        with self.voice("עכשיו נכתוב הוכחה ראשונה. שני קטעים נחתכים בנקודה או. "
                        "נתון שאו היא האמצע של שניהם. צריך להוכיח שהמשולשים איי או בי ודי או סי חופפים.") as d:
            self.play(Create(fig), FadeIn(labs), run_time=2)
            self.play(FadeIn(given), run_time=1)
            self.play(FadeIn(goal), run_time=1)
        # טבלה: עמודה ימנית "טענה", שמאלית "נימוק"
        x0, x1, x2 = -0.6, 3.2, 6.6
        top, rh = 2.2, 0.72
        n = 5
        grid = VGroup(*[Line([x0, top - k * rh, 0], [x2, top - k * rh, 0], color=GREY_C, stroke_width=2) for k in range(n + 2)],
                      *[Line([x, top, 0], [x, top - (n + 1) * rh, 0], color=GREY_C, stroke_width=2) for x in (x0, x1, x2)])
        hdr = VGroup(T("טענה", 30, GREY_A).move_to([(x1 + x2) / 2, top - rh / 2, 0]), T("נימוק", 30, GREY_A).move_to([(x0 + x1) / 2, top - rh / 2, 0]))
        rows = [("AO = DO", "נתון", "AO DO"), ("BO = CO", "נתון", "BO CO"), ("∠AOB = ∠DOC", "זוויות קודקודיות", "ang"),
                ("△AOB ≅ △DOC", "צ.ז.צ", "tri"), ("AB = DC", "צלעות מתאימות", "AB")]
        cells = []
        for k, (cl, why, _) in enumerate(rows):
            y = top - (k + 1.5) * rh
            cells.append((F(cl, 28).move_to([(x1 + x2) / 2, y, 0]), T(why, 26, YELLOW).move_to([(x0 + x1) / 2, y, 0])))
        t1, t2 = ticks(A, O, 1), ticks(O, D, 1)
        t3, t4 = ticks(B, O, 2), ticks(O, C, 2)
        wo1, wo2 = wedge(O, A, B, 0.45, OR), wedge(O, D, C, 0.45, OR)
        with self.voice("בונים טבלה עם שתי עמודות: טענה, ונימוק. "
                        "שורה ראשונה: איי או שווה לדי או. הנימוק: נתון, כי או אמצע איי די.") as d:
            self.play(Create(grid), FadeIn(hdr), run_time=1.5)
            self.play(FadeIn(cells[0][0]), Create(t1), Create(t2), run_time=1.2)
            self.play(FadeIn(cells[0][1]), run_time=0.8)
        with self.voice("שורה שנייה: בי או שווה לסי או. גם זה נתון.") as d:
            self.play(FadeIn(cells[1][0]), Create(t3), Create(t4), run_time=1.2)
            self.play(FadeIn(cells[1][1]), run_time=0.8)
        with self.voice("שורה שלישית: הזוויות ליד או שוות. הנימוק: הן זוויות קודקודיות.") as d:
            self.play(FadeIn(cells[2][0]), FadeIn(wo1), FadeIn(wo2), run_time=1.2)
            self.play(FadeIn(cells[2][1]), run_time=0.8)
        tri1 = Polygon(A, O, B, color=OR, fill_opacity=0.3, stroke_width=0)
        tri2 = Polygon(D, O, C, color=OR, fill_opacity=0.3, stroke_width=0)
        with self.voice("יש לנו שתי צלעות, והזווית שביניהן. לכן המשולשים חופפים, לפי צלע זווית צלע.") as d:
            self.play(FadeIn(tri1), FadeIn(tri2), run_time=1)
            self.play(FadeIn(cells[3][0]), run_time=1)
            self.play(FadeIn(cells[3][1]), run_time=0.8)
        ab, dc = Line(A, B, color=GN, stroke_width=8), Line(D, C, color=GN, stroke_width=8)
        with self.voice("ועכשיו בונוס: מהחפיפה נובע שגם איי בי שווה לדי סי. "
                        "הנימוק: צלעות מתאימות במשולשים חופפים.") as d:
            self.play(Create(ab), Create(dc), FadeIn(cells[4][0]), run_time=1.5)
            self.play(FadeIn(cells[4][1]), run_time=0.8)
        self.wait(0.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- תיכון ----------
    def median(self):
        A, B, C = np.array([-5.0, 2.4, 0]), np.array([-6.4, -2.4, 0]), np.array([-0.6, -2.4, 0])
        M = (B + C) / 2
        tri = Polygon(A, B, C, color=WHITE, stroke_width=4)
        labs = VGroup(F("A", 34).next_to(A, UP, buff=0.12), F("B", 34).next_to(B, DL, buff=0.1),
                      F("C", 34).next_to(C, DR, buff=0.1))
        mlab = F("M", 34, RD).next_to(M, DOWN, buff=0.15)
        med = Line(A, M, color=RD, stroke_width=6)
        head = T("תיכון", 52, RD).move_to([3.4, 2.6, 0])
        d1 = T("קטע מקודקוד לאמצע הצלע שמולו", 32).next_to(head, DOWN, buff=0.3)
        with self.voice("ונסיים עם מושג חדש: תיכון. תיכון הוא קטע שיוצא מקודקוד, ומגיע בדיוק לאמצע של הצלע שמולו.") as d:
            self.play(Create(tri), FadeIn(labs), run_time=1.5)
            self.play(Write(head), FadeIn(d1), run_time=1.5)
            self.play(FadeIn(Dot(M, color=RD)), FadeIn(mlab), Create(med), run_time=1.5)
        tk = VGroup(ticks(B, M, 1), ticks(M, C, 1))
        eq = F("BM = MC", 40, YELLOW).next_to(d1, DOWN, buff=0.45)
        with self.voice("לכן התיכון מחלק את הצלע לשני חלקים שווים: בי אם שווה לאם סי.") as d:
            self.play(Create(tk), run_time=1)
            self.play(Write(eq), run_time=1.5)
        h1 = Polygon(A, B, M, color=OR, fill_opacity=0.45, stroke_width=0)
        h2 = Polygon(A, M, C, color=BL, fill_opacity=0.45, stroke_width=0)
        foot = np.array([A[0], B[1], 0])
        hgt = DashedLine(A, foot, color=GREY_B, stroke_width=3)
        area = T("שני החלקים שווים בשטח", 34, GN).next_to(eq, DOWN, buff=0.45)
        with self.voice("ועוד דבר מעניין: לשני המשולשים הקטנים יש בסיס שווה ואותו גובה. "
                        "לכן התיכון מחלק את המשולש לשני חלקים עם שטח שווה.") as d:
            self.play(FadeIn(h1), FadeIn(h2), run_time=1)
            self.play(Create(hgt), run_time=1)
            self.play(FadeIn(area, shift=UP * 0.2), run_time=1)
        self.play(FadeOut(VGroup(h1, h2, hgt, area, eq, tk, d1)), run_time=0.8)
        # במערכת צירים
        self.play(FadeOut(VGroup(tri, labs, mlab, med)), *[FadeOut(m) for m in self.mobjects if isinstance(m, Dot)], run_time=0.8)
        plane = NumberPlane(x_range=[-5, 5], y_range=[-5, 5], x_length=5.6, y_length=5.6,
                            background_line_style={"stroke_color": GREY_D, "stroke_opacity": 0.6},
                            axis_config={"stroke_color": GREY_B}).move_to([-3.6, -0.4, 0])
        pB, pC, pM = plane.c2p(-4, -2), plane.c2p(2, 4), plane.c2p(-1, 1)
        bc = Line(pB, pC, color=WHITE, stroke_width=4)
        dots = VGroup(Dot(pB), Dot(pC))
        plabs = VGroup(F("B(−4, −2)", 28).next_to(pB, DOWN, buff=0.15), F("C(2, 4)", 28).next_to(pC, RIGHT, buff=0.15))
        mx = F("<i>x</i> = (−4 + 2) ÷ 2 = −1", 34, YELLOW)
        my = F("<i>y</i> = (−2 + 4) ÷ 2 = 1", 34, YELLOW)
        mm = F("M(−1, 1)", 40, RD)
        VGroup(mx, my, mm).arrange(DOWN, buff=0.3).next_to(head, DOWN, buff=0.8)
        with self.voice("ובמערכת צירים? אמצע של קטע הוא פשוט הממוצע. "
                        "מחברים את שני האיקסים ומחלקים בשתיים, ואותו דבר עם הוואי.") as d:
            self.play(Create(plane), run_time=1)
            self.play(Create(bc), FadeIn(dots), FadeIn(plabs), run_time=1)
            self.play(Write(mx), run_time=1.5)
            self.play(Write(my), run_time=1.5)
            self.play(Write(mm), FadeIn(Dot(pM, color=RD, radius=0.12)), Flash(pM, color=RD), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- סיכום ----------
    def summary(self):
        head = T("מה למדנו?", 56, font=TITLE).to_edge(UP, buff=0.4)
        lines = VGroup(
            T("חופפים = אותה צורה ואותו גודל, כל ההתאמות שוות", 34),
            R("בכתיב", "△ABC ≅ △DEF", "הסדר קובע מי מתאים למי", size=34, color=YELLOW),
            T("משפטים: צ.ז.צ, ז.צ.ז, צ.צ.צ   (לא צ.צ.ז ולא ז.ז.ז)", 34, GN),
            T("הוכחה = טבלה של טענה ונימוק", 34, BL),
            T("תיכון = מקודקוד לאמצע הצלע שמולו", 34, RD),
        ).arrange(DOWN, buff=0.38, aligned_edge=RIGHT).next_to(head, DOWN, buff=0.5)
        with self.voice("אז מה למדנו? משולשים חופפים הם באותה צורה ובאותו גודל. בכתיב, הסדר של האותיות קובע מי מתאים למי. "
                        "שלושת משפטי החפיפה: צלע זווית צלע, זווית צלע זווית, וצלע צלע צלע. "
                        "הוכחה כותבים בטבלה של טענה ונימוק. ותיכון מחבר קודקוד לאמצע הצלע שמולו.") as d:
            self.play(Write(head), run_time=1)
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 5 - 1.3, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, BALL).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! בכלים תוכל להניח משולש על משולש, ולגלות בעצמך למה צלע צלע זווית לא עובד. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
