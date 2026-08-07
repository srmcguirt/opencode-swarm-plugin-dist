/**
 * Swarm Module - High-level swarm coordination
 *
 * This module re-exports from focused submodules for backward compatibility.
 * For new code, prefer importing from specific modules:
 * - swarm-strategies.ts - Strategy selection
 * - swarm-decompose.ts - Task decomposition
 * - swarm-prompts.ts - Prompt templates
 * - swarm-orchestrate.ts - Status and completion
 *
 * @module swarm
 */
export * from "./swarm-strategies";
export * from "./swarm-decompose";
export * from "./swarm-prompts";
export * from "./swarm-orchestrate";
export * from "./swarm-research";
export * from "./swarm-adversarial-review";
export * from "./swarm-verify";
export * from "./swarm-insights";
/**
 * Combined swarm tools for plugin registration.
 * Includes all tools from strategy, decompose, prompt, orchestrate, research, adversarial-review, verification, and insights modules.
 */
export declare const swarmTools: {
    swarm_get_strategy_insights: {
        description: string;
        args: {
            task: import("zod").ZodString;
        };
        execute(args: {
            task: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_get_file_insights: {
        description: string;
        args: {
            files: import("zod").ZodArray<import("zod").ZodString>;
        };
        execute(args: {
            files: string[];
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_get_pattern_insights: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_verify: {
        description: string;
        args: {
            files_touched: import("zod").ZodArray<import("zod").ZodString>;
            skip_verification: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            files_touched: string[];
            skip_verification?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_adversarial_review: {
        description: string;
        args: {
            diff: import("zod").ZodString;
            test_output: import("zod").ZodOptional<import("zod").ZodString>;
            is_hallucination_test: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            diff: string;
            test_output?: string | undefined;
            is_hallucination_test?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
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
    swarm_init: {
        description: string;
        args: {
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
            isolation: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodEnum<{
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
            epic_id: import("zod").ZodString;
            project_key: import("zod").ZodString;
        };
        execute(args: {
            epic_id: string;
            project_key: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_progress: {
        description: string;
        args: {
            project_key: import("zod").ZodString;
            agent_name: import("zod").ZodString;
            bead_id: import("zod").ZodString;
            status: import("zod").ZodEnum<{
                in_progress: "in_progress";
                blocked: "blocked";
                failed: "failed";
                completed: "completed";
            }>;
            message: import("zod").ZodOptional<import("zod").ZodString>;
            progress_percent: import("zod").ZodOptional<import("zod").ZodNumber>;
            files_touched: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
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
            project_path: import("zod").ZodString;
            agent_name: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            message: import("zod").ZodString;
            importance: import("zod").ZodDefault<import("zod").ZodEnum<{
                info: "info";
                warning: "warning";
                blocker: "blocker";
            }>>;
            files_affected: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
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
            project_key: import("zod").ZodString;
            agent_name: import("zod").ZodString;
            bead_id: import("zod").ZodString;
            summary: import("zod").ZodString;
            evaluation: import("zod").ZodOptional<import("zod").ZodString>;
            files_touched: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            skip_verification: import("zod").ZodOptional<import("zod").ZodBoolean>;
            planned_files: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            start_time: import("zod").ZodOptional<import("zod").ZodNumber>;
            error_count: import("zod").ZodOptional<import("zod").ZodNumber>;
            retry_count: import("zod").ZodOptional<import("zod").ZodNumber>;
            skip_review: import("zod").ZodOptional<import("zod").ZodBoolean>;
            commit_sha: import("zod").ZodOptional<import("zod").ZodString>;
            commit_message: import("zod").ZodOptional<import("zod").ZodString>;
            commit_branch: import("zod").ZodOptional<import("zod").ZodString>;
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
            bead_id: import("zod").ZodString;
            duration_ms: import("zod").ZodNumber;
            error_count: import("zod").ZodDefault<import("zod").ZodNumber>;
            retry_count: import("zod").ZodDefault<import("zod").ZodNumber>;
            success: import("zod").ZodBoolean;
            files_touched: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            criteria: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            strategy: import("zod").ZodOptional<import("zod").ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                "research-based": "research-based";
            }>>;
            failure_mode: import("zod").ZodOptional<import("zod").ZodEnum<{
                timeout: "timeout";
                unknown: "unknown";
                conflict: "conflict";
                validation: "validation";
                tool_failure: "tool_failure";
                context_overflow: "context_overflow";
                dependency_blocked: "dependency_blocked";
                user_cancelled: "user_cancelled";
            }>>;
            failure_details: import("zod").ZodOptional<import("zod").ZodString>;
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
            epic_id: import("zod").ZodOptional<import("zod").ZodString>;
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
            task: import("zod").ZodString;
            project_path: import("zod").ZodString;
            check_upgrades: import("zod").ZodOptional<import("zod").ZodBoolean>;
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
            bead_id: import("zod").ZodString;
            error_type: import("zod").ZodEnum<{
                timeout: "timeout";
                unknown: "unknown";
                conflict: "conflict";
                validation: "validation";
                tool_failure: "tool_failure";
            }>;
            message: import("zod").ZodString;
            stack_trace: import("zod").ZodOptional<import("zod").ZodString>;
            tool_name: import("zod").ZodOptional<import("zod").ZodString>;
            context: import("zod").ZodOptional<import("zod").ZodString>;
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
            bead_id: import("zod").ZodString;
            include_resolved: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            bead_id: string;
            include_resolved?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_resolve_error: {
        description: string;
        args: {
            error_id: import("zod").ZodString;
        };
        execute(args: {
            error_id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_check_strikes: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            action: import("zod").ZodEnum<{
                check: "check";
                add_strike: "add_strike";
                clear: "clear";
                get_prompt: "get_prompt";
            }>;
            attempt: import("zod").ZodOptional<import("zod").ZodString>;
            reason: import("zod").ZodOptional<import("zod").ZodString>;
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
            project_key: import("zod").ZodString;
            agent_name: import("zod").ZodString;
            bead_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            files_modified: import("zod").ZodArray<import("zod").ZodString>;
            progress_percent: import("zod").ZodNumber;
            directives: import("zod").ZodOptional<import("zod").ZodObject<{
                shared_context: import("zod").ZodOptional<import("zod").ZodString>;
                skills_to_load: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                coordinator_notes: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            error_context: import("zod").ZodOptional<import("zod").ZodString>;
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
            project_key: import("zod").ZodString;
            epic_id: import("zod").ZodString;
        };
        execute(args: {
            project_key: string;
            epic_id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_branch: {
        description: string;
        args: {
            project_key: import("zod").ZodString;
            agent_name: import("zod").ZodString;
            bead_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            branch_label: import("zod").ZodString;
            branch_purpose: import("zod").ZodString;
            files_modified: import("zod").ZodArray<import("zod").ZodString>;
            progress_percent: import("zod").ZodOptional<import("zod").ZodNumber>;
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
            project_key: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            branch_label: import("zod").ZodOptional<import("zod").ZodString>;
            carry_back_learnings: import("zod").ZodOptional<import("zod").ZodString>;
            carry_back_files: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
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
            summary: import("zod").ZodString;
            pattern_type: import("zod").ZodEnum<{
                "code-pattern": "code-pattern";
                "best-practice": "best-practice";
                gotcha: "gotcha";
                "tool-usage": "tool-usage";
                "domain-knowledge": "domain-knowledge";
                workflow: "workflow";
            }>;
            details: import("zod").ZodString;
            example: import("zod").ZodOptional<import("zod").ZodString>;
            when_to_use: import("zod").ZodString;
            files_context: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            create_skill: import("zod").ZodOptional<import("zod").ZodBoolean>;
            skill_name: import("zod").ZodOptional<import("zod").ZodString>;
            skill_tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
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
    swarm_subtask_prompt: {
        description: string;
        args: {
            agent_name: import("zod").ZodString;
            bead_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            subtask_title: import("zod").ZodString;
            subtask_description: import("zod").ZodOptional<import("zod").ZodString>;
            files: import("zod").ZodArray<import("zod").ZodString>;
            shared_context: import("zod").ZodOptional<import("zod").ZodString>;
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            agent_name: string;
            bead_id: string;
            epic_id: string;
            subtask_title: string;
            files: string[];
            subtask_description?: string | undefined;
            shared_context?: string | undefined;
            project_path?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_spawn_subtask: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            subtask_title: import("zod").ZodString;
            subtask_description: import("zod").ZodOptional<import("zod").ZodString>;
            files: import("zod").ZodArray<import("zod").ZodString>;
            shared_context: import("zod").ZodOptional<import("zod").ZodString>;
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
            recovery_context: import("zod").ZodOptional<import("zod").ZodObject<{
                shared_context: import("zod").ZodOptional<import("zod").ZodString>;
                skills_to_load: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
                coordinator_notes: import("zod").ZodOptional<import("zod").ZodString>;
            }, import("zod/v4/core").$strip>>;
            model: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            bead_id: string;
            epic_id: string;
            subtask_title: string;
            files: string[];
            subtask_description?: string | undefined;
            shared_context?: string | undefined;
            project_path?: string | undefined;
            recovery_context?: {
                shared_context?: string | undefined;
                skills_to_load?: string[] | undefined;
                coordinator_notes?: string | undefined;
            } | undefined;
            model?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_spawn_researcher: {
        description: string;
        args: {
            research_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            tech_stack: import("zod").ZodArray<import("zod").ZodString>;
            project_path: import("zod").ZodString;
            check_upgrades: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            research_id: string;
            epic_id: string;
            tech_stack: string[];
            project_path: string;
            check_upgrades?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_spawn_retry: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            epic_id: import("zod").ZodString;
            original_prompt: import("zod").ZodString;
            attempt: import("zod").ZodNumber;
            issues: import("zod").ZodString;
            diff: import("zod").ZodOptional<import("zod").ZodString>;
            files: import("zod").ZodArray<import("zod").ZodString>;
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            bead_id: string;
            epic_id: string;
            original_prompt: string;
            attempt: number;
            issues: string;
            files: string[];
            diff?: string | undefined;
            project_path?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_evaluation_prompt: {
        description: string;
        args: {
            bead_id: import("zod").ZodString;
            subtask_title: import("zod").ZodString;
            files_touched: import("zod").ZodArray<import("zod").ZodString>;
        };
        execute(args: {
            bead_id: string;
            subtask_title: string;
            files_touched: string[];
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_plan_prompt: {
        description: string;
        args: {
            task: import("zod").ZodString;
            strategy: import("zod").ZodOptional<import("zod").ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                auto: "auto";
            }>>;
            context: import("zod").ZodOptional<import("zod").ZodString>;
            query_cass: import("zod").ZodOptional<import("zod").ZodBoolean>;
            cass_limit: import("zod").ZodOptional<import("zod").ZodNumber>;
            include_skills: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            task: string;
            strategy?: "file-based" | "feature-based" | "risk-based" | "auto" | undefined;
            context?: string | undefined;
            query_cass?: boolean | undefined;
            cass_limit?: number | undefined;
            include_skills?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_decompose: {
        description: string;
        args: {
            task: import("zod").ZodString;
            context: import("zod").ZodOptional<import("zod").ZodString>;
            query_cass: import("zod").ZodOptional<import("zod").ZodBoolean>;
            cass_limit: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            task: string;
            context?: string | undefined;
            query_cass?: boolean | undefined;
            cass_limit?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_validate_decomposition: {
        description: string;
        args: {
            response: import("zod").ZodString;
            project_path: import("zod").ZodOptional<import("zod").ZodString>;
            task: import("zod").ZodOptional<import("zod").ZodString>;
            context: import("zod").ZodOptional<import("zod").ZodString>;
            strategy: import("zod").ZodOptional<import("zod").ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                auto: "auto";
            }>>;
            epic_id: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            response: string;
            project_path?: string | undefined;
            task?: string | undefined;
            context?: string | undefined;
            strategy?: "file-based" | "feature-based" | "risk-based" | "auto" | undefined;
            epic_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_delegate_planning: {
        description: string;
        args: {
            task: import("zod").ZodString;
            context: import("zod").ZodOptional<import("zod").ZodString>;
            strategy: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodEnum<{
                "file-based": "file-based";
                "feature-based": "feature-based";
                "risk-based": "risk-based";
                auto: "auto";
            }>>>;
            query_cass: import("zod").ZodDefault<import("zod").ZodOptional<import("zod").ZodBoolean>>;
        };
        execute(args: {
            task: string;
            strategy: "file-based" | "feature-based" | "risk-based" | "auto";
            query_cass: boolean;
            context?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_plan_interactive: {
        description: string;
        args: {
            task: import("zod").ZodString;
            mode: import("zod").ZodDefault<import("zod").ZodEnum<{
                auto: "auto";
                socratic: "socratic";
                fast: "fast";
                "confirm-only": "confirm-only";
            }>>;
            context: import("zod").ZodOptional<import("zod").ZodString>;
            user_response: import("zod").ZodOptional<import("zod").ZodString>;
            phase: import("zod").ZodOptional<import("zod").ZodEnum<{
                ready: "ready";
                alternatives: "alternatives";
                questioning: "questioning";
                recommendation: "recommendation";
            }>>;
        };
        execute(args: {
            task: string;
            mode: "auto" | "socratic" | "fast" | "confirm-only";
            context?: string | undefined;
            user_response?: string | undefined;
            phase?: "ready" | "alternatives" | "questioning" | "recommendation" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    swarm_select_strategy: {
        description: string;
        args: {
            task: import("zod").ZodString;
            codebase_context: import("zod").ZodOptional<import("zod").ZodString>;
            projectKey: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            task: string;
            codebase_context?: string | undefined;
            projectKey?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
//# sourceMappingURL=swarm.d.ts.map