
/**
 * Structured logger for application
 * Provides consistent logging with namespace support and no-op in production
 */
import { LogData, createLogger } from './browserLogger';

export { LogData };

// Pre-configured loggers for common areas
export const lineToolLogger = createLogger("lineTool");
export const gridLogger = createLogger("grid");
export const canvasLogger = createLogger("canvas");
export const perfLogger = createLogger("performance");

// Default export for general usage
const logger = createLogger("app");
export default logger;
