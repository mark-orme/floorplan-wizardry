
// Drawing metrics types and utilities

export interface DrawingMetrics {
  objectCount: number;
  toolChanges: number;
  objectsCreated: number;
  objectsDeleted: number;
  objectsModified: number;
  lastToolUsed: string | null;
  sessionStartTime: number;
  lastInteraction: number;
}

// Initial metrics state
const initialMetrics: DrawingMetrics = {
  objectCount: 0,
  toolChanges: 0,
  objectsCreated: 0,
  objectsDeleted: 0,
  objectsModified: 0,
  lastToolUsed: null,
  sessionStartTime: Date.now(),
  lastInteraction: Date.now()
};

// Current metrics
let currentMetrics: DrawingMetrics = { ...initialMetrics };

// Register tool change
export function registerToolChange(toolName: string): void {
  currentMetrics.toolChanges++;
  currentMetrics.lastToolUsed = toolName;
  currentMetrics.lastInteraction = Date.now();
}

// Register object created
export function registerObjectCreated(): void {
  currentMetrics.objectsCreated++;
  currentMetrics.objectCount++;
  currentMetrics.lastInteraction = Date.now();
}

// Register object deleted
export function registerObjectDeleted(): void {
  currentMetrics.objectsDeleted++;
  currentMetrics.objectCount = Math.max(0, currentMetrics.objectCount - 1);
  currentMetrics.lastInteraction = Date.now();
}

// Register object modified
export function registerObjectModified(): void {
  currentMetrics.objectsModified++;
  currentMetrics.lastInteraction = Date.now();
}

// Get current metrics
export function getDrawingMetrics(): DrawingMetrics {
  return { ...currentMetrics };
}

// Reset metrics
export function resetDrawingMetrics(): void {
  currentMetrics = {
    ...initialMetrics,
    sessionStartTime: Date.now()
  };
}

// Export class for compatibility
export class DrawingMetrics {
  static getMetrics(): DrawingMetrics {
    return getDrawingMetrics();
  }
  
  static reset(): void {
    resetDrawingMetrics();
  }
}
