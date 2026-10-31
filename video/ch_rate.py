"""סרטון: קצב השתנות של פונקציה (כיתה ח׳, פרק 3).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_rate.py Rate
"""
from common import *

add_pron({"השתנות": "הִשְׁתַּנּוּת", "ההשתנות": "הַהִשְׁתַּנּוּת", "ממלא": "מְמַלֵּא"})


def F(s, size=44, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def axes_labels(ax, xs, ys, size=24):
    g = VGroup()
    for x in xs:
        g.add(T(str(x), size, GREY_B).next_to(ax.c2p(x, ax.y_range[0]), DOWN, buff=0.15))
    for y in ys:
        g.add(T(str(y), size, GREY_B).next_to(ax.c2p(ax.x_range[0], y), LEFT, buff=0.15))
    return g


def hfrac(top, bottom, size=34, color=WHITE):
    """שבר עם מונה ומכנה בעברית (בלי LaTeX)."""
    a, b = T(top, size, color), T(bottom, size, color)
    bar = Line(LEFT, RIGHT, color=color, stroke_width=3).set_width(max(a.width, b.width) + 0.3)
    return VGroup(a, bar, b).arrange(DOWN, buff=0.15)


class Rate(Narrated):
    def construct(self):
        self.story()
        self.table_rate()
        self.straight()
        self.signs()
        self.summary()

    # ---------- מי מהיר יותר? ----------
    def story(self):
        title = T("קצב השתנות", 70, font=TITLE)
        with self.voice("בתחרות קליעות, דן צבר שתים עשרה נקודות בארבע דקות. "
                        "רון צבר עשר נקודות, אבל רק בשתי דקות. מי קולע מהר יותר?") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.55).to_edge(UP, buff=0.3), run_time=1)
            dan = R("דן:", "12", "נקודות ב־", "4", "דקות", size=40).shift(UP * 1.2 + RIGHT * 2)
            ron = R("רון:", "10", "נקודות ב־", "2", "דקות", size=40).next_to(dan, DOWN, buff=0.6).align_to(dan, RIGHT)
            self.play(FadeIn(dan, shift=LEFT * 0.2), run_time=1)
            self.play(FadeIn(ron, shift=LEFT * 0.2), run_time=1)
        self.title = title
        dr = R("12 ÷ 4 = 3", "נקודות לדקה", size=36, color=YELLOW).next_to(dan, LEFT, buff=0.8)
        rr = R("10 ÷ 2 = 5", "נקודות לדקה", size=36, color=YELLOW).next_to(ron, LEFT, buff=0.8).align_to(dr, LEFT)
        with self.voice("לדן יש יותר נקודות, אבל זה לא אומר שהוא מהיר יותר. נבדוק כמה כל אחד צובר בדקה אחת. "
                        "דן: שתים עשרה חלקי ארבע, שלוש נקודות לדקה. רון: עשר חלקי שתיים, חמש נקודות לדקה!") as d:
            self.wait(3)
            self.play(FadeIn(dr, shift=LEFT * 0.2), run_time=1)
            self.wait(2)
            self.play(FadeIn(rr, shift=LEFT * 0.2), run_time=1)
            self.play(Indicate(rr, color=GREEN_C), run_time=1.2)
        defn = R("קצב השתנות: בכמה y משתנה כש־x גדל ב־", "1", size=38, color=YELLOW).to_edge(DOWN, buff=1.6)
        frac = VGroup(T("קצב =", 38), hfrac("השינוי ב־y", "השינוי ב־x", 34)).arrange(LEFT, buff=0.3).next_to(defn, DOWN, buff=0.35)
        with self.voice("המספר הזה נקרא קצב השתנות. הוא אומר בכמה וואי משתנה, כשאיקס גדל באחד. "
                        "מחשבים אותו כך: השינוי בוואי, חלקי השינוי באיקס.") as d:
            self.play(FadeIn(defn, shift=UP * 0.2), run_time=1)
            self.wait(max(d / 2 - 1.5, 0.5))
            self.play(FadeIn(frac, shift=UP * 0.2), run_time=1.2)
        self.wait(2)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- קצב מטבלה ----------
    def table_rate(self):
        xs, ys = [0, 2, 4, 6], [5, 11, 17, 23]
        cols = VGroup(*[VGroup(T(str(x), 40), T(str(y), 40, ORANGE)).arrange(DOWN, buff=0.6) for x, y in zip(xs, ys)])
        cols.arrange(LEFT, buff=1.3)
        heads = VGroup(T("דקות", 34, GREY_B), T("ליטרים", 34, GREY_B)).arrange(DOWN, buff=0.6).next_to(cols, RIGHT, buff=0.7)
        heads[0].match_y(cols[0][0]); heads[1].match_y(cols[0][1])
        tab = VGroup(heads, cols).move_to(UP * 0.6)
        cap = T("ברז ממלא דלי", 36, GREY_B).next_to(tab, UP, buff=0.8)
        with self.voice("ברז ממלא דלי. בהתחלה יש בדלי חמישה ליטרים. אחרי שתי דקות: אחת עשרה. "
                        "אחרי ארבע: שבע עשרה. ואחרי שש: עשרים ושלוש.") as d:
            self.play(FadeIn(cap), FadeIn(heads), run_time=1)
            for c in cols:
                self.play(FadeIn(c, shift=LEFT * 0.2), run_time=0.6)
                self.wait(max(d / 4 - 0.9, 0.2))
        # חיצים בין העמודות: למעלה +2 בזמן, למטה +6 בליטרים
        top, bot = VGroup(), VGroup()
        for i in range(3):
            a, b = cols[i], cols[i + 1]
            top.add(VGroup(CurvedArrow(a[0].get_top() + UP * 0.15, b[0].get_top() + UP * 0.15, angle=PI / 3, color=BLUE_C, tip_length=0.15),
                           F("+2", 30, BLUE_C).move_to((a[0].get_top() + b[0].get_top()) / 2 + UP * 0.65)))
            bot.add(VGroup(CurvedArrow(a[1].get_bottom() + DOWN * 0.15, b[1].get_bottom() + DOWN * 0.15, angle=-PI / 3, color=ORANGE, tip_length=0.15),
                           F("+6", 30, ORANGE).move_to((a[1].get_bottom() + b[1].get_bottom()) / 2 + DOWN * 0.65)))
        with self.voice("בכל עמודה הזמן גדל בשתי דקות, ובכל פעם נכנסים שישה ליטרים.") as d:
            self.play(FadeOut(cap), LaggedStart(*[Create(t) for t in top], lag_ratio=0.3), run_time=2)
            self.play(LaggedStart(*[Create(b) for b in bot], lag_ratio=0.3), run_time=2)
        wrong = R("הקצב הוא", "6", "?", size=40, color=RED).to_edge(DOWN, buff=1.4)
        cross = Cross(wrong, stroke_color=RED, stroke_width=5)
        with self.voice("אז הקצב הוא שש? זהירות! זו הטעות הכי נפוצה. שישה ליטרים נכנסים בשתי דקות, לא בדקה אחת.") as d:
            self.play(FadeIn(wrong), run_time=1)
            self.wait(1.5)
            self.play(Create(cross), run_time=0.8)
        right = R("קצב:", "6 ÷ 2 = 3", "ליטרים לדקה", size=40, color=GREEN_C).to_edge(DOWN, buff=1.4)
        with self.voice("מחלקים את השינוי בליטרים בשינוי בזמן: שש חלקי שתיים, שלושה ליטרים בכל דקה. זה הקצב.") as d:
            self.play(FadeOut(VGroup(wrong, cross)), FadeIn(right, shift=UP * 0.2), run_time=1.2)
            self.play(Indicate(right, color=GREEN_C), run_time=1.2)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- קצב קבוע = קו ישר ----------
    def straight(self):
        ax = Axes(x_range=[0, 6, 1], y_range=[0, 24, 4], x_length=5.4, y_length=4.6, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=0.9).shift(DOWN * 0.5)
        labs = axes_labels(ax, range(0, 7), range(0, 25, 8), 20)
        xs, ys = [0, 2, 4, 6], [5, 11, 17, 23]
        dots = VGroup(*[Dot(ax.c2p(x, y), color=ORANGE, radius=0.1) for x, y in zip(xs, ys)])
        line = ax.plot(lambda x: 3 * x + 5, x_range=[0, 6], color=WHITE, stroke_width=4)
        steps = VGroup()
        for x, y in zip(xs[:3], ys[:3]):
            steps.add(VGroup(Line(ax.c2p(x, y), ax.c2p(x + 2, y), color=BLUE_C, stroke_width=4),
                             Line(ax.c2p(x + 2, y), ax.c2p(x + 2, y + 6), color=ORANGE, stroke_width=4)))
        msg = VGroup(T("קצב קבוע", 44, GREEN_C), T("←  קו ישר", 44, GREEN_C)).arrange(DOWN, buff=0.3).to_edge(RIGHT, buff=1.2).shift(UP * 1)
        with self.voice("נשים את הנקודות של הדלי בגרף. כל פעם אותו צעד: שתיים ימינה, שש למעלה. "
                        "ולכן כל הנקודות על קו ישר. כשהקצב קבוע, הגרף הוא קו ישר, ופונקציה כזאת נקראת פונקציה קווית.") as d:
            self.play(Create(ax), FadeIn(labs), run_time=1.2)
            self.play(LaggedStart(*[FadeIn(dt, scale=2) for dt in dots], lag_ratio=0.3), run_time=1.5)
            self.play(LaggedStart(*[Create(s) for s in steps], lag_ratio=0.4), run_time=2)
            self.play(Create(line), FadeIn(msg), run_time=1.5)
        self.play(FadeOut(VGroup(dots, line, steps, msg, labs, ax)))

        ax2 = Axes(x_range=[0, 4, 1], y_range=[0, 16, 4], x_length=5.4, y_length=4.6, tips=False,
                   axis_config={"color": GREY_C}).to_edge(LEFT, buff=0.9).shift(DOWN * 0.5)
        labs2 = axes_labels(ax2, range(0, 5), range(0, 17, 4), 20)
        ys2 = [1, 2, 4, 8, 16]
        dots2 = VGroup(*[Dot(ax2.c2p(x, y), color=ORANGE, radius=0.1) for x, y in enumerate(ys2)])
        curve = ax2.plot(lambda x: 2 ** x, x_range=[0, 4], color=WHITE, stroke_width=4)
        diffs = R("השינויים:", "+1, +2, +4, +8", size=36, color=YELLOW).to_edge(RIGHT, buff=0.8).shift(UP * 1.4)
        msg2 = VGroup(T("קצב משתנה", 44, RED_C), T("←  עקומה", 44, RED_C)).arrange(DOWN, buff=0.3).next_to(diffs, DOWN, buff=0.7)
        with self.voice("ומה אם הקצב משתנה? כאן וואי גדל פעם באחת, אחר כך בשתיים, בארבע, ובשמונה. "
                        "הנקודות כבר לא על קו ישר, והגרף מתעקם.") as d:
            self.play(Create(ax2), FadeIn(labs2), run_time=1)
            self.play(LaggedStart(*[FadeIn(dt, scale=2) for dt in dots2], lag_ratio=0.3), FadeIn(diffs), run_time=2)
            self.play(Create(curve), FadeIn(msg2), run_time=1.5)
        self.play(FadeOut(VGroup(dots2, curve, diffs, msg2, labs2, ax2)))

    # ---------- סימן הקצב ----------
    def signs(self):
        panels = VGroup()
        data = [(1, "קצב חיובי", "עולה", GREEN_C, "הדלי מתמלא"), (-1, "קצב שלילי", "יורדת", RED_C, "הבריכה מתרוקנת"),
                (0, "קצב אפס", "קבועה", GREY_B, "המחיר לא משתנה")]
        for m, name, word, col, ex in data:
            ax = Axes(x_range=[0, 4, 1], y_range=[0, 4, 1], x_length=3, y_length=2.4, tips=False, axis_config={"color": GREY_C})
            g = ax.plot(lambda x, m=m: 2 + m * 0.4 * (x - 2) if m else 2, x_range=[0, 4], color=col, stroke_width=5)
            lab = VGroup(T(name, 32, col), T("הפונקציה " + word, 30, col), T(ex, 26, GREY_B)).arrange(DOWN, buff=0.15)
            panels.add(VGroup(ax, g, lab.next_to(ax, DOWN, buff=0.35)))
        panels.arrange(LEFT, buff=0.9).shift(DOWN * 0.3)
        with self.voice("לקצב יש גם סימן. קצב חיובי: הכמות גדלה, והפונקציה עולה. "
                        "קצב שלילי: הכמות קטנה, למשל בריכה שמתרוקנת, והפונקציה יורדת. "
                        "וקצב אפס: שום דבר לא משתנה, והפונקציה קבועה.") as d:
            for p in panels:
                self.play(Create(p[0]), Create(p[1]), FadeIn(p[2]), run_time=1.5)
                self.wait(max(d / 3 - 1.6, 0.3))
        self.play(FadeOut(panels))

        # שימוש בקצב: כמה יהיה אחרי 10 דקות
        q = R("כמה ליטרים יהיו בדלי אחרי", "10", "דקות?", size=40).shift(UP * 1.8)
        s1 = R("אחרי", "6", "דקות היו", "23", "ליטרים.", size=36).next_to(q, DOWN, buff=0.6)
        s2 = R("עוד", "4", "דקות", "←", "4 · 3 = 12", "ליטרים נוספים", size=36).next_to(s1, DOWN, buff=0.35)
        s3 = R("23 + 12 = 35", "ליטרים", size=44, color=YELLOW).next_to(s2, DOWN, buff=0.5)
        with self.voice("ועכשיו נשתמש בקצב. כמה ליטרים יהיו בדלי אחרי עשר דקות? "
                        "אחרי שש דקות היו עשרים ושלושה ליטרים. עוד ארבע דקות, בכל דקה שלושה ליטרים: עוד שתים עשרה. "
                        "ביחד שלושים וחמישה ליטרים.") as d:
            self.play(FadeIn(q), run_time=1)
            self.wait(max(d / 3 - 1.5, 0.5))
            self.play(FadeIn(s1, shift=UP * 0.2), run_time=1)
            self.play(FadeIn(s2, shift=UP * 0.2), run_time=1)
            self.wait(max(d / 3 - 1.5, 0.5))
            self.play(FadeIn(s3, shift=UP * 0.2), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- סיכום ----------
    def summary(self):
        head = T("מה לזכור", 52, YELLOW).shift(UP * 2.3)
        lines = VGroup(
            R("קצב השתנות: בכמה y משתנה כש־x גדל ב־", "1", size=36),
            T("מחשבים: השינוי ב־y חלקי השינוי ב־x", 36),
            R("זהירות כשה־x קופץ ביותר מ־", "1", "!", size=36, color=RED_C),
            T("חיובי = עולה, שלילי = יורדת, אפס = קבועה", 36),
            T("קצב קבוע = קו ישר = פונקציה קווית", 36, GREEN_C),
        ).arrange(DOWN, buff=0.32, aligned_edge=RIGHT).next_to(head, DOWN, buff=0.5)
        with self.voice("מה לזכור? קצב השתנות אומר בכמה וואי משתנה כשאיקס גדל באחד. "
                        "מחשבים: השינוי בוואי חלקי השינוי באיקס, וזהירות כשאיקס קופץ ביותר מאחד. "
                        "קצב חיובי, עולה. שלילי, יורדת. אפס, קבועה. וכשהקצב קבוע, הגרף הוא קו ישר.") as d:
            self.play(FadeIn(head), run_time=0.8)
            for ln in lines:
                self.play(FadeIn(ln, shift=LEFT * 0.2), run_time=0.9)
                self.wait(max(d / 5 - 1.1, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הטבלה החיה, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
