/**
 * Rate Limiter Module - Distributed rate limiting for Agent Mail
 *
 * Provides sliding window rate limiting with dual backends:
 * - Redis (primary) - Distributed, uses sorted sets for sliding window
 * - SQLite (fallback) - Local, file-based persistence
 *
 * Features:
 * - Dual window enforcement: per-minute AND per-hour limits
 * - Automatic backend fallback (Redis → SQLite)
 * - Configurable limits per endpoint via env vars
 * - Auto-cleanup of expired entries
 *
 * @example
 * ```typescript
 * // Create rate limiter (auto-selects backend)
 * const limiter = await createRateLimiter();
 *
 * // Check if request is allowed
 * const result = await limiter.checkLimit("BlueLake", "send");
 * if (!result.allowed) {
 *   console.log(`Rate limited. Reset at ${result.resetAt}`);
 * }
 *
 * // Record a request after it completes
 * await limiter.recordRequest("BlueLake", "send");
 * ```
 */
import Redis from "ioredis";
/**
 * Result of checking a rate limit
 */
export interface RateLimitResult {
    /** Whether the request is allowed */
    allowed: boolean;
    /** Remaining requests in the most restrictive window */
    remaining: number;
    /** Unix timestamp (ms) when the limit resets */
    resetAt: number;
}
/**
 * Rate limiter interface
 */
export interface RateLimiter {
    /**
     * Check if a request is allowed under rate limits
     * Checks BOTH minute and hour windows - both must pass
     *
     * @param agentName - The agent making the request
     * @param endpoint - The endpoint being accessed
     * @returns Rate limit check result
     */
    checkLimit(agentName: string, endpoint: string): Promise<RateLimitResult>;
    /**
     * Record a request against the rate limit
     * Should be called AFTER the request succeeds
     *
     * @param agentName - The agent making the request
     * @param endpoint - The endpoint being accessed
     */
    recordRequest(agentName: string, endpoint: string): Promise<void>;
    /**
     * Close the rate limiter and release resources
     */
    close(): Promise<void>;
}
/**
 * Rate limit configuration for an endpoint
 */
export interface EndpointLimits {
    /** Requests allowed per minute */
    perMinute: number;
    /** Requests allowed per hour */
    perHour: number;
}
/**
 * Default rate limits per endpoint
 * Can be overridden via OPENCODE_RATE_LIMIT_{ENDPOINT}_PER_MIN and _PER_HOUR
 */
export declare const DEFAULT_LIMITS: Record<string, EndpointLimits>;
/**
 * Get rate limits for an endpoint, with env var overrides
 *
 * @param endpoint - The endpoint name
 * @returns Rate limits for the endpoint
 */
export declare function getLimitsForEndpoint(endpoint: string): EndpointLimits;
/**
 * Redis-backed rate limiter using sorted sets
 *
 * Uses sliding window algorithm:
 * 1. Store each request as a member with timestamp as score
 * 2. Remove expired entries (outside window)
 * 3. Count remaining entries
 *
 * Key format: ratelimit:{agent}:{endpoint}:{window}
 * Window values: "minute" or "hour"
 */
export declare class RedisRateLimiter implements RateLimiter {
    private redis;
    private connected;
    constructor(redis: Redis);
    /**
     * Build Redis key for rate limiting
     */
    private buildKey;
    /**
     * Get window duration in milliseconds
     */
    private getWindowDuration;
    checkLimit(agentName: string, endpoint: string): Promise<RateLimitResult>;
    /**
     * Check a single window's rate limit
     */
    private checkWindow;
    recordRequest(agentName: string, endpoint: string): Promise<void>;
    close(): Promise<void>;
}
/**
 * SQLite-backed rate limiter for local/fallback use
 *
 * Table schema:
 * - agent_name: TEXT
 * - endpoint: TEXT
 * - window: TEXT ('minute' or 'hour')
 * - timestamp: INTEGER (Unix ms)
 *
 * Uses sliding window via COUNT query with timestamp filter.
 */
export declare class SqliteRateLimiter implements RateLimiter {
    private db;
    constructor(dbPath: string);
    /**
     * Initialize the database schema and cleanup old entries
     */
    private initialize;
    checkLimit(agentName: string, endpoint: string): Promise<RateLimitResult>;
    /**
     * Check a single window's rate limit
     */
    private checkWindow;
    /**
     * Clean up old rate limit entries in bounded batches
     *
     * Limits cleanup to prevent blocking recordRequest on large datasets:
     * - BATCH_SIZE: 1000 rows per iteration
     * - MAX_BATCHES: 10 (max 10k rows per cleanup invocation)
     *
     * Stops early if fewer than BATCH_SIZE rows deleted (no more to clean).
     *
     * @returns Cleanup statistics including total deleted rows
     */
    private cleanup;
    recordRequest(agentName: string, endpoint: string): Promise<void>;
    close(): Promise<void>;
}
/**
 * In-memory rate limiter for testing
 *
 * Uses Map storage with timestamp arrays per key.
 * No persistence - resets on process restart.
 */
export declare class InMemoryRateLimiter implements RateLimiter {
    private storage;
    private buildKey;
    checkLimit(agentName: string, endpoint: string): Promise<RateLimitResult>;
    private checkWindow;
    recordRequest(agentName: string, endpoint: string): Promise<void>;
    close(): Promise<void>;
    /**
     * Reset all rate limits (for testing)
     */
    reset(): void;
}
/**
 * Create a rate limiter with automatic backend selection
 *
 * Tries Redis first, falls back to SQLite on connection failure.
 * Warns once when falling back to SQLite.
 *
 * @returns Configured rate limiter instance
 *
 * @example
 * ```typescript
 * // Auto-select backend
 * const limiter = await createRateLimiter();
 *
 * // Force SQLite
 * const limiter = await createRateLimiter({ backend: "sqlite" });
 *
 * // Force in-memory (testing)
 * const limiter = await createRateLimiter({ backend: "memory" });
 * ```
 */
export declare function createRateLimiter(options?: {
    backend?: "redis" | "sqlite" | "memory";
    redisUrl?: string;
    sqlitePath?: string;
}): Promise<RateLimiter>;
/**
 * Reset the fallback warning flag (for testing)
 */
export declare function resetFallbackWarning(): void;
/**
 * Get or create the global rate limiter instance
 *
 * Uses auto-selection (Redis → SQLite) by default.
 */
export declare function getRateLimiter(): Promise<RateLimiter>;
/**
 * Set the global rate limiter instance
 *
 * Useful for testing or custom configurations.
 */
export declare function setRateLimiter(limiter: RateLimiter): void;
/**
 * Reset the global rate limiter instance
 */
export declare function resetRateLimiter(): Promise<void>;
//# sourceMappingURL=rate-limiter.d.ts.map