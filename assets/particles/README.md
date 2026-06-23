# Attack Particle Asset Pipeline

Current status: `v1-runtime`.

The active attack particle board was generated with the built-in image generation tool as HD pixel-art food projectiles on a flat `#ff00ff` chroma-key background.

- Source chroma-key sheet: `source/food-attack-particles-v1-chromakey.png`
- Transparent source sheet: `transparent/food-attack-particles-v1-transparent.png`
- Runtime frames:
  - `runtime/food-attack-particle_toast_shard_idle_SW_00.png`
  - `runtime/food-attack-particle_sushi_bite_idle_SW_00.png`
  - `runtime/food-attack-particle_taco_chip_idle_SW_00.png`
  - `runtime/food-attack-particle_grape_cluster_idle_SW_00.png`
  - `runtime/food-attack-particle_noodle_toss_idle_SW_00.png`

The runtime mapping in `game.js` is:

- Toast Tortoise throws a toast shard with a butter glint.
- Sushi Seal throws a sushi rice-and-salmon bite.
- Taco Tiger throws a taco-shell projectile with lettuce and tomato pixels.
- Berry Bat throws a purple grape cluster.
- Noodle Newt throws a noodle toss with broth/herb flecks.
- Pancake Penguin throws a syrup-glazed pancake bite with a butter sparkle.
- Pretzel Python throws a salted pretzel twist.
- Curry Crab throws a spicy curry claw splash.
- Popcorn Porcupine throws a buttered popcorn kernel burst.
- Yogurt Yeti throws a frosty yogurt splash with berry bits.
- Donut Dodo throws a glazed donut spin.
- Kimchi Chameleon throws a spicy kimchi chili splash.
- Waffle Walrus throws a sticky waffle shard.
- Dumpling Armadillo throws a steamed dumpling puff.
- Lemon Meringue Lynx throws a citrus meringue spark.
- Croissant Kraken throws a croissant crescent with tentacle wisps.
- Fortune Cookie Fox throws a fortune cookie shard.
- Mochi Mammoth throws a soft mochi powder puff.
- Gingerbread Golem throws gingerbread crumble.
- Boba Basilisk throws a boba pearl burst.
- Pepper Prawn throws a static chili-prawn claw chip.
- Bagel Beaver throws a static bagel-dam bite.
- Shakshuka Shark throws a static shakshuka sauce-and-egg bite.
- Iceberg Oyster throws a static chilled oyster ice-pearl garnish.
- Hot Chip Hamster throws a static spicy tortilla chip.
- Benedict Lobster throws a static eggs benedict lobster bite.
- Bao Bun Badger throws a static bao basket bite.
- Saltwater Taffy Otter throws a static wrapped saltwater taffy candy.
- Churro Cheetah throws a static churro curl with dip.
- Granola Goat throws a static granola cluster.
- Breakfast Burrito Boar throws a static breakfast burrito bite.
- Caesar Salamander throws a static Caesar salad bite.
- Cucumber Cobra throws a static cucumber ribbon coil.
- Avocado Axolotl throws a static avocado wedge with pit.
- Herb Hare throws a static herbed focaccia bite.
- Caprese Capybara throws a static caprese skewer bite.
- Vinaigrette Viper throws a static vinaigrette dressing droplet.

Packaging commands:

```powershell
python C:\Users\Will\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py `
  --input assets\particles\source\food-attack-particles-v1-chromakey.png `
  --out assets\particles\transparent\food-attack-particles-v1-transparent.png `
  --auto-key border `
  --soft-matte `
  --transparent-threshold 12 `
  --opaque-threshold 220 `
  --despill

python tools\slice_transparent_sprite_sheet.py `
  --input assets\particles\transparent\food-attack-particles-v1-transparent.png `
  --out-dir assets\particles\runtime `
  --names toast_shard sushi_bite taco_chip grape_cluster noodle_toss `
  --prefix food-attack-particle `
  --size 96 `
  --mode columns `
  --padding-ratio 0.18
```

