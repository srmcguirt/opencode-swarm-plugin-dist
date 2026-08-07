/**
 * Ralph Supervisor Schemas
 *
 * Type definitions for the ralph loop supervisor pattern where Claude
 * supervises and Codex executes implementation work.
 */
import { z } from "zod";
/**
 * Story status enum
 */
export declare const StoryStatusSchema: z.ZodEnum<{
    passed: "passed";
    in_progress: "in_progress";
    blocked: "blocked";
    failed: "failed";
    pending: "pending";
    ready_for_review: "ready_for_review";
}>;
export type StoryStatus = z.infer<typeof StoryStatusSchema>;
/**
 * Story definition
 */
export declare const StorySchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodDefault<z.ZodNumber>;
    status: z.ZodDefault<z.ZodEnum<{
        passed: "passed";
        in_progress: "in_progress";
        blocked: "blocked";
        failed: "failed";
        pending: "pending";
        ready_for_review: "ready_for_review";
    }>>;
    validation_command: z.ZodOptional<z.ZodString>;
    acceptance_criteria: z.ZodOptional<z.ZodArray<z.ZodString>>;
    files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
    attempts: z.ZodDefault<z.ZodNumber>;
    last_error: z.ZodOptional<z.ZodString>;
    cell_id: z.ZodOptional<z.ZodString>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
}, z.core.$strip>;
export type Story = z.infer<typeof StorySchema>;
/**
 * PRD metadata
 */
