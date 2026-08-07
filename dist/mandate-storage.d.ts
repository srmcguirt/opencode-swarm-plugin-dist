/**
 * Mandate Storage Module - Persistent storage for agent voting system
 *
 * Provides unified storage interface for mandate entries and votes:
 * - semantic-memory (default) - Persistent with semantic search
 * - in-memory - For testing and ephemeral sessions
 *
 * Collections:
 * - `swarm-mandates` - Mandate entry storage
 * - `swarm-votes` - Vote storage
 *
 * Score calculation uses 90-day half-life decay matching learning.ts patterns.
 *
 * @example
 * ```typescript
 * // Use default semantic-memory storage
 * const storage = createMandateStorage();
 *
 * // Or in-memory for testing
 * const storage = createMandateStorage({ backend: "memory" });
 *
 * // Store a mandate
 * await storage.store({
 *   id: "mandate-123",
 *   content: "Always use Effect for async operations",
 *   content_type: "tip",
 *   author_agent: "BlueLake",
 *   created_at: new Date().toISOString(),
 *   status: "candidate",
 *   tags: ["async", "effect"]
 * });
 *
 * // Cast a vote
 * await storage.vote({
 *   id: "vote-456",
 *   mandate_id: "mandate-123",
 *   agent_name: "BlueLake",
 *   vote_type: "upvote",
 *   timestamp: new Date().toISOString(),
 *   weight: 1.0
 * });
 *
 * // Calculate score with decay
 * const score = await storage.calculateScore("mandate-123");
 * ```
 */
import type { MandateEntry, Vote, MandateScore, MandateStatus, MandateContentType, MandateDecayConfig, ScoreCalculationResult } from "./schemas/mandate";
/**
 * Reset the cached command (for testing)
 */
export declare function resetCommandCache(): void;
/**
 * Storage backend type
 */
export type MandateStorageBackend = "semantic-memory" | "memory";
/**
 * Collection names for semantic-memory
 */
export interface MandateStorageCollections {
    mandates: string;
    votes: string;
}
/**
 * Storage configuration
 */
export interface MandateStorageConfig {
    /** Backend to use (default: "semantic-memory") */
    backend: MandateStorageBackend;
    /** Collection names for semantic-memory backend */
    collections: MandateStorageCollections;
    /** Decay configuration */
    decay: MandateDecayConfig;
    /** Whether to use semantic search for queries (default: true) */
    useSemanticSearch: boolean;
}
export declare const DEFAULT_MANDATE_STORAGE_CONFIG: MandateStorageConfig;
/**
 * Unified storage interface for mandate data
 */
export interface MandateStorage {
    store(entry: MandateEntry): Promise<void>;
    get(id: string): Promise<MandateEntry | null>;
    find(query: string, limit?: number): Promise<MandateEntry[]>;
    list(filter?: {
        status?: MandateStatus;
        content_type?: MandateContentType;
    }): Promise<MandateEntry[]>;
    update(id: string, updates: Partial<MandateEntry>): Promise<void>;
    vote(vote: Vote): Promise<void>;
    getVotes(mandateId: string): Promise<Vote[]>;
    hasVoted(mandateId: string, agentName: string): Promise<boolean>;
    calculateScore(mandateId: string): Promise<MandateScore>;
    close(): Promise<void>;
}
/**
 * Semantic-memory backed mandate storage
 *
 * Uses the semantic-memory CLI for persistence with semantic search.
 * Data survives across sessions and can be searched by meaning.
 */
export declare class SemanticMemoryMandateStorage implements MandateStorage {
    private config;
    constructor(config?: Partial<MandateStorageConfig>);
    private storeInternal;
    private findInternal;
    private listInternal;
    store(entry: MandateEntry): Promise<void>;
    get(id: string): Promise<MandateEntry | null>;
    find(query: string, limit?: number): Promise<MandateEntry[]>;
    list(filter?: {
        status?: MandateStatus;
        content_type?: MandateContentType;
    }): Promise<MandateEntry[]>;
    update(id: string, updates: Partial<MandateEntry>): Promise<void>;
    vote(vote: Vote): Promise<void>;
    getVotes(mandateId: string): Promise<Vote[]>;
    hasVoted(mandateId: string, agentName: string): Promise<boolean>;
    calculateScore(mandateId: string): Promise<MandateScore>;
    close(): Promise<void>;
}
/**
 * In-memory mandate storage
 *
 * Useful for testing and ephemeral sessions.
 */
export declare class InMemoryMandateStorage implements MandateStorage {
    private entries;
    private votes;
    private config;
    constructor(config?: Partial<MandateStorageConfig>);
    store(entry: MandateEntry): Promise<void>;
    get(id: string): Promise<MandateEntry | null>;
    find(query: string, limit?: number): Promise<MandateEntry[]>;
    list(filter?: {
        status?: MandateStatus;
        content_type?: MandateContentType;
    }): Promise<MandateEntry[]>;
    update(id: string, updates: Partial<MandateEntry>): Promise<void>;
    vote(vote: Vote): Promise<void>;
    getVotes(mandateId: string): Promise<Vote[]>;
    hasVoted(mandateId: string, agentName: string): Promise<boolean>;
    calculateScore(mandateId: string): Promise<MandateScore>;
    close(): Promise<void>;
}
/**
 * Create a mandate storage instance
 *
 * @param config - Storage configuration (default: semantic-memory)
 * @returns Configured storage instance
 *
 * @example
 * ```typescript
 * // Default semantic-memory storage
 * const storage = createMandateStorage();
 *
 * // In-memory for testing
 * const storage = createMandateStorage({ backend: "memory" });
 *
 * // Custom collections
 * const storage = createMandateStorage({
 *   backend: "semantic-memory",
 *   collections: {
 *     mandates: "my-mandates",
 *     votes: "my-votes",
 *   },
 * });
 * ```
 */
export declare function createMandateStorage(config?: Partial<MandateStorageConfig>): MandateStorage;
/**
 * Update mandate status based on calculated score
 *
 * Applies thresholds from decay config to determine status transitions:
 * - mandate: net_votes >= 5 AND vote_ratio >= 0.7
 * - established: net_votes >= 2
 * - rejected: net_votes <= -3
 * - candidate: otherwise
 *
 * @param mandateId - Mandate ID
 * @param storage - Storage instance
 * @returns Score calculation result with status update
 */
export declare function updateMandateStatus(mandateId: string, storage: MandateStorage): Promise<ScoreCalculationResult>;
/**
 * Batch update all mandate statuses
 *
 * Useful for periodic recalculation of scores/status across all mandates.
 *
 * @param storage - Storage instance
 * @returns Array of score calculation results
 */
export declare function updateAllMandateStatuses(storage: MandateStorage): Promise<ScoreCalculationResult[]>;
/**
 * Get or create the global mandate storage instance
 *
 * Uses semantic-memory by default.
 */
export declare function getMandateStorage(): MandateStorage;
/**
 * Set the global mandate storage instance
 *
 * Useful for testing or custom configurations.
 */
export declare function setMandateStorage(storage: MandateStorage): void;
/**
 * Reset the global mandate storage instance
 */
export declare function resetMandateStorage(): Promise<void>;
//# sourceMappingURL=mandate-storage.d.ts.map