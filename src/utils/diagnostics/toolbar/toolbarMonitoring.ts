
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import logger from '@/utils/logger';
import * as Sentry from '@sentry/react';
import { captureMessage } from '@/utils/sentry';
import { runToolbarDiagnostics } from './toolbarRunDiagnostics';

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
          tags: { 
            component: "toolbarMonitoring", 
            critical: "true" // Convert boolean to string
          },
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
