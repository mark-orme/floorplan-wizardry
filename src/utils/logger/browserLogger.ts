
import { config } from './config';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogData {
  level: LogLevel;
  message: string;
  namespace: string;
  timestamp: string;
  [key: string]: any;
}

export interface Logger {
  debug: (message: string, data?: any) => void;
  info: (message: string, data?: any) => void;
  warn: (message: string, data?: any) => void;
  error: (message: string, data?: any) => void;
}

/**
 * Create a logger with a specific namespace
 * @param namespace Logger namespace
 * @returns Logger instance
 */
export function createLogger(namespace: string): Logger {
  const log = (level: LogLevel, message: string, data?: any) => {
    const levelValue = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    }[level];
    
    const configLevelValue = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    }[config.level];
    
    // Skip if level is lower than configured level
    if (levelValue < configLevelValue) {
      return;
    }
    
    const logData: LogData = {
      level,
      message,
      namespace,
      timestamp: new Date().toISOString(),
      ...data
    };
    
    // Console logging
    if (config.enableConsole) {
      const prefix = `[${namespace}]`;
      
      switch (level) {
        case 'debug':
          console.debug(prefix, message, data);
          break;
        case 'info':
          console.info(prefix, message, data);
          break;
        case 'warn':
          console.warn(prefix, message, data);
          break;
        case 'error':
          console.error(prefix, message, data);
          break;
      }
    }
    
    // Additional logging to other services could be added here
  };
  
  return {
    debug: (message: string, data?: any) => log('debug', message, data),
    info: (message: string, data?: any) => log('info', message, data),
    warn: (message: string, data?: any) => log('warn', message, data),
    error: (message: string, data?: any) => log('error', message, data)
  };
}
