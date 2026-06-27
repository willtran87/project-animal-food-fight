import fs from "node:fs";
import path from "node:path";
import { assertNear, baseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

const outputDir = path.join(repoRoot, "output", "game-routes-highres-check");

const cases = [
  {
    label: "root-start-menu-high-2560x1600",
    path: "/",
    viewport: { width: 2560, height: 1600 },
    selector: ".start-menu",
    kind: "startMenu",
  },
  {
    label: "start-menu-desktop-1366x768",
    path: "/local-test-pages/start-menu.html",
    viewport: { width: 1366, height: 768 },
    selector: ".start-menu",
    kind: "startMenu",
  },
  {
    label: "opening-vn-high-2560x1600",
    path: "/local-test-pages/opening-vn.html",
    viewport: { width: 2560, height: 1600 },
    selector: ".vn-stage",
    kind: "openingVn",
  },
  {
    label: "opening-vn-desktop-1366x768",
    path: "/local-test-pages/opening-vn.html",
    viewport: { width: 1366, height: 768 },
    selector: ".vn-stage",
    kind: "openingVn",
  },
  {
    label: "game-prep-high-2560x1600",
    path: "/local-test-pages/game.html?smoke=basic",
    viewport: { width: 2560, height: 1600 },
    selector: "#game",
    kind: "game",
    expectedPhase: "prep",
    expectedCopyTheme: "cozy",
    expectedTraitLabels: { breakfast: "Breakfast", bakery: "Bakery" },
  },
  {
    label: "game-prep-desktop-1366x768",
    path: "/local-test-pages/game.html?smoke=basic",
    viewport: { width: 1366, height: 768 },
    selector: "#game",
    kind: "game",
    expectedPhase: "prep",
    expectedCopyTheme: "cozy",
    expectedTraitLabels: { breakfast: "Breakfast", bakery: "Bakery" },
  },
  {
    label: "level-10-battle-high-2560x1600",
    path: "/local-test-pages/game.html?screen=level-10&start=battle",
    viewport: { width: 2560, height: 1600 },
    selector: "#game",
    kind: "game",
    expectedPhase: "battle",
    expectedCopyTheme: "cozy",
    expectedTraitLabels: { breakfast: "Breakfast", bakery: "Bakery" },
  },
  {
    label: "final-fight-high-2560x1600",
    path: "/local-test-pages/game.html?screen=final-fight&start=battle",
    viewport: { width: 2560, height: 1600 },
    selector: "#game",
    kind: "game",
    expectedPhase: "battle",
    expectedCopyTheme: "horror",
    expectedArenaName: "Solar Ration Patio",
    expectedTraitLabels: { breakfast: "Dawn", bakery: "Foundry" },
  },
  {
    label: "final-fight-story-high-2560x1600",
    path: "/local-test-pages/game.html?screen=final-fight",
    viewport: { width: 2560, height: 1600 },
    selector: "#game",
    kind: "game",
    expectedPhase: "prep",
    expectedCopyTheme: "horror",
    expectedArenaName: "Solar Ration Patio",
    expectedTraitLabels: { breakfast: "Dawn", bakery: "Foundry" },
    expectedStoryId: "level20PreFinal",
  },
];

function routeUrl(routePath) {
  const url = new URL(routePath, `${baseUrl}/`);
  url.searchParams.set("route-check", String(Date.now()));
  return url.href;
}

async function waitForApp(page, kind) {
  await page.waitForFunction(
    (expectedKind) => {
      if (document.documentElement.dataset.scriptEntryError === "true") return true;
      if (expectedKind === "game") {
        return typeof window.render_game_to_text === "function" && document.querySelector("#game");
      }
      if (expectedKind === "openingVn") {
        return typeof window.render_game_to_text === "function" && document.querySelector(".vn-stage");
      }
      return typeof window.render_game_to_text === "function" && document.querySelector(".start-menu");
    },
    kind,
    { timeout: 12000 },
  );
}

async function collectMetrics(page, testCase, consoleErrors, badResponses) {
  return page.evaluate((selector) => {
    const rectFor = (targetSelector) => {
      const el = document.querySelector(targetSelector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return {
        x: Math.round(r.x),
        y: Math.round(r.y),
        width: Math.round(r.width),
        height: Math.round(r.height),
        top: Math.round(r.top),
        bottom: Math.round(r.bottom),
        left: Math.round(r.left),
        right: Math.round(r.right),
      };
    };
    let textState = null;
    let textStateError = null;
    try {
      textState = JSON.parse(window.render_game_to_text?.() || "null");
    } catch (err) {
      textStateError = err.message;
    }
    return {
      href: location.href,
      viewport: { width: innerWidth, height: innerHeight },
      scriptEntry: document.documentElement.dataset.scriptEntry || null,
      scriptEntryReady: document.documentElement.dataset.scriptEntryReady || null,
      scriptEntryError: document.documentElement.dataset.scriptEntryError || null,
      pageScroll: {
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
        scrollHeight: document.documentElement.scrollHeight,
        clientHeight: document.documentElement.clientHeight,
      },
      target: rectFor(selector),
      gameShell: rectFor("#game-shell"),
      canvas: rectFor("#game"),
      startMenu: rectFor(".start-menu"),
      openingStage: rectFor(".vn-stage"),
      itemData: window.FoodAnimalsItemData
        ? {
            itemCount: window.FoodAnimalsItemData.ITEMS?.length || 0,
            sunnySprite: window.FoodAnimalsItemData.ITEM_SPRITES?.sunny_side_egg || null,
            horrorSunnySprite: window.FoodAnimalsItemData.REALITY_ITEM_SPRITES?.sunny_side_egg || null,
            attackParticleCount: window.FoodAnimalsItemData.ATTACK_PARTICLE_TYPES?.length || 0,
            drinkThrowableCount: window.FoodAnimalsItemData.DRINK_THROWABLE_TYPES?.length || 0,
            maxItemTier: window.FoodAnimalsItemData.MAX_ITEM_TIER || null,
          }
        : null,
      unitData: window.FoodAnimalsUnitData
        ? {
            unitCount: window.FoodAnimalsUnitData.CATALOG?.length || 0,
            toastSprite: window.FoodAnimalsUnitData.RUNTIME_SPRITES?.toast_tortoise?.[1] || null,
            horrorToastSprite: window.FoodAnimalsUnitData.REALITY_RUNTIME_SPRITES?.toast_tortoise?.[1] || null,
            cozyDefeatStill: window.FoodAnimalsUnitData.DEFEAT_STILL_SPRITES?.toast_tortoise || null,
            finalBossDefeatStill: window.FoodAnimalsUnitData.REALITY_DEFEAT_STILL_SPRITES?.cyber_brain_final_boss || null,
          }
        : null,
      statusEffectData: window.FoodAnimalsStatusEffectData
        ? {
            styleCount: Object.keys(window.FoodAnimalsStatusEffectData.STATUS_EFFECT_STYLES || {}).length,
            burnStyleKind: window.FoodAnimalsStatusEffectData.STATUS_EFFECT_STYLES?.burn?.kind || null,
            radiationSprite: window.FoodAnimalsStatusEffectData.STATUS_EFFECT_SPRITES?.radiation || null,
            horrorRadiationSprite: window.FoodAnimalsStatusEffectData.HORROR_STATUS_EFFECT_SPRITES?.radiation || null,
          }
        : null,
      economyEnemyData: window.FoodAnimalsEconomyEnemyData
        ? {
            startingGold: window.FoodAnimalsEconomyEnemyData.ECONOMY?.startingGold || null,
            itemCost: window.FoodAnimalsEconomyEnemyData.ECONOMY?.itemCost || null,
            unitCost: window.FoodAnimalsEconomyEnemyData.ECONOMY?.unitCost || null,
            enemyArchetypeCount: window.FoodAnimalsEconomyEnemyData.ENEMY_ARCHETYPES?.length || 0,
            bossHpMultiplier: window.FoodAnimalsEconomyEnemyData.FINAL_BOSS_SHOP_POWER_HP_MULTIPLIER || null,
            tier4HpScale: window.FoodAnimalsEconomyEnemyData.TIER_SCALING?.[4]?.hp || null,
            battleSpeedCount: window.FoodAnimalsEconomyEnemyData.BATTLE_SPEEDS?.length || 0,
          }
        : null,
      rarityShopData: window.FoodAnimalsRarityShopData
        ? {
            rarityCount: Object.keys(window.FoodAnimalsRarityShopData.RARITIES || {}).length,
            commonShopWeight: window.FoodAnimalsRarityShopData.RARITIES?.common?.shopWeight || null,
            horrorEpicGlow: window.FoodAnimalsRarityShopData.HORROR_RARITIES?.epic?.glow || null,
            shopLevelCount: window.FoodAnimalsRarityShopData.SHOP_LEVELS?.length || 0,
            maxShopLevel: window.FoodAnimalsRarityShopData.MAX_SHOP_LEVEL || null,
            level6EpicWeight: window.FoodAnimalsRarityShopData.SHOP_LEVELS?.[5]?.rarityWeights?.epic || null,
          }
        : null,
      presentationData: window.FoodAnimalsPresentationData
        ? {
            musicThemeCount: Object.keys(window.FoodAnimalsPresentationData.GAME_MUSIC_TRACKS || {}).length,
            sfxCount: window.FoodAnimalsPresentationData.GAME_SFX_IDS?.length || 0,
            revealShotCount: window.FoodAnimalsPresentationData.LEVEL10_REVEAL_CUTSCENE_SHOTS?.length || 0,
            battleFieldWidth: window.FoodAnimalsPresentationData.BATTLE_FIELD?.w || null,
            iconCount: Object.keys(window.FoodAnimalsPresentationData.UI_ICON_ATLAS || {}).length,
            victoryLineCount: window.FoodAnimalsPresentationData.VICTORY_CRAWL_LINES?.length || 0,
          }
        : null,
      textState,
      textStateError,
    };
  }, testCase.selector).then((metrics) => ({
    ...metrics,
    consoleErrors: [...consoleErrors],
    badResponses: [...badResponses],
  }));
}

function assertRoute(label, testCase, metrics) {
  if (metrics.scriptEntryError === "true") throw new Error(`${label}: script loader reported an error`);
  if (metrics.scriptEntryReady !== "true") throw new Error(`${label}: script loader did not report ready`);
  if (!metrics.target) throw new Error(`${label}: missing target selector ${testCase.selector}`);
  if (metrics.pageScroll.scrollWidth > metrics.pageScroll.clientWidth + 1) {
    throw new Error(`${label}: page has horizontal overflow`);
  }
  if (metrics.consoleErrors.length) {
    throw new Error(`${label}: console errors: ${metrics.consoleErrors.join(" | ")}`);
  }
  if (metrics.badResponses.length) {
    throw new Error(`${label}: bad responses: ${metrics.badResponses.join(" | ")}`);
  }
  if (metrics.textStateError) throw new Error(`${label}: render_game_to_text did not parse: ${metrics.textStateError}`);
  if (!metrics.textState || typeof metrics.textState !== "object") {
    throw new Error(`${label}: missing render_game_to_text payload`);
  }
  if (testCase.kind === "game") {
    if (!metrics.canvas) throw new Error(`${label}: missing game canvas`);
    if (!metrics.itemData) throw new Error(`${label}: missing FoodAnimalsItemData module`);
    if (metrics.itemData.itemCount < 80) {
      throw new Error(`${label}: expected item catalog to include at least 80 items, got ${metrics.itemData.itemCount}`);
    }
    if (metrics.itemData.maxItemTier !== 3) {
      throw new Error(`${label}: expected max item tier 3, got ${metrics.itemData.maxItemTier || "none"}`);
    }
    if (!metrics.itemData.sunnySprite || !metrics.itemData.horrorSunnySprite) {
      throw new Error(`${label}: missing cozy/horror item sprite data for sunny_side_egg`);
    }
    if (metrics.itemData.attackParticleCount < 40 || metrics.itemData.drinkThrowableCount < 20) {
      throw new Error(
        `${label}: particle maps look incomplete (${metrics.itemData.attackParticleCount} attacks, ${metrics.itemData.drinkThrowableCount} drinks)`,
      );
    }
    if (!metrics.unitData) throw new Error(`${label}: missing FoodAnimalsUnitData module`);
    if (metrics.unitData.unitCount < 40) {
      throw new Error(`${label}: expected unit catalog to include at least 40 units, got ${metrics.unitData.unitCount}`);
    }
    if (!metrics.unitData.toastSprite || !metrics.unitData.horrorToastSprite) {
      throw new Error(`${label}: missing cozy/horror unit sprite data for toast_tortoise`);
    }
    if (!metrics.unitData.cozyDefeatStill || !metrics.unitData.finalBossDefeatStill) {
      throw new Error(`${label}: missing cozy/final boss defeat still data`);
    }
    if (!metrics.statusEffectData) throw new Error(`${label}: missing FoodAnimalsStatusEffectData module`);
    if (metrics.statusEffectData.styleCount < 10) {
      throw new Error(`${label}: expected at least 10 status effect styles, got ${metrics.statusEffectData.styleCount}`);
    }
    if (metrics.statusEffectData.burnStyleKind !== "flame") {
      throw new Error(`${label}: expected burn status style kind flame, got ${metrics.statusEffectData.burnStyleKind || "none"}`);
    }
    if (!metrics.statusEffectData.radiationSprite || !metrics.statusEffectData.horrorRadiationSprite) {
      throw new Error(`${label}: missing cozy/horror radiation status sprites`);
    }
    if (!metrics.economyEnemyData) throw new Error(`${label}: missing FoodAnimalsEconomyEnemyData module`);
    if (metrics.economyEnemyData.startingGold !== 105 || metrics.economyEnemyData.itemCost !== 18 || metrics.economyEnemyData.unitCost !== 30) {
      throw new Error(
        `${label}: economy tuning mismatch (gold ${metrics.economyEnemyData.startingGold}, item ${metrics.economyEnemyData.itemCost}, unit ${metrics.economyEnemyData.unitCost})`,
      );
    }
    if (metrics.economyEnemyData.enemyArchetypeCount < 3) {
      throw new Error(`${label}: expected enemy archetype tuning data, got ${metrics.economyEnemyData.enemyArchetypeCount}`);
    }
    if (metrics.economyEnemyData.bossHpMultiplier !== 1.04 || metrics.economyEnemyData.tier4HpScale !== 9.2) {
      throw new Error(`${label}: boss/tier scaling tuning mismatch`);
    }
    if (metrics.economyEnemyData.battleSpeedCount < 4) {
      throw new Error(`${label}: expected battle speed tuning data`);
    }
    if (!metrics.rarityShopData) throw new Error(`${label}: missing FoodAnimalsRarityShopData module`);
    if (metrics.rarityShopData.rarityCount !== 4 || metrics.rarityShopData.commonShopWeight !== 100) {
      throw new Error(
        `${label}: rarity tuning mismatch (${metrics.rarityShopData.rarityCount} rarities, common weight ${metrics.rarityShopData.commonShopWeight})`,
      );
    }
    if (!metrics.rarityShopData.horrorEpicGlow) {
      throw new Error(`${label}: missing horror rarity glow data`);
    }
    if (metrics.rarityShopData.shopLevelCount !== 6 || metrics.rarityShopData.maxShopLevel !== 6) {
      throw new Error(
        `${label}: shop level tuning mismatch (${metrics.rarityShopData.shopLevelCount} levels, max ${metrics.rarityShopData.maxShopLevel})`,
      );
    }
    if (metrics.rarityShopData.level6EpicWeight !== 20) {
      throw new Error(`${label}: expected level 6 epic rarity weight 20, got ${metrics.rarityShopData.level6EpicWeight || "none"}`);
    }
    if (!metrics.presentationData) throw new Error(`${label}: missing FoodAnimalsPresentationData module`);
    if (metrics.presentationData.musicThemeCount !== 2 || metrics.presentationData.sfxCount < 20) {
      throw new Error(
        `${label}: presentation audio data mismatch (${metrics.presentationData.musicThemeCount} themes, ${metrics.presentationData.sfxCount} SFX ids)`,
      );
    }
    if (metrics.presentationData.revealShotCount !== 6 || metrics.presentationData.victoryLineCount < 8) {
      throw new Error(
        `${label}: presentation story data mismatch (${metrics.presentationData.revealShotCount} reveal shots, ${metrics.presentationData.victoryLineCount} victory lines)`,
      );
    }
    if (metrics.presentationData.battleFieldWidth !== 984 || metrics.presentationData.iconCount < 25) {
      throw new Error(
        `${label}: presentation layout/icon data mismatch (${metrics.presentationData.battleFieldWidth} field width, ${metrics.presentationData.iconCount} icons)`,
      );
    }
    if (testCase.expectedPhase && metrics.textState.phase !== testCase.expectedPhase) {
      throw new Error(`${label}: expected phase ${testCase.expectedPhase}, got ${metrics.textState.phase}`);
    }
    if (testCase.expectedStoryId && metrics.textState.story?.id !== testCase.expectedStoryId) {
      throw new Error(`${label}: expected story ${testCase.expectedStoryId}, got ${metrics.textState.story?.id || "none"}`);
    }
    if (testCase.expectedCopyTheme && metrics.textState.reality?.copyTheme !== testCase.expectedCopyTheme) {
      throw new Error(`${label}: expected copy theme ${testCase.expectedCopyTheme}, got ${metrics.textState.reality?.copyTheme || "none"}`);
    }
    if (testCase.expectedArenaName && metrics.textState.arena?.name !== testCase.expectedArenaName) {
      throw new Error(`${label}: expected arena ${testCase.expectedArenaName}, got ${metrics.textState.arena?.name || "none"}`);
    }
    for (const [traitId, expectedLabel] of Object.entries(testCase.expectedTraitLabels || {})) {
      const actualLabel = metrics.textState.traits?.[traitId]?.label;
      if (actualLabel !== expectedLabel) {
        throw new Error(`${label}: expected trait ${traitId} label ${expectedLabel}, got ${actualLabel || "none"}`);
      }
    }
    if (testCase.viewport.width >= 1600) {
      assertNear(metrics.canvas.width, 1606, 8, `${label}: high-res canvas width including border`);
      assertNear(metrics.canvas.height, 1006, 8, `${label}: high-res canvas height including border`);
    }
  }
  if (testCase.kind === "startMenu" && testCase.viewport.width >= 1600) {
    assertNear(metrics.startMenu.width, 1600, 4, `${label}: high-res start menu width`);
    assertNear(metrics.startMenu.height, 1000, 4, `${label}: high-res start menu height`);
  }
  if (testCase.kind === "openingVn" && testCase.viewport.width >= 1600) {
    assertNear(metrics.openingStage.width, 1600, 4, `${label}: high-res opening stage width`);
    assertNear(metrics.openingStage.height, 1000, 4, `${label}: high-res opening stage height`);
  }
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const server = await ensureServer("/");
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const results = {};
  const failures = [];
  const consoleErrors = [];
  const badResponses = [];

  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
  page.on("pageerror", (error) => consoleErrors.push(error.message));
  page.on("response", (response) => {
    const status = response.status();
    if (status >= 400) badResponses.push(`${status} ${response.url()}`);
  });

  try {
    for (const testCase of cases) {
      consoleErrors.length = 0;
      badResponses.length = 0;
      await page.setViewportSize(testCase.viewport);
      await page.goto(routeUrl(testCase.path), { waitUntil: "load" });
      await waitForApp(page, testCase.kind);
      await page.waitForTimeout(450);
      const metrics = await collectMetrics(page, testCase, consoleErrors, badResponses);
      results[testCase.label] = metrics;
      await page.screenshot({ path: path.join(outputDir, `${testCase.label}.png`), fullPage: false });
      try {
        assertRoute(testCase.label, testCase, metrics);
      } catch (err) {
        failures.push(err.message);
      }
    }
  } finally {
    await browser.close();
    if (server) server.kill();
  }

  fs.writeFileSync(path.join(outputDir, "metrics.json"), JSON.stringify(results, null, 2));
  if (failures.length) {
    console.error(`High-res route check failed:\n- ${failures.join("\n- ")}`);
    console.error(`Artifacts: ${outputDir}`);
    process.exit(1);
  }
  console.log(`High-res route check passed. Artifacts: ${outputDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
