
/**
 * Papertrail transport for browser-compatible logger
 * Provides mock logging to Papertrail service in browser environment
 */

interface PapertrailConfig {
  host: string;
  port: number;
  hostname?: string;
  program?: string;
}

export const createPapertrailTransport = (config: PapertrailConfig) => {
  // In browser environments, we create a mock transport
  return {
    log: (level: string, message: string, callback?: () => void) => {
      console.log(`[${config.program || 'canvas-app'}] ${level}: ${message}`);
      if (callback) callback();
    },
    on: (event: string, handler: (err: Error) => void) => {
      // No-op for browser environment
      return { event, handler };
    }
  };
};
