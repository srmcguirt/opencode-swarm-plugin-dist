/**
 * Swarm Insights Data Layer
 *
 * Aggregates insights from swarm coordination for prompt injection.
 * Provides concise, context-efficient summaries for coordinators and workers.
 *
 * Data sources:
 * - Event store (subtask_outcome, eval_finalized)
 * - Semantic memory (file-specific learnings)
 * - Anti-pattern registry
 */
import { type SwarmMailAdapter } from "swarm-mail";
export interface StrategyInsight {
    strategy: string;
    successRate: number;
    totalAttempts: number;
    recommendation: string;
}
export interface FileInsight {
    file: string;
    failureCount: number;
    lastFailure: string | null;
    gotchas: string[];
}
export interface FileFailureHistory {
    file: string;
    rejectionCount: number;
    topIssues: string[];
}
export interface PatternInsight {
    pattern: string;
    frequency: number;
    recommendation: string;
}
export interface InsightsBundle {
    strategies?: StrategyInsight[];
    files?: FileInsight[];
    patterns?: PatternInsight[];
}
export interface FormatOptions {
    maxTokens?: number;
}
export interface RejectionReason {
    category: string;
    count: number;
    percentage: number;
}
export interface RejectionAnalytics {
    totalReviews: number;
    approved: number;
    rejected: number;
    approvalRate: number;
    topReasons: RejectionReason[];
}
export interface ViolationMetric {
    violationType: string;
    count: number;
    percentage: number;
}
export interface ViolationAnalytics {
    totalViolations: number;
    byType: ViolationMetric[];
    violationRate: number;
}
/**
 * Get strategy success rates and recommendations for a task.
 *
 * Queries the event store for subtask_outcome events and calculates
 * success rates by strategy. Returns recommendations based on historical data.
 *
 * @param swarmMail - SwarmMail adapter for database access
 * @param _task - Task description (currently unused, reserved for future filtering)
 * @returns Promise resolving to array of strategy insights with success rates and recommendations
 *
 * @example
 * ```typescript
 * const insights = await getStrategyInsights(swarmMail, "Add authentication");
 * // Returns: [
 * //   { strategy: "file-based", successRate: 85.5, totalAttempts: 12, recommendation: "..." },
 * //   { strategy: "feature-based", successRate: 65.0, totalAttempts: 8, recommendation: "..." }
 * // ]
 * ```
 */
export declare function getStrategyInsights(swarmMail: SwarmMailAdapter, _task: string): Promise<StrategyInsight[]>;
/**
 * Get insights for specific files based on historical outcomes.
 *
 * Queries the event store for failures involving these files and
 * semantic memory for file-specific gotchas.
 *
 * @param swarmMail - SwarmMail adapter for database access
 * @param files - Array of file paths to analyze
 * @returns Promise resolving to array of file-specific insights including failure counts and gotchas
 *
 * @example
 * ```typescript
 * const insights = await getFileInsights(swarmMail, ["src/auth.ts", "src/db.ts"]);
 * // Returns: [
 * //   { file: "src/auth.ts", failureCount: 3, lastFailure: "2025-12-20T10:30:00Z", gotchas: [...] }
 * // ]
 * ```
 */
export declare function getFileInsights(swarmMail: SwarmMailAdapter, files: string[]): Promise<FileInsight[]>;
/**
 * Get file-specific gotchas from semantic memory (hivemind).
 *
 * Queries semantic memory for learnings related to a specific file.
 * Used in worker prompts to surface historical issues/warnings.
 *
 * Strategy:
 * 1. Query hivemind with file path + "gotcha pitfall warning" keywords
 * 2. Filter results to only include memories that mention the specific file
 * 3. Return top 3 learnings, truncated to ~100 chars each for context efficiency
 *
 * @param _swarmMail - SwarmMail adapter (unused, kept for API consistency)
 * @param file - File path to query learnings for
 * @returns Promise resolving to array of gotcha strings (max 3)
 *
 * @example
 * ```typescript
 * const gotchas = await getFileGotchas(swarmMail, "src/auth.ts");
 * // Returns semantic memory learnings like:
 * // ["OAuth tokens need 5min buffer before expiry to avoid race conditions in src/auth.ts", ...]
 * ```
 */
