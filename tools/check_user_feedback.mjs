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
      const counts = (pairs) => Object.fromEntries(pairs.map((pair) => [pair.id, pair.count]));
      assert.deepEqual(counts(bonuses.fuelPairings[0]), { breakfast: 2, bakery: 2 }, "dual-type units contribute to each matching type");
      assert.deepEqual(counts(bonuses.unitPairings[0]), { breakfast: 1, bakery: 1 }, "one fuel is counted once per matching type");
      assert.deepEqual(bonuses.unitPairings[2], [], "out-of-type units must have no pairing badges");
      await page.evaluate(() => {
        const g = window.__foodAnimals, s = g.state;
        s.board[1].ignoreTraits = true;
        s.drinks[3] = g.makeItem("bean_brew", 1);
      });
      const moved = await page.evaluate(() => JSON.parse(window.render_game_to_text()).prepBonuses);
      assert.deepEqual(moved.fuelLinks.map((link) => [link.fuelIndex, link.boardIndex]), [[0, 0], [3, 0], [3, 3]]);
      assert.deepEqual(counts(moved.unitPairings[0]), { breakfast: 2, bakery: 2 }, "row and column fuels are counted separately within each type");
      assert.deepEqual(counts(moved.fuelPairings[0]), { breakfast: 1, bakery: 1 });
      assert.deepEqual(counts(moved.fuelPairings[3]), { breakfast: 2, bakery: 2 });
      assert.deepEqual(moved.unitPairings[1], [], "trait-disabled units cannot retain stale pairing counts");
      const changed = await page.evaluate(() => {
        const s = window.__foodAnimals.state, unit = s.board[1], traits = unit.traits;
        unit.ignoreTraits = false;
        unit.traits = ["breakfast"];
        const mixed = JSON.parse(window.render_game_to_text()).prepBonuses;
        const fuel = s.drinks[0]; s.drinks[0] = null;
        const removed = JSON.parse(window.render_game_to_text()).prepBonuses;
        s.drinks[0] = fuel; unit.traits = traits;
        return { mixed, removed };
      });
      assert.deepEqual(counts(changed.mixed.fuelPairings[0]), { breakfast: 2, bakery: 1 }, "each type must have its own count, not the lane total");
      assert.deepEqual(counts(changed.mixed.unitPairings[1]), { breakfast: 1 });
      assert.deepEqual(changed.removed.fuelPairings[0], [], "removing fuel clears its badges");
      assert.deepEqual(changed.removed.unitPairings[1], [], "removing fuel clears recipient badges");
      assert.deepEqual(counts(changed.removed.unitPairings[0]), { breakfast: 1, bakery: 1 }, "other active fuels remain counted");
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
        s.itemBench[0] = g.makeItem("butter_pat");
        s.shop[0] = g.makeItem("bean_brew");
        const cards = window.FoodAnimalsCardCanvas, layout = cards.traitChipLayout;
        window.__pairingChips = [];
        const ctx = document.getElementById("game").getContext("2d"), fillText = ctx.fillText, fill = ctx.fill;
        let lastFill = null;
        ctx.fill = function (...args) {
          lastFill = this.fillStyle;
          return fill.apply(this, args);
        };
        window.__activePairDraws = [];
        ctx.fillText = function (text, x, y, ...args) {
          if (/^[A-Z]{2} [1-3]$/.test(text) && /^900 7px /.test(this.font)) window.__activePairDraws.push({ text, x, y, color: lastFill });
          return fillText.call(this, text, x, y, ...args);
        };
        cards.traitChipLayout = function (traits, x, y, maxWidth, options) {
          const result = layout(traits, x, y, maxWidth, options);
          if (options.pairingItem) {
            window.__pairingChips.push({ id: options.pairingItem.id, traits, x, y, maxWidth, chips: result.chips });
          }
          return result;
        };
        const assets = window.FoodAnimalsRuntimeAssets, original = assets.outlinedImage;
        window.__outlineSamples = [];
        window.__outlineReuse = new Map();
        window.__outlineCanvases = new WeakMap();
        assets.outlinedImage = function (image, cache, options) {
          const result = original(image, cache, options);
          const key = image.src + JSON.stringify(options.crop || null);
          const previous = window.__outlineReuse.get(key);
          window.__outlineSamples.push({ src: image.src, cropped: Boolean(options.crop), reused: previous === result });
          window.__outlineReuse.set(key, result);
          if (result) window.__outlineCanvases.set(result.canvas, image.src);
          return result;
        };
      });
      for (const horror of [false, true]) {
        await page.evaluate((horror) => {
          const s = window.__foodAnimals.state;
          s.realityOverride = horror; s.realityBroken = horror; s.realityBreakTimer = 0;
          s.selected = { area: "drinks", index: 0 }; s.hover = null; s.pointer = null;
          window.advanceTime(16);
        }, horror);
        const pairingLayouts = await page.evaluate(() => {
          const g = window.__foodAnimals, s = g.state;
          const shopItem = s.shop[0];
          const results = [];
          for (const item of Object.values(window.FoodAnimalsItemData.ITEMS).filter((entry) => entry.pairTraits?.length)) {
            s.shop[0] = g.makeItem(item.id);
            s.selected = { area: "shop", index: 0 };
            window.__pairingChips = [];
            window.advanceTime(16);
            results.push({ id: item.id, traits: item.pairTraits, layouts: window.__pairingChips });
          }
          s.shop[0] = shopItem;
          s.selected = { area: "drinks", index: 0 };
          window.__pairingChips = [];
          window.advanceTime(16);
          return { results, labels: JSON.parse(window.render_game_to_text()).traits, selected: window.__pairingChips };
        });
        assert.ok(pairingLayouts.results.length >= 21, "exercise every drink/fuel pairing");
        for (const { id, traits, layouts } of pairingLayouts.results) {
          assert.equal(layouts.length, 2, `${id}: pairing pills appear in both shop and selected info`);
          for (const layout of layouts) {
            assert.equal(layout.id, id);
            assert.deepEqual(layout.chips.map((chip) => chip.traitId), traits, `${id}: no pairing type may be clipped or omitted: ${JSON.stringify(layout)}`);
            for (const chip of layout.chips) {
              assert.equal(chip.text, pairingLayouts.labels[chip.traitId].label, "pills follow cozy/horror type names");
              assert.ok(chip.x >= layout.x && chip.x + chip.w <= layout.x + layout.maxWidth, "pills fit their reserved row");
              assert.equal(chip.y, layout.y, "pills must not wrap into stats or price rows");
            }
          }
        }
        assert.equal(pairingLayouts.selected.length, 2, "deployed fuel retains its info-panel pills without hovering");
        await page.waitForTimeout(1000);
        const outlines = await page.evaluate(() => {
          window.__outlineSamples = [];
          window.__activePairDraws = [];
          window.advanceTime(16);
          const s = window.__foodAnimals.state;
          const fuelSrc = new URL(window.__foodAnimals.itemSpriteSrcFor(s.drinks[0]), document.baseURI).href;
          const looseWeaponSrc = new URL(window.__foodAnimals.itemSpriteSrcFor(s.itemBench[0]), document.baseURI).href;
          return { samples: window.__outlineSamples, fuelSrc, looseWeaponSrc };
        });
        const activePairs = await page.evaluate(() => ({
          draws: window.__activePairDraws,
          summary: JSON.parse(window.render_game_to_text()).prepBonuses,
        }));
        const expectedPairs = [...activePairs.summary.unitPairings, ...activePairs.summary.fuelPairings].flat();
        assert.equal(activePairs.draws.length, expectedPairs.length, "every active type must render its own badge without an aggregate count");
        for (const pair of expectedPairs) {
          assert.ok(activePairs.draws.some((draw) => draw.text === `${pair.short} ${pair.count}` && draw.color === pair.color.toLowerCase()), "badge labels contain both type and count on the matching theme color");
        }
        await page.screenshot({ path: path.join(output, `${label}-${horror ? "horror" : "cozy"}-pairs.png`) });
        const diagnostics = await page.evaluate(() => JSON.parse(window.render_game_to_text()).rendering.recovery);
        assert.equal(diagnostics.errors, 0);
        if (horror) {
          assert.ok(diagnostics.outlineCacheEntries >= 3 && diagnostics.outlineCacheEntries <= 64);
          assert.ok(outlines.samples.some((sample) => sample.cropped), "horror units must outline their cropped sprite bounds");
          assert.ok(outlines.samples.some((sample) => sample.src === outlines.fuelSrc), "horror fuel must use the outline treatment");
          assert.ok(outlines.samples.some((sample) => sample.src === outlines.looseWeaponSrc), "unequipped horror weapons must have outlines in storage");
          assert.ok(outlines.samples.some((sample) => sample.reused), "outlines must reuse cached canvases");
        } else assert.equal(outlines.samples.length, 0, "cozy prep must retain its original art");
        if (horror) {
          await page.evaluate(() => {
            window.__foodAnimals.state.selected = { area: "itemBench", index: 0 };
            window.__outlineSamples = [];
            window.advanceTime(16);
          });
          assert.ok(await page.evaluate((src) => window.__outlineSamples.filter((sample) => sample.src === src).length >= 2, outlines.looseWeaponSrc),
            "stored weapon and its info preview must both use outlines");
          await page.screenshot({ path: path.join(output, `${label}-horror-loose-weapon.png`) });
        }
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
      await page.evaluate(() => {
        const g = window.__foodAnimals;
        g.startBattle(); g.state.phaseTransition = null;
        window.advanceTime(16);
      });
      await page.waitForTimeout(1000);
      const battleOutlines = await page.evaluate(() => {
        window.__outlineSamples = [];
        window.advanceTime(16);
        return window.__outlineSamples;
      });
      assert.ok(battleOutlines.some((sample) => sample.cropped), "moving combat units must retain outlines");
      assert.ok(battleOutlines.some((sample) => !sample.cropped), "combat fuel and equipment must retain outlines");
      await page.screenshot({ path: path.join(output, `${label}-horror-battle-outlines.png`) });
      await page.evaluate(() => {
        const battle = window.__foodAnimals.state.battle;
        window.__defeatedFixtures = [battle.allies[0], battle.enemies[0]];
        for (const unit of window.__defeatedFixtures) {
          unit.dead = true; unit.hp = 0; unit.visualHp = 0; unit.visualDefeatPending = false;
        }
        const ctx = document.getElementById("game").getContext("2d"), drawImage = ctx.drawImage;
        window.__defeatOutlineDraws = [];
        ctx.drawImage = function (image, ...args) {
          const src = window.__outlineCanvases.get(image);
          if (src) window.__defeatOutlineDraws.push({ src, facing: Math.sign(this.getTransform().a), alpha: this.globalAlpha });
          return drawImage.call(this, image, ...args);
        };
      });
      for (const horror of [true, false]) {
        await page.evaluate((horror) => {
          const s = window.__foodAnimals.state;
          s.realityOverride = horror; s.realityBroken = horror; s.realityBreakTimer = 0;
          window.advanceTime(16);
        }, horror);
        await page.waitForTimeout(1000);
        const defeated = await page.evaluate((horror) => {
          window.__outlineSamples = []; window.__defeatOutlineDraws = [];
          window.advanceTime(16);
          const data = window.FoodAnimalsUnitData;
          const tierSrc = (entry, tier) => typeof entry === "string" ? entry : entry?.[tier] || entry?.[Math.min(4, tier)] || entry?.[1];
          const fixtures = window.__defeatedFixtures.map((unit) => {
            const src = (horror && tierSrc(data.REALITY_DEFEAT_STILL_SPRITES[unit.typeId], unit.tier)) || tierSrc(data.DEFEAT_STILL_SPRITES[unit.typeId], unit.tier);
            return { side: unit.side, src: new URL(src, document.baseURI).href };
          });
          return { fixtures, samples: window.__outlineSamples, draws: window.__defeatOutlineDraws };
        }, horror);
        for (const fixture of defeated.fixtures) {
          const draws = defeated.draws.filter((draw) => draw.src === fixture.src);
          if (horror) {
            assert.ok(draws.length, `${fixture.side} defeated horror sprite must draw an outline`);
            assert.ok(draws.some((draw) => draw.facing === (fixture.side === "ally" ? -1 : 1) && Math.abs(draw.alpha - 0.86) < 0.001), "each side's defeat outline must retain facing and fade, including shared sprite assets");
            assert.ok(defeated.samples.some((sample) => sample.src === fixture.src && sample.cropped && sample.reused), "defeat outlines must reuse the cropped outline cache");
          } else assert.equal(draws.length, 0, "cozy defeated sprites must stay unoutlined");
        }
        await page.screenshot({ path: path.join(output, `${label}-${horror ? "horror" : "cozy"}-defeated-outlines.png`) });
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
