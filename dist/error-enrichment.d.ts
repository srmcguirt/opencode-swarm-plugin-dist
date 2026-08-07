/**
 * Error Enrichment - Structured error context for swarm agents
 *
 * TDD GREEN: Minimal implementation to pass tests
 */
export interface SwarmErrorContext {
    file?: string;
    line?: number;
    agent?: string;
    epic_id?: string;
    bead_id?: string;
    recent_events?: Array<{
        type: string;
        timestamp: string;
        message: string;
    }>;
}
/**
 * SwarmError - Error class with structured context
 */
export declare class SwarmError extends Error {
    context: SwarmErrorContext;
    constructor(message: string, context?: SwarmErrorContext);
    toJSON(): {
        name: string;
        message: string;
        context: SwarmErrorContext;
        stack: string | undefined;
    };
}
/**
 * enrichError - Convert any error to SwarmError with context
 */
export declare function enrichError(error: unknown, context: SwarmErrorContext): SwarmError;
/**
 * debugLog - Conditional logging based on DEBUG env var
 *
 * Patterns:
 * - DEBUG=swarm:* (all)
 * - DEBUG=swarm:coordinator
 * - DEBUG=swarm:worker
 * - DEBUG=swarm:mail
 */
export declare function debugLog(namespace: string, message: string, data?: unknown): void;
/**
 * suggestFix - Pattern matching for common swarm errors
 */
export declare function suggestFix(error: Error | SwarmError): string | null;
//# sourceMappingURL=error-enrichment.d.ts.map