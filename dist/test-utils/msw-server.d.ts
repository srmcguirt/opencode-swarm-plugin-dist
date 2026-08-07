/**
 * Generate a deterministic 1024-dim embedding from text using bag-of-words hashing.
 * Tokens that overlap between texts produce overlapping dimensions → positive cosine similarity.
 * This replaces real Ollama calls (network + GPU) with pure computation (~0ms).
 */
export declare function fakeDeterministicEmbedding(text: string): number[];
export declare const ollamaHandlers: import("msw").HttpHandler[];
/**
 * Creates MSW handlers for the Agent Mail MCP server at 127.0.0.1:8765.
 *
 * @param requests - Mutable array to track intercepted requests (tool name + args)
 * @param toolResponses - Map of tool name → response body to return
 * @returns Array of MSW handlers (MCP endpoint + health check)
 */
export declare function createAgentMailHandlers(requests: Array<{
    tool: string;
    args: Record<string, unknown>;
}>, toolResponses?: Record<string, unknown>): import("msw").HttpHandler[];
/** Shared MSW server with Ollama handlers pre-configured. */
export declare const server: import("msw/node").SetupServerApi;
//# sourceMappingURL=msw-server.d.ts.map