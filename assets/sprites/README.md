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

## Horror War-Machine Starter Base V1

The first horror-mode unit art pass replaces the five starter identity hooks with future-war mechanical sprites while preserving their silhouettes:

- Source reference sheet: `output/horror-war-machine-reference-sheet.png`
- Generated chroma-key source: `source/war-machine-starter-base-v1-chromakey.png`
- Transparent source: `transparent/war-machine-starter-base-v1-transparent.png`
- Runtime frames and manifest: `runtime/war-machine-starter-base-v1/`
- Contact preview: `output/war-machine-starter-base-v1-contact.png`

This pass covers Toast Tortoise, Sushi Seal, Taco Tiger, Berry Bat, and Noodle Newt as horror-only runtime overrides. The base sprites are retained as historical single-frame references; horror mode now uses dedicated four-form war-machine sheets for all five starter lines.

### Toast Tortoise Horror Evolution V1

Toast Tortoise has a complete horror vertical slice. V1 is retained for history, but horror mode now uses the more mechanical V3 redo:

- Generated chroma-key source: `source/war-machine-toast-tortoise-evolution-v1-chromakey.png`
- Transparent source: `transparent/war-machine-toast-tortoise-evolution-v1-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-toast-tortoise-v1/`
- Attack particle: `assets/particles/runtime/war-machine-toast-tortoise-rail-toast-shard-v1.png`
- Defeat still: `runtime/defeat-stills/toast-tortoise-war-machine-defeat-v1.png`
- Contact preview: `output/war-machine-toast-tortoise-v1-contact.png`

The generated V1 sheet was prompted with six cells: four Bulwark Siege Tank evolution stages, one projectile, and one wrecked defeat state. V2 replaces it because the particle needed to read as a static icon and the sheet needed cleaner cutout spacing.

### Toast Tortoise Horror Evolution V2

Toast Tortoise V2 is retained for history; horror mode now uses the purer robot V3 redo:

- Generated chroma-key source: `source/war-machine-toast-tortoise-evolution-v2-chromakey.png`
- Transparent source: `transparent/war-machine-toast-tortoise-evolution-v2-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-toast-tortoise-v2/`
- Static attack particle: `assets/particles/runtime/war-machine-toast-tortoise-static-armor-shard-v2.png`
- Defeat still: `runtime/defeat-stills/toast-tortoise-war-machine-defeat-v2.png`
- Contact preview: `output/war-machine-toast-tortoise-v2-contact.png`

The V2 prompt explicitly referenced the cozy Toast Tortoise evolution from small toast-shell tortoise to banquet bunker final, preserved the Bulwark Siege Tank identity, required extra-wide gutters for clean slicing, and required the attack particle to avoid speed lines, trails, directional smear, sparks shooting off, or motion blur. The transparent sheet alpha scan found exactly six slice groups with 71-95px clear gutters between visible pixels.

### Toast Tortoise Horror Evolution V3

Toast Tortoise V3 is the active horror-mode slice:

- Generated chroma-key source: `source/war-machine-toast-tortoise-evolution-v3-chromakey.png`
- Transparent source: `transparent/war-machine-toast-tortoise-evolution-v3-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-toast-tortoise-v3/`
- Static attack particle: `assets/particles/runtime/war-machine-toast-tortoise-static-rail-discharge-v3.png`
- Defeat still: `runtime/defeat-stills/toast-tortoise-war-machine-defeat-v3.png`
- Contact preview: `output/war-machine-toast-tortoise-v3-contact.png`

The V3 prompt pushed the tortoise into a pure robotic siege-machine identity: no food, toast, bread, butter, or organic turtle body. It keeps the old warm orange/olive/cream palette only as metallic panels and neon-lit hardware. The sheet contains four clear evolution stages, one static futuristic munition/discharge particle with no motion cues, and one disabled mechanical wreck. The transparent source alpha scan found exactly six groups with 49-65px clear gutters; grouped-mask slicing was used to prevent neighboring cell bleed.

The active defeat still is now `runtime/defeat-stills/toast-tortoise-war-machine-defeat-v9.png`, an identity-anchored combat-restyle wreck that keeps the TT-04 Bulwark Siege Platform's cannon, tread blocks, square pods, and yellow shield module readable while exposing toast, butter, crumbs, coolant, and wiring from damaged hull seams. Its source trail is `source/toast-tortoise-war-machine-defeat-v9-chromakey.png` -> `transparent/toast-tortoise-war-machine-defeat-v9-transparent.png` -> runtime `192x192`.

### Sushi Seal Horror Evolution V1

Sushi Seal V1 is retained for history, but horror mode now uses the purer robot V2 redo:

- Generated chroma-key source: `source/war-machine-sushi-seal-evolution-v1-chromakey.png`
- Transparent source: `transparent/war-machine-sushi-seal-evolution-v1-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-sushi-seal-v1/`
- Static attack particle: `assets/particles/runtime/war-machine-sushi-seal-static-sensor-mine-v1.png`
- Defeat still: `runtime/defeat-stills/sushi-seal-war-machine-defeat-v1.png`
- Contact preview: `output/war-machine-sushi-seal-v1-contact.png`

The generated sheet was prompted with six cells: four Tide Recon Drone evolution stages, one static sensor mine, and one disabled wreck state. The source referenced the cozy Sushi Seal progression, then translated it into longer and more heavily equipped recon-drone forms. V2 replaces it because V1 retained too many food-coded sushi cues.

### Sushi Seal Horror Evolution V2

Sushi Seal V2 is the active horror-mode slice:

- Generated chroma-key source: `source/war-machine-sushi-seal-evolution-v2-chromakey.png`
- Transparent source: `transparent/war-machine-sushi-seal-evolution-v2-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-sushi-seal-v2/`
- Static munition particle: `assets/particles/runtime/war-machine-sushi-seal-sonar-charge-v2.png`
- Defeat still: `runtime/defeat-stills/sushi-seal-war-machine-defeat-v2.png`
- Contact preview: `output/war-machine-sushi-seal-v2-contact.png`

