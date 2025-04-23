
/**
 * Mock Sentry utility functions
 * These simulate sending errors to Sentry but actually don't
 */

interface CaptureOptions {
  level?: string;
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

export const captureError = (error: Error, options: CaptureOptions = {}) => {
  console.error(
    `[Error Captured] ${error.message}`,
    {
      stack: error.stack,
      ...options
    }
  );
};

export const captureMessage = (message: string, options: CaptureOptions = {}) => {
  const level = options.level || 'info';
  console[level as 'log' | 'info' | 'warn' | 'error'](
    `[Message Captured] ${message}`,
    options
  );
};

export const setUserContext = (user: { id: string; email?: string; username?: string }) => {
  console.info('[User Context Set]', user);
};

export const clearUserContext = () => {
  console.info('[User Context Cleared]');
};
