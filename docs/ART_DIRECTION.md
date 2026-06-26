# Food Animal Auto-Battler Art Direction

## Visual North Star

Food animals should read as high-resolution pixel art stickers: chunky, collectible, tactile, and immediately readable at board-game scale. Think premium indie pixel rendering with clean silhouettes, controlled palettes, and a playful sticker-sheet finish.

Current status: `expanded-source-reference-pass`. The in-game roster now uses image-generated transparent idle poses for 43 food-animal lines, with matching horror/future-war override packages for the same runtime roster. The original five starter lines established the coherent four-form sheet workflow; later lines follow the same broad contract but may use newer versioned packages where a readability, alpha, facing, or horror-identity pass replaced the first accepted sheet. Procedural placeholders remain as loading/fallback art only.

## Image-Generated Reference

Current v1 image-gen reference:

```text
assets/art-direction/food-animal-sticker-reference-v1.webp
```

Current transparent sprite pipeline proofs:

```text
assets/sprites/runtime/toast-tortoise-v3/toast-tortoise_evolution_SW_sheet.png
assets/sprites/runtime/sushi-seal-v3/sushi-seal_evolution_SW_sheet.png
assets/sprites/runtime/taco-tiger-v3/taco-tiger_evolution_SW_sheet.webp
assets/sprites/runtime/berry-bat-v3/berry-bat_evolution_SW_sheet.webp
assets/sprites/runtime/noodle-newt-v3/noodle-newt_evolution_SW_sheet.webp
```

Current v1 background:

```text
assets/backgrounds/picnic-arena-background-v1-2048x1280.webp
```

Status: `expanded-source-reference-pass`.

What works:

- Strong collectible sticker finish.
- Clear food-animal hybrid identities.
- Warm, polished, high-resolution pixel-art feel.
- Thick white borders and readable silhouettes.
- Chroma-key-to-alpha workflow can produce transparent `192x192` runtime PNGs.
- V3 four-form sheets preserve each line's face, pose, palette, and food-animal identity while making the transitions more gradual and readable.
- Noodle Newt uses a grand-v2 Tier 4 replacement, and Granola Goat uses regenerated v3 phases 3-4 so the final forms face screen-left and keep runtime-scale consistency.
- Picnic market arena background gives the game a clear food-world setting while leaving a calm playable center.

What to tighten in the next pass:

- Make the art more sprite-sheet-ready and less illustration-poster-like.
- Keep every unit closer to a compact `192x192` gameplay read.
- Reduce painterly microtexture where it fights pixel-grid clarity.
- Produce individual source boards or cutout-ready sprites per unit.
- Generate future sprite sources on flat `#ff00ff` when green food ingredients are present, then remove the key locally.
- Keep future backgrounds clear under the shop, board, bench, and top-bar text.
- Preserve same-footprint evolution where readability matters more than size growth, especially for horror/war-machine forms.
- Keep detached particles, defeat stills, and runtime forms separated by large gutters before slicing.

## Current Runtime Scope

The current playable game has:

- 43 food-animal catalog lines in `src/game.js`.
- Cozy runtime sprite mappings for every catalog line under `RUNTIME_SPRITES`.
- Horror/future-war runtime override mappings for every catalog line under `REALITY_RUNTIME_SPRITES`.
- Cozy and horror attack-particle mappings, defeat-still mappings, status-effect sprite sets, and item/drink art mappings.
- Static source-reference idle sprites, not production animation sets.

Wave-specific special cases:

- Wave 10: Banana Split Giraffe / Holograph Projector Giraffe boss route.
- Wave 20: Neural Overmind final boss with brainstem-wire minions, dedicated particles, defeat stills, terminal defeat handling, and victory cutscene route.

Do not treat any active food-animal package as `production-ready` animation art until it has bespoke cleaned combat idle, attack, hit, defeat, and signature-ability frames.

## Starter Runtime Sprite Lines

- Toast Tortoise: Toastlet > Butterback > Clubshell > Banquet Shell
- Sushi Seal: Maki Pup > Nigiri Seal > Dragon Roll > Omakase Seal
- Taco Tiger: Taco Cub > Loaded Tiger > Fiesta Fang > Carnival Tiger
- Berry Bat: Berry Bat > Bramble Bat > Elderberry Bat > Royal Berry Bat
- Noodle Newt: Noodle Newt > Ramen Newt > Hotpot Newt > Cauldron Newt

Each starter line has a versioned chroma-key source sheet in `assets/sprites/source/`, a transparent source sheet in `assets/sprites/transparent/`, four `192x192` transparent runtime PNGs, a horizontal preview sheet, and a sprite manifest under `assets/sprites/runtime/<line-id>-v*/`. Later art passes may point the active game to higher-version packages than the examples in this document.

## Sprite Style

- Format target: transparent `192x192` PNG gameplay frames.
- Render language: HD pixel art with crisp grid integrity and no blurry scaling.
- Sticker treatment: thick warm-white outer border, subtle dark contact shadow, and a light inner highlight.
- Shape language: big readable food silhouette first, animal identity second, tiny face details last.
- Lighting: consistent top-left light, darker lower-right shadow clusters.
- Palette: 5-8 functional colors per unit plus shared dark outline and sticker white.
- Line work: dark green-black outer pixel contour, selective interior lines only where they clarify the food/animal hybrid.
- Motion: whole-pixel movement only; no subpixel drifting.

## Unit Identity Rules

- Toast Tortoise: square toast shell, tiny tortoise face, cozy tank silhouette.
- Sushi Seal: oval rice body, seaweed band, pink fish stripe, round seal expression.
- Taco Tiger: half-moon taco shell, tomato/lettuce stripes as tiger markings, bold brawler read.
- Berry Bat: berry body, triangular wings, bright berry cheek marks, light aerial silhouette.
- Noodle Newt: noodle ribbon body, newt head, herb-green accent, support/healer read.

