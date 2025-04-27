
// Simple logger utility

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  enabled?: boolean;
  level?: LogLevel;
  prefix?: string;
}

class Logger {
  private enabled: boolean;
  private level: LogLevel;
  private prefix: string;
  private levels: Record<LogLevel, number>;

  constructor(options: LoggerOptions = {}) {
    this.enabled = options.enabled !== false;
    this.level = options.level || 'info';
    this.prefix = options.prefix || '';
    this.levels = {
      debug: 0,
      info: 1,
      warn: 2,
      error: 3
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.enabled) return false;
    return this.levels[level] >= this.levels[this.level];
  }

  private formatMessage(message: string): string {
    return this.prefix ? `[${this.prefix}] ${message}` : message;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.debug(this.formatMessage(message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage(message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(message), ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage(message), ...args);
    }
  }

  group(label: string): void {
    if (this.enabled) {
      console.group(this.formatMessage(label));
    }
  }

  groupEnd(): void {
    if (this.enabled) {
      console.groupEnd();
    }
  }
}

export const gridLogger = new Logger({ prefix: 'Grid' });
const logger = new Logger({ prefix: 'Canvas' });
export default logger;
