/**
 * Compaction Hook Observability
 *
 * Structured logging, metrics, and queryable history for the pre-compaction hook.
 *
 * **Philosophy:** Make the invisible visible. When patterns aren't extracted,
 * when detection fails, when timing explodes - we need to know WHY.
 *
 * @example
 * ```typescript
 * const metrics = createMetricsCollector({ session_id: "abc123" });
 *
 * recordPhaseStart(metrics, CompactionPhase.DETECT);
 * // ... detection logic ...
 * recordPhaseComplete(metrics, CompactionPhase.DETECT, { confidence: "high" });
 *
 * recordPatternExtracted(metrics, "epic_state", "Found epic bd-123");
 *
 * const summary = getMetricsSummary(metrics);
 * console.log(`Detected: ${summary.detected}, Confidence: ${summary.confidence}`);
 * ```
 */
/**
 * Compaction phases - aligned with existing log structure
 *
 * From compaction-hook.ts:
 * - START: session_id, trigger
 * - GATHER: source (swarm-mail|hive), duration_ms, stats/counts
 * - DETECT: confidence, detected, reason_count, reasons
 * - INJECT: confidence, context_length, context_type (full|fallback|none)
 * - COMPLETE: duration_ms, success, detected, confidence, context_injected
 */
export declare enum CompactionPhase {
    START = "START",
    GATHER_SWARM_MAIL = "GATHER_SWARM_MAIL",
    GATHER_HIVE = "GATHER_HIVE",
    DETECT = "DETECT",
    INJECT = "INJECT",
    COMPLETE = "COMPLETE"
}
/**
 * Phase timing and outcome
 */
interface PhaseMetrics {
    duration_ms: number;
    success: boolean;
    error?: string;
    /** Additional phase-specific data */
    metadata?: Record<string, unknown>;
}
/**
 * Pattern extraction record
 */
interface PatternRecord {
    pattern_type: string;
    reason: string;
    /** Debug details (only captured if debug mode enabled) */
    details?: Record<string, unknown>;
    timestamp: number;
}
/**
 * Compaction metrics collector
 *
 * Mutable state object that accumulates metrics during a compaction run.
 */
export interface CompactionMetrics {
    /** Session metadata */
    session_id?: string;
    has_sdk_client?: boolean;
    debug?: boolean;
    /** Phase timings */
    phases: Map<CompactionPhase, {
        start_time: number;
        end_time?: number;
        metadata?: Record<string, unknown>;
        error?: string;
    }>;
    /** Pattern extraction tracking */
    extracted: PatternRecord[];
    skipped: PatternRecord[];
    /** Final detection result */
    confidence?: "high" | "medium" | "low" | "none";
    detected?: boolean;
    /** Overall timing */
    start_time: number;
    end_time?: number;
}
/**
 * Metrics summary (read-only snapshot)
 */
export interface CompactionMetricsSummary {
    session_id?: string;
    has_sdk_client?: boolean;
    /** Phase breakdown */
    phases: Record<string, PhaseMetrics>;
    /** Pattern extraction stats */
    patterns_extracted: number;
    patterns_skipped: number;
    extraction_success_rate: number;
    extracted_patterns: string[];
    skipped_patterns: string[];
    /** Detection outcome */
    confidence?: "high" | "medium" | "low" | "none";
    detected?: boolean;
    /** Timing */
    total_duration_ms: number;
    /** Debug info (only if debug mode enabled) */
    debug_info?: Array<{
        phase: string;
        pattern: string;
        details: Record<string, unknown>;
    }>;
}
/**
 * Create a metrics collector
 *
 * @param metadata - Session metadata to capture
 * @returns Mutable metrics collector
 */
export declare function createMetricsCollector(metadata?: {
    session_id?: string;
    has_sdk_client?: boolean;
    debug?: boolean;
}): CompactionMetrics;
/**
 * Record phase start
 *
 * @param metrics - Metrics collector
 * @param phase - Phase being started
 */
export declare function recordPhaseStart(metrics: CompactionMetrics, phase: CompactionPhase): void;
/**
 * Record phase completion
 *
 * @param metrics - Metrics collector
 * @param phase - Phase being completed
 * @param result - Phase outcome
 */
export declare function recordPhaseComplete(metrics: CompactionMetrics, phase: CompactionPhase, result?: {
    success?: boolean;
    error?: string;
    confidence?: "high" | "medium" | "low" | "none";
    detected?: boolean;
    [key: string]: unknown;
}): void;
/**
 * Record an extracted pattern
 *
 * @param metrics - Metrics collector
 * @param pattern_type - Type of pattern extracted (e.g., "epic_state", "agent_name")
 * @param reason - Human-readable reason for extraction
 * @param details - Debug details (only captured if debug mode enabled)
 */
export declare function recordPatternExtracted(metrics: CompactionMetrics, pattern_type: string, reason: string, details?: Record<string, unknown>): void;
/**
 * Record a skipped pattern
 *
 * @param metrics - Metrics collector
 * @param pattern_type - Type of pattern that was skipped
 * @param reason - Human-readable reason for skipping
 */
export declare function recordPatternSkipped(metrics: CompactionMetrics, pattern_type: string, reason: string): void;
/**
 * Get metrics summary (read-only snapshot)
 *
 * Computes derived metrics like success rates and total duration.
 *
 * @param metrics - Metrics collector
 * @returns Immutable summary
 */
export declare function getMetricsSummary(metrics: CompactionMetrics): CompactionMetricsSummary;
export {};
//# sourceMappingURL=compaction-observability.d.ts.map