## Uncommon Attack Particles V1

- Source chroma-key sheet: `source/food-attack-particles-uncommon-v1-chromakey.png`
- Transparent source sheet: `transparent/food-attack-particles-uncommon-v1-transparent.png`
- Runtime frames:
  - `runtime/food-attack-particle-uncommon_pancake_syrup_bite_idle_SW_00.png`
  - `runtime/food-attack-particle-uncommon_pretzel_twist_idle_SW_00.png`
  - `runtime/food-attack-particle-uncommon_curry_claw_splash_idle_SW_00.png`

Packaging command:

```powershell
python C:\Users\Will\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py `
  --input assets\particles\source\food-attack-particles-uncommon-v1-chromakey.png `
  --out assets\particles\transparent\food-attack-particles-uncommon-v1-transparent.png `
  --auto-key border `
  --soft-matte `
  --transparent-threshold 12 `
  --opaque-threshold 220 `
  --despill

python tools\slice_transparent_sprite_sheet.py `
  --input assets\particles\transparent\food-attack-particles-uncommon-v1-transparent.png `
  --out-dir assets\particles\runtime `
  --names pancake_syrup_bite pretzel_twist curry_claw_splash `
  --prefix food-attack-particle-uncommon `
  --size 96 `
  --mode columns `
  --padding-ratio 0.18
```

## Missing Roster Attack Particles V1

The remaining animal attack particles were generated as two six-projectile sheets so all 20 food-animal lines have runtime projectile art.

- Uncommon/Rare source chroma-key sheet: `source/food-attack-particles-missing-uncommon-rare-v1-chromakey.png`
- Uncommon/Rare transparent source sheet: `transparent/food-attack-particles-missing-uncommon-rare-v1-transparent.png`
- Epic source chroma-key sheet: `source/food-attack-particles-missing-epic-v1-chromakey.png`
- Epic transparent source sheet: `transparent/food-attack-particles-missing-epic-v1-transparent.png`
- Runtime frames:
  - `runtime/food-attack-particle-missing_popcorn_kernel_burst_idle_SW_00.png`
  - `runtime/food-attack-particle-missing_yogurt_frost_splash_idle_SW_00.png`
  - `runtime/food-attack-particle-missing_donut_glaze_spin_idle_SW_00.png`
  - `runtime/food-attack-particle-missing_kimchi_chili_splash_idle_SW_00.png`
  - `runtime/food-attack-particle-missing_waffle_syrup_shard_idle_SW_00.png`
  - `runtime/food-attack-particle-missing_dumpling_steam_puff_idle_SW_00.png`
  - `runtime/food-attack-particle-missing_lemon_meringue_spark_idle_SW_00.png`
  - `runtime/food-attack-particle-missing_croissant_tentacle_crescent_idle_SW_00.png`
  - `runtime/food-attack-particle-missing_fortune_cookie_shard_idle_SW_00.png`
  - `runtime/food-attack-particle-missing_mochi_puff_idle_SW_00.png`
  - `runtime/food-attack-particle-missing_gingerbread_crumble_idle_SW_00.png`
  - `runtime/food-attack-particle-missing_boba_pearl_burst_idle_SW_00.png`

Packaging commands:

```powershell
python C:\Users\Will\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py `
  --input assets\particles\source\food-attack-particles-missing-uncommon-rare-v1-chromakey.png `
  --out assets\particles\transparent\food-attack-particles-missing-uncommon-rare-v1-transparent.png `
  --auto-key border `
  --soft-matte `
  --transparent-threshold 12 `
  --opaque-threshold 220 `
  --despill

