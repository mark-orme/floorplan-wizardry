
/**
 * Logger utility for application
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  tags?: string[];
  data?: Record<string, any>;
}

/**
 * Simple logger utility with level-based filtering
 */
const logger = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  
  debug(message: string, options?: LogOptions | Record<string, any>) {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[DEBUG] ${message}`, options || '');
    }
    return this;
  },
  
  info(message: string, options?: LogOptions | Record<string, any>) {
    console.info(`[INFO] ${message}`, options || '');
    return this;
  },
  
  warn(message: string, options?: LogOptions | Record<string, any>) {
    console.warn(`[WARN] ${message}`, options || '');
    return this;
  },
  
  error(message: string, error?: Error | string | Record<string, any>) {
    console.error(`[ERROR] ${message}`, error || '');
    return this;
  }
};

export default logger;
