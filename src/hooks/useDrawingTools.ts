
/**
 * Hook for drawing tool operations
 */
import { useCallback } from 'react';
import { useCanvasTools } from './useCanvasTools';
import { useCanvasActions } from './useCanvasActions';
import { DrawingTool } from '@/constants/drawingModes';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';

/**
 * Props for useDrawingTools hook
 */
interface UseDrawingToolsProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to grid layer objects */
  gridLayerRef: React.MutableRefObject<FabricObject[]>;
  /** Current tool */
  tool: DrawingTool;
  /** Function to set tool */
  setTool: (tool: DrawingTool) => void;
  /** Current zoom level */
  zoomLevel: number;
  /** Function to set zoom level */
  setZoomLevel: (zoom: number) => void;
  /** Line thickness */
  lineThickness?: number;
  /** Reference to history */
  historyRef?: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
}

/**
 * Props for useCanvasActions hook
 */
interface UseCanvasActionsProps {
  /** Reference to fabric canvas */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  /** Reference to history */
  historyRef?: React.MutableRefObject<{past: FabricObject[][], future: FabricObject[][]}>;
  /** Function to clear drawings */
  clearDrawings?: () => void;
  /** Floor plans */
  floorPlans?: any[];
  /** Current floor index */
  currentFloor?: number;
  /** Function to set floor plans */
  setFloorPlans?: React.Dispatch<React.SetStateAction<any[]>>;
  /** Reference to grid layer objects */
  gridLayerRef?: React.MutableRefObject<FabricObject[]>;
}

/**
 * Result type for useCanvasActions
 */
interface UseCanvasActionsResult {
  /** Delete selected objects */
  deleteSelectedObjects: () => void;
  /** Undo last action */
  undo: () => void;
  /** Redo previously undone action */
  redo: () => void;
}

/**
 * Custom hook that combines canvas tools and actions
 * @param props Hook properties
 * @returns Combined tool and action functions
 */
export const useDrawingTools = (props: UseDrawingToolsProps) => {
  const {
    fabricCanvasRef,
    gridLayerRef,
    tool,
    setTool,
    zoomLevel,
    setZoomLevel,
    lineThickness,
    historyRef
  } = props;
  
  /**
   * Zoom in by a fixed factor
   */
  const zoomIn = useCallback(() => {
    handleZoom(1.2);
  }, []);
  
  /**
   * Zoom out by a fixed factor
   */
  const zoomOut = useCallback(() => {
    handleZoom(0.8);
  }, []);
  
  /**
   * Toggle line tool
   */
  const toggleLine = useCallback(() => {
    if (tool === 'line') {
      setTool('select');
    } else {
      setTool('line');
    }
  }, [tool, setTool]);
  
  /**
   * Toggle draw tool
   */
  const togglePen = useCallback(() => {
    if (tool === 'draw') {
      setTool('select');
    } else {
      setTool('draw');
    }
  }, [tool, setTool]);
  
  /**
   * Toggle wall tool
   */
  const toggleRectangle = useCallback(() => {
    if (tool === 'wall') {
      setTool('select');
    } else {
      setTool('wall');
    }
  }, [tool, setTool]);
  
  /**
   * Toggle select tool
   */
  const toggleSelect = useCallback(() => {
    setTool('select');
  }, [setTool]);
  
  /**
   * Set a specific tool
   * @param newTool The tool to set
   */
  const setActiveTool = useCallback((newTool: DrawingTool) => {
    setTool(newTool);
  }, [setTool]);
  
  // Import canvas tools
  const {
    handleZoom,
    clearCanvas,
    resetZoom,
    resetView
  } = useCanvasTools({
    fabricCanvasRef,
    tool,
    setTool,
    zoomLevel,
    setZoomLevel,
    lineThickness
  });
  
  // Import canvas actions
  const {
    deleteSelectedObjects,
    undo,
    redo
  } = useCanvasActions({
    fabricCanvasRef,
    historyRef
  });
  
  return {
    // Tool selection
    togglePen,
    toggleLine,
    toggleRectangle,
    toggleSelect,
    setActiveTool,
    
    // View operations
    zoomIn,
    zoomOut,
    resetView,
    resetZoom,
    clearCanvas,
    
    // Object operations
    deleteSelectedObjects,
    undo,
    redo,
    
    // Aliases for API compatibility with other hooks
    handleToolChange: setActiveTool,
    handleUndo: undo,
    handleRedo: redo,
    handleZoom,
    saveCanvas: () => console.log('Save canvas called'),
    saveCurrentState: () => console.log('Save current state called')
  };
};
