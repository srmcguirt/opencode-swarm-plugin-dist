/**
 * Logger infrastructure using Pino
 *
 * Features:
 * - File logging to ~/.config/swarm-tools/logs/ (when SWARM_LOG_FILE=1)
 * - Pretty mode for development (SWARM_LOG_PRETTY=1 env var)
 * - Default: stdout JSON logging (works everywhere including global installs)
 *
 * NOTE: We intentionally avoid pino.transport() because it spawns worker_threads
 * that have module resolution issues in bundled/global-install contexts.
 * Uses pino.destination() for sync file writes instead.
 */
import type { Logger } from "pino";
/**
 * Gets or creates the main logger instance
 *
 * Logging modes (set via environment variables):
 * - Default: stdout JSON (works in all contexts)
 * - SWARM_LOG_FILE=1: writes to ~/.config/swarm-tools/logs/swarm.log
 * - SWARM_LOG_PRETTY=1: pretty console output (requires pino-pretty installed)
 *
 * @param logDir - Optional log directory (defaults to ~/.config/swarm-tools/logs)
 * @returns Pino logger instance
 */
export declare function getLogger(logDir?: string): Logger;
/**
 * Creates a child logger for a specific module
 *
 * @param module - Module name (e.g., "compaction", "cli")
 * @param logDir - Optional log directory (defaults to ~/.config/swarm-tools/logs)
 * @returns Child logger instance
 */
export declare function createChildLogger(module: string, logDir?: string): Logger;
/**
 * Default logger instance for immediate use
 */
export declare const logger: Logger;
//# sourceMappingURL=logger.d.ts.map