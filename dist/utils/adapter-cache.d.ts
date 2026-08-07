/**
 * Generic adapter cache for project-scoped singletons
 *
 * Caches expensive adapters (database connections, indexers, etc.)
 * keyed by project path. Ensures one instance per project.
 *
 * @example
 * ```ts
 * const memoryCache = new AdapterCache<MemoryAdapter>();
 * const adapter = await memoryCache.get(projectPath, async (path) => {
 *   const db = await getDatabase(path);
 *   return createMemoryAdapter(db);
 * });
 * ```
 */
export declare class AdapterCache<T> {
    private cached;
    private cachedPath;
    /**
     * Get cached adapter or create new one
     *
     * @param projectPath - Project path to scope the adapter to
     * @param factory - Async factory function to create the adapter
     * @returns Cached or newly created adapter instance
     */
    get(projectPath: string, factory: (path: string) => Promise<T>): Promise<T>;
    /**
     * Clear the cache (useful for testing)
     */
    clear(): void;
    /**
     * Get the currently cached project path
     */
    getCachedPath(): string | null;
}
//# sourceMappingURL=adapter-cache.d.ts.map