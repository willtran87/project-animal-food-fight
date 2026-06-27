(function () {
  function duration(source, baseDuration, options = {}) {
    return baseDuration * (1 + (source?.item?.statusDurationBonusPct || 0) + (options.favoriteBonusPct || 0) * 0.75 + (options.arenaBonus || 0));
  }

  function cooldownDelayResistance(unit, options = {}) {
    if (!unit || unit.dead) return 0;
    let resistance = unit.item?.statusDurationReductionPct || 0;
    const freshStage = options.freshStage || 0;
    if (freshStage > 0) resistance += [0, 0.15, 0.25, 0.4][freshStage] || 0.4;
    return Math.min(0.7, resistance);
  }

  function appliedCooldownDelay(amount, resistance) {
    return Number(Math.max(0, amount * (1 - resistance)).toFixed(3));
  }

  function negativeStatusStep(dt, options = {}) {
    let step = dt * (1 + (options.itemReductionPct || 0)) * (options.arenaMultiplier || 1);
    const freshStage = options.freshStage || 0;
    if (freshStage > 0) step *= 1 + ([0, 0.15, 0.25, 0.4][freshStage] || 0.4);
    return step;
  }

  function activeEffects(unit, styles, options = {}) {
    const effects = [];
    if (unit.burn) effects.push({ id: "burn", ...styles.burn });
    if (unit.mark) effects.push({ id: "mark", ...styles.mark });
    if (unit.teamVulnerable) effects.push({ id: "teamVulnerable", ...styles.teamVulnerable });
    if (unit.taunt) effects.push({ id: "taunt", ...styles.taunt });
    if (unit.haste) effects.push({ id: "haste", ...styles.haste });
    if (unit.attackBoost) effects.push({ id: "attackBoost", ...styles.attackBoost });
    if (unit.attackSlow) effects.push({ id: "attackSlow", ...styles.attackSlow });
    if (unit.antiSupport) effects.push({ id: "antiSupport", ...styles.antiSupport });
    if (unit.slowed) effects.push({ id: "slowed", ...styles.slowed });
    if (unit.lateFightStacks > 0) effects.push({ id: "lateFightStacks", ...styles.lateFightStacks });
    if (unit.moldStacks > 0 && options.moldEffect) effects.push(options.moldEffect);
    return effects;
  }

  window.FoodAnimalsStatusRuntime = {
    activeEffects,
    appliedCooldownDelay,
    cooldownDelayResistance,
    duration,
    negativeStatusStep,
  };
})();
