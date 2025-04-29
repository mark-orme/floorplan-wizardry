
/**
 * Simple logger utility for the application
 */
const logger = {
  info: (message: string, ...args: any[]) => {
    console.info(`[INFO] ${message}`, ...args);
  },
  
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARN] ${message}`, ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }
};

export const toolsLogger = {
  info: (message: string, ...args: any[]) => {
    logger.info(`[TOOLS] ${message}`, ...args);
  },
  
  warn: (message: string, ...args: any[]) => {
    logger.warn(`[TOOLS] ${message}`, ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    logger.error(`[TOOLS] ${message}`, ...args);
  },
  
  debug: (message: string, ...args: any[]) => {
    logger.debug(`[TOOLS] ${message}`, ...args);
  }
};

export default logger;
