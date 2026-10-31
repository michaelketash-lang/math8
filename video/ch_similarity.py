"""סרטון: דמיון משולשים ומצולעים (כיתה ח׳, פרקים 17–20).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_similarity.py Similarity
"""
from common import *

add_pron({
    "דומים": "דּוֹמִים", "דומה": "דּוֹמֶה", "דמיון": "דִּמְיוֹן", "הדמיון": "הַדִּמְיוֹן",
    "זוויות": "זָוִיּוֹת", "הזוויות": "הַזָּוִיּוֹת", "ריבוע": "רִבּוּעַ", "בריבוע": "בָּרִבּוּעַ",
    "פרופורציוניות": "פְּרוֹפּוֹרְצְיוֹנִיּוֹת", "הצל": "הַצֵּל", "צל": "צֵל", "סולם": "סֻלָּם",
})

A_COL, B_COL, C_COL = ORANGE, BLUE_C, GREEN_C


def MT(s, size=40, color=WHITE):
    """נוסחה/מספרים בגופן מתמטי (בלי עברית)."""
    return MarkupText(s, font=MATH, font_size=size, color=color)


def arc_at(P, Q, R, r=0.45, color=YELLOW):
    """קשת של הזווית הפנימית בקודקוד P (בין PQ ל־PR)."""
    a1 = np.arctan2(*(Q - P)[1::-1])
    d = np.arctan2(*(R - P)[1::-1]) - a1
    d = (d + PI) % TAU - PI
    return Arc(radius=r, start_angle=a1, angle=d, arc_center=P, color=color, stroke_width=5)


def bis(P, Q, R, k=0.85):
    """נקודה על חוצה הזווית בקודקוד P, במרחק k (למיקום מספר המעלות)."""
    u = (Q - P) / np.linalg.norm(Q - P) + (R - P) / np.linalg.norm(R - P)
    return P + k * u / np.linalg.norm(u)


def side_lab(P, Q, s, centroid, color=YELLOW, size=34, d=0.35):
    m = (P + Q) / 2
    v = m - centroid
    return T(s, size, color).move_to(m + d * v / np.linalg.norm(v))


def tri_pts(scale, origin):
    # משולש עם צלעות AB=4, BC=6, CA=5 (B בראשית)
    A, B, C = np.array([2.25, 3.307, 0]), np.array([0, 0, 0]), np.array([6, 0, 0])
    return [origin + scale * p for p in (A, B, C)]


def player(x, y0, H, color=WHITE):
    head = Circle(radius=H * 0.08, color=color, stroke_width=4).move_to([x, y0 + H - H * 0.08, 0])
    neck, hip = y0 + H * 0.84, y0 + H * 0.45
    body = Line([x, neck, 0], [x, hip, 0], color=color, stroke_width=4)
    legs = VGroup(Line([x, hip, 0], [x - H * 0.12, y0, 0]), Line([x, hip, 0], [x + H * 0.12, y0, 0])).set_stroke(color, 4)
    arms = VGroup(Line([x, neck - H * 0.06, 0], [x - H * 0.16, y0 + H * 0.55, 0]), Line([x, neck - H * 0.06, 0], [x + H * 0.16, y0 + H * 0.55, 0])).set_stroke(color, 4)
    return VGroup(head, body, legs, arms)


def hoop(x, y0, H):
    pole = Line([x, y0, 0], [x, y0 + H, 0], color=GREY_B, stroke_width=8)
    board = Rectangle(width=0.12, height=0.9, color=WHITE, stroke_width=3).move_to([x - 0.06, y0 + H + 0.25, 0])
    rim = Line([x - 0.12, y0 + H, 0], [x - 0.6, y0 + H, 0], color=BALL, stroke_width=6)
    return VGroup(pole, board, rim)


