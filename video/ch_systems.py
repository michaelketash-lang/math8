"""סרטון: מערכת משוואות ושאלות מילוליות (כיתה ח׳, כרך ב׳ פרקים 11–12).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_systems.py Systems
"""
from common import *

add_pron({"הסוגריים": "הַסוֹגריים", "סוגריים": "סוֹגריים"})

C1, C2 = BLUE_C, ORANGE


def F(s, size=52, color=WHITE):
    """נוסחה (בלי עברית). x, y נטויים."""
    return MarkupText(s.replace("x", "<i>x</i>").replace("y", "<i>y</i>"), font=MATH, font_size=size, color=color)


def part(mob, plain, sub, k=0):
    flat, sub = plain.replace(" ", ""), sub.replace(" ", "")
    i = -1
    for _ in range(k + 1):
        i = flat.index(sub, i + 1)
    return mob[i:i + len(sub)]


def system(e1, e2, size=52, c1=WHITE, c2=WHITE):
    """שתי משוואות עם סוגר מסולסל משמאל. מחזיר VGroup(brace, eq1, eq2)."""
    a, b = F(e1, size, c1), F(e2, size, c2)
    eqs = VGroup(a, b).arrange(DOWN, buff=0.3, aligned_edge=LEFT)
    br = MarkupText("{", font=MATH, font_size=size).stretch_to_fit_height(eqs.height * 1.15).next_to(eqs, LEFT, buff=0.15)
    return VGroup(br, a, b)