python C:\Users\Will\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py `
  --input assets\particles\source\food-attack-particles-missing-epic-v1-chromakey.png `
  --out assets\particles\transparent\food-attack-particles-missing-epic-v1-transparent.png `
  --auto-key border `
  --soft-matte `
  --transparent-threshold 12 `
  --opaque-threshold 220 `
  --despill

python tools\slice_transparent_sprite_sheet.py `
  --input assets\particles\transparent\food-attack-particles-missing-uncommon-rare-v1-transparent.png `
  --out-dir assets\particles\runtime `
  --names popcorn_kernel_burst yogurt_frost_splash donut_glaze_spin kimchi_chili_splash waffle_syrup_shard dumpling_steam_puff `
  --prefix food-attack-particle-missing `
  --size 96 `
  --mode columns

python tools\slice_transparent_sprite_sheet.py `
  --input assets\particles\transparent\food-attack-particles-missing-epic-v1-transparent.png `
  --out-dir assets\particles\runtime `
  --names lemon_meringue_spark croissant_tentacle_crescent fortune_cookie_shard mochi_puff gingerbread_crumble boba_pearl_burst `
  --prefix food-attack-particle-missing `
  --size 96 `
  --mode columns
```

## Expanded Cast Static Attack Particles V1

Pepper Prawn, Bagel Beaver, Shakshuka Shark, and Iceberg Oyster use a dedicated static particle sheet. These sprites are intentionally still food-object icons; they avoid trails, speed lines, smears, bursts, blur, arrows, and other built-in motion cues because projectile movement is handled by the game.

- Source chroma-key sheet: `source/food-attack-particles-expanded-cast-v1-chromakey.png`
- Transparent source sheet: `transparent/food-attack-particles-expanded-cast-v1-transparent.png`
- Runtime frames:
  - `runtime/food-attack-particle-expanded_pepper_prawn_static_idle_SW_00.png`
  - `runtime/food-attack-particle-expanded_bagel_beaver_static_idle_SW_00.png`
  - `runtime/food-attack-particle-expanded_shakshuka_shark_static_idle_SW_00.png`
  - `runtime/food-attack-particle-expanded_iceberg_oyster_static_idle_SW_00.png`

Packaging commands:

```powershell
python C:\Users\Will\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py `
  --input assets\particles\source\food-attack-particles-expanded-cast-v1-chromakey.png `
  --out assets\particles\transparent\food-attack-particles-expanded-cast-v1-transparent.png `
  --auto-key border `
  --soft-matte `
  --transparent-threshold 12 `
  --opaque-threshold 220 `
  --despill

python tools\slice_transparent_sprite_sheet.py `
  --input assets\particles\transparent\food-attack-particles-expanded-cast-v1-transparent.png `
  --out-dir assets\particles\runtime `
  --names pepper_prawn_static bagel_beaver_static shakshuka_shark_static iceberg_oyster_static `
  --prefix food-attack-particle-expanded `
  --size 96 `
  --mode grouped `
  --padding-ratio 0.18
```

## Dedicated Static Attack Particles V1

The later roster additions Hot Chip Hamster, Benedict Lobster, Bao Bun Badger, Saltwater Taffy Otter, Churro Cheetah, Granola Goat, and Breakfast Burrito Boar use a dedicated static particle sheet. These replaced borrowed placeholder mappings so every current food-animal line has its own particle art. The source prompt explicitly avoided motion trails, speed lines, blur, smears, impact bursts, arrows, rotation marks, and whoosh shapes.

- Source chroma-key sheet: `source/food-attack-particles-dedicated-missing-current-v1-chromakey.png`
- Transparent source sheet: `transparent/food-attack-particles-dedicated-missing-current-v1-transparent.png`
- Runtime frames:
  - `runtime/food-attack-particle-dedicated_hot_chip_hamster_static_idle_SW_00.png`
  - `runtime/food-attack-particle-dedicated_benedict_lobster_static_idle_SW_00.png`
  - `runtime/food-attack-particle-dedicated_bao_bun_badger_static_idle_SW_00.png`
  - `runtime/food-attack-particle-dedicated_saltwater_taffy_otter_static_idle_SW_00.png`
  - `runtime/food-attack-particle-dedicated_churro_cheetah_static_idle_SW_00.png`
  - `runtime/food-attack-particle-dedicated_granola_goat_static_idle_SW_00.png`
  - `runtime/food-attack-particle-dedicated_breakfast_burrito_boar_static_idle_SW_00.png`

