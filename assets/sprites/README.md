# Sprite Asset Pipeline

Current status: `source-reference-pass`.

This folder proves the image-gen-to-transparent-sprite workflow:

1. Generate high-resolution pixel-art sprites on a flat `#ff00ff` chroma-key background.
2. Copy the generated source PNG into `assets/sprites/source/`.
3. Remove the chroma key with:

```powershell
python C:\Users\Will\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py `
  --input assets\sprites\source\toast-tortoise-evolution-v1-chromakey.png `
  --out assets\sprites\transparent\toast-tortoise-evolution-v1-transparent.png `
  --auto-key border `
  --soft-matte `
  --transparent-threshold 12 `
  --opaque-threshold 220 `
  --despill
```

4. Slice separated transparent components into runtime frames:

```powershell
python tools\slice_transparent_sprite_sheet.py `
  --input assets\sprites\transparent\toast-tortoise-evolution-v1-transparent.png `
  --out-dir assets\sprites\runtime\toast-tortoise `
  --names toastlet butterback clubshell `
  --prefix toast-tortoise `
  --size 192
```

For source sheets with large tier-3 forms or detached details, use grouped slicing so nearby forms do not contaminate each other:

```powershell
python tools\slice_transparent_sprite_sheet.py `
  --input assets\sprites\transparent\sushi-seal-evolution-v1-transparent.png `
  --out-dir assets\sprites\runtime\sushi-seal `
  --names maki-pup nigiri-seal dragon-roll `
  --prefix sushi-seal `
  --size 192 `
  --mode grouped `
  --min-pixels 80
