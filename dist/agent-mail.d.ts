import { z } from "zod";
import type { MailSessionState } from "swarm-mail";
declare const AGENT_MAIL_URL = "http://127.0.0.1:8765";
declare const MAX_INBOX_LIMIT = 5;
/**
 * Set the default project directory for Agent Mail operations
 *
 * Called during plugin initialization with the actual project directory.
 * This ensures agentmail_init uses the correct project path by default.
 */
export declare function setAgentMailProjectDirectory(directory: string): void;
/**
 * Get the default project directory
 *
 * Returns the configured directory, or falls back to cwd if not set.
 */
export declare function getAgentMailProjectDirectory(): string;
declare const RETRY_CONFIG: {
    maxRetries: number;
    baseDelayMs: number;
    maxDelayMs: number;
    timeoutMs: number;
    jitterPercent: number;
};
declare const RECOVERY_CONFIG: {
    /** Max consecutive failures before attempting restart (1 = restart on first "unexpected error") */
    failureThreshold: number;
    /** Cooldown between restart attempts (ms) - 10 seconds */
    restartCooldownMs: number;
    /** Whether auto-restart is enabled */
    enabled: boolean;
};
/**
 * Agent Mail session state
 * @deprecated Use MailSessionState from streams/events.ts instead
 * This is kept for backward compatibility and re-exported as an alias
 */
export type AgentMailState = MailSessionState;
/**
 * State storage keyed by sessionID.
 * In-memory cache that also persists to disk for CLI usage.
 */
declare const sessionStates: Map<string, MailSessionState>;
/**
 * AgentMailError - Custom error for Agent Mail operations
 *
 * Note: Using a factory pattern to avoid "Cannot call a class constructor without |new|"
 * errors in some bundled environments (OpenCode's plugin runtime).
 */
export declare class AgentMailError extends Error {
    readonly tool: string;
    readonly code?: number;
    readonly data?: unknown;
    constructor(message: string, tool: string, code?: number, data?: unknown);
}
/**
 * Factory function to create AgentMailError
 * Use this instead of `new AgentMailError()` for compatibility
 */
export declare function createAgentMailError(message: string, tool: string, code?: number, data?: unknown): AgentMailError;
export declare class AgentMailNotInitializedError extends Error {
    constructor();
}
export declare class FileReservationConflictError extends Error {
    readonly conflicts: Array<{
        path: string;
        holders: string[];
    }>;
    constructor(message: string, conflicts: Array<{
        path: string;
        holders: string[];
    }>);
}
export declare class RateLimitExceededError extends Error {
    readonly endpoint: string;
    readonly remaining: number;
    readonly resetAt: number;
    constructor(endpoint: string, remaining: number, resetAt: number);
}
/**
 * Check if the server is responding to health checks
 */
declare function isServerHealthy(): Promise<boolean>;
/**
 * Test if the server can handle a basic MCP call
 * This catches cases where health is OK but MCP is broken
 */
declare function isServerFunctional(): Promise<boolean>;
/**
 * Attempt to restart the Agent Mail server
 *
 * Finds the running process, kills it, and starts a new one.
 * Returns true if restart was successful.
 */
declare function restartServer(): Promise<boolean>;
/**
 * Reset recovery state (for testing)
 */
export declare function resetRecoveryState(): void;
/**
 * Check if an error indicates the project was not found
 *
 * This happens when Agent Mail server restarts and loses project registrations.
 * The fix is to re-register the project and retry the operation.
 */
export declare function isProjectNotFoundError(error: unknown): boolean;
/**
 * Check if an error indicates the agent was not found
 *
 * Similar to project not found - server restart loses agent registrations.
 */
export declare function isAgentNotFoundError(error: unknown): boolean;
/**
 * Reset availability cache (for testing)
 */
export declare function resetAgentMailCache(): void;
/**
 * Reset rate limiter (for testing)
 */
