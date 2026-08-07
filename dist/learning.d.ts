/**
 * Learning Module - Confidence decay, feedback scoring, and outcome tracking
 *
 * Implements patterns from cass-memory for learning from swarm outcomes:
 * - Confidence decay: evaluation criteria weights fade unless revalidated
 * - Feedback events: track helpful/harmful signals from task outcomes
 * - Outcome scoring: implicit feedback from duration, errors, retries
 *
 * @see https://github.com/Dicklesworthstone/cass_memory_system/blob/main/src/scoring.ts
 * @see https://github.com/Dicklesworthstone/cass_memory_system/blob/main/src/outcome.ts
 */
import { z } from "zod";
/**
 * Feedback event types
 */
export declare const FeedbackTypeSchema: z.ZodEnum<{
    helpful: "helpful";
    harmful: "harmful";
    neutral: "neutral";
}>;
export type FeedbackType = z.infer<typeof FeedbackTypeSchema>;
/**
 * A feedback event records whether a criterion evaluation was accurate
 *
 * When an evaluation criterion (e.g., "type_safe") is later proven correct
 * or incorrect, we record that as feedback to adjust future weights.
 */
export declare const FeedbackEventSchema: z.ZodObject<{
    id: z.ZodString;
    criterion: z.ZodString;
    type: z.ZodEnum<{
        helpful: "helpful";
        harmful: "harmful";
        neutral: "neutral";
    }>;
    timestamp: z.ZodString;
    context: z.ZodOptional<z.ZodString>;
    bead_id: z.ZodOptional<z.ZodString>;
    raw_value: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type FeedbackEvent = z.infer<typeof FeedbackEventSchema>;
/**
 * Criterion weight with decay tracking
 */
export declare const CriterionWeightSchema: z.ZodObject<{
    criterion: z.ZodString;
    weight: z.ZodNumber;
    helpful_count: z.ZodNumber;
    harmful_count: z.ZodNumber;
    last_validated: z.ZodOptional<z.ZodString>;
    half_life_days: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CriterionWeight = z.infer<typeof CriterionWeightSchema>;
/**
 * Error types that can occur during subtask execution
 */
export declare const ErrorTypeSchema: z.ZodEnum<{
    timeout: "timeout";
    unknown: "unknown";
    conflict: "conflict";
    validation: "validation";
    tool_failure: "tool_failure";
}>;
export type ErrorType = z.infer<typeof ErrorTypeSchema>;
/**
 * An error entry in the error accumulator
 *
 * Errors are accumulated during subtask execution and can be fed
 * into retry prompts to help agents learn from past failures.
 */
export declare const ErrorEntrySchema: z.ZodObject<{
    id: z.ZodString;
    bead_id: z.ZodString;
    error_type: z.ZodEnum<{
        timeout: "timeout";
        unknown: "unknown";
        conflict: "conflict";
        validation: "validation";
        tool_failure: "tool_failure";
    }>;
    message: z.ZodString;
    stack_trace: z.ZodOptional<z.ZodString>;
    tool_name: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodString;
    resolved: z.ZodDefault<z.ZodBoolean>;
    context: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ErrorEntry = z.infer<typeof ErrorEntrySchema>;
/**
 * Decomposition strategies for tracking which approach was used
 */
export declare const DecompositionStrategySchema: z.ZodEnum<{
    "file-based": "file-based";
    "feature-based": "feature-based";
    "risk-based": "risk-based";
    "research-based": "research-based";
}>;
export type DecompositionStrategy = z.infer<typeof DecompositionStrategySchema>;
/**
 * Failure mode taxonomy (imported from evaluation.ts)
 */
export declare const FailureModeSchema: z.ZodEnum<{
    timeout: "timeout";
    unknown: "unknown";
    conflict: "conflict";
    validation: "validation";
    tool_failure: "tool_failure";
    context_overflow: "context_overflow";
    dependency_blocked: "dependency_blocked";
    user_cancelled: "user_cancelled";
}>;
export type FailureMode = z.infer<typeof FailureModeSchema>;
/**
 * Outcome signals from a completed subtask
 *
 * These implicit signals help score decomposition quality without
 * explicit feedback from the user.
 */
export declare const OutcomeSignalsSchema: z.ZodObject<{
    bead_id: z.ZodString;
    duration_ms: z.ZodNumber;
    error_count: z.ZodNumber;
    retry_count: z.ZodNumber;
    success: z.ZodBoolean;
    files_touched: z.ZodDefault<z.ZodArray<z.ZodString>>;
    timestamp: z.ZodString;
    strategy: z.ZodOptional<z.ZodEnum<{
        "file-based": "file-based";
        "feature-based": "feature-based";
        "risk-based": "risk-based";
        "research-based": "research-based";
    }>>;
    failure_mode: z.ZodOptional<z.ZodEnum<{
        timeout: "timeout";
        unknown: "unknown";
        conflict: "conflict";
        validation: "validation";
        tool_failure: "tool_failure";
        context_overflow: "context_overflow";
        dependency_blocked: "dependency_blocked";
        user_cancelled: "user_cancelled";
    }>>;
    failure_details: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type OutcomeSignals = z.infer<typeof OutcomeSignalsSchema>;
/**
 * Scored outcome with implicit feedback type
 */
export declare const ScoredOutcomeSchema: z.ZodObject<{
    signals: z.ZodObject<{
        bead_id: z.ZodString;
        duration_ms: z.ZodNumber;
        error_count: z.ZodNumber;
        retry_count: z.ZodNumber;
        success: z.ZodBoolean;
        files_touched: z.ZodDefault<z.ZodArray<z.ZodString>>;
        timestamp: z.ZodString;
        strategy: z.ZodOptional<z.ZodEnum<{
            "file-based": "file-based";
            "feature-based": "feature-based";
            "risk-based": "risk-based";
            "research-based": "research-based";
        }>>;
        failure_mode: z.ZodOptional<z.ZodEnum<{
            timeout: "timeout";
            unknown: "unknown";
            conflict: "conflict";
            validation: "validation";
            tool_failure: "tool_failure";
            context_overflow: "context_overflow";
            dependency_blocked: "dependency_blocked";
            user_cancelled: "user_cancelled";
        }>>;
        failure_details: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    type: z.ZodEnum<{
        helpful: "helpful";
        harmful: "harmful";
        neutral: "neutral";
    }>;
    decayed_value: z.ZodNumber;
    reasoning: z.ZodString;
}, z.core.$strip>;
export type ScoredOutcome = z.infer<typeof ScoredOutcomeSchema>;
/**
 * Default configuration for learning
 */
export interface LearningConfig {
    /** Half-life for confidence decay in days */
    halfLifeDays: number;
    /** Minimum feedback events before adjusting weights */
    minFeedbackForAdjustment: number;
    /** Maximum harmful ratio before deprecating a criterion */
    maxHarmfulRatio: number;
    /** Threshold duration (ms) for "fast" completion */
    fastCompletionThresholdMs: number;
    /** Threshold duration (ms) for "slow" completion */
    slowCompletionThresholdMs: number;
    /** Maximum errors before considering harmful */
    maxErrorsForHelpful: number;
}
export declare const DEFAULT_LEARNING_CONFIG: LearningConfig;
/**
 * Calculate decayed value using half-life formula
 *
 * Value decays by 50% every `halfLifeDays` days.
 * Formula: value * 0.5^(age/halfLife)
 *
 * @param timestamp - When the event occurred (ISO-8601)
 * @param now - Current time
 * @param halfLifeDays - Half-life in days (default: 90)
 * @returns Decayed value between 0 and 1
 *
 * @example
 * // Event from 90 days ago with 90-day half-life
 * calculateDecayedValue("2024-09-08T00:00:00Z", new Date("2024-12-07"), 90)
 * // Returns ~0.5
 */
export declare function calculateDecayedValue(timestamp: string, now?: Date, halfLifeDays?: number): number;
/**
 * Calculate weighted criterion score from feedback events
 *
 * Applies decay to each feedback event and aggregates them.
 * Helpful events increase the score, harmful events decrease it.
 *
 * @param events - Feedback events for this criterion
 * @param config - Learning configuration
 * @returns Weight between 0 and 1
 */
export declare function calculateCriterionWeight(events: FeedbackEvent[], config?: LearningConfig): CriterionWeight;
/**
 * Score implicit feedback from task outcome signals
 *
 * Infers whether a decomposition/subtask was helpful or harmful based on:
 * - Duration: fast completion = helpful, slow = harmful
 * - Errors: few errors = helpful, many = harmful
 * - Retries: no retries = helpful, many = harmful
 * - Success: success = helpful, failure = harmful
 *
 * @param signals - Outcome signals from completed subtask
 * @param config - Learning configuration
 * @returns Scored outcome with feedback type and reasoning
 */
export declare function scoreImplicitFeedback(signals: OutcomeSignals, config?: LearningConfig): ScoredOutcome;
/**
 * Score outcome from OutcomeSignals
 *
 * Convenience wrapper around scoreImplicitFeedback.
 * Used by swarm_complete to score task outcomes automatically.
 *
 * @param signals - Outcome signals from completed subtask
 * @param config - Learning configuration
 * @returns Scored outcome with feedback type and score
 *
 * @example
 * ```typescript
 * const outcome = scoreOutcome({
 *   bead_id: "bd-123",
 *   duration_ms: 120000,
 *   error_count: 1,
 *   retry_count: 0,
 *   success: true,
 *   files_touched: ["src/auth.ts"],
 *   timestamp: new Date().toISOString(),
 *   strategy: "file-based"
 * });
 * // Returns: { type: "helpful", score: 0.85, reasoning: "..." }
 * ```
 */
export declare function scoreOutcome(signals: OutcomeSignals, config?: LearningConfig): {
    type: FeedbackType;
    score: number;
    reasoning: string;
};
/**
 * Create a feedback event from a scored outcome
 *
 * Converts implicit outcome scoring into an explicit feedback event
 * that can be stored and used for criterion weight calculation.
 *
 * @param outcome - Scored outcome
 * @param criterion - Which criterion this feedback applies to
 * @returns Feedback event
 */
export declare function outcomeToFeedback(outcome: ScoredOutcome, criterion: string): FeedbackEvent;
/**
 * Apply criterion weights to evaluation scores
 *
 * Adjusts raw evaluation scores by their learned weights.
 * Criteria with low confidence (due to past failures) have reduced impact.
 *
 * @param criteria - Map of criterion name to raw score (0-1)
 * @param weights - Map of criterion name to weight
 * @returns Weighted scores
 */
export declare function applyWeights(criteria: Record<string, number>, weights: Record<string, CriterionWeight>): Record<string, {
    raw: number;
    weighted: number;
    weight: number;
}>;
/**
 * Check if a criterion should be deprecated based on feedback
 *
 * A criterion is deprecated if it has enough feedback and the
 * harmful ratio exceeds the threshold.
 *
 * @param weight - Criterion weight with feedback counts
 * @param config - Learning configuration
 * @returns Whether the criterion should be deprecated
 */
export declare function shouldDeprecateCriterion(weight: CriterionWeight, config?: LearningConfig): boolean;
/**
 * Storage interface for feedback events
 *
 * Implementations can use file system, SQLite, or other backends.
 */
export interface FeedbackStorage {
    /** Store a feedback event */
    store(event: FeedbackEvent): Promise<void>;
    /** Get all feedback events for a criterion */
    getByCriterion(criterion: string): Promise<FeedbackEvent[]>;
    /** Get all feedback events for a bead */
    getByBead(beadId: string): Promise<FeedbackEvent[]>;
    /** Get all feedback events */
    getAll(): Promise<FeedbackEvent[]>;
}
/**
 * In-memory feedback storage (for testing and short-lived sessions)
 *
 * Uses LRU eviction to prevent unbounded memory growth.
 */
export declare class InMemoryFeedbackStorage implements FeedbackStorage {
    private events;
    private readonly maxSize;
    constructor(maxSize?: number);
    store(event: FeedbackEvent): Promise<void>;
    getByCriterion(criterion: string): Promise<FeedbackEvent[]>;
    getByBead(beadId: string): Promise<FeedbackEvent[]>;
    getAll(): Promise<FeedbackEvent[]>;
}
/**
 * Strike record for a bead
 *
 * Tracks consecutive fix failures to detect architectural problems.
 * After 3 strikes, the system should STOP and question the architecture
 * rather than attempting Fix #4.
 */
export declare const StrikeRecordSchema: z.ZodObject<{
    bead_id: z.ZodString;
    strike_count: z.ZodNumber;
    failures: z.ZodArray<z.ZodObject<{
        attempt: z.ZodString;
        reason: z.ZodString;
        timestamp: z.ZodString;
    }, z.core.$strip>>;
    first_strike_at: z.ZodOptional<z.ZodString>;
    last_strike_at: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type StrikeRecord = z.infer<typeof StrikeRecordSchema>;
/**
 * Storage interface for strike records
 */
export interface StrikeStorage {
    /** Store a strike record */
    store(record: StrikeRecord): Promise<void>;
    /** Get strike record for a bead */
    get(beadId: string): Promise<StrikeRecord | null>;
    /** Get all strike records */
    getAll(): Promise<StrikeRecord[]>;
    /** Clear strikes for a bead */
    clear(beadId: string): Promise<void>;
}
/**
 * In-memory strike storage
 */
export declare class InMemoryStrikeStorage implements StrikeStorage {
    private strikes;
    store(record: StrikeRecord): Promise<void>;
    get(beadId: string): Promise<StrikeRecord | null>;
    getAll(): Promise<StrikeRecord[]>;
    clear(beadId: string): Promise<void>;
}
/**
 * Add a strike to a bead's record
 *
 * Records a failure attempt and increments the strike count.
 *
 * @param beadId - Cell ID
 * @param attempt - Description of what was attempted
 * @param reason - Why it failed
 * @param storage - Strike storage (defaults to in-memory)
 * @returns Updated strike record
 */
export declare function addStrike(beadId: string, attempt: string, reason: string, storage?: StrikeStorage): Promise<StrikeRecord>;
/**
 * Get strike count for a bead
 *
 * @param beadId - Cell ID
 * @param storage - Strike storage
 * @returns Strike count (0-3)
 */
export declare function getStrikes(beadId: string, storage?: StrikeStorage): Promise<number>;
/**
 * Check if a bead has struck out (3 strikes)
 *
 * @param beadId - Cell ID
 * @param storage - Strike storage
 * @returns True if bead has 3 strikes
 */
export declare function isStrikedOut(beadId: string, storage?: StrikeStorage): Promise<boolean>;
/**
 * Generate architecture review prompt for a struck-out bead
 *
 * When a bead hits 3 strikes, this generates a prompt that forces
 * the human to question the architecture instead of attempting Fix #4.
 *
 * @param beadId - Cell ID
 * @param storage - Strike storage
 * @returns Architecture review prompt
 */
export declare function getArchitecturePrompt(beadId: string, storage?: StrikeStorage): Promise<string>;
/**
 * Clear strikes for a bead (e.g., after successful fix)
 *
 * @param beadId - Cell ID
 * @param storage - Strike storage
 */
export declare function clearStrikes(beadId: string, storage?: StrikeStorage): Promise<void>;
/**
 * Storage interface for error entries
 *
 * Similar to FeedbackStorage but for tracking errors during execution.
 */
export interface ErrorStorage {
    /** Store an error entry */
    store(entry: ErrorEntry): Promise<void>;
    /** Get all errors for a bead */
    getByBead(beadId: string): Promise<ErrorEntry[]>;
    /** Get unresolved errors for a bead */
    getUnresolvedByBead(beadId: string): Promise<ErrorEntry[]>;
    /** Mark an error as resolved */
    markResolved(id: string): Promise<void>;
    /** Get all errors */
    getAll(): Promise<ErrorEntry[]>;
}
/**
 * In-memory error storage
 *
 * Accumulates errors during subtask execution for feeding into retry prompts.
 */
export declare class InMemoryErrorStorage implements ErrorStorage {
    private errors;
    store(entry: ErrorEntry): Promise<void>;
    getByBead(beadId: string): Promise<ErrorEntry[]>;
    getUnresolvedByBead(beadId: string): Promise<ErrorEntry[]>;
    markResolved(id: string): Promise<void>;
    getAll(): Promise<ErrorEntry[]>;
}
/**
 * Error accumulator for tracking errors during subtask execution
 *
 * Implements patterns from "Patterns for Building AI Agents" p.40:
 * - Examines and corrects errors when something goes wrong
 * - Feeds error context into retry prompts
 * - Tracks error patterns for learning
 */
export declare class ErrorAccumulator {
    private storage;
    constructor(storage?: ErrorStorage);
    /**
     * Record an error during subtask execution
     *
     * @param beadId - Cell ID where error occurred
     * @param errorType - Category of error
     * @param message - Human-readable error message
     * @param options - Additional context (stack trace, tool name, etc.)
     * @returns The created error entry
     */
    recordError(beadId: string, errorType: ErrorType, message: string, options?: {
        stack_trace?: string;
        tool_name?: string;
        context?: string;
    }): Promise<ErrorEntry>;
    /**
     * Get all errors for a bead (resolved and unresolved)
     */
    getErrors(beadId: string): Promise<ErrorEntry[]>;
    /**
     * Get only unresolved errors for a bead
     */
    getUnresolvedErrors(beadId: string): Promise<ErrorEntry[]>;
    /**
     * Mark an error as resolved
     */
    resolveError(errorId: string): Promise<void>;
    /**
     * Format errors as context for retry prompts
     *
     * Groups errors by type and provides structured feedback
     * for the agent to learn from.
     *
     * @param beadId - Bead to get error context for
     * @param includeResolved - Include resolved errors (default: false)
     * @returns Formatted error context string
     */
    getErrorContext(beadId: string, includeResolved?: boolean): Promise<string>;
    /**
     * Get error statistics for outcome tracking
     *
     * @param beadId - Bead to get stats for
     * @returns Error counts and patterns
     */
    getErrorStats(beadId: string): Promise<{
        total: number;
        unresolved: number;
        by_type: Record<ErrorType, number>;
    }>;
}
/**
 * Format memory store instruction for successful task completion
 *
 * @param beadId - Cell ID that completed
 * @param summary - Completion summary
 * @param filesTouched - Files modified
 * @param strategy - Decomposition strategy used (if applicable)
 * @returns Memory store instruction object
 */
export declare function formatMemoryStoreOnSuccess(beadId: string, summary: string, filesTouched: string[], strategy?: DecompositionStrategy): {
    information: string;
    metadata: string;
    instruction: string;
};
/**
 * Format memory store instruction for architectural problems (3-strike)
 *
 * @param beadId - Cell ID that struck out
 * @param failures - Array of failure attempts
 * @returns Memory store instruction object
 */
export declare function formatMemoryStoreOn3Strike(beadId: string, failures: Array<{
    attempt: string;
    reason: string;
}>): {
    information: string;
    metadata: string;
    instruction: string;
};
/**
 * Format memory query instruction for task decomposition
 *
 * @param task - Task description
 * @param limit - Max results to return
 * @returns Memory query instruction object
 */
export declare function formatMemoryQueryForDecomposition(task: string, limit?: number): {
    query: string;
    limit: number;
    instruction: string;
};
/**
 * Format memory validation hint when CASS history helped
 *
 * @param beadId - Cell ID that benefited from CASS
 * @returns Memory validation hint
 */
export declare function formatMemoryValidationHint(beadId: string): {
    instruction: string;
    context: string;
};
export declare const learningSchemas: {
    FeedbackTypeSchema: z.ZodEnum<{
        helpful: "helpful";
        harmful: "harmful";
        neutral: "neutral";
    }>;
    FeedbackEventSchema: z.ZodObject<{
        id: z.ZodString;
        criterion: z.ZodString;
        type: z.ZodEnum<{
            helpful: "helpful";
            harmful: "harmful";
            neutral: "neutral";
        }>;
        timestamp: z.ZodString;
        context: z.ZodOptional<z.ZodString>;
        bead_id: z.ZodOptional<z.ZodString>;
        raw_value: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    CriterionWeightSchema: z.ZodObject<{
        criterion: z.ZodString;
        weight: z.ZodNumber;
        helpful_count: z.ZodNumber;
        harmful_count: z.ZodNumber;
        last_validated: z.ZodOptional<z.ZodString>;
        half_life_days: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    OutcomeSignalsSchema: z.ZodObject<{
        bead_id: z.ZodString;
        duration_ms: z.ZodNumber;
        error_count: z.ZodNumber;
        retry_count: z.ZodNumber;
        success: z.ZodBoolean;
        files_touched: z.ZodDefault<z.ZodArray<z.ZodString>>;
        timestamp: z.ZodString;
        strategy: z.ZodOptional<z.ZodEnum<{
            "file-based": "file-based";
            "feature-based": "feature-based";
            "risk-based": "risk-based";
            "research-based": "research-based";
        }>>;
        failure_mode: z.ZodOptional<z.ZodEnum<{
            timeout: "timeout";
            unknown: "unknown";
            conflict: "conflict";
            validation: "validation";
            tool_failure: "tool_failure";
            context_overflow: "context_overflow";
            dependency_blocked: "dependency_blocked";
            user_cancelled: "user_cancelled";
        }>>;
        failure_details: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    ScoredOutcomeSchema: z.ZodObject<{
        signals: z.ZodObject<{
            bead_id: z.ZodString;
            duration_ms: z.ZodNumber;
            error_count: z.ZodNumber;
            retry_count: z.ZodNumber;
            success: z.ZodBoolean;
            files_touched: z.ZodDefault<z.ZodArray<z.ZodString>>;
            timestamp: z.ZodString;
            strategy: z.ZodOptional<z.ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                "research-based": "research-based";
            }>>;
            failure_mode: z.ZodOptional<z.ZodEnum<{
                timeout: "timeout";
                unknown: "unknown";
                conflict: "conflict";
                validation: "validation";
                tool_failure: "tool_failure";
                context_overflow: "context_overflow";
                dependency_blocked: "dependency_blocked";
                user_cancelled: "user_cancelled";
            }>>;
            failure_details: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        type: z.ZodEnum<{
            helpful: "helpful";
            harmful: "harmful";
            neutral: "neutral";
        }>;
        decayed_value: z.ZodNumber;
        reasoning: z.ZodString;
    }, z.core.$strip>;
    DecompositionStrategySchema: z.ZodEnum<{
        "file-based": "file-based";
        "feature-based": "feature-based";
        "risk-based": "risk-based";
        "research-based": "research-based";
    }>;
    ErrorTypeSchema: z.ZodEnum<{
        timeout: "timeout";
        unknown: "unknown";
        conflict: "conflict";
        validation: "validation";
        tool_failure: "tool_failure";
    }>;
    ErrorEntrySchema: z.ZodObject<{
        id: z.ZodString;
        bead_id: z.ZodString;
        error_type: z.ZodEnum<{
            timeout: "timeout";
            unknown: "unknown";
            conflict: "conflict";
            validation: "validation";
            tool_failure: "tool_failure";
        }>;
        message: z.ZodString;
        stack_trace: z.ZodOptional<z.ZodString>;
        tool_name: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodString;
        resolved: z.ZodDefault<z.ZodBoolean>;
        context: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    StrikeRecordSchema: z.ZodObject<{
        bead_id: z.ZodString;
        strike_count: z.ZodNumber;
        failures: z.ZodArray<z.ZodObject<{
            attempt: z.ZodString;
            reason: z.ZodString;
            timestamp: z.ZodString;
        }, z.core.$strip>>;
        first_strike_at: z.ZodOptional<z.ZodString>;
        last_strike_at: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
};
//# sourceMappingURL=learning.d.ts.map