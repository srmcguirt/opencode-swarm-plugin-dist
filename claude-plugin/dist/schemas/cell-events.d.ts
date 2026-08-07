/**
 * Event Types for Cells Event Sourcing
 *
 * These events form an audit trail for all cell operations.
 * Events are NOT replayed for state reconstruction (cells uses hybrid CRUD + audit trail).
 * Events enable:
 * - Full audit history
 * - Debugging distributed swarm operations
 * - Learning from cell lifecycle patterns
 * - Integration with swarm-mail coordination
 *
 * Design notes:
 * - 75% reusable infrastructure from swarm-mail
 * - Events stay local (PGLite/SQLite), not written to JSONL
 * - JSONL export happens from projection snapshots (proven git merge driver)
 * - Follows same BaseEventSchema pattern as swarm-mail
 */
import { z } from "zod";
/**
 * Base fields present on all cell events
 */
export declare const BaseCellEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    type: z.ZodString;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Cell created
 *
 * Emitted when:
 * - User calls `hive create`
 * - Swarm epic decomposition creates subtasks
 * - Agent spawns new cells during work
 */
export declare const CellCreatedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_created">;
    cell_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    issue_type: z.ZodEnum<{
        task: "task";
        bug: "bug";
        feature: "feature";
        epic: "epic";
        chore: "chore";
    }>;
    priority: z.ZodNumber;
    parent_id: z.ZodOptional<z.ZodString>;
    created_by: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * Cell updated (generic field changes)
 *
 * Emitted for non-status field updates: title, description, priority
 */
export declare const CellUpdatedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_updated">;
    cell_id: z.ZodString;
    updated_by: z.ZodOptional<z.ZodString>;
    changes: z.ZodObject<{
        title: z.ZodOptional<z.ZodObject<{
            old: z.ZodString;
            new: z.ZodString;
        }, z.core.$strip>>;
        description: z.ZodOptional<z.ZodObject<{
            old: z.ZodString;
            new: z.ZodString;
        }, z.core.$strip>>;
        priority: z.ZodOptional<z.ZodObject<{
            old: z.ZodNumber;
            new: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * Cell status changed
 *
 * Separate event for status transitions to enable workflow analysis.
 * Tracks state machine: open → in_progress → (blocked | closed)
 */
export declare const CellStatusChangedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_status_changed">;
    cell_id: z.ZodString;
    from_status: z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>;
    to_status: z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>;
    changed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Cell closed
 *
 * Explicit close event (subset of status_changed for convenience).
 * Includes closure reason for audit trail.
 */
export declare const CellClosedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_closed">;
    cell_id: z.ZodString;
    reason: z.ZodString;
    closed_by: z.ZodOptional<z.ZodString>;
    files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
    duration_ms: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * Cell reopened
 *
 * Emitted when closed cell is reopened.
 */
export declare const CellReopenedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_reopened">;
    cell_id: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    reopened_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Cell deleted
 *
 * Hard delete event (rare - cells are usually closed, not deleted).
 * Useful for cleaning up spurious/duplicate cells.
 */
export declare const CellDeletedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_deleted">;
    cell_id: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    deleted_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Dependency added between cells
 *
 * Supports 4 relationship types:
 * - blocks: This cell blocks the target
 * - blocked-by: This cell is blocked by the target
 * - related: Informational link
 * - discovered-from: Cell spawned from investigation of target
 */
export declare const CellDependencyAddedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_dependency_added">;
    cell_id: z.ZodString;
    dependency: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            blocks: "blocks";
            "blocked-by": "blocked-by";
            related: "related";
            "discovered-from": "discovered-from";
        }>;
    }, z.core.$strip>;
    added_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Dependency removed
 *
 * Emitted when dependency is no longer relevant or was added in error.
 */
