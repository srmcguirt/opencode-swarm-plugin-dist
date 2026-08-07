/**
 * Planning Guardrails
 *
 * Detects when agents are about to make planning mistakes and warns them.
 * Non-blocking - just emits warnings to help agents self-correct.
 *
 * @module planning-guardrails
 */
/**
 * Result of analyzing todowrite args
 */
export interface TodoWriteAnalysis {
    /** Whether this looks like parallel work that should use swarm */
    looksLikeParallelWork: boolean;
    /** Number of todos that look like file modifications */
    fileModificationCount: number;
    /** Total number of todos */
    totalCount: number;
    /** Warning message if applicable */
    warning?: string;
}
/**
 * Analyze todowrite args to detect potential planning mistakes
 *
 * Triggers warning when:
 * - 6+ todos created in one call
 * - Most todos match file modification patterns
 * - Few todos match tracking patterns
 *
 * @param args - The todowrite tool arguments
 * @returns Analysis result with optional warning
 */
export declare function analyzeTodoWrite(args: {
    todos?: unknown[];
}): TodoWriteAnalysis;
/**
 * Check if a tool call should trigger planning guardrails
 *
 * @param toolName - Name of the tool being called
 * @returns Whether this tool should be analyzed
 */
export declare function shouldAnalyzeTool(toolName: string): boolean;
/**
 * Violation patterns for coordinator behavior detection
 *
 * These patterns identify when a coordinator is performing work
 * that should be delegated to worker agents.
 *
 * @example
 * ```ts
 * // Bad: Coordinator editing files
 * if (VIOLATION_PATTERNS.FILE_MODIFICATION_TOOLS.includes("edit")) { ... }
 *
 * // Good: Worker editing files
 * // (no violation when agentContext === "worker")
 * ```
 */
export declare const VIOLATION_PATTERNS: {
    /**
     * Tool names that modify files
     *
     * Coordinators should NEVER call these tools directly.
     * Workers reserve files and make modifications.
     */
    readonly FILE_MODIFICATION_TOOLS: readonly ["edit", "write"];
    /**
     * Tool names for file reservations
     *
     * Coordinators don't reserve files - workers do this
     * before editing to prevent conflicts.
     */
    readonly RESERVATION_TOOLS: readonly ["swarmmail_reserve", "agentmail_reserve"];
    /**
     * Regex patterns that indicate test execution in bash commands
     *
     * Coordinators review test results, workers run tests.
     * Matches common test runners and test file patterns.
     */
    readonly TEST_EXECUTION_PATTERNS: readonly [RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp, RegExp];
};
/**
 * Result of violation detection
 */
export interface ViolationDetectionResult {
    /** Whether a violation was detected */
    isViolation: boolean;
    /** Type of violation if detected */
    violationType?: "coordinator_edited_file" | "coordinator_ran_tests" | "coordinator_reserved_files" | "no_worker_spawned" | "worker_completed_without_review";
    /** Human-readable message */
    message?: string;
    /** Payload data for the violation */
    payload?: Record<string, unknown>;
}
/**
 * Detect coordinator violations in real-time
 *
 * Checks for patterns that indicate a coordinator is doing work
 * that should be delegated to workers:
 * 1. Edit/Write tool calls (coordinators plan, workers implement)
 * 2. Test execution (workers verify, coordinators review)
 * 3. File reservations (workers reserve before editing)
 * 4. No worker spawned after decomposition (coordinators must delegate)
 *
 * When a violation is detected, captures it via captureCoordinatorEvent().
 *
 * @param params - Detection parameters
 * @returns Violation detection result
 */
export declare function detectCoordinatorViolation(params: {
    sessionId: string;
    epicId: string;
    toolName: string;
    toolArgs: Record<string, unknown>;
    agentContext: "coordinator" | "worker";
    checkNoSpawn?: boolean;
}): ViolationDetectionResult;
/**
 * Coordinator context state
 *
 * Tracks whether the current session is acting as a swarm coordinator.
 * Set when an epic is created or when swarm tools are used.
 */
interface CoordinatorContext {
    /** Whether we're in coordinator mode */
    isCoordinator: boolean;
    /** Active epic ID if any */
    epicId?: string;
    /** Session ID for event capture */
    sessionId?: string;
    /** When coordinator mode was activated */
    activatedAt?: number;
}
/**
 * Set coordinator context
 *
 * Called when swarm coordination begins (e.g., after hive_create_epic or swarm_decompose).
 * If sessionId is provided, stores context scoped to that session.
 * Otherwise updates global context (backward compat).
 *
 * @param ctx - Coordinator context to set
 */
export declare function setCoordinatorContext(ctx: Partial<CoordinatorContext>): void;
/**
 * Get current coordinator context
 *
 * If sessionId provided, returns session-scoped context.
 * Otherwise returns global context (backward compat).
 *
 * @param sessionId - Optional session ID to get specific session context
 * @returns Current coordinator context state
 */
export declare function getCoordinatorContext(sessionId?: string): CoordinatorContext;
/**
 * Clear coordinator context
 *
 * If sessionId provided, clears only that session.
 * Otherwise clears global context (backward compat).
 *
 * @param sessionId - Optional session ID to clear specific session
 */
export declare function clearCoordinatorContext(sessionId?: string): void;
/**
 * Clear ALL coordinator contexts (global + all sessions)
 *
 * Use in tests or cleanup scenarios where you need a complete reset.
 */
export declare function clearAllCoordinatorContexts(): void;
/**
 * Check if we're in coordinator context
 *
 * Returns true if:
 * 1. Coordinator context was explicitly set
 * 2. Context was set within the last 4 hours (session timeout)
 *
 * If sessionId provided, checks session-scoped context.
 * Otherwise checks global context (backward compat).
 *
 * @param sessionId - Optional session ID to check specific session
 * @returns Whether we're currently in coordinator mode
 */
export declare function isInCoordinatorContext(sessionId?: string): boolean;
export {};
//# sourceMappingURL=planning-guardrails.d.ts.map