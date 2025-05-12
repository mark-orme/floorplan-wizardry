
import { useCallback } from 'react';
import { Object as FabricObject } from 'fabric';
import { DrawingLayer } from '../types/DrawingLayer';
import { UnifiedCanvas } from '@/types/unified-canvas';

interface UseLayerOperationsProps {
  fabricCanvasRef: React.MutableRefObject<UnifiedCanvas | null>;
  layers: DrawingLayer[];
  setLayers: React.Dispatch<React.SetStateAction<DrawingLayer[]>>;
  activeLayerId: string;
  setActiveLayerId: React.Dispatch<React.SetStateAction<string>>;
}

export const useLayerOperations = ({
  fabricCanvasRef,
  layers,
  setLayers,
  activeLayerId,
  setActiveLayerId
}: UseLayerOperationsProps) => {
  const createNewLayer = useCallback(() => {
    const newLayerId = `layer-${Date.now()}`;
    const newLayerName = `Layer ${layers.length + 1}`;
    
    setLayers(prevLayers => [
      ...prevLayers,
      {
        id: newLayerId,
        name: newLayerName,
        visible: true,
        locked: false,
        objects: []
      }
    ]);
    
    setActiveLayerId(newLayerId);
  }, [layers.length, setLayers, setActiveLayerId]);
  
  const deleteLayer = useCallback((layerId: string) => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    
    const layerToDelete = layers.find(layer => layer.id === layerId);
    if (!layerToDelete) return;
    
    // Make sure we safely access objects array
    if (layerToDelete.objects && Array.isArray(layerToDelete.objects)) {
      layerToDelete.objects.forEach(obj => {
        if (obj && canvas) {
          try {
            canvas.remove(obj as FabricObject);
          } catch (err) {
            console.error('Error removing object from canvas:', err);
          }
        }
      });
    }
    
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== layerId));
    
    if (activeLayerId === layerId) {
      const remainingLayers = layers.filter(layer => layer.id !== layerId);
      if (remainingLayers.length > 0) {
        setActiveLayerId(remainingLayers[0]?.id || '');
      }
    }
    
    if (canvas && canvas.requestRenderAll) {
      canvas.requestRenderAll();
    }
  }, [fabricCanvasRef, layers, activeLayerId, setLayers, setActiveLayerId]);

  return { createNewLayer, deleteLayer };
};
