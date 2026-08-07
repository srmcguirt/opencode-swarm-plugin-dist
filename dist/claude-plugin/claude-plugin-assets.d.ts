export type ClaudePluginAssetCopyOptions = {
    packageRoot: string;
    distRoot?: string;
    pluginRoot?: string;
};
/**
 * Ensure the committed MCP entrypoint matches the latest build output.
 */
export declare function assertClaudePluginMcpEntrypointSynced({ packageRoot, distRoot, pluginRoot, }: ClaudePluginAssetCopyOptions): void;
/**
 * Copy compiled runtime assets into the Claude plugin root.
 *
 * For the marketplace plugin, we use dist/marketplace/index.js which bundles
 * swarm-mail since the marketplace has no node_modules.
 */
export declare function copyClaudePluginRuntimeAssets({ packageRoot, distRoot, pluginRoot, }: ClaudePluginAssetCopyOptions): void;
//# sourceMappingURL=claude-plugin-assets.d.ts.map