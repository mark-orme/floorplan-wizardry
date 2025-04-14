
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import { GRID_CONSTANTS } from '@/constants/gridConstants';
import { useGridSnapping } from './canvas/useGridSnapping';
import logger from '@/utils/logger';

interface UseWallDrawingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  tool: DrawingMode;
  wallColor: string;
  wallThickness: number;
}

const STRAIGHTEN_THRESHOLD = 10; // Pixels
const STRAIGHT_ANGLE_THRESHOLD = Math.PI / 12; // 15 degrees

export const useWallDrawing = ({
  fabricCanvasRef,
  tool,
  wallColor,
  wallThickness
}: UseWallDrawingProps) => {
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentWall, setCurrentWall] = useState<Line | null>(null);
  const startPointRef = useRef<{ x: number, y: number } | null>(null);
  const measureTooltipRef = useRef<Text | null>(null);
  
  // Use the grid snapping hook
  const { snapPointToGrid, snapEventToGrid, snapLineToGrid } = useGridSnapping(fabricCanvasRef);
  
  const straightenLine = useCallback((line: Line) => {
    if (!line) return;
    
    const x1 = line.x1 || 0;
    const y1 = line.y1 || 0;
    const x2 = line.x2 || 0;
    const y2 = line.y2 || 0;
    
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    if (Math.abs(angle) < STRAIGHT_ANGLE_THRESHOLD || 
        Math.abs(angle - Math.PI) < STRAIGHT_ANGLE_THRESHOLD ||
        Math.abs(angle + Math.PI) < STRAIGHT_ANGLE_THRESHOLD) {
      line.set({ y2: y1 });
    } else if (
      Math.abs(angle - Math.PI/2) < STRAIGHT_ANGLE_THRESHOLD || 
      Math.abs(angle + Math.PI/2) < STRAIGHT_ANGLE_THRESHOLD
    ) {
      line.set({ x2: x1 });
    }
  }, []);
  
  const calculateDistance = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }, []);
  
  const updateMeasurementTooltip = useCallback((line: Line, canvas: FabricCanvas) => {
    if (!line) return;
    
    const x1 = line.x1 || 0;
    const y1 = line.y1 || 0;
    const x2 = line.x2 || 0;
    const y2 = line.y2 || 0;
    
    const distanceInPixels = calculateDistance(x1, y1, x2, y2);
    const distanceInMeters = (distanceInPixels / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
    
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - 15;
    
    if (!measureTooltipRef.current) {
      const tooltip = new Text(`${distanceInMeters}m`, {
        left: midX,
        top: midY,
        fontSize: 12,
        fill: wallColor,
        backgroundColor: 'rgba(255,255,255,0.7)',
        padding: 3,
        selectable: false,
        evented: false
      });
      
      canvas.add(tooltip);
      measureTooltipRef.current = tooltip;
    } else {
      measureTooltipRef.current.set({
        text: `${distanceInMeters}m`,
        left: midX,
        top: midY
      });
    }
    
    canvas.renderAll();
  }, [calculateDistance, wallColor]);
  
  const startDrawing = useCallback((e: any) => {
    if (!fabricCanvasRef.current || tool !== DrawingMode.WALL) return;
    
    logger.info("Starting wall drawing");
    const canvas = fabricCanvasRef.current;
    const snappedPoint = snapEventToGrid(e);
    
    if (!snappedPoint) return;
    
    const line = new Line([snappedPoint.x, snappedPoint.y, snappedPoint.x, snappedPoint.y], {
      stroke: wallColor,
      strokeWidth: wallThickness,
      selectable: true,
      evented: true,
      objectType: 'wall'
    });
    
    canvas.add(line);
    canvas.renderAll();
    
    setIsDrawing(true);
    setCurrentWall(line);
    startPointRef.current = snappedPoint;
  }, [fabricCanvasRef, tool, wallColor, wallThickness, snapEventToGrid]);
  
  const continueDrawing = useCallback((e: any) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentWall || tool !== DrawingMode.WALL) return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);
    
    if (!startPointRef.current) return;
    
    const { start, end } = snapLineToGrid(
      startPointRef.current, 
      { x: pointer.x, y: pointer.y }
    );
    
    currentWall.set({
      x2: end.x,
      y2: end.y
    });
    
    updateMeasurementTooltip(currentWall, canvas);
    
    canvas.renderAll();
  }, [fabricCanvasRef, isDrawing, currentWall, tool, snapLineToGrid, updateMeasurementTooltip]);
  
  const endDrawing = useCallback(() => {
    if (!fabricCanvasRef.current || !isDrawing || !currentWall) return;
    
    logger.info("Ending wall drawing");
    const canvas = fabricCanvasRef.current;
    
    straightenLine(currentWall);
    
    const x1 = currentWall.x1 || 0;
    const y1 = currentWall.y1 || 0;
    const x2 = currentWall.x2 || 0;
    const y2 = currentWall.y2 || 0;
    
    const distance = calculateDistance(x1, y1, x2, y2);
    
    if (distance > 5) {
      updateMeasurementTooltip(currentWall, canvas);
      
      canvas.fire('object:added', { target: currentWall });
      
      if (measureTooltipRef.current) {
        measureTooltipRef.current.set({
          backgroundColor: 'rgba(255,255,255,0.9)',
        });
        canvas.renderAll();
      }
      
      toast.success(`Wall created (${(distance / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2)}m)`);
    } else {
      canvas.remove(currentWall);
      if (measureTooltipRef.current) {
        canvas.remove(measureTooltipRef.current);
      }
    }
    
    setIsDrawing(false);
    setCurrentWall(null);
    startPointRef.current = null;
    measureTooltipRef.current = null;
  }, [fabricCanvasRef, isDrawing, currentWall, straightenLine, calculateDistance, updateMeasurementTooltip]);
  
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (tool === DrawingMode.WALL) {
      logger.info("Setting up wall drawing event handlers");
      canvas.on('mouse:down', startDrawing);
      canvas.on('mouse:move', continueDrawing);
      canvas.on('mouse:up', endDrawing);
      
      canvas.defaultCursor = 'crosshair';
      
      return () => {
        canvas.off('mouse:down', startDrawing);
        canvas.off('mouse:move', continueDrawing);
        canvas.off('mouse:up', endDrawing);
        canvas.defaultCursor = 'default';
      };
    } else {
      if (canvas.defaultCursor === 'crosshair' && tool !== DrawingMode.STRAIGHT_LINE && tool !== DrawingMode.DRAW) {
        canvas.defaultCursor = 'default';
      }
    }
  }, [fabricCanvasRef, tool, startDrawing, continueDrawing, endDrawing]);
  
  return {
    isDrawing,
    currentWall,
    startDrawing,
    continueDrawing,
    endDrawing
  };
};
