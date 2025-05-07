
/**
 * Line events utilities
 * @module hooks/straightLineTool/lineEvents
 */
import { Canvas as FabricCanvas, Line } from 'fabric';
import { Point } from '@/types/core/Point';

/**
 * Register line creation event
 * @param canvas Fabric canvas
 * @param line Line object
 * @param start Start point
 * @param end End point
 */
export function registerLineCreation(
  canvas: FabricCanvas | null,
  line: Line | null,
  start: Point,
  end: Point
): void {
  if (!canvas || !line) return;
  
  // Set custom properties for the line
  line.set({
    data: {
      type: 'straight-line',
      startPoint: start,
      endPoint: end,
      createdAt: new Date().toISOString()
    }
  });
  
  // Fire a custom event - check if fire exists before calling
  if (canvas.fire) {
    canvas.fire('object:created' as any, { target: line });
  }
}

/**
 * Handle line selection event
 * @param canvas Fabric canvas
 * @param callback Selection callback
 * @returns Cleanup function
 */
export function handleLineSelection(
  canvas: FabricCanvas | null,
  callback: (line: Line) => void
): () => void {
  if (!canvas) return () => {};
  
  const selectionHandler = (event: any) => {
    const target = event.target;
    
    if (target && target.type === 'line') {
      callback(target as Line);
    }
  };
  
  canvas.on('selection:created', selectionHandler);
  canvas.on('selection:updated', selectionHandler);
  
  return () => {
    canvas.off('selection:created', selectionHandler);
    canvas.off('selection:updated', selectionHandler);
  };
}
