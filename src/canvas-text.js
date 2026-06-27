(function () {
  const DEFAULT_CACHE_LIMIT = 5000;

  function remember(cache, key, value, limit = DEFAULT_CACHE_LIMIT) {
    if (!cache) return value;
    if (cache.size >= limit) cache.clear();
    cache.set(key, value);
    return value;
  }

  function measureWidth(ctx, text, options = {}) {
    const value = String(text ?? "");
    const font = options.font || ctx.font;
    const cache = options.cache || null;
    const key = `${font}\n${value}`;
    if (cache?.has(key)) return cache.get(key);

    const previousFont = ctx.font;
    if (font && previousFont !== font) ctx.font = font;
    const measure = options.nativeMeasureText || ((candidate) => ctx.measureText(candidate));
    const width = measure(value).width;
    if (font && ctx.font !== previousFont) ctx.font = previousFont;
    return remember(cache, key, width, options.cacheLimit);
  }

  function wrappedLines(ctx, text, maxWidth, options = {}) {
    const value = String(text || "");
    const font = options.font || ctx.font;
    const cache = options.cache || null;
    const key = `${font}\n${Math.round(maxWidth * 10) / 10}\n${value}`;
    if (cache?.has(key)) return cache.get(key);

    const measure = options.measureText || ((candidate) => measureWidth(ctx, candidate, { ...options, font }));
    const words = value.split(/\s+/).filter(Boolean);
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const test = line ? `${line} ${word}` : word;
      if (line && measure(test, font) > maxWidth) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    });
    if (line) lines.push(line);
    return remember(cache, key, lines.length ? lines : [value], options.cacheLimit);
  }

  function drawWrapped(ctx, text, x, y, maxWidth, lineHeight, options = {}) {
    const lines = wrappedLines(ctx, text, maxWidth, options);
    lines.forEach((line, index) => ctx.fillText(line, x, y + index * lineHeight));
    return lines.length;
  }

  function scaleFont(font, px) {
    return String(font || "").replace(/(\d+(?:\.\d+)?)px/, `${px}px`);
  }

  function fontPx(font) {
    const match = String(font || "").match(/(\d+(?:\.\d+)?)px/);
    return match ? Number(match[1]) : 12;
  }

  function fitComplete(ctx, text, x, y, maxWidth, font, color, options = {}) {
    const value = String(text || "");
    const minPx = options.minPx ?? 6;
    const measure = options.measureText || ((candidate, candidateFont) => measureWidth(ctx, candidate, { ...options, font: candidateFont }));
    ctx.fillStyle = color;
    let px = fontPx(font);
    ctx.font = font;
    while (px > minPx && measure(value, ctx.font) > maxWidth) {
      px = Math.max(minPx, px - 0.5);
      ctx.font = scaleFont(font, px);
    }
    ctx.fillText(value, x, y);
  }

  function drawLimited(ctx, text, x, y, maxWidth, lineHeight, maxLines, options = {}) {
    const words = String(text || "").split(" ");
    let line = "";
    let lines = 0;
    const measure = options.measureText || ((candidate, font) => measureWidth(ctx, candidate, { ...options, font }));
    const fitText = options.fitText || ((value, fx, fy, fw) => ctx.fillText(value, fx, fy));
    for (let i = 0; i < words.length; i += 1) {
      const word = words[i];
      const test = line ? `${line} ${word}` : word;
      if (measure(test, ctx.font) > maxWidth && line) {
        lines += 1;
        if (lines >= maxLines) {
          fitText(`${line}...`, x, y, maxWidth, ctx.font, ctx.fillStyle);
          return lines;
        }
        ctx.fillText(line, x, y);
        line = word;
        y += lineHeight;
      } else {
        line = test;
      }
    }
    if (line && lines < maxLines) ctx.fillText(line, x, y);
    return lines + (line ? 1 : 0);
  }

  window.FoodAnimalsCanvasText = {
    DEFAULT_CACHE_LIMIT,
    drawLimited,
    drawWrapped,
    fitComplete,
    fontPx,
    measureWidth,
    remember,
    scaleFont,
    wrappedLines,
  };
})();
