import React, { useState, useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

// Import from our adapter instead of directly
import { FloorPlan } from '@/utils/floorPlanTypeAdapter';
import { DRAWING_CONSTANTS } from '@/constants/drawingConstants';

interface UseFloorPlanStorageProps {
  canvas: FabricCanvas | null;
  defaultFloorPlan?: FloorPlan;
  storageKey?: string;
}

export const useFloorPlanStorage = ({
  canvas,
  defaultFloorPlan,
  storageKey = 'floorPlanData'
}: UseFloorPlanStorageProps) => {
  const [floorPlan, setFloorPlan] = useState<FloorPlan | null>(defaultFloorPlan || null);
  const [storedData, setStoredData] = useLocalStorage(storageKey, null);

  // Load data from local storage on canvas initialization
  useEffect(() => {
    if (!canvas) return;
    
    if (storedData) {
      try {
        canvas.loadFromJSON(storedData, () => {
          canvas.renderAll();
          toast.success('Floor plan loaded from storage');
        });
      } catch (error) {
        console.error('Failed to load floor plan from storage:', error);
        toast.error('Failed to load floor plan');
      }
    } else if (defaultFloorPlan) {
      // Load default floor plan if available
      try {
        canvas.loadFromJSON(JSON.stringify(defaultFloorPlan), () => {
          canvas.renderAll();
          toast.success('Default floor plan loaded');
        });
      } catch (error) {
        console.error('Failed to load default floor plan:', error);
        toast.error('Failed to load default floor plan');
      }
    }
  }, [canvas, storedData, defaultFloorPlan]);

  // Save data to local storage when canvas is modified
  useEffect(() => {
    if (!canvas) return;
    
    const handleObjectAdded = () => saveDataToStorage();
    const handleObjectModified = () => saveDataToStorage();
    const handleObjectRemoved = () => saveDataToStorage();
    const handleCanvasCleared = () => saveDataToStorage();
    
    canvas.on('object:added', handleObjectAdded);
    canvas.on('object:modified', handleObjectModified);
    canvas.on('object:removed', handleObjectRemoved);
    canvas.on('canvas:cleared', handleCanvasCleared);
    
    return () => {
      canvas.off('object:added', handleObjectAdded);
      canvas.off('object:modified', handleObjectModified);
      canvas.off('object:removed', handleObjectRemoved);
      canvas.off('canvas:cleared', handleCanvasCleared);
    };
  }, [canvas, setStoredData]);

  // Function to save canvas data to local storage
  const saveDataToStorage = () => {
    if (!canvas) return;
    
    try {
      const canvasJSON = JSON.stringify(canvas.toJSON());
      setStoredData(canvasJSON);
      toast.success('Floor plan saved to storage');
    } catch (error) {
      console.error('Failed to save floor plan to storage:', error);
      toast.error('Failed to save floor plan');
    }
  };

  return {
    floorPlan,
    setFloorPlan,
    saveDataToStorage
  };
};
