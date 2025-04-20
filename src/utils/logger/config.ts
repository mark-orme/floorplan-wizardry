
/**
 * Logger configuration
 */
export const config = {
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  enableConsole: true,
  enableSentry: process.env.NODE_ENV === 'production',
  namespace: 'floor-plan'
};
