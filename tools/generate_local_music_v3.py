import json
import math
import os
import random
import tempfile
from pathlib import Path

import generate_local_music_v2 as synth


ROOT = Path(__file__).resolve().parents[1]
AUDIO_DIR = ROOT / "assets" / "audio"
MANIFEST_PATH = AUDIO_DIR / "music-v3-manifest.json"
TAU = math.pi * 2


def note(note_number):
    return synth.midi_note(note_number)


def bars_for(slot):
    return {"menu": 20, "prep": 16, "battle": 16, "victory": 12, "defeat": 12}[slot]


COZY = {
    "menu": {
        "chords": [[60, 64, 67, 71], [57, 60, 64, 67], [65, 69, 72, 76], [55, 59, 62, 67]],
        "melody": [72, 76, 79, 81, 83, 81, 79, 76, 74, 76, 79, 84],
        "bass": [36, 43, 45, 43, 41, 43, 40, 43],
        "amp": 0.12,
    },
    "prep": {
        "chords": [[57, 60, 64, 67], [62, 65, 69, 72], [55, 59, 62, 66], [60, 64, 67, 72]],
        "melody": [69, 72, 74, 76, 79, 76, 74, 72, 69, 67, 69, 72],
        "bass": [33, 40, 38, 40, 35, 42, 36, 43],
        "amp": 0.105,
    },
    "battle": {
        "chords": [[60, 64, 67], [67, 71, 74], [65, 69, 72], [55, 59, 62]],
        "melody": [72, 74, 76, 79, 81, 79, 84, 81, 79, 76, 74, 76],
        "bass": [36, 43, 48, 43, 41, 48, 43, 40],
        "amp": 0.14,
    },
    "victory": {
        "chords": [[60, 64, 67, 72], [65, 69, 72, 76], [67, 71, 74, 79], [60, 64, 67, 84]],
        "melody": [72, 76, 79, 84, 88, 86, 84, 79, 81, 84, 88, 91],
        "bass": [36, 43, 41, 48, 43, 50, 36, 48],
        "amp": 0.13,
    },
    "defeat": {
        "chords": [[57, 60, 64], [53, 57, 60], [55, 59, 62], [52, 55, 60]],
        "melody": [69, 67, 64, 62, 60, 62, 64, 67, 69, 72, 71, 67],
        "bass": [33, 40, 29, 36, 31, 38, 28, 35],
        "amp": 0.095,
    },
}


HORROR = {
    "menu": {
        "chords": [[36, 43, 48, 49], [35, 42, 47, 50], [31, 38, 43, 46], [34, 41, 46, 49]],
        "alarm": [72, 73, 67, 66],
        "amp": 0.13,
    },
    "prep": {
        "chords": [[33, 40, 45, 46], [32, 39, 44, 47], [28, 35, 40, 41], [31, 38, 43, 44]],
        "alarm": [69, 70, 64, 63],
        "amp": 0.12,
    },
    "battle": {
        "chords": [[36, 43, 48, 49], [39, 46, 51, 52], [35, 42, 47, 48], [34, 41, 46, 47]],
        "alarm": [72, 75, 73, 70],
        "amp": 0.17,
    },
    "victory": {
        "chords": [[36, 43, 50, 51], [35, 42, 49, 50], [39, 46, 53, 54], [31, 38, 45, 46]],
        "alarm": [72, 71, 68, 67],
        "amp": 0.13,
    },
    "defeat": {
        "chords": [[33, 40, 45, 46], [31, 38, 43, 44], [28, 35, 40, 41], [27, 34, 39, 40]],
        "alarm": [64, 63, 58, 57],
        "amp": 0.125,
    },
}


def add_strum(buf, start, beat, chord, amp, pan_base=0.5):
    for i, n in enumerate(chord):
        synth.add_tone(
            buf,
            start + i * beat * 0.045,
            beat * 1.65,
            note(n + 12),
            amp * (0.85 - i * 0.08),
            "pluck",
            pan_base + (i - 1.5) * 0.08,
            attack=0.003,
            decay=0.12,
            sustain=0.22,
            release=0.18,
        )


def add_shaker(buf, start, beat, bars, seed):
    for i in range(bars * 8):
        synth.add_noise_hit(buf, start + i * beat * 0.5, beat * 0.11, 0.018 + 0.008 * (i % 2), pan=0.72, tone=0.86, seed=seed + i)


