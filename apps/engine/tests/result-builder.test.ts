import { describe, it, expect } from "vitest";
import type { Finding, Evidence } from "@releaseguard/contracts";
import { buildResult } from "../src/evaluator/result-builder.js";

/**
 * Result builder / evaluator tests.
 *
 * Verifies that the correct overall ComplianceResult status is produced
 * for all combinations of finding statuses.
 */
describe("result builder", () => {
  const makeFind = (status: Finding["status"]): Finding => ({
    id: `test-${status}`,
    ruleId: "CRA-TEST-001",
    severity: "high",
    status,
    title: "Test finding",
    description: "Test",
    evidence: [],
  });

  it("produces PASS when all findings pass", () => {
    const result = buildResult(
      [makeFind("pass"), makeFind("pass")],
      [],
      "EU_CRA",
    );
    expect(result.status).toBe("PASS");
    expect(result.summary).toEqual({ total: 2, passed: 2, failed: 0, review: 0 });
  });

  it("produces FAIL when any finding fails", () => {
    const result = buildResult(
      [makeFind("pass"), makeFind("fail")],
      [],
      "EU_CRA",
    );
    expect(result.status).toBe("FAIL");
    expect(result.summary.failed).toBe(1);
  });

  it("produces FAIL even when there are also review findings", () => {
    const result = buildResult(
      [makeFind("fail"), makeFind("review"), makeFind("pass")],
      [],
      "EU_CRA",
    );
    expect(result.status).toBe("FAIL");
  });

  it("produces REVIEW when there are review findings but no failures", () => {
    const result = buildResult(
      [makeFind("pass"), makeFind("review")],
      [],
      "EU_CRA",
    );
    expect(result.status).toBe("REVIEW");
    expect(result.summary).toEqual({ total: 2, passed: 1, failed: 0, review: 1 });
  });

  it("sets policy, generatedAt, and analysisId", () => {
    const result = buildResult([], [], "EU_CRA");
    expect(result.policy).toBe("EU_CRA");
    expect(result.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(result.analysisId).toBeTruthy();
  });

  it("passes evidence through to the result", () => {
    const evidence: Evidence[] = [
      { type: "dependency", source: "inventory", value: "lodash@4.17.21" },
    ];
    const result = buildResult([], evidence, "EU_CRA");
    expect(result.evidence).toHaveLength(1);
  });
});
