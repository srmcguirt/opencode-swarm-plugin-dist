/**
 * Hook Constants
 *
 * Defines which OpenCode tools are hooked for observability.
 * Used by the plugin to identify tool calls that should trigger
 * tool.execute.after hooks for logging, learning, and analytics.
 */
export declare const HIVE_TOOLS: readonly ["hive_create", "hive_update", "hive_close", "hive_start", "hive_ready", "hive_query", "hive_sync", "hive_cells", "hive_create_epic"];
export declare const SWARM_TOOLS: readonly ["swarm_spawn_subtask", "swarm_complete", "swarm_progress", "swarm_status", "swarm_record_outcome"];
export declare const SWARMMAIL_TOOLS: readonly ["swarmmail_init", "swarmmail_send", "swarmmail_reserve", "swarmmail_release", "swarmmail_release_all", "swarmmail_release_agent", "swarmmail_inbox"];
export declare const ALL_HOOKED_TOOLS: readonly ["hive_create", "hive_update", "hive_close", "hive_start", "hive_ready", "hive_query", "hive_sync", "hive_cells", "hive_create_epic", "swarm_spawn_subtask", "swarm_complete", "swarm_progress", "swarm_status", "swarm_record_outcome", "swarmmail_init", "swarmmail_send", "swarmmail_reserve", "swarmmail_release", "swarmmail_release_all", "swarmmail_release_agent", "swarmmail_inbox"];
export type HookedTool = (typeof ALL_HOOKED_TOOLS)[number];
/**
 * Type guard to check if a tool name is a hooked tool.
 *
 * @param name - The tool name to check
 * @returns true if the tool is hooked, false otherwise
 *
 * @example
 * ```typescript
 * if (isHookedTool(toolName)) {
 *   // toolName is narrowed to HookedTool
 *   recordToolExecution(toolName);
 * }
 * ```
 */
export declare function isHookedTool(name: string): name is HookedTool;
//# sourceMappingURL=constants.d.ts.map