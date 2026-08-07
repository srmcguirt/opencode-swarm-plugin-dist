/**
 * Adversarial Review Tool
 *
 * VDD-style adversarial code review using a hostile, fresh-context agent.
 * Credit: Inspired by VDD methodology from https://github.com/Vomikron/VDD
 *
 * The adversary (called "Sarcasmotron" in VDD) is a hyper-critical reviewer with:
 * 1. Fresh context per review - no session history, prevents "relationship drift"
 * 2. Hostile system prompt - zero tolerance for slop, cynical, exasperated
 * 3. Reviews diff + tests
 * 4. Returns structured critique
 *
 * The "HALLUCINATING" verdict is key - when adversary invents problems that don't exist,
 * it signals the code is "zero-slop" and review cycle can exit.
 *
 * @module swarm-adversarial-review
 */
import { z } from "zod";
/**
 * Zod schema for a single critique from adversarial review
 */
export declare const AdversarialCritiqueSchema: z.ZodObject<{
    file: z.ZodString;
    line: z.ZodOptional<z.ZodNumber>;
    issue: z.ZodString;
    severity: z.ZodEnum<{
        error: "error";
        info: "info";
        warning: "warning";
    }>;
}, z.core.$strip>;
export type AdversarialCritique = z.infer<typeof AdversarialCritiqueSchema>;
/**
 * Zod schema for adversarial review response
 */
export declare const AdversarialReviewResponseSchema: z.ZodObject<{
    critiques: z.ZodArray<z.ZodObject<{
        file: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        issue: z.ZodString;
        severity: z.ZodEnum<{
            error: "error";
            info: "info";
            warning: "warning";
        }>;
    }, z.core.$strip>>;
    verdict: z.ZodEnum<{
        APPROVED: "APPROVED";
        NEEDS_CHANGES: "NEEDS_CHANGES";
        HALLUCINATING: "HALLUCINATING";
    }>;
}, z.core.$strip>;
export type AdversarialReviewResponse = z.infer<typeof AdversarialReviewResponseSchema>;
/**
 * Swarm Adversarial Review Tool
 *
 * Spawns a fresh-context adversarial reviewer to stress-test code quality.
 * Uses VDD's "Sarcasmotron" pattern - hostile reviewer with zero tolerance.
 *
 * @example
 * ```typescript
 * const result = await swarm_adversarial_review({
 *   diff: "git diff output",
 *   test_output: "All tests pass"
 * });
 *
 * const response = JSON.parse(result);
 * if (response.verdict === "HALLUCINATING") {
 *   console.log("Code is zero-slop! Adversary had to invent issues.");
 * }
 * ```
 */
export declare const adversarialReviewTool: {
    description: string;
    args: {
        diff: z.ZodString;
        test_output: z.ZodOptional<z.ZodString>;
        is_hallucination_test: z.ZodOptional<z.ZodBoolean>;
    };
    execute(args: {
        diff: string;
        test_output?: string | undefined;
        is_hallucination_test?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Export tools registry for plugin
 */
export declare const adversarialReviewTools: {
    swarm_adversarial_review: {
        description: string;
        args: {
            diff: z.ZodString;
            test_output: z.ZodOptional<z.ZodString>;
            is_hallucination_test: z.ZodOptional<z.ZodBoolean>;
        };
        execute(args: {
            diff: string;
            test_output?: string | undefined;
            is_hallucination_test?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=swarm-adversarial-review.d.ts.map