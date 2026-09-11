import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { runtimeEntryGroups } from "./runtime-entry-groups.mjs";
import { baseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

const server = await ensureServer();
const browser = await loadPlaywright().chromium.launch({ headless: true });
let source = runtimeEntryGroups.game.map((name) => fs.readFileSync(path.join(repoRoot, `src/${name}.js`), "utf8")).join("\n");
source = source.replace("const visible = (top, bottom) => bottom >= viewport.y && top <= viewport.y + viewport.h;",
  "const visible = (top, bottom) => window.__cacheTest.disableCulling || (bottom >= viewport.y && top <= viewport.y + viewport.h);");
source = source.replace("window.__foodAnimals = {", `window.__cacheTest = {
  drawFrame, traitInfo, projectedTeamStats, computeProjectedTeamStats, drawArenaBattlePanel, drawArenaBattlePanelArtwork,
  drawTeamIntelContents, teamIntelView, invalidateRenderSurfaces, getRuntimeSprite, getItemSprite, warmAlphaMetrics,
  traitCache: themedTraitCache, outlines: horrorOutlineCache, runtimeSpriteMetricsCache, itemSpriteMetricsCache,
  withCanvasContext, disableCulling: false,
  arenaKey: () => arenaPanelKey, arenaCanvas: arenaPanelCanvas,
  clearText: () => { textMeasureCache.clear(); wrappedTextCache.clear(); },
}; window.__foodAnimals = {`);
const output = path.join(repoRoot, "output/render-caches");
fs.mkdirSync(output, { recursive: true });
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
    await page.goto(`${baseUrl}/local-test-pages/game.html?smoke=basic&seed=render-caches`);
    await page.waitForFunction(() => window.__cacheTest, {}, { polling: 100 });
    const stats = await page.evaluate(() => {
      const g = window.__foodAnimals, a = window.__cacheTest, s = g.state;
      const equal = (x, y, message) => { if (JSON.stringify(x) !== JSON.stringify(y)) throw new Error(message); };
      s.board = s.board.map((_, i) => g.makeUnit(["toast_tortoise", "taco_tiger", "mochi_mammoth"][i % 3], 2));
      s.drinks = s.drinks.map(() => g.makeItem("bean_brew", 2));
      s.selected = null; s.hover = null; s.pointer = null; s.shopSlotTransitions.fill(null); s.phaseTransition = null;
      let checks = 0;
      const verify = () => {
        equal(a.projectedTeamStats(), a.computeProjectedTeamStats(), "Cached stats must equal fresh computation");
        if (a.projectedTeamStats() !== a.projectedTeamStats()) throw new Error("Unchanged stats must reuse cache");
        checks++;
      };
      verify();
      for (const mutate of [
        () => { s.board[0].atk += 20; },
        () => { s.board[0].maxHp += 100; },
        () => { s.board[0].speed *= 0.7; },
        () => { s.board[0].item = { damageBonusPct: 0.25, selfHealPct: 0.1, everyNAttacks: 2 }; },
        () => { s.board[0].tier = 3; s.board[0].abilityPower += 10; },
        () => { s.board[1].traits = ["fresh", "sweet"]; },
        () => { s.board[2].ignoreTraits = true; },
        () => { [s.board[0], s.board[8]] = [s.board[8], s.board[0]]; },
        () => { s.drinks[0].drinkPulseType = "shield"; s.drinks[0].tier = 3; s.drinks[0].drinkPulseShieldPct = 0.2; },
        () => { s.drinks[0] = null; },
        () => { s.enemyPreview = { units: [g.makeUnit("toast_tortoise", 3)] }; },
        () => { s.enemyPreview.units[0].item = { damageTakenPct: -0.5 }; },
        () => { s.arenaPrepBuff = { traitIds: ["spicy"], shieldPct: 0.15 }; },
        () => { s.arenaId = "rainy_fish_market"; },
        () => { s.realityOverride = true; s.realityBroken = true; },
      ]) {
        const old = a.projectedTeamStats(); mutate(); verify();
        if (a.projectedTeamStats() === old) throw new Error(`Changed inputs must invalidate stats (case ${checks - 1})`);
      }
      const ids = Object.keys(window.FoodAnimalsTraitArenaData.TRAITS);
      for (const horror of [false, true, false]) {
        s.realityOverride = horror; s.realityBroken = horror;
        for (const id of ids) {
          const info = a.traitInfo(id);
          if (info !== a.traitInfo(id)) throw new Error("Trait cache must reuse objects");
          const snapshot = JSON.stringify(info); a.traitCache.clear();
          equal(JSON.parse(snapshot), a.traitInfo(id), "Trait cache must preserve themed content");
        }
      }
      for (let i = 0; i < 100; i++) a.traitInfo(`unknown-${i}`);
      if (a.traitCache.size > 64) throw new Error("Trait cache must remain bounded");
      g.startBattle(); s.phaseTransition = null;
      verify();
      s.battle.traitLevels.ally.spicy = 2; verify();
      s.phase = "prep"; s.battle = null; verify();
      // Activate all classes and multiple pairing types for the culling comparison.
      s.board.forEach((unit, i) => { unit.ignoreTraits = false; unit.traits = [ids[i % ids.length], ids[(i + 1) % ids.length]]; });
      s.drinks = s.drinks.map(() => g.makeItem("bean_brew", 2));
      return checks;
    });
    for (const horror of [false, true]) {
      await page.evaluate((horror) => {
        const s = window.__foodAnimals.state;
        s.realityOverride = horror; s.realityBroken = horror; s.realityBreakTimer = 0;
        window.__cacheTest.drawFrame();
      }, horror);
      await page.waitForTimeout(1000);
      const result = await page.evaluate(() => {
        const a = window.__cacheTest, s = window.__foodAnimals.state;
        const c = document.getElementById("game"), x = c.getContext("2d");
        function pixels(draw) {
          x.save(); x.setTransform(c.width / 1024, 0, 0, c.height / 640, 0, 0);
          x.fillStyle = "#354839"; x.fillRect(0, 0, 1024, 640);
          s.tooltipTargets = []; draw(); x.restore();
          return x.getImageData(0, 0, c.width, c.height).data;
        }
        function difference(left, right) {
          let max = 0, total = 0, changed = 0;
          for (let i = 0; i < left.length; i++) {
            const d = Math.abs(left[i] - right[i]); max = Math.max(max, d); total += d; if (d) changed++;
          }
          return { max, mean: total / left.length, changed };
        }
        a.drawFrame();
        const intel = [];
        for (const offset of [0, 180, 360, a.teamIntelView.maxScroll]) {
          a.teamIntelView.offset = offset; a.disableCulling = true;
          const all = pixels(a.drawTeamIntelContents);
          const allTips = JSON.stringify(s.tooltipTargets);
          a.disableCulling = false;
          const culled = pixels(a.drawTeamIntelContents);
          if (JSON.stringify(s.tooltipTargets) !== allTips) throw new Error("Visible Intel tooltips changed");
          intel.push(difference(all, culled));
        }
        a.clearText();
        const proto = CanvasRenderingContext2D.prototype, fillText = proto.fillText;
        let commands = [];
        proto.fillText = function (...args) { commands.push(args); return fillText.apply(this, args); };
        const direct = pixels(a.drawArenaBattlePanelArtwork), tips = JSON.stringify(s.tooltipTargets);
        const directCommands = JSON.stringify(commands); commands = [];
        const directImage = c.toDataURL();
        a.clearText(); a.invalidateRenderSurfaces();
        const cached = pixels(a.drawArenaBattlePanel);
        proto.fillText = fillText;
        if (JSON.stringify(commands) !== directCommands) throw new Error("Cold HUD cache changed text or layout");
        const cachedImage = c.toDataURL();
        if (JSON.stringify(s.tooltipTargets) !== tips) throw new Error("Cached arena tooltips changed");
        const hit = pixels(a.drawArenaBattlePanel);
        if (difference(cached, hit).max) throw new Error("Arena cache hits must be identical");
        if (JSON.stringify(s.tooltipTargets) !== tips) throw new Error("Arena tooltips missing on cache hit");
        const key = a.arenaKey();
        a.invalidateRenderSurfaces();
        if (a.arenaKey()) throw new Error("Recovery must invalidate arena cache");
        pixels(a.drawArenaBattlePanel);
        if (a.arenaKey() !== key) throw new Error("Recovery must rebuild arena artwork");
        document.fonts.dispatchEvent(new Event("loadingdone")); pixels(a.drawArenaBattlePanel);
        if (a.arenaKey() === key) throw new Error("Font loading must refresh arena artwork");
        for (const alpha of [0.25, 0.6]) {
          const draw = (fn) => () => { x.globalAlpha = alpha; fn(); };
          const expected = pixels(draw(a.drawArenaBattlePanelArtwork));
          const faded = pixels(draw(a.drawArenaBattlePanel));
          if (difference(expected, faded).max) throw new Error("Fades must retain original per-element blending");
        }
        a.teamIntelView.offset = 0; a.drawFrame();
        return { intel, arena: difference(direct, cached), directImage, cachedImage };
      });
      result.intel.forEach((diff) => assert.equal(diff.max, 0, `${label} Intel culling must be pixel-identical`));
      for (const name of ["directImage", "cachedImage"]) fs.writeFileSync(path.join(output, `${label}-${horror ? "horror" : "cozy"}-${name}.png`), Buffer.from(result[name].split(",")[1], "base64"));
      assert.ok(result.arena.mean < 0.15, `${label} cached translucent HUD must retain appearance: ${JSON.stringify(result.arena)}`);
      await page.screenshot({ path: path.join(output, `${label}-${horror ? "horror" : "cozy"}.png`) });
      console.log(`${label}/${horror ? "horror" : "cozy"}: ${stats} invalidation cases; Intel identical; HUD ${JSON.stringify(result.arena)}`);
    }
    if (label === "high") {
      const images = await page.evaluate(async () => {
        const api = window.FoodAnimalsRuntimeAssets, manifest = window.FoodAnimalsSpriteMetrics;
        let count = 0;
        for (const [src, expected] of Object.entries(manifest)) {
          const image = new Image(); image.src = new URL(`../${src}`, location.href).href; await image.decode();
          const cached = api.alphaMetrics(image, new Map());
          window.FoodAnimalsSpriteMetrics = null;
          const scanned = api.alphaMetrics(image, new Map());
          window.FoodAnimalsSpriteMetrics = manifest;
          if (JSON.stringify(cached) !== JSON.stringify(scanned)) throw new Error(`Baked bounds differ: ${src}`);
          if (image.naturalWidth !== expected.width) throw new Error(`Wrong width: ${src}`);
          count++;
        }
        const a = window.__cacheTest, g = window.__foodAnimals;
        g.state.realityOverride = true; g.state.realityBroken = true;
        const image = a.getRuntimeSprite(g.makeUnit("toast_tortoise", 2));
        await image.decode(); await new Promise((resolve) => setTimeout(resolve, 0));
        a.outlines.clear(); a.warmAlphaMetrics(image, a.runtimeSpriteMetricsCache);
        const entries = a.outlines.size;
        if (!entries) throw new Error("Load-time warmup must prepare horror outline");
        const proto = CanvasRenderingContext2D.prototype, read = proto.getImageData;
        proto.getImageData = () => { throw new Error("Known sprite must not read pixels during preparation"); };
        try {
          const bounds = api.alphaMetrics(image, new Map());
          api.outlinedImage(image, a.outlines, { size: 256, crop: bounds });
          if (a.outlines.size !== entries) throw new Error("First render should reuse the prepared outline");
        } finally { proto.getImageData = read; }
        return count;
      });
      assert.ok(images > 900); console.log(`${images} sprite bounds match full-resolution alpha scans.`);
    }
    await context.close();
  }
  assert.deepEqual(errors, []);
  console.log("Render cache regression checks passed.");
} finally { await browser.close(); server?.kill(); }