class Similarity(Narrated):
    def construct(self):
        self.story()
        self.definition()
        self.aa()
        self.area()
        self.example()
        self.polygons()
        self.finale()
        self.summary()

    # ---------- מגרש, צל ושאלה ----------
    def court_scene(self):
        s, y0 = 1.5, -3.0
        ground = Line([-7, y0, 0], [7, y0, 0], color=COURT, stroke_width=4)
        px, hx = -4.7, 0.9
        p = player(px, y0, 1.5 * s, WHITE)
        h = hoop(hx, y0, 3 * s)
        sh1 = Line([px, y0, 0], [px + 1 * s, y0, 0], color=GREY_D, stroke_width=14)
        sh2 = Line([hx, y0, 0], [hx + 2 * s, y0, 0], color=GREY_D, stroke_width=14)
        r1 = DashedLine([px, y0 + 1.5 * s, 0], [px + 1 * s, y0, 0], color=YELLOW, stroke_width=3)
        r2 = DashedLine([hx, y0 + 3 * s, 0], [hx + 2 * s, y0, 0], color=YELLOW, stroke_width=3)
        t1 = Polygon([px, y0, 0], [px + s, y0, 0], [px, y0 + 1.5 * s, 0], color=BLUE_C, fill_opacity=0.25, stroke_width=3)
        t2 = Polygon([hx, y0, 0], [hx + 2 * s, y0, 0], [hx, y0 + 3 * s, 0], color=GREEN_C, fill_opacity=0.2, stroke_width=3)
        labs = VGroup(
            R("1.5", "מ׳", size=30).next_to(p, LEFT, buff=0.25),
            R("1", "מ׳", size=30, color=GREY_B).next_to(sh1, DOWN, buff=0.15),
            R("2", "מ׳", size=30, color=GREY_B).next_to(sh2, DOWN, buff=0.15),
        )
        q = T("?", 56, YELLOW).next_to(h[0], LEFT, buff=0.3).shift(UP * 0.3)
        return dict(ground=ground, p=p, h=h, sh1=sh1, sh2=sh2, r1=r1, r2=r2, t1=t1, t2=t2, labs=labs, q=q)

    def story(self):
        c = self.court_scene()
        sun = Circle(radius=0.45, color=YELLOW, fill_opacity=1).move_to([-6.2, 3.1, 0])
        with self.voice("ערב. השמש נמוכה, ואתה עומד ליד הסל. הגובה שלך מטר וחצי, והצל שלך באורך מטר אחד.") as d:
            self.play(Create(c["ground"]), FadeIn(sun), Create(c["p"]), Create(c["h"]), run_time=2)
            self.play(Create(c["sh1"]), Create(c["r1"]), FadeIn(c["labs"][0]), FadeIn(c["labs"][1]), run_time=2)
        with self.voice("הצל של עמוד הסל באורך שני מטרים. איך נדע כמה גבוה הסל, בלי סולם ובלי סרט מדידה?") as d:
            self.play(Create(c["sh2"]), Create(c["r2"]), FadeIn(c["labs"][2]), run_time=2)
            self.play(FadeIn(c["q"], scale=1.5), run_time=1)
        title = T("דמיון משולשים", 60, font=TITLE).to_edge(UP, buff=0.3).shift(RIGHT * 2.5)
        with self.voice("קרני השמש מקבילות, ולכן נוצרים כאן שני משולשים עם אותה צורה בדיוק. "
                        "משולשים כאלה נקראים משולשים דומים. בוא נלמד מה זה, ובסוף נחזור לסל.") as d:
            self.play(FadeIn(c["t1"]), FadeIn(c["t2"]), run_time=1.5)
            self.play(Write(title), run_time=2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- הגדרה ----------
    def definition(self):
        head = T("משולשים דומים = אותה צורה", 46).to_edge(UP, buff=0.35)
        A1, B1, C1 = tri_pts(0.5, np.array([-6.3, -1.4, 0]))
        A2, B2, C2 = tri_pts(1.0, np.array([-1.2, -2.3, 0]))
        t1 = Polygon(A1, B1, C1, color=BLUE, fill_opacity=0.15, stroke_width=4)
        t2 = Polygon(A2, B2, C2, color=GREEN, fill_opacity=0.12, stroke_width=4)
        n1 = VGroup(*[M(s, 34).next_to(P, d, buff=0.12) for s, P, d in zip("ABC", (A1, B1, C1), (UP, DL, DR))])
        n2 = VGroup(*[M(s, 40).next_to(P, d, buff=0.12) for s, P, d in zip("DEF", (A2, B2, C2), (UP, DL, DR))])
        with self.voice("משולשים דומים הם משולשים עם אותה צורה, אבל לא בהכרח באותו גודל. כמו תמונה שעושים לה זום.") as d:
            self.play(Write(head), Create(t1), FadeIn(n1), run_time=2)
            self.play(TransformFromCopy(t1, t2), run_time=2)
            self.play(FadeIn(n2), run_time=0.8)

        arcs1 = VGroup(arc_at(A1, B1, C1, 0.3, A_COL), arc_at(B1, C1, A1, 0.3, B_COL), arc_at(C1, A1, B1, 0.3, C_COL))
        arcs2 = VGroup(arc_at(A2, B2, C2, 0.55, A_COL), arc_at(B2, C2, A2, 0.55, B_COL), arc_at(C2, A2, B2, 0.55, C_COL))
        with self.voice("במשולשים דומים, הזוויות המתאימות שוות. הזווית הכתומה כאן שווה לזווית הכתומה שם, וכך גם הכחולה והירוקה.") as d:
            for i in range(3):
                self.play(Create(arcs1[i]), Create(arcs2[i]), run_time=1.1)
                self.wait(0.4)

        g1, g2 = (A1 + B1 + C1) / 3, (A2 + B2 + C2) / 3
        l1 = VGroup(side_lab(A1, B1, "4", g1, size=30), side_lab(B1, C1, "6", g1, size=30), side_lab(C1, A1, "5", g1, size=30))
        l2 = VGroup(side_lab(A2, B2, "8", g2), side_lab(B2, C2, "12", g2), side_lab(C2, A2, "10", g2))
        ratio = MT("8 ÷ 4 = 2     10 ÷ 5 = 2     12 ÷ 6 = 2", 36, YELLOW).to_edge(DOWN, buff=0.35)
        with self.voice("והצלעות? כל צלע גדלה פי אותו מספר. ארבע הפכה לשמונה, חמש לעשר, ושש לשתים עשרה. כל צלע גדלה פי שתיים.") as d:
            self.play(FadeIn(l1), run_time=1)
            for i in (0, 2, 1):
                self.play(TransformFromCopy(l1[i], l2[i]), run_time=1)
            self.play(Write(ratio), run_time=1.5)

        kbox = R("יחס הדמיון:", "<i>k</i> = 2", size=40, color=YELLOW).to_edge(RIGHT, buff=0.4).shift(UP * 2.3)
        with self.voice("המספר הזה נקרא יחס הדמיון, ומסמנים אותו באות קיי. כאן, קיי שווה שתיים.") as d:
            self.play(FadeIn(kbox, shift=LEFT * 0.3), run_time=1.2)
            self.play(Indicate(kbox, color=YELLOW), run_time=1.2)

        note = MT("△<i>ABC</i>  ∼  △<i>DEF</i>", 44).next_to(kbox, DOWN, buff=0.45).align_to(kbox, RIGHT)
        with self.voice("כותבים: משולש איי בי סי דומה למשולש די אי אֶף. הסדר של האותיות חשוב: "
                        "איי מתאים לדי, בי מתאים לאי, וסי מתאים לאף.") as d:
            self.play(Write(note), run_time=1.5)
            for i in range(3):
                self.play(Indicate(n1[i], color=[A_COL, B_COL, C_COL][i], scale_factor=1.6),
                          Indicate(n2[i], color=[A_COL, B_COL, C_COL][i], scale_factor=1.6), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- ז.ז ----------
    def aa(self):
        head = R("משפט הדמיון", "ז.ז", "(זווית־זווית)", size=46).to_edge(UP, buff=0.35)
        rule = VGroup(T("שתי זוויות שוות", 38), T("← המשולשים דומים", 38, YELLOW)).arrange(DOWN, aligned_edge=RIGHT, buff=0.2)
        rule.to_edge(RIGHT, buff=0.5).shift(UP * 1.6)
        L = ValueTracker(3.0)
        B0 = np.array([-6.2, -2.6, 0])
        b, c = 50 * DEGREES, 60 * DEGREES

        def pts():
            l = L.get_value()
            C = B0 + RIGHT * l
            ab = l * np.sin(c) / np.sin(b + c)
            A = B0 + ab * np.array([np.cos(b), np.sin(b), 0])
            return A, B0, C

        tri = always_redraw(lambda: Polygon(*pts(), color=WHITE, fill_color=BLUE, fill_opacity=0.2, stroke_width=4))
        arcs = always_redraw(lambda: VGroup(arc_at(pts()[1], pts()[2], pts()[0], 0.5, B_COL), arc_at(pts()[2], pts()[0], pts()[1], 0.5, C_COL)))
        degs = always_redraw(lambda: VGroup(T("50°", 28, B_COL).move_to(bis(pts()[1], pts()[2], pts()[0], 0.95)),
                                            T("60°", 28, C_COL).move_to(bis(pts()[2], pts()[0], pts()[1], 0.95))))
        with self.voice("איך יודעים שמשולשים דומים, בלי למדוד את כל הצלעות? יש משפט: זווית זווית. "
                        "אם שתי זוויות במשולש אחד שוות לשתי זוויות במשולש אחר, המשולשים דומים.") as d:
            self.play(Write(head), Create(tri), run_time=1.5)
            self.play(Create(arcs), FadeIn(degs), run_time=1.2)
            self.play(FadeIn(rule, shift=LEFT * 0.3), run_time=1)
            self.play(L.animate.set_value(6.0), run_time=2)
            self.play(L.animate.set_value(3.0), run_time=2)
            self.play(L.animate.set_value(4.5), run_time=1.5)

        third = always_redraw(lambda: VGroup(arc_at(pts()[0], pts()[1], pts()[2], 0.45, A_COL),
                                             T("70°", 28, A_COL).move_to(bis(pts()[0], pts()[1], pts()[2], 0.95))))
        calc = MT("180° − 50° − 60° = 70°", 40, A_COL).to_edge(RIGHT, buff=0.5).shift(DOWN * 0.3)
        why = R("סכום הזוויות במשולש:", "180°", size=34).next_to(calc, UP, buff=0.4).align_to(calc, RIGHT)
        with self.voice("למה מספיקות שתי זוויות? כי סכום הזוויות במשולש הוא מאה ושמונים מעלות. "
                        "אם שתיים כבר קבועות, גם השלישית נקבעת: מאה ושמונים פחות חמישים פחות שישים, זה שבעים. "
                        "אז הצורה לא משתנה. רק הגודל.") as d:
            self.play(FadeIn(why), run_time=1)
            self.play(Write(calc), Create(third), run_time=2)
            self.wait(1.5)
            self.play(L.animate.set_value(2.5), run_time=2)
            self.play(L.animate.set_value(5.5), run_time=2)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- יחס שטחים ----------
    def tiled(self, k, side, origin, color=ORANGE):
        s, h = side / k, side / k * np.sqrt(3) / 2
        pt = lambda i, j: origin + np.array([j * s + i * s / 2, i * h, 0])
        g = VGroup()
        for i in range(k):
            for j in range(k - i):
                g.add(Polygon(pt(i, j), pt(i, j + 1), pt(i + 1, j), color=color, fill_opacity=0.45, stroke_width=3))
                if j < k - i - 1:
                    g.add(Polygon(pt(i, j + 1), pt(i + 1, j + 1), pt(i + 1, j), color=color, fill_color=BLUE, fill_opacity=0.35, stroke_width=3))
        return g

    def area(self):
        head = T("פי כמה גדל השטח?", 46).to_edge(UP, buff=0.35)
        small = Polygon(*[np.array([-6.6, 0.6, 0]) + p for p in ([0, 0, 0], [1.5, 0, 0], [0.75, 1.299, 0])],
                        color=ORANGE, fill_opacity=0.45, stroke_width=3)
        big = Polygon(*[np.array([-4.6, -2.6, 0]) + p for p in ([0, 0, 0], [3, 0, 0], [1.5, 2.598, 0])],
                      color=WHITE, stroke_width=4)
        q = R("צלע פי", "2", "← שטח פי", "?", size=40).to_edge(RIGHT, buff=0.5).shift(UP * 1.6)
        with self.voice("ועכשיו שאלה מכשילה. אם כל צלע גדלה פי שתיים, פי כמה גדל השטח? הרבה חושבים: פי שתיים. בוא נבדוק.") as d:
            self.play(Write(head), FadeIn(small), Create(big), run_time=2)
            self.play(FadeIn(q), run_time=1)
        tiles2 = self.tiled(2, 3, np.array([-4.6, -2.6, 0]))
        a2 = R("צלע פי", "2", "← שטח פי", "4 = 2²", size=40, color=YELLOW).move_to(q).align_to(q, RIGHT)
        with self.voice("בתוך המשולש הגדול נכנסים בדיוק ארבעה משולשים קטנים. אז השטח גדל פי ארבע. שתיים בריבוע.") as d:
            self.play(LaggedStart(*[TransformFromCopy(small, t) for t in tiles2], lag_ratio=0.35), run_time=3)
            self.play(ReplacementTransform(q, a2), run_time=1)
        big3 = Polygon(*[np.array([-5.0, -2.6, 0]) + p for p in ([0, 0, 0], [4.5, 0, 0], [2.25, 3.897, 0])], color=WHITE, stroke_width=4)
        tiles3 = self.tiled(3, 4.5, np.array([-5.0, -2.6, 0]))
        a3 = R("צלע פי", "3", "← שטח פי", "9 = 3²", size=40, color=YELLOW).next_to(a2, DOWN, buff=0.5).align_to(a2, RIGHT)
        rule = VGroup(T("יחס השטחים =", 36), T("יחס הדמיון בריבוע", 36, YELLOW)).arrange(LEFT, buff=0.2)
        rule = VGroup(rule, MT("<i>k</i>²", 44, YELLOW)).arrange(DOWN, buff=0.2).next_to(a3, DOWN, buff=0.7).align_to(a3, RIGHT)
        with self.voice("ואם הצלע גדלה פי שלוש? נכנסים תשעה משולשים קטנים, שלוש בריבוע. "
                        "הכלל: יחס השטחים שווה ליחס הדמיון בריבוע.") as d:
            self.play(FadeOut(tiles2), ReplacementTransform(big, big3), run_time=1)
            self.play(LaggedStart(*[TransformFromCopy(small, t) for t in tiles3], lag_ratio=0.15), run_time=3)
            self.play(FadeIn(a3), run_time=0.8)
            self.play(FadeIn(rule, shift=UP * 0.2), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- דוגמה ----------
    def example(self):
        A, B, C = np.array([-3.6, 2.4, 0]), np.array([-6.4, -2.8, 0]), np.array([-0.6, -2.8, 0])
        D, E = A + 0.4 * (B - A), A + 0.4 * (C - A)
        tri = Polygon(A, B, C, color=BLUE, stroke_width=4)
        de = Line(D, E, color=GREEN, stroke_width=5)
        names = VGroup(M("A", 36).next_to(A, UP, buff=0.12), M("B", 36).next_to(B, DL, buff=0.1), M("C", 36).next_to(C, DR, buff=0.1),
                       M("D", 36).next_to(D, LEFT, buff=0.15), M("E", 36).next_to(E, RIGHT, buff=0.15))
        labs = VGroup(T("4", 32, YELLOW).next_to((A + D) / 2, LEFT, buff=0.25), T("6", 32, GREEN).next_to(de, DOWN, buff=0.12),
                      T("?", 40, YELLOW).next_to(Line(B, C), DOWN, buff=0.15))
        given = VGroup(R("נתון:", "<i>DE</i> ∥ <i>BC</i>", size=34), MT("<i>AD</i> = 4,   <i>AB</i> = 10,   <i>DE</i> = 6", 34),
                       R("מצא את", "<i>BC</i>", size=34, color=YELLOW)).arrange(DOWN, aligned_edge=RIGHT, buff=0.25)
        given.to_edge(RIGHT, buff=0.5).to_edge(UP, buff=0.4)
        with self.voice("דוגמה. במשולש איי בי סי, הקטע די אי מקביל לבסיס בי סי. "
                        "נתון: איי די שווה ארבע, איי בי שווה עשר, ודי אי שווה שש. מה האורך של בי סי?") as d:
            self.play(Create(tri), FadeIn(names[:3]), run_time=1.5)
            self.play(Create(de), FadeIn(names[3:]), run_time=1.2)
            self.play(FadeIn(given), FadeIn(labs), run_time=1.5)

        aA = arc_at(A, B, C, 0.5, A_COL)
        aD, aB = arc_at(D, A, E, 0.4, B_COL), arc_at(B, A, C, 0.4, B_COL)
        s1 = R("זווית", "<i>A</i>", "משותפת", size=32, color=A_COL)
        s2 = R("זוויות מתאימות בין מקבילים", size=32, color=B_COL)
        s3 = R("←", "דומים לפי ז.ז", size=34, color=YELLOW)
        proof = VGroup(s1, s2, s3).arrange(DOWN, aligned_edge=RIGHT, buff=0.22).next_to(given, DOWN, buff=0.5).align_to(given, RIGHT)
        with self.voice("קודם מוכיחים דמיון. הזווית איי משותפת לשני המשולשים. "
                        "ובגלל שהקווים מקבילים, הזוויות המתאימות שוות. שתי זוויות, אז המשולשים דומים, לפי זווית זווית.") as d:
            self.play(Create(aA), FadeIn(s1), run_time=1.5)
            self.wait(1)
            self.play(Create(aD), Create(aB), FadeIn(s2), run_time=1.5)
            self.wait(1)
            self.play(FadeIn(s3), Indicate(Polygon(A, D, E, color=YELLOW, stroke_width=6)), run_time=1.5)

        k = MT("<i>k</i> = 10 ÷ 4 = 2.5", 38, YELLOW)
        bc = MT("<i>BC</i> = 6 · 2.5 = 15", 42, YELLOW)
        VGroup(k, bc).arrange(DOWN, aligned_edge=RIGHT, buff=0.3).next_to(proof, DOWN, buff=0.5).align_to(proof, RIGHT)
        ans = T("15", 40, YELLOW).move_to(labs[2])
        with self.voice("יחס הדמיון: עשר חלקי ארבע, זה שתיים וחצי. אז בי סי שווה שש כפול שתיים וחצי, כלומר חמש עשרה.") as d:
            self.play(Write(k), run_time=1.5)
            self.play(Write(bc), run_time=1.5)
            self.play(Transform(labs[2], ans), Circumscribe(bc, color=YELLOW), run_time=1.5)

        db = Line(D, B, color=RED, stroke_width=9)
        ab = Line(A, B, color=GREEN, stroke_width=9)
        warn = R("✗", "לא", "<i>DB</i>", "— כל הצלע", "<i>AB</i>", size=32, color=RED).to_edge(DOWN, buff=0.3).shift(RIGHT * 2.5)
        with self.voice("טעות נפוצה: לקחת את די בי במקום איי בי. הצלע שמתאימה לאיי די היא כל הצלע איי בי.") as d:
            self.play(Create(db), FadeIn(warn), run_time=1.5)
            self.wait(1)
            self.play(ReplacementTransform(db, ab), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- מצולעים ----------
    def polygons(self):
        head = T("מצולעים דומים", 46).to_edge(UP, buff=0.35)
        rule = VGroup(T("צריך את שני התנאים:", 36), T("• זוויות שוות", 36, GREEN_C), T("• צלעות פרופורציוניות", 36, GREEN_C)).arrange(DOWN, aligned_edge=RIGHT, buff=0.2)
        rule.next_to(head, DOWN, buff=0.4).to_edge(RIGHT, buff=0.6)
        with self.voice("גם מצולעים יכולים להיות דומים. אבל שם צריך את שני התנאים: זוויות שוות, וגם צלעות פרופורציוניות.") as d:
            self.play(Write(head), run_time=1)
            self.play(FadeIn(rule, shift=UP * 0.2), run_time=1.5)
        sqr = Square(2.2, color=BLUE, fill_opacity=0.2).move_to([-5.2, -0.9, 0])
        rect = Rectangle(width=4.2, height=1.4, color=BLUE, fill_opacity=0.2).move_to([-1.5, -0.9, 0])
        x = T("✗ לא דומים", 38, RED).next_to(VGroup(sqr, rect), DOWN, buff=0.35)
        r1 = Rectangle(width=1.6, height=2.4, color=GREEN, fill_opacity=0.2).move_to([1.8, -1.0, 0])
        r2 = Rectangle(width=3.2, height=4.8, color=GREEN, fill_opacity=0.2).move_to([4.6, -0.8, 0]).scale(0.62)
        r2.move_to([4.6, -1.0, 0])
        l1 = VGroup(T("2", 30).next_to(r1, DOWN, buff=0.1), T("3", 30).next_to(r1, LEFT, buff=0.1))
        l2 = VGroup(T("4", 30).next_to(r2, DOWN, buff=0.1), T("6", 30).next_to(r2, RIGHT, buff=0.1))
        v = R("✓ דומים, פי", "2", size=38, color=GREEN).next_to(VGroup(r1, r2), DOWN, buff=0.35)
        with self.voice("ריבוע ומלבן: לשניהם כל הזוויות ישרות, ובכל זאת הם לא דומים. הצורה שונה. "
                        "אבל מלבן שתיים על שלוש ומלבן ארבע על שש, הם כן דומים, כי כל צלע גדלה פי שתיים.") as d:
            self.play(Create(sqr), Create(rect), run_time=1.5)
            self.play(FadeIn(x), run_time=1)
            self.wait(2)
            self.play(Create(r1), FadeIn(l1), run_time=1.2)
            self.play(TransformFromCopy(r1, r2), FadeIn(l2), run_time=1.5)
            self.play(FadeIn(v), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- חזרה לסל ----------
    def finale(self):
        c = self.court_scene()
        with self.voice("ועכשיו, הסל. המשולש שלך והמשולש של העמוד דומים: קרני השמש מקבילות, ושניכם עומדים ישר, בזווית ישרה לרצפה.") as d:
            self.play(*[FadeIn(c[k]) for k in ("ground", "p", "h", "sh1", "sh2", "r1", "r2", "labs", "q")], run_time=1.5)
            self.play(FadeIn(c["t1"]), FadeIn(c["t2"]), run_time=1.5)
        k = MT("<i>k</i> = 2 ÷ 1 = 2", 42, YELLOW)
        hh = R("גובה הסל:", "1.5 · 2 = 3", "מ׳", size=42, color=YELLOW)
        VGroup(k, hh).arrange(DOWN, aligned_edge=RIGHT, buff=0.35).to_edge(RIGHT, buff=0.5).to_edge(UP, buff=0.6)
        with self.voice("הצל של העמוד ארוך פי שתיים מהצל שלך: שני מטרים לעומת מטר אחד. אז גם הגובה גדול פי שתיים. "
                        "מטר וחצי כפול שתיים: שלושה מטרים. בדיוק הגובה של סל כדורסל!") as d:
            self.play(Indicate(c["sh1"]), Indicate(c["sh2"]), Write(k), run_time=2)
            self.wait(1)
            self.play(Write(hh), run_time=2)
            self.play(Transform(c["q"], R("3", "מ׳", size=40, color=YELLOW).move_to(c["q"]).shift(LEFT * 0.3)), Flash(c["h"][2].get_center(), color=BALL), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- סיכום ----------
    def summary(self):
        head = T("מה למדנו?", 56, font=TITLE).to_edge(UP, buff=0.4)
        lines = VGroup(
            T("משולשים דומים: זוויות שוות וצלעות פרופורציוניות", 36),
            R("יחס הדמיון", "<i>k</i>", ": פי כמה גדלה כל צלע", size=36),
            R("ז.ז", ": שתי זוויות שוות ← המשולשים דומים", size=36),
            R("יחס השטחים =", "<i>k</i>²", size=36, color=YELLOW),
        ).arrange(DOWN, aligned_edge=RIGHT, buff=0.4).next_to(head, DOWN, buff=0.6).to_edge(RIGHT, buff=1.2)
        with self.voice("אז מה למדנו? משולשים דומים: אותה צורה, זוויות שוות וצלעות פרופורציוניות. "
                        "יחס הדמיון אומר פי כמה גדלה כל צלע. מספיקות שתי זוויות שוות כדי לדעת שמשולשים דומים. "
                        "והשטח גדל ביחס הדמיון בריבוע.") as d:
            self.play(Write(head), run_time=1)
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 4 - 1.4, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.6)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