The V2 prompt explicitly prohibited sushi, rice, roe, fish, seaweed, and organic seal features while preserving the rounded submersible recon silhouette. The six cells are four clear evolution stages, one static sonar charge, and one disabled wreck. The alpha scan found exactly six slice groups with 103, 97, 67, 44, and 89px gutters between visible subjects.

The active defeat still is now `runtime/defeat-stills/sushi-seal-war-machine-defeat-v6.png`, an identity-anchored combat-restyle wreck that keeps the SS-07 Tide Recon Drone's long sub-drone hull, front green lens, dorsal tower, and side torpedo pods readable while exposing rice, fish filling, nori, coolant, and wiring from cracked hull seams. Its source trail is `source/sushi-seal-war-machine-defeat-v6-chromakey.png` -> `transparent/sushi-seal-war-machine-defeat-v6-transparent.png` -> runtime `192x192`.

### Taco Tiger Horror Evolution V1

Taco Tiger V1 is retained for history; horror mode now uses the purer robot V2 redo:

- Generated chroma-key source: `source/war-machine-taco-tiger-evolution-v1-chromakey.png`
- Transparent source: `transparent/war-machine-taco-tiger-evolution-v1-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-taco-tiger-v1/`
- Static munition particle: `assets/particles/runtime/war-machine-taco-tiger-breacher-discharge-v1.png`
- Defeat still: `runtime/defeat-stills/taco-tiger-war-machine-defeat-v1.png`
- Contact preview: `output/war-machine-taco-tiger-v1-contact.png`

The accepted sheet was the second generation; the first was rejected because the visible subjects were too close for the standard splitter. The prompt translated the cozy Taco Tiger progression into a machine-first Shellbreaker Assault Rig line, with four escalating assault vehicles and a static futuristic breacher discharge munition. It explicitly avoided food-like output, speed lines, trails, directional smear, sparks shooting off, and motion blur.

### Taco Tiger Horror Evolution V2

Taco Tiger V2 is the active horror-mode slice:

- Generated chroma-key source: `source/war-machine-taco-tiger-evolution-v2-chromakey.png`
- Transparent source: `transparent/war-machine-taco-tiger-evolution-v2-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-taco-tiger-v2/`
- Static munition particle: `assets/particles/runtime/war-machine-taco-tiger-static-breacher-charge-v2.png`
- Defeat still: `runtime/defeat-stills/taco-tiger-war-machine-defeat-v2.png`
- Contact preview: `output/war-machine-taco-tiger-v2-contact.png`

The V2 prompt pushed Taco Tiger into a pure robotic Shellbreaker Assault Rig identity with no tiger face, animal head, mouth, teeth, nose, whiskers, fur, paws, organic eyes, taco, tortilla, lettuce, tomato, cheese, or food cues. It keeps the old orange/yellow/black stripe palette as metallic hazard paint, black steel, gunmetal, neon green sensors, and small red warning lights. The accepted sheet contains four clear evolution stages, one static breacher-charge munition with no motion cues, and one disabled mechanical wreck. The transparent source alpha scan found exactly six groups with 73-102px clear gutters.

The active defeat still is now `runtime/defeat-stills/taco-tiger-war-machine-defeat-v8.png`, a chunkier low-resolution combat-restyle wreck that keeps the TT-09 Shellbreaker Assault Rig as the machine husk while exposing tortilla, spiced filling, cheese, salsa, lettuce coolant, and wiring from the breached pilot cradle. Its source trail is `source/taco-tiger-war-machine-defeat-v8-chromakey.png` -> `transparent/taco-tiger-war-machine-defeat-v8-transparent.png` -> runtime `192x192`.

### Berry Bat Horror Evolution V1

Berry Bat now has a complete pure-robot horror vertical slice:

- Generated chroma-key source: `source/war-machine-berry-bat-evolution-v1-chromakey.png`
- Transparent source: `transparent/war-machine-berry-bat-evolution-v1-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-berry-bat-v1/`
- Static munition particle: `assets/particles/runtime/war-machine-berry-bat-nightwing-pulse-mine-v1.png`
- Defeat still: `runtime/defeat-stills/berry-bat-war-machine-defeat-v1.png`
- Contact preview: `output/war-machine-berry-bat-v1-contact.png`

The prompt referenced the base Nightwing Swarm Drone horror sprite and translated the line into a four-stage rotor-wing combat drone progression. It explicitly prohibited food, fruit, berries, organic bat features, and motion-coded particle effects. The source sheet scanned as exactly six groups with 44, 41, 37, 77, and 61px gutters.

The active defeat still is now `runtime/defeat-stills/berry-bat-war-machine-defeat-v5.png`, an identity-anchored combat-restyle wreck that keeps the BB-15 Nightwing Swarm Drone's twin rotor pods, bat-wing panels, central green reactor, and claw landing gear readable while exposing berry pulp, syrup, seeds, purple coolant, and wiring from the breached pilot core. Its source trail is `source/berry-bat-war-machine-defeat-v5-chromakey.png` -> `transparent/berry-bat-war-machine-defeat-v5-transparent.png` -> runtime `192x192`.

### Noodle Newt Horror Evolution V1

Noodle Newt now has a complete pure-robot horror vertical slice:

- Generated chroma-key source: `source/war-machine-noodle-newt-evolution-v1-chromakey.png`
- Transparent source: `transparent/war-machine-noodle-newt-evolution-v1-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-noodle-newt-v1/`
- Static munition particle: `assets/particles/runtime/war-machine-noodle-newt-nanite-discharge-v1.png`
- Defeat still: `runtime/defeat-stills/noodle-newt-war-machine-defeat-v1.png`
- Contact preview: `output/war-machine-noodle-newt-v1-contact.png`

The prompt referenced the base Serpent Medic Rig horror sprite and translated the line into a small crawler through heavy siege-repair rig progression. It explicitly prohibited food, noodles, ramen, bowls, and organic newt features; the visible conduit loops are treated as armored cables. The source sheet scanned as exactly six groups with 98, 58, 72, 52, and 92px gutters.

### Noodle Newt Horror Evolution V2

Noodle Newt now uses a stronger neon Serpent Medic Rig redo in horror mode:

