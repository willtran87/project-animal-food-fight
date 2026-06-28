import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createBrowserLikeContext, loadBrowserScripts } from "./browser_script_loader.mjs";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");
const outputDir = path.join(repoRoot, "output");
const outputPath = path.join(outputDir, "balance-simulation-report.json");

const context = loadBrowserScripts(
  repoRoot,
  [
    "src/item-data.js",
    "src/rarity-shop-data.js",
    "src/economy-enemy-data.js",
    "src/shop-economy.js",
    "src/enemy-team-runtime.js",
  ],
  createBrowserLikeContext(),
);

const shop = context.FoodAnimalsShopEconomy;
const enemy = context.FoodAnimalsEnemyTeamRuntime;
const rarityData = context.FoodAnimalsRarityShopData;
const economyData = context.FoodAnimalsEconomyEnemyData;
const itemData = context.FoodAnimalsItemData;

function round(value, digits = 3) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function weightPercents(weights) {
  const total = Object.values(weights || {}).reduce((sum, weight) => sum + Math.max(0, Number(weight) || 0), 0);
  return Object.fromEntries(
    Object.entries(weights || {}).map(([key, weight]) => [key, total > 0 ? round((Math.max(0, Number(weight) || 0) / total) * 100, 2) : 0]),
  );
}

function deterministicAverageSupport(roundNumber, max, every, bias = 0) {
  const values = [0.08, 0.32, 0.5, 0.72, 0.9].map((roll) => enemy.enemySupportCount(roundNumber, max, every, bias, () => roll));
  return round(values.reduce((sum, value) => sum + value, 0) / values.length, 2);
}

const shopLevels = rarityData.SHOP_LEVELS.map((level) => {
  const entryTierChances = shop.entryTierChances(level.level);
  return {
    level: level.level,
    upgradeCost: level.upgradeCost,
    rarityWeights: shop.rarityWeights(rarityData.SHOP_LEVELS, level.level),
    rarityPercents: weightPercents(level.rarityWeights),
    entryTierChances,
    entryTierPercents: {
      tier1: round((1 - entryTierChances.tier2 - entryTierChances.tier3) * 100, 2),
      tier2: round(entryTierChances.tier2 * 100, 2),
      tier3: round(entryTierChances.tier3 * 100, 2),
    },
  };
});

const rollCosts = Array.from({ length: 6 }, (_entry, rollsThisRound) => ({
  rollsThisRound,
  costWithFreeRoll: shop.rollCost(economyData.ECONOMY, 1, rollsThisRound),
  paidCost: shop.rollCost(economyData.ECONOMY, 0, rollsThisRound),
}));

const itemPriceSummary = itemData.ITEMS.reduce(
  (summary, item) => {
    summary.count += 1;
    summary.min = Math.min(summary.min, item.price);
    summary.max = Math.max(summary.max, item.price);
    summary.total += item.price;
    summary.byRarity[item.rarity] = summary.byRarity[item.rarity] || { count: 0, min: Infinity, max: -Infinity, total: 0 };
    const bucket = summary.byRarity[item.rarity];
    bucket.count += 1;
    bucket.min = Math.min(bucket.min, item.price);
    bucket.max = Math.max(bucket.max, item.price);
    bucket.total += item.price;
    return summary;
  },
  { count: 0, min: Infinity, max: -Infinity, total: 0, byRarity: {} },
);

const itemPrices = {
  count: itemPriceSummary.count,
  min: itemPriceSummary.min,
  max: itemPriceSummary.max,
  average: round(itemPriceSummary.total / Math.max(1, itemPriceSummary.count), 2),
  byRarity: Object.fromEntries(
    Object.entries(itemPriceSummary.byRarity).map(([rarity, bucket]) => [
      rarity,
      {
        count: bucket.count,
        min: bucket.min,
        max: bucket.max,
        average: round(bucket.total / Math.max(1, bucket.count), 2),
      },
    ]),
  ),
};

function latePressure(roundNumber) {
  return Math.max(0, roundNumber - 10);
}

const enemyRounds = [1, 3, 5, 8, 10, 15, 20, 25].map((roundNumber) => ({
  round: roundNumber,
  archetypes: Object.fromEntries(
    economyData.ENEMY_ARCHETYPES.filter((archetype) => roundNumber >= (archetype.minRound || 1)).map((archetype) => {
      const weights = enemy.enemyRarityWeights(roundNumber, archetype, latePressure(roundNumber));
      return [
        archetype.id,
        {
          rarityWeights: weights,
          rarityPercents: weightPercents(weights),
          averageToppings: deterministicAverageSupport(roundNumber, Math.min(9, 2 + Math.floor(roundNumber / 2)), 3, archetype.itemBias || 0),
          averageDrinks: deterministicAverageSupport(roundNumber, 4, 4, archetype.drinkBias || 0),
        },
      ];
    }),
  ),
}));

const report = {
  generatedAt: new Date().toISOString(),
  economy: {
    startingGold: economyData.ECONOMY.startingGold,
    maxGold: economyData.ECONOMY.maxGold,
    unitCost: economyData.ECONOMY.unitCost,
    itemCost: economyData.ECONOMY.itemCost,
    winGold: economyData.ECONOMY.winGold,
    lossGold: economyData.ECONOMY.lossGold,
    interest: {
      step: economyData.ECONOMY.interestStep,
      gold: economyData.ECONOMY.interestGold,
      cap: economyData.ECONOMY.interestCap,
    },
    streakGold: economyData.ECONOMY.streakGold,
    sellValues: economyData.ECONOMY.sellValues,
  },
  rollCosts,
  shopLevels,
  itemPrices,
  enemyRounds,
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(`Balance simulation report written: ${path.relative(repoRoot, outputPath)} (${shopLevels.length} shop levels, ${enemyRounds.length} enemy round samples).`);
