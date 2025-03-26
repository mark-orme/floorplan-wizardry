
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

interface CanvasControllerProviderProps {
  children: React.ReactNode;
}

// Provider component
export const CanvasControllerProvider = ({ children }: CanvasControllerProviderProps): JSX.Element => {
  // Canvas references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const gridLayerRef = useRef<FabricObject[]>([]);
  const historyRef = useRef<{past: FabricObject[][], future: FabricObject[][]}>({ past: [], future: [] });
  const canvasWrapperRef = useRef<HTMLDivElement | null>(null);
  
  // Get canvas dimensions
  const { width: initialCanvasWidth, height: initialCanvasHeight } = useCanvasDimensions();
  
  // Create state management hook
  const {
    tool, setTool,
    zoomLevel, setZoomLevel,
    gia, setGia,
    floorPlans, setFloorPlans,
    currentFloor, setCurrentFloor,
    isLoading, setIsLoading,
    lineThickness, setLineThickness,
    lineColor, setLineColor,
    drawingState, setDrawingState,
    debugInfo, setDebugInfo,
    hasError, setHasError,
    errorMessage, setErrorMessage
  } = useCanvasControllerState();
  
  // Initialize canvas setup
  const {
    canvasRef: setupCanvasRef,
    fabricCanvasRef: setupFabricCanvasRef,
    historyRef: setupHistoryRef
  } = useCanvasControllerSetup({
    canvasDimensions: { width: initialCanvasWidth, height: initialCanvasHeight },
    tool,
    currentFloor,
    setZoomLevel,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });
  
  // Assign refs from setup
  useEffect(() => {
    if (setupCanvasRef.current) {
      canvasRef.current = setupCanvasRef.current;
    }
    if (setupFabricCanvasRef.current) {
      fabricCanvasRef.current = setupFabricCanvasRef.current;
    }
    if (setupHistoryRef.current) {
      historyRef.current = setupHistoryRef.current;
    }
  }, [setupCanvasRef, setupFabricCanvasRef, setupHistoryRef]);
  
  // Define dummy functions for now - these will be properly implemented
  const refreshCanvas = () => {}; 
  const clearCanvas = () => {};
  const saveCanvas = () => true;
  const deleteSelectedObjects = () => {};
  const handleToolChange = (tool: DrawingTool) => { setTool(tool); };
  const handleUndo = () => {};
  const handleRedo = () => {};
  const handleZoom = (direction: "in" | "out") => {};
  const handleFloorSelect = (index: number) => { setCurrentFloor(index); };
  const handleAddFloor = () => {};
  const handleLineThicknessChange = (thickness: number) => { setLineThickness(thickness); };
  const handleLineColorChange = (color: string) => { setLineColor(color); };
  const showMeasurementGuide = () => {};
  
  // Handle retry - reinitialize the canvas
  const handleRetry = () => {
    // Reinitialize the canvas
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
      fabricCanvasRef.current = null;
    }
  };

  // Value to be provided by the context
  const contextValue: CanvasControllerContextValue = {
    canvasRef,
    fabricCanvasRef,
    tool,
    gia,
    floorPlans,
    currentFloor,
    debugInfo,
    lineThickness,
    lineColor,
    drawingState,
    hasError,
    errorMessage,
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
