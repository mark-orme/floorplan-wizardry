
/**
 * Grid Monitoring Utility
 * Provides continuous monitoring and self-healing for grid objects
 * @module utils/grid/gridMonitoring
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { runGridDiagnostics, applyGridFixes, emergencyGridFix } from "./gridDiagnostics";
import { createBasicEmergencyGrid } from "./gridDebugUtils";
import { toast } from "sonner";
import { captureError } from "../sentryUtils";
import logger from "../logger";
import { trackGridError, checkCanvasHealth } from "./gridErrorTracker";
import { validateCanvasForGrid } from "./gridValidator";

// Interface for monitoring options
interface GridMonitoringOptions {
  /** How often to check grid health (ms) */
  checkInterval?: number;
  /** Whether to attempt auto-repair */
  autoRepair?: boolean;
  /** Whether to use emergency grid on critical failures */
  useEmergencyGrid?: boolean;
  /** Maximum auto-repair attempts */
  maxRepairAttempts?: number;
}

// Default options
const DEFAULT_OPTIONS: Required<GridMonitoringOptions> = {
  checkInterval: 5000,
  autoRepair: true,
  useEmergencyGrid: true,
  maxRepairAttempts: 3
};

// Track monitoring state
const monitoringState = {
  isMonitoring: false,
  intervalId: null as number | null,
  repairAttempts: 0,
  lastRepairTime: 0,
  monitoringStartTime: 0,
  canvas: null as FabricCanvas | null,
  gridLayerRef: null as React.MutableRefObject<FabricObject[]> | null,
  consecutiveErrors: 0,
  lastHealthCheck: null as Record<string, any> | null
};

/**
 * Start monitoring grid health
 * @param {FabricCanvas} canvas - Canvas to monitor
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Grid objects reference
 * @param {GridMonitoringOptions} [options] - Monitoring options
 * @returns {boolean} Whether monitoring was started
 */
export const startGridMonitoring = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  options: GridMonitoringOptions = {}
): boolean => {
  // Don't start if already monitoring
  if (monitoringState.isMonitoring) {
    return false;
  }
  
  // Validate canvas first
  if (!validateCanvasForGrid(canvas)) {
    trackGridError("Cannot start monitoring with invalid canvas", "monitoring-start", {
      canvasHealth: checkCanvasHealth(canvas)
    });
    return false;
  }
  
  // Merge options - use spread to ensure all required properties are present
  const mergedOptions: Required<GridMonitoringOptions> = { 
    ...DEFAULT_OPTIONS, 
    ...options 
  };
  
  try {
    // Set monitoring state
    monitoringState.isMonitoring = true;
    monitoringState.canvas = canvas;
    monitoringState.gridLayerRef = gridLayerRef;
    monitoringState.repairAttempts = 0;
    monitoringState.monitoringStartTime = Date.now();
    monitoringState.consecutiveErrors = 0;
    
    // Start monitoring interval
    monitoringState.intervalId = window.setInterval(() => {
      performGridHealthCheck(canvas, gridLayerRef, mergedOptions);
    }, mergedOptions.checkInterval);
    
    // Log monitoring start
    logger.info("Grid monitoring started", mergedOptions);
    console.log("Grid monitoring started", mergedOptions);
    
    // Report to Sentry for analytics
    captureError(
      new Error("Grid monitoring started"),
      "grid-monitoring-start",
      {
        level: "info",
        extra: {
          options: mergedOptions,
          gridObjectCount: gridLayerRef.current.length,
          canvasDimensions: `${canvas.width}x${canvas.height}`
        }
      }
    );
    
    return true;
  } catch (error) {
    console.error("Error starting grid monitoring:", error);
    trackGridError(error, "monitoring-start-failed");
    
    // Reset state on error
    monitoringState.isMonitoring = false;
    
    return false;
  }
};

/**
 * Stop grid monitoring
 * @returns {boolean} Whether monitoring was stopped
 */
export const stopGridMonitoring = (): boolean => {
  if (!monitoringState.isMonitoring || monitoringState.intervalId === null) {
    return false;
  }
  
  try {
    clearInterval(monitoringState.intervalId);
    
    // Reset state
    monitoringState.isMonitoring = false;
    monitoringState.intervalId = null;
    
    // Log monitoring stop
    logger.info("Grid monitoring stopped");
    console.log("Grid monitoring stopped");
    
    return true;
  } catch (error) {
    console.error("Error stopping grid monitoring:", error);
    trackGridError(error, "monitoring-stop-failed");
    return false;
  }
};

/**
 * Perform grid health check
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Grid objects reference
 * @param {Required<GridMonitoringOptions>} options - Monitoring options
 * @returns {boolean} Whether grid is healthy
 */
