"""סרטון: זוויות וזווית חיצונית למשולש (כיתה ח׳, פרק 20).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_angles.py Angles
"""
from common import *

add_pron({"קודקודיות": "קוֹדְקוֹדִיּוֹת", "קודקודית": "קוֹדְקוֹדִית", "חוצה": "חוֹצֶה", "מתחלפות": "מִתְחַלְּפוֹת",
          "מכנסים": "מְכַנְּסִים"})  # כינוס איברים; בלי ניקוד נקרא "מִכְנָסַיִם"

OR, BL, PU, GR, GN = ORANGE, BLUE_C, PURPLE_B, GREY_B, GREEN_C


def F(s, size=40, color=WHITE):
    """שורה מתמטית (בלי עברית)."""
    return MarkupText(s, font=MATH, font_size=size, color=color)


def ang(v):
    return np.arctan2(v[1], v[0])


def wedge(O, A, B, r=0.6, color=OR, op=0.4):
    """קשת זווית מלאה ב־O בין OA ל־OB (הזווית הקטנה מ־180)."""
    a1, a2 = ang(A - O), ang(B - O)
    d = (a2 - a1) % TAU
    if d > PI:
        a1, d = a2, TAU - d
    return VGroup(Sector(radius=r, angle=d, start_angle=a1, arc_center=O, fill_color=color, fill_opacity=op, stroke_width=0),
                  Arc(radius=r, angle=d, start_angle=a1, arc_center=O, color=color, stroke_width=3))


def wlabel(O, A, B, txt, r=0.6, color=OR, size=30):
    u = normalize(A - O) + normalize(B - O)
    if np.linalg.norm(u) < 1e-6:
        u = rotate_vector(normalize(A - O), PI / 2)
    m = F(txt, size, color)
    return m.move_to(O + (r + 0.2 + 0.5 * max(m.width, m.height)) * normalize(u))


def deg(O, A, B):
    d = abs(ang(A - O) - ang(B - O)) % TAU
    return round(np.degrees(min(d, TAU - d)))


def tri(b, c, base=5.0, origin=ORIGIN):
    """משולש עם זווית b ב־B וזווית c ב־C (במעלות). מחזיר A, B, C."""
    a = 180 - b - c
    t = base * np.sin(np.radians(c)) / np.sin(np.radians(a))
    B = np.array(origin, dtype=float)
    C = B + RIGHT * base
    A = B + t * np.array([np.cos(np.radians(b)), np.sin(np.radians(b)), 0])
    return A, B, C