export declare function getFileGotchas(_swarmMail: SwarmMailAdapter, file: string): Promise<string[]>;
/**
 * Get failure history for specific files from review feedback events.
 *
 * Queries the event store for review_feedback events where status="needs_changes"
 * and aggregates rejection reasons by file. Returns top 3 most common issues per file.
 *
 * @param swarmMail - SwarmMail adapter for database access
 * @param files - Array of file paths to query history for
 * @returns Promise resolving to array of file failure histories with rejection counts and top issues
 *
 * @example
 * ```typescript
 * const history = await getFileFailureHistory(swarmMail, ["src/auth.ts", "src/db.ts"]);
 * // Returns: [
 * //   { file: "src/auth.ts", rejectionCount: 3, topIssues: ["Missing null checks", "Forgot rate limiting"] }
 * // ]
 * ```
 */
export declare function getFileFailureHistory(swarmMail: SwarmMailAdapter, files: string[]): Promise<FileFailureHistory[]>;
/**
 * Get rejection analytics from review feedback events.
 *
 * Analyzes review_feedback events to calculate approval/rejection rates and
 * categorize common rejection reasons. Returns aggregated analytics suitable
 * for the swarm stats --rejections dashboard.
 *
 * @param swarmMail - SwarmMail adapter for database access
 * @returns Promise resolving to rejection analytics with rates and categorized reasons
 *
 * @example
 * ```typescript
 * const analytics = await getRejectionAnalytics(swarmMail);
 * // Returns: {
 * //   totalReviews: 449,
 * //   approved: 175,
 * //   rejected: 274,
 * //   approvalRate: 38.97,
 * //   topReasons: [
 * //     { category: "Missing tests", count: 89, percentage: 32.48 },
 * //     { category: "Type errors", count: 67, percentage: 24.45 }
 * //   ]
 * // }
 * ```
 */
export declare function getRejectionAnalytics(swarmMail: SwarmMailAdapter): Promise<RejectionAnalytics>;
/**
 * Get common failure patterns and anti-patterns.
 *
 * Analyzes event store for recurring failure patterns and
 * queries the anti-pattern registry.
 *
 * @param swarmMail - SwarmMail adapter for database access
 * @returns Promise resolving to array of pattern insights with frequency and recommendations
 *
 * @example
 * ```typescript
 * const patterns = await getPatternInsights(swarmMail);
 * // Returns: [
 * //   { pattern: "type_error", frequency: 5, recommendation: "Add explicit type annotations and null checks" },
 * //   { pattern: "timeout", frequency: 3, recommendation: "Consider breaking into smaller tasks" }
 * // ]
 * ```
 */
export declare function getPatternInsights(swarmMail: SwarmMailAdapter): Promise<PatternInsight[]>;
/**
 * Format insights bundle for prompt injection.
 *
 * Produces a concise, context-efficient summary suitable for
 * inclusion in coordinator or worker prompts.
 *
 * @param bundle - Insights bundle containing strategies, files, and patterns
 * @param options - Formatting options (maxTokens defaults to 500)
 * @returns Formatted markdown string for prompt injection, or empty string if no insights
 *
 * @example
 * ```typescript
 * const bundle = {
 *   strategies: [{ strategy: "file-based", successRate: 85.5, totalAttempts: 12, recommendation: "..." }],
 *   files: [{ file: "src/auth.ts", failureCount: 2, lastFailure: null, gotchas: [] }],
 *   patterns: [{ pattern: "type_error", frequency: 3, recommendation: "Add type checks" }]
 * };
 * const formatted = formatInsightsForPrompt(bundle, { maxTokens: 300 });
 * // Returns formatted markdown with top 3 strategies, top 5 files, top 3 patterns
 * ```
 */
