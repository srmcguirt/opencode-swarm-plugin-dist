/**
 * CASS Tools - Cross-Agent Session Search
 *
 * Provides tools for searching across AI coding agent histories.
 * Uses inhouse SessionIndexer from swarm-mail package.
 *
 * Events emitted:
 * - cass_searched: When a search is performed
 * - cass_viewed: When a session is viewed
 * - cass_indexed: When the index is built/rebuilt
 */
export declare const cassTools: {
    cass_search: {
        description: string;
        args: {
            query: import("zod").ZodString;
            agent: import("zod").ZodOptional<import("zod").ZodString>;
            days: import("zod").ZodOptional<import("zod").ZodNumber>;
            limit: import("zod").ZodOptional<import("zod").ZodNumber>;
            fields: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            query: string;
            agent?: string | undefined;
            days?: number | undefined;
            limit?: number | undefined;
            fields?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    cass_view: {
        description: string;
        args: {
            path: import("zod").ZodString;
            line: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            path: string;
            line?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    cass_expand: {
        description: string;
        args: {
            path: import("zod").ZodString;
            line: import("zod").ZodNumber;
            context: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            path: string;
            line: number;
            context?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    cass_health: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    cass_index: {
        description: string;
        args: {
            full: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            full?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    cass_stats: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=cass-tools.d.ts.map