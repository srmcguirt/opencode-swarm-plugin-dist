export declare class MandateError extends Error {
    readonly operation: string;
    readonly details?: unknown | undefined;
    constructor(message: string, operation: string, details?: unknown | undefined);
}
/**
 * Submit a new mandate entry
 *
 * Creates a new entry in the mandate system for voting.
 * Entries start in "candidate" status and can be promoted based on votes.
 */
export declare const mandate_file: {
    description: string;
    args: {
        content: import("zod").ZodString;
        content_type: import("zod").ZodEnum<{
            idea: "idea";
            tip: "tip";
            lore: "lore";
            snippet: "snippet";
            feature_request: "feature_request";
        }>;
        tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        metadata: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
    };
    execute(args: {
        content: string;
        content_type: "idea" | "tip" | "lore" | "snippet" | "feature_request";
        tags?: string[] | undefined;
        metadata?: Record<string, unknown> | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Cast a vote on an existing mandate
 *
 * Each agent can vote once per mandate. Duplicate votes are rejected.
 * Votes influence mandate status through consensus scoring.
 */
export declare const mandate_vote: {
    description: string;
    args: {
        mandate_id: import("zod").ZodString;
        vote_type: import("zod").ZodEnum<{
            upvote: "upvote";
            downvote: "downvote";
        }>;
        agent_name: import("zod").ZodString;
    };
    execute(args: {
        mandate_id: string;
        vote_type: "upvote" | "downvote";
        agent_name: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Search for relevant mandates using semantic search
 *
 * Queries the mandate system by meaning, not just keywords.
 * Useful for finding past decisions or patterns related to a topic.
 */
export declare const mandate_query: {
    description: string;
    args: {
        query: import("zod").ZodString;
        limit: import("zod").ZodOptional<import("zod").ZodNumber>;
        status: import("zod").ZodOptional<import("zod").ZodEnum<{
            candidate: "candidate";
            established: "established";
            mandate: "mandate";
            rejected: "rejected";
        }>>;
        content_type: import("zod").ZodOptional<import("zod").ZodEnum<{
            idea: "idea";
            tip: "tip";
            lore: "lore";
            snippet: "snippet";
            feature_request: "feature_request";
        }>>;
    };
    execute(args: {
        query: string;
        limit?: number | undefined;
        status?: "candidate" | "established" | "mandate" | "rejected" | undefined;
        content_type?: "idea" | "tip" | "lore" | "snippet" | "feature_request" | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * List mandates with optional filters
 *
 * Retrieves mandates by status, content type, or both.
 * Does not use semantic search - returns all matching mandates.
 */
export declare const mandate_list: {
    description: string;
    args: {
        status: import("zod").ZodOptional<import("zod").ZodEnum<{
            candidate: "candidate";
            established: "established";
            mandate: "mandate";
            rejected: "rejected";
        }>>;
        content_type: import("zod").ZodOptional<import("zod").ZodEnum<{
            idea: "idea";
            tip: "tip";
            lore: "lore";
            snippet: "snippet";
            feature_request: "feature_request";
        }>>;
        limit: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    execute(args: {
        status?: "candidate" | "established" | "mandate" | "rejected" | undefined;
        content_type?: "idea" | "tip" | "lore" | "snippet" | "feature_request" | undefined;
        limit?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get voting statistics for a mandate or overall system
 *
 * If mandate_id is provided, returns detailed stats for that mandate.
 * Otherwise, returns aggregate stats across all mandates.
 */
export declare const mandate_stats: {
    description: string;
    args: {
        mandate_id: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        mandate_id?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export declare const mandateTools: {
    mandate_file: {
        description: string;
        args: {
            content: import("zod").ZodString;
            content_type: import("zod").ZodEnum<{
                idea: "idea";
                tip: "tip";
                lore: "lore";
                snippet: "snippet";
                feature_request: "feature_request";
            }>;
            tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            metadata: import("zod").ZodOptional<import("zod").ZodRecord<import("zod").ZodString, import("zod").ZodUnknown>>;
        };
        execute(args: {
            content: string;
            content_type: "idea" | "tip" | "lore" | "snippet" | "feature_request";
            tags?: string[] | undefined;
            metadata?: Record<string, unknown> | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    mandate_vote: {
        description: string;
        args: {
            mandate_id: import("zod").ZodString;
            vote_type: import("zod").ZodEnum<{
                upvote: "upvote";
                downvote: "downvote";
            }>;
            agent_name: import("zod").ZodString;
        };
        execute(args: {
            mandate_id: string;
            vote_type: "upvote" | "downvote";
            agent_name: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    mandate_query: {
        description: string;
        args: {
            query: import("zod").ZodString;
            limit: import("zod").ZodOptional<import("zod").ZodNumber>;
            status: import("zod").ZodOptional<import("zod").ZodEnum<{
                candidate: "candidate";
                established: "established";
                mandate: "mandate";
                rejected: "rejected";
            }>>;
            content_type: import("zod").ZodOptional<import("zod").ZodEnum<{
                idea: "idea";
                tip: "tip";
                lore: "lore";
                snippet: "snippet";
                feature_request: "feature_request";
            }>>;
        };
        execute(args: {
            query: string;
            limit?: number | undefined;
            status?: "candidate" | "established" | "mandate" | "rejected" | undefined;
            content_type?: "idea" | "tip" | "lore" | "snippet" | "feature_request" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    mandate_list: {
        description: string;
        args: {
            status: import("zod").ZodOptional<import("zod").ZodEnum<{
                candidate: "candidate";
                established: "established";
                mandate: "mandate";
                rejected: "rejected";
            }>>;
            content_type: import("zod").ZodOptional<import("zod").ZodEnum<{
                idea: "idea";
                tip: "tip";
                lore: "lore";
                snippet: "snippet";
                feature_request: "feature_request";
            }>>;
            limit: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            status?: "candidate" | "established" | "mandate" | "rejected" | undefined;
            content_type?: "idea" | "tip" | "lore" | "snippet" | "feature_request" | undefined;
            limit?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    mandate_stats: {
        description: string;
        args: {
            mandate_id: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            mandate_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=mandates.d.ts.map