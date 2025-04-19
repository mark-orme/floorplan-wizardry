
/**
 * Papertrail transport for browser-compatible logger
 * Provides mock logging to Papertrail service in browser environment
 */

// Configuration for Papertrail transport
interface PapertrailTransportConfig {
  host: string;
  port: number;
  hostname: string;
  program: string;
}

/**
 * Create a mock Papertrail transport for browser environments
 * @param config Configuration for Papertrail transport
 * @returns Console transport that simulates Papertrail
 */
export function createPapertrailTransport(config: PapertrailTransportConfig): any {
  // In browser environments, we create a mock transport that logs to console
  return {
    log: (level: string, message: string, callback: () => void) => {
      console.log(`[${config.program}] ${level}: ${message}`);
      if (callback) callback();
    }
  };
}
