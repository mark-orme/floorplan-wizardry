
import { useRef } from 'react';
import { Object as FabricObject } from 'fabric';
import { useCanvasInitialization } from './useCanvasInitialization';
import { useReliableGrid } from '../grid/useReliableGrid';
import { DebugInfoState, DEFAULT_DEBUG_STATE } from '@/types/core/DebugInfo';

interface CanvasDependenciesProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  width: number;
  height: number;
}

interface HistoryState {
  past: FabricObject[][];
  future: FabricObject[][];
}

export const useCanvasDependencies = ({ 
  canvasRef,
  width,
  height
}: CanvasDependenciesProps) => {
  const historyRef = useRef<HistoryState>({
    past: [],
    future: []
  });

  // Initialize canvas with error handling
  const { canvas, isInitialized, error } = useCanvasInitialization({
    canvasRef,
    width,
    height
  });

  // Initialize grid with reliability features
  const { isGridCreated, gridObjects, reinitializeGrid } = useReliableGrid({
    canvas,
    enabled: isInitialized
  });

  return {
    canvas,
    isInitialized,
    isGridCreated,
    error,
    historyRef,
    gridObjects,
    reinitializeGrid
  };
};
