from __future__ import annotations

import math
import random
import struct
import wave
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "audio"
RATE = 44100


def clamp(value: float) -> float:
    return max(-1.0, min(1.0, value))


def env(t: float, duration: float, attack: float = 0.08, release: float = 0.35) -> float:
    if t < attack:
        return t / max(attack, 0.001)
    if t > duration - release:
        return max(0.0, (duration - t) / max(release, 0.001))
    return 1.0


def sine(freq: float, t: float) -> float:
    return math.sin(freq * math.tau * t)


def pulse(t: float, hz: float, width: float = 0.5) -> float:
    return 1.0 if (t * hz) % 1.0 < width else 0.0


def soft_clip(sample: float) -> float:
    return math.tanh(sample * 1.15) * 0.86


def chord(t: float, notes: tuple[float, ...], amp: float) -> float:
    return sum(sine(note, t) for note in notes) * amp / max(1, len(notes))


def render(name: str, duration: float, fn, attack: float = 0.08, release: float = 0.35) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    frames = []
    for i in range(int(duration * RATE)):
        t = i / RATE
        sample = soft_clip(fn(t, duration)) * env(t, duration, attack=attack, release=release)
        frames.append(struct.pack("<h", int(clamp(sample) * 32767)))
    path = OUT_DIR / name
    with wave.open(str(path), "wb") as handle:
        handle.setnchannels(1)
        handle.setsampwidth(2)
        handle.setframerate(RATE)
        handle.writeframes(b"".join(frames))
    print(f"wrote {path.relative_to(ROOT)}")


def cozy_suspense(t: float, duration: float) -> float:
    swell = min(1.0, t / max(0.001, duration))
    tick = sine(880, t) * math.exp(-32 * ((t * 2.0) % 1.0)) * 0.09
    mallet = sine(392, t) * math.exp(-10 * ((t * 0.5) % 1.0)) * 0.12
    pad = chord(t, (196, 246.94, 329.63), 0.24 + swell * 0.06)
    shimmer = sine(1318.5 + 22 * math.sin(t * 0.7), t) * 0.025
    return pad + tick + mallet + shimmer


def cozy_celebration(t: float, duration: float) -> float:
    random.seed(int(t * RATE) // 97)
    impact = sine(196, t) * math.exp(-4.8 * t) * 0.42
    bloom = chord(t, (523.25, 659.25, 783.99, 1046.5), 0.54) * math.exp(-1.55 * t)
    bell = sine(1567.98, t) * math.exp(-2.4 * max(0.0, t - 0.04)) * 0.22
    sparkle = (random.random() * 2 - 1) * 0.09 * math.exp(-1.8 * t) * pulse(t, 28, 0.18)
    gliss = sine(880 + min(1.0, t / 0.42) * 620, t) * math.exp(-3.2 * t) * 0.14
    return impact + bloom + bell + sparkle + gliss


def horror_suspense(t: float, duration: float) -> float:
    random.seed(int(t * RATE) // 67)
    rise = min(1.0, t / max(0.001, duration))
    drone = sine(45 + rise * 14, t) * 0.32 + sine(67.5 + rise * 9, t) * 0.2
    alarm = sine(247 + 14 * math.sin(t * 2.2), t) * 0.08 * (0.25 + rise)
    scan = sine(690 + rise * 280, t) * 0.045 * pulse(t, 8, 0.34)
    grit = (random.random() * 2 - 1) * 0.075 * pulse(t, 19, 0.2)
    return drone + alarm + scan + grit


def horror_celebration(t: float, duration: float) -> float:
    random.seed(int(t * RATE) // 37)
    blast = sine(62, t) * math.exp(-3.8 * t) * 0.78
    metal = chord(t, (146.83, 196.0, 277.18, 392.0), 0.38) * math.exp(-1.7 * t)
    alarm = sine(510 + 120 * math.sin(t * 8.5), t) * math.exp(-1.9 * t) * 0.2
    machine = sine(920 + 140 * math.sin(t * 17), t) * 0.16 * pulse(t, 18, 0.24) * math.exp(-1.4 * t)
    sparks = (random.random() * 2 - 1) * 0.13 * math.exp(-1.6 * t) * pulse(t, 36, 0.2)
    downer = sine(210 - min(1.0, t / 0.5) * 96, t) * math.exp(-2.2 * t) * 0.22
    return blast + metal + alarm + machine + sparks + downer


def main() -> None:
    render("merge-cutscene-cozy-suspense-v1.wav", 7.2, cozy_suspense)
    render("merge-cutscene-cozy-celebration-v1.wav", 1.85, cozy_celebration, attack=0.015, release=0.45)
    render("merge-cutscene-horror-suspense-v1.wav", 7.2, horror_suspense)
    render("merge-cutscene-horror-celebration-v1.wav", 2.1, horror_celebration, attack=0.008, release=0.55)


if __name__ == "__main__":
    main()
