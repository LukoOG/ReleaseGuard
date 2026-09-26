import type { ReleaseRequest, ComplianceResult, Evidence } from "@releaseguard/contracts";
import type { CollectionContext } from "./evidence/index.js";
import { DependencyAuditCollector } from "./evidence/dependency-audit.js";
import { DependencyInventoryCollector } from "./evidence/dependency-inventory.js";
import { DependencyVulnerabilityCheck } from "./checks/deterministic/dependency-vulnerabilities.js";
import { DependencyInventoryCheck } from "./checks/deterministic/dependency-inventory.js";
import { Evaluator } from "./evaluator/index.js";

export type { ReleaseRequest, ComplianceResult } from "@releaseguard/contracts";

/**
 * analyzeRelease is the primary entry point for the ReleaseGuard engine.
 *
 * It receives a ReleaseRequest from the CI/CD layer and returns a
 * ComplianceResult that the release gate uses to pass or block deployment.
 *
 * Processing pipeline:
 *
 *   ReleaseRequest
 *       ↓
 *   ChangeAnalyzer          (TODO: implement GitChangeAnalyzer)
 *       ↓
 *   EvidenceCollectors      (deterministic — audit, inventory, git diff)
 *       ↓
 *   Bob Agent               (TODO: implement AI-assisted checks)
 *       ↓
 *   Evaluator               (combines all findings → ComplianceResult)
 *       ↓
 *   ComplianceResult
 *
 * @param request  The release being evaluated.
 * @param options  Optional overrides for testing (e.g. repositoryPath).
 */
export async function analyzeRelease(
  request: ReleaseRequest,
  options: { repositoryPath?: string } = {},
): Promise<ComplianceResult> {
  const repositoryPath =
    options.repositoryPath ?? process.cwd();

  // ── 1. Evidence Collection ─────────────────────────────────────────────
  // Each collector gathers a specific type of evidence independently.
  // Collectors never throw — failed collection returns [].

  const collectionContext: CollectionContext = {
    repositoryPath,
    baseCommit: request.baseCommit,
    headCommit: request.headCommit,
  };

  const collectors = [
    new DependencyAuditCollector(),
    new DependencyInventoryCollector(),
  ];

  const evidenceArrays = await Promise.all(
    collectors.map((c) => c.collect(collectionContext)),
  );
  const evidence: Evidence[] = evidenceArrays.flat();

  // ── 2. Evaluation ──────────────────────────────────────────────────────
  // The evaluator runs all registered checks against the collected evidence
  // and produces the final ComplianceResult.
  // Checks delegate policy logic to the cra-rules package.

  const checks = [
    new DependencyVulnerabilityCheck(),
    new DependencyInventoryCheck(),
  ];

  const evaluator = new Evaluator(checks);
  return evaluator.evaluate(evidence, request.policy);
}
