"""סרטון: חוק הפילוג, גורם משותף, חוק הפילוג המורחב ומשוואות עם x² (כיתה ח׳, פרקים 15–16).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_distributive.py Distributive
"""
from common import *

add_pron({"בריבוע": "בְּריבוע", "הסוגריים": "הַסוֹגריים", "סוגריים": "סוֹגריים"})

A_COL, B_COL, C_COL = ORANGE, BLUE_C, GREEN_C


def F(s, size=52, color=WHITE):
    """נוסחה (בלי עברית). x נטוי."""
    return MarkupText(s.replace("x", "<i>x</i>"), font=MATH, font_size=size, color=color)


def part(mob, plain, sub, k=0):
    """הגליפים של sub בתוך נוסחה F(plain) (רווחים לא נספרים). k = מספר המופע."""
    flat = plain.replace(" ", "")
    i = -1
    for _ in range(k + 1):
        i = flat.index(sub.replace(" ", ""), i + 1)
    return mob[i:i + len(sub.replace(" ", ""))]


class Distributive(Narrated):
    def construct(self):
        self.story()
        self.factor()
        self.area()
        self.mistake()
        self.equation()
        self.summary()

    def clear(self, keep=()):
        self.play(*[FadeOut(m) for m in self.mobjects if m not in keep])

    # ---------- חוק הפילוג: חזרה ----------
    def story(self):
        title = T("חוק הפילוג המורחב", 64, font=TITLE)
        with self.voice("המאמן קונה ציוד לחמישה שחקנים. כל שחקן מקבל שני כדורים ושלוש חולצות. "
                        "כמה פריטים המאמן קונה?") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
            players = VGroup(*[VGroup(*[Dot(radius=0.12, color=BALL) for _ in range(2)],
                                      *[Square(0.24, color=BLUE_C, fill_opacity=0.8) for _ in range(3)]).arrange(DOWN, buff=0.12)
                               for _ in range(5)]).arrange(LEFT, buff=0.8).shift(UP * 0.6)
            self.play(LaggedStart(*[FadeIn(p, shift=DOWN * 0.2) for p in players], lag_ratio=0.2), run_time=1.5)
        self.title = title

        s = "5 · (2 + 3)"
        e1 = F(s, 60).next_to(players, DOWN, buff=0.7)
        with self.voice("אפשר לחשב כך: לכל שחקן יש שתיים ועוד שלוש, כלומר חמישה פריטים. "
                        "ויש חמישה שחקנים. חמש כפול חמש, עשרים וחמש.") as d:
            self.play(Write(e1), run_time=1.5)
        five = part(e1, s, "5")
        arcs = VGroup(*[CurvedArrow(five.get_top() + UP * 0.05, part(e1, s, t).get_top() + UP * 0.05,
                                    angle=-PI / 2.5, color=YELLOW, tip_length=0.18) for t in ("2", "3")])
        e2 = F("= 5 · 2 + 5 · 3 = 10 + 15 = 25", 52).next_to(e1, DOWN, buff=0.45)
        with self.voice("ואפשר גם אחרת: חמש כפול שתיים כדורים, ועוד חמש כפול שלוש חולצות. "
                        "עשר ועוד חמש עשרה, גם כן עשרים וחמש. זה חוק הפילוג: "
                        "המספר שבחוץ כופל כל אחד מהאיברים שבתוך הסוגריים.") as d:
            self.play(Create(arcs[0]), Indicate(VGroup(*[p[:2] for p in players]), color=YELLOW), run_time=1.5)
            self.play(Create(arcs[1]), Indicate(VGroup(*[p[2:] for p in players]), color=YELLOW), run_time=1.5)
            self.play(Write(e2), run_time=2.5)
        self.play(FadeOut(VGroup(players, arcs, e1, e2)))

        s = "3(x + 4)"
        a1 = F(s, 72).shift(UP * 1.2 + LEFT * 2)
        a2 = F("= 3x + 12", 72).next_to(a1, RIGHT, buff=0.3)
        three = part(a1, s, "3")
        arcs = VGroup(*[CurvedArrow(three.get_top() + UP * 0.05, part(a1, s, t).get_top() + UP * 0.05,
                                    angle=-PI / 2.5, color=YELLOW, tip_length=0.18) for t in ("x", "4")])
        s3 = "−2(x − 5)"
        b1 = F(s3, 72).shift(DOWN * 1.3 + LEFT * 2)
        b2 = F("= −2x + 10", 72).next_to(b1, RIGHT, buff=0.3)
        warn = R("מינוס כפול מינוס", "=", "פלוס", size=34, color=YELLOW).next_to(VGroup(b1, b2), DOWN, buff=0.45)
        with self.voice("אותו דבר עם איקס. שלוש כפול, סוגריים, איקס ועוד ארבע: שלוש כפול איקס, ועוד שלוש כפול ארבע. "
                        "שלוש איקס ועוד שתים עשרה.") as d:
            self.play(Write(a1), run_time=1.2)
            self.play(Create(arcs), run_time=1.5)
            self.play(Write(a2), run_time=1.5)
        with self.voice("ושים לב לסימנים. מינוס שתיים כפול מינוס חמש זה פלוס עשר, "
                        "כי מינוס כפול מינוס זה פלוס.") as d:
            self.play(Write(b1), run_time=1.2)
            self.play(Write(b2), run_time=1.5)
            self.play(FadeIn(warn, shift=UP * 0.2), run_time=1)
        self.clear(keep=[self.title])

    # ---------- הוצאת גורם משותף ----------
    def factor(self):
        head = T("הוצאת גורם משותף", 44, YELLOW).next_to(self.title, DOWN, buff=0.4)
        s = "6x + 9"
        e = F(s, 80).shift(UP * 0.6)
        with self.voice("עכשיו נלך בכיוון ההפוך. יש לנו שש איקס ועוד תשע, ואנחנו רוצים להכניס אותו לסוגריים. "
                        "זה נקרא: הוצאת גורם משותף.") as d:
            self.play(FadeIn(head), Write(e), run_time=1.5)
        t6 = F("6 = 3 · 2", 44, GREY_B)
        t9 = F("9 = 3 · 3", 44, GREY_B)
        tips = VGroup(t6, t9).arrange(RIGHT, buff=1.5).next_to(e, DOWN, buff=0.7)
        res = F("6x + 9 = 3(2x + 3)", 72, A_COL).next_to(tips, DOWN, buff=0.7)
        with self.voice("מחפשים מספר שמחלק גם את שש וגם את תשע. שלוש! "
                        "שש זה שלוש כפול שתיים, ותשע זה שלוש כפול שלוש. "
                        "מוציאים את השלוש החוצה, ובתוך הסוגריים נשאר שתיים איקס ועוד שלוש.") as d:
            self.play(FadeIn(tips, shift=UP * 0.2), run_time=1.5)
            self.play(Indicate(part(t6, "6 = 3 · 2", "3"), color=A_COL), Indicate(part(t9, "9 = 3 · 3", "3"), color=A_COL), run_time=1.5)
            self.play(Write(res), run_time=2)
        chk = R("בדיקה: פותחים סוגריים וחוזרים אל", "6<i>x</i> + 9", size=34, color=GREEN_C).next_to(res, DOWN, buff=0.4)
        with self.voice("תמיד אפשר לבדוק: פותחים את הסוגריים, וצריך לחזור בדיוק לביטוי שהתחלנו ממנו.") as d:
            self.play(FadeIn(chk, shift=UP * 0.2), run_time=1)
        self.play(FadeOut(VGroup(e, tips, res, chk)))

        s = "x² + 5x = x(x + 5)"
        e2 = F(s, 80).shift(UP * 0.3)
        note = T("גם איקס יכול להיות גורם משותף", 36, GREY_B).next_to(e2, DOWN, buff=0.6)
        with self.voice("גם איקס יכול להיות גורם משותף. באיקס בריבוע ועוד חמש איקס, יש איקס בשני האיברים. "
                        "מוציאים אותו, ומקבלים איקס כפול, סוגריים, איקס ועוד חמש.") as d:
            self.play(Write(e2), run_time=2)
            self.play(Indicate(part(e2, s, "x", 0), color=A_COL), Indicate(part(e2, s, "x", 1), color=A_COL), run_time=1.5)
            self.play(FadeIn(note), run_time=1)
        self.clear(keep=[self.title])

    # ---------- חוק הפילוג המורחב: מודל השטח ----------
    def area(self):
        X, u = 2.6, 0.62
        o = np.array([-6.0, 2.0, 0])  # פינה שמאלית עליונה
        def box(x0, y0, w, h, col, lab):
            r = Rectangle(width=w, height=h, color=WHITE, stroke_width=3, fill_color=col, fill_opacity=0.35)
            r.move_to(o + RIGHT * (x0 + w / 2) + DOWN * (y0 + h / 2))
            return VGroup(r, F(lab, 40).move_to(r))
        W3, H2 = 3 * u, 2 * u
        pieces = VGroup(box(0, 0, X, X, A_COL, "x²"), box(X, 0, W3, X, B_COL, "3x"),
                        box(0, X, X, H2, B_COL, "2x"), box(X, X, W3, H2, C_COL, "6"))
        top = VGroup(F("x", 40, A_COL).move_to(o + RIGHT * X / 2 + UP * 0.35),
                     F("3", 40, A_COL).move_to(o + RIGHT * (X + W3 / 2) + UP * 0.35))
        side = VGroup(F("x", 40, B_COL).move_to(o + DOWN * X / 2 + LEFT * 0.35),
                      F("2", 40, B_COL).move_to(o + DOWN * (X + H2 / 2) + LEFT * 0.35))
        whole = Rectangle(width=X + W3, height=X + H2, color=WHITE, stroke_width=4).move_to(
            o + RIGHT * (X + W3) / 2 + DOWN * (X + H2) / 2)

        q = F("(x + 3)(x + 2) = ?", 60).to_edge(RIGHT, buff=0.7).shift(UP * 1.6)
        with self.voice("ומה קורה כשיש שני זוגות של סוגריים? למשל, סוגריים איקס ועוד שלוש, "
                        "כפול סוגריים איקס ועוד שתיים. בוא נצייר את זה כמלבן.") as d:
            self.play(Write(q), run_time=1.5)
            self.play(Create(whole), run_time=1.5)
        with self.voice("הצלע העליונה של המלבן היא איקס ועוד שלוש. הצלע הצדדית היא איקס ועוד שתיים. "
                        "השטח של המלבן הוא בדיוק המכפלה שלהן.") as d:
            self.play(FadeIn(top, shift=DOWN * 0.2), run_time=1.2)
            self.play(FadeIn(side, shift=RIGHT * 0.2), run_time=1.2)
        with self.voice("עכשיו נחתוך את המלבן לארבעה חלקים. ריבוע של איקס על איקס, ששטחו איקס בריבוע. "
                        "מלבן של שלוש על איקס, שלוש איקס. מלבן של איקס על שתיים, שתיים איקס. "
                        "ומלבן קטן של שלוש על שתיים, שש.") as d:
            self.remove(whole)
            for pc in pieces:
                self.play(FadeIn(pc[0]), Write(pc[1]), run_time=1)
                self.wait(max(d / 4 - 1.3, 0.3))
        s = "= x² + 3x + 2x + 6"
        r1 = F(s, 52).next_to(q, DOWN, buff=0.6).align_to(q, LEFT)
        r2 = F("= x² + 5x + 6", 60, YELLOW).next_to(r1, DOWN, buff=0.45).align_to(q, LEFT)
        with self.voice("השטח של כל המלבן הוא סכום ארבעת החלקים: איקס בריבוע, ועוד שלוש איקס, ועוד שתיים איקס, ועוד שש. "
                        "מחברים את שלוש איקס ושתיים איקס, ומקבלים: איקס בריבוע ועוד חמש איקס ועוד שש.") as d:
            self.play(*[TransformFromCopy(pc[1], part(r1, s, t)) for pc, t in zip(pieces, ["x²", "3x", "2x", "6"])],
                      FadeIn(VGroup(*[part(r1, s, c, k) for c, k in (("=", 0), ("+", 0), ("+", 1), ("+", 2))])), run_time=2.5)
            self.wait(max(d - 5, 0.5))
            self.play(Write(r2), run_time=1.5)
        rule = F("(a + b)(c + d) = ac + ad + bc + bd", 44, GREY_A).to_edge(DOWN, buff=0.55)
        tag = T("כל איבר כופל כל איבר: 4 מכפלות", 34, YELLOW).next_to(rule, UP, buff=0.3)
        with self.voice("זה חוק הפילוג המורחב. כל איבר בסוגריים הראשונים כופל כל איבר בסוגריים השניים. "
                        "תמיד יש ארבע מכפלות, ואחר כך מחברים איברים דומים.") as d:
            self.play(FadeIn(tag), Write(rule), run_time=2.5)
        self.pieces, self.q, self.r2 = pieces, q, r2
        self.keep = VGroup(pieces, top, side)
        self.play(FadeOut(VGroup(r1, rule, tag)))

    # ---------- טעות נפוצה ----------
    def mistake(self):
        wrong = F("(x + 3)(x + 2) = x² + 6", 46, RED_C).next_to(self.q, DOWN, buff=0.7).align_to(self.q, RIGHT)
        cross = Cross(wrong, stroke_color=RED, stroke_width=6)
        with self.voice("טעות מאוד נפוצה: לכפול רק את הראשונים ואת האחרונים, ולכתוב איקס בריבוע ועוד שש. "
                        "אבל תסתכל על המלבן: שכחנו שני חלקים שלמים!") as d:
            self.play(FadeOut(self.r2), FadeIn(wrong), run_time=1)
            self.play(Indicate(self.pieces[0][1], color=YELLOW, scale_factor=1.6), Indicate(self.pieces[3][1], color=YELLOW, scale_factor=1.6), run_time=1.2)
            self.play(*[pc[0].animate.set_fill(RED, 0.8) for pc in self.pieces[1:3]], run_time=1)
            self.play(Wiggle(self.pieces[1]), Wiggle(self.pieces[2]), run_time=1.5)
            self.play(Create(cross), run_time=0.8)
        self.clear(keep=[self.title])

    # ---------- משוואה שבה x² מצטמצם ----------
    def equation(self):
        head = T("משוואה עם איקס בריבוע", 44, YELLOW).next_to(self.title, DOWN, buff=0.35)
        L = [
            "(x + 3)(x + 2) = x² + 16",
            "x² + 5x + 6 = x² + 16",
            "5x + 6 = 16",
            "5x = 10",
            "x = 2",
        ]
        rows = VGroup(*[F(s, 52) for s in L]).arrange(DOWN, buff=0.35).next_to(head, DOWN, buff=0.45)
        rows[-1].set_color(YELLOW)
        notes = [None, R("חוק הפילוג המורחב", size=30, color=GREY_B), R("−<i>x</i>²", "משני האגפים", size=30, color=GREY_B),
                 R("−6", "משני האגפים", size=30, color=GREY_B), R("÷5", size=30, color=GREY_B)]
        for n, r in zip(notes, rows):
            if n: n.next_to(r, LEFT, buff=0.8)
        with self.voice("עכשיו משוואה. סוגריים איקס ועוד שלוש, כפול סוגריים איקס ועוד שתיים, שווה איקס בריבוע ועוד שש עשרה. "
                        "נראה מפחיד? בוא נראה.") as d:
            self.play(FadeIn(head), Write(rows[0]), run_time=2)
        with self.voice("את אגף שמאל כבר פתחנו: איקס בריבוע ועוד חמש איקס ועוד שש.") as d:
            self.play(Write(rows[1]), FadeIn(notes[1]), run_time=2)
        s = L[1]
        x2s = VGroup(part(rows[1], s, "x²", 0), part(rows[1], s, "x²", 1))
        crosses = VGroup(*[Cross(m, stroke_color=RED, stroke_width=5).scale(1.3) for m in x2s])
        with self.voice("ועכשיו הקסם: יש איקס בריבוע בשני האגפים. מחסירים איקס בריבוע משני האגפים, והוא פשוט נעלם! "
                        "נשארת משוואה רגילה, כמו שאנחנו כבר יודעים לפתור.") as d:
            self.play(Indicate(x2s, color=RED, scale_factor=1.5), run_time=1.5)
            self.play(Create(crosses), run_time=1)
            self.play(Write(rows[2]), FadeIn(notes[2]), run_time=1.5)
        box = SurroundingRectangle(rows[4], color=YELLOW, buff=0.15)
        with self.voice("מחסירים שש: חמש איקס שווה עשר. מחלקים בחמש: איקס שווה שתיים.") as d:
            self.play(Write(rows[3]), FadeIn(notes[3]), run_time=1.5)
            self.play(Write(rows[4]), FadeIn(notes[4]), run_time=1.5)
            self.play(Create(box), run_time=0.8)
        chk = R("בדיקה:", "(2 + 3)(2 + 2) = 5 · 4 = 20", ",", "2² + 16 = 20", size=32, color=GREEN_C).to_edge(DOWN, buff=0.4)
        with self.voice("בדיקה: חמש כפול ארבע זה עשרים. ושתיים בריבוע ועוד שש עשרה זה גם עשרים. מעולה!") as d:
            self.play(FadeIn(chk, shift=UP * 0.2), run_time=1.2)
        self.clear(keep=[self.title])

    # ---------- סיכום ----------
    def summary(self):
        lines = VGroup(
            R("פילוג:", "<i>a</i>(<i>b</i> + <i>c</i>) = <i>ab</i> + <i>ac</i>", size=40),
            R("גורם משותף:", "6<i>x</i> + 9 = 3(2<i>x</i> + 3)", size=40),
            R("פילוג מורחב:", "4 מכפלות, ואז מחברים איברים דומים", size=40),
            R("<i>x</i>²", "בשני האגפים? מחסירים אותו ופותרים כרגיל", size=40),
        ).arrange(DOWN, buff=0.5, aligned_edge=RIGHT).shift(UP * 0.4)
        with self.voice("אז מה למדנו? חוק הפילוג: המספר שבחוץ כופל כל איבר בפנים. "
                        "הוצאת גורם משותף: אותו דבר, בכיוון ההפוך. "
                        "חוק הפילוג המורחב: ארבע מכפלות, ואז מחברים איברים דומים. "
                        "ואם יש איקס בריבוע בשני האגפים, מחסירים אותו ופותרים משוואה רגילה.") as d:
            for ln in lines:
                self.play(FadeIn(ln, shift=UP * 0.2), run_time=1)
                self.wait(max(d / 4 - 1.1, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.6)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם מודל השטח, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