- Generated chroma-key source: `source/war-machine-noodle-newt-evolution-v2-chromakey.png`
- Transparent source: `transparent/war-machine-noodle-newt-evolution-v2-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-noodle-newt-v2/`
- Static munition particle: `assets/particles/runtime/war-machine-noodle-newt-nanite-discharge-v2.png`
- Defeat still: `runtime/defeat-stills/noodle-newt-war-machine-defeat-v2.png`
- Contact preview: `output/war-machine-noodle-newt-v2-contact.png`

The V2 prompt keeps all four evolution forms near the same footprint and makes the improvement read through armor, surgical arms, reactor hardware, neon red/cyan/magenta/green lights, and battlefield damage rather than simple size growth. After visual review found alpha damage from the green chroma key, the transparent sheet was repaired by restoring enclosed green-dominant reactor/canister holes from the original source and suppressing only exterior semi-transparent green fringe. Grouped-mask slicing was used after visual review caught neighbor bleed in a column/component crop; final frame checks found transparent corners, zero tiny-alpha dust, zero semi-transparent green pixels, and zero nontransparent border pixels.

### Noodle Newt Horror Evolution V3

Noodle Newt now uses an image-gen corrected Serpent Medic Rig redo in horror mode:

- Generated chroma-key source: `source/war-machine-noodle-newt-evolution-v3-chromakey.png`
- Transparent source: `transparent/war-machine-noodle-newt-evolution-v3-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-noodle-newt-v3/`
- Static munition particle: `assets/particles/runtime/war-machine-noodle-newt-nanite-discharge-v3.png`
- Defeat still: `runtime/defeat-stills/noodle-newt-war-machine-defeat-v3.png`
- Contact preview: `output/war-machine-noodle-newt-v3-contact.png`
- Alpha audit: `output/war-machine-noodle-newt-v3-alpha-audit.png`

V3 was generated specifically to correct the V2 green-chroma alpha damage at the image source. The prompt preserved the six-cell Serpent Medic Rig layout, switched the removable background to flat magenta, and prohibited magenta/pink/purple subject pixels so the toxic green medic cores, canisters, smoke glow, and cross symbols stay solid opaque artwork. The magenta-key transparent sheet scanned as exactly six large groups with 39, 50, 31, 78, and 82px gutters at threshold 24. Final runtime checks found transparent corners, zero tiny-alpha dust, zero semi-transparent green pixels, zero semi-transparent magenta pixels, zero visible key-magenta pixels, and zero nontransparent border pixels.

### Pancake Penguin Horror Evolution V1

Pancake Penguin now has a metallic-palette horror vertical slice:

- Generated chroma-key source: `source/war-machine-pancake-penguin-evolution-v1-chromakey.png`
- Transparent source: `transparent/war-machine-pancake-penguin-evolution-v1-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-pancake-penguin-v1/`
- Static munition particle: `assets/particles/runtime/war-machine-pancake-penguin-aegis-charge-v1.png`
- Defeat still: `runtime/defeat-stills/pancake-penguin-war-machine-defeat-v1.png`
- Contact preview: `output/war-machine-pancake-penguin-v1-contact.png`

The prompt referenced the cozy Pancake Penguin progression and reused its cream, black, and gold palette as ceramic armor, black chassis panels, brass plating, and cyan/green sensors. It explicitly prohibited food, pancakes, butter, syrup, and organic penguin features while translating the silhouette into a Dawn Shield Walker line. The source sheet scanned as exactly six groups with 71, 71, 79, 72, and 51px gutters.

### Pretzel Python Horror Evolution V1

Pretzel Python now has a metallic-palette horror vertical slice:

- Generated chroma-key source: `source/war-machine-pretzel-python-evolution-v1-chromakey.png`
- Transparent source: `transparent/war-machine-pretzel-python-evolution-v1-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-pretzel-python-v1/`
- Static munition particle: `assets/particles/runtime/war-machine-pretzel-python-coil-charge-v1.png`
- Defeat still: `runtime/defeat-stills/pretzel-python-war-machine-defeat-v1.png`
- Contact preview: `output/war-machine-pretzel-python-v1-contact.png`

The prompt referenced the cozy Pretzel Python coiled silhouette and reused its warm bronze palette as oxidized copper armor, dark gunmetal joints, off-white armor nodes, and amber reactor light. It explicitly prohibited food, pretzels, baked dough, and organic snake features while translating the line into a Knotwire Serpent Engine. The source sheet scanned as exactly six groups with 74, 71, 71, 68, and 51px gutters.

### Popcorn Porcupine Horror Evolution V1

Popcorn Porcupine now has a metallic-palette horror vertical slice:

- Generated chroma-key source: `source/war-machine-popcorn-porcupine-evolution-v1-chromakey.png`
- Transparent source: `transparent/war-machine-popcorn-porcupine-evolution-v1-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-popcorn-porcupine-v1/`
- Static munition particle: `assets/particles/runtime/war-machine-popcorn-porcupine-shrapnel-mine-v1.png`
- Defeat still: `runtime/defeat-stills/popcorn-porcupine-war-machine-defeat-v1.png`
- Contact preview: `output/war-machine-popcorn-porcupine-v1-contact.png`

The prompt referenced the cozy Popcorn Porcupine spiked silhouette and reused its yellow, cream, and red palette as yellow-gold metal spikes, cream ceramic plates, red hazard panels, and gunmetal chassis. It explicitly prohibited food, popcorn, kernels, buckets, fur, and organic quills while translating the line into a Shrapnel Quill Battery. The source sheet scanned as exactly six groups with 49, 53, 29, 41, and 40px gutters; the tightest gap still sliced cleanly and was visually checked in the contact preview.

### Popcorn Porcupine Horror Evolution V2

Popcorn Porcupine V2 is the active horror-mode Shrapnel Quill Battery redo:

- Generated chroma-key source: `source/war-machine-popcorn-porcupine-evolution-v2-chromakey.png`
- Transparent source: `transparent/war-machine-popcorn-porcupine-evolution-v2-transparent.png`
- Runtime four-form sprites and manifest: `runtime/war-machine-popcorn-porcupine-v2/`
- Static neon shrapnel munition particle: `assets/particles/runtime/war-machine-popcorn-porcupine-neon-shrapnel-mine-v2.png`
- Defeat still: `runtime/defeat-stills/popcorn-porcupine-war-machine-defeat-v2.png`
- Contact preview: `output/war-machine-popcorn-porcupine-v2-contact.png`

