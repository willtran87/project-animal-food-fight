(function () {
  function imageKey(image) {
    return image?.currentSrc || image?.src || image;
  }

  function loadImage(src, options = {}) {
    if (!src) return null;
    const image = new Image();
    if (options.decoding !== false) image.decoding = "async";
    if (options.trackState !== false) image.dataset.loadState = "loading";
    image.onload = () => {
      if (options.trackState !== false) image.dataset.loadState = "loaded";
      if (typeof options.onLoad === "function") options.onLoad(image);
    };
    image.onerror = () => {
      if (options.trackState !== false) image.dataset.loadState = "failed";
      if (typeof options.onError === "function") options.onError(image);
    };
    image.src = src;
    return image;
  }

  function getCachedImage(cache, src, options = {}) {
    if (!src) return null;
    if (cache.has(src)) return cache.get(src);
    const image = loadImage(src, options);
    cache.set(src, image);
    return image;
  }

  function preloadEntries(entries, loadSrc) {
    const visit = (entry) => {
      if (!entry) return;
      if (typeof entry === "string") {
        loadSrc(entry);
        return;
      }
      Object.values(entry).forEach(visit);
    };
    Object.values(entries || {}).forEach(visit);
  }

  function ready(image) {
    return Boolean(image && image.complete && image.naturalWidth > 0);
  }

  function failed(image) {
    return Boolean(image && (image.dataset?.loadState === "failed" || (image.complete && image.naturalWidth <= 0)));
  }

  function fallbackMetrics(image) {
    return {
      x: 0,
      y: 0,
      w: Math.max(1, image?.naturalWidth || image?.width || 1),
      h: Math.max(1, image?.naturalHeight || image?.height || 1),
    };
  }

  function alphaMetrics(image, cache, options = {}) {
    const cacheKey = imageKey(image);
    if (cache?.has(cacheKey)) return cache.get(cacheKey);
    const fallback = fallbackMetrics(image);
    if (!image?.complete || !image.naturalWidth || !image.naturalHeight) return fallback;

    try {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const px = canvas.getContext("2d", { willReadFrequently: true });
      px.drawImage(image, 0, 0);
      const { data, width, height } = px.getImageData(0, 0, canvas.width, canvas.height);
      const threshold = options.threshold ?? 8;
      let minX = width;
      let minY = height;
      let maxX = -1;
      let maxY = -1;
      for (let yy = 0; yy < height; yy += 1) {
        for (let xx = 0; xx < width; xx += 1) {
          if (data[(yy * width + xx) * 4 + 3] <= threshold) continue;
          if (xx < minX) minX = xx;
          if (yy < minY) minY = yy;
          if (xx > maxX) maxX = xx;
          if (yy > maxY) maxY = yy;
        }
      }
      if (maxX < minX || maxY < minY) {
        if (cache) cache.set(cacheKey, fallback);
        return fallback;
      }
      const pad = options.pad ?? 2;
      const metrics = {
        x: Math.max(0, minX - pad),
        y: Math.max(0, minY - pad),
        w: Math.min(width, maxX + pad + 1) - Math.max(0, minX - pad),
        h: Math.min(height, maxY + pad + 1) - Math.max(0, minY - pad),
      };
      if (cache) cache.set(cacheKey, metrics);
      return metrics;
    } catch {
      if (cache) cache.set(cacheKey, fallback);
      return fallback;
    }
  }

  window.FoodAnimalsRuntimeAssets = {
    alphaMetrics,
    failed,
    fallbackMetrics,
    getCachedImage,
    imageKey,
    loadImage,
    preloadEntries,
    ready,
  };
})();
