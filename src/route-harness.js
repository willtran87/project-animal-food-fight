(function () {
  function param(name, search = window.location.search) {
    try {
      return String(new URLSearchParams(search).get(name) || "").trim().toLowerCase();
    } catch {
      return "";
    }
  }

  function normalizeRunMode(value) {
    const mode = String(value || "").trim().toLowerCase();
    return ["infinite", "endless", "arcade", "freeplay", "free-play"].includes(mode) ? "infinite" : "story";
  }

  function initialRunMode(search = window.location.search) {
    return normalizeRunMode(param("runMode", search) || param("run", search) || param("mode", search));
  }

  function smokeScenario(search = window.location.search) {
    return String(param("smoke", search) || "").trim().toLowerCase();
  }

  function matches(value, aliases) {
    return aliases.includes(String(value || "").trim().toLowerCase());
  }

  function routeElapsed(search = window.location.search) {
    const raw = Number(param("elapsed", search));
    return Number.isFinite(raw) ? Math.max(0, raw) : null;
  }

  function shouldStartBattle(search = window.location.search) {
    const phase = param("phase", search) || param("start", search) || param("mode", search);
    return ["battle", "start", "true", "1", "yes", "auto"].includes(phase);
  }

  window.FoodAnimalsRouteHarness = {
    initialRunMode,
    matches,
    normalizeRunMode,
    param,
    routeElapsed,
    shouldStartBattle,
    smokeScenario,
  };
})();
