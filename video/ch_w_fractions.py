"""סרטון חימום: שברים ומספרים עשרוניים — מונה ומכנה, שברים שווים וצמצום, שבר↔עשרוני, חיבור, כפל וחילוק, שבר מכמות.

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_w_fractions.py WFractions
"""
from common import *

A_COL, B_COL = ORANGE, BLUE_C


def F(s, size=52, color=WHITE):
    """נוסחה בלי עברית (גופן מתמטי)."""
    return MarkupText(s, font=MATH, font_size=size, color=color)


def FR(num, den, size=52, color=WHITE):
    """שבר: מונה, קו, מכנה."""
    n, d = F(str(num), size, color), F(str(den), size, color)
    w = max(n.width, d.width) + 0.2
    bar = Line(LEFT * w / 2, RIGHT * w / 2, color=color, stroke_width=3)
    return VGroup(n.next_to(bar, UP, buff=0.12), bar, d.next_to(bar, DOWN, buff=0.12))


def row(*mobs, buff=0.25):
    """שורת נוסחה משמאל לימין. מחרוזות הופכות ל־F."""
    return VGroup(*[F(m) if isinstance(m, str) else m for m in mobs]).arrange(RIGHT, buff=buff)


def pizza(n, k, r=1.6, col=A_COL, k2=0, col2=B_COL):
    """פיצה עם n משולשים: k הראשונים בצבע col, ואחריהם k2 בצבע col2 (בכיוון השעון מלמעלה)."""
    g = VGroup()
    for i in range(n):
        c = col if i < k else col2 if i < k + k2 else GREY_E
        g.add(Sector(radius=r, angle=TAU / n, start_angle=PI / 2 - (i + 1) * TAU / n, color=c, fill_opacity=1)
              .set_stroke(WHITE, 3))
    return g


def bar(parts, filled, width=6, h=0.6, col=A_COL):
    return VGroup(*[Rectangle(width=width / parts, height=h, color=WHITE, stroke_width=3)
                    .set_fill(col if i < filled else GREY_E, 1) for i in range(parts)]).arrange(RIGHT, buff=0)


