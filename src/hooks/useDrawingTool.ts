
import { useCallback, useEffect, useState } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingMode } from '@/constants/drawingModes';
import { toast } from 'sonner';

interface UseDrawingToolProps {
  canvasRef: React.MutableRefObject<FabricCanvas | null>;
}

export const useDrawingTool = ({ canvasRef }: UseDrawingToolProps) => {
  const [activeTool, setActiveTool] = useState<DrawingMode>(DrawingMode.SELECT);
  const [lineColor, setLineColor] = useState('#000000');
  const [lineThickness, setLineThickness] = useState(2);
  
  const selectTool = useCallback((tool: DrawingMode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.isDrawingMode = tool === DrawingMode.DRAW;
    canvas.selection = tool === DrawingMode.SELECT;
    
    if (tool === DrawingMode.DRAW && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = lineColor;
      canvas.freeDrawingBrush.width = lineThickness;
    }
    
    setActiveTool(tool);
    toast.info(`Selected ${tool} tool`);
  }, [canvasRef, lineColor, lineThickness]);
  
  const updateToolSettings = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.freeDrawingBrush) return;
    
    canvas.freeDrawingBrush.color = lineColor;
    canvas.freeDrawingBrush.width = lineThickness;
  }, [canvasRef, lineColor, lineThickness]);
  
  useEffect(() => {
    updateToolSettings();
  }, [updateToolSettings, lineColor, lineThickness]);
  
  const setColor = useCallback((color: string) => {
    setLineColor(color);
  }, []);
  
  const setThickness = useCallback((thickness: number) => {
    setLineThickness(thickness);
  }, []);
  
  const createShape = useCallback((type: 'rect' | 'circle' | 'text') => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    let shape;
    
    if (type === 'rect') {
      shape = new fabric.Rect({
        left: 100,
        top: 100,
        width: 100,
        height: 100,
        fill: lineColor,
        stroke: lineColor,
        strokeWidth: 1
      });
    } else if (type === 'circle') {
      shape = new fabric.Circle({
        left: 100,
        top: 100,
        radius: 50,
        fill: lineColor,
        stroke: lineColor,
        strokeWidth: 1
      });
    } else if (type === 'text') {
      shape = new fabric.Text('Text', {
        left: 100,
        top: 100,
        fontSize: 20,
        fill: lineColor
      });
    }
    
    if (shape) {
      canvas.add(shape);
      canvas.setActiveObject(shape);
      canvas.renderAll();
    }
  }, [canvasRef, lineColor]);
  
  // Fix the arguments to empty string instead of null
  const addText = useCallback((text = '', left = 100, top = 100) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const textObj = new fabric.Text(text || 'Text', {
      left,
      top,
      fontSize: 20,
      fill: lineColor
    });
    
    canvas.add(textObj);
    canvas.setActiveObject(textObj);
    canvas.renderAll();
  }, [canvasRef, lineColor]);
  
  return {
    activeTool,
    lineColor,
    lineThickness,
    selectTool,
    setColor,
    setThickness,
    createShape,
    addText
  };
};

export default useDrawingTool;
