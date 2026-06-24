# Status Effect Sprites

Generated status flash icons are packaged in three stages:

- `source/status-flash-effects-v1-chromakey.png` keeps the original image-generated sheet on a flat chroma-key background.
- `transparent/status-flash-effects-v1-transparent.png` is the keyed transparent sheet.
- `runtime/` contains the 96x96 transparent sprites loaded by `game.js`.
- `source/status-flash-effect-mold-v1-chromakey.png` and `transparent/status-flash-effect-mold-v1-transparent.png` are the standalone mold icon source/transparent stages.
- `source/status-flash-effect-radiation-v1-chromakey.png`, `transparent/status-flash-effect-radiation-v1-transparent.png`, and `runtime/status-flash-effect_radiation_idle_SW_00.png` provide the horror-mode radiation hazard icon.
- `source/status-horror-effects-v1-chromakey.png` and `transparent/status-horror-effects-v1-transparent.png` provide the built-in image generation sheet for horror-mode combat statuses.
- `runtime/status-horror-effect_*_idle_FRONT_00.png` contains front-facing 96x96 horror-mode replacements for the bitmap-backed combat status icons.

Runtime order:

1. `burn`
2. `mark`
3. `team_vulnerable`
4. `haste`
5. `attack_boost`
6. `attack_slow`
7. `anti_support`
8. `slowed`
9. `late_fight_stacks`
10. `mold` in non-horror mode, displayed as `radiation` only in horror mode

Horror runtime order:

1. `burn`
2. `mark`
3. `team_vulnerable`
4. `haste`
5. `attack_boost`
6. `attack_slow`
7. `anti_support`
8. `slowed`
9. `late_fight_stacks`
10. `radiation`

The game maps cozy files through `STATUS_EFFECT_SPRITES` and horror-mode files through `HORROR_STATUS_EFFECT_SPRITES`; the older canvas glyphs remain as loading/fallback art.
