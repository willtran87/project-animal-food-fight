(() => {
  "use strict";

  function filterLayout(options = {}) {
    const list = options.list;
    const rows = options.rows || [];
    const optionText = options.optionText || ((_tabId, _key, value) => String(value));
    const optionWidth = options.optionWidth || ((text) => Math.max(32, Math.min(list.w - 56, String(text).length * 7 + 14)));
    const chipH = options.chipH || 18;
    const labelW = options.labelW || 56;
    const gap = options.gap || 4;
    const lineGap = options.lineGap || 3;
    const rowGap = options.rowGap || 5;
    const startX = list.x + labelW;
    const availableW = list.w - labelW;
    let y = list.y + 4;
    const layoutRows = rows.map((row) => {
      let x = startX;
      let optionY = y + 3;
      let lineCount = 1;
      const optionRects = row.options.map((value) => {
        const text = optionText(options.tabId, row.key, value);
        const w = optionWidth(text);
        if (x > startX && x + w > startX + availableW) {
          x = startX;
          optionY += chipH + lineGap;
          lineCount += 1;
        }
        const option = {
          key: row.key,
          value,
          label: row.label,
          text,
          rect: { x, y: optionY, w, h: chipH },
        };
        x += w + gap;
        return option;
      });
      const h = lineCount * chipH + (lineCount - 1) * lineGap + 6;
      const layoutRow = { ...row, y, h, labelY: y + 17, options: optionRects };
      y += h + rowGap;
      return layoutRow;
    });
    return { rows: layoutRows, height: Math.max(0, y - (list.y + 4) - rowGap) };
  }

  function listLayout(options = {}) {
    const baseList = options.list;
    const filterHeight = options.filterHeight || 0;
    const listY = baseList.y + Math.max(84, filterHeight + 16);
    const listH = Math.max(150, baseList.h - (listY - baseList.y));
    if (options.tabId === "toppings") {
      const cols = 3;
      const rowH = 19;
      return { ...baseList, y: listY, h: listH, rows: Math.max(8, Math.floor(listH / rowH)), cols, rowH, colW: baseList.w / cols };
    }
    if (options.tabId === "food") {
      const cols = 3;
      const rowH = 18;
      return { ...baseList, y: listY, h: listH, rows: Math.max(8, Math.floor(listH / rowH)), cols, rowH, colW: baseList.w / cols };
    }
    const rowH = 22;
    return { ...baseList, y: listY, h: listH, rows: Math.max(8, Math.floor(listH / rowH)), cols: 2, rowH, colW: baseList.w / 2 };
  }

  function entryRect(index, layout) {
    const col = Math.floor(index / layout.rows);
    const row = index % layout.rows;
    if (col >= layout.cols) return null;
    return {
      x: layout.x + col * layout.colW,
      y: layout.y + row * layout.rowH,
      w: layout.colW - 8,
      h: layout.rowH - 3,
    };
  }

  function closeRect(panel) {
    return { x: panel.x + panel.w - 43, y: panel.y + 18, w: 28, h: 28 };
  }

  function tabRect(panel, index) {
    return { x: panel.x + 292 + index * 98, y: panel.y + 24, w: 88, h: 28 };
  }

  function detailOrigin(list) {
    return { x: list.x + list.w + 34, y: list.y - 34 };
  }

  function formRect(list, index) {
    const { x, y } = detailOrigin(list);
    const cardW = 61;
    const gap = 9;
    const fx = x + 22 + index * (cardW + gap);
    return { x: fx - 6, y: y + 246, w: cardW, h: 76 };
  }

  function itemFormRect(list, index) {
    const { x, y } = detailOrigin(list);
    const fx = x + 48 + index * 96;
    return { x: fx - 40, y: y + 246, w: 80, h: 92 };
  }

  function previewRect(list) {
    const { x, y } = detailOrigin(list);
    return { x: x + 15, y: y + 18, w: 116, h: 138 };
  }

  function detailPanelRect(panel, list) {
    const { x, y } = detailOrigin(list);
    return { x, y, w: panel.x + panel.w - x - 28, h: list.h + 52 };
  }

  window.FoodAnimalsCodexCanvas = Object.freeze({
    filterLayout,
    listLayout,
    entryRect,
    closeRect,
    tabRect,
    formRect,
    itemFormRect,
    previewRect,
    detailOrigin,
    detailPanelRect,
  });
})();
