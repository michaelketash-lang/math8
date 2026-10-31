import sys, subprocess, numpy as np, torch
from transformers import Wav2Vec2ForCTC, Wav2Vec2FeatureExtractor, Wav2Vec2PhonemeCTCTokenizer
NAME = "facebook/wav2vec2-xlsr-53-espeak-cv-ft"
fe = Wav2Vec2FeatureExtractor.from_pretrained(NAME)
tok = Wav2Vec2PhonemeCTCTokenizer.from_pretrained(NAME, do_phonemize=False)
model = Wav2Vec2ForCTC.from_pretrained(NAME).eval()
def phones(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "s16le", "-ac", "1", "-ar", "16000", "-"], capture_output=True, check=True).stdout
    a = np.frombuffer(raw, np.int16).astype(np.float32) / 32768
    with torch.no_grad():
        ids = model(fe(a, sampling_rate=16000, return_tensors="pt").input_values).logits.argmax(-1)
    return tok.batch_decode(ids)[0]
for p in sys.argv[1:]:
    print(p.split("/")[-1], "→", phones(p))