class Angles(Narrated):
    def construct(self):
        self.story()
        self.vertical()
        self.parallel()
        self.exterior()
        self.example()
        self.mistake()
        self.summary()

    # ---------- פתיחה: מסירה באלכסון במגרש ----------
    def story(self):
        c = court(0.42).shift(DOWN * 0.4)
        top = Line(c[0].get_corner(UL), c[0].get_corner(UR), color=YELLOW, stroke_width=7)
        bot = Line(c[0].get_corner(DL), c[0].get_corner(DR), color=YELLOW, stroke_width=7)
        with self.voice("תסתכל על מגרש הכדורסל. שני קווי הצד הארוכים מקבילים זה לזה.") as d:
            self.play(Create(c, lag_ratio=0.1), run_time=2.5)
            self.play(Create(top), Create(bot), run_time=1.5)
        y1, y2 = bot.get_y(), top.get_y()
        p1, p2 = np.array([-3.2, y1, 0]), np.array([0.6, y2, 0])
        dirv = normalize(p2 - p1)
        pas = Line(p1 - dirv * 0.6, p2 + dirv * 0.6, color=BALL, stroke_width=6)
        ball = Dot(p1, color=BALL, radius=0.16)
        w1 = wedge(p1, p1 + RIGHT, p1 + dirv, 0.55, OR, 0.5)
        w2 = wedge(p2, p2 + LEFT, p2 - dirv, 0.55, OR, 0.5)
        q = T("?", 48, OR).next_to(c, RIGHT, buff=0.3)
        with self.voice("עכשיו שחקן מוסר מסירה ארוכה באלכסון. הקו של המסירה חוצה את שני קווי הצד, "
                        "ונוצרות זוויות. האם יש קשר בין הזוויות האלה?") as d:
            self.play(FadeIn(ball), run_time=0.5)
            self.play(Create(pas), ball.animate.move_to(p2), run_time=2)
            self.play(FadeIn(w1), FadeIn(w2), run_time=1)
            self.play(Indicate(w1, scale_factor=1.4), Indicate(w2, scale_factor=1.4), FadeIn(q), run_time=1.5)
        title = T("זוויות וזווית חיצונית למשולש", 56, font=TITLE).to_edge(UP, buff=0.3)
        with self.voice("בסרטון הזה נלמד חוקים שמאפשרים לדעת גודל של זווית, בלי למדוד בכלל.") as d:
            self.play(FadeOut(VGroup(c, top, bot, pas, ball, w1, w2, q)), run_time=1)
            self.play(Write(title), run_time=2)
        self.play(FadeOut(title))

    # ---------- קודקודיות וצמודות ----------
    def vertical(self):
        O = np.array([-3.2, -0.3, 0])
        th = ValueTracker(60)
        L = 3.2
        h_line = Line(O + LEFT * L, O + RIGHT * L, color=WHITE, stroke_width=4)
        d = lambda: np.array([np.cos(np.radians(th.get_value())), np.sin(np.radians(th.get_value())), 0])
        t_line = always_redraw(lambda: Line(O - d() * L, O + d() * L, color=WHITE, stroke_width=4))

        def rays():
            return [O + RIGHT, O + d(), O + LEFT, O - d()]

        def wv(p, color):
            return always_redraw(lambda: wedge(O, rays()[p], rays()[(p + 1) % 4], 0.7, color))

        def lv(p, color):
            return always_redraw(lambda: wlabel(O, rays()[p], rays()[(p + 1) % 4],
                                                f"{round(th.get_value()) if p % 2 == 0 else 180 - round(th.get_value())}°", 0.7, color))

        oranges = VGroup(wv(0, OR), wv(2, OR))
        olabs = VGroup(lv(0, OR), lv(2, OR))
        blues = VGroup(wv(1, BL), wv(3, BL))
        blabs = VGroup(lv(1, BL), lv(3, BL))
        r1 = T("זוויות קודקודיות", 44, OR).move_to([3.3, 2.2, 0])
        r1b = T("אחת מול השנייה ← שוות", 34, OR).next_to(r1, DOWN, buff=0.25)
        with self.voice("נתחיל משני ישרים שנחתכים. הם יוצרים ארבע זוויות. "
                        "שתי זוויות שנמצאות אחת מול השנייה, כמו באות איקס, נקראות זוויות קודקודיות.") as dd:
            self.play(Create(h_line), Create(t_line), run_time=1.5)
            self.wait(1.5)
            self.play(FadeIn(oranges), FadeIn(olabs), Write(r1), run_time=1.5)
            self.play(FadeIn(r1b, shift=UP * 0.2), run_time=1)
        with self.voice("בוא נסובב את הישר. שים לב למספרים: הזוויות הקודקודיות תמיד שוות. בכל מצב.") as dd:
            for v in (110, 40, 75):
                self.play(th.animate.set_value(v), run_time=1.6)
                self.wait(0.4)
        r2 = T("זוויות צמודות", 44, BL).move_to([3.3, 0.3, 0])
        r2b = R("אחת ליד השנייה ← סכום", "180°", size=34, color=BL).next_to(r2, DOWN, buff=0.25)
        with self.voice("ועכשיו שתי זוויות שנמצאות אחת ליד השנייה. הן נקראות זוויות צמודות. "
                        "יחד הן יוצרות קו ישר, ולכן הסכום שלהן הוא מאה שמונים מעלות.") as dd:
            self.play(FadeIn(blues), FadeIn(blabs), Write(r2), run_time=1.5)
            self.play(Indicate(h_line, color=YELLOW), run_time=1.5)
            self.play(FadeIn(r2b, shift=UP * 0.2), run_time=1)
            self.play(th.animate.set_value(50), run_time=1.5)
        self.play(th.animate.set_value(75), run_time=1)
        why = VGroup(R("כתומה ימנית:", "180° − 105° = 75°", size=32, color=OR),
                     R("כתומה שמאלית:", "180° − 105° = 75°", size=32, color=OR)).arrange(DOWN, buff=0.25).move_to([3.3, -2.0, 0])
        with self.voice("ולמה הקודקודיות שוות? כל זווית כתומה צמודה לאותה זווית כחולה. "
                        "אז כל אחת מהן היא מאה שמונים פחות אותה זווית כחולה. ולכן הן שוות.") as dd:
            self.play(Indicate(blues[0], scale_factor=1.3), run_time=1.2)
            self.play(FadeIn(why[0], shift=UP * 0.2), run_time=1)
            self.play(FadeIn(why[1], shift=UP * 0.2), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- ישרים מקבילים וחותך ----------
    def parallel(self):
        th = np.radians(65)
        dv = np.array([np.cos(th), np.sin(th), 0])
        y1, y2, cx = -1.6, 1.4, -3.0
        O1 = np.array([cx - 1.5 / np.tan(th), y1, 0])
        O2 = np.array([cx + 1.5 / np.tan(th), y2, 0])
        l1 = Line([-6.8, y1, 0], [0.6, y1, 0], color=BL, stroke_width=5)
        l2 = Line([-6.8, y2, 0], [0.6, y2, 0], color=BL, stroke_width=5)
        arrows = VGroup(*[T(">", 34, BL, font=MATH).move_to([0.2, y + 0.3, 0]) for y in (y1, y2)])
        tr = Line(O1 - dv * 1.4, O2 + dv * 1.4, color=WHITE, stroke_width=4)
        with self.voice("עכשיו שני ישרים מקבילים, וישר שלישי שחותך את שניהם. הוא נקרא חותך. "
                        "נוצרים שני צמתים, ובכל צומת ארבע זוויות.") as d:
            self.play(Create(l1), Create(l2), FadeIn(arrows), run_time=1.5)
            self.play(Create(tr), run_time=1.5)
            self.play(Flash(O1, color=YELLOW), Flash(O2, color=YELLOW), run_time=1)

        def rays(O):
            return [O + RIGHT, O + dv, O + LEFT, O - dv]

        def W(O, p, color, op=0.45):
            rs = rays(O)
            return wedge(O, rs[p], rs[(p + 1) % 4], 0.6, color, op)

        def Lb(O, p, color):
            rs = rays(O)
            return wlabel(O, rs[p], rs[(p + 1) % 4], "65°" if p % 2 == 0 else "115°", 0.6, color, 28)

        cols = [OR, BL, OR, BL]
        top4 = VGroup(*[W(O2, p, cols[p]) for p in range(4)])
        cross = VGroup(Line(O2 + LEFT * 1.4, O2 + RIGHT * 1.4, color=YELLOW, stroke_width=5),
                       Line(O2 - dv * 1.4, O2 + dv * 1.4, color=YELLOW, stroke_width=5), top4.copy())
        with self.voice("תסתכל על הצומת העליון. נעתיק אותו ונזיז אותו למטה, לאורך החותך. "
                        "הוא נוחת בדיוק על הצומת התחתון! שני הצמתים זהים.") as d:
            self.play(FadeIn(top4), run_time=1)
            self.add(cross)
            self.play(cross.animate.shift(O1 - O2), run_time=2.5)
            self.wait(0.5)
            self.play(FadeOut(cross[:2]), run_time=0.6)
        bot4 = cross[2]
        r1 = T("זוויות מתאימות", 42, OR).move_to([3.8, 2.3, 0])
        r1b = T("באותו מקום בכל צומת ← שוות", 30, OR).next_to(r1, DOWN, buff=0.2)
        c_top, c_bot = W(O2, 0, OR, 0.8), W(O1, 0, OR, 0.8)
        lab_t, lab_b = Lb(O2, 0, OR), Lb(O1, 0, OR)
        with self.voice("לכן זוויות שנמצאות באותו מקום בכל צומת, למשל שתיהן למעלה מימין, שוות. "
                        "הן נקראות זוויות מתאימות.") as d:
            self.play(FadeOut(top4), FadeOut(bot4), run_time=0.6)
            self.play(FadeIn(c_top), FadeIn(c_bot), run_time=1)
            self.play(Write(lab_t), Write(lab_b), Write(r1), run_time=1.5)
            self.play(FadeIn(r1b, shift=UP * 0.2), run_time=1)
        r2 = T("זוויות מתחלפות", 42, GN).move_to([3.8, 0.2, 0])
        r2b = T("בין המקבילים, משני צדי החותך ← שוות", 30, GN).next_to(r2, DOWN, buff=0.2)
        a_top, a_bot = W(O2, 2, GN, 0.8), W(O1, 0, GN, 0.8)
        lab_a = Lb(O2, 2, GN)
        zed = VMobject(color=YELLOW, stroke_width=8).set_points_as_corners(
            [O2 + LEFT * 2.2, O2, O1, O1 + RIGHT * 2.2])
        with self.voice("ויש עוד זוג חשוב: זוויות מתחלפות. הן נמצאות בין שני המקבילים, "
                        "אבל בצדדים שונים של החותך. הן יוצרות צורה של האות זד. וגם הן שוות.") as d:
            self.play(FadeOut(c_top), FadeOut(lab_t), FadeOut(c_bot), FadeOut(lab_b), r1.animate.set_opacity(0.5), r1b.animate.set_opacity(0.5), run_time=1)
            self.play(FadeIn(a_top), FadeIn(a_bot), Write(r2), run_time=1.5)
            self.play(Create(zed), run_time=2)
            self.play(Write(lab_a), Write(Lb(O1, 0, GN)), FadeIn(r2b, shift=UP * 0.2), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- זווית חיצונית ----------
    def exterior(self):
        A, B, C = tri(45, 75, 5.0, [-6.4, -2.2, 0])
        D = C + RIGHT * 2.6
        triangle = Polygon(A, B, C, color=WHITE, stroke_width=4)
        labs = VGroup(F("A", 36).next_to(A, UP, buff=0.15), F("B", 36).next_to(B, DL, buff=0.1),
                      F("C", 36).next_to(C, DOWN, buff=0.2), F("D", 36).next_to(D, DOWN, buff=0.2))
        wA, wB, wC = wedge(A, B, C, 0.8, OR), wedge(B, A, C, 0.9, BL), wedge(C, A, B, 0.6, GR)
        tA, tB, tC = wlabel(A, B, C, "60°", 0.8, OR), wlabel(B, A, C, "45°", 0.9, BL), wlabel(C, A, B, "75°", 0.6, GR)
        s180 = F("60° + 45° + 75° = 180°", 38).move_to([4.0, 2.6, 0])
        with self.voice("ועכשיו משולש. אתה כבר יודע שסכום הזוויות במשולש הוא תמיד מאה שמונים מעלות.") as d:
            self.play(Create(triangle), FadeIn(labs[:3]), run_time=1.5)
            self.play(FadeIn(VGroup(wA, wB, wC, tA, tB, tC)), run_time=1)
            self.play(Write(s180), run_time=1.5)
        ext = DashedLine(C, D, color=WHITE, stroke_width=4)
        wE = wedge(C, A, D, 1.2, PU, 0.35)
        tE = wlabel(C, A, D, "?", 1.2, PU, 36)
        name = T("זווית חיצונית", 40, PU).move_to([4.0, 1.5, 0])
        with self.voice("נמשיך את הצלע בי סי, מעבר לקודקוד סי. הזווית שנוצרת בחוץ, בין ההמשך לבין הצלע איי סי, "
                        "נקראת זווית חיצונית למשולש.") as d:
            self.play(Create(ext), FadeIn(labs[3]), run_time=1.5)
            self.play(FadeIn(wE), Write(tE), Write(name), run_time=1.5)
        with self.voice("כמה היא שווה? בוא נעביר את הזווית הכתומה ואת הזווית הכחולה לקודקוד סי.") as d:
            cb = wB.copy()
            self.play(cb.animate.shift(C - B), run_time=2)
            ca = wA.copy()
            self.play(ca.animate.shift(C - A), run_time=1.5)
            self.play(Rotate(ca, PI, about_point=C), run_time=1.5)
        rule = F("∠ACD = ∠A + ∠B", 44, PU).move_to([4.0, 0.4, 0])
        rule2 = T("סכום שתי הזוויות שלא צמודות לה", 32, PU).next_to(rule, DOWN, buff=0.25)
        tE2 = wlabel(C, A, D, "105°", 1.2, PU, 32)
        calc = F("60° + 45° = 105°", 38, PU).next_to(rule2, DOWN, buff=0.4)
        with self.voice("הן ממלאות בדיוק את הזווית החיצונית! אז הזווית החיצונית שווה לסכום שתי הזוויות הפנימיות "
                        "שלא צמודות לה. שישים ועוד ארבעים וחמש, מאה וחמש מעלות.") as d:
            self.play(Indicate(VGroup(ca, cb), scale_factor=1.15), run_time=1.5)
            self.play(Write(rule), FadeIn(rule2), run_time=2)
            self.play(Write(calc), ReplacementTransform(tE, tE2), run_time=1.5)
        why = R("וגם:", "75° + 105° = 180°", size=32, color=GR).next_to(calc, DOWN, buff=0.4)
        with self.voice("וזה הגיוני: הזווית החיצונית צמודה לזווית סי, ולכן יחד הן מאה שמונים. "
                        "בדיוק כמו שאיי ועוד בי ועוד סי הן מאה שמונים.") as d:
            self.play(Indicate(wC, color=WHITE, scale_factor=1.5), run_time=1.2)
            self.play(FadeIn(why, shift=UP * 0.2), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- דוגמה עם משוואה ----------
    def example(self):
        A, B, C = tri(50, 80, 4.6, [-6.4, -2.0, 0])
        D = C + RIGHT * 2.4
        fig = VGroup(Polygon(A, B, C, color=WHITE, stroke_width=4), DashedLine(C, D, stroke_width=4),
                     F("A", 34).next_to(A, UP, buff=0.15), F("B", 34).next_to(B, DL, buff=0.1),
                     F("C", 34).next_to(C, DOWN, buff=0.2), F("D", 34).next_to(D, DOWN, buff=0.2),
                     wedge(A, B, C, 0.7, OR), wedge(B, A, C, 0.8, BL), wedge(C, A, D, 0.9, PU, 0.5),
                     wlabel(A, B, C, "<i>x</i> + 20", 0.7, OR, 32), wlabel(B, A, C, "50°", 0.8, BL, 32),
                     wlabel(C, A, D, "3<i>x</i> + 10", 0.9, PU, 32))
        head = T("דוגמה", 44, YELLOW).move_to([3.6, 3.0, 0])
        with self.voice("בוא נפתור דוגמה. זווית איי היא איקס ועוד עשרים. זווית בי היא חמישים מעלות. "
                        "והזווית החיצונית היא שלוש איקס ועוד עשר. מה איקס?") as d:
            self.play(FadeIn(head), Create(fig[:6]), run_time=2)
            for i in (6, 7, 8):
                self.play(FadeIn(fig[i]), FadeIn(fig[i + 3]), run_time=1.2)
        e1 = F("3<i>x</i> + 10 = (<i>x</i> + 20) + 50", 40).move_to([3.6, 1.8, 0])
        e2 = F("3<i>x</i> + 10 = <i>x</i> + 70", 40).next_to(e1, DOWN, buff=0.35)
        e3 = F("2<i>x</i> = 60", 40).next_to(e2, DOWN, buff=0.35)
        e4 = F("<i>x</i> = 30", 46, YELLOW).next_to(e3, DOWN, buff=0.35)
        box = SurroundingRectangle(e4, color=YELLOW, buff=0.15)
        with self.voice("החוק אומר: הזווית החיצונית שווה לסכום שתי הזוויות הרחוקות. אז כותבים משוואה: "
                        "שלוש איקס ועוד עשר, שווה איקס ועוד עשרים, ועוד חמישים.") as d:
            self.play(Indicate(fig[8], scale_factor=1.2), run_time=1)
            self.play(Indicate(fig[6]), Indicate(fig[7]), run_time=1)
            self.play(Write(e1), run_time=2)
        with self.voice("מכנסים: איקס ועוד שבעים. מחסירים איקס ומחסירים עשר: שתיים איקס שווה שישים. "
                        "ולכן איקס שווה שלושים.") as d:
            self.play(Write(e2), run_time=1.5)
            self.play(Write(e3), run_time=1.5)
            self.play(Write(e4), Create(box), run_time=1.5)
        chk = VGroup(R("זווית", "A", "=", "30 + 20 = 50°", size=32),
                     R("החיצונית", "=", "3·30 + 10 = 100°", size=32),
                     R("בדיקה:", "50 + 50 = 100", "✓", size=32, color=GN)).arrange(DOWN, buff=0.22).next_to(box, DOWN, buff=0.4)
        with self.voice("בודקים: זווית איי היא חמישים, והזווית החיצונית היא מאה. "
                        "חמישים ועוד חמישים זה באמת מאה. מצוין!") as d:
            for m in chk:
                self.play(FadeIn(m, shift=UP * 0.2), run_time=1)
                self.wait(0.6)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- טעות נפוצה ----------
    def mistake(self):
        A, B, C = tri(50, 70, 4.6, [-6.4, -1.8, 0])
        D = C + RIGHT * 2.4
        fig = VGroup(Polygon(A, B, C, color=WHITE, stroke_width=4), DashedLine(C, D, stroke_width=4),
                     F("A", 34).next_to(A, UP, buff=0.15), F("B", 34).next_to(B, DL, buff=0.1),
                     F("C", 34).next_to(C, DOWN, buff=0.2), F("D", 34).next_to(D, DOWN, buff=0.2),
                     wedge(C, A, D, 0.9, PU, 0.5))
        wC = wedge(C, A, B, 0.6, RED_C, 0.6)
        wA, wB = wedge(A, B, C, 0.7, GN, 0.6), wedge(B, A, C, 0.8, GN, 0.6)
        head = T("טעות נפוצה", 44, RED_C).move_to([3.6, 2.8, 0])
        bad = VGroup(F("∠ACD = ∠A + ∠C", 40, RED_C), T("✗", 44, RED_C, font=MATH)).arrange(RIGHT, buff=0.3).move_to([3.6, 1.4, 0])
        good = VGroup(F("∠ACD = ∠A + ∠B", 40, GN), T("✓", 44, GN, font=MATH)).arrange(RIGHT, buff=0.3).move_to([3.6, -0.2, 0])
        tip = T("הזוויות שלא נוגעות בזווית החיצונית", 30, GN).next_to(good, DOWN, buff=0.3)
        with self.voice("ועכשיו טעות נפוצה. יש תלמידים שמחברים את הזווית סי, שצמודה לזווית החיצונית. זה לא נכון!") as d:
            self.play(FadeIn(fig), Write(head), run_time=1.5)
            self.play(FadeIn(wC), Write(bad), run_time=1.5)
            self.play(Wiggle(bad), run_time=1)
        with self.voice("מחברים רק את שתי הזוויות הרחוקות, אלה שלא נוגעות בזווית החיצונית: איי ובי.") as d:
            self.play(FadeOut(wC), FadeIn(wA), FadeIn(wB), run_time=1)
            self.play(Write(good), run_time=1.5)
            self.play(FadeIn(tip, shift=UP * 0.2), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- סיכום ----------
    def summary(self):
        head = T("מה למדנו?", 56, font=TITLE).to_edge(UP, buff=0.4)
        lines = VGroup(
            T("קודקודיות (אחת מול השנייה) — שוות", 36, OR),
            R("צמודות (אחת ליד השנייה) — סכום", "180°", size=36, color=BL),
            T("בין מקבילים: מתאימות שוות, מתחלפות שוות", 36, GN),
            R("זווית חיצונית", "=", "סכום שתי הזוויות הרחוקות", size=36, color=PU),
        ).arrange(DOWN, buff=0.45, aligned_edge=RIGHT).next_to(head, DOWN, buff=0.6)
        with self.voice("אז מה למדנו? זוויות קודקודיות שוות. זוויות צמודות, סכומן מאה שמונים. "
                        "בין ישרים מקבילים, זוויות מתאימות ומתחלפות שוות. "
                        "וזווית חיצונית למשולש שווה לסכום שתי הזוויות הפנימיות הרחוקות.") as d:
            self.play(Write(head), run_time=1)
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 4 - 1.4, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, BALL).to_edge(DOWN, buff=0.6)
        with self.voice("עכשיו תורך! גלול למטה, גרור את הנקודות בכלים, ותראה בעצמך שהחוקים תמיד עובדים. "
                        "ואז נסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
