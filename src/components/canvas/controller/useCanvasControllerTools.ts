/**
 * Hook for managing canvas drawing tools
 * Re-exports functionality from the useCanvasControllerTools
 * @module canvas/controller/useCanvasControllerTools
 */

import { useState, useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { useDrawingContext } from '@/contexts/DrawingContext';
import { useCanvasContext } from '@/contexts/CanvasContext';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { useCanvasControllerErrorHandling } from './useCanvasControllerErrorHandling';
import { createFloorPlanAdapter } from '@/utils/floorPlanTypeAdapter';

// Import a consistent FloorPlan type from the unified source
import { FloorPlan } from '@/types/floor-plan';

export interface UseCanvasControllerToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<any[]>;
  floorPlans: FloorPlan[];
  currentFloorIndex: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setCurrentFloorIndex: React.Dispatch<React.SetStateAction<number>>;
  clearDrawings: () => void;
  createGrid: (canvas: FabricCanvas) => any[];
  recalculateGIA: () => void;
}

export const useCanvasControllerTools = ({
  fabricCanvasRef,
  gridLayerRef,
  floorPlans,
  currentFloorIndex,
  setFloorPlans,
  setCurrentFloorIndex,
  clearDrawings,
  createGrid,
  recalculateGIA
}: UseCanvasControllerToolsProps) => {
  const { setTool } = useDrawingContext();
  const { canvasRef } = useCanvasContext();
  const [isLoading, setLoading] = useState(false);
  const { handleError } = useCanvasControllerErrorHandling();
  
  const handleLoadSuccess = (data: any) => {
    try {
      if (!Array.isArray(data)) {
        data = [data];
      }
      
      // Use the adapter to ensure type compatibility
      const adapter = createFloorPlanAdapter();
      const compatibleFloorPlans = data.map(adapter.convertToUnified);
      
      setFloorPlans(compatibleFloorPlans);
      setCurrentFloorIndex(0);
      
      if (compatibleFloorPlans.length > 0) {
        drawFloorPlan(compatibleFloorPlans[0]);
      }
      
      setLoading(false);
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to load data'), 'load-data');
      setLoading(false);
    }
  };
  
  const handleLoadError = (error: Error) => {
    handleError(error, 'load-data');
    setLoading(false);
  };
  
  const loadData = useCallback(async (options: any = {}) => {
    setLoading(true);
    
    try {
      // Simulate loading data
      const mockData = [
        {
          id: uuidv4(),
          name: 'Floor Plan 1',
          walls: [],
          rooms: [],
          strokes: [],
          metadata: {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paperSize: 'A4',
            level: 0,
            version: '1.0',
            author: 'User',
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            notes: ''
          },
          data: {},
          userId: 'default-user',
          propertyId: 'default-property'
        }
      ];
      
      handleLoadSuccess(mockData);
    } catch (error) {
      handleLoadError(error instanceof Error ? error : new Error('Failed to load data'));
    }
  }, [handleLoadSuccess, handleLoadError]);
  
  const drawFloorPlan = useCallback((floorPlan: FloorPlan) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    clearDrawings();
    
    // Load objects from floor plan
    if (floorPlan.strokes && Array.isArray(floorPlan.strokes)) {
      floorPlan.strokes.forEach(stroke => {
        // Add stroke to canvas
        console.log('Adding stroke to canvas', stroke);
      });
    }
    
    // Reset grid
    if (gridLayerRef.current && gridLayerRef.current.length > 0) {
      gridLayerRef.current.forEach(obj => canvas.remove(obj));
    }
    
    const gridObjects = createGrid(canvas);
    gridLayerRef.current = gridObjects;
    
    // Set background color
    canvas.backgroundColor = '#fff';
    
    // Render all
    canvas.renderAll();
    
    // Set zoom and pan
    setTool(DrawingMode.SELECT);
    
    // Recalculate GIA
    recalculateGIA();
    
    toast.success(`Floor plan "${floorPlan.name}" loaded`);
  }, [fabricCanvasRef, clearDrawings, createGrid, setTool, recalculateGIA]);
  
  const handleFloorSelect = useCallback((index: number) => {
    setCurrentFloorIndex(index);
    drawFloorPlan(floorPlans[index]);
  }, [floorPlans, setCurrentFloorIndex, drawFloorPlan]);
  
  const handleAddFloor = useCallback(() => {
    const newFloorPlan: FloorPlan = {
      id: uuidv4(),
      name: `Floor ${floorPlans.length + 1}`,
      walls: [],
      rooms: [],
      strokes: [],
      metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        paperSize: 'A4',
        level: floorPlans.length,
        version: '1.0',
        author: 'User',
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        notes: ''
      },
      data: {},
      userId: 'default-user',
      propertyId: 'default-property'
    };
    
    setFloorPlans([...floorPlans, newFloorPlan]);
    setCurrentFloorIndex(floorPlans.length);
  }, [floorPlans, setFloorPlans, setCurrentFloorIndex]);
  
  const syncFloorPlans = () => {
    try {
      // Convert to app floor plans for API compatibility
      const adapter = createFloorPlanAdapter();
      const compatibleFloorPlans = adapter.convertToAppArray(floorPlans);
      
      // Simulate API call
      console.log('Syncing floor plans', compatibleFloorPlans);
      toast.success('Floor plans synced');
    } catch (error) {
      handleError(error instanceof Error ? error : new Error('Failed to sync floor plans'), 'sync-floor-plans');
    }
  };
  
  return {
    isLoading,
    loadData,
    drawFloorPlan,
    handleFloorSelect,
    handleAddFloor,
    syncFloorPlans,
    getCompatibleFloorPlans: () => {
      // Use adapter to ensure compatibility
      const adapter = createFloorPlanAdapter();
      return adapter.convertToAppArray(floorPlans);
    }
  };
};

// Export the useCanvasControllerTools from the correct location
export { useCanvasControllerTools };

// Export the FloorPlan type to ensure consistent usage
export type { FloorPlan };
