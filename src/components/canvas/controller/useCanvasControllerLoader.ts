/**
 * Hook for loading floor plan data in the canvas controller
 * @module useCanvasControllerLoader
 */
import { useEffect, useCallback } from "react";
import { useFloorPlanLoader } from "@/hooks/useFloorPlanLoader";
import { FloorPlan, Wall, Room, StrokeType, StrokeTypeLiteral, RoomTypeLiteral } from "@/types/floorPlanTypes";
import { adaptFloorPlans } from "@/utils/typeAdapters";
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
        const typedWalls = plan.walls?.map(wall => {
          const start = wall.start || { x: 0, y: 0 } as Point;
          const end = wall.end || { x: 0, y: 0 } as Point;
          
          return {
            id: wall.id || `wall-${Date.now()}`,
            points: [start, end],
            startPoint: start,
            endPoint: end,
            start,
            end,
            thickness: wall.thickness || 5,
            height: wall.height || 0,
            color: wall.color || '#888888',
            roomIds: wall.roomIds || [],
            length: wall.length || calculateLength(start, end)
          } as Wall;
        }) || [];
        
        // Create a properly typed FloorPlan with all required fields
        const typedPlan: FloorPlan = {
          id: plan.id || '',
          name: plan.name || '',
          label: plan.label || plan.name || '',
          index: typeof plan.level !== 'undefined' ? Number(plan.level) : (plan.metadata?.level || 0),
          strokes: Array.isArray(plan.strokes) ? plan.strokes.map(stroke => ({
            id: stroke.id,
            points: stroke.points,
            type: mapStrokeType(stroke.type) as StrokeTypeLiteral,
            color: stroke.color,
            thickness: stroke.thickness,
            width: stroke.width || stroke.thickness || 1
          })) : [],
          walls: typedWalls,
          rooms: plan.rooms?.map(room => ({
            id: room.id,
            name: room.name || 'Unnamed Room',
            type: mapRoomType(room.type), 
            points: room.points,
            color: room.color || '#ffffff',
            area: room.area || 0,
            level: plan.level || 0,
            walls: [] // Add empty walls array to satisfy the Room type
          })) as Room[] || [],
          metadata: plan.metadata ? {
            createdAt: typeof plan.metadata.createdAt === 'string' 
              ? plan.metadata.createdAt 
              : new Date(plan.metadata.createdAt || Date.now()).toISOString(),
            updatedAt: typeof plan.metadata.updatedAt === 'string' 
              ? plan.metadata.updatedAt 
              : new Date(plan.metadata.updatedAt || Date.now()).toISOString(),
            paperSize: plan.metadata.paperSize || 'A4',
            level: plan.metadata.level || 0,
            version: '1.0',
            author: 'User',
            dateCreated: typeof plan.metadata.dateCreated === 'string' 
              ? plan.metadata.dateCreated 
              : new Date(plan.metadata.dateCreated || Date.now()).toISOString(),
            lastModified: typeof plan.metadata.lastModified === 'string' 
              ? plan.metadata.lastModified 
              : new Date(plan.metadata.lastModified || Date.now()).toISOString(),
            notes: plan.metadata.notes || ''
          } : {
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            paperSize: plan.paperSize || 'A4',
            level: plan.level || 0,
            version: '1.0',
            author: 'User',
            dateCreated: new Date().toISOString(),
            lastModified: new Date().toISOString(),
            notes: ''
          },
          canvasJson: plan.canvasJson || null,
          gia: plan.gia || 0,
          level: plan.level || 0,
          canvasData: plan.canvasData || null,
          createdAt: plan.createdAt || new Date().toISOString(),
          updatedAt: plan.updatedAt || new Date().toISOString()
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
  function mapStrokeType(type: string | any): StrokeTypeLiteral {
    if (typeof type === 'string') {
      switch (type.toLowerCase()) {
        case 'line': return 'line';
        case 'polyline': return 'polyline';
        case 'wall': return 'wall';
        case 'room': return 'room';
        case 'freehand': return 'freehand';
        default: return 'line';
      }
    }
    return 'line';
  }
  
  // Helper function to map room types
  function mapRoomType(type: string | any): RoomTypeLiteral {
    if (typeof type === 'string') {
      switch (type.toLowerCase()) {
        case 'living': return 'living';
        case 'bedroom': return 'bedroom';
        case 'kitchen': return 'kitchen';
        case 'bathroom': return 'bathroom';
        case 'office': return 'office';
        default: return 'other';
      }
    }
    return 'other';
  }

  // Load floor plans data on mount
  useEffect(() => {
    loadFloorPlansData();
  }, [loadFloorPlansData]);

  return {
    loadFloorPlansData
  };
};

function calculateLength(start: Point, end: Point): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  return Math.sqrt(dx * dx + dy * dy);
}

const exampleWall: Wall = {
  id: 'wall-id',
  floorPlanId: 'floor-plan-id',
  start: { x: 0, y: 0 },
  end: { x: 10, y: 10 },
  thickness: 10,
  length: 14.1421356237, // Computed length for example
  angle: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: {
    type: 'example',
    material: 'concrete',
    height: 2.5,
    notes: '',
  },
};

const exampleFloorPlanMetadata = {
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  paperSize: 'A4',
  level: 0,
  version: '1.0',
  author: 'User',
  dateCreated: new Date().toISOString(),
  lastModified: new Date().toISOString(),
  notes: '',
};

const exampleFloorPlan = {
  id: 'floor-plan-id',
  name: 'Example FloorPlan',
  label: 'Example FloorPlan',
  index: 0,
  strokes: [], // etc
  walls: [exampleWall],
  rooms: [],
  gia: 0,
  level: 0,
  canvasData: null,
  canvasJson: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  metadata: exampleFloorPlanMetadata,
  data: {},  // required property
  userId: 'test-user', // required property
};
