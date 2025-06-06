
/**
 * Utilities for managing drawing history states
 * @module historyUtils
 */
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { MAX_HISTORY_STATES } from "@/utils/drawing";
import { toast } from "sonner";

/**
 * Check if an object is a grid object
 */
export const isGridObject = (
  obj: FabricObject, 
  gridLayerRef: React.MutableRefObject<any[]>
): boolean => {
  return gridLayerRef.current.some(gridObj => gridObj === obj);
};

/**
 * Serialize a Fabric object to a simple object
 * Exported for use in other modules
 */
export const serializeObject = (obj: FabricObject): any => {
  if (!obj || typeof obj.toObject !== 'function') return null;
  
  try {
    // Use the fabric serialization with additional properties
    const serialized = obj.toObject();
    
    // Ensure all necessary properties for reconstruction are included
    if ('id' in obj) {
      serialized.id = (obj as any).id || null;
    }
    
    // Ensure stroke properties are preserved for proper rendering
    if (obj.stroke) serialized.stroke = obj.stroke;
    if (obj.strokeWidth) serialized.strokeWidth = obj.strokeWidth;
    
    // Make sure position is properly captured
    if (obj.left !== undefined) serialized.left = obj.left;
    if (obj.top !== undefined) serialized.top = obj.top;
    
    // Preserve the type explicitly
    serialized.type = obj.type;
    
    // For polylines, ensure points are deep copied to prevent reference issues
    if (obj.type === 'polyline' && (obj as any).points) {
      serialized.points = JSON.parse(JSON.stringify((obj as any).points));
    }
    
    return serialized;
  } catch (err) {
    console.error("Error serializing object:", err);
    return null;
  }
};

/**
 * Capture current canvas state (excluding grid)
 */
export const captureCurrentState = (
  fabricCanvas: FabricCanvas | null,
  gridLayerRef: React.MutableRefObject<any[]>
): any[] => {
  logger.info("Capturing current canvas state");
  if (!fabricCanvas) return [];
  
  // Get current non-grid objects 
  const currentObjects = fabricCanvas.getObjects().filter(obj => 
    !isGridObject(obj, gridLayerRef) && (obj.type === 'polyline' || obj.type === 'path')
  );
  
  logger.info(`Found ${currentObjects.length} objects to capture`);
  
  // Create a deep copy of the serialized objects to avoid reference issues
  return currentObjects.map(obj => {
    const serialized = serializeObject(obj);
    return serialized ? JSON.parse(JSON.stringify(serialized)) : null;
  }).filter(Boolean);
};

/**
 * Compare two canvas states to check if they're different
 * @returns true if states are different
 */
export const areStatesDifferent = (stateA: any[], stateB: any[]): boolean => {
  // Quick length check
  if (!stateA || !stateB || stateA.length !== stateB.length) {
    return true;
  }
  
  // If both are empty, they're the same
  if (stateA.length === 0 && stateB.length === 0) {
    return false;
  }
  
  // Simple JSON comparison - could be improved for performance
  try {
    return JSON.stringify(stateA) !== JSON.stringify(stateB);
  } catch (e) {
    console.warn("Error comparing states:", e);
    // If comparison fails, assume they're different to be safe
    return true;
  }
};

/**
 * Push a new state to history
 */
export const pushToHistory = (
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>,
  state: any[]
): void => {
  if (!historyRef.current) return;
  
  // Create a deep copy of the state to avoid reference issues
  const stateCopy = JSON.parse(JSON.stringify(state));
  
  // Only add state if it's different from the most recent one
  const lastState = historyRef.current.past.length > 0 
    ? historyRef.current.past[historyRef.current.past.length - 1] 
    : null;
    
  if (!lastState || areStatesDifferent(lastState, stateCopy)) {
    // Add state to past and clear future
    historyRef.current.past.push(stateCopy);
    historyRef.current.future = [];
    
    // Limit history size
    if (historyRef.current.past.length > MAX_HISTORY_STATES) {
      historyRef.current.past.shift();
    }
    
    logger.info(`History updated: ${historyRef.current.past.length} states in past, ${historyRef.current.future.length} in future`);
  } else {
    logger.info("State unchanged, not adding to history");
  }
};

/**
 * Check if history has undo states available
 */
export const canUndo = (historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>): boolean => {
  // We can undo if there are drawing objects on the canvas
  return historyRef.current.past.length > 0;
};

/**
 * Check if history has redo states available
 */
export const canRedo = (historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>): boolean => {
  return historyRef.current.future.length > 0;
};

/**
 * Show toast notification for undo/redo operations
 */
export const showHistoryToast = (operation: 'undo' | 'redo', success: boolean): void => {
  if (success) {
    toast.success(`${operation === 'undo' ? 'Undo' : 'Redo'} successful`);
  } else {
    toast.info(`Nothing to ${operation}`);
  }
};

// Add logger import
import logger from "./logger";
