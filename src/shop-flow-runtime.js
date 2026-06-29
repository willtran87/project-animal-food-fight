(() => {
  "use strict";

  function rerollDecision(options = {}) {
    if (options.phase && options.phase !== "prep") return { ok: false, reason: "wrongPhase" };
    if (options.free) return { ok: true, spendGold: 0, consumeFreeRoll: false, incrementRolls: false };
    const cost = Math.max(0, Number(options.cost) || 0);
    const freeRolls = Math.max(0, Math.floor(Number(options.freeRolls) || 0));
    if ((Number(options.gold) || 0) < cost) return { ok: false, reason: "insufficientGold", cost };
    return {
      ok: true,
      spendGold: freeRolls > 0 ? 0 : cost,
      consumeFreeRoll: freeRolls > 0,
      incrementRolls: freeRolls <= 0,
    };
  }

  function applyRerollCost(state, decision) {
    if (!decision?.ok) return false;
    if (decision.consumeFreeRoll) state.freeRolls = Math.max(0, (state.freeRolls || 0) - 1);
    if (decision.spendGold) state.gold -= decision.spendGold;
    if (decision.incrementRolls) state.rollsThisRound = (state.rollsThisRound || 0) + 1;
    return true;
  }

  function unlockDecision(options = {}) {
    const index = Math.floor(Number(options.index));
    if (options.phase !== "prep") return { ok: false, reason: "wrongPhase" };
    if (!Number.isInteger(index) || index < 0 || index >= (options.slotCount || 0)) return { ok: false, reason: "invalidIndex" };
    if (options.unlocked) return { ok: false, reason: "alreadyOpen" };
    if ((Number(options.gold) || 0) < (Number(options.cost) || 0)) return { ok: false, reason: "insufficientGold" };
    return { ok: true };
  }

  function upgradeDecision(options = {}) {
    if (options.phase !== "prep") return { ok: false, reason: "wrongPhase" };
    if (options.cost === null || options.cost === undefined) return { ok: false, reason: "maxed" };
    if ((Number(options.gold) || 0) < (Number(options.cost) || 0)) return { ok: false, reason: "insufficientGold" };
    return { ok: true };
  }

  function freezeDecision(options = {}) {
    if (options.phase !== "prep") return { ok: false, reason: "wrongPhase" };
    if (!options.unlocked) return { ok: false, reason: "locked" };
    if (!options.hasEntry) return { ok: false, reason: "empty" };
    return { ok: true };
  }

  function shopSaleState(options = {}) {
    if (!options.hasEntry) return false;
    if (options.frozen) return Boolean(options.previousSale);
    if (typeof options.rollSale === "function") return Boolean(options.rollSale());
    return Boolean(options.rollSale);
  }

  function buyTargetDecision(options = {}) {
    if (options.phase !== "prep") return { ok: false, reason: "wrongPhase" };
    if (!options.unlocked) return { ok: false, reason: "locked" };
    if (!options.hasEntry) return { ok: false, reason: "empty" };
    if ((Number(options.gold) || 0) < (Number(options.cost) || 0)) return { ok: false, reason: "insufficientGold" };
    if (options.entryType === "drink" && !["bench", "drinks", "itemBench"].includes(options.targetArea)) {
      return { ok: false, reason: "drinkTarget" };
    }
    if (options.entryType === "topping" && !["bench", "itemBench"].includes(options.targetArea)) {
      return { ok: false, reason: "toppingStorage" };
    }
    if (options.entryType === "unit" && !["bench", "board"].includes(options.targetArea)) {
      return { ok: false, reason: "unitTarget" };
    }
    if (options.targetArea === "itemBench" && options.itemBenchAccepts === false) {
      return { ok: false, reason: "wrongItemBenchKind" };
    }
    if (!options.targetInRange) return { ok: false, reason: "targetOutOfRange" };
    return { ok: true };
  }

  function sellOwnedDecision(options = {}) {
    if (options.phase !== "prep") return { ok: false, reason: "wrongPhase" };
    if (!options.hasEntry) return { ok: false, reason: "wrongKind" };
    if (options.needsItemStorage && !options.itemStorageAvailable) return { ok: false, reason: "itemStorageFull" };
    return { ok: true };
  }

  window.FoodAnimalsShopFlowRuntime = Object.freeze({
    applyRerollCost,
    buyTargetDecision,
    freezeDecision,
    rerollDecision,
    shopSaleState,
    sellOwnedDecision,
    unlockDecision,
    upgradeDecision,
  });
})();
