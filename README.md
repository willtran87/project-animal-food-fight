# Project Animal Food Fight

A browser-playable food-animal auto-battler prototype with a cozy food-market surface and a horror/future-war reality layer underneath it.

The current build is a static HTML/CSS/JavaScript project. The default route opens the start menu, then keeps `/` stable while the campaign shell flows into the opening VN, tutorial, and cozy level 1. Direct local test pages live under `local-test-pages/`.

## Entry Points

- `index.html` loads the Harvest Friends start menu as the default campaign entry at `/`, then embeds the opening/tutorial/game flow without changing the visible route.
- `local-test-pages/start-menu.html` loads `src/start-menu.js` / `styles/start-menu.css`, the direct local test route for the Harvest Friends start menu.
- `local-test-pages/opening-vn.html` loads `src/opening-vn.js` / `styles/opening-vn.css`, the direct local test route for the opening/tutorial dialogue flow.
- `local-test-pages/game.html` loads `src/game.js`, the playable auto-battler and all direct gameplay/test routes.

## Local Development

Run a local static server from the repository root:

```powershell
python -m http.server 8173
```

Then open:

```text
http://127.0.0.1:8173/
```

The campaign entry flow is available at:

```text
http://127.0.0.1:8173/
```

The individual screens are also available at:

```text
http://127.0.0.1:8173/local-test-pages/start-menu.html
http://127.0.0.1:8173/local-test-pages/opening-vn.html
http://127.0.0.1:8173/local-test-pages/game.html
http://127.0.0.1:8173/local-test-pages/conversation-cozy.html
http://127.0.0.1:8173/local-test-pages/conversation-horror.html
```

## Useful Routes

- `/local-test-pages/start-menu.html?theme=horror` opens the horror/future-war side of the start menu, then Start Run enters the shared opening/tutorial flow.
- `/local-test-pages/game.html?smoke=basic` or `/local-test-pages/game.html?smoke=core-loop` seeds a deterministic smoke-test team.
- `/local-test-pages/game.html?theme=cozy` starts in the cozy illusion layer but still allows the story reveal; use `/local-test-pages/game.html?reality=cozy` to force cozy.
- `/local-test-pages/game.html?theme=horror` forces the horror/future-war layer.
- `/local-test-pages/conversation-cozy.html` and `/local-test-pages/conversation-horror.html` jump straight into the real in-game conversation renderer.
- `/local-test-pages/game.html?screen=level-10` opens the wave-10 Banana Split Giraffe boss setup.
- `/local-test-pages/game.html?screen=level-10&start=battle` starts that boss route immediately.
- `/local-test-pages/game.html?screen=final-fight` opens the wave-20 Neural Overmind setup.
- `/local-test-pages/game.html?screen=final-fight&start=battle` starts the final fight immediately.
- `/local-test-pages/game.html?screen=victory-epilogue` opens the final victory cutscene.
- `/local-test-pages/game.html?screen=victory-epilogue&stage=crawl`, `stage=static`, or `stage=ideal` jumps to later cutscene beats.

## Current Game Shape

- 3x3 board, 8-slot shop, 8-slot unit bench, 5 drink rails, and 8 item bench/storage slots.
- 43 food-animal lines, each with cozy runtime sprites and horror/war-machine runtime overrides.
- 83 item/drink/topping entries, with three-tier item/drink evolution art where supported.
- Four unit tiers through 3-copy merging; toppings/drinks merge to level 3.
- Six arena modifiers with matching cozy and horror background art.
- Wave 10 features the Banana Split Giraffe reveal boss and post-boss reality-break transition.
- Wave 20 features the Neural Overmind final boss, terminal horror defeat, and final victory cutscene route.
- Post-battle results include reward choices, income breakdowns, and an expanded combat ledger with replay frames and event filtering.

## Design Docs

