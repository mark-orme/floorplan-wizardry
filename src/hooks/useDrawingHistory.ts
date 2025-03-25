
/**
 * Custom hook for managing drawing history (undo/redo)
 * @module useDrawingHistory
 */
import { useCallback } from "react";
import { Canvas as FabricCanvas, Object as FabricObject, Polyline, Path, util as FabricUtil } from "fabric";
import { toast } from "sonner";
import { MAX_HISTORY_STATES } from "@/utils/drawing";

interface UseDrawingHistoryProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  historyRef: React.MutableRefObject<{past: any[][], future: any[][]}>;
  clearDrawings: () => void;
  recalculateGIA: () => void;
}

/**
 * Hook for managing undo/redo functionality
 * @param {UseDrawingHistoryProps} props - Hook properties
 * @returns {Object} Undo and redo handler functions
 */
export const useDrawingHistory = ({
  fabricCanvasRef,
  gridLayerRef,
  historyRef,
  clearDrawings,
  recalculateGIA
}: UseDrawingHistoryProps) => {
  /**
   * Check if an object is a grid object
   * @param {FabricObject} obj - The object to check
   * @returns {boolean} True if the object is part of the grid
   */
  const isGridObject = useCallback((obj: FabricObject) => {
    return gridLayerRef.current.some(gridObj => gridObj === obj);
  }, [gridLayerRef]);

  /**
   * Serialize objects for history storage
   * @param {FabricObject[]} objects - Objects to serialize
   * @returns {any[]} Serialized object data
   */
  const serializeObjects = useCallback((objects: FabricObject[]): any[] => {
    return objects.map(obj => {
      if (!obj || typeof obj.toObject !== 'function') return null;
      try {
        // Use Fabric's built-in serialization
        const serialized = obj.toObject();
        return serialized;
      } catch (err) {
        console.warn("Error serializing object:", err);
        return null;
      }
    }).filter(Boolean);
  }, []);

  /**
   * Deserialize objects from history storage
   * @param {any[]} serializedData - Serialized object data
   * @returns {FabricObject[]} Reconstructed fabric objects
   */
  const deserializeObjects = useCallback((serializedData: any[]): FabricObject[] => {
    if (!fabricCanvasRef.current) return [];
    
    return serializedData.map(data => {
      if (!data) return null;
      try {
        // Use the appropriate Fabric constructor based on type
        if (data.type === 'polyline') {
          return new Polyline(data.points, {
            ...data,
            objectCaching: true,
            selectable: false
          });
        } else if (data.type === 'path') {
          return new Path(data.path, {
            ...data,
            objectCaching: true,
            selectable: false
          });
        } else {
          // Default case for other object types
          return FabricUtil.enlivenObjects([data], {
            reviver: function(obj) {
              return obj;
            }
          })[0];
        }
      } catch (err) {
        console.warn("Error deserializing object:", err);
        return null;
      }
    }).filter(Boolean) as FabricObject[];
  }, [fabricCanvasRef]);

  /**
   * Undo the last drawing action
   */
  const handleUndo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const { past, future } = historyRef.current;
    
    if (past.length === 0) {
      toast.info("Nothing to undo");
      return;
    }
    
    const fabricCanvas = fabricCanvasRef.current;
    
    try {
      console.log("Undo operation - history state:", { 
        pastStates: past.length, 
        futureStates: future.length 
      });
      
      // Get the current state before making changes (for redo)
      const currentNonGridObjects = fabricCanvas.getObjects().filter(obj => 
        !isGridObject(obj) && (obj.type === 'polyline' || obj.type === 'path')
      );
      
      // Save current state to future for redo
      const serializedCurrentState = serializeObjects(currentNonGridObjects);
      future.unshift(serializedCurrentState);
      console.log("Saved current state for redo with", serializedCurrentState.length, "objects");
      
      // Get the previous state (pop removes the last element)
      const previousState = past.pop();
      console.log("Restoring previous state with", previousState ? previousState.length : 0, "objects");
      
      // Remove all non-grid objects to start with a clean canvas
      const objectsToRemove = fabricCanvas.getObjects().filter(obj => 
        !isGridObject(obj) && (obj.type === 'polyline' || obj.type === 'path')
      );
      
      if (objectsToRemove.length > 0) {
        console.log("Removing", objectsToRemove.length, "current drawing objects");
        objectsToRemove.forEach(obj => {
          try {
            fabricCanvas.remove(obj);
          } catch (err) {
            console.warn("Error removing object during undo:", err);
          }
        });
      }
      
      // Add the objects from the previous state
      if (previousState && previousState.length > 0) {
        const objectsToAdd = deserializeObjects(previousState);
        console.log("Adding", objectsToAdd.length, "objects from previous state");
        
        objectsToAdd.forEach(obj => {
          if (obj) {
            try {
              fabricCanvas.add(obj);
            } catch (err) {
              console.error("Error adding object from history:", err);
            }
          }
        });
      }
      
      // Ensure grid stays in background
      gridLayerRef.current.forEach(gridObj => {
        if (fabricCanvas.contains(gridObj)) {
          fabricCanvas.sendObjectToBack(gridObj);
        }
      });
      
      fabricCanvas.requestRenderAll();
      recalculateGIA();
      toast.success("Undo successful");
      
    } catch (error) {
      console.error("Error during undo operation:", error);
      toast.error("Failed to undo");
    }
  }, [fabricCanvasRef, historyRef, isGridObject, serializeObjects, deserializeObjects, gridLayerRef, recalculateGIA]);
  
  /**
   * Redo the last undone drawing action
   */
  const handleRedo = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const { past, future } = historyRef.current;
    
    if (future.length === 0) {
      toast.info("Nothing to redo");
      return;
    }
    
    const fabricCanvas = fabricCanvasRef.current;
    
    try {
      console.log("Redo operation - history state:", { 
        pastStates: past.length, 
        futureStates: future.length 
      });
      
      // Get the current state before making changes (for undo if needed)
      const currentNonGridObjects = fabricCanvas.getObjects().filter(obj => 
        !isGridObject(obj) && (obj.type === 'polyline' || obj.type === 'path')
      );
      
      // Save current state to past
      const serializedCurrentState = serializeObjects(currentNonGridObjects);
      past.push(serializedCurrentState);
      console.log("Saved current state to past history with", serializedCurrentState.length, "objects");
      
      // Get the most recent future state (shift removes the first element)
      const futureState = future.shift();
      console.log("Restoring future state with", futureState ? futureState.length : 0, "objects");
      
      // Remove all non-grid objects to start with a clean canvas
      const objectsToRemove = fabricCanvas.getObjects().filter(obj => 
        !isGridObject(obj) && (obj.type === 'polyline' || obj.type === 'path')
      );
      
      if (objectsToRemove.length > 0) {
        console.log("Removing", objectsToRemove.length, "current drawing objects");
        objectsToRemove.forEach(obj => {
          try {
            fabricCanvas.remove(obj);
          } catch (err) {
            console.warn("Error removing object during redo:", err);
          }
        });
      }
      
      // Add the objects from the future state
      if (futureState && futureState.length > 0) {
        const objectsToAdd = deserializeObjects(futureState);
        console.log("Adding", objectsToAdd.length, "objects from future state");
        
        objectsToAdd.forEach(obj => {
          if (obj) {
            try {
              fabricCanvas.add(obj);
            } catch (err) {
              console.error("Error adding object from future history:", err);
            }
          }
        });
      }
      
      // Ensure grid stays in background
      gridLayerRef.current.forEach(gridObj => {
        if (fabricCanvas.contains(gridObj)) {
          fabricCanvas.sendObjectToBack(gridObj);
        }
      });
      
      fabricCanvas.requestRenderAll();
      recalculateGIA();
      toast.success("Redo successful");
      
    } catch (error) {
      console.error("Error during redo operation:", error);
      toast.error("Failed to redo");
    }
    
    // Trim history if it gets too large
    if (past.length > MAX_HISTORY_STATES) {
      past.splice(0, past.length - MAX_HISTORY_STATES);
    }
    if (future.length > MAX_HISTORY_STATES) {
      future.splice(MAX_HISTORY_STATES, future.length - MAX_HISTORY_STATES);
    }
  }, [fabricCanvasRef, historyRef, isGridObject, serializeObjects, deserializeObjects, gridLayerRef, recalculateGIA]);
  
  return {
    handleUndo,
    handleRedo
  };
};
