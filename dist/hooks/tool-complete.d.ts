/**
 * Tool Complete Hook Handler
 *
 * Dispatches PostToolUse hooks for hooked tools.
 * Provides observability into tool execution without blocking the main flow.
 */
/**
 * Input data for tool hook handlers.
 */
export interface ToolHookInput {
    /** Name of the tool that was executed */
    tool: string;
    /** OpenCode session ID */
    sessionID: string;
    /** Unique identifier for this tool call */
    callID: string;
}
/**
 * Output data from tool execution.
 */
export interface ToolHookOutput {
    /** Human-readable title for the result */
    title?: string;
    /** Raw output from the tool (often JSON) */
    output?: string;
    /** Additional metadata about the execution */
    metadata?: Record<string, unknown>;
}
/**
 * Main handler for tool completion hooks.
 * Dispatches to specific handlers based on tool name.
 *
 * @param toolName - Name of the tool that was executed
 * @param input - Input data for the hook
 * @param output - Output data from the tool
 *
 * @remarks
 * - Non-hooked tools are ignored (returns immediately)
 * - Hooked tools without specific handlers get default logging
 * - Errors are caught and logged but never thrown (hooks shouldn't break tool execution)
 *
 * @example
 * ```typescript
 * await handleToolComplete("hive_create", {
 *   tool: "hive_create",
 *   sessionID: "abc123",
 *   callID: "call-456"
 * }, {
 *   output: JSON.stringify({ id: "cell-789", title: "New Task" })
 * });
 * ```
 */
export declare function handleToolComplete(toolName: string, input: ToolHookInput, output: ToolHookOutput): Promise<void>;
//# sourceMappingURL=tool-complete.d.ts.map