
/**
 * Simple logger utility with log levels
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

// Set this to the minimum log level you want displayed
// Can be overridden with localStorage.setItem('logLevel', 'debug')
let currentLogLevel: LogLevel = 'info';

// Check if running in browser and if log level is set in localStorage
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  const storedLevel = localStorage.getItem('logLevel') as LogLevel | null;
  if (storedLevel && LOG_LEVELS[storedLevel] !== undefined) {
    currentLogLevel = storedLevel;
  }
}

const shouldLog = (level: LogLevel): boolean => {
  return LOG_LEVELS[level] >= LOG_LEVELS[currentLogLevel];
};

const formatMessage = (message: string, data?: any): string[] => {
  if (data) {
    return [message, data];
  }
  return [message];
};

const logger = {
  debug: (message: string, data?: any) => {
    if (shouldLog('debug')) {
      console.debug(...formatMessage(`[DEBUG] ${message}`, data));
    }
  },
  
  info: (message: string, data?: any) => {
    if (shouldLog('info')) {
      console.info(...formatMessage(`[INFO] ${message}`, data));
    }
  },
  
  warn: (message: string, data?: any) => {
    if (shouldLog('warn')) {
      console.warn(...formatMessage(`[WARN] ${message}`, data));
    }
  },
  
  error: (message: string, error?: Error | any) => {
    if (shouldLog('error')) {
      console.error(`[ERROR] ${message}`, error);
    }
  },
  
  setLevel: (level: LogLevel) => {
    if (LOG_LEVELS[level] !== undefined) {
      currentLogLevel = level;
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('logLevel', level);
      }
    } else {
      console.error(`Invalid log level: ${level}`);
    }
  },
  
  getLevel: (): LogLevel => {
    return currentLogLevel;
  }
};

export default logger;
