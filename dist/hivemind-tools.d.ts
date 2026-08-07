/**
 * Hivemind Tools - Unified Memory System
 *
 * Unifies semantic-memory and CASS tools under the hivemind namespace.
 * Sessions and learnings are both memories with different sources.
 *
 * Key design decisions (ADR-011):
 * - 8 tools instead of 15 (merged duplicates)
 * - Collection filter: "default" for learnings, "claude" for Claude sessions, etc.
 * - Unified search across learnings + sessions
 * - No more naming collision with external semantic-memory MCP
 *
 * Tool mapping:
 * - semantic-memory_store → hivemind_store
 * - semantic-memory_find + cass_search → hivemind_find
 * - semantic-memory_get + cass_view → hivemind_get
 * - semantic-memory_remove → hivemind_remove
 * - semantic-memory_validate → hivemind_validate
 * - semantic-memory_stats + cass_stats + cass_health → hivemind_stats
 * - cass_index → hivemind_index
 * - NEW: hivemind_sync (sync to .hive/memories.jsonl)
 */
import { type MemoryAdapter, type StoreArgs, type FindArgs, type IdArgs, type StoreResult, type FindResult, type StatsResult, type OperationResult } from "./memory";
export type { MemoryAdapter, StoreArgs, FindArgs, IdArgs, StoreResult, FindResult, StatsResult, OperationResult, };
/**
 * Get or create memory adapter for the current project
 */
declare function getMemoryAdapter(projectPath?: string): Promise<MemoryAdapter>;
/**
 * Get or create hivemind adapter (alias for getMemoryAdapter)
 */
export declare const getHivemindAdapter: typeof getMemoryAdapter;
/**
 * Reset adapter cache (for testing)
 */
export declare function resetHivemindCache(): void;
/**
 * hivemind_store - Store a memory with semantic embedding
 */