def add_sweep(buf, start, duration, start_note, end_note, amp, kind="metal", pan=0.5, seed=0):
    steps = 18
    rng = random.Random(seed)
    for i in range(steps):
        amount = i / max(1, steps - 1)
        curved = amount * amount * (3 - 2 * amount)
        midi = start_note + (end_note - start_note) * curved
        synth.add_tone(
            buf,
            start + duration * amount,
            duration / steps * 1.45,
            note(midi),
            amp * (0.55 + 0.35 * rng.random()),
            kind,
            pan + rng.uniform(-0.16, 0.16),
            attack=0.02,
            decay=0.05,
            sustain=0.55,
            release=0.12,
            vibrato=0.004,
        )


def render_cozy(track, duration):
    slot = track["slot"]
    config = COZY[slot]
    bars = bars_for(slot)
    beat = duration / (bars * 4)
    buf = [[0.0, 0.0] for _ in range(int(duration * synth.SAMPLE_RATE))]
    rng = random.Random("v3-" + track["id"])
    amp = config["amp"]

    add_shaker(buf, 0, beat, bars, rng.randrange(10000))

    for bar in range(bars):
        chord = config["chords"][bar % len(config["chords"])]
        bar_start = bar * beat * 4
        section = bar // 4
        lift = 1.0 + 0.08 * (section % 2)

        for i, n in enumerate(chord):
            synth.add_tone(buf, bar_start, beat * 3.95, note(n), amp * 0.4, "sine", 0.25 + i * 0.14, attack=0.22, decay=0.24, sustain=0.62, release=0.55, vibrato=0.0009)
            synth.add_tone(buf, bar_start + beat * 2, beat * 1.9, note(n + 12), amp * 0.16, "bell", 0.75 - i * 0.11, attack=0.06, decay=0.18, sustain=0.38, release=0.35)

        add_strum(buf, bar_start, beat, chord, amp * 0.95 * lift, 0.45)
        add_strum(buf, bar_start + beat * 2, beat, chord, amp * 0.72 * lift, 0.58)

        for step in range(8):
            n = chord[(step + bar) % len(chord)] + (12 if step % 3 else 24)
            synth.add_tone(buf, bar_start + step * beat * 0.5, beat * 0.28, note(n), amp * 0.78, "pluck", 0.26 + 0.48 * ((step + bar) % 2), attack=0.002, decay=0.045, sustain=0.16, release=0.08)

        for step in range(4):
            melody_note = config["melody"][(bar * 3 + step) % len(config["melody"])]
            synth.add_tone(buf, bar_start + (step + 0.18) * beat, beat * 0.42, note(melody_note), amp * 0.84 * lift, "bell", 0.36 + 0.28 * rng.random(), attack=0.002, decay=0.08, sustain=0.18, release=0.12)
            if section >= 1:
                synth.add_tone(buf, bar_start + (step + 0.58) * beat, beat * 0.32, note(melody_note - 5), amp * 0.34, "pluck", 0.68, attack=0.002, decay=0.05, sustain=0.18, release=0.09)

        bass_note = config["bass"][(bar * 2) % len(config["bass"])]
        for step in range(4):
            bass = bass_note if step != 2 else config["bass"][(bar * 2 + 1) % len(config["bass"])]
            synth.add_tone(buf, bar_start + step * beat, beat * 0.66, note(bass), amp * 1.05, "soft_square", 0.5, attack=0.005, decay=0.07, sustain=0.32, release=0.08)

        if slot in ("battle", "victory", "menu"):
            for step in range(4):
                synth.add_kick(buf, bar_start + step * beat, 0.18 if slot != "battle" else 0.24)
                synth.add_noise_hit(buf, bar_start + (step + 0.5) * beat, beat * 0.08, 0.06 if slot == "battle" else 0.045, pan=0.38 + 0.22 * (step % 2), tone=0.74, seed=bar * 70 + step)
        else:
            synth.add_noise_hit(buf, bar_start + beat * 1.5, beat * 0.09, 0.042, pan=0.65, tone=0.82, seed=bar * 10)
            synth.add_noise_hit(buf, bar_start + beat * 3.5, beat * 0.09, 0.038, pan=0.35, tone=0.82, seed=bar * 10 + 5)

        if bar % 4 == 3:
            for fanfare_i, n in enumerate(chord[:3]):
                synth.add_tone(buf, bar_start + beat * (3.05 + fanfare_i * 0.18), beat * 0.46, note(n + 24), amp * 0.4, "brass", 0.42 + fanfare_i * 0.08, attack=0.01, decay=0.08, sustain=0.35, release=0.11)

    return buf


