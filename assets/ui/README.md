# UI Icon Assets

Generated UI icons use a chroma-key source, transparent intermediate, and packed runtime atlas.

## Runtime

- `runtime/ui-icon-atlas-v1.png` - 8x4 atlas, 64px cells, used for arena, reward, action, ledger, and mold-adjacent UI icons.
- `runtime/upgrade-star-v2.png` - generated tier star icon.
- `runtime/shop-lock-locked-v1.png` / `runtime/shop-lock-unlocked-v1.png` - generated shop lock toggle icons.
- `runtime/status-heart-v1.png` / `runtime/status-coin-v1.png` - generated top-bar resource icons.
- `runtime/status-chalk-course-v1.png`, `runtime/status-chalk-coins-v1.png`, and `runtime/status-chalk-health-v1.png` - generated blank chalk status boards for the top HUD.
- `runtime/battle-speed-chalk-board-v1.png` - generated blank chalk board for the battle speed control.
- `runtime/chalk-sign-restart-v1.png` - generated defeated-state restart chalk sign.

## Source Pipeline

- `source/ui-icon-atlas-v1-chromakey.png` - built-in image generation source on a flat chroma-key background.
- `transparent/ui-icon-atlas-v1-transparent.png` - chroma-key removed with `remove_chroma_key.py`.
- `runtime/ui-icon-atlas-v1.png` - transparent source repacked into a true 512x256, 8x4 atlas so game code can sample 64px cells without distortion.
- `source/top-status-chalk-boards-v1-chromakey.png` - built-in image generation source for the Course/Coins/Health chalk boards on a flat magenta key.
- `transparent/top-status-chalk-boards-v1-transparent.png` - magenta key removed, then sliced into the three runtime status-board PNGs.
- `source/battle-speed-chalk-board-v1-chromakey.png` - built-in image generation source for the battle speed chalk board on a flat magenta key.
- `transparent/battle-speed-chalk-board-v1-transparent.png` - magenta key removed, then cropped into the runtime speed-board PNG.
- `source/chalk-sign-restart-v1-chromakey.png` - built-in image generation source for the defeated-state restart chalk sign on a flat magenta key.
- `transparent/chalk-sign-restart-v1-transparent.png` - magenta key removed, then cropped into the runtime restart-sign PNG.

Prompt summary: a charming pixel-art game UI icon atlas for traits, rewards, actions, combat ledger info, row/column drink lanes, and mold, arranged as an 8x4 no-text grid on a flat `#ff00ff` background. Some generated cells are intentionally unused after later readability passes.
