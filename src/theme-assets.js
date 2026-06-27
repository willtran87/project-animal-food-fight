(() => {
  "use strict";

  const MENU_THEME_ALIASES = Object.freeze({
    cozy: "cozy",
    picnic: "cozy",
    harvest: "cozy",
    normal: "cozy",
    horror: "horror",
    war: "horror",
    broken: "horror",
    reality: "horror",
    future: "horror",
  });

  function normalizeMenuTheme(value, fallback = "cozy") {
    const key = String(value || "").trim().toLowerCase();
    return MENU_THEME_ALIASES[key] || fallback;
  }

  function isHorrorTheme(value) {
    return normalizeMenuTheme(value) === "horror";
  }

  function pick(horror, cozyValue, horrorValue) {
    return horror ? horrorValue : cozyValue;
  }

  function pickTheme(theme, cozyValue, horrorValue) {
    return pick(isHorrorTheme(theme), cozyValue, horrorValue);
  }

  window.FoodAnimalsThemeAssets = Object.freeze({
    MENU_THEME_ALIASES,
    normalizeMenuTheme,
    isHorrorTheme,
    pick,
    pickTheme,
  });
})();
