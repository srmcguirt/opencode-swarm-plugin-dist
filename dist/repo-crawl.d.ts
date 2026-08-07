import { z } from "zod";
export declare class RepoCrawlError extends Error {
    readonly statusCode?: number | undefined;
    readonly endpoint?: string | undefined;
    constructor(message: string, statusCode?: number | undefined, endpoint?: string | undefined);
}
/**
 * Get README.md content from a repository
 */
export declare const repo_readme: {
    description: string;
    args: {
        repo: z.ZodString;
        maxLength: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        repo: string;
        maxLength?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get repository structure and detect tech stack
 */
export declare const repo_structure: {
    description: string;
    args: {
        repo: z.ZodString;
        depth: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        repo: string;
        depth?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get directory tree for a specific path
 */
export declare const repo_tree: {
    description: string;
    args: {
        repo: z.ZodString;
        path: z.ZodOptional<z.ZodString>;
        maxDepth: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        repo: string;
        path?: string | undefined;
        maxDepth?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get file content from repository
 */
export declare const repo_file: {
    description: string;
    args: {
        repo: z.ZodString;
        path: z.ZodString;
        maxLength: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        repo: string;
        path: string;
        maxLength?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Search code in a repository
 */
export declare const repo_search: {
    description: string;
    args: {
        repo: z.ZodString;
        query: z.ZodString;
        maxResults: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        repo: string;
        query: string;
        maxResults?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export declare const repoCrawlTools: {
    repo_readme: {
        description: string;
        args: {
            repo: z.ZodString;
            maxLength: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            repo: string;
            maxLength?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    repo_structure: {
        description: string;
        args: {
            repo: z.ZodString;
            depth: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            repo: string;
            depth?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    repo_tree: {
        description: string;
        args: {
            repo: z.ZodString;
            path: z.ZodOptional<z.ZodString>;
            maxDepth: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            repo: string;
            path?: string | undefined;
            maxDepth?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    repo_file: {
        description: string;
        args: {
            repo: z.ZodString;
            path: z.ZodString;
            maxLength: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            repo: string;
            path: string;
            maxLength?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    repo_search: {
        description: string;
        args: {
            repo: z.ZodString;
            query: z.ZodString;
            maxResults: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            repo: string;
            query: string;
            maxResults?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=repo-crawl.d.ts.map