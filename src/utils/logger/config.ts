
export interface LoggerConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  papertrail: {
    host: string;
    port: number;
    program: string;
  };
  enableConsole: boolean;
  enableSentry: boolean;
  enablePapertrail: boolean;
}

export const config: LoggerConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  papertrail: {
    host: import.meta.env.VITE_PAPERTRAIL_HOST || 'logs.papertrailapp.com',
    port: Number(import.meta.env.VITE_PAPERTRAIL_PORT) || 12345,
    program: 'lovable-app'
  },
  enableConsole: true,
  enableSentry: process.env.NODE_ENV === 'production',
  enablePapertrail: process.env.NODE_ENV === 'production'
};

// Allow for runtime configuration of logging
export const setLogLevel = (level: LoggerConfig['level']): void => {
  config.level = level;
};

// Enable/disable logging destinations
export const configureLogging = (options: Partial<Pick<LoggerConfig, 'enableConsole' | 'enableSentry' | 'enablePapertrail'>>): void => {
  if (options.enableConsole !== undefined) config.enableConsole = options.enableConsole;
  if (options.enableSentry !== undefined) config.enableSentry = options.enableSentry;
  if (options.enablePapertrail !== undefined) config.enablePapertrail = options.enablePapertrail;
};
