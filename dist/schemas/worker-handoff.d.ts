/**
 * WorkerHandoff schemas - structured contracts replacing prose instructions
 *
 * Replaces the 400-line SUBTASK_PROMPT_V2 with machine-readable contracts.
 * Workers receive typed handoffs with explicit files, criteria, and escalation paths.
 */
import { z } from "zod";
/**
 * Contract section - the binding agreement between coordinator and worker
 *
 * Defines:
 * - What task to complete (task_id)
 * - What files to modify (files_owned) vs read (files_readonly)
 * - What's already done (dependencies_completed)
 * - How to know you're done (success_criteria)
 */
export declare const WorkerHandoffContractSchema: z.ZodObject<{
    task_id: z.ZodString;
    files_owned: z.ZodDefault<z.ZodArray<z.ZodString>>;
    files_readonly: z.ZodDefault<z.ZodArray<z.ZodString>>;
    dependencies_completed: z.ZodDefault<z.ZodArray<z.ZodString>>;
    success_criteria: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type WorkerHandoffContract = z.infer<typeof WorkerHandoffContractSchema>;
/**
 * Context section - the narrative explaining the "why"
 *
 * Provides:
 * - Big picture (epic_summary)
 * - This worker's specific role
 * - What's already been done
 * - What comes after
 */
export declare const WorkerHandoffContextSchema: z.ZodObject<{
    epic_summary: z.ZodString;
    your_role: z.ZodString;
    what_others_did: z.ZodString;
    what_comes_next: z.ZodString;
}, z.core.$strip>;
export type WorkerHandoffContext = z.infer<typeof WorkerHandoffContextSchema>;
/**
 * Escalation section - what to do when things go wrong
 *
 * Defines:
 * - How to report blockers
 * - Protocol for scope changes
 */
export declare const WorkerHandoffEscalationSchema: z.ZodObject<{
    blocked_contact: z.ZodString;
    scope_change_protocol: z.ZodString;
}, z.core.$strip>;
export type WorkerHandoffEscalation = z.infer<typeof WorkerHandoffEscalationSchema>;
/**
 * Complete WorkerHandoff - combines all three sections
 *
 * This is the full structured contract that replaces prose instructions.
 */
export declare const WorkerHandoffSchema: z.ZodObject<{
    contract: z.ZodObject<{
        task_id: z.ZodString;
        files_owned: z.ZodDefault<z.ZodArray<z.ZodString>>;
        files_readonly: z.ZodDefault<z.ZodArray<z.ZodString>>;
        dependencies_completed: z.ZodDefault<z.ZodArray<z.ZodString>>;
        success_criteria: z.ZodArray<z.ZodString>;
    }, z.core.$strip>;
    context: z.ZodObject<{
        epic_summary: z.ZodString;
        your_role: z.ZodString;
        what_others_did: z.ZodString;
        what_comes_next: z.ZodString;
    }, z.core.$strip>;
    escalation: z.ZodObject<{
        blocked_contact: z.ZodString;
        scope_change_protocol: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export type WorkerHandoff = z.infer<typeof WorkerHandoffSchema>;
//# sourceMappingURL=worker-handoff.d.ts.map