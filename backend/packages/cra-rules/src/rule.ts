import type { Evidence, Finding } from "@releaseguard/contracts";

/**
 * CraRule is the interface that every CRA compliance rule must satisfy.
 *
 * The engine asks: which rules are relevant? Then evaluates each relevant
 * rule against collected evidence to produce a Finding.
 *
 * Rule execution is separated from policy knowledge:
 *   - cra-rules knows WHAT to check (rule definitions)
 *   - engine/checks knows HOW to check it (execution)
 */
export interface CraRule {
  /** Unique rule identifier (e.g. "CRA-VUL-001") */
  id: string;

  /** Human-readable rule title */
  title: string;

  /**
   * Brief description of the CRA requirement this rule addresses.
   * Cite the relevant CRA article/annex where applicable.
   */
  description: string;

  /** Severity if this rule fails */
  severity: Finding["severity"];

  /**
   * Evaluate the rule against provided evidence and return a Finding.
   * Each rule is responsible for interpreting the evidence relevant to it.
   */
  evaluate(evidence: Evidence[]): Finding;
}
