/**
 * Per-project opencode.json config bootstrap.
 *
 * Points a project's opencode agent config at its hive-data mirror
 * (`~/hive-data/repos/<slug>/AGENTS.md` and `memories.jsonl`, plus
 * `~/hive-data/global/AGENTS.md` and `~/hive-data/global/memories.jsonl`)
 * without ever writing agentic content (prose, process vocabulary) into
 * the project itself.
 *
 * Policy:
 * - A project with its own AGENTS.md/CLAUDE.md/MEMORY.md is left alone —
 *   that file already wins over anything opencode.json's `instructions`
 *   would add, so bootstrapping would be redundant at best.
 * - A project with none gets an **untracked** opencode.json whose only
 *   content is `{ $schema, instructions }` pointing at real files in
 *   hive-data. Nothing is ever written into the project's own history —
 *   see `ensureOpencodeJsonGloballyIgnored` for the global-gitignore half
 *   of that guarantee.
 * - A pre-existing opencode.json is never merged into blindly: only a
 *   file matching this module's own shallow shape (`{$schema,
 *   instructions}` and nothing else) is treated as bootstrap-managed and
 *   safe to refresh. Anything else is left untouched and reported.
 *
 * @module config-bootstrap
 */
import { type ResolveHiveDataRepoRootOptions } from "swarm-mail";
export type BootstrapAction = "skipped-has-agent-file" | "skipped-foreign-opencode-json" | "skipped-no-hive-data" | "created" | "updated" | "unchanged";
export interface BootstrapProjectConfigOptions {
    /** Passed through to resolveHiveDataRepoRoot() - testability hook. */
    hiveDataRepoOptions?: ResolveHiveDataRepoRootOptions;
}
export interface BootstrapProjectConfigResult {
    action: BootstrapAction;
    detail: string;
    opencodeJsonPath: string;
    instructions?: string[];
}
/**
 * Bootstrap a project's opencode.json to point at its hive-data mirror.
 *
 * Idempotent and non-destructive: safe to call on every plugin init.
 */
export declare function bootstrapProjectConfig(projectPath: string, options?: BootstrapProjectConfigOptions): Promise<BootstrapProjectConfigResult>;
export type GlobalGitignoreAction = "created-excludes-file" | "appended" | "already-ignored";
export interface EnsureGlobalGitignoreOptions {
    /** Override for testing - avoids real `git config --global` reads. */
    getExcludesFile?: () => string | null;
    /** Override for testing - avoids real `git config --global` writes. */
    setExcludesFile?: (path: string) => void;
    homeDir?: string;
}
export interface EnsureGlobalGitignoreResult {
    action: GlobalGitignoreAction;
    excludesFile: string;
}
/**
 * Ensure `opencode.json` is ignored by every git repo on this machine.
 *
 * Reuses `core.excludesFile` if already configured (appending our entry
 * without touching anything else in it); otherwise creates
 * `~/.config/git/ignore` and points `core.excludesFile` there. Never
 * overwrites an existing excludes file, and never duplicates the entry
 * on repeated calls.
 */
export declare function ensureOpencodeJsonGloballyIgnored(options?: EnsureGlobalGitignoreOptions): EnsureGlobalGitignoreResult;
export interface RunConfigBootstrapResult {
    project: BootstrapProjectConfigResult;
    gitignore: EnsureGlobalGitignoreResult;
}
/**
 * Full bootstrap: ensure the global gitignore rule exists, then bootstrap
 * this project's opencode.json. Called once per plugin init in
 * `SwarmPlugin` with the project's working directory.
 */
export declare function runConfigBootstrap(projectPath: string): Promise<RunConfigBootstrapResult>;
//# sourceMappingURL=config-bootstrap.d.ts.map