(function () {
  const STORAGE_KEY = "harvest-friends:active-run:v1";
  const SAVE_VERSION = 1;

  function canUseLocalStorage(storageKey = STORAGE_KEY) {
    try {
      const key = `${storageKey}:probe`;
      window.localStorage.setItem(key, "1");
      window.localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }

  function read(storageKey = STORAGE_KEY) {
    if (!canUseLocalStorage(storageKey)) return null;
    try {
      const record = JSON.parse(window.localStorage.getItem(storageKey) || "null");
      return record && typeof record === "object" ? record : null;
    } catch {
      return null;
    }
  }

  function activeRecord(storageKey = STORAGE_KEY) {
    const run = read(storageKey);
    if (!run || run.active !== true || typeof run.route !== "string") return null;
    if (!run.snapshot || typeof run.snapshot !== "object") return null;
    return run;
  }

  function write(record, storageKey = STORAGE_KEY) {
    if (!canUseLocalStorage(storageKey)) return false;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(record));
      return true;
    } catch {
      return false;
    }
  }

  function clear(storageKey = STORAGE_KEY) {
    if (!canUseLocalStorage(storageKey)) return false;
    try {
      window.localStorage.removeItem(storageKey);
      return true;
    } catch {
      return false;
    }
  }

  function cloneValue(value) {
    if (value === undefined) return undefined;
    const ancestors = [];
    return JSON.parse(JSON.stringify(value, function (_key, entry) {
      if (!entry || typeof entry !== "object") return entry;
      while (ancestors.length && ancestors[ancestors.length - 1] !== this) ancestors.pop();
      if (ancestors.includes(entry)) return undefined;
      ancestors.push(entry);
      return entry;
    }));
  }

  function buildRecord(options) {
    const now = options.now || new Date().toISOString();
    const previous = options.previous || null;
    const snapshot = options.snapshot || previous?.snapshot || null;
    const summaryState = snapshot?.state || options.summaryState || {};
    return {
      active: true,
      route: options.route,
      theme: options.theme,
      startedAt: previous?.active === true && typeof previous.startedAt === "string" ? previous.startedAt : now,
      updatedAt: now,
      markerOnly: !snapshot,
      snapshot,
      summary: {
        round: summaryState.round,
        phase: summaryState.phase,
        hearts: summaryState.hearts,
        gold: summaryState.gold,
        shopLevel: summaryState.shopLevel,
        savedAt: snapshot?.savedAt || now,
      },
    };
  }

  function targetUrl(run, options) {
    const fallback = options.appUrl(options.gameTarget);
    fallback.searchParams.set("from", "start-menu");
    fallback.searchParams.set("continue", "1");
    if (!run || typeof run.route !== "string") return fallback.href;
    try {
      const url = new URL(run.route, options.baseURI || window.location.href);
      url.searchParams.set("from", "start-menu");
      url.searchParams.set("continue", "1");
      const target = options.appUrl(options.gameTarget);
      target.search = url.search;
      target.hash = url.hash;
      return target.href;
    } catch {
      return fallback.href;
    }
  }

  window.FoodAnimalsRunStorage = {
    SAVE_VERSION,
    STORAGE_KEY,
    activeRecord,
    buildRecord,
    canUseLocalStorage,
    clear,
    cloneValue,
    read,
    targetUrl,
    write,
  };
})();
