
/**
 * Hook for centralized error reporting in drawing operations
 * Provides consistent error tracking for canvas drawing operations
 * @module hooks/useDrawingErrorReporting
 */
import { useCallback } from 'react';
import { captureError, captureMessage } from '@/utils/sentry';
import { CaptureErrorOptions, CaptureMessageOptions } from '@/utils/sentry/types';
import { DrawingTool } from '@/types/core/DrawingTool';

/**
 * Options for drawing error reporting
 */
interface DrawingErrorContext {
  /** Current drawing tool */
  tool?: DrawingTool;
  /** Canvas dimensions */
  canvasDimensions?: { width: number; height: number };
  /** Current drawing state info */
  drawingState?: {
    isDrawing: boolean;
    pointCount?: number;
    sessionDuration?: number;
  };
  /** User interaction details */
  interaction?: {
    type: 'mouse' | 'touch' | 'stylus' | 'keyboard';
    pressure?: number;
    tilt?: { x: number; y: number };
  };
}

/**
 * Hook for centralized error reporting in drawing operations
 * @returns Functions for reporting errors and events
 */
export const useDrawingErrorReporting = () => {
  /**
   * Report a drawing error with enhanced context
   */
  const reportDrawingError = useCallback((
    error: Error | unknown,
    operation: string,
    context: DrawingErrorContext,
    options: CaptureErrorOptions = {}
  ) => {
    // Extract drawing context for better error reporting
    const { tool, canvasDimensions, drawingState, interaction } = context;
    
    // Create enhanced options with drawing-specific context
    const enhancedOptions: CaptureErrorOptions = {
      ...options,
      tags: {
        component: 'drawing',
        operation,
        tool: tool || 'unknown',
        interactionType: interaction?.type || 'unknown',
        ...options.tags
      },
      extra: {
        drawingTool: tool,
        canvasDimensions,
        drawingState,
        interaction,
        ...options.extra
      },
      context: {
        component: 'DrawingOperation',
        drawingContext: context,
        ...options.context
      }
    };
    
    // Capture the error with enhanced context
    captureError(error, `drawing-${operation}`, enhancedOptions);
  }, []);
  
  /**
   * Log a drawing event with context
   */
  const logDrawingEvent = useCallback((
    message: string,
    category: string,
    context: DrawingErrorContext,
    options: CaptureMessageOptions = {}
  ) => {
    // Extract drawing context for better logging
    const { tool, canvasDimensions, drawingState, interaction } = context;
    
    // Create enhanced options with drawing-specific context
    const enhancedOptions: CaptureMessageOptions = {
      ...options,
      tags: {
        component: 'drawing',
        category,
        tool: tool || 'unknown',
        ...options.tags
      },
      extra: {
        drawingTool: tool,
        canvasDimensions,
        drawingState,
        interaction,
        ...options.extra
      }
    };
    
    // Capture the message with enhanced context
    captureMessage(message, `drawing-${category}`, enhancedOptions);
  }, []);

  /**
   * Track drawing performance metrics
   */
  const trackDrawingPerformance = useCallback((
    operation: string,
    metrics: {
      duration: number;
      pointsProcessed?: number;
      objectsRendered?: number;
      renderTime?: number;
      fps?: number;
    },
    context: DrawingErrorContext
  ) => {
    // Create enhanced options with performance metrics
    const enhancedOptions: CaptureMessageOptions = {
      level: 'info',
      tags: {
        component: 'drawing',
        category: 'performance',
        operation,
        tool: context.tool || 'unknown'
      },
      extra: {
        metrics,
        context
      }
    };
    
    // Log performance data
    captureMessage(
      `Drawing operation '${operation}' completed in ${metrics.duration}ms`,
      'performance-metrics',
      enhancedOptions
    );
  }, []);
  
  return {
    reportDrawingError,
    logDrawingEvent,
    trackDrawingPerformance
  };
};