V2 pushes the line into a darker future-war pure robot identity with stronger cyan neon, black gunmetal, scratched off-white armor, red hazard plates, and yellow-gold munition tips. The four forms stay in the same runtime footprint while the upgrade path reads through increased firepower: more cannons, stabilizers, missile-quill racks, turret hardware, railgun rails, and reactor ports. The attack particle is a static munition with no motion trails; a cleanup pass removed one stray particle speck after grouped slicing.

### Six-Line Metallic Horror Evolution Batch

Yogurt Yeti, Bagel Beaver, Bao Bun Badger, Donut Dodo, Kimchi Chameleon, and Waffle Walrus now have horror-mode robot evolution slices:

- Yogurt Yeti V2: `source/war-machine-yogurt-yeti-evolution-v2-chromakey.png`, `transparent/war-machine-yogurt-yeti-evolution-v2-transparent.png`, `runtime/war-machine-yogurt-yeti-v2/`, `assets/particles/runtime/war-machine-yogurt-yeti-cryo-capacitor-v2.png`, `runtime/defeat-stills/yogurt-yeti-war-machine-defeat-v2.png`, `output/war-machine-yogurt-yeti-v2-contact.png`
- Bagel Beaver V2: `source/war-machine-bagel-beaver-evolution-v2-chromakey.png`, `transparent/war-machine-bagel-beaver-evolution-v2-transparent.png`, `runtime/war-machine-bagel-beaver-v2/`, `assets/particles/runtime/war-machine-bagel-beaver-rivet-mine-v2.png`, `runtime/defeat-stills/bagel-beaver-war-machine-defeat-v2.png`, `output/war-machine-bagel-beaver-v2-contact.png`
- Bao Bun Badger V1: `source/war-machine-bao-bun-badger-evolution-v1-chromakey.png`, `transparent/war-machine-bao-bun-badger-evolution-v1-transparent.png`, `runtime/war-machine-bao-bun-badger-v1/`, `assets/particles/runtime/war-machine-bao-bun-badger-pressure-mine-v1.png`, `runtime/defeat-stills/bao-bun-badger-war-machine-defeat-v1.png`, `output/war-machine-bao-bun-badger-v1-contact.png`
- Donut Dodo V2: `source/war-machine-donut-dodo-evolution-v2-chromakey.png`, `transparent/war-machine-donut-dodo-evolution-v2-transparent.png`, `runtime/war-machine-donut-dodo-v2/`, `assets/particles/runtime/war-machine-donut-dodo-scrap-charge-v2.png`, `runtime/defeat-stills/donut-dodo-war-machine-defeat-v2.png`, `output/war-machine-donut-dodo-v2-contact.png`
- Kimchi Chameleon V1: `source/war-machine-kimchi-chameleon-evolution-v1-chromakey.png`, `transparent/war-machine-kimchi-chameleon-evolution-v1-transparent.png`, `runtime/war-machine-kimchi-chameleon-v1/`, `assets/particles/runtime/war-machine-kimchi-chameleon-camo-mine-v1.png`, `runtime/defeat-stills/kimchi-chameleon-war-machine-defeat-v1.png`, `output/war-machine-kimchi-chameleon-v1-contact.png`
- Waffle Walrus V2: `source/war-machine-waffle-walrus-evolution-v2-chromakey.png`, `transparent/war-machine-waffle-walrus-evolution-v2-transparent.png`, `runtime/war-machine-waffle-walrus-v2/`, `assets/particles/runtime/war-machine-waffle-walrus-lattice-charge-v2.png`, `runtime/defeat-stills/waffle-walrus-war-machine-defeat-v2.png`, `output/war-machine-waffle-walrus-v2-contact.png`
- Waffle Walrus V3: `source/war-machine-waffle-walrus-evolution-v3-chromakey.png`, `transparent/war-machine-waffle-walrus-evolution-v3-transparent.png`, `runtime/war-machine-waffle-walrus-v3/`, `assets/particles/runtime/war-machine-waffle-walrus-lattice-charge-v3.png`, `runtime/defeat-stills/waffle-walrus-war-machine-defeat-v3.png`, `output/war-machine-waffle-walrus-v3-contact.png`

The prompts reused each reference palette as metallic materials while prohibiting food and organic animal features. Yogurt, Bagel, Donut, and Waffle required regeneration because their first sheets merged adjacent evolution forms during alpha grouping; the active v2 sheets scanned as six clean groups. Bao and Kimchi passed on their first sheets. All particles are static munition/discharge objects rather than motion trails.

### Equal-Footprint Horror Evolution Batch V1

Pepper Prawn, Hot Chip Hamster, Benedict Lobster, Curry Crab, Churro Cheetah, Granola Goat, Breakfast Burrito Boar, Caesar Salamander, Cucumber Cobra, and Avocado Axolotl now have horror-mode robot evolution slices:

