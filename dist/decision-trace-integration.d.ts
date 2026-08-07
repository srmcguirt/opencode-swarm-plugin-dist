/**
 * Decision Trace Integration
 *
 * Wires decision trace capture into swarm coordination tools.
 * Provides helper functions that tools can call to record decisions.
 *
 * ## Decision Types Captured
 *
 * - **strategy_selection** - Coordinator choosing decomposition strategy
 * - **worker_spawn** - Coordinator spawning a worker agent
 * - **review_decision** - Coordinator approving/rejecting worker output
 * - **file_selection** - Worker choosing which files to modify
 * - **scope_change** - Worker expanding/contracting task scope
 *
 * ## Usage
 *
 * ```typescript
 * import { traceStrategySelection, traceWorkerSpawn } from "./decision-trace-integration.js";
 *
 * // In swarm_delegate_planning:
 * await traceStrategySelection({
 *   projectKey: "/path/to/project",
 *   agentName: "coordinator",
 *   epicId: "epic-123",
 *   strategy: "file-based",
 *   reasoning: "File-based chosen due to clear file boundaries",
 *   alternatives: [{ strategy: "feature-based", reason: "rejected" }],
 * });
 * ```
 *
 * @module decision-trace-integration
 */
/**
 * Extract memory IDs from precedent_cited object
 *
 * Handles both single memoryId and array memoryIds fields.
 *
 * @param precedentCited - Precedent object from decision trace
 * @returns Array of memory IDs (empty if none found)
 */
export declare function extractMemoryIds(precedentCited?: {
    memoryId?: string;
    memoryIds?: string[];
    similarity?: number;
} | null): string[];
/**
 * Input for tracing strategy selection decisions
 */
export interface StrategySelectionInput {
    projectKey: string;
    agentName: string;
    epicId?: string;
    beadId?: string;
    strategy: string;
    reasoning: string;
    confidence?: number;
    taskPreview?: string;
    inputsGathered?: Array<{
        source: string;
        query?: string;
        results?: number;
    }>;
    alternatives?: Array<{
        strategy: string;
        score?: number;
        reason?: string;
    }>;
    precedentCited?: {
        memoryId?: string;
        memoryIds?: string[];
        similarity?: number;
        cassResults?: number;
    };
}
/**
 * Trace a strategy selection decision
 *
 * Call this when the coordinator selects a decomposition strategy.
 * Automatically creates entity links to any memory patterns cited as precedent.
 *
 * @param input - Strategy selection details
 * @returns Created decision trace ID
 */
export declare function traceStrategySelection(input: StrategySelectionInput): Promise<string>;
/**
 * Input for tracing worker spawn decisions
 */
export interface WorkerSpawnInput {
    projectKey: string;
    agentName: string;
    epicId: string;
    beadId: string;
    workerName?: string;
    subtaskTitle: string;
    files: string[];
    model?: string;
    spawnOrder?: number;
    isParallel?: boolean;
    rationale?: string;
}
/**
 * Trace a worker spawn decision
 *
 * Call this when the coordinator spawns a worker agent.
 * Automatically creates entity links to assigned files.
 *
 * @param input - Worker spawn details
 * @returns Created decision trace ID
 */
export declare function traceWorkerSpawn(input: WorkerSpawnInput): Promise<string>;
/**
 * Input for tracing review decisions
 */
export interface ReviewDecisionInput {
    projectKey: string;
    agentName: string;
    epicId: string;
    beadId: string;
    workerId: string;
    status: "approved" | "needs_changes";
    summary?: string;
    issues?: Array<{
        file: string;
        line?: number;
        issue: string;
        suggestion?: string;
    }>;
    attemptNumber?: number;
    remainingAttempts?: number;
    rationale?: string;
}
/**
 * Trace a review decision
 *
 * Call this when the coordinator approves or rejects worker output.
 * Automatically creates entity link to the worker agent being reviewed.
 *
 * @param input - Review decision details
 * @returns Created decision trace ID
 */
export declare function traceReviewDecision(input: ReviewDecisionInput): Promise<string>;
/**
 * Input for tracing file selection decisions
 */
export interface FileSelectionInput {
    projectKey: string;
    agentName: string;
    epicId?: string;
    beadId: string;
    filesSelected: string[];
    filesOwned: string[];
    rationale?: string;
    scopeExpanded?: boolean;
}
/**
 * Trace a file selection decision
 *
 * Call this when a worker selects which files to modify.
 *
 * @param input - File selection details
 * @returns Created decision trace ID
 */
export declare function traceFileSelection(input: FileSelectionInput): Promise<string>;
/**
 * Input for tracing scope change decisions
 */
export interface ScopeChangeInput {
    projectKey: string;
    agentName: string;
    epicId?: string;
    beadId: string;
    filesAdded?: string[];
    filesRemoved?: string[];
    reason: string;
    coordinatorApproved?: boolean;
}
/**
 * Trace a scope change decision
 *
 * Call this when a worker expands or contracts their task scope.
 *
 * @param input - Scope change details
 * @returns Created decision trace ID
 */
export declare function traceScopeChange(input: ScopeChangeInput): Promise<string>;
/**
 * Get all decision traces for an epic
 *
 * Useful for post-hoc analysis of how an epic was coordinated.
 *
 * @param projectKey - Project path
 * @param epicId - Epic ID to query
 * @returns Array of decision traces
 */
export declare function getEpicDecisionTraces(projectKey: string, epicId: string): Promise<import("swarm-mail").DecisionTrace[]>;
/**
 * Get decision traces by type for analysis
 *
 * @param projectKey - Project path
 * @param decisionType - Type of decision to query
 * @returns Array of decision traces
 */
export declare function getDecisionTracesByType(projectKey: string, decisionType: string): Promise<import("swarm-mail").DecisionTrace[]>;
/**
 * Input for linking an outcome to a decision trace
 */
export interface LinkOutcomeInput {
    projectKey: string;
    beadId: string;
    outcomeEventId: number;
}
/**
 * Link an outcome event to its decision trace and calculate quality score.
 *
 * Finds the most recent decision trace for the bead and links the outcome
 * event to it, triggering quality score calculation.
 *
 * @param input - Outcome linking details
 * @returns true if linked successfully, false if no trace found or error
 */
export declare function linkOutcomeToDecisionTrace(input: LinkOutcomeInput): Promise<boolean>;
//# sourceMappingURL=decision-trace-integration.d.ts.map