- `docs/RUNTIME_ARCHITECTURE.md` documents the static script-loading model, runtime module families, game-state flow, route harnesses, persistence notes, and verification map with Mermaid diagrams.
- `docs/CONTENT_AUTHORING_GUIDE.md` is the practical checklist for adding units, items, stories, route harnesses, and browser-loaded scripts.
- `docs/ROUTES_AND_TEST_HARNESSES.md` catalogs entry points, query params, route aliases, direct conversation pages, browser hooks, and route-check coverage.
- `docs/SAVE_AND_PROGRESSION_CONTRACT.md` records local/session storage keys, active-run record shape, menu unlock flags, autosave behavior, and migration rules.
- `docs/COMBAT_AND_ECONOMY_TUNING.md` maps economy, shop rarity, unit/item tuning, enemy generation, boss gates, and balance-report usage.
- `docs/ASSET_NAMING_AND_VERSIONING.md` defines source/transparent/runtime directory roles, version suffix rules, sprite/particle/background naming, and validation expectations.
- `docs/STORY_AND_CUTSCENE_PIPELINE.md` covers story milestone data, conversation routes, level 10 reveal cutscene wiring, and final victory epilogue routes.
- `docs/ART_DIRECTION.md` defines the cozy sticker-sprite target, evolution-read rules, production pipeline, and current status of source-reference art.
- `docs/HORROR_ARENA_MAPPING.md` maps cozy arena modifiers to their post-human automated food-infrastructure horror variants.
- `assets/README.md` records root-level browser chrome and cross-entry asset provenance.
- `assets/sprites/README.md` records the sprite-generation, chroma-key, slicing, manifest, attack-particle, and defeat-still pipeline.
- `assets/items/README.md` records topping/drink art, horror weapon/fuel-source replacements, and item evolution slices.
- `assets/ui/README.md` records UI atlas, HUD, command, shop, combat-ledger, manifest, and reality-break UI art.
- `assets/backgrounds/README.md` records arena, war-market, and victory-cutscene backgrounds.
- `assets/status-effects/README.md` records cozy and horror combat status-effect sprites.
- `progress.md` is a chronological implementation log. It is intentionally verbose and should not replace the focused docs above.

## Code Map

- `src/app-scripts.js`
  - Static script loader and cache-token manifest for the `startMenu`, `openingVn`, and `game` script groups.
  - Keep dependency scripts before consumers, then run `npm run update:script-versions` after browser-loaded script edits.
- `src/rng-runtime.js`
  - Seed normalization and deterministic random stream helpers used by the game route; `?seed=<value>` reproduces shop/enemy/combat random choices.
- `src/dynamic-asset-manifest.js`
  - Explicit literal references for runtime-generated asset paths such as theme/id SFX, so asset audits can validate them.
- `src/game.js`
  - Data: economy, UI constants, gameplay tuning, and runtime state setup.
  - State: prep, battle, result, reboot/static transitions, final victory transition, victory cutscene, codex, drag/drop, rewards, and combat ledger review state.
  - Systems: shop generation, purchase/merge/equipment, arena rewards, enemy plan generation, combat simulation, item/drink effects, particles, reality theme switching, and route setup.
  - Rendering: canvas UI, prep board, shop, codex/War Manifest, battle field, particles, status glyphs, result panel, expanded combat ledger, reality distortion, and cutscene layers.
  - Test hooks: `window.render_game_to_text()`, `window.advanceTime(ms)`, and `window.__foodAnimals`.
- `src/presentation-data.js`
  - Static presentation data for music/SFX ids, story/cutscene art, victory crawl text, UI texture paths, major panel rectangles, battle field layout, and icon atlas cells.
- `src/copy-data.js`
  - Static cozy/horror copy-theme overrides for UI labels, trait/family/role naming, arena text, unit names, and item names.
- `src/story-data.js`
  - Static in-game story milestone and final-conversation data consumed by `src/game.js`.
- `src/trait-arena-data.js`
  - Static trait definitions, arena modifiers, horror arena colors, favorite topping links, and favorite combo copy.
- `src/unit-data.js`
  - Static unit catalog, cozy/horror unit sprite maps, and cozy/horror defeat still maps.
- `src/item-data.js`
  - Static item/drink/topping catalog, item tier rules, shop item chances, item/drink asset maps, and attack/drink throwable particle maps.
