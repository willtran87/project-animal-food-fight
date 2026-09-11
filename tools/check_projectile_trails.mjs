import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { runtimeEntryGroups } from "./runtime-entry-groups.mjs";
import { baseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

const baseline = process.argv.includes("--baseline");
const output = path.join(repoRoot, "output", "projectile-trails");
fs.mkdirSync(output, { recursive: true });
// Expose the real renderer only in this intercepted test bundle, without changing the shipped API.
const source = runtimeEntryGroups.game.map((name) => {
  const code = baseline && ["game", "battle-canvas"].includes(name)
    ? execFileSync("git", ["show", `HEAD:src/${name}.js`], { cwd: repoRoot, encoding: "utf8", maxBuffer: 8 * 1024 * 1024, windowsHide: true })
    : fs.readFileSync(path.join(repoRoot, "src", `${name}.js`), "utf8");
  return name === "game" ? code.replace("window.__foodAnimals = {", "window.__trailTest = { drawFrame, drawAttackProjectile, trailBudget: typeof PROJECTILE_TRAIL_DRAW_LIMIT === 'number' ? PROJECTILE_TRAIL_DRAW_LIMIT : 0 }; window.__foodAnimals = {") : code;
}).join("\n");
const server = await ensureServer();
const browser = await loadPlaywright().chromium.launch({ headless: true });
const results = [];
const errors = [];
try {
  for (const [label, viewport, mobile] of [
    ["high", { width: 2560, height: 1600 }, false],
    ["desktop", { width: 1366, height: 768 }, false],
    ["mobile", { width: 390, height: 844 }, true],
  ]) {
    const context = await browser.newContext({ viewport, isMobile: mobile, hasTouch: mobile, deviceScaleFactor: mobile ? 3 : 1 });
    try {
      await context.addInitScript((mobile) => {
        window.requestAnimationFrame = () => 0;
        Object.defineProperty(navigator, "maxTouchPoints", { get: () => mobile ? 1 : 0 });
        const matchMedia = window.matchMedia.bind(window);
        window.matchMedia = (query) => {
          const result = matchMedia(query);
          if (query === "(pointer: coarse)") Object.defineProperty(result, "matches", { value: mobile });
          return result;
        };
      }, mobile);
      const page = await context.newPage();
      page.on("pageerror", (error) => errors.push(error.message));
      page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
      await page.route("**/dist/game.bundle.js?*", (route) => route.fulfill({ contentType: "text/javascript", body: source }));
      await page.goto(`${baseUrl}/local-test-pages/game.html?screen=final-fight&start=battle&seed=trail-check`);
      await page.waitForFunction(() => window.__trailTest, {}, { polling: 100 });
      await page.evaluate(() => {
        const g = window.__foodAnimals, s = g.state;
        s.activeStory = null; s.phaseTransition = null;
        for (let i = 0; i < 150 && !s.battle.attacks.length; i++) window.advanceTime(16);
        if (!s.battle.attacks.length) throw new Error("No projectile in battle fixture");
        const from = s.battle.allies[0], to = s.battle.enemies[0];
        window.__trailAttack = { ...s.battle.attacks[0], from: from.uid, to: to.uid, particleType: from.typeId,
          particleSprite: "attack", particleTier: 3, kind: "damage", spin: 6, t: 0.125, duration: 0.25, impact: null };
        delete window.__trailAttack.particleSrc;
        s.battle.attacks = [window.__trailAttack];
        window.__trailTest.drawFrame();
      });
      await page.waitForTimeout(1000);
      for (const horror of [false, true]) {
        await page.evaluate((horror) => {
          const s = window.__foodAnimals.state;
          s.realityOverride = horror; s.realityBroken = horror; s.realityBreakTimer = 0;
          const attack = window.__trailAttack;
          delete attack.particleSrc;
          window.__trailTest.drawFrame();
        }, horror);
        await page.waitForTimeout(1000);
        await page.evaluate(() => window.__trailTest.drawFrame());
        if (!baseline) {
          const checks = await page.evaluate(() => {
            const { state: s } = window.__foodAnimals, api = window.__trailTest;
            const attack = window.__trailAttack, battle = s.battle;
            const ctx = document.getElementById("game").getContext("2d");
            const original = ctx.drawImage;
            const originalFill = ctx.fill;
            let haloFills = 0;
            ctx.fill = function (...args) {
              if (this.globalCompositeOperation === "lighter") haloFills++;
              return originalFill.apply(this, args);
            };
            const calls = [];
            ctx.drawImage = function (image, ...args) {
              calls.push({ src: image.src, size: args.at(-2), alpha: this.globalAlpha, transform: [this.getTransform().a, this.getTransform().b] });
              return original.call(this, image, ...args);
            };
            const before = JSON.stringify({ rng: window.__foodAnimals.rng(), attack, particles: s.particles, hp: battle.allies.map((u) => u.hp) });
            try { api.drawAttackProjectile(attack, battle, 3); } finally { ctx.drawImage = original; ctx.fill = originalFill; }
            const after = JSON.stringify({ rng: window.__foodAnimals.rng(), attack, particles: s.particles, hp: battle.allies.map((u) => u.hp) });
            return { calls, haloFills, unchanged: before === after };
          });
          assert.equal(checks.calls.length, 4, "three sprite trail copies plus the main projectile");
          assert.equal(checks.haloFills, 0, "neither theme should draw an in-flight projectile halo");
          assert.equal(new Set(checks.calls.map((call) => call.src)).size, 1, "trail must reuse the main projectile image");
          const main = checks.calls.at(-1);
          assert.ok(checks.calls.slice(0, 3).every((call, index) =>
            Math.abs(call.size / main.size - [0.36, 0.48, 0.6][index]) < 1e-9 && call.alpha < main.alpha));
          assert.equal(new Set(checks.calls.slice(0, 3).map((call) => call.transform.join(","))).size, 3, "copies rotate independently");
          assert.equal(checks.unchanged, true, "trail rendering must not mutate gameplay or RNG");
        }
        await page.evaluate(() => window.__trailTest.drawFrame());
        await page.screenshot({ path: path.join(output, `${baseline ? "before" : "after"}-${label}-${horror ? "horror" : "cozy"}.png`) });
        if (!baseline && label === "high") {
          const box = await page.locator("#game").boundingBox();
          await page.screenshot({ path: path.join(output, `${horror ? "horror" : "cozy"}-detail.png`),
            clip: { x: box.x + box.width * 0.1, y: box.y + box.height * 0.17, width: box.width * 0.62, height: box.height * 0.4 } });
          await page.evaluate(() => {
            const a = window.__trailAttack;
            [a.from, a.to] = [a.to, a.from]; a.spin *= -1;
            window.__trailTest.drawFrame();
          });
          await page.screenshot({ path: path.join(output, `${horror ? "horror" : "cozy"}-reverse.png`) });
          await page.evaluate(() => {
            const a = window.__trailAttack;
            [a.from, a.to] = [a.to, a.from]; a.spin *= -1;
          });
        }
      }
      for (const count of [3, 48, 160]) {
        const metrics = await page.evaluate((count) => {
          const s = window.__foodAnimals.state, api = window.__trailTest;
          s.battle.attacks = Array.from({ length: count }, (_, i) => ({ ...window.__trailAttack, t: 0.25 * (0.35 + (i % 4) * 0.04) }));
          for (let i = 0; i < 12; i++) api.drawFrame();
          const times = [];
          for (let i = 0; i < 60; i++) {
            const start = performance.now(); api.drawFrame(); times.push(performance.now() - start);
          }
          times.sort((a, b) => a - b);
          const ctx = document.getElementById("game").getContext("2d"), original = ctx.drawImage;
          let projectileCopies = 0;
          ctx.drawImage = function (image, ...args) {
            if (image.src === new URL(window.__trailAttack.particleSrc, document.baseURI).href) projectileCopies++;
            return original.call(this, image, ...args);
          };
          try { api.drawFrame(); } finally { ctx.drawImage = original; }
          return { medianMs: times[30], p95Ms: times[57], projectileCopies, trailBudget: api.trailBudget, errors: JSON.parse(window.render_game_to_text()).rendering.recovery.errors };
        }, count);
        assert.equal(metrics.errors, 0);
        if (!baseline) {
          assert.equal(metrics.trailBudget, mobile ? 64 : 96);
          assert.equal(metrics.projectileCopies, count + Math.min(count * 3, metrics.trailBudget), "total trail sprite draws must match the bounded budget");
        }
        results.push({ label, count, ...metrics });
      }
      console.log(`PASS: ${label} projectile trails and dense-battle draw budget`);
    } finally { await context.close(); }
  }
  assert.deepEqual(errors, []);
  fs.writeFileSync(path.join(output, baseline ? "before.json" : "after.json"), JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results));
} finally { await browser.close(); server?.kill(); }
