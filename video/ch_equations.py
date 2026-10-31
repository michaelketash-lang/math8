"""סרטון: משוואות — חזרה ומספר הפתרונות (כיתה ח׳, פרק 1).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_equations.py Equations
"""
from common import *


X_COL, ONE_COL = BLUE_C, ORANGE


def F(s, size=44, color=WHITE):
    """נוסחה בגופן מתמטי (בלי LaTeX). x נטוי: <i>x</i>."""
    return MarkupText(s, font=MATH, font_size=size, color=color)


def xbox():
    sq = Square(0.5, color=X_COL, fill_color=X_COL, fill_opacity=0.35, stroke_width=3)
    return VGroup(sq, F("<i>x</i>", 30).move_to(sq))


def unit():
    return Circle(0.13, color=ONE_COL, fill_color=ONE_COL, fill_opacity=1, stroke_width=0)


def pile(nx, nu, per_row=4):
    """ערימה על כף המאזניים: קופסאות x למעלה, משקולות של 1 למטה."""
    rows = VGroup()
    if nu:
        units = VGroup(*[unit() for _ in range(nu)])
        units.arrange_in_grid(cols=min(per_row, nu), buff=0.1)
        rows.add(units)
    if nx:
        rows.add(VGroup(*[xbox() for _ in range(nx)]).arrange(RIGHT, buff=0.1))
    return rows.arrange(UP, buff=0.12)


class Scale(VGroup):
    """מאזניים: קורה עם שתי כפות. left/right = הערימות שעליהן."""
    def __init__(self, left, right, center=LEFT * 3.35 + DOWN * 0.9):
        super().__init__()
        self.c = center
        self.beam = Line(center + LEFT * 2.7, center + RIGHT * 2.7, color=GREY_B, stroke_width=8)
        self.post = Polygon(center, center + DOWN * 1.4 + LEFT * 0.45, center + DOWN * 1.4 + RIGHT * 0.45,
                            color=GREY_D, fill_color=GREY_D, fill_opacity=1)
        self.lp, self.rp = left, right
        self.place()
        self.add(self.post, self.beam, self.lp, self.rp)
        self.scale(1.25, about_point=center)

    def place(self):
        self.lp.next_to(self.c + LEFT * 1.6, UP, buff=0.08)
        self.rp.next_to(self.c + RIGHT * 1.6, UP, buff=0.08)

    def tilt_group(self):
        return VGroup(self.beam, self.lp, self.rp)


