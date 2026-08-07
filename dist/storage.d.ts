/**
 * Storage Module - Pluggable persistence for learning data
 *
 * Provides a unified storage interface with multiple backends:
 * - semantic-memory (default) - Persistent with semantic search
 * - in-memory - For testing and ephemeral sessions
 *
 * The semantic-memory backend uses collections:
 * - `swarm-feedback` - Criterion feedback events
 * - `swarm-patterns` - Decomposition patterns and anti-patterns
 * - `swarm-maturity` - Pattern maturity tracking
 *
 * @example
 * ```typescript
 * // Use default semantic-memory storage
 * const storage = createStorage();
 *
 * // Or configure explicitly
 * const storage = createStorage({
 *   backend: "semantic-memory",
 *   collections: {
 *     feedback: "my-feedback",
 *     patterns: "my-patterns",
 *     maturity: "my-maturity",
 *   },
 * });
 *
 * // Or use in-memory for testing
 * const storage = createStorage({ backend: "memory" });
 * ```
 */
import type { FeedbackEvent } from "./learning";
import type { DecompositionPattern } from "./anti-patterns";
import type { PatternMaturity, MaturityFeedback } from "./pattern-maturity";
/**
 * Reset the cached command (for testing)
 */
export declare function resetCommandCache(): void;
/**
 * Storage backend type
 */
export type StorageBackend = "semantic-memory" | "memory";
/**
 * Collection names for semantic-memory
 */
export interface StorageCollections {
    feedback: string;
    patterns: string;
    maturity: string;
}
/**
 * Storage configuration
 */
export interface StorageConfig {
    /** Backend to use (default: "semantic-memory") */
    backend: StorageBackend;
    /** Collection names for semantic-memory backend */
    collections: StorageCollections;
    /** Whether to use semantic search for queries (default: true) */
    useSemanticSearch: boolean;
}
/**
 * Generate unique test collection name
 *
 * Creates a timestamp-based suffix for test collections to ensure complete isolation.
 * Each test run gets its own collections that don't pollute production semantic-memory.
 *
 * @returns Unique suffix like "test-1734567890123"
 *
 * @example
 * ```typescript
 * // In test setup:
 * process.env.TEST_SEMANTIC_MEMORY_COLLECTION = getTestCollectionName();
 * // Results in collections like: swarm-feedback-test-1734567890123
 * ```
 */
export declare function getTestCollectionName(): string;
/**
 * Get default storage configuration
 *
 * Returns a fresh config object on each call to ensure env vars (like
 * TEST_SEMANTIC_MEMORY_COLLECTION) are read at runtime, not module load time.
 *
 * @returns Default storage configuration
 */
export declare function getDefaultStorageConfig(): StorageConfig;
/**
 * @deprecated Use getDefaultStorageConfig() instead. This static export
 * captures collections at module load time, breaking test isolation.
 */
export declare const DEFAULT_STORAGE_CONFIG: StorageConfig;
/**
 * Unified storage interface for all learning data
 */
export interface LearningStorage {
    storeFeedback(event: FeedbackEvent): Promise<void>;
    getFeedbackByCriterion(criterion: string): Promise<FeedbackEvent[]>;
    getFeedbackByBead(beadId: string): Promise<FeedbackEvent[]>;
    getAllFeedback(): Promise<FeedbackEvent[]>;
    findSimilarFeedback(query: string, limit?: number): Promise<FeedbackEvent[]>;
    storePattern(pattern: DecompositionPattern): Promise<void>;
    getPattern(id: string): Promise<DecompositionPattern | null>;
    getAllPatterns(): Promise<DecompositionPattern[]>;
    getAntiPatterns(): Promise<DecompositionPattern[]>;
    getPatternsByTag(tag: string): Promise<DecompositionPattern[]>;
    findSimilarPatterns(query: string, limit?: number): Promise<DecompositionPattern[]>;
    storeMaturity(maturity: PatternMaturity): Promise<void>;
    getMaturity(patternId: string): Promise<PatternMaturity | null>;
    getAllMaturity(): Promise<PatternMaturity[]>;
    getMaturityByState(state: string): Promise<PatternMaturity[]>;
    storeMaturityFeedback(feedback: MaturityFeedback): Promise<void>;
    getMaturityFeedback(patternId: string): Promise<MaturityFeedback[]>;
    close(): Promise<void>;
}
interface SessionStats {
    storesCount: number;
    queriesCount: number;
    sessionStart: number;
    lastAlertCheck: number;
}
/**
 * Reset session stats (for testing)
 */
export declare function resetSessionStats(): void;
/**
 * Get current session stats
 */
export declare function getSessionStats(): Readonly<SessionStats>;
/**
 * Semantic-memory backed storage
 *
 * Uses the semantic-memory CLI for persistence with semantic search.
 * Data survives across sessions and can be searched by meaning.
 */
