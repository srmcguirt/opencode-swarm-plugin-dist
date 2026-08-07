/**
 * Queue Tools - BullMQ Queue Management for Swarm
 *
 * MCP tools for managing background job queues with BullMQ.
 * Supports job submission, status tracking, listing, and cancellation.
 *
 * Key features:
 * - Submit jobs with type, payload, priority, delay, retry options
 * - Query job status by ID
 * - List jobs by state (waiting, active, completed, failed)
 * - Cancel/remove jobs by ID
 * - Queue metrics and health monitoring
 */
/**
 * Reset queue cache (for testing)
 */
export declare function resetQueueCache(): void;
/**
 * queue_submit - Submit a job to the queue
 */
export declare const queue_submit: {
    description: string;
    args: {
        type: import("zod").ZodString;
        payload: import("zod").ZodString;
        queue_name: import("zod").ZodOptional<import("zod").ZodString>;
        priority: import("zod").ZodOptional<import("zod").ZodNumber>;
        delay: import("zod").ZodOptional<import("zod").ZodNumber>;
        attempts: import("zod").ZodOptional<import("zod").ZodNumber>;
        remove_on_complete: import("zod").ZodOptional<import("zod").ZodBoolean>;
    };
    execute(args: {
        type: string;
        payload: string;
        queue_name?: string | undefined;
        priority?: number | undefined;
        delay?: number | undefined;
        attempts?: number | undefined;
        remove_on_complete?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * queue_status - Get job status by ID
 */
export declare const queue_status: {
    description: string;
    args: {
        job_id: import("zod").ZodString;
        queue_name: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        job_id: string;
        queue_name?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * queue_list - List jobs by state
 */
export declare const queue_list: {
    description: string;
    args: {
        state: import("zod").ZodOptional<import("zod").ZodString>;
        queue_name: import("zod").ZodOptional<import("zod").ZodString>;
        limit: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    execute(args: {
        state?: string | undefined;
        queue_name?: string | undefined;
        limit?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * queue_cancel - Cancel/remove a job by ID
 */
export declare const queue_cancel: {
    description: string;
    args: {
        job_id: import("zod").ZodString;
        queue_name: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        job_id: string;
        queue_name?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * All queue tools for registration in plugin
 *
 * Register with spread operator: { ...queueTools }
 */
export declare const queueTools: {
    readonly queue_submit: {
        description: string;
        args: {
            type: import("zod").ZodString;
            payload: import("zod").ZodString;
            queue_name: import("zod").ZodOptional<import("zod").ZodString>;
            priority: import("zod").ZodOptional<import("zod").ZodNumber>;
            delay: import("zod").ZodOptional<import("zod").ZodNumber>;
            attempts: import("zod").ZodOptional<import("zod").ZodNumber>;
            remove_on_complete: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            type: string;
            payload: string;
            queue_name?: string | undefined;
            priority?: number | undefined;
            delay?: number | undefined;
            attempts?: number | undefined;
            remove_on_complete?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly queue_status: {
        description: string;
        args: {
            job_id: import("zod").ZodString;
            queue_name: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            job_id: string;
            queue_name?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly queue_list: {
        description: string;
        args: {
            state: import("zod").ZodOptional<import("zod").ZodString>;
            queue_name: import("zod").ZodOptional<import("zod").ZodString>;
            limit: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            state?: string | undefined;
            queue_name?: string | undefined;
            limit?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly queue_cancel: {
        description: string;
        args: {
            job_id: import("zod").ZodString;
            queue_name: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            job_id: string;
            queue_name?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=queue-tools.d.ts.map