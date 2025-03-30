import React, { createContext, useContext, useState, useRef, useEffect } from 'react';
import { DrawingTool } from '@/types/drawingTypes';
import { FloorPlan } from '@/types/floorPlanTypes';
import { DebugInfoState } from '@/types/drawingTypes';
import { toast } from 'sonner';
import { createFloorPlan } from '@/utils/floorPlanUtils';
import { Canvas as FabricCanvas } from 'fabric';
import { useCanvasControllerSetup } from './useCanvasControllerSetup';
import { useCanvasControllerDependencies } from '@/hooks/useCanvasControllerDependencies';
import { useCanvasControllerState } from './useCanvasControllerState';
import { useCanvasControllerTools } from './useCanvasControllerTools';
import { useCanvasControllerDrawingState } from './useCanvasControllerDrawingState';

/**
 * Constants for canvas controller
 */
const INITIAL_LINE_THICKNESS = 2;
const DEFAULT_LINE_COLOR = '#000000';
const INITIAL_FLOOR_INDEX = 0;
const DEFAULT_CANVAS_WIDTH = 800;
const DEFAULT_CANVAS_HEIGHT = 600;

/**
 * Context value interface for the Canvas Controller
 * Contains all the state and functions needed for canvas operations
 * @interface CanvasControllerContextValue
 */
export interface CanvasControllerContextValue {
  /** Current active drawing tool */
  tool: DrawingTool;
  /** Function to set the active drawing tool */
  setTool: (tool: DrawingTool) => void;
  /** Gross Internal Area calculation result */
  gia: number;
  /** State setter for Gross Internal Area */
  setGia?: React.Dispatch<React.SetStateAction<number>>;
  /** Array of floor plans in the project */
  floorPlans: FloorPlan[];
  /** State setter for floor plans */
  setFloorPlans?: React.Dispatch<React.SetStateAction<FloorPlan[]>>;
  /** Current active floor index */
  currentFloor: number;
  /** Canvas dimensions */
  dimensions?: { width: number; height: number };
  /** Line thickness for drawing */
  lineThickness: number;
  /** Line color for drawing */
  lineColor: string;
  /** Reference to the canvas HTML element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Debug information state */
  debugInfo: DebugInfoState;
  /** Handler for tool change */
  handleToolChange: (tool: DrawingTool) => void;
  /** Handler for undo operation */
  handleUndo: () => void;
  /** Handler for redo operation */
  handleRedo: () => void;
  /** Handler for zoom operation */
  handleZoom: (direction: "in" | "out") => void;
  /** Handler to clear canvas */
  clearCanvas: () => void;
  /** Handler to save canvas */
  saveCanvas: () => void;
  /** Handler to delete selected objects */
  deleteSelectedObjects: () => void;
  /** Handler for floor selection */
  handleFloorSelect: (floorIndex: number) => void;
  /** Handler to add a new floor */
  handleAddFloor: () => void;
  /** Handler to change line thickness */
  handleLineThicknessChange: (thickness: number) => void;
  /** Handler to change line color */
  handleLineColorChange: (color: string) => void;
  /** Handler to open measurement guide */
  openMeasurementGuide: () => void;
  /** Fabric canvas reference */
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Context for the Canvas Controller
 * Provides access to canvas state and operations throughout the component tree
 */
const CanvasControllerContext = createContext<CanvasControllerContextValue | null>(null);

/**
 * Props for the CanvasController
 */
interface CanvasControllerProps {
  children: React.ReactNode;
  createGrid?: (canvas: FabricCanvas, existingGrid?: any[]) => any[];
}

/**
 * Create initial floor plan with all required properties
 * @returns {FloorPlan} A complete FloorPlan object with default values
 */
const createInitialFloorPlan = (): FloorPlan => {
  return createFloorPlan('floor-0', 'Ground Floor');
};

/**
 * Provider component for Canvas Controller context
 * Manages state and operations for the canvas
 * 
 * @param {object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element} Provider component
 */
export const CanvasControllerProvider: React.FC<CanvasControllerProps> = ({ children, createGrid }) => {
  // Canvas state
  const [tool, setTool] = useState<DrawingTool>(DrawingTool.SELECT);
  const [gia, setGia] = useState<number>(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([createInitialFloorPlan()]);
  const [currentFloor, setCurrentFloor] = useState<number>(INITIAL_FLOOR_INDEX);
  const [lineThickness, setLineThickness] = useState<number>(INITIAL_LINE_THICKNESS);
  const [lineColor, setLineColor] = useState<string>(DEFAULT_LINE_COLOR);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: DEFAULT_CANVAS_WIDTH,
    height: DEFAULT_CANVAS_HEIGHT
  });
  