export declare const CellDependencyRemovedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_dependency_removed">;
    cell_id: z.ZodString;
    dependency: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            blocks: "blocks";
            "blocked-by": "blocked-by";
            related: "related";
            "discovered-from": "discovered-from";
        }>;
    }, z.core.$strip>;
    removed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Label added to cell
 *
 * Labels are string tags for categorization/filtering.
 * Common labels: "p0", "needs-review", "blocked-external", "tech-debt"
 */
export declare const CellLabelAddedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_label_added">;
    cell_id: z.ZodString;
    label: z.ZodString;
    added_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Label removed from cell
 */
export declare const CellLabelRemovedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_label_removed">;
    cell_id: z.ZodString;
    label: z.ZodString;
    removed_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Comment added to cell
 *
 * Supports agent-to-agent communication, human notes, and progress updates.
 */
export declare const CellCommentAddedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_added">;
    cell_id: z.ZodString;
    comment_id: z.ZodOptional<z.ZodNumber>;
    author: z.ZodString;
    body: z.ZodString;
    parent_comment_id: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * Comment updated (edit)
 */
export declare const CellCommentUpdatedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_updated">;
    cell_id: z.ZodString;
    comment_id: z.ZodNumber;
    old_body: z.ZodString;
    new_body: z.ZodString;
    updated_by: z.ZodString;
}, z.core.$strip>;
/**
 * Comment deleted
 */
export declare const CellCommentDeletedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_deleted">;
    cell_id: z.ZodString;
    comment_id: z.ZodNumber;
    deleted_by: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Child cell added to epic
 *
 * Emitted when:
 * - Epic created with subtasks (batch event for each child)
 * - User manually adds child via `hive add-child`
 * - Agent spawns additional subtask during work
 */
export declare const CellEpicChildAddedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_child_added">;
    cell_id: z.ZodString;
    child_id: z.ZodString;
    child_index: z.ZodOptional<z.ZodNumber>;
    added_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Child cell removed from epic
 *
 * Rare - usually happens when subtask is merged/consolidated.
 */
export declare const CellEpicChildRemovedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_child_removed">;
    cell_id: z.ZodString;
    child_id: z.ZodString;
    removed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Epic eligible for closure
 *
 * Emitted when all child cells are closed.
 * Triggers coordinator review for epic closure.
 */
export declare const CellEpicClosureEligibleEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_closure_eligible">;
    cell_id: z.ZodString;
    child_ids: z.ZodArray<z.ZodString>;
    total_duration_ms: z.ZodOptional<z.ZodNumber>;
    all_files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/**
 * Cell assigned to agent
 *
 * Links cells to swarm-mail's agent tracking.
 * Emitted when agent calls `cells_start` or swarm spawns worker.
 */
export declare const CellAssignedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_assigned">;
    cell_id: z.ZodString;
    agent_name: z.ZodString;
    task_description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * Cell work started
 *
 * Separate from status change to track actual work start time.
 * Useful for duration/velocity metrics.
 */
export declare const CellWorkStartedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_work_started">;
    cell_id: z.ZodString;
    agent_name: z.ZodString;
    reserved_files: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/**
 * Cell compacted
 *
 * Emitted when cell's event history is compressed (rare).
 * Follows steveyegge/beads pattern - old events archived, projection preserved.
 */
