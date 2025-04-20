
import { useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DebugInfoState, DEFAULT_DEBUG_STATE } from '@/types/core/DebugInfo';
import { useCanvasInitialization } from './useCanvasInitialization';

/**
 * Props interface for the useCanvasDependencies hook
 */
interface CanvasDependenciesProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width?: number;
  height?: number;
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * History state structure
 */
interface HistoryState {
  past: FabricObject[][];
  future: FabricObject[][];
}

/**
 * Hook that manages canvas dependencies and state
 */
export const useCanvasDependencies = ({ 
  canvasRef,
  width = 800,
  height = 600,
  fabricCanvasRef: externalFabricCanvasRef 
}: CanvasDependenciesProps) => {
  // References
  const internalFabricCanvasRef = useRef<FabricCanvas | null>(null);
  const fabricCanvasRef = externalFabricCanvasRef || internalFabricCanvasRef;
  const gridLayerRef = useRef<FabricObject[]>([]);
  const historyRef = useRef<HistoryState>({
    past: [],
    future: []
  });
  
  // Get the initialization state instead of directly using useCanvasInitialization
  const initResult = useCanvasInitialization();
  const { fabricCanvas } = initResult;
  
  // State initialization
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    ...DEFAULT_DEBUG_STATE,
    canvasDimensions: { width, height }
  });
  
  // Create a simple grid creation function
  const createGrid = (canvas: FabricCanvas): FabricObject[] => {
    console.log("Creating grid - placeholder implementation");
    // Create a simple grid implementation here
    const gridLines: FabricObject[] = [];
    
    // Return the grid objects
    return gridLines;
  };
  
  // Track if grid is created
  const [isGridCreated, setIsGridCreated] = useState(false);
  
  // Function to reinitialize grid
  const reinitializeGrid = () => {
    if (fabricCanvas) {
      gridLayerRef.current = createGrid(fabricCanvas);
      setIsGridCreated(true);
    }
  };
  
  return {
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    debugInfo,
    setDebugInfo,
    createGrid,
    canvas: fabricCanvas,
    isInitialized: !!fabricCanvas,
    error: initResult.canvasError,
    isGridCreated,
    gridObjects: gridLayerRef.current,
    reinitializeGrid
  };
};

export default useCanvasDependencies;
