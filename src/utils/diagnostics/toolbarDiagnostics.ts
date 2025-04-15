
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import * as Sentry from '@sentry/react';
import { captureMessage, captureError } from '@/utils/sentry';
import { testCanvasDrawingCapabilities, testStraightLineDrawing } from '@/utils/fabricPointConverter';

/**
 * Run comprehensive diagnostics for drawing tools
 * @param canvas The fabric canvas instance
 * @param currentTool The currently selected tool
 * @returns Diagnostic report
 */
export const runToolbarDiagnostics = (
  canvas: FabricCanvas | null,
  currentTool: DrawingMode
): { success: boolean; issues: string[] } => {
  const issues: string[] = [];
  
  if (!canvas) {
    issues.push("Canvas reference is null or undefined");
    return { success: false, issues };
  }
  
  try {
    // Check basic canvas properties
    if (!canvas.width || !canvas.height) {
      issues.push("Canvas dimensions not set");
    }
    
    // Check if basic API is available
    if (!canvas.getObjects || typeof canvas.getObjects !== 'function') {
      issues.push("Canvas API methods not available");
    }
    
    // Check if brush is available for drawing tools
    if ((currentTool === DrawingMode.DRAW) && !canvas.freeDrawingBrush) {
      issues.push("Free drawing brush not available for draw tool");
    }
    
    // Check if selection is properly configured
    if (currentTool === DrawingMode.SELECT && !canvas.selection) {
      issues.push("Selection not enabled for select tool");
    }
    
    // Check if straight line tool capability is available
    if (currentTool === DrawingMode.STRAIGHT_LINE) {
      try {
        const fabric = (window as any).fabric;
        if (!fabric || !fabric.Line) {
          issues.push("Fabric.js Line constructor not available");
        }
      } catch (lineError) {
        issues.push(`Error checking straight line capabilities: ${lineError}`);
      }
    }
    
    // Check interaction handlers
    if (!canvas.__eventListeners) {
      issues.push("Event listeners not initialized on canvas");
    } else {
      const events = Object.keys(canvas.__eventListeners);
      if (!events.includes('mouse:down') || !events.includes('mouse:move') || !events.includes('mouse:up')) {
        issues.push("Missing essential mouse event handlers");
      }
    }
    
    // Run advanced capabilities test
    try {
      testCanvasDrawingCapabilities(canvas);
    } catch (testError) {
      issues.push(`Drawing capabilities test failed: ${testError}`);
    }
    
    // Log results to Sentry
    if (issues.length > 0) {
      captureMessage("Toolbar diagnostics found issues", "toolbar-diagnostics", {
        tags: { component: "toolbarDiagnostics", critical: issues.length > 3 },
        extra: { 
          issues,
          currentTool,
          canvasState: {
            width: canvas.width,
            height: canvas.height,
            objects: canvas.getObjects().length,
            isDrawingMode: canvas.isDrawingMode,
            selection: canvas.selection
          }
        }
      });
      
      // Log to console for development
      logger.warn("Toolbar diagnostics found issues:", { issues, currentTool });
    } else {
      // Log success
      logger.info("Toolbar diagnostics passed", { currentTool });
    }
    
    return {
      success: issues.length === 0,
      issues
    };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    issues.push(`Diagnostics error: ${errorMsg}`);
    
    captureError(error as Error, "toolbar-diagnostics-error", {
      tags: { component: "toolbarDiagnostics", critical: true },
      extra: { currentTool }
    });
    
    logger.error("Error running toolbar diagnostics", { error, currentTool });
    
    return {
      success: false,
      issues
    };
  }
};

/**
 * Sets up periodic diagnostics to monitor toolbar functionality
 * @param getCanvas Function to get the current canvas instance
 * @param getTool Function to get the current tool
 * @param interval How often to run diagnostics (ms)
 * @returns Cleanup function
 */
export const setupToolbarMonitoring = (
  getCanvas: () => FabricCanvas | null,
  getTool: () => DrawingMode,
  interval: number = 30000
): () => void => {
  // Log initial setup
  logger.info("Setting up toolbar monitoring", { interval });
  
  // Set up Sentry context
  Sentry.setTag("toolbarMonitoring", "active");
  
  // Store monitoring state
  const state = {
    runs: 0,
    successfulRuns: 0,
    lastRunTime: Date.now(),
    consecutiveFailures: 0,
    hasReportedCritical: false
  };
  
  // Set up monitoring interval
  const intervalId = setInterval(() => {
    const canvas = getCanvas();
    const currentTool = getTool();
    
    state.runs++;
    state.lastRunTime = Date.now();
    
    const result = runToolbarDiagnostics(canvas, currentTool);
    
    if (result.success) {
      state.successfulRuns++;
      state.consecutiveFailures = 0;
      state.hasReportedCritical = false;
    } else {
      state.consecutiveFailures++;
      
      // Report critical issues after multiple consecutive failures
      if (state.consecutiveFailures >= 3 && !state.hasReportedCritical) {
        captureMessage("Critical toolbar issues detected", "toolbar-critical", {
          tags: { component: "toolbarMonitoring", critical: true },
          extra: { 
            issues: result.issues,
            state,
            currentTool
          }
        });
        
        state.hasReportedCritical = true;
      }
    }
    
    // Update Sentry context with monitoring state
    Sentry.setContext("toolbarMonitoring", {
      ...state,
      successRate: state.runs > 0 ? state.successfulRuns / state.runs : 0,
      currentTool
    });
    
  }, interval);
  
  // Return cleanup function
  return () => {
    clearInterval(intervalId);
    Sentry.setTag("toolbarMonitoring", null);
    logger.info("Toolbar monitoring stopped", {
      runs: state.runs,
      successRate: state.runs > 0 ? state.successfulRuns / state.runs : 0
    });
  };
};
