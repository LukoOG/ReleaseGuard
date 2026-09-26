import type { ComplianceResult, Finding, Evidence } from "@releaseguard/contracts";
import { randomUUID } from "crypto";

/**
 * ResultBuilder constructs a ComplianceResult from findings and evidence.
 *
 * The overall status is determined by the worst finding:
 *   - Any "fail" finding → FAIL
 *   - Any "review" finding (no fails) → REVIEW
 *   - All "pass" findings → PASS
 */
export function buildResult(
  findings: Finding[],
  evidence: Evidence[],
  policy: "EU_CRA",
): ComplianceResult {
  const passed = findings.filter((f) => f.status === "pass").length;
  const failed = findings.filter((f) => f.status === "fail").length;
  const review = findings.filter((f) => f.status === "review").length;

  let status: ComplianceResult["status"];
  if (failed > 0) {
    status = "FAIL";
  } else if (review > 0) {
    status = "REVIEW";
  } else {
    status = "PASS";
  }

  return {
    status,
    policy,
    summary: {
      total: findings.length,
      passed,
      failed,
      review,
    },
    findings,
    evidence,
    generatedAt: new Date().toISOString(),
    analysisId: randomUUID(),
  };
}
