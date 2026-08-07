/**
 * Contributor Tools - GitHub profile extraction for changeset credits
 *
 * Provides contributor_lookup tool for fetching GitHub profiles and
 * generating formatted changeset credit lines. Automatically stores
 * contributor info in semantic-memory for future reference.
 *
 * Based on patterns from gh-issue-triage skill.
 */
import { z } from "zod";
/**
 * Reset cache for testing
 */
export declare function resetContributorCache(): void;
/**
 * Look up GitHub contributor and generate changeset credit
 */
export declare const contributor_lookup: {
    description: string;
    args: {
        login: z.ZodString;
        issue: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        login: string;
        issue?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export declare const contributorTools: {
    readonly contributor_lookup: {
        description: string;
        args: {
            login: z.ZodString;
            issue: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            login: string;
            issue?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=contributor-tools.d.ts.map