export declare function formatInsightsForPrompt(bundle: InsightsBundle, options?: FormatOptions): string;
/**
 * Get cached insights or compute fresh ones.
 *
 * Simple in-memory cache with 5-minute TTL to avoid redundant database queries.
 *
 * @param _swarmMail - SwarmMail adapter (currently unused, reserved for future cache invalidation)
 * @param cacheKey - Unique key for caching (e.g., "strategies:task-name" or "files:src/auth.ts")
 * @param computeFn - Function to compute fresh insights if cache miss
 * @returns Promise resolving to cached or freshly computed insights bundle
 *
 * @example
 * ```typescript
 * const insights = await getCachedInsights(
 *   swarmMail,
 *   "strategies:add-auth",
 *   async () => ({
 *     strategies: await getStrategyInsights(swarmMail, "add auth"),
 *   })
 * );
 * // First call: computes and caches. Subsequent calls within 5min: returns cached.
 * ```
 */
export declare function getCachedInsights(_swarmMail: SwarmMailAdapter, cacheKey: string, computeFn: () => Promise<InsightsBundle>): Promise<InsightsBundle>;
/**
 * Clear the insights cache.
 *
 * Useful for testing or forcing fresh insights computation.
 *
 * @returns void
 *
 * @example
 * ```typescript
 * clearInsightsCache();
 * // All cached insights invalidated, next getCachedInsights() will recompute
 * ```
 */
export declare function clearInsightsCache(): void;
/**
 * Track a coordinator violation event in the event store.
 *
 * Records when a coordinator attempts forbidden actions (editing files,
 * running tests, reserving files). These events feed violation analytics
 * for swarm health monitoring.
 *
 * @param swarmMail - SwarmMail adapter for database access
 * @param violation - Violation details
 * @returns Promise resolving to event ID
 *
 * @example
 * ```typescript
 * import { CoordinatorGuardError } from "./coordinator-guard";
 *
 * try {
 *   // Coordinator attempts to edit file
 * } catch (error) {
 *   if (error instanceof CoordinatorGuardError) {
 *     await trackCoordinatorViolation(swarmMail, {
 *       project_key: "/abs/path/to/project",
 *       session_id: "session-123",
 *       epic_id: "mjudv5mwh66",
 *       violation_type: error.violationType,
 *       payload: error.payload,
 *     });
 *   }
 * }
 * ```
 */
export declare function trackCoordinatorViolation(swarmMail: SwarmMailAdapter, violation: {
    project_key: string;
    session_id: string;
    epic_id: string;
    violation_type: "coordinator_edited_file" | "coordinator_ran_tests" | "coordinator_reserved_files";
    payload: Record<string, unknown>;
}): Promise<number>;
/**
 * Get violation analytics from coordinator guard events.
 *
 * Analyzes coordinator_violation events to calculate total violations,
 * breakdown by type, and violation rate relative to total coordination
 * actions. Used in swarm_status output to surface coordinator discipline.
 *
 * @param swarmMail - SwarmMail adapter for database access
 * @param projectKey - Optional project key to filter violations
 * @returns Promise resolving to violation analytics
 *
 * @example
 * ```typescript
 * const analytics = await getViolationAnalytics(swarmMail);
 * // Returns: {
 * //   totalViolations: 12,
 * //   byType: [
 * //     { violationType: "coordinator_edited_file", count: 8, percentage: 66.67 },
 * //     { violationType: "coordinator_ran_tests", count: 3, percentage: 25.00 },
 * //     { violationType: "coordinator_reserved_files", count: 1, percentage: 8.33 }
 * //   ],
 * //   violationRate: 2.4  // 12 violations per 500 coordination actions = 2.4%
 * // }
 * ```
 */
