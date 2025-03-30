
/**
 * Hook to manage drawing tools functionality
 * @module useDrawingTools
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingTool } from '@/constants/drawingModes';
import { FloorPlan } from '@/types/floorPlanTypes';
import { useDrawingHistory } from './drawing/useDrawingHistory';
import { useDrawingActions } from './drawing/useDrawingActions';

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
 * Aggregates functionality from more specific hooks
 * 
 * @param {UseDrawingToolsProps} props - Hook properties
 * @returns {UseDrawingToolsResult} Drawing tool functions
 */
export const useDrawingTools = (props: UseDrawingToolsProps): UseDrawingToolsResult => {
  const {
    fabricCanvasRef,
    tool,
    setTool,
    zoomLevel,
    setZoomLevel,
    historyRef
  } = props;

  // Use the drawing history hook for undo/redo functionality
  const { saveCurrentState, undo, redo } = useDrawingHistory({
    fabricCanvasRef,
    historyRef
  });
  
  // Use the drawing actions hook for tool operations
  const { 
    handleToolChange, 
    handleZoom, 
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects
  } = useDrawingActions({
    fabricCanvasRef,
    saveCurrentState,
    tool,
    setTool,
    zoomLevel,
    setZoomLevel
  });

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
