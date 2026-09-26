import { describe, it, expect } from "vitest";
import type { ReleaseRequest, Evidence, Finding, ComplianceResult } from "./index.js";

/**
 * Contracts package compilation and type tests.
 * These verify the exported types can be used as intended.
 */
describe("contracts exports", () => {
  it("ReleaseRequest can be constructed", () => {
    const req: ReleaseRequest = {
      repository: { owner: "acme", name: "svc", url: "https://github.com/acme/svc" },
      baseCommit: "abc",
      headCommit: "def",
      target: { environment: "production" },
      policy: "EU_CRA",
    };
    expect(req.policy).toBe("EU_CRA");
  });

  it("Evidence accepts all types", () => {
    const types: Evidence["type"][] = [
      "file", "git_diff", "dependency", "vulnerability", "command", "agent_reasoning",
    ];
    types.forEach((type) => {
      const e: Evidence = { type, source: "test" };
      expect(e.type).toBe(type);
    });
  });

  it("Finding status values are correct", () => {
    const statuses: Finding["status"][] = ["pass", "fail", "review"];
    statuses.forEach((status) => {
      const f: Finding = {
        id: "x", ruleId: "y", severity: "high",
        status, title: "t", description: "d", evidence: [],
      };
      expect(f.status).toBe(status);
    });
  });

  it("ComplianceResult status values are correct", () => {
    const statuses: ComplianceResult["status"][] = ["PASS", "FAIL", "REVIEW"];
    statuses.forEach((status) => {
      const r: ComplianceResult = {
        status, policy: "EU_CRA",
        summary: { total: 0, passed: 0, failed: 0, review: 0 },
        findings: [], evidence: [],
        generatedAt: new Date().toISOString(),
        analysisId: "test",
      };
      expect(r.status).toBe(status);
    });
  });
});