const performGridHealthCheck = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  options: Required<GridMonitoringOptions>
): boolean => {
  try {
    // First check if canvas is still valid
    if (!validateCanvasForGrid(canvas)) {
      trackGridError("Canvas became invalid during monitoring", "health-check", {
        canvasHealth: checkCanvasHealth(canvas)
      });
      monitoringState.consecutiveErrors++;
      return false;
    }
    
    // Run diagnostics
    const diagnostics = runGridDiagnostics(canvas, gridLayerRef.current, false);
    
    // Store last health check
    monitoringState.lastHealthCheck = diagnostics;
    
    // If grid is healthy, reset repair attempts and error counter
    if (diagnostics.status === 'ok') {
      monitoringState.repairAttempts = 0;
      monitoringState.consecutiveErrors = 0;
      return true;
    }
    
    // Don't repair too frequently
    const now = Date.now();
    if (now - monitoringState.lastRepairTime < 10000) { // 10 seconds
      return false;
    }
    
    // Check if we should attempt repair
    if (options.autoRepair && monitoringState.repairAttempts < options.maxRepairAttempts) {
      // For critical issues
      if (diagnostics.status === 'critical') {
        console.warn("Critical grid issues detected, attempting repair:", diagnostics.issues);
        logger.warn("Critical grid issues detected, attempting repair", { issues: diagnostics.issues });
        
        // Try normal fixes first
        const fixesApplied = applyGridFixes(canvas, gridLayerRef.current);
        
        // If fixes didn't work and emergency grid is enabled, try that
        if (!fixesApplied && options.useEmergencyGrid) {
          console.warn("Standard fixes failed, attempting emergency grid");
          emergencyGridFix(canvas, gridLayerRef);
          
          // Log emergency action to Sentry
          captureError(
            new Error("Emergency grid created by monitoring"),
            "grid-monitoring-emergency",
            {
              level: "warning",
              extra: { diagnostics }
            }
          );
        }
      }
      // For non-critical issues
      else if (diagnostics.status === 'warning') {
        console.log("Grid issues detected, attempting repair:", diagnostics.issues);
        applyGridFixes(canvas, gridLayerRef.current);
      }
      
      // Update repair state
      monitoringState.repairAttempts++;
      monitoringState.lastRepairTime = now;
      
      // Run diagnostics again to check if fixes worked
      const postFixDiagnostics = runGridDiagnostics(canvas, gridLayerRef.current, false);
      
      if (postFixDiagnostics.status === 'ok') {
        monitoringState.consecutiveErrors = 0;
        return true;
      } else {
        monitoringState.consecutiveErrors++;
      }
    }
    
    // Handle persistent failures
    if (monitoringState.consecutiveErrors >= 5) {
      trackGridError(
        `Persistent grid issues after ${monitoringState.consecutiveErrors} consecutive checks`,
        "persistent-grid-failure",
        { lastDiagnostics: diagnostics }
      );
      
      // Attempt one last desperate fix if emergency grid is enabled
      if (options.useEmergencyGrid && monitoringState.repairAttempts >= options.maxRepairAttempts) {
        console.warn("All repair attempts failed, creating basic emergency grid as last resort");
        createBasicEmergencyGrid(canvas, gridLayerRef);
        monitoringState.repairAttempts = 0;
        toast.warning("Grid had persistent issues. Created a simplified grid.", {
          id: "grid-emergency-fallback",
          duration: 3000
        });
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error in grid health check:", error);
    trackGridError(error, "health-check-failed");
    monitoringState.consecutiveErrors++;
    return false;
  }
};

/**
 * Get current monitoring status
 * @returns {Object} Current monitoring status
 */
export const getMonitoringStatus = (): Record<string, any> => {
  return {
    isMonitoring: monitoringState.isMonitoring,
    repairAttempts: monitoringState.repairAttempts,
    lastRepairTime: monitoringState.lastRepairTime ? new Date(monitoringState.lastRepairTime).toISOString() : null,
    monitoringDuration: monitoringState.monitoringStartTime ? 
      (Date.now() - monitoringState.monitoringStartTime) / 1000 : 0,
    gridObjectCount: monitoringState.gridLayerRef?.current?.length || 0,
    consecutiveErrors: monitoringState.consecutiveErrors,
    lastHealthCheck: monitoringState.lastHealthCheck
  };
};

/**
 * Force grid repair attempt
 * @param {FabricCanvas} canvas - Canvas to repair
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Grid objects reference
 * @returns {boolean} Whether repair was attempted
 */
export const forceGridRepair = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>
): boolean => {
  try {
    console.log("Forcing grid repair");
    logger.info("Manual grid repair initiated");
    
    // First try standard fixes
    const fixesApplied = applyGridFixes(canvas, gridLayerRef.current);
    
    // If standard fixes failed, try emergency grid
    if (!fixesApplied) {
      console.warn("Standard fixes failed, creating emergency grid");
      createBasicEmergencyGrid(canvas, gridLayerRef);
    }
    
    // Show toast
    toast.success("Grid repair complete");
    
    // Reset consecutive errors
    monitoringState.consecutiveErrors = 0;
    
    return true;
  } catch (error) {
    console.error("Error forcing grid repair:", error);
    trackGridError(error, "manual-repair-failed");
    
    // Show error toast
    toast.error("Grid repair failed");
    
    return false;
  }
};

/**
 * Perform an immediate grid health check
 * @returns {Object} Health check results
 */
export const checkGridImmediately = (): Record<string, any> | null => {
  if (!monitoringState.isMonitoring || !monitoringState.canvas || !monitoringState.gridLayerRef) {
    return null;
  }
  
  return runGridDiagnostics(
    monitoringState.canvas, 
    monitoringState.gridLayerRef.current, 
    true
  );
};
