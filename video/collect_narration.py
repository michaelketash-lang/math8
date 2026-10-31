"""אוסף את כל שורות הקריינות מכל הסרטונים (בלי לרנדר) לקובץ JSONL אחד.

    .venv/bin/python collect_narration.py <out.jsonl> <media_dir> [ch_x.py ...]
"""
import os
import re
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

out, media = Path(sys.argv[1]), sys.argv[2]
files = sys.argv[3:] or sorted(str(p) for p in Path(".").glob("ch_*.py"))
parts = out.with_suffix(".parts")
parts.mkdir(exist_ok=True)


def run(f):
    scene = re.search(r"class (\w+)\(Narrated\)", Path(f).read_text()).group(1)
    log = parts / (Path(f).stem + ".jsonl")
    log.write_text("")
    r = subprocess.run([".venv/bin/manim", "--dry_run", "--progress_bar", "none", "--media_dir", media, f, scene],
                       env={**os.environ, "NARRATION_LOG": str(log)}, capture_output=True, text=True)
    return f, r.returncode, r.stderr[-300:]


with ThreadPoolExecutor(6) as ex:
    for f, code, err in ex.map(run, files):
        print(("ok  " if code == 0 else "FAIL") + " " + f + ("" if code == 0 else "\n" + err))
out.write_text("".join((parts / (Path(f).stem + ".jsonl")).read_text() for f in files))
print(sum(1 for _ in out.open()), "lines →", out)
