
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
const DEFAULT_OPTIONS: GridMonitoringOptions = {
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
  gridLayerRef: null as React.MutableRefObject<FabricObject[]> | null
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
  
  // Merge options
  const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    // Set monitoring state
    monitoringState.isMonitoring = true;
    monitoringState.canvas = canvas;
    monitoringState.gridLayerRef = gridLayerRef;
    monitoringState.repairAttempts = 0;
    monitoringState.monitoringStartTime = Date.now();
    
    // Start monitoring interval
    monitoringState.intervalId = window.setInterval(() => {
      performGridHealthCheck(canvas, gridLayerRef, mergedOptions);
    }, mergedOptions.checkInterval);
    
    // Log monitoring start
    logger.info("Grid monitoring started", mergedOptions);
    console.log("Grid monitoring started", mergedOptions);
    
    return true;
  } catch (error) {
    console.error("Error starting grid monitoring:", error);
    
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
    return false;
  }
};

/**
 * Perform grid health check
 * @param {FabricCanvas} canvas - Canvas to check
 * @param {React.MutableRefObject<FabricObject[]>} gridLayerRef - Grid objects reference
 * @param {GridMonitoringOptions} options - Monitoring options
 * @returns {boolean} Whether grid is healthy
 */
const performGridHealthCheck = (
  canvas: FabricCanvas,
  gridLayerRef: React.MutableRefObject<FabricObject[]>,
  options: Required<GridMonitoringOptions>
): boolean => {
  try {
    // Run diagnostics
    const diagnostics = runGridDiagnostics(canvas, gridLayerRef.current, false);
    
    // If grid is healthy, reset repair attempts
    if (diagnostics.status === 'ok') {
      monitoringState.repairAttempts = 0;
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
      return postFixDiagnostics.status === 'ok';
    }
    
    return false;
  } catch (error) {
    console.error("Error in grid health check:", error);
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
    gridObjectCount: monitoringState.gridLayerRef?.current?.length || 0
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
    
    // First try standard fixes
    const fixesApplied = applyGridFixes(canvas, gridLayerRef.current);
    
    // If standard fixes failed, try emergency grid
    if (!fixesApplied) {
      console.warn("Standard fixes failed, creating emergency grid");
      createBasicEmergencyGrid(canvas, gridLayerRef);
    }
    
    // Show toast
    toast.success("Grid repair complete");
    
    return true;
  } catch (error) {
    console.error("Error forcing grid repair:", error);
    
    // Show error toast
    toast.error("Grid repair failed");
    
    return false;
  }
};
