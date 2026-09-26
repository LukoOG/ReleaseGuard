import { describe, it, expect } from "vitest";
import { CRA_RULES, vulnerableDependenciesRule, dependencyInventoryRule } from "./index.js";

describe("cra-rules exports", () => {
  it("exports two rules", () => {
    expect(CRA_RULES).toHaveLength(2);
  });

  it("vulnerableDependenciesRule has correct id and severity", () => {
    expect(vulnerableDependenciesRule.id).toBe("CRA-VUL-001");
    expect(vulnerableDependenciesRule.severity).toBe("critical");
  });

  it("dependencyInventoryRule has correct id and severity", () => {
    expect(dependencyInventoryRule.id).toBe("CRA-SBOM-001");
    expect(dependencyInventoryRule.severity).toBe("high");
  });
});
