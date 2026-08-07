/**
 * Swarm Structured Review Module
 *
 * Provides coordinator-driven review of worker output before completion.
 * The review is epic-aware - it checks if work serves the overall goal
 * and enables downstream tasks.
 *
 * Key features:
 * - Generate review prompts with full epic context
 * - Track review attempts (max 3 before task fails)
 * - Send structured feedback to workers
 * - Gate completion on review approval
 *
 * Credit: Review patterns inspired by https://github.com/nexxeln/opencode-config
 */
import { z } from "zod";
/**
 * Review issue - a specific problem found during review
 */
export interface ReviewIssue {
    file: string;
    line?: number;
    issue: string;
    suggestion?: string;
}
export declare const ReviewIssueSchema: z.ZodObject<{
    file: z.ZodString;
    line: z.ZodOptional<z.ZodNumber>;
    issue: z.ZodString;
    suggestion: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Review result - the outcome of a review
 */
export interface ReviewResult {
    status: "approved" | "needs_changes";
    summary?: string;
    issues?: ReviewIssue[];
    remaining_attempts?: number;
}
export declare const ReviewResultSchema: z.ZodObject<{
    status: z.ZodEnum<{
        approved: "approved";
        needs_changes: "needs_changes";
    }>;
    summary: z.ZodOptional<z.ZodString>;
    issues: z.ZodOptional<z.ZodArray<z.ZodObject<{
        file: z.ZodString;
        line: z.ZodOptional<z.ZodNumber>;
        issue: z.ZodString;
        suggestion: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    remaining_attempts: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Dependency info for review context
 */
export interface DependencyInfo {
    id: string;
    title: string;
    summary?: string;
}
/**
 * Downstream task info
 */
export interface DownstreamTask {
    id: string;
    title: string;
}
/**
 * Review prompt context
 */
export interface ReviewPromptContext {
    epic_id: string;
    epic_title: string;
    epic_description?: string;
    task_id: string;
    task_title: string;
    task_description?: string;
    files_touched: string[];
    diff: string;
    completed_dependencies?: DependencyInfo[];
    downstream_tasks?: DownstreamTask[];
}
/**
 * Generate a review prompt with full epic context
 *
 * The prompt includes:
 * - Epic goal (big picture)
 * - Task requirements
 * - Dependency context (what this builds on)
 * - Downstream context (what depends on this)
 * - The actual code diff
 * - Review criteria checklist
 */
export declare function generateReviewPrompt(context: ReviewPromptContext): string;
/**
 * Generate a review prompt for a completed subtask
 *
 * Fetches epic and task details, gets the git diff, and generates
 * a comprehensive review prompt.
 */
export declare const swarm_review: {
    description: string;
    args: {
        project_key: z.ZodString;
        epic_id: z.ZodString;
        task_id: z.ZodString;
        files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
    };
    execute(args: {
        project_key: string;
        epic_id: string;
        task_id: string;
        files_touched?: string[] | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Send review feedback to a worker
 *
 * Tracks review attempts and fails the task after 3 rejections.
 */
export declare const swarm_review_feedback: {
    description: string;
    args: {
        project_key: z.ZodString;
        task_id: z.ZodString;
        worker_id: z.ZodString;
        status: z.ZodEnum<{
            approved: "approved";
            needs_changes: "needs_changes";
        }>;
        summary: z.ZodOptional<z.ZodString>;
        issues: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        project_key: string;
        task_id: string;
        worker_id: string;
        status: "approved" | "needs_changes";
        summary?: string | undefined;
        issues?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Review status for a task
 */
interface TaskReviewStatus {
    reviewed: boolean;
    approved: boolean;
    attempt_count: number;
    remaining_attempts: number;
}
/**
 * Mark a task as reviewed and approved
 */
export declare function markReviewApproved(taskId: string): void;
/**
 * Check if a task has been approved
 */
export declare function isReviewApproved(taskId: string): boolean;
/**
 * Get review status for a task
 */
export declare function getReviewStatus(taskId: string): TaskReviewStatus;
/**
 * Clear review status (for testing or reset)
 */
export declare function clearReviewStatus(taskId: string): void;
/**
 * Mark a task as reviewed but not approved (for testing)
 */
export declare function markReviewRejected(taskId: string): void;
export declare const reviewTools: {
    swarm_review: {
        description: string;
        args: {
            project_key: z.ZodString;
            epic_id: z.ZodString;
            task_id: z.ZodString;
            files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
        };
        execute(args: {
            project_key: string;
            epic_id: string;
            task_id: string;
            files_touched?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_review_feedback: {
        description: string;
        args: {
            project_key: z.ZodString;
            task_id: z.ZodString;
            worker_id: z.ZodString;
            status: z.ZodEnum<{
                approved: "approved";
                needs_changes: "needs_changes";
            }>;
            summary: z.ZodOptional<z.ZodString>;
            issues: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            project_key: string;
            task_id: string;
            worker_id: string;
            status: "approved" | "needs_changes";
            summary?: string | undefined;
            issues?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
export {};
//# sourceMappingURL=swarm-review.d.ts.map