- Pepper Prawn V1: `source/war-machine-pepper-prawn-evolution-v1-chromakey.png`, `transparent/war-machine-pepper-prawn-evolution-v1-transparent.png`, `runtime/war-machine-pepper-prawn-v1/`, `assets/particles/runtime/war-machine-pepper-prawn-thermal-torpedo-cell-v1.png`, `runtime/defeat-stills/pepper-prawn-war-machine-defeat-v1.png`
- Hot Chip Hamster V1: `source/war-machine-hot-chip-hamster-evolution-v1-chromakey.png`, `transparent/war-machine-hot-chip-hamster-evolution-v1-transparent.png`, `runtime/war-machine-hot-chip-hamster-v1/`, `assets/particles/runtime/war-machine-hot-chip-hamster-static-thermal-charge-v1.png`, `runtime/defeat-stills/hot-chip-hamster-war-machine-defeat-v1.png`
- Hot Chip Hamster V2: `source/war-machine-hot-chip-hamster-evolution-v2-chromakey.png`, `transparent/war-machine-hot-chip-hamster-evolution-v2-transparent.png`, `runtime/war-machine-hot-chip-hamster-v2/`, `assets/particles/runtime/war-machine-hot-chip-hamster-static-thermal-charge-v2.png`, `runtime/defeat-stills/hot-chip-hamster-war-machine-defeat-v2.png`
- Hot Chip Hamster V3: `source/war-machine-hot-chip-hamster-evolution-v3-chromakey.png`, `transparent/war-machine-hot-chip-hamster-evolution-v3-transparent.png`, `runtime/war-machine-hot-chip-hamster-v3/`, `assets/particles/runtime/war-machine-hot-chip-hamster-static-thermal-charge-v3.png`, `runtime/defeat-stills/hot-chip-hamster-war-machine-defeat-v3.png`
- Benedict Lobster V1: `source/war-machine-benedict-lobster-evolution-v1-chromakey.png`, `transparent/war-machine-benedict-lobster-evolution-v1-transparent.png`, `runtime/war-machine-benedict-lobster-v1/`, `assets/particles/runtime/war-machine-benedict-lobster-claw-charge-pod-v1.png`, `runtime/defeat-stills/benedict-lobster-war-machine-defeat-v1.png`
- Curry Crab V1: `source/war-machine-curry-crab-evolution-v1-chromakey.png`, `transparent/war-machine-curry-crab-evolution-v1-transparent.png`, `runtime/war-machine-curry-crab-v1/`, `assets/particles/runtime/war-machine-curry-crab-thermal-core-mine-v1.png`, `runtime/defeat-stills/curry-crab-war-machine-defeat-v1.png`
- Churro Cheetah V1: `source/war-machine-churro-cheetah-evolution-v1-chromakey.png`, `transparent/war-machine-churro-cheetah-evolution-v1-transparent.png`, `runtime/war-machine-churro-cheetah-v1/`, `assets/particles/runtime/war-machine-churro-cheetah-thermal-spike-core-v1.png`, `runtime/defeat-stills/churro-cheetah-war-machine-defeat-v1.png`
- Churro Cheetah V2: `source/war-machine-churro-cheetah-evolution-v2-chromakey.png`, `transparent/war-machine-churro-cheetah-evolution-v2-transparent.png`, `runtime/war-machine-churro-cheetah-v2/`, `assets/particles/runtime/war-machine-churro-cheetah-thermal-spike-core-v2.png`, `runtime/defeat-stills/churro-cheetah-war-machine-defeat-v2.png`
- Granola Goat V1: `source/war-machine-granola-goat-evolution-v1-chromakey.png`, `transparent/war-machine-granola-goat-evolution-v1-transparent.png`, `runtime/war-machine-granola-goat-v1/`, `assets/particles/runtime/war-machine-granola-goat-seed-armor-mine-v1.png`, `runtime/defeat-stills/granola-goat-war-machine-defeat-v1.png`
- Breakfast Burrito Boar V1: `source/war-machine-breakfast-burrito-boar-evolution-v1-chromakey.png`, `transparent/war-machine-breakfast-burrito-boar-evolution-v1-transparent.png`, `runtime/war-machine-breakfast-burrito-boar-v1/`, `assets/particles/runtime/war-machine-breakfast-burrito-boar-static-tusk-mine-v1.png`, `runtime/defeat-stills/breakfast-burrito-boar-war-machine-defeat-v1.png`
- Caesar Salamander V1: `source/war-machine-caesar-salamander-evolution-v1-chromakey.png`, `transparent/war-machine-caesar-salamander-evolution-v1-transparent.png`, `runtime/war-machine-caesar-salamander-v1/`, `assets/particles/runtime/war-machine-caesar-salamander-repair-capacitor-v1.png`, `runtime/defeat-stills/caesar-salamander-war-machine-defeat-v1.png`
- Cucumber Cobra V1: `source/war-machine-cucumber-cobra-evolution-v1-chromakey.png`, `transparent/war-machine-cucumber-cobra-evolution-v1-transparent.png`, `runtime/war-machine-cucumber-cobra-v1/`, `assets/particles/runtime/war-machine-cucumber-cobra-snare-signal-capacitor-v1.png`, `runtime/defeat-stills/cucumber-cobra-war-machine-defeat-v1.png`
- Avocado Axolotl V1: `source/war-machine-avocado-axolotl-evolution-v1-chromakey.png`, `transparent/war-machine-avocado-axolotl-evolution-v1-transparent.png`, `runtime/war-machine-avocado-axolotl-v1/`, `assets/particles/runtime/war-machine-avocado-axolotl-green-core-capacitor-v1.png`, `runtime/defeat-stills/avocado-axolotl-war-machine-defeat-v1.png`

This pass used the original game evolution sheets as pose, silhouette, palette, and form-order references, then converted each line into pure mechanical future-war robots. Forms are kept near the final-form footprint, while progression is shown through added armor, weapons, sensors, reactors, command hardware, and silhouette equipment. Benedict Lobster and Curry Crab were regenerated after visual review so all forms face the same left/southwest direction as the game art. All fifth-cell particles are static munition or discharge objects, not motion trails. Alpha validation found six large components per sheet; the tightest accepted clear gutter was 18px on Breakfast Burrito Boar, with the corrected Benedict, Curry, and Granola sheets measuring 32px, 31px, and 54px minimum gutters. Contact previews live at `output/<packageId>-contact.png`, with a batch montage at `tmp/war-machine-next10-contact-montage.jpg`.

### Horror Defeat Combat-Restyle Food-Pilot Spill Batch

The full food-animal horror cast was regenerated as high-detail breached war-machine wrecks. The current non-defeat horror combat stills are the primary style, scale, detail, and identity references; the horror field manuals are secondary pilot/lore references. Each active still keeps the outer husk as a damaged mechanical war-machine, not an animal body, while the cozy food animal appears as the wired-in pilot spilling out as lumpy food-animal mass with readable animal pieces, liquids, wires, coolant, and damage. The first chroma-key pass used `source/horror-defeat-combat-restyle-sheet-01-chromakey.png` through `source/horror-defeat-combat-restyle-sheet-11-chromakey.png`; the stronger hull-dominant tuning pass used `source/horror-defeat-fullset-tuned-sheet-01-chromakey.png` through `source/horror-defeat-fullset-tuned-sheet-09-chromakey.png`. Each individual still also has a source trail of `source/<slug>-war-machine-defeat-vN-chromakey.png` or sheet source -> `transparent/...` -> runtime `192x192`. Review boards include `output/horror-defeat-combat-restyle-final-contact.png` and `output/horror-defeat-fullset-tuned-final-contact.png`.

