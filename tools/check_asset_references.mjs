import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");
const scannedRoots = ["src", "styles", "local-test-pages"];
const scannedFiles = ["index.html"];
const scannedExtensions = new Set([".css", ".html", ".js"]);
const assetPattern = /(?:^|["'(`=\s])((?:\.\.\/)?assets\/[^"'`)<>\s]+)(?=["'`)\s]|$)/g;
const htmlRefPattern = /\b(?:href|src)=["']([^"']+)["']/gi;
const scriptGroupPattern = /\[\s*"([a-z0-9-]+)"\s*,\s*"[^"]+"\s*\]/gi;

function walk(dir) {
  const absDir = path.join(repoRoot, dir);
  if (!fs.existsSync(absDir)) return [];
  const entries = fs.readdirSync(absDir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(rel);
    return scannedExtensions.has(path.extname(entry.name)) ? [rel] : [];
  });
}

function stripUrlSuffix(value) {
  return value.split(/[?#]/, 1)[0];
}

function normalizeRelative(value, sourceFile) {
  const withoutSuffix = stripUrlSuffix(value).replaceAll("\\", "/");
  if (!withoutSuffix || withoutSuffix.includes("${")) return null;
  if (withoutSuffix.startsWith("assets/") || withoutSuffix.startsWith("src/") || withoutSuffix.startsWith("styles/")) {
    return withoutSuffix;
  }
  if (withoutSuffix.startsWith("../assets/")) {
    return path.relative(repoRoot, path.resolve(repoRoot, path.dirname(sourceFile), withoutSuffix)).replaceAll("\\", "/");
  }
  return null;
}

function addReference(map, sourceFile, lineNumber, value) {
  const normalized = normalizeRelative(value, sourceFile);
  if (!normalized) return;
  const existing = map.get(normalized) || [];
  existing.push({ sourceFile, lineNumber, value });
  map.set(normalized, existing);
}

function lineNumberFor(content, index) {
  let line = 1;
  for (let i = 0; i < index; i += 1) {
    if (content.charCodeAt(i) === 10) line += 1;
  }
  return line;
}

function collectLiteralReferences(files) {
  const references = new Map();
  for (const sourceFile of files) {
    const abs = path.join(repoRoot, sourceFile);
    const content = fs.readFileSync(abs, "utf8");
    assetPattern.lastIndex = 0;
    for (const match of content.matchAll(assetPattern)) {
      addReference(references, sourceFile, lineNumberFor(content, match.index), match[1]);
    }
    if (path.extname(sourceFile) === ".html") {
      htmlRefPattern.lastIndex = 0;
      for (const match of content.matchAll(htmlRefPattern)) {
        addReference(references, sourceFile, lineNumberFor(content, match.index), match[1]);
      }
    }
  }
  return references;
}

function collectScriptLoaderReferences(references) {
  const sourceFile = "src/app-scripts.js";
  const abs = path.join(repoRoot, sourceFile);
  if (!fs.existsSync(abs)) return;
  const content = fs.readFileSync(abs, "utf8");
  scriptGroupPattern.lastIndex = 0;
  for (const match of content.matchAll(scriptGroupPattern)) {
    addReference(references, sourceFile, lineNumberFor(content, match.index), `src/${match[1]}.js`);
  }
}

const files = [...scannedFiles, ...scannedRoots.flatMap(walk)].filter((file, index, all) => all.indexOf(file) === index);
const references = collectLiteralReferences(files);
collectScriptLoaderReferences(references);

const missing = [];
for (const [relPath, refs] of references.entries()) {
  if (!fs.existsSync(path.join(repoRoot, relPath))) {
    missing.push({ relPath, refs });
  }
}

if (missing.length) {
  console.error(`Asset/reference audit failed: ${missing.length} missing path(s).`);
  for (const item of missing.sort((a, b) => a.relPath.localeCompare(b.relPath))) {
    console.error(`\n${item.relPath}`);
    for (const ref of item.refs.slice(0, 6)) {
      console.error(`  ${ref.sourceFile}:${ref.lineNumber} (${ref.value})`);
    }
    if (item.refs.length > 6) console.error(`  ...${item.refs.length - 6} more reference(s)`);
  }
  process.exit(1);
}

console.log(`Asset/reference audit passed: ${references.size} unique paths checked across ${files.length} files.`);
