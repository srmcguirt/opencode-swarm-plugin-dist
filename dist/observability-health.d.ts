/**
 * Observability Health - CLI health dashboard
 *
 * Shows what's being captured vs what's missing.
 * Helps identify coverage gaps in observability instrumentation.
 */
export interface HookCoverageResult {
    percentage: number;
    wired: number;
    total: number;
    hooks: Array<{
        name: string;
        wired: boolean;
        captures: number;
    }>;
}
export interface EventCaptureStats {
    days: number;
    DECISION: number;
    VIOLATION: number;
    OUTCOME: number;
    COMPACTION: number;
}
export interface SessionQualityResult {
    totalSessions: number;
    qualitySessions: number;
    ghostSessions: number;
    qualityPercentage: number;
    warning: boolean;
}
export interface RegressionStatus {
    detected: boolean;
    count: number;
    details?: string[];
}
export interface ObservabilityHealth {
    hookCoverage: HookCoverageResult;
    eventStats: EventCaptureStats;
    sessionQuality: SessionQualityResult;
    regressions: RegressionStatus;
}
export interface HookCoverageInput {
    wiredHooks: readonly string[];
    expectedHooks: readonly string[];
    captureCounts?: Record<string, number>;
}
/**
 * Calculate hook coverage - what % of expected hooks are wired
 */
export declare function calculateHookCoverage(input: HookCoverageInput): HookCoverageResult;
/**
 * Query event counts by type from database
 */
export declare function getEventCaptureStats(projectPath: string, options: {
    days: number;
}): Promise<EventCaptureStats>;
export interface SessionQualityInput {
    totalSessions: number;
    qualitySessions: number;
}
/**
 * Calculate session quality metrics
 * Warning threshold: <50% quality sessions
 */
export declare function calculateSessionQuality(input: SessionQualityInput): SessionQualityResult;
/**
 * Query actual session quality from session files
 * Quality session = has DECISION events (spawns, reviews, etc.)
 */
export declare function querySessionQuality(options: {
    days: number;
}): SessionQualityInput;
/**
 * Check for eval regressions
 */
export declare function checkRegressions(projectPath: string): Promise<RegressionStatus>;
/**
 * Format health dashboard with box-drawing characters
 */
export declare function formatHealthDashboard(health: ObservabilityHealth): string;
/**
 * Get full observability health report
 */
export declare function getObservabilityHealth(projectPath: string, options?: {
    days?: number;
}): Promise<ObservabilityHealth>;
//# sourceMappingURL=observability-health.d.ts.map