```

## Toast Tortoise V1

- Source chroma-key sheet: `source/toast-tortoise-evolution-v1-chromakey.png`
- Transparent source sheet: `transparent/toast-tortoise-evolution-v1-transparent.png`
- Runtime frames:
  - `runtime/toast-tortoise/toast-tortoise_toastlet_idle_SW_00.png`
  - `runtime/toast-tortoise/toast-tortoise_butterback_idle_SW_00.png`
  - `runtime/toast-tortoise/toast-tortoise_clubshell_idle_SW_00.png`
- Runtime preview sheet: `runtime/toast-tortoise/toast-tortoise_evolution_SW_sheet.png`

The active game sprites are now v3 coherent four-form sheets. Each food-animal line was regenerated as a single four-form source sheet so its identity and transitions stay consistent across all forms. These are transparent `192x192` prototype sprites, not production-ready animation packages, because they only contain one pose per generated form and no bespoke animation frames.

## Remaining Evolution Lines V1

The other playable food-animal lines now follow the same source-reference-pass pipeline:

- Sushi Seal: `source/sushi-seal-evolution-v1-chromakey.png`, `transparent/sushi-seal-evolution-v1-transparent.png`, `runtime/sushi-seal/sushi-seal_evolution_SW_sheet.png`
- Taco Tiger: `source/taco-tiger-evolution-v1-chromakey.png`, `transparent/taco-tiger-evolution-v1-transparent.png`, `runtime/taco-tiger/taco-tiger_evolution_SW_sheet.png`
- Berry Bat: `source/berry-bat-evolution-v1-chromakey.png`, `transparent/berry-bat-evolution-v1-transparent.png`, `runtime/berry-bat/berry-bat_evolution_SW_sheet.png`
- Noodle Newt: `source/noodle-newt-evolution-v1-chromakey.png`, `transparent/noodle-newt-evolution-v1-transparent.png`, `runtime/noodle-newt/noodle-newt_evolution_SW_sheet.png`

Each active v3 runtime folder includes four transparent `192x192` idle SW PNGs, a horizontal evolution preview sheet, and a `*.sprite-manifest.json` file. The game currently points to:

- `runtime/toast-tortoise-v3/toast-tortoise_evolution_SW_sheet.png`
- `runtime/sushi-seal-v3/sushi-seal_evolution_SW_sheet.png`
- `runtime/taco-tiger-v3/taco-tiger_evolution_SW_sheet.png`
- `runtime/berry-bat-v3/berry-bat_evolution_SW_sheet.png`
- `runtime/noodle-newt-v3/noodle-newt_evolution_SW_sheet.png`

These remain prototype sprites, not production-ready animation packages.

## Coherent Evolution Lines V3

The v3 pass replaced the mixed-history form set with one generated source sheet per animal line. The prompts emphasized preserving the same character identity, face, pose family, palette, and silhouette across all four forms:

- Toast Tortoise: `source/toast-tortoise-evolution-v3-chromakey.png`, `transparent/toast-tortoise-evolution-v3-transparent.png`, `runtime/toast-tortoise-v3/`
- Sushi Seal: `source/sushi-seal-evolution-v3-chromakey.png`, `transparent/sushi-seal-evolution-v3-transparent.png`, `runtime/sushi-seal-v3/`
- Taco Tiger: `source/taco-tiger-evolution-v3-chromakey.png`, `transparent/taco-tiger-evolution-v3-transparent.png`, `runtime/taco-tiger-v3/`
- Berry Bat: `source/berry-bat-evolution-v3-chromakey.png`, `transparent/berry-bat-evolution-v3-transparent.png`, `runtime/berry-bat-v3/`
- Noodle Newt: `source/noodle-newt-evolution-v3-chromakey.png`, `transparent/noodle-newt-evolution-v3-transparent.png`, `runtime/noodle-newt-v3/`

## Anchored Final Forms V2

The v2 final-form sheet was generated after comparing the first pass against the existing tier-3 runtime sprites. It explicitly preserves Clubshell, Dragon Roll, Fiesta Fang, Elderberry Bat, and Hotpot Newt as identity anchors, then adds the fourth-form details:

- Toast Tortoise: `runtime/toast-tortoise/toast-tortoise_banquet-shell-v2_idle_SW_00.png`
- Sushi Seal: `runtime/sushi-seal/sushi-seal_omakase-seal-v2_idle_SW_00.png`
- Taco Tiger: `runtime/taco-tiger/taco-tiger_carnival-tiger-v2_idle_SW_00.png`
- Berry Bat: `runtime/berry-bat/berry-bat_royal-berry-bat-v2_idle_SW_00.png`
- Noodle Newt: `runtime/noodle-newt/noodle-newt_cauldron-newt-v2_idle_SW_00.png`

## Uncommon Evolution Lines V1

The first Uncommon animal lines now use the same chroma-key-to-transparent workflow:

- Pancake Penguin: `source/pancake-penguin-evolution-v1-chromakey.png`, `transparent/pancake-penguin-evolution-v1-transparent.png`, `runtime/pancake-penguin-v1/`
- Pretzel Python: `source/pretzel-python-evolution-v1-chromakey.png`, `transparent/pretzel-python-evolution-v1-transparent.png`, `runtime/pretzel-python-v1/`
- Curry Crab: `source/curry-crab-evolution-v1-chromakey.png`, `transparent/curry-crab-evolution-v1-transparent.png`, `runtime/curry-crab-v1/`
- Popcorn Porcupine: `source/popcorn-porcupine-evolution-v1-chromakey.png`, `transparent/popcorn-porcupine-evolution-v1-transparent.png`, `runtime/popcorn-porcupine-v1/`
- Yogurt Yeti: `source/yogurt-yeti-evolution-v1-chromakey.png`, `transparent/yogurt-yeti-evolution-v1-transparent.png`, `runtime/yogurt-yeti-v1/`

These are four-form `source-reference-pass` idle sprites generated with built-in image generation on flat chroma-key backgrounds, converted to alpha with `remove_chroma_key.py`, then sliced in grouped mode into `192x192` runtime PNGs. The first three Uncommons used `#ff00ff`; Popcorn Porcupine and Yogurt Yeti use `#00ff00`.

## Rare Evolution Lines V1

The first Rare animal lines follow the same four-form chroma-key-to-transparent workflow:

- Donut Dodo: `source/donut-dodo-evolution-v1-chromakey.png`, `transparent/donut-dodo-evolution-v1-transparent.png`, `runtime/donut-dodo-v1/`
- Kimchi Chameleon: `source/kimchi-chameleon-evolution-v1-chromakey.png`, `transparent/kimchi-chameleon-evolution-v1-transparent.png`, `runtime/kimchi-chameleon-v1/`
- Waffle Walrus: `source/waffle-walrus-evolution-v1-chromakey.png`, `transparent/waffle-walrus-evolution-v1-transparent.png`, `runtime/waffle-walrus-v1/`
- Dumpling Armadillo: `source/dumpling-armadillo-evolution-v1-chromakey.png`, `transparent/dumpling-armadillo-evolution-v1-transparent.png`, `runtime/dumpling-armadillo-v1/`
- Lemon Meringue Lynx: `source/lemon-meringue-lynx-evolution-v1-chromakey.png`, `transparent/lemon-meringue-lynx-evolution-v1-transparent.png`, `runtime/lemon-meringue-lynx-v1/`

