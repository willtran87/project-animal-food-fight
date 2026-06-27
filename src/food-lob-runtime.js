(function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function smoothstep(value) {
    const t = clamp(value, 0, 1);
    return t * t * (3 - 2 * t);
  }

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function maxActive(width, limits) {
    if (width < (limits.mobileBreakpoint ?? 720)) return limits.mobile;
    if (Number.isFinite(limits.tablet) && width < (limits.tabletBreakpoint ?? 1100)) return limits.tablet;
    return limits.desktop;
  }

  function frame(lob, t) {
    const eased = smoothstep(t);
    const x = lerp(lob.startX, lob.endX, t) + Math.sin(Math.PI * t) * lob.drift;
    const baseY = lerp(lob.startY, lob.endY, t);
    const y = baseY - Math.sin(Math.PI * t) * lob.arcHeight;
    return {
      x,
      y,
      rotation: lob.spin * eased,
      scale: 0.9 + Math.sin(Math.PI * t) * 0.16,
      opacity: Math.min(smoothstep(t / 0.08), 1 - smoothstep((t - 0.92) / 0.08)),
    };
  }

  function applyFrame(lob, t) {
    const next = frame(lob, t);
    lob.currentX = next.x;
    lob.currentY = next.y;
    lob.el.style.opacity = next.opacity.toFixed(3);
    lob.el.style.transform =
      `translate3d(${next.x.toFixed(2)}px, ${next.y.toFixed(2)}px, 0) ` +
      `rotate(${next.rotation.toFixed(2)}deg) scale(${next.scale.toFixed(3)})`;
    return next;
  }

  function hitIndex(lobs, event, options = {}) {
    for (let index = lobs.length - 1; index >= 0; index -= 1) {
      const lob = lobs[index];
      const rect = lob.el.getBoundingClientRect();
      const opacity = Number(lob.el.style.opacity || 1);
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;
      if (inside && opacity > (options.minOpacity ?? 0.08)) return index;
    }
    return -1;
  }

  function planPath(options) {
    const { bounds, fromLeft, size, activeLobs, randomBetween, menuBottom, spinDegrees, durationRange } = options;
    const offscreenPad = size * 1.65;
    const startX = fromLeft ? -offscreenPad : bounds.width + offscreenPad * 0.55;
    const endX = fromLeft ? bounds.width + offscreenPad * 0.55 : -offscreenPad;
    const desiredPathTop = Math.max(bounds.height * 0.42, Math.min(menuBottom + size * 0.15, bounds.height * 0.6));
    const minY = Math.min(Math.max(size * 0.7, desiredPathTop), bounds.height - size * 1.05);
    const maxY = Math.max(minY + 1, Math.min(bounds.height - size * 0.8, bounds.height * 0.88));
    const arcCeiling = Math.max(size * 0.35, bounds.height * 0.12);
    let selectedPath = null;

    for (let attempt = 0; attempt < 8; attempt += 1) {
      const candidateStartY = randomBetween(minY, maxY);
      const candidateEndY = randomBetween(minY, maxY);
      const desiredArcHeight = randomBetween(bounds.height * 0.18, bounds.height * 0.34);
      const candidateArcHeight = Math.max(24, Math.min(desiredArcHeight, Math.min(candidateStartY, candidateEndY) - arcCeiling));
      const candidateMidY = (candidateStartY + candidateEndY) / 2 - candidateArcHeight * 0.7;
      const nearest = activeLobs.reduce((distance, lob) => {
        const lobY = Number.isFinite(lob.currentY) ? lob.currentY : (lob.startY + lob.endY) / 2;
        return Math.min(distance, Math.abs(lobY - candidateMidY));
      }, Number.POSITIVE_INFINITY);
      const score = nearest + randomBetween(0, 18);
      if (!selectedPath || score > selectedPath.score) {
        selectedPath = { startY: candidateStartY, endY: candidateEndY, arcHeight: candidateArcHeight, score };
      }
    }

    const spinDirection = fromLeft ? 1 : -1;
    return {
      ...selectedPath,
      startX,
      endX,
      drift: randomBetween(-28, 28),
      spin: spinDirection * Math.round(randomBetween(spinDegrees.min, spinDegrees.max)),
      duration: randomBetween(durationRange.min, durationRange.max),
    };
  }

  window.FoodAnimalsFoodLobRuntime = {
    applyFrame,
    frame,
    hitIndex,
    maxActive,
    planPath,
    smoothstep,
    lerp,
  };
})();
