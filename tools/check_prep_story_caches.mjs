import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { runtimeEntryGroups } from "./runtime-entry-groups.mjs";
import { baseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

let source = runtimeEntryGroups.game.map((name) => fs.readFileSync(path.join(repoRoot, `src/${name}.js`), "utf8")).join("\n");
source = source.replace("if (!prepRenderCache) return compute();", "if (!prepRenderCache || window.__prepTest?.bypass) return compute();");
for (const name of ["collectOwnedRefs", "collectLooseItemRefs"]) {
  source = source.replace(`function ${name}() {`, `function ${name}() { if (window.__prepTest) window.__prepTest.counts.${name}++;`);
}
source = source.replace("window.__foodAnimals = {", `window.__prepTest = {
  drawFrame, allOwnedRefs, allLooseItemRefs, themedGeneratedText, syncMobileStoryOverlay,
  mobileStoryUi, bypass: false, counts: { collectOwnedRefs: 0, collectLooseItemRefs: 0 },
  cache: () => prepRenderCache, textCache: generatedTextCache,
  coldText(value) { generatedTextCache.clear(); horrorTextReplacements = null; return themedGeneratedText(value); },
}; window.__foodAnimals = {`);
const output = path.join(repoRoot, "output/prep-story-caches");
fs.mkdirSync(output, { recursive: true });
const server = await ensureServer();
const browser = await loadPlaywright().chromium.launch({ headless: true });
const errors = [];
try {
  for (const [label, viewport, mobile] of [
    ["high", { width: 2560, height: 1600 }, false],
    ["desktop", { width: 1366, height: 768 }, false],
    ["mobile", { width: 390, height: 844 }, true],
  ]) {
    const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1 });
    await context.addInitScript(() => { window.requestAnimationFrame = () => 0; });
    const page = await context.newPage();
    page.on("pageerror", (error) => errors.push(error.message));
    await page.route("**/dist/game.bundle.js*", (route) => route.fulfill({ contentType: "text/javascript", body: source }));
    await page.goto(`${baseUrl}/local-test-pages/game.html?smoke=basic&seed=prep-story-caches`);
    await page.waitForFunction(() => window.__prepTest, {}, { polling: 100 });
    await page.evaluate(() => {
      const g = window.__foodAnimals, s = g.state;
      s.board = s.board.map((_, i) => g.makeUnit(["toast_tortoise", "taco_tiger", "mochi_mammoth"][i % 3], 2));
      s.bench = s.bench.map(() => g.makeUnit("toast_tortoise", 1));
      s.drinks = s.drinks.map(() => g.makeItem("bean_brew", 2));
      s.itemBench = s.itemBench.map(() => g.makeItem("maple_leaf", 1));
      s.shop = s.shop.map((_, i) => i % 2 ? g.makeItem("maple_leaf", 1) : g.makeUnit("toast_tortoise", 1));
      s.shopUnlocked.fill(true); s.selected = { area: "shop", index: 1 };
      s.hover = null; s.pointer = null; s.phaseTransition = null; s.shopSlotTransitions.fill(null);
    });
    for (const horror of [false, true]) {
      await page.evaluate((horror) => {
        const s = window.__foodAnimals.state;
        s.realityOverride = horror; s.realityBroken = horror; s.realityBreakTimer = 0;
        window.__prepTest.drawFrame();
      }, horror);
      await page.waitForTimeout(1200);
      const result = await page.evaluate(() => {
        const a = window.__prepTest, g = window.__foodAnimals, s = g.state;
        const require = (condition, message) => { if (!condition) throw new Error(message); };
        const canvas = document.getElementById("game");
        const capture = (bypass) => {
          a.bypass = bypass; a.drawFrame();
          require(a.cache() === null, "Prep cache leaked beyond rendering");
          return { image: canvas.toDataURL(), tips: JSON.stringify(s.tooltipTargets) };
        };
        let cases = 0;
        for (const mutate of [
          () => {},
          () => { s.board[0] = g.makeUnit("sushi_seal", 3); },
          () => { s.board[1].item = g.makeItem("maple_leaf", 2); },
          () => { s.bench[0] = null; s.itemBench[0] = null; },
          () => { s.drinks[0] = null; },
          () => { s.shop[1] = g.makeItem("bean_brew", 2); },
          () => { s.shopUnlocked[0] = false; s.gold = 0; },
          () => { s.selected = { area: "board", index: 1 }; },
          () => { s.selected = null; },
        ]) {
          mutate();
          const expected = capture(true), actual = capture(false);
          require(actual.image === expected.image, `Prep pixels changed (case ${cases})`);
          require(actual.tips === expected.tips, `Prep tooltips changed (case ${cases})`);
          cases++;
        }
        a.counts = { collectOwnedRefs: 0, collectLooseItemRefs: 0 }; a.drawFrame();
        require(a.counts.collectOwnedRefs === 1 && a.counts.collectLooseItemRefs === 1, "Inventory must be collected once per redraw");
        const counts = { ...a.counts };
        require(a.allOwnedRefs() !== a.allOwnedRefs(), "Transactions must receive fresh owned references");
        require(a.allLooseItemRefs() !== a.allLooseItemRefs(), "Transactions must receive fresh loose references");
        const inputs = [null, undefined, 0, "", "Food animals, animal, toppings, drink, drinks, coin, coins, gold, shops, arena, arenas, roll, rolls.", "shopping bankroll goldfish", "FOOD ANIMAL & TOPPING"];
        for (const value of inputs) {
          const expected = a.coldText(value);
          require(a.themedGeneratedText(value) === expected, "Text memo changed content or input type");
        }
        s.realityOverride = true; s.realityBroken = true;
        for (let i = 0; i < 600; i++) a.themedGeneratedText(`animal ${i}`);
        require(a.textCache.size <= 512, "Text cache exceeded its bound");
        const long = "animal ".repeat(400); a.themedGeneratedText(long);
        require(!a.textCache.has(long), "Long summaries must bypass text storage");
        const horrorText = a.themedGeneratedText("animal shop");
        s.realityOverride = false; s.realityBroken = false;
        require(a.themedGeneratedText("animal shop") === "animal shop", "Horror cache leaked into cozy text");
        s.realityOverride = true; s.realityBroken = true;
        require(a.themedGeneratedText("animal shop") === horrorText, "Theme switching changed horror text");
        return { cases, counts };
      });
      await page.evaluate((horror) => {
        const s = window.__foodAnimals.state; s.realityOverride = horror; s.realityBroken = horror;
        window.__prepTest.drawFrame();
      }, horror);
      await page.screenshot({ path: path.join(output, `${label}-${horror ? "horror" : "cozy"}.png`) });
      console.log(`${label}/${horror ? "horror" : "cozy"}: ${JSON.stringify(result)}`);
    }
    if (mobile) {
      await page.goto(`${baseUrl}/local-test-pages/game.html?screen=conversation-horror`);
      await page.waitForFunction(() => window.__prepTest, {}, { polling: 100 });
      const mutations = await page.evaluate(() => {
        const a = window.__prepTest, s = window.__foodAnimals.state, ui = a.mobileStoryUi;
        a.drawFrame();
        const observer = new MutationObserver(() => {});
        observer.observe(document.body, { subtree: true, attributes: true, childList: true });
        for (let i = 0; i < 60; i++) a.drawFrame();
        const unchanged = observer.takeRecords().length;
        const story = s.activeStory; story.index = Math.min(1, story.beats.length - 1);
        a.syncMobileStoryOverlay();
        if (ui.text.textContent !== story.beats[story.index].text) throw new Error("Story text did not update");
        story.skipConfirm = true; a.syncMobileStoryOverlay();
        if (ui.skip.textContent !== "Confirm Skip" || ui.skipConfirm.hidden) throw new Error("Skip confirmation did not update");
        s.activeStory = null; a.syncMobileStoryOverlay();
        if (!ui.root.hidden || document.body.dataset.mobileStory !== undefined) throw new Error("Story overlay did not close");
        s.activeStory = story; story.skipConfirm = false; a.syncMobileStoryOverlay();
        if (ui.root.hidden || !ui.skipConfirm.hidden) throw new Error("Story overlay did not reopen");
        observer.disconnect(); return unchanged;
      });
      assert.equal(mutations, 0, "Unchanged mobile story must not mutate the DOM");
      console.log("mobile story: 60 unchanged redraws, zero DOM mutations; navigation/skip/close/reopen passed");
    }
    await context.close();
  }
  assert.deepEqual(errors, [], "Browser errors");
} finally {
  await browser.close(); server?.kill();
}