export declare function getViolationAnalytics(swarmMail: SwarmMailAdapter, projectKey?: string): Promise<ViolationAnalytics>;
export interface CompactionPromptPreview {
    timestamp: string;
    length: number;
    preview?: string;
    confidence?: string;
}
export interface CompactionAnalytics {
    totalEvents: number;
    byType: {
        prompt_generated: number;
        detection_complete: number;
        context_injected: number;
        resumption_started: number;
        tool_call_tracked: number;
        [key: string]: number;
    };
    avgPromptSize: number;
    successRate: number;
    recentPrompts: CompactionPromptPreview[];
    byConfidence: {
        high: number;
        medium: number;
        low: number;
    };
}
/**
 * Get analytics for coordinator compaction events.
 *
 * Queries coordinator_compaction events to calculate:
 * - Total compaction attempts by type (prompt_generated vs detection_failed)
 * - Average prompt size for successful compactions
 * - Success/failure rate
 * - Recent prompts with preview (truncated to 200 chars)
 * - Confidence distribution
 *
 * @param swarmMail - SwarmMail adapter for database access
 * @returns Promise resolving to compaction analytics
 *
 * @example
 * ```typescript
 * const analytics = await getCompactionAnalytics(swarmMail);
 * // Returns: {
 * //   totalEvents: 83,
 * //   byType: { prompt_generated: 72, detection_failed: 11 },
 * //   avgPromptSize: 4800,
 * //   successRate: 86.7,
 * //   recentPrompts: [
 * //     { timestamp: "2025-12-25T10:00:00Z", length: 5200, preview: "Epic bd-123...", confidence: "high" }
 * //   ],
 * //   byConfidence: { high: 60, medium: 12, low: 11 }
 * // }
 * ```
 */
export declare function getCompactionAnalytics(swarmMail: SwarmMailAdapter): Promise<CompactionAnalytics>;
/**
 * Format file failure history as warnings for worker prompts.
 *
 * Produces a concise warning section showing which files have caused
 * previous workers to fail review, with the top issues encountered.
 *
 * Limits output to fit context budget (~300 tokens).
 *
 * @param histories - Array of file failure histories
 * @returns Formatted warning section with emoji header, or empty string if no histories
 *
 * @example
 * ```typescript
 * const histories = [
 *   { file: "src/auth.ts", rejectionCount: 3, topIssues: ["Missing null checks", "Forgot rate limiting"] }
 * ];
 * const warnings = formatFileHistoryWarnings(histories);
 * // Returns:
 * // ⚠️ FILE HISTORY WARNINGS:
 * // - src/auth.ts: 3 previous workers rejected for missing null checks, forgot rate limiting
 * ```
 */
export declare function formatFileHistoryWarnings(histories: FileFailureHistory[]): string;
/**
 * Get strategy success rates for decomposition planning.
 *
 * Use during planning to see which decomposition strategies (file-based,
 * feature-based, risk-based) have historically succeeded or failed.
 */
export declare const swarm_get_strategy_insights: {
    description: string;
    args: {
        task: import("zod").ZodString;
    };
    execute(args: {
        task: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get file-specific gotchas for worker context.
 *
 * Use when assigning files to workers to warn them about historical failure
 * patterns for those files.
 */
export declare const swarm_get_file_insights: {
    description: string;
    args: {
        files: import("zod").ZodArray<import("zod").ZodString>;
    };
    execute(args: {
        files: string[];
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get common failure patterns across swarms.
 *
 * Use during planning or when debugging stuck swarms to see recurring
 * anti-patterns (type errors, timeouts, conflicts, test failures).
 */
export declare const swarm_get_pattern_insights: {
    description: string;
    args: {};
    execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Combined insights tools for plugin/CLI registration.
 */
export declare const insightsTools: {
    swarm_get_strategy_insights: {
        description: string;
        args: {
            task: import("zod").ZodString;
        };
        execute(args: {
            task: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_get_file_insights: {
        description: string;
        args: {
            files: import("zod").ZodArray<import("zod").ZodString>;
        };
        execute(args: {
            files: string[];
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_get_pattern_insights: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=swarm-insights.d.ts.map