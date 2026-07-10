import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");
const outputRoot = path.join(repoRoot, "pages-dist");
const unusedReportPath = path.join(repoRoot, "output", "unused-assets-report.json");
const runtimeAssetExtensions = new Set([".json", ".mp3", ".png", ".wav", ".webp"]);

if (!fs.existsSync(unusedReportPath)) {
  throw new Error("Missing output/unused-assets-report.json. Run npm run report:unused-assets first.");
}

const unusedReport = JSON.parse(fs.readFileSync(unusedReportPath, "utf8"));
const unusedAssets = new Set((unusedReport.unused || []).map((file) => file.replaceAll("\\", "/")));

function resetOutput() {
  fs.rmSync(outputRoot, { recursive: true, force: true });
  fs.mkdirSync(outputRoot, { recursive: true });
}

function copyFile(relativePath) {
  const source = path.join(repoRoot, relativePath);
  const target = path.join(outputRoot, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.copyFileSync(source, target);
}

function copyDirectory(relativeDir, filter = () => true) {
  const sourceDir = path.join(repoRoot, relativeDir);
  for (const entry of fs.readdirSync(sourceDir, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) copyDirectory(relativePath, filter);
    else if (filter(relativePath)) copyFile(relativePath);
  }
}

function deployableAsset(relativePath) {
  const normalized = relativePath.replaceAll("\\", "/");
  if (unusedAssets.has(normalized)) return false;
  if (normalized.includes("/source/") || normalized.includes("/transparent/")) return false;
  return runtimeAssetExtensions.has(path.extname(relativePath).toLowerCase());
}

resetOutput();
[
  "index.html",
  "local-test-pages/game.html",
  "local-test-pages/opening-vn.html",
  "local-test-pages/start-menu.html",
  "src/app-scripts.js",
  "src/field-guide-worker.js",
].forEach(copyFile);
copyDirectory("styles");
copyDirectory("dist");
copyDirectory("assets", deployableAsset);

const deployedFiles = [];
function collect(relativeDir = "") {
  const absoluteDir = path.join(outputRoot, relativeDir);
  for (const entry of fs.readdirSync(absoluteDir, { withFileTypes: true })) {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) collect(relativePath);
    else deployedFiles.push({ path: relativePath.replaceAll("\\", "/"), bytes: fs.statSync(path.join(outputRoot, relativePath)).size });
  }
}
collect();
const totalBytes = deployedFiles.reduce((sum, file) => sum + file.bytes, 0);
fs.writeFileSync(
  path.join(outputRoot, "deployment-manifest.json"),
  `${JSON.stringify({ generatedAt: new Date().toISOString(), fileCount: deployedFiles.length, totalBytes, files: deployedFiles }, null, 2)}\n`,
);
console.log(`Pages artifact built: ${deployedFiles.length} files, ${totalBytes.toLocaleString()} bytes.`);
