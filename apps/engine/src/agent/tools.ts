/**
 * IBM Bob tool definitions.
 *
 * When the agent is implemented, these are the tools it can call
 * to gather additional information during reasoning.
 *
 * Planned tools:
 *
 *   get_changed_files
 *     Returns the list of changed files from ChangeAnalysis
 *
 *   get_file_content(path)
 *     Returns the content of a specific file for the agent to inspect
 *
 *   get_dependency_list
 *     Returns the full dependency inventory
 *
 *   get_vulnerability_list
 *     Returns known vulnerabilities for current dependencies
 *
 *   mark_finding(ruleId, status, description, confidence)
 *     Structured tool call for the agent to record a compliance finding
 *     This is how the agent submits findings without free-form text parsing
 */