  // References
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef({ past: [], future: [] });

  // Debug state
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    showDebugInfo: false,
    canvasInitialized: false,
    dimensionsSet: false,
    gridCreated: false,
    eventHandlersSet: false,
    brushInitialized: false,
    canvasReady: false,
    canvasCreated: false,
    canvasLoaded: false,
    canvasEventsRegistered: false,
    gridRendered: false,
    toolsInitialized: false,
    lastInitTime: 0,
    lastGridCreationTime: 0,
    gridObjectCount: 0,
    canvasDimensions: { width: 0, height: 0 },
    hasError: false,
    errorMessage: ""
  });
  
  // Initialize the canvas controller setup
  const setupResult = useCanvasControllerSetup({
    canvasDimensions: dimensions,
    tool,
    currentFloor,
    setZoomLevel,
    setDebugInfo,
    setHasError,
    setErrorMessage
  });

  // Initialize dependencies like grid, etc.
  const { gridLayerRef, createGrid: createGridFn } = useCanvasControllerDependencies({
    fabricCanvasRef,
    canvasRef,
    canvasDimensions: dimensions,
    debugInfo,
    setDebugInfo,
    setHasError,
    setErrorMessage,
    zoomLevel
  });

  // Initialize drawing state
  useCanvasControllerDrawingState({
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    tool,
    currentFloor,
    setFloorPlans,
    setGia,
    lineThickness,
    lineColor,
    deleteSelectedObjects: () => {
      if (fabricCanvasRef.current) {
        const canvas = fabricCanvasRef.current;
        const activeObjects = canvas.getActiveObjects();
        if (activeObjects.length > 0) {
          canvas.remove(...activeObjects);
          canvas.discardActiveObject();
          canvas.requestRenderAll();
          toast('Selected objects deleted');
        }
      }
    },
    setDrawingState: () => {},
    recalculateGIA: () => {
      // Recalculate GIA implementation
      console.log("Recalculating GIA");
    }
  });

  // Initialize tools
  const toolsResult = useCanvasControllerTools({
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
    createGrid: createGridFn
  });

  // Delete selected objects function
  const deleteSelectedObjects = () => {
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      const activeObjects = canvas.getActiveObjects();
      if (activeObjects.length > 0) {
        canvas.remove(...activeObjects);
        canvas.discardActiveObject();
        canvas.requestRenderAll();
        toast('Selected objects deleted');
      }
    }
  };
  
  // Floor selection function
  const handleFloorSelect = (floorIndex: number) => {
    if (floorIndex >= 0 && floorIndex < floorPlans.length) {
      setCurrentFloor(floorIndex);
      toast(`Switched to ${floorPlans[floorIndex].name}`);
    }
  };
  
  // Add floor function
  const handleAddFloor = () => {
    const newFloorIndex = floorPlans.length;
    const newFloor = createFloorPlan(`floor-${newFloorIndex}`, `Floor ${newFloorIndex}`);
    setFloorPlans([...floorPlans, newFloor]);
    toast(`Added new floor: ${newFloor.name}`);
  };
  
  // Line thickness change function
  const handleLineThicknessChange = (thickness: number) => {
    setLineThickness(thickness);
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.width = thickness;
    }
  };
  
  // Line color change function
  const handleLineColorChange = (color: string) => {
    setLineColor(color);
    if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = color;
    }
  };
  
  // Measurement guide function
  const openMeasurementGuide = () => {
    toast.info('Measurement guide coming soon');
  };

  // Initialize Fabric.js canvas when the component mounts
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Clean up any existing canvas
    if (fabricCanvasRef.current) {
      fabricCanvasRef.current.dispose();
    }
    
    // Create a new Fabric.js canvas
    const canvas = new FabricCanvas(canvasRef.current, {
      width: dimensions.width,
      height: dimensions.height,
      selection: true,
      preserveObjectStacking: true
    });
    
    // Set fabric canvas reference
    fabricCanvasRef.current = canvas;
    
    // Initialize free drawing brush
    if (canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    // Create grid if function is provided
    if (createGrid) {
      createGrid(canvas);
    }
    
    // Initialize tool mode
    if (tool === DrawingTool.DRAW) {
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
    }
    
    // Update debug info
    setDebugInfo(prev => ({
      ...prev,
      canvasInitialized: true,
      canvasCreated: true,
      dimensionsSet: true
    }));
    
    // Clean up function
    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, [dimensions.width, dimensions.height, createGrid]);

  // Update drawing mode when tool changes
  useEffect(() => {
    if (!fabricCanvasRef.current) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Set drawing mode based on the selected tool
    if (tool === DrawingTool.DRAW) {
      canvas.isDrawingMode = true;
    } else {
      canvas.isDrawingMode = false;
    }
    
    canvas.requestRenderAll();
  }, [tool]);

  // Update brush properties when lineColor or lineThickness changes
  useEffect(() => {
    if (!fabricCanvasRef.current || !fabricCanvasRef.current.freeDrawingBrush) return;
    
    const brush = fabricCanvasRef.current.freeDrawingBrush;
    brush.color = lineColor;
    brush.width = lineThickness;
  }, [lineColor, lineThickness]);
  
  /**
   * Handler functions that connect to the tool implementations
   */
  const handleToolChange = (newTool: DrawingTool): void => {
    if (toolsResult.handleToolChange) {
      toolsResult.handleToolChange(newTool);
    } else {
      setTool(newTool);
    }
  };
  
  const handleUndo = (): void => {
    if (toolsResult.handleUndo) {
      toolsResult.handleUndo();
    }
  };
  
  const handleRedo = (): void => {
    if (toolsResult.handleRedo) {
      toolsResult.handleRedo();
    }
  };
  
  const handleZoom = (direction: "in" | "out"): void => {
    if (toolsResult.handleZoom) {
      toolsResult.handleZoom(direction);
    }
  };
  
  const clearCanvas = (): void => {
    if (toolsResult.clearCanvas) {
      toolsResult.clearCanvas();
    }
  };
  
  const saveCanvas = (): void => {
    if (toolsResult.saveCanvas) {
      toolsResult.saveCanvas();
    }
  };
  
  const contextValue: CanvasControllerContextValue = {
    tool,
    setTool,
    gia,
    setGia,
    floorPlans,
    setFloorPlans,
    currentFloor,
    dimensions,
    lineThickness,
    lineColor,
    canvasRef,
    fabricCanvasRef,
    debugInfo,
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
    openMeasurementGuide
  };
  
  return (
    <CanvasControllerContext.Provider value={contextValue}>
      {children}
      <div 
        ref={canvasContainerRef}
        className="canvas-container relative bg-white shadow rounded-lg" 
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        <canvas 
          ref={canvasRef} 
          width={dimensions.width} 
          height={dimensions.height}
          className="border border-gray-200 rounded shadow-sm"
        />
        {debugInfo.hasError && (
          <div className="absolute inset-0 flex items-center justify-center bg-red-100/50">
            <p className="text-red-500 font-semibold p-4 bg-white rounded shadow">
              {debugInfo.errorMessage || "An error occurred with the canvas"}
            </p>
          </div>
        )}
      </div>
    </CanvasControllerContext.Provider>
  );
};

/**
 * Hook to access the Canvas Controller context
 * @param {Function} [createGridFn] - Optional function to create grid
 * @returns {CanvasControllerContextValue} Canvas controller context value
 * @throws {Error} If used outside of a CanvasControllerProvider
 */
export const useCanvasController = (createGridFn?: Function): CanvasControllerContextValue => {
  const context = useContext(CanvasControllerContext);
  if (!context) {
    throw new Error('useCanvasController must be used within a CanvasControllerProvider');
  }
  return context;
};