These are `source-reference-pass` idle sprites generated with built-in image generation on a flat `#ff00ff` background, converted to alpha with `remove_chroma_key.py`, then sliced in grouped mode into transparent `192x192` runtime PNGs.

## Epic Evolution Lines V1

The first Epic animal lines follow the same four-form chroma-key-to-transparent workflow, using a flat `#00ff00` background so purple/pink Epic palettes survive key removal cleanly:

- Croissant Kraken: `source/croissant-kraken-evolution-v1-chromakey.png`, `transparent/croissant-kraken-evolution-v1-transparent.png`, `runtime/croissant-kraken-v1/`
- Fortune Cookie Fox: `source/fortune-cookie-fox-evolution-v1-chromakey.png`, `transparent/fortune-cookie-fox-evolution-v1-transparent.png`, `runtime/fortune-cookie-fox-v1/`
- Mochi Mammoth: `source/mochi-mammoth-evolution-v1-chromakey.png`, `transparent/mochi-mammoth-evolution-v1-transparent.png`, `runtime/mochi-mammoth-v1/`
- Gingerbread Golem: `source/gingerbread-golem-evolution-v1-chromakey.png`, `transparent/gingerbread-golem-evolution-v1-transparent.png`, `runtime/gingerbread-golem-v1/`
- Boba Basilisk: `source/boba-basilisk-evolution-v1-chromakey.png`, `transparent/boba-basilisk-evolution-v1-transparent.png`, `runtime/boba-basilisk-v1/`

These are `source-reference-pass` idle sprites generated with built-in image generation, converted to alpha with `remove_chroma_key.py`, then sliced in grouped mode into transparent `192x192` runtime PNGs. The ordered preview for this pass is `output/epic-food-animals-v1-ordered-preview.png`.

## Gap-Fill Epic Evolution Lines V1

The three late-game gap-fill animals follow the same four-form chroma-key-to-transparent workflow, using a flat `#ff00ff` background:

- Churro Cheetah: `source/churro-cheetah-evolution-v1-chromakey.png`, `transparent/churro-cheetah-evolution-v1-transparent.png`, `runtime/churro-cheetah-v1/`
- Granola Goat: `source/granola-goat-evolution-v1-chromakey.png`, `transparent/granola-goat-evolution-v1-transparent.png`, `runtime/granola-goat-v1/`
- Breakfast Burrito Boar: `source/breakfast-burrito-boar-evolution-v1-chromakey.png`, `transparent/breakfast-burrito-boar-evolution-v1-transparent.png`, `runtime/breakfast-burrito-boar-v1/`

These are static `source-reference-pass` idle sprites generated with built-in image generation, converted to alpha with `remove_chroma_key.py`, then sliced in grouped mode into transparent `192x192` runtime PNGs. They are not production-ready animation packages.

## Fresh/Salad Defeat Stills V2

The Fresh/Salad defeat stills use complete ready-to-eat food objects matched to the existing defeat-still detail level, with subtle sticker rims and no animal/defeat symbolism:

- Caesar Salamander: `runtime/defeat-stills/caesar-salamander-defeat-food-v2.png`
- Cucumber Cobra: `runtime/defeat-stills/cucumber-cobra-defeat-food-v2.png`
- Avocado Axolotl: `runtime/defeat-stills/avocado-axolotl-defeat-food-v2.png`
- Herb Hare: `runtime/defeat-stills/herb-hare-defeat-food-v2.png`
- Caprese Capybara: `runtime/defeat-stills/caprese-capybara-defeat-food-v2.png`
- Vinaigrette Viper: `runtime/defeat-stills/vinaigrette-viper-defeat-food-v2.png`

Source and processed sheets:

- `source/food-defeat-stills-fresh-garden-v2-chromakey.png`
- `transparent/food-defeat-stills-fresh-garden-v2-transparent.png`
- `runtime/defeat-stills/food-defeat-stills-fresh-garden-v2-runtime-sheet.png`

These were generated with built-in image generation on a flat `#ff00ff` background, converted to alpha with `remove_chroma_key.py`, sliced into `192x192` runtime PNGs, and cleaned to remove sheet-edge slivers.

## Missing-Pair Evolution Lines V1

The three missing-pair animals follow the same four-form chroma-key-to-transparent workflow, using a flat `#00ff00` background:

