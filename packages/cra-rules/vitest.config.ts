import { defineConfig, type Plugin } from "vitest/config";
import { resolve } from "path";
import { existsSync } from "fs";

function tsNodeNextPlugin(): Plugin {
  return {
    name: "ts-nodenext-resolve",
    resolveId(source, importer) {
      if (!importer) return null;
      if (!source.startsWith(".")) return null;
      if (!source.endsWith(".js")) return null;
      const tsPath = source.slice(0, -3) + ".ts";
      const importerDir = importer.replace(/[^/\\]+$/, "");
      const candidate = resolve(importerDir, tsPath);
      if (existsSync(candidate)) return candidate;
      return null;
    },
  };
}

export default defineConfig({
  plugins: [tsNodeNextPlugin()],
  test: {
    environment: "node",
  },
});
