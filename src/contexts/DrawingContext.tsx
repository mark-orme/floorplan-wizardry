
import React, { createContext, useContext, useMemo, useState, useCallback } from "react";
import { DrawingTool } from "@/types/drawingTypes";
import { DEFAULT_CANVAS_STATE } from "@/hooks/useCanvasState";

/**
 * Drawing context type
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
 */
interface DrawingProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for drawing context
 * Manages drawing tools, styles, and related state
 */
export const DrawingProvider: React.FC<DrawingProviderProps> = ({ children }) => {
  // Initialize with default state
  const [tool, setTool] = useState<DrawingTool>(DEFAULT_CANVAS_STATE.tool);
  const [lineColor, setLineColor] = useState(DEFAULT_CANVAS_STATE.lineColor);
  const [lineThickness, setLineThickness] = useState(DEFAULT_CANVAS_STATE.lineThickness);
  const [snapToGrid, setSnapToGrid] = useState(DEFAULT_CANVAS_STATE.snapToGrid);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  
  // Toggle snap to grid
  const toggleSnapToGrid = useCallback(() => {
    setSnapToGrid(prev => !prev);
  }, []);
  
  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    tool,
    setTool,
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
  }), [tool, lineColor, lineThickness, snapToGrid, canUndo, canRedo, toggleSnapToGrid]);

  return (
    <DrawingContext.Provider value={contextValue}>
      {children}
    </DrawingContext.Provider>
  );
};

/**
 * Hook to access drawing context
 * @returns {DrawingContextType} Drawing context
 */
export const useDrawingContext = (): DrawingContextType => {
  const context = useContext(DrawingContext);
  
  if (!context) {
    throw new Error("useDrawingContext must be used within a DrawingProvider");
  }
  
  return context;
};
