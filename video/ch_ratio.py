"""סרטון: יחס, פרופורציה, קנה מידה ויחס הפוך (כיתה ח׳, כרך א׳ פרקים 17–19).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_ratio.py Ratio
"""
from common import *

add_pron({"קנה מידה": "קְנֵה מִידָּה", "בקנה מידה": "בִּקְנֵה מִידָּה"})

A_COL, B_COL = ORANGE, BLUE_C


def EQ(s, size=48, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def FR(a, b, size=48, color=WHITE):
    """שבר: מונה מעל קו מעל מכנה."""
    n, d = EQ(str(a), size, color), EQ(str(b), size, color)
    w = max(n.width, d.width) + 0.25
    ln = Line(LEFT * w / 2, RIGHT * w / 2, stroke_width=3, color=color)
    n.next_to(ln, UP, buff=0.12)
    d.next_to(ln, DOWN, buff=0.12)
    return VGroup(n, ln, d)


def ball(color=BALL, r=0.22):
    seam_on = isinstance(color, str) and color == BALL
    c = Circle(radius=r, color=color, fill_opacity=1, stroke_width=0)
    seam = VGroup(Line(LEFT * r, RIGHT * r), Line(UP * r, DOWN * r)).set_stroke("#5a2a0a", 1.5)
    return VGroup(c, seam if seam_on else VGroup())


class Ratio(Narrated):
    def construct(self):
        self.story()
        self.divide()
        self.proportion()
        self.scale_part()
        self.inverse()
        self.summary()

    def clear(self, keep=()):
        self.play(*[FadeOut(m) for m in self.mobjects if m not in keep], run_time=0.8)

    # ---------- סיפור: קליעות והחטאות ----------
    def story(self):
        title = T("יחס", 72, font=TITLE)
        with self.voice("עומר התאמן בזריקות עונשין. הוא קלע שתים עשרה זריקות, והחטיא שמונה. "
                        "איך משווים בין שני המספרים האלה? בעזרת יחס.") as d:
            self.play(Write(title), run_time=1.5)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
            hits = VGroup(*[ball() for _ in range(12)]).arrange(RIGHT, buff=0.15)
            miss = VGroup(*[ball(GREY_C) for _ in range(8)]).arrange(RIGHT, buff=0.15)
            row = VGroup(hits, miss).arrange(RIGHT, buff=0.5).move_to(UP * 1.2)
            lh = T("קליעות", 30, A_COL).next_to(hits, UP, buff=0.3)
            lm = T("החטאות", 30, GREY_B).next_to(miss, UP, buff=0.3)
            self.play(LaggedStart(*[FadeIn(b, scale=0.5) for b in hits], lag_ratio=0.1), FadeIn(lh), run_time=1.8)
            self.play(LaggedStart(*[FadeIn(b, scale=0.5) for b in miss], lag_ratio=0.1), FadeIn(lm), run_time=1.3)
        self.title = title

        r1 = EQ(f'<span fgcolor="{A_COL}">12</span> : <span fgcolor="{GREY_B}">8</span>', 72).move_to(DOWN * 0.2)
        words = R("היחס בין הקליעות להחטאות", size=34).next_to(r1, DOWN, buff=0.5)
        with self.voice("כותבים: שתים עשרה נקודתיים שמונה, וקוראים: שתים עשרה לשמונה. "
                        "זה היחס בין הקליעות להחטאות.") as d:
            self.play(Write(r1), run_time=1.5)
            self.play(FadeIn(words, shift=UP * 0.2), run_time=1)

        # צמצום: קבוצות של 4
        groups = VGroup(*[VGroup(*hits[i:i + 4]) for i in range(0, 12, 4)], *[VGroup(*miss[i:i + 4]) for i in range(0, 8, 4)])
        boxes = VGroup(*[SurroundingRectangle(g, buff=0.08, color=YELLOW, corner_radius=0.1) for g in groups])
        r2 = EQ(f'= <span fgcolor="{A_COL}">3</span> : <span fgcolor="{GREY_B}">2</span>', 72)
        target = VGroup(r1.copy(), r2).arrange(RIGHT, buff=0.4).move_to(DOWN * 0.2)
        with self.voice("אפשר לצמצם יחס, כמו שבר. נחלק את הכדורים לקבוצות של ארבעה. "
                        "יש שלוש קבוצות של קליעות, ושתי קבוצות של החטאות. "
                        "אז היחס הוא גם שלוש לשתיים.") as d:
            self.play(LaggedStart(*[Create(b) for b in boxes], lag_ratio=0.3), run_time=2.5)
            self.play(r1.animate.move_to(target[0]), run_time=0.8)
            self.play(FadeIn(r2, shift=LEFT * 0.3), run_time=1.2)
        grp = VGroup(r1, r2)
        side = R("÷4", "לשני המספרים", size=30, color=GREY_B).next_to(grp, DOWN, buff=0.6)
        means = T("על כל 3 קליעות יש 2 החטאות", 36, YELLOW).move_to(side)
        with self.voice("חילקנו את שני המספרים בארבע. "
                        "והמשמעות: על כל שלוש קליעות, יש שתי החטאות.") as d:
            self.play(FadeOut(words), FadeIn(side), run_time=1)
            self.wait(1)
            self.play(ReplacementTransform(side, means), run_time=1)

        warn = R("זהירות: הסדר חשוב!", size=40, color=RED_C).to_edge(DOWN, buff=0.5)
        r3 = EQ(f'<span fgcolor="{GREY_B}">2</span> : <span fgcolor="{A_COL}">3</span>', 56)
        r3l = R("היחס בין ההחטאות לקליעות:", size=32)
        line3 = VGroup(r3l, r3).arrange(LEFT, buff=0.3).next_to(means, DOWN, buff=0.5)
        with self.voice("ושים לב, הסדר חשוב. אם שואלים מה היחס בין ההחטאות לקליעות, "
                        "התשובה היא שתיים לשלוש. המספר הראשון שייך למה שנאמר ראשון.") as d:
            self.play(FadeIn(warn), run_time=0.8)
            self.play(FadeIn(line3, shift=UP * 0.2), run_time=1.2)
        self.clear(keep=[self.title])

    # ---------- חלוקה ביחס ----------
    def divide(self):
        q = R("35 נקודות בשני משחקים, ביחס", "3 : 4", size=38).to_edge(UP, buff=1.3)
        with self.voice("עכשיו שאלה. בשני משחקים עומר קלע ביחד שלושים וחמש נקודות. "
                        "היחס בין הנקודות במשחק הראשון לנקודות במשחק השני הוא שלוש לארבע. "
                        "כמה נקודות קלע בכל משחק?") as d:
            self.play(FadeIn(q, shift=DOWN * 0.2), run_time=1.5)

        s = 1.1
        boxes = VGroup(*[Square(s, color=WHITE, fill_opacity=0.85, fill_color=A_COL if i < 3 else B_COL, stroke_width=3)
                         for i in range(7)]).arrange(RIGHT, buff=0)
        boxes[3:].shift(RIGHT * 0.4)
        boxes.move_to(UP * 0.4)
        xs = VGroup(*[EQ("<i>x</i>", 40).move_to(b) for b in boxes])
        l1 = T("משחק ראשון", 28, A_COL).next_to(boxes[:3], UP, buff=0.25)
        l2 = T("משחק שני", 28, B_COL).next_to(boxes[3:], UP, buff=0.25)
        with self.voice("נצייר את זה. המשחק הראשון מקבל שלושה חלקים, והמשחק השני ארבעה חלקים. "
                        "כל החלקים שווים, אז נקרא לגודל של חלק אחד: איקס.") as d:
            self.play(LaggedStart(*[GrowFromCenter(b) for b in boxes[:3]], lag_ratio=0.2), FadeIn(l1), run_time=1.5)
            self.play(LaggedStart(*[GrowFromCenter(b) for b in boxes[3:]], lag_ratio=0.2), FadeIn(l2), run_time=1.5)
            self.play(LaggedStart(*[Write(x) for x in xs], lag_ratio=0.1), run_time=1.5)

        e1 = EQ("3<i>x</i> + 4<i>x</i> = 35").next_to(boxes, DOWN, buff=0.7)
        e2 = EQ("7<i>x</i> = 35").next_to(e1, DOWN, buff=0.3)
        e3 = EQ("<i>x</i> = 5", color=YELLOW).next_to(e2, DOWN, buff=0.3)
        with self.voice("ביחד יש שבעה חלקים, ששווים שלושים וחמש. "
                        "שלוש איקס ועוד ארבע איקס שווה שלושים וחמש. "
                        "כלומר שבע איקס שווה שלושים וחמש, ואיקס שווה חמש.") as d:
            self.play(Write(e1), run_time=1.5)
            self.play(Write(e2), run_time=1.2)
            self.play(Write(e3), run_time=1.2)
        fives = VGroup(*[EQ("5", 40, BLACK).move_to(b) for b in boxes])
        a1 = R("משחק ראשון:", "3 · 5 = 15", size=34, color=A_COL)
        a2 = R("משחק שני:", "4 · 5 = 20", size=34, color=B_COL)
        ans = VGroup(a1, a2).arrange(DOWN, buff=0.3, aligned_edge=RIGHT).to_edge(RIGHT, buff=0.6).shift(DOWN * 2)
        with self.voice("עכשיו כל חלק שווה חמש. במשחק הראשון: שלוש כפול חמש, חמש עשרה נקודות. "
                        "ובמשחק השני: ארבע כפול חמש, עשרים נקודות. וביחד באמת שלושים וחמש.") as d:
            self.play(ReplacementTransform(xs, fives), run_time=1.2)
            self.play(VGroup(e1, e2, e3).animate.to_edge(LEFT, buff=1), run_time=0.8)
            self.play(FadeIn(a1, shift=LEFT * 0.2), run_time=1)
            self.play(FadeIn(a2, shift=LEFT * 0.2), run_time=1)
        self.clear(keep=[self.title])

    # ---------- פרופורציה ----------
    def proportion(self):
        head = T("פרופורציה = שני יחסים שווים", 44, YELLOW).to_edge(UP, buff=1.3)
        f1, f2 = FR("<i>x</i>", 6, 64), FR(10, 15, 64)
        eq = EQ("=", 64)
        prop = VGroup(f1, eq, f2).arrange(RIGHT, buff=0.5).move_to(UP * 0.5)
        with self.voice("כשיש שני יחסים שווים, קוראים לזה פרופורציה. "
                        "למשל: איקס חלקי שש, שווה עשר חלקי חמש עשרה. איך מוצאים את איקס?") as d:
            self.play(FadeIn(head), run_time=1)
            self.play(Write(prop), run_time=2)
        c1 = Line(f1[0].get_center(), f2[2].get_center(), color=ORANGE, stroke_width=5).scale(0.75)
        c2 = Line(f1[2].get_center(), f2[0].get_center(), color=BLUE_C, stroke_width=5).scale(0.75)
        e1 = EQ(f'<span fgcolor="{ORANGE}">15 · <i>x</i></span> = <span fgcolor="{BLUE_C}">6 · 10</span>').next_to(prop, DOWN, buff=0.8)
        e2 = EQ("15<i>x</i> = 60").next_to(e1, DOWN, buff=0.3)
        e3 = EQ("<i>x</i> = 4", color=YELLOW).next_to(e2, DOWN, buff=0.3)
        with self.voice("משתמשים בכפל בהצלבה. כופלים באלכסון: חמש עשרה כפול איקס, "
                        "שווה שש כפול עשר.") as d:
            self.play(Create(c1), run_time=1)
            self.play(Create(c2), run_time=1)
            self.play(Write(e1), run_time=1.5)
        with self.voice("חמש עשרה איקס שווה שישים. מחלקים בחמש עשרה, ואיקס שווה ארבע. "
                        "בדיקה: ארבע חלקי שש, זה שתיים שלישיות. וגם עשר חלקי חמש עשרה זה שתיים שלישיות.") as d:
            self.play(Write(e2), run_time=1.2)
            self.play(Write(e3), run_time=1.2)
            self.play(Circumscribe(e3, color=YELLOW), run_time=1.2)
        self.clear(keep=[self.title])

    # ---------- קנה מידה ----------
    def scale_part(self):
        head = R("קנה מידה", "1 : 200", size=48, color=YELLOW).to_edge(RIGHT, buff=0.6).shift(UP * 2.2)
        c = court(0.22).to_edge(LEFT, buff=0.5).shift(DOWN * 0.4)
        with self.voice("ועכשיו קנה מידה. זה שרטוט של מגרש כדורסל. "
                        "על השרטוט כתוב: קנה מידה אחד למאתיים.") as d:
            self.play(Create(c), run_time=2.5)
            self.play(FadeIn(head), run_time=1)
        mean = T("1 ס״מ בשרטוט = 200 ס״מ במציאות", 30).next_to(head, DOWN, buff=0.4).to_edge(RIGHT, buff=0.6)
        with self.voice("זה אומר: כל סנטימטר אחד בשרטוט, הוא מאתיים סנטימטר במגרש האמיתי.") as d:
            self.play(FadeIn(mean, shift=UP * 0.2), run_time=1.2)
        L = c[0].width
        ruler = VGroup(Line(c[0].get_corner(UL) + UP * 0.35, c[0].get_corner(UR) + UP * 0.35, color=YELLOW, stroke_width=4))
        ruler.add(Line(UP * 0.12, DOWN * 0.12, color=YELLOW).move_to(ruler[0].get_start()),
                  Line(UP * 0.12, DOWN * 0.12, color=YELLOW).move_to(ruler[0].get_end()))
        rl = R("14 ס״מ", size=30, color=YELLOW).next_to(ruler, UP, buff=0.1)
        with self.voice("מודדים בסרגל: אורך המגרש בשרטוט הוא ארבעה עשר סנטימטר. מה האורך האמיתי?") as d:
            self.play(Create(ruler), FadeIn(rl), run_time=1.5)
        calc = VGroup(EQ("14 · 200 = 2800"), R("ס״מ", "=", "28", "מטר", size=40)).arrange(DOWN, buff=0.3)
        calc[1][2].set_color(YELLOW)
        calc.next_to(mean, DOWN, buff=0.6).to_edge(RIGHT, buff=0.8)
        with self.voice("כופלים: ארבע עשרה כפול מאתיים, אלפיים ושמונה מאות סנטימטר. "
                        "מחלקים במאה כדי לקבל מטרים: עשרים ושמונה מטר. וזה בדיוק האורך של מגרש כדורסל אמיתי!") as d:
            self.play(Write(calc[0]), run_time=1.5)
            self.wait(1)
            self.play(Write(calc[1]), run_time=1.5)
        tip = R("במפה בקנה מידה", "1 : 50,000", "כל ס״מ הוא חצי קילומטר", size=32, color=GREY_B).to_edge(DOWN, buff=0.4)
        with self.voice("במפות המספר גדול יותר. בקנה מידה אחד לחמישים אלף, כל סנטימטר במפה הוא חמש מאות מטר, "
                        "כלומר חצי קילומטר. תמיד שים לב ליחידות!") as d:
            self.play(FadeIn(tip), run_time=1)
        self.clear(keep=[self.title])

    # ---------- יחס הפוך ----------
    def inverse(self):
        head = T("יחס הפוך", 50, YELLOW).to_edge(UP, buff=1.3)
        s = 0.42

        def grid(w):
            h = 24 // w
            g = VGroup(*[Square(s - 0.05, fill_color=ORANGE, fill_opacity=1, stroke_width=0).move_to([j * s, -i * s, 0])
                         for i in range(w) for j in range(h)])
            return g.move_to(LEFT * 2.2 + DOWN * 0.3)

        g = grid(4)
        def mk(w):
            return VGroup(T(f"{w} פועלים, {24 // w} שעות", 38), EQ(f"{w} · {24 // w} = 24", 48, YELLOW)).arrange(DOWN, buff=0.3)
        lab = mk(4).to_edge(RIGHT, buff=1.2).shift(UP * 1.2)
        with self.voice("נושא אחרון: יחס הפוך. צריך לצבוע את המגרש. ארבעה פועלים מסיימים בשש שעות. "
                        "כל ריבוע כאן הוא פועל אחד שעובד שעה אחת. כל שורה היא פועל, ויש עשרים וארבעה ריבועים.") as d:
            self.play(FadeIn(head), run_time=0.8)
            self.play(LaggedStart(*[FadeIn(q, scale=0.5) for q in g], lag_ratio=0.03), run_time=2.5)
            self.play(FadeIn(lab), run_time=1)
        g8, lab8 = grid(8), mk(8).move_to(lab)
        with self.voice("מה קורה אם יש שמונה פועלים, פי שתיים? העבודה מתחלקת, "
                        "וכל אחד עובד רק שלוש שעות. פי שתיים פועלים, חצי מהזמן.") as d:
            self.play(Transform(g, g8), Transform(lab, lab8), run_time=2)
        g2, lab2 = grid(2), mk(2).move_to(lab)
        with self.voice("ועם שני פועלים בלבד? צריך שתים עשרה שעות. "
                        "שים לב: כמות הריבועים לא משתנה. פועלים כפול שעות, תמיד עשרים וארבע.") as d:
            self.play(Transform(g, g2), Transform(lab, lab2), run_time=2)
            self.play(Indicate(lab[1], color=YELLOW, scale_factor=1.3), run_time=1.2)
        rule = T("פי 2 פועלים ← חצי מהזמן", 36, YELLOW).next_to(lab, DOWN, buff=0.8)
        rule2 = EQ("<i>x</i> · <i>y</i> = 24", 48, YELLOW).next_to(rule, DOWN, buff=0.35)
        with self.voice("זה יחס הפוך: כשגודל אחד גדל, השני קטן באותו פי. והמכפלה שלהם קבועה.") as d:
            self.play(FadeIn(rule), run_time=1)
            self.play(Write(rule2), run_time=1)
        wrong = T("טעות נפוצה: יותר פועלים ← יותר שעות", 34, RED_C).to_edge(DOWN, buff=0.5)
        cross = Line(wrong.get_left(), wrong.get_right(), color=RED_C, stroke_width=5)
        with self.voice("טעות נפוצה: לחשוב שיותר פועלים צריכים יותר זמן. בדוק את עצמך: "
                        "האם הגיוני שאם באים יותר אנשים לעזור, העבודה נמשכת יותר זמן? בטח שלא.") as d:
            self.play(FadeIn(wrong), run_time=1)
            self.wait(2)
            self.play(Create(cross), run_time=0.8)
        self.clear(keep=[self.title])

    # ---------- סיכום ----------
    def summary(self):
        lines = VGroup(
            R("יחס", "3 : 2", "אומר: על כל 3 יש 2. הסדר חשוב!", size=38),
            R("חלוקה ביחס:", "3<i>x</i> + 4<i>x</i> = 35", size=38),
            R("פרופורציה: כפל בהצלבה", size=38),
            R("קנה מידה", "1 : 200", "אומר: מציאות = שרטוט × 200", size=38),
            R("יחס הפוך: המכפלה קבועה", size=38),
        ).arrange(DOWN, buff=0.4, aligned_edge=RIGHT).move_to(UP * 0.2)
        with self.voice("אז מה למדנו? יחס משווה בין שני גדלים, והסדר חשוב. "
                        "בחלוקה ביחס, מסמנים חלק אחד באיקס. פרופורציה פותרים בכפל בהצלבה. "
                        "בקנה מידה, כופלים כדי לעבור למציאות. וביחס הפוך, המכפלה קבועה.") as d:
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=0.8)
                self.wait(max(d / 5 - 1.0, 0.2))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