class WFractions(Narrated):
    def construct(self):
        self.story()
        self.equivalent()
        self.decimals()
        self.adding()
        self.mul_div()
        self.of_amount()
        self.summary()

    def clear(self):
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- מה זה שבר ----------
    def story(self):
        title = T("שברים ומספרים עשרוניים", 60, font=TITLE)
        pz = pizza(8, 0).shift(LEFT * 3 + DOWN * 0.4)
        with self.voice("אחרי המשחק, הקבוצה הזמינה פיצה. חתכו אותה לשמונה משולשים שווים, ואתה אכלת שלושה. "
                        "איזה חלק מהפיצה אכלת?") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
            self.play(FadeIn(pz, scale=0.7), run_time=1)
            self.play(*[pz[i].animate.set_fill(A_COL) for i in range(3)], run_time=1.2)
        self.title = title
        fr = FR(3, 8, 110).shift(RIGHT * 2.2 + DOWN * 0.4)
        with self.voice("אכלת שלוש שמיניות. כותבים את זה כשבר: שלוש למעלה, ושמונה למטה.") as d:
            self.play(Write(fr), run_time=2)
        n_lab = R("מונה:", "כמה חלקים לקחנו", size=32, color=A_COL).next_to(fr, RIGHT, buff=0.4).align_to(fr[0], UP)
        d_lab = R("מכנה:", "לכמה חלקים חתכנו", size=32, color=B_COL).next_to(fr, RIGHT, buff=0.4).align_to(fr[2], DOWN)
        VGroup(fr, n_lab, d_lab).shift(LEFT * 1.0)
        with self.voice("המספר למטה נקרא מכנה: לכמה חלקים שווים חתכנו. "
                        "המספר למעלה נקרא מונה: כמה חלקים לקחנו.") as d:
            self.play(fr[2].animate.set_color(B_COL), FadeIn(d_lab, shift=LEFT * 0.2), run_time=1.2)
            self.wait(max(d / 2 - 1.5, 0.3))
            self.play(fr[0].animate.set_color(A_COL), FadeIn(n_lab, shift=LEFT * 0.2), run_time=1.2)
        self.clear()

    # ---------- שברים שווים וצמצום ----------
    def equivalent(self):
        bars = VGroup(bar(2, 1), bar(4, 2), bar(8, 4)).arrange(DOWN, buff=0.7).shift(LEFT * 1 + DOWN * 0.3)
        labs = VGroup(*[FR(n, d, 34).next_to(b, RIGHT, buff=0.5) for (n, d), b in zip([(1, 2), (2, 4), (4, 8)], bars)])
        with self.voice("הנה שלושה פסים באותו אורך. בראשון, חצי צבוע. בשני, שני רבעים. ובשלישי, ארבע שמיניות. "
                        "שים לב: בדיוק אותו גודל!") as d:
            for b, l in zip(bars, labs):
                self.play(FadeIn(b), FadeIn(l), run_time=1)
                self.wait(max(d / 4 - 1.2, 0.2))
            edge = DashedLine(bars[0].get_center() + UP * 0.6, bars[2].get_center() + DOWN * 0.6, color=YELLOW)
            self.play(Create(edge), run_time=1)
        self.play(FadeOut(VGroup(bars, labs, edge)))

        eq = row(FR(1, 2, 64), "=", FR(2, 4, 64), "=", FR(4, 8, 64), buff=0.4).shift(UP * 0.6)
        t1 = F("×2", 34, YELLOW).next_to(VGroup(eq[0], eq[2]), UP, buff=0.25)
        t2 = F("×2", 34, YELLOW).next_to(VGroup(eq[2], eq[4]), UP, buff=0.25)
        rule = T("כופלים את המונה ואת המכנה באותו מספר", 36, YELLOW).shift(DOWN * 1.6)
        with self.voice("אלה שברים שווים. כשכופלים את המונה ואת המכנה באותו מספר, השבר לא משתנה. "
                        "חצי, כפול שתיים למעלה ולמטה, זה שני רבעים. ועוד פעם כפול שתיים: ארבע שמיניות.") as d:
            self.play(FadeIn(eq[0]), run_time=0.8)
            self.play(FadeIn(rule), run_time=0.8)
            self.wait(max(d / 2 - 2, 0.3))
            self.play(FadeIn(eq[1:3]), FadeIn(t1), run_time=1.2)
            self.wait(1)
            self.play(FadeIn(eq[3:]), FadeIn(t2), run_time=1.2)
        self.play(FadeOut(VGroup(eq, t1, t2, rule)))

        red = row(FR(6, 8, 72), "=", FR(3, 4, 72, YELLOW), buff=0.5).shift(UP * 0.4)
        lab = F("÷2", 36, YELLOW).next_to(red, UP, buff=0.3)
        name = R("זה נקרא", "צמצום", size=38, color=YELLOW).shift(DOWN * 1.6)
        with self.voice("וגם הפוך: מחלקים את המונה ואת המכנה באותו מספר. זה נקרא צמצום. "
                        "שש שמיניות, מחלקים בשתיים, שלושה רבעים.") as d:
            self.play(FadeIn(red[0]), FadeIn(name), run_time=1)
            self.wait(max(d - 4, 0.3))
            self.play(FadeIn(lab), TransformFromCopy(red[0], red[2]), FadeIn(red[1]), run_time=1.5)
        self.clear()

    # ---------- שבר ↔ עשרוני ----------
    def decimals(self):
        r1 = row(FR(7, 10), "=", F("0.7", 56, YELLOW), buff=0.4)
        r2 = row(FR(1, 2), "=", FR(5, 10), "=", F("0.5", 56, YELLOW), buff=0.4)
        r3 = row(FR(3, 4), "=", FR(75, 100), "=", F("0.75", 56, YELLOW), buff=0.4)
        rows = VGroup(r1, r2, r3).arrange(DOWN, buff=0.55).shift(DOWN * 0.4)
        for r in rows[1:]:
            r.align_to(r1, LEFT)
        tip = R("מנסים להגיע למכנה", "10", "או", "100", size=34, color=GREY_A).next_to(rows, UP, buff=0.45)
        with self.voice("איך הופכים שבר למספר עשרוני? מנסים להגיע למכנה עשר או מאה. "
                        "שבע חלקי עשר, זה שבע עשיריות: אפס נקודה שבע.") as d:
            self.play(FadeIn(tip), run_time=1)
            self.wait(max(d - 4, 0.3))
            self.play(FadeIn(r1), run_time=1.5)
        x5 = F("×5", 28, GREY_A).next_to(VGroup(r2[0], r2[2]), UP, buff=0.12)
        x25 = F("×25", 28, GREY_A).next_to(VGroup(r3[0], r3[2]), UP, buff=0.12)
        with self.voice("חצי? כופלים בחמש: חמש עשיריות, אפס נקודה חמש. "
                        "ושלושה רבעים? כופלים בעשרים וחמש: שבעים וחמש מאיות, אפס נקודה שבעים וחמש.") as d:
            self.play(FadeIn(r2[0]), run_time=0.6)
            self.play(FadeIn(r2[1:3]), FadeIn(x5), run_time=1)
            self.play(FadeIn(r2[3:]), run_time=1)
            self.wait(max(d / 2 - 2.6, 0.3))
            self.play(FadeIn(r3[0]), run_time=0.6)
            self.play(FadeIn(r3[1:3]), FadeIn(x25), run_time=1)
            self.play(FadeIn(r3[3:]), run_time=1)
        self.clear()

    # ---------- חיבור ----------
    def adding(self):
        pz = pizza(8, 0).shift(LEFT * 3.5 + DOWN * 0.3)
        eq = row(FR(2, 8, 60, A_COL), "+", FR(3, 8, 60, B_COL), "=", FR(5, 8, 60, YELLOW), buff=0.35).shift(RIGHT * 2.3 + UP * 0.4)
        with self.voice("חיבור. שתי שמיניות ועוד שלוש שמיניות. החתיכות באותו גודל, אז פשוט סופרים אותן: "
                        "חמש שמיניות. המכנה נשאר שמונה.") as d:
            self.play(FadeIn(pz), FadeIn(eq[:3]), run_time=1)
            self.play(*[pz[i].animate.set_fill(A_COL) for i in range(2)], run_time=0.8)
            self.play(*[pz[i].animate.set_fill(B_COL) for i in range(2, 5)], run_time=0.8)
            self.wait(max(d - 4.5, 0.3))
            self.play(FadeIn(eq[3:]), run_time=1)
        wrong = row(FR(2, 8, 50), "+", FR(3, 8, 50), "≠", FR(5, 16, 50, RED_C), buff=0.3).next_to(eq, DOWN, buff=0.8)
        cross = Cross(wrong[4], stroke_color=RED_C, stroke_width=6)
        with self.voice("טעות נפוצה: לחבר גם את המכנים, ולקבל חמש חלקי שש עשרה. זה לא נכון! "
                        "המכנה אומר מה גודל החתיכה, והוא לא משתנה כשמחברים.") as d:
            self.play(FadeIn(wrong), run_time=1)
            self.play(Create(cross), run_time=0.8)
            self.wait(max(d - 3.5, 0.3))
            self.play(Indicate(eq[4][2], color=YELLOW, scale_factor=1.6), run_time=1.2)
        self.clear()

        b1, b2 = bar(2, 1, col=A_COL), bar(4, 1, col=B_COL)
        VGroup(b1, b2).arrange(DOWN, buff=0.5).shift(LEFT * 1.5 + UP * 0.6)
        l1, l2 = FR(1, 2, 40).next_to(b1, RIGHT, buff=0.5), FR(1, 4, 40).next_to(b2, RIGHT, buff=0.5)
        b1c = bar(4, 2, col=A_COL).move_to(b1)
        l1c = FR(2, 4, 40, A_COL).move_to(l1)
        total = VGroup(*[Rectangle(width=1.5, height=0.6, color=WHITE, stroke_width=3).set_fill(c, 1)
                         for c in (A_COL, A_COL, B_COL, GREY_E)]).arrange(RIGHT, buff=0).next_to(b2, DOWN, buff=0.9)
        lt = row(FR(2, 4, 40), "+", FR(1, 4, 40), "=", FR(3, 4, 40, YELLOW)).next_to(total, RIGHT, buff=0.5)
        with self.voice("ומה אם המכנים שונים? חצי ועוד רבע. החתיכות בגדלים שונים, אז קודם חותכים את החצי לשני רבעים. "
                        "עכשיו: שני רבעים ועוד רבע, שלושה רבעים.") as d:
            self.play(FadeIn(VGroup(b1, b2, l1, l2)), run_time=1)
            self.wait(max(d / 2 - 2.5, 0.3))
            self.play(ReplacementTransform(b1, b1c), ReplacementTransform(l1, l1c), run_time=1.5)
            self.wait(1)
            self.play(FadeIn(total), FadeIn(lt), run_time=1.5)
        self.clear()

    # ---------- כפל וחילוק ----------
    def mul_div(self):
        m = row(FR(1, 2), "·", FR(2, 3), "=", FR("1·2", "2·3"), "=", FR(2, 6), "=", FR(1, 3, color=YELLOW), buff=0.3).shift(UP * 1.4)
        rule = R("כפל:", "מונה × מונה, מכנה × מכנה", size=34, color=GREY_A).next_to(m, UP, buff=0.4)
        with self.voice("כפל שברים הוא דווקא קל: מונה כפול מונה, ומכנה כפול מכנה. "
                        "חצי כפול שני שלישים: אחת כפול שתיים למעלה, שתיים כפול שלוש למטה. "
                        "שתי שישיות, וזה שליש.") as d:
            self.play(FadeIn(rule), FadeIn(m[:3]), run_time=1)
            self.wait(max(d / 2 - 2.5, 0.3))
            self.play(FadeIn(m[3:5]), run_time=1.2)
            self.wait(1.5)
            self.play(FadeIn(m[5:7]), run_time=1)
            self.play(FadeIn(m[7:]), run_time=1)
        dv = row(FR(3, 4), "÷", FR(1, 2), "=", FR(3, 4), "·", FR(2, 1, color=ORANGE), "=", FR(6, 4), "=", F("1.5", 52, YELLOW), buff=0.3).shift(DOWN * 1.4)
        rule2 = R("חילוק:", "הופכים את השבר השני וכופלים", size=34, color=GREY_A).next_to(dv, UP, buff=0.4)
        with self.voice("ובחילוק: הופכים את השבר השני, וכופלים. שלושה רבעים חלקי חצי, "
                        "זה שלושה רבעים כפול שתיים. שישה רבעים, כלומר אחת וחצי.") as d:
            self.play(FadeIn(rule2), FadeIn(dv[:3]), run_time=1)
            self.wait(max(d / 3 - 1, 0.3))
            self.play(FadeIn(dv[3:7]), Indicate(dv[2], color=ORANGE), run_time=1.5)
            self.wait(1)
            self.play(FadeIn(dv[7:]), run_time=1.2)
        self.clear()

    # ---------- שבר מכמות ----------
    def of_amount(self):
        balls = VGroup(*[VGroup(*[Circle(0.22, color=BALL, fill_opacity=0.35, stroke_width=3) for _ in range(5)]).arrange(RIGHT, buff=0.25)
                         for _ in range(4)]).arrange(DOWN, buff=0.3).shift(LEFT * 3 + DOWN * 0.4)
        boxes = VGroup(*[SurroundingRectangle(r, buff=0.1, color=GREY_B, corner_radius=0.1) for r in balls])
        q = R("3/4", "מתוך", "20", "זריקות", size=40).shift(RIGHT * 3 + UP * 1.6)
        q[0].become(FR(3, 4, 40).move_to(q[0]))
        s1 = F("20 ÷ 4 = 5", 52).shift(RIGHT * 3 + UP * 0.2)
        with self.voice("ועכשיו שבר מתוך כמות. שחקן זרק עשרים זריקות, וקלע שלושה רבעים מהן. כמה זה? "
                        "מחלקים את עשרים הכדורים לארבע קבוצות שוות: חמישה בכל קבוצה.") as d:
            self.play(FadeIn(balls, lag_ratio=0.05), FadeIn(q), run_time=1.5)
            self.wait(max(d - 4.5, 0.3))
            self.play(Create(boxes), Write(s1), run_time=1.5)
        s2 = F("5 · 3 = 15", 52, YELLOW).next_to(s1, DOWN, buff=0.5)
        with self.voice("שלושה רבעים, זה שלוש קבוצות: חמש כפול שלוש, חמש עשרה זריקות.") as d:
            self.play(*[c.animate.set_fill(BALL, 1) for r in balls[:3] for c in r], run_time=1.5)
            self.play(Write(s2), run_time=1.2)
        self.clear()

    # ---------- סיכום ----------
    def summary(self):
        lines = VGroup(
            R("מכנה = לכמה חלקים חתכנו, מונה = כמה לקחנו", size=32),
            R("כופלים או מחלקים מונה ומכנה באותו מספר", "←", "שבר שווה", size=32),
            R("שבר", "←", "עשרוני: מגיעים למכנה", "10", "או", "100", size=32),
            R("חיבור: מכנה משותף, ומחברים רק את המונים", size=32),
            R("כפל: מונה × מונה, מכנה × מכנה. חילוק: הופכים וכופלים", size=32),
            R("שבר מכמות: מחלקים במכנה, כופלים במונה", size=32),
        )
        for i, ln in enumerate(lines):  # ריווח קבוע: שורות עם ספרות נמוכות יותר ונראות צפופות ב־arrange
            ln.shift(UP * (2.2 - i * 0.75 - ln[0].get_y())).align_to(lines[0], RIGHT)  # לפי החלק העברי, לא לפי הספרות
        lines.set_x(0)
        with self.voice("אז מה למדנו? המכנה אומר לכמה חלקים חתכנו, והמונה כמה לקחנו. "
                        "כופלים או מחלקים את שניהם באותו מספר, ומקבלים שבר שווה. "
                        "כדי לחבר צריך מכנה משותף, ומחברים רק את המונים. בכפל: מונה כפול מונה, מכנה כפול מכנה. "
                        "ושבר מתוך כמות: מחלקים במכנה, וכופלים במונה.") as d:
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=0.8)
                self.wait(max(d / 6 - 1.2, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.35)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
