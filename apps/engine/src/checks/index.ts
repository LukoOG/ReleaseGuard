import type { Finding, Evidence } from "@releaseguard/contracts";

/**
 * Check is the interface for a single executable compliance check.
 *
 * Checks are categorized as:
 *
 *   deterministic — the answer can be established reliably from data
 *                   (e.g. parse package.json, run audit, diff files)
 *
 *   ai-assisted   — contextual reasoning is required
 *                   (e.g. does this change affect cybersecurity risk?)
 *
 * All checks return a Finding. The evaluator decides how findings
 * combine into the final ComplianceResult — checks do not set the
 * overall release status.
 */
export interface Check {
  /** Rule ID this check implements (e.g. "CRA-VUL-001") */
  readonly ruleId: string;

  /** Human-readable name for logging */
  readonly name: string;

  run(context: CheckContext): Promise<Finding>;
}

/**
 * Context available to every check at run time.
 * Contains all evidence collected before checks are executed.
 */
export type CheckContext = {
  evidence: Evidence[];
};
