export interface AtomicWriteOptions {
    append?: boolean;
}
/**
 * Writes content to a file atomically using a temp file + rename pattern.
 *
 * @param path - Target file path
 * @param content - Content to write
 * @param options - Write options (append mode)
 *
 * @example
 * ```typescript
 * // Basic write
 * await writeFileAtomic("output.txt", "Hello, World!");
 *
 * // Append mode
 * await writeFileAtomic("log.txt", "New entry\n", { append: true });
 * ```
 */
export declare function writeFileAtomic(path: string, content: string, options?: AtomicWriteOptions): Promise<void>;
//# sourceMappingURL=atomic-write.d.ts.map