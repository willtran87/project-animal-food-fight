import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createBrowserLikeContext, loadBrowserScripts } from "./browser_script_loader.mjs";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");

function sequenceRandom(values) {
  let index = 0;
  return () => values[Math.min(index++, values.length - 1)];
}

const context = loadBrowserScripts(
  repoRoot,
  [
    "src/shop-economy.js",
    "src/reward-runtime.js",
    "src/enemy-team-runtime.js",
    "src/battle-ability-runtime.js",
    "src/battle-item-runtime.js",
    "src/shop-transaction-runtime.js",
    "src/particle-runtime.js",
  ],
  createBrowserLikeContext(),
);

const shop = context.FoodAnimalsShopEconomy;
assert.equal(shop.slotUnlockCost([0, 0, 30], 2), 30, "shop slot unlock cost should read by index");
assert.equal(shop.upgradeCost([{ upgradeCost: 80 }], 1, 25), 55, "upgrade discount should reduce cost");
assert.equal(
  JSON.stringify(shop.entryTierChances(5)),
  JSON.stringify({ tier2: 0.25, tier3: 0.1 }),
  "level 5 should expose tier 2/3 roll chances",
);
assert.equal(shop.rollEntryTier(5, () => 0.05), 3, "low level-5 roll should become tier 3");
assert.equal(shop.rollEntryTier(5, () => 0.2), 2, "mid level-5 roll should become tier 2");
assert.equal(shop.rollEntryTier(5, () => 0.9), 1, "high level-5 roll should stay tier 1");
assert.equal(
  shop.chooseRarity(
    { common: { id: "common" }, rare: { id: "rare" } },
    { common: 1, rare: 3 },
    () => 0.99,
  ),
  "rare",
  "weighted rarity choice should honor weights",
);

const rewards = context.FoodAnimalsRewardRuntime;
const rewardState = { gold: 90, freeRolls: 0 };
assert.equal(rewards.claimReward(rewardState, { type: "arenaPurse", amount: 20, freeRolls: 1 }, { maxGold: 100 }), true);
assert.deepEqual(rewardState, { gold: 100, freeRolls: 1 }, "arena purse should cap gold and add free roll");
assert.equal(rewards.rewardKey({ type: "copy", typeId: "toast_tortoise" }), "copy:toast_tortoise");

const enemy = context.FoodAnimalsEnemyTeamRuntime;
assert.equal(enemy.stochasticRound(2.75, () => 0.7), 3, "stochastic round should round up by fractional chance");
assert.equal(enemy.stochasticRound(2.75, () => 0.9), 2, "stochastic round should round down above fractional chance");
assert.equal(
  enemy.weightedChoice([{ id: "a", w: 1 }, { id: "b", w: 3 }], (entry) => entry.w, () => 0.99).id,
  "b",
  "weighted choice should pick late weighted entries",
);
assert.equal(enemy.enemyTierForPlan({ targetExtraTier: 2, tier3Chance: 0.4, tier4Chance: 0.1 }, () => 0.05), 4);
assert.equal(enemy.enemyTierForPlan({ targetExtraTier: 2, tier3Chance: 0.4, tier4Chance: 0.1 }, () => 0.3), 3);

const ability = context.FoodAnimalsBattleAbilityRuntime;
const unit = { slot: 4, ability: "execute" };
const foes = [{ slot: 0, hp: 20, maxHp: 30 }, { slot: 2, hp: 5, maxHp: 30 }];
assert.equal(ability.chooseTarget(unit, foes).slot, 2, "execute should target weakest enemy");
assert.equal(ability.attackClockMultiplier({ haste: { pct: 0.2 }, attackSlow: { pct: 0.1 } }), 1.08);

const battleItem = context.FoodAnimalsBattleItemRuntime;
assert.equal(battleItem.adjacent({ slot: 4 }, { slot: 5 }), true, "side-by-side slots should be adjacent");
assert.equal(battleItem.selfHealAmount({ maxHp: 100, item: { selfHealPct: 0.12 } }), 12);

const shopTx = context.FoodAnimalsShopTransactionRuntime;
const purchaseState = { phase: "prep", gold: 10 };
assert.equal(
  JSON.stringify(shopTx.purchaseFailure(purchaseState, 12, { needMessage: "Need coins" })),
  JSON.stringify({ ok: false, message: "Need coins", sfx: "invalid" }),
);

const particles = context.FoodAnimalsParticleRuntime.createBurst(
  { x: 10, y: 20 },
  "#fff",
  { count: 2, speedMin: 10, speedMax: 10, lifeMin: 1, lifeMax: 1 },
  {},
  sequenceRandom([0, 0.25, 0.5, 0.75, 0.9, 0.1]),
);
assert.equal(particles.length, 2, "particle burst should create requested count");
assert.equal(particles[0].x, 10);
assert.equal(particles[0].y, 22.5);

console.log("Runtime logic check passed.");
