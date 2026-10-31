"""סרטון: מבוא לפונקציות (כיתה ח׳, פרק 2).

הרצה: .venv/bin/manim -r 1280,720 --fps 30 --media_dir <תיקייה בלי גרש> ch_functions.py Functions
"""
from common import *

add_pron({"הגדרה": "הַגְדָּרָה", "ההגדרה": "הַהַגְדָּרָה"})

UP_C, DOWN_C, FLAT_C = GREEN_C, RED_C, GREY_B


def F(s, size=44, color=WHITE):
    return MarkupText(s, font=MATH, font_size=size, color=color)


def axes_labels(ax, xs, ys, size=24):
    g = VGroup()
    for x in xs:
        g.add(T(str(x), size, GREY_B).next_to(ax.c2p(x, ax.y_range[0]), DOWN, buff=0.15))
    for y in ys:
        g.add(T(str(y), size, GREY_B).next_to(ax.c2p(ax.x_range[0], y), LEFT, buff=0.15))
    return g


def table(xs, ys, hx="x", hy="y", size=34, ycol=ORANGE):
    """טבלת ערכים: שורת x ושורת y, כותרות מימין (RTL), הערך הראשון מימין."""
    cols = VGroup(*[VGroup(T(str(x), size), T(str(y), size, ycol)).arrange(DOWN, buff=0.4) for x, y in zip(xs, ys)])
    cols.arrange(LEFT, buff=0.6)
    heads = VGroup(F(f"<i>{hx}</i>", size, GREY_B), F(f"<i>{hy}</i>", size, GREY_B)).arrange(DOWN, buff=0.4)
    heads.next_to(cols, RIGHT, buff=0.5)
    for h, row in zip(heads, (cols[0][0], cols[0][1])):
        h.match_y(row)
    t = VGroup(heads, cols)
    t.add(Line(t.get_left() + LEFT * 0.1, t.get_right() + RIGHT * 0.1, color=GREY_D).move_to(t))
    t.add(Line(UP * 0.5, DOWN * 0.5, color=GREY_D).scale(t.height / 1).next_to(heads, LEFT, buff=0.22))
    return t


