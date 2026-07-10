import assert from "node:assert/strict";
import fs from "node:fs";
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
    "src/dynamic-asset-manifest.js",
    "src/rng-runtime.js",
    "src/presentation-data.js",
    "src/shop-economy.js",
    "src/catalog-runtime.js",
    "src/shop-flow-runtime.js",
    "src/run-storage.js",
    "src/slot-layout.js",
    "src/transition-canvas.js",
    "src/battle-canvas.js",
    "src/reward-runtime.js",
    "src/enemy-team-runtime.js",
    "src/battle-flow-runtime.js",
    "src/combat-ledger-capture.js",
    "src/battle-ability-runtime.js",
    "src/battle-item-runtime.js",
    "src/shop-transaction-runtime.js",
    "src/particle-runtime.js",
    "src/result-runtime.js",
  ],
  createBrowserLikeContext(),
);

const shop = context.FoodAnimalsShopEconomy;
const rng = context.FoodAnimalsRngRuntime;
const manifest = context.FoodAnimalsDynamicAssetManifest;
const catalog = context.FoodAnimalsCatalogRuntime;
const presentation = context.FoodAnimalsPresentationData;
assert.ok(rng, "FoodAnimalsRngRuntime should load");
assert.equal(rng.normalizeSeed("  abc  "), "abc", "rng seed normalization should trim explicit seeds");
const firstRng = rng.createState("fixed-seed");
const firstValues = [rng.next(firstRng), rng.next(firstRng), rng.next(firstRng)];
const replayRng = rng.createState("fixed-seed");
assert.deepEqual(
  [rng.next(replayRng), rng.next(replayRng), rng.next(replayRng)],
  firstValues,
  "same seed should replay the same random stream",
);
const resumedRng = rng.createState("fixed-seed", 2);
assert.equal(rng.next(resumedRng), firstValues[2], "rng call count should resume the stream exactly");
assert.ok(manifest, "FoodAnimalsDynamicAssetManifest should load");
assert.ok(catalog, "FoodAnimalsCatalogRuntime should load");
assert.ok(presentation, "FoodAnimalsPresentationData should load");
assert.equal(
  manifest.audioSfx.length,
  manifest.expectedAudioSfxCount,
  "dynamic SFX manifest should enumerate each theme/id path once",
);
assert.deepEqual(
  manifest.gameSfxIds,
  presentation.GAME_SFX_IDS,
  "dynamic SFX manifest should stay aligned with presentation game SFX ids",
);
for (const relPath of manifest.audioSfx) {
  assert.ok(fs.existsSync(path.join(repoRoot, relPath)), `dynamic SFX manifest path should exist: ${relPath}`);
}
const seededUnit = catalog.makeUnitData(
  {
    id: "seed_test",
    name: "Seed Test",
    forms: [{ name: "Seed Test", short: "Seed" }],
    hp: 10,
    atk: 4,
    speed: 1,
  },
  1,
  99,
  {
    random: () => 0.5,
    tierScaling: [{}, { hp: 1, atk: 1, ability: 1, speed: 1 }],
  },
);
assert.equal(seededUnit.cooldown, 0.125, "unit creation should accept injected deterministic random");
assert.equal(shop.slotUnlockCost([0, 0, 30], 2), 30, "shop slot unlock cost should read by index");
assert.equal(shop.upgradeCost([{ upgradeCost: 80 }], 1, 25), 55, "upgrade discount should reduce cost");
assert.equal(shop.itemResaleValue(36), 16, "item resale should stay below the 50% sale floor");
assert.equal(shop.itemResaleValue(18, 0), 0, "zero-cost sale purchases should not resell for profit");
assert.equal(shop.cappedSellValue(45, 30), 30, "tracked purchases should cap resale at the paid cost");
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

