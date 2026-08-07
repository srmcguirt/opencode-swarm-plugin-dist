/**
 * Swarm Worktree Isolation Module
 *
 * Provides git worktree-based isolation for parallel swarm workers.
 * Each worker gets their own worktree at a shared start commit,
 * preventing file conflicts without needing reservations.
 *
 * Key features:
 * - Create worktrees at specific commits (swarm start point)
 * - Cherry-pick commits back to main branch
 * - Clean up worktrees on completion or abort
 * - List active worktrees for a project
 *
 * Credit: Patterns inspired by https://github.com/nexxeln/opencode-config
 */
import { z } from "zod";
/**
 * Worktree info returned by git worktree list
 */
export interface WorktreeInfo {
    task_id: string;
    path: string;
    commit: string;
    branch?: string;
    created_at?: string;
}
/**
 * Result of worktree operations
 */
export interface WorktreeResult {
    success: boolean;
    worktree_path?: string;
    task_id?: string;
    error?: string;
    created_at_commit?: string;
    merged_commit?: string;
    removed_path?: string;
    removed_count?: number;
    already_removed?: boolean;
    conflicting_files?: string[];
}
/**
 * Create a git worktree for a task
 *
 * Creates an isolated worktree at the specified start commit.
 * Workers operate in their worktree without affecting main branch.
 */
export declare const swarm_worktree_create: {
    description: string;
    args: {
        project_path: z.ZodString;
        task_id: z.ZodString;
        start_commit: z.ZodString;
    };
    execute(args: {
        project_path: string;
        task_id: string;
        start_commit: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Merge (cherry-pick) commits from worktree back to main
 *
 * After worker completes, cherry-pick their commits to main branch.
 * This integrates the isolated work back into the shared codebase.
 */
export declare const swarm_worktree_merge: {
    description: string;
    args: {
        project_path: z.ZodString;
        task_id: z.ZodString;
        start_commit: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        project_path: string;
        task_id: string;
        start_commit?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Clean up a worktree
 *
 * Removes the worktree directory and git tracking.
 * Call after merge or on abort.
 */
export declare const swarm_worktree_cleanup: {
    description: string;
    args: {
        project_path: z.ZodString;
        task_id: z.ZodOptional<z.ZodString>;
        cleanup_all: z.ZodOptional<z.ZodBoolean>;
    };
    execute(args: {
        project_path: string;
        task_id?: string | undefined;
        cleanup_all?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * List all worktrees for a project
 *
 * Returns info about active worktrees including task IDs and paths.
 */
export declare const swarm_worktree_list: {
    description: string;
    args: {
        project_path: z.ZodString;
    };
    execute(args: {
        project_path: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Check if worktree isolation can be used
 *
 * Worktree mode requires:
 * - Clean working directory (no uncommitted changes)
 * - Valid git repository
 */
export declare function canUseWorktreeIsolation(projectPath: string): Promise<{
    canUse: boolean;
    reason?: string;
}>;
/**
 * Get the current commit for worktree start point
 */
export declare function getStartCommit(projectPath: string): Promise<string | null>;
/**
 * Hard reset main branch to start commit (for abort)
 */
export declare function resetToStartCommit(projectPath: string, startCommit: string): Promise<{
    success: boolean;
    error?: string;
}>;
export declare const worktreeTools: {
    swarm_worktree_create: {
        description: string;
        args: {
            project_path: z.ZodString;
            task_id: z.ZodString;
            start_commit: z.ZodString;
        };
        execute(args: {
            project_path: string;
            task_id: string;
            start_commit: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_worktree_merge: {
        description: string;
        args: {
            project_path: z.ZodString;
            task_id: z.ZodString;
            start_commit: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            project_path: string;
            task_id: string;
            start_commit?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_worktree_cleanup: {
        description: string;
        args: {
            project_path: z.ZodString;
            task_id: z.ZodOptional<z.ZodString>;
            cleanup_all: z.ZodOptional<z.ZodBoolean>;
        };
        execute(args: {
            project_path: string;
            task_id?: string | undefined;
            cleanup_all?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_worktree_list: {
        description: string;
        args: {
            project_path: z.ZodString;
        };
        execute(args: {
            project_path: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=swarm-worktree.d.ts.map