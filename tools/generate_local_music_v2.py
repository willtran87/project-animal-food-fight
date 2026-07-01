import json
import math
import os
import random
import struct
import subprocess
import tempfile
import wave
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
AUDIO_DIR = ROOT / "assets" / "audio"
MANIFEST_PATH = AUDIO_DIR / "music-v2-manifest.json"
SAMPLE_RATE = 44100
TAU = math.pi * 2


def midi_note(note):
    return 440.0 * (2 ** ((note - 69) / 12))


def clamp(value, low=-1.0, high=1.0):
    return max(low, min(high, value))


def soft_clip(value):
    return math.tanh(value * 1.35) * 0.86


def envelope(t, duration, attack=0.015, decay=0.08, sustain=0.64, release=0.12):
    if duration <= 0:
        return 0.0
    if t < attack:
        return t / attack
    if t < attack + decay:
        amount = (t - attack) / decay
        return 1.0 + (sustain - 1.0) * amount
    if t > duration - release:
        return max(0.0, sustain * ((duration - t) / release))
    return sustain


def waveform(kind, phase, wobble=0.0):
    if kind == "sine":
        return math.sin(phase)
    if kind == "soft_square":
        return math.tanh(math.sin(phase) * 2.1)
    if kind == "pluck":
        return 0.68 * math.sin(phase) + 0.24 * math.sin(phase * 2.01) + 0.08 * math.sin(phase * 3.02)
    if kind == "bell":
        return 0.58 * math.sin(phase) + 0.27 * math.sin(phase * 2.67) + 0.15 * math.sin(phase * 5.13)
    if kind == "brass":
        return 0.5 * math.sin(phase) + 0.26 * math.sin(phase * 2.0) + 0.16 * math.sin(phase * 3.0)
    if kind == "drone":
        return 0.62 * math.sin(phase) + 0.28 * math.sin(phase * 0.502 + wobble) + 0.1 * math.sin(phase * 1.997)
    if kind == "metal":
        return 0.46 * math.sin(phase) + 0.28 * math.sin(phase * 1.414) + 0.18 * math.sin(phase * 2.71)
    return math.sin(phase)


def add_tone(buf, start, duration, freq, amp, kind="sine", pan=0.5, attack=0.015, decay=0.08, sustain=0.55, release=0.08, vibrato=0.0):
    start_i = max(0, int(start * SAMPLE_RATE))
    end_i = min(len(buf), int((start + duration) * SAMPLE_RATE))
    if end_i <= start_i:
        return
    left_gain = math.cos(pan * math.pi / 2)
    right_gain = math.sin(pan * math.pi / 2)
    phase = 0.0
    for i in range(start_i, end_i):
        t = (i - start_i) / SAMPLE_RATE
        wobble = math.sin(TAU * 4.8 * t) * vibrato
        phase += TAU * freq * (1.0 + wobble) / SAMPLE_RATE
        value = waveform(kind, phase, wobble) * envelope(t, duration, attack, decay, sustain, release) * amp
        buf[i][0] += value * left_gain
        buf[i][1] += value * right_gain


def add_noise_hit(buf, start, duration, amp, pan=0.5, tone=0.0, seed=1):
    rng = random.Random(seed)
    start_i = max(0, int(start * SAMPLE_RATE))
    end_i = min(len(buf), int((start + duration) * SAMPLE_RATE))
    if end_i <= start_i:
        return
    left_gain = math.cos(pan * math.pi / 2)
    right_gain = math.sin(pan * math.pi / 2)
    previous = 0.0
    for i in range(start_i, end_i):
        t = (i - start_i) / SAMPLE_RATE
        raw = rng.uniform(-1.0, 1.0)
        previous = previous * tone + raw * (1.0 - tone)
        value = previous * max(0.0, 1.0 - t / duration) ** 2.2 * amp
        buf[i][0] += value * left_gain
        buf[i][1] += value * right_gain


def add_kick(buf, start, amp=0.34, pan=0.5):
    start_i = max(0, int(start * SAMPLE_RATE))
    duration = 0.26
    end_i = min(len(buf), int((start + duration) * SAMPLE_RATE))
    left_gain = math.cos(pan * math.pi / 2)
    right_gain = math.sin(pan * math.pi / 2)
    phase = 0.0
    for i in range(start_i, end_i):
        t = (i - start_i) / SAMPLE_RATE
        freq = 98 * math.exp(-10.5 * t) + 38
        phase += TAU * freq / SAMPLE_RATE
        value = math.sin(phase) * math.exp(-9 * t) * amp
        buf[i][0] += value * left_gain
        buf[i][1] += value * right_gain


