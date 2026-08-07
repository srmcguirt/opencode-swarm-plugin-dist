/**
 * Result from a gate check
 */
export interface GateResult {
    /** Whether the gate passed */
    passed: boolean;
    /** Current phase */
    phase: "bootstrap" | "stabilization" | "production";
    /** Human-readable message */
    message: string;
    /** Baseline score (mean of history) */
    baseline?: number;
    /** Current score */
    currentScore: number;
    /** Regression percentage (negative = improvement) */
    regressionPercent?: number;
}
/**
 * Configuration for gate thresholds
 */
export interface GateConfig {
    /** Regression threshold for stabilization phase (default: 0.1 = 10%) */
    stabilizationThreshold?: number;
    /** Regression threshold for production phase (default: 0.05 = 5%) */
    productionThreshold?: number;
}
/**
 * Default regression thresholds by phase
 */
export declare const DEFAULT_THRESHOLDS: {
    readonly stabilization: 0.1;
    readonly production: 0.05;
};
/**
 * Check if the current eval score passes the quality gate
 *
 * Progressive gates adapt based on data maturity:
 * - **Bootstrap (<10 runs)**: Always pass, focus on collecting baseline data
 * - **Stabilization (10-50 runs)**: Warn on >10% regression (default), but pass
 * - **Production (>50 runs + variance <0.1)**: Fail on >5% regression (default)
 *
 * **Baseline calculation**: Mean of all historical scores for this eval (not just last run).
 *
 * **Regression formula**: `(baseline - current) / baseline`
 * - Positive = regression (score dropped)
 * - Negative = improvement
 * - Returns 0 if baseline is 0 (avoids division by zero)
 *
 * **Variance threshold (0.1)**: High variance keeps eval in stabilization phase even with >50 runs.
 * This prevents premature production gates when scores are still unstable.
 *
 * **CI Integration**: Production gates can fail PRs. Use `swarm eval status` to check phase before merging.
 *
 * @param projectPath - Absolute path to project root (contains `.opencode/eval-history.jsonl`)
 * @param evalName - Name of the eval (e.g., "swarm-decomposition", "coordinator-behavior")
 * @param currentScore - Current score to check (typically 0-1 range)
 * @param config - Optional threshold configuration (defaults: stabilization=0.1, production=0.05)
 * @returns Gate check result with pass/fail, phase, baseline, regression details
 *
 * @example
 * ```typescript
 * import { checkGate } from "./eval-gates.js";
 *
 * const result = checkGate("/path/to/project", "swarm-decomposition", 0.89);
 *
 * if (!result.passed) {
 *   console.error(`❌ Gate FAILED: ${result.message}`);
 *   process.exit(1); // Fail CI
 * }
 *
 * console.log(`✅ ${result.phase} phase: ${result.message}`);
 * ```
 *
 * @example
 * ```typescript
 * // Custom thresholds for sensitive eval
 * const result = checkGate("/path", "critical-eval", 0.92, {
 *   stabilizationThreshold: 0.05,  // 5% threshold in stabilization
 *   productionThreshold: 0.02,     // 2% threshold in production
 * });
 * ```
 */
export declare function checkGate(projectPath: string, evalName: string, currentScore: number, config?: GateConfig): GateResult;
//# sourceMappingURL=eval-gates.d.ts.map