(function () {
  const DEFAULT_MOVE_THRESHOLD_SQ = 64;

  function createDrag(area, index, unit, pos, options = {}) {
    return {
      area,
      index,
      unit,
      equipmentTarget: options.equipmentTarget || null,
      startX: pos.x,
      startY: pos.y,
      x: pos.x,
      y: pos.y,
      moved: false,
      over: null,
      valid: false,
    };
  }

  function updateDrag(drag, pos, hit, options = {}) {
    if (!drag) return null;
    const dx = pos.x - drag.startX;
    const dy = pos.y - drag.startY;
    drag.x = pos.x;
    drag.y = pos.y;
    drag.moved = drag.moved || dx * dx + dy * dy > (options.moveThresholdSq ?? DEFAULT_MOVE_THRESHOLD_SQ);
    const isPotential = typeof options.isPotentialDropTarget === "function"
      ? options.isPotentialDropTarget(drag, hit?.area, hit?.index)
      : Boolean(hit);
    drag.over = hit && isPotential ? hit : null;
    drag.valid = Boolean(
      drag.over &&
      (typeof options.canDropDrag !== "function" || options.canDropDrag(drag, drag.over.area, drag.over.index))
    );
    return drag;
  }

  function clickWithoutMove(drag, hit) {
    return Boolean(drag && !drag.moved && hit?.area === drag.area && hit.index === drag.index);
  }

  function feedbackMessage(entry, options = {}) {
    const kind = options.kind || "drag";
    const isDrink = Boolean(options.isDrink?.(entry));
    const isItem = Boolean(options.isItem?.(entry));
    const drink = options.drink || "drink";
    if (kind === "shopStart") {
      if (isDrink) return `Drag to ${drink} rail`;
      if (isItem) return options.horror ? "Drag to machine" : "Drag to animal";
      return "Drag to grid";
    }
    if (kind === "unitStart") {
      if (isDrink) return `Drag to ${drink} rail`;
      if (isItem) return options.horror ? "Arm a machine" : "Top an animal";
      return options.area === "bench" ? "Drag to board" : "Drag to slot";
    }
    if (kind === "shopDrop") {
      if (isDrink) return `Drop on ${drink} rail`;
      if (isItem) return options.horror ? "Drop on machine" : "Drop on animal";
      return "Drop on grid";
    }
    if (isDrink) return `Drop on ${drink} rail`;
    if (isItem) return options.horror ? "Drop on machine" : "Drop on animal";
    return options.area === "bench" ? "Drop on board" : "Drop on slot";
  }

  window.FoodAnimalsDragDropRuntime = {
    clickWithoutMove,
    createDrag,
    feedbackMessage,
    updateDrag,
  };
})();