class Equations(Narrated):
    def construct(self):
        self.story()
        self.balance()
        self.brackets()
        self.solutions()
        self.word()
        self.summary()

    def caption(self, *parts, color=YELLOW):
        return R(*parts, size=32, color=color).to_edge(DOWN, buff=0.45)

    # ---------- פתיחה ----------
    def story(self):
        title = T("משוואות", 72, font=TITLE)
        sub = T("חזרה, ומתי אין פתרון בכלל", 36, GREY_B).next_to(title, DOWN, buff=0.4)
        with self.voice("משוואות! היום נחזור על הדרך לפתור אותן, ונגלה משהו חדש: "
                        "משוואות בלי פתרון בכלל, ומשוואות עם אין סוף פתרונות.") as d:
            self.play(Write(title), run_time=2)
            self.play(FadeIn(sub, shift=UP * 0.2), run_time=1)
        self.play(FadeOut(sub), title.animate.scale(0.55).to_edge(UP, buff=0.3))
        self.title = title

    # ---------- מאזניים ----------
    def balance(self):
        sc = Scale(pile(3, 2), pile(1, 8))
        eq = F("3<i>x</i> + 2 = <i>x</i> + 8", 52).move_to(RIGHT * 3.2 + UP * 2)
        with self.voice("משוואה היא כמו מאזניים. בצד שמאל: שלוש קופסאות, ובכל אחת איקס, ועוד שתי משקולות. "
                        "בצד ימין: קופסה אחת ושמונה משקולות. המאזניים מאוזנים, ולכן כתוב שווה.") as d:
            self.play(FadeIn(sc.post), Create(sc.beam), run_time=1)
            self.play(LaggedStart(FadeIn(sc.lp, shift=DOWN * 0.3), FadeIn(sc.rp, shift=DOWN * 0.3), lag_ratio=0.5), run_time=2)
            self.play(Write(eq), run_time=2)
        rule = self.caption("חוק הזהב: מה שעושים לאגף אחד, עושים גם לשני")
        with self.voice("כל צד של המשוואה נקרא אגף. וזה חוק הזהב: מה שעושים לאגף אחד, עושים גם לאגף השני. "
                        "ככה המאזניים נשארים מאוזנים.") as d:
            self.play(FadeIn(rule, shift=UP * 0.2), run_time=1)
            self.play(Wiggle(sc.tilt_group(), scale_value=1.02, rotation_angle=0.03 * TAU), run_time=2)

        # שלב 1: מורידים x מכל צד
        e2 = F("2<i>x</i> + 2 = 8", 52).next_to(eq, DOWN, buff=0.45)
        c1 = self.caption("מורידים", "<i>x</i>", "אחד משני האגפים")
        lx, rx = sc.lp[1][0], sc.rp[1][0]
        with self.voice("נוריד קופסה אחת מכל צד. בצד ימין לא נשארו קופסאות, ובצד שמאל נשארו שתיים. "
                        "עכשיו: שתיים איקס ועוד שתיים, שווה שמונה.") as d:
            self.play(ReplacementTransform(rule, c1), run_time=0.8)
            self.play(lx.animate.set_color(RED), rx.animate.set_color(RED), run_time=0.6)
            self.play(FadeOut(lx, shift=UP), FadeOut(rx, shift=UP), run_time=1.2)
            self.play(Write(e2), run_time=1.5)

        # שלב 2: מורידים 2 משקולות מכל צד
        e3 = F("2<i>x</i> = 6", 52).next_to(e2, DOWN, buff=0.45)
        c2 = self.caption("מורידים", "2", "משני האגפים")
        lu, ru = sc.lp[0], VGroup(*sc.rp[0][:2])
        with self.voice("עכשיו נוריד שתי משקולות מכל צד. נשארו שתי קופסאות מול שש משקולות. שתיים איקס שווה שש.") as d:
            self.play(ReplacementTransform(c1, c2), run_time=0.8)
            self.play(lu.animate.set_color(RED), ru.animate.set_color(RED), run_time=0.6)
            self.play(FadeOut(lu, shift=UP), FadeOut(ru, shift=UP), run_time=1.2)
            self.play(Write(e3), run_time=1.5)

        # שלב 3: מחלקים ב־2
        e4 = F("<i>x</i> = 3", 60, YELLOW).next_to(e3, DOWN, buff=0.45)
        c3 = self.caption("מחלקים את שני האגפים ב־", "2")
        rest = VGroup(*sc.rp[0][2:])
        boxes = sc.lp[1][1:]
        g1, g2 = VGroup(*rest[:3]), VGroup(*rest[3:])
        with self.voice("מחלקים את שני האגפים בשתיים: כל קופסה שוקלת כמו שלוש משקולות. איקס שווה שלוש.") as d:
            self.play(ReplacementTransform(c2, c3), run_time=0.8)
            self.play(g1.animate.set_color(YELLOW), boxes[0].animate.set_color(YELLOW), run_time=1)
            self.play(g2.animate.set_color(GREEN_C), boxes[1].animate.set_color(GREEN_C), run_time=1)
            self.play(Write(e4), run_time=1.2)
            self.play(Create(SurroundingRectangle(e4, color=YELLOW, buff=0.15)), run_time=0.8)

        chk = R("בדיקה:", "3·3 + 2 = 11", ",", "3 + 8 = 11", "✔", size=34, color=GREEN_C)
        chk.to_edge(DOWN, buff=0.45)
        with self.voice("תמיד בודקים! מציבים שלוש במשוואה המקורית. בצד שמאל יוצא אחת עשרה, ובצד ימין גם אחת עשרה. מאוזן!") as d:
            self.play(ReplacementTransform(c3, chk), run_time=1)
            self.play(Indicate(eq, color=GREEN_C), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- סוגריים ----------
    def brackets(self):
        eq = F("3(<i>x</i> + 2) = 5<i>x</i> − 4", 56).shift(UP * 2)
        with self.voice("עכשיו משוואה עם סוגריים: שלוש כפול, איקס ועוד שתיים, שווה חמש איקס פחות ארבע.") as d:
            self.play(Write(eq), run_time=2)
        # חצים מה־3 לכל איבר בסוגריים
        three, xx, two = eq[0], eq[2], eq[4]
        a1 = CurvedArrow(three.get_top() + UP * 0.05, xx.get_top() + UP * 0.05, angle=-PI / 2, color=YELLOW, tip_length=0.15)
        a2 = CurvedArrow(three.get_top() + UP * 0.05, two.get_top() + UP * 0.05, angle=-PI / 2, color=YELLOW, tip_length=0.15)
        e1 = F("3<i>x</i> + 6 = 5<i>x</i> − 4", 52).next_to(eq, DOWN, buff=0.5)
        with self.voice("צעד ראשון: פותחים סוגריים. את השלוש כופלים בכל אחד מהאיברים שבפנים: "
                        "שלוש כפול איקס, ושלוש כפול שתיים. יוצא שלוש איקס ועוד שש.") as d:
            self.play(Create(a1), run_time=1)
            self.play(Create(a2), run_time=1)
            self.play(Write(e1), run_time=1.5)
        wrong = F("3(<i>x</i> + 2) ≠ 3<i>x</i> + 2", 46, RED).shift(DOWN * 1.2)
        cross = Cross(wrong[-4:], stroke_color=RED, stroke_width=4).set_opacity(0.8)
        warn = T("טעות נפוצה!", 36, RED).next_to(wrong, UP, buff=0.3)
        with self.voice("זהירות, טעות נפוצה: לכפול רק את האיקס ולשכוח את השתיים. "
                        "השלוש כופל את כל מה שבתוך הסוגריים.") as d:
            self.play(FadeIn(warn), Write(wrong), run_time=1.2)
            self.play(Create(cross), run_time=0.8)
        self.play(FadeOut(VGroup(wrong, cross, warn, a1, a2)))

        e2 = F("6 = 2<i>x</i> − 4", 52).next_to(e1, DOWN, buff=0.4)
        n2 = R("מחסירים", "3<i>x</i>", size=28, color=GREY_B).next_to(e2, RIGHT, buff=0.7)
        e3 = F("10 = 2<i>x</i>", 52).next_to(e2, DOWN, buff=0.4)
        n3 = R("מוסיפים", "4", size=28, color=GREY_B).next_to(e3, RIGHT, buff=0.7)
        e4 = F("<i>x</i> = 5", 58, YELLOW).next_to(e3, DOWN, buff=0.4)
        n4 = R("מחלקים ב־", "2", size=28, color=GREY_B).next_to(e4, RIGHT, buff=0.7)
        with self.voice("עכשיו מעבירים. מחסירים שלוש איקס משני האגפים, ונשאר: שש שווה שתיים איקס פחות ארבע.") as d:
            self.play(Write(e2), FadeIn(n2), run_time=1.5)
        with self.voice("מוסיפים ארבע לשני האגפים: עשר שווה שתיים איקס. ומחלקים בשתיים: איקס שווה חמש.") as d:
            self.play(Write(e3), FadeIn(n3), run_time=1.5)
            self.wait(1)
            self.play(Write(e4), FadeIn(n4), run_time=1.5)
            self.play(Create(SurroundingRectangle(e4, color=YELLOW, buff=0.12)), run_time=0.6)
        chk = R("בדיקה:", "3·7 = 21", ",", "25 − 4 = 21", "✔", size=34, color=GREEN_C).to_edge(DOWN, buff=0.4)
        with self.voice("בדיקה: בשני האגפים יוצא עשרים ואחת. מעולה.") as d:
            self.play(FadeIn(chk, shift=UP * 0.2), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- כמה פתרונות ----------
    def solutions(self):
        sc = Scale(pile(2, 3, 3), pile(2, 5, 3))
        eq = F("2<i>x</i> + 3 = 2<i>x</i> + 5", 52).move_to(RIGHT * 3.2 + UP * 2)
        with self.voice("ועכשיו החלק החדש. מה קורה במשוואה: שתיים איקס ועוד שלוש, שווה שתיים איקס ועוד חמש? "
                        "בכל צד יש שתי קופסאות, אבל בצד ימין יש יותר משקולות.") as d:
            self.play(FadeIn(sc), Write(eq), run_time=2)
            self.play(Rotate(sc.tilt_group(), angle=-0.12, about_point=sc.c), run_time=1.5)
        e2 = F("3 = 5", 60, RED).next_to(eq, DOWN, buff=0.6)
        no = T("אין פתרון!", 48, RED).next_to(e2, DOWN, buff=0.4)
        with self.voice("נוריד שתי קופסאות מכל צד. האיקס נעלם, ונשאר: שלוש שווה חמש. זה לא נכון! "
                        "צד ימין תמיד כבד יותר, ולכן אין פתרון.") as d:
            self.play(FadeOut(sc.lp[1], shift=UP), FadeOut(sc.rp[1], shift=UP), run_time=1.2)
            self.play(Write(e2), run_time=1.2)
            self.wait(1.5)
            self.play(FadeIn(no, scale=1.3), run_time=1)
        self.play(FadeOut(VGroup(sc, eq, e2, no)))

        eq = F("2(<i>x</i> + 1) = 2<i>x</i> + 2", 52).shift(UP * 2)
        e1 = F("2<i>x</i> + 2 = 2<i>x</i> + 2", 52).next_to(eq, DOWN, buff=0.4)
        e2 = F("2 = 2", 60, GREEN_C).next_to(e1, DOWN, buff=0.4)
        with self.voice("ועוד משוואה: שתיים כפול, איקס ועוד אחת, שווה שתיים איקס ועוד שתיים. "
                        "פותחים סוגריים, ומקבלים בדיוק אותו דבר בשני האגפים! מחסירים שתיים איקס: שתיים שווה שתיים.") as d:
            self.play(Write(eq), run_time=1.5)
            self.play(Write(e1), run_time=1.5)
            self.wait(1)
            self.play(Write(e2), run_time=1.2)
        rows = VGroup()
        for x in (0, 1, 5, -3):
            v = 2 * x + 2
            xs = f"({x})".replace("-", "−") if x < 0 else str(x)
            rows.add(R("אם", f"<i>x</i> = {xs}", "←", f"{v} = {v}".replace("-", "−"), "✔", size=32))
        rows.arrange(DOWN, buff=0.25, aligned_edge=RIGHT).next_to(e2, DOWN, buff=0.5)
        inf = T("אין־סוף פתרונות!", 44, GREEN_C).to_edge(LEFT, buff=1).shift(DOWN * 1.5)
        with self.voice("זה נכון תמיד! נציב אפס, אחת, חמש, או מינוס שלוש, ושני האגפים תמיד שווים. "
                        "כל מספר הוא פתרון. למשוואה הזאת יש אין סוף פתרונות.") as d:
            self.play(LaggedStart(*[FadeIn(r, shift=LEFT * 0.2) for r in rows], lag_ratio=0.4), run_time=3)
            self.play(FadeIn(inf, scale=1.3), run_time=1)
        self.play(FadeOut(VGroup(eq, e1, e2, rows, inf)))

        heads = VGroup(
            R("נשאר משפט נכון, כמו", "2 = 2", "←", "אין־סוף פתרונות", size=34, color=GREEN_C),
            R("נשאר משפט לא נכון, כמו", "3 = 5", "←", "אין פתרון", size=34, color=RED),
            R("נשאר", "<i>x</i>", "←", "פתרון אחד", size=34, color=YELLOW),
        ).arrange(DOWN, buff=0.5, aligned_edge=RIGHT)
        top = T("כשה־x נעלם:", 40).next_to(heads, UP, buff=0.6).align_to(heads, RIGHT)
        with self.voice("בקיצור: נשאר משפט נכון, אין סוף פתרונות. משפט לא נכון, אין פתרון. "
                        "ואם האיקס נשאר, יש פתרון אחד.") as d:
            self.play(FadeIn(top), run_time=0.8)
            for h in heads:
                self.play(FadeIn(h, shift=LEFT * 0.3), run_time=1)
                self.wait(max(d / 3 - 1.4, 0.3))
        self.play(FadeOut(VGroup(top, heads)))

    # ---------- שאלה מילולית ----------
    def word(self):
        l1 = R("שחקן קלע בשני משחקים", "30", "נקודות ביחד.", size=38)
        l2 = R("במשחק השני הוא קלע", "6", "נקודות יותר מאשר בראשון.", size=38)
        l3 = T("כמה נקודות קלע במשחק הראשון?", 38, YELLOW)
        story = VGroup(l1, l2, l3).arrange(DOWN, buff=0.3, aligned_edge=RIGHT).to_edge(UP, buff=1.2).to_edge(RIGHT, buff=0.8)
        with self.voice("ועכשיו שאלה מילולית. שחקן קלע בשני משחקים שלושים נקודות ביחד. "
                        "במשחק השני הוא קלע שש נקודות יותר מאשר בראשון. כמה נקודות קלע במשחק הראשון?") as d:
            for ln in story:
                self.play(FadeIn(ln, shift=LEFT * 0.2), run_time=1)
                self.wait(max(d / 3 - 1.2, 0.3))
        g1 = R("משחק ראשון:", "<i>x</i>", size=36, color=BLUE_C)
        g2 = R("משחק שני:", "<i>x</i> + 6", size=36, color=BLUE_C)
        defs = VGroup(g1, g2).arrange(DOWN, buff=0.25, aligned_edge=RIGHT).next_to(story, DOWN, buff=0.6).align_to(story, RIGHT)
        with self.voice("מה שלא יודעים, מסמנים באיקס. במשחק הראשון: איקס נקודות. במשחק השני: איקס ועוד שש.") as d:
            self.play(FadeIn(g1, shift=LEFT * 0.2), run_time=1)
            self.play(FadeIn(g2, shift=LEFT * 0.2), run_time=1)
        e1 = F("<i>x</i> + <i>x</i> + 6 = 30", 50).move_to(LEFT * 3.2 + UP * 0.3)
        e2 = F("2<i>x</i> + 6 = 30", 50).next_to(e1, DOWN, buff=0.35)
        e3 = F("2<i>x</i> = 24", 50).next_to(e2, DOWN, buff=0.35)
        e4 = F("<i>x</i> = 12", 56, YELLOW).next_to(e3, DOWN, buff=0.35)
        with self.voice("ביחד הם שלושים, אז: איקס ועוד איקס ועוד שש, שווה שלושים. "
                        "כלומר שתיים איקס ועוד שש, שווה שלושים. מחסירים שש: שתיים איקס שווה עשרים וארבע. מחלקים בשתיים: איקס שווה שתים עשרה.") as d:
            for e in (e1, e2, e3, e4):
                self.play(Write(e), run_time=1.3)
                self.wait(max(d / 4 - 1.5, 0.3))
        ans = R("במשחק הראשון", "12", "נקודות, ובשני", "18", ".", "ביחד", "30", "✔", size=34, color=GREEN_C).to_edge(DOWN, buff=0.5)
        with self.voice("אז במשחק הראשון הוא קלע שתים עשרה נקודות, ובשני שמונה עשרה. ביחד שלושים. בדיוק!") as d:
            self.play(FadeIn(ans, shift=UP * 0.2), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- סיכום ----------
    def summary(self):
        head = T("מה לזכור", 52, YELLOW).shift(UP * 2.2)
        lines = VGroup(
            T("מה שעושים לאגף אחד, עושים גם לשני", 36),
            T("פותחים סוגריים, אוספים איקסים לצד אחד ומספרים לצד השני", 36),
            T("בודקים: מציבים את הפתרון במשוואה המקורית", 36),
            T("איקס נעלם? משפט נכון = אין־סוף פתרונות, לא נכון = אין פתרון", 36),
        ).arrange(DOWN, buff=0.35, aligned_edge=RIGHT).next_to(head, DOWN, buff=0.6)
        with self.voice("מה לזכור? מה שעושים לאגף אחד, עושים גם לשני. פותחים סוגריים, איקסים לצד אחד ומספרים לצד השני. "
                        "תמיד בודקים. ואם האיקס נעלם: משפט נכון, אין סוף פתרונות. לא נכון, אין פתרון.") as d:
            self.play(FadeIn(head), run_time=0.8)
            for ln in lines:
                self.play(FadeIn(ln, shift=LEFT * 0.2), run_time=1)
                self.wait(max(d / 4 - 1.3, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.6)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם המאזניים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
