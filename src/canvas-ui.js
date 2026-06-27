(() => {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function clamp01(value) {
    return clamp(Number(value) || 0, 0, 1);
  }

  function roundedRect(ctx, x, y, w, h, r) {
    const radius = Math.max(0, Math.min(Number(r) || 0, Math.abs(w) / 2, Math.abs(h) / 2));
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function pointInRect(x, y, rect) {
    return Boolean(rect) && x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h;
  }

  function defaultMeasureText(ctx, text, font = ctx.font) {
    const previousFont = ctx.font;
    if (font && previousFont !== font) ctx.font = font;
    const width = ctx.measureText(String(text ?? "")).width;
    if (font && previousFont !== font) ctx.font = previousFont;
    return width;
  }

  function wrappedTextLines(ctx, text, maxWidth, options = {}) {
    const value = String(text || "");
    const font = options.font || ctx.font;
    const measureText = typeof options.measureText === "function"
      ? options.measureText
      : (candidate) => defaultMeasureText(ctx, candidate, font);
    const words = value.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    for (const word of words) {
      const test = line ? `${line} ${word}` : word;
      if (measureText(test) > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [""];
  }

  function fitText(ctx, text, x, y, maxWidth, font, color, options = {}) {
    const value = String(text ?? "");
    const measureText = typeof options.measureText === "function"
      ? options.measureText
      : (candidate) => defaultMeasureText(ctx, candidate, font);
    if (options.align) ctx.textAlign = options.align;
    ctx.fillStyle = color;
    ctx.font = font;
    if (measureText(value) <= maxWidth) {
      ctx.fillText(value, x, y);
      return value;
    }
    let lo = 0;
    let hi = value.length;
    while (lo < hi) {
      const mid = Math.ceil((lo + hi) / 2);
      if (measureText(`${value.slice(0, mid)}...`) <= maxWidth) {
        lo = mid;
      } else {
        hi = mid - 1;
      }
    }
    const clipped = value.slice(0, Math.max(0, lo)).trimEnd();
    const rendered = `${clipped}...`;
    ctx.fillText(rendered, x, y);
    return rendered;
  }

  window.FoodAnimalsCanvasUi = Object.freeze({
    clamp,
    clamp01,
    roundedRect,
    pointInRect,
    wrappedTextLines,
    fitText,
  });
})();
