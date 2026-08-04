(function () {
  const descriptorCaches = new WeakMap();

  function descriptor(styles, id) {
    let cache = descriptorCaches.get(styles);
    if (!cache) {
      cache = new Map();
      descriptorCaches.set(styles, cache);
    }
    if (!cache.has(id)) cache.set(id, Object.freeze({ id, ...styles[id] }));
    return cache.get(id);
  }

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
    if (unit.burn) effects.push(descriptor(styles, "burn"));
    if (unit.mark) effects.push(descriptor(styles, "mark"));
    if (unit.teamVulnerable) effects.push(descriptor(styles, "teamVulnerable"));
    if (unit.taunt) effects.push(descriptor(styles, "taunt"));
    if (unit.haste) effects.push(descriptor(styles, "haste"));
    if (unit.attackBoost) effects.push(descriptor(styles, "attackBoost"));
    if (unit.attackSlow) effects.push(descriptor(styles, "attackSlow"));
    if (unit.antiSupport) effects.push(descriptor(styles, "antiSupport"));
    if (unit.slowed) effects.push(descriptor(styles, "slowed"));
    if (unit.lateFightStacks > 0) effects.push(descriptor(styles, "lateFightStacks"));
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
