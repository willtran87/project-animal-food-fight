(function () {
  function actionLayout(panel, ref, options = {}) {
    const margin = options.margin || 20;
    const gap = options.gap || 8;
    const h = options.height || 28;
    const y = panel.y + panel.h - (options.bottomOffset || 42);
    const availableW = panel.w - margin * 2;
    const splitW = Math.floor((availableW - gap) / 2);
    const leftX = panel.x + margin;
    const rightX = leftX + splitW + gap;
    const split = Boolean(options.canDetach?.(ref));
    const singleW = Math.min(options.singleMaxWidth || 148, availableW);
    return {
      y,
      h,
      split,
      splitW,
      leftX,
      rightX,
      singleW,
      singleX: panel.x + panel.w - margin - singleW,
    };
  }

  function sellButton(button, layout) {
    return {
      ...button,
      x: layout.split ? layout.leftX : layout.singleX,
      y: layout.y,
      w: layout.split ? layout.splitW : layout.singleW,
      h: layout.h,
    };
  }

  function detachButton(button, layout, enabled) {
    if (!enabled) return button;
    return {
      ...button,
      x: layout.rightX,
      y: layout.y,
      w: layout.splitW,
      h: layout.h,
      label: "Detach",
      iconId: "action_detach",
    };
  }

  function favoriteToppingMetrics(specs, maxWidth, wrappedLineCount) {
    const specLineHeight = 10;
    const specRows = (specs || []).reduce((total, line) => total + wrappedLineCount(line, maxWidth - 76), 0);
    return {
      specRows,
      specLineHeight,
      cardH: Math.max(86, 46 + specRows * specLineHeight + Math.max(0, (specs || []).length - 1) * 2),
    };
  }

  window.FoodAnimalsSelectedPanelCanvas = {
    actionLayout,
    detachButton,
    favoriteToppingMetrics,
    sellButton,
  };
})();
