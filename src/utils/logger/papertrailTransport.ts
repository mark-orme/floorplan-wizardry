
import winston from 'winston';
import { Papertrail } from 'winston-papertrail';

interface PapertrailConfig {
  host: string;
  port: number;
  hostname?: string;
  program?: string;
}

export const createPapertrailTransport = (config: PapertrailConfig) => {
  const winstonPapertrail = new Papertrail({
    host: config.host,
    port: config.port,
    hostname: config.hostname || 'canvas-app',
    program: config.program || 'canvas-app',
    logFormat: (level, message) => {
      return `[${level}] ${message}`;
    },
  });

  winstonPapertrail.on('error', (err) => {
    console.error('Papertrail error:', err);
  });

  return winstonPapertrail;
};
