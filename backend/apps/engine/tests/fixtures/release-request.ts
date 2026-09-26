import type { ReleaseRequest } from "@releaseguard/contracts";

/**
 * mockReleaseRequest is a local development fixture that stands in for
 * the ReleaseRequest that Developer B (David) will eventually submit
 * from the GitHub Actions integration.
 *
 * This is temporary development infrastructure.
 * Do not add GitHub authentication or repository fetching here.
 */
export const mockReleaseRequest: ReleaseRequest = {
  repository: {
    owner: "demo",
    name: "vulnerable-app",
    url: "https://github.com/demo/vulnerable-app",
  },

  baseCommit: "base-commit",
  headCommit: "head-commit",

  target: {
    environment: "production",
    region: "eu-west-1",
  },

  policy: "EU_CRA",

  metadata: {
    productName: "Demo Application",
    version: "1.0.0",
  },
};

/**
 * A release request targeting staging (lower severity expectations in future).
 */
export const mockStagingReleaseRequest: ReleaseRequest = {
  ...mockReleaseRequest,
  target: {
    environment: "staging",
  },
};
