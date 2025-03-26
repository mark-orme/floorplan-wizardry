
import { useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from "fabric";
import { DebugInfoState } from '@/types/debugTypes';

interface CanvasDependenciesProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

/**
 * Enhanced DebugInfoState with index signature support
 */
interface EnhancedDebugInfoState extends DebugInfoState {
  [key: string]: unknown;
}

export const useCanvasDependencies = ({ canvasRef }: CanvasDependenciesProps) => {
  // References
  const fabricCanvasRef = useRef<FabricCanvas | null>(null);
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
    canvasWidth: 0,
    canvasHeight: 0,
    loadTimes: {
      start: 0,
      initialized: 0,
      rendered: 0
    }
  });
  
  return {
    canvasRef,
    fabricCanvasRef,
    gridLayerRef,
    historyRef,
    debugInfo,
    setDebugInfo
  };
};
