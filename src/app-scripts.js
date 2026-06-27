(() => {
  "use strict";

  const SCRIPT_GROUPS = Object.freeze({
    startMenu: [
      ["theme-assets", "shared-modules-1"],
      ["audio-settings", "shared-modules-1"],
      ["audio-runtime", "shared-modules-3"],
      ["field-guide-runtime", "shared-modules-4"],
      ["run-storage", "shared-modules-4"],
      ["food-lob-runtime", "shared-modules-5"],
      [
        "start-menu",
        "field-guide-click-swipe-1-campaign-flow-1-root-frame-2-continue-run-1-auto-reveal-1-final-reboot-static-2-menu-theme-options-1-pages-assets-1-cozy-default-1-postgame-horror-lock-1-run-mode-select-2-shared-modules-1",
      ],
    ],
    openingVn: [
      ["audio-settings", "shared-modules-1"],
      ["audio-runtime", "shared-modules-4"],
      ["opening-vn", "highlight-fix-10-dialogue-skip-confirm-1-auto-reveal-1-story-tightening-1-shared-modules-1"],
    ],
    game: [
      ["canvas-ui", "shared-modules-1"],
      ["theme-assets", "shared-modules-1"],
      ["slot-layout", "shared-modules-1"],
      ["audio-settings", "shared-modules-1"],
      ["audio-runtime", "shared-modules-3"],
      ["shop-economy", "shared-modules-3"],
      ["card-canvas", "shared-modules-3"],
      ["canvas-text", "shared-modules-4"],
      ["runtime-assets", "shared-modules-4"],
      ["run-storage", "shared-modules-4"],
      ["interaction-runtime", "shared-modules-5"],
      ["drag-drop-runtime", "shared-modules-5"],
      ["codex-runtime", "shared-modules-5"],
      ["route-harness", "shared-modules-5"],
      ["reward-runtime", "shared-modules-6"],
      ["combat-ledger-capture", "shared-modules-6"],
      ["combat-ledger-runtime", "shared-modules-6"],
      ["options-menu-runtime", "shared-modules-6"],
      ["particle-runtime", "shared-modules-6"],
      ["battle-ability-runtime", "shared-modules-7"],
      ["trait-arena-runtime", "shared-modules-7"],
      ["merge-runtime", "shared-modules-7"],
      ["status-runtime", "shared-modules-7"],
      ["victory-reboot-runtime", "shared-modules-7"],
      ["catalog-runtime", "shared-modules-8"],
      ["shop-transaction-runtime", "shared-modules-8"],
      ["enemy-team-runtime", "shared-modules-8"],
      ["battle-item-runtime", "shared-modules-8"],
      ["battle-canvas", "shared-modules-8"],
      ["reality-fx-canvas", "shared-modules-8"],
      ["selected-panel-canvas", "shared-modules-8"],
      ["slot-canvas", "shared-modules-8"],
      ["combat-ledger-canvas", "shared-modules-2"],
      ["codex-canvas", "shared-modules-2"],
      ["transition-canvas", "shared-modules-2-deploy-result-art-1-pattern-terms-1"],
      ["story-canvas", "shared-story-canvas-1"],
      ["presentation-data", "presentation-data-level10-ui-art-clean-1"],
      ["copy-data", "copy-data-1"],
      ["story-data", "story-data-1"],
      ["trait-arena-data", "trait-arena-data-1"],
      ["unit-data", "unit-data-1"],
      ["item-data", "item-data-1"],
      ["economy-enemy-data", "economy-enemy-data-1"],
      ["rarity-shop-data", "rarity-shop-data-1"],
      ["status-effect-data", "status-effect-data-1"],
      [
        "game",
        "transition-pass-1-pre-final-1-horror-tabs-lower-1-final-reboot-static-1-reveal-meter-language-1-level10-cutscene-ui-art-clean-1-postgame-horror-lock-1-1600x1000-screens-1-infinite-mode-1-shared-story-canvas-1-random-enemy-formations-1-deploy-result-art-1-pattern-terms-1",
      ],
    ],
  });

  const entryAliases = Object.freeze({
    game: "game",
    opening: "openingVn",
    openingVn: "openingVn",
    "opening-vn": "openingVn",
    start: "startMenu",
    startMenu: "startMenu",
    "start-menu": "startMenu",
  });

  function scriptSrc(name, version) {
    return `src/${name}.js?v=${encodeURIComponent(version)}`;
  }

  function loadScript(name, version) {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.async = false;
      script.src = scriptSrc(name, version);
      script.onload = resolve;
      script.onerror = () => reject(new Error(`Failed to load ${script.src}`));
      document.body.appendChild(script);
    });
  }

  async function loadEntry(entryName) {
    const entry = entryAliases[entryName] || entryName;
    const scripts = SCRIPT_GROUPS[entry];
    if (!scripts) {
      throw new Error(`Unknown Food Animals script entry: ${entryName || "(missing)"}`);
    }
    document.documentElement.dataset.scriptEntry = entry;
    for (const [name, version] of scripts) {
      await loadScript(name, version);
    }
    document.documentElement.dataset.scriptEntryReady = "true";
  }

  const currentScript = document.currentScript;
  const requestedEntry = currentScript?.dataset.entry || document.documentElement.dataset.appEntry;

  loadEntry(requestedEntry).catch((error) => {
    document.documentElement.dataset.scriptEntryError = "true";
    console.error(error);
  });
})();
