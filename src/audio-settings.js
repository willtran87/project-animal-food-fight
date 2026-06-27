(() => {
  "use strict";

  const STORAGE_KEY = "harvest-friends:start-menu-settings:v1";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function clampSetting(value, min, max, fallback) {
    const number = Number(value);
    if (!Number.isFinite(number)) return fallback;
    return clamp(number, min, max);
  }

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
    try {
      const settings = JSON.parse(window.localStorage.getItem(storageKey) || "{}");
      return settings && typeof settings === "object" ? settings : {};
    } catch {
      return {};
    }
  }

  function write(settings, storageKey = STORAGE_KEY) {
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(settings && typeof settings === "object" ? settings : {}));
      return true;
    } catch {
      return false;
    }
  }

  function patch(values, storageKey = STORAGE_KEY) {
    const next = {
      ...read(storageKey),
      ...(values && typeof values === "object" ? values : {}),
    };
    write(next, storageKey);
    return next;
  }

  function readNumber(key, fallback, options = {}) {
    const settings = read(options.storageKey || STORAGE_KEY);
    return clampSetting(settings[key], options.min ?? 0, options.max ?? 10, fallback);
  }

  function writeNumber(key, value, options = {}) {
    const min = options.min ?? 0;
    const max = options.max ?? 10;
    const nextValue = clamp(Math.round(Number(value) || 0), min, max);
    patch({ [key]: nextValue }, options.storageKey || STORAGE_KEY);
    return nextValue;
  }

  function sfxVolume(fallback = 0.8, storageKey = STORAGE_KEY) {
    return readNumber("sfx", fallback * 10, { storageKey, min: 0, max: 10 }) / 10;
  }

  window.FoodAnimalsAudioSettings = Object.freeze({
    STORAGE_KEY,
    canUseLocalStorage,
    clampSetting,
    read,
    write,
    patch,
    readNumber,
    writeNumber,
    sfxVolume,
  });
})();
