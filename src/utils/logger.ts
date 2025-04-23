
/**
 * Basic logger utility
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogOptions {
  level?: LogLevel;
  context?: string;
  tags?: Record<string, string>;
}

class Logger {
  private context: string;
  
  constructor(context: string) {
    this.context = context;
  }
  
  debug(message: string, options?: Omit<LogOptions, 'level'>): void {
    this.log(message, { ...options, level: 'debug' });
  }
  
  info(message: string, options?: Omit<LogOptions, 'level'>): void {
    this.log(message, { ...options, level: 'info' });
  }
  
  warn(message: string, options?: Omit<LogOptions, 'level'>): void {
    this.log(message, { ...options, level: 'warn' });
  }
  
  error(message: string, options?: Omit<LogOptions, 'level'>): void {
    this.log(message, { ...options, level: 'error' });
  }
  
  private log(message: string, options?: LogOptions): void {
    const level = options?.level || 'info';
    const context = options?.context || this.context;
    const tagString = options?.tags 
      ? Object.entries(options.tags)
        .map(([key, value]) => `${key}=${value}`)
        .join(' ')
      : '';
    
    const prefix = `[${level.toUpperCase()}] [${context}]`;
    
    switch (level) {
      case 'debug':
        console.debug(prefix, message, tagString);
        break;
      case 'info':
        console.info(prefix, message, tagString);
        break;
      case 'warn':
        console.warn(prefix, message, tagString);
        break;
      case 'error':
        console.error(prefix, message, tagString);
        break;
    }
  }
}

// Create and export loggers for different parts of the application
export const logger = new Logger('app');
export const gridLogger = new Logger('grid');
export const canvasLogger = new Logger('canvas');
export const toolsLogger = new Logger('tools');

// Default export
export default logger;
