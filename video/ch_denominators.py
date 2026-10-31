"""סרטון: משוואות עם מכנה — מכנה מספרי והנעלם במכנה (כיתה ח׳, פרקים 13–14).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_denominators.py Denominators
"""
from common import *

K_COL, BAN = YELLOW, RED_C
GT = "&gt;"


def F(s, size=44, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def frac(n, d, size=48, color=WHITE):
    a, b = F(n, size, color), F(d, size, color)
    bar = Line(LEFT, RIGHT, color=color, stroke_width=3).set_width(max(a.width, b.width) + 0.2)
    return VGroup(a, bar, b).arrange(DOWN, buff=0.1)


def row(*parts, buff=0.25):
    """שורת נוסחה משמאל לימין: מחרוזת → F, אחרת אובייקט כמו שהוא."""
    return VGroup(*[F(p, 48) if isinstance(p, str) else p for p in parts]).arrange(RIGHT, buff=buff)


class Denominators(Narrated):
    def construct(self):
        self.intro()
        self.common()
        self.traps()
        self.inequality()
        self.unknown()
        self.no_solution()
        self.summary()

    def clear(self):
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- פתיח ----------
    def intro(self):
        title = T("משוואות עם מכנה", 68, font=TITLE)
        with self.voice("היום נלמד לפתור משוואות שיש בהן שברים. ויש טריק אחד שהופך אותן לקלות.") as d:
            self.play(Write(title), run_time=2)
            self.wait(max(d - 3, 0.3))
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
        self.title = title
        story = VGroup(
            R("ברבע הראשון שחקן קלע", "שליש", "מהנקודות שלו", size=38),
            R("ברבע השני הוא קלע", "חצי", "מהנקודות שלו", size=38),
            R("ביחד:", "10", "נקודות. כמה נקודות קלע בכל המשחק?", size=38),
        ).arrange(DOWN, buff=0.35, aligned_edge=RIGHT).to_edge(RIGHT, buff=0.8).shift(UP * 1.3)
        story[0][1].set_color(K_COL)
        story[1][1].set_color(K_COL)
        with self.voice("שחקן כדורסל קלע ברבע הראשון שליש מהנקודות שלו במשחק, וברבע השני חצי מהנקודות שלו. "
                        "ביחד, בשני הרבעים, הוא קלע עשר נקודות. כמה נקודות הוא קלע בכל המשחק?") as d:
            for r in story:
                self.play(FadeIn(r, shift=UP * 0.2), run_time=0.9)
                self.wait(max(d / 3 - 1, 0.2))
        eq = row(frac("<i>x</i>", "3"), "+", frac("<i>x</i>", "2"), "= 10").shift(DOWN * 1.4)
        with self.voice("נסמן באיקס את כל הנקודות. שליש מהן זה איקס חלקי שלוש, וחצי זה איקס חלקי שתיים. "
                        "המשוואה: איקס חלקי שלוש, ועוד איקס חלקי שתיים, שווה עשר.") as d:
            self.play(Write(eq), run_time=2.5)
        self.eq = eq
        self.play(FadeOut(story), eq.animate.move_to(UP * 1.8), run_time=1)

    # ---------- מכנה משותף ----------
    def common(self):
        eq = self.eq
        q = T("השברים מפריעים. איך נפטרים מהם?", 38, GREY_A).next_to(eq, DOWN, buff=0.6)
        mult3 = R("כפולות של", "3", ":", "3, 6, 9...", size=36).next_to(q, DOWN, buff=0.5)
        hit = R("6", "מתחלק גם ב־", "3", "וגם ב־", "2", size=36, color=K_COL).next_to(mult3, DOWN, buff=0.3)
        with self.voice("השברים מפריעים. הטריק: כופלים את כל המשוואה במספר ששני המכנים נכנסים בו. "
                        "זה נקרא מכנה משותף. הכפולות של שלוש: שלוש, שש... שש מתחלק גם בשלוש וגם בשתיים. אז המכנה המשותף הוא שש.") as d:
            self.play(FadeIn(q), run_time=1)
            self.wait(max(d / 2 - 2, 0.3))
            self.play(FadeIn(mult3), run_time=1)
            self.play(FadeIn(hit), run_time=1)
        self.play(FadeOut(VGroup(q, mult3, hit)))

        six = lambda: F("6 ·", 48, K_COL)
        big = row(six(), frac("<i>x</i>", "3"), "+", six(), frac("<i>x</i>", "2"), "=", six(), "10").next_to(eq, DOWN, buff=0.7)
        with self.voice("כופלים כל איבר בשש. כל איבר! גם את העשר שבצד השני.") as d:
            self.play(TransformFromCopy(eq, big), run_time=2)
            self.play(*[Indicate(big[i], color=K_COL, scale_factor=1.4) for i in (0, 3, 6)], run_time=1.2)
        res = row(F("2<i>x</i>", 48), "+", F("3<i>x</i>", 48), "=", "60").next_to(big, DOWN, buff=0.6)
        n1 = R("6 ÷ 3 = 2", size=28, color=GREY_A).next_to(big[1], DOWN, buff=0.15)
        n2 = R("6 ÷ 2 = 3", size=28, color=GREY_A).next_to(big[4], DOWN, buff=0.15)
        with self.voice("עכשיו מצמצמים. שש חלקי שלוש זה שתיים, אז נשאר שתיים איקס. שש חלקי שתיים זה שלוש, אז נשאר שלוש איקס. "
                        "ושש כפול עשר, שישים. השברים נעלמו!") as d:
            self.play(FadeIn(n1), run_time=0.8)
            self.wait(max(d / 3 - 1.5, 0.3))
            self.play(FadeIn(n2), run_time=0.8)
            self.wait(max(d / 3 - 1.5, 0.3))
            self.play(FadeOut(VGroup(n1, n2)), Write(res), run_time=1.5)
        s2 = F("5<i>x</i> = 60", 52).next_to(res, DOWN, buff=0.4)
        s3 = F("<i>x</i> = 12", 56, K_COL).next_to(s2, DOWN, buff=0.35)
        with self.voice("עכשיו זו משוואה רגילה: חמש איקס שווה שישים, ואיקס שווה שתים עשרה. "
                        "בדיקה: שליש משתים עשרה זה ארבע, חצי זה שש, וארבע ועוד שש זה עשר. מצוין!") as d:
            self.play(Write(s2), run_time=1.2)
            self.play(Write(s3), run_time=1.2)
            self.play(Circumscribe(s3, color=K_COL), run_time=1.2)
        self.clear()

    # ---------- מלכודות ----------
    def traps(self):
        h1 = T("מלכודת 1: לכפול כל איבר", 44, BAN).shift(UP * 2.3)
        e = row(frac("<i>x</i>", "2"), "+ 1 = 4").next_to(h1, DOWN, buff=0.5)
        bad = R("<i>x</i> + 1 = 8", "✘", size=44, color=BAN)
        good = R("<i>x</i> + 2 = 8", "✔", size=44, color=GREEN_C)
        VGroup(good, bad).arrange(LEFT, buff=2).next_to(e, DOWN, buff=0.6)
        why = R("גם ה־", "1", "נכפל ב־", "2", "!", size=34, color=K_COL).next_to(VGroup(good, bad), DOWN, buff=0.4)
        with self.voice("עכשיו שתי מלכודות. הראשונה: איקס חלקי שתיים, ועוד אחת, שווה ארבע. כופלים בשתיים. "
                        "הרבה כותבים: איקס ועוד אחת שווה שמונה. אבל שכחו לכפול את האחת! "
                        "נכון: איקס ועוד שתיים שווה שמונה.") as d:
            self.play(FadeIn(h1), Write(e), run_time=1.5)
            self.wait(max(d / 3 - 1.5, 0.3))
            self.play(FadeIn(bad), run_time=1)
            self.wait(max(d / 3 - 1, 0.3))
            self.play(FadeIn(good), FadeIn(why), run_time=1.2)
        self.play(FadeOut(VGroup(h1, e, bad, good, why)))

        h2 = T("מלכודת 2: סוגריים סביב המונה", 44, BAN).shift(UP * 2.3)
        e2 = row(F("6 ·", 48, K_COL), frac("<i>x</i> − 1", "3")).next_to(h2, DOWN, buff=0.5)
        r1 = F("= 2(<i>x</i> − 1)", 48).next_to(e2, DOWN, buff=0.5)
        r2 = F("= 2<i>x</i> − 2", 48, GREEN_C).next_to(r1, DOWN, buff=0.3)
        bad2 = R("לא", "2<i>x</i> − 1", "!", size=36, color=BAN).next_to(r2, DOWN, buff=0.45)
        with self.voice("המלכודת השנייה: כשבמונה יש כמה איברים, כמו איקס פחות אחת. שש חלקי שלוש זה שתיים, "
                        "ואת השתיים כופלים בכל המונה. לכן כותבים סוגריים: שתיים כפול איקס פחות אחת, "
                        "שזה שתיים איקס פחות שתיים. ולא שתיים איקס פחות אחת!") as d:
            self.play(FadeIn(h2), Write(e2), run_time=1.5)
            self.wait(max(d / 3 - 1.5, 0.3))
            self.play(Write(r1), run_time=1.2)
            self.wait(max(d / 3 - 1.2, 0.3))
            self.play(Write(r2), FadeIn(bad2), run_time=1.2)
        self.clear()

    # ---------- אי־שוויון עם מכנה ----------
    def inequality(self):
        h = T("גם באי־שוויון", 44, K_COL).shift(UP * 2.3)
        e = row(frac("<i>x</i>", "4"), f"− 1 ≥ 2").next_to(h, DOWN, buff=0.5)
        s1 = F("<i>x</i> − 4 ≥ 8", 48).next_to(e, DOWN, buff=0.5)
        s2 = F("<i>x</i> ≥ 12", 52, GREEN_C).next_to(s1, DOWN, buff=0.35)
        n1 = R("·4", "(חיובי ← הסימן נשאר)", size=30, color=GREY_A).next_to(s1, RIGHT, buff=0.7)
        with self.voice("אותו טריק עובד גם באי שוויון. איקס חלקי ארבע, פחות אחת, גדול או שווה לשתיים. "
                        "כופלים כל איבר בארבע. ארבע הוא מספר חיובי, אז הסימן לא מתהפך. "
                        "איקס פחות ארבע, גדול או שווה לשמונה. ולכן איקס גדול או שווה לשתים עשרה.") as d:
            self.play(FadeIn(h), Write(e), run_time=1.5)
            self.wait(max(d / 3 - 1.5, 0.3))
            self.play(Write(s1), FadeIn(n1), run_time=1.5)
            self.wait(max(d / 3 - 1.5, 0.3))
            self.play(Write(s2), run_time=1.2)
        self.clear()

    # ---------- הנעלם במכנה ----------
    def unknown(self):
        h = T("ומה אם האיקס במכנה?", 46).shift(UP * 2.4)
        e = row(frac("12", "<i>x</i>"), "= 3").next_to(h, DOWN, buff=0.5)
        z = row(frac("12", "0"), "= ?").next_to(e, DOWN, buff=0.7).set_color(BAN)
        ban = T("אי אפשר לחלק באפס!", 40, BAN).next_to(z, DOWN, buff=0.35)
        with self.voice("ומה קורה כשהאיקס נמצא במכנה? למשל: שתים עשרה חלקי איקס, שווה שלוש. "
                        "רגע לפני שפותרים, שאלה חשובה: מה אם איקס שווה אפס? שתים עשרה חלקי אפס... אי אפשר לחלק באפס!") as d:
            self.play(FadeIn(h), Write(e), run_time=1.5)
            self.wait(max(d / 2 - 2, 0.3))
            self.play(FadeIn(z), run_time=1)
            self.play(FadeIn(ban), Wiggle(z), run_time=1.5)
        dom = VGroup(T("תחום הגדרה:", 40, K_COL), F("<i>x</i> ≠ 0", 44, K_COL)).arrange(LEFT, buff=0.3).next_to(e, DOWN, buff=0.7)
        with self.voice("לכן קודם כל כותבים תחום הגדרה: איקס שונה מאפס. זה המספר שאסור להציב.") as d:
            self.play(FadeOut(VGroup(z, ban)), run_time=0.6)
            self.play(Write(dom), run_time=1.5)
        s1 = F("12 = 3<i>x</i>", 48).next_to(dom, DOWN, buff=0.5)
        s2 = F("<i>x</i> = 4", 52, GREEN_C).next_to(s1, DOWN, buff=0.3)
        ok = R("4 ≠ 0", "← מותר ✔", size=34, color=GREEN_C).next_to(s2, DOWN, buff=0.35)
        n1 = R("·<i>x</i>", "משני הצדדים", size=30, color=GREY_A).next_to(s1, RIGHT, buff=0.7)
        with self.voice("עכשיו כופלים את שני הצדדים באיקס: שתים עשרה שווה שלוש איקס. ואיקס שווה ארבע. "
                        "ארבע שונה מאפס, אז הפתרון מותר.") as d:
            self.play(Write(s1), FadeIn(n1), run_time=1.5)
            self.play(Write(s2), run_time=1.2)
            self.wait(max(d - 4.5, 0.3))
            self.play(FadeIn(ok), run_time=1)
        self.clear()

        e = row(frac("6", "<i>x</i> − 2"), "= 3").shift(UP * 2.3)
        dom = VGroup(T("תחום הגדרה:", 38, K_COL), F("<i>x</i> ≠ 2", 42, K_COL)).arrange(LEFT, buff=0.3).next_to(e, DOWN, buff=0.45)
        why = R("כי", "2 − 2 = 0", size=30, color=GREY_A).next_to(dom, DOWN, buff=0.2)
        with self.voice("עוד דוגמה: שש חלקי איקס פחות שתיים, שווה שלוש. מתי המכנה הוא אפס? כשאיקס שווה שתיים. "
                        "אז תחום ההגדרה: איקס שונה משתיים.") as d:
            self.play(Write(e), run_time=1.5)
            self.wait(max(d / 2 - 1.5, 0.3))
            self.play(Write(dom), FadeIn(why), run_time=1.5)
        steps = VGroup(F("6 = 3(<i>x</i> − 2)", 46), F("6 = 3<i>x</i> − 6", 46), F("12 = 3<i>x</i>", 46),
                       F("<i>x</i> = 4", 50, GREEN_C)).arrange(DOWN, buff=0.22).next_to(why, DOWN, buff=0.35)
        n1 = R("·(<i>x</i> − 2)", size=30, color=GREY_A).next_to(steps[0], RIGHT, buff=0.7)
        ok = R("4 ≠ 2", "← מותר ✔", size=32, color=GREEN_C).next_to(steps[3], RIGHT, buff=0.7)
        with self.voice("כופלים את שני הצדדים במכנה, איקס פחות שתיים. שש שווה שלוש כפול איקס פחות שתיים. "
                        "פותחים סוגריים: שלוש איקס פחות שש. מעבירים: שתים עשרה שווה שלוש איקס, ואיקס שווה ארבע. "
                        "ארבע שונה משתיים, אז הכול בסדר.") as d:
            for i, s in enumerate(steps):
                self.play(Write(s), *([FadeIn(n1)] if i == 0 else []), run_time=1.1)
                self.wait(max(d / 4 - 1.6, 0.2))
            self.play(FadeIn(ok), run_time=0.8)
        self.clear()

    # ---------- אין פתרון ----------
    def no_solution(self):
        h = T("מלכודת: הפתרון יצא אסור", 44, BAN).shift(UP * 2.4)
        e = row(frac("<i>x</i>", "<i>x</i> − 3"), "=", frac("3", "<i>x</i> − 3")).next_to(h, DOWN, buff=0.4)
        dom = VGroup(T("תחום הגדרה:", 36, K_COL), F("<i>x</i> ≠ 3", 40, K_COL)).arrange(LEFT, buff=0.3).next_to(e, DOWN, buff=0.4)
        s1 = F("<i>x</i> = 3", 50).next_to(dom, DOWN, buff=0.5)
        cross = Cross(s1, stroke_color=BAN, stroke_width=6)
        no = T("אין פתרון!", 50, BAN).next_to(s1, DOWN, buff=0.45)
        with self.voice("ועכשיו מלכודת. איקס חלקי איקס פחות שלוש, שווה שלוש חלקי איקס פחות שלוש. "
                        "תחום ההגדרה: איקס שונה משלוש.") as d:
            self.play(FadeIn(h), Write(e), run_time=2)
            self.wait(max(d - 4, 0.3))
            self.play(Write(dom), run_time=1.2)
        with self.voice("כופלים במכנה, ומקבלים: איקס שווה שלוש. אבל שלוש אסור! הוא הופך את המכנה לאפס. "
                        "לכן למשוואה הזו אין פתרון. בגלל זה תמיד כותבים תחום הגדרה ובודקים בסוף.") as d:
            self.play(Write(s1), run_time=1.2)
            self.wait(max(d / 3 - 1.2, 0.3))
            self.play(Create(cross), Indicate(dom, color=BAN), run_time=1.2)
            self.play(FadeIn(no, scale=1.3), run_time=1)
        self.clear()

    # ---------- סיכום ----------
    def summary(self):
        rows = VGroup(
            T("מכנה מספרי: כופלים כל איבר במכנה המשותף", 38, K_COL),
            T("מונה עם כמה איברים ← שמים סוגריים", 38),
            T("באי־שוויון: כפל במכנה חיובי לא הופך את הסימן", 38),
            R("הנעלם במכנה: קודם תחום הגדרה, המכנה", "≠ 0", size=38, color=GREEN_C),
            T("בסוף בודקים: פתרון אסור הוא לא פתרון", 38, BAN),
        ).arrange(DOWN, buff=0.4, aligned_edge=RIGHT).move_to(UP * 0.4)
        with self.voice("אז מה למדנו? כשיש מכנה מספרי, כופלים כל איבר במכנה המשותף, והשברים נעלמים. "
                        "מונה עם כמה איברים, שמים בסוגריים. באי שוויון, כפל במכנה חיובי לא הופך את הסימן. "
                        "וכשהאיקס במכנה: קודם כותבים תחום הגדרה, ובסוף בודקים שהפתרון מותר.") as d:
            for r in rows:
                self.play(FadeIn(r, shift=UP * 0.2), run_time=0.9)
                self.wait(max(d / 5 - 1.2, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