def write_wav(path, buf):
    peak = max(0.001, max(max(abs(left), abs(right)) for left, right in buf))
    gain = min(1.0, 0.93 / peak)
    with wave.open(str(path), "wb") as handle:
        handle.setnchannels(2)
        handle.setsampwidth(2)
        handle.setframerate(SAMPLE_RATE)
        frames = bytearray()
        for left, right in buf:
            frames.extend(struct.pack("<hh", int(clamp(soft_clip(left * gain)) * 32767), int(clamp(soft_clip(right * gain)) * 32767)))
        handle.writeframes(frames)


COZY_PROGRESSIONS = {
    "menu": [[60, 64, 67, 71], [57, 60, 64, 67], [65, 69, 72, 76], [55, 59, 62, 67]],
    "prep": [[57, 60, 64, 67], [62, 65, 69, 72], [55, 59, 62, 66], [60, 64, 67, 72]],
    "battle": [[60, 64, 67], [67, 71, 74], [65, 69, 72], [55, 59, 62]],
    "victory": [[60, 64, 67, 72], [65, 69, 72, 76], [67, 71, 74, 79], [60, 64, 67, 84]],
    "defeat": [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 60]],
}

HORROR_PROGRESSIONS = {
    "menu": [[36, 43, 48], [35, 42, 47], [31, 38, 43], [34, 41, 46]],
    "prep": [[33, 40, 45], [32, 39, 44], [28, 35, 40], [31, 38, 43]],
    "battle": [[36, 43, 48], [39, 46, 51], [35, 42, 47], [34, 41, 46]],
    "victory": [[36, 43, 50], [35, 42, 49], [39, 46, 53], [31, 38, 45]],
    "defeat": [[33, 40, 45], [31, 38, 43], [28, 35, 40], [27, 34, 39]],
}


def render_cozy(track, duration):
    slot = track["slot"]
    bars = {"menu": 20, "prep": 16, "battle": 16, "victory": 12, "defeat": 12}[slot]
    beat = duration / (bars * 4)
    buf = [[0.0, 0.0] for _ in range(int(duration * SAMPLE_RATE))]
    progression = COZY_PROGRESSIONS[slot]
    melody = {
        "menu": [72, 76, 79, 81, 79, 76, 74, 72],
        "prep": [69, 72, 74, 76, 74, 72, 69, 67],
        "battle": [72, 74, 76, 79, 81, 79, 76, 74],
        "victory": [72, 76, 79, 84, 83, 79, 76, 72],
        "defeat": [69, 67, 64, 62, 60, 62, 64, 67],
    }[slot]
    base_amp = {"menu": 0.13, "prep": 0.11, "battle": 0.16, "victory": 0.14, "defeat": 0.09}[slot]
    rng = random.Random(track["id"])

    for bar in range(bars):
        chord = progression[bar % len(progression)]
        bar_start = bar * beat * 4
        for note in chord:
            add_tone(buf, bar_start, beat * 3.85, midi_note(note), base_amp * 0.48, "sine", 0.25 + 0.1 * (note % 3), attack=0.12, decay=0.25, sustain=0.55, release=0.5)
        for step in range(8):
            note = chord[step % len(chord)] + 12
            add_tone(buf, bar_start + step * beat * 0.5, beat * 0.36, midi_note(note), base_amp, "pluck", 0.32 + 0.36 * ((step + bar) % 2), attack=0.004, decay=0.06, sustain=0.2, release=0.08)
        for step in range(4):
            note = melody[(bar * 2 + step) % len(melody)]
            add_tone(buf, bar_start + (step + 0.22) * beat, beat * 0.52, midi_note(note), base_amp * 0.82, "bell", 0.35 + 0.3 * rng.random(), attack=0.003, decay=0.09, sustain=0.16, release=0.11)
        root = chord[0] - 24
        for step in range(4):
            add_tone(buf, bar_start + step * beat, beat * 0.72, midi_note(root if step != 2 else root + 7), base_amp * 0.85, "soft_square", 0.48, attack=0.008, decay=0.08, sustain=0.38, release=0.08)
        if slot in ("battle", "victory"):
            for step in range(4):
                add_kick(buf, bar_start + step * beat, 0.14 if slot == "victory" else 0.2)
                add_noise_hit(buf, bar_start + (step + 0.5) * beat, 0.06, 0.06, pan=0.62, tone=0.72, seed=bar * 20 + step)
        else:
            add_noise_hit(buf, bar_start + beat * 1.5, 0.08, 0.035, pan=0.62, tone=0.8, seed=bar)
            add_noise_hit(buf, bar_start + beat * 3.5, 0.08, 0.035, pan=0.38, tone=0.8, seed=bar + 100)
    return buf


