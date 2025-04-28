
/**
 * Simple logger utility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const logger = {
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  },
  
  info: (message: string, ...args: any[]) => {
    console.info(`[INFO] ${message}`, ...args);
  },
  
  warn: (message: string, ...args: any[]) => {
    console.warn(`[WARNING] ${message}`, ...args);
  },
  
  error: (message: string, ...args: any[]) => {
    console.error(`[ERROR] ${message}`, ...args);
  },
  
  log: (level: LogLevel, message: string, ...args: any[]) => {
    switch (level) {
      case 'debug':
        logger.debug(message, ...args);
        break;
      case 'info':
        logger.info(message, ...args);
        break;
      case 'warn':
        logger.warn(message, ...args);
        break;
      case 'error':
        logger.error(message, ...args);
        break;
    }
  }
};

export default logger;
