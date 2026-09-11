import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { baseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

const server = await ensureServer();
const browser = await loadPlaywright().chromium.launch({ headless: true });
const output = path.join(repoRoot, "output", "team-intel");
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
    await page.goto(`${baseUrl}/local-test-pages/game.html?smoke=basic&seed=team-intel`);
    await page.waitForFunction(() => window.__foodAnimals, {}, { polling: 100 });
    const box = await page.locator("#game").boundingBox();
    const point = (x, y) => ({ x: box.x + x / 1024 * box.width, y: box.y + y / 640 * box.height });
    const snapshot = () => page.evaluate(() => JSON.parse(window.render_game_to_text()));
    const tick = () => page.evaluate(() => window.advanceTime(16));
    const key = async (key) => { await page.keyboard.press(key); await tick(); };
    await page.evaluate(() => {
      const g = window.__foodAnimals, s = g.state;
      const ids = Object.keys(JSON.parse(window.render_game_to_text()).traits);
      s.board = s.board.map((_, i) => {
        const unit = g.makeUnit("toast_tortoise", 1);
        unit.traits = [ids[i % 8], ids[(i + 1) % 8]];
        return unit;
      });
      s.drinks = s.drinks.map((_, i) => g.makeItem(Object.values(window.FoodAnimalsItemData.ITEMS).filter((item) => item.pairTraits?.length)[i].id));
      s.arenaHoldNotice = { arenaShort: "Test" };
      s.arenaScout = { arenaShort: "Test", shopsRemaining: 2, traitIds: ["breakfast", "bakery"] };
      s.arenaPrepBuff = { arenaShort: "Test", traitIds: ["breakfast", "bakery"] };
      s.selected = null; s.hover = null; s.pointer = null;
      const ctx = document.getElementById("game").getContext("2d"), original = ctx.fillText;
      window.__intelText = [];
      ctx.fillText = function (text, x, y, ...args) {
        if (x >= 690 && x <= 976 && y >= 296 && y <= 624) window.__intelText.push(String(text));
        return original.call(this, text, x, y, ...args);
      };
      window.advanceTime(16);
    });
    for (const horror of [false, true]) {
      await page.evaluate((horror) => {
        const s = window.__foodAnimals.state;
        s.realityOverride = horror; s.realityBroken = horror; s.realityBreakTimer = 0;
        window.__intelText = [];
      }, horror);
      await key("Home");
      await page.waitForTimeout(700);
      await tick();
      const initial = await snapshot();
      assert.equal(initial.prepBonuses.groups.length, 8, "fixture must activate all eight types");
      assert.ok(initial.teamIntel.maxScroll > 0);
      assert.equal(initial.teamIntel.offset, 0);
      await page.screenshot({ path: path.join(output, `${label}-${horror ? "horror" : "cozy"}-top.png`) });
      const max = initial.teamIntel.maxScroll;
      for (let offset = 0; offset < max; offset += 180) {
        const p = point(860, 460);
        await page.locator("#game").dispatchEvent("wheel", { clientX: p.x, clientY: p.y, deltaY: 180, deltaMode: 0 });
        await tick();
        if (offset === 180) await page.screenshot({ path: path.join(output, `${label}-${horror ? "horror" : "cozy"}-pairings.png`) });
      }
      await key("End");
      const end = await snapshot();
      assert.equal(end.teamIntel.offset, end.teamIntel.maxScroll, "bottom remains reachable");
      await page.screenshot({ path: path.join(output, `${label}-${horror ? "horror" : "cozy"}-bottom.png`) });
      const text = await page.evaluate(() => window.__intelText);
      for (const trait of initial.prepBonuses.groups) assert.ok(text.includes(`${trait.label} ${trait.count}`), `missing active trait ${trait.label}`);
      for (const pair of initial.prepBonuses.teamPairings) assert.ok(text.includes(pair.label), `missing pairing type ${pair.label}`);
      for (const value of ["DPS", "EFF", "DoT", "HP", "SHLD", "SUS/s", "Active pairings", "HOLD", "SCOUT", "PREP"]) assert.ok(text.includes(value), `existing/new intel must remain reachable: ${value}`);
      for (const effect of initial.arena.effects) assert.ok(text.includes(effect.text), "all arena effects remain reachable");
      await key("Home");
      if (mobile) {
        const cdp = await context.newCDPSession(page);
        const start = point(850, 565), finish = point(850, 365);
        await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ ...start, id: 0 }] });
        await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ ...finish, id: 0 }] });
        await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
        await tick();
        assert.ok((await snapshot()).teamIntel.offset > 100, "touch swipes must scroll the intel body");
        assert.equal(await page.evaluate(() => window.__foodAnimals.state.drag), null, "intel scrolling must not drag game pieces");
        await cdp.detach();
      } else {
        const thumb = (await snapshot()).teamIntel.thumb;
        const start = point(thumb.x + 6, thumb.y + 8), finish = point(thumb.x + 6, 600);
        await page.mouse.move(start.x, start.y); await page.mouse.down();
        await page.mouse.move(finish.x, finish.y, { steps: 4 }); await page.mouse.up(); await tick();
        assert.ok((await snapshot()).teamIntel.offset > 100, "scrollbar must be draggable");
      }
      const unit = point(382, 278);
      if (mobile) await page.touchscreen.tap(unit.x, unit.y); else await page.mouse.click(unit.x, unit.y);
      await tick();
      assert.equal((await snapshot()).teamIntel, null, "selected-item panel must retain input ownership");
      await page.evaluate(() => { window.__foodAnimals.state.selected = null; window.__foodAnimals.state.hover = null; });
    }
    await page.evaluate(() => {
      const s = window.__foodAnimals.state;
      s.board.fill(null); s.drinks.fill(null); s.selected = null; s.hover = null;
      window.__intelText = []; window.advanceTime(16);
    });
    await key("Home");
    const emptyText = await page.evaluate(() => window.__intelText);
    assert.ok(emptyText.includes("No active traits"));
    assert.ok(emptyText.includes("No active pairings"));
    console.log(`PASS: ${label} complete intel, per-type pairings, scrolling, selection, and empty states`);
    await context.close();
  }
  assert.deepEqual(errors, []);
} finally { await browser.close(); server?.kill(); }
