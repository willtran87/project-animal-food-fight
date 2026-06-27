(function () {
  function distSq(a, b) {
    return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
  }

  function canAttackBackRow(unit, backCol) {
    return unit?.ability === "back_row" || (unit?.item?.backRowTargeting && unit.col === backCol);
  }

  function frontmostOccupiedColumn(units, backCol) {
    return units.reduce((front, unit) => Math.max(front, unit.col ?? front), backCol);
  }

  function backmostOccupiedColumn(units, frontCol) {
    return units.reduce((back, unit) => Math.min(back, unit.col ?? back), frontCol);
  }

  function nearest(unit, foes) {
    return foes.reduce((best, next) => (distSq(unit, next) < distSq(unit, best) ? next : best), foes[0]);
  }

  function weakest(units) {
    const living = units.filter((unit) => !unit.dead);
    if (!living.length) return null;
    return living.reduce((best, next) => (next.hp / next.maxHp < best.hp / best.maxHp ? next : best), living[0]);
  }

  function weakestDamaged(units) {
    const damaged = units.filter((unit) => !unit.dead && unit.hp < unit.maxHp);
    return damaged.length ? weakest(damaged) : null;
  }

  function weakestEnemy(units) {
    return units.reduce((best, next) => {
      const bestScore = best.hp / best.maxHp;
      const nextScore = next.hp / next.maxHp;
      if (nextScore !== bestScore) return nextScore < bestScore ? next : best;
      return next.hp < best.hp ? next : best;
    }, units[0]);
  }

  function lowestShieldedAlly(units) {
    const living = units.filter((unit) => !unit.dead);
    if (!living.length) return null;
    return living.reduce((best, next) => {
      const bestShield = best.shield || 0;
      const nextShield = next.shield || 0;
      if (nextShield !== bestShield) return nextShield < bestShield ? next : best;
      return next.hp / next.maxHp < best.hp / best.maxHp ? next : best;
    }, living[0]);
  }

  function chooseTarget(unit, foes, options = {}) {
    const living = foes.filter((foe) => !foe.dead);
    if (!living.length) return null;
    const taunting = living.filter((foe) => foe.taunt?.remaining > 0);
    if (taunting.length) return nearest(unit, taunting);
    const frontCol = options.frontCol ?? 2;
    const backCol = options.backCol ?? 0;
    const targetColumn = canAttackBackRow(unit, backCol) ? backmostOccupiedColumn(living, frontCol) : frontmostOccupiedColumn(living, backCol);
    const candidates = living.filter((foe) => foe.col === targetColumn);
    if (unit.ability === "execute" && !canAttackBackRow(unit, backCol)) return weakestEnemy(living);
    return nearest(unit, candidates.length ? candidates : living);
  }

  function attackClockMultiplier(unit, options = {}) {
    let multiplier = 1 + (unit.haste?.pct || 0);
    multiplier += unit.drinkAttackSpeedPct || 0;
    multiplier *= 1 - Math.min(0.7, unit.attackSlow?.pct || 0);
    if (options.hasFavoriteTopping) multiplier += 0.04;
    multiplier += options.arenaAttackClockBonus || 0;
    const streetStage = options.streetStage || 0;
    if (streetStage > 0) multiplier += [0, 0.08, 0.16, 0.26][streetStage] || 0.26;
    if (unit.ability === "kernel_combo" && unit.kernelStacks > 0) multiplier += Math.min(0.65, unit.kernelStacks * (options.kernelHaste || 0));
    if (unit.item?.lowHpAttackSpeedPct && unit.hp / unit.maxHp <= (unit.item.lowHpThreshold || 0.5)) multiplier += unit.item.lowHpAttackSpeedPct;
    if (unit.item?.shieldedAttackSpeedPct && unit.shield > 0) multiplier += unit.item.shieldedAttackSpeedPct;
    if (unit.item?.exhaustedSpeedPenaltyPct && (unit.itemAttackCount || 0) >= (unit.item.firstAttacksCount || 3)) multiplier *= 1 - unit.item.exhaustedSpeedPenaltyPct;
    return Math.max(0.25, multiplier);
  }

  window.FoodAnimalsBattleAbilityRuntime = {
    attackClockMultiplier,
    backmostOccupiedColumn,
    canAttackBackRow,
    chooseTarget,
    distSq,
    frontmostOccupiedColumn,
    lowestShieldedAlly,
    nearest,
    weakest,
    weakestDamaged,
    weakestEnemy,
  };
})();
