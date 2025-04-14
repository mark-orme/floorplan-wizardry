
import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas as FabricCanvas, Line, Text } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';
import { GRID_CONSTANTS } from '@/constants/gridConstants';

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
  const measureTooltipRef = useRef<any>(null);
  
  // Straighten a line by snapping to horizontal or vertical if close enough
  const straightenLine = useCallback((line: Line) => {
    if (!line) return;
    
    const x1 = line.x1 || 0;
    const y1 = line.y1 || 0;
    const x2 = line.x2 || 0;
    const y2 = line.y2 || 0;
    
    // Calculate angle
    const angle = Math.atan2(y2 - y1, x2 - x1);
    
    // Check if close to horizontal or vertical
    if (Math.abs(angle) < STRAIGHT_ANGLE_THRESHOLD || 
        Math.abs(angle - Math.PI) < STRAIGHT_ANGLE_THRESHOLD ||
        Math.abs(angle + Math.PI) < STRAIGHT_ANGLE_THRESHOLD) {
      // Horizontal line
      line.set({ y2: y1 });
    } else if (
      Math.abs(angle - Math.PI/2) < STRAIGHT_ANGLE_THRESHOLD || 
      Math.abs(angle + Math.PI/2) < STRAIGHT_ANGLE_THRESHOLD
    ) {
      // Vertical line
      line.set({ x2: x1 });
    }
  }, []);
  
  // Calculate distance between two points
  const calculateDistance = useCallback((x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }, []);
  
  // Update measurement tooltip
  const updateMeasurementTooltip = useCallback((line: Line, canvas: FabricCanvas) => {
    if (!line) return;
    
    const x1 = line.x1 || 0;
    const y1 = line.y1 || 0;
    const x2 = line.x2 || 0;
    const y2 = line.y2 || 0;
    
    // Calculate distance in pixels and convert to meters
    const distanceInPixels = calculateDistance(x1, y1, x2, y2);
    const distanceInMeters = (distanceInPixels / GRID_CONSTANTS.PIXELS_PER_METER).toFixed(2);
    
    // Create or update tooltip position
    const midX = (x1 + x2) / 2;
    const midY = (y1 + y2) / 2 - 15; // Position above line
    
    if (!measureTooltipRef.current) {
      // Create new tooltip
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
      // Update existing tooltip
      measureTooltipRef.current.set({
        text: `${distanceInMeters}m`,
        left: midX,
        top: midY
      });
    }
    
    canvas.renderAll();
  }, [calculateDistance, wallColor]);
  
  // Start drawing a wall
  const startDrawing = useCallback((e: any) => {
    if (!fabricCanvasRef.current || tool !== DrawingMode.WALL) return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);
    
    // Create a new line
    const line = new Line([pointer.x, pointer.y, pointer.x, pointer.y], {
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
    startPointRef.current = pointer;
  }, [fabricCanvasRef, tool, wallColor, wallThickness]);
  
  // Continue drawing the wall
  const continueDrawing = useCallback((e: any) => {
    if (!fabricCanvasRef.current || !isDrawing || !currentWall || tool !== DrawingMode.WALL) return;
    
    const canvas = fabricCanvasRef.current;
    const pointer = canvas.getPointer(e.e);
    
    // Update the end point of the line
    currentWall.set({
      x2: pointer.x,
      y2: pointer.y
    });
    
    // Temporarily straighten line during drawing for preview
    straightenLine(currentWall);
    
    // Update measurement tooltip
    updateMeasurementTooltip(currentWall, canvas);
    
    canvas.renderAll();
  }, [fabricCanvasRef, isDrawing, currentWall, tool, straightenLine, updateMeasurementTooltip]);
  
  // End drawing the wall
  const endDrawing = useCallback(() => {
    if (!fabricCanvasRef.current || !isDrawing || !currentWall) return;
    
    const canvas = fabricCanvasRef.current;
    
    // Straighten the line if needed
    straightenLine(currentWall);
    
    // Calculate final length
    const x1 = currentWall.x1 || 0;
    const y1 = currentWall.y1 || 0;
    const x2 = currentWall.x2 || 0;
    const y2 = currentWall.y2 || 0;
    
    const distance = calculateDistance(x1, y1, x2, y2);
    
    // Only keep walls with meaningful length
    if (distance > 5) {
      // Update final measurement tooltip
      updateMeasurementTooltip(currentWall, canvas);
      
      // Fire object:added event for history tracking
      canvas.fire('object:added', { target: currentWall });
      
      // Keep measurement tooltip permanently
      if (measureTooltipRef.current) {
        measureTooltipRef.current.set({
          backgroundColor: 'rgba(255,255,255,0.9)',
        });
        canvas.renderAll();
      }
      
      toast.success('Wall created');
    } else {
      // Remove too short walls
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
  
  // Set up event listeners
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    if (tool === DrawingMode.WALL) {
      canvas.on('mouse:down', startDrawing);
      canvas.on('mouse:move', continueDrawing);
      canvas.on('mouse:up', endDrawing);
      
      // Set appropriate cursor
      canvas.defaultCursor = 'crosshair';
      
      return () => {
        canvas.off('mouse:down', startDrawing);
        canvas.off('mouse:move', continueDrawing);
        canvas.off('mouse:up', endDrawing);
        canvas.defaultCursor = 'default';
      };
    } else {
      // Reset cursor when switching away from wall tool
      if (canvas.defaultCursor === 'crosshair') {
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
