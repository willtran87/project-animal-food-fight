from __future__ import annotations

import math
import random
import struct
import wave
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "assets" / "audio" / "sfx"
RATE = 44100


def clamp(value: float) -> float:
    return max(-1.0, min(1.0, value))


def env(t: float, duration: float, attack: float = 0.02, release: float = 0.18) -> float:
    if t < attack:
        return t / max(attack, 0.001)
    if t > duration - release:
        return max(0.0, (duration - t) / max(release, 0.001))
    return 1.0


def sine(freq: float, t: float) -> float:
    return math.sin(t * freq * math.tau)


def render(name: str, duration: float, fn) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    path = OUT_DIR / name
    frames = []
    for i in range(int(duration * RATE)):
      t = i / RATE
      sample = int(clamp(fn(t, duration)) * 32767)
      frames.append(struct.pack("<h", sample))
    with wave.open(str(path), "wb") as handle:
      handle.setnchannels(1)
      handle.setsampwidth(2)
      handle.setframerate(RATE)
      handle.writeframes(b"".join(frames))
    print(f"wrote {path.relative_to(ROOT)}")


def cozy_reality_break(t: float, duration: float) -> float:
    swell = env(t, duration, 0.01, 0.28)
    bell = sine(740 + 80 * t, t) * 0.28 + sine(1110 + 120 * t, t) * 0.18
    shimmer = sine(1480, t) * math.exp(-3.2 * t) * 0.18
    reverse = sine(250 + 900 * (t / duration), t) * 0.16
    return (bell + shimmer + reverse) * swell


def horror_reality_break(t: float, duration: float) -> float:
    random.seed(int(t * RATE) // 23)
    crackle = (random.random() * 2 - 1) * 0.22
    sweep = sine(1200 - 980 * (t / duration), t) * 0.25
    drone = sine(46, t) * 0.45 + sine(73, t) * 0.25
    alarm = sine(320 + 35 * math.sin(t * 15), t) * (0.16 if 0.16 < t < duration - 0.12 else 0)
    return (drone + sweep + crackle + alarm) * env(t, duration, 0.005, 0.32)


def cozy_shop_return(t: float, duration: float) -> float:
    pulse = 0.5 + 0.5 * math.sin(t * math.tau * 4)
    mallet = sine(520, t) * math.exp(-4 * t) * 0.24
    awning = (sine(660, t) + sine(880, t) * 0.45) * 0.14 * pulse
    soft_noise = (random.random() * 2 - 1) * 0.035
    return (mallet + awning + soft_noise) * env(t, duration, 0.02, 0.24)


def horror_shop_return(t: float, duration: float) -> float:
    random.seed(int(t * RATE) // 17)
    gates = 1.0 if int(t * 18) % 3 else 0.35
    static = (random.random() * 2 - 1) * 0.28 * gates
    servo = sine(90 + 24 * math.sin(t * 9), t) * 0.32
    scan = sine(540 + 160 * math.sin(t * 5), t) * 0.12
    return (static + servo + scan) * env(t, duration, 0.01, 0.22)


def cozy_final_epilogue(t: float, duration: float) -> float:
    chord = sine(330, t) * 0.18 + sine(415, t) * 0.15 + sine(494, t) * 0.13 + sine(660, t) * 0.08
    glint = sine(1320, t) * math.exp(-2.6 * t) * 0.12
    return (chord + glint) * env(t, duration, 0.04, 0.6)


def horror_final_epilogue(t: float, duration: float) -> float:
    random.seed(int(t * RATE) // 31)
    collapse = sine(86 - 28 * (t / duration), t) * 0.48
    siren = sine(246 + 38 * math.sin(t * 3.8), t) * 0.18
    grit = (random.random() * 2 - 1) * 0.1 * (0.5 + 0.5 * math.sin(t * 21))
    upper = sine(980 - 220 * (t / duration), t) * math.exp(-1.5 * t) * 0.1
    return (collapse + siren + grit + upper) * env(t, duration, 0.03, 0.75)


def main() -> None:
    render("cozy-reality-break-stinger.wav", 1.05, cozy_reality_break)
    render("horror-reality-break-stinger.wav", 1.35, horror_reality_break)
    render("cozy-shop-return-static.wav", 1.15, cozy_shop_return)
    render("horror-shop-return-static.wav", 1.45, horror_shop_return)
    render("cozy-final-epilogue.wav", 2.35, cozy_final_epilogue)
    render("horror-final-epilogue.wav", 2.65, horror_final_epilogue)


if __name__ == "__main__":
    main()
