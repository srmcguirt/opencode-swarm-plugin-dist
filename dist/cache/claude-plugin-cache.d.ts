export type McpServerConfig = {
    command: string;
    args: string[];
    cwd?: string;
    description?: string;
};
export type McpConfig = {
    mcpServers: Record<string, McpServerConfig>;
};
export type ClaudePluginCachePaths = {
    cacheRoot: string;
    mcpServerPath: string;
    mcpConfigPath: string;
};
export declare const CLAUDE_PLUGIN_ROOT_TOKEN = "${CLAUDE_PLUGIN_ROOT}";
export declare const SWARM_MCP_SERVER_NAME = "swarm-tools";
/**
 * Resolve where cached Claude plugin assets should live.
 */
export declare function resolveClaudePluginCachePaths({ cacheRoot, }?: {
    cacheRoot?: string;
}): ClaudePluginCachePaths;
/**
 * Create the MCP config for a cached Claude plugin bundle.
 */
export declare function createClaudePluginCacheMcpConfig({ pluginRootToken, command, description, }?: {
    pluginRootToken?: string;
    command?: string;
    description?: string;
}): McpConfig;
/**
 * Describe the cached Claude plugin entrypoints for bundling.
 */
export declare function resolveClaudePluginCacheBundleSpec({ cacheRoot, pluginRoot, }?: {
    cacheRoot?: string;
    pluginRoot?: string;
}): {
    entryPath: string;
    bundlePath: string;
};
//# sourceMappingURL=claude-plugin-cache.d.ts.map