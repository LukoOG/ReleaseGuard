# ReleaseGuard

> **Turn regulatory cybersecurity requirements into an actionable software release workflow.**

ReleaseGuard is a CI/CD release gate that evaluates code changes against compliance policy before deployment. The initial policy domain is the **EU Cyber Resilience Act (EU CRA)**.

---

## Quick start

```bash
pnpm install
pnpm test
```

---

## Architecture

```
Developer
    │
    ▼
GitHub PR → GitHub Actions → ReleaseGuard
                                   │
                     ┌─────────────▼──────────────┐
                     │      ReleaseGuard Engine    │
                     │                             │
                     │  ChangeAnalyzer             │
                     │       │                     │
                     │  EvidenceCollectors          │
                     │       │                     │
                     │  ┌────┴────┐                │
                     │  │Determ.  │  IBM Bob Agent  │
                     │  │Checks   │  (AI-assisted)  │
                     │  └────┬────┘                │
                     │       │                     │
                     │  Evaluator                  │
                     │       │                     │
                     │  ComplianceResult           │
                     └─────────────────────────────┘
                                   │
                     PASS / FAIL / REVIEW
                                   │
                           GitHub Check
```

### Core design principle

The architecture separates **deterministic analysis** from **AI-assisted reasoning**:

| Deterministic | AI-assisted (IBM Bob) |
|---|---|
| Dependency audit | Cybersecurity risk assessment |
| Dependency inventory (SBOM) | Intended purpose classification |
| Git diff / changed files | Explains why a finding matters |
| Config file analysis | Generates remediation guidance |

IBM Bob is a **reasoning component inside the engine**, not the entire engine.

---

## Repository structure

```
releaseguard/
│
├── apps/
│   └── engine/               ← ReleaseGuard engine (Developer A)
│       ├── src/
│       │   ├── analyzer/     ← ChangeAnalyzer — what changed between commits
│       │   ├── evidence/     ← EvidenceCollectors — gather observable data
│       │   ├── checks/
│       │   │   ├── deterministic/   ← runs audit, parses manifests
│       │   │   └── ai-assisted/     ← IBM Bob checks (TODO)
│       │   ├── agent/        ← IBM Bob agent boundary (TODO)
│       │   ├── evaluator/    ← combines findings → ComplianceResult
│       │   └── index.ts      ← analyzeRelease() entry point
│       └── tests/
│
├── packages/
│   ├── contracts/            ← shared types: ReleaseRequest, ComplianceResult, etc.
│   └── cra-rules/            ← EU CRA rule definitions and evaluation logic
│
├── demo/
│   └── vulnerable-app/       ← demo target with intentional vulnerabilities
│
└── .github/workflows/        ← CI (Developer B — David Enenche)
```

---

## Packages

### `@releaseguard/contracts`

Shared data contracts between the engine (Developer A) and the CI/CD layer (Developer B).

- [`ReleaseRequest`](packages/contracts/src/release.ts) — input from the CI/CD layer
- [`Evidence`](packages/contracts/src/evidence.ts) — a traced, observable data item
- [`Finding`](packages/contracts/src/finding.ts) — result of evaluating one CRA rule
- [`ComplianceResult`](packages/contracts/src/result.ts) — final output of the engine

**This package must not contain business logic.**

### `@releaseguard/cra-rules`

EU CRA rule definitions. Each rule knows:
- what CRA requirement it addresses
- how to evaluate `Evidence[]` into a `Finding`

Implemented rules:

| Rule ID | Title | CRA Reference |
|---|---|---|
| `CRA-VUL-001` | Known Vulnerable Dependencies | Annex I, Part I §2 |
| `CRA-SBOM-001` | Dependency Inventory (SBOM) | Annex I, Part II §1 |

Planned:

| Rule ID | Title | Type |
|---|---|---|
| `CRA-UPD-001` | Security update mechanism | Deterministic |
| `CRA-CFG-001` | Secure defaults / configuration | Deterministic |
| `CRA-RISK-001` | Cybersecurity risk assessment impact | AI-assisted |
| `CRA-PURPOSE-001` | Intended purpose classification | AI-assisted |

### `@releaseguard/engine`

The engine itself. Entry point: [`analyzeRelease(request)`](apps/engine/src/index.ts).

```
ReleaseRequest
    │
    ▼
EvidenceCollectors (parallel)
    │
    ▼
Evaluator → runs checks → Findings
    │
    ▼
ComplianceResult
```

---

## Entry point

```ts
import { analyzeRelease } from "@releaseguard/engine";

const result = await analyzeRelease({
  repository: { owner: "acme", name: "api", url: "https://github.com/acme/api" },
  baseCommit: "abc123",
  headCommit: "def456",
  target: { environment: "production" },
  policy: "EU_CRA",
});

// result.status === "PASS" | "FAIL" | "REVIEW"
```

This will eventually be exposed as `POST /analyze-release` for the GitHub Actions integration.

---

## Developer responsibilities

| Area | Developer |
|---|---|
| Engine, CRA rules, IBM Bob | **Developer A** (this repo area) |
| GitHub Actions, PR comments, GitHub Checks, configuration | **Developer B — David Enenche** |

David's layer submits a `ReleaseRequest` to `analyzeRelease()` and consumes the `ComplianceResult`.

The mock fixture at [`apps/engine/tests/fixtures/release-request.ts`](apps/engine/tests/fixtures/release-request.ts) stands in for David's integration during development.

---

## Demo scenario

[`demo/vulnerable-app`](demo/vulnerable-app) is a minimal application with a known-vulnerable dependency (`lodash@4.17.20`, CVE-2021-23337).

When the `DependencyAuditCollector` is fully implemented:

```
Release A:  lodash@4.17.20  →  CRA-VUL-001: FAIL  →  ComplianceResult: FAIL
Developer updates to lodash@4.17.21
Release B:  lodash@4.17.21  →  CRA-VUL-001: PASS  →  ComplianceResult: PASS
```

---

## Next implementation step

> **Implement the ChangeAnalyzer and first real DependencyAuditCollector.**

1. [`apps/engine/src/analyzer/`](apps/engine/src/analyzer/index.ts) — implement `GitChangeAnalyzer` that shells out to `git diff`
2. [`apps/engine/src/evidence/dependency-audit.ts`](apps/engine/src/evidence/dependency-audit.ts) — implement `pnpm audit --json` parsing
3. [`apps/engine/src/evidence/dependency-inventory.ts`](apps/engine/src/evidence/dependency-inventory.ts) — parse `package.json` + lockfile
4. Hook these up in [`apps/engine/src/index.ts`](apps/engine/src/index.ts) replacing the stubs
5. Run against `demo/vulnerable-app` to produce the first real FAIL result

---

## Running tests

```bash
# All packages
pnpm test

# Engine only
cd apps/engine && pnpm test

# Watch mode
cd apps/engine && pnpm exec vitest
```