Packaging commands:

```powershell
python C:\Users\Will\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py `
  --input assets\particles\source\food-attack-particles-dedicated-missing-current-v1-chromakey.png `
  --out assets\particles\transparent\food-attack-particles-dedicated-missing-current-v1-transparent.png `
  --auto-key border `
  --soft-matte `
  --transparent-threshold 12 `
  --opaque-threshold 220 `
  --despill

python tools\slice_transparent_sprite_sheet.py `
  --input assets\particles\transparent\food-attack-particles-dedicated-missing-current-v1-transparent.png `
  --out-dir assets\particles\runtime `
  --names hot_chip_hamster_static benedict_lobster_static bao_bun_badger_static saltwater_taffy_otter_static churro_cheetah_static granola_goat_static breakfast_burrito_boar_static `
  --prefix food-attack-particle-dedicated `
  --size 96 `
  --mode grouped `
  --padding-ratio 0.18
```

## Fresh Garden Static Attack Particles V1

Caesar Salamander, Cucumber Cobra, Avocado Axolotl, Herb Hare, Caprese Capybara, and Vinaigrette Viper use a fresh-garden static particle sheet. These sprites are still meal-object stickers rather than animal-body art; they avoid trails, speed lines, smears, bursts, sparkles, arrows, and other baked-in motion cues because projectile movement is handled by the game.

- Source chroma-key sheet: `source/food-attack-particles-fresh-garden-v1-chromakey.png`
- Transparent source sheet: `transparent/food-attack-particles-fresh-garden-v1-transparent.png`
- Runtime frames:
  - `runtime/food-attack-particle-fresh-garden_caesar_salamander_static_idle_SW_00.png`
  - `runtime/food-attack-particle-fresh-garden_cucumber_cobra_static_idle_SW_00.png`
  - `runtime/food-attack-particle-fresh-garden_avocado_axolotl_static_idle_SW_00.png`
  - `runtime/food-attack-particle-fresh-garden_herb_hare_static_idle_SW_00.png`
  - `runtime/food-attack-particle-fresh-garden_caprese_capybara_static_idle_SW_00.png`
  - `runtime/food-attack-particle-fresh-garden_vinaigrette_viper_static_idle_SW_00.png`

Packaging commands:

```powershell
python C:\Users\Will\.codex\skills\.system\imagegen\scripts\remove_chroma_key.py `
  --input assets\particles\source\food-attack-particles-fresh-garden-v1-chromakey.png `
  --out assets\particles\transparent\food-attack-particles-fresh-garden-v1-transparent.png `
  --auto-key border `
  --soft-matte `
  --transparent-threshold 12 `
  --opaque-threshold 220 `
  --despill

python tools\slice_transparent_sprite_sheet.py `
  --input assets\particles\transparent\food-attack-particles-fresh-garden-v1-transparent.png `
  --out-dir assets\particles\runtime `
  --names caesar_salamander_static cucumber_cobra_static avocado_axolotl_static herb_hare_static caprese_capybara_static vinaigrette_viper_static `
  --prefix food-attack-particle-fresh-garden `
  --size 96 `
  --mode columns `
  --padding-ratio 0.18
```

## Gap Filler Static Attack Particles V1

Kelp Koala, Melon Mint Mantis, Coconut Shrimp Sheep, Crab Cake Caterpillar, and Pico de Gallo Gecko use individual static particle stickers. These replaced borrowed placeholder mappings. They are intentionally part-of-meal food-object stickers with no trails, speed lines, blur, smears, impact bursts, arrows, whoosh marks, floating fragments, or animal features.

