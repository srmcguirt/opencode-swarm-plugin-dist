/**
 * Memory Module - Semantic Memory Adapter
 *
 * Provides a high-level adapter around swarm-mail's MemoryStore + Ollama.
 * Used by semantic-memory_* tools in the plugin.
 *
 * ## Design
 * - Wraps MemoryStore (vector storage) + Ollama (embeddings)
 * - Handles ID generation, metadata parsing, error handling
 * - Tool-friendly API (string inputs/outputs, no Effect-TS in signatures)
 *
 * ## Usage
 * ```typescript
 * const adapter = await createMemoryAdapter(swarmMail.db);
 *
 * // Store memory
 * const { id } = await adapter.store({
 *   information: "OAuth tokens need 5min buffer",
 *   tags: "auth,tokens",
 * });
 *
 * // Search memories
 * const results = await adapter.find({
 *   query: "token refresh",
 *   limit: 5,
 * });
 * ```
 */
import { type DatabaseAdapter, type Memory } from "swarm-mail";
/**
 * Reset migration check flag (for testing)
 * @internal
 */
export declare function resetMigrationCheck(): void;
/** Arguments for store operation */
export interface StoreArgs {
    readonly information: string;
    readonly collection?: string;
    readonly tags?: string;
    readonly metadata?: string;
    /** Confidence level (0.0-1.0) affecting decay rate. Higher = slower decay. Default 0.7 */
    readonly confidence?: number;
    /** Auto-generate tags using LLM. Default false */
    readonly autoTag?: boolean;
    /** Auto-link to related memories. Default false */
    readonly autoLink?: boolean;
    /** Extract entities (people, places, technologies). Default false */
    readonly extractEntities?: boolean;
}
/** Arguments for find operation */
export interface FindArgs {
    readonly query: string;
    readonly limit?: number;
    readonly collection?: string;
    readonly expand?: boolean;
    readonly fts?: boolean;
}
/** Arguments for get/remove/validate operations */
export interface IdArgs {
    readonly id: string;
}
/** Arguments for list operation */
export interface ListArgs {
    readonly collection?: string;
}
/** Result from store operation */
export interface StoreResult {
    readonly id: string;
    readonly message: string;
}
/** Result from find operation */
export interface FindResult {
    readonly results: Array<{
        readonly id: string;
        readonly content: string;
        readonly score: number;
        readonly collection: string;
        readonly metadata: Record<string, unknown>;
        readonly createdAt: string;
    }>;
    readonly count: number;
}
/** Result from stats operation */
export interface StatsResult {
    readonly memories: number;
    readonly embeddings: number;
}
/** Result from health check */
export interface HealthResult {
    readonly ollama: boolean;
    readonly message?: string;
}
/** Result from validate/remove operations */
export interface OperationResult {
    readonly success: boolean;
    readonly message?: string;
}
/** Arguments for upsert operation */
export interface UpsertArgs {
    readonly information: string;
    readonly collection?: string;
    readonly tags?: string;
    readonly metadata?: string;
    readonly confidence?: number;
    /** Auto-generate tags using LLM. Default true */
    readonly autoTag?: boolean;
    /** Auto-link to related memories. Default true */
    readonly autoLink?: boolean;
    /** Extract entities (people, places, technologies). Default false */
    readonly extractEntities?: boolean;
}
/** Auto-generated tags result */
export interface AutoTags {
    readonly tags: string[];
    readonly keywords: string[];
    readonly category: string;
}
/** Result from upsert operation */
export interface UpsertResult {
    readonly operation: "ADD" | "UPDATE" | "DELETE" | "NOOP";
    readonly reason: string;
    readonly memoryId?: string;
    readonly affectedMemoryIds?: string[];
    readonly autoTags?: AutoTags;
    readonly linksCreated?: number;
    readonly entitiesExtracted?: number;
}
/**
 * Memory Adapter Interface
 *
 * High-level API for semantic memory operations.
 */
export interface MemoryAdapter {
    readonly store: (args: StoreArgs) => Promise<StoreResult>;
    readonly find: (args: FindArgs) => Promise<FindResult>;
    readonly get: (args: IdArgs) => Promise<Memory | null>;
    readonly remove: (args: IdArgs) => Promise<OperationResult>;
    readonly validate: (args: IdArgs) => Promise<OperationResult>;
    readonly list: (args: ListArgs) => Promise<Memory[]>;
    readonly stats: () => Promise<StatsResult>;
    readonly checkHealth: () => Promise<HealthResult>;
    readonly upsert: (args: UpsertArgs) => Promise<UpsertResult>;
}
/**
 * Create Memory Adapter
 *
 * @param db - DatabaseAdapter from swarm-mail's getDatabase()
 * @returns Memory adapter with high-level operations
 *
 * @example
 * ```typescript
 * import { getSwarmMailLibSQL } from 'swarm-mail';
 * import { createMemoryAdapter } from './memory';
 *
 * const swarmMail = await getSwarmMailLibSQL('/path/to/project');
 * const db = await swarmMail.getDatabase();
 * const adapter = await createMemoryAdapter(db);
 *
 * await adapter.store({ information: "Learning X" });
 * const results = await adapter.find({ query: "X" });
 * ```
 */
export declare function createMemoryAdapter(db: DatabaseAdapter): Promise<MemoryAdapter>;
//# sourceMappingURL=memory.d.ts.map