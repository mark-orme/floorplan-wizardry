
import { DrawingMode } from '@/constants/drawingModes';

// Tracking metrics for drawing operations
interface DrawingMetrics {
  toolUsageDuration: Record<DrawingMode, number>;
  toolSwitchCount: number;
  objectsCreated: number;
  objectsDeleted: number;
  objectsModified: number;
  lastActiveTimestamp: number;
}

// Global state for drawing metrics
let metrics: DrawingMetrics = {
  toolUsageDuration: {
    [DrawingMode.SELECT]: 0,
    [DrawingMode.DRAW]: 0,
    [DrawingMode.STRAIGHT_LINE]: 0,
    [DrawingMode.RECTANGLE]: 0,
    [DrawingMode.CIRCLE]: 0,
    [DrawingMode.TEXT]: 0,
    [DrawingMode.ERASER]: 0,
    [DrawingMode.HAND]: 0,
    [DrawingMode.WALL]: 0,
    [DrawingMode.ROOM]: 0,
  },
  toolSwitchCount: 0,
  objectsCreated: 0,
  objectsDeleted: 0,
  objectsModified: 0,
  lastActiveTimestamp: Date.now()
};

// Tracking current tool state
let currentTool: DrawingMode = DrawingMode.SELECT;
let toolStartTime: number = Date.now();

/**
 * Register a tool change for metrics collection
 * @param tool The newly selected tool
 */
export function registerToolChange(tool: DrawingMode): void {
  const now = Date.now();
  
  // Update duration for the previous tool
  const duration = now - toolStartTime;
  metrics.toolUsageDuration[currentTool] += duration;
  
  // Track the switch
  metrics.toolSwitchCount++;
  
  // Update state
  currentTool = tool;
  toolStartTime = now;
  metrics.lastActiveTimestamp = now;
  
  // Update global state for Sentry
  if (typeof window !== 'undefined' && window.__app_state?.drawing) {
    window.__app_state.drawing.currentTool = tool;
  }
}

/**
 * Register object creation
 */
export function registerObjectCreated(): void {
  metrics.objectsCreated++;
  metrics.lastActiveTimestamp = Date.now();
}

/**
 * Register object deletion
 */
export function registerObjectDeleted(): void {
  metrics.objectsDeleted++;
  metrics.lastActiveTimestamp = Date.now();
}

/**
 * Register object modification
 */
export function registerObjectModified(): void {
  metrics.objectsModified++;
  metrics.lastActiveTimestamp = Date.now();
}

/**
 * Get current drawing metrics
 * @returns Current metrics snapshot
 */
export function getDrawingMetrics(): DrawingMetrics {
  // Update the current tool's duration first
  const now = Date.now();
  const currentDuration = now - toolStartTime;
  
  // Return a copy with the updated duration
  return {
    ...metrics,
    toolUsageDuration: {
      ...metrics.toolUsageDuration,
      [currentTool]: metrics.toolUsageDuration[currentTool] + currentDuration
    }
  };
}

/**
 * Reset drawing metrics (e.g., for a new session)
 */
export function resetDrawingMetrics(): void {
  // Create fresh metrics object
  metrics = {
    toolUsageDuration: {
      [DrawingMode.SELECT]: 0,
      [DrawingMode.DRAW]: 0,
      [DrawingMode.STRAIGHT_LINE]: 0,
      [DrawingMode.RECTANGLE]: 0,
      [DrawingMode.CIRCLE]: 0,
      [DrawingMode.TEXT]: 0,
      [DrawingMode.ERASER]: 0,
      [DrawingMode.HAND]: 0,
      [DrawingMode.WALL]: 0,
      [DrawingMode.ROOM]: 0,
    },
    toolSwitchCount: 0,
    objectsCreated: 0,
    objectsDeleted: 0,
    objectsModified: 0,
    lastActiveTimestamp: Date.now()
  };
  
  // Reset timing info
  toolStartTime = Date.now();
}
