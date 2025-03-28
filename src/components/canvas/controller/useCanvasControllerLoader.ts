
/**
 * Hook for loading floor plan data in the canvas controller
 * @module useCanvasControllerLoader
 */
import { useEffect, useCallback } from "react";
import { useFloorPlanLoader } from "@/hooks/useFloorPlanLoader";
import { FloorPlan, StrokeType, Wall } from "@/types/floorPlanTypes";
import { coreToAppFloorPlans } from "@/utils/typeAdapters";
import { Point } from "@/types/geometryTypes";

/**
 * Props for the useCanvasControllerLoader hook
 * 
 * @interface UseCanvasControllerLoaderProps
 * @property {React.Dispatch<React.SetStateAction<FloorPlan[]>>} setFloorPlans - Function to update floor plans state
 * @property {(value: boolean) => void} setHasError - Function to update error state
 * @property {(value: string) => void} setErrorMessage - Function to update error message
 * @property {() => Promise<unknown>} loadData - Function to load floor plan data
 */
interface UseCanvasControllerLoaderProps {
  setFloorPlans: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  setHasError: (value: boolean) => void;
  setErrorMessage: (value: string) => void;
  loadData: () => Promise<unknown>;
}

/**
 * Result of the useCanvasControllerLoader hook
 * 
 * @interface UseCanvasControllerLoaderResult
 * @property {() => Promise<void>} loadFloorPlansData - Function to load floor plan data
 */
interface UseCanvasControllerLoaderResult {
  loadFloorPlansData: () => Promise<void>;
}

/**
 * Hook that handles loading floor plan data
 * Initializes data loading and provides reload functionality
 * 
 * @param {UseCanvasControllerLoaderProps} props - Hook properties
 * @returns {UseCanvasControllerLoaderResult} Data loading functions
 */
export const useCanvasControllerLoader = (props: UseCanvasControllerLoaderProps): UseCanvasControllerLoaderResult => {
  const {
    setFloorPlans,
    setHasError,
    setErrorMessage,
    loadData
  } = props;

  // Floor plan data loading
  const floorPlanLoader = useFloorPlanLoader({
    initialFloorPlans: [],
    defaultFloorIndex: 0
  });

  /**
   * Load floor plans data from loader
   * Uses the loader's loadFloorPlans method
   * 
   * @returns {Promise<void>} Promise that resolves when data is loaded
   */
  const loadFloorPlansData = useCallback(async (): Promise<void> => {
    try {
      const plans = await floorPlanLoader.loadFloorPlans();
      
      // Convert each plan to the required FloorPlan type with all required properties
      const typedPlans: FloorPlan[] = plans.map(plan => {
        // Create a properly typed FloorPlan with all required fields
        const typedPlan: FloorPlan = {
          id: plan.id || '',
          name: plan.name || '',
          label: plan.label || plan.name || '',
          index: typeof plan.level !== 'undefined' ? Number(plan.level) : (plan.metadata?.level || 0),
          strokes: Array.isArray(plan.strokes) ? plan.strokes.map(stroke => ({
            id: stroke.id,
            points: stroke.points,
            type: mapStrokeType(stroke.type),
            color: stroke.color,
            thickness: stroke.thickness,
            width: stroke.width || stroke.thickness || 1
          })) : [],
          walls: plan.walls?.map(wall => ({
            id: wall.id,
            startPoint: wall.start || { x: 0, y: 0 } as Point,
            endPoint: wall.end || { x: 0, y: 0 } as Point,
            thickness: wall.thickness,
            height: wall.height || 0,
            color: wall.color,
            roomIds: wall.roomIds || []
          } as Wall)) || [],
          rooms: plan.rooms || [],
          metadata: plan.metadata ? {
            createdAt: typeof plan.metadata.createdAt === 'string' 
              ? new Date(plan.metadata.createdAt).getTime() 
              : plan.metadata.createdAt || Date.now(),
            updatedAt: typeof plan.metadata.updatedAt === 'string' 
              ? new Date(plan.metadata.updatedAt).getTime() 
              : plan.metadata.updatedAt || Date.now(),
            paperSize: plan.metadata.paperSize || 'CUSTOM',
            level: plan.metadata.level || 0
          } : {
            createdAt: Date.now(),
            updatedAt: Date.now(),
            paperSize: plan.paperSize || 'CUSTOM',
            level: plan.level || 0
          },
          canvasJson: plan.canvasJson || '',
          gia: plan.gia || 0,
          level: plan.level || 0,
          canvasData: plan.canvasData || null,
          createdAt: plan.createdAt || new Date().toISOString(),
          updatedAt: plan.updatedAt || new Date().toISOString(),
          paperSize: plan.paperSize || 'CUSTOM'
        };
        
        return typedPlan;
      });
      
      setFloorPlans(typedPlans);
    } catch (error) {
      console.error("Error loading floor plans", error);
      setHasError(true);
      setErrorMessage(error instanceof Error ? error.message : "Failed to load floor plans");
    }
    return;
  }, [floorPlanLoader, setFloorPlans, setHasError, setErrorMessage]);

  // Helper function to map stroke types
  function mapStrokeType(type: string | any): StrokeType {
    if (typeof type === 'string') {
      switch (type.toUpperCase()) {
        case 'LINE': return StrokeType.LINE;
        case 'POLYLINE': return StrokeType.POLYLINE;
        case 'WALL': return StrokeType.WALL;
        case 'ROOM': return StrokeType.ROOM;
        case 'FREEHAND': return StrokeType.FREEHAND;
        case 'CIRCLE': return StrokeType.CIRCLE;
        case 'RECTANGLE': return StrokeType.RECTANGLE;
        case 'TEXT': return StrokeType.TEXT;
        case 'PATH': return StrokeType.PATH;
        default: return StrokeType.LINE;
      }
    }
    return StrokeType.LINE;
  }

  // Load floor plans data on mount
  useEffect(() => {
    loadFloorPlansData();
  }, [loadFloorPlansData]);

  return {
    loadFloorPlansData
  };
};
