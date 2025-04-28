
import { DrawingMode } from '@/constants/drawingModes';

export interface DrawingMetrics {
  toolChanges: number;
  objectsCreated: number;
  objectsDeleted: number;
  objectsModified: number;
  undoCount: number;
  redoCount: number;
  timeSpent: number;
  lastToolUsed: DrawingMode | null;
  lastObjectType: string | null;
}

// Initialize metrics
let metrics: DrawingMetrics = {
  toolChanges: 0,
  objectsCreated: 0,
  objectsDeleted: 0,
  objectsModified: 0,
  undoCount: 0,
  redoCount: 0,
  timeSpent: 0,
  lastToolUsed: null,
  lastObjectType: null
};

// Register tool change
export const registerToolChange = (tool: DrawingMode) => {
  metrics.toolChanges++;
  metrics.lastToolUsed = tool;
};

// Register object created
export const registerObjectCreated = (objectType: string) => {
  metrics.objectsCreated++;
  metrics.lastObjectType = objectType;
};

// Register object deleted
export const registerObjectDeleted = () => {
  metrics.objectsDeleted++;
};

// Register object modified
export const registerObjectModified = () => {
  metrics.objectsModified++;
};

// Get drawing metrics
export const getDrawingMetrics = (): DrawingMetrics => {
  return { ...metrics };
};

// Reset drawing metrics
export const resetDrawingMetrics = () => {
  metrics = {
    toolChanges: 0,
    objectsCreated: 0,
    objectsDeleted: 0,
    objectsModified: 0,
    undoCount: 0,
    redoCount: 0,
    timeSpent: 0,
    lastToolUsed: null,
    lastObjectType: null
  };
};

export default {
  DrawingMetrics,
  registerToolChange,
  registerObjectCreated,
  registerObjectDeleted,
  registerObjectModified,
  getDrawingMetrics,
  resetDrawingMetrics
};
