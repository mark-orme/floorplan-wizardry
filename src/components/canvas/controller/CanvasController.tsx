import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { DrawingTool } from '@/hooks/useCanvasState';
import { DebugInfoState } from '@/types/debugTypes';
import { FloorPlan } from '@/utils/drawing';
import { DrawingState } from '@/types/drawingTypes';

// Import hooks
import { useCanvasControllerState } from './useCanvasControllerState';
import { useCanvasControllerSetup } from './useCanvasControllerSetup';
import { useCanvasControllerTools } from './useCanvasControllerTools';
import { useCanvasControllerDrawingState } from './useCanvasControllerDrawingState';
import { useCanvasGrid } from '@/hooks/useCanvasGrid';
import { useCanvasDimensions } from '@/hooks/useCanvasDimensions';

// Context interface
export interface CanvasControllerContextValue {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingTool;
  gia: number;
  floorPlans: FloorPlan[];
  currentFloor: number;
  debugInfo: DebugInfoState;
  lineThickness: number;
  lineColor: string;
  drawingState: DrawingState | null;
  hasError: boolean;
  errorMessage: string;
  handleToolChange: (tool: DrawingTool) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleZoom: (direction: "in" | "out") => void;
  clearCanvas: () => void;
  saveCanvas: () => boolean;
  deleteSelectedObjects: () => void;
  handleFloorSelect: (index: number) => void;
  handleAddFloor: () => void;
  handleLineThicknessChange: (thickness: number) => void;
  handleLineColorChange: (color: string) => void;
  handleRetry: () => void;
  openMeasurementGuide: () => void;
}

// Create context
const CanvasControllerContext = createContext<CanvasControllerContextValue | null>(null);

// Hook to consume context
export const useCanvasController = (): CanvasControllerContextValue => {
  const context = useContext(CanvasControllerContext);
  if (!context) {
    throw new Error('useCanvasController must be used within a CanvasControllerProvider');
  }
  return context;
};

// Provider component
export const CanvasControllerProvider = ({ children }: { children: React.ReactNode }): JSX.Element => {
  // Canvas references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  const historyRef = useRef<{past: any[][], future: any[][]}>({ past: [], future: [] });
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  
  // Get canvas dimensions
  const { width: initialCanvasWidth, height: initialCanvasHeight } = useCanvasDimensions();
  
  // Create grid function
  const createGrid = useCanvasGrid({
    gridLayerRef,
    canvasDimensions: { width: initialCanvasWidth, height: initialCanvasHeight },
    setDebugInfo: () => {}, // Will be properly set from controller state
    setHasError: () => {}, // Will be properly set from controller state
    setErrorMessage: () => {} // Will be properly set from controller state
  });
  
  // Initialize controller tools
  const {
    refreshCanvas,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    handleFloorSelect,
    handleAddFloor,
    handleLineThicknessChange,
    handleLineColorChange,
    showMeasurementGuide
  } = useCanvasControllerSetup(
    fabricCanvasRef,
    gridLayerRef,
    createGrid,
    initialCanvasWidth,
    initialCanvasHeight,
    canvasWrapperRef
  );

  // Handle retry - reinitialize the canvas
  const handleRetry = () => {
    // Reinitialize the canvas
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }
    
    // Re-setup the canvas
    const setup = useCanvasControllerSetup(
      fabricCanvasRef,
      gridLayerRef,
      createGrid,
      initialCanvasWidth,
      initialCanvasHeight,
      canvasWrapperRef
    );
    
    // Force refresh
    refreshCanvas();
  };

  // Value to be provided by the context
  const contextValue: CanvasControllerContextValue = {
    canvasRef,
    fabricCanvasRef,
    tool: 'select',
    gia: 0,
    floorPlans: [],
    currentFloor: 0,
    debugInfo: {
      dimensionsSet: false,
      canvasCreated: false,
      gridCreated: false,
      canvasLoaded: false,
      canvasInitialized: false,
      brushInitialized: false,
      canvasWidth: initialCanvasWidth,
      canvasHeight: initialCanvasHeight,
      loadTimes: {}
    },
    lineThickness: 2,
    lineColor: '#000000',
    drawingState: null,
    hasError: false,
    errorMessage: '',
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    deleteSelectedObjects,
    handleFloorSelect,
    handleAddFloor,
    handleLineThicknessChange,
    handleLineColorChange,
    handleRetry,
    openMeasurementGuide: showMeasurementGuide
  };

  return (
    <CanvasControllerContext.Provider value={contextValue}>
      {children}
    </CanvasControllerContext.Provider>
  );
};
