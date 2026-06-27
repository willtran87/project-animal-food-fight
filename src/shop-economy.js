(function () {
  function levelIndex(level, levels) {
    return Math.max(0, Math.min((levels?.length || 1) - 1, (level || 1) - 1));
  }

  function slotUnlockCost(costs, index) {
    return costs?.[index] ?? costs?.[(costs?.length || 1) - 1] ?? 0;
  }

  function levelInfo(levels, level) {
    return levels?.[levelIndex(level, levels)] || levels?.[0] || null;
  }

  function upgradeCost(levels, level, discountGold = 0) {
    const baseCost = levelInfo(levels, level)?.upgradeCost;
    if (baseCost === null || baseCost === undefined) return null;
    return Math.max(0, baseCost - (discountGold || 0));
  }

  function rarityWeights(levels, level) {
    return { ...(levelInfo(levels, level)?.rarityWeights || {}) };
  }

  function levelChance(chances, maxLevel, level, fallback) {
    return chances?.[Math.max(1, Math.min(maxLevel, level || 1))] ?? fallback;
  }

  function itemChance(drinkChance, toppingChance, cap = 0.95) {
    return Math.min(cap, drinkChance + toppingChance);
  }

  function entryTierChances(level) {
    const completedUpgrades = Math.max(0, (level || 1) - 1);
    if (completedUpgrades >= 5) return { tier2: 0.3, tier3: 0.15 };
    if (completedUpgrades >= 4) return { tier2: 0.25, tier3: 0.1 };
    if (completedUpgrades >= 2) return { tier2: 0.1, tier3: 0 };
    return { tier2: 0, tier3: 0 };
  }

  function rollEntryTier(level, random = Math.random) {
    const chances = entryTierChances(level);
    const roll = random();
    if (roll < chances.tier3) return 3;
    if (roll < chances.tier3 + chances.tier2) return 2;
    return 1;
  }

  function rollCost(economy, freeRolls, rollsThisRound) {
    if (Math.floor(Number(freeRolls) || 0) > 0) return 0;
    const baseCost = Math.max(0, Math.floor(Number(economy?.rollCost) || 0));
    const paidRolls = Math.max(0, Math.floor(Number(rollsThisRound) || 0));
    return baseCost * (paidRolls + 1);
  }

  function startingFreeRolls(economy) {
    return Math.max(0, Math.floor(economy?.freeRollsPerShopLevel || 0));
  }

  function chooseRarity(rarities, weights, random = Math.random) {
    const entries = Object.values(rarities || {})
      .map((rarity) => ({ ...rarity, shopWeight: weights?.[rarity.id] || 0 }))
      .filter((rarity) => rarity.shopWeight > 0);
    const total = entries.reduce((sum, rarity) => sum + rarity.shopWeight, 0);
    if (total <= 0) return "common";
    let roll = random() * total;
    for (const rarity of entries) {
      roll -= rarity.shopWeight;
      if (roll <= 0) return rarity.id;
    }
    return entries[entries.length - 1]?.id || "common";
  }

  function tierCostMultiplier(multipliers, tier) {
    return multipliers?.[Math.min(3, Math.max(1, tier || 1))] || 1;
  }

  window.FoodAnimalsShopEconomy = {
    chooseRarity,
    entryTierChances,
    itemChance,
    levelChance,
    levelInfo,
    rarityWeights,
    rollCost,
    rollEntryTier,
    slotUnlockCost,
    startingFreeRolls,
    tierCostMultiplier,
    upgradeCost,
  };
})();
