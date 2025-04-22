/**
 * Hook for canvas controller tools
 * This file needs to be created to match the import from useCanvasControllerTools.ts
 */
import { useState, useCallback, useRef } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { createSimpleGrid, ensureGridVisible } from '@/utils/simpleGridCreator';
import { isPressureSupported, isTiltSupported } from '@/utils/canvas/pointerEvents';
import { toast } from 'sonner';
import { useVirtualizedCanvas } from '@/hooks/useVirtualizedCanvas';
import { FloorPlan as UnifiedFloorPlan } from '@/types/floor-plan/unifiedTypes';
import { FloorPlan as LegacyFloorPlan } from '@/types/floorPlanTypes';
import { convertToUnifiedFloorPlan, convertToUnifiedFloorPlans, convertToAppFloorPlan, convertToAppFloorPlans } from '@/utils/floorPlanAdapter/floorPlanTypeAdapter';

interface CanvasControllerToolsOptions {
  enableVirtualization?: boolean;
}

export const useCanvasControllerTools = (canvas: FabricCanvas | null, options: CanvasControllerToolsOptions = {}) => {
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState<string>("#000000");
  const [lineThickness, setLineThickness] = useState<number>(2);
  const gridObjectsRef = useRef<any[]>([]);
  const canvasRef = useRef<FabricCanvas | null>(canvas);
  
  // State for floor plans - using any[] type to avoid type conflicts
  const [floorPlans, setFloorPlans] = useState<any[]>([]);

  // Initialize canvas virtualization
  const {
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization,
    performanceMetrics
  } = useVirtualizedCanvas(canvasRef, {
    enabled: options.enableVirtualization ?? true,
    objectThreshold: 100
  });

  // Get unified floor plans (convert from legacy if needed)
  const getUnifiedFloorPlans = useCallback(() => {
    // Check if we're already working with UnifiedFloorPlan[]
    if (floorPlans.length > 0 && 'userId' in floorPlans[0] && !('propertyId' in floorPlans[0])) {
      return floorPlans as UnifiedFloorPlan[];
    }
    
    // Otherwise, convert from legacy format
    return convertToUnifiedFloorPlans(floorPlans as LegacyFloorPlan[]);
  }, [floorPlans]);

  // Get legacy floor plans (convert from unified if needed)
  const getLegacyFloorPlans = useCallback(() => {
    // Check if we're already working with LegacyFloorPlan[]
    if (floorPlans.length > 0 && 'propertyId' in floorPlans[0]) {
      return floorPlans as LegacyFloorPlan[];
    }
    
    // Otherwise, convert from unified format
    return convertToAppFloorPlans(floorPlans as UnifiedFloorPlan[]);
  }, [floorPlans]);

  // Safe setter that handles both types
  const setUnifiedFloorPlans = useCallback((plans: UnifiedFloorPlan[] | ((prev: UnifiedFloorPlan[]) => UnifiedFloorPlan[])) => {
    if (typeof plans === 'function') {
      setFloorPlans((prevPlans) => {
        const unified = prevPlans.length > 0 && 'propertyId' in prevPlans[0] 
          ? convertToUnifiedFloorPlans(prevPlans as LegacyFloorPlan[])
          : prevPlans as UnifiedFloorPlan[];
        return plans(unified);
      });
    } else {
      setFloorPlans(plans);
    }
  }, []);

  // Safe setter that handles both types
  const setLegacyFloorPlans = useCallback((plans: LegacyFloorPlan[] | ((prev: LegacyFloorPlan[]) => LegacyFloorPlan[])) => {
    if (typeof plans === 'function') {
      setFloorPlans((prevPlans) => {
        const legacy = prevPlans.length > 0 && !('propertyId' in prevPlans[0])
          ? convertToAppFloorPlans(prevPlans as UnifiedFloorPlan[])
          : prevPlans as LegacyFloorPlan[];
        return plans(legacy);
      });
    } else {
      setFloorPlans(plans);
    }
  }, []);

  const handleCanvasReady = useCallback((canvas: FabricCanvas) => {
    try {
      // Set fabricCanvasRef for external use
      canvasRef.current = canvas;

      // Set up proper tool based on the current drawing mode
      canvas.isDrawingMode = tool === DrawingMode.DRAW;
      canvas.selection = tool === DrawingMode.SELECT;

      if (canvas.isDrawingMode) {
        canvas.freeDrawingBrush.color = lineColor;
        canvas.freeDrawingBrush.width = lineThickness;

        // Check for enhanced input capabilities
        const hasAdvancedInput = isPressureSupported() || isTiltSupported();

        // Set brush to respond to pressure
        if (hasAdvancedInput) {
          console.log('Enhanced input capabilities detected');
          toast.success('Enhanced drawing capabilities enabled', {
            id: 'enhanced-drawing',
            duration: 3000
          });
        }
      }

      // Create grid for the canvas
      if (true) {
        console.log("Creating grid for canvas");
        const gridObjects = createSimpleGrid(canvas, 50, '#e0e0e0');
        gridObjectsRef.current = gridObjects;
      }

      // Make sure touch events work well on mobile
      canvas.allowTouchScrolling = tool === DrawingMode.HAND;

      // Apply custom CSS to the canvas container to make it touch-friendly
      if (canvas.wrapperEl) {
        canvas.wrapperEl.classList.add('touch-manipulation');
        canvas.wrapperEl.style.touchAction = tool === DrawingMode.HAND ? 'manipulation' : 'none';
      }
    } catch (error) {
      console.error("Error in canvas initialization:", error);
    }
  }, [tool, lineColor, lineThickness]);

  // Update grid visibility when showGrid changes
  const updateGridVisibility = useCallback((showGrid: boolean) => {
    const canvas = canvasRef.current;
    if (canvas && gridObjectsRef.current.length > 0) {
      gridObjectsRef.current.forEach(obj => {
        obj.set('visible', showGrid);
      });
      canvas.requestRenderAll();
    } else if (canvas && showGrid && gridObjectsRef.current.length === 0) {
      // Create grid if it doesn't exist and should be shown
      const gridObjects = createSimpleGrid(canvas, 50, '#e0e0e0');
      gridObjectsRef.current = gridObjects;
    }
  }, []);

  // Update tool settings when they change
  const updateToolSettings = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;

    if (canvas.isDrawingMode) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }

    canvas.requestRenderAll();
  }, [tool, lineColor, lineThickness]);

  return {
    tool,
    setTool,
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness,
    handleCanvasReady,
    updateGridVisibility,
    updateToolSettings,
    virtualizationEnabled,
    toggleVirtualization,
    refreshVirtualization,
    performanceMetrics,
    // Floor plan converters
    floorPlans,
    setFloorPlans,
    getUnifiedFloorPlans,
    getLegacyFloorPlans,
    setUnifiedFloorPlans,
    setLegacyFloorPlans
  };
};
