
/**
 * Utility logger for application
 */
const logger = {
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[Debug] ${message}`, ...args);
    }
  },
  info: (message: string, ...args: any[]) => {
    console.info(`[Info] ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`[Warning] ${message}`, ...args);
  },
  error: (message: string, ...args: any[]) => {
    console.error(`[Error] ${message}`, ...args);
  }
};

// Create module-specific loggers
export const toolsLogger = {
  ...logger,
  debug: (message: string, ...args: any[]) => {
    logger.debug(`[Tools] ${message}`, ...args);
  }
};

export default logger;
