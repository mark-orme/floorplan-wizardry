
import { useEffect, useRef } from 'react';
import { DrawingMode } from '@/constants/drawingModes';
import { captureMessage } from '@/utils/sentry';
import logger from '@/utils/logger';

/**
 * Hook for monitoring drawing tool usage and reporting metrics
 * Used for observability of drawing tool interactions
 */
export const useToolMonitoring = (tool: DrawingMode) => {
  // Track tool usage duration
  const toolStartTimeRef = useRef<Record<string, number>>({});
  const previousToolRef = useRef<DrawingMode | null>(null);
  
  // Monitor tool changes for analytics
  useEffect(() => {
    // Skip on initial render
    if (previousToolRef.current === null) {
      previousToolRef.current = tool;
      toolStartTimeRef.current[tool] = Date.now();
      return;
    }
    
    const prevTool = previousToolRef.current;
    const now = Date.now();
    const startTime = toolStartTimeRef.current[prevTool] || now;
    const duration = now - startTime;
    
    // Log tool usage metrics
    logger.info('Tool usage event', {
      previousTool: prevTool,
      newTool: tool,
      durationMs: duration,
      durationReadable: `${(duration / 1000).toFixed(1)}s`
    });
    
    // Report significant tool usage patterns to Sentry
    if (duration > 30000) { // Only report if used for more than 30 seconds
      captureMessage(
        'Extended tool usage detected',
        'tool-usage-extended',
        {
          tags: {
            tool: prevTool,
            nextTool: tool
          },
          extra: {
            durationMs: duration,
            durationSeconds: Math.round(duration / 1000),
            timestamp: new Date().toISOString()
          }
        }
      );
    }
    
    // Update refs for next change
    previousToolRef.current = tool;
    toolStartTimeRef.current[tool] = now;
  }, [tool]);
  
  // Return nothing - this hook is for side effects only
  return null;
};
