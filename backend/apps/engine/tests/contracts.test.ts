import { describe, it, expect } from "vitest";
import type { ReleaseRequest, Evidence, Finding, ComplianceResult } from "@releaseguard/contracts";

/**
 * Contract compilation tests.
 *
 * These tests verify that the shared contracts are correctly typed and that
 * valid objects can be constructed without TypeScript errors.
 * They are the first line of defense against breaking the API boundary.
 */
describe("contracts", () => {
  describe("ReleaseRequest", () => {
    it("accepts a valid production release request", () => {
      const req: ReleaseRequest = {
        repository: {
          owner: "acme",
          name: "my-service",
          url: "https://github.com/acme/my-service",
        },
        baseCommit: "abc123",
        headCommit: "def456",
        target: { environment: "production" },
        policy: "EU_CRA",
      };

      expect(req.policy).toBe("EU_CRA");
      expect(req.target.environment).toBe("production");
    });

    it("accepts optional metadata and region", () => {
      const req: ReleaseRequest = {
        repository: { owner: "a", name: "b", url: "https://example.com" },
        baseCommit: "x",
        headCommit: "y",
        target: { environment: "staging", region: "eu-west-1" },
        policy: "EU_CRA",
        metadata: { productName: "My App", version: "2.0.0" },
      };

      expect(req.metadata?.version).toBe("2.0.0");
      expect(req.target.region).toBe("eu-west-1");
    });
  });

  describe("Evidence", () => {
    it("accepts all evidence types", () => {
      const evidenceTypes: Evidence["type"][] = [
        "file",
        "git_diff",
        "dependency",
        "vulnerability",
        "command",
        "agent_reasoning",
      ];

      evidenceTypes.forEach((type) => {
        const e: Evidence = { type, source: "test" };
        expect(e.type).toBe(type);
      });
    });

    it("accepts full vulnerability evidence", () => {
      const e: Evidence = {
        type: "vulnerability",
        source: "dependency-audit",
        location: "package.json",
        value: "lodash@4.17.20",
        metadata: { cve: "CVE-2021-23337", severity: "high" },
      };

      expect(e.type).toBe("vulnerability");
      expect(e.metadata?.cve).toBe("CVE-2021-23337");
    });
  });

  describe("Finding", () => {
    it("accepts a failing finding with evidence", () => {
      const evidence: Evidence = {
        type: "vulnerability",
        source: "dependency-audit",
        value: "lodash@4.17.20",
      };

      const finding: Finding = {
        id: "CRA-VUL-001-fail",
        ruleId: "CRA-VUL-001",
        severity: "critical",
        status: "fail",
        title: "Known Vulnerable Dependencies",
        description: "1 vulnerable dependency detected.",
        evidence: [evidence],
        remediation: "Update lodash to >=4.17.21",
      };

      expect(finding.status).toBe("fail");
      expect(finding.evidence).toHaveLength(1);
    });

    it("accepts a review finding", () => {
      const finding: Finding = {
        id: "CRA-RISK-001-review",
        ruleId: "CRA-RISK-001",
        severity: "high",
        status: "review",
        title: "Cybersecurity Risk Assessment",
        description: "Human review required.",
        evidence: [],
        confidence: 0.4,
      };

      expect(finding.status).toBe("review");
      expect(finding.confidence).toBe(0.4);
    });
  });

  describe("ComplianceResult", () => {
    it("accepts a PASS result", () => {
      const result: ComplianceResult = {
        status: "PASS",
        policy: "EU_CRA",
        summary: { total: 2, passed: 2, failed: 0, review: 0 },
        findings: [],
        evidence: [],
        generatedAt: new Date().toISOString(),
        analysisId: "test-id",
      };

      expect(result.status).toBe("PASS");
    });

    it("accepts a FAIL result", () => {
      const result: ComplianceResult = {
        status: "FAIL",
        policy: "EU_CRA",
        summary: { total: 2, passed: 1, failed: 1, review: 0 },
        findings: [],
        evidence: [],
        generatedAt: new Date().toISOString(),
        analysisId: "test-id-2",
      };

      expect(result.status).toBe("FAIL");
      expect(result.summary.failed).toBe(1);
    });
  });
});
