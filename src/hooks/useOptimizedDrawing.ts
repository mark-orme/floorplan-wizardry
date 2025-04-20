
import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, Path } from 'fabric';
import { Point } from '@/types/core/Point';

interface UseOptimizedDrawingProps {
  canvas: FabricCanvas | null;
  enabled: boolean;
  lineColor: string;
  lineThickness: number;
  saveCurrentState: () => void;
}

export const useOptimizedDrawing = ({
  canvas,
  enabled,
  lineColor,
  lineThickness,
  saveCurrentState
}: UseOptimizedDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentPath, setCurrentPath] = useState<Path | null>(null);

  const handlePointerDown = useCallback((event: any) => {
    if (!canvas || !enabled) return;

    const pointer = canvas.getPointer(event.e);
    const point: Point = { x: pointer.x, y: pointer.y };

    setIsDrawing(true);
    setStartPoint(point);

    const path = new Path(`M ${point.x} ${point.y} L ${point.x} ${point.y}`, {
      stroke: lineColor,
      strokeWidth: lineThickness,
      fill: null,
      originX: 'center',
      originY: 'center',
      selectable: false,
      evented: false,
      hasControls: false,
      hasBorders: false,
      lockMovementX: true,
      lockMovementY: true
    });

    canvas.add(path);
    setCurrentPath(path);
  }, [canvas, enabled, lineColor, lineThickness]);

  const handlePointerMove = useCallback((event: any) => {
    if (!canvas || !isDrawing || !startPoint || !currentPath) return;

    const pointer = canvas.getPointer(event.e);
    const point: Point = { x: pointer.x, y: pointer.y };

    const newPathData = `M ${startPoint.x} ${startPoint.y} L ${point.x} ${point.y}`;
    currentPath.set({ path: new Path(newPathData).path });
    canvas.requestRenderAll();
  }, [canvas, isDrawing, startPoint, currentPath]);

  const handlePointerUp = useCallback(() => {
    if (!canvas || !isDrawing || !currentPath) return;

    setIsDrawing(false);
    setStartPoint(null);
    setCurrentPath(null);
    saveCurrentState();
  }, [canvas, isDrawing, currentPath, saveCurrentState]);

  useEffect(() => {
    if (!canvas || !enabled) return;

    canvas.on('mouse:down', handlePointerDown);
    canvas.on('mouse:move', handlePointerMove);
    canvas.on('mouse:up', handlePointerUp);

    return () => {
      canvas.off('mouse:down', handlePointerDown);
      canvas.off('mouse:move', handlePointerMove);
      canvas.off('mouse:up', handlePointerUp);
    };
  }, [canvas, enabled, handlePointerDown, handlePointerMove, handlePointerUp]);

  return {
    isDrawing,
    startPoint,
    currentPath
  };
};
