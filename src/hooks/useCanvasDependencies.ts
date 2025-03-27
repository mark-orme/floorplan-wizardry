import { useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DebugInfoState } from '@/types';

/**
 * Props interface for the useCanvasDependencies hook
 * @interface CanvasDependenciesProps
 */
interface CanvasDependenciesProps {
  /** Reference to the HTML canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  /** Optional external reference to the Fabric canvas instance */
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Enhanced DebugInfoState with index signature support
 * @interface EnhancedDebugInfoState
 * @extends DebugInfoState
 */
interface EnhancedDebugInfoState extends DebugInfoState {
  /** Index signature for dynamic property access */
  [key: string]: unknown;
}

/**
 * History state structure
 * @interface HistoryState
 */
interface HistoryState {
  /** Previous states */
  past: FabricObject[][];
  /** Future states for redo */
  future: FabricObject[][];
}

/**
 * Hook that manages canvas dependencies and state
 * Provides access to fabric canvas, grid, history, and debug information
 * 
 * @param {CanvasDependenciesProps} props - Hook properties
 * @returns {Object} Canvas dependencies and utility functions
 */
export const useCanvasDependencies = ({ canvasRef, fabricCanvasRef: externalFabricCanvasRef }: CanvasDependenciesProps) => {
  // References
  const internalFabricCanvasRef = useRef<FabricCanvas | null>(null);
  const fabricCanvasRef = externalFabricCanvasRef || internalFabricCanvasRef;
  const gridLayerRef = useRef<FabricObject[]>([]);
  const historyRef = useRef<HistoryState>({
    past: [],
    future: []
  });
  
  // State initialization
  const [debugInfo, setDebugInfo] = useState<EnhancedDebugInfoState>({
    showDebugInfo: false,
    canvasInitialized: false,
    dimensionsSet: false,
    gridCreated: false,
    brushInitialized: false,
    canvasCreated: false,
    canvasLoaded: false,
    canvasReady: false,
    canvasWidth: 0,
    canvasHeight: 0,
    lastInitTime: 0,
    lastGridCreationTime: 0,
    gridObjectCount: 0,
    canvasDimensions: { width: 0, height: 0 },
    hasError: false,
    errorMessage: "",
    performanceStats: {}
  });
  
  /**
   * Create grid function placeholder
   * This should be implemented or imported from the grid creation module
   * 
   * @param {FabricCanvas} canvas - The Fabric canvas instance
   * @returns {FabricObject[]} Created grid objects
   */
  const createGrid = (canvas: FabricCanvas): FabricObject[] => {
    // This is a placeholder - in a real implementation this would create the grid
    console.log("Creating grid - placeholder implementation");
    return gridLayerRef.current;
  };
  
  return {
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    debugInfo,
    setDebugInfo,
    createGrid
  };
};
