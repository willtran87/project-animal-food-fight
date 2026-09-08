import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { baseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

const server = await ensureServer();
const browser = await loadPlaywright().chromium.launch({ headless: true });
const errors = [];
const output = path.join(repoRoot, "output", "user-feedback-polish");
fs.mkdirSync(output, { recursive: true });

async function openGame(viewport, mobile = false) {
  const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1 });
  await context.addInitScript(() => { window.requestAnimationFrame = () => 0; });
  const page = await context.newPage();
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/local-test-pages/game.html?seed=user-feedback-polish`);
  await page.waitForFunction(() => window.__foodAnimals, {}, { polling: 100 });
  const box = await page.locator("#game").boundingBox();
  const point = (x, y) => ({ x: box.x + x / 1024 * box.width, y: box.y + y / 640 * box.height });
  const click = async (x, y) => {
    const p = point(x, y);
    if (mobile) await page.touchscreen.tap(p.x, p.y);
    else await page.mouse.click(p.x, p.y);
    await page.evaluate(() => window.advanceTime(16));
  };
  return { page, context, click, point };
}

try {
  for (const [label, viewport, mobile] of [
    ["high", { width: 2560, height: 1600 }, false],
    ["desktop", { width: 1366, height: 768 }, false],
    ["mobile", { width: 390, height: 844 }, true],
  ]) {
    const { page, context, click, point } = await openGame(viewport, mobile);
    try {
      await page.evaluate(() => {
        const g = window.__foodAnimals, s = g.state;
        s.board.fill(null); s.bench.fill(null); s.itemBench.fill(null); s.drinks.fill(null);
        s.board[0] = g.makeUnit("toast_tortoise", 2);
        s.board[1] = g.makeUnit("toast_tortoise", 1);
        s.board[3] = g.makeUnit("toast_tortoise", 1);
        s.board[2] = g.makeUnit("taco_tiger", 2);
        s.drinks[0] = g.makeItem("bean_brew", 2);
        s.itemBench[4] = g.makeItem("maple_leaf", 1);
        s.bench[0] = g.makeUnit("mochi_mammoth", 1);
        window.advanceTime(16);
      });
      await click(382, 278);
      await click(70, 434);
      assert.deepEqual(await page.evaluate(() => window.__foodAnimals.state.selected), { area: "itemBench", index: 4 });
      assert.equal(await page.evaluate(() => window.__foodAnimals.state.board[0].item), null);
      await click(304, 278);
      await click(70, 434);
      assert.deepEqual(await page.evaluate(() => window.__foodAnimals.state.selected), { area: "itemBench", index: 4 });
      const bonuses = await page.evaluate(() => JSON.parse(window.render_game_to_text()).prepBonuses);
      assert.deepEqual(bonuses.fuelLinks.map((link) => link.boardIndex), [0, 1], "pair matching requires both class and lane");
      assert.deepEqual(bonuses.groups.find((group) => group.id === "breakfast").members, [0, 1, 3]);
      assert.equal(bonuses.groups.some((group) => group.id === "sweet"), false, "benched units must not activate class markers");
      await page.evaluate(() => {
        const g = window.__foodAnimals, s = g.state;
        s.board[1].ignoreTraits = true;
        s.drinks[3] = g.makeItem("bean_brew", 1);
      });
      const moved = await page.evaluate(() => JSON.parse(window.render_game_to_text()).prepBonuses);
      assert.deepEqual(moved.fuelLinks.map((link) => [link.fuelIndex, link.boardIndex]), [[0, 0], [3, 0], [3, 3]]);
      await page.evaluate(() => { window.__foodAnimals.state.board[1].ignoreTraits = false; });
      await click(382, 278);
      if (!mobile) {
        const from = point(70, 434), to = point(382, 278);
        await page.mouse.move(from.x, from.y); await page.mouse.down();
        await page.mouse.move(to.x, to.y, { steps: 8 }); await page.mouse.up();
        assert.equal(await page.evaluate(() => window.__foodAnimals.state.board[0].item?.id), "maple_leaf", "drag-to-equip must still work after click inspection changes");
      }
      await page.evaluate(() => {
        const g = window.__foodAnimals, s = g.state;
        s.board[0].item = g.makeItem("maple_leaf");
        s.board[1].item = g.makeItem("popcorn_kernel");
        s.board[2].item = g.makeItem("marshmallow_cube");
      });
      for (const horror of [false, true]) {
        await page.evaluate((horror) => {
          const s = window.__foodAnimals.state;
          s.realityOverride = horror; s.realityBroken = horror; s.realityBreakTimer = 0;
          s.selected = { area: "drinks", index: 0 }; s.hover = null; s.pointer = null;
          window.advanceTime(16);
        }, horror);
        await page.waitForTimeout(1000);
        await page.evaluate(() => window.advanceTime(16));
        await page.screenshot({ path: path.join(output, `${label}-${horror ? "horror" : "cozy"}-pairs.png`) });
        const diagnostics = await page.evaluate(() => JSON.parse(window.render_game_to_text()).rendering.recovery);
        assert.equal(diagnostics.errors, 0);
        if (horror) assert.ok(diagnostics.outlineCacheEntries >= 3, "equipped horror weapons must use cached outlines");
      }
      await page.evaluate(() => { window.__foodAnimals.state.selected = { area: "board", index: 0 }; window.advanceTime(16); });
      await page.screenshot({ path: path.join(output, `${label}-class-focus.png`) });
      if (mobile) {
        await page.evaluate(() => document.getElementById("game").dispatchEvent(new Event("contextlost")));
        const panel = await page.locator(".render-recovery section").boundingBox();
        assert.ok(panel.x >= 0 && panel.x + panel.width <= viewport.width, "mobile recovery controls must fit the viewport");
        for (const button of await page.locator(".render-recovery button").all()) {
          const bounds = await button.boundingBox();
          assert.ok(bounds.height >= 44, "recovery controls must retain touch targets");
          assert.ok(bounds.y >= 0 && bounds.y + bounds.height <= viewport.height);
        }
        await page.screenshot({ path: path.join(output, "mobile-display-recovery.png") });
        await page.evaluate(() => document.getElementById("game").dispatchEvent(new Event("contextrestored")));
        assert.equal(await page.locator(".render-recovery").isVisible(), false);
      }
      console.log(`PASS: ${label} selection, pairing, and weapon rendering`);
    } finally { await context.close(); }
  }

  const { page, context } = await openGame({ width: 1366, height: 768 });
  try {
    const before = await page.evaluate(() => {
      const g = window.__foodAnimals;
      g.state.board[0] = g.makeUnit("taco_tiger", 2);
      g.startBattle(); g.state.phaseTransition = null;
      const canvas = document.getElementById("game");
      const event = new Event("contextlost", { cancelable: true });
      canvas.dispatchEvent(event);
      return { elapsed: g.state.battle.elapsed, canceled: event.defaultPrevented, gold: g.state.gold, hp: g.state.battle.allies[0].hp };
    });
    assert.equal(before.canceled, false, "2D context loss must not prevent browser restoration");
    await page.evaluate(() => window.advanceTime(3000));
    assert.equal(await page.evaluate(() => window.__foodAnimals.state.battle.elapsed), before.elapsed, "invisible combat must pause");
    assert.equal(await page.locator(".render-recovery").isVisible(), true);
    assert.equal(await page.getByRole("button", { name: "Retry display" }).isDisabled(), true);
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Download diagnostics" }).click();
    const download = await downloadPromise;
    const report = JSON.parse(fs.readFileSync(await download.path(), "utf8"));
    assert.equal(report.paused, true);
    assert.equal(report.losses, 1);
    assert.ok(report.events.some((event) => event.type === "context-lost"));
    assert.equal(typeof report.userAgent, "string");
    await page.screenshot({ path: path.join(output, "display-recovery.png") });
    await page.evaluate(() => document.getElementById("game").dispatchEvent(new Event("contextrestored")));
    assert.equal(await page.locator(".render-recovery").isVisible(), false);
    const after = await page.evaluate(() => ({ gold: window.__foodAnimals.state.gold, hp: window.__foodAnimals.state.battle.allies[0].hp,
      diagnostics: JSON.parse(window.render_game_to_text()).rendering.recovery }));
    assert.equal(after.gold, before.gold); assert.equal(after.hp, before.hp);
    assert.equal(after.diagnostics.restorations, 1);
    const visiblePixels = await page.evaluate(() => {
      const canvas = document.getElementById("game");
      const data = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
      let visible = 0;
      for (let i = 0; i < data.length; i += 400) if (data[i] + data[i + 1] + data[i + 2] > 30 && data[i + 3]) visible += 1;
      return visible;
    });
    assert.ok(visiblePixels > 100, "restoration must repaint a nonblank game frame");
    await page.evaluate(() => {
      const ctx = document.getElementById("game").getContext("2d");
      window.__originalDrawImage = ctx.drawImage;
      ctx.drawImage = () => { throw new Error("Injected renderer failure"); };
      window.advanceTime(16);
    });
    await page.waitForTimeout(350);
    assert.equal(await page.evaluate(() => JSON.parse(window.render_game_to_text()).rendering.recovery.errors), 2, "only one automatic retry is permitted");
    await page.waitForTimeout(350);
    assert.equal(await page.evaluate(() => JSON.parse(window.render_game_to_text()).rendering.recovery.errors), 2);
    await page.evaluate(() => { document.getElementById("game").getContext("2d").drawImage = window.__originalDrawImage; });
    await page.getByRole("button", { name: "Retry display" }).click();
    assert.equal(await page.locator(".render-recovery").isVisible(), false);
    await page.evaluate(() => window.advanceTime(100));
    assert.ok(await page.evaluate((elapsed) => window.__foodAnimals.state.battle.elapsed > elapsed, before.elapsed));
    console.log("PASS: context recovery, paused combat, bounded retries, and manual recovery");
  } finally { await context.close(); }
  assert.deepEqual(errors, []);
} finally { await browser.close(); server?.kill(); }
