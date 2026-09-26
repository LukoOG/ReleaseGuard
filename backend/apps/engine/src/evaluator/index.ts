import type { ComplianceResult, Evidence, Finding } from "@releaseguard/contracts";
import type { Check, CheckContext } from "../checks/index.js";
import { buildResult } from "./result-builder.js";

/**
 * Evaluator runs all registered checks and combines their findings into
 * a single ComplianceResult.
 *
 * The evaluator is the only component that determines the overall release
 * status. Individual checks produce Findings; the evaluator aggregates them.
 *
 * Future responsibilities:
 *   - Deduplicate overlapping findings
 *   - Weight AI-assisted findings by confidence score
 *   - Apply policy-level overrides (e.g. critical vulns always FAIL)
 */
export class Evaluator {
  constructor(private readonly checks: Check[]) {}

  async evaluate(
    evidence: Evidence[],
    policy: "EU_CRA",
  ): Promise<ComplianceResult> {
    const context: CheckContext = { evidence };

    const findings: Finding[] = await Promise.all(
      this.checks.map((check) => check.run(context)),
    );

    return buildResult(findings, evidence, policy);
  }
}
