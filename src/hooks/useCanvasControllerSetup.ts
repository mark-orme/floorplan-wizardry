
/**
 * Hook for setting up canvas controller
 */
import { useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { DrawingMode } from '@/constants/drawingModes';
import { useCanvasGrid } from './useCanvasGrid';
import { useSnapToGrid } from './useSnapToGrid';
import logger from '@/utils/logger';

/**
 * Props for useCanvasControllerSetup hook
 */
interface UseCanvasControllerSetupProps {
  /** Canvas reference */
  canvasRef: React.RefObject<HTMLCanvasElement>;
  
  /** Width of the canvas */
  width: number;
  
  /** Height of the canvas */
  height: number;
  
  /** Current drawing tool */
  tool: DrawingMode;
  
  /** Line color for drawing */
  lineColor: string;
  
  /** Line thickness for drawing */
  lineThickness: number;
  
  /** Function to set the canvas */
  setCanvas: React.Dispatch<React.SetStateAction<ExtendedFabricCanvas | null>>;
  
  /** Function to handle canvas ready state */
  onCanvasReady?: (canvas: ExtendedFabricCanvas) => void;
  
  /** Function to handle canvas error */
  onError?: (error: Error) => void;
  
  /** Flag to show grid */
  showGrid?: boolean;
}

/**
 * Hook for setting up canvas controller
 * @param props - Hook props
 * @returns Canvas references and utility methods
 */
export const useCanvasControllerSetup = ({
  canvasRef,
  width,
  height,
  tool,
  lineColor,
  lineThickness,
  setCanvas,
  onCanvasReady,
  onError,
  showGrid = true
}: UseCanvasControllerSetupProps) => {
  // Create a ref for the fabric canvas
  const fabricCanvasRef = useRef<any>(null);
  
  // Create a ref for the grid layer
  const gridLayerRef = useRef<fabric.Object[]>([]);
  
  // Use canvas grid hook with additional methods
  const useCanvasGridResult = useCanvasGrid({
    fabricCanvasRef
  });
  
  // Get snap to grid functionality
  const { snapPointToGrid, snapLineToGrid } = useSnapToGrid();
  
  // Add missing methods for canvas grid
  const toggleGridVisibility = () => {
    useCanvasGridResult.setVisible(prev => !prev);
    
    // Update grid visibility on the canvas
    if (fabricCanvasRef.current) {
      const canvas = fabricCanvasRef.current;
      gridLayerRef.current.forEach(obj => {
        obj.set('visible', useCanvasGridResult.visible);
      });
      canvas.renderAll();
    }
  };
  
  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    
    try {
      // Create canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        width,
        height,
        backgroundColor: '#ffffff',
        selection: true,
        renderOnAddRemove: true
      }) as unknown as ExtendedFabricCanvas;
      
      if (canvas) {
        canvas.skipOffscreen = true;
      }
      
      fabricCanvasRef.current = canvas;
      setCanvas(canvas);
      
      // Create grid if needed
      if (showGrid) {
        gridLayerRef.current = useCanvasGridResult.createGrid(canvas);
      }
      
      // Call onCanvasReady callback
      if (onCanvasReady) {
        onCanvasReady(canvas);
      }
      
      // Clean up
      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
        setCanvas(null);
      };
    } catch (error) {
      logger.error('Error initializing canvas:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [canvasRef, width, height, setCanvas, onCanvasReady, onError, showGrid, useCanvasGridResult]);
  
  // Return canvas refs and utility methods
  return {
    fabricCanvasRef,
    gridLayerRef,
    toggleGridVisibility,
    snapToGrid: snapPointToGrid,
    snapLineToGrid,
    useCanvasGridResult,
    clearCanvas: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      canvas.clear();
      canvas.renderAll();
    },
    resetView: () => {
      const canvas = fabricCanvasRef.current;
      if (!canvas) return;
      
      if (canvas.viewportTransform) {
        canvas.viewportTransform = [ 1, 0, 0, 1, 0, 0 ];
      }
      canvas.renderAll();
    }
  };
};

export default useCanvasControllerSetup;