def render_horror(track, duration):
    slot = track["slot"]
    config = HORROR[slot]
    bars = bars_for(slot)
    beat = duration / (bars * 4)
    buf = [[0.0, 0.0] for _ in range(int(duration * synth.SAMPLE_RATE))]
    rng = random.Random("v3-" + track["id"])
    amp = config["amp"]

    for bar in range(bars):
        chord = config["chords"][bar % len(config["chords"])]
        bar_start = bar * beat * 4
        root = chord[0]
        pressure = 1.0 + 0.05 * (bar // 4)

        synth.add_tone(buf, bar_start, beat * 4.05, note(root - 12), amp * 0.96 * pressure, "drone", 0.42, attack=0.55, decay=0.5, sustain=0.9, release=0.8, vibrato=0.0025)
        synth.add_tone(buf, bar_start, beat * 4.05, note(root + 0.35), amp * 0.48, "soft_square", 0.58, attack=0.44, decay=0.35, sustain=0.74, release=0.72, vibrato=0.004)
        synth.add_tone(buf, bar_start + beat * 0.5, beat * 3.35, note(chord[-1] + 12), amp * 0.3, "metal", 0.28, attack=0.26, decay=0.3, sustain=0.5, release=0.65, vibrato=0.003)

        pulse_steps = 16 if slot == "battle" else 8
        for step in range(pulse_steps):
            t = bar_start + step * beat * (4 / pulse_steps)
            pitch = root + 24 + [0, 1, 7, 6][step % 4]
            synth.add_tone(buf, t, beat * 0.22, note(pitch), amp * (0.74 if slot != "battle" else 1.0), "soft_square", 0.47, attack=0.002, decay=0.035, sustain=0.12, release=0.045)
            if step % 4 == 2:
                synth.add_noise_hit(buf, t + beat * 0.08, beat * 0.09, 0.055, pan=rng.random(), tone=0.18, seed=bar * 500 + step)

        alarm_note = config["alarm"][bar % len(config["alarm"])]
        if bar % 2 == 0:
            synth.add_tone(buf, bar_start + beat * 2.72, beat * 0.75, note(alarm_note), amp * 0.36, "metal", 0.72, attack=0.04, decay=0.08, sustain=0.45, release=0.22, vibrato=0.006)
            synth.add_tone(buf, bar_start + beat * 3.18, beat * 0.58, note(alarm_note - 1), amp * 0.28, "metal", 0.28, attack=0.04, decay=0.08, sustain=0.45, release=0.22, vibrato=0.006)

        if slot == "battle":
            for step in range(4):
                synth.add_kick(buf, bar_start + step * beat, 0.3)
                synth.add_noise_hit(buf, bar_start + (step + 0.5) * beat, beat * 0.1, 0.13, pan=0.33 + 0.34 * (step % 2), tone=0.28, seed=9000 + bar * 20 + step)
                synth.add_noise_hit(buf, bar_start + (step + 0.75) * beat, beat * 0.05, 0.06, pan=rng.random(), tone=0.12, seed=9100 + bar * 20 + step)
        else:
            synth.add_noise_hit(buf, bar_start + beat * (1.0 + rng.random() * 0.22), beat * 0.24, 0.08, pan=rng.random(), tone=0.38, seed=bar * 101)
            synth.add_noise_hit(buf, bar_start + beat * 3.42, beat * 0.18, 0.065, pan=0.7, tone=0.16, seed=bar * 101 + 1)

        if bar % 4 == 1:
            add_sweep(buf, bar_start + beat * 0.35, beat * 2.8, chord[1] + 24, chord[1] + 12, amp * 0.12, "metal", pan=0.52, seed=bar)
        if bar % 4 == 3:
            add_sweep(buf, bar_start + beat * 2.55, beat * 1.15, chord[2] + 10, chord[2] + 28, amp * 0.11, "drone", pan=0.44, seed=bar + 200)

    return buf


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
            synth.write_wav(wav_path, buf)
            synth.convert_to_mp3(wav_path, mp3_path)
            print(f"wrote {mp3_path.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
