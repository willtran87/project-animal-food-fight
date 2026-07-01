# Audio Assets

This folder contains prototype music loops used by the standalone start menu and the game route.

## Runtime Tracks

- `cozy-market-menu-loop-v1.wav` - default Sunny Market menu loop.
- `cozy-prep-counter-loop-v1.wav` - selectable Prep Counter loop.
- `cozy-picnic-skirmish-loop-v1.wav` - selectable Picnic Skirmish loop.
- `cozy-little-victory-loop-v1.wav` - selectable Little Victory loop.
- `cozy-soft-defeat-loop-v1.wav` - selectable Soft Defeat loop.
- `horror-ruined-market-loop-v1.wav` - horror-theme Ruined Market loop.
- `horror-cold-prep-table-loop-v1.wav` - horror-theme Cold Prep Table loop.
- `horror-midnight-skirmish-loop-v1.wav` - horror-theme Midnight Skirmish loop.
- `horror-false-victory-loop-v1.wav` - horror-theme False Victory loop.
- `horror-last-defeat-loop-v1.wav` - horror-theme Last Defeat loop.

## V2 Comparison Tracks

`music-v2-manifest.json` defines the ElevenLabs `music_v2` prompt set for direct comparison in `local-test-pages/music.html`.

Generate the MP3s with:

```powershell
$env:ELEVENLABS_API_KEY="..."
npm run music:v2
```

Without an ElevenLabs key, the local synthesized comparison set can be regenerated with:

```powershell
npm run music:v2:local
npm run music:v3:local
```

The generated files use the same runtime names with version suffixes, such as `cozy-market-menu-loop-v2.mp3`, `cozy-market-menu-loop-v3.mp3`, and `horror-midnight-skirmish-loop-v3.mp3`. The music test page marks them as pending until the files exist.

`start-menu.js` owns the current audio UI: music volume, SFX volume placeholder state, track selection, autoplay fallback state, and persisted settings under `harvest-friends:start-menu-settings:v1`.

`game.js` reuses the saved music volume and picks tracks by scene:

- Menu, codex, and story overlays: Sunny Market / Ruined Market.
- Prep, shop, and team planning: Prep Counter / Cold Prep Table.
- Combat: Picnic Skirmish / Midnight Skirmish.
- Victory and reward result screens: Little Victory / False Victory.
- Loss, run-over, and reboot transitions: Soft Defeat / Last Defeat.

## Notes

- The opening visual novel route does not currently have music.
- Reality-break stingers, shop-return static hits, and final epilogue music would benefit from bespoke short cues; the current loops only cover the underlying bed.
- Keep future web-runtime audio compressed or streamed-friendly before promoting it beyond prototype use.

## SFX

`assets/audio/sfx/` contains paired cozy and horror variants for runtime SFX. Event hooks use generic IDs such as `buy`, `hit`, `merge`, or `ui-confirm`; `game.js` and `start-menu.js` choose the cozy or horror file from the active theme. Regenerate the bespoke transition cues with `npm run audio:transition-sfx`.

Current SFX IDs:

- UI: `ui-hover`, `ui-confirm`, `ui-back`, `invalid`, `ledger-tick`.
- Shop and placement: `reroll`, `buy`, `sell`, `upgrade`, `freeze`, `pickup`, `drop`, `equip`, `merge`.
- Combat and results: `battle-start`, `hit`, `shield`, `heal`, `control`, `ko`, `reward`, `victory`, `defeat`, `hazard-pulse`.
- Transitions: `transition`, `reality-break`, `reality-break-stinger`, `shop-return-static`, `final-epilogue`, `reboot`, `signal-static`.
