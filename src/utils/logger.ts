
/**
 * Simple logger utility
 */
const logger = {
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, data ?? '');
    }
  },
  info: (message: string, data?: any) => {
    console.info(`[INFO] ${message}`, data ?? '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[WARNING] ${message}`, data ?? '');
  },
  error: (message: string, error?: any) => {
    console.error(`[ERROR] ${message}`, error ?? '');
  }
};

// Tool-specific logger
export const toolsLogger = {
  debug: (message: string, data?: any) => {
    logger.debug(`[TOOL] ${message}`, data);
  },
  info: (message: string, data?: any) => {
    logger.info(`[TOOL] ${message}`, data);
  },
  warn: (message: string, data?: any) => {
    logger.warn(`[TOOL] ${message}`, data);
  },
  error: (message: string, error?: any) => {
    logger.error(`[TOOL] ${message}`, error);
  }
};

export default logger;
