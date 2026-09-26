/**
 * ChangeAnalysis is the output of the ChangeAnalyzer.
 *
 * It captures observable repository changes between baseCommit and headCommit.
 * The engine uses this to determine which evidence to collect and which rules
 * may be relevant.
 *
 * Future additions (do not add yet):
 *   - commitMessages: string[]
 *   - affectedPackages: string[]  (for monorepos)
 *   - testResultsChanged: boolean
 */
export type ChangeAnalysis = {
  changedFiles: string[];
  addedFiles: string[];
  removedFiles: string[];
  modifiedFiles: string[];

  /** Indicates whether any dependency manifest or lockfile changed */
  dependencyChanges: string[];

  /**
   * Files identified as potentially security-relevant by heuristic rules.
   * Examples: auth files, crypto, configuration, dependency manifests.
   * IBM Bob will later reason over these to assess CRA risk impact.
   */
  securityRelevantFiles: string[];
};

/**
 * ChangeAnalyzer determines what changed between two commits.
 *
 * In the full implementation this will shell out to git or use the GitHub API.
 * For now it exposes a clean interface that the engine can depend on.
 *
 * Implementations:
 *   GitChangeAnalyzer     — shells out to `git diff` (planned)
 *   MockChangeAnalyzer    — test doubles using local fixtures (used in tests)
 */
export interface ChangeAnalyzer {
  analyze(
    baseCommit: string,
    headCommit: string,
    repositoryPath?: string,
  ): Promise<ChangeAnalysis>;
}

/**
 * Heuristic patterns that suggest a file may be security-relevant.
 * Used by implementations to populate ChangeAnalysis.securityRelevantFiles.
 */
export const SECURITY_RELEVANT_PATTERNS: RegExp[] = [
  /auth/i,
  /crypto/i,
  /crypt/i,
  /password/i,
  /secret/i,
  /token/i,
  /key/i,
  /cert/i,
  /tls/i,
  /ssl/i,
  /login/i,
  /session/i,
  /permission/i,
  /access/i,
  /package\.json$/,
  /pnpm-lock\.yaml$/,
  /yarn\.lock$/,
  /package-lock\.json$/,
  /Dockerfile/,
  /\.env/,
];

/**
 * Returns true if the given file path matches any security-relevant pattern.
 */
export function isSecurityRelevant(filePath: string): boolean {
  return SECURITY_RELEVANT_PATTERNS.some((pattern) => pattern.test(filePath));
}
