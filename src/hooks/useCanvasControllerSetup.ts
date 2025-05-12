
import { useCallback, useEffect, useState } from 'react';
import { Canvas } from 'fabric';
import { toast } from 'sonner';

interface UseCanvasControllerSetupProps {
  canvasRef: React.MutableRefObject<HTMLCanvasElement | null>;
  fabricCanvasRef: React.MutableRefObject<Canvas | null>;
  width?: number;
  height?: number;
}

export interface UseCanvasGridOptions {
  fabricCanvas?: Canvas;
  isVisible?: boolean;
  setVisible?: (visible: boolean) => void;
}

export interface GridState {
  isVisible: boolean;
  gridSize: number;
  showGrid: () => void;
  hideGrid: () => void;
  toggleGrid: () => void;
  updateGridSize: (size: number) => void;
  gridLines: any[];
  setVisible?: (visible: boolean) => void;
}

export const useCanvasControllerSetup = ({
  canvasRef,
  fabricCanvasRef,
  width = 800,
  height = 600
}: UseCanvasControllerSetupProps) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Grid state
  const [gridState, setGridState] = useState<GridState>({
    isVisible: true,
    gridSize: 20,
    showGrid: () => setGridState(prev => ({ ...prev, isVisible: true })),
    hideGrid: () => setGridState(prev => ({ ...prev, isVisible: false })),
    toggleGrid: () => setGridState(prev => ({ ...prev, isVisible: !prev.isVisible })),
    updateGridSize: (size) => setGridState(prev => ({ ...prev, gridSize: size })),
    gridLines: [],
    setVisible: (visible) => setGridState(prev => ({ ...prev, isVisible: visible }))
  });

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current || isInitialized) return;

    try {
      // Create Fabric.js canvas instance
      const canvas = new Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#FFFFFF'
      });

      // Set up reference
      fabricCanvasRef.current = canvas;

      // Setup grid with properly typed options
      setupGrid({
        fabricCanvas: canvas,
        isVisible: gridState.isVisible,
        setVisible: gridState.setVisible
      });

      // Mark as initialized
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
      setErrorMessage(error instanceof Error ? error.message : 'Unknown error initializing canvas');
      toast.error('Failed to initialize canvas');
    }
  }, [canvasRef, fabricCanvasRef, width, height, isInitialized, gridState.isVisible]);

  // Setup grid function
  const setupGrid = useCallback((options: UseCanvasGridOptions) => {
    const canvas = options.fabricCanvas;
    if (!canvas) return;

    // Grid setup logic here
    console.log('Setting up grid with visibility:', options.isVisible);
  }, []);

  return {
    isInitialized,
    errorMessage,
    gridState
  };
};
