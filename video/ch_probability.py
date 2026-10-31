"""סרטון: הסתברות (כיתה ח׳, כרך ב׳ פרק 9).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_probability.py Probability
"""
import random

from common import *

add_pron({"ודאי": "וַדַּאי", "ודאית": "וַדָּאִית", "פלי": "פָּלִי"})


def EQ(s, size=48, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def FR(a, b, size=48, color=WHITE):
    n, d = EQ(str(a), size, color), EQ(str(b), size, color)
    w = max(n.width, d.width) + 0.25
    ln = Line(LEFT * w / 2, RIGHT * w / 2, stroke_width=3, color=color)
    n.next_to(ln, UP, buff=0.12)
    d.next_to(ln, DOWN, buff=0.12)
    return VGroup(n, ln, d)


PIPS = {1: [(0, 0)], 2: [(-1, 1), (1, -1)], 3: [(-1, 1), (0, 0), (1, -1)], 4: [(-1, 1), (1, 1), (-1, -1), (1, -1)],
        5: [(-1, 1), (1, 1), (0, 0), (-1, -1), (1, -1)], 6: [(-1, 1), (1, 1), (-1, 0), (1, 0), (-1, -1), (1, -1)]}


def die(n, s=0.9, color=WHITE):
    sq = RoundedRectangle(width=s, height=s, corner_radius=0.12, color=color, stroke_width=3, fill_color="#1b2029", fill_opacity=1)
    dots = VGroup(*[Dot([x * s * 0.27, y * s * 0.27, 0], radius=s * 0.075, color=color) for x, y in PIPS[n]])
    return VGroup(sq, dots)


def ball(color, r=0.25):
    return Circle(radius=r, color=color, fill_opacity=1, stroke_width=0)


class Probability(Narrated):
    def construct(self):
        self.story()
        self.kinds()
        self.fraction()
        self.bag()
        self.experiment()
        self.mistake()
        self.summary()

    def clear(self, keep=()):
        self.play(*[FadeOut(m) for m in self.mobjects if m not in keep], run_time=0.8)

    # ---------- פתיח ----------
    def story(self):
        title = T("הסתברות", 72, font=TITLE)
        with self.voice("רוני עומד על קו העונשין. שנייה לפני הזריקה כולם שואלים: הוא יקלע או לא?") as d:
            self.play(Write(title), run_time=1.5)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
        self.title = title
        board = Rectangle(width=0.15, height=1.6, color=GREY_B, fill_opacity=1).move_to(RIGHT * 4.5 + UP * 1.2)
        rim = Line(RIGHT * 4.4 + UP * 0.7, RIGHT * 3.6 + UP * 0.7, color=BALL, stroke_width=6)
        net = VGroup(*[Line(RIGHT * (3.6 + 0.2 * i) + UP * 0.7, RIGHT * (3.7 + 0.15 * i) + UP * 0.1, color=GREY_B, stroke_width=2) for i in range(5)])
        b = VGroup(Circle(radius=0.28, color=BALL, fill_opacity=1, stroke_width=0),
                   Line(LEFT * 0.28, RIGHT * 0.28, color="#5a2a0a", stroke_width=2)).move_to(LEFT * 4 + DOWN * 1.5)
        path = ArcBetweenPoints(b.get_center(), RIGHT * 4.0 + UP * 0.95, angle=-PI / 2.2)
        q = T("יקלע?", 60, YELLOW).move_to(DOWN * 0.3)
        with self.voice("אי אפשר לדעת בוודאות. אבל אפשר לדעת מה הסיכוי. "
                        "למדע של הסיכויים קוראים הסתברות.") as d:
            self.play(FadeIn(board), Create(rim), Create(net), FadeIn(b), run_time=1)
            self.play(MoveAlongPath(b, path), run_time=1.8, rate_func=rate_functions.ease_in_out_sine)
            self.play(FadeIn(q, scale=1.3), run_time=0.8)
        self.clear(keep=[title])

    # ---------- בלתי אפשרי, אפשרי, ודאי ----------
    def kinds(self):
        dice = VGroup(*[die(n, 0.8) for n in range(1, 7)]).arrange(RIGHT, buff=0.3).to_edge(UP, buff=1.3)
        with self.voice("נתחיל בקובייה. יש לה שש תוצאות אפשריות: אחת, שתיים, שלוש, ארבע, חמש ושש.") as d:
            self.play(LaggedStart(*[FadeIn(x, shift=DOWN * 0.3) for x in dice], lag_ratio=0.2), run_time=2.5)
        line = Line(LEFT * 5, RIGHT * 5, color=WHITE).shift(DOWN * 1.6)
        ticks = VGroup(*[Line(UP * 0.15, DOWN * 0.15).move_to(line.point_from_proportion(p)) for p in (0, 0.5, 1)])
        nums = VGroup(EQ("0", 36).next_to(ticks[0], DOWN), EQ("½", 36).next_to(ticks[1], DOWN), EQ("1", 36).next_to(ticks[2], DOWN))
        k0 = T("בלתי אפשרי", 30, RED_C).next_to(nums[0], DOWN, buff=0.15)
        k1 = T("ודאי", 30, GREEN_C).next_to(nums[2], DOWN, buff=0.15)
        with self.voice("נצייר סרגל של סיכויים. בצד אחד אפס, ובצד השני אחת.") as d:
            self.play(Create(line), FadeIn(ticks), FadeIn(nums), run_time=1.5)
        s0 = T("יוצא 7", 40, RED_C).move_to(UP * 0.4)
        a0 = Arrow(s0.get_bottom(), line.get_left() + UP * 0.15, color=RED_C, buff=0.15)
        with self.voice("מה הסיכוי שיצא שבע? אין שבע בקובייה! זה בלתי אפשרי. ההסתברות היא אפס.") as d:
            self.play(FadeIn(s0), run_time=1)
            self.wait(1.5)
            self.play(GrowArrow(a0), FadeIn(k0), run_time=1)
        s1 = T("יוצא מספר קטן מ־7", 40, GREEN_C).move_to(UP * 0.4)
        a1 = Arrow(s1.get_bottom(), line.get_right() + UP * 0.15, color=GREEN_C, buff=0.15)
        with self.voice("ומה הסיכוי שיצא מספר קטן משבע? כל המספרים בקובייה קטנים משבע, אז זה קורה תמיד. "
                        "זה ודאי, וההסתברות היא אחת.") as d:
            self.play(FadeOut(s0), FadeOut(a0), FadeIn(s1), run_time=1)
            self.wait(2.5)
            self.play(GrowArrow(a1), FadeIn(k1), run_time=1)
        s2 = T("יוצא 6", 40, YELLOW).move_to(UP * 0.4)
        a2 = Arrow(s2.get_bottom(), line.point_from_proportion(1 / 6) + UP * 0.15, color=YELLOW, buff=0.15)
        k2 = T("אפשרי", 30, YELLOW).next_to(line.point_from_proportion(0.33), UP, buff=0.25)
        with self.voice("ושש? זה יכול לקרות, ויכול גם לא לקרות. זה אפשרי. "
                        "ההסתברות של מאורע אפשרי נמצאת בין אפס לאחת.") as d:
            self.play(FadeOut(s1), FadeOut(a1), FadeIn(s2), run_time=1)
            self.play(GrowArrow(a2), FadeIn(k2), run_time=1)
            self.play(Indicate(dice[5], color=YELLOW), run_time=1.2)
        self.clear(keep=[self.title])

    # ---------- הסתברות כשבר ----------
    def fraction(self):
        dice = VGroup(*[die(n, 1.0) for n in range(1, 7)]).arrange(RIGHT, buff=0.35).move_to(UP * 1.4)
        q = T("מה הסיכוי לקבל מספר זוגי?", 40).to_edge(UP, buff=1.2)
        with self.voice("אבל כמה בדיוק? מה הסיכוי לקבל מספר זוגי?") as d:
            self.play(FadeIn(q), FadeIn(dice), run_time=1.5)
        good = VGroup(dice[1], dice[3], dice[5])
        with self.voice("מתוך שש התוצאות, שלוש מתאימות לנו: שתיים, ארבע ושש.") as d:
            self.play(*[x[0].animate.set_stroke(ORANGE, 6) for x in good], *[x[1].animate.set_color(ORANGE) for x in good], run_time=1.5)
        rule_top, rule_bot = T("מספר התוצאות המתאימות", 34, ORANGE), T("מספר כל התוצאות", 34)
        bar = Line(LEFT * 2.3, RIGHT * 2.3, stroke_width=3)
        rule_top.next_to(bar, UP, buff=0.15)
        rule_bot.next_to(bar, DOWN, buff=0.15)
        rule = VGroup(rule_top, bar, rule_bot)
        chain = VGroup(FR(3, 6, 56, ORANGE), EQ("=", 56), FR(1, 2, 56), EQ("= 50%", 56)).arrange(RIGHT, buff=0.3)
        eqs = VGroup(VGroup(T("הסתברות =", 34), rule).arrange(LEFT, buff=0.3), chain).arrange(DOWN, buff=0.5)
        eqs.move_to(DOWN * 1.1)
        with self.voice("ההסתברות היא שבר: למעלה, מספר התוצאות המתאימות. למטה, מספר כל התוצאות. "
                        "שלוש חלקי שש, שזה חצי, כלומר חמישים אחוז.") as d:
            self.play(FadeIn(eqs[0]), run_time=1.5)
            self.wait(2)
            self.play(LaggedStart(*[FadeIn(x) for x in chain], lag_ratio=0.4), run_time=2.5)
        note = T("זה נכון כשלכל התוצאות יש אותו סיכוי", 30, GREY_B).to_edge(DOWN, buff=0.4)
        with self.voice("שים לב: זה עובד כשלכל התוצאות יש אותו סיכוי, כמו בקובייה הוגנת.") as d:
            self.play(FadeIn(note), run_time=1)
        self.clear(keep=[self.title])

    # ---------- שקית כדורים ----------
    def bag(self):
        cols = [ORANGE] * 4 + [BLUE_C] * 5 + [GREEN_C]
        balls = VGroup(*[ball(c) for c in cols]).arrange_in_grid(rows=2, buff=0.18).move_to(LEFT * 3.5 + DOWN * 0.2)
        sack = RoundedRectangle(width=balls.width + 0.8, height=balls.height + 1.0, corner_radius=0.5,
                                color=GREY_B, stroke_width=3).move_to(balls).shift(UP * 0.15)
        with self.voice("עכשיו שקית עם עשרה כדורים: ארבעה כתומים, חמישה כחולים ואחד ירוק. "
                        "מוציאים כדור אחד בלי להסתכל.") as d:
            self.play(Create(sack), run_time=1)
            self.play(LaggedStart(*[FadeIn(x, scale=0.4) for x in balls], lag_ratio=0.12), run_time=2.5)
        p1 = VGroup(T("כתום:", 36, ORANGE), VGroup(FR(4, 10, 44, ORANGE), EQ("=", 44), FR(2, 5, 44), EQ("= 40%", 44)).arrange(RIGHT, buff=0.25)).arrange(LEFT, buff=0.3)
        p1.move_to(RIGHT * 2.8 + UP * 1.6)
        with self.voice("מה הסיכוי לכדור כתום? ארבעה כדורים מתאימים, מתוך עשרה. ארבע עשיריות, שזה שתיים חמישיות, ארבעים אחוז.") as d:
            self.play(*[balls[i].animate.scale(1.2) for i in range(4)], run_time=0.8)
            self.play(FadeIn(p1), run_time=2)
            self.play(*[balls[i].animate.scale(1 / 1.2) for i in range(4)], run_time=0.6)
        p2 = VGroup(T("לא כתום:", 36, BLUE_C), VGroup(FR(6, 10, 44, BLUE_C), EQ("=", 44), FR(3, 5, 44)).arrange(RIGHT, buff=0.25)).arrange(LEFT, buff=0.3)
        p2.next_to(p1, DOWN, buff=0.6).align_to(p1, RIGHT)
        alt = VGroup(EQ("1 −", 40, GREY_B), FR(2, 5, 36, GREY_B), EQ("=", 40, GREY_B), FR(3, 5, 36, GREY_B)).arrange(RIGHT, buff=0.15).next_to(p2, DOWN, buff=0.35).align_to(p2, RIGHT)
        with self.voice("ומה הסיכוי שהכדור לא יהיה כתום? שישה כדורים, כחולים וירוק, מתוך עשרה. שש עשיריות. "
                        "או בדרך קצרה: אחת פחות שתיים חמישיות.") as d:
            self.play(*[balls[i].animate.scale(1.2) for i in range(4, 10)], run_time=0.8)
            self.play(FadeIn(p2), run_time=1.5)
            self.play(*[balls[i].animate.scale(1 / 1.2) for i in range(4, 10)], run_time=0.6)
            self.wait(1)
            self.play(FadeIn(alt), run_time=1.2)
        p3 = VGroup(T("סגול:", 36, PURPLE_B), VGroup(FR(0, 10, 44, PURPLE_B), EQ("= 0", 44)).arrange(RIGHT, buff=0.25)).arrange(LEFT, buff=0.3)
        p3.next_to(alt, DOWN, buff=0.6).align_to(p1, RIGHT)
        with self.voice("ומה הסיכוי לכדור סגול? אין סגולים בשקית, אז אפס. בלתי אפשרי.") as d:
            self.play(FadeIn(p3), run_time=1.5)
        self.clear(keep=[self.title])

    # ---------- ניסוי: הטלת מטבע ----------
    def experiment(self):
        random.seed(7)
        N = 400
        heads, freq = 0, []
        for i in range(1, N + 1):
            heads += random.random() < 0.5
            freq.append(heads / i)
        ax = Axes(x_range=[0, N, 100], y_range=[0, 1, 0.25], x_length=9.5, y_length=4.2, tips=False,
                  axis_config={"color": GREY_C}).shift(DOWN * 0.6)
        ylab = VGroup(*[EQ(f"{int(v * 100)}%", 24, GREY_B).next_to(ax.c2p(0, v), LEFT, buff=0.15) for v in (0, 0.25, 0.5, 0.75, 1)])
        xlab = VGroup(*[EQ(str(v), 24, GREY_B).next_to(ax.c2p(v, 0), DOWN, buff=0.15) for v in (100, 200, 300, 400)])
        xcap = T("מספר ההטלות", 26, GREY_B).next_to(ax, DOWN, buff=0.5)
        half = DashedLine(ax.c2p(0, 0.5), ax.c2p(N, 0.5), color=YELLOW)
        hl = T("הסתברות: חצי", 28, YELLOW).next_to(ax.c2p(N, 0.5), UP, buff=0.15).shift(LEFT * 1)
        with self.voice("ההסתברות של עץ במטבע היא חצי. אבל אם נטיל מטבע עשר פעמים, האם בטוח שייצא עץ חמש פעמים? לא! "
                        "בוא נעשה ניסוי.") as d:
            self.play(Create(ax), FadeIn(ylab), FadeIn(xlab), FadeIn(xcap), run_time=1.5)
            self.play(Create(half), FadeIn(hl), run_time=1)
        t = ValueTracker(1)
        curve = always_redraw(lambda: VMobject(color=ORANGE, stroke_width=3).set_points_as_corners(
            [ax.c2p(i + 1, freq[i]) for i in range(max(int(t.get_value()), 2))]))
        readout = always_redraw(lambda: VGroup(
            T("אחרי", 30), EQ(str(int(t.get_value())), 32, ORANGE), T("הטלות, עץ יצא ב־", 30),
            EQ(f"{round(freq[int(t.get_value()) - 1] * 100)}%", 32, ORANGE)).arrange(LEFT, buff=0.15).to_edge(UP, buff=1.2))
        with self.voice("הקו הכתום מראה באיזה חלק מההטלות יצא עץ. בהתחלה הוא קופץ למעלה ולמטה, כי יש מעט הטלות.") as d:
            self.add(curve, readout)
            self.play(t.animate.set_value(20), run_time=d - 0.5, rate_func=linear)
        with self.voice("אבל ככל שמטילים יותר פעמים, הקו מתקרב לחצי. ככה זה עם הסתברות: "
                        "בהרבה ניסויים, השכיחות היחסית מתקרבת להסתברות.") as d:
            self.play(t.animate.set_value(N), run_time=d - 0.5, rate_func=rate_functions.ease_in_quad)
        curve.clear_updaters()
        readout.clear_updaters()
        self.clear(keep=[self.title])

    # ---------- טעות נפוצה ----------
    def mistake(self):
        q = T("שתי אפשרויות: קליעה או החטאה. אז הסיכוי חצי?", 38).to_edge(UP, buff=1.2)
        with self.voice("עכשיו טעות נפוצה. בזריקת עונשין יש שתי אפשרויות: קליעה או החטאה. "
                        "אז הסיכוי לקלוע הוא חצי?") as d:
            self.play(FadeIn(q), run_time=1.5)
        no = T("לא!", 60, RED_C).next_to(q, DOWN, buff=0.4)
        grid = VGroup(*[ball(BALL if i < 8 else GREY_D, 0.28) for i in range(10)]).arrange(RIGHT, buff=0.2).next_to(no, DOWN, buff=0.5)
        info = T("שחקן טוב קולע 8 מתוך 10 ← הסיכוי 80%", 36, YELLOW).next_to(grid, DOWN, buff=0.4)
        with self.voice("לא! שחקן טוב קולע שמונה מתוך עשר זריקות. אצלו הסיכוי לקלוע הוא שמונים אחוז. "
                        "שבר של תוצאות עובד רק כשלכל התוצאות יש אותו סיכוי.") as d:
            self.play(FadeIn(no, scale=1.4), run_time=0.8)
            self.play(LaggedStart(*[FadeIn(x, scale=0.4) for x in grid], lag_ratio=0.1), run_time=1.5)
            self.play(FadeIn(info), run_time=1)
        self.clear(keep=[self.title])
        coins = VGroup(*[T(t, 36) for t in ("עץ ועץ", "עץ ופלי", "פלי ועץ", "פלי ופלי")]).arrange(RIGHT, buff=0.6).move_to(UP * 0.8)
        boxes = VGroup(*[SurroundingRectangle(c, color=GREY_B, buff=0.2, corner_radius=0.1) for c in coins])
        hq = T("מטילים שני מטבעות. מה הסיכוי לשני עצים?", 38).to_edge(UP, buff=1.2)
        with self.voice("ועוד דוגמה: מטילים שני מטבעות. מה הסיכוי לשני עצים? "
                        "צריך לכתוב את כל האפשרויות. יש ארבע: עץ ועץ, עץ ופלי, פלי ועץ, ופלי ופלי.") as d:
            self.play(FadeIn(hq), run_time=1)
            self.wait(2.5)
            self.play(LaggedStart(*[FadeIn(VGroup(b, c)) for b, c in zip(boxes, coins)], lag_ratio=0.4), run_time=3)
        ans = VGroup(T("שני עצים:", 38, ORANGE), FR(1, 4, 48, ORANGE)).arrange(LEFT, buff=0.3).next_to(coins, DOWN, buff=1)
        with self.voice("רק אפשרות אחת מתוך ארבע מתאימה. אז הסיכוי הוא רבע.") as d:
            self.play(boxes[0].animate.set_color(ORANGE), coins[0].animate.set_color(ORANGE), run_time=1)
            self.play(FadeIn(ans), run_time=1.2)
        self.clear(keep=[self.title])

    # ---------- סיכום ----------
    def summary(self):
        lines = VGroup(
            T("בלתי אפשרי = 0 · ודאי = 1 · אפשרי = בין 0 ל־1", 36),
            T("הסתברות = התוצאות המתאימות חלקי כל התוצאות", 36),
            T("הסיכוי שמשהו לא יקרה = 1 פחות הסיכוי שיקרה", 36),
            T("בהרבה ניסויים, השכיחות היחסית מתקרבת להסתברות", 36),
        ).arrange(DOWN, buff=0.45, aligned_edge=RIGHT).move_to(UP * 0.3)
        with self.voice("אז מה למדנו? מאורע בלתי אפשרי, הסיכוי שלו אפס. מאורע ודאי, הסיכוי שלו אחת. "
                        "הסתברות היא התוצאות המתאימות, חלקי כל התוצאות. "
                        "הסיכוי שמשהו לא יקרה הוא אחת פחות הסיכוי שיקרה. ובהרבה ניסויים, מתקרבים להסתברות.") as d:
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=0.8)
                self.wait(max(d / 4 - 1.0, 0.2))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, הרץ אלף ניסויים במכונת הניסויים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
