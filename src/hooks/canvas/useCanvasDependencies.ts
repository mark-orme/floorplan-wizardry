
import { useRef, useState } from 'react';
import { Canvas as FabricCanvas, Object as FabricObject } from 'fabric';
import { createGridLayer } from '@/utils/grid/gridCreator';
import { DebugInfoState, DEFAULT_DEBUG_STATE } from '@/types/core/DebugInfo';

interface CanvasDependenciesProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  fabricCanvasRef?: React.MutableRefObject<FabricCanvas | null>;
}

interface HistoryState {
  past: FabricObject[][];
  future: FabricObject[][];
}

export const useCanvasDependencies = ({ 
  canvasRef, 
  fabricCanvasRef: externalFabricCanvasRef 
}: CanvasDependenciesProps) => {
  const internalFabricCanvasRef = useRef<FabricCanvas | null>(null);
  const fabricCanvasRef = externalFabricCanvasRef || internalFabricCanvasRef;
  const gridLayerRef = useRef<FabricObject[]>([]);
  const historyRef = useRef<HistoryState>({
    past: [],
    future: []
  });
  
  const [debugInfo, setDebugInfo] = useState<DebugInfoState>({
    ...DEFAULT_DEBUG_STATE,
    canvasDimensions: { width: 0, height: 0 }
  });

  // Create a wrapper function to match the expected signature
  const createGrid = (canvas: FabricCanvas): FabricObject[] => {
    if (!canvas) return [];
    
    try {
      // Use the existing createGridLayer function
      return createGridLayer(
        canvas, 
        gridLayerRef, 
        { width: canvas.width || 800, height: canvas.height || 600 }, 
        setDebugInfo
      );
    } catch (error) {
      console.error('Error creating grid:', error);
      return [];
    }
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
