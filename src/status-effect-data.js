(() => {
  "use strict";

  const STATUS_EFFECT_STYLES = {
    burn: { color: "#e24822", accent: "#ffc14a", kind: "flame" },
    mark: { color: "#59651d", accent: "#d8e46b", kind: "target" },
    taunt: { color: "#85512e", accent: "#f0d56b", kind: "target" },
    haste: { color: "#f0b12e", accent: "#fff0a8", kind: "chevron" },
    attackBoost: { color: "#d7a64e", accent: "#fff3bd", kind: "burst" },
    attackSlow: { color: "#f4d67a", accent: "#7c5a1e", kind: "down" },
    antiSupport: { color: "#f4dcaa", accent: "#8b5d35", kind: "brokenPlus" },
    slowed: { color: "#5aa832", accent: "#d8f2a2", kind: "vine" },
    lateFightStacks: { color: "#e39b22", accent: "#fff0a8", kind: "crown" },
    teamVulnerable: { color: "#d9a12c", accent: "#fff1a4", kind: "target" },
    mold: { color: "#6f9231", accent: "#b7e033", kind: "mold" },
    radiation: { color: "#b7e033", accent: "#fff36a", kind: "radiation" },
  };
  const STATUS_EFFECT_SPRITES = {
    burn: "assets/status-effects/runtime/status-flash-effect_burn_idle_SW_00.png",
    mark: "assets/status-effects/runtime/status-flash-effect_mark_idle_SW_00.png",
    teamVulnerable: "assets/status-effects/runtime/status-flash-effect_team_vulnerable_idle_SW_00.png",
    haste: "assets/status-effects/runtime/status-flash-effect_haste_idle_SW_00.png",
    attackBoost: "assets/status-effects/runtime/status-flash-effect_attack_boost_idle_SW_00.png",
    attackSlow: "assets/status-effects/runtime/status-flash-effect_attack_slow_idle_SW_00.png",
    antiSupport: "assets/status-effects/runtime/status-flash-effect_anti_support_idle_SW_00.png",
    slowed: "assets/status-effects/runtime/status-flash-effect_slowed_idle_SW_00.png",
    lateFightStacks: "assets/status-effects/runtime/status-flash-effect_late_fight_stacks_idle_SW_00.png",
    mold: "assets/status-effects/runtime/status-flash-effect_mold_idle_SW_00.png",
    radiation: "assets/status-effects/runtime/status-flash-effect_radiation_idle_SW_00.png?v=1",
  };
  const HORROR_STATUS_EFFECT_SPRITES = {
    burn: "assets/status-effects/runtime/status-horror-effect_burn_idle_FRONT_00.png",
    mark: "assets/status-effects/runtime/status-horror-effect_mark_idle_FRONT_00.png",
    teamVulnerable: "assets/status-effects/runtime/status-horror-effect_team_vulnerable_idle_FRONT_00.png",
    haste: "assets/status-effects/runtime/status-horror-effect_haste_idle_FRONT_00.png",
    attackBoost: "assets/status-effects/runtime/status-horror-effect_attack_boost_idle_FRONT_00.png",
    attackSlow: "assets/status-effects/runtime/status-horror-effect_attack_slow_idle_FRONT_00.png",
    antiSupport: "assets/status-effects/runtime/status-horror-effect_anti_support_idle_FRONT_00.png",
    slowed: "assets/status-effects/runtime/status-horror-effect_slowed_idle_FRONT_00.png",
    lateFightStacks: "assets/status-effects/runtime/status-horror-effect_late_fight_stacks_idle_FRONT_00.png",
    radiation: "assets/status-effects/runtime/status-horror-effect_radiation_idle_FRONT_00.png",
  };

  window.FoodAnimalsStatusEffectData = Object.freeze({
    HORROR_STATUS_EFFECT_SPRITES,
    STATUS_EFFECT_SPRITES,
    STATUS_EFFECT_STYLES,
  });
})();
