
/**
 * Re-export from the modular logger structure
 * @module utils/logger
 */
import logger, { LogData, createLogger, lineToolLogger, gridLogger, canvasLogger, perfLogger } from './logger/index';

export { LogData, createLogger, lineToolLogger, gridLogger, canvasLogger, perfLogger };
export default logger;
