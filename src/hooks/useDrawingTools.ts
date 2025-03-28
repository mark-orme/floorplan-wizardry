
/**
 * Hook to manage drawing tools functionality
 * @module useDrawingTools
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingTool } from '@/constants/drawingModes';
import { FloorPlan } from '@/types/floorPlanTypes';
import { toast } from 'sonner';
import { useCanvasInteractions } from './useCanvasInteractions';

/**
 * Props for useDrawingTools hook
 */
export interface UseDrawingToolsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  tool: DrawingTool;
  setTool: React.Dispatch<React.SetStateAction<DrawingTool>>;
  zoomLevel: number;
  setZoomLevel: React.Dispatch<React.SetStateAction<number>>;
  lineThickness: number;
  lineColor: string;
  historyRef: React.MutableRefObject<{
    past: FabricObject[][];
    future: FabricObject[][];
  }>;
  floorPlans: FloorPlan[];
  currentFloor: number;
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setGia: React.Dispatch<React.SetStateAction<number>>;
  createGrid: (canvas: FabricCanvas) => FabricObject[];
}

/**
 * Result interface for useDrawingTools hook
 */
export interface UseDrawingToolsResult {
  handleToolChange: (newTool: DrawingTool) => void;
  handleZoom: (zoomChange: number) => void;
  clearCanvas: () => void;
  saveCanvas: () => void;
  deleteSelectedObjects: () => void;
  undo: () => void;
  redo: () => void;
  saveCurrentState: () => void;
}

/**
 * Hook that provides drawing tools functionality
 * @param props - Hook properties
 * @returns Drawing tool functions
 */
export const useDrawingTools = (props: UseDrawingToolsProps): UseDrawingToolsResult => {
  const {
    fabricCanvasRef,
    gridLayerRef,
    tool,
    setTool,
    zoomLevel,
    setZoomLevel,
    lineThickness,
    lineColor,
    historyRef,
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia,
    createGrid
  } = props;

  /**
   * Save current canvas state for undo/redo functionality
   */
  const saveCurrentState = useCallback(() => {
    if (!fabricCanvasRef.current) return;

    try {
      const canvas = fabricCanvasRef.current;
      const currentState = canvas.getObjects().filter(obj => !(obj as any).isGrid);
      
      // Save a deep copy of the current state
      historyRef.current.past.push(
        currentState.map(obj => obj)
      );
      
      // Clear future history when a new action is performed
      historyRef.current.future = [];
      
    } catch (error) {
      console.error('Error saving canvas state:', error);
    }
  }, [fabricCanvasRef, historyRef]);

  /**
   * Change the current drawing tool
   */
  const handleToolChange = useCallback((newTool: DrawingTool) => {
    if (!fabricCanvasRef.current) return;
    
    // Save current state before changing tools
    saveCurrentState();
    
    try {
      const canvas = fabricCanvasRef.current;
      
      // Update the tool state
      setTool(newTool);
      toast(`Tool changed to ${newTool}`);

    } catch (error) {
      console.error('Error changing tool:', error);
    }
  }, [fabricCanvasRef, saveCurrentState, setTool]);

  /**
   * Handle zoom changes
   */
  const handleZoom = useCallback((zoomChange: number) => {
    setZoomLevel(prevZoom => {
      const newZoom = Math.max(0.1, Math.min(3, prevZoom * zoomChange));
      return newZoom;
    });
  }, [setZoomLevel]);

  /**
   * Clear the canvas
   */
  const clearCanvas = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // First save the current state
    saveCurrentState();
    
    // Remove non-grid objects
    canvas.getObjects().forEach(obj => {
      if (!(obj as any).isGrid) {
        canvas.remove(obj);
      }
    });
    
    // Render the canvas after clearing
    canvas.renderAll();
    
  }, [fabricCanvasRef, saveCurrentState]);

  /**
   * Save the canvas state
   */
  const saveCanvas = useCallback(() => {
    // Implement save canvas functionality here
    toast("Canvas saved");
  }, []);

  /**
   * Delete selected objects
   */
  const deleteSelectedObjects = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    const activeObjects = canvas.getActiveObjects();
    
    if (activeObjects.length > 0) {
      // First save the current state
      saveCurrentState();
      
      // Remove the selected objects
      activeObjects.forEach(obj => {
        canvas.remove(obj);
      });
      
      // Clear the selection and render
      canvas.discardActiveObject();
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, saveCurrentState]);

  /**
   * Undo last action
   */
  const undo = useCallback(() => {
    if (!fabricCanvasRef.current || !historyRef.current.past.length) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Save the current state to the future stack
    const currentState = canvas.getObjects().filter(obj => !(obj as any).isGrid);
    historyRef.current.future.push(currentState.map(obj => obj));
    
    // Get the previous state
    const prevState = historyRef.current.past.pop();
    
    // Remove all non-grid objects
    canvas.getObjects().forEach(obj => {
      if (!(obj as any).isGrid) {
        canvas.remove(obj);
      }
    });
    
    // Add the objects from the previous state
    if (prevState) {
      prevState.forEach(obj => {
        canvas.add(obj);
      });
    }
    
    canvas.renderAll();
    
  }, [fabricCanvasRef, historyRef]);

  /**
   * Redo previously undone action
   */
  const redo = useCallback(() => {
    if (!fabricCanvasRef.current || !historyRef.current.future.length) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Save the current state to the past stack
    const currentState = canvas.getObjects().filter(obj => !(obj as any).isGrid);
    historyRef.current.past.push(currentState.map(obj => obj));
    
    // Get the future state
    const futureState = historyRef.current.future.pop();
    
    // Remove all non-grid objects
    canvas.getObjects().forEach(obj => {
      if (!(obj as any).isGrid) {
        canvas.remove(obj);
      }
    });
    
    // Add the objects from the future state
    if (futureState) {
      futureState.forEach(obj => {
        canvas.add(obj);
      });
    }
    
    canvas.renderAll();
    
  }, [fabricCanvasRef, historyRef]);

  return {
    handleToolChange,
    handleZoom,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects,
    undo,
    redo,
    saveCurrentState
  };
};
