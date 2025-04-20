import { useState, useEffect, useCallback } from 'react';
import { Canvas as FabricCanvas, Line, Group } from 'fabric';
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/constants/drawingModes';

interface UseCanvasInteractionsProps {
  canvas: FabricCanvas | null;
  tool: DrawingMode;
  lineThickness: number;
  lineColor: string;
}

interface UseCanvasInteractionsResult {
  drawingState: {
    isDrawing: boolean;
    startPoint: Point | null;
    endPoint: Point | null;
  };
  currentZoom: number;
  toggleSnap: () => void;
  snapEnabled: boolean;
}

export const useCanvasInteractions = (
  canvas: FabricCanvas | null,
  tool: DrawingMode,
  lineThickness: number,
  lineColor: string
): UseCanvasInteractionsResult => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [endPoint, setEndPoint] = useState<Point | null>(null);
  const [snapEnabled, setSnapEnabled] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(1);

  useEffect(() => {
    if (!canvas) return;

    const handleObjectModified = () => {
      setCurrentZoom(canvas.getZoom());
    };

    canvas.on('object:modified', handleObjectModified);

    return () => {
      canvas.off('object:modified', handleObjectModified);
    };
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    const handleZoom = () => {
      setCurrentZoom(canvas.getZoom());
    };

    canvas.on('mouse:wheel', handleZoom);

    return () => {
      canvas.off('mouse:wheel', handleZoom);
    };
  }, [canvas]);

  useEffect(() => {
    if (!canvas) return;

    let line: Line | null = null;

    const handleMouseDown = (event: any) => {
      if (tool === DrawingMode.DRAW) {
        const pointer = canvas.getPointer(event.e);
        setIsDrawing(true);
        setStartPoint({ x: pointer.x, y: pointer.y });
        setEndPoint({ x: pointer.x, y: pointer.y });

        line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
          strokeWidth: lineThickness,
          stroke: lineColor,
          originX: 'center',
          originY: 'center',
          selectable: false,
          evented: false,
        });

        canvas.add(line);
      }
    };

    const handleMouseMove = (event: any) => {
      if (!isDrawing || !line) return;

      const pointer = canvas.getPointer(event.e);
      setEndPoint({ x: pointer.x, y: pointer.y });

      line.set({ x2: pointer.x, y2: pointer.y });
      canvas.renderAll();
    };

    const handleMouseUp = () => {
      if (isDrawing && line) {
        setIsDrawing(false);
        line.set({ evented: true, selectable: true });
        canvas.setActiveObject(line);
        canvas.renderAll();
      }
    };

    if (tool === DrawingMode.DRAW) {
      canvas.on('mouse:down', handleMouseDown);
      canvas.on('mouse:move', handleMouseMove);
      canvas.on('mouse:up', handleMouseUp);
    }

    return () => {
      canvas.off('mouse:down', handleMouseDown);
      canvas.off('mouse:move', handleMouseMove);
      canvas.off('mouse:up', handleMouseUp);
    };
  }, [canvas, isDrawing, lineColor, lineThickness, tool]);

  const toggleSnap = useCallback(() => {
    setSnapEnabled((prev) => !prev);
  }, []);

  return {
    drawingState: {
      isDrawing,
      startPoint,
      endPoint,
    },
    currentZoom,
    toggleSnap,
    snapEnabled,
  };
};
