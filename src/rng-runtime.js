(() => {
  "use strict";

  function hashString(value) {
    let hash = 2166136261;
    const text = String(value || "food-animals");
    for (let i = 0; i < text.length; i += 1) {
      hash ^= text.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }
    return hash >>> 0;
  }

  function normalizeSeed(seed) {
    const text = String(seed ?? "").trim();
    return text || "food-animals";
  }

  function randomSeed() {
    const cryptoValues = new Uint32Array(2);
    try {
      window.crypto?.getRandomValues?.(cryptoValues);
    } catch {
      cryptoValues[0] = 0;
      cryptoValues[1] = 0;
    }
    const fallback = `${Date.now().toString(36)}-${Math.floor(Math.random() * 0xffffffff).toString(36)}`;
    return normalizeSeed(`${cryptoValues[0].toString(36)}-${cryptoValues[1].toString(36)}-${fallback}`);
  }

  function createState(seed = randomSeed(), calls = 0) {
    return {
      seed: normalizeSeed(seed),
      calls: Math.max(0, Math.floor(Number(calls) || 0)),
    };
  }

  function valueAt(seed, index) {
    let value = hashString(`${normalizeSeed(seed)}:${Math.max(0, Math.floor(Number(index) || 0))}`);
    value += 0x6d2b79f5;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  }

  function next(state) {
    if (!state || typeof state !== "object") return Math.random();
    const value = valueAt(state.seed, state.calls);
    state.calls += 1;
    return value;
  }

  function int(state, max) {
    return Math.floor(next(state) * Math.max(0, Math.floor(Number(max) || 0)));
  }

  function exportState(state) {
    return {
      seed: normalizeSeed(state?.seed),
      calls: Math.max(0, Math.floor(Number(state?.calls) || 0)),
    };
  }

  window.FoodAnimalsRngRuntime = Object.freeze({
    createState,
    exportState,
    hashString,
    int,
    next,
    normalizeSeed,
    randomSeed,
    valueAt,
  });
})();