export declare const CellCompactedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_compacted">;
    cell_id: z.ZodString;
    events_archived: z.ZodNumber;
    new_start_sequence: z.ZodNumber;
}, z.core.$strip>;
export declare const CellEventSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_created">;
    cell_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    issue_type: z.ZodEnum<{
        task: "task";
        bug: "bug";
        feature: "feature";
        epic: "epic";
        chore: "chore";
    }>;
    priority: z.ZodNumber;
    parent_id: z.ZodOptional<z.ZodString>;
    created_by: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_updated">;
    cell_id: z.ZodString;
    updated_by: z.ZodOptional<z.ZodString>;
    changes: z.ZodObject<{
        title: z.ZodOptional<z.ZodObject<{
            old: z.ZodString;
            new: z.ZodString;
        }, z.core.$strip>>;
        description: z.ZodOptional<z.ZodObject<{
            old: z.ZodString;
            new: z.ZodString;
        }, z.core.$strip>>;
        priority: z.ZodOptional<z.ZodObject<{
            old: z.ZodNumber;
            new: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_status_changed">;
    cell_id: z.ZodString;
    from_status: z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>;
    to_status: z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>;
    changed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_closed">;
    cell_id: z.ZodString;
    reason: z.ZodString;
    closed_by: z.ZodOptional<z.ZodString>;
    files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
    duration_ms: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_reopened">;
    cell_id: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    reopened_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_deleted">;
    cell_id: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    deleted_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_dependency_added">;
    cell_id: z.ZodString;
    dependency: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            blocks: "blocks";
            "blocked-by": "blocked-by";
            related: "related";
            "discovered-from": "discovered-from";
        }>;
    }, z.core.$strip>;
    added_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_dependency_removed">;
    cell_id: z.ZodString;
    dependency: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            blocks: "blocks";
            "blocked-by": "blocked-by";
            related: "related";
            "discovered-from": "discovered-from";
        }>;
    }, z.core.$strip>;
    removed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_label_added">;
    cell_id: z.ZodString;
    label: z.ZodString;
    added_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_label_removed">;
    cell_id: z.ZodString;
    label: z.ZodString;
    removed_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_added">;
    cell_id: z.ZodString;
    comment_id: z.ZodOptional<z.ZodNumber>;
    author: z.ZodString;
    body: z.ZodString;
    parent_comment_id: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_updated">;
    cell_id: z.ZodString;
    comment_id: z.ZodNumber;
    old_body: z.ZodString;
    new_body: z.ZodString;
    updated_by: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_deleted">;
    cell_id: z.ZodString;
    comment_id: z.ZodNumber;
    deleted_by: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_child_added">;
    cell_id: z.ZodString;
    child_id: z.ZodString;
    child_index: z.ZodOptional<z.ZodNumber>;
    added_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_child_removed">;
    cell_id: z.ZodString;
    child_id: z.ZodString;
    removed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_closure_eligible">;
    cell_id: z.ZodString;
    child_ids: z.ZodArray<z.ZodString>;
    total_duration_ms: z.ZodOptional<z.ZodNumber>;
    all_files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_assigned">;
    cell_id: z.ZodString;
    agent_name: z.ZodString;
    task_description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_work_started">;
    cell_id: z.ZodString;
    agent_name: z.ZodString;
    reserved_files: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_compacted">;
    cell_id: z.ZodString;
    events_archived: z.ZodNumber;
    new_start_sequence: z.ZodNumber;
}, z.core.$strip>], "type">;
export type CellEvent = z.infer<typeof CellEventSchema>;
export type CellCreatedEvent = z.infer<typeof CellCreatedEventSchema>;
export type CellUpdatedEvent = z.infer<typeof CellUpdatedEventSchema>;
export type CellStatusChangedEvent = z.infer<typeof CellStatusChangedEventSchema>;
export type CellClosedEvent = z.infer<typeof CellClosedEventSchema>;
export type CellReopenedEvent = z.infer<typeof CellReopenedEventSchema>;
export type CellDeletedEvent = z.infer<typeof CellDeletedEventSchema>;
export type CellDependencyAddedEvent = z.infer<typeof CellDependencyAddedEventSchema>;
export type CellDependencyRemovedEvent = z.infer<typeof CellDependencyRemovedEventSchema>;
export type CellLabelAddedEvent = z.infer<typeof CellLabelAddedEventSchema>;
export type CellLabelRemovedEvent = z.infer<typeof CellLabelRemovedEventSchema>;
export type CellCommentAddedEvent = z.infer<typeof CellCommentAddedEventSchema>;
export type CellCommentUpdatedEvent = z.infer<typeof CellCommentUpdatedEventSchema>;
export type CellCommentDeletedEvent = z.infer<typeof CellCommentDeletedEventSchema>;
export type CellEpicChildAddedEvent = z.infer<typeof CellEpicChildAddedEventSchema>;
export type CellEpicChildRemovedEvent = z.infer<typeof CellEpicChildRemovedEventSchema>;
export type CellEpicClosureEligibleEvent = z.infer<typeof CellEpicClosureEligibleEventSchema>;
export type CellAssignedEvent = z.infer<typeof CellAssignedEventSchema>;
export type CellWorkStartedEvent = z.infer<typeof CellWorkStartedEventSchema>;
export type CellCompactedEvent = z.infer<typeof CellCompactedEventSchema>;
/**
 * Create a cell event with timestamp and validate
 *
 * Usage:
 * ```typescript
 * const event = createCellEvent("cell_created", {
 *   project_key: "/path/to/repo",
 *   cell_id: "bd-123",
 *   title: "Add auth",
 *   issue_type: "feature",
 *   priority: 2
 * });
 * ```
 */
