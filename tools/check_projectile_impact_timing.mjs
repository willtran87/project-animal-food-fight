import fs from "node:fs";
import path from "node:path";
import { baseUrl, ensureServer, loadPlaywright, repoRoot } from "./visual-check-helpers.mjs";

const { chromium } = loadPlaywright();
const outputDir = path.join(repoRoot, "output", "projectile-impact-timing");
fs.mkdirSync(outputDir, { recursive: true });

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function impactSnapshot(page, attackSequence = null) {
  return page.evaluate((sequence) => {
    const battle = window.__foodAnimals?.state?.battle;
    if (!battle) return null;
    const attack = battle.attacks.find((entry) => (
      entry.impact
      && !entry.impact.redirect
      && (sequence == null || entry.sequence === sequence)
    ));
    if (!attack) return { battleElapsed: battle.elapsed, attack: null };
    const units = [...battle.allies, ...battle.enemies];
    const target = units.find((unit) => unit.uid === attack.to);
    const presentation = window.FoodAnimalsBattleCanvas.unitPresentationState(target);
    return {
      battleElapsed: battle.elapsed,
      attack: {
        sequence: attack.sequence,
        from: attack.from,
        to: attack.to,
        t: attack.t,
        duration: attack.duration,
        impact: { ...attack.impact },
      },
      target: {
        hp: target.hp,
        shield: target.shield,
        dead: target.dead,
        presentation,
      },
    };
  }, attackSequence);
}

const server = await ensureServer("/local-test-pages/game.html?screen=level-10&start=battle");
const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
const errors = [];
page.on("console", (message) => {
  if (message.type() === "error") errors.push(`console: ${message.text()}`);
});
page.on("pageerror", (error) => errors.push(`page: ${error.message}`));

try {
  await page.goto(`${baseUrl}/local-test-pages/game.html?screen=level-10&start=battle&seed=impact-check`, { waitUntil: "domcontentloaded" });
  await page.waitForFunction(() => window.__foodAnimals?.state?.battle && typeof window.advanceTime === "function");

  let inFlight = null;
  for (let step = 0; step < 500 && !inFlight?.attack; step += 1) {
    await page.evaluate(() => window.advanceTime(16));
    inFlight = await impactSnapshot(page);
  }

  assert(inFlight?.attack, "No damage projectile with a queued impact appeared");
  assert(inFlight.target.presentation.pendingImpact, "Target presentation was not held while its projectile was in flight");
  assert(
    inFlight.target.presentation.hp !== inFlight.target.hp || inFlight.target.presentation.shield !== inFlight.target.shield,
    "Target health/shield presentation changed before projectile arrival",
  );
  assert(inFlight.attack.t > 0, "Queued impact projectile had already expired");

  await page.screenshot({ path: path.join(outputDir, "in-flight.png") });
  const waitMs = Math.ceil((inFlight.attack.t + 0.05) * 1000);
  await page.evaluate((ms) => window.advanceTime(ms), waitMs);
  const after = await impactSnapshot(page, inFlight.attack.sequence);
  assert(!after?.attack, "Projectile impact remained queued after its arrival time");
  assert(errors.length === 0, `Projectile timing probe emitted browser errors: ${errors.join(" | ")}`);

  fs.writeFileSync(
    path.join(outputDir, "results.json"),
    `${JSON.stringify({ inFlight, after, errors }, null, 2)}\n`,
  );
  console.log(`Projectile impact timing check passed at ${inFlight.battleElapsed.toFixed(2)}s.`);
} finally {
  await page.close();
  await browser.close();
  server?.kill();
}
