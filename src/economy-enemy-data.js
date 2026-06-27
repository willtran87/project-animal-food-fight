(() => {
  "use strict";

  const ECONOMY = {
    startingGold: 105,
    maxGold: 999,
    freeRollsPerShopLevel: 1,
    rollCost: 7,
    unitCost: 30,
    itemCost: window.FoodAnimalsItemData?.ITEM_BASE_COST || 18,
    winGold: 62,
    lossGold: 55,
    interestStep: 25,
    interestGold: 5,
    interestCap: 15,
    streakGold: [
      { at: 6, gold: 20 },
      { at: 4, gold: 12 },
      { at: 2, gold: 6 },
    ],
    sellValues: {
      1: 12,
      2: 45,
      3: 125,
      4: 300,
    },
  };
  const ENEMY_ARCHETYPES = [
    { id: "horde", label: "Horde", weight: 4, minRound: 1, countBias: 1, tierBias: -0.11, tier3Bias: -0.045, statBias: -0.035, itemBias: -1, drinkBias: 0, traitFocus: 0.28 },
    { id: "juggernaut", label: "Juggernaut", weight: 3, minRound: 2, countBias: -1, tierBias: 0.12, tier3Bias: 0.04, statBias: 0.03, itemBias: 1, drinkBias: -1, traitFocus: 0.42 },
    { id: "arsenal", label: "Arsenal", weight: 4, minRound: 3, countBias: 0, tierBias: 0.032, tier3Bias: 0.016, statBias: -0.002, itemBias: 1, drinkBias: 1, traitFocus: 0.7 },
  ];
  const ENEMY_ARCHETYPE_PRIMARY_SHARE = 0.72;
  const ENEMY_ARCHETYPE_NOISE = {
    countBias: 0.42,
    tierBias: 0.036,
    tier3Bias: 0.018,
    statBias: 0.016,
    itemBias: 0.42,
    drinkBias: 0.42,
    traitFocus: 0.18,
    rarityBias: 0.25,
  };
  const SHOP_POWER_ENEMY_STAT_BONUS_BY_ROUND = [
    { round: 15, bonus: 0.04 },
    { round: 10, bonus: 0.032 },
    { round: 8, bonus: 0.024 },
    { round: 5, bonus: 0.015 },
    { round: 3, bonus: 0.008 },
  ];
  const SHOP_POWER_ENEMY_TIER_BONUS_BY_ROUND = [
    { round: 15, bonus: 0.045 },
    { round: 10, bonus: 0.036 },
    { round: 8, bonus: 0.027 },
    { round: 5, bonus: 0.018 },
    { round: 3, bonus: 0.01 },
  ];
  const SHOP_POWER_ENEMY_TIER3_BONUS_BY_ROUND = [
    { round: 15, bonus: 0.013 },
    { round: 10, bonus: 0.008 },
    { round: 8, bonus: 0.005 },
  ];
  const FINAL_BOSS_SHOP_POWER_HP_MULTIPLIER = 1.04;
  const FINAL_BOSS_SHOP_POWER_ATK_MULTIPLIER = 1.03;
  const TIER_SCALING = [
    null,
    { hp: 1, atk: 1, speed: 1, ability: 1 },
    { hp: 2.35, atk: 2.15, speed: 0.92, ability: 1.45 },
    { hp: 4.9, atk: 4.35, speed: 0.84, ability: 2.1 },
    { hp: 9.2, atk: 8.15, speed: 0.76, ability: 3.15 },
  ];
  const GLOBAL_HP_SCALE = 7.4;
  const MERGE_GOLD_REWARD = {
    2: 8,
    3: 16,
    4: 28,
  };
  const BATTLE_SPEEDS = [0.5, 1, 2, 4];
  const BOSS_BATTLE_SPEEDS = [0.5, 1];

  window.FoodAnimalsEconomyEnemyData = Object.freeze({
    BATTLE_SPEEDS,
    BOSS_BATTLE_SPEEDS,
    ECONOMY,
    ENEMY_ARCHETYPES,
    ENEMY_ARCHETYPE_NOISE,
    ENEMY_ARCHETYPE_PRIMARY_SHARE,
    FINAL_BOSS_SHOP_POWER_ATK_MULTIPLIER,
    FINAL_BOSS_SHOP_POWER_HP_MULTIPLIER,
    GLOBAL_HP_SCALE,
    MERGE_GOLD_REWARD,
    SHOP_POWER_ENEMY_STAT_BONUS_BY_ROUND,
    SHOP_POWER_ENEMY_TIER3_BONUS_BY_ROUND,
    SHOP_POWER_ENEMY_TIER_BONUS_BY_ROUND,
    TIER_SCALING,
  });
})();
