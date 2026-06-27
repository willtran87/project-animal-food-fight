(function () {
  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function glitchNoise(seed) {
    const value = Math.sin(seed * 12.9898) * 43758.5453;
    return value - Math.floor(value);
  }

  function revealDistortionState(options = {}) {
    if (!options.realityBroken || !(options.timer > 0)) {
      return { active: false, intensity: 0, elapsed: 0, remaining: 0 };
    }
    const remaining = clamp(options.timer, 0, options.revealSeconds);
    const elapsed = Math.max(0, options.revealSeconds - remaining);
    const shock = 1 - clamp01(elapsed / options.distortSeconds);
    const tail = 0.16 * clamp01(remaining / options.revealSeconds);
    const intensity = clamp01(Math.max(shock, tail));
    return {
      active: intensity > 0.01,
      intensity,
      elapsed,
      remaining,
      frame: Math.floor((options.idleTime + elapsed) * 38),
    };
  }

  function drawCornerBrackets(ctx, x, y, w, h, length) {
    ctx.beginPath();
    ctx.moveTo(x, y + length);
    ctx.lineTo(x, y);
    ctx.lineTo(x + length, y);
    ctx.moveTo(x + w - length, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w, y + length);
    ctx.moveTo(x + w, y + h - length);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x + w - length, y + h);
    ctx.moveTo(x + length, y + h);
    ctx.lineTo(x, y + h);
    ctx.lineTo(x, y + h - length);
  }

  window.FoodAnimalsRealityFxCanvas = {
    drawCornerBrackets,
    glitchNoise,
    revealDistortionState,
  };
})();