The active runtime stills from this combat-restyle batch are `toast-tortoise-war-machine-defeat-v9.png`, `sushi-seal-war-machine-defeat-v6.png`, `taco-tiger-war-machine-defeat-v8.png`, `berry-bat-war-machine-defeat-v5.png`, `noodle-newt-war-machine-defeat-v9.png`, `pancake-penguin-war-machine-defeat-v5.png`, `pretzel-python-war-machine-defeat-v5.png`, `popcorn-porcupine-war-machine-defeat-v6.png`, `yogurt-yeti-war-machine-defeat-v6.png`, `bagel-beaver-war-machine-defeat-v7.png`, `bao-bun-badger-war-machine-defeat-v5.png`, `donut-dodo-war-machine-defeat-v7.png`, `kimchi-chameleon-war-machine-defeat-v5.png`, `waffle-walrus-war-machine-defeat-v7.png`, `dumpling-armadillo-war-machine-defeat-v8.png`, `lemon-meringue-lynx-war-machine-defeat-v7.png`, `shakshuka-shark-war-machine-defeat-v8.png`, `saltwater-taffy-otter-war-machine-defeat-v7.png`, `croissant-kraken-war-machine-defeat-v8.png`, `fortune-cookie-fox-war-machine-defeat-v7.png`, `mochi-mammoth-war-machine-defeat-v8.png`, `gingerbread-golem-war-machine-defeat-v7.png`, `boba-basilisk-war-machine-defeat-v9.png`, `iceberg-oyster-war-machine-defeat-v8.png`, `herb-hare-war-machine-defeat-v6.png`, `green-juice-goose-war-machine-defeat-v7.png`, `caprese-capybara-war-machine-defeat-v5.png`, `vinaigrette-viper-war-machine-defeat-v5.png`, `kelp-koala-war-machine-defeat-v6.png`, `melon-mint-mantis-war-machine-defeat-v5.png`, `coconut-shrimp-sheep-war-machine-defeat-v5.png`, `crab-cake-caterpillar-war-machine-defeat-v5.png`, `pico-de-gallo-gecko-war-machine-defeat-v5.png`, `pepper-prawn-war-machine-defeat-v6.png`, `hot-chip-hamster-war-machine-defeat-v7.png`, `benedict-lobster-war-machine-defeat-v9.png`, `curry-crab-war-machine-defeat-v5.png`, `churro-cheetah-war-machine-defeat-v6.png`, `granola-goat-war-machine-defeat-v5.png`, `breakfast-burrito-boar-war-machine-defeat-v6.png`, `caesar-salamander-war-machine-defeat-v6.png`, `cucumber-cobra-war-machine-defeat-v9.png`, `avocado-axolotl-war-machine-defeat-v6.png`, and `banana-split-giraffe-boss-war-machine-defeat-v7.png`.

Benedict Lobster and Cucumber Cobra now use targeted image-reference regenerations for their active wrecks: `benedict-lobster-war-machine-defeat-v9.png` and `cucumber-cobra-war-machine-defeat-v9.png`. Benedict's identity-anchored pass keeps the live MK4 Brunchbreaker Siege Rig's cyan central core, red-orange claw arms, tall back spires, rounded shell body, and side siege pods readable while pushing eggs Benedict, hollandaise, lobster chunks, coolant, and wiring out through damaged machinery. Its source trail is `source/benedict-lobster-war-machine-defeat-v9-chromakey.png` -> `transparent/benedict-lobster-war-machine-defeat-v9-transparent.png` -> runtime `192x192`; Cucumber Cobra's lower-detail Garden Coil Hydra pass keeps the tall green spine, raised side coil heads, lower cannon clusters, and base claws readable while matching the non-defeat sprite's chunkier resolution. Its source trail is `source/cucumber-cobra-war-machine-defeat-v9-chromakey.png` -> `transparent/cucumber-cobra-war-machine-defeat-v9-transparent.png` -> runtime `192x192`.

Banana Split Giraffe is a mid-boss exception to the normal `192x192` runtime defeat still target. The live boss is rendered larger in combat (`battleSpriteScale: 1.7`, `defeatStillScale: 1.3`), so the `v6` still's `146x124` visible pixel bounds looked grainy after scaling. The active `banana-split-giraffe-boss-war-machine-defeat-v7.png` is a `384x384` runtime still with roughly `300x255` visible pixels, built from the tuned fullset sheet so the holograph-projector war-machine identity holds at boss scale. In combat, the giraffe defeat still uses the live boss base anchor so the wreck rests on the same right-center plate as the cozy and horror combat forms.

Follow-up tuning sheet `source/horror-defeat-tuning-boba-pico-caesar-noodle-sheet-01-chromakey.png` tightened the prompt around four identity failures: Boba Basilisk, Pico de Gallo Gecko, Caesar Salamander, and Noodle Newt. The useful prompt adjustment was to make the live MK4 war-machine hull 80-90% of the readable silhouette and keep the food-pilot spill secondary, only emerging from cockpit breaches. The processed runtime candidates are `boba-basilisk-war-machine-defeat-v9.png`, `pico-de-gallo-gecko-war-machine-defeat-v5.png`, `caesar-salamander-war-machine-defeat-v6.png`, and `noodle-newt-war-machine-defeat-v8.png`; review contact sheet: `output/horror-defeat-tuning-batch-01-runtime-contact.png`.

