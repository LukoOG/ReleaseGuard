import { describe, it, expect } from "vitest";
import { analyzeRelease } from "../src/index.js";
import { mockReleaseRequest } from "./fixtures/release-request.js";

/**
 * End-to-end engine integration test.
 *
 * Exercises the full analyzeRelease() pipeline using the mock release request.
 * Because the collectors are currently stubs (returning []), the result will
 * be REVIEW (no dependency evidence collected → CRA-SBOM-001 is "review").
 *
 * As collectors are implemented, this test will naturally evolve to reflect
 * real analysis against the demo/vulnerable-app repository.
 */
describe("analyzeRelease (integration)", () => {
  it("returns a valid ComplianceResult for the mock release request", async () => {
    const result = await analyzeRelease(mockReleaseRequest);

    expect(result.policy).toBe("EU_CRA");
    expect(["PASS", "FAIL", "REVIEW"]).toContain(result.status);
    expect(result.findings.length).toBeGreaterThan(0);
    expect(result.analysisId).toBeTruthy();
    expect(result.generatedAt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
    expect(result.summary.total).toBe(result.findings.length);
    expect(
      result.summary.passed + result.summary.failed + result.summary.review,
    ).toBe(result.summary.total);
  });

  it("includes CRA-VUL-001 and CRA-SBOM-001 findings", async () => {
    const result = await analyzeRelease(mockReleaseRequest);
    const ruleIds = result.findings.map((f) => f.ruleId);

    expect(ruleIds).toContain("CRA-VUL-001");
    expect(ruleIds).toContain("CRA-SBOM-001");
  });
});