- `src/economy-enemy-data.js`
  - Static economy, unit tier scaling, merge rewards, battle speed options, enemy archetype, shop-power, and final-boss tuning.
- `src/rarity-shop-data.js`
  - Static rarity palettes, horror rarity overrides, and shop-level rarity weights/upgrade costs.
- `src/status-effect-data.js`
  - Static status-effect styles plus cozy/horror status-effect sprite maps.
- `src/start-menu.js`
  - DOM menu navigation, persisted audio settings, music-track selection, animated food lobs, click explosions, and `render_game_to_text()`.
- `src/opening-vn.js`
  - Dialogue beat data, speaker/inner-monologue state, paddock preview reveal, completion event, and `render_game_to_text()`.
- `src/*-runtime.js`
  - Focused reusable decisions for audio, storage, shop flow, shop transactions, merging, battle abilities/items/phase transitions, rewards, enemy plans, status effects, route params, interactions, drag/drop, options, field guide, and menu food-lob effects.
- `src/*-canvas.js`, `src/canvas-*.js`, and `src/card-canvas.js`
  - Shared canvas drawing, text measurement/wrapping, layout geometry, status glyphs, battle overlays, story panels, transitions, ledger panels, and Codex/War Manifest surfaces.

## Verification

Syntax-check the JavaScript entry points:

```powershell
npm run check:syntax
```

This runs `tools/check_syntax.mjs`, which discovers JavaScript modules in `src/` and `tools/` and runs `node --check` for each file.

Or check an individual file directly:

```powershell
node --check src/game.js
```

Check the opening tutorial iframe anchor after layout/refactor work:

```powershell
node tools/check_opening_tutorial_anchor.mjs
```

Check the core entry routes at high resolution after script wiring, layout, or route changes:

```powershell
node tools/check_game_routes_highres.mjs
```

Check literal runtime asset/script/style references after asset cleanup or refactors:

```powershell
npm run check:assets
```

Check static content/data contracts and deterministic runtime helper behavior:

```powershell
npm run check:data
npm run check:logic
```

Generate a non-failing report of tracked assets that are not referenced by scanned source/docs:

```powershell
npm run report:unused-assets
```

Generate a non-failing balance snapshot for shop rarity, roll costs, item prices, and sampled enemy scaling:

```powershell
npm run report:balance
```

Refresh static script cache keys from file-content hashes after changing browser-loaded scripts:

```powershell
npm run update:script-versions
```

Run the full local safety suite:

```powershell
npm run check
```

Common browser smoke targets:

```text
http://127.0.0.1:8173/local-test-pages/game.html?smoke=basic
http://127.0.0.1:8173/local-test-pages/game.html?screen=level-10&start=battle
http://127.0.0.1:8173/local-test-pages/game.html?screen=final-fight&start=battle
```

Conversation/story preview targets:

```text
http://127.0.0.1:8173/local-test-pages/conversation-level2.html
http://127.0.0.1:8173/local-test-pages/conversation-level3.html
http://127.0.0.1:8173/local-test-pages/conversation-level5.html
http://127.0.0.1:8173/local-test-pages/conversation-level10.html
http://127.0.0.1:8173/local-test-pages/conversation-level15.html
http://127.0.0.1:8173/local-test-pages/conversation-level20-prefinal.html
http://127.0.0.1:8173/local-test-pages/conversation-level20-final-tabs.html
```

When changing asset wiring, prefer checking both cozy and horror themes because most runtime sprite, item, status, UI, and copy paths have theme-specific mappings.

## Contents

- `index.html`: default start menu entry for `/`.
- `local-test-pages/game.html`, `styles/game.css`, `src/game.js`: playable game local test route.
- `local-test-pages/start-menu.html`, `styles/start-menu.css`, `src/start-menu.js`: start menu local test route.
- `local-test-pages/opening-vn.html`, `styles/opening-vn.css`, `src/opening-vn.js`: opening/tutorial VN local test route.
- `docs/`: project-level design and mapping notes.
- `assets/`: runtime game art, source/intermediate asset pipeline outputs, audio, and design references.
- `tools/`: local asset-processing utilities.
- `test-actions/`: browser interaction payloads used during smoke testing.