export declare const PRDMetadataSchema: z.ZodObject<{
    created_at: z.ZodString;
    last_iteration: z.ZodOptional<z.ZodString>;
    total_iterations: z.ZodDefault<z.ZodNumber>;
    total_stories_completed: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/**
 * PRD structure
 */
export declare const PRDSchema: z.ZodObject<{
    version: z.ZodDefault<z.ZodString>;
    project_name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    stories: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        priority: z.ZodDefault<z.ZodNumber>;
        status: z.ZodDefault<z.ZodEnum<{
            passed: "passed";
            in_progress: "in_progress";
            blocked: "blocked";
            failed: "failed";
            pending: "pending";
            ready_for_review: "ready_for_review";
        }>>;
        validation_command: z.ZodOptional<z.ZodString>;
        acceptance_criteria: z.ZodOptional<z.ZodArray<z.ZodString>>;
        files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
        attempts: z.ZodDefault<z.ZodNumber>;
        last_error: z.ZodOptional<z.ZodString>;
        cell_id: z.ZodOptional<z.ZodString>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
    }, z.core.$strip>>>;
    metadata: z.ZodObject<{
        created_at: z.ZodString;
        last_iteration: z.ZodOptional<z.ZodString>;
        total_iterations: z.ZodDefault<z.ZodNumber>;
        total_stories_completed: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type PRD = z.infer<typeof PRDSchema>;
/**
 * Codex sandbox modes
 */
export declare const SandboxModeSchema: z.ZodEnum<{
    "read-only": "read-only";
    "workspace-write": "workspace-write";
    "danger-full-access": "danger-full-access";
}>;
export type SandboxMode = z.infer<typeof SandboxModeSchema>;
/**
 * Codex JSONL event types we care about
 */
export declare const CodexEventTypeSchema: z.ZodEnum<{
    error: "error";
    session_start: "session_start";
    session_meta: "session_meta";
    tool_call: "tool_call";
    function_call: "function_call";
    response_item: "response_item";
}>;
/**
 * Codex event from JSONL stream
 */
export declare const CodexEventSchema: z.ZodObject<{
    type: z.ZodEnum<{
        error: "error";
        session_start: "session_start";
        session_meta: "session_meta";
        tool_call: "tool_call";
        function_call: "function_call";
        response_item: "response_item";
    }>;
    session_id: z.ZodOptional<z.ZodString>;
    tool: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    content: z.ZodOptional<z.ZodUnknown>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CodexEvent = z.infer<typeof CodexEventSchema>;
/**
 * Result of a single Codex iteration
 */
export declare const CodexIterationResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    exit_code: z.ZodNumber;
    session_id: z.ZodOptional<z.ZodString>;
    tool_calls: z.ZodDefault<z.ZodNumber>;
    files_modified: z.ZodDefault<z.ZodArray<z.ZodString>>;
    final_message: z.ZodOptional<z.ZodString>;
    duration_ms: z.ZodNumber;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CodexIterationResult = z.infer<typeof CodexIterationResultSchema>;
/**
 * Result of a single ralph iteration
 */
export declare const IterationResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    story_id: z.ZodString;
    story_title: z.ZodString;
    codex_result: z.ZodObject<{
        success: z.ZodBoolean;
        exit_code: z.ZodNumber;
        session_id: z.ZodOptional<z.ZodString>;
        tool_calls: z.ZodDefault<z.ZodNumber>;
        files_modified: z.ZodDefault<z.ZodArray<z.ZodString>>;
        final_message: z.ZodOptional<z.ZodString>;
        duration_ms: z.ZodNumber;
        error: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    validation_passed: z.ZodBoolean;
    validation_output: z.ZodOptional<z.ZodString>;
    commit_hash: z.ZodOptional<z.ZodString>;
    learnings: z.ZodOptional<z.ZodString>;
    timestamp: z.ZodString;
}, z.core.$strip>;
export type IterationResult = z.infer<typeof IterationResultSchema>;
/**
 * Result of a full ralph loop
 */
export declare const LoopResultSchema: z.ZodObject<{
    completed: z.ZodBoolean;
    iterations: z.ZodArray<z.ZodObject<{
        success: z.ZodBoolean;
        story_id: z.ZodString;
        story_title: z.ZodString;
        codex_result: z.ZodObject<{
            success: z.ZodBoolean;
            exit_code: z.ZodNumber;
            session_id: z.ZodOptional<z.ZodString>;
            tool_calls: z.ZodDefault<z.ZodNumber>;
            files_modified: z.ZodDefault<z.ZodArray<z.ZodString>>;
            final_message: z.ZodOptional<z.ZodString>;
            duration_ms: z.ZodNumber;
            error: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        validation_passed: z.ZodBoolean;
        validation_output: z.ZodOptional<z.ZodString>;
        commit_hash: z.ZodOptional<z.ZodString>;
        learnings: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodString;
    }, z.core.$strip>>;
    stories_completed: z.ZodNumber;
    stories_remaining: z.ZodNumber;
    total_duration_ms: z.ZodNumber;
    stopped_reason: z.ZodEnum<{
        error: "error";
        all_complete: "all_complete";
        max_iterations: "max_iterations";
        validation_failed: "validation_failed";
        cancelled: "cancelled";
    }>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type LoopResult = z.infer<typeof LoopResultSchema>;
/**
 * Job status enum
 */
export declare const JobStatusSchema: z.ZodEnum<{
    failed: "failed";
    running: "running";
    completed: "completed";
    cancelled: "cancelled";
}>;
export type JobStatus = z.infer<typeof JobStatusSchema>;
/**
 * Async loop job state
 */
export declare const LoopJobSchema: z.ZodObject<{
    id: z.ZodString;
    workdir: z.ZodString;
    status: z.ZodEnum<{
        failed: "failed";
        running: "running";
        completed: "completed";
        cancelled: "cancelled";
    }>;
    started_at: z.ZodNumber;
    completed_at: z.ZodOptional<z.ZodNumber>;
    current_iteration: z.ZodNumber;
    max_iterations: z.ZodNumber;
    current_story: z.ZodOptional<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
    }, z.core.$strip>>;
    stories_completed: z.ZodNumber;
    total_stories: z.ZodNumber;
    results: z.ZodArray<z.ZodObject<{
        success: z.ZodBoolean;
        story_id: z.ZodString;
        story_title: z.ZodString;
        codex_result: z.ZodObject<{
            success: z.ZodBoolean;
            exit_code: z.ZodNumber;
            session_id: z.ZodOptional<z.ZodString>;
            tool_calls: z.ZodDefault<z.ZodNumber>;
            files_modified: z.ZodDefault<z.ZodArray<z.ZodString>>;
            final_message: z.ZodOptional<z.ZodString>;
            duration_ms: z.ZodNumber;
            error: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        validation_passed: z.ZodBoolean;
        validation_output: z.ZodOptional<z.ZodString>;
        commit_hash: z.ZodOptional<z.ZodString>;
        learnings: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodString;
    }, z.core.$strip>>;
    error: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type LoopJob = z.infer<typeof LoopJobSchema>;
/**
 * ralph_init arguments
 */
export declare const RalphInitArgsSchema: z.ZodObject<{
    workdir: z.ZodOptional<z.ZodString>;
    project_name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    use_hive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type RalphInitArgs = z.infer<typeof RalphInitArgsSchema>;
/**
 * ralph_story arguments
 */
export declare const RalphStoryArgsSchema: z.ZodObject<{
    workdir: z.ZodOptional<z.ZodString>;
    title: z.ZodString;
    description: z.ZodString;
    priority: z.ZodDefault<z.ZodNumber>;
    validation_command: z.ZodOptional<z.ZodString>;
    acceptance_criteria: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type RalphStoryArgs = z.infer<typeof RalphStoryArgsSchema>;
/**
 * ralph_iterate arguments
 */
export declare const RalphIterateArgsSchema: z.ZodObject<{
    workdir: z.ZodOptional<z.ZodString>;
    model: z.ZodDefault<z.ZodString>;
    sandbox: z.ZodDefault<z.ZodEnum<{
        "read-only": "read-only";
        "workspace-write": "workspace-write";
        "danger-full-access": "danger-full-access";
    }>>;
    dry_run: z.ZodDefault<z.ZodBoolean>;
    timeout_ms: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type RalphIterateArgs = z.infer<typeof RalphIterateArgsSchema>;
/**
 * ralph_loop arguments
 */
export declare const RalphLoopArgsSchema: z.ZodObject<{
    workdir: z.ZodOptional<z.ZodString>;
    max_iterations: z.ZodDefault<z.ZodNumber>;
    model: z.ZodDefault<z.ZodString>;
    sandbox: z.ZodDefault<z.ZodEnum<{
        "read-only": "read-only";
        "workspace-write": "workspace-write";
        "danger-full-access": "danger-full-access";
    }>>;
    stop_on_failure: z.ZodDefault<z.ZodBoolean>;
    auto_commit: z.ZodDefault<z.ZodBoolean>;
    sync: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export type RalphLoopArgs = z.infer<typeof RalphLoopArgsSchema>;
/**
 * ralph_status arguments
 */
export declare const RalphStatusArgsSchema: z.ZodObject<{
    workdir: z.ZodOptional<z.ZodString>;
    job_id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RalphStatusArgs = z.infer<typeof RalphStatusArgsSchema>;
/**
 * ralph_review arguments
 */
export declare const RalphReviewArgsSchema: z.ZodObject<{
    workdir: z.ZodOptional<z.ZodString>;
    story_id: z.ZodString;
    approve: z.ZodBoolean;
    feedback: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type RalphReviewArgs = z.infer<typeof RalphReviewArgsSchema>;
/**
 * Ralph supervisor configuration
 */
export declare const RalphConfigSchema: z.ZodObject<{
    model: z.ZodDefault<z.ZodString>;
    max_iterations: z.ZodDefault<z.ZodNumber>;
    sandbox: z.ZodDefault<z.ZodEnum<{
        "read-only": "read-only";
        "workspace-write": "workspace-write";
        "danger-full-access": "danger-full-access";
    }>>;
    auto_commit: z.ZodDefault<z.ZodBoolean>;
    default_validation: z.ZodDefault<z.ZodString>;
    progress_context_limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type RalphConfig = z.infer<typeof RalphConfigSchema>;
export declare const ralphSchemas: {
    StoryStatusSchema: z.ZodEnum<{
        passed: "passed";
        in_progress: "in_progress";
        blocked: "blocked";
        failed: "failed";
        pending: "pending";
        ready_for_review: "ready_for_review";
    }>;
    StorySchema: z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodString;
        priority: z.ZodDefault<z.ZodNumber>;
        status: z.ZodDefault<z.ZodEnum<{
            passed: "passed";
            in_progress: "in_progress";
            blocked: "blocked";
            failed: "failed";
            pending: "pending";
            ready_for_review: "ready_for_review";
        }>>;
        validation_command: z.ZodOptional<z.ZodString>;
        acceptance_criteria: z.ZodOptional<z.ZodArray<z.ZodString>>;
        files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
        attempts: z.ZodDefault<z.ZodNumber>;
        last_error: z.ZodOptional<z.ZodString>;
        cell_id: z.ZodOptional<z.ZodString>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
    }, z.core.$strip>;
    PRDMetadataSchema: z.ZodObject<{
        created_at: z.ZodString;
        last_iteration: z.ZodOptional<z.ZodString>;
        total_iterations: z.ZodDefault<z.ZodNumber>;
        total_stories_completed: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    PRDSchema: z.ZodObject<{
        version: z.ZodDefault<z.ZodString>;
        project_name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        stories: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
            description: z.ZodString;
            priority: z.ZodDefault<z.ZodNumber>;
            status: z.ZodDefault<z.ZodEnum<{
                passed: "passed";
                in_progress: "in_progress";
                blocked: "blocked";
                failed: "failed";
                pending: "pending";
                ready_for_review: "ready_for_review";
            }>>;
            validation_command: z.ZodOptional<z.ZodString>;
            acceptance_criteria: z.ZodOptional<z.ZodArray<z.ZodString>>;
            files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
            attempts: z.ZodDefault<z.ZodNumber>;
            last_error: z.ZodOptional<z.ZodString>;
            cell_id: z.ZodOptional<z.ZodString>;
            created_at: z.ZodString;
            updated_at: z.ZodString;
        }, z.core.$strip>>>;
        metadata: z.ZodObject<{
            created_at: z.ZodString;
            last_iteration: z.ZodOptional<z.ZodString>;
            total_iterations: z.ZodDefault<z.ZodNumber>;
            total_stories_completed: z.ZodDefault<z.ZodNumber>;
        }, z.core.$strip>;
    }, z.core.$strip>;
    SandboxModeSchema: z.ZodEnum<{
        "read-only": "read-only";
        "workspace-write": "workspace-write";
        "danger-full-access": "danger-full-access";
    }>;
    CodexEventTypeSchema: z.ZodEnum<{
        error: "error";
        session_start: "session_start";
        session_meta: "session_meta";
        tool_call: "tool_call";
        function_call: "function_call";
        response_item: "response_item";
    }>;
    CodexEventSchema: z.ZodObject<{
        type: z.ZodEnum<{
            error: "error";
            session_start: "session_start";
            session_meta: "session_meta";
            tool_call: "tool_call";
            function_call: "function_call";
            response_item: "response_item";
        }>;
        session_id: z.ZodOptional<z.ZodString>;
        tool: z.ZodOptional<z.ZodString>;
        name: z.ZodOptional<z.ZodString>;
        arguments: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        content: z.ZodOptional<z.ZodUnknown>;
        error: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    CodexIterationResultSchema: z.ZodObject<{
        success: z.ZodBoolean;
        exit_code: z.ZodNumber;
        session_id: z.ZodOptional<z.ZodString>;
        tool_calls: z.ZodDefault<z.ZodNumber>;
        files_modified: z.ZodDefault<z.ZodArray<z.ZodString>>;
        final_message: z.ZodOptional<z.ZodString>;
        duration_ms: z.ZodNumber;
        error: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    IterationResultSchema: z.ZodObject<{
        success: z.ZodBoolean;
        story_id: z.ZodString;
        story_title: z.ZodString;
        codex_result: z.ZodObject<{
            success: z.ZodBoolean;
            exit_code: z.ZodNumber;
            session_id: z.ZodOptional<z.ZodString>;
            tool_calls: z.ZodDefault<z.ZodNumber>;
            files_modified: z.ZodDefault<z.ZodArray<z.ZodString>>;
            final_message: z.ZodOptional<z.ZodString>;
            duration_ms: z.ZodNumber;
            error: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>;
        validation_passed: z.ZodBoolean;
        validation_output: z.ZodOptional<z.ZodString>;
        commit_hash: z.ZodOptional<z.ZodString>;
        learnings: z.ZodOptional<z.ZodString>;
        timestamp: z.ZodString;
    }, z.core.$strip>;
    LoopResultSchema: z.ZodObject<{
        completed: z.ZodBoolean;
        iterations: z.ZodArray<z.ZodObject<{
            success: z.ZodBoolean;
            story_id: z.ZodString;
            story_title: z.ZodString;
            codex_result: z.ZodObject<{
                success: z.ZodBoolean;
                exit_code: z.ZodNumber;
                session_id: z.ZodOptional<z.ZodString>;
                tool_calls: z.ZodDefault<z.ZodNumber>;
                files_modified: z.ZodDefault<z.ZodArray<z.ZodString>>;
                final_message: z.ZodOptional<z.ZodString>;
                duration_ms: z.ZodNumber;
                error: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
            validation_passed: z.ZodBoolean;
            validation_output: z.ZodOptional<z.ZodString>;
            commit_hash: z.ZodOptional<z.ZodString>;
            learnings: z.ZodOptional<z.ZodString>;
            timestamp: z.ZodString;
        }, z.core.$strip>>;
        stories_completed: z.ZodNumber;
        stories_remaining: z.ZodNumber;
        total_duration_ms: z.ZodNumber;
        stopped_reason: z.ZodEnum<{
            error: "error";
            all_complete: "all_complete";
            max_iterations: "max_iterations";
            validation_failed: "validation_failed";
            cancelled: "cancelled";
        }>;
        error: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    JobStatusSchema: z.ZodEnum<{
        failed: "failed";
        running: "running";
        completed: "completed";
        cancelled: "cancelled";
    }>;
    LoopJobSchema: z.ZodObject<{
        id: z.ZodString;
        workdir: z.ZodString;
        status: z.ZodEnum<{
            failed: "failed";
            running: "running";
            completed: "completed";
            cancelled: "cancelled";
        }>;
        started_at: z.ZodNumber;
        completed_at: z.ZodOptional<z.ZodNumber>;
        current_iteration: z.ZodNumber;
        max_iterations: z.ZodNumber;
        current_story: z.ZodOptional<z.ZodObject<{
            id: z.ZodString;
            title: z.ZodString;
        }, z.core.$strip>>;
        stories_completed: z.ZodNumber;
        total_stories: z.ZodNumber;
        results: z.ZodArray<z.ZodObject<{
            success: z.ZodBoolean;
            story_id: z.ZodString;
            story_title: z.ZodString;
            codex_result: z.ZodObject<{
                success: z.ZodBoolean;
                exit_code: z.ZodNumber;
                session_id: z.ZodOptional<z.ZodString>;
                tool_calls: z.ZodDefault<z.ZodNumber>;
                files_modified: z.ZodDefault<z.ZodArray<z.ZodString>>;
                final_message: z.ZodOptional<z.ZodString>;
                duration_ms: z.ZodNumber;
                error: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>;
            validation_passed: z.ZodBoolean;
            validation_output: z.ZodOptional<z.ZodString>;
            commit_hash: z.ZodOptional<z.ZodString>;
            learnings: z.ZodOptional<z.ZodString>;
            timestamp: z.ZodString;
        }, z.core.$strip>>;
        error: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    RalphInitArgsSchema: z.ZodObject<{
        workdir: z.ZodOptional<z.ZodString>;
        project_name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        use_hive: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>;
    RalphStoryArgsSchema: z.ZodObject<{
        workdir: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        description: z.ZodString;
        priority: z.ZodDefault<z.ZodNumber>;
        validation_command: z.ZodOptional<z.ZodString>;
        acceptance_criteria: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    RalphIterateArgsSchema: z.ZodObject<{
        workdir: z.ZodOptional<z.ZodString>;
        model: z.ZodDefault<z.ZodString>;
        sandbox: z.ZodDefault<z.ZodEnum<{
            "read-only": "read-only";
            "workspace-write": "workspace-write";
            "danger-full-access": "danger-full-access";
        }>>;
        dry_run: z.ZodDefault<z.ZodBoolean>;
        timeout_ms: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
    RalphLoopArgsSchema: z.ZodObject<{
        workdir: z.ZodOptional<z.ZodString>;
        max_iterations: z.ZodDefault<z.ZodNumber>;
        model: z.ZodDefault<z.ZodString>;
        sandbox: z.ZodDefault<z.ZodEnum<{
            "read-only": "read-only";
            "workspace-write": "workspace-write";
            "danger-full-access": "danger-full-access";
        }>>;
        stop_on_failure: z.ZodDefault<z.ZodBoolean>;
        auto_commit: z.ZodDefault<z.ZodBoolean>;
        sync: z.ZodDefault<z.ZodBoolean>;
    }, z.core.$strip>;
    RalphStatusArgsSchema: z.ZodObject<{
        workdir: z.ZodOptional<z.ZodString>;
        job_id: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    RalphReviewArgsSchema: z.ZodObject<{
        workdir: z.ZodOptional<z.ZodString>;
        story_id: z.ZodString;
        approve: z.ZodBoolean;
        feedback: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    RalphConfigSchema: z.ZodObject<{
        model: z.ZodDefault<z.ZodString>;
        max_iterations: z.ZodDefault<z.ZodNumber>;
        sandbox: z.ZodDefault<z.ZodEnum<{
            "read-only": "read-only";
            "workspace-write": "workspace-write";
            "danger-full-access": "danger-full-access";
        }>>;
        auto_commit: z.ZodDefault<z.ZodBoolean>;
        default_validation: z.ZodDefault<z.ZodString>;
        progress_context_limit: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>;
};
//# sourceMappingURL=ralph.d.ts.map