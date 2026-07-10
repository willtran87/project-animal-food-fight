import { baseUrl, ensureServer, loadPlaywright } from "./visual-check-helpers.mjs";

const { chromium } = loadPlaywright();

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function cssPoint(box, x, y) {
  return {
    x: box.x + (x / 1024) * box.width,
    y: box.y + (y / 640) * box.height,
  };
}

async function openGame(context, path) {
  const page = await context.newPage();
  await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__foodAnimals?.state && typeof window.advanceTime === "function");
  await page.evaluate(() => window.advanceTime(1000));
  return page;
}

const server = await ensureServer("/local-test-pages/opening-vn.html");
const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 390, height: 844 },
  screen: { width: 390, height: 844 },
  isMobile: true,
  hasTouch: true,
  deviceScaleFactor: 3,
});

try {
  {
    const page = await context.newPage();
    await page.goto(`${baseUrl}/local-test-pages/opening-vn.html`, { waitUntil: "domcontentloaded" });
    await page.waitForSelector('[data-action="next"]');
    const layout = await page.evaluate(() => {
      const panel = document.querySelector(".dialogue-panel").getBoundingClientRect();
      const buttons = [...document.querySelectorAll(".vn-button")].map((button) => button.getBoundingClientRect().toJSON());
      return { panel: panel.toJSON(), buttons };
    });
    assert(layout.buttons.every((button) => button.height >= 44), "Opening controls must remain at least 44 CSS pixels tall on mobile");
    assert(layout.buttons.every((button) => button.top >= layout.panel.top && button.bottom <= layout.panel.bottom), "Opening controls must remain inside the dialogue panel");

    for (let i = 0; i < 4; i++) {
      await page.locator('[data-action="skip"]').click();
      await page.waitForTimeout(25);
    }
    assert(JSON.parse(await page.evaluate(() => window.render_game_to_text())).phase === "complete", "Opening skip flow did not reach completion");
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pagehide", { persisted: true })));
    await page.waitForTimeout(900);
    await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent("pageshow", { persisted: true })));
    await page.waitForURL(/game\.html/, { timeout: 3000 });
    await page.close();
  }

  {
    const page = await openGame(context, "/local-test-pages/game.html?screen=conversation&story=level10&reality=horror");
    const box = await page.locator("#game").boundingBox();
    const before = JSON.parse(await page.evaluate(() => window.render_game_to_text())).story.index;
    const panelPoint = cssPoint(box, 300, 520);
    await page.touchscreen.tap(panelPoint.x, panelPoint.y);
    const after = JSON.parse(await page.evaluate(() => window.render_game_to_text())).story.index;
    assert(after === before + 1, "Touching the mobile story panel did not advance dialogue");
    await page.close();
  }

  {
    const page = await openGame(context, "/local-test-pages/game.html?screen=level-10-cutscene&reality=horror");
    const box = await page.locator("#game").boundingBox();
    const before = await page.evaluate(() => window.__foodAnimals.state.level10RevealCutscene.elapsed);
    const scenePoint = cssPoint(box, 500, 300);
    await page.touchscreen.tap(scenePoint.x, scenePoint.y);
    const after = await page.evaluate(() => window.__foodAnimals.state.level10RevealCutscene.elapsed);
    assert(after > before + 1, "Touching the mobile level-10 scene did not advance the cutscene");
    await page.close();
  }

  {
    const page = await openGame(context, "/local-test-pages/game.html?screen=victory-epilogue&stage=ideal&reality=horror");
    const box = await page.locator("#game").boundingBox();
    const visualTop = cssPoint(box, 422, 544).y;
    const expandedPoint = { x: cssPoint(box, 512, 544).x, y: visualTop - 12 };
    await page.touchscreen.tap(expandedPoint.x, expandedPoint.y);
    assert(await page.evaluate(() => Boolean(window.__foodAnimals.state.menuRebootTransition)), "Expanded mobile victory target did not start the return transition");
    await page.close();
  }

  {
    const page = await openGame(context, "/local-test-pages/game.html?screen=opening-tutorial-shop");
    const box = await page.locator("#game").boundingBox();
    const unitPoint = cssPoint(box, 382, 278);
    await page.evaluate(() => {
      document.querySelector("#game").setPointerCapture = () => {};
    });
    await page.mouse.move(unitPoint.x, unitPoint.y);
    await page.mouse.down();
    assert(await page.evaluate(() => Boolean(window.__foodAnimals.state.drag)), "Mobile drag fixture did not start");
    await page.mouse.move(box.x - 5, box.y - 5);
    assert(!await page.evaluate(() => Boolean(window.__foodAnimals.state.drag)), "Pointer leave did not cancel the active drag");
    await page.mouse.up();
    await page.close();
  }

  console.log("Mobile scene interaction checks passed.");
} finally {
  await browser.close();
  server?.kill();
}
