/**
 * Output Guardrails for MCP Tool Response Truncation
 *
 * Prevents MCP tools from blowing out context with massive responses.
 * Provides smart truncation that preserves JSON, code blocks, and markdown structure.
 *
 * @module output-guardrails
 *
 * @example
 * ```typescript
 * import { guardrailOutput, DEFAULT_GUARDRAIL_CONFIG } from "./output-guardrails"
 *
 * const result = guardrailOutput("context7_get-library-docs", hugeOutput)
 * if (result.truncated) {
 *   console.log(`Truncated ${result.originalLength - result.truncatedLength} chars`)
 * }
 * ```
 */
/**
 * Guardrail configuration for tool output limits
 *
 * Controls per-tool character limits and skip rules.
 */
export interface GuardrailConfig {
    /**
     * Default max characters for tool output
     * Default: 32000 chars (~8000 tokens at 4 chars/token)
     */
    defaultMaxChars: number;
    /**
     * Per-tool character limit overrides
     *
     * Higher limits for code/doc tools that commonly return large outputs.
     */
    toolLimits: Record<string, number>;
    /**
     * Tools that should never be truncated
     *
     * Internal coordination tools (beads_*, swarmmail_*, structured_*)
     * should always return complete output.
     */
    skipTools: string[];
}
/**
 * Result of guardrail output processing
 */
export interface GuardrailResult {
    /** Processed output (truncated if needed) */
    output: string;
    /** Whether truncation occurred */
    truncated: boolean;
    /** Original output length in characters */
    originalLength: number;
    /** Final output length in characters */
    truncatedLength: number;
}
/**
 * Metrics for guardrail analytics
 *
 * Used to track truncation patterns and adjust limits.
 */
export interface GuardrailMetrics {
    /** Tool that produced the output */
    toolName: string;
    /** Original output length */
    originalLength: number;
    /** Truncated output length */
    truncatedLength: number;
    /** Timestamp of truncation */
    timestamp: number;
}
/**
 * Default guardrail configuration
 *
 * - defaultMaxChars: 32000 (~8000 tokens)
 * - Higher limits for code/doc tools (64000)
 * - Skip internal coordination tools
 */
export declare const DEFAULT_GUARDRAIL_CONFIG: GuardrailConfig;
/**
 * Smart truncation preserving structure boundaries
 *
 * Truncates text while preserving:
 * - JSON structure (finds matching braces, doesn't cut mid-object)
 * - Code blocks (preserves ``` boundaries)
 * - Markdown headers (cuts at ## boundaries when possible)
 *
 * @param text - Text to truncate
 * @param maxChars - Maximum character count
 * @returns Truncated text with "[TRUNCATED - X chars removed]" suffix
 */
export declare function truncateWithBoundaries(text: string, maxChars: number): string;
/**
 * Apply guardrails to tool output
 *
 * Main entry point for guardrail processing:
 * 1. Check if tool is in skipTools → return unchanged
 * 2. Check if output.length > getToolLimit(toolName) → truncate
 * 3. Return { output, truncated, originalLength, truncatedLength }
 *
 * @param toolName - Name of the tool that produced the output
 * @param output - Tool output to process
 * @param config - Optional guardrail configuration (defaults to DEFAULT_GUARDRAIL_CONFIG)
 * @returns Guardrail result with truncated output and metadata
 *
 * @example
 * ```typescript
 * const result = guardrailOutput("context7_get-library-docs", hugeOutput)
 * console.log(result.output)  // Truncated or original
 * console.log(result.truncated)  // true if truncated
 * console.log(`${result.originalLength} → ${result.truncatedLength} chars`)
 * ```
 */
export declare function guardrailOutput(toolName: string, output: string, config?: GuardrailConfig): GuardrailResult;
/**
 * Create a guardrail metrics entry
 *
 * Used for analytics and learning about truncation patterns.
 *
 * @param result - Guardrail result from guardrailOutput
 * @param toolName - Name of the tool
 * @returns Metrics entry
 */
export declare function createMetrics(result: GuardrailResult, toolName: string): GuardrailMetrics;
//# sourceMappingURL=output-guardrails.d.ts.map