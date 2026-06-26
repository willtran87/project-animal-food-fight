# Player Assets

This folder contains player-character standee and orientation art used by the standalone opening/tutorial visual novel and runtime experiments.

## Active Opening VN Asset

- `runtime/player-tutorial-dialogue-cutout-v6.png` - active left-side player standee in `opening-vn.html`.

The source green-key image for this standee is kept under `source/`, and the cleaned runtime PNG is used directly by the visual-novel prototype. The current cutout is intended to read as solid foreground VN character art opposite Tabs.

## Related Runtime Art

Other files in `runtime/` are retained from orientation, cutout, and palette experiments. Do not assume they are active without checking the HTML/JS entry point or the relevant `game.js` sprite map.

## Notes

- `opening-vn.js` exposes the active standee side, dialogue beat, speaker state, and completion state through `window.render_game_to_text()`.
- Shopkeeper/Tabs dialogue standees live under `assets/shopkeeper/runtime/`.
