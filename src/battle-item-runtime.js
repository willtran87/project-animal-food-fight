(function () {
  function adjacent(a, b) {
    return Math.abs((a?.col ?? 0) - (b?.col ?? 0)) + Math.abs((a?.row ?? 0) - (b?.row ?? 0)) <= 1;
  }

  function onAttackShield(unit) {
    return Math.max(1, Math.round(unit.maxHp * unit.item.onAttackShieldPct + unit.abilityPower * 0.18));
  }

  function selfHealReady(unit) {
    return Boolean(unit?.item?.selfHealPct && unit.itemAttackCount % (unit.item.everyNAttacks || 3) === 0);
  }

  function selfHealAmount(unit) {
    return Math.max(1, Math.round(unit.maxHp * unit.item.selfHealPct));
  }

  function splashTargets(target, foes) {
    return foes.filter((foe) => !foe.dead && foe.uid !== target.uid && adjacent(target, foe));
  }

  function nearestBounceTarget(target, foes, distSq) {
    return foes
      .filter((foe) => !foe.dead && foe.uid !== target.uid)
      .sort((a, b) => distSq(target, a) - distSq(target, b))[0] || null;
  }

  function pierceTarget(target, foes) {
    return foes
      .filter((foe) => !foe.dead && foe.uid !== target.uid && foe.row === target.row && foe.col < target.col)
      .sort((a, b) => b.col - a.col)[0] || null;
  }

  function executeSplashReady(unit, target) {
    return Boolean(target && unit?.item?.executeSplashDamagePct && target.hp / target.maxHp <= (unit.item.executeSplashThreshold || 0.45));
  }

  function lowHpBurnReady(unit) {
    return Boolean(unit?.item?.lowHpBurnDamagePct && !unit.lowHpBurnUsed && !unit.dead && unit.hp / unit.maxHp <= (unit.item.lowHpBurnThreshold || 0.4));
  }

  function statusDurationItem(item, key, fallback) {
    return item?.[key] || fallback;
  }

  function startItemEffectSummary(unit, units, options = {}) {
    if (!unit?.item || unit.dead) return { adjacentAllies: [], createsDecoy: false };
    return {
      hpAfterLoss: unit.item.battleStartHpLossPct ? Math.max(1, Math.round(unit.maxHp * (1 - unit.item.battleStartHpLossPct))) : unit.hp,
      adjacentAllies: units.filter((ally) => !ally.dead && adjacent(unit, ally)),
      createsDecoy: Boolean(unit.item.decoyHpPct),
      decoyHp: unit.item.decoyHpPct ? Math.max(1, Math.round(unit.maxHp * unit.item.decoyHpPct)) : 0,
      shieldAmount: unit.item.adjacentStartShieldPct ? Math.max(1, Math.round(unit.maxHp * unit.item.adjacentStartShieldPct)) : 0,
      attackBoost: unit.item.adjacentStartAttackBuffPct || 0,
      attackBoostDuration: unit.item.adjacentStartBuffDuration || 4,
      accent: unit.item.accent || options.defaultAccent || "#d6b88a",
    };
  }

  window.FoodAnimalsBattleItemRuntime = {
    adjacent,
    executeSplashReady,
    lowHpBurnReady,
    nearestBounceTarget,
    onAttackShield,
    pierceTarget,
    selfHealAmount,
    selfHealReady,
    splashTargets,
    startItemEffectSummary,
    statusDurationItem,
  };
})();
