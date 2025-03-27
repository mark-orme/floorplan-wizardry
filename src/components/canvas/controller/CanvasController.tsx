import React, { createContext, useContext, useState, useRef } from 'react';
import { DrawingMode, DrawingTool } from '@/constants/drawingModes';
import { FloorPlan } from '@/types/floorPlanTypes';
import { DebugInfoState } from '@/types/core/DebugInfo';
import { toast } from 'sonner';
import { createFloorPlan } from '@/utils/floorPlanUtils';

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
  handleZoom: (zoomLevel: number) => void;
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
}

/**
 * Context for the Canvas Controller
 * Provides access to canvas state and operations throughout the component tree
 */
const CanvasControllerContext = createContext<CanvasControllerContextValue | null>(null);

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
export const CanvasControllerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tool, setTool] = useState<DrawingTool>('select');
  const [gia, setGia] = useState<number>(0);
  const [floorPlans, setFloorPlans] = useState<FloorPlan[]>([createInitialFloorPlan()]);
  const [currentFloor, setCurrentFloor] = useState<number>(INITIAL_FLOOR_INDEX);
  const [lineThickness, setLineThickness] = useState<number>(INITIAL_LINE_THICKNESS);
  const [lineColor, setLineColor] = useState<string>(DEFAULT_LINE_COLOR);
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
    errorMessage: "",
    performanceStats: {}
  });
  
  const [dimensions, setDimensions] = useState<{ width: number; height: number }>({
    width: DEFAULT_CANVAS_WIDTH,
    height: DEFAULT_CANVAS_HEIGHT
  });
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  /**
   * Handles changing the active drawing tool
   * @param {DrawingTool} newTool - The tool to switch to
   */
  const handleToolChange = (newTool: DrawingTool) => {
    setTool(newTool);
    toast(`Tool changed to ${newTool}`);
  };
  
  /**
   * Handles undo operation
   */
  const handleUndo = () => {
    console.log('Undo action');
    toast('Undo action');
  };
  
  /**
   * Handles redo operation
   */
  const handleRedo = () => {
    console.log('Redo action');
    toast('Redo action');
  };
  
  /**
   * Handles zoom level changes
   * @param {number} zoomLevel - The zoom level to apply
   */
  const handleZoom = (zoomLevel: number) => {
    console.log('Zoom level changed to', zoomLevel);
  };
  
  /**
   * Clears the canvas content
   */
  const clearCanvas = () => {
    console.log('Canvas cleared');
    toast('Canvas cleared');
  };
  
  /**
   * Saves the canvas content
   */
  const saveCanvas = () => {
    console.log('Canvas saved');
    toast('Canvas saved');
  };
  
  /**
   * Deletes selected objects from the canvas
   */
  const deleteSelectedObjects = () => {
    console.log('Selected objects deleted');
    toast('Selected objects deleted');
  };
  
  /**
   * Handles floor selection
   * @param {number} floorIndex - Index of the floor to select
   */
  const handleFloorSelect = (floorIndex: number) => {
    setCurrentFloor(floorIndex);
    toast(`Floor ${floorIndex + 1} selected`);
  };
  
  /**
   * Handles adding a new floor
   */
  const handleAddFloor = () => {
    setFloorPlans(prev => {
      const newFloorPlans = [...prev];
      const newFloorIndex = newFloorPlans.length;
      
      const newFloorPlan = createFloorPlan(
        `floor-${newFloorIndex}`,
        `Floor ${newFloorIndex + 1}`
      );
      
      newFloorPlans.push(newFloorPlan);
      return newFloorPlans;
    });
    toast('New floor added');
  };
  
  /**
   * Handles changing line thickness
   * @param {number} thickness - The new thickness to apply
   */
  const handleLineThicknessChange = (thickness: number) => {
    setLineThickness(thickness);
  };
  
  /**
   * Handles changing line color
   * @param {string} color - The new color to apply
   */
  const handleLineColorChange = (color: string) => {
    setLineColor(color);
  };
  
  /**
   * Opens the measurement guide
   */
  const openMeasurementGuide = () => {
    toast('Measurement guide opened');
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
    </CanvasControllerContext.Provider>
  );
};

/**
 * Hook to access the Canvas Controller context
 * @returns {CanvasControllerContextValue} Canvas controller context value
 * @throws {Error} If used outside of a CanvasControllerProvider
 */
export const useCanvasController = () => {
  const context = useContext(CanvasControllerContext);
  if (!context) {
    throw new Error('useCanvasController must be used within a CanvasControllerProvider');
  }
  return context;
};
