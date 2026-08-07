/**
 * Regression detection result
 */
export interface RegressionResult {
    /** Name of the eval that regressed */
    evalName: string;
    /** Previous run score */
    oldScore: number;
    /** Latest run score */
    newScore: number;
    /** Absolute delta (oldScore - newScore) */
    delta: number;
    /** Percentage change ((newScore - oldScore) / oldScore * 100) */
    deltaPercent: number;
}
/**
 * Detect regressions by comparing latest run to previous run
 *
 * Scans all evals in eval-history.jsonl and compares the last two runs
 * for each eval. Returns evals where the score dropped more than the
 * threshold.
 *
 * **Algorithm**:
 * 1. Read all eval history records
 * 2. Group by eval name
 * 3. For each eval with ≥2 runs:
 *    - Get last 2 runs
 *    - Calculate delta and deltaPercent
 *    - If delta exceeds threshold AND score dropped, record regression
 * 4. Sort results by severity (largest delta first)
 *
 * **Delta calculation**:
 * - delta = oldScore - newScore (absolute drop)
 * - deltaPercent = (newScore - oldScore) / oldScore * 100 (negative for regression)
 *
 * **Threshold**: Specified as absolute value (e.g., 0.10 = 10% drop required to report)
 *
 * @param projectPath - Absolute path to project root
 * @param threshold - Minimum delta to report (default: 0.10 = 10%)
 * @returns List of regressions sorted by severity (largest delta first)
 *
 * @example
 * ```typescript
 * import { detectRegressions } from "./regression-detection.js";
 *
 * const regressions = detectRegressions("/path/to/project", 0.10);
 *
 * if (regressions.length > 0) {
 *   console.error("⚠️ REGRESSION DETECTED");
 *   for (const reg of regressions) {
 *     console.error(`├── ${reg.evalName}: ${(reg.oldScore * 100).toFixed(1)}% → ${(reg.newScore * 100).toFixed(1)}% (${reg.deltaPercent.toFixed(1)}%)`);
 *   }
 *   console.error(`└── Threshold: ${(threshold * 100).toFixed(0)}%`);
 * }
 * ```
 */
export declare function detectRegressions(projectPath: string, threshold?: number): RegressionResult[];
//# sourceMappingURL=regression-detection.d.ts.map