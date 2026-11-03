"""סרטון חימום: ביטויים אלגבריים — הצבה, כינוס איברים דומים, פילוג פשוט והיקף (חזרה מכיתה ז׳).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_w_algebra.py WAlgebra
"""
from common import *

add_pron({"מציבים": "מַצִּיבִים", "סוגריים": "סוֹגריים", "בסוגריים": "בַּסוֹגריים"})

X_COL, ONE_COL = ORANGE, BLUE_C


def F(s, size=60, color=WHITE):
    """נוסחה בלי עברית. x נטוי."""
    return MarkupText(s.replace("x", "<i>x</i>"), font=MATH, font_size=size, color=color)


def part(mob, plain, sub, k=0):
    """הגליפים של sub בתוך F(plain) (רווחים לא נספרים). k = מספר המופע."""
    flat, sub = plain.replace(" ", ""), sub.replace(" ", "")
    i = -1
    for _ in range(k + 1):
        i = flat.index(sub, i + 1)
    return mob[i:i + len(sub)]


def xt():
    r = Rectangle(width=0.36, height=1.1, color=WHITE, stroke_width=2, fill_color=X_COL, fill_opacity=0.9)
    return VGroup(r, F("x", 26).move_to(r))


def one():
    return Square(0.36, color=WHITE, stroke_width=2, fill_color=ONE_COL, fill_opacity=0.9)


def mark(ok, size=48):
    return T("✔" if ok else "✘", size, GREEN_C if ok else RED_C, font=MATH)


