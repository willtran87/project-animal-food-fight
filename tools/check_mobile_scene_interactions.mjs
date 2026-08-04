import fs from "node:fs";
import path from "node:path";
import { baseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

const { chromium } = loadPlaywright();
const outputDir = path.join(repoRoot, "output", "mobile-scene-interactions");
fs.mkdirSync(outputDir, { recursive: true });

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
  const canvasMetrics = await page.evaluate(() => {
    const canvas = document.querySelector("#game");
    const rect = canvas.getBoundingClientRect();
    return {
      width: canvas.width,
      height: canvas.height,
      displayWidth: rect.width,
      displayHeight: rect.height,
      devicePixelRatio: window.devicePixelRatio || 1,
    };
  });
  const requiredWidth = canvasMetrics.displayWidth * canvasMetrics.devicePixelRatio;
  const requiredHeight = canvasMetrics.displayHeight * canvasMetrics.devicePixelRatio;
  const requiredArea = requiredWidth * requiredHeight;
  const bitmapArea = canvasMetrics.width * canvasMetrics.height;
  assert(canvasMetrics.width + 1 >= requiredWidth, "Mobile canvas backing width must remain DPR-sharp");
  assert(canvasMetrics.height + 1 >= requiredHeight, "Mobile canvas backing height must remain DPR-sharp");
  assert(bitmapArea <= requiredArea * 1.15, "Mobile canvas must not rasterize more than 15% beyond its displayed DPR area");
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
      const stage = document.querySelector(".vn-stage").getBoundingClientRect();
      const panel = document.querySelector(".dialogue-panel").getBoundingClientRect();
      const buttons = [...document.querySelectorAll(".vn-button")].map((button) => button.getBoundingClientRect().toJSON());
      const textStyle = getComputedStyle(document.querySelector(".dialogue-text"));
      return { stage: stage.toJSON(), panel: panel.toJSON(), buttons, textFontSize: Number.parseFloat(textStyle.fontSize) };
    });
    assert(layout.stage.height >= 800, "Opening story stage must use the available portrait height on mobile");
    assert(layout.textFontSize >= 16, "Opening dialogue must remain at least 16 CSS pixels on mobile");
    assert(layout.buttons.every((button) => button.height >= 44), "Opening controls must remain at least 44 CSS pixels tall on mobile");
    assert(layout.buttons.every((button) => button.top >= layout.panel.top && button.bottom <= layout.panel.bottom), "Opening controls must remain inside the dialogue panel");
    await page.screenshot({ path: path.join(outputDir, "opening-portrait.png"), fullPage: true });

    for (let i = 0; i < 2; i++) {
      await page.locator('[data-action="skip"]').click();
      await page.waitForTimeout(25);
    }
    await page.waitForFunction(() => JSON.parse(window.render_game_to_text()).phase === "tutorial");
    await page.screenshot({ path: path.join(outputDir, "tutorial-portrait.png"), fullPage: true });
    for (let i = 0; i < 2; i++) {
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
    await page.waitForSelector("#mobile-story-ui:not([hidden])");
    const layout = await page.evaluate(() => {
      const overlay = document.querySelector("#mobile-story-ui").getBoundingClientRect();
      const text = document.querySelector(".mobile-story-text");
      const buttons = [...document.querySelectorAll("[data-mobile-story-action]")].map((button) => button.getBoundingClientRect().toJSON());
      return {
        overlay: overlay.toJSON(),
        buttons,
        textFontSize: Number.parseFloat(getComputedStyle(text).fontSize),
      };
    });
    assert(layout.overlay.height >= 800, "Mobile story presentation must fill the phone viewport");
    assert(layout.textFontSize >= 16, "Mobile story text must remain at least 16 CSS pixels");
    assert(layout.buttons.every((button) => button.height >= 44), "Mobile story controls must remain at least 44 CSS pixels tall");
    await page.screenshot({ path: path.join(outputDir, "story-level10-portrait.png"), fullPage: true });
    const before = JSON.parse(await page.evaluate(() => window.render_game_to_text())).story.index;
    await page.locator('[data-mobile-story-action="advance"]').click();
    const after = JSON.parse(await page.evaluate(() => window.render_game_to_text())).story.index;
    assert(after === before + 1, "The mobile story Next control did not advance dialogue");
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
