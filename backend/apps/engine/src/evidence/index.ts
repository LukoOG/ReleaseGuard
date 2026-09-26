import type { Evidence } from "@releaseguard/contracts";

/**
 * EvidenceCollector is the interface all evidence collectors must implement.
 *
 * Each collector is responsible for gathering a specific type of evidence
 * from a specific source. The engine calls collect() on each registered
 * collector and aggregates the results.
 *
 * Planned implementations:
 *   DependencyAuditCollector  — runs `pnpm audit` / `npm audit`
 *   FilesystemCollector       — reads files from the repo
 *   GitDiffCollector          — collects git diff evidence
 *   BobReasoningCollector     — collects IBM Bob agent reasoning
 */
export interface EvidenceCollector {
  /**
   * Human-readable name for this collector (used in logging and debugging).
   */
  readonly name: string;

  /**
   * Collect evidence and return zero or more Evidence items.
   * Collectors should never throw — if collection fails, they return [].
   */
  collect(context: CollectionContext): Promise<Evidence[]>;
}

/**
 * Context passed to every evidence collector.
 * Contains everything a collector might need to do its work.
 */
export type CollectionContext = {
  repositoryPath: string;
  baseCommit: string;
  headCommit: string;
};
