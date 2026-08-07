export interface SessionContext {
    inProgressCells: Array<{
        id: string;
        title: string;
    }>;
    activeSwarms: Array<{
        epicId: string;
        title: string;
    }>;
}
/**
 * Injects session context by querying hive for in-progress work.
 * Called on session.created event.
 *
 * Note: Can't inject into OpenCode context yet (limitation), just logs for now.
 *
 * @param sessionID - The OpenCode session ID
 * @param projectKey - The project key (directory path)
 * @returns Session context with in-progress cells and active swarms, or null on error
 *
 * @example
 * ```typescript
 * const context = await injectSessionContext("session-123", "/path/to/project");
 * if (context) {
 *   console.log(`Found ${context.inProgressCells.length} in-progress cells`);
 * }
 * ```
 */
export declare function injectSessionContext(sessionID: string, projectKey: string): Promise<SessionContext | null>;
//# sourceMappingURL=session-start.d.ts.map