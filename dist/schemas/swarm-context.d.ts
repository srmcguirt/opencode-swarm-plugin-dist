/**
 * Swarm Context Schemas
 *
 * These schemas define the structure for storing and recovering swarm execution context.
 * Used for checkpoint/recovery, continuation after crashes, and swarm state management.
 */
import { z } from "zod";
/**
 * Decomposition strategy used for the swarm
 */
export declare const SwarmStrategySchema: z.ZodEnum<{
    "file-based": "file-based";
    "feature-based": "feature-based";
    "risk-based": "risk-based";
}>;
export type SwarmStrategy = z.infer<typeof SwarmStrategySchema>;
/**
 * Shared directives and context for all agents in a swarm
 */
export declare const SwarmDirectivesSchema: z.ZodObject<{
    shared_context: z.ZodString;
    skills_to_load: z.ZodDefault<z.ZodArray<z.ZodString>>;
    coordinator_notes: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type SwarmDirectives = z.infer<typeof SwarmDirectivesSchema>;
/**
 * Recovery state for checkpoint/resume
 */
export declare const SwarmRecoverySchema: z.ZodObject<{
    last_checkpoint: z.ZodString;
    files_modified: z.ZodDefault<z.ZodArray<z.ZodString>>;
    progress_percent: z.ZodDefault<z.ZodNumber>;
    last_message: z.ZodDefault<z.ZodString>;
    error_context: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type SwarmRecovery = z.infer<typeof SwarmRecoverySchema>;
/**
 * Complete context for a single bead in a swarm
 *
 * Stored in swarm_contexts table for recovery, continuation, and state management.
 */
export declare const SwarmBeadContextSchema: z.ZodObject<{
    id: z.ZodString;
    epic_id: z.ZodString;
    bead_id: z.ZodString;
    strategy: z.ZodEnum<{
        "file-based": "file-based";
        "feature-based": "feature-based";
        "risk-based": "risk-based";
    }>;
    files: z.ZodArray<z.ZodString>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString>>;
    directives: z.ZodObject<{
        shared_context: z.ZodString;
        skills_to_load: z.ZodDefault<z.ZodArray<z.ZodString>>;
        coordinator_notes: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
    recovery: z.ZodObject<{
        last_checkpoint: z.ZodString;
        files_modified: z.ZodDefault<z.ZodArray<z.ZodString>>;
        progress_percent: z.ZodDefault<z.ZodNumber>;
        last_message: z.ZodDefault<z.ZodString>;
        error_context: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    created_at: z.ZodNumber;
    updated_at: z.ZodNumber;
}, z.core.$strip>;
export type SwarmBeadContext = z.infer<typeof SwarmBeadContextSchema>;
/**
 * Args for creating a swarm context
 */
export declare const CreateSwarmContextArgsSchema: z.ZodObject<{
    epic_id: z.ZodString;
    bead_id: z.ZodString;
    strategy: z.ZodEnum<{
        "file-based": "file-based";
        "feature-based": "feature-based";
        "risk-based": "risk-based";
    }>;
    files: z.ZodArray<z.ZodString>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodString>>;
    directives: z.ZodObject<{
        shared_context: z.ZodString;
        skills_to_load: z.ZodDefault<z.ZodArray<z.ZodString>>;
        coordinator_notes: z.ZodDefault<z.ZodString>;
    }, z.core.$strip>;
    recovery: z.ZodObject<{
        last_checkpoint: z.ZodString;
        files_modified: z.ZodDefault<z.ZodArray<z.ZodString>>;
        progress_percent: z.ZodDefault<z.ZodNumber>;
        last_message: z.ZodDefault<z.ZodString>;
        error_context: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateSwarmContextArgs = z.infer<typeof CreateSwarmContextArgsSchema>;
/**
 * Args for updating a swarm context
 */
export declare const UpdateSwarmContextArgsSchema: z.ZodObject<{
    id: z.ZodString;
    recovery: z.ZodOptional<z.ZodObject<{
        last_checkpoint: z.ZodOptional<z.ZodString>;
        files_modified: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>;
        progress_percent: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
        last_message: z.ZodOptional<z.ZodDefault<z.ZodString>>;
        error_context: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>>;
    files: z.ZodOptional<z.ZodArray<z.ZodString>>;
    dependencies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    directives: z.ZodOptional<z.ZodObject<{
        shared_context: z.ZodOptional<z.ZodString>;
        skills_to_load: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString>>>;
        coordinator_notes: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type UpdateSwarmContextArgs = z.infer<typeof UpdateSwarmContextArgsSchema>;
/**
 * Args for querying swarm contexts
 */
export declare const QuerySwarmContextsArgsSchema: z.ZodObject<{
    epic_id: z.ZodOptional<z.ZodString>;
    bead_id: z.ZodOptional<z.ZodString>;
    strategy: z.ZodOptional<z.ZodEnum<{
        "file-based": "file-based";
        "feature-based": "feature-based";
        "risk-based": "risk-based";
    }>>;
    has_errors: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export type QuerySwarmContextsArgs = z.infer<typeof QuerySwarmContextsArgsSchema>;
//# sourceMappingURL=swarm-context.d.ts.map