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
import { useCanvasHistory } from "@/hooks/useCanvasHistory";
import { useCanvasDrawing } from "@/hooks/useCanvasDrawing";
import { useCanvasZoom } from "@/hooks/useCanvasZoom";
import { useCanvasSelection } from "@/hooks/useCanvasSelection";
import { useCanvasKeyboardShortcuts } from "@/hooks/useCanvasKeyboardShortcuts";
import { useCanvasEventHandlers } from "@/hooks/useCanvasEventHandlers";
import { useCanvasObjectManipulation } from "@/hooks/useCanvasObjectManipulation";
import { useCanvasMeasurements } from "@/hooks/useCanvasMeasurements";
import { useCanvasExport } from "@/hooks/useCanvasExport";
import { useCanvasImport } from "@/hooks/useCanvasImport";
import { useCanvasGrid } from "@/hooks/useCanvasGrid";
import { useCanvasSnapping } from "@/hooks/useCanvasSnapping";
import { useCanvasTextEditing } from "@/hooks/useCanvasTextEditing";
import { useCanvasObjectCreation } from "@/hooks/useCanvasObjectCreation";
import { useCanvasObjectProperties } from "@/hooks/useCanvasObjectProperties";
import { useCanvasObjectAlignment } from "@/hooks/useCanvasObjectAlignment";
import { useCanvasObjectGrouping } from "@/hooks/useCanvasObjectGrouping";
import { useCanvasObjectLocking } from "@/hooks/useCanvasObjectLocking";
import { useCanvasObjectVisibility } from "@/hooks/useCanvasObjectVisibility";
import { useCanvasObjectOrdering } from "@/hooks/useCanvasObjectOrdering";
import { useCanvasObjectCloning } from "@/hooks/useCanvasObjectCloning";
import { useCanvasObjectDeletion } from "@/hooks/useCanvasObjectDeletion";
import { useCanvasObjectSelection } from "@/hooks/useCanvasObjectSelection";
import { useCanvasObjectTransformation } from "@/hooks/useCanvasObjectTransformation";
import { useCanvasObjectMovement } from "@/hooks/useCanvasObjectMovement";
import { useCanvasObjectResizing } from "@/hooks/useCanvasObjectResizing";
import { useCanvasObjectRotation } from "@/hooks/useCanvasObjectRotation";
import { useCanvasObjectScaling } from "@/hooks/useCanvasObjectScaling";
import { useCanvasObjectFlipping } from "@/hooks/useCanvasObjectFlipping";
import { useCanvasObjectSkewing } from "@/hooks/useCanvasObjectSkewing";
import { useCanvasObjectDistribution } from "@/hooks/useCanvasObjectDistribution";
import { useCanvasObjectArrangement } from "@/hooks/useCanvasObjectArrangement";
import { useCanvasObjectConstraints } from "@/hooks/useCanvasObjectConstraints";
import { useCanvasObjectSnapping } from "@/hooks/useCanvasObjectSnapping";
import { useCanvasObjectGuidelines } from "@/hooks/useCanvasObjectGuidelines";
import { useCanvasObjectBoundaries } from "@/hooks/useCanvasObjectBoundaries";
import { useCanvasObjectInteractions } from "@/hooks/useCanvasObjectInteractions";
import { useCanvasObjectAnimations } from "@/hooks/useCanvasObjectAnimations";
import { useCanvasObjectEffects } from "@/hooks/useCanvasObjectEffects";
import { useCanvasObjectFilters } from "@/hooks/useCanvasObjectFilters";
import { useCanvasObjectShadows } from "@/hooks/useCanvasObjectShadows";
import { useCanvasObjectGradients } from "@/hooks/useCanvasObjectGradients";
import { useCanvasObjectPatterns } from "@/hooks/useCanvasObjectPatterns";
import { useCanvasObjectClipping } from "@/hooks/useCanvasObjectClipping";
import { useCanvasObjectMasking } from "@/hooks/useCanvasObjectMasking";
import { useCanvasObjectCompositing } from "@/hooks/useCanvasObjectCompositing";
import { useCanvasObjectBlending } from "@/hooks/useCanvasObjectBlending";
import { useCanvasObjectOpacity } from "@/hooks/useCanvasObjectOpacity";
import { useCanvasObjectVisibility } from "@/hooks/useCanvasObjectVisibility";
import { useCanvasObjectLocking } from "@/hooks/useCanvasObjectLocking";
import { useCanvasObjectGrouping } from "@/hooks/useCanvasObjectGrouping";
import { useCanvasObjectAlignment } from "@/hooks/useCanvasObjectAlignment";
import { useCanvasObjectDistribution } from "@/hooks/useCanvasObjectDistribution";
import { useCanvasObjectArrangement } from "@/hooks/useCanvasObjectArrangement";
import { useCanvasObjectOrdering } from "@/hooks/useCanvasObjectOrdering";
import { useCanvasObjectCloning } from "@/hooks/useCanvasObjectCloning";
import { useCanvasObjectDeletion } from "@/hooks/useCanvasObjectDeletion";
import { useCanvasObjectSelection } from "@/hooks/useCanvasObjectSelection";
import { useCanvasObjectTransformation } from "@/hooks/useCanvasObjectTransformation";
import { useCanvasObjectMovement } from "@/hooks/useCanvasObjectMovement";
import { useCanvasObjectResizing } from "@/hooks/useCanvasObjectResizing";
import { useCanvasObjectRotation } from "@/hooks/useCanvasObjectRotation";
import { useCanvasObjectScaling } from "@/hooks/useCanvasObjectScaling";
import { useCanvasObjectFlipping } from "@/hooks/useCanvasObjectFlipping";
import { useCanvasObjectSkewing } from "@/hooks/useCanvasObjectSkewing";
import { useCanvasObjectConstraints } from "@/hooks/useCanvasObjectConstraints";
import { useCanvasObjectSnapping } from "@/hooks/useCanvasObjectSnapping";
import { useCanvasObjectGuidelines } from "@/hooks/useCanvasObjectGuidelines";
import { useCanvasObjectBoundaries } from "@/hooks/useCanvasObjectBoundaries";
import { useCanvasObjectInteractions } from "@/hooks/useCanvasObjectInteractions";
import { useCanvasObjectAnimations } from "@/hooks/useCanvasObjectAnimations";
import { useCanvasObjectEffects } from "@/hooks/useCanvasObjectEffects";
import { useCanvasObjectFilters } from "@/hooks/useCanvasObjectFilters";
import { useCanvasObjectShadows } from "@/hooks/useCanvasObjectShadows";
import { useCanvasObjectGradients } from "@/hooks/useCanvasObjectGradients";
import { useCanvasObjectPatterns } from "@/hooks/useCanvasObjectPatterns";
import { useCanvasObjectClipping } from "@/hooks/useCanvasObjectClipping";
import { useCanvasObjectMasking } from "@/hooks/useCanvasObjectMasking";
import { useCanvasObjectCompositing } from "@/hooks/useCanvasObjectCompositing";
import { useCanvasObjectBlending } from "@/hooks/useCanvasObjectBlending";
import { useCanvasObjectOpacity } from "@/hooks/useCanvasObjectOpacity";

