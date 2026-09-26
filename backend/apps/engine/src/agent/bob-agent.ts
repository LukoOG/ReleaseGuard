import type { BobAgent, AgentAssessment, AgentContext } from "./index.js";

/**
 * BobAgentImpl — IBM Bob integration (NOT YET IMPLEMENTED).
 *
 * When implemented this class will:
 *   1. Build a structured prompt using templates from prompts.ts
 *   2. Call the IBM Bob API with structured context
 *   3. Parse the response using tools defined in tools.ts
 *   4. Return a typed AgentAssessment
 *
 * Integration notes:
 *   - Use the IBM Bob Agents SDK / watsonx.ai API
 *   - The agent should use structured output (JSON mode or tool calls)
 *   - Never parse compliance decisions from free-form text
 *   - Wrap every API call in try/catch; return status: "review" on failure
 */
export class BobAgentImpl implements BobAgent {
  async assess(_context: AgentContext): Promise<AgentAssessment> {
    throw new Error(
      "BobAgent not yet implemented. " +
        "See apps/engine/src/agent/bob-agent.ts for implementation guidance.",
    );
  }
}