export declare class SemanticMemoryStorage implements LearningStorage {
    private config;
    constructor(config?: Partial<StorageConfig>);
    /**
     * Check if low usage alert should be sent
     *
     * Sends alert via agentmail if:
     * - More than 10 minutes have elapsed since session start
     * - Less than 1 store operation has occurred
     * - Alert hasn't been sent in the last 10 minutes
     */
    private checkLowUsageAlert;
    private store;
    private find;
    private list;
    storeFeedback(event: FeedbackEvent): Promise<void>;
    getFeedbackByCriterion(criterion: string): Promise<FeedbackEvent[]>;
    getFeedbackByBead(beadId: string): Promise<FeedbackEvent[]>;
    getAllFeedback(): Promise<FeedbackEvent[]>;
    findSimilarFeedback(query: string, limit?: number): Promise<FeedbackEvent[]>;
    storePattern(pattern: DecompositionPattern): Promise<void>;
    getPattern(id: string): Promise<DecompositionPattern | null>;
    getAllPatterns(): Promise<DecompositionPattern[]>;
    getAntiPatterns(): Promise<DecompositionPattern[]>;
    getPatternsByTag(tag: string): Promise<DecompositionPattern[]>;
    findSimilarPatterns(query: string, limit?: number): Promise<DecompositionPattern[]>;
    storeMaturity(maturity: PatternMaturity): Promise<void>;
    getMaturity(patternId: string): Promise<PatternMaturity | null>;
    getAllMaturity(): Promise<PatternMaturity[]>;
    getMaturityByState(state: string): Promise<PatternMaturity[]>;
    storeMaturityFeedback(feedback: MaturityFeedback): Promise<void>;
    getMaturityFeedback(patternId: string): Promise<MaturityFeedback[]>;
    close(): Promise<void>;
}
/**
 * In-memory storage adapter
 *
 * Wraps the existing in-memory implementations into the unified interface.
 * Useful for testing and ephemeral sessions.
 */
export declare class InMemoryStorage implements LearningStorage {
    private feedback;
    private patterns;
    private maturity;
    constructor();
    storeFeedback(event: FeedbackEvent): Promise<void>;
    getFeedbackByCriterion(criterion: string): Promise<FeedbackEvent[]>;
    getFeedbackByBead(beadId: string): Promise<FeedbackEvent[]>;
    getAllFeedback(): Promise<FeedbackEvent[]>;
    findSimilarFeedback(query: string, limit?: number): Promise<FeedbackEvent[]>;
    storePattern(pattern: DecompositionPattern): Promise<void>;
    getPattern(id: string): Promise<DecompositionPattern | null>;
    getAllPatterns(): Promise<DecompositionPattern[]>;
    getAntiPatterns(): Promise<DecompositionPattern[]>;
    getPatternsByTag(tag: string): Promise<DecompositionPattern[]>;
    findSimilarPatterns(query: string, limit?: number): Promise<DecompositionPattern[]>;
    storeMaturity(maturity: PatternMaturity): Promise<void>;
    getMaturity(patternId: string): Promise<PatternMaturity | null>;
    getAllMaturity(): Promise<PatternMaturity[]>;
    getMaturityByState(state: string): Promise<PatternMaturity[]>;
    storeMaturityFeedback(feedback: MaturityFeedback): Promise<void>;
    getMaturityFeedback(patternId: string): Promise<MaturityFeedback[]>;
    close(): Promise<void>;
}
/**
 * Create a storage instance
 *
 * @param config - Storage configuration (default: semantic-memory)
 * @returns Configured storage instance
 *
 * @example
 * ```typescript
 * // Default semantic-memory storage
 * const storage = createStorage();
 *
 * // In-memory for testing
 * const storage = createStorage({ backend: "memory" });
 *
 * // Custom collections
 * const storage = createStorage({
 *   backend: "semantic-memory",
 *   collections: {
 *     feedback: "my-project-feedback",
 *     patterns: "my-project-patterns",
 *     maturity: "my-project-maturity",
 *   },
 * });
 * ```
 */
export declare function createStorage(config?: Partial<StorageConfig>): LearningStorage;
/**
 * Check if semantic-memory is available (native or via bunx)
 *
 * Result is cached for the lifetime of the process since CLI availability
 * doesn't change at runtime. Use resetAvailabilityCache() in tests.
 */
export declare function isSemanticMemoryAvailable(): Promise<boolean>;
/**
 * Reset the availability cache (for testing)
 */
export declare function resetAvailabilityCache(): void;
/**
 * Get the resolved semantic-memory command (for debugging/logging)
 */
export declare function getResolvedCommand(): Promise<string[]>;
/**
 * Create storage with automatic fallback
 *
 * Uses semantic-memory if available, otherwise falls back to in-memory.
 *
 * @param config - Storage configuration
 * @returns Storage instance
 */
export declare function createStorageWithFallback(config?: Partial<StorageConfig>): Promise<LearningStorage>;
/**
 * Get or create the global storage instance
 *
 * Uses semantic-memory by default, with automatic fallback to in-memory.
 * Prevents race conditions by storing the initialization promise.
 */
export declare function getStorage(): Promise<LearningStorage>;
/**
 * Set the global storage instance
 *
 * Useful for testing or custom configurations.
 */
export declare function setStorage(storage: LearningStorage): void;
/**
 * Reset the global storage instance
 */
export declare function resetStorage(): Promise<void>;
export {};
//# sourceMappingURL=storage.d.ts.map