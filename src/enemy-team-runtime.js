(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function stochasticRound(value, random = Math.random) {
    const sign = value < 0 ? -1 : 1;
    const magnitude = Math.abs(value);
    const floor = Math.floor(magnitude);
    return sign * (floor + (random() < magnitude - floor ? 1 : 0));
  }

  function weightedChoice(entries, weightFor, random = Math.random) {
    if (!entries?.length) return null;
    const total = entries.reduce((sum, entry) => sum + Math.max(0, weightFor(entry) || 0), 0);
    if (total <= 0) return entries[Math.floor(random() * entries.length)];
    let roll = random() * total;
    for (const entry of entries) {
      roll -= Math.max(0, weightFor(entry) || 0);
      if (roll <= 0) return entry;
    }
    return entries[entries.length - 1];
  }

  function enemyArchetypeRarityBias(archetype) {
    if (archetype?.id === "juggernaut" || archetype?.id === "arsenal") return 1;
    if (archetype?.id === "horde") return -1;
    return 0;
  }

  function blendedEnemyBias(primary, secondary, key, primaryShare, secondaryShare, min, max, noise = 0) {
    const base = (primary[key] || 0) * primaryShare + (secondary[key] || 0) * secondaryShare;
    return clamp(base + noise, min, max);
  }

  function blendEnemyArchetypes(primaryArchetype, secondaryArchetype, options = {}) {
    const primary = primaryArchetype || options.fallback;
    const secondary = secondaryArchetype || primary;
    const hasSecondary = secondary?.id !== primary?.id;
    const primaryShare = hasSecondary ? options.primaryShare ?? 0.66 : 1;
    const secondaryShare = hasSecondary ? 1 - primaryShare : 0;
    const noiseFor = options.noiseFor || (() => 0);
    return {
      id: hasSecondary ? `${primary.id}_${secondary.id}` : primary.id,
      label: hasSecondary ? `${primary.label} + ${secondary.label}` : primary.label,
      countBias: blendedEnemyBias(primary, secondary, "countBias", primaryShare, secondaryShare, -1, 1, noiseFor("countBias")),
      tierBias: blendedEnemyBias(primary, secondary, "tierBias", primaryShare, secondaryShare, -0.16, 0.16, noiseFor("tierBias")),
      tier3Bias: blendedEnemyBias(primary, secondary, "tier3Bias", primaryShare, secondaryShare, -0.06, 0.07, noiseFor("tier3Bias")),
      statBias: blendedEnemyBias(primary, secondary, "statBias", primaryShare, secondaryShare, -0.05, 0.05, noiseFor("statBias")),
      itemBias: blendedEnemyBias(primary, secondary, "itemBias", primaryShare, secondaryShare, -1, 1, noiseFor("itemBias")),
      drinkBias: blendedEnemyBias(primary, secondary, "drinkBias", primaryShare, secondaryShare, -1, 1, noiseFor("drinkBias")),
      traitFocus: blendedEnemyBias(primary, secondary, "traitFocus", primaryShare, secondaryShare, 0.18, 0.72, noiseFor("traitFocus")),
      rarityBias: blendedEnemyBias(
        { rarityBias: enemyArchetypeRarityBias(primary) },
        { rarityBias: enemyArchetypeRarityBias(secondary) },
        "rarityBias",
        primaryShare,
        secondaryShare,
        -1,
        1
      ),
    };
  }

  function enemyRarityWeights(round, archetype = {}, latePressure = 0) {
    const bias = typeof archetype.rarityBias === "number" ? archetype.rarityBias : enemyArchetypeRarityBias(archetype);
    return {
      common: 100,
      uncommon: Math.max(0, Math.round(13 + round * 1.9 + bias * 5.5)),
      rare: Math.max(0, Math.round((round - 3) * 2.2 + latePressure * 0.68 + bias * 3.25)),
      epic: Math.max(0, Math.round((round - 8) * 1.15 + latePressure * 0.78 + bias * 1.45)),
    };
  }

  function enemyTierForPlan(plan, random = Math.random) {
    const tier4Chance = Math.min(plan.tier4Chance || 0, plan.targetExtraTier / 3);
    const remainingExtraTier = Math.max(0, plan.targetExtraTier - tier4Chance * 3);
    const tier3Chance = Math.min(plan.tier3Chance, remainingExtraTier / 2);
    const tier2Chance = clamp(remainingExtraTier - tier3Chance * 2, 0, 0.82);
    const roll = random();
    if (roll < tier4Chance) return 4;
    if (roll < tier4Chance + tier3Chance) return 3;
    if (roll < tier4Chance + tier3Chance + tier2Chance) return 2;
    return 1;
  }

  function enemySupportCount(round, max, every, bias = 0, random = Math.random) {
    const base = 1 + Math.floor(round / every);
    const jitterRoll = random();
    const jitter = round <= 1 ? 0 : jitterRoll < 0.18 ? -1 : jitterRoll > 0.84 ? 1 : 0;
    return Math.max(0, Math.min(max, base + stochasticRound(bias, random) + jitter));
  }

  function reservedColumnSlots(bossSlot, rows, cols, slotGrid) {
    const { col } = slotGrid(bossSlot);
    return new Set(Array.from({ length: rows }, (_, row) => row * cols + col));
  }

  function enemyPlanText(plan) {
    return {
      archetype: plan.archetypeId,
      label: plan.archetypeLabel,
      primaryArchetype: plan.primaryArchetypeId,
      primaryLabel: plan.primaryArchetypeLabel,
      secondaryArchetype: plan.secondaryArchetypeId,
      secondaryLabel: plan.secondaryArchetypeLabel,
      themeTrait: plan.themeTrait,
      count: plan.count,
      minimumUnitCount: plan.minimumUnitCount || 0,
      giraffeBoss: Boolean(plan.giraffeBoss),
      bossTypeId: plan.bossTypeId || null,
      bossSlot: Number.isInteger(plan.bossSlot) ? plan.bossSlot : null,
      toppingCount: plan.toppingCount,
      drinkCount: plan.drinkCount,
      economyBudget: plan.economyBudget || 0,
      unitBudget: plan.unitBudget || 0,
      toppingBudget: plan.toppingBudget || 0,
      drinkBudget: plan.drinkBudget || 0,
      economyJitterPct: Number((((plan.economyJitter || 1) - 1) * 100).toFixed(1)),
      post20Pressure: Number((plan.post20Pressure || 0).toFixed(2)),
      unitSpend: plan.unitSpend || 0,
      toppingSpend: plan.toppingSpend || 0,
      drinkSpend: plan.drinkSpend || 0,
      positionSpend: plan.positionSpend || 0,
      expectedPlayerPower: plan.expectedPlayerPower || 0,
      targetPlayerPower: plan.targetPlayerPower || 0,
      hpMultiplier: Number(plan.hpMultiplier.toFixed(2)),
      atkMultiplier: Number(plan.atkMultiplier.toFixed(2)),
      targetExtraTier: Number(plan.targetExtraTier.toFixed(2)),
      tier3ChancePct: Number((plan.tier3Chance * 100).toFixed(1)),
      tier4ChancePct: Number(((plan.tier4Chance || 0) * 100).toFixed(1)),
      adaptivePressurePct: Number(((plan.adaptivePressure || 0) * 100).toFixed(1)),
      shopPowerStatBonusPct: Number(((plan.shopPowerStatBonus || 0) * 100).toFixed(1)),
      shopPowerTierBonusPct: Number(((plan.shopPowerTierBonus || 0) * 100).toFixed(1)),
      shopPowerTier3BonusPct: Number(((plan.shopPowerTier3Bonus || 0) * 100).toFixed(1)),
      rarityWeights: { ...plan.rarityWeights },
    };
  }

  window.FoodAnimalsEnemyTeamRuntime = {
    blendEnemyArchetypes,
    blendedEnemyBias,
    enemyArchetypeRarityBias,
    enemyPlanText,
    enemyRarityWeights,
    enemySupportCount,
    enemyTierForPlan,
    reservedColumnSlots,
    stochasticRound,
    weightedChoice,
  };
})();
