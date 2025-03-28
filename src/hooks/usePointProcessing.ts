
/**
 * Hook for processing mouse/touch events into Points
 * @module usePointProcessing
 */
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { Point } from '@/types/core/Point';
import { DrawingTool } from '@/constants/drawingModes';

export interface UsePointProcessingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool?: DrawingTool;
}

export interface UsePointProcessingResult {
  processPoint: (e: MouseEvent | TouchEvent) => Point | null;
}

/**
 * Hook for processing DOM events into canvas points
 * @param props - Hook configuration
 * @returns Functions for processing points
 */
export const usePointProcessing = ({ 
  fabricCanvasRef
}: UsePointProcessingProps): UsePointProcessingResult => {
  
  /**
   * Process a mouse or touch event into a canvas point
   * @param e - Mouse or touch event
   * @returns Processed point or null if invalid
   */
  const processPoint = useCallback((e: MouseEvent | TouchEvent): Point | null => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return null;
    
    // Extract coordinates from event
    let clientX: number;
    let clientY: number;
    
    if ('touches' in e) {
      // Touch event
      if (e.touches.length === 0) {
        // Use changedTouches for touchend events
        if (!e.changedTouches || e.changedTouches.length === 0) {
          return null;
        }
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      } else {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      }
    } else {
      // Mouse event
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Convert to canvas coordinates
    const canvasElement = canvas.getElement();
    const rect = canvasElement.getBoundingClientRect();
    
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // Apply canvas transformations
    const point = canvas.getPointer({ clientX, clientY } as MouseEvent);
    
    return { x: point.x, y: point.y } as Point;
  }, [fabricCanvasRef]);
  
  return { processPoint };
};
