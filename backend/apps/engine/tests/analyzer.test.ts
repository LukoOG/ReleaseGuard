import { describe, it, expect } from "vitest";
import { isSecurityRelevant } from "../src/analyzer/index.js";
import type { ChangeAnalysis } from "../src/analyzer/index.js";

describe("ChangeAnalyzer", () => {
  describe("isSecurityRelevant", () => {
    it("identifies auth files as security-relevant", () => {
      expect(isSecurityRelevant("src/auth/login.ts")).toBe(true);
      expect(isSecurityRelevant("lib/authentication.ts")).toBe(true);
    });

    it("identifies crypto files as security-relevant", () => {
      expect(isSecurityRelevant("src/crypto/hash.ts")).toBe(true);
      expect(isSecurityRelevant("utils/encryption.ts")).toBe(true);
    });

    it("identifies dependency manifests as security-relevant", () => {
      expect(isSecurityRelevant("package.json")).toBe(true);
      expect(isSecurityRelevant("pnpm-lock.yaml")).toBe(true);
      expect(isSecurityRelevant("package-lock.json")).toBe(true);
    });

    it("identifies .env files as security-relevant", () => {
      expect(isSecurityRelevant(".env")).toBe(true);
      expect(isSecurityRelevant(".env.production")).toBe(true);
    });

    it("does not flag unrelated files", () => {
      expect(isSecurityRelevant("src/components/Button.tsx")).toBe(false);
      expect(isSecurityRelevant("README.md")).toBe(false);
      expect(isSecurityRelevant("src/utils/format.ts")).toBe(false);
    });
  });

  describe("ChangeAnalysis type", () => {
    it("can be constructed with all required fields", () => {
      const analysis: ChangeAnalysis = {
        changedFiles: ["src/auth/login.ts", "package.json"],
        addedFiles: ["src/new-feature.ts"],
        removedFiles: [],
        modifiedFiles: ["src/auth/login.ts", "package.json"],
        dependencyChanges: ["package.json"],
        securityRelevantFiles: ["src/auth/login.ts", "package.json"],
      };

      expect(analysis.changedFiles).toHaveLength(2);
      expect(analysis.securityRelevantFiles).toContain("src/auth/login.ts");
    });
  });
});
