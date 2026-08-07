/**
 * Pattern Maturity Module
 *
 * Tracks decomposition pattern maturity states through lifecycle:
 * candidate → established → proven (or deprecated)
 *
 * Patterns start as candidates until they accumulate enough feedback.
 * Strong positive feedback promotes to proven, strong negative deprecates.
 *
 * @see https://github.com/Dicklesworthstone/cass_memory_system/blob/main/src/scoring.ts#L73-L98
 */
import { z } from "zod";
/**
 * Maturity state for a decomposition pattern
 *
 * - candidate: Not enough feedback to judge (< minFeedback events)
 * - established: Enough feedback, neither proven nor deprecated
 * - proven: Strong positive signal (high helpful, low harmful ratio)
 * - deprecated: Strong negative signal (high harmful ratio)
 */
export declare const MaturityStateSchema: z.ZodEnum<{
    deprecated: "deprecated";
    candidate: "candidate";
    established: "established";
    proven: "proven";
}>;
export type MaturityState = z.infer<typeof MaturityStateSchema>;
/**
 * Pattern maturity tracking
 *
 * Tracks feedback counts and state transitions for a decomposition pattern.
 */
export declare const PatternMaturitySchema: z.ZodObject<{
    pattern_id: z.ZodString;
    state: z.ZodEnum<{
        deprecated: "deprecated";
        candidate: "candidate";
        established: "established";
        proven: "proven";
    }>;
    helpful_count: z.ZodNumber;
    harmful_count: z.ZodNumber;
    last_validated: z.ZodString;
    promoted_at: z.ZodOptional<z.ZodString>;
    deprecated_at: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type PatternMaturity = z.infer<typeof PatternMaturitySchema>;
/**
 * Feedback event for maturity tracking
 */
export declare const MaturityFeedbackSchema: z.ZodObject<{
    pattern_id: z.ZodString;
    type: z.ZodEnum<{
        helpful: "helpful";
        harmful: "harmful";
    }>;
    timestamp: z.ZodString;
    weight: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type MaturityFeedback = z.infer<typeof MaturityFeedbackSchema>;
/**
 * Configuration for maturity calculations
 */
export interface MaturityConfig {
    /** Minimum feedback events before leaving candidate state */
    minFeedback: number;
    /** Minimum decayed helpful score to reach proven state */
    minHelpful: number;
    /** Maximum harmful ratio to reach/maintain proven state */
    maxHarmful: number;
    /** Harmful ratio threshold for deprecation */
    deprecationThreshold: number;
    /** Half-life for decay in days */
    halfLifeDays: number;
}
export declare const DEFAULT_MATURITY_CONFIG: MaturityConfig;
/**
 * Calculate decayed feedback counts
 *
 * Applies half-life decay to each feedback event based on age.
 *
 * @param feedbackEvents - Raw feedback events
 * @param config - Maturity configuration
 * @param now - Current timestamp for decay calculation
 * @returns Decayed helpful and harmful totals
 */
export declare function calculateDecayedCounts(feedbackEvents: MaturityFeedback[], config?: MaturityConfig, now?: Date): {
    decayedHelpful: number;
    decayedHarmful: number;
};
/**
 * Calculate maturity state from feedback events
 *
 * State determination logic:
 * 1. "deprecated" if harmful ratio > 0.3 AND total >= minFeedback
 * 2. "candidate" if total < minFeedback (not enough data)
 * 3. "proven" if decayedHelpful >= minHelpful AND harmfulRatio < maxHarmful
 * 4. "established" otherwise (enough data but not yet proven)
 *
 * @param feedbackEvents - Feedback events for this pattern
 * @param config - Maturity configuration
 * @param now - Current timestamp for decay calculation
 * @returns Calculated maturity state
 */
export declare function calculateMaturityState(feedbackEvents: MaturityFeedback[], config?: MaturityConfig, now?: Date): MaturityState;
/**
 * Create initial pattern maturity record
 *
 * @param patternId - Unique pattern identifier
 * @returns New PatternMaturity in candidate state
 */
export declare function createPatternMaturity(patternId: string): PatternMaturity;
/**
 * Update pattern maturity with new feedback.
 *
 * Side Effects:
 * - Sets `promoted_at` timestamp on first entry into 'proven' status
 * - Sets `deprecated_at` timestamp on first entry into 'deprecated' status
 * - Updates `helpful_count` and `harmful_count` based on feedback events
 * - Recalculates `state` based on decayed feedback counts
 *
 * State Transitions:
 * - candidate → established: After minFeedback observations (default 3)
 * - established → proven: When decayedHelpful >= minHelpful (5) AND harmfulRatio < maxHarmful (15%)
 * - any → deprecated: When harmfulRatio > deprecationThreshold (30%) AND total >= minFeedback
 *
 * @param maturity - Current maturity record
 * @param feedbackEvents - All feedback events for this pattern
 * @param config - Maturity configuration
 * @returns Updated maturity record with new state
 */
export declare function updatePatternMaturity(maturity: PatternMaturity, feedbackEvents: MaturityFeedback[], config?: MaturityConfig): PatternMaturity;
/**
 * Promote a pattern to proven state
 *
 * Manually promotes a pattern regardless of feedback counts.
 * Use when external validation confirms pattern effectiveness.
 *
 * @param maturity - Current maturity record
 * @returns Updated maturity record with proven state
 */
export declare function promotePattern(maturity: PatternMaturity): PatternMaturity;
/**
 * Deprecate a pattern
 *
 * Manually deprecates a pattern regardless of feedback counts.
 * Use when external validation shows pattern is harmful.
 *
 * @param maturity - Current maturity record
 * @param reason - Optional reason for deprecation
 * @returns Updated maturity record with deprecated state
 */
export declare function deprecatePattern(maturity: PatternMaturity, _reason?: string): PatternMaturity;
/**
 * Get weight multiplier based on pattern maturity status.
 *
 * Multipliers chosen to:
 * - Heavily penalize deprecated patterns (0x) - never recommend
 * - Slightly boost proven patterns (1.5x) - reward validated success
 * - Penalize unvalidated candidates (0.5x) - reduce impact until proven
 * - Neutral for established (1.0x) - baseline weight
 *
 * @param state - Pattern maturity status
 * @returns Multiplier to apply to pattern weight
 */
export declare function getMaturityMultiplier(state: MaturityState): number;
/**
 * Format maturity state for inclusion in prompts
 *
 * Shows pattern reliability to help agents make informed decisions.
 *
 * @param maturity - Pattern maturity record
 * @returns Formatted string describing pattern reliability
 */
export declare function formatMaturityForPrompt(maturity: PatternMaturity): string;
/**
 * Format multiple patterns with maturity for prompt inclusion
 *
 * Groups patterns by maturity state for clear presentation.
 *
 * @param patterns - Map of pattern content to maturity record
 * @returns Formatted string for prompt inclusion
 */
export declare function formatPatternsWithMaturityForPrompt(patterns: Map<string, PatternMaturity>): string;
/**
 * Storage interface for pattern maturity records
 */
export interface MaturityStorage {
    /** Store or update a maturity record */
    store(maturity: PatternMaturity): Promise<void>;
    /** Get maturity record by pattern ID */
    get(patternId: string): Promise<PatternMaturity | null>;
    /** Get all maturity records */
    getAll(): Promise<PatternMaturity[]>;
    /** Get patterns by state */
    getByState(state: MaturityState): Promise<PatternMaturity[]>;
    /** Store a feedback event */
    storeFeedback(feedback: MaturityFeedback): Promise<void>;
    /** Get all feedback for a pattern */
    getFeedback(patternId: string): Promise<MaturityFeedback[]>;
}
/**
 * In-memory maturity storage (for testing and short-lived sessions)
 */
export declare class InMemoryMaturityStorage implements MaturityStorage {
    private maturities;
    private feedback;
    store(maturity: PatternMaturity): Promise<void>;
    get(patternId: string): Promise<PatternMaturity | null>;
    getAll(): Promise<PatternMaturity[]>;
    getByState(state: MaturityState): Promise<PatternMaturity[]>;
    storeFeedback(feedback: MaturityFeedback): Promise<void>;
    getFeedback(patternId: string): Promise<MaturityFeedback[]>;
}
export declare const maturitySchemas: {
    MaturityStateSchema: z.ZodEnum<{
        deprecated: "deprecated";
        candidate: "candidate";
        established: "established";
        proven: "proven";
    }>;
    PatternMaturitySchema: z.ZodObject<{
        pattern_id: z.ZodString;
        state: z.ZodEnum<{
            deprecated: "deprecated";
            candidate: "candidate";
            established: "established";
            proven: "proven";
        }>;
        helpful_count: z.ZodNumber;
        harmful_count: z.ZodNumber;
        last_validated: z.ZodString;
        promoted_at: z.ZodOptional<z.ZodString>;
        deprecated_at: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    MaturityFeedbackSchema: z.ZodObject<{
        pattern_id: z.ZodString;
        type: z.ZodEnum<{
            helpful: "helpful";
            harmful: "harmful";
        }>;
        timestamp: z.ZodString;
        weight: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
};
//# sourceMappingURL=pattern-maturity.d.ts.map