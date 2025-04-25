
// Toast utility functions
// This is a mock implementation for now
export const toast = {
  success: (message: string) => console.log(`SUCCESS: ${message}`),
  error: (message: string) => console.error(`ERROR: ${message}`),
  info: (message: string) => console.info(`INFO: ${message}`),
  warning: (message: string) => console.warn(`WARNING: ${message}`),
};
