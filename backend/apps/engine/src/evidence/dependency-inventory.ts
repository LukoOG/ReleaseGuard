import type { Evidence } from "@releaseguard/contracts";
import type { EvidenceCollector, CollectionContext } from "./index.js";

/**
 * DependencyInventoryCollector collects evidence of the dependency graph
 * by reading package manifests and lockfiles.
 *
 * Presence of a lockfile satisfies the SBOM / dependency inventory requirement.
 * The collector records each manifest it finds as Evidence.
 *
 * Currently a stub — full implementation will:
 *   1. Locate package.json files in the repository
 *   2. Parse dependency entries
 *   3. Emit one Evidence per dependency
 */
export class DependencyInventoryCollector implements EvidenceCollector {
  readonly name = "dependency-inventory";

  async collect(_context: CollectionContext): Promise<Evidence[]> {
    // TODO: parse package.json and lockfiles at repositoryPath
    // Return one Evidence per discovered dependency
    return [];
  }
}
