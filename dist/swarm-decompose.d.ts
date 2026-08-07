/**
 * Swarm Decompose Module - Task decomposition and validation
 *
 * Handles breaking tasks into parallelizable subtasks with file assignments,
 * validates decomposition structure, and detects conflicts.
 *
 * Key responsibilities:
 * - Decomposition prompt generation
 * - CellTree validation
 * - File conflict detection
 * - Instruction conflict detection
 * - Delegation to planner subagents
 */
import { z } from "zod";
/**
 * A detected conflict between subtask instructions
 */
export interface InstructionConflict {
    subtask_a: number;
    subtask_b: number;
    directive_a: string;
    directive_b: string;
    conflict_type: "positive_negative" | "contradictory";
    description: string;
}
/**
 * Detect conflicts between subtask instructions
 *
 * Looks for cases where one subtask says "always use X" and another says "avoid X".
 *
 * @param subtasks - Array of subtask descriptions
 * @returns Array of detected conflicts
 *
 * @see https://github.com/Dicklesworthstone/cass_memory_system/blob/main/src/curate.ts#L36-L89
 */
export declare function detectInstructionConflicts(subtasks: Array<{
    title: string;
    description?: string;
}>): InstructionConflict[];
/**
 * Detect file conflicts in a bead tree
 *
 * @param subtasks - Array of subtasks with file assignments
 * @returns Array of files that appear in multiple subtasks
 */
export declare function detectFileConflicts(subtasks: Array<{
    files: string[];
}>): string[];
/**
 * Decompose a task into a bead tree
 *
 * This is a PROMPT tool - it returns a prompt for the agent to respond to.
 * The agent's response (JSON) should be validated with CellTreeSchema.
 *
 * Optionally queries CASS for similar past tasks to inform decomposition.
 */
