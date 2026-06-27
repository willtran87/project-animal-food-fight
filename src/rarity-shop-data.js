(() => {
  "use strict";

  const RARITIES = {
    common: {
      id: "common",
      label: "Common",
      short: "C",
      shopWeight: 100,
      fill: "#6b9d5d",
      text: "#f8f5df",
      stroke: "#16392d",
    },
    uncommon: {
      id: "uncommon",
      label: "Uncommon",
      short: "U",
      shopWeight: 24,
      fill: "#4d9d95",
      text: "#f8f5df",
      stroke: "#16392d",
    },
    rare: {
      id: "rare",
      label: "Rare",
      short: "R",
      shopWeight: 8,
      fill: "#5a78c8",
      text: "#f8f5df",
      stroke: "#16392d",
    },
    epic: {
      id: "epic",
      label: "Epic",
      short: "E",
      shopWeight: 2,
      fill: "#9a5bbf",
      text: "#f8f5df",
      stroke: "#16392d",
    },
  };
  const HORROR_RARITIES = {
    common: {
      fill: "#76ff55",
      text: "#06100c",
      stroke: "#c8ff8a",
      glow: "rgba(118, 255, 85, 0.28)",
    },
    uncommon: {
      fill: "#31f8ff",
      text: "#06100c",
      stroke: "#b8ffff",
      glow: "rgba(49, 248, 255, 0.38)",
    },
    rare: {
      fill: "#4d7dff",
      text: "#f4fff6",
      stroke: "#9cc2ff",
      glow: "rgba(77, 125, 255, 0.52)",
    },
    epic: {
      fill: "#ff4dff",
      text: "#06100c",
      stroke: "#ffc8ff",
      glow: "rgba(255, 77, 255, 0.58)",
    },
  };
  const SHOP_LEVELS = [
    {
      level: 1,
      upgradeCost: 50,
      rarityWeights: { common: 100, uncommon: 22, rare: 0, epic: 0 },
    },
    {
      level: 2,
      upgradeCost: 75,
      rarityWeights: { common: 90, uncommon: 32, rare: 10, epic: 0 },
    },
    {
      level: 3,
      upgradeCost: 105,
      rarityWeights: { common: 72, uncommon: 42, rare: 22, epic: 6 },
    },
    {
      level: 4,
      upgradeCost: 140,
      rarityWeights: { common: 58, uncommon: 42, rare: 30, epic: 14 },
    },
    {
      level: 5,
      upgradeCost: 180,
      rarityWeights: { common: 46, uncommon: 40, rare: 34, epic: 18 },
    },
    {
      level: 6,
      upgradeCost: null,
      rarityWeights: { common: 25, uncommon: 27.5, rare: 27.5, epic: 20 },
    },
  ];
  const MAX_SHOP_LEVEL = SHOP_LEVELS.length;

  window.FoodAnimalsRarityShopData = Object.freeze({
    HORROR_RARITIES,
    MAX_SHOP_LEVEL,
    RARITIES,
    SHOP_LEVELS,
  });
})();
