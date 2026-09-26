import type { Finding } from "./finding.js";
import type { Evidence } from "./evidence.js";

/**
 * ComplianceResult is the final output of the ReleaseGuard engine.
 *
 * It is consumed by the CI/CD layer (Developer B) to determine whether
 * to pass or block the release gate.
 *
 * Status semantics:
 *   PASS   — no blocking findings and no unresolved review conditions
 *   FAIL   — one or more blocking compliance or security findings
 *   REVIEW — automated analysis cannot safely establish release status;
 *            human review is required before deployment
 */
export type ComplianceResult = {
  status: "PASS" | "FAIL" | "REVIEW";

  /** The compliance policy that was evaluated */
  policy: "EU_CRA";

  summary: {
    total: number;
    passed: number;
    failed: number;
    review: number;
  };

  findings: Finding[];

  /** All evidence collected during the analysis */
  evidence: Evidence[];

  /** ISO 8601 timestamp of when this result was generated */
  generatedAt: string;

  /** Unique identifier for this analysis run */
  analysisId: string;
};
