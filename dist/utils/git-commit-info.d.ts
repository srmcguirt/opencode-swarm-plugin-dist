export interface GitCommitInfo {
    sha: string;
    message: string;
    branch: string;
}
/**
 * Get current git commit info. Returns null if not in a git repo or on error.
 */
export declare function getGitCommitInfo(cwd?: string): GitCommitInfo | null;
//# sourceMappingURL=git-commit-info.d.ts.map