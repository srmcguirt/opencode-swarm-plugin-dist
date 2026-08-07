/**
 * Skills Module for OpenCode
 *
 * Implements Anthropic's Agent Skills specification for OpenCode.
 * Skills are markdown files with YAML frontmatter that provide
 * domain-specific instructions the model can activate when relevant.
 *
 * Discovery locations (in priority order):
 * 1. {projectDir}/.opencode/skills/
 * 2. {projectDir}/.claude/skills/ (compatibility)
 * 3. {projectDir}/skills/ (simple projects)
 *
 * Skill format:
 * ```markdown
 * ---
 * name: my-skill
 * description: What it does. Use when X.
 * ---
 *
 * # Skill Instructions
 * ...
 * ```
 *
 * @module skills
 */
/**
 * Skill metadata from YAML frontmatter
 */
export interface SkillMetadata {
    /** Unique skill identifier (lowercase, hyphens) */
    name: string;
    /** Description of what the skill does and when to use it */
    description: string;
    /** Optional list of tools this skill works with */
    tools?: string[];
    /** Optional tags for categorization */
    tags?: string[];
}
/**
 * Full skill definition including content
 */
export interface Skill {
    /** Parsed frontmatter metadata */
    metadata: SkillMetadata;
    /** Raw markdown body (instructions) */
    body: string;
    /** Absolute path to the SKILL.md file */
    path: string;
    /** Directory containing the skill */
    directory: string;
    /** Whether this skill has executable scripts */
    hasScripts: boolean;
    /** List of script files in the skill directory */
    scripts: string[];
}
/**
 * Lightweight skill reference for listing
 */
export interface SkillRef {
    name: string;
    description: string;
    path: string;
    hasScripts: boolean;
}
/**
 * Role types for always-on guidance injection.
 */
export type AlwaysOnGuidanceRole = "coordinator" | "worker";
/**
 * Options for always-on guidance skill rendering.
 */
export interface AlwaysOnGuidanceOptions {
    role: AlwaysOnGuidanceRole;
    model?: string;
}
/**
 * Get the always-on guidance skill content for a role and model.
 */
export declare function getAlwaysOnGuidanceSkill(options: AlwaysOnGuidanceOptions): string;
/**
 * Set the project directory for skill discovery
 */
export declare function setSkillsProjectDirectory(dir: string): void;
/**
 * Parse YAML frontmatter from markdown content using gray-matter
 *
 * Handles the common frontmatter format:
 * ```
 * ---
 * key: value
 * ---
 * body content
 * ```
 */
export declare function parseFrontmatter(content: string): {
    metadata: Record<string, unknown>;
    body: string;
};
/**
 * Discover all skills in the project and global directories
 *
 * Priority order (first match wins):
 * 1. Project: .opencode/skills/
 * 2. Project: .claude/skills/
 * 3. Project: skills/
 * 4. Global: ~/.config/opencode/skills/
 * 5. Global: ~/.claude/skills/
 */
export declare function discoverSkills(projectDir?: string): Promise<Map<string, Skill>>;
/**
 * Get a single skill by name
 */
export declare function getSkill(name: string): Promise<Skill | null>;
/**
 * List all available skills (lightweight refs only)
 */
export declare function listSkills(): Promise<SkillRef[]>;
/**
 * Invalidate the skills cache (call when skills may have changed)
 */
export declare function invalidateSkillsCache(): void;
/**
 * List available skills with metadata
 *
 * Returns lightweight skill references for the model to evaluate
 * which skills are relevant to the current task.
 */
