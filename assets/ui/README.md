# UI Icon Assets

Generated UI icons use a chroma-key source, transparent intermediate, and packed runtime atlas.

## Runtime

- `runtime/ui-icon-atlas-v1.png` - 8x4 atlas, 64px cells, used for arena, reward, action, ledger, and mold-adjacent UI icons.
- `runtime/ui-icon-atlas-v2.png` - active cozy 8x4 atlas with the same 64px cell contract as v1, replacing only the post-battle reward row with clearer reward icons.
- `runtime/ui-icon-atlas-war-v2.png` - active horror-mode 8x4 atlas with the same 64px cell contract, replacing cozy reward/action/info glyphs with brighter mechanical scrap, scan, weapon, rig, hull, and hazard icons.
- `runtime/upgrade-star-v2.png` - generated tier star icon.
- `runtime/shop-lock-locked-v1.png` / `runtime/shop-lock-unlocked-v1.png` - generated shop lock toggle icons.
- `runtime/status-heart-v1.png` / `runtime/status-coin-v1.png` - generated top-bar resource icons.
- `runtime/status-chalk-course-v1.png`, `runtime/status-chalk-coins-v1.png`, and `runtime/status-chalk-health-v1.png` - generated blank chalk status boards for the top HUD.
- `runtime/battle-speed-chalk-board-v1.png` - generated blank chalk board for the battle speed control.
- `runtime/chalk-sign-restart-v1.png` - generated defeated-state restart chalk sign.
- `runtime/cozy-awning-transition-v1.png` - generated transparent market awning used for cozy reward-to-shop transitions.
- `runtime/cozy-battle-deploy-overlay-v2.png` - active generated transparent straight-on placemat frame used behind live battle-start deploy text in cozy mode.
- `runtime/cozy-battle-deploy-overlay-v1.png` - first cozy deploy placemat frame, retained as a superseded draft because it read as angled.
- `runtime/horror-battle-deploy-overlay-v1.png` - generated transparent command-console frame used behind live battle-start deploy text in horror/war mode.
- `runtime/transition-title-pattern-set-v1.png` / `runtime/transition-title-deploying-wave-v1.png` - active generated transparent word art used by the centered deploy transition.
- `runtime/transition-title-pattern-holds-v1.png` / `runtime/transition-title-pattern-breaks-v1.png` - active generated transparent cozy word art used by battle result transitions.
- `runtime/transition-title-relay-opened-v1.png` / `runtime/transition-title-hull-breach-v1.png` / `runtime/transition-title-system-down-v1.png` - active generated transparent horror/war word art used by battle result transitions.
- `runtime/transition-title-plates-up-v1.png` / `runtime/transition-title-course-cleared-v1.png` / `runtime/transition-title-service-lost-v1.png` / `runtime/transition-title-target-cleared-v1.png` / `runtime/transition-title-unit-loss-v1.png` / `runtime/transition-title-run-over-v1.png` - second title-art pass, retained as superseded drafts after the transition copy moved to tighter story terms.
- `runtime/transition-title-setting-the-field-v1.png` / `runtime/transition-title-victory-v1.png` - first generic title-art pass, retained as superseded drafts after the transition copy moved to story-specific terms.
- `runtime/transition-title-defeat-v1.png` - first defeat word-art pass, retained as a superseded draft because it read too gothic for the cozy game UI.

## Source Pipeline

