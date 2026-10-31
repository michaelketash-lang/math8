"""סרטון: סטטיסטיקה — ארגון נתונים, דיאגרמות, טווח, ממוצע וחציון (כיתה ח׳, כרך ב׳ פרקים 2–8).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_statistics.py Statistics
"""
from common import *

add_pron({"ממוצע": "מְמֻצָּע", "הממוצע": "הַמְּמֻצָּע", "והממוצע": "וְהַמְּמֻצָּע", "בממוצע": "בַּמְּמֻצָּע",
          "כמותי": "כַּמּוּתִי"})

BASE_Y, UNIT, BW = -2.9, 0.12, 0.8
PTS = [12, 8, 15, 8, 20, 10, 11]


def EQ(s, size=48, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def FR(a, b, size=40, color=WHITE):
    n, d = EQ(str(a), size, color), EQ(str(b), size, color)
    w = max(n.width, d.width) + 0.2
    ln = Line(LEFT * w / 2, RIGHT * w / 2, stroke_width=2.5, color=color)
    n.next_to(ln, UP, buff=0.08)
    d.next_to(ln, DOWN, buff=0.08)
    return VGroup(n, ln, d)


def mkbar(v, x, color=BLUE_C):
    r = Rectangle(width=BW, height=max(v * UNIT, 0.01), fill_color=color, fill_opacity=0.9, stroke_width=0)
    r.move_to([x, BASE_Y + v * UNIT / 2, 0])
    return VGroup(r, EQ(str(v), 30).next_to(r, UP, buff=0.1))


class Statistics(Narrated):
    def construct(self):
        self.story()
        self.variables()
        self.freq()
        self.charts()
        self.range_mean()
        self.median()
        self.summary()

    def clear(self, keep=()):
        self.play(*[FadeOut(m) for m in self.mobjects if m not in keep], run_time=0.8)

    def points_chart(self, vals=PTS, x0=-3.6, dx=1.2):
        xs = [x0 + i * dx for i in range(len(vals))]
        bars = VGroup(*[mkbar(v, x) for v, x in zip(vals, xs)])
        base = Line([x0 - 0.8, BASE_Y, 0], [xs[-1] + 0.8, BASE_Y, 0], color=GREY_C)
        nums = VGroup(*[EQ(str(i + 1), 24, GREY_B).move_to([x, BASE_Y - 0.25, 0]) for i, x in enumerate(xs)])
        cap = T("משחק", 24, GREY_B).next_to(base, RIGHT, buff=0.2).shift(DOWN * 0.25)
        return bars, VGroup(base, nums, cap), xs

    # ---------- פתיח ----------
    def story(self):
        title = T("סטטיסטיקה", 72, font=TITLE)
        with self.voice("איתי שיחק שבעה משחקי כדורסל. אחרי כל משחק הוא רשם כמה נקודות קלע.") as d:
            self.play(Write(title), run_time=1.5)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
        self.title = title
        data = EQ("12,  8,  15,  8,  20,  10,  11", 56).move_to(UP * 1.5)
        bars, frame, _ = self.points_chart()
        with self.voice("אלה הנתונים: שתים עשרה, שמונה, חמש עשרה, שמונה, עשרים, עשר, ואחת עשרה. "
                        "קשה להבין משהו מרשימה של מספרים. סטטיסטיקה עוזרת לנו לארגן נתונים, להציג אותם, ולסכם אותם.") as d:
            self.play(Write(data), run_time=2.5)
            self.wait(1.5)
            self.play(Create(frame[0]), FadeIn(frame[1:]), run_time=1)
            self.play(LaggedStart(*[GrowFromEdge(b[0], DOWN) for b in bars], lag_ratio=0.15),
                      LaggedStart(*[FadeIn(b[1]) for b in bars], lag_ratio=0.15), run_time=2.5)
        self.clear(keep=[title])

    # ---------- משתנה כמותי ואיכותי ----------
    def variables(self):
        h1, h2 = T("משתנה כמותי", 44, BLUE_C), T("משתנה איכותי", 44, ORANGE)
        s1, s2 = T("התשובה היא מספר", 30, GREY_B), T("התשובה היא מילה או סוג", 30, GREY_B)
        e1 = VGroup(*[T(t, 34) for t in ("נקודות במשחק", "גובה", "גיל")]).arrange(DOWN, buff=0.3)
        e2 = VGroup(*[T(t, 34) for t in ("הספורט האהוב", "העמדה במגרש", "צבע החולצה")]).arrange(DOWN, buff=0.3)
        c1 = VGroup(h1, s1, e1).arrange(DOWN, buff=0.4).move_to(RIGHT * 3.2)
        c2 = VGroup(h2, s2, e2).arrange(DOWN, buff=0.4).move_to(LEFT * 3.2)
        div = Line(UP * 2, DOWN * 2.5, color=GREY_D)
        with self.voice("כל מה שאנחנו מודדים נקרא משתנה. יש שני סוגים. "
                        "משתנה כמותי: התשובה היא מספר, כמו נקודות במשחק, גובה, או גיל.") as d:
            self.play(Create(div), FadeIn(h1), FadeIn(s1), run_time=1.5)
            self.play(LaggedStart(*[FadeIn(x, shift=LEFT * 0.2) for x in e1], lag_ratio=0.4), run_time=2)
        with self.voice("ומשתנה איכותי: התשובה היא מילה או סוג, כמו הספורט האהוב, העמדה במגרש, או צבע החולצה. "
                        "עם משתנה איכותי אי אפשר לחשב ממוצע.") as d:
            self.play(FadeIn(h2), FadeIn(s2), run_time=1)
            self.play(LaggedStart(*[FadeIn(x, shift=LEFT * 0.2) for x in e2], lag_ratio=0.4), run_time=2)
        self.clear(keep=[self.title])

    # ---------- טבלת שכיחות ----------
    def freq(self):
        names = ["כדורסל", "כדורגל", "שחייה", "טניס", "אחר"]
        vals = [9, 7, 4, 3, 1]
        self.names, self.vals = names, vals
        q = T("סקר בכיתה: מה הספורט האהוב עליך?", 38).to_edge(UP, buff=1.2)
        heads = [T("ספורט", 32, GREY_B), T("שכיחות", 32, GREY_B), T("שכיחות יחסית", 32, GREY_B)]
        colx = [3.2, 0.9, -1.8]
        rows = VGroup()
        y0, dy = 1.2, 0.62
        for j, h in enumerate(heads):
            h.move_to([colx[j], y0, 0])
        for i, (n, v) in enumerate(zip(names, vals)):
            y = y0 - (i + 1) * dy
            rows.add(VGroup(T(n, 32).move_to([colx[0], y, 0]), EQ(str(v), 34).move_to([colx[1], y, 0])))
        tot = VGroup(T("סך הכול", 32, YELLOW).move_to([colx[0], y0 - 6 * dy, 0]), EQ("24", 34, YELLOW).move_to([colx[1], y0 - 6 * dy, 0]))
        hl = Line([4.6, y0 - dy / 2, 0], [-3.4, y0 - dy / 2, 0], color=GREY_C)
        tl = Line([4.6, y0 - 5.5 * dy, 0], [-3.4, y0 - 5.5 * dy, 0], color=GREY_C)
        with self.voice("עכשיו משתנה איכותי. שאלנו עשרים וארבעה תלמידים: מה הספורט האהוב עליך? "
                        "מסדרים את התשובות בטבלת שכיחות. שכיחות פירושה: כמה פעמים כל תשובה הופיעה.") as d:
            self.play(FadeIn(q), run_time=1)
            self.play(*[FadeIn(h) for h in heads[:2]], Create(hl), run_time=1)
            self.play(LaggedStart(*[FadeIn(r, shift=LEFT * 0.2) for r in rows], lag_ratio=0.3), run_time=2.5)
            self.play(Create(tl), FadeIn(tot), run_time=1)
        box = SurroundingRectangle(rows[0], color=ORANGE, buff=0.12)
        mode = T("השכיח", 30, ORANGE).next_to(box, RIGHT, buff=0.2)
        with self.voice("הערך שמופיע הכי הרבה פעמים נקרא השכיח. כאן השכיח הוא כדורסל, עם תשעה תלמידים.") as d:
            self.play(Create(box), FadeIn(mode), run_time=1.5)
        rel = VGroup(*[VGroup(FR(v, 24, 30), EQ(f"= {v / 24 * 100:g}%", 30)).arrange(RIGHT, buff=0.15)
                       .move_to([colx[2], y0 - (k + 1) * dy, 0]) for k, v in ((0, 9), (3, 3))])
        with self.voice("ושכיחות יחסית אומרת איזה חלק זה מכל התלמידים. מחלקים בסך הכול. "
                        "כדורסל: תשע חלקי עשרים וארבע, שלושים ושבעה וחצי אחוז. טניס: שלוש חלקי עשרים וארבע, שנים עשר וחצי אחוז.") as d:
            self.play(FadeIn(heads[2]), run_time=0.8)
            self.wait(2.5)
            self.play(FadeIn(rel[0]), run_time=1.2)
            self.wait(2.5)
            self.play(FadeIn(rel[1]), run_time=1.2)
        self.clear(keep=[self.title])

    # ---------- דיאגרמות ----------
    def charts(self):
        names, vals = self.names, self.vals
        cols = [ORANGE, BLUE_C, GREEN_C, PURPLE_B, GREY_B]
        x0, dx, u, by = -5.5, 1.1, 0.45, -2.6
        base = Line([x0 - 0.6, by, 0], [x0 + 4 * dx + 0.6, by, 0], color=GREY_C)
        bars = VGroup()
        for i, (n, v) in enumerate(zip(names, vals)):
            r = Rectangle(width=0.75, height=v * u, fill_color=cols[i], fill_opacity=0.95, stroke_width=0)
            r.move_to([x0 + i * dx, by + v * u / 2, 0])
            bars.add(VGroup(r, EQ(str(v), 28).next_to(r, UP, buff=0.08), T(n, 22, GREY_B).next_to([x0 + i * dx, by, 0], DOWN, buff=0.12)))
        h1 = T("דיאגרמת עמודות", 34, YELLOW).move_to([x0 + 2 * dx, 2.5, 0])
        with self.voice("את טבלת השכיחות אפשר להציג בדיאגרמה. בדיאגרמת עמודות, הגובה של כל עמודה הוא השכיחות. "
                        "רואים מיד שכדורסל הכי פופולרי.") as d:
            self.play(FadeIn(h1), Create(base), run_time=1)
            self.play(LaggedStart(*[GrowFromEdge(b[0], DOWN) for b in bars], lag_ratio=0.2),
                      LaggedStart(*[FadeIn(b[1:]) for b in bars], lag_ratio=0.2), run_time=2.5)
            self.play(Indicate(bars[0], color=YELLOW), run_time=1.2)

        R0, c = 1.9, np.array([3.4, -0.4, 0])
        sectors, labels, a = VGroup(), VGroup(), PI / 2
        for i, v in enumerate(vals):
            ang = -v / 24 * TAU
            sectors.add(Sector(radius=R0, angle=ang, start_angle=a, fill_color=cols[i], fill_opacity=0.95,
                               stroke_color="#0e1116", stroke_width=3).shift(c))
            mid = a + ang / 2
            if v >= 3:
                labels.add(EQ(f"{round(v / 24 * 360)}°", 26, BLACK).move_to(c + 0.62 * R0 * np.array([np.cos(mid), np.sin(mid), 0])))
            a += ang
        h2 = T("דיאגרמת עוגה", 34, YELLOW).move_to([c[0], 2.5, 0])
        with self.voice("בדיאגרמת עוגה, כל ספורט מקבל פרוסה. הפרוסה גדולה כמו השכיחות היחסית. "
                        "כל העוגה היא שלוש מאות שישים מעלות.") as d:
            self.play(FadeIn(h2), run_time=0.8)
            self.play(LaggedStart(*[DrawBorderThenFill(s) for s in sectors], lag_ratio=0.25), run_time=2.5)
        calc = VGroup(FR(9, 24, 34), EQ("· 360° = 135°", 36)).arrange(RIGHT, buff=0.15).next_to(sectors, DOWN, buff=0.35)
        with self.voice("הזווית של כדורסל: תשע חלקי עשרים וארבע, כפול שלוש מאות שישים. יוצא מאה שלושים וחמש מעלות.") as d:
            self.play(sectors[0].animate.shift(0.25 * np.array([np.cos(PI / 2 - 9 / 48 * TAU), np.sin(PI / 2 - 9 / 48 * TAU), 0])),
                      labels[0].animate.shift(0.25 * np.array([np.cos(PI / 2 - 9 / 48 * TAU), np.sin(PI / 2 - 9 / 48 * TAU), 0])),
                      FadeIn(labels), run_time=1.2)
            self.play(Write(calc), run_time=2)
        self.clear(keep=[self.title])

    # ---------- טווח וממוצע ----------
    def range_mean(self):
        bars, frame, xs = self.points_chart()
        hd = T("שוב הנקודות של איתי", 34, GREY_B).to_edge(UP, buff=1.2)
        with self.voice("נחזור לנקודות של איתי. זה משתנה כמותי, אז אפשר לחשב איתו.") as d:
            self.play(FadeIn(hd), Create(frame[0]), FadeIn(frame[1:]), *[FadeIn(b) for b in bars], run_time=1.5)
        hi, lo = bars[4], bars[1]
        rng = EQ("20 − 8 = 12", 44, YELLOW).to_edge(RIGHT, buff=0.6).shift(UP * 1.6)
        rl = T("טווח", 36, YELLOW).next_to(rng, UP, buff=0.2)
        with self.voice("קודם הטווח: הערך הגדול ביותר פחות הערך הקטן ביותר. עשרים פחות שמונה, שתים עשרה. "
                        "הטווח מראה כמה הנתונים מפוזרים.") as d:
            self.play(hi[0].animate.set_color(YELLOW), lo[0].animate.set_color(YELLOW), run_time=1)
            self.play(FadeIn(rl), Write(rng), run_time=1.5)
        self.play(hi[0].animate.set_color(BLUE_C), lo[0].animate.set_color(BLUE_C), FadeOut(rl), FadeOut(rng), run_time=0.6)

        s = EQ("12 + 8 + 15 + 8 + 20 + 10 + 11 = 84", 36).to_edge(UP, buff=1.2)
        m = VGroup(EQ("84 ÷ 7 = 12", 44, ORANGE)).to_edge(RIGHT, buff=0.6).shift(UP * 1.4)
        ml = T("ממוצע", 36, ORANGE).next_to(m, UP, buff=0.2)
        with self.voice("עכשיו הממוצע. מחברים את כל הנקודות: יוצא שמונים וארבע. "
                        "ומחלקים במספר המשחקים, שבע. הממוצע הוא שתים עשרה נקודות למשחק.") as d:
            self.play(FadeOut(hd), Write(s), run_time=2.5)
            self.wait(1.5)
            self.play(FadeIn(ml), Write(m), run_time=1.5)
        mline = DashedLine([xs[0] - 0.7, BASE_Y + 12 * UNIT, 0], [xs[-1] + 0.7, BASE_Y + 12 * UNIT, 0], color=ORANGE, stroke_width=4)
        flat = VGroup(*[mkbar(12, x, ORANGE) for x in xs])
        with self.voice("מה זה אומר? דמיין שאיתי היה מחלק את כל הנקודות שלו באופן שווה בין המשחקים. "
                        "העמודות הגבוהות נותנות לנמוכות, ובסוף כולן באותו גובה: שתים עשרה.") as d:
            self.play(Create(mline), run_time=1)
            self.wait(1.5)
            self.play(*[Transform(b, f) for b, f in zip(bars, flat)], run_time=3)
        self.play(*[Transform(b, mkbar(v, x)) for b, v, x in zip(bars, PTS, xs)], run_time=1.5)
        self.bars, self.frame, self.xs, self.mline, self.sum = bars, frame, xs, mline, VGroup(s, m, ml)

    # ---------- חציון ----------
    def median(self):
        bars, xs = self.bars, self.xs
        order = sorted(range(7), key=lambda i: (PTS[i], i))
        med = EQ("8,  8,  10,  11,  12,  15,  20", 44).to_edge(UP, buff=1.2)
        with self.voice("מדד מרכז נוסף הוא החציון. קודם מסדרים את הנתונים מהקטן לגדול.") as d:
            self.play(FadeOut(self.sum), FadeOut(self.frame[1:]), FadeOut(self.mline), run_time=0.6)
            self.play(*[bars[i].animate.move_to([xs[k], bars[i].get_center()[1], 0]) for k, i in enumerate(order)], run_time=2)
            self.play(Write(med), run_time=1.5)
        mid = bars[order[3]]
        ml = EQ("11", 44, BLUE_C)
        lab = VGroup(T("חציון", 36, BLUE_C), ml).arrange(DOWN, buff=0.2).to_edge(RIGHT, buff=0.6).shift(UP * 1.2)
        with self.voice("החציון הוא הנתון שנמצא בדיוק באמצע. יש שבעה נתונים, אז האמצעי הוא הרביעי: "
                        "שלושה לפניו ושלושה אחריו. החציון הוא אחת עשרה.") as d:
            self.play(mid[0].animate.set_color(BLUE_C).set_opacity(1), *[bars[order[k]][0].animate.set_opacity(0.35) for k in (0, 1, 2, 4, 5, 6)], run_time=1.5)
            self.play(Indicate(med[7:9], color=BLUE_C, scale_factor=1.5), run_time=1.5)
            self.play(FadeIn(lab), run_time=1)
        note = T("מספר זוגי של נתונים? ממוצע של שני האמצעיים", 32, GREY_B).to_edge(DOWN, buff=0.2)
        with self.voice("ואם יש מספר זוגי של נתונים, אין אמצעי אחד. אז לוקחים את שני האמצעיים, ומחשבים את הממוצע שלהם.") as d:
            self.play(FadeIn(note), run_time=1)
        self.play(FadeOut(note), *[bars[order[k]][0].animate.set_opacity(0.9) for k in range(7)], run_time=0.6)

        big = mkbar(41, xs[6], RED_C)
        newm = EQ("105 ÷ 7 = 15", 40, ORANGE)
        mlab = VGroup(T("ממוצע", 32, ORANGE), newm).arrange(DOWN, buff=0.15).next_to(lab, DOWN, buff=0.5).to_edge(RIGHT, buff=0.5)
        new_mline = DashedLine([xs[0] - 0.7, BASE_Y + 15 * UNIT, 0], [xs[-1] + 0.7, BASE_Y + 15 * UNIT, 0], color=ORANGE, stroke_width=4)
        med2 = EQ("8,  8,  10,  11,  12,  15,  41", 44).move_to(med)
        with self.voice("ועכשיו ניסוי. נניח שבמשחק אחד איתי קלע ארבעים ואחת נקודות במקום עשרים. "
                        "הממוצע קופץ לחמש עשרה. אבל החציון? הוא נשאר אחת עשרה!") as d:
            self.play(Transform(bars[order[6]], big), Transform(med, med2), run_time=2)
            self.play(Create(new_mline), FadeIn(mlab), run_time=1.5)
            self.wait(1.5)
            self.play(Indicate(lab, color=BLUE_C), run_time=1.2)
        tip = T("ערך חריג מזיז את הממוצע, אבל כמעט לא את החציון", 32, YELLOW).to_edge(DOWN, buff=0.2)
        with self.voice("ערך חריג אחד מזיז את הממוצע הרבה, אבל את החציון כמעט לא. "
                        "לכן חשוב להכיר את שני מדדי המרכז.") as d:
            self.play(FadeIn(tip), run_time=1)
        self.clear(keep=[self.title])

    # ---------- סיכום ----------
    def summary(self):
        lines = VGroup(
            T("כמותי = מספר · איכותי = מילה או סוג", 36),
            T("שכיחות = כמה פעמים · השכיח = מה שמופיע הכי הרבה", 36),
            T("שכיחות יחסית = שכיחות חלקי סך הכול", 36),
            T("טווח = הגדול פחות הקטן", 36),
            T("ממוצע = סכום חלקי כמות", 36),
            T("חציון = האמצעי, אחרי שמסדרים", 36),
        ).arrange(DOWN, buff=0.35, aligned_edge=RIGHT).move_to(UP * 0.3)
        with self.voice("אז מה למדנו? משתנה יכול להיות כמותי או איכותי. השכיח הוא מה שמופיע הכי הרבה. "
                        "שכיחות יחסית היא חלק מהכול. הטווח הוא הגדול פחות הקטן. "
                        "הממוצע הוא סכום חלקי כמות, והחציון הוא האמצעי אחרי שמסדרים.") as d:
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=0.8)
                self.wait(max(d / 6 - 1.0, 0.2))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.4)
        with self.voice("עכשיו תורך! גלול למטה, גרור את העמודות בכלי, ותראה איך הממוצע והחציון זזים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
