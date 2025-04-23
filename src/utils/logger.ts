
/**
 * Simple logger utility with levels
 */
const logger = {
  error: (message: string, ...args: any[]) => {
    console.error(`${new Date().toISOString()} error: ${message}`, ...args);
  },
  warn: (message: string, ...args: any[]) => {
    console.warn(`${new Date().toISOString()} warn: ${message}`, ...args);
  },
  info: (message: string, ...args: any[]) => {
    console.info(`${new Date().toISOString()} info: ${message}`, ...args);
  },
  debug: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`${new Date().toISOString()} debug: ${message}`, ...args);
    }
  },
  trace: (message: string, ...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.trace(`${new Date().toISOString()} trace: ${message}`, ...args);
    }
  }
};

export default logger;
