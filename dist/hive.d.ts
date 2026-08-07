import { z } from "zod";
import { type HiveAdapter } from "swarm-mail";
/**
 * Set the working directory for all hive commands.
 * Call this from the plugin initialization with the project directory.
 *
 * @param directory - Absolute path to the project directory
 */
export declare function setHiveWorkingDirectory(directory: string): void;
/**
 * Get the current working directory for hive commands.
 * Returns the configured directory or process.cwd() as fallback.
 */
export declare function getHiveWorkingDirectory(): string;
export declare const setBeadsWorkingDirectory: typeof setHiveWorkingDirectory;
export declare const getBeadsWorkingDirectory: typeof getHiveWorkingDirectory;
/**
 * Custom error for hive operations
 */
export declare class HiveError extends Error {
    readonly command: string;
    readonly exitCode?: number | undefined;
    readonly stderr?: string | undefined;
    constructor(message: string, command: string, exitCode?: number | undefined, stderr?: string | undefined);
}
export declare const BeadError: typeof HiveError;
/**
 * Custom error for validation failures
 */
export declare class HiveValidationError extends Error {
    readonly zodError: z.ZodError;
    constructor(message: string, zodError: z.ZodError);
}
export declare const BeadValidationError: typeof HiveValidationError;
/**
 * Result of checking if .beads → .hive migration is needed
 */
export interface MigrationCheckResult {
    /** Whether migration is needed */
    needed: boolean;
    /** Path to .beads directory if it exists */
    beadsPath?: string;
}
/**
 * Result of migrating .beads → .hive
 */
export interface MigrationResult {
    /** Whether migration was performed */
    migrated: boolean;
    /** Reason if migration was skipped */
    reason?: string;
}
/**
 * Check if .beads → .hive migration is needed
 *
 * Migration is needed when:
 * - .beads directory exists
 * - .hive directory does NOT exist
 *
 * @param projectPath - Absolute path to the project root
 * @returns MigrationCheckResult indicating if migration is needed
 */
export declare function checkBeadsMigrationNeeded(projectPath: string): MigrationCheckResult;
/**
 * Migrate .beads directory to .hive
 *
 * This function renames .beads to .hive. It should only be called
 * after user confirmation via CLI prompt.
 *
 * @param projectPath - Absolute path to the project root
 * @returns MigrationResult indicating success or skip reason
 */
export declare function migrateBeadsToHive(projectPath: string): Promise<MigrationResult>;
/**
 * Ensure .hive directory exists
 *
 * Creates .hive directory if it doesn't exist. This is idempotent
 * and safe to call multiple times.
 *
 * @param projectPath - Absolute path to the project root
 */
export declare function ensureHiveDirectory(projectPath: string): void;
/**
 * Merge historic beads from beads.base.jsonl into issues.jsonl
 *
 * This function reads beads.base.jsonl (historic data) and issues.jsonl (current data),
 * merges them by ID (issues.jsonl version wins for duplicates), and writes the result
 * back to issues.jsonl.
 *
 * Use case: After migrating from .beads to .hive, you may have a beads.base.jsonl file
 * containing old beads that should be merged into the current issues.jsonl.
 *
 * @param projectPath - Absolute path to the project root
 * @returns Object with merged and skipped counts
 */
export declare function mergeHistoricBeads(projectPath: string): Promise<{
    merged: number;
    skipped: number;
}>;
/**
 * Import cells from .hive/issues.jsonl into PGLite database
 *
 * Reads the JSONL file and upserts each record into the cells table
 * using the HiveAdapter. Provides granular error reporting for invalid lines.
 *
 * This function manually parses JSONL line-by-line to gracefully handle
 * invalid JSON without throwing. Each valid line is imported via the adapter.
 *
 * @param projectPath - Absolute path to the project root
 * @returns Object with imported, updated, and error counts
 */
export declare function importJsonlToPGLite(projectPath: string): Promise<{
    imported: number;
    updated: number;
    errors: number;
}>;
/**
 * Get or create a HiveAdapter instance for a project
 * Exported for testing - allows tests to verify state directly
 *
 * On first initialization, checks for .beads/issues.jsonl and imports
 * historical beads if the database is empty.
 */
export declare function getHiveAdapter(projectKey: string): Promise<HiveAdapter>;
export declare const getBeadsAdapter: typeof getHiveAdapter;
/**
 * Clear the hive adapter cache
 *
 * Used in tests to ensure clean state between test runs.
 * Clears all cached adapters without closing them (caller should close first).
 */
export declare function clearHiveAdapterCache(): void;
/**
 * Create a new cell with type-safe validation
 */
