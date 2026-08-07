/**
 * Replay Tools - Event replay with timing simulation
 *
 * TDD GREEN: Minimal implementation to pass tests
 */
export type ReplaySpeed = "1x" | "2x" | "instant";
export interface ReplayEvent {
    session_id: string;
    epic_id: string;
    timestamp: string;
    event_type: "DECISION" | "VIOLATION" | "OUTCOME" | "COMPACTION";
    decision_type?: string;
    violation_type?: string;
    outcome_type?: string;
    payload: Record<string, unknown>;
    delta_ms: number;
}
export interface ReplayFilter {
    type?: Array<"DECISION" | "VIOLATION" | "OUTCOME" | "COMPACTION">;
    agent?: string;
    since?: Date;
    until?: Date;
}
export declare function fetchEpicEvents(epicId: string, sessionFile: string): Promise<ReplayEvent[]>;
export declare function filterEvents(events: ReplayEvent[], filter: ReplayFilter): ReplayEvent[];
export interface ReplayOptions {
    /** Injectable sleep function for testing. Defaults to Bun.sleep / setTimeout. */
    sleep?: (ms: number) => Promise<void>;
}
export declare function replayWithTiming(events: ReplayEvent[], speed: ReplaySpeed, options?: ReplayOptions): AsyncGenerator<ReplayEvent>;
export declare function formatReplayEvent(event: ReplayEvent): string;
//# sourceMappingURL=replay-tools.d.ts.map