Lower-detail identity pass `source/cucumber-cobra-war-machine-defeat-v9-chromakey.png`, `source/green-juice-goose-war-machine-defeat-v7-chromakey.png`, `source/noodle-newt-war-machine-defeat-v9-chromakey.png`, and `source/pepper-prawn-war-machine-defeat-v6-chromakey.png` retuned Garden Coil Hydra, Garden Volley Gunship, Serpent Medic Rig, and Thermal Lance Drone to match the non-defeat stills' chunkier apparent resolution. The active runtime outputs are `cucumber-cobra-war-machine-defeat-v9.png`, `green-juice-goose-war-machine-defeat-v7.png`, `noodle-newt-war-machine-defeat-v9.png`, and `pepper-prawn-war-machine-defeat-v6.png`, with transparent intermediates at matching `transparent/*-transparent.png` paths and runtime `192x192` outputs.

The cyber brain final boss and brainstem wire minions remain special non-food horror entities; they do not have cozy food-pilot counterparts and were left on their existing defeat stills.

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

## Green Juice Goose V1

Green Juice Goose was added as a Breakfast/Fresh gap-filler using a flat `#ff00ff` source-reference sheet. The chroma-key source lives at `source/green-juice-goose-evolution-v1-chromakey.png`, the cleaned alpha sheet lives at `transparent/green-juice-goose-evolution-v1-transparent.png`, and four grouped-sliced runtime idle frames plus the preview sheet live under `runtime/green-juice-goose-v1/`.

The presentable meal still is intentionally a brunch plate, not a defeated character: source `source/green-juice-goose-meal-v1-preview.png`, cleaned alpha `transparent/green-juice-goose-meal-v1-transparent.png`, runtime `runtime/defeat-stills/green-juice-goose-defeat-food-v1.png`.

## Level 10 Boss Concept V1

Banana Split Giraffe was added as a cozy level 10 boss concept. The food identity uses a banana split dessert: banana body and neck, chocolate-sauce giraffe spots, whipped-cream ossicones, cherry crown, wafer accents, ice cream scoops, caramel glaze, and sprinkle pixels. The source is `source/banana-split-giraffe-boss-v1-chromakey.png`, the transparent source is `transparent/banana-split-giraffe-boss-v1-transparent.png`, and the single 192x192 runtime sticker lives under `runtime/banana-split-giraffe-boss-v1/`.

## Level 10 Boss Future-War Variant V1

Banana Split Giraffe now has a dark robot future-war variant: Holograph Projector Giraffe. The boss keeps the tall giraffe silhouette but converts it into a pure mechanical war machine with a holograph-projector head, neon cyan/magenta scan glow, gunmetal armor, battle damage, and a camera module on the tail. The generated three-cell source includes the 192x192 idle boss, a disabled wreck defeat still, and a static 96x96 holograph-camera pulse particle. The source is `source/war-machine-banana-split-giraffe-boss-v1-chromakey.png`, the transparent source is `transparent/war-machine-banana-split-giraffe-boss-v1-transparent.png`, the runtime frame lives under `runtime/war-machine-banana-split-giraffe-boss-v1/`, the particle is `../particles/runtime/war-machine-banana-split-giraffe-boss-holograph-camera-pulse-core-v1.png`, and the defeat still is `runtime/defeat-stills/banana-split-giraffe-boss-war-machine-defeat-v1.png`.

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

## Ten-Line Metallic Horror Evolution Batch

Horror mode now has ten more future-war unit override packages. Each package was generated as a six-group sheet: four mechanical evolution stages, one static munition/discharge particle, and one disabled wreck defeat state. The sheets use flat chroma-key backgrounds, alpha cleanup, `192x192` runtime frames, `96x96` particles, and contact previews for review.

