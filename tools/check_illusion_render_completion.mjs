import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { runtimeEntryGroups } from "./runtime-entry-groups.mjs";
import { baseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

let source = runtimeEntryGroups.game.map(name => fs.readFileSync(path.join(repoRoot, `src/${name}.js`), "utf8")).join("\n");
source = source.replace("window.__foodAnimals = {", `window.__illusionTest = {
  drawFrame, gameLoop, contentBleedPhase, slotBackdropBleedPhase, getRuntimeSprite, getItemSprite,
  shouldRenderContinuously, requestDraw,
  counts: () => ({ drawCount, skippedDrawCount, lastRenderContinuous }),
}; window.__foodAnimals = {`);
const output = path.join(repoRoot, "output/illusion-render-completion");
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
    page.on("pageerror", error => errors.push(error.message));
    await page.route("**/dist/game.bundle.js*", route => route.fulfill({ contentType: "text/javascript", body: source }));
    await page.goto(`${baseUrl}/local-test-pages/game.html?smoke=basic&reality=horror&seed=illusion-completion`);
    await page.waitForFunction(() => window.__illusionTest, {}, { polling: 100 });
    await page.evaluate(async () => {
      const g = window.__foodAnimals, s = g.state, a = window.__illusionTest;
      s.board = s.board.map((_, i) => i < 3 ? g.makeUnit("pico_de_gallo_gecko", 2) : null);
      s.drinks[0] = g.makeItem("bean_brew", 2);
      s.itemBench[0] = g.makeItem("maple_leaf", 2);
      s.selected = null; s.hover = null; s.pointer = null; s.phaseTransition = null;
      s.shopSlotTransitions.fill(null); s.realityBreakTimer = 0; s.particles = [];
      for (const unit of s.board.filter(Boolean)) {
        for (const options of [{ cozy: true }, { horror: true }]) await a.getRuntimeSprite(unit, options).decode();
      }
      for (const item of [s.drinks[0], s.itemBench[0]]) {
        for (const options of [{ cozy: true }, { horror: true }]) await a.getItemSprite(item, options).decode();
      }
      a.drawFrame();
    });
    await page.waitForTimeout(1200);
    for (const kind of ["unit", "drink", "topping", "tile"]) {
      const result = await page.evaluate(kind => {
        const s = window.__foodAnimals.state, a = window.__illusionTest;
        const require = (condition, message) => { if (!condition) throw new Error(`${kind}: ${message}`); };
        const canvas = document.getElementById("game");
        const entry = kind === "unit" ? s.board[0] : kind === "drink" ? s.drinks[0] : s.itemBench[0];
        const phase = () => kind === "tile" ? a.slotBackdropBleedPhase("board", 0) : a.contentBleedPhase(kind, entry);
        s.realityOverride = true; s.realityBroken = true;
        let found = false;
        for (let time = 0; time < 600; time += 0.02) {
          s.idleTime = time;
          const p = phase();
          if (p.phase === "flash" && p.progress > 0.3 && p.progress < 0.7) { found = true; break; }
        }
        require(found, "No flash fixture found");
        a.drawFrame();
        require(a.shouldRenderContinuously(), "A painted flash must keep rendering until settled");
        const flash = canvas.toDataURL();
        const startedAt = s.idleTime, before = a.counts();
        let now = performance.now(); s.lastTime = now;
        let frames = 0;
        while (a.shouldRenderContinuously() && frames < 1800) {
          now += 1000 / 60; a.gameLoop(now); frames++;
        }
        require(!a.shouldRenderContinuously(), "Effects did not return to idle");
        require(!phase().active, "Renderer stopped before the target effect ended");
        require(a.counts().drawCount > before.drawCount, "No automatic redraw occurred");
        require(!a.counts().lastRenderContinuous, "Scheduler did not observe the clean final frame");
        const settled = canvas.toDataURL();
        require(flash !== settled, "Flash pixels remained stuck");
        a.drawFrame();
        require(canvas.toDataURL() === settled, "Automatic final frame differs from an explicit clean redraw");
        const idle = a.counts();
        for (let i = 0; i < 20; i++) { now += 250; a.gameLoop(now); }
        require(a.counts().drawCount === idle.drawCount, "Quiet prep must not redraw periodically");
        require(a.counts().skippedDrawCount === idle.skippedDrawCount + 20, "Idle updates stopped being throttled");
        // Diagnostic phase reads must not start new render work.
        const time = s.idleTime;
        s.idleTime = startedAt; phase();
        require(!a.shouldRenderContinuously(), "Reading a hidden effect woke the renderer");
        // Exercise the first dirty redraw discovering an effect after an idle update.
        s.idleTime = startedAt - 0.01; s.lastTime = now;
        a.requestDraw(); now += 10; a.gameLoop(now);
        require(a.counts().lastRenderContinuous, "First painted effect must schedule animation immediately");
        s.realityOverride = false; a.drawFrame();
        require(!a.shouldRenderContinuously(), "Switching to cozy must clear illusion render work");
        s.idleTime = time;
        return { frames, seconds: Number((frames / 60).toFixed(2)), idleUpdates: 20, flash, settled };
      }, kind);
      if (kind === "unit") {
        for (const name of ["flash", "settled"]) fs.writeFileSync(path.join(output, `${label}-${name}.png`), Buffer.from(result[name].split(",")[1], "base64"));
      }
      delete result.flash; delete result.settled;
      console.log(`${label}/${kind}: ${JSON.stringify(result)}`);
    }
    await context.close();
  }
  assert.deepEqual(errors, [], "Browser errors");
  console.log("Illusion completion, exact final pixels, idle throttling, and theme cancellation passed.");
} finally {
  await browser.close(); server?.kill();
}
