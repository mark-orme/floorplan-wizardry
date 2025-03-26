
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
import logger from '@/utils/logger';
import { toast } from 'sonner';
import { createEmergencyGrid } from '@/utils/emergencyGridUtils';

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
  const gridCreatedRef = useRef<boolean>(false);
  
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
  
  // Create the grid management hook - fix the destructuring
  const createGrid = useCanvasGrid({
    gridLayerRef,
    canvasDimensions: { width: initialCanvasWidth, height: initialCanvasHeight },
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
  
  // Direct grid creation effect - this will create the grid regardless of other hooks
  useEffect(() => {
    // Only proceed if we have a valid fabric canvas and haven't already created a grid
    if (!fabricCanvasRef.current || gridCreatedRef.current) {
      return;
    }
    
    // Set a timeout to ensure canvas is fully ready
    const timeoutId = setTimeout(() => {
      try {
        logger.info("Creating grid directly from CanvasController");
        
        // Check that canvas is properly initialized
        const canvas = fabricCanvasRef.current;
        if (!canvas) {
          logger.warn("Canvas not available for direct grid creation");
          return;
        }
        
        // Try normal grid creation first
        let gridObjects = createGrid(canvas);
        
        // If that didn't work, try emergency grid
        if (!gridObjects || gridObjects.length === 0) {
          logger.warn("Direct grid creation failed, using emergency fallback");
          gridObjects = createEmergencyGrid(canvas, {
            width: initialCanvasWidth || 1000,
            height: initialCanvasHeight || 800
          });
          
          if (gridObjects.length > 0) {
            toast.success("Grid created successfully", {
              id: "emergency-grid-created",
              duration: 2000
            });
          }
        }
        
        // Store grid objects in ref
        gridLayerRef.current = gridObjects;
        
        // Mark grid as created
        gridCreatedRef.current = true;
        
        // Force render to ensure grid is visible
        canvas.requestRenderAll();
        
        // Update debug info
        setDebugInfo(prev => ({
          ...prev,
          gridCreated: true,
          gridObjectCount: gridObjects.length,
          canvasReady: true
        }));
        
        logger.info(`Grid initialized with ${gridObjects.length} objects from CanvasController`);
      } catch (error) {
        logger.error("Error in direct grid creation:", error);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [fabricCanvasRef.current, createGrid, initialCanvasWidth, initialCanvasHeight, setDebugInfo]);
  
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
    
    // Reset grid created flag
    gridCreatedRef.current = false;
    
    // Clear grid objects
    gridLayerRef.current = [];
    
    // Reset error state
    setHasError(false);
    setErrorMessage("");
    
    // Show toast
    toast.info("Reinitializing canvas...");
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
