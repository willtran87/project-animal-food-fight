# Horror Arena Mapping

This pass reframes the bright food-market arenas as post-human automated food infrastructure. Each arena keeps the current gameplay composition: a clear central combat floor with dense environmental storytelling around the edges.

In the current game, these backgrounds are selected by the same arena modifier system as the cozy arenas. The horror layer can be forced with `?theme=horror`, is exposed by the wave-10 reality-break sequence, and remains active through the wave-20 Neural Overmind final fight and victory cutscene route.

| Current arena | Horror arena | Asset |
|---|---|---|
| Sunny Breakfast Patio | Solar Ration Patio | `assets/backgrounds/horror/arena-solar-ration-patio-v1.png` |
| Rainy Fish Market | Flooded Protein Docks | `assets/backgrounds/horror/arena-flooded-protein-docks-v1.png` |
| Street Festival | Blackout Street Carnival | `assets/backgrounds/horror/arena-blackout-street-carnival-v1.png` |
| Spice Bazaar | Ember Spice Foundry | `assets/backgrounds/horror/arena-ember-spice-foundry-v1.png` |
| Frozen Parfait Peak | Cryo-Dairy Vault | `assets/backgrounds/horror/arena-cryo-dairy-vault-v1.png` |
| Dim Sum Kitchen | Steam Canteen Block | `assets/backgrounds/horror/arena-steam-canteen-block-v1.png` |

## Theme Notes

- Solar Ration Patio: a dead breakfast courtyard where ration machines still sort survivors under emergency lamps.
- Flooded Protein Docks: a rain-choked seafood market converted into a robotic protein-processing dock.
- Blackout Street Carnival: an abandoned food festival rebuilt as a militarized ration checkpoint.
- Ember Spice Foundry: a spice bazaar turned into a furnace-lit chemical and flavoring depot.
- Cryo-Dairy Vault: a frozen dessert resort reimagined as a gene-storage and dairy-clone bunker.
- Steam Canteen Block: a dim sum kitchen transformed into an automated bunker canteen.

## Shared Prompt Rules

- High-detail HD pixel art background, dark future-war horror tone.
- Chunky black outlines, crisp pixel clusters, no photorealism or smooth vector style.
- Large clear center for combat readability.
- Edge-heavy machinery, robots, cables, broken food-service architecture, neon hazard lighting.
- No readable text, logos, UI, or characters blocking the arena.

## Runtime Notes

- Cozy and horror arenas should preserve the same modifier semantics; only the visual skin and copy layer change.
- Backgrounds must remain crop-safe at the `16:10` game ratio and readable under the 3x3 combat board, drink rails, top HUD, result panel, and expanded combat ledger.
- New horror arena art should avoid baking labels into the bitmap. `game.js` renders dynamic arena/zone copy, tooltips, and status text live.
- The post-boss war-market background and final victory backgrounds are documented in `assets/backgrounds/README.md` because they are route/cutscene art rather than arena-modifier art.
