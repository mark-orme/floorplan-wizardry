
// Simple utility functions for error reporting

export function captureMessage(message: string, category?: string, metadata?: any) {
  // In a real implementation, this would send to Sentry
  console.log('[Sentry]', category || 'info', message, metadata || {});
}

export function captureError(error: any, context?: string) {
  // In a real implementation, this would send to Sentry
  console.error('[Sentry Error]', context || 'unknown', error);
}
