# Project Animal Food Fight

A browser-playable food-animal auto-battler prototype with a cozy food-market surface and a horror/future-war reality layer underneath it.

The current build is a static HTML/CSS/JavaScript project. The default route opens the start menu, then keeps `/` stable while the campaign shell flows into the opening VN, tutorial, and cozy level 1. The auto-battler itself lives in one canvas-driven file behind `game.html`.

## Entry Points

- `index.html` loads the Harvest Friends start menu as the default campaign entry at `/`, then embeds the opening/tutorial/game flow without changing the visible route.
- `game.html` loads `game.js`, the playable auto-battler and all direct gameplay/test routes.
- `start-menu.html` loads `start-menu.js` / `start-menu.css`, the direct test route for the Harvest Friends start menu with music settings, animated food-lob ambience, and a Start Run transition into the opening VN route.
- `opening-vn.html` loads `opening-vn.js` / `opening-vn.css`, the direct test route for the opening/tutorial dialogue flow. In the root campaign shell, this is embedded rather than exposed as the gameplay route.

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
http://127.0.0.1:8173/start-menu.html
http://127.0.0.1:8173/opening-vn.html
http://127.0.0.1:8173/game.html
```

## Useful Routes

- `/start-menu.html?theme=horror` opens the horror/future-war side of the start menu, then Start Run enters the shared opening/tutorial flow.
- `/game.html?smoke=basic` or `/game.html?smoke=core-loop` seeds a deterministic smoke-test team.
- `/game.html?theme=cozy` starts in the cozy illusion layer but still allows the story reveal; use `/game.html?reality=cozy` to force cozy.
- `/game.html?theme=horror` forces the horror/future-war layer.
- `/game.html?screen=level-10` opens the wave-10 Banana Split Giraffe boss setup.
- `/game.html?screen=level-10&start=battle` starts that boss route immediately.
- `/game.html?screen=final-fight` opens the wave-20 Neural Overmind setup.
- `/game.html?screen=final-fight&start=battle` starts the final fight immediately.
- `/game.html?screen=victory-epilogue` opens the final victory cutscene.
- `/game.html?screen=victory-epilogue&stage=crawl`, `stage=static`, or `stage=ideal` jumps to later cutscene beats.

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

- `ART_DIRECTION.md` defines the cozy sticker-sprite target, evolution-read rules, production pipeline, and current status of source-reference art.
- `HORROR_ARENA_MAPPING.md` maps cozy arena modifiers to their post-human automated food-infrastructure horror variants.
- `assets/sprites/README.md` records the sprite-generation, chroma-key, slicing, manifest, attack-particle, and defeat-still pipeline.
- `assets/items/README.md` records topping/drink art, horror weapon/fuel-source replacements, and item evolution slices.
- `assets/ui/README.md` records UI atlas, HUD, command, shop, combat-ledger, manifest, and reality-break UI art.
- `assets/backgrounds/README.md` records arena, war-market, and victory-cutscene backgrounds.
- `assets/status-effects/README.md` records cozy and horror combat status-effect sprites.
- `progress.md` is a chronological implementation log. It is intentionally verbose and should not replace the focused docs above.

## Code Map

- `game.js`
  - Data: copy themes, unit catalog, traits, arenas, economy, items, sprite maps, and horror override maps.
  - State: prep, battle, result, reboot/static transitions, final victory transition, victory cutscene, codex, drag/drop, rewards, and combat ledger review state.
  - Systems: shop generation, purchase/merge/equipment, arena rewards, enemy plan generation, combat simulation, item/drink effects, particles, reality theme switching, and route setup.
  - Rendering: canvas UI, prep board, shop, codex/War Manifest, battle field, particles, status glyphs, result panel, expanded combat ledger, reality distortion, and cutscene layers.
  - Test hooks: `window.render_game_to_text()`, `window.advanceTime(ms)`, and `window.__foodAnimals`.
- `start-menu.js`
  - DOM menu navigation, persisted audio settings, music-track selection, animated food lobs, click explosions, and `render_game_to_text()`.
- `opening-vn.js`
  - Dialogue beat data, speaker/inner-monologue state, paddock preview reveal, completion event, and `render_game_to_text()`.

## Verification

Syntax-check the JavaScript entry points:

```powershell
node --check game.js
node --check start-menu.js
node --check opening-vn.js
```

Common browser smoke targets:

```text
http://127.0.0.1:8173/game.html?smoke=basic
http://127.0.0.1:8173/game.html?screen=level-10&start=battle
http://127.0.0.1:8173/game.html?screen=final-fight&start=battle
```

When changing asset wiring, prefer checking both cozy and horror themes because most runtime sprite, item, status, UI, and copy paths have theme-specific mappings.

## Contents

- `index.html`: default start menu entry for `/`.
- `game.html`, `styles.css`, `game.js`: playable game.
- `start-menu.html`, `start-menu.css`, `start-menu.js`: start menu and first-run campaign entry.
- `opening-vn.html`, `opening-vn.css`, `opening-vn.js`: opening/tutorial VN and cozy level-1 handoff.
- `assets/`: runtime game art, source/intermediate asset pipeline outputs, audio, and design references.
- `tools/`: local asset-processing utilities.
- `test-actions-*.json`: browser interaction payloads used during smoke testing.