export declare const hive_create: {
    description: string;
    args: {
        title: z.ZodString;
        type: z.ZodOptional<z.ZodEnum<{
            task: "task";
            bug: "bug";
            feature: "feature";
            epic: "epic";
            chore: "chore";
        }>>;
        priority: z.ZodOptional<z.ZodNumber>;
        description: z.ZodOptional<z.ZodString>;
        parent_id: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        title: string;
        type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
        priority?: number | undefined;
        description?: string | undefined;
        parent_id?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Create an epic with subtasks in one atomic operation
 */
export declare const hive_create_epic: {
    description: string;
    args: {
        epic_title: z.ZodString;
        epic_description: z.ZodOptional<z.ZodString>;
        epic_id: z.ZodOptional<z.ZodString>;
        subtasks: z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            priority: z.ZodOptional<z.ZodNumber>;
            files: z.ZodOptional<z.ZodArray<z.ZodString>>;
            id_suffix: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        strategy: z.ZodOptional<z.ZodEnum<{
            "file-based": "file-based";
            "feature-based": "feature-based";
            "risk-based": "risk-based";
        }>>;
        task: z.ZodOptional<z.ZodString>;
        project_key: z.ZodOptional<z.ZodString>;
        recovery_context: z.ZodOptional<z.ZodObject<{
            shared_context: z.ZodOptional<z.ZodString>;
            skills_to_load: z.ZodOptional<z.ZodArray<z.ZodString>>;
            coordinator_notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    };
    execute(args: {
        epic_title: string;
        subtasks: {
            title: string;
            priority?: number | undefined;
            files?: string[] | undefined;
            id_suffix?: string | undefined;
        }[];
        epic_description?: string | undefined;
        epic_id?: string | undefined;
        strategy?: "file-based" | "feature-based" | "risk-based" | undefined;
        task?: string | undefined;
        project_key?: string | undefined;
        recovery_context?: {
            shared_context?: string | undefined;
            skills_to_load?: string[] | undefined;
            coordinator_notes?: string | undefined;
        } | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Query cells with filters
 */
export declare const hive_query: {
    description: string;
    args: {
        status: z.ZodOptional<z.ZodEnum<{
            open: "open";
            in_progress: "in_progress";
            blocked: "blocked";
            closed: "closed";
        }>>;
        type: z.ZodOptional<z.ZodEnum<{
            task: "task";
            bug: "bug";
            feature: "feature";
            epic: "epic";
            chore: "chore";
        }>>;
        ready: z.ZodOptional<z.ZodBoolean>;
        parent_id: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
        type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
        ready?: boolean | undefined;
        parent_id?: string | undefined;
        limit?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Update a cell's status or description
 */
export declare const hive_update: {
    description: string;
    args: {
        id: z.ZodString;
        status: z.ZodOptional<z.ZodEnum<{
            open: "open";
            in_progress: "in_progress";
            blocked: "blocked";
            closed: "closed";
        }>>;
        description: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        id: string;
        status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
        description?: string | undefined;
        priority?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Close a cell with reason
 */
export declare const hive_close: {
    description: string;
    args: {
        id: z.ZodString;
        reason: z.ZodString;
        result: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        id: string;
        reason: string;
        result?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Mark a cell as in-progress
 */
export declare const hive_start: {
    description: string;
    args: {
        id: z.ZodString;
    };
    execute(args: {
        id: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get the next ready cell
 */
export declare const hive_ready: {
    description: string;
    args: {};
    execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Query cells from the hive database with flexible filtering
 */
export declare const hive_cells: {
    description: string;
    args: {
        id: z.ZodOptional<z.ZodString>;
        status: z.ZodOptional<z.ZodEnum<{
            open: "open";
            in_progress: "in_progress";
            blocked: "blocked";
            closed: "closed";
        }>>;
        type: z.ZodOptional<z.ZodEnum<{
            task: "task";
            bug: "bug";
            feature: "feature";
            epic: "epic";
            chore: "chore";
        }>>;
        parent_id: z.ZodOptional<z.ZodString>;
        ready: z.ZodOptional<z.ZodBoolean>;
        limit: z.ZodOptional<z.ZodNumber>;
        project_key: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        id?: string | undefined;
        status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
        type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
        parent_id?: string | undefined;
        ready?: boolean | undefined;
        limit?: number | undefined;
        project_key?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * List all projects with hive cells
 */
export declare const hive_projects: {
    description: string;
    args: {};
    execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Sync hive to git and push
 */
export declare const hive_sync: {
    description: string;
    args: {
        auto_pull: z.ZodOptional<z.ZodBoolean>;
    };
    execute(args: {
        auto_pull?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Link a cell to an Agent Mail thread
 */
export declare const hive_link_thread: {
    description: string;
    args: {
        bead_id: z.ZodString;
        thread_id: z.ZodString;
    };
    execute(args: {
        bead_id: string;
        thread_id: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Start a work session
 *
 * Shows previous session's handoff notes if available.
 * Inspired by Chainlink's session management pattern.
 * Credit: @dollspace-gay (https://github.com/dollspace-gay/chainlink)
 */
export declare const hive_session_start: {
    description: string;
    args: {
        active_cell_id: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        active_cell_id?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * End the current work session
 *
 * Optionally save handoff notes for next session.
 */
export declare const hive_session_end: {
    description: string;
    args: {
        handoff_notes: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        handoff_notes?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export declare const hiveTools: {
    hive_create: {
        description: string;
        args: {
            title: z.ZodString;
            type: z.ZodOptional<z.ZodEnum<{
                task: "task";
                bug: "bug";
                feature: "feature";
                epic: "epic";
                chore: "chore";
            }>>;
            priority: z.ZodOptional<z.ZodNumber>;
            description: z.ZodOptional<z.ZodString>;
            parent_id: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            title: string;
            type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
            priority?: number | undefined;
            description?: string | undefined;
            parent_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_create_epic: {
        description: string;
        args: {
            epic_title: z.ZodString;
            epic_description: z.ZodOptional<z.ZodString>;
            epic_id: z.ZodOptional<z.ZodString>;
            subtasks: z.ZodArray<z.ZodObject<{
                title: z.ZodString;
                priority: z.ZodOptional<z.ZodNumber>;
                files: z.ZodOptional<z.ZodArray<z.ZodString>>;
                id_suffix: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            strategy: z.ZodOptional<z.ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
            }>>;
            task: z.ZodOptional<z.ZodString>;
            project_key: z.ZodOptional<z.ZodString>;
            recovery_context: z.ZodOptional<z.ZodObject<{
                shared_context: z.ZodOptional<z.ZodString>;
                skills_to_load: z.ZodOptional<z.ZodArray<z.ZodString>>;
                coordinator_notes: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        };
        execute(args: {
            epic_title: string;
            subtasks: {
                title: string;
                priority?: number | undefined;
                files?: string[] | undefined;
                id_suffix?: string | undefined;
            }[];
            epic_description?: string | undefined;
            epic_id?: string | undefined;
            strategy?: "file-based" | "feature-based" | "risk-based" | undefined;
            task?: string | undefined;
            project_key?: string | undefined;
            recovery_context?: {
                shared_context?: string | undefined;
                skills_to_load?: string[] | undefined;
                coordinator_notes?: string | undefined;
            } | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_query: {
        description: string;
        args: {
            status: z.ZodOptional<z.ZodEnum<{
                open: "open";
                in_progress: "in_progress";
                blocked: "blocked";
                closed: "closed";
            }>>;
            type: z.ZodOptional<z.ZodEnum<{
                task: "task";
                bug: "bug";
                feature: "feature";
                epic: "epic";
                chore: "chore";
            }>>;
            ready: z.ZodOptional<z.ZodBoolean>;
            parent_id: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
            type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
            ready?: boolean | undefined;
            parent_id?: string | undefined;
            limit?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_update: {
        description: string;
        args: {
            id: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<{
                open: "open";
                in_progress: "in_progress";
                blocked: "blocked";
                closed: "closed";
            }>>;
            description: z.ZodOptional<z.ZodString>;
            priority: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            id: string;
            status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
            description?: string | undefined;
            priority?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_close: {
        description: string;
        args: {
            id: z.ZodString;
            reason: z.ZodString;
            result: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            id: string;
            reason: string;
            result?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_start: {
        description: string;
        args: {
            id: z.ZodString;
        };
        execute(args: {
            id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_ready: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_cells: {
        description: string;
        args: {
            id: z.ZodOptional<z.ZodString>;
            status: z.ZodOptional<z.ZodEnum<{
                open: "open";
                in_progress: "in_progress";
                blocked: "blocked";
                closed: "closed";
            }>>;
            type: z.ZodOptional<z.ZodEnum<{
                task: "task";
                bug: "bug";
                feature: "feature";
                epic: "epic";
                chore: "chore";
            }>>;
            parent_id: z.ZodOptional<z.ZodString>;
            ready: z.ZodOptional<z.ZodBoolean>;
            limit: z.ZodOptional<z.ZodNumber>;
            project_key: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            id?: string | undefined;
            status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
            type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
            parent_id?: string | undefined;
            ready?: boolean | undefined;
            limit?: number | undefined;
            project_key?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_projects: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_sync: {
        description: string;
        args: {
            auto_pull: z.ZodOptional<z.ZodBoolean>;
        };
        execute(args: {
            auto_pull?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_link_thread: {
        description: string;
        args: {
            bead_id: z.ZodString;
            thread_id: z.ZodString;
        };
        execute(args: {
            bead_id: string;
            thread_id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_session_start: {
        description: string;
        args: {
            active_cell_id: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            active_cell_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    hive_session_end: {
        description: string;
        args: {
            handoff_notes: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            handoff_notes?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
/**
 * @deprecated Use hive_create instead. Will be removed in v1.0
 */
export declare const beads_create: {
    description: string;
    args: {
        title: z.ZodString;
        type: z.ZodOptional<z.ZodEnum<{
            task: "task";
            bug: "bug";
            feature: "feature";
            epic: "epic";
            chore: "chore";
        }>>;
        priority: z.ZodOptional<z.ZodNumber>;
        description: z.ZodOptional<z.ZodString>;
        parent_id: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        title: string;
        type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
        priority?: number | undefined;
        description?: string | undefined;
        parent_id?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * @deprecated Use hive_create_epic instead. Will be removed in v1.0
 */
export declare const beads_create_epic: {
    description: string;
    args: {
        epic_title: z.ZodString;
        epic_description: z.ZodOptional<z.ZodString>;
        epic_id: z.ZodOptional<z.ZodString>;
        subtasks: z.ZodArray<z.ZodObject<{
            title: z.ZodString;
            priority: z.ZodOptional<z.ZodNumber>;
            files: z.ZodOptional<z.ZodArray<z.ZodString>>;
            id_suffix: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        strategy: z.ZodOptional<z.ZodEnum<{
            "file-based": "file-based";
            "feature-based": "feature-based";
            "risk-based": "risk-based";
        }>>;
        task: z.ZodOptional<z.ZodString>;
        project_key: z.ZodOptional<z.ZodString>;
        recovery_context: z.ZodOptional<z.ZodObject<{
            shared_context: z.ZodOptional<z.ZodString>;
            skills_to_load: z.ZodOptional<z.ZodArray<z.ZodString>>;
            coordinator_notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    };
    execute(args: {
        epic_title: string;
        subtasks: {
            title: string;
            priority?: number | undefined;
            files?: string[] | undefined;
            id_suffix?: string | undefined;
        }[];
        epic_description?: string | undefined;
        epic_id?: string | undefined;
        strategy?: "file-based" | "feature-based" | "risk-based" | undefined;
        task?: string | undefined;
        project_key?: string | undefined;
        recovery_context?: {
            shared_context?: string | undefined;
            skills_to_load?: string[] | undefined;
            coordinator_notes?: string | undefined;
        } | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * @deprecated Use hive_query instead. Will be removed in v1.0
 */
export declare const beads_query: {
    description: string;
    args: {
        status: z.ZodOptional<z.ZodEnum<{
            open: "open";
            in_progress: "in_progress";
            blocked: "blocked";
            closed: "closed";
        }>>;
        type: z.ZodOptional<z.ZodEnum<{
            task: "task";
            bug: "bug";
            feature: "feature";
            epic: "epic";
            chore: "chore";
        }>>;
        ready: z.ZodOptional<z.ZodBoolean>;
        parent_id: z.ZodOptional<z.ZodString>;
        limit: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
        type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
        ready?: boolean | undefined;
        parent_id?: string | undefined;
        limit?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * @deprecated Use hive_update instead. Will be removed in v1.0
 */
export declare const beads_update: {
    description: string;
    args: {
        id: z.ZodString;
        status: z.ZodOptional<z.ZodEnum<{
            open: "open";
            in_progress: "in_progress";
            blocked: "blocked";
            closed: "closed";
        }>>;
        description: z.ZodOptional<z.ZodString>;
        priority: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        id: string;
        status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
        description?: string | undefined;
        priority?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * @deprecated Use hive_close instead. Will be removed in v1.0
 */
export declare const beads_close: {
    description: string;
    args: {
        id: z.ZodString;
        reason: z.ZodString;
        result: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        id: string;
        reason: string;
        result?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * @deprecated Use hive_start instead. Will be removed in v1.0
 */
export declare const beads_start: {
    description: string;
    args: {
        id: z.ZodString;
    };
    execute(args: {
        id: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * @deprecated Use hive_ready instead. Will be removed in v1.0
 */
export declare const beads_ready: {
    description: string;
    args: {};
    execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * @deprecated Use hive_sync instead. Will be removed in v1.0
 */
export declare const beads_sync: {
    description: string;
    args: {
        auto_pull: z.ZodOptional<z.ZodBoolean>;
    };
    execute(args: {
        auto_pull?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * @deprecated Use hive_link_thread instead. Will be removed in v1.0
 */
export declare const beads_link_thread: {
    description: string;
    args: {
        bead_id: z.ZodString;
        thread_id: z.ZodString;
    };
    execute(args: {
        bead_id: string;
        thread_id: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * @deprecated Use hiveTools instead. Will be removed in v1.0
 */
export declare const beadsTools: {
    beads_create: {
        description: string;
        args: {
            title: z.ZodString;
            type: z.ZodOptional<z.ZodEnum<{
                task: "task";
                bug: "bug";
                feature: "feature";
                epic: "epic";
                chore: "chore";
            }>>;
            priority: z.ZodOptional<z.ZodNumber>;
            description: z.ZodOptional<z.ZodString>;
            parent_id: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            title: string;
            type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
            priority?: number | undefined;
            description?: string | undefined;
            parent_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    beads_create_epic: {
        description: string;
        args: {
            epic_title: z.ZodString;
            epic_description: z.ZodOptional<z.ZodString>;
            epic_id: z.ZodOptional<z.ZodString>;
            subtasks: z.ZodArray<z.ZodObject<{
                title: z.ZodString;
                priority: z.ZodOptional<z.ZodNumber>;
                files: z.ZodOptional<z.ZodArray<z.ZodString>>;
                id_suffix: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            strategy: z.ZodOptional<z.ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
            }>>;
            task: z.ZodOptional<z.ZodString>;
            project_key: z.ZodOptional<z.ZodString>;
            recovery_context: z.ZodOptional<z.ZodObject<{
                shared_context: z.ZodOptional<z.ZodString>;
                skills_to_load: z.ZodOptional<z.ZodArray<z.ZodString>>;
                coordinator_notes: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
        };
        execute(args: {
            epic_title: string;
            subtasks: {
                title: string;
                priority?: number | undefined;
                files?: string[] | undefined;
                id_suffix?: string | undefined;
            }[];
            epic_description?: string | undefined;
            epic_id?: string | undefined;
            strategy?: "file-based" | "feature-based" | "risk-based" | undefined;
            task?: string | undefined;
            project_key?: string | undefined;
            recovery_context?: {
                shared_context?: string | undefined;
                skills_to_load?: string[] | undefined;
                coordinator_notes?: string | undefined;
            } | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    beads_query: {
        description: string;
        args: {
            status: z.ZodOptional<z.ZodEnum<{
                open: "open";
                in_progress: "in_progress";
                blocked: "blocked";
                closed: "closed";
            }>>;
            type: z.ZodOptional<z.ZodEnum<{
                task: "task";
                bug: "bug";
                feature: "feature";
                epic: "epic";
                chore: "chore";
            }>>;
            ready: z.ZodOptional<z.ZodBoolean>;
            parent_id: z.ZodOptional<z.ZodString>;
            limit: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
            type?: "task" | "bug" | "feature" | "epic" | "chore" | undefined;
            ready?: boolean | undefined;
            parent_id?: string | undefined;
            limit?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    beads_update: {
        description: string;
        args: {
            id: z.ZodString;
            status: z.ZodOptional<z.ZodEnum<{
                open: "open";
                in_progress: "in_progress";
                blocked: "blocked";
                closed: "closed";
            }>>;
            description: z.ZodOptional<z.ZodString>;
            priority: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            id: string;
            status?: "open" | "in_progress" | "blocked" | "closed" | undefined;
            description?: string | undefined;
            priority?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    beads_close: {
        description: string;
        args: {
            id: z.ZodString;
            reason: z.ZodString;
            result: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            id: string;
            reason: string;
            result?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    beads_start: {
        description: string;
        args: {
            id: z.ZodString;
        };
        execute(args: {
            id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    beads_ready: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    beads_sync: {
        description: string;
        args: {
            auto_pull: z.ZodOptional<z.ZodBoolean>;
        };
        execute(args: {
            auto_pull?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    beads_link_thread: {
        description: string;
        args: {
            bead_id: z.ZodString;
            thread_id: z.ZodString;
        };
        execute(args: {
            bead_id: string;
            thread_id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=hive.d.ts.map