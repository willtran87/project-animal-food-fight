(function () {
  function shouldReturnToMenuAfterResult(options = {}) {
    return options.phase === "result" && (options.hearts || 0) <= 0 && !options.realityBroken;
  }

  function rebootTransitionNavigatesToMenu(transition) {
    return transition?.source === "defeat";
  }

  function shopReturnTransitionNavigatesToMenu(transition) {
    return transition?.source === "cozyDefeatReturn";
  }

  function battleResultTitle(options = {}, sources = {}) {
    const horror = Boolean(options.horror);
    if (options.gameOver) {
      return {
        src: horror ? sources.realityRunOver : sources.cozyRunOver,
        fallback: horror ? "SYSTEM DOWN" : "RUN OVER",
      };
    }
    if (options.won) {
      return {
        src: horror ? sources.realityVictory : sources.cozyVictory,
        fallback: horror ? "RELAY OPENED" : "PATTERN HOLDS",
      };
    }
    return {
      src: horror ? sources.realityDefeat : sources.cozyDefeat,
      fallback: horror ? "HULL BREACH" : "PATTERN BREAKS",
    };
  }

  window.FoodAnimalsResultRuntime = Object.freeze({
    battleResultTitle,
    rebootTransitionNavigatesToMenu,
    shopReturnTransitionNavigatesToMenu,
    shouldReturnToMenuAfterResult,
  });
})();
