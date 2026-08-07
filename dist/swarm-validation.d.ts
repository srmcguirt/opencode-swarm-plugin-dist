/**
 * Swarm Validation Hook Infrastructure
 *
 * Provides validation event types and hooks for post-swarm validation.
 * Integrates with swarm-mail event sourcing to emit validation events.
 *
 * @module swarm-validation
 */
import { z } from "zod";
/**
 * Agent event type for validation events
 *
 * This is a minimal type that matches the swarm-mail AgentEvent interface
 * for the validation events we emit.
 */
type AgentEvent = {
    type: "validation_started";
    project_key: string;
    timestamp: number;
    epic_id: string;
    swarm_id: string;
    started_at: number;
} | {
    type: "validation_issue";
    project_key: string;
    timestamp: string | number;
    epic_id: string;
    severity: "error" | "warning" | "info";
    category: "schema_mismatch" | "missing_event" | "undefined_value" | "dashboard_render" | "websocket_delivery";
    message: string;
    location?: {
        event_type?: string;
        field?: string;
        component?: string;
    };
} | {
    type: "validation_completed";
    project_key: string;
    timestamp: number;
    epic_id: string;
    swarm_id: string;
    passed: boolean;
    issue_count: number;
    duration_ms: number;
};
/**
 * Severity levels for validation issues
 */
export declare const ValidationIssueSeverity: z.ZodEnum<{
    error: "error";
    info: "info";
    warning: "warning";
}>;
/**
 * Categories of validation issues
 */
export declare const ValidationIssueCategory: z.ZodEnum<{
    schema_mismatch: "schema_mismatch";
    missing_event: "missing_event";
    undefined_value: "undefined_value";
    dashboard_render: "dashboard_render";
    websocket_delivery: "websocket_delivery";
}>;
/**
 * Validation issue with location context
 */
export declare const ValidationIssueSchema: z.ZodObject<{
    severity: z.ZodEnum<{
        error: "error";
        info: "info";
        warning: "warning";
    }>;
    category: z.ZodEnum<{
        schema_mismatch: "schema_mismatch";
        missing_event: "missing_event";
        undefined_value: "undefined_value";
        dashboard_render: "dashboard_render";
        websocket_delivery: "websocket_delivery";
    }>;
    message: z.ZodString;
    location: z.ZodOptional<z.ZodObject<{
        event_type: z.ZodOptional<z.ZodString>;
        field: z.ZodOptional<z.ZodString>;
        component: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type ValidationIssue = z.infer<typeof ValidationIssueSchema>;
/**
 * Context for validation execution
 */
export interface ValidationContext {
    /** Project key (path) */
    project_key: string;
    /** Epic ID being validated */
    epic_id: string;
    /** Swarm ID being validated */
    swarm_id: string;
    /** Validation start time */
    started_at: Date;
    /** Event emitter function */
    emit: (event: AgentEvent) => Promise<void>;
}
/**
 * Run post-swarm validation
 *
 * Emits validation_started, runs validators, emits validation_issue for each issue,
 * and emits validation_completed with summary.
 *
 * @param ctx - Validation context
 * @param events - Events to validate
 * @returns Validation result with passed flag and issues
 */
export declare function runPostSwarmValidation(ctx: ValidationContext, events: unknown[]): Promise<{
    passed: boolean;
    issues: ValidationIssue[];
}>;
/**
 * Report a validation issue
 *
 * Emits a validation_issue event with the provided issue details.
 *
 * @param ctx - Validation context
 * @param issue - Validation issue to report
 */
export declare function reportIssue(ctx: ValidationContext, issue: ValidationIssue): Promise<void>;
export {};
//# sourceMappingURL=swarm-validation.d.ts.map