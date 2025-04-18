
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Canvas as FabricCanvas } from 'fabric';
import { trackLineThickness } from "@/utils/fabricBrush";

interface UseLineSettingsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineThickness?: number;
  lineColor?: string;
  setLineThickness?: React.Dispatch<React.SetStateAction<number>>;
  setLineColor?: React.Dispatch<React.SetStateAction<string>>;
}

export const useLineSettings = ({ 
  fabricCanvasRef,
  lineThickness,
  lineColor,
  setLineThickness,
  setLineColor
}: UseLineSettingsProps) => {
  const handleLineThicknessChange = useCallback((thickness: number) => {
    if (setLineThickness) {
      setLineThickness(thickness);
    }
    
    if (fabricCanvasRef.current?.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.width = thickness;
      if (typeof trackLineThickness === 'function') {
        trackLineThickness(fabricCanvasRef.current, thickness);
      }
      toast.success(`Line thickness set to ${thickness}px`);
    }
  }, [fabricCanvasRef, setLineThickness]);

  const handleLineColorChange = useCallback((color: string) => {
    if (setLineColor) {
      setLineColor(color);
    }
    
    if (fabricCanvasRef.current?.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = color;
      toast.success('Line color updated');
    }
  }, [fabricCanvasRef, setLineColor]);

  // Add the applyLineSettings method to apply current settings to the canvas
  const applyLineSettings = useCallback(() => {
    if (!fabricCanvasRef.current?.freeDrawingBrush) return;
    
    if (lineThickness !== undefined) {
      fabricCanvasRef.current.freeDrawingBrush.width = lineThickness;
      if (typeof trackLineThickness === 'function') {
        trackLineThickness(fabricCanvasRef.current, lineThickness);
      }
    }
    
    if (lineColor !== undefined) {
      fabricCanvasRef.current.freeDrawingBrush.color = lineColor;
    }
  }, [fabricCanvasRef, lineThickness, lineColor]);

  return {
    handleLineThicknessChange,
    handleLineColorChange,
    applyLineSettings
  };
};
