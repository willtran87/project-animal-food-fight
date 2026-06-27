(() => {
  "use strict";

  function detailsButtonRect(x = 720, y = 188, maxWidth = 268) {
    return { x: x + maxWidth - 74, y: y - 15, w: 74, h: 22 };
  }

  function timelineLayout(rect, eventTypeFilters = []) {
    const detail = { x: rect.x + 10, y: rect.y + rect.h - 62, w: rect.w - 20, h: 52 };
    const chipsY = rect.y + 31;
    let chipX = rect.x + 12;
    const keyChip = { rect: { x: chipX, y: chipsY, w: 40, h: 19 } };
    chipX += keyChip.rect.w + 4;
    const typeChips = eventTypeFilters.map((filter) => {
      const w = filter.id === "ko" ? 34 : filter.id === "damage" ? 42 : filter.id === "support" ? 48 : 48;
      const chip = { filter, rect: { x: chipX, y: chipsY, w, h: 19 } };
      chipX += w + 4;
      return chip;
    });
    return {
      keyChip,
      typeChips,
      detail,
      rowStartY: rect.y + 59,
      rowBottom: detail.y - 6,
      rowH: 23,
    };
  }

  function logVisibleRows(rect, eventTypeFilters = []) {
    const layout = timelineLayout(rect, eventTypeFilters);
    return Math.max(1, Math.floor((layout.rowBottom - layout.rowStartY) / layout.rowH));
  }

  function visibleLogRows(options = {}) {
    const rect = options.rect;
    const events = options.events || [];
    const eventTypeFilters = options.eventTypeFilters || [];
    const layout = timelineLayout(rect, eventTypeFilters);
    const visibleRows = logVisibleRows(rect, eventTypeFilters);
    const maxOffset = Math.max(0, events.length - visibleRows);
    const scrollOffset = Math.max(0, Math.min(maxOffset, Math.round(Number(options.scrollOffset) || 0)));
    const end = Math.max(0, events.length - scrollOffset);
    const start = Math.max(0, end - visibleRows);
    const visible = events.slice(start, end);
    return {
      events,
      visible,
      start,
      end,
      visibleRows,
      scrollOffset,
      rows: visible.map((event, index) => ({
        event,
        index: start + index,
        rect: { x: rect.x + 8, y: layout.rowStartY - 13 + index * layout.rowH, w: rect.w - 22, h: 21 },
      })),
      layout,
    };
  }

  function reviewRects(options = {}) {
    const panel = options.panel;
    const units = options.units || [];
    const filters = options.filters || [];
    const leftX = panel.x + 18;
    const leftW = 322;
    const logX = panel.x + 348;
    const logW = panel.x + panel.w - 18 - logX;
    const participantsPanel = { x: panel.x + 10, y: panel.y + 330, w: leftW + 16, h: 180 };
    return {
      panel,
      close: { x: panel.x + panel.w - 44, y: panel.y + 12, w: 26, h: 26 },
      prev: { x: panel.x + 18, y: panel.y + 42, w: 28, h: 24 },
      next: { x: panel.x + 52, y: panel.y + 42, w: 28, h: 24 },
      track: { x: panel.x + 94, y: panel.y + 50, w: 246, h: 8 },
      mini: { x: leftX, y: panel.y + 82, w: leftW, h: 248 },
      participantsPanel,
      units: units.map((unit, index) => {
        const col = index < 10 ? 0 : 1;
        const row = index % 10;
        return {
          unit,
          rect: { x: participantsPanel.x + 8 + col * 158, y: participantsPanel.y + 40 + row * 14, w: 150, h: 13 },
        };
      }),
      filters: filters.map((filter, index) => ({
        filter,
        rect: { x: logX + index * 76, y: panel.y + 42, w: 70, h: 24 },
      })),
      log: { x: logX, y: panel.y + 82, w: logW, h: 428 },
    };
  }

  window.FoodAnimalsCombatLedgerCanvas = Object.freeze({
    detailsButtonRect,
    timelineLayout,
    logVisibleRows,
    visibleLogRows,
    reviewRects,
  });
})();
