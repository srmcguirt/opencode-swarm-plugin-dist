/**
 * Cell schemas for type-safe cell operations
 *
 * These schemas validate all data from the `bd` CLI to ensure
 * type safety and catch malformed responses early.
 *
 * Cells are work items in the Hive (honeycomb metaphor).
 * Backward compatibility: Bead* aliases provided for gradual migration.
 */
import { z } from "zod";
/** Valid cell statuses */
export declare const CellStatusSchema: z.ZodEnum<{
    open: "open";
    in_progress: "in_progress";
    blocked: "blocked";
    closed: "closed";
}>;
export type CellStatus = z.infer<typeof CellStatusSchema>;
/** Valid cell types */
export declare const CellTypeSchema: z.ZodEnum<{
    task: "task";
    bug: "bug";
    feature: "feature";
    epic: "epic";
    chore: "chore";
}>;
export type CellType = z.infer<typeof CellTypeSchema>;
/** Dependency relationship between cells */
export declare const CellDependencySchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        blocks: "blocks";
        "blocked-by": "blocked-by";
        related: "related";
        "discovered-from": "discovered-from";
    }>;
}, z.core.$strip>;
export type CellDependency = z.infer<typeof CellDependencySchema>;
/**
 * Core cell schema - validates bd CLI JSON output
 *
 * ID format:
 * - Standard: `{project}-{hash}` (e.g., `opencode-swarm-plugin-1i8`)
 * - Subtask: `{project}-{hash}.{index}` (e.g., `opencode-swarm-plugin-1i8.1`)
 * - Custom: `{project}-{custom-id}` (e.g., `migrate-egghead-phase-0`)
 * - Custom subtask: `{project}-{custom-id}.{suffix}` (e.g., `migrate-egghead-phase-0.e2e-test`)
 */
export declare const CellSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>>;
    priority: z.ZodDefault<z.ZodNumber>;
    issue_type: z.ZodDefault<z.ZodEnum<{
        task: "task";
        bug: "bug";
        feature: "feature";
        epic: "epic";
        chore: "chore";
    }>>;
    created_at: z.ZodString;
    updated_at: z.ZodOptional<z.ZodString>;
    closed_at: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            blocks: "blocks";
            "blocked-by": "blocked-by";
            related: "related";
            "discovered-from": "discovered-from";
        }>;
    }, z.core.$strip>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
export type Cell = z.infer<typeof CellSchema>;
/** Arguments for creating a cell */
export declare const CellCreateArgsSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<{
        task: "task";
        bug: "bug";
        feature: "feature";
        epic: "epic";
        chore: "chore";
    }>>;
    priority: z.ZodDefault<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CellCreateArgs = z.infer<typeof CellCreateArgsSchema>;
