import { type MailSessionState } from "swarm-mail";
/**
 * Swarm Mail session state
 * @deprecated Use MailSessionState from streams/events.ts instead
 * This is kept for backward compatibility and re-exported as an alias
 */
export type SwarmMailState = MailSessionState;
/**
 * Set the default project directory for Swarm Mail operations
 *
 * Called during plugin initialization with the actual project directory.
 */
export declare function setSwarmMailProjectDirectory(directory: string): void;
/**
 * Get the default project directory
 * Returns undefined if not set - let getDatabasePath use global fallback
 */
export declare function getSwarmMailProjectDirectory(): string | undefined;
export declare function clearSessionState(sessionID: string): void;
/**
 * Initialize Swarm Mail session
 */
export declare const swarmmail_init: {
    description: string;
    args: {
        project_path: import("zod").ZodOptional<import("zod").ZodString>;
        agent_name: import("zod").ZodOptional<import("zod").ZodString>;
        task_description: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        project_path?: string | undefined;
        agent_name?: string | undefined;
        task_description?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Send message to other agents
 */
export declare const swarmmail_send: {
    description: string;
    args: {
        to: import("zod").ZodArray<import("zod").ZodString>;
        subject: import("zod").ZodString;
        body: import("zod").ZodString;
        thread_id: import("zod").ZodOptional<import("zod").ZodString>;
        importance: import("zod").ZodOptional<import("zod").ZodEnum<{
            low: "low";
            normal: "normal";
            high: "high";
            urgent: "urgent";
        }>>;
        ack_required: import("zod").ZodOptional<import("zod").ZodBoolean>;
    };
    execute(args: {
        to: string[];
        subject: string;
        body: string;
        thread_id?: string | undefined;
        importance?: "low" | "normal" | "high" | "urgent" | undefined;
        ack_required?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Fetch inbox (CONTEXT-SAFE: bodies excluded, limit 5)
 */
export declare const swarmmail_inbox: {
    description: string;
    args: {
        limit: import("zod").ZodOptional<import("zod").ZodNumber>;
        urgent_only: import("zod").ZodOptional<import("zod").ZodBoolean>;
    };
    execute(args: {
        limit?: number | undefined;
        urgent_only?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Fetch ONE message body by ID
 */
export declare const swarmmail_read_message: {
    description: string;
    args: {
        message_id: import("zod").ZodNumber;
    };
    execute(args: {
        message_id: number;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Reserve file paths for exclusive editing
 */
export declare const swarmmail_reserve: {
    description: string;
    args: {
        paths: import("zod").ZodPipe<import("zod").ZodArray<import("zod").ZodString>, import("zod").ZodTransform<string[], string[]>>;
        reason: import("zod").ZodOptional<import("zod").ZodString>;
        exclusive: import("zod").ZodOptional<import("zod").ZodBoolean>;
        ttl_seconds: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    execute(args: {
        paths: string[];
        reason?: string | undefined;
        exclusive?: boolean | undefined;
        ttl_seconds?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Release file reservations
 */
export declare const swarmmail_release: {
    description: string;
    args: {
        paths: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        reservation_ids: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodNumber>>;
    };
    execute(args: {
        paths?: string[] | undefined;
        reservation_ids?: number[] | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Release all reservations in the project (coordinator override)
 */
export declare const swarmmail_release_all: {
    description: string;
    args: {};
    execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Release all reservations for a specific agent (coordinator override)
 */
export declare const swarmmail_release_agent: {
    description: string;
    args: {
        agent_name: import("zod").ZodString;
    };
    execute(args: {
        agent_name: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Acknowledge a message
 */
export declare const swarmmail_ack: {
    description: string;
    args: {
        message_id: import("zod").ZodNumber;
    };
    execute(args: {
        message_id: number;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Check if Swarm Mail is healthy
 */
export declare const swarmmail_health: {
    description: string;
    args: {};
    execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export declare const swarmMailTools: {
    swarmmail_init: {
        description: string;
        args: {
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
            agent_name: import("zod").ZodOptional<import("zod").ZodString>;
            task_description: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            project_path?: string | undefined;
            agent_name?: string | undefined;
            task_description?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarmmail_send: {
        description: string;
        args: {
            to: import("zod").ZodArray<import("zod").ZodString>;
            subject: import("zod").ZodString;
            body: import("zod").ZodString;
            thread_id: import("zod").ZodOptional<import("zod").ZodString>;
            importance: import("zod").ZodOptional<import("zod").ZodEnum<{
                low: "low";
                normal: "normal";
                high: "high";
                urgent: "urgent";
            }>>;
            ack_required: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            to: string[];
            subject: string;
            body: string;
            thread_id?: string | undefined;
            importance?: "low" | "normal" | "high" | "urgent" | undefined;
            ack_required?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarmmail_inbox: {
        description: string;
        args: {
            limit: import("zod").ZodOptional<import("zod").ZodNumber>;
            urgent_only: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            limit?: number | undefined;
            urgent_only?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarmmail_read_message: {
        description: string;
        args: {
            message_id: import("zod").ZodNumber;
        };
        execute(args: {
            message_id: number;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarmmail_reserve: {
        description: string;
        args: {
            paths: import("zod").ZodPipe<import("zod").ZodArray<import("zod").ZodString>, import("zod").ZodTransform<string[], string[]>>;
            reason: import("zod").ZodOptional<import("zod").ZodString>;
            exclusive: import("zod").ZodOptional<import("zod").ZodBoolean>;
            ttl_seconds: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            paths: string[];
            reason?: string | undefined;
            exclusive?: boolean | undefined;
            ttl_seconds?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarmmail_release: {
        description: string;
        args: {
            paths: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            reservation_ids: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodNumber>>;
        };
        execute(args: {
            paths?: string[] | undefined;
            reservation_ids?: number[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarmmail_release_all: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarmmail_release_agent: {
        description: string;
        args: {
            agent_name: import("zod").ZodString;
        };
        execute(args: {
            agent_name: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarmmail_ack: {
        description: string;
        args: {
            message_id: import("zod").ZodNumber;
        };
        execute(args: {
            message_id: number;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarmmail_health: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=swarm-mail.d.ts.map