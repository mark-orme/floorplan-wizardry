
/**
 * Drawing context
 * Provides drawing state and operations to components
 * @module contexts/DrawingContext
 */
import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { DrawingMode } from "@/constants/drawingModes";
import { DrawingTool, DEFAULT_CANVAS_STATE } from "@/types/canvasStateTypes";

/**
 * Drawing context type
 * Defines the shape of the drawing context
 * 
 * @interface DrawingContextType
 */
interface DrawingContextType {
  // Tool state
  tool: DrawingTool;
  setTool: (tool: DrawingTool) => void;
  
  // Line properties
  lineColor: string;
  setLineColor: (color: string) => void;
  lineThickness: number;
  setLineThickness: (thickness: number) => void;
  
  // Grid settings
  snapToGrid: boolean;
  toggleSnapToGrid: () => void;
  
  // Undo/redo state
  canUndo: boolean;
  canRedo: boolean;
  setCanUndo: (canUndo: boolean) => void;
  setCanRedo: (canRedo: boolean) => void;
}

// Create context with default values
const DrawingContext = createContext<DrawingContextType | null>(null);

/**
 * Props for the DrawingProvider
 * 
 * @interface DrawingProviderProps
 */
interface DrawingProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for drawing context
 * Manages drawing tools, styles, and related state
 * 
 * @param {DrawingProviderProps} props - Provider props
 * @returns {React.FC} Provider component
 */
export const DrawingProvider: React.FC<DrawingProviderProps> = ({ children }) => {
  // Initialize with default state
  const [tool, setTool] = useState<DrawingTool>(DEFAULT_CANVAS_STATE?.tool || DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState(DEFAULT_CANVAS_STATE?.lineColor || "#000000");
  const [lineThickness, setLineThickness] = useState(DEFAULT_CANVAS_STATE?.lineThickness || 2);
  const [snapToGrid, setSnapToGrid] = useState<boolean>(DEFAULT_CANVAS_STATE?.snapToGrid || true);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setSnapToGrid(prev => !prev);
  }, []);
  
  // Tool change handler with side effects
  const handleToolChange = useCallback((newTool: DrawingTool) => {
    console.log(`Tool changed to: ${newTool}`);
    setTool(newTool);
  }, []);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    tool,
    setTool: handleToolChange,
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness,
    snapToGrid,
    toggleSnapToGrid,
    canUndo,
    canRedo,
    setCanUndo,
    setCanRedo
  }), [tool, lineColor, lineThickness, snapToGrid, canUndo, canRedo, toggleSnapToGrid, handleToolChange]);

  return (
    <DrawingContext.Provider value={contextValue}>
      {children}
    </DrawingContext.Provider>
  );
};

/**
 * Hook to access drawing context
 * 
 * @returns {DrawingContextType} Drawing context
 * @throws {Error} If used outside a DrawingProvider
 */
export const useDrawingContext = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  
  if (!context) {
    throw new Error("useDrawingContext must be used within a DrawingProvider");
  }
  
  return context;
};
