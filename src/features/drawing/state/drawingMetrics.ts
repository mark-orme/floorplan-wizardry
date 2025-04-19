
/**
 * Drawing metrics tracking
 * Tracks drawing tool usage and object operations
 */
import { DrawingMode } from '@/constants/drawingModes';

// Initial state for drawing metrics
const initialMetrics = {
  toolSwitchCount: 0,
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
    [DrawingMode.LINE]: 0,
    [DrawingMode.MEASURE]: 0,
    [DrawingMode.PAN]: 0
  },
  objectsCreated: 0,
  objectsModified: 0,
  objectsDeleted: 0,
  lastToolChange: Date.now(),
  currentTool: DrawingMode.SELECT,
  sessionStart: Date.now(),
  sessionId: `drawing-session-${Date.now()}`,
  drawingEvents: [] as { timestamp: number; event: string; tool: DrawingMode }[]
};

// Current metrics state
let metricsState = { ...initialMetrics };

/**
 * Register a tool change event
 * @param tool New tool selected
 */
export function registerToolChange(tool: DrawingMode): void {
  const now = Date.now();
  const previousTool = metricsState.currentTool;
  const usageDuration = now - metricsState.lastToolChange;
  
  // Update tool usage duration
  metricsState.toolUsageDuration[previousTool] += usageDuration;
  
  // Update metrics
  metricsState.toolSwitchCount++;
  metricsState.lastToolChange = now;
  metricsState.currentTool = tool;
  
  // Record drawing event
  metricsState.drawingEvents.push({
    timestamp: now,
    event: 'tool-change',
    tool
  });
  
  // Log to console for debugging
  console.log(`Tool changed from ${previousTool} to ${tool} after ${usageDuration}ms of usage`);
  
  // Update window app state for debugging and error reporting
  if (typeof window !== 'undefined' && window.__app_state) {
    if (!window.__app_state.drawing) {
      window.__app_state.drawing = {};
    }
    window.__app_state.drawing.currentTool = tool;
  }
}

/**
 * Register an object creation event
 */
export function registerObjectCreated(): void {
  metricsState.objectsCreated++;
  
  // Record drawing event
  metricsState.drawingEvents.push({
    timestamp: Date.now(),
    event: 'object-created',
    tool: metricsState.currentTool
  });
}

/**
 * Register an object modification event
 */
export function registerObjectModified(): void {
  metricsState.objectsModified++;
  
  // Record drawing event
  metricsState.drawingEvents.push({
    timestamp: Date.now(),
    event: 'object-modified',
    tool: metricsState.currentTool
  });
}

/**
 * Register an object deletion event
 */
export function registerObjectDeleted(): void {
  metricsState.objectsDeleted++;
  
  // Record drawing event
  metricsState.drawingEvents.push({
    timestamp: Date.now(),
    event: 'object-deleted',
    tool: metricsState.currentTool
  });
}

/**
 * Get the current drawing metrics
 * @returns Current metrics state
 */
export function getDrawingMetrics() {
  // Calculate session duration
  const sessionDuration = Date.now() - metricsState.sessionStart;
  
  return {
    ...metricsState,
    sessionDuration,
    toolUsageDuration: {
      [DrawingMode.SELECT]: metricsState.toolUsageDuration[DrawingMode.SELECT],
      [DrawingMode.DRAW]: metricsState.toolUsageDuration[DrawingMode.DRAW],
      [DrawingMode.STRAIGHT_LINE]: metricsState.toolUsageDuration[DrawingMode.STRAIGHT_LINE],
      [DrawingMode.RECTANGLE]: metricsState.toolUsageDuration[DrawingMode.RECTANGLE],
      [DrawingMode.CIRCLE]: metricsState.toolUsageDuration[DrawingMode.CIRCLE],
      [DrawingMode.TEXT]: metricsState.toolUsageDuration[DrawingMode.TEXT],
      [DrawingMode.ERASER]: metricsState.toolUsageDuration[DrawingMode.ERASER],
      [DrawingMode.HAND]: metricsState.toolUsageDuration[DrawingMode.HAND],
      [DrawingMode.WALL]: metricsState.toolUsageDuration[DrawingMode.WALL],
      [DrawingMode.ROOM]: metricsState.toolUsageDuration[DrawingMode.ROOM],
      [DrawingMode.LINE]: metricsState.toolUsageDuration[DrawingMode.LINE],
      [DrawingMode.MEASURE]: metricsState.toolUsageDuration[DrawingMode.MEASURE],
      [DrawingMode.PAN]: metricsState.toolUsageDuration[DrawingMode.PAN]
    }
  };
}

/**
 * Reset drawing metrics
 */
export function resetDrawingMetrics(): void {
  metricsState = { 
    ...initialMetrics,
    sessionStart: Date.now(),
    sessionId: `drawing-session-${Date.now()}`
  };
}

/**
 * Get the current session ID
 * @returns Current drawing session ID
 */
export function getDrawingSessionId(): string {
  return metricsState.sessionId;
}
