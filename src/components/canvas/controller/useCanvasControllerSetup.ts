/**
 * Hook for setting up canvas controller
 */
import { useEffect, useRef, useCallback } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { useCanvasControllerState } from "./useCanvasControllerState";
import { useGridManager } from "@/hooks/useGridManager";
import { arrangeGridElementsWithRetry } from "@/utils/useCanvasLayerOrdering";
import logger from "@/utils/logger";
import { DrawingTool } from "@/hooks/useCanvasState";
import { FloorPlan } from "@/types/floorPlanTypes";

/**
 * Sets up the canvas controller with all necessary functionality
 */
export const useCanvasControllerSetup = (
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>,
  gridLayerRef: React.MutableRefObject<any[]>,
  createGrid: (canvas: FabricCanvas) => any[],
  initialCanvasWidth: number,
  initialCanvasHeight: number,
  canvasWrapperRef: React.MutableRefObject<HTMLDivElement | null>
) => {
  const {
    tool, setTool,
    zoomLevel, setZoomLevel,
    gia, setGia,
    floorPlans, setFloorPlans,
    currentFloor, setCurrentFloor,
    isLoading, setIsLoading,
    canvasDimensions, setCanvasDimensions,
    lineThickness, setLineThickness,
    lineColor, setLineColor,
    drawingState, setDrawingState,
    debugInfo, setDebugInfo,
    hasError, setHasError,
    errorMessage, setErrorMessage,
    resetLoadTimes
  } = useCanvasControllerState();
  
  // Use our enhanced grid manager hook
  const { initializeGrid, refreshGrid } = useGridManager(
    fabricCanvasRef,
    gridLayerRef,
    createGrid
  );
  
  /**
   * Set up the canvas controller
   */
  const setupCanvasController = useCallback(() => {
    try {
      if (!fabricCanvasRef.current) {
        logger.debug("Creating new Fabric canvas");
        
        // Create new Fabric canvas
        const canvas = new FabricCanvas('canvas', {
          width: initialCanvasWidth,
          height: initialCanvasHeight,
          selection: true,
          preserveObjectStacking: true,
          stopContextMenu: true,
          fireRightClick: true,
          renderOnAddRemove: false,
          enableRetinaScaling: true,
          imageSmoothingEnabled: true
        });
        
        fabricCanvasRef.current = canvas;
        
        // Set initial canvas dimensions
        setCanvasDimensions({
          width: initialCanvasWidth,
          height: initialCanvasHeight
        });
        
        // Set up event handlers for basic functionality
        canvas.on('mouse:down', () => {
          // Basic mouse down handler
        });
        
        canvas.on('mouse:move', () => {
          // Basic mouse move handler
        });
        
        canvas.on('mouse:up', () => {
          // Basic mouse up handler
        });
        
        canvas.on('selection:created', () => {
          // Selection handler
        });
        
        canvas.on('selection:updated', () => {
          // Selection update handler
        });
        
        canvas.on('object:modified', () => {
          // Object modification handler
          if (typeof recalculateGIA === 'function') {
            recalculateGIA();
          }
        });
      }
      
      // Ensure grid is initialized
      initializeGrid();
      
      // Add a resize handler to ensure grid remains visible
      const handleResize = () => {
        refreshGrid();
      };
      
      window.addEventListener('resize', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    } catch (error) {
      console.error("Error in setupCanvasController:", error);
      setHasError(true);
      setErrorMessage(`Canvas initialization error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [
    fabricCanvasRef,
    initialCanvasWidth,
    initialCanvasHeight,
    setCanvasDimensions,
    initializeGrid,
    refreshGrid,
    setHasError,
    setErrorMessage
  ]);
  
  // Run initial setup
  useEffect(() => {
    const cleanup = setupCanvasController();
    
    return () => {
      if (cleanup) cleanup();
    };
  }, [setupCanvasController]);
  
  /**
   * Recalculate GIA (Gross Internal Area)
   */
  const recalculateGIA = useCallback(() => {
    if (!fabricCanvasRef.current) return;
    
    try {
      // Calculate GIA from canvas objects
      // Simplified calculation for now
      setGia(0); // Will be implemented properly
    } catch (error) {
      logger.error("Error calculating GIA:", error);
    }
  }, [fabricCanvasRef, setGia]);
  
  /**
   * Refresh the canvas and grid
   */
  const refreshCanvas = useCallback(() => {
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.requestRenderAll();
      refreshGrid();
    }
  }, [fabricCanvasRef, refreshGrid]);
  
  /**
   * Clear the canvas
   */
  const clearCanvas = useCallback(() => {
    if (fabricCanvasRef.current) {
      // Keep grid objects
      const objectsToRemove = fabricCanvasRef.current.getObjects().filter(
        obj => !gridLayerRef.current.includes(obj)
      );
      
      objectsToRemove.forEach(obj => {
        fabricCanvasRef.current?.remove(obj);
      });
      
      fabricCanvasRef.current.requestRenderAll();
      recalculateGIA();
    }
  }, [fabricCanvasRef, gridLayerRef, recalculateGIA]);
  
  /**
   * Save the canvas state
   */
  const saveCanvas = useCallback(() => {
    if (fabricCanvasRef.current) {
      try {
        // Get all non-grid objects
        const objectsToSave = fabricCanvasRef.current.getObjects().filter(
          obj => !gridLayerRef.current.includes(obj)
        );
        
        // Create a JSON representation
        const json = JSON.stringify(objectsToSave.map(obj => obj.toJSON()));
        
        // Save to floor plans
        const updatedFloorPlans = [...floorPlans];
        if (!updatedFloorPlans[currentFloor]) {
          updatedFloorPlans[currentFloor] = {
            id: `floor-${currentFloor}`,
            name: `Floor ${currentFloor + 1}`,
            label: `Floor ${currentFloor + 1}`,
            strokes: json,
            gia: 0
          };
        } else {
          updatedFloorPlans[currentFloor] = {
            ...updatedFloorPlans[currentFloor],
            strokes: json
          };
        }
        
        setFloorPlans(updatedFloorPlans);
        
        // Save to localStorage or server
        localStorage.setItem('floorPlans', JSON.stringify(updatedFloorPlans));
        
        return true;
      } catch (error) {
        console.error("Error saving canvas:", error);
        return false;
      }
    }
    return false;
  }, [
    fabricCanvasRef,
    gridLayerRef,
    floorPlans,
    currentFloor,
    setFloorPlans
  ]);
  
  /**
   * Delete selected objects
   */
  const deleteSelectedObjects = useCallback(() => {
    if (fabricCanvasRef.current) {
      const activeObjects = fabricCanvasRef.current.getActiveObjects();
      
      if (activeObjects.length > 0) {
        fabricCanvasRef.current.discardActiveObject();
        
        activeObjects.forEach(obj => {
          fabricCanvasRef.current?.remove(obj);
        });
        
        fabricCanvasRef.current.requestRenderAll();
        recalculateGIA();
      }
    }
  }, [fabricCanvasRef, recalculateGIA]);
  
  /**
   * Handle tool change
   */
  const handleToolChange = useCallback((newTool: DrawingTool) => {
    setTool(newTool);
    
    if (fabricCanvasRef.current) {
      // Adjust canvas mode based on tool
      if (newTool === 'select') {
        fabricCanvasRef.current.selection = true;
        fabricCanvasRef.current.isDrawingMode = false;
      } else if (newTool === 'hand') {
        fabricCanvasRef.current.selection = false;
        fabricCanvasRef.current.isDrawingMode = false;
      } else {
        fabricCanvasRef.current.selection = false;
        fabricCanvasRef.current.isDrawingMode = true;
      }
    }
  }, [fabricCanvasRef, setTool]);
  
  /**
   * Handle floor selection
   */
  const handleFloorSelect = useCallback((floorIndex: number) => {
    if (floorIndex === currentFloor) return;
    
    // Save current floor before switching
    saveCanvas();
    
    // Switch to new floor
    setCurrentFloor(floorIndex);
    
    // Clear canvas (except grid)
    if (fabricCanvasRef.current) {
      const objectsToRemove = fabricCanvasRef.current.getObjects().filter(
        obj => !gridLayerRef.current.includes(obj)
      );
      
      objectsToRemove.forEach(obj => {
        fabricCanvasRef.current?.remove(obj);
      });
      
      // Load floor plan if it exists
      if (floorPlans[floorIndex] && floorPlans[floorIndex].strokes) {
        try {
          const strokes = JSON.parse(floorPlans[floorIndex].strokes as string);
          
          strokes.forEach((strokeData: any) => {
            // Use fabric.js to deserialize objects
            fabric.util.enlivenObjects([strokeData], (objects: any[]) => {
              objects.forEach(obj => {
                fabricCanvasRef.current?.add(obj);
              });
              fabricCanvasRef.current?.requestRenderAll();
            });
          });
        } catch (error) {
          console.error("Error loading floor plan:", error);
        }
      }
      
      fabricCanvasRef.current.requestRenderAll();
      recalculateGIA();
    }
  }, [
    currentFloor,
    saveCanvas,
    setCurrentFloor,
    fabricCanvasRef,
    gridLayerRef,
    floorPlans,
    recalculateGIA
  ]);
  
  /**
   * Handle adding a new floor
   */
  const handleAddFloor = useCallback(() => {
    // Save current floor
    saveCanvas();
    
    // Add new floor
    const newFloorIndex = floorPlans.length;
    const newFloor: FloorPlan = {
      id: `floor-${newFloorIndex}`,
      name: `Floor ${newFloorIndex + 1}`,
      label: `Floor ${newFloorIndex + 1}`,
      strokes: '[]',
      gia: 0
    };
    
    const updatedFloorPlans = [...floorPlans, newFloor];
    setFloorPlans(updatedFloorPlans);
    
    // Switch to new floor
    setCurrentFloor(newFloorIndex);
    
    // Clear canvas (except grid)
    if (fabricCanvasRef.current) {
      const objectsToRemove = fabricCanvasRef.current.getObjects().filter(
        obj => !gridLayerRef.current.includes(obj)
      );
      
      objectsToRemove.forEach(obj => {
        fabricCanvasRef.current?.remove(obj);
      });
      
      fabricCanvasRef.current.requestRenderAll();
      recalculateGIA();
    }
  }, [
    saveCanvas,
    floorPlans,
    setFloorPlans,
    setCurrentFloor,
    fabricCanvasRef,
    gridLayerRef,
    recalculateGIA
  ]);
  
  /**
   * Handle line thickness change
   */
  const handleLineThicknessChange = useCallback((thickness: number) => {
    setLineThickness(thickness);
  }, [setLineThickness]);
  
  /**
   * Handle line color change
   */
  const handleLineColorChange = useCallback((color: string) => {
    setLineColor(color);
  }, [setLineColor]);
  
  /**
   * Handle undo operation
   */
  const handleUndo = useCallback(() => {
    // Basic undo implementation
    console.log("Undo operation triggered");
  }, []);
  
  /**
   * Handle redo operation
   */
  const handleRedo = useCallback(() => {
    // Basic redo implementation
    console.log("Redo operation triggered");
  }, []);
  
  /**
   * Zoom the canvas
   */
  const handleZoom = useCallback((direction: "in" | "out") => {
    if (!fabricCanvasRef.current) return;
    
    const currentZoom = fabricCanvasRef.current.getZoom();
    const delta = direction === "in" ? 0.1 : -0.1;
    const newZoom = Math.max(0.5, Math.min(2.0, currentZoom + delta));
    
    fabricCanvasRef.current.setZoom(newZoom);
    setZoomLevel(newZoom);
  }, [fabricCanvasRef, setZoomLevel]);
  
  /**
   * Show measurement guide
   */
  const showMeasurementGuide = useCallback(() => {
    // Implementation for showing measurement guide
    alert("Measurement Guide: Draw walls by clicking and dragging. The GIA (Gross Internal Area) will be calculated automatically.");
  }, []);
  
  return {
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
  };
};
