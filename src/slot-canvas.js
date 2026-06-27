(function () {
  function freezeRect(x, y, w, h) {
    return { x: x + w / 2 - 23, y: y - h / 2 + 6, w: 18, h: 20 };
  }

  function slotVisualState(state, drag, area, index, options = {}) {
    const selected = state.selected && state.selected.area === area && state.selected.index === index;
    const hovered = state.hover && state.hover.area === area && state.hover.index === index;
    const isDragSource = drag?.area === area && drag.index === index;
    const canDropHere = Boolean(drag && options.isPotentialDropTarget?.(drag, area, index));
    const isValidDrop = Boolean(options.canDropDrag?.(drag, area, index));
    const isDragOver = drag?.over?.area === area && drag.over.index === index;
    const subtle = area === "board" || area === "bench" || area === "itemBench" || area === "drinks";
    return {
      selected,
      showSelectedHighlight: selected && area === "shop",
      hovered,
      showHoverHighlight: hovered && area !== "shop" && !subtle,
      isDragSource,
      canDropHere,
      isValidDrop,
      isOpenDrop: canDropHere && isValidDrop,
      isBlockedDrop: canDropHere && !isValidDrop,
      isDragOver,
      useSubtleDropOutline: subtle,
      showOpenDrop: canDropHere && isValidDrop && !subtle,
      showBlockedDrop: canDropHere && !isValidDrop && !subtle,
      showDragOver: isDragOver && !subtle,
      showSubtleDropOutline: subtle && canDropHere && isValidDrop,
      showSubtleBlockedOutline: subtle && isDragOver && canDropHere && !isValidDrop,
    };
  }

  function saleBadgeRect(x, y, w, h) {
    return { x: x - w / 2 + 7, y: y - h / 2 + 31, w: 42, h: 16 };
  }

  function mergeBadgeRect(x, y, w, h, horror = false) {
    const badgeW = horror ? 46 : 58;
    const badgeH = 16;
    return { x: x - badgeW / 2, y: y - h / 2 + 8, w: badgeW, h: badgeH };
  }

  function unlockPanelRect(x, y, w, h) {
    return { x: x - w / 2 + 7, y: y - h / 2 + 9, w: w - 14, h: h - 18 };
  }

  window.FoodAnimalsSlotCanvas = {
    freezeRect,
    mergeBadgeRect,
    saleBadgeRect,
    slotVisualState,
    unlockPanelRect,
  };
})();