def render_horror(track, duration):
    slot = track["slot"]
    bars = {"menu": 20, "prep": 16, "battle": 16, "victory": 12, "defeat": 12}[slot]
    beat = duration / (bars * 4)
    buf = [[0.0, 0.0] for _ in range(int(duration * SAMPLE_RATE))]
    progression = HORROR_PROGRESSIONS[slot]
    rng = random.Random(track["id"])
    amp = {"menu": 0.13, "prep": 0.11, "battle": 0.18, "victory": 0.13, "defeat": 0.12}[slot]

    for bar in range(bars):
        chord = progression[bar % len(progression)]
        bar_start = bar * beat * 4
        root = chord[0]
        add_tone(buf, bar_start, beat * 4.0, midi_note(root), amp * 0.92, "drone", 0.42, attack=0.5, decay=0.5, sustain=0.86, release=0.7, vibrato=0.002)
        add_tone(buf, bar_start, beat * 4.0, midi_note(root + 12.08), amp * 0.32, "drone", 0.62, attack=0.4, decay=0.45, sustain=0.74, release=0.7, vibrato=0.003)
        for note_i, note in enumerate(chord[1:]):
            add_tone(buf, bar_start + beat * (0.5 + note_i), beat * 2.6, midi_note(note + 12), amp * 0.28, "metal", 0.28 + note_i * 0.38, attack=0.18, decay=0.2, sustain=0.44, release=0.55, vibrato=0.0015)
        pulse_steps = 8 if slot == "battle" else 4
        for step in range(pulse_steps):
            t = bar_start + step * beat * (4 / pulse_steps)
            add_tone(buf, t, beat * 0.32, midi_note(root + 24 + (step % 3) * 2), amp * (0.8 if slot == "battle" else 0.44), "soft_square", 0.5, attack=0.003, decay=0.04, sustain=0.16, release=0.06)
        if slot == "battle":
            for step in range(4):
                add_kick(buf, bar_start + step * beat, 0.24)
                add_noise_hit(buf, bar_start + (step + 0.5) * beat, 0.075, 0.11, pan=0.34 + 0.34 * (step % 2), tone=0.35, seed=2000 + bar * 13 + step)
        else:
            add_noise_hit(buf, bar_start + beat * (1.5 + rng.random() * 0.25), beat * 0.28, 0.07, pan=rng.random(), tone=0.48, seed=bar * 97)
            add_noise_hit(buf, bar_start + beat * 3.25, beat * 0.15, 0.045, pan=0.68, tone=0.2, seed=bar * 97 + 8)
    return buf


def convert_to_mp3(wav_path, mp3_path):
    subprocess.run(
        [
            "ffmpeg",
            "-y",
            "-hide_banner",
            "-loglevel",
            "error",
            "-i",
            str(wav_path),
            "-codec:a",
            "libmp3lame",
            "-b:a",
            "192k",
            str(mp3_path),
        ],
        check=True,
    )


def main():
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf8"))
    only = None
    for arg in os.sys.argv[1:]:
        if arg.startswith("--only="):
            only = {value.strip() for value in arg.split("=", 1)[1].split(",") if value.strip()}

    tracks = manifest["tracks"]
    if only:
        tracks = [track for track in tracks if track["id"] in only or track["file"] in only or track["originalId"] in only]

    with tempfile.TemporaryDirectory() as tmp:
        tmp_dir = Path(tmp)
        for track in tracks:
            duration = track["musicLengthMs"] / 1000
            print(f"render {track['id']} -> {track['file']} ({duration:.1f}s)")
            buf = render_cozy(track, duration) if track["theme"] == "cozy" else render_horror(track, duration)
            wav_path = tmp_dir / f"{track['id']}.wav"
            mp3_path = AUDIO_DIR / track["file"]
            write_wav(wav_path, buf)
            convert_to_mp3(wav_path, mp3_path)
            print(f"wrote {mp3_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
