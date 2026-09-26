/**
 * Demo application entry point.
 *
 * This file exists to give ReleaseGuard a concrete target to analyze.
 *
 * It is intentionally minimal — the important part is the package.json
 * dependency on lodash@4.17.20 which contains known CVEs and will trigger
 * the CRA-VUL-001 (Known Vulnerable Dependencies) check to FAIL.
 *
 * Demo scenario:
 *
 *   Release A:
 *     lodash@4.17.20  →  ReleaseGuard: FAIL (CVE-2021-23337 etc.)
 *
 *   Developer fixes:
 *     lodash@4.17.21  →  ReleaseGuard: PASS
 */

import _ from "lodash";

const data = [1, 2, 3, 4, 5];
console.log("sum:", _.sum(data));
