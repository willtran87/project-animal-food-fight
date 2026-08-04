import fs from "node:fs";
import path from "node:path";
import { baseUrl as localBaseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

const outputDir = path.join(repoRoot, "output", "field-guide-loading-check");
fs.mkdirSync(outputDir, { recursive: true });

const externalBaseUrl = process.env.FIELD_GUIDE_BASE_URL?.replace(/\/$/, "");
const routePath = process.env.FIELD_GUIDE_ROUTE_PATH || "/local-test-pages/start-menu.html";
const targetBaseUrl = externalBaseUrl || localBaseUrl;
const server = externalBaseUrl ? null : await ensureServer(routePath);
const { chromium } = loadPlaywright();
const browser = await chromium.launch({ headless: true });
const results = [];

try {
  for (const theme of ["cozy", "horror"]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    if (theme === "horror") {
      await page.addInitScript(() => localStorage.setItem("harvest-friends:horror-revealed:v1", "1"));
    }
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    page.on("requestfailed", (request) => {
      const errorText = request.failure()?.errorText || "failed";
      if (errorText !== "net::ERR_ABORTED") errors.push(`request: ${request.url()} ${errorText}`);
    });
    page.on("response", (response) => {
      if (response.status() >= 400) errors.push(`response: ${response.status()} ${response.url()}`);
    });

    const startedAt = Date.now();
    const separator = routePath.includes("?") ? "&" : "?";
    await page.goto(`${targetBaseUrl}${routePath}${separator}theme=${theme}`, { waitUntil: "load" });
    await page.locator('[data-action="fieldGuide"]').click();
    await page.locator('[data-guide-action="next"]').click();

    let loaded = false;
    try {
      await page.waitForFunction(
        () => {
          const image = document.querySelector(".field-guide-page-image");
          return image?.complete && image.naturalWidth > 0 && image.style.visibility !== "hidden";
        },
        { timeout: 12000 },
      );
      loaded = true;
    } catch {
      loaded = false;
    }

    const image = await page.locator(".field-guide-page-image").evaluate((element) => ({
      complete: element.complete,
      naturalHeight: element.naturalHeight,
      naturalWidth: element.naturalWidth,
      pageKey: element.dataset.pageKey,
      src: element.getAttribute("src"),
      visibility: element.style.visibility,
      cornerAlpha: (() => {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 1;
        const context = canvas.getContext("2d", { willReadFrequently: true });
        context.drawImage(element, 0, 0, 1, 1, 0, 0, 1, 1);
        return context.getImageData(0, 0, 1, 1).data[3];
      })(),
    }));
    const elapsedMs = Date.now() - startedAt;
    await page.screenshot({ path: path.join(outputDir, `${theme}-first-page.png`), fullPage: true });
    results.push({ theme, loaded, elapsedMs, image, errors });
    await page.close();
  }

  {
    const theme = "horror-preprocessed";
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    await page.addInitScript(() => {
      localStorage.setItem("harvest-friends:horror-revealed:v1", "1");
      Object.defineProperty(window, "Worker", { configurable: true, value: undefined });
      Object.defineProperty(window, "createImageBitmap", { configurable: true, value: undefined });
      Object.defineProperty(window, "OffscreenCanvas", { configurable: true, value: undefined });
      CanvasRenderingContext2D.prototype.getImageData = () => {
        throw new Error("forced chroma allocation failure");
      };
    });
    const errors = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => errors.push(`page: ${error.message}`));
    const startedAt = Date.now();
    const separator = routePath.includes("?") ? "&" : "?";
    await page.goto(`${targetBaseUrl}${routePath}${separator}theme=horror`, { waitUntil: "load" });
    await page.locator('[data-action="fieldGuide"]').click();
    await page.locator('[data-guide-action="next"]').click();
    await page.waitForFunction(() => {
      const image = document.querySelector(".field-guide-page-image");
      return image?.dataset.chromaProcessing === "false" && image.style.visibility !== "hidden" && image.complete && image.naturalWidth > 0;
    }, { timeout: 4000 });
    const image = await page.locator(".field-guide-page-image").evaluate((element) => ({
      complete: element.complete,
      naturalHeight: element.naturalHeight,
      naturalWidth: element.naturalWidth,
      pageKey: element.dataset.pageKey,
      src: element.getAttribute("src"),
      visibility: element.style.visibility,
    }));
    await page.screenshot({ path: path.join(outputDir, `${theme}-first-page.png`), fullPage: true });
    results.push({ theme, loaded: true, elapsedMs: Date.now() - startedAt, image, errors });
    await page.close();
  }
} finally {
  await browser.close();
  server?.kill();
}

fs.writeFileSync(path.join(outputDir, "results.json"), `${JSON.stringify(results, null, 2)}\n`);
for (const result of results) {
  if (!result.loaded) throw new Error(`${result.theme} field guide page did not finish loading: ${JSON.stringify(result)}`);
  const expectedTheme = result.theme === "horror-preprocessed" ? "horror" : result.theme;
  if (!result.image.pageKey?.startsWith(`${expectedTheme}:`)) {
    throw new Error(`${result.theme} field guide resolved the wrong theme: ${result.image.pageKey || "missing page key"}`);
  }
  if (result.errors.length) throw new Error(`${result.theme} field guide emitted browser errors: ${result.errors.join(" | ")}`);
  if (result.theme === "horror" && result.image.cornerAlpha !== 0) {
    throw new Error(`${result.theme} Field Guide page should ship with transparent keyed edges`);
  }
  if (expectedTheme === "horror" && String(result.image.src).startsWith("blob:")) {
    throw new Error(`${result.theme} Field Guide page should not require a runtime-generated blob`);
  }
}

console.log(`Field guide loading check passed: ${results.map((result) => `${result.theme} ${result.elapsedMs}ms`).join(", ")}`);