- Hot Chip Hamster: `source/hot-chip-hamster-evolution-v1-chromakey.png`, `transparent/hot-chip-hamster-evolution-v1-transparent.png`, `runtime/hot-chip-hamster-v1/`
- Bao Bun Badger: `source/bao-bun-badger-evolution-v1-chromakey.png`, `transparent/bao-bun-badger-evolution-v1-transparent.png`, `runtime/bao-bun-badger-v1/`
- Saltwater Taffy Otter: `source/saltwater-taffy-otter-evolution-v1-chromakey.png`, `transparent/saltwater-taffy-otter-evolution-v1-transparent.png`, `runtime/saltwater-taffy-otter-v1/`

These are static `source-reference-pass` idle sprites generated with built-in image generation, converted to alpha with `remove_chroma_key.py`, then sliced in grouped mode into transparent `192x192` runtime PNGs. They are not production-ready animation packages.

Hot Chip Hamster was revised in V2 after the first final form drifted away from hamster identity:

- Hot Chip Hamster V2: `source/hot-chip-hamster-evolution-v2-chromakey.png`, `transparent/hot-chip-hamster-evolution-v2-transparent.png`, `runtime/hot-chip-hamster-v2/`

The active game uses V2, and its final form is `Kettlefire Hamster`.

## Ocean Gap-Fill Evolution Lines V1

Benedict Lobster follows the same four-form chroma-key-to-transparent workflow, using a flat `#ff00ff` background:

- Benedict Lobster: `source/benedict-lobster-evolution-v1-chromakey.png`, `transparent/benedict-lobster-evolution-v1-transparent.png`, `runtime/benedict-lobster-v1/`
- Benedict Lobster V3: `source/benedict-lobster-evolution-v3-chromakey.png`, `transparent/benedict-lobster-evolution-v3-transparent.png`, `runtime/benedict-lobster-v3/`

This is a static `source-reference-pass` idle sprite set generated with built-in image generation, converted to alpha with `remove_chroma_key.py`, then sliced into transparent `192x192` runtime PNGs. It is not a production-ready animation package. The active game uses V3 because its source sheet has wider spacing for cleaner slicing and a simpler cast-matched detail level.

The earlier Lox Lobster concept was superseded because its first pass read as a claw and its later pass reused bagel language already covered elsewhere in the cast:

- Lox Lobster V1/V2: `runtime/lox-lobster-v1/`, `runtime/lox-lobster-v2/`

The active game uses Benedict Lobster, whose first form is `Benny Lobster`, a complete baby lobster with eggs Benedict/hollandaise food identity.

The V3 tier-4 runtime frame was later corrected for clipping with a generated Brunch Tide Lobster reference:

- Corrected tier-4 source: `source/benedict-lobster-brunch-tide-lobster-v4-chromakey.png`
- Corrected tier-4 transparent source: `transparent/benedict-lobster-brunch-tide-lobster-v4-transparent.png`

## Fresh/Salad Evolution Lines V1

The Fresh/Salad animal lines follow the same four-form chroma-key-to-transparent workflow, using a flat `#ff00ff` background because the subjects are green-heavy:

- Caesar Salamander: `source/caesar-salamander-evolution-v1-chromakey.png`, `transparent/caesar-salamander-evolution-v1-transparent.png`, `runtime/caesar-salamander-v1/`
- Cucumber Cobra: `source/cucumber-cobra-evolution-v1-chromakey.png`, `transparent/cucumber-cobra-evolution-v1-transparent.png`, `runtime/cucumber-cobra-v1/`
- Avocado Axolotl: `source/avocado-axolotl-evolution-v1-chromakey.png`, `transparent/avocado-axolotl-evolution-v1-transparent.png`, `runtime/avocado-axolotl-v1/`
- Herb Hare: `source/herb-hare-evolution-v1-chromakey.png`, `transparent/herb-hare-evolution-v1-transparent.png`, `runtime/herb-hare-v1/`
- Caprese Capybara: `source/caprese-capybara-evolution-v1-chromakey.png`, `transparent/caprese-capybara-evolution-v1-transparent.png`, `runtime/caprese-capybara-v1/`
- Vinaigrette Viper: `source/vinaigrette-viper-evolution-v1-chromakey.png`, `transparent/vinaigrette-viper-evolution-v1-transparent.png`, `runtime/vinaigrette-viper-v1/`

These are static `source-reference-pass` idle sprites generated with built-in image generation, converted to alpha with `remove_chroma_key.py`, then sliced in grouped mode into transparent `192x192` runtime PNGs. They are not production-ready animation packages.
