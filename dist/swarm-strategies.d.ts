/**
 * Swarm Strategies Module - Strategy selection and guidelines
 *
 * Handles decomposition strategy selection (file-based, feature-based, risk-based, research-based)
 * and provides strategy-specific guidelines for task decomposition.
 *
 * Key responsibilities:
 * - Strategy keyword matching and selection
 * - Strategy definition and description
 * - Anti-pattern warnings
 * - Guidelines formatting for prompts
 */
import { z } from "zod";
/**
 * Decomposition strategy types
 */
export type DecompositionStrategy = "file-based" | "feature-based" | "risk-based" | "research-based" | "auto";
/**
 * Zod schema for decomposition strategy validation
 */
export declare const DecompositionStrategySchema: z.ZodEnum<{
    "file-based": "file-based";
    "feature-based": "feature-based";
    "risk-based": "risk-based";
    "research-based": "research-based";
    auto: "auto";
}>;
/**
 * Marker words that indicate positive directives
 */
export declare const POSITIVE_MARKERS: string[];
/**
 * Marker words that indicate negative directives
 */
export declare const NEGATIVE_MARKERS: string[];
/**
 * Strategy definition with keywords, guidelines, and anti-patterns
 */
export interface StrategyDefinition {
    name: DecompositionStrategy;
    description: string;
    keywords: string[];
    guidelines: string[];
    antiPatterns: string[];
    examples: string[];
}
/**
 * Strategy definitions for task decomposition
 */
export declare const STRATEGIES: Record<Exclude<DecompositionStrategy, "auto">, StrategyDefinition>;
/**
 * Analyze task description and select best decomposition strategy
 *
 * @param task - Task description
 * @param projectKey - Optional project path for precedent-aware selection
 * @returns Selected strategy with reasoning and optional precedent data
 */
export declare function selectStrategy(task: string, projectKey?: string): Promise<{
    strategy: Exclude<DecompositionStrategy, "auto">;
    confidence: number;
    reasoning: string;
    alternatives: Array<{
        strategy: Exclude<DecompositionStrategy, "auto">;
        score: number;
    }>;
    precedent?: {
        similar_decisions: number;
        strategy_success_rate?: number;
        cited_epics?: string[];
    };
}>;
/**
 * Format strategy-specific guidelines for the decomposition prompt
 */
export declare function formatStrategyGuidelines(strategy: Exclude<DecompositionStrategy, "auto">): string;
/**
 * Select the best decomposition strategy for a task
 *
 * Analyzes task description and recommends a strategy with reasoning.
 * Use this before swarm_plan_prompt to understand the recommended approach.
 *
 * When projectKey is provided, queries past strategy decisions and success rates
 * to provide precedent-aware recommendations with adjusted confidence.
 */
export declare const swarm_select_strategy: {
    description: string;
    args: {
        task: z.ZodString;
        codebase_context: z.ZodOptional<z.ZodString>;
        projectKey: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        task: string;
        codebase_context?: string | undefined;
        projectKey?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export declare const strategyTools: {
    swarm_select_strategy: {
        description: string;
        args: {
            task: z.ZodString;
            codebase_context: z.ZodOptional<z.ZodString>;
            projectKey: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            task: string;
            codebase_context?: string | undefined;
            projectKey?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=swarm-strategies.d.ts.map