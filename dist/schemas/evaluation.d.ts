/**
 * Evaluation schemas for structured agent output validation
 *
 * These schemas define the expected format for agent self-evaluations
 * and coordinator evaluations of completed work.
 *
 * Includes support for confidence decay - criteria weights fade over time
 * unless revalidated by successful outcomes.
 *
 * @see src/learning.ts for decay calculations
 */
import { z } from "zod";
/**
 * Evaluation of a single criterion.
 *
 * @example
 * // Passing criterion
 * { passed: true, feedback: "All types validated", score: 0.95 }
 *
 * @example
 * // Failing criterion
 * { passed: false, feedback: "Missing error handling in auth flow", score: 0.3 }
 */
export declare const CriterionEvaluationSchema: z.ZodObject<{
    passed: z.ZodBoolean;
    feedback: z.ZodString;
    score: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CriterionEvaluation = z.infer<typeof CriterionEvaluationSchema>;
/**
 * Weighted criterion evaluation with confidence decay
 *
 * Extends CriterionEvaluation with weight information from learning.
 * Lower weights indicate criteria that have been historically unreliable.
 */
export declare const WeightedCriterionEvaluationSchema: z.ZodObject<{
    passed: z.ZodBoolean;
    feedback: z.ZodString;
    score: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodDefault<z.ZodNumber>;
    weighted_score: z.ZodOptional<z.ZodNumber>;
    deprecated: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type WeightedCriterionEvaluation = z.infer<typeof WeightedCriterionEvaluationSchema>;
/**
 * Full evaluation result
 *
 * Returned by agents after completing a subtask.
 * Used by coordinator to determine if work is acceptable.
 */
export declare const EvaluationSchema: z.ZodObject<{
    passed: z.ZodBoolean;
    criteria: z.ZodRecord<z.ZodString, z.ZodObject<{
        passed: z.ZodBoolean;
        feedback: z.ZodString;
        score: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    overall_feedback: z.ZodString;
    retry_suggestion: z.ZodNullable<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type Evaluation = z.infer<typeof EvaluationSchema>;
/**
 * Default evaluation criteria
 *
 * These are the standard criteria used when none are specified.
 * Can be overridden per-task or per-project.
 */
export declare const DEFAULT_CRITERIA: readonly ["type_safe", "no_bugs", "patterns", "readable"];
export type DefaultCriterion = (typeof DEFAULT_CRITERIA)[number];
/**
 * Evaluation request arguments
 */
export declare const EvaluationRequestSchema: z.ZodObject<{
    bead_id: z.ZodString;
    subtask_title: z.ZodString;
    files_touched: z.ZodArray<z.ZodString>;
    requested_at: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type EvaluationRequest = z.infer<typeof EvaluationRequestSchema>;
/**
 * Weighted evaluation result with confidence-adjusted scores
 *
 * Used when applying learned weights to evaluation criteria.
 */
export declare const WeightedEvaluationSchema: z.ZodObject<{
    passed: z.ZodBoolean;
    criteria: z.ZodRecord<z.ZodString, z.ZodObject<{
        passed: z.ZodBoolean;
        feedback: z.ZodString;
        score: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodDefault<z.ZodNumber>;
        weighted_score: z.ZodOptional<z.ZodNumber>;
        deprecated: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>>;
    overall_feedback: z.ZodString;
    retry_suggestion: z.ZodNullable<z.ZodString>;
    timestamp: z.ZodOptional<z.ZodString>;
    average_weight: z.ZodOptional<z.ZodNumber>;
    raw_score: z.ZodOptional<z.ZodNumber>;
    weighted_score: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type WeightedEvaluation = z.infer<typeof WeightedEvaluationSchema>;
/**
 * Aggregated evaluation results for a swarm
 */
export declare const SwarmEvaluationResultSchema: z.ZodObject<{
    epic_id: z.ZodString;
    total: z.ZodNumber;
    passed: z.ZodNumber;
    failed: z.ZodNumber;
    evaluations: z.ZodArray<z.ZodObject<{
        bead_id: z.ZodString;
        evaluation: z.ZodObject<{
            passed: z.ZodBoolean;
            criteria: z.ZodRecord<z.ZodString, z.ZodObject<{
                passed: z.ZodBoolean;
                feedback: z.ZodString;
                score: z.ZodOptional<z.ZodNumber>;
            }, z.core.$strip>>;
            overall_feedback: z.ZodString;
            retry_suggestion: z.ZodNullable<z.ZodString>;
            timestamp: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
    }, z.core.$strip>>;
    overall_passed: z.ZodBoolean;
    retry_needed: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type SwarmEvaluationResult = z.infer<typeof SwarmEvaluationResultSchema>;
/**
 * Validation result with retry info
 */
export declare const ValidationResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    data: z.ZodOptional<z.ZodUnknown>;
    attempts: z.ZodNumber;
    errors: z.ZodOptional<z.ZodArray<z.ZodString>>;
    extractionMethod: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type ValidationResult = z.infer<typeof ValidationResultSchema>;
/**
 * Failure mode taxonomy for task failures
 *
 * Classifies WHY tasks fail, not just that they failed.
 * Used in outcome tracking to learn from failure patterns.
 *
 * @see src/learning.ts OutcomeSignalsSchema
 * @see "Patterns for Building AI Agents" p.46
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
//# sourceMappingURL=evaluation.d.ts.map