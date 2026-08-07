/**
 * OpenCode Swarm Plugin
 *
 * A type-safe plugin for multi-agent coordination with hive issue tracking
 * and Agent Mail integration. Provides structured tools for swarm operations.
 *
 * @module opencode-swarm-plugin
 *
 * @example
 * ```typescript
 * // In opencode.jsonc
 * {
 *   "plugins": ["opencode-swarm-plugin"]
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Programmatic usage (hive is the new name, beads is deprecated)
 * import { hiveTools, beadsTools, agentMailTools, swarmMailTools } from "opencode-swarm-plugin"
 * ```
 */
import type { Plugin } from "@opencode-ai/plugin";
/**
 * OpenCode Swarm Plugin
 *
 * Registers all swarm coordination tools:
 * - hive:* - Type-safe hive issue tracker wrappers (primary)
 * - beads:* - Legacy aliases for hive tools (deprecated, use hive:* instead)
 * - agent-mail:* - Multi-agent coordination via Agent Mail MCP (legacy)
 * - swarm-mail:* - Multi-agent coordination with embedded event sourcing (recommended)
 * - structured:* - Structured output parsing and validation
 * - swarm:* - Swarm orchestration and task decomposition
 * - repo-crawl:* - GitHub API tools for repository research
 * - skills:* - Agent skills discovery, activation, and execution
 * - mandate:* - Agent voting system for collaborative knowledge curation
 * - hivemind:* - Unified memory system (learnings + session history)
 * - contributor_lookup - GitHub contributor profile lookup with changeset credit generation
 *
 * @param input - Plugin context from OpenCode
 * @returns Plugin hooks including tools, events, and tool execution hooks
 */
declare const SwarmPlugin: Plugin;
/**
 * Default export for OpenCode plugin loading
 *
 * OpenCode loads plugins by their default export, so this allows:
 * ```json
 * { "plugins": ["opencode-swarm-plugin"] }
 * ```
 */
export default SwarmPlugin;
/**
 * Re-export all schemas for type-safe usage
 */
export * from "./schemas";
/**
 * Re-export hive module (primary) and beads module (deprecated aliases)
 *
 * Includes:
 * - hiveTools - All hive tool definitions (primary)
 * - beadsTools - Legacy aliases for backward compatibility (deprecated)
 * - Individual tool exports (hive_create, hive_query, etc.)
 * - Legacy aliases (hive_create, hive_query, etc.)
 * - HiveError, HiveValidationError (and BeadError, BeadValidationError aliases)
 *
 * DEPRECATED: Use hive_* tools instead of beads_* tools
 */
export * from "./hive";
/**
 * Re-export agent-mail module (legacy MCP-based)
 *
 * Includes:
 * - agentMailTools - All agent mail tool definitions
 * - AgentMailError, FileReservationConflictError - Error classes
 * - AgentMailState - Session state type
 *
 * NOTE: For OpenCode plugin usage, import from "opencode-swarm-plugin/plugin" instead
 * to avoid the plugin loader trying to call these classes as functions.
 *
 * DEPRECATED: Use swarm-mail module instead for embedded event-sourced implementation.
 */
export { agentMailTools, AgentMailError, AgentMailNotInitializedError, FileReservationConflictError, createAgentMailError, setAgentMailProjectDirectory, getAgentMailProjectDirectory, mcpCallWithAutoInit, isProjectNotFoundError, isAgentNotFoundError, type AgentMailState, } from "./agent-mail";
/**
 * Re-export swarm-mail module (embedded event-sourced)
 *
 * Includes:
 * - swarmMailTools - All swarm mail tool definitions
 * - setSwarmMailProjectDirectory, getSwarmMailProjectDirectory - Directory management
 * - clearSessionState - Session cleanup
 * - SwarmMailState - Session state type
 *
 * Features:
 * - Embedded PGLite storage (no external server dependency)
 * - Event sourcing for full audit trail
 * - Offset-based resumability
 * - Materialized views for fast queries
 * - File reservation with conflict detection
 */
export { swarmMailTools, setSwarmMailProjectDirectory, getSwarmMailProjectDirectory, clearSessionState, type SwarmMailState, } from "./swarm-mail";
/**
 * Re-export shared types from swarm-mail package
 *
 * Includes:
 * - MailSessionState - Shared session state type for Agent Mail and Swarm Mail
 */
export { type MailSessionState } from "swarm-mail";
/**
 * Re-export structured module
 *
 * Includes:
 * - structuredTools - Structured output parsing tools
 * - Utility functions for JSON extraction
 */
export { structuredTools, extractJsonFromText, formatZodErrors, getSchemaByName, } from "./structured";
/**
 * Re-export swarm module
 *
 * Includes:
 * - swarmTools - Swarm orchestration tools
 * - SwarmError, DecompositionError - Error classes
 * - formatSubtaskPrompt, formatEvaluationPrompt - Prompt helpers
 * - selectStrategy, formatStrategyGuidelines - Strategy selection helpers
 * - STRATEGIES - Strategy definitions
 *
 * Types:
 * - DecompositionStrategy - Strategy type union
 * - StrategyDefinition - Strategy definition interface
 *
 * NOTE: Prompt template strings (DECOMPOSITION_PROMPT, etc.) are NOT exported
 * to avoid confusing the plugin loader which tries to call all exports as functions
 */
export { swarmTools, SwarmError, DecompositionError, formatSubtaskPrompt, formatSubtaskPromptV2, formatEvaluationPrompt, SUBTASK_PROMPT_V2, STRATEGIES, selectStrategy, formatStrategyGuidelines, type DecompositionStrategy, type StrategyDefinition, } from "./swarm";
/**
 * All tools in a single registry for CLI tool execution
 *
 * This is used by `swarm tool <name>` command to dynamically execute tools.
 * Each tool has an `execute` function that takes (args, ctx) and returns a string.
 *
 * Note: hiveTools includes both hive_* and beads_* (legacy aliases)
 * Note: hivemindTools includes both hivemind_* and deprecated semantic-memory_* + cass_* aliases
 */
