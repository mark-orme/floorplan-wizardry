
export interface CaptureMessageOptions {
  level: 'info' | 'warning' | 'error';
  tags?: Record<string, string>;
  extra?: Record<string, any>;
}

export const captureMessage = (message: string, options?: CaptureMessageOptions): void => {
  // Stub implementation since Sentry may not be available
  console.log(`[${options?.level || 'info'}] ${message}`, options?.extra || {});
};

export const captureError = (error: Error, options?: CaptureMessageOptions): void => {
  console.error(`[${options?.level || 'error'}] Error:`, error, options?.extra || {});
};