export declare function resetRateLimiterCache(): Promise<void>;
/**
 * Call an Agent Mail MCP tool with retry and auto-restart
 *
 * Features:
 * - Exponential backoff with jitter on retryable errors
 * - Auto-restart server after consecutive failures
 * - Timeout handling per request
 *
 * Handles both direct results (mock server) and wrapped results (real server).
 * Real Agent Mail returns: { content: [...], structuredContent: {...} }
 */
export declare function mcpCall<T>(toolName: string, args: Record<string, unknown>): Promise<T>;
/**
 * MCP call with automatic project/agent re-registration on "not found" errors
 *
 * This is the self-healing wrapper that handles Agent Mail server restarts.
 * When the server restarts, it loses all project and agent registrations.
 * This wrapper detects those errors and automatically re-registers before retrying.
 *
 * Use this instead of raw mcpCall when you have project_key and agent_name context.
 *
 * @param toolName - The MCP tool to call
 * @param args - Arguments including project_key and optionally agent_name
 * @param options - Optional configuration for re-registration
 * @returns The result of the MCP call
 */
export declare function mcpCallWithAutoInit<T>(toolName: string, args: Record<string, unknown> & {
    project_key: string;
    agent_name?: string;
}, options?: {
    /** Task description for agent re-registration */
    taskDescription?: string;
    /** Max re-registration attempts (default: 1) */
    maxReregistrationAttempts?: number;
}): Promise<T>;
/**
 * Get Agent Mail state for a session, or throw if not initialized
 *
 * Checks in-memory cache first, then falls back to disk storage.
 * This allows CLI invocations to share state across calls.
 */
declare function requireState(sessionID: string): AgentMailState;
/**
 * Store Agent Mail state for a session
 *
 * Saves to both in-memory cache and disk for CLI persistence.
 */
declare function setState(sessionID: string, state: AgentMailState): void;
/**
 * Get state if exists (for cleanup hooks)
 *
 * Checks in-memory cache first, then falls back to disk storage.
 */
declare function getState(sessionID: string): AgentMailState | undefined;
/**
 * Clear state for a session
 *
 * Removes from both in-memory cache and disk.
 */
declare function clearState(sessionID: string): void;
/**
 * Initialize Agent Mail session
 */
