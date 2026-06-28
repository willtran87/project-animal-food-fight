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

function hashContent(content) {
  return `h-${crypto.createHash("sha256").update(content).digest("hex").slice(0, 12)}`;
}

function hashFile(filePath) {
  return hashContent(fs.readFileSync(filePath));
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

const originalAppScripts = fs.readFileSync(appScriptsPath, "utf8");
const updatedAppScripts = replaceScriptEntryVersions(originalAppScripts);
fs.writeFileSync(appScriptsPath, updatedAppScripts);

const loaderVersion = hashContent(updatedAppScripts);
for (const htmlPath of htmlPaths) {
  const originalHtml = fs.readFileSync(htmlPath, "utf8");
  fs.writeFileSync(htmlPath, replaceLoaderVersions(originalHtml, loaderVersion));
}

console.log(`Updated script cache versions with ${loaderVersion}.`);
