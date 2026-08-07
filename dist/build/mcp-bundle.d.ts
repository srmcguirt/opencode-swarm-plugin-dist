export declare const MCP_ENTRY_RELATIVE_PATH: string;
export declare const MCP_BUNDLE_RELATIVE_PATH: string;
export type McpBundlePaths = {
    pluginRoot: string;
    entryPath: string;
    bundlePath: string;
    bundleDir: string;
};
/**
 * Resolve the entry + output paths for the bundled MCP server.
 */
export declare function resolveMcpBundlePaths({ packageRoot, pluginRoot, }?: {
    packageRoot?: string;
    pluginRoot?: string;
}): McpBundlePaths;
//# sourceMappingURL=mcp-bundle.d.ts.map