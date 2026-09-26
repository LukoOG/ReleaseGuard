/**
 * Evidence is a piece of observable, traceable data collected during analysis.
 *
 * Every meaningful compliance finding should be backed by evidence so that
 * the release decision is always explainable.
 *
 * Examples:
 *
 *   Vulnerable dependency:
 *     type: "vulnerability", source: "dependency-audit",
 *     location: "package.json", value: "lodash@4.17.20"
 *
 *   Changed file:
 *     type: "git_diff", source: "git",
 *     location: "src/auth/login.ts", value: "authentication flow changed"
 *
 *   IBM Bob reasoning:
 *     type: "agent_reasoning", source: "ibm-bob",
 *     value: "Change potentially affects cybersecurity risk assessment"
 *
 * Evidence must be collectable by deterministic checks — it must NOT require
 * an AI agent. AI reasoning is just one optional evidence type among many.
 */
export type Evidence = {
  /** Category of the collected evidence */
  type:
    | "file"
    | "git_diff"
    | "dependency"
    | "vulnerability"
    | "command"
    | "agent_reasoning";

  /** The tool or subsystem that produced this evidence */
  source: string;

  /** File path, URL, or other locator for the evidence */
  location?: string;

  /** Human-readable summary or raw value of the evidence */
  value?: string;

  /** Additional structured data specific to the evidence type */
  metadata?: Record<string, unknown>;
};