- `source/ui-icon-atlas-v1-chromakey.png` - built-in image generation source on a flat chroma-key background.
- `transparent/ui-icon-atlas-v1-transparent.png` - chroma-key removed with `remove_chroma_key.py`.
- `runtime/ui-icon-atlas-v1.png` - transparent source repacked into a true 512x256, 8x4 atlas so game code can sample 64px cells without distortion.
- `source/ui-icon-atlas-rewards-v2-chromakey.png` - built-in image generation source for the improved cozy post-battle reward row on a flat magenta key.
- `transparent/ui-icon-atlas-rewards-v2-transparent.png` - magenta key removed.
- `runtime/ui-icon-atlas-v2.png` - v1 atlas with only row 1 replaced by the v2 reward strip: coins, reroll, topping, copy, arena, favorite, discount, and heart.
- `source/ui-icon-atlas-war-v1-chromakey.png` / `runtime/ui-icon-atlas-war-v1.png` - first horror icon pass, retained as a draft but not active because the icons were too dark at 11-25px in live horror UI.
- `source/ui-icon-atlas-war-v2-chromakey.png` - built-in image generation source on flat `#ff00ff`, generated after auditing horror mode for cozy icon leftovers and readability.
- `transparent/ui-icon-atlas-war-v2-transparent.png` - magenta key removed.
- `runtime/ui-icon-atlas-war-v2.png` - transparent source downscaled into the same 512x256 atlas contract and selected only while horror/reality mode is active.
- `source/top-status-chalk-boards-v1-chromakey.png` - built-in image generation source for the Course/Coins/Health chalk boards on a flat magenta key.
- `transparent/top-status-chalk-boards-v1-transparent.png` - magenta key removed, then sliced into the three runtime status-board PNGs.
- `source/battle-speed-chalk-board-v1-chromakey.png` - built-in image generation source for the battle speed chalk board on a flat magenta key.
- `transparent/battle-speed-chalk-board-v1-transparent.png` - magenta key removed, then cropped into the runtime speed-board PNG.
- `source/chalk-sign-restart-v1-chromakey.png` - built-in image generation source for the defeated-state restart chalk sign on a flat magenta key.
- `transparent/chalk-sign-restart-v1-transparent.png` - magenta key removed, then cropped into the runtime restart-sign PNG.
- `source/cozy-awning-transition-v1-chromakey.png` - built-in image generation source for the cozy reward-return awning on a flat green key.
- `transparent/cozy-awning-transition-v1-transparent.png` - green key removed with `remove_chroma_key.py`.
- `runtime/cozy-awning-transition-v1.png` - transparent runtime copy used by `game.js`; no text, no coins, food motifs only.
- `source/cozy-battle-deploy-overlay-v2-chromakey.png` / `source/cozy-battle-deploy-overlay-v1-chromakey.png` / `source/horror-battle-deploy-overlay-v1-chromakey.png` - built-in image generation sources for the text-free battle-start deploy frames on flat magenta keys.
- `transparent/cozy-battle-deploy-overlay-v2-transparent.png` / `transparent/cozy-battle-deploy-overlay-v1-transparent.png` / `transparent/horror-battle-deploy-overlay-v1-transparent.png` - magenta key removed with `remove_chroma_key.py`.
- `runtime/cozy-battle-deploy-overlay-v2.png` / `runtime/horror-battle-deploy-overlay-v1.png` - active transparent runtime copies used by `game.js`; all deploy text remains canvas-rendered live.
- `source/transition-title-*-chromakey.png` - built-in image generation sources for deploy/result title word art on flat magenta keys.
- `transparent/transition-title-*-transparent.png` - magenta key removed with `remove_chroma_key.py`.
- `runtime/transition-title-*.png` - transparent cropped title art used by `game.js`, with canvas text fallbacks preserved if assets are not ready.

Prompt summary: a charming pixel-art game UI icon atlas for traits, rewards, actions, combat ledger info, row/column drink lanes, and mold, arranged as an 8x4 no-text grid on a flat `#ff00ff` background. Some generated cells are intentionally unused after later readability passes.

## Reality Break UI V1

