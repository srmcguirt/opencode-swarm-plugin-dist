/**
 * Semantic Memory Plugin Tools - Embedded implementation
 *
 * Provides semantic memory operations using swarm-mail's MemoryStore + Ollama.
 * Replaces external MCP-based semantic-memory calls with embedded storage.
 *
 * Key features:
 * - Vector similarity search with Ollama embeddings
 * - Full-text search fallback
 * - Memory decay tracking (TODO: implement in MemoryStore)
 * - Collection-based organization
 *
 * Tool signatures maintained for backward compatibility with existing prompts.
 */
import { createMemoryAdapter, type MemoryAdapter } from "./memory";
export type { MemoryAdapter, StoreArgs, FindArgs, IdArgs, ListArgs, StoreResult, FindResult, StatsResult, HealthResult, OperationResult, UpsertArgs, UpsertResult, AutoTags, } from "./memory";
/**
 * Get or create memory adapter for the current project
 *
 * @param projectPath - Project path (uses CWD if not provided)
 * @returns Memory adapter instance
 */
export declare function getMemoryAdapter(projectPath?: string): Promise<MemoryAdapter>;
/**
 * Reset adapter cache (for testing)
 */
export declare function resetMemoryCache(): void;
export { createMemoryAdapter };
/**
 * Store a memory with semantic embedding
 */
export declare const semantic_memory_store: {
    description: string;
    args: {
        information: import("zod").ZodString;
        collection: import("zod").ZodOptional<import("zod").ZodString>;
        tags: import("zod").ZodOptional<import("zod").ZodString>;
        metadata: import("zod").ZodOptional<import("zod").ZodString>;
        confidence: import("zod").ZodOptional<import("zod").ZodNumber>;
        autoTag: import("zod").ZodOptional<import("zod").ZodBoolean>;
        autoLink: import("zod").ZodOptional<import("zod").ZodBoolean>;
        extractEntities: import("zod").ZodOptional<import("zod").ZodBoolean>;
    };
    execute(args: {
        information: string;
        collection?: string | undefined;
        tags?: string | undefined;
        metadata?: string | undefined;
        confidence?: number | undefined;
        autoTag?: boolean | undefined;
        autoLink?: boolean | undefined;
        extractEntities?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Find memories by semantic similarity or full-text search
 */
export declare const semantic_memory_find: {
    description: string;
    args: {
        query: import("zod").ZodString;
        limit: import("zod").ZodOptional<import("zod").ZodNumber>;
        collection: import("zod").ZodOptional<import("zod").ZodString>;
        expand: import("zod").ZodOptional<import("zod").ZodBoolean>;
        fts: import("zod").ZodOptional<import("zod").ZodBoolean>;
    };
    execute(args: {
        query: string;
        limit?: number | undefined;
        collection?: string | undefined;
        expand?: boolean | undefined;
        fts?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get a single memory by ID
 */
export declare const semantic_memory_get: {
    description: string;
    args: {
        id: import("zod").ZodString;
    };
    execute(args: {
        id: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Remove a memory
 */
export declare const semantic_memory_remove: {
    description: string;
    args: {
        id: import("zod").ZodString;
    };
    execute(args: {
        id: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Validate a memory (reset decay timer)
 */
export declare const semantic_memory_validate: {
    description: string;
    args: {
        id: import("zod").ZodString;
    };
    execute(args: {
        id: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * List memories
 */
export declare const semantic_memory_list: {
    description: string;
    args: {
        collection: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        collection?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get memory statistics
 */
export declare const semantic_memory_stats: {
    description: string;
    args: {};
    execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Check Ollama health
 */
export declare const semantic_memory_check: {
    description: string;
    args: {};
    execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Smart upsert - ADD, UPDATE, DELETE, or NOOP based on existing memories
 */
export declare const semantic_memory_upsert: {
    description: string;
    args: {
        information: import("zod").ZodString;
        collection: import("zod").ZodOptional<import("zod").ZodString>;
        tags: import("zod").ZodOptional<import("zod").ZodString>;
        metadata: import("zod").ZodOptional<import("zod").ZodString>;
        confidence: import("zod").ZodOptional<import("zod").ZodNumber>;
        autoTag: import("zod").ZodOptional<import("zod").ZodBoolean>;
        autoLink: import("zod").ZodOptional<import("zod").ZodBoolean>;
        extractEntities: import("zod").ZodOptional<import("zod").ZodBoolean>;
    };
    execute(args: {
        information: string;
        collection?: string | undefined;
        tags?: string | undefined;
        metadata?: string | undefined;
        confidence?: number | undefined;
        autoTag?: boolean | undefined;
        autoLink?: boolean | undefined;
        extractEntities?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * All semantic memory tools
 *
 * Register these in the plugin with spread operator: { ...memoryTools }
 */
export declare const memoryTools: {
    readonly "semantic-memory_store": {
        description: string;
        args: {
            information: import("zod").ZodString;
            collection: import("zod").ZodOptional<import("zod").ZodString>;
            tags: import("zod").ZodOptional<import("zod").ZodString>;
            metadata: import("zod").ZodOptional<import("zod").ZodString>;
            confidence: import("zod").ZodOptional<import("zod").ZodNumber>;
            autoTag: import("zod").ZodOptional<import("zod").ZodBoolean>;
            autoLink: import("zod").ZodOptional<import("zod").ZodBoolean>;
            extractEntities: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            information: string;
            collection?: string | undefined;
            tags?: string | undefined;
            metadata?: string | undefined;
            confidence?: number | undefined;
            autoTag?: boolean | undefined;
            autoLink?: boolean | undefined;
            extractEntities?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly "semantic-memory_find": {
        description: string;
        args: {
            query: import("zod").ZodString;
            limit: import("zod").ZodOptional<import("zod").ZodNumber>;
            collection: import("zod").ZodOptional<import("zod").ZodString>;
            expand: import("zod").ZodOptional<import("zod").ZodBoolean>;
            fts: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            query: string;
            limit?: number | undefined;
            collection?: string | undefined;
            expand?: boolean | undefined;
            fts?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly "semantic-memory_get": {
        description: string;
        args: {
            id: import("zod").ZodString;
        };
        execute(args: {
            id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly "semantic-memory_remove": {
        description: string;
        args: {
            id: import("zod").ZodString;
        };
        execute(args: {
            id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly "semantic-memory_validate": {
        description: string;
        args: {
            id: import("zod").ZodString;
        };
        execute(args: {
            id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly "semantic-memory_list": {
        description: string;
        args: {
            collection: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            collection?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly "semantic-memory_stats": {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly "semantic-memory_check": {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly "semantic-memory_upsert": {
        description: string;
        args: {
            information: import("zod").ZodString;
            collection: import("zod").ZodOptional<import("zod").ZodString>;
            tags: import("zod").ZodOptional<import("zod").ZodString>;
            metadata: import("zod").ZodOptional<import("zod").ZodString>;
            confidence: import("zod").ZodOptional<import("zod").ZodNumber>;
            autoTag: import("zod").ZodOptional<import("zod").ZodBoolean>;
            autoLink: import("zod").ZodOptional<import("zod").ZodBoolean>;
            extractEntities: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            information: string;
            collection?: string | undefined;
            tags?: string | undefined;
            metadata?: string | undefined;
            confidence?: number | undefined;
            autoTag?: boolean | undefined;
            autoLink?: boolean | undefined;
            extractEntities?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=memory-tools.d.ts.map