class Systems(Narrated):
    def construct(self):
        self.story()
        self.graph()
        self.substitution()
        self.elimination()
        self.motion()
        self.summary()

    def clear(self):
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- סיפור: סלים של 2 ושל 3 ----------
    def story(self):
        title = T("מערכת משוואות", 64, font=TITLE)
        with self.voice("במשחק אחד קלע שחקן עשרה סלים. חלק מהם של שתי נקודות, וחלק של שלוש נקודות. "
                        "בסך הכול הוא צבר עשרים ושלוש נקודות. כמה שלשות הוא קלע?") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
            balls = VGroup(*[Circle(0.22, color=BALL, fill_opacity=0.85) for _ in range(10)]).arrange(LEFT, buff=0.3).shift(UP * 1.2)
            self.play(LaggedStart(*[FadeIn(b, scale=0.5) for b in balls], lag_ratio=0.12), run_time=2)
        self.title = title
        defs = VGroup(R("<i>x</i> =", "מספר הסלים של 2", size=38, color=C1),
                      R("<i>y</i> =", "מספר הסלים של 3", size=38, color=C2)).arrange(DOWN, buff=0.3, aligned_edge=RIGHT).to_edge(RIGHT, buff=0.9).shift(DOWN * 0.3)
        with self.voice("יש כאן שני דברים שאנחנו לא יודעים. נסמן: איקס זה מספר הסלים של שתי נקודות, "
                        "וואי זה מספר הסלים של שלוש נקודות.") as d:
            self.play(FadeIn(defs[0], shift=LEFT * 0.2), run_time=1)
            self.play(*[b.animate.set_color(C1) for b in balls[:7]], run_time=0.8)
            self.play(FadeIn(defs[1], shift=LEFT * 0.2), run_time=1)
            self.play(*[b.animate.set_color(C2) for b in balls[7:]], run_time=0.8)
        sy = system("x + y = 10", "2x + 3y = 23", 60).to_edge(LEFT, buff=1.2).shift(DOWN * 0.3)
        n1 = T("סלים", 30, GREY_B).next_to(sy[1], RIGHT, buff=0.5)
        n2 = T("נקודות", 30, GREY_B).next_to(sy[2], RIGHT, buff=0.5)
        with self.voice("עכשיו שתי עובדות. עובדה ראשונה: היו עשרה סלים, אז איקס ועוד וואי שווה עשר. "
                        "עובדה שנייה: כל סל של שתיים שווה שתי נקודות, וכל סל של שלוש שווה שלוש. "
                        "אז שתיים איקס ועוד שלוש וואי שווה עשרים ושלוש.") as d:
            self.play(Write(sy[1]), FadeIn(n1), run_time=1.5)
            self.wait(max(d / 2 - 1.5, 0.3))
            self.play(Write(sy[2]), FadeIn(n2), run_time=1.5)
        name = T("מערכת משוואות: שתי משוואות, שני נעלמים", 36, YELLOW).to_edge(DOWN, buff=0.7)
        with self.voice("שתי משוואות עם שני נעלמים, שצריכות להתקיים ביחד, נקראות מערכת משוואות. "
                        "מסמנים אותן עם סוגר מסולסל. הפתרון הוא זוג מספרים, איקס ווואי, שמתאים לשתיהן.") as d:
            self.play(FadeIn(sy[0]), FadeIn(name), run_time=1.5)
        self.play(FadeOut(VGroup(balls, defs, n1, n2, name)), sy.animate.scale(0.75).to_corner(UR, buff=0.6).shift(DOWN * 0.7))
        self.sy = sy

    # ---------- פתרון גרפי ----------
    def graph(self):
        ax = Axes(x_range=[0, 12, 1], y_range=[0, 10, 1], x_length=6.6, y_length=5.4, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=0.8).shift(DOWN * 0.4)
        labs = VGroup(*[T(str(x), 22, GREY_B).next_to(ax.c2p(x, 0), DOWN, buff=0.12) for x in range(0, 13, 2)],
                      *[T(str(y), 22, GREY_B).next_to(ax.c2p(0, y), LEFT, buff=0.12) for y in range(2, 11, 2)])
        l1 = ax.plot(lambda x: 10 - x, x_range=[0, 10], color=C1, stroke_width=5)
        l2 = ax.plot(lambda x: (23 - 2 * x) / 3, x_range=[0, 11.5], color=C2, stroke_width=5)
        with self.voice("דרך אחת לפתור: לצייר. כל משוואה היא ישר. הישר הכחול הוא כל הזוגות שסכומם עשר. "
                        "הישר הכתום הוא כל הזוגות שנותנים עשרים ושלוש נקודות.") as d:
            self.play(Create(ax), FadeIn(labs), run_time=1.2)
            self.play(Create(l1), self.sy[1].animate.set_color(C1), run_time=1.5)
            self.wait(max(d / 2 - 2.7, 0.3))
            self.play(Create(l2), self.sy[2].animate.set_color(C2), run_time=1.5)
        dot = Dot(ax.c2p(7, 3), color=YELLOW, radius=0.13)
        lab = F("(7, 3)", 44, YELLOW).next_to(dot, UR, buff=0.15)
        with self.voice("הנקודה שנמצאת על שני הישרים ביחד, נקודת החיתוך, היא הפתרון: שבע, שלוש. "
                        "כלומר שבעה סלים של שתיים, ושלוש שלשות.") as d:
            self.play(FadeIn(dot, scale=2), Flash(dot, color=YELLOW), run_time=1.2)
            self.play(Write(lab), run_time=1)
        note = VGroup(T("ישרים מקבילים ← אין פתרון", 32, GREY_B), T("אותו ישר ← אין־סוף פתרונות", 32, GREY_B)
                      ).arrange(DOWN, buff=0.25, aligned_edge=RIGHT).to_edge(RIGHT, buff=0.8).shift(DOWN * 1.6)
        with self.voice("ושים לב: אם הישרים מקבילים, הם אף פעם לא נפגשים, ואין פתרון. "
                        "ואם זה אותו ישר בדיוק, יש אין סוף פתרונות.") as d:
            self.play(FadeIn(note, shift=UP * 0.2), run_time=1.2)
        self.play(FadeOut(VGroup(ax, labs, l1, l2, dot, lab, note)), self.sy.animate.set_color(WHITE))

    # ---------- שיטת ההצבה ----------
    def substitution(self):
        head = T("שיטת ההצבה", 44, YELLOW).next_to(self.title, DOWN, buff=0.35)
        L = ["x = 10 − y", "2(10 − y) + 3y = 23", "20 − 2y + 3y = 23", "20 + y = 23", "y = 3", "x = 10 − 3 = 7"]
        rows = VGroup(*[F(s, 48) for s in L]).arrange(DOWN, buff=0.3).next_to(head, DOWN, buff=0.4).shift(LEFT * 1.5)
        with self.voice("אבל לצייר זה לא תמיד מדויק. אז יש שיטות חישוב. הראשונה: שיטת ההצבה. "
                        "מהמשוואה הראשונה מבודדים את איקס: איקס שווה עשר פחות וואי.") as d:
            self.play(FadeIn(head), run_time=0.8)
            self.wait(max(d - 3, 0.3))
            self.play(TransformFromCopy(self.sy[1], rows[0]), run_time=1.5)
        s = L[1]
        box = SurroundingRectangle(part(rows[1], s, "(10 − y)"), color=C1, buff=0.08)
        with self.voice("ועכשיו מציבים את זה במשוואה השנייה, במקום איקס. "
                        "שתיים כפול, סוגריים, עשר פחות וואי, ועוד שלוש וואי, שווה עשרים ושלוש.") as d:
            self.play(Write(rows[1]), run_time=2)
            self.play(Create(box), run_time=0.8)
        with self.voice("עכשיו יש משוואה עם נעלם אחד בלבד! פותחים סוגריים, מחברים: עשרים ועוד וואי שווה עשרים ושלוש. "
                        "ולכן וואי שווה שלוש.") as d:
            self.play(FadeOut(box), Write(rows[2]), run_time=1.5)
            self.play(Write(rows[3]), run_time=1.2)
            self.play(Write(rows[4]), run_time=1.2)
        ans = R("הפתרון:", "(7, 3)", size=48, color=YELLOW).next_to(rows, RIGHT, buff=1.0).shift(DOWN * 1.2)
        with self.voice("ואת האיקס מוצאים כשמציבים חזרה: עשר פחות שלוש, שבע. הפתרון: שבע, שלוש. "
                        "בדיוק כמו בגרף!") as d:
            self.play(Write(rows[5]), run_time=1.5)
            self.play(FadeIn(ans, scale=1.2), run_time=1)
        self.clear()

    # ---------- השוואת מקדמים ----------
    def elimination(self):
        head = T("שיטת השוואת מקדמים", 44, YELLOW).next_to(self.title, DOWN, buff=0.35)
        e1, e2 = "3x + 2y = 16", "5x − 2y = 16"
        sy = system(e1, e2, 60).shift(UP * 0.6)
        with self.voice("השיטה השנייה: השוואת מקדמים. הנה מערכת חדשה: "
                        "שלוש איקס ועוד שתיים וואי שווה שש עשרה, וחמש איקס פחות שתיים וואי שווה שש עשרה.") as d:
            self.play(FadeIn(head), Write(sy), run_time=2.5)
        p1, p2 = part(sy[1], e1, "+ 2y"), part(sy[2], e2, "− 2y")
        with self.voice("תסתכל על הוואי: למעלה פלוס שתיים וואי, ולמטה מינוס שתיים וואי. הם נגדיים! "
                        "אם נחבר את שתי המשוואות, הוואי פשוט ייעלם.") as d:
            self.play(Indicate(p1, color=C2, scale_factor=1.4), Indicate(p2, color=C2, scale_factor=1.4), run_time=1.5)
            self.play(p1.animate.set_color(C2), p2.animate.set_color(C2), run_time=0.6)
        plus = F("+", 60, GREY_B).next_to(sy, LEFT, buff=0.4)
        line = Line(sy.get_corner(DL) + LEFT * 0.2, sy.get_corner(DR) + RIGHT * 0.2, color=GREY_B).shift(DOWN * 0.2)
        s3 = "8x = 32"
        r = F(s3, 60).next_to(line, DOWN, buff=0.3)
        r2 = F("x = 4", 60, YELLOW).next_to(r, DOWN, buff=0.3)
        with self.voice("מחברים: שלוש איקס ועוד חמש איקס, שמונה איקס. שתיים וואי פחות שתיים וואי, אפס. "
                        "ושש עשרה ועוד שש עשרה, שלושים ושתיים. שמונה איקס שווה שלושים ושתיים, ולכן איקס שווה ארבע.") as d:
            self.play(FadeIn(plus), Create(line), run_time=1)
            self.play(Write(r), run_time=2)
            self.wait(max(d - 5.5, 0.3))
            self.play(Write(r2), run_time=1.2)
        y = R("מציבים בראשונה:", "3 · 4 + 2<i>y</i> = 16", "←", "<i>y</i> = 2", size=36, color=GREY_A).to_edge(DOWN, buff=0.5)
        with self.voice("ואת וואי מוצאים כשמציבים ארבע באחת המשוואות: שתים עשרה ועוד שתיים וואי שווה שש עשרה, ולכן וואי שווה שתיים.") as d:
            self.play(FadeIn(y, shift=UP * 0.2), run_time=1.2)
        tip = T("מקדמים נגדיים ← מחברים · מקדמים שווים ← מחסירים", 34, YELLOW).to_edge(DOWN, buff=0.5)
        with self.voice("הכלל: אם המקדמים נגדיים, מחברים. אם הם שווים, מחסירים. "
                        "ואם הם לא שווים, קודם כופלים את אחת המשוואות במספר, כדי שיהיו.") as d:
            self.play(FadeOut(y), FadeIn(tip), run_time=1.2)
        self.clear()

    # ---------- שאלת תנועה ----------
    def motion(self):
        head = T("שאלת תנועה", 44, YELLOW).next_to(self.title, DOWN, buff=0.35)
        road = Line(LEFT * 5.5, RIGHT * 5.5, color=GREY_B, stroke_width=6).shift(UP * 0.6)
        ta, tb = T("א", 34).next_to(road.get_left(), DOWN, buff=0.3), T("ב", 34).next_to(road.get_right(), DOWN, buff=0.3)
        dist = R("120", "ק״מ", size=34, color=GREY_B).next_to(road, UP, buff=0.35)
        t = ValueTracker(0)
        k = 11 / 120
        a = always_redraw(lambda: Dot(road.get_left() + RIGHT * 25 * t.get_value() * k, color=C1, radius=0.18))
        b = always_redraw(lambda: Dot(road.get_right() + LEFT * 35 * t.get_value() * k, color=C2, radius=0.18))
        clock = always_redraw(lambda: R("זמן:", f"{t.get_value():.1f}", "שעות", size=34).next_to(road, DOWN, buff=1.0))
        with self.voice("ועכשיו שאלת תנועה. שני רוכבי אופניים יוצאים באותו רגע משתי ערים, שהמרחק ביניהן מאה עשרים קילומטר, "
                        "ורוכבים זה לקראת זה. אחד במהירות עשרים וחמישה קילומטר לשעה, והשני שלושים וחמישה. מתי ייפגשו?") as d:
            self.play(FadeIn(head), Create(road), FadeIn(ta), FadeIn(tb), FadeIn(dist), FadeIn(a), FadeIn(b), run_time=1.5)
            self.wait(max(d - 3, 0.3))
        rule = T("דרך = מהירות × זמן", 40, YELLOW).to_edge(DOWN, buff=2.2)
        with self.voice("הכלל של שאלות תנועה: דרך שווה מהירות כפול זמן. בוא נראה אותם נוסעים.") as d:
            self.play(FadeIn(rule), FadeIn(clock), run_time=1)
            self.play(t.animate.set_value(2), run_time=d - 1.5, rate_func=linear)
        meet = Flash(road.get_left() + RIGHT * 50 * k, color=YELLOW)
        eqs = VGroup(F("25t + 35t = 120", 48), F("60t = 120", 48), F("t = 2", 52, YELLOW)).arrange(RIGHT, buff=0.8).to_edge(DOWN, buff=0.7)
        with self.voice("אחרי זמן טי, הראשון עבר עשרים וחמש טי, והשני שלושים וחמש טי. "
                        "כשהם נפגשים, ביחד הם עברו את כל המאה עשרים. "
                        "שישים טי שווה מאה עשרים, ולכן טי שווה שתיים. הם ייפגשו אחרי שעתיים.") as d:
            self.play(meet, run_time=1)
            self.play(FadeOut(rule), Write(eqs[0]), run_time=1.5)
            self.wait(max(d / 2 - 2.5, 0.3))
            self.play(Write(eqs[1]), run_time=1.2)
            self.play(Write(eqs[2]), run_time=1.2)
        a.clear_updaters(); b.clear_updaters(); clock.clear_updaters()
        self.clear()

    # ---------- סיכום ----------
    def summary(self):
        lines = VGroup(
            R("הפתרון: זוג", "(<i>x</i>, <i>y</i>)", "שמתאים לשתי המשוואות", size=40),
            T("גרפית: נקודת החיתוך של שני הישרים", 40),
            R("הצבה: מבודדים", "<i>y</i> = …", "ומציבים במשוואה השנייה", size=40),
            T("השוואת מקדמים: מחברים או מחסירים כדי שנעלם ייעלם", 40),
            T("ותמיד בודקים בשתי המשוואות!", 40, GREEN_C),
        ).arrange(DOWN, buff=0.42, aligned_edge=RIGHT).shift(UP * 0.4)
        with self.voice("אז מה למדנו? הפתרון של מערכת משוואות הוא זוג מספרים שמתאים לשתי המשוואות. "
                        "בגרף, זו נקודת החיתוך. בשיטת ההצבה מבודדים נעלם ומציבים. "
                        "בהשוואת מקדמים מחברים או מחסירים כדי שנעלם אחד ייעלם. ותמיד בודקים!") as d:
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 5 - 1.1, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
