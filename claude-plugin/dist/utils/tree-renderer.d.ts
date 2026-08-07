/**
 * @fileoverview Tree visualization utilities for cell hierarchies
 *
 * Inspired by Chainlink's tree command.
 * Credit: https://github.com/dollspace-gay/chainlink
 *
 * Renders cell/epic hierarchies with box-drawing characters and rich indicators:
 * - [x] closed, [ ] open, [~] in_progress, [!] blocked
 * - Priority coloring: P0/P1 = red, P2 = yellow, P3+ = default
 * - Blocker IDs: [B: abc12, def34] for blocked cells
 * - Epic completion: (3/5 done)
 * - Proper tree connectors: ├──, └──, │
 */
import type { Cell } from "swarm-mail";
export declare const ansi: {
    red: (s: string) => string;
    yellow: (s: string) => string;
    green: (s: string) => string;
    dim: (s: string) => string;
    bold: (s: string) => string;
    /**
     * Strip ANSI escape codes for length calculation
     */
    strip: (s: string) => string;
};
export interface TreeNode {
    cell: Cell;
    children: TreeNode[];
}
export interface CellDisplay {
    title: string;
    type: string;
    status: string;
    priority: number;
    blocked: boolean;
}
/**
 * Blocker info map: cell_id -> array of blocker cell IDs
 */
export type BlockerMap = Map<string, string[]>;
/**
 * Options for rendering the tree
 */
export interface TreeRenderOptions {
    /** Map of cell_id -> blocker IDs */
    blockers?: BlockerMap;
    /** Terminal width for truncation (default: process.stdout.columns || 80) */
    terminalWidth?: number;
}
/**
 * Get status marker in checkbox style
 */
export declare function getStatusMarker(status: string): string;
/**
 * Get status indicator character (legacy, kept for compatibility)
 */
export declare function getStatusIndicator(status: string): string;
/**
 * Get priority label (P0-P3)
 */
export declare function getPriorityLabel(priority: number): string;
/**
 * Apply priority coloring to a string
 * P0/P1 = red, P2 = yellow, P3+ = default
 */
export declare function colorByPriority(text: string, priority: number): string;
/**
 * Count closed children for epic completion display
 */
export declare function getEpicCompletion(node: TreeNode): {
    done: number;
    total: number;
};
/**
 * Format epic completion string: (3/5 done)
 */
export declare function formatEpicCompletion(node: TreeNode): string;
/**
 * Shorten a cell ID to last 5 characters for display
 */
export declare function shortId(id: string): string;
/**
 * Format blocker suffix: [B: abc12, def34]
 */
export declare function formatBlockers(blockerIds: string[]): string;
/**
 * Format a single cell line with status marker, ID, title, priority, epic completion, and blockers
 */
export declare function formatCellLine(node: TreeNode, options?: TreeRenderOptions): string;
/**
 * Truncate a line to fit terminal width, accounting for ANSI codes
 */
export declare function truncateLine(line: string, maxWidth: number): string;
/**
 * Build tree structure from flat cell list
 *
 * Algorithm:
 * 1. Create map of id -> TreeNode
 * 2. For each cell, find parent and attach as child
 * 3. Return nodes without parents as roots
 */
export declare function buildTreeStructure(cells: Cell[]): TreeNode[];
/**
 * Render a tree node with box-drawing characters
 *
 * @param node - The node to render
 * @param prefix - Prefix string for indentation (tree connectors for parent levels)
 * @param isLast - Whether this is the last child of its parent
 * @param options - Rendering options (blockers, terminal width)
 * @returns Array of output lines
 */
export declare function renderTreeNode(node: TreeNode, prefix: string, isLast: boolean, options?: TreeRenderOptions): string[];
/**
 * Render full tree from multiple root nodes
 */
export declare function renderTree(roots: TreeNode[], options?: TreeRenderOptions): string;
//# sourceMappingURL=tree-renderer.d.ts.map