export const useCanvasControllerSetup = (
  fabricCanvasRef,
  gridLayerRef,
  createGrid,
  initialCanvasWidth,
  initialCanvasHeight,
  canvasWrapperRef
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
  
  // History management
  const { 
    canUndo, canRedo, 
    addHistoryEntry, 
    undo, redo, 
    clearHistory 
  } = useCanvasHistory();
  
  // Canvas drawing functionality
  const { 
    startDrawing, 
    continueDrawing, 
    finishDrawing,
    cancelDrawing,
    isDrawing,
    currentPath
  } = useCanvasDrawing({
    fabricCanvasRef,
    tool,
    lineThickness,
    lineColor,
    addHistoryEntry
  });
  
  // Canvas zoom functionality
  const {
    zoomIn,
    zoomOut,
    resetZoom,
    setZoom,
    panCanvas,
    isPanning
  } = useCanvasZoom({
    fabricCanvasRef,
    zoomLevel,
    setZoomLevel,
    canvasWrapperRef
  });
  
  // Canvas selection functionality
  const {
    selectedObjects,
    selectObject,
    deselectAll,
    deleteSelected,
    groupSelected,
    ungroupSelected
  } = useCanvasSelection({
    fabricCanvasRef,
    addHistoryEntry
  });
  
  // Canvas measurements
  const {
    calculateGIA,
    measureDistance,
    addMeasurement,
    removeMeasurement,
    showAllMeasurements,
    hideAllMeasurements
  } = useCanvasMeasurements({
    fabricCanvasRef,
    setGia
  });
  
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
        
        // Set up event handlers
        canvas.on('mouse:down', (e) => {
          if (tool === DrawingTool.PAN) {
            panCanvas(true, e);
            return;
          }
          
          if (tool === DrawingTool.SELECT) {
            return; // Let Fabric handle selection
          }
          
          startDrawing(e);
        });
        
        canvas.on('mouse:move', (e) => {
          if (isPanning()) {
            panCanvas(false, e);
            return;
          }
          
          if (isDrawing()) {
            continueDrawing(e);
          }
        });
        
        canvas.on('mouse:up', () => {
          if (isPanning()) {
            panCanvas(false);
            return;
          }
          
          if (isDrawing()) {
            finishDrawing();
            calculateGIA();
          }
        });
        
        canvas.on('selection:created', (e) => {
          addHistoryEntry();
        });
        
        canvas.on('selection:updated', (e) => {
          addHistoryEntry();
        });
        
        canvas.on('object:modified', (e) => {
          addHistoryEntry();
          calculateGIA();
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
      setErrorMessage(`Canvas initialization error: ${error.message}`);
    }
  }, [
    fabricCanvasRef,
    initialCanvasWidth,
    initialCanvasHeight,
    setCanvasDimensions,
    tool,
    panCanvas,
    startDrawing,
    isPanning,
    isDrawing,
    continueDrawing,
    finishDrawing,
    calculateGIA,
    addHistoryEntry,
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
      addHistoryEntry();
      calculateGIA();
    }
  }, [fabricCanvasRef, gridLayerRef, addHistoryEntry, calculateGIA]);
  
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
            name: `Floor ${currentFloor + 1}`,
            strokes: []
          };
        }
        
        updatedFloorPlans[currentFloor].strokes = json;
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
        addHistoryEntry();
        calculateGIA();
      }
    }
  }, [fabricCanvasRef, addHistoryEntry, calculateGIA]);
  
  /**
   * Handle tool change
   */
  const handleToolChange = useCallback((newTool: DrawingTool) => {
    setTool(newTool);
    
    if (fabricCanvasRef.current) {
      // Adjust canvas mode based on tool
      if (newTool === DrawingTool.SELECT) {
        fabricCanvasRef.current.selection = true;
        fabricCanvasRef.current.isDrawingMode = false;
      } else if (newTool === DrawingTool.PAN) {
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
          const strokes = JSON.parse(floorPlans[floorIndex].strokes);
          
          strokes.forEach((strokeData: any) => {
            fabric.util.enlivenObjects([strokeData], (objects: FabricObject[]) => {
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
      calculateGIA();
    }
  }, [
    currentFloor,
    saveCanvas,
    setCurrentFloor,
    fabricCanvasRef,
    gridLayerRef,
    floorPlans,
    calculateGIA
  ]);
  
  /**
   * Handle adding a new floor
   */
  const handleAddFloor = useCallback(() => {
    // Save current floor
    saveCanvas();
    
    // Add new floor
    const newFloorIndex = floorPlans.length;
    const updatedFloorPlans = [...floorPlans, {
      name: `Floor ${newFloorIndex + 1}`,
      strokes: []
    }];
    
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
      calculateGIA();
    }
  }, [
    saveCanvas,
    floorPlans,
    setFloorPlans,
    setCurrentFloor,
    fabricCanvasRef,
    gridLayerRef,
    calculateGIA
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
    handleUndo: undo,
    handleRedo: redo,
    handleZoom: (direction: "in" | "out") => {
      if (direction === "in") {
        zoomIn();
      } else {
        zoomOut();
      }
    },
    handleFloorSelect,
    handleAddFloor,
    handleLineThicknessChange,
    handleLineColorChange,
    showMeasurementGuide
  };
};
