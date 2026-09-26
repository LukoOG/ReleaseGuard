import { describe, it, expect } from "vitest";
import type { Evidence } from "@releaseguard/contracts";
import { vulnerableDependenciesRule, dependencyInventoryRule } from "@releaseguard/cra-rules";

/**
 * CRA rule evaluation tests.
 *
 * These tests verify that rules correctly produce Findings from Evidence,
 * covering the pass / fail / review paths.
 */
describe("CRA rules", () => {
  describe("CRA-VUL-001 — Known Vulnerable Dependencies", () => {
    it("produces a pass finding when no vulnerability evidence exists", () => {
      const finding = vulnerableDependenciesRule.evaluate([]);
      expect(finding.ruleId).toBe("CRA-VUL-001");
      expect(finding.status).toBe("pass");
    });

    it("produces a fail finding when vulnerability evidence is present", () => {
      const vulnEvidence: Evidence = {
        type: "vulnerability",
        source: "dependency-audit",
        location: "package.json",
        value: "lodash@4.17.20",
        metadata: { cve: "CVE-2021-23337" },
      };

      const finding = vulnerableDependenciesRule.evaluate([vulnEvidence]);
      expect(finding.status).toBe("fail");
      expect(finding.severity).toBe("critical");
      expect(finding.evidence).toContain(vulnEvidence);
      expect(finding.remediation).toBeTruthy();
    });

    it("counts multiple vulnerabilities in the description", () => {
      const makeVuln = (pkg: string): Evidence => ({
        type: "vulnerability",
        source: "dependency-audit",
        value: pkg,
      });

      const finding = vulnerableDependenciesRule.evaluate([
        makeVuln("lodash@4.17.20"),
        makeVuln("axios@0.21.0"),
      ]);

      expect(finding.status).toBe("fail");
      expect(finding.description).toContain("2 vulnerable");
    });
  });

  describe("CRA-SBOM-001 — Dependency Inventory", () => {
    it("produces a pass finding when dependency evidence is present", () => {
      const depEvidence: Evidence = {
        type: "dependency",
        source: "dependency-inventory",
        location: "package.json",
        value: "lodash@4.17.21",
      };

      const finding = dependencyInventoryRule.evaluate([depEvidence]);
      expect(finding.ruleId).toBe("CRA-SBOM-001");
      expect(finding.status).toBe("pass");
    });

    it("produces a review finding when no dependency evidence exists", () => {
      const finding = dependencyInventoryRule.evaluate([]);
      expect(finding.status).toBe("review");
      expect(finding.remediation).toBeTruthy();
    });

    it("ignores non-dependency evidence types", () => {
      const nonDepEvidence: Evidence[] = [
        { type: "vulnerability", source: "audit", value: "x" },
        { type: "file", source: "fs", location: "README.md" },
      ];

      const finding = dependencyInventoryRule.evaluate(nonDepEvidence);
      expect(finding.status).toBe("review");
    });
  });
});
