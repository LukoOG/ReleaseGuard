/**
 * IBM Bob prompt templates.
 *
 * Each template produces a structured prompt for a specific reasoning task.
 * Templates receive typed context and return a string prompt.
 *
 * Guidelines:
 *   - Prompts should request structured JSON output, not free-form text
 *   - Always include the relevant CRA rule IDs in context
 *   - Ask for explicit confidence scores (0–1) alongside each finding
 *   - Instruct the model to use "review" when uncertain
 *
 * Planned prompts:
 *
 *   buildRiskAssessmentPrompt(context)
 *     Task: does this change affect the cybersecurity risk assessment?
 *     Returns: AgentAssessment JSON
 *
 *   buildIntendedPurposePrompt(context)
 *     Task: what is the intended purpose of this product/component?
 *     Returns: classification + rationale
 */
