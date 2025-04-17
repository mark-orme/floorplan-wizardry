
import { useCallback, useRef, useState, useEffect } from 'react';
import { Canvas as FabricCanvas, Path as FabricPath } from 'fabric';
import { Point } from '@/types/core/Point';
import { simplifyPath, smoothPath } from '@/utils/geometry/pathProcessing';
import { isStraightPath, straightenPath } from '@/utils/geometry/pathStraightening';

interface UseFreehandDrawingPolishProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  autoStraighten?: boolean;
  simplificationThreshold?: number;
  brushPreviewSize?: number;
  snapToGrid?: boolean;
  gridSize?: number;
}

export const useFreehandDrawingPolish = ({
  fabricCanvasRef,
  autoStraighten = true,
  simplificationThreshold = 2.5,
  brushPreviewSize = 8,
  snapToGrid = true,
  gridSize = 20
}: UseFreehandDrawingPolishProps) => {
  const brushCursorRef = useRef<HTMLDivElement | null>(null);
  const [lineWidth, setLineWidth] = useState(2);
  const [lineColor, setLineColor] = useState('#000000');
  const [isDrawing, setIsDrawing] = useState(false);
  
  // Initialize brush cursor
  useEffect(() => {
    if (brushCursorRef.current) return;
    
    // Create brush cursor element
    const cursorElement = document.createElement('div');
    cursorElement.className = 'brush-preview-cursor';
    cursorElement.style.position = 'absolute';
    cursorElement.style.pointerEvents = 'none';
    cursorElement.style.borderRadius = '50%';
    cursorElement.style.transform = 'translate(-50%, -50%)';
    cursorElement.style.zIndex = '1000';
    cursorElement.style.width = `${brushPreviewSize}px`;
    cursorElement.style.height = `${brushPreviewSize}px`;
    cursorElement.style.border = `1px solid #ffffff`;
    cursorElement.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.2)';
    cursorElement.style.backgroundColor = lineColor;
    cursorElement.style.opacity = '0.6';
    cursorElement.style.display = 'none';
    
    // Add to document
    document.body.appendChild(cursorElement);
    brushCursorRef.current = cursorElement;
    
    return () => {
      if (brushCursorRef.current) {
        document.body.removeChild(brushCursorRef.current);
        brushCursorRef.current = null;
      }
    };
  }, [brushPreviewSize, lineColor]);
  
  // Update cursor size and color when drawing properties change
  useEffect(() => {
    if (!brushCursorRef.current) return;
    
    const cursor = brushCursorRef.current;
    cursor.style.width = `${lineWidth > 3 ? lineWidth : brushPreviewSize}px`;
    cursor.style.height = `${lineWidth > 3 ? lineWidth : brushPreviewSize}px`;
    cursor.style.backgroundColor = lineColor;
  }, [lineWidth, lineColor, brushPreviewSize]);
  
  // Show/hide brush cursor based on drawing state
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !brushCursorRef.current) return;
    
    const cursor = brushCursorRef.current;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!cursor) return;
      
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
    
    const handleMouseEnter = () => {
      if (cursor) cursor.style.display = 'block';
    };
    
    const handleMouseLeave = () => {
      if (cursor) cursor.style.display = 'none';
    };
    
    const canvasEl = canvas.getElement();
    
    canvasEl.addEventListener('mousemove', handleMouseMove);
    canvasEl.addEventListener('mouseenter', handleMouseEnter);
    canvasEl.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      canvasEl.removeEventListener('mousemove', handleMouseMove);
      canvasEl.removeEventListener('mouseenter', handleMouseEnter);
      canvasEl.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [fabricCanvasRef]);
  
  // Initialize path creation hook
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    // Store original brush width and color
    setLineWidth(canvas.freeDrawingBrush.width);
    setLineColor(canvas.freeDrawingBrush.color.toString());
    
    // Hook into path created event
    const handlePathCreated = (e: any) => {
      const path = e.path as FabricPath;
      processPath(path);
    };
    
    canvas.on('path:created', handlePathCreated);
    
    return () => {
      canvas.off('path:created', handlePathCreated);
    };
  }, [fabricCanvasRef]);
  
  // Process path with simplification and straightening
  const processPath = useCallback((path: FabricPath) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !path || !path.path) return;
    
    // Extract points from path data
    const points: Point[] = [];
    const pathData = path.path;
    
    for (let i = 0; i < pathData.length; i++) {
      const cmd = pathData[i];
      if (cmd[0] === 'L' || cmd[0] === 'M') {
        points.push({ x: cmd[1], y: cmd[2] });
      }
    }
    
    // Skip if not enough points
    if (points.length < 3) return;
    
    // Check if it's approximately a straight line
    if (autoStraighten && isStraightPath(points)) {
      // Convert to straight line
      const { start, end } = straightenPath(points, snapToGrid, gridSize);
      
      // Remove original path
      canvas.remove(path);
      
      // Create a new line
      const line = new fabric.Line(
        [start.x, start.y, end.x, end.y],
        {
          stroke: path.stroke,
          strokeWidth: path.strokeWidth,
          selectable: true,
          evented: true
        }
      );
      
      // Add to canvas
      canvas.add(line);
      canvas.renderAll();
      return;
    }
    
    // Apply path simplification
    const simplifiedPoints = simplifyPath(points, simplificationThreshold);
    
    // Apply path smoothing for more natural curves
    const smoothedPoints = smoothPath(simplifiedPoints);
    
    // Create a new path data structure with simplified points
    const newPathData: any[] = [];
    
    // Start with a move command
    if (smoothedPoints.length > 0) {
      newPathData.push(['M', smoothedPoints[0].x, smoothedPoints[0].y]);
      
      // Add line commands for the rest
      for (let i = 1; i < smoothedPoints.length; i++) {
        newPathData.push(['L', smoothedPoints[i].x, smoothedPoints[i].y]);
      }
    }
    
    // Apply the new path data
    path.path = newPathData;
    canvas.renderAll();
  }, [fabricCanvasRef, autoStraighten, simplificationThreshold, snapToGrid, gridSize]);
  
  return {
    brushCursorRef,
    isDrawing,
    setIsDrawing,
    lineWidth,
    setLineWidth,
    lineColor,
    setLineColor
  };
};
