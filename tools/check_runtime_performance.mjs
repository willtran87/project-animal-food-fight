import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createBrowserLikeContext, loadBrowserScripts } from "./browser_script_loader.mjs";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");
const read = (relativePath) => fs.readFileSync(path.join(repoRoot, relativePath), "utf8");

const gameSource = read("src/game.js");
const menuSource = read("src/start-menu.js");
const openingSource = read("src/opening-vn.js");
const menuStyles = read("styles/start-menu.css");

assert.match(gameSource, /canvas\.getContext\("2d", \{ alpha: false \}\)/, "game canvas should use an opaque backing store");
assert.match(gameSource, /canvas\.getBoundingClientRect\(\)/, "backing scale should follow the rendered canvas size");
assert.match(gameSource, /cssWidth \* deviceScale \/ W/, "backing scale should account for device pixel ratio");
assert.match(gameSource, /const BACKING_SCALE_STEP = 0\.0625/, "backing scale should represent the 1.5625 high-resolution target exactly");
assert.match(gameSource, /new ResizeObserver\(scheduleBackingScaleRefresh\)/, "canvas resize should refresh backing resolution");
assert.match(gameSource, /const PARTICLE_LIMIT = isTouchFirstDevice \? 384 : 512/, "particles should have platform-aware limits");
assert.match(gameSource, /battleStaticLayerCanvas/, "battle scenery should use a static render layer");
assert.match(gameSource, /createPattern\(realityScanlinePatternCanvas, "repeat"\)/, "reality scanlines should use a pattern");
assert.match(gameSource, /revealNoiseLayerFrame !== frame/, "reveal noise should be cadence-cached");
assert.match(gameSource, /simulationFailureLayerKey !== key/, "failure artifacts should be cadence-cached");

assert.match(menuSource, /while \(warmedMenuImages\.size > 2\)/, "menu image warmup cache should stay bounded");
assert.match(menuSource, /clearResolvedImageCache\(chromaKeyImageCache\)/, "closed Field Guide images should be released");
const specificationsBlock = menuSource.match(/const SPECIFICATIONS_PAGES = \[([\s\S]*?)\n\];/)?.[1] || "";
assert.doesNotMatch(specificationsBlock, /chromaKey:\s*true/, "shipped horror Field Guide pages should use preprocessed transparency");
assert.match(menuSource, /FoodAnimalsAudioRuntime\.release\(menuSfx\)/, "embedded campaign handoff should release menu audio pools");
assert.match(menuSource, /startMenu\.querySelectorAll\("img\[src\]"\)/, "embedded campaign handoff should release menu images");
assert.match(menuStyles, /data-campaign-assets-released="true"/, "released menu backgrounds should have a CSS ownership state");

assert.match(openingSource, /const WARM_IMAGE_CACHE_LIMIT = 4/, "opening image warmup cache should stay bounded");
assert.match(openingSource, /openingAssetsReleased = "true"/, "tutorial handoff should release opening-only images");
const deferredOpeningBlock = openingSource.match(/const DEFERRED_OPENING_IMAGE_SOURCES = \[([\s\S]*?)\];/)?.[1] || "";
assert.doesNotMatch(deferredOpeningBlock, /tutorial|paddock|corkboard|doc-v2/, "opening startup should not preload later-scene art");

class FakeImage {
  constructor() {
    this.dataset = {};
    this.complete = false;
    this.naturalWidth = 0;
  }

  set src(value) {
    this._src = value;
  }

  get src() {
    return this._src;
  }
}

const context = loadBrowserScripts(
  repoRoot,
  ["src/particle-runtime.js", "src/runtime-assets.js"],
  createBrowserLikeContext({ Image: FakeImage }),
);

const particles = context.FoodAnimalsParticleRuntime;
const particleList = [
  { id: "expired", life: 0.05, maxLife: 1, age: 0, x: 0, y: 0, vx: 0, vy: 0, rotation: 0 },
  { id: "older", life: 2, maxLife: 2, age: 0, x: 0, y: 0, vx: 0, vy: 0, rotation: 0 },
  { id: "newer", life: 2, maxLife: 2, age: 0, x: 0, y: 0, vx: 0, vy: 0, rotation: 0 },
];
const originalParticleList = particleList;
assert.strictEqual(
  particles.update(particleList, 0.1, { maxParticles: 1 }),
  originalParticleList,
  "particle updates should compact the existing array",
);
assert.deepEqual(Array.from(particleList, (particle) => particle.id), ["newer"], "particle caps should preserve the newest live particles");

const assets = context.FoodAnimalsRuntimeAssets;
const imageCache = new Map();
const first = assets.getCachedImage(imageCache, "first.webp", { maxEntries: 2 });
assets.getCachedImage(imageCache, "second.webp", { maxEntries: 2 });
assert.strictEqual(assets.getCachedImage(imageCache, "first.webp", { maxEntries: 2 }), first, "cache hits should reuse images");
assets.getCachedImage(imageCache, "third.webp", { maxEntries: 2 });
assert.deepEqual(Array.from(imageCache.keys()), ["first.webp", "third.webp"], "image cache should evict the least-recently-used entry");

console.log("Runtime performance safeguards passed.");
