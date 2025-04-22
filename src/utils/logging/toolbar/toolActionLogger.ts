
import * as Sentry from '@sentry/react';
import { captureMessage, captureError } from '@/utils/sentryUtils';
import logger from '@/utils/logger';

/**
 * Logs toolbar action execution with Sentry tracking
 * 
 * @param actionName The name of the action being executed
 * @param successful Whether the action was successful
 * @param context Additional context about the action
 */
export const logToolbarAction = (
  actionName: string,
  successful: boolean,
  context: Record<string, any> = {}
): void => {
  // Set Sentry tags for filtering
  Sentry.setTag("toolbarAction", actionName);
  
  // Add breadcrumb for sequential tracking
  Sentry.addBreadcrumb({
    category: 'toolbar',
    message: `Toolbar action: ${actionName} - ${successful ? 'successful' : 'failed'}`,
    level: successful ? 'info' : 'warning',
    data: {
      action: actionName,
      successful,
      timestamp: new Date().toISOString(),
      ...context
    }
  });
  
  // Capture as an event for analytics
  if (successful) {
    captureMessage(`Toolbar action: ${actionName}`, {
      tags: { component: "Toolbar", action: actionName },
      extra: {
        timestamp: new Date().toISOString(),
        ...context
      }
    });
  } else {
    captureError(
      new Error(`Toolbar action failed: ${actionName}`),
      {
        tags: { 
          component: "Toolbar", 
          action: actionName, 
          critical: context.critical ? "true" : "false" 
        },
        extra: {
          timestamp: new Date().toISOString(),
          ...context
        }
      }
    );
  }
  
  // Log to console in development
  if (successful) {
    logger.info(`Toolbar action: ${actionName}`, context);
  } else {
    logger.error(`Toolbar action failed: ${actionName}`, context);
  }
};
