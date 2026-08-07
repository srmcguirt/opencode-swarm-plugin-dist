/**
 * Swarm Orchestrate Module - Status tracking and completion handling
 *
 * Handles swarm execution lifecycle:
 * - Initialization and tool availability
 * - Status tracking and progress reporting
 * - Completion verification and gates
 * - Error accumulation and 3-strike detection
 * - Learning from outcomes
 *
 * Key responsibilities:
 * - swarm_init - Check tools and discover skills
 * - swarm_status - Query epic progress
 * - swarm_progress - Report agent progress
 * - swarm_complete - Verification gate and completion
 * - swarm_record_outcome - Learning signals
 * - swarm_broadcast - Mid-task context sharing
 * - Error accumulation tools
 * - 3-strike detection for architectural problems
 */
import { z } from "zod";
import { type WorkerHandoff } from "./schemas/worker-handoff";
/**
 * Generate a WorkerHandoff object from subtask parameters
 *
 * Creates a machine-readable contract that replaces prose instructions in SUBTASK_PROMPT_V2.
 * Workers receive typed handoffs with explicit files, criteria, and escalation paths.
 *
 * @param params - Subtask parameters
 * @returns WorkerHandoff object validated against schema
 */
export declare function generateWorkerHandoff(params: {
    task_id: string;
    files_owned: string[];
    files_readonly?: string[];
    dependencies_completed?: string[];
    success_criteria?: string[];
    epic_summary: string;
    your_role: string;
    what_others_did?: string;
    what_comes_next?: string;
}): WorkerHandoff;
/**
 * Validate that files_touched is a subset of files_owned (supports globs)
 *
 * Checks contract compliance - workers should only modify files they own.
 * Glob patterns in files_owned are matched against files_touched paths.
 *
 * @param files_touched - Actual files modified by the worker
 * @param files_owned - Files the worker is allowed to modify (may include globs)
 * @returns Validation result with violations list
 *
 * @example
 * ```typescript
 * // Exact match - passes
 * validateContract(["src/a.ts"], ["src/a.ts", "src/b.ts"])
 * // => { valid: true, violations: [] }
 *
 * // Glob match - passes
 * validateContract(["src/auth/service.ts"], ["src/auth/**"])
 * // => { valid: true, violations: [] }
 *
 * // Violation - fails
 * validateContract(["src/other.ts"], ["src/auth/**"])
 * // => { valid: false, violations: ["src/other.ts"] }
 * ```
 */
export declare function validateContract(files_touched: string[], files_owned: string[]): {
    valid: boolean;
    violations: string[];
};
/**
 * Initialize swarm and check tool availability
 *
 * Call this at the start of a swarm session to see what tools are available,
 * what skills exist in the project, and what features will be degraded.
 *
 * Skills are automatically discovered from:
 * - .opencode/skills/
 * - .claude/skills/
 * - skills/
 */
