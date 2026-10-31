"""סרטון: משולש שווה שוקיים (כיתה ח׳, כרך ב׳ פרקים 15–16).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_isosceles.py Isosceles
"""
from common import *

add_pron({"שווה שוקיים": "שְׁוֵה שׁוֹקַיִם", "שוקיים": "שׁוֹקַיִם", "השוקיים": "הַשּׁוֹקַיִם", "חוצה": "חוֹצֶה",
          "גובה": "גֹּבַהּ", "הגובה": "הַגֹּבַהּ"})

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


def wlabel(O, A, B, txt, r=0.5, color=OR, size=28):
    u = normalize(A - O) + normalize(B - O)
    m = F(txt, size, color)
    return m.move_to(O + (r + 0.2 + 0.5 * max(m.width, m.height)) * normalize(u))


def ticks(P, Q, n=1, color=YELLOW, L=0.16):
    m, u = (P + Q) / 2, normalize(Q - P)
    v = rotate_vector(u, PI / 2)
    return VGroup(*[Line(m + u * (k - (n - 1) / 2) * 0.12 - v * L, m + u * (k - (n - 1) / 2) * 0.12 + v * L,
                         color=color, stroke_width=4) for k in range(n)])


def deg(O, A, B):
    d = abs(ang(A - O) - ang(B - O)) % TAU
    return np.degrees(min(d, TAU - d))


