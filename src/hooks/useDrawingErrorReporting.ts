
/**
 * Hook for reporting drawing errors and logging drawing events
 * @module hooks/useDrawingErrorReporting
 */
import { useCallback } from 'react';
import { toast } from 'sonner';
import logger from '@/utils/logger';

export interface DrawingEventData {
  [key: string]: any;
}

/**
 * Hook for error reporting and logging in drawing tools
 * Provides consistent error handling and event logging
 */
export const useDrawingErrorReporting = () => {
  /**
   * Report a drawing error with context
   * 
   * @param error Error that occurred
   * @param context Context where the error occurred
   * @param data Additional data about the error
   */
  const reportDrawingError = useCallback((error: unknown, context: string, data?: DrawingEventData) => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    // Log error to console for development
    console.error(`Drawing error in ${context}:`, error);
    
    // Log structured error for monitoring
    logger.error(`Drawing error in ${context}: ${errorMessage}`, {
      context,
      error: errorMessage,
      ...data
    });
    
    // Show toast to user
    toast.error(`Drawing error: ${errorMessage}`);
    
    // Could add Sentry or other error reporting here
  }, []);
  
  /**
   * Log a drawing event with context
   * 
   * @param message Event message
   * @param eventType Type of drawing event
   * @param data Additional event data
   */
  const logDrawingEvent = useCallback((message: string, eventType: string, data?: DrawingEventData) => {
    // Log structured event for tracking and debugging
    logger.info(message, {
      eventType,
      ...data
    });
    
    // For development, log to console as well with a visual separator
    if (process.env.NODE_ENV === 'development') {
      console.log(`%c📏 ${eventType}: ${message}`, 'color: #3498db', data);
    }
  }, []);
  
  return {
    reportDrawingError,
    logDrawingEvent
  };
};
