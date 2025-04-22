
/**
 * Utility functions for toast notifications
 * This is a mock implementation that will be replaced with sonner in production
 */

export const toast = {
  success: (message: string, options?: any) => {
    console.log('[Toast Success]', message, options);
  },
  error: (message: string, options?: any) => {
    console.error('[Toast Error]', message, options);
  },
  info: (message: string, options?: any) => {
    console.info('[Toast Info]', message, options);
  },
  warning: (message: string, options?: any) => {
    console.warn('[Toast Warning]', message, options);
  },
  promise: (promise: Promise<any>, messages: { loading: string; success: string; error: string }, options?: any) => {
    console.log('[Toast Promise]', messages.loading, options);
    promise
      .then(() => console.log('[Toast Promise Success]', messages.success))
      .catch(() => console.error('[Toast Promise Error]', messages.error));
    return promise;
  },
  custom: (content: any, options?: any) => {
    console.log('[Toast Custom]', content, options);
  },
  dismiss: (id?: string) => {
    console.log('[Toast Dismiss]', id);
  }
};
