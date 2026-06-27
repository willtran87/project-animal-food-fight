(function () {
  function itemStorageAccepts(area, index, item, options = {}) {
    if (!options.isItem?.(item)) return false;
    if (area === "bench") return true;
    if (area === "itemBench") return options.itemBenchSlotAccepts?.(index, item) || false;
    return false;
  }

  function firstEmpty(list, accepts = () => true) {
    return list.findIndex((entry, index) => !entry && accepts(index));
  }

  function firstEmptyItemStorage(state, item, options = {}) {
    const itemBenchIndex = firstEmpty(state.itemBench || [], (index) => options.itemBenchSlotAccepts?.(index, item));
    if (itemBenchIndex >= 0) return { area: "itemBench", index: itemBenchIndex };
    const benchIndex = firstEmpty(state.bench || []);
    if (benchIndex >= 0) return { area: "bench", index: benchIndex };
    return null;
  }

  function isItemStorageArea(area) {
    return area === "bench" || area === "itemBench";
  }

  function clearPurchasedShopSlot(state, shopIndex) {
    state.shop[shopIndex] = null;
    state.shopFrozen[shopIndex] = false;
    state.shopSales[shopIndex] = false;
  }

  function canSellDrag(drag, state, options = {}) {
    if (!drag || state.phase !== "prep" || drag.area === "shop") return false;
    if (drag.area === "equipment") return options.isItem?.(drag.unit) || false;
    if (drag.area === "board") return options.isUnit?.(state.board?.[drag.index]) || false;
    if (drag.area === "drinks") return options.isItem?.(state.drinks?.[drag.index]) || false;
    if (drag.area === "itemBench") return options.isItem?.(state.itemBench?.[drag.index]) || false;
    if (drag.area === "bench") return Boolean(state.bench?.[drag.index]);
    return false;
  }

  function dragEntry(drag, state, selectedEquipmentTargetRef) {
    return drag?.area === "equipment" ? selectedEquipmentTargetRef?.(drag)?.unit?.item : state[drag?.area]?.[drag?.index];
  }

  function dragSellValue(drag, state, options = {}) {
    if (!canSellDrag(drag, state, options)) return 0;
    const entry = dragEntry(drag, state, options.selectedEquipmentTargetRef);
    if (options.isUnit?.(entry)) return options.sellValue(entry);
    if (options.isItem?.(entry)) return options.itemSellValue(entry);
    return 0;
  }

  function purchaseFailure(state, cost, options = {}) {
    if (state.phase !== "prep") return { ok: false, message: null, sfx: null };
    if (state.gold < cost) return { ok: false, message: options.needMessage || "Need coins", sfx: "invalid" };
    return { ok: true };
  }

  function applyPurchase(state, cost) {
    state.gold -= cost;
    return state.gold;
  }

  function freezeMessage(entryLabel, frozen) {
    return `${entryLabel} ${frozen ? "locked" : "unlocked"}`;
  }

  window.FoodAnimalsShopTransactionRuntime = {
    applyPurchase,
    canSellDrag,
    clearPurchasedShopSlot,
    dragEntry,
    dragSellValue,
    firstEmpty,
    firstEmptyItemStorage,
    freezeMessage,
    isItemStorageArea,
    itemStorageAccepts,
    purchaseFailure,
  };
})();
