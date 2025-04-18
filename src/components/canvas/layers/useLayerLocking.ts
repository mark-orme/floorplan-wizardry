
import { useCallback } from 'react';
import { Canvas as FabricCanvas } from 'fabric';
import { DrawingLayer } from '../types/DrawingLayer';

interface UseLayerLockingProps {
  fabricCanvasRef: React.MutableRefObject<FabricCanvas | null>;
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
            obj.set('selectable', !newLockState);
            obj.set('evented', !newLockState);
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

