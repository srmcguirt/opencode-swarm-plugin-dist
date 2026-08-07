/**
 * Anti-Pattern Learning Module
 *
 * Tracks failed decomposition patterns and auto-inverts them to anti-patterns.
 * When a pattern consistently fails, it gets flagged as something to avoid.
 *
 * @see https://github.com/Dicklesworthstone/cass_memory_system/blob/main/src/curate.ts#L95-L117
 */
import { z } from "zod";
/**
 * Pattern kind - whether this is a positive pattern or an anti-pattern
 */
export declare const PatternKindSchema: z.ZodEnum<{
    pattern: "pattern";
    anti_pattern: "anti_pattern";
}>;
export type PatternKind = z.infer<typeof PatternKindSchema>;
/**
 * Decomposition pattern with success/failure tracking.
 *
 * Field relationships:
 * - `kind`: Tracks pattern lifecycle ("pattern" → "anti_pattern" when failure rate exceeds threshold)
 * - `is_negative`: Derived boolean flag for quick filtering (true when kind === "anti_pattern")
 *
 * Both fields exist because:
 * - `kind` is the source of truth for pattern status
 * - `is_negative` enables efficient filtering without string comparison
 */
export declare const DecompositionPatternSchema: z.ZodObject<{
    id: z.ZodString;
    content: z.ZodString;
    kind: z.ZodEnum<{
        pattern: "pattern";
        anti_pattern: "anti_pattern";
    }>;
    is_negative: z.ZodBoolean;
    success_count: z.ZodDefault<z.ZodNumber>;
    failure_count: z.ZodDefault<z.ZodNumber>;
    created_at: z.ZodString;
    updated_at: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
    example_beads: z.ZodDefault<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
export type DecompositionPattern = z.infer<typeof DecompositionPatternSchema>;
/**
 * Result of pattern inversion
 */
export declare const PatternInversionResultSchema: z.ZodObject<{
    original: z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        kind: z.ZodEnum<{
            pattern: "pattern";
            anti_pattern: "anti_pattern";
        }>;
        is_negative: z.ZodBoolean;
        success_count: z.ZodDefault<z.ZodNumber>;
        failure_count: z.ZodDefault<z.ZodNumber>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
        example_beads: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    inverted: z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        kind: z.ZodEnum<{
            pattern: "pattern";
            anti_pattern: "anti_pattern";
        }>;
        is_negative: z.ZodBoolean;
        success_count: z.ZodDefault<z.ZodNumber>;
        failure_count: z.ZodDefault<z.ZodNumber>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
        example_beads: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    reason: z.ZodString;
}, z.core.$strip>;
export type PatternInversionResult = z.infer<typeof PatternInversionResultSchema>;
/**
 * Configuration for anti-pattern detection
 */
export interface AntiPatternConfig {
    /** Minimum observations before considering inversion */
    minObservations: number;
    /** Failure ratio threshold for inversion (0-1) */
    failureRatioThreshold: number;
    /** Prefix for anti-pattern content */
    antiPatternPrefix: string;
}
export declare const DEFAULT_ANTI_PATTERN_CONFIG: AntiPatternConfig;
/**
 * Check if a pattern should be inverted to an anti-pattern
 *
 * A pattern is inverted when:
 * 1. It has enough observations (minObservations)
 * 2. Its failure ratio exceeds the threshold
 *
 * @param pattern - The pattern to check
 * @param config - Anti-pattern configuration
 * @returns Whether the pattern should be inverted
 */
export declare function shouldInvertPattern(pattern: DecompositionPattern, config?: AntiPatternConfig): boolean;
/**
 * Invert a pattern to an anti-pattern
 *
 * Creates a new anti-pattern from a failing pattern.
 * The content is prefixed with "AVOID: " and the kind is changed.
 *
 * @param pattern - The pattern to invert
 * @param reason - Why the inversion is happening
 * @param config - Anti-pattern configuration
 * @returns The inverted anti-pattern
 */
export declare function invertToAntiPattern(pattern: DecompositionPattern, reason: string, config?: AntiPatternConfig): PatternInversionResult;
/**
 * Record a pattern observation (success or failure)
 *
 * Updates the pattern's success/failure counts and checks if
 * it should be inverted to an anti-pattern.
 *
 * @param pattern - The pattern to update
 * @param success - Whether this observation was successful
 * @param beadId - Optional bead ID to record as example
 * @param config - Anti-pattern configuration
 * @returns Updated pattern and optional inversion result
 */
export declare function recordPatternObservation(pattern: DecompositionPattern, success: boolean, beadId?: string, config?: AntiPatternConfig): {
    pattern: DecompositionPattern;
    inversion?: PatternInversionResult;
};
/**
 * Extract patterns from a decomposition description
 *
 * Looks for common decomposition strategies in the text.
 *
 * @param description - Decomposition description or reasoning
 * @returns Extracted pattern descriptions
 */
export declare function extractPatternsFromDescription(description: string): string[];
/**
 * Create a new pattern from a description
 *
 * @param content - Pattern description
 * @param tags - Optional tags for categorization
 * @returns New pattern
 */
export declare function createPattern(content: string, tags?: string[]): DecompositionPattern;
/**
 * Format anti-patterns for inclusion in decomposition prompts
 *
 * @param patterns - Anti-patterns to format
 * @returns Formatted string for prompt inclusion
 */
export declare function formatAntiPatternsForPrompt(patterns: DecompositionPattern[]): string;
/**
 * Format successful patterns for inclusion in prompts.
 *
 * @param patterns - Array of decomposition patterns to filter and format
 * @param minSuccessRate - Minimum success rate to include (default 0.7 = 70%).
 *   Chosen to filter out patterns with marginal track records - only patterns
 *   that succeed at least 70% of the time are recommended.
 * @returns Formatted string of successful patterns for prompt injection
 */
export declare function formatSuccessfulPatternsForPrompt(patterns: DecompositionPattern[], minSuccessRate?: number): string;
/**
 * Storage interface for decomposition patterns
 */
export interface PatternStorage {
    /** Store or update a pattern */
    store(pattern: DecompositionPattern): Promise<void>;
    /** Get a pattern by ID */
    get(id: string): Promise<DecompositionPattern | null>;
    /** Get all patterns */
    getAll(): Promise<DecompositionPattern[]>;
    /** Get all anti-patterns */
    getAntiPatterns(): Promise<DecompositionPattern[]>;
    /** Get patterns by tag */
    getByTag(tag: string): Promise<DecompositionPattern[]>;
    /** Find patterns matching content */
    findByContent(content: string): Promise<DecompositionPattern[]>;
}
/**
 * In-memory pattern storage (for testing and short-lived sessions)
 */
export declare class InMemoryPatternStorage implements PatternStorage {
    private patterns;
    store(pattern: DecompositionPattern): Promise<void>;
    get(id: string): Promise<DecompositionPattern | null>;
    getAll(): Promise<DecompositionPattern[]>;
    getAntiPatterns(): Promise<DecompositionPattern[]>;
    getByTag(tag: string): Promise<DecompositionPattern[]>;
    findByContent(content: string): Promise<DecompositionPattern[]>;
}
export declare const antiPatternSchemas: {
    PatternKindSchema: z.ZodEnum<{
        pattern: "pattern";
        anti_pattern: "anti_pattern";
    }>;
    DecompositionPatternSchema: z.ZodObject<{
        id: z.ZodString;
        content: z.ZodString;
        kind: z.ZodEnum<{
            pattern: "pattern";
            anti_pattern: "anti_pattern";
        }>;
        is_negative: z.ZodBoolean;
        success_count: z.ZodDefault<z.ZodNumber>;
        failure_count: z.ZodDefault<z.ZodNumber>;
        created_at: z.ZodString;
        updated_at: z.ZodString;
        reason: z.ZodOptional<z.ZodString>;
        tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
        example_beads: z.ZodDefault<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>;
    PatternInversionResultSchema: z.ZodObject<{
        original: z.ZodObject<{
            id: z.ZodString;
            content: z.ZodString;
            kind: z.ZodEnum<{
                pattern: "pattern";
                anti_pattern: "anti_pattern";
            }>;
            is_negative: z.ZodBoolean;
            success_count: z.ZodDefault<z.ZodNumber>;
            failure_count: z.ZodDefault<z.ZodNumber>;
            created_at: z.ZodString;
            updated_at: z.ZodString;
            reason: z.ZodOptional<z.ZodString>;
            tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
            example_beads: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>;
        inverted: z.ZodObject<{
            id: z.ZodString;
            content: z.ZodString;
            kind: z.ZodEnum<{
                pattern: "pattern";
                anti_pattern: "anti_pattern";
            }>;
            is_negative: z.ZodBoolean;
            success_count: z.ZodDefault<z.ZodNumber>;
            failure_count: z.ZodDefault<z.ZodNumber>;
            created_at: z.ZodString;
            updated_at: z.ZodString;
            reason: z.ZodOptional<z.ZodString>;
            tags: z.ZodDefault<z.ZodArray<z.ZodString>>;
            example_beads: z.ZodDefault<z.ZodArray<z.ZodString>>;
        }, z.core.$strip>;
        reason: z.ZodString;
    }, z.core.$strip>;
};
//# sourceMappingURL=anti-patterns.d.ts.map