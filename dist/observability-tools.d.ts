/**
 * Observability Tools - Agent-facing Analytics
 *
 * Exposes observability tools to agents via plugin tools.
 * Agents get programmatic access to analytics, not just CLI.
 *
 * Tools:
 * - swarm_analytics: Query pre-built analytics
 * - swarm_query: Raw SQL for power users
 * - swarm_diagnose: Auto-diagnosis for epic/task
 * - swarm_insights: Generate learning insights
 */
export interface SwarmAnalyticsArgs {
    query: "failed-decompositions" | "strategy-success-rates" | "lock-contention" | "agent-activity" | "message-latency" | "scope-violations" | "task-duration" | "checkpoint-frequency" | "recovery-success" | "human-feedback";
    since?: string;
    format?: "json" | "summary";
}
export interface SwarmQueryArgs {
    sql: string;
    format?: "json" | "table";
}
export interface SwarmDiagnoseArgs {
    epic_id?: string;
    bead_id?: string;
    include?: Array<"blockers" | "conflicts" | "slow_tasks" | "errors" | "timeline">;
}
export interface SwarmInsightsArgs {
    scope: "epic" | "project" | "recent";
    epic_id?: string;
    metrics: Array<"success_rate" | "avg_duration" | "conflict_rate" | "retry_rate">;
}
export interface SwarmStatsData {
    overall: {
        totalSwarms: number;
        successRate: number;
        avgDurationMin: number;
    };
    byStrategy: Array<{
        strategy: string;
        total: number;
        successRate: number;
        successes: number;
    }>;
    coordinator: {
        violationRate: number;
        spawnEfficiency: number;
        reviewThoroughness: number;
    };
    recentDays: number;
}
/**
 * Format swarm stats as beautiful CLI output with box drawing
 */
export declare function formatSwarmStats(stats: SwarmStatsData): string;
/**
 * Parse time period string like "7d", "24h", "30m" to timestamp
 */
export declare function parseTimePeriod(period: string): number;
/**
 * Aggregate swarm outcomes by strategy
 */
export declare function aggregateByStrategy(outcomes: Array<{
    strategy: string | null;
    success: boolean;
}>): Array<{
    strategy: string;
    total: number;
    successRate: number;
    successes: number;
}>;
export interface SwarmHistoryRecord {
    epic_id: string;
    epic_title: string;
    strategy: string;
    timestamp: string;
    overall_success: boolean;
    task_count: number;
    completed_count: number;
}
/**
 * Query swarm history from swarm events
 *
 * Constructs epic-level view from decomposition_generated and subtask_outcome events:
 * - decomposition_generated: epic_id, task (title), strategy, subtask_count
 * - subtask_outcome: count successful completed tasks per epic
 */
export declare function querySwarmHistory(projectPath: string, options?: {
    limit?: number;
    status?: "success" | "failed" | "in_progress";
    strategy?: "file-based" | "feature-based" | "risk-based";
}): Promise<SwarmHistoryRecord[]>;
/**
 * Format relative time (e.g., "2h ago", "1d ago")
 */
export declare function formatRelativeTime(timestamp: string): string;
/**
 * Format swarm history as beautiful CLI table
 */
export declare function formatSwarmHistory(records: SwarmHistoryRecord[]): string;
export declare const observabilityTools: {
    swarm_analytics: {
        description: string;
        args: {
            query: import("zod").ZodEnum<{
                "failed-decompositions": "failed-decompositions";
                "strategy-success-rates": "strategy-success-rates";
                "lock-contention": "lock-contention";
                "agent-activity": "agent-activity";
                "message-latency": "message-latency";
                "scope-violations": "scope-violations";
                "task-duration": "task-duration";
                "checkpoint-frequency": "checkpoint-frequency";
                "recovery-success": "recovery-success";
                "human-feedback": "human-feedback";
            }>;
            since: import("zod").ZodOptional<import("zod").ZodString>;
            format: import("zod").ZodOptional<import("zod").ZodEnum<{
                summary: "summary";
                json: "json";
            }>>;
        };
        execute(args: {
            query: "failed-decompositions" | "strategy-success-rates" | "lock-contention" | "agent-activity" | "message-latency" | "scope-violations" | "task-duration" | "checkpoint-frequency" | "recovery-success" | "human-feedback";
            since?: string | undefined;
            format?: "summary" | "json" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_query: {
        description: string;
        args: {
            sql: import("zod").ZodString;
            format: import("zod").ZodOptional<import("zod").ZodEnum<{
                table: "table";
                json: "json";
            }>>;
        };
        execute(args: {
            sql: string;
            format?: "table" | "json" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_diagnose: {
        description: string;
        args: {
            epic_id: import("zod").ZodOptional<import("zod").ZodString>;
            bead_id: import("zod").ZodOptional<import("zod").ZodString>;
            include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<{
                errors: "errors";
                blockers: "blockers";
                conflicts: "conflicts";
                slow_tasks: "slow_tasks";
                timeline: "timeline";
            }>>>;
        };
        execute(args: {
            epic_id?: string | undefined;
            bead_id?: string | undefined;
            include?: ("errors" | "blockers" | "conflicts" | "slow_tasks" | "timeline")[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_insights: {
        description: string;
        args: {
            scope: import("zod").ZodEnum<{
                project: "project";
                epic: "epic";
                recent: "recent";
            }>;
            epic_id: import("zod").ZodOptional<import("zod").ZodString>;
            metrics: import("zod").ZodArray<import("zod").ZodEnum<{
                success_rate: "success_rate";
                avg_duration: "avg_duration";
                conflict_rate: "conflict_rate";
                retry_rate: "retry_rate";
            }>>;
        };
        execute(args: {
            scope: "project" | "epic" | "recent";
            metrics: ("success_rate" | "avg_duration" | "conflict_rate" | "retry_rate")[];
            epic_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=observability-tools.d.ts.map