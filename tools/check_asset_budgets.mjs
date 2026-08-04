import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");
const MIB = 1024 * 1024;

function filesUnder(relativeDir, extension = "") {
  const root = path.join(repoRoot, relativeDir);
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(absolute);
      else if (!extension || entry.name.toLowerCase().endsWith(extension)) files.push(absolute);
    }
  };
  visit(root);
  return files;
}

function totalSize(files) {
  return files.reduce((total, file) => total + fs.statSync(file).size, 0);
}

function assertBudget(label, files, limitMib) {
  const size = totalSize(files);
  assert.ok(size <= limitMib * MIB, `${label} is ${(size / MIB).toFixed(2)} MiB; budget is ${limitMib.toFixed(2)} MiB`);
  return `${label} ${(size / MIB).toFixed(2)}/${limitMib.toFixed(2)} MiB`;
}

const allWebps = filesUnder("assets", ".webp");
const largestWebp = allWebps.reduce((largest, file) => fs.statSync(file).size > fs.statSync(largest).size ? file : largest);
const largestWebpSize = fs.statSync(largestWebp).size;
assert.ok(
  largestWebpSize <= 3.25 * MIB,
  `largest WebP is ${(largestWebpSize / MIB).toFixed(2)} MiB: ${path.relative(repoRoot, largestWebp)}`,
);

const criticalMenuFiles = [
  "assets/start-menu/cozy-picnic-start-bg-v1.webp",
  "assets/start-menu/harvest-friends-title-v2.webp",
  "assets/start-menu/harvest-friends-mascot-cluster-v1.webp",
  "assets/start-menu/run-mode-selector-cozy-bg-v1.webp",
  "assets/start-menu/run-mode-selector-horror-bg-v1.webp",
].map((relativePath) => path.join(repoRoot, relativePath));
criticalMenuFiles.forEach((file) => assert.ok(fs.existsSync(file), `critical menu asset should exist: ${path.relative(repoRoot, file)}`));

const reports = [
  assertBudget("all WebP assets", allWebps, 290),
  assertBudget("start-menu WebP assets", filesUnder("assets/start-menu", ".webp"), 230),
  assertBudget("opening-vn WebP assets", filesUnder("assets/opening-vn", ".webp"), 17),
  assertBudget("background WebP assets", filesUnder("assets/backgrounds", ".webp"), 27),
  assertBudget("runtime UI WebP assets", filesUnder("assets/ui/runtime", ".webp"), 10),
  assertBudget("critical menu WebP assets", criticalMenuFiles, 7.25),
];

console.log(`Asset budgets passed: ${reports.join("; ")}; largest ${(largestWebpSize / MIB).toFixed(2)} MiB.`);