export declare function createCellEvent<T extends CellEvent["type"]>(type: T, data: Omit<Extract<CellEvent, {
    type: T;
}>, "type" | "timestamp" | "id" | "sequence">): Extract<CellEvent, {
    type: T;
}>;
/**
 * Type guard for specific cell event types
 *
 * Usage:
 * ```typescript
 * if (isCellEventType(event, "cell_closed")) {
 *   console.log(event.reason); // TypeScript knows this is CellClosedEvent
 * }
 * ```
 */
export declare function isCellEventType<T extends CellEvent["type"]>(event: CellEvent, type: T): event is Extract<CellEvent, {
    type: T;
}>;
/**
 * Extract cell ID from event (convenience helper)
 *
 * All cell events have cell_id field (or it's the epic's cell_id for epic events).
 */
export declare function getCellIdFromEvent(event: CellEvent): string;
/**
 * Check if event represents a state transition
 */
export declare function isStateTransitionEvent(event: CellEvent): event is CellStatusChangedEvent | CellClosedEvent | CellReopenedEvent;
/**
 * Check if event represents an epic operation
 */
export declare function isEpicEvent(event: CellEvent): event is CellEpicChildAddedEvent | CellEpicChildRemovedEvent | CellEpicClosureEligibleEvent;
/**
 * Check if event was triggered by an agent (vs human user)
 */
export declare function isAgentEvent(event: CellEvent): boolean;
/**
 * @deprecated Use BaseCellEventSchema instead
 */
export declare const BaseBeadEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    type: z.ZodString;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * @deprecated Use CellCreatedEventSchema instead
 */
export declare const BeadCreatedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_created">;
    cell_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    issue_type: z.ZodEnum<{
        task: "task";
        bug: "bug";
        feature: "feature";
        epic: "epic";
        chore: "chore";
    }>;
    priority: z.ZodNumber;
    parent_id: z.ZodOptional<z.ZodString>;
    created_by: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * @deprecated Use CellUpdatedEventSchema instead
 */
