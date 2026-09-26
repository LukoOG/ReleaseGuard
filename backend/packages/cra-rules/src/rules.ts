import type { CraRule } from "./rule.js";

/**
 * Known Vulnerable Dependencies — CRA Annex I, Part I, §(2)
 *
 * Products with digital elements shall be delivered without known exploitable
 * vulnerabilities. Operators must address and remediate vulnerabilities
 * without delay.
 *
 * Check: does the dependency set contain packages with known CVEs?
 *
 * Implementation lives in: apps/engine/src/checks/deterministic/dependency-vulnerabilities.ts
 */
export const vulnerableDependenciesRule: CraRule = {
  id: "CRA-VUL-001",
  title: "Known Vulnerable Dependencies",
  description:
    "Products must not be released with known exploitable vulnerabilities " +
    "in their dependency tree (CRA Annex I, Part I §2). " +
    "All direct and transitive dependencies must be checked against " +
    "vulnerability databases (e.g. OSV, GitHub Advisory Database).",
  severity: "critical",

  evaluate(evidence) {
    const vulnEvidence = evidence.filter((e) => e.type === "vulnerability");

    if (vulnEvidence.length === 0) {
      return {
        id: `${this.id}-pass`,
        ruleId: this.id,
        severity: this.severity,
        status: "pass",
        title: this.title,
        description: "No known vulnerable dependencies detected.",
        evidence: [],
      };
    }

    return {
      id: `${this.id}-fail`,
      ruleId: this.id,
      severity: this.severity,
      status: "fail",
      title: this.title,
      description: `${vulnEvidence.length} vulnerable dependenc${vulnEvidence.length === 1 ? "y" : "ies"} detected.`,
      evidence: vulnEvidence,
      remediation:
        "Update the affected packages to a version that resolves the reported CVEs. " +
        "Run `pnpm audit` or `npm audit` for details.",
    };
  },
};

/**
 * Dependency Inventory (SBOM) — CRA Annex I, Part II, §(1)
 *
 * Manufacturers must identify and document components, including third-party
 * components, and draw up a software bill of materials.
 *
 * Check: is a machine-readable dependency inventory available?
 *
 * Implementation lives in: apps/engine/src/checks/deterministic/dependency-inventory.ts
 */
export const dependencyInventoryRule: CraRule = {
  id: "CRA-SBOM-001",
  title: "Dependency Inventory (SBOM)",
  description:
    "Manufacturers must maintain a software bill of materials covering all " +
    "third-party components (CRA Annex I, Part II §1). " +
    "A lockfile (pnpm-lock.yaml, package-lock.json) or explicit SBOM document " +
    "must be present and up-to-date.",
  severity: "high",

  evaluate(evidence) {
    const depEvidence = evidence.filter((e) => e.type === "dependency");

    if (depEvidence.length > 0) {
      return {
        id: `${this.id}-pass`,
        ruleId: this.id,
        severity: this.severity,
        status: "pass",
        title: this.title,
        description: `Dependency inventory found with ${depEvidence.length} entries.`,
        evidence: depEvidence,
      };
    }

    return {
      id: `${this.id}-review`,
      ruleId: this.id,
      severity: this.severity,
      status: "review",
      title: this.title,
      description:
        "No dependency inventory evidence was collected. " +
        "Verify that a lockfile or SBOM is present in the repository.",
      evidence: [],
      remediation:
        "Ensure a lockfile (e.g. pnpm-lock.yaml) is committed to the repository " +
        "and reflects the current dependency tree.",
    };
  },
};

/**
 * The ordered list of CRA rules that the engine should evaluate.
 *
 * Add new rules here as they are implemented.
 * The evaluator iterates this list and calls evaluate() on each rule.
 *
 * Planned rules (not yet implemented):
 *   CRA-UPD-001 — Security update mechanism
 *   CRA-CFG-001 — Secure defaults / security configuration
 *   CRA-RISK-001 — Cybersecurity risk assessment (AI-assisted)
 *   CRA-PURPOSE-001 — Intended purpose classification (AI-assisted)
 */
export const CRA_RULES: CraRule[] = [
  vulnerableDependenciesRule,
  dependencyInventoryRule,
];
