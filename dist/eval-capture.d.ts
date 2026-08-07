import { z } from "zod";
/**
 * Subtask outcome - what actually happened
 */
export declare const SubtaskOutcomeSchema: z.ZodObject<{
    bead_id: z.ZodString;
    title: z.ZodString;
    planned_files: z.ZodArray<z.ZodString>;
    actual_files: z.ZodArray<z.ZodString>;
    duration_ms: z.ZodNumber;
    error_count: z.ZodNumber;
    retry_count: z.ZodNumber;
    success: z.ZodBoolean;
    failure_mode: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SubtaskOutcome = z.infer<typeof SubtaskOutcomeSchema>;
/**
 * Complete eval record - input, output, and outcome
 */
export declare const EvalRecordSchema: z.ZodObject<{
    id: z.ZodString;
    timestamp: z.ZodString;
    project_path: z.ZodString;
    task: z.ZodString;
    context: z.ZodOptional<z.ZodString>;
    strategy: z.ZodEnum<{
        "file-based": "file-based";
        "feature-based": "feature-based";
        "risk-based": "risk-based";
        auto: "auto";
    }>;
    subtask_count: z.ZodNumber;
    epic_title: z.ZodString;
    epic_description: z.ZodOptional<z.ZodString>;
    subtasks: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        files: z.ZodArray<z.ZodString>;
        dependencies: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        estimated_complexity: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    outcomes: z.ZodOptional<z.ZodArray<z.ZodObject<{
        bead_id: z.ZodString;
        title: z.ZodString;
        planned_files: z.ZodArray<z.ZodString>;
        actual_files: z.ZodArray<z.ZodString>;
        duration_ms: z.ZodNumber;
        error_count: z.ZodNumber;
        retry_count: z.ZodNumber;
        success: z.ZodBoolean;
        failure_mode: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>>;
    overall_success: z.ZodOptional<z.ZodBoolean>;
    total_duration_ms: z.ZodOptional<z.ZodNumber>;
    total_errors: z.ZodOptional<z.ZodNumber>;
    human_accepted: z.ZodOptional<z.ZodBoolean>;
    human_modified: z.ZodOptional<z.ZodBoolean>;
    human_notes: z.ZodOptional<z.ZodString>;
    file_overlap_count: z.ZodOptional<z.ZodNumber>;
    scope_accuracy: z.ZodOptional<z.ZodNumber>;
    time_balance_ratio: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type EvalRecord = z.infer<typeof EvalRecordSchema>;
/**
 * Partial record for in-progress capture
 */
export type PartialEvalRecord = Partial<EvalRecord> & {
    id: string;
    timestamp: string;
    task: string;
};
/**
 * Coordinator Event - captures coordinator decisions, violations, outcomes, and compaction
 */
export declare const CoordinatorEventSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    session_id: z.ZodString;
    epic_id: z.ZodString;
    timestamp: z.ZodString;
    event_type: z.ZodLiteral<"DECISION">;
    decision_type: z.ZodEnum<{
        worker_spawned: "worker_spawned";
        review_completed: "review_completed";
        skill_loaded: "skill_loaded";
        strategy_selected: "strategy_selected";
        decomposition_complete: "decomposition_complete";
        researcher_spawned: "researcher_spawned";
        inbox_checked: "inbox_checked";
        blocker_resolved: "blocker_resolved";
        scope_change_approved: "scope_change_approved";
        scope_change_rejected: "scope_change_rejected";
    }>;
    payload: z.ZodAny;
}, z.core.$strip>, z.ZodObject<{
    session_id: z.ZodString;
    epic_id: z.ZodString;
    timestamp: z.ZodString;
    event_type: z.ZodLiteral<"VIOLATION">;
    violation_type: z.ZodEnum<{
        coordinator_edited_file: "coordinator_edited_file";
        coordinator_ran_tests: "coordinator_ran_tests";
        coordinator_reserved_files: "coordinator_reserved_files";
        no_worker_spawned: "no_worker_spawned";
        worker_completed_without_review: "worker_completed_without_review";
    }>;
    payload: z.ZodAny;
}, z.core.$strip>, z.ZodObject<{
    session_id: z.ZodString;
    epic_id: z.ZodString;
    timestamp: z.ZodString;
    event_type: z.ZodLiteral<"OUTCOME">;
    outcome_type: z.ZodEnum<{
        subtask_success: "subtask_success";
        subtask_retry: "subtask_retry";
        subtask_failed: "subtask_failed";
        epic_complete: "epic_complete";
        blocker_detected: "blocker_detected";
    }>;
    payload: z.ZodAny;
}, z.core.$strip>, z.ZodObject<{
    session_id: z.ZodString;
    epic_id: z.ZodString;
    timestamp: z.ZodString;
    event_type: z.ZodLiteral<"COMPACTION">;
    compaction_type: z.ZodEnum<{
        context_injected: "context_injected";
        detection_complete: "detection_complete";
        prompt_generated: "prompt_generated";
        resumption_started: "resumption_started";
        tool_call_tracked: "tool_call_tracked";
    }>;
    payload: z.ZodAny;
}, z.core.$strip>], "event_type">;
export type CoordinatorEvent = z.infer<typeof CoordinatorEventSchema>;
/**
 * Coordinator Session - wraps a full coordinator session
 */
export declare const CoordinatorSessionSchema: z.ZodObject<{
    session_id: z.ZodString;
    epic_id: z.ZodString;
    start_time: z.ZodString;
    end_time: z.ZodOptional<z.ZodString>;
    events: z.ZodArray<z.ZodDiscriminatedUnion<[z.ZodObject<{
        session_id: z.ZodString;
        epic_id: z.ZodString;
        timestamp: z.ZodString;
        event_type: z.ZodLiteral<"DECISION">;
        decision_type: z.ZodEnum<{
            worker_spawned: "worker_spawned";
            review_completed: "review_completed";
            skill_loaded: "skill_loaded";
            strategy_selected: "strategy_selected";
            decomposition_complete: "decomposition_complete";
            researcher_spawned: "researcher_spawned";
            inbox_checked: "inbox_checked";
            blocker_resolved: "blocker_resolved";
            scope_change_approved: "scope_change_approved";
            scope_change_rejected: "scope_change_rejected";
        }>;
        payload: z.ZodAny;
    }, z.core.$strip>, z.ZodObject<{
        session_id: z.ZodString;
        epic_id: z.ZodString;
        timestamp: z.ZodString;
        event_type: z.ZodLiteral<"VIOLATION">;
        violation_type: z.ZodEnum<{
            coordinator_edited_file: "coordinator_edited_file";
            coordinator_ran_tests: "coordinator_ran_tests";
            coordinator_reserved_files: "coordinator_reserved_files";
            no_worker_spawned: "no_worker_spawned";
            worker_completed_without_review: "worker_completed_without_review";
        }>;
        payload: z.ZodAny;
    }, z.core.$strip>, z.ZodObject<{
        session_id: z.ZodString;
        epic_id: z.ZodString;
        timestamp: z.ZodString;
        event_type: z.ZodLiteral<"OUTCOME">;
        outcome_type: z.ZodEnum<{
            subtask_success: "subtask_success";
            subtask_retry: "subtask_retry";
            subtask_failed: "subtask_failed";
            epic_complete: "epic_complete";
            blocker_detected: "blocker_detected";
        }>;
        payload: z.ZodAny;
    }, z.core.$strip>, z.ZodObject<{
        session_id: z.ZodString;
        epic_id: z.ZodString;
        timestamp: z.ZodString;
        event_type: z.ZodLiteral<"COMPACTION">;
        compaction_type: z.ZodEnum<{
            context_injected: "context_injected";
            detection_complete: "detection_complete";
            prompt_generated: "prompt_generated";
            resumption_started: "resumption_started";
            tool_call_tracked: "tool_call_tracked";
        }>;
        payload: z.ZodAny;
    }, z.core.$strip>], "event_type">>;
}, z.core.$strip>;
export type CoordinatorSession = z.infer<typeof CoordinatorSessionSchema>;
/**
 * Default path for eval data
 */
export declare const DEFAULT_EVAL_DATA_PATH = ".opencode/eval-data.jsonl";
/**
 * Get the eval data file path for a project
 */
export declare function getEvalDataPath(projectPath: string): string;
/**
 * Ensure the eval data directory exists
 */
export declare function ensureEvalDataDir(projectPath: string): void;
/**
 * Append an eval record to the JSONL file
 */
export declare function appendEvalRecord(projectPath: string, record: EvalRecord | PartialEvalRecord): void;
/**
 * Read all eval records from a project
 */
export declare function readEvalRecords(projectPath: string): EvalRecord[];
/**
 * Read partial records (for updating in-progress records)
 */
export declare function readPartialRecords(projectPath: string): PartialEvalRecord[];
/**
 * Update an existing record by ID
 */
export declare function updateEvalRecord(projectPath: string, id: string, updates: Partial<EvalRecord>): boolean;
/**
 * Start capturing a decomposition
 *
 * Called when swarm_decompose generates a decomposition.
 * Creates a partial record that will be completed when outcomes arrive.
 */
export declare function captureDecomposition(params: {
    epicId: string;
    projectPath: string;
    task: string;
    context?: string;
    strategy: "file-based" | "feature-based" | "risk-based" | "auto";
    epicTitle: string;
    epicDescription?: string;
    subtasks: Array<{
        title: string;
        description?: string;
        files: string[];
        dependencies?: number[];
        estimated_complexity?: number;
    }>;
}): PartialEvalRecord;
/**
 * Capture a subtask outcome
 *
 * Called when swarm_complete finishes a subtask.
 * Updates the in-progress record with outcome data.
 */
export declare function captureSubtaskOutcome(params: {
    epicId: string;
    projectPath: string;
    beadId: string;
    title: string;
    plannedFiles: string[];
    actualFiles: string[];
    durationMs: number;
    errorCount: number;
    retryCount: number;
    success: boolean;
    failureMode?: string;
}): void;
/**
 * Finalize an eval record
 *
 * Called when all subtasks are complete.
 * Computes aggregate metrics and marks record as complete.
 */
export declare function finalizeEvalRecord(params: {
    epicId: string;
    projectPath: string;
}): EvalRecord | null;
/**
 * Capture human feedback on a decomposition
 */
export declare function captureHumanFeedback(params: {
    epicId: string;
    projectPath: string;
    accepted: boolean;
    modified: boolean;
    notes?: string;
}): void;
/**
 * Export eval records as Evalite-compatible test cases
 *
 * Filters to only complete records with outcomes.
 */
export declare function exportForEvalite(projectPath: string): Array<{
    input: {
        task: string;
        context?: string;
    };
    expected: {
        minSubtasks: number;
        subtaskCount: number;
        requiredFiles?: string[];
        overallSuccess?: boolean;
    };
    actual: EvalRecord;
}>;
/**
 * Get statistics about captured eval data
 */
export declare function getEvalDataStats(projectPath: string): {
    totalRecords: number;
    completeRecords: number;
    successRate: number;
    avgSubtasks: number;
    avgDurationMs: number;
    avgScopeAccuracy: number;
    avgTimeBalance: number;
};
/**
 * Get the session directory path
 * Can be overridden via SWARM_SESSIONS_DIR env var for testing
 */
export declare function getSessionDir(): string;
/**
 * Get the session file path for a session ID
 */
export declare function getSessionPath(sessionId: string): string;
/**
 * Ensure the session directory exists
 */
export declare function ensureSessionDir(): void;
/**
 * Capture a coordinator event to libSQL via appendEvent
 *
 * Stores event in events table with type based on event_type:
 * - DECISION → coordinator_decision
 * - VIOLATION → coordinator_violation
 * - OUTCOME → coordinator_outcome
 * - COMPACTION → coordinator_compaction
 *
 * The project_key is derived from the session working directory (process.cwd()).
 * Events are queryable via observability-tools.ts.
 */
export declare function captureCoordinatorEvent(event: CoordinatorEvent): Promise<void>;
/**
 * Capture a compaction event to the session file
 *
 * Helper for capturing COMPACTION events with automatic timestamp generation.
 * Tracks compaction hook lifecycle: detection → prompt generation → context injection → resumption.
 *
 * **Part of eval-driven development pipeline:** Compaction events are used by `compaction-prompt.eval.ts`
 * to score prompt quality (ID specificity, actionability, coordinator identity).
 *
 * **Lifecycle stages:**
 * - `detection_complete` - Compaction detected (confidence level, context type)
 * - `prompt_generated` - Continuation prompt created (FULL content stored for eval)
 * - `context_injected` - Prompt injected into OpenCode context
 * - `resumption_started` - Coordinator resumed from checkpoint
 * - `tool_call_tracked` - First tool called post-compaction (measures discipline)
 *
 * @param params - Compaction event parameters
 * @param params.session_id - Coordinator session ID
 * @param params.epic_id - Epic ID being coordinated
 * @param params.compaction_type - Stage of compaction lifecycle
 * @param params.payload - Event-specific data (full prompt content, detection results, etc.)
 *
 * @example
 * // Capture detection complete
 * captureCompactionEvent({
 *   session_id: "session-123",
 *   epic_id: "bd-456",
 *   compaction_type: "detection_complete",
 *   payload: {
 *     confidence: "high",
 *     context_type: "full",
 *     epic_id: "bd-456",
 *   },
 * });
 *
 * @example
 * // Capture prompt generated (with full content for eval)
 * captureCompactionEvent({
 *   session_id: "session-123",
 *   epic_id: "bd-456",
 *   compaction_type: "prompt_generated",
 *   payload: {
 *     prompt_length: 5000,
 *     full_prompt: "You are a coordinator...", // Full prompt, not truncated - used for quality scoring
 *     context_type: "full",
 *   },
 * });
 */
export declare function captureCompactionEvent(params: {
    session_id: string;
    epic_id: string;
    compaction_type: "detection_complete" | "prompt_generated" | "context_injected" | "resumption_started" | "tool_call_tracked";
    payload: any;
}): Promise<void>;
/**
 * Capture a researcher spawned event
 *
 * Called when coordinator spawns a swarm-researcher to handle unfamiliar technology
 * or gather documentation before decomposition.
 */
export declare function captureResearcherSpawned(params: {
    session_id: string;
    epic_id: string;
    researcher_id: string;
    research_topic: string;
    tools_used?: string[];
}): Promise<void>;
/**
 * Capture a skill loaded event
 *
 * Called when coordinator loads domain knowledge via skills_use().
 */
export declare function captureSkillLoaded(params: {
    session_id: string;
    epic_id: string;
    skill_name: string;
    context?: string;
}): Promise<void>;
/**
 * Capture an inbox checked event
 *
 * Called when coordinator checks swarmmail inbox for worker messages.
 * Tracks monitoring frequency and responsiveness.
 */
export declare function captureInboxChecked(params: {
    session_id: string;
    epic_id: string;
    message_count: number;
    urgent_count: number;
}): Promise<void>;
/**
 * Capture a blocker resolved event
 *
 * Called when coordinator successfully unblocks a worker.
 */
export declare function captureBlockerResolved(params: {
    session_id: string;
    epic_id: string;
    worker_id: string;
    subtask_id: string;
    blocker_type: string;
    resolution: string;
}): Promise<void>;
/**
 * Capture a scope change decision event
 *
 * Called when coordinator approves or rejects a worker's scope expansion request.
 */
export declare function captureScopeChangeDecision(params: {
    session_id: string;
    epic_id: string;
    worker_id: string;
    subtask_id: string;
    approved: boolean;
    original_scope?: string;
    new_scope?: string;
    requested_scope?: string;
    rejection_reason?: string;
    estimated_time_add?: number;
}): Promise<void>;
/**
 * Capture a blocker detected event
 *
 * Called when a worker reports being blocked (OUTCOME event, not DECISION).
 */
export declare function captureBlockerDetected(params: {
    session_id: string;
    epic_id: string;
    worker_id: string;
    subtask_id: string;
    blocker_type: string;
    blocker_description: string;
}): Promise<void>;
/**
 * Read all events from a session file
 */
export declare function readSessionEvents(sessionId: string): CoordinatorEvent[];
/**
 * Save a session - wraps all events in a CoordinatorSession structure
 *
 * Reads all events from the session file and wraps them in a session object.
 * Returns null if the session file doesn't exist.
 */
export declare function saveSession(params: {
    session_id: string;
    epic_id: string;
}): CoordinatorSession | null;
//# sourceMappingURL=eval-capture.d.ts.map