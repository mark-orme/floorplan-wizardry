
import { useCallback } from 'react';
import { DrawingLayer } from '../types/DrawingLayer';
import { UnifiedCanvas } from '@/types/unified-canvas';

interface UseLayerVisibilityProps {
  fabricCanvasRef: React.MutableRefObject<UnifiedCanvas | null>;
  setLayers: React.Dispatch<React.SetStateAction<DrawingLayer[]>>;
}

export const useLayerVisibility = ({ fabricCanvasRef, setLayers }: UseLayerVisibilityProps) => {
  const toggleLayerVisibility = useCallback((layerId: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    setLayers(prevLayers => {
      const updatedLayers = prevLayers.map(layer => {
        if (layer.id === layerId) {
          const newVisibility = !layer.visible;
          
          layer.objects.forEach(obj => {
            if (obj) {
              (obj as any).visible = newVisibility;
            }
          });
          
          return {
            ...layer,
            visible: newVisibility
          };
        }
        return layer;
      });
      
      canvas.requestRenderAll();
      return updatedLayers;
    });
  }, [fabricCanvasRef, setLayers]);

  return { toggleLayerVisibility };
};
