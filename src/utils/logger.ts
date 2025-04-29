
/**
 * Logger utility for application-wide logging
 */
const toolsLogger = {
  info: (message: string, data?: any) => {
    console.info(`[Tools]: ${message}`, data || '');
  },
  warn: (message: string, data?: any) => {
    console.warn(`[Tools]: ${message}`, data || '');
  },
  error: (message: string, data?: any) => {
    console.error(`[Tools]: ${message}`, data || '');
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[Tools]: ${message}`, data || '');
    }
  }
};

export default toolsLogger;
export { toolsLogger };
