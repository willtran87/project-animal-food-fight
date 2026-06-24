# Project Animal Food Fight

A browser-playable food-animal auto-battler prototype.

## Play

Open `index.html` in a browser, or use the GitHub Pages link once Pages is enabled for this repository.

## Local Development

This is a static HTML/CSS/JavaScript project.

```powershell
python -m http.server 8173
```

Then visit:

```text
http://127.0.0.1:8173
```

## Smoke Test

Use the deterministic smoke scenario when running `test-actions-basic.json`:

```text
http://127.0.0.1:8173/?smoke=basic
```

## Contents

- `index.html`, `styles.css`, `game.js`: the playable game
- `assets/`: runtime game art used by the browser build
- `tools/`: local asset-processing utilities
- `test-actions-*.json`: browser interaction payloads used during smoke testing
