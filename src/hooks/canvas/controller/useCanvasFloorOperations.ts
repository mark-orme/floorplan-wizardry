
import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { FloorPlan, PaperSize } from '@/types/floor-plan/unifiedTypes';

/**
 * Props for the useCanvasFloorOperations hook
 */
interface UseCanvasFloorOperationsProps {
  canvasRef: React.RefObject<FabricCanvas | null>;
}

/**
 * Hook for floor plan operations in the canvas
 */
export const useCanvasFloorOperations = ({ canvasRef }: UseCanvasFloorOperationsProps) => {
  const [currentFloorPlan, setCurrentFloorPlan] = useState<FloorPlan | null>(null);
  
  /**
   * Load a floor plan into the canvas
   */
  const loadFloorPlan = useCallback(async (floorPlan: FloorPlan) => {
    if (!canvasRef.current) {
      console.error('Canvas is not initialized');
      return;
    }
    
    try {
      // Load the floor plan data into the canvas
      if (floorPlan.canvasJson) {
        await canvasRef.current.loadFromJSON(JSON.parse(floorPlan.canvasJson), () => {
          console.log('Floor plan loaded successfully');
        });
      }
      
      setCurrentFloorPlan(floorPlan);
    } catch (error) {
      console.error('Error loading floor plan:', error);
    }
  }, [canvasRef]);
  
  /**
   * Create a new floor plan with default settings
   */
  const createNewFloorPlan = useCallback(() => {
    const now = new Date().toISOString();
    
    const newFloorPlan: FloorPlan = {
      id: `fp-${Date.now()}`,
      name: 'New Floor Plan',
      label: 'New Floor Plan',
      walls: [],
      rooms: [],
      strokes: [],
      canvasData: null,
      canvasJson: null,
      createdAt: now,
      updatedAt: now,
      gia: 0,
      level: 0,
      index: 0,
      metadata: {
        createdAt: now,
        updatedAt: now,
        paperSize: PaperSize.A4,
        level: 0,
        // Include all required metadata fields
        version: '1.0',
        author: 'User',
        dateCreated: now,
        lastModified: now,
        notes: ''
      },
      data: {},
      userId: 'current-user'
    };
    
    setCurrentFloorPlan(newFloorPlan);
    return newFloorPlan;
  }, []);
  
  /**
   * Save the current canvas state to the floor plan
   */
  const saveCanvasToFloorPlan = useCallback(() => {
    if (!canvasRef.current || !currentFloorPlan) {
      console.error('Canvas or floor plan is not initialized');
      return null;
    }
    
    const canvasJson = JSON.stringify(canvasRef.current.toJSON());
    
    const updatedFloorPlan: FloorPlan = {
      ...currentFloorPlan,
      canvasJson,
      updatedAt: new Date().toISOString()
    };
    
    setCurrentFloorPlan(updatedFloorPlan);
    return updatedFloorPlan;
  }, [canvasRef, currentFloorPlan]);
  
  return {
    currentFloorPlan,
    loadFloorPlan,
    createNewFloorPlan,
    saveCanvasToFloorPlan
  };
};