const shopFlow = context.FoodAnimalsShopFlowRuntime;
const rerollState = { phase: "prep", gold: 25, freeRolls: 0, rollsThisRound: 1 };
const rerollDecision = shopFlow.rerollDecision({ ...rerollState, cost: 14 });
assert.equal(rerollDecision.spendGold, 14, "paid reroll should spend the current roll cost");
assert.equal(rerollDecision.incrementRolls, true, "paid reroll should increment paid roll count");
assert.equal(shopFlow.applyRerollCost(rerollState, rerollDecision), true, "reroll cost should apply to state");
assert.deepEqual(
  rerollState,
  { phase: "prep", gold: 11, freeRolls: 0, rollsThisRound: 2 },
  "reroll cost application should update gold and rolls",
);
assert.equal(shopFlow.unlockDecision({ phase: "prep", index: 2, slotCount: 8, unlocked: true, gold: 99, cost: 30 }).reason, "alreadyOpen");
assert.equal(shopFlow.upgradeDecision({ phase: "prep", cost: null, gold: 999 }).reason, "maxed");
assert.equal(shopFlow.freezeDecision({ phase: "prep", unlocked: true, hasEntry: false }).reason, "empty");
let frozenSaleRolls = 0;
assert.equal(
  shopFlow.shopSaleState({
    hasEntry: true,
    frozen: true,
    previousSale: false,
    rollSale: () => {
      frozenSaleRolls += 1;
      return true;
    },
  }),
  false,
  "locked full-price shop entries should not become sale entries on refresh",
);
assert.equal(frozenSaleRolls, 0, "locked shop sale state should not roll while preserving price");
assert.equal(
  shopFlow.shopSaleState({ hasEntry: true, frozen: true, previousSale: true, rollSale: false }),
  true,
  "locked sale shop entries should keep their sale price on refresh",
);
assert.equal(shopFlow.shopSaleState({ hasEntry: true, frozen: false, rollSale: true }), true, "unlocked shop entries should roll sale state");
assert.equal(
  shopFlow.buyTargetDecision({
    phase: "prep",
    unlocked: true,
    hasEntry: true,
    gold: 30,
    cost: 18,
    entryType: "drink",
    targetArea: "board",
    targetInRange: true,
  }).reason,
  "drinkTarget",
);

const runStorage = context.FoodAnimalsRunStorage;
const circular = { name: "root" };
circular.self = circular;
circular.child = { owner: circular };
const cloned = runStorage.cloneValue(circular);
assert.equal(cloned.name, "root", "run storage clone should keep plain fields");
assert.equal(cloned.self, undefined, "run storage clone should drop direct ancestor cycles");
assert.equal(JSON.stringify(cloned.child), "{}", "run storage clone should drop nested ancestor cycles");

const slots = context.FoodAnimalsSlotLayout;
assert.equal(JSON.stringify(slots.grid(5, 3)), JSON.stringify({ col: 2, row: 1 }), "slot layout grid should map index to row/col");
assert.equal(
  JSON.stringify(slots.gridPosition(5, { cols: 3, x: 10, y: 20, gapX: 7, gapY: 11 })),
  JSON.stringify({ x: 24, y: 31, col: 2, row: 1 }),
  "slot layout grid position should apply origin and gaps",
);
assert.equal(slots.itemBenchSlotKind(3, 4), "drink", "first item bench slots should accept drinks");
assert.equal(slots.itemBenchSlotKind(4, 4), "topping", "later item bench slots should accept toppings");

const transitionCanvas = context.FoodAnimalsTransitionCanvas;
assert.equal(transitionCanvas.progress({ elapsed: 0.5, duration: 2 }), 0.25, "transition progress should normalize elapsed time");
assert.equal(transitionCanvas.progress(null), 1, "missing transition should be complete");
assert.equal(transitionCanvas.prepToBattleVisual({ elapsed: 1.45, duration: 1.45 }, 1.45).progress, 1);
assert.equal(transitionCanvas.battleToResultVisual({ elapsed: 0, duration: 1.45 }, 1.45).reveal, 0);

const battleCanvas = context.FoodAnimalsBattleCanvas;
assert.equal(
  JSON.stringify(battleCanvas.battleDrinkSlotPosition("ally", { axis: "row", targetIndex: 2 }, { allyBaseX: 300, enemyBaseX: 700, colGap: 80, topY: 100, rowGap: 50 }, 3)),
  JSON.stringify({ x: 220, y: 200 }),
  "ally row drink slot should sit left of ally board",
);
assert.equal(
  battleCanvas.sideUnitsInRenderOrder([{ col: 0, id: "back" }, { col: 2, id: "front" }], { frontCol: 2, slotGrid: slots.grid }).map((unit) => unit.id).join(","),
  "front,back",
  "battle canvas should render front columns before back columns",
);
assert.equal(Math.round(battleCanvas.projectileFrame({ x: 0, y: 0 }, { x: 100, y: 0 }, 0.5, 1, 20).x), 75);

