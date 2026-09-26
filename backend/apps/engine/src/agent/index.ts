import type { Evidence, Finding } from "@releaseguard/contracts";

/**
 * AgentAssessment is the structured output returned by the IBM Bob agent.
 *
 * The agent NEVER directly determines the ComplianceResult status.
 * It returns structured findings that the evaluator combines with
 * deterministic findings to produce the final result.
 *
 * This keeps the architecture deterministic around the AI component.
 */
export type AgentAssessment = {
  status: "pass" | "fail" | "review";

  findings: {
    ruleId: string;
    title: string;
    description: string;
    remediation?: string;
    /** 0–1 confidence score */
    confidence?: number;
  }[];

  /** Free-form reasoning trace — for human review, not for program logic */
  reasoning?: string;
};

/**
 * BobAgent is the interface for the IBM Bob reasoning component.
 *
 * The agent receives structured context (ReleaseRequest, ChangeAnalysis,
 * Evidence, relevant CRA rules) and returns a structured AgentAssessment.
 *
 * It does NOT return arbitrary free-form text as a final compliance decision.
 *
 * Implementation:
 *   See bob-agent.ts (not yet implemented)
 *   See prompts.ts for the prompt templates
 *   See tools.ts for the tools the agent can call
 */
export interface BobAgent {
  assess(context: AgentContext): Promise<AgentAssessment>;
}

export type AgentContext = {
  releaseRequest: import("@releaseguard/contracts").ReleaseRequest;
  changeAnalysis: import("../analyzer/index.js").ChangeAnalysis;
  evidence: Evidence[];
};
