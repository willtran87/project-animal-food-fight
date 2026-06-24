# Background Assets

## Picnic Arena Background V1

- Source copy: `assets/backgrounds/picnic-arena-background-v1-source.webp`
- Runtime crop: `assets/backgrounds/picnic-arena-background-v1-2048x1280.webp`
- Runtime ratio: `16:10`, matching the `1024x640` canvas.
- Status: `source-reference-pass`

Generated with the built-in image generation tool as a high-resolution pixel-art picnic market arena. The runtime asset is center-cropped and resized to `2048x1280` for crisp 2x canvas rendering.

## Arena Backgrounds V1

- `arena-sunny-breakfast-patio-v1.png`
- `arena-rainy-fish-market-v1.png`
- `arena-street-festival-v1.png`
- `arena-spice-bazaar-v1.png`
- `arena-frozen-parfait-peak-v1.png`
- `arena-dim-sum-kitchen-v1.png`

Generated with the built-in image generation tool as crop-safe 16:10 food-fantasy arena backgrounds. These runtime assets are used directly by the round arena modifier system and are cached by source path in `game.js`.

## War Future Market V1

- Source copy: `assets/backgrounds/war-future-market-v1-source.png`
- Runtime crop: `assets/backgrounds/war-future-market-v1-2048x1280.webp`
- Runtime ratio: `16:10`, matching the `1024x640` canvas.
- Status: `reality-break-theme-pass`

Generated with the built-in image generation tool as the post-illusion war-torn market background. It keeps faint cozy market shapes at the edges while exposing drones, ruined stalls, machine infrastructure, and neon green combat lighting for the horror/future layer.

## Horror Arena Backgrounds V1

- `horror/arena-solar-ration-patio-v1.png`
- `horror/arena-flooded-protein-docks-v1.png`
- `horror/arena-blackout-street-carnival-v1.png`
- `horror/arena-ember-spice-foundry-v1.png`
- `horror/arena-cryo-dairy-vault-v1.png`
- `horror/arena-steam-canteen-block-v1.png`

Generated with the built-in image generation tool as future-war, mechanical horror replacements for the six arena modifier backgrounds. In the horror/reality layer, `game.js` maps each cozy arena to its matching horror counterpart while preserving the same gameplay modifiers.

## Victory Sunset Cutscene V2

- Runtime asset: `horror/victory-sunset-cutscene-v2.png`
- Idealized follow-up asset: `horror/victory-idealized-market-v1.png`
- Runtime ratio: `16:10`, matching the `1024x640` canvas.
- Status: `final-victory-cutscene-epilogue-pass`

Generated with the built-in image generation tool as high-resolution pixel-art ending backgrounds for the horror layer. After clearing wave 20, the game draws the sunset scene with a slow camera pan and scrolling epilogue text, then statically fades into the idealized restored market scene before showing the reboot button.
