
import { useCallback } from 'react';
import { DrawingLayer } from '../types/DrawingLayer';
import { UnifiedCanvas } from '@/types/unified-canvas';

interface UseLayerLockingProps {
  fabricCanvasRef: React.MutableRefObject<UnifiedCanvas | null>;
  setLayers: React.Dispatch<React.SetStateAction<DrawingLayer[]>>;
}

export const useLayerLocking = ({ fabricCanvasRef, setLayers }: UseLayerLockingProps) => {
  const toggleLayerLock = useCallback((layerId: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    setLayers(prevLayers => {
      const updatedLayers = prevLayers.map(layer => {
        if (layer.id === layerId) {
          const newLockState = !layer.locked;
          
          layer.objects.forEach(obj => {
            if (obj) {
              (obj as any).selectable = !newLockState;
              (obj as any).evented = !newLockState;
            }
          });
          
          return {
            ...layer,
            locked: newLockState
          };
        }
        return layer;
      });
      
      canvas.requestRenderAll();
      return updatedLayers;
    });
  }, [fabricCanvasRef, setLayers]);

  return { toggleLayerLock };
};
