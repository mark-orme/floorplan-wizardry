
/**
 * Canvas controller loader
 * Loads canvas functionality
 */
// Remove all missing imports
import { useRef, useState } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { DrawingMode } from "@/constants/drawingModes";
import { useCanvasGrid } from '@/hooks/useCanvasGrid';
import { useCanvasHistory } from '@/hooks/useCanvasHistory';
import { useCanvasPerformance } from '@/hooks/useCanvasPerformance';
import { useCanvasOptimization } from '@/hooks/useCanvasOptimization';
import { useSyncedFloorPlans } from '@/hooks/useSyncedFloorPlans';
import { useFloorPlanGIA } from '@/hooks/useFloorPlanGIA';
import { useCanvasDebug } from '@/hooks/useCanvasDebug';
import { FloorPlan } from '@/types/floor-plan/unifiedTypes';
import { createDefaultMetadata } from '@/utils/floorPlanUtils';
import { createCompleteMetadata } from '@/utils/debug/typeDiagnostics';

interface UseCanvasControllerLoaderProps {
  initialTool?: DrawingMode;
  initialZoomLevel?: number;
  initialLineThickness?: number;
  initialLineColor?: string;
  initialFloorPlans?: FloorPlan[];
}

/**
 * Hook for loading canvas controller functionality
 * @param props Controller loader props
 * @returns Canvas controller functions and state
 */
export const useCanvasControllerLoader = (props: UseCanvasControllerLoaderProps = {}) => {
  const {
    initialTool = DrawingMode.SELECT,
    initialZoomLevel = 1,
    initialLineThickness = 2,
    initialLineColor = "#000000",
    initialFloorPlans = []
  } = props;
  
  // Core references
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  
  // Core state
  const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
  const [tool, setTool] = useState<DrawingMode>(initialTool);
  const [lineThickness, setLineThickness] = useState(initialLineThickness);
  const [lineColor, setLineColor] = useState(initialLineColor);
  const [zoomLevel, setZoomLevel] = useState(initialZoomLevel);
  const [gia, setGia] = useState(0);
  const [currentFloor, setCurrentFloor] = useState(0);
  
  // Canvas grid management
  const gridLayerRef = useRef<any[]>([]);
  const grid = useCanvasGrid({
    fabricCanvasRef,
    // Remove gridLayerRef as it's not in the props type
  });
  
  // Canvas history management
  const history = useCanvasHistory({
    fabricCanvasRef
  });
  
  // Performance tracking
  const performance = useCanvasPerformance();
  
  // Canvas optimization
  const optimization = useCanvasOptimization();
  
  // Floor plan state management
  const { 
    floorPlans, 
    setFloorPlans 
  } = useSyncedFloorPlans({
    initialFloorPlans
  });
  
  // GIA calculation
  const { 
    calculateGIA 
  } = useFloorPlanGIA({
    fabricCanvasRef,
    setGia
  });
  
  // Canvas debugging
  const debug = useCanvasDebug({
    fabricCanvasRef
  });
  
  /**
   * Function to handle canvas ready
   * @param fabricCanvas Fabric canvas instance
   */
  const handleCanvasReady = (fabricCanvas: FabricCanvas) => {
    fabricCanvasRef.current = fabricCanvas;
    setCanvas(fabricCanvas);
    
    // Initialize canvas with current settings
    if (fabricCanvas.isDrawingMode) {
      fabricCanvas.freeDrawingBrush.width = lineThickness;
      fabricCanvas.freeDrawingBrush.color = lineColor;
    }
    
    // Create initial floor plan if none exists
    if (floorPlans.length === 0) {
      const newFloorPlan: FloorPlan = {
        id: 'floor-0',
        name: 'Ground Floor',
        label: 'Ground Floor',
        walls: [],
        rooms: [],
        strokes: [],
        canvasData: null,
        canvasJson: null,
        metadata: createCompleteMetadata({ level: 0 }),
        data: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        gia: 0,
        level: 0,
        index: 0,
        userId: ''
      };
      
      setFloorPlans([newFloorPlan]);
    }
    
    // Calculate initial GIA
    calculateGIA();
    
    // Mark canvas as ready
    performance.markCanvasReady();
  };
  
  /**
   * Function to handle canvas error
   * @param error Error object
   */
  const handleCanvasError = (error: Error) => {
    console.error("Canvas initialization error:", error);
    debug.logError(error);
  };
  
  /**
   * Create a new wall
   * @param startPoint Start point
   * @param endPoint End point
   */
  const createWall = (startPoint: { x: number; y: number }, endPoint: { x: number; y: number }) => {
    if (!canvas) return;
    
    const dx = endPoint.x - startPoint.x;
    const dy = endPoint.y - startPoint.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    
    const wall = {
      id: `wall-${Date.now()}`,
      start: startPoint,
      end: endPoint,
      thickness: 5,
      color: "#333333",
      roomIds: [],
      length
    };
    
    if (floorPlans[currentFloor]) {
      const updatedFloorPlan = {
        ...floorPlans[currentFloor],
        walls: [...floorPlans[currentFloor].walls, wall],
        updatedAt: new Date().toISOString()
      };
      
      const newFloorPlans = [...floorPlans];
      newFloorPlans[currentFloor] = updatedFloorPlan;
      setFloorPlans(newFloorPlans);
      
      // Recalculate GIA
      calculateGIA();
    }
  };
  
  return {
    canvasRef,
    fabricCanvasRef,
    canvas,
    tool,
    setTool,
    lineThickness,
    setLineThickness,
    lineColor,
    setLineColor,
    zoomLevel,
    setZoomLevel,
    floorPlans,
    setFloorPlans,
    gia,
    setGia,
    currentFloor,
    setCurrentFloor,
    handleCanvasReady,
    handleCanvasError,
    createWall,
    gridLayerRef,
    calculateGIA,
    // Debug functions
    debug: {
      logInfo: debug.logInfo,
      logWarning: debug.logWarning,
      logError: debug.logError
    }
  };
};

export default useCanvasControllerLoader;
