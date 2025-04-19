
/**
 * Structured logger for application
 * Provides consistent logging with namespace support
 */
import { createLogger } from './browserLogger';
import type { LogData, Logger, LogLevel } from './browserLogger';

export type { LogData, Logger, LogLevel };
export { createLogger };

// Pre-configured loggers for common areas
export const lineToolLogger = createLogger("lineTool");
export const gridLogger = createLogger("grid");
export const canvasLogger = createLogger("canvas");
export const perfLogger = createLogger("performance");

// Default export for general usage
const logger = createLogger("app");
export default logger;
