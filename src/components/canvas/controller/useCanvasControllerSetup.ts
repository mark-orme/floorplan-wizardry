/**
 * Hook for setting up canvas controller
 * @module useCanvasControllerSetup
 */
import { useRef, useEffect } from 'react';
import * as fabric from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { FloorPlan } from '@/types/floorPlanTypes';
import { DrawingMode } from '@/constants/drawingModes';
import { asExtendedCanvas } from '@/utils/canvas/canvasTypeUtils';

/**
 * Props for useCanvasControllerSetup hook
 * @interface UseCanvasControllerSetupProps
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
  
  /** Current floor plans */
  floorPlans: FloorPlan[];
  
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
  floorPlans,
  setCanvas,
  onCanvasReady,
  onError,
  showGrid = true
}: UseCanvasControllerSetupProps) => {
  // Create a ref for the fabric canvas
  const fabricCanvasRef = useRef<ExtendedFabricCanvas | null>(null);
  
  // Create a ref for the grid layer
  const gridLayerRef = useRef<fabric.Object[]>([]);
  
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
      });
      
      // Cast to extended canvas for type safety
      const extendedCanvas = asExtendedCanvas(canvas);
      
      if (extendedCanvas) {
        fabricCanvasRef.current = extendedCanvas;
        setCanvas(extendedCanvas);
        
        // Call onCanvasReady callback
        if (onCanvasReady) {
          onCanvasReady(extendedCanvas);
        }
      }
      
      // Clean up
      return () => {
        canvas.dispose();
        fabricCanvasRef.current = null;
        setCanvas(null);
      };
    } catch (error) {
      console.error('Error initializing canvas:', error);
      if (onError && error instanceof Error) {
        onError(error);
      }
    }
  }, [canvasRef, width, height, setCanvas, onCanvasReady, onError]);
  
  // Return canvas refs and utility methods
  return {
    fabricCanvasRef,
    gridLayerRef,
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
