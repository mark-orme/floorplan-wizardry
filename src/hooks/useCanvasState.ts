import { useState, useRef, useEffect } from 'react';
import { Canvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';

// Update the return type to include the canvasRef property
export interface UseCanvasStateResult {
  canvas: Canvas | null;
  canvasRef: React.RefObject<HTMLCanvasElement>; // Add this property
  tool: DrawingMode;
  setTool: React.Dispatch<React.SetStateAction<DrawingMode>>;
  lineColor: string;
  setLineColor: React.Dispatch<React.SetStateAction<string>>;
  lineThickness: number;
  setLineThickness: React.Dispatch<React.SetStateAction<number>>;
  canvasWidth: number;
  canvasHeight: number;
  setCanvasSize: (width: number, height: number) => void;
  showGrid: boolean;
  setShowGrid: React.Dispatch<React.SetStateAction<boolean>>;
}

export function useCanvasState(): UseCanvasStateResult {
  const [canvas, setCanvas] = useState<Canvas | null>(null);
  const [tool, setTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState<string>('#000000');
  const [lineThickness, setLineThickness] = useState<number>(2);
  const [canvasWidth, setCanvasWidth] = useState<number>(800);
  const [canvasHeight, setCanvasHeight] = useState<number>(600);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const setCanvasSize = (width: number, height: number) => {
    setCanvasWidth(width);
    setCanvasHeight(height);
    if (canvas) {
      canvas.setWidth(width);
      canvas.setHeight(height);
      canvas.requestRenderAll();
    }
  };
  
  return {
    canvas,
    canvasRef, // Now this is properly typed in the return type
    tool,
    setTool,
    lineColor,
    setLineColor,
    lineThickness,
    setLineThickness,
    canvasWidth,
    canvasHeight,
    setCanvasSize,
    showGrid,
    setShowGrid
  };
}
