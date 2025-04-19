
/**
 * Papertrail transport for Winston logger
 * Provides logging to Papertrail service
 */

import * as winston from 'winston';

// Configuration for Papertrail transport
interface PapertrailTransportConfig {
  host: string;
  port: number;
  hostname: string;
  program: string;
}

/**
 * Create a Papertrail transport for Winston
 * @param config Configuration for Papertrail transport
 * @returns Winston transport for Papertrail
 */
export function createPapertrailTransport(config: PapertrailTransportConfig): winston.transport {
  // In a real implementation, this would use the winston-papertrail package
  // For now, we create a custom transport that forwards to console
  return new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.printf(({ level, message, timestamp }) => {
        return `${timestamp} [${config.program}] ${level}: ${message}`;
      })
    )
  });
}
