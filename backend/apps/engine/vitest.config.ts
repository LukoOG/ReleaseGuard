import { defineConfig, type Plugin } from "vitest/config";
import { resolve } from "path";
import { existsSync } from "fs";

/**
 * Vitest plugin: rewrite `.js` relative imports to `.ts` at resolution time.
 *
 * TypeScript with "module": "NodeNext" requires `.js` extensions in source
 * (they refer to the compiled output). Vite/Vitest runs `.ts` files directly
 * and needs to find the actual `.ts` file on disk.
 */
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

      if (existsSync(candidate)) {
        return candidate;
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [tsNodeNextPlugin()],
  resolve: {
    alias: {
      "@releaseguard/contracts": resolve(
        __dirname,
        "../../packages/contracts/src/index.ts",
      ),
      "@releaseguard/cra-rules": resolve(
        __dirname,
        "../../packages/cra-rules/src/index.ts",
      ),
    },
  },
  test: {
    environment: "node",
  },
});
