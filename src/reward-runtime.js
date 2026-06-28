(function () {
  function shopLevel(level, maxLevel) {
    return Math.max(1, Math.min(maxLevel, level || 1));
  }

  function arenaTier(level, maxLevel) {
    if (level >= maxLevel) return 3;
    if (level >= 3) return 2;
    return 1;
  }

  function tierText(tier) {
    return tier > 1 ? `${tier}-star ` : "";
  }

  function amountForLevel(level, won, amounts) {
    const list = won ? amounts.win : amounts.loss;
    return list[level] || list[list.length - 1];
  }

  function freeRollAmount() {
    return 1;
  }

  function rewardKey(reward) {
    return reward?.key || `${reward?.type}:${reward?.itemId || reward?.typeId || reward?.title}`;
  }

  function pushUnique(choices, reward) {
    if (!reward) return false;
    const key = rewardKey(reward);
    if (choices.some((choice) => rewardKey(choice) === key)) return false;
    choices.push({ ...reward, key });
    return true;
  }

  function shuffled(rewards, random = Math.random) {
    return rewards
      .filter(Boolean)
      .map((reward) => ({ reward, sort: random() }))
      .sort((a, b) => a.sort - b.sort)
      .map((entry) => entry.reward);
  }

  function pushFromPool(choices, rewards, random = Math.random) {
    for (const reward of shuffled(rewards, random)) {
      if (pushUnique(choices, reward)) return true;
    }
    return false;
  }

  function addGold(state, amount, maxGold) {
    const before = state.gold || 0;
    state.gold = Math.min(maxGold, before + Math.max(0, amount || 0));
    return Math.max(0, state.gold - before);
  }

  function goldFallback(state, amount, maxGold, reason) {
    const fallbackAmount = Math.max(0, amount || 0);
    return {
      type: "gold",
      amount: fallbackAmount,
      goldAdded: addGold(state, fallbackAmount, maxGold),
      reason,
    };
  }

  function claimReward(state, reward, helpers = {}) {
    if (!reward) return false;
    const maxGold = helpers.maxGold ?? Infinity;
    const fallbackGold = helpers.fallbackGold ?? 15;
    const result = { claimed: true, type: reward.type, fallback: null };
    if (reward.type === "gold") {
      result.goldAdded = addGold(state, reward.amount, maxGold);
    } else if (reward.type === "freeRolls") {
      state.freeRolls += reward.amount;
    } else if (reward.type === "arenaScout") {
      state.freeRolls += reward.freeRolls || 0;
      state.arenaScout = {
        arenaId: reward.arenaId,
        arenaShort: reward.arenaShort,
        traitIds: [...(reward.traitIds || [])],
        shopsRemaining: reward.shopsRemaining || 2,
      };
    } else if (reward.type === "arenaPrepBuff") {
      state.arenaPrepBuff = {
        arenaId: reward.arenaId,
        arenaShort: reward.arenaShort,
        traitIds: [...(reward.traitIds || [])],
        shieldPct: reward.shieldPct || 0.12,
        hastePct: reward.hastePct || 0.1,
        attackPct: reward.attackPct || 0.08,
        duration: reward.duration || 3,
      };
    } else if (reward.type === "arenaHold") {
      state.keepArenaNextRound = true;
      state.freeRolls += reward.freeRolls || 0;
    } else if (reward.type === "arenaPurse") {
      result.goldAdded = addGold(state, reward.amount, maxGold);
      state.freeRolls += reward.freeRolls || 0;
    } else if (reward.type === "shopSlotUnlock") {
      if (!helpers.openShopSlot?.(reward.slotIndex)) result.fallback = goldFallback(state, Math.min(25, reward.amount || 0), maxGold, "shopSlotUnavailable");
    } else if (reward.type === "upgradeDiscount") {
      state.nextShopUpgradeDiscountGold = Math.max(0, (state.nextShopUpgradeDiscountGold || 0) + (reward.amount || 0));
    } else if (reward.type === "item") {
      if (helpers.moveItemToBench?.(helpers.makeItem?.(reward.itemId, reward.tier || 1))) {
        helpers.resolveItemMerges?.();
      } else {
        result.fallback = goldFallback(state, fallbackGold, maxGold, "storageFull");
      }
    } else if (reward.type === "copy") {
      if (helpers.moveItemToBench?.(helpers.makeUnit?.(reward.typeId, reward.tier || 1))) {
        helpers.resolveMerges?.();
      } else {
        result.fallback = goldFallback(state, fallbackGold, maxGold, "benchFull");
      }
    }
    return result;
  }

  window.FoodAnimalsRewardRuntime = {
    amountForLevel,
    arenaTier,
    claimReward,
    freeRollAmount,
    pushFromPool,
    pushUnique,
    rewardKey,
    shopLevel,
    shuffled,
    tierText,
  };
})();
