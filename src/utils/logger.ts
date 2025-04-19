
/**
 * Re-export from the modular logger structure
 * @module utils/logger
 */
import logger from './logger/index';
import type { LogData, Logger, LogLevel } from './logger/browserLogger';
import { createLogger } from './logger/browserLogger';
import { lineToolLogger, gridLogger, canvasLogger, perfLogger } from './logger/index';

export type { LogData, Logger, LogLevel };
export { createLogger, lineToolLogger, gridLogger, canvasLogger, perfLogger };
export default logger;
