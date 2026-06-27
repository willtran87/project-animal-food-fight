import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

export function createBrowserLikeContext(extra = {}) {
  const context = {
    console,
    Math,
    URL,
    URLSearchParams,
    ...extra,
  };
  context.window = context;
  return vm.createContext(context);
}

export function loadBrowserScripts(repoRoot, scripts, context = createBrowserLikeContext()) {
  for (const script of scripts) {
    const abs = path.join(repoRoot, script);
    const source = fs.readFileSync(abs, "utf8");
    vm.runInContext(source, context, { filename: script });
  }
  return context;
}
