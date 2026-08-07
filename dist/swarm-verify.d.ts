/**
 * Swarm Verify Module - Verification gate for worker completions
 *
 * Handles verification logic for swarm workers:
 * - Typecheck verification (tsc --noEmit)
 * - Test verification for touched files
 * - Verification gate orchestration
 *
 * Implements the Gate Function (IDENTIFY → RUN → READ → VERIFY → CLAIM)
 * from the superpowers pattern.
 *
 * @module swarm-verify
 */
/**
 * Verification Gate result - tracks each verification step
 *
 * Based on the Gate Function from superpowers:
 * 1. IDENTIFY: What command proves this claim?
 * 2. RUN: Execute the FULL command (fresh, complete)
 * 3. READ: Full output, check exit code, count failures
 * 4. VERIFY: Does output confirm the claim?
 * 5. ONLY THEN: Make the claim
 */
export interface VerificationStep {
    name: string;
    command: string;
    passed: boolean;
    exitCode: number;
    output?: string;
    error?: string;
    skipped?: boolean;
    skipReason?: string;
}
export interface VerificationGateResult {
    passed: boolean;
    steps: VerificationStep[];
    summary: string;
    blockers: string[];
}
/**
 * Run typecheck verification
 *
 * Attempts to run TypeScript type checking on the project.
 * Falls back gracefully if tsc is not available.
 */
export declare function runTypecheckVerification(): Promise<VerificationStep>;
/**
 * Run test verification for specific files
 *
 * Attempts to find and run tests related to the touched files.
 * Uses common test patterns (*.test.ts, *.spec.ts, __tests__/).
 */
export declare function runTestVerification(filesTouched: string[]): Promise<VerificationStep>;
/**
 * Run the full Verification Gate
 *
 * Implements the Gate Function (IDENTIFY → RUN → READ → VERIFY → CLAIM):
 * 1. Typecheck
 * 2. Tests for touched files
 *
 * NOTE: Bug scanning was removed in v0.31 - it was slowing down completion
 * without providing proportional value.
 *
 * All steps must pass (or be skipped with valid reason) to proceed.
 */
export declare function runVerificationGate(filesTouched: string[], _skipUbs?: boolean): Promise<VerificationGateResult>;
/**
 * Run verification gate for a set of files
 *
 * Delegates to the verification worker to run typecheck and tests.
 * Returns structured verification results.
 */
export declare const swarm_verify: {
    description: string;
    args: {
        files_touched: import("zod").ZodArray<import("zod").ZodString>;
        skip_verification: import("zod").ZodOptional<import("zod").ZodBoolean>;
    };
    execute(args: {
        files_touched: string[];
        skip_verification?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Verification tools for plugin registration
 */
export declare const verificationTools: {
    swarm_verify: {
        description: string;
        args: {
            files_touched: import("zod").ZodArray<import("zod").ZodString>;
            skip_verification: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            files_touched: string[];
            skip_verification?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=swarm-verify.d.ts.map