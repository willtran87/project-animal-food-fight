(function () {
  function stageForCount(trait, count) {
    return (trait?.thresholds || []).reduce((stage, threshold) => (count >= threshold.count ? stage + 1 : stage), 0);
  }

  function countForUnits(units, traitIds) {
    const counts = Object.fromEntries(traitIds.map((id) => [id, 0]));
    units
      .filter((unit) => unit && !unit.ignoreTraits)
      .forEach((unit) => {
        (unit.traits || []).forEach((traitId) => {
          counts[traitId] = (counts[traitId] || 0) + 1;
        });
      });
    return counts;
  }

  function snapshotForUnits(units, traits, options = {}) {
    const counts = countForUnits(units, Object.keys(traits));
    return Object.keys(traits).map((id) => {
      const info = options.infoFor ? options.infoFor(id) : traits[id];
      const count = counts[id] || 0;
      const stage = options.stageForCount ? options.stageForCount(id, count) : stageForCount(info, count);
      const next = (info.thresholds || []).find((threshold) => count < threshold.count);
      return {
        id,
        label: info.label,
        short: info.short,
        color: info.color,
        count,
        stage,
        active: stage > 0,
        effect: options.effectText ? options.effectText(id, stage) : (info.thresholds?.[stage - 1]?.text || ""),
        nextAt: next?.count || null,
      };
    });
  }

  function compactSnapshot(snapshot) {
    return snapshot
      .filter((trait) => trait.count > 0)
      .sort((a, b) => (b.active - a.active) || b.stage - a.stage || b.count - a.count || a.label.localeCompare(b.label));
  }

  function hasTrait(unit, traitId) {
    return Boolean(unit && !unit.ignoreTraits && unit.traits?.includes(traitId));
  }

  function hasAnyTrait(unit, traits = []) {
    return traits.some((traitId) => hasTrait(unit, traitId));
  }

  function hasAnyFamily(unit, families = []) {
    return families.includes(unit?.family);
  }

  function statusDurationBonus(arena, source) {
    if (!source) return 0;
    if (arena?.id === "spice_bazaar" && (hasAnyTrait(source, ["spicy"]) || hasAnyFamily(source, ["spice", "fermented"]))) return 0.16;
    if (arena?.id === "frozen_parfait_peak" && hasAnyFamily(source, ["dairy"])) return 0.16;
    return 0;
  }

  function attackClockBonus(arena, unit) {
    if (!unit) return 0;
    if (arena?.id === "rainy_fish_market" && hasTrait(unit, "ocean")) return 0.08;
    if (arena?.id === "street_festival" && hasAnyTrait(unit, ["street_food", "spicy", "snack"])) return 0.06;
    if (arena?.id === "frozen_parfait_peak" && hasAnyTrait(unit, ["ocean", "street_food"])) return -0.06;
    return 0;
  }

  function supportMultiplier(arena, unit) {
    if (!unit) return 1;
    let multiplier = 1;
    if (arena?.id === "spice_bazaar" && hasTrait(unit, "sweet")) multiplier *= 0.94;
    if (arena?.id === "dim_sum_kitchen" && hasTrait(unit, "street_food")) multiplier *= 1.08;
    return multiplier;
  }

  function damageMultiplier(arena, source, target, options = {}) {
    if (!source || !target) return 1;
    let multiplier = 1;
    if (!options.status && arena?.id === "rainy_fish_market" && hasTrait(source, "ocean") && target.col === options.backCol) multiplier *= 1.1;
    if (!options.status && arena?.id === "street_festival" && hasAnyTrait(source, ["street_food", "spicy", "snack"])) {
      if ((source.arenaFestivalHits || 0) < 3) {
        multiplier *= 1.1;
        source.arenaFestivalHits = (source.arenaFestivalHits || 0) + 1;
      }
    }
    if (arena?.id === "spice_bazaar" && hasAnyTrait(source, ["spicy", "street_food"])) multiplier *= options.status ? 1.1 : 1.06;
    if (!options.status && arena?.id === "frozen_parfait_peak" && hasTrait(source, "sweet") && (options.elapsed || 0) >= 6) multiplier *= 1.1;
    if (!options.status && arena?.id === "dim_sum_kitchen" && hasTrait(source, "sweet") && source.col === options.backCol) multiplier *= 0.92;
    if (!options.status && arena?.id === "spice_bazaar" && hasTrait(target, "sweet")) multiplier *= 1.04;
    if (!options.status && arena?.id === "street_festival" && target.col === options.frontCol) multiplier *= 1.06;
    if (!options.status && arena?.id === "dim_sum_kitchen" && target.col === options.frontCol && hasAnyTrait(target, ["snack", "breakfast"])) multiplier *= 0.9;
    return multiplier;
  }

  window.FoodAnimalsTraitArenaRuntime = {
    attackClockBonus,
    compactSnapshot,
    countForUnits,
    damageMultiplier,
    hasAnyFamily,
    hasAnyTrait,
    hasTrait,
    snapshotForUnits,
    stageForCount,
    statusDurationBonus,
    supportMultiplier,
  };
})();