export declare const agentmail_init: {
    description: string;
    args: {
        project_path: z.ZodOptional<z.ZodString>;
        agent_name: z.ZodOptional<z.ZodString>;
        task_description: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        project_path?: string | undefined;
        agent_name?: string | undefined;
        task_description?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Send a message to other agents
 */
export declare const agentmail_send: {
    description: string;
    args: {
        to: z.ZodArray<z.ZodString>;
        subject: z.ZodString;
        body: z.ZodString;
        thread_id: z.ZodOptional<z.ZodString>;
        importance: z.ZodOptional<z.ZodEnum<{
            low: "low";
            normal: "normal";
            high: "high";
            urgent: "urgent";
        }>>;
        ack_required: z.ZodOptional<z.ZodBoolean>;
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
export declare const agentmail_inbox: {
    description: string;
    args: {
        limit: z.ZodOptional<z.ZodNumber>;
        urgent_only: z.ZodOptional<z.ZodBoolean>;
        since_ts: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        limit?: number | undefined;
        urgent_only?: boolean | undefined;
        since_ts?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Read a single message body by ID
 */
export declare const agentmail_read_message: {
    description: string;
    args: {
        message_id: z.ZodNumber;
    };
    execute(args: {
        message_id: number;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Summarize a thread (PREFERRED over fetching all messages)
 */
export declare const agentmail_summarize_thread: {
    description: string;
    args: {
        thread_id: z.ZodString;
        include_examples: z.ZodOptional<z.ZodBoolean>;
    };
    execute(args: {
        thread_id: string;
        include_examples?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Reserve file paths for exclusive editing
 */
export declare const agentmail_reserve: {
    description: string;
    args: {
        paths: z.ZodArray<z.ZodString>;
        ttl_seconds: z.ZodNumber;
        exclusive: z.ZodOptional<z.ZodBoolean>;
        reason: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        paths: string[];
        ttl_seconds: number;
        exclusive?: boolean | undefined;
        reason?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Release file reservations
 */
export declare const agentmail_release: {
    description: string;
    args: {
        paths: z.ZodOptional<z.ZodArray<z.ZodString>>;
        reservation_ids: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
    };
    execute(args: {
        paths?: string[] | undefined;
        reservation_ids?: number[] | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Acknowledge a message
 */
export declare const agentmail_ack: {
    description: string;
    args: {
        message_id: z.ZodNumber;
    };
    execute(args: {
        message_id: number;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Search messages
 */
export declare const agentmail_search: {
    description: string;
    args: {
        query: z.ZodString;
        limit: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        query: string;
        limit?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Check Agent Mail health
 */
export declare const agentmail_health: {
    description: string;
    args: {};
    execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Manually restart Agent Mail server
 *
 * Use when server is in bad state (health OK but MCP failing).
 * This kills the existing process and starts a fresh one.
 */
export declare const agentmail_restart: {
    description: string;
    args: {
        force: z.ZodOptional<z.ZodBoolean>;
    };
    execute(args: {
        force?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export declare const agentMailTools: {
    agentmail_init: {
        description: string;
        args: {
            project_path: z.ZodOptional<z.ZodString>;
            agent_name: z.ZodOptional<z.ZodString>;
            task_description: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            project_path?: string | undefined;
            agent_name?: string | undefined;
            task_description?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    agentmail_send: {
        description: string;
        args: {
            to: z.ZodArray<z.ZodString>;
            subject: z.ZodString;
            body: z.ZodString;
            thread_id: z.ZodOptional<z.ZodString>;
            importance: z.ZodOptional<z.ZodEnum<{
                low: "low";
                normal: "normal";
                high: "high";
                urgent: "urgent";
            }>>;
            ack_required: z.ZodOptional<z.ZodBoolean>;
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
    agentmail_inbox: {
        description: string;
        args: {
            limit: z.ZodOptional<z.ZodNumber>;
            urgent_only: z.ZodOptional<z.ZodBoolean>;
            since_ts: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            limit?: number | undefined;
            urgent_only?: boolean | undefined;
            since_ts?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    agentmail_read_message: {
        description: string;
        args: {
            message_id: z.ZodNumber;
        };
        execute(args: {
            message_id: number;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    agentmail_summarize_thread: {
        description: string;
        args: {
            thread_id: z.ZodString;
            include_examples: z.ZodOptional<z.ZodBoolean>;
        };
        execute(args: {
            thread_id: string;
            include_examples?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    agentmail_reserve: {
        description: string;
        args: {
            paths: z.ZodArray<z.ZodString>;
            ttl_seconds: z.ZodNumber;
            exclusive: z.ZodOptional<z.ZodBoolean>;
            reason: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            paths: string[];
            ttl_seconds: number;
            exclusive?: boolean | undefined;
            reason?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    agentmail_release: {
        description: string;
        args: {
            paths: z.ZodOptional<z.ZodArray<z.ZodString>>;
            reservation_ids: z.ZodOptional<z.ZodArray<z.ZodNumber>>;
        };
        execute(args: {
            paths?: string[] | undefined;
            reservation_ids?: number[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    agentmail_ack: {
        description: string;
        args: {
            message_id: z.ZodNumber;
        };
        execute(args: {
            message_id: number;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    agentmail_search: {
        description: string;
        args: {
            query: z.ZodString;
            limit: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            query: string;
            limit?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    agentmail_health: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    agentmail_restart: {
        description: string;
        args: {
            force: z.ZodOptional<z.ZodBoolean>;
        };
        execute(args: {
            force?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
export { requireState, setState, getState, clearState, sessionStates, AGENT_MAIL_URL, MAX_INBOX_LIMIT, isServerHealthy, isServerFunctional, restartServer, RETRY_CONFIG, RECOVERY_CONFIG, };
//# sourceMappingURL=agent-mail.d.ts.map