export declare const BeadUpdatedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_updated">;
    cell_id: z.ZodString;
    updated_by: z.ZodOptional<z.ZodString>;
    changes: z.ZodObject<{
        title: z.ZodOptional<z.ZodObject<{
            old: z.ZodString;
            new: z.ZodString;
        }, z.core.$strip>>;
        description: z.ZodOptional<z.ZodObject<{
            old: z.ZodString;
            new: z.ZodString;
        }, z.core.$strip>>;
        priority: z.ZodOptional<z.ZodObject<{
            old: z.ZodNumber;
            new: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>;
/**
 * @deprecated Use CellStatusChangedEventSchema instead
 */
export declare const BeadStatusChangedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_status_changed">;
    cell_id: z.ZodString;
    from_status: z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>;
    to_status: z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>;
    changed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * @deprecated Use CellClosedEventSchema instead
 */
export declare const BeadClosedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_closed">;
    cell_id: z.ZodString;
    reason: z.ZodString;
    closed_by: z.ZodOptional<z.ZodString>;
    files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
    duration_ms: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>;
/**
 * @deprecated Use CellReopenedEventSchema instead
 */
export declare const BeadReopenedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_reopened">;
    cell_id: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    reopened_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * @deprecated Use CellDeletedEventSchema instead
 */
export declare const BeadDeletedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_deleted">;
    cell_id: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    deleted_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * @deprecated Use CellDependencyAddedEventSchema instead
 */
export declare const BeadDependencyAddedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_dependency_added">;
    cell_id: z.ZodString;
    dependency: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            blocks: "blocks";
            "blocked-by": "blocked-by";
            related: "related";
            "discovered-from": "discovered-from";
        }>;
    }, z.core.$strip>;
    added_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * @deprecated Use CellDependencyRemovedEventSchema instead
 */
export declare const BeadDependencyRemovedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_dependency_removed">;
    cell_id: z.ZodString;
    dependency: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            blocks: "blocks";
            "blocked-by": "blocked-by";
            related: "related";
            "discovered-from": "discovered-from";
        }>;
    }, z.core.$strip>;
    removed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * @deprecated Use CellLabelAddedEventSchema instead
 */
export declare const BeadLabelAddedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_label_added">;
    cell_id: z.ZodString;
    label: z.ZodString;
    added_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * @deprecated Use CellLabelRemovedEventSchema instead
 */
export declare const BeadLabelRemovedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_label_removed">;
    cell_id: z.ZodString;
    label: z.ZodString;
    removed_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * @deprecated Use CellCommentAddedEventSchema instead
 */
export declare const BeadCommentAddedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_added">;
    cell_id: z.ZodString;
    comment_id: z.ZodOptional<z.ZodNumber>;
    author: z.ZodString;
    body: z.ZodString;
    parent_comment_id: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>;
/**
 * @deprecated Use CellCommentUpdatedEventSchema instead
 */
export declare const BeadCommentUpdatedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_updated">;
    cell_id: z.ZodString;
    comment_id: z.ZodNumber;
    old_body: z.ZodString;
    new_body: z.ZodString;
    updated_by: z.ZodString;
}, z.core.$strip>;
/**
 * @deprecated Use CellCommentDeletedEventSchema instead
 */
export declare const BeadCommentDeletedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_deleted">;
    cell_id: z.ZodString;
    comment_id: z.ZodNumber;
    deleted_by: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * @deprecated Use CellEpicChildAddedEventSchema instead
 */
export declare const BeadEpicChildAddedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_child_added">;
    cell_id: z.ZodString;
    child_id: z.ZodString;
    child_index: z.ZodOptional<z.ZodNumber>;
    added_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * @deprecated Use CellEpicChildRemovedEventSchema instead
 */
export declare const BeadEpicChildRemovedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_child_removed">;
    cell_id: z.ZodString;
    child_id: z.ZodString;
    removed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * @deprecated Use CellEpicClosureEligibleEventSchema instead
 */
export declare const BeadEpicClosureEligibleEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_closure_eligible">;
    cell_id: z.ZodString;
    child_ids: z.ZodArray<z.ZodString>;
    total_duration_ms: z.ZodOptional<z.ZodNumber>;
    all_files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/**
 * @deprecated Use CellAssignedEventSchema instead
 */
export declare const BeadAssignedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_assigned">;
    cell_id: z.ZodString;
    agent_name: z.ZodString;
    task_description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
/**
 * @deprecated Use CellWorkStartedEventSchema instead
 */
export declare const BeadWorkStartedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_work_started">;
    cell_id: z.ZodString;
    agent_name: z.ZodString;
    reserved_files: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>;
