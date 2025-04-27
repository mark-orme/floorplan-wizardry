
/**
 * Logger utility for consistent application logging
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  tags?: string[];
  data?: Record<string, unknown>;
}

const logger = {
  debug: (message: string, data?: any) => {
    console.debug(`[DEBUG] ${message}`, data || '');
  },
  
  info: (message: string, data?: any) => {
    console.info(`[INFO] ${message}`, data || '');
  },
  
  warn: (message: string, data?: any) => {
    console.warn(`[WARNING] ${message}`, data || '');
  },
  
  error: (message: string, error?: Error | unknown) => {
    console.error(`[ERROR] ${message}`, error || '');
  },
  
  log: (level: LogLevel, message: string, options?: LogOptions) => {
    const tagString = options?.tags ? `[${options.tags.join(',')}] ` : '';
    console[level](`[${level.toUpperCase()}] ${tagString}${message}`, options?.data || '');
  }
};

export default logger;

/**
 * Grid-specific logger
 */
export const gridLogger = {
  info: (message: string, data?: any) => {
    logger.info(`[GRID] ${message}`, data);
  },
  
  warn: (message: string, data?: any) => {
    logger.warn(`[GRID] ${message}`, data);
  },
  
  error: (message: string, error?: Error) => {
    logger.error(`[GRID] ${message}`, error);
  }
};
