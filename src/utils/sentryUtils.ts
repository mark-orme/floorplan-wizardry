
import * as Sentry from '@sentry/react';

/**
 * Unified error capture function with backward compatibility for different call patterns
 * 
 * @param error - The error object to capture
 * @param contextOrTags - Either a string context (legacy) or an object with tags and extra data
 * @param extraData - Extra data (legacy parameter)
 */
export function captureError(
  error: Error | string,
  contextOrTags?: string | { context?: string; tags?: Record<string, string>; extra?: Record<string, any> },
  extraData?: Record<string, any>
): void {
  // Handle the new unified format
  if (typeof contextOrTags === 'object' && contextOrTags !== null) {
    const { context, tags, extra } = contextOrTags;
    
    if (context) {
      Sentry.setContext('error_context', { context });
    }
    
    Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
      tags,
      extra
    });
    return;
  }
  
  // Handle legacy format (3 arguments)
  if (typeof contextOrTags === 'string') {
    Sentry.setContext('error_context', { context: contextOrTags });
    
    Sentry.captureException(error instanceof Error ? error : new Error(String(error)), {
      extra: extraData
    });
    return;
  }
  
  // Basic error capture with no context
  Sentry.captureException(error instanceof Error ? error : new Error(String(error)));
}

/**
 * Unified message capture function with backward compatibility for different call patterns
 * 
 * @param message - The message to capture
 * @param contextOrOptions - Either a string context (legacy) or an object with level, tags and extra data
 * @param extraData - Extra data (legacy parameter)
 */
export function captureMessage(
  message: string,
  contextOrOptions?: string | { 
    level?: Sentry.SeverityLevel; 
    tags?: Record<string, string>; 
    extra?: Record<string, any> 
  },
  extraData?: Record<string, any>
): void {
  // Handle the new unified format
  if (typeof contextOrOptions === 'object' && contextOrOptions !== null) {
    const { level, tags, extra } = contextOrOptions;
    
    Sentry.captureMessage(message, {
      level,
      tags,
      extra
    });
    return;
  }
  
  // Handle legacy format (3 arguments)
  if (typeof contextOrOptions === 'string') {
    Sentry.setContext('message_context', { context: contextOrOptions });
    
    Sentry.captureMessage(message, {
      extra: extraData
    });
    return;
  }
  
  // Basic message capture with no context
  Sentry.captureMessage(message);
}
