/**
 * Swarm Signature Detection
 *
 * Deterministic, algorithmic detection of swarm coordination from session events.
 * No heuristics, no confidence levels - a swarm either exists or it doesn't.
 *
 * A SWARM is defined by this event sequence:
 * 1. hive_create_epic(epic_title, subtasks[]) → epic_id
 * 2. swarm_spawn_subtask(bead_id, epic_id, ...) → prompt (at least one)
 *
 * The projection folds over events to produce ground truth state:
 * - Which epic is being coordinated
 * - Which subtasks exist and their lifecycle status
 * - What files are assigned to each subtask
 *
 * @module swarm-signature
 */
/**
 * Subtask lifecycle status derived from events
 */
export type SubtaskStatus = "created" | "spawned" | "in_progress" | "completed" | "closed";
/**
 * Subtask state projected from events
 */
export interface SubtaskState {
    id: string;
    title: string;
    status: SubtaskStatus;
    files: string[];
    worker?: string;
    spawnedAt?: number;
    completedAt?: number;
}
/**
 * Epic state projected from events
 */
export interface EpicState {
    id: string;
    title: string;
    status: "open" | "in_progress" | "closed";
    createdAt: number;
}
/**
 * Complete swarm state projected from session events
 */
export interface SwarmProjection {
    /** Whether a valid swarm signature was detected */
    isSwarm: boolean;
    /** Epic being coordinated (if any) */
    epic?: EpicState;
    /** Subtasks by ID */
    subtasks: Map<string, SubtaskState>;
    /** Project path from swarmmail_init */
    projectPath?: string;
    /** Coordinator agent name from swarmmail_init */
    coordinatorName?: string;
    /** Last event timestamp */
    lastEventAt?: number;
    /** Summary counts for quick access */
    counts: {
        total: number;
        created: number;
        spawned: number;
        inProgress: number;
        completed: number;
        closed: number;
    };
}
/**
 * Tool call event extracted from session messages
 */
export interface ToolCallEvent {
    tool: string;
    input: Record<string, unknown>;
    output: string;
    timestamp: number;
}
/**
 * Project swarm state from session tool call events
 *
 * This is a pure fold over events - deterministic and side-effect free.
 * The resulting state is the ground truth for swarm coordination.
 *
 * @param events - Tool call events from session messages (chronological order)
 * @returns Projected swarm state
 */
export declare function projectSwarmState(events: ToolCallEvent[]): SwarmProjection;
/**
 * Check if events contain a valid swarm signature
 *
 * A swarm signature requires:
 * 1. hive_create_epic call
 * 2. At least one swarm_spawn_subtask call
 *
 * This is a quick check without full projection.
 */
export declare function hasSwarmSignature(events: ToolCallEvent[]): boolean;
/**
 * Check if swarm is still active (has pending work)
 */
export declare function isSwarmActive(projection: SwarmProjection): boolean;
/**
 * Get human-readable swarm status summary
 */
export declare function getSwarmSummary(projection: SwarmProjection): string;
//# sourceMappingURL=swarm-signature.d.ts.map