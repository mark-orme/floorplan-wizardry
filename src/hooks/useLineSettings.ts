
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Canvas as FabricCanvas } from 'fabric';

interface UseLineSettingsProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
}

export const useLineSettings = ({ fabricCanvasRef }: UseLineSettingsProps) => {
  const handleLineThicknessChange = useCallback((thickness: number) => {
    if (fabricCanvasRef.current?.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.width = thickness;
      toast.success(`Line thickness set to ${thickness}px`);
    }
  }, [fabricCanvasRef]);

  const handleLineColorChange = useCallback((color: string) => {
    if (fabricCanvasRef.current?.freeDrawingBrush) {
      fabricCanvasRef.current.freeDrawingBrush.color = color;
      toast.success('Line color updated');
    }
  }, [fabricCanvasRef]);

  return {
    handleLineThicknessChange,
    handleLineColorChange
  };
};
