/**
 * Event Schema Validator
 *
 * Validates emitted events against their Zod schemas.
 * Catches:
 * - Type mismatches
 * - Missing required fields
 * - Undefined values that could break UI rendering
 * - Schema violations
 *
 * Used by:
 * - Swarm event emission (validateEvent before emit)
 * - Post-run validation (validateSwarmEvents for all events)
 * - Debug tooling (identify schema drift)
 */
import type { ZodError } from "zod";
export interface ValidationIssue {
    severity: "error" | "warning";
    category: "schema_mismatch" | "undefined_value" | "missing_field" | "type_error";
    message: string;
    location?: {
        event_type?: string;
        field?: string;
    };
    zodError?: ZodError;
}
export interface SchemaValidationResult {
    valid: boolean;
    issues: ValidationIssue[];
}
/**
 * Validate a single event against its schema
 *
 * Usage:
 * ```typescript
 * const result = validateEvent(event);
 * if (!result.valid) {
 *   console.error("Schema validation failed:", result.issues);
 * }
 * ```
 */
export declare function validateEvent(event: unknown): SchemaValidationResult;
/**
 * Validate all events from a swarm run
 *
 * Usage:
 * ```typescript
 * const { passed, issueCount } = await validateSwarmEvents(events);
 * if (!passed) {
 *   console.error(`Found ${issueCount} validation issues`);
 * }
 * ```
 */
export declare function validateSwarmEvents(events: unknown[]): Promise<{
    passed: boolean;
    issueCount: number;
}>;
//# sourceMappingURL=schema-validator.d.ts.map