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
    page.on("requestfailed", (request) => errors.push(`request: ${request.url()} ${request.failure()?.errorText || "failed"}`));
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
    }));
    const elapsedMs = Date.now() - startedAt;
    await page.screenshot({ path: path.join(outputDir, `${theme}-first-page.png`), fullPage: true });
    results.push({ theme, loaded, elapsedMs, image, errors });
    await page.close();
  }
} finally {
  await browser.close();
  server?.kill();
}

fs.writeFileSync(path.join(outputDir, "results.json"), `${JSON.stringify(results, null, 2)}\n`);
for (const result of results) {
  if (!result.loaded) throw new Error(`${result.theme} field guide page did not finish loading: ${JSON.stringify(result)}`);
  if (!result.image.pageKey?.startsWith(`${result.theme}:`)) {
    throw new Error(`${result.theme} field guide resolved the wrong theme: ${result.image.pageKey || "missing page key"}`);
  }
  if (result.errors.length) throw new Error(`${result.theme} field guide emitted browser errors: ${result.errors.join(" | ")}`);
}

console.log(`Field guide loading check passed: ${results.map((result) => `${result.theme} ${result.elapsedMs}ms`).join(", ")}`);
