(function () {
  function numberOr(value, fallback) {
    const number = Number(value);
    return Number.isFinite(number) ? number : fallback;
  }

  function upgradeStarLayout(tier, x, y, size = 10, align = "left") {
    const count = Math.max(1, Math.floor(numberOr(tier, 1)));
    const pipSize = Math.max(3, numberOr(size, 10) * 0.78);
    const gap = Math.max(1, Math.round(pipSize * 0.16));
    const totalWidth = count * pipSize + (count - 1) * gap;
    const startX =
      align === "center" ? x - totalWidth / 2 :
      align === "right" ? x - totalWidth :
      x;
    return {
      count,
      pipSize,
      gap,
      totalWidth,
      startX,
      stars: Array.from({ length: count }, (_, index) => ({
        x: Math.round(startX + index * (pipSize + gap)),
        y: Math.round(y - pipSize / 2),
        w: pipSize,
        h: pipSize,
      })),
    };
  }

  function traitChipLayout(traits, x, y, maxWidth, options = {}) {
    const gap = options.gap ?? 3;
    const rowHeight = options.rowHeight ?? 14;
    const chipHeight = options.chipHeight ?? 14;
    const maxRows = options.maxRows ?? 1;
    const fontSize = options.fontSize ?? 7;
    const minWidth = options.minWidth ?? 28;
    const textFor = typeof options.textFor === "function" ? options.textFor : (traitId) => String(traitId || "");
    const measure = typeof options.measure === "function"
      ? options.measure
      : (text) => String(text || "").length * fontSize * 0.66;
    const chips = [];
    let cursor = x;
    let row = 0;

    (traits || []).forEach((traitId) => {
      const text = textFor(traitId);
      const font = `900 ${fontSize}px Inter, sans-serif`;
      let width = Math.max(minWidth, Math.ceil(measure(text, font) + 8));
      if (cursor + width > x + maxWidth) {
        if (row + 1 >= maxRows) return;
        row += 1;
        cursor = x;
      }
      width = Math.min(width, maxWidth);
      if (width < minWidth) return;
      const chip = {
        traitId,
        text,
        font,
        row,
        x: cursor,
        y: y + row * rowHeight,
        w: width,
        h: chipHeight,
      };
      chips.push(chip);
      cursor += width + gap;
    });

    return {
      chips,
      gap,
      rowHeight,
      maxRows,
      fontSize,
      minWidth,
    };
  }

  function iconRadius(width, height, options = {}) {
    const base = Math.min(width, height);
    if (options.kind === "item") {
      if (options.shopCard) return base * 0.26;
      if (options.tileDrink) return base * (options.tileDrinkScale ?? 0.34);
      return base * 0.25;
    }
    return base * (options.shopCard ? 0.25 : 0.28);
  }

  window.FoodAnimalsCardCanvas = {
    iconRadius,
    traitChipLayout,
    upgradeStarLayout,
  };
})();
