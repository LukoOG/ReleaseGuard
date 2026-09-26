import type { Evidence } from "@releaseguard/contracts";
import type { EvidenceCollector, CollectionContext } from "./index.js";

/**
 * DependencyAuditCollector collects vulnerability evidence by auditing
 * the project's dependency manifest.
 *
 * Currently a stub — returns mock evidence so the engine can run end-to-end.
 * Full implementation will shell out to `pnpm audit --json` or equivalent.
 *
 * Next steps:
 *   1. Shell out to `pnpm audit --json`
 *   2. Parse the JSON output
 *   3. Map each advisory to an Evidence item with the CVE as metadata
 */
export class DependencyAuditCollector implements EvidenceCollector {
  readonly name = "dependency-audit";

  async collect(_context: CollectionContext): Promise<Evidence[]> {
    // TODO: implement real audit by shelling out to `pnpm audit --json`
    // For now, return an empty array — no vulnerabilities claimed
    return [];
  }
}