- Source chroma-key files: `source/food-attack-particles-gap-fillers-v1-*-chromakey.png`
- Transparent files: `transparent/food-attack-particles-gap-fillers-v1-*-transparent.png`
- Runtime frames:
  - `runtime/food-attack-particle-gap-fillers_kelp_koala_static_idle_SW_00.png`
  - `runtime/food-attack-particle-gap-fillers_melon_mint_mantis_static_idle_SW_00.png`
  - `runtime/food-attack-particle-gap-fillers_coconut_shrimp_sheep_static_idle_SW_00.png`
  - `runtime/food-attack-particle-gap-fillers_crab_cake_caterpillar_static_idle_SW_00.png`
  - `runtime/food-attack-particle-gap-fillers_pico_de_gallo_gecko_static_idle_SW_00.png`

The runtime map in `game.js` is:

- Kelp Koala throws a static kelp-and-rice bite.
- Melon Mint Mantis throws a static melon-mint bite.
- Coconut Shrimp Sheep throws a static coconut shrimp bite.
- Crab Cake Caterpillar throws a static crab cake bite.
- Pico de Gallo Gecko throws a static pico-on-chip bite.

## Drink Buff Throwables V1

Battle drink activation uses dedicated static throwable stickers. The art itself is not a motion frame: no trails, speed lines, splashes, loose particles, detached sparkles, arrows, blur, or ghost images. Runtime movement is handled by `game.js` as a short toss from the drink coaster to the affected unit.

- Source chroma-key sheet: `source/drink-buff-throwables-v1-chromakey.png`
- Transparent source sheet: `transparent/drink-buff-throwables-v1-transparent.png`
- Runtime frames:
  - `runtime/drink-buff-throwable_bean_brew_idle_SW_00.png`
  - `runtime/drink-buff-throwable_berry_fizz_idle_SW_00.png`
  - `runtime/drink-buff-throwable_garden_spritz_idle_SW_00.png`
  - `runtime/drink-buff-throwable_citrus_tea_idle_SW_00.png`
  - `runtime/drink-buff-throwable_chili_crunch_cola_idle_SW_00.png`
  - `runtime/drink-buff-throwable_pepper_broth_idle_SW_00.png`
  - `runtime/drink-buff-throwable_abyssal_shake_idle_SW_00.png`
  - `runtime/drink-buff-throwable_cream_soda_float_idle_SW_00.png`
  - `runtime/drink-buff-throwable_tidepool_espresso_idle_SW_00.png`
  - `runtime/drink-buff-throwable_avocado_lassi_idle_SW_00.png`
  - `runtime/drink-buff-throwable_chili_brine_tonic_idle_SW_00.png`
  - `runtime/drink-buff-throwable_market_malt_idle_SW_00.png`
  - `runtime/drink-buff-throwable_maple_cloud_cocoa_idle_SW_00.png`
  - `runtime/drink-buff-throwable_pearl_biscuit_latte_idle_SW_00.png`
  - `runtime/drink-buff-throwable_kelp_cucumber_cooler_idle_SW_00.png`
  - `runtime/drink-buff-throwable_nori_pop_slush_idle_SW_00.png`
  - `runtime/drink-buff-throwable_harissa_morning_shot_idle_SW_00.png`
  - `runtime/drink-buff-throwable_pretzel_cream_soda_idle_SW_00.png`
  - `runtime/drink-buff-throwable_boba_night_tea_idle_SW_00.png`
  - `runtime/drink-buff-throwable_pico_lime_agua_idle_SW_00.png`

Packaging notes:

- Generated as a 5 by 4 chroma-key sticker sheet.
- Chroma key removed with the shared imagegen `remove_chroma_key.py` helper.
- Runtime frames were cut by main connected sticker component, not equal grid crop, so detached source shadow slivers are discarded.
- Each runtime frame is `96x96` with transparent corners and at least `13px` alpha margin to avoid clipping in battle toss rendering.
- Berry Fizz was replaced with a brighter green-key v3 source at `source/drink-buff-throwable-berry-fizz-v3-chromakey.png` and `transparent/drink-buff-throwable-berry-fizz-v3-transparent.png` so it reads as magenta berry soda instead of a dark boba pearl.
- Contact/report artifacts: `output/drink-buff-throwables-v1-contact.png` and `output/drink-buff-throwables-v1-report.json`.