export declare const skills_list: {
    description: string;
    args: {
        tag: import("zod").ZodOptional<import("zod").ZodString>;
    };
    execute(args: {
        tag?: string | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Load and activate a skill by name
 *
 * Loads the full skill content for injection into context.
 * The skill's instructions become available for the model to follow.
 */
export declare const skills_use: {
    description: string;
    args: {
        name: import("zod").ZodString;
        include_scripts: import("zod").ZodOptional<import("zod").ZodBoolean>;
    };
    execute(args: {
        name: string;
        include_scripts?: boolean | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Execute a script from a skill
 *
 * Skills can include helper scripts in their scripts/ directory.
 * This tool runs them with appropriate context.
 */
export declare const skills_execute: {
    description: string;
    args: {
        skill: import("zod").ZodString;
        script: import("zod").ZodString;
        args: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        timeout_ms: import("zod").ZodOptional<import("zod").ZodNumber>;
    };
    execute(args: {
        skill: string;
        script: string;
        args?: string[] | undefined;
        timeout_ms?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Read a resource file from a skill directory
 *
 * Skills can include additional resources like examples, templates, or reference docs.
 */
export declare const skills_read: {
    description: string;
    args: {
        skill: import("zod").ZodString;
        file: import("zod").ZodString;
    };
    execute(args: {
        skill: string;
        file: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * CSO validation warnings for skill metadata
 */
export interface CSOValidationWarnings {
    /** Critical warnings (strong indicators of poor discoverability) */
    critical: string[];
    /** Suggestions for improvement */
    suggestions: string[];
}
/**
 * Validate skill metadata against Claude Search Optimization best practices
 *
 * Checks:
 * - 'Use when...' format in description
 * - Description length (warn > 500, max 1024)
 * - Third-person voice (no 'I', 'you')
 * - Name conventions (verb-first, gerunds, hyphens)
 *
 * @returns Warnings object with critical issues and suggestions
 */
export declare function validateCSOCompliance(name: string, description: string): CSOValidationWarnings;
/**
 * Create a new skill in the project
 *
 * Agents can use this to codify learned patterns, best practices,
 * or domain-specific knowledge into reusable skills.
 */
export declare const skills_create: {
    description: string;
    args: {
        name: import("zod").ZodString;
        description: import("zod").ZodString;
        body: import("zod").ZodString;
        tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        tools: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        directory: import("zod").ZodOptional<import("zod").ZodEnum<{
            global: "global";
            ".opencode/skill": ".opencode/skill";
            ".claude/skills": ".claude/skills";
            skill: "skill";
            "global-claude": "global-claude";
        }>>;
    };
    execute(args: {
        name: string;
        description: string;
        body: string;
        tags?: string[] | undefined;
        tools?: string[] | undefined;
        directory?: "global" | ".opencode/skill" | ".claude/skills" | "skill" | "global-claude" | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Update an existing skill
 *
 * Modify a skill's metadata or content based on learned improvements.
 */
export declare const skills_update: {
    description: string;
    args: {
        name: import("zod").ZodString;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        content: import("zod").ZodOptional<import("zod").ZodString>;
        body: import("zod").ZodOptional<import("zod").ZodString>;
        append_body: import("zod").ZodOptional<import("zod").ZodString>;
        tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        add_tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        tools: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
    };
    execute(args: {
        name: string;
        description?: string | undefined;
        content?: string | undefined;
        body?: string | undefined;
        append_body?: string | undefined;
        tags?: string[] | undefined;
        add_tags?: string[] | undefined;
        tools?: string[] | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Delete a skill from the project
 */
export declare const skills_delete: {
    description: string;
    args: {
        name: import("zod").ZodString;
        confirm: import("zod").ZodBoolean;
    };
    execute(args: {
        name: string;
        confirm: boolean;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Add a script to a skill
 *
 * Skills can include helper scripts for automation.
 */
export declare const skills_add_script: {
    description: string;
    args: {
        skill: import("zod").ZodString;
        script_name: import("zod").ZodString;
        content: import("zod").ZodString;
        executable: import("zod").ZodDefault<import("zod").ZodBoolean>;
    };
    execute(args: {
        skill: string;
        script_name: string;
        content: string;
        executable: boolean;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Reload all skills by clearing cache and re-scanning
 *
 * Enables Pi-inspired hot-reload workflow where agents can create/modify
 * a skill and test it in the same session without restart.
 */
export declare const skills_reload: {
    description: string;
    args: {};
    execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Initialize a new skill with full directory structure
 *
 * Creates a skill template following best practices from the
 * Anthropic Agent Skills specification and community patterns.
 */
export declare const skills_init: {
    description: string;
    args: {
        name: import("zod").ZodString;
        description: import("zod").ZodOptional<import("zod").ZodString>;
        directory: import("zod").ZodOptional<import("zod").ZodEnum<{
            global: "global";
            ".claude/skills": ".claude/skills";
            skills: "skills";
            ".opencode/skills": ".opencode/skills";
        }>>;
        include_example_script: import("zod").ZodDefault<import("zod").ZodBoolean>;
        include_reference: import("zod").ZodDefault<import("zod").ZodBoolean>;
    };
    execute(args: {
        name: string;
        include_example_script: boolean;
        include_reference: boolean;
        description?: string | undefined;
        directory?: "global" | ".claude/skills" | "skills" | ".opencode/skills" | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * All skills tools for plugin registration
 */
export declare const skillsTools: {
    skills_list: {
        description: string;
        args: {
            tag: import("zod").ZodOptional<import("zod").ZodString>;
        };
        execute(args: {
            tag?: string | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    skills_use: {
        description: string;
        args: {
            name: import("zod").ZodString;
            include_scripts: import("zod").ZodOptional<import("zod").ZodBoolean>;
        };
        execute(args: {
            name: string;
            include_scripts?: boolean | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    skills_execute: {
        description: string;
        args: {
            skill: import("zod").ZodString;
            script: import("zod").ZodString;
            args: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            timeout_ms: import("zod").ZodOptional<import("zod").ZodNumber>;
        };
        execute(args: {
            skill: string;
            script: string;
            args?: string[] | undefined;
            timeout_ms?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    skills_read: {
        description: string;
        args: {
            skill: import("zod").ZodString;
            file: import("zod").ZodString;
        };
        execute(args: {
            skill: string;
            file: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    skills_create: {
        description: string;
        args: {
            name: import("zod").ZodString;
            description: import("zod").ZodString;
            body: import("zod").ZodString;
            tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            tools: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            directory: import("zod").ZodOptional<import("zod").ZodEnum<{
                global: "global";
                ".opencode/skill": ".opencode/skill";
                ".claude/skills": ".claude/skills";
                skill: "skill";
                "global-claude": "global-claude";
            }>>;
        };
        execute(args: {
            name: string;
            description: string;
            body: string;
            tags?: string[] | undefined;
            tools?: string[] | undefined;
            directory?: "global" | ".opencode/skill" | ".claude/skills" | "skill" | "global-claude" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    skills_update: {
        description: string;
        args: {
            name: import("zod").ZodString;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            content: import("zod").ZodOptional<import("zod").ZodString>;
            body: import("zod").ZodOptional<import("zod").ZodString>;
            append_body: import("zod").ZodOptional<import("zod").ZodString>;
            tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            add_tags: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
            tools: import("zod").ZodOptional<import("zod").ZodArray<import("zod").ZodString>>;
        };
        execute(args: {
            name: string;
            description?: string | undefined;
            content?: string | undefined;
            body?: string | undefined;
            append_body?: string | undefined;
            tags?: string[] | undefined;
            add_tags?: string[] | undefined;
            tools?: string[] | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    skills_delete: {
        description: string;
        args: {
            name: import("zod").ZodString;
            confirm: import("zod").ZodBoolean;
        };
        execute(args: {
            name: string;
            confirm: boolean;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    skills_add_script: {
        description: string;
        args: {
            skill: import("zod").ZodString;
            script_name: import("zod").ZodString;
            content: import("zod").ZodString;
            executable: import("zod").ZodDefault<import("zod").ZodBoolean>;
        };
        execute(args: {
            skill: string;
            script_name: string;
            content: string;
            executable: boolean;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    skills_reload: {
        description: string;
        args: {};
        execute(args: Record<string, never>, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    skills_init: {
        description: string;
        args: {
            name: import("zod").ZodString;
            description: import("zod").ZodOptional<import("zod").ZodString>;
            directory: import("zod").ZodOptional<import("zod").ZodEnum<{
                global: "global";
                ".claude/skills": ".claude/skills";
                skills: "skills";
                ".opencode/skills": ".opencode/skills";
            }>>;
            include_example_script: import("zod").ZodDefault<import("zod").ZodBoolean>;
            include_reference: import("zod").ZodDefault<import("zod").ZodBoolean>;
        };
        execute(args: {
            name: string;
            include_example_script: boolean;
            include_reference: boolean;
            description?: string | undefined;
            directory?: "global" | ".claude/skills" | "skills" | ".opencode/skills" | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
/**
 * Get skill context for swarm task decomposition
 *
 * Returns a summary of available skills that can be referenced
 * in subtask prompts for specialized handling.
 */
export declare function getSkillsContextForSwarm(): Promise<string>;
/**
 * Find skills relevant to a task description
 *
 * Simple keyword matching to suggest skills for a task.
 * Returns skill names that may be relevant.
 */
export declare function findRelevantSkills(taskDescription: string): Promise<string[]>;
//# sourceMappingURL=skills.d.ts.map