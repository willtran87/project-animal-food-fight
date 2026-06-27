(function () {
  function itemTier(value) {
    return Math.max(1, Math.min(3, Math.floor(value || 1)));
  }

  function progressFor(ref) {
    const bonus = ref.area === "bench" ? ref.unit?.item?.mergeProgressBonus || 0 : 0;
    return 1 + bonus;
  }

  function mergeItemIsConsumed(item) {
    return Boolean(item?.mergeProgressBonus);
  }

  function itemMatches(item, target, maxTier = 3) {
    return Boolean(item && target && item.id === target.id && itemTier(item.tier) === itemTier(target.tier) && itemTier(item.tier) < maxTier);
  }

  function orderItemRefs(matches, item, options = {}) {
    const isDrink = options.isDrink || ((entry) => entry?.kind === "drink" || entry?.type === "drink" || entry?.isDrink);
    if (isDrink(item)) {
      return [...matches].sort((a, b) => (a.area === "drinks" ? 0 : 1) - (b.area === "drinks" ? 0 : 1));
    }
    return [...matches];
  }

  function itemRefsWithIncoming(item, target, refs, targetArea, targetIndex, maxTier = 3, options = {}) {
    if (!itemMatches(item, target, maxTier)) return [];
    const matches = refs.filter((ref) => itemMatches(item, ref.item, maxTier));
    if (matches.length + 1 < 3) return [];
    const ordered = orderItemRefs(matches, item, options).sort((a, b) => {
      const aIsTarget = a.area === targetArea && a.index === targetIndex;
      const bIsTarget = b.area === targetArea && b.index === targetIndex;
      return aIsTarget === bIsTarget ? 0 : aIsTarget ? -1 : 1;
    });
    return ordered.slice(0, 2);
  }

  function unitMaxTier(unit, catalogEntry) {
    return catalogEntry?.forms?.length || unit?.maxTier || 1;
  }

  function unitMatches(unit, target, maxTier) {
    return Boolean(unit && target && unit.typeId === target.typeId && unit.tier === target.tier && unit.tier < maxTier);
  }

  function selectRefsForProgress(matches, required = 3) {
    const consumed = [];
    let progress = 0;
    for (const ref of matches) {
      consumed.push(ref);
      progress += progressFor(ref);
      if (progress >= required) break;
    }
    return consumed;
  }

  function progressCount(refs, typeId, tier, phantomCopy = 0) {
    const actual = refs
      .filter((ref) => ref.unit.typeId === typeId && ref.unit.tier === tier)
      .reduce((total, ref) => total + progressFor(ref), 0);
    return actual + phantomCopy;
  }

  function unitRefsWithIncoming(unit, target, refs, targetArea, targetIndex, maxTier, phantomCopyFn = () => 0) {
    if (!unitMatches(unit, target, maxTier)) return [];
    const matches = refs.filter((ref) => unitMatches(unit, ref.unit, maxTier));
    const actualProgressWithIncoming = matches.reduce((total, ref) => total + progressFor(ref), 1);
    if (actualProgressWithIncoming + phantomCopyFn(unit.typeId, unit.tier, actualProgressWithIncoming) < 3) return [];
    const ordered = matches.sort((a, b) => {
      const aIsTarget = a.area === targetArea && a.index === targetIndex;
      const bIsTarget = b.area === targetArea && b.index === targetIndex;
      return aIsTarget === bIsTarget ? 0 : aIsTarget ? -1 : 1;
    });
    const consumed = [];
    let progress = 1;
    for (const ref of ordered) {
      consumed.push(ref);
      progress += progressFor(ref);
      if (progress >= 3) break;
    }
    return progress >= 3 ? consumed : [];
  }

  window.FoodAnimalsMergeRuntime = {
    itemMatches,
    itemRefsWithIncoming,
    itemTier,
    mergeItemIsConsumed,
    orderItemRefs,
    progressCount,
    progressFor,
    selectRefsForProgress,
    unitMatches,
    unitMaxTier,
    unitRefsWithIncoming,
  };
})();
