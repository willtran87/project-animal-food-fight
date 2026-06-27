import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createBrowserLikeContext, loadBrowserScripts } from "./browser_script_loader.mjs";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");

const context = loadBrowserScripts(
  repoRoot,
  [
    "src/item-data.js",
    "src/unit-data.js",
    "src/trait-arena-data.js",
    "src/rarity-shop-data.js",
    "src/economy-enemy-data.js",
    "src/status-effect-data.js",
    "src/presentation-data.js",
    "src/story-data.js",
    "src/copy-data.js",
  ],
  createBrowserLikeContext(),
);

const errors = [];

function check(condition, message) {
  if (!condition) errors.push(message);
}

function unique(values, label) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) errors.push(`Duplicate ${label}: ${value}`);
    seen.add(value);
  }
}

function stripUrlSuffix(value) {
  return String(value).split(/[?#]/, 1)[0];
}

function collectAssetStrings(value, out = new Set()) {
  if (!value) return out;
  if (typeof value === "string") {
    if (value.startsWith("assets/")) out.add(stripUrlSuffix(value));
    return out;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => collectAssetStrings(entry, out));
    return out;
  }
  if (typeof value === "object") {
    Object.values(value).forEach((entry) => collectAssetStrings(entry, out));
  }
  return out;
}

const itemData = context.FoodAnimalsItemData;
const unitData = context.FoodAnimalsUnitData;
const traitData = context.FoodAnimalsTraitArenaData;
const rarityData = context.FoodAnimalsRarityShopData;
const economyData = context.FoodAnimalsEconomyEnemyData;
const presentationData = context.FoodAnimalsPresentationData;
const statusData = context.FoodAnimalsStatusEffectData;

assert.ok(itemData, "FoodAnimalsItemData should load");
assert.ok(unitData, "FoodAnimalsUnitData should load");
assert.ok(traitData, "FoodAnimalsTraitArenaData should load");
assert.ok(rarityData, "FoodAnimalsRarityShopData should load");

const rarityIds = new Set(Object.keys(rarityData.RARITIES || {}));
const traitIds = new Set(Object.keys(traitData.TRAITS || {}));
const itemIds = new Set((itemData.ITEMS || []).map((item) => item.id));
const unitIds = new Set((unitData.CATALOG || []).map((unit) => unit.id));

unique([...itemIds], "item id");
unique([...unitIds], "unit id");

for (const item of itemData.ITEMS || []) {
  check(Boolean(item.id), "Item missing id");
  check(Boolean(item.name), `Item ${item.id} missing name`);
  check(["item"].includes(item.kind), `Item ${item.id} has invalid kind ${item.kind}`);
  check(["topping", "drink"].includes(item.type), `Item ${item.id} has invalid type ${item.type}`);
  check(rarityIds.has(item.rarity), `Item ${item.id} has invalid rarity ${item.rarity}`);
  check(Number.isFinite(item.price) && item.price >= 0, `Item ${item.id} has invalid price`);
  check(Number.isFinite(item.shopWeight) && item.shopWeight >= 0, `Item ${item.id} has invalid shopWeight`);
  check(Boolean(itemData.ITEM_SPRITES?.[item.id]), `Item ${item.id} missing ITEM_SPRITES entry`);
  if (item.type === "drink") {
    check(Boolean(itemData.DRINK_THROWABLE_SPRITES?.[item.id]), `Drink ${item.id} missing throwable sprite`);
    check(Boolean(itemData.REALITY_DRINK_THROWABLE_SPRITES?.[item.id]), `Drink ${item.id} missing horror throwable sprite`);
  }
}

for (const unit of unitData.CATALOG || []) {
  check(Boolean(unit.id), "Unit missing id");
  check(Boolean(unit.name), `Unit ${unit.id} missing name`);
  check(rarityIds.has(unit.rarity), `Unit ${unit.id} has invalid rarity ${unit.rarity}`);
  check(Array.isArray(unit.traits) && unit.traits.length >= 2, `Unit ${unit.id} should have at least two traits`);
  unique(unit.traits || [], `trait on unit ${unit.id}`);
  for (const trait of unit.traits || []) check(traitIds.has(trait), `Unit ${unit.id} has invalid trait ${trait}`);
  check(Number.isFinite(unit.hp) && unit.hp > 0, `Unit ${unit.id} has invalid hp`);
  check(Number.isFinite(unit.atk) && unit.atk > 0, `Unit ${unit.id} has invalid atk`);
  check(Number.isFinite(unit.speed) && unit.speed > 0, `Unit ${unit.id} has invalid speed`);
  check(Array.isArray(unit.forms) && unit.forms.length === 4, `Unit ${unit.id} should have four forms`);
  check(Boolean(unitData.RUNTIME_SPRITES?.[unit.id]), `Unit ${unit.id} missing runtime sprites`);
  check(Boolean(unitData.DEFEAT_STILL_SPRITES?.[unit.id]), `Unit ${unit.id} missing cozy defeat still`);
  check(Boolean(unitData.REALITY_RUNTIME_SPRITES?.[unit.id]), `Unit ${unit.id} missing horror runtime sprites`);
  check(Boolean(unitData.REALITY_DEFEAT_STILL_SPRITES?.[unit.id]), `Unit ${unit.id} missing horror defeat still`);
}

for (const [unitId, favorite] of Object.entries(traitData.FAVORITE_TOPPINGS || {})) {
  const toppingId = typeof favorite === "string" ? favorite : favorite?.itemId;
  check(unitIds.has(unitId), `Favorite topping maps unknown unit ${unitId}`);
  check(itemIds.has(toppingId), `Favorite topping for ${unitId} maps unknown item ${toppingId}`);
  check(typeof favorite?.bonus === "string" && favorite.bonus.length > 0, `Favorite topping for ${unitId} missing bonus copy`);
}

for (const arena of traitData.ARENAS || []) {
  check(Boolean(arena.id), "Arena missing id");
  check(Boolean(arena.name), `Arena ${arena.id} missing name`);
  check(Boolean(arena.backgroundSrc), `Arena ${arena.id} missing backgroundSrc`);
  check(Array.isArray(arena.effects) && arena.effects.length >= 1, `Arena ${arena.id} missing effects`);
}

for (const level of rarityData.SHOP_LEVELS || []) {
  check(Number.isInteger(level.level), `Shop level has invalid level ${level.level}`);
  for (const rarityId of rarityIds) {
    check(level.rarityWeights?.[rarityId] !== undefined, `Shop level ${level.level} missing ${rarityId} weight`);
  }
}
check(rarityData.MAX_SHOP_LEVEL === rarityData.SHOP_LEVELS.length, "MAX_SHOP_LEVEL should match SHOP_LEVELS length");

check(Array.isArray(economyData.BATTLE_SPEEDS) && economyData.BATTLE_SPEEDS.includes(1), "Battle speeds should include 1x");
check(Array.isArray(economyData.TIER_SCALING) && economyData.TIER_SCALING.length >= 5, "Tier scaling should include tiers 1-4");

const revealShots = presentationData.LEVEL10_REVEAL_CUTSCENE_SHOTS || [];
check(revealShots.length > 0, "Level 10 reveal cutscene should have shots");
const revealDuration = revealShots.reduce((sum, shot) => sum + (shot.duration || 0), 0);
check(
  Math.abs(revealDuration - presentationData.LEVEL10_REVEAL_CUTSCENE_SECONDS) < 0.001,
  "Level 10 reveal shot durations should match total duration",
);

const assetStrings = collectAssetStrings({
  itemData,
  unitData,
  traitData,
  presentationData,
  statusData,
});
for (const relPath of assetStrings) {
  check(fs.existsSync(path.join(repoRoot, relPath)), `Exported asset path does not exist: ${relPath}`);
}

if (errors.length) {
  console.error(`Data integrity check failed: ${errors.length} issue(s).`);
  for (const error of errors.slice(0, 80)) console.error(`- ${error}`);
  if (errors.length > 80) console.error(`...${errors.length - 80} more`);
  process.exit(1);
}

console.log(
  `Data integrity check passed: ${unitIds.size} units, ${itemIds.size} items, ${traitIds.size} traits, ${assetStrings.size} exported asset paths.`,
);
