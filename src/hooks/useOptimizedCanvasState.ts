
import { useCallback, useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan } from '@/types/floor-plan/unifiedTypes';

interface UseOptimizedCanvasStateProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  activeFloorPlan: FloorPlan | null;
  onStateUpdate?: (floorPlan: FloorPlan) => void;
}

export const useOptimizedCanvasState = ({
  fabricCanvasRef,
  activeFloorPlan,
  onStateUpdate
}: UseOptimizedCanvasStateProps) => {
  const [lastSavedJSON, setLastSavedJSON] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  // Save the current canvas state to the floor plan
  const saveCanvasState = useCallback(() => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas || !activeFloorPlan) return null;
    
    // Create JSON representation of the canvas
    const canvasJson = JSON.stringify(canvas.toJSON());
    
    // Check if state changed
    if (canvasJson === lastSavedJSON) {
      return activeFloorPlan;
    }
    
    setLastSavedJSON(canvasJson);
    setHasUnsavedChanges(false);
    
    // Create updated floor plan
    const updatedFloorPlan: FloorPlan = {
      ...activeFloorPlan,
      canvasJson,
      updatedAt: new Date().toISOString()
    };
    
    // Notify of state update
    if (onStateUpdate) {
      onStateUpdate(updatedFloorPlan);
    }
    
    return updatedFloorPlan;
  }, [fabricCanvasRef, activeFloorPlan, lastSavedJSON, onStateUpdate]);
  
  // Load a floor plan into the canvas
  const loadFloorPlanIntoCanvas = useCallback(async (floorPlan: FloorPlan | null) => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas || !floorPlan) return;
    
    try {
      // Clear canvas first
      canvas.clear();
      
      // Load canvas state if available
      if (floorPlan.canvasJson) {
        await new Promise<void>((resolve, reject) => {
          try {
            canvas.loadFromJSON(JSON.parse(floorPlan.canvasJson), () => {
              resolve();
            });
          } catch (error) {
            console.error('Error loading floor plan:', error);
            reject(error);
          }
        });
      }
      
      // Update last saved JSON
      setLastSavedJSON(floorPlan.canvasJson);
      setHasUnsavedChanges(false);
      
      // Render the canvas
      canvas.renderAll();
    } catch (error) {
      console.error('Error loading floor plan:', error);
    }
  }, [fabricCanvasRef]);
  
  // Set up auto-save on canvas modifications
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    
    if (!canvas || !activeFloorPlan) return;
    
    const handleObjectModified = () => {
      setHasUnsavedChanges(true);
    };
    
    // Add event listeners
    canvas.on('object:added', handleObjectModified);
    canvas.on('object:removed', handleObjectModified);
    canvas.on('object:modified', handleObjectModified);
    
    return () => {
      // Remove event listeners
      canvas.off('object:added', handleObjectModified);
      canvas.off('object:removed', handleObjectModified);
      canvas.off('object:modified', handleObjectModified);
    };
  }, [fabricCanvasRef, activeFloorPlan]);
  
  return {
    saveCanvasState,
    loadFloorPlanIntoCanvas,
    hasUnsavedChanges
  };
};