- Dumpling Armadillo -> Steam-Bastion Dozer: `source/war-machine-dumpling-armadillo-evolution-v1-chromakey.png`, `transparent/war-machine-dumpling-armadillo-evolution-v1-transparent.png`, `runtime/war-machine-dumpling-armadillo-v1/`, particle `../particles/runtime/war-machine-dumpling-armadillo-pressure-canister-v1.png`, defeat `runtime/defeat-stills/dumpling-armadillo-war-machine-defeat-v1.png`, preview `../../output/war-machine-dumpling-armadillo-v1-contact.png`
- Lemon Meringue Lynx -> Acid Cleanser Stalker: `source/war-machine-lemon-meringue-lynx-evolution-v1-chromakey.png`, `transparent/war-machine-lemon-meringue-lynx-evolution-v1-transparent.png`, `runtime/war-machine-lemon-meringue-lynx-v1/`, particle `../particles/runtime/war-machine-lemon-meringue-lynx-acid-cleanse-charge-v1.png`, defeat `runtime/defeat-stills/lemon-meringue-lynx-war-machine-defeat-v1.png`, preview `../../output/war-machine-lemon-meringue-lynx-v1-contact.png`
- Shakshuka Shark -> Thermal Megalodon Subtank: `source/war-machine-shakshuka-shark-evolution-v1-chromakey.png`, `transparent/war-machine-shakshuka-shark-evolution-v1-transparent.png`, `runtime/war-machine-shakshuka-shark-v1/`, particle `../particles/runtime/war-machine-shakshuka-shark-thermal-brine-charge-v1.png`, defeat `runtime/defeat-stills/shakshuka-shark-war-machine-defeat-v1.png`, preview `../../output/war-machine-shakshuka-shark-v1-contact.png`
- Saltwater Taffy Otter -> Tide Bind Strider: `source/war-machine-saltwater-taffy-otter-evolution-v1-chromakey.png`, `transparent/war-machine-saltwater-taffy-otter-evolution-v1-transparent.png`, `runtime/war-machine-saltwater-taffy-otter-v1/`, particle `../particles/runtime/war-machine-saltwater-taffy-otter-bind-snare-v1.png`, defeat `runtime/defeat-stills/saltwater-taffy-otter-war-machine-defeat-v1.png`, preview `../../output/war-machine-saltwater-taffy-otter-v1-contact.png`
- Croissant Kraken -> Layered Leviathan Rig: `source/war-machine-croissant-kraken-evolution-v2-chromakey.png`, `transparent/war-machine-croissant-kraken-evolution-v2-transparent.png`, `runtime/war-machine-croissant-kraken-v2/`, particle `../particles/runtime/war-machine-croissant-kraken-crescent-clamp-v2.png`, defeat `runtime/defeat-stills/croissant-kraken-war-machine-defeat-v2.png`, preview `../../output/war-machine-croissant-kraken-v2-contact.png`
- Fortune Cookie Fox -> Oracle Chance Engine: `source/war-machine-fortune-cookie-fox-evolution-v2-chromakey.png`, `transparent/war-machine-fortune-cookie-fox-evolution-v2-transparent.png`, `runtime/war-machine-fortune-cookie-fox-v2/`, particle `../particles/runtime/war-machine-fortune-cookie-fox-oracle-core-v2.png`, defeat `runtime/defeat-stills/fortune-cookie-fox-war-machine-defeat-v2.png`, preview `../../output/war-machine-fortune-cookie-fox-v2-contact.png`
- Mochi Mammoth -> Festival Colossus Walker: `source/war-machine-mochi-mammoth-evolution-v2-chromakey.png`, `transparent/war-machine-mochi-mammoth-evolution-v2-transparent.png`, `runtime/war-machine-mochi-mammoth-v2/`, particle `../particles/runtime/war-machine-mochi-mammoth-prism-shield-core-v2.png`, defeat `runtime/defeat-stills/mochi-mammoth-war-machine-defeat-v2.png`, preview `../../output/war-machine-mochi-mammoth-v2-contact.png`
- Mochi Mammoth -> Festival Colossus Walker V4: `source/war-machine-mochi-mammoth-evolution-v4-chromakey.png`, `transparent/war-machine-mochi-mammoth-evolution-v4-transparent.png`, `runtime/war-machine-mochi-mammoth-v4/`, particle `../particles/runtime/war-machine-mochi-mammoth-prism-shield-core-v4.png`, defeat `runtime/defeat-stills/mochi-mammoth-war-machine-defeat-v4.png`, preview `../../output/war-machine-mochi-mammoth-v4-contact.png`
- Gingerbread Golem -> Citadel Decoy Guardian: `source/war-machine-gingerbread-golem-evolution-v1-chromakey.png`, `transparent/war-machine-gingerbread-golem-evolution-v1-transparent.png`, `runtime/war-machine-gingerbread-golem-v1/`, particle `../particles/runtime/war-machine-gingerbread-golem-decoy-core-v1.png`, defeat `runtime/defeat-stills/gingerbread-golem-war-machine-defeat-v1.png`, preview `../../output/war-machine-gingerbread-golem-v1-contact.png`
- Boba Basilisk -> Pearl Gorgon Artillery: `source/war-machine-boba-basilisk-evolution-v1-chromakey.png`, `transparent/war-machine-boba-basilisk-evolution-v1-transparent.png`, `runtime/war-machine-boba-basilisk-v1/`, particle `../particles/runtime/war-machine-boba-basilisk-pearl-stun-mine-v1.png`, defeat `runtime/defeat-stills/boba-basilisk-war-machine-defeat-v1.png`, preview `../../output/war-machine-boba-basilisk-v1-contact.png`
- Iceberg Oyster -> Abyssal Lock Core: `source/war-machine-iceberg-oyster-evolution-v1-chromakey.png`, `transparent/war-machine-iceberg-oyster-evolution-v1-transparent.png`, `runtime/war-machine-iceberg-oyster-v1/`, particle `../particles/runtime/war-machine-iceberg-oyster-abyssal-lock-mine-v1.png`, defeat `runtime/defeat-stills/iceberg-oyster-war-machine-defeat-v1.png`, preview `../../output/war-machine-iceberg-oyster-v1-contact.png`

Croissant Kraken, Fortune Cookie Fox, and Mochi Mammoth use V2 because their V1 sheets did not leave enough separation between the particle and defeat groups for clean slicing. The active V2 sheets each pass the six-group alpha check.

The mk1 runtime frames for all ten lines were later resliced larger from the same transparent sheets so first forms retain more visible detail in the War Manifest and shop cards. `game.js` requests those revised mk1 frames with `?v=2`; later evolution stages, particles, and defeat wrecks are unchanged.

The active game now uses the V3 regeneration for all ten lines. V3 uses the same identities as the earlier pass but keeps forms 1-4 at roughly the same runtime footprint and detail density; evolution is shown through added armor, weapons, reactors, and command modules instead of large size changes. Active paths are `source/war-machine-*-evolution-v3-chromakey.png`, `transparent/war-machine-*-evolution-v3-transparent.png`, `runtime/war-machine-*-v3/`, `../particles/runtime/war-machine-*-v3.png`, and `runtime/defeat-stills/*-war-machine-defeat-v3.png`. The V3 review board is `../../output/war-machine-ten-line-v3-contact-overview.png`.

Abyssal Lock Core now uses a targeted V4 regeneration because the previous Iceberg Oyster horror pass was too tame. V4 pushes the line into a darker pure-robot future-war identity with heavier neon cyan/teal/magenta lighting, black steel, red targeting lights, and a clearer form-by-form firepower progression. The source is `source/war-machine-iceberg-oyster-evolution-v4-chromakey.png`, the transparent sheet is `transparent/war-machine-iceberg-oyster-evolution-v4-transparent.png`, the runtime frames and manifest are in `runtime/war-machine-iceberg-oyster-v4/`, the static munition is `../particles/runtime/war-machine-iceberg-oyster-abyssal-lock-mine-v4.png`, the wreck is `runtime/defeat-stills/iceberg-oyster-war-machine-defeat-v4.png`, and the review preview is `../../output/war-machine-iceberg-oyster-v4-contact.png`.

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
- Caprese Capybara V2 targeted tier 3-4 replacement: `source/caprese-capybara-basil-harbour-v2-chromakey.png`, `transparent/caprese-capybara-basil-harbour-v2-transparent.png`, `runtime/caprese-capybara-v2/`
- Vinaigrette Viper: `source/vinaigrette-viper-evolution-v1-chromakey.png`, `transparent/vinaigrette-viper-evolution-v1-transparent.png`, `runtime/vinaigrette-viper-v1/`

These are static `source-reference-pass` idle sprites generated with built-in image generation, converted to alpha with `remove_chroma_key.py`, then sliced in grouped mode into transparent `192x192` runtime PNGs. They are not production-ready animation packages.
