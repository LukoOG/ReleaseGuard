import type { Finding } from "@releaseguard/contracts";
import type { Check, CheckContext } from "../index.js";
import { dependencyInventoryRule } from "@releaseguard/cra-rules";

/**
 * DependencyInventoryCheck is the deterministic check for CRA-SBOM-001.
 *
 * It delegates the finding logic to the rule definition in cra-rules.
 *
 * Input:  dependency Evidence items collected by DependencyInventoryCollector
 * Output: a Finding with status pass | review
 */
export class DependencyInventoryCheck implements Check {
  readonly ruleId = dependencyInventoryRule.id;
  readonly name = "Dependency Inventory Check";

  async run(context: CheckContext): Promise<Finding> {
    return dependencyInventoryRule.evaluate(context.evidence);
  }
}