const battleFlow = context.FoodAnimalsBattleFlowRuntime;
assert.equal(battleFlow.battleStartDecision({ phase: "prep", allyCount: 0 }).reason, "emptyTeam");
assert.equal(battleFlow.phaseTransitionBlocksBattle(battleFlow.phaseTransition("prepToBattle", 1)), true);
assert.equal(battleFlow.updatePhaseTransition({ type: "battleToResult", elapsed: 0.2, duration: 1 }, 0.3).elapsed, 0.5);
assert.equal(battleFlow.updatePhaseTransition({ type: "battleToResult", elapsed: 0.8, duration: 1 }, 0.3), null);
assert.equal(battleFlow.shouldAdvanceRound({ retryGiraffeBoss: false, retryFinalBoss: false, finalDefeat: false }), true);
assert.equal(battleFlow.shouldAdvanceRound({ retryGiraffeBoss: true, retryFinalBoss: false, finalDefeat: false }), false);
assert.equal(
  battleFlow.shouldAdvanceRound({ retryGiraffeBoss: false, retryFinalBoss: false, finalDefeat: false, defeatWithHealth: true }),
  false,
  "defeat with health or hull remaining should retry the same round",
);

const ledgerCapture = context.FoodAnimalsCombatLedgerCapture;
const ledgerAlly = { uid: 1, side: "ally", name: "Ally", short: "Ally", typeId: "ally", tier: 1 };
const ledgerEnemy = { uid: 2, side: "enemy", name: "Enemy", short: "Enemy", typeId: "enemy", tier: 1 };
const ledgerBattle = {
  elapsed: 1,
  allies: [ledgerAlly],
  enemies: [ledgerEnemy],
  ledger: ledgerCapture.createLedger([ledgerAlly], [ledgerEnemy]),
};
for (let index = 0; index < 5; index += 1) {
  ledgerCapture.recordDamage(ledgerBattle, ledgerAlly, ledgerEnemy, 3, 1, { status: true, maxEvents: 2 });
  ledgerCapture.recordDamage(ledgerBattle, ledgerEnemy, ledgerAlly, 2, 2, { maxEvents: 2 });
}
const ledgerSummary = ledgerCapture.summarize(ledgerBattle, { won: true, heartDamage: 0 });
assert.equal(ledgerSummary.events.length, 2, "combat event display history should stay bounded");
assert.equal(ledgerSummary.ally.statusDamageDealt, 20, "status totals should survive event-history eviction");
assert.equal(ledgerSummary.ally.shieldAbsorbed, 10, "shield totals should survive event-history eviction");

const rewards = context.FoodAnimalsRewardRuntime;
const rewardState = { gold: 90, freeRolls: 0 };
assert.equal(rewards.claimReward(rewardState, { type: "arenaPurse", amount: 20, freeRolls: 1 }, { maxGold: 100 }).claimed, true);
assert.deepEqual(rewardState, { gold: 100, freeRolls: 1 }, "arena purse should cap gold and add free roll");
assert.equal(rewards.rewardKey({ type: "copy", typeId: "toast_tortoise" }), "copy:toast_tortoise");
const fullRewardState = { gold: 5, freeRolls: 0 };
const fullRewardResult = rewards.claimReward(
  fullRewardState,
  { type: "item", itemId: "sunny_side_egg", tier: 1 },
  {
    fallbackGold: 15,
    makeItem: () => ({ kind: "item", type: "topping" }),
    maxGold: 100,
    moveItemToBench: () => false,
  },
);
assert.equal(fullRewardResult.fallback.reason, "storageFull", "full item storage should report fallback reason");
assert.equal(fullRewardResult.fallback.goldAdded, 15, "full item storage should convert reward to fallback gold");
assert.equal(fullRewardState.gold, 20, "fallback gold should be applied to state");

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

const resultRuntime = context.FoodAnimalsResultRuntime;
assert.equal(
  resultRuntime.shouldReturnToMenuAfterResult({ phase: "result", hearts: 0, realityBroken: false }),
  true,
  "cozy game-over result should return to menu",
);
assert.equal(
  resultRuntime.shouldReturnToMenuAfterResult({ phase: "result", hearts: 0, realityBroken: true }),
  false,
  "horror game-over result should stay in game flow",
);
assert.equal(resultRuntime.rebootTransitionNavigatesToMenu({ source: "defeat" }), true);
assert.equal(resultRuntime.shopReturnTransitionNavigatesToMenu({ source: "cozyDefeatReturn" }), true);
assert.equal(
  JSON.stringify(resultRuntime.battleResultTitle(
    { gameOver: true, horror: false, won: false },
    { cozyRunOver: "cozy-run-over", realityRunOver: "system-down" },
  )),
  JSON.stringify({ src: "cozy-run-over", fallback: "RUN OVER" }),
);

console.log("Runtime logic check passed.");
