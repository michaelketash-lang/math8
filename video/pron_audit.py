"""בדיקת הגייה אוטומטית לכל הקריינות.

    .venv/bin/python pron_audit.py <narration.jsonl> <out_dir> [--variant plain|full]

לכל שורת קריינות:
  1. ההגייה הנכונה בהקשר: phonikud מנקד את המשפט ומפיק IPA (עם תיקונים ידניים מ־PRON).
  2. מה הקריין אמר בפועל: מזהה פונמות (wav2vec2 xlsr-53 espeak) על קובץ הקול.
  3. מרחק עריכה בין השניים, ברמת משפט וברמת מילה.
variant=plain  — האודיו הקיים (טקסט בלי ניקוד + PRON).
variant=full   — מייצר אודיו חדש מטקסט מנוקד במלואו (phonikud + PRON) ובודק אותו.
הזיהוי רועש ברמת מילה בודדת; לכן מסתכלים על מילים שנשמעות שגוי באופן עקבי בכמה משפטים.
"""
import asyncio
import json
import re
import subprocess
import sys
from collections import defaultdict
from pathlib import Path

import numpy as np

HERE = Path(__file__).parent
sys.argv, ARGS = sys.argv[:1], sys.argv[1:]  # common imports manim, which parses argv
from common import AUDIO_DIR, PRON, VOICE  # noqa: E402

NIQQUD_KEEP = set(chr(c) for c in range(0x05B0, 0x05BD)) | {"ׁ", "ׂ", "ׇ"}
HEB_LETTERS = re.compile(r"[א-ת]")


def clean_niqqud(s):
    """phonikud adds non-standard marks (| prefix bar, meteg, stress); keep standard niqqud only.
    It also writes "קֻּודְקוֹד"/"צֹומֶת" (vowel on the letter + bare vav); convert to standard "קוּדְקוֹד"/"צוֹמֶת"."""
    s = "".join(ch for ch in s if ch in NIQQUD_KEEP or not ("\u0591" <= ch <= "\u05C7") and ch != "|")
    bare_vav = "ו(?![\u05B0-\u05BC\u05C1\u05C2])"
    s = re.sub("\u05BB([\u05B0-\u05BC]*)" + bare_vav, "\\1ו\u05BC", s)  # kubutz + vav → shuruk
    return re.sub("\u05B9([\u05B0-\u05BC]*)" + bare_vav, "\\1ו\u05B9", s)  # holam + vav → holam male


def strip_niqqud(s):
    return "".join(ch for ch in s if not ("֑" <= ch <= "ׇ"))


def apply_pron(vocalized):
    """Replace words that have a curated PRON entry (matched on the unvocalized form)."""
    out = []
    for tok in re.split(r"(\s+|[,.:;?!])", vocalized):
        base = strip_niqqud(tok)
        out.append(PRON.get(base, tok))
    return "".join(out)


V = {"ɛ": "e", "ə": "e", "e": "e", "a": "a", "ɑ": "a", "ʌ": "a", "æ": "a", "ɐ": "a", "i": "i", "ɪ": "i",
     "o": "o", "ɔ": "o", "u": "u", "ʊ": "u", "y": "i"}
C = {"ʁ": "r", "ɾ": "r", "r": "r", "χ": "x", "x": "x", "ħ": "x", "ɡ": "g", "g": "g", "ʃ": "S", "ʒ": "Z",
     "b": "b", "v": "v", "d": "d", "t": "t", "k": "k", "p": "p", "f": "f", "s": "s", "z": "z", "m": "m",
     "n": "n", "l": "l", "j": "j", "h": "h", "w": "v", "β": "v", "q": "k", "c": "k"}


def norm(ipa):
    """IPA → coarse phoneme string (5 vowels, merged consonant variants, no stress/length/glottal)."""
    ipa = ipa.replace("ts", "c").replace("t s", "c").replace("tʃ", "C").replace("dʒ", "J")
    out = []
    for ch in ipa:
        if ch == " ":
            out.append(" ")
        elif ch in "cCJ":
            out.append(ch)
        elif ch in V:
            out.append(V[ch])
        elif ch in C:
            out.append(C[ch])
    return re.sub(r" +", " ", "".join(out)).strip()


def align_errors(exp_words, rec):
    """Levenshtein-align rec (no spaces) to the concatenated expected words; errors per expected word."""
    exp = "".join(exp_words)
    owner = [i for i, w in enumerate(exp_words) for _ in w]
    n, m = len(exp), len(rec)
    D = np.zeros((n + 1, m + 1), int)
    D[:, 0], D[0, :] = range(n + 1), range(m + 1)
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            D[i, j] = min(D[i - 1, j] + 1, D[i, j - 1] + 1, D[i - 1, j - 1] + (exp[i - 1] != rec[j - 1]))
    errs, i, j = [0] * len(exp_words), n, m
    while i > 0 and j > 0:
        if D[i, j] == D[i - 1, j - 1] + (exp[i - 1] != rec[j - 1]):
            errs[owner[i - 1]] += exp[i - 1] != rec[j - 1]; i, j = i - 1, j - 1
        elif D[i, j] == D[i - 1, j] + 1:
            errs[owner[i - 1]] += 1; i -= 1
        else:
            errs[owner[min(i, n) - 1]] += 1; j -= 1
    while i > 0:
        errs[owner[i - 1]] += 1; i -= 1
    return D[n, m], errs


