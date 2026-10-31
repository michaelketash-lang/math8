"""סרטון הסבר: מלבן, ניצבות והקבלה (כיתה ז׳), בסגנון 3Blue1Brown.

הרצה:  .venv/bin/manim -qh geometry.py Geometry
הקריינות נוצרת אוטומטית עם הקול העברי "Avri" (Microsoft, דרך edge-tts, דורש אינטרנט).
"""
from common import *


class Geometry(Narrated):

    def construct(self):
        self.intro()
        self.right_angle()
        self.rectangle()
        self.perpendicular()
        self.distance()
        self.parallel()
        self.summary()

    # ---------- פתיחה ----------
    def intro(self):
        c = court()
        with self.voice("בוא נסתכל על מגרש כדורסל, מלמעלה.") as d:
            self.play(Create(c, lag_ratio=0.15), run_time=d)
        title = T("מלבן, ניצבות והקבלה", 60, font=TITLE)
        sub = T("כל מה שמסתתר במגרש הכדורסל", 32, GREY_B).next_to(title, DOWN)
        VGroup(title, sub).to_edge(UP, buff=0.3)
        with self.voice("יש פה המון קווים. אבל הם לא סתם מצוירים. בתוך המגרש מסתתרים שלושה רעיונות "
                        "חשובים בגאומטריה: מלבן, ניצבות, והקבלה.") as d:
            self.play(c.animate.scale(0.75).shift(DOWN * 0.8), run_time=1.5)
            self.play(Write(title), FadeIn(sub, shift=UP * 0.2), run_time=2)
        self.court = c
        self.play(FadeOut(title), FadeOut(sub))

    # ---------- זווית ישרה וקיפול דף ----------
    def right_angle(self):
        c = self.court
        corner = c[0].get_corner(UL)
        mark = RightAngle(Line(corner, corner + RIGHT), Line(corner, corner + DOWN),
                          length=0.35, color=YELLOW, stroke_width=5)
        with self.voice("הכל מתחיל מזווית אחת מיוחדת: הזווית הישרה. "
                        "כמו הפינה של דף, או הפינה של המגרש.") as d:
            self.play(c[0].animate.set_color(WHITE), run_time=1)
            self.play(Create(mark), Flash(corner, color=YELLOW), run_time=1.5)
        self.play(FadeOut(c), FadeOut(mark))

        paper = Rectangle(width=9, height=5, fill_color="#f4efe3", fill_opacity=0.12,
                          stroke_color=GREY_B, stroke_width=2)
        left_half = Line([-4.5, 0.3, 0], [0.8, 0.3, 0], color=BLUE, stroke_width=6)
        right_half = Line([0.8, 0.3, 0], [4.5, 0.3, 0], color=BLUE, stroke_width=6)
        right_paper = Rectangle(width=3.7, height=5, fill_color="#f4efe3", fill_opacity=0.12,
                                stroke_width=0).move_to([2.65, 0, 0])
        flap = VGroup(right_paper, right_half)
        with self.voice("אפשר ליצור זווית ישרה גם בלי סרגל. קח דף עם קו ישר, "
                        "וקפל אותו כך שהקו יונח בדיוק על עצמו.") as d:
            self.play(FadeIn(paper), Create(left_half), Create(right_half), run_time=2)
            self.play(Rotate(flap, PI, axis=UP, about_point=[0.8, 0, 0]), run_time=2)
            self.wait(0.5)
            self.play(Rotate(flap, -PI, axis=UP, about_point=[0.8, 0, 0]), run_time=2)

        crease = DashedLine([0.8, 2.5, 0], [0.8, -2.5, 0], color=YELLOW, stroke_width=4)
        p = np.array([0.8, 0.3, 0])
        marks = VGroup(*[RightAngle(Line(p, p + h), Line(p, p + v), length=0.4, color=YELLOW)
                         for h in (LEFT, RIGHT) for v in (UP, DOWN)])
        deg = T("90°", 44, YELLOW).move_to(p + UR * 0.9)
        with self.voice("כשפותחים את הדף, קו הקיפול חותך את הקו בזווית ישרה, של תשעים מעלות. "
                        "את הזווית הישרה מסמנים בריבוע קטן.") as d:
            self.play(Create(crease), run_time=1.5)
            self.play(Create(marks[0]), Write(deg), run_time=1.5)
            self.play(LaggedStart(*[Create(m) for m in marks[1:]], lag_ratio=0.3), run_time=1.5)
        self.play(FadeOut(VGroup(paper, left_half, right_half, right_paper, crease, marks, deg)))

    # ---------- מלבן ----------
    def rectangle(self):
        w, h = 6, 3.4
        A, B, C, D = [np.array(p) for p in
                      ([-w / 2, -h / 2, 0], [w / 2, -h / 2, 0], [w / 2, h / 2, 0], [-w / 2, h / 2, 0])]
        rect = Polygon(A, B, C, D, color=BLUE, stroke_width=5).shift(DOWN * 0.3)
        A, B, C, D = rect.get_vertices()
        pts = [A, B, C, D]
        defn = T("מלבן = מרובע עם 4 זוויות ישרות", 42).to_edge(UP)
        marks = VGroup(*[RightAngle(Line(pts[i], pts[i - 1]), Line(pts[i], pts[(i + 1) % 4]),
                                    length=0.35, color=YELLOW, quadrant=(1, 1)) for i in range(4)])
        with self.voice("עכשיו אפשר להגדיר מלבן. מלבן הוא מרובע שיש לו ארבע זוויות ישרות.") as d:
            self.play(Create(rect), Write(defn), run_time=2)
            self.play(LaggedStart(*[Create(m) for m in marks], lag_ratio=0.4), run_time=2.5)

        dirs = [DL, DR, UR, UL]
        labels = VGroup(*[M(n, 44).next_to(p, dv, buff=0.15) for n, p, dv in zip("ABCD", pts, dirs)])
        with self.voice("נסמן את הקודקודים באותיות: איי, בי, סי, די. "
                        "שים לב, הולכים לפי הסדר, מסביב למלבן.") as d:
            self.play(LaggedStart(*[FadeIn(l, scale=1.5) for l in labels], lag_ratio=0.5), run_time=2.5)
            dot = Dot(A, color=YELLOW)
            self.play(MoveAlongPath(dot, rect), run_time=2.5, rate_func=smooth)
            self.remove(dot)

        def side(p, q, color):
            return Line(p, q, color=color, stroke_width=10)

        tag = lambda s, color: T(s, 38, color).next_to(rect, DOWN, buff=0.6)
        ab, bc = side(A, B, TEAL), side(B, C, TEAL)
        t1 = tag("צלעות סמוכות: נפגשות בקודקוד", TEAL)
        with self.voice("שתי צלעות שנפגשות באותו קודקוד נקראות צלעות סמוכות. למשל, איי-בי ובי-סי.") as d:
            self.play(Create(ab), Create(bc), FadeIn(t1), run_time=2)
            self.play(Indicate(labels[1], scale_factor=1.6, color=TEAL), run_time=1.5)

        dc = side(D, C, PINK)
        ab2 = side(A, B, PINK)
        t2 = tag("צלעות נגדיות: אחת מול השנייה", PINK)
        with self.voice("צלעות שנמצאות אחת מול השנייה נקראות צלעות נגדיות. למשל, איי-בי ודי-סי. "
                        "במלבן, צלעות נגדיות שוות באורכן.") as d:
            self.play(FadeOut(bc), ReplacementTransform(ab, ab2), Create(dc),
                      ReplacementTransform(t1, t2), run_time=2)
            self.play(dc.copy().animate.move_to(ab2), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects if m not in (rect, labels, defn, marks)])

        diag1 = DashedLine(A, C, color=GREEN, stroke_width=5)
        diag2 = DashedLine(B, D, color=GREEN, stroke_width=5)
        t3 = tag("אלכסון: מחבר קודקודים שאינם סמוכים", GREEN)
        with self.voice("קודקודים שמחוברים בצלע נקראים קודקודים סמוכים, כמו איי ובי. "
                        "ומה עם איי וסי? הם לא סמוכים. קטע שמחבר שני קודקודים שאינם סמוכים "
                        "נקרא אלכסון. למלבן יש שני אלכסונים: איי-סי ובי-די.") as d:
            self.play(Indicate(labels[0]), Indicate(labels[1]), run_time=1.5)
            self.wait(1)
            self.play(Indicate(labels[0], color=GREEN), Indicate(labels[2], color=GREEN), run_time=1.5)
            self.play(Create(diag1), FadeIn(t3), run_time=2)
            self.play(Create(diag2), run_time=1.5)

        c = court(0.3).shift(DOWN * 0.3)
        runner = Dot(c[0].get_corner(DL), color=BALL, radius=0.12)
        with self.voice("ובמגרש? המגרש כולו הוא מלבן. "
                        "אם תרוץ מפינה לפינה, רצת לאורך האלכסון.") as d:
            self.play(FadeOut(VGroup(labels, marks, t3, diag2, defn)),
                      ReplacementTransform(rect, c), run_time=2)
            self.play(diag1.animate.put_start_and_end_on(c[0].get_corner(DL), c[0].get_corner(UR)),
                      FadeIn(runner), run_time=1)
            self.play(runner.animate.move_to(c[0].get_corner(UR)), run_time=2)
        self.play(FadeOut(VGroup(c, diag1, runner)))

    # ---------- ניצבות ----------
    def perpendicular(self):
        defn = T("ניצבים = נחתכים בזווית ישרה", 42).to_edge(UP)
        o = DOWN * 0.5
        base = Line(o + LEFT * 4.5, o + RIGHT * 4.5, color=BLUE, stroke_width=5)
        ang = ValueTracker(35)
        spin = always_redraw(lambda: Line(o, o + 3 * np.array(
            [np.cos(ang.get_value() * DEGREES), np.sin(ang.get_value() * DEGREES), 0]),
            color=YELLOW, stroke_width=5))
        arc = always_redraw(lambda: Angle(base, Line(o, spin.get_end()), radius=0.7, color=WHITE))
        num = always_redraw(lambda: T(f"{ang.get_value():.0f}°", 40).move_to(
            o + 1.3 * np.array([np.cos(ang.get_value() * DEGREES / 2),
                                np.sin(ang.get_value() * DEGREES / 2), 0])))
        with self.voice("ועכשיו, ניצבות. שני ישרים ניצבים זה לזה אם הם נחתכים בזווית ישרה.") as d:
            self.play(Write(defn), Create(base), Create(spin), run_time=2)
            self.add(arc, num)
            self.wait(1)
        with self.voice("זווית של שישים מעלות? לא ניצבים. מאה ועשרים? גם לא. "
                        "רק בדיוק תשעים מעלות, והישרים ניצבים.") as d:
            self.play(ang.animate.set_value(60), run_time=1.5)
            self.wait(0.8)
            self.play(ang.animate.set_value(120), run_time=1.5)
            self.wait(0.8)
            self.play(ang.animate.set_value(90), run_time=1.5)
            self.remove(arc)
            sq = RightAngle(base, Line(o, o + UP), length=0.45, color=YELLOW, quadrant=(1, 1))
            self.play(Create(sq), Flash(o, color=YELLOW))
        sym = VGroup(M("AB"), T("⊥", 44, YELLOW, font=MATH), M("CD")).arrange(RIGHT).next_to(base, DOWN, buff=0.7)
        with self.voice("את זה מסמנים בסימן מיוחד, שנראה כמו ניצב קטן. "
                        "ובמגרש, קו הצד ניצב לקו הבסיס.") as d:
            self.play(FadeIn(sym, shift=UP * 0.2), run_time=1.5)
            self.wait(1)
            c = court(0.3).shift(DOWN * 0.4)
            self.play(FadeOut(VGroup(base, spin, num, sq, sym, defn)), FadeIn(c), run_time=1.5)
            p = c[0].get_corner(DR)
            sideline = Line(c[0].get_corner(DL), p, color=YELLOW, stroke_width=8)
            baseline = Line(p, c[0].get_corner(UR), color=TEAL, stroke_width=8)
            self.play(Create(sideline), Create(baseline), run_time=1.5)
            self.play(Create(RightAngle(Line(p, p + LEFT), Line(p, p + UP), length=0.4, color=WHITE)))
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- מרחק נקודה מישר ----------
    def distance(self):
        y0 = -2.6
        line = Line([-6.5, y0, 0], [6.5, y0, 0], color=COURT, stroke_width=6)
        ltag = T("קו הצד", 32, COURT).next_to(line, DOWN, buff=0.2).to_edge(RIGHT)
        P = np.array([0.8, 1.4, 0])
        player = Dot(P, color=BALL, radius=0.14)
        plabel = M("P", 44).next_to(player, UP)
        with self.voice("נניח שאתה עומד כאן, בנקודה פי, ורוצה להגיע לקו הצד הכי מהר שאפשר. לאן תרוץ?") as d:
            self.play(Create(line), FadeIn(ltag), run_time=1.5)
            self.play(FadeIn(player, scale=2), Write(plabel), run_time=1.5)

        x = ValueTracker(-5)
        seg = always_redraw(lambda: Line(P, [x.get_value(), y0, 0], color=WHITE, stroke_width=4))
        foot = always_redraw(lambda: Dot([x.get_value(), y0, 0], color=WHITE))
        meters = lambda: np.linalg.norm(P - np.array([x.get_value(), y0, 0])) * 1.25
        num = always_redraw(lambda: T(f"{meters():.1f} מ׳", 36, YELLOW).next_to(seg.get_center(), LEFT, buff=0.25))
        ghosts = VGroup()
        with self.voice("בוא נמדוד. ככה, המרחק ארוך. ככה, קצר יותר. "
                        "והנה הדרך הקצרה ביותר: בדיוק בזווית ישרה לקו.") as d:
            self.play(Create(seg), FadeIn(foot), FadeIn(num), run_time=1)
            for target in (-2.5, 5, 3, P[0]):
                ghosts.add(seg.copy().set_stroke(GREY, 2, opacity=0.5))
                self.add(ghosts)
                self.play(x.animate.set_value(target), run_time=1.6)
            seg.clear_updaters()
            self.play(seg.animate.set_color(YELLOW).set_stroke(width=7))
            q = np.array([P[0], y0, 0])
            self.play(Create(RightAngle(Line(q, q + RIGHT), Line(q, q + UP), length=0.35, color=YELLOW)))
        box = SurroundingRectangle(T("מרחק של נקודה מישר = אורך הניצב", 40), buff=0.25, color=YELLOW)
        rule = VGroup(T("מרחק של נקודה מישר = אורך הניצב", 40), box).to_edge(UP, buff=0.3)
        with self.voice("הקטע הזה נקרא הניצב מהנקודה לישר, והוא תמיד הקצר ביותר. "
                        "לכן, המרחק של נקודה מישר הוא האורך של הניצב.") as d:
            self.play(FadeOut(ghosts), run_time=1)
            self.play(Write(rule[0]), Create(rule[1]), run_time=2.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- מקבילים ----------
    def parallel(self):
        defn = T("מקבילים = לא נחתכים אף פעם", 42).to_edge(UP)
        top = Line([-3, 1.2, 0], [3, 1.2, 0], color=BLUE, stroke_width=5)
        bot = Line([-3, -1.8, 0], [3, -1.8, 0], color=BLUE, stroke_width=5)
        with self.voice("ואחרון, הקבלה. שני ישרים באותו מישור, שלא נחתכים אף פעם, "
                        "נקראים ישרים מקבילים.") as d:
            self.play(Write(defn), Create(top), Create(bot), run_time=2)
            self.play(top.animate.put_start_and_end_on([-7.5, 1.2, 0], [7.5, 1.2, 0]),
                      bot.animate.put_start_and_end_on([-7.5, -1.8, 0], [7.5, -1.8, 0]), run_time=2)
        xp = -2
        perp = Line([xp, -1.8, 0], [xp, 1.2, 0], color=YELLOW, stroke_width=5)
        q0, q1 = np.array([xp, -1.8, 0]), np.array([xp, 1.2, 0])
        sq0 = RightAngle(Line(q0, q0 + RIGHT), Line(q0, q0 + UP), length=0.35, color=YELLOW)
        sq1 = RightAngle(Line(q1, q1 + RIGHT), Line(q1, q1 + DOWN), length=0.35, color=GREEN)
        check = T("✓ מקבילים", 44, GREEN).move_to([2.5, -0.3, 0])
        with self.voice("אבל איך בודקים? אי אפשר ללכת עד האינסוף. יש טריק: מעלים ניצב מאחד הקווים. "
                        "אם הוא ניצב גם לקו השני, הקווים מקבילים.") as d:
            self.wait(2.5)
            self.play(Create(sq0), Create(perp), run_time=2)
            self.play(Create(sq1), FadeIn(check, scale=1.3), run_time=1.5)

        tilt = 6 * DEGREES
        f = lambda x: 1.2 - x * np.tan(tilt)
        tilted = Line([-7.5, f(-7.5), 0], [40, f(40), 0], color=RED_C, stroke_width=5)
        # the vertical perpendicular from bot meets the tilted line at 90-6 = 84 degrees
        hit = np.array([xp, f(xp), 0])
        perp2 = Line(q0, hit, color=YELLOW, stroke_width=5)
        a84 = Angle(Line(hit, q0), Line(hit, tilted.get_end()), radius=0.6, color=RED_C)
        t84 = T("84°", 40, RED_C).move_to(hit + [0.8, -0.6, 0])
        cross = T("✗ לא מקבילים", 44, RED_C).move_to([2.5, -0.6, 0])
        with self.voice("ואם לא? כאן הניצב פוגש את הקו השני בשמונים וארבע מעלות. לכן הקווים לא מקבילים, "
                        "ואם נמשיך אותם מספיק רחוק, נראה שהם נחתכים.") as d:
            self.play(FadeOut(check), FadeOut(sq1), ReplacementTransform(top, tilted),
                      Transform(perp, perp2), run_time=2)
            self.play(Create(a84), Write(t84), FadeIn(cross), run_time=1.5)
            bot_long = Line([-7.5, -1.8, 0], [40, -1.8, 0], color=BLUE, stroke_width=5)
            self.remove(bot)
            self.add(bot_long)
            world = VGroup(tilted, bot_long, perp, sq0, a84, t84)
            self.play(FadeOut(cross), FadeOut(defn), world.animate.scale(0.2, about_point=[-6, -1.8, 0]), run_time=2.5)
            inter = line_intersection([tilted.get_start(), tilted.get_end()], [bot_long.get_start(), bot_long.get_end()])
            self.play(Flash(inter, color=RED_C, flash_radius=0.4), FadeIn(Dot(inter, color=RED_C)))
        self.play(*[FadeOut(m) for m in self.mobjects])

        c = court(0.4).shift(DOWN * 0.3)
        sl_top = Line(c[0].get_corner(UL), c[0].get_corner(UR), color=YELLOW, stroke_width=8)
        sl_bot = Line(c[0].get_corner(DL), c[0].get_corner(DR), color=YELLOW, stroke_width=8)
        top_y, bot_y = c[0].get_top()[1], c[0].get_bottom()[1]
        xs = ValueTracker(c[0].get_left()[0] + 0.8)
        arrow = always_redraw(lambda: DoubleArrow([xs.get_value(), bot_y, 0], [xs.get_value(), top_y, 0],
                                                  buff=0, color=WHITE, stroke_width=4, tip_length=0.25))
        w15 = always_redraw(lambda: T("15 מ׳", 36).add_background_rectangle(
            color=config.background_color, opacity=1, buff=0.08).next_to(arrow, RIGHT, buff=0.15))
        rule = T("בין מקבילים, המרחק תמיד זהה", 42).to_edge(UP, buff=0.25)
        with self.voice("עוד דבר חשוב: בין שני ישרים מקבילים, המרחק תמיד זהה, בכל נקודה. "
                        "בגלל זה המגרש נראה אותו דבר לכל אורכו: שני קווי הצד מקבילים, "
                        "והרוחב שלו הוא חמישה עשר מטר, בכל מקום.") as d:
            self.play(FadeIn(c), Write(rule), run_time=1.5)
            self.play(Create(sl_top), Create(sl_bot), run_time=1.5)
            self.play(Create(arrow), FadeIn(w15))
            self.play(xs.animate.set_value(c[0].get_right()[0] - 0.8), run_time=max(d - 5, 3),
                      rate_func=there_and_back_with_pause)
        self.play(*[FadeOut(m) for m in self.mobjects])

        # פסי רכבת: אשליה של פרספקטיבה מול מבט מלמעלה
        vp = np.array([0, 2.6, 0])
        rails = VGroup(*[Line([s * 2.4, -4, 0], vp + [s * 0.05, -0.2, 0], color=GREY_A, stroke_width=6) for s in (-1, 1)])
        ties = VGroup()
        for k in range(12):
            t = 0.78 ** k
            y = vp[1] - 6.6 * t
            half = 2.4 * t + 0.05
            ties.add(Line([-half - 0.25 * t, y, 0], [half + 0.25 * t, y, 0], color="#8b5a2b", stroke_width=8 * t + 1))
        track = VGroup(ties, rails)
        with self.voice("וזה גם הסוד של פסי רכבת. נראה שהם נפגשים באופק, אבל זו רק אשליה. "
                        "המרחק ביניהם תמיד זהה, ולכן הם מקבילים.") as d:
            self.play(Create(ties, lag_ratio=0.1), Create(rails), run_time=2.5)
            self.play(Flash(vp, color=RED, flash_radius=0.4), run_time=1.5)
            flat_rails = VGroup(*[Line([s * 1.2, -4, 0], [s * 1.2, 4, 0], color=GREY_A, stroke_width=6) for s in (-1, 1)])
            flat_ties = VGroup(*[Line([-1.6, y, 0], [1.6, y, 0], color="#8b5a2b", stroke_width=8) for y in np.arange(-3.6, 4, 0.8)])
            self.play(ReplacementTransform(rails, flat_rails), ReplacementTransform(ties, flat_ties), run_time=2.5)
        self.play(*[FadeOut(m) for m in self.mobjects])

    # ---------- סיכום ----------
    def summary(self):
        head = T("מה למדנו?", 56, font=TITLE).to_edge(UP)

        def card(icon, title, line1, line2, color):
            box = RoundedRectangle(width=4, height=4.4, corner_radius=0.25, color=color, stroke_width=3)
            icon.scale_to_fit_height(1.2).move_to(box.get_top() + DOWN * 1.1)
            ttl = T(title, 40, color).next_to(icon, DOWN, buff=0.35)
            l1 = T(line1, 30).next_to(ttl, DOWN, buff=0.3)
            l2 = T(line2, 30).next_to(l1, DOWN, buff=0.15)
            return VGroup(box, icon, ttl, l1, l2)

        r = Rectangle(width=2, height=1.2, color=BLUE)
        perp = VGroup(Line(LEFT, RIGHT, color=YELLOW), Line(ORIGIN, UP * 1.2, color=YELLOW))
        par = VGroup(Line(LEFT, RIGHT, color=GREEN).shift(UP * 0.5), Line(LEFT, RIGHT, color=GREEN).shift(DOWN * 0.5))
        # RTL order: first card on the right
        cards = VGroup(
            card(par, "מקבילים", "לא נחתכים אף פעם", "המרחק ביניהם קבוע", GREEN),
            card(perp, "ניצבים", "נחתכים בזווית ישרה", "הניצב = הדרך הקצרה", YELLOW),
            card(r, "מלבן", "מרובע עם", "4 זוויות ישרות", BLUE),
        ).arrange(RIGHT, buff=0.4).next_to(head, DOWN, buff=0.4)
        with self.voice("אז מה למדנו? מלבן: מרובע עם ארבע זוויות ישרות. "
                        "ניצבים: נחתכים בזווית ישרה, והניצב הוא הדרך הקצרה ביותר. "
                        "מקבילים: לא נחתכים, והמרחק ביניהם קבוע.") as d:
            self.play(Write(head), run_time=1)
            for cd in reversed(cards):
                self.play(FadeIn(cd, shift=UP * 0.3), run_time=1.2)
                self.wait(max(d / 3 - 1.8, 0.2))
        challenge = T("אתגר: מצא במגרש 2 קווים מקבילים ו־2 קווים ניצבים", 36, BALL).to_edge(DOWN, buff=0.4)
        with self.voice("ועכשיו אתגר בשבילך: בפעם הבאה שאתה על המגרש, "
                        "מצא שני קווים מקבילים ושני קווים ניצבים. בהצלחה!") as d:
            self.play(cards.animate.scale(0.85).shift(UP * 0.2), FadeIn(challenge, shift=UP * 0.3), run_time=1.5)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
