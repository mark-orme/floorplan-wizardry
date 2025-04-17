import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { Canvas as FabricCanvas, Point } from 'fabric';
import { batchCanvasOperations, debounce } from '@/utils/canvas/renderOptimizer';
import { useOptimizedObjectManagement } from './useOptimizedObjectManagement';
import { Point as AppPoint } from '@/types/core/Point';
import { serializeCanvasState } from '@/utils/canvas/canvasSerializer';

interface UseOptimizedCanvasStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Hook for optimized canvas state management
 * Reduces renders and improves performance for canvas operations
 */
export const useOptimizedCanvasState = ({
  fabricCanvasRef
}: UseOptimizedCanvasStateProps) => {
  // Canvas state
  const [zoom, setZoom] = useState(1);
  const [canvasState, setCanvasState] = useState<{
    objectCount: number;
    selectedObjectCount: number;
    isDirty: boolean;
  }>({
    objectCount: 0,
    selectedObjectCount: 0,
    isDirty: false
  });
  
  // Use optimized object management
  const {
    addObjects,
    removeObjects,
    updateObjects,
    startBatch,
    commitBatch
  } = useOptimizedObjectManagement({ fabricCanvasRef });
  
  // Track if canvas needs saving
  const isDirtyRef = useRef(false);
  
  // Update canvas state (debounced to prevent excessive updates)
  const updateCanvasState = useCallback(debounce(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    setCanvasState({
      objectCount: canvas.getObjects().filter(obj => !(obj as any).isGrid).length,
      selectedObjectCount: canvas.getActiveObjects().length,
      isDirty: isDirtyRef.current
    });
  }, 150), [fabricCanvasRef]);
  
  // Handle zoom changes
  const handleZoom = useCallback((newZoom: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Clamp zoom between reasonable values
    newZoom = Math.max(0.1, Math.min(10, newZoom));
    
    // Create a proper Fabric.js Point object for the center
    const centerPoint = new Point(canvas.width! / 2, canvas.height! / 2);
    
    canvas.zoomToPoint(centerPoint, newZoom);
    
    setZoom(newZoom);
    canvas.requestRenderAll();
    
    // Trigger zoom:changed event for grid and other components
    canvas.fire('zoom:changed', { zoom: newZoom });
  }, [fabricCanvasRef]);
  
  // Optimize pan operation
  const handlePan = useCallback((dx: number, dy: number) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const vpt = canvas.viewportTransform;
    if (!vpt) return;
    
    vpt[4] += dx;
    vpt[5] += dy;
    
    canvas.requestRenderAll();
  }, [fabricCanvasRef]);
  
  // Reset view to fit all content
  const resetView = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Reset zoom and pan
    canvas.setViewportTransform([1, 0, 0, 1, 0, 0]);
    setZoom(1);
    canvas.requestRenderAll();
    
    // Trigger zoom:changed event
    canvas.fire('zoom:changed', { zoom: 1 });
  }, [fabricCanvasRef]);
  
  // Mark canvas as having unsaved changes
  const markDirty = useCallback(() => {
    isDirtyRef.current = true;
    updateCanvasState();
  }, [updateCanvasState]);
  
  // Mark canvas as saved
  const markSaved = useCallback(() => {
    isDirtyRef.current = false;
    updateCanvasState();
  }, [updateCanvasState]);
  
  // Set up event listeners to track canvas state
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const handleObjectModified = () => {
      isDirtyRef.current = true;
      updateCanvasState();
    };
    
    const handleSelectionUpdated = () => {
      updateCanvasState();
    };
    
    // Set up event listeners
    canvas.on('object:added', handleObjectModified);
    canvas.on('object:removed', handleObjectModified);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('selection:created', handleSelectionUpdated);
    canvas.on('selection:updated', handleSelectionUpdated);
    canvas.on('selection:cleared', handleSelectionUpdated);
    
    // Initial state update
    updateCanvasState();
    
    return () => {
      // Clean up event listeners
      canvas.off('object:added', handleObjectModified);
      canvas.off('object:removed', handleObjectModified);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('selection:created', handleSelectionUpdated);
      canvas.off('selection:updated', handleSelectionUpdated);
      canvas.off('selection:cleared', handleSelectionUpdated);
    };
  }, [fabricCanvasRef, updateCanvasState]);
  
  // Create a memoized snapshot of the canvas for undo/redo
  const createSnapshot = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    // Use toJSON for lightweight snapshots
    return canvas.toJSON(['id', 'name', 'isGrid', 'isLargeGrid', 'objectType']);
  }, [fabricCanvasRef]);
  
  // Restore canvas from snapshot
  const restoreSnapshot = useCallback((snapshot: any) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !snapshot) return;
    
    // Store references to grid objects
    const gridObjects = canvas.getObjects().filter(obj => (obj as any).isGrid);
    
    // Clear canvas except grid
    const nonGridObjects = canvas.getObjects().filter(obj => !(obj as any).isGrid);
    canvas.remove(...nonGridObjects);
    
    // Restore from JSON
    canvas.loadFromJSON(snapshot, () => {
      // Re-add grid objects if they were removed
      if (gridObjects.length > 0) {
        gridObjects.forEach(obj => {
          if (!canvas.contains(obj)) {
            canvas.add(obj);
            canvas.sendToBack(obj);
          }
        });
      }
      
      canvas.requestRenderAll();
      updateCanvasState();
    });
  }, [fabricCanvasRef, updateCanvasState]);

  const handleFloorSelect = useCallback((index: number) => {
    if (index >= 0 && index < floorPlans.length && index !== currentFloor) {
      // Add Sentry breadcrumb for floor change
      Sentry.addBreadcrumb({
        category: 'floorplan',
        message: `Changed to floor ${index + 1} (${floorPlans[index]?.name})`,
        level: 'info',
        data: {
          previousFloor: currentFloor,
          newFloor: index,
          floorName: floorPlans[index]?.name
        }
      });
      
      // Clear history when switching floors
      historyRef.current = { past: [], future: [] };
      
      // Save current canvas state to floor plan array
      if (fabricCanvasRef.current && floorPlans[currentFloor]) {
        const updatedFloorPlans = [...floorPlans];
        const canvasState = serializeCanvasState(fabricCanvasRef.current);
        updatedFloorPlans[currentFloor] = {
          ...updatedFloorPlans[currentFloor],
          canvasState
        };
        setFloorPlans(updatedFloorPlans);
      }
    }
  }, [fabricCanvasRef, floorPlans, currentFloor, historyRef, setFloorPlans]);
  
  return {
    canvasState,
    zoom,
    isDirty: canvasState.isDirty,
    
    // Actions
    handleZoom,
    handlePan,
    resetView,
    markDirty,
    markSaved,
    
    // Object management
    addObjects,
    removeObjects,
    updateObjects,
    startBatch,
    commitBatch,
    
    // Undo/Redo support
    createSnapshot,
    restoreSnapshot,
    
    // Force refresh state
    updateCanvasState
  };
};
