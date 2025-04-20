
import { useCallback } from 'react';
import { Canvas as FabricCanvas, Path } from 'fabric';
import { Point } from '@/types/core/Point';
import { DrawingMode } from '@/types/FloorPlan';

interface UsePathProcessingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
}

export const usePathProcessing = ({ fabricCanvasRef, tool }: UsePathProcessingProps) => {
  const processPath = useCallback((path: Path) => {
    if (!fabricCanvasRef.current) return;

    const canvas = fabricCanvasRef.current;

    if (tool === DrawingMode.WALL) {
      path.set({
        stroke: 'rgba(255,0,0,1)',
        fill: null,
        strokeWidth: 5,
        objectCaching: false,
        cornerStyle: 'circle',
        cornerColor: 'blue',
        dirty: true
      });
    }
    else if (tool === DrawingMode.ROOM) {
      path.set({
        stroke: 'rgba(0,255,0,1)',
        fill: null,
        strokeWidth: 5,
        objectCaching: false,
        cornerStyle: 'circle',
        cornerColor: 'blue',
        dirty: true
      });
    }
    else if (tool === DrawingMode.LINE) {
      path.set({
        stroke: 'rgba(0,0,255,1)',
        fill: null,
        strokeWidth: 5,
        objectCaching: false,
        cornerStyle: 'circle',
        cornerColor: 'blue',
        dirty: true
      });
    }
    else if (tool === DrawingMode.DRAW) {
      path.set({
        stroke: 'rgba(0,0,0,1)',
        fill: null,
        strokeWidth: 5,
        objectCaching: false,
        cornerStyle: 'circle',
        cornerColor: 'blue',
        dirty: true
      });
    }

    canvas.add(path);
    canvas.renderAll();
  }, [fabricCanvasRef, tool]);

  const simplifyPath = useCallback((points: Point[], tolerance: number = 5): Point[] => {
    if (points.length <= 2) {
      return points;
    }

    const simplified: Point[] = [points[0]];

    for (let i = 1; i < points.length - 1; i++) {
      const p1 = simplified[simplified.length - 1];
      const p2 = points[i];
      const p3 = points[i + 1];

      const dist = Math.abs((p2.y - p1.y) * (p3.x - p2.x) - (p2.x - p1.x) * (p3.y - p2.y));
      const segmentLength = Math.sqrt(Math.pow(p3.x - p1.x, 2) + Math.pow(p3.y - p1.y, 2));

      if ((dist / segmentLength) > tolerance) {
        simplified.push(p2);
      }
    }

    simplified.push(points[points.length - 1]);
    return simplified;
  }, []);

  const isToolMatch = useCallback((currentTool: DrawingMode, targetTool: DrawingMode): boolean => {
    return currentTool === targetTool;
  }, []);

  const isDrawingMode = useCallback(() => {
    return tool === DrawingMode.DRAW;
  }, [tool]);

  const isStraightLineMode = useCallback(() => {
    return tool === DrawingMode.STRAIGHT_LINE;
  }, [tool]);

  const isDrawing = useCallback(() => {
    return isDrawingMode() || isStraightLineMode();
  }, [isDrawingMode, isStraightLineMode]);

  const isSelectMode = useCallback(() => {
    return tool === DrawingMode.SELECT;
  }, [tool]);

  const isHandMode = useCallback(() => {
    return tool === DrawingMode.HAND;
  }, [tool]);

  const isEraserMode = useCallback(() => {
    return tool === DrawingMode.ERASER;
  }, [tool]);

  const isMeasureMode = useCallback(() => {
    return tool === DrawingMode.MEASURE;
  }, [tool]);

  const isWallMode = useCallback(() => {
    return tool === DrawingMode.WALL;
  }, [tool]);

  const isRoomMode = useCallback(() => {
    return tool === DrawingMode.ROOM;
  }, [tool]);

  const isLineMode = useCallback(() => {
    return tool === DrawingMode.LINE;
  }, [tool]);

  const isDrawMode = useCallback(() => {
    return tool === DrawingMode.DRAW;
  }, [tool]);

  const isCurrentTool = useCallback((targetTool: DrawingMode): boolean => {
    return tool === targetTool;
  }, [tool]);

  const isCurrentDrawingTool = useCallback((): boolean => {
    return tool === DrawingMode.DRAW;
  }, [tool]);

  return {
    processPath,
    simplifyPath,
    isToolMatch,
    isDrawingMode,
    isStraightLineMode,
    isDrawing,
    isSelectMode,
    isHandMode,
    isEraserMode,
    isMeasureMode,
    isWallMode,
    isRoomMode,
    isLineMode,
    isDrawMode,
    isCurrentTool,
    isCurrentDrawingTool
  };
};
