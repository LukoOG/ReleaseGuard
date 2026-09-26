/**
 * AI-assisted checks — placeholder module.
 *
 * These checks require IBM Bob to reason over structured context and return
 * structured assessments. They are NOT implemented yet.
 *
 * Planned checks:
 *
 *   CRA-RISK-001 — Cybersecurity risk assessment impact
 *     Given: ChangeAnalysis, Evidence
 *     Ask Bob: does this change potentially affect the cybersecurity risk profile?
 *
 *   CRA-PURPOSE-001 — Intended purpose classification
 *     Given: repository metadata, changed components
 *     Ask Bob: what is the intended purpose of this product/component?
 *
 * See apps/engine/src/agent/ for the IBM Bob agent boundary.
 *
 * When implementing:
 *   1. Add a BobReasoningCollector in evidence/ to gather agent_reasoning Evidence
 *   2. Create the check class here that runs the Bob agent
 *   3. Map the AgentAssessment to a Finding
 *   4. Register the check in apps/engine/src/index.ts
 */
