import type { Evidence } from "./evidence.js";

/**
 * A Finding represents the result of evaluating a single compliance rule.
 *
 * Status semantics:
 *   pass   — the requirement appears satisfied based on available evidence
 *   fail   — the requirement is violated; this is a blocking condition
 *   review — automated analysis cannot confidently determine compliance;
 *            requires human review before release
 *
 * Note: "review" is NOT a failure. The release-level status is determined
 * separately by the evaluator, which considers the full set of findings.
 *
 * confidence (0–1) indicates how certain the check is of its finding.
 * Only relevant for AI-assisted checks; deterministic checks should omit it
 * or use 1.0.
 */
export type Finding = {
  /** Unique identifier for this finding instance */
  id: string;

  /** The rule that produced this finding (e.g. "CRA-VUL-001") */
  ruleId: string;

  severity: "critical" | "high" | "medium" | "low";

  status: "pass" | "fail" | "review";

  title: string;
  description: string;

  /** Evidence that supports this finding */
  evidence: Evidence[];

  /** Actionable guidance for resolving a failing or review finding */
  remediation?: string;

  /** 0–1 confidence score; primarily used by AI-assisted checks */
  confidence?: number;
};
