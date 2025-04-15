
import * as Sentry from '@sentry/react';
import { captureMessage } from '@/utils/sentry';
import logger from '@/utils/logger';
import { DrawingMode } from '@/constants/drawingModes';

/**
 * Logs toolbar item activation with Sentry tracking
 * 
 * @param toolName The name of the tool being activated
 * @param previousTool The previously active tool
 * @param context Additional context about the tool activation
 */
export const logToolActivation = (
  toolName: DrawingMode,
  previousTool: DrawingMode | null,
  context: Record<string, any> = {}
): void => {
  // Set Sentry tags for filtering
  Sentry.setTag("toolActivation", toolName);
  
  // Add breadcrumb for sequential tracking
  Sentry.addBreadcrumb({
    category: 'toolbar',
    message: `Tool changed: ${previousTool || 'none'} -> ${toolName}`,
    level: 'info',
    data: {
      previousTool,
      newTool: toolName,
      timestamp: new Date().toISOString(),
      ...context
    }
  });
  
  // Capture as an event for analytics
  captureMessage(`Tool activated: ${toolName}`, "tool-activation", {
    tags: { component: "Toolbar", tool: toolName },
    extra: {
      previousTool,
      timestamp: new Date().toISOString(),
      ...context
    }
  });
  
  // Log to console in development
  logger.info(`Tool activated: ${toolName}`, {
    previousTool,
    context
  });
};