class ASR:
    NAME = "facebook/wav2vec2-xlsr-53-espeak-cv-ft"

    def __init__(self):
        import torch
        from transformers import Wav2Vec2FeatureExtractor, Wav2Vec2ForCTC, Wav2Vec2PhonemeCTCTokenizer
        self.torch = torch
        self.fe = Wav2Vec2FeatureExtractor.from_pretrained(self.NAME)
        self.tok = Wav2Vec2PhonemeCTCTokenizer.from_pretrained(self.NAME, do_phonemize=False)
        self.model = Wav2Vec2ForCTC.from_pretrained(self.NAME).eval()

    def __call__(self, path):
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(path), "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                             capture_output=True, check=True).stdout
        a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
        with self.torch.no_grad():
            ids = self.model(self.fe(a, sampling_rate=16000, return_tensors="pt").input_values).logits.argmax(-1)
        return self.tok.batch_decode(ids)[0]


async def synth_all(jobs):
    import edge_tts
    sem = asyncio.Semaphore(2)

    async def one(text, path):
        if path.exists() and path.stat().st_size > 2000:
            return
        async with sem:
            for attempt in range(5):  # the service rate-limits bursts with NoAudioReceived
                try:
                    await edge_tts.Communicate(text, VOICE, rate="-5%").save(str(path))
                    return
                except edge_tts.exceptions.NoAudioReceived:
                    await asyncio.sleep(3 * (attempt + 1))
            print("TTS failed:", path.name, text[:60])
    await asyncio.gather(*(one(t, p) for t, p in jobs))


def main():
    narr, out_dir = Path(ARGS[0]), Path(ARGS[1])
    variant = ARGS[ARGS.index("--variant") + 1] if "--variant" in ARGS else "plain"
    out_dir.mkdir(parents=True, exist_ok=True)
    lines = [json.loads(l) for l in narr.open()]

    from phonikud import phonemize
    from phonikud_onnx import Phonikud
    nak = Phonikud(str(HERE / "models/phonikud-1.0.int8.onnx"))

    rows = []
    for ln in lines:
        voc = apply_pron(clean_niqqud(nak.add_diacritics(ln["raw"])))
        words = [w for w in re.split(r"[\s,.:;?!]+", voc) if HEB_LETTERS.search(w)]
        exp_words = [norm(phonemize(w)).replace(" ", "") for w in words]
        rows.append({**ln, "vocalized": voc, "words": [strip_niqqud(w) for w in words], "exp_words": exp_words})

    if variant == "full":
        jobs = [(r["vocalized"], out_dir / f"full_{i:03d}.mp3") for i, r in enumerate(rows)]
        asyncio.run(synth_all(jobs))
        for r, (_, p) in zip(rows, jobs):
            r["audio"] = str(p)
        rows = [r for r in rows if Path(r["audio"]).stat().st_size > 2000]
    else:
        for r in rows:
            r["audio"] = str(AUDIO_DIR / r["wav"])

    asr = ASR()
    word_stats = defaultdict(lambda: [0, 0, 0])  # word → [occurrences, phoneme errors, phonemes]
    tot_err = tot_len = 0
    for k, r in enumerate(rows):
        rec = norm(asr(r["audio"])).replace(" ", "")
        dist, errs = align_errors(r["exp_words"], rec)
        r["rec"], r["dist"], r["errs"] = rec, int(dist), errs
        tot_err += dist; tot_len += sum(map(len, r["exp_words"]))
        for w, e, ew in zip(r["words"], errs, r["exp_words"]):
            s = word_stats[w]; s[0] += 1; s[1] += e; s[2] += len(ew)
        if k % 50 == 0:
            print(f"{k}/{len(rows)}  PER so far {tot_err / max(tot_len, 1):.3f}", flush=True)

    (out_dir / f"rows_{variant}.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1))
    ranked = sorted(((w, n, e / max(l, 1)) for w, (n, e, l) in word_stats.items() if n >= 2),
                    key=lambda t: -t[2])
    (out_dir / f"words_{variant}.json").write_text(json.dumps(ranked, ensure_ascii=False, indent=0))
    print(f"\n{variant}: PER = {tot_err / tot_len:.3f} over {len(rows)} lines")
    print("most consistently misheard words (occurrences, error rate):")
    for w, n, rate in ranked[:40]:
        print(f"  {w}  ×{n}  {rate:.2f}")


if __name__ == "__main__":
    main()
