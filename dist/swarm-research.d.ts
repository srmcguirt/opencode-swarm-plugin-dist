/**
 * Swarm Research Module - Tool discovery for documentation researchers
 *
 * Provides runtime detection of available documentation tools:
 * - Skills (via skills_list)
 * - MCP servers (next-devtools, context7, fetch, pdf-brain)
 *
 * Researchers use this to discover HOW to fetch docs.
 * Coordinators provide WHAT to research (tech stack).
 *
 * @module swarm-research
 */
/**
 * Version information for an installed package
 */
export interface VersionInfo {
    /** Package name */
    name: string;
    /** Installed version (semver) */
    version: string;
    /** Where version was discovered */
    source: "lockfile" | "package.json";
    /** Original constraint from package.json (e.g., "^1.2.3") */
    constraint?: string;
    /** Latest version from npm registry (only if checkUpgrades=true) */
    latest?: string;
    /** Whether an update is available (version !== latest) */
    updateAvailable?: boolean;
}
/**
 * Discovered tool with capabilities
 */
export interface DiscoveredTool {
    /** Tool name */
    name: string;
    /** Tool type: skill, MCP server, or CLI */
    type: "skill" | "mcp" | "cli";
    /** What this tool can do */
    capabilities: string[];
    /** Whether tool is available in this environment */
    available: boolean;
}
/**
 * Fetch latest version of a package from npm registry
 *
 * Uses npm registry API: https://registry.npmjs.org/{package}/latest
 *
 * @param packageName - Package name (supports scoped packages like @types/node)
 * @returns Latest version string, or undefined if fetch fails
 */
export declare function getLatestVersion(packageName: string): Promise<string | undefined>;
/**
 * Get installed versions of packages from lockfile (preferred) or package.json
 *
 * Detection order:
 * 1. package-lock.json (npm)
 * 2. pnpm-lock.yaml (pnpm)
 * 3. yarn.lock (yarn)
 * 4. bun.lock → fallback to package.json (bun lockfile is binary)
 * 5. package.json (fallback)
 *
 * @param projectPath - Absolute path to project root
 * @param packages - Package names to look up
 * @param checkUpgrades - If true, fetch latest versions from npm registry and compare
 * @returns Array of version info for found packages
 */
export declare function getInstalledVersions(projectPath: string, packages: string[], checkUpgrades?: boolean): Promise<VersionInfo[]>;
/**
 * Discover available documentation tools
 *
 * Checks for:
 * - Skills (via skills discovery)
 * - MCP servers (next-devtools, context7, fetch, pdf-brain)
 *
 * @returns List of discovered tools with availability status
 */
export declare function discoverDocTools(): Promise<DiscoveredTool[]>;
/**
 * Plugin tool for discovering available documentation tools
 */
export declare const swarm_discover_tools: {
    description: string;
    args: {};
    execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Plugin tool for getting installed package versions
 */
export declare const swarm_get_versions: {
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
/**
 * Research tools for plugin registration
 */
export declare const researchTools: {
    swarm_discover_tools: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_get_versions: {
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
};
//# sourceMappingURL=swarm-research.d.ts.map