## Evolution Read

- 1 star: compact sticker, simple face, clean food-animal silhouette.
- 2 star: larger outline weight, extra garnish/accent pixels, brighter highlight.
- 3 star: premium sticker finish with gold sparkle pixels and a stronger silhouette hook.
- 4 star: final feast form with the strongest silhouette, crown/garnish read, and extra celebratory sparkle while preserving the original animal-food identity.

Evolution must feel incremental, not like a species swap. Each line keeps the original food-animal idea, then adds more ingredients, structure, and confidence.

| Line | 1 Star | 2 Star | 3 Star | 4 Star |
|---|---|---|---|---|
| Toast Tortoise | Toastlet: simple toast shell, small tortoise face, butter hint. | Butterback: thicker toast shell, larger butter pat, leafy filling layer. | Clubshell: stacked club-sandwich shell, garnish sparkle, broader tank silhouette. | Banquet Shell: towering party-sandwich tortoise shell, celebratory garnish, final guardian silhouette. |
| Sushi Seal | Maki Pup: rice-roll seal body, seaweed band, small fish stripe. | Nigiri Seal: larger rice body, salmon cap, cleaner seal face. | Dragon Roll Seal: deluxe roll accents, roe/garnish pixels, stronger premium silhouette. | Omakase Seal: platter-grade seal form with layered fish cap, seaweed flourish, and chef's-choice premium read. |
| Taco Tiger | Taco Cub: basic taco shell and cub face, simple lettuce/tomato stripes. | Loaded Tiger: fuller taco, extra filling, stronger tiger stripe read. | Fiesta Fang: overstuffed shell, bold stripe pattern, garnish crest and confident brawler posture. | Carnival Tiger: festival-sized taco tiger with crown-like shell crest, boldest stripes, and final brawler posture. |
| Berry Bat | Berry Bat: single berry body with small wings. | Bramble Bat: extra berry clusters, bigger wings, thorn/leaf accents. | Elderberry Bat: clustered berry body, stem crest, wide readable wing silhouette. | Royal Berry Bat: crowned berry cluster body, broad wings, bright jam accents, final aerial silhouette. |
| Noodle Newt | Noodle Newt: simple noodle ribbon body and small newt face. | Ramen Newt: thicker noodle curls, herb garnish, clearer support identity. | Hotpot Newt: abundant noodle loops, leafy garnish crown, larger healer creature silhouette. | Cauldron Newt: overflowing noodle-and-broth healer with herb crown, steam curls, and final support silhouette. |

Rules for generated evolution sheets:

- Show all four forms side by side for the same line.
- Keep the same pose family, camera angle, and lighting across forms.
- Increase complexity by adding ingredients and silhouette confidence, not by replacing the animal.
- Tier 2 should be a believable upgrade from Tier 1; Tier 3 should look premium; Tier 4 should read as the completed final recipe.
- Tier 3 and Tier 4 may add gold sparkle pixels, but the food-animal identity must still do the work.

## Production Pipeline

1. Create a source-reference board for each food animal with large beauty pose, four direction keys, silhouette proof, and palette.
2. Approve source-reference-pass art before making animation sheets.
3. Produce animation-keyframe-pass sheets for combat idle, attack, hit, death, and any signature ability.
4. Export `192x192` transparent gameplay frames and JSON metadata only after keyframes are approved.

Do not label sprite packages `production-ready` until every required animation has bespoke cleaned frames, not duplicated or pose-expanded filler.

## Documentation Pointers

- Use `assets/sprites/README.md` for the authoritative package-by-package sprite pipeline and active-version history.
- Use `assets/items/README.md` for topping/drink art, horror weapons, and horror fuel-source replacements.
- Use `assets/ui/README.md` for active UI atlas, HUD, shop, manifest, combat-ledger, and reality-break panel assets.
- Use `../assets/backgrounds/README.md` and `HORROR_ARENA_MAPPING.md` for arena and cutscene background mappings.

## V1 Image Prompt

```text
Use case: stylized-concept
Asset type: game sprite source-reference sheet for an auto-battler
Primary request: Create a high-resolution pixel art sticker reference sheet for five food-animal units: Toast Tortoise, Sushi Seal, Taco Tiger, Berry Bat, and Noodle Newt.
Subject: Five separate collectible food-animal sticker sprites, each shown as a clean three-quarter game sprite concept with a distinct silhouette. Toast Tortoise has a square toast shell and tiny tortoise face. Sushi Seal has oval rice body, seaweed band, pink fish stripe, and round seal expression. Taco Tiger has a taco shell body with tomato/lettuce tiger markings. Berry Bat has a berry body with triangular wings. Noodle Newt has a noodle ribbon body and small newt face with herb-green accent.
Style/medium: high-resolution modern pixel art, HD pixel sprite rendering, sticker-like cutout finish, crisp pixel grid, chunky readable forms, premium indie game asset quality.
Composition/framing: clean reference sheet with the five sprites in a single row or tidy grid, generous spacing, full bodies visible, no cropping. Each sprite should feel usable as a future 192x192 transparent gameplay sprite.
Lighting/mood: consistent top-left lighting, cozy playful collectible mood.
Color palette: controlled saturated food colors, shared dark green-black outline, warm-white sticker border, subtle contact shadow.
Materials/textures: pixel clusters, painterly pixel shading, no soft airbrush, no vector smoothness.
Constraints: no text labels, no watermark, no UI, no photorealism, no smooth vector art, no blurry scaling, no anti-aliased outer edges, no background scene. Keep each sticker sprite separated and easy to cut out later.
```
