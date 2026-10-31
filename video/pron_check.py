"""בודק איך הקול Avri קורא מילה: משווה הקלטה בלי ניקוד להקלטות עם ניקודים אפשריים.

    .venv/bin/python pron_check.py "שיפוע=שִׁפּוּעַ,שָׁפוּעַ" "נעלם=נֶעְלָם,נַעֲלַם"

הפלט לכל ניקוד: מרחק אקוסטי מההקלטה בלי ניקוד (baseline = שתי הקלטות בלי ניקוד, בערך 0–0.5).
ניקוד שהמרחק שלו קרוב ל־baseline = כך הקול קורא את המילה. אם הקריאה שגויה, מוסיפים ל־PRON ב־common.py.
"""
import asyncio
import subprocess
import sys
import tempfile

import edge_tts
import numpy as np

from common import VOICE


async def pcm(text):
    with tempfile.NamedTemporaryFile(suffix=".mp3") as f:
        await edge_tts.Communicate(text, VOICE).save(f.name)
        raw = subprocess.run(["ffmpeg", "-v", "error", "-i", f.name, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"],
                             capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.int16).astype(float)
    nz = np.nonzero(np.abs(a) > 300)[0]
    return a[nz[0]:nz[-1]] if len(nz) else a


def dist(a, b):
    """DTW distance between log-spectrogram frames (robust to small timing jitter)."""
    spec = lambda x: np.log(np.abs(np.fft.rfft(np.lib.stride_tricks.sliding_window_view(x, 512)[::160] * np.hanning(512)))[:, :128] + 1)
    A, B = spec(a), spec(b)
    d = np.linalg.norm(A[:, None] - B[None], axis=2)
    D = np.full((len(A) + 1, len(B) + 1), np.inf)
    D[0, 0] = 0
    for i in range(1, len(A) + 1):
        for j in range(1, len(B) + 1):
            D[i, j] = d[i - 1, j - 1] + min(D[i - 1, j], D[i, j - 1], D[i - 1, j - 1])
    return round(D[-1, -1] / (len(A) + len(B)), 2)


async def main(args):
    for arg in args:
        word, variants = arg.split("=")
        a, a2 = await pcm(word), await pcm(word)
        res = [f"{v}: {dist(a, await pcm(v))}" for v in variants.split(",")]
        print(f"{word}  baseline: {dist(a, a2)}  |  " + "  |  ".join(res))


if __name__ == "__main__":
    asyncio.run(main(sys.argv[1:]))
