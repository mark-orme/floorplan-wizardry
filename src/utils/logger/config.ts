
export interface LoggerConfig {
  level: 'debug' | 'info' | 'warn' | 'error';
  papertrail: {
    host: string;
    port: number;
    program: string;
  };
}

export const config: LoggerConfig = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  papertrail: {
    host: import.meta.env.VITE_PAPERTRAIL_HOST || 'logs.papertrailapp.com',
    port: Number(import.meta.env.VITE_PAPERTRAIL_PORT) || 12345,
    program: 'lovable-app'
  }
};