export declare const swarm_init: {
    description: string;
    args: {
        project_path: z.ZodOptional<z.ZodString>;
        isolation: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
            reservation: "reservation";
            worktree: "worktree";
        }>>>;
    };
    execute(args: {
        isolation: "reservation" | "worktree";
        project_path?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get status of a swarm by epic ID
 *
 * Requires project_key to query Agent Mail for message counts.
 */
export declare const swarm_status: {
    description: string;
    args: {
        epic_id: z.ZodString;
        project_key: z.ZodString;
    };
    execute(args: {
        epic_id: string;
        project_key: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Report progress on a subtask
 *
 * Takes explicit agent identity since tools don't have persistent state.
 */
export declare const swarm_progress: {
    description: string;
    args: {
        project_key: z.ZodString;
        agent_name: z.ZodString;
        bead_id: z.ZodString;
        status: z.ZodEnum<{
            in_progress: "in_progress";
            blocked: "blocked";
            failed: "failed";
            completed: "completed";
        }>;
        message: z.ZodOptional<z.ZodString>;
        progress_percent: z.ZodOptional<z.ZodNumber>;
        files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
    };
    execute(args: {
        project_key: string;
        agent_name: string;
        bead_id: string;
        status: "in_progress" | "blocked" | "failed" | "completed";
        message?: string | undefined;
        progress_percent?: number | undefined;
        files_touched?: string[] | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Broadcast context updates to all agents in the epic
 *
 * Enables mid-task coordination by sharing discoveries, warnings, or blockers
 * with all agents working on the same epic. Agents can broadcast without
 * waiting for task completion.
 *
 * Based on "Patterns for Building AI Agents" p.31: "Ensure subagents can share context along the way"
 */
export declare const swarm_broadcast: {
    description: string;
    args: {
        project_path: z.ZodString;
        agent_name: z.ZodString;
        epic_id: z.ZodString;
        message: z.ZodString;
        importance: z.ZodDefault<z.ZodEnum<{
            info: "info";
            warning: "warning";
            blocker: "blocker";
        }>>;
        files_affected: z.ZodOptional<z.ZodArray<z.ZodString>>;
    };
    execute(args: {
        project_path: string;
        agent_name: string;
        epic_id: string;
        message: string;
        importance: "info" | "warning" | "blocker";
        files_affected?: string[] | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Mark a subtask as complete
 *
 * Implements the Verification Gate (from superpowers):
 * 1. IDENTIFY: What commands prove this claim?
 * 2. RUN: Execute verification (typecheck, tests)
 * 3. READ: Check exit codes and output
 * 4. VERIFY: All checks must pass
 * 5. ONLY THEN: Close the cell
 *
 * Closes cell, releases reservations, notifies coordinator, and resolves
 * a DurableDeferred keyed by bead_id for cross-agent task completion signaling.
 *
 * ## DurableDeferred Integration
 *
 * When a coordinator spawns workers, it can create a deferred BEFORE spawning:
 *
 * ```typescript
 * const swarmMail = await getSwarmMailLibSQL(projectPath);
 * const db = await swarmMail.getDatabase();
 *
 * // Create deferred keyed by bead_id
 * const deferredUrl = `deferred:${beadId}`;
 * await db.query(
 *   `INSERT INTO deferred (url, resolved, expires_at, created_at) VALUES (?, 0, ?, ?)`,
 *   [deferredUrl, Date.now() + 3600000, Date.now()]
 * );
 *
 * // Spawn worker (swarm_spawn_subtask...)
 *
 * // Await completion
 * const result = await db.query<{ value: string }>(
 *   `SELECT value FROM deferred WHERE url = ? AND resolved = 1`,
 *   [deferredUrl]
 * );
 * ```
 *
 * When the worker calls swarm_complete, it resolves the deferred automatically.
 * Coordinator can await without polling.
 */
export declare const swarm_complete: {
    description: string;
    args: {
        project_key: z.ZodString;
        agent_name: z.ZodString;
        bead_id: z.ZodString;
        summary: z.ZodString;
        evaluation: z.ZodOptional<z.ZodString>;
        files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
        skip_verification: z.ZodOptional<z.ZodBoolean>;
        planned_files: z.ZodOptional<z.ZodArray<z.ZodString>>;
        start_time: z.ZodOptional<z.ZodNumber>;
        error_count: z.ZodOptional<z.ZodNumber>;
        retry_count: z.ZodOptional<z.ZodNumber>;
        skip_review: z.ZodOptional<z.ZodBoolean>;
        commit_sha: z.ZodOptional<z.ZodString>;
        commit_message: z.ZodOptional<z.ZodString>;
        commit_branch: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        project_key: string;
        agent_name: string;
        bead_id: string;
        summary: string;
        evaluation?: string | undefined;
        files_touched?: string[] | undefined;
        skip_verification?: boolean | undefined;
        planned_files?: string[] | undefined;
        start_time?: number | undefined;
        error_count?: number | undefined;
        retry_count?: number | undefined;
        skip_review?: boolean | undefined;
        commit_sha?: string | undefined;
        commit_message?: string | undefined;
        commit_branch?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Record outcome signals from a completed subtask
 *
 * Tracks implicit feedback (duration, errors, retries) to score
 * decomposition quality over time. This data feeds into criterion
 * weight calculations.
 *
 * Strategy tracking enables learning about which decomposition strategies
 * work best for different task types.
 *
 * @see src/learning.ts for scoring logic
 */
export declare const swarm_record_outcome: {
    description: string;
    args: {
        bead_id: z.ZodString;
        duration_ms: z.ZodNumber;
        error_count: z.ZodDefault<z.ZodNumber>;
        retry_count: z.ZodDefault<z.ZodNumber>;
        success: z.ZodBoolean;
        files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
        criteria: z.ZodOptional<z.ZodArray<z.ZodString>>;
        strategy: z.ZodOptional<z.ZodEnum<{
            "file-based": "file-based";
            "feature-based": "feature-based";
            "risk-based": "risk-based";
            "research-based": "research-based";
        }>>;
        failure_mode: z.ZodOptional<z.ZodEnum<{
            timeout: "timeout";
            unknown: "unknown";
            conflict: "conflict";
            validation: "validation";
            tool_failure: "tool_failure";
            context_overflow: "context_overflow";
            dependency_blocked: "dependency_blocked";
            user_cancelled: "user_cancelled";
        }>>;
        failure_details: z.ZodOptional<z.ZodString>;
        project_path: z.ZodOptional<z.ZodString>;
        epic_id: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        bead_id: string;
        duration_ms: number;
        error_count: number;
        retry_count: number;
        success: boolean;
        files_touched?: string[] | undefined;
        criteria?: string[] | undefined;
        strategy?: "file-based" | "feature-based" | "risk-based" | "research-based" | undefined;
        failure_mode?: "timeout" | "unknown" | "conflict" | "validation" | "tool_failure" | "context_overflow" | "dependency_blocked" | "user_cancelled" | undefined;
        failure_details?: string | undefined;
        project_path?: string | undefined;
        epic_id?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Extract technology stack from task description
 *
 * Searches for common framework/library mentions and returns
 * a deduplicated array of normalized names.
 *
 * @param task - Task description
 * @returns Array of detected technology names (normalized, lowercase)
 *
 * @example
 * ```typescript
 * extractTechStack("Add Next.js API routes with Zod validation")
 * // => ["next", "zod"]
 * ```
 */
export declare function extractTechStack(task: string): string[];
/**
 * Spawn instruction for a researcher worker
 */
export interface ResearchSpawnInstruction {
    /** Unique ID for this research task */
    research_id: string;
    /** Technology being researched */
    tech: string;
    /** Full prompt for the researcher agent */
    prompt: string;
    /** Agent type for the Task tool */
    subagent_type: "swarm-researcher";
}
/**
 * Research result from documentation discovery phase
 */
export interface ResearchResult {
    /** Technologies identified and researched */
    tech_stack: string[];
    /** Spawn instructions for researcher workers */
    spawn_instructions: ResearchSpawnInstruction[];
    /** Summaries keyed by technology name */
    summaries: Record<string, string>;
    /** Hivemind IDs where research is stored */
    memory_ids: string[];
}
/**
 * Run research phase before task decomposition
 *
 * This is the INTEGRATION point that:
 * 1. Analyzes task to identify technologies
 * 2. Spawns researcher agents for each technology (parallel)
 * 3. Waits for researchers to complete
 * 4. Collects summaries from hivemind
 * 5. Returns combined context for shared_context
 *
 * Flow:
 * ```
 * Task received
 *   ↓
 * extractTechStack(task) → ["next", "zod"]
 *   ↓
 * For each tech: swarm_spawn_researcher(tech_stack=[tech])
 *   ↓
 * Spawn Task agents in parallel
 *   ↓
 * Wait for all to complete
 *   ↓
 * Collect summaries from swarm mail
 *   ↓
 * Return ResearchResult → inject into shared_context
 * ```
 *
 * @param task - Task description to analyze
 * @param projectPath - Absolute path to project root
 * @param options - Optional configuration
 * @returns Research results with summaries and memory IDs
 *
 * @example
 * ```typescript
 * const result = await runResearchPhase(
 *   "Add Next.js API routes with Zod validation",
 *   "/path/to/project"
 * );
 * // result.tech_stack => ["next", "zod"]
 * // result.summaries => { next: "...", zod: "..." }
 * // Use result as shared_context for decomposition
 * ```
 */
export declare function runResearchPhase(task: string, projectPath: string, options?: {
    checkUpgrades?: boolean;
}): Promise<ResearchResult>;
/**
 * Plugin tool for running research phase
 *
 * Exposes research phase as a tool for manual triggering or
 * integration into orchestration flows.
 */
export declare const swarm_research_phase: {
    description: string;
    args: {
        task: z.ZodString;
        project_path: z.ZodString;
        check_upgrades: z.ZodOptional<z.ZodBoolean>;
    };
    execute(args: {
        task: string;
        project_path: string;
        check_upgrades?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Record an error during subtask execution
 *
 * Implements pattern from "Patterns for Building AI Agents" p.40:
 * "Good agents examine and correct errors when something goes wrong"
 *
 * Errors are accumulated and can be fed into retry prompts to help
 * agents learn from past failures.
 */
export declare const swarm_accumulate_error: {
    description: string;
    args: {
        bead_id: z.ZodString;
        error_type: z.ZodEnum<{
            timeout: "timeout";
            unknown: "unknown";
            conflict: "conflict";
            validation: "validation";
            tool_failure: "tool_failure";
        }>;
        message: z.ZodString;
        stack_trace: z.ZodOptional<z.ZodString>;
        tool_name: z.ZodOptional<z.ZodString>;
        context: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        bead_id: string;
        error_type: "timeout" | "unknown" | "conflict" | "validation" | "tool_failure";
        message: string;
        stack_trace?: string | undefined;
        tool_name?: string | undefined;
        context?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get accumulated errors for a bead to feed into retry prompts
 *
 * Returns formatted error context that can be injected into retry prompts
 * to help agents learn from past failures.
 */
export declare const swarm_get_error_context: {
    description: string;
    args: {
        bead_id: z.ZodString;
        include_resolved: z.ZodOptional<z.ZodBoolean>;
    };
    execute(args: {
        bead_id: string;
        include_resolved?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Mark an error as resolved
 *
 * Call this after an agent successfully addresses an error to update
 * the accumulator state.
 */
export declare const swarm_resolve_error: {
    description: string;
    args: {
        error_id: z.ZodString;
    };
    execute(args: {
        error_id: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Check if a bead has struck out (3 consecutive failures)
 *
 * The 3-Strike Rule:
 * IF 3+ fixes have failed:
 *   STOP → Question the architecture
 *   DON'T attempt Fix #4
 *   Discuss with human partner
 *
 * This is NOT a failed hypothesis.
 * This is a WRONG ARCHITECTURE.
 *
 * Use this tool to:
 * - Check strike count before attempting a fix
 * - Get architecture review prompt if struck out
 * - Record a strike when a fix fails
 * - Clear strikes when a fix succeeds
 */
export declare const swarm_check_strikes: {
    description: string;
    args: {
        bead_id: z.ZodString;
        action: z.ZodEnum<{
            check: "check";
            add_strike: "add_strike";
            clear: "clear";
            get_prompt: "get_prompt";
        }>;
        attempt: z.ZodOptional<z.ZodString>;
        reason: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        bead_id: string;
        action: "check" | "add_strike" | "clear" | "get_prompt";
        attempt?: string | undefined;
        reason?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Checkpoint swarm context for recovery
 *
 * Records the current state of a subtask to enable recovery after crashes,
 * context overflows, or agent restarts. Non-fatal errors - logs warnings
 * and continues if checkpoint fails.
 *
 * Integration:
 * - Called automatically by swarm_progress at milestone thresholds (25%, 50%, 75%)
 * - Can be called manually by agents at critical points
 * - Emits SwarmCheckpointedEvent for audit trail
 * - Updates swarm_contexts table for fast recovery queries
 */
export declare const swarm_checkpoint: {
    description: string;
    args: {
        project_key: z.ZodString;
        agent_name: z.ZodString;
        bead_id: z.ZodString;
        epic_id: z.ZodString;
        files_modified: z.ZodArray<z.ZodString>;
        progress_percent: z.ZodNumber;
        directives: z.ZodOptional<z.ZodObject<{
            shared_context: z.ZodOptional<z.ZodString>;
            skills_to_load: z.ZodOptional<z.ZodArray<z.ZodString>>;
            coordinator_notes: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
        error_context: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        project_key: string;
        agent_name: string;
        bead_id: string;
        epic_id: string;
        files_modified: string[];
        progress_percent: number;
        directives?: {
            shared_context?: string | undefined;
            skills_to_load?: string[] | undefined;
            coordinator_notes?: string | undefined;
        } | undefined;
        error_context?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Recover swarm context from last checkpoint
 *
 * Queries swarm_contexts table for the most recent checkpoint of an epic.
 * Returns the full context including files, progress, and recovery state.
 * Emits SwarmRecoveredEvent for audit trail.
 *
 * Graceful fallback: Returns { found: false } if no checkpoint exists.
 */
export declare const swarm_recover: {
    description: string;
    args: {
        project_key: z.ZodString;
        epic_id: z.ZodString;
    };
    execute(args: {
        project_key: string;
        epic_id: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Branch session context for exploration or debugging
 *
 * Creates a labeled snapshot of current context and allows agent to
 * explore a side-quest (debugging, prototyping, research) without
 * losing the main context. Uses existing checkpoint mechanism but
 * optimized for intentional exploration rather than crash recovery.
 *
 * Workflow:
 * 1. swarm_branch - saves current state with a label
 * 2. Do exploratory work
 * 3. swarm_return - restore main context, optionally carry back learnings
 *
 * Use cases:
 * - Debug a confusing issue without disrupting main task
 * - Prototype an approach before committing
 * - Research a dependency or API
 */
export declare const swarm_branch: {
    description: string;
    args: {
        project_key: z.ZodString;
        agent_name: z.ZodString;
        bead_id: z.ZodString;
        epic_id: z.ZodString;
        branch_label: z.ZodString;
        branch_purpose: z.ZodString;
        files_modified: z.ZodArray<z.ZodString>;
        progress_percent: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        project_key: string;
        agent_name: string;
        bead_id: string;
        epic_id: string;
        branch_label: string;
        branch_purpose: string;
        files_modified: string[];
        progress_percent?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Return from session branch to main context
 *
 * Restores the context from before the branch was created.
 * Optionally allows carrying back learnings or file changes
 * discovered during exploration.
 *
 * Use cases:
 * - Return to main task after debugging
 * - Restore context after failed prototype
 * - Return with learnings from research
 */
export declare const swarm_return: {
    description: string;
    args: {
        project_key: z.ZodString;
        epic_id: z.ZodString;
        branch_label: z.ZodOptional<z.ZodString>;
        carry_back_learnings: z.ZodOptional<z.ZodString>;
        carry_back_files: z.ZodOptional<z.ZodArray<z.ZodString>>;
    };
    execute(args: {
        project_key: string;
        epic_id: string;
        branch_label?: string | undefined;
        carry_back_learnings?: string | undefined;
        carry_back_files?: string[] | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Learn from completed work and optionally create a skill
 *
 * This tool helps agents reflect on patterns, best practices, or domain
 * knowledge discovered during task execution and codify them into reusable
 * skills for future swarms.
 *
 * Implements the "learning swarm" pattern where swarms get smarter over time.
 */
export declare const swarm_learn: {
    description: string;
    args: {
        summary: z.ZodString;
        pattern_type: z.ZodEnum<{
            "code-pattern": "code-pattern";
            "best-practice": "best-practice";
            gotcha: "gotcha";
            "tool-usage": "tool-usage";
            "domain-knowledge": "domain-knowledge";
            workflow: "workflow";
        }>;
        details: z.ZodString;
        example: z.ZodOptional<z.ZodString>;
        when_to_use: z.ZodString;
        files_context: z.ZodOptional<z.ZodArray<z.ZodString>>;
        create_skill: z.ZodOptional<z.ZodBoolean>;
        skill_name: z.ZodOptional<z.ZodString>;
        skill_tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
    };
    execute(args: {
        summary: string;
        pattern_type: "code-pattern" | "best-practice" | "gotcha" | "tool-usage" | "domain-knowledge" | "workflow";
        details: string;
        when_to_use: string;
        example?: string | undefined;
        files_context?: string[] | undefined;
        create_skill?: boolean | undefined;
        skill_name?: string | undefined;
        skill_tags?: string[] | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export declare const orchestrateTools: {
    swarm_init: {
        description: string;
        args: {
            project_path: z.ZodOptional<z.ZodString>;
            isolation: z.ZodDefault<z.ZodOptional<z.ZodEnum<{
                reservation: "reservation";
                worktree: "worktree";
            }>>>;
        };
        execute(args: {
            isolation: "reservation" | "worktree";
            project_path?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_status: {
        description: string;
        args: {
            epic_id: z.ZodString;
            project_key: z.ZodString;
        };
        execute(args: {
            epic_id: string;
            project_key: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_progress: {
        description: string;
        args: {
            project_key: z.ZodString;
            agent_name: z.ZodString;
            bead_id: z.ZodString;
            status: z.ZodEnum<{
                in_progress: "in_progress";
                blocked: "blocked";
                failed: "failed";
                completed: "completed";
            }>;
            message: z.ZodOptional<z.ZodString>;
            progress_percent: z.ZodOptional<z.ZodNumber>;
            files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
        };
        execute(args: {
            project_key: string;
            agent_name: string;
            bead_id: string;
            status: "in_progress" | "blocked" | "failed" | "completed";
            message?: string | undefined;
            progress_percent?: number | undefined;
            files_touched?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_broadcast: {
        description: string;
        args: {
            project_path: z.ZodString;
            agent_name: z.ZodString;
            epic_id: z.ZodString;
            message: z.ZodString;
            importance: z.ZodDefault<z.ZodEnum<{
                info: "info";
                warning: "warning";
                blocker: "blocker";
            }>>;
            files_affected: z.ZodOptional<z.ZodArray<z.ZodString>>;
        };
        execute(args: {
            project_path: string;
            agent_name: string;
            epic_id: string;
            message: string;
            importance: "info" | "warning" | "blocker";
            files_affected?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_complete: {
        description: string;
        args: {
            project_key: z.ZodString;
            agent_name: z.ZodString;
            bead_id: z.ZodString;
            summary: z.ZodString;
            evaluation: z.ZodOptional<z.ZodString>;
            files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
            skip_verification: z.ZodOptional<z.ZodBoolean>;
            planned_files: z.ZodOptional<z.ZodArray<z.ZodString>>;
            start_time: z.ZodOptional<z.ZodNumber>;
            error_count: z.ZodOptional<z.ZodNumber>;
            retry_count: z.ZodOptional<z.ZodNumber>;
            skip_review: z.ZodOptional<z.ZodBoolean>;
            commit_sha: z.ZodOptional<z.ZodString>;
            commit_message: z.ZodOptional<z.ZodString>;
            commit_branch: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            project_key: string;
            agent_name: string;
            bead_id: string;
            summary: string;
            evaluation?: string | undefined;
            files_touched?: string[] | undefined;
            skip_verification?: boolean | undefined;
            planned_files?: string[] | undefined;
            start_time?: number | undefined;
            error_count?: number | undefined;
            retry_count?: number | undefined;
            skip_review?: boolean | undefined;
            commit_sha?: string | undefined;
            commit_message?: string | undefined;
            commit_branch?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_record_outcome: {
        description: string;
        args: {
            bead_id: z.ZodString;
            duration_ms: z.ZodNumber;
            error_count: z.ZodDefault<z.ZodNumber>;
            retry_count: z.ZodDefault<z.ZodNumber>;
            success: z.ZodBoolean;
            files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
            criteria: z.ZodOptional<z.ZodArray<z.ZodString>>;
            strategy: z.ZodOptional<z.ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                "research-based": "research-based";
            }>>;
            failure_mode: z.ZodOptional<z.ZodEnum<{
                timeout: "timeout";
                unknown: "unknown";
                conflict: "conflict";
                validation: "validation";
                tool_failure: "tool_failure";
                context_overflow: "context_overflow";
                dependency_blocked: "dependency_blocked";
                user_cancelled: "user_cancelled";
            }>>;
            failure_details: z.ZodOptional<z.ZodString>;
            project_path: z.ZodOptional<z.ZodString>;
            epic_id: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            bead_id: string;
            duration_ms: number;
            error_count: number;
            retry_count: number;
            success: boolean;
            files_touched?: string[] | undefined;
            criteria?: string[] | undefined;
            strategy?: "file-based" | "feature-based" | "risk-based" | "research-based" | undefined;
            failure_mode?: "timeout" | "unknown" | "conflict" | "validation" | "tool_failure" | "context_overflow" | "dependency_blocked" | "user_cancelled" | undefined;
            failure_details?: string | undefined;
            project_path?: string | undefined;
            epic_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_research_phase: {
        description: string;
        args: {
            task: z.ZodString;
            project_path: z.ZodString;
            check_upgrades: z.ZodOptional<z.ZodBoolean>;
        };
        execute(args: {
            task: string;
            project_path: string;
            check_upgrades?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_accumulate_error: {
        description: string;
        args: {
            bead_id: z.ZodString;
            error_type: z.ZodEnum<{
                timeout: "timeout";
                unknown: "unknown";
                conflict: "conflict";
                validation: "validation";
                tool_failure: "tool_failure";
            }>;
            message: z.ZodString;
            stack_trace: z.ZodOptional<z.ZodString>;
            tool_name: z.ZodOptional<z.ZodString>;
            context: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            bead_id: string;
            error_type: "timeout" | "unknown" | "conflict" | "validation" | "tool_failure";
            message: string;
            stack_trace?: string | undefined;
            tool_name?: string | undefined;
            context?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_get_error_context: {
        description: string;
        args: {
            bead_id: z.ZodString;
            include_resolved: z.ZodOptional<z.ZodBoolean>;
        };
        execute(args: {
            bead_id: string;
            include_resolved?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_resolve_error: {
        description: string;
        args: {
            error_id: z.ZodString;
        };
        execute(args: {
            error_id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_check_strikes: {
        description: string;
        args: {
            bead_id: z.ZodString;
            action: z.ZodEnum<{
                check: "check";
                add_strike: "add_strike";
                clear: "clear";
                get_prompt: "get_prompt";
            }>;
            attempt: z.ZodOptional<z.ZodString>;
            reason: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            bead_id: string;
            action: "check" | "add_strike" | "clear" | "get_prompt";
            attempt?: string | undefined;
            reason?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_checkpoint: {
        description: string;
        args: {
            project_key: z.ZodString;
            agent_name: z.ZodString;
            bead_id: z.ZodString;
            epic_id: z.ZodString;
            files_modified: z.ZodArray<z.ZodString>;
            progress_percent: z.ZodNumber;
            directives: z.ZodOptional<z.ZodObject<{
                shared_context: z.ZodOptional<z.ZodString>;
                skills_to_load: z.ZodOptional<z.ZodArray<z.ZodString>>;
                coordinator_notes: z.ZodOptional<z.ZodString>;
            }, z.core.$strip>>;
            error_context: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            project_key: string;
            agent_name: string;
            bead_id: string;
            epic_id: string;
            files_modified: string[];
            progress_percent: number;
            directives?: {
                shared_context?: string | undefined;
                skills_to_load?: string[] | undefined;
                coordinator_notes?: string | undefined;
            } | undefined;
            error_context?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_recover: {
        description: string;
        args: {
            project_key: z.ZodString;
            epic_id: z.ZodString;
        };
        execute(args: {
            project_key: string;
            epic_id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_branch: {
        description: string;
        args: {
            project_key: z.ZodString;
            agent_name: z.ZodString;
            bead_id: z.ZodString;
            epic_id: z.ZodString;
            branch_label: z.ZodString;
            branch_purpose: z.ZodString;
            files_modified: z.ZodArray<z.ZodString>;
            progress_percent: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            project_key: string;
            agent_name: string;
            bead_id: string;
            epic_id: string;
            branch_label: string;
            branch_purpose: string;
            files_modified: string[];
            progress_percent?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_return: {
        description: string;
        args: {
            project_key: z.ZodString;
            epic_id: z.ZodString;
            branch_label: z.ZodOptional<z.ZodString>;
            carry_back_learnings: z.ZodOptional<z.ZodString>;
            carry_back_files: z.ZodOptional<z.ZodArray<z.ZodString>>;
        };
        execute(args: {
            project_key: string;
            epic_id: string;
            branch_label?: string | undefined;
            carry_back_learnings?: string | undefined;
            carry_back_files?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_learn: {
        description: string;
        args: {
            summary: z.ZodString;
            pattern_type: z.ZodEnum<{
                "code-pattern": "code-pattern";
                "best-practice": "best-practice";
                gotcha: "gotcha";
                "tool-usage": "tool-usage";
                "domain-knowledge": "domain-knowledge";
                workflow: "workflow";
            }>;
            details: z.ZodString;
            example: z.ZodOptional<z.ZodString>;
            when_to_use: z.ZodString;
            files_context: z.ZodOptional<z.ZodArray<z.ZodString>>;
            create_skill: z.ZodOptional<z.ZodBoolean>;
            skill_name: z.ZodOptional<z.ZodString>;
            skill_tags: z.ZodOptional<z.ZodArray<z.ZodString>>;
        };
        execute(args: {
            summary: string;
            pattern_type: "code-pattern" | "best-practice" | "gotcha" | "tool-usage" | "domain-knowledge" | "workflow";
            details: string;
            when_to_use: string;
            example?: string | undefined;
            files_context?: string[] | undefined;
            create_skill?: boolean | undefined;
            skill_name?: string | undefined;
            skill_tags?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=swarm-orchestrate.d.ts.map