"""מרנדר סרטונים ב־720p ומעתיק אותם לאתר (site/videos/<id>.mp4).

    .venv/bin/python render_all.py <media_dir> [ch_x.py ...]     # בלי קבצים: כל ch_*.py

media_dir חייב להיות בנתיב בלי גרש (באג של manim עם נתיבים כמו "aviad's website").
"""
import re
import shutil
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

media = Path(sys.argv[1])
files = sys.argv[2:] or sorted(str(p) for p in Path(".").glob("ch_*.py"))
site_videos = Path(__file__).parent.parent / "site" / "videos"


def render(f):
    scene = re.search(r"class (\w+)\(Narrated\)", Path(f).read_text()).group(1)
    r = subprocess.run([".venv/bin/manim", "-r", "1280,720", "--fps", "30", "--progress_bar", "none",
                        "--media_dir", str(media), f, scene], capture_output=True, text=True)
    out = media / "videos" / Path(f).stem / "720p30" / f"{scene}.mp4"
    if r.returncode or not out.exists():
        return f"FAIL {f}\n{r.stderr[-500:]}"
    unit = Path(f).stem.removeprefix("ch_").replace("_", "-")
    shutil.copy(out, site_videos / f"{unit}.mp4")
    return f"ok   {f} → site/videos/{unit}.mp4"


with ThreadPoolExecutor(3) as ex:
    for line in ex.map(render, files):
        print(line, flush=True)