/** Arguments for updating a cell */
export declare const CellUpdateArgsSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>>;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
export type CellUpdateArgs = z.infer<typeof CellUpdateArgsSchema>;
/** Arguments for closing a cell */
export declare const CellCloseArgsSchema: z.ZodObject<{
    id: z.ZodString;
    reason: z.ZodString;
    result: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type CellCloseArgs = z.infer<typeof CellCloseArgsSchema>;
/** Arguments for querying cells */
export declare const CellQueryArgsSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>>;
    type: z.ZodOptional<z.ZodEnum<{
        task: "task";
        bug: "bug";
        feature: "feature";
        epic: "epic";
        chore: "chore";
    }>>;
    ready: z.ZodOptional<z.ZodBoolean>;
    parent_id: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type CellQueryArgs = z.infer<typeof CellQueryArgsSchema>;
/**
 * Subtask specification for epic decomposition
 *
 * Used when creating an epic with subtasks in one operation.
 * The `files` array is used for Agent Mail file reservations.
 */
export declare const SubtaskSpecSchema: z.ZodObject<{
    title: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    files: z.ZodDefault<z.ZodArray<z.ZodString>>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
    estimated_complexity: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
export type SubtaskSpec = z.infer<typeof SubtaskSpecSchema>;
/**
 * Cell tree for swarm decomposition
 *
 * Represents an epic with its subtasks, ready for spawning agents.
 */
export declare const CellTreeSchema: z.ZodObject<{
    epic: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
    subtasks: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        files: z.ZodDefault<z.ZodArray<z.ZodString>>;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
        estimated_complexity: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    strategy: z.ZodOptional<z.ZodEnum<{
        "file-based": "file-based";
        "feature-based": "feature-based";
        "risk-based": "risk-based";
        "research-based": "research-based";
    }>>;
}, z.core.$strip>;
export type CellTree = z.infer<typeof CellTreeSchema>;
/** Arguments for creating an epic with subtasks */
export declare const EpicCreateArgsSchema: z.ZodObject<{
    epic_title: z.ZodString;
    epic_description: z.ZodOptional<z.ZodString>;
    epic_id: z.ZodOptional<z.ZodString>;
    subtasks: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodOptional<z.ZodString>;
        priority: z.ZodDefault<z.ZodNumber>;
        files: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString>>>;
        id_suffix: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export type EpicCreateArgs = z.infer<typeof EpicCreateArgsSchema>;
/**
 * Result of epic creation
 *
 * Contains the created epic and all subtasks with their IDs.
 */
export declare const EpicCreateResultSchema: z.ZodObject<{
    success: z.ZodBoolean;
    epic: z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        status: z.ZodDefault<z.ZodEnum<{
            open: "open";
            in_progress: "in_progress";
            blocked: "blocked";
            closed: "closed";
        }>>;
        priority: z.ZodDefault<z.ZodNumber>;
        issue_type: z.ZodDefault<z.ZodEnum<{
            task: "task";
            bug: "bug";
            feature: "feature";
            epic: "epic";
            chore: "chore";
        }>>;
        created_at: z.ZodString;
        updated_at: z.ZodOptional<z.ZodString>;
        closed_at: z.ZodOptional<z.ZodString>;
        parent_id: z.ZodOptional<z.ZodString>;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            type: z.ZodEnum<{
                blocks: "blocks";
                "blocked-by": "blocked-by";
                related: "related";
                "discovered-from": "discovered-from";
            }>;
        }, z.core.$strip>>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>;
    subtasks: z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        title: z.ZodString;
        description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        status: z.ZodDefault<z.ZodEnum<{
            open: "open";
            in_progress: "in_progress";
            blocked: "blocked";
            closed: "closed";
        }>>;
        priority: z.ZodDefault<z.ZodNumber>;
        issue_type: z.ZodDefault<z.ZodEnum<{
            task: "task";
            bug: "bug";
            feature: "feature";
            epic: "epic";
            chore: "chore";
        }>>;
        created_at: z.ZodString;
        updated_at: z.ZodOptional<z.ZodString>;
        closed_at: z.ZodOptional<z.ZodString>;
        parent_id: z.ZodOptional<z.ZodString>;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodObject<{
            id: z.ZodString;
            type: z.ZodEnum<{
                blocks: "blocks";
                "blocked-by": "blocked-by";
                related: "related";
                "discovered-from": "discovered-from";
            }>;
        }, z.core.$strip>>>;
        metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
    }, z.core.$strip>>;
    rollback_hint: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export type EpicCreateResult = z.infer<typeof EpicCreateResultSchema>;
/** @deprecated Use CellStatusSchema instead */
export declare const BeadStatusSchema: z.ZodEnum<{
    open: "open";
    in_progress: "in_progress";
    blocked: "blocked";
    closed: "closed";
}>;
/** @deprecated Use CellStatus instead */
export type BeadStatus = CellStatus;
/** @deprecated Use CellTypeSchema instead */
export declare const BeadTypeSchema: z.ZodEnum<{
    task: "task";
    bug: "bug";
    feature: "feature";
    epic: "epic";
    chore: "chore";
}>;
/** @deprecated Use CellType instead */
export type BeadType = CellType;
/** @deprecated Use CellDependencySchema instead */
export declare const BeadDependencySchema: z.ZodObject<{
    id: z.ZodString;
    type: z.ZodEnum<{
        blocks: "blocks";
        "blocked-by": "blocked-by";
        related: "related";
        "discovered-from": "discovered-from";
    }>;
}, z.core.$strip>;
/** @deprecated Use CellDependency instead */
export type BeadDependency = CellDependency;
/** @deprecated Use CellSchema instead */
export declare const BeadSchema: z.ZodObject<{
    id: z.ZodString;
    title: z.ZodString;
    description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    status: z.ZodDefault<z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>>;
    priority: z.ZodDefault<z.ZodNumber>;
    issue_type: z.ZodDefault<z.ZodEnum<{
        task: "task";
        bug: "bug";
        feature: "feature";
        epic: "epic";
        chore: "chore";
    }>>;
    created_at: z.ZodString;
    updated_at: z.ZodOptional<z.ZodString>;
    closed_at: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
    dependencies: z.ZodDefault<z.ZodArray<z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            blocks: "blocks";
            "blocked-by": "blocked-by";
            related: "related";
            "discovered-from": "discovered-from";
        }>;
    }, z.core.$strip>>>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/** @deprecated Use Cell instead */
export type Bead = Cell;
/** @deprecated Use CellCreateArgsSchema instead */
export declare const BeadCreateArgsSchema: z.ZodObject<{
    title: z.ZodString;
    type: z.ZodDefault<z.ZodEnum<{
        task: "task";
        bug: "bug";
        feature: "feature";
        epic: "epic";
        chore: "chore";
    }>>;
    priority: z.ZodDefault<z.ZodNumber>;
    description: z.ZodOptional<z.ZodString>;
    parent_id: z.ZodOptional<z.ZodString>;
    id: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** @deprecated Use CellCreateArgs instead */
export type BeadCreateArgs = CellCreateArgs;
/** @deprecated Use CellUpdateArgsSchema instead */
export declare const BeadUpdateArgsSchema: z.ZodObject<{
    id: z.ZodString;
    status: z.ZodOptional<z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>>;
    description: z.ZodOptional<z.ZodString>;
    priority: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/** @deprecated Use CellUpdateArgs instead */
export type BeadUpdateArgs = CellUpdateArgs;
/** @deprecated Use CellCloseArgsSchema instead */
export declare const BeadCloseArgsSchema: z.ZodObject<{
    id: z.ZodString;
    reason: z.ZodString;
    result: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/** @deprecated Use CellCloseArgs instead */
export type BeadCloseArgs = CellCloseArgs;
/** @deprecated Use CellQueryArgsSchema instead */
export declare const BeadQueryArgsSchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>>;
    type: z.ZodOptional<z.ZodEnum<{
        task: "task";
        bug: "bug";
        feature: "feature";
        epic: "epic";
        chore: "chore";
    }>>;
    ready: z.ZodOptional<z.ZodBoolean>;
    parent_id: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
/** @deprecated Use CellQueryArgs instead */
export type BeadQueryArgs = CellQueryArgs;
/** @deprecated Use CellTreeSchema instead */
export declare const BeadTreeSchema: z.ZodObject<{
    epic: z.ZodObject<{
        title: z.ZodString;
        description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    }, z.core.$strip>;
    subtasks: z.ZodArray<z.ZodObject<{
        title: z.ZodString;
        description: z.ZodDefault<z.ZodOptional<z.ZodString>>;
        files: z.ZodDefault<z.ZodArray<z.ZodString>>;
        dependencies: z.ZodDefault<z.ZodArray<z.ZodNumber>>;
        estimated_complexity: z.ZodDefault<z.ZodNumber>;
    }, z.core.$strip>>;
    strategy: z.ZodOptional<z.ZodEnum<{
        "file-based": "file-based";
        "feature-based": "feature-based";
        "risk-based": "risk-based";
        "research-based": "research-based";
    }>>;
}, z.core.$strip>;
/** @deprecated Use CellTree instead */
export type BeadTree = CellTree;
//# sourceMappingURL=cell.d.ts.map