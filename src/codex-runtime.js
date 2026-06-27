(function () {
  function labelFromMap(value, labels, fallback = "All") {
    return labels[value] || fallback;
  }

  function filterOptions(tabId, key, data) {
    if (key === "rarity") return ["all", ...Object.keys(data.rarities || {})];
    if (tabId === "food" && key === "trait") return ["all", ...Object.keys(data.traits || {})];
    if (tabId === "food" && key === "role") return ["all", "damage", "support", "control", "economy", "scaling"];
    if (tabId === "toppings" && key === "effect") return ["all", "offense", "defense", "support", "utility", "economy"];
    if (tabId === "drinks" && key === "stat") return ["all", "speed", "hp", "pwr", "pulse"];
    if (tabId === "drinks" && key === "trait") return ["all", ...Object.keys(data.traits || {})];
    return ["all"];
  }

  function filterDefs(tabId, filters, labelFor) {
    if (tabId === "food") {
      return [
        { key: "rarity", label: labelFor(tabId, "rarity", filters.rarity) },
        { key: "trait", label: labelFor(tabId, "trait", filters.trait) },
        { key: "role", label: labelFor(tabId, "role", filters.role) },
      ];
    }
    if (tabId === "toppings") {
      return [
        { key: "rarity", label: labelFor(tabId, "rarity", filters.rarity) },
        { key: "effect", label: labelFor(tabId, "effect", filters.effect) },
      ];
    }
    return [
      { key: "rarity", label: labelFor(tabId, "rarity", filters.rarity) },
      { key: "stat", label: labelFor(tabId, "stat", filters.stat) },
      { key: "trait", label: labelFor(tabId, "trait", filters.trait) },
    ];
  }

  function memoKey(tabId, filters, theme = "") {
    return `${theme}|${tabId}|${Object.keys(filters || {}).sort().map((key) => `${key}:${filters[key]}`).join("|")}`;
  }

  function filterEntries(entries, tabId, filters, callbacks) {
    return (entries || []).filter((entry) => {
      if (filters.rarity !== "all" && (entry.rarity || "common") !== filters.rarity) return false;
      if (tabId === "food") {
        if (filters.trait !== "all" && !entry.traits?.includes(filters.trait)) return false;
        if (filters.role !== "all" && callbacks.foodRoleGroup(entry) !== filters.role) return false;
        return true;
      }
      if (tabId === "toppings") {
        if (filters.effect !== "all" && callbacks.toppingEffectGroup(entry) !== filters.effect) return false;
        return true;
      }
      if (!callbacks.drinkMatchesStatFilter(entry, filters.stat)) return false;
      if (filters.trait !== "all" && !entry.pairTraits?.includes(filters.trait)) return false;
      return true;
    });
  }

  function sortEntries(entries, rarityRank) {
    return [...(entries || [])].sort((a, b) => {
      const rarityDiff = rarityRank(a.rarity) - rarityRank(b.rarity);
      if (rarityDiff) return rarityDiff;
      return String(a.name || "").localeCompare(String(b.name || ""));
    });
  }

  function currentEntry(visibleEntries, state) {
    if (state.codexTab === "toppings") {
      const id = state.codexSelectedToppingId || visibleEntries[0]?.id;
      return visibleEntries.find((item) => item.id === id) || visibleEntries[0] || null;
    }
    if (state.codexTab === "drinks") {
      const id = state.codexSelectedDrinkId || visibleEntries[0]?.id;
      return visibleEntries.find((item) => item.id === id) || visibleEntries[0] || null;
    }
    const id = state.codexSelectedId || visibleEntries[0]?.id;
    return visibleEntries.find((animal) => animal.id === id) || visibleEntries[0] || null;
  }

  function resetPreview(existing = {}) {
    return {
      ...existing,
      zoom: 1,
      panX: 0,
      panY: 0,
      dragging: false,
      startX: 0,
      startY: 0,
      startPanX: 0,
      startPanY: 0,
    };
  }

  function clampPreview(view = {}) {
    view.zoom = 1;
    view.panX = 0;
    view.panY = 0;
    view.dragging = false;
    return view;
  }

  window.FoodAnimalsCodexRuntime = {
    clampPreview,
    currentEntry,
    filterDefs,
    filterEntries,
    filterOptions,
    labelFromMap,
    memoKey,
    resetPreview,
    sortEntries,
  };
})();
