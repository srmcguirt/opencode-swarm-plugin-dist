import { z, type ZodSchema } from "zod";
/**
 * Structured validation error with formatted feedback
 *
 * Contains both raw Zod errors for programmatic access and
 * pre-formatted error bullets suitable for retry prompts.
 */
export declare class StructuredValidationError extends Error {
    readonly zodError: z.ZodError | null;
    readonly rawInput: string;
    readonly extractionMethod?: string | undefined;
    readonly errorBullets: string[];
    constructor(message: string, zodError: z.ZodError | null, rawInput: string, extractionMethod?: string | undefined);
    /**
     * Format errors as bullet list for retry prompts
     */
    toFeedback(): string;
}
/**
 * Error when JSON cannot be extracted from text
 */
export declare class JsonExtractionError extends Error {
    readonly rawInput: string;
    readonly attemptedStrategies: string[];
    constructor(message: string, rawInput: string, attemptedStrategies: string[]);
}
/**
 * Format Zod validation errors as readable bullet points
 *
 * @param error - Zod error from schema validation
 * @returns Array of error messages suitable for feedback
 */
declare function formatZodErrors(error: z.ZodError): string[];
/**
 * Get schema by name from registry
 */
declare function getSchemaByName(name: string): ZodSchema;
/**
 * Extract JSON from text using multiple strategies.
 *
 * Strategies tried in priority order:
 * 1. Direct parse - fastest, works for clean JSON
 * 2. JSON code block - common in markdown responses
 * 3. Generic code block - fallback for unlabeled blocks
 * 4. First brace match - finds outermost {...}
 * 5. Last brace match - handles trailing content
 * 6. Repair attempt - fixes common issues (quotes, trailing commas)
 *
 * @param text Raw text potentially containing JSON
 * @returns Parsed JSON object or null if all strategies fail
 */
declare function extractJsonFromText(text: string): [unknown, string];
/**
 * Extract JSON from markdown/text response
 *
 * Tries multiple extraction strategies in order:
 * 1. Direct JSON parse
 * 2. ```json code blocks
 * 3. Any code blocks
 * 4. Brace matching for objects
 * 5. Bracket matching for arrays
 * 6. JSON repair attempts
 */
export declare const structured_extract_json: {
    description: string;
    args: {
        text: z.ZodString;
    };
    execute(args: {
        text: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Validate agent response against a named schema
 *
 * Extracts JSON from the response using multiple strategies,
 * then validates against the specified schema.
 */
export declare const structured_validate: {
    description: string;
    args: {
        response: z.ZodString;
        schema_name: z.ZodEnum<{
            evaluation: "evaluation";
            task_decomposition: "task_decomposition";
            cell_tree: "cell_tree";
        }>;
        max_retries: z.ZodOptional<z.ZodNumber>;
    };
    execute(args: {
        response: string;
        schema_name: "evaluation" | "task_decomposition" | "cell_tree";
        max_retries?: number | undefined;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Parse and validate evaluation response from an agent
 *
 * Specialized tool for parsing self-evaluations. Returns
 * the validated Evaluation or structured errors.
 */
export declare const structured_parse_evaluation: {
    description: string;
    args: {
        response: z.ZodString;
    };
    execute(args: {
        response: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Parse and validate task decomposition response
 *
 * Specialized tool for parsing decomposition results.
 * Validates the structure and returns file lists for reservations.
 */
export declare const structured_parse_decomposition: {
    description: string;
    args: {
        response: z.ZodString;
    };
    execute(args: {
        response: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
/**
 * Parse and validate a bead tree (epic with subtasks)
 *
 * Validates the structure before creating cells.
 */
export declare const structured_parse_cell_tree: {
    description: string;
    args: {
        response: z.ZodString;
    };
    execute(args: {
        response: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
export { extractJsonFromText, formatZodErrors, getSchemaByName };
export declare const structuredTools: {
    structured_extract_json: {
        description: string;
        args: {
            text: z.ZodString;
        };
        execute(args: {
            text: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    structured_validate: {
        description: string;
        args: {
            response: z.ZodString;
            schema_name: z.ZodEnum<{
                evaluation: "evaluation";
                task_decomposition: "task_decomposition";
                cell_tree: "cell_tree";
            }>;
            max_retries: z.ZodOptional<z.ZodNumber>;
        };
        execute(args: {
            response: string;
            schema_name: "evaluation" | "task_decomposition" | "cell_tree";
            max_retries?: number | undefined;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    structured_parse_evaluation: {
        description: string;
        args: {
            response: z.ZodString;
        };
        execute(args: {
            response: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    structured_parse_decomposition: {
        description: string;
        args: {
            response: z.ZodString;
        };
        execute(args: {
            response: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
    structured_parse_cell_tree: {
        description: string;
        args: {
            response: z.ZodString;
        };
        execute(args: {
            response: string;
        }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
    };
};
/** @deprecated Use structured_parse_cell_tree instead */
export declare const structured_parse_bead_tree: {
    description: string;
    args: {
        response: z.ZodString;
    };
    execute(args: {
        response: string;
    }, context: import("@opencode-ai/plugin").ToolContext): Promise<string>;
};
//# sourceMappingURL=structured.d.ts.map