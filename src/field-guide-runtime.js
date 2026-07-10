(function () {
  const DEFAULTS = {
    zoomMin: 1,
    zoomMax: 2.75,
    zoomStep: 1.14,
    tapMaxPx: 9,
    swipeMinPx: 46,
    swipeAxisBias: 1.25,
  };
  const CHROMA_CACHE_LIMIT = 6;
  const chromaWorkerRequests = new Map();
  let chromaWorker = null;
  let chromaWorkerRequestId = 0;

  function displayName(theme) {
    return theme === "horror" ? "Specifications" : "Field Guide";
  }

  function pagesForTheme(theme, cozyPages, horrorPages) {
    return theme === "horror" ? horrorPages : cozyPages;
  }

  function currentPage(theme, index, cozyPages, horrorPages) {
    const pages = pagesForTheme(theme, cozyPages, horrorPages);
    return pages[index] || pages[0];
  }

  function resetView(existing = {}) {
    return {
      ...existing,
      zoom: 1,
      panX: 0,
      panY: 0,
      dragging: false,
      startX: 0,
      startY: 0,
      startPanX: 0,
      startPanY: 0,
    };
  }

  function clampView(view, rect, config = DEFAULTS) {
    const result = view || {};
    const zoomMin = config.zoomMin ?? DEFAULTS.zoomMin;
    const zoomMax = config.zoomMax ?? DEFAULTS.zoomMax;
    result.zoom = Math.max(zoomMin, Math.min(zoomMax, result.zoom || 1));
    const maxPanX = rect ? Math.max(0, (rect.width * result.zoom - rect.width) / 2) : 0;
    const maxPanY = rect ? Math.max(0, (rect.height * result.zoom - rect.height) / 2) : 0;
    result.panX = Math.max(-maxPanX, Math.min(maxPanX, result.panX || 0));
    result.panY = Math.max(-maxPanY, Math.min(maxPanY, result.panY || 0));
    if (result.zoom <= zoomMin) {
      result.zoom = zoomMin;
      result.panX = 0;
      result.panY = 0;
    }
    return result;
  }

  function applyView(viewport, pageArt, view) {
    if (!viewport || !pageArt) return;
    viewport.style.setProperty("--field-guide-zoom", String(view.zoom));
    viewport.style.setProperty("--field-guide-pan-x", `${view.panX}px`);
    viewport.style.setProperty("--field-guide-pan-y", `${view.panY}px`);
    pageArt.classList.toggle("is-dragging", Boolean(view.dragging));
    pageArt.dataset.zoom = String(Math.round(view.zoom * 100));
  }

  function zoomView(view, rect, deltaY, clientX, clientY, config = DEFAULTS) {
    if (!rect) return { changed: false, view };
    if (clientX < rect.left || clientX > rect.right || clientY < rect.top || clientY > rect.bottom) {
      return { changed: false, view };
    }
    const zoomMin = config.zoomMin ?? DEFAULTS.zoomMin;
    const zoomMax = config.zoomMax ?? DEFAULTS.zoomMax;
    const zoomStep = config.zoomStep ?? DEFAULTS.zoomStep;
    const previousZoom = Math.max(zoomMin, Math.min(zoomMax, view.zoom || 1));
    const nextZoom = Math.max(zoomMin, Math.min(zoomMax, previousZoom * (deltaY < 0 ? zoomStep : 1 / zoomStep)));
    if (nextZoom === previousZoom) return { changed: true, view };
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const localX = clientX - centerX - (view.panX || 0);
    const localY = clientY - centerY - (view.panY || 0);
    const ratio = nextZoom / previousZoom;
    view.zoom = nextZoom;
    view.panX = (view.panX || 0) - localX * (ratio - 1);
    view.panY = (view.panY || 0) - localY * (ratio - 1);
    return { changed: true, view };
  }

  function pageTurnFromPointer(event, view, rect, state, config = DEFAULTS) {
    if (!state.open || state.closing || event?.type !== "pointerup") return 0;
    const zoomMin = config.zoomMin ?? DEFAULTS.zoomMin;
    const startX = Number.isFinite(view.startX) ? view.startX : event.clientX;
    const startY = Number.isFinite(view.startY) ? view.startY : event.clientY;
    const dx = event.clientX - startX;
    const dy = event.clientY - startY;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const canSwipePage = (view.zoom || zoomMin) <= zoomMin + 0.01;
    if (canSwipePage && absX >= (config.swipeMinPx ?? DEFAULTS.swipeMinPx) && absX >= absY * (config.swipeAxisBias ?? DEFAULTS.swipeAxisBias)) {
      return dx < 0 ? 1 : -1;
    }
    if (Math.hypot(dx, dy) > (config.tapMaxPx ?? DEFAULTS.tapMaxPx)) return 0;
    if (!rect) return 1;
    return event.clientX < rect.left + rect.width / 2 ? -1 : 1;
  }

  function connectedChromaKeyPixels(data, width, height, keyColor, tolerance = 22) {
    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    let readIndex = 0;
    let writeIndex = 0;

    const matchesKey = (pixelIndex) => {
      const dataIndex = pixelIndex * 4;
      return (
        data[dataIndex + 3] > 0 &&
        Math.abs(data[dataIndex] - keyColor[0]) <= tolerance &&
        Math.abs(data[dataIndex + 1] - keyColor[1]) <= tolerance &&
        Math.abs(data[dataIndex + 2] - keyColor[2]) <= tolerance
      );
    };

    const enqueue = (pixelIndex) => {
      if (visited[pixelIndex] || !matchesKey(pixelIndex)) return;
      visited[pixelIndex] = 1;
      queue[writeIndex] = pixelIndex;
      writeIndex += 1;
    };

    for (let x = 0; x < width; x += 1) {
      enqueue(x);
      enqueue((height - 1) * width + x);
    }
    for (let y = 0; y < height; y += 1) {
      enqueue(y * width);
      enqueue(y * width + width - 1);
    }

    while (readIndex < writeIndex) {
      const pixelIndex = queue[readIndex];
      readIndex += 1;
      const x = pixelIndex % width;
      const y = Math.floor(pixelIndex / width);
      if (x > 0) enqueue(pixelIndex - 1);
      if (x + 1 < width) enqueue(pixelIndex + 1);
      if (y > 0) enqueue(pixelIndex - width);
      if (y + 1 < height) enqueue(pixelIndex + width);
    }

    return visited;
  }

  function ensureChromaWorker() {
    if (chromaWorker) return chromaWorker;
    if (typeof Worker !== "function" || typeof createImageBitmap !== "function" || typeof OffscreenCanvas !== "function") {
      return null;
    }
    const workerUrl = new URL("src/field-guide-worker.js?v=worker-1", document.baseURI || window.location.href);
    chromaWorker = new Worker(workerUrl, { name: "field-guide-chroma" });
    chromaWorker.onmessage = (event) => {
      const request = chromaWorkerRequests.get(event.data?.id);
      if (!request) return;
      chromaWorkerRequests.delete(event.data.id);
      if (event.data.error || !event.data.blob) request.reject(new Error(event.data.error || "Chroma worker failed"));
      else request.resolve(event.data.blob);
    };
    chromaWorker.onerror = (event) => {
      chromaWorkerRequests.forEach((request) => request.reject(new Error(event.message || "Chroma worker failed")));
      chromaWorkerRequests.clear();
      chromaWorker?.terminate();
      chromaWorker = null;
    };
    return chromaWorker;
  }

  async function chromaBlobFromWorker(image) {
    const worker = ensureChromaWorker();
    if (!worker) return null;
    const bitmap = await createImageBitmap(image);
    const id = ++chromaWorkerRequestId;
    return new Promise((resolve, reject) => {
      chromaWorkerRequests.set(id, { resolve, reject });
      worker.postMessage({ id, bitmap }, [bitmap]);
    });
  }

  function chromaBlobOnMainThread(image) {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas");
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        resolve(null);
        return;
      }
      context.drawImage(image, 0, 0);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const keyColor = [data[0], data[1], data[2]];
      const keyedPixels = connectedChromaKeyPixels(data, canvas.width, canvas.height, keyColor);
      for (let index = 0; index < keyedPixels.length; index += 1) {
        if (keyedPixels[index]) data[index * 4 + 3] = 0;
      }
      context.putImageData(imageData, 0, 0);
      canvas.toBlob(resolve, "image/webp", 0.92);
    });
  }

  function evictOldestChromaEntry(cache) {
    const oldest = cache.keys().next();
    if (oldest.done) return;
    const cached = cache.get(oldest.value);
    cache.delete(oldest.value);
    Promise.resolve(cached).then((src) => {
      if (typeof src === "string" && src.startsWith("blob:")) URL.revokeObjectURL(src);
    });
  }

  function resolveImageSrc(page, cache) {
    if (!page?.chromaKey) return Promise.resolve(page?.src || "");
    if (cache.has(page.src)) return cache.get(page.src);
    while (cache.size >= CHROMA_CACHE_LIMIT) evictOldestChromaEntry(cache);
    const keyedImagePromise = new Promise((resolve) => {
      const img = new Image();
      img.decoding = "async";
      img.onload = async () => {
        try {
          const blob = (await chromaBlobFromWorker(img)) || (await chromaBlobOnMainThread(img));
          resolve(blob ? URL.createObjectURL(blob) : page.src);
        } catch {
          const blob = await chromaBlobOnMainThread(img);
          resolve(blob ? URL.createObjectURL(blob) : page.src);
        }
      };
      img.onerror = () => resolve(page.src);
      img.src = page.src;
    });
    cache.set(page.src, keyedImagePromise);
    return keyedImagePromise;
  }

  window.FoodAnimalsFieldGuideRuntime = {
    DEFAULTS,
    applyView,
    clampView,
    connectedChromaKeyPixels,
    currentPage,
    displayName,
    pageTurnFromPointer,
    pagesForTheme,
    resetView,
    resolveImageSrc,
    zoomView,
  };
})();
