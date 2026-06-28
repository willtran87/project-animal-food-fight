(() => {
  "use strict";

  function phaseTransition(type, duration, extra = {}) {
    return {
      type,
      elapsed: 0,
      duration,
      ...extra,
    };
  }

  function updatePhaseTransition(transition, dt) {
    if (!transition) return null;
    const duration = Math.max(0.001, Number(transition.duration) || 0.001);
    const elapsed = Math.min(duration, (Number(transition.elapsed) || 0) + Math.max(0, Number(dt) || 0));
    if (elapsed >= duration) return null;
    return { ...transition, elapsed, duration };
  }

  function phaseTransitionBlocksBattle(transition) {
    return transition?.type === "prepToBattle";
  }

  function battleStartDecision({ phase, allyCount }) {
    if (phase !== "prep") return { ok: false, reason: "wrongPhase" };
    if ((Number(allyCount) || 0) <= 0) return { ok: false, reason: "emptyTeam" };
    return { ok: true };
  }

  function shouldAdvanceRound(options = {}) {
    if (options.defeatWithHealth) return false;
    return !options.retryGiraffeBoss && !options.retryFinalBoss && !options.finalDefeat;
  }

  window.FoodAnimalsBattleFlowRuntime = Object.freeze({
    battleStartDecision,
    phaseTransition,
    phaseTransitionBlocksBattle,
    shouldAdvanceRound,
    updatePhaseTransition,
  });
})();
