
import { useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DebugInfoState } from '@/types/debugTypes';

interface CanvasDependenciesProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
}

/**
 * Enhanced DebugInfoState with index signature support
 */
interface EnhancedDebugInfoState extends DebugInfoState {
  [key: string]: unknown;
}

export const useCanvasDependencies = ({ canvasRef, fabricCanvasRef: externalFabricCanvasRef }: CanvasDependenciesProps) => {
  // References
  const internalFabricCanvasRef = useRef<FabricCanvas | null>(null);
  const fabricCanvasRef = externalFabricCanvasRef || internalFabricCanvasRef;
  const gridLayerRef = useRef<FabricObject[]>([]);
  const historyRef = useRef<{past: FabricObject[][], future: FabricObject[][]}>({
    past: [],
    future: []
  });
  
  // State initialization
  const [debugInfo, setDebugInfo] = useState<EnhancedDebugInfoState>({
    canvasInitialized: false,
    gridCreated: false,
    dimensionsSet: false,
    brushInitialized: false,
    canvasCreated: false,
    canvasLoaded: false,
    canvasReady: false,
    canvasWidth: 0,
    canvasHeight: 0,
    lastInitTime: 0,
    lastGridCreationTime: 0
  });
  
  /**
   * Create grid function placeholder
   * This should be implemented or imported from the grid creation module
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
