import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");
const outputDir = path.join(repoRoot, "output");
const outputPath = path.join(outputDir, "unused-assets-report.json");

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

function categoryFor(file) {
  const normalized = file.replaceAll("\\", "/");
  const parts = versionParts(normalized);
  if (parts) {
    const key = `${parts.dir}/${parts.base}${parts.ext}`;
    if ((highestVersionBySeries.get(key) || 0) > parts.version) return "superseded-version";
  }
  if (normalized.startsWith("assets/start-menu/field-guide/")) return "field-guide-page";
  if (normalized.startsWith("assets/ui/runtime/")) return "runtime-ui-draft";
  if (normalized.startsWith("assets/audio/sfx/")) return "audio-sfx";
  if (normalized.startsWith("assets/backgrounds/")) return "background-draft";
  if (normalized.includes("/source/") || normalized.includes("/transparent/")) return "pipeline-source";
  if (normalized.includes("source") || normalized.includes("transparent")) return "provenance-source";
  return "uncategorized";
}

const categories = {};
for (const file of unused) {
  const category = categoryFor(file);
  const bucket = categories[category] || { count: 0, sample: [] };
  bucket.count += 1;
  if (bucket.sample.length < 12) bucket.sample.push(file);
  categories[category] = bucket;
}

const report = {
  generatedAt: new Date().toISOString(),
  scannedFiles: files.length,
  trackedAssets: trackedAssets.length,
  referencedAssets: [...references.keys()].filter((file) => file.startsWith("assets/")).length,
  unusedCount: unused.length,
  byDirectory: Object.fromEntries(Object.entries(byDirectory).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))),
  categories: Object.fromEntries(Object.entries(categories).sort((a, b) => b[1].count - a[1].count || a[0].localeCompare(b[0]))),
  unused,
};

fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`);

console.log(
  `Unused asset report written: ${path.relative(repoRoot, outputPath)} (${unused.length} of ${trackedAssets.length} tracked asset files not referenced by scanned source/docs).`,
);
