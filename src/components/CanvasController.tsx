/**
 * Canvas controller component
 * Centralizes all canvas state and operations
 * @module CanvasController
 */

import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

// Custom hooks
import { useCanvasState } from "@/hooks/useCanvasState";
import { useCanvasDebug } from "@/hooks/useCanvasDebug";
import { useCanvasGrid } from "@/hooks/useCanvasGrid";
import { useCanvasInitialization } from "@/hooks/useCanvasInitialization";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { useCanvasResizing } from "@/hooks/useCanvasResizing";
import { useFloorPlans } from "@/hooks/useFloorPlans";
import { useDrawingTools } from "@/hooks/useDrawingTools";
import { useFloorSelection } from "@/hooks/useFloorSelection";
import { useLineSettings } from "@/hooks/useLineSettings";
import { useCanvasErrorHandling } from "@/hooks/useCanvasErrorHandling";
import { useFloorPlanLoader } from "@/hooks/useFloorPlanLoader";
import { resetGridProgress } from "@/utils/gridManager";

/**
 * Controller component that manages all canvas logic and state
 * Centralizes canvas operations to improve maintainability and security
 * @returns All canvas-related state and handler functions
 */
export const CanvasController = () => {
  // Canvas state (tools, dimensions, etc.)
  const {
    tool, setTool,
    zoomLevel, setZoomLevel,
    gia, setGia,
    floorPlans, setFloorPlans,
    currentFloor, setCurrentFloor,
    isLoading, setIsLoading,
    canvasDimensions, setCanvasDimensions,
    lineThickness, setLineThickness,
    lineColor, setLineColor
  } = useCanvasState();
  
  // Debug and error state
  const {
    debugInfo, setDebugInfo,
    hasError, setHasError,
    errorMessage, setErrorMessage,
    resetLoadTimes
  } = useCanvasDebug();

  // Grid layer reference - initialize with empty array
  const gridLayerRef = useRef<any[]>([]);
  
  // Track grid creation attempts with higher priority
  const gridAttemptCountRef = useRef(0);
  const maxGridAttempts = 12; // Increased for better reliability
  const gridCreationSuccessfulRef = useRef(false);
  
  // Flag to track if initial grid creation has been attempted
  const initialGridAttemptedRef = useRef(false);
  
  // Grid creation callback
  const createGrid = useCanvasGrid({
    gridLayerRef,
    canvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });

  // Initialize canvas and grid
  const { 
    canvasRef, 
    fabricCanvasRef, 
    historyRef 
  } = useCanvasInitialization({
    canvasDimensions,
    tool,
    currentFloor,
    setZoomLevel,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });
  
  // Floor plans management
  const {
    drawFloorPlan,
    recalculateGIA,
    handleAddFloor,
    handleSelectFloor,
    loadData
  } = useFloorPlans({
    fabricCanvasRef,
    gridLayerRef,
    floorPlans,
    currentFloor,
    isLoading,
    setGia,
    setFloorPlans,
    clearDrawings: () => {}, // Will be replaced after useDrawingTools is initialized
    createGrid
  });

  // Drawing tools
  const {
    clearDrawings,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas
  } = useDrawingTools({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    zoomLevel,
    lineThickness,
    lineColor,
    setTool,
    setZoomLevel,
    floorPlans,
    currentFloor,
    setFloorPlans,
    setGia,
    createGrid,
    recalculateGIA: () => {}  // Will be replaced after useFloorPlans
  });

  // Drawing state tracking for measurement tooltip
  const { drawingState } = useCanvasDrawing({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia
  });

  // Floor selection
  const { handleFloorSelect } = useFloorSelection({
    currentFloor,
    setCurrentFloor,
    handleSelectFloor
  });
  
  // Line settings management
  const { 
    handleLineThicknessChange, 
    handleLineColorChange,
    applyLineSettings
  } = useLineSettings({
    fabricCanvasRef,
    lineThickness,
    lineColor,
    setLineThickness,
    setLineColor
  });
  
  // Error handling and retries
  const { 
    handleRetry 
  } = useCanvasErrorHandling({
    setHasError,
    setErrorMessage,
    resetLoadTimes,
    loadData
  });
  
  // Floor plan data loading
  const { 
    loadFloorPlansData 
  } = useFloorPlanLoader({
    setIsLoading,
    setFloorPlans,
    setHasError,
    setErrorMessage,
    loadData
  });
  
  // Update the recalculateGIA in drawing tools
  useEffect(() => {
    Object.assign(useDrawingTools, { recalculateGIA });
  }, [recalculateGIA]);

  // Canvas resizing
  useCanvasResizing({
    canvasRef,
    fabricCanvasRef,
    setCanvasDimensions,
    setDebugInfo,
    setHasError,
    setErrorMessage,
    createGrid
  });

  // Apply line settings when tool changes
  useEffect(() => {
    applyLineSettings();
  }, [tool, applyLineSettings]);

  // Load floor plans data
  useEffect(() => {
    loadFloorPlansData();
  }, [loadFloorPlansData]);

  // IMPROVED: Force grid creation on initial load and after any error with higher priority
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("🔴 FORCE GRID CREATION - High priority grid creation for wall snapping");
    }
    
    // Only attempt initial grid creation once
    if (initialGridAttemptedRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Initial grid creation already attempted, skipping");
      }
      return;
    }
    
    initialGridAttemptedRef.current = true;
    
    // Always reset progress first to break any stuck locks
    resetGridProgress();
    
    // Function to attempt grid creation
    const attemptGridCreation = () => {
      if (!fabricCanvasRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.log("Fabric canvas not available yet, retrying soon");
        }
        
        setTimeout(() => {
          attemptGridCreation();
        }, 100);
        return false;
      }
      
      gridAttemptCountRef.current++;
      if (process.env.NODE_ENV === 'development') {
        console.log(`Grid creation attempt ${gridAttemptCountRef.current}/${maxGridAttempts}`);
      }
      
      // Force unlock before creation
      resetGridProgress();
      
      // Try immediate grid creation first
      try {
        const grid = createGrid(fabricCanvasRef.current);
        
        if (grid && grid.length > 0) {
          if (process.env.NODE_ENV === 'development') {
            console.log(`Grid created successfully with ${grid.length} objects`);
          }
          fabricCanvasRef.current.requestRenderAll();
          gridCreationSuccessfulRef.current = true;
          return true;
        }
      } catch (err) {
        if (process.env.NODE_ENV === 'development') {
          console.error("Error during grid creation attempt:", err);
        }
      }
      
      // If immediate creation failed, try again with shorter timeout
      setTimeout(() => {
        if (!fabricCanvasRef.current) return;
        
        try {
          resetGridProgress();
          const grid = createGrid(fabricCanvasRef.current);
          
          if (grid && grid.length > 0) {
            if (process.env.NODE_ENV === 'development') {
              console.log(`Grid created with ${grid.length} objects (delayed attempt)`);
            }
            fabricCanvasRef.current.requestRenderAll();
            gridCreationSuccessfulRef.current = true;
            return true;
          }
        } catch (err) {
          if (process.env.NODE_ENV === 'development') {
            console.error("Error during delayed grid creation attempt:", err);
          }
        }
        
        // If we're here, grid creation failed
        if (gridAttemptCountRef.current < maxGridAttempts) {
          // Schedule next attempt with shorter exponential backoff
          const delay = Math.min(Math.pow(1.3, gridAttemptCountRef.current) * 100, 800);
          if (process.env.NODE_ENV === 'development') {
            console.log(`Scheduling next grid attempt in ${delay}ms`);
          }
          
          setTimeout(() => {
            resetGridProgress();
            attemptGridCreation();
          }, delay);
        } else {
          // If all attempts failed, try creating a basic grid directly
          try {
            if (process.env.NODE_ENV === 'development') {
              console.log("All grid creation attempts failed, trying emergency method");
            }
            
            // Force a final grid creation on the canvas
            if (fabricCanvasRef.current) {
              // This is a direct bypass of the normal grid creation process
              // Create very basic grid lines directly
              const width = fabricCanvasRef.current.width || 800;
              const height = fabricCanvasRef.current.height || 600;
              
              for (let x = 0; x <= width; x += 100) {
                const line = new fabric.Line([x, 0, x, height], {
                  stroke: '#CCDDEE',
                  selectable: false,
                  evented: false,
                  strokeWidth: x % 500 === 0 ? 1.5 : 0.5
                });
                fabricCanvasRef.current.add(line);
                gridLayerRef.current.push(line);
              }
              
              for (let y = 0; y <= height; y += 100) {
                const line = new fabric.Line([0, y, width, y], {
                  stroke: '#CCDDEE',
                  selectable: false,
                  evented: false,
                  strokeWidth: y % 500 === 0 ? 1.5 : 0.5
                });
                fabricCanvasRef.current.add(line);
                gridLayerRef.current.push(line);
              }
              
              fabricCanvasRef.current.requestRenderAll();
              if (process.env.NODE_ENV === 'development') {
                console.log("Created basic emergency grid");
              }
            }
          } catch (err) {
            if (process.env.NODE_ENV === 'development') {
              console.error("Even emergency grid creation failed:", err);
            }
          }
        }
      }, 50);
    };
    
    // Start the first attempt
    attemptGridCreation();
    
  }, [fabricCanvasRef.current]);

  // Add a second grid creation attempt when canvas dimensions change
  useEffect(() => {
    if (canvasDimensions.width > 0 && canvasDimensions.height > 0 && fabricCanvasRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.log("Canvas dimensions changed, recreating grid", canvasDimensions);
      }
      
      // Short timeout to ensure canvas is ready
      setTimeout(() => {
        resetGridProgress();
        createGrid(fabricCanvasRef.current);
      }, 100);
    }
  }, [canvasDimensions.width, canvasDimensions.height]);

  // Ensure zoom level is properly passed to DistanceTooltip via drawingState
  useEffect(() => {
    if (fabricCanvasRef.current) {
      // Trigger custom zoom changed event when component mounts to ensure correct initial zoom
      fabricCanvasRef.current.fire('custom:zoom-changed', { zoom: zoomLevel });
    }
  }, [fabricCanvasRef, zoomLevel]);

  return {
    tool,
    gia,
    floorPlans,
    currentFloor,
    isLoading,
    hasError,
    errorMessage,
    debugInfo,
    canvasRef,
    lineThickness,
    lineColor,
    loadData,
    handleFloorSelect,
    handleAddFloor,
    handleToolChange,
    handleUndo,
    handleRedo,
    handleZoom,
    clearCanvas,
    saveCanvas,
    handleLineThicknessChange,
    handleLineColorChange,
    drawingState,
    handleRetry
  };
};
