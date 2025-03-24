
/**
 * Canvas Context for sharing canvas state across components
 * @module CanvasContext
 */
import { createContext, useContext, ReactNode } from 'react';
import { DrawingTool } from '@/hooks/useCanvasState';
import { DrawingState, Point } from '@/types/drawingTypes';

/**
 * Canvas Controller context value interface
 */
export interface CanvasContextValue {
  // Tool state
  tool: DrawingTool;
  setTool: (tool: DrawingTool) => void;
  
  // Measurement state
  gia: number;
  
  // Floor plans state
  floorPlans: any[];
  currentFloor: number;
  
  // Drawing state
  drawingState?: DrawingState;
  
  // Loading/error states
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string;
  
  // Debugging
  debugInfo: {
    canvasInitialized: boolean;
    gridCreated: boolean;
    dimensionsSet: boolean;
    brushInitialized: boolean;
  };
  
  // References
  canvasRef: React.RefObject<HTMLCanvasElement>;
  
  // Line settings
  lineThickness: number;
  lineColor: string;
  
  // Actions/handlers
  handleFloorSelect: (index: number) => void;
  handleAddFloor: () => void;
  handleToolChange: (tool: DrawingTool) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  handleZoom: (direction: "in" | "out") => void;
  clearCanvas: () => void;
  saveCanvas: () => void;
  handleLineThicknessChange: (thickness: number) => void;
  handleLineColorChange: (color: string) => void;
  handleRetry: () => void;
}

// Create the context with a null initial value
const CanvasContext = createContext<CanvasContextValue | null>(null);

/**
 * Props for the CanvasProvider component
 */
interface CanvasProviderProps {
  children: ReactNode;
  value: CanvasContextValue;
}

/**
 * Provider component for Canvas context
 * @param {CanvasProviderProps} props - Component props
 * @returns {JSX.Element} Provider component
 */
export const CanvasProvider = ({ children, value }: CanvasProviderProps) => {
  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
};

/**
 * Hook to use Canvas context
 * @returns {CanvasContextValue} Canvas context value
 * @throws {Error} If used outside CanvasProvider
 */
export const useCanvas = (): CanvasContextValue => {
  const context = useContext(CanvasContext);
  
  if (context === null) {
    throw new Error('useCanvas must be used within a CanvasProvider');
  }
  
  return context;
};
