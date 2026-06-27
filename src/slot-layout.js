(() => {
  "use strict";

  function grid(index, cols) {
    const safeCols = Math.max(1, Math.floor(Number(cols) || 1));
    const safeIndex = Math.max(0, Math.floor(Number(index) || 0));
    return {
      col: safeIndex % safeCols,
      row: Math.floor(safeIndex / safeCols),
    };
  }

  function gridPosition(index, options = {}) {
    const { col, row } = grid(index, options.cols || 1);
    return {
      x: (options.x || 0) + col * (options.gapX ?? options.gap ?? 0),
      y: (options.y || 0) + row * (options.gapY ?? options.gap ?? 0),
      col,
      row,
    };
  }

  function itemBenchSlotKind(index, drinkSlots) {
    return index < Math.max(0, Number(drinkSlots) || 0) ? "drink" : "topping";
  }

  window.FoodAnimalsSlotLayout = Object.freeze({
    grid,
    gridPosition,
    itemBenchSlotKind,
  });
})();
