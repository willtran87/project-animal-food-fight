import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const helpersDir = path.dirname(fileURLToPath(import.meta.url));

export const repoRoot = path.resolve(helpersDir, "..");
export const port = Number(process.env.FOOD_ANIMALS_PORT || 8173);
export const baseUrl = process.env.FOOD_ANIMALS_BASE_URL || `http://127.0.0.1:${port}`;

export function loadPlaywright() {
  const localRequire = createRequire(import.meta.url);
  try {
    return localRequire("playwright");
  } catch (_err) {
    const codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
    const skillClient = path.join(codexHome, "skills", "develop-web-game", "scripts", "web_game_playwright_client.js");
    try {
      return createRequire(skillClient)("playwright");
    } catch (fallbackErr) {
      throw new Error(
        `Playwright is required for this visual guard. Install it locally or run from Codex with the develop-web-game skill available.\n${fallbackErr.message}`,
      );
    }
  }
}

export async function urlResponds(url) {
  try {
    const response = await fetch(url, { method: "GET" });
    return response.ok;
  } catch (_err) {
    return false;
  }
}

export async function waitForServer(url, timeoutMs = 6000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    if (await urlResponds(url)) return true;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return false;
}

export async function ensureServer(targetPath = "/") {
  const target = new URL(targetPath, `${baseUrl}/`).href;
  if (await urlResponds(target)) return null;
  const python = process.env.PYTHON || "python";
  const child = spawn(python, ["-m", "http.server", String(port)], {
    cwd: repoRoot,
    stdio: "ignore",
    windowsHide: true,
  });
  const ready = await waitForServer(target);
  if (!ready) {
    child.kill();
    throw new Error(`Could not start local static server at ${baseUrl}`);
  }
  return child;
}

export function assertNear(actual, expected, tolerance, message) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(`${message}: expected ${expected} +/- ${tolerance}, got ${actual}`);
  }
}