- `runtime/battle-field-war-grid-v1.webp` - generated tactical machine-floor battle backdrop for the broken-reality combat layer.
- `runtime/shop-slot-card-war-v2.png` - generated portrait shop-card frame for horror/war shop slots, with thinner mechanical edges for item text readability.
- `runtime/shop-lock-cloth-war-v1.webp` - generated locked-shop-slot barricade background for horror/war locked store slots.
- `runtime/bench-slot-card-war-v1.png` - generated square machine-bay frame for horror/war bench and item slots.
- `runtime/team-intel-card-war-v2.webp` - generated War Intel tactical display panel background for the right-side info/menu panel, with thin borders for text readability.
- `runtime/conversation-panel-war-v1.webp` - generated horror-mode story conversation panel background, cropped to the live dialogue-panel aspect with thin mechanical borders and a dark text-safe center.
- `runtime/conversation-panel-war-v1-source.png` - imagegen source for the horror story conversation panel, retained for traceability.
- `runtime/combat-ledger-panel-bg-v1.png` - generated cozy detailed-combat-ledger background, styled after the team intel parchment card but widened for replay and log columns. Text/icons are rendered live in `game.js`.
- `runtime/combat-ledger-panel-war-v3.png` - active generated horror detailed-combat-ledger background, regenerated on a flat magenta chroma key and converted to alpha so the outer corners/background no longer draw as an opaque black rectangle. The panel border is cropped to fill the runtime box while preserving the thin rails, smaller corner hardware, and dark split monitor interior. Text/icons are rendered live in `game.js`.
- `runtime/combat-ledger-panel-war-v2.png` - thinner horror detailed-combat-ledger background draft, retained as superseded because its opaque black background still filled the frame around the shell.
- `runtime/combat-ledger-panel-war-v1.png` - first horror detailed-combat-ledger background pass, retained as a superseded draft because its outer frame and corner hardware were too heavy behind the live ledger UI.
- `runtime/combat-ledger-mini-bg-v1.png`, `runtime/combat-ledger-participants-bg-v1.png`, and `runtime/combat-ledger-log-bg-v1.png` - generated cozy internal detailed-ledger menu backgrounds for the replay viewport, participant selector, and interaction log. Text, icons, replay units, and controls are rendered live in `game.js`.
- `runtime/combat-ledger-roster-bg-v1.png` - active generated cozy detailed-ledger participant roster background, regenerated as a minimal parchment insert with a thin stitched border and quiet corners to avoid the earlier heavy lower-left frame overlap. Text and row controls are rendered live in `game.js`.
- `runtime/combat-ledger-mini-war-v2.png`, `runtime/combat-ledger-participants-war-v2.png`, and `runtime/combat-ledger-log-war-v2.png` - active generated horror/war internal detailed-ledger menu backgrounds for the replay viewport, participant selector, and interaction log, regenerated with thinner borders to match the newer horror UI plates. Text, icons, replay units, and controls are rendered live in `game.js`.
- `runtime/combat-ledger-mini-war-v1.png`, `runtime/combat-ledger-participants-war-v1.png`, and `runtime/combat-ledger-log-war-v1.png` - first horror internal detailed-ledger menu background pass, retained as a superseded draft because the mechanical borders were heavier than desired.
- `runtime/war-manifest-bg-v2.webp` - generated wide War Manifest/Food Menu shell background for the horror Codex overlay, with thin borders and a subtle center split.
- `runtime/horror-food-menu-hanging-sign-v1.png` - generated hanging War Manifest/food-menu sign for the horror shop stall side button.
- `runtime/reality-banner-war-v1.webp` - generated thin mechanical alert board behind the horror-mode SIMULATION MALFUNCTION banner text.
- `runtime/status-war-wave-v1.webp`, `runtime/status-war-scrap-v1.webp`, and `runtime/status-war-hull-v1.webp` - sliced blank tactical monitor plates replacing the chalk top-HUD boards in horror/war mode.
- `runtime/command-war-rig-v1.webp`, `runtime/command-war-scan-v1.webp`, `runtime/command-war-deploy-v1.webp`, `runtime/command-war-speed-v1.webp`, and `runtime/command-war-reboot-v1.webp` - sliced blank command plates replacing chalk action signs in horror/war mode.
- `runtime/status-war-wave-v2.webp`, `runtime/status-war-scrap-v2.webp`, and `runtime/status-war-hull-v2.webp` - thinner-border tactical monitor plates for horror/war status text readability.
- `runtime/command-war-rig-v2.webp`, `runtime/command-war-scan-v2.webp`, `runtime/command-war-deploy-v2.webp`, `runtime/command-war-speed-v2.webp`, and `runtime/command-war-reboot-v2.webp` - thinner-border command plates for horror/war action text readability.

Source copies live under `source/*-war-v1-source.png` and `source/*-war-v2-source.png`. These assets are selected by `game.js` only when the reality-break theme is active or forced.

The horror food-menu hanging sign was generated as `source/horror-food-menu-hanging-sign-v1-chromakey.png` on a flat magenta key, converted to `transparent/horror-food-menu-hanging-sign-v1-transparent.png`, then resized to the 320x320 runtime asset above. It keeps no text in the bitmap; `game.js` handles the tooltip/copy layer.

The reality banner board was generated as `source/reality-banner-war-v1-chromakey.png` on a flat magenta key, converted to `transparent/reality-banner-war-v1-transparent.png`, then cropped/resized to the 744x144 runtime asset above. It keeps no text in the bitmap; `game.js` renders the centered SIMULATION MALFUNCTION title in horror mode.

The top-HUD/status and command plates were generated together as one no-text sprite sheet at `source/horror-hud-panels-v1-chromakey.png`, keyed to `transparent/horror-hud-panels-v1-transparent.png`, then component-sliced into the runtime assets above. Text remains canvas-rendered by `game.js` so dynamic values such as Wave/Scrap/Hull, Rig/Scan/Deploy, Reboot, costs, and playback speed stay exact.

The v2 status/command plates use the same imagegen/chroma-key/slice workflow from `source/horror-hud-panels-v2-chromakey.png` to `transparent/horror-hud-panels-v2-transparent.png`, with reduced mechanical border thickness and larger matte-black text-safe centers.
