/**
 * GREEN PHASE: SQL Query Tools Implementation
 *
 * Provides:
 * - 13 preset queries for observability insights (10 base + 3 decision trace)
 * - Custom SQL execution with timing
 * - 3 output formats: Table (box-drawing), CSV, JSON
 */
import type { DatabaseAdapter } from "swarm-mail";
export type PresetQueryName = "failed_decompositions" | "duration_by_strategy" | "file_conflicts" | "worker_success_rate" | "review_rejections" | "blocked_tasks" | "agent_activity" | "event_frequency" | "error_patterns" | "compaction_stats" | "decision_quality" | "strategy_success_rates" | "decisions_by_pattern";
export interface QueryResult {
    columns: string[];
    rows: Record<string, unknown>[];
    rowCount: number;
    executionTimeMs: number;
}
export declare const presetQueries: Record<PresetQueryName, string>;
/**
 * Get database path from project path.
 * Uses global database (~/.config/swarm-tools/swarm.db)
 */
export declare function getDbPath(): string;
/**
 * Execute custom SQL against the events table (low-level).
 *
 * @param db - DatabaseAdapter instance
 * @param sql - SQL query string
 * @param params - Optional parameterized query values
 * @returns QueryResult with rows, columns, timing
 */
export declare function executeQuery(db: DatabaseAdapter, sql: string, params?: unknown[]): Promise<QueryResult>;
/**
 * Execute a preset query by name (low-level, requires DatabaseAdapter).
 *
 * @param db - DatabaseAdapter instance
 * @param presetName - Name of the preset query
 * @returns QueryResult with rows, columns, timing
 */
export declare function executePresetQuery(db: DatabaseAdapter, presetName: string): Promise<QueryResult>;
/**
 * Execute custom SQL query (CLI wrapper).
 * Creates database adapter automatically.
 *
 * @param projectPath - Project path (unused, queries global database)
 * @param sql - SQL query string
 * @returns QueryResult for CLI formatting
 */
export declare function executeQueryCLI(projectPath: string, sql: string): Promise<QueryResult>;
/**
 * Execute a preset query by name (CLI wrapper).
 * Creates database adapter automatically.
 *
 * @param projectPath - Project path (unused, queries global database)
 * @param presetName - Name of the preset query
 * @returns QueryResult for CLI formatting
 */
export declare function executePreset(projectPath: string, presetName: string): Promise<QueryResult>;
/**
 * Format query result as aligned table with box-drawing characters.
 *
 * Example output:
 * ┌──────────┬───────┐
 * │ name     │ count │
 * ├──────────┼───────┤
 * │ AgentA   │     5 │
 * │ AgentB   │     3 │
 * └──────────┴───────┘
 * 2 rows (12.5ms)
 */
export declare function formatAsTable(result: QueryResult): string;
/**
 * Format query result as CSV with proper escaping.
 *
 * Escapes:
 * - Commas → wrap in quotes
 * - Quotes → double them
 * - Newlines → wrap in quotes
 */
export declare function formatAsCSV(result: QueryResult): string;
/**
 * Format query result as pretty-printed JSON array.
 *
 * Example:
 * [
 *   { "name": "AgentA", "count": 5 },
 *   { "name": "AgentB", "count": 3 }
 * ]
 */
export declare function formatAsJSON(result: QueryResult): string;
//# sourceMappingURL=query-tools.d.ts.map