class WAlgebra(Narrated):
    def construct(self):
        self.story()
        self.substitute()
        self.like_terms()
        self.distribute()
        self.perimeter()
        self.summary()

    def clear(self):
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- סיפור: 2x + 3 ----------
    def story(self):
        title = T("ביטויים אלגבריים", 64, font=TITLE)
        with self.voice("שחקן קלע כמה סלים של שתי נקודות. אנחנו לא יודעים כמה, "
                        "אז נקרא למספר הזה: איקס.") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
            lab = R("מספר הסלים:", "<i>x</i>", size=48).shift(UP * 1.2)
            self.play(FadeIn(lab, shift=UP * 0.2), run_time=1)
        self.title = title
        s = "2x + 3"
        e = F(s, 96).shift(DOWN * 0.4)
        t1 = T("נקודות מסלים", 30, X_COL).next_to(part(e, s, "2x"), DOWN, buff=0.4).shift(LEFT * 0.7)
        t2 = T("זריקות עונשין", 30, ONE_COL).next_to(part(e, s, "3"), DOWN, buff=0.4).shift(RIGHT * 0.7)
        with self.voice("בנוסף הוא קלע שלוש זריקות עונשין. כמה נקודות הוא קלע בסך הכול? "
                        "שתיים איקס, ועוד שלוש. זה ביטוי אלגברי: מתכון חשבוני עם אות.") as d:
            self.play(Write(e), run_time=2)
            self.play(part(e, s, "2x").animate.set_color(X_COL), FadeIn(t1), run_time=1)
            self.play(part(e, s, "3").animate.set_color(ONE_COL), FadeIn(t2), run_time=1)
        self.play(FadeOut(lab), FadeOut(VGroup(t1, t2)), e.animate.scale(0.6).next_to(title, DOWN, buff=0.4))
        self.e = e

    # ---------- הצבה ----------
    def substitute(self):
        e = self.e
        q = R("אם", "<i>x</i> = 4", size=44).next_to(e, DOWN, buff=0.5)
        l1 = F("2 · 4 + 3", 64)
        l2 = F("= 8 + 3 = 11", 64)
        VGroup(l1, l2).arrange(DOWN, buff=0.35, aligned_edge=LEFT).next_to(q, DOWN, buff=0.5)
        with self.voice("אם הוא קלע ארבעה סלים, מציבים ארבע במקום איקס: שתיים כפול ארבע, ועוד שלוש. "
                        "שמונה ועוד שלוש, אחת עשרה נקודות.") as d:
            self.play(FadeIn(q), Indicate(part(e, "2x + 3", "x"), color=YELLOW, scale_factor=1.6), run_time=1.5)
            self.play(TransformFromCopy(e, l1), run_time=1.5)
            self.wait(1)
            self.play(Write(l2), run_time=2)
        dot = part(l1, "2 · 4 + 3", "·")
        with self.voice("שים לב: שתיים איקס פירושו שתיים כפול איקס. כשמציבים מספר, סימן הכפל חוזר להופיע.") as d:
            self.play(Indicate(dot, color=YELLOW, scale_factor=2.5), run_time=1.5)
            self.play(Indicate(dot, color=YELLOW, scale_factor=2.5), run_time=1.5)
        self.play(FadeOut(VGroup(q, l1, l2)))

        q2 = R("אם", "<i>x</i> = −2", size=44).next_to(e, DOWN, buff=0.5)
        m1 = F("2 · (−2) + 3", 64)
        m2 = F("= −4 + 3 = −1", 64)
        VGroup(m1, m2).arrange(DOWN, buff=0.35, aligned_edge=LEFT).next_to(q2, DOWN, buff=0.5)
        tip = T("מספר שלילי מציבים בסוגריים", 34, YELLOW).next_to(m2, DOWN, buff=0.6)
        with self.voice("באלגברה איקס יכול להיות גם מספר שלילי. אם איקס שווה מינוס שתיים, "
                        "מציבים אותו בסוגריים: שתיים כפול מינוס שתיים, ועוד שלוש. "
                        "מינוס ארבע ועוד שלוש, זה מינוס אחת.") as d:
            self.play(FadeIn(q2), run_time=1)
            self.play(Write(m1), run_time=1.5)
            self.play(Indicate(part(m1, "2 · (−2) + 3", "(−2)"), color=YELLOW), FadeIn(tip), run_time=1.5)
            self.wait(1.5)
            self.play(Write(m2), run_time=2)
        self.clear()

    # ---------- כינוס איברים דומים ----------
    def like_terms(self):
        s = "3x + 2 + 2x + 1"
        e = F(s, 64)
        res = F("= 5x + 3", 64)
        VGroup(e, res).arrange(RIGHT, buff=0.3).next_to(self.title, DOWN, buff=0.5)
        kinds = "xxx11xx1"
        tiles = VGroup(*[xt() if k == "x" else one() for k in kinds])
        # קבוצות לפי האיברים בביטוי, משמאל לימין
        groups = VGroup(VGroup(*tiles[0:3]).arrange(RIGHT, buff=0.12), VGroup(*tiles[3:5]).arrange(RIGHT, buff=0.12),
                        VGroup(*tiles[5:7]).arrange(RIGHT, buff=0.12), VGroup(*tiles[7:8]))
        groups.arrange(RIGHT, buff=0.7).next_to(e, DOWN, buff=0.8)
        with self.voice("עכשיו ביטוי ארוך יותר: שלוש איקס ועוד שתיים, ועוד שתיים איקס ועוד אחת. "
                        "נצייר כל איקס כמלבן כתום, וכל אחד כריבוע כחול קטן.") as d:
            self.play(Write(e), run_time=2)
            self.play(LaggedStart(*[FadeIn(g, shift=DOWN * 0.2) for g in groups], lag_ratio=0.4), run_time=2.5)
        xs = VGroup(*[t for t, k in zip(tiles, kinds) if k == "x"])
        ones = VGroup(*[t for t, k in zip(tiles, kinds) if k == "1"])
        tx = xs.copy().arrange(RIGHT, buff=0.12)
        to = ones.copy().arrange(RIGHT, buff=0.12)
        VGroup(tx, to).arrange(RIGHT, buff=1.5).next_to(groups, DOWN, buff=0.9)
        with self.voice("איברים דומים הם איברים מאותו סוג: איקסים עם איקסים, ומספרים עם מספרים. "
                        "נאסוף כל סוג לחוד.") as d:
            self.play(Indicate(part(e, s, "3x"), color=X_COL), Indicate(part(e, s, "2x"), color=X_COL), run_time=1.5)
            self.play(*[Transform(a, b) for a, b in zip(xs, tx)], run_time=1.5)
            self.play(*[Transform(a, b) for a, b in zip(ones, to)], run_time=1.5)
        n1 = F("5x", 48, X_COL).next_to(tx, DOWN, buff=0.35)
        n2 = F("3", 48, ONE_COL).next_to(to, DOWN, buff=0.35)
        with self.voice("יש חמישה איקסים, ושלושה ריבועים קטנים. אז הביטוי שווה חמש איקס ועוד שלוש. "
                        "זה נקרא כינוס איברים דומים.") as d:
            self.play(FadeIn(n1), run_time=1)
            self.play(FadeIn(n2), run_time=1)
            self.play(Write(res), run_time=1.5)
        self.play(FadeOut(VGroup(groups, n1, n2, res, e)))

        bad = VGroup(F("3x + 2 ≠ 5x", 72, RED_C), mark(False, 60)).arrange(RIGHT, buff=0.5).shift(UP * 0.6)
        why = T("איקס ומספר בודד — לא איברים דומים", 38, GREY_B).next_to(bad, DOWN, buff=0.7)
        with self.voice("וזהירות! שלוש איקס ועוד שתיים זה לא חמש איקס. "
                        "איקס ומספר בודד הם לא איברים דומים, ואי אפשר לחבר אותם לאיבר אחד.") as d:
            self.play(FadeIn(bad, shift=UP * 0.2), run_time=1.2)
            self.play(FadeIn(why), run_time=1)
        self.clear()

    # ---------- חוק הפילוג ----------
    def distribute(self):
        s = "3(x + 2)"
        e = F(s, 72).next_to(self.title, DOWN, buff=0.5)
        packs = VGroup(*[VGroup(xt(), one(), one()).arrange(RIGHT, buff=0.12) for _ in range(3)]).arrange(RIGHT, buff=0.9)
        packs.next_to(e, DOWN, buff=0.7)
        frames = VGroup(*[SurroundingRectangle(p, color=GREY_B, buff=0.15, corner_radius=0.1) for p in packs])
        with self.voice("ומה זה שלוש כפול, סוגריים, איקס ועוד שתיים? "
                        "זה שלוש פעמים החבילה: איקס ועוד שתיים.") as d:
            self.play(Write(e), run_time=1.5)
            self.play(LaggedStart(*[FadeIn(VGroup(p, f), shift=DOWN * 0.2) for p, f in zip(packs, frames)], lag_ratio=0.4), run_time=2)
        xs = VGroup(*[p[0] for p in packs])
        ones = VGroup(*[t for p in packs for t in p[1:]])
        tx, to = xs.copy().arrange(RIGHT, buff=0.12), ones.copy().arrange(RIGHT, buff=0.12)
        VGroup(tx, to).arrange(RIGHT, buff=1.5).next_to(packs, DOWN, buff=0.9)
        res = F("= 3x + 6", 72).next_to(e, RIGHT, buff=0.3)
        rule = T("המספר שבחוץ כופל כל איבר שבפנים", 36, YELLOW).to_edge(DOWN, buff=0.5)
        with self.voice("נאסוף: שלושה איקסים, ושישה ריבועים. כלומר שלוש איקס ועוד שש. "
                        "המספר שבחוץ כופל כל איבר שבפנים.") as d:
            self.play(FadeOut(frames), *[Transform(a, b) for a, b in zip(xs, tx)], run_time=1.5)
            self.play(*[Transform(a, b) for a, b in zip(ones, to)], run_time=1.5)
            self.play(Write(res), run_time=1.2)
            self.play(FadeIn(rule), run_time=1)
        self.clear()

    # ---------- היקף ----------
    def perimeter(self):
        rect = Rectangle(width=4.6, height=2.4, color=WHITE, stroke_width=4, fill_color=GREEN_E, fill_opacity=0.35)
        rect.to_edge(LEFT, buff=1.3).shift(DOWN * 0.2)
        L = [F("x + 3", 40, X_COL).next_to(rect, UP, buff=0.2), F("x + 3", 40, X_COL).next_to(rect, DOWN, buff=0.2),
             F("x", 40, ONE_COL).next_to(rect, LEFT, buff=0.2), F("x", 40, ONE_COL).next_to(rect, RIGHT, buff=0.2)]
        with self.voice("ולבסוף: היקף. למגרש מלבני יש אורך איקס ועוד שלוש, ורוחב איקס. "
                        "ההיקף הוא סכום כל הצלעות.") as d:
            self.play(Create(rect), run_time=1.2)
            self.play(LaggedStart(*[FadeIn(l) for l in L], lag_ratio=0.3), run_time=1.5)
        p1 = F("(x + 3) + x + (x + 3) + x", 44)
        p2 = F("= 4x + 6", 56, YELLOW)
        VGroup(p1, p2).arrange(DOWN, buff=0.4, aligned_edge=LEFT).next_to(rect, RIGHT, buff=0.9).shift(UP * 0.8)
        with self.voice("מחברים את ארבע הצלעות, ואוספים איברים דומים: ארבעה איקסים. "
                        "ושלוש ועוד שלוש, שש. ההיקף: ארבע איקס ועוד שש.") as d:
            self.play(Write(p1), run_time=2.5)
            self.wait(1)
            self.play(Write(p2), run_time=1.5)
        p3 = R("אם", "<i>x</i> = 5", size=40).next_to(p2, DOWN, buff=0.6).align_to(p1, LEFT)
        p4 = F("4 · 5 + 6 = 26", 56).next_to(p3, DOWN, buff=0.3).align_to(p1, LEFT)
        with self.voice("ואם איקס שווה חמש? מציבים: ארבע כפול חמש ועוד שש. עשרים ועוד שש, עשרים ושש.") as d:
            self.play(FadeIn(p3), run_time=1)
            self.play(Write(p4), run_time=2)
        self.clear()

    # ---------- סיכום ----------
    def summary(self):
        rows = VGroup(
            R("הצבה:", "<i>x</i> = 4", "←", "2 · 4 + 3 = 11", size=42),
            R("איברים דומים:", "3<i>x</i> + 2<i>x</i> = 5<i>x</i>", size=42),
            R("לא דומים:", "3<i>x</i> + 2 ≠ 5<i>x</i>", size=42),
            R("פילוג:", "3(<i>x</i> + 2) = 3<i>x</i> + 6", size=42),
            R("היקף", "=", "סכום כל הצלעות", size=42),
        ).arrange(DOWN, buff=0.55).next_to(self.title, DOWN, buff=0.6)
        with self.voice("אז מה למדנו? הצבה: מחליפים את האות במספר ומחשבים. "
                        "איברים דומים, מאותו סוג, אוספים יחד. איקס ומספר בודד לא מחברים. "
                        "בפילוג, המספר שבחוץ כופל כל איבר. והיקף הוא סכום כל הצלעות.") as d:
            for r in rows:
                self.play(FadeIn(r, shift=UP * 0.2), run_time=0.9)
                self.wait(max(d / 5 - 1.0, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, שחק עם הכלים, ונסה את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
