/**
 * ReleaseRequest is the input submitted by the CI/CD layer (Developer B)
 * to the ReleaseGuard engine (Developer A).
 *
 * This is the primary API boundary between the two development workstreams.
 *
 * Future fields to consider (do not add yet):
 *   - triggeredBy: string          — actor who triggered the release
 *   - labels: string[]             — PR/release labels
 *   - prNumber: number             — GitHub PR number
 *   - changedFiles: string[]       — pre-computed file list (optimization)
 */
export type ReleaseRequest = {
  repository: {
    owner: string;
    name: string;
    url: string;
  };

  baseCommit: string;
  headCommit: string;

  target: {
    environment: "production" | "staging";
    /** AWS/GCP/Azure region — relevant for data residency requirements */
    region?: string;
  };

  /** Compliance policy to evaluate against. EU_CRA is the initial supported policy. */
  policy: "EU_CRA";

  metadata?: {
    productName?: string;
    version?: string;
  };
};
