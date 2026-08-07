/**
 * Tool Availability Module
 *
 * Checks for external tool availability and provides graceful degradation.
 * Tools are checked once and cached for the session.
 *
 * Supported tools:
 * - semantic-memory: Learning persistence with semantic search
 * - cass: Cross-agent session search for historical context
 * - hive: Git-backed issue tracking (primary)
 * - beads (bd): DEPRECATED - Use hive instead (kept for backward compatibility)
 * - swarm-mail: Embedded multi-agent coordination (PGLite-based)
 * - agent-mail: DEPRECATED - Legacy MCP server (use swarm-mail instead)
 */
export type ToolName = "semantic-memory" | "cass" | "hivemind" | "hive" | "beads" | "swarm-mail" | "agent-mail";
export interface ToolStatus {
    available: boolean;
    checkedAt: string;
    error?: string;
    version?: string;
}
export interface ToolAvailability {
    tool: ToolName;
    status: ToolStatus;
    fallbackBehavior: string;
}
/**
 * Check if a tool is available (cached)
 *
 * @param tool - Tool name to check
 * @returns Tool status
 */
export declare function checkTool(tool: ToolName): Promise<ToolStatus>;
/**
 * Check if a tool is available (simple boolean, cached)
 */
export declare function isToolAvailable(tool: ToolName): Promise<boolean>;
/**
 * Get full availability info including fallback behavior
 */
export declare function getToolAvailability(tool: ToolName): Promise<ToolAvailability>;
/**
 * Check all tools and return availability map
 */
export declare function checkAllTools(): Promise<Map<ToolName, ToolAvailability>>;
/**
 * Log a warning when a tool is missing.
 * Uses Set to deduplicate - logs once per tool per session to prevent spam
 * when tool availability is checked repeatedly.
 */
export declare function warnMissingTool(tool: ToolName): void;
/**
 * Require a tool - throws if not available
 *
 * Use this for tools that are mandatory for a feature.
 */
export declare function requireTool(tool: ToolName): Promise<void>;
/**
 * Execute with fallback - runs the action if tool available, otherwise runs fallback
 *
 * @param tool - Tool to check
 * @param action - Action to run if tool available
 * @param fallback - Fallback to run if tool not available
 * @returns Result from action or fallback
 */
export declare function withToolFallback<T>(tool: ToolName, action: () => Promise<T>, fallback: () => T | Promise<T>): Promise<T>;
/**
 * Execute if tool available, otherwise return undefined
 */
export declare function ifToolAvailable<T>(tool: ToolName, action: () => Promise<T>): Promise<T | undefined>;
/**
 * Reset the tool availability cache.
 * Use in tests to ensure fresh checks, or when tool availability may have
 * changed mid-session (e.g., after installing a tool via `bunx`).
 *
 * @example
 * // In tests
 * beforeEach(() => resetToolCache());
 *
 * @example
 * // After installing a tool
 * await installTool('semantic-memory');
 * resetToolCache();
 * const available = await isToolAvailable('semantic-memory');
 */
export declare function resetToolCache(): void;
/**
 * Format tool availability for display
 */
export declare function formatToolAvailability(availability: Map<ToolName, ToolAvailability>): string;
//# sourceMappingURL=tool-availability.d.ts.map