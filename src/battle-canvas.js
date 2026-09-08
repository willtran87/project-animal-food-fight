(function () {
  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function battleDrinkSlotPosition(side, slot, formation, boardRows) {
    if (slot.axis === "row") {
      return {
        x: side === "ally"
          ? formation.allyBaseX - formation.colGap
          : formation.enemyBaseX + formation.colGap,
        y: formation.topY + slot.targetIndex * formation.rowGap,
      };
    }
    return {
      x: side === "ally"
        ? formation.allyBaseX + slot.targetIndex * formation.colGap
        : formation.enemyBaseX - slot.targetIndex * formation.colGap,
      y: formation.topY + boardRows * formation.rowGap,
    };
  }

  function unitRenderColumn(unit, frontCol, slotGrid) {
    if (Number.isFinite(unit?.col)) return unit.col;
    if (Number.isInteger(unit?.slot)) return slotGrid(unit.slot).col;
    return frontCol;
  }

  function unitRenderLayer(unit, options = {}) {
    const col = unitRenderColumn(unit, options.frontCol, options.slotGrid);
    if (unit?.typeId === options.finalBossTypeId) return col + 0.5;
    if (unit?.typeId === options.finalBossMinionTypeId && col === options.backCol) {
      const row = Number.isFinite(unit.row) ? unit.row : Number.isInteger(unit.slot) ? options.slotGrid(unit.slot).row : 1;
      if (row === 0) return col + 1;
      if (row === options.boardRows - 1) return col;
    }
    if (unit?.typeId === options.finalBossMinionTypeId && col === 1) {
      const row = Number.isFinite(unit.row) ? unit.row : Number.isInteger(unit.slot) ? options.slotGrid(unit.slot).row : 1;
      if (row === options.boardRows - 1) return 0.25;
    }
    return col;
  }

  function sideUnitsInRenderOrder(units, options = {}) {
    return units.slice().sort((a, b) => unitRenderLayer(b, options) - unitRenderLayer(a, options));
  }

  function unitsInRenderOrder(battle, options = {}) {
    return [
      ...sideUnitsInRenderOrder(battle.allies || [], options),
      ...sideUnitsInRenderOrder(battle.enemies || [], options),
    ];
  }

  function projectileFrame(from, to, remaining, duration, arcHeight = 56) {
    const progress = clamp01(1 - remaining / duration);
    const eased = 1 - (1 - progress) ** 2;
    return {
      progress,
      eased,
      x: from.x + (to.x - from.x) * eased,
      y: from.y + (to.y - from.y) * eased - Math.sin(progress * Math.PI) * arcHeight,
      dx: to.x - from.x,
      dy: to.y - from.y,
    };
  }

  function projectileFxFrame(progress, tier = 1, kind = "damage") {
    const t = clamp01(progress);
    const support = kind === "support";
    const launchAlpha = clamp01(1 - t / 0.3);
    const arrivalAlpha = clamp01((t - 0.68) / 0.32);
    const tierScale = 1 + Math.max(0, Math.min(3, tier - 1)) * 0.12;
    return {
      launchAlpha,
      arrivalAlpha,
      haloScale: (0.82 + Math.sin(t * Math.PI) * 0.28) * tierScale,
      support,
    };
  }

  function projectileTrailCount(index, total, budget) {
    if (total <= 0 || budget <= 0) return 0;
    const copies = Math.min(total * 3, budget);
    return Math.floor((index + 1) * copies / total) - Math.floor(index * copies / total);
  }

  function projectileTrailFrame(from, to, progress, index, spin, rotationStart = 0, support = false) {
    const lag = (index + 1) * 0.1;
    const sampleProgress = progress - lag;
    if (sampleProgress <= 0 || progress >= 1) return null;
    const frame = projectileFrame(from, to, 1 - sampleProgress, 1);
    return {
      x: frame.x,
      y: frame.y,
      scale: 0.6 - index * 0.12,
      alpha: (0.68 - index * 0.18) * clamp01(sampleProgress / 0.08) * clamp01((1 - progress) / 0.16) * (support ? 0.8 : 1),
      rotation: rotationStart + spin * progress * (1.3 + index * 0.25) + index * 2.4,
    };
  }

  function unitPresentationState(unit) {
    const pendingImpact = Math.max(0, unit?.pendingVisualImpactCount || 0) > 0;
    return {
      pendingImpact,
      defeated: Boolean(unit?.dead && !unit?.visualDefeatPending),
      hp: Number.isFinite(unit?.visualHp) ? unit.visualHp : unit?.hp || 0,
      shield: Number.isFinite(unit?.visualShield) ? unit.visualShield : unit?.shield || 0,
    };
  }

  function hasPendingProjectileImpacts(attacks) {
    return Boolean(attacks?.some((attack) => attack?.impact));
  }

  function drinkPulseMotion(item, battle, options = {}) {
    const start = item?.drinkPulseAnimStart;
    if (typeof start !== "number" || !battle) return { y: 0, scaleX: 1, scaleY: 1 };
    const t = (battle.elapsed - start) / options.duration;
    if (t < 0 || t >= 1) return { y: 0, scaleX: 1, scaleY: 1 };
    const compress = Math.sin(clamp01(t / 0.26) * Math.PI);
    const springT = clamp01((t - 0.18) / 0.82);
    const hop = Math.sin(springT * Math.PI);
    const rebound = Math.sin(springT * Math.PI * 3) * (1 - springT);
    return {
      y: compress * 2 - hop * options.hopPixels,
      scaleX: 1 + compress * 0.1 - rebound * 0.035,
      scaleY: 1 - compress * 0.12 + rebound * 0.055,
    };
  }

  function statusGlyphLayout(count, x, y, r, time) {
    return Array.from({ length: count }, (_, index) => {
      const angle = -Math.PI / 4 + (index / count) * Math.PI * 2;
      const pulse = 0.5 + Math.sin(time * 6.2 + index * 1.1) * 0.5;
      const distance = r + 10 + pulse * 5;
      return {
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * (distance * 0.74),
        size: 13 + pulse * 2,
      };
    });
  }

  window.FoodAnimalsBattleCanvas = {
    battleDrinkSlotPosition,
    drinkPulseMotion,
    hasPendingProjectileImpacts,
    projectileFxFrame,
    projectileFrame,
    projectileTrailCount,
    projectileTrailFrame,
    sideUnitsInRenderOrder,
    statusGlyphLayout,
    unitRenderColumn,
    unitRenderLayer,
    unitPresentationState,
    unitsInRenderOrder,
  };
})();
