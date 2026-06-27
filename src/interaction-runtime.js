(function () {
  function pointInRect(x, y, rect) {
    return Boolean(rect && x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h);
  }

  function registerTooltip(targets, x, y, w, h, tooltip) {
    if (!targets || !tooltip?.title) return false;
    targets.push({ x, y, w, h, title: tooltip.title, body: tooltip.body || "" });
    return true;
  }

  function currentTooltip(targets, pointer, options = {}) {
    if (!pointer || options.dragging) return null;
    for (let i = (targets?.length || 0) - 1; i >= 0; i -= 1) {
      const target = targets[i];
      if (pointInRect(pointer.x, pointer.y, target)) return target;
    }
    return null;
  }

  function tooltipMetrics(tip, pointer, stage, options = {}) {
    const pad = options.pad ?? 9;
    const maxW = options.maxW ?? 230;
    const bodyLines = options.bodyLines || [];
    const titleW = Math.min(maxW - pad * 2, options.titleW || 0);
    const bodyW = bodyLines.reduce((width, line) => Math.max(width, Math.min(maxW - pad * 2, line.width || 0)), 0);
    const w = Math.max(options.minW ?? 86, Math.min(maxW, Math.ceil(Math.max(titleW, bodyW) + pad * 2)));
    const h = bodyLines.length ? 32 + bodyLines.length * (options.lineHeight ?? 13) : 30;
    let x = Math.round((pointer?.x || 0) + (options.offsetX ?? 14));
    let y = Math.round((pointer?.y || 0) + (options.offsetY ?? 16));
    if (x + w > stage.width - 8) x = Math.round((pointer?.x || 0) - w - 14);
    if (y + h > stage.height - 8) y = Math.round((pointer?.y || 0) - h - 12);
    x = Math.max(8, Math.min(stage.width - w - 8, x));
    y = Math.max(8, Math.min(stage.height - h - 8, y));
    return { x, y, w, h, pad, bodyLines };
  }

  window.FoodAnimalsInteractionRuntime = {
    currentTooltip,
    pointInRect,
    registerTooltip,
    tooltipMetrics,
  };
})();