class Isosceles(Narrated):
    def construct(self):
        self.story()
        self.names()
        self.base_angles()
        self.three_in_one()
        self.equilateral()
        self.example()
        self.mistake()
        self.summary()

    # ---------- פתיחה: שני שחקנים על קשת השלוש ----------
    def story(self):
        c = court(0.42).shift(DOWN * 0.3)
        hoop = c[5].get_center()
        with self.voice("תסתכל על הסל ועל קשת השלוש. כל הנקודות על הקשת נמצאות באותו מרחק מהסל.") as d:
            self.play(Create(c, lag_ratio=0.1), run_time=2)
            self.play(Indicate(c[6], color=YELLOW, scale_factor=1.03), Flash(hoop, color=BALL), run_time=1.5)
        arc = c[6]
        p1, p2 = arc.point_from_proportion(0.28), arc.point_from_proportion(0.62)
        s1, s2 = Dot(p1, color=BL, radius=0.15), Dot(p2, color=BL, radius=0.15)
        l1, l2 = Line(hoop, p1, color=YELLOW, stroke_width=5), Line(hoop, p2, color=YELLOW, stroke_width=5)
        base = Line(p1, p2, color=WHITE, stroke_width=5)
        tk = VGroup(ticks(hoop, p1, 1, RD), ticks(hoop, p2, 1, RD))
        with self.voice("עכשיו שני שחקנים עומדים על הקשת. נחבר אותם לסל ונחבר אותם זה לזה. "
                        "קיבלנו משולש עם שתי צלעות שוות: משולש שווה שוקיים.") as d:
            self.play(FadeIn(s1, scale=2), FadeIn(s2, scale=2), run_time=1)
            self.play(Create(l1), Create(l2), run_time=1.5)
            self.play(Create(base), Create(tk), run_time=1.5)
            cen = (hoop + p1 + p2) / 3
            self.play(VGroup(c, s1, s2, l1, l2, base, tk).animate.scale(2.2, about_point=cen).shift(-cen + DOWN * 0.2), run_time=1.5)
        title = T("משולש שווה שוקיים", 60, font=TITLE).to_edge(UP, buff=0.25)
        with self.voice("למשולש הזה יש תכונות מיוחדות מאוד. בוא נגלה אותן.") as d:
            self.play(FadeOut(VGroup(c, s1, s2, l1, l2, base, tk)), run_time=1)
            self.play(Write(title), run_time=1.5)
        self.play(FadeOut(title))

    # ---------- שמות ----------
    def names(self):
        A, B, C = np.array([-3.0, 2.4, 0]), np.array([-5.6, -2.4, 0]), np.array([-0.4, -2.4, 0])
        tri = Polygon(A, B, C, color=WHITE, stroke_width=4)
        lab = VGroup(F("A", 36).next_to(A, UP, buff=0.12), F("B", 36).next_to(B, DL, buff=0.1), F("C", 36).next_to(C, DR, buff=0.1))
        legs = VGroup(Line(A, B, color=YELLOW, stroke_width=8), Line(A, C, color=YELLOW, stroke_width=8))
        tk = VGroup(ticks(A, B, 1, RD), ticks(A, C, 1, RD))
        baseL = Line(B, C, color=BL, stroke_width=8)
        t1 = T("שוקיים: שתי הצלעות השוות", 36, YELLOW).move_to([3.4, 1.8, 0])
        t2 = T("בסיס: הצלע השלישית", 36, BL).next_to(t1, DOWN, buff=0.4)
        t3 = T("זווית הראש: בין השוקיים", 36, OR).next_to(t2, DOWN, buff=0.4)
        t4 = T("זוויות הבסיס: ליד הבסיס", 36, PU).next_to(t3, DOWN, buff=0.4)
        wA = wedge(A, B, C, 0.6, OR)
        wB, wC = wedge(B, A, C, 0.6, PU), wedge(C, A, B, 0.6, PU)
        with self.voice("קצת שמות. שתי הצלעות השוות נקראות שוקיים. והצלע השלישית נקראת בסיס.") as d:
            self.play(Create(tri), FadeIn(lab), run_time=1.2)
            self.play(Create(legs), Create(tk), FadeIn(t1), run_time=1.5)
            self.play(Create(baseL), FadeIn(t2), run_time=1.2)
        with self.voice("הזווית שבין השוקיים נקראת זווית הראש. ושתי הזוויות ליד הבסיס נקראות זוויות הבסיס.") as d:
            self.play(FadeIn(wA), FadeIn(t3), run_time=1.2)
            self.play(FadeIn(wB), FadeIn(wC), FadeIn(t4), run_time=1.2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- זוויות הבסיס שוות ----------
    def base_angles(self):
        hy = ValueTracker(2.4)
        B, C = np.array([-5.6, -2.4, 0]), np.array([-0.4, -2.4, 0])
        Ax = (B[0] + C[0]) / 2
        Af = lambda: np.array([Ax, hy.get_value(), 0])
        tri = always_redraw(lambda: Polygon(Af(), B, C, color=WHITE, stroke_width=4, fill_color=OR, fill_opacity=0.12))
        wB = always_redraw(lambda: wedge(B, Af(), C, 0.6, PU))
        wC = always_redraw(lambda: wedge(C, Af(), B, 0.6, PU))
        lB = always_redraw(lambda: wlabel(B, Af(), C, f"{round(deg(B, Af(), C))}°", 0.6, PU))
        lC = always_redraw(lambda: wlabel(C, Af(), B, f"{round(deg(C, Af(), B))}°", 0.6, PU))
        tk = always_redraw(lambda: VGroup(ticks(Af(), B, 1, RD), ticks(Af(), C, 1, RD)))
        rule = T("זוויות הבסיס שוות!", 46, PU).move_to([3.4, 1.6, 0])
        with self.voice("תכונה ראשונה. בוא נמדוד את זוויות הבסיס. נזיז את הקודקוד למעלה ולמטה, "
                        "אבל נשמור שהשוקיים יישארו שוות. שים לב: שתי זוויות הבסיס תמיד שוות!") as d:
            self.play(Create(tri), FadeIn(tk), run_time=1)
            self.add(wB, wC, lB, lC)
            self.play(hy.animate.set_value(0.2), run_time=2)
            self.play(hy.animate.set_value(3.2), run_time=2.5)
            self.play(hy.animate.set_value(1.6), run_time=1.5)
            self.play(Write(rule), run_time=1.2)
        A = Af()
        for m in (tri, wB, wC, lB, lC, tk):
            m.clear_updaters()
        axis = DashedLine(A + UP * 0.4, [Ax, B[1] - 0.4, 0], color=YELLOW, stroke_width=4)
        left = VGroup(Polygon(A, B, [Ax, B[1], 0], color=OR, fill_opacity=0.35, stroke_width=0), wB.copy())
        why = T("כי אפשר לקפל: חצי אחד נוחת על השני", 28, YELLOW).next_to(rule, DOWN, buff=0.4)
        with self.voice("למה? כי אפשר לקפל את המשולש לאורך הקו האמצעי. "
                        "החצי השמאלי נוחת בדיוק על הימני, וזווית בי נוחתת על זווית סי.") as d:
            self.play(Create(axis), FadeIn(why), run_time=1.5)
            self.play(FadeIn(left), run_time=0.6)
            self.play(Rotate(left, PI, axis=UP, about_point=np.array([Ax, 0, 0])), run_time=2.5)
            self.play(FadeOut(left), run_time=0.6)
        formula = VGroup(T("איך מחשבים זווית בסיס?", 30, PU), R("מחסירים את זווית הראש מ־", "180", size=30, color=PU, buff=0.08),
                         R("ומחלקים ב־", "2", size=30, color=PU, buff=0.08)).arrange(DOWN, buff=0.15)
        formula.next_to(why, DOWN, buff=0.6)
        ex = F("(180° − 40°) ÷ 2 = 70°", 36, WHITE).next_to(formula, DOWN, buff=0.35)
        with self.voice("ולכן, אם יודעים את זווית הראש, מחסירים אותה ממאה שמונים, ומחלקים בשתיים. "
                        "למשל, זווית ראש של ארבעים: מאה וארבעים, חלקי שתיים, שבעים מעלות לכל זווית בסיס.") as d:
            self.play(FadeIn(formula), run_time=1.5)
            self.wait(1.5)
            self.play(Write(ex), run_time=2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- תיכון = גובה = חוצה זווית ----------
    def three_in_one(self):
        A, B, C = np.array([-3.0, 2.6, 0]), np.array([-5.8, -2.4, 0]), np.array([-0.2, -2.4, 0])
        D = (B + C) / 2
        tri = Polygon(A, B, C, color=WHITE, stroke_width=4)
        lab = VGroup(F("A", 34).next_to(A, UP, buff=0.12), F("B", 34).next_to(B, DL, buff=0.1),
                     F("C", 34).next_to(C, DR, buff=0.1), F("D", 34).next_to(D, DOWN, buff=0.15))
        tk = VGroup(ticks(A, B, 1, RD), ticks(A, C, 1, RD))
        seg = Line(A, D, color=YELLOW, stroke_width=6)
        head = T("תכונה שנייה: שלושה בקטע אחד", 40, YELLOW).move_to([3.3, 2.7, 0])
        with self.voice("תכונה שנייה, והיא מפתיעה. נעביר קטע מזווית הראש אל אמצע הבסיס. זה הקו שלאורכו קיפלנו.") as d:
            self.play(Create(tri), FadeIn(lab[:3]), Create(tk), run_time=1.5)
            self.play(Write(head), run_time=1.5)
            self.play(Create(seg), FadeIn(lab[3]), run_time=1.2)
        r1 = T("תיכון: מגיע לאמצע הבסיס", 32, RD).move_to([3.3, 1.5, 0])
        r2 = T("גובה: ניצב לבסיס", 32, BL).next_to(r1, DOWN, buff=0.4)
        r3 = T("חוצה זווית: חוצה את זווית הראש", 32, GN).next_to(r2, DOWN, buff=0.4)
        mt = VGroup(ticks(B, D, 2, RD), ticks(D, C, 2, RD))
        sq = RightAngle(Line(D, C), Line(D, A), length=0.35, color=BL, stroke_width=4)
        w1, w2 = wedge(A, B, D, 0.8, GN), wedge(A, D, C, 0.95, GN)
        with self.voice("הקטע הזה הוא תיכון, כי הוא מגיע לאמצע הבסיס. הוא גם גובה, כי הוא ניצב לבסיס. "
                        "והוא גם חוצה זווית, כי הוא חוצה את זווית הראש לשני חלקים שווים. שלושה בקטע אחד!") as d:
            self.play(Create(mt), FadeIn(r1), run_time=1.5)
            self.wait(0.5)
            self.play(Create(sq), FadeIn(r2), run_time=1.5)
            self.wait(0.5)
            self.play(FadeIn(w1), FadeIn(w2), FadeIn(r3), run_time=1.5)
        self.play(FadeOut(VGroup(tri, lab, tk, seg, mt, sq, w1, w2)), run_time=0.8)
        # השוואה: משולש רגיל
        A2, B2, C2 = np.array([-4.6, 2.4, 0]), np.array([-6.2, -2.4, 0]), np.array([-0.4, -2.4, 0])
        tri2 = Polygon(A2, B2, C2, color=WHITE, stroke_width=4)
        M2 = (B2 + C2) / 2
        H2 = np.array([A2[0], B2[1], 0])
        b, c = np.linalg.norm(A2 - B2), np.linalg.norm(A2 - C2)
        D2 = B2 + b / (b + c) * (C2 - B2)
        lines = VGroup(Line(A2, M2, color=RD, stroke_width=5), DashedLine(A2, H2, color=BL, stroke_width=5), Line(A2, D2, color=GN, stroke_width=5))
        note = T("במשולש רגיל — שלושה קטעים שונים", 32, GREY_A).next_to(r3, DOWN, buff=0.6)
        with self.voice("ובמשולש רגיל, שאינו שווה שוקיים? שם אלה שלושה קטעים שונים. "
                        "רק במשולש שווה שוקיים הם מתלכדים לקטע אחד.") as d:
            self.play(Create(tri2), run_time=1)
            self.play(LaggedStart(*[Create(l) for l in lines], lag_ratio=0.4), FadeIn(note), run_time=2.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- שווה צלעות ----------
    def equilateral(self):
        s = 4.6
        B, C = np.array([-5.6, -2.2, 0]), np.array([-5.6 + s, -2.2, 0])
        A = B + s * np.array([0.5, np.sqrt(3) / 2, 0])
        tri = Polygon(A, B, C, color=WHITE, stroke_width=4)
        tk = VGroup(ticks(A, B, 1, RD), ticks(A, C, 1, RD), ticks(B, C, 1, RD))
        ws = VGroup(wedge(A, B, C, 0.6, OR), wedge(B, A, C, 0.6, OR), wedge(C, A, B, 0.6, OR))
        ls = VGroup(wlabel(A, B, C, "60°", 0.6), wlabel(B, A, C, "60°", 0.6), wlabel(C, A, B, "60°", 0.6))
        head = T("משולש שווה צלעות", 46, OR).move_to([3.3, 1.8, 0])
        r1 = T("כל הצלעות שוות ← כל הזוויות שוות", 32).next_to(head, DOWN, buff=0.4)
        r2 = F("180° ÷ 3 = 60°", 40, OR).next_to(r1, DOWN, buff=0.4)
        with self.voice("ומה אם כל שלוש הצלעות שוות? זה משולש שווה צלעות. "
                        "כאן כל זוג צלעות הוא שוקיים, ולכן כל הזוויות שוות. מאה שמונים חלקי שלוש: שישים מעלות כל אחת.") as d:
            self.play(Create(tri), Create(tk), Write(head), run_time=2)
            self.play(FadeIn(r1), run_time=1)
            self.play(FadeIn(ws), FadeIn(ls), run_time=1.5)
            self.play(Write(r2), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- דוגמה: שטח ומערכת צירים ----------
    def example(self):
        plane = NumberPlane(x_range=[-1, 9], y_range=[-1, 9], x_length=6.0, y_length=6.0,
                            background_line_style={"stroke_color": GREY_D, "stroke_opacity": 0.6},
                            axis_config={"stroke_color": GREY_B}).move_to([-3.4, -0.3, 0])
        nums = VGroup(*[T(str(v), 20, GREY_B).next_to(plane.c2p(v, 0), DOWN, buff=0.08) for v in (2, 4, 6, 8)],
                      *[T(str(v), 20, GREY_B).next_to(plane.c2p(0, v), LEFT, buff=0.08) for v in (2, 4, 6, 8)])
        pB, pC = plane.c2p(1, 2), plane.c2p(7, 2)
        dots = VGroup(Dot(pB, color=OR), Dot(pC, color=OR))
        labs = VGroup(F("B(1, 2)", 26).next_to(pB, DOWN, buff=0.12), F("C(7, 2)", 26).next_to(pC, DOWN, buff=0.12))
        head = T("דוגמה במערכת צירים", 40, YELLOW).move_to([3.4, 2.9, 0])
        q = R("משולש שווה שוקיים,", "AB = AC", size=30).next_to(head, DOWN, buff=0.3)
        q2 = R("הקודקוד", "A", "על הישר", "y = 7", size=30).next_to(q, DOWN, buff=0.15)
        with self.voice("ועכשיו דוגמה במערכת צירים. הבסיס הוא בי סי: מאחת שתיים עד שבע שתיים. "
                        "המשולש שווה שוקיים, והקודקוד איי נמצא בגובה שבע. איפה בדיוק נמצא איי?") as d:
            self.play(Create(plane), FadeIn(nums), run_time=1.5)
            self.play(FadeIn(dots), FadeIn(labs), Create(Line(pB, pC, color=WHITE, stroke_width=4)), Write(head), run_time=1.5)
            self.play(FadeIn(q), FadeIn(q2), run_time=1.5)
        pD = plane.c2p(4, 2)
        axis = DashedLine(plane.c2p(4, -0.5), plane.c2p(4, 8.6), color=YELLOW, stroke_width=3)
        s1 = F("<i>x</i> = (1 + 7) ÷ 2 = 4", 32, YELLOW).next_to(q2, DOWN, buff=0.45)
        pA = plane.c2p(4, 7)
        Adot = Dot(pA, color=RD, radius=0.12)
        Alab = F("A(4, 7)", 28, RD).next_to(pA, RIGHT, buff=0.15)
        with self.voice("כי השוקיים שוות, הקודקוד נמצא בדיוק מעל אמצע הבסיס. האמצע: אחת ועוד שבע, חלקי שתיים, ארבע. "
                        "אז איי הוא הנקודה ארבע, שבע.") as d:
            self.play(Create(axis), FadeIn(Dot(pD, color=YELLOW)), run_time=1.2)
            self.play(Write(s1), run_time=1.5)
            self.play(FadeIn(Adot, scale=2), FadeIn(Alab), Create(Line(pA, pB, color=WHITE, stroke_width=4)), Create(Line(pA, pC, color=WHITE, stroke_width=4)), run_time=1.5)
        hgt = Line(pA, pD, color=BL, stroke_width=6)
        s2 = R("בסיס:", "7 − 1 = 6", size=30).next_to(s1, DOWN, buff=0.35)
        s3 = R("גובה:", "7 − 2 = 5", size=30, color=BL).next_to(s2, DOWN, buff=0.2)
        s4 = R("שטח:", "6 · 5 ÷ 2 = 15", size=34, color=GN).next_to(s3, DOWN, buff=0.3)
        with self.voice("ומה השטח? הבסיס הוא שש. הגובה הוא הקטע מאיי לאמצע הבסיס, כי במשולש שווה שוקיים התיכון הוא גם גובה. "
                        "הגובה הוא חמש. שש כפול חמש, חלקי שתיים: חמש עשרה.") as d:
            self.play(FadeIn(s2), run_time=1)
            self.play(Create(hgt), FadeIn(s3), run_time=1.5)
            self.wait(1.5)
            self.play(FadeIn(s4, shift=UP * 0.2), run_time=1.2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- טעות נפוצה ----------
    def mistake(self):
        head = T("טעות נפוצה", 46, RD).to_edge(UP, buff=0.5)
        q = R("זווית הראש היא", "50°", "— מה זווית הבסיס?", size=36).next_to(head, DOWN, buff=0.5)
        bad = VGroup(F("180° − 50° = 130°", 40, RD), T("✗", 44, RD, font=MATH)).arrange(RIGHT, buff=0.3).next_to(q, DOWN, buff=0.6)
        why = R("130°", "זה שתי זוויות הבסיס יחד!", size=32, color=RD).next_to(bad, DOWN, buff=0.25)
        good = VGroup(F("130° ÷ 2 = 65°", 40, GN), T("✓", 44, GN, font=MATH)).arrange(RIGHT, buff=0.3).next_to(why, DOWN, buff=0.5)
        with self.voice("טעות נפוצה: זווית הראש היא חמישים, ומחשבים מאה שמונים פחות חמישים, מאה שלושים, ועוצרים. "
                        "אבל מאה שלושים זה שתי זוויות הבסיס ביחד!") as d:
            self.play(Write(head), FadeIn(q), run_time=1.5)
            self.play(Write(bad), run_time=1.5)
            self.play(FadeIn(why), Wiggle(bad), run_time=1.5)
        with self.voice("צריך לחלק בשתיים: שישים וחמש מעלות לכל זווית בסיס. ובדיקה: חמישים ועוד שישים וחמש ועוד שישים וחמש, מאה שמונים.") as d:
            self.play(Write(good), run_time=1.5)
            chk = F("50 + 65 + 65 = 180  ✓", 36, GN).next_to(good, DOWN, buff=0.4)
            self.play(FadeIn(chk), run_time=1.2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- סיכום ----------
    def summary(self):
        head = T("מה למדנו?", 56, font=TITLE).to_edge(UP, buff=0.4)
        lines = VGroup(
            T("שווה שוקיים: שתי צלעות שוות", 36, YELLOW),
            T("זוויות הבסיס שוות", 36, PU),
            T("הקטע מהראש לבסיס: תיכון + גובה + חוצה זווית", 36, GN),
            R("שווה צלעות: כל הזוויות", "60°", size=36, color=OR),
            T("שטח = בסיס × גובה ÷ 2", 36, BL),
        ).arrange(DOWN, buff=0.4, aligned_edge=RIGHT).next_to(head, DOWN, buff=0.5)
        with self.voice("אז מה למדנו? במשולש שווה שוקיים יש שתי צלעות שוות, וזוויות הבסיס שוות. "
                        "הקטע מזווית הראש לבסיס הוא גם תיכון, גם גובה וגם חוצה זווית. "
                        "במשולש שווה צלעות כל הזוויות שישים. ושטח זה בסיס כפול גובה חלקי שתיים.") as d:
            self.play(Write(head), run_time=1)
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 5 - 1.3, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, BALL).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! בכלים תוכל לגרור את הקודקוד ולראות בעצמך איך שלושת הקטעים נפרדים, ברגע שהמשולש מפסיק להיות שווה שוקיים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
