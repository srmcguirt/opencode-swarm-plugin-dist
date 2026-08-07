import { z } from "zod";
/**
 * Set working directory for ralph operations
 */
export declare function setRalphWorkingDirectory(directory: string): void;
/**
 * Get working directory for ralph operations
 */
export declare function getRalphWorkingDirectory(): string;
/**
 * Initialize a ralph project
 */
export declare const ralph_init: {
    description: string;
    args: {
        workdir: z.ZodOptional<z.ZodString>;
        project_name: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        use_hive: z.ZodOptional<z.ZodBoolean>;
    };
    execute(args: {
        project_name: string;
        workdir?: string | undefined;
        description?: string | undefined;
        use_hive?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Add a story to the PRD
 */
export declare const ralph_story: {
    description: string;
    args: {
        workdir: z.ZodOptional<z.ZodString>;
        title: z.ZodString;
        description: z.ZodString;
        priority: z.ZodOptional<z.ZodNumber>;
        validation_command: z.ZodOptional<z.ZodString>;
        acceptance_criteria: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        title: string;
        description: string;
        workdir?: string | undefined;
        priority?: number | undefined;
        validation_command?: string | undefined;
        acceptance_criteria?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Run a single iteration
 */
export declare const ralph_iterate: {
    description: string;
    args: {
        workdir: z.ZodOptional<z.ZodString>;
        model: z.ZodOptional<z.ZodString>;
        sandbox: z.ZodOptional<z.ZodString>;
        dry_run: z.ZodOptional<z.ZodBoolean>;
        timeout_ms: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        workdir?: string | undefined;
        model?: string | undefined;
        sandbox?: string | undefined;
        dry_run?: boolean | undefined;
        timeout_ms?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Run the full ralph loop
 */
export declare const ralph_loop: {
    description: string;
    args: {
        workdir: z.ZodOptional<z.ZodString>;
        max_iterations: z.ZodOptional<z.ZodNumber>;
        model: z.ZodOptional<z.ZodString>;
        sandbox: z.ZodOptional<z.ZodString>;
        stop_on_failure: z.ZodOptional<z.ZodBoolean>;
        auto_commit: z.ZodOptional<z.ZodBoolean>;
        sync: z.ZodOptional<z.ZodBoolean>;
    };
    execute(args: {
        workdir?: string | undefined;
        max_iterations?: number | undefined;
        model?: string | undefined;
        sandbox?: string | undefined;
        stop_on_failure?: boolean | undefined;
        auto_commit?: boolean | undefined;
        sync?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Get ralph status
 */
export declare const ralph_status: {
    description: string;
    args: {
        workdir: z.ZodOptional<z.ZodString>;
        job_id: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        workdir?: string | undefined;
        job_id?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Cancel a running loop
 */
export declare const ralph_cancel: {
    description: string;
    args: {
        job_id: z.ZodString;
    };
    execute(args: {
        job_id: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Review completed work
 */
export declare const ralph_review: {
    description: string;
    args: {
        workdir: z.ZodOptional<z.ZodString>;
        story_id: z.ZodString;
        approve: z.ZodBoolean;
        feedback: z.ZodOptional<z.ZodString>;
    };
    execute(args: {
        story_id: string;
        approve: boolean;
        workdir?: string | undefined;
        feedback?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export declare const ralphSupervisorTools: {
    ralph_init: {
        description: string;
        args: {
            workdir: z.ZodOptional<z.ZodString>;
            project_name: z.ZodString;
            description: z.ZodOptional<z.ZodString>;
            use_hive: z.ZodOptional<z.ZodBoolean>;
        };
        execute(args: {
            project_name: string;
            workdir?: string | undefined;
            description?: string | undefined;
            use_hive?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    ralph_story: {
        description: string;
        args: {
            workdir: z.ZodOptional<z.ZodString>;
            title: z.ZodString;
            description: z.ZodString;
            priority: z.ZodOptional<z.ZodNumber>;
            validation_command: z.ZodOptional<z.ZodString>;
            acceptance_criteria: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            title: string;
            description: string;
            workdir?: string | undefined;
            priority?: number | undefined;
            validation_command?: string | undefined;
            acceptance_criteria?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    ralph_iterate: {
        description: string;
        args: {
            workdir: z.ZodOptional<z.ZodString>;
            model: z.ZodOptional<z.ZodString>;
            sandbox: z.ZodOptional<z.ZodString>;
            dry_run: z.ZodOptional<z.ZodBoolean>;
            timeout_ms: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            workdir?: string | undefined;
            model?: string | undefined;
            sandbox?: string | undefined;
            dry_run?: boolean | undefined;
            timeout_ms?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    ralph_loop: {
        description: string;
        args: {
            workdir: z.ZodOptional<z.ZodString>;
            max_iterations: z.ZodOptional<z.ZodNumber>;
            model: z.ZodOptional<z.ZodString>;
            sandbox: z.ZodOptional<z.ZodString>;
            stop_on_failure: z.ZodOptional<z.ZodBoolean>;
            auto_commit: z.ZodOptional<z.ZodBoolean>;
            sync: z.ZodOptional<z.ZodBoolean>;
        };
        execute(args: {
            workdir?: string | undefined;
            max_iterations?: number | undefined;
            model?: string | undefined;
            sandbox?: string | undefined;
            stop_on_failure?: boolean | undefined;
            auto_commit?: boolean | undefined;
            sync?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    ralph_status: {
        description: string;
        args: {
            workdir: z.ZodOptional<z.ZodString>;
            job_id: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            workdir?: string | undefined;
            job_id?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    ralph_cancel: {
        description: string;
        args: {
            job_id: z.ZodString;
        };
        execute(args: {
            job_id: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    ralph_review: {
        description: string;
        args: {
            workdir: z.ZodOptional<z.ZodString>;
            story_id: z.ZodString;
            approve: z.ZodBoolean;
            feedback: z.ZodOptional<z.ZodString>;
        };
        execute(args: {
            story_id: string;
            approve: boolean;
            workdir?: string | undefined;
            feedback?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
export default ralphSupervisorTools;
//# sourceMappingURL=ralph-supervisor.d.ts.map