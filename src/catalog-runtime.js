(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function itemTier(value = 1, maxTier = 3) {
    return clamp(value || 1, 1, maxTier);
  }

  function itemTierScale(tier = 1, scaling = {}) {
    return scaling[itemTier(tier)] || scaling[1] || 1;
  }

  function itemLevelLabel(item, maxTier = 3) {
    return `Lv ${itemTier(item?.tier, maxTier)}`;
  }

  function itemDisplayShort(item, displayShort, maxTier = 3) {
    const tier = itemTier(item?.tier, maxTier);
    const short = displayShort(item);
    return tier > 1 ? `${short} ${tier}` : short;
  }

  function scaleItemForTier(item, tier = 1, options = {}) {
    const scale = itemTierScale(tier, options.scaling || {});
    if (scale === 1) return item;
    (options.scalableProps || []).forEach((prop) => {
      if (typeof item[prop] !== "number") return;
      const scaled = item[prop] * scale;
      item[prop] = Number.isInteger(item[prop]) ? Math.max(1, Math.round(scaled)) : Number(scaled.toFixed(4));
    });
    return item;
  }

  function makeItemData(source, tier = 1, uid, options = {}) {
    return scaleItemForTier({
      ...source,
      tier: itemTier(tier, options.maxTier || 3),
      uid,
    }, tier, options);
  }

  function tierScaling(tier, scaling = []) {
    return scaling[clamp(Math.floor(tier || 1), 1, Math.max(1, scaling.length - 1))] || scaling[1] || { hp: 1, atk: 1, ability: 1, speed: 1 };
  }

  function makeUnitData(base, tier = 1, uid, options = {}) {
    const forms = base?.forms || [];
    const form = forms[clamp(Math.floor(tier || 1) - 1, 0, Math.max(0, forms.length - 1))] || {};
    const scaling = tierScaling(tier, options.tierScaling || []);
    const hpScale = options.globalHpScale || 1;
    const maxHp = Math.round((base?.hp || 1) * scaling.hp * hpScale);
    const atk = Math.round((base?.atk || 1) * scaling.atk);
    const abilityPower = Math.max(1, Math.round((base?.atk || 1) * scaling.ability));
    const random = options.random || Math.random;
    return {
      kind: "unit",
      uid,
      typeId: base.id,
      lineName: base.name,
      name: form.name,
      short: form.short,
      emoji: base.emoji,
      rarity: base.rarity || "common",
      family: base.family || "meal",
      traits: [...(base.traits || [])],
      color: base.color,
      accent: base.accent,
      role: base.role,
      ability: base.ability || "front",
      abilityText: base.abilityText || "Front blockers",
      tier,
      hp: maxHp,
      maxHp,
      baseAtk: atk,
      atk,
      abilityPower,
      speed: Math.max(0.28, (base.speed || 1) * scaling.speed),
      cooldown: random() * 0.25,
      targetUid: null,
      shield: 0,
      x: 0,
      y: 0,
      side: "ally",
      slot: null,
      item: null,
      dead: false,
    };
  }

  function itemPrimaryStat(item) {
    const pct = (value) => `+${Math.round(value * 100)}%`;
    if (item?.drinkAttackSpeedPct) return { label: "LINE", value: pct(item.drinkAttackSpeedPct) };
    if (item?.drinkMaxHpPct) return { label: "LINE", value: pct(item.drinkMaxHpPct) };
    if (item?.drinkAbilityPowerPct) return { label: "LINE", value: pct(item.drinkAbilityPowerPct) };
    if (item?.damageBonusPct) return { label: "DMG", value: pct(item.damageBonusPct) };
    if (item?.attackSpeedPct) return { label: "SPD", value: pct(item.attackSpeedPct) };
    if (item?.maxHpBonusPct) return { label: "HP", value: pct(item.maxHpBonusPct) };
    if (item?.abilityPowerBonusPct) return { label: "PWR", value: pct(item.abilityPowerBonusPct) };
    if (item?.onAttackShieldPct) return { label: "SHLD", value: "Atk" };
    if (item?.onHitShieldPct) return { label: "SHLD", value: "Hit" };
    if (item?.shieldCrackleDamagePct) return { label: "CRKL", value: `${Math.round(item.shieldCrackleDamagePct * 100)}%` };
    if (item?.burnDamagePct) return { label: "BURN", value: `${Math.round(item.burnDamagePct * 100)}%` };
    if (item?.supportBonusPct) return { label: "SUP", value: pct(item.supportBonusPct) };
    if (item?.markDamagePct) return { label: "MARK", value: pct(item.markDamagePct) };
    if (item?.damageTakenPct) return { label: "RISK", value: pct(item.damageTakenPct) };
    if (item?.selfHealPct) return { label: "HEAL", value: "3rd" };
    if (item?.splashDamagePct) return { label: "AOE", value: `${Math.round(item.splashDamagePct * 100)}%` };
    if (item?.lateFightDamagePct) return { label: "LATE", value: pct(item.lateFightDamagePct) };
    if (item?.lowHpLifestealPct) return { label: "LOW", value: "HP" };
    if (item?.cooldownDelay) return { label: "SLOW", value: `${item.cooldownDelay.toFixed(2)}s` };
    if (item?.supportHastePct) return { label: "HASTE", value: pct(item.supportHastePct) };
    if (item?.antiSupportPct) return { label: "CUT", value: `${Math.round(item.antiSupportPct * 100)}%` };
    if (item?.receivedSupportSharePct) return { label: "SHARE", value: `${Math.round(item.receivedSupportSharePct * 100)}%` };
    if (item?.bounceDamagePct) return { label: "BNCE", value: `${Math.round(item.bounceDamagePct * 100)}%` };
    if (item?.shieldedAttackBonusPct) return { label: "SHLD", value: pct(item.shieldedAttackBonusPct) };
    if (item?.overhealShieldPct) return { label: "OVER", value: `${Math.round(item.overhealShieldPct * 100)}%` };
    if (item?.mergeProgressBonus) return { label: "MERGE", value: `+${item.mergeProgressBonus}` };
    if (item?.frontRowDamageReductionPct) return { label: "FRONT", value: `-${Math.round(item.frontRowDamageReductionPct * 100)}%` };
    if (item?.backRowTargeting) return { label: "AIM", value: "Back" };
    if (item?.adjacentStartAttackBuffPct) return { label: "BUFF", value: pct(item.adjacentStartAttackBuffPct) };
    if (item?.adjacentStartShieldPct) return { label: "SHLD", value: "Adj" };
    if (item?.pierceDamagePct) return { label: "PIERCE", value: `${Math.round(item.pierceDamagePct * 100)}%` };
    if (item?.lowHpBurnDamagePct) return { label: "BURN", value: "Low" };
    if (item?.deathSaveShieldPct) return { label: "SAVE", value: "1" };
    if (item?.firstDebuffCleanseHealPct) return { label: "CLNS", value: "1" };
    if (item?.timedHastePct) return { label: "HASTE", value: `${item.timedHasteAt}s` };
    if (item?.shieldedTargetDamagePct) return { label: "VS", value: "Shield" };
    if (item?.attackSlowPct) return { label: "SLOW", value: `${Math.round(item.attackSlowPct * 100)}%` };
    if (item?.statusDurationReductionPct) return { label: "RESIST", value: `${Math.round(item.statusDurationReductionPct * 100)}%` };
    if (item?.statusDamageReductionPct) return { label: "AOE", value: `-${Math.round(item.statusDamageReductionPct * 100)}%` };
    if (item?.decoyHpPct) return { label: "DECOY", value: `${Math.round(item.decoyHpPct * 100)}%` };
    if (item?.firstHitRedirect) return { label: "HIT", value: "Block" };
    if (item?.periodicDamage) return { label: "POP", value: item.periodicDamage };
    if (item?.sellBonusGold) return { label: "SELL", value: { currency: item.sellBonusGold, sign: "+" } };
    if (item?.surviveGold) return { label: "GOLD", value: { currency: item.surviveGold, sign: "+" } };
    if (item?.firstItemDiscountGold) return { label: "SALE", value: { currency: item.firstItemDiscountGold, sign: "-" } };
    if (item?.sameLineShopChancePct) return { label: "ODDS", value: pct(item.sameLineShopChancePct) };
    if (item?.extraAdjacentHealPct) return { label: "HEAL", value: "Splash" };
    if (item?.shieldCapBonusPct) return { label: "CAP", value: pct(item.shieldCapBonusPct) };
    if (item?.statusDurationBonusPct) return { label: "STAT", value: pct(item.statusDurationBonusPct) };
    if (item?.supportAttackBuffPct) return { label: "BUFF", value: pct(item.supportAttackBuffPct) };
    if (item?.battleStartHpLossPct) return { label: "RISK", value: `-${Math.round(item.battleStartHpLossPct * 100)}%` };
    if (item?.firstAttacksBonusPct) return { label: "BURST", value: `${item.firstAttacksCount}` };
    if (item?.selfBurnDamagePct) return { label: "BURN", value: "Self" };
    if (item?.shieldedAttackSpeedPct) return { label: "SPD", value: "Shield" };
    if (item?.teamVulnerabilityPct) return { label: "VULN", value: pct(item.teamVulnerabilityPct) };
    if (item?.executeSplashDamagePct) return { label: "EXEC", value: "Splash" };
    if (item?.teamOverhealShieldPct) return { label: "OVER", value: "Team" };
    if (item?.teamHastePct) return { label: "HASTE", value: "Team" };
    if (item?.supportRowEchoPct) return { label: "ROW", value: "Echo" };
    return { label: "ITEM", value: "On" };
  }

  window.FoodAnimalsCatalogRuntime = {
    itemDisplayShort,
    itemLevelLabel,
    itemPrimaryStat,
    itemTier,
    itemTierScale,
    makeItemData,
    makeUnitData,
    scaleItemForTier,
    tierScaling,
  };
})();