/**
 * @deprecated Use CellCompactedEventSchema instead
 */
export declare const BeadCompactedEventSchema: z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_compacted">;
    cell_id: z.ZodString;
    events_archived: z.ZodNumber;
    new_start_sequence: z.ZodNumber;
}, z.core.$strip>;
/**
 * @deprecated Use CellEventSchema instead
 */
export declare const BeadEventSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_created">;
    cell_id: z.ZodString;
    title: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    issue_type: z.ZodEnum<{
        task: "task";
        bug: "bug";
        feature: "feature";
        epic: "epic";
        chore: "chore";
    }>;
    priority: z.ZodNumber;
    parent_id: z.ZodOptional<z.ZodString>;
    created_by: z.ZodOptional<z.ZodString>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_updated">;
    cell_id: z.ZodString;
    updated_by: z.ZodOptional<z.ZodString>;
    changes: z.ZodObject<{
        title: z.ZodOptional<z.ZodObject<{
            old: z.ZodString;
            new: z.ZodString;
        }, z.core.$strip>>;
        description: z.ZodOptional<z.ZodObject<{
            old: z.ZodString;
            new: z.ZodString;
        }, z.core.$strip>>;
        priority: z.ZodOptional<z.ZodObject<{
            old: z.ZodNumber;
            new: z.ZodNumber;
        }, z.core.$strip>>;
    }, z.core.$strip>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_status_changed">;
    cell_id: z.ZodString;
    from_status: z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>;
    to_status: z.ZodEnum<{
        open: "open";
        in_progress: "in_progress";
        blocked: "blocked";
        closed: "closed";
    }>;
    changed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_closed">;
    cell_id: z.ZodString;
    reason: z.ZodString;
    closed_by: z.ZodOptional<z.ZodString>;
    files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
    duration_ms: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_reopened">;
    cell_id: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    reopened_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_deleted">;
    cell_id: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
    deleted_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_dependency_added">;
    cell_id: z.ZodString;
    dependency: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            blocks: "blocks";
            "blocked-by": "blocked-by";
            related: "related";
            "discovered-from": "discovered-from";
        }>;
    }, z.core.$strip>;
    added_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_dependency_removed">;
    cell_id: z.ZodString;
    dependency: z.ZodObject<{
        id: z.ZodString;
        type: z.ZodEnum<{
            blocks: "blocks";
            "blocked-by": "blocked-by";
            related: "related";
            "discovered-from": "discovered-from";
        }>;
    }, z.core.$strip>;
    removed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_label_added">;
    cell_id: z.ZodString;
    label: z.ZodString;
    added_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_label_removed">;
    cell_id: z.ZodString;
    label: z.ZodString;
    removed_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_added">;
    cell_id: z.ZodString;
    comment_id: z.ZodOptional<z.ZodNumber>;
    author: z.ZodString;
    body: z.ZodString;
    parent_comment_id: z.ZodOptional<z.ZodNumber>;
    metadata: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_updated">;
    cell_id: z.ZodString;
    comment_id: z.ZodNumber;
    old_body: z.ZodString;
    new_body: z.ZodString;
    updated_by: z.ZodString;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_comment_deleted">;
    cell_id: z.ZodString;
    comment_id: z.ZodNumber;
    deleted_by: z.ZodString;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_child_added">;
    cell_id: z.ZodString;
    child_id: z.ZodString;
    child_index: z.ZodOptional<z.ZodNumber>;
    added_by: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_child_removed">;
    cell_id: z.ZodString;
    child_id: z.ZodString;
    removed_by: z.ZodOptional<z.ZodString>;
    reason: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_epic_closure_eligible">;
    cell_id: z.ZodString;
    child_ids: z.ZodArray<z.ZodString>;
    total_duration_ms: z.ZodOptional<z.ZodNumber>;
    all_files_touched: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_assigned">;
    cell_id: z.ZodString;
    agent_name: z.ZodString;
    task_description: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_work_started">;
    cell_id: z.ZodString;
    agent_name: z.ZodString;
    reserved_files: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>, z.ZodObject<{
    id: z.ZodOptional<z.ZodNumber>;
    project_key: z.ZodString;
    timestamp: z.ZodNumber;
    sequence: z.ZodOptional<z.ZodNumber>;
    type: z.ZodLiteral<"cell_compacted">;
    cell_id: z.ZodString;
    events_archived: z.ZodNumber;
    new_start_sequence: z.ZodNumber;
}, z.core.$strip>], "type">;
/**
 * @deprecated Use CellEvent instead
 */
