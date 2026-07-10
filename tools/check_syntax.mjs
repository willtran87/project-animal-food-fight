import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const toolsDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(toolsDir, "..");
const scanRoots = ["src", "tools", "dist"];
const syntaxExtensions = new Set([".js", ".mjs"]);

function walk(relativeDir) {
  const absoluteDir = path.join(repoRoot, relativeDir);
  if (!fs.existsSync(absoluteDir)) return [];
  return fs.readdirSync(absoluteDir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(relativeDir, entry.name);
    if (entry.isDirectory()) return walk(relativePath);
    return syntaxExtensions.has(path.extname(entry.name)) ? [relativePath] : [];
  });
}

const files = scanRoots
  .flatMap(walk)
  .filter((file, index, all) => all.indexOf(file) === index)
  .sort((a, b) => a.localeCompare(b));

const failures = [];
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  if (result.status === 0) continue;
  failures.push({ file, stdout: result.stdout, stderr: result.stderr });
}

if (failures.length) {
  console.error(`Syntax check failed: ${failures.length} file(s).`);
  for (const failure of failures) {
    console.error(`\n${failure.file}`);
    if (failure.stdout) console.error(failure.stdout.trimEnd());
    if (failure.stderr) console.error(failure.stderr.trimEnd());
  }
  process.exit(1);
}

console.log(`Syntax check passed: ${files.length} files checked.`);
