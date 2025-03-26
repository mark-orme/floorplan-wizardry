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
import { createEmergencyGrid, attemptCanvasRepair, resetEmergencyGridState } from '@/utils/emergencyGridUtils';

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
  const directInitAttemptedRef = useRef<boolean>(false);
  const maxDirectAttempts = 3;
  const directAttemptsRef = useRef<number>(0);
  
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
  
  // Get the createGrid function from useCanvasGrid
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
  
  // Direct intervention effect - breaks the loop by detecting when we have continuous initialization
  useEffect(() => {
    const attemptDirectInitialization = () => {
      // Only proceed if we haven't reached max attempts
      if (directAttemptsRef.current >= maxDirectAttempts) {
        logger.warn(`Reached maximum direct initialization attempts (${maxDirectAttempts})`);
        
        // If we still don't have a grid after max attempts, try repair
        if (!gridCreatedRef.current && fabricCanvasRef.current) {
          logger.info("Attempting canvas repair after max direct attempts");
          
          // Try to repair the canvas directly
          const repaired = attemptCanvasRepair(fabricCanvasRef.current);
          if (repaired) {
            logger.info("Canvas repair successful");
            toast.success("Canvas initialized successfully", { duration: 2000 });
          } else {
            logger.error("Canvas repair failed");
            setHasError(true);
            setErrorMessage("Canvas initialization failed. Please try refreshing the page.");
          }
        }
        
        return;
      }
      
      directAttemptsRef.current++;
      logger.info(`Direct initialization attempt #${directAttemptsRef.current}`);
      
      if (!fabricCanvasRef.current) {
        logger.warn("No fabricCanvas available for direct initialization");
        return;
      }
      
      // PATCH 1: Check if canvas has valid dimensions before creating grid
      if (!fabricCanvasRef.current.width || !fabricCanvasRef.current.height ||
          fabricCanvasRef.current.width === 0 || fabricCanvasRef.current.height === 0) {
        logger.warn("Canvas has zero dimensions, delaying grid creation", {
          width: fabricCanvasRef.current.width,
          height: fabricCanvasRef.current.height
        });
        
        // Try again in a short while
        setTimeout(attemptDirectInitialization, 300);
        return;
      }
      
      try {
        // Check if the grid is already created by regular means
        if (gridCreatedRef.current) {
          logger.info("Grid already created, skipping direct initialization");
          return;
        }
        
        // First attempt regular grid creation
        const gridObjects = createGrid(fabricCanvasRef.current);
        
        if (gridObjects && gridObjects.length > 0) {
          logger.info(`Direct grid creation successful with ${gridObjects.length} objects`);
          gridLayerRef.current = gridObjects;
          gridCreatedRef.current = true;
          
          // PATCH 3: Force render to ensure grid is visible
          fabricCanvasRef.current.requestRenderAll();
          
          // Update debug info
          setDebugInfo(prev => ({
            ...prev,
            gridCreated: true,
            gridObjectCount: gridObjects.length,
            canvasReady: true
          }));
          
          toast.success("Canvas initialized successfully", { duration: 2000 });
          
          return;
        }
        
        // If regular creation fails, use emergency grid
        logger.warn("Direct grid creation produced no objects, using emergency grid");
        resetEmergencyGridState(); // Reset state to allow a fresh attempt
        
        const emergencyGrid = createEmergencyGrid(fabricCanvasRef.current, {
          width: fabricCanvasRef.current.width || initialCanvasWidth || 1000,
          height: fabricCanvasRef.current.height || initialCanvasHeight || 800,
          debug: true
        });
        
        if (emergencyGrid.length > 0) {
          logger.info(`Emergency grid created with ${emergencyGrid.length} objects`);
          gridLayerRef.current = emergencyGrid;
          gridCreatedRef.current = true;
          
          // PATCH 3: Force render to ensure grid is visible
          fabricCanvasRef.current.requestRenderAll();
          
          // Update debug info
          setDebugInfo(prev => ({
            ...prev,
            gridCreated: true,
            gridObjectCount: emergencyGrid.length,
            canvasReady: true,
            isEmergencyGrid: true
          }));
        } else {
          logger.error("Emergency grid creation failed");
        }
      } catch (error) {
        logger.error("Error in direct initialization:", error);
      }
    };
    
    // Set timeout to allow normal initialization first, then intervene
    const timeoutId = setTimeout(() => {
      // Check if we already have a grid
      if (!gridCreatedRef.current && fabricCanvasRef.current) {
        logger.warn("No grid created by normal means, attempting direct initialization");
        attemptDirectInitialization();
      }
    }, 1500); // Wait 1.5 seconds before direct intervention
    
    return () => clearTimeout(timeoutId);
  }, [createGrid, initialCanvasWidth, initialCanvasHeight, setDebugInfo, setHasError, setErrorMessage, fabricCanvasRef.current]); // PATCH 1: Added fabricCanvasRef.current as dependency

  // DEBUG TIP: Add debugging to monitor canvas size and object count
  useEffect(() => {
    if (fabricCanvasRef.current) {
      const c = fabricCanvasRef.current;
      console.log("📐 Canvas size:", c.getWidth?.() || c.width, c.getHeight?.() || c.height);
      console.log("🎯 Objects after grid:", c.getObjects().length);
      console.log("🔍 Grid layer objects:", gridLayerRef.current.length);
    }
  }, [gridCreatedRef.current]);
  
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
    
    // Reset direct initialization attempts
    directAttemptsRef.current = 0;
    directInitAttemptedRef.current = false;
    
    // Clear grid objects
    gridLayerRef.current = [];
    
    // Reset emergency grid state
    resetEmergencyGridState();
    
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
