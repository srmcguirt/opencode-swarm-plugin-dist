/**
 * Swarm-Aware Compaction Hook
 *
 * Provides context preservation during OpenCode session compaction.
 * When context is compacted, this hook injects instructions for the summarizer
 * to preserve swarm coordination state and enable seamless resumption.
 *
 * ## Philosophy: Err on the Side of Continuation
 *
 * It's better to inject swarm context unnecessarily than to lose an active swarm.
 * The cost of a false positive (extra context) is low.
 * The cost of a false negative (lost swarm) is high - wasted work, confused agents.
 *
 * Hook signature (from @opencode-ai/plugin):
 * ```typescript
 * "experimental.session.compacting"?: (
 *   input: { sessionID: string },
 *   output: { context: string[] }
 * ) => Promise<void>
 * ```
 *
 * @example
 * ```typescript
 * import { SWARM_COMPACTION_CONTEXT, createCompactionHook } from "opencode-swarm-plugin";
 *
 * const hooks: Hooks = {
 *   "experimental.session.compacting": createCompactionHook(),
 * };
 * ```
 */
/**
 * Swarm-aware compaction context
 *
 * Injected during compaction to keep the swarm cooking. The coordinator should
 * wake up from compaction and immediately resume orchestration - spawning agents,
 * monitoring progress, unblocking work.
 *
 * This is NOT about preserving state for a human - it's about the swarm continuing
 * autonomously after context compression.
 *
 * Structure optimized for eval scores:
 * 1. ASCII header (visual anchor, coordinatorIdentity scorer)
 * 2. What Good Looks Like (behavioral examples, outcome-focused)
 * 3. Immediate actions (actionable tool calls, postCompactionDiscipline scorer)
 * 4. Forbidden tools (explicit list, forbiddenToolsPresent scorer)
 * 5. Mandatory behaviors (inbox, skills, review)
 * 6. Role & mandates (strong language, coordinatorIdentity scorer)
 * 7. Reference sections (supporting material)
 */
export declare const SWARM_COMPACTION_CONTEXT: string;
/**
 * Fallback detection prompt - tells the compactor what to look for
 *
 * Used when we can't definitively detect a swarm but want to be safe.
 * The compactor can check the conversation context for these patterns.
 */
export declare const SWARM_DETECTION_FALLBACK = "## \uD83D\uDC1D Swarm Detection - Check Your Context\n\n**IMPORTANT:** Before summarizing, check if this session involves an active swarm.\n\nLook for ANY of these patterns in the conversation:\n\n### Tool Calls (definite swarm sign)\n- `swarm_decompose`, `swarm_spawn_subtask`, `swarm_status`, `swarm_complete`\n- `swarmmail_init`, `swarmmail_reserve`, `swarmmail_send`\n- `hive_create_epic`, `hive_start`, `hive_close`\n\n### IDs and Names\n- Cell IDs: `bd-xxx`, `bd-xxx.N` (subtask format)\n- Agent names: BlueLake, RedMountain, GreenValley, etc.\n- Epic references: \"epic\", \"subtask\", \"parent\"\n\n### Coordination Language\n- \"spawn\", \"worker\", \"coordinator\"\n- \"reserve\", \"reservation\", \"files\"\n- \"blocked\", \"unblock\", \"dependency\"\n- \"progress\", \"complete\", \"in_progress\"\n\n### If You Find Swarm Evidence\n\nInclude this in your summary:\n1. Epic ID and title\n2. Project path\n3. Subtask status (running/blocked/done/pending)\n4. Any blockers or issues\n5. What should happen next\n\n**Then tell the resumed session:**\n\"This is an active swarm. Check swarm_status and swarmmail_inbox immediately.\"\n";
/**
 * SDK Client type (minimal interface for scanSessionMessages)
 *
 * The actual SDK client uses a more complex Options-based API:
 * client.session.messages({ path: { id: sessionID }, query: { limit } })
 *
 * We accept `unknown` and handle the type internally to avoid
 * tight coupling to SDK internals.
 */
export type OpencodeClient = unknown;
/**
 * Scanned swarm state extracted from session messages
 */
export interface ScannedSwarmState {
    epicId?: string;
    epicTitle?: string;
    projectPath?: string;
    agentName?: string;
    subtasks: Map<string, {
        title: string;
        status: string;
        worker?: string;
        files?: string[];
    }>;
    lastAction?: {
        tool: string;
        args: unknown;
        timestamp: number;
    };
}
/**
 * Scan session messages for swarm state using SDK client
 *
 * Extracts swarm coordination state from actual tool calls:
 * - swarm_spawn_subtask → subtask tracking
 * - swarmmail_init → agent name, project path
 * - hive_create_epic → epic ID and title
 * - swarm_status → epic reference
 * - swarm_complete → subtask completion
 *
 * @param client - OpenCode SDK client (undefined if not available)
 * @param sessionID - Session to scan
 * @param limit - Max messages to fetch (default 100)
 * @returns Extracted swarm state
 */
export declare function scanSessionMessages(client: OpencodeClient, sessionID: string, limit?: number): Promise<ScannedSwarmState>;
/**
 * Options for creating a compaction hook with dependency injection
 */
export interface CompactionHookOptions {
    /** Optional OpenCode SDK client for scanning session messages */
    client?: OpencodeClient;
    /** Custom getHiveAdapter function (for testing) */
    getHiveAdapter?: (projectKey: string) => Promise<{
        queryCells: (projectKey: string, filters: Record<string, unknown>) => Promise<Array<{
            id: string;
            title?: string;
            type: string;
            status: string;
            parent_id: string | null;
            updated_at: number;
        }>>;
    }>;
    /** Custom checkSwarmHealth function (for testing) */
    checkSwarmHealth?: (projectKey?: string) => Promise<{
        healthy: boolean;
        database: "connected" | "disconnected";
        stats?: {
            events: number;
            agents: number;
            messages: number;
            reservations: number;
        };
    }>;
    /** Custom getHiveWorkingDirectory function (for testing) */
    getHiveWorkingDirectory?: () => string;
    /** Custom logger instance (for testing) */
    logger?: {
        info: (data: unknown, message?: string) => void;
        debug: (data: unknown, message?: string) => void;
        warn: (data: unknown, message?: string) => void;
        error: (data: unknown, message?: string) => void;
    };
}
/**
 * Create the compaction hook for use in plugin registration
 *
 * Injects swarm context based on detection confidence:
 * - HIGH/MEDIUM: Full swarm context (definitely/probably a swarm)
 * - LOW: Fallback detection prompt (let compactor check context)
 * - NONE: No injection (probably not a swarm)
 *
 * Philosophy: Err on the side of continuation. A false positive costs
 * a bit of context space. A false negative loses the swarm.
 *
 * @param options - Configuration options including SDK client and dependency injection hooks
 *
 * @example
 * ```typescript
 * import { createCompactionHook } from "opencode-swarm-plugin";
 *
 * export const SwarmPlugin: Plugin = async (input) => ({
 *   tool: { ... },
 *   "experimental.session.compacting": createCompactionHook({ client: input.client }),
 * });
 * ```
 *
 * @example Testing with custom dependencies
 * ```typescript
 * const hook = createCompactionHook({
 *   getHiveAdapter: async () => mockAdapter,
 *   checkSwarmHealth: async () => mockHealth,
 * });
 * ```
 */
export declare function createCompactionHook(options?: OpencodeClient | CompactionHookOptions): (input: {
    sessionID: string;
}, output: {
    context: string[];
}) => Promise<void>;
//# sourceMappingURL=compaction-hook.d.ts.map