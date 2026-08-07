/**
 * Task decomposition schemas
 *
 * These schemas define the structure for breaking down tasks
 * into parallelizable subtasks for swarm execution.
 */
import { z } from "zod";
/**
 * Effort estimation for subtasks.
 *
 * Time ranges:
 * - `trivial`: < 5 minutes (simple rename, typo fix)
 * - `small`: 5-30 minutes (single function, simple feature)
 * - `medium`: 30 min - 2 hours (multi-file change, moderate complexity)
 * - `large`: 2+ hours (significant feature, refactoring)
 */
export declare const EffortLevelSchema: z.ZodEnum<{
    small: "small";
    medium: "medium";
    trivial: "trivial";
    large: "large";
}>;
export type EffortLevel = z.infer<typeof EffortLevelSchema>;
/**
 * Dependency type between subtasks
 */
export declare const DependencyTypeSchema: z.ZodEnum<{
    blocks: "blocks";
    related: "related";
    requires: "requires";
}>;
export type DependencyType = z.infer<typeof DependencyTypeSchema>;
/**
 * Subtask in a decomposition
 */
export declare const DecomposedSubtaskSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodString;
    files: z.ZodArray<z.ZodString>;
    estimated_effort: z.ZodEnum<{
        small: "small";
        medium: "medium";
        trivial: "trivial";
        large: "large";
    }>;
    risks: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
    model: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DecomposedSubtask = z.infer<typeof DecomposedSubtaskSchema>;
/**
 * Dependency between subtasks
 */
export declare const SubtaskDependencySchema: z.ZodObject<{
    from: z.ZodNumber;
    to: z.ZodNumber;
    type: z.ZodEnum<{
        blocks: "blocks";
        related: "related";
        requires: "requires";
    }>;
}, z.core.$strip>;
export type SubtaskDependency = z.infer<typeof SubtaskDependencySchema>;
/**
 * Full task decomposition result
 *
 * Returned by the decomposition agent, validated before spawning.
 */
export declare const TaskDecompositionSchema: z.ZodObject<{
    task: z.ZodString;
    reasoning: z.ZodOptional<z.ZodString>;
    subtasks: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodString;
        files: z.ZodArray<z.ZodString>;
        estimated_effort: z.ZodEnum<{
            small: "small";
            medium: "medium";
            trivial: "trivial";
            large: "large";
        }>;
        risks: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        model: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
    dependencies: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        from: z.ZodNumber;
        to: z.ZodNumber;
        type: z.ZodEnum<{
            blocks: "blocks";
            related: "related";
            requires: "requires";
        }>;
    }, z.core.$strip>>>>;
    shared_context: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type TaskDecomposition = z.infer<typeof TaskDecompositionSchema>;
/**
 * Arguments for task decomposition
 */
export declare const DecomposeArgsSchema: z.ZodObject<{
    task: z.ZodString;
    context: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type DecomposeArgs = z.infer<typeof DecomposeArgsSchema>;
/**
 * Spawn result for a single agent
 */
export declare const SpawnedAgentSchema: z.ZodObject<{
    bead_id: z.ZodString;
    agent_name: z.ZodString;
    task_id: z.ZodOptional<z.ZodString>;
    status: z.ZodEnum<{
        failed: "failed";
        pending: "pending";
        running: "running";
        completed: "completed";
    }>;
    files: z.ZodArray<z.ZodString>;
    reservation_ids: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
}, z.core.$strip>;
export type SpawnedAgent = z.infer<typeof SpawnedAgentSchema>;
/**
 * Result of spawning a swarm
 */
export declare const SwarmSpawnResultSchema: z.ZodObject<{
    epic_id: z.ZodString;
    coordinator_name: z.ZodString;
    thread_id: z.ZodString;
    agents: z.ZodArray<z.ZodObject<{
        bead_id: z.ZodString;
        agent_name: z.ZodString;
        task_id: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            failed: "failed";
            pending: "pending";
            running: "running";
            completed: "completed";
        }>;
        files: z.ZodArray<z.ZodString>;
        reservation_ids: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    }, z.core.$strip>>;
    started_at: z.ZodString;
}, z.core.$strip>;
export type SwarmSpawnResult = z.infer<typeof SwarmSpawnResultSchema>;
/**
 * Progress update from an agent
 */
export declare const AgentProgressSchema: z.ZodObject<{
    bead_id: z.ZodString;
    agent_name: z.ZodString;
    status: z.ZodEnum<{
        in_progress: "in_progress";
        blocked: "blocked";
        failed: "failed";
        completed: "completed";
    }>;
    progress_percent: z.ZodOptional<z.ZodNumber>;
    message: z.ZodOptional<z.ZodString>;
    files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
    blockers: z.ZodOptional<z.ZodArray<z.ZodString>>;
    timestamp: z.ZodString;
}, z.core.$strip>;
export type AgentProgress = z.infer<typeof AgentProgressSchema>;
/**
 * Swarm status summary
 */
export declare const SwarmStatusSchema: z.ZodObject<{
    epic_id: z.ZodString;
    total_agents: z.ZodNumber;
    running: z.ZodNumber;
    completed: z.ZodNumber;
    failed: z.ZodNumber;
    blocked: z.ZodNumber;
    agents: z.ZodArray<z.ZodObject<{
        bead_id: z.ZodString;
        agent_name: z.ZodString;
        task_id: z.ZodOptional<z.ZodString>;
        status: z.ZodEnum<{
            failed: "failed";
            pending: "pending";
            running: "running";
            completed: "completed";
        }>;
        files: z.ZodArray<z.ZodString>;
        reservation_ids: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    }, z.core.$strip>>;
    last_update: z.ZodString;
}, z.core.$strip>;
export type SwarmStatus = z.infer<typeof SwarmStatusSchema>;
//# sourceMappingURL=task.d.ts.map