/**
 * Dashboard Data Layer
 *
 * Provides read-only queries for swarm observability dashboard.
 * Data sources:
 * - libSQL events table (event sourcing)
 * - Hive cells (work items)
 * - Agent projections (agent states)
 * - Reservation projections (file locks)
 */
export interface WorkerStatus {
    agent_name: string;
    status: "idle" | "working" | "blocked";
    current_task?: string;
    last_activity: string;
}
export interface SubtaskProgress {
    bead_id: string;
    title: string;
    status: "open" | "in_progress" | "completed" | "blocked";
    progress_percent: number;
}
export interface FileLock {
    path: string;
    agent_name: string;
    reason: string;
    acquired_at: string;
    ttl_seconds: number;
}
export interface RecentMessage {
    id: number;
    from: string;
    to: string[];
    subject: string;
    timestamp: string;
    importance: "low" | "normal" | "high" | "urgent";
}
export interface EpicInfo {
    epic_id: string;
    title: string;
    subtask_count: number;
    completed_count: number;
}
/**
 * Get current status of all worker agents.
 * Derives status from latest events: task_started, progress_reported, task_blocked, etc.
 */
export declare function getWorkerStatus(projectPath: string, options?: {
    project_key?: string;
}): Promise<WorkerStatus[]>;
/**
 * Get progress of all subtasks within an epic.
 * Returns completion percentage from progress_reported events.
 */
export declare function getSubtaskProgress(projectPath: string, epic_id: string): Promise<SubtaskProgress[]>;
/**
 * Get currently active file reservations.
 * Excludes released reservations.
 */
export declare function getFileLocks(projectPath: string, options?: {
    project_key?: string;
}): Promise<FileLock[]>;
/**
 * Get recent swarm mail messages, ordered by timestamp descending.
 * Defaults to limit of 10.
 */
export declare function getRecentMessages(projectPath: string, options?: {
    limit?: number;
    thread_id?: string;
    importance?: "low" | "normal" | "high" | "urgent";
}): Promise<RecentMessage[]>;
/**
 * Get list of all epics with subtask counts.
 * Used for dashboard tabs/navigation.
 *
 * Derives epic information from events when beads table doesn't exist (test mode).
 * In production, queries beads table directly.
 */
export declare function getEpicList(projectPath: string, options?: {
    status?: "open" | "in_progress" | "completed" | "blocked";
}): Promise<EpicInfo[]>;
//# sourceMappingURL=dashboard.d.ts.map