/**
 * Coordinator Guard - Runtime Violation Enforcement
 *
 * Detects and REJECTS coordinator protocol violations at runtime.
 * Unlike planning-guardrails.ts (which only warns), this guard throws errors
 * to prevent coordinators from performing work that should be delegated to workers.
 *
 * Coordinators MUST:
 * - Spawn workers via swarm_spawn_subtask
 * - Review worker output via swarm_review
 * - Coordinate and monitor, not implement
 *
 * Coordinators MUST NOT:
 * - Edit or write files (use workers)
 * - Run tests (workers verify their own work)
 * - Reserve files (workers reserve before editing)
 *
 * @module coordinator-guard
 */
/**
 * Custom error for coordinator guard violations
 *
 * Thrown when a coordinator attempts to perform work that should be delegated to workers.
 * Includes helpful suggestions for the correct approach.
 */
export declare class CoordinatorGuardError extends Error {
    /** Type of violation that occurred */
    violationType: "coordinator_edited_file" | "coordinator_ran_tests" | "coordinator_reserved_files";
    /** Additional context about the violation */
    payload: Record<string, unknown>;
    /** Helpful suggestion for fixing the violation */
    suggestion?: string;
    constructor(message: string, violationType: "coordinator_edited_file" | "coordinator_ran_tests" | "coordinator_reserved_files", payload?: Record<string, unknown>, suggestion?: string);
}
/**
 * Result of coordinator guard check
 */
export interface GuardCheckResult {
    /** Whether the tool call is blocked */
    blocked: boolean;
    /** Error if blocked */
    error?: CoordinatorGuardError;
}
/**
 * Check if the current agent context is a coordinator
 *
 * @param agentContext - Agent context type
 * @returns True if coordinator, false otherwise
 */
export declare function isCoordinator(agentContext: "coordinator" | "worker" | string): agentContext is "coordinator";
/**
 * Check coordinator guard for potential violations
 *
 * This is the main entry point for the guard. It checks if the current tool call
 * violates coordinator protocol and returns a result indicating whether to block
 * the call and what error to throw.
 *
 * @param params - Guard check parameters
 * @returns Guard check result with block status and optional error
 *
 * @example
 * ```ts
 * const result = checkCoordinatorGuard({
 *   agentContext: "coordinator",
 *   toolName: "edit",
 *   toolArgs: { filePath: "src/auth.ts" },
 * });
 *
 * if (result.blocked) {
 *   throw result.error; // Prevents coordinator from editing files
 * }
 * ```
 */
export declare function checkCoordinatorGuard(params: {
    agentContext: "coordinator" | "worker" | string;
    toolName: string;
    toolArgs: Record<string, unknown>;
}): GuardCheckResult;
//# sourceMappingURL=coordinator-guard.d.ts.map