class Functions(Narrated):
    def construct(self):
        self.story()
        self.reps()
        self.pairs()
        self.domain()
        self.updown()
        self.summary()

    # ---------- מכונה ----------
    def story(self):
        title = T("מבוא לפונקציות", 66, font=TITLE)
        with self.voice("בכדורסל, על כל סל רגיל מקבלים שתי נקודות. "
                        "אם תגיד לי כמה סלים קלעת, אני אגיד לך כמה נקודות יש לך.") as d:
            self.play(Write(title), run_time=2)
            self.play(title.animate.scale(0.6).to_edge(UP, buff=0.3), run_time=1)
        self.title = title

        box = RoundedRectangle(width=3, height=1.8, corner_radius=0.2, color=BLUE_C, fill_color=BLUE_E, fill_opacity=0.6)
        rule = F("× 2", 56).move_to(box)
        name = T("פונקציה", 30, BLUE_B).next_to(box, UP, buff=0.2)
        inl = T("נכנס", 28, GREY_B).move_to(LEFT * 4.5 + UP * 1.2)
        outl = T("יוצא", 28, GREY_B).move_to(RIGHT * 4.5 + UP * 1.2)
        with self.voice("זו בדיוק פונקציה! פונקציה היא כמו מכונה: מכניסים מספר, איקס, "
                        "והמכונה מוציאה מספר אחר, וואי. המכונה שלנו כופלת בשתיים.") as d:
            self.play(FadeIn(box), Write(rule), FadeIn(name), run_time=1.5)
            self.play(FadeIn(inl), FadeIn(outl), run_time=1)
        outs = VGroup()
        with self.voice("נכניס אחת, ויוצא שתיים. נכניס שלוש, ויוצא שש. נכניס חמש, ויוצא עשר.") as d:
            for i, x in enumerate((1, 3, 5)):
                n = T(str(x), 48, YELLOW).move_to(LEFT * 4.5 + DOWN * (i * 0.9 - 0.3))
                self.play(FadeIn(n, shift=RIGHT * 0.3), run_time=0.4)
                n2 = n.copy()
                self.play(n2.animate.move_to(box.get_center()).scale(0.3).set_opacity(0), run_time=0.7)
                o = T(str(2 * x), 48, ORANGE).move_to(box.get_center()).scale(0.3)
                self.play(o.animate.scale(1 / 0.3).move_to(RIGHT * 4.5 + DOWN * (i * 0.9 - 0.3)), run_time=0.7)
                outs.add(o)
                self.remove(n2)
        key = T("לכל מספר שנכנס, יוצא מספר אחד בלבד", 36, YELLOW).to_edge(DOWN, buff=0.6)
        with self.voice("והכלל החשוב: לכל מספר שנכנס, יוצא מספר אחד בלבד. "
                        "מכונה שמוציאה פעם שש ופעם שבע על אותו מספר, היא לא פונקציה.") as d:
            self.play(FadeIn(key, shift=UP * 0.2), run_time=1)
            self.play(Indicate(outs, color=YELLOW), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- ארבעה ייצוגים ----------
    def reps(self):
        cells = {
            "words": (RIGHT * 3.5 + UP * 1.5), "formula": (LEFT * 3.5 + UP * 1.5),
            "table": (RIGHT * 3.5 + DOWN * 2.1), "graph": (LEFT * 3.5 + DOWN * 2.15),
        }
        div = VGroup(Line(UP * 3, DOWN * 3.6, color=GREY_D), Line(LEFT * 7, RIGHT * 7, color=GREY_D).shift(DOWN * 0.1))
        tag = lambda s, pos: T(s, 28, BLUE_B).move_to(pos + UP * 1.1)
        words = R("על כל סל:", "2", "נקודות", size=46).move_to(cells["words"])
        formula = F("<i>y</i> = 2<i>x</i>", 72).move_to(cells["formula"])
        tab = table([1, 2, 3, 4], [2, 4, 6, 8], size=40).move_to(cells["table"])
        ax = Axes(x_range=[0, 4, 1], y_range=[0, 8, 2], x_length=4.6, y_length=2.6, tips=False,
                  axis_config={"color": GREY_C}).move_to(cells["graph"])
        dots = VGroup(*[Dot(ax.c2p(x, 2 * x), color=ORANGE, radius=0.1) for x in range(1, 5)])
        labs = axes_labels(ax, range(0, 5), range(0, 9, 4), 20)
        tags = VGroup(tag("במילים", cells["words"]), tag("נוסחה", cells["formula"]),
                      tag("טבלה", RIGHT * 3.5 + DOWN * 1.6), tag("גרף", LEFT * 3.5 + DOWN * 1.6))
        with self.voice("את אותה פונקציה אפשר להציג בארבע דרכים. במילים: על כל סל, שתי נקודות.") as d:
            self.play(Create(div), run_time=1)
            self.play(FadeIn(tags[0]), FadeIn(words), run_time=1)
        with self.voice("בנוסחה: וואי שווה שתיים איקס.") as d:
            self.play(FadeIn(tags[1]), Write(formula), run_time=1.5)
        with self.voice("בטבלה: סל אחד, שתי נקודות. שני סלים, ארבע נקודות, וכן הלאה.") as d:
            self.play(FadeIn(tags[2]), FadeIn(tab), run_time=1.5)
        with self.voice("ובגרף: כל עמודה בטבלה הופכת לנקודה במערכת הצירים. ארבע דרכים, פונקציה אחת.") as d:
            self.play(FadeIn(tags[3]), Create(ax), FadeIn(labs), run_time=1.5)
            self.play(LaggedStart(*[FadeIn(dt, scale=2) for dt in dots], lag_ratio=0.3), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- זוג סדור ----------
    def pairs(self):
        ax = Axes(x_range=[0, 7, 1], y_range=[0, 7, 1], x_length=5.6, y_length=5.6, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=1).shift(DOWN * 0.4)
        plane = NumberPlane(x_range=[0, 7], y_range=[0, 7], x_length=5.6, y_length=5.6,
                            background_line_style={"stroke_color": GREY_D, "stroke_opacity": 0.5}).move_to(ax)
        plane.axes.set_opacity(0)
        labs = axes_labels(ax, range(0, 8), range(1, 8), 22)
        pair = F("(3, 6)", 64, YELLOW).to_edge(RIGHT, buff=1.5).shift(UP * 1.5)
        with self.voice("כל נקודה בגרף היא זוג סדור. למשל, שלוש פסיק שש. "
                        "המספר הראשון הוא תמיד האיקס, והשני הוא תמיד הוואי.") as d:
            self.play(FadeIn(plane), Create(ax), FadeIn(labs), run_time=1.5)
            self.play(Write(pair), run_time=1.5)
            self.play(pair[1].animate.set_color(BLUE_C), run_time=0.6)
            self.play(pair[3].animate.set_color(ORANGE), run_time=0.6)
        a1 = Arrow(ax.c2p(0, 0), ax.c2p(3, 0), buff=0, color=BLUE_C, stroke_width=6)
        a2 = Arrow(ax.c2p(3, 0), ax.c2p(3, 6), buff=0, color=ORANGE, stroke_width=6)
        p = Dot(ax.c2p(3, 6), color=YELLOW, radius=0.12)
        with self.voice("מתחילים בראשית הצירים. הולכים שלוש ימינה, ואז שש למעלה. הנה הנקודה.") as d:
            self.play(GrowArrow(a1), run_time=1.2)
            self.play(GrowArrow(a2), run_time=1.5)
            self.play(FadeIn(p, scale=2), run_time=0.6)
        q = Dot(ax.c2p(6, 3), color=RED_C, radius=0.12)
        qlab = F("(6, 3)", 64, RED_C).next_to(pair, DOWN, buff=0.7)
        warn = T("נקודה אחרת לגמרי!", 34, RED_C).next_to(qlab, DOWN, buff=0.3)
        with self.voice("ואם נהפוך את הסדר, שש פסיק שלוש, נקבל נקודה אחרת לגמרי. לכן קוראים לזה זוג סדור: הסדר חשוב.") as d:
            self.play(Write(qlab), run_time=1)
            self.play(FadeIn(q, scale=2), FadeIn(warn), run_time=1)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- תחום הגדרה וחיתוך עם הצירים ----------
    def domain(self):
        l1 = R("בבקבוק יש", "1000", "מ״ל מים.", size=34)
        l2 = R("בכל דקה השחקן שותה", "100", "מ״ל.", size=34)
        story = VGroup(l1, l2).arrange(DOWN, buff=0.25, aligned_edge=RIGHT).to_corner(UR, buff=0.6).shift(DOWN * 0.6)
        eq = F("<i>y</i> = 1000 − 100<i>x</i>", 44, YELLOW).next_to(story, DOWN, buff=0.4).align_to(story, RIGHT)
        ax = Axes(x_range=[0, 12, 2], y_range=[0, 1200, 200], x_length=6.2, y_length=4.6, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=1.1).shift(DOWN * 0.6)
        labs = axes_labels(ax, range(0, 13, 2), range(0, 1201, 400), 20)
        xl = T("דקות", 24, GREY_B).next_to(ax.x_axis, DOWN, buff=0.5)
        yl = T("מ״ל", 24, GREY_B).next_to(ax.y_axis, UP, buff=0.15)
        line = ax.plot(lambda x: 1000 - 100 * x, x_range=[0, 10], color=BLUE_C, stroke_width=5)
        with self.voice("עכשיו דוגמה. בבקבוק של שחקן יש אלף מיליליטר מים, ובכל דקה הוא שותה מאה. "
                        "הנוסחה: וואי שווה אלף, פחות מאה איקס. והגרף נראה כך.") as d:
            self.play(FadeIn(story), run_time=1)
            self.play(Write(eq), run_time=1.5)
            self.play(Create(ax), FadeIn(labs), FadeIn(xl), FadeIn(yl), run_time=1.2)
            self.play(Create(line), run_time=1.5)
        seg = Line(ax.c2p(0, 0), ax.c2p(10, 0), color=YELLOW, stroke_width=10)
        dom = R("תחום הגדרה:", "0 ≤ <i>x</i> ≤ 10", size=36, color=YELLOW).next_to(eq, DOWN, buff=0.6).align_to(story, RIGHT)
        with self.voice("אילו ערכים מותר להציב באיקס? זמן לא יכול להיות שלילי, ואחרי עשר דקות הבקבוק ריק. "
                        "אז איקס הוא בין אפס לעשר. זה נקרא תחום ההגדרה.") as d:
            self.play(Create(seg), run_time=1.5)
            self.play(FadeIn(dom, shift=LEFT * 0.2), run_time=1)
        down = R("הפונקציה", "יורדת", size=34, color=DOWN_C).next_to(dom, DOWN, buff=0.4).align_to(story, RIGHT)
        with self.voice("ככל שעובר הזמן יש פחות מים, והגרף יורד. הפונקציה יורדת.") as d:
            self.play(line.animate.set_color(DOWN_C), FadeIn(down), run_time=1.5)
        p1, p2 = Dot(ax.c2p(0, 1000), color=YELLOW, radius=0.12), Dot(ax.c2p(10, 0), color=YELLOW, radius=0.12)
        t1 = F("(0, 1000)", 28, YELLOW).next_to(p1, RIGHT, buff=0.2)
        t2 = F("(10, 0)", 28, YELLOW).next_to(p2, UP, buff=0.3)
        c1 = R("חיתוך עם ציר ה־y:", "<i>x</i> = 0", size=30).next_to(down, DOWN, buff=0.5).align_to(story, RIGHT)
        c2 = R("חיתוך עם ציר ה־x:", "<i>y</i> = 0", size=30).next_to(c1, DOWN, buff=0.25).align_to(story, RIGHT)
        with self.voice("ואיפה הגרף חותך את הצירים? את ציר הוואי, כשאיקס שווה אפס: בנקודה אפס פסיק אלף, הבקבוק המלא. "
                        "ואת ציר האיקס, כשוואי שווה אפס: בנקודה עשר פסיק אפס, הבקבוק הריק.") as d:
            self.play(FadeIn(c1), FadeIn(p1, scale=2), Write(t1), run_time=1.5)
            self.wait(max(d / 2 - 1.5, 0.5))
            self.play(FadeIn(c2), FadeIn(p2, scale=2), Write(t2), run_time=1.5)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- עולה, יורדת, קבועה ----------
    def updown(self):
        pts = [(0, 1), (2, 5), (4, 5), (6, 2), (7, 2), (8, 0)]
        ax = Axes(x_range=[0, 8, 1], y_range=[0, 6, 1], x_length=8, y_length=4.4, tips=False,
                  axis_config={"color": GREY_C}).to_edge(LEFT, buff=0.9).shift(DOWN * 0.5)
        labs = axes_labels(ax, range(0, 9), range(0, 7, 2), 20)
        segs = VGroup(*[Line(ax.c2p(*a), ax.c2p(*b), color=WHITE, stroke_width=5) for a, b in zip(pts, pts[1:])])
        cap = T("גובה הכדור לפי הזמן", 30, GREY_B).next_to(ax, UP, buff=0.3)
        with self.voice("הגרף הזה מראה את גובה הכדור במהלך תרגיל. "
                        "כדי לדעת אם פונקציה עולה או יורדת, הולכים על הגרף משמאל לימין, כמו שקוראים מספרים על הציר.") as d:
            self.play(Create(ax), FadeIn(labs), FadeIn(cap), run_time=1.2)
            self.play(Create(segs), run_time=2)
        walker = Dot(ax.c2p(*pts[0]), color=ORANGE, radius=0.14).set_z_index(3)
        state = T("", 40)
        info = [("עולה", UP_C), ("קבועה", FLAT_C), ("יורדת", DOWN_C), ("קבועה", FLAT_C), ("יורדת", DOWN_C)]
        with self.voice("מטפסים? הפונקציה עולה. הולכים ישר? קבועה. יורדים? יורדת. "
                        "ושים לב: אותה פונקציה יכולה לעלות בתחום אחד ולרדת בתחום אחר.") as d:
            self.add(walker)
            for i, (a, b) in enumerate(zip(pts, pts[1:])):
                word, col = info[i]
                new = R(word, f"{a[0]} &lt; <i>x</i> &lt; {b[0]}", size=36, color=col).to_edge(RIGHT, buff=0.6).shift(UP * (1.6 - 0.6 * i))
                self.play(walker.animate.move_to(ax.c2p(*b)), segs[i].animate.set_color(col),
                          FadeIn(new), run_time=d / 5 - 0.1, rate_func=linear)
        self.play(*[FadeOut(m) for m in self.mobjects if m is not self.title])

    # ---------- סיכום ----------
    def summary(self):
        head = T("מה לזכור", 52, YELLOW).shift(UP * 2.3)
        lines = VGroup(
            T("פונקציה: לכל x יש y אחד בלבד", 36),
            T("ארבעה ייצוגים: מילים, נוסחה, טבלה, גרף", 36),
            T("זוג סדור: קודם x, אחר כך y", 36),
            T("תחום הגדרה: אילו x מותר להציב", 36),
            T("משמאל לימין: מטפסים = עולה, יורדים = יורדת", 36),
        ).arrange(DOWN, buff=0.32, aligned_edge=RIGHT).next_to(head, DOWN, buff=0.5)
        with self.voice("אז מה למדנו? פונקציה מתאימה לכל איקס וואי אחד בלבד. אפשר להציג אותה במילים, בנוסחה, בטבלה ובגרף. "
                        "בזוג סדור, קודם איקס ואחר כך וואי. תחום ההגדרה אומר אילו איקסים מותר להציב. "
                        "והולכים על הגרף משמאל לימין כדי לדעת אם הוא עולה או יורד.") as d:
            self.play(FadeIn(head), run_time=0.8)
            for ln in lines:
                self.play(FadeIn(ln, shift=LEFT * 0.2), run_time=0.9)
                self.wait(max(d / 5 - 1.1, 0.3))
        go = T("עכשיו תורך: שחק עם הכלים ונסה את התרגילים", 38, ORANGE).to_edge(DOWN, buff=0.5)
        with self.voice("עכשיו תורך! גלול למטה, נסה לגלות את הכלל של המכונה הסודית, ופתור את התרגילים. בהצלחה!") as d:
            self.play(FadeIn(go, shift=UP * 0.3), run_time=1)
        self.wait(1)
        self.play(*[FadeOut(m) for m in self.mobjects])
