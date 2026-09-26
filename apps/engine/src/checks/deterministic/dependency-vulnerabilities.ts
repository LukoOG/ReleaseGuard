import type { Finding } from "@releaseguard/contracts";
import type { Check, CheckContext } from "../index.js";
import { vulnerableDependenciesRule } from "@releaseguard/cra-rules";

/**
 * DependencyVulnerabilityCheck is the deterministic check for CRA-VUL-001.
 *
 * It delegates the finding logic to the rule definition in cra-rules,
 * keeping policy knowledge (what counts as a violation) separate from
 * execution logic (how to run the check).
 *
 * Input:  vulnerability Evidence items collected by DependencyAuditCollector
 * Output: a Finding with status pass | fail
 */
export class DependencyVulnerabilityCheck implements Check {
  readonly ruleId = vulnerableDependenciesRule.id;
  readonly name = "Dependency Vulnerability Check";

  async run(context: CheckContext): Promise<Finding> {
    return vulnerableDependenciesRule.evaluate(context.evidence);
  }
}