export type BeadEvent = CellEvent;
/**
 * @deprecated Use CellCreatedEvent instead
 */
export type BeadCreatedEvent = CellCreatedEvent;
/**
 * @deprecated Use CellUpdatedEvent instead
 */
export type BeadUpdatedEvent = CellUpdatedEvent;
/**
 * @deprecated Use CellStatusChangedEvent instead
 */
export type BeadStatusChangedEvent = CellStatusChangedEvent;
/**
 * @deprecated Use CellClosedEvent instead
 */
export type BeadClosedEvent = CellClosedEvent;
/**
 * @deprecated Use CellReopenedEvent instead
 */
export type BeadReopenedEvent = CellReopenedEvent;
/**
 * @deprecated Use CellDeletedEvent instead
 */
export type BeadDeletedEvent = CellDeletedEvent;
/**
 * @deprecated Use CellDependencyAddedEvent instead
 */
export type BeadDependencyAddedEvent = CellDependencyAddedEvent;
/**
 * @deprecated Use CellDependencyRemovedEvent instead
 */
export type BeadDependencyRemovedEvent = CellDependencyRemovedEvent;
/**
 * @deprecated Use CellLabelAddedEvent instead
 */
export type BeadLabelAddedEvent = CellLabelAddedEvent;
/**
 * @deprecated Use CellLabelRemovedEvent instead
 */
export type BeadLabelRemovedEvent = CellLabelRemovedEvent;
/**
 * @deprecated Use CellCommentAddedEvent instead
 */
export type BeadCommentAddedEvent = CellCommentAddedEvent;
/**
 * @deprecated Use CellCommentUpdatedEvent instead
 */
export type BeadCommentUpdatedEvent = CellCommentUpdatedEvent;
/**
 * @deprecated Use CellCommentDeletedEvent instead
 */
export type BeadCommentDeletedEvent = CellCommentDeletedEvent;
/**
 * @deprecated Use CellEpicChildAddedEvent instead
 */
export type BeadEpicChildAddedEvent = CellEpicChildAddedEvent;
/**
 * @deprecated Use CellEpicChildRemovedEvent instead
 */
export type BeadEpicChildRemovedEvent = CellEpicChildRemovedEvent;
/**
 * @deprecated Use CellEpicClosureEligibleEvent instead
 */
export type BeadEpicClosureEligibleEvent = CellEpicClosureEligibleEvent;
/**
 * @deprecated Use CellAssignedEvent instead
 */
export type BeadAssignedEvent = CellAssignedEvent;
/**
 * @deprecated Use CellWorkStartedEvent instead
 */
export type BeadWorkStartedEvent = CellWorkStartedEvent;
/**
 * @deprecated Use CellCompactedEvent instead
 */
export type BeadCompactedEvent = CellCompactedEvent;
/**
 * @deprecated Use createCellEvent instead
 */
export declare const createBeadEvent: typeof createCellEvent;
/**
 * @deprecated Use isCellEventType instead
 */
export declare const isBeadEventType: typeof isCellEventType;
/**
 * @deprecated Use getCellIdFromEvent instead
 */
export declare const getBeadIdFromEvent: typeof getCellIdFromEvent;
//# sourceMappingURL=cell-events.d.ts.map