# Start Menu Assets

This folder contains art for the standalone Harvest Friends start-menu prototype loaded by `start-menu.html`.

## Runtime

- `cozy-picnic-start-bg-v1.png` - active full-screen cozy picnic menu background.
- `horror-start-bg-v1.png` - active full-screen horror/future-war menu background used by `start-menu.html?theme=horror`.
- `run-mode-selector-cozy-bg-v1.png` - generated opaque cozy wood Story Mode / Infinite Mode selector backing with a baked-in thin border.
- `run-mode-selector-horror-bg-v1.png` - generated opaque horror metal Story Mode / Infinite Mode selector backing with a baked-in thin border.
- `horror-field-guide-bg-v1.png` - generated horror Field Guide/specification screen backdrop with wartorn spec sheets around a dark open center.
- `horror-field-guide-desk-bg-v1.png` - generated future-war desk background used by the horror Field Guide/specification shell.
- `harvest-friends-title-v2.png` - active title logo.
- `runtime/horror-title-plate-v1.png` - generated transparent horror title backplate used behind the live `Harvest Friends` title on the horror route.
- `runtime/horror-button-plate-v1.png` - generated transparent horror machine-console button plate reused behind live horror menu labels.
- `runtime/horror-overhead-cables-v1.png` - generated transparent horror overhead cable / monitor layer for `start-menu.html?theme=horror`.
- `runtime/horror-broken-relics-v1.png` - generated transparent broken cozy relics and machine debris layer for the horror route.
- `runtime/horror-transition-plaque-v1.png` - generated transparent text-free horror Start Run plaque; live DOM text is layered over it.
- `harvest-friends-mascot-cluster-v1.png` - foreground mascot cluster.
- `start-transition-tablecloth-v1.png` - image-generated picnic tablecloth transition background used while Start Run opens the game.
- `start-transition-message-v1.png` - transparent image-generated "Setting the table..." transition plaque.
- `runtime/food-lobs-v1/*.png` - first ambient food-lob sticker set.
- `runtime/food-lobs-v2/*.png` - second ambient food-lob sticker set.
- `runtime/chalk-button-*.png` - generated chalk button states retained for menu styling experiments.

## Source Pipeline

The food-lob sprites follow the same chroma-key workflow as other generated art:

1. Keep generated source sheets in `source/`.
2. Remove the key into `transparent/`.
3. Slice padded transparent runtime PNGs into `runtime/`.

`start-menu.js` currently uses the v1 and v2 lob sets together, spawns lobs edge-to-edge from offscreen, caps active lobs by viewport width, and exposes menu/lob state through `window.render_game_to_text()`.

The active cozy Banana Split Giraffe Field Guide plate is `field-guide/cozy/banana-split-giraffe-boss-anatomy-journal-v2-hd-pixel-transparent.webp`. It corrects the specimen to four legs and a continuous neck-to-chest silhouette while preserving the original Plate 46 journal content. Its generated trail is `source/banana-split-giraffe-boss-anatomy-journal-v2-chromakey.png` -> `transparent/banana-split-giraffe-boss-anatomy-journal-v2-transparent.webp`.

## Notes

- The standalone menu dispatches `food-animals:start-menu:start` when Start Run is chosen, but it is not yet integrated as the launch shell for `index.html`.
- The horror menu side is currently route-gated with `start-menu.html?theme=horror`; it can also be toggled at runtime with `window.setStartMenuTheme("horror")` / `"cozy"`. Starting from the horror route hands off to `index.html?theme=horror`.
- Horror title/button art is intentionally text-free. `start-menu.css` layers live DOM text over generated transparent plates so spelling, accessibility labels, and future copy changes stay deterministic.
- The horror title-screen static and illusion-bleed effects are CSS-only. The illusion bleed hints at the cozy picnic colors without swapping cozy image assets back into the horror screen.
- Music track data for this prototype lives in `start-menu.js`; the files are documented in `assets/audio/README.md`.
