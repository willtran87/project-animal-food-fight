(function () {
  function rebootTransition(options = {}) {
    const duration = options.duration;
    return {
      elapsed: 0,
      duration,
      resetAt: duration * options.resetAtPct,
      resetDone: false,
      source: options.fromVictoryCutscene ? "victoryCutscene" : "defeat",
    };
  }

  function finalVictoryTransition(options = {}) {
    const holdDuration = options.holdDuration;
    const staticDuration = options.staticDuration;
    return {
      elapsed: 0,
      duration: holdDuration + staticDuration,
      holdDuration,
      resetAt: holdDuration + staticDuration * options.resetAtPct,
      resetDone: false,
    };
  }

  function menuRebootTransition(duration) {
    return { elapsed: 0, duration, navigated: false };
  }

  function advanceTransition(transition, dt) {
    if (!transition) return null;
    transition.elapsed = Math.min(transition.duration, transition.elapsed + dt);
    return transition;
  }

  function victoryStage(elapsed, timing) {
    if (elapsed < timing.crawlStart) return "title";
    if (elapsed < timing.idealFadeStart) return "crawl";
    if (elapsed < timing.idealFadeStart + timing.idealFadeSeconds) return "staticFade";
    return "ideal";
  }

  function victoryCutscene(options = {}) {
    return {
      elapsed: 0,
      roundCleared: options.roundCleared,
      backgroundSrc: options.backgroundSrc,
      idealBackgroundSrc: options.idealBackgroundSrc,
      message: options.message || "Hope Returns",
    };
  }

  window.FoodAnimalsVictoryRebootRuntime = {
    advanceTransition,
    finalVictoryTransition,
    menuRebootTransition,
    rebootTransition,
    victoryCutscene,
    victoryStage,
  };
})();
