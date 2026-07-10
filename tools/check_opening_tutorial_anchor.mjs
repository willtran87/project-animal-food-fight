import fs from "node:fs";
import path from "node:path";
import { assertNear, baseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

const outputDir = path.join(repoRoot, "output", "opening-tutorial-anchor-check");
const GAME_CANVAS_SIZE = { width: 1024, height: 640 };
const HIGHLIGHT_TARGETS = [
  ["hud", "hud", { x: 6, y: 0, w: 370, h: 60 }],
  ["shop", "shop", { x: 0, y: 61, w: 357, h: 170 }],
  ["locked-slot", "locked-slot", { x: 351, y: 61, w: 94, h: 170 }],
  ["stall", "stall", { x: 710, y: 50, w: 278, h: 218 }],
  ["storage-cluster", "storage", { x: 32, y: 242, w: 154, h: 306 }],
  ["board", "board", { x: 346, y: 242, w: 228, h: 228 }],
  ["traits", "traits", { x: 670, y: 244, w: 338, h: 286 }],
  ["freeze", "freeze", { x: 62, y: 67, w: 290, h: 30 }],
  ["reroll", "reroll", { x: 769, y: 0, w: 124, h: 64 }],
  ["upgrade", "upgrade", { x: 644, y: 0, w: 124, h: 64 }],
  ["battle", "battle", { x: 894, y: 0, w: 124, h: 64 }],
];

async function enterTutorial(page, label, viewport) {
  await page.setViewportSize(viewport);
  await page.goto(`${baseUrl}/local-test-pages/opening-vn.html?anchor-check=${label}-${Date.now()}`, {
    waitUntil: "load",
  });
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Skip" }).click();
  await page.getByRole("button", { name: "Confirm Skip" }).click();
  await page.waitForFunction(
    () => !document.querySelector(".scene-transition-curtain")?.classList.contains("is-tutorial-entering"),
    null,
    { timeout: 3000 },
  );
  await page.waitForTimeout(50);
}

async function collectMetrics(page) {
  return page.evaluate(() => {
    const localRectFor = (selector, root = document) => {
      const el = root.querySelector(selector);
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
    const transformFor = (selector) => {
      const el = document.querySelector(selector);
      return el ? getComputedStyle(el).transform : null;
    };
    const stage = document.querySelector(".vn-stage")?.getBoundingClientRect();
    const shop = document.querySelector(".tutorial-shop")?.getBoundingClientRect();
    const dialogue = document.querySelector(".dialogue-panel")?.getBoundingClientRect();
    const iframe = document.querySelector(".actual-shop-frame");
    const iframeRect = iframe?.getBoundingClientRect();
    const frameDoc = iframe?.contentDocument;
    const frameWin = iframe?.contentWindow;
    const canvas = frameDoc?.querySelector("#game");
    const canvasStyle = canvas ? getComputedStyle(canvas) : null;

    return {
      viewport: { width: innerWidth, height: innerHeight },
      pageScroll: {
        x: scrollX,
        y: scrollY,
        scrollWidth: document.documentElement.scrollWidth,
        clientWidth: document.documentElement.clientWidth,
      },
      phase: document.querySelector(".vn-stage")?.dataset.phase,
      tutorialStep: document.querySelector(".vn-stage")?.dataset.tutorialStep,
      stage: localRectFor(".vn-stage"),
      tutorialShop: localRectFor(".tutorial-shop"),
      iframe: localRectFor(".actual-shop-frame"),
      dialogue: localRectFor(".dialogue-panel"),
      relative: stage && shop && dialogue
        ? {
            shopTop: Math.round(shop.top - stage.top),
            shopBottomGap: Math.round(stage.bottom - shop.bottom),
            iframeTop: iframeRect ? Math.round(iframeRect.top - stage.top) : null,
            iframeBottomGap: iframeRect ? Math.round(stage.bottom - iframeRect.bottom) : null,
            dialogueBottomGap: Math.round(stage.bottom - dialogue.bottom),
          }
        : null,
      transforms: {
        tutorialShop: transformFor(".tutorial-shop"),
        dialogue: transformFor(".dialogue-panel"),
        player: transformFor(".player-standee"),
        tabs: transformFor(".tabs-counter"),
      },
      iframeDoc: frameDoc
        ? {
            embed: frameDoc.documentElement.dataset.embed || null,
            viewport: { width: frameWin.innerWidth, height: frameWin.innerHeight },
            body: localRectFor("body", frameDoc),
            shell: localRectFor("#game-shell", frameDoc),
            canvas: localRectFor("#game", frameDoc),
            canvasStyle: canvasStyle
              ? {
                  width: canvasStyle.width,
                  height: canvasStyle.height,
                  border: canvasStyle.borderTopWidth,
                  boxShadow: canvasStyle.boxShadow,
                }
              : null,
          }
        : null,
    };
  });
}

async function advanceToTutorialStep(page, step, label) {
  for (let guard = 0; guard < 80; guard += 1) {
    const current = await page.evaluate(() => document.querySelector(".vn-stage")?.dataset.tutorialStep || "");
    if (current === step) return;
    await page.getByRole("button", { name: "Continue" }).click();
    await page.waitForTimeout(90);
  }
  throw new Error(`${label}: could not advance to tutorial step ${step}`);
}

async function collectHighlightMetrics(page, step, highlightClass) {
  return page.evaluate(({ step, highlightClass, canvasSize }) => {
    const rectFor = (selector) => {
      const el = document.querySelector(selector);
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height };
    };
    const active = rectFor(`.actual-highlight.${highlightClass}`);
    const iframe = rectFor(".actual-shop-frame");
    const opacity = getComputedStyle(document.querySelector(`.actual-highlight.${highlightClass}`)).opacity;
    const toCanvasRect = (rect) => {
      if (!rect || !iframe) return null;
      return {
        x: ((rect.x - iframe.x) / iframe.w) * canvasSize.width,
        y: ((rect.y - iframe.y) / iframe.h) * canvasSize.height,
        w: (rect.w / iframe.w) * canvasSize.width,
        h: (rect.h / iframe.h) * canvasSize.height,
      };
    };
    return {
      step,
      pageStep: document.querySelector(".vn-stage")?.dataset.tutorialStep || "",
      opacity,
      iframe,
      active,
      canvasRect: toCanvasRect(active),
    };
  }, { step, highlightClass, canvasSize: GAME_CANVAS_SIZE });
}

async function assertHighlightTargets(page, label, viewport) {
  await enterTutorial(page, `${label}-highlights`, viewport);
  const metrics = [];
  for (const [step, highlightClass, expected] of HIGHLIGHT_TARGETS) {
    await advanceToTutorialStep(page, step, label);
    await page.waitForTimeout(180);
    const result = await collectHighlightMetrics(page, step, highlightClass);
    metrics.push(result);
    if (result.pageStep !== step) throw new Error(`${label}: expected step ${step}, got ${result.pageStep}`);
    if ((Number(result.opacity) || 0) < 0.85) throw new Error(`${label}: ${step} highlight should be visible`);
    if (!result.canvasRect) throw new Error(`${label}: ${step} highlight missing geometry`);
    assertNear(result.canvasRect.x, expected.x, 5, `${label}: ${step} highlight x`);
    assertNear(result.canvasRect.y, expected.y, 5, `${label}: ${step} highlight y`);
    assertNear(result.canvasRect.w, expected.w, 5, `${label}: ${step} highlight width`);
    assertNear(result.canvasRect.h, expected.h, 5, `${label}: ${step} highlight height`);
  }
  await page.screenshot({ path: path.join(outputDir, `${label}-battle-highlight.png`), fullPage: false });
  return metrics;
}

function assertAnchored(label, metrics, { strictTop }) {
  if (metrics.phase !== "tutorial") throw new Error(`${label}: expected tutorial phase, got ${metrics.phase}`);
  if (metrics.tutorialStep !== "shop-intro") throw new Error(`${label}: expected shop-intro, got ${metrics.tutorialStep}`);
  if (!metrics.stage || !metrics.tutorialShop || !metrics.iframe || !metrics.dialogue) {
    throw new Error(`${label}: missing stage, shop, iframe, or dialogue metrics`);
  }
  for (const [name, transform] of Object.entries(metrics.transforms)) {
    if (transform !== "none") throw new Error(`${label}: ${name} has transform ${transform}`);
  }
  if (strictTop) {
    assertNear(metrics.relative.iframeTop, 3, 12, `${label}: tutorial iframe top relative to stage`);
    assertNear(metrics.relative.iframeBottomGap, 3, 12, `${label}: tutorial iframe bottom relative to stage`);
  }
  if (metrics.pageScroll.scrollWidth > metrics.pageScroll.clientWidth + 1) {
    throw new Error(`${label}: page has horizontal overflow`);
  }
  if (metrics.iframeDoc?.embed !== "opening-vn") {
    throw new Error(`${label}: embedded game did not enter opening-vn mode`);
  }
  assertNear(metrics.iframeDoc.shell.top, 0, 1, `${label}: embedded shell top`);
  assertNear(metrics.iframeDoc.canvas.top, 0, 1, `${label}: embedded canvas top`);
  if (metrics.iframeDoc.canvasStyle.border !== "0px") {
    throw new Error(`${label}: embedded canvas border should be 0px`);
  }
}

async function main() {
  fs.mkdirSync(outputDir, { recursive: true });
  const server = await ensureServer("/local-test-pages/opening-vn.html");
  const { chromium } = loadPlaywright();
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ deviceScaleFactor: 1 });
  const failures = [];
  const results = {};
  const highlightResults = {};
  const cases = [
    ["high-2560x1600", { width: 2560, height: 1600 }, true],
    ["desktop-1366x768", { width: 1366, height: 768 }, true],
    ["mobile-390x844", { width: 390, height: 844 }, false],
  ];

  try {
    for (const [label, viewport, strictTop] of cases) {
      await enterTutorial(page, label, viewport);
      const metrics = await collectMetrics(page);
      results[label] = metrics;
      await page.screenshot({ path: path.join(outputDir, `${label}.png`), fullPage: false });
      try {
        assertAnchored(label, metrics, { strictTop });
      } catch (err) {
        failures.push(err.message);
      }
    }
    for (const [label, viewport] of cases.map(([label, viewport]) => [label, viewport])) {
      try {
        highlightResults[label] = await assertHighlightTargets(page, label, viewport);
      } catch (err) {
        failures.push(err.message);
      }
    }
  } finally {
    await browser.close();
    if (server) server.kill();
  }

  fs.writeFileSync(path.join(outputDir, "metrics.json"), JSON.stringify({ anchors: results, highlights: highlightResults }, null, 2));
  if (failures.length) {
    console.error(`Opening tutorial anchor check failed:\n- ${failures.join("\n- ")}`);
    console.error(`Artifacts: ${outputDir}`);
    process.exit(1);
  }
  console.log(`Opening tutorial anchor check passed. Artifacts: ${outputDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
