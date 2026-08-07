/**
 * Mandate Promotion Engine
 *
 * Handles state transitions for mandate entries based on vote scores:
 * - candidate → established: net_votes >= 2
 * - established → mandate: net_votes >= 5 AND vote_ratio >= 0.7
 * - any → rejected: net_votes <= -3
 *
 * Integrates with pattern-maturity.ts decay calculations and state machine patterns.
 */
import type { MandateDecayConfig, MandateEntry, MandateScore, MandateStatus } from "./schemas/mandate";
/**
 * Result of a promotion evaluation
 */
export interface PromotionResult {
    /** The mandate entry ID */
    mandate_id: string;
    /** Status before evaluation */
    previous_status: MandateStatus;
    /** Status after evaluation */
    new_status: MandateStatus;
    /** Calculated score */
    score: MandateScore;
    /** Whether status changed */
    promoted: boolean;
    /** Human-readable reason for the transition (or lack thereof) */
    reason: string;
}
/**
 * Determine new status based on score and current status
 *
 * State machine:
 * - candidate → established: net_votes >= establishedNetVotesThreshold (2)
 * - established → mandate: net_votes >= mandateNetVotesThreshold (5) AND vote_ratio >= mandateVoteRatioThreshold (0.7)
 * - any → rejected: net_votes <= rejectedNetVotesThreshold (-3)
 * - mandate stays mandate (no demotion)
 * - rejected stays rejected (permanent)
 *
 * @param score - Calculated mandate score with decayed votes
 * @param currentStatus - Current status of the mandate entry
 * @param config - Threshold configuration
 * @returns New status after applying transition rules
 */
export declare function shouldPromote(score: MandateScore, currentStatus: MandateStatus, config?: MandateDecayConfig): MandateStatus;
/**
 * Evaluate promotion for a mandate entry
 *
 * Main entry point for promotion logic. Calculates new status and provides
 * detailed reasoning for the decision.
 *
 * @param entry - The mandate entry to evaluate
 * @param score - Calculated score with decayed votes
 * @param config - Threshold configuration (optional)
 * @returns Promotion result with status change and reasoning
 */
export declare function evaluatePromotion(entry: MandateEntry, score: MandateScore, config?: MandateDecayConfig): PromotionResult;
/**
 * Format promotion result for logging or display
 *
 * @param result - Promotion result
 * @returns Formatted string
 */
export declare function formatPromotionResult(result: PromotionResult): string;
/**
 * Batch evaluate promotions for multiple entries
 *
 * Useful for periodic recalculation of all mandate statuses.
 *
 * @param entries - Map of mandate IDs to entries
 * @param scores - Map of mandate IDs to scores
 * @param config - Threshold configuration (optional)
 * @returns Array of promotion results
 */
export declare function evaluateBatchPromotions(entries: Map<string, MandateEntry>, scores: Map<string, MandateScore>, config?: MandateDecayConfig): PromotionResult[];
/**
 * Get entries that changed status (promoted or demoted)
 *
 * Useful for filtering batch results to only show changes.
 *
 * @param results - Promotion results
 * @returns Only the results where status changed
 */
export declare function getStatusChanges(results: PromotionResult[]): PromotionResult[];
/**
 * Group promotion results by status transition
 *
 * Useful for analytics and reporting.
 *
 * @param results - Promotion results
 * @returns Map of transition keys (e.g., "candidate→established") to results
 */
export declare function groupByTransition(results: PromotionResult[]): Map<string, PromotionResult[]>;
//# sourceMappingURL=mandate-promotion.d.ts.map