export declare const swarm_decompose: {
    description: string;
    args: {
        task: z.ZodString;
        context: z.ZodOptional<z.ZodString>;
        query_cass: z.ZodOptional<z.ZodBoolean>;
        cass_limit: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        task: string;
        context?: string | undefined;
        query_cass?: boolean | undefined;
        cass_limit?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Validate a decomposition response from an agent
 *
 * Use this after the agent responds to swarm:decompose to validate the structure.
 */
export declare const swarm_validate_decomposition: {
    description: string;
    args: {
        response: z.ZodString;
        project_path: z.ZodOptional<z.ZodString>;
        task: z.ZodOptional<z.ZodString>;
        context: z.ZodOptional<z.ZodString>;
        strategy: z.ZodOptional<z.ZodEnum<{
            "file-based": "file-based";
            "feature-based": "feature-based";
            "risk-based": "risk-based";
            auto: "auto";
        }>>;
        epic_id: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        response: string;
        project_path?: string | undefined;
        task?: string | undefined;
        context?: string | undefined;
        strategy?: "file-based" | "feature-based" | "risk-based" | "auto" | undefined;
        epic_id?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Delegate task decomposition to a swarm/planner subagent
 *
 * Returns a prompt for spawning a planner agent that will handle all decomposition
 * reasoning. This keeps the coordinator context lean by offloading:
 * - Strategy selection
 * - CASS queries
 * - Skills discovery
 * - File analysis
 * - CellTree generation
 *
 * The planner returns ONLY structured CellTree JSON, which the coordinator
 * validates and uses to create cells.
 *
 * @example
 * ```typescript
 * // Coordinator workflow:
 * const delegateResult = await swarm_delegate_planning({
 *   task: "Add user authentication",
 *   context: "Next.js 14 app",
 * });
 *
 * // Parse the result
 * const { prompt, subagent_type } = JSON.parse(delegateResult);
 *
 * // Spawn subagent using Task tool
 * const plannerResponse = await Task(prompt, subagent_type);
 *
 * // Validate the response
 * await swarm_validate_decomposition({ response: plannerResponse });
 * ```
 */
export declare const swarm_delegate_planning: {
    description: string;
    args: {
        task: z.ZodString;
        context: z.ZodOptional<z.ZodString>;
        strategy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            "file-based": "file-based";
            "feature-based": "feature-based";
            "risk-based": "risk-based";
            auto: "auto";
        }>>>;
        query_cass: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
    };
    execute(args: {
        task: string;
        strategy: "file-based" | "feature-based" | "risk-based" | "auto";
        query_cass: boolean;
        context?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export declare class SwarmError extends Error {
    readonly operation: string;
    readonly details?: unknown | undefined;
    constructor(message: string, operation: string, details?: unknown | undefined);
}
export declare class DecompositionError extends SwarmError {
    readonly zodError?: z.ZodError | undefined;
    constructor(message: string, zodError?: z.ZodError | undefined);
}
/**
 * Interactive planning tool with Socratic questioning
 *
 * Implements a planning phase BEFORE decomposition that:
 * 1. Gathers context (git, files, semantic memory)
 * 2. Asks clarifying questions (socratic mode)
 * 3. Explores alternatives with tradeoffs
 * 4. Recommends an approach with reasoning
 * 5. Confirms before proceeding to decomposition
 *
 * Modes:
 * - socratic: Full interactive planning with questions, alternatives, recommendations
 * - fast: Skip brainstorming, go straight to decomposition with memory context
 * - auto: Auto-select best approach based on task keywords, minimal interaction
 * - confirm-only: Show decomposition, wait for yes/no confirmation
 *
 * Based on the Socratic Planner Pattern from obra/superpowers.
 *
 * @see docs/analysis-socratic-planner-pattern.md
 */
export declare const swarm_plan_interactive: {
    description: string;
    args: {
        task: z.ZodString;
        mode: z.ZodDefault<z.ZodEnum<{
            auto: "auto";
            socratic: "socratic";
            fast: "fast";
            "confirm-only": "confirm-only";
        }>>;
        context: z.ZodOptional<z.ZodString>;
        user_response: z.ZodOptional<z.ZodString>;
        phase: z.ZodOptional<z.ZodEnum<{
            ready: "ready";
            alternatives: "alternatives";
            questioning: "questioning";
            recommendation: "recommendation";
        }>>;
    };
    execute(args: {
        task: string;
        mode: "auto" | "socratic" | "fast" | "confirm-only";
        context?: string | undefined;
        user_response?: string | undefined;
        phase?: "ready" | "alternatives" | "questioning" | "recommendation" | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export declare const decomposeTools: {
    swarm_decompose: {
        description: string;
        args: {
            task: z.ZodString;
            context: z.ZodOptional<z.ZodString>;
            query_cass: z.ZodOptional<z.ZodBoolean>;
            cass_limit: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            task: string;
            context?: string | undefined;
            query_cass?: boolean | undefined;
            cass_limit?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_validate_decomposition: {
        description: string;
        args: {
            response: z.ZodString;
            project_path: z.ZodOptional<z.ZodString>;
            task: z.ZodOptional<z.ZodString>;
            context: z.ZodOptional<z.ZodString>;
            strategy: z.ZodOptional<z.ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                auto: "auto";
            }>>;
            epic_id: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            response: string;
            project_path?: string | undefined;
            task?: string | undefined;
            context?: string | undefined;
            strategy?: "file-based" | "feature-based" | "risk-based" | "auto" | undefined;
            epic_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_delegate_planning: {
        description: string;
        args: {
            task: z.ZodString;
            context: z.ZodOptional<z.ZodString>;
            strategy: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                auto: "auto";
            }>>>;
            query_cass: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
        };
        execute(args: {
            task: string;
            strategy: "file-based" | "feature-based" | "risk-based" | "auto";
            query_cass: boolean;
            context?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_plan_interactive: {
        description: string;
        args: {
            task: z.ZodString;
            mode: z.ZodDefault<z.ZodEnum<{
                auto: "auto";
                socratic: "socratic";
                fast: "fast";
                "confirm-only": "confirm-only";
            }>>;
            context: z.ZodOptional<z.ZodString>;
            user_response: z.ZodOptional<z.ZodString>;
            phase: z.ZodOptional<z.ZodEnum<{
                ready: "ready";
                alternatives: "alternatives";
                questioning: "questioning";
                recommendation: "recommendation";
            }>>;
        };
        execute(args: {
            task: string;
            mode: "auto" | "socratic" | "fast" | "confirm-only";
            context?: string | undefined;
            user_response?: string | undefined;
            phase?: "ready" | "alternatives" | "questioning" | "recommendation" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=swarm-decompose.d.ts.map