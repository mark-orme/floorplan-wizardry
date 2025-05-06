import { useEffect } from 'react';
import { Canvas as FabricCanvas } from 'fabric';

interface UseCanvasStateEffectsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
  lineColor: string;
  lineThickness: number;
}

export const useCanvasStateEffects = ({
  fabricCanvasRef,
  lineColor,
  lineThickness
}: UseCanvasStateEffectsProps) => {
  useEffect(() => {
    const updateBrushSettings = () => {
      if (fabricCanvasRef.current && fabricCanvasRef.current.freeDrawingBrush) {
        fabricCanvasRef.current.freeDrawingBrush.color = lineColor;
        fabricCanvasRef.current.freeDrawingBrush.width = lineThickness;
      }
    };
    
    updateBrushSettings();
  }, [fabricCanvasRef, lineColor, lineThickness]);
};
