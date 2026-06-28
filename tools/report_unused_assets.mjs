import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");
const outputDir = path.join(repoRoot, "output");
const outputPath = path.join(outputDir, "unused-assets-report.json");
const csvOutputPath = path.join(outputDir, "unused-assets-triage.csv");

const scannedRoots = ["src", "styles", "local-test-pages", "docs", "assets"];
const scannedFiles = ["README.md", "index.html", "package.json"];
const scannedExtensions = new Set([".css", ".html", ".js", ".md", ".json"]);
const assetPattern = /(?:^|["'(`=\s])((?:\.\.\/)?assets\/[^"'`)<>\s]+)(?=["'`)\s]|$)/g;
const htmlRefPattern = /\b(?:href|src)=["']([^"']+)["']/gi;

function walk(dir) {
  const absDir = path.join(repoRoot, dir);
  if (!fs.existsSync(absDir)) return [];
  return fs.readdirSync(absDir, { withFileTypes: true }).flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(rel);
    return scannedExtensions.has(path.extname(entry.name)) ? [rel] : [];
  });
}

function stripUrlSuffix(value) {
  return value.split(/[?#]/, 1)[0];
}

function normalizeReference(value, sourceFile) {
  const withoutSuffix = stripUrlSuffix(String(value)).replaceAll("\\", "/");
  if (!withoutSuffix || withoutSuffix.includes("${")) return null;
  if (withoutSuffix.startsWith("assets/")) return withoutSuffix;
  if (withoutSuffix.startsWith("../assets/")) {
    return path.relative(repoRoot, path.resolve(repoRoot, path.dirname(sourceFile), withoutSuffix)).replaceAll("\\", "/");
  }
  return null;
}

function lineNumberFor(content, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (content.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

function addReference(references, sourceFile, lineNumber, value) {
  const normalized = normalizeReference(value, sourceFile);
  if (!normalized) return;
  const refs = references.get(normalized) || [];
  refs.push({ sourceFile, lineNumber, value });
  references.set(normalized, refs);
}

const files = [...scannedFiles, ...scannedRoots.flatMap(walk)].filter((file, index, all) => all.indexOf(file) === index);
const references = new Map();
for (const sourceFile of files) {
  const abs = path.join(repoRoot, sourceFile);
  if (!fs.existsSync(abs)) continue;
  const content = fs.readFileSync(abs, "utf8");
  for (const match of content.matchAll(assetPattern)) {
    addReference(references, sourceFile, lineNumberFor(content, match.index), match[1]);
  }
  if (path.extname(sourceFile) === ".html") {
    for (const match of content.matchAll(htmlRefPattern)) {
      addReference(references, sourceFile, lineNumberFor(content, match.index), match[1]);
    }
  }
}

const trackedAssets = execFileSync("git", ["ls-files", "assets"], { cwd: repoRoot, encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean)
  .filter((file) => !file.endsWith(".md"));

const unused = trackedAssets.filter((file) => !references.has(file)).sort();
const byDirectory = {};
for (const file of unused) {
  const dir = path.dirname(file).replaceAll("\\", "/");
  byDirectory[dir] = (byDirectory[dir] || 0) + 1;
}

function versionParts(file) {
  const parsed = path.parse(file.replaceAll("\\", "/"));
  const match = parsed.name.match(/^(.*)-v(\d+)$/);
  if (!match) return null;
  return {
    dir: parsed.dir,
    base: match[1],
    version: Number(match[2]),
    ext: parsed.ext,
  };
}

const highestVersionBySeries = new Map();
for (const file of trackedAssets) {
  const parts = versionParts(file);
  if (!parts) continue;
  const key = `${parts.dir}/${parts.base}${parts.ext}`;
  highestVersionBySeries.set(key, Math.max(highestVersionBySeries.get(key) || 0, parts.version));
}

const categoryInfo = {
  "audio-sfx": { action: "review-wiring", risk: "medium", reason: "Tracked sound effects may be intended but are not directly referenced by scanned source." },
  "background-draft": { action: "archive-candidate", risk: "low", reason: "Older or alternate background art that is not referenced by active routes." },
  "defeat-still": { action: "review-wiring", risk: "medium", reason: "Defeat stills may be used through generated maps or retained for future unit states." },
  "evolution-sheet": { action: "keep-retained", risk: "low", reason: "Sprite sheet/provenance files are commonly retained for slicing or regeneration." },
  "field-guide-page": { action: "keep-retained", risk: "low", reason: "Field-guide pages are navigated dynamically and may not appear as literal references." },
  "particle-runtime": { action: "review-wiring", risk: "medium", reason: "Runtime particles can be referenced indirectly through generated maps." },
  "pipeline-source": { action: "keep-retained", risk: "low", reason: "Source/transparent pipeline files are provenance, not direct runtime references." },
  "provenance-source": { action: "keep-retained", risk: "low", reason: "Root provenance assets are retained documentation for generated browser assets." },
  "runtime-sprite-frame": { action: "review-wiring", risk: "medium", reason: "Individual runtime frames can be referenced through sprite maps rather than literal paths." },
  "runtime-ui-draft": { action: "archive-candidate", risk: "low", reason: "Superseded/generated UI title art that is not referenced by active presentation data." },
  "sprite-manifest": { action: "keep-retained", risk: "low", reason: "Manifest files document generated sprite groups even when not loaded at runtime." },
  "superseded-version": { action: "archive-candidate", risk: "low", reason: "A higher-version sibling exists in the same asset series." },
  uncategorized: { action: "manual-review", risk: "unknown", reason: "No known retention or supersession heuristic matched this asset." },
};

function triageFor(file) {
  const normalized = file.replaceAll("\\", "/");
  const parts = versionParts(normalized);
  if (parts) {
    const key = `${parts.dir}/${parts.base}${parts.ext}`;
    if ((highestVersionBySeries.get(key) || 0) > parts.version) return { category: "superseded-version", ...categoryInfo["superseded-version"] };
  }
  if (normalized.startsWith("assets/start-menu/field-guide/")) return { category: "field-guide-page", ...categoryInfo["field-guide-page"] };
  if (normalized.startsWith("assets/ui/runtime/")) return { category: "runtime-ui-draft", ...categoryInfo["runtime-ui-draft"] };
  if (normalized.startsWith("assets/audio/sfx/")) return { category: "audio-sfx", ...categoryInfo["audio-sfx"] };
  if (normalized.startsWith("assets/backgrounds/")) return { category: "background-draft", ...categoryInfo["background-draft"] };
  if (normalized.startsWith("assets/sprites/runtime/defeat-stills/")) return { category: "defeat-still", ...categoryInfo["defeat-still"] };
  if (normalized.startsWith("assets/particles/runtime/")) return { category: "particle-runtime", ...categoryInfo["particle-runtime"] };
  if (normalized.endsWith(".sprite-manifest.json")) return { category: "sprite-manifest", ...categoryInfo["sprite-manifest"] };
  if (/_evolution_[A-Z]+_sheet\.(png|webp)$/i.test(normalized) || normalized.includes("/final-forms-")) {
    return { category: "evolution-sheet", ...categoryInfo["evolution-sheet"] };
  }
  if (normalized.startsWith("assets/sprites/runtime/") && /_idle_[A-Z]+_\d+\.(png|webp)$/i.test(normalized)) {
    return { category: "runtime-sprite-frame", ...categoryInfo["runtime-sprite-frame"] };
  }
  if (normalized.includes("/source/") || normalized.includes("/transparent/")) return { category: "pipeline-source", ...categoryInfo["pipeline-source"] };
  if (normalized.includes("source") || normalized.includes("transparent")) return { category: "provenance-source", ...categoryInfo["provenance-source"] };
  return { category: "uncategorized", ...categoryInfo.uncategorized };
}

const categories = {};
const triaged = [];
for (const file of unused) {
  const triage = triageFor(file);
  const bucket = categories[triage.category] || {
    count: 0,
    action: triage.action,
    risk: triage.risk,
    reason: triage.reason,
    sample: [],
  };
  bucket.count += 1;
  if (bucket.sample.length < 12) bucket.sample.push(file);
  categories[triage.category] = bucket;
  triaged.push({ file, ...triage });
}

const report = {
  generatedAt: new Date().toISOString(),
  scannedFiles: files.length,
  trackedAssets: trackedAssets.length,
  referencedAssets: [...references.keys()].filter((file) => file.startsWith("assets/")).length,
  unusedCount: unused.length,
  byDirectory: Object.fromEntries(Object.entries(byDirectory).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
  categories: Object.fromEntries(Object.entries(categories).sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))),
  triaged,
  unused,
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);
fs.writeFileSync(
  csvOutputPath,
  [
    "category,action,risk,file,reason",
    ...triaged.map((entry) => [
      entry.category,
      entry.action,
      entry.risk,
      entry.file,
      entry.reason,
    ].map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")),
  ].join("\n") + "\n",
);

console.log(
  `Unused asset report written: ${path.relative(repoRoot, outputPath)} and ${path.relative(repoRoot, csvOutputPath)} (${unused.length} of ${trackedAssets.length} tracked asset files not referenced by scanned source/docs).`,
);
