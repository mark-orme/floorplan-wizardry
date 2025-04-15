
import * as Sentry from '@sentry/react';
import { captureMessage, captureError } from '@/utils/sentry';
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
    captureMessage(`Toolbar action: ${actionName}`, "toolbar-action", {
      tags: { component: "Toolbar", action: actionName },
      extra: {
        timestamp: new Date().toISOString(),
        ...context
      }
    });
  } else {
    captureError(
      new Error(`Toolbar action failed: ${actionName}`),
      "toolbar-action-failed",
      {
        tags: { component: "Toolbar", action: actionName, critical: context.critical ? "true" : "false" },
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

/**
 * Verifies toolbar item is properly connected to the canvas
 * 
 * @param toolName Name of the tool to verify
 * @param canvas The Fabric.js canvas reference
 * @returns Object indicating if connection is valid
 */
export const verifyToolCanvasConnection = (
  toolName: DrawingMode,
  canvas: any
): { connected: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  if (!canvas) {
    issues.push("Canvas is null or undefined");
    return { connected: false, issues };
  }
  
  // Check if canvas API is accessible
  if (!canvas.getObjects || typeof canvas.getObjects !== 'function') {
    issues.push("Canvas API is not properly accessible");
  }
  
  // Tool-specific verification
  switch (toolName) {
    case DrawingMode.DRAW:
      if (!canvas.isDrawingMode) {
        issues.push("Canvas drawing mode is not enabled for draw tool");
      }
      if (!canvas.freeDrawingBrush) {
        issues.push("Free drawing brush is not available");
      }
      break;
      
    case DrawingMode.SELECT:
      if (!canvas.selection) {
        issues.push("Canvas selection is not enabled for select tool");
      }
      break;
      
    case DrawingMode.STRAIGHT_LINE:
      // Verify straight line tool requirements
      try {
        const fabricLib = (window as any).fabric;
        if (!fabricLib || !fabricLib.Line) {
          issues.push("fabric.Line constructor is not available");
        }
      } catch (error) {
        issues.push(`Error testing straight line tool: ${error}`);
      }
      break;
      
    case DrawingMode.WALL:
    case DrawingMode.RECTANGLE:
    case DrawingMode.CIRCLE:
    case DrawingMode.ERASER:
      // Tool-specific checks could be added here
      break;
  }
  
  // Log issues if any were found
  if (issues.length > 0) {
    logger.warn(`Tool verification issues for ${toolName}:`, { issues });
    
    Sentry.addBreadcrumb({
      category: 'toolbar',
      message: `Tool connection issues: ${toolName}`,
      level: 'warning',
      data: { tool: toolName, issues }
    });
  }
  
  return {
    connected: issues.length === 0,
    issues
  };
};

/**
 * Monitors toolbar operations over time
 * @param interval How often to check (in ms)
 * @param callback Function to call with results
 */
export const startToolbarMonitoring = (
  interval: number = 30000,
  callback?: (report: any) => void
): () => void => {
  const toolUsageStats: Record<string, number> = {};
  const actionsStats: Record<string, { success: number, failure: number }> = {};
  let originalBreadcrumbs: { breadcrumb: any }[] = [];
  
  // Store breadcrumbs for analysis without modifying the API
  const breadcrumbListener = (breadcrumb: any) => {
    // Track tool activations
    if (breadcrumb.category === 'toolbar' && breadcrumb.message?.includes('Tool changed')) {
      const tool = breadcrumb.data?.newTool;
      if (tool) {
        toolUsageStats[tool] = (toolUsageStats[tool] || 0) + 1;
      }
    }
    
    // Track action executions
    if (breadcrumb.category === 'toolbar' && breadcrumb.message?.includes('Toolbar action')) {
      const action = breadcrumb.data?.action;
      const successful = breadcrumb.data?.successful;
      
      if (action) {
        if (!actionsStats[action]) {
          actionsStats[action] = { success: 0, failure: 0 };
        }
        
        if (successful) {
          actionsStats[action].success++;
        } else {
          actionsStats[action].failure++;
        }
      }
    }
    
    // Store the breadcrumb
    originalBreadcrumbs.push({ breadcrumb });
  };
  
  // Add our listener
  document.addEventListener('sentry-breadcrumb', breadcrumbListener);
  
  // Set up interval to report statistics
  const intervalId = setInterval(() => {
    const report = {
      toolUsage: toolUsageStats,
      actionStats: actionsStats,
      timestamp: new Date().toISOString()
    };
    
    // Send report to Sentry
    captureMessage("Toolbar usage report", "toolbar-monitoring", {
      tags: { component: "ToolbarMonitor" },
      extra: report
    });
    
    // Call callback if provided
    if (callback) {
      callback(report);
    }
  }, interval);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    document.removeEventListener('sentry-breadcrumb', breadcrumbListener);
  };
};
