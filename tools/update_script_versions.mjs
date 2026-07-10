import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");
const appScriptsPath = path.join(repoRoot, "src", "app-scripts.js");
const htmlPaths = [
  path.join(repoRoot, "index.html"),
  path.join(repoRoot, "local-test-pages", "game.html"),
  path.join(repoRoot, "local-test-pages", "opening-vn.html"),
  path.join(repoRoot, "local-test-pages", "start-menu.html"),
];
const checkOnly = process.argv.includes("--check");

function hashContent(content) {
  return `h-${crypto.createHash("sha256").update(content).digest("hex").slice(0, 12)}`;
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8").replace(/\r\n/g, "\n");
}

function hashFile(filePath) {
  return hashContent(readText(filePath));
}

function replaceScriptEntryVersions(source) {
  return source.replace(/\[\s*"([^"]+)"\s*,\s*"([^"]+)"\s*,?\s*\]/g, (match, name) => {
    const scriptPath = path.join(repoRoot, "src", `${name}.js`);
    if (!fs.existsSync(scriptPath)) return match;
    return `["${name}", "${hashFile(scriptPath)}"]`;
  });
}

function replaceLoaderVersions(source, loaderVersion) {
  return source.replace(/src="src\/app-scripts\.js\?v=[^"]+"/g, `src="src/app-scripts.js?v=${loaderVersion}"`);
}

const originalAppScripts = readText(appScriptsPath);
const updatedAppScripts = replaceScriptEntryVersions(originalAppScripts);
const loaderVersion = hashContent(updatedAppScripts);

const pendingUpdates = [];
if (updatedAppScripts !== originalAppScripts) {
  pendingUpdates.push(path.relative(repoRoot, appScriptsPath));
}

const htmlUpdates = htmlPaths.map((htmlPath) => {
  const originalHtml = readText(htmlPath);
  const updatedHtml = replaceLoaderVersions(originalHtml, loaderVersion);
  if (updatedHtml !== originalHtml) pendingUpdates.push(path.relative(repoRoot, htmlPath));
  return { htmlPath, updatedHtml };
});

if (checkOnly) {
  if (pendingUpdates.length) {
    console.error("Script cache versions are stale:");
    pendingUpdates.forEach((filePath) => console.error(`- ${filePath}`));
    console.error("Run `npm run update:script-versions` to refresh them.");
    process.exit(1);
  }
  console.log(`Script cache versions are current (${loaderVersion}).`);
  process.exit(0);
}

fs.writeFileSync(appScriptsPath, updatedAppScripts);
for (const htmlPath of htmlPaths) {
  const update = htmlUpdates.find((entry) => entry.htmlPath === htmlPath);
  fs.writeFileSync(htmlPath, update.updatedHtml);
}

console.log(`Updated script cache versions with ${loaderVersion}.`);
