import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createBrowserLikeContext, loadBrowserScripts } from "./browser_script_loader.mjs";
import { baseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

const storageKey = "harvest-friends:active-run:v1";
const failures = [];
async function check(name, run) {
  try {
    await run();
    console.log(`PASS: ${name}`);
  } catch (error) {
    failures.push(name);
    console.error(`FAIL: ${name}: ${error.stack || error.message}`);
  }
}

await check("storage recovers after quota errors and permits read/delete", () => {
  const records = new Map();
  let denyWrites = false;
  const localStorage = {
    getItem: (key) => records.get(key) || null,
    removeItem: (key) => records.delete(key),
    setItem(key, value) {
      if (denyWrites) throw new Error("QuotaExceededError");
      records.set(key, value);
    },
  };
  const load = () => loadBrowserScripts(repoRoot, ["src/run-storage.js"], createBrowserLikeContext({ localStorage })).FoodAnimalsRunStorage;
  const storage = load();
  assert.equal(storage.write({ round: 4 }), true);
  denyWrites = true;
  assert.equal(storage.write({ round: 5 }), false);
  assert.equal(storage.read()?.round, 4, "a write failure must not hide an existing save");
  const freshRuntime = load();
  assert.equal(freshRuntime.canUseLocalStorage(), false);
  assert.equal(freshRuntime.read()?.round, 4, "reading must work even when a write probe fails");
  assert.equal(freshRuntime.clear(), true, "deleting must not require spare storage quota");
  denyWrites = false;
  assert.equal(freshRuntime.canUseLocalStorage(), true, "an initial failed probe must be retried");
  assert.equal(storage.write({ round: 6 }), true, "saving must retry after quota recovers");
  assert.equal(storage.read()?.round, 6);
});

const server = await ensureServer();
const browser = await loadPlaywright().chromium.launch({ headless: true });
const browserErrors = [];

async function openGame({ record = null, mobile = false, route = "", viewport = null, manualTime = true } = {}) {
  const context = await browser.newContext(mobile
    ? { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 3 }
    : { viewport: viewport || { width: 1366, height: 768 } });
  // Save probes use deterministic time; fullscreen probes retain native resize frames.
  await context.addInitScript(({ record, storageKey, manualTime }) => {
    if (manualTime) window.requestAnimationFrame = () => 0;
    window.__recoveryAudioStarted = [];
    const play = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function (...args) {
      const playing = play.apply(this, args);
      playing.then(() => window.__recoveryAudioStarted.push(this.src), () => {});
      return playing;
    };
    if (record) localStorage.setItem(storageKey, JSON.stringify(record));
  }, { record, storageKey, manualTime });
  const page = await context.newPage();
  page.on("pageerror", (error) => browserErrors.push(error.message));
  await page.goto(`${baseUrl}/local-test-pages/game.html${route || (record ? "?continue=1" : "")}`);
  await page.waitForFunction(() => Boolean(window.__foodAnimals), {}, { polling: 100 });
  return { page, context };
}

try {
  await check("unit merges preserve equipment or wait for sufficient compatible storage", async () => {
    for (const direct of [true, false]) {
      const { page, context } = await openGame();
      try {
        const result = await page.evaluate((direct) => {
          const g = window.__foodAnimals, s = g.state;
          const items = Object.values(window.FoodAnimalsItemData.ITEMS);
          const tops = items.filter((item) => item.type !== "drink" && !item.mergeProgressBonus);
          const drinks = items.filter((item) => item.type === "drink");
          s.board.fill(null);
          s.bench = s.bench.map((_, i) => g.makeItem(tops[i].id));
          s.itemBench = s.itemBench.map((_, i) => g.makeItem((i < 4 ? drinks[i] : tops[i + 8]).id));
          for (let i = 0; i < (direct ? 2 : 3); i++) {
            s.board[i] = g.makeUnit("taco_tiger");
            s.board[i].item = g.makeItem(tops[20 + i].id);
          }
          s.shop[0] = g.makeUnit("taco_tiger");
          s.gold = 300;
          const equipment = s.board.filter(Boolean).map((unit) => unit.item.uid);
          const before = JSON.stringify([s.board, s.bench, s.itemBench, s.shop, s.gold]);
          const started = direct ? g.buyShopToSlot(0, "board", 0) : g.mergeTriples("taco_tiger", 1);
          window.advanceTime(4000);
          const unchanged = before === JSON.stringify([s.board, s.bench, s.itemBench, s.shop, s.gold]);
          // Empty drink-only storage cannot hold displaced toppings.
          s.selected = { area: "itemBench", index: 0 };
          g.sellSelectedItem();
          const rejectedWrongRail = direct ? !g.buyShopToSlot(0, "board", 0) : !s.mergeCutscene;
          let saleIncome = 0;
          for (let i = 0; i < (direct ? 1 : 2); i++) {
            saleIncome += g.itemSellValue(s.bench[i]);
            s.selected = { area: "bench", index: i };
            g.sellSelectedItem();
          }
          const retryStarted = direct ? g.buyShopToSlot(0, "board", 0) : Boolean(s.mergeCutscene);
          window.advanceTime(5000);
          const stored = [...s.bench, ...s.itemBench, ...s.board.map((unit) => unit?.item)].filter(Boolean);
          return { started, unchanged, rejectedWrongRail, retryStarted,
            tier: s.board[0]?.tier, retained: equipment.map((uid) => stored.filter((item) => item.uid === uid).length),
            shopConsumed: !s.shop[0], saleIncome };
        }, direct);
        assert.equal(result.started, false, "full storage must reject before starting or charging for a merge");
        assert.equal(result.unchanged, true, "blocked merges must preserve all inventory and gold");
        assert.equal(result.rejectedWrongRail, true);
        assert.equal(result.retryStarted, true, "freeing enough storage must permit the merge without reloading");
        assert.equal(result.tier, 2);
        assert.deepEqual(result.retained, direct ? [1, 1] : [1, 1, 1]);
        assert.equal(result.shopConsumed, direct);
      } finally { await context.close(); }
    }
  });

  await check("merge storage handles freed bench slots, consumables, and stale queued capacity", async () => {
    for (const scenario of ["direct-freed", "auto-freed", "consumable", "queued-full"]) {
      const { page, context } = await openGame();
      try {
        const result = await page.evaluate((scenario) => {
          const g = window.__foodAnimals, s = g.state;
          const items = Object.values(window.FoodAnimalsItemData.ITEMS);
          const tops = items.filter((item) => item.type !== "drink" && !item.mergeProgressBonus);
          const drinks = items.filter((item) => item.type === "drink");
          s.board.fill(null);
          s.bench = s.bench.map((_, i) => g.makeItem(tops[i].id));
          s.itemBench = s.itemBench.map((_, i) => g.makeItem((i < 4 ? drinks[i] : tops[i + 8]).id));
          const count = scenario === "auto-freed" ? 3 : 2;
          const units = Array.from({ length: count }, (_, i) => {
            const unit = g.makeUnit("taco_tiger");
            unit.item = g.makeItem(tops[20 + i].id);
            return unit;
          });
          let keeper;
          if (scenario === "auto-freed") {
            units.forEach((unit, i) => { s.bench[i] = unit; });
            keeper = "bench";
          } else if (scenario === "consumable") {
            units[0].item = g.makeItem(items.find((item) => item.mergeProgressBonus).id);
            s.bench[0] = units[0]; s.bench[1] = units[1];
            keeper = "bench";
          } else {
            s.board[0] = units[0];
            s[scenario === "direct-freed" ? "bench" : "board"][1] = units[1];
            keeper = "board";
          }
          const equipment = units.filter((unit) => !unit.item.mergeProgressBonus).map((unit) => unit.item.uid);
          s.shop[0] = g.makeUnit("taco_tiger"); s.gold = 300;
          s.shopSales[0] = null;
          if (scenario === "queued-full") {
            s.bench[0] = null;
            s.activeStory = { id: "queued-merge-test", index: 0, beats: [{ speaker: "You", text: "Wait." }] };
          }
          const direct = scenario.startsWith("direct") || scenario === "queued-full";
          const started = direct ? g.buyShopToSlot(0, "board", 0) : g.mergeTriples("taco_tiger", 1);
          if (scenario === "queued-full") {
            s.bench[0] = g.makeItem(tops[0].id);
            g.advanceStoryConversation(true);
          }
          window.advanceTime(5000);
          const ownedItems = [...s.bench, ...s.itemBench, ...s.board.map((unit) => unit?.item),
            ...s.bench.map((unit) => unit?.item)].filter(Boolean);
          return { started, tier: s[keeper][0]?.tier, gold: s.gold, cutscene: Boolean(s.mergeCutscene),
            retained: equipment.map((uid) => ownedItems.filter((item) => item.uid === uid).length),
            consumedItemRetained: ownedItems.some((item) => item.mergeProgressBonus),
            shopPresent: Boolean(s.shop[0]) };
        }, scenario);
        assert.equal(result.started, true, scenario);
        assert.equal(result.tier, scenario === "queued-full" ? 1 : 2, scenario);
        assert.equal(result.cutscene, false);
        assert.ok(result.retained.every((count) => count === 1), `${scenario}: equipment must exist exactly once`);
        assert.equal(result.gold, scenario === "queued-full" ? 300 : scenario === "direct-freed" ? 278 : 308);
        assert.equal(result.shopPresent, scenario !== "direct-freed");
        if (scenario === "consumable") assert.equal(result.consumedItemRetained, false);
      } finally { await context.close(); }
    }
  });

  await check("earned permanent HP survives both merge paths, equipment refresh, battle, and reload", async () => {
    for (const direct of [true, false]) {
      const original = await openGame();
      let fixture;
      try {
        fixture = await original.page.evaluate(({ direct, key }) => {
          const g = window.__foodAnimals, s = g.state;
          s.runMode = "infinite";
          s.board.fill(null); s.bench.fill(null); s.itemBench.fill(null);
          for (let i = 0; i < 2; i++) s.board[i] = g.makeUnit("mochi_mammoth");
          const hpItem = Object.values(window.FoodAnimalsItemData.ITEMS).find((item) => item.maxHpBonusPct);
          s.bench[0] = g.makeItem(hpItem.id);
          g.attachItemFromBench(0, "board", 0);
          g.startBattle(); s.phaseTransition = null;
          s.battle.enemies.forEach((unit) => { unit.hp = 0; unit.dead = true; });
          window.advanceTime(3000);
          const earned = s.board.slice(0, 2).map((unit) => unit.permanentHpBonus);
          g.continuePrep();
          if (s.activeStory) g.advanceStoryConversation(true);
          window.advanceTime(5000);
          s.selected = { area: "board", index: 0 };
          g.detachSelectedItem();
          s.bench[0] = g.makeItem(hpItem.id);
          g.attachItemFromBench(0, "board", 0);
          const equipped = { hp: s.board[0].maxHp, expected: Math.round((g.makeUnit("mochi_mammoth").maxHp + earned[0]) * (1 + s.board[0].item.maxHpBonusPct)) };
          s.gold = 300;
          if (direct) { s.shop[0] = g.makeUnit("mochi_mammoth"); g.buyShopToSlot(0, "board", 0); }
          else { s.board[2] = g.makeUnit("mochi_mammoth"); g.resolveMerges(); }
          window.advanceTime(5000);
          const merged = structuredClone(s.board[0]);
          g.saveCurrentRun({ silent: true });
          return { earned, equipped, merged, base: g.makeUnit("mochi_mammoth", 2).maxHp,
            record: JSON.parse(localStorage.getItem(key)) };
        }, { direct, key: storageKey });
      } finally { await original.context.close(); }
      assert.deepEqual(fixture.earned, [9, 9], "fixture must earn growth through real combat");
      assert.equal(fixture.equipped.hp, fixture.equipped.expected, "equipping must not remove permanent growth");
      assert.equal(fixture.merged.tier, 2);
      assert.equal(fixture.merged.permanentHpBonus, 18, "all consumed units contribute their earned growth");
      const expectedHp = Math.round((fixture.base + 18) * (1 + fixture.merged.item.maxHpBonusPct));
      assert.equal(fixture.merged.maxHp, expectedHp);
      const restored = await openGame({ record: fixture.record });
      try {
        const result = await restored.page.evaluate(() => {
          const g = window.__foodAnimals, s = g.state;
          const restoredHp = s.board[0].maxHp;
          s.selected = { area: "board", index: 0 };
          g.detachSelectedItem();
          const nakedHp = s.board[0].maxHp;
          g.startBattle();
          return { restoredHp, nakedHp, battleBase: s.battle.allies[0].baseMaxHp, bonus: s.battle.allies[0].permanentHpBonus };
        });
        assert.deepEqual(result, { restoredHp: expectedHp, nakedHp: fixture.base + 18, battleBase: fixture.base + 18, bonus: 18 });
      } finally { await restored.context.close(); }
    }
  });

  await check("burn defeats stop periodic effects without removing lingering damage", async () => {
    for (const speed of [0, 1, 2, 3]) {
      const { page, context } = await openGame();
      try {
        const result = await page.evaluate((speed) => {
          const game = window.__foodAnimals;
          game.state.board.fill(null);
          game.state.board[0] = game.makeUnit("taco_tiger", 1);
          game.state.board[0].item = game.makeItem("popcorn_kernel", 1);
          game.startBattle();
          game.state.phaseTransition = null;
          game.state.battleSpeedIndex = speed;
          const battle = game.state.battle;
          battle.enemies = battle.enemies.slice(0, 1);
          const ally = battle.allies[0], enemy = battle.enemies[0];
          for (const unit of [ally, enemy]) { unit.hp = 1; unit.shield = 0; unit.cooldown = 100; }
          ally.burn = { remaining: 5, tick: 0, damage: 2, source: enemy };
          ally.periodicItemTick = 0;
          window.advanceTime(20);
          const afterTick = { allyDead: ally.dead, enemyDead: enemy.dead, result: battle.outcomePresentation?.result };
          window.advanceTime(3000);
          return { afterTick, finalResult: battle.result, hearts: game.state.hearts };
        }, speed);
        assert.deepEqual(result, { afterTick: { allyDead: true, enemyDead: false, result: "loss" }, finalResult: "loss", hearts: 9 });
      } finally { await context.close(); }
    }
    const { page, context } = await openGame();
    try {
      const result = await page.evaluate(() => {
        const game = window.__foodAnimals;
        game.state.board[0] = game.makeUnit("taco_tiger", 1);
        game.state.board[0].item = game.makeItem("popcorn_kernel", 1);
        game.startBattle();
        game.state.phaseTransition = null;
        const battle = game.state.battle;
        battle.enemies = battle.enemies.slice(0, 1);
        const ally = battle.allies[0], enemy = battle.enemies[0];
        for (const unit of [ally, enemy]) { unit.hp = 100; unit.shield = 0; unit.cooldown = 100; }
        const defeatedSource = { ...enemy, uid: 999999, dead: true };
        ally.burn = { remaining: 5, tick: 0, damage: 2, source: defeatedSource };
        ally.periodicItemTick = 0;
        window.advanceTime(20);
        return { allyHp: ally.hp, enemyHp: enemy.hp, allyDead: ally.dead };
      });
      assert.equal(result.allyHp, 98, "existing burns must persist after their source dies");
      assert.equal(result.allyDead, false);
      assert.ok(result.enemyHp < 100, "living units must still fire periodic items");
    } finally { await context.close(); }
  });

  await check("the final ending survives interruption until its menu return", async () => {
    const original = await openGame();
    let record;
    try {
      record = await original.page.evaluate((key) => {
        const game = window.__foodAnimals;
        game.state.round = 20;
        game.state.realityBroken = true;
        game.state.realityOverride = true;
        game.state.enemyPreview = null;
        game.state.board[0] = game.makeUnit("taco_tiger", 1);
        game.startBattle();
        game.state.phaseTransition = null;
        game.state.battle.enemies.forEach((unit) => { unit.hp = 0; unit.dead = true; });
        window.advanceTime(500);
        return JSON.parse(localStorage.getItem(key));
      }, storageKey);
      assert.equal(record?.snapshot.state.endingPending, true, "winning must checkpoint the pending ending immediately");
      assert.ok(record.snapshot.state.finalTabsStoryTransition, "the handoff before dialogue must be resumable");
    } finally { await original.context.close(); }

    const checkpoints = ["handoff", "dialogue", "epilogueTransition", "epilogue"];
    for (const checkpoint of checkpoints) {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
      await context.addInitScript(({ record, key }) => {
        if (!sessionStorage.getItem("ending-fixture-seeded")) {
          localStorage.setItem(key, JSON.stringify(record));
          sessionStorage.setItem("ending-fixture-seeded", "1");
        }
        if (location.pathname.endsWith("game.html")) window.requestAnimationFrame = () => 0;
      }, { record, key: storageKey });
      const page = await context.newPage();
      page.on("pageerror", (error) => browserErrors.push(error.message));
      try {
        await page.goto(`${baseUrl}/`);
        await page.waitForFunction(() => window.render_game_to_text);
        assert.equal(await page.evaluate(() => JSON.parse(window.render_game_to_text()).activeRun.available), true, `${checkpoint} must appear in Continue`);
        await page.locator('[data-action="continue"]').click();
        const frame = page.frameLocator(".campaign-frame");
        await frame.locator("#game").waitFor({ state: "visible" });
        const canvas = frame.locator("#game");
        await canvas.evaluate(() => {
          if (!window.__foodAnimals) throw new Error("game did not initialize");
        });
        const before = await canvas.evaluate(() => {
          const state = window.__foodAnimals.state;
          return { gold: state.gold, endingPending: state.endingPending, concluded: state.runConcluded, rngCalls: state.rngCalls };
        });
        assert.equal(before.endingPending, true);
        assert.equal(before.concluded, true);
        assert.equal(before.gold, record.snapshot.state.gold, "resume must not repeat victory income");
        assert.equal(before.rngCalls, record.snapshot.state.rngCalls, "ending recovery must not generate another opponent");
        if (checkpoint === "handoff") {
          await canvas.evaluate(() => window.advanceTime(3000));
          assert.equal(await canvas.evaluate(() => window.__foodAnimals.state.activeStory?.id), "level20FinalTabs");
          await frame.locator('[data-mobile-story-action="advance"]').click();
          assert.equal(await canvas.evaluate(() => window.__foodAnimals.state.activeStory.index), 1);
        } else if (checkpoint === "dialogue") {
          assert.equal(await canvas.evaluate(() => window.__foodAnimals.state.activeStory.index), 1);
          await canvas.evaluate(() => {
            window.__foodAnimals.advanceStoryConversation(true);
            window.advanceTime(500);
          });
          assert.ok(await canvas.evaluate(() => window.__foodAnimals.state.finalVictoryTransition));
        } else if (checkpoint === "epilogueTransition") {
          await canvas.evaluate(() => window.advanceTime(15000));
          assert.equal(await canvas.evaluate(() => window.__foodAnimals.state.phase), "victoryCutscene");
        } else {
          await canvas.evaluate(() => window.advanceTime(120000));
          await page.waitForLoadState("networkidle");
          await canvas.evaluate(() => window.advanceTime(16));
          const outputDir = path.join(repoRoot, "output", "ending-recovery");
          fs.mkdirSync(outputDir, { recursive: true });
          await page.screenshot({ path: path.join(outputDir, "mobile-epilogue.png") });
          await canvas.press("Enter");
          assert.equal(await canvas.evaluate(() => window.__foodAnimals.state.endingPending), false);
          await canvas.evaluate(() => window.advanceTime(5000));
          await page.waitForFunction(() => window.render_game_to_text && JSON.parse(window.render_game_to_text()).campaignShell?.active === false);
          assert.equal(await page.evaluate((key) => localStorage.getItem(key), storageKey), null);
          assert.equal(await page.evaluate(() => JSON.parse(window.render_game_to_text()).activeRun.available), false);
          continue;
        }
        record = await canvas.evaluate((_canvas, key) => {
          window.dispatchEvent(new Event("pagehide"));
          return JSON.parse(localStorage.getItem(key));
        }, storageKey);
        assert.ok(record, `${checkpoint}: unloading must preserve the pending ending`);
        assert.equal(record.snapshot.state.endingPending, true);
        if (checkpoint === "handoff") {
          const outputDir = path.join(repoRoot, "output", "ending-recovery");
          fs.mkdirSync(outputDir, { recursive: true });
          await page.waitForLoadState("networkidle");
          await canvas.evaluate(() => window.advanceTime(16));
          await page.screenshot({ path: path.join(outputDir, "mobile-dialogue.png") });
          const desktop = await openGame({ record, viewport: { width: 2560, height: 1600 } });
          try {
            await desktop.page.waitForLoadState("networkidle");
            await desktop.page.evaluate(() => window.advanceTime(500));
            assert.equal(await desktop.page.evaluate(() => window.__foodAnimals.state.activeStory.index), 1);
            await desktop.page.screenshot({ path: path.join(outputDir, "high-dialogue.png") });
          } finally { await desktop.context.close(); }
        }
      } finally { await context.close(); }
    }
  });

  await check("save and exit preserves the last save on failure and succeeds on retry", async () => {
    const { page, context } = await openGame();
    try {
      await page.evaluate((key) => {
        const game = window.__foodAnimals;
        game.state.gold = 231;
        if (!game.saveCurrentRun()) throw new Error("initial save failed");
        window.__previousExitSave = localStorage.getItem(key);
        const setItem = Storage.prototype.setItem;
        const removeItem = Storage.prototype.removeItem;
        window.__restoreExitWrites = () => { Storage.prototype.setItem = setItem; };
        Storage.prototype.setItem = function (name, value) {
          if (name === key) throw new DOMException("Storage quota exceeded", "QuotaExceededError");
          return setItem.call(this, name, value);
        };
        Storage.prototype.removeItem = function (name) {
          if (name === key) sessionStorage.setItem("exit-save-deleted", "1");
          return removeItem.call(this, name);
        };
        game.state.gold = 199;
        game.openOptionsMenu();
        game.state.optionsMenu.selected = "exit";
      }, storageKey);
      await page.keyboard.press("Enter");
      assert.deepEqual(await page.evaluate((key) => ({
        open: window.__foodAnimals.state.optionsMenu.open,
        transition: window.__foodAnimals.state.shopReturnStaticTransition,
        message: window.__foodAnimals.state.message,
        preserved: localStorage.getItem(key) === window.__previousExitSave,
      }), storageKey), { open: true, transition: null, message: "Save unavailable", preserved: true });
      const saveStatusRendered = await page.evaluate(() => {
        const texts = [];
        const fillText = CanvasRenderingContext2D.prototype.fillText;
        CanvasRenderingContext2D.prototype.fillText = function (text, ...args) {
          texts.push(text);
          return fillText.call(this, text, ...args);
        };
        try { window.advanceTime(500); } finally { CanvasRenderingContext2D.prototype.fillText = fillText; }
        return texts.includes("Save unavailable");
      });
      assert.equal(saveStatusRendered, true, "the open options panel must visibly report the failed save");
      const outputDir = path.join(repoRoot, "output", "save-exit-pointer-recovery");
      fs.mkdirSync(outputDir, { recursive: true });
      await page.screenshot({ path: path.join(outputDir, "save-failure.png") });
      await page.evaluate(() => window.__restoreExitWrites());
      await page.keyboard.press("Enter");
      await page.evaluate(() => window.advanceTime(2500));
      await page.waitForURL(`${baseUrl}/`);
      const result = await page.evaluate((key) => ({
        deleted: sessionStorage.getItem("exit-save-deleted"),
        record: JSON.parse(localStorage.getItem(key)),
      }), storageKey);
      assert.equal(result.deleted, null, "successful menu return must never delete the active save");
      assert.equal(result.record?.snapshot.state.gold, 199);
      const restored = await openGame({ record: result.record });
      try {
        await restored.page.evaluate(() => window.advanceTime(4000));
        assert.equal(await restored.page.evaluate(() => window.__foodAnimals.state.gold), 199);
      } finally {
        await restored.context.close();
      }
    } finally {
      await context.close();
    }
  });

  await check("finished runs can return to the menu without creating another save", async () => {
    const { page, context } = await openGame();
    try {
      assert.deepEqual(await page.evaluate(() => {
        const game = window.__foodAnimals;
        game.state.board[0] = game.makeUnit("taco_tiger", 1);
        game.state.hearts = 1;
        game.startBattle();
        game.state.battle.allies.forEach((unit) => { unit.hp = 0; unit.dead = true; });
        window.advanceTime(5000);
        const concluded = game.state.runConcluded;
        const open = game.openOptionsMenu();
        game.state.optionsMenu.selected = "exit";
        return { concluded, open, canSave: game.saveCurrentRun() };
      }), { concluded: true, open: true, canSave: false });
      await page.keyboard.press("Enter");
      assert.equal(await page.evaluate(() => window.__foodAnimals.state.shopReturnStaticTransition?.source), "normalMenuReturn");
      assert.equal(await page.evaluate(() => window.__foodAnimals.state.message), "Returning to menu");
      await page.evaluate(() => window.advanceTime(2500));
      await page.waitForURL(`${baseUrl}/`);
      assert.equal(await page.evaluate((key) => localStorage.getItem(key), storageKey), null);
    } finally {
      await context.close();
    }
  });

  await check("touch drags remain owned by their initiating pointer", async () => {
    for (const secondOnOccupiedSlot of [false, true]) {
      const { page, context } = await openGame({ mobile: true });
      try {
        const points = await page.evaluate(() => {
          const game = window.__foodAnimals;
          game.state.board.fill(null);
          game.state.bench.fill(null);
          game.state.bench[0] = game.makeUnit("taco_tiger", 1);
          game.state.bench[1] = game.makeUnit("toast_tortoise", 1);
          window.advanceTime(1000);
          const rect = document.querySelector("#game").getBoundingClientRect();
          return [[70, 600], [382, 278], [460, 278], [148, 600]].map(([x, y]) => ({
            x: rect.x + x / 1024 * rect.width, y: rect.y + y / 640 * rect.height,
          }));
        });
        const cdp = await context.newCDPSession(page);
        const first = { ...points[0], id: 1 };
        const held = { ...points[1], id: 1 };
        const second = { ...points[secondOnOccupiedSlot ? 3 : 2], id: 2 };
        const touch = (type, touchPoints) => cdp.send("Input.dispatchTouchEvent", { type, touchPoints });
        await touch("touchStart", [first]);
        await touch("touchMove", [held]);
        await touch("touchStart", [held, second]);
        await touch("touchMove", [held, { ...points[2], id: 2 }]);
        // CDP touchEnd lists the contacts being released, not those still held.
        await touch("touchEnd", [{ ...points[2], id: 2 }]);
        assert.deepEqual(await page.evaluate(() => {
          const state = window.__foodAnimals.state;
          return { dragging: state.drag?.index, bench: state.bench.filter(Boolean).length, board: state.board.filter(Boolean).length };
        }), { dragging: 0, bench: 2, board: 0 }, "secondary finger must not replace or finish the primary drag");
        await page.evaluate(() => {
          const canvas = document.querySelector("#game");
          for (const type of ["pointercancel", "pointerleave", "lostpointercapture"]) {
            canvas.dispatchEvent(new PointerEvent(type, { pointerId: 999, pointerType: "touch" }));
          }
        });
        assert.equal(await page.evaluate(() => window.__foodAnimals.state.drag?.index), 0,
          "unrelated pointer cancellation must not cancel the owner");
        await touch("touchEnd", [held]);
        assert.deepEqual(await page.evaluate(() => {
          const state = window.__foodAnimals.state;
          return { drag: state.drag, placed: state.board[0]?.typeId, untouched: state.bench[1]?.typeId };
        }), { drag: null, placed: "taco_tiger", untouched: "toast_tortoise" });
        await touch("touchStart", [{ ...points[3], id: 3 }]);
        await touch("touchMove", [{ ...points[2], id: 3 }]);
        await touch("touchCancel", []);
        assert.equal(await page.evaluate(() => window.__foodAnimals.state.drag), null);
        assert.equal(await page.evaluate(() => window.__foodAnimals.state.bench[1]?.typeId), "toast_tortoise");
        await page.mouse.move(points[3].x, points[3].y);
        await page.mouse.down();
        await page.mouse.move(points[2].x, points[2].y, { steps: 3 });
        await page.mouse.up();
        assert.equal(await page.evaluate(() => window.__foodAnimals.state.board[1]?.typeId), "toast_tortoise",
          "mouse dragging must still work after a cancelled touch");
      } finally {
        await context.close();
      }
    }
  });

  await check("fullscreen includes story controls and returns to playable combat", async () => {
    const outputDir = path.join(repoRoot, "output", "fullscreen-story-recovery");
    fs.mkdirSync(outputDir, { recursive: true });
    for (const size of ["high", "desktop", "mobile"]) {
      const { page, context } = await openGame({ mobile: size === "mobile", viewport: size === "high" ? { width: 2560, height: 1600 } : null, manualTime: false });
      try {
        await page.keyboard.press("f");
        await page.waitForFunction(() => Boolean(document.fullscreenElement), {}, { polling: 100 });
        assert.equal(await page.evaluate(() => document.fullscreenElement.contains(document.querySelector("#mobile-story-ui"))), true,
          "fullscreen must contain the DOM story layer as well as the canvas");
        await page.evaluate(() => {
          const story = window.FoodAnimalsStoryData.STORY_MILESTONES.level2;
          window.__foodAnimals.startStoryConversation({ ...story, id: "fullscreen-test", index: 0, beats: story.beats.slice(0, 2) });
          window.advanceTime(1000);
        });
        await page.waitForLoadState("networkidle");
        await page.evaluate(() => window.advanceTime(16));
        await page.screenshot({ path: path.join(outputDir, `${size}-story.png`) });
        if (size === "mobile") {
          const reachable = await page.locator('[data-mobile-story-action="advance"]').evaluate((button) => {
            const rect = button.getBoundingClientRect();
            return document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2) === button;
          });
          assert.equal(reachable, true, "mobile fullscreen story button must be reachable");
          await page.locator('[data-mobile-story-action="advance"]').click();
          assert.equal(await page.evaluate(() => window.__foodAnimals.state.activeStory.index), 1);
          await page.locator('[data-mobile-story-action="advance"]').click();
        } else {
          await page.keyboard.press("Enter");
          await page.keyboard.press("Enter");
        }
        await page.evaluate(() => window.advanceTime(1000));
        assert.equal(await page.evaluate(() => window.__foodAnimals.state.activeStory), null);
        assert.equal(await page.locator("#game").evaluate((canvas) => getComputedStyle(canvas).opacity), "1");
        const raster = await page.locator("#game").evaluate((canvas) => {
          const rect = canvas.getBoundingClientRect();
          const { data } = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
          const colors = new Set();
          for (let i = 0; i < data.length; i += 4096) colors.add(`${data[i]},${data[i + 1]},${data[i + 2]}`);
          const touchFirst = JSON.parse(window.render_game_to_text_full()).rendering.touchFirst;
          return { colors: colors.size, width: canvas.width, requiredWidth: Math.min(rect.width * window.devicePixelRatio, 1024 * (touchFirst ? 2 : 2.5)) };
        });
        assert.ok(raster.colors > 20, "fullscreen return must render the game, not a blank frame");
        assert.ok(raster.width + 1 >= raster.requiredWidth, "fullscreen backing resolution must follow the displayed canvas");
        await page.evaluate(() => {
          window.__foodAnimals.state.board[0] = window.__foodAnimals.makeUnit("taco_tiger", 1);
        });
        await page.keyboard.press("Space");
        assert.equal(await page.evaluate(() => window.__foodAnimals.state.phase), "battle");
        await page.keyboard.press("f");
        await page.waitForFunction(() => !document.fullscreenElement, {}, { polling: 100 });
        await page.evaluate(() => window.advanceTime(100));
        await page.screenshot({ path: path.join(outputDir, `${size}-returned.png`) });
      } finally {
        await context.close();
      }
    }
  });

  await check("combat results stay fixed while pending impacts finish", async () => {
    const cases = [false, true].flatMap((pendingImpacts) => [0, 1, 2, 3].map((speed) => ({ speed, pendingImpacts })));
    for (const { speed, pendingImpacts } of cases) {
      const { page, context } = await openGame();
      const result = await page.evaluate(({ speed, pendingImpacts }) => {
        const game = window.__foodAnimals;
        const state = game.state;
        state.board.fill(null);
        state.board[0] = game.makeUnit("taco_tiger", 1);
        game.startBattle();
        state.phaseTransition = null;
        state.battleSpeedIndex = speed;
        const battle = state.battle;
        battle.allyDrinks = [];
        battle.enemyDrinks = [];
        battle.moldNextTick = 9999;
        battle.allies.forEach((unit) => { unit.dead = true; unit.hp = 0; });
        battle.enemies = battle.enemies.slice(0, 1);
        const enemy = battle.enemies[0];
        enemy.hp = 1;
        enemy.shield = 0;
        enemy.item = null;
        enemy.cooldown = 999;
        enemy.burn = { remaining: 1, tick: 0.12, damage: 10, source: battle.allies[0] };
        battle.drinkTosses = [];
        battle.attacks = pendingImpacts ? [{ from: enemy.uid, to: battle.allies[0].uid, t: 0.3, duration: 0.3,
          impact: { targetUid: battle.allies[0].uid, sourceUid: enemy.uid, redirect: true } }] : [];
        window.advanceTime(16);
        const latched = battle.outcomePresentation?.result;
        const burnTick = enemy.burn.tick;
        const burn = enemy.burn;
        window.advanceTime(1600);
        return { latched, final: state.lastCombatLedger?.result, hearts: state.hearts,
          pending: battle.attacks.length, enemyAlive: !enemy.dead, burnTick, finalBurnTick: burn.tick };
      }, { speed, pendingImpacts });
      await context.close();
      assert.equal(result.latched, "loss", "the result must latch even with an impact in flight");
      assert.equal(result.final, "loss");
      assert.equal(result.hearts, 9);
      assert.equal(result.pending, 0, "the last projectile must finish");
      assert.equal(result.enemyAlive, true, "burn must not kill the survivor during the presentation hold");
      assert.equal(result.finalBurnTick, result.burnTick);
    }
  });

  await check("an arena reward survives interrupted battles but is consumed on completion", async () => {
    const original = await openGame();
    const fixture = await original.page.evaluate((key) => {
      const game = window.__foodAnimals;
      const state = game.state;
      state.runMode = "infinite";
      state.phase = "result";
      state.board.fill(null);
      state.board[0] = game.makeUnit("taco_tiger", 1);
      state.rewardChoices = [{ type: "arenaPrepBuff", arenaId: state.arenaId, arenaShort: "Arena", traitIds: ["spicy"],
        shieldPct: 0.12, hastePct: 0.1, attackPct: 0.08, duration: 3, title: "Arena Prep" }];
      game.applyRewardChoice(0);
      window.advanceTime(4000);
      const buff = structuredClone(state.arenaPrepBuff);
      game.startBattle();
      game.saveCurrentRun({ silent: true });
      return { buff, record: JSON.parse(localStorage.getItem(key)) };
    }, storageKey);
    await original.context.close();
    assert.deepEqual(fixture.record.snapshot.state.arenaPrepBuff, fixture.buff, "the battle restart snapshot must refund the consumed reward");
    const restored = await openGame({ record: fixture.record });
    const actual = await restored.page.evaluate((key) => {
      const game = window.__foodAnimals;
      const state = game.state;
      const restoredBuff = structuredClone(state.arenaPrepBuff);
      game.startBattle();
      const boost = structuredClone(state.battle.allies[0].attackBoost);
      state.phaseTransition = null;
      state.battle.enemies.forEach((unit) => { unit.dead = true; unit.hp = 0; });
      window.advanceTime(1000);
      game.saveCurrentRun({ silent: true });
      return { restoredBuff, boost, phase: state.phase, savedBuff: JSON.parse(localStorage.getItem(key)).snapshot.state.arenaPrepBuff };
    }, storageKey);
    await restored.context.close();
    assert.deepEqual(actual.restoredBuff, fixture.buff);
    assert.deepEqual(actual.boost, { remaining: 3, pct: 0.08 });
    assert.equal(actual.phase, "result");
    assert.equal(actual.savedBuff, null, "a completed battle must consume its reward exactly once");
  });

  await check("shop return saves completed setup and restores without replay", async () => {
    const original = await openGame();
    const fixture = await original.page.evaluate((key) => {
      const game = window.__foodAnimals;
      const state = game.state;
      state.phase = "result";
      state.runMode = "infinite";
      state.activeStory = null;
      state.phaseTransition = null;
      state.lastIncome = { result: "win" };
      state.rewardChoices = [];
      state.freeRolls = 0;
      state.keepArenaNextRound = true;
      game.continueFromResult();
      window.advanceTime(state.shopReturnStaticTransition.switchAt * 1000 + 30);
      return {
        record: JSON.parse(localStorage.getItem(key)),
        expected: { arena: state.arenaId, freeRolls: state.freeRolls, gold: state.gold, shop: state.shop },
      };
    }, storageKey);
    await original.context.close();
    assert.equal(fixture.record.snapshot.state.shopReturnStaticTransition.screenChanged, true,
      "the synchronous setup save must already mark the transition complete");
    // Previously shipped snapshots can contain prep plus screenChanged=false.
    for (const legacy of [false, true]) {
      const record = structuredClone(fixture.record);
      if (legacy) record.snapshot.state.shopReturnStaticTransition.screenChanged = false;
      const restored = await openGame({ record });
      const actual = await restored.page.evaluate(() => {
        window.advanceTime(3000);
        const state = window.__foodAnimals.state;
        return { arena: state.arenaId, freeRolls: state.freeRolls, gold: state.gold, shop: state.shop };
      });
      await restored.context.close();
      assert.deepEqual(actual, fixture.expected, `restoring ${legacy ? "legacy" : "new"} saves must not repeat setup`);
    }
  });

  await check("interrupted unit/item merges resume once, including behind a story", async () => {
    for (const elapsed of [0, 2200, 8000]) {
      const original = await openGame();
      const fixture = await original.page.evaluate(({ key, elapsed }) => {
        const game = window.__foodAnimals;
        const state = game.state;
        state.board.fill(null);
        state.bench.fill(null);
        state.itemBench.fill(null);
        state.drinks.fill(null);
        for (let i = 0; i < 3; i++) {
          state.bench[i] = game.makeUnit("taco_tiger", 1);
          state.bench[i].item = game.makeItem(["maple_leaf", "marshmallow_cube", "popcorn_kernel"][i]);
          state.itemBench[i] = game.makeItem("berry_fizz", 1);
        }
        const equipment = state.bench.filter(Boolean).map((unit) => unit.item.uid).sort((a, b) => a - b);
        state.bench[0].permanentHpBonus = 9;
        state.bench[0].maxHp += 9;
        state.bench[0].hp += 9;
        game.resolveItemMerges();
        game.resolveMerges();
        window.advanceTime(elapsed);
        game.saveCurrentRun({ silent: true });
        const record = JSON.parse(localStorage.getItem(key));
        window.advanceTime(9000);
        return { record, expectedGold: state.gold, equipment };
      }, { key: storageKey, elapsed });
      await original.context.close();
      if (elapsed === 0) {
        fixture.record.snapshot.state.activeStory = {
          id: "recovery-test", index: 0, beats: [{ speaker: "You", text: "Pause the merge." }],
        };
      }
      const restored = await openGame({ record: fixture.record });
      const actual = await restored.page.evaluate(() => {
        const state = window.__foodAnimals.state;
        if (state.activeStory) {
          window.advanceTime(4000);
          if (state.itemBench.filter(Boolean).length !== 3) throw new Error("merge must wait for the story");
          window.__foodAnimals.advanceStoryConversation(true);
        }
        window.advanceTime(12000);
        const units = [...state.bench, ...state.board].filter((entry) => entry?.kind === "unit");
        const looseItems = [...state.bench, ...state.itemBench].filter((entry) => entry?.kind === "item");
        return { units: units.map((unit) => unit.tier),
          drinks: looseItems.filter((item) => item.type === "drink").map((item) => item.tier), gold: state.gold,
          bonus: units[0]?.permanentHpBonus,
          equipment: [...looseItems.filter((item) => item.type !== "drink"), ...units.map((unit) => unit.item)].filter(Boolean).map((item) => item.uid).sort((a, b) => a - b) };
      });
      await restored.context.close();
      assert.deepEqual(actual, { units: [2], drinks: [2], gold: fixture.expectedGold, bonus: 9, equipment: fixture.equipment }, `merge recovery at ${elapsed}ms must commit each reward once without losing equipment or growth`);
    }
  });

  await check("automatic merges retain the same resale cap as direct shop merges", async () => {
    const results = [];
    for (const direct of [false, true]) {
      const { page, context } = await openGame();
      results.push(await page.evaluate((direct) => {
        const game = window.__foodAnimals;
        const state = game.state;
        state.board.fill(null);
        state.bench.fill(null);
        state.gold = 500;
        const costs = [];
        for (let i = 0; i < 3; i++) {
          state.shop[0] = game.makeUnit("taco_tiger", 2);
          state.shopSales[0] = true;
          const before = state.gold;
          if (!game.buyShopToSlot(0, "bench", direct && i === 2 ? 0 : i)) throw new Error("purchase failed");
          if (i < 2 || !direct) costs.push(before - state.gold);
        }
        window.advanceTime(4000);
        const unit = state.bench.find(Boolean);
        return { tier: unit.tier, purchaseGold: unit.purchaseGold, sellValue: game.sellValue(unit), costs };
      }, direct));
      await context.close();
    }
    assert.equal(results[0].tier, 3);
    assert.equal(results[0].purchaseGold, results[0].costs.reduce((sum, value) => sum + value, 0), "automatic merge must retain actual purchase costs");
    assert.equal(results[0].purchaseGold, results[1].purchaseGold);
    assert.equal(results[0].sellValue, results[1].sellValue);
  });

  await check("mobile story controls activate music and SFX on fresh load", async () => {
    for (const action of ["advance", "skip", "back"]) {
      const { page, context } = await openGame({ mobile: true, route: "?screen=conversation&story=level10&reality=horror" });
      await page.evaluate(() => {
        window.__foodAnimals.state.activeStory.index = 1;
        window.advanceTime(1000);
      });
      await page.locator(`[data-mobile-story-action="${action}"]`).click();
      await page.waitForFunction(() => new Set(window.__recoveryAudioStarted).size >= 2, {}, { polling: 100, timeout: 5000 });
      const audio = await page.evaluate(() => {
        const { music, sfx } = JSON.parse(window.render_game_to_text_full());
        return { music: music.armed, sfx: sfx.armed };
      });
      await context.close();
      assert.deepEqual(audio, { music: true, sfx: true }, `${action} must activate audio`);
    }
  });
  assert.deepEqual(browserErrors, [], "recovery checks must not produce browser exceptions");
} finally {
  await browser.close();
  server?.kill();
}
if (failures.length) throw new Error(`${failures.length} recovery checks failed: ${failures.join(", ")}`);
