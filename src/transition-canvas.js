(() => {
  "use strict";

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function clamp01(value) {
    return clamp(Number(value) || 0, 0, 1);
  }

  function easeOutCubic(value) {
    const t = clamp01(value);
    return 1 - Math.pow(1 - t, 3);
  }

  function progress(transition, fallbackDuration = 0.001) {
    if (!transition) return 1;
    return clamp01((transition.elapsed || 0) / Math.max(0.001, transition.duration || fallbackDuration));
  }

  function resultAlpha(transition, fallbackDuration) {
    if (!transition) return 1;
    return easeOutCubic(clamp01(((transition.elapsed || 0) - 0.18) / Math.max(0.001, (transition.duration || fallbackDuration) - 0.18)));
  }

  function modalVisual(transition, fallbackDuration) {
    if (!transition) return { alpha: 1, scale: 1, offsetY: 0, closing: false, progress: 1 };
    const rawProgress = progress(transition, fallbackDuration);
    const eased = easeOutCubic(rawProgress);
    const alpha = transition.phase === "exit" ? 1 - eased : eased;
    return {
      alpha,
      scale: 0.965 + alpha * 0.035,
      offsetY: (1 - alpha) * (transition.phase === "exit" ? -10 : 12),
      closing: transition.phase === "exit",
      progress: rawProgress,
    };
  }

  function prepToBattleVisual(transition, fallbackDuration) {
    const rawProgress = progress(transition, fallbackDuration);
    const enter = easeOutCubic(clamp01(rawProgress / 0.22));
    const exit = easeOutCubic(clamp01((rawProgress - 0.74) / 0.26));
    const eased = easeOutCubic(rawProgress);
    const pulse = clamp01(Math.min(enter, 1 - exit));
    const shutter = easeOutCubic(clamp01(rawProgress / 0.72));
    return {
      progress: rawProgress,
      eased,
      enter,
      exit,
      pulse,
      shutter,
      topBandH: Math.max(0, 116 * (1 - shutter)),
      bottomBandH: Math.max(0, 104 * (1 - shutter)),
      plateW: 396 + pulse * 26,
      plateH: 64,
      plateY: 66 + (1 - eased) * 8,
    };
  }

  function battleToResultVisual(transition, fallbackDuration) {
    const rawProgress = progress(transition, fallbackDuration);
    const enter = easeOutCubic(clamp01(rawProgress / 0.2));
    const exit = easeOutCubic(clamp01((rawProgress - 0.82) / 0.18));
    const reveal = clamp01(Math.min(enter, 1 - exit));
    const flash = 1 - easeOutCubic(clamp01(rawProgress / 0.5));
    return {
      progress: rawProgress,
      enter,
      exit,
      flash,
      reveal,
      pulse: reveal,
      bannerW: 440 + reveal * 90,
    };
  }

  function resetStaticVisual(transition, options = {}) {
    const duration = Math.max(0.001, transition?.duration || options.duration || 0.001);
    const elapsed = transition?.elapsed || 0;
    const resetAt = transition?.resetAt ?? duration * 0.5;
    const rawProgress = clamp01(elapsed / duration);
    const resetPoint = clamp01(resetAt / duration);
    const fadeIn = clamp01(rawProgress / Math.max(0.001, resetPoint));
    const fadeOut = clamp01((rawProgress - resetPoint) / Math.max(0.001, 1 - resetPoint));
    const staticAlpha = transition?.resetDone
      ? 0.86 * (1 - fadeOut)
      : 0.18 + 0.76 * fadeIn;
    return {
      progress: rawProgress,
      resetPoint,
      fadeIn,
      fadeOut,
      staticAlpha,
      warmAlpha: transition?.resetDone ? (options.warmAlpha ?? 0.28) * fadeOut : 0,
    };
  }

  function menuRebootVisual(transition) {
    const rawProgress = progress(transition, transition?.duration || 0.001);
    return {
      progress: rawProgress,
      staticAlpha: 0.08 + 0.92 * easeOutCubic(rawProgress),
    };
  }

  function finalVictoryStaticVisual(transition) {
    const holdDuration = Math.max(0, transition?.holdDuration || 0);
    const staticDuration = Math.max(0.001, (transition?.duration || 0.001) - holdDuration);
    const staticElapsed = (transition?.elapsed || 0) - holdDuration;
    if (staticElapsed <= 0) return { active: false, holdDuration, staticDuration, staticElapsed };
    return {
      active: true,
      holdDuration,
      staticDuration,
      staticElapsed,
      ...resetStaticVisual(
        {
          ...transition,
          elapsed: staticElapsed,
          duration: staticDuration,
          resetAt: (transition?.resetAt || holdDuration) - holdDuration,
        },
        { warmAlpha: 0.34 },
      ),
    };
  }

  function shopReturnStaticVisual(transition, fallbackDuration) {
    const duration = Math.max(0.001, transition?.duration || fallbackDuration || 0.001);
    const elapsed = transition?.elapsed || 0;
    const switchAt = clamp(transition?.switchAt || duration * 0.5, 0.001, duration - 0.001);
    const fadeIn = clamp01(elapsed / switchAt);
    const fadeOut = clamp01((elapsed - switchAt) / Math.max(0.001, duration - switchAt));
    const staticAlpha = transition?.screenChanged
      ? 0.94 * (1 - fadeOut)
      : 0.18 + 0.78 * fadeIn;
    return { duration, elapsed, switchAt, fadeIn, fadeOut, staticAlpha };
  }

  window.FoodAnimalsTransitionCanvas = Object.freeze({
    clamp,
    clamp01,
    easeOutCubic,
    progress,
    resultAlpha,
    modalVisual,
    prepToBattleVisual,
    battleToResultVisual,
    resetStaticVisual,
    menuRebootVisual,
    finalVictoryStaticVisual,
    shopReturnStaticVisual,
  });
})();
