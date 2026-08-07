/**
 * Agent Discovery Module
 *
 * Maps file paths to agent types using pattern matching.
 * Supports cross-platform paths (Unix and Windows).
 *
 * @module sessions/agent-discovery
 */
/**
 * Agent type identifier
 */
export type AgentType = "opencode-swarm" | "cursor" | "opencode" | "claude" | "aider";
/**
 * Configuration for custom agent patterns
 */
interface AgentPatternConfig {
    /** Pattern string (will be converted to RegExp) */
    pattern: string;
    /** Agent type identifier */
    agentType: AgentType;
}
/**
 * Load custom agent patterns from config
 *
 * @param patterns - Array of custom pattern configurations
 * @returns Number of patterns loaded
 *
 * @example
 * ```typescript
 * loadAgentPatterns([
 *   { pattern: "\\.codex[/\\\\]", agentType: "codex" },
 *   { pattern: "\\.gemini[/\\\\]", agentType: "gemini" }
 * ]);
 * ```
 */
export declare function loadAgentPatterns(patterns: AgentPatternConfig[]): number;
/**
 * Reset agent patterns to defaults
 * Useful for testing
 */
export declare function resetAgentPatterns(): void;
/**
 * Detect agent type from file path
 *
 * @param filePath - Absolute or relative file path (Unix or Windows)
 * @returns Agent type identifier, or null if unknown
 *
 * @example
 * ```typescript
 * detectAgentType("/home/user/.config/swarm-tools/sessions/ses_123.jsonl")
 * // => "opencode-swarm"
 *
 * detectAgentType("/tmp/random.jsonl")
 * // => null
 * ```
 */
export declare function detectAgentType(filePath: string): AgentType | null;
export {};
//# sourceMappingURL=agent-discovery.d.ts.map