export declare const hivemind_store: {
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
        project_key: import("zod").ZodOptional<import("zod").ZodString>;
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
        project_key?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * hivemind_find - Search all memories (learnings + sessions)
 */
export declare const hivemind_find: {
    description: string;
    args: {
        query: import("zod").ZodString;
        limit: import("zod").ZodOptional<import("zod").ZodNumber>;
        collection: import("zod").ZodOptional<import("zod").ZodString>;
        expand: import("zod").ZodOptional<import("zod").ZodBoolean>;
        fts: import("zod").ZodOptional<import("zod").ZodBoolean>;
        project_key: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        query: string;
        limit?: number | undefined;
        collection?: string | undefined;
        expand?: boolean | undefined;
        fts?: boolean | undefined;
        project_key?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * hivemind_get - Get a specific memory by ID
 */
export declare const hivemind_get: {
    description: string;
    args: {
        id: import("zod").ZodString;
        project_key: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        id: string;
        project_key?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * hivemind_remove - Delete a memory
 */
export declare const hivemind_remove: {
    description: string;
    args: {
        id: import("zod").ZodString;
        project_key: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        id: string;
        project_key?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * hivemind_validate - Validate a memory (reset decay timer)
 */
export declare const hivemind_validate: {
    description: string;
    args: {
        id: import("zod").ZodString;
        project_key: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        id: string;
        project_key?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * hivemind_stats - Combined statistics and health check
 */
export declare const hivemind_stats: {
    description: string;
    args: {
        project_key: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        project_key?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * hivemind_index - Index AI session directories
 */
export declare const hivemind_index: {
    description: string;
    args: {
        full: import("zod").ZodOptional<import("zod").ZodBoolean>;
        project_key: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        full?: boolean | undefined;
        project_key?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * hivemind_sync - Sync memories to .hive/memories.jsonl
 */
export declare const hivemind_sync: {
    description: string;
    args: {
        project_key: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        project_key?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
declare const semantic_memory_store: any;
declare const semantic_memory_find: any;
declare const semantic_memory_get: any;
declare const semantic_memory_remove: any;
declare const semantic_memory_validate: any;
declare const semantic_memory_list: any;
declare const semantic_memory_stats: any;
declare const semantic_memory_check: any;
declare const semantic_memory_upsert: any;
declare const cass_search: any;
declare const cass_view: any;
declare const cass_expand: any;
declare const cass_health: any;
declare const cass_index: any;
declare const cass_stats: any;
/**
 * All hivemind tools + deprecation aliases
 *
 * Register these in the plugin with spread operator: { ...hivemindTools }
 */
export declare const hivemindTools: {
    readonly hivemind_store: {
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
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
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
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_find: {
        description: string;
        args: {
            query: import("zod").ZodString;
            limit: import("zod").ZodOptional<import("zod").ZodNumber>;
            collection: import("zod").ZodOptional<import("zod").ZodString>;
            expand: import("zod").ZodOptional<import("zod").ZodBoolean>;
            fts: import("zod").ZodOptional<import("zod").ZodBoolean>;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            query: string;
            limit?: number | undefined;
            collection?: string | undefined;
            expand?: boolean | undefined;
            fts?: boolean | undefined;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_get: {
        description: string;
        args: {
            id: import("zod").ZodString;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            id: string;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_remove: {
        description: string;
        args: {
            id: import("zod").ZodString;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            id: string;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_validate: {
        description: string;
        args: {
            id: import("zod").ZodString;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            id: string;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_stats: {
        description: string;
        args: {
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_index: {
        description: string;
        args: {
            full: import("zod").ZodOptional<import("zod").ZodBoolean>;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            full?: boolean | undefined;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_sync: {
        description: string;
        args: {
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly "semantic-memory_store": any;
    readonly "semantic-memory_find": any;
    readonly "semantic-memory_get": any;
    readonly "semantic-memory_remove": any;
    readonly "semantic-memory_validate": any;
    readonly "semantic-memory_list": any;
    readonly "semantic-memory_stats": any;
    readonly "semantic-memory_check": any;
    readonly "semantic-memory_upsert": any;
    readonly cass_search: any;
    readonly cass_view: any;
    readonly cass_expand: any;
    readonly cass_health: any;
    readonly cass_index: any;
    readonly cass_stats: any;
};
export { semantic_memory_store, semantic_memory_find, semantic_memory_get, semantic_memory_remove, semantic_memory_validate, semantic_memory_list, semantic_memory_stats, semantic_memory_check, semantic_memory_upsert, cass_search, cass_view, cass_expand, cass_health, cass_index, cass_stats, };
export { createMemoryAdapter } from "./memory";
export declare const memoryTools: {
    readonly hivemind_store: {
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
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
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
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_find: {
        description: string;
        args: {
            query: import("zod").ZodString;
            limit: import("zod").ZodOptional<import("zod").ZodNumber>;
            collection: import("zod").ZodOptional<import("zod").ZodString>;
            expand: import("zod").ZodOptional<import("zod").ZodBoolean>;
            fts: import("zod").ZodOptional<import("zod").ZodBoolean>;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            query: string;
            limit?: number | undefined;
            collection?: string | undefined;
            expand?: boolean | undefined;
            fts?: boolean | undefined;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_get: {
        description: string;
        args: {
            id: import("zod").ZodString;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            id: string;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_remove: {
        description: string;
        args: {
            id: import("zod").ZodString;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            id: string;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_validate: {
        description: string;
        args: {
            id: import("zod").ZodString;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            id: string;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_stats: {
        description: string;
        args: {
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_index: {
        description: string;
        args: {
            full: import("zod").ZodOptional<import("zod").ZodBoolean>;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            full?: boolean | undefined;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_sync: {
        description: string;
        args: {
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly "semantic-memory_store": any;
    readonly "semantic-memory_find": any;
    readonly "semantic-memory_get": any;
    readonly "semantic-memory_remove": any;
    readonly "semantic-memory_validate": any;
    readonly "semantic-memory_list": any;
    readonly "semantic-memory_stats": any;
    readonly "semantic-memory_check": any;
    readonly "semantic-memory_upsert": any;
    readonly cass_search: any;
    readonly cass_view: any;
    readonly cass_expand: any;
    readonly cass_health: any;
    readonly cass_index: any;
    readonly cass_stats: any;
};
export declare const cassTools: {
    readonly hivemind_store: {
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
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
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
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_find: {
        description: string;
        args: {
            query: import("zod").ZodString;
            limit: import("zod").ZodOptional<import("zod").ZodNumber>;
            collection: import("zod").ZodOptional<import("zod").ZodString>;
            expand: import("zod").ZodOptional<import("zod").ZodBoolean>;
            fts: import("zod").ZodOptional<import("zod").ZodBoolean>;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            query: string;
            limit?: number | undefined;
            collection?: string | undefined;
            expand?: boolean | undefined;
            fts?: boolean | undefined;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_get: {
        description: string;
        args: {
            id: import("zod").ZodString;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            id: string;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_remove: {
        description: string;
        args: {
            id: import("zod").ZodString;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            id: string;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_validate: {
        description: string;
        args: {
            id: import("zod").ZodString;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            id: string;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_stats: {
        description: string;
        args: {
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_index: {
        description: string;
        args: {
            full: import("zod").ZodOptional<import("zod").ZodBoolean>;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            full?: boolean | undefined;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hivemind_sync: {
        description: string;
        args: {
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly "semantic-memory_store": any;
    readonly "semantic-memory_find": any;
    readonly "semantic-memory_get": any;
    readonly "semantic-memory_remove": any;
    readonly "semantic-memory_validate": any;
    readonly "semantic-memory_list": any;
    readonly "semantic-memory_stats": any;
    readonly "semantic-memory_check": any;
    readonly "semantic-memory_upsert": any;
    readonly cass_search: any;
    readonly cass_view: any;
    readonly cass_expand: any;
    readonly cass_health: any;
    readonly cass_index: any;
    readonly cass_stats: any;
};
export declare const resetMemoryCache: typeof resetHivemindCache;
//# sourceMappingURL=hivemind-tools.d.ts.map