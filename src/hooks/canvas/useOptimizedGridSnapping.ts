import { useCallback, useRef } from 'react';
import { Canvas, Point } from 'fabric';
import { ExtendedFabricCanvas } from '@/types/canvas-types';
import { createSmoothEventHandler } from '@/utils/canvas/renderOptimizer';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

export const useOptimizedGridSnapping = (
  canvas: Canvas | ExtendedFabricCanvas | null, 
  snapToGrid: boolean = true
) => {
  const lastSnappedPoint = useRef<Point | null>(null);
  
  const snapToNearestGridPoint = useCallback((point: { x: number; y: number }) => {
    if (!snapToGrid || !point) return point;
    
    const gridSize = GRID_CONSTANTS.SMALL.SIZE;
    
    return {
      x: Math.round(point.x / gridSize) * gridSize,
      y: Math.round(point.y / gridSize) * gridSize
    };
  }, [snapToGrid]);
  
  const optimizedMouseMoveHandler = useCallback((options: { target: any; e: any }) => {
    if (!canvas || !snapToGrid || !options.target) return;
    
    const target = options.target;
    const pointer = canvas.getPointer(options.e);
    
    if (!pointer) return;
    
    const snappedPoint = snapToNearestGridPoint(pointer);
    
    if (lastSnappedPoint.current &&
      lastSnappedPoint.current.x === snappedPoint.x &&
      lastSnappedPoint.current.y === snappedPoint.y) {
      return;
    }
    
    target.set({
      left: snappedPoint.x - (target.width || 0) / 2,
      top: snappedPoint.y - (target.height || 0) / 2
    });
    
    lastSnappedPoint.current = new Point(snappedPoint.x, snappedPoint.y);
    
    canvas.requestRenderAll();
  }, [canvas, snapToGrid, snapToNearestGridPoint]);
  
  const attachOptimizedSnapping = useCallback(() => {
    if (!canvas) return;
    
    const smoothMouseMove = createSmoothEventHandler(optimizedMouseMoveHandler);
    
    canvas.on('object:moving', smoothMouseMove);
    
    return () => {
      canvas.off('object:moving', smoothMouseMove);
    };
  }, [canvas, optimizedMouseMoveHandler]);
  
  return { snapToNearestGridPoint };
};