export declare const allTools: {
    readonly contributor_lookup: {
        description: string;
        args: {
            login: import("zod").ZodString;
            issue: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            login: string;
            issue?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
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
    readonly swarm_discover_tools: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_get_versions: {
        description: string;
        args: {
            projectPath: import("zod").ZodString;
            packages: import("zod").ZodArray<import("zod").ZodString>;
            checkUpgrades: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            projectPath: string;
            packages: string[];
            checkUpgrades?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_analytics: {
        description: string;
        args: {
            query: import("zod").ZodEnum<{
                "failed-decompositions": "failed-decompositions";
                "strategy-success-rates": "strategy-success-rates";
                "lock-contention": "lock-contention";
                "agent-activity": "agent-activity";
                "message-latency": "message-latency";
                "scope-violations": "scope-violations";
                "task-duration": "task-duration";
                "checkpoint-frequency": "checkpoint-frequency";
                "recovery-success": "recovery-success";
                "human-feedback": "human-feedback";
            }>;
            since: import("zod").ZodOptional<import("zod").ZodString>;
            format: import("zod").ZodOptional<import("zod").ZodEnum<{
                summary: "summary";
                json: "json";
            }>>;
        };
        execute(args: {
            query: "failed-decompositions" | "strategy-success-rates" | "lock-contention" | "agent-activity" | "message-latency" | "scope-violations" | "task-duration" | "checkpoint-frequency" | "recovery-success" | "human-feedback";
            since?: string | undefined;
            format?: "summary" | "json" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_query: {
        description: string;
        args: {
            sql: import("zod").ZodString;
            format: import("zod").ZodOptional<import("zod").ZodEnum<{
                table: "table";
                json: "json";
            }>>;
        };
        execute(args: {
            sql: string;
            format?: "table" | "json" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_diagnose: {
        description: string;
        args: {
            epic_id: import("zod").ZodOptional<import("zod").ZodString>;
            bead_id: import("zod").ZodOptional<import("zod").ZodString>;
            include: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodEnum<{
                errors: "errors";
                blockers: "blockers";
                conflicts: "conflicts";
                slow_tasks: "slow_tasks";
                timeline: "timeline";
            }>>>;
        };
        execute(args: {
            epic_id?: string | undefined;
            bead_id?: string | undefined;
            include?: ("errors" | "blockers" | "conflicts" | "slow_tasks" | "timeline")[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_insights: {
        description: string;
        args: {
            scope: import("zod").ZodEnum<{
                project: "project";
                epic: "epic";
                recent: "recent";
            }>;
            epic_id: import("zod").ZodOptional<import("zod").ZodString>;
            metrics: import("zod").ZodArray<import("zod").ZodEnum<{
                success_rate: "success_rate";
                avg_duration: "avg_duration";
                conflict_rate: "conflict_rate";
                retry_rate: "retry_rate";
            }>>;
        };
        execute(args: {
            scope: "project" | "epic" | "recent";
            metrics: ("success_rate" | "avg_duration" | "conflict_rate" | "retry_rate")[];
            epic_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
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
    readonly mandate_file: {
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
    readonly mandate_vote: {
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
    readonly mandate_query: {
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
    readonly mandate_list: {
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
    readonly mandate_stats: {
        description: string;
        args: {
            mandate_id: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            mandate_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly skills_list: {
        description: string;
        args: {
            tag: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            tag?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly skills_use: {
        description: string;
        args: {
            name: import("zod").ZodString;
            include_scripts: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            name: string;
            include_scripts?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly skills_execute: {
        description: string;
        args: {
            skill: import("zod").ZodString;
            script: import("zod").ZodString;
            args: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            timeout_ms: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            skill: string;
            script: string;
            args?: string[] | undefined;
            timeout_ms?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly skills_read: {
        description: string;
        args: {
            skill: import("zod").ZodString;
            file: import("zod").ZodString;
        };
        execute(args: {
            skill: string;
            file: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly skills_create: {
        description: string;
        args: {
            name: import("zod").ZodString;
            description: import("zod").ZodString;
            body: import("zod").ZodString;
            tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            tools: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            directory: import("zod").ZodOptional<import("zod").ZodEnum<{
                global: "global";
                ".opencode/skill": ".opencode/skill";
                ".claude/skills": ".claude/skills";
                skill: "skill";
                "global-claude": "global-claude";
            }>>;
        };
        execute(args: {
            name: string;
            description: string;
            body: string;
            tags?: string[] | undefined;
            tools?: string[] | undefined;
            directory?: "global" | ".opencode/skill" | ".claude/skills" | "skill" | "global-claude" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly skills_update: {
        description: string;
        args: {
            name: import("zod").ZodString;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            content: import("zod").ZodOptional<import("zod").ZodString>;
            body: import("zod").ZodOptional<import("zod").ZodString>;
            append_body: import("zod").ZodOptional<import("zod").ZodString>;
            tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            add_tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            tools: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        };
        execute(args: {
            name: string;
            description?: string | undefined;
            content?: string | undefined;
            body?: string | undefined;
            append_body?: string | undefined;
            tags?: string[] | undefined;
            add_tags?: string[] | undefined;
            tools?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly skills_delete: {
        description: string;
        args: {
            name: import("zod").ZodString;
            confirm: import("zod").ZodBoolean;
        };
        execute(args: {
            name: string;
            confirm: boolean;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly skills_add_script: {
        description: string;
        args: {
            skill: import("zod").ZodString;
            script_name: import("zod").ZodString;
            content: import("zod").ZodString;
            executable: import("zod").ZodDefault<import("zod").ZodBoolean>;
        };
        execute(args: {
            skill: string;
            script_name: string;
            content: string;
            executable: boolean;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly skills_reload: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly skills_init: {
        description: string;
        args: {
            name: import("zod").ZodString;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            directory: import("zod").ZodOptional<import("zod").ZodEnum<{
                global: "global";
                ".claude/skills": ".claude/skills";
                skills: "skills";
                ".opencode/skills": ".opencode/skills";
            }>>;
            include_example_script: import("zod").ZodDefault<import("zod").ZodBoolean>;
            include_reference: import("zod").ZodDefault<import("zod").ZodBoolean>;
        };
        execute(args: {
            name: string;
            include_example_script: boolean;
            include_reference: boolean;
            description?: string | undefined;
            directory?: "global" | ".claude/skills" | "skills" | ".opencode/skills" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly repo_readme: {
        description: string;
        args: {
            repo: import("zod").ZodString;
            maxLength: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            repo: string;
            maxLength?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly repo_structure: {
        description: string;
        args: {
            repo: import("zod").ZodString;
            depth: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            repo: string;
            depth?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly repo_tree: {
        description: string;
        args: {
            repo: import("zod").ZodString;
            path: import("zod").ZodOptional<import("zod").ZodString>;
            maxDepth: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            repo: string;
            path?: string | undefined;
            maxDepth?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly repo_file: {
        description: string;
        args: {
            repo: import("zod").ZodString;
            path: import("zod").ZodString;
            maxLength: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            repo: string;
            path: string;
            maxLength?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly repo_search: {
        description: string;
        args: {
            repo: import("zod").ZodString;
            query: import("zod").ZodString;
            maxResults: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            repo: string;
            query: string;
            maxResults?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_review: {
        description: string;
        args: {
            project_key: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            task_id: import("zod").ZodString;
            files_touched: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        };
        execute(args: {
            project_key: string;
            epic_id: string;
            task_id: string;
            files_touched?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_review_feedback: {
        description: string;
        args: {
            project_key: import("zod").ZodString;
            task_id: import("zod").ZodString;
            worker_id: import("zod").ZodString;
            status: import("zod").ZodEnum<{
                approved: "approved";
                needs_changes: "needs_changes";
            }>;
            summary: import("zod").ZodOptional<import("zod").ZodString>;
            issues: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            project_key: string;
            task_id: string;
            worker_id: string;
            status: "approved" | "needs_changes";
            summary?: string | undefined;
            issues?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_worktree_create: {
        description: string;
        args: {
            project_path: import("zod").ZodString;
            task_id: import("zod").ZodString;
            start_commit: import("zod").ZodString;
        };
        execute(args: {
            project_path: string;
            task_id: string;
            start_commit: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_worktree_merge: {
        description: string;
        args: {
            project_path: import("zod").ZodString;
            task_id: import("zod").ZodString;
            start_commit: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            project_path: string;
            task_id: string;
            start_commit?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_worktree_cleanup: {
        description: string;
        args: {
            project_path: import("zod").ZodString;
            task_id: import("zod").ZodOptional<import("zod").ZodString>;
            cleanup_all: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            project_path: string;
            task_id?: string | undefined;
            cleanup_all?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_worktree_list: {
        description: string;
        args: {
            project_path: import("zod").ZodString;
        };
        execute(args: {
            project_path: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_get_strategy_insights: {
        description: string;
        args: {
            task: import("zod").ZodString;
        };
        execute(args: {
            task: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_get_file_insights: {
        description: string;
        args: {
            files: import("zod").ZodArray<import("zod").ZodString>;
        };
        execute(args: {
            files: string[];
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_get_pattern_insights: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_verify: {
        description: string;
        args: {
            files_touched: import("zod").ZodArray<import("zod").ZodString>;
            skip_verification: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            files_touched: string[];
            skip_verification?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_adversarial_review: {
        description: string;
        args: {
            diff: import("zod").ZodString;
            test_output: import("zod").ZodOptional<import("zod").ZodString>;
            is_hallucination_test: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            diff: string;
            test_output?: string | undefined;
            is_hallucination_test?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_init: {
        description: string;
        args: {
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
            isolation: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodEnum<{
                reservation: "reservation";
                worktree: "worktree";
            }>>>;
        };
        execute(args: {
            isolation: "reservation" | "worktree";
            project_path?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_status: {
        description: string;
        args: {
            epic_id: import("zod").ZodString;
            project_key: import("zod").ZodString;
        };
        execute(args: {
            epic_id: string;
            project_key: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_progress: {
        description: string;
        args: {
            project_key: import("zod").ZodString;
            agent_name: import("zod").ZodString;
            bead_id: import("zod").ZodString;
            status: import("zod").ZodEnum<{
                in_progress: "in_progress";
                blocked: "blocked";
                failed: "failed";
                completed: "completed";
            }>;
            message: import("zod").ZodOptional<import("zod").ZodString>;
            progress_percent: import("zod").ZodOptional<import("zod").ZodNumber>;
            files_touched: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        };
        execute(args: {
            project_key: string;
            agent_name: string;
            bead_id: string;
            status: "in_progress" | "blocked" | "failed" | "completed";
            message?: string | undefined;
            progress_percent?: number | undefined;
            files_touched?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_broadcast: {
        description: string;
        args: {
            project_path: import("zod").ZodString;
            agent_name: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            message: import("zod").ZodString;
            importance: import("zod").ZodDefault<import("zod").ZodEnum<{
                info: "info";
                warning: "warning";
                blocker: "blocker";
            }>>;
            files_affected: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        };
        execute(args: {
            project_path: string;
            agent_name: string;
            epic_id: string;
            message: string;
            importance: "info" | "warning" | "blocker";
            files_affected?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_complete: {
        description: string;
        args: {
            project_key: import("zod").ZodString;
            agent_name: import("zod").ZodString;
            bead_id: import("zod").ZodString;
            summary: import("zod").ZodString;
            evaluation: import("zod").ZodOptional<import("zod").ZodString>;
            files_touched: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            skip_verification: import("zod").ZodOptional<import("zod").ZodBoolean>;
            planned_files: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            start_time: import("zod").ZodOptional<import("zod").ZodNumber>;
            error_count: import("zod").ZodOptional<import("zod").ZodNumber>;
            retry_count: import("zod").ZodOptional<import("zod").ZodNumber>;
            skip_review: import("zod").ZodOptional<import("zod").ZodBoolean>;
            commit_sha: import("zod").ZodOptional<import("zod").ZodString>;
            commit_message: import("zod").ZodOptional<import("zod").ZodString>;
            commit_branch: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            project_key: string;
            agent_name: string;
            bead_id: string;
            summary: string;
            evaluation?: string | undefined;
            files_touched?: string[] | undefined;
            skip_verification?: boolean | undefined;
            planned_files?: string[] | undefined;
            start_time?: number | undefined;
            error_count?: number | undefined;
            retry_count?: number | undefined;
            skip_review?: boolean | undefined;
            commit_sha?: string | undefined;
            commit_message?: string | undefined;
            commit_branch?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_record_outcome: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            duration_ms: import("zod").ZodNumber;
            error_count: import("zod").ZodDefault<import("zod").ZodNumber>;
            retry_count: import("zod").ZodDefault<import("zod").ZodNumber>;
            success: import("zod").ZodBoolean;
            files_touched: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            criteria: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            strategy: import("zod").ZodOptional<import("zod").ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                "research-based": "research-based";
            }>>;
            failure_mode: import("zod").ZodOptional<import("zod").ZodEnum<{
                timeout: "timeout";
                unknown: "unknown";
                conflict: "conflict";
                validation: "validation";
                tool_failure: "tool_failure";
                context_overflow: "context_overflow";
                dependency_blocked: "dependency_blocked";
                user_cancelled: "user_cancelled";
            }>>;
            failure_details: import("zod").ZodOptional<import("zod").ZodString>;
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
            epic_id: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            bead_id: string;
            duration_ms: number;
            error_count: number;
            retry_count: number;
            success: boolean;
            files_touched?: string[] | undefined;
            criteria?: string[] | undefined;
            strategy?: "file-based" | "feature-based" | "risk-based" | "research-based" | undefined;
            failure_mode?: "timeout" | "unknown" | "conflict" | "validation" | "tool_failure" | "context_overflow" | "dependency_blocked" | "user_cancelled" | undefined;
            failure_details?: string | undefined;
            project_path?: string | undefined;
            epic_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_research_phase: {
        description: string;
        args: {
            task: import("zod").ZodString;
            project_path: import("zod").ZodString;
            check_upgrades: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            task: string;
            project_path: string;
            check_upgrades?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_accumulate_error: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            error_type: import("zod").ZodEnum<{
                timeout: "timeout";
                unknown: "unknown";
                conflict: "conflict";
                validation: "validation";
                tool_failure: "tool_failure";
            }>;
            message: import("zod").ZodString;
            stack_trace: import("zod").ZodOptional<import("zod").ZodString>;
            tool_name: import("zod").ZodOptional<import("zod").ZodString>;
            context: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            bead_id: string;
            error_type: "timeout" | "unknown" | "conflict" | "validation" | "tool_failure";
            message: string;
            stack_trace?: string | undefined;
            tool_name?: string | undefined;
            context?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_get_error_context: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            include_resolved: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            bead_id: string;
            include_resolved?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_resolve_error: {
        description: string;
        args: {
            error_id: import("zod").ZodString;
        };
        execute(args: {
            error_id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_check_strikes: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            action: import("zod").ZodEnum<{
                check: "check";
                add_strike: "add_strike";
                clear: "clear";
                get_prompt: "get_prompt";
            }>;
            attempt: import("zod").ZodOptional<import("zod").ZodString>;
            reason: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            bead_id: string;
            action: "check" | "add_strike" | "clear" | "get_prompt";
            attempt?: string | undefined;
            reason?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_checkpoint: {
        description: string;
        args: {
            project_key: import("zod").ZodString;
            agent_name: import("zod").ZodString;
            bead_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            files_modified: import("zod").ZodArray<import("zod").ZodString>;
            progress_percent: import("zod").ZodNumber;
            directives: import("zod").ZodOptional<import("zod").ZodObject<{
                shared_context: import("zod").ZodOptional<import("zod").ZodString>;
                skills_to_load: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                coordinator_notes: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            error_context: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            project_key: string;
            agent_name: string;
            bead_id: string;
            epic_id: string;
            files_modified: string[];
            progress_percent: number;
            directives?: {
                shared_context?: string | undefined;
                skills_to_load?: string[] | undefined;
                coordinator_notes?: string | undefined;
            } | undefined;
            error_context?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_recover: {
        description: string;
        args: {
            project_key: import("zod").ZodString;
            epic_id: import("zod").ZodString;
        };
        execute(args: {
            project_key: string;
            epic_id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_branch: {
        description: string;
        args: {
            project_key: import("zod").ZodString;
            agent_name: import("zod").ZodString;
            bead_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            branch_label: import("zod").ZodString;
            branch_purpose: import("zod").ZodString;
            files_modified: import("zod").ZodArray<import("zod").ZodString>;
            progress_percent: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            project_key: string;
            agent_name: string;
            bead_id: string;
            epic_id: string;
            branch_label: string;
            branch_purpose: string;
            files_modified: string[];
            progress_percent?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_return: {
        description: string;
        args: {
            project_key: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            branch_label: import("zod").ZodOptional<import("zod").ZodString>;
            carry_back_learnings: import("zod").ZodOptional<import("zod").ZodString>;
            carry_back_files: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        };
        execute(args: {
            project_key: string;
            epic_id: string;
            branch_label?: string | undefined;
            carry_back_learnings?: string | undefined;
            carry_back_files?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_learn: {
        description: string;
        args: {
            summary: import("zod").ZodString;
            pattern_type: import("zod").ZodEnum<{
                "code-pattern": "code-pattern";
                "best-practice": "best-practice";
                gotcha: "gotcha";
                "tool-usage": "tool-usage";
                "domain-knowledge": "domain-knowledge";
                workflow: "workflow";
            }>;
            details: import("zod").ZodString;
            example: import("zod").ZodOptional<import("zod").ZodString>;
            when_to_use: import("zod").ZodString;
            files_context: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            create_skill: import("zod").ZodOptional<import("zod").ZodBoolean>;
            skill_name: import("zod").ZodOptional<import("zod").ZodString>;
            skill_tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        };
        execute(args: {
            summary: string;
            pattern_type: "code-pattern" | "best-practice" | "gotcha" | "tool-usage" | "domain-knowledge" | "workflow";
            details: string;
            when_to_use: string;
            example?: string | undefined;
            files_context?: string[] | undefined;
            create_skill?: boolean | undefined;
            skill_name?: string | undefined;
            skill_tags?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_subtask_prompt: {
        description: string;
        args: {
            agent_name: import("zod").ZodString;
            bead_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            subtask_title: import("zod").ZodString;
            subtask_description: import("zod").ZodOptional<import("zod").ZodString>;
            files: import("zod").ZodArray<import("zod").ZodString>;
            shared_context: import("zod").ZodOptional<import("zod").ZodString>;
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            agent_name: string;
            bead_id: string;
            epic_id: string;
            subtask_title: string;
            files: string[];
            subtask_description?: string | undefined;
            shared_context?: string | undefined;
            project_path?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_spawn_subtask: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            subtask_title: import("zod").ZodString;
            subtask_description: import("zod").ZodOptional<import("zod").ZodString>;
            files: import("zod").ZodArray<import("zod").ZodString>;
            shared_context: import("zod").ZodOptional<import("zod").ZodString>;
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
            recovery_context: import("zod").ZodOptional<import("zod").ZodObject<{
                shared_context: import("zod").ZodOptional<import("zod").ZodString>;
                skills_to_load: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                coordinator_notes: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            model: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            bead_id: string;
            epic_id: string;
            subtask_title: string;
            files: string[];
            subtask_description?: string | undefined;
            shared_context?: string | undefined;
            project_path?: string | undefined;
            recovery_context?: {
                shared_context?: string | undefined;
                skills_to_load?: string[] | undefined;
                coordinator_notes?: string | undefined;
            } | undefined;
            model?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_spawn_researcher: {
        description: string;
        args: {
            research_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            tech_stack: import("zod").ZodArray<import("zod").ZodString>;
            project_path: import("zod").ZodString;
            check_upgrades: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            research_id: string;
            epic_id: string;
            tech_stack: string[];
            project_path: string;
            check_upgrades?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_spawn_retry: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            original_prompt: import("zod").ZodString;
            attempt: import("zod").ZodNumber;
            issues: import("zod").ZodString;
            diff: import("zod").ZodOptional<import("zod").ZodString>;
            files: import("zod").ZodArray<import("zod").ZodString>;
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            bead_id: string;
            epic_id: string;
            original_prompt: string;
            attempt: number;
            issues: string;
            files: string[];
            diff?: string | undefined;
            project_path?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_evaluation_prompt: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            subtask_title: import("zod").ZodString;
            files_touched: import("zod").ZodArray<import("zod").ZodString>;
        };
        execute(args: {
            bead_id: string;
            subtask_title: string;
            files_touched: string[];
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_plan_prompt: {
        description: string;
        args: {
            task: import("zod").ZodString;
            strategy: import("zod").ZodOptional<import("zod").ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                auto: "auto";
            }>>;
            context: import("zod").ZodOptional<import("zod").ZodString>;
            query_cass: import("zod").ZodOptional<import("zod").ZodBoolean>;
            cass_limit: import("zod").ZodOptional<import("zod").ZodNumber>;
            include_skills: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            task: string;
            strategy?: "file-based" | "feature-based" | "risk-based" | "auto" | undefined;
            context?: string | undefined;
            query_cass?: boolean | undefined;
            cass_limit?: number | undefined;
            include_skills?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_decompose: {
        description: string;
        args: {
            task: import("zod").ZodString;
            context: import("zod").ZodOptional<import("zod").ZodString>;
            query_cass: import("zod").ZodOptional<import("zod").ZodBoolean>;
            cass_limit: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            task: string;
            context?: string | undefined;
            query_cass?: boolean | undefined;
            cass_limit?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_validate_decomposition: {
        description: string;
        args: {
            response: import("zod").ZodString;
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
            task: import("zod").ZodOptional<import("zod").ZodString>;
            context: import("zod").ZodOptional<import("zod").ZodString>;
            strategy: import("zod").ZodOptional<import("zod").ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                auto: "auto";
            }>>;
            epic_id: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            response: string;
            project_path?: string | undefined;
            task?: string | undefined;
            context?: string | undefined;
            strategy?: "file-based" | "feature-based" | "risk-based" | "auto" | undefined;
            epic_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_delegate_planning: {
        description: string;
        args: {
            task: import("zod").ZodString;
            context: import("zod").ZodOptional<import("zod").ZodString>;
            strategy: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                auto: "auto";
            }>>>;
            query_cass: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
        };
        execute(args: {
            task: string;
            strategy: "file-based" | "feature-based" | "risk-based" | "auto";
            query_cass: boolean;
            context?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_plan_interactive: {
        description: string;
        args: {
            task: import("zod").ZodString;
            mode: import("zod").ZodDefault<import("zod").ZodEnum<{
                auto: "auto";
                socratic: "socratic";
                fast: "fast";
                "confirm-only": "confirm-only";
            }>>;
            context: import("zod").ZodOptional<import("zod").ZodString>;
            user_response: import("zod").ZodOptional<import("zod").ZodString>;
            phase: import("zod").ZodOptional<import("zod").ZodEnum<{
                ready: "ready";
                alternatives: "alternatives";
                questioning: "questioning";
                recommendation: "recommendation";
            }>>;
        };
        execute(args: {
            task: string;
            mode: "auto" | "socratic" | "fast" | "confirm-only";
            context?: string | undefined;
            user_response?: string | undefined;
            phase?: "ready" | "alternatives" | "questioning" | "recommendation" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarm_select_strategy: {
        description: string;
        args: {
            task: import("zod").ZodString;
            codebase_context: import("zod").ZodOptional<import("zod").ZodString>;
            projectKey: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            task: string;
            codebase_context?: string | undefined;
            projectKey?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly structured_extract_json: {
        description: string;
        args: {
            text: import("zod").ZodString;
        };
        execute(args: {
            text: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly structured_validate: {
        description: string;
        args: {
            response: import("zod").ZodString;
            schema_name: import("zod").ZodEnum<{
                evaluation: "evaluation";
                task_decomposition: "task_decomposition";
                cell_tree: "cell_tree";
            }>;
            max_retries: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            response: string;
            schema_name: "evaluation" | "task_decomposition" | "cell_tree";
            max_retries?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly structured_parse_evaluation: {
        description: string;
        args: {
            response: import("zod").ZodString;
        };
        execute(args: {
            response: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly structured_parse_decomposition: {
        description: string;
        args: {
            response: import("zod").ZodString;
        };
        execute(args: {
            response: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly structured_parse_cell_tree: {
        description: string;
        args: {
            response: import("zod").ZodString;
        };
        execute(args: {
            response: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarmmail_init: {
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
    readonly swarmmail_send: {
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
    readonly swarmmail_inbox: {
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
    readonly swarmmail_read_message: {
        description: string;
        args: {
            message_id: import("zod").ZodNumber;
        };
        execute(args: {
            message_id: number;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarmmail_reserve: {
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
    readonly swarmmail_release: {
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
    readonly swarmmail_release_all: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarmmail_release_agent: {
        description: string;
        args: {
            agent_name: import("zod").ZodString;
        };
        execute(args: {
            agent_name: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarmmail_ack: {
        description: string;
        args: {
            message_id: import("zod").ZodNumber;
        };
        execute(args: {
            message_id: number;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly swarmmail_health: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_create: {
        description: string;
        args: {
            title: import("zod").ZodString;
            type: import("zod").ZodOptional<import("zod").ZodEnum<{
                task: "task";
                bug: "bug";
                feature: "feature";
                epic: "epic";
                chore: "chore";
            }>>;
            priority: import("zod").ZodOptional<import("zod").ZodNumber>;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            parent_id: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            title: string;
            type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
            priority?: number | undefined;
            description?: string | undefined;
            parent_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_create_epic: {
        description: string;
        args: {
            epic_title: import("zod").ZodString;
            epic_description: import("zod").ZodOptional<import("zod").ZodString>;
            epic_id: import("zod").ZodOptional<import("zod").ZodString>;
            subtasks: import("zod").ZodArray<import("zod").ZodObject<{
                title: import("zod").ZodString;
                priority: import("zod").ZodOptional<import("zod").ZodNumber>;
                files: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                id_suffix: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            strategy: import("zod").ZodOptional<import("zod").ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
            }>>;
            task: import("zod").ZodOptional<import("zod").ZodString>;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
            recovery_context: import("zod").ZodOptional<import("zod").ZodObject<{
                shared_context: import("zod").ZodOptional<import("zod").ZodString>;
                skills_to_load: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                coordinator_notes: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
        };
        execute(args: {
            epic_title: string;
            subtasks: {
                title: string;
                priority?: number | undefined;
                files?: string[] | undefined;
                id_suffix?: string | undefined;
            }[];
            epic_description?: string | undefined;
            epic_id?: string | undefined;
            strategy?: "file-based" | "feature-based" | "risk-based" | undefined;
            task?: string | undefined;
            project_key?: string | undefined;
            recovery_context?: {
                shared_context?: string | undefined;
                skills_to_load?: string[] | undefined;
                coordinator_notes?: string | undefined;
            } | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_query: {
        description: string;
        args: {
            status: import("zod").ZodOptional<import("zod").ZodEnum<{
                open: "open";
                in_progress: "in_progress";
                blocked: "blocked";
                closed: "closed";
            }>>;
            type: import("zod").ZodOptional<import("zod").ZodEnum<{
                task: "task";
                bug: "bug";
                feature: "feature";
                epic: "epic";
                chore: "chore";
            }>>;
            ready: import("zod").ZodOptional<import("zod").ZodBoolean>;
            parent_id: import("zod").ZodOptional<import("zod").ZodString>;
            limit: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
            type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
            ready?: boolean | undefined;
            parent_id?: string | undefined;
            limit?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_update: {
        description: string;
        args: {
            id: import("zod").ZodString;
            status: import("zod").ZodOptional<import("zod").ZodEnum<{
                open: "open";
                in_progress: "in_progress";
                blocked: "blocked";
                closed: "closed";
            }>>;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            priority: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            id: string;
            status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
            description?: string | undefined;
            priority?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_close: {
        description: string;
        args: {
            id: import("zod").ZodString;
            reason: import("zod").ZodString;
            result: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            id: string;
            reason: string;
            result?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_start: {
        description: string;
        args: {
            id: import("zod").ZodString;
        };
        execute(args: {
            id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_ready: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_cells: {
        description: string;
        args: {
            id: import("zod").ZodOptional<import("zod").ZodString>;
            status: import("zod").ZodOptional<import("zod").ZodEnum<{
                open: "open";
                in_progress: "in_progress";
                blocked: "blocked";
                closed: "closed";
            }>>;
            type: import("zod").ZodOptional<import("zod").ZodEnum<{
                task: "task";
                bug: "bug";
                feature: "feature";
                epic: "epic";
                chore: "chore";
            }>>;
            parent_id: import("zod").ZodOptional<import("zod").ZodString>;
            ready: import("zod").ZodOptional<import("zod").ZodBoolean>;
            limit: import("zod").ZodOptional<import("zod").ZodNumber>;
            project_key: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            id?: string | undefined;
            status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
            type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
            parent_id?: string | undefined;
            ready?: boolean | undefined;
            limit?: number | undefined;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_projects: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_sync: {
        description: string;
        args: {
            auto_pull: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            auto_pull?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_link_thread: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            thread_id: import("zod").ZodString;
        };
        execute(args: {
            bead_id: string;
            thread_id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_session_start: {
        description: string;
        args: {
            active_cell_id: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            active_cell_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    readonly hive_session_end: {
        description: string;
        args: {
            handoff_notes: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            handoff_notes?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
/**
 * Type for CLI tool names (all available tools)
 */
export type CLIToolName = keyof typeof allTools;
/**
 * Re-export storage module
 *
 * Includes:
 * - createStorage, createStorageWithFallback - Factory functions
 * - getStorage, setStorage, resetStorage - Global instance management
 * - InMemoryStorage, SemanticMemoryStorage - Storage implementations
 * - isSemanticMemoryAvailable - Availability check
 * - DEFAULT_STORAGE_CONFIG - Default configuration
 *
 * Types:
 * - LearningStorage - Unified storage interface
 * - StorageConfig, StorageBackend, StorageCollections - Configuration types
 */
export { createStorage, createStorageWithFallback, getStorage, setStorage, resetStorage, InMemoryStorage, SemanticMemoryStorage, isSemanticMemoryAvailable, DEFAULT_STORAGE_CONFIG, type LearningStorage, type StorageConfig, type StorageBackend, type StorageCollections, } from "./storage";
/**
 * Re-export tool-availability module
 *
 * Includes:
 * - checkTool, isToolAvailable - Check individual tool availability
 * - checkAllTools - Check all tools at once
 * - withToolFallback, ifToolAvailable - Execute with graceful fallback
 * - formatToolAvailability - Format availability for display
 * - resetToolCache - Reset cached availability (for testing)
 *
 * Types:
 * - ToolName - Supported tool names
 * - ToolStatus, ToolAvailability - Status types
 */
export { checkTool, isToolAvailable, checkAllTools, getToolAvailability, withToolFallback, ifToolAvailable, warnMissingTool, requireTool, formatToolAvailability, resetToolCache, type ToolName, type ToolStatus, type ToolAvailability, } from "./tool-availability";
/**
 * Re-export repo-crawl module
 *
 * Includes:
 * - repoCrawlTools - All GitHub API repository research tools
 * - repo_readme, repo_structure, repo_tree, repo_file, repo_search - Individual tools
 * - RepoCrawlError - Error class
 *
 * Features:
 * - Parse repos from various formats (owner/repo, URLs)
 * - Optional GITHUB_TOKEN auth for higher rate limits (5000 vs 60 req/hour)
 * - Tech stack detection from file patterns
 * - Graceful rate limit handling
 */
export { repoCrawlTools, RepoCrawlError } from "./repo-crawl";
/**
 * Re-export skills module
 *
 * Implements Anthropic's Agent Skills specification for OpenCode.
 *
 * Includes:
 * - skillsTools - All skills tools (list, use, execute, read)
 * - discoverSkills, getSkill, listSkills - Discovery functions
 * - parseFrontmatter - YAML frontmatter parser
 * - getSkillsContextForSwarm - Swarm integration helper
 * - findRelevantSkills - Task-based skill matching
 *
 * Types:
 * - Skill, SkillMetadata, SkillRef - Skill data types
 */
export { skillsTools, discoverSkills, getSkill, listSkills, parseFrontmatter, setSkillsProjectDirectory, invalidateSkillsCache, getSkillsContextForSwarm, findRelevantSkills, type Skill, type SkillMetadata, type SkillRef, } from "./skills";
/**
 * Re-export mandates module
 *
 * Agent voting system for collaborative knowledge curation.
 *
 * Includes:
 * - mandateTools - All mandate tools (file, vote, query, list, stats)
 * - MandateError - Error class
 *
 * Features:
 * - Submit ideas, tips, lore, snippets, and feature requests
 * - Vote on entries (upvote/downvote) with 90-day decay
 * - Semantic search for relevant mandates
 * - Status transitions based on consensus (candidate → established → mandate)
 * - Persistent storage with semantic-memory
 *
 * Types:
 * - MandateEntry, Vote, MandateScore - Core data types
 * - MandateStatus, MandateContentType - Enum types
 */
export { mandateTools, MandateError } from "./mandates";
/**
 * Re-export mandate-storage module
 *
 * Includes:
 * - createMandateStorage - Factory function
 * - getMandateStorage, setMandateStorage, resetMandateStorage - Global instance management
 * - updateMandateStatus, updateAllMandateStatuses - Status update helpers
 * - InMemoryMandateStorage, SemanticMemoryMandateStorage - Storage implementations
 *
 * Types:
 * - MandateStorage - Unified storage interface
 * - MandateStorageConfig, MandateStorageBackend, MandateStorageCollections - Configuration types
 */
export { createMandateStorage, getMandateStorage, setMandateStorage, resetMandateStorage, updateMandateStatus, updateAllMandateStatuses, InMemoryMandateStorage, SemanticMemoryMandateStorage, DEFAULT_MANDATE_STORAGE_CONFIG, type MandateStorage, type MandateStorageConfig, type MandateStorageBackend, type MandateStorageCollections, } from "./mandate-storage";
/**
 * Re-export mandate-promotion module
 *
 * Includes:
 * - evaluatePromotion - Evaluate status transitions
 * - shouldPromote - Determine new status based on score
 * - formatPromotionResult - Format promotion result for display
 * - evaluateBatchPromotions, getStatusChanges, groupByTransition - Batch helpers
 *
 * Types:
 * - PromotionResult - Promotion evaluation result
 */
export { evaluatePromotion, shouldPromote, formatPromotionResult, evaluateBatchPromotions, getStatusChanges, groupByTransition, type PromotionResult, } from "./mandate-promotion";
/**
 * Re-export output-guardrails module
 *
 * Includes:
 * - guardrailOutput - Main entry point for truncating tool output
 * - truncateWithBoundaries - Smart truncation preserving structure
 * - getToolLimit - Get character limit for a tool
 * - DEFAULT_GUARDRAIL_CONFIG - Default configuration
 *
 * Types:
 * - GuardrailConfig - Configuration interface
 * - GuardrailResult - Result of guardrail processing
 * - GuardrailMetrics - Analytics data
 */
export { guardrailOutput, truncateWithBoundaries, createMetrics, DEFAULT_GUARDRAIL_CONFIG, type GuardrailConfig, type GuardrailResult, type GuardrailMetrics, } from "./output-guardrails";
/**
 * Re-export compaction-hook module
 *
 * Includes:
 * - SWARM_COMPACTION_CONTEXT - Prompt text for swarm state preservation
 * - createCompactionHook - Factory function for the compaction hook
 * - scanSessionMessages - Scan session for swarm state
 * - ScannedSwarmState - Scanned state interface
 *
 * Usage:
 * ```typescript
 * import { createCompactionHook } from "opencode-swarm-plugin";
 *
 * const hooks = {
 *   "experimental.session.compacting": createCompactionHook(),
 * };
 * ```
 */
export { SWARM_COMPACTION_CONTEXT, createCompactionHook, scanSessionMessages, type ScannedSwarmState, } from "./compaction-hook";
/**
 * Re-export compaction-observability module
 *
 * Includes:
 * - CompactionPhase - Enum of compaction phases
 * - createMetricsCollector - Create a metrics collector
 * - recordPhaseStart, recordPhaseComplete - Phase timing
 * - recordPatternExtracted, recordPatternSkipped - Pattern tracking
 * - getMetricsSummary - Get metrics summary
 *
 * Types:
 * - CompactionMetrics - Mutable metrics collector
 * - CompactionMetricsSummary - Read-only summary snapshot
 *
 * Features:
 * - Phase timing breakdown (START, GATHER, DETECT, INJECT, COMPLETE)
 * - Pattern extraction tracking with reasons
 * - Success rate calculation
 * - Debug mode for verbose details
 * - JSON serializable for persistence
 *
 * Usage:
 * ```typescript
 * import { createMetricsCollector, CompactionPhase, recordPhaseStart } from "opencode-swarm-plugin";
 *
 * const metrics = createMetricsCollector({ session_id: "abc123" });
 * recordPhaseStart(metrics, CompactionPhase.DETECT);
 * // ... work ...
 * recordPhaseComplete(metrics, CompactionPhase.DETECT);
 * const summary = getMetricsSummary(metrics);
 * ```
 */
export { CompactionPhase, createMetricsCollector, recordPhaseStart, recordPhaseComplete, recordPatternExtracted, recordPatternSkipped, getMetricsSummary, type CompactionMetrics, type CompactionMetricsSummary, } from "./compaction-observability";
/**
 * Re-export memory module
 *
 * Includes:
 * - memoryTools - All semantic-memory tools (store, find, get, remove, validate, list, stats, check)
 * - createMemoryAdapter - Factory function for memory adapter
 * - resetMemoryCache - Cache management for testing
 *
 * Types:
 * - MemoryAdapter - Memory adapter interface
 * - StoreArgs, FindArgs, IdArgs, ListArgs - Tool argument types
 * - StoreResult, FindResult, StatsResult, HealthResult, OperationResult - Result types
 */
export { memoryTools, createMemoryAdapter, resetMemoryCache, type MemoryAdapter, type StoreArgs, type FindArgs, type IdArgs, type ListArgs, type StoreResult, type FindResult, type StatsResult, type HealthResult, type OperationResult, } from "./memory-tools";
export type { Memory, SearchResult, SearchOptions } from "swarm-mail";
/**
 * Re-export eval-history module
 *
 * Includes:
 * - recordEvalRun - Record eval run to JSONL history
 * - getScoreHistory - Get score history for a specific eval
 * - getPhase - Get current phase based on run count and variance
 * - calculateVariance - Calculate statistical variance of scores
 * - ensureEvalHistoryDir - Ensure history directory exists
 * - getEvalHistoryPath - Get path to eval history file
 *
 * Constants:
 * - DEFAULT_EVAL_HISTORY_PATH - Default path (.opencode/eval-history.jsonl)
 * - VARIANCE_THRESHOLD - Variance threshold for production phase (0.1)
 * - BOOTSTRAP_THRESHOLD - Run count for bootstrap phase (10)
 * - STABILIZATION_THRESHOLD - Run count for stabilization phase (50)
 *
 * Types:
 * - Phase - Progressive phases (bootstrap | stabilization | production)
 * - EvalRunRecord - Single eval run record
 */
export { recordEvalRun, getScoreHistory, getPhase, calculateVariance, ensureEvalHistoryDir, getEvalHistoryPath, DEFAULT_EVAL_HISTORY_PATH, VARIANCE_THRESHOLD, BOOTSTRAP_THRESHOLD, STABILIZATION_THRESHOLD, type Phase, type EvalRunRecord, } from "./eval-history";
/**
 * Re-export eval-gates module
 *
 * Includes:
 * - checkGate - Check if current score passes quality gate
 * - DEFAULT_THRESHOLDS - Default regression thresholds by phase
 *
 * Types:
 * - GateResult - Result from gate check
 * - GateConfig - Configuration for gate thresholds
 *
 * Features:
 * - Phase-based regression thresholds (Bootstrap: none, Stabilization: 10%, Production: 5%)
 * - Configurable thresholds via GateConfig
 * - Clear pass/fail messages with baseline comparison
 * - Handles edge cases (division by zero, no history)
 */
export { checkGate, DEFAULT_THRESHOLDS, type GateResult, type GateConfig, } from "./eval-gates";
/**
 * Re-export logger infrastructure
 *
 * Includes:
 * - getLogger - Gets or creates the main logger instance
 * - createChildLogger - Creates a module-specific child logger with separate log file
 * - logger - Default logger instance for immediate use
 *
 * Features:
 * - Default: stdout JSON logging (works everywhere)
 * - File logging: SWARM_LOG_FILE=1 writes to ~/.config/swarm-tools/logs/
 * - Module-specific child loggers
 * - For pretty output: pipe to pino-pretty (`swarm ... | npx pino-pretty`)
 *
 * @example
 * ```typescript
 * import { logger, createChildLogger } from "opencode-swarm-plugin";
 *
 * // Use default logger
 * logger.info("Application started");
 *
 * // Create module-specific logger
 * const compactionLog = createChildLogger("compaction");
 * compactionLog.info("Compaction started");
 * ```
 */
export { getLogger, createChildLogger, logger } from "./logger";
/**
 * Re-export swarm-research module
 *
 * Includes:
 * - discoverDocTools - Discover available documentation tools
 * - getInstalledVersions - Get installed package versions from lockfile
 * - researchTools - Plugin tools for tool discovery and version detection
 *
 * Types:
 * - DiscoveredTool - Tool discovery result interface
 * - VersionInfo - Package version information
 */
export { discoverDocTools, getInstalledVersions, researchTools, type DiscoveredTool, type VersionInfo, } from "./swarm-research";
/**
 * Re-export queue-tools module
 *
 * BullMQ-based queue management tools for background job processing.
 *
 * Includes:
 * - queueTools - All queue tools (submit, status, list, cancel)
 * - queue_submit - Submit job with type, payload, priority, delay, attempts
 * - queue_status - Get job status by ID
 * - queue_list - List jobs by state (waiting, active, completed, failed, delayed)
 * - queue_cancel - Cancel/remove job by ID
 * - resetQueueCache - Reset queue cache (for testing)
 *
 * Features:
 * - Submit jobs with priority, delay, and retry options
 * - Query job status and progress
 * - List jobs by state with metrics
 * - Cancel jobs in any state
 * - Event emission for observability
 * - Graceful connection management
 */
export { queueTools, queue_submit, queue_status, queue_list, queue_cancel, resetQueueCache, } from "./queue-tools";
/**
 * Re-export swarm-validation module
 *
 * Provides validation event types and hooks for post-swarm validation.
 * Integrates with swarm-mail event sourcing to emit validation events.
 *
 * Includes:
 * - ValidationIssueSeverity - Zod schema for severity levels (error, warning, info)
 * - ValidationIssueCategory - Zod schema for issue categories
 * - ValidationIssueSchema - Zod schema for validation issues
 * - runPostSwarmValidation - Main validation hook
 * - reportIssue - Helper to emit validation_issue events
 *
 * Types:
 * - ValidationIssue - Validation issue with severity, category, message, and optional location
 * - ValidationContext - Context for validation execution
 */
export { ValidationIssueSeverity, ValidationIssueCategory, ValidationIssueSchema, runPostSwarmValidation, reportIssue, type ValidationIssue, type ValidationContext, } from "./swarm-validation";
/**
 * Swarm Signature Detection
 *
 * Deterministic, algorithmic detection of swarm coordination from session events.
 * No heuristics, no confidence levels - a swarm either exists or it doesn't.
 *
 * A SWARM is defined by this event sequence:
 * 1. hive_create_epic(epic_title, subtasks[]) → epic_id
 * 2. swarm_spawn_subtask(bead_id, epic_id, ...) → prompt (at least one)
 *
 * The projection folds over events to produce ground truth state:
 * - Which epic is being coordinated
 * - Which subtasks exist and their lifecycle status
 * - What files are assigned to each subtask
 *
 * Functions:
 * - projectSwarmState - Fold over events to produce swarm state
 * - hasSwarmSignature - Quick check for swarm signature
 * - isSwarmActive - Check if swarm has pending work
 * - getSwarmSummary - Human-readable status summary
 *
 * Types:
 * - SwarmProjection - Complete swarm state from event projection
 * - ToolCallEvent - Tool call event from session messages
 * - SubtaskState - Subtask lifecycle state
 * - EpicState - Epic state
 */
export { projectSwarmState, hasSwarmSignature, isSwarmActive, getSwarmSummary, type SwarmProjection, type ToolCallEvent, type SubtaskState, type SubtaskStatus, type EpicState, } from "./swarm-signature";
/**
 * Coordinator Guard - Runtime Violation Enforcement
 *
 * Detects and REJECTS coordinator protocol violations at runtime.
 * Unlike planning-guardrails (which only warns), the coordinator guard throws errors
 * to prevent coordinators from performing work that should be delegated to workers.
 *
 * Functions:
 * - checkCoordinatorGuard - Main entry point for guard checks
 * - isCoordinator - Type guard for coordinator context
 *
 * Types:
 * - CoordinatorGuardError - Custom error with violation details
 * - GuardCheckResult - Result of guard check
 */
export { checkCoordinatorGuard, isCoordinator, CoordinatorGuardError, type GuardCheckResult, } from "./coordinator-guard";
/**
 * Re-export CASS tools module
 *
 * Cross-Agent Session Search - search across all AI coding agent histories.
 * Wraps the external `cass` CLI from Dicklesworthstone's repo.
 *
 * Includes:
 * - cassTools - All CASS tools (search, view, expand, health, index, stats)
 * - cass_search - Search across agent histories
 * - cass_view - View specific session
 * - cass_expand - Expand context around a line
 * - cass_health - Check index health
 * - cass_index - Build/rebuild index
 * - cass_stats - Show index statistics
 *
 * Events emitted:
 * - cass_searched - When a search is performed
 * - cass_viewed - When a session is viewed
 * - cass_indexed - When the index is built/rebuilt
 */
export { cassTools } from "./cass-tools";
//# sourceMappingURL=index.d.ts.map