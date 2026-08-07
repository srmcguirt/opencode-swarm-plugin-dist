/**
 * Programmatic Evalite Runner
 *
 * Provides a type-safe API for running evalite evals programmatically.
 * Wraps evalite's runEvalite function with structured result parsing.
 *
 * @module eval-runner
 */
/**
 * Options for running evals programmatically
 */
export interface RunEvalsOptions {
    /**
     * Working directory containing eval files (defaults to process.cwd())
     */
    cwd?: string;
    /**
     * Optional filter to run specific eval suites (e.g., "coordinator", "compaction")
     * Matches against eval file paths using substring matching
     */
    suiteFilter?: string;
    /**
     * Minimum average score threshold (0-100)
     * If average score falls below this, result.success will be false
     */
    scoreThreshold?: number;
    /**
     * Optional path to write raw evalite JSON output
     */
    outputPath?: string;
}
/**
 * Structured suite result with scores
 */
export interface SuiteResult {
    /** Suite name from evalite() call */
    name: string;
    /** Absolute path to eval file */
    filepath: string;
    /** Suite status: success, fail, or running */
    status: "success" | "fail" | "running";
    /** Total duration in milliseconds */
    duration: number;
    /** Average score across all evals in suite (0-1 scale) */
    averageScore: number;
    /** Number of evals in this suite */
    evalCount: number;
    /** Individual eval results (optional, can be large) */
    evals?: Array<{
        input: unknown;
        output: unknown;
        expected?: unknown;
        scores: Array<{
            name: string;
            score: number;
            description?: string;
        }>;
    }>;
}
/**
 * Structured result from running evals
 */
export interface RunEvalsResult {
    /** Whether the run succeeded (all evals passed threshold) */
    success: boolean;
    /** Total number of suites executed */
    totalSuites: number;
    /** Total number of individual evals executed */
    totalEvals: number;
    /** Average score across all suites (0-1 scale) */
    averageScore: number;
    /** Individual suite results */
    suites: SuiteResult[];
    /** Error message if run failed */
    error?: string;
    /** Gate check results per suite */
    gateResults?: Array<{
        suite: string;
        passed: boolean;
        phase: string;
        message: string;
        baseline?: number;
        currentScore: number;
        regressionPercent?: number;
    }>;
}
/**
 * Run evalite evals programmatically
 *
 * @param options - Configuration for eval run
 * @returns Structured results with scores per suite
 *
 * @example
 * ```typescript
 * // Run all evals
 * const result = await runEvals({ cwd: "/path/to/project" });
 * console.log(`Average score: ${result.averageScore}`);
 *
 * // Run specific suite
 * const coordResult = await runEvals({
 *   cwd: "/path/to/project",
 *   suiteFilter: "coordinator"
 * });
 *
 * // Enforce score threshold
 * const gatedResult = await runEvals({
 *   cwd: "/path/to/project",
 *   scoreThreshold: 80
 * });
 * if (!gatedResult.success) {
 *   throw new Error(`Evals failed threshold: ${gatedResult.averageScore}`);
 * }
 * ```
 */
export declare function runEvals(options?: RunEvalsOptions): Promise<RunEvalsResult>;
/**
 * All eval tools exported for registration
 */
export declare const evalTools: {
    readonly eval_run: {
        description: string;
        args: {
            suiteFilter: import("zod").ZodOptional<import("zod").ZodString>;
            scoreThreshold: import("zod").ZodOptional<import("zod").ZodNumber>;
            includeDetailedResults: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            suiteFilter?: string | undefined;
            scoreThreshold?: number | undefined;
            includeDetailedResults?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=eval-runner.d.ts.map