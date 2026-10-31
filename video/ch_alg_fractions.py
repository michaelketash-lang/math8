"""סרטון: תחום הצבה, צמצום שברים אלגבריים, משוואות עם שברים, וערך מוחלט (כיתה ח׳, כרך ב׳ פרקים 13–14).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_alg_fractions.py AlgFractions
"""
from common import *

add_pron({"הסוגריים": "הַסוֹגריים", "סוגריים": "סוֹגריים"})


def F(s, size=52, color=WHITE):
    """נוסחה (בלי עברית). x נטוי."""
    s = s.replace("<", "&lt;").replace(">", "&gt;")
    return MarkupText(s.replace("x", "<i>x</i>"), font=MATH, font_size=size, color=color)


def FR(num, den, size=52, color=WHITE):
    """שבר: מונה, קו, מכנה."""
    n, d = F(num, size, color), F(den, size, color)
    w = max(n.width, d.width) + 0.2
    bar = Line(LEFT * w / 2, RIGHT * w / 2, color=color, stroke_width=3)
    return VGroup(n.next_to(bar, UP, buff=0.12), bar, d.next_to(bar, DOWN, buff=0.12))


def row(*mobs, buff=0.25):
    return VGroup(*mobs).arrange(RIGHT, buff=buff)


class AlgFractions(Narrated):
    def construct(self):
        self.story()
        self.reduce()
        self.equation()
        self.absval()
        self.abs_graph()
        self.abs_eq()
        self.summary()

    def clear(self):
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- תחום הצבה ----------
    def story(self):
        title = T("שברים אלגבריים וערך מוחלט", 60, font=TITLE)
        with self.voice("המאמן רוצה לחלק שנים עשר כדורים שווה בשווה בין השחקנים. "
                        "אם יש איקס שחקנים, כל אחד מקבל שתים עשרה חלקי איקס כדורים.") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
            balls = VGroup(*[Circle(0.2, color=BALL, fill_opacity=0.85) for _ in range(12)]).arrange_in_grid(2, 6, buff=0.25).shift(LEFT * 3 + UP * 0.5)
            fr = FR("12", "x", 72).shift(RIGHT * 3 + UP * 0.5)
            self.play(LaggedStart(*[FadeIn(b, scale=0.5) for b in balls], lag_ratio=0.08), run_time=1.5)
            self.play(Write(fr), run_time=1.2)
        self.title = title
        tbl = VGroup(*[row(F(f"x = {n}", 40), F("→", 40, GREY_B), F(v, 40, c)) for n, v, c in
                       (("4", "3", GREEN_C), ("3", "4", GREEN_C), ("0", "12 ÷ 0 = ?", RED_C))]).arrange(DOWN, buff=0.3, aligned_edge=LEFT).shift(DOWN * 1.8)
        with self.voice("ארבעה שחקנים? כל אחד מקבל שלושה. שלושה שחקנים? ארבעה כדורים. "
                        "אבל אפס שחקנים? אי אפשר לחלק לאף אחד! ובמתמטיקה: אסור לחלק באפס.") as d:
            for r in tbl:
                self.play(FadeIn(r, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 3 - 1.2, 0.3))
        self.play(FadeOut(VGroup(balls, fr, tbl)))

        fr2 = FR("5", "x − 3", 80).shift(UP * 0.6 + LEFT * 2.5)
        den = fr2[2]
        sub = F("x − 3 = 0  →  x = 3", 52, YELLOW).next_to(fr2, RIGHT, buff=1.2)
        rule = R("תחום ההצבה:", "<i>x</i> ≠ 3", size=46, color=YELLOW).shift(DOWN * 1.8)
        with self.voice("לכן בכל שבר צריך לבדוק: מה אסור להציב? בשבר חמש חלקי איקס פחות שלוש, "
                        "משווים את המכנה לאפס: איקס פחות שלוש שווה אפס, כלומר איקס שווה שלוש. "
                        "את שלוש אסור להציב. זה נקרא תחום ההצבה: איקס שונה משלוש.") as d:
            self.play(Write(fr2), run_time=1.5)
            self.play(Indicate(den, color=RED_C, scale_factor=1.3), run_time=1.2)
            self.play(Write(sub), run_time=2)
            self.wait(max(d - 7.5, 0.3))
            self.play(FadeIn(rule, shift=UP * 0.2), run_time=1)
        self.clear()

    # ---------- צמצום ----------
    def reduce(self):
        head = T("צמצום שבר אלגברי: קודם מפרקים!", 44, YELLOW).next_to(self.title, DOWN, buff=0.35)
        f1 = FR("3x + 6", "x + 2", 70)
        f2 = FR("3(x + 2)", "x + 2", 70)
        eq = row(f1, F("=", 70), f2, F("=", 70), F("3", 80, YELLOW), buff=0.4).shift(UP * 0.2)
        with self.voice("עכשיו צמצום. איך מצמצמים את השבר שלוש איקס ועוד שש, חלקי איקס ועוד שתיים? "
                        "הסוד: קודם מפרקים. מוציאים גורם משותף במונה: שלוש כפול, סוגריים, איקס ועוד שתיים.") as d:
            self.play(FadeIn(head), Write(eq[0]), run_time=2)
            self.wait(max(d - 5, 0.3))
            self.play(Write(eq[1]), Write(eq[2]), run_time=2)
        top = eq[2][0][1:]  # (x+2) במונה
        bot = eq[2][2]
        crosses = VGroup(*[Line(m.get_corner(DL), m.get_corner(UR), color=RED, stroke_width=5) for m in (top, bot)])
        with self.voice("עכשיו יש את אותו גורם, סוגריים איקס ועוד שתיים, גם במונה וגם במכנה. "
                        "מצמצמים אותו, ונשאר פשוט שלוש. כמובן, רק כשאיקס שונה ממינוס שתיים.") as d:
            self.play(Indicate(top, color=ORANGE), Indicate(bot, color=ORANGE), run_time=1.5)
            self.play(Create(crosses), run_time=1)
            self.play(Write(eq[3]), Write(eq[4]), run_time=1.5)
        self.play(FadeOut(VGroup(eq, crosses)))
        bad = row(FR("x + 5", "5", 70, RED_C), F("≠  x", 70, RED_C), buff=0.4).shift(UP * 0.4)
        why = T("מצמצמים רק כופלים — לא חלק מסכום!", 40, RED_C).next_to(bad, DOWN, buff=0.7)
        with self.voice("וטעות מאוד נפוצה: לצמצם את החמש באיקס ועוד חמש, חלקי חמש. אסור! "
                        "החמש למעלה הוא חלק מחיבור, לא מכפלה. מצמצמים רק גורמים שכופלים את כל המונה ואת כל המכנה.") as d:
            self.play(FadeIn(bad), run_time=1.2)
            self.play(Create(Cross(bad, stroke_color=RED, stroke_width=6)), run_time=1)
            self.play(FadeIn(why), run_time=1)
        self.clear()

    # ---------- משוואה עם שבר ----------
    def equation(self):
        head = T("משוואה עם שבר אלגברי", 44, YELLOW).next_to(self.title, DOWN, buff=0.35)
        e0 = row(FR("3x − 12", "x − 4", 60), F("= x", 60)).next_to(head, DOWN, buff=0.3)
        with self.voice("ועכשיו משוואה: שלוש איקס פחות שתים עשרה, חלקי איקס פחות ארבע, שווה איקס.") as d:
            self.play(FadeIn(head), Write(e0), run_time=2)
        s1 = R("שלב 1 — תחום הצבה:", "<i>x</i> ≠ 4", size=38, color=GREY_A)
        s2 = row(FR("3(x − 4)", "x − 4", 48), F("= x", 48))
        s3 = F("3 = x", 56, YELLOW)
        steps = VGroup(s1, s2, s3).arrange(DOWN, buff=0.3).next_to(e0, DOWN, buff=0.4)
        with self.voice("שלב ראשון, תמיד: תחום ההצבה. המכנה מתאפס כשאיקס שווה ארבע, אז איקס שונה מארבע.") as d:
            self.play(FadeIn(s1, shift=UP * 0.2), run_time=1.2)
        with self.voice("עכשיו מפרקים את המונה: שלוש כפול איקס פחות ארבע. מצמצמים, ונשאר: שלוש שווה איקס.") as d:
            self.play(Write(s2), run_time=1.5)
            self.wait(max(d - 3.2, 0.3))
            self.play(Write(s3), run_time=1.2)
        ok = R("האם", "3", "מותר? כן, כי", "3 ≠ 4", "✔", size=38, color=GREEN_C).next_to(steps, DOWN, buff=0.4)
        with self.voice("ושלב אחרון: בודקים שהפתרון מותר. שלוש שונה מארבע, אז הפתרון הוא איקס שווה שלוש. "
                        "אם היה יוצא ארבע, זה לא היה פתרון בכלל!") as d:
            self.play(FadeIn(ok, shift=UP * 0.2), run_time=1.2)
        self.clear()

    # ---------- ערך מוחלט ----------
    def absval(self):
        head = T("ערך מוחלט = מרחק מאפס", 44, YELLOW).next_to(self.title, DOWN, buff=0.35)
        nl = NumberLine(x_range=[-6, 6, 1], length=11, color=GREY_B, include_tip=False).shift(DOWN * 0.3)
        nums = VGroup(*[T(str(n).replace("-", "−"), 26, GREY_B).next_to(nl.n2p(n), DOWN, buff=0.2) for n in range(-6, 7, 2)])
        hoop = VGroup(Circle(0.25, color=BALL, stroke_width=5).move_to(nl.n2p(0) + UP * 0.9),
                      Line(nl.n2p(0) + UP * 0.6, nl.n2p(0), color=GREY_B))
        with self.voice("עכשיו נושא חדש: ערך מוחלט. דמיין שהסל נמצא בנקודה אפס, על קו ישר.") as d:
            self.play(FadeIn(head), Create(nl), FadeIn(nums), run_time=1.5)
            self.play(FadeIn(hoop), run_time=1)
        pa, pb = Dot(nl.n2p(5), color=BLUE_C, radius=0.16), Dot(nl.n2p(-5), color=ORANGE, radius=0.16)
        ba = DoubleArrow(nl.n2p(0) + UP * 0.35, nl.n2p(5) + UP * 0.35, buff=0, color=BLUE_C, tip_length=0.2)
        bb = DoubleArrow(nl.n2p(0) + UP * 0.35, nl.n2p(-5) + UP * 0.35, buff=0, color=ORANGE, tip_length=0.2)
        la = F("|5| = 5", 48, BLUE_C).next_to(nl.n2p(3), UP, buff=1.0)
        lb = F("|−5| = 5", 48, ORANGE).next_to(nl.n2p(-3), UP, buff=1.0)
        with self.voice("שחקן אחד עומד בחמש, ושחקן אחר במינוס חמש. מי רחוק יותר מהסל? אף אחד! "
                        "שניהם במרחק חמש. זה הערך המוחלט: המרחק מאפס. "
                        "הערך המוחלט של חמש הוא חמש, וגם הערך המוחלט של מינוס חמש הוא חמש.") as d:
            self.play(FadeIn(pa), FadeIn(pb), run_time=1)
            self.wait(max(d / 3 - 1, 0.3))
            self.play(GrowFromCenter(ba), GrowFromCenter(bb), run_time=1.5)
            self.play(Write(la), Write(lb), run_time=1.5)
        note = T("ערך מוחלט אף פעם לא שלילי", 38, YELLOW).to_edge(DOWN, buff=0.6)
        with self.voice("ומרחק אף פעם לא שלילי, לכן גם ערך מוחלט אף פעם לא שלילי.") as d:
            self.play(FadeIn(note), run_time=1)
        self.clear()

    # ---------- גרף y = |x| ----------
    def abs_graph(self):
        ax = Axes(x_range=[-6, 6, 1], y_range=[-2, 7, 1], x_length=7, y_length=5.2, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=0.7).shift(DOWN * 0.4)
        labs = VGroup(*[T(str(x).replace("-", "−"), 22, GREY_B).next_to(ax.c2p(x, 0), DOWN, buff=0.12) for x in (-4, -2, 2, 4)],
                      *[T(str(y), 22, GREY_B).next_to(ax.c2p(0, y), LEFT, buff=0.12) for y in (2, 4, 6)])
        h, k = ValueTracker(0), ValueTracker(0)
        def vee():
            hv, kv = h.get_value(), k.get_value()
            l, r = max(-6, hv - (7 - kv)), min(6, hv + (7 - kv))  # לא לצאת מגבולות הצירים
            return VMobject(color=BLUE_C, stroke_width=5).set_points_as_corners(
                [ax.c2p(x, abs(x - hv) + kv) for x in (l, hv, r)])
        g = always_redraw(vee)
        def lab():
            hv, kv = round(h.get_value()), round(k.get_value())
            inner = "x" if hv == 0 else f"x − {hv}" if hv > 0 else f"x + {-hv}"
            tail = "" if kv == 0 else f" + {kv}" if kv > 0 else f" − {-kv}"
            return F(f"y = |{inner}|{tail}", 52, BLUE_C).to_edge(RIGHT, buff=0.8).shift(UP * 1.5)
        eq = always_redraw(lab)
        vtx = always_redraw(lambda: Dot(ax.c2p(h.get_value(), k.get_value()), color=YELLOW, radius=0.11))
        with self.voice("ככה נראה הגרף של וואי שווה ערך מוחלט של איקס. הוא נראה כמו האות וי. "
                        "בצד ימין הוא עולה, בצד שמאל הוא יורד, והנקודה הכי נמוכה, הקודקוד, היא אפס אפס.") as d:
            self.play(Create(ax), FadeIn(labs), run_time=1.2)
            self.play(Create(g), FadeIn(eq), run_time=2)
            self.play(FadeIn(vtx, scale=2), run_time=0.8)
        vl = always_redraw(lambda: R("קודקוד:", f"({round(h.get_value())}, {round(k.get_value())})", size=40, color=YELLOW).next_to(eq, DOWN, buff=0.5))
        with self.voice("ומה קורה עם ערך מוחלט של איקס פחות שתיים, ועוד אחת? כל ה־וי זז: "
                        "שתיים ימינה, ואחת למעלה. הקודקוד עובר לנקודה שתיים, אחת.") as d:
            self.play(FadeIn(vl), run_time=0.8)
            self.play(h.animate.set_value(2), run_time=2)
            self.play(k.animate.set_value(1), run_time=1.5)
        for m in (g, eq, vtx, vl):
            m.clear_updaters()
        self.clear()

    # ---------- משוואה ואי־שוויון ----------
    def abs_eq(self):
        head = T("משוואה ואי־שוויון עם ערך מוחלט", 44, YELLOW).next_to(self.title, DOWN, buff=0.35)
        q = F("|x − 2| = 3", 64).shift(UP * 1.6)
        nl = NumberLine(x_range=[-3, 7, 1], length=10, color=GREY_B, include_tip=False).shift(DOWN * 0.1)
        nums = VGroup(*[T(str(n).replace("-", "−"), 26, GREY_B).next_to(nl.n2p(n), DOWN, buff=0.2) for n in range(-3, 8)])
        c = Dot(nl.n2p(2), color=YELLOW, radius=0.13)
        with self.voice("עכשיו משוואה: ערך מוחלט של איקס פחות שתיים, שווה שלוש. "
                        "ערך מוחלט של איקס פחות שתיים זה המרחק בין איקס לשתיים. אז מחפשים מספרים במרחק שלוש משתיים.") as d:
            self.play(FadeIn(head), Write(q), run_time=1.5)
            self.play(Create(nl), FadeIn(nums), FadeIn(c), run_time=1.5)
        arr = VGroup(CurvedArrow(nl.n2p(2) + UP * 0.2, nl.n2p(5) + UP * 0.2, angle=-PI / 3, color=GREEN_C),
                     CurvedArrow(nl.n2p(2) + UP * 0.2, nl.n2p(-1) + UP * 0.2, angle=PI / 3, color=GREEN_C))
        sols = VGroup(Dot(nl.n2p(5), color=GREEN_C, radius=0.14), Dot(nl.n2p(-1), color=GREEN_C, radius=0.14))
        ans = R("<i>x</i> = 5", "או", "<i>x</i> = −1", size=48, color=GREEN_C).shift(DOWN * 1.5)
        alg = R("<i>x</i> − 2 = 3", "או", "<i>x</i> − 2 = −3", size=38, color=GREY_B).next_to(ans, DOWN, buff=0.35)
        with self.voice("שלוש ימינה משתיים: חמש. שלוש שמאלה: מינוס אחת. אז איקס שווה חמש, או איקס שווה מינוס אחת. "
                        "בחישוב: מה שבתוך הערך המוחלט שווה שלוש, או מינוס שלוש.") as d:
            self.play(Create(arr[0]), FadeIn(sols[0]), run_time=1.2)
            self.play(Create(arr[1]), FadeIn(sols[1]), run_time=1.2)
            self.play(FadeIn(ans, shift=UP * 0.2), run_time=1)
            self.wait(max(d - 5.5, 0.3))
            self.play(FadeIn(alg), run_time=1)
        self.play(FadeOut(VGroup(q, arr, sols, ans, alg, c)))

        q2 = F("|x − 2| < 3", 64, YELLOW).shift(UP * 1.6)
        seg = Line(nl.n2p(-1), nl.n2p(5), color=GREEN_C, stroke_width=12)
        ends = VGroup(*[Circle(0.13, color=GREEN_C, stroke_width=4).set_fill(config.background_color, 1).move_to(nl.n2p(v)) for v in (-1, 5)])
        a2 = F("−1 < x < 5", 52, GREEN_C).shift(DOWN * 1.5)
        with self.voice("ואי־שוויון: ערך מוחלט של איקס פחות שתיים קטן משלוש. כלומר: המרחק משתיים קטן משלוש. "
                        "אלה כל המספרים שבין מינוס אחת לחמש.") as d:
            self.play(Write(q2), run_time=1.2)
            self.play(Create(seg), FadeIn(ends), run_time=1.5)
            self.play(Write(a2), run_time=1.2)
        q3 = F("|x − 2| > 3", 64, ORANGE).shift(UP * 1.6)
        rays = VGroup(Line(nl.n2p(5), nl.n2p(7), color=ORANGE, stroke_width=12), Line(nl.n2p(-3), nl.n2p(-1), color=ORANGE, stroke_width=12))
        a3 = R("<i>x</i> &gt; 5", "או", "<i>x</i> &lt; −1", size=48, color=ORANGE).shift(DOWN * 1.5)
        with self.voice("ואם המרחק גדול משלוש? אלה המספרים הרחוקים: גדולים מחמש, או קטנים ממינוס אחת.") as d:
            self.play(ReplacementTransform(q2, q3), FadeOut(seg), FadeOut(a2), run_time=1)
            self.play(Create(rays), ends.animate.set_stroke(ORANGE), run_time=1.5)
            self.play(FadeIn(a3), run_time=1)
        self.clear()

    # ---------- סיכום ----------
    def summary(self):
        lines = VGroup(
            T("אסור לחלק באפס: משווים את המכנה לאפס כדי למצוא תחום הצבה", 36),
            T("צמצום: קודם מפרקים, ואז מצמצמים גורם משותף", 36),
            T("במשוואה: בודקים שהפתרון מותר", 36),
            R("ערך מוחלט = מרחק מאפס:", "|−5| = |5| = 5", size=36),
            R("|<i>x</i> − <i>a</i>| = <i>c</i>", "← שני פתרונות, במרחק", "<i>c</i>", "מ־", "<i>a</i>", size=36),
        ).arrange(DOWN, buff=0.42, aligned_edge=RIGHT).shift(UP * 0.4)
        with self.voice("אז מה למדנו? אסור לחלק באפס, ולכן תמיד מוצאים את תחום ההצבה. "
                        "כדי לצמצם, קודם מפרקים, ורק אז מצמצמים. במשוואה עם שבר, בודקים שהפתרון מותר. "
                        "וערך מוחלט הוא מרחק מאפס, ולכן למשוואה עם ערך מוחלט יש בדרך כלל שני פתרונות.") as d:
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 5 - 1.1, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
