#!/usr/bin/env python3
"""Bake the Field Guide's edge-connected chroma mask with cwebp available on PATH."""

from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor
from io import BytesIO
import os
from pathlib import Path
import subprocess
import tempfile
import time

import numpy as np
from PIL import Image
from scipy import ndimage


def replace_with_retry(source: Path, destination: Path) -> None:
    for attempt in range(100):
        try:
            os.replace(source, destination)
            return
        except PermissionError:
            if attempt == 99:
                raise
            time.sleep(0.1)


def connected_chroma_mask(rgba: np.ndarray, tolerance: int) -> np.ndarray:
    key = rgba[0, 0, :3].astype(np.int16)
    color_delta = np.abs(rgba[:, :, :3].astype(np.int16) - key)
    matches = (rgba[:, :, 3] > 0) & np.all(color_delta <= tolerance, axis=2)
    seeds = np.zeros(matches.shape, dtype=bool)
    seeds[0, :] = matches[0, :]
    seeds[-1, :] = matches[-1, :]
    seeds[:, 0] = matches[:, 0]
    seeds[:, -1] = matches[:, -1]
    structure = np.array([[False, True, False], [True, True, True], [False, True, False]], dtype=bool)
    return ndimage.binary_propagation(seeds, structure=structure, mask=matches)


def encode_lossless_rgba(rgba: np.ndarray, cwebp: str, compression: int) -> bytes:
    with tempfile.TemporaryDirectory(prefix="food-animals-field-guide-") as temp_dir:
        source_png = Path(temp_dir, "source.png")
        candidate_webp = Path(temp_dir, "candidate.webp")
        image = Image.fromarray(rgba, "RGBA")
        try:
            image.save(source_png, "PNG", compress_level=1)
        finally:
            image.close()
        subprocess.run(
            [
                cwebp,
                "-lossless",
                "-z",
                str(compression),
                "-mt",
                "-quiet",
                str(source_png),
                "-o",
                str(candidate_webp),
            ],
            check=True,
            capture_output=True,
        )
        return candidate_webp.read_bytes()


def decoded_rgba(candidate_bytes: bytes) -> np.ndarray:
    with Image.open(BytesIO(candidate_bytes)) as candidate:
        return np.array(candidate.convert("RGBA"), dtype=np.uint8)


def preprocess(path: Path, cwebp: str, compression: int, tolerance: int, dry_run: bool) -> tuple[str, int, int, int]:
    original_size = path.stat().st_size
    with Image.open(path) as source:
        if getattr(source, "n_frames", 1) != 1:
            return "animated-skip", original_size, original_size, 0
        if any(source.info.get(key) for key in ("icc_profile", "exif", "xmp")):
            raise RuntimeError(f"Metadata-bearing Field Guide asset needs a preserving encoder: {path}")
        rgba = np.array(source.convert("RGBA"), dtype=np.uint8)

    mask = connected_chroma_mask(rgba, tolerance)
    keyed_pixels = int(np.count_nonzero(mask))
    if keyed_pixels == 0:
        return "already-transparent", original_size, original_size, 0

    expected = rgba.copy()
    expected[:, :, 3][mask] = 0
    candidate_bytes = encode_lossless_rgba(expected, cwebp, compression)
    candidate = decoded_rgba(candidate_bytes)
    if candidate.shape != expected.shape or not np.array_equal(candidate[:, :, 3], expected[:, :, 3]):
        raise RuntimeError(f"Decoded alpha changed while preprocessing {path}")
    visible = expected[:, :, 3] > 0
    if not np.array_equal(candidate[:, :, :3][visible], expected[:, :, :3][visible]):
        raise RuntimeError(f"Visible decoded RGB changed while preprocessing {path}")

    if not dry_run:
        temporary = path.with_name(f".{path.name}.chroma-tmp.webp")
        try:
            temporary.write_bytes(candidate_bytes)
            replace_with_retry(temporary, path)
        finally:
            temporary.unlink(missing_ok=True)
    return "would-preprocess" if dry_run else "preprocessed", original_size, len(candidate_bytes), keyed_pixels


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("root", nargs="?", default="assets/start-menu/field-guide/horror")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--cwebp", default="cwebp")
    parser.add_argument("--compression", type=int, default=9, choices=range(0, 10))
    parser.add_argument("--tolerance", type=int, default=22)
    parser.add_argument("--workers", type=int, default=1)
    args = parser.parse_args()

    paths = sorted(Path(args.root).rglob("*chromakey*.webp"))
    before_total = 0
    after_total = 0
    processed = 0
    keyed_total = 0
    def process(path: Path) -> tuple[str, int, int, int]:
        return preprocess(path, args.cwebp, args.compression, args.tolerance, args.dry_run)

    with ThreadPoolExecutor(max_workers=max(1, args.workers)) as executor:
      results = list(executor.map(process, paths))

    for index, (path, result) in enumerate(zip(paths, results), start=1):
        status, before, after, keyed = result
        before_total += before
        after_total += after
        keyed_total += keyed
        if status in {"preprocessed", "would-preprocess"}:
            processed += 1
            print(
                f"[{index}/{len(paths)}] {status}: {path} "
                f"({before / 1024:.1f} KB -> {after / 1024:.1f} KB, {keyed:,} keyed pixels)"
            )

    print(
        f"Field Guide chroma preprocessing complete: {processed}/{len(paths)} files, "
        f"{before_total / 1024 / 1024:.1f} MB -> {after_total / 1024 / 1024:.1f} MB, "
        f"{keyed_total:,} keyed pixels."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
